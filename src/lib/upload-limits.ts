/**
 * Client-safe copy of the upload limits. `src/lib/r2.ts` is server-only (it
 * imports env secrets), so the browser can't read the constants from there.
 * Server-side validation in the upload action remains the authority.
 */
export const MAX_UPLOAD_BYTES_CLIENT = 15 * 1024 * 1024;

export const ALLOWED_UPLOAD_TYPES_CLIENT = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
  "application/pdf",
] as const satisfies readonly string[];
