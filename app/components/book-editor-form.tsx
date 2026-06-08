"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  FileAudio,
  Loader2,
  Plus,
  Save,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { createChapterUploadTargets, saveBookForEditor } from "../lib/book-editor-actions";
import type {
  BookEditorSchemaCapabilities,
  EditableBook,
  EditorChapter,
} from "../lib/book-editor-types";
import {
  BOOK_CATEGORIES,
  DEFAULT_BOOK_COLORS,
  formatSecondsForEditor,
  titleFromFileName,
  toSlug,
} from "../lib/book-editor-utils";
import { BookCover } from "./book-cover";

type LocalChapter = EditorChapter & {
  file?: File;
  uploadStatus?: "ready" | "waiting" | "uploading" | "error";
  uploadMessage?: string;
};

type BookEditorFormProps = {
  initialBook?: EditableBook | null;
  schemaCapabilities?: BookEditorSchemaCapabilities;
  schemaWarning?: string | null;
};

const emptyBook: EditableBook = {
  slug: "",
  title: "",
  author: "",
  translator: "",
  narrator: "",
  category: "Narrativa",
  description: "",
  copyrightNotice: "",
  coverFrom: DEFAULT_BOOK_COLORS.from,
  coverVia: DEFAULT_BOOK_COLORS.via,
  coverTo: DEFAULT_BOOK_COLORS.to,
  vibe: "Audiolibro LILITHIANA",
  isPublished: false,
  chapters: [],
};

const steps = ["Scheda libro", "Capitoli audio", "Revisione"] as const;
const fullSchemaCapabilities: BookEditorSchemaCapabilities = {
  hasTranslator: true,
  hasCopyrightNotice: true,
  hasAudioStorageKey: true,
};
const fieldClass =
  "w-full rounded-2xl border border-accent/18 bg-white/78 px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent";
const smallButtonClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-full border border-accent/18 bg-white/78 text-accent transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45";

function makeClientId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readAudioDuration(file: File) {
  return new Promise<number>((resolve) => {
    const audio = document.createElement("audio");
    const objectUrl = URL.createObjectURL(file);

    audio.preload = "metadata";
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);
      const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
      resolve(Math.max(0, Math.round(duration)));
    };
    audio.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(0);
    };
    audio.src = objectUrl;
  });
}

function normalizeChapterOrder(chapters: LocalChapter[]) {
  return chapters.map((chapter) => ({
    ...chapter,
    durationSeconds: Math.max(0, Math.round(chapter.durationSeconds || 0)),
  }));
}

