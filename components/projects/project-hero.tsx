import Image from "next/image";
import Link from "next/link";
import { CalendarClockIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/section";
import { CategoryBadge } from "@/components/projects/category-badge";
import { ProjectProgress } from "@/components/projects/project-progress";
import type { Project } from "@/lib/types";
import { formatCurrency, formatNumber, percentFunded } from "@/lib/utils";

export function ProjectHero({ project }: { project: Project }) {
  const pct = percentFunded(project.raised, project.goal);

  return (
    <section aria-labelledby="project-title" className="border-b bg-sand/50">
      <Container className="grid gap-10 py-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14 lg:py-14">
        <div className="relative aspect-[3/2] overflow-hidden rounded-3xl bg-sand">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-3">
            <CategoryBadge category={project.category} />
            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
              <MapPinIcon className="size-3.5" aria-hidden="true" />
              {project.location}
            </span>
          </div>
          <h1
            id="project-title"
            className="mt-4 text-3xl leading-tight font-extrabold text-noche sm:text-4xl"
          >
            {project.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {project.summary}
          </p>

          <div className="mt-8 rounded-2xl border bg-white p-6">
            <p className="tabular font-heading text-4xl font-extrabold tracking-tight text-noche">
              {formatCurrency(project.raised)}
              <span className="ml-2 align-middle font-sans text-base font-medium tracking-normal text-muted-foreground">
                raised
              </span>
            </p>
            <p className="tabular mt-1 text-sm text-muted-foreground">
              of {formatCurrency(project.goal)} goal
            </p>
            <ProjectProgress
              raised={project.raised}
              goal={project.goal}
              label={project.title}
              size="lg"
              className="mt-4"
            />
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
                  {formatNumber(project.contributors)}
                </dd>
              </div>
              <div>
                <dt className="inline-flex items-center gap-1 text-muted-foreground">
                  <CalendarClockIcon className="size-3.5" aria-hidden="true" />
                  Days left
                </dt>
                <dd className="tabular font-heading text-xl font-bold text-noche">
                  {project.daysLeft}
                </dd>
              </div>
            </dl>

            <Button asChild variant="brand" size="xl" className="mt-6 w-full">
              <Link href={`/contribute/${project.slug}`}>Contribute</Link>
            </Button>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Every contribution helps move this project forward.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
