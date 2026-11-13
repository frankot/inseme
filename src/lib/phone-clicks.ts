/**
 * Our own count of taps on the phone number. GA4 sees a tap only when the
 * visitor accepted cookies — about half of them — so it cannot say how many
 * people tried to call. This counter needs no consent because it keeps nothing
 * about the person: no cookie, no identifier, no IP, no browser details, no
 * time of day. Each tap adds 1 to a daily total for its page, button, entry
 * page, rough source and device class (`src/db/schema/phone-clicks.ts`).
 *
 * Shared by the browser listener and the server route, so it stays free of
 * server-only imports.
 */

export const PHONE_CLICK_ENDPOINT = "/api/phone-click";

/** Where the visit came from, as one word. The server accepts only these. */
export const PHONE_CLICK_SOURCES = [
  "google",
  "gbp",
  "bing",
  "chatgpt",
  "ai",
  "facebook",
  "instagram",
  "osrodkiterapii",
  "ads-page",
  "internal",
  "direct",
  "other",
] as const;

export type PhoneClickSource = (typeof PHONE_CLICK_SOURCES)[number];

export const SOURCE_LABELS: Record<PhoneClickSource, string> = {
  google: "Google — wyniki wyszukiwania",
  gbp: "Wizytówka Google (Mapy)",
  bing: "Bing",
  chatgpt: "ChatGPT",
  ai: "Inne asystenty AI",
  facebook: "Facebook",
  instagram: "Instagram",
  osrodkiterapii: "osrodkiterapii.pl",
  "ads-page": "Strona reklamowa",
  internal: "Nieustalone (przeładowanie strony)",
  direct: "Bezpośrednio lub bez danych",
  other: "Inne strony",
};

/** Button labels from `data-track`; a section id is shown as it is. */
export const LOCATION_LABELS: Record<string, string> = {
  header: "Nagłówek",
  sticky: "Pasek na dole ekranu",
  hero: "Góra strony",
  contact: "Sekcja kontaktu",
  "article-sidebar": "Artykuł — kolumna boczna",
  footer: "Stopka",
  content: "Treść strony",
};

/** Path only, without a trailing slash, query or hash — the server rejects anything else. */
export function normalizePath(pathname: string): string {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return (path || "/").slice(0, 160);
}

const AI_HOSTS = ["perplexity.ai", "claude.ai", "gemini.google.com", "copilot.microsoft.com"];

function hostIs(host: string, domain: string): boolean {
  return host === domain || host.endsWith(`.${domain}`);
}

/**
 * Classifies the entry into one word. Read once per page load: UTM tags on the
 * entry URL first (the Maps profile links with `utm_campaign=gbp`, ChatGPT
 * adds `utm_source=chatgpt.com`), then the referrer's host. Nothing else of
 * the referrer leaves the browser.
 */
export function classifySource(referrer: string, search: string, ownHost: string): PhoneClickSource {
  const params = new URLSearchParams(search);
  const campaign = params.get("utm_campaign")?.toLowerCase() ?? "";
  const utmSource = params.get("utm_source")?.toLowerCase() ?? "";
  if (campaign === "gbp") return "gbp";
  if (utmSource.includes("chatgpt") || utmSource.includes("openai")) return "chatgpt";
  if (AI_HOSTS.some((domain) => utmSource.includes(domain.split(".")[0]))) return "ai";

  if (!referrer) return "direct";
  let host: string;
  try {
    host = new URL(referrer).hostname.toLowerCase();
  } catch {
    return "other";
  }
  const own = ownHost.toLowerCase().replace(/^www\./, "");
  if (hostIs(host, own)) return "internal";
  if (AI_HOSTS.some((domain) => hostIs(host, domain))) return "ai";
  if (hostIs(host, "chatgpt.com") || hostIs(host, "openai.com")) return "chatgpt";
  // The Google app on Android sends `android-app://com.google.android.googlequicksearchbox/`.
  if (/(^|\.)google\.[a-z.]+$/.test(host) || host.includes("googlequicksearchbox")) return "google";
  if (hostIs(host, "bing.com")) return "bing";
  if (hostIs(host, "facebook.com") || hostIs(host, "fb.com")) return "facebook";
  if (hostIs(host, "instagram.com")) return "instagram";
  if (hostIs(host, "osrodkiterapii.pl")) return "osrodkiterapii";
  if (hostIs(host, "osrodekinsieme.pl")) return "ads-page";
  return "other";
}

/** What the browser sends; validated again on the server. */
export type PhoneClickPayload = {
  page: string;
  location: string;
  landing: string;
  source: PhoneClickSource;
};
