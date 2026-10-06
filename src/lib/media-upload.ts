import { createUploadUrl, registerMedia } from "@/app/admin/(shell)/media/actions";
import type { DataResult } from "@/lib/action-result";
import { describeImageError } from "@/lib/gallery-image";
import { renderWidthVariants, type WidthVariant } from "@/lib/media-image";
import type { MediaSummary } from "@/lib/media-types";
import { altFromFileName } from "@/lib/slug";
import { ALLOWED_UPLOAD_TYPES_CLIENT, MAX_UPLOAD_BYTES_CLIENT } from "@/lib/upload-limits";

/** Images get their intrinsic size read in the browser so the DB has real dimensions. */
async function readImageSize(file: File): Promise<{ width: number; height: number } | null> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return null;
  try {
    const bitmap = await createImageBitmap(file);
    const size = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return size;
  } catch {
    return null;
  }
}

/**
 * Browser → presigned URLs → R2 → library row.
 *
 * A photo goes up with its responsive copies (`image-variants.ts`), rendered
 * here first. The site's image loader assumes every copy exists, so the row is
 * only written once all of them are in the bucket — a failure leaves orphaned
 * objects, which are harmless, never a row whose copies are missing.
 *
 * Shared by the media library and the in-form picker, so uploading while
 * editing a record produces exactly the same library entry as uploading in
 * /admin/media. Errors come back as strings for the caller to surface.
 */
export async function uploadMediaFile(file: File): Promise<DataResult<MediaSummary>> {
  if (file.size > MAX_UPLOAD_BYTES_CLIENT) {
    return { ok: false, error: `${file.name}: plik jest za duży (maks. 15 MB).` };
  }

  const contentType = ALLOWED_UPLOAD_TYPES_CLIENT.find((type) => type === file.type);
  if (!contentType) {
    return { ok: false, error: `${file.name}: nieobsługiwany typ pliku.` };
  }

  const prepared = await createUploadUrl({
    fileName: file.name,
    contentType,
    size: file.size,
  });
  if (!prepared.ok) return prepared;

  let variants: WidthVariant[] = [];
  if (prepared.data.variants.length > 0) {
    try {
      variants = await renderWidthVariants(file);
    } catch (error) {
      return { ok: false, error: describeImageError(error, file.name) };
    }
  }

  const put = (url: string, body: Blob, type: string) =>
    fetch(url, { method: "PUT", body, headers: { "Content-Type": type } });
  const responses = await Promise.all([
    put(prepared.data.uploadUrl, file, file.type),
    ...prepared.data.variants.map(({ width, uploadUrl }) =>
      put(uploadUrl, variants.find((variant) => variant.width === width)!.blob, "image/webp"),
    ),
  ]);
  const failed = responses.find((response) => !response.ok);
  if (failed) {
    return { ok: false, error: `${file.name}: przesyłanie nie powiodło się (${failed.status}).` };
  }

  const dimensions = await readImageSize(file);
  return registerMedia({
    key: prepared.data.key,
    url: prepared.data.publicUrl,
    mimeType: contentType,
    size: file.size,
    width: dimensions?.width ?? null,
    height: dimensions?.height ?? null,
    altText: altFromFileName(file.name),
  });
}
