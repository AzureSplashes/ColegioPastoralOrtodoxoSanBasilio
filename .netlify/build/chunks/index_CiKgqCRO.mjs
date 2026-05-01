import { c as createComponent } from './astro-component_D6KHVzm2.mjs';
import 'piccolore';
import { P as renderTemplate, y as maybeRenderHead, a2 as addAttribute } from './sequence_DIX_ZTcT.mjs';
import { r as renderComponent } from './ssr-function_B4fnou5y.mjs';
import { g as getCollection, $ as $$Portal } from './_astro_content_CDUvCSKk.mjs';

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const recursos = (await getCollection("recursos")).sort(
    (a, b) => a.data.title.localeCompare(b.data.title)
  );
  const categoryIcons = {
    Lectura: "book-open",
    Video: "play-circle",
    Documento: "file-text",
    Enlace: "external-link"
  };
  return renderTemplate`${renderComponent($$result, "Portal", $$Portal, { "title": "Recursos | Portal de Alumnos", "portalPage": "recursos", "data-astro-cid-ti4cpcej": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="section" data-astro-cid-ti4cpcej> <div class="container" data-astro-cid-ti4cpcej> <div class="section-header" data-astro-cid-ti4cpcej> <h1 class="section-title" data-astro-cid-ti4cpcej>Recursos</h1> <p data-astro-cid-ti4cpcej>Material de apoyo, lecturas y enlaces para el curso.</p> </div> ${recursos.length === 0 ? renderTemplate`<div class="empty-state" data-astro-cid-ti4cpcej> <i data-lucide="folder-open" data-astro-cid-ti4cpcej></i> <p data-astro-cid-ti4cpcej>No hay recursos publicados por el momento.</p> </div>` : renderTemplate`<div class="content-list" data-astro-cid-ti4cpcej> ${recursos.map((recurso) => renderTemplate`<a${addAttribute(`/alumnos/recursos/${recurso.id}/`, "href")} class="content-card" data-astro-cid-ti4cpcej> <div class="content-card-body" data-astro-cid-ti4cpcej> <span class="category-badge" data-astro-cid-ti4cpcej> <i${addAttribute(categoryIcons[recurso.data.category] || "file", "data-lucide")} style="width:14px;height:14px" data-astro-cid-ti4cpcej></i> ${recurso.data.category} </span> <h3 class="content-title" data-astro-cid-ti4cpcej>${recurso.data.title}</h3> <p class="content-desc" data-astro-cid-ti4cpcej>${recurso.data.description}</p> </div> <i data-lucide="chevron-right" class="content-arrow" data-astro-cid-ti4cpcej></i> </a>`)} </div>`} </div> </main> ` })}`;
}, "C:/Users/USER/Documents/San Basilio/site_rebuild/site_astro/src/pages/alumnos/recursos/index.astro", void 0);

const $$file = "C:/Users/USER/Documents/San Basilio/site_rebuild/site_astro/src/pages/alumnos/recursos/index.astro";
const $$url = "/alumnos/recursos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
