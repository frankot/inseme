import NextAuth from "next-auth";

import { authConfig } from "@/auth.config";

// Next 16 renamed the `middleware` convention to `proxy`. This runs the
// dependency-free half of Auth.js (JWT check only) as the gate in front of /admin.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
