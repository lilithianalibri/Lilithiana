"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, Cookie, Settings2, ShieldCheck, X } from "lucide-react";
import {
  COOKIE_CONSENT_VERSION,
  type CookieConsentState,
  createAllAcceptedPreferences,
  createConsentState,
  createNecessaryOnlyPreferences,
  persistConsent,
  readConsentFromStorage,
} from "../lib/cookie-consent";

const openPreferencesEvent = "lilithiana:open-cookie-preferences";

export function requestOpenCookiePreferences() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(openPreferencesEvent));
}

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [consent, setConsent] = useState<CookieConsentState | null>(null);
  const [functional, setFunctional] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [profiling, setProfiling] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const storedConsent = readConsentFromStorage();

      if (storedConsent && storedConsent.version === COOKIE_CONSENT_VERSION) {
        setConsent(storedConsent);
        setFunctional(storedConsent.preferences.functional);
        setAnalytics(storedConsent.preferences.analytics);
        setProfiling(storedConsent.preferences.profiling);
      } else {
        setIsVisible(true);
      }
    });

    function openPreferences() {
      const storedConsent = readConsentFromStorage();

      if (storedConsent) {
        setFunctional(storedConsent.preferences.functional);
        setAnalytics(storedConsent.preferences.analytics);
        setProfiling(storedConsent.preferences.profiling);
      }

      setIsVisible(true);
      setShowPreferences(true);
    }

    window.addEventListener(openPreferencesEvent, openPreferences);
    return () => {
      window.removeEventListener(openPreferencesEvent, openPreferences);
    };
  }, []);

  const statusLabel = useMemo(() => {
    if (!consent) {
      return "Preferenze non impostate";
    }

    if (consent.preferences.profiling || consent.preferences.analytics) {
      return "Consenso esteso attivo";
    }

    if (consent.preferences.functional) {
      return "Consenso parziale attivo";
    }

    return "Solo cookie necessari";
  }, [consent]);

  function applyConsent(nextConsent: CookieConsentState) {
    persistConsent(nextConsent);
    setConsent(nextConsent);
    setIsVisible(false);
    setShowPreferences(false);
  }

  function acceptAll() {
    applyConsent(createConsentState("accept_all", createAllAcceptedPreferences()));
  }

  function rejectOptional() {
    applyConsent(createConsentState("reject_optional", createNecessaryOnlyPreferences()));
  }

  function saveCustomPreferences() {
    applyConsent(
      createConsentState("custom", {
        necessary: true,
        functional,
        analytics,
        profiling,
      }),
    );
  }

  return (
    <>
      {isVisible ? (
        <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-4xl">
          <section className="panel rounded-3xl border border-accent/25 bg-white/95 p-4 shadow-[0_18px_40px_rgba(25,15,20,0.22)] sm:p-5">
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <Cookie size={18} />
                </div>
                <div className="min-w-0">
                  <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                    <BookOpen size={14} />
                    Consenso Cookie
                  </p>
                  <p className="mt-1 text-sm text-foreground/90">
                    Usiamo cookie tecnici per login, sicurezza e salvataggio progressi.
                    Eventuali cookie opzionali (funzionali, analytics, profilazione) sono
                    disattivati finché non li autorizzi.
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    Leggi{" "}
                    <Link href="/cookie-policy" className="font-semibold text-accent underline">
                      Cookie Policy
                    </Link>{" "}
                    e{" "}
                    <Link href="/privacy-policy" className="font-semibold text-accent underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
                <button
                  type="button"
                  onClick={rejectOptional}
                  className="inline-flex shrink-0 items-center justify-center rounded-full border border-accent/20 bg-white p-2 text-accent transition hover:bg-white"
                  aria-label="Chiudi banner e mantieni solo cookie necessari"
                  title="Mantieni solo cookie necessari"
                >
                  <X size={14} />
                </button>
              </div>

              {showPreferences ? (
                <div className="rounded-2xl border border-accent/16 bg-white/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                    Preferenze categorie
                  </p>
                  <div className="mt-3 space-y-2">
                    <label className="flex items-center justify-between gap-3 text-sm">
                      <span>
                        Cookie necessari
                        <span className="ml-2 text-xs text-muted">(sempre attivi)</span>
                      </span>
                      <input type="checkbox" checked disabled aria-label="Cookie necessari sempre attivi" />
                    </label>
                    <label className="flex items-center justify-between gap-3 text-sm">
                      <span>Cookie funzionali</span>
                      <input
                        type="checkbox"
                        checked={functional}
                        onChange={(event) => setFunctional(event.target.checked)}
                        aria-label="Abilita cookie funzionali"
                      />
                    </label>
                    <label className="flex items-center justify-between gap-3 text-sm">
                      <span>Cookie analytics</span>
                      <input
                        type="checkbox"
                        checked={analytics}
                        onChange={(event) => setAnalytics(event.target.checked)}
                        aria-label="Abilita cookie analytics"
                      />
                    </label>
                    <label className="flex items-center justify-between gap-3 text-sm">
                      <span>Cookie di profilazione</span>
                      <input
                        type="checkbox"
                        checked={profiling}
                        onChange={(event) => setProfiling(event.target.checked)}
                        aria-label="Abilita cookie di profilazione"
                      />
                    </label>
                  </div>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={acceptAll}
                  className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  Accetta tutto
                </button>
                <button
                  type="button"
                  onClick={rejectOptional}
                  className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  Rifiuta non necessari
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreferences((current) => !current)}
                  className="inline-flex items-center gap-2 rounded-full border border-accent/22 bg-white px-4 py-2 text-sm font-semibold text-accent transition hover:bg-white"
                >
                  <Settings2 size={14} />
                  {showPreferences ? "Chiudi preferenze" : "Personalizza"}
                </button>
                {showPreferences ? (
                  <button
                    type="button"
                    onClick={saveCustomPreferences}
                    className="rounded-full border border-accent/22 bg-white px-4 py-2 text-sm font-semibold text-accent transition hover:bg-white"
                  >
                    Salva preferenze
                  </button>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => requestOpenCookiePreferences()}
        className="fixed bottom-4 left-4 z-40 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-white/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-accent shadow-[0_10px_26px_rgba(20,12,16,0.2)] transition hover:bg-white"
        aria-label="Apri preferenze cookie"
      >
        <ShieldCheck size={14} />
        {statusLabel}
      </button>
    </>
  );
}
