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
  hours: "dyżur całą dobę, także w weekendy",
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
  rpwdl: { label: string; number: string };
  image: { src: string; alt: string };
};

export const heroDefaults: HeroContent = {
  eyebrow: "Magdalenka pod Warszawą · ośrodek leczenia uzależnień",
  title: "Możesz zadzwonić i niczego nie obiecywać.",
  lead: "Rozmowa nie zobowiązuje do przyjazdu. Odbiera terapeuta z ośrodka — nie ma tu call center ani konsultanta sprzedaży.",
  ctaLabel: "Zadzwoń: 669 916 005",
  /*
   * The three things a frightened person needs to know before deciding whether
   * to dial, kept short enough to read in a glance.
   */
  trust: ["Dyżur całą dobę, także w weekendy", "Rozmowa bez nazwiska", "Bez opłat za konsultację"],
  /*
   * Registry number right below the main title. Placeholder until the real
   * RPWDL entry is to hand.
   */
  rpwdl: { label: "Numer w RPWDL", number: "000000234596" },
  image: { src: "/placeholder/dom-staw.jpg", alt: "" },
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
  title: "Jeden dom w sosnowym lesie, dwadzieścia minut od Warszawy.",
  body: "Mieszkamy razem: pokoje z widokiem na drzewa, wspólny salon z fotelami, taras i ogród. Bez korytarzy, bez dyżurki za szybą, bez zapachu szpitala. Dwanaście miejsc, jeden zespół, ta sama kadra przez cały pobyt.",
  href: "/osrodek",
  linkLabel: "Zobacz ośrodek i dojazd",
  stats: [
    { label: "Miejsc", value: "12" },
    { label: "Od centrum", value: "20 min" },
    { label: "Dyżur", value: "24/7" },
    { label: "Program", value: "28 dni" },
  ],
  figures: [
    {
      src: "/placeholder/dom-taras.jpg",
      alt: "Taras ośrodka i porośnięta bluszczem elewacja domu",
      caption: "Taras od strony ogrodu — tu pije się kawę między zajęciami.",
    },
    {
      src: "/placeholder/pokoj.jpg",
      alt: "Jasny pokój z widokiem na las",
      caption: "Pokoje dwu- i trzyosobowe, okna na sosny.",
    },
    {
      src: "/placeholder/salon-terapeutyczny.jpg",
      alt: "Salon terapeutyczny z fotelami i widokiem na las",
      caption: "Salon — tu odbywają się grupy.",
    },
    {
      src: "/placeholder/rozmowa.jpg",
      alt: "Rozmowa indywidualna z terapeutą",
      caption: "Sesje indywidualne.",
    },
  ],
};

/* -------------------------------------------------------- pierwszy kontakt */

export type Step = { index: string; title: string; body: string };
export type PathPoint = { title: string; body: string };

/**
 * Two ways into the same ośrodek: the person who drinks, and the person who is
 * frightened for someone who does. They need different first sentences, so each
 * path carries a full set of copy rather than one text with a swapped pronoun.
 */
export type ContactPathId = "self" | "family";

/**
 * One path, end to end. This used to be split across two sections — a fork with
 * its own cards and promises, and a separate run of steps with its own tab bar —
 * which said the same thing twice and made the visitor choose before reading.
 * They are one section now, so the copy is one object.
 */
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

/**
 * Section 01. `self` is first and selected by default: most people who call are
 * calling about themselves, so the page opens on their words and offers the
 * family path beside them rather than making everyone pick first.
 */
