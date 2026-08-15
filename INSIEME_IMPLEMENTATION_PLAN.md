# Insieme website rework — implementation plan

## 0. Current scope interpretation

This plan is based on the final SMS scope and the website/SEO parts of the earlier brief. The earlier full Google Ads audit is treated as partially revoked.

### Included
- Website strategy and architecture for organic visibility.
- Full redesign and implementation of the website.
- CMS for editing key pages, team, FAQ, articles, contact data and basic SEO fields.
- A small initial set of SEO/help articles.
- Basic on-page SEO: metadata, headings, URLs, schema, sitemap, robots, internal linking.
- Lead measurement setup: GA4/GTM events for phone, form, email, WhatsApp/directions where used.
- Google Business Profile basics: NAP consistency, categories, description, photos, website link, service info.
- Hosting setup, launch support and small post-launch fixes.
- Light Google Ads review: identify obvious waste and suggest what to pause/limit, but not a paid full audit or ongoing ads management.

### Not included unless separately agreed
- Full Google Ads audit/management.
- Legal opinion, medical compliance opinion or RODO audit by a lawyer.
- Advanced call tracking/CRM/lead status pipeline.
- Ongoing SEO/content publishing after launch.
- Professional photography/video production.
- Specialist medical copywriting without review by the center’s therapist/doctor.

---

## 1. Grill questions — decisions to lock before implementation

Each question includes the recommended answer to avoid blocking the project.

### 1. What is the hard scope for ~10k PLN?
**Question:** Is ~10k meant to include all listed pages, CMS, articles, hosting, SEO and analytics, or is it an approximate package that may grow after functional scope is fixed?

**Recommended answer:** Treat 10k PLN as a lean launch package. Use reusable page templates and limit revision rounds. Lock a “core launch” plus 3 initial articles. Put advanced content expansion and ongoing SEO in phase 2.

### 2. Which domain becomes the only official source?
**Question:** Are there currently two similar websites/domains? Which one will remain canonical?

**Recommended answer:** One official domain only. The weaker/secondary site should be redirected page-by-page where possible. Do not keep a separate addiction landing page that looks like a lead-generation workaround.

### 3. Can the client provide access to Search Console / current CMS / hosting?
**Question:** Do we have access to current URLs, rankings, indexation, analytics and hosting?

**Recommended answer:** Require at least read access before final URL map. Without it, build a crawler-based redirect map and warn that hidden URLs may be missed.

### 4. Who approves medical/legal wording?
**Question:** Who confirms wording around detox, psychiatric care, admissions, documentation, contraindications, L4/certificates and family communication?

**Recommended answer:** One named person from the center reviews all factual/medical content. Website copy stays informational, not promotional. Anything legally sensitive remains conservative.

### 5. How transparent can pricing be?
**Question:** Can the site publish ranges, example scenarios, or only explain pricing factors?

**Recommended answer:** If exact prices cannot be published, clearly explain what affects cost and what is included in the stay. Avoid “price only by phone” feeling.

### 6. What happens if someone needs detox first?
**Question:** Can Insieme accept patients needing detox, or must they be referred externally first?

**Recommended answer:** Create a careful “Detoks i kwalifikacja” page explaining that admission depends on safety and condition. Do not promise immediate acceptance.

### 7. Is phone contact the main conversion?
**Question:** Which channels matter most: phone, form, WhatsApp, email, directions, Google Business Profile calls?

**Recommended answer:** Phone-first. Secondary: confidential form. WhatsApp only if the center can safely handle sensitive communication there. Every form needs privacy reassurance and minimal fields.

### 8. Can the site use real photos?
**Question:** Are current team/place photos good enough, or is a photo day needed?

**Recommended answer:** Use real photos even if imperfect. Avoid stock crisis imagery. If budget allows later, do a professional calm documentary-style shoot.

### 9. How much can team profiles disclose?
**Question:** Can each team member provide qualifications, role, experience area and short bio?

