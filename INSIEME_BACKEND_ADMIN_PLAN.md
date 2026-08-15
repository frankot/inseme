# Insieme — backend/admin implementation plan

Scope: **backend + admin/CMS only.** The public-facing visual design is not locked yet, so this plan
treats the frontend as a consumer of a stable data layer, not a dependency. The admin UI gets basic
shadcn styling — functional, not final-brand — so building isn't blocked on design decisions.

This is a separate document from `INSIEME_IMPLEMENTATION_PLAN.md` (the full-project plan derived from
the earlier brief). That plan's phases/pricing still apply to the project as a whole; this document only
goes deep on the backend/admin track.

---

## 0. Decisions locked (from grilling round)

| Area | Decision |
|---|---|
| Build strategy | Decoupled: data layer + server actions + admin UI now, basic shadcn styling, public design skinned in later without backend rework. |
| CMS approach | Custom-built inside the same Next.js app (no headless CMS product, no SaaS CMS). |
| Reusable boilerplate | None — building from scratch for this project. |
| Database | Postgres via **Neon**. |
| File storage | **Cloudflare R2** (S3-compatible). |
| Admin auth | **Auth.js (NextAuth)**, credentials provider, no 2FA. |
| Admin roles | Single flat admin role — no role/permission matrix. |
| Content scope | Full brief list: Settings, Pages, Team, FAQ, Articles, Service pages, Media, Screening tests, Lead collector. **Redirects dropped as a CMS content type** — see §9. |
| Screening test engine | Simple linear scored quiz — no branching/conditional logic. |
| PDF generation | `@react-pdf/renderer`, server-side, generated on submit. |
| Email delivery | **Resend**. |
| Data retention | Configurable retention window (auto-expiry job) + manual per-record delete, for leads and screening-test submissions. |
| Redirects | **One-time static remap at cutover** — old site is being fully decommissioned, not an ongoing CMS-editable table. |
| Hosting | **Vercel**. |
| Spam protection | Honeypot + rate limiting (no CAPTCHA). |
| Backups/environments | Neon point-in-time restore + separate dev/prod branches. |
| Extra data safeguards | None beyond the admin login gate — no audit log, no field-level encryption. |
| Draft/publish workflow | Content has Draft + Published states with an explicit publish action. |
| ORM | **Drizzle ORM**. |
| Image handling | `next/image` + Cloudflare resizing via a custom R2 domain. |

---

## 1. Stack

- **App**: Next.js (App Router), TypeScript, deployed on Vercel (preview deployments per branch/PR, SSL included).
- **DB**: Neon Postgres, accessed via `drizzle-orm` + `@neondatabase/serverless`, migrations via `drizzle-kit`.
- **Storage**: Cloudflare R2 via `@aws-sdk/client-s3` (R2 is S3-compatible), presigned upload URLs from server actions.
- **Auth**: `next-auth` (Auth.js v5), Credentials provider, `bcrypt` password hashing, JWT session, middleware-gated `/admin/*`.
- **Admin UI**: shadcn/ui + Tailwind, `react-hook-form` + `zod` for all forms.
- **Email**: `resend` + `react-email` templates (test-result notification, contact-form notification, PDF attachment delivery).
- **PDF**: `@react-pdf/renderer` for the screening-test result document.
- **Rate limiting**: `@upstash/ratelimit` + `@upstash/redis` (free tier) — needed because serverless functions are stateless, so honeypot alone isn't enough to throttle abuse.
- **Excel export**: `xlsx` (writes real `.xlsx`, not just CSV) for the leads export.
- **Cron**: Vercel Cron for the retention/expiry job.

---

## 2. Data model (Drizzle schema, by content type)

**Settings** (singleton row)
`phone, secondaryPhone, email, address, hours, whatsapp, socialLinks(json), privacyNote, defaultOgImageId, consentBannerText`

