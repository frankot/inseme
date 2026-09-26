import { Cta } from "@/components/site/ui/cta";
import { Reveal } from "@/components/site/ui/reveal";
import { Section } from "@/components/site/ui/section";
import { SiteImage } from "@/components/site/ui/site-image";
import { osrodekDefaults, type OsrodekContent } from "@/content/home";

/**
 * The mosaic follows the design's 4-column grid: a 2×2 hero tile, a 2-wide
 * banner beside it, and two square tiles closing the second row. Below the
 * `tab` breakpoint the same spans read as a 2-column stack, so the tiles keep
 * their shapes instead of collapsing into a column of identical rectangles.
 */
const TILES = [
  { span: "col-span-2 row-span-2", sizes: "(max-width: 767px) 100vw, 50vw" },
  { span: "col-span-2", sizes: "(max-width: 767px) 100vw, 50vw" },
  { span: "col-span-1", sizes: "(max-width: 767px) 50vw, 25vw" },
  { span: "col-span-1", sizes: "(max-width: 767px) 50vw, 25vw" },
] as const;

export function Osrodek({
  content = osrodekDefaults,
}: {
  content?: OsrodekContent;
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

      <div className="mt-[clamp(28px,3.2vw,48px)] grid grid-cols-2 auto-rows-[clamp(140px,15.5vw,220px)] gap-gap tab:grid-cols-4">
        {content.figures.slice(0, TILES.length).map((figure, i) => (
          <Figure
            key={figure.src}
            figure={figure}
            delay={i * 70}
            className={TILES[i].span}
            sizes={TILES[i].sizes}
          />
        ))}
      </div>
    </Section>
  );
}

function Figure({
  figure,
  delay,
  className,
  sizes,
}: {
  figure: OsrodekContent["figures"][number];
  delay: number;
  className?: string;
  sizes: string;
}) {
  return (
    <Reveal
      as="figure"
      delay={delay}
      className={`group relative m-0 min-w-0 overflow-hidden bg-stone ${className ?? ""}`}
    >
      <SiteImage
        src={figure.src}
        alt={figure.alt}
        fill
        sizes={sizes}
        className="object-cover saturate-[.92] transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]"
      />
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/75 via-ink-950/35 to-transparent px-[clamp(12px,1.4vw,22px)] pb-[clamp(12px,1.1vw,18px)] pt-[clamp(28px,3.4vw,48px)] text-[clamp(13px,0.95vw,15px)] leading-[1.45] text-bone">
        {figure.caption}
      </figcaption>
    </Reveal>
  );
}
