import type { Metadata } from "next";
import { desc } from "drizzle-orm";

import { MediaLibrary } from "@/app/admin/(shell)/media/media-library";
import { PageHeader } from "@/components/admin/page-header";
import { db } from "@/db";
import { media } from "@/db/schema";
import { toMediaSummary } from "@/lib/media-summary";
import { getR2Config } from "@/lib/r2";

export const metadata: Metadata = { title: "Media — panel Insieme" };

export default async function MediaPage() {
  const rows = await db.select().from(media).orderBy(desc(media.uploadedAt));

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Media"
        description="Zdjęcia i pliki używane na stronie. Opis alternatywny (alt) jest ważny dla dostępności i SEO."
      />
      <MediaLibrary
        storageConfigured={getR2Config() !== null}
        initialItems={rows.map(toMediaSummary)}
      />
    </div>
  );
}