**Pages** — covers Home, "Jak wygląda pierwszy kontakt", "Dla rodziny", "Ośrodek", "Cennik", "Kontakt", and also **service pages** (Leczenie alkoholizmu/narkomanii/lekomanii/hazardu, Detoks i kwalifikacja) via a `pageType` discriminator, instead of a duplicate table — same shape (hero + ordered content blocks + metadata), less schema to maintain.
`id, slug (unique), pageType(standard|service), title, status(draft|published), heroTitle, heroSubtitle, sections(json — ordered array of typed blocks: richtext | image_text | cta | step_list | faq_embed), metaTitle, metaDescription, ogImageId, publishedAt, updatedAt`

> Blocks are a **fixed small set of types**, not a freeform builder — matches the brief's "structured CMS, not page-builder chaos." `step_list` exists specifically for the "first-contact path" signature element from the brief's visual direction.

**TeamMembers**
`id, name, role, qualifications, shortBio, longBio, photoId, order, status(draft|published)`

**FAQItems**
`id, question, answer, category, order, status(draft|published)`

**Articles** (poradnik)
`id, slug, title, excerpt, body(json blocks), authorReviewer, coverImageId, status(draft|published), publishedAt, metaTitle, metaDescription`

**ScreeningTests** + children (brief §4.8)
- `ScreeningTests`: `id, slug, title, description, introText, disclaimerText, status(draft|published)`
- `ScreeningTestQuestions`: `id, testId, order, text`
- `ScreeningTestAnswerOptions`: `id, questionId, label, points`
- `ScreeningTestResultBands`: `id, testId, minScore, maxScore, resultTitle, resultBody`
- `ScreeningTestSubmissions`: `id, testId, email, consentAt, answers(json), totalScore, resultBandId, createdAt, deletedAt`

**LeadSignups** (simple email-capture widget, brief §4.9)
`id, email, consentAt, createdAt, deletedAt`

> The brief wants "one shared base" of every collected email. Rather than duplicating rows, the admin's **Leads export** is a query that unions `LeadSignups` and `ScreeningTestSubmissions.email` — one export button, two source tables, no duplicate storage.

**ContactSubmissions**
`id, name, phone, email, message, preferredContactMethod, consentAt, status(new|handled), createdAt, deletedAt`

**Media**
`id, r2Key, url, altText, width, height, mimeType, size, uploadedAt`

**AdminUsers**
`id, email, passwordHash, createdAt`

No `Redirects` table, no roles/permissions table, no audit-log table — per decisions above.

---

## 3. Auth

- Auth.js Credentials provider against `AdminUsers` (bcrypt-compared password).
- JWT session; `middleware.ts` protects everything under `/admin` except `/admin/login`.
- Single flat role — every logged-in admin user has full access. Admin accounts are created via a seed script/CLI, not self-signup (there's no public registration surface).

---

## 4. Admin UI (routes)

```
/admin/login
/admin                      dashboard: counts of new contact msgs, recent test submissions, recent signups
/admin/settings             singleton form
/admin/pages                list + block editor (incl. service pages via pageType)
/admin/team
/admin/faq
/admin/articles
/admin/media                upload (presigned R2 URL), list, alt text
/admin/tests                test list
/admin/tests/[id]           questions + answer options + result bands builder
/admin/tests/[id]/submissions   view / delete
/admin/leads                unified export (signups + test emails), manual delete
/admin/contact              inbox: new/handled, manual delete
```

Every editable content type gets the same **draft → edit → publish** pattern: saving writes a draft;
"Publish" is a separate explicit action that stamps `publishedAt` and flips `status`. This matches the
brief's requirement that a named person reviews medical/factual content before it goes live.

---

## 5. Screening test flow (brief §4.8)

1. Visitor picks a test → answers ordered questions (each option carries points) → submits.
2. Server action sums points, finds the matching `ScreeningTestResultBands` row, requires email + consent checkbox before revealing the result.
3. On submit: insert `ScreeningTestSubmissions` row → render PDF via `@react-pdf/renderer` → email it via Resend.
4. Result text and disclaimer are pulled from admin-authored fields — **content itself still needs the center's therapist/doctor sign-off before publishing a test**, per the brief; that's a content task, not a backend one.

---

## 6. Lead collector + contact form (brief §4.9, §4.5)

- Signup widget: email + consent → `LeadSignups`. Reusable component, placeable in multiple spots once frontend exists.
- Contact form: name (optional) + phone/email + message + preferred contact method + consent → `ContactSubmissions`, triggers a Resend notification to the center's inbox, plus a calm confirmation message back to the visitor (per brief's copy rules — no promises).
- Both forms share the same spam guard: a honeypot field (rejects silently if filled) + Upstash-backed rate limiting per IP/session on the submit action.

