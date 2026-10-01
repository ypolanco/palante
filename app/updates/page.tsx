import type { Metadata } from "next";
import Link from "next/link";
import { FlagIcon, MegaphoneIcon, ReceiptIcon } from "lucide-react";
import { Container, PageHeader } from "@/components/layout/section";
import { projects } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Updates",
  description: "The latest milestones and spending reports from projects on Palante Together.",
};

const KIND = {
  milestone: { icon: FlagIcon, label: "Milestone" },
  spending: { icon: ReceiptIcon, label: "Spending" },
  general: { icon: MegaphoneIcon, label: "Update" },
} as const;

export default function UpdatesPage() {
  const updates = projects
    .flatMap((p) => p.updates.map((u) => ({ ...u, project: p })))
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHeader
        title="Updates"
        description="Milestones, spending reports, and news from every project, newest first."
      />
      <Container className="py-12">
        <ol className="mx-auto max-w-3xl space-y-4">
          {updates.map((u) => {
            const { icon: Icon, label } = KIND[u.kind];
            return (
              <li key={u.id}>
                <article className="rounded-2xl border bg-card p-6">
                  <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-jade-soft px-2.5 py-0.5 text-xs font-semibold text-jade">
                      <Icon className="size-3" aria-hidden="true" />
                      {label}
                    </span>
                    <time dateTime={u.date}>{formatDate(u.date)}</time>
                  </p>
                  <h2 className="mt-3 text-xl font-bold text-noche">{u.title}</h2>
                  <p className="mt-2 leading-relaxed text-noche/80">{u.body}</p>
                  <Link
                    href={`/projects/${u.project.slug}#updates`}
                    className="mt-4 inline-block text-sm font-medium text-jade underline-offset-2 hover:underline"
                  >
                    {u.project.title}
                  </Link>
                </article>
              </li>
            );
          })}
        </ol>
      </Container>
    </>
  );
}
