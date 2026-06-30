import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/site-config";

// Generated /robots.txt. Allows public pages but keeps crawlers out of the
// admin area, API routes, and the signed-in user's own profile.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/profile"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
