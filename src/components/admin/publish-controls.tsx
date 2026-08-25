"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/action-result";

/**
 * The draft → publish gate. Saving never publishes; publishing is always an
 * explicit second action, so factual/medical copy can't reach the public site
 * without someone deliberately releasing it.
 */
export function PublishControls({
  status,
  publishedAt,
  onPublish,
  onUnpublish,
}: {
  status: "draft" | "published";
  publishedAt: string | null;
  onPublish: () => Promise<ActionResult>;
  onUnpublish: () => Promise<ActionResult>;
}) {
  const [isPending, startTransition] = useTransition();
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
    <div className="flex flex-wrap items-center gap-3">
      <StatusBadge status={status} />
      {publishedAt ? (
        <span className="text-xs text-muted-foreground">
          Opublikowano {new Date(publishedAt).toLocaleString("pl-PL")}
        </span>
      ) : null}
      {status === "published" ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => run(onUnpublish, "Cofnięto publikację.")}
        >
          Cofnij publikację
        </Button>
      ) : (
        <Button
          type="button"
          size="sm"
          disabled={isPending}
          onClick={() => run(onPublish, "Opublikowano.")}
        >
          Opublikuj
        </Button>
      )}
    </div>
  );
}
