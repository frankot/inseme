import type { Metadata } from "next";

import { loadAdminManual, type ManualHeading } from "@/lib/admin-manual";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Instrukcja — panel Insieme" };

/**
 * The client's manual for this panel, from `src/content/admin-manual.md`
 * (see `lib/admin-manual.ts`). Linked from the top bar on every admin page.
 */
export default function AdminManualPage() {
  const { title, html, toc } = loadAdminManual();

  return (
    <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
      {/* Desktop: a contents list that stays put while the manual scrolls. */}
      <aside className="hidden lg:block">
        <nav aria-label="Spis treści" className="sticky top-20 max-h-[calc(100svh-6rem)] overflow-y-auto">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Spis treści
          </p>
          <Contents toc={toc} />
        </nav>
      </aside>

      <article className="min-w-0 max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>

        {/* Phones and narrow windows: the same list, folded. */}
        <details className="mt-4 rounded-lg border px-4 py-3 lg:hidden">
          <summary className="cursor-pointer text-sm font-medium">Spis treści</summary>
          <div className="mt-3">
            <Contents toc={toc} />
          </div>
        </details>

        <div
          className={cn(
            "mt-6 text-[15px] leading-7 text-foreground",
            "[&_h2]:mt-12 [&_h2]:scroll-mt-20 [&_h2]:border-t [&_h2]:pt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight",
            "[&_h3]:mt-8 [&_h3]:scroll-mt-20 [&_h3]:text-base [&_h3]:font-semibold",
            "[&_p]:mt-3 [&_ul]:mt-3 [&_ol]:mt-3 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:mt-1.5 [&_li>ul]:mt-1.5",
            "[&_strong]:font-semibold [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4",
            "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[13px]",
            "[&_blockquote]:mt-4 [&_blockquote]:rounded-r-md [&_blockquote]:border-l-4 [&_blockquote]:border-amber-400 [&_blockquote]:bg-amber-50 [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:text-amber-950 dark:[&_blockquote]:bg-amber-950/40 dark:[&_blockquote]:text-amber-100 [&_blockquote_p]:mt-0",
            "[&_hr]:hidden",
          )}
          // The manual is our own Markdown, rendered and sanitised in `loadAdminManual`.
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </div>
  );
}

function Contents({ toc }: { toc: ManualHeading[] }) {
  return (
    <ul className="flex flex-col gap-1 text-sm">
      {toc.map((heading) => (
        <li key={heading.id} className={heading.depth === 3 ? "pl-3" : "mt-2 first:mt-0"}>
          <a
            href={`#${heading.id}`}
            className={cn(
              "block rounded px-1.5 py-0.5 transition-colors hover:bg-accent hover:text-foreground",
              heading.depth === 2 ? "font-medium text-foreground" : "text-muted-foreground",
            )}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );
}
