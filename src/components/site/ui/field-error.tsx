import { cn } from "@/lib/utils";

/**
 * The error line under one field. Each field shows its own message where it
 * is, so an unticked consent box isn't hidden behind an error elsewhere in
 * the form. Point the field's `aria-describedby` at `id`.
 */
export function FieldError({
  id,
  message,
  className,
}: {
  id: string;
  message?: string;
  className?: string;
}) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className={cn("text-meta text-destructive", className)}>
      {message}
    </p>
  );
}
