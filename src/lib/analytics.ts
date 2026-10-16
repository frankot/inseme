/**
 * GA4 events, per the implementation plan §9 and `docs/GA4_PLAN.md`. Only
 * these names are ever sent. Parameters are typed per event and carry only
 * site-authored labels — a test's slug, a FAQ question, a section name —
 * never anything a visitor typed or answered: no message text, no substance,
 * no test score. On a health site the event itself is all the measurement needs.
 *
 * `track` is a no-op until the visitor has accepted analytics and `initGa` has
 * run (see `ConsentBanner`), so callers never need to check consent.
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
  | "directions_click"
  /** A link to the contact page or the homepage contact section. */
  | "cta_click"
  | "faq_open"
  /** First answer given — not merely seeing the intro. */
  | "test_start"
  | "test_complete"
  /** The result e-mail went out: a lead. */
  | "test_result_email";

type EventParams = {
  cta_click: { cta_location: string; link_path: string };
  faq_open: { faq_question: string };
  test_start: { test_slug: string };
  test_complete: { test_slug: string };
  test_result_email: { test_slug: string };
};

type ParamsFor<E extends AnalyticsEvent> = E extends keyof EventParams ? [EventParams[E]] : [];

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

/**
 * Previews and local builds still send, so the rehearsal can watch DebugView,
 * but flagged `debug_mode` — the property's Developer traffic filter keeps
 * them out of the reports. `NEXT_PUBLIC_VERCEL_ENV` is set by Vercel itself.
 */
const IS_DEBUG = process.env.NEXT_PUBLIC_VERCEL_ENV !== "production";

/** Set in the panel by `StaffMarker`; read here to tag staff visits. */
export const STAFF_COOKIE = "insieme-staff";

/** GA4 drops parameter values past 100 characters; trim rather than lose them. */
const MAX_PARAM = 100;

type Gtag = (...args: unknown[]) => void;
type GaWindow = typeof globalThis & { dataLayer?: unknown[]; gtag?: Gtag };

/**
 * Queues the consent default and config into `dataLayer`, ahead of anything
 * else, so gtag.js — loaded separately by `ConsentBanner` — replays them first
 * and no early event is lost. Idempotent; call only after consent.
 */
export function initGa(): void {
  const w = globalThis as GaWindow;
  if (!GA_ID || w.gtag) return;
  w.dataLayer = w.dataLayer || [];
  // gtag.js reads `arguments` objects specifically, not arrays.
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
  const staff = document.cookie.split(";").some((c) => c.trim().startsWith(`${STAFF_COOKIE}=`));
  w.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  w.gtag("js", new Date());
  w.gtag("config", GA_ID, {
    // `PageViews` sends them itself, with the right title and content group.
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    ...(IS_DEBUG && { debug_mode: true }),
    ...(staff && { traffic_type: "internal" }),
  });
}

export function track<E extends AnalyticsEvent>(event: E, ...params: ParamsFor<E>): void {
  const gtag = (globalThis as GaWindow).gtag;
  if (!gtag) return;
  const values = params[0] as Record<string, string> | undefined;
  if (!values) {
    gtag("event", event);
    return;
  }
  gtag(
    "event",
    event,
    Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v.slice(0, MAX_PARAM)])),
  );
}

export function trackPageView(pathname: string): void {
  const gtag = (globalThis as GaWindow).gtag;
  gtag?.("event", "page_view", {
    page_location: window.location.href,
    page_title: document.title,
    content_group: contentGroup(pathname),
  });
}

/** Site sections, for grouping landing pages in SEO reports. */
export function contentGroup(pathname: string): string {
  const first = pathname.split("/")[1] ?? "";
  if (first === "") return "home";
  if (
    ["leczenie-alkoholizmu", "leczenie-narkomanii", "detoks-i-kwalifikacja", "dla-rodziny"].includes(first)
  ) {
    return "oferta";
  }
  if (["osrodek", "program", "cennik", "galeria"].includes(first)) return "osrodek";
  if (["porady", "testy", "zespol", "kontakt"].includes(first)) return first;
  return "info";
}

type LinkEvent = {
  [E in AnalyticsEvent]: { name: E; params: ParamsFor<E> };
}[AnalyticsEvent];

/** Contact page, or the homepage's contact sections. */
const CONTACT_HASHES = new Set(["#kontakt", "#pierwszy-kontakt"]);

/**
 * Names a click on a link, or null when it is not one we measure. Phone links
 * are attributed by the nearest `data-track` ancestor (header, sticky, contact).
 */
export function eventForLink(link: HTMLAnchorElement): LinkEvent | null {
  const href = link.getAttribute("href") ?? "";
  if (href.startsWith("tel:")) {
    const area = link.closest<HTMLElement>("[data-track]")?.dataset.track;
    if (area === "header") return { name: "click_phone_header", params: [] };
    if (area === "sticky") return { name: "click_phone_sticky", params: [] };
    if (area === "contact") return { name: "click_phone_contact", params: [] };
    return { name: "click_phone_content", params: [] };
  }
  if (href.startsWith("mailto:")) return { name: "click_email", params: [] };
  if (/google\.[a-z.]+\/maps|maps\.app\.goo\.gl|openstreetmap\.org/.test(href)) {
    return { name: "directions_click", params: [] };
  }

  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin) return null;
  const toContact =
    url.pathname === "/kontakt" || (url.pathname === "/" && CONTACT_HASHES.has(url.hash));
  // Hash-only links within the contact page itself are not a CTA.
  if (!toContact || window.location.pathname === "/kontakt") return null;
  return {
    name: "cta_click",
    params: [{ cta_location: ctaLocation(link), link_path: url.pathname + url.hash }],
  };
}

/** The nearest `data-track` area, else the enclosing section's id. */
function ctaLocation(link: HTMLAnchorElement): string {
  const area = link.closest<HTMLElement>("[data-track]")?.dataset.track;
  if (area) return area;
  const section = link.closest<HTMLElement>("[id]")?.id;
  return section || "content";
}
