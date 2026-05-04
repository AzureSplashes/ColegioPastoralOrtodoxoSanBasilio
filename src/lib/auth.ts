export type UserRole = "admin" | "profesor" | "alumno";

const VALID_ROLES: UserRole[] = ["admin", "profesor", "alumno"];

function isValidRole(value: unknown): value is UserRole {
  return typeof value === "string" && VALID_ROLES.includes(value as UserRole);
}

export function getRoleFromUser(user: { app_metadata?: Record<string, unknown>; user_metadata?: Record<string, unknown>; } | null): UserRole | null {
  if (!user) return null;

  const appRole = user.app_metadata?.role;
  if (isValidRole(appRole)) return appRole;

  const userRole = user.user_metadata?.role;
  if (isValidRole(userRole)) return userRole;

  return null;
}

export function hasAnyRole(role: UserRole | null, allowed: UserRole[]): boolean {
  return !!role && allowed.includes(role);
}
