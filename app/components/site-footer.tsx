import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Progetto", href: "/progetto" },
  { label: "Catalogo", href: "/library" },
  { label: "Chi siamo", href: "/chi-siamo" },
  { label: "Contatti", href: "/contatti" },
  { label: "Accedi", href: "/accedi" },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-6 mt-10 pb-8 sm:mx-10 lg:mx-16">
      <div className="mx-auto max-w-6xl">
        <div className="panel rounded-3xl px-6 py-5 sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Image
                src="/lilithiana-logo-transparent.png"
                alt="Lilithiana"
                width={1572}
                height={715}
                className="h-9 w-auto sm:h-10"
              />
            </div>

            <nav className="flex flex-wrap items-center gap-2 text-sm">
              {footerLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-accent/14 bg-white/62 px-3.5 py-1.5 font-medium transition hover:bg-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="gold-line mt-4 h-px w-full" />
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent/14 bg-white/58 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              Partner ufficiali
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Image
                src="/partners/amleta-logo.png"
                alt="Amleta"
                width={564}
                height={140}
                className="h-7 w-auto"
              />
              <Image
                src="/lilith.png"
                alt="Lilith"
                width={118}
                height={73}
                className="h-7 w-auto"
              />
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-accent/14 bg-white/58 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              Crediti
            </p>
            <div className="mt-2 space-y-1.5 text-sm text-foreground/90">
              <p>
                <span className="font-semibold">Organizzazione e coordinamento:</span>{" "}
                Stefania De biase
              </p>
              <p>
                <span className="font-semibold">Design:</span> Fiamma Spinelli
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">
                  Le attrici fanno parte dell&apos;associazione Amleta
                </span>
                <Image
                  src="/partners/amleta-logo.png"
                  alt="Amleta"
                  width={564}
                  height={140}
                  className="h-5 w-auto"
                />
              </div>
              <p>
                <span className="font-semibold">Relazioni esterne:</span> Paola
                D&apos;Arcangelo
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs uppercase tracking-[0.13em] text-muted">
            &copy; {year} Lilithiana. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  );
}

