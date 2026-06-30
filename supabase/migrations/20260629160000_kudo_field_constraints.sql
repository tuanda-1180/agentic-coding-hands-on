-- Defense-in-depth length constraints on kudo write fields (mirrors the
-- application-layer validation in app/lib/kudos/validation.ts), so a direct
-- SQL write through service_role can't bypass the limits.
alter table public.kudos
  add constraint kudos_anonymous_name_len
    check (anonymous_name is null or char_length(anonymous_name) <= 50),
  add constraint kudos_title_len
    check (title is null or char_length(title) <= 100),
  add constraint kudos_content_len
    check (char_length(content) <= 10000);
