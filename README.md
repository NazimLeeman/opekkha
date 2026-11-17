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

3. Create a Supabase project, then run the SQL in:

`supabase/migrations/20260326120000_initial_schema.sql`

(via Supabase SQL editor or CLI)

4. Start the app:

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

**Current focus:** Phase 1 foundation → then Phase 2 letter workflow.

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
