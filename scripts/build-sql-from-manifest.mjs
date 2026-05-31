import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const INPUT_PATH = process.env.MANIFEST_PATH || "supabase/import/chapters-manifest.json";
const OUTPUT_PATH = process.env.SEED_SQL_PATH || "supabase/import/seed-chapters.sql";
const METADATA_OVERRIDES_PATH =
  process.env.BOOK_METADATA_OVERRIDES_PATH ||
  "supabase/import/book-metadata-overrides.json";
const DEFAULT_CATEGORY = process.env.DEFAULT_BOOK_CATEGORY || "Narrativa";
const DEFAULT_AUTHOR = process.env.DEFAULT_BOOK_AUTHOR || "Autore da aggiornare";
const DEFAULT_NARRATOR = process.env.DEFAULT_BOOK_NARRATOR || "Voce da aggiornare";
const DEFAULT_VIBE = process.env.DEFAULT_BOOK_VIBE || "Nuovo audiolibro";

const COVER_PALETTE = [
  { from: "#6e1f3b", via: "#bc6f79", to: "#26131d" },
  { from: "#304f66", via: "#79a6b2", to: "#101a2b" },
  { from: "#624220", via: "#d3a372", to: "#29170d" },
  { from: "#3f2b5e", via: "#8d6ca8", to: "#1a1227" },
  { from: "#4f2948", via: "#a06f90", to: "#1f1220" },
  { from: "#244066", via: "#5e8bb7", to: "#121f31" },
];

function escapeSqlText(value) {
  return String(value).replaceAll("'", "''");
}

function titleFromSlug(slug) {
  return String(slug)
    .split("-")
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

function pickCover(slug) {
  const hash = [...String(slug)].reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0,
  );
  return COVER_PALETTE[hash % COVER_PALETTE.length];
}

function resolveCover(slug, override) {
  const fallback = pickCover(slug);

  return {
    from:
      typeof override.cover_from === "string" && override.cover_from.trim()
        ? override.cover_from.trim()
        : fallback.from,
    via:
      typeof override.cover_via === "string" && override.cover_via.trim()
        ? override.cover_via.trim()
        : fallback.via,
    to:
      typeof override.cover_to === "string" && override.cover_to.trim()
        ? override.cover_to.trim()
        : fallback.to,
  };
}

if (!existsSync(INPUT_PATH)) {
  console.error(`Manifest non trovato: ${INPUT_PATH}`);
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(INPUT_PATH, "utf8"));
if (!Array.isArray(manifest) || manifest.length === 0) {
  console.error(`Manifest vuoto o non valido: ${INPUT_PATH}`);
  process.exit(1);
}

const grouped = new Map();
for (const row of manifest) {
  if (!grouped.has(row.book_slug)) {
    grouped.set(row.book_slug, []);
  }
  grouped.get(row.book_slug).push(row);
}

let metadataOverrides = {};
if (existsSync(METADATA_OVERRIDES_PATH)) {
  try {
    const parsed = JSON.parse(readFileSync(METADATA_OVERRIDES_PATH, "utf8"));
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      metadataOverrides = parsed;
    }
  } catch {
    console.warn(
      `Impossibile leggere ${METADATA_OVERRIDES_PATH}. Continuo senza override metadata.`,
    );
  }
}

let sql = `-- Generato automaticamente da scripts/build-sql-from-manifest.mjs
-- Questo script crea/aggiorna automaticamente anche i libri in public.audiobooks.

begin;

`;

