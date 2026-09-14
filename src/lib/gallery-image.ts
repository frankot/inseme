"use client";

/**
 * Browser-side resize + WebP encode, run before anything touches the network.
 *
 * The bucket is served from the `pub-….r2.dev` domain, where Cloudflare's
 * `/cdn-cgi/image/` transformations are not available (`supportsEdgeResize`
 * returns false, and every gallery `<img>` is therefore `unoptimized`). So
 * there is no second chance to shrink a photo: the bytes uploaded here are the
 * bytes a visitor on a phone downloads. A 4 MB JPEG straight off a camera
 * would be a 4 MB JPEG in the grid.
 *
 * Two variants come out of one decode:
 *   thumb — the grid tile, and the lightbox's instant first paint
 *   full  — what the lightbox settles on
 *
 * The original is never uploaded; we have no use for it and it would cost
 * roughly ten times the storage of both variants together.
 */

export type VariantSpec = {
  /** Longest edge, in CSS pixels. Smaller images are never upscaled. */
  maxEdge: number;
  quality: number;
};

export const GALLERY_VARIANTS = {
  /**
   * 1600px, not 2000px, after measuring the four sample photos: cutting the
   * long edge buys far more than cutting quality does. 1600@0.82 lands on the
   * same file size as 2000@0.75 (250–560 kB across the samples) while keeping
   * the per-pixel quality that stops WebP smearing foliage — and 1600px still
   * exceeds what the lightbox displays on any ordinary screen, since the photo
   * is letterboxed inside the viewport rather than filling it.
   *
   * It matters here more than it would elsewhere: the lightbox preloads both
   * neighbours, so opening one photo fetches three.
   */
  full: { maxEdge: 1600, quality: 0.82 },
  /** Grid tiles are at most ~480px wide; 640 keeps them crisp at 2×. */
  thumb: { maxEdge: 640, quality: 0.78 },
} as const satisfies Record<string, VariantSpec>;

export type RenderedVariant = {
  blob: Blob;
  width: number;
  height: number;
};

export type RenderedPhoto = {
  full: RenderedVariant;
  thumb: RenderedVariant;
  /** Original bytes, so the admin can report what the conversion saved. */
  sourceSize: number;
};

/**
 * Generous, because it is only a guard against someone picking a RAW file by
 * mistake — the original never leaves the browser, so this is not an upload
 * limit. The *derivatives* are what R2 and `MAX_UPLOAD_BYTES` see.
 */
export const MAX_SOURCE_BYTES = 40 * 1024 * 1024;

/** Decodable by `createImageBitmap` everywhere we care about. */
export const GALLERY_SOURCE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/** What the file input offers. HEIC is listed for iOS, which can decode it. */
export const GALLERY_ACCEPT = [...GALLERY_SOURCE_TYPES, "image/heic", "image/heif"].join(",");

function fits(width: number, height: number, maxEdge: number) {
  const scale = Math.min(1, maxEdge / Math.max(width, height));
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

function makeCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

/**
 * Halve repeatedly before the final draw.
 *
 * A single `drawImage` from 4000px straight to 640px throws away fifteen of
 * every sixteen pixels and aliases badly — foliage and brickwork, which is
 * most of what this gallery holds, come out crawling with artefacts. Stepping
 * down in halves averages those pixels instead, and costs a few milliseconds.
 */
function drawScaled(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  target: { width: number; height: number },
): HTMLCanvasElement {
  let current: CanvasImageSource = source;
  let width = sourceWidth;
  let height = sourceHeight;

  while (width > target.width * 2 && height > target.height * 2) {
    const next = makeCanvas(Math.round(width / 2), Math.round(height / 2));
    const context = next.getContext("2d");
    if (!context) break;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(current, 0, 0, next.width, next.height);
    current = next;
    width = next.width;
    height = next.height;
  }

  const canvas = makeCanvas(target.width, target.height);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("canvas-unavailable");
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  // Photos are opaque; a white ground keeps any stray alpha from going black.
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(current, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("encode-failed"));
          return;
        }
        // A browser without WebP silently hands back a PNG, which for a photo
        // is enormous. Refuse rather than upload a 6 MB "thumbnail".
        if (blob.type !== "image/webp") {
          reject(new Error("webp-unsupported"));
          return;
        }
        resolve(blob);
      },
      "image/webp",
      quality,
    );
  });
}

/**
 * Decode once, render both variants.
 *
 * `imageOrientation: "from-image"` applies the EXIF rotation, without which
 * every photo taken on a phone held sideways lands in the gallery on its side —
 * the orientation tag does not survive the canvas.
 */
export async function renderGalleryVariants(file: File): Promise<RenderedPhoto> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error("decode-failed");
  }

  try {
    const fullTarget = fits(bitmap.width, bitmap.height, GALLERY_VARIANTS.full.maxEdge);
    const fullCanvas = drawScaled(bitmap, bitmap.width, bitmap.height, fullTarget);
    const fullBlob = await toBlob(fullCanvas, GALLERY_VARIANTS.full.quality);

    // The thumb comes off the already-downscaled full canvas rather than the
    // bitmap: same result, but the expensive halving happened once.
    const thumbTarget = fits(fullTarget.width, fullTarget.height, GALLERY_VARIANTS.thumb.maxEdge);
    const thumbCanvas = drawScaled(fullCanvas, fullTarget.width, fullTarget.height, thumbTarget);
    const thumbBlob = await toBlob(thumbCanvas, GALLERY_VARIANTS.thumb.quality);

    return {
      full: { blob: fullBlob, ...fullTarget },
      thumb: { blob: thumbBlob, ...thumbTarget },
      sourceSize: file.size,
    };
  } finally {
    bitmap.close();
  }
}

/** Turns the thrown codes above into something an editor can act on. */
export function describeImageError(error: unknown, fileName: string): string {
  const code = error instanceof Error ? error.message : "";
  if (code === "decode-failed") {
    return `${fileName}: nie udało się odczytać zdjęcia. Zapisz je jako JPEG lub PNG i spróbuj ponownie.`;
  }
  if (code === "webp-unsupported") {
    return `${fileName}: ta przeglądarka nie zapisuje plików WebP. Użyj Chrome, Safari 16+ lub Firefox.`;
  }
  return `${fileName}: nie udało się przygotować zdjęcia do wysyłki.`;
}
