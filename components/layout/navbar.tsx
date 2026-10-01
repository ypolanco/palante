"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/fundraisers", label: "Fundraisers" },
  { href: "/explore", label: "Projects" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/transparency", label: "Transparency" },
  { href: "/updates", label: "Updates" },
  { href: "/about", label: "About" },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

const ACCOUNT_LINKS = [
  { href: "/dashboard", label: "Your dashboard" },
  { href: "/sign-in", label: "Sign In" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-white/85 backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Main" className="hidden flex-1 lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(pathname, link.href) ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-noche focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                    isActive(pathname, link.href) && "text-noche",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost" size="lg" className="hidden sm:inline-flex">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild variant="brand" size="lg">
            <Link href="/fundraisers/create">
              <span className="sm:hidden">Start</span>
              <span className="hidden sm:inline">Start a Fundraiser</span>
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-lg" className="lg:hidden" aria-label="Open menu">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs">
              <SheetHeader>
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <Logo />
              </SheetHeader>
              <nav aria-label="Mobile" className="px-4">
                <ul className="flex flex-col">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        aria-current={isActive(pathname, link.href) ? "page" : undefined}
                        className="block rounded-md px-2 py-3 font-heading text-lg font-semibold text-noche hover:bg-muted"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  <li className="mt-4 mb-2 border-t pt-4">
                    <Button asChild variant="brand" size="xl" className="w-full">
                      <Link href="/fundraisers/create" onClick={() => setOpen(false)}>
                        Start a Fundraiser
                      </Link>
                    </Button>
                  </li>
                  {ACCOUNT_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-md px-2 py-3 text-base font-medium text-muted-foreground hover:bg-muted"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
