"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

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
import type { ActionResult } from "@/lib/action-result";

type ConfirmProps = {
  onConfirm: () => Promise<ActionResult>;
  title?: string;
  description?: string;
  label?: string;
  redirectTo?: string;
};

/**
 * The confirmation on its own, with no trigger — for callers that already own
 * the click that starts a delete, such as a row's actions dropdown.
 */
export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Usunąć bezpowrotnie?",
  description = "Tej operacji nie można cofnąć.",
  label = "Usuń",
  redirectTo,
}: ConfirmProps & { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleConfirm() {
    startTransition(async () => {
      const result = await onConfirm();
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      // AlertDialogAction is a plain button here — closing is ours to do.
      onOpenChange(false);
      toast.success("Usunięto.");
      if (redirectTo) router.push(redirectTo);
      else router.refresh();
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={handleConfirm}>
            {isPending ? "Usuwanie…" : label}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/** Delete button plus its confirmation, for places that need their own trigger. */
export function ConfirmDelete({
  label = "Usuń",
  iconOnly = false,
  ...props
}: ConfirmProps & { iconOnly?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size={iconOnly ? "icon" : "sm"}
        className="text-destructive hover:text-destructive"
        aria-label={iconOnly ? label : undefined}
        onClick={() => setOpen(true)}
      >
        <Trash2 className="size-4" aria-hidden />
        {iconOnly ? null : label}
      </Button>

      <ConfirmDeleteDialog open={open} onOpenChange={setOpen} label={label} {...props} />
    </>
  );
}
