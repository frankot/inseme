/**
 * Every string the homepage renders, as typed content objects with the copy
 * from the approved design (wariant 5) as defaults.
 *
 * Sections are pure functions of these props: `page.tsx` spreads the defaults
 * today and will spread rows from the CMS later, without the section
 * components changing. Shapes that already have a table — contact details,
 * FAQ — mirror `settings` and `faq_items` so wiring them is a straight swap.
 */

import type { NavItem } from "./nav";

/* ------------------------------------------------------------------ shared */

export type SiteContact = {
  phone: string;
  /** E.164-ish form for `tel:` hrefs. */
  phoneHref: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  hours: string;
};

/** Mirrors the `settings` singleton. */
export const contactDefaults: SiteContact = {
  phone: "669 916 005",
  phoneHref: "+48669916005",
  email: "kontakt@osrodek-insieme.pl",
  addressLine1: "ul. Świerkowa 13",
  addressLine2: "05-506 Magdalenka",
  /**
   * Empty until the client confirms real phone hours — every place that shows
   * it renders nothing rather than promising availability nobody has agreed to.
   * Editors fill it in under Ustawienia.
   */
  hours: "",
};

/** Nav links themselves live in `content/nav.ts`. */
export type { NavItem };

/* -------------------------------------------------------------------- hero */

export type HeroContent = {
  eyebrow: string;
  title: string;
  lead: string;
  ctaLabel: string;
  /** Short reassurances under the hero CTA. Empty array renders nothing. */
  trust: string[];
  /** Registry number rendered below the main title. */
  rpwdl: { statement?: string; label: string; number: string };
  image: { src: string; alt: string };
};

export const heroDefaults: HeroContent = {
  eyebrow: "Magdalenka pod Warszawą · prywatny ośrodek terapii uzależnień",
  title: "Dobrze, że jesteś. Porozmawiajmy o tym jak możemy Ci pomóc.",
  lead: "Pierwsza rozmowa służy temu, żeby ustalić, co się dzieje i jaka forma pomocy będzie odpowiednia. Nie wymaga żadnego przygotowania — nie musisz mieć diagnozy ani wiedzieć, od czego zacząć. Sam kontakt z nami nie zobowiązuje do rozpoczęcia terapii.",
  ctaLabel: "Zadzwoń: 669 916 005",
  trust: [
    "możliwość przyjęcia w krótkim terminie",
    "kwalifikacja do leczenia przez lekarza psychiatrę",
    "28 dni intensywnej terapii stacjonarnej + program ambulatoryjny",
    "dyskrecja i poufność",
  ],
  rpwdl: {
    statement: "Jesteśmy podmiotem leczniczym wpisanym do RPWDL.",
    label: "Numer w RPWDL",
    number: "000000234596",
  },
  image: {
    src: "/placeholder/dom-staw.webp",
    alt: "Dom ośrodka Insieme w Magdalence, widziany zza stawu wśród sosen",
  },
};

/* ----------------------------------------------------------------- ośrodek */

export type Stat = { label: string; value: string };
export type Figure = { src: string; alt: string; caption: string };

export type OsrodekContent = {
  index: string;
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  linkLabel: string;
  stats: Stat[];
  figures: Figure[];
};

