/**
 * The /program page: the stages of treatment, each first as a card in the
 * overview and then at length in a band of its own.
 *
 * One object per stage carries both — the card's short copy and the band's
 * long one — so the overview and the detail cannot drift apart. The `id` is
 * the band's anchor and the card's link target; `rodzina` is linked from the
 * homepage's family path, so it stays.
 *
 * The day plan lives in `content/home.ts` (`jedenDzienDefaults`), next to the
 * rest of the shared section copy.
 */

/** One line of a stage's list. Titled points read as numbered rows. */
export type ProgramPoint = { title?: string; body: string };

/**
 * The long-form band on its own — what `ProgramStageBand` renders. The intent
 * pages (`content/intent/*`) are built from the same bands, without the card.
 */
export type StageBand = {
  id: string;
  title: string;
  /** Under the band's eyebrow — the length, where the stage has one. */
  meta?: string;
  /** First paragraph is set large, the rest as body copy. */
  intro: string[];
  pointsTitle?: string;
  points: ProgramPoint[];
  /** After the list: what the stage is for, said once more. */
  closing?: string[];
  /** A quiet link closing the band — where to read further. */
  link?: { label: string; href: string };
};

export type ProgramStage = StageBand & {
  /** Overview card. */
  cardTitle: string;
  cardMeta: string;
  summary: string;
};

export type ProgramPageContent = {
  metaTitle: string;
  metaDescription: string;
  breadcrumbHome: string;
  breadcrumbLabel: string;
  title: string;
  lead: string;
  body: string;
  /** Under the overview cards. */
  detoxNote: string;
  detoxLink: { label: string; href: string };
  cardLinkLabel: string;
  stages: ProgramStage[];
};

