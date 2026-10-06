import { NFZ_ARTICLE_HREF } from "@/content/artykul-nfz";

import type { IntentPageContent } from "./types";

/**
 * /leczenie-narkomanii — the drug topic's hub, pulled forward from phase 2
 * (docs/SEO_LAUNCH_PLAN.md §4.1) because the old site ranked for "odwyk
 * narkotykowy" and `/odwyk-narkotykowy/` 308s here. Intent: "odwyk narkotykowy
 * Warszawa", "leczenie narkomanii prywatnie", "ośrodek dla narkomanów".
 *
 * Built from the old page (cognitive-behavioural therapy, help with
 * co-occurring depression and anxiety, comfort and calm) and the alcohol
 * page's structure. Keeps "odwyk narkotykowy" in the title and lead: it is
 * the phrase people search for, even though "leczenie" reads better.
 *
 * ⚠️ Placeholder copy. Needs a therapist's read, the doctor's read of the
 * detox and medication lines, and the lawyer's (art. 14) before launch.
 * Photos are the site's placeholders.
 */
export const leczenieNarkomaniiDefaults: IntentPageContent = {
  path: "/leczenie-narkomanii",
  metaTitle: "Odwyk narkotykowy pod Warszawą — leczenie narkomanii | Insieme",
  metaDescription:
    "Leczenie uzależnienia od narkotyków i dopalaczy: objawy, kwalifikacja, detoks, terapia stacjonarna w małej grupie. Ośrodek Insieme w Magdalence pod Warszawą.",
  breadcrumbHome: "Strona główna",
  breadcrumbLabel: "Leczenie narkomanii",

  intro: {
    title: "Odwyk narkotykowy — jak wygląda leczenie uzależnienia od narkotyków",
    lead: [
      "Przyznanie przed sobą, że potrzebujesz pomocy, to ogromny krok. Uzależnienie od narkotyków jest chorobą — ma swoje objawy, przebieg i metody leczenia, a podstawą jest psychoterapia uzależnień.",
      "Wyjaśniamy, po czym poznać uzależnienie, od czego zaczyna się leczenie i jak wygląda odwyk narkotykowy w ośrodku Insieme w Magdalence pod Warszawą.",
    ],
    summaryTitle: "W skrócie",
    summary: [
      "Uzależnienie rozpoznaje lekarz lub terapeuta na podstawie objawów, a nie rodzaju czy ilości przyjmowanej substancji.",
      "Podstawą leczenia jest psychoterapia uzależnień, w Insieme prowadzona w nurcie poznawczo-behawioralnym.",
      "Przy niektórych substancjach odstawienie wymaga opieki lekarza — wtedy leczenie zaczyna się od detoksu.",
      "Często razem z uzależnieniem leczy się też depresję i lęk, które mu towarzyszą.",
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
    title: "Kiedy branie staje się uzależnieniem",
    intro: [
      "Wiele osób zaczyna od „okazjonalnie” — na imprezie, żeby się skupić, odprężyć albo zasnąć. Zmiana przychodzi stopniowo: substancja z czegoś, po co się sięga, staje się czymś, bez czego trudno funkcjonować.",
      "Kryteria są te same dla marihuany, stymulantów, opioidów, dopalaczy i leków. O uzależnieniu mówi się, gdy w ciągu ostatniego roku przez dłuższy czas występowały co najmniej trzy z objawów wymienionych obok.",
    ],
    pointsTitle: "Objawy uzależnienia",
    points: [
      {
        title: "Silna potrzeba brania",
        body: "Głód substancji: przymus, napięcie, myśli, które wracają do kolejnej dawki.",
      },
      {
        title: "Utrata kontroli",
        body: "Trudno przewidzieć, kiedy branie się zacznie, ile go będzie i kiedy się skończy.",
      },
      {
        title: "Objawy odstawienia",
        body: "Niepokój, rozdrażnienie, bezsenność, spadek nastroju albo objawy fizyczne po przerwaniu — i sięganie po substancję, żeby je złagodzić.",
      },
      {
        title: "Zmiana tolerancji",
        body: "Żeby poczuć ten sam efekt, potrzeba coraz więcej albo coraz częściej.",
      },
      {
        title: "Zaniedbywanie innych spraw",
        body: "Coraz więcej czasu zajmuje zdobywanie, branie i dochodzenie do siebie. Praca, nauka i relacje schodzą na dalszy plan.",
      },
      {
        title: "Branie mimo szkód",
        body: "Substancja szkodzi zdrowiu, psychice, pracy lub rodzinie, a branie trwa, choć te skutki są widoczne.",
      },
    ],
    closing: [
      "Nie musisz samodzielnie stawiać sobie diagnozy. Test przesiewowy pomoże ocenić ryzyko, a rozmowa ze specjalistą — ustalić, co się dzieje.",
    ],
    link: { label: "Wypełnij test przesiewowy", href: "/testy" },
  },

  steps: {
    id: "leczenie",
    label: "Metody leczenia",
    title: "Z czego składa się leczenie",
    lead: [
      "Od czego zacząć, zależy od substancji, czasu i sposobu przyjmowania, stanu zdrowia i sytuacji życiowej. Najważniejsza jest terapia: to w niej zmienia się sposób reagowania na emocje, stres i głód substancji.",
    ],
    steps: [
      {
        title: "Diagnoza i kwalifikacja",
        body: "Rozmowa z lekarzem i terapeutą: jakie substancje, jak długo i jak często, czy były objawy odstawienia, jakie są choroby współistniejące i przyjmowane leki.",
      },
      {
        title: "Detoks, jeśli jest potrzebny",
        body: "Bezpieczne przejście przez odstawienie pod opieką medyczną — szczególnie przy opioidach i lekach uspokajających. Detoks przygotowuje do leczenia, ale nim nie jest.",
      },
      {
        title: "Psychoterapia uzależnień",
        body: "Praca grupowa i indywidualna w nurcie poznawczo-behawioralnym, prowadzona przez specjalistów psychoterapii uzależnień — trzon leczenia.",
      },
      {
        title: "Kontynuacja i zapobieganie nawrotom",
        body: "Po intensywnym etapie leczenie trwa dalej: terapia ambulatoryjna, grupy wsparcia, plan na sytuacje ryzyka i powrót do pracy lub nauki.",
      },
    ],
    link: { label: "Kiedy potrzebny jest detoks", href: "/detoks-i-kwalifikacja" },
  },

  statement: {
    id: "podwojna-diagnoza",
    label: "Depresja i lęk",
    statement:
      "Uzależnienie rzadko przychodzi samo. Leczymy je razem z tym, co mu towarzyszy.",
    body: [
      "U wielu osób uzależnionych od narkotyków występują też zaburzenia depresyjne lub lękowe. Czasem były wcześniej i substancja miała je łagodzić, czasem pojawiły się w wyniku brania.",
      "Jeśli leczy się tylko jedno, drugie często pociąga za sobą nawrót. Dlatego w kwalifikacji bierze udział lekarz psychiatra, a terapia obejmuje oba problemy.",
    ],
    points: [
      {
        title: "Ocena psychiatryczna",
        body: "Przed przyjęciem lekarz ocenia stan psychiczny i ustala, czy potrzebne jest leczenie farmakologiczne.",
      },
      {
        title: "Jedna terapia, dwa problemy",
        body: "W terapii uczysz się rozpoznawać, kiedy napięcie, smutek czy lęk popychają do brania, i radzić sobie z nimi inaczej.",
      },
      {
        title: "Leki tylko od lekarza",
        body: "Nie odstawiaj ani nie zmieniaj leków na własną rękę. Powiedz o nich w pierwszej rozmowie.",
      },
    ],
  },

  cards: {
    id: "substancje",
    label: "Substancje",
    title: "Z jakimi uzależnieniami się do nas zgłaszają",
    lead: "Mechanizm uzależnienia jest podobny niezależnie od substancji, ale różni się przebieg odstawienia i to, na co zwraca uwagę lekarz w kwalifikacji.",
    cards: [
      {
        title: "Marihuana",
        body: "Często bagatelizowana. Przy codziennym paleniu odstawienie daje rozdrażnienie, bezsenność i spadek nastroju.",
      },
      {
        title: "Stymulanty",
        body: "Amfetamina, kokaina, mefedron. Po odstawieniu częsty jest głęboki spadek nastroju i energii, który wymaga uwagi.",
      },
      {
        title: "Opioidy",
        body: "Odstawienie jest trudne fizycznie i zwykle wymaga detoksu pod opieką lekarza przed rozpoczęciem terapii.",
      },
      {
        title: "Dopalacze",
        body: "Skład bywa nieznany, a działanie nieprzewidywalne. W kwalifikacji ważne jest, co i jak długo było przyjmowane.",
      },
      {
        title: "Leki uspokajające i nasenne",
        body: "Benzodiazepiny i podobne leki odstawia się stopniowo, według planu lekarza — nigdy z dnia na dzień.",
      },
    ],
    link: { label: "Leczenie bezpłatne — odwyk na NFZ", href: NFZ_ARTICLE_HREF },
  },

  feature: {
    id: "w-insieme",
    label: "W Insieme",
    title: "Jak wygląda odwyk narkotykowy w Insieme",
    body: [
      "Leczenie zaczyna się od rozmowy telefonicznej i kwalifikacji przez lekarza psychiatrę. Jeśli potrzebny jest detoks, pomagamy go zorganizować na współpracującym prywatnym oddziale.",
      "Potem przez minimum 28 dni pracujesz w małej grupie w Magdalence pod Warszawą — w spokoju, z dala od miejsc i ludzi związanych z braniem — a po powrocie do domu kontynuujesz terapię w programie ambulatoryjnym.",
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
    title: "Pytania o leczenie narkomanii",
    lead: "Odpowiedzi na pytania, które słyszymy najczęściej. Jeśli nie ma tu Twojego — zadzwoń.",
    category: "narkotyki",
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
        body: "Co możesz zrobić, gdy bierze ktoś bliski — także wtedy, gdy nie chce się leczyć.",
        href: "/dla-rodziny",
      },
      {
        title: "Jak pomóc osobie uzależnionej",
        body: "Dlaczego niektóre formy pomocy oddalają decyzję o leczeniu i co działa zamiast nich.",
        href: "/porady/jak-pomoc-osobie-uzaleznionej",
      },
    ],
  },
  call: {
    title: "Porozmawiaj o swojej sytuacji",
    body: "Rozmowa jest bezpłatna, nie wymaga podawania nazwiska i nie zobowiązuje do przyjazdu.",
    ctaLabel: "Zadzwoń",
  },
};
