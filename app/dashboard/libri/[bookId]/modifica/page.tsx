import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, Edit3 } from "lucide-react";
import { BookEditorForm } from "../../../../components/book-editor-form";
import { MainNav } from "../../../../components/main-nav";
import { requireBookManagerPage } from "../../../../lib/book-editor-auth";
import {
  getBookEditorSchemaCapabilities,
  getBookEditorSchemaWarning,
  getEditableBook,
} from "../../../../lib/book-editor-data";

type EditBookPageProps = {
  params: Promise<{ bookId: string }>;
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Modifica libro | Dashboard | LILITHIANA",
  description: "Modifica scheda libro, capitoli e audio.",
};

export default async function EditBookPage({ params }: EditBookPageProps) {
  const { bookId } = await params;
  await requireBookManagerPage(`/dashboard/libri/${bookId}/modifica`);
  const [{ book, error }, schemaCapabilities] = await Promise.all([
    getEditableBook(bookId),
    getBookEditorSchemaCapabilities(),
  ]);
  const schemaWarning = getBookEditorSchemaWarning(schemaCapabilities);

  if (!book && !error) {
    notFound();
  }

  return (
    <div className="relative min-h-screen px-6 pb-16 pt-6 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <MainNav />
        <main className="space-y-8">
          <header>
            <Link
              href="/dashboard/libri"
              className="panel inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-white"
            >
              <ArrowLeft size={16} />
              Torna ai libri
            </Link>
          </header>

          <section className="panel rounded-3xl p-6 sm:p-8">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
              <Edit3 size={14} />
              Modifica audiolibro
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              {book?.title ?? "Libro"}
            </h1>
          </section>

          {error || !book ? (
            <section className="panel rounded-3xl p-6 text-sm text-muted">
              <p className="inline-flex items-center gap-2 font-semibold text-foreground">
                <AlertTriangle size={16} className="text-accent" />
                Impossibile aprire il libro
              </p>
              <p className="mt-2">{error ?? "Libro non disponibile."}</p>
            </section>
          ) : (
            <BookEditorForm
              initialBook={book}
              schemaCapabilities={schemaCapabilities}
              schemaWarning={schemaWarning}
            />
          )}
        </main>
      </div>
    </div>
  );
}
