-- Anonymous display name (alias) for kudos sent anonymously.
-- Shown as the sender in the feed instead of the real identity when is_anonymous.
alter table public.kudos
  add column if not exists anonymous_name text;
