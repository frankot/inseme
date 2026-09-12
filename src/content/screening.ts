/**
 * Which published test the homepage shows. The section reads this slug, so
 * swapping the featured questionnaire is a one-line change here rather than a
 * component edit — and if no test with this slug is published, the section
 * removes itself.
 */
export const FEATURED_TEST_SLUG = "test-przesiewowy-alkohol";

export const testyPageDefaults = {
  eyebrow: "Testy przesiewowe",
  title: "Pytania, które można zadać sobie bez świadków.",
  lead: "Krótkie samooceny, po dwie minuty każda. Odpowiedzi nie zapisujemy — zapisujemy tylko wynik, i tylko jeśli poprosisz o przesłanie go na e-mail.",
  emptyNote: "Przygotowujemy testy. W międzyczasie po prostu zadzwoń — rozmowa nie zobowiązuje.",
  metaTitle: "Testy przesiewowe — Insieme, ośrodek terapii uzależnień",
  metaDescription:
    "Krótkie, anonimowe testy przesiewowe: alkohol, substancje, hazard. Wynik od razu na ekranie, bez zapisywania odpowiedzi.",
  breadcrumbHome: "Strona główna",
  breadcrumbTesty: "Testy",
  notFoundTitle: "Nie ma takiego testu.",
  notFoundBody: "Ten adres nie wskazuje na żaden opublikowany test.",
  backLabel: "Wróć do testów",
} as const;
