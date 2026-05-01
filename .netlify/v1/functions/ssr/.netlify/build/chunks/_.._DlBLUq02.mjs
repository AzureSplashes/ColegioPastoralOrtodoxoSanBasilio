import { c as createComponent } from './astro-component_D6KHVzm2.mjs';
import 'piccolore';
import { P as renderTemplate, y as maybeRenderHead } from './sequence_DIX_ZTcT.mjs';
import { r as renderComponent } from './ssr-function_B4fnou5y.mjs';
import { g as getCollection, r as renderEntry, $ as $$Portal } from './_astro_content_CDUvCSKk.mjs';

const prerender = false;
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$;
  const { slug } = Astro2.params;
  const clases = await getCollection("clases");
  const clase = clases.find((c) => c.id === slug);
  if (!clase) return Astro2.redirect("/alumnos/clases/");
  const { Content } = await renderEntry(clase);
  const formattedDate = new Date(clase.data.date).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  return renderTemplate`${renderComponent($$result, "Portal", $$Portal, { "title": `${clase.data.title} | Clases`, "portalPage": "clases", "data-astro-cid-4ksdr7sj": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="section" data-astro-cid-4ksdr7sj> <div class="container" data-astro-cid-4ksdr7sj> <div class="breadcrumb" data-astro-cid-4ksdr7sj> <a href="/alumnos/clases/" data-astro-cid-4ksdr7sj>← Volver a Clases</a> </div> <article class="article" data-astro-cid-4ksdr7sj> <time class="article-date" data-astro-cid-4ksdr7sj>${formattedDate}</time> <h1 class="section-title" data-astro-cid-4ksdr7sj>${clase.data.title}</h1> <p class="article-desc" data-astro-cid-4ksdr7sj>${clase.data.description}</p> <div class="article-content" data-astro-cid-4ksdr7sj> ${renderComponent($$result2, "Content", Content, { "data-astro-cid-4ksdr7sj": true })} </div> </article> </div> </main> ` })}`;
}, "C:/Users/USER/Documents/San Basilio/site_rebuild/site_astro/src/pages/alumnos/clases/[...slug].astro", void 0);

const $$file = "C:/Users/USER/Documents/San Basilio/site_rebuild/site_astro/src/pages/alumnos/clases/[...slug].astro";
const $$url = "/alumnos/clases/[...slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