export const osrodekDefaults: OsrodekContent = {
  index: "03",
  eyebrow: "Ośrodek",
  title: "Kameralny dom w sosnowym lesie, dwadzieścia minut od Warszawy.",
  body: "Insieme to ośrodek dla maksymalnie 12 osób — przestrzeń, w której możesz w pełni skupić się na sobie i na terapii. Pokoje z prywatnymi łazienkami i widokiem na las, wspólny salon, taras i ogród, a w czasie wolnym sauna i siłownia.",
  href: "/osrodek",
  linkLabel: "Zobacz ośrodek i dojazd",
  stats: [
    { label: "Program stacjonarny", value: "28 dni" },
    { label: "Miejsc", value: "12" },
    { label: "Opieka terapeutyczna", value: "24/7" },
    { label: "Od Warszawy/lotniska", value: "20 min" },
  ],
  figures: [
    {
      src: "/placeholder/dom-taras.webp",
      alt: "Taras ośrodka i porośnięta bluszczem elewacja domu",
      caption: "Taras od strony ogrodu — tu pije się kawę między zajęciami.",
    },
    {
      src: "/placeholder/pokoj.webp",
      alt: "Jasny pokój z widokiem na las",
      caption: "Pokoje dwu- i trzyosobowe, okna na sosny.",
    },
    {
      src: "/placeholder/salon-terapeutyczny.webp",
      alt: "Salon terapeutyczny z fotelami i widokiem na las",
      caption: "Salon — tu odbywają się grupy.",
    },
    {
      src: "/placeholder/rozmowa.webp",
      alt: "Rozmowa indywidualna z terapeutą",
      caption: "Sesje indywidualne.",
    },
  ],
};

/* -------------------------------------------------------- pierwszy kontakt */

export type Step = { index: string; title: string; body: string };
export type PathPoint = { title: string; body: string };

export type ContactPathId = "self" | "family";

export type ContactPath = {
  id: ContactPathId;
  /** Label on the quiet switch. */
  tabLabel: string;
  /** The self-identification card: "To o mnie". */
  cardTitle: string;
  cardBody: string;
  /** Bottom line of the card, in each of its two states. */
  chooseLabel: string;
  selectedLabel: string;
  /** Heading and lead of the section, once this path is chosen. */
  title: string;
  lead: string;
  /** The three promises, directly under the cards. */
  points: PathPoint[];
  steps: Step[];
  note: string;
  ctaLabel: string;
  secondaryLabel: string;
  secondaryHref: string;
};

export type PierwszyKontaktContent = {
  index: string;
  eyebrow: string;
  paths: ContactPath[];
};

