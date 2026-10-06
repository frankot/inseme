import Image, { type ImageProps } from "next/image";

import { supportsEdgeResize } from "@/lib/image-host";
import { hasVariants } from "@/lib/image-variants";

/**
 * `next/image` with the right setting for whichever source it is handed.
 *
 * The project's custom loader (`src/lib/image-loader.ts`) serves a photo's
 * pre-made copies (`image-variants.ts`) or resizes at the Cloudflare edge, and
 * hands back the original URL for anything else — SVG, the gallery's sized
 * WebPs. Those are marked unoptimized, or Next warns that the loader ignores
 * `width`.
 */
export function SiteImage({ src, alt, ...props }: ImageProps) {
  const resizable = typeof src === "string" && (hasVariants(src) || supportsEdgeResize(src));
  return <Image src={src} alt={alt} unoptimized={!resizable} {...props} />;
}
