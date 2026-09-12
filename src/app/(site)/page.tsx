import type { Metadata } from "next";

import { Faq } from "@/components/site/sections/faq";
import { Hero } from "@/components/site/sections/hero";
import { JedenDzien } from "@/components/site/sections/jeden-dzien";
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
import { getScreeningTestBySlug } from "@/lib/queries/screening";
import { getFeaturedTeam } from "@/lib/queries/team";

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
  const [featuredTeam, featuredTest] = await Promise.all([
    getFeaturedTeam(3),
    getScreeningTestBySlug(FEATURED_TEST_SLUG),
  ]);

  return (
    <ContactPathProvider>
      <Hero />
      <Sciezki />
      <Osrodek />
      <Zespol members={featuredTeam} />
      <PierwszyKontakt />
      <Program />
      <JedenDzien />
      <Testimonial />
      <TestPrzesiewowy test={featuredTest} />
      <Faq />
      <Kontakt />
    </ContactPathProvider>
  );
}
