import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import { ArticleView } from "@/components/site/article/article-view";
import { artykulyPageDefaults as copy } from "@/content/artykuly";
import {
  getArticleBySlug,
  getArticleSlugs,
  getRelatedArticles,
} from "@/lib/queries/articles";
import { getSiteContact } from "@/lib/queries/settings";
import { SITE_NAME } from "@/lib/site-url";

/**
 * Published articles are known at build time, so they are prerendered; anything
 * added later renders on first request. The article actions revalidate them;
 * the one-day window is the backstop, as on the homepage.
 */
export const revalidate = 86400;

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/porady/[slug]">,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: copy.metaTitle };

  return {
    title: article.metaTitle ?? `${article.title} — Poradnik Insieme`,
    description: article.metaDescription ?? article.excerpt ?? copy.metaDescription,
    alternates: { canonical: `/porady/${article.slug}` },
    // Replaces the layout's openGraph wholesale, so the site-wide fields are
    // repeated; title and description still fall through from above.
    openGraph: {
      type: "article",
      locale: "pl_PL",
      siteName: SITE_NAME,
      ...(article.publishedAt && { publishedTime: article.publishedAt }),
      modifiedTime: article.updatedAt,
      // Without a cover, keep the site-wide card rather than sending none.
      images: article.cover
        ? [{ url: article.cover.url, alt: article.cover.altText ?? article.title }]
        : ((await parent).openGraph?.images ?? []),
    },
  };
}

export default async function ArticlePage(props: PageProps<"/porady/[slug]">) {
  const contact = await getSiteContact();
  const { slug } = await props.params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(slug);
  return <ArticleView article={article} related={related} contact={contact} />;
}
