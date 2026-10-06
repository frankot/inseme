import type { LucideIcon } from "lucide-react";
import { cmsPageList } from "@/cms/registry";
import {
  HelpCircle,
  Images,
  Inbox,
  LayoutDashboard,
  LayoutTemplate,
  MessageSquareQuote,
  ListChecks,
  Newspaper,
  Settings,
  Users,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Routes from later phases render as disabled placeholders, not dead links. */
  available: boolean;
  phase: "B1" | "B2" | "B3" | "B4" | "C" | "C4";
  /** A collapsible group — the CMS pages. Opens on any child route. */
  children?: { href: string; label: string }[];
  /** Other routes of a merged section (its tabs), which also light this entry. */
  also?: string[];
};

export const adminNav: AdminNavItem[] = [
  { href: "/admin", label: "Pulpit", icon: LayoutDashboard, available: true, phase: "B1" },
  {
    href: "/admin/cms",
    label: "CMS",
    icon: LayoutTemplate,
    available: true,
    phase: "C",
    children: cmsPageList.map((page) => ({
      href: `/admin/cms/${page.adminSlug}`,
      label: page.label,
    })),
  },
  { href: "/admin/team", label: "Zespół", icon: Users, available: true, phase: "B2" },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle, available: true, phase: "B2" },
  // Reviews stay hardcoded in content/opinie.ts for now (CMS_PLAN D7, deferred).
  { href: "/admin/opinie", label: "Opinie", icon: MessageSquareQuote, available: false, phase: "C4" },
  { href: "/admin/articles", label: "Artykuły", icon: Newspaper, available: true, phase: "B2" },
  // One entry per merged section; the other route is a tab on its page.
  {
    href: "/admin/gallery",
    label: "Galeria i media",
    icon: Images,
    available: true,
    phase: "B2",
    also: ["/admin/media"],
  },
  { href: "/admin/tests", label: "Testy przesiewowe", icon: ListChecks, available: true, phase: "B3" },
  {
    href: "/admin/contact",
    label: "Zgłoszenia",
    icon: Inbox,
    available: true,
    phase: "B4",
    also: ["/admin/leads"],
  },
  { href: "/admin/settings", label: "Ustawienia", icon: Settings, available: true, phase: "B2" },
];
