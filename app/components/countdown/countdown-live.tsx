"use client";

import { useState } from "react";
import CountdownDisplay from "./countdown-display";
import { getCountdownTarget } from "../../lib/countdown-config";
import { useCountdown } from "../../lib/use-countdown";

/**
 * Client integration seam: drives CountdownDisplay with live, ticking values.
 * Counts down to NEXT_PUBLIC_LAUNCH_DATE when set, otherwise a short relative
 * countdown from mount (COUNTDOWN_DURATION_SECONDS). Freezes at zero on completion.
 */
export default function CountdownLive() {
  // Pin the target to mount time so the relative countdown starts fresh on each load.
  const [target] = useState(() => getCountdownTarget());
  const { days, hours, minutes, seconds } = useCountdown(target);
  return (
    <CountdownDisplay
      days={days}
      hours={hours}
      minutes={minutes}
      seconds={seconds}
    />
  );
}
