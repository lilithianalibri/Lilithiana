"use server";

import { revalidatePath } from "next/cache";
import type {
  BookEditorActionResult,
  EditorChapter,
  SaveBookInput,
  UploadTarget,
  UploadTargetRequest,
} from "./book-editor-types";
import { requireBookManagerAction } from "./book-editor-auth";
import {
  assertValidAudioFile,
  createR2UploadTarget,
  getPublicR2Url,
  verifyR2Object,
} from "./book-editor-r2";
import {
  DEFAULT_BOOK_COLORS,
  makeUniqueSlug,
  normalizeHexColor,
  toSlug,
} from "./book-editor-utils";
import { getSupabaseAdminClient } from "./supabase/admin";

type ExistingBookRow = {
  id: string;
  slug: string;
  is_published: boolean;
};

type ExistingChapterRow = {
  id: string;
  slug: string;
  chapter_index: number;
  audio_url: string;
  audio_storage_key: string | null;
};

function cleanRequired(value: string, fieldLabel: string, maxLength = 500) {
  const cleaned = value.trim();

  if (!cleaned) {
    throw new Error(`${fieldLabel} e obbligatorio.`);
  }

  if (cleaned.length > maxLength) {
    throw new Error(`${fieldLabel} e troppo lungo.`);
  }

  return cleaned;
}

function cleanOptional(value: string, maxLength = 1000) {
  const cleaned = value.trim();

  if (!cleaned) {
    return null;
  }

  if (cleaned.length > maxLength) {
    throw new Error("Uno dei campi facoltativi e troppo lungo.");
  }

  return cleaned;
}

function cleanUrl(value: string) {
  const cleaned = value.trim();

  if (!cleaned) {
    throw new Error("Ogni capitolo deve avere un file audio caricato.");
  }

  try {
    const url = new URL(cleaned);
    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("URL audio non valido.");
    }
  } catch {
    throw new Error("URL audio non valido.");
  }

  return cleaned;
}

function normalizeDurationSeconds(value: number) {
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }

  return Math.round(value);
}

function normalizeChapters(chapters: EditorChapter[], existing: ExistingChapterRow[]) {
  const existingById = new Map(existing.map((chapter) => [chapter.id, chapter]));
  const usedSlugs = new Set(existing.map((chapter) => chapter.slug));

  return chapters.map((chapter, index) => {
    const existingChapter = chapter.id ? existingById.get(chapter.id) : null;
    const title = cleanRequired(chapter.title, `Titolo capitolo ${index + 1}`, 220);
    const storageKey = chapter.audioStorageKey?.trim() || null;
    const audioUrl = storageKey ? getPublicR2Url(storageKey) : cleanUrl(chapter.audioUrl);
    const slug = existingChapter
      ? existingChapter.slug
      : makeUniqueSlug(toSlug(chapter.slug ?? title) || `capitolo-${index + 1}`, usedSlugs);

    return {
      id: existingChapter?.id,
      slug,
      title,
      chapter_index: index + 1,
      duration_seconds: normalizeDurationSeconds(chapter.durationSeconds),
      audio_url: audioUrl,
      audio_storage_key: storageKey ?? existingChapter?.audio_storage_key ?? null,
    };
  });
}

async function getExistingBook(bookId: string | undefined) {
  if (!bookId) {
    return null;
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    throw new Error("Configurazione Supabase service role incompleta.");
  }

  const { data, error } = await supabase
    .from("audiobooks")
    .select("id, slug, is_published")
    .eq("id", bookId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Libro non trovato.");
  }

  return data as ExistingBookRow;
}

async function assertUniqueBookSlug(slug: string, currentBookId: string | undefined) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    throw new Error("Configurazione Supabase service role incompleta.");
  }

  const { data, error } = await supabase
    .from("audiobooks")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (data && data.id !== currentBookId) {
    throw new Error("Esiste gia un libro con questo slug.");
  }
}

async function fetchExistingChapters(bookId: string | undefined) {
  if (!bookId) {
    return [];
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    throw new Error("Configurazione Supabase service role incompleta.");
  }

  const { data, error } = await supabase
    .from("chapters")
    .select("id, slug, chapter_index, audio_url, audio_storage_key")
    .eq("book_id", bookId);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ExistingChapterRow[];
}

async function verifyUploadedAudio(chapters: ReturnType<typeof normalizeChapters>) {
  const uniqueKeys = [
    ...new Set(
      chapters
        .map((chapter) => chapter.audio_storage_key)
        .filter((key): key is string => Boolean(key)),
    ),
  ];

  for (const key of uniqueKeys) {
    await verifyR2Object(key);
  }
}

export async function createChapterUploadTargets(
  request: UploadTargetRequest,
): Promise<{ ok: true; uploads: UploadTarget[] } | { ok: false; message: string }> {
  try {
    await requireBookManagerAction();

    const bookSlug = toSlug(request.bookSlug);
    if (!bookSlug) {
      throw new Error("Inserisci un titolo libro valido prima di caricare gli audio.");
    }

    if (!Array.isArray(request.chapters) || request.chapters.length === 0) {
      throw new Error("Nessun file audio da caricare.");
    }

    const uploads: UploadTarget[] = [];

    for (const chapter of request.chapters) {
      assertValidAudioFile(chapter.fileName, chapter.size);

      const target = await createR2UploadTarget({
        bookSlug,
        chapterIndex: chapter.chapterIndex,
        chapterTitle: chapter.title,
        fileName: chapter.fileName,
        contentType: chapter.contentType,
      });

      uploads.push({
        clientId: chapter.clientId,
        ...target,
      });
    }

    return { ok: true, uploads };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Upload non disponibile.",
    };
  }
}

