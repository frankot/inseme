import Link from "next/link";

import { cn } from "@/lib/utils";

export type SectionTab = {
  href: string;
  label: string;
  /** A count shown beside the label — new messages, say. Hidden when 0. */
  count?: number;
};

/**
 * Tabs across the top of a section that holds two related lists under one
 * menu entry (Zgłoszenia: messages and addresses; Galeria i media). Each tab
 * is its own route, so links and reloads keep the tab.
 */
export function SectionTabs({ tabs, current }: { tabs: SectionTab[]; current: string }) {
  return (
    <nav aria-label="Widoki sekcji" className="mb-6 flex gap-1 border-b">
      {tabs.map((tab) => {
        const active = tab.href === current;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "-mb-px flex items-center gap-2 border-b-2 px-3 pb-2.5 pt-1 text-sm transition-colors",
              active
                ? "border-foreground font-medium text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
            {tab.count ? (
              <span className="rounded-full bg-primary px-1.5 text-[11px] font-medium leading-5 text-primary-foreground tabular-nums">
                {tab.count}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

export const INBOX_TABS = (newMessages: number): SectionTab[] => [
  { href: "/admin/contact", label: "Wiadomości", count: newMessages },
  { href: "/admin/leads", label: "Adresy e-mail" },
];

export const MEDIA_TABS: SectionTab[] = [
  { href: "/admin/gallery", label: "Galeria" },
  { href: "/admin/media", label: "Biblioteka mediów" },
];
