import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Guards the language-dropdown redesign (MoMorph "Dropdown-ngôn ngữ"):
 * both locales render flag + 2-letter code, the new EN flag asset exists,
 * a11y wiring (role/aria/keyboard) stays intact, and the locale-switch
 * mechanism (setLocale + router.refresh) is not silently broken by refactors.
 * No DOM runtime is available, so assertions mirror site-chrome.test.ts (source-level).
 */
const ROOT = join(__dirname, "..", "..", "..");
const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8");

describe("language dropdown — assets", () => {
  it("ships an English (UK) flag asset", () => {
    expect(existsSync(join(ROOT, "public/saa/flag-uk.svg"))).toBe(true);
  });

  it("UK flag shares the 20×15 viewBox of the VN flag (no distortion)", () => {
    const uk = read("public/saa/flag-uk.svg");
    expect(uk).toMatch(/<svg[^>]*viewBox=["']0 0 20 15["']/);
  });
});

describe("language dropdown — header-lang-menu.tsx", () => {
  const src = read("app/components/homepage/header-lang-menu.tsx");

  it("maps both locales to a flag asset", () => {
    expect(src).toMatch(/flag-vn\.svg/);
    expect(src).toMatch(/flag-uk\.svg/);
  });

  it("shows the 2-letter codes VN and EN per design", () => {
    expect(src).toMatch(/code:\s*["']VN["']/);
    expect(src).toMatch(/code:\s*["']EN["']/);
  });

  it("keeps full language names for the accessible label", () => {
    expect(src).toMatch(/Tiếng Việt/);
    expect(src).toMatch(/English/);
    expect(src).toMatch(/aria-label=\{name\}/);
  });

  it("renders each option as a menuitem", () => {
    expect(src).toMatch(/role="menuitem"/);
  });

  it("never emits aria-current=\"false\" (only set when selected)", () => {
    expect(src).toMatch(/aria-current=\{selected \? ["']true["'] : undefined\}/);
  });

  it("hides decorative flag icons from the a11y tree", () => {
    expect(src).toMatch(/aria-hidden=\{true\}/);
    // Guard against the bare-attribute shorthand that renders aria-hidden=""
    expect(src).not.toMatch(/aria-hidden\s+width/);
  });

  it("persists the locale via setLocale and re-renders via router.refresh", () => {
    expect(src).toMatch(/await setLocale\(/);
    expect(src).toMatch(/router\.refresh\(\)/);
  });

  it("derives the locale list from the options map (single source of truth)", () => {
    expect(src).toMatch(/Object\.keys\(LANG_OPTIONS\)/);
  });
});

describe("language dropdown — use-dropdown.ts keyboard a11y", () => {
  const src = read("app/components/ui/use-dropdown.ts");

  it("closes on Escape", () => {
    expect(src).toMatch(/e\.key === "Escape"/);
  });

  it("roves focus with ArrowDown / ArrowUp", () => {
    expect(src).toMatch(/ArrowDown/);
    expect(src).toMatch(/ArrowUp/);
    expect(src).toMatch(/querySelectorAll<HTMLElement>\(\s*['"]\[role="menuitem"\]['"]/);
  });
});
