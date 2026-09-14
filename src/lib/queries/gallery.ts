import "server-only";

import { asc, desc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { galleryPhotos } from "@/db/schema";
import {
  GALLERY_PAGE_SIZE,
  galleryAlt,
  type GalleryPhotoView,
} from "@/lib/gallery-types";

/**
 * Read side of `gallery_photos` for the public site. The admin panel queries
 * the table directly because it needs drafts; everything here is published-only
 * and in the order /admin/galeria promises — the hand-set position first, then
 * newest, so a gallery nobody has reordered still reads newest-first.
 *
 * Nothing here is wrapped in a cache. /osrodek is static on the usual
 * five-minute window and the admin actions `revalidatePath` it, exactly as the
 * FAQ and team actions do. /galeria reads `?page=`, which makes it dynamic, so
 * it pays two indexed queries per view — a count and a 24-row window. That is
 * a few milliseconds on Neon, and it is worth more than the alternative: an
 * `unstable_cache` layer whose tags answer to `revalidateTag` while the rest of
 * Next 16 has moved to `updateTag`, which is precisely the kind of seam where
 * a published photo quietly fails to appear.
 */

export type GalleryPage = {
  photos: GalleryPhotoView[];
  page: number;
  pageCount: number;
  total: number;
};

const published = eq(galleryPhotos.status, "published");
const galleryOrder = [asc(galleryPhotos.sortOrder), desc(galleryPhotos.createdAt)] as const;

type Row = typeof galleryPhotos.$inferSelect;

function toView(row: Row): GalleryPhotoView {
  return {
    id: row.id,
    alt: galleryAlt(row.altText, row.description),
    description: row.description,
    thumb: { url: row.thumbUrl, width: row.thumbWidth, height: row.thumbHeight },
    full: { url: row.fullUrl, width: row.fullWidth, height: row.fullHeight },
  };
}

async function readPage(page: number): Promise<GalleryPage> {
  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(galleryPhotos)
    .where(published);

  const pageCount = Math.max(1, Math.ceil(total / GALLERY_PAGE_SIZE));
  // A stale ?page=99 lands on the last real page rather than an empty grid.
  const current = Math.min(Math.max(1, page), pageCount);

  const rows = await db
    .select()
    .from(galleryPhotos)
    .where(published)
    .orderBy(...galleryOrder)
    .limit(GALLERY_PAGE_SIZE)
    .offset((current - 1) * GALLERY_PAGE_SIZE);

  return { photos: rows.map(toView), page: current, pageCount, total };
}

/** One page of the gallery, newest (or hand-ordered) first. */
export const getGalleryPage = readPage;

async function readTeaser(limit: number): Promise<GalleryPhotoView[]> {
  const rows = await db
    .select()
    .from(galleryPhotos)
    .where(published)
    .orderBy(...galleryOrder)
    .limit(limit);
  return rows.map(toView);
}

/** The first few photos, for the band on /osrodek that links into /galeria. */
export const getGalleryTeaser = readTeaser;

/** Parses `?page=` defensively — anything unusable is page 1. */
export function parsePageParam(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}
