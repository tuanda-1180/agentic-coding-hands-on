"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { safeRelativeRedirect } from "./safe-redirect";

export async function signInAction(formData: FormData): Promise<void> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    throw new Error("Invalid credentials format");
  }

  // Only accept relative callbackUrls to prevent open-redirect attacks.
  const redirectTo = safeRelativeRedirect(formData.get("callbackUrl"));

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });
  } catch (error) {
    // Auth.js throws a NEXT_REDIRECT for successful sign-in — re-throw it
    if (
      error instanceof Error &&
      error.message.includes("NEXT_REDIRECT")
    ) {
      throw error;
    }
    if (error instanceof AuthError) {
      throw new Error("Invalid email or password");
    }
    throw error;
  }
}

export async function signInWithGoogleAction(formData: FormData): Promise<void> {
  // Only accept relative callbackUrls to prevent open-redirect attacks;
  // default to the homepage per the login spec.
  const redirectTo = safeRelativeRedirect(formData.get("callbackUrl"));

  try {
    // All Google accounts are allowed.
    await signIn("google", { redirectTo });
  } catch (error) {
    // Auth.js throws a NEXT_REDIRECT for the OAuth handoff — re-throw it so the
    // browser is redirected to Google's consent screen.
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }
    // Surface auth failures to the login page via a query param the UI reads.
    if (error instanceof AuthError) {
      redirect("/login?error=google");
    }
    throw error;
  }
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}

export async function redirectToLogin(): Promise<never> {
  redirect("/login");
}
