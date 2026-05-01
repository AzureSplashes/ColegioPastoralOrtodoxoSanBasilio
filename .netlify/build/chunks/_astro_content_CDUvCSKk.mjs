import { c as createComponent } from './astro-component_D6KHVzm2.mjs';
import 'piccolore';
import { Q as createRenderInstruction, T as renderElement, y as maybeRenderHead, a2 as addAttribute, P as renderTemplate, B as renderSlot, aO as renderHead, av as generateCspDigest, aM as unescapeHTML, A as AstroError, aP as UnknownContentCollectionError, aQ as RenderUndefinedEntryError, aR as createHeadAndContent } from './sequence_DIX_ZTcT.mjs';
import { r as renderComponent, s as spreadAttributes } from './ssr-function_B4fnou5y.mjs';
import 'clsx';
import { escape } from 'html-escaper';
import { Traverse } from 'neotraverse/modern';
import * as z from 'zod/v4';
import { removeBase, isRemotePath, prependForwardSlash } from '@astrojs/internal-helpers/path';
import { V as VALID_INPUT_FORMATS } from './consts_Bd-1c2lz.mjs';
import * as devalue from 'devalue';

async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}</script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"></script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}

function renderScriptElement({ props, children }) {
  return renderElement("script", {
    props,
    children
  });
}
function renderUniqueStylesheet(result, sheet) {
  if (sheet.type === "external") {
    if (Array.from(result.styles).some((s) => s.props.href === sheet.src)) return "";
    return renderElement("link", { props: { rel: "stylesheet", href: sheet.src }, children: "" });
  }
  if (sheet.type === "inline") {
    if (Array.from(result.styles).some((s) => s.children.includes(sheet.content))) return "";
    return renderElement("style", { props: {}, children: sheet.content });
  }
}

