import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import en from "../../../messages/en.json";
import vi from "../../../messages/vi.json";

/**
 * Guards the "Thể lệ" (Rules) panel feature (opened from homepage FAB):
 * The rules namespace is defined in both locales with matching key shape,
 * app/rules/page.tsx redirects to "/" (no direct access), and the FAB "rules"
 * action no longer routes (href is null, calls onOpenRules()).
 * No DOM runtime is available, so assertions mirror dropdown-profile.test.ts (source-level).
 */
const ROOT = join(__dirname, "..", "..", "..");
const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8");

describe("app/rules/page.tsx — redirect to home", () => {
  const src = read("app/rules/page.tsx");

  it("permanently redirects to '/'", () => {
    expect(src).toMatch(/permanentRedirect\(\s*["']\/["']\s*\)/);
  });

  it("imports permanentRedirect from next/navigation", () => {
    expect(src).toMatch(
      /import\s*\{\s*permanentRedirect\s*\}\s*from\s*["']next\/navigation["']/
    );
  });
});

describe("app/components/homepage/fab.tsx — rules action wiring", () => {
  const src = read("app/components/homepage/fab.tsx");

  it("defines a FabAction interface with key, href, icon, darkenIcon", () => {
    expect(src).toMatch(/interface FabAction/);
    expect(src).toMatch(/key:\s*["']rules["']\s*\|\s*["']writeKudos["']/);
    expect(src).toMatch(/href:\s*string\s*\|\s*null/);
    expect(src).toMatch(/icon:\s*string/);
    expect(src).toMatch(/darkenIcon:\s*boolean/);
  });

  it("includes rules action in FAB_ACTIONS with href: null", () => {
    expect(src).toMatch(/key:\s*["']rules["'],\s*href:\s*null/);
  });

  it("includes rules action with fab-kudos.svg icon", () => {
    expect(src).toMatch(/key:\s*["']rules["'][^}]*icon:\s*["']\/saa\/fab-kudos\.svg["']/);
  });

  it("includes writeKudos action with href: /kudos", () => {
    expect(src).toMatch(/key:\s*["']writeKudos["'][^}]*href:\s*["']\/kudos["']/);
  });

  it("accepts onOpenRules prop (called when rules action is chosen)", () => {
    expect(src).toMatch(/interface FabProps/);
    expect(src).toMatch(/onOpenRules\?:\s*\(\)\s*=>\s*void/);
  });

  it("calls onOpenRules() when rules action is selected (href is null)", () => {
    expect(src).toMatch(/if\s*\(\s*action\.href\s*\)\s*\{/);
    expect(src).toMatch(/else if\s*\(\s*action\.key\s*===\s*["']rules["']\s*\)/);
    expect(src).toMatch(/onOpenRules\?\.\(\)/);
  });

  it("routes to action.href when href is non-null", () => {
    expect(src).toMatch(/router\.push\(\s*action\.href\s*\)/);
  });

  it("renders each action as a menuitem button", () => {
    expect(src).toMatch(/role=["']menuitem["']/);
  });

  it("closes the menu before executing the action", () => {
    expect(src).toMatch(/const handleAction.*=.*\{[\s\S]*close\(\)/);
  });
});

describe("i18n — rules namespace parity (vi + en)", () => {
  const topLevelKeys = [
    "title",
    "receiverHeading",
    "receiverIntro",
    "tiers",
    "senderHeading",
    "senderIntro",
    "icons",
    "senderOutro",
    "nationalHeading",
    "nationalBody",
    "close",
    "writeKudos",
  ] as const;

  const tierKeys = ["new", "rising", "super", "legend"] as const;

  const tierSubKeys = ["label", "count", "desc"] as const;

  const iconKeys = [
    "revival",
    "touchOfLight",
    "stayGold",
    "flowToHorizon",
    "beyondTheBoundary",
    "rootFurther",
  ] as const;

  it("both locales define a rules namespace", () => {
    expect(en).toHaveProperty("rules");
    expect(vi).toHaveProperty("rules");
  });

  it.each(topLevelKeys)("en.rules.%s is a non-empty string", (key) => {
    const value = (en.rules as Record<string, unknown>)[key];
    if (key === "tiers" || key === "icons") {
      // These are objects, not strings
      expect(typeof value).toBe("object");
      expect(value).not.toBeNull();
    } else {
      expect(typeof value).toBe("string");
      expect((value as string).length).toBeGreaterThan(0);
    }
  });

  it.each(topLevelKeys)("vi.rules.%s is a non-empty string", (key) => {
    const value = (vi.rules as Record<string, unknown>)[key];
    if (key === "tiers" || key === "icons") {
      // These are objects, not strings
      expect(typeof value).toBe("object");
      expect(value).not.toBeNull();
    } else {
      expect(typeof value).toBe("string");
      expect((value as string).length).toBeGreaterThan(0);
    }
  });

  it("vi and en expose exactly the same top-level rules keys", () => {
    const enKeys = Object.keys(en.rules).sort();
    const viKeys = Object.keys(vi.rules).sort();
    expect(viKeys).toEqual(enKeys);
  });

  it.each(tierKeys)(
    "en.rules.tiers.%s has label, count, desc",
    (tierKey) => {
      const tier = ((en.rules as Record<string, unknown>).tiers as Record<string, unknown>)[
        tierKey
      ];
      expect(tier).toHaveProperty("label");
      expect(tier).toHaveProperty("count");
      expect(tier).toHaveProperty("desc");
      expect(typeof (tier as Record<string, unknown>).label).toBe("string");
      expect(typeof (tier as Record<string, unknown>).count).toBe("string");
      expect(typeof (tier as Record<string, unknown>).desc).toBe("string");
    }
  );

  it.each(tierKeys)(
    "vi.rules.tiers.%s has label, count, desc",
    (tierKey) => {
      const tier = ((vi.rules as Record<string, unknown>).tiers as Record<string, unknown>)[
        tierKey
      ];
      expect(tier).toHaveProperty("label");
      expect(tier).toHaveProperty("count");
      expect(tier).toHaveProperty("desc");
      expect(typeof (tier as Record<string, unknown>).label).toBe("string");
      expect(typeof (tier as Record<string, unknown>).count).toBe("string");
      expect(typeof (tier as Record<string, unknown>).desc).toBe("string");
    }
  );

  it("vi and en expose exactly the same tier keys", () => {
    const enTierKeys = Object.keys(en.rules.tiers).sort();
    const viTierKeys = Object.keys(vi.rules.tiers).sort();
    expect(viTierKeys).toEqual(enTierKeys);
  });

  it.each(iconKeys)("en.rules.icons.%s is a non-empty string", (iconKey) => {
    const value = (
      (en.rules as Record<string, unknown>).icons as Record<string, string>
    )[iconKey];
    expect(typeof value).toBe("string");
    expect(value.length).toBeGreaterThan(0);
  });

  it.each(iconKeys)("vi.rules.icons.%s is a non-empty string", (iconKey) => {
    const value = (
      (vi.rules as Record<string, unknown>).icons as Record<string, string>
    )[iconKey];
    expect(typeof value).toBe("string");
    expect(value.length).toBeGreaterThan(0);
  });

  it("vi and en expose exactly the same icon keys", () => {
    const enIconKeys = Object.keys(en.rules.icons).sort();
    const viIconKeys = Object.keys(vi.rules.icons).sort();
    expect(viIconKeys).toEqual(enIconKeys);
  });
});
