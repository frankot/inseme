/**
 * Prices, in one place.
 *
 * Two price sources live here, and only one of them is real:
 *
 *  - `cennikPageDefaults` (the /cennik page) carries the centre's published
 *    price, taken from the live article „Ile kosztuje odwyk prywatnie”
 *    (/porady/ile-kosztuje-odwyk, as edited in the panel on Nov 11, 2026):
 *    18 000 zł for 4 weeks, ~160 h of therapy (≈112 zł/h), 9 000 zł zadatek,
 *    detox at a partner unit ~4 500 zł / 3 doby, Rodzina PLUS 1 000 zł. The
 *    qualifying psychiatric consultation is 400 zł, counted towards the price
 *    when the patient qualifies, paid as a visit when not (client, Nov 12,
 *    2026; not in the article). How it splits against the zadatek is not
 *    known, so the page never states the remainder as an amount. The
 *    ambulatory programme has no published price, so it reads „wycena
 *    osobno”. When the article's numbers change, change them here too.
 *
 *  - `programPrices` (the homepage „Program i ceny” list) are STILL
 *    PLACEHOLDERS, shaped like a Polish ośrodek's price list but never from the
 *    client, and they disagree with the real offer (detox is not run here).
 *    They stay hidden while `PRICES_ARE_REAL` is false: every row then reads
 *    „wycena w rozmowie” instead of a number nobody approved.
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

/** The cost article /cennik is a short version of. */
export const KOSZT_ARTICLE_SLUG = "ile-kosztuje-odwyk";
export const KOSZT_ARTICLE_HREF = `/porady/${KOSZT_ARTICLE_SLUG}`;

export type CennikExtra = {
  title: string;
  /** Formatted złoty amount. Omit when the cost is set case by case. */
  amount?: string;
  /** Sits under the amount — "za 3 doby". */
  amountUnit?: string;
  /** Shown in place of an amount. */
  noAmount?: string;
  body: string;
};

/**
 * The /cennik page: a short version of the cost article.
 *
 * The price is up front and never alone: the hours it buys and the hourly
 * figure sit right beside it, then the comparison with a private practice and
 * what the team does for that money. Refund and early-leave rules are not
 * repeated here; the payment block points to the article, where they are
 * written out in full.
 */
