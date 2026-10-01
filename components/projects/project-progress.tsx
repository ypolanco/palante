import { cn, percentFunded } from "@/lib/utils";

export function ProjectProgress({
  raised,
  goal,
  label,
  animate = false,
  size = "md",
  className,
}: {
  raised: number;
  goal: number;
  /** Accessible name, e.g. the project title. */
  label: string;
  animate?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const pct = percentFunded(raised, goal);
  const width = Math.min(pct, 100);

  return (
    <div
      role="progressbar"
      aria-label={`${label} funding progress`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={width}
      aria-valuetext={`${pct}% funded`}
      className={cn(
        "relative w-full overflow-hidden rounded-full bg-sand",
        size === "sm" && "h-1.5",
        size === "md" && "h-2",
        size === "lg" && "h-3",
        className,
      )}
    >
      <div
        className={cn("h-full rounded-full bg-jade", animate && "animate-fill")}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
