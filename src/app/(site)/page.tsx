import type { Metadata } from "next";

import { Artykuly } from "@/components/site/sections/artykuly";
import { Faq } from "@/components/site/sections/faq";
import { Hero } from "@/components/site/sections/hero";
import { Kontakt } from "@/components/site/sections/kontakt";
import { Osrodek } from "@/components/site/sections/osrodek";
import { PierwszyKontakt } from "@/components/site/sections/pierwszy-kontakt";
import { Program } from "@/components/site/sections/program";
import { Sciezki } from "@/components/site/sections/sciezki";
import { TestPrzesiewowy } from "@/components/site/sections/test-przesiewowy";
import { Testimonial } from "@/components/site/sections/testimonial";
import { Zespol } from "@/components/site/sections/zespol";
import { ContactPathProvider } from "@/components/site/ui/contact-path";
import { FEATURED_TEST_SLUG } from "@/content/screening";
import { getLatestArticles } from "@/lib/queries/articles";
import { getPublishedFaq } from "@/lib/queries/faq";
import { getScreeningTestBySlug } from "@/lib/queries/screening";
import { getFeaturedTeam } from "@/lib/queries/team";

/**
 * The page is prerendered and refreshed every five minutes, so a published
 * article, a new person or an edited question appears without a deploy. The
 * admin actions also revalidate this path, which makes the window a backstop
 * rather than the only route from the CMS to the site.
 */
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Insieme — ośrodek terapii uzależnień w Magdalence pod Warszawą",
  description:
    "Prywatny ośrodek leczenia uzależnień w Magdalence. Detoks, terapia stacjonarna, wsparcie dla rodziny. Rozmowa nie zobowiązuje do przyjazdu.",
};

/**
 * Sections take their copy as props and fall back to the defaults in
 * `src/content/home.ts`. Zespół is the first that reads real rows — the rest
 * follow the same shape when their tables get wired up.
 */
export default async function HomePage() {
  const [featuredTeam, featuredTest, faqEntries, latestArticles] = await Promise.all([
    getFeaturedTeam(3),
    getScreeningTestBySlug(FEATURED_TEST_SLUG),
    getPublishedFaq(),
    getLatestArticles(4),
  ]);

  return (
    <ContactPathProvider>
      <Hero />
      <Sciezki />
      <Osrodek />
      <Zespol members={featuredTeam} />
      <PierwszyKontakt />
      <Program />
      <Testimonial />
      <TestPrzesiewowy test={featuredTest} />
      <Faq items={faqEntries} />
      <Artykuly articles={latestArticles} />
      <Kontakt />
    </ContactPathProvider>
  );
}
