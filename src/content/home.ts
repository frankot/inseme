/**
 * Every string the homepage renders, as typed content objects with the copy
 * from the approved design (wariant 5) as defaults.
 *
 * Sections are pure functions of these props: `page.tsx` spreads the defaults
 * today and will spread rows from the CMS later, without the section
 * components changing. Shapes that already have a table — contact details,
 * FAQ — mirror `settings` and `faq_items` so wiring them is a straight swap.
 */

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

export type NavItem = { label: string; href: string };

export const navDefaults: NavItem[] = [
  { label: "Pierwszy kontakt", href: "#pierwszy-kontakt" },
  { label: "Ośrodek", href: "#miejsce" },
  { label: "Program", href: "#program" },
  { label: "Test", href: "#test" },
  { label: "Pytania", href: "#faq" },
];

/** The mobile panel lists a couple of anchors the desktop bar has no room for. */
export const mobileNavDefaults: NavItem[] = [
  { label: "Pierwszy kontakt", href: "#pierwszy-kontakt" },
  { label: "Ośrodek", href: "#miejsce" },
  { label: "Program", href: "#program" },
  { label: "Jeden dzień", href: "#dzien" },
  { label: "Test przesiewowy", href: "#test" },
  { label: "Pytania", href: "#faq" },
  { label: "Kontakt", href: "#kontakt" },
];

/* -------------------------------------------------------------------- hero */

export type HeroContent = {
  eyebrow: string;
  title: string;
  lead: string;
  ctaLabel: string;
  image: { src: string; alt: string };
};

export const heroDefaults: HeroContent = {
  eyebrow: "Magdalenka pod Warszawą · ośrodek leczenia uzależnień",
  title: "Możesz zadzwonić i niczego nie obiecywać.",
  lead: "Rozmowa nie zobowiązuje do przyjazdu. Odbiera terapeuta z ośrodka — nie ma tu call center ani konsultanta sprzedaży.",
  ctaLabel: "Zadzwoń: 669 916 005",
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
  stats: Stat[];
  figures: Figure[];
};

export const osrodekDefaults: OsrodekContent = {
  index: "01",
  eyebrow: "Ośrodek",
  title: "Jeden dom w sosnowym lesie, dwadzieścia minut od Warszawy.",
  body: "Mieszkamy razem: pokoje z widokiem na drzewa, wspólny salon z fotelami, taras i ogród. Bez korytarzy, bez dyżurki za szybą, bez zapachu szpitala. Dwanaście miejsc, jeden zespół, ta sama kadra przez cały pobyt.",
  stats: [
    { label: "Miejsc", value: "12" },
    { label: "Od centrum", value: "20 min" },
    { label: "Dyżur", value: "24/7" },
    { label: "Program", value: "28 dni" },
  ],
  figures: [
    {
      src: "/placeholder/dom-taras.jpg",
      alt: "Taras ośrodka od strony ogrodu",
      caption:
        "Taras od strony ogrodu. Śniadanie na zewnątrz od kwietnia do października.",
    },
    {
      src: "/placeholder/salon-terapeutyczny.jpg",
      alt: "Salon z fotelami i widokiem na las",
      caption: "Salon — tu odbywają się grupy.",
    },
  ],
};

/* -------------------------------------------------------- pierwszy kontakt */

export type Step = { index: string; title: string; body: string };

export type PierwszyKontaktContent = {
  index: string;
  eyebrow: string;
  title: string;
  lead: string;
  steps: Step[];
  note: string;
  ctaLabel: string;
};

