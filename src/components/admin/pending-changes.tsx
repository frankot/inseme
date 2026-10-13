"use client";

import { useState, type ReactNode } from "react";
import { useWatch } from "react-hook-form";

import { ChangedNote, changedClass, usePublishedDiff } from "@/components/admin/cms/diff";
import { formatSavedAt } from "@/components/admin/status-badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

/**
 * Pending changes on a published record (Zespół, Artykuły): edits saved with
 * „Zapisz bez publikowania” that the site doesn't show yet. The banner tops
 * the form; `TrackedField` marks each field that differs from what is live.
 * Both read the published values from `PublishedProvider` (cms/diff.tsx), the
 * same mechanism as the CMS editor's change marks.
 */
export function PendingChangesBanner({
  savedAt,
  busy,
  onPublish,
  onDiscard,
}: {
  savedAt: string;
  busy: boolean;
  /** Saves the form as it is now and publishes it. */
  onPublish: () => void;
  /** Drops the saved changes; the form goes back to the live version. */
  onDiscard: () => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 sm:flex-row sm:items-center dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
      <div className="flex min-w-0 flex-1 gap-2.5">
        <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full bg-amber-500" />
        <p>
          <strong className="font-semibold">Niepublikowane zmiany</strong> z {formatSavedAt(savedAt)}.
          Na stronie jest nadal poprzednia wersja — zmiany widać tylko w panelu. Zmienione pola mają
          pomarańczowy znacznik z podglądem wersji ze strony.
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => setConfirmOpen(true)}>
          Odrzuć zmiany
        </Button>
        <Button type="button" size="sm" disabled={busy} onClick={onPublish}>
          Opublikuj zmiany
        </Button>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Odrzucić zmiany?</AlertDialogTitle>
            <AlertDialogDescription>
              Zapisane, nieopublikowane zmiany zostaną usunięte, a formularz wróci do wersji ze
              strony. Tego nie można cofnąć.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmOpen(false);
                onDiscard();
              }}
            >
              Odrzuć zmiany
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/**
 * Wraps one form field: when its value differs from the published one, an
 * amber rule and a note under it — „Zmienione od publikacji · pokaż
 * opublikowaną · przywróć”. Nothing shows for a draft (no published values).
 */
export function TrackedField({
  name,
  before = (value) => beforeText(value),
  onRestore,
  className,
  children,
}: {
  name: string;
  /** The published value as shown in the note; null hides „pokaż opublikowaną”. */
  before?: (value: unknown) => ReactNode;
  /** Extra UI state to put back with the value, e.g. a picked photo's preview. */
  onRestore?: (value: unknown) => void;
  className?: string;
  children: ReactNode;
}) {
  const value = useWatch({ name });
  const diff = usePublishedDiff(name, value);
  return (
    <div className={[className, changedClass(diff.changed)].filter(Boolean).join(" ") || undefined}>
      <div className="flex flex-col gap-2">
        {children}
        <ChangedNote
          diff={{
            ...diff,
            restore: () => {
              diff.restore();
              onRestore?.(diff.before);
            },
          }}
          before={diff.changed ? before(diff.before) : null}
        />
      </div>
    </div>
  );
}

/** Published text: "(puste)" rather than nothing. */
export function beforeText(value: unknown): ReactNode {
  return typeof value === "string" && value.trim() ? value : <em>(puste)</em>;
}

/** Published rich text as plain paragraphs — the note is a preview, not an editor. */
export function beforeHtml(value: unknown): ReactNode {
  if (typeof value !== "string" || !value.trim()) return <em>(puste)</em>;
  return value
    .replace(/<\/(p|h\d|li)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
