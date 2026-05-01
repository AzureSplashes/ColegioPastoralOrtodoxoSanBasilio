import { c as createComponent } from './astro-component_D6KHVzm2.mjs';
import 'piccolore';
import { P as renderTemplate, y as maybeRenderHead, a2 as addAttribute } from './sequence_DIX_ZTcT.mjs';
import { r as renderComponent } from './ssr-function_B4fnou5y.mjs';
import { g as getCollection, $ as $$Portal } from './_astro_content_CDUvCSKk.mjs';

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const clases = (await getCollection("clases")).sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );
  return renderTemplate`${renderComponent($$result, "Portal", $$Portal, { "title": "Clases | Portal de Alumnos", "portalPage": "clases", "data-astro-cid-grirs6yf": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="section" data-astro-cid-grirs6yf> <div class="container" data-astro-cid-grirs6yf> <div class="section-header" data-astro-cid-grirs6yf> <h1 class="section-title" data-astro-cid-grirs6yf>Clases</h1> <p data-astro-cid-grirs6yf>Material y contenido de las clases del Colegio.</p> </div> ${clases.length === 0 ? renderTemplate`<div class="empty-state" data-astro-cid-grirs6yf> <i data-lucide="book-open" data-astro-cid-grirs6yf></i> <p data-astro-cid-grirs6yf>No hay clases publicadas por el momento.</p> </div>` : renderTemplate`<div class="content-list" data-astro-cid-grirs6yf> ${clases.map((clase) => renderTemplate`<a${addAttribute(`/alumnos/clases/${clase.id}/`, "href")} class="content-card" data-astro-cid-grirs6yf> <div class="content-card-body" data-astro-cid-grirs6yf> <time class="content-date" data-astro-cid-grirs6yf> ${new Date(clase.data.date).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })} </time> <h3 class="content-title" data-astro-cid-grirs6yf>${clase.data.title}</h3> <p class="content-desc" data-astro-cid-grirs6yf>${clase.data.description}</p> </div> <i data-lucide="chevron-right" class="content-arrow" data-astro-cid-grirs6yf></i> </a>`)} </div>`} </div> </main> ` })}`;
}, "C:/Users/USER/Documents/San Basilio/site_rebuild/site_astro/src/pages/alumnos/clases/index.astro", void 0);

const $$file = "C:/Users/USER/Documents/San Basilio/site_rebuild/site_astro/src/pages/alumnos/clases/index.astro";
const $$url = "/alumnos/clases";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
