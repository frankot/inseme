import { Breadcrumb } from "@/components/site/chrome/page-intro";
import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import { CmsSlot } from "@/components/site/cms/cms-slot";
import { Container } from "@/components/site/ui/container";
import { Cta } from "@/components/site/ui/cta";
import { PHOTO_GRID, PHOTO_IMAGE, PhotoTile } from "@/components/site/ui/photo-tile";
import { Reveal } from "@/components/site/ui/reveal";
import { Section } from "@/components/site/ui/section";
import { SiteImage } from "@/components/site/ui/site-image";
import { Slab } from "@/components/site/ui/slab";
import { StickySplit } from "@/components/site/ui/sticky-split";
import { kontaktDefaults } from "@/content/home";
import { osrodekPageDefaults, type OsrodekPageContent } from "@/content/osrodek";
import type { CmsImage } from "@/cms/types";
import type { CmsPage } from "@/lib/cms/get-page";
import { getGalleryTeaser } from "@/lib/queries/gallery";
import { getSiteContact } from "@/lib/queries/settings";

/**
 * The place, at length — the long form of the homepage's 03 band.
 *
 * It runs as bands rather than one container of stacked blocks, because that is
 * what the rest of the site does: a cream sheet, the dark ground under it, a
 * cream sheet again. The dark band in the middle is where the page stops to say
 * what the house actually is, and it carries the page's weight — a subpage that
 * is cream from the header to the footer reads as a document, not as the same
 * site the visitor just came from.
 *
 * Copy comes from the CMS (`/admin/cms/osrodek`): each band is one section,
 * and its data keys are the content object's own, so the page reads one
 * merged `copy` like it always did. Used by `/osrodek` and the preview.
 */

/**
 * A multi-paragraph lead inside a `Section` masthead, which renders its lead in
 * a single <p> — so the paragraphs are block spans rather than nested <p>s.
 */
function Paragraphs({ lines }: { lines: string[] }) {
  return lines.map((line, i) => (
    <span key={line} className={i > 0 ? "mt-3 block" : "block"}>
      {line}
    </span>
  ));
}

type GalleryData = Pick<
  OsrodekPageContent,
  "galleryEyebrow" | "galleryTitle" | "galleryLead" | "galleryLinkLabel"
> & { spaces: { title: string; body: string; image: CmsImage }[] };

function copyFrom(page: CmsPage): OsrodekPageContent {
  const s = page.sections;
  const gallery = s.galeria.data as GalleryData;
  return {
    ...osrodekPageDefaults,
    ...(s.intro.data as Partial<OsrodekPageContent>),
    ...(s.wnetrze.data as Partial<OsrodekPageContent>),
    ...gallery,
    spaces: gallery.spaces.map((space) => ({
      title: space.title,
      body: space.body,
      src: space.image.src,
      alt: space.image.alt,
    })),
    ...(s.udogodnienia.data as Partial<OsrodekPageContent>),
    ...(s.przyjazd.data as Partial<OsrodekPageContent>),
  };
}

