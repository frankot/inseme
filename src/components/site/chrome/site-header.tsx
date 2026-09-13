"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import { SiteImage } from "@/components/site/ui/site-image";
import { contactDefaults, type SiteContact } from "@/content/home";
import {
  barLinks,
  isNavGroup,
  isPathActive,
  panelLinks,
  type NavEntry,
} from "@/content/nav";
import { cn } from "@/lib/utils";

const LOGO = "/placeholder/logo-insieme.png";

/**
 * How far down the page the compact bar slides in, as a fraction of the
 * viewport. Below it the bar is gone — the hero carries its own transparent
 * header — and above it the bar simply stays. One threshold, no direction
 * tracking: the bar never moves while you are reading.
 */
const SHOW_AFTER = 0.7;

type Tone = "dark" | "light";

/**
 * `hero`  — the homepage: a transparent bar on the photograph plus the fixed
 *           compact bar that the threshold above reveals and hides.
 * `solid` — every subpage: there is no photograph to sit on and nothing to
 *           scroll past, so the compact bar is simply sticky and always there.
 */
export type HeaderVariant = "hero" | "solid";

export function SiteHeader({
  nav = barLinks,
  mobileNav = panelLinks,
  contact = contactDefaults,
  variant = "hero",
}: {
  nav?: NavEntry[];
  mobileNav?: NavEntry[];
  contact?: SiteContact;
  variant?: HeaderVariant;
}) {
  const solid = variant === "solid";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (solid) return;
    const onScroll = () =>
      setScrolled(window.scrollY > window.innerHeight * SHOW_AFTER);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [solid]);

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
  const barShown = solid || scrolled || menuOpen;
  const toggle = useCallback(() => setMenuOpen((open) => !open), []);

  return (
    <>
      {/* Compact bar: full-width, flush to the top, slid in past the threshold. */}
      <header
        inert={!barShown}
        className={cn(
          // Glass effect: a delicate frosted layer floating over the page, held
          // in place with backdrop blur and a subtle border. No shape — just
          // transparency and the blur that makes the seam read.
          "inset-x-0 top-0 z-70 border-b border-line/30 bg-cream/80 backdrop-blur-md",
          // Subpages have no hero to overlap, so the bar takes up its own space
          // and stays put; on the homepage it floats over the photograph.
          solid ? "sticky" : "fixed",
          // Pure slide, no cross-fade: the bar travels, it does not dissolve.
          // Entry decelerates into place, exit accelerates away.
          !solid &&
            "will-change-transform transition-transform motion-reduce:transition-none",
          !solid &&
            (barShown
              ? "translate-y-0 duration-[520ms] ease-[cubic-bezier(.16,1,.3,1)]"
              : "-translate-y-full duration-[340ms] ease-[cubic-bezier(.7,0,.84,0)]"),
        )}
      >
        <Bar
          tone="light"
          height="h-nav-sticky"
          nav={nav}
          contact={contact}
          onBurger={toggle}
          menuOpen={menuOpen}
          logoWidth="w-[clamp(90px,7vw,106px)]"
          compact
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
          {mobileNav.map((entry) =>
            isNavGroup(entry) ? (
              <div key={entry.label} className="py-2">
                <p className="mb-2 text-eyebrow uppercase tracking-[0.2em] text-clay-600">
                  {entry.label}
                </p>
                <div className="flex flex-col gap-0.5 pl-4">
                  {entry.items.map((item) => (
                    <NavAnchor
                      key={item.href + item.label}
                      href={item.href}
                      onClick={close}
                      className="font-heading text-[clamp(24px,6.5vw,38px)] leading-[1.22] tracking-[-0.025em] text-ink-900 transition-colors hover:text-sage-600"
                    >
                      {item.label}
                    </NavAnchor>
                  ))}
                </div>
              </div>
            ) : (
              <NavAnchor
                key={entry.href + entry.label}
                href={entry.href}
                onClick={close}
                className="font-heading text-mob-link text-ink-900 transition-colors hover:text-sage-600"
              >
                {entry.label}
              </NavAnchor>
            ),
          )}
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
      {!solid && (
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
      )}
    </>
  );
}

/**
 * A nav destination. Anchors and `tel:` stay plain <a> — Link has nothing to
 * prefetch and would swallow the fragment scroll; real routes get client-side
 * navigation and prefetching.
 */
