import type { Metadata } from "next";
import Link from "next/link";
import { PlusIcon, TrophyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, PageHeader } from "@/components/layout/section";
import { MockDataNote } from "@/components/layout/mock-data-note";
import { ExploreFundraisers } from "@/components/fundraisers/explore-fundraisers";
import { listFundraisers, withOrganizers } from "@/lib/services/fundraisers";

export const metadata: Metadata = {
  title: "Explore Fundraisers",
  description: "Community fundraisers raising money for Palante Together, created by supporters like you.",
};

export default async function FundraisersPage() {
  const items = await withOrganizers(await listFundraisers({ status: "active" }));

  return (
    <>
      <PageHeader
        title="Community fundraisers"
        description="Supporters across the country are raising money for Palante Together with their friends, families, and neighbors. Find one to join, or start your own."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="brand" size="xl">
            <Link href="/fundraisers/create">
              <PlusIcon data-icon="inline-start" aria-hidden="true" />
              Start a Fundraiser
            </Link>
          </Button>
          <Button asChild variant="outline" size="xl" className="bg-white">
            <Link href="/fundraisers/leaderboard">
              <TrophyIcon data-icon="inline-start" aria-hidden="true" />
              Community leaderboard
            </Link>
          </Button>
        </div>
        <MockDataNote className="mt-6" />
      </PageHeader>
      <Container className="py-10">
        <ExploreFundraisers items={items} />
      </Container>
    </>
  );
}
