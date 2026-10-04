/**
 * Public-site navigation. Labels, destinations and hierarchy live here so the
 * desktop bar and mobile panel cannot drift apart.
 */

export type NavItem = {
  label: string;
  href: string;
  /** Shorter label for the desktop bar when horizontal room is tight. */
  barLabel?: string;
  /** Keep secondary links in the mobile panel without crowding the desktop bar. */
  mobileOnly?: boolean;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export type NavEntry = NavItem | NavGroup;

export function isNavGroup(entry: NavEntry): entry is NavGroup {
  return "items" in entry;
}

/**
 * Whether a nav destination is the page currently open. Links with a hash
 * (`/#…`, `/program#dzien`) target sections, not pages, so they are never
 * "active" — otherwise /program would underline both of its entries.
 */
export function isPathActive(pathname: string, href: string): boolean {
  if (!href.startsWith("/") || href.includes("#")) return false;
  const path = href.split("?")[0];
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(path + "/");
}

/**
 * Ordered by what a visitor wants to know: what you offer, who you are, what it
 * costs, what else they need answered, what to read, how to reach you. The
 * intent pages (leczenie alkoholizmu, dla rodziny, detoks, NFZ) live in the
 * footer only.
 */
export const navLinks: NavEntry[] = [
  {
    label: "Program",
    items: [
      { label: "Program terapii", href: "/program" },
      { label: "Jak wygląda dzień", href: "/program#dzien" },
      { label: "Jak zacząć", href: "/#pierwszy-kontakt" },
    ],
  },
  {
    label: "O ośrodku",
    items: [
      { label: "Ośrodek", href: "/osrodek" },
      { label: "Zespół", href: "/zespol" },
      { label: "Galeria", href: "/galeria" },
      { label: "Opinie", href: "/#opinie" },
    ],
  },
  { label: "Cennik", href: "/cennik" },
  { label: "Pytania", href: "/faq" },
  {
    label: "Poradnik",
    items: [
      { label: "Porady", href: "/porady" },
      { label: "Testy przesiewowe", href: "/testy" },
    ],
  },
  { label: "Kontakt", href: "/kontakt" },
];

/** Entries shown in the desktop bar. */
export const barLinks: NavEntry[] = navLinks.filter(
  (entry) => isNavGroup(entry) || !entry.mobileOnly,
);

/** Entries shown in the mobile panel, in the same intentional order. */
export const panelLinks = navLinks;
