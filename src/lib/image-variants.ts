/**
 * Responsive copies of every photo, made once rather than on request.
 *
 * The bucket is on R2's `r2.dev` domain, where Cloudflare can't resize, and
 * the custom image loader switches off Next's own optimizer — so nothing
 * resizes at request time. Instead each photo has WebP copies at fixed widths,
 * stored beside it:
 *
 *   media/2026/<uuid>-dom.jpg        the original, as uploaded
 *   media/2026/<uuid>-dom.w640.webp  …w1080, w1600, w2400
 *
 * Made in the browser on upload (`media-upload.ts`), by
 * `npm run images:backfill` for photos uploaded before, and by
 * `npm run images:local` for the photos in /public/placeholder. A copy is
 * never larger than its original, so a 900px photo's w1600 and w2400 are
 * simply 900px — every name always exists, and the loader needs no lookup.
 *
 * Shared by the image loader (browser), `SiteImage`, the upload code and the
 * scripts, so it stays free of server- and browser-only imports.
 */

export const VARIANT_WIDTHS = [640, 1080, 1600, 2400] as const;
export type VariantWidth = (typeof VARIANT_WIDTHS)[number];

/**
 * Encoder quality for the copies. Measured on the hero (dense foliage, the
 * worst case): 0.72 is a fifth smaller than 0.8 at the 1080 width with no
 * visible loss under the hero's scrim and filters.
 */
export const VARIANT_QUALITY = 0.72;

/** Library uploads: `buildObjectKey` in r2.ts. SVG and PDF have no copies. */
const MEDIA_PATH = /^\/media\/\d{4}\/[0-9a-f-]{36}-[a-z0-9-]+\.(jpg|png|webp|avif)$/;
/** Photos shipped in /public, until the final ones arrive through the library. */
const LOCAL_PATH = /^\/placeholder\/[a-z0-9-]+\.(jpg|png|webp)$/;

function pathOf(src: string): string | null {
  if (src.startsWith("/")) return src.split("?")[0];
  try {
    return new URL(src).pathname;
  } catch {
    return null;
  }
}

/** True for a photo that has copies. Copies themselves never match. */
export function hasVariants(src: string): boolean {
  const path = pathOf(src);
  if (!path) return false;
  return src.startsWith("/") ? LOCAL_PATH.test(path) : MEDIA_PATH.test(path);
}

/** `…/dom.jpg` + 1080 → `…/dom.w1080.webp`. Works on a key, a path or a URL. */
export function variantOf(src: string, width: VariantWidth): string {
  return src.replace(/\.[a-z0-9]+(\?.*)?$/i, `.w${width}.webp`);
}

/** The smallest copy at least `width` wide, or the largest there is. */
export function variantFor(src: string, width: number): string {
  const fit = VARIANT_WIDTHS.find((candidate) => candidate >= width) ?? VARIANT_WIDTHS.at(-1)!;
  return variantOf(src, fit);
}
