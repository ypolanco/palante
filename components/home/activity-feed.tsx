import Link from "next/link";
import { HandHeartIcon, MegaphoneIcon, ReceiptIcon } from "lucide-react";
import { Container } from "@/components/layout/section";
import { getProject } from "@/lib/mock-data";
import type { ActivityItem } from "@/lib/types";

const KIND = {
  contribution: { icon: HandHeartIcon, className: "bg-marigold/20 text-marigold-deep" },
  update: { icon: MegaphoneIcon, className: "bg-jade-soft text-jade" },
  expenditure: { icon: ReceiptIcon, className: "bg-sand text-noche" },
} as const;

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <section aria-labelledby="activity-title" className="pb-8">
      <Container>
        <div className="rounded-3xl border bg-card p-6 sm:p-10">
          <h2 id="activity-title" className="text-2xl font-bold text-noche sm:text-3xl">
            Happening now
          </h2>
          <p className="mt-2 text-muted-foreground">
            Contributions, updates, and reported spending across the platform.
          </p>
          <ul className="mt-8 grid gap-x-10 md:grid-cols-2">
            {items.map((item) => {
              const { icon: Icon, className } = KIND[item.kind];
              const project = getProject(item.projectSlug);
              return (
                <li key={item.id} className="flex gap-3 border-t py-4">
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full ${className}`}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-noche">{item.text}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {project ? (
                        <Link href={`/projects/${project.slug}`} className="underline-offset-2 hover:underline">
                          {project.title}
                        </Link>
                      ) : null}
                      <span className="ml-2">{item.ago}</span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
