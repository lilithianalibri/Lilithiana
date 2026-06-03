import chaptersManifestJson from "../../supabase/import/chapters-manifest.json";
import bookMetadataOverridesJson from "../../supabase/import/book-metadata-overrides.json";
import { formatDurationLabel } from "./time";

export type Chapter = {
  id: string;
  title: string;
  duration: string;
  durationSeconds?: number;
  audioUrl?: string | null;
  order?: number;
};

export type AudioBook = {
  id?: string;
  slug: string;
  title: string;
  author: string;
  translator?: string;
  narrator: string;
  category: string;
  description: string;
  copyrightNotice?: string;
  totalDuration: string;
  totalDurationSeconds?: number;
  coverFrom: string;
  coverVia: string;
  coverTo: string;
  vibe: string;
  chapters: Chapter[];
  resumeChapterId: string;
  resumeAt: string;
};

type ManifestChapter = {
  book_slug: string;
  chapter_index: number;
  chapter_slug: string;
  chapter_title: string;
  duration_seconds: number;
  audio_url: string;
};

type BookMetadataOverride = {
  title?: string;
  author?: string;
  translator?: string;
  narrator?: string;
  category?: string;
  description?: string;
  copyright_notice?: string;
  publication_year?: number;
  vibe?: string;
  cover_from?: string;
  cover_via?: string;
  cover_to?: string;
};

const chaptersManifest = chaptersManifestJson as ManifestChapter[];
const bookMetadataOverrides = bookMetadataOverridesJson as Record<
  string,
  BookMetadataOverride
>;

function cleanOptional(value: string | undefined) {
  return value?.trim() || undefined;
}

export function getBookCredits(slug: string) {
  const metadata = getBookMetadataOverride(slug);

  return {
    author: metadata.author,
    translator: metadata.translator,
    narrator: metadata.narrator,
  };
}

export function getBookMetadataOverride(slug: string) {
  const metadata = bookMetadataOverrides[slug] ?? {};
  const publicationYear = Number(metadata.publication_year);
  const description = cleanOptional(metadata.description);

  return {
    author: cleanOptional(metadata.author),
    translator: cleanOptional(metadata.translator),
    narrator: cleanOptional(metadata.narrator),
    category: cleanOptional(metadata.category),
    description:
      description && Number.isFinite(publicationYear)
        ? `${description} Prima pubblicazione: ${publicationYear}.`
        : description,
    copyrightNotice: cleanOptional(metadata.copyright_notice),
    title: cleanOptional(metadata.title),
    vibe: cleanOptional(metadata.vibe),
  };
}

const coverPalette = [
  { from: "#6e1f3b", via: "#bc6f79", to: "#26131d" },
  { from: "#304f66", via: "#79a6b2", to: "#101a2b" },
  { from: "#624220", via: "#d3a372", to: "#29170d" },
  { from: "#3f2b5e", via: "#8d6ca8", to: "#1a1227" },
  { from: "#4f2948", via: "#a06f90", to: "#1f1220" },
  { from: "#244066", via: "#5e8bb7", to: "#121f31" },
];

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => `${word[0]?.toUpperCase() ?? ""}${word.slice(1)}`)
    .join(" ");
}

function pickCover(slug: string) {
  const hash = [...slug].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return coverPalette[hash % coverPalette.length];
}

function resolveCover(slug: string, metadata: BookMetadataOverride) {
  const fallback = pickCover(slug);

  return {
    from: metadata.cover_from?.trim() || fallback.from,
    via: metadata.cover_via?.trim() || fallback.via,
    to: metadata.cover_to?.trim() || fallback.to,
  };
}