export const pierwszyKontaktDefaults: PierwszyKontaktContent = {
  index: "02",
  eyebrow: "Pierwszy kontakt",
  title: "Co się dzieje po tym, jak podniesiesz słuchawkę.",
  lead: "Cztery kroki. Pierwszy trwa kilka minut, ostatni zwykle zdarza się tego samego albo następnego dnia.",
  steps: [
    {
      index: "01",
      title: "Telefon",
      body: "Odbiera terapeuta z ośrodka. Nie musisz wiedzieć, co powiedzieć — możesz zacząć od zdania: „potrzebuję porozmawiać o terapii dla siebie” albo „dla bliskiej osoby”.",
    },
    {
      index: "02",
      title: "O co zapytamy",
      body: "Od jak dawna to trwa, co działo się w ostatnich dniach, jakie leki przyjmujesz, czy było już leczenie. Nie potrzebujemy nazwiska, diagnozy ani dokumentów.",
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
};

/* ----------------------------------------------------------------- program */

export type ProgramCard = {
  index: string;
  meta: string;
  title: string;
  body: string;
  linkLabel: string;
  href: string;
  /** The third card is inverted in the design. */
  inverted?: boolean;
};

export type ProgramContent = {
  index: string;
  eyebrow: string;
  note: string;
  cards: ProgramCard[];
};

export const programDefaults: ProgramContent = {
  index: "03",
  eyebrow: "Program",
  note: "Każdy pobyt ustalamy przez telefon, przed przyjazdem.",
  cards: [
    {
      index: "01",
      meta: "7–10 dni",
      title: "Detoks",
      body: "7–10 dni pod opieką lekarza. Przyjmujemy zwykle tego samego dnia, w którym dzwonisz.",
      linkLabel: "Zapytaj o miejsce",
      href: "#kontakt",
    },
    {
      index: "02",
      meta: "28 dni",
      title: "Terapia 28 dni",
      body: "Program podstawowy: grupa, rozmowy indywidualne, psychoedukacja. Można skrócić albo wydłużyć.",
      linkLabel: "Zobacz plan dnia",
      href: "#dzien",
    },
    {
      index: "03",
      meta: "bez pacjenta",
      title: "Dla rodziny",
      body: "Możesz zadzwonić bez wiedzy bliskiej osoby. Powiemy, co zwykle pomaga, a co pogarsza sprawę.",
      linkLabel: "Porozmawiaj z terapeutą",
      href: "tel:+48669916005",
      inverted: true,
    },
    {
      index: "04",
      meta: "bezterminowo",
      title: "Po pobycie",
      body: "Grupa wsparcia raz w tygodniu i kontakt z terapeutą, także po wyjeździe z ośrodka.",
      linkLabel: "Napisz do nas",
      href: "#kontakt",
    },
  ],
};

/* ------------------------------------------------------------- jeden dzień */

export type DayEntry = { time: string; body: string };

export type JedenDzienContent = {
  index: string;
  eyebrow: string;
  title: string;
  entries: DayEntry[];
};

export const jedenDzienDefaults: JedenDzienContent = {
  index: "04",
  eyebrow: "Jeden zwykły dzień",
  title: "Nie wiesz, co Cię czeka. To najtrudniejsza część.",
  entries: [
    {
      time: "7:30",
      body: "Pobudka bez budzenia całego domu. Kawa na tarasie albo jeszcze pół godziny w pokoju.",
    },
    {
      time: "9:30",
      body: "Grupa terapeutyczna. Pierwszego dnia możesz tylko słuchać — nikt tego nie komentuje.",
    },
    {
      time: "11:30",
      body: "Rozmowa indywidualna albo czas dla siebie. Las jest za furtką.",
    },
    {
      time: "15:00",
      body: "Zajęcia: psychoedukacja, praca z ciałem, warsztat albo film o nawrotach.",
    },
    {
      time: "21:00",
      body: "Krótkie podsumowanie dnia. Telefon zostaje przy Tobie — nikt go nie zabiera.",
    },
  ],
};

/* ------------------------------------------------------------- testimonial */

export type TestimonialContent = { quote: string; author: string; note: string };

export const testimonialDefaults: TestimonialContent = {
  quote:
    "„Nikt mnie nie oceniał ani jednego dnia. To był pierwszy raz, kiedy powiedziałem wszystko na głos.”",
  author: "pacjent, 35 lat",
  note: "opinia publikowana anonimowo, za pisemną zgodą",
};

/* -------------------------------------------------------- test przesiewowy */

export type TestOption = { label: string; value: number };
export type TestBand = { max: number; title: string; body: string };

export type TestContent = {
  index: string;
  eyebrow: string;
  title: string;
  lead: string;
  disclaimer: string;
  meta: string;
  prompt: string;
  startLabel: string;
  questions: string[];
  options: TestOption[];
  bands: TestBand[];
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
  index: "05",
  eyebrow: "Test przesiewowy",
  title: "Pięć pytań, które można zadać sobie bez świadków.",
  lead: "Odpowiedzi nie zapisujemy i nie wysyłamy nikomu. Wynik zobaczysz od razu na ekranie — a jeśli chcesz go zachować, wyślemy go w PDF na wskazany adres.",
  disclaimer:
    "Test ma charakter orientacyjny i nie jest diagnozą. Nie zastępuje rozmowy z terapeutą ani badania lekarskiego.",
  meta: "Samoocena · 5 pytań · ok. 2 minuty",
  prompt:
    "Myśląc o ostatnich dwunastu miesiącach — jak często zdarzały się poniższe sytuacje?",
  startLabel: "Zacznij test",
  questions: [
    "Jak często zdarza się, że wypijasz lub bierzesz więcej, niż zamierzałeś?",
    "Czy w ostatnim roku próbowałeś ograniczyć i nie udało się utrzymać tego dłużej niż kilka dni?",
    "Czy zdarza Ci się sięgać po alkohol lub substancję z rana, żeby poczuć się normalnie?",
    "Czy z tego powodu coś w Twoim życiu przestało działać — praca, relacje, zdrowie, pieniądze?",
    "Czy ktoś bliski powiedział Ci, że się o Ciebie martwi?",
  ],
  options: [
    { label: "Nigdy", value: 0 },
    { label: "Rzadko", value: 1 },
    { label: "Czasem", value: 2 },
    { label: "Często", value: 3 },
  ],
  bands: [
    {
      max: 4,
      title: "Na razie nic nie wskazuje na poważny problem.",
      body: "Wynik jest niski. Jeśli mimo tego coś Cię niepokoi — samo pytanie „czy to już problem?” bywa ważniejsze niż punkty. Możesz zadzwonić i po prostu o tym pogadać.",
    },
    {
      max: 9,
      title: "Warto się temu przyjrzeć spokojnie.",
      body: "Kilka odpowiedzi wskazuje na wzorzec, który zwykle się nie cofa sam. Nie znaczy to, że potrzebujesz ośrodka — znaczy, że warto z kimś przejść przez to na głos, zanim zrobi się trudniej.",
    },
    {
      max: 15,
      title: "Zalecamy kontakt ze specjalistą.",
      body: "Odpowiedzi układają się w obraz, z którym zwykle nie da się poradzić sobie samemu. To nie ocena — to informacja. Rozmowa z terapeutą nie zobowiązuje do przyjazdu i nie kończy się ofertą.",
    },
  ],
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

/** Mirrors published rows of `faq_items`. */
export type FaqItem = { question: string; answer: string };

export type FaqContent = {
  index: string;
  eyebrow: string;
  title: string;
  note: string;
  items: FaqItem[];
};

export const faqDefaults: FaqContent = {
  index: "06",
  eyebrow: "Pytania",
  title: "Pytania, które trudno zadać na głos.",
  note: "Odpowiadamy tak samo przez telefon. Jeśli czegoś tu brakuje — zapytaj, nie ma pytań niewygodnych.",
  items: [
    {
      question: "Czy mogę zadzwonić w imieniu bliskiej osoby?",
      answer:
        "Tak i bardzo często tak się to zaczyna. Powiemy, co zwykle pomaga, a co pogarsza sprawę, i jak rozmawiać, żeby nie skończyło się kłótnią. Do tej osoby nie dzwonimy bez Twojej wiedzy.",
    },
    {
      question: "Czy rozmowa do czegoś zobowiązuje?",
      answer:
        "Nie. Nie musisz podawać nazwiska, nie wysyłamy po niej ofert i nie dzwonimy drugi raz bez Twojej zgody.",
    },
    {
      question: "Czy można przyjechać od razu?",
      answer:
        "Przy detoksie zwykle tak, często tego samego dnia. Mamy dwanaście miejsc, więc konkretny termin ustalamy w rozmowie — i mówimy wprost, jeśli miejsca nie ma.",
    },
    {
      question: "Czy potrzebne jest skierowanie?",
      answer:
        "Nie. Pobyt jest prywatny, nie wymaga skierowania ani ubezpieczenia. Potrzebna jest lista przyjmowanych leków, jeśli jakieś przyjmujesz.",
    },
    {
      question: "Czy mogę mieć telefon i czy są odwiedziny?",
      answer:
        "Telefon zostaje przy Tobie. Odwiedziny są możliwe, zwykle po pierwszym tygodniu — termin ustalasz z terapeutą prowadzącym.",
    },
    {
      question: "Ile to kosztuje i od czego zależy cena?",
      answer:
        "Koszt zależy od długości pobytu, potrzeby detoksu, konsultacji psychiatrycznej i stanu zdrowia. Konkretną kwotę podajemy w pierwszej rozmowie, przed przyjazdem — nie po.",
    },
    {
      question: "Czy pobyt jest poufny? Czy informacje trafią do rodziny?",
      answer:
        "Bez Twojej pisemnej zgody nie przekazujemy nikomu informacji o pobycie — także rodzinie. Zaświadczenia i dokumenty wydajemy wyłącznie Tobie.",
    },
  ],
};

/* ----------------------------------------------------------------- kontakt */

export type KontaktContent = {
  index: string;
  eyebrow: string;
  title: string;
  privacyNote: string;
  travel: Stat[];
  travelNote: string;
  mapsLabel: string;
  mapsHref: string;
  /** Świerkowa 13 — geocoded, exact house-number match. */
  map: { lat: number; lon: number; embedSrc: string; title: string };
};

export const kontaktDefaults: KontaktContent = {
  index: "07",
  eyebrow: "Kontakt",
  title: "Zadzwoń dziś, przyjedź kiedy będziesz gotowy.",
  privacyNote:
    "Do rozmowy nie potrzebujemy nazwiska. Nie wysyłamy po niej ofert i nie dzwonimy drugi raz bez Twojej zgody.",
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
    { label: "Pierwszy kontakt", href: "#pierwszy-kontakt" },
    { label: "Testy przesiewowe", href: "#test" },
    { label: "Cennik i pobyt", href: "#kontakt" },
    { label: "O nas", href: "#miejsce" },
    { label: "Kontakt", href: "#kontakt" },
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
