-- Phase 4: notification payload + admin report review fields.

alter table public.notification_jobs
  add column if not exists payload jsonb not null default '{}'::jsonb;

alter table public.reports
  add column if not exists reviewed_by uuid references public.profiles (id) on delete set null,
  add column if not exists review_note text;

create index if not exists reports_status_created_idx
  on public.reports (status, created_at desc);

create index if not exists notification_jobs_payload_gin
  on public.notification_jobs using gin (payload);
