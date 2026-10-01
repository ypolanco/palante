import { FlaskConicalIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MockDataNote({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-muted-foreground",
        className,
      )}
    >
      <FlaskConicalIcon className="size-3.5" aria-hidden="true" />
      Development preview with mock data
    </p>
  );
}
