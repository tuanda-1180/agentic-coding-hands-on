import { describe, it, expect } from "vitest";
import {
  BADGES,
  TOTAL_WEIGHT,
  FALLBACK_BADGE_ASSET,
  pickWeightedBadge,
  getBadge,
} from "../badges";

describe("badge catalog", () => {
  it("contains the six spec badges", () => {
    expect(BADGES.map((b) => b.id).sort()).toEqual(
      [
        "beyond_the_boundary",
        "flow_to_horizon",
        "revival",
        "root_further",
        "stay_gold",
        "touch_of_light",
      ].sort()
    );
  });

  it("weights sum to exactly 100", () => {
    expect(TOTAL_WEIGHT).toBe(100);
  });

  it("uses the spec probabilities", () => {
    const w = Object.fromEntries(BADGES.map((b) => [b.id, b.weight]));
    expect(w).toMatchObject({
      stay_gold: 30,
      flow_to_horizon: 25,
      touch_of_light: 20,
      beyond_the_boundary: 10,
      revival: 10,
      root_further: 5,
    });
  });

  it("has unique ids and non-empty assets", () => {
    expect(new Set(BADGES.map((b) => b.id)).size).toBe(BADGES.length);
    expect(BADGES.every((b) => b.asset.length > 0)).toBe(true);
  });
});

describe("pickWeightedBadge", () => {
  it("maps the bottom of the range to the first badge", () => {
    expect(pickWeightedBadge(() => 0).id).toBe("stay_gold");
  });

  it("maps the top of the range to the last badge", () => {
    // rand→~1 lands in the final bucket (root_further, the 5% tail).
    expect(pickWeightedBadge(() => 0.999999).id).toBe("root_further");
  });

  it("respects cumulative boundaries (0.30 → second badge)", () => {
    // ticket = 0.30 * 100 = 30 → exactly past stay_gold's 30 → flow_to_horizon.
    expect(pickWeightedBadge(() => 0.3).id).toBe("flow_to_horizon");
  });

  it("never returns an out-of-catalog badge across the unit interval", () => {
    const ids = new Set(BADGES.map((b) => b.id));
    for (let i = 0; i < 1000; i++) {
      expect(ids.has(pickWeightedBadge(() => i / 1000).id)).toBe(true);
    }
  });

  it("approximates the declared distribution over many draws", () => {
    // Deterministic pseudo-random sweep so the test is stable (no Math.random).
    const counts: Record<string, number> = {};
    const N = 60000;
    for (let i = 0; i < N; i++) {
      // Low-discrepancy-ish sequence covering [0,1) evenly.
      const r = (i * 0.6180339887498949) % 1;
      const b = pickWeightedBadge(() => r);
      counts[b.id] = (counts[b.id] ?? 0) + 1;
    }
    for (const badge of BADGES) {
      const pct = (counts[badge.id] ?? 0) / N * 100;
      expect(Math.abs(pct - badge.weight)).toBeLessThan(1.5);
    }
  });
});

describe("getBadge", () => {
  it("resolves a known id", () => {
    expect(getBadge("stay_gold")?.id).toBe("stay_gold");
  });

  it("returns null for unknown / corrupt / empty ids", () => {
    expect(getBadge("not_a_badge")).toBeNull();
    expect(getBadge("")).toBeNull();
    expect(getBadge(null)).toBeNull();
    expect(getBadge(undefined)).toBeNull();
  });

  it("exposes a fallback asset for invalid badge rendering", () => {
    expect(FALLBACK_BADGE_ASSET).toMatch(/\.png$/);
  });
});
