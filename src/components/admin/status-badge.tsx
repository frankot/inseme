import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: "draft" | "published" }) {
  return (
    <Badge variant={status === "published" ? "default" : "secondary"}>
      {status === "published" ? "Opublikowane" : "Szkic"}
    </Badge>
  );
}