export const cennikPageDefaults = {
  metaTitle: "Prywatny ośrodek leczenia uzależnień — cennik | Insieme",
  metaDescription:
    "4 tygodnie terapii w Insieme pod Warszawą kosztują 18 000 zł. W cenie ok. 160 godzin terapii, nocleg, wyżywienie i opieka zespołu przez całą dobę.",
  eyebrow: "Cennik",
  breadcrumbHome: "Strona główna",
  breadcrumbLabel: "Cennik",
  title: "Ile kosztuje leczenie i co obejmuje cena.",
  lead: "Podajemy cenę wprost, razem z tym, co obejmuje i co jest płatne osobno. Podstawą jest program stacjonarny trwający 4 tygodnie. Jeśli w trakcie terapii wspólnie uznamy, że potrzebny jest dłuższy pobyt lub inna forma leczenia, wszystkie możliwości i koszty omawiamy wcześniej.",
  freeCall:
    "Pierwsza rozmowa telefoniczna jest bezpłatna i nie zobowiązuje do rozpoczęcia terapii.",
  program: {
    id: "terapia",
    name: "Program stacjonarny",
    length: "4 tygodnie (28 dni)",
    price: "18 000 zł",
    hours: "ok. 160 godzin terapii",
    perHour:
      "Około 112 zł za godzinę, razem z noclegiem, wyżywieniem i opieką zespołu przez całą dobę.",
    includesTitle: "W cenie pobytu",
    includes: [
      "ok. 160 godzin terapii: grupa, psychoedukacja i warsztaty od poniedziałku do soboty, w niedzielę w mniejszym wymiarze",
      "terapeuta prowadzący i co najmniej jedna 50-minutowa sesja indywidualna w tygodniu, a w razie potrzeby sesje interwencyjne",
      "konsultacja kwalifikacyjna u lekarza psychiatry i kolejne, gdy są potrzebne",
      "całodobowa opieka zespołu terapeutycznego",
      "zakwaterowanie przez 4 tygodnie i pełne wyżywienie",
      "konsultacja z terapeutą dla rodziny lub bliskich",
      "zwolnienie lekarskie, zaświadczenie o leczeniu i pisemne podsumowanie terapii z zaleceniami",
      "sauna, siłownia, ogród i leśne otoczenie",
    ],
    roomsNote:
      "Pokoje są najczęściej trzyosobowe i przestronne. To świadomy wybór: wspólne mieszkanie jest częścią terapii i daje uczestnikom wzajemne wsparcie. Dlatego cena wynika z programu, a nie ze standardu pokoju.",
  },
  compareTitle: "Miesiąc w ośrodku a miesiąc terapii w gabinecie",
  compareLead:
    "W prywatnym gabinecie jedna sesja z psychoterapeutą uzależnień kosztuje zwykle 250–300 zł. Przy jednym spotkaniu w tygodniu to około 4 godziny terapii w miesiącu.",
  compare: {
    columns: ["Gabinet, raz w tygodniu", "Insieme, 4 tygodnie"],
    rows: [
      { label: "Godziny terapii", values: ["ok. 4", "ok. 160"] },
      { label: "Koszt miesiąca", values: ["ok. 1–1,2 tys. zł", "18 000 zł"] },
      { label: "Godzina terapii", values: ["250–300 zł", "ok. 112 zł"] },
      { label: "Nocleg i wyżywienie", values: ["—", "w cenie"] },
      { label: "Terapeuci poza sesjami", values: ["—", "przez całą dobę"] },
    ],
  },
  compareNote:
    "To nie znaczy, że terapia w gabinecie jest gorsza. To inna intensywność, dobrana do innej sytuacji, a po pobycie w ośrodku zwykle następny krok.",
  valueTitle: "Za co płacisz",
  valueLead:
    "Część ceny to sam pobyt: miesiąc zakwaterowania z pełnym wyżywieniem. Drugą częścią jest praca zespołu, w dużej mierze niewidoczna dla pacjenta, choć to od niej zależy jakość terapii.",
  value: [
    {
      title: "Zespół przez całą dobę",
      body: "Terapeuci są w ośrodku także poza zajęciami: przy posiłkach, w czasie wolnym i wieczorem. Gdy dzieje się coś trudnego, mogą od razu zareagować, bez czekania na kolejne zajęcia.",
    },
    {
      title: "Terapeuta prowadzący",
      body: "Jedna osoba odpowiada za cały proces pacjenta: zbiera obserwacje zespołu, wyznacza cele, sprawdza postępy i zmienia plan, gdy trzeba. Ta praca trwa także między sesjami.",
    },
    {
      title: "Kwalifikacje i superwizja",
      body: "Terapię prowadzą specjaliści psychoterapii uzależnień i instruktorzy terapii uzależnień z certyfikatem albo w trakcie szkolenia. Zespół regularnie omawia każdego pacjenta, a zewnętrzny superwizor sprawdza, czy terapia idzie we właściwym kierunku.",
    },
    {
      title: "Kameralna grupa",
      body: "W małej grupie każdy pacjent dostaje więcej uwagi. Koszt pracy zespołu rozkłada się wtedy na mniej osób, co widać w cenie.",
    },
  ],
  extrasTitle: "Co jest płatne osobno",
  extras: [
    {
      title: "Detoks, jeśli jest potrzebny",
      amount: "ok. 4 500 zł",
      amountUnit: "za 3 doby",
      body: "Nie prowadzimy go w Insieme. Pomagamy go zorganizować we współpracującej placówce, która ustala jego zakres i koszt.",
    },
    {
      title: "Rodzina PLUS",
      amount: "1 000 zł",
      body: "Rozszerzone wsparcie dla bliskich. Jedna konsultacja z terapeutą dla rodziny jest już w cenie pobytu.",
    },
    {
      title: "Program ambulatoryjny po pobycie",
      noAmount: "wycena osobno",
      body: "Kolejny etap leczenia, zwykle 10–12 miesięcy: cotygodniowa terapia grupowa i co najmniej dwie sesje indywidualne w miesiącu.",
    },
    {
      title: "Przedłużenie pobytu",
      noAmount: "koszt podajemy wcześniej",
      body: "Jeśli przebieg terapii wskaże, że warto zostać dłużej, decydujemy o tym wspólnie z pacjentem.",
    },
    {
      title: "Leki",
      noAmount: "pacjent wykupuje sam",
      body: "Leki zalecone przez psychiatrę i świadczenia medyczne spoza programu.",
    },
  ] satisfies readonly CennikExtra[],
  paymentTitle: "Jak wygląda płatność",
  payments: [
    {
      title: "Konsultacja kwalifikacyjna u psychiatry",
      amount: "400 zł",
      body: "Lekarz ocenia, czy program jest dla pacjenta odpowiedni. Jeśli pacjent zostanie zakwalifikowany, te 400 zł wliczamy w cenę pobytu. Jeśli nie, ponosi tylko koszt tej wizyty.",
    },
    {
      title: "Zadatek",
      amount: "9 000 zł",
      amountUnit: "połowa ceny",
      body: "Rezerwuje termin przyjęcia. Pozostałą kwotę rozliczamy zgodnie z ustaleniami przed rozpoczęciem terapii.",
    },
  ] satisfies readonly CennikExtra[],
  paymentNote:
    "W ośrodku prywatnym szybki termin przyjęcia jest często najważniejszą różnicą wobec kilkutygodniowego czekania na NFZ. Zadatek zabezpiecza ten termin dla konkretnego pacjenta, a gdy terapia się zaczyna, jest po prostu częścią ceny.",
  paymentRules:
    "Zasady zwrotu, także gdy pobyt kończy się wcześniej, przedstawiamy przed rezerwacją.",
  paymentRulesLink: "Opisujemy je też w artykule o kosztach leczenia",
  closingTitle: "Zanim podejmiesz decyzję, poznasz wszystkie koszty.",
  closingBody:
    "W pierwszej rozmowie opowiemy, jak przebiega program, podamy najbliższy wolny termin i powiemy, czy przed przyjęciem potrzebne są dodatkowe kroki, na przykład detoks. Nie potrzebujesz skierowania, a gdy jest wolne miejsce, przyjęcie bywa możliwe nawet następnego dnia.",
  closingCta: "Zapytaj o wolny termin",
  articleEyebrow: "Z poradnika",
  articleBody:
    "Ile kosztuje terapia w innych prywatnych ośrodkach i na NFZ, co zwykle nie jest wliczone w cenę, o co zapytać, zanim wybierzesz ośrodek, i zasady rozliczeń w Insieme.",
  articleLinkLabel: "Przeczytaj cały artykuł",
  articleHref: KOSZT_ARTICLE_HREF,
  nfzText:
    "Leczenie w placówkach z umową z NFZ jest bezpłatne. Czym różni się od prywatnego i jak zacząć, piszemy w artykule",
  nfzLinkLabel: "Odwyk na NFZ",
  nfzHref: NFZ_ARTICLE_HREF,
} as const;
