-- Secret Box open path: the SELECT (oldest unopened) and COUNT (unopened
-- remaining) queries both filter on (user_id, is_opened) and order by
-- created_at. Without an index every count is a sequential scan. This composite
-- covers all three access patterns in one b-tree.
create index if not exists secret_boxes_user_open_created_idx
  on public.secret_boxes (user_id, is_opened, created_at);

-- Defense-in-depth: prize is written only by the server (always a catalog id),
-- but a direct SQL write through service_role could otherwise store anything.
-- Constrain it to the known badge set (mirrors app/lib/secret-box/badges.ts).
alter table public.secret_boxes
  add constraint secret_boxes_prize_valid
    check (
      prize is null
      or prize in (
        'stay_gold',
        'flow_to_horizon',
        'touch_of_light',
        'beyond_the_boundary',
        'revival',
        'root_further'
      )
    );
