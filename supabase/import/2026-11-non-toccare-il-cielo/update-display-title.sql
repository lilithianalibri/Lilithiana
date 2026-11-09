-- Client-requested display wording, 2026-11-10.
update public.audiobooks
set title = 'Racconto di una donna palestinese — Non toccare il cielo'
where slug = 'non-toccare-il-cielo'
returning slug, title, author, narrator, category;
