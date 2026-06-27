import type { CSSProperties } from "react";

interface IconProps {
  size?: number;
  /** Stroke/fill color. Defaults to the SAA gold. */
  color?: string;
  style?: CSSProperties;
}

const GOLD = "#FFEA9E";

const baseStyle = (size: number, style?: CSSProperties): CSSProperties => ({
  flexShrink: 0,
  width: size,
  height: size,
  ...style,
});

/** Target / aim icon — used beside nav items and award titles (MM_MEDIA_Target). */
export function TargetIcon({ size = 24, color = GOLD, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={baseStyle(size, style)}
    >
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4.5" stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.5" fill={color} />
    </svg>
  );
}

/** Diamond / gem icon — used beside the award quantity (MM_MEDIA_Diamond). */
export function DiamondIcon({ size = 24, color = GOLD, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={baseStyle(size, style)}
    >
      <path
        d="M5 4H19L22 9.5L12 21L2 9.5L5 4Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M2 9.5H22" stroke={color} strokeWidth="1.2" />
      <path d="M8.5 4L7 9.5L12 21" stroke={color} strokeWidth="1.2" />
      <path d="M15.5 4L17 9.5L12 21" stroke={color} strokeWidth="1.2" />
    </svg>
  );
}

/** Medal / award icon — used beside the prize value (MM_MEDIA_License). */
export function LicenseIcon({ size = 24, color = GOLD, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={baseStyle(size, style)}
    >
      <circle cx="12" cy="9" r="6" stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="9" r="2.5" stroke={color} strokeWidth="1.2" />
      <path
        d="M9.5 14L8 22L12 19.2L16 22L14.5 14"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
