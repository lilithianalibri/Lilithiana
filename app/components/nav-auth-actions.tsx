"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { LayoutDashboard, Loader2, LogOut } from "lucide-react";
import { getSupabaseBrowserClient } from "../lib/supabase/browser";

export function NavAuthActions() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!active) {
        return;
      }
      setUserId(data.user?.id ?? null);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSignOut() {
    if (!supabase) {
      return;
    }

    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    router.refresh();
  }

  if (!supabase || !userId) {
    return (
      <Link
        href="/accedi"
        className="whitespace-nowrap rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
      >
        Accedi
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
      >
        <LayoutDashboard size={14} />
        Dashboard
      </Link>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-accent transition hover:bg-white disabled:opacity-60"
        aria-label="Esci dal tuo account"
      >
        {loading ? <Loader2 size={12} className="animate-spin" /> : <LogOut size={12} />}
        Esci
      </button>
    </div>
  );
}
