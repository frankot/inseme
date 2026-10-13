import type { Metadata } from "next";

import { MediaLibrary } from "@/app/admin/(shell)/media/media-library";
import { PageHeader } from "@/components/admin/page-header";
import { MEDIA_TABS, SectionTabs } from "@/components/admin/section-tabs";
import { loadMediaInventory } from "@/lib/media-inventory";
import { getR2Config } from "@/lib/r2";

export const metadata: Metadata = { title: "Biblioteka mediów — panel Insieme" };

export default async function MediaPage() {
  const { items, bucketListed } = await loadMediaInventory();

  return (
    <>
      <SectionTabs tabs={MEDIA_TABS} current="/admin/media" />
      <PageHeader
        title="Biblioteka mediów"
        description="Wszystko, co jest w magazynie plików: pliki biblioteki (z informacją, gdzie są użyte), zdjęcia galerii (edytowane w zakładce Galeria) i pliki bez wpisu w bazie. Opis alternatywny (alt) jest ważny dla dostępności i SEO."
      />
      <MediaLibrary
        storageConfigured={getR2Config() !== null}
        bucketListed={bucketListed}
        initialItems={items}
      />
    </>
  );
}
