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
  'Dal carcere in cui è rinchiusa ormai da vent’anni, una donna rivive i suoi giorni da briganta quando, all’indomani dell’unità d’Italia, si aggregò alle bande di ribelli che sconvolsero le regioni meridionali nella speranza di un illusorio riscatto sociale. Prima pubblicazione: 1990.',
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

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'intro', 1, 'Intro', 20, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/01-intro.wav'
from public.audiobooks book
where book.slug = 'briganta'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'primavera-1883', 2, 'Primavera 1883', 1288, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/02-primavera-1883.wav'
from public.audiobooks book
where book.slug = 'briganta'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'marzo-1861', 3, 'Marzo 1861', 2112, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/03-marzo-1861.wav'
from public.audiobooks book
where book.slug = 'briganta'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'aprile-1861', 4, 'Aprile 1861', 1299, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/04-aprile-1861.wav'
from public.audiobooks book
where book.slug = 'briganta'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'maggio-1861', 5, 'Maggio 1861', 1646, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/05-maggio-1861.wav'
from public.audiobooks book
where book.slug = 'briganta'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'giugno-1861', 6, 'Giugno 1861', 2529, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/06-giugno-1861.wav'
from public.audiobooks book
where book.slug = 'briganta'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'luglio-1861', 7, 'Luglio 1861', 1921, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/07-luglio-1861.wav'
from public.audiobooks book
where book.slug = 'briganta'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'agosto-1861', 8, 'Agosto 1861', 2418, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/08-agosto-1861.wav'
from public.audiobooks book
where book.slug = 'briganta'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'primavera-1863', 9, 'Primavera 1863', 576, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/09-primavera-1863.wav'
from public.audiobooks book
where book.slug = 'briganta'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'estate-1883', 10, 'Estate 1883', 130, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/10-estate-1883.wav'
from public.audiobooks book
where book.slug = 'briganta'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'postfazione-la-briganta-e-io', 11, 'Postfazione. La briganta e io', 456, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/11-postfazione-la-briganta-e-io.wav'
from public.audiobooks book
where book.slug = 'briganta'
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
  'C’era una volta la rete Lilith. E c’è ancora...',
  'Simonetta De Fazi',
  'Letizia Bravi',
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

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'retelilith', 1, 'Cos’è stata e quali scelte ha compiuto ed indicato nel mondo femminista la Rete Lilith', 1592, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/cera-una-volta-la-rete-lilith-e-ce-ancora/retelilith.wav'
from public.audiobooks book
where book.slug = 'cera-una-volta-la-rete-lilith-e-ce-ancora'
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
  'Paola Giglio',
  'Narrativa',
  'Romanzo in versi, quasi un poema ispirato dalla vita e dalla musica di Nina Simone. Prima pubblicazione: 2021.',
  12528,
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

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'intro', 1, 'Intro', 14, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/01intro.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'invocazionione', 2, 'Invocazione', 126, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/02invocazionione.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'cantieunice', 3, 'Canti di E. Waymon / Canto della ballata prodigiosa', 299, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/03cantieunice.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'amicizia', 4, 'Canto dell’amicizia', 212, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/04amicizia.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'umiliazione', 5, 'Canto dell’umiliazione', 212, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/05umiliazione.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sogno', 6, 'Il sogno di Nina', 165, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/06sogno.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'primo', 7, 'Canto del primo amore', 197, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/07primo.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'lontananza', 8, 'Canto della lontananza', 197, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/08lontananza.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'zombie', 9, 'Canto dello zombie', 202, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/09zombie.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'harlem', 10, 'Canto di Harlem', 205, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/10harlem.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'errore', 11, 'Ricetta per un Errore Madornale eseguito a regola d’arte (improvvisazione su sinnerman, Nina Simone)', 74, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/11errore.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sconfitta', 12, 'Canto della sconfitta', 176, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/12sconfitta.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'forza', 13, 'Canto della forza e del sudore', 204, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/13forza.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'imprwork', 14, 'Improvvisazione su "Sinnerman", Nina Simone', 42, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/14imprwork.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'notte', 15, 'Canto della notte', 204, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/15notte.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'atlantic', 16, 'Canto di Atlantic City', 189, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/16atlantic.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'assoluto', 17, 'L’orecchio assoluto Improvvisazione I hear music, Ella Fitzgerald', 73, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/17assoluto.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'illuminazione', 18, 'Canti di Nina Simone', 198, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/18illuminazione.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'nina', 19, 'Canto di Nina Simone', 203, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/19nina.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'origine', 20, 'Canto dell’origine dei soldi', 187, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/20origine.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'donross', 21, 'Canto di Don Ross', 196, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/21donross.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'whykeeponbreaking', 22, 'Improvvisazione su Why keep on breaking my heart, Nina Simone', 42, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/22whykeeponbreaking.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'dollari', 23, 'Canto dei tremila dollari', 199, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/23dollari.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'beethoven', 24, 'Scordatevi Beethoven (improvvisazione su roll over Beethoven, Chuck Berry)', 20, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/24beethoven.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'littlegirlblue', 25, 'Canto di Little girl Blue', 203, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/25littlegirlblue.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'townhall', 26, 'Canto del Town Hall', 196, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/26townhall.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'stroud', 27, 'Canto di Andrew Stroud', 192, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/27stroud.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'improvvisazsinatra', 28, 'Improvvisazione su Fly Me to the Moon, Frank Sinatra, Count Bassie', 61, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/28improvvisazsinatra.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'presunta', 29, 'Canto della presunta felicità', 202, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/29presunta.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'improvvisazionespell', 30, 'Improvvisazione su I put a spell on you, Nina Simone', 47, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/30improvvisazionespell.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sognorotto', 31, 'Canto del sogno rotto', 181, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/31sognorotto.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'matrimonio', 32, 'Canto del matrimonio', 161, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/32matrimonio.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'maternita', 33, 'Canto della maternità', 196, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/33maternità.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'lisa', 34, 'Canto di Lisa Celeste', 176, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/34lisa.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'altra', 35, 'Canto dell’altra Nina', 184, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/35altra.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'parks', 36, 'Canto di Rosa Parks e Martin Luther King', 184, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/36parks.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'goddam', 37, 'Canto di Mississippi Goddam', 186, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/37goddam.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'affinita', 38, 'Canto delle affinità', 179, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/38affinità.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'matrioska', 39, 'Matrioska improvvisazione su Four women, Nina Simone', 53, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/39matrioska.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'lotta', 40, 'Canto della lotta', 197, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/40lotta.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'schiavitu', 41, 'Canto della schiavitù', 188, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/41schiavitù.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'ascesa', 42, 'Canto dell’ascesa', 196, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/42ascesa.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'crollo', 43, 'Canto del crollo', 185, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/43crollo.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'anima', 44, 'Solo un’anima improvvisazione su Don’t Let Me Be Misunderstood Nina Simone', 79, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/44anima.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'famiglia', 45, 'Canto della famiglia', 183, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/45famiglia.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'black', 46, 'Canto del Black Power', 184, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/46black.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'celebrita', 47, 'Canto della celebrità', 198, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/47celebrità.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'cantodelcrollo', 48, 'Canto del crollo', 186, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/48cantodelcrollo.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'dellattesa', 49, 'Canto dell’attesa', 182, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/49dellattesa.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'furto', 50, 'Canto del furto', 177, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/50furto.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'separazione', 51, 'Canto della separazione', 182, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/51separazione.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'divorzio', 52, 'Canto del divorzio', 174, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/52divorzio.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'ritorno', 53, 'Canto del ritorno', 179, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/53ritorno.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'barbados', 54, 'Canto delle Barbados', 187, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/54barbados.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'errol', 55, 'Canto di Errol Barrow', 177, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/55errol.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'cantoallontanamento', 56, 'Canto dell’allontanamento', 165, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/56cantoallontanamento.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'emisonetto', 57, 'Emisonetto in blu minore improvvisazione sul love me or leave me Nina Simone', 42, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/57emisonetto.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'monrovia', 58, 'Canto di Monrovia', 173, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/58monrovia.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'magia', 59, 'Canto della magia', 167, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/59magia.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'nero', 60, 'Canto dell’uomo nero', 179, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/60nero.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'alpi', 61, 'Canto di una madre', 186, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/61alpi.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'madre', 62, 'Canto delle Alpi', 174, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/62madre.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'collegio', 63, 'Canto del collegio', 175, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/63collegio.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'amore', 64, 'Canto dell’amore immaginario', 185, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/64amore.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'tribunale', 65, 'Canto del tribunale', 179, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/65tribunale.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'frantumi', 66, 'Canto dei frantumi', 159, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/66frantumi.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sparizioni', 67, 'Canto delle sparizioni', 176, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/67sparizioni.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'rinascita', 68, 'Canto della Rinascita', 174, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/68rinascita.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'parola', 69, 'Canto della parola trovata', 168, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/69parola.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'testa', 70, 'Filastrocca della testa rotta improvvisazione su Trouble in Mind, Nina Simone', 75, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/70testa.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'profumo', 71, 'Canto del profumo', 173, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/71profumo.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'disforia', 72, 'Canto della disforia', 175, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/72disforia.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'cantoisolamento', 73, 'Canto dell’isolamento', 178, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/73cantoisolamento.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'mandela', 74, 'Canto di Nelson Mandela', 198, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/74mandela.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'poesia', 75, 'Poesia della bambina che esce che usciva e che sempre uscirà', 270, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/75poesia.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'notaautrice', 76, 'Nota dell’autrice', 66, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/la-ballata-di-nina-simone/76notaautrice.wav'
from public.audiobooks book
where book.slug = 'la-ballata-di-nina-simone'
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

