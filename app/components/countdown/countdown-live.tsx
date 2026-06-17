"use client";

import CountdownDisplay from "./countdown-display";
import { getLaunchDate } from "../../lib/countdown-config";
import { useCountdown } from "../../lib/use-countdown";

// Build-time constant (NEXT_PUBLIC_* is inlined), so resolve it once at module load.
const LAUNCH_DATE = getLaunchDate();

/**
 * Client integration seam: drives CountdownDisplay with live, ticking values
 * counting down to the configured launch date. Freezes at 00/00/00 on completion.
 */
export default function CountdownLive() {
  const { days, hours, minutes } = useCountdown(LAUNCH_DATE);
  return <CountdownDisplay days={days} hours={hours} minutes={minutes} />;
}
