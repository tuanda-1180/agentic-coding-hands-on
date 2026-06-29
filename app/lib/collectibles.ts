// Single source of truth for the 6 collectible "danh hiệu" icons a Kudos sender
// can unlock ("SƯU TẬP TRỌN BỘ 6 ICON, NHẬN NGAY PHẦN QUÀ BÍ ẨN").
// Shared by the Thể lệ rules panel and the Profile icon collection.
//
// `key` maps to the i18n label under `rules.icons.<key>`; `src` is the PNG under
// public/saa/; `gradient` is a CSS fallback approximating the artwork.

export interface Collectible {
  key: string;
  src: string;
  gradient: string;
}

export const COLLECTIBLES: readonly Collectible[] = [
  {
    key: "revival",
    src: "/saa/icon-revival.png",
    gradient: "radial-gradient(circle at 50% 35%, #2E6E6A 0%, #123A3A 70%, #0B2424 100%)",
  },
  {
    key: "touchOfLight",
    src: "/saa/icon-touch-of-light.png",
    gradient: "linear-gradient(135deg, #F7C5D9 0%, #C9B6F0 50%, #9FC4F5 100%)",
  },
  {
    key: "stayGold",
    src: "/saa/icon-stay-gold.png",
    gradient: "radial-gradient(circle at 50% 35%, #FFB347 0%, #FF7A3D 60%, #E85C2B 100%)",
  },
  {
    key: "flowToHorizon",
    src: "/saa/icon-flow-to-horizon.png",
    gradient: "linear-gradient(180deg, #3A7BD5 0%, #34C4D9 60%, #1B3A4F 100%)",
  },
  {
    key: "beyondTheBoundary",
    src: "/saa/icon-beyond-the-boundary.png",
    gradient: "radial-gradient(circle at 50% 35%, #FF5A4D 0%, #C42218 70%, #6E0F0A 100%)",
  },
  {
    key: "rootFurther",
    src: "/saa/icon-root-further.png",
    gradient: "radial-gradient(circle at 50% 35%, #4A3B2E 0%, #2A2018 65%, #14100B 100%)",
  },
] as const;

/** Total number of collectible icons in a full set (6). */
export const COLLECTIBLE_COUNT = COLLECTIBLES.length;
