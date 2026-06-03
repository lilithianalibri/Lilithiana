import type { EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/app/lib/supabase/server";

function resolveNextPath(value: string | null, fallback = "/dashboard") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}

function redirectToConfirmedLogin(request: NextRequest, nextPath: string) {
  const confirmedUrl = new URL("/accedi", request.url);
  confirmedUrl.searchParams.set("mode", "signin");
  confirmedUrl.searchParams.set("confirmed", "1");
  confirmedUrl.searchParams.set("next", nextPath);
  return NextResponse.redirect(confirmedUrl);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const nextPath = resolveNextPath(searchParams.get("next"));
  const callbackError =
    searchParams.get("error") ??
    searchParams.get("error_code") ??
    searchParams.get("error_description");
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.redirect(new URL(`/accedi?next=${encodeURIComponent(nextPath)}`, request.url));
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (nextPath.startsWith("/accedi") && nextPath.includes("confirmed=1")) {
        return redirectToConfirmedLogin(request, "/dashboard");
      }

      return NextResponse.redirect(new URL(nextPath, request.url));
    }
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!error) {
      if (type === "signup") {
        return redirectToConfirmedLogin(request, "/dashboard");
      }

      return NextResponse.redirect(new URL(nextPath, request.url));
    }
  }

  if (!callbackError && !code && !tokenHash) {
    const confirmedNextPath =
      nextPath.startsWith("/accedi") && nextPath.includes("confirmed=1")
        ? "/dashboard"
        : nextPath;

    return redirectToConfirmedLogin(request, confirmedNextPath);
  }

  const fallback = new URL("/accedi", request.url);
  fallback.searchParams.set("next", nextPath);
  fallback.searchParams.set("error", "callback");
  return NextResponse.redirect(fallback);
}
