export const AUTH_COOKIE_NAME = "apex_access_token";
export const ROLE_COOKIE_NAME = "apex_user_role";
export const USER_NAME_COOKIE_NAME = "apex_user_name";

export type SessionRole = "ADMIN" | "AGENT" | "VIEWER";

export function canManageReservations(role: SessionRole) {
  return role === "ADMIN" || role === "AGENT";
}
