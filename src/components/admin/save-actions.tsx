"use client";

import { useState } from "react";

import { PendingBadge, StatusBadge } from "@/components/admin/status-badge";
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

export type SaveMode = "draft" | "publish" | "pending";

/** Toasts for the buttons, so every form says the same thing. */
export const SAVED_MESSAGE: Record<SaveMode, string> = {
  draft: "Zapisano szkic — niewidoczny na stronie.",
  publish: "Zapisano i opublikowano.",
  pending: "Zapisano zmiany — na stronie nadal jest poprzednia wersja.",
};

/**
 * The one save bar every admin form ends with. A record is either a draft
 * (hidden from the site) or published, and each button saves the form *and*
 * sets that state — there is no separate publish step to forget.
 *
 * Saving a published record as a draft takes it off the site, so that click
 * asks first.
 *
 * With `pendingChanges` (Zespół, Artykuły) a published record works the other
 * way: the secondary button saves the edits *beside* the live version, which
 * stays on the site until published, and taking the record off the site is a
 * separate „Ukryj ze strony” (`onHide`).
 */
export function SaveActions({
  status,
  publishedAt,
  submitting,
  onSave,
  canDraft = true,
  pendingChanges,
  onHide,
}: {
  /** null for a record that doesn't exist yet. */
  status: "draft" | "published" | null;
  publishedAt?: string | null;
  submitting: boolean;
  /** The form's submit, run with the chosen state. */
  onSave: (mode: SaveMode) => void;
  /** False for a record that must stay live (a protected article). */
  canDraft?: boolean;
  /**
   * The form supports pending changes on a published record. `savedAt` is
   * when the current ones were saved, null when there are none.
   */
  pendingChanges?: { savedAt: string | null };
  /** Takes a published record off the site (with `pendingChanges`). */
  onHide?: () => void;
}) {
  const [mode, setMode] = useState<SaveMode>("publish");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const keepsLive = status === "published" && pendingChanges !== undefined;
  const hasPending = keepsLive && pendingChanges.savedAt !== null;

  function save(next: SaveMode) {
    setMode(next);
    onSave(next);
  }

  return (
    <div className="sticky bottom-0 z-10 -mx-1 flex flex-wrap items-center gap-3 border-t bg-background/95 px-1 py-3">
      <div className="flex flex-wrap items-center gap-2">
        {status ? <StatusBadge status={status} /> : null}
        {hasPending ? <PendingBadge savedAt={pendingChanges?.savedAt} /> : null}
        {status === "published" && publishedAt && !hasPending ? (
          <span className="text-xs text-muted-foreground">
            od {new Date(publishedAt).toLocaleString("pl-PL")}
          </span>
        ) : null}
        {status === "draft" ? (
          <span className="text-xs text-muted-foreground">Niewidoczne na stronie</span>
        ) : null}
      </div>

      <div className="ml-auto flex flex-wrap gap-2">
        {keepsLive ? (
          <>
            {canDraft && onHide && (
              <Button
                type="button"
                variant="ghost"
                disabled={submitting}
                onClick={() => setConfirmOpen(true)}
              >
                Ukryj ze strony
              </Button>
            )}
            <Button type="button" variant="outline" disabled={submitting} onClick={() => save("pending")}>
              {submitting && mode === "pending" ? "Zapisywanie…" : "Zapisz bez publikowania"}
            </Button>
          </>
        ) : (
          canDraft && (
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => (status === "published" ? setConfirmOpen(true) : save("draft"))}
            >
              {submitting && mode === "draft" ? "Zapisywanie…" : "Zapisz szkic"}
            </Button>
          )
        )}
        <Button type="button" disabled={submitting} onClick={() => save("publish")}>
          {submitting && mode === "publish"
            ? "Publikowanie…"
            : hasPending
              ? "Zapisz i opublikuj zmiany"
              : "Zapisz i opublikuj"}
        </Button>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Zdjąć ze strony?</AlertDialogTitle>
            <AlertDialogDescription>
              {keepsLive
                ? "Pozycja zniknie ze strony (status: szkic), dopóki jej znowu nie opublikujesz. Zmiany w formularzu nie są przy tym zapisywane."
                : "Ta pozycja jest teraz opublikowana. Zapisanie jej jako szkicu ukryje ją na stronie, dopóki nie klikniesz „Zapisz i opublikuj”."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmOpen(false);
                if (keepsLive) onHide?.();
                else save("draft");
              }}
            >
              {keepsLive ? "Ukryj ze strony" : "Zapisz szkic i ukryj"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
