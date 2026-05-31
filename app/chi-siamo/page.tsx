import type { Metadata } from "next";
import Link from "next/link";
import { HeartHandshake, Mic2, NotebookPen, Sparkles } from "lucide-react";
import { MainNav } from "../components/main-nav";

export const metadata: Metadata = {
  title: "Chi siamo | LILITHIANA",
  description:
    "Storia, visione e collaborazioni dietro la piattaforma LILITHIANA: una rete di donne, voci e competenze al servizio degli audiolibri.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen px-6 pb-16 pt-6 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <MainNav />

        <main className="space-y-8">
          <section className="panel rounded-3xl p-6 sm:p-8">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
              <Sparkles size={14} />
              Chi siamo
            </p>
            <h1 className="mt-3 max-w-4xl font-display text-4xl leading-tight sm:text-5xl">
              Una piattaforma nata da una rete di donne, idee e voci.
            </h1>
            <p className="mt-4 max-w-3xl text-base text-muted sm:text-lg">
              Sono Stefania De Biase, ma parlo al plurale. Se questa piattaforma di
              audiolibri è oggi realtà, lo devo a tutte le donne della Rete Lilith
              e del movimento femminista che hanno incrociato il mio cammino.
            </p>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
            <article className="panel rounded-3xl p-6 sm:p-8">
              <div className="space-y-5 text-base leading-8 text-foreground/92">
                <p>
                  Dall’esperienza della Rete Lilith, con DWF prima e Archivia poi,
                  ho ereditato l’amore per le carte delle donne. Ho sentito il
                  bisogno di trasformare alcuni scritti, spesso trascurati
                  dall’editoria tradizionale, in voce e suono.
                </p>
                <p>
                  È stato un lavoro corale. Dai consigli di Eugenia Galateri,
                  Piera Codognotto e dell’amatissima Paola De Ferrari, alla
                  grafica preziosa di Fiamma Spinelli e ai suoi suggerimenti; dai
                  saggi di Simonetta De Fazi e Luciana Tufani, al supporto di
                  Marzia Vaccari con il suo ServerDonne e alla diffusione della
                  piattaforma da parte di Paola D’Arcangelo.
                </p>
                <p>
                  Le voci che ascolterete sono quelle delle attrici di Amleta,
                  mentre la cura tecnica è nata tra le mura di casa mia: grazie ad
                  Antonella Civale, una delle attrici, ho allestito lo studio,
                  chiedendo poi all’informatico Francesco Buttarazzi di insegnarmi
                  a usare il software di registrazione, anche se poi il più l’ho
                  fatto da sola.
                </p>
                <p>
                  Oggi, con orgoglio, porto questo patrimonio alle vostre orecchie.
                  Ringrazio infine l’ambasciatore Memmo che, in qualità di erede di
                  Paola Masino, mi ha ceduto gratuitamente i diritti su
                  quell’opera preziosissima; e ringrazio Francesca Genti che, sempre
                  gratuitamente, mi ha permesso di realizzare l’audio della sua
                  bellissima Ballata di Nina Simone.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/library"
                  className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  Vai al catalogo
                </Link>
                <Link
                  href="/"
                  className="panel inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition hover:bg-white"
                >
                  Torna alla home
                </Link>
              </div>
            </article>

            <aside className="space-y-4">
              <article className="panel rounded-2xl p-5">
                <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-accent">
                  <Mic2 size={14} />
                  Missione audio
                </p>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Dare voce alla scrittura delle donne, custodire memoria culturale
                  e creare un ascolto accessibile, curato e contemporaneo.
                </p>
              </article>

              <article className="panel rounded-2xl p-5">
                <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-accent">
                  <NotebookPen size={14} />
                  Metodo
                </p>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Testi selezionati, registrazione artigianale, lavoro collettivo e
                  attenzione editoriale su ogni capitolo.
                </p>
              </article>

              <article className="panel rounded-2xl p-5">
                <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-accent">
                  <HeartHandshake size={14} />
                  Iniziativa indipendente
                </p>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Si tratta di un’iniziativa interamente autofinanziata e senza
                  scopo di lucro, volta a promuovere la cultura delle donne.
                </p>
              </article>
            </aside>
          </section>
        </main>
      </div>
    </div>
  );
}

