import { desc } from "drizzle-orm";
import type { Metadata } from "next";

import { ArticleForm } from "@/app/admin/(shell)/articles/article-form";
import { getReviewerOptions } from "@/app/admin/(shell)/articles/reviewers";
import { PageHeader } from "@/components/admin/page-header";
import { db } from "@/db";
import { media } from "@/db/schema";
import { toMediaSummary } from "@/lib/media-summary";

export const metadata: Metadata = { title: "Nowy artykuł — panel Insieme" };

export default async function NewArticlePage() {
  const [mediaRows, team] = await Promise.all([
    db.select().from(media).orderBy(desc(media.uploadedAt)),
    getReviewerOptions(),
  ]);

  return (
    <>
      <PageHeader title="Nowy artykuł" backHref="/admin/articles" />
      <ArticleForm
        id={null}
        status={null}
        publishedAt={null}
        defaultCoverImage={null}
        mediaLibrary={mediaRows.map(toMediaSummary)}
        team={team}
        defaultValues={{
          title: "",
          slug: "",
          excerpt: "",
          body: [],
          authorReviewer: "",
          reviewerId: null,
          coverImageId: null,
          metaTitle: "",
          metaDescription: "",
        }}
      />
    </>
  );
}
