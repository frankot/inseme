import type { Metadata } from "next";

import { Breadcrumb } from "@/components/site/chrome/page-intro";
import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import { Container } from "@/components/site/ui/container";
import { Cta } from "@/components/site/ui/cta";
import { GalleryGrid } from "@/components/site/ui/gallery-grid";
import { Reveal } from "@/components/site/ui/reveal";
import { Section } from "@/components/site/ui/section";
import { SiteImage } from "@/components/site/ui/site-image";
import { Slab } from "@/components/site/ui/slab";
import { galeriaTeaserDefaults as galeria } from "@/content/galeria";
import {
  contactDefaults,
  kontaktDefaults,
  osrodekDefaults,
  type OsrodekContent,
} from "@/content/home";
import { osrodekPageDefaults as copy } from "@/content/osrodek";
import { getGalleryTeaser } from "@/lib/queries/gallery";

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: { canonical: "/osrodek" },
};

/**
 * The place, at length — the long form of the homepage's 03 band, and built out
 * of the same parts: the captioned photographs and the same masthead over every
 * block after the opening.
 *
 * It runs as bands rather than one container of stacked blocks, because that is
 * what the rest of the site does: a cream sheet, the dark ground under it, a
 * cream sheet again. The dark band in the middle is where the page stops to say
 * what the house actually is, and it carries the page's weight — a subpage that
 * is cream from the header to the footer reads as a document, not as the same
 * site the visitor just came from.
 */
export const revalidate = 300;

/** The salon photograph, which the dark band borrows from the homepage. */
const DARK_BAND_FIGURE = 2;