function buildImportedAudiobooks(): AudioBook[] {
  const chaptersByBook = new Map<string, ManifestChapter[]>();

  for (const chapter of chaptersManifest) {
    if (!chaptersByBook.has(chapter.book_slug)) {
      chaptersByBook.set(chapter.book_slug, []);
    }
    chaptersByBook.get(chapter.book_slug)?.push(chapter);
  }

  return [...chaptersByBook.entries()]
    .map(([slug, chapters]) => {
      const metadata = bookMetadataOverrides[slug] ?? {};
      const sortedChapters = chapters
        .slice()
        .sort((a, b) => Number(a.chapter_index) - Number(b.chapter_index));
      const totalDurationSeconds = sortedChapters.reduce(
        (acc, chapter) => acc + (Number(chapter.duration_seconds) || 0),
        0,
      );
      const cover = resolveCover(slug, metadata);
      const title = metadata.title?.trim() || titleFromSlug(slug);
      const credits = getBookCredits(slug);
      const description = metadata.description?.trim()
        ? metadata.description.trim()
        : `Audiolibro disponibile nel catalogo LILITHIANA: ${title}.`;

      return {
        id: `static-${slug}`,
        slug,
        title,
        author: credits.author || "Autrice da aggiornare",
        translator: credits.translator,
        narrator: credits.narrator || "Voce da aggiornare",
        category: metadata.category?.trim() || "Narrativa",
        description:
          metadata.publication_year && Number.isFinite(metadata.publication_year)
            ? `${description} Prima pubblicazione: ${metadata.publication_year}.`
            : description,
        copyrightNotice: metadata.copyright_notice?.trim() || undefined,
        totalDuration: formatDurationLabel(totalDurationSeconds),
        totalDurationSeconds,
        coverFrom: cover.from,
        coverVia: cover.via,
        coverTo: cover.to,
        vibe: metadata.vibe?.trim() || "Audiolibro LILITHIANA",
        chapters: sortedChapters.map((chapter) => ({
          id: `${slug}-${chapter.chapter_slug}`,
          title: chapter.chapter_title,
          duration: formatDurationLabel(Number(chapter.duration_seconds) || 0),
          durationSeconds: Number(chapter.duration_seconds) || 0,
          audioUrl: chapter.audio_url || null,
          order: Number(chapter.chapter_index) || 1,
        })),
        resumeChapterId:
          sortedChapters.length > 0
            ? `${slug}-${sortedChapters[0].chapter_slug}`
            : "",
        resumeAt: "00:00",
      } satisfies AudioBook;
    })
    .sort((a, b) => a.title.localeCompare(b.title, "it"));
}

