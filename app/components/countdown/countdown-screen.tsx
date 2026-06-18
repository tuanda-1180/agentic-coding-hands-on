import Image from "next/image";
import CountdownLive from "./countdown-live";

/**
 * Full-viewport prelaunch countdown screen: background artwork, dark overlay for
 * contrast, and the live countdown centered on top. Shared by the home page (`/`)
 * and the dedicated `/countdown` route so both render identically.
 */
export default function CountdownScreen() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        backgroundColor: "#00101A",
        overflow: "hidden",
      }}
    >
      {/* Layer 1: Background image */}
      <Image
        src="/countdown-bg.png"
        alt=""
        fill
        style={{ objectFit: "cover" }}
        priority
      />

      {/* Layer 2: Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(18deg, #00101A 15.48%, rgba(0,18,29,0.46) 52.13%, rgba(0,19,32,0.00) 63.41%)",
          zIndex: 1,
        }}
      />

      {/* Layer 3: Countdown content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        <CountdownLive />
      </div>
    </div>
  );
}
