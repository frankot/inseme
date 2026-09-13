import { Cta } from "@/components/site/ui/cta";
import { Reveal } from "@/components/site/ui/reveal";
import { ScreeningTest } from "@/components/site/ui/screening-test";
import { Section } from "@/components/site/ui/section";
import {
  contactDefaults,
  testDefaults,
  type SiteContact,
  type TestContent,
} from "@/content/home";
import type { PublicScreeningTest } from "@/lib/queries/screening";

/**
 * The homepage screening test. The questionnaire itself is CMS content now —
 * `test` comes from `getScreeningTestBySlug(FEATURED_TEST_SLUG)`. Without a
 * published test the section removes itself rather than showing an empty card.
 */
export function TestPrzesiewowy({
  test,
  content = testDefaults,
  contact = contactDefaults,
}: {
  test: PublicScreeningTest | null;
  content?: TestContent;
  contact?: SiteContact;
}) {
  if (!test) return null;

  const disclaimer = test.disclaimerText ?? content.disclaimer;

  return (
    <Section
      id="test"
      index={content.index}
      label={content.eyebrow}
      title={test.title || content.title}
      lead={test.description ?? content.lead}
    >
      <div className="grid items-start gap-x-16 gap-y-[clamp(26px,3vw,44px)] nav:[grid-template-columns:minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <Reveal className="flex flex-col items-start gap-5">
          <p className="flex max-w-[30em] gap-3 border-t border-line-strong pt-[18px] text-meta text-ink-200">
            <span aria-hidden className="shrink-0 text-clay-300">
              !
            </span>
            <span>{disclaimer}</span>
          </p>
          <Cta href="/testy">Wszystkie testy</Cta>
        </Reveal>

        <Reveal className="min-w-0">
          <ScreeningTest test={test} contact={contact} labels={content} />
        </Reveal>
      </div>
    </Section>
  );
}
