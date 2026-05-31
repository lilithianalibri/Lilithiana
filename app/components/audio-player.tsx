"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BookmarkPlus,
  CheckCircle2,
  FastForward,
  History,
  Pause,
  Play,
  RotateCcw,
  Rewind,
  SkipBack,
  SkipForward,
} from "lucide-react";
import type { AudioBook } from "../lib/audiobooks";
import { getSupabaseBrowserClient } from "../lib/supabase/browser";
import { formatSeconds } from "../lib/time";

type PlayerProps = {
  book: AudioBook;
  forceStartFromBeginning?: boolean;
  initialChapterId?: string;
  initialPositionSeconds?: number;
  autoplayOnInitialPosition?: boolean;
};

type SavedProgress = {
  chapterId: string;
  positionSeconds: number;
  updatedAt: string;
};

type JumpOptions = {
  seekTo?: number;
  autoplay?: boolean;
};

const PLAYBACK_SPEEDS = [0.8, 1, 1.25, 1.5, 2] as const;
const PROGRESS_SAVE_INTERVAL_MS = 15000;

function isMockBook(bookId?: string) {
  return !bookId || bookId.startsWith("mock-");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function isParagraphChapter(title: string) {
  return title.trim() === "§";
}

export function AudioPlayer({
  book,
  forceStartFromBeginning = false,
  initialChapterId,
  initialPositionSeconds,
  autoplayOnInitialPosition = false,
}: PlayerProps) {
  const chapters = useMemo(() => book.chapters ?? [], [book.chapters]);
  const localStorageKey = useMemo(
    () => `lilithiana:progress:${book.slug}`,
    [book.slug],
  );
  const fallbackInitialChapterId =
    chapters.find((chapter) => chapter.id === book.resumeChapterId)?.id ??
    chapters[0]?.id ??
    "";
  const sanitizedRequestedChapterId =
    initialChapterId && chapters.some((chapter) => chapter.id === initialChapterId)
      ? initialChapterId
      : null;
  const requestedStartPoint =
    typeof initialPositionSeconds === "number" && initialPositionSeconds >= 0
      ? Math.floor(initialPositionSeconds)
      : null;
  const initialRequestedChapterId =
    sanitizedRequestedChapterId ?? fallbackInitialChapterId;
  const initialRequestedPosition = Math.max(0, requestedStartPoint ?? 0);
  const hasRequestedStartPoint =
    Boolean(sanitizedRequestedChapterId) || requestedStartPoint !== null;

  const [selectedChapterId, setSelectedChapterId] = useState(
    sanitizedRequestedChapterId ?? fallbackInitialChapterId,
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [resumePoint, setResumePoint] = useState<SavedProgress | null>(() => {
    if (!hasRequestedStartPoint || !initialRequestedChapterId) {
      return null;
    }

    return {
      chapterId: initialRequestedChapterId,
      positionSeconds: initialRequestedPosition,
      updatedAt: new Date().toISOString(),
    };
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const preloadNextAudioRef = useRef<HTMLAudioElement | null>(null);
  const saveThrottleRef = useRef(0);
  const autoPlayAfterLoadRef = useRef(
    hasRequestedStartPoint ? autoplayOnInitialPosition : false,
  );
  const pendingSeekRef = useRef<number | null>(
    hasRequestedStartPoint ? initialRequestedPosition : null,
  );
  const preloadedNextUrlRef = useRef<string | null>(null);
  const forcedStartHandledRef = useRef(false);

  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const selectedIndex = Math.max(
    chapters.findIndex((chapter) => chapter.id === selectedChapterId),
    0,
  );
  const selectedChapter = chapters[selectedIndex];
  const nextChapterAudioUrl = chapters[selectedIndex + 1]?.audioUrl ?? null;
  const canPlayCurrentChapter = Boolean(selectedChapter?.audioUrl);
  const fallbackChapterDuration = selectedChapter?.durationSeconds ?? 0;
  const effectiveDuration =
    Number.isFinite(duration) && duration > 0 ? duration : fallbackChapterDuration;
  const totalDurationSeconds = chapters.reduce(
    (acc, chapter) => acc + (chapter.durationSeconds ?? 0),
    0,
  );

  const completedBeforeSelected = useMemo(() => {
    return chapters
      .slice(0, selectedIndex)
      .reduce((acc, chapter) => acc + (chapter.durationSeconds ?? 0), 0);
  }, [chapters, selectedIndex]);

  const totalCompletedSeconds = Math.max(
    0,
    completedBeforeSelected + Math.floor(currentTime),
  );
  const overallProgressPercentage =
    totalDurationSeconds > 0
      ? Math.min((totalCompletedSeconds / totalDurationSeconds) * 100, 100)
      : 0;
  const shouldPreloadNextChapter = Boolean(
    nextChapterAudioUrl &&
      (effectiveDuration > 0
        ? currentTime >= Math.max(effectiveDuration * 0.75, effectiveDuration - 90)
        : currentTime >= 10),
  );

  const persistProgress = useCallback(
    async (positionSeconds: number, force = false) => {
      if (!selectedChapter) {
        return;
      }

      const now = Date.now();
      if (!force && now - saveThrottleRef.current < PROGRESS_SAVE_INTERVAL_MS) {
        return;
      }
      saveThrottleRef.current = now;

      const safePosition = Math.max(0, Math.floor(positionSeconds));
      const payload: SavedProgress = {
        chapterId: selectedChapter.id,
        positionSeconds: safePosition,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(localStorageKey, JSON.stringify(payload));
      setResumePoint(payload);

      if (!supabase || !activeUserId || isMockBook(book.id)) {
        return;
      }

      const chapterDuration =
        duration || selectedChapter.durationSeconds || safePosition;
      const completedSeconds = completedBeforeSelected + safePosition;
      const completed =
        selectedIndex === chapters.length - 1 &&
        chapterDuration > 0 &&
        safePosition >= chapterDuration - 3;

      const { error } = await supabase.from("listening_progress").upsert(
        {
          user_id: activeUserId,
          book_id: book.id as string,
          chapter_id: selectedChapter.id,
          position_seconds: safePosition,
          completed_seconds: completedSeconds,
          completed,
          updated_at: payload.updatedAt,
        },
        { onConflict: "user_id,book_id" },
      );

      if (error) {
        setStatusMessage("Salvataggio cloud momentaneamente non disponibile.");
      }
    },
    [
      activeUserId,
      book.id,
      chapters.length,
      completedBeforeSelected,
      duration,
      localStorageKey,
      selectedChapter,
      selectedIndex,
      supabase,
    ],
  );

  useEffect(() => {
    if (hasRequestedStartPoint) {
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    const raw = localStorage.getItem(localStorageKey);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as SavedProgress;
      if (!parsed.chapterId) {
        return;
      }
      if (!chapters.some((chapter) => chapter.id === parsed.chapterId)) {
        return;
      }

      setTimeout(() => {
        setResumePoint(parsed);

        if (forceStartFromBeginning) {
          return;
        }

        setSelectedChapterId(parsed.chapterId);
        pendingSeekRef.current = parsed.positionSeconds ?? 0;
      }, 0);
    } catch {
      // Ignore malformed local payloads.
    }
  }, [chapters, forceStartFromBeginning, hasRequestedStartPoint, localStorageKey]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setActiveUserId(data.user?.id ?? null);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setActiveUserId(session?.user?.id ?? null);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (hasRequestedStartPoint) {
      return;
    }

    if (!supabase || !activeUserId || isMockBook(book.id)) {
      return;
    }

    const client = supabase;
    const userId = activeUserId;
    let cancelled = false;

    async function loadRemoteProgress() {
      const { data, error } = await client
        .from("listening_progress")
        .select("chapter_id, position_seconds")
        .eq("user_id", userId)
        .eq("book_id", book.id as string)
        .maybeSingle();

      if (cancelled || error || !data || !data.chapter_id) {
        return;
      }

      const remoteChapterId = data.chapter_id;
      if (remoteChapterId && chapters.some((chapter) => chapter.id === remoteChapterId)) {
        const remoteResumePoint = {
          chapterId: remoteChapterId,
          positionSeconds: data.position_seconds ?? 0,
          updatedAt: new Date().toISOString(),
        } satisfies SavedProgress;

        setResumePoint(remoteResumePoint);

        if (!forceStartFromBeginning) {
          setSelectedChapterId((current) =>
            current === fallbackInitialChapterId ? remoteChapterId : current,
          );
          pendingSeekRef.current = data.position_seconds ?? 0;
          setStatusMessage("Ripresa sincronizzata dal tuo account.");
        }
      }
    }

    void loadRemoteProgress();

    return () => {
      cancelled = true;
    };
  }, [
    activeUserId,
    book.id,
    chapters,
    forceStartFromBeginning,
    fallbackInitialChapterId,
    hasRequestedStartPoint,
    supabase,
  ]);

  useEffect(() => {
    function saveOnUnload() {
      const node = audioRef.current;
      if (node) {
        void persistProgress(node.currentTime, true);
      }
    }

    window.addEventListener("beforeunload", saveOnUnload);

    return () => {
      window.removeEventListener("beforeunload", saveOnUnload);
    };
  }, [persistProgress]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    const preloader = preloadNextAudioRef.current;
    if (!preloader) return;

    if (!nextChapterAudioUrl) {
      preloadedNextUrlRef.current = null;
      preloader.removeAttribute("src");
      preloader.load();
      return;
    }

    if (!shouldPreloadNextChapter) {
      return;
    }

    if (preloadedNextUrlRef.current === nextChapterAudioUrl) {
      return;
    }

    preloadedNextUrlRef.current = nextChapterAudioUrl;
    preloader.src = nextChapterAudioUrl;
    preloader.load();
  }, [nextChapterAudioUrl, shouldPreloadNextChapter]);

  const play = useCallback(async () => {
    if (!audioRef.current || !canPlayCurrentChapter) {
      return;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }, [canPlayCurrentChapter]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
    void persistProgress(audioRef.current.currentTime, true);
  }, [persistProgress]);

  const jumpToChapter = useCallback(
    (chapterId: string, options?: JumpOptions) => {
      const seekTo = options?.seekTo ?? 0;
      const shouldAutoplay = options?.autoplay ?? isPlaying;
      const activeAudio = audioRef.current;

      if (chapterId === selectedChapterId && activeAudio) {
        const maxSeek =
          Number.isFinite(activeAudio.duration) && activeAudio.duration > 0
            ? activeAudio.duration
            : effectiveDuration;
        const target = clamp(seekTo, 0, Math.max(maxSeek - 0.1, 0));
        activeAudio.currentTime = target;
        setCurrentTime(target);
        if (shouldAutoplay) {
          void activeAudio.play().catch(() => {
            setIsPlaying(false);
          });
        }
        setStatusMessage(null);
        return;
      }

      setSelectedChapterId(chapterId);
      setCurrentTime(0);
      setDuration(0);
      pendingSeekRef.current = seekTo;
      autoPlayAfterLoadRef.current = shouldAutoplay;
      setStatusMessage(null);
    },
    [effectiveDuration, isPlaying, selectedChapterId],
  );

  const playNextChapter = useCallback(() => {
    const next = chapters[selectedIndex + 1];
    if (!next) {
      setIsPlaying(false);
      setStatusMessage("Libro completato.");
      return;
    }
    jumpToChapter(next.id, { seekTo: 0, autoplay: true });
  }, [chapters, jumpToChapter, selectedIndex]);

  const playPreviousChapter = useCallback(() => {
    const previous = chapters[selectedIndex - 1];
    if (!previous) return;
    jumpToChapter(previous.id, { seekTo: 0, autoplay: true });
  }, [chapters, jumpToChapter, selectedIndex]);

  const seekBy = useCallback((delta: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const maxSeek =
      Number.isFinite(audio.duration) && audio.duration > 0
        ? audio.duration
        : effectiveDuration;
    const target = clamp(audio.currentTime + delta, 0, maxSeek);
    audio.currentTime = target;
    setCurrentTime(target);
  }, [effectiveDuration]);

  const saveBookmark = useCallback(async () => {
    if (!selectedChapter) {
      return;
    }

    if (!supabase || !activeUserId || isMockBook(book.id)) {
      setStatusMessage("Accedi con account per salvare segnalibri nel cloud.");
      return;
    }

    const positionSeconds = Math.floor(audioRef.current?.currentTime ?? 0);
    const { error } = await supabase.from("chapter_bookmarks").insert({
      user_id: activeUserId,
      chapter_id: selectedChapter.id,
      position_seconds: positionSeconds,
      label: `${book.title} - ${selectedChapter.title} @ ${formatSeconds(positionSeconds)}`,
    });

    if (error) {
      setStatusMessage("Segnalibro non salvato. Riprova.");
      return;
    }

    setStatusMessage(`Segnalibro salvato a ${formatSeconds(positionSeconds)}.`);
  }, [activeUserId, book.id, book.title, selectedChapter, supabase]);

  const startFromBeginning = useCallback(() => {
    const first = chapters[0];
    if (!first) return;
    jumpToChapter(first.id, { seekTo: 0, autoplay: true });
    setStatusMessage("Ascolto dall’inizio.");
  }, [chapters, jumpToChapter]);

  useEffect(() => {
    if (!forceStartFromBeginning || forcedStartHandledRef.current) {
      return;
    }
    if (!chapters.length) {
      return;
    }

    forcedStartHandledRef.current = true;
    const timer = window.setTimeout(() => {
      startFromBeginning();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [chapters, forceStartFromBeginning, startFromBeginning]);

  const resumeListening = useCallback(async () => {
    if (!resumePoint?.chapterId) {
      setStatusMessage("Nessun punto di ripresa salvato per questo libro.");
      return;
    }

    const targetChapter = chapters.find((chapter) => chapter.id === resumePoint.chapterId);
    if (!targetChapter) {
      setStatusMessage("Capitolo salvato non disponibile, scegli un capitolo dalla lista.");
      return;
    }

    const resumeAt = Math.max(0, resumePoint?.positionSeconds ?? 0);
    jumpToChapter(targetChapter.id, {
      seekTo: resumeAt,
      autoplay: true,
    });
    setStatusMessage(`Ripresa da ${formatSeconds(resumeAt)}.`);
  }, [chapters, jumpToChapter, resumePoint]);

  const playChapterNow = useCallback(
    (chapterId: string) => {
      jumpToChapter(chapterId, { seekTo: 0, autoplay: true });
      setStatusMessage("Riproduzione capitolo avviata.");
    },
    [jumpToChapter],
  );

  if (!selectedChapter) {
    return (
      <div className="rounded-2xl border border-accent/18 bg-white/68 p-4 text-sm text-muted">
        Nessun capitolo disponibile.
      </div>
    );
  }

  return (
    <section className="panel rounded-3xl p-6 sm:p-8">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">Player audio</p>
      <h2 className="mt-2 font-display text-3xl">Ascolto capitolo per capitolo</h2>

      <div className="mt-5 rounded-2xl border border-accent/15 bg-white/72 p-4">
        <p className="text-sm font-semibold text-accent">{selectedChapter.title}</p>
        <p className="mt-1 text-xs text-muted">
          Capitolo {selectedIndex + 1} di {chapters.length}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={startFromBeginning}
            disabled={!canPlayCurrentChapter}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] !text-white transition hover:brightness-110 disabled:opacity-50"
          >
            <Play size={13} className="text-white" />
            <span aria-hidden className="h-3 w-px bg-white/70" />
            Ascolta dall’inizio
          </button>
          <button
            type="button"
            onClick={resumeListening}
            className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-accent transition hover:bg-white"
          >
            <History size={13} />
            Riprendi
          </button>
          <button
            type="button"
            onClick={startFromBeginning}
            className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-accent transition hover:bg-white"
          >
            <RotateCcw size={13} />
            Dall’inizio
          </button>
        </div>
        <p className="mt-3 text-xs text-muted">
          Progresso libro: {Math.round(overallProgressPercentage)}% ({selectedIndex + 1}/{Math.max(chapters.length, 1)} capitoli)
        </p>

        <audio
          key={selectedChapter.id}
          ref={audioRef}
          preload="auto"
          src={selectedChapter.audioUrl ?? undefined}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onWaiting={() => setStatusMessage("Buffering audio in corso...")}
          onStalled={() => setStatusMessage("Connessione lenta, riprendo appena carica.")}
          onPlaying={() => {
            setIsPlaying(true);
            setStatusMessage((prev) =>
              prev &&
              (prev.includes("Buffering") || prev.includes("Connessione lenta"))
                ? null
                : prev,
            );
          }}
          onEnded={() => {
            void persistProgress(effectiveDuration || 0, true);
            playNextChapter();
          }}
          onLoadedMetadata={() => {
            const audio = audioRef.current;
            if (!audio) return;

            const metadataDuration =
              Number.isFinite(audio.duration) && audio.duration > 0
                ? audio.duration
                : selectedChapter.durationSeconds ?? 0;
            setDuration(metadataDuration);

            if (pendingSeekRef.current !== null) {
              const target = clamp(
                pendingSeekRef.current,
                0,
                Math.max(metadataDuration - 1, 0),
              );
              audio.currentTime = target;
              setCurrentTime(target);
              pendingSeekRef.current = null;
            } else {
              setCurrentTime(0);
            }
          }}
          onCanPlay={() => {
            if (!autoPlayAfterLoadRef.current) {
              return;
            }

            const audio = audioRef.current;
            if (!audio) return;
            audio.playbackRate = playbackRate;
            void audio.play().catch(() => {
              setIsPlaying(false);
            });
            autoPlayAfterLoadRef.current = false;
          }}
          onTimeUpdate={() => {
            const audio = audioRef.current;
            if (!audio) return;
            if (Number.isFinite(audio.duration) && audio.duration > 0) {
              setDuration(audio.duration);
            }
            setCurrentTime(audio.currentTime);
            void persistProgress(audio.currentTime);
          }}
        />
        <audio ref={preloadNextAudioRef} preload="auto" className="hidden" aria-hidden />

        <div className="mt-4 flex items-center justify-between text-xs text-muted">
          <span>{formatSeconds(currentTime)}</span>
          <span>{formatSeconds(effectiveDuration)}</span>
        </div>

        <input
          type="range"
          min={0}
          max={Math.max(effectiveDuration, 1)}
          step={1}
          value={Math.min(currentTime, Math.max(effectiveDuration, 1))}
          onChange={(event) => {
            const value = Number(event.target.value);
            if (!audioRef.current) return;
            audioRef.current.currentTime = value;
            setCurrentTime(value);
          }}
          className="mt-2 w-full accent-[var(--accent)]"
        />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            Velocita
          </span>
          {PLAYBACK_SPEEDS.map((speed) => {
            const active = speed === playbackRate;
            return (
              <button
                key={speed}
                type="button"
                onClick={() => setPlaybackRate(speed)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                  active
                    ? "bg-accent text-white"
                    : "border border-accent/20 bg-white text-accent hover:bg-white"
                }`}
              >
                {speed}x
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={playPreviousChapter}
            className="rounded-full border border-accent/20 bg-white px-3 py-2 text-accent transition hover:-translate-y-0.5"
          >
            <SkipBack size={16} />
          </button>
          <button
            type="button"
            onClick={() => seekBy(-15)}
            className="rounded-full border border-accent/20 bg-white px-3 py-2 text-accent transition hover:-translate-y-0.5"
          >
            <Rewind size={16} />
          </button>
          {isPlaying ? (
            <button
              type="button"
              onClick={pause}
              className="rounded-full bg-accent p-3 text-white transition hover:brightness-110"
            >
              <Pause size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={play}
              disabled={!canPlayCurrentChapter}
              className="rounded-full bg-accent p-3 text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Play size={18} />
            </button>
          )}
          <button
            type="button"
            onClick={() => seekBy(15)}
            className="rounded-full border border-accent/20 bg-white px-3 py-2 text-accent transition hover:-translate-y-0.5"
          >
            <FastForward size={16} />
          </button>
          <button
            type="button"
            onClick={playNextChapter}
            className="rounded-full border border-accent/20 bg-white px-3 py-2 text-accent transition hover:-translate-y-0.5"
          >
            <SkipForward size={16} />
          </button>
          <button
            type="button"
            onClick={saveBookmark}
            className="inline-flex items-center gap-2 rounded-full border border-accent/22 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-accent transition hover:bg-white"
          >
            <BookmarkPlus size={14} />
            Segnalibro
          </button>
        </div>

        {!canPlayCurrentChapter ? (
          <p className="mt-3 text-xs text-muted">
            URL audio non presente per questo capitolo. Carica il file su Cloudflare R2 e aggiorna
            la colonna <code>audio_url</code> nel database.
          </p>
        ) : null}

        {statusMessage ? <p className="mt-3 text-xs text-muted">{statusMessage}</p> : null}
      </div>

      <ol className="mt-5 space-y-2">
        {chapters.map((chapter, index) => {
          const isActive = chapter.id === selectedChapterId;
          const isParagraph = isParagraphChapter(chapter.title);
          return (
            <li key={chapter.id} className={isParagraph ? "pl-7 sm:pl-12" : undefined}>
              <div
                className={`panel rounded-2xl px-4 py-3 transition ${
                  isActive
                    ? "border-accent/60 bg-white"
                    : isParagraph
                      ? "border-accent/14 bg-white/50"
                      : "bg-white/62"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => jumpToChapter(chapter.id)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <span
                      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        isParagraph
                          ? "bg-white text-muted ring-1 ring-accent/16"
                          : "bg-accent/12 text-accent"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={`truncate text-sm sm:text-base ${
                        isParagraph ? "font-semibold text-muted" : "font-medium"
                      }`}
                    >
                      {chapter.title}
                    </span>
                  </button>

                  <div className="flex items-center gap-2">
                    {index < selectedIndex ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">
                        <CheckCircle2 size={11} />
                        Completato
                      </span>
                    ) : null}
                    {isActive ? (
                      <span className="inline-flex rounded-full bg-accent px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                        In ascolto
                      </span>
                    ) : null}
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                      {chapter.duration}
                    </span>
                    <button
                      type="button"
                      onClick={() => playChapterNow(chapter.id)}
                      className="inline-flex items-center gap-1 rounded-full border border-accent/20 bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent transition hover:bg-white"
                    >
                      <Play size={11} />
                      Ascolta capitolo
                    </button>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
