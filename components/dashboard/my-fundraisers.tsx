"use client";

import { useState } from "react";
import Link from "next/link";
import { BarChart3Icon, EyeIcon, PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/fundraisers/fundraiser-card";
import { FundraiserCover } from "@/components/fundraisers/media";
import { ProjectProgress } from "@/components/projects/project-progress";
import { ShareButton } from "@/components/share/share-panel";
import { fundraiserPath } from "@/lib/fundraisers/utils";
import type { Fundraiser, FundraiserStatus } from "@/lib/types";
import { cn, formatCurrency, formatDate, formatNumber } from "@/lib/utils";

const TABS: Array<{ key: "all" | FundraiserStatus; label: string }> = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "draft", label: "Draft" },
  { key: "ended", label: "Ended" },
];

export function MyFundraisers({ fundraisers }: { fundraisers: Fundraiser[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");
  const visible = fundraisers.filter((f) => tab === "all" || f.status === tab);

  return (
    <div>
      <div role="group" aria-label="Filter by status" className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {TABS.map((t) => {
          const count = t.key === "all" ? fundraisers.length : fundraisers.filter((f) => f.status === t.key).length;
          return (
            <button
              key={t.key}
              type="button"
              aria-pressed={tab === t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                tab === t.key ? "border-noche bg-noche text-white" : "bg-white text-noche hover:border-noche/40",
              )}
            >
              {t.label} <span className="tabular opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
          No fundraisers here yet.
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {visible.map((f) => {
            const isDraft = f.status === "draft";
            return (
              <li key={f.id} className="overflow-hidden rounded-2xl border bg-card">
                <div className="grid grid-cols-1 sm:grid-cols-[12rem_1fr]">
                  <FundraiserCover src={f.coverImage} alt="" sizes="192px" className="aspect-[16/9] sm:aspect-auto sm:h-full" />
                  <div className="p-5">
                    <StatusBadge status={f.status} />
                    <h2 className="mt-2 text-lg leading-snug font-bold text-noche">{f.title}</h2>
                    <p className="text-xs text-muted-foreground">Created {formatDate(f.createdOn, { short: true })}</p>

                    <ProjectProgress raised={f.raised} goal={f.goal} label={f.title} size="sm" className="mt-4" />
                    <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
                      <div>
                        <dt className="text-xs text-muted-foreground">Raised</dt>
                        <dd className="tabular font-semibold text-noche">{formatCurrency(f.raised)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Goal</dt>
                        <dd className="tabular font-semibold text-noche">{formatCurrency(f.goal)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Contributors</dt>
                        <dd className="tabular font-semibold text-noche">{formatNumber(f.contributorCount)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Views</dt>
                        <dd className="tabular font-semibold text-noche">{formatNumber(f.pageViews)}</dd>
                      </div>
                    </dl>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {isDraft ? null : (
                        <Button asChild variant="outline" size="lg">
                          <Link href={fundraiserPath(f.slug)}>
                            <EyeIcon data-icon="inline-start" aria-hidden="true" />
                            View
                          </Link>
                        </Button>
                      )}
                      <Button asChild variant="outline" size="lg">
                        <Link href={`/dashboard/fundraisers/${f.id}/edit`}>
                          <PencilIcon data-icon="inline-start" aria-hidden="true" />
                          {isDraft ? "Continue editing" : "Edit"}
                        </Link>
                      </Button>
                      {f.status === "active" ? (
                        <ShareButton fundraiser={f} editableMessage variant="brand" size="lg" />
                      ) : null}
                      {isDraft ? null : (
                        <Button asChild variant="ghost" size="lg">
                          <Link href={`/dashboard/fundraisers/${f.id}/analytics`}>
                            <BarChart3Icon data-icon="inline-start" aria-hidden="true" />
                            Analytics
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
