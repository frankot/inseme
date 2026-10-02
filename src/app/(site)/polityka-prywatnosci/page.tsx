import type { Metadata } from "next";

import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import { Container } from "@/components/site/ui/container";
import { policyDefaults as copy } from "@/content/polityka";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
  alternates: { canonical: "/polityka-prywatnosci" },
};

/**
 * A legal text, so the page is built for reading and finding: one measure-wide
 * column, and beside it the contents and who to write to — the two things
 * someone arriving here is usually looking for. Retention comes from the same
 * env var the retention job reads, so the text cannot drift from what the job
 * does.
 */
export default function PrivacyPolicyPage() {
  const sections = copy.sections(env.DATA_RETENTION_MONTHS);
  const { controller } = copy;

  return (
    <SubpageLayout
      eyebrow={copy.eyebrow}
      title={copy.title}
      lead={copy.lead}
      breadcrumb={[{ label: "Strona główna", href: "/" }, { label: copy.eyebrow }]}
    >
      <Container className="pb-section-lg">
        <div className="grid items-start gap-x-[clamp(40px,6vw,112px)] gap-y-[clamp(32px,4vw,48px)] desk:[grid-template-columns:minmax(0,1fr)_minmax(260px,320px)]">
          <article className="min-w-0 max-w-[40em] border-t border-line-strong">
            <p className="pt-4 text-meta text-ink-400">
              Obowiązuje od {copy.effectiveDate}
            </p>

            {sections.map((section, i) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-[calc(var(--nav-h-sticky)+24px)] pt-[clamp(28px,3vw,44px)]"
              >
                <h2 className="flex gap-3 font-heading text-heading text-ink-900">
                  <span aria-hidden className="tabular-nums text-clay-400">
                    {i + 1}.
                  </span>
                  <span>{section.title}</span>
                </h2>
                <div className="mt-4 flex flex-col gap-4 text-body-lg text-ink-600">
                  {section.body.map((block, j) =>
                    Array.isArray(block) ? (
                      <ul key={j} className="m-0 flex list-none flex-col gap-2.5 p-0">
                        {block.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span
                              aria-hidden
                              className="mt-[0.85em] block h-px w-[11px] shrink-0 bg-clay-400"
                            />
                            <span className="text-pretty">{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p key={j} className="text-pretty">
                        {block}
                      </p>
                    ),
                  )}
                </div>
              </section>
            ))}
          </article>

          <aside className="flex flex-col gap-gap desk:sticky desk:top-[calc(var(--nav-h-sticky)+clamp(20px,2.4vw,40px))]">
            <nav aria-label="Spis treści" className="border-t border-line-strong pt-4">
              <p className="mb-3 text-meta text-ink-400">Spis treści</p>
              <ol className="m-0 flex list-none flex-col gap-2 p-0">
                {sections.map((section, i) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="flex gap-2.5 text-body text-ink-600 transition-colors hover:text-sage-600"
                    >
                      <span aria-hidden className="w-5 shrink-0 tabular-nums text-clay-400">
                        {i + 1}.
                      </span>
                      <span>{section.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="bg-sand p-[clamp(20px,2vw,28px)]">
              <p className="text-meta text-ink-400">Administrator danych</p>
              <p className="mt-2 font-heading text-[19px] leading-tight tracking-[-0.02em] text-ink-900">
                {controller.legalName || "Insieme — ośrodek leczenia uzależnień"}
              </p>
              <p className="mt-2 text-meta text-ink-600">{controller.address}</p>
              <a
                href={`mailto:${controller.email}`}
                className="mt-3 inline-block text-body text-sage-600 underline decoration-line-strong underline-offset-4 transition-colors hover:text-sage-700"
              >
                {controller.email}
              </a>
              {controller.dpo && (
                <p className="mt-3 border-t border-line pt-3 text-meta text-ink-600">
                  Inspektor Ochrony Danych: {controller.dpo}
                </p>
              )}
            </div>
          </aside>
        </div>
      </Container>
    </SubpageLayout>
  );
}
