"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { TargetIcon } from "./award-icons";

export interface NavItem {
  slug: string;
  label: string;
}

interface AwardsCategoryNavProps {
  items: NavItem[];
  activeSlug: string;
  onSelect: (slug: string) => void;
}

interface IndicatorPos {
  top: number;
  left: number;
  width: number;
  ready: boolean;
}

/**
 * Sticky left-side category navigation for the awards page.
 *
 * The active "underline" is a SINGLE sliding bar (absolutely positioned) that
 * animates its position + width to the active item — instead of toggling a
 * per-item border-bottom, which snapped/jumped between items.
 */
export default function AwardsCategoryNav({
  items,
  activeSlug,
  onSelect,
}: AwardsCategoryNavProps) {
  const navRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicator, setIndicator] = useState<IndicatorPos>({
    top: 0,
    left: 0,
    width: 0,
    ready: false,
  });

  const measure = useCallback(() => {
    const el = itemRefs.current.get(activeSlug);
    if (!el) return;
    setIndicator({
      top: el.offsetTop + el.offsetHeight - 1, // bottom edge of the active item
      left: el.offsetLeft,
      width: el.offsetWidth,
      ready: true,
    });
  }, [activeSlug]);

  // Reposition before paint when the active item changes.
  useLayoutEffect(() => {
    measure();
  }, [measure, items]);

  // Recompute when the nav resizes (font load, responsive row/column switch).
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(nav);
    return () => ro.disconnect();
  }, [measure]);

  return (
    <nav
      ref={navRef}
      aria-label="Award categories"
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "178px",
        flexShrink: 0,
        alignItems: "flex-start",
      }}
    >
      {/* Sliding active underline — moves + resizes smoothly between items. */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "1px",
          width: `${indicator.width}px`,
          transform: `translate(${indicator.left}px, ${indicator.top}px)`,
          backgroundColor: "#FFEA9E",
          boxShadow: "0 0 6px #FAE287",
          opacity: indicator.ready ? 1 : 0,
          transition:
            "transform 280ms cubic-bezier(0.4, 0, 0.2, 1), width 280ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease",
          pointerEvents: "none",
        }}
      />

      {items.map((item) => {
        const isActive = item.slug === activeSlug;
        return (
          <button
            key={item.slug}
            type="button"
            aria-current={isActive ? "true" : undefined}
            ref={(el) => {
              if (el) itemRefs.current.set(item.slug, el);
              else itemRefs.current.delete(item.slug);
            }}
            onClick={() => onSelect(item.slug)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "16px",
              borderRadius: "4px",
              border: "none",
              // Reserve 1px so the sliding underline sits flush with the item box.
              borderBottom: "1px solid transparent",
              background: "transparent",
              cursor: "pointer",
              textAlign: "left",
              maxWidth: "100%",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.opacity = "0.7";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "1";
            }}
          >
            {/* Icon is always gold (design); only the label color changes. */}
            <TargetIcon color="#FFEA9E" />
            <span
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "14px",
                lineHeight: "20px",
                letterSpacing: "0.25px",
                color: isActive ? "#FFEA9E" : "#FFFFFF",
                textShadow: isActive
                  ? "0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287"
                  : "none",
                textAlign: "left",
                transition: "color 280ms ease, text-shadow 280ms ease",
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
