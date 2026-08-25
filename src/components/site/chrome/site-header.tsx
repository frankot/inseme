"use client";

import { useCallback, useEffect, useState } from "react";

import { SiteImage } from "@/components/site/ui/site-image";
import {
  contactDefaults,
  mobileNavDefaults,
  navDefaults,
  type NavItem,
  type SiteContact,
} from "@/content/home";
import { cn } from "@/lib/utils";

const LOGO = "/placeholder/logo-insieme.png";

// The compact bar never appears over the hero, which carries its own
// transparent header. Past that point behaviour splits by viewport:
//   desktop — follows scroll direction: back on the way up, away on the way down
//   phones  — simply stays visible; direction-hiding reads as flicker on a
//             small screen and fights the browser's own collapsing URL bar

/** How far down the page the bar becomes eligible to appear at all. */
const ARM_AFTER = 0.7;
/** Upward travel needed to bring it back — long enough to ignore jitter. */
const UP_DISTANCE = 64;
/** Downward travel before it leaves again. */
const DOWN_DISTANCE = 24;
/** Sub-pixel noise from touch drags and momentum is not a direction. */
const MIN_DELTA = 2;
/** Matches `--breakpoint-nav`, where the desktop nav replaces the burger. */
const DESKTOP_QUERY = "(min-width: 961px)";

type Tone = "dark" | "light";

