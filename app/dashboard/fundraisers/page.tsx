import type { Metadata } from "next";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/section";
import { MockDataNote } from "@/components/layout/mock-data-note";
import { MyFundraisers } from "@/components/dashboard/my-fundraisers";
import { getCurrentUser, listFundraisersByOrganizer } from "@/lib/services/fundraisers";

export const metadata: Metadata = {
  title: "My fundraisers",
};

export default async function MyFundraisersPage() {
  const user = await getCurrentUser();
  const fundraisers = await listFundraisersByOrganizer(user.id);

  return (
    <Container className="py-10 sm:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-noche">My fundraisers</h1>
          <p className="mt-1 text-muted-foreground">Every fundraiser you&apos;ve created with Palante Together.</p>
          <MockDataNote className="mt-2" />
        </div>
        <Button asChild variant="brand" size="xl">
          <Link href="/fundraisers/create">
            <PlusIcon data-icon="inline-start" aria-hidden="true" />
            Start a Fundraiser
          </Link>
        </Button>
      </div>
      <div className="mt-8">
        <MyFundraisers fundraisers={fundraisers} />
      </div>
    </Container>
  );
}
