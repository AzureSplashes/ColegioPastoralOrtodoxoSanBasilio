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
  const tareas = await getCollection("tareas");
  const tarea = tareas.find((t) => t.id === slug);
  if (!tarea) return Astro2.redirect("/alumnos/tareas/");
  const { Content } = await renderEntry(tarea);
  const formattedDue = new Date(tarea.data.dueDate).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  return renderTemplate`${renderComponent($$result, "Portal", $$Portal, { "title": `${tarea.data.title} | Tareas`, "portalPage": "tareas", "data-astro-cid-r3yhnejk": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="section" data-astro-cid-r3yhnejk> <div class="container" data-astro-cid-r3yhnejk> <div class="breadcrumb" data-astro-cid-r3yhnejk> <a href="/alumnos/tareas/" data-astro-cid-r3yhnejk>← Volver a Tareas</a> </div> <article class="article" data-astro-cid-r3yhnejk> <time class="article-date" data-astro-cid-r3yhnejk>Fecha de entrega: ${formattedDue}</time> <h1 class="section-title" data-astro-cid-r3yhnejk>${tarea.data.title}</h1> <p class="article-desc" data-astro-cid-r3yhnejk>${tarea.data.description}</p> ${tarea.data.link && renderTemplate`<a${addAttribute(tarea.data.link, "href")} target="_blank" rel="noopener" class="drive-link" data-astro-cid-r3yhnejk> <i data-lucide="external-link" data-astro-cid-r3yhnejk></i> Abrir enlace (Google Drive)
</a>`} <div class="article-content" data-astro-cid-r3yhnejk> ${renderComponent($$result2, "Content", Content, { "data-astro-cid-r3yhnejk": true })} </div> </article> </div> </main> ` })}`;
}, "C:/Users/USER/Documents/San Basilio/site_rebuild/site_astro/src/pages/alumnos/tareas/[...slug].astro", void 0);

const $$file = "C:/Users/USER/Documents/San Basilio/site_rebuild/site_astro/src/pages/alumnos/tareas/[...slug].astro";
const $$url = "/alumnos/tareas/[...slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
