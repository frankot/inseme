/**
 * The /osrodek page: the gallery, the logistics and the short list of what to
 * bring. This is the old site's POBYT and GALERIA content, which the rebuild
 * had nowhere to put — the homepage carried four photographs and nothing else.
 *
 * The figures and stats themselves live in `content/home.ts` and are shared
 * with the homepage band, so there is one copy of each caption.
 */

export type OsrodekPageContent = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  breadcrumbHome: string;
  breadcrumbLabel: string;
  title: string;
  lead: string;
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
