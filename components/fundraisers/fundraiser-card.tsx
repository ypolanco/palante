import Link from "next/link";
import { ClockIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FundraiserCover, OrganizerAvatar } from "@/components/fundraisers/media";
import { ProjectProgress } from "@/components/projects/project-progress";
import { STATUS_LABELS, daysRemaining, fundraiserPath } from "@/lib/fundraisers/utils";
import type { Fundraiser, FundraiserStatus, User } from "@/lib/types";
import { cn, formatCurrency, formatNumber, percentFunded } from "@/lib/utils";

export function TimeLeft({ fundraiser }: { fundraiser: Fundraiser }) {
  const days = daysRemaining(fundraiser);
  if (fundraiser.status === "ended") return <>Ended</>;
  if (days === null) return <>Open-ended</>;
  if (days === 0) return <>Last day</>;
  return <>{days} {days === 1 ? "day" : "days"} left</>;
}

const STATUS_TONES: Record<FundraiserStatus, string> = {
  active: "bg-jade-soft text-jade",
  draft: "bg-sand text-noche",
  ended: "bg-muted text-muted-foreground",
  suspended: "bg-destructive/10 text-destructive",
};

/** Status is always shown as a word, never by color alone. */
export function StatusBadge({ status, className }: { status: FundraiserStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_TONES[status], className)}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {STATUS_LABELS[status]}
    </span>
  );
}

export function FundraiserCard({
  fundraiser,
  organizer,
  className,
  headingLevel = "h3",
}: {
  fundraiser: Fundraiser;
  organizer?: User;
  className?: string;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const pct = percentFunded(fundraiser.raised, fundraiser.goal);
  const href = fundraiserPath(fundraiser.slug);

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-[0_12px_40px_-16px_rgba(24,33,59,0.25)]",
        className,
      )}
    >
      <FundraiserCover
        src={fundraiser.coverImage}
        alt={fundraiser.coverImageAlt}
        sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
        className="aspect-[3/2]"
      />

      <div className="flex flex-1 flex-col p-5">
        {organizer ? (
          <div className="relative -mt-10 flex items-end gap-2">
            <OrganizerAvatar name={organizer.name} src={fundraiser.organizerPhoto ?? organizer.avatarUrl} size="lg" className="ring-4" />
            <p className="truncate pb-1 text-sm text-muted-foreground">
              by <span className="font-medium text-noche">{organizer.name}</span>
            </p>
          </div>
        ) : null}

        <Heading className="mt-3 text-lg leading-snug font-bold text-noche">
          <Link
            href={href}
            className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
          >
            {fundraiser.title}
          </Link>
        </Heading>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {fundraiser.summary}
        </p>

        <div className="mt-auto pt-5">
          <div className="flex items-baseline justify-between gap-2">
            <p className="tabular font-heading text-xl font-bold text-noche">
              {formatCurrency(fundraiser.raised)}
            </p>
            <p className="tabular text-sm font-semibold text-jade">{pct}%</p>
          </div>
          <p className="tabular text-xs text-muted-foreground">
            raised of {formatCurrency(fundraiser.goal)} goal
          </p>
          <ProjectProgress
            raised={fundraiser.raised}
            goal={fundraiser.goal}
            label={fundraiser.title}
            className="mt-3"
          />
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span className="tabular inline-flex items-center gap-1.5">
              <UsersIcon className="size-3.5" aria-hidden="true" />
              {formatNumber(fundraiser.contributorCount)} contributors
            </span>
            <span className="tabular inline-flex items-center gap-1.5">
              <ClockIcon className="size-3.5" aria-hidden="true" />
              <TimeLeft fundraiser={fundraiser} />
            </span>
          </div>

          <Button asChild variant="outline" size="lg" className="relative z-10 mt-5 w-full">
            <Link href={href} tabIndex={-1} aria-hidden="true">
              View Fundraiser
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
