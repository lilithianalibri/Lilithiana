import {
  createReadStream,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const SOURCE_DIR = process.env.AUDIO_SOURCE_DIR || "audio-import";
const OUTPUT_DIR = process.env.AUDIO_OUTPUT_DIR || "supabase/import";
const TITLE_OVERRIDES_PATH =
  process.env.CHAPTER_TITLES_OVERRIDES_PATH ||
  "supabase/import/chapter-title-overrides.json";
const BUCKET = process.env.R2_BUCKET_NAME;
const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL || "";
const DRY_RUN = process.env.R2_DRY_RUN === "1";

const AUDIO_EXTENSIONS = new Set([".wav", ".mp3", ".m4a", ".aac", ".ogg", ".flac"]);

function loadTitleOverrides() {
  if (!existsSync(TITLE_OVERRIDES_PATH)) {
    return {};
  }

  try {
    const raw = JSON.parse(readFileSync(TITLE_OVERRIDES_PATH, "utf8"));
    if (raw && typeof raw === "object") {
      return raw;
    }
  } catch {
    // Ignore invalid overrides and continue with auto titles.
  }

  return {};
}

function fail(message) {
  console.error(`\n[upload-audio-to-r2] ${message}\n`);
  process.exit(1);
}

function toSlug(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function toTitle(value) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findAudioFiles(rootDir) {
  const out = [];
  const items = readdirSync(rootDir);

  for (const item of items) {
    const absolutePath = path.join(rootDir, item);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      out.push(...findAudioFiles(absolutePath));
      continue;
    }

    const ext = path.extname(item).toLowerCase();
    if (AUDIO_EXTENSIONS.has(ext)) {
      out.push(absolutePath);
    }
  }

  return out;
}

function getDurationSeconds(filePath) {
  const probe = spawnSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      filePath,
    ],
    { encoding: "utf8" },
  );

  if (probe.status !== 0) {
    return 0;
  }

  const parsed = Number(probe.stdout.trim());
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 0;
  }

  return Math.round(parsed);
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".wav") return "audio/wav";
  if (ext === ".mp3") return "audio/mpeg";
  if (ext === ".m4a") return "audio/mp4";
  if (ext === ".aac") return "audio/aac";
  if (ext === ".ogg") return "audio/ogg";
  if (ext === ".flac") return "audio/flac";
  return "application/octet-stream";
}

function toPublicUrl(key) {
  if (!PUBLIC_BASE_URL) {
    return "";
  }

  return `${PUBLIC_BASE_URL.replace(/\/$/, "")}/${key}`;
}

if (!existsSync(SOURCE_DIR)) {
  fail(`Cartella audio non trovata: ${SOURCE_DIR}`);
}

if (!BUCKET || !ACCOUNT_ID || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
  fail(
    "Mancano env R2: R2_BUCKET_NAME, R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY.",
  );
}

const sourceAbsolute = path.resolve(SOURCE_DIR);
const outputAbsolute = path.resolve(OUTPUT_DIR);
const chapterTitleOverrides = loadTitleOverrides();

if (!existsSync(outputAbsolute)) {
  mkdirSync(outputAbsolute, { recursive: true });
}

const files = findAudioFiles(sourceAbsolute);
if (files.length === 0) {
  fail(`Nessun file audio trovato in ${sourceAbsolute}`);
}

