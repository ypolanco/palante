import type { Metadata } from "next";
import Link from "next/link";
import { FlagIcon } from "lucide-react";
import { Container } from "@/components/layout/section";
import { MockDataNote } from "@/components/layout/mock-data-note";
import { FundraiserAnalyticsView } from "@/components/analytics/fundraiser-analytics";
import { getCampaignAnalytics, listFundraisers, listReports } from "@/lib/services/fundraisers";

export const metadata: Metadata = {
  title: "Campaign analytics",
};

export default async function AdminOverviewPage() {
  const [analytics, all, reports] = await Promise.all([getCampaignAnalytics(), listFundraisers(), listReports()]);
  const openReports = reports.filter((r) => r.status !== "resolved").length;
  const counts = {
    active: all.filter((f) => f.status === "active").length,
    draft: all.filter((f) => f.status === "draft").length,
    ended: all.filter((f) => f.status === "ended").length,
  };

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-noche sm:text-4xl">Campaign analytics</h1>
          <p className="mt-1 text-muted-foreground">
            Peer-to-peer fundraising across all supporter pages ·{" "}
            <span className="tabular">{counts.active} active · {counts.draft} draft · {counts.ended} ended</span>
          </p>
          <MockDataNote className="mt-2" />
        </div>
        {openReports > 0 ? (
          <Link
            href="/admin/reports"
            className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/10"
          >
            <FlagIcon className="size-4" aria-hidden="true" />
            {openReports} report{openReports === 1 ? "" : "s"} need review
          </Link>
        ) : null}
      </div>
      <div className="mt-8">
        <FundraiserAnalyticsView analytics={analytics} />
      </div>
    </Container>
  );
}
