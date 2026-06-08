import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./supabase/database.types";
import { getSupabaseAdminClient } from "./supabase/admin";
import { getSupabaseServerClient } from "./supabase/server";

export async function getBookEditorSupabaseClient(): Promise<SupabaseClient<Database> | null> {
  return getSupabaseAdminClient() ?? getSupabaseServerClient();
}

export function getBookEditorClientUnavailableMessage() {
  return "Supabase non e configurato per il pannello libri. Aggiungi la service role nel deploy oppure applica le policy editor della migration Supabase.";
}

export function formatBookEditorDatabaseError(message: string | null | undefined) {
  const fallback = "Impossibile completare l'operazione sul pannello libri.";
  const normalized = message?.toLowerCase() ?? "";

  if (
    normalized.includes("row-level security") ||
    normalized.includes("permission denied") ||
    normalized.includes("42501")
  ) {
    return "Permessi Supabase mancanti per il pannello libri: aggiungi la service role nel deploy oppure applica la migration delle policy editor.";
  }

  return message || fallback;
}
