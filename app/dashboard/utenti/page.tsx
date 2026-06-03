import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  Clock3,
  MailCheck,
  ShieldCheck,
  UserCheck,
  UsersRound,
} from "lucide-react";
import { MainNav } from "../../components/main-nav";
import {
  canManageUsers,
  getAdminUsersOverview,
} from "../../lib/admin-users";
import { getSupabaseServerClient } from "../../lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Utenti | Dashboard | LILITHIANA",
  description:
    "Pagina dashboard riservata agli admin per vedere utenti registrati e informazioni account.",
};

export default async function DashboardUsersPage() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    redirect("/accedi?next=/dashboard/utenti");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/accedi?next=/dashboard/utenti");
  }

  if (!canManageUsers(user)) {
    redirect("/dashboard");
  }

  const usersOverview = await getAdminUsersOverview();

  return (
    <div className="relative min-h-screen px-6 pb-16 pt-6 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <MainNav />
        <main className="space-y-8">
          <header className="flex items-center justify-between gap-4">
            <Link
              href="/dashboard"
              className="panel inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-white"
            >
              <ArrowLeft size={16} />
              Torna alla dashboard
            </Link>
          </header>

          <section className="panel rounded-3xl p-6 sm:p-8">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
              <ShieldCheck size={14} />
              Dashboard admin
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              Utenti registrati
            </h1>
            <p className="mt-4 max-w-3xl text-base text-muted">
              Vista riservata agli admin con panoramica degli account, ruoli,
              conferme email e ultimi accessi.
            </p>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="panel rounded-2xl p-4">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
                <UsersRound size={14} className="text-accent" />
                Utenti registrati
              </p>
              <p className="mt-2 font-display text-3xl">
                {usersOverview.summary.totalUsers}
              </p>
            </article>
            <article className="panel rounded-2xl p-4">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
                <ShieldCheck size={14} className="text-accent" />
                Admin
              </p>
              <p className="mt-2 font-display text-3xl">
                {usersOverview.summary.adminUsers}
              </p>
            </article>
            <article className="panel rounded-2xl p-4">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
                <MailCheck size={14} className="text-accent" />
                Email confermate
              </p>
              <p className="mt-2 font-display text-3xl">
                {usersOverview.summary.confirmedUsers}
              </p>
            </article>
            <article className="panel rounded-2xl p-4">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
                <Clock3 size={14} className="text-accent" />
                Attivi 30 giorni
              </p>
              <p className="mt-2 font-display text-3xl">
                {usersOverview.summary.activeLast30Days}
              </p>
            </article>
          </section>

          <section className="panel rounded-3xl p-6 sm:p-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted">
                  <UsersRound size={14} className="text-accent" />
                  Account
                </p>
                <h2 className="mt-2 font-display text-3xl">
                  Elenco utenti
                </h2>
              </div>
              <span className="rounded-full border border-accent/20 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                Solo admin
              </span>
            </div>

            {usersOverview.error ? (
              <div className="rounded-2xl border border-accent/18 bg-white/70 px-4 py-4 text-sm text-muted">
                <p className="inline-flex items-center gap-2 font-semibold text-foreground">
                  <AlertTriangle size={15} className="text-accent" />
                  Configurazione incompleta
                </p>
                <p className="mt-2">{usersOverview.error}</p>
              </div>
            ) : usersOverview.users.length === 0 ? (
              <div className="rounded-2xl border border-accent/16 bg-white/65 px-4 py-4 text-sm text-muted">
                Non ci sono ancora utenti registrati.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px] border-separate border-spacing-0 text-left text-sm">
                  <thead className="text-xs uppercase tracking-[0.12em] text-muted">
                    <tr>
                      <th className="border-b border-accent/16 pb-3 pr-4 font-semibold">
                        Utente
                      </th>
                      <th className="border-b border-accent/16 px-4 pb-3 font-semibold">
                        Ruolo
                      </th>
                      <th className="border-b border-accent/16 px-4 pb-3 font-semibold">
                        Provider
                      </th>
                      <th className="border-b border-accent/16 px-4 pb-3 font-semibold">
                        Registrazione
                      </th>
                      <th className="border-b border-accent/16 px-4 pb-3 font-semibold">
                        Conferma
                      </th>
                      <th className="border-b border-accent/16 pb-3 pl-4 font-semibold">
                        Ultimo accesso
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersOverview.users.map((account) => (
                      <tr key={account.id} className="align-top">
                        <td className="border-b border-accent/10 py-4 pr-4">
                          <p className="font-semibold text-foreground">
                            {account.displayName}
                          </p>
                          <p className="mt-1 text-xs text-muted">
                            {account.email}
                          </p>
                        </td>
                        <td className="border-b border-accent/10 px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.11em] ${
                              account.isAdmin
                                ? "bg-accent text-white"
                                : "bg-accent/10 text-accent"
                            }`}
                          >
                            {account.isAdmin ? <UserCheck size={12} /> : null}
                            {account.role}
                          </span>
                        </td>
                        <td className="border-b border-accent/10 px-4 py-4 text-muted">
                          {account.providers}
                        </td>
                        <td className="border-b border-accent/10 px-4 py-4 text-muted">
                          {account.createdAtLabel}
                        </td>
                        <td className="border-b border-accent/10 px-4 py-4 text-muted">
                          {account.confirmedAtLabel}
                        </td>
                        <td className="border-b border-accent/10 py-4 pl-4 text-muted">
                          {account.lastSignInAtLabel}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