const audiobooks: AudioBook[] = [
  {
    slug: "briganta",
    title: "La briganta",
    author: "Maria Rosa Cutrufelli",
    narrator: "Antonella Civale",
    category: "Narrativa",
    description:
      "Dal carcere in cui è rinchiusa ormai da vent’anni, una donna rivive i suoi giorni da briganta quando, all’indomani dell’unità d’Italia, si aggregò alle bande di ribelli che sconvolsero le regioni meridionali nella speranza di un illusorio riscatto sociale.",
    totalDuration: "3h 59m 55s",
    coverFrom: "#6e1f3b",
    coverVia: "#bc6f79",
    coverTo: "#26131d",
    vibe: "Romanzo storico, memoria femminile, riscatto sociale",
    chapters: [
      {
        id: "briganta-01",
        title: "Intro",
        duration: "20s",
        audioUrl:
          "https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/01-intro.wav",
      },
      {
        id: "briganta-02",
        title: "Primavera 1883",
        duration: "21m 28s",
        audioUrl:
          "https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/02-primavera-1883.wav",
      },
      {
        id: "briganta-03",
        title: "Marzo 1861",
        duration: "35m 12s",
        audioUrl:
          "https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/03-marzo-1861.wav",
      },
      {
        id: "briganta-04",
        title: "Aprile 1861",
        duration: "21m 39s",
        audioUrl:
          "https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/04-aprile-1861.wav",
      },
      {
        id: "briganta-05",
        title: "Maggio 1861",
        duration: "27m 26s",
        audioUrl:
          "https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/05-maggio-1861.wav",
      },
      {
        id: "briganta-06",
        title: "Giugno 1861",
        duration: "42m 09s",
        audioUrl:
          "https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/06-giugno-1861.wav",
      },
      {
        id: "briganta-07",
        title: "Luglio 1861",
        duration: "32m 01s",
        audioUrl:
          "https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/07-luglio-1861.wav",
      },
      {
        id: "briganta-08",
        title: "Agosto 1861",
        duration: "40m 18s",
        audioUrl:
          "https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/08-agosto-1861.wav",
      },
      {
        id: "briganta-09",
        title: "Primavera 1863",
        duration: "9m 36s",
        audioUrl:
          "https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/09-primavera-1863.wav",
      },
      {
        id: "briganta-10",
        title: "Estate 1883",
        duration: "2m 10s",
        audioUrl:
          "https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/10-estate-1883.wav",
      },
      {
        id: "briganta-11",
        title: "Postfazione. La briganta e io",
        duration: "7m 36s",
        audioUrl:
          "https://pub-5c8f826260ec4bc4a78e9186bb598e0e.r2.dev/briganta/11-postfazione-la-briganta-e-io.wav",
      },
    ],
    resumeChapterId: "briganta-01",
    resumeAt: "00:00",
  },
  {
    slug: "le-figlie-del-sale",
    title: "Le Figlie del Sale",
    author: "Elena Verri",
    narrator: "Chiara Bellini",
    category: "Gothic Contemporary Fiction",
    description:
      "In una citta portuale avvolta dalla nebbia, tre sorelle scoprono un segreto di famiglia che puo cambiare il destino di tutte le donne della loro stirpe.",
    totalDuration: "11h 52m",
    coverFrom: "#6e1f3b",
    coverVia: "#bc6f79",
    coverTo: "#26131d",
    vibe: "Saga familiare, mistero, maree emotive",
    chapters: [
      { id: "p1", title: "Prologo - La lettera senza firma", duration: "14m" },
      { id: "c1", title: "Capitolo 1 - Le finestre chiuse", duration: "38m" },
      { id: "c2", title: "Capitolo 2 - Sale sulla pelle", duration: "41m" },
      {
        id: "c3",
        title: "Capitolo 3 - Il patto del mercoledi",
        duration: "36m",
      },
      {
        id: "c4p1",
        title: "Capitolo 4 - Parte 1 - La stanza del porto",
        duration: "29m",
      },
      {
        id: "c4p2",
        title: "Capitolo 4 - Parte 2 - Tutto cio che manca",
        duration: "31m",
      },
      { id: "e1", title: "Epilogo - Marea alta", duration: "18m" },
      { id: "x1", title: "Contenuti extra - Dialogo con l’autrice", duration: "12m" },
    ],
    resumeChapterId: "c4p1",
    resumeAt: "12:47",
  },
  {
    slug: "orchidea-di-vetro",
    title: "Orchidea di Vetro",
    author: "Nina Corsi",
    narrator: "Marta Rinaldi",
    category: "Narrative Essays",
    description:
      "Una fotografa e una restauratrice si incontrano a Firenze durante una mostra e scoprono che alcune opere nascondono una storia dimenticata al femminile.",
    totalDuration: "9h 16m",
    coverFrom: "#304f66",
    coverVia: "#79a6b2",
    coverTo: "#101a2b",
    vibe: "Romance, arte, tensione elegante",
    chapters: [
      { id: "p1", title: "Introduzione - Luce d’inverno", duration: "10m" },
      { id: "c1", title: "Capitolo 1 - Cornici spezzate", duration: "32m" },
      { id: "c2", title: "Capitolo 2 - Camera oscura", duration: "44m" },
      { id: "c3", title: "Capitolo 3 - Le mani sul marmo", duration: "37m" },
      { id: "c4", title: "Capitolo 4 - Voci nella galleria", duration: "41m" },
      { id: "e1", title: "Epilogo - Una nuova firma", duration: "15m" },
      { id: "x1", title: "Contenuti extra - Note di produzione", duration: "8m" },
    ],
    resumeChapterId: "c2",
    resumeAt: "07:21",
  },
  {
    slug: "la-mappa-delle-invisibili",
    title: "La Mappa delle Invisibili",
    author: "Greta Monti",
    narrator: "Alice Doria",
    category: "Memoir Fiction",
    description:
      "Una giornalista indaga sulle storie di donne cancellate dagli archivi ufficiali e trova una rete segreta che attraversa generazioni intere.",
    totalDuration: "13h 03m",
    coverFrom: "#624220",
    coverVia: "#d3a372",
    coverTo: "#29170d",
    vibe: "Inchiesta narrativa, empowerment, colpi di scena",
    chapters: [
      { id: "p1", title: "Prologo - La pagina strappata", duration: "16m" },
      { id: "c1", title: "Capitolo 1 - Nomi cancellati", duration: "45m" },
      { id: "c2", title: "Capitolo 2 - Archivio 27", duration: "39m" },
      { id: "c3", title: "Capitolo 3 - La voce di Sofia", duration: "34m" },
      { id: "c4", title: "Capitolo 4 - Il corridoio 6", duration: "40m" },
      { id: "c5", title: "Capitolo 5 - Parte 1 - Il dossier blu", duration: "30m" },
      { id: "c6", title: "Capitolo 5 - Parte 2 - Quello che resta", duration: "33m" },
      { id: "e1", title: "Epilogo - Le firme ritrovate", duration: "19m" },
    ],
    resumeChapterId: "c4",
    resumeAt: "19:09",
  },
  {
    slug: "notturno-per-iris",
    title: "Notturno per Iris",
    author: "Claudia Serra",
    narrator: "Francesca D’Angelo",
    category: "Intimate Fiction",
    description:
      "In una Roma notturna e magnetica, una compositrice crea una colonna sonora che sembra prevedere eventi reali prima che accadano.",
    totalDuration: "8h 49m",
    coverFrom: "#3f2b5e",
    coverVia: "#8d6ca8",
    coverTo: "#1a1227",
    vibe: "Urban fantasy, musica, anima dark chic",
    chapters: [
      { id: "p1", title: "Introduzione - Un accordo sospeso", duration: "9m" },
      { id: "c1", title: "Capitolo 1 - Via delle ombre", duration: "35m" },
      { id: "c2", title: "Capitolo 2 - Battito a 72", duration: "31m" },
      { id: "c3", title: "Capitolo 3 - Le cuffie dorate", duration: "42m" },
      { id: "c4", title: "Capitolo 4 - Parte 1 - Il palco vuoto", duration: "24m" },
      { id: "c5", title: "Capitolo 4 - Parte 2 - La nota finale", duration: "26m" },
      { id: "e1", title: "Epilogo - Alba in 6/8", duration: "14m" },
    ],
    resumeChapterId: "c3",
    resumeAt: "03:58",
  },
  {
    slug: "casa-di-ambra",
    title: "Casa di Ambra",
    author: "Elisa Nobili",
    narrator: "Giada Rossetti",
    category: "Literary Fiction",
    description:
      "In una villa sospesa tra lago e bosco, una restauratrice ritrova i diari di tre donne vissute in epoche diverse e ricompone una genealogia di coraggio.",
    totalDuration: "10h 22m",
    coverFrom: "#4f2948",
    coverVia: "#a06f90",
    coverTo: "#1f1220",
    vibe: "Memoria, case simboliche, legami femminili",
    chapters: [
      { id: "p1", title: "Prologo - Le chiavi di vetro", duration: "12m" },
      { id: "c1", title: "Capitolo 1 - Il cancello est", duration: "33m" },
      { id: "c2", title: "Capitolo 2 - Il corridoio d’ambra", duration: "39m" },
      { id: "c3", title: "Capitolo 3 - Parte 1 - Le lettere", duration: "27m" },
      { id: "c4", title: "Capitolo 3 - Parte 2 - La stanza rossa", duration: "29m" },
      { id: "e1", title: "Epilogo - Il giardino acceso", duration: "16m" },
      { id: "x1", title: "Contenuti extra - Q&A con l’autrice", duration: "11m" },
    ],
    resumeChapterId: "c2",
    resumeAt: "21:33",
  },
  {
    slug: "marea-di-luce",
    title: "Marea di Luce",
    author: "Silvia Ferri",
    narrator: "Nora Valli",
    category: "Short Stories",
    description:
      "Una raccolta di racconti brevi ambientati in citta costiere, dove ogni protagonista affronta una scelta decisiva nel giro di una sola notte.",
    totalDuration: "6h 48m",
    coverFrom: "#244066",
    coverVia: "#5e8bb7",
    coverTo: "#121f31",
    vibe: "Racconti moderni, notti d’estate, rinascita",
    chapters: [
      { id: "p1", title: "Introduzione - Cartoline di sera", duration: "8m" },
      { id: "c1", title: "Capitolo 1 - L’ultima corsa", duration: "26m" },
      { id: "c2", title: "Capitolo 2 - La terrazza blu", duration: "24m" },
      { id: "c3", title: "Capitolo 3 - Cambio di marea", duration: "28m" },
      { id: "e1", title: "Epilogo - Una luce nuova", duration: "13m" },
      { id: "x1", title: "Contenuti extra - Dietro le storie", duration: "9m" },
    ],
    resumeChapterId: "c1",
    resumeAt: "05:14",
  },
];

const ACTIVE_BOOK_SLUGS = new Set(["briganta"]);

export function getAllAudiobooks() {
  const importedAudiobooks = buildImportedAudiobooks();

  if (importedAudiobooks.length > 0) {
    return importedAudiobooks;
  }

  return audiobooks.filter((book) => ACTIVE_BOOK_SLUGS.has(book.slug));
}

export function getBookBySlug(slug: string) {
  return getAllAudiobooks().find((book) => book.slug === slug);
}

export function getFeaturedBook() {
  return getAllAudiobooks()[0];
}
