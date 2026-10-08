"use client";

import { LogOut } from "lucide-react";
import { useTransition } from "react";

import { logout } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

/**
 * The "Wyloguj" row at the foot of the admin menu — desktop sidebar and mobile
 * drawer alike. Same action as the account menu in the top bar. `collapsed`
 * draws it as an icon square, for the sidebar folded to icons.
 */
export function LogoutButton({ collapsed = false }: { collapsed?: boolean }) {
  const [isPending, startTransition] = useTransition();
  const label = isPending ? "Wylogowywanie…" : "Wyloguj";

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={(event) => {
        // The folded sidebar opens on any click; logging out shouldn't also unfold it.
        event.stopPropagation();
        startTransition(() => {
          void logout();
        });
      }}
      title={collapsed ? "Wyloguj" : undefined}
      aria-label={collapsed ? "Wyloguj" : undefined}
      className={cn(
        // Quiet: a menu row in red, not a filled button — tinted only on hover.
        "flex items-center gap-3 rounded-md text-sm text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive disabled:opacity-60",
        collapsed ? "size-9 justify-center self-center" : "w-full px-3 py-2",
      )}
    >
      <LogOut className="size-4 shrink-0" aria-hidden />
      {collapsed ? null : label}
    </button>
  );
}
