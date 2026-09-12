import type { Metadata } from "next";

import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import { ContactForm } from "@/components/site/ui/contact-form";
import { Container } from "@/components/site/ui/container";
import { Reveal } from "@/components/site/ui/reveal";
import { kontaktDefaults } from "@/content/home";
import { kontaktPageDefaults as copy } from "@/content/kontakt";
import { getSiteContact } from "@/lib/queries/settings";

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
};

export default async function KontaktPage() {
  const contact = await getSiteContact();

  return (
    <SubpageLayout
      eyebrow={copy.eyebrow}
      title={copy.title}
      lead={copy.lead}
      breadcrumb={[
        { label: copy.breadcrumbHome, href: "/" },
        { label: copy.breadcrumbKontakt },
      ]}
      contact={contact}
    >
      <Container className="pb-section-lg">
        <div className="grid items-start gap-[clamp(28px,4vw,72px)] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          <Reveal>
            <h2 className="mb-3 text-pretty font-heading text-display-sm text-ink-900">
              {copy.formTitle}
            </h2>
            <p className="mb-6 max-w-[30em] text-[15.5px] leading-[1.72] text-ink-400">
              {copy.formNote}
            </p>
            <ContactForm contact={contact} />
          </Reveal>

          <Reveal delay={70} className="flex flex-col gap-gap">
            <div className="border border-line bg-bone p-[clamp(24px,2.4vw,34px)]">
              <span className="mb-4 block text-eyebrow uppercase tracking-[0.2em] text-clay-600">
                Telefon
              </span>
              <a
                href={`tel:${contact.phoneHref}`}
                className="font-heading text-[clamp(30px,3vw,42px)] leading-none tracking-[-0.035em] tabular-nums text-ink-900 transition-colors hover:text-sage-600"
              >
                {contact.phone}
              </a>
              <p className="mt-3 text-[14px] leading-[1.7] text-ink-300">{contact.hours}</p>
              <a
                href={`mailto:${contact.email}`}
                className="mt-4 block border-t border-line-strong pt-3 text-[15px] text-ink-500 transition-colors hover:text-sage-600"
              >
                {contact.email}
              </a>
              <p className="mt-4 text-[14px] leading-[1.7] text-ink-300">
                {contact.addressLine1}
                <br />
                {contact.addressLine2}
              </p>
            </div>

            <div className="relative aspect-[16/10] overflow-hidden border border-line bg-stone">
              <iframe
                title={kontaktDefaults.map.title}
                loading="lazy"
                src={kontaktDefaults.map.embedSrc}
                className="absolute inset-0 block size-full border-0"
              />
            </div>

            <div className="border border-line bg-sand p-[clamp(20px,2vw,28px)]">
              <span className="text-eyebrow uppercase tracking-[0.2em] text-clay-600">
                {copy.emergencyLabel}
              </span>
              <p className="mt-2 font-heading text-[26px] leading-none tracking-[-0.03em] tabular-nums text-ink-900">
                112
              </p>
              <p className="mt-3 text-[13.5px] leading-[1.7] text-ink-300">
                telefon zaufania
                <br />
                <span className="tabular-nums text-ink-500">800 12 02 89</span>
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </SubpageLayout>
  );
}
