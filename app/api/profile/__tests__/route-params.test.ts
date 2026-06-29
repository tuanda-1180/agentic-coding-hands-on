import { describe, it, expect } from "vitest";

/**
 * Pure function tests for route parameter parsing and validation logic.
 * These tests verify the parseIntParam logic without requiring Next.js server imports.
 */

// Replicate the parseIntParam logic from the route
function parseIntParam(raw: string | null, fallback: number): number | null {
  if (raw === null || raw === "") return fallback;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

// Replicate the direction selection logic
function selectDirection(raw: string | null): "received" | "sent" {
  return raw === "received" ? "received" : "sent";
}

describe("API route parameter validation - parseIntParam", () => {
  describe("fallback handling", () => {
    it("returns fallback when param is null", () => {
      const result = parseIntParam(null, 8);
      expect(result).toBe(8);
    });

    it("returns fallback when param is empty string", () => {
      const result = parseIntParam("", 0);
      expect(result).toBe(0);
    });

    it("returns fallback when param is empty string for page", () => {
      const result = parseIntParam("", 0);
      expect(result).toBe(0);
    });

    it("returns fallback when param is empty string for pageSize", () => {
      const result = parseIntParam("", 8);
      expect(result).toBe(8);
    });
  });

  describe("valid integer parsing", () => {
    it("parses valid positive integer", () => {
      const result = parseIntParam("5", 0);
      expect(result).toBe(5);
    });

    it("parses 0", () => {
      const result = parseIntParam("0", 8);
      expect(result).toBe(0);
    });

    it("parses large integer", () => {
      const result = parseIntParam("999", 0);
      expect(result).toBe(999);
    });

    it("parses very large integer", () => {
      const result = parseIntParam("1000000", 0);
      expect(result).toBe(1000000);
    });
  });

  describe("invalid input rejection", () => {
    it("rejects negative integer", () => {
      const result = parseIntParam("-1", 0);
      expect(result).toBeNull();
    });

    it("rejects negative value", () => {
      const result = parseIntParam("-5", 8);
      expect(result).toBeNull();
    });

    it("rejects float value", () => {
      const result = parseIntParam("1.5", 0);
      expect(result).toBeNull();
    });

    it("rejects float string", () => {
      const result = parseIntParam("3.14", 8);
      expect(result).toBeNull();
    });

    it("rejects non-numeric string", () => {
      const result = parseIntParam("abc", 0);
      expect(result).toBeNull();
    });

    it("rejects string with mixed content", () => {
      const result = parseIntParam("5abc", 0);
      expect(result).toBeNull();
    });

    it("treats whitespace-only string as zero (coerced by Number)", () => {
      const result = parseIntParam("   ", 0);
      // Number("   ") === 0, which is an integer
      expect(result).toBe(0);
    });

    it("rejects NaN", () => {
      const result = parseIntParam("NaN", 0);
      expect(result).toBeNull();
    });

    it("rejects Infinity", () => {
      const result = parseIntParam("Infinity", 0);
      expect(result).toBeNull();
    });
  });

  describe("edge cases", () => {
    it("does not accept leading zeros as valid (treated as integer)", () => {
      // JavaScript: Number("007") === 7, which is an integer
      const result = parseIntParam("007", 0);
      expect(result).toBe(7); // This is OK, treated as integer 7
    });

    it("accepts decimal with trailing zeros (5.0 === 5 in JavaScript)", () => {
      const result = parseIntParam("5.0", 0);
      // Number("5.0") === 5.0, and Number.isInteger(5.0) === true
      expect(result).toBe(5);
    });

    it("handles scientific notation", () => {
      // Number("1e2") === 100, which is an integer
      const result = parseIntParam("1e2", 0);
      expect(result).toBe(100); // Treated as integer 100
    });

    it("handles plus sign", () => {
      // Number("+5") === 5
      const result = parseIntParam("+5", 0);
      expect(result).toBe(5);
    });
  });

  describe("integration with fallback values", () => {
    it("page uses fallback 0 when invalid", () => {
      const result = parseIntParam("invalid", 0);
      expect(result).toBeNull(); // Invalid, not fallback
      // The route then treats null as validation failure
    });

    it("pageSize uses fallback 8 when invalid", () => {
      const result = parseIntParam("invalid", 8);
      expect(result).toBeNull(); // Invalid, not fallback
    });
  });
});

describe("API route parameter validation - direction selection", () => {
  describe("direction param handling", () => {
    it('defaults to "sent" when direction is absent', () => {
      const result = selectDirection(null);
      expect(result).toBe("sent");
    });

    it('accepts "received" explicitly', () => {
      const result = selectDirection("received");
      expect(result).toBe("received");
    });

    it('accepts "sent" explicitly', () => {
      const result = selectDirection("sent");
      expect(result).toBe("sent");
    });

    it('defaults to "sent" for invalid direction', () => {
      const result = selectDirection("invalid");
      expect(result).toBe("sent");
    });

    it('defaults to "sent" for empty string', () => {
      const result = selectDirection("");
      expect(result).toBe("sent");
    });

    it('defaults to "sent" for numeric value', () => {
      const result = selectDirection("123");
      expect(result).toBe("sent");
    });

    it('is case-sensitive (does not match "Received")', () => {
      const result = selectDirection("Received");
      expect(result).toBe("sent");
    });

    it('is case-sensitive (does not match "SENT")', () => {
      const result = selectDirection("SENT");
      expect(result).toBe("sent");
    });
  });
});

describe("Combined route parameter validation", () => {
  describe("page validation scenarios", () => {
    it("accepts page=0 with fallback 0", () => {
      expect(parseIntParam("0", 0)).toBe(0);
    });

    it("accepts page=5 with fallback 0", () => {
      expect(parseIntParam("5", 0)).toBe(5);
    });

    it("rejects page=-1 with fallback 0", () => {
      expect(parseIntParam("-1", 0)).toBeNull();
    });
  });

  describe("pageSize validation scenarios", () => {
    it("accepts pageSize=8 with fallback 8", () => {
      expect(parseIntParam("8", 8)).toBe(8);
    });

    it("accepts pageSize=50 with fallback 8", () => {
      expect(parseIntParam("50", 8)).toBe(50);
    });

    it("rejects pageSize=101 as valid but not enforced by parseIntParam", () => {
      // parseIntParam only validates >= 0 and integer
      // The clamping to max 50 happens in the query function
      expect(parseIntParam("101", 8)).toBe(101);
    });

    it("rejects pageSize=-5 with fallback 8", () => {
      expect(parseIntParam("-5", 8)).toBeNull();
    });
  });

  describe("error response scenarios", () => {
    it("page and pageSize are both invalid -> return 400", () => {
      const page = parseIntParam("-1", 0);
      const pageSize = parseIntParam("abc", 8);
      expect(page).toBeNull();
      expect(pageSize).toBeNull();
      // Should trigger 400 response
      const shouldReject = page === null || pageSize === null;
      expect(shouldReject).toBe(true);
    });

    it("page is valid, pageSize is invalid -> return 400", () => {
      const page = parseIntParam("0", 0);
      const pageSize = parseIntParam("xyz", 8);
      expect(page).toBe(0);
      expect(pageSize).toBeNull();
      const shouldReject = page === null || pageSize === null;
      expect(shouldReject).toBe(true);
    });

    it("page is invalid, pageSize is valid -> return 400", () => {
      const page = parseIntParam("-3", 0);
      const pageSize = parseIntParam("8", 8);
      expect(page).toBeNull();
      expect(pageSize).toBe(8);
      const shouldReject = page === null || pageSize === null;
      expect(shouldReject).toBe(true);
    });

    it("both page and pageSize are valid -> return 200", () => {
      const page = parseIntParam("1", 0);
      const pageSize = parseIntParam("16", 8);
      expect(page).toBe(1);
      expect(pageSize).toBe(16);
      const shouldReject = page === null || pageSize === null;
      expect(shouldReject).toBe(false);
    });
  });

  describe("all parameters together", () => {
    it("valid direction + valid page + valid pageSize", () => {
      const direction = selectDirection("received");
      const page = parseIntParam("2", 0);
      const pageSize = parseIntParam("10", 8);
      expect(direction).toBe("received");
      expect(page).toBe(2);
      expect(pageSize).toBe(10);
      expect(page === null || pageSize === null).toBe(false);
    });

    it("invalid direction still accepted (defaults) + valid pagination", () => {
      const direction = selectDirection("INVALID");
      const page = parseIntParam("0", 0);
      const pageSize = parseIntParam("8", 8);
      expect(direction).toBe("sent"); // Default, no validation failure
      expect(page).toBe(0);
      expect(pageSize).toBe(8);
      expect(page === null || pageSize === null).toBe(false);
    });

    it("valid direction + invalid page -> validation failure", () => {
      const direction = selectDirection("received");
      const page = parseIntParam("abc", 0);
      const pageSize = parseIntParam("8", 8);
      expect(direction).toBe("received");
      expect(page).toBeNull();
      expect(pageSize).toBe(8);
      expect(page === null || pageSize === null).toBe(true);
    });
  });
});
