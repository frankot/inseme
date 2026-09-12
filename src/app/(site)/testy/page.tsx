import type { Metadata } from "next";
import Link from "next/link";

import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import { Container } from "@/components/site/ui/container";
import { Reveal } from "@/components/site/ui/reveal";
import { testyPageDefaults as copy } from "@/content/screening";
import { getPublishedScreeningTests } from "@/lib/queries/screening";

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
};

export default async function TestyPage() {
  const tests = await getPublishedScreeningTests();

  return (
    <SubpageLayout
      eyebrow={copy.eyebrow}
      title={copy.title}
      lead={copy.lead}
      breadcrumb={[{ label: copy.breadcrumbHome, href: "/" }, { label: copy.breadcrumbTesty }]}
    >
      <Container className="pb-section-lg">
        {tests.length === 0 ? (
          <p className="max-w-[34em] border-t border-line pt-[clamp(24px,3vw,40px)] text-body-lg text-ink-300">
            {copy.emptyNote}
          </p>
        ) : (
          <div className="grid gap-gap [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
            {tests.map((test, i) => (
              <Reveal as="article" key={test.id} delay={i * 70}>
                <Link
                  href={`/testy/${test.slug}`}
                  className="flex h-full flex-col justify-between gap-7 border border-line bg-sand p-card transition-colors hover:border-line-warm hover:bg-[oklch(0.933_0.016_86)]"
                >
                  <span className="text-eyebrow uppercase tracking-[0.18em] text-clay-400">
                    Samoocena · ok. 2 minuty
                  </span>
                  <div>
                    <h2 className="mb-3 font-heading text-heading text-ink-900">{test.title}</h2>
                    {test.description && (
                      <p className="mb-5 text-[15.5px] leading-[1.68] text-ink-400">
                        {test.description}
                      </p>
                    )}
                    <span className="link-arrow text-[14.5px] text-sage-600">
                      <span>Zacznij test</span>
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </SubpageLayout>
  );
}
