import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import en from "../../../messages/en.json";
import vi from "../../../messages/vi.json";

/**
 * Guards the account-dropdown redesign (MoMorph "Dropdown-profile"):
 * guest/user/admin states each render the correct navigation links and logout form,
 * menu items use proper a11y semantics (role/aria), the chevron-right asset exists,
 * and the wiring to useDropdown + next-auth + server actions is not silently broken.
 * No DOM runtime is available, so assertions mirror lang-menu.test.ts (source-level).
 */
const ROOT = join(__dirname, "..", "..", "..");
const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8");

describe("account dropdown — assets", () => {
  it("ships a chevron-right icon for the logout menu item", () => {
    expect(existsSync(join(ROOT, "public/saa/chevron-right.svg"))).toBe(true);
  });

  it("reuses the user icon asset (icon-user.svg)", () => {
    expect(existsSync(join(ROOT, "public/saa/icon-user.svg"))).toBe(true);
  });
});

describe("header-user-menu.tsx — menu item semantics", () => {
  const src = read("app/components/homepage/header-user-menu.tsx");

  it("renders each menu item with role='menuitem'", () => {
    expect(src).toMatch(/role:\s*["']menuitem["']/);
  });

  it("labels the trigger button with aria-label", () => {
    expect(src).toMatch(/aria-label=\{tAuth\(\s*["']userMenu["']\)\}/);
  });

  it("hides decorative icons from the a11y tree (aria-hidden)", () => {
    expect(src).toMatch(/aria-hidden=\{true\}/);
  });

  it("emits role='menuitem' in MenuItem component", () => {
    expect(src).toMatch(/role:\s*["']menuitem["']\s+as\s+const/);
  });
});

describe("header-user-menu.tsx — guest state", () => {
  const src = read("app/components/homepage/header-user-menu.tsx");

  it("shows Sign in link when unauthenticated", () => {
    expect(src).toMatch(/!isAuthenticated\s*\?/);
    expect(src).toMatch(/label=\{tAuth\(\s*["']signIn["']\)\}/);
    expect(src).toMatch(/href=["']\/login["']/);
  });

  it("calls close() on navigation to close the dropdown", () => {
    expect(src).toMatch(/onClick=\{close\}/);
  });
});

describe("header-user-menu.tsx — authenticated state", () => {
  const src = read("app/components/homepage/header-user-menu.tsx");

  it("shows Profile link with glow effect when authenticated", () => {
    expect(src).toMatch(/label=\{tAuth\(\s*["']profile["']\)\}/);
    expect(src).toMatch(/href=["']\/profile["']/);
    expect(src).toMatch(/glow/);
  });

  it("includes user icon in the Profile menu item", () => {
    expect(src).toMatch(/["']\/saa\/icon-user\.svg["']/);
  });

  it("renders Logout as a form submit (wraps MenuItem in form)", () => {
    expect(src).toMatch(/<form\s+action=\{signOutAction\}/);
    expect(src).toMatch(/type=["']submit["']/);
    expect(src).toMatch(/label=\{tAuth\(\s*["']signOut["']\)\}/);
  });

  it("includes chevron-right icon in the Logout menu item", () => {
    expect(src).toMatch(/["']\/saa\/chevron-right\.svg["']/);
  });
});

describe("header-user-menu.tsx — admin state", () => {
  const src = read("app/components/homepage/header-user-menu.tsx");

  it("shows Admin Dashboard link when session.user.role === admin", () => {
    expect(src).toMatch(/isAdmin\s*&&/);
    expect(src).toMatch(/label=\{tAuth\(\s*["']adminDashboard["']\)\}/);
    expect(src).toMatch(/href=["']\/admin["']/);
  });

  it("renders Admin Dashboard with yellow color (#FFEA9E)", () => {
    expect(src).toMatch(/color=["']#FFEA9E["']/);
  });
});

describe("header-user-menu.tsx — dropdown integration", () => {
  const src = read("app/components/homepage/header-user-menu.tsx");

  it("imports useDropdown hook", () => {
    expect(src).toMatch(/import.*useDropdown.*from.*use-dropdown/);
  });

  it("destructures isOpen, triggerRef, menuRef, triggerProps, menuProps, close", () => {
    expect(src).toMatch(/const\s*\{.*isOpen.*triggerRef.*menuRef.*triggerProps.*menuProps.*close.*\}\s*=\s*useDropdown\(\)/);
  });

  it("conditionally renders menu when isOpen is true", () => {
    expect(src).toMatch(/\{isOpen\s*&&/);
  });

  it("forwards triggerProps to the trigger button", () => {
    expect(src).toMatch(/triggerProps/);
  });

  it("forwards menuProps to the dropdown container", () => {
    expect(src).toMatch(/menuProps/);
  });
});

describe("header-user-menu.tsx — next-auth & server action wiring", () => {
  const src = read("app/components/homepage/header-user-menu.tsx");

  it("imports useSession from next-auth/react", () => {
    expect(src).toMatch(/import.*useSession.*from.*next-auth\/react/);
  });

  it("imports signOutAction server action", () => {
    expect(src).toMatch(/import.*signOutAction.*from.*@\/app\/lib\/auth\/actions/);
  });

  it("checks session status to determine authenticated state", () => {
    expect(src).toMatch(/status\s*===\s*["']authenticated["']/);
  });

  it("checks session.user.role to determine admin state", () => {
    expect(src).toMatch(/session\?\.user\?\.role\s*===\s*["']admin["']/);
  });

  it("passes signOutAction to the logout form", () => {
    expect(src).toMatch(/action=\{signOutAction\}/);
  });
});

describe("i18n — auth namespace parity (vi + en)", () => {
  const keys = [
    "userMenu",
    "signIn",
    "signOut",
    "profile",
    "adminDashboard",
  ] as const;

  it("both locales define an auth namespace", () => {
    expect(en).toHaveProperty("auth");
    expect(vi).toHaveProperty("auth");
  });

  it.each(keys)("en.auth.%s is a non-empty string", (key) => {
    const value = (en.auth as Record<string, string>)[key];
    expect(typeof value).toBe("string");
    expect(value.length).toBeGreaterThan(0);
  });

  it.each(keys)("vi.auth.%s is a non-empty string", (key) => {
    const value = (vi.auth as Record<string, string>)[key];
    expect(typeof value).toBe("string");
    expect(value.length).toBeGreaterThan(0);
  });

  it("vi and en expose exactly the same auth keys", () => {
    const enKeys = Object.keys(en.auth).sort();
    const viKeys = Object.keys(vi.auth).sort();
    expect(viKeys).toEqual(enKeys);
  });
});
