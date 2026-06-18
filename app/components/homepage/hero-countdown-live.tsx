"use client";

import HeroCountdown from "./hero-countdown";
import { getLaunchDate } from "../../lib/countdown-config";
import { useCountdown } from "../../lib/use-countdown";

// The hero counts down to the configured event datetime (NEXT_PUBLIC_LAUNCH_DATE,
// absolute) — NOT the short relative demo used by the standalone /countdown page.
// Resolved once at module load (NEXT_PUBLIC_* is inlined at build time).
const HERO_TARGET = getLaunchDate();

/**
 * Live hero countdown: feeds DAYS/HOURS/MINUTES (no seconds, per the homepage design)
 * into the presentational HeroCountdown, and hides "Coming soon" once the event starts.
 */
export default function HeroCountdownLive() {
  const { days, hours, minutes, isComplete } = useCountdown(HERO_TARGET);
  return (
    <HeroCountdown
      showComingSoon={!isComplete}
      units={[
        { value: days, label: "DAYS" },
        { value: hours, label: "HOURS" },
        { value: minutes, label: "MINUTES" },
      ]}
    />
  );
}
