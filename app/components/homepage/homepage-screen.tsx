import SiteHeader from "./site-header";
import HeroSection from "./hero-section";
import RootFurtherContent from "./root-further-content";
import AwardsSection from "./awards-section";
import KudosSection from "./kudos-section";
import SiteFooter from "./site-footer";
import Fab from "./fab";

// HomepageScreen — full page composition.
// Integration phase 07 mounts this at `/` and passes live props.
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
      {/* Sticky header */}
      <SiteHeader />

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

      {/* Footer */}
      <SiteFooter />

      {/* Floating action button */}
      <Fab />
    </div>
  );
}
