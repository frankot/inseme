import type { Metadata } from "next";
import { desc } from "drizzle-orm";

import { MediaLibrary } from "@/app/admin/(shell)/media/media-library";
import { PageHeader } from "@/components/admin/page-header";
import { MEDIA_TABS, SectionTabs } from "@/components/admin/section-tabs";
import { db } from "@/db";
import { media } from "@/db/schema";
import { toMediaSummary } from "@/lib/media-summary";
import { getR2Config } from "@/lib/r2";

export const metadata: Metadata = { title: "Biblioteka mediów — panel Insieme" };

export default async function MediaPage() {
  const rows = await db.select().from(media).orderBy(desc(media.uploadedAt));

  return (
    <>
      <SectionTabs tabs={MEDIA_TABS} current="/admin/media" />
      <PageHeader
        title="Biblioteka mediów"
        description="Wszystkie zdjęcia i pliki używane na stronie — w artykułach, w CMS i u zespołu. Zdjęcia do strony /galeria są w zakładce Galeria. Opis alternatywny (alt) jest ważny dla dostępności i SEO."
      />
      <MediaLibrary
        storageConfigured={getR2Config() !== null}
        initialItems={rows.map(toMediaSummary)}
      />
    </>
  );
}
