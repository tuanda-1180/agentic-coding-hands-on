import type { CSSProperties } from "react";

// Prop seam: Phase 04 wires live values + passes showComingSoon=false at zero.
// Presentational only — no tick logic here.
export interface HeroCountdownUnit {
  value: number; // 0–99
  label: string;
}

export interface HeroCountdownProps {
  units: HeroCountdownUnit[];
  showComingSoon?: boolean;
  comingSoonText?: string;
}

type ExtendedCSSProperties = CSSProperties & {
  WebkitBackdropFilter?: string;
};

// LED box scaled to hero size: each box ≈ 51×82 (digit-pair row 116px incl 14px gap)
const BOX_WIDTH = "51px";
const BOX_HEIGHT = "82px";
const DIGIT_FONT_SIZE = "48px";

const boxStyle: ExtendedCSSProperties = {
  position: "absolute",
  inset: 0,
  borderRadius: "10px",
  border: "0.75px solid #FFEA9E",
  background: "linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.10) 100%)",
  opacity: 0.5,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
};

function HeroLedDigit({ char }: { char: string }) {
  return (
    <div
      style={{
        position: "relative",
        width: BOX_WIDTH,
        height: BOX_HEIGHT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <div style={boxStyle} />
      {/* Ghost unlit segments */}
      <span
        style={{
          position: "absolute",
          fontFamily: "var(--font-led)",
          fontSize: DIGIT_FONT_SIZE,
          lineHeight: 1,
          color: "#FFFFFF",
          userSelect: "none",
          opacity: 0.18,
        }}
        aria-hidden={true}
      >
        8
      </span>
      {/* Lit digit */}
      <span
        style={{
          position: "absolute",
          fontFamily: "var(--font-led)",
          fontSize: DIGIT_FONT_SIZE,
          lineHeight: 1,
          color: "#FFFFFF",
          userSelect: "none",
        }}
      >
        {char}
      </span>
    </div>
  );
}

function HeroCountdownUnitDisplay({ unit }: { unit: HeroCountdownUnit }) {
  const safe = Number.isFinite(unit.value)
    ? Math.min(99, Math.max(0, Math.floor(unit.value)))
    : 0;
  const padded = String(safe).padStart(2, "0");
  const first = padded[0] ?? "0";
  const second = padded[1] ?? "0";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        alignItems: "flex-start",
      }}
    >
      {/* Digit pair row — 116px wide incl 14px gap */}
      <div style={{ display: "flex", flexDirection: "row", gap: "14px" }}>
        <HeroLedDigit char={first} />
        <HeroLedDigit char={second} />
      </div>
      {/* Label */}
      <span
        style={{
          fontFamily: "var(--font-montserrat)",
          fontWeight: 700,
          fontSize: "24px",
          lineHeight: 1.2,
          color: "#FFFFFF",
          textTransform: "uppercase",
        }}
      >
        {unit.label}
      </span>
    </div>
  );
}

export default function HeroCountdown({
  units,
  showComingSoon = true,
  comingSoonText = "Coming soon",
}: HeroCountdownProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {showComingSoon && (
        <p
          style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: "24px",
            lineHeight: 1.2,
            color: "#FFFFFF",
            margin: 0,
          }}
        >
          {comingSoonText}
        </p>
      )}
      {/* Countdown row — gap 40 between units */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "40px",
          alignItems: "flex-start",
        }}
      >
        {units.map((unit) => (
          <HeroCountdownUnitDisplay key={unit.label} unit={unit} />
        ))}
      </div>
    </div>
  );
}
