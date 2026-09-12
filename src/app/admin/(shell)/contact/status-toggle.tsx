"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { setContactStatus } from "@/app/admin/(shell)/contact/actions";
import { Button } from "@/components/ui/button";

export function StatusToggle({
  id,
  status,
}: {
  id: string;
  status: "new" | "handled";
}) {
  const [pending, start] = useTransition();
  const next = status === "new" ? "handled" : "new";

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const result = await setContactStatus(id, next);
          if (!result.ok) toast.error(result.error);
        })
      }
    >
      {status === "new" ? "Oznacz jako załatwione" : "Cofnij do nowych"}
    </Button>
  );
}
