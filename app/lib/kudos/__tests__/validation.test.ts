import { describe, it, expect } from "vitest";
import {
  validateKudoInput,
  isHtmlEmpty,
  isAcceptedImageType,
  hasErrors,
  MAX_TAGS,
  isValidLinkText,
  isValidLinkUrl,
} from "../validation";
import type { KudosInput } from "@/app/lib/liveboard/types";

const valid: KudosInput = {
  receiverId: "u1",
  title: "Người truyền động lực",
  content: "<p>Cảm ơn bạn rất nhiều</p>",
  category: "#Dedicated",
  tags: ["#Dedicated"],
  images: [],
  isAnonymous: false,
};

describe("isHtmlEmpty", () => {
  it("treats tag-only / whitespace / &nbsp; HTML as empty", () => {
    expect(isHtmlEmpty("<p></p>")).toBe(true);
    expect(isHtmlEmpty("<p>   </p>")).toBe(true);
    expect(isHtmlEmpty("<p>&nbsp;</p>")).toBe(true);
    expect(isHtmlEmpty("")).toBe(true);
  });
  it("returns false when visible text exists", () => {
    expect(isHtmlEmpty("<p>hi</p>")).toBe(false);
  });
});

describe("isAcceptedImageType", () => {
  it("accepts jpg/png/webp and rejects others", () => {
    expect(isAcceptedImageType("image/jpeg")).toBe(true);
    expect(isAcceptedImageType("image/png")).toBe(true);
    expect(isAcceptedImageType("image/webp")).toBe(true);
    expect(isAcceptedImageType("application/pdf")).toBe(false);
    expect(isAcceptedImageType("video/mp4")).toBe(false);
    expect(isAcceptedImageType("text/plain")).toBe(false);
  });
});

describe("validateKudoInput", () => {
  it("passes a fully valid payload (TC ID-46/47)", () => {
    expect(hasErrors(validateKudoInput(valid))).toBe(false);
  });

  it("flags empty recipient (TC ID-7/50)", () => {
    expect(validateKudoInput({ ...valid, receiverId: "" }).receiver).toBe("required");
  });

  it("flags empty title / Danh hiệu", () => {
    expect(validateKudoInput({ ...valid, title: "   " }).title).toBe("required");
  });

  it("flags empty content (TC ID-11/51)", () => {
    expect(validateKudoInput({ ...valid, content: "<p></p>" }).content).toBe("required");
  });

  it("flags zero hashtags (TC ID-14/52)", () => {
    expect(validateKudoInput({ ...valid, tags: [] }).tags).toBe("required");
  });

  it("flags more than 5 hashtags (TC ID-17/53)", () => {
    const tags = ["#a", "#b", "#c", "#d", "#e", "#f"];
    expect(tags.length).toBeGreaterThan(MAX_TAGS);
    expect(validateKudoInput({ ...valid, tags }).tags).toBe("maxTags");
  });

  it("flags more than 5 images (TC ID-20/54)", () => {
    const images = ["1", "2", "3", "4", "5", "6"];
    expect(validateKudoInput({ ...valid, images }).images).toBe("maxImages");
  });

  it("flags an over-long title (tooLong)", () => {
    expect(validateKudoInput({ ...valid, title: "x".repeat(101) }).title).toBe("tooLong");
  });

  it("flags over-long content (tooLong)", () => {
    expect(validateKudoInput({ ...valid, content: `<p>${"x".repeat(10001)}</p>` }).content).toBe("tooLong");
  });

  it("reports all required errors at once (TC ID-56)", () => {
    const errs = validateKudoInput({
      receiverId: "",
      title: "",
      content: "",
      category: "",
      tags: [],
      images: [],
      isAnonymous: false,
    });
    expect(errs.receiver).toBe("required");
    expect(errs.title).toBe("required");
    expect(errs.content).toBe("required");
    expect(errs.tags).toBe("required");
  });
});

describe("Add link dialog validation (screen OyDLDuSGEa)", () => {
  describe("isValidLinkText", () => {
    it("accepts 1–100 non-whitespace chars", () => {
      expect(isValidLinkText("a")).toBe(true);
      expect(isValidLinkText("Sample Link")).toBe(true);
      expect(isValidLinkText("a".repeat(100))).toBe(true);
    });
    it("rejects empty / whitespace-only / over 100 chars", () => {
      expect(isValidLinkText("")).toBe(false);
      expect(isValidLinkText("   ")).toBe(false);
      expect(isValidLinkText("a".repeat(101))).toBe(false);
    });
  });

  describe("isValidLinkUrl", () => {
    it("accepts valid http/https URLs (5–2048 chars)", () => {
      expect(isValidLinkUrl("https://www.example.com")).toBe(true);
      expect(isValidLinkUrl("http://a.bc")).toBe(true);
    });
    it("rejects invalid format, wrong protocol, too short/long", () => {
      expect(isValidLinkUrl("invalid-url")).toBe(false);
      expect(isValidLinkUrl("www")).toBe(false); // < 5 chars
      expect(isValidLinkUrl("ftp://example.com")).toBe(false); // wrong protocol
      expect(isValidLinkUrl(`https://e.com/${"a".repeat(2048)}`)).toBe(false); // > 2048
    });
  });
});
