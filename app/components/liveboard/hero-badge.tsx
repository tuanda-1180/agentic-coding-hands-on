"use client";

import { useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { GOLD, PANEL_BG } from "./theme";

// Navy overlay (#092432) over the "Root further" keyvisual, per hero tier.
// Lower-ranked tiers are darkened (0.50); Legend Hero shows the full-bright art (0).
const OVERLAY_BY_TIER: Record<string, number> = {
  "New Hero": 0.5,
  "Rising Hero": 0.5,
  "Super Hero": 0.5,
  "Legend Hero": 0,
};

// Tooltip copy per tier (design "Hover danh hiệu …"), resolved from i18n with
// literal keys (keeps next-intl key typing happy).
function tierInfo(label: string, t: ReturnType<typeof useTranslations>): { title: string; body: string } | null {
  switch (label) {
    case "New Hero": return { title: t("heroNewTitle"), body: t("heroNewBody") };
    case "Rising Hero": return { title: t("heroRisingTitle"), body: t("heroRisingBody") };
    case "Super Hero": return { title: t("heroSuperTitle"), body: t("heroSuperBody") };
    case "Legend Hero": return { title: t("heroLegendTitle"), body: t("heroLegendBody") };
    default: return null;
  }
}

/** The badge pill itself (no hover behaviour). `big` is the tooltip-sized variant. */
function Pill({ label, big = false }: { label: string; big?: boolean }) {
  const overlay = OVERLAY_BY_TIER[label] ?? 0.5;
  const style: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: big ? "32px" : "19px",
    padding: big ? "0 16px" : "0 10px",
    borderRadius: "48px",
    border: `0.5px solid ${GOLD}`,
    overflow: "hidden",
    backgroundImage: `linear-gradient(0deg, rgba(9,36,50,${overlay}), rgba(9,36,50,${overlay})), url('/saa/keyvisual-bg.png')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "#FFFFFF",
    fontFamily: "var(--font-montserrat)",
    fontSize: big ? "16px" : "11.4px",
    fontWeight: 700,
    lineHeight: 1,
    whiteSpace: "nowrap",
    textShadow: "0 1px 2px rgba(0,0,0,0.4)",
  };
  return <span style={style}>{label}</span>;
}

/**
 * Hero-tier badge ("danh hiệu") with a hover tooltip explaining the tier
 * (design "Hover danh hiệu …"). The tooltip is portalled to <body> so it is not
 * clipped by the card's overflow:hidden. Shared by every kudos card.
 */
export default function HeroBadge({ label }: { label: string }) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const t = useTranslations("liveboard");
  const info = tierInfo(label, t);

  return (
    <span
      style={{ display: "inline-flex" }}
      onMouseEnter={(e) => setRect(e.currentTarget.getBoundingClientRect())}
      onMouseLeave={() => setRect(null)}
    >
      <Pill label={label} />
      {rect && info && typeof document !== "undefined" &&
        createPortal(
          <div
            role="tooltip"
            style={{
              position: "fixed",
              top: rect.bottom + 8,
              left: rect.left + rect.width / 2,
              transform: "translateX(-50%)",
              zIndex: 9999,
              width: "304px",
              maxWidth: "min(304px, 90vw)",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "11px",
              padding: "16px",
              borderRadius: "16px",
              background: PANEL_BG,
              border: "1px solid #2E3940",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              pointerEvents: "none",
            }}
          >
            <Pill label={label} big />
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "14px", fontWeight: 700, lineHeight: "20px", letterSpacing: "0.1px", color: "#FFFFFF" }}>
                {info.title}
              </span>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "14px", fontWeight: 700, lineHeight: "20px", letterSpacing: "0.1px", color: "#999" }}>
                {info.body}
              </span>
            </div>
          </div>,
          document.body
        )}
    </span>
  );
}
