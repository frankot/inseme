import type { NextAuthConfig } from "next-auth";

/**
 * The half of the Auth.js config that carries no database client and no bcrypt.
 * `proxy.ts` instantiates NextAuth with just this, so the gate that runs on every
 * /admin request stays a JWT check with no DB dependency; `auth.ts` layers the
 * Credentials provider on top for the login call itself.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = Boolean(auth?.user);
      const { pathname, search } = request.nextUrl;

      if (pathname === "/admin/login") {
        if (!isLoggedIn) return true;
        return Response.redirect(new URL("/admin", request.nextUrl));
      }

      if (pathname === "/admin" || pathname.startsWith("/admin/")) {
        if (isLoggedIn) return true;
        const loginUrl = new URL("/admin/login", request.nextUrl);
        loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
        return Response.redirect(loginUrl);
      }

      return true;
    },
    jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id && session.user) session.user.id = token.id as string;
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
