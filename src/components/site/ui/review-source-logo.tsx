import type { ReviewSourceId } from "@/content/opinie";

export function ReviewSourceLogo({
  source,
  className,
}: {
  source: ReviewSourceId;
  className?: string;
}) {
  return source === "google" ? (
    <GoogleLogo className={className} />
  ) : (
    <OsrodkiTerapiiLogo className={className} />
  );
}

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className}>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

/** Hand-traced from the osrodkiterapii.pl mark, background removed. */
function OsrodkiTerapiiLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 116" aria-hidden className={className}>
      <path fill="#7DB3E3" d="M92 34v72a6 6 0 0 1-6 6H64z" />
      <path
        fill="#22386B"
        d="M6 46a8 8 0 0 1 4.2-7L50 17a8 8 0 0 1 7.8.1L74 24 54 112H14a8 8 0 0 1-8-8z"
      />
      <path fill="#fff" d="M10 74c14-16 30-24 48-26l-6 22c-14 0-28 4-42 14z" />
      <circle cx="64" cy="34" r="9" fill="#fff" />
      <path fill="#22386B" d="M83 2h7v9h9v7h-9v9h-7v-9h-9v-7h9z" />
    </svg>
  );
}
