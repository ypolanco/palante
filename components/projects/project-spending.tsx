import { PiggyBankIcon, ReceiptIcon, WalletIcon } from "lucide-react";
import { ExpenditureTable } from "@/components/projects/expenditure-table";
import { TransparencyCard } from "@/components/transparency/transparency-card";
import type { Project } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

/** Bullet-style bars: planned amount is the track, reported spending fills it. */
function PlannedVsSpent({ project }: { project: Project }) {
  const max = Math.max(...project.budget.map((l) => l.planned));

  return (
    <figure className="rounded-2xl border bg-card p-6">
      <figcaption className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-heading text-lg font-bold text-noche">Planned vs. spent</span>
        <span className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-4 rounded-full bg-sand ring-1 ring-border" aria-hidden="true" />
            Planned
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-4 rounded-full bg-jade" aria-hidden="true" />
            Spent and reported
          </span>
        </span>
      </figcaption>
      <table className="mt-5 w-full text-sm">
        <caption className="sr-only">Planned and reported spending by category</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Spent</th>
            <th scope="col">Planned</th>
          </tr>
        </thead>
        <tbody>
          {project.budget.map((line) => (
            <tr key={line.category} className="align-middle">
              <th scope="row" className="w-36 py-2.5 pr-3 text-left font-medium text-noche sm:w-44">
                {line.category}
              </th>
              <td className="py-2.5" aria-hidden="true">
                <div
                  className="relative h-3 rounded-full bg-sand"
                  style={{ width: `${(line.planned / max) * 100}%` }}
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-jade"
                    style={{ width: `${Math.min(line.spent / line.planned, 1) * 100}%` }}
                  />
                </div>
              </td>
              <td className="tabular w-40 py-2.5 pl-3 text-right whitespace-nowrap">
                <span className="font-semibold text-noche">{formatCurrency(line.spent)}</span>
                <span className="text-muted-foreground"> / {formatCurrency(line.planned)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

export function ProjectSpending({ project }: { project: Project }) {
  const spent = project.expenditures.reduce((s, e) => s + e.amount, 0);
  const rows = [...project.expenditures].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-noche">Spending</h2>
        <p className="mt-2 max-w-[68ch] leading-relaxed text-muted-foreground">
          Every expenditure below has been reported as an independent
          expenditure. Amounts update as new reports are filed.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <TransparencyCard icon={WalletIcon} label="Raised" value={formatCurrency(project.raised)} />
        <TransparencyCard icon={ReceiptIcon} label="Spent and reported" value={formatCurrency(spent)} />
        <TransparencyCard
          icon={PiggyBankIcon}
          label="Available"
          value={formatCurrency(project.raised - spent)}
          hint="Raised minus reported spending"
        />
      </div>
      <PlannedVsSpent project={project} />
      <h3 className="pt-4 text-xl font-bold text-noche">Reported expenditures</h3>
      <ExpenditureTable rows={rows} caption={`Reported expenditures for ${project.title}`} />
    </div>
  );
}
