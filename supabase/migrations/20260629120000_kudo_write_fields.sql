-- Write-path additions for the "Viết Kudo" modal (create / edit).
-- 1. New kudos columns: title ("Danh hiệu") + is_anonymous.
-- 2. Storage bucket for attached kudo images.
-- ---------------------------------------------------------------------------

-- Kudo "Danh hiệu" (title) — shown as the kudo headline in the feed.
-- Nullable at the DB level so existing seed rows stay valid; the API/form layer
-- enforces it as required for new submissions.
alter table public.kudos
  add column if not exists title text;

-- Allow sending a kudo anonymously (hide sender identity in the feed).
alter table public.kudos
  add column if not exists is_anonymous boolean not null default false;

-- ---------------------------------------------------------------------------
-- Storage bucket for kudo image attachments (public read; writes go through the
-- server service_role client which bypasses RLS).
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('kudo-images', 'kudo-images', true)
on conflict (id) do nothing;
