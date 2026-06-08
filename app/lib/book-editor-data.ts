import "server-only";

import type {
  BookEditorSchemaCapabilities,
  BookEditorListItem,
  EditableBook,
  EditorChapter,
} from "./book-editor-types";
import {
  formatBookEditorDatabaseError,
  getBookEditorClientUnavailableMessage,
  getBookEditorSupabaseClient,
} from "./book-editor-client";
import { DEFAULT_BOOK_COLORS } from "./book-editor-utils";

type BookRow = {
  id: string;
  slug: string;
  title: string;
  author: string;
  translator?: string | null;
  narrator: string;
  category: string;
  description: string;
  copyright_notice?: string | null;
  total_duration_seconds: number;
  cover_from: string;
  cover_via: string;
  cover_to: string;
  vibe: string;
  is_published: boolean;
  updated_at: string;
};

type ChapterRow = {
  id: string;
  book_id: string;
  slug: string;
  chapter_index: number;
  title: string;
  duration_seconds: number;
  audio_url: string;
  audio_storage_key?: string | null;
};

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Data non disponibile";
  }

  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Rome",
  }).format(date);
}

function isMissingColumnError(error: { message?: string; code?: string } | null) {
  return (
    error?.code === "42703" ||
    error?.message?.toLowerCase().includes("column") ||
    false
  );
}

async function hasColumn(table: "audiobooks" | "chapters", column: string) {
  const supabase = await getBookEditorSupabaseClient();

  if (!supabase) {
    return false;
  }

  const { error } = await supabase
    .from(table)
    .select(`id, ${column}`)
    .limit(1);

  if (!error) {
    return true;
  }

  if (isMissingColumnError(error)) {
    return false;
  }

  throw new Error(error.message);
}

export async function getBookEditorSchemaCapabilities(): Promise<BookEditorSchemaCapabilities> {
  const [hasTranslator, hasCopyrightNotice, hasAudioStorageKey] = await Promise.all([
    hasColumn("audiobooks", "translator"),
    hasColumn("audiobooks", "copyright_notice"),
    hasColumn("chapters", "audio_storage_key"),
  ]);

  return {
    hasTranslator,
    hasCopyrightNotice,
    hasAudioStorageKey,
  };
}

export function getBookEditorSchemaWarning(schema: BookEditorSchemaCapabilities) {
  if (schema.hasTranslator && schema.hasCopyrightNotice && schema.hasAudioStorageKey) {
    return null;
  }

  return "Migrazione editor incompleta sul database: alcuni campi facoltativi sono disattivati finche' non viene applicata la migrazione Supabase del pannello libri.";
}

export async function getEditableBooks(): Promise<{
  books: BookEditorListItem[];
  error: string | null;
}> {
  const supabase = await getBookEditorSupabaseClient();

  if (!supabase) {
    return {
      books: [],
      error: getBookEditorClientUnavailableMessage(),
    };
  }

  const [booksQuery, chaptersQuery] = await Promise.all([
    supabase
      .from("audiobooks")
      .select(
        "id, slug, title, author, narrator, is_published, total_duration_seconds, updated_at",
      )
      .order("updated_at", { ascending: false }),
    supabase.from("chapters").select("book_id"),
  ]);

  if (booksQuery.error || chaptersQuery.error || !booksQuery.data) {
    return {
      books: [],
      error: formatBookEditorDatabaseError(
        booksQuery.error?.message ??
          chaptersQuery.error?.message ??
          "Impossibile leggere i libri.",
      ),
    };
  }

  const chapterCountByBook = new Map<string, number>();
  for (const chapter of chaptersQuery.data ?? []) {
    chapterCountByBook.set(
      chapter.book_id,
      (chapterCountByBook.get(chapter.book_id) ?? 0) + 1,
    );
  }

  return {
    books: booksQuery.data.map((book) => ({
      id: book.id,
      slug: book.slug,
      title: book.title,
      author: book.author,
      narrator: book.narrator,
      isPublished: book.is_published,
      chapterCount: chapterCountByBook.get(book.id) ?? 0,
      totalDurationSeconds: book.total_duration_seconds,
      updatedAtLabel: formatDateTime(book.updated_at),
    })),
    error: null,
  };
}