const endpoint = `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`;
const s3 = new S3Client({
  region: "auto",
  endpoint,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

const rawEntries = files.map((absolutePath) => {
  const relative = path.relative(sourceAbsolute, absolutePath).split(path.sep).join("/");
  const [bookFolder, ...restParts] = relative.split("/");
  const fileName = restParts.join("/");
  const bare = path.parse(fileName).name;

  const indexedMatch = bare.match(/^(\d{1,4})[\s._-]*(.*)$/);
  const rawIndex = indexedMatch ? Number(indexedMatch[1]) : null;
  const rawTitle = indexedMatch ? indexedMatch[2] : bare;

  return {
    absolutePath,
    key: relative,
    bookSlug: toSlug(bookFolder),
    chapterSlug: toSlug(rawTitle || bare),
    chapterTitle: toTitle(rawTitle || bare),
    rawIndex,
    fileName: path.basename(relative),
  };
});

const grouped = new Map();
for (const entry of rawEntries) {
  if (!grouped.has(entry.bookSlug)) {
    grouped.set(entry.bookSlug, []);
  }
  grouped.get(entry.bookSlug).push(entry);
}

const manifest = [];

for (const [bookSlug, entries] of grouped.entries()) {
  entries.sort((a, b) => {
    if (a.rawIndex !== null && b.rawIndex !== null) {
      return a.rawIndex - b.rawIndex;
    }
    if (a.rawIndex !== null) return -1;
    if (b.rawIndex !== null) return 1;
    return a.fileName.localeCompare(b.fileName);
  });

  for (let i = 0; i < entries.length; i += 1) {
    const entry = entries[i];
    const chapterIndex = entry.rawIndex ?? i + 1;
    const overrideTitle =
      chapterTitleOverrides?.[bookSlug]?.[String(chapterIndex)] ??
      chapterTitleOverrides?.[bookSlug]?.[chapterIndex];
    const finalTitle =
      typeof overrideTitle === "string" && overrideTitle.trim().length > 0
        ? overrideTitle.trim()
        : entry.chapterTitle || `Capitolo ${chapterIndex}`;
    const finalSlug = toSlug(finalTitle) || entry.chapterSlug || `chapter-${chapterIndex}`;
    const durationSeconds = getDurationSeconds(entry.absolutePath);

    if (!DRY_RUN) {
      const upload = new Upload({
        client: s3,
        params: {
          Bucket: BUCKET,
          Key: entry.key,
          Body: createReadStream(entry.absolutePath),
          ContentType: getContentType(entry.absolutePath),
          CacheControl: "public, max-age=31536000, immutable",
        },
      });
      await upload.done();
    }

    manifest.push({
      book_slug: bookSlug,
      chapter_index: chapterIndex,
      chapter_slug: finalSlug,
      chapter_title: finalTitle,
      duration_seconds: durationSeconds,
      r2_key: entry.key,
      audio_url: toPublicUrl(entry.key),
    });

    console.log(
      `${DRY_RUN ? "[DRY RUN]" : "[UPLOADED]"} ${entry.key} -> ${toPublicUrl(entry.key) || "(public URL non impostata)"}`,
    );
  }
}

manifest.sort((a, b) => {
  if (a.book_slug === b.book_slug) {
    return a.chapter_index - b.chapter_index;
  }
  return a.book_slug.localeCompare(b.book_slug);
});

const booksSummary = [];
for (const [bookSlug, entries] of grouped.entries()) {
  const bookRows = manifest.filter((row) => row.book_slug === bookSlug);
  const totalDuration = bookRows.reduce(
    (acc, row) => acc + (row.duration_seconds || 0),
    0,
  );
  booksSummary.push({
    book_slug: bookSlug,
    chapters: entries.length,
    total_duration_seconds: totalDuration,
  });
}

const manifestPath = path.join(outputAbsolute, "chapters-manifest.json");
const booksPath = path.join(outputAbsolute, "books-summary.json");
const csvPath = path.join(outputAbsolute, "chapters.csv");

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
writeFileSync(booksPath, JSON.stringify(booksSummary, null, 2), "utf8");
writeFileSync(
  csvPath,
  [
    "book_slug,chapter_index,chapter_slug,chapter_title,duration_seconds,audio_url,r2_key",
    ...manifest.map((row) =>
      [
        row.book_slug,
        row.chapter_index,
        row.chapter_slug,
        `"${row.chapter_title.replaceAll('"', '""')}"`,
        row.duration_seconds,
        row.audio_url,
        row.r2_key,
      ].join(","),
    ),
  ].join("\n"),
  "utf8",
);

console.log(`\nManifest salvato in: ${manifestPath}`);
console.log(`Riassunto libri salvato in: ${booksPath}`);
console.log(`CSV capitoli salvato in: ${csvPath}`);
