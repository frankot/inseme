"use client";

import { Check, ChevronDown, ExternalLink, EyeOff, Globe, Pencil, Star, Trash2 } from "lucide-react";
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
  featured = [],
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
}) {
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const router = useRouter();

  function run(action: () => Promise<ActionResult | DataResult<unknown>>, successMessage: string) {
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

      {onDelete && (
        <ConfirmDeleteDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          onConfirm={onDelete}
          title={deleteTitle}
          description={deleteDescription}
        />
      )}
    </>
  );
}
