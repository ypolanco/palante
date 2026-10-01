import Image from "next/image";
import Link from "next/link";
import { ClockIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "@/components/projects/category-badge";
import { ProjectProgress } from "@/components/projects/project-progress";
import type { Project } from "@/lib/types";
import { cn, formatCurrency, formatNumber, percentFunded } from "@/lib/utils";

export function ProjectCard({
  project,
  className,
  headingLevel = "h3",
}: {
  project: Project;
  className?: string;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const pct = percentFunded(project.raised, project.goal);

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-[0_12px_40px_-16px_rgba(24,33,59,0.25)]",
        className,
      )}
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-sand">
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <CategoryBadge category={project.category} />
          <span className="truncate text-xs text-muted-foreground">{project.location}</span>
        </div>

        <Heading className="mt-3 text-lg leading-snug font-bold text-noche">
          <Link
            href={`/projects/${project.slug}`}
            className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
          >
            {project.title}
          </Link>
        </Heading>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {project.summary}
        </p>

        <div className="mt-auto pt-5">
          <div className="flex items-baseline justify-between gap-2">
            <p className="tabular font-heading text-xl font-bold text-noche">
              {formatCurrency(project.raised)}
            </p>
            <p className="tabular text-sm font-semibold text-jade">{pct}%</p>
          </div>
          <p className="tabular text-xs text-muted-foreground">
            raised of {formatCurrency(project.goal)} goal
          </p>
          <ProjectProgress
            raised={project.raised}
            goal={project.goal}
            label={project.title}
            className="mt-3"
          />
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span className="tabular inline-flex items-center gap-1.5">
              <UsersIcon className="size-3.5" aria-hidden="true" />
              {formatNumber(project.contributors)} contributors
            </span>
            <span className="tabular inline-flex items-center gap-1.5">
              <ClockIcon className="size-3.5" aria-hidden="true" />
              {project.daysLeft} days left
            </span>
          </div>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="relative z-10 mt-5 w-full"
          >
            <Link href={`/projects/${project.slug}`} tabIndex={-1} aria-hidden="true">
              View Project
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
