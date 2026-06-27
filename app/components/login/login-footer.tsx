import { getTranslations } from "next-intl/server";

/**
 * mms_D_Footer — login-page copyright footer.
 * Figma: 1440px wide, py-40 px-90, border-top #2E3940 1px solid.
 * Text: "Bản quyền thuộc về Sun* © 2025", Montserrat Alternates Bold 16px, centered.
 */
export async function LoginFooter() {
  const t = await getTranslations("footer");
  return (
    <footer
      style={{
        position: "relative",
        zIndex: 2,
        width: "100%",
        padding: "40px 90px",
        borderTop: "1px solid #2E3940",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: "var(--font-montserrat-alternates, 'Montserrat Alternates', Montserrat, sans-serif)",
          fontWeight: 700,
          fontSize: "16px",
          lineHeight: "24px",
          color: "#FFFFFF",
          textAlign: "center",
        }}
      >
        {t("copyright")}
      </p>
    </footer>
  );
}
