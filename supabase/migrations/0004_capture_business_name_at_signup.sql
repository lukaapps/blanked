-- Signup now collects a separate "Display / Brand Name" alongside the
-- account holder's full name. Reuses the existing business_name column
-- (added in 0001 for Landlord accounts) for Chef/Brand accounts too.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, email, name, account_type,
    role, bio, instagram, website, business_name,
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
    new.raw_user_meta_data ->> 'business_name',
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
