"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { adminNav } from "@/lib/admin-nav";
import { cn } from "@/lib/utils";

const row = "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors";
const idle = "text-muted-foreground hover:bg-accent/50 hover:text-foreground";
const current = "bg-accent font-medium text-accent-foreground";

/**
 * The admin menu. `collapsed` draws it as a column of icons (labels move to
 * the tooltip, the CMS sub-list is hidden) — the desktop sidebar's narrow
 * state; the mobile sheet always passes the full menu.
 */
export function NavLinks({
  onNavigate,
  collapsed = false,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const pathname = usePathname();
  const [toggled, setToggled] = useStoredGroups();

  // A group opens by itself the first time one of its pages is visited, and
  // from then on only a click on its chevron opens or closes it — leaving the
  // group's pages does not fold it away.
  const autoOpen = adminNav.filter(
    (item) => item.children && pathname.startsWith(item.href) && toggled[item.href] === undefined,
  );
  if (autoOpen.length > 0) {
    setToggled((state) => ({
      ...state,
      ...Object.fromEntries(autoOpen.map((item) => [item.href, true])),
    }));
  }

  return (
    <nav className="flex flex-col gap-1">
      {adminNav.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : [item.href, ...(item.also ?? [])].some((href) => pathname.startsWith(href));
        const label = <span className={cn("truncate", collapsed && "sr-only")}>{item.label}</span>;

        if (!item.available) {
          return (
            <span
              key={item.href}
              title={collapsed ? `${item.label} — faza ${item.phase}` : `Dostępne w fazie ${item.phase}`}
              className={cn(row, "cursor-not-allowed text-muted-foreground/50", collapsed && "justify-center px-0")}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {label}
              {!collapsed && (
                <span className="ml-auto text-[10px] uppercase tracking-wide">{item.phase}</span>
              )}
            </span>
          );
        }

        // The group header is only "current" on its own index page; a child
        // page highlights the child instead (or the icon, when collapsed).
        const headerActive = collapsed ? isActive : pathname === item.href;

        const open = item.children ? (toggled[item.href] ?? isActive) : false;
        const linkClass = cn(
          row,
          (item.children ? headerActive : isActive) ? current : idle,
          collapsed && "justify-center px-0",
        );

        return (
          <div key={item.href} className="flex flex-col gap-0.5">
            {item.children && !collapsed ? (
              // A group: the label links to its index, the chevron opens and
              // closes the list without navigating.
              <div className={cn(linkClass, "p-0")}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={headerActive ? "page" : undefined}
                  className="flex min-w-0 flex-1 items-center gap-3 py-2 pl-3"
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  {label}
                </Link>
                <button
                  type="button"
                  onClick={() => setToggled((state) => ({ ...state, [item.href]: !open }))}
                  aria-expanded={open}
                  aria-label={open ? `Zwiń: ${item.label}` : `Rozwiń: ${item.label}`}
                  className="mr-1 flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-background hover:text-foreground"
                >
                  <ChevronDown
                    className={cn("size-3.5 transition-transform", !open && "-rotate-90")}
                    aria-hidden
                  />
                </button>
              </div>
            ) : (
              <Link
                href={item.href}
                onClick={onNavigate}
                title={collapsed ? item.label : undefined}
                aria-current={(item.children ? headerActive : isActive) ? "page" : undefined}
                className={linkClass}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {label}
              </Link>
            )}

            {item.children && open && !collapsed && (
              <div className="ml-[1.375rem] flex flex-col gap-0.5 border-l pl-2">
                {item.children.map((child) => {
                  const childActive = pathname.startsWith(child.href);
                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onNavigate}
                      aria-current={childActive ? "page" : undefined}
                      className={cn(
                        "truncate rounded-md px-3 py-1.5 text-sm transition-colors",
                        childActive ? current : idle,
                      )}
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

const STORAGE_KEY = "admin-nav-groups";

/**
 * Which groups are open, remembered in this browser so a reload keeps them.
 * Read after mount — the server render has no storage, and starting from the
 * same empty state on both sides keeps hydration clean.
 */
function useStoredGroups() {
  const [groups, setGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<string, boolean>;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of browser storage after hydration
      setGroups((state) => ({ ...state, ...stored }));
    } catch {
      // Storage blocked or corrupt: fall back to opening groups as visited.
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
    } catch {
      // Not remembered across reloads — the in-memory state still works.
    }
  }, [groups]);

  return [groups, setGroups] as const;
}

