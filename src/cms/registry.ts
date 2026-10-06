import { slotsOf, type PageDef, type RefKind, type RefSlot } from "./define";
import {
  detoksIKwalifikacjaPage,
  dlaRodzinyPage,
  leczenieAlkoholizmuPage,
  leczenieNarkomaniiPage,
} from "./pages/intent";
import { landingPage } from "./pages/landing";
import { osrodekPage } from "./pages/osrodek";
import { programPage } from "./pages/program";

/**
 * Every CMS page, in the order the admin lists them. Adding a page is one line
 * here: the admin nav, the editor route, the preview and the seed script all
 * read this list.
 */
export const cmsPageList: PageDef[] = [
  landingPage,
  programPage,
  osrodekPage,
  leczenieAlkoholizmuPage,
  leczenieNarkomaniiPage,
  dlaRodzinyPage,
  detoksIKwalifikacjaPage,
];

export function getPageDef(key: string): PageDef | undefined {
  return cmsPageList.find((page) => page.key === key);
}

export function getPageDefBySlug(slug: string): PageDef | undefined {
  return cmsPageList.find((page) => page.adminSlug === slug);
}

/** Every place an entity can be featured, across all pages. */
export const refSlots: RefSlot[] = cmsPageList.flatMap(slotsOf);

export function slotsForKind(kind: RefKind): RefSlot[] {
  return refSlots.filter((slot) => slot.spec.ref === kind);
}
