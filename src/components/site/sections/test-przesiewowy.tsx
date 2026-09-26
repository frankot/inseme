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
      tone="dark"
      id="test"
      index={content.index}
      label={content.eyebrow}
      title={test.title || content.title}
      lead={test.description ?? content.lead}
    >
      <div className="grid items-start gap-x-16 gap-y-[clamp(26px,3vw,44px)] desk:[grid-template-columns:minmax(0,0.8fr)_minmax(0,1.2fr)]">
        {/* Tablet keeps the test full width — it is built for a phone's
            measure, not half a tablet's — and lays this pair out as a row. */}
        <Reveal className="flex flex-col items-start gap-5 tab:max-desk:flex-row tab:max-desk:items-end tab:max-desk:justify-between tab:max-desk:gap-10">
          <p className="flex max-w-[30em] gap-3 border-t border-white/12 pt-[18px] text-meta text-on-dark-faint">
            <span aria-hidden className="shrink-0 text-sage-300">
              !
            </span>
            <span>{disclaimer}</span>
          </p>
          <Cta href="/testy" variant="quiet-on-dark">
            Wszystkie testy
          </Cta>
        </Reveal>

        <Reveal className="min-w-0">
          <ScreeningTest test={test} contact={contact} labels={content} dark />
        </Reveal>
      </div>
    </Section>
  );
}
