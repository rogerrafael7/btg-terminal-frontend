import {
  AUTH_COOKIE_NAME,
  ROLE_COOKIE_NAME,
  USER_NAME_COOKIE_NAME,
} from "./auth-shared";

const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${THIRTY_DAYS_IN_SECONDS}; SameSite=Lax`;
}

export function persistSession(input: { token: string; role: string; name: string }) {
  writeCookie(AUTH_COOKIE_NAME, input.token);
  writeCookie(ROLE_COOKIE_NAME, input.role);
  writeCookie(USER_NAME_COOKIE_NAME, input.name);
}

export function clearSession() {
  document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
  document.cookie = `${ROLE_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
  document.cookie = `${USER_NAME_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function getClientToken() {
  return document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${AUTH_COOKIE_NAME}=`))
    ?.split("=")[1];
}
