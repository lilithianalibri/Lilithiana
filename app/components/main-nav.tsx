import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { NavAuthActions } from "./nav-auth-actions";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Progetto", href: "/progetto" },
  { label: "Catalogo", href: "/library" },
  { label: "Chi siamo", href: "/chi-siamo" },
  { label: "Contatti", href: "/contatti" },
];

type MainNavProps = {
  searchQuery?: string;
};

export function MainNav({ searchQuery = "" }: MainNavProps) {
  return (
    <header className="panel mb-10 rounded-3xl p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-3">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="shrink-0" aria-label="Vai alla home di Lilithiana">
            <Image
              src="/lilithiana-logo-transparent.png"
              alt="Lilithiana"
              width={1572}
              height={715}
              preload
              className="h-10 w-auto sm:h-12 lg:h-14"
            />
          </Link>
        </div>

        <nav className="flex min-w-0 flex-nowrap items-center gap-2 overflow-x-auto px-1 py-1 text-sm whitespace-nowrap lg:flex-1 lg:overflow-x-visible [&::-webkit-scrollbar]:hidden">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full border border-accent/16 bg-white/55 px-3.5 py-2 font-medium transition hover:bg-white hover:shadow-[0_8px_22px_rgba(33,25,29,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center lg:ml-auto">
          <form action="/library" method="get" className="relative sm:w-[300px] xl:w-[340px]">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-accent/80"
            />
            <input
              type="search"
              name="q"
              defaultValue={searchQuery}
              placeholder="Cerca titolo, autrice o categoria"
              className="w-full rounded-full border border-accent/24 bg-white/72 py-2.5 pl-11 pr-16 text-sm outline-none ring-accent/25 transition placeholder:text-muted focus:ring-2"
            />
            <button
              type="submit"
              aria-label="Cerca in libreria"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-accent/16 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-accent transition hover:bg-white"
            >
              Cerca
            </button>
          </form>

          <NavAuthActions />
        </div>
      </div>
    </header>
  );
}
