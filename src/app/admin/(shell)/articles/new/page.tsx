import { desc } from "drizzle-orm";
import type { Metadata } from "next";

import { ArticleForm } from "@/app/admin/(shell)/articles/article-form";
import { PageHeader } from "@/components/admin/page-header";
import { db } from "@/db";
import { media } from "@/db/schema";
import { toMediaSummary } from "@/lib/media-summary";

export const metadata: Metadata = { title: "Nowy artykuł — panel Insieme" };

export default async function NewArticlePage() {
  const mediaRows = await db.select().from(media).orderBy(desc(media.uploadedAt));

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Nowy artykuł" backHref="/admin/articles" />
      <ArticleForm
        id={null}
        defaultCoverImage={null}
        mediaLibrary={mediaRows.map(toMediaSummary)}
        defaultValues={{
          title: "",
          slug: "",
          excerpt: "",
          body: [],
          authorReviewer: "",
          coverImageId: null,
          metaTitle: "",
          metaDescription: "",
        }}
      />
    </div>
  );
}
