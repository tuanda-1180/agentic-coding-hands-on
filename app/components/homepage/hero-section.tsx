"use client";

import Image from "next/image";
import Link from "next/link";
import { type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import HeroCountdownLive from "./hero-countdown-live";

// Event-info text styles (frame nodes 2167:9056 label / 2167:9057 value):
// label = white 16px; value = gold 24px. Both Montserrat 700.
const infoLabelStyle: CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontWeight: 700,
  fontSize: "16px",
  color: "#FFFFFF",
  letterSpacing: "0.15px",
};

const infoValueStyle: CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontWeight: 700,
  fontSize: "24px",
  color: "#FFEA9E",
};

export default function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section
      id="about"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "700px",
        overflow: "hidden",
        // Slide up under the 80px sticky header so the keyvisual is full-bleed
        // behind it (the header is a translucent overlay, per the design).
        marginTop: "-80px",
      }}
    >
      {/* Layer 1: keyvisual background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      >
        <Image
          src="/saa/keyvisual-bg.png"
          alt=""
          aria-hidden={true}
          fill
          style={{ objectFit: "cover", objectPosition: "center top" }}
          priority
        />
      </div>

      {/* Layer 2: dark left gradient overlay for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(90deg, rgba(0,16,26,0.92) 0%, rgba(0,16,26,0.7) 50%, rgba(0,16,26,0.1) 100%)",
        }}
        aria-hidden={true}
      />

      {/* Layer 2b: bottom fade so the tall keyvisual blends into the dark
          section below instead of ending in a hard cut line. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: "linear-gradient(180deg, transparent 68%, #00101A 100%)",
        }}
        aria-hidden={true}
      />

      {/* Layer 3: hero content */}
      <div
        className="hero-content"
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          // Left/right padding = 144px to match the header's `padding:12px 144px`,
          // so the hero column's left edge lines up with the SAA logo (x=144) at
          // every width (responsive padding handled in globals.css .hero-content).
          // top = 184px so ROOT FURTHER sits at the design Y (frame node 2167:9032);
          // the first 80px is covered by the overlaying header.
          padding: "184px 144px 80px",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
        }}
      >
        {/* ROOT FURTHER logo */}
        <Image
          src="/saa/root-further-logo.png"
          alt="ROOT FURTHER — Sun* Annual Awards 2025"
          width={451}
          height={200}
          priority
          style={{ maxWidth: "100%", height: "auto" }}
        />

        {/* Countdown block (live) */}
        <HeroCountdownLive />

        {/* Event info — time + venue on one row, each a tight label+value pair */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "60px",
              flexWrap: "wrap",
            }}
          >
            {/* Time pair */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={infoLabelStyle}>{t("time")}</span>
              <span style={infoValueStyle}>26/12/2025</span>
            </div>
            {/* Venue pair */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={infoLabelStyle}>{t("venue")}</span>
              <span style={infoValueStyle}>Âu Cơ Art Center</span>
            </div>
          </div>
          {/* Livestream note */}
          <p style={{ ...infoLabelStyle, letterSpacing: "0.5px", margin: 0 }}>
            {t("livestream")}
          </p>
        </div>

        {/* CTA buttons (reusable .cta-button — see globals.css) */}
        <div
          className="hero-cta"
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "40px",
            alignItems: "center",
          }}
        >
          <Link href="/awards" className="cta-button cta-button--primary">
            {t("aboutAwards")}
            <span className="cta-button__icon" aria-hidden="true" />
          </Link>

          <Link href="/kudos" className="cta-button cta-button--secondary">
            {t("aboutKudos")}
            <span className="cta-button__icon" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
