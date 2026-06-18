/**
 * Produce the href for an award card link.
 * If a slug is provided, return "/awards#<slug>".
 * If slug is absent or empty, return "/awards" (no hash, no scroll).
 */
export function awardHref(slug?: string): string {
  if (!slug) return "/awards";
  return `/awards#${slug}`;
}
