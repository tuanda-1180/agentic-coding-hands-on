"use client";

import { useTranslations } from "next-intl";
import { RED } from "./theme";

export interface HeartButtonProps {
  count: number;
  /** Whether the current user likes this — lights the icon. Controlled by the parent. */
  liked?: boolean;
  onToggle?: () => void;
  /** Heart icon size in px (highlight card 32, feed card 18). */
  iconSize?: number;
  /** Count font size in px. */
  fontSize?: number;
  fontWeight?: number;
  /** Colour when not liked (e.g. dark on highlight, muted on feed). */
  restColor?: string;
  /** Render the icon before the count (feed) vs count before icon (highlight). */
  iconFirst?: boolean;
}

/**
 * Like button — fully controlled: `count` and `liked` come from props, and the
 * parent (useLiveboardData) owns the optimistic update + server reconcile.
 * Shared by all kudos cards.
 */
export default function HeartButton({
  count,
  liked = false,
  onToggle,
  iconSize = 24,
  fontSize = 16,
  fontWeight = 700,
  restColor = "#00101A",
  iconFirst = false,
}: HeartButtonProps) {
  const t = useTranslations("liveboard");
  const color = liked ? RED : restColor;

  const icon = (
    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill={liked ? RED : "none"} stroke={color} strokeWidth="2" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
  const label = <span>{count.toLocaleString()}</span>;

  return (
    <button
      type="button"
      onClick={() => onToggle?.()}
      aria-label={t("heartButton")}
      style={{
        display: "flex", alignItems: "center", gap: "4px",
        background: "none", border: "none", cursor: "pointer", padding: 0,
        fontFamily: "var(--font-montserrat)", fontSize: `${fontSize}px`, fontWeight, color,
      }}
    >
      {iconFirst ? <>{icon}{label}</> : <>{label}{icon}</>}
    </button>
  );
}
