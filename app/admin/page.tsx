import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck, Wrench } from "lucide-react";
import { MainNav } from "../components/main-nav";
import { getSupabaseServerClient } from "../lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | LILITHIANA",
  description: "Area amministrazione riservata agli account admin.",
};

function getRoleFromUser(user: {
  app_metadata?: Record<string, unknown> | null;
  user_metadata?: Record<string, unknown> | null;
} | null) {
  const appRole =
    user?.app_metadata && typeof user.app_metadata.role === "string"
      ? user.app_metadata.role
      : null;
  const userRole =
    user?.user_metadata && typeof user.user_metadata.role === "string"
      ? user.user_metadata.role
      : null;

  return (appRole ?? userRole ?? "").toLowerCase();
}

export default async function AdminPage() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    redirect("/accedi?next=/admin");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/accedi?next=/admin");
  }

  const role = getRoleFromUser(user);
  if (role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen px-6 pb-16 pt-6 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <MainNav />
        <main className="space-y-8">
          <section className="panel rounded-3xl p-6 sm:p-8">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
              <ShieldCheck size={14} />
              Admin access
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              Area amministrazione LILITHIANA
            </h1>
            <p className="mt-4 max-w-3xl text-base text-muted">
              Accesso confermato come amministratrice. Qui possiamo aggiungere i
              pannelli di gestione catalogo, utenti e monitoraggio ascolti.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-white/70 px-4 py-2 text-sm font-semibold text-accent">
              <Wrench size={14} />
              Setup admin completato
            </div>
            <div className="mt-6">
              <Link
                href="/dashboard"
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Torna alla dashboard
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
