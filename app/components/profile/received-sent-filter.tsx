"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { useDropdown } from "@/app/components/ui/use-dropdown";
import { PANEL_BG, BORDER } from "@/app/components/liveboard/theme";
import type { KudosDirection } from "@/app/lib/liveboard/types";

export interface ReceivedSentFilterProps {
  value: KudosDirection;
  counts: { received: number; sent: number };
  onChange: (v: KudosDirection) => void;
}

const triggerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "16px 24px",
  background: "rgba(255, 234, 158, 0.10)",
  border: `1px solid ${BORDER}`,
  borderRadius: "4px",
  cursor: "pointer",
  fontFamily: "var(--font-montserrat)",
  fontWeight: 700,
  fontSize: "16px",
  lineHeight: "24px",
  letterSpacing: "0.15px",
  color: "#FFFFFF",
  whiteSpace: "nowrap",
};

const panelStyle: CSSProperties = {
  position: "absolute",
  top: "calc(100% + 4px)",
  right: 0,
  display: "flex",
  flexDirection: "column",
  padding: "6px",
  background: PANEL_BG,
  border: `1px solid ${BORDER}`,
  borderRadius: "8px",
  zIndex: 100,
  minWidth: "100%",
};

function FilterOption({
  label,
  count,
  selected,
  onSelect,
}: {
  label: string;
  count: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const [hover, setHover] = useState(false);

  const itemStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "4px",
    width: "100%",
    height: "48px",
    padding: "0 16px",
    boxSizing: "border-box",
    borderRadius: "4px",
    background: hover || selected ? "rgba(255, 234, 158, 0.10)" : "transparent",
    border: "none",
    cursor: "pointer",
    fontFamily: "var(--font-montserrat)",
    fontWeight: selected ? 700 : 500,
    fontSize: "15px",
    lineHeight: "24px",
    letterSpacing: "0.15px",
    color: selected ? "#FFEA9E" : "#FFFFFF",
    textAlign: "left",
    whiteSpace: "nowrap",
    transition: "background 120ms ease, color 120ms ease",
  };

  return (
    <button
      role="menuitem"
      aria-current={selected ? "true" : undefined}
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={itemStyle}
    >
      {label} ({count})
    </button>
  );
}

/**
 * Controlled filter dropdown for the Profile Kudos section.
 * Shows the active option in the trigger; opens a panel with both options.
 */
export default function ReceivedSentFilter({
  value,
  counts,
  onChange,
}: ReceivedSentFilterProps) {
  const { isOpen, triggerRef, menuRef, triggerProps, menuProps, close } =
    useDropdown();
  const t = useTranslations("profile");
  const optionLabels: Record<KudosDirection, string> = {
    received: t("filterReceived"),
    sent: t("filterSent"),
  };

  const activeLabel = optionLabels[value];
  const activeCount = counts[value];

  const options: Array<{ key: KudosDirection }> = [
    { key: "received" },
    { key: "sent" },
  ];

  function handleSelect(v: KudosDirection) {
    onChange(v);
    close();
  }

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button ref={triggerRef} style={triggerStyle} {...triggerProps}>
        <span>
          {activeLabel} ({activeCount})
        </span>
        <Image
          src="/saa/chevron-down.svg"
          alt=""
          aria-hidden={true}
          width={24}
          height={24}
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 200ms ease",
          }}
        />
      </button>

      {isOpen && (
        <div
          ref={menuRef as React.RefObject<HTMLDivElement>}
          aria-label={t("filterAria")}
          style={panelStyle}
          {...menuProps}
        >
          {options.map(({ key }) => (
            <FilterOption
              key={key}
              label={optionLabels[key]}
              count={counts[key]}
              selected={key === value}
              onSelect={() => handleSelect(key)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
