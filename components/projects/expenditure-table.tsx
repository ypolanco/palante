import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Expenditure } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export interface ExpenditureRow extends Expenditure {
  project?: { slug: string; title: string };
}

export function ExpenditureTable({
  rows,
  caption,
}: {
  rows: ExpenditureRow[];
  caption: string;
}) {
  const showProject = rows.some((r) => r.project);

  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <Table>
        <caption className="sr-only">{caption}</caption>
        <TableHeader className="bg-muted/60">
          <TableRow>
            <TableHead className="pl-5">Date</TableHead>
            <TableHead>Payee and purpose</TableHead>
            {showProject ? <TableHead>Project</TableHead> : null}
            <TableHead>Category</TableHead>
            <TableHead>Report</TableHead>
            <TableHead className="pr-5 text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="tabular pl-5 text-muted-foreground">
                <time dateTime={r.date}>{formatDate(r.date, { short: true })}</time>
              </TableCell>
              <TableCell>
                <p className="font-medium text-noche">{r.payee}</p>
                <p className="text-xs text-muted-foreground">{r.purpose}</p>
              </TableCell>
              {showProject ? (
                <TableCell className="max-w-48 truncate">
                  {r.project ? (
                    <Link href={`/projects/${r.project.slug}#spending`} className="text-noche underline-offset-2 hover:underline">
                      {r.project.title}
                    </Link>
                  ) : null}
                </TableCell>
              ) : null}
              <TableCell className="text-muted-foreground">{r.category}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{r.report}</TableCell>
              <TableCell className="tabular pr-5 text-right font-semibold text-noche">
                {formatCurrency(r.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
