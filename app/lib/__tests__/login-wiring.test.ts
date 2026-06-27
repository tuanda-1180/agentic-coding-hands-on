import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import en from "../../../messages/en.json";
import vi from "../../../messages/vi.json";

/**
 * Guards the wiring of the Google login feature so refactors can't silently
 * break the auth flow, the open-redirect guard, or the i18n contract. Source
 * assertions mirror the style of site-chrome.test.ts (no DOM runtime available).
 */
const ROOT = join(__dirname, "..", "..", "..");
const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8");

describe("auth.ts — Google provider config", () => {
  const src = read("auth.ts");

  it("registers the Google provider", () => {
    expect(src).toMatch(/import\s+Google\s+from\s+["']next-auth\/providers\/google["']/);
    expect(src).toMatch(/Google\(\{/);
  });

  it("always shows the account chooser (prompt=select_account)", () => {
    expect(src).toMatch(/prompt:\s*["']select_account["']/);
  });

  it("defaults OAuth users to the 'regular' role", () => {
    expect(src).toMatch(/role\s*=\s*user\.role\s*\?\?\s*["']regular["']/);
  });
});

describe("actions.ts — server action safety", () => {
  const src = read("app/lib/auth/actions.ts");

  it("uses the shared open-redirect guard (no inline duplication)", () => {
    expect(src).toMatch(/safeRelativeRedirect/);
    // The old inline guard must be gone (DRY).
    expect(src).not.toMatch(/!callbackUrl\.startsWith\(["']\/\/["']\)/);
  });

  it("re-throws NEXT_REDIRECT so the OAuth handoff/redirect propagates", () => {
    expect(src).toMatch(/NEXT_REDIRECT/);
  });

  it("routes Google auth failures to the localized error param", () => {
    expect(src).toMatch(/redirect\(["']\/login\?error=google["']\)/);
  });
});

describe("login page — authenticated-user guard", () => {
  const src = read("app/login/page.tsx");

  it("redirects authenticated users away from /login", () => {
    expect(src).toMatch(/await auth\(\)/);
    expect(src).toMatch(/redirect\(["']\/["']\)/);
  });

  it("resolves the failure message via next-intl, not a hardcoded string", () => {
    expect(src).toMatch(/getTranslations\(["']login["']\)/);
    expect(src).toMatch(/t\(["']loginFailed["']\)/);
    // No leftover hardcoded Vietnamese error text.
    expect(src).not.toMatch(/Đăng nhập (không|thất)/);
  });
});

describe("GoogleLoginForm — drives the server action with pending state", () => {
  const src = read("app/components/login/google-login-form.tsx");

  it("submits to signInWithGoogleAction", () => {
    expect(src).toMatch(/action=\{signInWithGoogleAction\}/);
  });

  it("reflects pending state via useFormStatus", () => {
    expect(src).toMatch(/useFormStatus/);
    expect(src).toMatch(/isLoading=\{pending\}/);
  });

  it("forwards callbackUrl as a hidden field", () => {
    expect(src).toMatch(/name="callbackUrl"/);
  });
});

describe("i18n — login namespace parity (vi + en)", () => {
  const keys = [
    "heroTitle",
    "heroSubtitle",
    "heroTagline",
    "loginWithGoogle",
    "loginFailed",
  ] as const;

  it("both locales define a login namespace", () => {
    expect(en).toHaveProperty("login");
    expect(vi).toHaveProperty("login");
  });

  it.each(keys)("en.login.%s is a non-empty string", (key) => {
    const value = (en.login as Record<string, string>)[key];
    expect(typeof value).toBe("string");
    expect(value.length).toBeGreaterThan(0);
  });

  it.each(keys)("vi.login.%s is a non-empty string", (key) => {
    const value = (vi.login as Record<string, string>)[key];
    expect(typeof value).toBe("string");
    expect(value.length).toBeGreaterThan(0);
  });

  it("vi and en expose exactly the same login keys", () => {
    const enKeys = Object.keys(en.login).sort();
    const viKeys = Object.keys(vi.login).sort();
    expect(viKeys).toEqual(enKeys);
  });

  it("footer.copyright exists in both locales (used by the login footer)", () => {
    expect((en.footer as Record<string, string>).copyright).toBeTruthy();
    expect((vi.footer as Record<string, string>).copyright).toBeTruthy();
  });
});
