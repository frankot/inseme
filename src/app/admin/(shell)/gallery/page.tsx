import { desc, asc } from "drizzle-orm";
import type { Metadata } from "next";

import { GalleryManager } from "@/app/admin/(shell)/gallery/gallery-manager";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { galleryPhotos } from "@/db/schema";
import { galleryAlt, type GalleryPhotoAdmin } from "@/lib/gallery-types";
import { getR2Config } from "@/lib/r2";

export const metadata: Metadata = { title: "Galeria — panel Insieme" };

export default async function GalleryAdminPage() {
  // The admin list is not cached — an editor must see a draft the instant it
  // exists, unlike /galeria, which reads through a five-minute cache.
  const rows = await db
    .select()
    .from(galleryPhotos)
    .orderBy(asc(galleryPhotos.sortOrder), desc(galleryPhotos.createdAt));

  const photos: GalleryPhotoAdmin[] = rows.map((row) => ({
    id: row.id,
    alt: galleryAlt(row.altText, row.description),
    altText: row.altText,
    description: row.description,
    thumb: { url: row.thumbUrl, width: row.thumbWidth, height: row.thumbHeight },
    full: { url: row.fullUrl, width: row.fullWidth, height: row.fullHeight },
    status: row.status,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    sortOrder: row.sortOrder,
    totalSize: row.thumbSize + row.fullSize,
  }));

  return (
    <>
      <PageHeader
        title="Galeria"
        description="Zdjęcia ośrodka na stronie /galeria. Kolejność ustawiasz przeciągając kafelki — pierwsze sześć opublikowanych trafia też na stronę Ośrodek. Nowe zdjęcia czekają jako wersje robocze, dopóki ich nie opublikujesz."
        actions={
          <Button
            variant="outline"
            render={<a href="/galeria" target="_blank" rel="noopener noreferrer" />}
          >
            Zobacz galerię
          </Button>
        }
      />
      <GalleryManager initialPhotos={photos} storageConfigured={getR2Config() !== null} />
    </>
  );
}
