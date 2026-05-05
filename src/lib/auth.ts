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

export async function getRoleFromProfiles(
  supabase: {
    from: (table: string) => {
      select: (fields: string) => {
        eq: (field: string, value: string) => {
          maybeSingle: () => Promise<{ data: { role?: unknown } | null; error: unknown }>;
        };
      };
    };
  },
  userId: string
): Promise<UserRole | null> {
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  const role = data?.role;
  return isValidRole(role) ? role : null;
}
