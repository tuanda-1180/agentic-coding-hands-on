// Secret Box badge catalog + weighted random selection.
// Pure & framework-free so it is safe to import from both the server (open
// mutation) and client (modal rendering). No DB, no Math.random at module load.

export interface Badge {
  /** Stable id persisted in secret_boxes.prize. */
  id: string;
  /** i18n key under `secretBox.badges.<id>` for the display name. */
  nameKey: string;
  /** Selection weight as a percentage. The set MUST sum to 100. */
  weight: number;
  /** Placeholder asset path. Real PNGs dropped into public/saa/badges/ later. */
  asset: string;
}

/** Shown when prize id is invalid/corrupt or its asset fails to load (TC: fallback). */
export const FALLBACK_BADGE_ASSET = "/saa/badges/_fallback.png";

// Probabilities per spec item C (sum = 100).
export const BADGES: readonly Badge[] = [
  { id: "stay_gold", nameKey: "badges.stay_gold", weight: 30, asset: "/saa/badges/stay_gold.png" },
  { id: "flow_to_horizon", nameKey: "badges.flow_to_horizon", weight: 25, asset: "/saa/badges/flow_to_horizon.png" },
  { id: "touch_of_light", nameKey: "badges.touch_of_light", weight: 20, asset: "/saa/badges/touch_of_light.png" },
  { id: "beyond_the_boundary", nameKey: "badges.beyond_the_boundary", weight: 10, asset: "/saa/badges/beyond_the_boundary.png" },
  { id: "revival", nameKey: "badges.revival", weight: 10, asset: "/saa/badges/revival.png" },
  { id: "root_further", nameKey: "badges.root_further", weight: 5, asset: "/saa/badges/root_further.png" },
];

/** Total weight — exported so a test can assert the catalog sums to 100. */
export const TOTAL_WEIGHT = BADGES.reduce((sum, b) => sum + b.weight, 0);

/**
 * Pick one badge by weight. `rand` is injectable (defaults to Math.random) so
 * distribution can be tested deterministically. Always returns a valid badge.
 */
export function pickWeightedBadge(rand: () => number = Math.random): Badge {
  // Scale a [0,1) draw across the real total (defensive even if weights drift).
  let ticket = rand() * TOTAL_WEIGHT;
  for (const badge of BADGES) {
    ticket -= badge.weight;
    if (ticket < 0) return badge;
  }
  return BADGES[BADGES.length - 1]; // float-rounding safety net
}

/** Resolve a persisted prize id to a badge; null when unknown/corrupt. */
export function getBadge(id: string | null | undefined): Badge | null {
  if (!id) return null;
  return BADGES.find((b) => b.id === id) ?? null;
}
