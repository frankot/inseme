import type { Metadata } from "next";

import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import {
  IntentCardsSection,
  IntentFaqSection,
  IntentFeatureSection,
  IntentIntroSection,
  IntentRelatedSection,
  IntentStatementSection,
  IntentStepsSection,
} from "@/components/site/intent/intent-sections";
import { ProgramStageBand } from "@/components/site/ui/program-stage";
import { contactDefaults } from "@/content/home";
import type { IntentPageContent } from "@/content/intent/types";
import { getPublishedFaq } from "@/lib/queries/faq";

export function intentMetadata(copy: IntentPageContent): Metadata {
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: { canonical: copy.path },
  };
}

/**
 * One search intent, one page: `/leczenie-alkoholizmu`, `/dla-rodziny`,
 * `/detoks-i-kwalifikacja`. One template, a fixed order of slots, each slot in
 * its own form (see `content/intent/types.ts`), so a page is its content
 * object plus a one-line route.
 *
 * Sheet and ground alternate down the page the way they do on the homepage
 * (see `Slab`). The order is fixed, so the statement always lands on a ground
 * position and can take the dark tone; only the FAQ is optional, and the
 * closing band takes whichever position is left.
 */
export async function IntentPage({ copy }: { copy: IntentPageContent }) {
  const faq = await getPublishedFaq(copy.faq.category);
  const contact = contactDefaults;

  let position = 0;
  const place = () => {
    const raised = position++ % 2 === 1;
    return { raised, tone: raised ? "default" : "tinted" } as const;
  };
  let numeral = 0;
  const index = () => String(++numeral).padStart(2, "0");

  const explain = place();
  const steps = place();
  place(); // the statement: always ground, always dark
  const cards = place();
  const feature = place();
  const faqPlace = faq.length > 0 ? place() : null;
  const closing = place();

  return (
    <SubpageLayout intro={false} contact={contact}>
      <IntentIntroSection
        intro={copy.intro}
        contact={contact}
        crumbs={[{ label: copy.breadcrumbHome, href: "/" }, { label: copy.breadcrumbLabel }]}
      />
      <ProgramStageBand stage={copy.explain} index={index()} {...explain} />
      <IntentStepsSection steps={copy.steps} index={index()} placement={steps} />
      <IntentStatementSection statement={copy.statement} index={index()} />
      <IntentCardsSection cards={copy.cards} index={index()} placement={cards} />
      <IntentFeatureSection feature={copy.feature} index={index()} placement={feature} />
      {faqPlace && (
        <IntentFaqSection faq={copy.faq} items={faq} index={index()} placement={faqPlace} />
      )}
      <IntentRelatedSection
        related={copy.related}
        call={copy.call}
        contact={contact}
        placement={closing}
      />
    </SubpageLayout>
  );
}
