import Image, { type ImageProps } from "next/image";

/**
 * `next/image` with the right setting for whichever source it is handed.
 *
 * The project's custom loader (`src/lib/image-loader.ts`) resizes at the
 * Cloudflare edge and passes local `/public` paths straight through, which
 * makes Next warn that the loader ignores `width`. Local files are therefore
 * marked unoptimized. Once these srcs are R2 URLs from the media library, the
 * flag switches itself off and edge resizing takes over — no call-site change.
 */
export function SiteImage({ src, alt, ...props }: ImageProps) {
  const isRemote = typeof src === "string" && src.startsWith("http");
  return <Image src={src} alt={alt} unoptimized={!isRemote} {...props} />;
}