function NavAnchor({
  href,
  children,
  className,
  onClick,
  active = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  active?: boolean;
}) {
  const state = active ? "true" : undefined;
  if (href.startsWith("/") && !href.startsWith("/#")) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={className}
        data-active={state}
      >
        {children}
      </Link>
    );
  }
  return (
    <a href={href} onClick={onClick} className={className} data-active={state}>
      {children}
    </a>
  );
}

function DesktopNavEntry({
  entry,
  dark,
  compact,
}: {
  entry: NavEntry;
  dark: boolean;
  compact: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkClassName = cn(
    "nav-link font-heading transition-colors",
    compact ? "text-[clamp(15px,1.05vw,17px)]" : "text-[clamp(14px,1.05vw,17px)]",
    dark
      ? "text-on-dark-2 text-shadow-nav hover:text-white"
      : "text-ink-900",
  );

  if (!isNavGroup(entry)) {
    return (
      <NavAnchor
        href={entry.href}
        className={linkClassName}
        active={isPathActive(pathname, entry.href)}
      >
        {entry.barLabel ?? entry.label}
      </NavAnchor>
    );
  }

  // The parent stays underlined while its panel is open, and whenever the
  // current page lives inside it (e.g. /osrodek under "O nas").
  const groupActive = entry.items.some((item) =>
    isPathActive(pathname, item.href),
  );

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        const next = e.relatedTarget as Node | null;
        if (!next || !e.currentTarget.contains(next)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        data-active={open || groupActive ? "true" : undefined}
        className={cn(linkClassName, "cursor-pointer")}
      >
        {entry.label}
      </button>
      {/* The pt-3 padding bridges the gap between trigger and panel so the
          cursor never leaves the hover area on the way down. */}
      <div
        className={cn(
          "absolute right-0 top-full z-10 pt-3 transition-opacity duration-200",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <div className="min-w-[176px] border border-line bg-cream py-1 shadow-[0_12px_30px_oklch(0.27_0.0116_145.25/0.12)]">
          {entry.items.map((item) => (
            <NavAnchor
              key={item.href + item.label}
              href={item.href}
              className="block px-4 py-3 font-heading text-[15px] text-ink-900 transition-colors hover:bg-mist hover:text-sage-700"
            >
              {item.label}
            </NavAnchor>
          ))}
        </div>
      </div>
    </div>
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
  compact = false,
}: {
  tone: Tone;
  height: string;
  nav: NavEntry[];
  contact: SiteContact;
  onBurger: () => void;
  menuOpen: boolean;
  logoWidth: string;
  /** The wordmark's "ośrodek terapii uzależnień" line — hero bar only. */
  tagline?: boolean;
  /** Tighter type and spacing, for the short bar that slides in on scroll. */
  compact?: boolean;
}) {
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        // Three tracks so the logo sits dead-center regardless of how much
        // the phone CTA or the nav links weigh on either side.
        "mx-auto grid w-full max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-gutter px-gutter",
        height,
      )}
    >
      <nav
        className={cn(
          "hidden items-center nav:flex",
          compact
            ? "gap-[clamp(14px,1.6vw,28px)]"
            : "gap-[clamp(14px,1.5vw,26px)]",
        )}
      >
        {nav.map((entry) => (
          <DesktopNavEntry
            key={entry.label}
            entry={entry}
            dark={dark}
            compact={compact}
          />
        ))}
      </nav>

      <Link
        href="/"
        className={cn(
          "col-start-2 flex shrink-0 justify-self-center",
          tagline ? "flex-col items-center gap-[5px]" : "items-center",
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
      </Link>

      <div className="col-start-3 flex items-center justify-self-end gap-gutter">
        <div className="hidden nav:flex">
          <PhoneLink contact={contact} dark={dark} compact={compact} />
        </div>

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
    </div>
  );
}

function PhoneLink({
  contact,
  dark,
  compact,
}: {
  contact: SiteContact;
  dark: boolean;
  compact: boolean;
}) {
  return (
    <a
      href={`tel:${contact.phoneHref}`}
      className={cn(
        "group inline-flex items-center border font-heading leading-none tabular-nums transition-colors",
        compact
          ? "gap-2 px-[14px] py-[7px] text-[clamp(13px,0.95vw,15px)]"
          : "gap-[9px] px-[21px] py-[11px] text-nav",
        dark
          ? "border-bone/40 bg-bone/6 text-bone text-shadow-nav hover:border-bone hover:bg-bone hover:text-ink-900"
          : "border-ink-900/25 bg-ink-900/5 text-ink-900 hover:border-ink-900 hover:bg-ink-900 hover:text-bone",
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