**Recommended answer:** Yes. Team is a primary trust asset. Use short scan-friendly cards with optional expanded bio.

### 10. What CMS editing level is expected?
**Question:** Should the client edit full layouts or only structured content?

**Recommended answer:** Structured CMS, not page-builder chaos. Editors should manage text, images, FAQ, team, articles, metadata, redirects and contact info. Layout remains controlled for quality and performance.

### 11. What is the tracking/privacy posture?
**Question:** Can we use GA4/GTM, form tracking and call-click tracking given health-related context?

**Recommended answer:** Use privacy-minimal analytics. Track interaction events, not sensitive content. Avoid remarketing by default. Add cookie/consent handling if non-essential tracking is used.

### 12. Who owns post-launch maintenance?
**Question:** After launch, who handles backups, CMS updates, security patches, small fixes and content additions?

**Recommended answer:** Include a short stabilization window. Offer ongoing technical care separately.

---

## 2. Core website strategy

### Strategic position
The website should position Insieme as:

> A calm, confidential place near Warsaw that helps an addicted person and their family understand the situation, make first contact and start the appropriate stage of treatment safely.

It should not feel like:

> “Best private rehab, effective therapy, call now.”

### Main user states
1. Panic: “Something bad is happening. I need to know what to do.”
2. Shame: “I’m afraid to say this out loud.”
3. Family crisis: “I’m calling for someone close. I don’t know if I’m allowed.”
4. Practical evaluation: “Is this real, safe, confidential and within reach?”
5. Medical uncertainty: “Is detox needed? Can they accept this case?”

### Main promise of the interface
Do not sell therapy. Explain what happens next.

The site should repeatedly lower the threshold to contact:

> “You do not need to have everything organized. First we calmly establish what kind of help makes sense.”

---

## 3. Recommended information architecture

### Core launch pages
These should be launched together because they form the trust/conversion path.

| Page | Purpose |
|---|---|
| Home | Calm overview, trust proof, first step, contact. |
| Jak wygląda pierwszy kontakt | Most important conversion page: what happens before/after calling. |
| Jak wygląda przyjęcie | Step-by-step admission, first day, documents, what to bring. Can be combined with first contact if scope must be reduced. |
| Dla osoby szukającej pomocy | Directly addresses shame, fear, uncertainty. |
| Dla rodziny i bliskich | Explains how family can call and support without pressure. |
| Terapia stacjonarna | Daily rhythm, therapy formats, safety, privacy, boundaries. |
| Leczenie alkoholizmu | Natural service page for alcohol addiction intent. |
| Leczenie narkomanii | Service page with detox/safety qualification language. |
| Leczenie lekomanii | Careful medical language, medication safety, psychiatric qualification. |
| Leczenie hazardu | Behavioral addiction page. |
| Detoks i kwalifikacja | Clarifies when detox is needed and when admission may not be immediate. |
| Ośrodek | Location, privacy, rooms, therapy spaces, rules, amenities second. |
| Zespół | Human, scannable profiles with qualifications and roles. |
| Cennik | Transparent explanation of pricing factors and what is clarified by phone. |
| FAQ | Real questions people are afraid to ask. |
| Kontakt | Phone-first, short form, map, privacy note. |
| Poradnik | Article index for SEO growth. |
| Polityka prywatności / cookies | Required privacy and tracking explanation. |

### If scope must be reduced for 10k
Priority order:
1. Home
2. First contact/admission combined page
3. For family
4. For person seeking help
5. Therapy residential
6. Center
7. Team
8. Pricing
9. FAQ
10. Contact
11. 3 initial articles
12. Then add service pages as SEO phase 2

### Recommended initial articles
1. “Czy mogę zadzwonić do ośrodka w imieniu bliskiej osoby?”
2. “Czy przed terapią uzależnień potrzebny jest detoks?”
3. “Jak wygląda pierwszy dzień w ośrodku terapii uzależnień?”
4. Optional: “Jak rozmawiać z osobą uzależnioną, która nie chce pomocy?”

