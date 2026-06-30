"use client";

import { useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { DARK, BORDER, MUTED, RED, GOLD } from "@/app/components/liveboard/theme";
import { usePortalDropdown } from "@/app/components/ui/use-portal-dropdown";

export interface RecipientOption {
  id: string;
  name: string;
  avatarUrl: string;
  department?: string;
}

// Round avatar with a colored-initial fallback when no image is available.
function Avatar({ src, name, size }: { src?: string; name: string; size: number }) {
  if (src) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        background: GOLD,
        color: DARK,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: Math.round(size * 0.42),
      }}
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}

export interface KudoRecipientSelectProps {
  value: RecipientOption | null;
  onChange: (option: RecipientOption | null) => void;
  options: RecipientOption[];
  onSearch?: (q: string) => void;
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

const INPUT_BOX_STYLE: CSSProperties = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "8px 16px",
  background: "#FFF",
  border: `1px solid ${BORDER}`,
  borderRadius: "8px",
  cursor: "pointer",
  minHeight: "44px",
  boxSizing: "border-box",
};

const PLACEHOLDER_STYLE: CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: "14px",
  fontWeight: 700,
  lineHeight: "24px",
  color: MUTED,
  letterSpacing: "0.15px",
};

// Visuals only — position is applied inline from the trigger rect (portalled).
const DROPDOWN_STYLE: CSSProperties = {
  position: "fixed",
  background: "#FFF",
  border: `1px solid ${BORDER}`,
  borderRadius: "8px",
  zIndex: 9600,
  boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
  maxHeight: "240px",
  overflowY: "auto",
  margin: 0,
  listStyle: "none",
  padding: 0,
};

const OPTION_STYLE: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "10px 16px",
  cursor: "pointer",
  fontFamily: "var(--font-montserrat)",
  fontSize: "15px",
  fontWeight: 600,
  color: DARK,
};

// Chevron-down icon (24×24)
function ChevronDown({ color = MUTED }: { color?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M6 9l6 6 6-6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function KudoRecipientSelect({
  value,
  onChange,
  options,
  onSearch,
  error,
}: KudoRecipientSelectProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { open, setOpen, toggle, triggerRef, popupRef, rect } = usePortalDropdown<HTMLDivElement>();

  const filtered = query
    ? options.filter((o) =>
        o.name.toLowerCase().includes(query.toLowerCase())
      )
    : options;

  function handleBoxClick() {
    toggle();
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    onSearch?.(e.target.value);
  }

  function handleSelect(option: RecipientOption) {
    onChange(option);
    setOpen(false);
    setQuery("");
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange(null);
    setQuery("");
  }

  return (
    <div
      style={{
        position: "relative",
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
        Người nhận
        <span style={ASTERISK_STYLE}>*</span>
      </div>

      {/* Input + dropdown */}
      <div style={{ flex: 1, position: "relative" }}>
        <div
          ref={triggerRef}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls="recipient-listbox"
          style={{
            ...INPUT_BOX_STYLE,
            border: error
              ? `1px solid ${RED}`
              : `1px solid ${BORDER}`,
          }}
          onClick={handleBoxClick}
        >
          {open ? (
            <input
              ref={inputRef}
              value={query}
              onChange={handleQueryChange}
              placeholder="Tìm kiếm"
              onClick={(e) => e.stopPropagation()}
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontFamily: "var(--font-montserrat)",
                fontSize: "16px",
                fontWeight: 700,
                lineHeight: "24px",
                color: DARK,
                flex: 1,
                letterSpacing: "0.15px",
              }}
            />
          ) : value ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flex: 1,
              }}
            >
              <Avatar src={value.avatarUrl} name={value.name} size={28} />
              <span
                style={{
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: DARK,
                  letterSpacing: "0.15px",
                }}
              >
                {value.name}
              </span>
              <button
                type="button"
                onClick={handleClear}
                aria-label="Xóa người nhận"
                style={{
                  marginLeft: "auto",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  color: MUTED,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ) : (
            <span style={PLACEHOLDER_STYLE}>Tìm kiếm</span>
          )}
          <ChevronDown />
        </div>

        {open && rect && typeof document !== "undefined" && createPortal(
          <ul
            ref={popupRef}
            id="recipient-listbox"
            role="listbox"
            style={{ ...DROPDOWN_STYLE, top: rect.bottom + 4, left: rect.left, width: rect.width }}
          >
            {filtered.length === 0 ? (
              <li
                style={{
                  ...OPTION_STYLE,
                  color: MUTED,
                  cursor: "default",
                  justifyContent: "center",
                }}
              >
                Không có kết quả
              </li>
            ) : (
              filtered.map((opt) => (
                <li
                  key={opt.id}
                  role="option"
                  aria-selected={value?.id === opt.id}
                  style={{
                    ...OPTION_STYLE,
                    background:
                      value?.id === opt.id
                        ? "rgba(255, 234, 158, 0.3)"
                        : "transparent",
                  }}
                  onClick={() => handleSelect(opt)}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(255, 234, 158, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      value?.id === opt.id
                        ? "rgba(255, 234, 158, 0.3)"
                        : "transparent";
                  }}
                >
                  <Avatar src={opt.avatarUrl} name={opt.name} size={36} />
                  <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                    <span style={{ fontWeight: 700, color: DARK, lineHeight: "20px" }}>{opt.name}</span>
                    {opt.department && (
                      <span style={{ fontSize: "13px", fontWeight: 500, color: MUTED, lineHeight: "18px" }}>
                        {opt.department}
                      </span>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>,
          document.body
        )}
      </div>

      {error && (
        <span
          style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: "13px",
            color: RED,
            position: "absolute",
            bottom: "-20px",
            left: 0,
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
