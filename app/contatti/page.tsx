import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, Sparkles } from "lucide-react";
import { MainNav } from "../components/main-nav";
import { SocialLinks } from "../components/social-links";

export const metadata: Metadata = {
  title: "Contatti | LILITHIANA",
  description:
    "Contatti ufficiali LILITHIANA per collaborazioni, proposte editoriali, nuove voci e comunicazione.",
};

export default function ContactsPage() {
  return (
    <div className="min-h-screen px-6 pb-16 pt-6 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <MainNav />

        <main className="space-y-8">
          <section className="panel rounded-3xl p-6 sm:p-8">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
              <Sparkles size={14} />
              Contatti
            </p>
            <h1 className="mt-3 max-w-4xl font-display text-4xl leading-tight sm:text-5xl">
              Restiamo in contatto
            </h1>
            <p className="mt-4 max-w-3xl text-base text-muted sm:text-lg">
              Scrivici per proposte, suggerimenti, candidature per nuove voci e
              collaborazioni culturali legate al progetto.
            </p>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
            <article className="panel rounded-3xl p-6 sm:p-8">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-accent">
                <Mail size={14} />
                Contatto principale
              </p>
              <a
                href="mailto:lilithianalibri@gmail.com"
                className="mt-3 inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                lilithianalibri@gmail.com
              </a>
              <p className="mt-4 text-sm leading-6 text-muted">
                Scrivici qui per richieste generali, dialogo sul catalogo e
                candidature voce.
              </p>
            </article>

            <article className="panel rounded-3xl p-6 sm:p-8">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-accent">
                <Sparkles size={14} />
                Social
              </p>
              <h2 className="mt-3 font-display text-2xl">Seguici online</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Aggiornamenti, nuove uscite e tracce del progetto passano anche da qui.
              </p>
              <div className="mt-5">
                <SocialLinks variant="contact" />
              </div>
            </article>
          </section>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-accent/18 bg-white px-5 py-2.5 text-sm font-semibold text-accent transition hover:bg-white"
          >
            <ArrowLeft size={14} />
            Torna alla home
          </Link>
        </main>
      </div>
    </div>
  );
}
