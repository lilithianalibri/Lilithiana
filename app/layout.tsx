import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { CookieConsentBanner } from "./components/cookie-consent-banner";
import { SiteFooter } from "./components/site-footer";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LILITHIANA | Audiolibri di Autrici",
  description:
    "Libreria audio dedicata alle autrici: catalogo, dettaglio libro e capitoli ordinati in uno stile elegante e contemporaneo.",
  icons: {
    icon: "/book-arrow-icon.svg",
    shortcut: "/book-arrow-icon.svg",
    apple: "/book-arrow-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="relative isolate min-h-full flex flex-col overflow-x-hidden"
      >
        {children}
        <CookieConsentBanner />
        <SiteFooter />
      </body>
    </html>
  );
}
