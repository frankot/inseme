import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** The 1440px measure and fluid gutter every section shares. */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1440px] px-gutter", className)}>
      {children}
    </div>
  );
}
