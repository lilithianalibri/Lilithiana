create extension if not exists pgcrypto;

create table if not exists public.audiobooks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  author text not null,
  translator text,
  narrator text not null,
  category text not null,
  description text not null,
  copyright_notice text,
  total_duration_seconds integer not null default 0 check (total_duration_seconds >= 0),
  cover_from text not null,
  cover_via text not null,
  cover_to text not null,
  vibe text not null,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.audiobooks(id) on delete cascade,
  slug text not null,
  chapter_index integer not null check (chapter_index > 0),
  title text not null,
  duration_seconds integer not null check (duration_seconds >= 0),
  audio_url text not null,
  audio_storage_key text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (book_id, slug),
  unique (book_id, chapter_index)
);

create table if not exists public.listening_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id uuid not null references public.audiobooks(id) on delete cascade,
  chapter_id uuid references public.chapters(id) on delete set null,
  position_seconds integer not null default 0 check (position_seconds >= 0),
  completed_seconds integer not null default 0 check (completed_seconds >= 0),
  completed boolean not null default false,
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, book_id)
);

create table if not exists public.chapter_bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  position_seconds integer not null check (position_seconds >= 0),
  label text,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_audiobooks_updated_at on public.audiobooks;
create trigger trg_audiobooks_updated_at
before update on public.audiobooks
for each row
execute function public.set_updated_at();

create index if not exists idx_chapters_book on public.chapters(book_id, chapter_index);
create index if not exists idx_progress_book on public.listening_progress(book_id);
create index if not exists idx_bookmarks_user on public.chapter_bookmarks(user_id, created_at desc);

alter table public.audiobooks
  add column if not exists translator text;

alter table public.audiobooks
  add column if not exists copyright_notice text;

alter table public.chapters
  add column if not exists audio_storage_key text;

alter table public.audiobooks enable row level security;
alter table public.chapters enable row level security;
alter table public.listening_progress enable row level security;
alter table public.chapter_bookmarks enable row level security;

drop policy if exists "Public can read published audiobooks" on public.audiobooks;
create policy "Public can read published audiobooks"
on public.audiobooks
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Public can read chapters of published books" on public.chapters;
create policy "Public can read chapters of published books"
on public.chapters
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.audiobooks b
    where b.id = chapters.book_id
      and b.is_published = true
  )
);

drop policy if exists "Users can read own progress" on public.listening_progress;
create policy "Users can read own progress"
on public.listening_progress
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own progress" on public.listening_progress;
create policy "Users can insert own progress"
on public.listening_progress
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own progress" on public.listening_progress;
create policy "Users can update own progress"
on public.listening_progress
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can read own bookmarks" on public.chapter_bookmarks;
create policy "Users can read own bookmarks"
on public.chapter_bookmarks
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can add own bookmarks" on public.chapter_bookmarks;
create policy "Users can add own bookmarks"
on public.chapter_bookmarks
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own bookmarks" on public.chapter_bookmarks;
create policy "Users can delete own bookmarks"
on public.chapter_bookmarks
for delete
to authenticated
using ((select auth.uid()) = user_id);
