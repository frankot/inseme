/**
 * Editorial copy around the team. The people themselves come from the
 * `team_members` table (see `src/lib/queries/team.ts`) — only the framing
 * belongs here, the same way `home.ts` holds the rest of the site's strings.
 */

export type TeamTeaserContent = {
  index: string;
  eyebrow: string;
  title: string;
  lead: string;
  linkLabel: string;
  href: string;
};

/** The three-person section on the homepage, between Ośrodek and Pierwszy kontakt. */
export const teamTeaserDefaults: TeamTeaserContent = {
  index: "04",
  eyebrow: "Zespół",
  title: "Ci sami ludzie przez cały pobyt.",
  lead: "Nie ma tu rotacji kontraktowej i nikt nie poznaje Cię od nowa co tydzień. Terapeuta prowadzący zostaje z Tobą od pierwszej rozmowy do wyjazdu.",
  linkLabel: "Poznaj cały zespół",
  href: "/zespol",
};

export type TeamPageContent = {
  eyebrow: string;
  title: string;
  lead: string;
  /** Shown when nothing is published yet — an editor sees this, not a blank page. */
  emptyNote: string;
  metaTitle: string;
  metaDescription: string;
};

export const teamPageDefaults: TeamPageContent = {
  eyebrow: "Zespół",
  title: "Kto z Tobą pracuje przez te kilka tygodni.",
  lead: "Terapeuci uzależnień, psychiatra, psycholog i pielęgniarki — dwanaście miejsc na tyle osób oznacza, że każdy zna każdego po imieniu. Poniżej cały zespół, z kwalifikacjami i tym, czym się zajmuje.",
  emptyNote: "Przygotowujemy tę stronę. Zadzwoń — powiemy przez telefon, kto poprowadzi terapię.",
  metaTitle: "Zespół — terapeuci ośrodka Insieme w Magdalence",
  metaDescription:
    "Terapeuci uzależnień, psychiatra i psycholog ośrodka Insieme. Ta sama kadra przez cały pobyt — poznaj zespół przed przyjazdem.",
};

/** Labels for the detail page, so `/zespol/[slug]` holds no loose strings. */
export const teamMemberPageDefaults = {
  eyebrow: "Zespół",
  breadcrumbHome: "Strona główna",
  breadcrumbTeam: "Zespół",
  qualificationsLabel: "Kwalifikacje",
  othersTitle: "Pozostali w zespole",
  ctaTitle: "Chcesz porozmawiać, zanim zdecydujesz?",
  ctaBody:
    "Odbiera terapeuta z ośrodka — nie call center. Rozmowa nie zobowiązuje do przyjazdu.",
  backLabel: "Wróć do zespołu",
  notFoundTitle: "Nie ma takiej osoby.",
  notFoundBody:
    "Ten adres nie wskazuje na nikogo z zespołu — być może wpis został zmieniony albo usunięty.",
} as const;
