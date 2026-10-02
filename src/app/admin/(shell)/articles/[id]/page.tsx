import { desc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  deleteArticle,
  publishArticle,
  unpublishArticle,
} from "@/app/admin/(shell)/articles/actions";
import { ArticleForm } from "@/app/admin/(shell)/articles/article-form";
import { getReviewerOptions } from "@/app/admin/(shell)/articles/reviewers";
import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { PageHeader } from "@/components/admin/page-header";
import { PublishControls } from "@/components/admin/publish-controls";
import { db } from "@/db";
import { articles, media } from "@/db/schema";
import { toMediaSummary } from "@/lib/media-summary";

export const metadata: Metadata = { title: "Edycja artykułu — panel Insieme" };

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await db.query.articles.findFirst({ where: eq(articles.id, id) });
  if (!row) notFound();

  const [mediaRows, team] = await Promise.all([
    db.select().from(media).orderBy(desc(media.uploadedAt)),
    getReviewerOptions(),
  ]);
  const coverImage = mediaRows.find((item) => item.id === row.coverImageId) ?? null;

  return (
    <>
      <PageHeader
        title={row.title}
        description={`/${row.slug}`}
        backHref="/admin/articles"
        actions={
          <ConfirmDelete
            onConfirm={deleteArticle.bind(null, row.id)}
            title="Usunąć artykuł?"
            redirectTo="/admin/articles"
          />
        }
      />

      <div className="mb-6 rounded-lg border px-4 py-3">
        <PublishControls
          status={row.status}
          publishedAt={row.publishedAt?.toISOString() ?? null}
          onPublish={publishArticle.bind(null, row.id)}
          onUnpublish={unpublishArticle.bind(null, row.id)}
        />
      </div>

      <ArticleForm
        id={row.id}
        defaultCoverImage={coverImage ? toMediaSummary(coverImage) : null}
        mediaLibrary={mediaRows.map(toMediaSummary)}
        team={team}
        defaultValues={{
          title: row.title,
          slug: row.slug,
          excerpt: row.excerpt ?? "",
          body: row.body,
          authorReviewer: row.authorReviewer ?? "",
          reviewerId: row.reviewerId,
          coverImageId: row.coverImageId,
          metaTitle: row.metaTitle ?? "",
          metaDescription: row.metaDescription ?? "",
        }}
      />
    </>
  );
}
