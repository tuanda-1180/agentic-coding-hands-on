"use client";

import Image from "next/image";
import { awardHref } from "@/app/lib/awards/award-href";

export interface AwardCardProps {
  title: string;
  description: string;
  nameImage: string; // e.g. "/saa/name-top-talent.png"
  /** Award slug used for hash navigation. Missing slug → /awards (no hash). */
  slug?: string;
  /** Translated label for the detail link. Defaults to "Chi tiết". */
  detailLabel?: string;
}

export default function AwardCard({
  title,
  description,
  nameImage,
  slug,
  detailLabel = "Chi tiết",
}: AwardCardProps) {
  return (
    <article
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {/* Picture */}
      <a
        href={awardHref(slug)}
        style={{
          display: "block",
          width: "100%",
          aspectRatio: "1 / 1",
          position: "relative",
          borderRadius: "24px",
          border: "0.955px solid #FFEA9E",
          boxShadow: "0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287",
          overflow: "hidden",
          flexShrink: 0,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.transform = "translateY(-4px)";
          el.style.boxShadow =
            "0 8px 16px rgba(0,0,0,0.4), 0 0 16px #FAE287";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.transform = "translateY(0)";
          el.style.boxShadow =
            "0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287";
        }}
      >
        {/* Award ring background */}
        <Image
          src="/saa/award-bg.png"
          alt=""
          aria-hidden={true}
          fill
          style={{ objectFit: "cover", mixBlendMode: "screen" }}
        />
        {/* Award name overlay — centered */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <Image
            src={nameImage}
            alt={title}
            width={240}
            height={80}
            style={{ objectFit: "contain" }}
          />
        </div>
      </a>

      {/* Card text frame */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 400,
            fontSize: "24px",
            lineHeight: 1.3,
            color: "#FFEA9E",
            margin: 0,
          }}
        >
          {title}
        </h3>

        {/* Description — max 2 lines with ellipsis */}
        <p
          style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "24px",
            letterSpacing: "0.5px",
            color: "#FFFFFF",
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </p>

        {/* Detail link */}
        <a
          href={awardHref(slug)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontFamily: "var(--font-montserrat)",
            fontWeight: 500,
            fontSize: "16px",
            color: "#FFFFFF",
            textDecoration: "none",
            marginTop: "4px",
          }}
        >
          {detailLabel}
          <Image
            src="/saa/arrow-up.svg"
            alt=""
            aria-hidden={true}
            width={16}
            height={16}
          />
        </a>
      </div>
    </article>
  );
}
