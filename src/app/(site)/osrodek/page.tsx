import type { Metadata } from "next";

import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import { Cta } from "@/components/site/ui/cta";
import { GalleryGrid } from "@/components/site/ui/gallery-grid";
import { Reveal } from "@/components/site/ui/reveal";
import { Section } from "@/components/site/ui/section";
import { SiteImage } from "@/components/site/ui/site-image";
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
};

/**
 * The place, at length — the long form of the homepage's 03 band, and built out
 * of the same parts: the four stat figures, the captioned photographs, and the
 * same masthead over every block.
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
    <SubpageLayout
      eyebrow={copy.eyebrow}
      title={copy.title}
      lead={copy.lead}
      breadcrumb={[
        { label: copy.breadcrumbHome, href: "/" },
        { label: copy.breadcrumbLabel },
      ]}
    >
      {/*
        The page opens on the house and answers "where is it" underneath. It
        used to open on four stat figures, which is a strange first thing to
        show someone deciding whether to bring a relative here — a photograph
        answers the actual question before any number does.
      */}
      <Section
        raised
        label={copy.locationEyebrow}
        title={copy.locationTitle}
        lead={copy.location[0]}
        above={
          <div className="mb-section-sm">
            <Reveal
              as="figure"
              className="relative m-0 aspect-[4/3] w-full overflow-hidden bg-stone nav:aspect-[21/9]"
            >
              <SiteImage
                src={heroImage.src}
                alt={heroImage.alt}
                fill
                priority
                sizes="100vw"
                className="object-cover saturate-[.92]"
              />
            </Reveal>

            {/*
              The figures sit on a dark panel laid over the photograph's bottom
              corner — the one place on the page where the numbers and the
              picture are the same object. Below the nav breakpoint there is no
              room to overlap anything, so the panel simply closes the figure.
            */}
            <Reveal className="relative shadow lg:-translate-x-2 z-10 rounded-slab bg-ink-950 px-[clamp(22px,3vw,44px)] py-[clamp(24px,2.6vw,36px)] nav:-mt-[clamp(48px,5vw,84px)] rounded-t-none  lg:rounded-slab -translate-y-1 lg:translate-y-0 nav:mr-[clamp(60px,13vw,240px)]">
              <dl className="m-0 grid grid-cols-2 gap-x-[clamp(20px,3vw,56px)] gap-y-7 md:grid-cols-4">
                {osrodekDefaults.stats.map((stat) => (
                  <div key={stat.label} className="border-t border-white/15 pt-[14px]">
                    <dt className="text-eyebrow uppercase tracking-[0.2em] text-clay-300">
                      {stat.label}
                    </dt>
                    <dd className="m-0 mt-2.5 font-heading text-[clamp(26px,2.4vw,34px)] leading-none tracking-[-0.03em] tabular-nums text-on-dark">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-[clamp(22px,2.4vw,32px)] flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-t border-white/12 pt-[clamp(16px,1.6vw,22px)]">
                <span className="text-meta text-on-dark-muted">
                  {contactDefaults.addressLine1}, {contactDefaults.addressLine2}
                </span>
                <Cta href="#dojazd" variant="quiet-on-dark">
                  {copy.statsLinkLabel}
                </Cta>
              </div>
            </Reveal>
          </div>
        }
      >
        <Reveal className="grid gap-x-16 gap-y-5 nav:grid-cols-2">
          {copy.location.slice(1).map((paragraph) => (
            <p
              key={paragraph}
              className="max-w-[38em] text-pretty text-body-lg text-ink-500"
            >
              {paragraph}
            </p>
          ))}
        </Reveal>
      </Section>

      {/* The dark ground the two cream sheets are laid on. */}
      <Section
        tone="dark"
        raised={false}
        label={copy.aspectsEyebrow}
        title={copy.aspectsTitle}
        lead={copy.aspectsLead}
      >
        <div className="grid items-start gap-x-16 gap-y-[clamp(28px,3.2vw,46px)] nav:[grid-template-columns:minmax(0,0.78fr)_minmax(0,1.22fr)]">
          <Reveal
            as="figure"
            className="relative m-0 aspect-[4/5] w-full min-w-0 overflow-hidden bg-ink-900 nav:sticky nav:top-[calc(var(--nav-h-sticky)+clamp(20px,2.4vw,40px))]"
          >
            <SiteImage
              src={aspectsFigure.src}
              alt={aspectsFigure.alt}
              fill
              sizes="(max-width: 960px) 100vw, 34vw"
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
        <div className="grid items-start gap-x-16 gap-y-[clamp(30px,3.4vw,48px)] nav:[grid-template-columns:minmax(0,1fr)_minmax(0,1fr)]">
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
              sizes="(max-width: 960px) 100vw, 25vw"
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
