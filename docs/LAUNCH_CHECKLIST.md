# Inseme — Pre-launch Checklist

Sep 23, 2026 · Source: [Claude Doc](https://claude.ai/code/artifact/1f1273cb-8bee-4563-97d9-4ba7ba9eb0be) — the doc is the live version; this file is a snapshot.

## Summary

Not ready to ship yet. The code is in good shape: `tsc` and `eslint` pass with no errors, the admin and CMS are finished, and every public page has a title and description. What's missing is launch plumbing and real content. That means placeholder reviews, prices and photos; no privacy policy; no sitemap, robots or structured data; and an empty redirect map.

This list comes from a review of the plans in `plans/` (implementation plan §8–9, SEO strategy), `docs/QA_CHECKLIST.md`, the git history up to `b435562`, and the code in `src/`. Section 1 lists the tasks that block launch. Sections 2–6 can be split across the launch week and the first month.

Estimated effort: about 2–3 dev days for code tasks. Content and legal tasks depend on the client.

## 1. Blockers: must fix before go-live

- [ ] **Remove or replace the fake Google reviews.** `src/content/opinie.ts` is made up and flagged as placeholder, and `profileUrl`, `rating` and `count` are empty. Publishing invented reviews in a health category is a legal and reputational risk. Either use real quotes from the Google profile, reviewed by the lawyer, or ship with `reviews: []`. An empty list hides the section.
- [ ] **Replace placeholder prices.** `src/content/cennik.ts` is flagged: every `priceFrom` is invented. Get the real numbers and wording from the client.
- [ ] **Add a privacy policy / RODO page.** The footer link `privacyHref` is `"#"` (`src/content/home.ts:575`). The contact form, screening test and newsletter all collect personal data, and some of it is health-related, so they need a real policy page (e.g. `/polityka-prywatnosci`). Link it from each consent checkbox. The text comes from the client or their lawyer (IOD).
- [ ] **Replace placeholder images and logo.** The images are `/public/placeholder/*.jpg`, with the logo loaded from `/placeholder/logo-insieme.png` in the header and footer. They're 0.5–2 MB each and served unresized (see Performance). Use final, compressed photos with descriptive file names.
- [ ] **Replace the default favicon.** `src/app/favicon.ico` is the stock create-next-app icon. Add `icon.png`/`apple-icon.png` from the logo.
- [ ] **Fill the redirect map.** `redirect-map.json` has `"redirects": []`. Run `npm run redirects:generate -- <old-sitemap-url>` for **both** old domains and map every URL by hand. Skipping this is the most common way a rebuilt site loses its rankings (SEO strategy §2.4).
- [ ] **Confirm the canonical domain** and set `NEXT_PUBLIC_SITE_URL` in Vercel. It currently defaults to `https://osrodek-insieme.pl`. Pick apex or www and redirect the other. The second domain should 301 to the canonical one, not stay live.
- [ ] **Set production env vars:** all `R2_*`, `RESEND_API_KEY` + `RESEND_FROM` (with the sending domain verified in Resend: SPF/DKIM), `UPSTASH_*` and `CRON_SECRET` (`docs/ENV.md`). Without `CRON_SECRET`, data retention never runs, which is a RODO problem.
- [ ] **Verify trust data with the client:** RPWDL number `000000234596`, phone `669 916 005`, address `ul. Świerkowa 13, 05-506 Magdalenka`, and whether the phone really is answered 24/7 ("dyżur całą dobę").
- [ ] **Legal read of the copy (art. 14 of the Act on Medical Activity):** hero, pricing, reviews and program. It should read as information, not advertising.
- [ ] **Run `docs/QA_CHECKLIST.md` on the production deployment.** It isn't ticked yet. Email, rate limiting and cron only work with production keys.

## 2. SEO and discoverability

The basics are missing: there's no sitemap, robots file, canonical URL, Open Graph tags or structured data anywhere in `src/app`. Everything marked "launch" below is cheap to add and should ship on day one.

**Technical SEO (launch)**

- [ ] Add `src/app/sitemap.ts`. Include the static pages plus published articles, team members and tests from the DB, each with `lastModified`. Leave out `/admin` and `/api`.
- [ ] Add `src/app/robots.ts`. Disallow `/admin` and `/api`, and point to the sitemap. Return `noindex` on Vercel preview deployments (`VERCEL_ENV !== "production"`) so previews never get indexed.
- [ ] In the root layout, set `metadataBase` from `NEXT_PUBLIC_SITE_URL`, plus a title template `"%s | Insieme"` and a real default description. Right now it's just `"Ośrodek terapii uzależnień Insieme."`.
- [ ] Set `alternates.canonical` on every page and `generateMetadata`. The paginated `/galeria` pages already have a comment about this. Check they actually output it.
- [ ] Add Open Graph and Twitter metadata, with a default `opengraph-image` (logo + photo, 1200×630) and article-specific images. Links shared on WhatsApp or Messenger (which is how families pass them around) currently show no preview.
- [ ] Add `app/not-found.tsx` (global 404 page with the phone number) and `app/error.tsx`. Only `/testy/[slug]` and `/zespol/[slug]` have their own.
- [ ] Check that each page has exactly one `<h1>`: the hero and `PageIntro` each render one, so make sure no page renders both.

**Structured data (JSON-LD), launch**

- [ ] Sitewide `MedicalClinic` (or `MedicalBusiness`) with exact NAP, `geo` (52.0923, 20.8946), `openingHoursSpecification` (24/7 if true), `telephone`, `url`, `logo`, and `sameAs` linking the Google Business Profile.
- [ ] `Person` on `/zespol/[slug]` (name, jobTitle, qualifications, `worksFor`).
- [ ] `Article` on `/artykuly/[slug]` with `author` linked to the Person, plus `datePublished` and `dateModified`.
- [ ] `BreadcrumbList` wherever `PageIntro` already shows breadcrumbs.
- [ ] `FAQPage` on `/pytania`. Google now shows FAQ rich results only for a few sites, but AI answers still read this markup.
- [ ] **Never** add `AggregateRating` for your own reviews (SEO strategy §3.8). Google can penalise the whole domain for it.

**E-E-A-T and content structure (launch → month 1)**

- [ ] Link article authors to team members. `articles.authorReviewer` is free text right now. Make it a relation to `team_members` and show a byline with a photo, certificate and link to the bio. This is the core of the strategy (§3.1).
- [ ] Show qualifications and KCPU certificate numbers on the team bios, and name the clinical lead.
- [ ] Build the missing intent pages from implementation plan §3/§8: `/dla-rodziny`, `/dla-osoby-szukajacej-pomocy`, a separate `/pierwszy-kontakt` page (currently only an anchor on `/`), `/detoks-i-kwalifikacja`, and treatment pages (`/leczenie-alkoholizmu`, `-narkomanii`, `-lekomanii`, `-hazardu`). These carry the main search intents. If they're pushed to phase 2, agree that with the client explicitly.
- [ ] The CMS **Pages** (`pages` table) have no public route in `src/app/(site)`, so pages created in the admin never appear on the site. Either wire up a route or hide the section before training the client.
- [ ] Publish the three launch articles from the plan: calling on behalf of someone, whether detox is needed, what the first day looks like. Link them to and from the relevant pages.
- [ ] Write alt text for every image, and descriptive file names (`dom-staw.jpg` is fine; `assets-1786693086106-ibnm.jpg` isn't). The hero image has `alt: ""`.
- [ ] Decide on URL slugs before indexing: `/artykuly` vs the plan's `/poradnik`, `/pytania` vs `/faq`. Changing them later means more redirects.

**Off-site (launch week)**

- [ ] Verify Google Search Console (domain property) and Bing Webmaster Tools, then submit the sitemap.
- [ ] Google Business Profile: merge duplicates, set the primary category to "Ośrodek leczenia uzależnień", link to the canonical domain only (with a UTM tag), and check the NAP matches the site exactly.
- [ ] Update the NAP in RPWDL, KCPU listings, Apple Maps and Bing Places to match exactly.

## 3. Performance and Core Web Vitals

The biggest risk is the hero image. `src/lib/image-loader.ts` passes local `/public` files through untouched, so the preloaded full-width hero (`dom-staw.jpg`, 2.0 MB) is sent as-is to every phone. That alone will fail LCP on 4G.

- [ ] Serve every photo through R2 + the Cloudflare `/cdn-cgi/image/` resizing, or compress the local files to WebP/AVIF at 150–250 KB with proper `sizes`. Current sizes: `dom-staw` 2.0 MB, `dom-taras` 1.5 MB, `salon` 1.4 MB, `pokoj` 757 KB, `rozmowa` 512 KB.
- [ ] Enable Cloudflare Image Resizing on the R2 media domain and check that `/cdn-cgi/image/width=640,...` returns a resized image.
- [ ] Add `loading="lazy"` to the OpenStreetMap `<iframe>` in `kontakt-grid.tsx`.
- [ ] Review the 11 `"use client"` components under `src/components/site`. Keep only interactive leaves on the client.
- [ ] Run PageSpeed Insights on the production URL for `/`, `/osrodek`, `/galeria` and one article, on mobile. Targets: LCP < 2.5 s, CLS < 0.1, INP < 200 ms (the QA checklist aims for under 3 s on 4G).
- [ ] Turn on Vercel Speed Insights, or look at CrUX in Search Console after about 28 days, to get real-user data.

## 4. Accessibility and UX

The foundations are good: `lang="pl"`, reduced-motion rules in `globals.css`, and consent checkboxes with labels. The gaps below are small.

- [ ] Add a "Przejdź do treści" skip link at the top of `(site)/layout.tsx`.
- [ ] Give the contact form visible labels. Right now its fields rely on `aria-label` + placeholder, and the placeholder disappears as soon as someone starts typing, which is hard for stressed or older users.
- [ ] Give the hero photo real alt text (it shows the house), and check that the lightbox images get their alt from the gallery data. `gallery-lightbox.tsx:185` uses `alt=""`.
- [ ] Check keyboard access and focus trapping in the mobile menu, gallery lightbox and screening test. Check colour contrast for sage/cream text and on-dark text (WCAG AA 4.5:1).
- [ ] Make sure the sticky call bar doesn't cover form buttons or the footer on small phones (320–375 px).
- [ ] Test on real devices: iOS Safari, Android Chrome, desktop Firefox.

## 5. Content and client feedback

The client's feedback isn't in the repo yet. Add each point here as a task before starting the design changes. What the client needs to supply:

- [ ] *Client feedback item 1 (to fill in)*
- [ ] Final photos: house, rooms, therapy spaces, team portraits. No stock photos (SEO strategy §3.2).
- [ ] Team: real names, roles, KCPU certificate numbers, bios and photos, plus the named clinical lead. Seed them in the admin and publish.
- [ ] Final price list and the explanation of what's clarified by phone (`cennik.ts`).
- [ ] Real Google reviews + profile URL, or a decision to launch without the section.
- [ ] FAQ answers checked by a therapist. Screening tests checked (scoring bands, result wording, PDF with Polish characters).
- [ ] Privacy policy, cookie text and data-retention period (`DATA_RETENTION_MONTHS`, default 24) from the client or their IOD.
- [ ] Check that the section numbers on the home page run 01–08 with no duplicates after the latest `/osrodek` and team changes (QA §9).
- [ ] Before launch, move the text from `src/content/*.ts` defaults into the CMS/settings where the admin can edit it, so the client can change phone numbers, hours and prices without a deploy.

## 6. Analytics, legal, deployment and post-launch

**Analytics (launch)**

- [ ] Choose a tool. There's no analytics code yet. Either use GA4 via GTM with a consent banner (Consent Mode v2), or a cookieless option (Plausible, Umami or Vercel Web Analytics) that needs no banner.
- [ ] Track the events from implementation plan §9: `click_phone_header`, `click_phone_sticky`, `click_phone_contact`, `click_email`, `form_start`, `form_submit`, `directions_click`. Never send message text, substance type or test answers. No remarketing.
- [ ] Start the 14-day log of incoming calls (source, answered, outcome) with the client. It's free and it's the only real measure of cost per admission (SEO strategy §1.1, §9).

**Deployment (launch day)**

- [ ] Point the domain at Vercel, set up apex/www redirects, and check HTTPS on both old domains.
- [ ] Check Neon: point-in-time restore is on, and `main` and `dev` are separate branches.
- [ ] Confirm the retention cron shows up in Vercel → Cron Jobs and has run once.
- [ ] Add security headers in `next.config.ts`: HSTS, `X-Content-Type-Options`, `Referrer-Policy`, and a basic CSP that allows the OSM iframe and the R2 domain.
- [ ] Create the client's admin account (`npm run admin:create`), remove test accounts, and walk the client through `docs/ADMIN_GUIDE.md`.
- [ ] Delete seeded test data (leads, submissions, draft articles) from the production DB.
- [ ] Retire the old site(s) only after the redirects are verified to return 308s.

**After launch (weeks 1–4)**

- [ ] Watch Search Console daily for the first 2 weeks: coverage, 404s, redirect errors. Fix missing mappings in `redirect-map.json`.
- [ ] Use URL Inspection to request indexing for the home page, the main pages and the 3 articles.
- [ ] Set up an uptime monitor (e.g. Better Stack or UptimeRobot) for `/` and the contact form action.
- [ ] Monthly report (plan §9): organic sessions, queries, top landing pages, phone and form events, indexed pages.
- [ ] Plan phase 2 content: topic clusters (alcohol, drugs, medication, gambling, family, NFZ waiting times) at 3–4 articles a month.
