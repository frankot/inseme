import Link from "next/link";

import { Container } from "@/components/site/ui/container";
import { Reveal } from "@/components/site/ui/reveal";
import { ScreeningTest } from "@/components/site/ui/screening-test";
import { SectionRule } from "@/components/site/ui/section-rule";
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
    <section id="test" className="scroll-mt-[calc(var(--nav-h-sticky)+12px)]">
      <Container className="pt-section pb-section-sm">
        <SectionRule
          index={content.index}
          label={content.eyebrow}
          className="mb-[clamp(28px,3.2vw,48px)]"
        />

        <div className="grid items-start gap-[clamp(24px,3vw,64px)] [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
          <Reveal>
            <h2 className="mb-[clamp(18px,2vw,26px)] max-w-[14em] text-pretty font-heading text-display-sm text-ink-900">
              {test.title || content.title}
            </h2>
            <p className="mb-[22px] max-w-[30em] text-base leading-[1.75] text-ink-500">
              {test.description ?? content.lead}
            </p>
            <p className="flex max-w-[30em] gap-3 border-t border-line-strong pt-[18px] text-[13.5px] leading-[1.65] text-ink-200">
              <span aria-hidden className="shrink-0 text-clay-300">
                !
              </span>
              <span>{disclaimer}</span>
            </p>
            <Link
              href="/testy"
              className="link-arrow mt-5 inline-flex text-[14.5px] text-sage-600 transition-colors hover:text-sage-700"
            >
              <span>Wszystkie testy</span>
              <span aria-hidden>→</span>
            </Link>
          </Reveal>

          <Reveal>
            <ScreeningTest test={test} contact={contact} labels={content} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
