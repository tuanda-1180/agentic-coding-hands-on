import type { CSSProperties } from "react";

// React's CSSProperties does not expose WebkitBackdropFilter; extend to allow it.
type ExtendedCSSProperties = CSSProperties & {
  WebkitBackdropFilter?: string;
};

interface LedDigitProps {
  char: string;
}

const BOX_WIDTH = "76.8px";
const BOX_HEIGHT = "122.88px";
const DIGIT_FONT_SIZE = "73.7px";

// The glassy box carries opacity 0.5 (per design), as an absolutely-positioned layer
// BEHIND the glyph — so the digit itself stays full-opacity white, matching the Figma
// structure where the rectangle and the number are siblings, not parent/child.
const boxStyle: ExtendedCSSProperties = {
  position: "absolute",
  inset: 0,
  borderRadius: "12px",
  border: "0.75px solid #FFEA9E",
  background: "linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.10) 100%)",
  opacity: 0.5,
  backdropFilter: "blur(24.96px)",
  WebkitBackdropFilter: "blur(24.96px)",
};

const glyphBase: CSSProperties = {
  position: "absolute",
  fontFamily: "var(--font-led)",
  fontSize: DIGIT_FONT_SIZE,
  lineHeight: 1,
  color: "#FFFFFF",
  userSelect: "none",
};

export default function LedDigit({ char }: LedDigitProps) {
  return (
    <div
      style={{
        position: "relative",
        width: BOX_WIDTH,
        height: BOX_HEIGHT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={boxStyle} />
      {/* Ghost: all unlit segments faintly visible (DSEG convention) */}
      <span style={{ ...glyphBase, opacity: 0.18 }} aria-hidden={true}>
        8
      </span>
      {/* Lit digit */}
      <span style={glyphBase}>{char}</span>
    </div>
  );
}
