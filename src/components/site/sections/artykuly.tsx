import Link from "next/link";

import { ArticleCard } from "@/components/site/ui/article-card";
import { Container } from "@/components/site/ui/container";
import { Reveal } from "@/components/site/ui/reveal";
import { SectionRule } from "@/components/site/ui/section-rule";
import { articlesTeaserDefaults, type ArticlesTeaserContent } from "@/content/artykuly";
import type { ArticleCardData } from "@/lib/queries/articles";

/**
 * The four newest articles. Like Zespół it takes real rows and removes itself
 * when there are none, so an empty poradnik leaves no heading over a gap.
 */
export function Artykuly({
  articles,
  content = articlesTeaserDefaults,
}: {
  articles: ArticleCardData[];
  content?: ArticlesTeaserContent;
}) {
  if (articles.length === 0) return null;

  return (
    <section id="artykuly" className="scroll-mt-[calc(var(--nav-h-sticky)+12px)]">
      <Container className="pt-section pb-section-sm">
        <SectionRule
          index={content.index}
          label={content.eyebrow}
          className="mb-[clamp(28px,3.2vw,48px)]"
        />

        <div className="mb-[clamp(28px,3.2vw,48px)] flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
          <Reveal className="flex-[1_1_22em]">
            <h2 className="mb-5 max-w-[15em] text-pretty font-heading text-display-sm text-ink-900">
              {content.title}
            </h2>
            <p className="max-w-[34em] text-pretty text-body-lg text-ink-500">{content.lead}</p>
          </Reveal>

          <Reveal className="shrink-0">
            <Link
              href={content.href}
              className="link-arrow text-[14.5px] text-sage-600 transition-colors hover:text-sage-700"
            >
              <span>{content.linkLabel}</span>
              <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>

        <div className="grid gap-gap [grid-template-columns:repeat(auto-fit,minmax(248px,1fr))]">
          {articles.map((article, i) => (
            <ArticleCard key={article.id} article={article} delay={i * 70} />
          ))}
        </div>
      </Container>
    </section>
  );
}
