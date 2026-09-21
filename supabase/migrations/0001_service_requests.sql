-- Service requests from the public site.
--
-- The public may INSERT and nothing else: a stranger can send a request but
-- cannot read anyone's, including their own. Reading is done from the Supabase
-- dashboard, or later from an authenticated admin screen, and both of those go
-- through a policy added at that point rather than a hole left open now.

create table if not exists public.service_requests (
  id            bigint generated always as identity primary key,

  -- A short human reference so a request can be quoted over WhatsApp.
  -- KDX-8FQ2P1 style: readable on a phone, unambiguous when read aloud.
  reference     text not null unique
                default 'KDX-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6)),

  service_slug  text not null,
  service_title text not null,

  name          text not null check (length(btrim(name)) between 2 and 80),
  business      text          check (business is null or length(business) <= 120),
  contact       text not null check (length(btrim(contact)) between 6 and 60),
  brief         text          check (brief is null or length(brief) <= 2000),

  -- Set by us, never by the visitor.
  status        text not null default 'new'
                check (status in ('new', 'contacted', 'quoted', 'won', 'lost')),
  notes         text,

  created_at    timestamptz not null default now()
);

create index if not exists service_requests_created_idx
  on public.service_requests (created_at desc);

create index if not exists service_requests_status_idx
  on public.service_requests (status);

alter table public.service_requests enable row level security;

-- Anyone may send a request.
drop policy if exists "Anyone can submit a request" on public.service_requests;
create policy "Anyone can submit a request"
  on public.service_requests
  for insert
  to anon, authenticated
  with check (true);

-- Deliberately no SELECT, UPDATE or DELETE policy. Without one, RLS denies
-- them to every client using the anon key, which is the whole point: the form
-- is a letterbox, not a filing cabinet with the key left in it.
