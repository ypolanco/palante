"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface SectionLink {
  href: string;
  label: string;
  /** Only highlight on an exact path match (for index pages). */
  exact?: boolean;
}

const DASHBOARD_LINKS: SectionLink[] = [
  { href: "/dashboard", label: "Overview", exact: true },
  { href: "/dashboard/fundraisers", label: "My fundraisers" },
  { href: "/dashboard/contributions", label: "My contributions" },
];

/** Horizontal sub-navigation for an app section (dashboard, admin). */
export function SectionNav({ links, label }: { links: SectionLink[]; label: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label={label} className="border-b bg-white">
      <ul className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
        {links.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <li key={link.href} className="shrink-0">
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-12 items-center px-3 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-noche focus-visible:ring-3 focus-visible:ring-ring/50",
                  active && "text-noche after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-noche",
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function DashboardNav() {
  return <SectionNav links={DASHBOARD_LINKS} label="Dashboard" />;
}
