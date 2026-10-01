import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ExternalLinkIcon, FlagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Container } from "@/components/layout/section";
import { StatusControl } from "@/components/admin/fundraiser-admin";
import { FundraiserAnalyticsView } from "@/components/analytics/fundraiser-analytics";
import { StatusBadge } from "@/components/fundraisers/fundraiser-card";
import { FundraiserCover, OrganizerAvatar } from "@/components/fundraisers/media";
import { ProjectProgress } from "@/components/projects/project-progress";
import { REFERRAL_LABELS, fundraiserPath, relativeTime } from "@/lib/fundraisers/utils";
import {
  getFundraiserAnalytics,
  getFundraiserById,
  getUser,
  listRecentContributions,
  listReports,
} from "@/lib/services/fundraisers";
import { formatCurrency, formatDate, formatNumber, percentFunded } from "@/lib/utils";

export async function generateMetadata(props: PageProps<"/admin/fundraisers/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const f = await getFundraiserById(id);
  return { title: f?.title ?? "Fundraiser" };
}

export default async function AdminFundraiserDetailPage(props: PageProps<"/admin/fundraisers/[id]">) {
  const { id } = await props.params;
  const fundraiser = await getFundraiserById(id);
  if (!fundraiser) notFound();

  const [organizer, analytics, contributions, reports] = await Promise.all([
    getUser(fundraiser.organizerId),
    getFundraiserAnalytics(fundraiser.id),
    listRecentContributions(fundraiser.id, 12),
    listReports(),
  ]);
  const ownReports = reports.filter((r) => r.fundraiserId === fundraiser.id);

  return (
    <Container className="py-10">
      <Link href="/admin/fundraisers" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-noche">
        <ArrowLeftIcon className="size-4" aria-hidden="true" />
        All fundraisers
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_22rem]">
        <section className="overflow-hidden rounded-2xl border bg-card">
          <div className="grid grid-cols-1 sm:grid-cols-[14rem_1fr]">
            <FundraiserCover src={fundraiser.coverImage} alt="" sizes="224px" className="aspect-[16/9] sm:aspect-auto sm:h-full" />
            <div className="p-6">
              <StatusBadge status={fundraiser.status} />
              <h1 className="mt-2 text-2xl font-extrabold text-noche sm:text-3xl">{fundraiser.title}</h1>
              <ProjectProgress raised={fundraiser.raised} goal={fundraiser.goal} label={fundraiser.title} className="mt-4" />
              <dl className="tabular mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-4">
                <div>
                  <dt className="text-xs text-muted-foreground">Amount raised</dt>
                  <dd className="font-heading text-lg font-bold text-noche">{formatCurrency(fundraiser.raised)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Goal</dt>
                  <dd className="font-heading text-lg font-bold text-noche">
                    {formatCurrency(fundraiser.goal)}{" "}
                    <span className="font-sans text-xs font-normal text-muted-foreground">({percentFunded(fundraiser.raised, fundraiser.goal)}%)</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Contributors</dt>
                  <dd className="font-heading text-lg font-bold text-noche">{formatNumber(fundraiser.contributorCount)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Created</dt>
                  <dd className="font-heading text-lg font-bold text-noche">{formatDate(fundraiser.createdOn, { short: true })}</dd>
                </div>
              </dl>
              {fundraiser.status === "active" || fundraiser.status === "ended" ? (
                <Button asChild variant="outline" size="lg" className="mt-5">
                  <Link href={fundraiserPath(fundraiser.slug)}>
                    <ExternalLinkIcon data-icon="inline-start" aria-hidden="true" />
                    View public page
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <section aria-labelledby="organizer-title" className="rounded-2xl border bg-card p-5">
            <h2 id="organizer-title" className="text-sm font-semibold text-muted-foreground">Organizer</h2>
            {organizer ? (
              <div className="mt-3 flex items-center gap-3">
                <OrganizerAvatar name={organizer.name} src={organizer.avatarUrl} size="lg" />
                <div className="min-w-0 text-sm">
                  <p className="font-heading text-base font-bold text-noche">{organizer.name}</p>
                  <p className="truncate text-muted-foreground">{organizer.email}</p>
                  <p className="text-muted-foreground">
                    {organizer.location ? `${organizer.location} · ` : ""}Joined {formatDate(organizer.joinedOn, { short: true })}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Organizer not found.</p>
            )}
          </section>
          <section aria-labelledby="status-title" className="rounded-2xl border bg-card p-5">
            <h2 id="status-title" className="text-sm font-semibold text-muted-foreground">Status</h2>
            <div className="mt-3">
              <StatusControl fundraiserId={fundraiser.id} status={fundraiser.status} />
            </div>
          </section>
          {ownReports.length > 0 ? (
            <section aria-labelledby="reports-title" className="rounded-2xl border border-destructive/30 bg-card p-5">
              <h2 id="reports-title" className="flex items-center gap-1.5 text-sm font-semibold text-destructive">
                <FlagIcon className="size-4" aria-hidden="true" />
                Reports
              </h2>
              <ul className="mt-3 space-y-3 text-sm">
                {ownReports.map((r) => (
                  <li key={r.id}>
                    <p className="font-medium text-noche">{r.reason} <span className="font-normal text-muted-foreground">· {r.status}</span></p>
                    <p className="text-muted-foreground">{r.details}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </aside>
      </div>

      <section aria-labelledby="contributions-title" className="mt-8">
        <h2 id="contributions-title" className="text-xl font-bold text-noche">Recent contributions</h2>
        <p className="text-sm text-muted-foreground">
          All funds are received by the committee; the fundraiser is recorded for attribution only.
        </p>
        <div className="mt-4 overflow-x-auto rounded-2xl border bg-card">
          <Table>
            <TableHeader className="bg-muted/60">
              <TableRow>
                <TableHead className="pl-5">When</TableHead>
                <TableHead>Contributor</TableHead>
                <TableHead>Referral source</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead className="pr-5 text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="tabular">
              {contributions.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="pl-5 text-muted-foreground">{relativeTime(c.createdAt)}</TableCell>
                  <TableCell className="text-noche">{c.displayName ?? "Anonymous (public)"}</TableCell>
                  <TableCell>{REFERRAL_LABELS[c.attribution.referralChannel]}</TableCell>
                  <TableCell className="text-muted-foreground">{c.recipient}</TableCell>
                  <TableCell className="pr-5 text-right font-semibold text-noche">{formatCurrency(c.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {contributions.length === 0 ? <p className="p-8 text-center text-muted-foreground">No contributions yet.</p> : null}
        </div>
      </section>

      {analytics ? (
        <section aria-labelledby="traffic-heading" className="mt-10">
          <h2 id="traffic-heading" className="mb-4 text-xl font-bold text-noche">Traffic and referral sources</h2>
          <FundraiserAnalyticsView analytics={analytics} />
        </section>
      ) : null}
    </Container>
  );
}
