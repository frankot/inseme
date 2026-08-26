import { Container } from "@/components/site/ui/container";
import { Reveal } from "@/components/site/ui/reveal";
import { SectionRule } from "@/components/site/ui/section-rule";
import { SiteImage } from "@/components/site/ui/site-image";
import { osrodekDefaults, type OsrodekContent } from "@/content/home";

/**
 * The mosaic follows the design's 4-column grid: a 2×2 hero tile, a 2-wide
 * banner beside it, and two square tiles closing the second row. Below the
 * `nav` breakpoint the same spans read as a 2-column stack, so the tiles keep
 * their shapes instead of collapsing into a column of identical rectangles.
 */
const TILES = [
  { span: "col-span-2 row-span-2", sizes: "(max-width: 960px) 100vw, 50vw" },
  { span: "col-span-2", sizes: "(max-width: 960px) 100vw, 50vw" },
  { span: "col-span-1", sizes: "(max-width: 960px) 50vw, 25vw" },
  { span: "col-span-1", sizes: "(max-width: 960px) 50vw, 25vw" },
] as const;

export function Osrodek({
  content = osrodekDefaults,
}: {
  content?: OsrodekContent;
}) {
  return (
    <section id="miejsce" className="scroll-mt-[calc(var(--nav-h-sticky)+12px)]">
      <Container className="pt-section-lg pb-section-sm">
        <SectionRule
          index={content.index}
          label={content.eyebrow}
          className="mb-[clamp(28px,3.2vw,48px)]"
        />

        <div className="flex flex-wrap items-start gap-x-16 gap-y-7">
          <Reveal className="flex-[1_1_22em]">
            <h2 className="mb-7 max-w-[15em] text-pretty font-heading text-display text-ink-900">
              {content.title}
            </h2>
            <p className="max-w-[34em] text-pretty text-body-lg text-ink-500">
              {content.body}
            </p>
          </Reveal>

          <Reveal className="ml-auto flex flex-[0_1_17em] flex-col gap-4 [min-width:200px]">
            {content.stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-baseline justify-between gap-4 border-b border-line pb-3"
              >
                <span className="text-[14.5px] text-ink-300">{stat.label}</span>
                <span className="font-heading text-[21px] tracking-[-0.02em] tabular-nums text-ink-900">
                  {stat.value}
                </span>
              </div>
            ))}
          </Reveal>
        </div>

        <div className="mt-[clamp(28px,3.2vw,48px)] grid grid-cols-2 auto-rows-[clamp(140px,15.5vw,220px)] gap-gap nav:grid-cols-4">
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
      </Container>
    </section>
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
