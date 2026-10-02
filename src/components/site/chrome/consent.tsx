"use client";

import Script from "next/script";
import { useEffect, useSyncExternalStore } from "react";

import { footerDefaults } from "@/content/home";
import { eventForLink, GA_ID, track } from "@/lib/analytics";

/**
 * GA4 behind a consent banner (Consent Mode v2, "basic"): nothing from Google
 * loads until the visitor accepts — not even a cookieless ping. On a site
 * people visit about addiction, an analytics request before consent is itself
 * a disclosure, so the stricter mode is the only reasonable one.
 *
 * Accepting grants analytics storage only; every advertising signal stays
 * denied and Google signals are off, so there is no remarketing to switch on
 * by accident. Without `NEXT_PUBLIC_GA_ID` the whole thing renders nothing.
 */

const STORAGE_KEY = "insieme-consent";
const CHANGE_EVENT = "insieme:consent";
const OPEN_EVENT = "insieme:consent-open";

type Choice = "granted" | "denied";
/** `unknown` on the server and before hydration, so the banner never flashes. */
type Snapshot = Choice | "unset" | "unknown";

function read(): Snapshot {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : "unset";
  } catch {
    return "unset";
  }
}

function write(choice: Choice | null) {
  try {
    if (choice) window.localStorage.setItem(STORAGE_KEY, choice);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage blocked: the choice holds for this page view only.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Withdrawing consent also removes what GA already stored. */
function clearGaCookies() {
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim();
    if (!name?.startsWith("_ga")) continue;
    const host = window.location.hostname.replace(/^www\./, "");
    for (const domain of ["", `; domain=${host}`, `; domain=.${host}`]) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
    }
  }
}

export function ConsentBanner() {
  const choice = useSyncExternalStore<Snapshot>(subscribe, read, () => "unknown");
  const reopened = useSyncExternalStore(subscribeOpen, readOpen, () => false);

  // Measured clicks: one delegated listener instead of a handler on every
  // phone link. Mounted only after consent, so it can never fire before.
  useEffect(() => {
    if (choice !== "granted") return;
    function onClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest?.("a");
      if (!link) return;
      const name = eventForLink(link);
      if (name) track(name);
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [choice]);

  if (!GA_ID) return null;

  function decide(next: Choice) {
    const wasGranted = choice === "granted";
    closeOpen();
    write(next);
    if (next === "denied" && wasGranted) {
      clearGaCookies();
      // gtag cannot be unloaded; a reload is the honest way to stop it.
      window.location.reload();
    }
  }

  const showBanner = choice === "unset" || reopened;
  const privacyHref = footerDefaults.privacyHref !== "#" ? footerDefaults.privacyHref : null;

  return (
    <>
      {choice === "granted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
gtag('js',new Date());
gtag('config','${GA_ID}',{allow_google_signals:false,allow_ad_personalization_signals:false});`}
          </Script>
        </>
      )}

      {showBanner && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="consent-title"
          className="fixed inset-x-0 bottom-0 z-[70] bg-ink-950 text-on-dark shadow-[0_-8px_32px_oklch(0.2_0.01_145/0.18)] tab:inset-x-auto tab:bottom-5 tab:left-5 tab:max-w-[30rem]"
        >
          <div className="flex flex-col gap-4 p-[clamp(20px,2vw,28px)]">
            <p id="consent-title" className="font-heading text-[19px] leading-tight tracking-[-0.02em]">
              Czy możemy liczyć odwiedziny?
            </p>
            <p className="text-meta text-on-dark-muted">
              Z Twoją zgodą Google Analytics zapisze, które strony są czytane i czy ktoś
              zadzwonił z telefonu. Nie wysyłamy treści wiadomości, odpowiedzi z testów
              ani niczego do reklam. Bez zgody strona działa tak samo.
              {privacyHref && (
                <>
                  {" "}
                  <a href={privacyHref} className="text-on-dark underline underline-offset-4">
                    Polityka prywatności
                  </a>
                </>
              )}
            </p>
            {/* Equal weight on purpose: refusing must be as easy as agreeing. */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => decide("denied")}
                className="border border-on-dark/30 px-4 py-3 text-body text-on-dark transition-colors hover:border-on-dark"
              >
                Nie zgadzam się
              </button>
              <button
                type="button"
                onClick={() => decide("granted")}
                className="bg-bone px-4 py-3 text-body text-ink-900 transition-colors hover:bg-mist"
              >
                Zgadzam się
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* The footer's "Ustawienia cookies" reopens the banner without a reload. */

let openRequested = false;

function subscribeOpen(onChange: () => void) {
  window.addEventListener(OPEN_EVENT, onChange);
  return () => window.removeEventListener(OPEN_EVENT, onChange);
}

function readOpen() {
  return openRequested;
}

function closeOpen() {
  openRequested = false;
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function ConsentSettingsButton({ className }: { className?: string }) {
  if (!GA_ID) return null;
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        openRequested = true;
        window.dispatchEvent(new Event(OPEN_EVENT));
      }}
    >
      Ustawienia cookies
    </button>
  );
}
