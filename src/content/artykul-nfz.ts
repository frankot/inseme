/**
 * The NFZ article — the one article other pages link to by URL (/cennik, the
 * footer, the intent pages). Its slug is protected (`lib/protected-articles.ts`):
 * editors can change the text in /admin/articles but not delete it, rename it
 * or unpublish it.
 *
 * This file is the seed source (`npm run seed:articles`). Once seeded, the
 * database row is what the site renders; editing here does not change a live
 * article unless the seed is re-run.
 *
 * ⚠️ Placeholder copy written from public information about the NFZ system.
 * Before launch: a therapist and the lawyer (art. 14) read it, and the
 * reviewer below is replaced with a real person.
 */

export const NFZ_ARTICLE_SLUG = "odwyk-na-nfz";
export const NFZ_ARTICLE_HREF = `/porady/${NFZ_ARTICLE_SLUG}`;

export type NfzArticleSeed = {
  slug: string;
  title: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  reviewer: string;
  /** Rich text before the step list. Sanitised by the seed. */
  html: string;
  stepsHeading: string;
  steps: { title: string; description: string }[];
  /** Rich text after the step list. */
  closingHtml: string;
  /** The FAQ category embedded at the end — rows come from `seed:faq`. */
  faqHeading: string;
  faqCategory: string;
  cta: { heading: string; text: string; buttonLabel: string; buttonHref: string };
};