---

## 7. Media / images

- Admin uploads go straight to R2 via a presigned URL (no file passes through the Next.js server).
- Public delivery: R2 bucket exposed on a custom domain with Cloudflare's image resizing enabled; `next/image` uses a custom loader pointed at that domain, so responsive sizes are generated on the fly without a separate image service.

---

## 8. Data lifecycle & RODO posture

- Retention window is a configurable value (e.g. default 24 months) read from `Settings` or an env var.
- A Vercel Cron job soft-deletes (`deletedAt`) expired `ContactSubmissions`, `ScreeningTestSubmissions`, and `LeadSignups` past the window.
- Every one of those admin list views also has a manual "delete now" action per record, for immediate right-to-erasure requests — independent of the retention job.
- No audit log, no field-level encryption beyond Neon's disk-level encryption — kept simple per the locked decision. If this ever needs revisiting (e.g. a regulator/legal review asks for more), it's an additive change, not a rearchitecture.

---

## 9. Redirects — deviation from the original brief

The brief's §4.6 describes redirects as an ongoing CMS content type (`old URL → new URL`, editable by
admins). **That's dropped here**: since the old site is being fully decommissioned at cutover, redirects
are handled as a **one-time static mapping** — a checked-in `redirect-map.json` built from a crawl of the
old site, wired into `next.config.js` `redirects()` (or edge middleware if the list gets large) at deploy
time. No admin UI, no DB table, no ongoing editing surface. If new stray old-URL traffic shows up
post-launch, the map file gets a manual addition and a redeploy — acceptable given the old site won't be
generating new links.

---

## 10. Delivery phases (backend/admin track only)

**Phase B1 — Foundations**
Repo scaffold, Neon + Drizzle + drizzle-kit setup, R2 bucket + custom domain, Vercel project + env vars,
Auth.js login, protected `/admin` shell with shadcn nav layout.

**Phase B2 — Core content types**
Settings, Pages (with block sections + service-page variant), Team, FAQ, Articles, Media library
(upload → R2 → `next/image` loader). Draft/publish wired in for all of them.

**Phase B3 — Screening test engine**
Schema, admin builder (test → questions → answer options → result bands), public submission server
action, scoring, PDF generation, Resend delivery, submissions inbox.

**Phase B4 — Lead collector + contact form**
Signup widget action, contact form action, honeypot + Upstash rate limiting, unified leads export
(`.xlsx`), contact inbox in admin.

**Phase B5 — Data lifecycle & ops**
Retention cron job, manual delete actions across all sensitive content types, redirect-map generation
script + one-time cutover wiring, Neon dev/prod branch split, deployment pipeline verification.

**Phase B6 — Handoff**
Admin usage guide for the center's editor (non-technical, screenshots), env var documentation, seed/example
content for each content type, end-to-end QA checklist (auth, CRUD per content type, full screening-test
submission → PDF → email path, contact form → notification path, image upload → resized delivery).

---

## 11. Explicitly out of scope here

- Public-facing visual design/skinning (separate track, brief §4.2/§6).
- GA4/GTM event wiring (frontend concern; backend exposes the data forms need, nothing more).
- Call tracking, CRM, lead-status pipeline (brief's "not included unless separately agreed").
- Newsletter ESP integration (Mailchimp/GetResponse) — brief explicitly phases this to later.
- Multi-role permissions, 2FA, audit logging, field-level encryption — all considered and deferred per §0.
- Ongoing CMS-editable redirects — replaced by the one-time static approach in §9.
- Medical/legal content authoring — every piece of factual copy (site pages, FAQ, and especially
  screening-test questions/results) still needs sign-off from the center's named reviewer before publish;
  the draft/publish workflow exists specifically to support that gate.
