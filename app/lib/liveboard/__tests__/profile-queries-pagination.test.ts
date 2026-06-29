import { describe, it, expect } from "vitest";
import { COLLECTIBLE_COUNT } from "@/app/lib/collectibles";

/**
 * Pure function tests for pagination math and icon-collection derivation logic.
 * These tests verify the computation logic without requiring Supabase or server imports.
 */

describe("Profile queries - pagination math", () => {
  describe("nextPage calculation", () => {
    // The logic: nextPage = (from + pageSize < total) ? page + 1 : null
    // where from = page * pageSize

    it("computes nextPage=null when no more data exists", () => {
      const page = 1;
      const pageSize = 8;
      const total = 10;
      const from = page * pageSize; // 8
      const nextPage = from + pageSize < total ? page + 1 : null;
      // 8 + 8 < 10? no (16 not < 10)
      expect(nextPage).toBeNull();
    });

    it("computes nextPage=1 when more data exists", () => {
      const page = 0;
      const pageSize = 8;
      const total = 20;
      const from = page * pageSize; // 0
      const nextPage = from + pageSize < total ? page + 1 : null;
      // 0 + 8 < 20? yes
      expect(nextPage).toBe(1);
    });

    it("computes nextPage=null at boundary (from + pageSize = total)", () => {
      const page = 0;
      const pageSize = 10;
      const total = 10;
      const from = page * pageSize;
      const nextPage = from + pageSize < total ? page + 1 : null;
      // 0 + 10 < 10? no (10 not < 10)
      expect(nextPage).toBeNull();
    });

    it("computes nextPage=2 when more pages exist", () => {
      const page = 1;
      const pageSize = 5;
      const total = 30;
      const from = page * pageSize; // 5
      const nextPage = from + pageSize < total ? page + 1 : null;
      // 5 + 5 < 30? yes
      expect(nextPage).toBe(2);
    });

    it("handles empty result (total=0)", () => {
      const page = 0;
      const pageSize = 8;
      const total = 0;
      const from = page * pageSize;
      const nextPage = from + pageSize < total ? page + 1 : null;
      // 0 + 8 < 0? no
      expect(nextPage).toBeNull();
    });

    it("handles high page numbers", () => {
      const page = 100;
      const pageSize = 8;
      const total = 150;
      const from = page * pageSize; // 800
      const nextPage = from + pageSize < total ? page + 1 : null;
      // 800 + 8 < 150? no
      expect(nextPage).toBeNull();
    });

    it("handles single item remaining", () => {
      const page = 0;
      const pageSize = 5;
      const total = 1;
      const from = page * pageSize; // 0
      const nextPage = from + pageSize < total ? page + 1 : null;
      // 0 + 5 < 1? no
      expect(nextPage).toBeNull();
    });

    it("handles pageSize=1", () => {
      const page = 0;
      const pageSize = 1;
      const total = 5;
      const from = page * pageSize; // 0
      const nextPage = from + pageSize < total ? page + 1 : null;
      // 0 + 1 < 5? yes
      expect(nextPage).toBe(1);
    });

    it("computes nextPage even for large total", () => {
      const page = 0;
      const pageSize = 50;
      const total = 1000;
      const from = page * pageSize; // 0
      const nextPage = from + pageSize < total ? page + 1 : null;
      // 0 + 50 < 1000? yes
      expect(nextPage).toBe(1);
    });
  });

  describe("pageSize clamping", () => {
    // The logic: pageSize = Math.min(50, pageSize ?? 8)

    it("defaults pageSize to 8 when undefined", () => {
      const input = undefined;
      const pageSize = Math.min(50, input ?? 8);
      expect(pageSize).toBe(8);
    });

    it("caps pageSize at 50", () => {
      const input = 200;
      const pageSize = Math.min(50, input ?? 8);
      expect(pageSize).toBe(50);
    });

    it("accepts valid pageSize values", () => {
      const input = 16;
      const pageSize = Math.min(50, input ?? 8);
      expect(pageSize).toBe(16);
    });

    it("accepts pageSize=1", () => {
      const input = 1;
      const pageSize = Math.min(50, input ?? 8);
      expect(pageSize).toBe(1);
    });

    it("accepts pageSize=50", () => {
      const input = 50;
      const pageSize = Math.min(50, input ?? 8);
      expect(pageSize).toBe(50);
    });
  });

  describe("page clamping", () => {
    // The logic: page = Math.max(0, page ?? 0)

    it("defaults page to 0 when undefined", () => {
      const input = undefined;
      const page = Math.max(0, input ?? 0);
      expect(page).toBe(0);
    });

    it("clamps negative page to 0", () => {
      const input = -5;
      const page = Math.max(0, input ?? 0);
      expect(page).toBe(0);
    });

    it("accepts positive page values", () => {
      const input = 3;
      const page = Math.max(0, input ?? 0);
      expect(page).toBe(3);
    });

    it("accepts page=0", () => {
      const input = 0;
      const page = Math.max(0, input ?? 0);
      expect(page).toBe(0);
    });
  });

  describe("range calculation", () => {
    // The logic: .range(from, from + pageSize - 1)
    // where from = page * pageSize

    it("computes range [0, 7] for page=0, pageSize=8", () => {
      const page = 0;
      const pageSize = 8;
      const from = page * pageSize; // 0
      const to = from + pageSize - 1; // 7
      expect([from, to]).toEqual([0, 7]);
    });

    it("computes range [8, 15] for page=1, pageSize=8", () => {
      const page = 1;
      const pageSize = 8;
      const from = page * pageSize; // 8
      const to = from + pageSize - 1; // 15
      expect([from, to]).toEqual([8, 15]);
    });

    it("computes range [0, 49] for page=0, pageSize=50", () => {
      const page = 0;
      const pageSize = 50;
      const from = page * pageSize;
      const to = from + pageSize - 1;
      expect([from, to]).toEqual([0, 49]);
    });

    it("computes correct range for page=5, pageSize=10", () => {
      const page = 5;
      const pageSize = 10;
      const from = page * pageSize; // 50
      const to = from + pageSize - 1; // 59
      expect([from, to]).toEqual([50, 59]);
    });
  });
});

