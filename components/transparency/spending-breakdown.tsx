import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { BudgetLine } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

/**
 * Categorical chart colors, assigned in budget order (never by rank).
 * Validated for CVD separation; marigold is low-contrast, so every
 * segment also has a visible label in the legend table.
 */
export const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
];

export function colorFor(index: number) {
  return CHART_COLORS[index % CHART_COLORS.length];
}

/**
 * Stacked bar of planned spending plus a legend table that doubles as the
 * accessible data view.
 */
export function SpendingBreakdown({
  lines,
  title = "Proposed budget",
  className,
}: {
  lines: BudgetLine[];
  title?: string;
  className?: string;
}) {
  const total = lines.reduce((sum, l) => sum + l.planned, 0);

  return (
    <figure className={cn("rounded-2xl border bg-card p-6", className)}>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="font-heading text-lg font-bold text-noche">{title}</span>
        <span className="tabular text-sm text-muted-foreground">
          Total <span className="font-semibold text-noche">{formatCurrency(total)}</span>
        </span>
      </figcaption>

      <div className="mt-5 flex h-4 w-full gap-0.5" aria-hidden="true">
        {lines.map((line, i) => (
          <Tooltip key={line.category}>
            <TooltipTrigger asChild>
              <span
                className="h-full min-w-1 first:rounded-l-full last:rounded-r-full"
                style={{
                  width: `${(line.planned / total) * 100}%`,
                  background: colorFor(i),
                }}
              />
            </TooltipTrigger>
            <TooltipContent>
              {line.category}: {formatCurrency(line.planned)} (
              {Math.round((line.planned / total) * 100)}%)
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      <table className="mt-6 w-full text-sm">
        <caption className="sr-only">{title} by category</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Amount</th>
            <th scope="col">Share</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line, i) => (
            <tr key={line.category} className="border-t border-border/70 first:border-t-0">
              <th scope="row" className="py-2.5 text-left font-medium text-noche">
                <span className="inline-flex items-center gap-2.5">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ background: colorFor(i) }}
                    aria-hidden="true"
                  />
                  {line.category}
                </span>
              </th>
              <td className="tabular py-2.5 text-right font-semibold text-noche">
                {formatCurrency(line.planned)}
              </td>
              <td className="tabular w-16 py-2.5 text-right text-muted-foreground">
                {Math.round((line.planned / total) * 100)}%
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-noche/80">
            <th scope="row" className="pt-3 text-left font-bold text-noche">
              Total
            </th>
            <td className="tabular pt-3 text-right font-bold text-noche">
              {formatCurrency(total)}
            </td>
            <td className="tabular pt-3 text-right text-muted-foreground">100%</td>
          </tr>
        </tfoot>
      </table>
    </figure>
  );
}
