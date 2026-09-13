import type { Metadata } from "next";

import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import { Container } from "@/components/site/ui/container";
import { Cta } from "@/components/site/ui/cta";
import { Reveal } from "@/components/site/ui/reveal";
import { SiteImage } from "@/components/site/ui/site-image";
import { contactDefaults, kontaktDefaults, osrodekDefaults } from "@/content/home";
import { osrodekPageDefaults as copy } from "@/content/osrodek";

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
};

/**
 * The place, at length: every photograph rather than the homepage's four, the
 * journey, and the packing list. The homepage band keeps the mosaic and links
 * here.
 */
export default function OsrodekPage() {
  return (
    <SubpageLayout
      eyebrow={copy.eyebrow}
      title={copy.title}
      lead={copy.lead}
      breadcrumb={[
        { label: copy.breadcrumbHome, href: "/" },
        { label: copy.breadcrumbLabel },
      ]}
    >
      <Container className="pb-section-lg">
        <Reveal className="grid grid-cols-2 gap-x-[clamp(20px,3vw,56px)] gap-y-7 md:grid-cols-4">
          {osrodekDefaults.stats.map((stat) => (
            <div key={stat.label} className="border-t border-line-warm pt-[14px]">
              <span className="block text-eyebrow uppercase tracking-[0.2em] text-clay-600">
                {stat.label}
              </span>
              <span className="mt-2.5 block font-heading text-[clamp(26px,2.4vw,34px)] leading-none tracking-[-0.03em] tabular-nums text-ink-900">
                {stat.value}
              </span>
            </div>
          ))}
        </Reveal>

        <div className="mt-section-sm grid gap-gap [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          {osrodekDefaults.figures.map((figure, i) => (
            <Reveal
              key={figure.src}
              as="figure"
              delay={(i % 3) * 70}
              className="group relative m-0 aspect-[4/3] min-w-0 overflow-hidden bg-stone"
            >
              <SiteImage
                src={figure.src}
                alt={figure.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
                className="object-cover saturate-[.92] transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/75 via-ink-950/35 to-transparent px-[clamp(12px,1.4vw,22px)] pb-[clamp(12px,1.1vw,18px)] pt-[clamp(28px,3.4vw,48px)] text-[clamp(13px,0.95vw,15px)] leading-[1.45] text-bone">
                {figure.caption}
              </figcaption>
            </Reveal>
          ))}
        </div>

        <div className="mt-section-sm grid items-start gap-x-16 gap-y-[clamp(30px,3.4vw,48px)] nav:[grid-template-columns:minmax(0,1fr)_minmax(0,1fr)]">
          <Reveal>
            <h2 className="mb-4 max-w-[14em] text-pretty font-heading text-display-sm text-ink-900">
              {copy.packingTitle}
            </h2>
            <p className="mb-6 max-w-[32em] text-pretty text-lead text-ink-500">
              {copy.packingLead}
            </p>
            <ul className="m-0 list-none border-t border-line-strong p-0">
              {copy.packing.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 border-b border-line py-3 text-body text-ink-600"
                >
                  <span aria-hidden className="mt-[11px] block h-px w-[11px] shrink-0 bg-clay-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-[32em] text-meta text-ink-300">{copy.packingNote}</p>
          </Reveal>

          <Reveal id="dojazd" className="scroll-mt-[calc(var(--nav-h-sticky)+12px)]">
            <h2 className="mb-6 font-heading text-display-sm text-ink-900">
              {copy.travelTitle}
            </h2>

            <div className="card-surface p-[clamp(24px,2.4vw,34px)]">
              {kontaktDefaults.travel.map((row, i) => (
                <div
                  key={row.label}
                  className={
                    i === kontaktDefaults.travel.length - 1
                      ? "flex items-baseline justify-between gap-4 pt-3"
                      : "flex items-baseline justify-between gap-4 border-b border-line-strong pb-3 [&:not(:first-child)]:pt-3"
                  }
                >
                  <span className="text-meta text-ink-300">{row.label}</span>
                  <span className="font-heading text-[18px] tracking-[-0.025em] tabular-nums text-ink-900">
                    {row.value}
                  </span>
                </div>
              ))}

              <p className="mt-5 text-meta text-ink-300">{kontaktDefaults.travelNote}</p>
              <Cta
                href={kontaktDefaults.mapsHref}
                target="_blank"
                rel="noopener"
                className="mt-4"
              >
                {kontaktDefaults.mapsLabel}
              </Cta>
            </div>

            <div className="relative mt-gap aspect-[21/9] overflow-hidden border border-line-strong bg-stone">
              <iframe
                title={kontaktDefaults.map.title}
                loading="lazy"
                src={kontaktDefaults.map.embedSrc}
                className="absolute inset-0 block size-full border-0"
              />
            </div>

            <Cta
              href={`tel:${contactDefaults.phoneHref}`}
              variant="solid"
              className="mt-gap"
            >
              Zapytaj o przyjazd — {contactDefaults.phone}
            </Cta>
          </Reveal>
        </div>
      </Container>
    </SubpageLayout>
  );
}
