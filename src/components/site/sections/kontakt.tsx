import { Container } from "@/components/site/ui/container";
import { Reveal } from "@/components/site/ui/reveal";
import { SectionRule } from "@/components/site/ui/section-rule";
import {
  contactDefaults,
  kontaktDefaults,
  type KontaktContent,
  type SiteContact,
} from "@/content/home";

export function Kontakt({
  content = kontaktDefaults,
  contact = contactDefaults,
}: {
  content?: KontaktContent;
  contact?: SiteContact;
}) {
  return (
    <section
      id="kontakt"
      className="scroll-mt-[calc(var(--nav-h-sticky)+12px)]"
    >
      <Container className="pt-section pb-[clamp(56px,7vw,96px)]">
        <SectionRule
          index={content.index}
          label={content.eyebrow}
          className="mb-[clamp(24px,2.8vw,40px)]"
        />

        <Reveal className="flex flex-wrap items-end justify-between gap-x-[72px] gap-y-10 bg-ink-900 px-[clamp(26px,4vw,72px)] py-[clamp(36px,5vw,88px)] text-on-dark-3">
          <div className="max-w-[23em] flex-[1_1_20em]">
            <p className="mb-[clamp(20px,2.4vw,30px)] text-pretty font-heading text-display text-on-dark">
              {content.title}
            </p>
            <p className="text-[15.5px] leading-[1.75] text-on-dark-muted">
              {content.privacyNote}
            </p>
          </div>

          <div className="flex flex-[0_1_19em] flex-col gap-3.5">
            <a
              href={`tel:${contact.phoneHref}`}
              className="font-heading text-[clamp(32px,3.4vw,46px)] leading-none tracking-[-0.035em] tabular-nums text-on-dark transition-colors hover:text-on-dark-sage-2"
            >
              {contact.phone}
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="border-t border-on-dark-3/16 pt-[13px] text-[15px] text-on-dark-muted transition-colors hover:text-on-dark"
            >
              {contact.email}
            </a>
            <span className="text-[13px] leading-[1.7] text-on-dark-faint">
              {contact.addressLine1}, {contact.addressLine2}
              <br />
              {contact.hours}
            </span>
          </div>
        </Reveal>

        {/*
          No scroll reveal on this row: it is the last content before the
          footer, and a view()-driven animation froze here mid-fade.
        */}
        <div className="mt-gap flex flex-wrap gap-gap">
          <div className="relative aspect-[21/9] min-w-0 flex-[2_1_420px] overflow-hidden border border-line bg-stone">
            <iframe
              title={content.map.title}
              loading="lazy"
              src={content.map.embedSrc}
              className="absolute inset-0 block size-full border-0"
            />
          </div>

          <div className="flex flex-[1_1_280px] flex-col justify-between gap-6 border border-line bg-bone p-[clamp(24px,2.4vw,34px)]">
            <div>
              <span className="mb-4 block text-eyebrow uppercase tracking-[0.2em] text-clay-600">
                Dojazd
              </span>
              {content.travel.map((row, i) => (
                <div
                  key={row.label}
                  className={
                    i === content.travel.length - 1
                      ? "flex items-baseline justify-between gap-4 pt-3"
                      : "flex items-baseline justify-between gap-4 border-b border-line-strong pb-3 [&:not(:first-child)]:pt-3"
                  }
                >
                  <span className="text-sm text-ink-300">{row.label}</span>
                  <span className="font-heading text-[18px] tracking-[-0.025em] tabular-nums text-ink-900">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <div>
              <p className="mb-3.5 text-sm leading-[1.7] text-ink-300">
                {content.travelNote}
              </p>
              <a
                href={content.mapsHref}
                target="_blank"
                rel="noopener"
                className="link-arrow text-[14.5px] text-sage-600 transition-colors hover:text-sage-700"
              >
                <span>{content.mapsLabel}</span>
                <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
