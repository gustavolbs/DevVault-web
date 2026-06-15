create table public.sync_snapshots (
  "userId" uuid primary key references auth.users(id) on delete cascade,
  version bigint not null check (version > 0),
  "schemaVersion" integer not null check ("schemaVersion" = 1),
  algorithm text not null check (algorithm = 'aes-256-gcm'),
  "keyId" text not null,
  iv text not null,
  "authTag" text not null,
  ciphertext text not null,
  "ciphertextSha256" text not null,
  "deviceId" text not null,
  "payloadBytes" integer not null check ("payloadBytes" between 1 and 8388608),
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

alter table public.sync_snapshots enable row level security;

create policy "Users can read their own sync snapshot"
  on public.sync_snapshots for select to authenticated
  using ((select auth.uid()) = "userId");

create function public.put_sync_snapshot(
  p_user_id uuid,
  p_expected_version bigint,
  p_schema_version integer,
  p_algorithm text,
  p_key_id text,
  p_iv text,
  p_auth_tag text,
  p_ciphertext text,
  p_ciphertext_sha256 text,
  p_device_id text,
  p_payload_bytes integer
)
returns jsonb
language plpgsql
security definer set search_path = ''
as $$
declare
  current_snapshot public.sync_snapshots%rowtype;
  next_version bigint;
begin
  select * into current_snapshot from public.sync_snapshots where "userId" = p_user_id for update;

  if found and current_snapshot."ciphertextSha256" = p_ciphertext_sha256 then
    return jsonb_build_object('result', 'idempotent', 'version', current_snapshot.version, 'updatedAt', current_snapshot."updatedAt");
  end if;

  if (not found and p_expected_version <> 0) or (found and current_snapshot.version <> p_expected_version) then
    return jsonb_build_object(
      'result', 'conflict',
      'version', coalesce(current_snapshot.version, 0),
      'schemaVersion', current_snapshot."schemaVersion",
      'keyId', current_snapshot."keyId",
      'deviceId', current_snapshot."deviceId",
      'payloadBytes', current_snapshot."payloadBytes",
      'updatedAt', current_snapshot."updatedAt"
    );
  end if;

  next_version := p_expected_version + 1;
  insert into public.sync_snapshots (
    "userId", version, "schemaVersion", algorithm, "keyId", iv, "authTag", ciphertext,
    "ciphertextSha256", "deviceId", "payloadBytes"
  ) values (
    p_user_id, next_version, p_schema_version, p_algorithm, p_key_id, p_iv, p_auth_tag, p_ciphertext,
    p_ciphertext_sha256, p_device_id, p_payload_bytes
  )
  on conflict ("userId") do update set
    version = excluded.version,
    "schemaVersion" = excluded."schemaVersion",
    algorithm = excluded.algorithm,
    "keyId" = excluded."keyId",
    iv = excluded.iv,
    "authTag" = excluded."authTag",
    ciphertext = excluded.ciphertext,
    "ciphertextSha256" = excluded."ciphertextSha256",
    "deviceId" = excluded."deviceId",
    "payloadBytes" = excluded."payloadBytes",
    "updatedAt" = now();

  return jsonb_build_object('result', 'updated', 'version', next_version, 'updatedAt', now());
end;
$$;

revoke all on function public.put_sync_snapshot(uuid, bigint, integer, text, text, text, text, text, text, text, integer) from public, anon, authenticated;
grant execute on function public.put_sync_snapshot(uuid, bigint, integer, text, text, text, text, text, text, text, integer) to service_role;
