"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";

// Authoritative nav text values from the MoMorph frame (node A1.2/A1.3):
// Montserrat 700, 14px, line-height 20, letter-spacing 0.1; selected = gold
// #FFEA9E + gold glow + gold underline; default = white.
const GOLD = "#FFEA9E";
const GOLD_GLOW = "0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287";

const BASE_STYLE: CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontWeight: 700,
  fontSize: "14px",
  lineHeight: "20px",
  letterSpacing: "0.1px",
  color: "#FFFFFF",
  textDecoration: "none",
  padding: "16px",
  whiteSpace: "nowrap",
  // transparent baseline border so the hover/active underline adds no layout shift
  borderBottom: "1px solid transparent",
  transition: "color 120ms ease, border-color 120ms ease, text-shadow 120ms ease",
};

// Selected AND hover share the same emphasized look (per user request: hover
// mimics the active state — gold text + gold underline + glow).
const EMPHASIZED_STYLE: CSSProperties = {
  color: GOLD,
  borderBottom: `1px solid ${GOLD}`,
  textShadow: GOLD_GLOW,
};

interface HeaderNavLinkProps {
  href: string;
  label: string;
  active?: boolean;
  /** Optional click handler (e.g. smooth-scroll on same-page links). */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

/** Header navigation link with active state and hover-as-active emphasis. */
export function HeaderNavLink({
  href,
  label,
  active = false,
  onClick,
}: HeaderNavLinkProps) {
  const [hovered, setHovered] = useState(false);
  const emphasized = active || hovered;
  const style: CSSProperties = emphasized
    ? { ...BASE_STYLE, ...EMPHASIZED_STYLE }
    : BASE_STYLE;

  // Mouse AND keyboard trigger the emphasized look so focus-navigating users
  // get the same affordance as hover.
  const handlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onFocus: () => setHovered(true),
    onBlur: () => setHovered(false),
  };

  // Same-page hash links use a plain anchor; route links use next/link.
  if (href.startsWith("#")) {
    return (
      <a href={href} style={style} onClick={onClick} {...handlers}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} style={style} onClick={onClick} {...handlers}>
      {label}
    </Link>
  );
}
