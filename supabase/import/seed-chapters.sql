-- Generato automaticamente da scripts/build-sql-from-manifest.mjs
-- Questo script crea/aggiorna automaticamente anche i libri in public.audiobooks.

begin;

-- briganta
insert into public.audiobooks (
  slug,
  title,
  author,
  narrator,
  category,
  description,
  total_duration_seconds,
  cover_from,
  cover_via,
  cover_to,
  vibe,
  is_published
) values (
  'briganta',
  'Briganta',
  'Maria Rosa Cutrufelli',
  'Antonella Civale',
  'Narrativa',
  'Dal carcere in cui e rinchiusa ormai da vent''anni, una donna rivive i suoi giorni da briganta quando, all''indomani dell''unita d''Italia, si aggrego alle bande di ribelli che sconvolsero le regioni meridionali nella speranza di un illusorio riscatto sociale. Prima pubblicazione: 1990.',
  14395,
  '#6e1f3b',
  '#bc6f79',
  '#26131d',
  'Romanzo storico, memoria femminile, riscatto sociale',
  true
)
on conflict (slug) do update set
  title = excluded.title,
  author = excluded.author,
  narrator = excluded.narrator,
  category = excluded.category,
  description = excluded.description,
  cover_from = excluded.cover_from,
  cover_via = excluded.cover_via,
  cover_to = excluded.cover_to,
  vibe = excluded.vibe,
  total_duration_seconds = excluded.total_duration_seconds,
  is_published = excluded.is_published;

with target_book as (
  select id from public.audiobooks where slug = 'briganta'
)
insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'intro', 1, 'Intro', 20, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/01-intro.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'primavera-1883', 2, 'Primavera 1883', 1288, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/02-primavera-1883.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'marzo-1861', 3, 'Marzo 1861', 2112, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/03-marzo-1861.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'aprile-1861', 4, 'Aprile 1861', 1299, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/04-aprile-1861.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'maggio-1861', 5, 'Maggio 1861', 1646, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/05-maggio-1861.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'giugno-1861', 6, 'Giugno 1861', 2529, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/06-giugno-1861.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'luglio-1861', 7, 'Luglio 1861', 1921, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/07-luglio-1861.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'agosto-1861', 8, 'Agosto 1861', 2418, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/08-agosto-1861.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'primavera-1863', 9, 'Primavera 1863', 576, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/09-primavera-1863.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'estate-1883', 10, 'Estate 1883', 130, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/10-estate-1883.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'postfazione-la-briganta-e-io', 11, 'Postfazione. La briganta e io', 456, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/11-postfazione-la-briganta-e-io.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

update public.audiobooks book
set total_duration_seconds = (
  select coalesce(sum(ch.duration_seconds), 0)
  from public.chapters ch
  where ch.book_id = book.id
)
where book.slug = 'briganta';

commit;
