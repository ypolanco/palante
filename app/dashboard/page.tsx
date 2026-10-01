import type { Metadata } from "next";
import Link from "next/link";
import {
  BarChart3Icon,
  EyeIcon,
  HandCoinsIcon,
  MousePointerClickIcon,
  PencilIcon,
  PlusIcon,
  Share2Icon,
  TargetIcon,
  UsersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/section";
import { MockDataNote } from "@/components/layout/mock-data-note";
import { FundsDisclosure } from "@/components/compliance/compliance-copy";
import { TimeLeft } from "@/components/fundraisers/fundraiser-card";
import { FundraiserCover } from "@/components/fundraisers/media";
import { ProjectProgress } from "@/components/projects/project-progress";
import { ShareButton } from "@/components/share/share-panel";
import { TransparencyCard } from "@/components/transparency/transparency-card";
import { formatRate, fundraiserPath, relativeTime } from "@/lib/fundraisers/utils";
import {
  getCurrentUser,
  getFundraiserAnalytics,
  listFundraisersByOrganizer,
  listRecentContributions,
} from "@/lib/services/fundraisers";
import { formatCurrency, formatNumber, percentFunded } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Your dashboard",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const mine = await listFundraisersByOrganizer(user.id);
  const fundraiser = mine.find((f) => f.status === "active");

  if (!fundraiser) {
    return (
      <Container className="py-16">
        <p className="text-muted-foreground">Welcome, {user.firstName}</p>
        <h1 className="text-4xl font-extrabold text-noche">Start your first fundraiser</h1>
        <p className="mt-3 max-w-xl text-lg text-muted-foreground">
          Create a page, share it with your community, and track your progress here.
        </p>
        <Button asChild variant="brand" size="xl" className="mt-8">
          <Link href="/fundraisers/create">Start a Fundraiser</Link>
        </Button>
      </Container>
    );
  }

  const [analytics, recent] = await Promise.all([
    getFundraiserAnalytics(fundraiser.id),
    listRecentContributions(fundraiser.id, 6),
  ]);
  const pct = percentFunded(fundraiser.raised, fundraiser.goal);
  const remaining = Math.max(0, fundraiser.goal - fundraiser.raised);
  const conversion = analytics?.conversionRate ?? 0;

  return (
    <Container className="py-10 sm:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-muted-foreground">Welcome back, {user.firstName}</p>
          <h1 className="text-4xl font-extrabold text-noche">Your fundraising</h1>
          <MockDataNote className="mt-2" />
        </div>
        <Button asChild variant="outline" size="xl">
          <Link href="/fundraisers/create">
            <PlusIcon data-icon="inline-start" aria-hidden="true" />
            New fundraiser
          </Link>
        </Button>
      </div>

      <section aria-labelledby="active-title" className="mt-8 overflow-hidden rounded-3xl border bg-card">
        <div className="grid grid-cols-1 lg:grid-cols-[18rem_1fr]">
          <FundraiserCover src={fundraiser.coverImage} alt={fundraiser.coverImageAlt} sizes="288px" className="aspect-[16/9] lg:aspect-auto lg:h-full" />
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-jade-soft px-2.5 py-0.5 font-medium text-jade">
                <span className="size-1.5 rounded-full bg-jade" aria-hidden="true" />
                Active
              </span>
              <span className="text-muted-foreground"><TimeLeft fundraiser={fundraiser} /></span>
            </div>
            <h2 id="active-title" className="mt-2 text-2xl font-bold text-noche sm:text-3xl">
              <Link href={fundraiserPath(fundraiser.slug)} className="hover:underline">{fundraiser.title}</Link>
            </h2>

            <p className="tabular mt-5 font-heading text-4xl font-extrabold tracking-tight text-noche">
              {formatCurrency(fundraiser.raised)}
              <span className="ml-2 align-middle font-sans text-base font-medium tracking-normal text-muted-foreground">
                raised of {formatCurrency(fundraiser.goal)}
              </span>
            </p>
            <ProjectProgress raised={fundraiser.raised} goal={fundraiser.goal} label={fundraiser.title} size="lg" animate className="mt-4" />
            <p className="tabular mt-2 text-sm text-muted-foreground">
              <span className="font-semibold text-jade">{pct}%</span> of your goal
              {remaining > 0 ? <> · {formatCurrency(remaining)} to go</> : <> · goal reached!</>}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ShareButton fundraiser={fundraiser} editableMessage variant="brand" size="xl" className="sm:px-8">
                <Share2Icon aria-hidden="true" />
                Share Fundraiser
              </ShareButton>
              <Button asChild variant="outline" size="xl">
                <Link href={`/dashboard/fundraisers/${fundraiser.id}/analytics`}>
                  <BarChart3Icon data-icon="inline-start" aria-hidden="true" />
                  Analytics
                </Link>
              </Button>
              <Button asChild variant="ghost" size="xl">
                <Link href={`/dashboard/fundraisers/${fundraiser.id}/edit`}>
                  <PencilIcon data-icon="inline-start" aria-hidden="true" />
                  Edit page
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <TransparencyCard icon={HandCoinsIcon} label="Total raised" value={formatCurrency(fundraiser.raised)} />
        <TransparencyCard icon={TargetIcon} label="Fundraising goal" value={formatCurrency(fundraiser.goal)} />
        <TransparencyCard icon={UsersIcon} label="Contributors" value={formatNumber(fundraiser.contributorCount)} />
        <TransparencyCard icon={EyeIcon} label="Page views" value={formatNumber(fundraiser.pageViews)} />
        <TransparencyCard
          icon={MousePointerClickIcon}
          label="Conversion rate"
          value={formatRate(conversion)}
          hint="Visitors who contributed"
          className="col-span-2 lg:col-span-1"
        />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="recent-title">
          <div className="flex items-baseline justify-between">
            <h2 id="recent-title" className="text-2xl font-bold text-noche">Recent contributions</h2>
            <Link href={`/dashboard/fundraisers/${fundraiser.id}/analytics`} className="text-sm font-medium text-jade hover:underline">
              See analytics
            </Link>
          </div>
          <ul className="mt-4 divide-y rounded-2xl border bg-card">
            {recent.map((c) => (
              <li key={c.id} className="flex items-start gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-noche">{c.displayName ?? "Anonymous"}</p>
                  {c.message ? <p className="mt-0.5 text-sm text-muted-foreground">&ldquo;{c.message}&rdquo;</p> : null}
                  <p className="mt-0.5 text-xs text-muted-foreground">{relativeTime(c.createdAt)}</p>
                </div>
                <p className="tabular font-heading font-bold text-noche">{formatCurrency(c.amount)}</p>
              </li>
            ))}
          </ul>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-sand p-6">
            <h2 className="text-lg font-bold text-noche">Keep the momentum going</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-noche/85">
              <li>Text the link to five people who care about your community.</li>
              <li>Post an update when you hit a milestone. Supporters love progress.</li>
              <li>Thank recent contributors by name (with their permission).</li>
            </ul>
          </div>
          <FundsDisclosure />
        </aside>
      </div>
    </Container>
  );
}
