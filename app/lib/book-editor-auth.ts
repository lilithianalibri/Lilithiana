import "server-only";

import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { canManageBooks } from "./admin-users";
import { getSupabaseServerClient } from "./supabase/server";

export async function getCurrentBookManager(): Promise<User | null> {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !canManageBooks(user)) {
    return null;
  }

  return user;
}

export async function requireBookManagerPage(nextPath: string) {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    redirect(`/accedi?next=${encodeURIComponent(nextPath)}`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/accedi?next=${encodeURIComponent(nextPath)}`);
  }

  if (!canManageBooks(user)) {
    redirect("/dashboard");
  }

  return user;
}

export async function requireBookManagerAction() {
  const user = await getCurrentBookManager();

  if (!user) {
    throw new Error("Non hai i permessi per gestire i libri.");
  }

  return user;
}
