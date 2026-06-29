"use client";

import { useState, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import type { KudosPost } from "@/app/lib/liveboard/types";
import { useDropdown } from "@/app/components/ui/use-dropdown";
import HighlightKudosCarousel from "./highlight-kudos-carousel";
import { GOLD, DARK } from "./theme";

export interface HighlightKudosSectionProps {
  items: KudosPost[];
  hashtags: string[];
  departments: string[];
  /** null = "all" */
  selectedHashtag: string | null;
  selectedDepartment: string | null;
  onSelectHashtag: (v: string | null) => void;
  onSelectDepartment: (v: string | null) => void;
  onToggleLike?: (id: string) => void;
}

const MUTED_GOLD = "#998C5F";
// Dropdown menu surface + the gold "lit" glow, taken from the MoMorph design nodes.
const DROPDOWN_BG = "#00070C";
const GOLD_TINT = "rgba(255,234,158,0.10)";
const GOLD_GLOW = "0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287";

const sectionStyle: CSSProperties = {
  width: "100%",
  background: DARK,
  padding: "48px 0",
  display: "flex",
  flexDirection: "column",
  gap: "32px",
  fontFamily: "var(--font-montserrat)",
};

/**
 * One option row in a filter dropdown. Lit (gold tint + gold text glow) when it
 * is the selected value or on hover/focus — matches the MoMorph filter design.
 */
function FilterOption({ label, selected, onSelect }: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const lit = selected || hovered;

  return (
    <button
      role="menuitem"
      aria-current={selected ? "true" : undefined}
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "56px",
        padding: "16px",
        boxSizing: "border-box",
        borderRadius: "4px",
        background: lit ? GOLD_TINT : "transparent",
        color: "#FFFFFF",
        border: "none",
        cursor: "pointer",
        whiteSpace: "nowrap",
        fontFamily: "var(--font-montserrat)",
        fontWeight: 700,
        fontSize: "16px",
        letterSpacing: "0.15px",
        textShadow: lit ? GOLD_GLOW : "none",
        transition: "background 120ms ease, text-shadow 120ms ease",
      }}
    >
      {label}
    </button>
  );
}

function FilterDropdown({ label, options, selected, onSelect }: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  const { isOpen, triggerRef, menuRef, triggerProps, menuProps, close } = useDropdown();

  return (
    <div style={{ position: "relative" }}>
      <button
        ref={triggerRef}
        {...triggerProps}
        style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "16px", borderRadius: "4px",
          border: `1px solid ${MUTED_GOLD}`, background: GOLD_TINT,
          color: "#FFFFFF", fontSize: "16px", fontWeight: 700,
          letterSpacing: "0.15px", lineHeight: "24px", cursor: "pointer",
          fontFamily: "var(--font-montserrat)",
        }}
      >
        {label}
        <svg
          width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="#FFFFFF" strokeWidth="2"
          style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 120ms ease" }}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {isOpen && (
        <div
          ref={menuRef as React.RefObject<HTMLDivElement>}
          {...menuProps}
          style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 10,
            display: "flex", flexDirection: "column",
            padding: "6px",
            background: DROPDOWN_BG, borderRadius: "8px",
            border: `1px solid ${MUTED_GOLD}`, minWidth: "120px",
            maxHeight: "348px", overflowY: "auto",
          }}
        >
          {options.map((opt) => (
            <FilterOption
              key={opt}
              label={opt}
              selected={selected === opt}
              onSelect={() => {
                onSelect(opt);
                close();
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function HighlightKudosSection({
  items,
  hashtags,
  departments,
  selectedHashtag,
  selectedDepartment,
  onSelectHashtag,
  onSelectDepartment,
  onToggleLike,
}: HighlightKudosSectionProps) {
  const t = useTranslations("liveboard");

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/kudos/${id}`;
    navigator.clipboard.writeText(url).catch(() => {});
  };

  const handleViewDetail = (id: string) => {
    window.location.href = `/kudos/${id}`;
  };

  // Toggle semantics: clicking the already-active value clears the filter. No
  // "all" row — the design lists only real values (selected one is highlighted).
  const pickHashtag = (v: string) => onSelectHashtag(selectedHashtag === v ? null : v);
  const pickDept = (v: string) => onSelectDepartment(selectedDepartment === v ? null : v);

  return (
    <section style={sectionStyle} aria-label={t("highlightTitle")}>
      {/* Section header */}
      <div style={{ width: "100%", padding: "0 144px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "12px" }}>
        <span style={{ fontSize: "24px", fontWeight: 700, color: "white" }}>
          {t("sectionLabel")}
        </span>
        <div style={{ height: "1px", background: "rgba(255,234,158,0.3)" }} />
        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
          <h2 style={{ fontSize: "57px", fontWeight: 700, color: GOLD, margin: 0, lineHeight: 1, letterSpacing: "-0.01em" }}>
            {t("highlightTitle")}
          </h2>
          <div style={{ marginLeft: "auto", display: "flex", gap: "12px", alignItems: "center" }}>
            <FilterDropdown
              label={t("hashtagFilter")}
              options={hashtags}
              selected={selectedHashtag ?? ""}
              onSelect={pickHashtag}
            />
            <FilterDropdown
              label={t("departmentFilter")}
              options={departments}
              selected={selectedDepartment ?? ""}
              onSelect={pickDept}
            />
          </div>
        </div>
      </div>

      {/* Carousel */}
      {items.length > 0 ? (
        <HighlightKudosCarousel
          items={items}
          onCopyLink={handleCopyLink}
          onViewDetail={handleViewDetail}
          onHashtagClick={pickHashtag}
          onToggleLike={onToggleLike}
        />
      ) : (
        <div style={{ textAlign: "center", color: MUTED_GOLD, fontSize: "16px", padding: "48px 0" }}>
          {t("emptyFeed")}
        </div>
      )}
    </section>
  );
}

