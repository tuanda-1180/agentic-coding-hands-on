"use client";

import Image from "next/image";
import { type CSSProperties } from "react";
import { useTranslations } from "next-intl";

interface LiveboardBannerProps {
  className?: string;
  onKudosClick?: () => void;
  onSearchClick?: () => void;
}

const eyebrowStyle: CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontWeight: 700,
  fontSize: "36px",
  color: "#FFEA9E",
  margin: 0,
};

const sectionStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  height: "512px",
  overflow: "hidden",
  backgroundColor: "#00101A",
  backgroundImage: "url('/saa/banner-bg.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "flex-start",
};

const overlayStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  zIndex: 1,
  background:
    "linear-gradient(25deg, #00101A 14.74%, rgba(0, 19, 32, 0.00) 47.8%)",
};

const contentStyle: CSSProperties = {
  position: "relative",
  zIndex: 2,
  width: "100%",
  paddingTop: "184px",
  paddingLeft: "144px",
  paddingRight: "144px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const pillsRowStyle: CSSProperties = {
  position: "absolute",
  bottom: "32px",
  left: 0,
  right: 0,
  zIndex: 2,
  padding: "0 144px",
  display: "flex",
  gap: "32px",
};

const pillBaseStyle: CSSProperties = {
  height: "72px",
  border: "1px solid #998C5F",
  borderRadius: "68px",
  backgroundColor: "rgba(255, 234, 158, 0.10)",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: "16px",
  padding: "0 24px",
  cursor: "pointer",
  fontFamily: "var(--font-montserrat)",
  fontWeight: 700,
  fontSize: "16px",
  color: "#FFFFFF",
  background: "rgba(255, 234, 158, 0.10)",
  outline: "none",
};

const leftPillStyle: CSSProperties = {
  ...pillBaseStyle,
  flex: "1 1 738px",
};

const rightPillStyle: CSSProperties = {
  ...pillBaseStyle,
  flex: "0 0 381px",
  width: "381px",
};

export default function LiveboardBanner({
  className,
  onKudosClick,
  onSearchClick,
}: LiveboardBannerProps) {
  const t = useTranslations("liveboard");

  return (
    <section style={sectionStyle} className={className} aria-label="Kudos Live Board">
      {/* Dark overlay for text readability */}
      <div style={overlayStyle} aria-hidden="true" />

      {/* Top content: eyebrow + KUDOS logo at y=184 */}
      <div style={contentStyle}>
        <p style={eyebrowStyle}>{t("systemTitle")}</p>
        <Image src="/saa/kudos-logo.svg" alt="KUDOS" width={593} height={104} priority />
      </div>

      {/* Pills row at bottom: absolute positioned 32px from bottom */}
      <div style={pillsRowStyle}>
        <button
          type="button"
          style={leftPillStyle}
          onClick={onKudosClick}
          aria-label={t("inputPlaceholder")}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
          </svg>
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {t("inputPlaceholder")}
          </span>
        </button>

        <button
          type="button"
          style={rightPillStyle}
          onClick={onSearchClick}
          aria-label={t("searchSunner")}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>{t("searchSunner")}</span>
        </button>
      </div>
    </section>
  );
}
