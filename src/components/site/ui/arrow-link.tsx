import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Inline link with the arrow that drifts right on hover. */
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a href={href} className={cn("link-arrow text-sm", className)}>
      <span>{children}</span>
      <span aria-hidden>→</span>
    </a>
  );
}