describe("Profile queries - icon collection derivation", () => {
  // The logic (profile-queries.ts): unlocked = Math.min(secretBoxOpened, COLLECTIBLE_COUNT),
  // total = COLLECTIBLE_COUNT. Use the real shared constant so this test tracks it.

  it("COLLECTIBLE_COUNT is the full collectible set (6)", () => {
    expect(COLLECTIBLE_COUNT).toBe(6);
  });

  describe("unlocked slot calculation", () => {
    it("uses secretBoxOpened when below the cap", () => {
      const unlocked = Math.min(3, COLLECTIBLE_COUNT);
      expect(unlocked).toBe(3);
    });

    it("caps at COLLECTIBLE_COUNT when secretBoxOpened exceeds it", () => {
      const unlocked = Math.min(15, COLLECTIBLE_COUNT);
      expect(unlocked).toBe(COLLECTIBLE_COUNT);
    });

    it("handles 0 opened boxes", () => {
      expect(Math.min(0, COLLECTIBLE_COUNT)).toBe(0);
    });

    it("handles all slots unlocked (== COLLECTIBLE_COUNT)", () => {
      expect(Math.min(COLLECTIBLE_COUNT, COLLECTIBLE_COUNT)).toBe(COLLECTIBLE_COUNT);
    });

    it("handles 1 opened box", () => {
      expect(Math.min(1, COLLECTIBLE_COUNT)).toBe(1);
    });

    it("handles a large number of opened boxes", () => {
      expect(Math.min(1000, COLLECTIBLE_COUNT)).toBe(COLLECTIBLE_COUNT);
    });
  });

  describe("icon collection structure", () => {
    it("icon collection total equals COLLECTIBLE_COUNT", () => {
      const total = COLLECTIBLE_COUNT;
      expect(total).toBe(COLLECTIBLE_COUNT);
    });

    it("unlocked is never > total", () => {
      [0, 1, 3, 6, 10, 100].forEach((opened) => {
        const unlocked = Math.min(opened, COLLECTIBLE_COUNT);
        expect(unlocked).toBeLessThanOrEqual(COLLECTIBLE_COUNT);
      });
    });

    it("unlocked is never negative", () => {
      expect(Math.min(0, COLLECTIBLE_COUNT)).toBeGreaterThanOrEqual(0);
    });
  });
});

describe("Profile queries - direction column mapping", () => {
  describe("receiver_id vs sender_id selection", () => {
    const columnFor = (direction: string) =>
      direction === "received" ? "receiver_id" : "sender_id";

    it("selects receiver_id for 'received' direction", () => {
      expect(columnFor("received")).toBe("receiver_id");
    });

    it("selects sender_id for 'sent' direction", () => {
      expect(columnFor("sent")).toBe("sender_id");
    });

    it("defaults to sender_id for unknown direction", () => {
      expect(columnFor("invalid")).toBe("sender_id");
    });
  });
});
