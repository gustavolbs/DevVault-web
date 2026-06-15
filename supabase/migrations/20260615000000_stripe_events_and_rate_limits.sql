create table public.stripe_webhook_events (
  "eventId" text primary key,
  "eventType" text not null,
  "processedAt" timestamptz not null default now()
);

alter table public.profiles add column "stripeEventCreatedAt" timestamptz;

alter table public.stripe_webhook_events enable row level security;

create function public.process_stripe_license_event(
  p_event_id text,
  p_event_type text,
  p_user_id uuid,
  p_customer_id text,
  p_action text,
  p_event_created_at timestamptz
)
returns boolean
language plpgsql
security definer set search_path = ''
as $$
declare
  profile_updated integer;
begin
  if p_action not in ('activate', 'expire', 'revoke') then
    raise exception 'invalid stripe license action';
  end if;

  insert into public.stripe_webhook_events ("eventId", "eventType")
  values (p_event_id, p_event_type)
  on conflict ("eventId") do nothing;
  if not found then return false; end if;

  update public.profiles
  set
    plan = case when p_action = 'activate' then 'pro' else 'free' end,
    "licenseStatus" = case when p_action = 'activate' then 'active' when p_action = 'expire' then 'expired' else 'revoked' end,
    "stripeCustomerId" = coalesce(p_customer_id, "stripeCustomerId"),
    updated_at = now(),
    "stripeEventCreatedAt" = p_event_created_at
  where id = p_user_id
    and ("stripeEventCreatedAt" is null or "stripeEventCreatedAt" <= p_event_created_at);

  get diagnostics profile_updated = row_count;
  if profile_updated = 0 then return true; end if;

  update public.licenses
  set
    status = case when p_action = 'activate' then 'active' when p_action = 'expire' then 'expired' else 'revoked' end,
    "activatedDeviceId" = case when p_action = 'activate' then "activatedDeviceId" else null end,
    "activatedAt" = case when p_action = 'activate' then "activatedAt" else null end,
    "updatedAt" = now()
  where "userId" = p_user_id and plan = 'pro';

  return true;
end;
$$;

revoke all on function public.process_stripe_license_event(text, text, uuid, text, text, timestamptz) from public, anon, authenticated;
grant execute on function public.process_stripe_license_event(text, text, uuid, text, text, timestamptz) to service_role;

create table public.api_rate_limits (
  key text primary key,
  count integer not null,
  "windowStartedAt" timestamptz not null,
  "updatedAt" timestamptz not null default now()
);

alter table public.api_rate_limits enable row level security;

create function public.consume_api_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer set search_path = ''
as $$
declare
  allowed boolean;
begin
  insert into public.api_rate_limits (key, count, "windowStartedAt")
  values (p_key, 1, now())
  on conflict (key) do update set
    count = case
      when public.api_rate_limits."windowStartedAt" <= now() - make_interval(secs => p_window_seconds) then 1
      else public.api_rate_limits.count + 1
    end,
    "windowStartedAt" = case
      when public.api_rate_limits."windowStartedAt" <= now() - make_interval(secs => p_window_seconds) then now()
      else public.api_rate_limits."windowStartedAt"
    end,
    "updatedAt" = now()
  returning count <= p_limit into allowed;
  return allowed;
end;
$$;

revoke all on function public.consume_api_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_api_rate_limit(text, integer, integer) to service_role;