const $$Nav = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Nav;
  const { activePage = "" } = Astro2.props;
  const navItems = [
    { href: "/", label: "Inicio", slug: "inicio" },
    { href: "/administracion/", label: "Administración", slug: "administracion" },
    {
      href: "/contenido/",
      label: "Contenido",
      slug: "contenido",
      children: [
        { href: "/contenido/textos-liturgicos/", label: "Textos Litúrgicos" },
        { href: "/contenido/musica/", label: "Música" },
        { href: "/contenido/curso-propedeutico/", label: "Textos de Doctrina Cristiana Ortodoxa" }
      ]
    },
    { href: "/alumnos/", label: "Alumnos", slug: "alumnos" },
    { href: "/avisos/", label: "Avisos", slug: "avisos" },
    { href: "/contacto/", label: "Contacto", slug: "contacto" }
  ];
  return renderTemplate`${maybeRenderHead()}<header class="header" data-astro-cid-dmqpwcec> <div class="container" data-astro-cid-dmqpwcec> <nav class="nav" data-astro-cid-dmqpwcec> <a href="/" class="logo-container" data-astro-cid-dmqpwcec> <img src="/assets/img/logo.png" alt="Logo Colegio San Basilio" class="logo-img" data-astro-cid-dmqpwcec> <div class="logo-text" data-astro-cid-dmqpwcec>Colegio Pastoral Ortodoxo<br data-astro-cid-dmqpwcec>San Basilio</div> </a> <button class="nav-toggle" aria-label="Abrir menú" aria-expanded="false" data-astro-cid-dmqpwcec> <span class="nav-toggle-bar" data-astro-cid-dmqpwcec></span> <span class="nav-toggle-bar" data-astro-cid-dmqpwcec></span> <span class="nav-toggle-bar" data-astro-cid-dmqpwcec></span> </button> <ul class="nav-links" data-astro-cid-dmqpwcec> ${navItems.map(
    (item) => item.children ? renderTemplate`<li class="dropdown" data-astro-cid-dmqpwcec> <a${addAttribute(item.href, "href")}${addAttribute(["nav-link", { active: activePage === item.slug }], "class:list")} data-astro-cid-dmqpwcec> ${item.label} <i data-lucide="chevron-down" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-top:-2px" data-astro-cid-dmqpwcec></i> </a> <ul class="dropdown-menu" data-astro-cid-dmqpwcec> ${item.children.map((child) => renderTemplate`<li data-astro-cid-dmqpwcec><a${addAttribute(child.href, "href")} data-astro-cid-dmqpwcec>${child.label}</a></li>`)} </ul> </li>` : renderTemplate`<li data-astro-cid-dmqpwcec> <a${addAttribute(item.href, "href")}${addAttribute(["nav-link", { active: activePage === item.slug }], "class:list")} data-astro-cid-dmqpwcec> ${item.label} </a> </li>`
  )} </ul> </nav> </div> </header>  ${renderScript($$result, "C:/Users/USER/Documents/San Basilio/site_rebuild/site_astro/src/components/Nav.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/USER/Documents/San Basilio/site_rebuild/site_astro/src/components/Nav.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Footer;
  const { variant = "full" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<footer class="footer"> <div class="container"> ${variant === "full" && renderTemplate`<div class="footer-grid"> <div class="footer-col"> <h4>Colegio San Basilio</h4> <p style="opacity:0.7;font-size:0.9rem;">Colegio Pastoral Ortodoxo San Basilio — Diócesis de México, OCA.</p> </div> <div class="footer-col"> <h4>Navegación</h4> <ul class="footer-links"> <li><a href="/">Inicio</a></li> <li><a href="/administracion/">Administración</a></li> <li><a href="/contenido/">Contenido</a></li> <li><a href="/avisos/">Avisos</a></li> <li><a href="/alumnos/">Alumnos</a></li> <li><a href="/documentos-diocesis/">Documentos diócesis</a></li> <li><a href="/contacto/">Contacto</a></li> </ul> </div> <div class="footer-col"> <h4>Legal</h4> <ul class="footer-links"> <li><a href="/aviso-legal/">Aviso Legal</a></li> <li><a href="/politica-de-privacidad/">Política de Privacidad</a></li> </ul> </div> <div class="footer-col"> <h4>Contacto</h4> <ul class="footer-links" style="opacity:0.7;font-size:0.9rem;"> <li>+52 55 7903 1388</li> <li>cposb.oca@gmail.com</li> </ul> </div> </div>`} <div class="footer-bottom"> <p>&copy; ${(/* @__PURE__ */ new Date()).getFullYear()} Colegio Pastoral Ortodoxo San Basilio. Todos los derechos reservados.</p> </div> </div> </footer>`;
}, "C:/Users/USER/Documents/San Basilio/site_rebuild/site_astro/src/components/Footer.astro", void 0);

const $$Emblem = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div class="emblem-wrapper" data-astro-cid-b35vssaa> <img src="/assets/img/images.png" alt="Escudo del Colegio Pastoral Ortodoxo San Basilio" class="emblem-img" data-astro-cid-b35vssaa> </div>`;
}, "C:/Users/USER/Documents/San Basilio/site_rebuild/site_astro/src/components/Emblem.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Base = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Base;
  const {
    title,
    description = "Colegio Pastoral Ortodoxo San Basilio — Diócesis de México, OCA",
    activePage = "",
    footerVariant = "full"
  } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>', '</title><meta name="description"', '><!-- Fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Sorts+Mill+Goudy:ital@0;1&display=swap" rel="stylesheet"><!-- Icons --><script src="https://unpkg.com/lucide@latest"></script><!-- Favicon --><link rel="icon" type="image/png" href="/assets/img/logo.png"><!-- Supabase config (for client-side auth) --><meta name="supabase-url"', '><meta name="supabase-anon-key"', ">", "</head> <body> ", " ", " ", " ", " <script>lucide.createIcons();</script> </body> </html>"])), title, addAttribute(description, "content"), addAttribute("https://placeholder.supabase.co", "content"), addAttribute("placeholder-key", "content"), renderHead(), renderComponent($$result, "Nav", $$Nav, { "activePage": activePage }), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Emblem", $$Emblem, {}), renderComponent($$result, "Footer", $$Footer, { "variant": footerVariant }));
}, "C:/Users/USER/Documents/San Basilio/site_rebuild/site_astro/src/layouts/Base.astro", void 0);

