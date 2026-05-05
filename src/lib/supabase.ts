/**
 * supabase.ts — Server-side Supabase client factory.
 * Uses @supabase/ssr for cookie-based session management.
 * Called from middleware and SSR pages.
 */
import { createServerClient } from "@supabase/ssr";
import type { AstroCookies } from "astro";

function parseCookieHeader(cookieHeader: string | null): { name: string; value: string }[] {
  if (!cookieHeader) return [];
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const idx = part.indexOf("=");
      if (idx === -1) return { name: part, value: "" };
      const name = part.slice(0, idx).trim();
      const value = part.slice(idx + 1).trim();
      return { name, value };
    });
}

export function createClient(cookies: AstroCookies, cookieHeader?: string | null) {
  return createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => parseCookieHeader(cookieHeader ?? null),
        setAll: (cookiesToSet) => {
          for (const { name, value, options } of cookiesToSet) {
            cookies.set(name, value, options);
          }
        },
      },
    }
  );
}
