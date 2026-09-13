"use client";

import type { ImageLoaderProps } from "next/image";

import { supportsEdgeResize } from "./image-host";

/**
 * Images live in R2 behind a Cloudflare custom domain, so resizing happens at
 * the edge via /cdn-cgi/image/ instead of Vercel's optimizer. Anything that
 * cannot be resized there — local /public assets, SVG, the r2.dev dev domain —
 * passes through untouched.
 */
export default function cloudflareImageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (!supportsEdgeResize(src)) return src;

  const url = new URL(src);
  const options = `width=${width},quality=${quality ?? 75},format=auto`;
  return `${url.origin}/cdn-cgi/image/${options}${url.pathname}`;
}
