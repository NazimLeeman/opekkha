# Opekkha (অপেক্ষা)

Bengali-first digital letters: write today, open when it matters.

See `opekkha_product_specification.md` for the full PRD and `PROGRESS.md` for build status.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- Supabase (Auth, Postgres, Storage)
- Locales: Bengali (`bn`, default) and English (`en`)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy env file and fill Supabase values:

```bash
cp .env.example .env.local
```

3. Create a Supabase project, then run **all** SQL files in `supabase/migrations/`
   (via Supabase SQL editor or CLI), including Phase 4:

`supabase/migrations/20260326123000_phase4_admin_notifications.sql`

4. Optional Phase 4 env: `EMAIL_PROVIDER_API_KEY` + `EMAIL_FROM` (Resend),
   `ADMIN_EMAILS` (comma-separated) for `/admin/reports`, `CRON_SECRET` for the
   jobs worker, and `MONITORING_WEBHOOK_URL` for scrubbed analytics.

5. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |

## Phase status

Tracked in [`PROGRESS.md`](./PROGRESS.md).

**Current focus:** Phase 4 complete — configure Resend + `ADMIN_EMAILS` + apply latest migration. Phase 5 deferred.

## Project Cursor skills

Repo-only skills live in `.cursor/skills/` (not personal `~/.cursor/skills`). Installed for Opekkha:

| Skill | Use for |
| --- | --- |
| `supabase` / `supabase-postgres-best-practices` | Auth, RLS, migrations, Postgres |
| `vercel-react-best-practices` / `vercel-composition-patterns` | Next.js / React patterns |
| `web-design-guidelines` / `frontend-design` | UI quality |
| `visual-qa-testing` / `verifying-in-browser` / `form-testing` / `responsive-testing` / `accessibility-auditing` | Browser QA |
| `auditing-security` | Privacy / security reviews |

Lockfile: `skills-lock.json`.

## Notes for contributors / coding agents

- Do not implement Note Jar, Memory Box, AI, or payments until the core letter journey works.
- Never send locked letter bodies to the client.
- Store invitation token hashes only.
- Keep Facebook Story sharing honest (save/share fallback on web).
