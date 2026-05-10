"use client";

import { apiRequest, clearSession, getStoredSessionSync, storeSession } from "@/lib/services/http";
import type { AdminProfile, AuthSession, Credentials } from "@/types";

type LoginResponse = {
  token: string;
  adminProfile: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

export async function login(credentials: Credentials): Promise<AuthSession> {
  const response = await apiRequest<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password,
    }),
  });

  const session: AuthSession = { token: response.token, adminProfile: mapAdmin(response.adminProfile) };
  storeSession(session);

  return session;
}

export async function logout() {
  const session = getStoredSessionSync();
  if (session?.token) {
    try {
      await apiRequest<void>("/api/auth/logout", { method: "POST" }, { auth: true });
    } catch {
      // Ignore logout API failures and clear local session anyway.
    }
  }
  clearSession();
}

export async function getStoredSession() {
  const session = getStoredSessionSync();
  if (!session) {
    return null;
  }

  try {
    const profile = await apiRequest<LoginResponse["adminProfile"]>("/api/auth/me", undefined, {
      auth: true,
    });
    const nextSession: AuthSession = {
      token: session.token,
      adminProfile: mapAdmin(profile),
    };
    storeSession(nextSession);
    return nextSession;
  } catch {
    clearSession();
    return null;
  }
}

function mapAdmin(value: LoginResponse["adminProfile"]): AdminProfile {
  return {
    id: value.id,
    name: value.name,
    email: value.email,
    role: value.role,
  };
}