---

## 4. Homepage structure

1. **Hero**
   - H1: “Prywatny ośrodek terapii uzależnień w Magdalence pod Warszawą”
   - Calm subheading about first contact, qualification and residential therapy.
   - Primary CTA: “Zadzwoń i zapytaj o możliwość przyjęcia”
   - Secondary CTA: “Napisz poufnie”
   - Microcopy below phone: “Nie musisz wiedzieć, co dokładnie powiedzieć...”

2. **Trust row**
   - Registered medical entity if true.
   - Therapeutic and psychiatric care if true.
   - Family support.
   - Quiet center near Warsaw.
   - Admission can be discussed by phone.

3. **Choose your path**
   - “Szukam pomocy dla siebie”
   - “Dzwonię w sprawie bliskiej osoby”
   - “Chcę zrozumieć, jak wygląda przyjęcie”

4. **What happens after the call**
   - 3–5 step process: call, situation assessment, qualification/detox decision, admission details, first day.

5. **Treatment scope**
   - Alcohol, drugs, medication, gambling, residential therapy, family support.

6. **The place**
   - Real location and privacy. Amenities are secondary.

7. **Team preview**
   - 3–5 selected people + link to full team.

8. **Pricing transparency preview**
   - What affects cost, what will be explained during the call.

9. **FAQ preview**
   - Top 6 questions.

10. **Final contact block**
   - Phone-first, short form, privacy reassurance.

---

## 5. Copy and tone rules

### Use
- calm, concrete, human, medically cautious, non-judgmental language.
- “pomagamy”, “wyjaśniamy”, “wspólnie ustalamy”, “rozmowa służy zrozumieniu sytuacji”.
- short paragraphs, plain Polish, no overloaded medical jargon.
- direct answers to uncomfortable questions.

### Avoid
- “najlepszy”, “najskuteczniejszy”, “gwarantujemy”, “odzyskasz życie”, “zrób pierwszy krok teraz”, “nie zwlekaj”.
- repeated exact-match SEO phrases.
- fake urgency.
- stock images of alcohol, pills, crying people.
- excessive testimonials as proof.

### Editorial rule
Every page must answer:
1. Who is this for?
2. What situation does it help clarify?
3. What happens next?
4. What are the safety/privacy boundaries?
5. How can someone contact without pressure?

---

## 6. Visual direction

### Desired feeling
Private mental-health clinic, quiet house near Warsaw, competent people, safe first conversation. Not a sales landing page, not a luxury spa, not a dramatic addiction campaign.

### Palette direction
- Warm white / ivory base.
- Muted sage and moss greens.
- Soft brown/walnut accents.
- High-contrast calm ink for text.
- Avoid red urgency colors except for technical errors.

### Typography
- Large, highly readable body type.
- Restrained headings with a human/editorial feel.
- Strong mobile readability for older family members and people under stress.

### Signature design element
Use a “first-contact path” motif: quiet step cards that show the actual journey from phone call to admission. This becomes the visual language of the site: calm sequence, not persuasion.

### Photography
- Real place, real team, real rooms, real surroundings.
- Bright, honest, documentary-style.
- No luxury hotel framing as the main message.
- No patients unless explicit legal/RODO-safe consent and strong reason.

---

## 7. Technical implementation plan

### Recommended stack
- Next.js App Router for fast, SEO-friendly pages.
- Server Components by default; client components only for interactive FAQ, mobile navigation, forms and analytics hooks.
- Tailwind/CSS variables for a controlled design system.
- CMS with structured content types, not freeform page builder.
- Image optimization, responsive images, lazy loading where appropriate.
- Hosting on a stable managed platform with preview deployments and SSL.

### CMS content types
- Global settings: phone, email, address, hours, social links, privacy note.
- Pages: title, hero, sections, metadata, slug.
- Team members: name, role, qualifications, short bio, long bio, photo, order.
- FAQ: question, answer, category, order.
- Articles: title, slug, excerpt, body, author/reviewer, date, metadata.
- Service pages: problem type, intro, safety notes, process, FAQ.
- Redirects: old URL → new URL.
- Media library.

