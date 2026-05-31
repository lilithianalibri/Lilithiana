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
  'La briganta',
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

-- cera-una-volta-la-rete-lilith-e-ce-ancora
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
  'cera-una-volta-la-rete-lilith-e-ce-ancora',
  'C''era una volta la rete Lilith. E c''è ancora',
  'Simonetta De Fazi',
  'Voce da aggiornare',
  'Saggistica',
  'Racconto e memoria politica della Rete Lilith, rete informativa dei centri di documentazione, archivi e biblioteche delle donne.',
  1592,
  '#0f3d35',
  '#1f5c4a',
  '#071c1a',
  'Archivi femministi, memoria, reti delle donne',
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
  select id from public.audiobooks where slug = 'cera-una-volta-la-rete-lilith-e-ce-ancora'
)
insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'retelilith', 1, 'Cos’è stata e quali scelte ha compiuto ed indicato nel mondo femminista la Rete Lilith', 1592, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/cera-una-volta-la-rete-lilith-e-ce-ancora/retelilith.wav' from target_book
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
where book.slug = 'cera-una-volta-la-rete-lilith-e-ce-ancora';

-- la-ballata-di-nina-simone
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
  'la-ballata-di-nina-simone',
  'La ballata di Nina Simone',
  'Francesca Genti',
  'Voce da aggiornare',
  'Narrativa',
  'Romanzo in versi dedicato alla vita, alla musica e alla presa di coscienza politica di Nina Simone. Prima pubblicazione: 2021.',
  4427,
  '#1a1838',
  '#4a2f76',
  '#080711',
  'Romanzo in versi, musica, biografia poetica',
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
  select id from public.audiobooks where slug = 'la-ballata-di-nina-simone'
)
insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'intro', 1, 'Intro', 14, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/01intro.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'invocazionione', 2, 'Invocazione', 126, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/02invocazionione.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'cantieunice', 3, 'Canti di Eunice Waymon', 299, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/03cantieunice.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'amicizia', 4, 'Canto dell''amicizia', 212, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/04amicizia.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'umiliazione', 5, 'Canto dell''umiliazione', 212, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/05umiliazione.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sogno', 6, 'Il sogno di Nina', 165, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/06sogno.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'primo', 7, 'Canto del primo amore', 197, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/07primo.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'lontananza', 8, 'Canto della lontananza', 197, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/08lontananza.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'zombie', 9, 'zombie', 202, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/09zombie.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'harlem', 10, 'Canto di Harlem', 205, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/10harlem.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'errore', 11, 'Ricetta per un Errore Madornale eseguito a regola d''arte (improvvisazione su sinnerman, Nina Simone)', 74, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/11errore.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sconfitta', 12, 'Canto della sconfitta', 176, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/12sconfitta.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'forza', 13, 'Canto della forza e del sudore', 204, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/13forza.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'imprwork', 14, 'Improvvisazione su "Sinnerman", Nina Simone', 42, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/14imprwork.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'notte', 15, 'Canto della notte', 204, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/15notte.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'atlantic', 16, 'Canto di Atlantic City', 189, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/16atlantic.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'assoluto', 17, 'L''orecchio assoluto Improvvisazione I hear music, Ella Fitzgerald', 73, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/17assoluto.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'illuminazione', 18, 'Canto dell''illuminazione', 198, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/18illuminazione.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'nina', 19, 'Canto di Nina Simone', 203, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/19nina.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'origine', 20, 'Canto dell''origine dei soldi', 187, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/20origine.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'donross', 21, 'Canto di Don Ross', 196, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/21donross.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'whykeeponbreaking', 22, 'Improvvisazione su Why keep on breaking my heart, Nina Simone', 42, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/22whykeeponbreaking.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'dollari', 23, 'Canto dei tremila dollari', 199, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/23dollari.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'beethoven', 24, 'Scordatevi Beethoven (improvvisazione su roll over Beethoven, Chuck Berry)', 20, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/24beethoven.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'littlegirlblue', 25, 'Canto di Little girl Blue', 203, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/25littlegirlblue.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'townhall', 26, 'Canto del Town Hall', 196, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/26townhall.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'stroud', 27, 'Canto di Andrew Stroud', 192, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/27stroud.wav' from target_book
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
where book.slug = 'la-ballata-di-nina-simone';

