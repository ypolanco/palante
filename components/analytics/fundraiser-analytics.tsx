import {
  EyeIcon,
  HandCoinsIcon,
  MousePointerClickIcon,
  ReceiptIcon,
  Share2Icon,
  UsersIcon,
} from "lucide-react";
import { BarList, ColumnChart } from "@/components/charts/charts";
import { TransparencyCard } from "@/components/transparency/transparency-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRate } from "@/lib/fundraisers/utils";
import type { FundraiserAnalytics } from "@/lib/types";
import { formatCompactCurrency, formatCurrency, formatDate, formatNumber } from "@/lib/utils";

function shortDate(iso: string) {
  return formatDate(iso, { short: true }).replace(/, \d{4}$/, "");
}

function plural(n: number, word: string) {
  return `${formatNumber(n)} ${word}${n === 1 ? "" : "s"}`;
}

export function FundraiserAnalyticsView({ analytics }: { analytics: FundraiserAnalytics }) {
  const timeline = analytics.timeline;
  const range =
    timeline.length > 0 ? `${shortDate(timeline[0].date)} – ${shortDate(timeline[timeline.length - 1].date)}` : "";

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <TransparencyCard icon={HandCoinsIcon} label="Total raised" value={formatCurrency(analytics.totalRaised)} />
        <TransparencyCard icon={UsersIcon} label="Contributors" value={formatNumber(analytics.contributors)} />
        <TransparencyCard icon={ReceiptIcon} label="Average contribution" value={formatCurrency(analytics.averageContribution)} />
        <TransparencyCard icon={EyeIcon} label="Page views" value={formatNumber(analytics.pageViews)} />
        <TransparencyCard icon={MousePointerClickIcon} label="Conversion rate" value={formatRate(analytics.conversionRate)} hint="Contributors ÷ page views" />
        <TransparencyCard icon={Share2Icon} label="Shares" value={formatNumber(analytics.shares)} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section aria-labelledby="timeline-title" className="rounded-2xl border bg-card p-6">
          <h2 id="timeline-title" className="text-lg font-bold text-noche">Contributions over time</h2>
          <p className="text-sm text-muted-foreground">Amount raised per day · {range}</p>
          <ColumnChart
            title="Amount raised per day"
            valueLabel="Raised"
            className="mt-6"
            formatValue={(v) => formatCompactCurrency(v)}
            data={timeline.map((p) => ({
              key: p.date,
              label: shortDate(p.date),
              value: p.raised,
              details: [plural(p.contributions, "contribution"), plural(p.views, "page view")],
            }))}
          />
        </section>

        <section aria-labelledby="views-title" className="rounded-2xl border bg-card p-6">
          <h2 id="views-title" className="text-lg font-bold text-noche">Page views over time</h2>
          <p className="text-sm text-muted-foreground">Visits per day · {range}</p>
          <ColumnChart
            title="Page views per day"
            valueLabel="Views"
            className="mt-6"
            formatValue={(v) => formatNumber(Math.round(v))}
            data={timeline.map((p) => ({
              key: p.date,
              label: shortDate(p.date),
              value: p.views,
              details: [plural(p.contributions, "contribution")],
            }))}
          />
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr]">
        <section aria-labelledby="traffic-title" className="rounded-2xl border bg-card p-6">
          <h2 id="traffic-title" className="text-lg font-bold text-noche">Traffic sources</h2>
          <p className="text-sm text-muted-foreground">Where visitors came from</p>
          <BarList
            className="mt-5"
            formatValue={(v) => plural(v, "visit")}
            data={[...analytics.referralSources]
              .sort((a, b) => b.visits - a.visits)
              .map((s) => ({ key: s.channel, label: s.label, value: s.visits }))}
          />
        </section>

        <section aria-labelledby="referrals-title" className="rounded-2xl border bg-card">
          <div className="p-6 pb-2">
            <h2 id="referrals-title" className="text-lg font-bold text-noche">Top referral sources</h2>
            <p className="text-sm text-muted-foreground">Ranked by amount raised</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Source</TableHead>
                  <TableHead className="text-right">Visits</TableHead>
                  <TableHead className="text-right">Contributions</TableHead>
                  <TableHead className="text-right">Conversion</TableHead>
                  <TableHead className="pr-6 text-right">Raised</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="tabular">
                {analytics.referralSources.map((s) => (
                  <TableRow key={s.channel}>
                    <TableCell className="pl-6 font-medium text-noche">{s.label}</TableCell>
                    <TableCell className="text-right">{formatNumber(s.visits)}</TableCell>
                    <TableCell className="text-right">{formatNumber(s.contributions)}</TableCell>
                    <TableCell className="text-right">{s.visits ? formatRate(s.contributions / s.visits) : "—"}</TableCell>
                    <TableCell className="pr-6 text-right font-semibold text-noche">{formatCurrency(s.raised)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </div>
  );
}
