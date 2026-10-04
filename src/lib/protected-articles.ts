import { NFZ_ARTICLE_SLUG } from "@/content/artykul-nfz";

/**
 * Articles other pages link to by a fixed URL — /cennik, the footer and the
 * intent pages all point at the NFZ article. They can be edited, but not
 * deleted, renamed (slug) or taken offline, or those links would 404.
 *
 * Enforced in the article actions; the admin UI only hides the controls.
 */
const PROTECTED_ARTICLE_SLUGS: ReadonlySet<string> = new Set([NFZ_ARTICLE_SLUG]);

export function isProtectedArticle(slug: string | null | undefined): boolean {
  return Boolean(slug && PROTECTED_ARTICLE_SLUGS.has(slug));
}

export const PROTECTED_ARTICLE_NOTE =
  "Stały artykuł — inne strony linkują do niego pod tym adresem. Można go edytować, ale nie usunąć, zmienić adresu ani cofnąć publikacji.";
