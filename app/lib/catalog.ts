import "server-only";

import {
  getAllAudiobooks as getMockAudiobooks,
  type AudioBook,
  type Chapter,
} from "./audiobooks";
import { getSupabaseServerClient } from "./supabase/server";
import { formatDurationLabel } from "./time";

type DbBook = {
  id: string;
  slug: string;
  title: string;
  author: string;
  narrator: string;
  category: string;
  description: string;
  total_duration_seconds: number;
  cover_from: string;
  cover_via: string;
  cover_to: string;
  vibe: string;
};

type DbChapter = {
  id: string;
  book_id: string;
  slug: string;
  chapter_index: number;
  title: string;
  duration_seconds: number;
  audio_url: string;
};

function parseDurationToSeconds(duration: string) {
  const hourMatch = duration.match(/(\d+)\s*h/i);
  const minuteMatch = duration.match(/(\d+)\s*m/i);
  const secondMatch = duration.match(/(\d+)\s*s/i);

  const hours = hourMatch ? Number(hourMatch[1]) : 0;
  const minutes = minuteMatch ? Number(minuteMatch[1]) : 0;
  const seconds = secondMatch ? Number(secondMatch[1]) : 0;

  return hours * 3600 + minutes * 60 + seconds;
}

function normalizeMockBooks() {
  const books = getMockAudiobooks();
  return books.map((book) => {
    const mappedChapters: Chapter[] = book.chapters.map((chapter, index) => ({
      ...chapter,
      order: index + 1,
      durationSeconds: chapter.durationSeconds ?? parseDurationToSeconds(chapter.duration),
      audioUrl: chapter.audioUrl ?? null,
    }));

    const totalDurationSeconds =
      mappedChapters.reduce(
        (acc, chapter) => acc + (chapter.durationSeconds ?? 0),
        0,
      ) || parseDurationToSeconds(book.totalDuration);

    return {
      ...book,
      id: book.id ?? `mock-${book.slug}`,
      totalDurationSeconds,
      chapters: mappedChapters,
    };
  });
}

function joinBooksFromDatabase(books: DbBook[], chapters: DbChapter[]): AudioBook[] {
  const chapterByBookId = new Map<string, DbChapter[]>();

  for (const chapter of chapters) {
    if (!chapterByBookId.has(chapter.book_id)) {
      chapterByBookId.set(chapter.book_id, []);
    }
    chapterByBookId.get(chapter.book_id)?.push(chapter);
  }

  return books.map((book) => {
    const bookChapters = (chapterByBookId.get(book.id) ?? [])
      .sort((a, b) => a.chapter_index - b.chapter_index)
      .map<Chapter>((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        duration: formatDurationLabel(chapter.duration_seconds),
        durationSeconds: chapter.duration_seconds,
        audioUrl: chapter.audio_url,
        order: chapter.chapter_index,
      }));
    const chaptersDurationSeconds = bookChapters.reduce(
      (acc, chapter) => acc + (chapter.durationSeconds ?? 0),
      0,
    );
    const effectiveDurationSeconds =
      chaptersDurationSeconds > 0
        ? chaptersDurationSeconds
        : book.total_duration_seconds;

    return {
      id: book.id,
      slug: book.slug,
      title: book.title,
      author: book.author,
      narrator: book.narrator,
      category: book.category,
      description: book.description,
      totalDuration: formatDurationLabel(effectiveDurationSeconds),
      totalDurationSeconds: effectiveDurationSeconds,
      coverFrom: book.cover_from,
      coverVia: book.cover_via,
      coverTo: book.cover_to,
      vibe: book.vibe,
      chapters: bookChapters,
      resumeChapterId: bookChapters[0]?.id ?? "",
      resumeAt: "00:00",
    };
  });
}

export async function getCatalogBooks() {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return normalizeMockBooks();
  }

  const [booksQuery, chaptersQuery] = await Promise.all([
    supabase
      .from("audiobooks")
      .select(
        "id, slug, title, author, narrator, category, description, total_duration_seconds, cover_from, cover_via, cover_to, vibe",
      )
      .eq("is_published", true)
      .order("title", { ascending: true }),
    supabase
      .from("chapters")
      .select(
        "id, book_id, slug, chapter_index, title, duration_seconds, audio_url",
      )
      .order("chapter_index", { ascending: true }),
  ]);

  if (booksQuery.error || chaptersQuery.error || !booksQuery.data) {
    return normalizeMockBooks();
  }

  return joinBooksFromDatabase(booksQuery.data as DbBook[], (chaptersQuery.data as DbChapter[]) ?? []);
}

export async function getCatalogBookBySlug(slug: string) {
  const books = await getCatalogBooks();
  return books.find((book) => book.slug === slug);
}

export async function getFeaturedCatalogBook() {
  const books = await getCatalogBooks();
  return books[0] ?? null;
}
