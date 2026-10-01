import { SpendingBreakdown } from "@/components/transparency/spending-breakdown";
import type { Project } from "@/lib/types";
import { formatCurrency, percentFunded } from "@/lib/utils";

export function ProjectBudget({ project }: { project: Project }) {
  const total = project.budget.reduce((s, l) => s + l.planned, 0);
  const coverage = percentFunded(project.raised, total);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-noche">Proposed budget</h2>
        <p className="mt-2 max-w-[68ch] leading-relaxed text-muted-foreground">
          This is how the organizers plan to spend the full{" "}
          {formatCurrency(project.goal)} goal. Funds raised so far cover{" "}
          <span className="tabular font-semibold text-noche">{coverage}%</span>{" "}
          of the plan. Compare it with what&apos;s actually been spent on the
          Spending tab.
        </p>
      </div>
      <SpendingBreakdown lines={project.budget} />
    </div>
  );
}
