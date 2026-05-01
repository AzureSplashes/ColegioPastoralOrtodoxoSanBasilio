/**
 * middleware.ts — Auth gatekeeper.
 * Checks Supabase session for all /alumnos/* routes EXCEPT the login page itself.
 * Runs server-side on every SSR request.
 */
import { defineMiddleware } from "astro:middleware";
import { createClient } from "./lib/supabase";

const PROTECTED_PREFIXES = [
  "/alumnos/clases",
  "/alumnos/tareas",
  "/alumnos/recursos",
];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Only guard protected paths
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return next();

  // Check Supabase session
  const supabase = createClient(context.cookies);
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return context.redirect("/alumnos/");
  }

  return next();
});
