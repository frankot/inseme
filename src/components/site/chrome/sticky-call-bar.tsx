"use client";

import { useEffect, useState } from "react";

import { contactDefaults, type SiteContact } from "@/content/home";
import { cn } from "@/lib/utils";

/** Hidden from `tab` up, where the header bar carries the number. */
const BAR_H = 64;

/**
 * The phone, permanently within thumb reach on a phone.
 *
 * Most of this site's traffic is mobile and the call is the conversion — a
 * number that scrolls away is a number that does not get dialled. It appears
 * only once the hero's own button has scrolled off, so the two never compete,
 * and it hides from the `tab` breakpoint up, where the header bar already carries
 * the number.
 *
 * The mobile menu panel sits at z-60 and covers the viewport to the bar's top,
 * so an open menu hides this without the two needing to know about each other.
 */
export function StickyCallBar({
  contact = contactDefaults,
}: {
  contact?: SiteContact;
}) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // Roughly one screen: past the hero, where the primary button used to be.
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Keeps the footer's last line clear of the bar. */}
      <div aria-hidden style={{ height: BAR_H }} className="tab:hidden" />

      <div
        inert={!shown}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 border-t border-line-strong bg-cream tab:hidden",
          "will-change-transform transition-transform motion-reduce:transition-none",
          shown
            ? "translate-y-0 duration-[420ms] ease-[cubic-bezier(.16,1,.3,1)]"
            : "translate-y-full duration-[280ms] ease-[cubic-bezier(.7,0,.84,0)]",
        )}
        style={{ height: BAR_H }}
      >
        <div className="mx-auto flex h-full w-full max-w-[1440px] items-center gap-3 px-gutter">
          <span className="min-w-0 flex-auto text-meta leading-[1.35] text-ink-300">
            Odbiera terapeuta.
            <br />
            {contact.hours.replace(/^dyżur /, "Dyżur ")}
          </span>
          <a
            href={`tel:${contact.phoneHref}`}
            className="link-arrow shrink-0 bg-ink-900 px-5 py-3 text-body tabular-nums text-bone transition-colors hover:bg-ink-700"
          >
            <span>{contact.phone}</span>
            <span aria-hidden className="text-[0.92em]">
              →
            </span>
          </a>
        </div>
      </div>
    </>
  );
}