async function fetchBookWithOptionalEditorColumns(bookId: string) {
  const supabase = await getBookEditorSupabaseClient();

  if (!supabase) {
    return { book: null, error: getBookEditorClientUnavailableMessage() };
  }

  const query = await supabase
    .from("audiobooks")
    .select(
      "id, slug, title, author, translator, narrator, category, description, copyright_notice, total_duration_seconds, cover_from, cover_via, cover_to, vibe, is_published, updated_at",
    )
    .eq("id", bookId)
    .maybeSingle();

  if (!query.error) {
    return { book: query.data as BookRow | null, error: null };
  }

  const legacyQuery = await supabase
    .from("audiobooks")
    .select(
      "id, slug, title, author, narrator, category, description, total_duration_seconds, cover_from, cover_via, cover_to, vibe, is_published, updated_at",
    )
    .eq("id", bookId)
    .maybeSingle();

  return {
    book: legacyQuery.data as BookRow | null,
    error: legacyQuery.error
      ? formatBookEditorDatabaseError(legacyQuery.error.message)
      : null,
  };
}

async function fetchChaptersWithOptionalStorageKey(bookId: string) {
  const supabase = await getBookEditorSupabaseClient();

  if (!supabase) {
    return {
      chapters: [],
      error: getBookEditorClientUnavailableMessage(),
    };
  }

  const query = await supabase
    .from("chapters")
    .select(
      "id, book_id, slug, chapter_index, title, duration_seconds, audio_url, audio_storage_key",
    )
    .eq("book_id", bookId)
    .order("chapter_index", { ascending: true });

  if (!query.error) {
    return { chapters: (query.data as ChapterRow[]) ?? [], error: null };
  }

  const legacyQuery = await supabase
    .from("chapters")
    .select("id, book_id, slug, chapter_index, title, duration_seconds, audio_url")
    .eq("book_id", bookId)
    .order("chapter_index", { ascending: true });

  return {
    chapters: (legacyQuery.data as ChapterRow[]) ?? [],
    error: legacyQuery.error
      ? formatBookEditorDatabaseError(legacyQuery.error.message)
      : null,
  };
}

export async function getEditableBook(bookId: string): Promise<{
  book: EditableBook | null;
  error: string | null;
}> {
  const [{ book, error }, chaptersQuery] = await Promise.all([
    fetchBookWithOptionalEditorColumns(bookId),
    fetchChaptersWithOptionalStorageKey(bookId),
  ]);

  if (error || chaptersQuery.error || !book) {
    return {
      book: null,
      error: error ?? chaptersQuery.error ?? null,
    };
  }

  const chapters = chaptersQuery.chapters.map<EditorChapter>(
    (chapter) => ({
      id: chapter.id,
      clientId: chapter.id,
      slug: chapter.slug,
      title: chapter.title,
      durationSeconds: chapter.duration_seconds,
      audioUrl: chapter.audio_url,
      audioStorageKey: chapter.audio_storage_key ?? null,
    }),
  );

  return {
    book: {
      id: book.id,
      slug: book.slug,
      title: book.title,
      author: book.author,
      translator: book.translator ?? "",
      narrator: book.narrator,
      category: book.category,
      description: book.description,
      copyrightNotice: book.copyright_notice ?? "",
      coverFrom: book.cover_from || DEFAULT_BOOK_COLORS.from,
      coverVia: book.cover_via || DEFAULT_BOOK_COLORS.via,
      coverTo: book.cover_to || DEFAULT_BOOK_COLORS.to,
      vibe: book.vibe,
      isPublished: book.is_published,
      chapters,
    },
    error: null,
  };
}
