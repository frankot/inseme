import type { Metadata } from "next";

import { Faq } from "@/components/site/sections/faq";
import { Hero } from "@/components/site/sections/hero";
import { Kontakt } from "@/components/site/sections/kontakt";
import { Opinie } from "@/components/site/sections/opinie";
import { Osrodek } from "@/components/site/sections/osrodek";
import { PierwszyKontakt } from "@/components/site/sections/pierwszy-kontakt";
import { Program } from "@/components/site/sections/program";
import { TestPrzesiewowy } from "@/components/site/sections/test-przesiewowy";
import { Zespol } from "@/components/site/sections/zespol";
import { ContactPathProvider } from "@/components/site/ui/contact-path";
import { FEATURED_TEST_SLUG } from "@/content/screening";
import { getPublishedFaq } from "@/lib/queries/faq";
import { getScreeningTestBySlug } from "@/lib/queries/screening";
import { getFeaturedTeam } from "@/lib/queries/team";

/** How many questions the homepage carries before handing off to /pytania. */
const HOMEPAGE_FAQ_LIMIT = 5;

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
 * The homepage is a summary with a hierarchy, not the whole site.
 *
 * Its one job is the phone call, so the order runs: who you are and what
 * happens if you ring (01), the test for anyone not ready to ring (02), then
 * the proof a person weighs before dialling — the place, the price, the people,
 * the reviews — and only then the questions and the form.
 *
 * Everything below a summary's worth of depth lives on its own page: the day
 * plan and the therapy detail on /program, the gallery and logistics on
 * /osrodek, the full price list on /cennik, the rest of the questions on
 * /pytania. Each band here ends in the link to its page.
 */
export default async function HomePage() {
  const [featuredTeam, featuredTest, faqEntries] = await Promise.all([
    getFeaturedTeam(4),
    getScreeningTestBySlug(FEATURED_TEST_SLUG),
    getPublishedFaq(),
  ]);

  return (
    <ContactPathProvider>
      <Hero />
      <PierwszyKontakt />
      {/*
        Second, not seventh. Most people who ring are ringing about themselves,
        and for someone still asking "is this even a problem yet?" five questions
        are a far smaller step than a phone call — so the test is the secondary
        conversion path, and it belongs where that person is still reading.
      */}
      <TestPrzesiewowy test={featuredTest} />
      <Osrodek />
      <Program />
      <Zespol members={featuredTeam} />
      <Opinie />
      <Faq items={faqEntries} limit={HOMEPAGE_FAQ_LIMIT} />
      <Kontakt />
    </ContactPathProvider>
  );
}
