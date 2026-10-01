import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, SectionHeading } from "@/components/layout/section";
import { ProjectGrid } from "@/components/projects/project-grid";
import type { Project } from "@/lib/types";

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  return (
    <section aria-labelledby="featured-title" className="py-20">
      <Container>
        <SectionHeading
          id="featured-title"
          title="Projects gaining momentum"
          description="Support independent initiatives moving communities forward."
          action={
            <Button asChild variant="outline" size="lg">
              <Link href="/explore">See all projects</Link>
            </Button>
          }
        />
        <ProjectGrid projects={projects} className="mt-10" />
      </Container>
    </section>
  );
}
