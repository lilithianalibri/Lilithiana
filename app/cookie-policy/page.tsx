import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen, Cookie } from "lucide-react";
import { CookiePreferencesTrigger } from "../components/cookie-preferences-trigger";
import { MainNav } from "../components/main-nav";

export const metadata: Metadata = {
  title: "Cookie Policy | LILITHIANA",
  description:
    "Cookie Policy di LILITHIANA: categorie cookie, finalità, gestione consenso e diritti utenti ai sensi GDPR/ePrivacy.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen px-6 pb-16 pt-6 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <MainNav />

        <main className="space-y-6">
          <section className="panel rounded-3xl p-6 sm:p-8">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
              <Cookie size={14} />
              Cookie Policy
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              Informativa cookie e strumenti di tracciamento
            </h1>
            <p className="mt-4 text-sm text-muted">Ultimo aggiornamento: 20 giugno 2026</p>
          </section>

          <section className="panel rounded-3xl p-6 sm:p-8">
            <div className="space-y-6 text-sm leading-7 text-foreground/92 sm:text-base">
              <section>
                <h2 className="font-display text-2xl">1. Cosa sono i cookie</h2>
                <p className="mt-2">
                  I cookie sono stringhe di testo che il sito salva sul dispositivo dell’utente per
                  finalità tecniche o, quando previsto, per finalità ulteriori (analytics,
                  profilazione, personalizzazione avanzata).
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl">2. Categorie usate su LILITHIANA</h2>
                <p className="mt-2">
                  Usiamo principalmente cookie tecnici necessari al funzionamento del servizio.
                </p>
                <p className="mt-2 text-xs text-muted">
                  Esempi tecnici in uso: cookie di sessione Supabase (pattern
                  <code> sb-*-auth-token</code>) e cookie preferenza consenso
                  <code> lilithiana_cookie_consent</code>.
                </p>
                <div className="mt-3 overflow-x-auto rounded-2xl border border-accent/16 bg-white/70">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-accent/14">
                        <th className="px-4 py-3 font-semibold">Categoria</th>
                        <th className="px-4 py-3 font-semibold">Finalità</th>
                        <th className="px-4 py-3 font-semibold">Base giuridica</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-accent/10">
                        <td className="px-4 py-3">Tecnici necessari</td>
                        <td className="px-4 py-3">
                          Sessione autenticata, sicurezza login, persistenza funzionale account.
                        </td>
                        <td className="px-4 py-3">Erogazione servizio (art. 6.1.b GDPR)</td>
                      </tr>
                      <tr className="border-b border-accent/10">
                        <td className="px-4 py-3">Preferenza consenso cookie</td>
                        <td className="px-4 py-3">
                          Memorizza le scelte privacy dell’utente.
                        </td>
                        <td className="px-4 py-3">Obbligo informativo e accountability</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">Opzionali (funzionali/analytics/profilazione)</td>
                        <td className="px-4 py-3">
                          Attivabili solo su consenso esplicito; per default restano disattivati.
                        </td>
                        <td className="px-4 py-3">Consenso (art. 6.1.a GDPR)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="font-display text-2xl">3. Tracciamento e profilazione</h2>
                <p className="mt-2">
                  Alla data attuale non utilizziamo cookie di profilazione commerciale attivi per
                  default. Qualsiasi tracciamento non necessario rimane bloccato fino al consenso.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl">4. Terze parti</h2>
                <p className="mt-2">
                  Alcune funzioni tecniche possono coinvolgere fornitori terzi strettamente legati
                  al servizio (ad esempio autenticazione, sicurezza anti-bot, infrastruttura). I
                  relativi trattamenti avvengono secondo i loro ruoli contrattuali e le rispettive
                  misure di protezione dati.
                </p>
                <p className="mt-2">
                  I link a Facebook e Instagram sono semplici collegamenti esterni e non installano
                  cookie Meta su LILITHIANA. Aprendo tali piattaforme, eventuali cookie o strumenti
                  di tracciamento sono gestiti da Meta secondo la sua{" "}
                  <a
                    className="font-semibold text-accent"
                    href="https://www.facebook.com/policies/cookies/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cookie Policy
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl">5. Come gestire il consenso</h2>
                <p className="mt-2">
                  Puoi accettare, rifiutare i cookie non necessari o personalizzare le categorie dal
                  banner cookie. Puoi modificare le scelte in qualsiasi momento.
                </p>
                <div className="mt-3">
                  <CookiePreferencesTrigger />
                </div>
              </section>

              <section>
                <h2 className="font-display text-2xl">6. Browser e revoca</h2>
                <p className="mt-2">
                  Puoi inoltre eliminare o bloccare i cookie dalle impostazioni del browser. Questa
                  scelta può limitare alcune funzioni di accesso o personalizzazione del sito.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl">7. Riferimenti normativi</h2>
                <p className="mt-2">
                  La policy è redatta in coerenza con GDPR (Reg. UE 2016/679), Codice Privacy
                  italiano e Linee guida del Garante sui cookie e altri strumenti di tracciamento
                  (10 giugno 2021).
                </p>
              </section>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/privacy-policy"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                <BookOpen size={14} />
                Vai alla Privacy Policy
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
