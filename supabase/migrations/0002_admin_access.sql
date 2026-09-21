-- Admin access to service_requests.
--
-- Until now the table was write-only: the public key could INSERT and nothing
-- else, and leads were read in the Supabase dashboard. This adds a way in for
-- one named person, and nothing wider.
--
-- The rule that must survive every future change: **never grant SELECT to
-- `anon`.** The publishable key is in the page source of a public marketing
-- site, so an anon SELECT policy hands every lead, with phone numbers, to
-- anyone who opens DevTools.

-- Who counts as an admin. A table rather than a hardcoded address in a policy,
-- so changing hands is one row instead of a migration.
create table if not exists public.app_admins (
  email    text primary key,
  added_at timestamptz not null default now()
);

alter table public.app_admins enable row level security;
-- Deliberately no policies. Only the service role and the Supabase dashboard
-- can read or change this table, which means a signed-in admin cannot add
-- another admin by talking to the API.

-- SECURITY DEFINER is load-bearing: app_admins has RLS on with no policies, so
-- a plain function running as the caller would see zero rows and every admin
-- check would quietly fail closed.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.app_admins
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke execute on function public.is_admin() from anon;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "Admins can read requests" on public.service_requests;
create policy "Admins can read requests"
  on public.service_requests
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can update requests" on public.service_requests;
create policy "Admins can update requests"
  on public.service_requests
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- RLS decides which rows; column grants decide which fields. An admin moves a
-- request through its statuses and writes notes, and cannot rewrite the brief
-- the customer actually sent, or its reference, or when it arrived.
revoke update on public.service_requests from authenticated;
grant update (status, notes) on public.service_requests to authenticated;

-- Still nobody's to delete. Losing a lead should take a deliberate trip to the
-- dashboard, not a misclick.
revoke delete on public.service_requests from anon, authenticated;
