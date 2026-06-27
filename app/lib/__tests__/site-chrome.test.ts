import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Guards the shared-chrome architecture: SiteHeader/SiteFooter are rendered ONCE
 * by SiteChrome in the root layout, never again inside individual pages (which
 * would double-render the chrome), and the bare routes opt out.
 */
const ROOT = join(__dirname, "..", "..", "..");
const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8");

describe("shared site chrome", () => {
  it("root layout wraps children in SiteChrome", () => {
    const src = read("app/layout.tsx");
    expect(src).toMatch(/<SiteChrome>/);
  });

  it("SiteChrome marks /login and /countdown as bare routes", () => {
    const src = read("app/components/layout/site-chrome.tsx");
    expect(src).toMatch(/["']\/login["']/);
    expect(src).toMatch(/["']\/countdown["']/);
  });

  it.each([
    "app/components/homepage/homepage-screen.tsx",
    "app/awards/page.tsx",
  ])("%s does not render its own header/footer (avoids double chrome)", (file) => {
    const src = read(file);
    expect(src).not.toMatch(/SiteHeader/);
    expect(src).not.toMatch(/SiteFooter/);
  });
});
