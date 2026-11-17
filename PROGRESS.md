# Opekkha — build progress

Track what’s done vs pending. Update after each phase slice.

## Phase overview

| Phase | Focus | Status |
| --- | --- | --- |
| 0 | Repo inspection | Done |
| 1 | Foundation (app shell, i18n, schema, auth stubs, landing) | Done |
| 2 | Core letter workflow | Done (E2E + autosave/revoke/received) |
| 3 | Sharing (cards, Web Share, FB fallback) | Done (themes + cloud save) |
| 4 | Reliability (jobs, notifications, abuse, admin, monitoring) | Done |
| 5 | V1 expansion (after validation) | Deferred |

---

## Phase 0 — inspection

**Done**

- Empty repo (README + product spec only)
- Chose greenfield stack: Next.js 16 + React 19 + TypeScript + Tailwind 4 + Supabase

**Architecture**

- App Router under `src/app`
- Supabase Auth + Postgres + Storage (credentials via env)
- Server-side opening-rule enforcement; hashed invite tokens
- Bengali-first i18n (`bn` default, `en` secondary)

---

## Phase 1 — foundation

### Done

- [x] Next.js scaffold in repo root
- [x] Design tokens + fonts (Bengali-capable)
- [x] Landing page (bn/en) with brand-first hero
- [x] Language switcher + cookie locale (Suspense-safe for Next 16)
- [x] Locale dictionaries
- [x] Supabase client helpers (browser / server / middleware)
- [x] Initial SQL migration + RLS policies
- [x] Auth page stubs (login / signup)
- [x] Dashboard placeholder
- [x] `.env.example` + README setup notes
- [x] `npm run build` passes

### Pending in Phase 1 (needs you)

- [x] Create Supabase project + fill env keys
- [x] Apply migrations (tables + RLS live)
- [x] Verify signup creates a `profiles` row (trigger OK)
- [x] Confirm login → `/dashboard` in the browser

---

## Phase 2 — core letter workflow

**Status:** E2E verified live (login → write → invite → open/reveal)

- [x] Letter create/edit UI (`/letters/new`, `/letters/[id]/edit`)
- [x] Draft create/update server actions
- [x] Opening rules helper (immediate / datetime / interval) + unit tests
- [x] Schedule/send creates hashed invite token + invite URL
- [x] Recipient envelope page (`/open/[token]`) — body not in envelope payload
- [x] Reveal action records opening server-side
- [x] Dashboard lists drafts / scheduled / sent
- [x] Live E2E: login → write → invite → open (signup UI rate-limited; admin user + login used)
- [x] Autosave polish (visible save state while typing)
- [x] Revoke-link UI on sent letters
- [x] Received section for account-bound letters (empty until account delivery exists)

**Known test notes**

- Signup via UI can hit Supabase email rate limits / reject `@example.com`
- Auth FormData bug fixed (read form before await)

---

## Phase 3 — sharing

- [x] Share-card preview (9:16) after send
- [x] 1080×1920 PNG export (title only — no letter body)
- [x] Copy link + Web Share API
- [x] Honest Facebook Story save/upload guidance
- [x] Themes: night-crimson / cream-paper / seal-gold
- [x] Persist generated cards to Storage + `share_cards` row

---

## Phase 4 — reliability

- [x] Notification job enqueue on schedule/send (invite URL in job payload)
- [x] `/api/jobs/notifications` worker (CRON_SECRET / Vercel cron)
- [x] Resend email provider wiring (`EMAIL_PROVIDER_API_KEY` + `EMAIL_FROM`)
- [x] Report letter UI on open/reveal
- [x] Block user action
- [x] Soft rate limits (send / report / share-card)
- [x] Admin report review UI (`/admin/reports`, `ADMIN_EMAILS`)
- [x] Monitoring hooks (scrubbed events + optional `MONITORING_WEBHOOK_URL`)
- [x] Migration `20260326123000_phase4_admin_notifications.sql`

**Ops checklist (you)**

- [ ] Apply Phase 4 SQL migration in Supabase
- [ ] Set `EMAIL_PROVIDER_API_KEY`, `EMAIL_FROM`, `ADMIN_EMAILS`, `CRON_SECRET`
- [ ] Optional: `MONITORING_WEBHOOK_URL` for errors/analytics

---

## Phase 5 — deferred

Note Jar, Memory Box, Future Letters, group letters, payments, AI — after MVP validation.

---

## External credentials needed

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only admin/jobs (never expose to client) |
| `CRON_SECRET` | Protects notification worker |
| `EMAIL_PROVIDER_API_KEY` / `EMAIL_FROM` | Resend transactional email |
| `ADMIN_EMAILS` | Allowlist for `/admin/reports` |
| `MONITORING_WEBHOOK_URL` | Optional scrubbed analytics/errors |
