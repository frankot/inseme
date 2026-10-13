import { desc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { deleteArticle } from "@/app/admin/(shell)/articles/actions";
import { ArticleForm } from "@/app/admin/(shell)/articles/article-form";
import { getReviewerOptions } from "@/app/admin/(shell)/articles/reviewers";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { PageHeader } from "@/components/admin/page-header";
import { db } from "@/db";
import { articles, media } from "@/db/schema";
import { toMediaSummary } from "@/lib/media-summary";
import { articleFormOf } from "@/lib/record-forms";
import { isProtectedArticle, PROTECTED_ARTICLE_NOTE } from "@/lib/protected-articles";

export const metadata: Metadata = { title: "Edycja artykułu — panel Insieme" };

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await db.query.articles.findFirst({ where: eq(articles.id, id) });
  if (!row) notFound();

  const [mediaRows, team] = await Promise.all([
    db.select().from(media).orderBy(desc(media.uploadedAt)),
    getReviewerOptions(),
  ]);
  const locked = isProtectedArticle(row.slug);
  // The form opens on the pending changes when there are any; the live
  // article is what it marks changes against.
  const live = articleFormOf(row);
  const values = row.pendingChanges ?? live;
  const coverImage = mediaRows.find((item) => item.id === values.coverImageId) ?? null;

  return (
    <>
      <PageHeader
        title={row.title}
        description={`/${row.slug}`}
        backHref="/admin/articles"
        actions={
          locked ? undefined : (
            <ConfirmDelete
              onConfirm={deleteArticle.bind(null, row.id)}
              title="Usunąć artykuł?"
              redirectTo="/admin/articles"
            />
          )
        }
      />

      {locked && (
        <p className="mb-4 rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground">
          {PROTECTED_ARTICLE_NOTE}
        </p>
      )}

      <ArticleForm
        id={row.id}
        status={row.status}
        publishedAt={row.publishedAt?.toISOString() ?? null}
        defaultCoverImage={coverImage ? toMediaSummary(coverImage) : null}
        mediaLibrary={mediaRows.map(toMediaSummary)}
        team={team}
        slugLocked={locked}
        defaultValues={values}
        published={row.status === "published" ? live : null}
        pendingSavedAt={row.pendingChanges ? (row.pendingUpdatedAt?.toISOString() ?? null) : null}
      />
    </>
  );
}
