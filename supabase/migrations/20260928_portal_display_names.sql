-- Run after 20260928_portal_forums_grades.sql.
-- Members may change only their own display name; portal roles remain staff-managed.

revoke update on table public.profiles from anon, authenticated;
revoke update (role) on table public.profiles from anon, authenticated;

create or replace function public.set_portal_display_name(new_name text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  cleaned_name text := btrim(regexp_replace(new_name, '[[:space:]]+', ' ', 'g'));
begin
  if (select auth.uid()) is null or not public.portal_member() then
    raise exception 'Portal membership required';
  end if;
  if cleaned_name is null or char_length(cleaned_name) < 2 or char_length(cleaned_name) > 80 then
    raise exception 'Display name must be between 2 and 80 characters';
  end if;
  update public.profiles
     set display_name = cleaned_name
   where id = (select auth.uid());
  if not found then raise exception 'Profile not found'; end if;
  return cleaned_name;
end;
$$;

revoke all on function public.set_portal_display_name(text) from public;
grant execute on function public.set_portal_display_name(text) to authenticated;

create policy "Portal members see member names" on public.profiles
for select to authenticated using (public.portal_member());
