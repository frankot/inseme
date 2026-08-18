/**
 * Creates (or updates the password of) an admin account.
 *
 *   npm run admin:create -- --email anna@insieme.pl --name "Anna K."
 *   npm run admin:create -- --email anna@insieme.pl --password "…"
 *
 * With no --password, a strong one is generated and printed once.
 */
import { randomBytes } from "node:crypto";

import { hash } from "bcryptjs";
import { config as loadEnv } from "dotenv";
import { eq } from "drizzle-orm";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

const BCRYPT_ROUNDS = 12;

function getFlag(name: string): string | undefined {
  const prefix = `--${name}`;
  const argv = process.argv.slice(2);
  const index = argv.findIndex((arg) => arg === prefix || arg.startsWith(`${prefix}=`));
  if (index === -1) return undefined;
  const arg = argv[index];
  if (arg.includes("=")) return arg.slice(prefix.length + 1);
  return argv[index + 1];
}

async function main() {
  const email = getFlag("email")?.trim().toLowerCase();
  const name = getFlag("name")?.trim();
  const providedPassword = getFlag("password");

  if (!email || !email.includes("@")) {
    throw new Error('Missing or invalid --email (e.g. --email admin@insieme.pl)');
  }
  if (providedPassword !== undefined && providedPassword.length < 12) {
    throw new Error("--password must be at least 12 characters");
  }

  const password = providedPassword ?? randomBytes(15).toString("base64url");
  const passwordHash = await hash(password, BCRYPT_ROUNDS);

  // Imported after dotenv so the env validation sees DATABASE_URL.
  const { db } = await import("../src/db");
  const { adminUsers } = await import("../src/db/schema");

  const existing = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.email, email),
  });

  if (existing) {
    await db
      .update(adminUsers)
      .set({ passwordHash, ...(name ? { name } : {}) })
      .where(eq(adminUsers.id, existing.id));
    console.log(`Updated password for existing admin ${email}`);
  } else {
    await db.insert(adminUsers).values({ email, name: name ?? null, passwordHash });
    console.log(`Created admin ${email}`);
  }

  if (!providedPassword) {
    console.log(`Password (shown once): ${password}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
