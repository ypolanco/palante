import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function TransparencyCard({
  label,
  value,
  hint,
  icon: Icon,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border bg-card p-5", className)}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="size-4 text-jade" aria-hidden="true" />
        {label}
      </div>
      <p className="tabular mt-2 font-heading text-2xl font-bold text-noche">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
