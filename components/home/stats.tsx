import { Container } from "@/components/layout/section";
import { MockDataNote } from "@/components/layout/mock-data-note";
import { PLATFORM_STATS } from "@/lib/mock-data";
import { formatCompactCurrency, formatNumber } from "@/lib/utils";

const STATS = [
  { value: formatCompactCurrency(PLATFORM_STATS.raised), label: "Raised" },
  { value: formatNumber(PLATFORM_STATS.contributors), label: "Contributors" },
  { value: String(PLATFORM_STATS.projectsFunded), label: "Projects funded" },
  {
    value: formatCompactCurrency(PLATFORM_STATS.expendituresReported),
    label: "Independent expenditures reported",
  },
];

export function Stats() {
  return (
    <section aria-label="Platform totals" className="bg-noche text-white">
      <Container className="py-14">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="border-l-2 border-marigold pl-5">
              <dt className="text-sm text-white/70">{stat.label}</dt>
              <dd className="tabular mt-1 font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
        <MockDataNote className="mt-10 text-white/60" />
      </Container>
    </section>
  );
}
