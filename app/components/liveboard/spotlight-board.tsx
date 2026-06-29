"use client";

import { useState, useCallback, useEffect, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import type { SpotlightNode } from "@/app/lib/liveboard/types";
import SpotlightCanvas from "./spotlight-canvas";
import PlexusEffect from "./plexus-effect";
import { GOLD, BORDER } from "./theme";

interface SpotlightBoardProps {
  nodes: SpotlightNode[];
  totalKudos?: number;
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.5" stroke={BORDER} strokeWidth="1.5" />
      <line x1="12.5" y1="12.5" x2="16" y2="16" stroke={BORDER} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function SpotlightBoard({ nodes, totalKudos = 388 }: SpotlightBoardProps) {
  const t = useTranslations("liveboard");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(false);

  // Close the expanded (fullscreen) board on Escape.
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setExpanded(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  // Base artwork: dark + colour bleeding from the left (spotlight-bg-1). The
  // animated plexus + names are layered on top — see children below.
  const panelBg: CSSProperties = {
    border: `1px solid ${BORDER}`,
    borderRadius: "47px",
    overflow: "hidden",
    backgroundColor: "#00101A",
    backgroundImage: "url('/saa/spotlight-bg-1.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
  const panelStyle: CSSProperties = expanded
    ? { ...panelBg, position: "fixed", inset: "24px", zIndex: 1000 }
    : { ...panelBg, position: "relative", width: "100%", height: "548px" };

  const filteredNodes = search.trim()
    ? nodes.filter((n) => n.name.toLowerCase().includes(search.trim().toLowerCase()))
    : nodes;

  // Placeholder: selecting a name has no action yet.
  const handleNodeClick = useCallback((_node: SpotlightNode) => {}, []);

  return (
    <section style={{ backgroundColor: "#00101A", width: "100%", padding: "48px 0" }}>
      <div style={{ width: "100%", padding: "0 144px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Section header */}
        <div>
          <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "24px", color: "#FFFFFF", margin: "0 0 12px 0" }}>
            {t("sectionLabel")}
          </p>
          <div style={{ height: "1px", backgroundColor: "#2E3940", marginBottom: "16px" }} aria-hidden="true" />
          <h2 style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "57px", color: GOLD, margin: 0, lineHeight: 1, letterSpacing: "-0.02em" }}>
            {t("spotlightTitle")}
          </h2>
        </div>

        {/* Dimmed backdrop behind the fullscreen-expanded board */}
        {expanded && (
          <div
            aria-hidden="true"
            onClick={() => setExpanded(false)}
            style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.85)" }}
          />
        )}

        {/* Board panel: constellation bg + overlay controls + word-cloud */}
        <div style={panelStyle}>
          {/* Animated plexus network over the base artwork. */}
          <PlexusEffect />

          {/* Word-cloud canvas (fills the board, behind the overlay) */}
          <SpotlightCanvas nodes={filteredNodes} onNodeClick={handleNodeClick} />

          {/* Overlay controls */}
          <div style={{ position: "absolute", top: "24px", left: "24px", right: "24px", zIndex: 10, display: "flex", alignItems: "center", gap: "12px", pointerEvents: "none" }}>
            {/* Search (top-left) */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", height: "44px", border: `1px solid ${BORDER}`, borderRadius: "68px", background: "rgba(0,7,12,0.6)", padding: "0 16px", width: "240px", pointerEvents: "auto" }}>
              <SearchIcon />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("spotlightSearch")}
                style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", color: "#FFFFFF", fontFamily: "var(--font-montserrat)", fontSize: "14px" }}
              />
            </div>

            {/* 388 KUDOS — big, centered */}
            <span
              style={{
                position: "absolute", left: "50%", top: "0", transform: "translateX(-50%)",
                fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "48px",
                color: GOLD, lineHeight: 1.1, letterSpacing: "0.02em", whiteSpace: "nowrap",
              }}
            >
              {totalKudos} KUDOS
            </span>
          </div>

          {/* Expand / collapse toggle (design "B.7.2_Pan zoom"), bottom-right */}
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? t("spotlightCollapse") : t("spotlightExpand")}
            aria-pressed={expanded}
            style={{
              position: "absolute", right: "24px", bottom: "24px", zIndex: 20,
              width: "44px", height: "44px", borderRadius: "8px",
              border: `1px solid ${BORDER}`, background: "rgba(0,7,12,0.6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {expanded ? (
                <path d="M9 9L4 4M9 9V5M9 9H5M15 9l5-5M15 9V5M15 9h4M9 15l-5 5M9 15v4M9 15H5M15 15l5 5M15 15v4M15 15h4" />
              ) : (
                <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
