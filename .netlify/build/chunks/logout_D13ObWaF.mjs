import { c as createComponent } from './astro-component_D6KHVzm2.mjs';
import 'piccolore';
import './sequence_DIX_ZTcT.mjs';
import 'clsx';
import { c as createClient } from './supabase_CZ4PdQ4m.mjs';

const prerender = false;
const $$Logout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Logout;
  const supabase = createClient(Astro2.cookies);
  await supabase.auth.signOut();
  return Astro2.redirect("/alumnos/");
}, "C:/Users/USER/Documents/San Basilio/site_rebuild/site_astro/src/pages/alumnos/logout.astro", void 0);

const $$file = "C:/Users/USER/Documents/San Basilio/site_rebuild/site_astro/src/pages/alumnos/logout.astro";
const $$url = "/alumnos/logout";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Logout,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