export default async function OsrodekPage() {
  // One more than the grid needs: the first published photo opens the page at
  // full width, and the rest fill the gallery band, so nothing appears twice.
  const [hero, ...photos] = await getGalleryTeaser(galeria.limit + 1);
  const heroImage = hero
    ? { src: hero.full.url, alt: hero.alt }
    : copy.heroFallback;
  const aspectsFigure = osrodekDefaults.figures[DARK_BAND_FIGURE];

  return (
    <SubpageLayout intro={false}>
      {/*
        The opening is one sheet rather than a page intro followed by a band:
        title and lead with the numbers people ask first beside them, then the
        house at full height, then where it is. It used to be three separate
        blocks — a title with an empty middle, a letterboxed photo with a card
        half-laid over it, and a masthead whose paragraphs read right, left,
        right. `mt-0` because this sheet has no band above it to overlap.
      */}
      <Slab raised className="mt-0 pt-section-sm">
        <Container>
          <Reveal>
            <div className="text-eyebrow uppercase tracking-[0.22em] text-clay-400">
              <Breadcrumb
                items={[
                  { label: copy.breadcrumbHome, href: "/" },
                  { label: copy.breadcrumbLabel },
                ]}
              />
            </div>

            <div className="mt-[clamp(18px,2vw,28px)] grid items-end gap-x-[clamp(32px,6vw,112px)] gap-y-[clamp(28px,3vw,40px)] desk:[grid-template-columns:minmax(0,1.25fr)_minmax(0,0.75fr)]">
              <div>
                <h1 className="text-pretty font-heading text-display text-ink-900">
                  {copy.title}
                </h1>
                <p className="mt-[clamp(14px,1.6vw,22px)] max-w-[30em] text-pretty text-lead text-ink-500">
                  {copy.lead}
                </p>
              </div>

              {/* A spec sheet, not stat tiles: label and value on one line,
                  read down the column like the travel times further on. */}
              <dl className="m-0 grid grid-cols-2 gap-x-[clamp(20px,3vw,40px)] border-t border-line-strong desk:grid-cols-1">
                {copy.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex flex-col gap-1 border-b border-line py-3 desk:flex-row desk:items-baseline desk:justify-between desk:gap-6"
                  >
                    <dt className="text-meta text-ink-400">{fact.label}</dt>
                    <dd className="m-0 font-heading text-[clamp(20px,1.7vw,24px)] leading-none tracking-[-0.025em] tabular-nums text-ink-900">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <Reveal as="figure" className="m-0 mt-section-sm">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone sm:aspect-[3/2] desk:aspect-[16/9]">
              <SiteImage
                src={heroImage.src}
                alt={heroImage.alt}
                fill
                priority
                sizes="(max-width: 1440px) 100vw, 1440px"
                className="object-cover saturate-[.92]"
              />
            </div>
            <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 text-meta text-ink-400">
              <span>{copy.heroCaption}</span>
              <span className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                <span>
                  {contactDefaults.addressLine1}, {contactDefaults.addressLine2}
                </span>
                <Cta href="#dojazd" className="text-meta">
                  {copy.statsLinkLabel}
                </Cta>
              </span>
            </figcaption>
          </Reveal>

          {/* Heading on the left, the answer on the right in reading order —
              the first paragraph is the answer, the rest explain it. */}
          <Reveal className="mt-section grid gap-x-[clamp(32px,6vw,112px)] gap-y-5 border-t border-line-strong pt-[clamp(24px,2.6vw,36px)] desk:[grid-template-columns:minmax(0,0.75fr)_minmax(0,1.25fr)]">
            <h2 className="font-heading text-display-sm text-ink-900">{copy.locationTitle}</h2>
            <div className="flex max-w-[38em] flex-col gap-4">
              <p className="text-pretty font-heading text-[clamp(19px,1.8vw,25px)] font-light leading-[1.4] tracking-[-0.022em] text-ink-900">
                {copy.location[0]}
              </p>
              {copy.location.slice(1).map((paragraph) => (
                <p key={paragraph} className="text-pretty text-body-lg text-ink-500">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </Container>
      </Slab>

      {/* The dark ground the two cream sheets are laid on. */}
      <Section
        tone="dark"
        raised={false}
        label={copy.aspectsEyebrow}
        title={copy.aspectsTitle}
        lead={copy.aspectsLead}
      >
        <div className="grid items-start gap-x-16 gap-y-[clamp(28px,3.2vw,46px)] tab:[grid-template-columns:minmax(0,0.78fr)_minmax(0,1.22fr)]">
          <Reveal
            as="figure"
            className="relative m-0 aspect-[4/5] w-full min-w-0 overflow-hidden bg-ink-900 tab:sticky tab:top-[calc(var(--nav-h-sticky)+clamp(20px,2.4vw,40px))]"
          >
            <SiteImage
              src={aspectsFigure.src}
              alt={aspectsFigure.alt}
              fill
              sizes="(max-width: 767px) 100vw, 34vw"
              className="object-cover saturate-[.92]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/80 via-ink-950/35 to-transparent px-[clamp(14px,1.4vw,22px)] pb-[clamp(12px,1.1vw,18px)] pt-[clamp(28px,3.4vw,48px)] text-[clamp(13px,0.95vw,15px)] leading-[1.45] text-bone">
              {aspectsFigure.caption}
            </figcaption>
          </Reveal>

          {/* A list, not cards: these are four answers to one question, and a
              reader compares them down the left edge. The numerals are the
              homepage's, borrowed to say the same thing on a smaller scale. */}
          <ul className="m-0 list-none border-t border-white/12 p-0">
            {copy.aspects.map((aspect, i) => (
              <Reveal
                as="li"
                key={aspect.title}
                delay={(i % 4) * 70}
                className="grid gap-x-[clamp(14px,1.6vw,26px)] border-b border-white/12 py-[clamp(20px,2.1vw,28px)] [grid-template-columns:auto_minmax(0,1fr)]"
              >
                <span
                  aria-hidden
                  className="pt-[3px] font-heading text-eyebrow tabular-nums text-on-dark-faint"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <span className="block text-eyebrow uppercase tracking-[0.2em] text-clay-300">
                    {aspect.title}
                  </span>
                  <h3 className="mt-2.5 max-w-[22em] text-pretty font-heading text-heading text-on-dark">
                    {aspect.lead}
                  </h3>
                  <p className="mt-2.5 max-w-[44em] text-pretty text-body text-on-dark-muted">
                    {aspect.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      <Section
        id="galeria"
        raised
        label={galeria.title}
        title={copy.galleryTitle}
        lead={galeria.lead}
        action={<Cta href={galeria.href}>{galeria.linkLabel}</Cta>}
      >
        {photos.length > 0 ? <GalleryGrid photos={photos} featured /> : <StockFigures />}
      </Section>

      {/* The warm ground is what gives a bone card its edge — see `Slab`. */}
      <Section
        tone="tinted"
        raised={false}
        label={copy.amenitiesEyebrow}
        title={copy.amenitiesTitle}
        lead={copy.amenitiesLead}
      >
        <div className="grid gap-gap [grid-template-columns:repeat(auto-fit,minmax(258px,1fr))]">
          {copy.amenities.map((amenity, i) => (
            <Reveal
              key={amenity.title}
              as="article"
              delay={(i % 4) * 70}
              className="card-surface flex min-w-0 flex-col gap-3 p-card"
            >
              <h3 className="font-heading text-[clamp(17px,1.45vw,21px)] leading-[1.3] tracking-[-0.025em] text-ink-900">
                {amenity.title}
              </h3>
              <p className="text-pretty text-meta text-ink-500">{amenity.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        raised
        label={copy.arrivalEyebrow}
        title={copy.arrivalTitle}
        lead={copy.arrivalLead}
      >
        <div className="grid items-start gap-x-16 gap-y-[clamp(30px,3.4vw,48px)] tab:[grid-template-columns:minmax(0,1fr)_minmax(0,1fr)]">
          <Reveal>
            <h3 className="font-heading text-heading text-ink-900">
              {copy.packingTitle}
            </h3>
            <p className="mt-3 mb-6 max-w-[32em] text-pretty text-lead text-ink-500">
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
            <h3 className="mb-6 font-heading text-heading text-ink-900">
              {copy.travelTitle}
            </h3>

            {/* The times are the answer most people scroll here for, so they
                get the page's one dark card rather than another hairline box. */}
            <div className="bg-ink-950 p-[clamp(24px,2.4vw,34px)]">
              {kontaktDefaults.travel.map((row, i) => (
                <div
                  key={row.label}
                  className={
                    i === kontaktDefaults.travel.length - 1
                      ? "flex items-baseline justify-between gap-4 pt-3"
                      : "flex items-baseline justify-between gap-4 border-b border-white/12 pb-3 [&:not(:first-child)]:pt-3"
                  }
                >
                  <span className="text-meta text-on-dark-muted">{row.label}</span>
                  <span className="font-heading text-[18px] tracking-[-0.025em] tabular-nums text-on-dark">
                    {row.value}
                  </span>
                </div>
              ))}

              <p className="mt-5 text-meta text-on-dark-faint">
                {kontaktDefaults.travelNote}
              </p>
              <Cta
                href={kontaktDefaults.mapsHref}
                variant="quiet-on-dark"
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
              className="mt-gap tabular-nums"
            >
              Zapytaj o przyjazd — {contactDefaults.phone}
            </Cta>
          </Reveal>
        </div>
      </Section>
    </SubpageLayout>
  );
}

/**
 * What the gallery band shows before anything is published: the homepage's own
 * four captioned photographs. The band used to collapse to a single grey line
 * of "zdjęcia pojawią się wkrótce", which left the middle of the page empty on
 * exactly the pages that need photographs most.
 */
function StockFigures({
  figures = osrodekDefaults.figures,
}: {
  figures?: OsrodekContent["figures"];
}) {
  return (
    <>
      <div className="grid gap-gap [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
        {figures.map((figure, i) => (
          <Reveal
            as="figure"
            key={figure.src}
            delay={(i % 4) * 70}
            className="group relative m-0 aspect-[4/3] min-w-0 overflow-hidden bg-stone"
          >
            <SiteImage
              src={figure.src}
              alt={figure.alt}
              fill
              sizes="(max-width: 1023px) 100vw, 25vw"
              className="object-cover saturate-[.92] transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/75 via-ink-950/35 to-transparent px-[clamp(12px,1.4vw,22px)] pb-[clamp(12px,1.1vw,18px)] pt-[clamp(28px,3.4vw,48px)] text-[clamp(13px,0.95vw,15px)] leading-[1.45] text-bone">
              {figure.caption}
            </figcaption>
          </Reveal>
        ))}
      </div>
      <p className="mt-[clamp(18px,2vw,26px)] text-meta text-ink-300">
        {galeria.emptyNote}
      </p>
    </>
  );
}
