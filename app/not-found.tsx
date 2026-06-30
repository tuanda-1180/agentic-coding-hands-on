import Link from "next/link";
import { getTranslations } from "next-intl/server";

// Custom 404 shown when `notFound()` is called in a segment (e.g. unknown
// profile id) or a route doesn't match. Server Component so the copy is in the
// initial HTML and localized via the request locale.
export default async function NotFound() {
  const t = await getTranslations("errors");

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: 24,
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: 64, fontWeight: 700, lineHeight: 1, opacity: 0.9 }}>
        404
      </p>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>{t("notFoundTitle")}</h1>
      <p style={{ maxWidth: 420, opacity: 0.7 }}>{t("notFoundBody")}</p>
      <Link
        href="/"
        style={{
          marginTop: 8,
          padding: "10px 24px",
          borderRadius: 999,
          background: "#1ed760",
          color: "#00101a",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        {t("backHome")}
      </Link>
    </main>
  );
}
