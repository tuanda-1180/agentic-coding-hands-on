"use client";

import { useEffect, useState } from "react";

export interface CountdownValues {
  /** Whole days remaining. 0 when less than one day is left (per spec). */
  days: number;
  /** Hours component, always 0–23. */
  hours: number;
  /** Minutes component, always 0–59. */
  minutes: number;
}

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 60 * 60;
const SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR;

const ZERO: CountdownValues = { days: 0, hours: 0, minutes: 0 };

/**
 * Pure computation of remaining days/hours/minutes between two epoch-millis values.
 *
 * Behavior (from specs + test cases):
 * - Remaining is clamped at 0 — once `targetMs <= nowMs` every unit reads 0 (freeze on complete).
 * - days = floor(total / 1 day); shows 0 when < 1 day remains.
 * - hours is always within 0–23, minutes within 0–59 (no overflow possible from a real countdown).
 *
 * Exported for unit testing without timers.
 */
export function computeCountdown(targetMs: number, nowMs: number): CountdownValues {
  if (!Number.isFinite(targetMs) || !Number.isFinite(nowMs)) return ZERO;

  const totalSeconds = Math.max(0, Math.floor((targetMs - nowMs) / 1000));
  return {
    days: Math.floor(totalSeconds / SECONDS_PER_DAY),
    hours: Math.floor((totalSeconds % SECONDS_PER_DAY) / SECONDS_PER_HOUR),
    minutes: Math.floor((totalSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE),
  };
}

/**
 * Live countdown to `target`, re-evaluated every second.
 *
 * SSR-safe: starts at 00/00/00 on the server and on first client render, then recomputes
 * after mount — avoiding a hydration mismatch. The 1s tick (even though seconds aren't
 * displayed) keeps minute rollovers prompt.
 */
export function useCountdown(target: Date): CountdownValues {
  const targetMs = target.getTime();
  const [values, setValues] = useState<CountdownValues>(ZERO);

  useEffect(() => {
    const tick = () => setValues(computeCountdown(targetMs, Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  return values;
}
