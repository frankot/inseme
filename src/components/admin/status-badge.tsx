import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: "draft" | "published" }) {
  return (
    <Badge variant={status === "published" ? "default" : "secondary"}>
      {status === "published" ? "Opublikowane" : "Szkic"}
    </Badge>
  );
}

/** "12.10.2026, 14:20" — the Polish short date and time. */
export function formatSavedAt(savedAt: string | Date): string {
  return new Date(savedAt).toLocaleString("pl-PL", { dateStyle: "short", timeStyle: "short" });
}

/**
 * Beside „Opublikowane”: the record has edits saved but not published — the
 * site still shows the version before them.
 */
export function PendingBadge({ savedAt }: { savedAt?: string | Date | null }) {
  return (
    <Badge
      variant="outline"
      className="border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200"
      title={
        savedAt
          ? `Zmiany zapisane ${formatSavedAt(savedAt)} — na stronie jest poprzednia wersja`
          : "Na stronie jest poprzednia wersja"
      }
    >
      <span aria-hidden className="size-1.5 rounded-full bg-amber-500" />
      Niepublikowane zmiany
    </Badge>
  );
}
