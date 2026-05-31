"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import {
  ArrowRight,
  KeyRound,
  Loader2,
  LogOut,
  MailCheck,
  ShieldCheck,
  UserRoundPlus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useId, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "../lib/supabase/browser";

type AuthCardProps = {
  compact?: boolean;
  redirectTo?: string;
  initialMode?: AuthMode;
};

export type AuthMode = "signin" | "signup" | "forgot" | "reset";

const authCopy: Record<
  AuthMode,
  {
    eyebrow: string;
    title: string;
    description: string;
    submit: string;
  }
> = {
  signin: {
    eyebrow: "Accesso",
    title: "Bentornata",
    description: "Accedi con email e password per ritrovare ascolti, segnalibri e libreria.",
    submit: "Accedi",
  },
  signup: {
    eyebrow: "Registrazione",
    title: "Crea il tuo account",
    description: "Dopo l'invio riceverai una mail: basta confermarla e puoi entrare.",
    submit: "Registrati",
  },
  forgot: {
    eyebrow: "Recupero password",
    title: "Recupera l'accesso",
    description: "Inserisci la tua email e ti arriva il link per scegliere una nuova password.",
    submit: "Invia link",
  },
  reset: {
    eyebrow: "Nuova password",
    title: "Scegli una nuova password",
    description: "Imposta la password nuova dopo aver aperto il link ricevuto via email.",
    submit: "Aggiorna password",
  },
};

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

