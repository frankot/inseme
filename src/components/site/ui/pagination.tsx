import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Numbered pages, rendered as ordinary links.
 *
 * Server-rendered rather than a "load more" button so every page is a real URL
 * a person can share and a crawler can follow — a gallery of a few hundred
 * photos is otherwise invisible to search. Long runs collapse around the
 * current page, which keeps the control one line wide at any page count.
 */
export function Pagination({
  page,
  pageCount,
  hrefFor,
  labels,
  className,
}: {
  page: number;
  pageCount: number;
  /** Page number → href, so the caller keeps its other search params. */
  hrefFor: (page: number) => string;
  labels: {
    label: string;
    previous: string;
    next: string;
    page: (page: number) => string;
    summary: (page: number, pageCount: number) => string;
  };
  className?: string;
}) {
  if (pageCount < 2) return null;

  return (
    <nav
      aria-label={labels.label}
      className={cn("flex flex-wrap items-center justify-center gap-2", className)}
    >
      <Step href={page > 1 ? hrefFor(page - 1) : null} label={labels.previous}>
        ←
      </Step>

      {pageWindow(page, pageCount).map((entry, i) =>
        entry === "gap" ? (
          <span key={`gap-${i}`} aria-hidden className="px-1 text-meta text-ink-300">
            …
          </span>
        ) : (
          <Link
            key={entry}
            href={hrefFor(entry)}
            aria-label={labels.page(entry)}
            aria-current={entry === page ? "page" : undefined}
            className={cn(
              "flex h-10 min-w-10 items-center justify-center px-3 text-body tabular-nums transition-colors",
              entry === page
                ? "bg-ink-900 text-bone"
                : "border border-line-strong text-ink-600 hover:border-ink-900 hover:text-ink-900",
            )}
          >
            {entry}
          </Link>
        ),
      )}

      <Step href={page < pageCount ? hrefFor(page + 1) : null} label={labels.next}>
        →
      </Step>

      <span className="sr-only" aria-live="polite">
        {labels.summary(page, pageCount)}
      </span>
    </nav>
  );
}

function Step({
  href,
  label,
  children,
}: {
  href: string | null;
  label: string;
  children: string;
}) {
  const classes =
    "flex h-10 items-center justify-center px-4 text-body transition-colors border border-line-strong";

  // The end of the run is a disabled span, not a link to the page you are on.
  if (!href) {
    return (
      <span aria-hidden className={cn(classes, "cursor-default text-ink-200")}>
        {children}
      </span>
    );
  }

  return (
    <Link href={href} aria-label={label} className={cn(classes, "text-ink-600 hover:border-ink-900 hover:text-ink-900")}>
      <span aria-hidden>{children}</span>
    </Link>
  );
}

/** First, last, and the two either side of the current page — the rest elided. */
function pageWindow(page: number, pageCount: number): (number | "gap")[] {
  const pages = new Set<number>([1, pageCount, page]);
  for (const offset of [-2, -1, 1, 2]) {
    const candidate = page + offset;
    if (candidate > 1 && candidate < pageCount) pages.add(candidate);
  }

  const sorted = [...pages].filter((n) => n >= 1 && n <= pageCount).sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  let previous = 0;
  for (const current of sorted) {
    if (previous && current - previous > 1) out.push("gap");
    out.push(current);
    previous = current;
  }
  return out;
}
