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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/action-result";

export function ConfirmDelete({
  onConfirm,
  title = "Usunąć bezpowrotnie?",
  description = "Tej operacji nie można cofnąć.",
  label = "Usuń",
  iconOnly = false,
  redirectTo,
}: {
  onConfirm: () => Promise<ActionResult>;
  title?: string;
  description?: string;
  label?: string;
  iconOnly?: boolean;
  redirectTo?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function handleConfirm() {
    startTransition(async () => {
      const result = await onConfirm();
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      // AlertDialogAction is a plain button here — closing is ours to do.
      setOpen(false);
      toast.success("Usunięto.");
      if (redirectTo) router.push(redirectTo);
      else router.refresh();
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            variant="ghost"
            size={iconOnly ? "icon" : "sm"}
            className="text-destructive hover:text-destructive"
            aria-label={iconOnly ? label : undefined}
          />
        }
      >
        <Trash2 className="size-4" aria-hidden />
        {iconOnly ? null : label}
      </AlertDialogTrigger>
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
