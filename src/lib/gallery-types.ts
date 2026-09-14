/**
 * Shapes shared by the browser, the server actions and the public page. Kept
 * out of `queries/gallery.ts` because that file is `server-only` and the admin
 * grid is a client component.
 */

/** One rendered variant of a photo, as stored and as served. */
export type GalleryVariant = {
  url: string;
  width: number;
  height: number;
};

/** What the public grid and lightbox need. Dates never cross the boundary. */
export type GalleryPhotoView = {
  id: string;
  alt: string;
  description: string | null;
  thumb: GalleryVariant;
  full: GalleryVariant;
};

/** The admin grid additionally needs the publish state and stored weight. */
export type GalleryPhotoAdmin = GalleryPhotoView & {
  altText: string | null;
  status: "draft" | "published";
  publishedAt: string | null;
  sortOrder: number;
  /** Thumb + full, in bytes — what this photo actually costs the bucket. */
  totalSize: number;
};

/** Photos per page on /galeria. Also the page size the admin list mirrors. */
export const GALLERY_PAGE_SIZE = 24;

/** Alt text is what a screen reader gets; the caption is the sensible fallback. */
export function galleryAlt(altText: string | null, description: string | null): string {
  return altText?.trim() || description?.trim() || "Zdjęcie z ośrodka Insieme";
}