for (const [bookSlug, chapters] of grouped.entries()) {
  const override = metadataOverrides[bookSlug] ?? {};
  const computedTitle = titleFromSlug(bookSlug);
  const publicationYear = Number(override.publication_year);
  const descriptionWithYear =
    override.description && Number.isFinite(publicationYear)
      ? `${override.description} Prima pubblicazione: ${publicationYear}.`
      : override.description;

  const resolvedTitle =
    typeof override.title === "string" && override.title.trim().length > 0
      ? override.title
      : computedTitle;
  const resolvedAuthor =
    typeof override.author === "string" && override.author.trim().length > 0
      ? override.author
      : DEFAULT_AUTHOR;
  const resolvedNarrator =
    typeof override.narrator === "string" && override.narrator.trim().length > 0
      ? override.narrator
      : DEFAULT_NARRATOR;
  const resolvedCategory =
    typeof override.category === "string" && override.category.trim().length > 0
      ? override.category
      : DEFAULT_CATEGORY;
  const resolvedVibe =
    typeof override.vibe === "string" && override.vibe.trim().length > 0
      ? override.vibe
      : DEFAULT_VIBE;
  const resolvedDescription =
    typeof descriptionWithYear === "string" && descriptionWithYear.trim().length > 0
      ? descriptionWithYear
      : `Descrizione temporanea per ${computedTitle}.`;

  const safeBookSlug = escapeSqlText(bookSlug);
  const safeBookTitle = escapeSqlText(resolvedTitle);
  const safeAuthor = escapeSqlText(resolvedAuthor);
  const safeNarrator = escapeSqlText(resolvedNarrator);
  const safeCategory = escapeSqlText(resolvedCategory);
  const safeVibe = escapeSqlText(resolvedVibe);
  const safeDescription = escapeSqlText(resolvedDescription);
  const cover = resolveCover(bookSlug, override);
  const totalBookDuration = chapters.reduce(
    (acc, row) => acc + (Number(row.duration_seconds) || 0),
    0,
  );

  const ordered = chapters
    .slice()
    .sort((a, b) => Number(a.chapter_index) - Number(b.chapter_index));

  sql += `-- ${bookSlug}\n`;
  sql += `insert into public.audiobooks (\n`;
  sql += `  slug,\n`;
  sql += `  title,\n`;
  sql += `  author,\n`;
  sql += `  narrator,\n`;
  sql += `  category,\n`;
  sql += `  description,\n`;
  sql += `  total_duration_seconds,\n`;
  sql += `  cover_from,\n`;
  sql += `  cover_via,\n`;
  sql += `  cover_to,\n`;
  sql += `  vibe,\n`;
  sql += `  is_published\n`;
  sql += `) values (\n`;
  sql += `  '${safeBookSlug}',\n`;
  sql += `  '${safeBookTitle}',\n`;
  sql += `  '${safeAuthor}',\n`;
  sql += `  '${safeNarrator}',\n`;
  sql += `  '${safeCategory}',\n`;
  sql += `  '${safeDescription}',\n`;
  sql += `  ${totalBookDuration},\n`;
  sql += `  '${cover.from}',\n`;
  sql += `  '${cover.via}',\n`;
  sql += `  '${cover.to}',\n`;
  sql += `  '${safeVibe}',\n`;
  sql += `  true\n`;
  sql += `)\n`;
  sql += `on conflict (slug) do update set\n`;
  sql += `  title = excluded.title,\n`;
  sql += `  author = excluded.author,\n`;
  sql += `  narrator = excluded.narrator,\n`;
  sql += `  category = excluded.category,\n`;
  sql += `  description = excluded.description,\n`;
  sql += `  cover_from = excluded.cover_from,\n`;
  sql += `  cover_via = excluded.cover_via,\n`;
  sql += `  cover_to = excluded.cover_to,\n`;
  sql += `  vibe = excluded.vibe,\n`;
  sql += `  total_duration_seconds = excluded.total_duration_seconds,\n`;
  sql += `  is_published = excluded.is_published;\n\n`;

  sql += `with target_book as (\n`;
  sql += `  select id from public.audiobooks where slug = '${safeBookSlug}'\n`;
  sql += `)\n`;

  for (const row of ordered) {
    const chapterSlug = escapeSqlText(row.chapter_slug);
    const chapterTitle = escapeSqlText(row.chapter_title);
    const audioUrl = escapeSqlText(row.audio_url || "");
    const duration = Number(row.duration_seconds) || 0;
    const chapterIndex = Number(row.chapter_index) || 1;

    sql += `insert into public.chapters (book_id, slug, chapter_index, title, duration_seconds, audio_url)\n`;
    sql += `select id, '${chapterSlug}', ${chapterIndex}, '${chapterTitle}', ${duration}, '${audioUrl}' from target_book\n`;
    sql += `on conflict (book_id, slug) do update set\n`;
    sql += `  chapter_index = excluded.chapter_index,\n`;
    sql += `  title = excluded.title,\n`;
    sql += `  duration_seconds = excluded.duration_seconds,\n`;
    sql += `  audio_url = excluded.audio_url;\n\n`;
  }

  sql += `update public.audiobooks book\n`;
  sql += `set total_duration_seconds = (\n`;
  sql += `  select coalesce(sum(ch.duration_seconds), 0)\n`;
  sql += `  from public.chapters ch\n`;
  sql += `  where ch.book_id = book.id\n`;
  sql += `)\n`;
  sql += `where book.slug = '${safeBookSlug}';\n\n`;
}

sql += "commit;\n";

const outputDir = path.dirname(OUTPUT_PATH);
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

writeFileSync(OUTPUT_PATH, sql, "utf8");
console.log(`SQL generato in: ${OUTPUT_PATH}`);
