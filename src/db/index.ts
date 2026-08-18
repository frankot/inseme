import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { env } from "@/lib/env";
import * as schema from "./schema";

/**
 * Neon over HTTP: one round-trip per query, no connection pool to manage from
 * serverless functions. Trade-off: no multi-statement transactions. If a later
 * phase needs them (e.g. the screening-test builder writing test + questions +
 * options atomically), swap this for `drizzle-orm/neon-serverless` + Pool.
 */
export const db = drizzle(neon(env.DATABASE_URL), { schema });

export { schema };
