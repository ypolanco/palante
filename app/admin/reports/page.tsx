import type { Metadata } from "next";
import Link from "next/link";
import { FlagIcon } from "lucide-react";
import { Container } from "@/components/layout/section";
import { StatusBadge } from "@/components/fundraisers/fundraiser-card";
import { getFundraiserById, listReports } from "@/lib/services/fundraisers";
import type { FundraiserReportStatus } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Reported fundraisers",
};

const REPORT_TONES: Record<FundraiserReportStatus, string> = {
  open: "bg-destructive/10 text-destructive",
  reviewing: "bg-marigold/20 text-marigold-deep",
  resolved: "bg-muted text-muted-foreground",
};

export default async function AdminReportsPage() {
  const reports = await listReports();
  const rows = await Promise.all(reports.map(async (r) => ({ report: r, fundraiser: await getFundraiserById(r.fundraiserId) })));

  return (
    <Container className="py-10">
      <h1 className="text-3xl font-extrabold text-noche sm:text-4xl">Reported fundraisers</h1>
      <p className="mt-1 text-muted-foreground">
        Reports from the public. Open a fundraiser to review it and change its status.
      </p>
      {/* TODO(backend): report intake form on public pages, assignment, and resolution notes. */}
      <ul className="mt-8 space-y-3">
        {rows.map(({ report: r, fundraiser: f }) => (
          <li key={r.id} className="rounded-2xl border bg-card p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", REPORT_TONES[r.status])}>
                <FlagIcon className="size-3" aria-hidden="true" />
                {r.status}
              </span>
              <span className="text-sm font-semibold text-noche">{r.reason}</span>
              <span className="text-xs text-muted-foreground">· Reported {formatDate(r.reportedOn, { short: true })}</span>
            </div>
            <p className="mt-2 text-sm text-noche/85">{r.details}</p>
            {f ? (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <Link href={`/admin/fundraisers/${f.id}`} className="font-medium text-jade hover:underline">
                  Review {f.title}
                </Link>
                <StatusBadge status={f.status} />
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </Container>
  );
}