const $$PortalNav = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$PortalNav;
  const { activePage = "" } = Astro2.props;
  const tabs = [
    { href: "/alumnos/clases/", label: "Clases", slug: "clases", icon: "book-open" },
    { href: "/alumnos/tareas/", label: "Tareas", slug: "tareas", icon: "clipboard-list" },
    { href: "/alumnos/recursos/", label: "Recursos", slug: "recursos", icon: "folder-open" }
  ];
  return renderTemplate`${maybeRenderHead()}<nav class="portal-nav" data-astro-cid-kvoooled> <div class="container" data-astro-cid-kvoooled> <div class="portal-nav-inner" data-astro-cid-kvoooled> <div class="portal-tabs" data-astro-cid-kvoooled> ${tabs.map((tab) => renderTemplate`<a${addAttribute(tab.href, "href")}${addAttribute(["portal-tab", { active: activePage === tab.slug }], "class:list")} data-astro-cid-kvoooled> <i${addAttribute(tab.icon, "data-lucide")} data-astro-cid-kvoooled></i> ${tab.label} </a>`)} </div> <a href="/alumnos/logout/" class="portal-logout" data-astro-cid-kvoooled> <i data-lucide="log-out" data-astro-cid-kvoooled></i> Cerrar sesión
</a> </div> </div> </nav>`;
}, "C:/Users/USER/Documents/San Basilio/site_rebuild/site_astro/src/components/PortalNav.astro", void 0);

const $$Portal = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Portal;
  const {
    title,
    description = "Portal de alumnos del Colegio Pastoral Ortodoxo San Basilio.",
    portalPage = ""
  } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": title, "description": description, "activePage": "alumnos" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PortalNav", $$PortalNav, { "activePage": portalPage })} ${renderSlot($$result2, $$slots["default"])} ` })}`;
}, "C:/Users/USER/Documents/San Basilio/site_rebuild/site_astro/src/layouts/Portal.astro", void 0);

function createSvgComponent({ meta, attributes, children, styles }) {
  const hasStyles = styles.length > 0;
  const Component = createComponent({
    async factory(result, props) {
      const normalizedProps = normalizeProps(attributes, props);
      if (hasStyles && result.cspDestination) {
        for (const style of styles) {
          const hash = await generateCspDigest(style, result.cspAlgorithm);
          result._metadata.extraStyleHashes.push(hash);
        }
      }
      return renderTemplate`<svg${spreadAttributes(normalizedProps)}>${unescapeHTML(children)}</svg>`;
    },
    propagation: hasStyles ? "self" : "none"
  });
  Object.defineProperty(Component, "toJSON", {
    value: () => meta,
    enumerable: false
  });
  return Object.assign(Component, meta);
}
const ATTRS_TO_DROP = ["xmlns", "xmlns:xlink", "version"];
const DEFAULT_ATTRS = {};
function dropAttributes(attributes) {
  for (const attr of ATTRS_TO_DROP) {
    delete attributes[attr];
  }
  return attributes;
}
function normalizeProps(attributes, props) {
  return dropAttributes({ ...DEFAULT_ATTRS, ...attributes, ...props });
}

const CONTENT_IMAGE_FLAG = "astroContentImageFlag";
const IMAGE_IMPORT_PREFIX = "__ASTRO_IMAGE_";

function imageSrcToImportId(imageSrc, filePath) {
  imageSrc = removeBase(imageSrc, IMAGE_IMPORT_PREFIX);
  if (isRemotePath(imageSrc)) {
    return;
  }
  const ext = imageSrc.split(".").at(-1)?.toLowerCase();
  if (!ext || !VALID_INPUT_FORMATS.includes(ext)) {
    return;
  }
  const params = new URLSearchParams(CONTENT_IMAGE_FLAG);
  if (filePath) {
    params.set("importer", filePath);
  }
  return `${imageSrc}?${params.toString()}`;
}

