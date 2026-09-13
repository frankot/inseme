/**
 * Cloudflare image transformations (`/cdn-cgi/image/…`) are served only on
 * zones the account owns. R2's public dev domain — `pub-<hash>.r2.dev` — is not
 * one, so a resize URL built against it 404s and the image silently fails to
 * load. Anything served from there has to be used at its original size.
 *
 * Connect a custom domain to the bucket and this predicate starts returning
 * true on its own, with no call-site change: see `R2_PUBLIC_URL` in docs/ENV.md.
 */
export function supportsEdgeResize(src: string): boolean {
  if (!src.startsWith("http") || src.endsWith(".svg")) return false;
  try {
    return !new URL(src).hostname.endsWith(".r2.dev");
  } catch {
    return false;
  }
}
