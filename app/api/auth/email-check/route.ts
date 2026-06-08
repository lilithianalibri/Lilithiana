import { resolve4, resolve6, resolveMx } from "node:dns/promises";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const dnsTimeoutMs = 2500;

const disposableEmailDomains = new Set([
  "10minutemail.com",
  "guerrillamail.com",
  "mailinator.com",
  "sharklasers.com",
  "tempmail.com",
  "trashmail.com",
  "yopmail.com",
]);

const commonDomainTypos: Record<string, string> = {
  "gamil.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmail.it": "gmail.com",
  "gnail.com": "gmail.com",
  "hotmai.com": "hotmail.com",
  "hotmial.com": "hotmail.com",
  "outlok.com": "outlook.com",
  "yaho.com": "yahoo.com",
};

type EmailCheckResult =
  | { ok: true }
  | { ok: false; message: string; suggestion?: string };

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function getEmailDomain(email: string) {
  const atIndex = email.lastIndexOf("@");

  if (atIndex <= 0 || atIndex === email.length - 1) {
    return null;
  }

  return email.slice(atIndex + 1);
}

function isValidEmailShape(email: string) {
  if (email.length > 254 || email.includes("..")) {
    return false;
  }

  return /^[^\s@]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email);
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error("DNS check timed out"));
    }, timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });
}

async function domainHasMailRoute(domain: string) {
  try {
    const mxRecords = await withTimeout(resolveMx(domain), dnsTimeoutMs);
    return mxRecords.some((record) => record.exchange && record.exchange !== ".");
  } catch (error) {
    const code = error instanceof Error && "code" in error ? error.code : null;

    if (code !== "ENODATA" && code !== "ENOTFOUND") {
      return true;
    }
  }

  try {
    const [ipv4Records, ipv6Records] = await Promise.allSettled([
      withTimeout(resolve4(domain), dnsTimeoutMs),
      withTimeout(resolve6(domain), dnsTimeoutMs),
    ]);

    return (
      (ipv4Records.status === "fulfilled" && ipv4Records.value.length > 0) ||
      (ipv6Records.status === "fulfilled" && ipv6Records.value.length > 0)
    );
  } catch {
    return false;
  }
}

async function checkEmail(email: string): Promise<EmailCheckResult> {
  const normalizedEmail = normalizeEmail(email);

  if (!isValidEmailShape(normalizedEmail)) {
    return {
      ok: false,
      message: "Controlla l'indirizzo email: sembra scritto in modo non valido.",
    };
  }

  const domain = getEmailDomain(normalizedEmail);

  if (!domain) {
    return {
      ok: false,
      message: "Controlla l'indirizzo email: manca il dominio dopo la chiocciola.",
    };
  }

  const suggestion = commonDomainTypos[domain];

  if (suggestion) {
    return {
      ok: false,
      message: `Il dominio "${domain}" sembra un refuso. Forse intendevi "${suggestion}".`,
      suggestion,
    };
  }

  if (disposableEmailDomains.has(domain)) {
    return {
      ok: false,
      message: "Usa un indirizzo email reale: le email temporanee non sono accettate.",
    };
  }

  const hasMailRoute = await domainHasMailRoute(domain);

  if (!hasMailRoute) {
    return {
      ok: false,
      message:
        "Il dominio dell'email non sembra configurato per ricevere posta. Controlla l'indirizzo e riprova.",
    };
  }

  return { ok: true };
}

async function readEmail(request: Request) {
  try {
    const body = (await request.json()) as unknown;

    if (!body || typeof body !== "object" || !("email" in body)) {
      return "";
    }

    const email = body.email;
    return typeof email === "string" ? email : "";
  } catch {
    return "";
  }
}

export async function POST(request: Request) {
  const email = await readEmail(request);
  const result = await checkEmail(email);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
