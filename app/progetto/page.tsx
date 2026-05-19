import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Sparkles } from "lucide-react";
import { MainNav } from "../components/main-nav";

export const metadata: Metadata = {
  title: "Progetto | LILITHIANA",
  description:
    "Visione editoriale del progetto LILITHIANA: audiolibri femministi, accesso libero e dialogo tra generazioni.",
};

export default function ProjectPage() {
  return (
    <div className="min-h-screen px-6 pb-16 pt-6 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <MainNav />

        <main className="space-y-8">
          <section className="panel rounded-3xl p-6 sm:p-8">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
              <Sparkles size={14} />
              Il progetto
            </p>
            <h1 className="mt-3 max-w-4xl font-display text-4xl leading-tight sm:text-5xl">
              Una libreria audio femminista, scelta con cura
            </h1>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
            <article className="panel rounded-3xl p-6 sm:p-8">
              <div className="space-y-5 text-base leading-8 text-foreground/92">
                <p>
                  Questo progetto nasce dall&apos;idea che non possiamo lasciare solo a
                  piattaforme generaliste la possibilita di decidere quali libri
                  trasmettere in audio.
                </p>
                <p>
                  Nel web e importante dire anche la parola di noi femministe,
                  scegliere quei testi che riteniamo importanti e renderli disponibili
                  anche per le nuove generazioni che forse sfruttano questo mezzo, in
                  cui io credo molto, piu di quanto non fosse in passato.
                </p>
                <p>
                  Il progetto nasce anche da una grande voglia di dialogo fra
                  generazioni e esperienze diverse: fatemi sapere quello che pensate,
                  consigli, suggerimenti per il futuro (magari nuove sezioni poesia
                  ragazz*), candidature per nuove voci.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="mailto:lilithianalibri@gmail.com"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  <Mail size={14} />
                  lilithianalibri@gmail.com
                </a>
                <Link
                  href="/library"
                  className="panel inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition hover:bg-white"
                >
                  Vai al catalogo
                </Link>
              </div>
            </article>

            <aside className="space-y-4">
              <article className="panel rounded-2xl p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-accent">
                  Accesso aperto
                </p>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Ascolta gratis e senza profilazione testi fondamentali per la
                  cultura delle donne, con cura editoriale e qualita audio.
                </p>
              </article>
            </aside>
          </section>
        </main>
      </div>
    </div>
  );
}
