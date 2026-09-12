import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The "01 —————— Ośrodek" header that opens every section: numeral, hairline,
 * uppercase label.
 *
 * `index` is a node rather than a string so subpages can put a breadcrumb where
 * the homepage puts a numeral — same rule, same rhythm. Omit it entirely and the
 * hairline simply runs to the left edge.
 */
export function SectionRule({
  index,
  label,
  className,
}: {
  index?: ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline mt-10 lg:mt-20 gap-[clamp(12px,1.6vw,20px)]",
        className,
      )}
    >
      {index != null && (
        <span className="text-eyebrow tabular-nums text-clay-400 tracking-[0.22em]">
          {index}
        </span>
      )}
      <span aria-hidden className="h-px flex-auto bg-line-strong" />
      <span className="text-eyebrow uppercase text-clay-600 tracking-[0.22em]">
        {label}
      </span>
    </div>
  );
}
