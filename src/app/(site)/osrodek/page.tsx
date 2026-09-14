import type { Metadata } from "next";

import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import { Container } from "@/components/site/ui/container";
import { Cta } from "@/components/site/ui/cta";
import { GalleryGrid } from "@/components/site/ui/gallery-grid";
import { Reveal } from "@/components/site/ui/reveal";
import { galeriaTeaserDefaults as galeria } from "@/content/galeria";
import { contactDefaults, kontaktDefaults, osrodekDefaults } from "@/content/home";
import { osrodekPageDefaults as copy } from "@/content/osrodek";
import { getGalleryTeaser } from "@/lib/queries/gallery";

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
};

/**
 * The place, at length: the journey and the packing list, opening on a handful
 * of photographs. The full set lives at /galeria — this band shows the first
 * few in the editor's order and hands off, so there is one place to manage
 * photos and one page that holds all of them.
 */
export const revalidate = 300;

export default async function OsrodekPage() {
  const photos = await getGalleryTeaser(galeria.limit);
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

        <section
          id="galeria"
          className="mt-section-sm scroll-mt-[calc(var(--nav-h-sticky)+12px)]"
        >
          <Reveal className="mb-[clamp(20px,2.4vw,32px)] flex flex-wrap items-end justify-between gap-4 border-t border-line-strong pt-[clamp(16px,1.8vw,26px)]">
            <div>
              <h2 className="font-heading text-display-sm text-ink-900">{galeria.title}</h2>
              <p className="mt-2 max-w-[32em] text-pretty text-lead text-ink-500">{galeria.lead}</p>
            </div>
            <Cta href={galeria.href}>{galeria.linkLabel}</Cta>
          </Reveal>

          {photos.length > 0 ? (
            <GalleryGrid photos={photos} />
          ) : (
            /* Nothing published yet: the section still reads as deliberate
               rather than collapsing to a bare heading. */
            <p className="max-w-[34em] text-body-lg text-ink-300">{galeria.emptyNote}</p>
          )}
        </section>

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
