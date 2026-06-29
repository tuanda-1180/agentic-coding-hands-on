"use client";

import { type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { GOLD, SEPARATOR } from "@/app/components/liveboard/theme";
import ReceivedSentFilter from "./received-sent-filter";
import type { KudosDirection } from "@/app/lib/liveboard/types";

export interface AwardsFeedHeaderProps {
  filter: KudosDirection;
  counts: { received: number; sent: number };
  onFilterChange: (v: KudosDirection) => void;
}

const wrapperStyle: CSSProperties = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const titleStyle: CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontWeight: 700,
  fontSize: "24px",
  lineHeight: "32px",
  color: "#FFFFFF",
};

const separatorStyle: CSSProperties = {
  width: "100%",
  height: "1px",
  background: SEPARATOR,
};

const bottomRowStyle: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "32px",
};

const kudosTitleStyle: CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontWeight: 700,
  fontSize: "57px",
  lineHeight: "64px",
  letterSpacing: "-0.25px",
  color: GOLD,
};

/**
 * mms_C_Header Giải thưởng — Awards section header.
 * Shows the awards subtitle, separator, "KUDOS" title, and the received/sent
 * filter dropdown wired to the profile feed.
 */
export default function AwardsFeedHeader({
  filter,
  counts,
  onFilterChange,
}: AwardsFeedHeaderProps) {
  const t = useTranslations("profile");
  return (
    <div style={wrapperStyle}>
      {/* mms_C.1_title */}
      <span style={titleStyle}>{t("awardsTitle")}</span>

      {/* Separator line */}
      <div style={separatorStyle} />

      {/* Bottom row: KUDOS + filter */}
      <div style={bottomRowStyle}>
        {/* mms_C.2_KUDOS title */}
        <span style={kudosTitleStyle} className="profile-kudos-title">
          {t("kudosTitle")}
        </span>

        {/* mms_C.3_Button — received/sent filter dropdown */}
        <ReceivedSentFilter value={filter} counts={counts} onChange={onFilterChange} />
      </div>
    </div>
  );
}
