import { type CSSProperties } from "react";
import { GOLD, DARK } from "@/app/components/liveboard/theme";

export const pageStyle: CSSProperties = {
  width: "100%",
  background: "#00101A",
  minHeight: "100vh",
  fontFamily: "var(--font-montserrat)",
};

export const heroZoneStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  overflow: "visible",
};

export const keyvisualStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  height: "512px",
  overflow: "hidden",
  backgroundColor: "#00101A",
};

export const keyvisualOverlayStyle: CSSProperties = {
  position: "absolute",
  background: "linear-gradient(8deg, #00101A 8.6%, rgba(0, 19, 32, 0.00) 37.25%)",
  inset: 0,
  zIndex: 1,
};

export const profileHeaderOverlapStyle: CSSProperties = {
  marginTop: "-312px",
  position: "relative",
  zIndex: 2,
  width: "100%",
  display: "flex",
  justifyContent: "center",
};

export const bodyStyle: CSSProperties = {
  width: "100%",
  maxWidth: "680px",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: "80px",
  padding: "80px 16px",
  boxSizing: "border-box",
};

export const feedSectionStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

export const feedStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

export const emptyStateStyle: CSSProperties = {
  textAlign: "center",
  padding: "48px 0",
  color: "#999",
  fontFamily: "var(--font-montserrat)",
  fontSize: "16px",
};

export const loadMoreStyle: CSSProperties = {
  alignSelf: "center",
  marginTop: "8px",
  padding: "12px 32px",
  background: "transparent",
  border: `1px solid ${GOLD}`,
  borderRadius: "8px",
  color: GOLD,
  fontFamily: "var(--font-montserrat)",
  fontWeight: 700,
  fontSize: "16px",
  cursor: "pointer",
};

export const toastStyle: CSSProperties = {
  position: "fixed",
  bottom: "32px",
  left: "50%",
  transform: "translateX(-50%)",
  background: DARK,
  color: GOLD,
  border: `1px solid ${GOLD}`,
  borderRadius: "8px",
  padding: "12px 24px",
  fontFamily: "var(--font-montserrat)",
  fontWeight: 700,
  fontSize: "15px",
  zIndex: 9999,
  pointerEvents: "none",
  boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
};
