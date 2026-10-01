"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession, safeRedirectPath } from "@/lib/auth/session";
import { findUserByEmail } from "@/lib/services/fundraisers";

export interface SignInState {
  error?: string;
  email?: string;
}

export async function signIn(_prev: SignInState | undefined, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password.", email };
  }

  // TODO(auth): verify the password with the real auth provider.
  const user = await findUserByEmail(email);
  if (!user) {
    return { error: "We couldn't find an account with that email and password.", email };
  }

  await createSession(user.id);
  redirect(safeRedirectPath(formData.get("next")));
}

export async function signOut() {
  await deleteSession();
  redirect("/sign-in");
}
