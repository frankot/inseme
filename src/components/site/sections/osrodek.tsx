import { Cta } from "@/components/site/ui/cta";
import { OsrodekMosaic } from "@/components/site/ui/osrodek-mosaic";
import {
  OSRODEK_CAPTION,
  OSRODEK_GRID,
  OSRODEK_IMAGE,
  OSRODEK_TILES,
} from "@/components/site/ui/osrodek-tiles";
import { Reveal } from "@/components/site/ui/reveal";
import { Section } from "@/components/site/ui/section";
import { SiteImage } from "@/components/site/ui/site-image";
import { osrodekDefaults, type OsrodekContent } from "@/content/home";
import type { GalleryPhotoView } from "@/lib/gallery-types";

/**
 * The photographs are the gallery photos starred for the homepage in
 * /admin/gallery — clickable, opening the gallery's viewer — with a link to
 * the whole gallery under them. While none are starred, the section falls
 * back to its own four figures (CMS/code), still in the same mosaic.
 */
export function Osrodek({
  content = osrodekDefaults,
  photos = [],
}: {
  content?: OsrodekContent;
  photos?: GalleryPhotoView[];
}) {
  return (
    <Section
      id="miejsce"
      index={content.index}
      label={content.eyebrow}
      title={content.title}
      lead={content.body}
      action={<Cta href={content.href}>{content.linkLabel}</Cta>}
    >
      {/*
        The four numbers used to be a narrow table crowded against the heading.
        Given the full width they read as a band of facts, and they carry the
        eye from the heading down into the photographs.
      */}
      <Reveal className="grid grid-cols-2 gap-x-[clamp(20px,3vw,56px)] gap-y-7 tab:grid-cols-4">
        {content.stats.map((stat) => (
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

      <div className="mt-[clamp(28px,3.2vw,48px)]">
        {photos.length > 0 ? (
          <OsrodekMosaic photos={photos} />
        ) : (
          <div className={OSRODEK_GRID}>
            {content.figures.slice(0, OSRODEK_TILES.length).map((figure, i) => (
              <Figure key={figure.src} figure={figure} delay={i * 70} tile={OSRODEK_TILES[i]} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-[clamp(18px,2vw,28px)] flex justify-end">
        <Cta href={content.galleryHref}>{content.galleryLinkLabel}</Cta>
      </div>
    </Section>
  );
}

function Figure({
  figure,
  delay,
  tile,
}: {
  figure: OsrodekContent["figures"][number];
  delay: number;
  tile: (typeof OSRODEK_TILES)[number];
}) {
  return (
    <Reveal
      as="figure"
      delay={delay}
      className={`group relative m-0 min-w-0 overflow-hidden bg-stone ${tile.span}`}
    >
      <SiteImage src={figure.src} alt={figure.alt} fill sizes={tile.sizes} className={OSRODEK_IMAGE} />
      <figcaption className={OSRODEK_CAPTION}>{figure.caption}</figcaption>
    </Reveal>
  );
}
