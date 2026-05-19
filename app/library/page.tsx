import Link from "next/link";
import { Headphones, LibraryBig, Sparkles } from "lucide-react";
import { BookCover } from "../components/book-cover";
import { MainNav } from "../components/main-nav";
import { getCatalogBooks } from "../lib/catalog";

export const dynamic = "force-dynamic";

type LibraryPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const filters = [
  "Tutti i libri",
  "Narrativa",
  "Saggistica",
];

const cardBadges = [
  "Continua",
  "In evidenza",
  "Novita",
  "Scelto in redazione",
  "Piu ascoltato",
  "Consigliato",
];

const categoryLabelMap: Record<string, string> = {
  "Gothic Contemporary Fiction": "Narrativa gotica contemporanea",
  "Narrative Essays": "Saggi narrativi",
  "Intimate Fiction": "Narrativa intima",
  "Short Stories": "Racconti brevi",
  "Literary Fiction": "Narrativa letteraria",
  "Memoir Fiction": "Memoria romanzata",
};

function toItalianCategory(category: string) {
  return categoryLabelMap[category] ?? category;
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function toSingleQueryValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const query = await searchParams;
  const searchQuery = toSingleQueryValue(query.q);
  const normalizedQuery = normalize(searchQuery);
  const books = await getCatalogBooks();
  const visibleBooks =
    normalizedQuery.length === 0
      ? books
      : books.filter((book) => {
          const haystack = normalize(
            [
              book.title,
              book.author,
              book.narrator,
              book.category,
              book.description,
              book.vibe,
            ].join(" "),
          );

          return haystack.includes(normalizedQuery);
        });

  return (
    <div className="relative min-h-screen px-6 pb-16 pt-6 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <MainNav searchQuery={searchQuery} />

        <main className="space-y-8">
          <section className="panel rounded-3xl p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
                  <Sparkles size={14} />
                  Libreria audio
                </p>
                <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
                  Storie scritte e narrate da donne
                </h1>
                <p className="mt-3 max-w-2xl text-base text-muted">
                  Esplora la libreria LILITHIANA: ogni titolo è un universo completo,
                  con capitoli ordinati, voce narrante selezionata e ascolto fluido.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-white/65 px-4 py-2 text-sm font-semibold text-accent">
                <LibraryBig size={16} />
                {visibleBooks.length} audiolibri
              </div>
            </div>

            {normalizedQuery.length > 0 ? (
              <p className="mt-4 rounded-2xl border border-accent/16 bg-white/62 px-4 py-3 text-sm text-muted">
                Ricerca attiva: <span className="font-semibold text-foreground">{searchQuery}</span>
              </p>
            ) : null}

            <div className="mt-6 flex flex-nowrap gap-2 overflow-x-auto pb-1 text-sm whitespace-nowrap [&::-webkit-scrollbar]:hidden">
              {filters.map((filter, index) => (
                <button
                  key={filter}
                  className={`rounded-full border px-4 py-2 transition ${
                    index === 0
                      ? "border-accent bg-accent text-white"
                      : "border-accent/16 bg-white/58 text-foreground hover:bg-white"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleBooks.map((book, index) => (
              <article key={book.slug} className="panel rounded-3xl p-4">
                <Link href={`/libri/${book.slug}`} className="group block">
                  <div className="relative">
                    <BookCover
                      title={book.title}
                      author={book.author}
                      from={book.coverFrom}
                      via={book.coverVia}
                      to={book.coverTo}
                      className="h-60 transition duration-300 group-hover:-translate-y-1"
                    />
                    <span className="absolute right-3 top-3 rounded-full bg-black/45 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                      {cardBadges[index % cardBadges.length]}
                    </span>
                  </div>

                  <div className="mt-4 space-y-1">
                    <h2 className="font-display text-2xl leading-tight group-hover:text-accent">
                      {book.title}
                    </h2>
                    <p className="text-sm text-muted">di {book.author}</p>
                    <p className="text-sm text-muted">Legge {book.narrator}</p>
                  </div>

                  <div className="gold-line mt-3 h-px w-full" />
                  <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.12em] text-muted">
                    <span>{toItalianCategory(book.category)}</span>
                    <span>{book.totalDuration}</span>
                  </div>

                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent">
                    <Headphones size={13} />
                    Riprendi da {book.resumeAt}
                  </div>
                </Link>
              </article>
            ))}

            {visibleBooks.length === 0 ? (
              <article className="panel rounded-3xl p-6 text-sm text-muted md:col-span-2 xl:col-span-3">
                Nessun libro trovato per questa ricerca. Prova con titolo o autrice, ad esempio{" "}
                <span className="font-semibold text-foreground">La briganta</span>.
              </article>
            ) : null}
          </section>
        </main>
      </div>
    </div>
  );
}