export async function saveBookForEditor(
  input: SaveBookInput,
): Promise<BookEditorActionResult> {
  try {
    await requireBookManagerAction();

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      throw new Error("Configurazione Supabase service role incompleta.");
    }

    const existingBook = await getExistingBook(input.bookId);
    const title = cleanRequired(input.book.title, "Titolo", 220);
    const author = cleanRequired(input.book.author, "Autrice", 220);
    const narrator = cleanRequired(input.book.narrator, "Voce narrante", 220);
    const category = cleanRequired(input.book.category, "Categoria", 120);
    const description = cleanRequired(input.book.description, "Descrizione", 5000);
    const vibe = cleanRequired(input.book.vibe, "Vibe", 500);
    const requestedSlug = toSlug(input.book.slug || title);
    const slug =
      existingBook?.is_published && existingBook.slug !== requestedSlug
        ? existingBook.slug
        : requestedSlug;

    if (!slug) {
      throw new Error("Slug libro non valido.");
    }

    await assertUniqueBookSlug(slug, input.bookId);

    if (!Array.isArray(input.chapters) || input.chapters.length === 0) {
      throw new Error("Aggiungi almeno un capitolo audio.");
    }

    const existingChapters = await fetchExistingChapters(input.bookId);
    const chapters = normalizeChapters(input.chapters, existingChapters);
    await verifyUploadedAudio(chapters);

    const totalDuration = chapters.reduce(
      (sum, chapter) => sum + chapter.duration_seconds,
      0,
    );
    const shouldPublish = Boolean(existingBook?.is_published || input.publish);
    const bookRow = {
      slug,
      title,
      author,
      translator: cleanOptional(input.book.translator, 220),
      narrator,
      category,
      description,
      copyright_notice: cleanOptional(input.book.copyrightNotice, 1000),
      total_duration_seconds: totalDuration,
      cover_from: normalizeHexColor(input.book.coverFrom, DEFAULT_BOOK_COLORS.from),
      cover_via: normalizeHexColor(input.book.coverVia, DEFAULT_BOOK_COLORS.via),
      cover_to: normalizeHexColor(input.book.coverTo, DEFAULT_BOOK_COLORS.to),
      vibe,
      is_published: shouldPublish,
    };

    const savedBook =
      existingBook ??
      (
        await supabase
          .from("audiobooks")
          .insert({ ...bookRow, is_published: false })
          .select("id, slug, is_published")
          .single()
      ).data;

    if (!savedBook) {
      throw new Error("Impossibile creare il libro.");
    }

    if (existingBook) {
      const { error } = await supabase
        .from("audiobooks")
        .update(bookRow)
        .eq("id", existingBook.id);

      if (error) {
        throw new Error(error.message);
      }
    }

    const bookId = savedBook.id;
    const keptExistingIds = chapters
      .map((chapter) => chapter.id)
      .filter((id): id is string => Boolean(id));

    for (const chapterId of keptExistingIds) {
      const existing = existingChapters.find((chapter) => chapter.id === chapterId);
      const shiftedIndex = (existing?.chapter_index ?? 0) + 10000;
      const { error } = await supabase
        .from("chapters")
        .update({ chapter_index: shiftedIndex })
        .eq("id", chapterId);

      if (error) {
        throw new Error(error.message);
      }
    }

    for (const chapter of chapters) {
      if (chapter.id) {
        const { error } = await supabase
          .from("chapters")
          .update({
            chapter_index: chapter.chapter_index,
            title: chapter.title,
            duration_seconds: chapter.duration_seconds,
            audio_url: chapter.audio_url,
            audio_storage_key: chapter.audio_storage_key,
          })
          .eq("id", chapter.id);

        if (error) {
          throw new Error(error.message);
        }
      } else {
        const { error } = await supabase.from("chapters").insert({
          book_id: bookId,
          slug: chapter.slug,
          chapter_index: chapter.chapter_index,
          title: chapter.title,
          duration_seconds: chapter.duration_seconds,
          audio_url: chapter.audio_url,
          audio_storage_key: chapter.audio_storage_key,
        });

        if (error) {
          throw new Error(error.message);
        }
      }
    }

    const removedIds = existingChapters
      .map((chapter) => chapter.id)
      .filter((id) => !keptExistingIds.includes(id));

    if (removedIds.length > 0) {
      const { error } = await supabase.from("chapters").delete().in("id", removedIds);
      if (error) {
        throw new Error(error.message);
      }
    }

    if (!existingBook) {
      const { error } = await supabase
        .from("audiobooks")
        .update({ ...bookRow, is_published: shouldPublish })
        .eq("id", bookId);

      if (error) {
        throw new Error(error.message);
      }
    }

    revalidatePath("/dashboard/libri");
    revalidatePath("/library");
    revalidatePath(`/libri/${slug}`);
    revalidatePath("/");

    return {
      ok: true,
      bookId,
      message: shouldPublish ? "Libro pubblicato." : "Bozza salvata.",
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Impossibile salvare il libro.",
    };
  }
}
