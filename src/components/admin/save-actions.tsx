"use client";

import { useState } from "react";

import { StatusBadge } from "@/components/admin/status-badge";
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

export type SaveMode = "draft" | "publish";

/** Toasts for the two buttons, so every form says the same thing. */
export const SAVED_MESSAGE: Record<SaveMode, string> = {
  draft: "Zapisano szkic — niewidoczny na stronie.",
  publish: "Zapisano i opublikowano.",
};

/**
 * The one save bar every admin form ends with. A record is either a draft
 * (hidden from the site) or published, and each button saves the form *and*
 * sets that state — there is no separate publish step to forget.
 *
 * Saving a published record as a draft takes it off the site, so that click
 * asks first.
 */
export function SaveActions({
  status,
  publishedAt,
  submitting,
  onSave,
  canDraft = true,
}: {
  /** null for a record that doesn't exist yet. */
  status: "draft" | "published" | null;
  publishedAt?: string | null;
  submitting: boolean;
  /** The form's submit, run with the chosen state. */
  onSave: (mode: SaveMode) => void;
  /** False for a record that must stay live (a protected article). */
  canDraft?: boolean;
}) {
  const [mode, setMode] = useState<SaveMode>("publish");
  const [confirmOpen, setConfirmOpen] = useState(false);

  function save(next: SaveMode) {
    setMode(next);
    onSave(next);
  }

  return (
    <div className="sticky bottom-0 z-10 -mx-1 flex flex-wrap items-center gap-3 border-t bg-background/95 px-1 py-3">
      <div className="flex flex-wrap items-center gap-2">
        {status ? <StatusBadge status={status} /> : null}
        {status === "published" && publishedAt ? (
          <span className="text-xs text-muted-foreground">
            od {new Date(publishedAt).toLocaleString("pl-PL")}
          </span>
        ) : null}
        {status === "draft" ? (
          <span className="text-xs text-muted-foreground">Niewidoczne na stronie</span>
        ) : null}
      </div>

      <div className="ml-auto flex flex-wrap gap-2">
        {canDraft && (
          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={() => (status === "published" ? setConfirmOpen(true) : save("draft"))}
          >
            {submitting && mode === "draft" ? "Zapisywanie…" : "Zapisz szkic"}
          </Button>
        )}
        <Button type="button" disabled={submitting} onClick={() => save("publish")}>
          {submitting && mode === "publish" ? "Publikowanie…" : "Zapisz i opublikuj"}
        </Button>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Zdjąć ze strony?</AlertDialogTitle>
            <AlertDialogDescription>
              Ta pozycja jest teraz opublikowana. Zapisanie jej jako szkicu ukryje ją na stronie,
              dopóki nie klikniesz „Zapisz i opublikuj”.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmOpen(false);
                save("draft");
              }}
            >
              Zapisz szkic i ukryj
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
