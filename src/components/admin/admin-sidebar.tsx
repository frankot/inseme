"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { NavLinks } from "@/components/admin/nav-links";
import { cn } from "@/lib/utils";

const isEditorRoute = (pathname: string) => /^\/admin\/cms\/[^/]+/.test(pathname);

/**
 * The desktop sidebar, full or folded to icons.
 *
 * It folds itself on the CMS editor, which needs the width for its preview,
 * and opens again on any other page. While folded, a click anywhere on it —
 * an icon or the empty space below — opens it; the button at the top toggles
 * it either way.
 */
export function AdminSidebar() {
  const pathname = usePathname();
  const [state, setState] = useState({ pathname, collapsed: isEditorRoute(pathname) });

  // Each navigation resets the default for the new page (render-time update,
  // not an effect, so the first paint is already right).
  if (state.pathname !== pathname) {
    setState({ pathname, collapsed: isEditorRoute(pathname) });
  }
  const collapsed = state.collapsed;
  const setCollapsed = (value: boolean) => setState({ pathname, collapsed: value });

  return (
    <aside
      onClick={collapsed ? () => setCollapsed(false) : undefined}
      className={cn(
        "sticky top-14 hidden h-[calc(100svh_-_3.5rem)] shrink-0 flex-col overflow-y-auto overflow-x-hidden border-r py-3 transition-[width] duration-200 lg:flex",
        collapsed ? "w-14 cursor-pointer px-1.5" : "w-64 px-2",
      )}
    >
      {/* A quiet control, not a menu entry: small, icon-only, tucked to the
          edge it folds towards. */}
      <div className={cn("mb-1 flex", collapsed ? "justify-center" : "justify-end")}>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setCollapsed(!collapsed);
          }}
          aria-label={collapsed ? "Rozwiń menu" : "Zwiń menu"}
          aria-expanded={!collapsed}
          title={collapsed ? "Rozwiń menu" : "Zwiń menu"}
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4" aria-hidden />
          ) : (
            <PanelLeftClose className="size-4" aria-hidden />
          )}
        </button>
      </div>

      <NavLinks collapsed={collapsed} />
    </aside>
  );
}
