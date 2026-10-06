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

import { NFZ_ARTICLE_HREF } from "./artykul-nfz";

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
  note: string;
};

/** The homepage teaser — the full table lives on /cennik. */
export const cennikTeaserDefaults: CennikContent = {
  index: "04",
  eyebrow: "Program i ceny",
  title: "Cztery rzeczy, z których składa się pobyt.",
  lead: "Nie każdy przechodzi przez wszystkie. Detoks bywa niepotrzebny, a rodzina czasem dzwoni jako pierwsza — kolejność ustalamy w pierwszej rozmowie.",
  href: "/cennik",
  linkLabel: "Pełny cennik",
  noPriceLabel: "wycena w rozmowie",
  noPriceLead:
    "Kwotę podajemy w pierwszej rozmowie telefonicznej, przed przyjazdem — nie po nim. Rozmowa jest bezpłatna i nie zobowiązuje do przyjazdu.",
  note: "Nie pobieramy opłaty za konsultację telefoniczną i nie wystawiamy faktur za rozmowę, która nie skończyła się przyjazdem.",
};

/** The /cennik page — the client's copy. */
export const cennikPageDefaults = {
  metaTitle: "Prywatny ośrodek leczenia uzależnień — cennik | Insieme",
  metaDescription:
    "Ile kosztuje leczenie w ośrodku Insieme pod Warszawą i co obejmuje cena. Program stacjonarny trwa minimum 28 dni. Pierwsza rozmowa telefoniczna jest bezpłatna.",
  eyebrow: "Cennik",
  breadcrumbHome: "Strona główna",
  breadcrumbLabel: "Cennik",
  title: "Ile kosztuje leczenie i co obejmuje cena.",
  lead: "Koszt leczenia przedstawiamy przed podjęciem decyzji o przyjeździe. Podstawą jest program stacjonarny trwający minimum 28 dni. Jeśli w trakcie terapii wspólnie uznamy, że potrzebny jest dłuższy pobyt lub dalsza forma leczenia, wszystkie możliwości i koszty omawiamy wcześniej.",
  freeCall:
    "Pierwsza rozmowa telefoniczna jest bezpłatna i nie zobowiązuje do rozpoczęcia terapii.",
  program: {
    id: "terapia",
    name: "Program stacjonarny",
    length: "28 dni",
    includesTitle: "W cenie pobytu otrzymujesz",
    includes: [
      "intensywny program terapii grupowej, psychoedukacji i warsztatów",
      "regularne indywidualne sesje z terapeutą",
      "kwalifikację i konsultacje lekarza psychiatry",
      "całodobową opiekę zespołu terapeutycznego",
      "zakwaterowanie przez cały okres leczenia",
      "pełne wyżywienie",
      "wsparcie dla osób najbliższych w trakcie pobytu",
      "przygotowanie indywidualnego planu dalszego zdrowienia",
      "możliwość korzystania z infrastruktury ośrodka: ogrodu, siłowni, sauny i przestrzeni rekreacyjnych",
    ],
  },
  dependsTitle: "Od czego zależy koszt leczenia?",
  depends: [
    {
      title: "Długość pobytu",
      body: "Program stacjonarny trwa minimum 28 dni. Jeśli przebieg terapii wskazuje, że warto przedłużyć leczenie, decyzję podejmujemy wspólnie z pacjentem i wcześniej przedstawiamy koszt dalszego pobytu.",
    },
    {
      title: "Dalsza kontynuacja leczenia",
      body: "Po zakończeniu pobytu można kontynuować terapię w programie ambulatoryjnym. Jest to odrębny etap leczenia, standardowo trwający około 12–13 miesięcy.",
    },
    {
      title: "Dodatkowe wsparcie dla bliskich",
      body: "Podstawowe wsparcie osób najbliższych jest elementem procesu leczenia. Jeśli rodzina potrzebuje dodatkowych indywidualnych konsultacji lub interwencji kryzysowej, zakres i koszt takich spotkań ustalamy oddzielnie.",
    },
    {
      title: "Potrzeba wcześniejszej detoksykacji",
      body: "Detoksykacja nie jest prowadzona w Insieme i nie wchodzi w cenę pobytu. Jeśli przed rozpoczęciem terapii jest potrzebna, możemy pomóc w organizacji leczenia na prywatnym oddziale detoksykacyjnym, z którym współpracujemy.",
    },
  ],
  closingTitle: "Zanim podejmiesz decyzję, poznasz wszystkie koszty.",
  closingBody:
    "Podczas pierwszej rozmowy opowiemy, jak przebiega program terapeutyczny, jaki jest aktualny koszt leczenia i czy w Twojej sytuacji potrzebne są dodatkowe działania przed przyjęciem.",
  closingCta: "Zapytaj o koszt leczenia",
  nfzEyebrow: "Z poradnika",
  nfzTitle: "NFZ czy prywatnie?",
  nfzBody:
    "Leczenie uzależnień w placówkach z umową z NFZ jest bezpłatne. Różnice dotyczą głównie czasu oczekiwania, długości pobytu i wielkości grupy — wyjaśniamy je w osobnym artykule.",
  nfzLinkLabel: "Odwyk na NFZ — jak to wygląda",
  nfzHref: NFZ_ARTICLE_HREF,
} as const;
