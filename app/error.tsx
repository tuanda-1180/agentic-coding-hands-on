"use client"; // Error boundaries must be Client Components.

import { useEffect } from "react";
import { useTranslations } from "next-intl";

// Segment-level error boundary: catches unexpected runtime errors thrown while
// rendering a route and shows a recoverable fallback. `unstable_retry` is the
// Next.js 16 replacement for the former `reset` prop — it re-renders the
// segment to attempt recovery.
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const t = useTranslations("errors");

  useEffect(() => {
    // Surface the error for client-side reporting / debugging.
    console.error(error);
  }, [error]);

  return (
    <main
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: 24,
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>{t("errorTitle")}</h1>
      <p style={{ maxWidth: 420, opacity: 0.7 }}>{t("errorBody")}</p>
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
        {t("retry")}
      </button>
    </main>
  );
}
