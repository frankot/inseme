"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Fade-and-lift on first entry, via IntersectionObserver.
 *
 * The design used CSS `animation-timeline: view()`, which freezes mid-range for
 * anything near the end of the document — content stayed stuck at partial
 * opacity — and does nothing in Firefox. This starts hidden only once the
 * observer is known to be running, so with JS off or unsupported the content
 * simply renders. `prefers-reduced-motion` is handled in globals.css.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  /** Stagger, in ms, for siblings revealed together. */
  delay?: number;
  as?: "div" | "section" | "article" | "figure" | "li";
}) {
  const ref = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    // Anything already on screen at mount is shown without animating in.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setShown(true);
      return;
    }

    setArmed(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={cn(
        armed && !shown && "reveal-hidden",
        shown && armed && "reveal-shown",
        className,
      )}
      style={
        shown && armed && delay ? { transitionDelay: `${delay}ms` } : undefined
      }
    >
      {children}
    </Tag>
  );
}
