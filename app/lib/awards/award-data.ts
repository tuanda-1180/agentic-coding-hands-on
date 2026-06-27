/**
 * Single source of truth for the SAA 2025 award categories.
 *
 * `slug` values MUST match the homepage award slugs (app/components/homepage/
 * awards-section.tsx) — homepage cards deep-link to `/awards#<slug>` via
 * awardHref(), and the award page sections render `id={slug}` so those links land.
 *
 * Language-specific copy (title, description, quantity, prize lines) lives in the
 * `awardsPage.items.<key>` i18n namespace; this module only holds structure
 * (order, slug→key mapping, image asset).
 */
export interface AwardEntry {
  /** Anchor id + homepage deep-link target. */
  slug: string;
  /** i18n key under awardsPage.items.<key>. */
  key: string;
  /** Award name graphic overlaid on the ring background (reused from homepage). */
  nameImage: string;
  /** Design layout: award image sits on the right (true) or left (false). Alternates. */
  imageOnRight: boolean;
}

export const AWARDS: AwardEntry[] = [
  { slug: "top-talent", key: "topTalent", nameImage: "/saa/name-top-talent.png", imageOnRight: false },
  { slug: "top-project", key: "topProject", nameImage: "/saa/name-top-project.png", imageOnRight: true },
  {
    slug: "top-project-leader",
    key: "topProjectLeader",
    nameImage: "/saa/name-top-project-leader.png",
    imageOnRight: false,
  },
  { slug: "best-manager", key: "bestManager", nameImage: "/saa/name-best-manager.png", imageOnRight: true },
  {
    slug: "signature-2025-creator",
    key: "signatureCreator",
    nameImage: "/saa/name-signature-creator.png",
    imageOnRight: false,
  },
  { slug: "mvp", key: "mvp", nameImage: "/saa/name-mvp.png", imageOnRight: true },
];

/** Ordered slugs — used by the left scroll-spy nav and the IntersectionObserver. */
export const AWARD_SLUGS: string[] = AWARDS.map((a) => a.slug);
