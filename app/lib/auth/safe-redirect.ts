/**
 * Returns `value` only when it is a safe, same-origin relative path; otherwise
 * returns `fallback`. This is the open-redirect guard for post-login redirects
 * (the `callbackUrl` carried through the sign-in flow).
 *
 * Rejected (→ fallback):
 *  - non-strings / empty strings
 *  - absolute URLs ("https://evil.com", "javascript:...") — don't start with "/"
 *  - protocol-relative "//evil.com"
 *  - the backslash variant "/\\evil.com" — browsers normalize "\" to "/", so it
 *    would otherwise resolve to "//evil.com" and leak the user off-site.
 *
 * Accepted: any path beginning with a single "/" (e.g. "/", "/awards", "/a?b=c").
 */
export function safeRelativeRedirect(value: unknown, fallback = "/"): string {
  if (typeof value !== "string" || value.length === 0) return fallback;
  // Must be an absolute path...
  if (value[0] !== "/") return fallback;
  // ...but not protocol-relative ("//") or its backslash bypass ("/\").
  if (value.length >= 2 && (value[1] === "/" || value[1] === "\\")) {
    return fallback;
  }
  return value;
}
