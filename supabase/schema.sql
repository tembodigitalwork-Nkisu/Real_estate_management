-- ============================================================================
-- Real Estate Management — database schema
-- Run this in the Supabase SQL editor (Dashboard > SQL Editor > New query).
-- It is safe to re-run: it drops and recreates policies/tables in order.
-- ============================================================================

-- Required extensions ---------------------------------------------------------
create extension if not exists "pgcrypto";       -- gen_random_uuid()

-- ============================================================================
-- ENUM-like check constraints are used instead of true enums so values are
-- easy to extend later without ALTER TYPE migrations.
-- ============================================================================

-- Admins ----------------------------------------------------------------------
-- A user is an admin if their auth.users id appears here. Insert rows manually
-- after a user signs up (see the seed note at the bottom of this file).
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  created_at timestamptz not null default now()
);

-- Helper: is the current request made by an admin?
-- SECURITY DEFINER lets it read public.admins regardless of that table's RLS,
-- which avoids recursive policy evaluation.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

-- Properties ------------------------------------------------------------------
create table if not exists public.properties (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text unique,
  description   text,
  property_type text not null default 'house'
                  check (property_type in ('house','apartment','land','commercial','office','townhouse')),
  listing_type  text not null default 'sale'
                  check (listing_type in ('sale','rent')),
  status        text not null default 'draft'
                  check (status in ('draft','published','archived')),
  price         numeric(14,2) not null default 0,
  currency      text not null default 'ZMW',
  bedrooms      int,
  bathrooms     int,
  area_sqm      numeric(10,2),
  address       text,
  city          text,
  province      text,
  latitude      numeric(9,6),
  longitude     numeric(9,6),
  featured      boolean not null default false,
  images        text[] not null default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists properties_status_idx       on public.properties(status);
create index if not exists properties_listing_type_idx on public.properties(listing_type);
create index if not exists properties_city_idx         on public.properties(city);

-- Tenants ---------------------------------------------------------------------
create table if not exists public.tenants (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  email       text,
  phone       text,
  national_id text,
  notes       text,
  created_at  timestamptz not null default now()
);

-- Leases ----------------------------------------------------------------------
create table if not exists public.leases (
  id          uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  tenant_id   uuid not null references public.tenants(id) on delete cascade,
  start_date  date not null,
  end_date    date,
  rent_amount numeric(14,2) not null default 0,
  currency    text not null default 'ZMW',
  deposit     numeric(14,2) not null default 0,
  status      text not null default 'active'
                check (status in ('pending','active','ended','terminated')),
  created_at  timestamptz not null default now()
);

create index if not exists leases_property_idx on public.leases(property_id);
create index if not exists leases_tenant_idx   on public.leases(tenant_id);

-- Maintenance requests --------------------------------------------------------
create table if not exists public.maintenance_requests (
  id          uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  tenant_id   uuid references public.tenants(id) on delete set null,
  title       text not null,
  description text,
  priority    text not null default 'medium'
                check (priority in ('low','medium','high','urgent')),
  status      text not null default 'open'
                check (status in ('open','in_progress','resolved','cancelled')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists maintenance_property_idx on public.maintenance_requests(property_id);
create index if not exists maintenance_status_idx   on public.maintenance_requests(status);

-- Enquiries (leads from the public contact form) ------------------------------
create table if not exists public.enquiries (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text,
  phone       text,
  message     text not null,
  property    text,            -- title of the property the lead asked about
  status      text not null default 'new'
                check (status in ('new','contacted','closed')),
  created_at  timestamptz not null default now()
);

create index if not exists enquiries_status_idx on public.enquiries(status);

-- updated_at trigger ----------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

drop trigger if exists maintenance_set_updated_at on public.maintenance_requests;
create trigger maintenance_set_updated_at
  before update on public.maintenance_requests
  for each row execute function public.set_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.admins               enable row level security;
alter table public.properties           enable row level security;
alter table public.tenants              enable row level security;
alter table public.leases               enable row level security;
alter table public.maintenance_requests enable row level security;
alter table public.enquiries            enable row level security;

-- admins: a user can see their own admin row; admins can manage the table.
drop policy if exists admins_select_self on public.admins;
create policy admins_select_self on public.admins
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists admins_manage on public.admins;
create policy admins_manage on public.admins
  for all using (public.is_admin()) with check (public.is_admin());

-- properties: public can read PUBLISHED listings; admins do everything.
drop policy if exists properties_public_read on public.properties;
create policy properties_public_read on public.properties
  for select using (status = 'published' or public.is_admin());

drop policy if exists properties_admin_write on public.properties;
create policy properties_admin_write on public.properties
  for all using (public.is_admin()) with check (public.is_admin());

-- tenants / leases / maintenance: admin-only across the board.
drop policy if exists tenants_admin_all on public.tenants;
create policy tenants_admin_all on public.tenants
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists leases_admin_all on public.leases;
create policy leases_admin_all on public.leases
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists maintenance_admin_all on public.maintenance_requests;
create policy maintenance_admin_all on public.maintenance_requests
  for all using (public.is_admin()) with check (public.is_admin());

-- enquiries: anyone (anon) may submit a lead; only admins can read/manage them.
drop policy if exists enquiries_public_insert on public.enquiries;
create policy enquiries_public_insert on public.enquiries
  for insert with check (true);

drop policy if exists enquiries_admin_read on public.enquiries;
create policy enquiries_admin_read on public.enquiries
  for select using (public.is_admin());

drop policy if exists enquiries_admin_update on public.enquiries;
create policy enquiries_admin_update on public.enquiries
  for update using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- AFTER FIRST SIGN-UP: promote yourself to admin.
-- 1. Create a user in Dashboard > Authentication > Users (or sign up in-app).
-- 2. Copy that user's UUID and run:
--      insert into public.admins (user_id, full_name)
--      values ('PASTE-USER-UUID-HERE', 'Your Name');
-- ============================================================================
