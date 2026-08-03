-- Storage bucket for space listing photos, uploaded during List a Space.
-- Mirrors the profile-photos bucket/policies added in 0003.
insert into storage.buckets (id, name, public)
values ('space-photos', 'space-photos', true)
on conflict (id) do nothing;

create policy "space photos are publicly readable"
on storage.objects for select
using (bucket_id = 'space-photos');

create policy "users upload their own space photos"
on storage.objects for insert
with check (
  bucket_id = 'space-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "users update their own space photos"
on storage.objects for update
using (
  bucket_id = 'space-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "users delete their own space photos"
on storage.objects for delete
using (
  bucket_id = 'space-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);
