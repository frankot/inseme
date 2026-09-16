/**
 * The /osrodek page: the gallery, the logistics and the short list of what to
 * bring. This is the old site's POBYT and GALERIA content, which the rebuild
 * had nowhere to put — the homepage carried four photographs and nothing else.
 *
 * The figures and stats themselves live in `content/home.ts` and are shared
 * with the homepage band, so there is one copy of each caption.
 *
 * The copy is ordered the way the page runs: the opening, then one block per
 * band — where it is, what the house is like, the photographs, what is on
 * site, and what happens on the day someone arrives. Each band carries its own
 * eyebrow because the page has no numerals to label them with.
 */

/** One of the four things the page says about the house itself. */
export type OsrodekAspect = { title: string; lead: string; body: string };

/** A facility, named and explained in one line. */
export type OsrodekAmenity = { title: string; body: string };

export type OsrodekPageContent = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  breadcrumbHome: string;
  breadcrumbLabel: string;
  title: string;
  lead: string;
  /** The wide photograph under the intro, used until a gallery photo exists. */
  heroFallback: { src: string; alt: string };
  /** The link out of the dark figures panel, into the arrival band. */
  statsLinkLabel: string;
  locationEyebrow: string;
  locationTitle: string;
  location: string[];
  aspectsEyebrow: string;
  aspectsTitle: string;
  aspectsLead: string;
  aspects: OsrodekAspect[];
  galleryTitle: string;
  amenitiesEyebrow: string;
  amenitiesTitle: string;
  amenitiesLead: string;
  amenities: OsrodekAmenity[];
  arrivalEyebrow: string;
  arrivalTitle: string;
  arrivalLead: string;
  packingTitle: string;
  packingLead: string;
  packing: string[];
  packingNote: string;
  travelTitle: string;
};

export const osrodekPageDefaults: OsrodekPageContent = {
  metaTitle: "Ośrodek w Magdalence — jak wygląda, jak dojechać | Insieme",
  metaDescription:
    "Dom w sosnowym lesie dwadzieścia minut od Warszawy: pokoje, salon terapeutyczny, ogród. Jak dojechać, co zabrać ze sobą, jak wygląda przyjazd.",
  eyebrow: "Ośrodek",
  breadcrumbHome: "Strona główna",
  breadcrumbLabel: "Ośrodek",
  title: "Dom, a nie oddział.",
  lead: "Dwanaście miejsc w jednym domu pod Warszawą. Bez korytarzy, bez dyżurki za szybą, bez zapachu szpitala — i bez widoku z ulicy na to, kto przyjeżdża.",

  heroFallback: {
    src: "/placeholder/dom-staw.jpg",
    alt: "Dom ośrodka widziany zza stawu, w otoczeniu sosen",
  },
  statsLinkLabel: "Jak dojechać",

  locationEyebrow: "Lokalizacja",
  locationTitle: "Gdzie to jest",
  location: [
    "Magdalenka, piętnaście kilometrów na południe od Warszawy. Dom stoi w lesie, na uboczu i za ogrodzeniem — nie przy drodze, nie w pierzei, bez tabliczki przy wjeździe.",
    "To nie jest ozdobnik. Dla większości osób przyjazd tutaj jest najtrudniejszym dniem całego leczenia i nikt nie powinien zaczynać go od pytania, kto go właśnie zobaczył.",
    "Dojechać da się w jeden dzień praktycznie z każdego miejsca w Polsce, a z lotniska — w kwadrans.",
  ],

  aspectsEyebrow: "Wnętrze",
  aspectsTitle: "Co to za dom",
  aspectsLead:
    "Dwanaście miejsc, jedno piętro, wspólny stół. Poniżej cztery rzeczy, o które pytają najczęściej osoby, które jeszcze się nie zdecydowały.",
  aspects: [
    {
      title: "Cisza",
      lead: "Leczenie zaczyna się od zatrzymania.",
      body: "Dom stoi na tyle daleko od drogi, że słychać las. Pierwsze dni są głównie o tym: przestać biec na tyle długo, żeby zobaczyć, co się właściwie dzieje. Grupy, sesje i plan dnia dokładają się do tego później.",
    },
    {
      title: "Pokoje",
      lead: "Meble, nie wyposażenie.",
      body: "Pokoje dwu- i trzyosobowe, umeblowane tak, jak mebluje się dom, a nie salę. Przestrzenie wspólne wykończone w tym samym standardzie — to widać od progu i to jest pierwsza rzecz, która odróżnia ten dom od oddziału.",
    },
    {
      title: "Salon z kominkiem",
      lead: "Tu odbywają się grupy.",
      body: "Terapia grupowa toczy się w salonie z kominkiem, w fotelach, a nie w kręgu krzeseł pod jarzeniówką. Sesje indywidualne mają osobne, mniejsze pomieszczenie — na tyle prywatne, żeby dało się w nim powiedzieć rzecz, której nie mówi się przy dwunastu osobach.",
    },
    {
      title: "Czas wolny",
      lead: "Popołudnie też jest częścią leczenia.",
      body: "Zagospodarowanie wolnego czasu to jedna z tych umiejętności, których uczymy wprost — bo po wyjściu stąd bywa najtrudniejsza. Jest ogród, taras, sala telewizyjna, stół do ping-ponga i sauna.",
    },
  ],

  galleryTitle: "Cały dom na zdjęciach.",

  amenitiesEyebrow: "Udogodnienia",
  amenitiesTitle: "Wszystko na miejscu, wliczone w pobyt.",
  amenitiesLead:
    "Nic z tego nie jest dodatkowo płatne i po nic nie trzeba wychodzić za bramę.",
  amenities: [
    {
      title: "Sauna i strefa relaksu",
      body: "Sauna, strefa relaksu i oranżeria. Sauna działa dwa razy w tygodniu — zabierz strój kąpielowy.",
    },
    {
      title: "Siłownia",
      body: "Atlas, bieżnia, ławka treningowa i rower stacjonarny. Wysiłek fizyczny dobrze równoważy intensywną pracę w terapii.",
    },
    {
      title: "Zalesiony ogród",
      body: "Duży ogród wśród sosen — na spacer, na jogging albo na to, żeby przez godzinę z nikim nie rozmawiać.",
    },
    {
      title: "Wi-Fi",
      body: "Na terenie całego ośrodka. Zasady korzystania z telefonu ustalamy na miejscu, przy przyjęciu.",
    },
  ],

  arrivalEyebrow: "Przyjazd",
  arrivalTitle: "Zostają dwie rzeczy do ustalenia.",
  arrivalLead:
    "Co spakować i którędy dojechać. Resztę — godzinę, dokumenty, pierwszy dzień — omawiamy przez telefon.",
  packingTitle: "Co zabrać",
  packingLead:
    "Lista jest krótka i nic z niej nie jest obowiązkowe — czego zabraknie, dokupimy na miejscu.",
  packing: [
    "Dowód osobisty",
    "Leki, które przyjmujesz na stałe, w oryginalnych opakowaniach",
    "Wygodne ubrania na dwa tygodnie i coś ciepłego na spacery",
    "Klapki, ręcznik, kosmetyki",
    "Strój kąpielowy — sauna działa dwa razy w tygodniu",
    "Dokumentacja z wcześniejszego leczenia, jeśli ją masz",
  ],
  packingNote:
    "Telefon możesz zabrać. Zasady korzystania ustalamy na miejscu i tłumaczymy, dlaczego pierwsze dni są bez niego łatwiejsze.",
  travelTitle: "Dojazd",
};
