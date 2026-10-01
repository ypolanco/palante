import type { Metadata } from "next";
import Link from "next/link";
import { HandCoinsIcon, HeartHandshakeIcon, RepeatIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/section";
import { MockDataNote } from "@/components/layout/mock-data-note";
import { ProjectProgress } from "@/components/projects/project-progress";
import { TransparencyCard } from "@/components/transparency/transparency-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getProject, mockContributor } from "@/lib/mock-data";
import type { Project } from "@/lib/types";
import { formatCurrency, formatDate, percentFunded } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Your dashboard",
};

export default function DashboardPage() {
  const { contributions, following } = mockContributor;
  const total = contributions.reduce((s, c) => s + c.amount, 0);
  const recurring = contributions.filter((c) => c.recurring);
  const monthly = new Set(recurring.map((c) => c.projectSlug)).size;
  const followed = following
    .map((slug) => getProject(slug))
    .filter((p): p is Project => Boolean(p));
  const latestUpdates = followed
    .flatMap((p) => p.updates.map((u) => ({ ...u, project: p })))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);

  return (
    <Container className="py-10 sm:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-muted-foreground">Welcome back</p>
          <h1 className="text-4xl font-extrabold text-noche">{mockContributor.name}</h1>
          <MockDataNote className="mt-2" />
        </div>
        <Button asChild variant="brand" size="xl">
          <Link href="/explore">Find a project</Link>
        </Button>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <TransparencyCard icon={HandCoinsIcon} label="Total contributed" value={formatCurrency(total)} hint="Calendar year 2026" />
        <TransparencyCard icon={HeartHandshakeIcon} label="Projects supported" value={String(new Set(contributions.map((c) => c.projectSlug)).size)} />
        <TransparencyCard icon={RepeatIcon} label="Monthly contributions" value={String(monthly)} />
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="following-title">
          <h2 id="following-title" className="text-2xl font-bold text-noche">Projects you follow</h2>
          <ul className="mt-5 space-y-3">
            {followed.map((p) => (
              <li key={p.slug} className="rounded-2xl border bg-card p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <Link href={`/projects/${p.slug}`} className="font-bold text-noche hover:underline">
                    {p.title}
                  </Link>
                  <span className="tabular shrink-0 text-sm font-semibold text-jade">
                    {percentFunded(p.raised, p.goal)}%
                  </span>
                </div>
                <ProjectProgress raised={p.raised} goal={p.goal} label={p.title} size="sm" className="mt-3" />
                <p className="tabular mt-2 text-sm text-muted-foreground">
                  {formatCurrency(p.raised)} of {formatCurrency(p.goal)} · {p.daysLeft} days left
                </p>
              </li>
            ))}
          </ul>

          <h2 className="mt-12 text-2xl font-bold text-noche">Contribution history</h2>
          <div className="mt-5 overflow-hidden rounded-2xl border bg-card">
            <Table>
              <TableHeader className="bg-muted/60">
                <TableRow>
                  <TableHead className="pl-5">Date</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead className="pr-5 text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contributions.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="tabular pl-5 text-muted-foreground">
                      {formatDate(c.date, { short: true })}
                    </TableCell>
                    <TableCell className="max-w-56 truncate text-noche">
                      {getProject(c.projectSlug)?.title}
                      {c.recurring ? (
                        <span className="ml-2 rounded-full bg-sand px-2 py-0.5 text-xs">Monthly</span>
                      ) : null}
                    </TableCell>
                    <TableCell className="tabular pr-5 text-right font-semibold text-noche">
                      {formatCurrency(c.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section aria-labelledby="latest-title">
          <h2 id="latest-title" className="text-2xl font-bold text-noche">Latest from your projects</h2>
          <ul className="mt-5 space-y-3">
            {latestUpdates.map((u) => (
              <li key={u.id} className="rounded-2xl bg-sand p-5">
                <p className="text-xs text-muted-foreground">
                  <time dateTime={u.date}>{formatDate(u.date, { short: true })}</time>
                </p>
                <p className="mt-1 font-bold text-noche">{u.title}</p>
                <Link href={`/projects/${u.project.slug}#updates`} className="mt-1 inline-block text-sm text-jade hover:underline">
                  {u.project.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Container>
  );
}
