-- November 2026: Non toccare il cielo by Sondos Sabra, one recording.
-- Run only after the supplied audio object pass upload-verification.json.
begin;
insert into public.audiobooks (slug, title, author, narrator, category, description, total_duration_seconds, cover_from, cover_via, cover_to, vibe, is_published)
select slug, title, author, narrator, category, description, total_duration_seconds, cover_from, cover_via, cover_to, vibe, is_published
from jsonb_to_recordset($books$[{"slug": "non-toccare-il-cielo", "title": "Racconto di una donna palestinese — Non toccare il cielo", "author": "Sondos Sabra", "narrator": "Antonella Civale", "category": "Narrativa", "description": "Racconto di una donna palestinese. Sondos Sabra affida alla scrittura una testimonianza intima che attraversa la memoria, la paura e il bisogno di custodire le storie delle persone, oltre i numeri della cronaca. Legge Antonella Civale.", "vibe": "Testimonianza palestinese, memoria, voce delle donne", "cover_from": "#29456f", "cover_via": "#7e9ec5", "cover_to": "#14233f", "is_published": true, "total_duration_seconds": 820}]$books$::jsonb)
as b(slug text, title text, author text, narrator text, category text, description text,
     total_duration_seconds integer, cover_from text, cover_via text, cover_to text, vibe text, is_published boolean)
on conflict (slug) do update set
title = excluded.title, author = excluded.author, narrator = excluded.narrator, category = excluded.category, description = excluded.description, total_duration_seconds = excluded.total_duration_seconds, cover_from = excluded.cover_from, cover_via = excluded.cover_via, cover_to = excluded.cover_to, vibe = excluded.vibe, is_published = excluded.is_published;
insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)
select b.id, c.chapter_slug, c.chapter_index, c.chapter_title, c.duration_seconds, c.audio_url
from jsonb_to_recordset($chapters$[{"book_slug": "non-toccare-il-cielo", "chapter_index": 1, "chapter_slug": "lettura-integrale", "chapter_title": "Non toccare il cielo", "duration_seconds": 820, "r2_key": "non-toccare-il-cielo/01-lettura-integrale.wav", "audio_url": "https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/non-toccare-il-cielo/01-lettura-integrale.wav"}]$chapters$::jsonb)
as c(book_slug text, chapter_index integer, chapter_slug text, chapter_title text, duration_seconds integer, r2_key text, audio_url text)
join public.audiobooks b on b.slug = c.book_slug
on conflict (book_id, slug) do update set chapter_index=excluded.chapter_index, title=excluded.title,
duration_seconds=excluded.duration_seconds, audio_url=excluded.audio_url;
commit;
select b.slug, b.title, b.category, b.narrator, b.is_published, b.total_duration_seconds,
       count(c.id) as tracks, array_agg(c.title order by c.chapter_index) as ordered_chapters
from public.audiobooks b join public.chapters c on c.book_id=b.id
where b.slug = 'non-toccare-il-cielo'
group by b.id order by b.slug;
