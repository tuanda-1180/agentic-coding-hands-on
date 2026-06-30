"use client";

import type { CSSProperties } from "react";
import { DARK, BORDER, MUTED, RED } from "@/app/components/liveboard/theme";

export interface KudoTitleInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

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

const HELPER_STYLE: CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "16px",
  fontWeight: 700,
  lineHeight: "24px",
  letterSpacing: "0.15px",
  color: MUTED,
};

export default function KudoTitleInput({
  value,
  onChange,
  error,
}: KudoTitleInputProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: "16px",
        width: "100%",
        fontFamily: "var(--font-montserrat)",
      }}
    >
      {/* Label */}
      <div style={{ ...LABEL_STYLE, paddingTop: "14px" }}>
        Danh hiệu
        <span style={ASTERISK_STYLE}>*</span>
      </div>

      {/* Input + helpers */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0px" }}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Dành tặng một danh hiệu cho đồng đội"
          aria-label="Danh hiệu"
          style={{
            width: "100%",
            padding: "8px 16px",
            background: "#FFF",
            border: error ? `1px solid ${RED}` : `1px solid ${BORDER}`,
            borderRadius: "8px",
            fontFamily: "var(--font-montserrat)",
            fontSize: "14px",
            fontWeight: 700,
            lineHeight: "24px",
            letterSpacing: "0.15px",
            color: DARK,
            outline: "none",
            boxSizing: "border-box",
            minHeight: "44px",
          }}
          onFocus={(e) => {
            if (!error) {
              e.currentTarget.style.borderColor = DARK;
            }
          }}
          onBlur={(e) => {
            if (!error) {
              e.currentTarget.style.borderColor = BORDER;
            }
          }}
        />

        {/* Helper text lines */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "6px",
          }}
        >
          <span style={HELPER_STYLE}>
            Ví dụ: Người truyền động lực cho tôi.
          </span>
          <span style={HELPER_STYLE}>
            Danh hiệu sẽ hiển thị làm tiêu đề Kudos của bạn.
          </span>
        </div>

        {error && (
          <span
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "13px",
              color: RED,
              marginTop: "4px",
            }}
          >
            {error}
          </span>
        )}
      </div>
    </div>
  );
}
