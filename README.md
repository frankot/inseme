# Insieme

Next.js app for the Insieme addiction-treatment centre: a custom CMS/admin panel plus the data layer
the public site will consume. Plan of record: [`INSIEME_BACKEND_ADMIN_PLAN.md`](./INSIEME_BACKEND_ADMIN_PLAN.md).

**Status: phase B1 (foundations) complete.** Database + Drizzle, Auth.js login, protected `/admin`
shell. Content types land in B2.

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), TypeScript |
| Database | Neon Postgres via Drizzle ORM (`drizzle-orm/neon-http`) |
| Auth | Auth.js v5, Credentials provider, bcrypt, JWT session |
| UI | Tailwind v4 + shadcn/ui (`base-nova` style, Base UI primitives) |
| Forms | react-hook-form + zod |
| Hosting | Vercel |

## Local setup

1. **Install**

   ```bash
   npm install
   ```

2. **Create a Neon database.** In the Neon console create a project (region `eu-central-1`), then
   create two branches: `main` (production) and `dev`. Copy the **pooled** connection string of the
   branch you want to work against.

3. **Configure env.** Copy `.env.example` to `.env.local` and fill in:

   ```bash
   cp .env.example .env.local
   npx auth secret   # writes AUTH_SECRET, or generate with: openssl rand -base64 33
   ```

   `DATABASE_URL` and `AUTH_SECRET` are required — the app throws on startup without them
   (see `src/lib/env.ts`). The R2 block stays commented out until phase B2.

4. **Apply migrations**

   ```bash
   npm run db:migrate
   ```

5. **Create an admin account** (there is no self-signup):

   ```bash
   npm run admin:create -- --email admin@insieme.pl --name "Imię Nazwisko"
   ```

   Prints a generated password once. Pass `--password "…"` (min. 12 chars) to set your own; re-running
   for an existing e-mail resets that account's password.

6. **Run**

   ```bash
   npm run dev
   ```

   Panel: <http://localhost:3000/admin> → redirects to `/admin/login`.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run db:generate` | Generate a SQL migration from schema changes (works offline) |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:push` | Push schema straight to the DB (dev branch only — skips migration files) |
| `npm run db:studio` | Drizzle Studio |
| `npm run admin:create` | Create/reset an admin account |

Migrations in `drizzle/` are committed. Always `db:generate` after touching `src/db/schema/*` and
commit the generated SQL — `db:push` is for throwaway iteration on the dev branch only.

## Project layout

```
src/
  app/
    admin/
      (shell)/          layout (sidebar + header) and dashboard — everything behind auth
      login/            login page, form, and server action
      actions.ts        sign-out
    api/auth/[...nextauth]/   Auth.js route handler
  auth.config.ts        route-gate config, no DB import (used by proxy.ts)
  auth.ts               NextAuth instance + Credentials provider
  proxy.ts              Next 16 proxy (ex-middleware): gates /admin/*
  components/
    admin/              nav, mobile nav, user menu
    ui/                 shadcn components
  db/
    index.ts            Drizzle client
    schema/             one file per table, re-exported from index.ts
  lib/
    env.ts              zod-validated server env
    admin-nav.ts        nav model; unbuilt sections render disabled with their phase tag
    validations/        zod schemas shared by forms and server actions
scripts/create-admin.ts
drizzle/                generated migrations (committed)
```

## Auth model

Single flat admin role — every row in `admin_users` has full access. `proxy.ts` redirects anonymous
requests for `/admin/*` to `/admin/login?callbackUrl=…`; the login action only honours callback URLs
that start with `/admin`. A failed login costs the same time whether the e-mail exists or not
(`src/auth.ts` compares against a dummy hash), so responses don't leak which addresses are registered.

## Deployment (Vercel)

Console steps, done once:

1. Import the repo into a Vercel project (framework preset: Next.js, root `./`).
2. Environment variables — set for **Production**, **Preview**, and **Development**:
   - `DATABASE_URL` — Neon `main` branch (pooled) for production, the `dev` branch for preview.
   - `AUTH_SECRET` — a distinct value per environment.
   - `AUTH_URL` — only if the deployment URL can't be inferred (custom domain).
3. Run `npm run db:migrate` against the production branch at cutover (locally with the production
   `DATABASE_URL`, or as a Vercel build step once the schema stabilises).
4. Create the first production admin with `npm run admin:create` against the production `DATABASE_URL`.

### Cloudflare R2 (needed from phase B2)

1. Create bucket `insieme-media` (jurisdiction EU).
2. Attach a custom domain (e.g. `media.insieme.pl`) and enable Cloudflare image resizing on it —
   `next/image` will use a custom loader pointed at that domain instead of Vercel's optimizer.
3. Create an R2 API token (Object Read & Write, scoped to the bucket) and put the credentials in
   `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_BUCKET` / `R2_PUBLIC_URL`.

## Known notes

- `npm audit` reports a moderate advisory against esbuild via `drizzle-kit`. It affects the local
  esbuild dev server only, never ships to production, and the "fix" is a major downgrade of
  drizzle-kit — left as is.
- The Drizzle client uses Neon's HTTP driver, which has no multi-statement transactions. If a later
  phase needs them, switch `src/db/index.ts` to `drizzle-orm/neon-serverless` + `Pool`.
- `AGENTS.md` / `CLAUDE.md` at the repo root are generated and refreshed by `next dev`.
