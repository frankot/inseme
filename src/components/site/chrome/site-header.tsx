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

/** Fraction of the viewport scrolled before the compact bar drops in. */
const REVEAL_AT = 0.7;

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
    const onScroll = () =>
      setStickyOn(window.scrollY > window.innerHeight * REVEAL_AT);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
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

  return (
    <>
      {/* Compact bar: slides down past the hero, retracts back at the top. */}
      <header
        className={cn(
          "fixed inset-x-0 top-0  z-70 border-b border-line-strong",
          "bg-cream/94 backdrop-blur-[14px] backdrop-saturate-150",
          "transition-[transform,opacity] duration-[550ms] ease-[cubic-bezier(.16,1,.3,1)]",
          stickyOn
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none",
        )}
      >
        <Bar
          tone="light"
          height="h-nav-sticky"
          nav={nav}
          contact={contact}
          onBurger={() => setMenuOpen(true)}
          logoWidth="w-[clamp(84px,6.6vw,98px)]"
        />
      </header>

      {/* Full-screen mobile panel. */}
      <div
        className={cn(
          "fixed inset-0 z-88 flex flex-col bg-cream",
          "transition-[transform,opacity] duration-[550ms] ease-[cubic-bezier(.16,1,.3,1)]",
          menuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none",
        )}
      >
        <div
          className={cn(
            "mx-auto flex w-full max-w-[1440px] shrink-0 items-center justify-between gap-gutter px-gutter",
            // Matches whichever bar the burger was tapped in, so the close
            // button lands under the user's finger.
            stickyOn ? "h-nav-sticky" : "h-nav",
          )}
        >
          <a href="#gora" onClick={close} className="flex items-center">
            <Logo className="w-24" />
          </a>
          <button
            type="button"
            onClick={close}
            aria-label="Zamknij"
            className="flex items-center gap-[11px] px-0.5 py-[11px] text-eyebrow uppercase text-ink-900"
          >
            <span>Zamknij</span>
            <span className="burger-x" aria-hidden>
              <span />
              <span />
            </span>
          </button>
        </div>

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

      {/* Transparent bar that sits on the hero photo and scrolls away with it. */}
      <header className="absolute inset-x-0 top-0 z-60">
        <Bar
          tone="dark"
          height="h-nav"
          nav={nav}
          contact={contact}
          onBurger={() => setMenuOpen(true)}
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
  logoWidth,
  tagline = false,
}: {
  tone: Tone;
  height: string;
  nav: NavItem[];
  contact: SiteContact;
  onBurger: () => void;
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
          <span className="text-[9.5px] uppercase tracking-[0.26em] text-on-dark-2/70">
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
            "inline-flex items-center gap-[9px] border font-heading text-nav leading-none tabular-nums transition-colors",
            dark
              ? "border-bone/40 bg-bone/6 px-[21px] py-[11px] text-bone text-shadow-nav hover:border-bone hover:bg-bone hover:text-ink-900"
              : "border-ink-900 bg-ink-900 px-[19px] py-2.5 text-bone hover:bg-transparent hover:text-ink-900",
          )}
        >
          {dark && (
            <span
              aria-hidden
              className="block size-[5px] rounded-full bg-sage-300"
            />
          )}
          <span>{contact.phone}</span>
        </a>
      </nav>

      <button
        type="button"
        onClick={onBurger}
        aria-label="Menu"
        className={cn(
          "flex items-center gap-[11px] px-0.5 py-[11px] text-eyebrow uppercase nav:hidden",
          dark ? "text-on-dark-2 text-shadow-nav" : "text-ink-900",
        )}
      >
        <span>Menu</span>
        <span className="burger-bars" aria-hidden>
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
