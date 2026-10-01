import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CategoryBadge({
  category,
  className,
}: {
  category: Category;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full bg-jade-soft whitespace-nowrap px-2.5 py-0.5 text-xs font-semibold text-jade",
        className,
      )}
    >
      {category}
    </span>
  );
}
