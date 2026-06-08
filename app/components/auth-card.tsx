"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import {
  ArrowRight,
  Eye,
  EyeOff,
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

const defaultTurnstileSiteKey = "0x4AAAAAADbeDWAmRJrx24Lm";
const confirmationEmailCooldownMs = 15 * 60 * 1000;
const confirmationEmailCooldownStorageKey =
  "lilithiana:auth-confirmation-email-cooldowns";

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
    description:
      "Dopo l'invio riceverai una mail: confermala, poi accedi con email e password scelte qui.",
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

function normalizeEmailAddress(value: string) {
  return value.trim().toLowerCase();
}

function readConfirmationCooldowns() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const rawValue = window.localStorage.getItem(confirmationEmailCooldownStorageKey);
    const parsedValue = rawValue ? JSON.parse(rawValue) : {};

    if (!parsedValue || typeof parsedValue !== "object") {
      return {};
    }

    return parsedValue as Record<string, number>;
  } catch {
    return {};
  }
}

function writeConfirmationCooldowns(cooldowns: Record<string, number>) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    confirmationEmailCooldownStorageKey,
    JSON.stringify(cooldowns),
  );
}

function getConfirmationCooldownUntil(email: string) {
  const normalizedEmail = normalizeEmailAddress(email);

  if (!normalizedEmail || typeof window === "undefined") {
    return null;
  }

  const cooldowns = readConfirmationCooldowns();
  const cooldownUntil = cooldowns[normalizedEmail];

  if (!Number.isFinite(cooldownUntil)) {
    return null;
  }

  if (cooldownUntil <= Date.now()) {
    delete cooldowns[normalizedEmail];
    writeConfirmationCooldowns(cooldowns);
    return null;
  }

  return cooldownUntil;
}

function recordConfirmationCooldown(email: string) {
  const normalizedEmail = normalizeEmailAddress(email);

  if (!normalizedEmail || typeof window === "undefined") {
    return null;
  }

  const cooldownUntil = Date.now() + confirmationEmailCooldownMs;
  writeConfirmationCooldowns({
    ...readConfirmationCooldowns(),
    [normalizedEmail]: cooldownUntil,
  });

  return cooldownUntil;
}

function formatCooldownRemaining(cooldownUntil: number) {
  const remainingSeconds = Math.max(1, Math.ceil((cooldownUntil - Date.now()) / 1000));

  if (remainingSeconds < 60) {
    return "meno di un minuto";
  }

  const remainingMinutes = Math.ceil(remainingSeconds / 60);
  return `${remainingMinutes} minuti`;
}

function getConfirmationCooldownMessage(cooldownUntil: number) {
  return `Abbiamo già inviato una mail di conferma. Riprova tra ${formatCooldownRemaining(
    cooldownUntil,
  )}.`;
}

type AuthErrorDetails = {
  code?: string;
  message?: string;
  status?: number;
};

type EmailCheckResult = {
  ok: boolean;
  message?: string;
};

function getAuthErrorDetails(error: unknown): AuthErrorDetails {
  if (!error || typeof error !== "object") {
    return {};
  }

  const details = error as AuthErrorDetails;
  return {
    code: typeof details.code === "string" ? details.code : undefined,
    message: typeof details.message === "string" ? details.message : undefined,
    status: typeof details.status === "number" ? details.status : undefined,
  };
}

