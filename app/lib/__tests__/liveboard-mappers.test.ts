import { describe, it, expect } from "vitest";
import {
  badgeForStar,
  toSunner,
  toKudos,
  type SunnerRow,
  type KudosRow,
} from "../liveboard/mappers";
import type { BadgeInfo, Sunner, KudosPost } from "../liveboard/types";

describe("badgeForStar", () => {
  describe("star tier mapping", () => {
    it("returns 'New Hero' badge for star 1", () => {
      const result = badgeForStar(1);
      expect(result).toEqual({
        label: "New Hero",
        borderColor: "#FFEA9E",
      } as BadgeInfo);
    });

    it("returns 'Rising Hero' badge for star 2", () => {
      const result = badgeForStar(2);
      expect(result).toEqual({
        label: "Rising Hero",
        borderColor: "#FFEA9E",
      } as BadgeInfo);
    });

    it("returns 'Legend Hero' badge for star 3", () => {
      const result = badgeForStar(3);
      expect(result).toEqual({
        label: "Legend Hero",
        borderColor: "#FFEA9E",
      } as BadgeInfo);
    });

    it("returns undefined for star 0", () => {
      const result = badgeForStar(0);
      expect(result).toBeUndefined();
    });

    it("returns undefined for unmapped star value (4)", () => {
      const result = badgeForStar(4);
      expect(result).toBeUndefined();
    });

    it("returns undefined for negative star", () => {
      const result = badgeForStar(-1);
      expect(result).toBeUndefined();
    });
  });

  describe("badge structure", () => {
    it("always includes borderColor when badge is returned", () => {
      const badge = badgeForStar(1);
      expect(badge).toHaveProperty("borderColor");
      expect(badge?.borderColor).toBe("#FFEA9E");
    });

    it("always includes label when badge is returned", () => {
      const badge = badgeForStar(2);
      expect(badge).toHaveProperty("label");
      expect(typeof badge?.label).toBe("string");
    });
  });
});

