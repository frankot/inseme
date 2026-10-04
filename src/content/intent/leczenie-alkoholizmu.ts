import { NFZ_ARTICLE_HREF } from "@/content/artykul-nfz";

import type { IntentPageContent } from "./types";

/**
 * /leczenie-alkoholizmu — the hub of the alcohol topic cluster (SEO strategy
 * §3.5). Intent: "leczenie alkoholizmu prywatnie", "odwyk Warszawa", "czy to
 * już uzależnienie", "esperal".
 *
 * Deliberately not a retelling of /program: the programme gets the feature
 * slot and a link. The rest is what /program does not cover — how dependence
 * is recognised, what treatment is made of in general, medication, choosing a
 * place.
 *
 * ⚠️ Placeholder copy. Needs a therapist's read, the doctor's read of the
 * medication band, and the lawyer's (art. 14) before launch. Photos are the
 * site's placeholders.
 */
export const leczenieAlkoholizmuDefaults: IntentPageContent = {
  path: "/leczenie-alkoholizmu",
  metaTitle: "Leczenie alkoholizmu pod Warszawą — objawy, terapia, leki | Insieme",
  metaDescription:
    "Po czym poznać uzależnienie od alkoholu, z czego składa się leczenie, co mogą leki i Esperal, jak wybrać ośrodek. Terapia stacjonarna w Magdalence.",
  breadcrumbHome: "Strona główna",
  breadcrumbLabel: "Leczenie alkoholizmu",

  intro: {
    title: "Leczenie alkoholizmu — jak rozpoznać problem i jak wygląda terapia",
    lead: [
      "Uzależnienie od alkoholu to choroba, a nie brak silnej woli. Ma swoje objawy, przebieg i metody leczenia — podstawą jest psychoterapia uzależnień, czasem wspierana leczeniem farmakologicznym.",
      "Wyjaśniamy, po czym poznać, że picie przestało być wyborem, z czego składa się leczenie i o co zapytać, zanim wybierzesz miejsce terapii.",
    ],
    summaryTitle: "W skrócie",
    summary: [
      "Uzależnienie rozpoznaje lekarz lub terapeuta na podstawie kryteriów diagnostycznych, a nie liczby wypitych butelek.",
      "Podstawą leczenia jest psychoterapia uzależnień. Leki mogą ją wspierać, ale jej nie zastępują.",
      "Jeśli odstawienie alkoholu grozi powikłaniami, leczenie zaczyna się od detoksu pod opieką lekarza.",
    ],
    image: {
      src: "/placeholder/salon-terapeutyczny.webp",
      alt: "Salon terapeutyczny ośrodka z fotelami i widokiem na las",
      caption: "Salon, w którym codziennie spotyka się grupa terapeutyczna.",
    },
  },

  explain: {
    id: "objawy",
    meta: "Rozpoznanie",
    title: "Kiedy picie staje się uzależnieniem",
    intro: [
      "Granica rzadko jest wyraźna. Wiele osób przez lata pije „jak wszyscy”, a zmiana przychodzi stopniowo — alkohol z czegoś, po co się sięga, staje się czymś, bez czego trudno funkcjonować.",
      "Lekarze i terapeuci korzystają z kryteriów diagnostycznych. O uzależnieniu mówi się, gdy w ciągu ostatniego roku przez dłuższy czas występowały co najmniej trzy z sześciu objawów wymienionych obok.",
    ],
    pointsTitle: "Objawy uzależnienia",
    points: [
      {
        title: "Silna potrzeba picia",
        body: "Głód alkoholowy: przymus, napięcie, myśli, które wracają do picia.",
      },
      {
        title: "Utrata kontroli",
        body: "Trudno przewidzieć, kiedy picie się zacznie, ile go będzie i kiedy się skończy.",
      },
      {
        title: "Objawy odstawienia",
        body: "Drżenie rąk, poty, niepokój i bezsenność po przerwaniu picia — oraz sięganie po alkohol, żeby je złagodzić.",
      },
      {
        title: "Zmiana tolerancji",
        body: "Żeby poczuć ten sam efekt, potrzeba coraz więcej alkoholu.",
      },
      {
        title: "Zaniedbywanie innych spraw",
        body: "Coraz więcej czasu zajmuje picie i dochodzenie do siebie. Zainteresowania, obowiązki i relacje schodzą na dalszy plan.",
      },
      {
        title: "Picie mimo szkód",
        body: "Alkohol szkodzi zdrowiu, pracy lub rodzinie, a picie trwa, choć te skutki są widoczne.",
      },
    ],
    closing: [
      "Nie musisz samodzielnie stawiać sobie diagnozy. Test przesiewowy pomoże ocenić ryzyko, a rozmowa ze specjalistą — ustalić, co się dzieje.",
    ],
    link: { label: "Wypełnij test przesiewowy AUDIT", href: "/testy" },
  },

  steps: {
    id: "leczenie",
    label: "Metody leczenia",
    title: "Z czego składa się leczenie",
    lead: [
      "Nie każdy potrzebuje wszystkich etapów — od czego zacząć, zależy od stanu zdrowia, przebiegu picia i sytuacji życiowej. Najważniejsza jest terapia: to w niej zmienia się sposób reagowania na emocje i radzenia sobie z głodem alkoholowym.",
    ],
    steps: [
      {
        title: "Diagnoza i kwalifikacja",
        body: "Rozmowa z lekarzem i terapeutą: jak długo i jak intensywnie trwa picie, czy były objawy odstawienia, jakie są choroby współistniejące i przyjmowane leki.",
      },
      {
        title: "Detoks, jeśli jest potrzebny",
        body: "Bezpieczne przejście przez odstawienie pod opieką medyczną. Detoks przygotowuje do leczenia, ale nim nie jest.",
      },
      {
        title: "Psychoterapia uzależnień",
        body: "Praca grupowa i indywidualna prowadzona przez specjalistów psychoterapii uzależnień — trzon leczenia, w trybie stacjonarnym albo ambulatoryjnym.",
      },
      {
        title: "Kontynuacja i zapobieganie nawrotom",
        body: "Po intensywnym etapie leczenie trwa dalej: terapia ambulatoryjna, grupy wsparcia, plan na sytuacje ryzyka.",
      },
    ],
    link: { label: "Kiedy potrzebny jest detoks", href: "/detoks-i-kwalifikacja" },
  },

  statement: {
    id: "leki",
    label: "Esperal i leki",
    statement:
      "Leki mogą być pomocne jako część planu leczenia. Same w sobie nie są planem.",
    body: [
      "Wiele rodzin zaczyna od pytania o wszywkę. To zrozumiałe: wydaje się prostym rozwiązaniem trudnego problemu.",
      "Disulfiram (Esperal) nie zmniejsza głodu alkoholowego. Sprawia, że picie po jego przyjęciu wywołuje silne, nieprzyjemne i potencjalnie groźne objawy — działa więc odstraszająco, dopóki ktoś sam chce go stosować.",
    ],
    points: [
      {
        title: "Nie leczy uzależnienia",
        body: "Nie zmienia przyczyn picia ani sposobu radzenia sobie z emocjami. Bez terapii problem zwykle wraca, gdy działanie leku mija.",
      },
      {
        title: "Wymaga badania i zgody",
        body: "Decyzję podejmuje lekarz po badaniu, a pacjent musi wiedzieć, co przyjmuje. Podawanie leku bez wiedzy osoby pijącej jest niebezpieczne.",
      },
      {
        title: "Są też inne leki",
        body: "Niektóre, np. naltrekson czy akamprozat, mogą zmniejszać głód alkoholowy. Ich dobór zależy od stanu zdrowia i zawsze należy do lekarza.",
      },
    ],
  },

  cards: {
    id: "wybor-osrodka",
    label: "Wybór miejsca",
    title: "Jak wybrać ośrodek leczenia uzależnień",
    lead: "Różnice między ośrodkami nie zawsze widać na pierwszy rzut oka. Sześć pytań pomaga je porównać — niezależnie od tego, czy wybierasz leczenie prywatne, czy w ramach NFZ.",
    cards: [
      {
        title: "Czy to podmiot leczniczy?",
        body: "Sprawdź wpis w rejestrze RPWDL. Placówka, która leczy uzależnienia, powinna w nim figurować.",
      },
      {
        title: "Kto prowadzi terapię?",
        body: "Zapytaj, czy terapię prowadzą certyfikowani specjaliści psychoterapii uzależnień i kto sprawuje opiekę lekarską.",
      },
      {
        title: "Jak wygląda kwalifikacja?",
        body: "Czy przed przyjęciem rozmawia z Tobą lekarz i co się dzieje, jeśli potrzebny jest detoks.",
      },
      {
        title: "Ile trwa pobyt i jaka jest grupa?",
        body: "Długość programu, liczba osób w grupie i liczba sesji indywidualnych mówią więcej niż opis wnętrz.",
      },
      {
        title: "Co po wyjściu?",
        body: "Najtrudniejsze bywają pierwsze miesiące w domu. Zapytaj o dalszą terapię i o wsparcie dla rodziny.",
      },
      {
        title: "Co obejmuje cena?",
        body: "Poproś o konkretną kwotę przed przyjazdem i zapytaj, co jest w niej zawarte, a co płatne osobno.",
      },
    ],
    link: { label: "Leczenie bezpłatne — odwyk na NFZ", href: NFZ_ARTICLE_HREF },
  },

  feature: {
    id: "w-insieme",
    label: "W Insieme",
    title: "Jak leczymy uzależnienie od alkoholu w Insieme",
    body: [
      "Leczenie zaczyna się od rozmowy telefonicznej i kwalifikacji przez lekarza psychiatrę. Jeśli potrzebny jest detoks, pomagamy go zorganizować na współpracującym prywatnym oddziale.",
      "Potem przez minimum 28 dni pracujesz w małej grupie w Magdalence pod Warszawą, a po powrocie do domu kontynuujesz terapię w programie ambulatoryjnym.",
    ],
    image: {
      src: "/placeholder/rozmowa.webp",
      alt: "Rozmowa indywidualna z terapeutą w gabinecie",
    },
    facts: [
      { value: "28 dni", label: "Minimum stacjonarnie" },
      { value: "8–12", label: "Osób w grupie" },
      { value: "12–13 mies.", label: "Program ambulatoryjny" },
      { value: "Psychiatra", label: "Kwalifikacja" },
    ],
    link: { label: "Zobacz program terapii", href: "/program" },
  },

  faq: {
    label: "Pytania",
    title: "Pytania o leczenie alkoholizmu",
    lead: "Odpowiedzi na pytania, które słyszymy najczęściej. Jeśli nie ma tu Twojego — zadzwoń.",
    category: "alkohol",
  },
  related: {
    label: "Czytaj dalej",
    title: "Powiązane tematy",
    linkLabel: "Czytaj",
    links: [
      {
        title: "Detoks i kwalifikacja",
        body: "Kiedy przed terapią potrzebny jest detoks i jak wygląda kwalifikacja lekarska.",
        href: "/detoks-i-kwalifikacja",
      },
      {
        title: "Dla rodziny",
        body: "Co możesz zrobić, gdy pije ktoś bliski — także wtedy, gdy nie chce się leczyć.",
        href: "/dla-rodziny",
      },
      {
        title: "Odwyk na NFZ",
        body: "Skierowanie, czas oczekiwania i różnice wobec leczenia prywatnego.",
        href: NFZ_ARTICLE_HREF,
      },
    ],
  },
  call: {
    title: "Porozmawiaj o swojej sytuacji",
    body: "Rozmowa jest bezpłatna, nie wymaga podawania nazwiska i nie zobowiązuje do przyjazdu.",
    ctaLabel: "Zadzwoń",
  },
};
