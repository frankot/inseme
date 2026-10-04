/**
 * Editorial copy around the team. The people themselves come from the
 * `team_members` table (see `src/lib/queries/team.ts`) — only the framing
 * belongs here, the same way `home.ts` holds the rest of the site's strings.
 */

/** The homepage teaser quotes the first paragraph; /zespol prints both. */
const TEAM_INTRO = [
  "Każdy z naszych terapeutów jest inny — ma własny sposób pracy, doświadczenie i perspektywę. Dzięki temu możesz usłyszeć różne punkty widzenia, ale zawsze w jednym kierunku: zdrowienia i realnej zmiany.",
  "Pracujemy jako zespół. Jesteśmy ze sobą w stałym kontakcie, na bieżąco omawiamy proces terapii i wspólnie szukamy najlepszego sposobu wsparcia. Nad jakością naszej pracy czuwa doświadczony superwizor Leszek Kapler.",
];

export type TeamTeaserContent = {
  index: string;
  eyebrow: string;
  title: string;
  lead: string;
  linkLabel: string;
  href: string;
};

/** The three-person section on the homepage, between Program and Opinie. */
export const teamTeaserDefaults: TeamTeaserContent = {
  index: "05",
  eyebrow: "Zespół",
  title: "Różni ludzie, wspólny cel.",
  lead: TEAM_INTRO[0],
  linkLabel: "Poznaj cały zespół",
  href: "/zespol",
};

export type TeamPageContent = {
  eyebrow: string;
  title: string;
  /** One entry per paragraph. */
  lead: string[];
  /** Shown when nothing is published yet — an editor sees this, not a blank page. */
  emptyNote: string;
  metaTitle: string;
  metaDescription: string;
};

export const teamPageDefaults: TeamPageContent = {
  eyebrow: "Zespół",
  title: "Różni ludzie, wspólny cel.",
  lead: TEAM_INTRO,
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
