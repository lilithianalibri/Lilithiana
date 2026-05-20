export const COOKIE_CONSENT_VERSION = "2026-05-20";
export const COOKIE_CONSENT_STORAGE_KEY = "lilithiana_cookie_consent_v1";
export const COOKIE_CONSENT_COOKIE_NAME = "lilithiana_cookie_consent";
export const COOKIE_CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

export type CookiePreferences = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  profiling: boolean;
};

export type CookieConsentChoice = "accept_all" | "reject_optional" | "custom";

export type CookieConsentState = {
  version: string;
  choice: CookieConsentChoice;
  preferences: CookiePreferences;
  consentedAt: string;
};

export function createNecessaryOnlyPreferences(): CookiePreferences {
  return {
    necessary: true,
    functional: false,
    analytics: false,
    profiling: false,
  };
}

export function createAllAcceptedPreferences(): CookiePreferences {
  return {
    necessary: true,
    functional: true,
    analytics: true,
    profiling: true,
  };
}

export function createConsentState(
  choice: CookieConsentChoice,
  preferences: CookiePreferences,
): CookieConsentState {
  return {
    version: COOKIE_CONSENT_VERSION,
    choice,
    preferences,
    consentedAt: new Date().toISOString(),
  };
}

function safeParseConsent(value: string | null): CookieConsentState | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as CookieConsentState;

    if (
      !parsed ||
      typeof parsed !== "object" ||
      typeof parsed.version !== "string" ||
      typeof parsed.choice !== "string" ||
      !parsed.preferences
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function readConsentFromStorage(): CookieConsentState | null {
  if (typeof window === "undefined") {
    return null;
  }

  return safeParseConsent(window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY));
}

export function persistConsent(consent: CookieConsentState) {
  if (typeof window === "undefined") {
    return;
  }

  const serialized = JSON.stringify(consent);
  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, serialized);
  document.cookie = `${COOKIE_CONSENT_COOKIE_NAME}=${encodeURIComponent(serialized)}; Max-Age=${COOKIE_CONSENT_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
}

export function clearConsent() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
  document.cookie = `${COOKIE_CONSENT_COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;
}
