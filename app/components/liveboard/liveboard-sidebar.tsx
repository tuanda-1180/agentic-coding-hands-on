"use client";

import { type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import type { Stats, LeaderboardEntry } from "@/app/lib/liveboard/types";
import StatsPanel from "./stats-panel";
import UserAvatar from "@/app/components/ui/user-avatar";
import { GOLD, PANEL_BG, BORDER } from "./theme";

export interface LiveboardSidebarProps {
  stats: Stats;
  leaderboardGifts: LeaderboardEntry[];
  onOpenGift: () => void;
}

const panelBase: CSSProperties = {
  background: PANEL_BG,
  border: `1px solid ${BORDER}`,
  borderRadius: "17px",
  fontFamily: "var(--font-montserrat)",
};

function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <UserAvatar
        src={entry.sunner.avatarUrl}
        alt={entry.sunner.name}
        info={{ id: entry.sunner.id, name: entry.sunner.name, team: entry.sunner.team, badgeLabel: entry.sunner.badge?.label }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: 0 }}>
        <span style={{ fontSize: "16px", fontWeight: 700, color: "#FFFFFF", lineHeight: "1.3" }}>
          {entry.sunner.name}
        </span>
        {/* The gift/prize the sunner received (not the department). */}
        <span style={{ fontSize: "13px", color: GOLD }}>{entry.description ?? ""}</span>
      </div>
    </div>
  );
}

function LeaderboardPanel({ entries }: { entries: LeaderboardEntry[] }) {
  const t = useTranslations("liveboard");
  return (
    <div style={{ ...panelBase, padding: "24px 16px 24px 24px" }}>
      <p style={{
        fontSize: "22px", fontWeight: 700, color: GOLD,
        textAlign: "center", margin: "0 0 20px 0",
        lineHeight: "1.3",
      }}>
        {t("leaderboardGiftsTitle")}
      </p>
      {/* Show ~5 rows; the rest scroll. (5 × 64px avatar + 4 × 16px gap = 384px) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxHeight: "384px", overflowY: "auto", paddingRight: "8px" }}>
        {entries.map((entry) => (
          <LeaderboardRow key={entry.sunner.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}

export default function LiveboardSidebar({ stats, leaderboardGifts, onOpenGift }: LiveboardSidebarProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "422px", flexShrink: 0 }}>
      <StatsPanel stats={stats} onOpenGift={onOpenGift} />
      <LeaderboardPanel entries={leaderboardGifts} />
    </div>
  );
}
