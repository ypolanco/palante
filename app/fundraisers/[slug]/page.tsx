import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FundraiserView } from "@/components/fundraisers/fundraiser-view";
import { LocalFundraiser } from "@/components/fundraisers/local-fundraiser";
import {
  getCurrentUser,
  getFundraiserBySlug,
  getUser,
  listPublicFundraisers,
  listRecentContributions,
} from "@/lib/services/fundraisers";

export async function generateStaticParams() {
  const list = await listPublicFundraisers();
  return list.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata(
  props: PageProps<"/fundraisers/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const fundraiser = await getFundraiserBySlug(slug);
  if (!fundraiser) return { title: "Fundraiser" };
  return {
    title: fundraiser.title,
    description: fundraiser.summary,
    openGraph: {
      title: fundraiser.title,
      description: fundraiser.shareMessage,
      images: [{ url: fundraiser.coverImage, alt: fundraiser.coverImageAlt }],
    },
  };
}

export default async function FundraiserPage(props: PageProps<"/fundraisers/[slug]">) {
  const { slug } = await props.params;
  const fundraiser = await getFundraiserBySlug(slug);

  if (!fundraiser) {
    // Not in the catalog: it may have been published in this browser during the preview.
    return <LocalFundraiser slug={slug} organizer={await getCurrentUser()} />;
  }
  if (fundraiser.status === "draft" || fundraiser.status === "suspended") notFound();

  const [organizer, recent] = await Promise.all([
    getUser(fundraiser.organizerId),
    listRecentContributions(fundraiser.id, 12),
  ]);
  if (!organizer) notFound();

  return <FundraiserView fundraiser={fundraiser} organizer={organizer} recentContributions={recent} />;
}
