import type { Metadata } from "next";

import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import { CmsSlot } from "@/components/site/cms/cms-slot";
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
import { getCmsPage, numberSections, type CmsPage } from "@/lib/cms/get-page";
import { getPublishedFaq } from "@/lib/queries/faq";

export async function intentMetadata(key: string, path: string): Promise<Metadata> {
  const { seo } = await getCmsPage(key);
  return { title: seo.title, description: seo.description, alternates: { canonical: path } };
}

/**
 * The CMS doc folded back into the content shape the sections take. The
 * anchors (`id`) and the breadcrumb's home label are not in the doc — they
 * come from the page's content file in code.
 */
function copyFrom(page: CmsPage, defaults: IntentPageContent): IntentPageContent {
  const s = page.sections;
  const { breadcrumbLabel, ...intro } = s.intro.data as IntentPageContent["intro"] & {
    breadcrumbLabel: string;
  };
  const { call, ...related } = s.related.data as IntentPageContent["related"] & {
    call: IntentPageContent["call"];
  };
  const withId = <T,>(id: string, key: string) => ({ id, ...(s[key].data as T) });
  return {
    ...defaults,
    breadcrumbLabel,
    intro,
    explain: withId(defaults.explain.id, "explain"),
    steps: withId(defaults.steps.id, "steps"),
    statement: withId(defaults.statement.id, "statement"),
    cards: withId(defaults.cards.id, "cards"),
    feature: withId(defaults.feature.id, "feature"),
    faq: s.faq.data as IntentPageContent["faq"],
    related,
    call,
  };
}

/**
 * One search intent, one page: `/leczenie-alkoholizmu`, `/dla-rodziny`,
 * `/detoks-i-kwalifikacja`. One template, a fixed order of slots, each slot in
 * its own form (see `content/intent/types.ts`); the copy comes from the CMS.
 * Used by the public routes and by the editor's preview.
 *
 * Sheet and ground alternate down the page the way they do on the homepage
 * (see `Slab`), counted over the sections that are switched on — so the
 * statement lands on ground and takes the dark tone, and the closing band
 * takes whichever position is left when the FAQ has nothing to show.
 */
export async function IntentView({
  page,
  defaults,
}: {
  page: CmsPage;
  defaults: IntentPageContent;
}) {
  const copy = copyFrom(page, defaults);
  const faq = await getPublishedFaq(copy.faq.category).catch(() => []);
  const contact = contactDefaults;
  const on = (id: string) => page.sections[id]?.enabled ?? false;
  const numbers = numberSections(page);

  let position = 0;
  const place = () => {
    const raised = position++ % 2 === 1;
    return { raised, tone: raised ? "default" : "tinted" } as const;
  };
  const explain = on("explain") ? place() : null;
  const steps = on("steps") ? place() : null;
  const statement = on("statement") ? place() : null;
  const cards = on("cards") ? place() : null;
  const feature = on("feature") ? place() : null;
  // An FAQ category with no published questions takes no position either.
  const faqPlace = on("faq") && faq.length > 0 ? place() : null;
  const closing = on("related") ? place() : null;

  return (
    <SubpageLayout intro={false} contact={contact}>
      <CmsSlot page={page} id="intro">
        <IntentIntroSection
          intro={copy.intro}
          contact={contact}
          crumbs={[{ label: copy.breadcrumbHome, href: "/" }, { label: copy.breadcrumbLabel }]}
        />
      </CmsSlot>
      <CmsSlot page={page} id="explain">
        {explain && (
          <ProgramStageBand stage={copy.explain} index={numbers.explain ?? ""} {...explain} />
        )}
      </CmsSlot>
      <CmsSlot page={page} id="steps">
        {steps && (
          <IntentStepsSection steps={copy.steps} index={numbers.steps ?? ""} placement={steps} />
        )}
      </CmsSlot>
      <CmsSlot page={page} id="statement">
        {statement && (
          <IntentStatementSection
            statement={copy.statement}
            index={numbers.statement ?? ""}
            raised={statement.raised}
          />
        )}
      </CmsSlot>
      <CmsSlot page={page} id="cards">
        {cards && (
          <IntentCardsSection cards={copy.cards} index={numbers.cards ?? ""} placement={cards} />
        )}
      </CmsSlot>
      <CmsSlot page={page} id="feature">
        {feature && (
          <IntentFeatureSection
            feature={copy.feature}
            index={numbers.feature ?? ""}
            placement={feature}
          />
        )}
      </CmsSlot>
      <CmsSlot page={page} id="faq">
        {faqPlace && (
          <IntentFaqSection
            faq={copy.faq}
            items={faq}
            index={numbers.faq ?? ""}
            placement={faqPlace}
          />
        )}
      </CmsSlot>
      <CmsSlot page={page} id="related">
        {closing && (
          <IntentRelatedSection
            related={copy.related}
            call={copy.call}
            contact={contact}
            placement={closing}
          />
        )}
      </CmsSlot>
    </SubpageLayout>
  );
}
