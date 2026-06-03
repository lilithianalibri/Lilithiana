import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  Edit3,
  Plus,
} from "lucide-react";
import { MainNav } from "../../components/main-nav";
import { requireBookManagerPage } from "../../lib/book-editor-auth";
import { getEditableBooks } from "../../lib/book-editor-data";
import { formatDurationLabel } from "../../lib/time";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Libri | Dashboard | LILITHIANA",
  description: "Pannello editoriale per gestire audiolibri e capitoli.",
};

export default async function DashboardBooksPage() {
  await requireBookManagerPage("/dashboard/libri");
  const { books, error } = await getEditableBooks();

  return (
    <div className="relative min-h-screen px-6 pb-16 pt-6 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <MainNav />
        <main className="space-y-8">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/dashboard"
              className="panel inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-white"
            >
              <ArrowLeft size={16} />
              Torna alla dashboard
            </Link>
            <Link
              href="/dashboard/libri/nuovo"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              <Plus size={16} />
              Nuovo libro
            </Link>
          </header>

          <section className="panel rounded-3xl p-6 sm:p-8">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
              <BookOpen size={14} />
              Pannello editoriale
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              Libri e capitoli
            </h1>
            <p className="mt-4 max-w-3xl text-base text-muted">
              Gestione riservata ad admin ed editor per schede libro, capitoli e
              file audio.
            </p>
          </section>

          {error ? (
            <section className="panel rounded-3xl p-6 text-sm text-muted">
              <p className="inline-flex items-center gap-2 font-semibold text-foreground">
                <AlertTriangle size={16} className="text-accent" />
                Configurazione incompleta
              </p>
              <p className="mt-2">{error}</p>
            </section>
          ) : (
            <section className="panel rounded-3xl p-5 sm:p-6">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] border-separate border-spacing-0 text-left text-sm">
                  <thead className="text-xs uppercase tracking-[0.12em] text-muted">
                    <tr>
                      <th className="border-b border-accent/14 pb-3 pr-4">
                        Libro
                      </th>
                      <th className="border-b border-accent/14 px-4 pb-3">
                        Stato
                      </th>
                      <th className="border-b border-accent/14 px-4 pb-3">
                        Capitoli
                      </th>
                      <th className="border-b border-accent/14 px-4 pb-3">
                        Durata
                      </th>
                      <th className="border-b border-accent/14 px-4 pb-3">
                        Aggiornato
                      </th>
                      <th className="border-b border-accent/14 pb-3 pl-4">
                        Azioni
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => (
                      <tr key={book.id} className="align-top">
                        <td className="border-b border-accent/10 py-4 pr-4">
                          <p className="font-semibold text-foreground">{book.title}</p>
                          <p className="mt-1 text-xs text-muted">
                            {book.author} · legge {book.narrator}
                          </p>
                        </td>
                        <td className="border-b border-accent/10 px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] ${
                              book.isPublished
                                ? "bg-accent text-white"
                                : "bg-white text-accent"
                            }`}
                          >
                            {book.isPublished ? <CheckCircle2 size={13} /> : null}
                            {book.isPublished ? "Online" : "Bozza"}
                          </span>
                        </td>
                        <td className="border-b border-accent/10 px-4 py-4 text-muted">
                          {book.chapterCount}
                        </td>
                        <td className="border-b border-accent/10 px-4 py-4 text-muted">
                          <span className="inline-flex items-center gap-2">
                            <Clock3 size={14} className="text-accent" />
                            {formatDurationLabel(book.totalDurationSeconds)}
                          </span>
                        </td>
                        <td className="border-b border-accent/10 px-4 py-4 text-muted">
                          {book.updatedAtLabel}
                        </td>
                        <td className="border-b border-accent/10 py-4 pl-4">
                          <Link
                            href={`/dashboard/libri/${book.id}/modifica`}
                            className="inline-flex items-center gap-2 rounded-full border border-accent/18 bg-white/78 px-4 py-2 text-sm font-semibold text-accent transition hover:bg-white"
                          >
                            <Edit3 size={14} />
                            Modifica
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {books.length === 0 ? (
                <div className="rounded-2xl border border-accent/16 bg-white/68 px-4 py-4 text-sm text-muted">
                  Nessun libro presente.
                </div>
              ) : null}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
