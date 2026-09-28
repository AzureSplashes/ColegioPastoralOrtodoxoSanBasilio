-- Run in the Supabase SQL Editor before enabling the new forum and grade pages.
-- Existing profiles(id, role) is used by the portal's authorization middleware.

create table if not exists public.forum_threads (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 5 and 160),
  body text not null check (char_length(body) between 10 and 5000),
  created_at timestamptz not null default now()
);

create table if not exists public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.forum_threads(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 2 and 5000),
  created_at timestamptz not null default now()
);

create index if not exists forum_threads_recent_idx on public.forum_threads (created_at desc);
create index if not exists forum_posts_thread_idx on public.forum_posts (thread_id, created_at);

create table if not exists public.portal_grades (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  course text not null,
  assessment text not null,
  term text,
  score numeric(6,2) not null check (score >= 0),
  max_score numeric(6,2) not null check (max_score > 0 and score <= max_score),
  created_at timestamptz not null default now()
);
create index if not exists portal_grades_student_idx on public.portal_grades (student_id, course);

alter table public.profiles add column if not exists display_name text;
update public.profiles p
set display_name = coalesce(nullif(u.raw_user_meta_data->>'full_name', ''), split_part(u.email, '@', 1))
from auth.users u
where p.id = u.id and nullif(p.display_name, '') is null;

alter table public.forum_threads enable row level security;
alter table public.forum_posts enable row level security;
alter table public.portal_grades enable row level security;

create or replace function public.portal_member()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = (select auth.uid()) and role in ('alumno','profesor','admin'));
$$;
create or replace function public.portal_staff()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = (select auth.uid()) and role in ('profesor','admin'));
$$;
revoke all on function public.portal_member() from public;
revoke all on function public.portal_staff() from public;
grant execute on function public.portal_member() to authenticated;
grant execute on function public.portal_staff() to authenticated;

create policy "Portal members read threads" on public.forum_threads for select to authenticated using (public.portal_member());
create policy "Portal members create their threads" on public.forum_threads for insert to authenticated with check (public.portal_member() and author_id = (select auth.uid()));
create policy "Portal members read posts" on public.forum_posts for select to authenticated using (public.portal_member());
create policy "Portal members create their posts" on public.forum_posts for insert to authenticated with check (public.portal_member() and author_id = (select auth.uid()));

create policy "Students read their grades and staff read all" on public.portal_grades for select to authenticated using (student_id = (select auth.uid()) or public.portal_staff());
create policy "Staff publish grades" on public.portal_grades for insert to authenticated with check (public.portal_staff());
create policy "Staff update grades" on public.portal_grades for update to authenticated using (public.portal_staff()) with check (public.portal_staff());
create policy "Staff see student names" on public.profiles for select to authenticated using (public.portal_staff());

grant select, insert on public.forum_threads, public.forum_posts to authenticated;
grant select, insert, update on public.portal_grades to authenticated;
grant select (id, role, display_name) on public.profiles to authenticated;
