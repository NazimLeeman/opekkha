-- Share-card storage bucket + notification job helper indexes.
-- Apply in Supabase SQL editor if CLI is unavailable.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'share-cards',
  'share-cards',
  false,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do nothing;

-- Owners can read their own share-card objects: path starts with "{user_id}/"
create policy "Share card owners read own objects"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'share-cards'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Share card owners insert own objects"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'share-cards'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Share card owners update own objects"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'share-cards'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'share-cards'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Share card owners delete own objects"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'share-cards'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Rate-limit helper view: recent report counts per reporter (last hour)
create index if not exists reports_reporter_created_idx
  on public.reports (reporter_id, created_at desc);

create index if not exists letter_events_actor_created_idx
  on public.letter_events (actor_id, created_at desc);
