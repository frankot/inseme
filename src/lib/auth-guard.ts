import { auth } from "@/auth";

/**
 * Server actions are public HTTP endpoints — the proxy only gates page routes.
 * Every mutating action calls this first.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user;
}
