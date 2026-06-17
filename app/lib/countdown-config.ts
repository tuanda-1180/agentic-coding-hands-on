// Launch-date configuration for the prelaunch countdown.
//
// Source of truth: NEXT_PUBLIC_LAUNCH_DATE (ISO 8601, e.g. "2026-12-31T00:00:00+07:00").
// Per clarifications.md: env-driven so the launch moment can change per deploy with no code edit.
// If the env var is missing or unparseable, we fall back to a fixed default so the page still
// renders a meaningful countdown instead of crashing.

// Default launch moment used when NEXT_PUBLIC_LAUNCH_DATE is absent or invalid.
// Kept within ~99 days of "now" so the fallback renders inside the design's two-digit
// DAYS display (the screen has exactly two LED boxes per unit). Real deployments set
// NEXT_PUBLIC_LAUNCH_DATE explicitly.
export const DEFAULT_LAUNCH_DATE = "2026-08-31T00:00:00+07:00";

/**
 * Resolve the configured launch date as a Date.
 * Returns a valid Date; falls back to DEFAULT_LAUNCH_DATE on missing/invalid input.
 */
export function getLaunchDate(): Date {
  const raw = process.env.NEXT_PUBLIC_LAUNCH_DATE;
  const parsed = parseLaunchDate(raw);
  return parsed ?? new Date(DEFAULT_LAUNCH_DATE);
}

/**
 * Parse a raw ISO 8601 string into a Date, or null if absent/invalid.
 * Exported for unit testing.
 */
export function parseLaunchDate(raw: string | undefined | null): Date | null {
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}
