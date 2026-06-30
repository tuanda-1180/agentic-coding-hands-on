"use client";

import { type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { DARK, BORDER, MUTED, RED, GOLD } from "@/app/components/liveboard/theme";
import { usePortalDropdown } from "@/app/components/ui/use-portal-dropdown";

export interface KudoHashtagPickerProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
  error?: string;
}

const MAX_TAGS = 5;

const LABEL_STYLE: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "2px",
  fontFamily: "var(--font-montserrat)",
  fontSize: "16px",
  fontWeight: 700,
  lineHeight: "22px",
  color: DARK,
  flexShrink: 0,
  whiteSpace: "nowrap",
  width: "104px",
};

const ASTERISK_STYLE: CSSProperties = {
  fontFamily: "Noto Sans JP, sans-serif",
  fontSize: "16px",
  fontWeight: 700,
  lineHeight: "20px",
  color: "#CF1322",
};

const ADD_BTN_STYLE: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "4px 8px",
  background: "#FFF",
  border: `1px solid ${BORDER}`,
  borderRadius: "8px",
  cursor: "pointer",
  flexShrink: 0,
};

const CHIP_STYLE: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 10px",
  background: "rgba(255, 234, 158, 0.4)",
  border: `1px solid ${BORDER}`,
  borderRadius: "8px",
  fontFamily: "var(--font-montserrat)",
  fontSize: "13px",
  fontWeight: 700,
  lineHeight: "18px",
  color: DARK,
  letterSpacing: "0.3px",
};

// Dark dropdown panel per design "Dropdown list hashtag" (screen p9zO-c4a4x).
// Position applied inline from the trigger rect (portalled to <body>).
const DROPDOWN_STYLE: CSSProperties = {
  position: "fixed",
  background: DARK,
  borderRadius: "8px",
  zIndex: 9600,
  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  minWidth: "280px",
  maxHeight: "320px",
  overflowY: "auto",
  padding: "0",
  listStyle: "none",
  margin: 0,
};

const OPTION_STYLE: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 20px",
  cursor: "pointer",
  fontFamily: "var(--font-montserrat)",
  fontSize: "16px",
  fontWeight: 700,
  color: "#FFFFFF",
  gap: "12px",
  transition: "background 120ms ease",
};

// Selected rows carry a warm gold tint over the dark panel.
const OPTION_SELECTED_BG = "rgba(255, 234, 158, 0.14)";
const OPTION_HOVER_BG = "rgba(255, 255, 255, 0.08)";

// Filled gold check circle shown on selected rows (right side).
function CheckCircle() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="12" fill={GOLD} />
      <path d="M7 12.5l3 3 7-7" stroke={DARK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Plus icon (24×24)
function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke={MUTED} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// X icon (12×12)
function XIcon({ color = DARK }: { color?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M9 3L3 9M3 3l6 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function KudoHashtagPicker({
  value,
  onChange,
  options,
  error,
}: KudoHashtagPickerProps) {
  const { open, toggle, triggerRef, popupRef, rect } = usePortalDropdown<HTMLDivElement>();
  const atMax = value.length >= MAX_TAGS;

  // Selected hashtags first (matching the design), then the rest.
  const ordered = [
    ...value.filter((v) => options.includes(v)),
    ...options.filter((o) => !value.includes(o)),
  ];

  function handleToggle(tag: string) {
    if (value.includes(tag)) {
      onChange(value.filter((t) => t !== tag));
    } else if (!atMax) {
      onChange([...value, tag]);
    }
    // Dropdown stays open so multiple tags can be toggled (per design).
  }

  function handleRemove(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "16px",
        width: "100%",
        fontFamily: "var(--font-montserrat)",
      }}
    >
      {/* Label */}
      <div style={LABEL_STYLE}>
        Hashtag
        <span style={ASTERISK_STYLE}>*</span>
      </div>

      {/* Tag group */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
          minHeight: "48px",
        }}
      >
        {/* Add button — always available so selections can be toggled even at max */}
        <div ref={triggerRef} style={{ position: "relative" }}>
          <button
            type="button"
            onClick={toggle}
            aria-label="Thêm hashtag"
            aria-expanded={open}
            style={ADD_BTN_STYLE}
          >
            <PlusIcon />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 700, lineHeight: "16px", letterSpacing: "0.5px", color: MUTED }}>
                Hashtag
              </span>
              <span style={{ fontFamily: "var(--font-montserrat)", fontSize: "11px", fontWeight: 700, lineHeight: "16px", letterSpacing: "0.5px", color: MUTED }}>
                Tối đa {MAX_TAGS}
              </span>
            </div>
          </button>

          {open && rect && typeof document !== "undefined" && createPortal(
            <ul
              ref={popupRef}
              role="listbox"
              aria-multiselectable="true"
              style={{ ...DROPDOWN_STYLE, top: rect.bottom + 4, left: rect.left }}
            >
              {ordered.length === 0 ? (
                <li style={{ ...OPTION_STYLE, color: MUTED, cursor: "default" }}>Không còn hashtag</li>
              ) : (
                ordered.map((tag) => {
                  const selected = value.includes(tag);
                  const disabled = !selected && atMax;
                  return (
                    <li
                      key={tag}
                      role="option"
                      aria-selected={selected}
                      aria-disabled={disabled}
                      onClick={() => !disabled && handleToggle(tag)}
                      style={{
                        ...OPTION_STYLE,
                        background: selected ? OPTION_SELECTED_BG : "transparent",
                        cursor: disabled ? "not-allowed" : "pointer",
                        opacity: disabled ? 0.4 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!disabled && !selected) (e.currentTarget as HTMLElement).style.background = OPTION_HOVER_BG;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = selected ? OPTION_SELECTED_BG : "transparent";
                      }}
                    >
                      <span>{tag}</span>
                      {selected && <CheckCircle />}
                    </li>
                  );
                })
              )}
            </ul>,
            document.body
          )}
        </div>

        {/* Selected chips */}
        {value.map((tag) => (
          <div key={tag} style={CHIP_STYLE}>
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => handleRemove(tag)}
              aria-label={`Xóa ${tag}`}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                color: DARK,
              }}
            >
              <XIcon />
            </button>
          </div>
        ))}
      </div>

      {error && (
        <span
          style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "13px",
            color: RED,
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
