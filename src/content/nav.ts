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
 * Whether a nav destination is the page currently open. Hash-only links
 * (`/#…`) target sections, not pages, so they are never "active".
 */
export function isPathActive(pathname: string, href: string): boolean {
  if (!href.startsWith("/") || href.startsWith("/#")) return false;
  const path = href.split("#")[0].split("?")[0];
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(path + "/");
}

export const navLinks: NavEntry[] = [
  { label: "Pierwszy kontakt", href: "/#pierwszy-kontakt" },
  {
    label: "O nas",
    items: [
      { label: "Ośrodek", href: "/osrodek" },
      { label: "Program", href: "/program" },
      // The gallery lives in its own section on the Ośrodek page.
      { label: "Galeria", href: "/osrodek#galeria" },
    ],
  },
  { label: "Zespół", href: "/zespol" },
  { label: "Cennik", href: "/cennik" },
  { label: "Testy przesiewowe", href: "/testy", barLabel: "Testy" },
  { label: "Artykuły", href: "/artykuly" },
  { label: "Kontakt", href: "/kontakt" },
  { label: "Pytania", href: "/pytania", mobileOnly: true },
  { label: "Jeden dzień", href: "/program#dzien", mobileOnly: true },
  { label: "Opinie", href: "/#opinie", mobileOnly: true },
];

/** Entries shown in the desktop bar. */
export const barLinks: NavEntry[] = navLinks.filter(
  (entry) => isNavGroup(entry) || !entry.mobileOnly,
);

/** Entries shown in the mobile panel, in the same intentional order. */
export const panelLinks = navLinks;
