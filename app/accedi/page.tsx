import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MailCheck, ShieldCheck, Sparkles } from "lucide-react";
import { AuthCard, type AuthMode } from "../components/auth-card";
import { MainNav } from "../components/main-nav";

type LoginPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata: Metadata = {
  title: "Accesso | LILITHIANA",
  description:
    "Registrati o accedi a LILITHIANA per sincronizzare progresso, segnalibri e dashboard personale.",
};

function resolveNextPath(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (!candidate || !candidate.startsWith("/")) {
    return "/dashboard";
  }

  return candidate;
}

function resolveAuthMode(value: string | string[] | undefined): AuthMode {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (
    candidate === "signin" ||
    candidate === "signup" ||
    candidate === "forgot" ||
    candidate === "reset"
  ) {
    return candidate;
  }

  return "signin";
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const query = await searchParams;
  const next = resolveNextPath(query.next);
  const initialMode = resolveAuthMode(query.mode);
  const hasCallbackError = query.error === "callback";

  return (
    <div className="relative min-h-screen px-6 pb-16 pt-6 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <MainNav />

        <header className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="panel inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-white"
          >
            <ArrowLeft size={16} />
            Torna alla home
          </Link>
        </header>

        <main className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(340px,430px)] lg:items-start">
          <section className="panel rounded-3xl p-6 sm:p-8">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
              <Sparkles size={14} />
              Area lettrici
            </p>
            <h1 className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-4xl leading-tight sm:text-5xl">
              <span>Accedi a</span>
              <Image
                src="/lilithiana-logo-transparent.png"
                alt="Lilithiana"
                width={1572}
                height={715}
                className="-mt-2 h-14 w-auto max-w-[78vw] sm:-mt-4 sm:h-20"
              />
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted">
              Entra o crea un account per ritrovare il punto esatto di ascolto,
              salvare segnalibri e tenere insieme la tua libreria personale.
            </p>

            <ul className="mt-6 grid gap-3 text-sm text-muted sm:grid-cols-2">
              <li className="flex items-start gap-2">
                <MailCheck size={16} className="mt-0.5 shrink-0 text-accent" />
                Registrazione con conferma via email.
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck size={16} className="mt-0.5 shrink-0 text-accent" />
                Sessione protetta e sincronizzata sulla dashboard.
              </li>
            </ul>

            {hasCallbackError ? (
              <p className="mt-4 rounded-2xl border border-accent/18 bg-white/70 px-4 py-3 text-sm text-muted">
                Non sono riuscita a completare la conferma account. Riprova dal link
                ricevuto via email o effettua direttamente il login.
              </p>
            ) : null}
          </section>

          <AuthCard key={initialMode} redirectTo={next} initialMode={initialMode} />
        </main>
      </div>
    </div>
  );
}
