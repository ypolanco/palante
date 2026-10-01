import Link from "next/link";
import {
  CheckIcon,
  FileTextIcon,
  ReceiptIcon,
  WalletIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/section";
import { SpendingBreakdown } from "@/components/transparency/spending-breakdown";
import { TransparencyCard } from "@/components/transparency/transparency-card";
import type { Project } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const DISCLOSURES = [
  "Fundraising totals",
  "Fundraising goal",
  "Contributor count",
  "Proposed project budget",
  "Actual spending",
  "Spending categories",
  "Project updates",
  "Independent expenditure reports",
  "Public filing information",
];

export function TransparencyPreview({ project }: { project: Project }) {
  const spent = project.expenditures.reduce((s, e) => s + e.amount, 0);

  return (
    <section aria-labelledby="transparency-title" className="py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <h2
            id="transparency-title"
            className="text-4xl leading-[1.02] font-extrabold tracking-[-0.035em] text-noche sm:text-5xl"
          >
            Political spending shouldn&apos;t be a black box.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Palante Together is designed to make independent political projects
            easier to understand. Every project can provide:
          </p>
          <ul className="mt-6 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {DISCLOSURES.map((item) => (
              <li key={item} className="flex items-start gap-2 text-noche">
                <CheckIcon className="mt-0.5 size-4 shrink-0 text-jade" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <Button asChild variant="outline" size="xl" className="mt-10">
            <Link href="/transparency">Explore transparency data</Link>
          </Button>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <TransparencyCard icon={WalletIcon} label="Raised" value={formatCurrency(project.raised)} />
            <TransparencyCard icon={ReceiptIcon} label="Spent and reported" value={formatCurrency(spent)} />
            <TransparencyCard
              icon={FileTextIcon}
              label="IE reports"
              value={String(project.expenditures.length)}
            />
          </div>
          <SpendingBreakdown
            lines={project.budget}
            title={`Example budget: ${project.title}`}
          />
        </div>
      </Container>
    </section>
  );
}
