# Audiobook import — November 2026

Imported into the existing Supabase project `wuillmauiepcyighordz` and Cloudflare R2 bucket on 2026-11-09.

| Book | Category | Audio order | Duration | Cover |
| --- | --- | --- | --- | --- |
| Telegrafi dello Stato (Sezione femminile) — Matilde Serao, read by Antonella Civale | Narrativa | serao01.wav → serao2.wav → serao03.wav → serao04.wav | 1:43:51 | Amber |
| Il voto alle donne e donne della Costituente — Paola Gaiotti de Biase, read by Paola Giglio | Saggistica | 1voto alle donne e costituente.wav | 18:42 | Petrol blue |

Source archive: `wetransfer_copia-aggiorna_2026-11-08_2016.zip` from the user's Downloads folder.
Original extraction and ordered, byte-identical WAV copies are retained locally under the ignored folder `audio-import/2026-11-new-books/` (`source/` and `ordered/`). The archive also contains editor peak-cache `.pkf` files and two copies of a metadata Word document; these were preserved in the extraction and are not audio tracks.

Both supplied books already have “Lilithiana presenta” and their own credits embedded in the first WAV file. No additional introduction was inserted. The intros found in the existing database are specific to their respective books and include their titles and credits; they were inspected, not reused for these new books. The vote recording announces “A sessant’anni dal voto alle donne”; the catalog retains the title supplied by the user and the accompanying metadata document.

The archive does **not** contain audio for *Non toccare il cielo* or *Novelle*. No catalog entries were published for those two books.

## Import artifacts

- `book-metadata-overrides.json`: titles, descriptions, categories, credits and cover colors.
- `chapters-manifest.json`: the five ordered tracks, measured durations and public URLs.
- `integrity.json`: source-to-copy mapping and SHA-256 checksums.
- `upload-verification.json`: complete local audio decoding, matching multipart upload checksums, HTTP content types and byte-range checks against the public URLs.
- `site-verification.json`: successful responses from both live book pages and visibility in the library.
- `import.sql`: the transaction applied to insert these books and their chapters. Existing books, user progress and bookmarks were left untouched.

The main static catalog metadata, manifest, summary and CSV also include the new books for the existing fallback behavior. The live site reads Supabase dynamically; no application deployment was needed.

Description context for Serao was checked against [the text on Wikisource](https://it.wikisource.org/wiki/Il_romanzo_della_fanciulla/Telefoni_di_stato_%28Sezione_femminile%29) and [Poste Italiane's account](https://www.posteitaliane.it/it/racconti-telegrafici-serao.html). Credits and categories follow the user's request, with the audio introductions used as additional evidence. No uncertain publication year was added.
