"use client";

import { type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import HeroBadge from "@/app/components/liveboard/hero-badge";
import UserAvatar from "@/app/components/ui/user-avatar";
import IconCollection from "./icon-collection";

export interface ProfileUser {
  name: string;
  /** Department code shown next to the badge, e.g. "CEVC3". */
  department: string;
  /** Hero tier label, e.g. "Legend Hero". */
  badgeLabel: string;
  avatarUrl: string;
}

export interface ProfileHeaderProps {
  user: ProfileUser;
  iconCollection: {
    unlocked: number;
    total: number;
  };
}

// Design: mms_A_Info is an absolute-positioned FRAME with gap:32px, centered.
// Avatar: 200×200, white 4px border, circular. Sits at y=184 (top of mms_A frame).
// Name: 36px gold Montserrat 700.
// Detail row: "CEVC3 " text + dot separator + HeroBadge pill.
// Icon row: the slot row, with the "Bộ sưu tập icon của tôi" label BELOW it (per design).

const wrapperStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "32px",
  width: "100%",
  maxWidth: "680px",
  padding: "0 16px",
  boxSizing: "border-box",
};

const nameSectionStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
};

const nameStyle: CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontWeight: 700,
  fontSize: "36px",
  lineHeight: "44px",
  color: "#FFEA9E",
  textAlign: "center",
  letterSpacing: "0px",
};

const detailRowStyle: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "10px",
  justifyContent: "center",
};

const departmentStyle: CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontWeight: 700,
  fontSize: "22px",
  lineHeight: "28px",
  color: "#FFFFFF",
  letterSpacing: "0px",
};

const dotStyle: CSSProperties = {
  width: "4px",
  height: "4px",
  borderRadius: "50%",
  background: "#999999",
  opacity: 0.4,
  flexShrink: 0,
};

const collectionSectionStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "16px",
};

const collectionLabelStyle: CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontWeight: 700,
  fontSize: "22px",
  lineHeight: "28px",
  color: "#FFFFFF",
  letterSpacing: "0px",
};

/**
 * mms_A_Info — profile header section.
 *
 * Renders the large circular avatar, the user's name in gold,
 * department code + hero-tier badge, and the icon-collection row
 * with its label ("Bộ sưu tập icon của tôi").
 *
 * Overlap with the keyvisual banner is handled by the parent (ProfileScreen).
 */
export default function ProfileHeader({ user, iconCollection }: ProfileHeaderProps) {
  const t = useTranslations("profile");
  return (
    <div style={wrapperStyle}>
      {/* Large circular avatar — 200×200 per design */}
      <UserAvatar src={user.avatarUrl} alt={user.name} size={200} borderWidth={4} priority />

      {/* Name + department + badge */}
      <div style={nameSectionStyle}>
        <span style={nameStyle} className="profile-user-name">{user.name}</span>
        <div style={detailRowStyle}>
          <span style={departmentStyle}>{user.department}</span>
          <span aria-hidden="true" style={dotStyle} />
          <HeroBadge label={user.badgeLabel} />
        </div>
      </div>

      {/* Icon collection label + slots */}
      <div style={collectionSectionStyle}>
        <IconCollection
          unlocked={iconCollection.unlocked}
          total={iconCollection.total}
        />
        <span style={collectionLabelStyle}>{t("iconCollectionTitle")}</span>
      </div>
    </div>
  );
}
