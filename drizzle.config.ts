import { config as loadEnv } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Next loads .env.local automatically; drizzle-kit does not.
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    // `generate` works offline; `migrate`/`push`/`studio` need a real URL.
    url: process.env.DATABASE_URL ?? "postgres://localhost:5432/placeholder",
  },
  verbose: true,
  strict: true,
});
