import Image, { type ImageProps } from "next/image";

import { supportsEdgeResize } from "@/lib/image-host";

/**
 * `next/image` with the right setting for whichever source it is handed.
 *
 * The project's custom loader (`src/lib/image-loader.ts`) resizes at the
 * Cloudflare edge, and hands back the original URL for anything it cannot
 * resize — local `/public` paths, SVG, the r2.dev dev domain. Those are marked
 * unoptimized, or Next warns that the loader ignores `width`. Once the bucket
 * sits behind a custom domain the flag switches itself off and edge resizing
 * takes over — no call-site change.
 */
export function SiteImage({ src, alt, ...props }: ImageProps) {
  const resizable = typeof src === "string" && supportsEdgeResize(src);
  return <Image src={src} alt={alt} unoptimized={!resizable} {...props} />;
}
