-- Blanked initial schema
-- Mirrors "11. BACK-END REQUIREMENTS" in the website blueprint.
-- Run this in the Supabase SQL editor (or `supabase db push` once the CLI is linked).

-- ============================================================
-- Enums
-- ============================================================
create type account_type as enum ('chef', 'landlord');
create type space_status as enum ('pending', 'live', 'inactive');
create type space_type as enum (
  'Restaurant Residency',
  'Shared Space',
  'Market Spot',
  'Event & Retail Space'
);
create type booking_status as enum (
  'pending', 'accepted', 'declined', 'confirmed', 'completed', 'cancelled'
);
create type event_status as enum ('draft', 'live', 'sold_out', 'past');

-- ============================================================
-- Profiles (1:1 with auth.users)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  account_type account_type not null default 'chef',
  name text not null default '',
  email text not null default '',
  is_admin boolean not null default false,
  -- Chef/Brand fields
  bio text,
  role text,
  instagram text,
  photo_url text,
  space_type_preferences text[] not null default '{}',
  visible_to_landlords boolean not null default false,
  -- Landlord fields
  business_name text,
  contact_phone text,
  abn text,
  licence text,
  created_at timestamptz not null default now(),
  last_login timestamptz
);

-- Admin check that avoids RLS recursion on profiles
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- Auto-create a profile row on signup, reading metadata from the signup call
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, account_type)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    coalesce((new.raw_user_meta_data ->> 'account_type')::account_type, 'chef')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Chef directory profiles (admin-managed; optional login link)
-- ============================================================
create table public.chef_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  slug text unique not null,
  name text not null,
  role text,
  bio text,
  quote text,
  portrait_url text,
  instagram text,
  space_type_preferences text[] not null default '{}',
  location_preferences text[] not null default '{}',
  featured boolean not null default false,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Spaces
