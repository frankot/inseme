import type { NextRequest } from "next/server";
import { z } from "zod";

import { STAFF_COOKIE } from "@/lib/analytics";
import { PHONE_CLICK_SOURCES } from "@/lib/phone-clicks";
import { recordPhoneClick } from "@/lib/queries/phone-clicks";
import { allowRequest } from "@/lib/rate-limit";

/**
 * Receives one tap on a phone number from `PhoneClickCounter` and adds it to
 * the daily totals. Nothing about the request is stored beyond the fields
 * below; the IP only passes through the rate limiter, as for the forms.
 *
 * The answer is always empty: the browser does not wait for it, and a 204 for
 * a skipped tap (staff, preview, throttled) tells a script nothing.
 */

const path = z.string().max(160).regex(/^\/[\p{L}\p{N}_.%/-]*$/u);

const clickSchema = z.object({
  page: path,
  landing: path,
  location: z.string().regex(/^[\p{L}\p{N}_-]{1,48}$/u),
  source: z.enum(PHONE_CLICK_SOURCES),
});

const done = () => new Response(null, { status: 204 });

function isSameOrigin(request: NextRequest): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite) return fetchSite === "same-origin";
  // Browsers without Fetch Metadata still send Origin on a POST.
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

/** Phone or not, from the request headers; the headers themselves are not kept. */
function deviceOf(request: NextRequest): "mobile" | "desktop" {
  const hint = request.headers.get("sec-ch-ua-mobile");
  if (hint) return hint === "?1" ? "mobile" : "desktop";
  return /Mobi|iPhone|iPod/i.test(request.headers.get("user-agent") ?? "") ? "mobile" : "desktop";
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return new Response(null, { status: 403 });
  // Staff testing the number from the panel's browser.
  if (request.cookies.has(STAFF_COOKIE)) return done();

  const raw = await request.text();
  if (raw.length > 1000) return new Response(null, { status: 413 });
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return new Response(null, { status: 400 });
  }
  const parsed = clickSchema.safeParse(json);
  if (!parsed.success) return new Response(null, { status: 400 });

  const click = { ...parsed.data, device: deviceOf(request) };

  // Local and preview builds point at the production database, so only the
  // live site writes. Elsewhere the tap is logged, to check the wiring.
  if (process.env.VERCEL_ENV !== "production") {
    console.info("phone click (not recorded outside production)", click);
    return done();
  }

  if (!(await allowRequest("phoneClick"))) return done();

  try {
    await recordPhoneClick(click);
  } catch (error) {
    // Missing table before `db:migrate`, or Neon unreachable: a lost count, never a broken call.
    console.error("phone click not recorded", error);
  }
  return done();
}