class ImmutableDataStore {
  _collections = /* @__PURE__ */ new Map();
  constructor() {
    this._collections = /* @__PURE__ */ new Map();
  }
  get(collectionName, key) {
    return this._collections.get(collectionName)?.get(String(key));
  }
  entries(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.entries()];
  }
  values(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.values()];
  }
  keys(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.keys()];
  }
  has(collectionName, key) {
    const collection = this._collections.get(collectionName);
    if (collection) {
      return collection.has(String(key));
    }
    return false;
  }
  hasCollection(collectionName) {
    return this._collections.has(collectionName);
  }
  collections() {
    return this._collections;
  }
  /**
   * Attempts to load a DataStore from the virtual module.
   * This only works in Vite.
   */
  static async fromModule() {
    try {
      const data = await import('./_astro_data-layer-content_BYgZeXwk.mjs');
      if (data.default instanceof Map) {
        return ImmutableDataStore.fromMap(data.default);
      }
      const map = devalue.unflatten(data.default);
      return ImmutableDataStore.fromMap(map);
    } catch {
    }
    return new ImmutableDataStore();
  }
  static async fromMap(data) {
    const store = new ImmutableDataStore();
    store._collections = data;
    return store;
  }
}
function dataStoreSingleton() {
  let instance = void 0;
  return {
    get: async () => {
      if (!instance) {
        instance = ImmutableDataStore.fromModule();
      }
      return instance;
    },
    set: (store) => {
      instance = store;
    }
  };
}
const globalDataStore = dataStoreSingleton();

