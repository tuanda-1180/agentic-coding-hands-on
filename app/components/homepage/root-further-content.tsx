"use client";

import Image from "next/image";
import { type CSSProperties } from "react";
import { useTranslations } from "next-intl";

// Body paragraphs — Montserrat 700, 24px, line-height 32, justified, white
// (frame nodes 3204:10156 / 3204:10162).
const bodyStyle: CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontWeight: 700,
  fontSize: "24px",
  lineHeight: "32px",
  color: "#FFFFFF",
  textAlign: "justify",
  margin: 0,
};

export default function RootFurtherContent() {
  const t = useTranslations("rootFurther");

  return (
    <section
      style={{
        width: "100%",
        backgroundColor: "#00101A",
        padding: "120px 0",
      }}
    >
      <div
        style={{
          maxWidth: "1152px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "32px",
        }}
      >
        {/* ROOT / FURTHER lettering — stacked vertically, centered (Group 434:
            ROOT 189×67 on top, FURTHER 290×67 below, same center, no gap). */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Image
            src="/saa/root-text.png"
            alt="ROOT"
            width={189}
            height={67}
            style={{ maxWidth: "100%", height: "auto" }}
          />
          <Image
            src="/saa/further-text.png"
            alt="FURTHER"
            width={290}
            height={67}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>

        {/* Body content (gap 32 between blocks, per frame node spacing) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            width: "100%",
          }}
        >
          {/* Intro — 3 paragraphs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={bodyStyle}>{t("intro1")}</p>
            <p style={bodyStyle}>{t("intro2")}</p>
            <p style={bodyStyle}>{t("intro3")}</p>
          </div>

          {/* Quote — centered, 20px, white (node 3204:10161) */}
          <p
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 700,
              fontSize: "20px",
              lineHeight: "32px",
              color: "#FFFFFF",
              textAlign: "center",
              margin: 0,
            }}
          >
            {t("quote")}
            <br />
            {t("quoteAttrib")}
          </p>

          {/* Outro — 2 paragraphs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={bodyStyle}>{t("outro1")}</p>
            <p style={bodyStyle}>{t("outro2")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
