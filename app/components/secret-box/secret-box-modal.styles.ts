import { type CSSProperties } from "react";

// ---------------------------------------------------------------------------
// Design tokens (from Figma — frame node 1466:7676)
//   panel bg #00101A · gold #FFEA9E · white · separator #2E3940 · Montserrat
// ---------------------------------------------------------------------------

export const GOLD_TEXT = "rgba(255, 234, 158, 1)";
export const WHITE_TEXT = "rgba(255, 255, 255, 1)";
const SEPARATOR_COLOR = "rgba(46, 57, 64, 1)";
const PANEL_BG = "#00101A";

export const backdrop: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 9000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0, 16, 26, 0.80)",
  padding: "16px",
};

export const panel: CSSProperties = {
  position: "relative",
  width: "min(652px, 100%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0px",
  padding: "24px 13px 20px",
  borderRadius: "13px",
  background: PANEL_BG,
  fontFamily: "var(--font-montserrat)",
  boxSizing: "border-box",
  overflow: "hidden",
};

export const headerRow: CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  marginBottom: "8px",
};

export const titleStyle: CSSProperties = {
  fontSize: "24px",
  fontWeight: 700,
  lineHeight: "1.25",
  color: GOLD_TEXT,
  textAlign: "center",
  margin: 0,
  fontFamily: "var(--font-montserrat)",
  paddingRight: "28px",
  paddingLeft: "28px",
};

export const closeBtnStyle: CSSProperties = {
  position: "absolute",
  right: "0",
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  padding: "4px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: WHITE_TEXT,
  lineHeight: 1,
};

export const separatorStyle: CSSProperties = {
  width: "100%",
  height: "1px",
  background: SEPARATOR_COLOR,
  flexShrink: 0,
  margin: "8px 0",
};

export const instructionStyle: CSSProperties = {
  fontSize: "13px",
  fontWeight: 700,
  lineHeight: "1.5",
  color: WHITE_TEXT,
  textAlign: "center",
  letterSpacing: "0.4px",
  fontFamily: "var(--font-montserrat)",
  margin: "8px 0 0",
  height: "20px",
};

// Gift-box / badge area: 557×557px square, clickable button wrapping the image.
export const boxBtnBase: CSSProperties = {
  background: "none",
  border: "none",
  padding: 0,
  margin: "12px 0",
  display: "block",
  lineHeight: 0,
  borderRadius: "8px",
  transition: "transform 180ms ease, opacity 180ms ease",
  width: "min(557px, 100%)",
  aspectRatio: "1 / 1",
  position: "relative",
};

export const bottomSeparatorStyle: CSSProperties = {
  ...separatorStyle,
  margin: "0 0 12px",
};

export const counterRow: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "6px",
  height: "35px",
};

export const counterLabelStyle: CSSProperties = {
  fontSize: "13px",
  fontWeight: 700,
  lineHeight: "1.5",
  color: WHITE_TEXT,
  letterSpacing: "0.4px",
  fontFamily: "var(--font-montserrat)",
};

export const counterNumberStyle: CSSProperties = {
  fontSize: "29px",
  fontWeight: 700,
  lineHeight: "1",
  color: GOLD_TEXT,
  fontFamily: "var(--font-montserrat)",
};

// Badge name shown under the revealed badge in the success state.
export const badgeNameStyle: CSSProperties = {
  fontSize: "18px",
  fontWeight: 700,
  lineHeight: "1.3",
  color: GOLD_TEXT,
  textAlign: "center",
  fontFamily: "var(--font-montserrat)",
  margin: "0 0 8px",
};
