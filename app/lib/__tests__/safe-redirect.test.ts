import { describe, it, expect } from "vitest";
import { safeRelativeRedirect } from "../auth/safe-redirect";

describe("safeRelativeRedirect — accepts safe relative paths", () => {
  it.each([
    "/",
    "/awards",
    "/awards/123",
    "/kudos?tab=recent",
    "/a/b/c?x=1&y=2#frag",
    "/path-with-dashes",
  ])("keeps %j", (value) => {
    expect(safeRelativeRedirect(value)).toBe(value);
  });
});

describe("safeRelativeRedirect — blocks open-redirect vectors", () => {
  it.each([
    ["protocol-relative", "//evil.com"],
    ["protocol-relative with path", "//evil.com/login"],
    ["backslash bypass", "/\\evil.com"],
    ["backslash-slash bypass", "/\\/evil.com"],
    ["absolute http", "http://evil.com"],
    ["absolute https", "https://evil.com"],
    ["javascript scheme", "javascript:alert(1)"],
    ["data scheme", "data:text/html,<script>"],
    ["leading whitespace + protocol-relative", " //evil.com"],
    ["bare host", "evil.com"],
    ["backslash only", "\\evil.com"],
  ])("rejects %s (%j) → fallback", (_label, value) => {
    expect(safeRelativeRedirect(value)).toBe("/");
  });
});

describe("safeRelativeRedirect — non-strings and empties", () => {
  it.each([
    ["empty string", ""],
    ["null", null],
    ["undefined", undefined],
    ["number", 42],
    ["object", { toString: () => "/evil" }],
    ["array", ["/a"]],
    ["FormData null (missing field)", null],
  ])("returns fallback for %s", (_label, value) => {
    expect(safeRelativeRedirect(value)).toBe("/");
  });
});

describe("safeRelativeRedirect — custom fallback", () => {
  it("uses the provided fallback when value is unsafe", () => {
    expect(safeRelativeRedirect("https://evil.com", "/home")).toBe("/home");
  });

  it("uses the provided fallback for missing values", () => {
    expect(safeRelativeRedirect(undefined, "/dashboard")).toBe("/dashboard");
  });

  it("still returns a valid relative path over the fallback", () => {
    expect(safeRelativeRedirect("/awards", "/home")).toBe("/awards");
  });
});
