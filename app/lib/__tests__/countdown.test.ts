import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  computeCountdown,
  CountdownValues,
} from "../use-countdown";
import {
  parseLaunchDate,
  getLaunchDate,
  DEFAULT_LAUNCH_DATE,
} from "../countdown-config";

describe("computeCountdown", () => {
  describe("happy path: normal countdowns", () => {
    it("computes 2 days 3 hours 30 minutes remaining", () => {
      const now = 0;
      const target = (2 * 24 * 60 * 60 + 3 * 60 * 60 + 30 * 60) * 1000;
      const result = computeCountdown(target, now);
      expect(result).toEqual({ days: 2, hours: 3, minutes: 30 });
    });

    it("computes 1 day 0 hours 0 minutes exactly", () => {
      const now = 0;
      const target = 1 * 24 * 60 * 60 * 1000;
      const result = computeCountdown(target, now);
      expect(result).toEqual({ days: 1, hours: 0, minutes: 0 });
    });

    it("computes 23 hours 59 minutes with 0 days", () => {
      const now = 0;
      const target = (23 * 60 * 60 + 59 * 60) * 1000;
      const result = computeCountdown(target, now);
      expect(result).toEqual({ days: 0, hours: 23, minutes: 59 });
    });

    it("computes less than 1 day (0 days) remaining", () => {
      const now = 0;
      const target = (12 * 60 * 60 + 30 * 60) * 1000; // 12.5 hours
      const result = computeCountdown(target, now);
      expect(result).toEqual({ days: 0, hours: 12, minutes: 30 });
    });

    it("computes exactly at target time (all zeros)", () => {
      const now = 1000000;
      const target = 1000000;
      const result = computeCountdown(target, now);
      expect(result).toEqual({ days: 0, hours: 0, minutes: 0 });
    });
  });

  describe("edge cases: past target", () => {
    it("returns all zeros when target is in the past", () => {
      const now = 2000000;
      const target = 1000000; // past
      const result = computeCountdown(target, now);
      expect(result).toEqual({ days: 0, hours: 0, minutes: 0 });
    });

    it("freezes at zero (does not go negative)", () => {
      const now = 5000000;
      const target = 1000000; // far past
      const result = computeCountdown(target, now);
      expect(result).toEqual({ days: 0, hours: 0, minutes: 0 });
    });
  });

  describe("boundary: component ranges", () => {
    it("hours stays within 0-23 range", () => {
      const now = 0;
      const target = (25 * 60 * 60) * 1000; // 25 hours
      const result = computeCountdown(target, now);
      expect(result.hours).toBeLessThanOrEqual(23);
      expect(result.hours).toBeGreaterThanOrEqual(0);
      expect(result.days).toBe(1);
      expect(result.hours).toBe(1);
    });

    it("minutes stays within 0-59 range", () => {
      const now = 0;
      const target = (2 * 60 * 60 + 90 * 60) * 1000; // 2h + 90m
      const result = computeCountdown(target, now);
      expect(result.minutes).toBeLessThanOrEqual(59);
      expect(result.minutes).toBeGreaterThanOrEqual(0);
      expect(result.hours).toBe(3);
      expect(result.minutes).toBe(30);
    });

    it("handles exactly 1 day", () => {
      const now = 0;
      const target = 24 * 60 * 60 * 1000;
      const result = computeCountdown(target, now);
      expect(result).toEqual({ days: 1, hours: 0, minutes: 0 });
    });

    it("handles 59 minutes 59 seconds (just under 1 hour)", () => {
      const now = 0;
      const target = (59 * 60 + 59) * 1000;
      const result = computeCountdown(target, now);
      expect(result).toEqual({ days: 0, hours: 0, minutes: 59 });
    });
  });

  describe("error handling: invalid inputs", () => {
    it("returns zeros for NaN targetMs", () => {
      const result = computeCountdown(NaN, 1000000);
      expect(result).toEqual({ days: 0, hours: 0, minutes: 0 });
    });

    it("returns zeros for NaN nowMs", () => {
      const result = computeCountdown(1000000, NaN);
      expect(result).toEqual({ days: 0, hours: 0, minutes: 0 });
    });

    it("returns zeros for Infinity targetMs", () => {
      const result = computeCountdown(Infinity, 1000000);
      expect(result).toEqual({ days: 0, hours: 0, minutes: 0 });
    });

    it("returns zeros for -Infinity targetMs", () => {
      const result = computeCountdown(-Infinity, 1000000);
      expect(result).toEqual({ days: 0, hours: 0, minutes: 0 });
    });

    it("returns zeros for Infinity nowMs", () => {
      const result = computeCountdown(1000000, Infinity);
      expect(result).toEqual({ days: 0, hours: 0, minutes: 0 });
    });

    it("returns zeros for -Infinity nowMs", () => {
      const result = computeCountdown(1000000, -Infinity);
      expect(result).toEqual({ days: 0, hours: 0, minutes: 0 });
    });
  });

  describe("large values and precision", () => {
    it("handles very large future times (1 year ahead)", () => {
      const now = 0;
      const target = 365 * 24 * 60 * 60 * 1000;
      const result = computeCountdown(target, now);
      expect(result.days).toBe(365);
      expect(result.hours).toBe(0);
      expect(result.minutes).toBe(0);
    });

    it("handles fractional seconds (rounds down to nearest minute)", () => {
      const now = 0;
      const target = (1 * 60 + 30.9) * 1000; // 1.5 min with fractional part
      const result = computeCountdown(target, now);
      expect(result).toEqual({ days: 0, hours: 0, minutes: 1 });
    });

    it("correctly floors seconds component (ignores subsecond precision)", () => {
      const now = 0;
      const target = (2 * 60 * 60 + 3 * 60 + 45.7) * 1000; // 2h 3m 45.7s
      const result = computeCountdown(target, now);
      expect(result).toEqual({ days: 0, hours: 2, minutes: 3 });
    });
  });

  describe("return type consistency", () => {
    it("always returns CountdownValues shape", () => {
      const result = computeCountdown(1000000, 0);
      expect(result).toHaveProperty("days");
      expect(result).toHaveProperty("hours");
      expect(result).toHaveProperty("minutes");
      expect(typeof result.days).toBe("number");
      expect(typeof result.hours).toBe("number");
      expect(typeof result.minutes).toBe("number");
    });

    it("all values are integers (never floats)", () => {
      const result = computeCountdown(
        (3 * 24 * 60 * 60 + 15 * 60 * 60 + 45 * 60 + 30) * 1000,
        0
      );
      expect(Number.isInteger(result.days)).toBe(true);
      expect(Number.isInteger(result.hours)).toBe(true);
      expect(Number.isInteger(result.minutes)).toBe(true);
    });
  });
});

