/**
 * The /osrodek page: where the house is, what it is like inside, the rooms on
 * photographs, what is on site, and what happens before someone arrives.
 *
 * The copy is ordered the way the page runs — the opening, then one block per
 * band. Each band carries its own eyebrow because the page has no numerals to
 * label them with. Multi-paragraph fields are arrays: the first paragraph is
 * the answer, the rest explain it, and the page sets them that way.
 */

/** One of the four things the page says about the house itself. */
export type OsrodekAspect = { title: string; lead: string; body: string[] };

/** A facility, named and explained. */
export type OsrodekAmenity = { title: string; body: string[] };

/** One of the named rooms in the photo band. */
export type OsrodekSpace = {
  title: string;
  body: string;
  src: string;
  alt: string;
};

export type OsrodekPageContent = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  breadcrumbHome: string;
  breadcrumbLabel: string;
  title: string;
  lead: string[];
  /** The wide photograph under the intro, used until a gallery photo exists. */
  heroFallback: { src: string; alt: string };
  /** Beside the lead: the numbers people ask for before anything else. */
  facts: { label: string; value: string }[];
  /** The link under the photograph, into the arrival band. */
  statsLinkLabel: string;
  locationTitle: string;
  location: string[];
  aspectsEyebrow: string;
  aspectsTitle: string;
  aspectsLead: string[];
  aspects: OsrodekAspect[];
  galleryEyebrow: string;
  galleryTitle: string;
  galleryLead: string[];
  galleryLinkLabel: string;
  galleryHref: string;
  spaces: OsrodekSpace[];
  amenitiesEyebrow: string;
  amenitiesTitle: string;
  amenitiesLead: string;
  amenities: OsrodekAmenity[];
  arrivalEyebrow: string;
  arrivalTitle: string;
  arrivalLead: string[];
  packingTitle: string;
  packingLead: string;
  packing: string[];
  packingNotes: string[];
  travelTitle: string;
  travelAddressLead: string;
  /** In the locative, after "przy" — not the shared `contactDefaults` form. */
  travelAddress: string[];
  travel: string[];
  firstDayTitle: string;
  firstDayBody: string;
  firstDayCtaLabel: string;
};

