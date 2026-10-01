import Link from "next/link";
import { CalendarClockIcon, HeartIcon, MapPinIcon, MegaphoneIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/section";
import {
  ContributeButton,
  ContributeProvider,
  MobileContributeBar,
  SuggestedAmounts,
} from "@/components/contribution/p2p/contribute";
import { ComplianceCopy, FundsDisclosure } from "@/components/compliance/compliance-copy";
import { TimeLeft } from "@/components/fundraisers/fundraiser-card";
import { FundraiserCover, OrganizerAvatar } from "@/components/fundraisers/media";
import { ProjectProgress } from "@/components/projects/project-progress";
import { RichText } from "@/components/rich-text/rich-text";
import { ShareButton } from "@/components/share/share-panel";
import { relativeTime } from "@/lib/fundraisers/utils";
import type { Contribution, Fundraiser, User } from "@/lib/types";
import { formatCurrency, formatDate, formatNumber, percentFunded } from "@/lib/utils";

function ProgressCard({ fundraiser, organizer }: { fundraiser: Fundraiser; organizer: User }) {
  const pct = percentFunded(fundraiser.raised, fundraiser.goal);
  const active = fundraiser.status === "active";

  return (
    <div className="rounded-3xl border bg-white p-5 shadow-[0_24px_60px_-32px_rgba(24,33,59,0.35)] sm:p-6">
      <p className="tabular font-heading text-4xl font-extrabold tracking-tight text-noche">
        {formatCurrency(fundraiser.raised)}
        <span className="ml-2 align-middle font-sans text-base font-medium tracking-normal text-muted-foreground">
          raised
        </span>
      </p>
      <p className="tabular mt-1 text-sm text-muted-foreground">
        of {formatCurrency(fundraiser.goal)} goal
      </p>
      <ProjectProgress raised={fundraiser.raised} goal={fundraiser.goal} label={fundraiser.title} size="lg" animate className="mt-4" />
      <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
        <div>
          <dt className="text-muted-foreground">Funded</dt>
          <dd className="tabular font-heading text-xl font-bold text-jade">{pct}%</dd>
        </div>
        <div>
          <dt className="inline-flex items-center gap-1 text-muted-foreground">
            <UsersIcon className="size-3.5" aria-hidden="true" />
            Contributors
          </dt>
          <dd className="tabular font-heading text-xl font-bold text-noche">
            {formatNumber(fundraiser.contributorCount)}
          </dd>
        </div>
        <div>
          <dt className="inline-flex items-center gap-1 text-muted-foreground">
            <CalendarClockIcon className="size-3.5" aria-hidden="true" />
            Timing
          </dt>
          <dd className="tabular font-heading text-base leading-7 font-bold text-noche">
            <TimeLeft fundraiser={fundraiser} />
          </dd>
        </div>
      </dl>

      {active ? (
        <>
          <ContributeButton className="mt-6 w-full" />
          <p className="mt-4 text-sm font-medium text-noche">Or choose an amount</p>
          <SuggestedAmounts className="mt-2" />
          <ShareButton fundraiser={fundraiser} variant="outline" size="xl" className="mt-3 w-full" />
        </>
      ) : (
        <div className="mt-6 rounded-2xl bg-sand p-4 text-sm text-noche">
          <p className="font-semibold">This fundraiser has ended.</p>
          <p className="mt-1 text-muted-foreground">
            Thank you to everyone who supported {organizer.firstName}. You can still
            support other community fundraisers.
          </p>
          <Button asChild variant="default" size="lg" className="mt-3">
            <Link href="/fundraisers">Explore fundraisers</Link>
          </Button>
        </div>
      )}

      <FundsDisclosure className="mt-5 text-xs" />
    </div>
  );
}

function SupporterInitial({ name }: { name: string | null }) {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-marigold/20 text-marigold-deep">
      {name ? (
        <span className="font-heading text-sm font-bold" aria-hidden="true">{name[0]}</span>
      ) : (
        <HeartIcon className="size-4" aria-hidden="true" />
      )}
    </span>
  );
}

