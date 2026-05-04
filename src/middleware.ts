/**
 * middleware.ts - Auth and role gatekeeper.
 */
import { defineMiddleware } from "astro:middleware";
import { createClient } from "./lib/supabase";
import { getRoleFromUser, hasAnyRole } from "./lib/auth";

const STUDENT_AREA_PREFIXES = [
  "/alumnos/clases",
  "/alumnos/tareas",
  "/alumnos/recursos",
];

const ADMIN_PREFIXES = ["/administracion/portal"];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  const isStudentArea = STUDENT_AREA_PREFIXES.some((p) => pathname.startsWith(p));
  const isAdminArea = ADMIN_PREFIXES.some((p) => pathname.startsWith(p));

  if (!isStudentArea && !isAdminArea) return next();

  const supabase = createClient(context.cookies);
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    if (isAdminArea) return context.redirect("/administracion/portal/login/");
    return context.redirect("/alumnos/");
  }

  const role = getRoleFromUser(data.user);
  context.locals.user = data.user;
  context.locals.role = role;

  if (isAdminArea && !hasAnyRole(role, ["admin"])) {
    return context.redirect("/alumnos/");
  }

  if (isStudentArea && !hasAnyRole(role, ["admin", "profesor", "alumno"])) {
    await supabase.auth.signOut();
    return context.redirect("/alumnos/");
  }

  return next();
});
