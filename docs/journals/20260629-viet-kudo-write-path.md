# Viết Kudo: Create & Edit Kudo Write Path

**Date**: 2026-06-29
**Severity**: Medium (first write/mutation path in the Kudos data layer; security-relevant)
**Component**: `app/components/kudos/`, `app/lib/kudos/`, `app/lib/liveboard/kudos-write.ts`, `/api/kudos`, `/api/kudos/[id]`, `/api/kudos/upload`, `/api/sunners/search`, `/api/me`
**Status**: Resolved

## What Happened

Implemented the "Viết Kudo" (Write Kudo) modal — the first mutation path in the Kudos data layer. The Live board and profile pages were previously read-only (GET feed + like). This PR adds:

- **Create kudo** (`POST /api/kudos`) with rich-text body, recipient, title ("Danh hiệu"), hashtag, optional image, and optional anonymous posting.
- **Edit kudo** (`PATCH /api/kudos/[id]`) scoped to the sender's own kudos (ownership guard).
- **Image upload** (`POST /api/kudos/upload`) with magic-byte MIME validation and 5 MB cap.
- **Recipient search** (`GET /api/sunners/search`) powering the @mention autocomplete in the editor.
- **Current user identity** (`GET /api/me`) returning the session user's id for the form.

## Why This Is Architecturally Significant

This is the project's **first mutation flow** against the Kudos table and the **first use of Supabase Storage**. It sets the precedent for:

- Server-side HTML sanitization before persistence (isomorphic-dompurify on the API route, not the client).
- Anonymous posting enforced server-side: the sender's identity is masked at write time, not masked at read time, so the anonymity cannot be stripped by reading the raw row.
- Upload security via magic-byte inspection rather than trusting the `Content-Type` header.
- The `kudo-images` Supabase Storage bucket (public read, write via service_role only).

## DB Migration

**Migration file:** `supabase/migrations/20260629120000_kudo_write_fields.sql`

| Change | Details |
|--------|---------|
| `kudos.title` added | `TEXT NOT NULL DEFAULT ''` — "Danh hiệu" field |
| `kudos.is_anonymous` added | `BOOLEAN NOT NULL DEFAULT FALSE` |
| `kudo-images` Storage bucket created | Public read; no direct client writes |

The seed file was not modified — existing seed rows receive the column defaults.

## API Surface

| Route | Method | Auth | Notes |
|-------|--------|------|-------|
| `/api/kudos` | POST | Required | Create kudo; HTML sanitized server-side |
| `/api/kudos/[id]` | PATCH | Required | Edit kudo; sender-ownership guard enforced |
| `/api/kudos/upload` | POST | Required | Image upload; magic-byte validated; 5 MB cap |
| `/api/sunners/search` | GET | Required | `?q=` full-text search for recipient autocomplete |
| `/api/me` | GET | Required | Returns `{ id }` for the current session user |

All mutation routes require an authenticated session. The ownership guard on `PATCH /api/kudos/[id]` queries the sender column before allowing edits.

## New Libraries

| File | Purpose |
|------|---------|
| `app/lib/kudos/validation.ts` | Zod schemas for create/edit payloads |
| `app/lib/kudos/use-kudo-form.ts` | React hook encapsulating form state, validation, submit lifecycle |
| `app/lib/kudos/upload-image.ts` | Client-side upload helper (calls `/api/kudos/upload`) |
| `app/lib/liveboard/kudos-write.ts` | Server-side DB mutations (`insertKudo`, `updateKudo`) |

## New UI Components

All under `app/components/kudos/`:

- `kudo-modal.tsx` — top-level compose/edit modal shell
- `kudo-editor.tsx` — Tiptap rich-text editor instance
- `recipient-field.tsx` — @mention autocomplete against `/api/sunners/search`
- `title-field.tsx` — "Danh hiệu" text input
- `hashtag-field.tsx` — hashtag selector
- `image-field.tsx` — image picker wired to the upload API
- `anonymous-toggle.tsx` — is-anonymous checkbox
- `kudo-compose.tsx` — orchestrates all fields + `use-kudo-form`

New dependency: `@tiptap/*` (rich-text editor) + `isomorphic-dompurify` (server-side HTML sanitization).

## Feed Card Changes

The existing Live board feed card was updated to:

