"use client";

import { drawScaled, toBlob } from "@/lib/gallery-image";
import { VARIANT_QUALITY, VARIANT_WIDTHS, type VariantWidth } from "@/lib/image-variants";

export type WidthVariant = { width: VariantWidth; blob: Blob };

/**
 * The responsive copies of a library photo (`image-variants.ts`), made in the
 * browser before upload with the gallery's resize: one decode, EXIF rotation
 * applied, stepped downscaling, WebP or nothing.
 *
 * Widest first, each drawn from the previous canvas, so the expensive halving
 * from a camera-sized original happens once. A copy is never upscaled — a
 * photo narrower than 2400px gets its own width for the larger names.
 */
export async function renderWidthVariants(file: File): Promise<WidthVariant[]> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error("decode-failed");
  }

  try {
    const out: WidthVariant[] = [];
    let source: CanvasImageSource = bitmap;
    let sourceWidth = bitmap.width;
    let sourceHeight = bitmap.height;

    for (const width of [...VARIANT_WIDTHS].reverse()) {
      const targetWidth = Math.min(width, sourceWidth);
      const target = {
        width: targetWidth,
        height: Math.max(1, Math.round((sourceHeight * targetWidth) / sourceWidth)),
      };
      // Transparency is kept: the library also holds logos and graphics.
      const canvas = drawScaled(source, sourceWidth, sourceHeight, target, false);
      out.push({ width, blob: await toBlob(canvas, VARIANT_QUALITY) });
      source = canvas;
      sourceWidth = target.width;
      sourceHeight = target.height;
    }
    return out;
  } finally {
    bitmap.close();
  }
}
