import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookPlus } from "lucide-react";
import { BookEditorForm } from "../../../components/book-editor-form";
import { MainNav } from "../../../components/main-nav";
import { requireBookManagerPage } from "../../../lib/book-editor-auth";
import {
  getBookEditorSchemaCapabilities,
  getBookEditorSchemaWarning,
} from "../../../lib/book-editor-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nuovo libro | Dashboard | LILITHIANA",
  description: "Crea un nuovo audiolibro con scheda e capitoli audio.",
};

export default async function NewBookPage() {
  await requireBookManagerPage("/dashboard/libri/nuovo");
  const schemaCapabilities = await getBookEditorSchemaCapabilities();
  const schemaWarning = getBookEditorSchemaWarning(schemaCapabilities);

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
              <BookPlus size={14} />
              Nuovo audiolibro
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              Scheda e capitoli
            </h1>
          </section>

          <BookEditorForm
            schemaCapabilities={schemaCapabilities}
            schemaWarning={schemaWarning}
          />
        </main>
      </div>
    </div>
  );
}
