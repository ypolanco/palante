import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container, PageHeader } from "@/components/layout/section";
import { HowItWorks } from "@/components/home/how-it-works";

export const metadata: Metadata = {
  title: "How It Works",
  description: "How Palante Together funds independent political projects and reports spending.",
};

const FAQ = [
  {
    q: "What is an independent expenditure?",
    a: "Spending on political communication, like ads, mail, or outreach, that is made without coordinating with any candidate, campaign, or party. Every project on Palante Together is an independent expenditure effort.",
  },
  {
    q: "Does my contribution go to a candidate?",
    a: "No. Contributions fund the project you choose, run by Palante Together PAC. They are never given to, or spent in coordination with, a candidate or campaign.",
  },
  {
    q: "Who can contribute?",
    a: "U.S. citizens and lawful permanent residents, contributing their own funds. Foreign nationals and federal government contractors cannot contribute.",
  },
  {
    q: "What information is reported about me?",
    a: "If your contributions total more than $200 in a calendar year, your name, address, occupation, and employer are reported to the Federal Election Commission as required by law.",
  },
  {
    q: "How do I know how the money was spent?",
    a: "Every project publishes a proposed budget up front, then lists each reported expenditure with its payee, purpose, amount, and filing on its Spending tab.",
  },
  {
    q: "Is my contribution tax deductible?",
    a: "No. Contributions to political committees are not tax deductible.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        title="How Palante Together works"
        description="Fund independent political projects, then follow every dollar from contribution to reported expenditure."
      />
      <HowItWorks showCta={false} />

      <Container className="py-20">
        <section id="faq" aria-labelledby="faq-title" className="scroll-mt-24">
          <h2 id="faq-title" className="text-3xl font-bold text-noche sm:text-4xl">
            Common questions
          </h2>
          <div className="mt-8 divide-y rounded-2xl border bg-card">
            {FAQ.map((item) => (
              <details key={item.q} className="group p-5 sm:p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading text-lg font-bold text-noche [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span
                    aria-hidden="true"
                    className="text-2xl leading-none text-muted-foreground transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-[68ch] leading-relaxed text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="mt-16 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="brand" size="xl">
            <Link href="/explore">Explore Projects</Link>
          </Button>
          <Button asChild variant="outline" size="xl">
            <Link href="/transparency">See reported spending</Link>
          </Button>
        </div>
      </Container>
    </>
  );
}
