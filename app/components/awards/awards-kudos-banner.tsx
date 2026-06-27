"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface AwardsKudosBannerProps {
  /** CTA button href. Defaults to "/kudos". */
  href?: string;
}

/**
 * Sun* Kudos promo banner at the bottom of the awards page.
 * Background: kudos-bg.png (dark card with artwork).
 * Left side: label, gold title, description paragraph, "Chi tiết" CTA.
 * Right side: KUDOS logo SVG.
 */
export default function AwardsKudosBanner({ href = "/kudos" }: AwardsKudosBannerProps) {
  const t = useTranslations("awardsPage.kudos");
  return (
    <div
      style={{
        width: "100%",
        minHeight: "500px",
        borderRadius: "16px",
        backgroundColor: "#0F0F0F",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "stretch",
      }}
    >
      {/* Background image */}
      <Image
        src="/saa/kudos-bg.png"
        alt=""
        aria-hidden={true}
        fill
        style={{ objectFit: "cover", objectPosition: "center right" }}
      />

      {/* Left content column */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "470px",
          maxWidth: "100%",
          padding: "64px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          justifyContent: "center",
        }}
      >
        {/* Label */}
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
          {t("eyebrow")}
        </p>

        {/* Title */}
        <h2
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
          {t("title")}
        </h2>

        {/* Description */}
        <p
          style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "16px",
            lineHeight: "24px",
            letterSpacing: "0.5px",
            color: "#FFFFFF",
            margin: 0,
            textAlign: "justify",
            whiteSpace: "pre-line",
          }}
        >
          {t("body")}
        </p>

        {/* CTA button */}
        <Link
          href={href}
          className="cta-button cta-button--primary"
          style={{
            alignSelf: "flex-start",
            fontSize: "16px",
            lineHeight: "24px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "16px",
            borderRadius: "4px",
            backgroundColor: "#FFEA9E",
            color: "#00101A",
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            letterSpacing: "0.15px",
            textDecoration: "none",
            transition: "opacity 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
          }}
        >
          {t("cta")}
        </Link>
      </div>

      {/* Right: KUDOS logo lockup */}
      <div
        style={{
          position: "absolute",
          right: "40px",
          bottom: "40px",
          zIndex: 2,
        }}
      >
        <Image
          src="/saa/kudos-logo.svg"
          alt="KUDOS"
          width={383}
          height={72}
        />
      </div>
    </div>
  );
}