-- scrittrici-italiane-dal-xiii-al-xxi-secolo-profili-biobibliografici
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
  'scrittrici-italiane-dal-xiii-al-xxi-secolo-profili-biobibliografici',
  'Scrittrici italiane: dal XIII al XXI secolo: profili biobibliografici',
  'Luciana Tufani',
  'Voce da aggiornare',
  'Saggistica',
  'Descrizione temporanea per Scrittrici Italiane Dal Xiii Al Xxi Secolo Profili Biobibliografici.',
  7550,
  '#221433',
  '#4a2a68',
  '#0f0a19',
  'Profili biobibliografici, storia letteraria, scrittrici italiane',
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
  select id from public.audiobooks where slug = 'scrittrici-italiane-dal-xiii-al-xxi-secolo-profili-biobibliografici'
)
insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'introscrittrici', 1, 'Introduzione', 19, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/scrittrici-italiane-dal-xiii-al-xxi-secolo-profili-biobibliografici/00introscrittrici.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'premessascrittrici', 2, 'Premessa', 184, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/scrittrici-italiane-dal-xiii-al-xxi-secolo-profili-biobibliografici/02premessascrittrici.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'scrittrici', 3, 'Breve storia della scrittura delle donne in Italia', 7347, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/scrittrici-italiane-dal-xiii-al-xxi-secolo-profili-biobibliografici/03scrittrici.wav' from target_book
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
where book.slug = 'scrittrici-italiane-dal-xiii-al-xxi-secolo-profili-biobibliografici';

-- server-donne-leccami-la-password
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
  'server-donne-leccami-la-password',
  'Server Donne. Leccami la password',
  'Marzia Vaccari',
  'Voce da aggiornare',
  'Saggistica',
  'Ricostruzione biografica, storica e archivistica dell''esperienza Server Donne, nata nel 1996 come infrastruttura digitale femminista. Prima pubblicazione: 2025.',
  36500,
  '#351124',
  '#7a1d49',
  '#150812',
  'Tecnologie femministe, archivi digitali, autonomia in rete',
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
  select id from public.audiobooks where slug = 'server-donne-leccami-la-password'
)
insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'introsd', 1, 'Intro', 13, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/00introsd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'serverdonne', 2, 'I server femministi sono un sogno ancora lontano', 542, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/01serverdonne.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'serverdonne-unito', 3, 'Le infrastrutture digitali pubbliche', 408, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/02serverdonne_unito.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'serverdonne-2', 4, 'Tempo tecnologico, crossmedialità e assemblaggi cognitivi', 776, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/03serverdonne.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-unito-3', 5, 'Coinvolgimento personale e l’amicizia con le macchine', 634, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/04sd_unito_3.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'severdonne', 6, 'Scrivere e legare tutto dentro a un artefatto tecnico', 276, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/05severdonne.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'serverdonne-3', 7, '2 Server Donne: una macchina femminista', 201, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/06serverdonne.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'serverdonne-4', 8, 'Prima fase: dal 1996 al 2010', 266, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/07serverdonne.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'serverdonne-5', 9, 'La scena politica e culturale', 487, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/08serverdonne.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'serverdonne-6', 10, 'Nella scena dei femminismi', 542, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/09serverdonne.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'serverdonne-7', 11, 'A cavallo del nuovo millennio', 425, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/10serverdonne.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 's', 12, 'La società neoliberista', 151, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/11s.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd', 13, 'Il paradigma del riconoscimento', 323, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/12sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-2', 14, 'Seconda fase: dal 2011 al 2016', 208, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/13sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-3', 15, 'Populismo e sovranismo', 244, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/14sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-4', 16, 'Femmismo moralista?', 548, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/15sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'nuovosd', 17, 'Tra mediatizzazione e capitalismo delle piattaforme', 240, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/16nuovosd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-5', 18, 'La colonizzazione attraverso le piattaforme', 436, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/17sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-6', 19, 'L’intermediazione', 628, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/18sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-7', 20, 'IV ondata', 790, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/19sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-8', 21, 'Cyberfemminismo', 412, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/20sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-9', 22, 'VNS matrix', 315, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/21sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-10', 23, 'L’amicizia con le macchine e il postumano', 648, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/22sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-11', 24, '3 I molti inizi', 1109, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/23sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-unito', 25, 'Gli inizi del Server Donne', 1367, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/24sd_unito.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-unito-2', 26, 'All’origine della macchina server donne', 440, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/25sd_unito.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-12', 27, 'Abitare la rete', 625, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/26sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-13', 28, 'Essere un internet server provider', 595, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/27sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-14', 29, 'Il server all’epoca dei social', 993, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/28sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, '29', 30, 'Il networking fai da te', 299, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/29.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-15', 31, 'La sistemista inesistente', 690, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/30sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-16', 32, 'Agilulfo...', 649, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/31sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-17', 33, 'L’autonoma gestione di un server', 502, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/32sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-18', 34, 'I luoghi fisici del progetto SD...', 738, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/33sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-19', 35, 'CRM...', 712, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/34sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-20', 36, 'R@W-Recycle@women', 339, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/35sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-21', 37, 'Il movimento degli hackerspace femministi...', 897, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/36sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-22', 38, 'Altri inizi Cataloghi-biblioteche-sistemi informativi...', 1088, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/37sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-23', 39, 'Nel colto linguaggio femminista di allora...', 1429, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/38sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-24', 40, 'L’ironia della memoria perduta', 218, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/39sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-25', 41, '5 Dalla cultura dei siti alla conversazione dei social...', 1057, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/40sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-26', 42, 'Leccami la password...', 906, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/41sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-27', 43, 'Women.it con Archivarix...', 1039, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/42sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-28', 44, 'La posta elettronica prima dei social e degli smartphone', 712, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/43sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-29', 45, 'Crossmedialità', 955, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/44sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-30', 46, '6 Cercatrice di Rete...', 1512, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/45sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-31', 47, 'La costruzione dell’artefatto, la realizzazione di un motore di ricerca gender oriented...', 976, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/46sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-32', 48, 'Cercatrice per la Regione Emilia-Romagna e la proposta di un ricco ingaggio...', 1696, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/47sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-33', 49, '7 Separazione non voluta...', 1636, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/48sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sd-34', 50, 'Il ricatto degli spettri...', 3773, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/49sd.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'finalesd', 51, 'Post scriptum', 35, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/50finalesd.wav' from target_book
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
where book.slug = 'server-donne-leccami-la-password';