-- ============================================================
create table public.spaces (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid references public.profiles (id) on delete set null,
  slug text unique not null,
  name text not null,
  type space_type not null,
  suburb text not null,
  full_address text, -- internal only; revealed after booking confirmation
  description text,
  what_can_you_do text,
  capacity integer,
  sqft integer,
  kitchen_facilities text[] not null default '{}',
  equipment_included text[] not null default '{}',
  amenities text[] not null default '{}',
  parking boolean not null default false,
  provides jsonb not null default '[]', -- [{item, price}] e.g. staff / booze / printing / pos
  daily_rate_landlord numeric,          -- what the landlord receives
  daily_rate_listed numeric,            -- listed rate incl. Blanked margin
  weekly_rate numeric,
  monthly_rate numeric,
  min_booking_duration text,
  max_booking_duration text,
  available_from date,
  availability_note text,
  blackout_dates jsonb not null default '[]',
  space_rules text[] not null default '{}',
  images text[] not null default '{}',
  cover_image text,
  featured boolean not null default false,
  status space_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Saved / favourited spaces
-- ============================================================
create table public.saved_spaces (
  user_id uuid not null references public.profiles (id) on delete cascade,
  space_id uuid not null references public.spaces (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, space_id)
);

-- ============================================================
-- Booking requests
-- ============================================================
create table public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  chef_id uuid not null references public.profiles (id) on delete cascade,
  landlord_id uuid references public.profiles (id) on delete set null,
  requested_dates text not null,
  event_description text,
  notes text,
  status booking_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Events (admin-created at launch)
-- ============================================================
create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  chef_profile_id uuid references public.chef_profiles (id) on delete set null,
  space_id uuid references public.spaces (id) on delete set null,
  name text not null,
  description text,
  date date,
  time text,
  suburb text,
  price numeric, -- null = free
  max_capacity integer,
  tickets_sold integer not null default 0,
  hero_image text,
  ticket_url text, -- external ticketing at launch
  status event_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Reviews (space reviews; admin-entered at launch)
-- ============================================================
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces (id) on delete cascade,
  author_user_id uuid references public.profiles (id) on delete set null,
  author_name text not null,
  author_role text,
  rating integer not null check (rating between 1 and 5),
  body text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Chef enquiries ("work with this chef" from landlords)
-- ============================================================
create table public.chef_enquiries (
  id uuid primary key default gen_random_uuid(),
  chef_profile_id uuid not null references public.chef_profiles (id) on delete cascade,
  landlord_id uuid references public.profiles (id) on delete set null,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

-- ============================================================
-- updated_at maintenance
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger spaces_updated_at before update on public.spaces
  for each row execute function public.set_updated_at();
create trigger booking_requests_updated_at before update on public.booking_requests
  for each row execute function public.set_updated_at();
create trigger events_updated_at before update on public.events
  for each row execute function public.set_updated_at();
create trigger chef_profiles_updated_at before update on public.chef_profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- Indexes
-- ============================================================
create index spaces_status_idx on public.spaces (status);
create index spaces_suburb_idx on public.spaces (suburb);
create index spaces_type_idx on public.spaces (type);
create index booking_requests_chef_idx on public.booking_requests (chef_id);
create index booking_requests_space_idx on public.booking_requests (space_id);
create index booking_requests_landlord_idx on public.booking_requests (landlord_id);
create index events_status_date_idx on public.events (status, date);
create index reviews_space_idx on public.reviews (space_id);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.chef_profiles enable row level security;
alter table public.spaces enable row level security;
alter table public.saved_spaces enable row level security;
alter table public.booking_requests enable row level security;
alter table public.events enable row level security;
alter table public.reviews enable row level security;
alter table public.chef_enquiries enable row level security;

-- profiles
create policy "own profile read" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "own profile update" on public.profiles
  for update using (auth.uid() = id or public.is_admin());
create policy "public chef profiles read" on public.profiles
  for select using (account_type = 'chef' and visible_to_landlords = true);

-- chef_profiles: public directory
create policy "visible chef profiles read" on public.chef_profiles
  for select using (visible = true or public.is_admin());
create policy "admin write chef profiles" on public.chef_profiles
  for all using (public.is_admin());

-- spaces
create policy "live spaces are public" on public.spaces
  for select using (status = 'live' or landlord_id = auth.uid() or public.is_admin());
create policy "landlord inserts own space" on public.spaces
  for insert with check (landlord_id = auth.uid());
create policy "landlord updates own space" on public.spaces
  for update using (landlord_id = auth.uid() or public.is_admin());
create policy "admin deletes spaces" on public.spaces
  for delete using (public.is_admin());

-- saved_spaces
create policy "own saved spaces" on public.saved_spaces
  for all using (user_id = auth.uid());

-- booking_requests: visible to the chef who made it + the space's landlord
create policy "participants read booking requests" on public.booking_requests
  for select using (
    chef_id = auth.uid() or landlord_id = auth.uid() or public.is_admin()
  );
create policy "chef creates booking request" on public.booking_requests
  for insert with check (chef_id = auth.uid());
create policy "participants update booking request" on public.booking_requests
  for update using (
    chef_id = auth.uid() or landlord_id = auth.uid() or public.is_admin()
  );

-- events: public when not draft
create policy "published events are public" on public.events
  for select using (status <> 'draft' or public.is_admin());
create policy "admin writes events" on public.events
  for all using (public.is_admin());

-- reviews: public read, admin write at launch
create policy "reviews are public" on public.reviews
  for select using (true);
create policy "admin writes reviews" on public.reviews
  for all using (public.is_admin());

-- chef_enquiries
create policy "landlord creates enquiry" on public.chef_enquiries
  for insert with check (landlord_id = auth.uid());
create policy "own or admin reads enquiries" on public.chef_enquiries
  for select using (landlord_id = auth.uid() or public.is_admin());

-- ============================================================
-- Storage buckets (public read; authenticated upload)
-- ============================================================
insert into storage.buckets (id, name, public)
values
  ('space-photos', 'space-photos', true),
  ('chef-portraits', 'chef-portraits', true),
  ('event-images', 'event-images', true)
on conflict (id) do nothing;

create policy "public read images" on storage.objects
  for select using (bucket_id in ('space-photos', 'chef-portraits', 'event-images'));
create policy "authenticated upload images" on storage.objects
  for insert with check (
    bucket_id in ('space-photos', 'chef-portraits', 'event-images')
    and auth.role() = 'authenticated'
  );
create policy "owner or admin manages images" on storage.objects
  for delete using (
    bucket_id in ('space-photos', 'chef-portraits', 'event-images')
    and (owner = auth.uid() or public.is_admin())
  );
