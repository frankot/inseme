import type { Metadata } from "next";

import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import { Container } from "@/components/site/ui/container";
import { Cta } from "@/components/site/ui/cta";
import { FaqList } from "@/components/site/ui/faq-list";
import { JsonLd } from "@/components/site/ui/json-ld";
import { faqDefaults } from "@/content/home";
import { getPublishedFaq } from "@/lib/queries/faq";
import { getSiteContact } from "@/lib/queries/settings";
import { faqJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Pytania i odpowiedzi — ośrodek leczenia uzależnień Insieme",
  description:
    "Odpowiedzi na pytania, które trudno zadać na głos: poufność, koszty, skierowanie, kontakt z rodziną, przyjazd do ośrodka.",
  alternates: { canonical: "/faq" },
};

/** Prerendered, refreshed every five minutes — see the homepage for the why. */
export const revalidate = 300;

/**
 * Every published question. The homepage carries the first five and links here.
 * The page intro already states the heading and the note, so this renders the
 * bare accordion rather than the homepage's `Faq` section.
 */
export default async function PytaniaPage() {
  const contact = await getSiteContact();
  const items = await getPublishedFaq();

  return (
    <SubpageLayout
      eyebrow={faqDefaults.eyebrow}
      title={faqDefaults.title}
      lead={faqDefaults.note}
      breadcrumb={[{ label: "Strona główna", href: "/" }, { label: "Pytania" }]}
    >
      {items.length > 0 && <JsonLd data={faqJsonLd(items)} />}
      <Container className="pb-section-lg">
        {items.length === 0 ? (
          <p className="max-w-[34em] border-t border-line pt-[clamp(24px,3vw,40px)] text-body-lg text-ink-300">
            Pytania pojawią się tu wkrótce. W międzyczasie — zadzwoń, odpowiadamy tak
            samo przez telefon.
          </p>
        ) : (
          <div className="max-w-[52em] border-t border-line-strong">
            <FaqList items={items} />
          </div>
        )}

        <Cta
          href={`tel:${contact.phoneHref}`}
          variant="solid"
          className="mt-[clamp(24px,3vw,40px)]"
        >
          Nie ma tu Twojego pytania? Zadzwoń — {contact.phone}
        </Cta>
      </Container>
    </SubpageLayout>
  );
}
