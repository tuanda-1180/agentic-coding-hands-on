-- Sun* Kudos Live board schema
-- Local Supabase (Postgres). Server API routes use the service_role key (bypasses RLS).

-- ---------------------------------------------------------------------------
-- Sunners (member profiles)
-- ---------------------------------------------------------------------------
create table if not exists public.sunners (
  id              uuid primary key default gen_random_uuid(),
  email           text unique not null,
  name            text not null,
  avatar_url      text,
  department      text not null,
  title           text,                       -- danh hiệu (e.g. "IDOL GIỚI TRẺ")
  star_count      int  not null default 0,    -- số hoa thị 0..3
  is_current_user boolean not null default false, -- demo: the signed-in user for stats
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Kudos (thank-you posts)
-- ---------------------------------------------------------------------------
create table if not exists public.kudos (
  id          uuid primary key default gen_random_uuid(),
  sender_id   uuid not null references public.sunners(id) on delete cascade,
  receiver_id uuid not null references public.sunners(id) on delete cascade,
  content     text not null,
  category    text,                            -- primary hashtag/category
  tags        text[] not null default '{}',    -- ['#Dedicated', '#Inspiring', ...]
  images      text[] not null default '{}',    -- attachment image urls (max 5)
  created_at  timestamptz not null default now()
);

create index if not exists kudos_created_at_idx on public.kudos (created_at desc);
create index if not exists kudos_receiver_idx   on public.kudos (receiver_id);
create index if not exists kudos_sender_idx     on public.kudos (sender_id);
create index if not exists kudos_category_idx   on public.kudos (category);

-- ---------------------------------------------------------------------------
-- Hearts (likes) — one per (kudos, user); is_special => +2 hearts to receiver
-- ---------------------------------------------------------------------------
create table if not exists public.hearts (
  id         uuid primary key default gen_random_uuid(),
  kudos_id   uuid not null references public.kudos(id) on delete cascade,
  user_id    uuid not null references public.sunners(id) on delete cascade,
  is_special boolean not null default false,
  created_at timestamptz not null default now(),
  unique (kudos_id, user_id)
);

create index if not exists hearts_kudos_idx on public.hearts (kudos_id);

-- ---------------------------------------------------------------------------
-- Secret boxes (gift boxes) — per user, opened/unopened
-- ---------------------------------------------------------------------------
create table if not exists public.secret_boxes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.sunners(id) on delete cascade,
  is_opened  boolean not null default false,
  prize      text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Leaderboards
-- ---------------------------------------------------------------------------
create table if not exists public.gift_recipients ( -- "10 SUNNER NHẬN QUÀ MỚI NHẤT"
  id                uuid primary key default gen_random_uuid(),
  sunner_id         uuid not null references public.sunners(id) on delete cascade,
  prize_description text not null,
  created_at        timestamptz not null default now()
);

create table if not exists public.rank_ups (        -- "10 SUNNER CÓ SỰ THĂNG HẠNG MỚI NHẤT"
  id          uuid primary key default gen_random_uuid(),
  sunner_id   uuid not null references public.sunners(id) on delete cascade,
  description text not null,                          -- e.g. "Vừa đạt 2 hoa thị"
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- View: kudos joined with heart counts (used by feed/highlights)
-- ---------------------------------------------------------------------------
create or replace view public.kudos_with_hearts as
select
  k.*,
  coalesce(h.cnt, 0)::int as heart_count
from public.kudos k
left join (
  select kudos_id, count(*)::int as cnt
  from public.hearts
  group by kudos_id
) h on h.kudos_id = k.id;

-- ---------------------------------------------------------------------------
-- Grants — local API uses service_role (server side); anon/authenticated read.
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on all tables in schema public to service_role;
grant select on all tables in schema public to anon, authenticated;