export const programPageDefaults: ProgramPageContent = {
  metaTitle:
    "Program leczenia — terapia stacjonarna, ambulatoryjna, wsparcie dla bliskich | Insieme",
  metaDescription:
    "Etapy leczenia w Insieme: minimum 28 dni terapii stacjonarnej, ok. 12–13 miesięcy programu ambulatoryjnego, wsparcie dla rodziny i Program Rozwoju Osobistego PRO. Plan dnia w ośrodku.",
  breadcrumbHome: "Strona główna",
  breadcrumbLabel: "Program",
  title: "Leczenie w Insieme ma kilka etapów",
  lead: "Celem leczenia jest nie tylko zatrzymanie używania, ale przede wszystkim trwała zmiana sposobu funkcjonowania i stopniowa poprawa jakości życia. Dlatego w Insieme patrzymy na terapię jako na cały proces.",
  body: "Zaczynamy od intensywnej pracy stacjonarnej, a następnie wspieramy pacjenta w przenoszeniu zmian do codziennego życia. Ważnym elementem tego procesu jest również praca z osobami najbliższymi.",
  detoxNote:
    "Jeśli przed rozpoczęciem terapii potrzebna jest detoksykacja, pomagamy w organizacji leczenia na prywatnym oddziale detoksykacyjnym, z którym współpracujemy.",
  detoxLink: {
    label: "Kiedy potrzebny jest detoks",
    href: "/detoks-i-kwalifikacja",
  },
  cardLinkLabel: "Więcej",
  stages: [
    {
      id: "stacjonarny",
      cardTitle: "Program stacjonarny",
      cardMeta: "minimum 28 dni",
      summary:
        "Intensywna praca terapeutyczna w uporządkowanym, bezpiecznym środowisku. To czas na zatrzymanie uzależnienia, zrozumienie jego mechanizmów i rozpoczęcie realnej zmiany.",
      title: "Program stacjonarny",
      meta: "28 dni",
      intro: [
        "W Insieme kierujemy się zasadą, że każda minuta w ośrodku stanowi terapię. Praca nie kończy się wraz z wyjściem z sali terapeutycznej — obejmuje również relacje, codzienne obowiązki, sposób reagowania na emocje, przyjmowanie informacji zwrotnej i funkcjonowanie w grupie.",
        "Pobyt daje czas na zatrzymanie uzależnienia, zrozumienie jego mechanizmów i rozpoczęcie zmiany w bezpiecznym, uporządkowanym środowisku.",
      ],
      pointsTitle: "Nad czym pracujemy",
      points: [
        {
          title: "Mechanizmy uzależnienia",
          body: "Poznajesz jego objawy, konsekwencje i schematy, które podtrzymywały problem.",
        },
        {
          title: "Emocje i głód",
          body: "Uczysz się rozpoznawać emocje, potrzeby i sytuacje ryzyka oraz inaczej na nie reagować.",
        },
        {
          title: "Myślenie i zachowanie",
          body: "Przyglądasz się utrwalonym sposobom funkcjonowania i uczysz się stopniowo je zmieniać.",
        },
        {
          title: "Relacje i komunikacja",
          body: "Grupa, informacja zwrotna i codzienne funkcjonowanie z innymi pomagają rozwijać nowe umiejętności.",
        },
        {
          title: "Zdrowe nawyki",
          body: "Uporządkowany rytm dnia, aktywność, odpowiedzialność i dbanie o siebie stają się częścią procesu.",
        },
        {
          title: "Plan dalszego zdrowienia",
          body: "Przygotowujesz się do powrotu do domu, relacji, pracy i codziennych obowiązków.",
        },
      ],
      closing: [
        "Celem nie jest dobre funkcjonowanie tylko podczas 28 dni w ośrodku. Pobyt ma przygotować Cię do dalszej zmiany, którą będziesz kontynuować już w swoim codziennym życiu.",
      ],
    },
    {
      id: "ambulatoryjny",
      cardTitle: "Program ambulatoryjny",
      cardMeta: "ok. 12–13 miesięcy",
      summary:
        "Wsparcie po powrocie do codzienności. Pomagamy wdrażać wypracowane zmiany w relacjach, pracy i codziennych sytuacjach oraz utrwalać nowe sposoby funkcjonowania.",
      title: "Program ambulatoryjny",
      meta: "ok. 12–13 miesięcy",
      intro: [
        "Pobyt stacjonarny daje solidne przygotowanie do zmiany. Po wyjściu zaczyna się jednak kolejny ważny etap — wdrażanie jej w codziennym życiu.",
        "Wracają relacje, praca, obowiązki, stres i sytuacje, które wcześniej mogły prowadzić do używania. Program ambulatoryjny daje bieżące wsparcie właśnie wtedy, gdy pojawiają się realne wyzwania.",
      ],
      pointsTitle: "Program obejmuje",
      points: [
        { body: "terapię grupową raz w tygodniu" },
        { body: "minimum dwie sesje indywidualne w miesiącu" },
        { body: "bieżącą pracę nad sytuacjami z codziennego życia" },
        {
          body: "dalszą pracę nad emocjami, potrzebami, relacjami i schematami zachowania",
        },
        { body: "wzmacnianie umiejętności radzenia sobie z trudnościami" },
        {
          body: "rozpoznawanie sytuacji ryzyka i pracę nad zapobieganiem nawrotom",
        },
      ],
      closing: [
        "To etap, na którym wypracowane podczas pobytu zmiany są sprawdzane, korygowane i utrwalane w realnym życiu — przy stałym wsparciu terapeutycznym.",
      ],
    },
    {
      id: "rodzina",
      cardTitle: "Wsparcie dla bliskich",
      cardMeta: "na każdym etapie",
      summary:
        "Pomoc dla osób najbliższych przed rozpoczęciem leczenia, w trakcie pobytu i po jego zakończeniu. Wspieramy w lepszym rozumieniu sytuacji, stawianiu granic i przygotowaniu do życia po terapii.",
      title: "Wsparcie dla rodziny i osób najbliższych",
      meta: "na każdym etapie",
      intro: [
        "Uzależnienie wpływa również na życie osób najbliższych. Dlatego wsparcie oferujemy zarówno przed rozpoczęciem leczenia, podczas pobytu pacjenta, jak i w przygotowaniu do jego powrotu.",
      ],
      points: [
        {
          title: "Interwencja kryzysowa",
          body: "Jeśli bliska osoba nie chce podjąć leczenia, możesz spotkać się z terapeutą uzależnień bez jej udziału. Wspólnie przyjrzymy się sytuacji i przygotujemy konkretny plan rozmowy — jak mówić o problemie, komunikować swoje granice i zaproponować pomoc.",
        },
        {
          title: "Wsparcie w trakcie pobytu",
          body: "Pomagamy odnaleźć się w nowej sytuacji, lepiej zrozumieć uzależnienie i zadbać również o własne potrzeby. Pokazujemy, jak wspierać bliską osobę, nie przejmując odpowiedzialności za jej proces zdrowienia.",
        },
        {
          title: "Przygotowanie do powrotu",
          body: "Rozmawiamy o tym, czego można spodziewać się po zakończeniu pobytu, jak wspierać wprowadzane zmiany oraz gdzie przebiega granica między pomocą a odpowiedzialnością osoby zdrowiejącej za własną trzeźwość.",
        },
      ],
      link: {
        label: "Jak pomóc bliskiej osobie, która nie chce się leczyć",
        href: "/dla-rodziny",
      },
    },
    {
      id: "pro",
      cardTitle: "Program Rozwoju Osobistego PRO",
      cardMeta: "program wyjazdowy na Mazurach",
      summary:
        "Pogłębiona praca nad sobą w formie wyjazdowych warsztatów na Mazurach. Program pomaga lepiej poznać siebie, rozwijać umiejętność regulowania emocji, budowania relacji i świadomego kierowania własnym życiem.",
      title: "Program Rozwoju Osobistego PRO",
      meta: "program wyjazdowy na Mazurach",
      intro: [
        "PRO to pogłębiony etap pracy dla osób, które chcą dalej rozwijać zmiany rozpoczęte w terapii. Program prowadzony jest przez Leszka Kaplera w formie kilkudniowych zjazdów w kameralnym ośrodku na Mazurach.",
      ],
      pointsTitle: "Nad czym pracujemy",
      points: [
        { body: "lepszym rozumieniem siebie, swoich potrzeb i osobistych trudności" },
        { body: "regulowaniem emocji i radzeniem sobie ze stresem" },
        { body: "samokontrolą i uważnością" },
        { body: "relacjami i komunikacją" },
        { body: "poczuciem własnej wartości i tożsamością" },
        { body: "wartościami, celami i kierunkiem dalszego rozwoju" },
      ],
      closing: [
        "Program łączy pracę grupową i indywidualną z treningami oraz warsztatami rozwojowymi. Zjazdy trwają zwykle 4–6 dni, a cały cykl może obejmować 6–12 miesięcy.",
        "To przestrzeń nie tylko do utrzymywania zmiany, ale również do dalszego rozwoju i świadomego budowania jakości życia.",
      ],
    },
  ],
};
