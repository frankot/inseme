import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { ArticleView } from "@/components/site/article/article-view";
import { getArticleForPreview, getRelatedArticles } from "@/lib/queries/articles";
import { getSiteContact } from "@/lib/queries/settings";

export const metadata: Metadata = {
  title: "Podgląd artykułu — Insieme",
  robots: { index: false, follow: false },
};

// The saved draft, every time.
export const dynamic = "force-dynamic";

/**
 * A draft article as the site will show it, for anyone holding the link — the
 * therapist checking it has no panel account. There is no login: the random
 * uuid in the address is the key, and nothing on the site links here. Once
 * the article is published the link forwards to it at /porady.
 */
export default async function ArticlePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // A malformed id would fail in Postgres as an invalid uuid, not as a miss.
  if (!z.uuid().safeParse(id).success) notFound();

  const article = await getArticleForPreview(id);
  if (!article) notFound();
  if (article.published) redirect(`/porady/${article.slug}`);

  const [contact, related] = await Promise.all([
    getSiteContact(),
    getRelatedArticles(article.slug),
  ]);
  return <ArticleView article={article} related={related} contact={contact} />;
}
