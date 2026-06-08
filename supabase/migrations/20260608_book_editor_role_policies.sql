create or replace function public.is_book_manager()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') in ('admin', 'editor');
$$;

grant execute on function public.is_book_manager() to authenticated;

drop policy if exists "Book managers can read all audiobooks" on public.audiobooks;
create policy "Book managers can read all audiobooks"
on public.audiobooks
for select
to authenticated
using (public.is_book_manager());

drop policy if exists "Book managers can create audiobooks" on public.audiobooks;
create policy "Book managers can create audiobooks"
on public.audiobooks
for insert
to authenticated
with check (public.is_book_manager());

drop policy if exists "Book managers can update audiobooks" on public.audiobooks;
create policy "Book managers can update audiobooks"
on public.audiobooks
for update
to authenticated
using (public.is_book_manager())
with check (public.is_book_manager());

drop policy if exists "Book managers can delete audiobooks" on public.audiobooks;
create policy "Book managers can delete audiobooks"
on public.audiobooks
for delete
to authenticated
using (public.is_book_manager());

drop policy if exists "Book managers can read all chapters" on public.chapters;
create policy "Book managers can read all chapters"
on public.chapters
for select
to authenticated
using (public.is_book_manager());

drop policy if exists "Book managers can create chapters" on public.chapters;
create policy "Book managers can create chapters"
on public.chapters
for insert
to authenticated
with check (public.is_book_manager());

drop policy if exists "Book managers can update chapters" on public.chapters;
create policy "Book managers can update chapters"
on public.chapters
for update
to authenticated
using (public.is_book_manager())
with check (public.is_book_manager());

drop policy if exists "Book managers can delete chapters" on public.chapters;
create policy "Book managers can delete chapters"
on public.chapters
for delete
to authenticated
using (public.is_book_manager());
