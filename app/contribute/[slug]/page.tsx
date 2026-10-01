import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ShieldCheckIcon } from "lucide-react";
import { Container } from "@/components/layout/section";
import { ContributionForm } from "@/components/contribution/contribution-form";
import { ProjectProgress } from "@/components/projects/project-progress";
import { getProject, projects } from "@/lib/mock-data";
import { formatCurrency, formatNumber, percentFunded } from "@/lib/utils";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/contribute/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  return project ? { title: `Contribute to ${project.title}` } : {};
}

export default async function ContributePage(props: PageProps<"/contribute/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <div className="bg-sand/50">
      <Container className="py-10 sm:py-14">
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-noche"
        >
          <ArrowLeftIcon className="size-4" aria-hidden="true" />
          Back to project
        </Link>
        <h1 className="mt-4 text-4xl font-extrabold text-noche sm:text-5xl">Contribute</h1>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem]">
          <ContributionForm project={project} />

          <aside className="order-first lg:order-none" aria-label="Project summary">
            <div className="rounded-3xl border bg-card p-5 lg:sticky lg:top-24">
              <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-sand">
                <Image src={project.image} alt={project.imageAlt} fill sizes="352px" className="object-cover" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">You&apos;re supporting</p>
              <h2 className="text-lg leading-snug font-bold text-noche">{project.title}</h2>
              <ProjectProgress raised={project.raised} goal={project.goal} label={project.title} className="mt-4" />
              <p className="tabular mt-2 text-sm text-muted-foreground">
                <span className="font-semibold text-noche">{formatCurrency(project.raised)}</span> of{" "}
                {formatCurrency(project.goal)} · {percentFunded(project.raised, project.goal)}% funded
              </p>
              <p className="tabular text-sm text-muted-foreground">
                {formatNumber(project.contributors)} contributors so far
              </p>
              <p className="mt-5 flex gap-2 rounded-xl bg-jade-soft p-3 text-xs leading-relaxed text-noche">
                <ShieldCheckIcon className="size-4 shrink-0 text-jade" aria-hidden="true" />
                Your contribution funds independent expenditures only. It does
                not go to any candidate or campaign.
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
