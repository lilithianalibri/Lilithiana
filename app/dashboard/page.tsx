import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BookmarkPlus,
  BookAudio,
  BookOpenCheck,
  Clock3,
  Headphones,
  LibraryBig,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { MainNav } from "../components/main-nav";
import { canManageBooks, canManageUsers } from "../lib/admin-users";
import { getSupabaseServerClient } from "../lib/supabase/server";
import { getUserDashboardData } from "../lib/user-dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard | LILITHIANA",
  description:
    "Area personale con progresso di ascolto, segnalibri e panoramica dei tuoi audiolibri.",
};

function displayNameFromIdentity(email: string | null, metadata: unknown) {
  if (metadata && typeof metadata === "object" && "display_name" in metadata) {
    const value = metadata.display_name;
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  if (!email) {
    return "lettrice";
  }

  const localPart = email.split("@")[0];
  return localPart.length > 0 ? localPart : "lettrice";
}

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    redirect("/accedi?next=/dashboard");
  }

  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (!userId) {
    redirect("/accedi?next=/dashboard");
  }

  const [{ data: userData }, dashboard] = await Promise.all([
    supabase.auth.getUser(),
    getUserDashboardData(userId),
  ]);

  const userEmail = userData.user?.email ?? null;
  const userDisplayName = displayNameFromIdentity(
    userEmail,
    userData.user?.user_metadata,
  );
  const canOpenUsersPanel = canManageUsers(userData.user);
  const canOpenBooksPanel = canManageBooks(userData.user);

  return (
    <div className="relative min-h-screen px-6 pb-16 pt-6 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <MainNav />

        <main className="space-y-8">
          <section className="panel rounded-3xl p-6 sm:p-8">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
              <Sparkles size={14} />
              Dashboard personale
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              Bentornata, {userDisplayName}
            </h1>
            <p className="mt-3 max-w-3xl text-base text-muted">
              Qui trovi i tuoi ascolti in corso, i segnalibri salvati e il punto
              preciso da cui ripartire.
            </p>
            {userEmail ? (
              <p className="mt-2 text-sm text-muted">Account: {userEmail}</p>
            ) : null}
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="panel rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">
                Libri in corso
              </p>
              <p className="mt-2 text-3xl font-display">
                {dashboard.summary.booksInProgress}
              </p>
            </article>
            <article className="panel rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">
                Libri completati
              </p>
              <p className="mt-2 text-3xl font-display">
                {dashboard.summary.booksCompleted}
              </p>
            </article>
            <article className="panel rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">
                Tempo ascoltato stimato
              </p>
              <p className="mt-2 text-3xl font-display">
                {dashboard.summary.listenedLabel}
              </p>
            </article>
            <article className="panel rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">
                Segnalibri
              </p>
              <p className="mt-2 text-3xl font-display">
                {dashboard.summary.totalBookmarks}
              </p>
            </article>
          </section>

          {canOpenBooksPanel || canOpenUsersPanel ? (
            <section className="grid gap-4 lg:grid-cols-2">
              {canOpenBooksPanel ? (
                <article className="panel rounded-3xl p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted">
                        <BookAudio size={14} className="text-accent" />
                        Area editoriale
                      </p>
                      <h2 className="mt-2 font-display text-3xl">
                        Gestione libri
                      </h2>
                      <p className="mt-2 max-w-2xl text-sm text-muted">
                        Crea e modifica schede libro, capitoli e file audio.
                      </p>
                    </div>
                    <Link
                      href="/dashboard/libri"
                      className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                    >
                      <BookAudio size={15} />
                      Apri libri
                    </Link>
                  </div>
                </article>
              ) : null}

              {canOpenUsersPanel ? (
                <article className="panel rounded-3xl p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted">
                        <ShieldCheck size={14} className="text-accent" />
                        Area admin
                      </p>
                      <h2 className="mt-2 font-display text-3xl">
                        Gestione utenti
                      </h2>
                      <p className="mt-2 max-w-2xl text-sm text-muted">
                        Visualizza account registrati, ruoli e ultimi accessi.
                      </p>
                    </div>
                    <Link
                      href="/dashboard/utenti"
                      className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                    >
                      <UsersRound size={15} />
                      Apri utenti
                    </Link>
                  </div>
                </article>
              ) : null}
            </section>
          ) : null}

          <section className="panel rounded-3xl p-6 sm:p-8">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">
                  Continua ascolto
                </p>
                <h2 className="mt-2 font-display text-3xl">I tuoi libri</h2>
              </div>
              <Link
                href="/library"
                className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-white px-4 py-2 text-sm font-semibold text-accent transition hover:bg-white"
              >
                <LibraryBig size={15} />
                Vai al catalogo
              </Link>
            </div>

            {dashboard.continueListening.length === 0 ? (
              <div className="rounded-2xl border border-accent/16 bg-white/65 px-4 py-4 text-sm text-muted">
                Nessun progresso disponibile: scegli un audiolibro dal catalogo e
                inizieremo a tracciare automaticamente dove arrivi.
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {dashboard.continueListening.map((item) => (
                  <article key={item.bookId} className="rounded-2xl border border-accent/16 bg-white/70 p-4">
                    <p className="text-xs uppercase tracking-[0.12em] text-muted">
                      {item.author}
                    </p>
                    <h3 className="mt-1 font-display text-2xl">{item.bookTitle}</h3>

                    <div className="mt-3 space-y-1 text-sm text-muted">
                      {item.chapterTitle ? (
                        <p>
                          Capitolo {item.chapterIndex}: {item.chapterTitle}
                        </p>
                      ) : null}
                      <p className="inline-flex items-center gap-2">
                        <Clock3 size={14} className="text-accent" />
                        Riprendi da {item.currentPositionLabel}
                      </p>
                      <p className="text-xs uppercase tracking-[0.11em]">
                        Ultimo ascolto: {item.updatedAtLabel}
                      </p>
                    </div>

                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-accent/12">
                      <div
                        className="h-full rounded-full bg-accent transition-all"
                        style={{ width: `${item.completionPercent}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-muted">
                      Progresso: {item.completionPercent}% su {item.durationLabel}
                    </p>

                    <Link
                      href={item.continueUrl}
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                    >
                      <Headphones size={14} />
                      Riprendi ascolto
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="panel rounded-3xl p-6 sm:p-8">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">
                  Segnalibri
                </p>
                <h2 className="mt-2 font-display text-3xl">Punti salvati</h2>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                <BookmarkPlus size={13} />
                dal player
              </span>
            </div>

            {dashboard.recentBookmarks.length === 0 ? (
              <div className="rounded-2xl border border-accent/16 bg-white/65 px-4 py-4 text-sm text-muted">
                Non hai ancora salvato segnalibri. Apri un libro e usa il pulsante
                <span className="mx-1 inline-flex rounded-full border border-accent/20 bg-white px-2 py-0.5 text-[11px] font-semibold text-accent">
                  Segnalibro
                </span>
                nel player.
              </div>
            ) : (
              <ol className="space-y-3">
                {dashboard.recentBookmarks.map((bookmark) => (
                  <li key={bookmark.id}>
                    <div className="rounded-2xl border border-accent/16 bg-white/70 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.12em] text-muted">
                            {bookmark.bookTitle}
                          </p>
                          <p className="mt-1 text-sm text-foreground">
                            Capitolo {bookmark.chapterIndex}: {bookmark.chapterTitle}
                          </p>
                          <p className="mt-1 text-xs text-muted">
                            {bookmark.label ?? `Punto salvato a ${bookmark.positionLabel}`}
                          </p>
                          <p className="text-xs text-muted">
                            Creato il {bookmark.createdAtLabel}
                          </p>
                        </div>

                        <Link
                          href={bookmark.jumpUrl}
                          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                        >
                          <BookOpenCheck size={14} />
                          Vai al punto
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
