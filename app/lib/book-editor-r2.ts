import "server-only";

import { randomUUID } from "node:crypto";
import { extname } from "node:path";
import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { toSlug } from "./book-editor-utils";

const AUDIO_EXTENSIONS = new Set([".wav", ".mp3", ".m4a", ".aac", ".ogg", ".flac"]);
const MAX_AUDIO_SIZE_BYTES = 1024 * 1024 * 1024;

type UploadTargetConfig = {
  bookSlug: string;
  chapterIndex: number;
  chapterTitle: string;
  fileName: string;
  contentType: string;
};

function getR2Env() {
  const bucket = process.env.R2_BUCKET_NAME;
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL;

  if (!bucket || !accountId || !accessKeyId || !secretAccessKey || !publicBaseUrl) {
    return null;
  }

  return {
    bucket,
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    accessKeyId,
    secretAccessKey,
    publicBaseUrl: publicBaseUrl.replace(/\/+$/, ""),
  };
}

function getR2Client() {
  const env = getR2Env();

  if (!env) {
    return null;
  }

  return {
    env,
    client: new S3Client({
      region: "auto",
      endpoint: env.endpoint,
      credentials: {
        accessKeyId: env.accessKeyId,
        secretAccessKey: env.secretAccessKey,
      },
    }),
  };
}

export function getPublicR2Url(storageKey: string) {
  const env = getR2Env();
  if (!env) {
    return "";
  }

  const encodedKey = storageKey
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

  return `${env.publicBaseUrl}/${encodedKey}`;
}

export function isR2Configured() {
  return getR2Env() !== null;
}

export function assertValidAudioFile(fileName: string, size: number) {
  const extension = extname(fileName).toLowerCase();

  if (!AUDIO_EXTENSIONS.has(extension)) {
    throw new Error("Formato audio non supportato. Usa WAV, MP3, M4A, AAC, OGG o FLAC.");
  }

  if (!Number.isFinite(size) || size <= 0) {
    throw new Error("File audio non valido.");
  }

  if (size > MAX_AUDIO_SIZE_BYTES) {
    throw new Error("File troppo grande: il limite per capitolo e 1 GB.");
  }
}

export async function createR2UploadTarget({
  bookSlug,
  chapterIndex,
  chapterTitle,
  fileName,
  contentType,
}: UploadTargetConfig) {
  const r2 = getR2Client();

  if (!r2) {
    throw new Error("Configurazione R2 incompleta.");
  }

  const extension = extname(fileName).toLowerCase();
  const safeBookSlug = toSlug(bookSlug);
  const safeChapterSlug = toSlug(chapterTitle) || `capitolo-${chapterIndex}`;
  const paddedIndex = String(chapterIndex).padStart(2, "0");
  const nonce = randomUUID().slice(0, 8);
  const storageKey = `${safeBookSlug}/${paddedIndex}-${safeChapterSlug}-${nonce}${extension}`;
  const resolvedContentType =
    contentType && contentType.startsWith("audio/")
      ? contentType
      : "application/octet-stream";

  const command = new PutObjectCommand({
    Bucket: r2.env.bucket,
    Key: storageKey,
    ContentType: resolvedContentType,
  });

  return {
    uploadUrl: await getSignedUrl(r2.client, command, { expiresIn: 15 * 60 }),
    publicUrl: getPublicR2Url(storageKey),
    storageKey,
    contentType: resolvedContentType,
  };
}

export async function verifyR2Object(storageKey: string) {
  const r2 = getR2Client();

  if (!r2) {
    throw new Error("Configurazione R2 incompleta.");
  }

  await r2.client.send(
    new HeadObjectCommand({
      Bucket: r2.env.bucket,
      Key: storageKey,
    }),
  );
}
