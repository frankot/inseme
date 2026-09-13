/**
 * Prices, in one place.
 *
 * ⚠️ THE NUMBERS BELOW ARE PLACEHOLDERS. They are shaped like a real Polish
 * ośrodek's price list so the page can be built and reviewed, but none of them
 * came from the client. Before launch: replace every `priceFrom`, check
 * `includes`, and set `PRICES_ARE_REAL` to true.
 *
 * The whole page degrades on purpose. Set `PRICES_ARE_REAL` to false — or drop
 * `priceFrom` from an entry — and the price simply stops being rendered: the
 * cards, the table and the section all fall back to "wycena w rozmowie" rather
 * than printing a number nobody approved. So a half-filled price list is safe
 * to ship; a wrong one is not.
 */

/** Flip to true once the client's real price list is in. */
export const PRICES_ARE_REAL = false;

export type ProgramPrice = {
  /** Matches `ProgramCard.id` in `content/home.ts`. */
  id: string;
  name: string;
  /** Length of stay, or what the price is per. */
  unit: string;
  /** Formatted złoty amount, e.g. "6 900 zł". Omit when there is no fixed price. */
  priceFrom?: string;
  /** Sits under the amount — "za dobę", "za cały program". */
  priceUnit?: string;
  note?: string;
  includes: string[];
};

export const programPrices: ProgramPrice[] = [
  {
    id: "detoks",
    name: "Detoks",
    unit: "7–10 dni",
    priceFrom: "6 900 zł",
    priceUnit: "za program",
    note: "Cena zależy od długości detoksu i zastosowanych leków.",
    includes: [
      "Opieka lekarska i całodobowy dyżur pielęgniarski",
      "Leki i kroplówki w trakcie detoksu",
      "Pokój dwuosobowy i pełne wyżywienie",
      "Konsultacja psychiatryczna",
    ],
  },
  {
    id: "terapia",
    name: "Terapia 28 dni",
    unit: "28 dni",
    priceFrom: "14 900 zł",
    priceUnit: "za program",
    note: "Pobyt można skrócić albo wydłużyć — rozliczamy wtedy proporcjonalnie.",
    includes: [
      "Program terapeutyczny: grupa, sesje indywidualne, psychoedukacja",
      "Ten sam terapeuta prowadzący przez cały pobyt",
      "Pokój dwu- lub trzyosobowy i pełne wyżywienie",
      "Konsultacje psychiatryczne w trakcie pobytu",
    ],
  },
  {
    id: "rodzina",
    name: "Konsultacja dla rodziny",
    unit: "bez pacjenta",
    priceFrom: "bezpłatnie",
    priceUnit: "pierwsza rozmowa",
    note: "Pierwsza rozmowa telefoniczna jest bezpłatna i nie zobowiązuje do niczego.",
    includes: [
      "Rozmowa z terapeutą uzależnień",
      "Jak rozmawiać z osobą, która nie chce leczenia",
      "Co robić, a czego nie robić w domu",
      "Kontakt także wtedy, gdy bliska osoba jeszcze nie jest gotowa",
    ],
  },
  {
    id: "po-pobycie",
    name: "Po pobycie",
    unit: "bezterminowo",
    priceFrom: "bezpłatnie",
    priceUnit: "dla naszych pacjentów",
    note: "Grupa wsparcia i kontakt z terapeutą po wyjeździe są wliczone w pobyt.",
    includes: [
      "Grupa wsparcia raz w tygodniu",
      "Kontakt z terapeutą prowadzącym",
      "Konsultacja przy nawrocie",
    ],
  },
];

/** The price for a program card, or null when there is nothing approved to show. */
export function priceFor(id: string): ProgramPrice | null {
  if (!PRICES_ARE_REAL) return null;
  const entry = programPrices.find((item) => item.id === id);
  return entry?.priceFrom ? entry : null;
}

export type CennikContent = {
  index: string;
  eyebrow: string;
  title: string;
  lead: string;
  href: string;
  linkLabel: string;
  /** Shown in place of an amount whenever there is no approved price. */
  noPriceLabel: string;
  /** The honest line when the whole list is still unpublished. */
  noPriceLead: string;
  includesTitle: string;
  dependsTitle: string;
  depends: { title: string; body: string }[];
  note: string;
};

/** The homepage teaser — the full table lives on /cennik. */
export const cennikTeaserDefaults: CennikContent = {
  index: "05",
  eyebrow: "Program i ceny",
  title: "Cztery rzeczy, z których składa się pobyt.",
  lead: "Nie każdy przechodzi przez wszystkie. Detoks bywa niepotrzebny, a rodzina czasem dzwoni jako pierwsza — kolejność ustalamy w pierwszej rozmowie.",
  href: "/cennik",
  linkLabel: "Pełny cennik",
  noPriceLabel: "wycena w rozmowie",
  noPriceLead:
    "Kwotę podajemy w pierwszej rozmowie telefonicznej, przed przyjazdem — nie po nim. Rozmowa jest bezpłatna i nie zobowiązuje do przyjazdu.",
  includesTitle: "Co obejmuje cena",
  dependsTitle: "Od czego zależy cena",
  depends: [
    {
      title: "Długość pobytu",
      body: "Sam detoks trwa 7–10 dni, pełny program 28. Pobyt można skrócić albo wydłużyć — rozliczamy wtedy proporcjonalnie.",
    },
    {
      title: "Czy potrzebny jest detoks",
      body: "Nie każdy go potrzebuje. Decyduje lekarz po rozmowie, nie my przez telefon.",
    },
    {
      title: "Standard pokoju",
      body: "Pokoje dwu- i trzyosobowe. Jednoosobowy bywa wolny — dopłata jest stała i podajemy ją przed przyjazdem.",
    },
  ],
  note: "Nie pobieramy opłaty za konsultację telefoniczną i nie wystawiamy faktur za rozmowę, która nie skończyła się przyjazdem.",
};

/** The /cennik page. */
export const cennikPageDefaults = {
  metaTitle: "Cennik — prywatny ośrodek leczenia uzależnień Insieme, Magdalenka",
  metaDescription:
    "Ile kosztuje detoks i terapia stacjonarna w ośrodku Insieme pod Warszawą. Co obejmuje cena i od czego zależy. Konsultacja telefoniczna bezpłatna.",
  eyebrow: "Cennik",
  breadcrumbHome: "Strona główna",
  breadcrumbLabel: "Cennik",
  title: "Ile kosztuje pobyt i co jest w tej cenie.",
  lead: "Podajemy widełki, żeby nie trzeba było dzwonić po to jedno pytanie. Dokładną kwotę ustalamy w pierwszej rozmowie — przed przyjazdem, nie po nim.",
  tableHeadProgram: "Program",
  tableHeadLength: "Długość",
  tableHeadPrice: "Cena od",
} as const;
