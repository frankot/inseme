import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from "@/auth.config";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { loginSchema } from "@/lib/validations/auth";

/**
 * A bcrypt hash of a random string. Compared against when no user matches, so a
 * wrong e-mail costs the same time as a wrong password — otherwise response
 * timing leaks which admin addresses exist.
 */
const DUMMY_HASH = "$2b$12$9RTx0zguuRbcu5gewOwUBuSDbGkfxQrWZMLxNRoFEIizGcNcist6i";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Hasło", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const email = parsed.data.email.trim().toLowerCase();
        const user = await db.query.adminUsers.findFirst({
          where: eq(adminUsers.email, email),
        });

        const passwordMatches = await compare(
          parsed.data.password,
          user?.passwordHash ?? DUMMY_HASH,
        );
        if (!user || !passwordMatches) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
});
