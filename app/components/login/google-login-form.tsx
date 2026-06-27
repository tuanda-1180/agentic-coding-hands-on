"use client";

import { useFormStatus } from "react-dom";
import { signInWithGoogleAction } from "@/app/lib/auth/actions";
import { LoginButton } from "./login-button";

/**
 * Submit button bound to the form's pending state. While the Google OAuth
 * server action runs, `pending` is true → the button is disabled and shows a
 * spinner (testcase 37eae882: "disabled with loader during authentication").
 */
function SubmitButton({ errorMessage }: { errorMessage?: string }) {
  const { pending } = useFormStatus();
  return <LoginButton type="submit" isLoading={pending} errorMessage={errorMessage} />;
}

/**
 * Wires the presentational LoginButton to the Google OAuth flow. Submitting the
 * form invokes `signInWithGoogleAction`, which redirects to Google and, on
 * success, back to `callbackUrl` (if a safe relative path) or `/`.
 */
export function GoogleLoginForm({
  errorMessage,
  callbackUrl,
}: {
  errorMessage?: string;
  callbackUrl?: string;
}) {
  return (
    <form action={signInWithGoogleAction}>
      {callbackUrl && (
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
      )}
      <SubmitButton errorMessage={errorMessage} />
    </form>
  );
}
