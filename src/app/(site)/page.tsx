import type { Metadata } from "next";

import { Faq } from "@/components/site/sections/faq";
import { Hero } from "@/components/site/sections/hero";
import { JedenDzien } from "@/components/site/sections/jeden-dzien";
import { Kontakt } from "@/components/site/sections/kontakt";
import { Osrodek } from "@/components/site/sections/osrodek";
import { PierwszyKontakt } from "@/components/site/sections/pierwszy-kontakt";
import { Program } from "@/components/site/sections/program";
import { TestPrzesiewowy } from "@/components/site/sections/test-przesiewowy";
import { Testimonial } from "@/components/site/sections/testimonial";

export const metadata: Metadata = {
  title: "Insieme — ośrodek terapii uzależnień w Magdalence pod Warszawą",
  description:
    "Prywatny ośrodek leczenia uzależnień w Magdalence. Detoks, terapia stacjonarna, wsparcie dla rodziny. Rozmowa nie zobowiązuje do przyjazdu.",
};

/**
 * Sections take their copy as props and fall back to the defaults in
 * `src/content/home.ts`. When the CMS lands, fetch here and pass the rows
 * down — the components do not change.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Osrodek />
      <PierwszyKontakt />
      <Program />
      <JedenDzien />
      <Testimonial />
      <TestPrzesiewowy />
      <Faq />
      <Kontakt />
    </>
  );
}
