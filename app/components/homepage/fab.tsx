"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useDropdown } from "@/app/components/ui/use-dropdown";

interface FabAction {
  key: "rules" | "writeKudos";
  icon: string;
  /** Pen icon ships white; darken it so it reads on the yellow pill. */
  darkenIcon: boolean;
}

// Order matches the design (screen Sv7DFwBw1h): Thể lệ on top, Viết KUDOS below.
// `rules` uses the SAA lightning mark (fab-kudos.svg) per the design — not a typo.
// Both actions open an in-page overlay (no navigation): Thể lệ panel / Viết Kudo modal.
const FAB_ACTIONS: FabAction[] = [
  { key: "rules", icon: "/saa/fab-kudos.svg", darkenIcon: false },
  { key: "writeKudos", icon: "/saa/fab-pen.svg", darkenIcon: true },
];

interface FabProps {
  /** Called when the "Thể lệ" action is chosen — opens the rules overlay panel. */
  onOpenRules?: () => void;
  /** Called when "Viết KUDOS" is chosen — opens the compose modal in place. */
  onWriteKudos?: () => void;
}

const YELLOW = "#FFEA9E";
const INK = "#00101A";
const RED = "#E73928";
const PILL_SHADOW = "0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287";
const PILL_SHADOW_HOVER = "0 6px 10px rgba(0,0,0,0.3), 0 0 10px #FAE287";

export default function Fab({ onOpenRules, onWriteKudos }: FabProps) {
  const t = useTranslations("fab");
  const { isOpen, triggerRef, menuRef, close, triggerProps, menuProps } =
    useDropdown();
  const [hovered, setHovered] = useState<string | null>(null);

  // Return focus to the trigger after the panel closes. The pill is only
  // display:none while open, so by the time this effect runs post-close it is
  // visible and focusable again (the hook's synchronous focus() is a no-op then).
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !isOpen) triggerRef.current?.focus();
    wasOpen.current = isOpen;
  }, [isOpen, triggerRef]);

  // Close the menu first, then run the action. Both actions open an in-page
  // overlay (no navigation): Thể lệ panel / Viết Kudo compose modal.
  const handleAction = (action: FabAction) => {
    close();
    if (action.key === "rules") {
      onOpenRules?.();
    } else if (action.key === "writeKudos") {
      onWriteKudos?.();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "40px",
        right: "19px",
        zIndex: 100,
      }}
    >
      {/* Closed pill trigger — pencil + "/" + SAA lightning. Kept mounted (hidden
          when open) so focus can return here on close. */}
      <button
        ref={triggerRef}
        aria-label={t("openActions")}
        style={{
          display: isOpen ? "none" : "inline-flex",
          alignItems: "center",
          gap: "8px",
          width: "106px",
          height: "64px",
          padding: "16px",
          borderRadius: "100px",
          border: "none",
          backgroundColor: YELLOW,
          boxShadow: PILL_SHADOW,
          cursor: "pointer",
        }}
        {...triggerProps}
      >
        <Image
          src="/saa/fab-pen.svg"
          alt=""
          aria-hidden={true}
          width={24}
          height={24}
          style={{ filter: "brightness(0)" }}
        />
        <span
          style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "24px",
            color: INK,
            lineHeight: 1,
          }}
        >
          /
        </span>
        <Image
          src="/saa/fab-kudos.svg"
          alt=""
          aria-hidden={true}
          width={24}
          height={24}
        />
      </button>

      {/* Open state — action pills stacked above the cancel button. The column is
          bottom-anchored, so cancel lands where the pill was, pills float above. */}
      {isOpen && (
        <div
          ref={menuRef as React.RefObject<HTMLDivElement>}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "16px",
          }}
          {...menuProps}
        >
          {FAB_ACTIONS.map((action) => (
            <button
              key={action.key}
              role="menuitem"
              onClick={() => handleAction(action)}
              onMouseEnter={() => setHovered(action.key)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                minHeight: "64px",
                padding: "0 24px",
                borderRadius: "16px",
                border: "none",
                backgroundColor: YELLOW,
                color: INK,
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "20px",
                lineHeight: 1,
                cursor: "pointer",
                boxShadow:
                  hovered === action.key ? PILL_SHADOW_HOVER : PILL_SHADOW,
                transition: "box-shadow 0.15s ease",
              }}
            >
              <Image
                src={action.icon}
                alt=""
                aria-hidden={true}
                width={24}
                height={24}
                style={action.darkenIcon ? { filter: "brightness(0)" } : undefined}
              />
              {t(action.key)}
            </button>
          ))}

          {/* Cancel — closes the panel (no navigation, per spec item C) */}
          <button
            aria-label={t("cancel")}
            onClick={close}
            onMouseEnter={() => setHovered("cancel")}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: RED,
              cursor: "pointer",
              boxShadow:
                hovered === "cancel"
                  ? "0 6px 10px rgba(0,0,0,0.35)"
                  : "0 4px 8px rgba(0,0,0,0.3)",
              transition: "box-shadow 0.15s ease",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden={true}>
              <path
                d="M4 4 L16 16 M16 4 L4 16"
                stroke="#FFFFFF"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
