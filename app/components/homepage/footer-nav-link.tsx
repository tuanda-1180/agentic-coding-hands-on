"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";

// Authoritative footer nav values from the MoMorph frame (mms_7 footer):
// Montserrat 700, white default; active/hover = gold text + gold glow (no
// underline in the footer design — node I5001:14800;342:1411 carries the glow).
const GOLD = "#FFEA9E";
const GOLD_GLOW = "0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287";

const BASE_STYLE: CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontWeight: 700,
  fontSize: "16px",
  lineHeight: "24px",
  letterSpacing: "0.15px",
  color: "#FFFFFF",
  textDecoration: "none",
  whiteSpace: "nowrap",
  transition: "color 120ms ease, text-shadow 120ms ease",
};

const EMPHASIZED_STYLE: CSSProperties = {
  color: GOLD,
  textShadow: GOLD_GLOW,
};

interface FooterNavLinkProps {
  href: string;
  label: string;
}

/** Footer navigation link with gold-glow hover emphasis. */
export function FooterNavLink({ href, label }: FooterNavLinkProps) {
  const [hovered, setHovered] = useState(false);
  const style: CSSProperties = hovered
    ? { ...BASE_STYLE, ...EMPHASIZED_STYLE }
    : BASE_STYLE;

  // Mouse AND keyboard trigger the gold-glow emphasis so focus-navigating
  // users get the same affordance as hover.
  const handlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onFocus: () => setHovered(true),
    onBlur: () => setHovered(false),
  };

  // Same-page hash anchors use a plain anchor; route links use next/link.
  if (href.startsWith("/") && !href.includes("#")) {
    return (
      <Link href={href} style={style} {...handlers}>
        {label}
      </Link>
    );
  }

  return (
    <a href={href} style={style} {...handlers}>
      {label}
    </a>
  );
}
