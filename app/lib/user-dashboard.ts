import "server-only";

import { formatDurationLabel, formatSeconds } from "./time";
import { getSupabaseServerClient } from "./supabase/server";

type DashboardBook = {
  id: string;
  slug: string;
  title: string;
  author: string;
  total_duration_seconds: number;
  cover_from: string;
  cover_via: string;
  cover_to: string;
};

type DashboardChapter = {
  id: string;
  title: string;
  chapter_index: number;
  duration_seconds: number;
};

type ProgressRow = {
  book_id: string;
  chapter_id: string | null;
  position_seconds: number;
  completed_seconds: number;
  completed: boolean;
  updated_at: string;
  audiobooks: DashboardBook | DashboardBook[] | null;
  chapters: DashboardChapter | DashboardChapter[] | null;
};

type BookmarkChapterRow = DashboardChapter & {
  audiobooks: DashboardBook | DashboardBook[] | null;
};

type BookmarkRow = {
  id: string;
  position_seconds: number;
  label: string | null;
  created_at: string;
  chapters: BookmarkChapterRow | BookmarkChapterRow[] | null;
};

type ContinueListeningItem = {
  bookId: string;
  bookSlug: string;
  bookTitle: string;
  author: string;
  chapterId: string | null;
  chapterTitle: string | null;
  chapterIndex: number | null;
  positionSeconds: number;
  completedSeconds: number;
  completionPercent: number;
  updatedAt: string;
  updatedAtLabel: string;
  currentPositionLabel: string;
  durationLabel: string;
  continueUrl: string;
};

type BookmarkItem = {
  id: string;
  bookId: string;
  bookSlug: string;
  bookTitle: string;
  chapterId: string;
  chapterTitle: string;
  chapterIndex: number;
  positionSeconds: number;
  positionLabel: string;
  label: string | null;
  createdAt: string;
  createdAtLabel: string;
  jumpUrl: string;
};

export type DashboardSummary = {
  booksInProgress: number;
  booksCompleted: number;
  totalBookmarks: number;
  listenedSeconds: number;
  listenedLabel: string;
};

export type UserDashboardData = {
  summary: DashboardSummary;
  continueListening: ContinueListeningItem[];
  recentBookmarks: BookmarkItem[];
};

function asSingle<T>(value: T | T[] | null): T | null {
  if (!value) {
    return null;
  }

  return Array.isArray(value) ? value[0] ?? null : value;
}

function formatDateTime(isoDate: string) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "Data non disponibile";
  }

  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export async function getUserDashboardData(
  userId: string,
): Promise<UserDashboardData> {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return {
      summary: {
        booksInProgress: 0,
        booksCompleted: 0,
        totalBookmarks: 0,
        listenedSeconds: 0,
        listenedLabel: "0m",
      },
      continueListening: [],
      recentBookmarks: [],
    };
  }

  const [progressQuery, bookmarksQuery] = await Promise.all([
    supabase
      .from("listening_progress")
      .select(
        `
          book_id,
          chapter_id,
          position_seconds,
          completed_seconds,
          completed,
          updated_at,
          audiobooks!listening_progress_book_id_fkey(
            id,
            slug,
            title,
            author,
            total_duration_seconds,
            cover_from,
            cover_via,
            cover_to
          ),
          chapters!listening_progress_chapter_id_fkey(
            id,
            title,
            chapter_index,
            duration_seconds
          )
        `,
      )
      .eq("user_id", userId)
      .order("updated_at", { ascending: false }),
    supabase
      .from("chapter_bookmarks")
      .select(
        `
          id,
          position_seconds,
          label,
          created_at,
          chapters!chapter_bookmarks_chapter_id_fkey(
            id,
            title,
            chapter_index,
            duration_seconds,
            audiobooks!chapters_book_id_fkey(
              id,
              slug,
              title,
              author,
              total_duration_seconds,
              cover_from,
              cover_via,
              cover_to
            )
          )
        `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  const progressRows = (progressQuery.data ?? []) as ProgressRow[];
  const bookmarkRows = (bookmarksQuery.data ?? []) as BookmarkRow[];

  const continueListening: ContinueListeningItem[] = progressRows
    .map((row) => {
      const book = asSingle(row.audiobooks);
      if (!book) {
        return null;
      }

      const chapter = asSingle(row.chapters);
      const completionPercent =
        book.total_duration_seconds > 0
          ? Math.min(
              Math.max(
                Math.round((row.completed_seconds / book.total_duration_seconds) * 100),
                0,
              ),
              100,
            )
          : 0;

      const chapterQuery = chapter
        ? `chapter=${encodeURIComponent(chapter.id)}&t=${Math.max(row.position_seconds, 0)}`
        : "";

      return {
        bookId: book.id,
        bookSlug: book.slug,
        bookTitle: book.title,
        author: book.author,
        chapterId: chapter?.id ?? null,
        chapterTitle: chapter?.title ?? null,
        chapterIndex: chapter?.chapter_index ?? null,
        positionSeconds: row.position_seconds,
        completedSeconds: row.completed_seconds,
        completionPercent,
        updatedAt: row.updated_at,
        updatedAtLabel: formatDateTime(row.updated_at),
        currentPositionLabel: formatSeconds(row.position_seconds),
        durationLabel: formatDurationLabel(book.total_duration_seconds),
        continueUrl: chapterQuery
          ? `/libri/${book.slug}?${chapterQuery}#player`
          : `/libri/${book.slug}#player`,
      } satisfies ContinueListeningItem;
    })
    .filter((item): item is ContinueListeningItem => item !== null);

  const recentBookmarks: BookmarkItem[] = bookmarkRows
    .map((row) => {
      const chapter = asSingle(row.chapters);
      if (!chapter) {
        return null;
      }

      const book = asSingle(chapter.audiobooks);
      if (!book) {
        return null;
      }

      return {
        id: row.id,
        bookId: book.id,
        bookSlug: book.slug,
        bookTitle: book.title,
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        chapterIndex: chapter.chapter_index,
        positionSeconds: row.position_seconds,
        positionLabel: formatSeconds(row.position_seconds),
        label: row.label,
        createdAt: row.created_at,
        createdAtLabel: formatDateTime(row.created_at),
        jumpUrl: `/libri/${book.slug}?chapter=${encodeURIComponent(chapter.id)}&t=${Math.max(
          row.position_seconds,
          0,
        )}#player`,
      } satisfies BookmarkItem;
    })
    .filter((item): item is BookmarkItem => item !== null);

  const summary: DashboardSummary = {
    booksInProgress: continueListening.filter(
      (row) => row.completionPercent > 0 && row.completionPercent < 100,
    ).length,
    booksCompleted: continueListening.filter((row) => row.completionPercent >= 100).length,
    totalBookmarks: recentBookmarks.length,
    listenedSeconds: continueListening.reduce(
      (accumulator, row) => accumulator + Math.max(row.completedSeconds, 0),
      0,
    ),
    listenedLabel: formatDurationLabel(
      continueListening.reduce(
        (accumulator, row) => accumulator + Math.max(row.completedSeconds, 0),
        0,
      ),
    ),
  };

  return {
    summary,
    continueListening,
    recentBookmarks,
  };
}
