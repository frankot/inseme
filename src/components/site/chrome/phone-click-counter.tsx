"use client";

import { useEffect } from "react";

import { ctaLocation } from "@/lib/analytics";
import {
  classifySource,
  normalizePath,
  PHONE_CLICK_ENDPOINT,
  type PhoneClickPayload,
} from "@/lib/phone-clicks";

/**
 * Counts taps on any `tel:` link, for every visitor — see `src/lib/phone-clicks.ts`
 * for why that needs no consent. Nothing is written to the browser: the entry
 * page and its source live in memory for this page load only, and are lost on
 * reload like any other page state.
 *
 * Runs alongside the GA4 listener in `ConsentBanner`, which still sends its own
 * `phone_click` for visitors who accepted.
 */

/** Set on the first page of the load; client-side navigation keeps it. */
let entry: Pick<PhoneClickPayload, "landing" | "source"> | null = null;
/** A double tap, or a tap that bubbles through two handlers, counts once. */
let lastSentAt = 0;

function send(payload: PhoneClickPayload) {
  const body = JSON.stringify(payload);
  const queued = navigator.sendBeacon?.(
    PHONE_CLICK_ENDPOINT,
    new Blob([body], { type: "application/json" }),
  );
  if (queued) return;
  // No beacon, or the queue is full: `keepalive` still outlives the dialer opening.
  fetch(PHONE_CLICK_ENDPOINT, {
    method: "POST",
    body,
    headers: { "content-type": "application/json" },
    keepalive: true,
  }).catch(() => {});
}

export function PhoneClickCounter() {
  useEffect(() => {
    entry ??= {
      landing: normalizePath(window.location.pathname),
      source: classifySource(document.referrer, window.location.search, window.location.hostname),
    };

    function onClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="tel:"]');
      if (!link || !entry) return;
      const now = Date.now();
      if (now - lastSentAt < 2000) return;
      lastSentAt = now;
      send({
        page: normalizePath(window.location.pathname),
        location: ctaLocation(link),
        landing: entry.landing,
        source: entry.source,
      });
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
