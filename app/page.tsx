"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  BookAudio,
  Clock3,
  Headphones,
  ListMusic,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { BookCover } from "./components/book-cover";
import { MainNav } from "./components/main-nav";
import { getAllAudiobooks, getFeaturedBook } from "./lib/audiobooks";
import { getEditorialTrack } from "./lib/editorial-track";

const whyLilithianaCards = [
  {
    title: "Un libro, un percorso completo",
    description:
      "Ogni audiolibro \u00E8 pensato dall'inizio alla fine, con capitoli ordinati e ascolto lineare.",
    icon: Headphones,
  },
  {
    title: "Capitolo per capitolo",
    description:
      "Passa a qualunque capitolo in pochi secondi o segui la storia con massima precisione.",
    icon: ListMusic,
  },
  {
    title: "Riprendi senza perdere il punto",
    description:
      "Rientra esattamente da dove avevi interrotto, anche dopo giorni, senza ricominciare da capo.",
    icon: RotateCcw,
  },
  {
    title: "Ascolto fluido e naturale",
    description:
      "Regola velocit\u00E0, usa avanti/indietro e continua ad ascoltare in modo semplice e immediato.",
    icon: SlidersHorizontal,
  },
] as const;

const saggisticaPattern =
  /(sagg|essay|non[- ]?fiction|reportage|biograf|critica|politic|storic)/i;

function splitCatalogByTrack(books: ReturnType<typeof getAllAudiobooks>) {
  const saggisticaBooks = books.filter((book) =>
    saggisticaPattern.test(book.category),
  );
  const saggisticaSlugSet = new Set(saggisticaBooks.map((book) => book.slug));
  const narrativaBooks = books.filter((book) => !saggisticaSlugSet.has(book.slug));

  return {
    narrativaBooks: narrativaBooks.slice(0, 6),
    saggisticaBooks: saggisticaBooks.slice(0, 6),
  };
}