### Forms
- Minimal fields: name optional, phone/email, message, preferred contact method.
- Clear privacy note near submit.
- Spam protection/rate limiting.
- No sensitive dropdowns unless medically/legal approved.
- Server-side validation.
- Confirmation message: calm and specific, no promises.

### Accessibility
- WCAG 2.2 AA target.
- Proper headings, labels, focus states, contrast, keyboard navigation.
- Tap targets sized for mobile.
- Reduced motion support.
- Plain-language content.

### Performance
- Static/ISR pages where possible.
- Optimized fonts and images.
- Target green Core Web Vitals on mobile.
- Avoid heavy sliders, popups, chat widgets and unused scripts.

### Security/operations
- SSL, secure headers, environment variables.
- CMS auth with strong passwords/2FA if available.
- Regular backups if database-backed CMS.
- 404 page with contact option.
- Maintenance notes for plugin/package updates.

---

## 8. SEO plan

### SEO principle
Helpful informational architecture first, keywords second. The site should earn organic leads by answering real questions better than keyword-stuffed competitors.

### Keyword/intent clusters
1. **Local/private center**
   - private addiction therapy center near Warsaw, Magdalenka, Mazowieckie.
2. **Admission/process**
   - how admission works, first contact, what to bring, can family call.
3. **Treatment type**
   - alcohol, drugs, medication addiction, gambling.
4. **Detox/qualification**
   - when detox is needed, when immediate admission is unsafe.
5. **Family support**
   - how to help close person, what to say, intervention-like questions without aggressive language.
6. **Practical/cost**
   - price factors, stay duration, privacy, phone, visits, documents.

### URL structure
Examples:
- `/`
- `/pierwszy-kontakt`
- `/jak-wyglada-przyjecie`
- `/dla-osoby-szukajacej-pomocy`
- `/dla-rodziny`
- `/terapia-stacjonarna`
- `/leczenie-alkoholizmu`
- `/leczenie-narkomanii`
- `/leczenie-lekomanii`
- `/leczenie-hazardu`
- `/detoks-i-kwalifikacja`
- `/osrodek`
- `/zespol`
- `/cennik`
- `/faq`
- `/kontakt`
- `/poradnik/[slug]`

### On-page SEO checklist
- Unique H1 per page.
- One clear search intent per page.
- Metadata for every indexable page.
- Breadcrumbs.
- Internal links between related pages.
- FAQ sections where useful.
- Optimized image filenames/alt text.
- Canonicals.
- XML sitemap.
- Robots.txt.
- Open Graph metadata.

### Schema
Use carefully:
- `Organization` / `LocalBusiness` or suitable medical/local schema after verification.
- `Person` for team members.
- `FAQPage` for FAQ content.
- `BreadcrumbList`.
- `Article` for poradnik pages.

### Migration SEO
1. Crawl/export all current URLs.
2. Map every old URL to the closest new URL.
3. Preserve valuable slugs where sensible.
4. Add 301 redirects.
5. Submit sitemap in Search Console.
6. Monitor 404s and indexing after launch.

### Google Business Profile
- Confirm exact NAP.
- Link only to canonical website.
- Update description in informational, non-promotional style.
- Add real photos.
- Add services/categories if available and accurate.
- Check that UTM tracking does not break trust or privacy.

---

## 9. Lead measurement plan

### Basic GA4/GTM events
- `click_phone_header`
- `click_phone_sticky`
- `click_phone_contact`
- `click_email`
- `click_whatsapp` if used
- `form_start`
- `form_submit`
- `directions_click`
- `faq_open` optional

### Rules
- Do not send message text, diagnosis, substance type or other sensitive health details to analytics.
- Do not enable remarketing by default.
- Treat “phone click” as a lead signal, not proof of a real conversation.
- If advanced call tracking is added later, review RODO/legal implications first.

