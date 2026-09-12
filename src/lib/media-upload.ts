import { createUploadUrl, registerMedia } from "@/app/admin/(shell)/media/actions";
import type { DataResult } from "@/lib/action-result";
import type { MediaSummary } from "@/lib/media-types";
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
 * Browser → presigned URL → R2 → library row.
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

  const response = await fetch(prepared.data.uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });
  if (!response.ok) {
    return { ok: false, error: `${file.name}: przesyłanie nie powiodło się (${response.status}).` };
  }

  const dimensions = await readImageSize(file);
  return registerMedia({
    key: prepared.data.key,
    url: prepared.data.publicUrl,
    mimeType: contentType,
    size: file.size,
    width: dimensions?.width ?? null,
    height: dimensions?.height ?? null,
  });
}
