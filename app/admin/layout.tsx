import type { Metadata } from "next";
import { ShieldIcon } from "lucide-react";
import { Container } from "@/components/layout/section";
import { SectionNav, type SectionLink } from "@/components/dashboard/dashboard-nav";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin | Palante Together" },
  robots: { index: false, follow: false },
};

const ADMIN_LINKS: SectionLink[] = [
  { href: "/admin", label: "Campaign analytics", exact: true },
  { href: "/admin/fundraisers", label: "Fundraisers" },
  { href: "/admin/organizers", label: "Organizers" },
  { href: "/admin/contributions", label: "Contributions" },
  { href: "/admin/reports", label: "Reports" },
];

// TODO(auth): restrict to admin users (role === "admin") before launch.
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-[70vh] bg-muted/40">
      <div className="bg-noche text-white">
        <Container className="flex items-center gap-2 py-2.5 text-sm">
          <ShieldIcon className="size-4 text-marigold" aria-hidden="true" />
          <span className="font-semibold">Admin console</span>
          <span className="text-white/60">· Preview: access control not connected</span>
        </Container>
      </div>
      <SectionNav links={ADMIN_LINKS} label="Admin" />
      {children}
    </div>
  );
}
