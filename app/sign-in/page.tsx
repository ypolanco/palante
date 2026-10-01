import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogoMark } from "@/components/brand/logo";
import { Container } from "@/components/layout/section";
import { SignInForm } from "@/components/auth/sign-in-form";
import { safeRedirectPath } from "@/lib/auth/session";
import { getSessionUser } from "@/lib/services/fundraisers";

export const metadata: Metadata = {
  title: "Sign In",
};

export default async function SignInPage(props: PageProps<"/sign-in">) {
  const { next } = await props.searchParams;
  const destination = safeRedirectPath(Array.isArray(next) ? next[0] : next);
  if (await getSessionUser()) redirect(destination);

  return (
    <Container className="flex justify-center py-20">
      <div className="w-full max-w-sm">
        <LogoMark className="size-11" />
        <h1 className="mt-6 text-3xl font-extrabold text-noche">Sign in</h1>
        <p className="mt-2 text-muted-foreground">
          Track your contributions and follow the projects you support at
          the crowdfunded super PAC.
        </p>
        <SignInForm next={destination} />
        <p className="mt-4 text-xs text-muted-foreground">
          Authentication isn&apos;t connected in this preview. Sign in as{" "}
          <span className="font-medium text-noche">maria@example.com</span> with any password.
        </p>
      </div>
    </Container>
  );
}
