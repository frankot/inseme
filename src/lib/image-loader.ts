"use client";

import type { ImageLoaderProps } from "next/image";

import { supportsEdgeResize } from "./image-host";
import { hasVariants, variantFor } from "./image-variants";

/**
 * Photos with pre-made copies (library uploads, /public/placeholder) get the
 * copy nearest the width asked for — see `image-variants.ts`. Failing that, a
 * source on a Cloudflare zone is resized at the edge via /cdn-cgi/image/.
 * Anything else — SVG, the gallery's own sized WebPs — passes through as is.
 */
export default function cloudflareImageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (hasVariants(src)) return variantFor(src, width);
  if (!supportsEdgeResize(src)) return src;

  const url = new URL(src);
  const options = `width=${width},quality=${quality ?? 75},format=auto`;
  return `${url.origin}/cdn-cgi/image/${options}${url.pathname}`;
}
