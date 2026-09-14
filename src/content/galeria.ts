/**
 * Editorial copy around the gallery. The photographs themselves come from the
 * `gallery_photos` table (see `src/lib/queries/gallery.ts`) — only the framing
 * belongs here, the same way `artykuly.ts` frames the poradnik.
 */

export type GalleriaPageContent = {
  eyebrow: string;
  title: string;
  lead: string;
  /** Shown when nothing is published yet — an editor sees this, not a blank grid. */
  emptyNote: string;
  metaTitle: string;
  metaDescription: string;
  breadcrumbHome: string;
  breadcrumbLabel: string;
  /** Screen-reader labels for the lightbox. */
  lightbox: {
    label: string;
    previous: string;
    next: string;
    close: string;
    /** `1 z 48` — built with `positionLabel`. */
    position: (index: number, total: number) => string;
  };
  pagination: {
    label: string;
    previous: string;
    next: string;
    page: (page: number) => string;
    summary: (page: number, pageCount: number) => string;
  };
};

export const galeriaPageDefaults: GalleriaPageContent = {
  eyebrow: "Galeria",
  title: "Zobacz, dokąd przyjeżdżasz.",
  lead: "Zdjęcia robione u nas, bez aranżacji i bez zdjęć z banku. Dom, pokoje, salon terapeutyczny, ogród i las, który zaczyna się za płotem.",
  emptyNote:
    "Przygotowujemy galerię. W międzyczasie zadzwoń — chętnie opowiemy o ośrodku i umówimy wizytę.",
  metaTitle: "Galeria — ośrodek Insieme w Magdalence",
  metaDescription:
    "Zdjęcia ośrodka terapii uzależnień Insieme pod Warszawą: pokoje, salon terapeutyczny, ogród i las. Zobacz, jak wygląda miejsce, zanim przyjedziesz.",
  breadcrumbHome: "Strona główna",
  breadcrumbLabel: "Galeria",
  lightbox: {
    label: "Powiększone zdjęcie",
    previous: "Poprzednie zdjęcie",
    next: "Następne zdjęcie",
    close: "Zamknij",
    position: (index, total) => `${index + 1} z ${total}`,
  },
  pagination: {
    label: "Strony galerii",
    previous: "Poprzednia",
    next: "Następna",
    page: (page) => `Strona ${page}`,
    summary: (page, pageCount) => `Strona ${page} z ${pageCount}`,
  },
};

/** The band on /osrodek that links here. */
export const galeriaTeaserDefaults = {
  title: "Galeria",
  lead: "Pokoje, salon, ogród i las za płotem.",
  linkLabel: "Zobacz całą galerię",
  href: "/galeria",
  /** How many photos the teaser shows before handing off to /galeria. */
  limit: 6,
  emptyNote: "Zdjęcia ośrodka pojawią się tutaj wkrótce.",
};
