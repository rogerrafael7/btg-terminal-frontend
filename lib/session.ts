import { cache } from "react";
import { cookies } from "next/headers";
import {
  AUTH_COOKIE_NAME,
  ROLE_COOKIE_NAME,
  USER_NAME_COOKIE_NAME,
  type SessionRole,
} from "./auth-shared";

export type Session = {
  token: string;
  role: SessionRole;
  name: string | null;
};

export const getSession = cache(async (): Promise<Session | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const role = cookieStore.get(ROLE_COOKIE_NAME)?.value as SessionRole | undefined;
  const name = cookieStore.get(USER_NAME_COOKIE_NAME)?.value ?? null;

  if (!token || !role) {
    return null;
  }

  return {
    token,
    role,
    name,
  };
});

export async function requireSession() {
  const session = await getSession();

  if (!session) {
    throw new Error("UNAUTHENTICATED");
  }

  return session;
}
