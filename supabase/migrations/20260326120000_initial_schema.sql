-- Opekkha MVP initial schema
-- Apply with Supabase CLI or SQL editor. UUID PKs, RLS on every user-owned table.

create extension if not exists "pgcrypto";

-- Enums
create type public.profile_visibility as enum ('private', 'link', 'public');
create type public.letter_status as enum (
  'draft',
  'scheduled',
  'available',
  'opened',
  'revoked',
  'expired'
);
create type public.letter_access_mode as enum ('account', 'private_link');
create type public.opening_rule as enum (
  'immediate',
  'at_datetime',
  'after_interval',
  'recipient_confirmation'
);
create type public.notification_status as enum (
  'pending',
  'processing',
  'sent',
  'failed',
  'cancelled'
);
create type public.share_visibility as enum ('private', 'public');
create type public.report_status as enum ('open', 'reviewing', 'resolved', 'dismissed');

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  username text unique,
  avatar_path text,
  bio text,
  preferred_locale text not null default 'bn',
  timezone text not null default 'Asia/Dhaka',
  profile_visibility public.profile_visibility not null default 'link',
  allow_incoming_notes boolean not null default false,
  public_slug text unique not null default encode(gen_random_bytes(9), 'hex'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_username_idx on public.profiles (username);
create index profiles_public_slug_idx on public.profiles (public_slug);

-- Letters
create table public.letters (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles (id) on delete cascade,
  recipient_id uuid references public.profiles (id) on delete set null,
  recipient_name text,
  title text not null,
  prompt text,
  body text not null default '',
  status public.letter_status not null default 'draft',
  access_mode public.letter_access_mode not null default 'private_link',
  opening_rule public.opening_rule not null default 'immediate',
  opens_at timestamptz,
  sender_timezone text not null default 'Asia/Dhaka',
  scheduled_send_at timestamptz,
  theme_id text,
  sender_label text,
  allow_acknowledgement boolean not null default false,
  opened_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index letters_sender_id_idx on public.letters (sender_id);
create index letters_recipient_id_idx on public.letters (recipient_id);
create index letters_status_idx on public.letters (status);
create index letters_opens_at_idx on public.letters (opens_at);

-- Invitation tokens (store hash only)
create table public.letter_access_tokens (
  id uuid primary key default gen_random_uuid(),
  letter_id uuid not null references public.letters (id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index letter_access_tokens_letter_id_idx
  on public.letter_access_tokens (letter_id);

-- Attachments
create table public.letter_attachments (
  id uuid primary key default gen_random_uuid(),
  letter_id uuid not null references public.letters (id) on delete cascade,
  storage_path text not null,
  mime_type text not null,
  file_size_bytes bigint not null check (file_size_bytes >= 0),
  alt_text text,
  created_at timestamptz not null default now()
);

create index letter_attachments_letter_id_idx
  on public.letter_attachments (letter_id);

-- Operational events (no letter bodies / raw tokens in metadata)
create table public.letter_events (
  id uuid primary key default gen_random_uuid(),
  letter_id uuid not null references public.letters (id) on delete cascade,
  actor_id uuid references public.profiles (id) on delete set null,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index letter_events_letter_id_idx on public.letter_events (letter_id);

-- Notification jobs
create table public.notification_jobs (
  id uuid primary key default gen_random_uuid(),
  letter_id uuid not null references public.letters (id) on delete cascade,
  recipient_id uuid references public.profiles (id) on delete set null,
  channel text not null,
  event_type text not null,
  scheduled_for timestamptz not null,
  status public.notification_status not null default 'pending',
  attempt_count integer not null default 0,
  idempotency_key text not null unique,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index notification_jobs_status_scheduled_idx
  on public.notification_jobs (status, scheduled_for);

-- Share cards
create table public.share_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  letter_id uuid references public.letters (id) on delete set null,
  template_id text not null,
  storage_path text,
  visibility public.share_visibility not null default 'private',
  created_at timestamptz not null default now()
);

-- Blocks
create table public.blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references public.profiles (id) on delete cascade,
  blocked_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

-- Reports
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles (id) on delete set null,
  letter_id uuid references public.letters (id) on delete set null,
  reported_user_id uuid references public.profiles (id) on delete set null,
  reason text not null,
  details text,
  status public.report_status not null default 'open',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger letters_set_updated_at
  before update on public.letters
  for each row execute function public.set_updated_at();

create trigger notification_jobs_set_updated_at
  before update on public.notification_jobs
  for each row execute function public.set_updated_at();

-- Create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  chosen_name text;
begin
  chosen_name := coalesce(
    nullif(new.raw_user_meta_data ->> 'display_name', ''),
    split_part(new.email, '@', 1),
    'User'
  );

  insert into public.profiles (id, display_name, preferred_locale)
  values (
    new.id,
    chosen_name,
    coalesce(nullif(new.raw_user_meta_data ->> 'preferred_locale', ''), 'bn')
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.letters enable row level security;
alter table public.letter_access_tokens enable row level security;
alter table public.letter_attachments enable row level security;
alter table public.letter_events enable row level security;
alter table public.notification_jobs enable row level security;
alter table public.share_cards enable row level security;
alter table public.blocks enable row level security;
alter table public.reports enable row level security;

-- Profiles policies
create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Link/public profiles are viewable"
  on public.profiles for select
  using (profile_visibility in ('link', 'public'));

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Letters: sender owns drafts/sent; recipient can read available/opened account letters
create policy "Senders manage own letters"
  on public.letters for all
  using (auth.uid() = sender_id)
  with check (auth.uid() = sender_id);

create policy "Recipients read eligible account letters"
  on public.letters for select
  using (
    auth.uid() = recipient_id
    and status in ('available', 'opened')
    and deleted_at is null
  );

-- Tokens: only sender can manage; reveal path uses service role / RPC later
create policy "Senders manage letter tokens"
  on public.letter_access_tokens for all
  using (
    exists (
      select 1 from public.letters l
      where l.id = letter_id and l.sender_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.letters l
      where l.id = letter_id and l.sender_id = auth.uid()
    )
  );

create policy "Senders manage attachments"
  on public.letter_attachments for all
  using (
    exists (
      select 1 from public.letters l
      where l.id = letter_id and l.sender_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.letters l
      where l.id = letter_id and l.sender_id = auth.uid()
    )
  );

create policy "Recipients read attachments for eligible letters"
  on public.letter_attachments for select
  using (
    exists (
      select 1 from public.letters l
      where l.id = letter_id
        and l.recipient_id = auth.uid()
        and l.status in ('available', 'opened')
        and l.deleted_at is null
    )
  );

create policy "Senders read own letter events"
  on public.letter_events for select
  using (
    exists (
      select 1 from public.letters l
      where l.id = letter_id and l.sender_id = auth.uid()
    )
  );

create policy "Users manage own share cards"
  on public.share_cards for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own blocks"
  on public.blocks for all
  using (auth.uid() = blocker_id)
  with check (auth.uid() = blocker_id);

create policy "Users create reports"
  on public.reports for insert
  with check (auth.uid() = reporter_id);

create policy "Users read own reports"
  on public.reports for select
  using (auth.uid() = reporter_id);

-- notification_jobs: no direct client access in MVP (service role only)
