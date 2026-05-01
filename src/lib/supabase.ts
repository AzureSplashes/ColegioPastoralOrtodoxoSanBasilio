/**
 * supabase.ts — Server-side Supabase client factory.
 * Uses @supabase/ssr for cookie-based session management.
 * Called from middleware and SSR pages.
 */
import { createServerClient } from "@supabase/ssr";
import type { AstroCookies } from "astro";

export function createClient(cookies: AstroCookies) {
  return createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => {
          // Return all cookies as { name, value } pairs
          const allCookies: { name: string; value: string }[] = [];
          // AstroCookies doesn't expose a getAll, so we rely on
          // the specific cookie names Supabase uses
          const sbCookieNames = [
            "sb-access-token",
            "sb-refresh-token",
          ];
          for (const name of sbCookieNames) {
            const val = cookies.get(name)?.value;
            if (val) allCookies.push({ name, value: val });
          }
          return allCookies;
        },
        setAll: (cookiesToSet) => {
          for (const { name, value, options } of cookiesToSet) {
            cookies.set(name, value, options);
          }
        },
      },
    }
  );
}
