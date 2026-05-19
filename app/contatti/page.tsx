import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Megaphone, Sparkles, Users } from "lucide-react";
import { MainNav } from "../components/main-nav";

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
              collaborazioni culturali legate al progetto LILITHIANA.
            </p>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
            <article className="panel rounded-3xl p-6 sm:p-8">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-accent">
                <Mail size={14} />
                Email principale
              </p>
              <a
                href="mailto:lilithiana@gmail.com"
                className="mt-3 inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                lilithiana@gmail.com
              </a>
              <p className="mt-4 text-sm leading-6 text-muted">
                Questo indirizzo e attivo per richieste generali, dialogo sul
                catalogo, nuove idee editoriali e candidature voce.
              </p>

              <div className="gold-line mt-6 h-px w-full" />

              <p className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-accent">
                <Users size={14} />
                Collaborazioni
              </p>
              <p className="mt-3 text-sm leading-6 text-muted">
                Se vuoi contribuire con testi, letture, supporto tecnico o iniziative
                sul territorio, scrivici una breve presentazione e ti ricontattiamo.
              </p>
            </article>

            <article className="panel rounded-3xl p-6 sm:p-8">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-accent">
                <Megaphone size={14} />
                Promozione e stampa
              </p>
              <p className="mt-3 text-sm leading-6 text-muted">
                Qui inseriremo i riferimenti della persona che si occupa della
                promozione non appena definiti.
              </p>
              <p className="mt-3 rounded-2xl border border-accent/16 bg-white/62 px-4 py-3 text-xs uppercase tracking-[0.1em] text-muted">
                Sezione in aggiornamento
              </p>

              <Link
                href="/"
                className="mt-5 inline-flex rounded-full border border-accent/18 bg-white px-5 py-2.5 text-sm font-semibold text-accent transition hover:bg-white"
              >
                Torna alla home
              </Link>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}
