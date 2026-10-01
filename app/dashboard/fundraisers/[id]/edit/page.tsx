import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";
import { Container } from "@/components/layout/section";
import { FundraiserWizard } from "@/components/fundraisers/create/fundraiser-wizard";
import { getCurrentUser, getFundraiserById } from "@/lib/services/fundraisers";

export const metadata: Metadata = {
  title: "Edit fundraiser",
};

export default async function EditFundraiserPage(props: PageProps<"/dashboard/fundraisers/[id]/edit">) {
  const { id } = await props.params;
  const [user, fundraiser] = await Promise.all([getCurrentUser(), getFundraiserById(id)]);
  // TODO(auth): enforce ownership on the server/API as well.
  if (!fundraiser || fundraiser.organizerId !== user.id) notFound();

  return (
    <div className="bg-sand/40">
      <Container className="pt-10">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/dashboard/fundraisers"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-noche"
          >
            <ArrowLeftIcon className="size-4" aria-hidden="true" />
            My fundraisers
          </Link>
          <h1 className="mt-4 text-4xl font-extrabold text-noche">Edit {fundraiser.title}</h1>
        </div>
        <div className="mt-8">
          <FundraiserWizard
            organizer={user}
            mode="edit"
            fundraiserId={fundraiser.id}
            initial={{
              title: fundraiser.title,
              goal: fundraiser.goal,
              endsOn: fundraiser.endsOn,
              story: fundraiser.story,
              coverImage: fundraiser.coverImage,
              coverImageAlt: fundraiser.coverImageAlt,
              profileImage: fundraiser.organizerPhoto ?? null,
              shareMessage: fundraiser.shareMessage,
            }}
          />
        </div>
      </Container>
    </div>
  );
}
