import sanitizeHtml from "sanitize-html";

// Server-side sanitizer for kudo rich-text HTML (Tiptap StarterKit + Link +
// Mention output). Uses sanitize-html (pure JS, htmlparser2) instead of
// DOMPurify/jsdom — jsdom's transitive deps break when bundled into a Vercel
// serverless function (ERR_REQUIRE_ESM). Strips scripts, event handlers, and
// non-http(s)/mailto links while keeping the formatting + mention/link markup.
const ALLOWED_TAGS = [
  "p", "br", "hr",
  "strong", "b", "em", "i", "s", "strike", "u",
  "code", "pre", "blockquote",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li",
  "a", "span",
];

export function sanitizeKudoHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "target", "rel", "style"],
      span: ["class", "data-type", "data-id", "data-label", "style"],
      code: ["class"],
      pre: ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    // Keep the text of any stripped tag (don't drop content).
    disallowedTagsMode: "discard",
  });
}