export const pierwszyKontaktDefaults: PierwszyKontaktContent = {
  index: "01",
  eyebrow: "Pierwszy kontakt",
  paths: [
    {
      id: "self",
      tabLabel: "Dla siebie",
      cardTitle: "To o mnie",
      cardBody:
        "Chcę przestać, ale nie wiem, od czego zacząć ani co się stanie po przyjeździe.",
      chooseLabel: "Wybierz tę ścieżkę",
      selectedLabel: "Czytasz tę ścieżkę",
      title: "Co się dzieje po tym, jak podniesiesz słuchawkę.",
      lead: "Najtrudniejszy jest pierwszy telefon — wszystko inne ustalamy już w jego trakcie. Cztery kroki: pierwszy trwa kilka minut, ostatni zwykle zdarza się tego samego albo następnego dnia.",
      points: [
        {
          title: "Bez nazwiska",
          body: "Do rozmowy nie potrzebujemy danych, diagnozy ani dokumentów.",
        },
        {
          title: "Bez czekania",
          body: "Przy detoksie zwykle przyjmujemy tego samego dnia, w którym dzwonisz.",
        },
        {
          title: "Bez oferty",
          body: "Cenę podajemy w pierwszej rozmowie i nie dzwonimy drugi raz bez Twojej zgody.",
        },
      ],
      steps: [
        {
          index: "01",
          title: "Telefon",
          body: "Odbiera terapeuta z ośrodka. Nie musisz wiedzieć, co powiedzieć — możesz zacząć od zdania: „potrzebuję porozmawiać o terapii dla siebie”.",
        },
        {
          index: "02",
          title: "O co zapytamy",
          body: "Od jak dawna to trwa, co działo się w ostatnich dniach, jakie leki przyjmujesz, czy było już leczenie.",
        },
        {
          index: "03",
          title: "Co ustalamy w tej samej rozmowie",
          body: "Czy potrzebny jest detoks, kiedy jest wolne miejsce, ile potrwa pobyt i ile będzie kosztował. Kwotę podajemy przed przyjazdem, nie po.",
        },
        {
          index: "04",
          title: "Przyjazd",
          body: "Możesz przyjechać sam, z kimś bliskim albo poprosić o pomoc w transporcie. Co zabrać — powiemy przez telefon, lista jest krótka.",
        },
      ],
      note: "Rozmowa nie zobowiązuje do przyjazdu.",
      ctaLabel: "Zadzwoń teraz",
      secondaryLabel: "Najpierw wypełnij test",
      secondaryHref: "#test",
    },
    {
      id: "family",
      tabLabel: "Dla bliskiej osoby",
      cardTitle: "Chodzi o kogoś bliskiego",
      cardBody:
        "Boję się o kogoś i nie wiem, jak rozmawiać, żeby nie zamknąć drzwi na dobre.",
      chooseLabel: "Wybierz tę ścieżkę",
      selectedLabel: "Czytasz tę ścieżkę",
      title: "Możesz zadzwonić, zanim ta osoba będzie gotowa.",
      lead: "Najczęściej dzwoni ktoś, kto boi się, że jednym zdaniem pogorszy sprawę — od tego zaczynamy. Rozmowa z rodziną jest tak samo poufna jak z pacjentem.",
      points: [
        {
          title: "Bez jego zgody",
          body: "Możesz zadzwonić, zanim ta osoba w ogóle będzie chciała o tym słyszeć.",
        },
        {
          title: "Bez kontaktu za plecami",
          body: "Sami nie dzwonimy do niej ani nie piszemy — ani teraz, ani później.",
        },
        {
          title: "Bez jednej rozmowy na zawsze",
          body: "Możesz wrócić za tydzień albo za pół roku. Nie zaczynamy wtedy od zera.",
        },
      ],
      steps: [
        {
          index: "01",
          title: "Telefon",
          body: "Odbiera ten sam terapeuta, który rozmawia z pacjentami. Możesz zacząć od zdania: „dzwonię w sprawie kogoś bliskiego”. Nie musisz podawać ani swojego, ani jej nazwiska.",
        },
        {
          index: "02",
          title: "O co zapytamy",
          body: "Od jak dawna to trwa, co dzieje się w domu w ostatnich tygodniach, czy było już leczenie, czy pojawia się przemoc albo zagrożenie zdrowia. Pytamy też, jak Ty to znosisz.",
        },
        {
          index: "03",
          title: "Co powiedzieć, a czego nie mówić",
          body: "Kiedy zacząć rozmowę, jakich zdań unikać i co odpowiedzieć na „nie mam problemu”. To zwykle najtrudniejsza część i na nią poświęcamy najwięcej czasu.",
        },
        {
          index: "04",
          title: "Zostajemy w kontakcie",
          body: "Także wtedy, gdy bliska osoba jeszcze nie chce leczenia. Możesz zadzwonić ponownie za tydzień albo za pół roku — nie zaczynamy wtedy od zera.",
        },
      ],
      note: "Do rozmowy nie potrzebujesz zgody tej osoby.",
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
  /** Label over the day plan — a sub-heading inside 04, so no numeral. */
  eyebrow: string;
  title: string;
  lead: string;
  /** Sits over the right-hand column, opposite the word "Godzina". */
  scheduleLabel: string;
  /** Footnote under the intro — what the timetable does not cover. */
  note: string;
  /** Closes the intro column, beside the hours. No caption — the plan is the point. */
  image: { src: string; alt: string };
  entries: DayEntry[];
};

export const jedenDzienDefaults: JedenDzienContent = {
  eyebrow: "Jeden zwykły dzień",
  title: "Nie wiesz, co Cię czeka. To najtrudniejsza część.",
  lead: "Dzień ma stałe ramy: te same godziny dla wszystkich, od pobudki po ciszę nocną. Po dwóch, trzech dniach przestajesz o nich myśleć — i to zwykle pierwszy moment ulgi.",
  scheduleLabel: "Plan dnia · pn–sb",
  note: "W niedzielę dzień jest luźniejszy — bez bloków terapeutycznych.",
  image: {
    src: "/placeholder/dom-staw.jpg",
    alt: "Dom ośrodka widziany zza stawu, w otoczeniu sosen",
  },
  entries: [
    { time: "6:45", title: "Pobudka" },
    {
      time: "7:00",
      title: "Aktywacja",
      detail: "Wspólne ćwiczenia. Krótko i bez wyczynu.",
    },
    { time: "8:00", title: "Śniadanie" },
    {
      time: "9:00–12:00",
      title: "Poranny blok terapeutyczny",
      detail:
        "Medytacja, omówienie funkcji, dzienniki emocji i głodu, prace terapeutyczne, informacje zwrotne.",
    },
    {
      time: "12:00–13:30",
      title: "Przerwa",
      detail: "Czas własny: spacer, drzemka, rozmowa.",
    },
    { time: "13:30", title: "Obiad" },
    {
      time: "15:00–18:00",
      title: "Popołudniowy blok terapeutyczny",
      detail:
        "Psychoedukacja, ćwiczenia terapeutyczne, praca grupowa, informacje zwrotne.",
    },
    { time: "18:00–19:00", title: "Przerwa", detail: "Czas własny." },
    { time: "19:00", title: "Kolacja" },
    {
      time: "wieczór",
      title: "Czas własny",
      detail: "Prace terapeutyczne, rekreacja, siłownia.",
    },
    {
      time: "19:30 / 20:30",
      title: "Sauna",
      detail: "Dwie tury do 22:00, zgodnie z harmonogramem, niekoedukacyjnie.",
    },
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
    "Wynik jest w drodze. Jeśli chcesz o nim porozmawiać — 669 916 005, całą dobę.",
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
  title: "Pytania, które trudno zadać na głos.",
  note: "Odpowiadamy tak samo przez telefon. Jeśli czegoś tu brakuje — zapytaj, nie ma pytań niewygodnych.",
  href: "/pytania",
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
    { label: "Pytania", href: "/pytania" },
  ],
  privacyLabel: "Polityka prywatności · RODO",
  privacyHref: "#",
  emergencyLabel: "Jeśli dzieje się coś złego teraz",
  emergencyNumber: "112",
  helplineLabel: "telefon zaufania",
  helplineNumber: "800 12 02 89",
  legalName: "Insieme · ośrodek leczenia uzależnień",
  disclaimer:
    "Treści na stronie mają charakter informacyjny i nie stanowią reklamy świadczeń zdrowotnych.",
};
