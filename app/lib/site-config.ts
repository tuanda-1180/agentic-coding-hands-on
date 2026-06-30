// Central site identity used by metadata, robots, and sitemap.
// SITE_URL must be the public origin in production (no trailing slash) so that
// canonical/OG URLs and the sitemap resolve correctly. Falls back to localhost
// for local development.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const SITE_NAME = "Sun* Asterisk Awards";

export const SITE_DESCRIPTION =
  "Sun* Asterisk Awards — countdown, award system, and the Sun* Kudos live board where teammates send thanks and recognition.";
