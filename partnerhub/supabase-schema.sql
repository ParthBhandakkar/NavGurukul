-- PartnerHub Database Schema for Supabase
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  role text default 'member' check (role in ('admin', 'member')),
  avatar_url text,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), 'member');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- PARTNERS
-- ============================================
create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('ngo', 'government', 'corporate', 'placement')),
  stage text default 'lead' check (stage in ('lead', 'contacted', 'in_discussion', 'proposal_sent', 'active_partner', 'closed')),
  pipeline_value numeric default 0,
  website text,
  description text,
  assigned_to uuid references public.profiles(id),
  next_followup date,
  stage_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- CONTACTS
-- ============================================
create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references public.partners(id) on delete cascade not null,
  name text not null,
  email text,
  phone text,
  designation text,
  is_primary boolean default false,
  created_at timestamptz default now()
);

-- ============================================
-- ACTIVITIES
-- ============================================
create table public.activities (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references public.partners(id) on delete cascade not null,
  user_id uuid references public.profiles(id),
  type text not null check (type in ('note', 'call', 'email', 'meeting', 'stage_change', 'followup')),
  title text not null,
  description text,
  created_at timestamptz default now()
);

-- ============================================
-- FOLLOWUPS
-- ============================================
create table public.followups (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references public.partners(id) on delete cascade not null,
  user_id uuid references public.profiles(id),
  due_date date not null,
  title text not null,
  description text,
  is_completed boolean default false,
  created_at timestamptz default now()
);

-- ============================================
-- INDEXES
-- ============================================
create index idx_partners_type on public.partners(type);
create index idx_partners_stage on public.partners(stage);
create index idx_partners_assigned_to on public.partners(assigned_to);
create index idx_contacts_partner_id on public.contacts(partner_id);
create index idx_activities_partner_id on public.activities(partner_id);
create index idx_activities_created_at on public.activities(created_at desc);
create index idx_followups_partner_id on public.followups(partner_id);
create index idx_followups_due_date on public.followups(due_date);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.profiles enable row level security;
alter table public.partners enable row level security;
alter table public.contacts enable row level security;
alter table public.activities enable row level security;
alter table public.followups enable row level security;

-- Policies: all authenticated users can read, admin can write
create policy "Anyone can view profiles" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Authenticated users can view partners" on public.partners for select to authenticated using (true);
create policy "Authenticated users can insert partners" on public.partners for insert to authenticated with check (true);
create policy "Authenticated users can update partners" on public.partners for update to authenticated using (true);
create policy "Authenticated users can delete partners" on public.partners for delete to authenticated using (true);

create policy "Authenticated users can view contacts" on public.contacts for select to authenticated using (true);
create policy "Authenticated users can insert contacts" on public.contacts for insert to authenticated with check (true);
create policy "Authenticated users can update contacts" on public.contacts for update to authenticated using (true);
create policy "Authenticated users can delete contacts" on public.contacts for delete to authenticated using (true);

create policy "Authenticated users can view activities" on public.activities for select to authenticated using (true);
create policy "Authenticated users can insert activities" on public.activities for insert to authenticated with check (true);

create policy "Authenticated users can view followups" on public.followups for select to authenticated using (true);
create policy "Authenticated users can insert followups" on public.followups for insert to authenticated with check (true);
create policy "Authenticated users can update followups" on public.followups for update to authenticated using (true);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_partners_updated_at
  before update on public.partners
  for each row execute function public.handle_updated_at();
