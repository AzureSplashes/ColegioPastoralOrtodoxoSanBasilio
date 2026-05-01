import { c as createComponent } from './astro-component_D6KHVzm2.mjs';
import 'piccolore';
import { P as renderTemplate, y as maybeRenderHead, a2 as addAttribute } from './sequence_DIX_ZTcT.mjs';
import { r as renderComponent } from './ssr-function_B4fnou5y.mjs';
import { g as getCollection, r as renderEntry, $ as $$Portal } from './_astro_content_CDUvCSKk.mjs';

const prerender = false;
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$;
  const { slug } = Astro2.params;
  const recursos = await getCollection("recursos");
  const recurso = recursos.find((r) => r.id === slug);
  if (!recurso) return Astro2.redirect("/alumnos/recursos/");
  const { Content } = await renderEntry(recurso);
  return renderTemplate`${renderComponent($$result, "Portal", $$Portal, { "title": `${recurso.data.title} | Recursos`, "portalPage": "recursos", "data-astro-cid-nuwd6pt6": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="section" data-astro-cid-nuwd6pt6> <div class="container" data-astro-cid-nuwd6pt6> <div class="breadcrumb" data-astro-cid-nuwd6pt6> <a href="/alumnos/recursos/" data-astro-cid-nuwd6pt6>← Volver a Recursos</a> </div> <article class="article" data-astro-cid-nuwd6pt6> <span class="category-badge" data-astro-cid-nuwd6pt6>${recurso.data.category}</span> <h1 class="section-title" data-astro-cid-nuwd6pt6>${recurso.data.title}</h1> <p class="article-desc" data-astro-cid-nuwd6pt6>${recurso.data.description}</p> ${recurso.data.link && renderTemplate`<a${addAttribute(recurso.data.link, "href")} target="_blank" rel="noopener" class="drive-link" data-astro-cid-nuwd6pt6> <i data-lucide="external-link" data-astro-cid-nuwd6pt6></i> Abrir enlace externo
</a>`} <div class="article-content" data-astro-cid-nuwd6pt6> ${renderComponent($$result2, "Content", Content, { "data-astro-cid-nuwd6pt6": true })} </div> </article> </div> </main> ` })}`;
}, "C:/Users/USER/Documents/San Basilio/site_rebuild/site_astro/src/pages/alumnos/recursos/[...slug].astro", void 0);

const $$file = "C:/Users/USER/Documents/San Basilio/site_rebuild/site_astro/src/pages/alumnos/recursos/[...slug].astro";
const $$url = "/alumnos/recursos/[...slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
