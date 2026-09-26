import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import { Container } from "@/components/site/ui/container";
import { Reveal } from "@/components/site/ui/reveal";
import { ScreeningTest } from "@/components/site/ui/screening-test";
import { testyPageDefaults as copy } from "@/content/screening";
import { testDefaults } from "@/content/home";
import { getSiteContact } from "@/lib/queries/settings";
import { getScreeningTestBySlug, getScreeningTestSlugs } from "@/lib/queries/screening";

export async function generateStaticParams() {
  const slugs = await getScreeningTestSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/testy/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const test = await getScreeningTestBySlug(slug);
  if (!test) return { title: copy.notFoundTitle };

  return {
    title: test.metaTitle ?? `${test.title} — Insieme`,
    description: test.metaDescription ?? test.description ?? copy.metaDescription,
  };
}

export default async function TestPage(props: PageProps<"/testy/[slug]">) {
  const { slug } = await props.params;
  const [test, contact] = await Promise.all([
    getScreeningTestBySlug(slug),
    getSiteContact(),
  ]);
  if (!test) notFound();

  const disclaimer = test.disclaimerText ?? testDefaults.disclaimer;

  return (
    <SubpageLayout
      eyebrow={copy.eyebrow}
      title={test.title}
      lead={test.description ?? undefined}
      breadcrumb={[
        { label: copy.breadcrumbHome, href: "/" },
        { label: copy.breadcrumbTesty, href: "/testy" },
        { label: test.title },
      ]}
    >
      <Container className="pb-section-lg">
        <div className="grid items-start gap-[clamp(24px,3vw,64px)] tab:grid-cols-2">
          <Reveal>
            <ScreeningTest test={test} contact={contact} />
          </Reveal>

          <Reveal delay={70} className="tab:order-first">
            <p className="flex max-w-[30em] gap-3 border-t border-line-strong pt-[18px] text-[13.5px] leading-[1.65] text-ink-200">
              <span aria-hidden className="shrink-0 text-clay-300">
                !
              </span>
              <span>{disclaimer}</span>
            </p>
            <a
              href={`tel:${contact.phoneHref}`}
              className="link-arrow mt-6 inline-flex bg-ink-900 px-[26px] py-[15px] text-[15px] tabular-nums text-bone transition-colors hover:bg-ink-700"
            >
              <span>Zadzwoń: {contact.phone}</span>
              <span aria-hidden className="text-[14px]">
                →
              </span>
            </a>
          </Reveal>
        </div>
      </Container>
    </SubpageLayout>
  );
}