export function BookEditorForm({
  initialBook = null,
  schemaCapabilities = fullSchemaCapabilities,
  schemaWarning = null,
}: BookEditorFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [book, setBook] = useState<EditableBook>(initialBook ?? emptyBook);
  const [chapters, setChapters] = useState<LocalChapter[]>(
    (initialBook?.chapters ?? []).map((chapter) => ({
      ...chapter,
      uploadStatus: "ready",
    })),
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [slugTouched, setSlugTouched] = useState(Boolean(initialBook?.slug));
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const slugLocked = Boolean(initialBook?.isPublished);
  const totalDurationSeconds = useMemo(
    () => chapters.reduce((sum, chapter) => sum + (chapter.durationSeconds || 0), 0),
    [chapters],
  );
  const hasPendingFiles = chapters.some((chapter) => chapter.file);
  const missingAudioCount = chapters.filter((chapter) => !chapter.audioUrl).length;

  function getBookDetailsError() {
    if (!book.title.trim()) {
      return "Inserisci il titolo del libro.";
    }

    if (!book.author.trim()) {
      return "Inserisci l'autrice.";
    }

    if (!book.narrator.trim()) {
      return "Inserisci la voce narrante.";
    }

    if (!book.description.trim()) {
      return "Inserisci la descrizione.";
    }

    return null;
  }

  function getReviewChaptersError(chaptersToCheck = chapters) {
    if (chaptersToCheck.length === 0) {
      return "Aggiungi almeno un capitolo audio.";
    }

    if (chaptersToCheck.some((chapter) => chapter.file)) {
      return "Carica i file audio prima di passare alla revisione.";
    }

    if (chaptersToCheck.some((chapter) => !chapter.audioUrl)) {
      return "Ogni capitolo deve avere un audio caricato.";
    }

    return null;
  }

  function validateBeforeStep(targetIndex: number) {
    if (targetIndex > 0) {
      const bookError = getBookDetailsError();

      if (bookError) {
        setMessage(bookError);
        setStepIndex(0);
        return false;
      }
    }

    if (targetIndex > 1) {
      const chaptersError = getReviewChaptersError();

      if (chaptersError) {
        setMessage(chaptersError);
        setStepIndex(1);
        return false;
      }
    }

    setMessage(null);
    return true;
  }

  function goToStep(targetIndex: number) {
    if (targetIndex <= stepIndex || validateBeforeStep(targetIndex)) {
      setStepIndex(targetIndex);
    }
  }

  function updateBookField<Key extends keyof EditableBook>(
    key: Key,
    value: EditableBook[Key],
  ) {
    setBook((current) => {
      if (key === "title" && !slugTouched && !slugLocked && typeof value === "string") {
        return { ...current, title: value, slug: toSlug(value) };
      }

      return { ...current, [key]: value };
    });
  }

  async function addFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) {
      return;
    }

    setMessage(null);
    const files = Array.from(fileList).sort((a, b) =>
      a.name.localeCompare(b.name, "it", { numeric: true }),
    );
    const prepared = await Promise.all(
      files.map(async (file) => {
        const title = titleFromFileName(file.name) || "Nuovo capitolo";
        return {
          clientId: makeClientId(),
          title,
          durationSeconds: await readAudioDuration(file),
          audioUrl: "",
          audioStorageKey: null,
          file,
          fileName: file.name,
          uploadStatus: "waiting" as const,
        };
      }),
    );

    setChapters((current) => normalizeChapterOrder([...current, ...prepared]));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function replaceChapterFile(clientId: string, file: File | null) {
    if (!file) {
      return;
    }

    const durationSeconds = await readAudioDuration(file);
    setChapters((current) =>
      current.map((chapter) =>
        chapter.clientId === clientId
          ? {
              ...chapter,
              file,
              fileName: file.name,
              durationSeconds,
              audioUrl: "",
              audioStorageKey: null,
              uploadStatus: "waiting",
              uploadMessage: undefined,
            }
          : chapter,
      ),
    );
  }

  function moveChapter(clientId: string, direction: -1 | 1) {
    setChapters((current) => {
      const index = current.findIndex((chapter) => chapter.clientId === clientId);
      const target = index + direction;

      if (index < 0 || target < 0 || target >= current.length) {
        return current;
      }

      const next = current.slice();
      [next[index], next[target]] = [next[target], next[index]];
      return normalizeChapterOrder(next);
    });
  }

  function removeChapter(clientId: string) {
    setChapters((current) =>
      normalizeChapterOrder(current.filter((chapter) => chapter.clientId !== clientId)),
    );
  }

  async function uploadPendingFiles(sourceChapters = chapters) {
    const bookSlug = toSlug(book.slug || book.title);
    const pending = sourceChapters
      .map((chapter, index) => ({ chapter, index }))
      .filter(({ chapter }) => chapter.file);

    if (pending.length === 0) {
      setMessage("Non ci sono file in attesa di upload.");
      return sourceChapters;
    }

    if (!bookSlug) {
      setMessage("Inserisci il titolo del libro prima di caricare gli audio.");
      setStepIndex(0);
      return null;
    }

    setUploading(true);
    setMessage("Preparazione upload audio...");
    setChapters((current) =>
      current.map((chapter) =>
        chapter.file
          ? { ...chapter, uploadStatus: "uploading", uploadMessage: "In caricamento" }
          : chapter,
      ),
    );

    const targets = await createChapterUploadTargets({
      bookSlug,
      chapters: pending.map(({ chapter, index }) => ({
        clientId: chapter.clientId,
        chapterIndex: index + 1,
        title: chapter.title,
        fileName: chapter.file?.name ?? chapter.fileName ?? "audio.wav",
        contentType: chapter.file?.type ?? "application/octet-stream",
        size: chapter.file?.size ?? 0,
      })),
    });

    if (!targets.ok) {
      setUploading(false);
      setMessage(targets.message);
      setChapters((current) =>
        current.map((chapter) =>
          chapter.file
            ? { ...chapter, uploadStatus: "error", uploadMessage: targets.message }
            : chapter,
        ),
      );
      return null;
    }

    const fileByClientId = new Map(
      pending.map(({ chapter }) => [chapter.clientId, chapter.file as File]),
    );
    const resultByClientId = new Map<
      string,
      { ok: boolean; publicUrl?: string; storageKey?: string; message?: string }
    >();

    await Promise.all(
      targets.uploads.map(async (target) => {
        const file = fileByClientId.get(target.clientId);
        if (!file) {
          resultByClientId.set(target.clientId, {
            ok: false,
            message: "File non trovato.",
          });
          return;
        }

        try {
          const response = await fetch(target.uploadUrl, {
            method: "PUT",
            headers: {
              "Content-Type": target.contentType,
            },
            body: file,
          });

          if (!response.ok) {
            throw new Error(`Upload fallito (${response.status}).`);
          }

          resultByClientId.set(target.clientId, {
            ok: true,
            publicUrl: target.publicUrl,
            storageKey: target.storageKey,
          });
        } catch (error) {
          resultByClientId.set(target.clientId, {
            ok: false,
            message:
              error instanceof Error ? error.message : "Upload audio fallito.",
          });
        }
      }),
    );

    const nextChapters: LocalChapter[] = sourceChapters.map((chapter) => {
        const result = resultByClientId.get(chapter.clientId);
        if (!result) {
          return chapter;
        }

        if (!result.ok) {
          return {
            ...chapter,
            uploadStatus: "error" as const,
            uploadMessage: result.message,
          };
        }

        return {
          ...chapter,
          file: undefined,
          audioUrl: result.publicUrl ?? chapter.audioUrl,
          audioStorageKey: result.storageKey ?? chapter.audioStorageKey,
          uploadStatus: "ready" as const,
          uploadMessage: "Caricato",
        };
      });

    setChapters(nextChapters);

    setUploading(false);
    setMessage(
      [...resultByClientId.values()].some((result) => !result.ok)
        ? "Alcuni file non sono stati caricati. Puoi riprovare."
        : "Audio caricati correttamente.",
    );

    return [...resultByClientId.values()].some((result) => !result.ok)
      ? null
      : nextChapters;
  }

  async function submitBook(publish: boolean) {
    if (saving || uploading) {
      return;
    }

    setMessage(null);

    const bookError = getBookDetailsError();
    if (bookError) {
      setMessage(bookError);
      setStepIndex(0);
      return;
    }

    setSaving(true);

    let chaptersToSave = chapters;

    if (chaptersToSave.some((chapter) => chapter.file)) {
      setStepIndex(1);
      setMessage("Carico gli audio su R2 prima del salvataggio...");
      const uploadedChapters = await uploadPendingFiles(chaptersToSave);

      if (!uploadedChapters) {
        setSaving(false);
        setStepIndex(1);
        return;
      }

      chaptersToSave = uploadedChapters;
    }

    const chaptersError = getReviewChaptersError(chaptersToSave);
    if (chaptersError) {
      setSaving(false);
      setMessage(chaptersError);
      setStepIndex(1);
      return;
    }

    const chaptersMissingAudio = chaptersToSave.filter(
      (chapter) => !chapter.audioUrl,
    ).length;

    if (chaptersToSave.length === 0 || chaptersMissingAudio > 0) {
      setSaving(false);
      setMessage("Aggiungi almeno un capitolo con audio caricato.");
      setStepIndex(1);
      return;
    }

    const serializableChapters = chaptersToSave.map((chapter) => ({
      id: chapter.id,
      clientId: chapter.clientId,
      slug: chapter.slug,
      title: chapter.title,
      durationSeconds: chapter.durationSeconds,
      audioUrl: chapter.audioUrl,
      audioStorageKey: chapter.audioStorageKey,
      fileName: chapter.fileName,
    }));

    const result = await saveBookForEditor({
      bookId: initialBook?.id,
      publish,
      book: {
        slug: book.slug,
        title: book.title,
        author: book.author,
        translator: book.translator,
        narrator: book.narrator,
        category: book.category,
        description: book.description,
        copyrightNotice: book.copyrightNotice,
        coverFrom: book.coverFrom,
        coverVia: book.coverVia,
        coverTo: book.coverTo,
        vibe: book.vibe.trim() || "Audiolibro LILITHIANA",
      },
      chapters: serializableChapters,
    });

    setSaving(false);

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    setMessage(result.message);
    router.push("/dashboard/libri");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap gap-2" aria-label="Passi editor libro">
        {steps.map((step, index) => (
          <button
            key={step}
            type="button"
            onClick={() => goToStep(index)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              stepIndex === index
                ? "border-accent bg-accent text-white"
                : "border-accent/18 bg-white/70 text-accent hover:bg-white"
            }`}
          >
            <span>{index + 1}</span>
            {step}
          </button>
        ))}
      </nav>

      {message ? (
        <div className="rounded-2xl border border-accent/18 bg-white/76 px-4 py-3 text-sm text-muted">
          {message}
        </div>
      ) : null}

      {schemaWarning ? (
        <div className="rounded-2xl border border-accent/18 bg-white/76 px-4 py-3 text-sm text-muted">
          {schemaWarning}
        </div>
      ) : null}

      {stepIndex === 0 ? (
        <section className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="panel rounded-3xl p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-semibold">
                <span>Titolo</span>
                <input
                  className={fieldClass}
                  value={book.title}
                  onChange={(event) => updateBookField("title", event.target.value)}
                  required
                />
              </label>
              <label className="space-y-2 text-sm font-semibold">
                <span>Slug</span>
                <input
                  className={fieldClass}
                  value={book.slug}
                  disabled={slugLocked}
                  onChange={(event) => {
                    setSlugTouched(true);
                    updateBookField("slug", toSlug(event.target.value));
                  }}
                />
              </label>
              <label className="space-y-2 text-sm font-semibold">
                <span>Autrice</span>
                <input
                  className={fieldClass}
                  value={book.author}
                  onChange={(event) => updateBookField("author", event.target.value)}
                  required
                />
              </label>
              {schemaCapabilities.hasTranslator ? (
                <label className="space-y-2 text-sm font-semibold">
                  <span>Traduttrice</span>
                  <input
                    className={fieldClass}
                    value={book.translator}
                    onChange={(event) => updateBookField("translator", event.target.value)}
                  />
                </label>
              ) : null}
              <label className="space-y-2 text-sm font-semibold">
                <span>Voce narrante</span>
                <input
                  className={fieldClass}
                  value={book.narrator}
                  onChange={(event) => updateBookField("narrator", event.target.value)}
                  required
                />
              </label>
              <label className="space-y-2 text-sm font-semibold">
                <span>Categoria</span>
                <select
                  className={fieldClass}
                  value={book.category}
                  onChange={(event) => updateBookField("category", event.target.value)}
                >
                  {BOOK_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm font-semibold sm:col-span-2">
                <span>Descrizione</span>
                <textarea
                  className={`${fieldClass} min-h-36 resize-y`}
                  value={book.description}
                  onChange={(event) => updateBookField("description", event.target.value)}
                  required
                />
              </label>
              {schemaCapabilities.hasCopyrightNotice ? (
                <label className="space-y-2 text-sm font-semibold sm:col-span-2">
                  <span>Nota copyright</span>
                  <textarea
                    className={`${fieldClass} min-h-24 resize-y`}
                    value={book.copyrightNotice}
                    onChange={(event) =>
                      updateBookField("copyrightNotice", event.target.value)
                    }
                  />
                </label>
              ) : null}
            </div>
          </div>

          <aside className="panel rounded-3xl p-5">
            <BookCover
              title={book.title || "Titolo libro"}
              author={book.author || "Autrice"}
              from={book.coverFrom}
              via={book.coverVia}
              to={book.coverTo}
              className="h-72"
              showIllustration={false}
            />
            <div className="mt-4 grid gap-3">
              {[
                ["coverFrom", "Colore 1"],
                ["coverVia", "Colore 2"],
                ["coverTo", "Colore 3"],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center justify-between gap-3 text-sm font-semibold">
                  <span>{label}</span>
                  <input
                    type="color"
                    value={book[key as "coverFrom" | "coverVia" | "coverTo"]}
                    onChange={(event) =>
                      updateBookField(
                        key as "coverFrom" | "coverVia" | "coverTo",
                        event.target.value,
                      )
                    }
                    className="h-10 w-14 rounded-lg border border-accent/18 bg-white"
                  />
                </label>
              ))}
            </div>
          </aside>
        </section>
      ) : null}

      {stepIndex === 1 ? (
        <section className="panel rounded-3xl p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted">
                {chapters.length} capitoli
              </p>
              <h2 className="mt-1 font-display text-3xl">Capitoli audio</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,.wav,.mp3,.m4a,.aac,.ogg,.flac"
                multiple
                className="hidden"
                onChange={(event) => void addFiles(event.target.files)}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-full border border-accent/18 bg-white/78 px-4 py-2 text-sm font-semibold text-accent transition hover:bg-white"
              >
                <Plus size={16} />
                Aggiungi audio
              </button>
              <button
                type="button"
                onClick={() => void uploadPendingFiles()}
                disabled={saving || uploading || !hasPendingFiles}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-55"
              >
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                Carica file
              </button>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[920px] border-separate border-spacing-0 text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th className="border-b border-accent/14 pb-3 pr-3">Ordine</th>
                  <th className="border-b border-accent/14 px-3 pb-3">Titolo</th>
                  <th className="border-b border-accent/14 px-3 pb-3">Durata</th>
                  <th className="border-b border-accent/14 px-3 pb-3">Audio</th>
                  <th className="border-b border-accent/14 pb-3 pl-3">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {chapters.map((chapter, index) => (
                  <tr key={chapter.clientId} className="align-top">
                    <td className="border-b border-accent/10 py-4 pr-3">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                        {index + 1}
                      </span>
                    </td>
                    <td className="border-b border-accent/10 px-3 py-4">
                      <input
                        className={fieldClass}
                        value={chapter.title}
                        onChange={(event) =>
                          setChapters((current) =>
                            current.map((item) =>
                              item.clientId === chapter.clientId
                                ? { ...item, title: event.target.value }
                                : item,
                            ),
                          )
                        }
                      />
                      {chapter.uploadMessage ? (
                        <p className="mt-2 text-xs text-muted">{chapter.uploadMessage}</p>
                      ) : null}
                    </td>
                    <td className="border-b border-accent/10 px-3 py-4 text-muted">
                      {formatSecondsForEditor(chapter.durationSeconds)}
                    </td>
                    <td className="border-b border-accent/10 px-3 py-4">
                      <div className="flex flex-col gap-2">
                        <span
                          className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                            chapter.audioUrl
                              ? "bg-accent/10 text-accent"
                              : "bg-white text-muted"
                          }`}
                        >
                          {chapter.audioUrl ? <CheckCircle2 size={13} /> : <FileAudio size={13} />}
                          {chapter.audioUrl ? "Audio pronto" : "Da caricare"}
                        </span>
                        <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-accent/18 bg-white/78 px-3 py-1.5 text-xs font-semibold text-accent transition hover:bg-white">
                          <FileAudio size={13} />
                          Sostituisci
                          <input
                            type="file"
                            accept="audio/*,.wav,.mp3,.m4a,.aac,.ogg,.flac"
                            className="hidden"
                            onChange={(event) => {
                              const file = event.target.files?.[0] ?? null;
                              void replaceChapterFile(chapter.clientId, file);
                              event.currentTarget.value = "";
                            }}
                          />
                        </label>
                      </div>
                    </td>
                    <td className="border-b border-accent/10 py-4 pl-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className={smallButtonClass}
                          onClick={() => moveChapter(chapter.clientId, -1)}
                          disabled={index === 0}
                          title="Sposta su"
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          type="button"
                          className={smallButtonClass}
                          onClick={() => moveChapter(chapter.clientId, 1)}
                          disabled={index === chapters.length - 1}
                          title="Sposta giu"
                        >
                          <ArrowDown size={15} />
                        </button>
                        <button
                          type="button"
                          className={smallButtonClass}
                          onClick={() => removeChapter(chapter.clientId)}
                          title="Rimuovi"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {chapters.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-accent/16 bg-white/68 px-4 py-4 text-sm text-muted">
              Nessun capitolo inserito.
            </div>
          ) : null}
        </section>
      ) : null}

      {stepIndex === 2 ? (
        <section className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="panel rounded-3xl p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              Revisione finale
            </p>
            <h2 className="mt-1 font-display text-3xl">{book.title || "Nuovo libro"}</h2>
            <div className="mt-5 grid gap-3 text-sm text-muted sm:grid-cols-2">
              <p>
                <span className="font-semibold text-foreground">Autrice:</span>{" "}
                {book.author || "-"}
              </p>
              <p>
                <span className="font-semibold text-foreground">Legge:</span>{" "}
                {book.narrator || "-"}
              </p>
              <p>
                <span className="font-semibold text-foreground">Categoria:</span>{" "}
                {book.category}
              </p>
              <p>
                <span className="font-semibold text-foreground">Durata:</span>{" "}
                {formatSecondsForEditor(totalDurationSeconds)}
              </p>
              <p>
                <span className="font-semibold text-foreground">Capitoli:</span>{" "}
                {chapters.length}
              </p>
              <p>
                <span className="font-semibold text-foreground">Audio mancanti:</span>{" "}
                {missingAudioCount}
              </p>
            </div>
            <ol className="mt-5 space-y-2 text-sm text-muted">
              {chapters.map((chapter, index) => (
                <li
                  key={chapter.clientId}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-accent/12 bg-white/68 px-4 py-3"
                >
                  <span>
                    {index + 1}. {chapter.title}
                  </span>
                  <span>{formatSecondsForEditor(chapter.durationSeconds)}</span>
                </li>
              ))}
            </ol>
          </div>

          <aside className="panel rounded-3xl p-5">
            <BookCover
              title={book.title || "Titolo libro"}
              author={book.author || "Autrice"}
              from={book.coverFrom}
              via={book.coverVia}
              to={book.coverTo}
              className="h-72"
              showIllustration={false}
            />
            <div className="mt-5 space-y-3">
              {!initialBook?.isPublished ? (
                <button
                  type="button"
                  onClick={() => void submitBook(false)}
                  disabled={saving || uploading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-accent/18 bg-white/78 px-4 py-3 text-sm font-semibold text-accent transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-55"
                >
                  <Save size={16} />
                  Salva bozza
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => void submitBook(true)}
                disabled={saving || uploading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-55"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                {initialBook?.isPublished ? "Salva modifiche" : "Pubblica ora"}
              </button>
            </div>
          </aside>
        </section>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => goToStep(Math.max(0, stepIndex - 1))}
          disabled={stepIndex === 0}
          className="inline-flex items-center gap-2 rounded-full border border-accent/18 bg-white/78 px-4 py-2 text-sm font-semibold text-accent transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          <ArrowLeft size={15} />
          Indietro
        </button>
        <button
          type="button"
          onClick={() => goToStep(Math.min(steps.length - 1, stepIndex + 1))}
          disabled={stepIndex === steps.length - 1}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
        >
          Avanti
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
