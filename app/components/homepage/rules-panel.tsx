"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import RulesHeroTier from "./rules-hero-tier";
import RulesCollectibleIcon from "./rules-collectible-icon";
import { useDialog } from "@/app/components/ui/use-dialog";

// Design tokens (Figma screen b1Filzi9i6)
const INK = "#00101A";
const YELLOW = "#FFEA9E";
const BORDER_GOLD = "#998C5F";

// Hero tiers + collectibles: maps the static asset path (not translatable) to its
// i18n key. Text comes from useTranslations("rules"); badges/icons stay as paths.
// `accentColor` / `gradient` drive the CSS fallback so it matches the design's
// per-tier colours until the real exported PNGs land in public/saa/.
const HERO_TIERS = [
  { key: "new", src: "/saa/hero-new.png", accentColor: "#C8D2D8" },
  { key: "rising", src: "/saa/hero-rising.png", accentColor: "#5BD96A" },
  { key: "super", src: "/saa/hero-super.png", accentColor: "#FF5A4D" },
  { key: "legend", src: "/saa/hero-legend.png", accentColor: "#FFC94D" },
] as const;

const COLLECTIBLES = [
  {
    key: "revival",
    src: "/saa/icon-revival.png",
    gradient: "radial-gradient(circle at 50% 35%, #2E6E6A 0%, #123A3A 70%, #0B2424 100%)",
  },
  {
    key: "touchOfLight",
    src: "/saa/icon-touch-of-light.png",
    gradient: "linear-gradient(135deg, #F7C5D9 0%, #C9B6F0 50%, #9FC4F5 100%)",
  },
  {
    key: "stayGold",
    src: "/saa/icon-stay-gold.png",
    gradient: "radial-gradient(circle at 50% 35%, #FFB347 0%, #FF7A3D 60%, #E85C2B 100%)",
  },
  {
    key: "flowToHorizon",
    src: "/saa/icon-flow-to-horizon.png",
    gradient: "linear-gradient(180deg, #3A7BD5 0%, #34C4D9 60%, #1B3A4F 100%)",
  },
  {
    key: "beyondTheBoundary",
    src: "/saa/icon-beyond-the-boundary.png",
    gradient: "radial-gradient(circle at 50% 35%, #FF5A4D 0%, #C42218 70%, #6E0F0A 100%)",
  },
  {
    key: "rootFurther",
    src: "/saa/icon-root-further.png",
    gradient: "radial-gradient(circle at 50% 35%, #4A3B2E 0%, #2A2018 65%, #14100B 100%)",
  },
] as const;

export interface RulesPanelProps {
  /** Controls panel visibility — parent owns state. */
  open: boolean;
  /** Called by the Đóng button, Esc, and backdrop click. */
  onClose: () => void;
  /** Called by the Viết KUDOS button. */
  onWriteKudos: () => void;
}

// Shared paragraph style used throughout the panel body.
const bodyText: React.CSSProperties = {
  margin: 0,
  color: "#FFFFFF",
  fontFamily: "var(--font-montserrat)",
  fontWeight: 700,
  fontSize: "16px",
  lineHeight: "24px",
  letterSpacing: "0.5px",
  textAlign: "justify",
};

// Shared section heading style (yellow, uppercase).
const sectionHeading: React.CSSProperties = {
  margin: 0,
  color: YELLOW,
  fontFamily: "var(--font-montserrat)",
  fontWeight: 700,
  fontSize: "22px",
  lineHeight: "28px",
};

