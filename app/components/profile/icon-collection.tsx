"use client";

import Image from "next/image";
import { type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { COLLECTIBLES } from "@/app/lib/collectibles";

export interface IconCollectionProps {
  /** Number of unlocked (lit) icon slots, counted from the start of the set. */
  unlocked: number;
  /** How many of the collectible icons to render (defaults to the full set of 6). */
  total?: number;
}

const containerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "16px",
  flexWrap: "wrap",
  justifyContent: "center",
};

function slotStyle(unlocked: boolean, gradient: string): CSSProperties {
  return {
    position: "relative",
    width: "64px",
    height: "64px",
    borderRadius: "100px",
    border: "2px solid #FFFFFF",
    overflow: "hidden",
    // Real artwork sits on top; the gradient (or gray) shows if the image fails.
    background: unlocked ? gradient : "#323231",
    flexShrink: 0,
  };
}

/**
 * "Bộ sưu tập icon của tôi" — the 6 collectible "danh hiệu" icons (shared with the
 * Thể lệ rules panel via `@/app/lib/collectibles`). Unlocked icons show in full
 * colour; locked ones are greyed out per the design.
 */
export default function IconCollection({
  unlocked,
  total = COLLECTIBLES.length,
}: IconCollectionProps) {
  const t = useTranslations("profile");
  const items = COLLECTIBLES.slice(0, total);

  return (
    <div style={containerStyle} className="profile-icon-row" role="list" aria-label={t("iconCollectionAria")}>
      {items.map((icon, i) => {
        const isUnlocked = i < unlocked;
        return (
          <div
            key={icon.key}
            role="listitem"
            style={slotStyle(isUnlocked, icon.gradient)}
            aria-label={isUnlocked ? t("iconUnlocked") : t("iconLocked")}
          >
            <Image
              src={icon.src}
              alt=""
              fill
              sizes="64px"
              style={{
                objectFit: "cover",
                filter: isUnlocked ? "none" : "grayscale(1) brightness(0.45)",
                opacity: isUnlocked ? 1 : 0.55,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
