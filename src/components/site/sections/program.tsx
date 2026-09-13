import { Cta } from "@/components/site/ui/cta";
import { ProgramList } from "@/components/site/ui/program-list";
import { Reveal } from "@/components/site/ui/reveal";
import { Section } from "@/components/site/ui/section";
import {
  PRICES_ARE_REAL,
  cennikTeaserDefaults,
  type CennikContent,
} from "@/content/cennik";
import {
  contactDefaults,
  programDefaults,
  type ProgramContent,
  type SiteContact,
} from "@/content/home";

/**
 * "Program i ceny" — what a stay is made of and what each part costs.
 *
 * A tariff list rather than a card grid: Zespół and Opinie are both grids of
 * cards, and prices only become comparable when they line up in a column. See
 * `ProgramList`.
 *
 * The day plan lives on /program with the rest of the detail — on the homepage
 * a twelve-row timetable was the longest block on the page and the least read.
 */
export function Program({
  content = programDefaults,
  cennik = cennikTeaserDefaults,
  contact = contactDefaults,
}: {
  content?: ProgramContent;
  cennik?: CennikContent;
  contact?: SiteContact;
}) {
  return (
    <Section
      id="program"
      tone="tinted"
      index={cennik.index}
      label={cennik.eyebrow}
      title={cennik.title}
      lead={cennik.lead}
      action={<Cta href={cennik.href}>{cennik.linkLabel}</Cta>}
    >
      <ProgramList cards={content.cards} noPriceLabel={cennik.noPriceLabel} />

      {/*
        Until the real price list lands every row reads "wycena w rozmowie",
        which on its own looks evasive — this says why, and says the call costs
        nothing. It swaps for the standing note once the numbers are published.
      */}
      <Reveal className="mt-[clamp(16px,1.8vw,24px)] flex flex-wrap items-center justify-between gap-x-10 gap-y-5">
        <p className="max-w-[42em] text-meta text-ink-300">
          {PRICES_ARE_REAL ? cennik.note : cennik.noPriceLead}
        </p>
        <Cta href={`tel:${contact.phoneHref}`} variant="solid" className="tabular-nums">
          Zapytaj o cenę: {contact.phone}
        </Cta>
      </Reveal>
    </Section>
  );
}
