import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * Dependency-free single-series charts. Marks follow the data-viz spec:
 * thin columns with 4px rounded data-ends, 2px gaps, hairline solid grid,
 * per-mark hover tooltips, and a table view for screen readers and exact values.
 */

export interface ColumnDatum {
  key: string;
  /** Short axis label, e.g. "Sep 12". */
  label: string;
  value: number;
  /** Extra tooltip lines, e.g. ["4 contributions"]. */
  details?: string[];
}

function niceMax(max: number): number {
  if (max <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(max));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * magnitude >= max) ?? 10;
  return step * magnitude;
}

export function ColumnChart({
  data,
  title,
  formatValue,
  valueLabel,
  height = 200,
  className,
}: {
  data: ColumnDatum[];
  title: string;
  formatValue: (value: number) => string;
  /** Column header for the table view, e.g. "Raised". */
  valueLabel: string;
  height?: number;
  className?: string;
}) {
  const max = niceMax(Math.max(...data.map((d) => d.value), 0));
  const ticks = [max, max / 2, 0];
  const labelEvery = Math.max(1, Math.ceil(data.length / 6));

  return (
    <figure className={cn("min-w-0", className)}>
      <div className="flex gap-3">
        <div className="tabular flex flex-col justify-between text-right text-xs text-muted-foreground" style={{ height }} aria-hidden="true">
          {ticks.map((t) => (
            <span key={t} className="-translate-y-1/2 leading-none last:translate-y-1/2">
              {formatValue(t)}
            </span>
          ))}
        </div>
        <div className="relative min-w-0 flex-1">
          <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col justify-between" style={{ height }} aria-hidden="true">
            {ticks.map((t) => (
              <span key={t} className="h-px w-full bg-border" />
            ))}
          </div>
          <div className="relative flex items-end gap-0.5" style={{ height }} aria-hidden="true">
            {data.map((d) => (
              <Tooltip key={d.key}>
                <TooltipTrigger asChild>
                  {/* Full-height hit target, larger than the visible mark. */}
                  <span className="group flex h-full flex-1 cursor-default items-end justify-center">
                    <span
                      className="w-full max-w-6 rounded-t-[4px] bg-jade transition-opacity group-hover:opacity-80"
                      style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value > 0 ? 2 : 0 }}
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-left">
                  <p className="font-semibold">{d.label}</p>
                  <p className="tabular">{formatValue(d.value)}</p>
                  {d.details?.map((line) => (
                    <p key={line} className="tabular opacity-80">{line}</p>
                  ))}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
          <div className="mt-2 flex gap-0.5 text-xs text-muted-foreground" aria-hidden="true">
            {data.map((d, i) => (
              <span key={d.key} className="flex-1 text-center whitespace-nowrap">
                {i % labelEvery === 0 ? d.label : ""}
              </span>
            ))}
          </div>
        </div>
      </div>
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer text-muted-foreground hover:text-noche">View as table</summary>
        <table className="mt-2 w-full text-left">
          <caption className="sr-only">{title}</caption>
          <thead>
            <tr className="text-muted-foreground">
              <th className="py-1 font-medium">Date</th>
              <th className="py-1 text-right font-medium">{valueLabel}</th>
            </tr>
          </thead>
          <tbody className="tabular">
            {data.map((d) => (
              <tr key={d.key} className="border-t">
                <td className="py-1">{d.label}</td>
                <td className="py-1 text-right">{formatValue(d.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

export interface BarDatum {
  key: string;
  label: string;
  value: number;
  /** Secondary text under the label, e.g. "12 contributions". */
  note?: string;
}

/** Horizontal bars for ranked categories, values labeled directly (few rows). */
export function BarList({
  data,
  formatValue,
  className,
}: {
  data: BarDatum[];
  formatValue: (value: number) => string;
  className?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <ul className={cn("space-y-3", className)}>
      {data.map((d) => (
        <li key={d.key}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="font-medium text-noche">{d.label}</span>
            <span className="tabular font-semibold text-noche">{formatValue(d.value)}</span>
          </div>
          <div className="mt-1.5 h-2.5 w-full rounded-r-[4px] bg-muted" aria-hidden="true">
            <div className="h-full rounded-r-[4px] bg-jade" style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
          {d.note ? <p className="tabular mt-1 text-xs text-muted-foreground">{d.note}</p> : null}
        </li>
      ))}
    </ul>
  );
}
