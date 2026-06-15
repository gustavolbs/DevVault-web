create table public.licenses (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid not null references auth.users(id) on delete cascade,
  "licenseKey" text not null unique,
  status text not null default 'active' check (status in ('active', 'expired', 'revoked')),
  plan text not null default 'pro' check (plan in ('pro')),
  "activatedDeviceId" text,
  "activatedAt" timestamptz,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  unique ("userId", plan)
);

alter table public.licenses enable row level security;

create policy "Users can read their own licenses"
  on public.licenses for select
  to authenticated
  using ((select auth.uid()) = "userId");

create function public.create_pro_license()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if new.plan = 'pro' and (old.plan is distinct from 'pro') then
    insert into public.licenses ("userId", "licenseKey", status, plan)
    values (
      new.id,
      'DVLT-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 20)),
      'active',
      'pro'
    )
    on conflict ("userId", plan) do nothing;
  end if;
  return new;
end;
$$;

create trigger on_profile_upgraded_to_pro
  after update of plan on public.profiles
  for each row execute procedure public.create_pro_license();

insert into public.licenses ("userId", "licenseKey", status, plan)
select
  id,
  'DVLT-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 20)),
  'active',
  'pro'
from public.profiles
where plan = 'pro'
on conflict ("userId", plan) do nothing;