-- nascita-e-morte-della-massaia
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
  'nascita-e-morte-della-massaia',
  'Nascita e morte della massaia',
  'Paola Masino',
  'Antonella Civale',
  'Narrativa',
  'Racconto surreale, onirico e disorientante di una donna alle prese con tutti gli stereotipi della massaia e del mondo cosiddetto benpensante. Si alternano bellissimi monologhi, scene teatrali, operistiche e immaginifiche e trovano spazio anche riferimenti critici al periodo del Fascismo e della guerra e ai meccanismi che alimenta. Prima pubblicazione: 1945.',
  32153,
  '#1f2a68',
  '#f0a43a',
  '#5a102f',
  'Romanzo surreale, critica domestica, immaginario antifascista',
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

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'ntromassaia', 1, 'Intro', 12, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/nascita-e-morte-della-massaia/01ntromassaia.wav'
from public.audiobooks book
where book.slug = 'nascita-e-morte-della-massaia'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'massaia-2', 2, 'I', 868, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/nascita-e-morte-della-massaia/02massaia (2).wav'
from public.audiobooks book
where book.slug = 'nascita-e-morte-della-massaia'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'massaia-2-2', 3, 'II', 1052, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/nascita-e-morte-della-massaia/03massaia (2).wav'
from public.audiobooks book
where book.slug = 'nascita-e-morte-della-massaia'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'massaia-2-3', 4, 'III', 2930, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/nascita-e-morte-della-massaia/04massaia (2).wav'
from public.audiobooks book
where book.slug = 'nascita-e-morte-della-massaia'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'massaia', 5, 'IV', 4690, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/nascita-e-morte-della-massaia/05massaia.wav'
from public.audiobooks book
where book.slug = 'nascita-e-morte-della-massaia'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'massaiacap5', 6, 'V', 3270, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/nascita-e-morte-della-massaia/06massaiacap5.wav'
from public.audiobooks book
where book.slug = 'nascita-e-morte-della-massaia'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'massaia6', 7, 'VI', 6540, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/nascita-e-morte-della-massaia/07massaia6.wav'
from public.audiobooks book
where book.slug = 'nascita-e-morte-della-massaia'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'massaia7', 8, 'VII', 3070, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/nascita-e-morte-della-massaia/08massaia7.wav'
from public.audiobooks book
where book.slug = 'nascita-e-morte-della-massaia'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'massaia8', 9, 'VIII', 5230, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/nascita-e-morte-della-massaia/09massaia8.wav'
from public.audiobooks book
where book.slug = 'nascita-e-morte-della-massaia'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'massaia9', 10, 'IX', 3982, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/nascita-e-morte-della-massaia/10massaia9.wav'
from public.audiobooks book
where book.slug = 'nascita-e-morte-della-massaia'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'epilogomass', 11, 'Epilogo', 509, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/nascita-e-morte-della-massaia/11epilogomass.wav'
from public.audiobooks book
where book.slug = 'nascita-e-morte-della-massaia'
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
where book.slug = 'nascita-e-morte-della-massaia';

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
  'Letizia Bravi',
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

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'introscrittrici', 1, 'Introduzione', 19, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/scrittrici-italiane-dal-xiii-al-xxi-secolo-profili-biobibliografici/00introscrittrici.wav'
from public.audiobooks book
where book.slug = 'scrittrici-italiane-dal-xiii-al-xxi-secolo-profili-biobibliografici'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'premessascrittrici', 2, 'Premessa', 184, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/scrittrici-italiane-dal-xiii-al-xxi-secolo-profili-biobibliografici/02premessascrittrici.wav'
from public.audiobooks book
where book.slug = 'scrittrici-italiane-dal-xiii-al-xxi-secolo-profili-biobibliografici'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'scrittrici', 3, 'Breve storia della scrittura delle donne in Italia', 7347, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/scrittrici-italiane-dal-xiii-al-xxi-secolo-profili-biobibliografici/03scrittrici.wav'
from public.audiobooks book
where book.slug = 'scrittrici-italiane-dal-xiii-al-xxi-secolo-profili-biobibliografici'
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
  'Paola Giglio',
  'Saggistica',
  'Ricostruzione biografica, storica e archivistica dell’esperienza Server Donne, nata nel 1996 come infrastruttura digitale femminista. Prima pubblicazione: 2025.',
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

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'introsd', 1, 'Intro', 13, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/00introsd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'serverdonne', 2, 'I server femministi sono un sogno ancora lontano', 542, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/01serverdonne.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'serverdonne-unito', 3, 'Le infrastrutture digitali pubbliche', 408, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/02serverdonne_unito.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'serverdonne-2', 4, 'Tempo tecnologico, crossmedialità e assemblaggi cognitivi', 776, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/03serverdonne.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-unito-3', 5, 'Coinvolgimento personale e l’amicizia con le macchine', 634, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/04sd_unito_3.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'severdonne', 6, 'Scrivere e legare tutto dentro a un artefatto tecnico', 276, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/05severdonne.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'serverdonne-3', 7, '2 Server Donne: una macchina femminista', 201, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/06serverdonne.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'serverdonne-4', 8, 'Prima fase: dal 1996 al 2010', 266, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/07serverdonne.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'serverdonne-5', 9, 'La scena politica e culturale', 487, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/08serverdonne.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'serverdonne-6', 10, 'Nella scena dei femminismi', 542, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/09serverdonne.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'serverdonne-7', 11, 'A cavallo del nuovo millennio', 425, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/10serverdonne.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 's', 12, 'La società neoliberista', 151, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/11s.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd', 13, 'Il paradigma del riconoscimento', 323, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/12sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-2', 14, 'Seconda fase: dal 2011 al 2016', 208, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/13sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-3', 15, 'Populismo e sovranismo', 244, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/14sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-4', 16, 'Femmismo moralista?', 548, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/15sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'nuovosd', 17, 'Tra mediatizzazione e capitalismo delle piattaforme', 240, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/16nuovosd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-5', 18, 'La colonizzazione attraverso le piattaforme', 436, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/17sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-6', 19, 'L’intermediazione', 628, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/18sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-7', 20, 'IV ondata', 790, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/19sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-8', 21, 'Cyberfemminismo', 412, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/20sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-9', 22, 'VNS matrix', 315, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/21sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-10', 23, 'L’amicizia con le macchine e il postumano', 648, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/22sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-11', 24, '3 I molti inizi', 1109, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/23sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-unito', 25, 'Gli inizi del Server Donne', 1367, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/24sd_unito.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-unito-2', 26, 'All’origine della macchina server donne', 440, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/25sd_unito.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-12', 27, 'Abitare la rete', 625, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/26sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-13', 28, 'Essere un internet server provider', 595, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/27sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-14', 29, 'Il server all’epoca dei social', 993, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/28sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, '29', 30, 'Il networking fai da te', 299, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/29.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-15', 31, 'La sistemista inesistente', 690, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/30sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-16', 32, 'Agilulfo...', 649, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/31sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-17', 33, 'L’autonoma gestione di un server', 502, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/32sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-18', 34, 'I luoghi fisici del progetto SD...', 738, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/33sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-19', 35, 'CRM...', 712, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/34sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-20', 36, 'R@W-Recycle@women', 339, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/35sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-21', 37, 'Il movimento degli hackerspace femministi...', 897, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/36sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-22', 38, 'Altri inizi Cataloghi-biblioteche-sistemi informativi...', 1088, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/37sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-23', 39, 'Nel colto linguaggio femminista di allora...', 1429, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/38sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-24', 40, 'L’ironia della memoria perduta', 218, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/39sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-25', 41, '5 Dalla cultura dei siti alla conversazione dei social...', 1057, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/40sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-26', 42, 'Leccami la password...', 906, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/41sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-27', 43, 'Women.it con Archivarix...', 1039, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/42sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-28', 44, 'La posta elettronica prima dei social e degli smartphone', 712, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/43sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-29', 45, 'Crossmedialità', 955, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/44sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-30', 46, '6 Cercatrice di Rete...', 1512, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/45sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-31', 47, 'La costruzione dell’artefatto, la realizzazione di un motore di ricerca gender oriented...', 976, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/46sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-32', 48, 'Cercatrice per la Regione Emilia-Romagna e la proposta di un ricco ingaggio...', 1696, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/47sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-33', 49, '7 Separazione non voluta...', 1636, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/48sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sd-34', 50, 'Il ricatto degli spettri...', 3773, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/49sd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'finalesd', 51, 'Post scriptum', 35, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/server-donne-leccami-la-password/50finalesd.wav'
from public.audiobooks book
where book.slug = 'server-donne-leccami-la-password'
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
  'Un’americana a Parigi',
  'Elinor Rigby',
  'Paola Giglio',
  'Narrativa',
  'Raccolta di cinque racconti divertenti e dissacranti sul mondo delle donne. Giacobino. che avrebbe tradotto questo libro da una autrice americana, ribalta lo stereotipo per cui i libri con lesbiche avevano un andamento tragico soprattutto alla metà del secolo scorso.',
  30471,
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

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'introamericana', 1, 'Un’americana a Parigi', 16, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/00introamericana.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'am', 2, '§', 755, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/01am.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'am-2', 3, '§', 219, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/02am.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'am-3', 4, '§', 555, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/03am.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'am-4', 5, '§', 830, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/04am.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'amnel', 6, '§', 842, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/05amnel.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'amnel-2', 7, '§', 1103, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/06amnel.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'amflorence', 8, '§', 978, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/07amflorence.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'amflorence-2', 9, '§', 747, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/08amflorence.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'am-5', 10, '§', 1336, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/09am.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'am-6', 11, '§', 1110, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/10am.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'am-7', 12, '§', 367, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/11am.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'am-8', 13, '§', 834, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/12am.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'am-9', 14, '§', 811, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/13am.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'am-10', 15, '§', 322, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/14am.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'am-11', 16, '§', 537, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/15am.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'am-12', 17, '§', 635, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/16am.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'am-13', 18, '§', 643, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/17am.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'am-14', 19, '§', 1327, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/18am.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'am-15', 20, '§', 437, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/19am.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'am-16', 21, '§', 887, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/20am.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'am-17', 22, '§', 303, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/21am.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'amlabirint', 23, 'Il labirinto', 868, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/22amlabirint.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'amlabirint-2', 24, '§', 714, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/23amlabirint.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'labir', 25, '§', 997, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/24labir.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'labir-2', 26, '§', 524, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/25labir.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'labir-3', 27, '§', 501, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/26labir.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'labir-4', 28, '§', 274, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/27labir.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sestastrada', 29, 'Sesta Strada', 630, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/28sestastrada.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sestastrada-2', 30, '§', 230, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/29sestastrada.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sestastrada-3', 31, '§', 614, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/30sestastrada.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sesta', 32, '§', 592, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/31sesta.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'sesta-2', 33, '§', 430, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/32sesta.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'am-18', 34, '§', 461, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/33am.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'am-19', 35, '§', 641, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/34am.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'am-20', 36, '§', 358, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/35am.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'am-21', 37, '§', 936, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/36am.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'am-22', 38, '§', 412, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/37am.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'am-23', 39, '§', 1203, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/38am.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'am-24', 40, '§', 317, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/39am.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'am-25', 41, '§', 316, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/40am.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'am-26', 42, '§', 498, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/41am.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'amladies', 43, 'Ladies don’t', 939, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/42amladies.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'am-27', 44, 'Piccole donne uccidono', 1243, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/43am.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
on conflict (book_id, slug) do update set
  chapter_index = excluded.chapter_index,
  title = excluded.title,
  duration_seconds = excluded.duration_seconds,
  audio_url = excluded.audio_url;

insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select book.id, 'ampost', 45, 'Postfazione', 1179, 'https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/unamericana-a-parigi/44ampost.wav'
from public.audiobooks book
where book.slug = 'un-americana-a-parigi'
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
