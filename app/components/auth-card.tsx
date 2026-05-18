"use client";

import HCaptcha from "@hcaptcha/react-hcaptcha";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { KeyRound, Loader2, LogOut, ShieldCheck, UserRoundPlus } from "lucide-react";
import { getSupabaseBrowserClient } from "../lib/supabase/browser";

type AuthCardProps = {
  compact?: boolean;
  redirectTo?: string;
};

type AuthMode = "signin" | "signup";

function sanitizeRedirect(path?: string) {
  if (!path || !path.startsWith("/")) {
    return "/dashboard";
  }

  return path;
}

function formatDate(isoDate?: string | null) {
  if (!isoDate) {
    return null;
  }

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function AuthCard({ compact = false, redirectTo = "/dashboard" }: AuthCardProps) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaNonce, setCaptchaNonce] = useState(0);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userCreatedAt, setUserCreatedAt] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;
  const authRedirect = sanitizeRedirect(redirectTo);
  const registrationRequiresCaptcha = Boolean(siteKey);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!active) {
        return;
      }
      setUserEmail(data.user?.email ?? null);
      setUserCreatedAt(data.user?.created_at ?? null);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
      setUserCreatedAt(session?.user?.created_at ?? null);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  if (!supabase) {
    return (
      <div className="rounded-2xl border border-accent/18 bg-white/68 p-4 text-sm text-muted">
        Configura le variabili Supabase per attivare login, dashboard e segnalibri cloud.
      </div>
    );
  }

  async function handleSignIn() {
    if (!supabase) {
      return;
    }

    if (!email || !password) {
      setMessage("Inserisci email e password.");
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Accesso effettuato. Reindirizzamento in corso...");
    router.push(authRedirect);
    router.refresh();
  }

  async function handleSignUp() {
    if (!supabase) {
      return;
    }

    if (!email || !password) {
      setMessage("Inserisci email e password.");
      return;
    }

    if (registrationRequiresCaptcha && !captchaToken) {
      setMessage("Completa il CAPTCHA per procedere con la registrazione.");
      return;
    }

    setLoading(true);
    setMessage(null);

    const emailRedirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(authRedirect)}`
        : undefined;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
        captchaToken: captchaToken ?? undefined,
        data: displayName ? { display_name: displayName } : undefined,
      },
    });

    setLoading(false);
    setCaptchaToken(null);
    setCaptchaNonce((current) => current + 1);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(
      "Registrazione inviata. Controlla la mail e conferma l'account per entrare nella dashboard.",
    );
  }

  async function handleSignOut() {
    if (!supabase) {
      return;
    }

    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signOut();
    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Sessione chiusa.");
    router.refresh();
  }

  const wrapperClass = compact
    ? "rounded-2xl border border-accent/18 bg-white/72 p-4"
    : "panel rounded-3xl p-6 sm:p-7";

  if (userEmail) {
    return (
      <div className={wrapperClass}>
        <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted">
          <ShieldCheck size={13} />
          Account attivo
        </p>
        <p className="mt-3 text-base font-semibold text-foreground">{userEmail}</p>
        {userCreatedAt ? (
          <p className="mt-1 text-xs text-muted">Iscritta dal {formatDate(userCreatedAt)}</p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/dashboard"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Vai alla dashboard
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-white px-4 py-2 text-sm font-semibold text-accent transition hover:bg-white disabled:opacity-70"
          >
            <LogOut size={14} />
            Esci
          </button>
        </div>

        {message ? <p className="mt-3 text-xs text-muted">{message}</p> : null}
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted">
          <KeyRound size={12} />
          Accesso utente
        </p>
        <div className="inline-flex rounded-full border border-accent/20 bg-white/80 p-1 text-xs">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setMessage(null);
            }}
            className={`rounded-full px-3 py-1.5 font-semibold transition ${
              mode === "signin"
                ? "bg-accent text-white"
                : "text-accent hover:bg-accent/10"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setMessage(null);
            }}
            className={`rounded-full px-3 py-1.5 font-semibold transition ${
              mode === "signup"
                ? "bg-accent text-white"
                : "text-accent hover:bg-accent/10"
            }`}
          >
            Registrati
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {mode === "signup" ? (
          <input
            type="text"
            autoComplete="name"
            placeholder="Nome visualizzato (opzionale)"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            className="w-full rounded-full border border-accent/22 bg-white px-4 py-2.5 text-sm outline-none ring-accent/25 focus:ring-2"
          />
        ) : null}
        <input
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-full border border-accent/22 bg-white px-4 py-2.5 text-sm outline-none ring-accent/25 focus:ring-2"
        />
        <input
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-full border border-accent/22 bg-white px-4 py-2.5 text-sm outline-none ring-accent/25 focus:ring-2"
        />
      </div>

      {mode === "signup" && siteKey ? (
        <div className="mt-4 overflow-hidden rounded-xl border border-accent/16 bg-white p-2">
          <HCaptcha
            key={captchaNonce}
            sitekey={siteKey}
            onVerify={(token) => {
              setCaptchaToken(token);
            }}
            onExpire={() => {
              setCaptchaToken(null);
            }}
            onError={() => {
              setCaptchaToken(null);
              setMessage("Captcha non valido. Riprova.");
            }}
          />
        </div>
      ) : null}

      {mode === "signup" && !siteKey ? (
        <p className="mt-3 text-xs text-muted">
          CAPTCHA non configurato: aggiungi <code>NEXT_PUBLIC_HCAPTCHA_SITE_KEY</code>{" "}
          per attivare la protezione anti-bot in registrazione.
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {mode === "signin" ? (
          <button
            type="button"
            onClick={handleSignIn}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-70"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : null}
            Entra
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSignUp}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-70"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : null}
            <UserRoundPlus size={14} />
            Crea account
          </button>
        )}
      </div>

      {message ? <p className="mt-3 text-xs text-muted">{message}</p> : null}
    </div>
  );
}
