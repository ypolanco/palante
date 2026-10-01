import { LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { signOut } from "@/app/sign-in/actions";
import { getCurrentUser } from "@/lib/services/fundraisers";

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const user = await getCurrentUser();

  return (
    <>
      <DashboardNav
        trailing={
          <form action={signOut} className="flex shrink-0 items-center gap-3">
            <span className="hidden text-sm text-muted-foreground md:inline">{user.email}</span>
            <Button type="submit" variant="ghost" size="sm">
              <LogOutIcon aria-hidden="true" />
              Sign out
            </Button>
          </form>
        }
      />
      {children}
    </>
  );
}
