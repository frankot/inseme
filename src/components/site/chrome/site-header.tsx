"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";

import { SiteImage } from "@/components/site/ui/site-image";
import { contactDefaults, type SiteContact } from "@/content/home";
import { barLinks, panelLinks, type NavItem } from "@/content/nav";
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
  nav?: NavItem[];
  mobileNav?: NavItem[];
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
          "inset-x-0 top-0 z-70 border-b border-line-strong bg-cream",
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
          logoWidth="w-[clamp(80px,6.2vw,94px)]"
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
          {mobileNav.map((item) => (
            <NavAnchor
              key={item.href + item.label}
              href={item.href}
              onClick={close}
              className="font-heading text-mob-link text-ink-900 transition-colors hover:text-sage-600"
            >
              {item.label}
            </NavAnchor>
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
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  if (href.startsWith("/") && !href.startsWith("/#")) {
    return (
      <Link href={href} onClick={onClick} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
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
  nav: NavItem[];
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
        "mx-auto flex w-full max-w-[1440px] items-center justify-between gap-gutter px-gutter",
        height,
      )}
    >
      <Link
        href="/"
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
      </Link>

      <nav
        className={cn(
          "hidden items-center nav:flex",
          compact
            ? "gap-[clamp(14px,1.6vw,28px)]"
            : "gap-[clamp(16px,1.9vw,32px)]",
        )}
      >
        {nav.map((item) => (
          <NavAnchor
            key={item.href + item.label}
            href={item.href}
            className={cn(
              "nav-link font-heading transition-colors",
              compact ? "text-[clamp(15px,1.05vw,17px)]" : "text-nav",
              dark
                ? "text-on-dark-2 text-shadow-nav hover:text-white"
                : "text-ink-900",
            )}
          >
            {item.label}
          </NavAnchor>
        ))}
        <a
          href={`tel:${contact.phoneHref}`}
          className={cn(
            "group inline-flex items-center border font-heading leading-none tabular-nums transition-colors",
            compact
              ? "gap-2 px-[17px] py-[9px] text-[clamp(15px,1.05vw,17px)]"
              : "gap-[9px] px-[21px] py-[11px] text-nav",
            dark
              ? "border-bone/40 bg-bone/6 text-bone text-shadow-nav hover:border-bone hover:bg-bone hover:text-ink-900"
              : "border-ink-900 bg-ink-900 text-bone hover:bg-transparent hover:text-ink-900",
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
