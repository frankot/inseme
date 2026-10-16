"use client";

import { useEffect } from "react";

import { STAFF_COOKIE } from "@/lib/analytics";

/**
 * Flags this browser as staff, so its visits to the public site are tagged
 * `traffic_type: internal` and filtered out of GA4. Set from the panel rather
 * than at login so sessions that predate it get marked too. Not a credential —
 * and deliberately kept after logout: a staff browser stays a staff browser.
 */
export function StaffMarker() {
  useEffect(() => {
    document.cookie = `${STAFF_COOKIE}=1; Max-Age=31536000; Path=/; SameSite=Lax`;
  }, []);
  return null;
}
