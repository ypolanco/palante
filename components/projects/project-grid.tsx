import { ProjectCard } from "@/components/projects/project-card";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProjectGrid({
  projects,
  className,
}: {
  projects: Project[];
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "grid gap-6 sm:grid-cols-2 xl:grid-cols-4",
        className,
      )}
    >
      {projects.map((project) => (
        <li key={project.slug} className="flex">
          <ProjectCard project={project} className="w-full" />
        </li>
      ))}
    </ul>
  );
}
