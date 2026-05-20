import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Cookie, Settings2 } from "lucide-react";
import { CookiePreferencesTrigger } from "../components/cookie-preferences-trigger";
import { MainNav } from "../components/main-nav";

export const metadata: Metadata = {
  title: "Preferenze Cookie | LILITHIANA",
  description:
    "Gestione delle preferenze cookie su LILITHIANA: aggiorna o revoca in qualsiasi momento le scelte di consenso.",
};

export default function CookiePreferencesPage() {
  return (
    <div className="min-h-screen px-6 pb-16 pt-6 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <MainNav />

        <main className="space-y-6">
          <section className="panel rounded-3xl p-6 sm:p-8">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
              <Cookie size={14} />
              Preferenze Cookie
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              Gestisci il tuo consenso
            </h1>
            <p className="mt-4 max-w-3xl text-sm text-muted sm:text-base">
              Da questa pagina puoi aggiornare in qualsiasi momento le categorie cookie
              opzionali. I cookie tecnici necessari restano sempre attivi per consentire accesso,
              sicurezza e funzionamento del sito.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <CookiePreferencesTrigger className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110" />
              <Link
                href="/cookie-policy"
                className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-white px-5 py-2.5 text-sm font-semibold text-accent transition hover:bg-white"
              >
                <Settings2 size={14} />
                Leggi Cookie Policy
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-white px-5 py-2.5 text-sm font-semibold text-accent transition hover:bg-white"
              >
                <ArrowLeft size={14} />
                Torna alla home
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
