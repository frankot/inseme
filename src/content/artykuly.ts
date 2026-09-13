/**
 * Editorial copy around the poradnik. The articles themselves come from the
 * `articles` table (see `src/lib/queries/articles.ts`) — only the framing
 * belongs here, the same way `team.ts` frames the roster.
 */

export type ArticlesTeaserContent = {
  index: string;
  eyebrow: string;
  title: string;
  lead: string;
  linkLabel: string;
  href: string;
};

/** The four newest articles on the homepage, between Pytania and Kontakt. */
export const articlesTeaserDefaults: ArticlesTeaserContent = {
  index: "07",
  eyebrow: "Poradnik",
  title: "To, o co pytają najczęściej — spisane na spokojnie.",
  lead: "Teksty pisane przez nasz zespół i sprawdzone przed publikacją. Bez straszenia i bez obiecywania cudów.",
  linkLabel: "Wszystkie artykuły",
  href: "/artykuly",
};

export type ArticlesPageContent = {
  eyebrow: string;
  title: string;
  lead: string;
  /** Shown when nothing is published yet — an editor sees this, not a blank page. */
  emptyNote: string;
  metaTitle: string;
  metaDescription: string;
  breadcrumbHome: string;
  breadcrumbLabel: string;
  /** Footer of a single article: who checked the text before it went out. */
  reviewerLabel: string;
  relatedTitle: string;
  backLabel: string;
};

export const artykulyPageDefaults: ArticlesPageContent = {
  eyebrow: "Poradnik",
  title: "Co warto wiedzieć, zanim zadzwonisz.",
  lead: "Krótkie teksty o uzależnieniu, leczeniu i o tym, jak rozmawiać z bliską osobą. Każdy sprawdzony przez osobę z zespołu, podpisaną pod tekstem.",
  emptyNote: "Przygotowujemy pierwsze teksty. W międzyczasie zadzwoń — odpowiemy na wszystko przez telefon.",
  metaTitle: "Poradnik — Insieme, ośrodek terapii uzależnień",
  metaDescription:
    "Artykuły o leczeniu uzależnień, detoksie i rozmowie z bliską osobą. Pisane przez zespół ośrodka Insieme w Magdalence.",
  breadcrumbHome: "Strona główna",
  breadcrumbLabel: "Poradnik",
  reviewerLabel: "Treść sprawdził(a)",
  relatedTitle: "Przeczytaj również",
  backLabel: "Wszystkie artykuły",
};

/** One date format for every article surface. */
export function formatArticleDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
