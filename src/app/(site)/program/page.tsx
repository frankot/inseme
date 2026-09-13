import type { Metadata } from "next";

import { JedenDzien } from "@/components/site/sections/jeden-dzien";
import { Container } from "@/components/site/ui/container";
import { ProgramList } from "@/components/site/ui/program-list";
import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import { cennikTeaserDefaults } from "@/content/cennik";
import { programDefaults } from "@/content/home";

export const metadata: Metadata = {
  title: "Program leczenia — detoks, terapia 28 dni, wsparcie dla rodziny | Insieme",
  description:
    "Z czego składa się pobyt w ośrodku Insieme: detoks pod opieką lekarza, program terapeutyczny 28 dni, konsultacje dla rodziny i kontakt po pobycie. Plan jednego dnia.",
};

/**
 * The programme in full, including the day plan that used to run down the
 * homepage. A twelve-row timetable was the longest block there and the least
 * read; here it is what the visitor came for.
 */
export default function ProgramPage() {
  return (
    <SubpageLayout
      eyebrow={programDefaults.eyebrow}
      title={programDefaults.title}
      lead={programDefaults.lead}
      breadcrumb={[{ label: "Strona główna", href: "/" }, { label: "Program" }]}
    >
      <Container className="pb-section-lg">
        <ProgramList
          cards={programDefaults.cards}
          noPriceLabel={cennikTeaserDefaults.noPriceLabel}
        />

        <p className="mt-[clamp(18px,2vw,26px)] text-meta text-ink-300">
          {programDefaults.note}
        </p>

        <JedenDzien />
      </Container>
    </SubpageLayout>
  );
}
