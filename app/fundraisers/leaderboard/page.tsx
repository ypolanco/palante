import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { HandCoinsIcon, RocketIcon, SparklesIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, PageHeader } from "@/components/layout/section";
import { MockDataNote } from "@/components/layout/mock-data-note";
import { OrganizerAvatar } from "@/components/fundraisers/media";
import { ProjectProgress } from "@/components/projects/project-progress";
import { fundraiserPath } from "@/lib/fundraisers/utils";
import { listPublicFundraisers, withOrganizers } from "@/lib/services/fundraisers";
import type { Fundraiser, User } from "@/lib/types";
import { formatCompactCurrency, formatCurrency, formatDate, formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Community Leaderboard",
  description: "Celebrating the supporters raising money together for Palante Together.",
};

type Item = { fundraiser: Fundraiser; organizer: User | undefined };

function Board({
  id,
  title,
  description,
  icon: Icon,
  items,
  metric,
}: {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  items: Item[];
  metric: (f: Fundraiser) => string;
}) {
  return (
    <section aria-labelledby={id} className="rounded-3xl border bg-card p-6">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-jade-soft text-jade">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 id={id} className="text-xl font-bold text-noche">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <ol className="mt-5 divide-y">
        {items.map(({ fundraiser: f, organizer }) => (
          <li key={f.id} className="flex items-center gap-3 py-3">
            {organizer ? <OrganizerAvatar name={organizer.name} src={f.organizerPhoto ?? organizer.avatarUrl} size="md" /> : null}
            <div className="min-w-0 flex-1">
              <Link href={fundraiserPath(f.slug)} className="block truncate font-semibold text-noche hover:underline">
                {f.title}
              </Link>
              <p className="truncate text-xs text-muted-foreground">
                {organizer?.name}
                {organizer?.location ? ` · ${organizer.location}` : ""}
              </p>
              <ProjectProgress raised={f.raised} goal={f.goal} label={f.title} size="sm" className="mt-2" />
            </div>
            <p className="tabular w-24 shrink-0 text-right text-sm font-semibold text-noche">{metric(f)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default async function LeaderboardPage() {
  const items = await withOrganizers(await listPublicFundraisers());
  const active = items.filter((i) => i.fundraiser.status === "active");
  const top = (list: Item[], by: (f: Fundraiser) => number | string) =>
    [...list]
      .sort((a, b) => {
        const x = by(a.fundraiser);
        const y = by(b.fundraiser);
        return typeof x === "number" && typeof y === "number" ? y - x : String(y).localeCompare(String(x));
      })
      .slice(0, 5);

  const totalRaised = items.reduce((s, i) => s + i.fundraiser.raised, 0);
  const totalContributors = items.reduce((s, i) => s + i.fundraiser.contributorCount, 0);

  return (
    <>
      <PageHeader
        title="Raising together"
        description="Every fundraiser here is someone bringing their community along. Here's a look at the momentum we're building, together."
      >
        <dl className="mt-8 grid max-w-2xl grid-cols-3 gap-6">
          <div className="border-l-2 border-marigold pl-4">
            <dt className="text-sm text-muted-foreground">Raised by supporters</dt>
            <dd className="tabular font-heading text-3xl font-extrabold text-noche">{formatCompactCurrency(totalRaised)}</dd>
          </div>
          <div className="border-l-2 border-marigold pl-4">
            <dt className="text-sm text-muted-foreground">Contributors</dt>
            <dd className="tabular font-heading text-3xl font-extrabold text-noche">{formatNumber(totalContributors)}</dd>
          </div>
          <div className="border-l-2 border-marigold pl-4">
            <dt className="text-sm text-muted-foreground">Active fundraisers</dt>
            <dd className="tabular font-heading text-3xl font-extrabold text-noche">{active.length}</dd>
          </div>
        </dl>
        <MockDataNote className="mt-6" />
      </PageHeader>

      <Container className="py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Board
            id="top-title"
            title="Top fundraisers"
            description="Most raised for Palante Together"
            icon={HandCoinsIcon}
            items={top(items, (f) => f.raised)}
            metric={(f) => formatCurrency(f.raised)}
          />
          <Board
            id="contributors-title"
            title="Most contributors"
            description="The biggest circles of support"
            icon={UsersIcon}
            items={top(items, (f) => f.contributorCount)}
            metric={(f) => `${formatNumber(f.contributorCount)} people`}
          />
          <Board
            id="trending-title"
            title="Trending fundraisers"
            description="Picking up speed this week"
            icon={SparklesIcon}
            items={top(active, (f) => f.momentum)}
            metric={(f) => formatCurrency(f.raised)}
          />
          <Board
            id="recent-title"
            title="Recently launched"
            description="Say hello to the newest fundraisers"
            icon={RocketIcon}
            items={top(active, (f) => f.launchedOn ?? "")}
            metric={(f) => (f.launchedOn ? formatDate(f.launchedOn, { short: true }).replace(/, \d{4}$/, "") : "")}
          />
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 rounded-3xl bg-noche p-8 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Your community belongs here too</h2>
            <p className="mt-1 text-white/70">Start a fundraiser in about five minutes.</p>
          </div>
          <Button asChild variant="brand" size="xl">
            <Link href="/fundraisers/create">Start a Fundraiser</Link>
          </Button>
        </div>
      </Container>
    </>
  );
}