export const osrodekPageDefaults: OsrodekPageContent = {
  metaTitle: "Prywatny ośrodek terapii uzależnień pod Warszawą | Insieme",
  metaDescription:
    "Kameralny ośrodek terapii uzależnień w Magdalence, 15 km od Warszawy: pokoje, salon terapeutyczny, ogród, sauna i siłownia. Jak dojechać, co zabrać, jak wygląda przyjazd.",
  eyebrow: "Ośrodek",
  breadcrumbHome: "Strona główna",
  breadcrumbLabel: "Ośrodek",
  title: "Domowe warunki. Profesjonalne leczenie.",
  lead: [
    "Insieme to kameralny ośrodek terapii uzależnień w Magdalence pod Warszawą. Stworzyliśmy miejsce, które daje poczucie bezpieczeństwa i prywatności, a jednocześnie zapewnia warunki do intensywnej pracy terapeutycznej.",
    "To dom, w którym przez kilka tygodni możesz zatrzymać się, uporządkować codzienność i skoncentrować na leczeniu.",
  ],

  heroFallback: {
    src: "/placeholder/dom-staw.webp",
    alt: "Dom ośrodka widziany zza stawu, w otoczeniu sosen",
  },
  facts: [
    { label: "Grupa", value: "8–12 osób" },
    { label: "Lokalizacja", value: "15 km od Warszawy" },
    { label: "Opieka", value: "24/7" },
    { label: "Program", value: "minimum 28 dni" },
  ],
  statsLinkLabel: "Jak dojechać",

  locationTitle: "Gdzie jesteśmy",
  location: [
    "Insieme znajduje się w Magdalence, około 15 kilometrów na południe od Warszawy. Ośrodek położony jest w lesie, na uboczu, a teren wokół porośnięty jest starodrzewiem.",
    "Bliskość Warszawy ułatwia dojazd, a otoczenie lasu pozwala jednocześnie odsunąć się na chwilę od codziennego środowiska, obowiązków i sytuacji związanych z uzależnieniem.",
    "Położenie ośrodka sprzyja również prywatności i spokojnemu rozpoczęciu leczenia.",
  ],

  aspectsEyebrow: "Wnętrze",
  aspectsTitle: "Jak wygląda Insieme",
  aspectsLead: [
    "Przez minimum 28 dni ośrodek staje się miejscem, w którym mieszkasz, pracujesz terapeutycznie i odpoczywasz. Dlatego zależało nam, żeby nie przypominał oddziału szpitalnego.",
    "Jest przestronnie i domowo. Są miejsca do wspólnego spędzania czasu, pracy terapeutycznej, aktywności oraz takie, w których można pobyć samemu.",
  ],
  aspects: [
    {
      title: "Przestrzeń i spokój",
      lead: "Miejsce, w którym można się zatrzymać.",
      body: [
        "Ośrodek otacza duży, zalesiony ogród. Cisza, zieleń i oddalenie od codziennego otoczenia pomagają zwolnić i skoncentrować się na tym, co dzieje się tu i teraz.",
        "Nie chodzi o odcięcie od życia, ale o stworzenie warunków, w których przez pewien czas można skupić się przede wszystkim na sobie i leczeniu.",
      ],
    },
    {
      title: "Pokoje",
      lead: "Razem, ale z przestrzenią dla siebie.",
      body: [
        "Wspólne zakwaterowanie jest świadomą częścią programu — pomaga ograniczać izolowanie się, sprzyja budowaniu relacji i wzajemnemu wsparciu.",
        "Jednocześnie sam ośrodek jest na tyle duży, że jeśli potrzebujesz ciszy albo chwili samemu ze sobą, zawsze możesz znaleźć odpowiednią przestrzeń.",
      ],
    },
    {
      title: "Przestrzeń terapeutyczna",
      lead: "Inne miejsce do pracy w grupie, inne do rozmowy w cztery oczy.",
      body: [
        "Terapia grupowa odbywa się w przestronnym salonie z kominkiem. To tutaj spotykamy się każdego dnia, rozmawiamy, pracujemy i dzielimy doświadczeniami.",
        "Sesje indywidualne odbywają się w osobnych pomieszczeniach, zapewniających spokój i prywatność potrzebne do bardziej osobistej pracy.",
      ],
    },
    {
      title: "Czas poza zajęciami",
      lead: "Odpoczynek też ma swoje miejsce.",
      body: [
        "W Insieme kierujemy się zasadą, że każda minuta pobytu może być częścią procesu zmiany. Dotyczy to również sposobu odpoczywania, organizowania wolnego czasu i dbania o siebie.",
        "Do dyspozycji pacjentów są między innymi ogród, oranżeria, sauna, siłownia oraz przestrzenie do odpoczynku i wspólnego spędzania czasu.",
      ],
    },
  ],

  galleryEyebrow: "Galeria",
  galleryTitle: "Zobacz Insieme",
  galleryLead: [
    "Pokoje, przestrzenie terapeutyczne, ogród i miejsca, w których spędza się czas pomiędzy zajęciami.",
    "Chcemy, żeby jeszcze przed przyjazdem można było zobaczyć, gdzie będzie się mieszkać przez kolejne tygodnie.",
  ],
  galleryLinkLabel: "Zobacz całą galerię",
  galleryHref: "/galeria",
  spaces: [
    {
      title: "Taras i ogród",
      body: "Przestrzeń na odpoczynek pomiędzy zajęciami.",
      src: "/placeholder/dom-taras.webp",
      alt: "Taras ośrodka i porośnięta bluszczem elewacja domu",
    },
    {
      title: "Pokoje",
      body: "Przestronne, z widokiem na otaczającą zieleń.",
      src: "/placeholder/pokoj.webp",
      alt: "Jasny pokój z widokiem na las",
    },
    {
      title: "Salon terapeutyczny",
      body: "Miejsce codziennej pracy grupowej.",
      src: "/placeholder/salon-terapeutyczny.webp",
      alt: "Salon terapeutyczny z fotelami i widokiem na las",
    },
    {
      title: "Gabinet terapeutyczny",
      body: "Przestrzeń do indywidualnej rozmowy i pracy z terapeutą.",
      src: "/placeholder/rozmowa.webp",
      alt: "Rozmowa indywidualna z terapeutą w gabinecie",
    },
  ],

  amenitiesEyebrow: "Udogodnienia",
  amenitiesTitle: "Przestrzeń również do odpoczynku.",
  amenitiesLead:
    "Intensywna terapia wymaga równowagi. Dlatego poza miejscami przeznaczonymi do pracy terapeutycznej w ośrodku są również przestrzenie do ruchu, regeneracji, odpoczynku i spędzania czasu z innymi.",
  amenities: [
    {
      title: "Sauna, oranżeria i przestrzeń do relaksu",
      body: [
        "Sauna jest dostępna zgodnie z harmonogramem pobytu. Oranżeria i pozostałe przestrzenie wspólne pozwalają odpocząć, porozmawiać lub po prostu na chwilę zwolnić.",
      ],
    },
    {
      title: "Siłownia",
      body: [
        "Na miejscu znajduje się siłownia wyposażona m.in. w bieżnię, rower stacjonarny, atlas i ławkę treningową. Na terenie ośrodka znajduje się również stół do tenisa.",
        "Ruch jest ważną częścią planu dnia.",
      ],
    },
    {
      title: "Duży zalesiony ogród",
      body: [
        "Ogród otaczający dom daje przestrzeń do ruchu, spaceru i odpoczynku na świeżym powietrzu.",
        "To również miejsce, w którym można znaleźć chwilę ciszy i pobyć samemu ze sobą.",
      ],
    },
    {
      title: "Wi-Fi i telefon",
      body: [
        "Na terenie ośrodka dostępne jest Wi-Fi. Telefon możesz mieć ze sobą i korzystać z niego w sposób, który nie zakłóca procesu terapii.",
        "W przypadku osób zmagających się z patologicznym hazardem zasady korzystania z telefonu ustalamy indywidualnie.",
      ],
    },
  ],

  arrivalEyebrow: "Przyjazd",
  arrivalTitle: "Przygotowanie do przyjazdu",
  arrivalLead: [
    "Kiedy decyzja o rozpoczęciu leczenia zostanie podjęta, przeprowadzimy Cię przez dalsze kroki.",
    "Ustalimy termin przyjęcia, wyjaśnimy, jak przygotować się do pobytu i prześlemy dokładną listę potrzebnych rzeczy. Nie musisz organizować wszystkiego samodzielnie.",
  ],
  packingTitle: "Co warto zabrać",
  packingLead:
    "Poniżej przedstawiamy listę najpotrzebniejszych rzeczy do funkcjonowania w Insieme:",
  packing: [
    "dowód osobisty (będzie nam potrzebny do sformalizowania pobytu)",
    "dokumentację z wcześniejszego leczenia, jeśli ją posiadasz",
    "leki przyjmowane na stałe, najlepiej w oryginalnych opakowaniach",
    "wygodne ubrania na pobyt",
    "odzież i obuwie odpowiednie do spacerów i aktywności",
    "kosmetyki i rzeczy osobiste",
    "ręczniki kąpielowe oraz do sauny",
  ],
  packingNotes: [
    "Jeśli przed przyjazdem okaże się, że czegoś nie masz albo o czymś zapomniałeś, pomożemy znaleźć rozwiązanie.",
    "W ośrodku są dostępne pralki — możesz z nich korzystać jak w warunkach domowych.",
  ],
  travelTitle: "Dojazd",
  travelAddressLead: "Insieme znajduje się przy:",
  travelAddress: ["ul. Świerkowej 13", "05-506 Magdalenka"],
  travel: [
    "Magdalenka leży około 15 km na południe od Warszawy, z dogodnym dojazdem również z Lotniska Chopina.",
    "Parking znajduje się na terenie ośrodka.",
    "Przed przyjazdem możesz otrzymać od nas dokładne wskazówki dotyczące dojazdu.",
  ],
  firstDayTitle: "Pierwszy dzień nie musi być kolejną niewiadomą.",
  firstDayBody:
    "Przed przyjazdem wyjaśnimy Ci, o której przyjechać, co zabrać i jak będzie wyglądało przyjęcie. Na miejscu krok po kroku pomożemy Ci wejść w rytm ośrodka i rozpocząć terapię.",
  firstDayCtaLabel: "Zapytaj o przyjęcie",
};