export const nfzArticleSeed: NfzArticleSeed = {
  slug: NFZ_ARTICLE_SLUG,
  title: "Odwyk na NFZ — skierowanie, czas oczekiwania i przebieg leczenia",
  excerpt:
    "Czy potrzebne jest skierowanie, gdzie się zapisać, ile się czeka i czym leczenie w ramach NFZ różni się od prywatnego. Publiczna ścieżka krok po kroku.",
  metaTitle: "Odwyk na NFZ — skierowanie, czas oczekiwania, przebieg",
  metaDescription:
    "Jak zacząć leczenie uzależnienia na NFZ: poradnia bez skierowania, oddział stacjonarny, lista oczekujących, detoks. Czym różni się od leczenia prywatnego.",
  reviewer: "Marta Zielińska, terapeutka uzależnień",
  html: [
    "<p>Leczenie uzależnień w placówkach, które mają umowę z Narodowym Funduszem Zdrowia, jest dla osób ubezpieczonych bezpłatne. Dotyczy to zarówno terapii ambulatoryjnej, jak i pobytu na oddziale stacjonarnym oraz detoksu. Publiczna ścieżka bywa wolniejsza, ale program terapii opiera się na tych samych podstawach co w ośrodkach prywatnych — na psychoterapii uzależnień.</p>",
    "<p>Poniżej wyjaśniamy, od czego zacząć, kiedy potrzebne jest skierowanie i jak sprawdzić czas oczekiwania.</p>",

    "<h2>Pierwszy krok: poradnia leczenia uzależnień</h2>",
    "<p>Najprostszym początkiem jest poradnia leczenia uzależnień (czasem pod nazwą poradnia terapii uzależnienia i współuzależnienia). <strong>Do poradni nie potrzebujesz skierowania</strong> — wystarczy zadzwonić lub przyjść i umówić pierwszą wizytę.</p>",
    "<p>Na pierwszym spotkaniu terapeuta lub lekarz rozmawia o tym, jak długo i jak intensywnie trwa picie lub branie, o zdrowiu i sytuacji życiowej. Na tej podstawie proponuje formę leczenia: terapię w poradni, skierowanie na oddział stacjonarny albo — jeśli są objawy odstawienia — najpierw detoks.</p>",
    "<p>Z poradni mogą korzystać również osoby bliskie. Terapia dla członków rodziny (tzw. terapia współuzależnienia) także jest finansowana przez NFZ i również nie wymaga skierowania.</p>",

    "<h2>Kiedy potrzebne jest skierowanie</h2>",
    "<ul>",
    "<li><strong>Poradnia leczenia uzależnień</strong> — skierowanie nie jest potrzebne.</li>",
    "<li><strong>Oddział lub ośrodek stacjonarny</strong> — zwykle wymagane jest skierowanie od lekarza. Najczęściej wystawia je lekarz z poradni, ale może to zrobić także lekarz rodzinny.</li>",
    "<li><strong>Detoks w nagłej sytuacji</strong> — przy ciężkich objawach odstawienia pomoc uzyskasz przez szpitalny oddział ratunkowy lub izbę przyjęć.</li>",
    "</ul>",
    "<p>Zasady przyjęcia mogą się różnić między placówkami, dlatego wymagane dokumenty najlepiej potwierdzić telefonicznie w miejscu, które wybierzesz.</p>",

    "<h2>Ile czeka się na miejsce</h2>",
    "<p>Czas oczekiwania zależy od województwa, rodzaju świadczenia i konkretnej placówki. Na wizytę w poradni czeka się zwykle krócej; na terapię stacjonarną — od kilku tygodni do kilku miesięcy.</p>",
    "<p>Aktualne terminy sprawdzisz w oficjalnym <a href=\"https://terminyleczenia.nfz.gov.pl\" target=\"_blank\">Informatorze o terminach leczenia NFZ</a>. Wpisz rodzaj świadczenia (np. „oddział terapii uzależnienia od alkoholu” albo „poradnia leczenia uzależnień”) i województwo — wyszukiwarka pokaże placówki i pierwszy wolny termin. Informacji udziela też całodobowa Telefoniczna Informacja Pacjenta: 800 190 590.</p>",
    "<p>Na to samo świadczenie można być zapisanym tylko na jedną listę oczekujących, dlatego warto najpierw porównać terminy, a dopiero potem złożyć skierowanie. Jeśli zrezygnujesz z miejsca, poinformuj o tym placówkę — zwolni się ono dla kolejnej osoby.</p>",

    "<h2>Jak wygląda terapia stacjonarna w ramach NFZ</h2>",
    "<p>Stacjonarna terapia uzależnień w placówkach publicznych trwa zwykle od sześciu do ośmiu tygodni. Program obejmuje terapię grupową, sesje indywidualne i psychoedukację, a dzień ma stały rozkład zajęć. Grupy bywają liczniejsze niż w małych ośrodkach prywatnych, a warunki pobytu zależą od placówki.</p>",
    "<p>Obowiązuje regulamin i całkowita abstynencja — jej złamanie zwykle kończy się wypisem. Po zakończeniu pobytu zaleca się kontynuację leczenia w poradni, często w formie programu terapii pogłębionej.</p>",

    "<h2>Detoks na NFZ</h2>",
    "<p>Detoks w ramach NFZ prowadzą oddziały leczenia alkoholowych zespołów abstynencyjnych (oraz oddziały detoksykacyjne dla osób uzależnionych od innych substancji). Trwa zwykle od kilku do kilkunastu dni. Detoks łagodzi objawy odstawienia, ale nie jest leczeniem uzależnienia — po nim powinna rozpocząć się terapia.</p>",

    "<h2>NFZ czy prywatnie — czym się różnią</h2>",
    "<p>Obie ścieżki mają ten sam cel i opierają się na psychoterapii uzależnień. Różnice dotyczą głównie organizacji leczenia:</p>",
    "<ul>",
    "<li><strong>Koszt</strong> — w ramach NFZ leczenie jest bezpłatne; w ośrodku prywatnym pobyt jest płatny, a cenę warto poznać przed decyzją.</li>",
    "<li><strong>Czas oczekiwania</strong> — w placówkach publicznych bywa długi; ośrodki prywatne często mogą przyjąć w krótszym terminie.</li>",
    "<li><strong>Długość pobytu</strong> — publiczna terapia stacjonarna trwa zwykle 6–8 tygodni; programy prywatne bywają krótsze i częściej łączone z dłuższą kontynuacją ambulatoryjną.</li>",
    "<li><strong>Wielkość grupy i warunki</strong> — w małych ośrodkach grupy są zwykle mniejsze, a pokoje mniej liczne; w publicznych zależy to od placówki.</li>",
    "<li><strong>Termin i elastyczność</strong> — w prywatnym ośrodku łatwiej dopasować datę przyjęcia do sytuacji rodzinnej i zawodowej.</li>",
    "</ul>",
    "<p>Ścieżki można też łączyć — na przykład po pobycie w ośrodku prywatnym kontynuować terapię w poradni NFZ, i odwrotnie.</p>",
  ].join(""),
  stepsHeading: "Jak zacząć leczenie na NFZ — krok po kroku",
  steps: [
    {
      title: "Znajdź poradnię",
      description:
        "Wyszukaj poradnię leczenia uzależnień w Informatorze o terminach leczenia NFZ albo zapytaj pod numerem 800 190 590.",
    },
    {
      title: "Umów pierwszą wizytę",
      description:
        "Skierowanie nie jest potrzebne. Weź dowód osobisty i — jeśli masz — dokumentację z wcześniejszego leczenia.",
    },
    {
      title: "Ustal formę leczenia",
      description:
        "Terapeuta lub lekarz zaproponuje terapię w poradni, detoks albo skierowanie na oddział stacjonarny.",
    },
    {
      title: "Zapisz się na listę oczekujących",
      description:
        "Porównaj terminy w kilku placówkach, wybierz jedną i dostarcz skierowanie. Do czasu przyjęcia możesz korzystać z terapii w poradni i grup wsparcia.",
    },
    {
      title: "Kontynuuj po pobycie",
      description:
        "Po terapii stacjonarnej wróć do poradni — kontynuacja leczenia jest jego ważną częścią.",
    },
  ],
  closingHtml:
    "<p>Niezależnie od wybranej drogi najważniejsze jest, żeby nie odkładać pierwszego kroku. Jeśli chcesz porozmawiać o tym, która ścieżka będzie w Twojej sytuacji odpowiednia, możesz do nas zadzwonić — wyjaśnimy też, jak wygląda leczenie w Insieme.</p>",
  faqHeading: "Pytania o leczenie na NFZ",
  faqCategory: "nfz",
  cta: {
    heading: "Chcesz porównać możliwości?",
    text: "Zadzwoń. Opowiemy, jak wygląda leczenie w Insieme, ile kosztuje i kiedy możliwe jest przyjęcie — rozmowa jest bezpłatna i niezobowiązująca.",
    buttonLabel: "Zadzwoń: 669 916 005",
    buttonHref: "tel:+48669916005",
  },
};
