export const DEFAULT_BOOK_COLORS = {
  from: "#6e1f3b",
  via: "#bc6f79",
  to: "#26131d",
} as const;

export const BOOK_CATEGORIES = ["Narrativa", "Saggistica"] as const;

const slugCleanupPattern = /[^a-z0-9]+/g;

export function toSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(slugCleanupPattern, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function titleFromFileName(fileName: string) {
  const withoutExtension = fileName.replace(/\.[^.]+$/, "");
  const withoutLeadingIndex = withoutExtension.replace(/^\s*\d+[\s._-]*/, "");
  const spaced = withoutLeadingIndex.replace(/[_-]+/g, " ").trim();

  return spaced
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => `${word[0]?.toUpperCase() ?? ""}${word.slice(1)}`)
    .join(" ");
}

export function normalizeHexColor(value: string | null | undefined, fallback: string) {
  const trimmed = value?.trim() ?? "";
  return /^#[0-9a-f]{6}$/i.test(trimmed) ? trimmed : fallback;
}

export function formatSecondsForEditor(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "0s";
  }

  const totalSeconds = Math.max(0, Math.round(seconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  return `${remainingSeconds}s`;
}

export function makeUniqueSlug(baseSlug: string, usedSlugs: Set<string>) {
  const fallback = baseSlug || "capitolo";
  let candidate = fallback;
  let suffix = 2;

  while (usedSlugs.has(candidate)) {
    candidate = `${fallback}-${suffix}`;
    suffix += 1;
  }

  usedSlugs.add(candidate);
  return candidate;
}
