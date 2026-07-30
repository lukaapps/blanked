-- Expands the profiles table with business details collected at signup
-- and editable from My Profile / Edit Profile (Chef/Brand and Landlord
-- accounts): website, company address, up to 5 gallery photos, and a
-- "how did you hear about us" field captured only at signup.

alter table public.profiles
  add column website text,
  add column address_line text,
  add column address_suburb text,
  add column address_state text,
  add column address_postcode text,
  add column how_heard text,
  add column photos text[] not null default '{}'::text[];

-- Extend the signup trigger to carry the new text fields through from
-- auth signup metadata. Photos picked at signup are passed through as
-- data URLs (the user has no session yet to authenticate a Storage
-- upload against) and can be replaced with real Storage-hosted photos
-- later from Edit Profile, which runs with an authenticated session.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, email, name, account_type,
    role, bio, instagram, website,
    address_line, address_suburb, address_state, address_postcode,
    how_heard, space_type_preferences, photos
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    coalesce((new.raw_user_meta_data ->> 'account_type')::account_type, 'chef'),
    new.raw_user_meta_data ->> 'role',
    new.raw_user_meta_data ->> 'bio',
    new.raw_user_meta_data ->> 'instagram',
    new.raw_user_meta_data ->> 'website',
    new.raw_user_meta_data ->> 'address_line',
    new.raw_user_meta_data ->> 'address_suburb',
    new.raw_user_meta_data ->> 'address_state',
    new.raw_user_meta_data ->> 'address_postcode',
    new.raw_user_meta_data ->> 'how_heard',
    coalesce(
      (select array_agg(value #>> '{}') from jsonb_array_elements(new.raw_user_meta_data -> 'space_type_preferences')),
      '{}'
    ),
    coalesce(
      (select array_agg(value #>> '{}') from jsonb_array_elements(new.raw_user_meta_data -> 'photos')),
      '{}'
    )
  );
  update public.profiles
  set photo_url = photos[1]
  where id = new.id and photos[1] is not null;
  return new;
end;
$$;

-- ============================================================
-- Storage: profile photo galleries (up to 5 per profile)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('profile-photos', 'profile-photos', true)
on conflict (id) do nothing;

create policy "profile photos are publicly readable"
on storage.objects for select
using (bucket_id = 'profile-photos');

create policy "users upload their own profile photos"
on storage.objects for insert
with check (
  bucket_id = 'profile-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "users update their own profile photos"
on storage.objects for update
using (
  bucket_id = 'profile-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "users delete their own profile photos"
on storage.objects for delete
using (
  bucket_id = 'profile-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);
