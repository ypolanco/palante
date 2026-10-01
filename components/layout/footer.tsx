import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { COMMITTEE } from "@/lib/mock-data";

const COLUMNS = [
  {
    heading: "Platform",
    links: [
      { href: "/explore", label: "Explore projects" },
      { href: "/how-it-works", label: "How it works" },
      { href: "/updates", label: "Updates" },
      { href: "/dashboard", label: "Your dashboard" },
    ],
  },
  {
    heading: "Accountability",
    links: [
      { href: "/transparency", label: "Transparency" },
      { href: "/transparency#filings", label: "Public filings" },
      { href: "/how-it-works#faq", label: "Contribution rules" },
    ],
  },
  {
    heading: "Organization",
    links: [
      { href: "/about", label: "About" },
      { href: "/about#principles", label: "Our principles" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-noche text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-sm">
            <Logo tone="light" />
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Move forward. Fund together. See the impact.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h2 className="text-sm font-semibold text-white">{col.heading}</h2>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 space-y-3 border-t border-white/15 pt-6 text-xs leading-relaxed text-white/60">
          <p className="max-w-3xl rounded-lg border border-white/20 px-4 py-3 text-white/80">
            Paid for by {COMMITTEE.name}. Not authorized by any candidate or
            candidate&apos;s committee. Contributions are not tax deductible.
          </p>
          <p className="max-w-3xl">
            {COMMITTEE.name} is an {COMMITTEE.descriptor}. It makes
            independent expenditures only and does not contribute to or
            coordinate with candidates, campaigns, or political parties.
          </p>
          <p>
            Development preview. All projects, figures, and filings shown are
            fictional mock data.
          </p>
        </div>
      </div>
    </footer>
  );
}
