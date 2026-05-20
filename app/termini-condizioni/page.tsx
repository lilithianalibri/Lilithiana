import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { MainNav } from "../components/main-nav";

export const metadata: Metadata = {
  title: "Termini e Condizioni | LILITHIANA",
  description:
    "Termini e condizioni d'uso della piattaforma LILITHIANA: accesso, account, regole d'uso, proprietà intellettuale e responsabilità.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen px-6 pb-16 pt-6 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <MainNav />

        <main className="space-y-6">
          <section className="panel rounded-3xl p-6 sm:p-8">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
              <FileText size={14} />
              Termini e Condizioni
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              Condizioni d&apos;uso della piattaforma
            </h1>
            <p className="mt-4 text-sm text-muted">Ultimo aggiornamento: 20 maggio 2026</p>
          </section>

          <section className="panel rounded-3xl p-6 sm:p-8">
            <div className="space-y-6 text-sm leading-7 text-foreground/92 sm:text-base">
              <section>
                <h2 className="font-display text-2xl">1. Ambito</h2>
                <p className="mt-2">
                  Questi Termini regolano l&apos;uso del sito LILITHIANA e delle relative funzionalità
                  (catalogo, ascolto, account, dashboard, segnalibri).
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl">2. Servizio</h2>
                <p className="mt-2">
                  La piattaforma offre ascolto di contenuti audio editoriali selezionati. Alcune
                  funzioni richiedono registrazione (es. ripresa ascolto sincronizzata, segnalibri,
                  area personale).
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl">3. Account utente</h2>
                <p className="mt-2">
                  L&apos;utente è responsabile delle credenziali di accesso e dell&apos;uso del proprio
                  account. È vietato cedere l&apos;account o utilizzare identità altrui.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl">4. Regole d&apos;uso</h2>
                <p className="mt-2">
                  È vietato usare il servizio per attività illecite, tentativi di intrusione,
                  scraping aggressivo, abuso dei sistemi di autenticazione o aggiramento delle misure
                  tecniche di sicurezza.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl">5. Proprietà intellettuale</h2>
                <p className="mt-2">
                  Marchi, testi, grafica, audio e struttura del sito sono tutelati. È vietata la
                  riproduzione, distribuzione o messa a disposizione non autorizzata dei contenuti,
                  salvo i casi consentiti dalla legge o da licenze espresse.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl">6. Disponibilità e modifiche</h2>
                <p className="mt-2">
                  Il servizio può essere aggiornato, sospeso o modificato per esigenze tecniche,
                  editoriali, organizzative o normative, anche senza preavviso nei casi urgenti.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl">7. Limitazione di responsabilità</h2>
                <p className="mt-2">
                  Nei limiti di legge, il titolare non risponde per interruzioni temporanee,
                  indisponibilità dovute a terzi o danni indiretti non prevedibili derivanti
                  dall&apos;uso del servizio.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl">8. Protezione dati e cookie</h2>
                <p className="mt-2">
                  Il trattamento dei dati personali è disciplinato dalla{" "}
                  <Link href="/privacy-policy" className="font-semibold text-accent">
                    Privacy Policy
                  </Link>{" "}
                  e dalla{" "}
                  <Link href="/cookie-policy" className="font-semibold text-accent">
                    Cookie Policy
                  </Link>
                  .
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl">9. Legge applicabile e foro</h2>
                <p className="mt-2">
                  I presenti Termini sono regolati dalla legge italiana. Restano salvi i diritti del
                  consumatore previsti dalla normativa applicabile.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl">10. Contatti</h2>
                <p className="mt-2">
                  Per informazioni:{" "}
                  <a className="font-semibold text-accent" href="mailto:lilithianalibri@gmail.com">
                    lilithianalibri@gmail.com
                  </a>
                </p>
              </section>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
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
