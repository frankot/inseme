/**
 * Every navigation destination on the public site, in one place.
 *
 * The desktop bar only has room for a handful of links beside the logo and the
 * phone button, so entries opt into it with `inBar`; the mobile panel lists all
 * of them, in this order.
 */

export type NavItem = { label: string; href: string };

export type NavLink = NavItem & {
  /** Show this link in the desktop bar as well as the mobile panel. */
  inBar?: boolean;
  /** Shorter label for the bar, where horizontal room is tight. */
  barLabel?: string;
};

export const navLinks: NavLink[] = [
  { label: "Pierwszy kontakt", href: "/#pierwszy-kontakt", inBar: true },
  { label: "Ośrodek", href: "/#miejsce", inBar: true },
  { label: "Zespół", href: "/zespol", inBar: true },
  { label: "Program", href: "/#program", inBar: true },
  { label: "Jeden dzień", href: "/#dzien" },
  {
    label: "Testy przesiewowe",
    href: "/testy",
    inBar: true,
    barLabel: "Testy",
  },
  { label: "Poradnik", href: "/artykuly" },
  { label: "Pytania", href: "/#faq" },
  { label: "Kontakt", href: "/kontakt" },
];

/** What the desktop bar renders. */
export const barLinks: NavItem[] = navLinks
  .filter((link) => link.inBar)
  .map(({ label, href, barLabel }) => ({ label: barLabel ?? label, href }));

/** What the mobile panel renders: everything. */
export const panelLinks: NavItem[] = navLinks.map(({ label, href }) => ({
  label,
  href,
}));
