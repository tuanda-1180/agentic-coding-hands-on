import { describe, it, expect } from "vitest";
import { toKudos, type KudosRow } from "../liveboard/mappers";

const baseRow: KudosRow = {
  id: "k1",
  title: "Người truyền lửa",
  content: "<p>hi</p>",
  category: "#Dedicated",
  tags: ["#Dedicated"],
  images: [],
  created_at: "2026-01-01T00:00:00Z",
  sender: { id: "u-sender", name: "Real Sender", department: "CEVC", avatar_url: "a.jpg", title: null, star_count: 1 },
  receiver: { id: "u-recv", name: "Receiver", department: "CEVC", avatar_url: "b.jpg", title: null, star_count: 1 },
  hearts: [{ count: 0 }],
};

describe("toKudos anonymity (C1) + isMine", () => {
  it("masks the sender identity for anonymous kudos", () => {
    const r = toKudos({ ...baseRow, is_anonymous: true });
    expect(r.isAnonymous).toBe(true);
    expect(r.sender.id).toBe("anonymous");
    expect(r.sender.name).not.toBe("Real Sender");
  });

  it("shows the anonymous alias when provided", () => {
    const r = toKudos({ ...baseRow, is_anonymous: true, anonymous_name: "Người giấu mặt" });
    expect(r.sender.name).toBe("Người giấu mặt");
    expect(r.sender.id).toBe("anonymous");
  });

  it("falls back to a generic label when alias is blank", () => {
    const r = toKudos({ ...baseRow, is_anonymous: true, anonymous_name: "  " });
    expect(r.sender.name).toBe("Người ẩn danh");
  });

  it("exposes the real sender for non-anonymous kudos", () => {
    const r = toKudos({ ...baseRow, is_anonymous: false });
    expect(r.sender.id).toBe("u-sender");
    expect(r.sender.name).toBe("Real Sender");
  });

  it("sets isMine from the REAL sender even when anonymous (owner can still edit)", () => {
    const mine = toKudos({ ...baseRow, is_anonymous: true }, undefined, "u-sender");
    expect(mine.isMine).toBe(true);
    expect(mine.sender.id).toBe("anonymous"); // still masked in output

    const notMine = toKudos({ ...baseRow, is_anonymous: true }, undefined, "someone-else");
    expect(notMine.isMine).toBe(false);
  });

  it("isMine is false when no current user", () => {
    expect(toKudos(baseRow).isMine).toBe(false);
  });
});

describe("toKudos session-identity layering", () => {
  const self = { name: "My Google Name", avatarUrl: "https://google/me.jpg" };

  it("shows the current user's session identity on their own (non-anonymous) kudo", () => {
    const r = toKudos(baseRow, undefined, "u-sender", self);
    expect(r.sender.name).toBe("My Google Name");
    expect(r.sender.avatarUrl).toBe("https://google/me.jpg");
  });

  it("does NOT layer identity onto other users' kudos", () => {
    const r = toKudos(baseRow, undefined, "someone-else", self);
    expect(r.sender.name).toBe("Real Sender");
  });

  it("keeps own anonymous kudo masked despite session identity", () => {
    const r = toKudos({ ...baseRow, is_anonymous: true }, undefined, "u-sender", self);
    expect(r.sender.id).toBe("anonymous");
    expect(r.sender.name).not.toBe("My Google Name");
  });
});
