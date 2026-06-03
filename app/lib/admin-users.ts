import "server-only";

import type { User } from "@supabase/supabase-js";
import { getSupabaseAdminClient } from "./supabase/admin";

type RoleUser = {
  app_metadata?: Record<string, unknown> | null;
  user_metadata?: Record<string, unknown> | null;
  email?: string | null;
};

export type AdminUserRow = {
  id: string;
  email: string;
  displayName: string;
  role: string;
  isAdmin: boolean;
  providers: string;
  createdAtLabel: string;
  confirmedAtLabel: string;
  lastSignInAtLabel: string;
};

export type AdminUsersOverview = {
  users: AdminUserRow[];
  summary: {
    totalUsers: number;
    adminUsers: number;
    confirmedUsers: number;
    activeLast30Days: number;
  };
  error: string | null;
};

function asRecord(value: unknown) {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : {};
}

function getStringValue(metadata: unknown, key: string) {
  const value = asRecord(metadata)[key];
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

export function getRoleFromUser(user: RoleUser | null) {
  const appRole = getStringValue(user?.app_metadata, "role");
  const userRole = getStringValue(user?.user_metadata, "role");

  return (appRole ?? userRole ?? "").toLowerCase();
}

export function isAdminUser(user: RoleUser | null) {
  return canManageUsers(user);
}

export function canManageUsers(user: RoleUser | null) {
  return getRoleFromUser(user) === "admin";
}

export function canManageBooks(user: RoleUser | null) {
  const role = getRoleFromUser(user);
  return role === "admin" || role === "editor";
}

function displayNameFromUser(user: User) {
  const displayName =
    getStringValue(user.user_metadata, "display_name") ??
    getStringValue(user.user_metadata, "full_name") ??
    getStringValue(user.user_metadata, "name");

  if (displayName) {
    return displayName;
  }

  const email = user.email ?? "";
  const localPart = email.split("@")[0];
  return localPart || "Utente";
}

function providersFromUser(user: User) {
  const providers = asRecord(user.app_metadata).providers;
  if (Array.isArray(providers)) {
    const labels = providers
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);

    if (labels.length > 0) {
      return labels.join(", ");
    }
  }

  return getStringValue(user.app_metadata, "provider") ?? "email";
}

function formatDateTime(value: string | null | undefined, fallback = "Mai") {
  if (!value) {
    return fallback;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Rome",
  }).format(date);
}

function isAfter(value: string | null | undefined, date: Date) {
  if (!value) {
    return false;
  }

  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime()) && parsed >= date;
}

export async function getAdminUsersOverview(): Promise<AdminUsersOverview> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return {
      users: [],
      summary: {
        totalUsers: 0,
        adminUsers: 0,
        confirmedUsers: 0,
        activeLast30Days: 0,
      },
      error:
        "Mancano le variabili server Supabase necessarie per leggere gli utenti.",
    };
  }

  const users: User[] = [];
  const perPage = 1000;

  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      return {
        users: [],
        summary: {
          totalUsers: 0,
          adminUsers: 0,
          confirmedUsers: 0,
          activeLast30Days: 0,
        },
        error: `Impossibile leggere gli utenti: ${error.message}`,
      };
    }

    users.push(...data.users);

    if (data.users.length < perPage) {
      break;
    }
  }

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const rows = users
    .slice()
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
    .map<AdminUserRow>((user) => {
      const role = getRoleFromUser(user);
      const confirmedAt = user.confirmed_at ?? user.email_confirmed_at;

      return {
        id: user.id,
        email: user.email ?? "Email non disponibile",
        displayName: displayNameFromUser(user),
        role: role || "utente",
        isAdmin: role === "admin",
        providers: providersFromUser(user),
        createdAtLabel: formatDateTime(user.created_at),
        confirmedAtLabel: formatDateTime(confirmedAt, "Non confermato"),
        lastSignInAtLabel: formatDateTime(user.last_sign_in_at),
      };
    });

  return {
    users: rows,
    summary: {
      totalUsers: users.length,
      adminUsers: rows.filter((user) => user.isAdmin).length,
      confirmedUsers: users.filter(
        (user) => user.confirmed_at ?? user.email_confirmed_at,
      ).length,
      activeLast30Days: users.filter((user) =>
        isAfter(user.last_sign_in_at, thirtyDaysAgo),
      ).length,
    },
    error: null,
  };
}
