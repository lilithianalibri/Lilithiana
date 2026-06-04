update public.audiobooks
set title = case
  when title like '%...' then title
  else title || '...'
end
where slug = 'cera-una-volta-la-rete-lilith-e-ce-ancora';

update public.audiobooks
set
  cover_from = '#1f2a68',
  cover_via = '#f0a43a',
  cover_to = '#5a102f'
where slug = 'nascita-e-morte-della-massaia';
