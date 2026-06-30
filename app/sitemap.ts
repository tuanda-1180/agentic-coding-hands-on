import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/site-config";

// Sitemap for the public, statically-known pages. Per-user profile pages are
// intentionally excluded — they hold personal data and are reached via in-app
// navigation, not search.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/awards", priority: 0.8, changeFrequency: "monthly" },
    { path: "/countdown", priority: 0.5, changeFrequency: "monthly" },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
