import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
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

        <main className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <section className="panel rounded-3xl p-6 sm:p-8">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
              <Sparkles size={14} />
              Accesso al club
            </p>
            <h1 className="mt-3 flex flex-nowrap items-start gap-3 font-display text-4xl leading-tight sm:text-5xl">
              <span>Entra in</span>
              <Image
                src="/lilithiana-logo-transparent.png"
                alt="Lilithiana"
                width={1572}
                height={715}
                className="-mt-4 h-16 w-auto sm:-mt-6 sm:h-20"
              />
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted">
              Crea il tuo account per ritrovare sempre il punto esatto di ascolto,
              raccogliere segnalibri e gestire la tua libreria personale dalla dashboard.
            </p>

            <div className="mt-6 rounded-2xl border border-accent/16 bg-white/65 p-4">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
                <ShieldCheck size={12} />
                Sicurezza account
              </p>
              <p className="mt-2 text-sm text-muted">
                La registrazione supporta Cloudflare Turnstile anti-bot. Dopo la
                conferma email, l&apos;accesso viene sincronizzato lato server in cookie
                sicuri.
              </p>
            </div>

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
