import Link from "next/link";
import { CompassIcon, HandCoinsIcon, ReceiptTextIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/section";

export const STEPS = [
  {
    title: "Explore",
    body: "Browse independent political projects and understand what each initiative intends to accomplish.",
    icon: CompassIcon,
  },
  {
    title: "Contribute",
    body: "Support the projects and initiatives you care about.",
    icon: HandCoinsIcon,
  },
  {
    title: "Follow the money",
    body: "Track fundraising progress, project updates, budgets, and reported expenditures.",
    icon: ReceiptTextIcon,
  },
];

export function HowItWorks({ showCta = true }: { showCta?: boolean }) {
  return (
    <section aria-labelledby="how-title" className="bg-sand py-20 sm:py-24">
      <Container>
        <h2 id="how-title" className="text-3xl font-bold text-noche sm:text-4xl">
          How it works
        </h2>
        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-6">
          {STEPS.map(({ title, body, icon: Icon }, i) => (
            <li key={title} className="relative">
              <div className="flex items-center gap-3">
                <span className="tabular flex size-10 items-center justify-center rounded-full bg-noche font-heading text-base font-bold text-white">
                  {i + 1}
                </span>
                {i < STEPS.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="hidden h-px flex-1 border-t-2 border-dashed border-noche/25 md:block"
                  />
                ) : null}
              </div>
              <h3 className="mt-5 flex items-center gap-2 text-xl font-bold text-noche">
                <Icon className="size-5 text-jade" aria-hidden="true" />
                {title}
              </h3>
              <p className="mt-2 max-w-sm leading-relaxed text-muted-foreground">{body}</p>
            </li>
          ))}
        </ol>
        {showCta ? (
          <Button asChild variant="default" size="xl" className="mt-12">
            <Link href="/how-it-works">See How Palante Together Works</Link>
          </Button>
        ) : null}
      </Container>
    </section>
  );
}
