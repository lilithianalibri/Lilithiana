"use client";

import { Settings2 } from "lucide-react";
import { requestOpenCookiePreferences } from "./cookie-consent-banner";

type CookiePreferencesTriggerProps = {
  className?: string;
};

export function CookiePreferencesTrigger({ className }: CookiePreferencesTriggerProps) {
  return (
    <button
      type="button"
      onClick={() => requestOpenCookiePreferences()}
      className={
        className ??
        "inline-flex items-center gap-2 rounded-full border border-accent/20 bg-white px-5 py-2.5 text-sm font-semibold text-accent transition hover:bg-white"
      }
    >
      <Settings2 size={14} />
      Gestisci preferenze cookie
    </button>
  );
}
