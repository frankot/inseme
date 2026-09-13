import { Cta } from "@/components/site/ui/cta";
import { ProgramCard } from "@/components/site/ui/program-card";
import { Reveal } from "@/components/site/ui/reveal";
import { Section } from "@/components/site/ui/section";
import { PRICES_ARE_REAL, cennikTeaserDefaults, type CennikContent } from "@/content/cennik";
import { programDefaults, type ProgramContent } from "@/content/home";

/**
 * "Program i ceny" — what a stay is made of and what each part costs, in one
 * band. They used to be a programme section with no prices anywhere on the site
 * and a footer link to a cennik that did not exist; someone comparing ośrodki
 * was doing both jobs at once and the page helped with neither.
 *
 * The day plan moved to /program with the rest of the detail — on the homepage
 * a twelve-row timetable was the longest thing on the page and the least read.
 */
export function Program({
  content = programDefaults,
  cennik = cennikTeaserDefaults,
}: {
  content?: ProgramContent;
  cennik?: CennikContent;
}) {
  return (
    <Section
      id="program"
      index={cennik.index}
      label={cennik.eyebrow}
      title={cennik.title}
      lead={cennik.lead}
      action={<Cta href={cennik.href}>{cennik.linkLabel}</Cta>}
    >
      <div className="grid gap-gap [grid-template-columns:repeat(auto-fit,minmax(248px,1fr))]">
        {content.cards.map((card, i) => (
          <ProgramCard
            key={card.id}
            card={card}
            delay={i * 70}
            noPriceLabel={cennik.noPriceLabel}
          />
        ))}
      </div>

      {/*
        Until the real price list lands the cards all read "wycena w rozmowie",
        which on its own looks evasive — this says why, and says the call costs
        nothing. It removes itself once the numbers are published.
      */}
      <Reveal className="mt-[clamp(20px,2.2vw,30px)] flex flex-wrap items-baseline gap-x-8 gap-y-2">
        <p className="max-w-[44em] text-meta text-ink-300">
          {PRICES_ARE_REAL ? cennik.note : cennik.noPriceLead}
        </p>
      </Reveal>
    </Section>
  );
}
