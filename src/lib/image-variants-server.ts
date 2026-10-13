import sharp from "sharp";

import { VARIANT_QUALITY, VARIANT_WIDTHS, type VariantWidth } from "./image-variants";

/**
 * Renders a photo's responsive copies (`image-variants.ts`) with sharp — used
 * when a library upload is registered (`media/actions.ts`) and by
 * `npm run images:backfill` / `images:local`.
 *
 * On the server rather than in the browser: Safari can't encode WebP, so a
 * browser-side render failed for every Safari user. Here every browser gets
 * the same real WebP copies.
 *
 * A copy is never upscaled. At full size an already-compressed WebP original
 * is reused as is, because re-encoding it would only add bytes.
 */
export async function renderVariants(original: Buffer): Promise<{ width: VariantWidth; body: Buffer }[]> {
  const { width: originalWidth, format } = await sharp(original).metadata();
  return Promise.all(
    VARIANT_WIDTHS.map(async (width) => {
      const body = await sharp(original)
        .rotate() // EXIF orientation
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: Math.round(VARIANT_QUALITY * 100), effort: 6 })
        .toBuffer();
      const sameSize = originalWidth !== undefined && width >= originalWidth;
      const reuse = sameSize && format === "webp" && original.length <= body.length;
      return { width, body: reuse ? original : body };
    }),
  );
}
