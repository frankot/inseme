import { createUploadUrl, registerMedia } from "@/app/admin/(shell)/media/actions";
import type { DataResult } from "@/lib/action-result";
import type { MediaSummary } from "@/lib/media-types";
import { altFromFileName } from "@/lib/slug";
import { ALLOWED_UPLOAD_TYPES_CLIENT, MAX_UPLOAD_BYTES_CLIENT } from "@/lib/upload-limits";

type AllowedType = (typeof ALLOWED_UPLOAD_TYPES_CLIENT)[number];

/** Some browsers leave `file.type` empty (often for HEIC); the extension decides then. */
const TYPE_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  svg: "image/svg+xml",
  pdf: "application/pdf",
  heic: "image/heic",
  heif: "image/heif",
};

function typeOf(file: File): string {
  if (file.type) return file.type.toLowerCase();
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return TYPE_BY_EXTENSION[extension] ?? "";
}

const isHeic = (type: string) => type === "image/heic" || type === "image/heif";

/** Photos the browser shrinks before upload. SVG and PDF go up untouched. */
const RASTER_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/heic", "image/heif"]);

/**
 * Longest edge of an uploaded original. Above the largest responsive copy
 * (2400 px, made on the server), so no copy loses detail — but a 12 MB camera
 * photo goes up as 1–2 MB.
 */
const ORIGINAL_MAX_EDGE = 3000;
const ORIGINAL_JPEG_QUALITY = 0.9;

function hasTransparency(context: CanvasRenderingContext2D, width: number, height: number): boolean {
  const { data } = context.getImageData(0, 0, width, height);
  for (let alpha = 3; alpha < data.length; alpha += 4) {
    if (data[alpha] < 255) return true;
  }
  return false;
}

/**
 * The original as it should be stored: capped at `ORIGINAL_MAX_EDGE` and saved
 * as JPEG (which every browser, Safari included, can encode). Turned upright
 * from the camera's orientation, and the JPEG carries no EXIF — so no GPS
 * position either.
 *
 * - photos already within the cap are left as they are;
 * - so are images with transparency (logos, cut-outs) — JPEG would flatten them;
 * - HEIC is always converted, since the site and the server can't read it;
 *   `null` means this browser can't decode it.
 */
async function prepareOriginal(file: File, type: string): Promise<File | null> {
  const heic = isHeic(type);
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    // Not decodable here: HEIC can't go up; anything else goes up untouched
    // and the server reports it if it can't read it either.
    return heic ? null : file;
  }

  try {
    const scale = Math.min(1, ORIGINAL_MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && !heic) return file;

    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return heic ? null : file;
    context.imageSmoothingQuality = "high";
    context.drawImage(bitmap, 0, 0, width, height);

    if (type !== "image/jpeg" && !heic && hasTransparency(context, width, height)) return file;

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", ORIGINAL_JPEG_QUALITY),
    );
    if (!blob || blob.type !== "image/jpeg") return heic ? null : file;
    // A resize that somehow came out heavier isn't worth keeping.
    if (!heic && blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^./]+$/, "") + ".jpg", { type: "image/jpeg" });
  } finally {
    bitmap.close();
  }
}

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

/** What an HTTP status from the storage upload means for an editor. */
function describeStorageStatus(status: number): string {
  if (status === 403) return "magazyn odrzucił wysyłkę (link wygasł albo brak uprawnień) — spróbuj ponownie";
  if (status === 413) return "plik jest za duży dla magazynu";
  if (status >= 500) return `magazyn plików chwilowo nie odpowiada (błąd ${status}) — spróbuj za chwilę`;
  return `magazyn odrzucił plik (błąd ${status})`;
}

/**
 * Browser → presigned URL → R2 → library row.
 *
 * Photos are shrunk in the browser first (`prepareOriginal`), then only that
 * original goes up. Its responsive copies are made on the server while it is
 * registered (`registerMedia`) — not in the browser, because Safari can't
 * encode WebP.
 *
 * Never throws: every failure comes back as a message naming the file and the
 * step that failed, for the caller's toast. Shared by the media library and
 * the in-form picker.
 */
export async function uploadMediaFile(original: File): Promise<DataResult<MediaSummary>> {
  const name = original.name;
  const fail = (reason: string): DataResult<MediaSummary> => ({ ok: false, error: `${name}: ${reason}` });

  let file = original;
  let type = typeOf(file);

  if (RASTER_TYPES.has(type)) {
    const shrunk = await prepareOriginal(file, type);
    if (!shrunk) {
      return fail(
        "to zdjęcie w formacie HEIC (z iPhone’a lub Maca), którego ta przeglądarka nie potrafi odczytać. Wyeksportuj je jako JPEG (np. w aplikacji Zdjęcia: Plik › Eksportuj) albo dodaj w Safari.",
      );
    }
    if (shrunk !== file) {
      file = shrunk;
      type = "image/jpeg";
    }
  }

  if (file.size > MAX_UPLOAD_BYTES_CLIENT) {
    return fail(`plik ma ${(file.size / 1024 / 1024).toFixed(1)} MB — maksimum to 15 MB. Zmniejsz go i spróbuj ponownie.`);
  }

  const contentType = ALLOWED_UPLOAD_TYPES_CLIENT.find((allowed): allowed is AllowedType => allowed === type);
  if (!contentType) {
    return fail(
      `nieobsługiwany typ pliku${type ? ` (${type})` : ""}. Dozwolone: zdjęcia JPG, PNG, WebP, AVIF, HEIC oraz SVG i PDF.`,
    );
  }

  let prepared: Awaited<ReturnType<typeof createUploadUrl>>;
  try {
    prepared = await createUploadUrl({ fileName: file.name, contentType, size: file.size });
  } catch {
    return fail("nie udało się połączyć z serwerem, żeby przygotować wysyłkę. Sprawdź internet i spróbuj ponownie.");
  }
  if (!prepared.ok) return fail(prepared.error);

  let response: Response;
  try {
    response = await fetch(prepared.data.uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": contentType },
    });
  } catch {
    // fetch throws (rather than returning a status) when the request never
    // completes: no connection, or the browser blocked it — a storage CORS
    // rule that doesn't allow this site's address is the usual cause.
    return fail(
      "przeglądarka nie mogła wysłać pliku do magazynu. Sprawdź połączenie z internetem; jeśli problem się powtarza, zgłoś go — magazyn może nie przyjmować wysyłek z tego adresu strony (ustawienia CORS).",
    );
  }
  if (!response.ok) return fail(describeStorageStatus(response.status));

  const dimensions = await readImageSize(file);
  try {
    const registered = await registerMedia({
      key: prepared.data.key,
      url: prepared.data.publicUrl,
      mimeType: contentType,
      size: file.size,
      width: dimensions?.width ?? null,
      height: dimensions?.height ?? null,
      altText: altFromFileName(file.name),
    });
    return registered.ok ? registered : fail(registered.error);
  } catch {
    return fail(
      "plik został wysłany, ale serwer nie zdążył go zapisać w bibliotece (np. przerwane połączenie). Odśwież stronę — jeśli pliku nie ma na liście, dodaj go ponownie.",
    );
  }
}