describe("toSunner", () => {
  describe("basic mapping", () => {
    it("maps SunnerRow to Sunner with all fields", () => {
      const row: SunnerRow = {
        id: "user-123",
        name: "John Doe",
        department: "CEVC10",
        avatar_url: "https://example.com/avatar.jpg",
        title: "Engineer",
        star_count: 2,
      };

      const result = toSunner(row);

      expect(result).toEqual({
        id: "user-123",
        name: "John Doe",
        team: "CEVC10",
        avatarUrl: "https://example.com/avatar.jpg",
        badge: { label: "Rising Hero", borderColor: "#FFEA9E" },
      } as Sunner);
    });
  });

  describe("avatar_url handling", () => {
    it("maps avatar_url to avatarUrl", () => {
      const row: SunnerRow = {
        id: "user-1",
        name: "Test",
        department: "CEVC",
        avatar_url: "https://example.com/avatar.jpg",
        title: null,
        star_count: 0,
      };

      const result = toSunner(row);
      expect(result.avatarUrl).toBe("https://example.com/avatar.jpg");
    });

    it("converts null avatar_url to empty string", () => {
      const row: SunnerRow = {
        id: "user-2",
        name: "No Avatar",
        department: "CEVC",
        avatar_url: null,
        title: null,
        star_count: 0,
      };

      const result = toSunner(row);
      expect(result.avatarUrl).toBe("");
    });

    it("preserves empty string avatar_url", () => {
      const row: SunnerRow = {
        id: "user-3",
        name: "Empty",
        department: "CEVC",
        avatar_url: "",
        title: null,
        star_count: 0,
      };

      const result = toSunner(row);
      expect(result.avatarUrl).toBe("");
    });
  });

  describe("badge mapping", () => {
    it("includes badge when star_count matches tier (star 1)", () => {
      const row: SunnerRow = {
        id: "user-1",
        name: "Hero",
        department: "CEVC",
        avatar_url: "https://example.com/avatar.jpg",
        title: null,
        star_count: 1,
      };

      const result = toSunner(row);
      expect(result.badge).toBeDefined();
      expect(result.badge?.label).toBe("New Hero");
    });

    it("includes badge when star_count matches tier (star 2)", () => {
      const row: SunnerRow = {
        id: "user-2",
        name: "Rising Hero",
        department: "CEVC",
        avatar_url: "https://example.com/avatar.jpg",
        title: null,
        star_count: 2,
      };

      const result = toSunner(row);
      expect(result.badge).toBeDefined();
      expect(result.badge?.label).toBe("Rising Hero");
    });

    it("includes badge when star_count matches tier (star 3)", () => {
      const row: SunnerRow = {
        id: "user-3",
        name: "Legend",
        department: "CEVC",
        avatar_url: "https://example.com/avatar.jpg",
        title: null,
        star_count: 3,
      };

      const result = toSunner(row);
      expect(result.badge).toBeDefined();
      expect(result.badge?.label).toBe("Legend Hero");
    });

    it("omits badge when star_count is 0 (no tier)", () => {
      const row: SunnerRow = {
        id: "user-0",
        name: "No Badge",
        department: "CEVC",
        avatar_url: "https://example.com/avatar.jpg",
        title: null,
        star_count: 0,
      };

      const result = toSunner(row);
      expect(result.badge).toBeUndefined();
    });

    it("omits badge when star_count is unmapped", () => {
      const row: SunnerRow = {
        id: "user-high",
        name: "Out of Range",
        department: "CEVC",
        avatar_url: "https://example.com/avatar.jpg",
        title: null,
        star_count: 999,
      };

      const result = toSunner(row);
      expect(result.badge).toBeUndefined();
    });
  });

  describe("department mapping", () => {
    it("maps department field to team field", () => {
      const row: SunnerRow = {
        id: "user-1",
        name: "Test",
        department: "CEVC10",
        avatar_url: "https://example.com/avatar.jpg",
        title: null,
        star_count: 0,
      };

      const result = toSunner(row);
      expect(result.team).toBe("CEVC10");
    });

    it("preserves department value exactly as provided", () => {
      const row: SunnerRow = {
        id: "user-1",
        name: "Test",
        department: "CUSTOM_DEPT_XYZ",
        avatar_url: "https://example.com/avatar.jpg",
        title: null,
        star_count: 0,
      };

      const result = toSunner(row);
      expect(result.team).toBe("CUSTOM_DEPT_XYZ");
    });
  });
});

