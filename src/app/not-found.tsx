import type { Metadata } from "next";

import { SiteFooter } from "@/components/site/chrome/site-footer";
import { StickyCallBar } from "@/components/site/chrome/sticky-call-bar";
import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import { Container } from "@/components/site/ui/container";
import { Cta } from "@/components/site/ui/cta";
import { contactDefaults } from "@/content/home";

export const metadata: Metadata = {
  title: "Nie ma takiej strony — Insieme",
  robots: { index: false },
};

/**
 * Every unmatched URL, and any `notFound()` without a closer not-found file.
 * This renders under the root layout only, not `(site)/layout`, so it brings
 * the footer and call bar itself. Old links from the previous site land here
 * until the redirect map catches them — so the phone number comes first.
 */
export default function NotFound() {
  return (
    <>
      <main className="flex-auto overflow-x-clip bg-cream">
        <SubpageLayout
          eyebrow="Błąd 404"
          title="Nie ma takiej strony."
          lead="Ten adres mógł się zmienić po przebudowie strony. Jeśli szukasz pomocy, nie musisz go szukać dalej — zadzwoń, odbiera terapeuta."
        >
          <Container className="flex flex-wrap items-center gap-x-8 gap-y-4 pb-section-lg">
            <Cta href={`tel:${contactDefaults.phoneHref}`} variant="solid" className="tabular-nums">
              Zadzwoń: {contactDefaults.phone}
            </Cta>
            <Cta href="/">Strona główna</Cta>
          </Container>
        </SubpageLayout>
      </main>
      <SiteFooter />
      <StickyCallBar />
    </>
  );
}