function formatAuthError(error: unknown) {
  const { code, message = "", status } = getAuthErrorDetails(error);
  const normalizedCode = code?.toLowerCase();
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedCode === "over_email_send_rate_limit" ||
    normalizedMessage.includes("email rate limit")
  ) {
    return {
      message:
        "Abbiamo già inviato una mail da poco. Aspetta qualche minuto e controlla anche Spam o Posta indesiderata prima di riprovare.",
      canResendConfirmation: false,
    };
  }

  if (
    normalizedCode === "over_request_rate_limit" ||
    status === 429 ||
    normalizedMessage.includes("rate limit") ||
    normalizedMessage.includes("too many")
  ) {
    return {
      message: "Troppi tentativi ravvicinati. Aspetta qualche minuto e riprova.",
      canResendConfirmation: false,
    };
  }

  if (
    normalizedCode === "email_address_invalid" ||
    normalizedMessage.includes("email address is invalid") ||
    normalizedMessage.includes("invalid email")
  ) {
    return {
      message:
        "Controlla l'indirizzo email: deve essere completo e senza spazi prima o dopo.",
      canResendConfirmation: false,
    };
  }

  if (
    normalizedCode === "email_not_confirmed" ||
    normalizedMessage.includes("email not confirmed")
  ) {
    return {
      message:
        "L'account non è ancora confermato. Controlla la mail di conferma, anche in Spam o Posta indesiderata.",
      canResendConfirmation: true,
    };
  }

  if (
    normalizedCode === "email_exists" ||
    normalizedCode === "user_already_exists" ||
    normalizedMessage.includes("already registered") ||
    normalizedMessage.includes("already exists")
  ) {
    return {
      message:
        "Questo indirizzo risulta già registrato. Se non hai confermato la mail, puoi chiedere un nuovo link di conferma.",
      canResendConfirmation: true,
    };
  }

  if (normalizedCode === "captcha_failed" || normalizedMessage.includes("captcha")) {
    return {
      message: "Controllo anti-bot non valido. Riprova.",
      canResendConfirmation: false,
    };
  }

  if (normalizedCode === "weak_password") {
    return {
      message: "Scegli una password più robusta, con almeno 8 caratteri.",
      canResendConfirmation: false,
    };
  }

  if (normalizedCode === "invalid_credentials") {
    return {
      message:
        "Email o password non corretti. Se hai appena creato l'account, conferma prima la mail ricevuta.",
      canResendConfirmation: false,
    };
  }

  return {
    message:
      message ||
      "Non siamo riuscite a completare l'operazione. Riprova tra poco o scrivici se il problema continua.",
    canResendConfirmation: false,
  };
}

