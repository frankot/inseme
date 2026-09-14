"use client";

import {
  createGalleryPhoto,
  createGalleryUploadUrls,
} from "@/app/admin/(shell)/gallery/actions";
import type { DataResult } from "@/lib/action-result";
import {
  describeImageError,
  MAX_SOURCE_BYTES,
  renderGalleryVariants,
} from "@/lib/gallery-image";
import type { GalleryPhotoAdmin } from "@/lib/gallery-types";

/**
 * One photo, end to end: resize + encode in the browser, two presigned PUTs to
 * R2, one row.
 *
 * The conversion happens first and the original is discarded, so what goes
 * over the wire is ~300 kB rather than the 4–8 MB a phone or a DSLR produces.
 * Nothing is recorded until both objects are safely in the bucket — a failed
 * second PUT leaves one orphaned object, which is cheap, rather than a row
 * pointing at an image that does not exist, which would break the grid.
 */
export type UploadProgress = { stage: "converting" | "uploading" | "saving" };

export async function uploadGalleryPhoto(
  file: File,
  onProgress?: (progress: UploadProgress) => void,
): Promise<DataResult<GalleryPhotoAdmin>> {
  if (file.size > MAX_SOURCE_BYTES) {
    return { ok: false, error: `${file.name}: plik jest za duży (maks. 40 MB).` };
  }
  if (!file.type.startsWith("image/")) {
    return { ok: false, error: `${file.name}: to nie jest zdjęcie.` };
  }

  onProgress?.({ stage: "converting" });
  let rendered;
  try {
    rendered = await renderGalleryVariants(file);
  } catch (error) {
    return { ok: false, error: describeImageError(error, file.name) };
  }

  const prepared = await createGalleryUploadUrls({
    fullSize: rendered.full.blob.size,
    thumbSize: rendered.thumb.blob.size,
  });
  if (!prepared.ok) return prepared;

  onProgress?.({ stage: "uploading" });
  const put = async (uploadUrl: string, blob: Blob) => {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      body: blob,
      headers: { "Content-Type": "image/webp" },
    });
    if (!response.ok) throw new Error(String(response.status));
  };

  try {
    await Promise.all([
      put(prepared.data.full.uploadUrl, rendered.full.blob),
      put(prepared.data.thumb.uploadUrl, rendered.thumb.blob),
    ]);
  } catch (error) {
    const status = error instanceof Error ? error.message : "?";
    return { ok: false, error: `${file.name}: wysyłka nie powiodła się (${status}).` };
  }

  onProgress?.({ stage: "saving" });
  return createGalleryPhoto({
    full: {
      key: prepared.data.full.key,
      url: prepared.data.full.publicUrl,
      width: rendered.full.width,
      height: rendered.full.height,
      size: rendered.full.blob.size,
    },
    thumb: {
      key: prepared.data.thumb.key,
      url: prepared.data.thumb.publicUrl,
      width: rendered.thumb.width,
      height: rendered.thumb.height,
      size: rendered.thumb.blob.size,
    },
  });
}

/** kB / MB, for the "przed → po" line the uploader shows after a conversion. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
