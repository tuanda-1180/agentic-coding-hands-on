import HeroSection from "./hero-section";
import RootFurtherContent from "./root-further-content";
import AwardsSection from "./awards-section";
import KudosSection from "./kudos-section";
import Fab from "./fab";

// HomepageScreen — full page composition.
// Header and footer are provided by the shared SiteChrome (app/layout.tsx).
export default function HomepageScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#00101A",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Main content */}
      <main style={{ flex: 1 }}>
        {/* Hero — full bleed with keyvisual bg */}
        <HeroSection />

        {/* Root Further description */}
        <RootFurtherContent />

        {/* Awards grid */}
        <AwardsSection />

        {/* Kudos promo block */}
        <KudosSection />
      </main>

      {/* Floating action button */}
      <Fab />
    </div>
  );
}