async function checkEmailDeliverability(email: string): Promise<EmailCheckResult> {
  try {
    const response = await fetch("/api/auth/email-check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const result = (await response.json()) as EmailCheckResult;

    if (response.ok && result.ok) {
      return { ok: true };
    }

    return {
      ok: false,
      message:
        result.message ??
        "Controlla l'indirizzo email: non sembra poter ricevere la conferma.",
    };
  } catch {
    return {
      ok: false,
      message:
        "Non siamo riuscite a controllare l'email. Riprova tra poco prima di inviare la conferma.",
    };
  }
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
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaNonce, setCaptchaNonce] = useState(0);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userCreatedAt, setUserCreatedAt] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [confirmationHelpEmail, setConfirmationHelpEmail] = useState<string | null>(null);
  const [confirmationCooldownUntil, setConfirmationCooldownUntil] = useState<number | null>(null);
  const [isConfirmationEmailCoolingDown, setIsConfirmationEmailCoolingDown] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || defaultTurnstileSiteKey;
  const authRedirect = sanitizeRedirect(redirectTo);
  const authActionRequiresCaptcha = Boolean(siteKey) && mode !== "reset";
  const currentCopy = authCopy[mode];

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setPassword("");
    setPasswordConfirm("");
    setShowPassword(false);
    setShowPasswordConfirm(false);
    setMessage(null);
    setConfirmationHelpEmail(null);
    setConfirmationCooldownUntil(null);
    setIsConfirmationEmailCoolingDown(false);
    setCaptchaToken(null);
    setCaptchaNonce((current) => current + 1);
  }

  function resetCaptcha() {
    setCaptchaToken(null);
    setCaptchaNonce((current) => current + 1);
  }

  function handleCaptchaError(errorCode?: string) {
    setCaptchaToken(null);
    setConfirmationHelpEmail(null);

    if (errorCode === "110200") {
      setMessage(
        "Turnstile non autorizzato per questo dominio. Aggiungi il dominio in Cloudflare.",
      );
      return;
    }

    setMessage("Controllo anti-bot non valido. Riprova.");
  }

  function buildConfirmationRedirectTo() {
    if (typeof window === "undefined") {
      return undefined;
    }

    return `${window.location.origin}/auth/callback?next=${encodeURIComponent(
      "/accedi?mode=signin&confirmed=1",
    )}`;
  }

  function applyConfirmationCooldown(cooldownUntil: number | null) {
    setConfirmationCooldownUntil(cooldownUntil);
    setIsConfirmationEmailCoolingDown(Boolean(cooldownUntil));
  }

  function syncConfirmationCooldownForEmail(targetEmail: string) {
    const cooldownUntil = getConfirmationCooldownUntil(targetEmail);
    applyConfirmationCooldown(cooldownUntil);
    return cooldownUntil;
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

  useEffect(() => {
    if (!confirmationCooldownUntil) {
      return;
    }

    const remainingMs = Math.max(0, confirmationCooldownUntil - Date.now());

    const timeoutId = window.setTimeout(() => {
      setConfirmationCooldownUntil(null);
      setIsConfirmationEmailCoolingDown(false);
    }, remainingMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [confirmationCooldownUntil]);

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

    const normalizedEmail = normalizeEmailAddress(email);

    if (!normalizedEmail || !password) {
      setMessage("Inserisci email e password.");
      return;
    }

    if (authActionRequiresCaptcha && !captchaToken) {
      setMessage("Completa il controllo anti-bot per procedere.");
      return;
    }

    setLoading(true);
    setMessage(null);
    setConfirmationHelpEmail(null);
    setEmail(normalizedEmail);

    const { error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
      options: {
        captchaToken: captchaToken ?? undefined,
      },
    });

    setLoading(false);
    resetCaptcha();

    if (error) {
      const authError = formatAuthError(error);
      setMessage(authError.message);
      if (authError.canResendConfirmation) {
        setConfirmationHelpEmail(normalizedEmail);
        syncConfirmationCooldownForEmail(normalizedEmail);
      } else {
        setConfirmationHelpEmail(null);
      }
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

    const normalizedEmail = normalizeEmailAddress(email);
    const normalizedDisplayName = displayName.trim();

    if (!normalizedEmail || !password) {
      setMessage("Inserisci email e password.");
      return;
    }

    if (password.length < 8) {
      setMessage("La password deve avere almeno 8 caratteri.");
      return;
    }

    const existingCooldownUntil = getConfirmationCooldownUntil(normalizedEmail);
    if (existingCooldownUntil) {
      setEmail(normalizedEmail);
      applyConfirmationCooldown(existingCooldownUntil);
      setMessage(getConfirmationCooldownMessage(existingCooldownUntil));
      return;
    }

    if (authActionRequiresCaptcha && !captchaToken) {
      setMessage("Completa il controllo anti-bot per procedere con la registrazione.");
      return;
    }

    setLoading(true);
    setMessage(null);
    setConfirmationHelpEmail(null);
    setEmail(normalizedEmail);

    const emailCheck = await checkEmailDeliverability(normalizedEmail);

    if (!emailCheck.ok) {
      setLoading(false);
      setMessage(emailCheck.message ?? "Controlla l'indirizzo email e riprova.");
      return;
    }

    const emailRedirectTo = buildConfirmationRedirectTo();

    const { error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        emailRedirectTo,
        captchaToken: captchaToken ?? undefined,
        data: normalizedDisplayName ? { display_name: normalizedDisplayName } : undefined,
      },
    });

    setLoading(false);
    resetCaptcha();

    if (error) {
      const authError = formatAuthError(error);
      setMessage(authError.message);
      if (authError.canResendConfirmation) {
        setConfirmationHelpEmail(normalizedEmail);
        syncConfirmationCooldownForEmail(normalizedEmail);
      } else {
        setConfirmationHelpEmail(null);
      }
      return;
    }

    const cooldownUntil = recordConfirmationCooldown(normalizedEmail);
    applyConfirmationCooldown(cooldownUntil);
    setMessage(
      "Registrazione inviata. Controlla la mail, anche in Spam o Posta indesiderata. Potrai richiedere un'altra conferma tra 15 minuti.",
    );
  }

  async function handlePasswordResetRequest() {
    if (!supabase) {
      return;
    }

    const normalizedEmail = normalizeEmailAddress(email);

    if (!normalizedEmail) {
      setMessage("Inserisci l'email del tuo account.");
      return;
    }

    if (authActionRequiresCaptcha && !captchaToken) {
      setMessage("Completa il controllo anti-bot per procedere.");
      return;
    }

    setLoading(true);
    setMessage(null);
    setConfirmationHelpEmail(null);
    setEmail(normalizedEmail);

    const emailCheck = await checkEmailDeliverability(normalizedEmail);

    if (!emailCheck.ok) {
      setLoading(false);
      setMessage(emailCheck.message ?? "Controlla l'indirizzo email e riprova.");
      return;
    }

    const resetRedirect =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback?next=${encodeURIComponent("/accedi?mode=reset")}`
        : undefined;

    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: resetRedirect,
      captchaToken: captchaToken ?? undefined,
    });

    setLoading(false);
    resetCaptcha();

    if (error) {
      const authError = formatAuthError(error);
      setMessage(authError.message);
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
    setConfirmationHelpEmail(null);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      const authError = formatAuthError(error);
      setMessage(authError.message);
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
    setConfirmationHelpEmail(null);
    const { error } = await supabase.auth.signOut();
    setLoading(false);

    if (error) {
      const authError = formatAuthError(error);
      setMessage(authError.message);
      return;
    }

    setMessage("Sessione chiusa.");
    router.refresh();
  }

  async function handleResendConfirmation() {
    if (!supabase) {
      return;
    }

    const normalizedEmail = normalizeEmailAddress(confirmationHelpEmail ?? email);

    if (!normalizedEmail) {
      setMessage("Inserisci l'email del tuo account.");
      return;
    }

    const existingCooldownUntil = getConfirmationCooldownUntil(normalizedEmail);
    if (existingCooldownUntil) {
      setEmail(normalizedEmail);
      applyConfirmationCooldown(existingCooldownUntil);
      setMessage(getConfirmationCooldownMessage(existingCooldownUntil));
      return;
    }

    if (authActionRequiresCaptcha && !captchaToken) {
      setMessage("Completa il controllo anti-bot per reinviare la conferma.");
      return;
    }

    setLoading(true);
    setMessage(null);
    setEmail(normalizedEmail);

    const emailCheck = await checkEmailDeliverability(normalizedEmail);

    if (!emailCheck.ok) {
      setLoading(false);
      setMessage(emailCheck.message ?? "Controlla l'indirizzo email e riprova.");
      return;
    }

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: normalizedEmail,
      options: {
        emailRedirectTo: buildConfirmationRedirectTo(),
        captchaToken: captchaToken ?? undefined,
      },
    });

    setLoading(false);
    resetCaptcha();

    if (error) {
      const authError = formatAuthError(error);
      setMessage(authError.message);
      if (authError.canResendConfirmation) {
        setConfirmationHelpEmail(normalizedEmail);
        syncConfirmationCooldownForEmail(normalizedEmail);
      } else {
        setConfirmationHelpEmail(null);
      }
      return;
    }

    setConfirmationHelpEmail(null);
    const cooldownUntil = recordConfirmationCooldown(normalizedEmail);
    applyConfirmationCooldown(cooldownUntil);
    setMessage(
      "Ti abbiamo inviato di nuovo la mail di conferma. Controlla anche Spam o Posta indesiderata. Potrai richiederne un'altra tra 15 minuti.",
    );
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
  const passwordInputClass =
    "w-full rounded-xl border border-accent/24 bg-white py-3 pl-4 pr-12 text-sm text-foreground outline-none ring-accent/25 transition placeholder:text-muted/70 focus:border-accent/55 focus:ring-2";
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
              onChange={(event) => {
                const nextEmail = event.target.value;
                setEmail(nextEmail);
                syncConfirmationCooldownForEmail(nextEmail);
              }}
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
            <div className="relative">
              <input
                id={`${formId}-password`}
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                placeholder={mode === "signin" ? "Password" : "Almeno 8 caratteri"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={passwordInputClass}
                minLength={mode === "signin" ? undefined : 8}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-accent transition hover:bg-accent/10"
                aria-label={showPassword ? "Nascondi password" : "Mostra password"}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>
        ) : null}

        {mode === "reset" ? (
          <div className="grid gap-1.5">
            <label className={labelClass} htmlFor={`${formId}-password-confirm`}>
              Conferma password
            </label>
            <div className="relative">
              <input
                id={`${formId}-password-confirm`}
                name="password-confirm"
                type={showPasswordConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Ripeti la nuova password"
                value={passwordConfirm}
                onChange={(event) => setPasswordConfirm(event.target.value)}
                className={passwordInputClass}
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm((current) => !current)}
                className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-accent transition hover:bg-accent/10"
                aria-label={
                  showPasswordConfirm
                    ? "Nascondi conferma password"
                    : "Mostra conferma password"
                }
                aria-pressed={showPasswordConfirm}
              >
                {showPasswordConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
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
              onError={handleCaptchaError}
            />
          </div>
        ) : null}

        {message ? (
          <p
            className="rounded-xl border border-accent/16 bg-white/70 px-4 py-3 text-sm text-muted"
            aria-live="polite"
          >
            {message}
          </p>
        ) : null}

        {confirmationHelpEmail ? (
          <button
            type="button"
            onClick={handleResendConfirmation}
            disabled={loading || isConfirmationEmailCoolingDown}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-accent/25 bg-white px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <MailCheck size={15} />
            Reinvia mail di conferma
          </button>
        ) : null}

        <button
          type="submit"
          disabled={
            loading ||
            (mode === "reset" && !userEmail) ||
            (mode === "signup" && isConfirmationEmailCoolingDown)
          }
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
