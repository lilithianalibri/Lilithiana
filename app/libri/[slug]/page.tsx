import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3, PlayCircle } from "lucide-react";
import { AudioPlayer } from "../../components/audio-player";
import { AuthCard } from "../../components/auth-card";
import { BookCover } from "../../components/book-cover";
import { MainNav } from "../../components/main-nav";
import { getCatalogBookBySlug } from "../../lib/catalog";
import { getEditorialTrack } from "../../lib/editorial-track";

type BookPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = await getCatalogBookBySlug(slug);

  if (!book) {
    return {
      title: "Libro non trovato | LILITHIANA",
    };
  }

  return {
    title: `${book.title} | LILITHIANA`,
    description: `Audiolibro di ${book.author}: capitoli ordinati, player integrato, progresso e ripresa sincronizzabile per account.`,
  };
}

export default async function BookPage({ params, searchParams }: BookPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const book = await getCatalogBookBySlug(slug);
  const shouldStartFromBeginning =
    query.play === "from-start" ||
    (Array.isArray(query.play) && query.play.includes("from-start"));
  const requestedChapter = Array.isArray(query.chapter)
    ? query.chapter[0]
    : query.chapter;
  const requestedTimeRaw = Array.isArray(query.t) ? query.t[0] : query.t;
  const requestedTime = requestedTimeRaw ? Number(requestedTimeRaw) : NaN;
  const initialPositionSeconds =
    Number.isFinite(requestedTime) && requestedTime >= 0
      ? Math.floor(requestedTime)
      : undefined;

  if (!book) {
    notFound();
  }

  const chapterCount = book.chapters.length;

  return (
    <div className="min-h-screen px-6 pb-16 pt-6 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <MainNav />

        <header className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/library"
            className="panel inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-white"
          >
            <ArrowLeft size={16} />
            Torna alla libreria
          </Link>
        </header>

        <main className="space-y-8">
          <section className="grid gap-7 lg:grid-cols-[360px_1fr]">
            <aside className="panel rounded-3xl p-5">
              <BookCover
                title={book.title}
                author={book.author}
                from={book.coverFrom}
                via={book.coverVia}
                to={book.coverTo}
                className="h-[340px] sm:h-[460px]"
                showIllustration={false}
              />
            </aside>

            <article className="panel rounded-3xl p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">
                Scheda titolo
              </p>
              <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
                {book.title}
              </h1>

              <div className="mt-6 grid gap-3 text-sm text-muted sm:grid-cols-2">
                <p>
                  <span className="font-semibold text-foreground">Autrice:</span>{" "}
                  {book.author}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Legge</span>{" "}
                  {book.narrator}
                </p>
                <p>
                  <span className="font-semibold text-foreground">
                    Durata totale:
                  </span>{" "}
                  {book.totalDuration}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Percorso:</span>{" "}
                  {getEditorialTrack(book.category)}
                </p>
              </div>

              <p className="mt-6 max-w-3xl text-base text-muted">
                {book.description}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/libri/${book.slug}?play=from-start#player`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 font-semibold !text-white transition hover:brightness-110"
                >
                  <PlayCircle size={18} className="text-white" />
                  <span aria-hidden className="h-3 w-px bg-white/70" />
                  Ascolta dall’inizio
                </Link>
                <a
                  href="#player"
                  className="panel inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition hover:bg-white"
                >
                  <Clock3 size={16} className="text-accent" />
                  Vai ai capitoli ({chapterCount})
                </a>
              </div>
            </article>
          </section>

          <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div id="player">
              <AudioPlayer
                book={book}
                forceStartFromBeginning={shouldStartFromBeginning}
                initialChapterId={requestedChapter}
                initialPositionSeconds={initialPositionSeconds}
                autoplayOnInitialPosition
              />
            </div>
            <AuthCard compact />
          </section>
        </main>
      </div>
    </div>
  );
}
