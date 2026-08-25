# Insieme

Next.js app for the Insieme addiction-treatment centre: a custom CMS/admin panel plus the data layer
the public site will consume. Plan of record: [`INSIEME_BACKEND_ADMIN_PLAN.md`](./INSIEME_BACKEND_ADMIN_PLAN.md).

**Status: phases B1 (foundations) + B2 (core content types) complete.** Database + Drizzle, Auth.js
login, protected `/admin` shell, and the CMS for Settings, Pages, Team, FAQ, Articles and Media.
Screening tests (B3) and lead/contact forms (B4) are next.

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), TypeScript |
| Database | Neon Postgres via Drizzle ORM (`drizzle-orm/neon-http`) |
| Auth | Auth.js v5, Credentials provider, bcrypt, JWT session |
| UI | Tailwind v4 + shadcn/ui (`base-nova` style, Base UI primitives) |
| Forms | react-hook-form + zod |
| Rich text | Tiptap → HTML, sanitised server-side with `sanitize-html` |
| Files | Cloudflare R2 (presigned uploads), images resized at the Cloudflare edge |
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
| `npm run db:smoke` | Apply migrations to an in-process Postgres (PGlite) and assert schema behaviour |

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

## Content model

Every content type follows the same shape: a list view, an editor, and a **draft → publish** gate
where saving never publishes — "Opublikuj" is always a separate, explicit action that stamps
`publishedAt`. Articles refuse to publish until "Autor / osoba weryfikująca" is filled in, so
medical/factual copy always names its reviewer.

| Type | Table | Notes |
|---|---|---|
| Settings | `settings` | Singleton row (`id = "singleton"`), upserted. Config, so no draft/publish. |
| Pages | `pages` | Standard pages *and* service pages, split by `pageType`. Ordered `sections` blocks. |
| Team | `team_members` | `sortOrder` drives display order. |
| FAQ | `faq_items` | `category` groups items; the `faq_embed` block pulls a category into a page. |
| Articles | `articles` | Poradnik. Same block editor as pages, under `body`. |
| Media | `media` | R2 object key + public URL + alt text and dimensions. |

### Content blocks

Pages and articles are built from a **fixed set** of block types (`src/lib/blocks.ts`), not a freeform
page builder: `richtext`, `image_text`, `cta`, `step_list` (the "first contact path" element from the
brief) and `faq_embed`. Blocks are stored as a JSON array validated by a zod discriminated union.
Adding a type means touching three places: the union in `src/lib/blocks.ts`, the editor switch in
`src/components/admin/block-editor.tsx`, and the future public renderer.

Editor HTML is sanitised on write (`src/lib/sanitize.ts`) — an allow-list of tags and attributes, no
scripts, no `javascript:` URLs — because the public site will inject it with `dangerouslySetInnerHTML`.

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

### Cloudflare R2 (required for the media library)

Without these variables the app still runs — the media page shows a "storage not configured" notice
and uploading is disabled.

1. Create bucket `insieme-media` (jurisdiction EU).
2. Attach a custom domain (e.g. `media.insieme.pl`) and enable Cloudflare image resizing on it.
   `next/image` uses the custom loader in `src/lib/image-loader.ts`, which rewrites requests to
   `/cdn-cgi/image/width=…,quality=…,format=auto/<path>` on that domain, so Vercel's optimizer is
   never involved.
3. Create an R2 API token (Object Read & Write, scoped to the bucket) and fill in
   `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_BUCKET` / `R2_PUBLIC_URL`.
4. **Set bucket CORS** — the browser uploads straight to R2 with a presigned `PUT`, so the bucket must
   allow it from the site origin:

   ```json
   [
     {
       "AllowedOrigins": ["https://insieme.pl", "http://localhost:3000"],
       "AllowedMethods": ["PUT"],
       "AllowedHeaders": ["content-type"],
       "MaxAgeSeconds": 3600
     }
   ]
   ```

   Uploads accept JPEG/PNG/WebP/AVIF/SVG/PDF up to 15 MB; the limit and the object key are enforced
   server-side, so the browser never picks its own storage path.

## Known notes

- `npm audit` reports a moderate advisory against esbuild via `drizzle-kit`. It affects the local
  esbuild dev server only, never ships to production, and the "fix" is a major downgrade of
  drizzle-kit — left as is.
- The Drizzle client uses Neon's HTTP driver, which has no multi-statement transactions. If a later
  phase needs them, switch `src/db/index.ts` to `drizzle-orm/neon-serverless` + `Pool`.
- `AGENTS.md` / `CLAUDE.md` at the repo root are generated and refreshed by `next dev`.
- Server actions are public endpoints — the proxy only gates page routes — so every mutating action
  starts with `requireAdmin()` (`src/lib/auth-guard.ts`). Keep that habit when adding actions.
- `npm run db:smoke` needs no database: it boots Postgres in-process via PGlite (a devDependency),
  applies the committed migrations and asserts defaults, constraints, the publish transition,
  `ON DELETE SET NULL` on media references, the slug-clash query and HTML sanitisation.
