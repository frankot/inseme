/** The media fields the admin UI actually needs — shared by pickers and lists. */
export type MediaSummary = {
  id: string;
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
  mimeType: string;
  size: number;
  uploadedAt: string;
};

/** One place a library file appears — shown on its card in the library. */
export type MediaUsage = {
  label: string;
  href: string;
  /** The place itself is unpublished, or only its draft uses the file. */
  draft: boolean;
};

/**
 * Everything in the R2 bucket, as the library lists it (`media-inventory.ts`):
 * a library file, a gallery photo (its thumb and full together), or an object
 * no table knows about — left behind by an interrupted upload or added by hand.
 */
export type InventoryItem =
  | { kind: "media"; item: MediaSummary; usedIn: MediaUsage[] }
  | {
      kind: "gallery";
      id: string;
      thumbUrl: string;
      fullUrl: string;
      alt: string;
      description: string | null;
      status: "draft" | "published";
      featuredOnHome: boolean;
      width: number;
      height: number;
      size: number;
      uploadedAt: string;
    }
  | {
      kind: "stray";
      /** The objects' shared name, e.g. `media/2026/<uuid>-dom` — identifies the group. */
      group: string;
      /** The original and its copies, or a gallery photo's full and thumb. */
      keys: string[];
      /** The best one to look at: the original, else the largest copy. */
      url: string;
      size: number;
      uploadedAt: string;
    };
