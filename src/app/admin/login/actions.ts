"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export type LoginResult = { error: string };

/**
 * Returns only on failure — a successful `signIn` throws Next's redirect,
 * which must propagate.
 */
export async function login(values: LoginInput, callbackUrl?: string): Promise<LoginResult> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Nieprawidłowy e-mail lub hasło." };
  }

  try {
    await signIn("credentials", {
      ...parsed.data,
      // Only same-origin paths, so a crafted callbackUrl can't bounce the admin off-site.
      redirectTo: callbackUrl?.startsWith("/admin") ? callbackUrl : "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Nieprawidłowy e-mail lub hasło." };
    }
    throw error;
  }

  return { error: "Nie udało się zalogować." };
}
