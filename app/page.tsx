import { ActivityFeed } from "@/components/home/activity-feed";
import { CommunityMessage } from "@/components/home/community-message";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Stats } from "@/components/home/stats";
import { TransparencyPreview } from "@/components/home/transparency-preview";
import { activity, featuredProjects, showcaseProject } from "@/lib/mock-data";

export default function Home() {
  const [first, second, third] = featuredProjects;

  return (
    <>
      <Hero projects={[first, second, third]} />
      <FeaturedProjects projects={featuredProjects} />
      <Stats />
      <CommunityMessage />
      <HowItWorks />
      <TransparencyPreview project={showcaseProject} />
      <ActivityFeed items={activity} />
    </>
  );
}
