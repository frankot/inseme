import type { Media } from "@/db/schema";
import type { MediaSummary } from "@/lib/media-types";

/** Rows cross the server → client boundary, so Date becomes an ISO string. */
export function toMediaSummary(row: Media): MediaSummary {
  return {
    id: row.id,
    url: row.url,
    altText: row.altText,
    width: row.width,
    height: row.height,
    mimeType: row.mimeType,
    size: row.size,
    uploadedAt: row.uploadedAt.toISOString(),
  };
}
