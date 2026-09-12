"use client";

import { ChevronDown, ExternalLink, EyeOff, Globe, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ActionResult } from "@/lib/action-result";

/**
 * One menu per row on every list: edit, preview, the publish toggle and delete.
 *
 * The status badge doubles as the trigger, so the column still reads as a
 * status at a glance while the actions that change it live one click away —
 * the same set of actions the record's own page offers.
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
}: {
  editHref: string;
  status: "draft" | "published";
  /** Public URL of the record, linked once it is published. */
  publicHref?: string;
  /** Row name, used for the trigger's accessible label. */
  label: string;
  onPublish: () => Promise<ActionResult>;
  onUnpublish: () => Promise<ActionResult>;
  onDelete: () => Promise<ActionResult>;
  deleteTitle?: string;
  deleteDescription?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const router = useRouter();

  function run(action: () => Promise<ActionResult>, successMessage: string) {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(successMessage);
      router.refresh();
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className="-mx-2 gap-1.5"
              aria-label={`Akcje — ${label}`}
            />
          }
        >
          <StatusBadge status={status} />
          <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
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

          <DropdownMenuSeparator />

          {status === "published" ? (
            <DropdownMenuItem
              disabled={isPending}
              onClick={() => run(onUnpublish, "Cofnięto publikację.")}
            >
              <EyeOff aria-hidden /> Cofnij publikację
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              disabled={isPending}
              onClick={() => run(onPublish, "Opublikowano.")}
            >
              <Globe aria-hidden /> Opublikuj
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem variant="destructive" onClick={() => setConfirmOpen(true)}>
            <Trash2 aria-hidden /> Usuń
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDeleteDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={onDelete}
        title={deleteTitle}
        description={deleteDescription}
      />
    </>
  );
}
