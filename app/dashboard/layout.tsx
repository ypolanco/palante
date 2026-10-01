import { DashboardNav } from "@/components/dashboard/dashboard-nav";

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <>
      <DashboardNav />
      {children}
    </>
  );
}
