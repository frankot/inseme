"use client";

import type { ImageLoaderProps } from "next/image";

/**
 * Images live in R2 behind a Cloudflare custom domain, so resizing happens at
 * the edge via /cdn-cgi/image/ instead of Vercel's optimizer. Anything that
 * isn't a remote raster image (local /public assets, SVG) passes through.
 */
export default function cloudflareImageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (!src.startsWith("http") || src.endsWith(".svg")) return src;

  const url = new URL(src);
  const options = `width=${width},quality=${quality ?? 75},format=auto`;
  return `${url.origin}/cdn-cgi/image/${options}${url.pathname}`;
}
