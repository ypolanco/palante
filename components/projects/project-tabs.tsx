"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "budget", label: "Budget" },
  { value: "updates", label: "Updates" },
  { value: "spending", label: "Spending" },
  { value: "transparency", label: "Transparency" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

function isTab(value: string): value is TabValue {
  return TABS.some((t) => t.value === value);
}

/**
 * Client-side tabs synced to the URL hash (e.g. /projects/x#budget) so a
 * specific tab can be linked and shared without making the page dynamic.
 */
export function ProjectTabs({ panels }: { panels: Record<TabValue, ReactNode> }) {
  const [tab, setTab] = useState<TabValue>("overview");

  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.slice(1);
      if (isTab(hash)) setTab(hash);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  function handleChange(value: string) {
    if (!isTab(value)) return;
    setTab(value);
    const { pathname, search } = window.location;
    window.history.replaceState(
      null,
      "",
      value === "overview" ? `${pathname}${search}` : `#${value}`,
    );
  }

  return (
    <Tabs value={tab} onValueChange={handleChange} className="gap-8">
      <div className="sticky top-16 z-30 -mx-4 border-b bg-white/90 px-4 backdrop-blur-md sm:mx-0 sm:px-0">
        <TabsList
          variant="line"
          className="h-12! w-full justify-start gap-2 overflow-x-auto overflow-y-hidden"
        >
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="flex-none px-3 text-[0.95rem] group-data-horizontal/tabs:after:bottom-0">
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {TABS.map((t) => (
        <TabsContent key={t.value} value={t.value}>
          {panels[t.value]}
        </TabsContent>
      ))}
    </Tabs>
  );
}