export const pierwszyKontaktDefaults: PierwszyKontaktContent = {
  index: "01",
  eyebrow: "Pierwszy kontakt",
  paths: [
    {
      id: "self",
      tabLabel: "Dla siebie",
      cardTitle: "Potrzebuję pomocy dla siebie",
      cardBody:
        "Widzę, że alkohol, inne substancje albo nałogowe zachowania zaczynają przejmować kontrolę nad moim życiem. Chcę coś zmienić, ale nie wiem jeszcze, od czego zacząć.",
      chooseLabel: "Sprawdź, jak możemy pomóc →",
      selectedLabel: "Czytasz tę ścieżkę",
      title: "Co się dzieje, jak podniesiesz słuchawkę.",
      lead: "Pierwsza rozmowa służy temu, żeby poznać Twoją sytuację i ustalić, co możemy zrobić dalej. Nie musisz mieć diagnozy ani podjętej decyzji o leczeniu.",
      points: [
        {
          title: "Bez przygotowania",
          body: "Nie potrzebujesz dokumentów ani gotowych odpowiedzi. Wystarczy, że opowiesz, co się dzieje.",
        },
        {
          title: "Konkretnie",
          body: "Wyjaśnimy, jak wygląda kwalifikacja, terapia, możliwy termin przyjęcia i koszt leczenia.",
        },
        {
          title: "Bez zobowiązań",
          body: "Rozmowa nie zobowiązuje Cię do rozpoczęcia terapii ani przyjazdu do ośrodka.",
        },
      ],
      steps: [
        {
          index: "01",
          title: "Telefon",
          body: "Nie musisz wiedzieć, od czego zacząć ani co dokładnie powiedzieć. Wystarczy, że powiesz, że szukasz pomocy — krok po kroku poprowadzimy Cię przez dalszą rozmowę.",
        },
        {
          index: "02",
          title: "Zapytamy o Twoją sytuację",
          body: "Porozmawiamy o tym, jak się czujesz, co się dzieje, czego używasz i kiedy ostatnio. Zapytamy też o przyjmowane leki oraz wcześniejsze próby leczenia.",
        },
        {
          index: "03",
          title: "Przedstawimy dalsze kroki",
          body: "Wyjaśnimy, jak wygląda kwalifikacja, program terapii, możliwy termin przyjęcia i koszt leczenia.",
        },
        {
          index: "04",
          title: "Jeśli zdecydujesz się na podjęcie terapii",
          body: "Po rozmowie ustalamy termin rozpoczęcia leczenia i wyjaśnimy, jak przygotować się do pobytu.",
        },
      ],
      note: "Nie musisz podejmować decyzji od razu.",
      ctaLabel: "Zadzwoń teraz",
      secondaryLabel: "Najpierw wypełnij test",
      secondaryHref: "#test",
    },
    {
      id: "family",
      tabLabel: "Dla bliskiej osoby",
      cardTitle: "Szukam pomocy dla bliskiej osoby",
      cardBody:
        "Martwię się o kogoś bliskiego i nie wiem, jak z nim rozmawiać, jak reagować ani co zrobić, jeśli nie chce podjąć leczenia.",
      chooseLabel: "Sprawdź, co możesz zrobić →",
      selectedLabel: "Czytasz tę ścieżkę",
      title: "Co się dzieje, jak podniesiesz słuchawkę.",
      lead: "Pierwsza rozmowa pomaga uporządkować sytuację i ustalić, co można zrobić dalej. Możesz zadzwonić zarówno wtedy, gdy dopiero szukasz sposobu, jak pomóc, jak i wtedy, gdy decyzja o leczeniu została już podjęta.",
      points: [
        {
          title: "Nie musisz czekać na decyzję bliskiej osoby",
          body: "Możesz porozmawiać z nami, jeszcze zanim ta osoba będzie gotowa na leczenie.",
        },
        {
          title: "Ustalimy kolejne kroki",
          body: "Wyjaśnimy możliwości pomocy, zasady przyjęcia, terminy i koszt leczenia.",
        },
        {
          title: "Podpowiemy, jak działać",
          body: "Jeśli bliska osoba nie chce podjąć leczenia, omówimy, jak z nią rozmawiać i jakie działania możesz podjąć.",
        },
      ],
      steps: [
        {
          index: "01",
          title: "Telefon",
          body: "Nie musisz wiedzieć, od czego zacząć. Wystarczy, że opowiesz nam, co dzieje się z bliską Ci osobą i co najbardziej Cię niepokoi — krok po kroku poprowadzimy Cię przez dalszą rozmowę.",
        },
        {
          index: "02",
          title: "Zapytamy o sytuację",
          body: "Porozmawiamy o tym, jak długo trwa problem, co dzieje się teraz i czy wcześniej były podejmowane próby leczenia. Zapytamy też, jak Ty radzisz sobie z tą sytuacją i ustalimy, jak możemy Cię wesprzeć.",
        },
        {
          index: "03",
          title: "Podpowiemy, co możesz zrobić",
          body: "Wyjaśnimy, jak rozmawiać z bliską osobą o leczeniu i co możesz zrobić, jeśli nie dostrzega problemu lub nie chce podjąć terapii.",
        },
        {
          index: "04",
          title: "Jeśli decyzja o leczeniu już zapadła",
          body: "Za zgodą osoby podejmującej terapię możesz pomóc w organizacji przyjęcia. Wyjaśnimy, jak wygląda kwalifikacja, jakie są dostępne terminy i koszty oraz jak przygotować się do pobytu.",
        },
      ],
      note: "",
      ctaLabel: "Zadzwoń teraz",
      secondaryLabel: "Zobacz wsparcie dla rodziny",
      secondaryHref: "/program#rodzina",
    },
  ],
};

/* ----------------------------------------------------------------- program */

