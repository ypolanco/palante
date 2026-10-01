"use client";

import { useMemo, useState } from "react";
import { SearchIcon, SearchXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FundraiserCard } from "@/components/fundraisers/fundraiser-card";
import type { Fundraiser, User } from "@/lib/types";
import { cn } from "@/lib/utils";

const FILTERS = {
  trending: "Trending",
  newest: "Newest",
  raised: "Most Raised",
  near: "Near Goal",
} as const;

type FilterKey = keyof typeof FILTERS;

type Item = { fundraiser: Fundraiser; organizer: User | undefined };

const progress = (f: Fundraiser) => (f.goal > 0 ? f.raised / f.goal : 0);

/** "Near goal" = at least 70% of the way there but not yet past it. */
const NEAR_GOAL_MIN = 0.7;

const APPLY: Record<FilterKey, (items: Item[]) => Item[]> = {
  trending: (items) => [...items].sort((a, b) => b.fundraiser.momentum - a.fundraiser.momentum),
  newest: (items) =>
    [...items].sort((a, b) => (b.fundraiser.launchedOn ?? "").localeCompare(a.fundraiser.launchedOn ?? "")),
  raised: (items) => [...items].sort((a, b) => b.fundraiser.raised - a.fundraiser.raised),
  near: (items) =>
    items
      .filter(({ fundraiser: f }) => progress(f) >= NEAR_GOAL_MIN && progress(f) < 1)
      .sort((a, b) => progress(b.fundraiser) - progress(a.fundraiser)),
};

export function ExploreFundraisers({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState<FilterKey>("trending");
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = items.filter(
      ({ fundraiser: f, organizer }) =>
        !q ||
        [f.title, f.summary, organizer?.name ?? "", organizer?.location ?? ""].some((field) =>
          field.toLowerCase().includes(q),
        ),
    );
    return APPLY[filter](matched);
  }, [items, filter, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="group"
          aria-label="Sort and filter fundraisers"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:px-0"
        >
          {(Object.keys(FILTERS) as FilterKey[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                filter === key
                  ? "border-noche bg-noche text-white"
                  : "bg-white text-noche hover:border-noche/40",
              )}
            >
              {FILTERS[key]}
            </button>
          ))}
        </div>

        <div className="relative lg:w-80">
          <SearchIcon
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, organizer, or place"
            aria-label="Search fundraisers"
            className="h-11 bg-white pl-9 text-base sm:text-sm"
          />
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        {results.length} {results.length === 1 ? "fundraiser" : "fundraisers"}
        {filter === "near" ? " close to their goal" : ""}
      </p>

      {results.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map(({ fundraiser, organizer }) => (
            <FundraiserCard key={fundraiser.id} fundraiser={fundraiser} organizer={organizer} headingLevel="h2" />
          ))}
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed px-6 py-16 text-center">
          <SearchXIcon className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="mt-4 font-heading text-lg font-bold text-noche">No fundraisers match</p>
          <p className="mt-1 text-muted-foreground">Try a different search or filter.</p>
          <Button
            variant="outline"
            size="lg"
            className="mt-6"
            onClick={() => {
              setQuery("");
              setFilter("trending");
            }}
          >
            Clear search
          </Button>
        </div>
      )}
    </div>
  );
}
