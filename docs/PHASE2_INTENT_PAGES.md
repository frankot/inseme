# Phase 2 — intent pages

Decided Oct 2, 2026: these pages ship **after** launch, not with it. The client should agree to this explicitly, because the implementation plan (§3) listed them as launch pages and the SEO strategy (§3.5) builds the topic clusters on them.

Sources: `plans/INSIEME_IMPLEMENTATION_PLAN.md` §2, §3, §8; `plans/INSIEME_STRATEGIA_SEO.md` §3.1, §3.4, §3.5.

## Why they matter

Each page answers one search intent that the launch site only touches in passing. Without them, the site ranks for the brand and for "ośrodek Magdalenka", but not for the questions people actually type ("leczenie alkoholizmu prywatnie", "czy mogę zadzwonić za kogoś", "kiedy potrzebny detoks"). They are also where the phase 2 articles link to, so the clusters have a centre.

## The pages

Rough effort is per page, once the shared template exists. Copy comes from the client or a writer and has to be checked by a therapist and the lawyer (art. 14: informing, not advertising; no claims about effectiveness or treatment time).

### 1. `/pierwszy-kontakt` — what happens when you call

- **Intent:** "what happens if I call", "how does admission work", "what to bring". The most important conversion page in the plan.
- **Today:** the `PierwszyKontakt` section on the homepage (anchor `/#pierwszy-kontakt`), linked from the nav and footer.
- **Content:** who answers the phone; what they will ask (and what they won't — no surname needed); what happens after the call (qualification, date, detox if needed); the admission day step by step; documents and what to bring (reuse `osrodekPageDefaults.packing`); what it costs to call (nothing) and what it commits you to (nothing). The two paths from the homepage section (for yourself / for someone close) as tabs or two columns.
- **Plan option:** merge "Jak wygląda przyjęcie" into this page (plan §3, "if scope must be reduced").
- **Schema:** `BreadcrumbList`; `FAQPage` for a short Q&A block at the end.
- **Code:** new route; point the nav "Pierwszy kontakt" and footer link at it instead of the anchor; the homepage section ends with a link to it.
- **Effort:** 0.5 day of code.

### 2. `/dla-osoby-szukajacej-pomocy` — for the person themselves

- **Intent:** shame and fear ("boję się zadzwonić", "czy to już uzależnienie", "co jeśli nie jestem gotowy").
- **Content:** written in the second person, calm. Is it really addiction (link to the screening tests); what you can say on the phone and what you can keep to yourself; confidentiality (no notification to employer, family, NFZ); what a stay looks like day to day (link to `/program`); what if you are not ready yet (a call without a decision is fine).
- **Links:** `/testy`, `/program`, `/pierwszy-kontakt`, `/cennik`, the relevant treatment page.
- **Effort:** 0.5 day.

### 3. `/dla-rodziny` — for family and people close to them

- **Intent:** "jak pomóc osobie uzależnionej", "czy mogę zadzwonić w czyimś imieniu", "co zrobić, gdy nie chce się leczyć".
- **Content:** yes, you can call on someone's behalf, and what that call looks like; what you can do when they refuse (without "intervention" pressure language); how to talk about it (link to the existing article "Jak rozmawiać z bliską osobą o leczeniu"); family consultations during the stay; visits and contact rules; looking after yourself (Al-Anon, family therapy).
- **Links:** `/pierwszy-kontakt`, the family articles, `/faq` (category "rodzina", if one is created in the admin).
- **Effort:** 0.5 day.

### 4. `/detoks-i-kwalifikacja` — when detox comes first

- **Intent:** "czy potrzebny detoks", "odtrucie alkoholowe", "kiedy nie mogą przyjąć od razu".
- **Content:** what detox is and when it is needed; why stopping on your own can be dangerous (alcohol, benzodiazepines); how qualification works on the phone; when admission cannot be immediate and what happens then (referral, hospital detox); how long it usually takes, worded as information, not a promise. Needs **medical review by the doctor**, not only the therapist.
- **Links:** the article "Detoks alkoholowy — jak wygląda", `/leczenie-alkoholizmu`, `/leczenie-lekomanii`.
- **Effort:** 0.5 day.

### 5–8. Treatment pages

One per substance or behaviour. Same template, different content. Each is the centre of a topic cluster (SEO strategy §3.5): one thorough page plus 5–10 supporting articles that link to it and back.

| Page | Intent | Notes |
|---|---|---|
| `/leczenie-alkoholizmu` | "leczenie alkoholizmu prywatnie", "odwyk Warszawa" | The biggest cluster. Links to detox, the article on detox, the family page. |
| `/leczenie-narkomanii` | "leczenie narkomanii", "ośrodek dla narkomanów" | Detox and safety qualification language; which substances the centre accepts (client to confirm). |
| `/leczenie-lekomanii` | "uzależnienie od leków", "benzodiazepiny odstawienie" | Careful medical wording; psychiatric qualification; tapering is a doctor's decision. Doctor review required. |
| `/leczenie-hazardu` | "uzależnienie od hazardu leczenie" | Behavioural addiction: no detox section; debt and family topics instead. |

- **Each page contains:** how this addiction shows up (signs, without diagnosing); how treatment here works for it (detox yes/no, length, programme); what's specific (e.g. medication tapering); the related screening test, if one exists; FAQ block (4–6 questions); links to the supporting articles; call block.
- **Schema:** `BreadcrumbList`, `FAQPage`. Optionally `MedicalWebPage` with `about` → `MedicalCondition`, but only after the lawyer has seen the copy.
- **Effort:** 0.5 day each once the template exists.

### 9. NFZ path (page or article)

- **Intent:** "ile czeka się na leczenie odwykowe na NFZ", "NFZ czy prywatnie", "skierowanie na odwyk".
- **Content:** an honest explanation of the public path, the waiting times and how it differs from private treatment. The SEO strategy (§3.4) treats this as the most underserved topic, and it is safe under art. 14 because it explains the system rather than advertising.
- **Form:** most likely an article in `/porady`, linked from the treatment pages and `/cennik`.

## Shared technical work (do first)

1. **Intent-page template:** a `SubpageLayout`-based page with the existing building blocks — `PageIntro`, `Section`, `FaqList`, `ArticleCard` row, call block — so each page above is content plus a route. About 1 day.
2. **Decide where the copy lives.** Two options:
   - **Code (`src/content/*.ts`)**, like the launch pages. Fastest. Every edit needs a deploy.
   - **CMS "Strony"** (`pages` table, now hidden in the admin). Wire a public route for it, using the block editor that already exists, then un-hide the section. About 1.5 days, and the client can edit the pages themselves. **Recommended**, because these pages will be revised as the clusters grow.
3. **Navigation:** add a "Leczenie" group to the header (the nav already supports groups — see "O nas") and the footer. Point "Pierwszy kontakt" at the new page.
4. **Sitemap:** add the routes to `STATIC_ROUTES` in `src/app/sitemap.ts`, or read published CMS pages there if option 2 is chosen.
5. **FAQ categories:** create FAQ categories in the admin (e.g. `rodzina`, `detoks`, `alkohol`) so each page can embed its own questions (`getPublishedFaq(category)` already supports it).
6. **Articles:** add an optional "related page" field to articles, so the treatment pages can list their cluster automatically. About 0.5 day.

## What the client needs to supply

- Copy for each page, or approval of a writer's drafts.
- A therapist's review of all pages, and the doctor's review of the detox and medication pages.
- The lawyer's read under art. 14.
- Which substances and conditions the centre accepts and which it refers elsewhere.
- Real photos where a page uses one (no stock — SEO strategy §3.2).

## Order and estimate

1. Template plus the CMS route (2.5 days).
2. `/pierwszy-kontakt` and `/dla-rodziny` — the two biggest conversion intents (1 day).
3. `/detoks-i-kwalifikacja` and `/leczenie-alkoholizmu` — the biggest cluster (1 day).
4. The remaining three treatment pages and `/dla-osoby-szukajacej-pomocy` (2 days).
5. The NFZ article, and the supporting articles at 3–4 a month (ongoing, client content).

About **6–7 dev days** in total, plus content and review time on the client's side.
