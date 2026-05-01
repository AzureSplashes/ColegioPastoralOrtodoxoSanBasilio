import { c as createComponent } from './astro-component_D6KHVzm2.mjs';
import 'piccolore';
import { P as renderTemplate, y as maybeRenderHead, a2 as addAttribute } from './sequence_DIX_ZTcT.mjs';
import { r as renderComponent } from './ssr-function_B4fnou5y.mjs';
import { g as getCollection, $ as $$Portal } from './_astro_content_CDUvCSKk.mjs';

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const tareas = (await getCollection("tareas")).sort(
    (a, b) => new Date(b.data.dueDate).getTime() - new Date(a.data.dueDate).getTime()
  );
  return renderTemplate`${renderComponent($$result, "Portal", $$Portal, { "title": "Tareas | Portal de Alumnos", "portalPage": "tareas", "data-astro-cid-qv47mc3b": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="section" data-astro-cid-qv47mc3b> <div class="container" data-astro-cid-qv47mc3b> <div class="section-header" data-astro-cid-qv47mc3b> <h1 class="section-title" data-astro-cid-qv47mc3b>Tareas</h1> <p data-astro-cid-qv47mc3b>Asignaciones y entregas del curso.</p> </div> ${tareas.length === 0 ? renderTemplate`<div class="empty-state" data-astro-cid-qv47mc3b> <i data-lucide="clipboard-list" data-astro-cid-qv47mc3b></i> <p data-astro-cid-qv47mc3b>No hay tareas publicadas por el momento.</p> </div>` : renderTemplate`<div class="content-list" data-astro-cid-qv47mc3b> ${tareas.map((tarea) => {
    const isPast = new Date(tarea.data.dueDate) < /* @__PURE__ */ new Date();
    return renderTemplate`<a${addAttribute(`/alumnos/tareas/${tarea.id}/`, "href")}${addAttribute(["content-card", { past: isPast }], "class:list")} data-astro-cid-qv47mc3b> <div class="content-card-body" data-astro-cid-qv47mc3b> <div class="tarea-meta" data-astro-cid-qv47mc3b> <time class="content-date" data-astro-cid-qv47mc3b>
Entrega: ${new Date(tarea.data.dueDate).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })} </time> ${isPast && renderTemplate`<span class="badge-past" data-astro-cid-qv47mc3b>Fecha pasada</span>`} </div> <h3 class="content-title" data-astro-cid-qv47mc3b>${tarea.data.title}</h3> <p class="content-desc" data-astro-cid-qv47mc3b>${tarea.data.description}</p> ${tarea.data.link && renderTemplate`<span class="link-indicator" data-astro-cid-qv47mc3b> <i data-lucide="external-link" style="width:14px;height:14px" data-astro-cid-qv47mc3b></i> Enlace adjunto
</span>`} </div> <i data-lucide="chevron-right" class="content-arrow" data-astro-cid-qv47mc3b></i> </a>`;
  })} </div>`} </div> </main> ` })}`;
}, "C:/Users/USER/Documents/San Basilio/site_rebuild/site_astro/src/pages/alumnos/tareas/index.astro", void 0);

const $$file = "C:/Users/USER/Documents/San Basilio/site_rebuild/site_astro/src/pages/alumnos/tareas/index.astro";
const $$url = "/alumnos/tareas";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