z.object({
  tags: z.array(z.string()).optional(),
  lastModified: z.date().optional()
});
function createGetCollection({
  liveCollections
}) {
  return async function getCollection(collection, filter) {
    if (collection in liveCollections) {
      throw new AstroError({
        ...UnknownContentCollectionError,
        message: `Collection "${collection}" is a live collection. Use getLiveCollection() instead of getCollection().`
      });
    }
    const hasFilter = typeof filter === "function";
    const store = await globalDataStore.get();
    if (store.hasCollection(collection)) {
      const { default: imageAssetMap } = await import('./content-assets_DloNRoa4.mjs');
      const result = [];
      for (const rawEntry of store.values(collection)) {
        const data = updateImageReferencesInData(rawEntry.data, rawEntry.filePath, imageAssetMap);
        let entry = {
          ...rawEntry,
          data,
          collection
        };
        if (hasFilter && !filter(entry)) {
          continue;
        }
        result.push(entry);
      }
      return result;
    } else {
      console.warn(
        `The collection ${JSON.stringify(
          collection
        )} does not exist or is empty. Please check your content config file for errors.`
      );
      return [];
    }
  };
}
const CONTENT_LAYER_IMAGE_REGEX = /__ASTRO_IMAGE_="([^"]+)"/g;
async function updateImageReferencesInBody(html, fileName) {
  const { default: imageAssetMap } = await import('./content-assets_DloNRoa4.mjs');
  const imageObjects = /* @__PURE__ */ new Map();
  const { getImage } = await import('./_virtual_astro_get-image_CxHpPTC7.mjs');
  for (const [_full, imagePath] of html.matchAll(CONTENT_LAYER_IMAGE_REGEX)) {
    try {
      const decodedImagePath = JSON.parse(imagePath.replaceAll("&#x22;", '"'));
      let image;
      if (URL.canParse(decodedImagePath.src)) {
        image = await getImage(decodedImagePath);
      } else {
        const id = imageSrcToImportId(decodedImagePath.src, fileName);
        const imported = imageAssetMap.get(id);
        if (!id || imageObjects.has(id) || !imported) {
          continue;
        }
        image = await getImage({ ...decodedImagePath, src: imported });
      }
      imageObjects.set(imagePath, image);
    } catch {
      throw new Error(`Failed to parse image reference: ${imagePath}`);
    }
  }
  return html.replaceAll(CONTENT_LAYER_IMAGE_REGEX, (full, imagePath) => {
    const image = imageObjects.get(imagePath);
    if (!image) {
      return full;
    }
    const { index, ...attributes } = image.attributes;
    return Object.entries({
      ...attributes,
      src: image.src,
      srcset: image.srcSet.attribute,
      // This attribute is used by the toolbar audit
      ...{}
    }).map(([key, value]) => value ? `${key}="${escape(value)}"` : "").join(" ");
  });
}
function updateImageReferencesInData(data, fileName, imageAssetMap) {
  return new Traverse(data).map(function(ctx, val) {
    if (typeof val === "string" && val.startsWith(IMAGE_IMPORT_PREFIX)) {
      const src = val.replace(IMAGE_IMPORT_PREFIX, "");
      const id = imageSrcToImportId(src, fileName);
      if (!id) {
        ctx.update(src);
        return;
      }
      const imported = imageAssetMap?.get(id);
      if (imported) {
        if (imported.__svgData) {
          const { __svgData: svgData, ...meta } = imported;
          ctx.update(createSvgComponent({ meta, ...svgData }));
        } else {
          ctx.update(imported);
        }
      } else {
        ctx.update(src);
      }
    }
  });
}
async function renderEntry(entry) {
  if (!entry) {
    throw new AstroError(RenderUndefinedEntryError);
  }
  if (entry.deferredRender) {
    try {
      const { default: contentModules } = await import('./content-modules_Dz-S_Wwv.mjs');
      const renderEntryImport = contentModules.get(entry.filePath);
      return render({
        collection: "",
        id: entry.id,
        renderEntryImport
      });
    } catch (e) {
      console.error(e);
    }
  }
  const html = entry?.rendered?.metadata?.imagePaths?.length && entry.filePath ? await updateImageReferencesInBody(entry.rendered.html, entry.filePath) : entry?.rendered?.html;
  const Content = createComponent(() => renderTemplate`${unescapeHTML(html)}`);
  return {
    Content,
    headings: entry?.rendered?.metadata?.headings ?? [],
    remarkPluginFrontmatter: entry?.rendered?.metadata?.frontmatter ?? {}
  };
}
async function render({
  collection,
  id,
  renderEntryImport
}) {
  const UnexpectedRenderError = new AstroError({
    ...UnknownContentCollectionError,
    message: `Unexpected error while rendering ${String(collection)} → ${String(id)}.`
  });
  if (typeof renderEntryImport !== "function") throw UnexpectedRenderError;
  const baseMod = await renderEntryImport();
  if (baseMod == null || typeof baseMod !== "object") throw UnexpectedRenderError;
  const { default: defaultMod } = baseMod;
  if (isPropagatedAssetsModule(defaultMod)) {
    const { collectedStyles, collectedLinks, collectedScripts, getMod } = defaultMod;
    if (typeof getMod !== "function") throw UnexpectedRenderError;
    const propagationMod = await getMod();
    if (propagationMod == null || typeof propagationMod !== "object") throw UnexpectedRenderError;
    const Content = createComponent({
      factory(result, baseProps, slots) {
        let styles = "", links = "", scripts = "";
        if (Array.isArray(collectedStyles)) {
          styles = collectedStyles.map((style) => {
            return renderUniqueStylesheet(result, {
              type: "inline",
              content: style
            });
          }).join("");
        }
        if (Array.isArray(collectedLinks)) {
          links = collectedLinks.map((link) => {
            return renderUniqueStylesheet(result, {
              type: "external",
              src: isRemotePath(link) ? link : prependForwardSlash(link)
            });
          }).join("");
        }
        if (Array.isArray(collectedScripts)) {
          scripts = collectedScripts.map((script) => renderScriptElement(script)).join("");
        }
        let props = baseProps;
        if (id.endsWith("mdx")) {
          props = {
            components: propagationMod.components ?? {},
            ...baseProps
          };
        }
        return createHeadAndContent(
          unescapeHTML(styles + links + scripts),
          renderTemplate`${renderComponent(
            result,
            "Content",
            propagationMod.Content,
            props,
            slots
          )}`
        );
      },
      propagation: "self"
    });
    return {
      Content,
      headings: propagationMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: propagationMod.frontmatter ?? {}
    };
  } else if (baseMod.Content && typeof baseMod.Content === "function") {
    return {
      Content: baseMod.Content,
      headings: baseMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: baseMod.frontmatter ?? {}
    };
  } else {
    throw UnexpectedRenderError;
  }
}
function isPropagatedAssetsModule(module) {
  return typeof module === "object" && module != null && "__astroPropagation" in module;
}

// astro-head-inject

const liveCollections = {};

const getCollection = createGetCollection({
	liveCollections,
});

export { $$Portal as $, getCollection as g, renderEntry as r };