-- un-americana-a-parigi
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
  'un-americana-a-parigi',
  'Un''americana a Parigi',
  'Margherita Giacobino (Elinor Rigby)',
  'Voce da aggiornare',
  'Narrativa',
  'Quattro racconti ambientati nella Parigi degli anni Venti, pubblicati con lo pseudonimo Elinor Rigby.',
  30455,
  '#123642',
  '#1f5a63',
  '#081820',
  'Racconti, Parigi anni Venti, scrittura lesbica',
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
  select id from public.audiobooks where slug = 'un-americana-a-parigi'
)
insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'am', 1, 'am', 755, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/01am.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'am-2', 2, 'am', 219, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/02am.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'am-3', 3, 'am', 555, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/03am.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'am-4', 4, 'am', 830, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/04am.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'amnel', 5, 'amnel', 842, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/05amnel.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'amnel-2', 6, 'amnel', 1103, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/06amnel.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'amflorence', 7, 'amflorence', 978, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/07amflorence.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'amflorence-2', 8, 'amflorence', 747, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/08amflorence.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'am-5', 9, 'am', 1336, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/09am.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'am-6', 10, 'am', 1110, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/10am.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'am-7', 11, 'am', 367, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/11am.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'am-8', 12, 'am', 834, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/12am.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'am-9', 13, 'am', 811, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/13am.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'am-10', 14, 'am', 322, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/14am.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'am-11', 15, 'am', 537, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/15am.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'am-12', 16, 'am', 635, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/16am.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'am-13', 17, 'am', 643, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/17am.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'am-14', 18, 'am', 1327, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/18am.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'am-15', 19, 'am', 437, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/19am.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'am-16', 20, 'am', 887, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/20am.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'am-17', 21, 'am', 303, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/21am.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'amlabirint', 22, 'amlabirint', 868, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/22amlabirint.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'amlabirint-2', 23, 'amlabirint', 714, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/23amlabirint.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'labir', 24, 'labir', 997, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/24labir.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'labir-2', 25, 'labir', 524, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/25labir.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'labir-3', 26, 'labir', 501, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/26labir.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'labir-4', 27, 'labir', 274, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/27labir.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sestastrada', 28, 'sestastrada', 630, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/28sestastrada.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sestastrada-2', 29, 'sestastrada', 230, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/29sestastrada.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sestastrada-3', 30, 'sestastrada', 614, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/30sestastrada.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sesta', 31, 'sesta', 592, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/31sesta.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'sesta-2', 32, 'sesta', 430, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/32sesta.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'am-18', 33, 'am', 461, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/33am.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'am-19', 34, 'am', 641, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/34am.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'am-20', 35, 'am', 358, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/35am.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'am-21', 36, 'am', 936, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/36am.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'am-22', 37, 'am', 412, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/37am.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'am-23', 38, 'am', 1203, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/38am.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'am-24', 39, 'am', 317, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/39am.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'am-25', 40, 'am', 316, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/40am.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'am-26', 41, 'am', 498, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/41am.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'amladies', 42, 'amladies', 939, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/42amladies.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'am-27', 43, 'am', 1243, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/43am.wav' from target_book
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select id, 'ampost', 44, 'ampost', 1179, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/44ampost.wav' from target_book
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
where book.slug = 'un-americana-a-parigi';

commit;
