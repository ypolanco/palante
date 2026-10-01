import Link from "next/link";
import { PencilLineIcon, Share2Icon, TrendingUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, SectionHeading } from "@/components/layout/section";
import { FundsDisclosure } from "@/components/compliance/compliance-copy";
import { FundraiserCard } from "@/components/fundraisers/fundraiser-card";
import type { Fundraiser, User } from "@/lib/types";

const STEPS = [
  {
    title: "Create",
    body: "Start your own Palante Together fundraising page.",
    icon: PencilLineIcon,
    tone: "bg-marigold text-noche",
  },
  {
    title: "Share",
    body: "Invite friends, family, coworkers, and your community to contribute.",
    icon: Share2Icon,
    tone: "bg-jade text-white",
  },
  {
    title: "Raise",
    body: "Track contributions and watch your community move toward your fundraising goal.",
    icon: TrendingUpIcon,
    tone: "bg-noche text-white",
  },
];

export function FundraisingSteps() {
  return (
    <section aria-labelledby="steps-title" className="bg-sand py-20 sm:py-24">
      <Container>
        <h2 id="steps-title" className="max-w-2xl text-3xl font-bold text-noche sm:text-4xl">
          Your community. Your page. Real momentum.
        </h2>
        <ol className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {STEPS.map(({ title, body, icon: Icon, tone }, i) => (
            <li key={title} className="relative rounded-3xl bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span className={`flex size-12 items-center justify-center rounded-2xl ${tone}`}>
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="tabular font-heading text-5xl font-extrabold text-sand" aria-hidden="true">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-6 text-2xl font-extrabold text-noche">
                <span className="sr-only">{i + 1}. </span>
                {title}
              </h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Button asChild variant="brand" size="xl">
            <Link href="/fundraisers/create">Start a Fundraiser</Link>
          </Button>
          <FundsDisclosure tone="plain" className="max-w-xl text-sm" />
        </div>
      </Container>
    </section>
  );
}

export function FeaturedFundraisers({
  items,
}: {
  items: Array<{ fundraiser: Fundraiser; organizer: User | undefined }>;
}) {
  return (
    <section aria-labelledby="featured-fundraisers-title" className="py-20">
      <Container>
        <SectionHeading
          id="featured-fundraisers-title"
          title="Fundraisers gaining momentum"
          description="Real people raising money with the people they know."
          action={
            <Button asChild variant="outline" size="lg">
              <Link href="/fundraisers">Explore Fundraisers</Link>
            </Button>
          }
        />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {items.map(({ fundraiser, organizer }) => (
            <FundraiserCard key={fundraiser.id} fundraiser={fundraiser} organizer={organizer} />
          ))}
        </div>
      </Container>
    </section>
  );
}
