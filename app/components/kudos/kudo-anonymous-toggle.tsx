"use client";

import type { CSSProperties } from "react";
import { DARK, BORDER, MUTED } from "@/app/components/liveboard/theme";

export interface KudoAnonymousToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Anonymous display name (alias) — the field shows only while checked. */
  name?: string;
  onNameChange?: (value: string) => void;
  namePlaceholder?: string;
}

const NAME_INPUT_STYLE: CSSProperties = {
  width: "100%",
  height: "44px",
  padding: "8px 16px",
  borderRadius: "8px",
  border: `1px solid ${BORDER}`,
  background: "#FFF",
  fontFamily: "var(--font-montserrat)",
  fontSize: "14px",
  color: DARK,
  outline: "none",
  boxSizing: "border-box",
};

const LABEL_STYLE: CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "16px",
  fontWeight: 700,
  lineHeight: "22px",
  color: MUTED,
  cursor: "pointer",
  userSelect: "none",
};

const CHECKBOX_STYLE: CSSProperties = {
  width: "24px",
  height: "24px",
  borderRadius: "4px",
  border: `1px solid ${MUTED}`,
  background: "#FFF",
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "border-color 150ms ease, background 150ms ease",
  boxSizing: "border-box",
};

const CHECKBOX_CHECKED_STYLE: CSSProperties = {
  ...CHECKBOX_STYLE,
  background: DARK,
  border: `1px solid ${DARK}`,
};

// Checkmark SVG
function Checkmark() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2.5 7L5.5 10L11.5 4"
        stroke="#FFEA9E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function KudoAnonymousToggle({
  checked,
  onChange,
  name = "",
  onNameChange,
  namePlaceholder = "Nhập tên ẩn danh",
}: KudoAnonymousToggleProps) {
  const id = "kudo-anonymous-checkbox";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "100%",
        fontFamily: "var(--font-montserrat)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "16px",
          width: "100%",
        }}
      >
      {/* Hidden native checkbox for a11y */}
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0, pointerEvents: "none" }}
        aria-label="Gửi lời cám ơn và ghi nhận ẩn danh"
      />

      {/* Visual checkbox */}
      <div
        role="checkbox"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        tabIndex={0}
        style={checked ? CHECKBOX_CHECKED_STYLE : CHECKBOX_STYLE}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            onChange(!checked);
          }
        }}
      >
        {checked && <Checkmark />}
      </div>

      {/* Label */}
      <label
        id={`${id}-label`}
        htmlFor={id}
        style={LABEL_STYLE}
      >
        Gửi lời cám ơn và ghi nhận ẩn danh
      </label>
      </div>

      {/* Anonymous name field — shown only when anonymous is enabled */}
      {checked && (
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange?.(e.target.value)}
          placeholder={namePlaceholder}
          aria-label={namePlaceholder}
          style={NAME_INPUT_STYLE}
        />
      )}
    </div>
  );
}