export function FundraiserView({
  fundraiser,
  organizer,
  recentContributions,
  preview = false,
}: {
  fundraiser: Fundraiser;
  organizer: User;
  recentContributions: Contribution[];
  /** Renders without live contribution actions (used by the creation wizard). */
  preview?: boolean;
}) {
  const messages = recentContributions.filter((c) => c.message);
  const photo = fundraiser.organizerPhoto ?? organizer.avatarUrl;

  return (
    <ContributeProvider fundraiser={fundraiser} organizerFirstName={organizer.firstName} preview={preview}>
      <Container className="grid grid-cols-1 gap-x-12 pt-4 pb-12 sm:pt-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:pt-10">
        <header className="min-w-0 lg:col-start-1">
          <FundraiserCover
            src={fundraiser.coverImage}
            alt={fundraiser.coverImageAlt}
            sizes="(min-width: 1024px) 60vw, 100vw"
            priority
            className="-mx-4 aspect-[16/10] sm:mx-0 sm:rounded-3xl"
          />
          <h1 className="mt-6 text-3xl leading-tight font-extrabold text-noche sm:text-5xl">
            {fundraiser.title}
          </h1>
          <div className="mt-4 flex items-center gap-3">
            <OrganizerAvatar name={organizer.name} src={photo} size="md" />
            <p className="text-sm leading-snug text-muted-foreground">
              <span className="font-semibold text-noche">{organizer.name}</span> is raising money
              for Palante Together
              {organizer.location ? (
                <span className="mt-0.5 flex items-center gap-1">
                  <MapPinIcon className="size-3.5" aria-hidden="true" />
                  {organizer.location}
                </span>
              ) : null}
            </p>
          </div>
        </header>

        <aside className="mt-8 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0" aria-label="Fundraising progress">
          <div className="lg:sticky lg:top-24">
            <ProgressCard fundraiser={fundraiser} organizer={organizer} />
          </div>
        </aside>

        <div className="min-w-0 lg:col-start-1">
          <section aria-labelledby="story-title" className="mt-10">
            <h2 id="story-title" className="text-2xl font-bold text-noche">
              Why {organizer.firstName} is fundraising
            </h2>
            <RichText source={fundraiser.story} className="mt-4" />
          </section>

          <section aria-label="Organizer" className="mt-10 rounded-3xl bg-sand p-6">
            <div className="flex items-center gap-4">
              <OrganizerAvatar name={organizer.name} src={photo} size="xl" />
              <div>
                <p className="text-sm text-muted-foreground">Organizer</p>
                <p className="font-heading text-xl font-bold text-noche">{organizer.name}</p>
                {organizer.location ? <p className="text-sm text-muted-foreground">{organizer.location}</p> : null}
              </div>
            </div>
            {organizer.bio ? <p className="mt-4 leading-relaxed text-noche/85">{organizer.bio}</p> : null}
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {organizer.firstName} is a volunteer fundraiser sharing this page with their
              community. Contributions go directly to Palante Together, not to {organizer.firstName}.
            </p>
          </section>

          <section aria-labelledby="updates-title" className="mt-12">
            <h2 id="updates-title" className="flex items-center gap-2 text-2xl font-bold text-noche">
              Updates
              <span className="tabular rounded-full bg-sand px-2.5 py-0.5 font-sans text-sm font-medium">
                {fundraiser.updates.length}
              </span>
            </h2>
            {fundraiser.updates.length > 0 ? (
              <ol className="mt-5 space-y-6 border-l-2 border-sand pl-6">
                {fundraiser.updates.map((u) => (
                  <li key={u.id} className="relative">
                    <span className="absolute top-1 -left-[2.06rem] flex size-5 items-center justify-center rounded-full bg-jade text-white">
                      <MegaphoneIcon className="size-3" aria-hidden="true" />
                    </span>
                    <p className="text-xs text-muted-foreground">
                      <time dateTime={u.postedOn}>{formatDate(u.postedOn)}</time>
                    </p>
                    <h3 className="mt-0.5 text-lg font-bold text-noche">{u.title}</h3>
                    <p className="mt-1 leading-relaxed text-noche/85">{u.body}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-3 text-muted-foreground">
                {organizer.firstName} hasn&apos;t posted any updates yet.
              </p>
            )}
          </section>

          {messages.length > 0 ? (
            <section aria-labelledby="support-title" className="mt-12">
              <h2 id="support-title" className="text-2xl font-bold text-noche">Words of support</h2>
              <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {messages.map((c) => (
                  <li key={c.id} className="rounded-2xl border bg-card p-5">
                    <p className="leading-relaxed text-noche">&ldquo;{c.message}&rdquo;</p>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {c.displayName ?? "Anonymous"} · {relativeTime(c.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section aria-labelledby="recent-title" className="mt-12">
            <h2 id="recent-title" className="text-2xl font-bold text-noche">Recent contributions</h2>
            {recentContributions.length > 0 ? (
              <ul className="mt-4 divide-y">
                {recentContributions.slice(0, 8).map((c) => (
                  <li key={c.id} className="flex items-center gap-3 py-3">
                    <SupporterInitial name={c.displayName} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-noche">{c.displayName ?? "Anonymous"}</p>
                      <p className="text-xs text-muted-foreground">{relativeTime(c.createdAt)}</p>
                    </div>
                    <p className="tabular font-heading font-bold text-noche">{formatCurrency(c.amount)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-muted-foreground">Be the first to contribute.</p>
            )}
          </section>

          <section aria-labelledby="where-title" className="mt-12 rounded-3xl border p-6">
            <h2 id="where-title" className="text-xl font-bold text-noche">Where your contribution goes</h2>
            <FundsDisclosure tone="plain" className="mt-3" />
            <ComplianceCopy slot="fundraiser-page-notice" className="mt-4" />
          </section>
        </div>
      </Container>

      {fundraiser.status === "active" && !preview ? <MobileContributeBar fundraiser={fundraiser} /> : null}
    </ContributeProvider>
  );
}
