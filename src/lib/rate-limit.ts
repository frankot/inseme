import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

import { env } from "@/lib/env";

/**
 * Serverless functions keep no state between invocations, so throttling has to
 * live outside the process. Upstash is optional: without its env vars every
 * check passes and the honeypot is the only guard — enough for local work, not
 * for production. `docs/ENV.md` says so out loud.
 */
const redis =
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

export type LimitName = "contact" | "screening" | "signup";

/**
 * Deliberately generous — these are people in distress, not an API. The point
 * is to stop a script hammering the form, not to police a second attempt.
 */
const LIMITS: Record<LimitName, { tokens: number; window: `${number} ${"s" | "m" | "h"}` }> = {
  contact: { tokens: 5, window: "10 m" },
  screening: { tokens: 8, window: "10 m" },
  signup: { tokens: 5, window: "10 m" },
};

const limiters = new Map<LimitName, Ratelimit>();

function limiterFor(name: LimitName): Ratelimit | null {
  if (!redis) return null;
  const existing = limiters.get(name);
  if (existing) return existing;

  const { tokens, window } = LIMITS[name];
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(tokens, window),
    prefix: `insieme:${name}`,
    analytics: false,
  });
  limiters.set(name, limiter);
  return limiter;
}

/** Best-effort client address; Vercel sets `x-forwarded-for`. */
async function clientKey(): Promise<string> {
  const store = await headers();
  const forwarded = store.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || store.get("x-real-ip") || "unknown";
  return ip;
}

/**
 * True when the caller may proceed. Fails **open**: if Upstash is unreachable,
 * a person trying to ask for help gets through rather than a 429 they cannot
 * interpret. Abuse is the lesser risk here.
 */
export async function allowRequest(name: LimitName): Promise<boolean> {
  const limiter = limiterFor(name);
  if (!limiter) return true;

  try {
    const { success } = await limiter.limit(await clientKey());
    return success;
  } catch (error) {
    console.error("rate limit check failed, allowing request", error);
    return true;
  }
}
