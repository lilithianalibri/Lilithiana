# Piano MVP Audiolibri (entro domenica)

## Obiettivo demo
- Catalogo libri cliccabili.
- Player audio per capitolo direttamente da sito.
- Indicazione capitolo attuale + barra avanzamento + minutaggio.
- Ripresa dall’ultimo punto.
- Segnalibri legati all’account.

## Stack free scelto
- Frontend: Next.js (già in repo).
- Database + Auth: Supabase Free.
- Storage audio: Cloudflare R2.
- Deploy: Vercel.

## Cosa è già stato preparato nel codice
- Schema DB pronto in `supabase/schema.sql`.
- Player reale con `<audio>`: [audio-player.tsx](/c:/Users/HYDRA/Sitostef/app/components/audio-player.tsx).
- Login/registrazione base Supabase: [auth-card.tsx](/c:/Users/HYDRA/Sitostef/app/components/auth-card.tsx).
- Pagina libro collegata a player + account: [page.tsx](/c:/Users/HYDRA/Sitostef/app/libri/[slug]/page.tsx).
- Data layer con fallback mock / DB reale: [catalog.ts](/c:/Users/HYDRA/Sitostef/app/lib/catalog.ts).
- Script upload batch su R2 + manifest: [upload-audio-to-r2.mjs](/c:/Users/HYDRA/Sitostef/scripts/upload-audio-to-r2.mjs).
- Script SQL da manifest capitoli: [build-sql-from-manifest.mjs](/c:/Users/HYDRA/Sitostef/scripts/build-sql-from-manifest.mjs).

## Step-by-step operativo (adesso)
1. Copia `.env.example` in `.env.local` e compila variabili Supabase + R2.
2. In Supabase esegui `supabase/schema.sql` dalla SQL Editor.
3. Metti i file audio in locale nella struttura:
   - `audio-import/<book-slug>/01-capitolo-uno.wav`
   - `audio-import/<book-slug>/02-capitolo-due.wav`
4. Dry run upload:
   - `set R2_DRY_RUN=1`
   - `node scripts/upload-audio-to-r2.mjs`
5. Upload reale:
   - `set R2_DRY_RUN=0`
   - `node scripts/upload-audio-to-r2.mjs`
6. Genera SQL capitoli da manifest:
   - `node scripts/build-sql-from-manifest.mjs`
7. Esegui SQL generato `supabase/import/seed-chapters.sql` (ora crea/aggiorna automaticamente anche i libri in `audiobooks`).
8. Avvia app e verifica:
   - `npm run dev`
   - apri `/library` e poi `/libri/<slug>`.

## Dati che servono da te per chiudere al 100%
- Slug/titolo/autrice/narratrice reali dei libri (almeno 3 per demo).
- Conferma URL pubblico R2 (`R2_PUBLIC_BASE_URL`).
- Conferma se in Supabase Auth vuoi:
  - solo email+password, oppure
  - magic link.

## Nota importante su Terabox
- Se Terabox non ti espone export/API comode, la via più rapida per la demo è:
  - download locale dei WAV,
  - upload batch verso R2 con lo script.
