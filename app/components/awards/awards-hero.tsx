"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

/**
 * Full-bleed keyvisual hero for the awards page.
 *
 * Mirrors the homepage hero: the section slides up under the 80px sticky header
 * (marginTop -80) so the keyvisual is full-bleed behind the translucent header.
 * ROOT FURTHER logo (338×150) and the title block sit LEFT-aligned at the design
 * Y (padding-top 184 → first 80px is under the header). A bottom dark gradient
 * (design "Cover") keeps the title readable on the lower part of the artwork.
 */
export default function AwardsHero() {
  const t = useTranslations("awardsPage");

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        marginTop: "-80px",
        backgroundColor: "#00101A",
      }}
    >
      {/* Layer 1: keyvisual artwork */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Image
          src="/saa/keyvisual-bg.png"
          alt={t("keyvisualAlt")}
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center top" }}
        />
      </div>

      {/* Layer 2: bottom→transparent dark gradient so the title reads on the
          lower part of the keyvisual (design node "Cover"). */}
      <div
        aria-hidden={true}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(180deg, rgba(0,16,26,0) 47%, #00101A 100%)",
        }}
      />

      {/* Layer 3: content — ROOT FURTHER + title, left-aligned */}
      <div
        className="hero-content"
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "184px 144px 96px",
          display: "flex",
          flexDirection: "column",
          gap: "120px",
          alignItems: "flex-start",
        }}
      >
        {/* ROOT FURTHER logo (design 338×150) */}
        <Image
          src="/saa/root-further-logo.png"
          alt="ROOT FURTHER"
          width={338}
          height={150}
          priority
          style={{ maxWidth: "100%", height: "auto" }}
        />

        {/* Title block — centered: subtitle + divider + gold heading */}
        <div
          className="awards-section-title"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            width: "100%",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "24px",
              lineHeight: "32px",
              color: "#FFFFFF",
              margin: 0,
            }}
          >
            {t("sectionSubtitle")}
          </p>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid #2E3940",
              margin: 0,
              width: "100%",
            }}
          />
          <h1
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "57px",
              lineHeight: "64px",
              letterSpacing: "-0.25px",
              color: "#FFEA9E",
              margin: 0,
            }}
          >
            {t("sectionTitle")}
          </h1>
        </div>
      </div>
    </section>
  );
}
