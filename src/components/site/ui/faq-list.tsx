"use client";

import { useState } from "react";

import type { FaqEntry } from "@/lib/queries/faq";
import { cn } from "@/lib/utils";

/**
 * The accordion itself, without any section chrome around it.
 *
 * The homepage wraps it in a `Section` with a sticky heading column; /pytania
 * puts it straight under the page intro, which already carries the heading.
 * Keeping the list separate is what stops the full page from printing the same
 * title twice.
 */
export function FaqList({
  items,
  /** Which row starts open. `null` opens none. */
  initialOpen = 0,
}: {
  items: FaqEntry[];
  initialOpen?: number | null;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(initialOpen);

  return (
    <>
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.id} className="border-b border-line-strong">
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : i)}
              className={cn(
                "flex w-full items-baseline justify-between gap-5 py-[clamp(18px,1.9vw,24px)] text-left transition-colors",
                open ? "text-ink-900" : "text-ink-900 hover:text-sage-600",
              )}
            >
              <span className="font-heading text-[clamp(17.5px,1.55vw,21px)] leading-[1.32] tracking-[-0.022em]">
                {item.question}
              </span>
              <span
                aria-hidden
                className="relative mt-[5px] size-[13px] shrink-0 text-clay-400"
              >
                <span className="absolute top-1.5 left-0 block h-px w-[13px] bg-current" />
                <span
                  className={cn(
                    "absolute top-0 left-1.5 block h-[13px] w-px bg-current transition-transform duration-[350ms] ease-[cubic-bezier(.16,1,.3,1)]",
                    open && "rotate-90",
                  )}
                />
              </span>
            </button>

            {open && (
              // Sanitised on write by `sanitizeRichText` in the save action.
              // Not the `rich-text` utility: answers sit inside an accordion
              // and read at body size, not article size.
              <div
                className="reveal-shown max-w-[38em] text-pretty pr-[clamp(24px,3vw,60px)] pb-[clamp(22px,2.2vw,28px)] text-body text-ink-400 [&_a]:text-sage-600 [&_a]:underline [&_a]:underline-offset-2 [&_li]:mt-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-3 [&_strong]:text-ink-900 [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: item.answer }}
              />
            )}
          </div>
        );
      })}
    </>
  );
}
