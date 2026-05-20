import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { MainNav } from "../components/main-nav";

export const metadata: Metadata = {
  title: "Privacy Policy | LILITHIANA",
  description:
    "Informativa privacy di LILITHIANA ai sensi del GDPR: dati trattati, finalità, basi giuridiche, conservazione e diritti degli interessati.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen px-6 pb-16 pt-6 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <MainNav />

        <main className="space-y-6">
          <section className="panel rounded-3xl p-6 sm:p-8">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
              <ShieldCheck size={14} />
              Privacy Policy
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              Informativa sul trattamento dei dati personali
            </h1>
            <p className="mt-4 text-sm text-muted">Ultimo aggiornamento: 20 maggio 2026</p>
          </section>

          <section className="panel rounded-3xl p-6 sm:p-8">
            <div className="space-y-6 text-sm leading-7 text-foreground/92 sm:text-base">
              <section>
                <h2 className="font-display text-2xl">1. Titolare del trattamento</h2>
                <p className="mt-2">
                  Titolare: Stefania De Biase (progetto LILITHIANA).
                  <br />
                  Contatto privacy:{" "}
                  <a className="font-semibold text-accent" href="mailto:lilithianalibri@gmail.com">
                    lilithianalibri@gmail.com
                  </a>
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl">2. Dati trattati</h2>
                <p className="mt-2">
                  Trattiamo i dati necessari a erogare la piattaforma: email e credenziali di
                  accesso (gestite tramite Supabase Auth), metadati profilo inseriti
                  volontariamente, dati di utilizzo funzionali all&apos;ascolto (progresso,
                  capitolo, segnalibri), dati tecnici di sessione e sicurezza (log essenziali,
                  protezione anti-bot in registrazione).
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl">3. Finalità e basi giuridiche</h2>
                <p className="mt-2">
                  I dati sono trattati per:
                  <br />- erogare account, login, dashboard, player e segnalibri (art. 6.1.b
                  GDPR: esecuzione del servizio);
                  <br />- adempiere obblighi normativi e richieste delle autorità (art. 6.1.c
                  GDPR);
                  <br />- prevenire abusi e proteggere la piattaforma (art. 6.1.f GDPR: legittimo
                  interesse del titolare);
                  <br />- eventuali funzioni opzionali di tracciamento/profilazione, solo se
                  attivate e accettate dall&apos;utente (art. 6.1.a GDPR: consenso).
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl">4. Profilazione</h2>
                <p className="mt-2">
                  Alla data di questo aggiornamento non utilizziamo profilazione commerciale né
                  advertising comportamentale. Le preferenze cookie sono comunque gestibili in ogni
                  momento dall&apos;utente.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl">5. Natura del conferimento</h2>
                <p className="mt-2">
                  Il conferimento dei dati necessari all&apos;account è facoltativo, ma senza tali dati
                  non è possibile usare funzioni riservate (login, dashboard, segnalibri,
                  sincronizzazione progresso).
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl">6. Destinatari e responsabili</h2>
                <p className="mt-2">
                  I dati possono essere trattati da fornitori tecnici che operano quali responsabili
                  del trattamento (es. infrastruttura applicativa, autenticazione, hosting, sistemi
                  anti-abuso/CAPTCHA), nei limiti necessari all&apos;erogazione del servizio.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl">7. Conservazione</h2>
                <p className="mt-2">
                  Conserviamo i dati personali per il tempo necessario alle finalità indicate:
                  <br />- dati account: fino alla cancellazione dell&apos;account, salvo obblighi di
                  legge;
                  <br />- dati funzionali di ascolto/segnalibri: finché l&apos;account resta attivo o
                  fino a richiesta di cancellazione;
                  <br />- log e dati di sicurezza: per periodi proporzionati alla prevenzione abusi
                  e alla tutela della piattaforma.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl">8. Diritti dell&apos;interessato</h2>
                <p className="mt-2">
                  Puoi esercitare i diritti previsti dagli artt. 15-22 GDPR (accesso, rettifica,
                  cancellazione, limitazione, opposizione, portabilità, revoca del consenso) scrivendo
                  a{" "}
                  <a className="font-semibold text-accent" href="mailto:lilithianalibri@gmail.com">
                    lilithianalibri@gmail.com
                  </a>
                  . Resta fermo il diritto di proporre reclamo al Garante per la protezione dei dati
                  personali.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl">9. Modifiche</h2>
                <p className="mt-2">
                  Questa informativa può essere aggiornata per evoluzioni normative o tecniche del
                  servizio. Le versioni aggiornate sono pubblicate su questa pagina.
                </p>
              </section>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/cookie-policy"
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Vai alla Cookie Policy
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
