-- Run after 20260928_portal_forums_grades.sql.
-- Professors and admins are the portal staff. RLS enforces this for every write.

create table if not exists public.portal_announcements (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 5 and 160),
  body text not null check (char_length(body) between 10 and 5000),
  created_at timestamptz not null default now()
);
create index if not exists portal_announcements_recent_idx on public.portal_announcements (created_at desc);
alter table public.portal_announcements enable row level security;
create policy "Members read portal announcements" on public.portal_announcements for select to authenticated using (public.portal_member());
create policy "Staff publish portal announcements" on public.portal_announcements for insert to authenticated with check (public.portal_staff() and author_id = (select auth.uid()));
create policy "Staff remove portal announcements" on public.portal_announcements for delete to authenticated using (public.portal_staff());
grant select, insert, delete on public.portal_announcements to authenticated;

create policy "Staff remove forum threads" on public.forum_threads for delete to authenticated using (public.portal_staff());
create policy "Staff remove forum posts" on public.forum_posts for delete to authenticated using (public.portal_staff());
grant delete on public.forum_threads, public.forum_posts to authenticated;

create policy "Staff remove grades" on public.portal_grades for delete to authenticated using (public.portal_staff());
grant delete on public.portal_grades to authenticated;
