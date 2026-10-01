import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/section";
import { ProjectBudget } from "@/components/projects/project-budget";
import { ProjectHero } from "@/components/projects/project-hero";
import { ProjectOverview } from "@/components/projects/project-overview";
import { ProjectSpending } from "@/components/projects/project-spending";
import { ProjectTabs } from "@/components/projects/project-tabs";
import { ProjectTransparency } from "@/components/projects/project-transparency";
import { ProjectUpdates } from "@/components/projects/project-updates";
import { ProjectProgress } from "@/components/projects/project-progress";
import { getProject, projects } from "@/lib/mock-data";
import { formatCurrency, percentFunded } from "@/lib/utils";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.title, description: project.summary };
}

export default async function ProjectPage(
  props: PageProps<"/projects/[slug]">,
) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  const pct = percentFunded(project.raised, project.goal);

  return (
    <>
      <ProjectHero project={project} />
      <Container className="grid gap-12 py-10 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0">
          <ProjectTabs
            panels={{
              overview: <ProjectOverview project={project} />,
              budget: <ProjectBudget project={project} />,
              updates: <ProjectUpdates updates={project.updates} />,
              spending: <ProjectSpending project={project} />,
              transparency: <ProjectTransparency project={project} />,
            }}
          />
        </div>

        <aside
          className="hidden lg:block"
          aria-label="Contribute to this project"
        >
          <div className="sticky top-24 rounded-2xl border bg-card p-5">
            <p className="tabular font-heading text-2xl font-bold text-noche">
              {formatCurrency(project.raised)}
            </p>
            <p className="tabular text-sm text-muted-foreground">
              {pct}% of {formatCurrency(project.goal)}
            </p>
            <ProjectProgress
              raised={project.raised}
              goal={project.goal}
              label={project.title}
              className="mt-3"
            />
            <Button asChild variant="brand" size="xl" className="mt-5 w-full">
              <Link href={`/contribute/${project.slug}`}>Contribute</Link>
            </Button>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              {project.daysLeft} days left. Spending is reported publicly on the
              Spending tab.
            </p>
          </div>
        </aside>
      </Container>

      <div className="h-16 lg:hidden" aria-hidden="true" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 p-3 backdrop-blur-md lg:hidden">
        <Button asChild variant="brand" size="xl" className="w-full">
          <Link href={`/contribute/${project.slug}`}>Contribute</Link>
        </Button>
      </div>
    </>
  );
}
