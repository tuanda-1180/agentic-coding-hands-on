"use client";

import { useState, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import type { Stats } from "@/app/lib/liveboard/types";
import { GOLD, DARK, PANEL_BG, BORDER, SEPARATOR, FIRE } from "./theme";

export interface StatsPanelProps {
  stats: Stats;
  onOpenGift: () => void;
}

const panelBase: CSSProperties = {
  background: PANEL_BG,
  border: `1px solid ${BORDER}`,
  borderRadius: "17px",
  fontFamily: "var(--font-montserrat)",
};

function StatRow({ label, value, extra }: { label: string; value: number; extra?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "22px", fontWeight: 700, color: "#FFFFFF" }}>{label}</span>
        {extra}
      </div>
      <span style={{ fontSize: "32px", fontWeight: 700, color: GOLD, flexShrink: 0 }}>{value}</span>
    </div>
  );
}

/** Fire-x2 badge that reveals the "x2 hearts day" campaign tooltip on hover. */
function FireX2Badge() {
  const [hover, setHover] = useState(false);
  const t = useTranslations("liveboard");
  return (
    <span
      style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <FireX2Icon />
      {hover && (
        <div
          role="tooltip"
          style={{
            position: "absolute", top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
            zIndex: 100, width: "368px", maxWidth: "min(368px, 80vw)", boxSizing: "border-box",
            display: "flex", flexDirection: "row", alignItems: "center", gap: "11px",
            padding: "16px", borderRadius: "16px", background: PANEL_BG,
            border: `1px solid ${SEPARATOR}`, boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          }}
        >
          <FireX2Icon />
          <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, lineHeight: "20px", letterSpacing: "0.1px", color: "#999" }}>
            <span style={{ color: "#FFFFFF" }}>{t("campaignTitle")}</span> {t("campaignBody")}
          </p>
        </div>
      )}
    </span>
  );
}

// "x2" hearts badge: flame icon with a white, black-outlined "x2" overlaid.
function FireX2Icon() {
  return (
    <span style={{ position: "relative", width: "34px", height: "40px", flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="34" height="40" viewBox="0 0 24 24" fill={FIRE} aria-hidden="true" style={{ position: "absolute", inset: 0 }}>
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
      <span style={{ position: "relative", color: "#FFFFFF", fontSize: "13px", fontWeight: 700, fontFamily: "var(--font-montserrat)", lineHeight: 1, WebkitTextStroke: "0.8px #000" }}>x2</span>
    </span>
  );
}

function GiftIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M5 12v9h14v-9" />
      <path d="M12 8v13" />
      <path d="M12 8S10.5 3 7.5 4 9 8 12 8zM12 8s1.5-5 4.5-4S15 8 12 8z" />
    </svg>
  );
}

/** "Chỉ số thống kê" — overview stats card + Open Secret Box CTA. */
export default function StatsPanel({ stats, onOpenGift }: StatsPanelProps) {
  const t = useTranslations("liveboard");
  return (
    <div style={{ ...panelBase, padding: "24px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <StatRow label={t("kudosReceived")} value={stats.kudosReceived} />
        <StatRow label={t("kudosSent")} value={stats.kudosSent} />
        <StatRow label={t("heartsReceived")} value={stats.heartsReceived} extra={<FireX2Badge />} />
        <div style={{ height: "1px", background: SEPARATOR }} />
        <StatRow label={t("secretBoxOpened")} value={stats.secretBoxOpened} />
        <StatRow label={t("secretBoxUnopened")} value={stats.secretBoxUnopened} />
      </div>

      <button
        type="button"
        onClick={onOpenGift}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          width: "100%", height: "60px", marginTop: "20px",
          background: GOLD, borderRadius: "8px", border: "none",
          fontSize: "22px", fontWeight: 700, color: DARK,
          cursor: "pointer", fontFamily: "var(--font-montserrat)",
        }}
      >
        {t("openGift")}
        <GiftIcon />
      </button>
    </div>
  );
}
