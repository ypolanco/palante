import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogoMark } from "@/components/brand/logo";
import { Container } from "@/components/layout/section";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <Container className="flex justify-center py-20">
      <div className="w-full max-w-sm">
        <LogoMark className="size-11" />
        <h1 className="mt-6 text-3xl font-extrabold text-noche">Sign in</h1>
        <p className="mt-2 text-muted-foreground">
          Track your contributions and follow the projects you support.
        </p>
        <form action="/dashboard" className="mt-8 space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-noche">
              Email
            </Label>
            <Input id="email" name="email" type="email" autoComplete="email" required className="mt-1.5 h-11 bg-white" />
          </div>
          <Button type="submit" variant="default" size="xl" className="w-full">
            Email me a sign-in link
          </Button>
        </form>
        <p className="mt-4 text-xs text-muted-foreground">
          Authentication isn&apos;t connected in this preview. Submitting opens a demo{" "}
          <Link href="/dashboard" className="underline underline-offset-2">dashboard</Link>.
        </p>
      </div>
    </Container>
  );
}
