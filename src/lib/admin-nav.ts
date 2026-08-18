import type { LucideIcon } from "lucide-react";
import {
  FileText,
  HelpCircle,
  Image,
  Inbox,
  LayoutDashboard,
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
  phase: "B1" | "B2" | "B3" | "B4";
};

export const adminNav: AdminNavItem[] = [
  { href: "/admin", label: "Pulpit", icon: LayoutDashboard, available: true, phase: "B1" },
  { href: "/admin/settings", label: "Ustawienia", icon: Settings, available: false, phase: "B2" },
  { href: "/admin/pages", label: "Strony", icon: FileText, available: false, phase: "B2" },
  { href: "/admin/team", label: "Zespół", icon: Users, available: false, phase: "B2" },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle, available: false, phase: "B2" },
  { href: "/admin/articles", label: "Artykuły", icon: Newspaper, available: false, phase: "B2" },
  { href: "/admin/media", label: "Media", icon: Image, available: false, phase: "B2" },
  { href: "/admin/tests", label: "Testy przesiewowe", icon: ListChecks, available: false, phase: "B3" },
  { href: "/admin/leads", label: "Leady", icon: Inbox, available: false, phase: "B4" },
  { href: "/admin/contact", label: "Wiadomości", icon: Inbox, available: false, phase: "B4" },
];
