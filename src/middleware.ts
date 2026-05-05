/**
 * middleware.ts - Auth and role gatekeeper.
 */
import { defineMiddleware } from "astro:middleware";
import { createClient } from "./lib/supabase";
import { getRoleFromProfiles, hasAnyRole } from "./lib/auth";

const STUDENT_AREA_PREFIXES = [
  "/alumnos/clases",
  "/alumnos/tareas",
  "/alumnos/recursos",
];

const ADMIN_PREFIXES = ["/administracion/portal"];
const ADMIN_LOGIN_PATH = "/administracion/portal/login/";

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  const isStudentArea = STUDENT_AREA_PREFIXES.some((p) => pathname.startsWith(p));
  const isAdminArea = ADMIN_PREFIXES.some((p) => pathname.startsWith(p));
  const isAdminLoginPage = pathname === ADMIN_LOGIN_PATH;

  if (!isStudentArea && !isAdminArea) return next();
  if (isAdminLoginPage) return next();

  const supabase = createClient(context.cookies, context.request.headers.get("cookie"));
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    if (isAdminArea) return context.redirect("/administracion/portal/login/");
    return context.redirect("/alumnos/");
  }

  const role = await getRoleFromProfiles(supabase, data.user.id);
  context.locals.user = data.user;
  context.locals.role = role;

  if (isAdminArea && !hasAnyRole(role, ["admin"])) {
    return context.redirect("/alumnos/?error=admin_required");
  }

  if (isStudentArea && !hasAnyRole(role, ["admin", "profesor", "alumno"])) {
    await supabase.auth.signOut();
    return context.redirect("/alumnos/?error=role_missing");
  }

  return next();
});
