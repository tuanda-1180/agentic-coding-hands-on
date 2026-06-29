// Shared request-param guards for the /api/users/[id]/* routes (and tested directly).

export const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** True when `id` is a syntactically valid UUID (case-insensitive). */
export const isValidUserId = (id: string): boolean => UUID_RE.test(id);

/** Parse a non-negative integer query param; default when absent, null when invalid. */
export function parseIntParam(raw: string | null, fallback: number): number | null {
  if (raw === null || raw === "") return fallback;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? n : null;
}