- Render `kudos.title` ("Danh hiệu") when non-empty.
- Render sanitized rich-text HTML (sanitized at read time on the client as a second pass; primary sanitization is at write time on the server).
- Anonymize sender display: when `is_anonymous=true`, the server masks the sender name/avatar before the card receives the data.
- Show an "Edit" pencil button on kudos where `sender_id` matches the session user.

## Security Details

| Concern | Mechanism |
|---------|-----------|
| XSS via rich-text body | `isomorphic-dompurify` on the API route before `insertKudo` / `updateKudo` |
| Anonymous identity exposure | Sender masked at the DB query layer (server-side), not at render time |
| Unauthorized kudo edits | Ownership guard: `PATCH` checks `kudos.sender_id = currentUserId()` before update |
| Malicious file uploads | Magic-byte check on first bytes of upload buffer; rejects files whose bytes don't match the declared type |
| Upload size abuse | Hard 5 MB cap enforced on the upload route |

## i18n

New `writeKudos` namespace added to `messages/{vi,en}.json`.

## Concerns for Future Sessions

1. **No RLS on `kudos` writes.** Mutations run under `service_role` with application-level ownership checks. If a future audit requires DB-layer enforcement, add RLS policies to the migration.

2. **`kudo-images` bucket is public read.** Anyone with the storage URL can access uploaded images. If private kudos (non-anonymous but scoped) are added later, the bucket policy will need revision.

3. **Tiptap adds bundle weight.** `@tiptap/*` is loaded into the modal. If the modal becomes a hot path, consider dynamic import to avoid including Tiptap in the initial bundle.

4. **Sanitization is write-time only on the server.** The client renders raw HTML from the DB (trusting the server's sanitization pass). If the sanitization step is bypassed by a future migration or seed, old rows could contain unsanitized HTML. A read-time sanitization pass on the client (or a migration to re-sanitize existing rows) should be considered before any data import from untrusted sources.

## Lessons Learned

1. **Sanitize at write time, on the server.** Running dompurify on the API route means the stored HTML is always clean regardless of what the client sends. Client-side sanitization is defense-in-depth, not the primary guard.

2. **Anonymity must be enforced at the data layer, not the render layer.** Masking the sender in the query response (rather than in the component) means the raw sender identity is never transmitted to the browser for anonymous kudos. Components cannot accidentally leak it.

3. **Magic-byte validation is not optional for user uploads.** Trusting `Content-Type` headers allows trivial MIME spoofing. Reading the first bytes of the buffer and comparing against known signatures is a small cost with significant security value.

4. **Ownership guards belong on the API route, not the client.** The edit button being visible only for own kudos is a UX affordance. The actual ownership check must be on the server — any client can issue a `PATCH` directly.

5. **Extract form logic into a dedicated hook early.** `use-kudo-form.ts` encapsulates validation, dirty tracking, submit state, and error handling. The modal component stays presentational. This pattern scales to other mutation forms without copying state management code.

## Closes Deferred Item

This feature closes the "Sửa bài viết (Edit Post)" item deferred in `docs/journals/20260629-profile-other-user.md` § Next Steps.

---

**Files created:**
- `supabase/migrations/20260629120000_kudo_write_fields.sql`
- `app/lib/kudos/validation.ts`
- `app/lib/kudos/use-kudo-form.ts`
- `app/lib/kudos/upload-image.ts`
- `app/lib/liveboard/kudos-write.ts`
- `app/api/kudos/route.ts` (POST)
- `app/api/kudos/[id]/route.ts` (PATCH)
- `app/api/kudos/upload/route.ts` (POST)
- `app/api/sunners/search/route.ts` (GET)
- `app/api/me/route.ts` (GET)
- `app/components/kudos/kudo-modal.tsx`
- `app/components/kudos/kudo-editor.tsx`
- `app/components/kudos/recipient-field.tsx`
- `app/components/kudos/title-field.tsx`
- `app/components/kudos/hashtag-field.tsx`
- `app/components/kudos/image-field.tsx`
- `app/components/kudos/anonymous-toggle.tsx`
- `app/components/kudos/kudo-compose.tsx`
- `messages/{vi,en}.json` (new `writeKudos` namespace)

**Files modified:**
- `app/components/liveboard/` (feed card: title, rich-text HTML, anonymous sender, edit button)
