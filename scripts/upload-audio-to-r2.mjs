import {
  createReadStream,
  existsSync,
  closeSync,
  openSync,
  mkdirSync,
  readFileSync,
  readSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { Agent as HttpsAgent } from "node:https";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { HeadObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const SOURCE_DIR = process.env.AUDIO_SOURCE_DIR || "audio-import";
const OUTPUT_DIR = process.env.AUDIO_OUTPUT_DIR || "supabase/import";
const TITLE_OVERRIDES_PATH =
  process.env.CHAPTER_TITLES_OVERRIDES_PATH ||
  "supabase/import/chapter-title-overrides.json";
const BOOK_SLUG_OVERRIDES_PATH =
  process.env.BOOK_SLUG_OVERRIDES_PATH ||
  "supabase/import/book-slug-overrides.json";
const BUCKET = process.env.R2_BUCKET_NAME;
const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL || "";
const DRY_RUN = process.env.R2_DRY_RUN === "1";
const UPLOAD_ATTEMPTS = Number(process.env.R2_UPLOAD_ATTEMPTS || 5);
const ENDPOINT_IPS = (process.env.R2_ENDPOINT_IPS || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const AUDIO_EXTENSIONS = new Set([".wav", ".mp3", ".m4a", ".aac", ".ogg", ".flac"]);
const WAV_HEADER_BYTES = 64 * 1024;

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

function loadBookSlugOverrides() {
  if (!existsSync(BOOK_SLUG_OVERRIDES_PATH)) {
    return {};
  }

  try {
    const raw = JSON.parse(readFileSync(BOOK_SLUG_OVERRIDES_PATH, "utf8"));
    if (raw && typeof raw === "object") {
      return raw;
    }
  } catch {
    // Ignore invalid overrides and continue with folder-based slug.
  }

  return {};
}

function fail(message) {
  console.error(`\n[upload-audio-to-r2] ${message}\n`);
  process.exit(1);
}

function resolveBookSlug(bookFolder, overrides) {
  const raw = String(bookFolder ?? "").trim();
  const normalized = toSlug(raw);
  const byRaw = overrides?.[raw];
  const byNormalized = overrides?.[normalized];
  const overrideValue =
    typeof byRaw === "string" && byRaw.trim().length > 0
      ? byRaw
      : typeof byNormalized === "string" && byNormalized.trim().length > 0
        ? byNormalized
        : "";
  const resolved = toSlug(overrideValue);
  return resolved || normalized;
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

function getWavDurationSeconds(filePath) {
  const file = openSync(filePath, "r");
  const buffer = Buffer.alloc(WAV_HEADER_BYTES);

  try {
    const bytesRead = readSync(file, buffer, 0, buffer.length, 0);
    if (
      bytesRead < 44 ||
      buffer.toString("ascii", 0, 4) !== "RIFF" ||
      buffer.toString("ascii", 8, 12) !== "WAVE"
    ) {
      return 0;
    }

    let offset = 12;
    let byteRate = 0;
    let dataSize = 0;

    while (offset + 8 <= bytesRead) {
      const chunkId = buffer.toString("ascii", offset, offset + 4);
      const chunkSize = buffer.readUInt32LE(offset + 4);
      const chunkDataStart = offset + 8;

      if (chunkId === "fmt " && chunkDataStart + 16 <= bytesRead) {
        byteRate = buffer.readUInt32LE(chunkDataStart + 8);
      } else if (chunkId === "data") {
        dataSize = chunkSize;
        break;
      }

      offset = chunkDataStart + chunkSize + (chunkSize % 2);
    }

    if (byteRate <= 0 || dataSize <= 0) {
      return 0;
    }

    return Math.round(dataSize / byteRate);
  } finally {
    closeSync(file);
  }
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
  if (path.extname(filePath).toLowerCase() === ".wav") {
    const wavDuration = getWavDurationSeconds(filePath);
    if (wavDuration > 0) {
      return wavDuration;
    }
  }

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

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
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
const bookSlugOverrides = loadBookSlugOverrides();

if (!existsSync(outputAbsolute)) {
  mkdirSync(outputAbsolute, { recursive: true });
}

const files = findAudioFiles(sourceAbsolute);
if (files.length === 0) {
  fail(`Nessun file audio trovato in ${sourceAbsolute}`);
}

const endpoint = `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`;
let endpointIpIndex = 0;
const requestHandler =
  ENDPOINT_IPS.length > 0
    ? new NodeHttpHandler({
        httpsAgent: new HttpsAgent({
          keepAlive: true,
          lookup(hostname, options, callback) {
            const done = typeof options === "function" ? options : callback;
            const lookupOptions = typeof options === "function" ? {} : options;
            const ip = ENDPOINT_IPS[endpointIpIndex % ENDPOINT_IPS.length];
            endpointIpIndex += 1;
            if (lookupOptions?.all) {
              done(null, [{ address: ip, family: ip.includes(":") ? 6 : 4 }]);
            } else {
              done(null, ip, ip.includes(":") ? 6 : 4);
            }
          },
        }),
      })
    : undefined;
const s3 = new S3Client({
  region: "auto",
  endpoint,
  forcePathStyle: true,
  requestHandler,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

async function objectExistsWithSize(key, size) {
  try {
    const response = await s3.send(
      new HeadObjectCommand({
        Bucket: BUCKET,
        Key: key,
      }),
    );

    return Number(response.ContentLength) === Number(size);
  } catch {
    return false;
  }
}

async function uploadFileWithRetry(entry) {
  let lastError = null;

  for (let attempt = 1; attempt <= UPLOAD_ATTEMPTS; attempt += 1) {
    try {
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
      return;
    } catch (error) {
      lastError = error;
      if (attempt >= UPLOAD_ATTEMPTS) {
        break;
      }

      const message = error instanceof Error ? error.message : String(error);
      console.warn(
        `[RETRY ${attempt}/${UPLOAD_ATTEMPTS}] ${entry.key}: ${message}`,
      );
      await wait(attempt * 1500);
    }
  }

  throw lastError;
}

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
    bookSlug: resolveBookSlug(bookFolder, bookSlugOverrides),
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

  const usedChapterSlugs = new Set();

  for (let i = 0; i < entries.length; i += 1) {
    const entry = entries[i];
    const chapterIndex = i + 1;
    const overrideTitle =
      chapterTitleOverrides?.[bookSlug]?.[String(chapterIndex)] ??
      chapterTitleOverrides?.[bookSlug]?.[chapterIndex];
    const finalTitle =
      typeof overrideTitle === "string" && overrideTitle.trim().length > 0
        ? overrideTitle.trim()
        : entry.chapterTitle || `Capitolo ${chapterIndex}`;
    const baseSlug = toSlug(finalTitle) || entry.chapterSlug || `chapter-${chapterIndex}`;
    let finalSlug = baseSlug;
    let duplicateIndex = 2;

    while (usedChapterSlugs.has(finalSlug)) {
      finalSlug = `${baseSlug}-${duplicateIndex}`;
      duplicateIndex += 1;
    }

    usedChapterSlugs.add(finalSlug);
    const durationSeconds = getDurationSeconds(entry.absolutePath);
    let uploadStatus = DRY_RUN ? "DRY RUN" : "UPLOADED";

    if (!DRY_RUN) {
      const fileSize = statSync(entry.absolutePath).size;
      if (await objectExistsWithSize(entry.key, fileSize)) {
        uploadStatus = "SKIPPED";
      } else {
        await uploadFileWithRetry(entry);
      }
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
      `[${uploadStatus}] ${entry.key} -> ${toPublicUrl(entry.key) || "(public URL non impostata)"}`,
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
