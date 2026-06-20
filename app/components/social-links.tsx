const socialAccounts = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/lilithianalibri/",
    Icon: FacebookMark,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/lilithiana_libri/",
    Icon: InstagramMark,
  },
] as const;

type SocialLinksProps = {
  variant?: "footer" | "contact";
};

function InstagramMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.9"
    >
      <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="4.2" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.8" cy="7.2" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="currentColor"
    >
      <path d="M14.25 8.1c0-.95.44-1.48 1.55-1.48h1.7V3.5c-.82-.11-1.64-.17-2.47-.17-2.52 0-4.25 1.54-4.25 4.38v2.43H7.92v3.5h2.86v7.03h3.47v-7.03h2.88l.46-3.5h-3.34V8.1Z" />
    </svg>
  );
}

export function SocialLinks({ variant = "footer" }: SocialLinksProps) {
  const isContact = variant === "contact";

  return (
    <div
      className={
        isContact
          ? "grid gap-3 sm:grid-cols-2"
          : "flex flex-wrap items-center gap-2"
      }
    >
      {socialAccounts.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Apri ${label} LILITHIANA`}
          className={
            isContact
              ? "group flex min-h-24 items-center gap-4 rounded-2xl border border-accent/16 bg-white/66 px-4 py-4 text-accent transition hover:bg-white hover:shadow-[0_14px_30px_rgba(33,25,29,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
              : "inline-flex h-10 w-10 items-center justify-center rounded-full border border-accent/18 bg-white/66 text-accent transition hover:bg-white hover:shadow-[0_10px_22px_rgba(33,25,29,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
          }
          title={label}
        >
          <span
            className={
              isContact
                ? "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-white transition group-hover:brightness-110"
                : "inline-flex"
            }
          >
            <Icon className={isContact ? "h-5 w-5" : "h-5 w-5"} />
          </span>
          {isContact ? (
            <span className="min-w-0">
              <span className="block font-display text-xl text-foreground">{label}</span>
              <span className="block text-sm text-muted">
                {label === "Instagram" ? "@lilithiana_libri" : "lilithianalibri"}
              </span>
            </span>
          ) : (
            <span className="sr-only">{label}</span>
          )}
        </a>
      ))}
    </div>
  );
}