export function SiteHeader({
  nav = navDefaults,
  mobileNav = mobileNavDefaults,
  contact = contactDefaults,
}: {
  nav?: NavItem[];
  mobileNav?: NavItem[];
  contact?: SiteContact;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [stickyOn, setStickyOn] = useState(false);

  useEffect(() => {
    // Travel accumulated since the last direction change, so a few stray
    // pixels — or a trackpad's momentum wobble — don't flip the bar.
    let up = 0;
    let down = 0;
    let frame = 0;

    /**
     * Mobile browsers report positions past both ends while rubber-banding,
     * and the spring back reads as a deliberate scroll the other way. Clamping
     * to the real document range removes that phantom motion.
     */
    const position = () => {
      const max = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      return Math.min(Math.max(0, window.scrollY), max);
    };

    let lastY = position();
    const desktop = window.matchMedia(DESKTOP_QUERY);

    const evaluate = () => {
      frame = 0;
      const y = position();
      const delta = y - lastY;
      lastY = y;

      if (y < window.innerHeight * ARM_AFTER) {
        up = down = 0;
        setStickyOn(false);
        return;
      }

      // Phones: past the hero the bar stays put, full stop.
      if (!desktop.matches) {
        up = down = 0;
        setStickyOn(true);
        return;
      }

      if (Math.abs(delta) < MIN_DELTA) return;

      if (delta > 0) {
        down += delta;
        up = 0;
        if (down > DOWN_DISTANCE) setStickyOn(false);
      } else {
        up -= delta;
        down = 0;
        if (up > UP_DISTANCE) setStickyOn(true);
      }
    };

    // One read per frame: scroll fires far more often than that, and each
    // extra sample is just noise on a touch drag.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(evaluate);
    };

    /**
     * A collapsing mobile URL bar resizes the viewport, which shifts scrollY
     * on its own. Treated as scrolling it looks like a deliberate swipe up and
     * pins the bar open, so re-baseline instead of reading it as motion.
     */
    const onResize = () => {
      lastY = position();
      up = down = 0;
    };

    evaluate();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    // Crossing the breakpoint swaps the rule, so settle on the new one at once
    // rather than waiting for the next scroll.
    desktop.addEventListener("change", evaluate);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      desktop.removeEventListener("change", evaluate);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const close = useCallback(() => setMenuOpen(false), []);
  // Opening the menu always brings the solid compact bar in, even at the top of
  // the page: the panel needs a real bar above it, not the transparent hero one.
  const barShown = stickyOn || menuOpen;
  const toggle = useCallback(() => setMenuOpen((open) => !open), []);

  return (
    <>
      {/*
        Compact bar: full-width, flush to the top, revealed by scrolling up and
        dismissed by scrolling down (see the scroll effect above).
      */}
      <header
        inert={!barShown}
        className={cn(
          "fixed inset-x-0 top-0 z-70 border-b border-line-strong bg-cream",
          // Pure slide, no cross-fade: the bar travels, it does not dissolve.
          // Entry decelerates into place, exit accelerates away.
          "will-change-transform transition-transform motion-reduce:transition-none",
          barShown
            ? "translate-y-0 duration-[520ms] ease-[cubic-bezier(.16,1,.3,1)]"
            : "-translate-y-full duration-[340ms] ease-[cubic-bezier(.7,0,.84,0)]",
        )}
      >
        <Bar
          tone="light"
          height="h-nav-sticky"
          nav={nav}
          contact={contact}
          onBurger={toggle}
          menuOpen={menuOpen}
          logoWidth="w-[clamp(92px,7.7vw,112px)]"
          tagline
        />
      </header>

      {/*
        Mobile panel: rises from the bottom and stops below the bar, so the
        navbar — and its burger, now the close control — stays visible.
      */}
      <div
        inert={!menuOpen}
        className={cn(
          "fixed inset-x-0 bottom-0 z-60 flex flex-col border-t border-line bg-cream",
          barShown ? "top-nav-sticky" : "top-nav",
          "will-change-transform transition-transform motion-reduce:transition-none",
          menuOpen
            ? "translate-y-0 duration-[520ms] ease-[cubic-bezier(.16,1,.3,1)]"
            : "translate-y-full duration-[340ms] ease-[cubic-bezier(.7,0,.84,0)]",
        )}
      >
        <div className="mx-auto flex w-full max-w-[1440px] flex-auto flex-col justify-center gap-0.5 overflow-y-auto px-gutter pt-[clamp(16px,4vw,32px)] pb-[clamp(36px,7vw,56px)]">
          {mobileNav.map((item) => (
            <a
              key={item.href + item.label}
              href={item.href}
              onClick={close}
              className="font-heading text-mob-link text-ink-900 transition-colors hover:text-sage-600"
            >
              {item.label}
            </a>
          ))}
          <a
            href={`tel:${contact.phoneHref}`}
            onClick={close}
            className="mt-[26px] inline-flex items-center justify-between gap-4 bg-ink-900 px-6 py-[17px] font-heading text-[clamp(20px,4.6vw,25px)] leading-none tracking-[-0.02em] tabular-nums text-bone transition-colors hover:bg-ink-700"
          >
            <span>Zadzwoń: {contact.phone}</span>
            <span aria-hidden className="text-[17px]">
              →
            </span>
          </a>
          <span className="mt-3.5 text-[13px] leading-[1.7] text-ink-200">
            dyżur całą dobę · {contact.addressLine1}, Magdalenka
          </span>
        </div>
      </div>

      {/* Transparent bar on the hero photo; yields to the compact bar when the
          menu opens so only one header is ever on screen. */}
      <header
        inert={menuOpen}
        className={cn(
          "absolute inset-x-0 top-0 z-60 transition-opacity duration-300",
          menuOpen && "pointer-events-none opacity-0",
        )}
      >
        <Bar
          tone="dark"
          height="h-nav"
          nav={nav}
          contact={contact}
          onBurger={toggle}
          menuOpen={menuOpen}
          logoWidth="w-[clamp(100px,8.4vw,122px)]"
          tagline
        />
      </header>
    </>
  );
}

function Bar({
  tone,
  height,
  nav,
  contact,
  onBurger,
  menuOpen,
  logoWidth,
  tagline = false,
}: {
  tone: Tone;
  height: string;
  nav: NavItem[];
  contact: SiteContact;
  onBurger: () => void;
  menuOpen: boolean;
  logoWidth: string;
  tagline?: boolean;
}) {
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-[1440px] items-center justify-between gap-gutter px-gutter",
        height,
      )}
    >
      <a
        href="#gora"
        className={cn(
          "flex shrink-0",
          tagline ? "flex-col gap-[5px]" : "items-center",
        )}
      >
        <Logo className={logoWidth} invert={dark} />
        {tagline && (
          <span
            className={cn(
              "text-[9.5px] uppercase tracking-[0.26em]",
              dark ? "text-on-dark-2/70" : "text-ink-200",
            )}
          >
            ośrodek terapii uzależnień
          </span>
        )}
      </a>

      <nav className="hidden items-center gap-[clamp(16px,1.9vw,32px)] nav:flex">
        {nav.map((item) => (
          <a
            key={item.href + item.label}
            href={item.href}
            className={cn(
              "nav-link font-heading text-nav transition-colors",
              dark
                ? "text-on-dark-2 text-shadow-nav hover:text-white"
                : "text-ink-900",
            )}
          >
            {item.label}
          </a>
        ))}
        <a
          href={`tel:${contact.phoneHref}`}
          className={cn(
            "group inline-flex items-center gap-[9px] border font-heading text-nav leading-none tabular-nums transition-colors",
            dark
              ? "border-bone/40 bg-bone/6 px-[21px] py-[11px] text-bone text-shadow-nav hover:border-bone hover:bg-bone hover:text-ink-900"
              : "border-ink-900 bg-ink-900 px-[21px] py-[11px] text-bone hover:bg-transparent hover:text-ink-900",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "block size-[5px] rounded-full",
              dark ? "bg-sage-300" : "bg-sage-300 group-hover:bg-sage-600",
            )}
          />
          <span>{contact.phone}</span>
        </a>
      </nav>

      <button
        type="button"
        onClick={onBurger}
        aria-expanded={menuOpen}
        className={cn(
          "flex items-center gap-[11px] px-0.5 py-[11px] text-eyebrow uppercase nav:hidden",
          dark ? "text-on-dark-2 text-shadow-nav" : "text-ink-900",
        )}
      >
        <span>Menu</span>
        <span className="burger-icon" data-open={menuOpen} aria-hidden>
          <span />
          <span />
        </span>
      </button>
    </div>
  );
}

function Logo({
  className,
  invert = false,
}: {
  className?: string;
  invert?: boolean;
}) {
  return (
    <SiteImage
      src={LOGO}
      alt="Insieme"
      width={244}
      height={72}
      priority
      className={cn(
        "h-auto",
        className,
        invert && "brightness-0 invert opacity-95",
      )}
    />
  );
}
