import { describe, it, expect } from "vitest";
import { awardHref } from "../awards/award-href";

describe("awardHref", () => {
  describe("happy path: slug provided", () => {
    it("returns /awards#<slug> for a normal slug", () => {
      expect(awardHref("top-talent")).toBe("/awards#top-talent");
    });

    it("returns /awards#<slug> for another slug", () => {
      expect(awardHref("mvp")).toBe("/awards#mvp");
    });

    it("returns /awards#<slug> for a multi-word slug", () => {
      expect(awardHref("signature-2025-creator")).toBe(
        "/awards#signature-2025-creator"
      );
    });
  });

  describe("edge cases: no slug → /awards without hash", () => {
    it("returns /awards when slug is undefined", () => {
      expect(awardHref(undefined)).toBe("/awards");
    });

    it("returns /awards when slug is empty string", () => {
      expect(awardHref("")).toBe("/awards");
    });

    it("returns /awards when called with no argument", () => {
      expect(awardHref()).toBe("/awards");
    });
  });

  describe("return type", () => {
    it("always returns a string", () => {
      expect(typeof awardHref("top-talent")).toBe("string");
      expect(typeof awardHref(undefined)).toBe("string");
      expect(typeof awardHref()).toBe("string");
    });
  });
});
