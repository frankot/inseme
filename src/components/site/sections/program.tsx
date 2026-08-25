import { Container } from "@/components/site/ui/container";
import { Reveal } from "@/components/site/ui/reveal";
import { SectionRule } from "@/components/site/ui/section-rule";
import {
  programDefaults,
  type ProgramCard,
  type ProgramContent,
} from "@/content/home";
import { cn } from "@/lib/utils";

export function Program({
  content = programDefaults,
}: {
  content?: ProgramContent;
}) {
  return (
    <section
      id="program"
      className="scroll-mt-[calc(var(--nav-h-sticky)+12px)]"
    >
      <Container className="pt-section pb-section-sm">
        <SectionRule
          index={content.index}
          label={content.eyebrow}
          className="mb-[clamp(20px,2.4vw,34px)]"
        />
        <p className="mb-[clamp(20px,2.4vw,32px)] text-[14.5px] text-ink-300">
          {content.note}
        </p>

        <div className="grid gap-gap [grid-template-columns:repeat(auto-fit,minmax(248px,1fr))]">
          {content.cards.map((card, i) => (
            <Card key={card.index} card={card} delay={i * 70} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function Card({ card, delay }: { card: ProgramCard; delay: number }) {
  const { inverted } = card;

  return (
    <Reveal
      as="article"
      delay={delay}
      className={cn(
        "flex min-h-[clamp(280px,26vw,340px)] flex-col justify-between gap-7 border p-card transition-colors",
        inverted
          ? "border-ink-900 bg-ink-900"
          : "border-line bg-sand hover:border-line-warm hover:bg-[oklch(0.933_0.016_86)]",
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span
          className={cn(
            "text-eyebrow tabular-nums tracking-[0.18em]",
            inverted ? "text-on-dark-faint" : "text-clay-400",
          )}
        >
          {card.index}
        </span>
        <span
          className={cn(
            "text-eyebrow uppercase tracking-[0.16em]",
            inverted ? "text-on-dark-faint" : "text-clay-400",
          )}
        >
          {card.meta}
        </span>
      </div>

      <div>
        <h3
          className={cn(
            "mb-[13px] font-heading text-heading",
            inverted ? "text-on-dark" : "text-ink-900",
          )}
        >
          {card.title}
        </h3>
        <p
          className={cn(
            "mb-5 text-[15.5px] leading-[1.68]",
            inverted ? "text-on-dark-sage-2" : "text-ink-400",
          )}
        >
          {card.body}
        </p>
        <a
          href={card.href}
          className={cn(
            "link-arrow text-[14.5px] transition-colors",
            inverted
              ? "text-on-dark-sage hover:text-on-dark"
              : "text-sage-600 hover:text-sage-700",
          )}
        >
          <span>{card.linkLabel}</span>
          <span aria-hidden>→</span>
        </a>
      </div>
    </Reveal>
  );
}
