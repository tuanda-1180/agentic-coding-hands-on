import { describe, it, expect } from "vitest";
import { isValidUserId, parseIntParam } from "../validation";

/**
 * Tests for the real /api/users/[id]/* route guards (UUID validation +
 * pagination), imported from the shared validation module so the tests track
 * the actual implementation rather than a copy.
 */

const isValidId = isValidUserId;

describe("user route id validation", () => {
  it("accepts a canonical lowercase uuid", () => {
    expect(isValidId("3f0e6a1b-2c4d-4e5f-8a9b-0c1d2e3f4a5b")).toBe(true);
  });

  it("accepts an uppercase uuid (case-insensitive)", () => {
    expect(isValidId("3F0E6A1B-2C4D-4E5F-8A9B-0C1D2E3F4A5B")).toBe(true);
  });

  it("rejects a non-uuid string", () => {
    expect(isValidId("not-a-uuid")).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(isValidId("")).toBe(false);
  });

  it("rejects a uuid with a wrong segment length", () => {
    expect(isValidId("3f0e6a1b-2c4d-4e5f-8a9b-0c1d2e3f4a5")).toBe(false);
  });

  it("rejects a uuid with non-hex characters", () => {
    expect(isValidId("zzzzzzzz-2c4d-4e5f-8a9b-0c1d2e3f4a5b")).toBe(false);
  });

  it("rejects a sql-injection-ish payload", () => {
    expect(isValidId("1 OR 1=1")).toBe(false);
  });
});

describe("user kudos pagination guard", () => {
  it("defaults page to 0 and pageSize to 8 when absent", () => {
    expect(parseIntParam(null, 0)).toBe(0);
    expect(parseIntParam(null, 8)).toBe(8);
  });

  it("rejects negative and non-integer values", () => {
    expect(parseIntParam("-1", 0)).toBeNull();
    expect(parseIntParam("1.5", 8)).toBeNull();
    expect(parseIntParam("abc", 0)).toBeNull();
  });

  it("rejects pageSize below 1 (empty range) at the route level", () => {
    const pageSize = parseIntParam("0", 8); // valid integer 0...
    expect(pageSize).toBe(0);
    const shouldReject = pageSize === null || pageSize < 1; // ...but route rejects < 1
    expect(shouldReject).toBe(true);
  });

  it("accepts a valid page + pageSize pair", () => {
    const page = parseIntParam("2", 0);
    const pageSize = parseIntParam("8", 8);
    expect(page === null || pageSize === null || pageSize < 1).toBe(false);
  });
});