describe("toKudos", () => {
  describe("basic mapping with object sender/receiver", () => {
    it("maps KudosRow to KudosPost with object relations", () => {
      const row: KudosRow = {
        id: "kudos-1",
        content: "Great work!",
        category: "IDOL GIỚI TRẺ",
        tags: ["#Dedicated"],
        images: ["https://example.com/img1.jpg"],
        created_at: "2024-06-28T10:00:00Z",
        sender: {
          id: "user-1",
          name: "Sender Name",
          department: "CEVC",
          avatar_url: "https://example.com/sender.jpg",
          title: null,
          star_count: 1,
        },
        receiver: {
          id: "user-2",
          name: "Receiver Name",
          department: "CEVC",
          avatar_url: "https://example.com/receiver.jpg",
          title: null,
          star_count: 2,
        },
        hearts: [{ count: 5 }],
      };

      const result = toKudos(row);

      expect(result.id).toBe("kudos-1");
      expect(result.content).toBe("Great work!");
      expect(result.hashtag).toBe("IDOL GIỚI TRẺ");
      expect(result.tags).toEqual(["#Dedicated"]);
      expect(result.images).toEqual(["https://example.com/img1.jpg"]);
      expect(result.postedAt).toBe("2024-06-28T10:00:00Z");
      expect(result.sender.name).toBe("Sender Name");
      expect(result.receiver.name).toBe("Receiver Name");
      expect(result.heartCount).toBe(5);
    });
  });

  describe("sender/receiver as single-element array", () => {
    it("extracts sender from single-element array", () => {
      const row: KudosRow = {
        id: "kudos-1",
        content: "Test",
        category: "Test",
        tags: [],
        images: [],
        created_at: "2024-06-28T10:00:00Z",
        sender: [
          {
            id: "user-1",
            name: "Sender Array",
            department: "CEVC",
            avatar_url: "https://example.com/avatar.jpg",
            title: null,
            star_count: 0,
          },
        ],
        receiver: {
          id: "user-2",
          name: "Receiver Object",
          department: "CEVC",
          avatar_url: "https://example.com/avatar.jpg",
          title: null,
          star_count: 0,
        },
      };

      const result = toKudos(row);
      expect(result.sender.name).toBe("Sender Array");
    });

    it("extracts receiver from single-element array", () => {
      const row: KudosRow = {
        id: "kudos-1",
        content: "Test",
        category: "Test",
        tags: [],
        images: [],
        created_at: "2024-06-28T10:00:00Z",
        sender: {
          id: "user-1",
          name: "Sender Object",
          department: "CEVC",
          avatar_url: "https://example.com/avatar.jpg",
          title: null,
          star_count: 0,
        },
        receiver: [
          {
            id: "user-2",
            name: "Receiver Array",
            department: "CEVC",
            avatar_url: "https://example.com/avatar.jpg",
            title: null,
            star_count: 0,
          },
        ],
      };

      const result = toKudos(row);
      expect(result.receiver.name).toBe("Receiver Array");
    });

    it("handles both sender and receiver as single-element arrays", () => {
      const row: KudosRow = {
        id: "kudos-1",
        content: "Test",
        category: "Test",
        tags: [],
        images: [],
        created_at: "2024-06-28T10:00:00Z",
        sender: [
          {
            id: "user-1",
            name: "Sender",
            department: "CEVC",
            avatar_url: "https://example.com/avatar.jpg",
            title: null,
            star_count: 0,
          },
        ],
        receiver: [
          {
            id: "user-2",
            name: "Receiver",
            department: "CEVC",
            avatar_url: "https://example.com/avatar.jpg",
            title: null,
            star_count: 0,
          },
        ],
      };

      const result = toKudos(row);
      expect(result.sender.name).toBe("Sender");
      expect(result.receiver.name).toBe("Receiver");
    });
  });

  describe("hearts handling", () => {
    it("maps hearts[0].count to heartCount when hearts present", () => {
      const row: KudosRow = {
        id: "kudos-1",
        content: "Test",
        category: "Test",
        tags: [],
        images: [],
        created_at: "2024-06-28T10:00:00Z",
        sender: {
          id: "user-1",
          name: "Sender",
          department: "CEVC",
          avatar_url: "https://example.com/avatar.jpg",
          title: null,
          star_count: 0,
        },
        receiver: {
          id: "user-2",
          name: "Receiver",
          department: "CEVC",
          avatar_url: "https://example.com/avatar.jpg",
          title: null,
          star_count: 0,
        },
        hearts: [{ count: 10 }],
      };

      const result = toKudos(row);
      expect(result.heartCount).toBe(10);
    });

    it("sets heartCount to 0 when hearts is undefined", () => {
      const row: KudosRow = {
        id: "kudos-1",
        content: "Test",
        category: "Test",
        tags: [],
        images: [],
        created_at: "2024-06-28T10:00:00Z",
        sender: {
          id: "user-1",
          name: "Sender",
          department: "CEVC",
          avatar_url: "https://example.com/avatar.jpg",
          title: null,
          star_count: 0,
        },
        receiver: {
          id: "user-2",
          name: "Receiver",
          department: "CEVC",
          avatar_url: "https://example.com/avatar.jpg",
          title: null,
          star_count: 0,
        },
      };

      const result = toKudos(row);
      expect(result.heartCount).toBe(0);
    });

    it("sets heartCount to 0 when hearts is empty array", () => {
      const row: KudosRow = {
        id: "kudos-1",
        content: "Test",
        category: "Test",
        tags: [],
        images: [],
        created_at: "2024-06-28T10:00:00Z",
        sender: {
          id: "user-1",
          name: "Sender",
          department: "CEVC",
          avatar_url: "https://example.com/avatar.jpg",
          title: null,
          star_count: 0,
        },
        receiver: {
          id: "user-2",
          name: "Receiver",
          department: "CEVC",
          avatar_url: "https://example.com/avatar.jpg",
          title: null,
          star_count: 0,
        },
        hearts: [],
      };

      const result = toKudos(row);
      expect(result.heartCount).toBe(0);
    });
  });

  describe("category mapping", () => {
    it("maps category to hashtag when category present", () => {
      const row: KudosRow = {
        id: "kudos-1",
        content: "Test",
        category: "EXCELLENT_WORK",
        tags: [],
        images: [],
        created_at: "2024-06-28T10:00:00Z",
        sender: {
          id: "user-1",
          name: "Sender",
          department: "CEVC",
          avatar_url: "https://example.com/avatar.jpg",
          title: null,
          star_count: 0,
        },
        receiver: {
          id: "user-2",
          name: "Receiver",
          department: "CEVC",
          avatar_url: "https://example.com/avatar.jpg",
          title: null,
          star_count: 0,
        },
      };

      const result = toKudos(row);
      expect(result.hashtag).toBe("EXCELLENT_WORK");
    });

    it("sets hashtag to empty string when category is null", () => {
      const row: KudosRow = {
        id: "kudos-1",
        content: "Test",
        category: null,
        tags: [],
        images: [],
        created_at: "2024-06-28T10:00:00Z",
        sender: {
          id: "user-1",
          name: "Sender",
          department: "CEVC",
          avatar_url: "https://example.com/avatar.jpg",
          title: null,
          star_count: 0,
        },
        receiver: {
          id: "user-2",
          name: "Receiver",
          department: "CEVC",
          avatar_url: "https://example.com/avatar.jpg",
          title: null,
          star_count: 0,
        },
      };

      const result = toKudos(row);
      expect(result.hashtag).toBe("");
    });
  });

  describe("tags and images defaults", () => {
    it("defaults tags to empty array when undefined", () => {
      const row: KudosRow = {
        id: "kudos-1",
        content: "Test",
        category: "Test",
        tags: [],
        images: [],
        created_at: "2024-06-28T10:00:00Z",
        sender: {
          id: "user-1",
          name: "Sender",
          department: "CEVC",
          avatar_url: "https://example.com/avatar.jpg",
          title: null,
          star_count: 0,
        },
        receiver: {
          id: "user-2",
          name: "Receiver",
          department: "CEVC",
          avatar_url: "https://example.com/avatar.jpg",
          title: null,
          star_count: 0,
        },
      };

      const result = toKudos(row);
      expect(result.tags).toEqual([]);
    });

    it("defaults images to empty array when undefined", () => {
      const row: KudosRow = {
        id: "kudos-1",
        content: "Test",
        category: "Test",
        tags: [],
        images: [],
        created_at: "2024-06-28T10:00:00Z",
        sender: {
          id: "user-1",
          name: "Sender",
          department: "CEVC",
          avatar_url: "https://example.com/avatar.jpg",
          title: null,
          star_count: 0,
        },
        receiver: {
          id: "user-2",
          name: "Receiver",
          department: "CEVC",
          avatar_url: "https://example.com/avatar.jpg",
          title: null,
          star_count: 0,
        },
      };

      const result = toKudos(row);
      expect(result.images).toEqual([]);
    });

    it("preserves multiple tags", () => {
      const row: KudosRow = {
        id: "kudos-1",
        content: "Test",
        category: "Test",
        tags: ["#Dedicated", "#Smart", "#Creative"],
        images: [],
        created_at: "2024-06-28T10:00:00Z",
        sender: {
          id: "user-1",
          name: "Sender",
          department: "CEVC",
          avatar_url: "https://example.com/avatar.jpg",
          title: null,
          star_count: 0,
        },
        receiver: {
          id: "user-2",
          name: "Receiver",
          department: "CEVC",
          avatar_url: "https://example.com/avatar.jpg",
          title: null,
          star_count: 0,
        },
      };

      const result = toKudos(row);
      expect(result.tags).toEqual(["#Dedicated", "#Smart", "#Creative"]);
    });

    it("preserves multiple images", () => {
      const row: KudosRow = {
        id: "kudos-1",
        content: "Test",
        category: "Test",
        tags: [],
        images: [
          "https://example.com/img1.jpg",
          "https://example.com/img2.jpg",
          "https://example.com/img3.jpg",
        ],
        created_at: "2024-06-28T10:00:00Z",
        sender: {
          id: "user-1",
          name: "Sender",
          department: "CEVC",
          avatar_url: "https://example.com/avatar.jpg",
          title: null,
          star_count: 0,
        },
        receiver: {
          id: "user-2",
          name: "Receiver",
          department: "CEVC",
          avatar_url: "https://example.com/avatar.jpg",
          title: null,
          star_count: 0,
        },
      };

      const result = toKudos(row);
      expect(result.images).toEqual([
        "https://example.com/img1.jpg",
        "https://example.com/img2.jpg",
        "https://example.com/img3.jpg",
      ]);
    });
  });

  describe("sender/receiver badge presence", () => {
    it("includes badge on sender when star_count qualifies", () => {
      const row: KudosRow = {
        id: "kudos-1",
        content: "Test",
        category: "Test",
        tags: [],
        images: [],
        created_at: "2024-06-28T10:00:00Z",
        sender: {
          id: "user-1",
          name: "Sender",
          department: "CEVC",
          avatar_url: "https://example.com/avatar.jpg",
          title: null,
          star_count: 1,
        },
        receiver: {
          id: "user-2",
          name: "Receiver",
          department: "CEVC",
          avatar_url: "https://example.com/avatar.jpg",
          title: null,
          star_count: 0,
        },
      };

      const result = toKudos(row);
      expect(result.sender.badge).toBeDefined();
      expect(result.sender.badge?.label).toBe("New Hero");
      expect(result.receiver.badge).toBeUndefined();
    });

    it("includes badge on receiver when star_count qualifies", () => {
      const row: KudosRow = {
        id: "kudos-1",
        content: "Test",
        category: "Test",
        tags: [],
        images: [],
        created_at: "2024-06-28T10:00:00Z",
        sender: {
          id: "user-1",
          name: "Sender",
          department: "CEVC",
          avatar_url: "https://example.com/avatar.jpg",
          title: null,
          star_count: 0,
        },
        receiver: {
          id: "user-2",
          name: "Receiver",
          department: "CEVC",
          avatar_url: "https://example.com/avatar.jpg",
          title: null,
          star_count: 3,
        },
      };

      const result = toKudos(row);
      expect(result.sender.badge).toBeUndefined();
      expect(result.receiver.badge).toBeDefined();
      expect(result.receiver.badge?.label).toBe("Legend Hero");
    });

    it("includes badges on both when both qualify", () => {
      const row: KudosRow = {
        id: "kudos-1",
        content: "Test",
        category: "Test",
        tags: [],
        images: [],
        created_at: "2024-06-28T10:00:00Z",
        sender: {
          id: "user-1",
          name: "Sender",
          department: "CEVC",
          avatar_url: "https://example.com/avatar.jpg",
          title: null,
          star_count: 2,
        },
        receiver: {
          id: "user-2",
          name: "Receiver",
          department: "CEVC",
          avatar_url: "https://example.com/avatar.jpg",
          title: null,
          star_count: 3,
        },
      };

      const result = toKudos(row);
      expect(result.sender.badge?.label).toBe("Rising Hero");
      expect(result.receiver.badge?.label).toBe("Legend Hero");
    });
  });
});
