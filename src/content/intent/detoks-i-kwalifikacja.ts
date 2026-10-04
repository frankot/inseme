import { NFZ_ARTICLE_HREF } from "@/content/artykul-nfz";

import type { IntentPageContent } from "./types";

/**
 * /detoks-i-kwalifikacja — what happens before therapy. Intent: "czy potrzebny
 * detoks", "odtrucie alkoholowe", "objawy odstawienia", "kiedy nie mogą przyjąć
 * od razu".
 *
 * Insieme does not detox on site: it qualifies the patient (psychiatrist) and
 * organises detox at a partner private ward — the same line as
 * `programPageDefaults.detoxNote`. Keep the two in step.
 *
 * ⚠️ Placeholder copy with medical content (withdrawal timing, seizures,
 * delirium, benzodiazepines). Needs the DOCTOR's review, not only the
 * therapist's, plus the lawyer's (art. 14) before launch. Photos are the
 * site's placeholders.
 */
export const detoksIKwalifikacjaDefaults: IntentPageContent = {
  path: "/detoks-i-kwalifikacja",
  metaTitle: "Detoks i kwalifikacja do terapii uzależnień | Insieme",
  metaDescription:
    "Kiedy przed terapią potrzebny jest detoks, dlaczego odstawienie alkoholu lub leków na własną rękę bywa groźne i jak wygląda kwalifikacja lekarska.",
  breadcrumbHome: "Strona główna",
  breadcrumbLabel: "Detoks i kwalifikacja",

  intro: {
    title: "Detoks i kwalifikacja — co dzieje się przed terapią",
    lead: [
      "Zanim zacznie się terapia, trzeba sprawdzić, czy można ją rozpocząć bezpiecznie. Czasem wystarczy rozmowa i ocena lekarska, a czasem najpierw potrzebny jest detoks.",
      "Wyjaśniamy, kiedy detoks jest konieczny, dlaczego nie warto odstawiać na własną rękę i jak wygląda droga od pierwszego telefonu do dnia przyjęcia.",
    ],
    summaryTitle: "W skrócie",
    summary: [
      "Detoks to leczenie objawów odstawienia pod nadzorem medycznym. Nie zastępuje terapii — przygotowuje do niej.",
      "Nagłe przerwanie długotrwałego picia albo przyjmowania leków uspokajających może grozić drgawkami i majaczeniem.",
      "O tym, czy detoks jest potrzebny, decyduje lekarz na podstawie wywiadu i stanu zdrowia.",
    ],
    image: {
      src: "/placeholder/pokoj.webp",
      alt: "Jasny pokój w ośrodku z oknem na las",
    },
  },

  explain: {
    id: "kiedy-detoks",
    meta: "Kiedy jest potrzebny",
    title: "Czym jest detoks i kiedy jest konieczny",
    intro: [
      "Detoksykacja, czyli leczenie zespołu abstynencyjnego, to czas, w którym organizm przestawia się na funkcjonowanie bez substancji — pod nadzorem lekarza, który łagodzi objawy i pilnuje bezpieczeństwa.",
      "Nie każdy go potrzebuje. Jeśli picie było okresowe, a po przerwie nie pojawiają się objawy odstawienia, terapię często można zacząć bez detoksu. Decyzję zawsze podejmuje lekarz.",
    ],
    pointsTitle: "Detoks jest zwykle wskazany, gdy",
    points: [
      { body: "picie trwa codziennie albo w ciągach przez wiele dni" },
      {
        body: "po kilku godzinach bez alkoholu pojawiają się drżenie, poty, kołatanie serca, nudności lub silny lęk",
      },
      { body: "w przeszłości wystąpiły drgawki albo majaczenie alkoholowe" },
      { body: "alkohol łączony jest z lekami uspokajającymi lub nasennymi" },
      {
        body: "przyjmowane są benzodiazepiny, opioidy lub inne substancje, których nie wolno odstawiać nagle",
      },
      { body: "występują poważne choroby, np. serca, wątroby, cukrzyca albo padaczka" },
    ],
  },

  steps: {
    id: "kwalifikacja",
    label: "Kwalifikacja",
    title: "Jak wygląda kwalifikacja do terapii w Insieme",
    lead: [
      "Kwalifikacja odpowiada na dwa pytania: czy terapię można zacząć bezpiecznie i czy proponowana forma leczenia jest odpowiednia. Prowadzi ją lekarz psychiatra, a zaczyna się od rozmowy telefonicznej.",
    ],
    steps: [
      {
        title: "Rozmowa telefoniczna",
        body: "Pytamy o to, czego i jak długo używasz, kiedy ostatnio, o przyjmowane leki, choroby i wcześniejsze leczenie. Nie musisz znać odpowiedzi na wszystko.",
      },
      {
        title: "Ocena lekarska",
        body: "Lekarz psychiatra ocenia stan zdrowia i ryzyko powikłań odstawienia. Na tej podstawie decyduje, czy potrzebny jest detoks, czy można od razu zacząć terapię.",
      },
      {
        title: "Detoks, jeśli jest potrzebny",
        body: "Pomagamy go zorganizować na prywatnym oddziale detoksykacyjnym, z którym współpracujemy.",
      },
      {
        title: "Termin przyjęcia",
        body: "Ustalamy datę, wyjaśniamy, jak się przygotować, i prosimy o dokumentację z wcześniejszego leczenia, jeśli ją masz.",
      },
    ],
    link: { label: "Co zabrać i jak dojechać", href: "/osrodek#dojazd" },
  },

  statement: {
    id: "odstawienie",
    label: "Bezpieczeństwo",
    statement:
      "Odstawienie na własną rękę bywa groźne — powikłań nie da się przewidzieć w domu.",
    body: [
      "Objawy odstawienia alkoholu pojawiają się zwykle w ciągu kilku do kilkunastu godzin od ostatniego picia i nasilają się przez kolejne dwie, trzy doby. U większości osób są przykre, ale przemijają. U części pojawiają się jednak powikłania.",
    ],
    points: [
      {
        title: "Drgawki",
        body: "Zdarzają się najczęściej w pierwszych 48 godzinach od odstawienia — także u osób, które wcześniej ich nie miały.",
      },
      {
        title: "Majaczenie alkoholowe",
        body: "Delirium tremens: dezorientacja, omamy, silne pobudzenie, gorączka. Rozwija się zwykle w drugiej–czwartej dobie i jest stanem zagrożenia życia.",
      },
      {
        title: "Leki uspokajające",
        body: "Benzodiazepiny odstawia się powoli, według planu lekarza. Nagłe przerwanie może wywołać drgawki i ciężkie objawy psychiczne.",
      },
    ],
    closing:
      "Jeśli w trakcie odstawienia pojawiają się drgawki, omamy, splątanie albo ból w klatce piersiowej, dzwoń pod 112.",
  },

  cards: {
    id: "gdy-trzeba-poczekac",
    label: "Inna kolejność",
    title: "Kiedy przyjęcie nie jest możliwe od razu",
    lead: "Czasem lekarz uzna, że najpierw potrzebna jest inna pomoc. To też część rzetelnej kwalifikacji — nie odmowa leczenia, tylko inna kolejność.",
    cards: [
      {
        title: "Najpierw detoks",
        body: "Objawy odstawienia trzeba opanować, zanim będzie można bezpiecznie zacząć terapię.",
      },
      {
        title: "Leczenie szpitalne",
        body: "Stan zdrowia — np. ciężka choroba wątroby lub serca — wymaga najpierw opieki w szpitalu.",
      },
      {
        title: "Leczenie psychiatryczne",
        body: "Objawy takie jak ostra psychoza czy myśli samobójcze trzeba najpierw leczyć psychiatrycznie.",
      },
      {
        title: "Brak wolnego miejsca",
        body: "W grupie nie ma w tej chwili miejsca. Ustalamy najbliższy możliwy termin.",
      },
    ],
    note: "W każdej z tych sytuacji powiemy, co możesz zrobić w międzyczasie i gdzie szukać pomocy. Jeśli myśli samobójcze pojawiają się teraz, zadzwoń pod 112 albo 116 123 — telefon zaufania dla dorosłych w kryzysie emocjonalnym.",
  },

  feature: {
    id: "detoks-przed-insieme",
    label: "Detoks przed Insieme",
    title: "Jak organizujemy detoks",
    body: [
      "Insieme nie prowadzi detoksu na miejscu. Jeśli lekarz uzna, że jest potrzebny, pomagamy go zorganizować na prywatnym oddziale detoksykacyjnym, z którym współpracujemy.",
      "Termin przyjęcia do Insieme ustalamy jeszcze przed detoksem, żeby przerwa między nimi była jak najkrótsza — to moment, w którym szczególnie łatwo wrócić do picia.",
    ],
    image: {
      src: "/placeholder/dom-staw.webp",
      alt: "Dom ośrodka widziany zza stawu, w otoczeniu sosen",
    },
    points: [
      {
        title: "Co obejmuje",
        body: "Opiekę lekarską i pielęgniarską, leki łagodzące objawy, nawadnianie, uzupełnianie witamin (zwłaszcza tiaminy) i stałą obserwację.",
      },
      {
        title: "Ile trwa",
        body: "Przy alkoholu zwykle od kilku do kilkunastu dni; przy lekach uspokajających dłużej. O zakończeniu decyduje stan pacjenta, nie kalendarz.",
      },
    ],
    link: { label: "Zobacz program terapii", href: "/program" },
  },

  faq: {
    label: "Pytania",
    title: "Pytania o detoks",
    lead: "Jeśli nie wiesz, czy detoks jest w Twojej sytuacji potrzebny, zadzwoń — pomożemy to ocenić.",
    category: "detoks",
  },
  related: {
    label: "Czytaj dalej",
    title: "Powiązane tematy",
    linkLabel: "Czytaj",
    links: [
      {
        title: "Leczenie alkoholizmu",
        body: "Z czego składa się leczenie po detoksie i jak wybrać ośrodek.",
        href: "/leczenie-alkoholizmu",
      },
      {
        title: "Dla rodziny",
        body: "Jak pomóc bliskiej osobie, która nie chce się leczyć.",
        href: "/dla-rodziny",
      },
      {
        title: "Odwyk na NFZ",
        body: "Jak wygląda detoks i terapia w ramach NFZ.",
        href: NFZ_ARTICLE_HREF,
      },
    ],
  },
  call: {
    title: "Nie wiesz, czy potrzebny jest detoks?",
    body: "Opowiedz nam, jak wygląda sytuacja. Pomożemy ocenić, od czego zacząć — rozmowa jest bezpłatna i niezobowiązująca.",
    ctaLabel: "Zadzwoń",
  },
};
