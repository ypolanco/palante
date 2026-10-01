import type { Metadata } from "next";
import { Container } from "@/components/layout/section";
import { FundraiserWizard } from "@/components/fundraisers/create/fundraiser-wizard";
import { getCurrentUser, listFundraisers } from "@/lib/services/fundraisers";

export const metadata: Metadata = {
  title: "Start a Fundraiser",
  description: "Create your own fundraising page for Palante Together and share it with your community.",
};

export default async function CreateFundraiserPage() {
  const [organizer, all] = await Promise.all([getCurrentUser(), listFundraisers()]);

  return (
    <div className="bg-sand/40">
      <Container className="pt-10 sm:pt-14">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-jade uppercase">Start a fundraiser</p>
          <h1 className="mt-2 text-4xl font-extrabold text-noche sm:text-5xl">
            Raise together with your community
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            It takes about five minutes. You can edit everything after you publish.
          </p>
        </div>
        <div className="mt-10">
          <FundraiserWizard organizer={organizer} reservedSlugs={all.map((f) => f.slug)} />
        </div>
      </Container>
    </div>
  );
}
