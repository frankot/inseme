/**
 * The FAQ categories — a fixed list, stored as the `faq_category` enum. A
 * category does two things: groups the questions in the admin, and — for the
 * topic ones — puts a question into the FAQ section of its page.
 *
 *   ogolne     general: admission, stay, costs — /faq and the homepage only
 *   alkohol    /leczenie-alkoholizmu
 *   narkotyki  /leczenie-narkomanii
 *   rodzina    /dla-rodziny
 *   detoks     /detoks-i-kwalifikacja
 *   nfz        the article „Odwyk na NFZ”
 *
 * Plain data, no imports: read by the DB schema (drizzle-kit), the admin forms
 * in the browser and the site alike. Adding one means adding it here and
 * generating a migration (`npm run db:generate`).
 */
export const FAQ_CATEGORY_VALUES = [
  "ogolne",
  "alkohol",
  "narkotyki",
  "rodzina",
  "detoks",
  "nfz",
] as const;

export type FaqCategory = (typeof FAQ_CATEGORY_VALUES)[number];

export const FAQ_CATEGORIES: { value: FaqCategory; label: string; where: string }[] = [
  { value: "ogolne", label: "Ogólne", where: "tylko /faq i strona główna" },
  { value: "alkohol", label: "Alkohol", where: "także na stronie Leczenie alkoholizmu" },
  { value: "narkotyki", label: "Narkotyki", where: "także na stronie Leczenie narkomanii" },
  { value: "rodzina", label: "Rodzina", where: "także na stronie Dla rodziny" },
  { value: "detoks", label: "Detoks", where: "także na stronie Detoks i kwalifikacja" },
  { value: "nfz", label: "NFZ", where: "także w artykule o odwyku na NFZ" },
];

export function isFaqCategory(value: unknown): value is FaqCategory {
  return typeof value === "string" && (FAQ_CATEGORY_VALUES as readonly string[]).includes(value);
}

export function faqCategoryLabel(value: string | null | undefined): string {
  return FAQ_CATEGORIES.find((category) => category.value === value)?.label ?? "—";
}
