"use client"; // Must be a Client Component, and replaces the root layout.

import { useEffect } from "react";

// Last-resort boundary for errors thrown in the root layout itself. It renders
// in place of the whole document, so it must supply its own <html>/<body> and
// cannot rely on the app's providers (i18n context, global styles). Copy is
// kept minimal and locale-neutral on purpose.
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          background: "#00101a",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: 24,
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Something went wrong</h1>
        <p style={{ maxWidth: 420, opacity: 0.7 }}>
          An unexpected error occurred. Please try again.
        </p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          style={{
            marginTop: 8,
            padding: "10px 24px",
            borderRadius: 999,
            background: "#1ed760",
            color: "#00101a",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
