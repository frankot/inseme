import type { Metadata } from "next";

import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import { ArticleCard } from "@/components/site/ui/article-card";
import { Container } from "@/components/site/ui/container";
import { artykulyPageDefaults as copy } from "@/content/artykuly";
import { getPublishedArticles } from "@/lib/queries/articles";

export const metadata: Metadata = {
  title: copy.metaTitle,
  description: copy.metaDescription,
};

/** Prerendered, refreshed every five minutes — see the homepage for the why. */
export const revalidate = 300;

export default async function ArtykulyPage() {
  const articles = await getPublishedArticles();

  return (
    <SubpageLayout
      eyebrow={copy.eyebrow}
      title={copy.title}
      lead={copy.lead}
      breadcrumb={[{ label: copy.breadcrumbHome, href: "/" }, { label: copy.breadcrumbLabel }]}
    >
      <Container className="pb-section-lg">
        {articles.length === 0 ? (
          <p className="max-w-[34em] border-t border-line pt-[clamp(24px,3vw,40px)] text-body-lg text-ink-300">
            {copy.emptyNote}
          </p>
        ) : (
          <div className="grid gap-gap [grid-template-columns:repeat(auto-fit,minmax(248px,1fr))]">
            {articles.map((article, i) => (
              <ArticleCard
                key={article.id}
                article={article}
                delay={(i % 4) * 70}
                sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 25vw"
              />
            ))}
          </div>
        )}
      </Container>
    </SubpageLayout>
  );
}
