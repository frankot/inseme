import { JedenDzien } from "@/components/site/sections/jeden-dzien";
import { Cta } from "@/components/site/ui/cta";
import { Reveal } from "@/components/site/ui/reveal";
import { Section } from "@/components/site/ui/section";
import {
  programDefaults,
  type ProgramCard,
  type ProgramContent,
} from "@/content/home";

/**
 * Section 04 in two halves: what a stay is made of (the cards) and what one of
 * its days looks like (the plan below). They used to be 04 and 05 — two
 * numerals, two grids of similar tiles, one idea.
 */
export function Program({
  content = programDefaults,
}: {
  content?: ProgramContent;
}) {
  return (
    <Section
      id="program"
      tone="tinted"
      index={content.index}
      label={content.eyebrow}
      title={content.title}
      lead={content.lead}
    >
      <div className="grid gap-gap [grid-template-columns:repeat(auto-fit,minmax(248px,1fr))]">
        {content.cards.map((card, i) => (
          <Card key={card.index} card={card} delay={i * 70} />
        ))}
      </div>

      <p className="mt-[clamp(18px,2vw,26px)] text-meta text-ink-300">{content.note}</p>

      <JedenDzien />
    </Section>
  );
}

/**
 * One card per element of a stay. They are deliberately identical now — the
 * third used to be inverted to black, which at four across read as a rendering
 * fault rather than an accent.
 */
function Card({ card, delay }: { card: ProgramCard; delay: number }) {
  return (
    <Reveal
      as="article"
      delay={delay}
      className="card-surface flex min-h-[clamp(280px,26vw,340px)] flex-col justify-between gap-7 p-card"
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-eyebrow tabular-nums tracking-[0.18em] text-clay-400">
          {card.index}
        </span>
        <span className="text-eyebrow uppercase tracking-[0.16em] text-clay-600">
          {card.meta}
        </span>
      </div>

      <div>
        <h3 className="mb-[13px] font-heading text-heading text-ink-900">
          {card.title}
        </h3>
        <p className="mb-5 text-body text-ink-400">{card.body}</p>
        <Cta href={card.href}>{card.linkLabel}</Cta>
      </div>
    </Reveal>
  );
}
