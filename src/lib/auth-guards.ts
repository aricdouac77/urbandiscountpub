import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, type Session } from "@/lib/auth";

export const getCurrentSession = cache(async (): Promise<Session | null> => {
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
});

export async function requireUser(redirectTo = "/connexion"): Promise<Session> {
  const session = await getCurrentSession();

  if (!session) {
    redirect(redirectTo);
  }

  return session;
}

export async function requireAdmin(redirectTo = "/"): Promise<Session> {
  const session = await requireUser();

  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    redirect(redirectTo);
  }

  return session;
}