export function AuthCard({
  compact = false,
  redirectTo = "/dashboard",
  initialMode = "signin",
}: AuthCardProps) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const router = useRouter();
  const formId = useId();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaNonce, setCaptchaNonce] = useState(0);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userCreatedAt, setUserCreatedAt] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const authRedirect = sanitizeRedirect(redirectTo);
  const authActionRequiresCaptcha = Boolean(siteKey) && mode !== "reset";
  const currentCopy = authCopy[mode];

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setPassword("");
    setPasswordConfirm("");
    setMessage(null);
    setCaptchaToken(null);
    setCaptchaNonce((current) => current + 1);
  }

  function resetCaptcha() {
    setCaptchaToken(null);
    setCaptchaNonce((current) => current + 1);
  }

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

    if (authActionRequiresCaptcha && !captchaToken) {
      setMessage("Completa il controllo anti-bot per procedere.");
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken: captchaToken ?? undefined,
      },
    });

    setLoading(false);
    resetCaptcha();

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

    if (password.length < 8) {
      setMessage("La password deve avere almeno 8 caratteri.");
      return;
    }

    if (authActionRequiresCaptcha && !captchaToken) {
      setMessage("Completa il controllo anti-bot per procedere con la registrazione.");
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
    resetCaptcha();

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Registrazione inviata. Controlla la mail e conferma l'account.");
  }

  async function handlePasswordResetRequest() {
    if (!supabase) {
      return;
    }

    if (!email) {
      setMessage("Inserisci l'email del tuo account.");
      return;
    }

    if (authActionRequiresCaptcha && !captchaToken) {
      setMessage("Completa il controllo anti-bot per procedere.");
      return;
    }

    setLoading(true);
    setMessage(null);

    const resetRedirect =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback?next=${encodeURIComponent("/accedi?mode=reset")}`
        : undefined;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetRedirect,
      captchaToken: captchaToken ?? undefined,
    });

    setLoading(false);
    resetCaptcha();

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Ti abbiamo inviato un link per reimpostare la password.");
  }

  async function handlePasswordUpdate() {
    if (!supabase) {
      return;
    }

    if (!password || !passwordConfirm) {
      setMessage("Inserisci e conferma la nuova password.");
      return;
    }

    if (password.length < 8) {
      setMessage("La nuova password deve avere almeno 8 caratteri.");
      return;
    }

    if (password !== passwordConfirm) {
      setMessage("Le password non coincidono.");
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setPassword("");
    setPasswordConfirm("");
    setMessage("Password aggiornata. Reindirizzamento alla dashboard...");
    router.push(authRedirect);
    router.refresh();
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (mode === "signin") {
      void handleSignIn();
      return;
    }

    if (mode === "signup") {
      void handleSignUp();
      return;
    }

    if (mode === "forgot") {
      void handlePasswordResetRequest();
      return;
    }

    void handlePasswordUpdate();
  }

  const wrapperClass = compact
    ? "rounded-2xl border border-accent/18 bg-white/72 p-4"
    : "panel rounded-3xl p-5 sm:p-7";

  const inputClass =
    "w-full rounded-xl border border-accent/24 bg-white px-4 py-3 text-sm text-foreground outline-none ring-accent/25 transition placeholder:text-muted/70 focus:border-accent/55 focus:ring-2";
  const labelClass = "text-xs font-semibold uppercase tracking-[0.12em] text-muted";
  const tabClass = (active: boolean) =>
    `inline-flex min-h-11 items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold transition ${
      active ? "bg-accent text-white shadow-sm" : "text-accent hover:bg-accent/10"
    }`;

  if (userEmail && mode !== "reset") {
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted">
            <KeyRound size={12} />
            {currentCopy.eyebrow}
          </p>
          <h2 className="mt-2 font-display text-2xl leading-tight text-foreground">
            {currentCopy.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">{currentCopy.description}</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-1 rounded-2xl border border-accent/18 bg-white/72 p-1">
        <button
          type="button"
          onClick={() => switchMode("signin")}
          className={tabClass(mode === "signin")}
          aria-pressed={mode === "signin"}
        >
          Accedi
        </button>
        <button
          type="button"
          onClick={() => switchMode("signup")}
          className={tabClass(mode === "signup")}
          aria-pressed={mode === "signup"}
        >
          Registrati
        </button>
      </div>

      {mode === "reset" && !userEmail ? (
        <p className="mt-4 rounded-xl border border-accent/16 bg-white/70 px-4 py-3 text-xs text-muted">
          Apri il link ricevuto via email per attivare la sessione di recupero.
        </p>
      ) : null}

      <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
        {mode === "signup" ? (
          <div className="grid gap-1.5">
            <label className={labelClass} htmlFor={`${formId}-name`}>
              Nome
            </label>
            <input
              id={`${formId}-name`}
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Nome visualizzato, opzionale"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className={inputClass}
            />
          </div>
        ) : null}

        {mode !== "reset" ? (
          <div className="grid gap-1.5">
            <label className={labelClass} htmlFor={`${formId}-email`}>
              Email
            </label>
            <input
              id={`${formId}-email`}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nome@email.it"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass}
              required
            />
          </div>
        ) : null}

        {mode !== "forgot" ? (
          <div className="grid gap-1.5">
            <label className={labelClass} htmlFor={`${formId}-password`}>
              {mode === "reset" ? "Nuova password" : "Password"}
            </label>
            <input
              id={`${formId}-password`}
              name="password"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              placeholder={mode === "signin" ? "Password" : "Almeno 8 caratteri"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClass}
              minLength={mode === "signin" ? undefined : 8}
              required
            />
          </div>
        ) : null}

        {mode === "reset" ? (
          <div className="grid gap-1.5">
            <label className={labelClass} htmlFor={`${formId}-password-confirm`}>
              Conferma password
            </label>
            <input
              id={`${formId}-password-confirm`}
              name="password-confirm"
              type="password"
              autoComplete="new-password"
              placeholder="Ripeti la nuova password"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              className={inputClass}
              minLength={8}
              required
            />
          </div>
        ) : null}

        {authActionRequiresCaptcha && siteKey ? (
          <div className="overflow-hidden rounded-xl border border-accent/16 bg-white p-2">
            <Turnstile
              key={captchaNonce}
              siteKey={siteKey}
              options={{ theme: "light", size: "normal" }}
              onSuccess={(token) => {
                setCaptchaToken(token);
              }}
              onExpire={() => {
                setCaptchaToken(null);
              }}
              onError={() => {
                setCaptchaToken(null);
                setMessage("Controllo anti-bot non valido. Riprova.");
              }}
            />
          </div>
        ) : null}

        {message ? (
          <p className="rounded-xl border border-accent/16 bg-white/70 px-4 py-3 text-sm text-muted">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading || (mode === "reset" && !userEmail)}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          {mode === "signup" ? <UserRoundPlus size={16} /> : null}
          {mode === "forgot" ? <MailCheck size={16} /> : null}
          {mode === "signin" ? <ArrowRight size={16} /> : null}
          {currentCopy.submit}
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        {mode === "signin" ? (
          <button
            type="button"
            onClick={() => switchMode("forgot")}
            className="font-semibold text-accent underline-offset-4 transition hover:underline"
          >
            Password dimenticata?
          </button>
        ) : (
          <button
            type="button"
            onClick={() => switchMode("signin")}
            className="font-semibold text-accent underline-offset-4 transition hover:underline"
          >
            Torna al login
          </button>
        )}

        {mode === "signup" ? (
          <span className="inline-flex items-center gap-1 text-xs text-muted">
            <MailCheck size={13} />
            Conferma via email
          </span>
        ) : null}
      </div>
    </div>
  );
}
