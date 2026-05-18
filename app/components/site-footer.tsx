import Link from "next/link";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Catalogo", href: "/library" },
  { label: "Chi siamo", href: "/chi-siamo" },
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
              <p className="font-display text-xl tracking-wide text-foreground">LILITHIANA</p>
              <p className="mt-1 text-sm text-muted">Audiolibri di autrici, ascolto con anima.</p>
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
          <p className="mt-4 text-xs uppercase tracking-[0.13em] text-muted">
            © {year} Lilithiana. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  );
}
