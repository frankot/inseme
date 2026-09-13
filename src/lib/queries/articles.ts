import "server-only";

import { and, desc, eq, ne } from "drizzle-orm";

import { db } from "@/db";
import { articles } from "@/db/schema";
import type { Block } from "@/lib/blocks";
import { toMediaSummary } from "@/lib/media-summary";
import type { MediaSummary } from "@/lib/media-types";

/**
 * Read side of `articles` for the public site. The admin panel queries the
 * table directly because it needs drafts; everything here is published-only and
 * newest first — the poradnik is chronological, unlike the team or the FAQ,
 * which editors order by hand.
 */

/** What a card needs: no body, so a list never carries every article's blocks. */
export type ArticleCardData = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
  cover: MediaSummary | null;
};

/** The article page adds the block body and the review trail. */
export type ArticleDetail = ArticleCardData & {
  body: Block[];
  authorReviewer: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
};

const publishedOnly = eq(articles.status, "published");
const newestFirst = [desc(articles.publishedAt), desc(articles.createdAt)] as const;

type Row = typeof articles.$inferSelect & {
  coverImage: Parameters<typeof toMediaSummary>[0] | null;
};

function toCard(row: Row): ArticleCardData {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    // Dates cross the server → client boundary as ISO strings, like media rows.
    publishedAt: row.publishedAt?.toISOString() ?? null,
    cover: row.coverImage ? toMediaSummary(row.coverImage) : null,
  };
}

/** Everything published, for /artykuly. */
export async function getPublishedArticles(): Promise<ArticleCardData[]> {
  const rows = await db.query.articles.findMany({
    where: publishedOnly,
    orderBy: [...newestFirst],
    with: { coverImage: true },
  });
  return rows.map(toCard);
}

/** The homepage teaser — the newest few. */
export async function getLatestArticles(limit = 4): Promise<ArticleCardData[]> {
  const rows = await db.query.articles.findMany({
    where: publishedOnly,
    orderBy: [...newestFirst],
    limit,
    with: { coverImage: true },
  });
  return rows.map(toCard);
}

/** One article, or null when the slug is unknown or the row is still a draft. */
export async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  const row = await db.query.articles.findFirst({
    where: and(publishedOnly, eq(articles.slug, slug)),
    with: { coverImage: true },
  });
  if (!row) return null;
  return {
    ...toCard(row),
    body: row.body,
    authorReviewer: row.authorReviewer,
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
  };
}

/** Slugs alone, for `generateStaticParams`. */
export async function getArticleSlugs(): Promise<string[]> {
  const rows = await db
    .select({ slug: articles.slug })
    .from(articles)
    .where(publishedOnly)
    .orderBy(...newestFirst);
  return rows.map((row) => row.slug);
}

/** Three more to read at the foot of an article, never the one being read. */
export async function getRelatedArticles(slug: string, limit = 3): Promise<ArticleCardData[]> {
  const rows = await db.query.articles.findMany({
    where: and(publishedOnly, ne(articles.slug, slug)),
    orderBy: [...newestFirst],
    limit,
    with: { coverImage: true },
  });
  return rows.map(toCard);
}
