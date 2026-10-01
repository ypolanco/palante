"use client";

import { useMemo, useState } from "react";
import { SearchIcon, SearchXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectGrid } from "@/components/projects/project-grid";
import { CATEGORIES, type Category, type Project } from "@/lib/types";
import { cn } from "@/lib/utils";

const SORTS = {
  trending: "Trending",
  funded: "Most Funded",
  newest: "Newest",
  ending: "Ending Soon",
} as const;

type SortKey = keyof typeof SORTS;

const SORTERS: Record<SortKey, (a: Project, b: Project) => number> = {
  trending: (a, b) => b.momentum - a.momentum,
  funded: (a, b) => b.raised / b.goal - a.raised / a.goal,
  newest: (a, b) => b.launchedOn.localeCompare(a.launchedOn),
  ending: (a, b) => a.daysLeft - b.daysLeft,
};

export function ExploreProjects({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState<Category | "All">("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("trending");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects
      .filter((p) => category === "All" || p.category === category)
      .filter(
        (p) =>
          !q ||
          [p.title, p.summary, p.location, p.category].some((field) =>
            field.toLowerCase().includes(q),
          ),
      )
      .sort(SORTERS[sort]);
  }, [projects, category, query, sort]);

  function reset() {
    setCategory("All");
    setQuery("");
  }

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="group"
          aria-label="Filter by category"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:px-0"
        >
          {(["All", ...CATEGORIES] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                category === c
                  ? "border-noche bg-noche text-white"
                  : "bg-white text-noche hover:border-noche/40",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1 lg:w-72 lg:flex-none">
            <SearchIcon
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects"
              aria-label="Search projects"
              className="h-10 bg-white pl-9"
            />
          </div>
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger aria-label="Sort projects" className="h-10! w-40 bg-white">
              <SelectValue>{SORTS[sort]}</SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              {(Object.keys(SORTS) as SortKey[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {SORTS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        {results.length} {results.length === 1 ? "project" : "projects"}
        {category !== "All" ? ` in ${category}` : ""}
      </p>

      {results.length > 0 ? (
        <ProjectGrid projects={results} className="mt-4 lg:grid-cols-3 xl:grid-cols-3" />
      ) : (
        <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed px-6 py-16 text-center">
          <SearchXIcon className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="mt-4 font-heading text-lg font-bold text-noche">No projects match your search</p>
          <p className="mt-1 text-muted-foreground">
            Try a different keyword or show all categories.
          </p>
          <Button variant="outline" size="lg" className="mt-6" onClick={reset}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