export type ProgramCard = {
  /** Keys the card to its entry in `content/cennik.ts`. */
  id: string;
  index: string;
  meta: string;
  title: string;
  body: string;
  linkLabel: string;
  href: string;
};

export type ProgramContent = {
  index: string;
  eyebrow: string;
  title: string;
  lead: string;
  note: string;
  cards: ProgramCard[];
};

export const programDefaults: ProgramContent = {
  index: "04",
  eyebrow: "Program",
  title: "Cztery rzeczy, z których składa się pobyt.",
  lead: "Nie każdy przechodzi przez wszystkie. Detoks bywa niepotrzebny, a rodzina czasem dzwoni jako pierwsza — kolejność ustalamy w pierwszej rozmowie.",
  note: "Każdy pobyt ustalamy przez telefon, przed przyjazdem.",
  cards: [
    {
      id: "detoks",
      index: "01",
      meta: "7–10 dni",
      title: "Detoks",
      body: "Pod opieką lekarza. Przyjmujemy zwykle tego samego dnia.",
      linkLabel: "Zapytaj o miejsce",
      href: "/#kontakt",
    },
    {
      id: "terapia",
      index: "02",
      meta: "28 dni",
      title: "Terapia 28 dni",
      body: "Grupa, rozmowy indywidualne, psychoedukacja. Można skrócić albo wydłużyć.",
      linkLabel: "Zobacz plan dnia",
      href: "/program#dzien",
    },
    {
      id: "rodzina",
      index: "03",
      meta: "bez pacjenta",
      title: "Dla rodziny",
      body: "Możesz zadzwonić bez wiedzy bliskiej osoby — i bez jej zgody.",
      linkLabel: "Porozmawiaj z terapeutą",
      href: "tel:+48669916005",
    },
    {
      id: "po-pobycie",
      index: "04",
      meta: "bezterminowo",
      title: "Po pobycie",
      body: "Grupa wsparcia raz w tygodniu i kontakt z terapeutą prowadzącym.",
      linkLabel: "Napisz do nas",
      href: "/#kontakt",
    },
  ],
};

/* ------------------------------------------------------------- jeden dzień */

export type DayEntry = {
  time: string;
  title: string;
  /** Second line: what actually fills that block. Short rows go without. */
  detail?: string;
};

export type JedenDzienContent = {
  /** Label over the day plan — a band of /program, so no numeral. */
  eyebrow: string;
  title: string;
  lead: string;
  /** The paragraphs under the lead — why the day has a fixed shape. */
  body: string[];
  /** Sits over the right-hand column, opposite the word "Godzina". */
  scheduleLabel: string;
  /** Footnote under the intro — what the timetable does not cover. */
  note: string;
  entries: DayEntry[];
};

