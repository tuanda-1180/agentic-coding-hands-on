"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function KudosSection() {
  const t = useTranslations("kudos");

  return (
    <section
      style={{
        width: "100%",
        backgroundColor: "#00101A",
        padding: "40px 0 80px",
      }}
    >
      <div
        style={{
          maxWidth: "1224px",
          margin: "0 auto",
          padding: "0 16px",
        }}
      >
        {/* Card block */}
        <div
          style={{
            width: "100%",
            maxWidth: "1120px",
            minHeight: "500px",
            borderRadius: "16px",
            backgroundColor: "#0F0F0F",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "stretch",
          }}
        >
          {/* Background image (art on right) */}
          <Image
            src="/saa/kudos-bg.png"
            alt=""
            aria-hidden={true}
            fill
            style={{ objectFit: "cover", objectPosition: "center right" }}
          />

          {/* Left content */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              width: "540px",
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
              {t("label")}
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
                lineHeight: 1.6,
                letterSpacing: "0.5px",
                color: "#FFFFFF",
                margin: 0,
                whiteSpace: "pre-line",
              }}
            >
              {t("description")}
            </p>

            {/* CTA button — reuse the shared .cta-button (arrow recolors via
                currentColor, hover handled in globals.css); kept at 16px. */}
            <Link
              href="/kudos"
              className="cta-button cta-button--primary"
              style={{ alignSelf: "flex-start", fontSize: "16px", lineHeight: "24px" }}
            >
              {t("detail")}
              <span className="cta-button__icon" aria-hidden="true" />
            </Link>
          </div>

          {/* Right: KUDOS lockup — positioned over art */}
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
              width={364}
              height={72}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
