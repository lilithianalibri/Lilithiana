import type { CSSProperties } from "react";

type BookCoverProps = {
  title: string;
  author: string;
  from: string;
  via: string;
  to: string;
  className?: string;
  compact?: boolean;
  showIllustration?: boolean;
};

export function BookCover({
  title,
  author,
  from,
  via,
  to,
  className = "",
  compact = false,
  showIllustration = true,
}: BookCoverProps) {
  const coverStyle = {
    background: `
      radial-gradient(circle at 20% 18%, rgba(255, 255, 255, 0.32), transparent 34%),
      radial-gradient(circle at 78% 74%, rgba(255, 255, 255, 0.16), transparent 28%),
      linear-gradient(158deg, ${from} 0%, ${via} 47%, ${to} 100%)
    `,
  } satisfies CSSProperties;

  return (
    <div
      style={coverStyle}
      className={`book-cover book-cover--animated relative overflow-hidden rounded-2xl border border-white/25 ${className}`}
    >
      {!compact && showIllustration ? (
        <div aria-hidden className="book-illustration">
          <div className="book-illustration-shadow" />
          <div className="book-illustration-body">
            <div className="book-illustration-spine" />
            <div className="book-illustration-left-cover" />
            <div className="book-illustration-right-pages" />
            <div className="book-illustration-page book-illustration-page-a" />
            <div className="book-illustration-page book-illustration-page-b" />
            <div className="book-illustration-glint" />
          </div>
        </div>
      ) : null}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(0,0,0,0.12)_45%,rgba(0,0,0,0.34)_100%)]" />
      {compact ? (
        <div className="relative z-20 flex h-full flex-col justify-end p-2 text-white">
          <h3 className="text-[11px] leading-tight font-semibold">{title}</h3>
        </div>
      ) : (
        <div className="relative z-20 flex h-full flex-col justify-between p-5 text-white">
          <p className="text-[10px] uppercase tracking-[0.32em] text-white/80">
            LILITHIANA Originale
          </p>
          <div>
            <h3 className="font-display text-2xl leading-tight">{title}</h3>
            <p className="mt-2 text-sm text-white/85">{author}</p>
          </div>
        </div>
      )}
    </div>
  );
}
