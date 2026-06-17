import CountdownUnit from "./countdown-unit";

interface CountdownDisplayProps {
  days: number;
  hours: number;
  minutes: number;
}

export default function CountdownDisplay({
  days,
  hours,
  minutes,
}: CountdownDisplayProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
      }}
    >
      {/* Title */}
      <h1
        style={{
          fontFamily: "var(--font-montserrat)",
          fontWeight: 700,
          fontSize: "36px",
          lineHeight: "48px",
          color: "#FFFFFF",
          textAlign: "center",
          margin: 0,
        }}
      >
        Sự kiện sẽ bắt đầu sau
      </h1>

      {/* Units row */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "60px",
          alignItems: "flex-start",
        }}
      >
        <CountdownUnit value={days} label="DAYS" />
        <CountdownUnit value={hours} label="HOURS" />
        <CountdownUnit value={minutes} label="MINUTES" />
      </div>
    </div>
  );
}
