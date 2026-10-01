import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, PageHeader } from "@/components/layout/section";
import { COMMITTEE } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "About",
  description: "Why Palante Together exists and the principles we operate by.",
};

const PRINCIPLES = [
  {
    title: "Projects, not personalities",
    body: "We fund specific initiatives with clear goals and budgets, so supporters know exactly what they're backing.",
  },
  {
    title: "Show the work",
    body: "Every project publishes its budget before raising money and reports each expenditure as it happens.",
  },
  {
    title: "Independent by design",
    body: "We never coordinate with candidates, campaigns, or parties. That independence is the point.",
  },
  {
    title: "Open to everyone",
    body: "A $10 contribution and a $10,000 contribution get the same transparency. Participation shouldn't require insider access.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Palante means forward"
        description="In Puerto Rican and broader Latino Spanish, ¡palante! is short for para adelante: keep going, move ahead, together. It's the idea this platform is built on."
      />

      <Container className="grid gap-12 py-16 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div className="space-y-5 text-lg leading-relaxed text-noche/85">
          <h2 className="text-3xl font-bold text-noche">Why we built this</h2>
          <p>
            Political money is usually raised in one place and spent somewhere
            no one can see. Most people never learn what their contribution
            actually paid for.
          </p>
          <p>
            Palante Together turns independent political work into visible
            projects. Each one has a goal, a budget, a timeline, and a public
            record of spending, so communities can pool resources around the
            work they believe in and watch it happen.
          </p>
        </div>

        <section id="principles" aria-labelledby="principles-title" className="scroll-mt-24">
          <h2 id="principles-title" className="text-3xl font-bold text-noche">
            Our principles
          </h2>
          <ul className="mt-6 space-y-6">
            {PRINCIPLES.map((p) => (
              <li key={p.title} className="border-l-2 border-marigold pl-5">
                <h3 className="text-lg font-bold text-noche">{p.title}</h3>
                <p className="mt-1 leading-relaxed text-muted-foreground">{p.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </Container>

      <Container>
        <div className="rounded-3xl bg-noche p-8 text-white sm:p-12">
          <h2 className="text-2xl font-bold sm:text-3xl">About the committee</h2>
          <p className="mt-3 max-w-[68ch] leading-relaxed text-white/75">
            {COMMITTEE.name} is an {COMMITTEE.descriptor}. It may raise
            unlimited contributions from eligible individuals and organizations,
            and it reports all contributions and expenditures to the Federal
            Election Commission.
          </p>
          <Button asChild variant="brand" size="xl" className="mt-8">
            <Link href="/explore">Explore Projects</Link>
          </Button>
        </div>
      </Container>
    </>
  );
}
