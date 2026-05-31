import { existsSync, readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const MANIFEST_PATH = process.env.MANIFEST_PATH || "supabase/import/chapters-manifest.json";
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

function fail(message) {
  console.error(`\n[apply-audio-import-to-supabase] ${message}\n`);
  process.exit(1);
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

function readJson(path) {
  if (!existsSync(path)) {
    fail(`File non trovato: ${path}`);
  }

  return JSON.parse(readFileSync(path, "utf8"));
}

function resolveBookRow(bookSlug, chapters, metadataOverrides) {
  const override = metadataOverrides[bookSlug] ?? {};
  const computedTitle = titleFromSlug(bookSlug);
  const publicationYear = Number(override.publication_year);
  const descriptionWithYear =
    override.description && Number.isFinite(publicationYear)
      ? `${override.description} Prima pubblicazione: ${publicationYear}.`
      : override.description;
  const cover = pickCover(bookSlug);
  const totalDuration = chapters.reduce(
    (acc, row) => acc + (Number(row.duration_seconds) || 0),
    0,
  );

  return {
    slug: bookSlug,
    title:
      typeof override.title === "string" && override.title.trim()
        ? override.title.trim()
        : computedTitle,
    author:
      typeof override.author === "string" && override.author.trim()
        ? override.author.trim()
        : DEFAULT_AUTHOR,
    narrator:
      typeof override.narrator === "string" && override.narrator.trim()
        ? override.narrator.trim()
        : DEFAULT_NARRATOR,
    category:
      typeof override.category === "string" && override.category.trim()
        ? override.category.trim()
        : DEFAULT_CATEGORY,
    description:
      typeof descriptionWithYear === "string" && descriptionWithYear.trim()
        ? descriptionWithYear.trim()
        : `Descrizione temporanea per ${computedTitle}.`,
    total_duration_seconds: totalDuration,
    cover_from: cover.from,
    cover_via: cover.via,
    cover_to: cover.to,
    vibe:
      typeof override.vibe === "string" && override.vibe.trim()
        ? override.vibe.trim()
        : DEFAULT_VIBE,
    is_published: true,
  };
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  fail("Mancano NEXT_PUBLIC_SUPABASE_URL e/o SUPABASE_SECRET_KEY.");
}

const manifest = readJson(MANIFEST_PATH);
if (!Array.isArray(manifest) || manifest.length === 0) {
  fail(`Manifest vuoto o non valido: ${MANIFEST_PATH}`);
}

const metadataOverrides = existsSync(METADATA_OVERRIDES_PATH)
  ? readJson(METADATA_OVERRIDES_PATH)
  : {};

const grouped = new Map();
for (const row of manifest) {
  if (!grouped.has(row.book_slug)) {
    grouped.set(row.book_slug, []);
  }
  grouped.get(row.book_slug).push(row);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    persistSession: false,
  },
});

for (const [bookSlug, chapters] of grouped.entries()) {
  const bookRow = resolveBookRow(bookSlug, chapters, metadataOverrides);
  const { data: book, error: bookError } = await supabase
    .from("audiobooks")
    .upsert(bookRow, { onConflict: "slug" })
    .select("id, slug")
    .single();

  if (bookError) {
    fail(`Errore upsert libro ${bookSlug}: ${bookError.message}`);
  }

  const chapterRows = chapters
    .slice()
    .sort((a, b) => Number(a.chapter_index) - Number(b.chapter_index))
    .map((chapter) => ({
      book_id: book.id,
      slug: chapter.chapter_slug,
      chapter_index: Number(chapter.chapter_index) || 1,
      title: chapter.chapter_title,
      duration_seconds: Number(chapter.duration_seconds) || 0,
      audio_url: chapter.audio_url || "",
    }));

  const { error: chapterError } = await supabase
    .from("chapters")
    .upsert(chapterRows, { onConflict: "book_id,slug" });

  if (chapterError) {
    fail(`Errore upsert capitoli ${bookSlug}: ${chapterError.message}`);
  }

  const totalDuration = chapterRows.reduce(
    (acc, row) => acc + row.duration_seconds,
    0,
  );
  const { error: durationError } = await supabase
    .from("audiobooks")
    .update({ total_duration_seconds: totalDuration })
    .eq("id", book.id);

  if (durationError) {
    fail(`Errore aggiornamento durata ${bookSlug}: ${durationError.message}`);
  }

  console.log(`[OK] ${bookSlug}: ${chapterRows.length} capitoli`);
}

console.log("\nImport Supabase completato.");
