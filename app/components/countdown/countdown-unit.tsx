import LedDigit from "./led-digit";

interface CountdownUnitProps {
  value: number;
  label: string;
}

export default function CountdownUnit({ value, label }: CountdownUnitProps) {
  // The design has exactly two LED boxes per unit, so each unit shows two digits (0–99).
  // Clamp defensively: floor to an integer, guard NaN/Infinity, and cap at 99 so a value
  // ≥ 100 never silently truncates (e.g. 196 must not render as "96"). The normal hook
  // path (computeCountdown) keeps hours 0–23 / minutes 0–59; only days can approach the cap.
  const safe = Number.isFinite(value)
    ? Math.min(99, Math.max(0, Math.floor(value)))
    : 0;
  const padded = String(safe).padStart(2, "0");
  const first = padded[0] ?? "0";
  const second = padded[1] ?? "0";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "21px",
        alignItems: "flex-start",
      }}
    >
      {/* Digit pair row */}
      <div style={{ display: "flex", flexDirection: "row", gap: "21px" }}>
        <LedDigit char={first} />
        <LedDigit char={second} />
      </div>

      {/* Label */}
      <span
        style={{
          fontFamily: "var(--font-montserrat)",
          fontWeight: 700,
          fontSize: "36px",
          lineHeight: "48px",
          color: "#FFFFFF",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}