### Reporting after launch
Monthly minimum:
- organic sessions,
- search queries from Search Console,
- top landing pages,
- phone/form interaction counts,
- indexed pages,
- 404/redirect issues,
- article opportunities from real search terms.

---

## 10. Delivery phases

### Phase 1 — Discovery and access
- Confirm canonical domain.
- Collect accesses: current CMS/hosting, Search Console, GA4/GTM if present, Google Business Profile.
- Collect team data, photos, registration details, contact rules, admission rules, pricing rules.
- Confirm revoked Ads scope in writing.

**Output:** locked scope, access checklist, risk list.

### Phase 2 — Strategy, sitemap, SEO map
- Final sitemap.
- Page purpose per URL.
- Keyword/intent map.
- Redirect strategy.
- Content outline for every page.

**Output:** approved architecture and SEO/content blueprint.

### Phase 3 — Copy and content production
- Rewrite core pages in calm informational tone.
- Prepare FAQ.
- Prepare 3 initial articles.
- Team profiles converted into scannable format.
- Client medical/factual review.

**Output:** approved page copy ready for implementation.

### Phase 4 — Visual design
- Design system: colors, type, spacing, buttons, cards, FAQ, forms.
- Homepage mockup.
- Key subpage template.
- Article/service page template.
- Mobile states.

**Output:** approved visual direction before build.

### Phase 5 — Build and CMS
- Set up Next.js project and CMS.
- Build layouts and components.
- Add all approved content.
- Implement responsive behavior.
- Configure forms and notifications.
- Add redirects.

**Output:** staging website ready for testing.

### Phase 6 — SEO, analytics and QA
- Metadata, schema, sitemap, robots.
- GA4/GTM events.
- Search Console preparation.
- Accessibility pass.
- Performance pass.
- Mobile QA.
- Form test.
- Redirect test.

**Output:** launch-ready website.

### Phase 7 — Launch
- DNS/hosting cutover.
- SSL check.
- Submit sitemap.
- Verify redirects.
- Verify forms and phone links.
- Update Google Business Profile website link.

**Output:** new live website.

### Phase 8 — Stabilization
- Fix launch bugs.
- Monitor Search Console and 404s.
- Check lead events.
- Minor text/image corrections.
- Hand over CMS instructions.

**Output:** stable site and handoff.

---

## 11. Acceptance criteria

The project is ready when:
- One canonical website is live.
- Core pages are indexable and have metadata.
- Redirects from old important URLs work.
- CMS editing works for agreed content types.
- Contact form delivers messages and has privacy note.
- Phone/email/WhatsApp clicks are tracked without sensitive data.
- Sitemap and robots are live.
- Search Console and GA4 are connected.
- Google Business Profile has consistent NAP and canonical link.
- Mobile performance and usability are good.
- Tone avoids medical advertising claims and aggressive selling.

---

## 12. Main risks

| Risk | Mitigation |
|---|---|
| Scope too large for 10k | Lock core launch, reuse templates, limit revisions, phase optional content. |
| No access to old site data | Crawl current site and build best-effort redirects; monitor 404s post-launch. |
| Legal/medical uncertainty | Client-side factual review; conservative wording; no treatment guarantees. |
| Weak photo assets | Use real available photos, crop carefully; plan later photo session. |
| Tracking sensitive data | Track only interaction events; avoid message contents and remarketing. |
| SEO drop after migration | URL map, 301 redirects, sitemap, Search Console monitoring. |
| Client expects Ads audit | Confirm in writing: light review only, not full paid audit/management. |

---

## 13. Recommended immediate next steps

1. Confirm final scope and budget boundary.
2. Choose canonical domain.
3. Provide access list or confirm what is unavailable.
4. Confirm page list for launch.
5. Confirm who reviews medical/legal wording.
6. Collect photos, team details and admission/pricing rules.
7. Start sitemap + redirect map + content outline.
