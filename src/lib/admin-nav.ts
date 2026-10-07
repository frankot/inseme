import type { LucideIcon } from "lucide-react";
import { cmsPageList } from "@/cms/registry";
import {
  HelpCircle,
  Images,
  Inbox,
  LayoutDashboard,
  LayoutTemplate,
  ListChecks,
  Newspaper,
  Settings,
  Users,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** A collapsible group — the CMS pages. Opens on any child route. */
  children?: { href: string; label: string }[];
  /** Other routes of a merged section (its tabs), which also light this entry. */
  also?: string[];
};

export const adminNav: AdminNavItem[] = [
  { href: "/admin", label: "Pulpit", icon: LayoutDashboard },
  {
    href: "/admin/cms",
    label: "CMS",
    icon: LayoutTemplate,
    children: cmsPageList.map((page) => ({
      href: `/admin/cms/${page.adminSlug}`,
      label: page.label,
    })),
  },
  { href: "/admin/team", label: "Zespół", icon: Users },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/articles", label: "Artykuły", icon: Newspaper },
  // One entry per merged section; the other route is a tab on its page.
  {
    href: "/admin/gallery",
    label: "Galeria i media",
    icon: Images,
    also: ["/admin/media"],
  },
  { href: "/admin/tests", label: "Testy przesiewowe", icon: ListChecks },
  {
    href: "/admin/contact",
    label: "Zgłoszenia",
    icon: Inbox,
    also: ["/admin/leads"],
  },
  { href: "/admin/settings", label: "Ustawienia", icon: Settings },
];
