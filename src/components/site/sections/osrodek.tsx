import { Container } from "@/components/site/ui/container";
import { Reveal } from "@/components/site/ui/reveal";
import { SectionRule } from "@/components/site/ui/section-rule";
import { SiteImage } from "@/components/site/ui/site-image";
import { osrodekDefaults, type OsrodekContent } from "@/content/home";

export function Osrodek({
  content = osrodekDefaults,
}: {
  content?: OsrodekContent;
}) {
  const [wide, tall] = content.figures;

  return (
    <>
      <section
        id="miejsce"
        className="scroll-mt-[calc(var(--nav-h-sticky)+12px)]"
      >
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
                  <span className="text-[14.5px] text-ink-300">
                    {stat.label}
                  </span>
                  <span className="font-heading text-[21px] tracking-[-0.02em] tabular-nums text-ink-900">
                    {stat.value}
                  </span>
                </div>
              ))}
            </Reveal>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-[clamp(24px,3vw,44px)]">
          <div className="flex flex-wrap gap-gap">
            <Figure
              figure={wide}
              index="01"
              ratio="aspect-[16/9]"
              className="flex-[2_1_420px]"
            />
            <Figure
              figure={tall}
              index="02"
              ratio="aspect-[4/5]"
              className="flex-[1_1_280px]"
            />
          </div>
        </Container>
      </section>
    </>
  );
}

function Figure({
  figure,
  index,
  ratio,
  className,
}: {
  figure: OsrodekContent["figures"][number];
  index: string;
  ratio: string;
  className?: string;
}) {
  return (
    <Reveal as="figure" className={`m-0 min-w-0 ${className ?? ""}`}>
      <div className={`relative w-full bg-stone ${ratio}`}>
        <SiteImage
          src={figure.src}
          alt={figure.alt}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover saturate-[.92]"
        />
      </div>
      <figcaption className="mt-3.5 flex gap-[11px] text-sm leading-[1.6] text-ink-300">
        <span className="tabular-nums text-clay-300">{index}</span>
        <span className="max-w-[32em]">{figure.caption}</span>
      </figcaption>
    </Reveal>
  );
}
