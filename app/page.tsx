import { ActivityFeed } from "@/components/home/activity-feed";
import { CommunityMessage } from "@/components/home/community-message";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { FeaturedFundraisers, FundraisingSteps } from "@/components/home/fundraising";
import { Hero, type HeroItem } from "@/components/home/hero";
import { Stats } from "@/components/home/stats";
import { TransparencyPreview } from "@/components/home/transparency-preview";
import { activity, featuredProjects, showcaseProject } from "@/lib/mock-data";
import { listFundraisers, withOrganizers } from "@/lib/services/fundraisers";

export default async function Home() {
  const active = await listFundraisers({ status: "active" });
  const trending = await withOrganizers(
    [...active].sort((a, b) => b.momentum - a.momentum).slice(0, 4),
  );
  const [first, second, third] = trending as [HeroItem, HeroItem, HeroItem];

  return (
    <>
      <Hero items={[first, second, third]} />
      <FundraisingSteps />
      <FeaturedFundraisers items={trending} />
      <Stats />
      <CommunityMessage />
      <FeaturedProjects projects={featuredProjects} />
      <TransparencyPreview project={showcaseProject} />
      <ActivityFeed items={activity} />
    </>
  );
}
