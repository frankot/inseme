import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageIntro } from "@/components/site/chrome/page-intro";
import { SubpageLayout } from "@/components/site/chrome/subpage-layout";
import { ArticleCard } from "@/components/site/ui/article-card";
import { BlockRenderer } from "@/components/site/ui/block-renderer";
import { Container } from "@/components/site/ui/container";
import { Reveal } from "@/components/site/ui/reveal";
import { SiteImage } from "@/components/site/ui/site-image";
import {
  artykulyPageDefaults as copy,
  formatArticleDate,
} from "@/content/artykuly";
import {
  getArticleBySlug,
  getArticleSlugs,
  getRelatedArticles,
} from "@/lib/queries/articles";

/**
 * Published articles are known at build time, so they are prerendered; anything
 * added later renders on first request. Both are refreshed on the same five
 * minute window as the homepage teaser.
 */
export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/artykuly/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: copy.metaTitle };

  return {
    title: article.metaTitle ?? `${article.title} — Poradnik Insieme`,
    description: article.metaDescription ?? article.excerpt ?? copy.metaDescription,
  };
}

export default async function ArticlePage(props: PageProps<"/artykuly/[slug]">) {
  const { slug } = await props.params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(slug);
  const date = formatArticleDate(article.publishedAt);

  return (
    <SubpageLayout intro={false}>
      <PageIntro
        eyebrow={copy.eyebrow}
        title={article.title}
        lead={article.excerpt ?? undefined}
        breadcrumb={[
          { label: copy.breadcrumbHome, href: "/" },
          { label: copy.breadcrumbLabel, href: "/artykuly" },
          { label: article.title },
        ]}
      />

      <Container className="pb-section-lg">
        {article.cover && (
          <Reveal className="relative mb-[clamp(32px,4vw,60px)] aspect-[16/9] overflow-hidden bg-stone">
            <SiteImage
              src={article.cover.url}
              alt={article.cover.altText ?? ""}
              fill
              priority
              sizes="(max-width: 1440px) 100vw, 1440px"
              className="object-cover saturate-[.92]"
            />
          </Reveal>
        )}

        <BlockRenderer blocks={article.body} />

        {/* The review trail the publish gate insists on — named, so a reader can
            see who checked the medical claims and when. */}
        {(article.authorReviewer || date) && (
          <Reveal className="mt-[clamp(36px,4vw,64px)] flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3 border-t border-line-strong pt-5 text-[14px] text-ink-300">
            {article.authorReviewer && (
              <span>
                {copy.reviewerLabel}: <span className="text-ink-600">{article.authorReviewer}</span>
              </span>
            )}
            {date && <span className="tabular-nums">{date}</span>}
          </Reveal>
        )}

        {related.length > 0 && (
          <div className="mt-[clamp(48px,6vw,88px)]">
            <div className="mb-[clamp(20px,2.4vw,32px)] flex items-baseline justify-between gap-6">
              <h2 className="font-heading text-heading text-ink-900">{copy.relatedTitle}</h2>
              <Link
                href="/artykuly"
                className="link-arrow shrink-0 text-[14.5px] text-sage-600 transition-colors hover:text-sage-700"
              >
                <span>{copy.backLabel}</span>
                <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="grid gap-gap [grid-template-columns:repeat(auto-fit,minmax(248px,1fr))]">
              {related.map((item, i) => (
                <ArticleCard
                  key={item.id}
                  article={item}
                  delay={i * 70}
                  sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
                />
              ))}
            </div>
          </div>
        )}
      </Container>
    </SubpageLayout>
  );
}
