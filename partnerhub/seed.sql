-- ======================================================================
-- 1. SEED DUMMY DATA
-- ======================================================================

-- Temporarily drop the foreign key constraint on profiles so we can insert dummy users
alter table public.profiles drop constraint if exists profiles_id_fkey;

-- Insert dummy profiles first (to satisfy foreign key constraints for partners)
insert into public.profiles (id, full_name, role)
values 
  ('11111111-1111-1111-1111-111111111111', 'Abhishek Gupta', 'admin'),
  ('22222222-2222-2222-2222-222222222222', 'Rishabh Verma', 'member')
on conflict (id) do nothing;

-- Insert Partners
insert into public.partners (id, name, type, stage, pipeline_value, website, description, assigned_to, next_followup, created_at)
values
  ('b0e2f5f1-3323-4554-b337-3cf14a1e9e30', 'Educate Girls', 'ngo', 'active_partner', 500000, 'https://www.educategirls.ngo', 'NGO focused on advancing girls education in rural India.', '11111111-1111-1111-1111-111111111111', '2026-04-15', '2025-06-10T10:00:00Z'),
  ('c4a63118-e9f0-4fa3-94c6-c956dc7a3b31', 'Pratham Education Foundation', 'ngo', 'active_partner', 750000, 'https://www.pratham.org', 'One of the largest education NGOs in India. Helps identify students.', '11111111-1111-1111-1111-111111111111', '2026-04-20', '2025-03-15T09:00:00Z'),
  ('d88d22f1-ab32-4114-8fcd-9b932c028e32', 'Amazon India', 'corporate', 'active_partner', 5000000, 'https://www.amazon.in', 'Major CSR partner providing funding and internship opportunities.', '11111111-1111-1111-1111-111111111111', '2026-04-10', '2024-11-01T10:00:00Z'),
  ('e101cf10-1a22-4a0b-8d5f-1491ff298b33', 'Accenture', 'corporate', 'proposal_sent', 3000000, 'https://www.accenture.com', 'Exploring CSR partnership for digital skills training.', '22222222-2222-2222-2222-222222222222', '2026-04-08', '2026-01-15T10:00:00Z'),
  ('f7c32bf1-912a-4345-bc24-811c79e4eb34', 'KPMG India', 'corporate', 'in_discussion', 2500000, 'https://kpmg.com/in', 'In discussion for CSR partnership focused on women in tech.', '22222222-2222-2222-2222-222222222222', '2026-04-12', '2026-02-01T10:00:00Z'),
  ('a1cf130e-561b-4f4c-b033-0182bc879a35', 'Microsoft Philanthropies', 'corporate', 'active_partner', 4000000, 'https://www.microsoft.com/en-us/philanthropies', 'Providing technology grants and placement opportunities.', '11111111-1111-1111-1111-111111111111', '2026-04-25', '2025-01-10T10:00:00Z')
on conflict (id) do nothing;

-- Insert Contacts
insert into public.contacts (id, partner_id, name, email, phone, designation, is_primary)
values
  ('11bf150e-5b1a-4c22-b033-0482bc879a11', 'b0e2f5f1-3323-4554-b337-3cf14a1e9e30', 'Safeena Husain', 'safeena@educategirls.ngo', '+91-98765-43210', 'Founder & CEO', true),
  ('22bf150e-5b1a-4c22-b033-0482bc879a22', 'd88d22f1-ab32-4114-8fcd-9b932c028e32', 'Priya Sharma', 'priya.sharma@amazon.com', '+91-98765-43212', 'CSR Head - India', true),
  ('33bf150e-5b1a-4c22-b033-0482bc879a33', 'f7c32bf1-912a-4345-bc24-811c79e4eb34', 'Rajeev Menon', 'rajeev.menon@kpmg.com', '+91-98765-43215', 'Partner - CSR', true)
on conflict (id) do nothing;


-- ======================================================================
-- 2. FIX RLS FOR DEMO / INTERVIEW PURPOSES
-- This allows you to interact with the database using the anon key
-- without having to configure complex Supabase Authentication login screens
-- ======================================================================

-- Drop existing restrictive policies
drop policy if exists "Authenticated users can view partners" on public.partners;
drop policy if exists "Authenticated users can insert partners" on public.partners;
drop policy if exists "Authenticated users can update partners" on public.partners;
drop policy if exists "Authenticated users can delete partners" on public.partners;

drop policy if exists "Authenticated users can view contacts" on public.contacts;
drop policy if exists "Authenticated users can insert contacts" on public.contacts;
drop policy if exists "Authenticated users can update contacts" on public.contacts;
drop policy if exists "Authenticated users can delete contacts" on public.contacts;

drop policy if exists "Authenticated users can view activities" on public.activities;
drop policy if exists "Authenticated users can insert activities" on public.activities;

drop policy if exists "Authenticated users can view followups" on public.followups;
drop policy if exists "Authenticated users can insert followups" on public.followups;
drop policy if exists "Authenticated users can update followups" on public.followups;

-- Create open policies for demonstration
create policy "Anon can view partners" on public.partners for select using (true);
create policy "Anon can insert partners" on public.partners for insert with check (true);
create policy "Anon can update partners" on public.partners for update using (true);
create policy "Anon can delete partners" on public.partners for delete using (true);

create policy "Anon can view contacts" on public.contacts for select using (true);
create policy "Anon can insert contacts" on public.contacts for insert with check (true);
create policy "Anon can update contacts" on public.contacts for update using (true);
create policy "Anon can delete contacts" on public.contacts for delete using (true);

create policy "Anon can view activities" on public.activities for select using (true);
create policy "Anon can insert activities" on public.activities for insert with check (true);

create policy "Anon can view followups" on public.followups for select using (true);
create policy "Anon can insert followups" on public.followups for insert with check (true);
create policy "Anon can update followups" on public.followups for update using (true);