export async function OsrodekView({ page }: { page: CmsPage }) {
  const contact = await getSiteContact();
  const copy = copyFrom(page);
  // The first published photo opens the page at full width; the named rooms
  // further down are fixed, so nothing else is read from the gallery here.
  const [hero] = await getGalleryTeaser(1);
  const heroImage = hero ? { src: hero.full.url, alt: hero.alt } : copy.heroFallback;
  const [locationFirst, ...locationRest] = copy.location;

  return (
    <SubpageLayout intro={false}>
      {/*
        The opening is one sheet rather than a page intro followed by a band:
        title and lead with the numbers people ask first beside them, then the
        house at full height, then where it is. `mt-0` because this sheet has no
        band above it to overlap.
      */}
      <CmsSlot page={page} id="intro">
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
                  <h1 className="max-w-[14em] text-pretty font-heading text-display text-ink-900">
                    {copy.title}
                  </h1>
                  <p className="mt-[clamp(14px,1.6vw,22px)] max-w-[34em] text-pretty text-lead text-ink-700">
                    {copy.lead[0]}
                  </p>
                  {copy.lead.slice(1).map((paragraph) => (
                    <p
                      key={paragraph}
                      className="mt-3 max-w-[34em] text-pretty text-lead text-ink-500"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* A spec sheet, not stat tiles: label and value on one line,
                    read down the column like the travel details further on. */}
                <dl className="m-0 grid grid-cols-2 gap-x-[clamp(20px,3vw,40px)] border-t border-line-strong desk:grid-cols-1">
                  {copy.facts.map((fact) => (
                    <div
                      key={fact.label}
                      className="flex flex-col gap-1 border-b border-line py-3 desk:flex-row desk:items-baseline desk:justify-between desk:gap-6"
                    >
                      <dt className="text-eyebrow uppercase tracking-[0.2em] text-clay-600">
                        {fact.label}
                      </dt>
                      <dd className="m-0 font-heading text-[clamp(19px,1.6vw,23px)] leading-[1.15] tracking-[-0.025em] tabular-nums text-ink-900 desk:text-right">
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
                  preload
                  sizes="(max-width: 1440px) 100vw, 1440px"
                  className="object-cover saturate-[.92]"
                />
              </div>
              <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 text-meta text-ink-400">
                <span>
                  {contact.addressLine1}, {contact.addressLine2}
                </span>
                <Cta href="#dojazd" className="text-meta">
                  {copy.statsLinkLabel}
                </Cta>
              </figcaption>
            </Reveal>

            {/* Heading on the left, the answer on the right in reading order —
                the first paragraph is the answer, the rest explain it. */}
            <Reveal className="mt-section grid gap-x-[clamp(32px,6vw,112px)] gap-y-5 border-t border-line-strong pt-[clamp(24px,2.6vw,36px)] desk:[grid-template-columns:minmax(0,0.75fr)_minmax(0,1.25fr)]">
              <h2 className="font-heading text-display-sm text-ink-900">{copy.locationTitle}</h2>
              <div className="flex max-w-[38em] flex-col gap-4">
                <p className="text-pretty font-heading text-[clamp(19px,1.8vw,25px)] font-light leading-[1.4] tracking-[-0.022em] text-ink-900">
                  {locationFirst}
                </p>
                {locationRest.map((paragraph) => (
                  <p key={paragraph} className="text-pretty text-body-lg text-ink-500">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          </Container>
        </Slab>
      </CmsSlot>

      {/*
        The dark ground the cream sheets are laid on. The masthead's place is
        taken by the pinned column: the band's own two-paragraph intro stays put
        while the four aspects scroll past it.
      */}
      <CmsSlot page={page} id="wnetrze">
        <Slab tone="dark" raised={false}>
          <Container>
            <StickySplit
              aside={
                <>
                  <p className="text-eyebrow uppercase tracking-[0.22em] text-on-dark-muted">
                    {copy.aspectsEyebrow}
                  </p>
                  <h2 className="mt-[clamp(18px,2vw,28px)] max-w-[13em] text-pretty font-heading text-display-sm text-on-dark">
                    {copy.aspectsTitle}
                  </h2>
                  <p className="mt-[clamp(18px,2vw,28px)] max-w-[30em] text-pretty font-heading text-[clamp(18px,1.6vw,22px)] font-light leading-[1.45] tracking-[-0.02em] text-on-dark">
                    {copy.aspectsLead[0]}
                  </p>
                  {copy.aspectsLead.slice(1).map((paragraph) => (
                    <p
                      key={paragraph}
                      className="mt-4 max-w-[32em] text-pretty text-body-lg text-on-dark-muted"
                    >
                      {paragraph}
                    </p>
                  ))}
                </>
              }
            >
              {/* A list, not cards: four answers to one question, compared down
                  the left edge. The numerals are the homepage's, borrowed to say
                  the same thing on a smaller scale. */}
              <ul className="m-0 list-none border-t border-white/12 p-0">
                {copy.aspects.map((aspect, i) => (
                  <Reveal
                    as="li"
                    key={aspect.title}
                    delay={(i % 4) * 70}
                    className="grid gap-x-[clamp(14px,1.6vw,26px)] border-b border-white/12 py-[clamp(22px,2.3vw,32px)] [grid-template-columns:auto_minmax(0,1fr)]"
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
                      {aspect.body.map((paragraph) => (
                        <p
                          key={paragraph}
                          className="mt-2.5 max-w-[44em] text-pretty text-body text-on-dark-muted"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </Reveal>
                ))}
              </ul>
            </StickySplit>
          </Container>
        </Slab>
      </CmsSlot>

      {/* The four rooms by name, each with the line that says what it is for —
          the same tiles /galeria is built from. */}
      <CmsSlot page={page} id="galeria">
        <Section
          id="galeria"
          raised
          label={copy.galleryEyebrow}
          title={copy.galleryTitle}
          lead={<Paragraphs lines={copy.galleryLead} />}
          action={<Cta href={copy.galleryHref}>{copy.galleryLinkLabel}</Cta>}
        >
          <div className={PHOTO_GRID}>
            {copy.spaces.map((space, i) => (
              <Reveal as="figure" key={space.title} delay={(i % 4) * 70} className="group m-0 min-w-0">
                <PhotoTile
                  media={
                    <SiteImage
                      src={space.src}
                      alt={space.alt}
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 25vw"
                      className={PHOTO_IMAGE}
                    />
                  }
                  title={space.title}
                  body={space.body}
                />
              </Reveal>
            ))}
          </div>
        </Section>
      </CmsSlot>

      {/* The warm ground is what gives a bone card its edge — see `Slab`. */}
      <CmsSlot page={page} id="udogodnienia">
        <Section
          tone="tinted"
          raised={false}
          label={copy.amenitiesEyebrow}
          title={copy.amenitiesTitle}
          lead={copy.amenitiesLead}
        >
          <div className="grid gap-gap tab:grid-cols-2 desk:grid-cols-4">
            {copy.amenities.map((amenity, i) => (
              <Reveal
                key={amenity.title}
                as="article"
                delay={(i % 4) * 70}
                className="card-surface flex min-w-0 flex-col gap-3 p-card"
              >
                <h3 className="text-pretty font-heading text-[clamp(17px,1.45vw,21px)] leading-[1.3] tracking-[-0.025em] text-ink-900">
                  {amenity.title}
                </h3>
                {amenity.body.map((paragraph) => (
                  <p key={paragraph} className="text-pretty text-meta text-ink-500">
                    {paragraph}
                  </p>
                ))}
              </Reveal>
            ))}
          </div>
        </Section>
      </CmsSlot>

      <CmsSlot page={page} id="przyjazd">
        <Section
          raised
          label={copy.arrivalEyebrow}
          title={copy.arrivalTitle}
          lead={<Paragraphs lines={copy.arrivalLead} />}
        >
          <div className="grid items-start gap-x-16 gap-y-[clamp(30px,3.4vw,48px)] tab:[grid-template-columns:minmax(0,1fr)_minmax(0,1fr)]">
            <Reveal>
              <h3 className="font-heading text-heading text-ink-900">{copy.packingTitle}</h3>
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
              {copy.packingNotes.map((note) => (
                <p key={note} className="mt-4 max-w-[34em] text-pretty text-meta text-ink-400">
                  {note}
                </p>
              ))}
            </Reveal>

            <Reveal id="dojazd" className="scroll-mt-[calc(var(--nav-h-sticky)+12px)]">
              <h3 className="mb-6 font-heading text-heading text-ink-900">{copy.travelTitle}</h3>

              {/* The address is the answer most people scroll here for, so it
                  gets the page's one dark card rather than another hairline box. */}
              <div className="bg-ink-950 p-[clamp(24px,2.4vw,34px)]">
                <p className="text-meta text-on-dark-muted">{copy.travelAddressLead}</p>
                <address className="mt-2 font-heading text-[clamp(20px,1.8vw,26px)] not-italic leading-[1.3] tracking-[-0.025em] text-on-dark">
                  {copy.travelAddress.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>

                <ul className="m-0 mt-5 list-none border-t border-white/12 p-0">
                  {copy.travel.map((line) => (
                    <li
                      key={line}
                      className="border-b border-white/12 py-3 text-pretty text-meta text-on-dark-muted last:border-b-0 last:pb-0"
                    >
                      {line}
                    </li>
                  ))}
                </ul>

                <Cta
                  href={kontaktDefaults.mapsHref}
                  variant="quiet-on-dark"
                  target="_blank"
                  rel="noopener"
                  className="mt-5"
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
            </Reveal>
          </div>

          {/* The page ends on the day itself — the question left over once the
              bag is packed and the route is known — and on the phone number. */}
          <Reveal className="mt-section-sm grid items-start gap-x-16 gap-y-5 border-t border-line-strong pt-[clamp(24px,2.6vw,36px)] tab:[grid-template-columns:minmax(0,1fr)_minmax(0,1fr)]">
            <h3 className="max-w-[16em] text-pretty font-heading text-display-sm text-ink-900">
              {copy.firstDayTitle}
            </h3>
            <div className="flex flex-col items-start gap-[clamp(18px,2vw,26px)]">
              <p className="max-w-[34em] text-pretty text-body-lg text-ink-500">
                {copy.firstDayBody}
              </p>
              <Cta href={`tel:${contact.phoneHref}`} variant="solid" className="tabular-nums">
                {copy.firstDayCtaLabel} — {contact.phone}
              </Cta>
            </div>
          </Reveal>
        </Section>
      </CmsSlot>
    </SubpageLayout>
  );
}
