"use client";

import { useActionState } from "react";
import { signIn } from "@/app/sign-in/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignInForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(signIn, undefined);

  return (
    <form action={action} className="mt-8 space-y-4" noValidate>
      <input type="hidden" name="next" value={next} />
      <div>
        <Label htmlFor="email" className="text-sm font-medium text-noche">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state?.email}
          aria-invalid={state?.error ? true : undefined}
          aria-describedby={state?.error ? "sign-in-error" : undefined}
          className="mt-1.5 h-11 bg-white"
        />
      </div>
      <div>
        <Label htmlFor="password" className="text-sm font-medium text-noche">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={state?.error ? true : undefined}
          aria-describedby={state?.error ? "sign-in-error" : undefined}
          className="mt-1.5 h-11 bg-white"
        />
      </div>
      {state?.error && (
        <p id="sign-in-error" role="alert" className="text-sm font-medium text-destructive">
          {state.error}
        </p>
      )}
      <Button type="submit" variant="default" size="xl" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
