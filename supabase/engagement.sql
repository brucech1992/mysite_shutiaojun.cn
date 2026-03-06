-- 1) User profiles (email as unique identifier)
create table if not exists public.visitor_profiles (
  email text primary key,
  username text not null,
  updated_at timestamptz not null default now()
);

-- 2) Likes (one like per email per post)
create table if not exists public.post_likes (
  id bigint generated always as identity primary key,
  post_id text not null,
  email text not null,
  created_at timestamptz not null default now(),
  constraint post_likes_unique unique (post_id, email)
);

-- 3) Comments
create table if not exists public.post_comments (
  id bigint generated always as identity primary key,
  post_id text not null,
  email text not null,
  username text not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- 4) Views (one view per browser token per post)
create table if not exists public.post_views (
  id bigint generated always as identity primary key,
  post_id text not null,
  viewer_token text not null,
  created_at timestamptz not null default now(),
  constraint post_views_unique unique (post_id, viewer_token)
);

-- Optional indexes for faster read
create index if not exists idx_post_likes_post_id on public.post_likes(post_id);
create index if not exists idx_post_comments_post_id_created_at on public.post_comments(post_id, created_at desc);
create index if not exists idx_post_views_post_id on public.post_views(post_id);

-- Enable RLS
alter table public.visitor_profiles enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_comments enable row level security;
alter table public.post_views enable row level security;

-- Public anonymous access policies (open write/read model)
-- NOTE: This is convenient for low-risk public interaction. Add rate limit / anti-spam later.
drop policy if exists "public read profiles" on public.visitor_profiles;
create policy "public read profiles" on public.visitor_profiles
for select to anon using (true);

drop policy if exists "public write profiles" on public.visitor_profiles;
create policy "public write profiles" on public.visitor_profiles
for insert to anon with check (true);

drop policy if exists "public update profiles" on public.visitor_profiles;
create policy "public update profiles" on public.visitor_profiles
for update to anon using (true) with check (true);

drop policy if exists "public read likes" on public.post_likes;
create policy "public read likes" on public.post_likes
for select to anon using (true);

drop policy if exists "public write likes" on public.post_likes;
create policy "public write likes" on public.post_likes
for insert to anon with check (true);

drop policy if exists "public read comments" on public.post_comments;
create policy "public read comments" on public.post_comments
for select to anon using (true);

drop policy if exists "public write comments" on public.post_comments;
create policy "public write comments" on public.post_comments
for insert to anon with check (true);

drop policy if exists "public read views" on public.post_views;
create policy "public read views" on public.post_views
for select to anon using (true);

drop policy if exists "public write views" on public.post_views;
create policy "public write views" on public.post_views
for insert to anon with check (true);
