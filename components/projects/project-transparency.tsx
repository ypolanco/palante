import { CheckCircle2Icon, CircleDashedIcon } from "lucide-react";
import { COMMITTEE } from "@/lib/mock-data";
import type { Project } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function ProjectTransparency({ project }: { project: Project }) {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-bold text-noche">Who&apos;s behind this project</h2>
        <dl className="mt-5 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2">
          {[
            ["Committee", COMMITTEE.name],
            ["Committee type", COMMITTEE.type],
            ["FEC committee ID", COMMITTEE.fecId],
            ["Treasurer", COMMITTEE.treasurer],
          ].map(([term, value]) => (
            <div key={term} className="bg-card p-5">
              <dt className="text-sm text-muted-foreground">{term}</dt>
              <dd className="mt-1 font-medium text-noche">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-noche">Public filings</h2>
        <p className="mt-2 max-w-[68ch] leading-relaxed text-muted-foreground">
          Independent expenditures are reported to the Federal Election
          Commission. Filing links will point to the public FEC record once
          this platform is connected.
        </p>
        <ul className="mt-5 divide-y rounded-2xl border bg-card">
          {project.filings.map((f) => (
            <li key={f.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <p className="font-medium text-noche">{f.name}</p>
                <p className="text-sm text-muted-foreground">Coverage: {f.period}</p>
              </div>
              <p className="inline-flex items-center gap-1.5 text-sm">
                {f.status === "Filed" ? (
                  <CheckCircle2Icon className="size-4 text-jade" aria-hidden="true" />
                ) : (
                  <CircleDashedIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                )}
                <span className="font-medium text-noche">{f.status}</span>
                <span className="text-muted-foreground">
                  {f.status === "Filed" ? "on" : "due"}{" "}
                  <time dateTime={f.filedOn}>{formatDate(f.filedOn, { short: true })}</time>
                </span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl bg-sand p-6 text-sm leading-relaxed text-noche/85">
        <h2 className="font-heading text-lg font-bold text-noche">Our transparency commitments</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5">
          <li>We publish the full proposed budget before raising money.</li>
          <li>We post an update whenever we report a new expenditure.</li>
          <li>We never coordinate with candidates, campaigns, or parties.</li>
          <li>Contributor information is reported as required by law and never sold.</li>
        </ul>
      </section>
    </div>
  );
}
