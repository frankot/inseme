"use client";

import { Check, ExternalLink, EyeOff, Globe, MoreHorizontal, Pencil, Send, Star, Trash2, Undo2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete";
import { PendingBadge, StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ActionResult, DataResult } from "@/lib/action-result";

/**
 * "Show this on the homepage" — one per CMS slot the record's kind can fill.
 * The same doc the CMS editor writes (plans/CMS_PLAN.md §3); the change is
 * live at once.
 */
export type FeaturedToggle = {
  label: string;
  on: boolean;
  /** The slot is at its limit — switching this one on would be refused. */
  full?: boolean;
  onToggle: () => Promise<ActionResult | DataResult<unknown>>;
};

/**
 * The status and the menu at the end of every list row.
 *
 * The status badge is a switch: one click publishes a draft or hides a
 * published record, with "Cofnij" in the confirmation to undo a misclick. A
 * record that must stay live (`onUnpublish` omitted) shows a plain badge.
 *
 * The ⋯ button opens the menu — edit, preview, homepage picks, publishing and
 * delete, the same set of actions the record's own page offers.
 *
 * A published record with edits saved but not published (`pendingChanges`)
 * gets an amber badge beside its status, and the menu offers to publish or
 * discard them.
 */
export function RowActions({
  editHref,
  status,
  publicHref,
  label,
  onPublish,
  onUnpublish,
  onDelete,
  deleteTitle,
  deleteDescription,
  featured = [],
  pendingChanges,
}: {
  editHref: string;
  status: "draft" | "published";
  /** Public URL of the record, linked once it is published. */
  publicHref?: string;
  /** Row name, used for the trigger's accessible label. */
  label: string;
  onPublish: () => Promise<ActionResult>;
  /** Omit for a record that must stay live — the item is then not offered. */
  onUnpublish?: () => Promise<ActionResult>;
  /** Omit for a record that cannot be deleted. */
  onDelete?: () => Promise<ActionResult>;
  deleteTitle?: string;
  deleteDescription?: string;
  featured?: FeaturedToggle[];
  /** Saved-but-unpublished edits (Zespół, Artykuły); omit when there are none. */
  pendingChanges?: {
    savedAt: string | null;
    onPublish: () => Promise<ActionResult>;
    onDiscard: () => Promise<ActionResult>;
  };
}) {
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const showPending = Boolean(pendingChanges) && status === "published";
  const router = useRouter();

  function run(
    action: () => Promise<ActionResult | DataResult<unknown>>,
    successMessage: string,
    undo?: () => Promise<ActionResult>,
  ) {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(successMessage, undo ? { action: { label: "Cofnij", onClick: () => run(undo, "Cofnięto.") } } : undefined);
      router.refresh();
    });
  }

  // The badge's click: the opposite of the current status, undoable.
  const toggle =
    status === "published"
      ? onUnpublish && (() => run(onUnpublish, "Ukryto — zmieniono na szkic.", onPublish))
      : () => run(onPublish, "Opublikowano.", onUnpublish);

  return (
    <div className="flex items-center gap-2">
      {toggle ? (
        <button
          type="button"
          onClick={toggle}
          disabled={isPending}
          title={status === "published" ? "Kliknij, aby ukryć (zmienić na szkic)" : "Kliknij, aby opublikować"}
          aria-label={`${label}: ${status === "published" ? "opublikowane — kliknij, aby ukryć" : "szkic — kliknij, aby opublikować"}`}
          className="rounded-full transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50"
        >
          <StatusBadge status={status} />
        </button>
      ) : (
        <span title="Ten wpis musi pozostać opublikowany">
          <StatusBadge status={status} />
        </span>
      )}

      {showPending ? <PendingBadge savedAt={pendingChanges?.savedAt} /> : null}

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              className="size-8 shrink-0"
              aria-label={`Więcej akcji — ${label}`}
              title="Więcej akcji"
            />
          }
        >
          <MoreHorizontal className="size-5" aria-hidden />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuItem render={<Link href={editHref} />}>
            <Pencil aria-hidden /> Edytuj
          </DropdownMenuItem>

          {publicHref && status === "published" ? (
            <DropdownMenuItem
              render={<a href={publicHref} target="_blank" rel="noopener noreferrer" />}
            >
              <ExternalLink aria-hidden /> Zobacz na stronie
            </DropdownMenuItem>
          ) : null}

          {featured.length > 0 && (
            <>
              <DropdownMenuSeparator />
              {featured.map((item) => (
                <DropdownMenuItem
                  key={item.label}
                  disabled={isPending || item.full}
                  title={item.full ? "Limit osiągnięty — najpierw odznacz inną pozycję." : undefined}
                  onClick={() =>
                    run(item.onToggle, item.on ? "Usunięto ze strony głównej." : "Dodano na stronę główną.")
                  }
                >
                  {item.on ? <Check aria-hidden /> : <Star aria-hidden />}
                  <span className="min-w-0 truncate">{item.label}</span>
                </DropdownMenuItem>
              ))}
            </>
          )}

          <DropdownMenuSeparator />

          {showPending && pendingChanges ? (
            <>
              <DropdownMenuItem
                disabled={isPending}
                onClick={() => run(pendingChanges.onPublish, "Opublikowano zmiany.")}
              >
                <Send aria-hidden /> Opublikuj zmiany
              </DropdownMenuItem>
              <DropdownMenuItem disabled={isPending} onClick={() => setDiscardOpen(true)}>
                <Undo2 aria-hidden /> Odrzuć zmiany
              </DropdownMenuItem>
            </>
          ) : null}

          {status === "published" ? (
            onUnpublish && (
              <DropdownMenuItem
                disabled={isPending}
                onClick={() => run(onUnpublish, "Zmieniono na szkic — ukryte na stronie.")}
              >
                <EyeOff aria-hidden /> Zmień na szkic (ukryj)
              </DropdownMenuItem>
            )
          ) : (
            <DropdownMenuItem
              disabled={isPending}
              onClick={() => run(onPublish, "Opublikowano.")}
            >
              <Globe aria-hidden /> Opublikuj
            </DropdownMenuItem>
          )}

          {onDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setConfirmOpen(true)}>
                <Trash2 aria-hidden /> Usuń
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {pendingChanges && (
        <ConfirmDeleteDialog
          open={discardOpen}
          onOpenChange={setDiscardOpen}
          onConfirm={pendingChanges.onDiscard}
          title="Odrzucić zmiany?"
          description="Zapisane, nieopublikowane zmiany zostaną usunięte. Na stronie zostaje obecna wersja."
          label="Odrzuć zmiany"
          busyLabel="Odrzucanie…"
          successMessage="Odrzucono zmiany."
        />
      )}

      {onDelete && (
        <ConfirmDeleteDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          onConfirm={onDelete}
          title={deleteTitle}
          description={deleteDescription}
        />
      )}
    </div>
  );
}
