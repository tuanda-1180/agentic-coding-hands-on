import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Regression guard for the shared-chrome "About" link.
 *
 * The site header and footer render on EVERY route. The "About SAA" link must
 * point at the home root ("/") and must NOT use a `#about` hash:
 *  - a bare "#about" resolves against the current path (e.g. /awards#about — a
 *    dead anchor, the original bug);
 *  - "/#about" works but leaves an ugly "#about" in the URL.
 * On the homepage the header smooth-scrolls to the hero (id="about") in JS, so
 * no hash ever appears in the URL.
 */
const ROOT = join(__dirname, "..", "..", "..");
const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8");

const SHARED_CHROME = [
  "app/components/homepage/site-header.tsx",
  "app/components/homepage/site-footer.tsx",
];

describe("shared-chrome About link", () => {
  it.each(SHARED_CHROME)("%s uses no #about hash in the URL", (file) => {
    const src = read(file);
    expect(src).not.toMatch(/#about/);
  });

  it("the #about scroll target still exists on the homepage hero", () => {
    const src = read("app/components/homepage/hero-section.tsx");
    expect(src).toMatch(/id="about"/);
  });
});
