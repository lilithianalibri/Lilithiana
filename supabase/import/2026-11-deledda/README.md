# Novelle — Grazia Deledda

Prepared from the user's three WeTransfer archives on 2026-11-09, preserving the requested sequence: **0–3 → 4–7 → fine**.

- Title: **Novelle**
- Author: **Grazia Deledda**
- Narrator: **Antonella Civale**
- Category: **Narrativa**
- Cover: sage green, using the existing gradient cover component
- Tracks: **14**
- Total duration: **4:57:59** (17,879 seconds, sum of track durations rounded to seconds)

## Sources and sequence

| Archive | Source indices | Tracks in playback order |
| --- | --- | --- |
| `wetransfer_deledda-da-0-a-3_2026-11-08_2006.zip` | 00–03 | La volpe; Chiaroscuro; Le tredici uova; La porta aperta |
| `wetransfer_deledda-da-4-a-7_2026-11-08_2009.zip` | 04–07 | La porta chiusa; Il Natale del consigliere; Al servizio del re; Padrona e servi |
| `wetransfer_deledda-fine_2026-11-08_2011.zip` | 08–13 | La scomunica; L’uomo nuovo; La cerbiatta; La festa del Cristo; Un po’ a tutti; L’ultima |

There are no missing or duplicated source indices. Filenames retain the original numbering from **00 to 13**; `chapter_index` uses **1 to 14** to comply with the existing database constraint. These are separate ordered tracks belonging to one audiobook, preserving normal chapter navigation and resume behavior.

The first recording already includes “Lilithiana presenta Novelle di Grazia Deledda, lette da Antonella Civale”, followed by *La volpe*. It is preserved inside that track. No introduction from a different book is reused and no new speech is synthesized.

Chapter titles were checked against the spoken openings. Spelling is normalized for display, including `02le 13 uova.wav` → **Le tredici uova**, `10cerbiatta.wav` → **La cerbiatta**, and `13Ll'ultima.wav` → **L’ultima**. The selected titles can also be found in [the primary text's table of contents on Wikisource](https://it.wikisource.org/wiki/Chiaroscuro). The catalog title remains **Novelle**, as requested; this selection is not presented as all twenty-two stories in the printed collection *Chiaroscuro*. No publication year or edition is assumed.

## Artifacts and verification

- `chapters-manifest.json`: ordered chapter titles, measured durations, storage keys and public URLs.
- `book-metadata-overrides.json`: complete book metadata, description and cover palette.
- `integrity.json`: original filenames, playback order and SHA-256 checksums of byte-identical copies.
- `upload-verification.json`: full WAV decoding, public HTTP content types, byte-range comparisons and complete multipart upload checksum verification.
- `site-verification.json`: live and local catalog/book page verification after import.
- `import.sql`: the transaction for this one audiobook and its fourteen chapters, run after upload verification.

Original extractions, ordered audio copies, excerpts used to inspect the spoken openings, and preparation scripts are kept locally under the ignored folder `audio-import/2026-11-deledda/`. Adobe `.pkf` peak-cache files are retained in the extraction and excluded from audio upload. No raw audio or credentials are included in Git.
