import { getTranslations } from "next-intl/server";

// Route-level Suspense fallback. Shown instantly during navigation while a
// segment streams in, improving perceived performance and giving a stable
// loading state instead of a blank screen.
export default async function Loading() {
  const t = await getTranslations("errors");

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
      <span
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "3px solid rgba(255,255,255,0.2)",
          borderTopColor: "#1ed760",
          animation: "tkm-spin 0.8s linear infinite",
        }}
      />
      <span style={{ opacity: 0.7 }}>{t("loading")}</span>
    </div>
  );
}