describe("parseLaunchDate", () => {
  describe("valid inputs", () => {
    it("parses valid ISO 8601 string", () => {
      const raw = "2026-12-31T00:00:00+07:00";
      const result = parseLaunchDate(raw);
      expect(result).not.toBeNull();
      expect(result instanceof Date).toBe(true);
      expect(result?.getFullYear()).toBe(2026);
    });

    it("parses valid ISO date with Z timezone", () => {
      const raw = "2026-06-15T10:30:00Z";
      const result = parseLaunchDate(raw);
      expect(result).not.toBeNull();
      expect(result instanceof Date).toBe(true);
      expect(result?.getFullYear()).toBe(2026);
    });

    it("parses valid ISO date without timezone", () => {
      const raw = "2026-12-31T23:59:59";
      const result = parseLaunchDate(raw);
      expect(result).not.toBeNull();
      expect(result instanceof Date).toBe(true);
    });
  });

  describe("invalid inputs", () => {
    it("returns null for undefined", () => {
      const result = parseLaunchDate(undefined);
      expect(result).toBeNull();
    });

    it("returns null for null", () => {
      const result = parseLaunchDate(null);
      expect(result).toBeNull();
    });

    it("returns null for empty string", () => {
      const result = parseLaunchDate("");
      expect(result).toBeNull();
    });

    it("returns null for garbage string", () => {
      const result = parseLaunchDate("not a date at all");
      expect(result).toBeNull();
    });

    it("returns null for malformed ISO string (invalid date)", () => {
      const result = parseLaunchDate("2026-13-45T25:70:80"); // invalid month/day/time
      expect(result).toBeNull();
    });

    it("returns null for random characters", () => {
      const result = parseLaunchDate("abc123xyz");
      expect(result).toBeNull();
    });

    it("returns null for whitespace-only string", () => {
      const result = parseLaunchDate("   ");
      expect(result).toBeNull();
    });
  });
});

describe("getLaunchDate", () => {
  const originalEnv = process.env.NEXT_PUBLIC_LAUNCH_DATE;

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_LAUNCH_DATE;
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.NEXT_PUBLIC_LAUNCH_DATE = originalEnv;
    } else {
      delete process.env.NEXT_PUBLIC_LAUNCH_DATE;
    }
  });

  it("returns a Date object", () => {
    const result = getLaunchDate();
    expect(result instanceof Date).toBe(true);
  });

  it("returns DEFAULT_LAUNCH_DATE when env var is not set", () => {
    const result = getLaunchDate();
    const defaultDate = new Date(DEFAULT_LAUNCH_DATE);
    expect(result.getTime()).toBe(defaultDate.getTime());
  });

  it("uses NEXT_PUBLIC_LAUNCH_DATE when valid env var is set", () => {
    const customDate = "2027-06-15T12:30:00Z";
    process.env.NEXT_PUBLIC_LAUNCH_DATE = customDate;
    const result = getLaunchDate();
    const expected = new Date(customDate);
    expect(result.getTime()).toBe(expected.getTime());
  });

  it("falls back to DEFAULT_LAUNCH_DATE when env var is invalid", () => {
    process.env.NEXT_PUBLIC_LAUNCH_DATE = "invalid-date-string";
    const result = getLaunchDate();
    const defaultDate = new Date(DEFAULT_LAUNCH_DATE);
    expect(result.getTime()).toBe(defaultDate.getTime());
  });

  it("falls back to DEFAULT_LAUNCH_DATE when env var is empty string", () => {
    process.env.NEXT_PUBLIC_LAUNCH_DATE = "";
    const result = getLaunchDate();
    const defaultDate = new Date(DEFAULT_LAUNCH_DATE);
    expect(result.getTime()).toBe(defaultDate.getTime());
  });

  it("always returns a valid, non-NaN Date", () => {
    const result = getLaunchDate();
    expect(!Number.isNaN(result.getTime())).toBe(true);
  });
});

describe("integration: computeCountdown + getLaunchDate", () => {
  it("can compute countdown to configured launch date", () => {
    const launchDate = getLaunchDate();
    const now = Date.now();
    const result = computeCountdown(launchDate.getTime(), now);
    // Default launch date is in the future (2026-12-31), so should have positive values
    expect(result).toHaveProperty("days");
    expect(result).toHaveProperty("hours");
    expect(result).toHaveProperty("minutes");
    expect(typeof result.days).toBe("number");
    expect(typeof result.hours).toBe("number");
    expect(typeof result.minutes).toBe("number");
  });
});
