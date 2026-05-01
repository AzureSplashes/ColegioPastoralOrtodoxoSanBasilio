import { createServerClient } from '@supabase/ssr';

function createClient(cookies) {
  return createServerClient(
    "https://placeholder.supabase.co",
    "placeholder-key",
    {
      cookies: {
        getAll: () => {
          const allCookies = [];
          const sbCookieNames = [
            "sb-access-token",
            "sb-refresh-token"
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
        }
      }
    }
  );
}

export { createClient as c };
