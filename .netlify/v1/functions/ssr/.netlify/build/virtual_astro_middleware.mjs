import { a6 as defineMiddleware, ag as sequence } from './chunks/sequence_DIX_ZTcT.mjs';
import '@astrojs/internal-helpers/path';
import 'piccolore';
import 'clsx';
import '@astrojs/internal-helpers/object';
import { c as createClient } from './chunks/supabase_CZ4PdQ4m.mjs';

const PROTECTED_PREFIXES = [
  "/alumnos/clases",
  "/alumnos/tareas",
  "/alumnos/recursos"
];
const onRequest$1 = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return next();
  const supabase = createClient(context.cookies);
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return context.redirect("/alumnos/");
  }
  return next();
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
