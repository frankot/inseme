/**
 * GA4 events, per the implementation plan §9. Only these names are ever sent,
 * and never with a payload: no message text, no substance, no test answers —
 * on a health site the event itself is all the measurement needs.
 *
 * `track` is a no-op until the visitor has accepted analytics and gtag has
 * loaded (see `ConsentBanner`), so callers never need to check consent.
 */
export type AnalyticsEvent =
  | "click_phone_header"
  | "click_phone_sticky"
  | "click_phone_contact"
  /** Any other phone link — hero, article sidebar, /osrodek. */
  | "click_phone_content"
  | "click_email"
  | "form_start"
  | "form_submit"
  | "directions_click";

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

type Gtag = (...args: unknown[]) => void;

export function track(event: AnalyticsEvent): void {
  const gtag = (globalThis as { gtag?: Gtag }).gtag;
  gtag?.("event", event);
}

/**
 * Names a click on a link, or null when it is not one we measure. Phone links
 * are attributed by the nearest `data-track` ancestor (header, sticky, contact).
 */
export function eventForLink(link: HTMLAnchorElement): AnalyticsEvent | null {
  const href = link.getAttribute("href") ?? "";
  if (href.startsWith("tel:")) {
    const area = link.closest<HTMLElement>("[data-track]")?.dataset.track;
    if (area === "header") return "click_phone_header";
    if (area === "sticky") return "click_phone_sticky";
    if (area === "contact") return "click_phone_contact";
    return "click_phone_content";
  }
  if (href.startsWith("mailto:")) return "click_email";
  if (/google\.[a-z.]+\/maps|maps\.app\.goo\.gl|openstreetmap\.org/.test(href)) {
    return "directions_click";
  }
  return null;
}
