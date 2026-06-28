import { permanentRedirect } from "next/navigation";

// The Thể lệ (Rules) content is shown as an in-page overlay panel opened from the
// homepage FAB, not as a standalone route. The route is permanently retired, so
// any direct hit on /rules (old links, bookmarks, crawlers) gets a 308 to home.
export default function RulesPage() {
  permanentRedirect("/");
}