export const jedenDzienDefaults: JedenDzienContent = {
  eyebrow: "Jeden zwykły dzień",
  title: "Wiesz, jak wygląda każdy dzień.",
  lead: "Początek pobytu oznacza wiele nowych rzeczy naraz. Dlatego dzień w Insieme ma stały, przewidywalny rytm — od pobudki, przez terapię i wspólne posiłki, po czas na odpoczynek.",
  body: [
    "Ta struktura pomaga odzyskać regularność, poczucie bezpieczeństwa i zdrowe nawyki. Jest też częścią terapii — uczymy się równowagi między pracą nad sobą, odpowiedzialnością, relacjami, aktywnością i odpoczynkiem.",
  ],
  scheduleLabel: "Plan dnia · poniedziałek–sobota",
  note: "W niedzielę rytm dnia jest spokojniejszy — rano spotykamy się na bloku terapii grupowej, po południu jest czas na odwiedziny osób najbliższych albo relaks i regenerację.",
  entries: [
    { time: "6:45", title: "Pobudka" },
    {
      time: "7:00",
      title: "Aktywacja",
      detail: "Wspólna aktywność fizyczna na dobry początek dnia.",
    },
    { time: "8:00", title: "Śniadanie" },
    {
      time: "9:00–12:00",
      title: "Poranny blok terapeutyczny",
      detail:
        "Medytacja, omówienie funkcji, dzienniki emocji i głodu, prace terapeutyczne oraz informacja zwrotna.",
    },
    {
      time: "12:00–13:30",
      title: "Przerwa",
      detail:
        "Czas na indywidualne sesje z terapeutą, zadania terapeutyczne, spacer, rozmowę lub pobycie samemu ze sobą czy odpoczynek.",
    },
    { time: "13:30", title: "Obiad" },
    {
      time: "15:00–18:00",
      title: "Popołudniowy blok terapeutyczny",
      detail: "Psychoedukacja, warsztaty, ćwiczenia, praca grupowa.",
    },
    {
      time: "18:00–19:00",
      title: "Przerwa",
      detail: "Czas własny i odpoczynek.",
    },
    { time: "19:00", title: "Kolacja" },
    {
      time: "Wieczór",
      title: "Czas własny",
      detail: "Prace terapeutyczne, rozmowy, rekreacja, siłownia, sauna i odpoczynek.",
    },
    { time: "23:00", title: "Cisza nocna" },
  ],
};

/* -------------------------------------------------------- test przesiewowy */

/**
 * Chrome around the test player — button captions, the consent sentence, the
 * labels on the result. The questionnaire itself is CMS content and comes from
 * `getScreeningTestBySlug`; `title`, `lead` and `disclaimer` here are only the
 * fallbacks for a test whose own fields are empty.
 *
 * This used to carry a full copy of the questions, options and score bands.
 * They were a second, drifting source of truth against the database — and once
 * the featured test became AUDIT they were simply wrong. Deleted.
 */
export type TestContent = {
  index: string;
  eyebrow: string;
  title: string;
  lead: string;
  disclaimer: string;
  prompt: string;
  startLabel: string;
  resultLabel: string;
  emailNote: string;
  emailPlaceholder: string;
  sendLabel: string;
  consentLabel: string;
  sentMessage: string;
  callLabel: string;
  restartLabel: string;
};

export const testDefaults: TestContent = {
  index: "02",
  eyebrow: "Test przesiewowy",
  title: "Dziesięć pytań, które można zadać sobie bez świadków.",
  lead: "AUDIT — test przesiewowy Światowej Organizacji Zdrowia, w polskiej wersji opracowanej przez PARPA. Ten sam, którego używają poradnie. Odpowiedzi nie zapisujemy i nie wysyłamy nikomu.",
  disclaimer:
    "AUDIT jest testem przesiewowym i nie jest diagnozą. Wskazuje prawdopodobieństwo problemu, a nie jego pewność — nie zastępuje rozmowy z terapeutą ani badania lekarskiego.",
  prompt:
    "Pytania dotyczą ostatnich dwunastu miesięcy. Jedna porcja standardowa to 10 g czystego alkoholu — ok. 250 ml piwa 5%, 100 ml wina 12% albo 30 ml wódki 40%.",
  startLabel: "Zacznij test",
  resultLabel: "Wynik orientacyjny",
  emailNote: "Wyślemy wynik w PDF — bez nazwiska, bez dalszych wiadomości.",
  emailPlaceholder: "twój@email.pl",
  sendLabel: "Wyślij wynik",
  consentLabel:
    "Zgadzam się na jednorazowe przesłanie wyniku na podany adres. Adresu nie używamy do niczego innego.",
  sentMessage:
    "Wynik jest w drodze. Jeśli chcesz o nim porozmawiać — 669 916 005.",
  callLabel: "Porozmawiaj z terapeutą",
  restartLabel: "Wypełnij ponownie",
};

/* --------------------------------------------------------------------- faq */

/**
 * Section copy only — the questions themselves live in `faq_items` and are read
 * by `getPublishedFaq()`. They used to sit here as defaults; they are editable
 * content, and two copies of them would drift.
 */
