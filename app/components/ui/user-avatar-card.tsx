"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { GOLD, DARK, PANEL_BG, MUTED, BORDER, SEPARATOR } from "@/app/components/liveboard/theme";
import { BadgePill } from "@/app/components/liveboard/hero-badge";

export interface UserAvatarInfo {
  /** Sunner id — when present, the card lazy-loads kudos received/sent counts. */
  id?: string;
  name: string;
  /** Department / đơn vị, e.g. "CEVC10". */
  team?: string;
  /** Hero tier label, e.g. "Legend Hero". */
  badgeLabel?: string;
}

interface Counts {
  received: number;
  sent: number;
}

// Cache counts per user id so re-hovering doesn't refetch; entries expire after
// TTL_MS so live kudos changes are eventually reflected within a session.
const TTL_MS = 60_000;
const countsCache = new Map<string, { value: Counts; ts: number }>();

function readCache(id?: string): Counts | null {
  if (!id) return null;
  const hit = countsCache.get(id);
  if (!hit) return null;
  if (Date.now() - hit.ts > TTL_MS) {
    countsCache.delete(id);
    return null;
  }
  return hit.value;
}

const CARD_WIDTH = 320;

const sendBtnStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  width: "100%",
  height: "48px",
  borderRadius: "8px",
  background: GOLD,
  color: DARK,
  textDecoration: "none",
  fontFamily: "var(--font-montserrat)",
  fontWeight: 700,
  fontSize: "16px",
};

// Secondary CTA: outlined link to the user's public profile ("Profile người khác").
const viewProfileBtnStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "44px",
  borderRadius: "8px",
  background: "transparent",
  color: GOLD,
  border: `1px solid ${BORDER}`,
  textDecoration: "none",
  fontFamily: "var(--font-montserrat)",
  fontWeight: 700,
  fontSize: "15px",
};

function PencilIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    </svg>
  );
}

function StatLine({ label, value }: { label: string; value?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{ fontSize: "16px", fontWeight: 700, color: "#FFFFFF" }}>{label}</span>
      <span style={{ fontSize: "16px", fontWeight: 700, color: GOLD }}>
        {value === undefined ? "…" : value}
      </span>
    </div>
  );
}

interface UserAvatarCardProps {
  info: UserAvatarInfo;
  rect: DOMRect;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

/**
 * Hover info card for a user avatar (design "Infor - HoverAvatar"): name, unit,
 * hero badge, kudos received/sent counts, and a "Gửi KUDO" CTA. Portalled to
 * <body> so it is not clipped by a card's overflow:hidden. Counts are lazy-loaded
 * from /api/users/[id]/summary and cached per id.
 */
export default function UserAvatarCard({ info, rect, onMouseEnter, onMouseLeave }: UserAvatarCardProps) {
  const t = useTranslations("liveboard");
  const [counts, setCounts] = useState<Counts | null>(() => readCache(info.id));

  useEffect(() => {
    if (!info.id) return;
    const id = info.id;
    // Fresh cache is already reflected via the useState initializer.
    if (readCache(id)) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/users/${id}/summary`);
        if (!res.ok) return;
        const data: Counts = await res.json();
        if (cancelled) return;
        countsCache.set(id, { value: data, ts: Date.now() });
        setCounts(data);
      } catch {
        /* leave counts as "…" on error */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [info.id]);

  if (typeof document === "undefined") return null;

  // Keep the card within the viewport horizontally.
  const half = CARD_WIDTH / 2;
  const centerX = rect.left + rect.width / 2;
  const clampedX = Math.min(Math.max(centerX, half + 8), window.innerWidth - half - 8);

  return createPortal(
    <div
      role="tooltip"
      aria-label={info.name}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "fixed",
        top: rect.bottom + 8,
        left: clampedX,
        transform: "translateX(-50%)",
        zIndex: 9999,
        width: `${CARD_WIDTH}px`,
        maxWidth: "92vw",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "20px",
        borderRadius: "16px",
        background: PANEL_BG,
        border: `1px solid ${BORDER}`,
        boxShadow: "0 8px 28px rgba(0,0,0,0.55)",
        fontFamily: "var(--font-montserrat)",
      }}
    >
      <span style={{ fontSize: "22px", fontWeight: 700, color: GOLD, lineHeight: "28px" }}>
        {info.name}
      </span>
      {info.team && (
        <span style={{ fontSize: "14px", fontWeight: 500, color: MUTED, lineHeight: "20px" }}>
          {t("avatarUnitLabel")} {info.team}
        </span>
      )}
      {info.badgeLabel && (
        <div>
          <BadgePill label={info.badgeLabel} big />
        </div>
      )}
      <div style={{ height: "1px", background: SEPARATOR }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <StatLine label={t("avatarReceived")} value={counts?.received} />
        <StatLine label={t("avatarSent")} value={counts?.sent} />
      </div>
      <Link href="/kudos" style={sendBtnStyle}>
        <PencilIcon />
        {t("avatarSendKudo")}
      </Link>
      {info.id && (
        <Link href={`/profile/${info.id}`} style={viewProfileBtnStyle}>
          {t("avatarViewProfile")}
        </Link>
      )}
    </div>,
    document.body
  );
}
