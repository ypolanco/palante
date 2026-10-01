import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/section";
import { MockDataNote } from "@/components/layout/mock-data-note";
import { FundraiserAnalyticsView } from "@/components/analytics/fundraiser-analytics";
import { StatusBadge } from "@/components/fundraisers/fundraiser-card";
import { ShareButton } from "@/components/share/share-panel";
import { fundraiserPath } from "@/lib/fundraisers/utils";
import {
  getCurrentUser,
  getFundraiserAnalytics,
  getFundraiserById,
} from "@/lib/services/fundraisers";

export const metadata: Metadata = {
  title: "Fundraiser analytics",
};

export default async function FundraiserAnalyticsPage(
  props: PageProps<"/dashboard/fundraisers/[id]/analytics">,
) {
  const { id } = await props.params;
  const [user, fundraiser] = await Promise.all([getCurrentUser(), getFundraiserById(id)]);
  // TODO(auth): enforce ownership on the server/API as well.
  if (!fundraiser || fundraiser.organizerId !== user.id) notFound();
  const analytics = await getFundraiserAnalytics(fundraiser.id);
  if (!analytics) notFound();

  return (
    <Container className="py-10 sm:py-14">
      <Link
        href="/dashboard/fundraisers"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-noche"
      >
        <ArrowLeftIcon className="size-4" aria-hidden="true" />
        My fundraisers
      </Link>
      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <StatusBadge status={fundraiser.status} />
          <h1 className="mt-2 text-3xl font-extrabold text-noche sm:text-4xl">{fundraiser.title}</h1>
          <p className="mt-1 text-muted-foreground">Analytics</p>
          <MockDataNote className="mt-2" />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline" size="xl">
            <Link href={fundraiserPath(fundraiser.slug)}>
              <ExternalLinkIcon data-icon="inline-start" aria-hidden="true" />
              View page
            </Link>
          </Button>
          {fundraiser.status === "active" ? (
            <ShareButton fundraiser={fundraiser} editableMessage variant="brand" size="xl" />
          ) : null}
        </div>
      </div>
      <div className="mt-8">
        <FundraiserAnalyticsView analytics={analytics} />
      </div>
    </Container>
  );
}
