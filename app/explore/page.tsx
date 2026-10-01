import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/layout/section";
import { ExploreProjects } from "@/components/projects/explore-projects";
import { projects } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Explore Projects",
  description:
    "Discover independent political projects powered by people moving forward together.",
};

export default function ExplorePage() {
  return (
    <>
      <PageHeader
        title="Explore Projects"
        description="Discover independent political projects powered by people moving forward together."
      />
      <Container className="py-10">
        <ExploreProjects projects={projects} />
      </Container>
    </>
  );
}