export type FaqContent = {
  index: string;
  eyebrow: string;
  title: string;
  note: string;
  href: string;
  linkLabel: string;
};

export const faqDefaults: FaqContent = {
  index: "07",
  eyebrow: "Pytania",
  title: "Pytania, które często pojawiają się na początku",
  note: "Możesz zapytać nas o wszystko, każde pytanie jest ważne. Jeśli nie znajdujesz tu swojego pytania — po prostu zadzwoń.",
  href: "/faq",
  linkLabel: "Wszystkie pytania",
};

/* ----------------------------------------------------------------- kontakt */

export type KontaktContent = {
  index: string;
  eyebrow: string;
  title: string;
  privacyNote: string;
  formTitle: string;
  formNote: string;
  travel: Stat[];
  travelNote: string;
  mapsLabel: string;
  mapsHref: string;
  /** Świerkowa 13 — geocoded, exact house-number match. */
  map: { lat: number; lon: number; embedSrc: string; title: string };
};

export const kontaktDefaults: KontaktContent = {
  index: "08",
  eyebrow: "Kontakt",
  title: "Zadzwoń dziś, przyjedź kiedy będziesz gotowy.",
  privacyNote:
    "Do rozmowy nie potrzebujemy nazwiska. Nie wysyłamy po niej ofert i nie dzwonimy drugi raz bez Twojej zgody.",
  formTitle: "Napisz, jeśli nie chcesz dzwonić.",
  formNote:
    "Nie musisz podawać nazwiska ani opisywać wszystkiego. Wystarczy zdanie o tym, co się dzieje, i sposób kontaktu.",
  travel: [
    { label: "Z centrum Warszawy", value: "20 min" },
    { label: "Z lotniska Okęcie", value: "15 min" },
    { label: "Parking", value: "na terenie" },
  ],
  travelNote:
    "Dokładnych wskazówek udzielamy przez telefon. Wjazd jest osłonięty od drogi — nikt z zewnątrz nie widzi, kto przyjeżdża.",
  mapsLabel: "Otwórz w mapach",
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=Świerkowa+13,+05-506+Magdalenka",
  map: {
    lat: 52.09229,
    lon: 20.89459,
    embedSrc:
      "https://www.openstreetmap.org/export/embed.html?bbox=20.88437%2C52.08959%2C20.90481%2C52.09498&layer=mapnik&marker=52.09229%2C20.89459",
    title: "Mapa dojazdu — Magdalenka",
  },
};

/* ------------------------------------------------------------------ footer */

export type FooterContent = {
  tagline: string;
  columnTitle: string;
  links: NavItem[];
  privacyLabel: string;
  privacyHref: string;
  emergencyLabel: string;
  emergencyNumber: string;
  helplineLabel: string;
  helplineNumber: string;
  legalName: string;
  disclaimer: string;
};

export const footerDefaults: FooterContent = {
  tagline: "ośrodek terapii uzależnień",
  columnTitle: "Strona",
  links: [
    { label: "Pierwszy kontakt", href: "/#pierwszy-kontakt" },
    { label: "Cennik", href: "/cennik" },
    { label: "Program", href: "/program" },
    { label: "Ośrodek", href: "/osrodek" },
    { label: "Zespół", href: "/zespol" },
    { label: "Pytania", href: "/faq" },
  ],
  privacyLabel: "Polityka prywatności · RODO",
  privacyHref: "/polityka-prywatnosci",
  emergencyLabel: "Jeśli dzieje się coś złego teraz",
  emergencyNumber: "112",
  helplineLabel: "telefon zaufania",
  helplineNumber: "800 12 02 89",
  legalName: "Insieme · ośrodek leczenia uzależnień",
  disclaimer:
    "Treści na stronie mają charakter informacyjny i nie stanowią reklamy świadczeń zdrowotnych.",
};