export default function RulesPanel({ open, onClose, onWriteKudos }: RulesPanelProps) {
  // Hooks MUST run before the early return below (React rules of hooks). Do not
  // move the `if (!open)` above these calls.
  const t = useTranslations("rules");
  const { dialogRef, backdropProps } = useDialog(open, onClose);

  if (!open) return null;

  return (
    <div
      {...backdropProps}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rules-panel-title"
      tabIndex={-1}
      style={{
        position: "relative",
        height: "100%",
        width: "min(520px, 100vw)",
        backgroundColor: INK,
        display: "flex",
        flexDirection: "column",
        boxShadow: "-4px 0 32px rgba(0,0,0,0.6)",
        outline: "none",
      }}
    >
      {/* ── Scrollable content ────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "24px 24px 0",
        }}
      >
        {/* Title */}
        <h2
          id="rules-panel-title"
          style={{
            margin: "0 0 24px",
            color: YELLOW,
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "45px",
            lineHeight: "52px",
          }}
        >
          {t("title")}
        </h2>

        {/* Section 1 — Người nhận Kudos */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3 style={sectionHeading}>{t("receiverHeading")}</h3>
          <p style={bodyText}>{t("receiverIntro")}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {HERO_TIERS.map((tier) => (
              <RulesHeroTier
                key={tier.key}
                badgeSrc={tier.src}
                badgeAlt={t(`tiers.${tier.key}.label`)}
                accentColor={tier.accentColor}
                kudosLine={t(`tiers.${tier.key}.count`)}
                description={t(`tiers.${tier.key}.desc`)}
              />
            ))}
          </div>
        </div>

        {/* Section 2 — Người gửi Kudos / collectibles */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          <h3 style={sectionHeading}>{t("senderHeading")}</h3>
          <p style={bodyText}>{t("senderIntro")}</p>

          {/* 3×2 grid — space-between per Figma Frame 511/513 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 80px)",
              columnGap: "16px",
              rowGap: "24px",
              justifyContent: "space-between",
              padding: "0 24px",
            }}
          >
            {COLLECTIBLES.map((icon) => (
              <RulesCollectibleIcon
                key={icon.key}
                src={icon.src}
                label={t(`icons.${icon.key}`)}
                gradient={icon.gradient}
              />
            ))}
          </div>

          <p style={bodyText}>{t("senderOutro")}</p>
        </div>

        {/* Section 3 — Kudos Quốc Dân */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginTop: "16px",
            paddingBottom: "24px",
          }}
        >
          <h3
            style={{
              ...sectionHeading,
              fontSize: "24px",
              lineHeight: "32px",
            }}
          >
            {t("nationalHeading")}
          </h3>
          <p style={bodyText}>{t("nationalBody")}</p>
        </div>
      </div>

      {/* ── Footer (pinned) ───────────────────────────────────────────── */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          flexDirection: "row",
          gap: "16px",
          padding: "16px 24px",
          borderTop: `1px solid ${BORDER_GOLD}`,
          backgroundColor: INK,
        }}
      >
        {/* Đóng — outlined secondary */}
        <button
          type="button"
          onClick={onClose}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "16px",
            border: `1px solid ${BORDER_GOLD}`,
            borderRadius: "4px",
            background: "rgba(255,234,158,0.10)",
            color: "#FFFFFF",
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "16px",
            lineHeight: "24px",
            letterSpacing: "0.5px",
            cursor: "pointer",
            flexShrink: 0,
            transition: "background 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(255,234,158,0.18)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(255,234,158,0.10)";
          }}
        >
          <Image src="/saa/icon-close.svg" alt="" aria-hidden={true} width={24} height={24} />
          {t("close")}
        </button>

        {/* Viết KUDOS — primary yellow */}
        <button
          type="button"
          onClick={onWriteKudos}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "16px",
            border: "none",
            borderRadius: "4px",
            background: YELLOW,
            color: INK,
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "16px",
            lineHeight: "24px",
            letterSpacing: "0.5px",
            cursor: "pointer",
            flex: 1,
            transition: "filter 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.filter = "none";
          }}
        >
          <Image src="/saa/fab-pen.svg" alt="" aria-hidden={true} width={24} height={24} />
          {t("writeKudos")}
        </button>
      </div>
    </div>
    </div>
  );
}
