"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The shell's content column. Every admin page reads at `max-w-5xl` except the
 * CMS editor, which needs the whole width for its outline, form and preview.
 */
function useEditorRoute() {
  return /^\/admin\/cms\/[^/]+/.test(usePathname());
}

export function ShellContainer({ children }: { children: ReactNode }) {
  const wide = useEditorRoute();
  return <div className={cn("mx-auto w-full", !wide && "max-w-5xl")}>{children}</div>;
}
