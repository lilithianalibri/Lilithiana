alter table public.audiobooks
  add column if not exists translator text;

alter table public.audiobooks
  add column if not exists copyright_notice text;

alter table public.chapters
  add column if not exists audio_storage_key text;
