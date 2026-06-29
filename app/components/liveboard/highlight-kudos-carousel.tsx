"use client";

import { useEffect, useState } from "react";
import type { KudosPost } from "@/app/lib/liveboard/types";
import HighlightKudosCard from "./highlight-kudos-card";
import { GOLD, DARK, MUTED as GRAY } from "./theme";

export interface HighlightKudosCarouselProps {
  items: KudosPost[];
  onCopyLink: (id: string) => void;
  onViewDetail: (id: string) => void;
  onHashtagClick: (tag: string) => void;
  onToggleLike?: (id: string) => void;
}

export default function HighlightKudosCarousel({
  items,
  onCopyLink,
  onViewDetail,
  onHashtagClick,
  onToggleLike,
}: HighlightKudosCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset to the first slide whenever the item set changes (e.g. filter applied),
  // so we never index past the end of a smaller list.
  useEffect(() => {
    setCurrentIndex(0);
  }, [items]);

  const n = items.length;
  const prevIndex = (currentIndex - 1 + n) % n;
  const nextIndex = (currentIndex + 1) % n;

  const handlePrev = () => setCurrentIndex((i) => (i - 1 + n) % n);
  const handleNext = () => setCurrentIndex((i) => (i + 1) % n);

  const cardProps = { onCopyLink, onViewDetail, onHashtagClick, onToggleLike };

  // Round side nav button (design B.2.1/B.2.2 — 80×80, chevron icon).
  const SideNav = ({ side, onClick }: { side: "left" | "right"; onClick: () => void }) => (
    <button
      onClick={onClick}
      aria-label={side === "left" ? "Previous" : "Next"}
      style={{
        position: "absolute", top: "50%", transform: "translateY(-50%)", zIndex: 3,
        [side]: "16px", width: 80, height: 80, padding: 10, borderRadius: 4,
        background: "transparent", border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
      } as React.CSSProperties}
    >
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={side === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
      </svg>
    </button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
      {/* Cards row with gradient overlays + side nav */}
      <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
        {/* Left gradient overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: "400px", zIndex: 2,
            background: `linear-gradient(90deg, ${DARK} 50%, transparent 100%)`,
            pointerEvents: "none",
          }}
        />
        {/* Right gradient overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: "400px", zIndex: 2,
            background: `linear-gradient(270deg, ${DARK} 50%, transparent 100%)`,
            pointerEvents: "none",
          }}
        />

        {/* Cards inner row — prev / centre / next (looped) so the centre card
            is always horizontally centred. */}
        <div style={{ display: "flex", gap: "24px", alignItems: "center", justifyContent: "center" }}>
          {n > 1 && (
            <HighlightKudosCard key={`left-${items[prevIndex].id}`} kudos={items[prevIndex]} isCenter={false} {...cardProps} />
          )}
          <HighlightKudosCard key={`center-${items[currentIndex].id}`} kudos={items[currentIndex]} isCenter {...cardProps} />
          {n > 1 && (
            <HighlightKudosCard key={`right-${items[nextIndex].id}`} kudos={items[nextIndex]} isCenter={false} {...cardProps} />
          )}
        </div>

        {/* Side next/prev buttons */}
        {n > 1 && (
          <>
            <SideNav side="left" onClick={handlePrev} />
            <SideNav side="right" onClick={handleNext} />
          </>
        )}
      </div>

      {/* Pagination row */}
      <div style={{
        display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center",
        gap: "32px", height: "52px", padding: "0 144px",
      }}>
        {/* Prev button */}
        <button
          onClick={handlePrev}
          aria-label="Previous"
          style={{
            width: 48, height: 48, padding: 10, borderRadius: 4,
            background: "transparent", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Counter */}
        <span style={{ fontFamily: "var(--font-montserrat)" }}>
          <span style={{ fontSize: "28px", fontWeight: 700, color: GOLD }}>{currentIndex + 1}</span>
          <span style={{ fontSize: "24px", fontWeight: 700, color: GRAY }}>/{items.length}</span>
        </span>

        {/* Next button */}
        <button
          onClick={handleNext}
          aria-label="Next"
          style={{
            width: 48, height: 48, padding: 10, borderRadius: 4,
            background: "transparent", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
