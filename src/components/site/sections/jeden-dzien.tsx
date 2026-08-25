import { Container } from "@/components/site/ui/container";
import { Reveal } from "@/components/site/ui/reveal";
import { SectionRule } from "@/components/site/ui/section-rule";
import { jedenDzienDefaults, type JedenDzienContent } from "@/content/home";

export function JedenDzien({
  content = jedenDzienDefaults,
}: {
  content?: JedenDzienContent;
}) {
  return (
    <section id="dzien" className="scroll-mt-[calc(var(--nav-h-sticky)+12px)]">
      <Container className="pt-section pb-section-sm">
        <SectionRule
          index={content.index}
          label={content.eyebrow}
          className="mb-[clamp(28px,3.2vw,48px)]"
        />

        <Reveal>
          <h2 className="mb-[clamp(28px,3.4vw,52px)] max-w-[13em] text-pretty font-heading text-display text-ink-900">
            {content.title}
          </h2>
        </Reveal>

        <div className="grid gap-gap [grid-template-columns:repeat(auto-fit,minmax(212px,1fr))]">
          {content.entries.map((entry, i) => (
            <Reveal
              key={entry.time}
              delay={i * 60}
              className="flex min-h-[clamp(200px,18vw,240px)] flex-col justify-between gap-[22px] bg-mist p-[clamp(22px,2vw,30px)]"
            >
              <span className="font-heading text-stat font-light tabular-nums text-sage-600">
                {entry.time}
              </span>
              <p className="text-[15.5px] leading-[1.65] text-ink-600">
                {entry.body}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
