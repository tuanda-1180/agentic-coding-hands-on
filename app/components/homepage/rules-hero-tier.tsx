"use client";

import Image from "next/image";
import { useState } from "react";

export interface HeroTierProps {
  /** Badge image path under public/ (e.g. "/saa/hero-new.png"). When the file
   *  exists it is shown; if missing the styled text-pill fallback is rendered. */
  badgeSrc: string;
  /** Visible tier name inside the pill, e.g. "New Hero" */
  badgeAlt: string;
  /** Accent colour for the tier name word (design: green/red/gold per tier). */
  accentColor: string;
  /** Kudos count range, e.g. "Có 1-4 người gửi Kudos cho bạn" */
  kudosLine: string;
  /** Description paragraph */
  description: string;
}

export default function RulesHeroTier({
  badgeSrc,
  badgeAlt,
  accentColor,
  kudosLine,
  description,
}: HeroTierProps) {
  const [imgError, setImgError] = useState(false);

  // Split "Rising Hero" → name "Rising" (accent-coloured) + "Hero" (light), as
  // the design renders the tier word in colour and "Hero" in a lighter tone.
  const words = badgeAlt.trim().split(" ");
  const heroWord = words.length > 1 ? words.pop() : undefined;
  const tierName = words.join(" ");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {/* Top row: badge pill + kudos line */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {/* Badge pill — 126×22px. The real artwork ships with its own gold pill
            border, so the container border/background only back the fallback. */}
        <div
          style={{
            position: "relative",
            width: "126px",
            height: "22px",
            borderRadius: "56px",
            border: imgError ? "0.579px solid #FFEA9E" : "none",
            overflow: "hidden",
            flexShrink: 0,
            background: imgError
              ? "linear-gradient(0deg, rgba(9,36,50,0.8) 0%, rgba(9,36,50,0.8) 100%)"
              : "transparent",
          }}
        >
          {!imgError ? (
            <Image
              src={badgeSrc}
              alt={badgeAlt}
              fill
              sizes="126px"
              style={{ objectFit: "cover" }}
              onError={() => setImgError(true)}
            />
          ) : (
            /* Text fallback that matches the design's pill content: a small medal
               dot in the tier accent colour, the tier name in that accent, and
               "Hero" in a lighter tone. */
            <span
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "12px",
                lineHeight: "18px",
                letterSpacing: "0.094px",
                textShadow: "0 0.5px 1.8px #000",
                whiteSpace: "nowrap",
              }}
            >
              <span
                aria-hidden={true}
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: accentColor,
                  boxShadow: `0 0 4px ${accentColor}`,
                }}
              />
              <span style={{ color: accentColor }}>{tierName}</span>
              {heroWord && <span style={{ color: "#FFFFFF" }}>{heroWord}</span>}
            </span>
          )}
        </div>

        {/* Kudos count line */}
        <span
          style={{
            color: "#FFFFFF",
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "16px",
            lineHeight: "24px",
            letterSpacing: "0.5px",
            flex: 1,
          }}
        >
          {kudosLine}
        </span>
      </div>

      {/* Description */}
      <p
        style={{
          margin: 0,
          color: "#FFFFFF",
          fontFamily: "var(--font-montserrat)",
          fontWeight: 700,
          fontSize: "14px",
          lineHeight: "20px",
          letterSpacing: "0.1px",
          textAlign: "justify",
        }}
      >
        {description}
      </p>
    </div>
  );
}
