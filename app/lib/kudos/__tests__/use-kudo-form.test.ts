import { describe, it, expect } from "vitest";
import { toKudosInput, fromKudosPost, type KudoFormState } from "../use-kudo-form";
import type { KudosPost, Sunner } from "@/app/lib/liveboard/types";

const sunner = (id: string, name: string): Sunner => ({
  id,
  name,
  team: "CEVC",
  avatarUrl: `${id}.jpg`,
});

const baseState: KudoFormState = {
  receiver: { id: "u2", name: "Receiver", avatarUrl: "u2.jpg", department: "CEVC", title: null },
  title: "Người truyền lửa",
  content: "<p>Cảm ơn</p>",
  tags: ["#Dedicated", "#Inspiring"],
  images: [{ id: "a", src: "https://s/1.jpg" }, { id: "b", src: "https://s/2.jpg" }],
  isAnonymous: false,
  anonymousName: "",
};

describe("toKudosInput", () => {
  it("maps form state to the API payload", () => {
    const p = toKudosInput(baseState);
    expect(p.receiverId).toBe("u2");
    expect(p.title).toBe("Người truyền lửa");
    expect(p.content).toBe("<p>Cảm ơn</p>");
    expect(p.tags).toEqual(["#Dedicated", "#Inspiring"]);
    expect(p.images).toEqual(["https://s/1.jpg", "https://s/2.jpg"]);
    expect(p.isAnonymous).toBe(false);
  });

  it("derives category from the first hashtag", () => {
    expect(toKudosInput(baseState).category).toBe("#Dedicated");
    expect(toKudosInput({ ...baseState, tags: [] }).category).toBe("");
  });

  it("empty receiver → empty receiverId", () => {
    expect(toKudosInput({ ...baseState, receiver: null }).receiverId).toBe("");
  });

  it("carries the anonymous name when anonymous", () => {
    const p = toKudosInput({ ...baseState, isAnonymous: true, anonymousName: "Mèo Giấu Mặt" });
    expect(p.isAnonymous).toBe(true);
    expect(p.anonymousName).toBe("Mèo Giấu Mặt");
  });
});

describe("fromKudosPost (edit mode seed)", () => {
  const kudo: KudosPost = {
    id: "k1",
    sender: sunner("u1", "Sender"),
    receiver: sunner("u2", "Receiver"),
    postedAt: "2026-01-01T00:00:00Z",
    title: "Danh hiệu X",
    hashtag: "#Dedicated",
    content: "<p>hi</p>",
    images: ["https://s/1.jpg", "https://s/2.jpg"],
    tags: ["#Dedicated"],
    heartCount: 3,
    liked: false,
    isAnonymous: false,
    isMine: true,
  };

  it("pre-fills receiver, title, content, tags, images", () => {
    const s = fromKudosPost(kudo);
    expect(s.receiver?.id).toBe("u2");
    expect(s.receiver?.department).toBe("CEVC"); // mapped from receiver.team
    expect(s.title).toBe("Danh hiệu X");
    expect(s.content).toBe("<p>hi</p>");
    expect(s.tags).toEqual(["#Dedicated"]);
    expect(s.images.map((i) => i.src)).toEqual(["https://s/1.jpg", "https://s/2.jpg"]);
    expect(s.isAnonymous).toBe(false);
    expect(s.anonymousName).toBe("");
  });

  it("recovers the anonymous alias from sender.name for an anonymous kudo", () => {
    const anon = { ...kudo, isAnonymous: true, sender: sunner("anonymous", "Mèo Giấu Mặt") };
    const s = fromKudosPost(anon);
    expect(s.isAnonymous).toBe(true);
    expect(s.anonymousName).toBe("Mèo Giấu Mặt");
  });

  it("round-trips through toKudosInput preserving core fields", () => {
    const p = toKudosInput(fromKudosPost(kudo));
    expect(p.receiverId).toBe("u2");
    expect(p.title).toBe("Danh hiệu X");
    expect(p.tags).toEqual(["#Dedicated"]);
    expect(p.images).toEqual(["https://s/1.jpg", "https://s/2.jpg"]);
  });
});
