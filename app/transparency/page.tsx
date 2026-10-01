import type { Metadata } from "next";
import Link from "next/link";
import {
  FileTextIcon,
  ReceiptIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";
import { Container, PageHeader, SectionHeading } from "@/components/layout/section";
import { MockDataNote } from "@/components/layout/mock-data-note";
import { ExpenditureTable } from "@/components/projects/expenditure-table";
import { SpendingBreakdown } from "@/components/transparency/spending-breakdown";
import { TransparencyCard } from "@/components/transparency/transparency-card";
import { COMMITTEE, projects } from "@/lib/mock-data";
import type { BudgetLine } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Transparency",
  description: "See how money raised on Palante Together is spent and reported.",
};

/** Reported spending across all active projects, grouped by category. */
function aggregateSpending(): BudgetLine[] {
  const byCategory = new Map<string, number>();
  for (const p of projects) {
    for (const e of p.expenditures) {
      byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + e.amount);
    }
  }
  const sorted = [...byCategory.entries()].sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 6);
  const otherTotal = sorted.slice(6).reduce((s, [, v]) => s + v, 0);
  const lines = top.map(([category, amount]) => ({ category, planned: amount, spent: amount }));
  if (otherTotal > 0) lines.push({ category: "Other", planned: otherTotal, spent: otherTotal });
  return lines;
}

export default function TransparencyPage() {
  const raised = projects.reduce((s, p) => s + p.raised, 0);
  const contributors = projects.reduce((s, p) => s + p.contributors, 0);
  const expenditures = projects
    .flatMap((p) => p.expenditures.map((e) => ({ ...e, project: { slug: p.slug, title: p.title } })))
    .sort((a, b) => b.date.localeCompare(a.date));
  const spent = expenditures.reduce((s, e) => s + e.amount, 0);

  return (
    <>
      <PageHeader
        title="Follow the money"
        description="Every dollar raised for an active project, and every independent expenditure reported against it, in one place."
      >
        <MockDataNote className="mt-6" />
      </PageHeader>

      <Container className="space-y-16 py-12">
        <section aria-label="Totals across active projects">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <TransparencyCard icon={WalletIcon} label="Raised, active projects" value={formatCurrency(raised)} />
            <TransparencyCard icon={ReceiptIcon} label="Spent and reported" value={formatCurrency(spent)} />
            <TransparencyCard icon={UsersIcon} label="Contributors" value={formatNumber(contributors)} />
            <TransparencyCard icon={FileTextIcon} label="Expenditure reports" value={String(expenditures.length)} />
          </div>
        </section>

        <section aria-labelledby="by-category" className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <SectionHeading
            id="by-category"
            title="Where spending goes"
            description="Reported independent expenditures across all active projects, by category. Smaller categories are grouped as Other."
          />
          <SpendingBreakdown lines={aggregateSpending()} title="Reported spending by category" />
        </section>

        <section aria-labelledby="recent-exp" className="space-y-6">
          <SectionHeading
            id="recent-exp"
            title="Recent expenditures"
            description="Payees, purposes, and the report each expenditure was filed on."
          />
          <ExpenditureTable rows={expenditures} caption="All reported expenditures, newest first" />
        </section>

        <section id="filings" aria-labelledby="filings-title" className="scroll-mt-24 rounded-3xl bg-sand p-6 sm:p-10">
          <h2 id="filings-title" className="text-2xl font-bold text-noche sm:text-3xl">
            Public filing information
          </h2>
          <dl className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Committee</dt>
              <dd className="font-medium text-noche">{COMMITTEE.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Committee type</dt>
              <dd className="font-medium text-noche">{COMMITTEE.type}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">FEC committee ID</dt>
              <dd className="font-medium text-noche">{COMMITTEE.fecId}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Reporting schedule</dt>
              <dd className="font-medium text-noche">
                Monthly Form 3X, plus 24- and 48-hour independent expenditure reports
              </dd>
            </div>
          </dl>
          <p className="mt-6 max-w-[68ch] text-sm leading-relaxed text-noche/80">
            Filings for each project are listed on its{" "}
            <Link href={`/projects/${projects[0].slug}#transparency`} className="font-medium underline underline-offset-2">
              Transparency tab
            </Link>
            . Links to official FEC records will appear here once filings are live.
          </p>
        </section>
      </Container>
    </>
  );
}