export default function Home() {
  const books = getAllAudiobooks();
  const featuredBook = getFeaturedBook();
  const { narrativaBooks, saggisticaBooks } = splitCatalogByTrack(books);
  const [activeCatalog, setActiveCatalog] = useState<"narrativa" | "saggistica">(
    "narrativa",
  );

  const visibleCatalog = useMemo(
    () => (activeCatalog === "narrativa" ? narrativaBooks : saggisticaBooks),
    [activeCatalog, narrativaBooks, saggisticaBooks],
  );

  return (
    <div className="relative min-h-screen px-6 pb-16 pt-6 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <MainNav />

        <main className="space-y-10">
          <section className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="space-y-8"
            >
              <span className="panel inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] text-accent">
                <Sparkles size={14} />
                Edizione LILITHIANA
              </span>

              <h1 className="title-glow font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">
                Ascolta gratis e senza alcuna profilazione questi libri, inediti
                nella versione audio, fondamentali per la cultura delle donne per
                contenuti, sperimentazioni e finezza di scrittura.
              </h1>

              <div className="panel inline-flex w-fit max-w-full items-center gap-3 rounded-2xl px-4 py-2.5">
                <p className="text-sm font-semibold text-muted">
                  creato a partire dalla Rete Lilith
                </p>
                <Image
                  src="/lilith.png"
                  alt="Logo Rete Lilith"
                  width={118}
                  height={73}
                  className="h-8 w-auto"
                />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="#catalogo"
                  className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 font-semibold text-white transition hover:brightness-110"
                >
                  Esplora catalogo
                </Link>
                <Link
                  href={`/libri/${featuredBook.slug}`}
                  className="panel inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 font-semibold transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <Headphones size={18} />
                  Apri scheda libro
                </Link>
              </div>
            </motion.div>

            <motion.aside
              id="evidenza"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
              className="panel rounded-3xl p-6"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-muted">
                In evidenza
              </p>
              <div className="mt-4">
                <BookCover
                  title={featuredBook.title}
                  author={featuredBook.author}
                  from={featuredBook.coverFrom}
                  via={featuredBook.coverVia}
                  to={featuredBook.coverTo}
                  className="h-72"
                />
              </div>
              <p className="mt-4 text-sm text-muted">
                Percorso: {getEditorialTrack(featuredBook.category)}
              </p>
              <div className="mt-5 flex items-center justify-between rounded-xl bg-white/65 px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-accent">
                  <Clock3 size={16} />
                  Riprendi da {featuredBook.resumeAt}
                </div>
                <Link
                  href={`/libri/${featuredBook.slug}`}
                  className="text-sm font-semibold hover:text-accent"
                >
                  Ascolta ora
                </Link>
              </div>
            </motion.aside>
          </section>

          <section className="panel rounded-3xl p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
              <article>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">
                  Visione editoriale
                </p>
                <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
                  L&apos;ascolto che unisce cultura e passione politica
                </h2>
                <blockquote className="mt-4 max-w-3xl border-l-2 border-accent/35 pl-4 text-base text-muted">
                  &quot;La speranza &egrave; che questo sforzo, seppur iniziale e incompleto,
                  possa creare uno scambio di competenze tra donne di diverse
                  professionalit&agrave; e mosse da diverse passioni politiche.&quot;
                </blockquote>
                <p className="mt-2 text-sm font-semibold text-accent">
                  Paola De Ferrari.
                </p>
              </article>

              <article className="panel rounded-2xl bg-white/70 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">
                  Ascolta ora
                </p>
                <p className="mt-3 text-sm text-muted">
                  Ascolta gratuitamente dal catalogo online: capitoli ordinati,
                  player diretto e accesso immediato ai titoli in evidenza.
                </p>
                <div className="mt-6 flex justify-center">
                  <Link
                    href={`/libri/${featuredBook.slug}?play=from-start#player`}
                    className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-3 text-base font-semibold text-white transition hover:brightness-110"
                  >
                    Ascolta Gratis
                  </Link>
                </div>
              </article>
            </div>
          </section>

          <section id="catalogo" className="panel rounded-3xl p-6 sm:p-8">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">
                  Catalogo selezionato
                </p>
                <h2 className="mt-2 font-display text-3xl">
                  Catalogo Audiolibri
                </h2>
              </div>
              <div className="hidden items-center gap-2 rounded-full border border-accent/20 bg-white/65 px-4 py-2 text-sm font-semibold text-accent sm:flex">
                <BookAudio size={16} />
                Narrativa e Saggistica
              </div>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-3">
              <div className="relative inline-flex rounded-full border border-accent/20 bg-white/72 p-1">
                {[
                  { id: "narrativa" as const, label: "Narrativa", count: narrativaBooks.length },
                  { id: "saggistica" as const, label: "Saggistica", count: saggisticaBooks.length },
                ].map((tab) => {
                  const isActive = activeCatalog === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveCatalog(tab.id)}
                      className="relative rounded-full px-4 py-2 text-sm font-semibold transition"
                    >
                      {isActive ? (
                        <motion.span
                          layoutId="catalog-pill"
                          className="absolute inset-0 rounded-full bg-accent"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      ) : null}
                      <span
                        className={`relative z-10 inline-flex items-center gap-2 ${
                          isActive ? "text-white" : "text-accent"
                        }`}
                      >
                        {tab.label}
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] ${
                            isActive
                              ? "bg-white/25 text-white"
                              : "bg-accent/10 text-accent"
                          }`}
                        >
                          {tab.count}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Vista attiva: {activeCatalog}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCatalog}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
              >
                {visibleCatalog.length > 0 ? (
                  visibleCatalog.map((book, index) => (
                    <motion.article
                      key={book.slug}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.38 }}
                      className="group"
                    >
                      <Link
                        href={`/libri/${book.slug}`}
                        className="panel block overflow-hidden rounded-2xl p-4 transition duration-300 hover:-translate-y-1 hover:bg-white"
                      >
                        <BookCover
                          title={book.title}
                          author={book.author}
                          from={book.coverFrom}
                          via={book.coverVia}
                          to={book.coverTo}
                          className="h-56"
                        />
                        <div className="mt-4 space-y-2">
                          <h3 className="font-display text-2xl leading-tight">
                            {book.title}
                          </h3>
                          <p className="text-sm text-muted">Autrice: {book.author}</p>
                          <p className="text-sm text-muted">Legge {book.narrator}</p>
                          <div className="gold-line mt-2 h-px w-full" />
                          <p className="text-sm font-semibold text-accent">
                            Durata totale: {book.totalDuration}
                          </p>
                        </div>
                      </Link>
                    </motion.article>
                  ))
                ) : (
                  <div className="panel rounded-2xl bg-white/62 px-4 py-4 text-sm text-muted md:col-span-2 xl:col-span-3">
                    Nessun titolo disponibile in {activeCatalog}. Carica i prossimi
                    audiolibri e appariranno qui.
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </section>

          <section
            className="panel rounded-3xl px-6 py-10 sm:px-10"
            aria-labelledby="why-lilithiana"
          >
            <div className="mx-auto max-w-5xl">
              <p className="text-center text-xs uppercase tracking-[0.24em] text-muted">
                Come funziona
              </p>
              <h2
                id="why-lilithiana"
                className="mt-3 flex flex-wrap items-start justify-center gap-3 text-center font-display text-3xl sm:text-4xl"
              >
                <span>Come funziona</span>
                <Image
                  src="/lilithiana-logo-transparent.png"
                  alt="Lilithiana"
                  width={1572}
                  height={715}
                  className="-mt-4 h-[3.45rem] w-auto sm:-mt-5 sm:h-[4.1rem]"
                />
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted sm:text-base">
                Un&apos;esperienza di ascolto pensata per seguire la tua storia con ritmo,
                chiarezza e continuit&agrave;.
              </p>

              <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {whyLilithianaCards.map((item) => {
                  const Icon = item.icon;
                  return (
                    <article
                      key={item.title}
                      className="panel rounded-2xl bg-white/62 px-4 py-5 text-center"
                    >
                      <Icon size={18} className="mx-auto text-accent" />
                      <h3 className="mt-4 font-display text-xl text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-muted">
                        {item.description}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

