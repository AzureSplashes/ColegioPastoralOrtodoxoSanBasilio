/**
 * Decap CMS preview templates — render each block type using the live site CSS.
 *
 * Loaded after decap-cms.js + marked in src/pages/admin/index.astro.
 * The site stylesheet is mirrored to /styles/style.css and pulled into the
 * preview iframe via registerPreviewStyle, so the same CSS classes used by
 * BlockRenderer.astro produce the same visuals here.
 *
 * Adding a new block type:
 *   1. Add a render<Name>(block) function below
 *   2. Add a case to renderBlock's switch
 *
 * Decap exposes preact-style createElement on window.h.
 */

function bootPreviewTemplates() {
  if (typeof CMS === "undefined" || typeof CMS.registerPreviewTemplate !== "function") {
    setTimeout(bootPreviewTemplates, 100);
    return;
  }

  CMS.registerPreviewStyle("/styles/style.css");
  CMS.registerPreviewStyle("/admin/cms-preview-glow.css");

  // The cross-iframe bridge (message listeners, scroll detection) is set up
  // inside the preview iframe by /admin/preview-bridge.js, which is injected
  // by /admin/binding.js when it detects the preview pane. We don't try to
  // attach listeners from this parent-window script — they'd land on the
  // wrong window and never fire.

  const h = window.h || (typeof React !== "undefined" ? React.createElement : null);
  if (!h) {
    console.error("[preview.js] No createElement available (h or React).");
    return;
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const buttonClass = (style) => {
    if (style === "outline") return "btn btn-outline";
    if (style === "link") return "card-link";
    return "btn btn-primary";
  };

  const imageStyle = (src = {}) => {
    const fit = src.imageFit;
    const pos = src.imagePosition || src.imageAnchor;
    const out = {};
    if (fit) out.objectFit = fit;
    if (pos) out.objectPosition = pos;
    return Object.keys(out).length > 0 ? out : undefined;
  };

  const overlayColor = (preset) => {
    switch (preset) {
      case "purple-soft":   return "rgba(59, 34, 94, 0.45)";
      case "purple-strong": return "rgba(59, 34, 94, 0.7)";
      case "gold-soft":     return "rgba(197, 160, 72, 0.4)";
      case "dark-soft":     return "rgba(0, 0, 0, 0.35)";
      case "dark-strong":   return "rgba(0, 0, 0, 0.6)";
      default:              return null;
    }
  };

  const renderMarkdown = (md) => {
    if (!md) return "";
    if (window.marked && typeof window.marked.parse === "function") {
      return window.marked.parse(md);
    }
    return md; // Fallback: marked not loaded yet, just dump raw text.
  };

  // ─── Block renderers ────────────────────────────────────────────────────────

  function renderHero(block, sectionIdx) {
    const overlay = overlayColor(block.backgroundOverlay);
    const overlayLayer = overlay ? `linear-gradient(${overlay}, ${overlay}), ` : "";
    const heroStyle = block.backgroundImage
      ? {
          backgroundImage: `${overlayLayer}url('${block.backgroundImage}')`,
          backgroundPosition: block.backgroundPosition || undefined,
        }
      : null;

    return h("section", { className: "hero", style: heroStyle },
      h("div", { className: "container" },
        h("div", { className: "hero-content" }, [
          h("h1", { key: "t", className: "hero-title" }, block.title || ""),
          block.subtitle && h("p", { key: "s", className: "hero-subtitle" }, block.subtitle),
          (block.buttons || []).length > 0 && h("div", { key: "b", className: "hero-btns" },
            block.buttons.map((btn, i) =>
              h(
                "span",
                {
                  key: i,
                  "data-section-path": sectionIdx != null ? `${sectionIdx}.${i}` : undefined,
                  style: { display: "inline-block" },
                },
                h("a", { href: btn.href || "#", className: buttonClass(btn.style) }, btn.label || "")
              )
            )
          ),
        ])
      )
    );
  }

  function renderSectionHeader(block) {
    return h("section", { className: "section" },
      h("div", { className: "container" },
        h("div", { className: "section-header" }, [
          h("h1", { key: "t", className: "section-title" }, block.title || ""),
          block.text && h("p", { key: "p" }, block.text),
        ])
      )
    );
  }

  function renderFeatureBar(block, sectionIdx) {
    return h("section", { className: "features-bar" },
      h("div", { className: "container" },
        h("div", { className: "features-grid" },
          (block.items || []).map((item, i) =>
            h("div", {
              key: i,
              className: "feature-item",
              "data-section-path": sectionIdx != null ? `${sectionIdx}.${i}` : undefined,
            }, [
              h("div", { key: "ic", className: "feature-icon" },
                h("i", { "data-lucide": item.icon || "circle" })
              ),
              h("div", { key: "tx", className: "feature-text" }, [
                h("h4", { key: "h" }, item.title || ""),
                h("p", { key: "p" }, item.text || ""),
              ]),
            ])
          )
        )
      )
    );
  }

  function renderCards(block, sectionIdx) {
    const items = block.items || [];
    const isInst = items.some((i) => i.variant === "institutional");
    const tint = block.backgroundTint
      ? "linear-gradient(rgba(244,242,235,0.85), rgba(244,242,235,0.85)), "
      : "";
    const sectionStyle = block.backgroundImage
      ? { backgroundImage: `${tint}url('${block.backgroundImage}')` }
      : null;

    return h(
      "section",
      {
        className: "section" + (block.backgroundImage ? " cms-image-band" : ""),
        style: sectionStyle,
      },
      h("div", { className: "container" },
        h("div", { className: isInst ? "institutional-grid" : "cards-grid" },
          items.map((item, i) => {
            const path = sectionIdx != null ? `${sectionIdx}.${i}` : undefined;
            return item.variant === "institutional"
              ? h("a", {
                  key: i, href: item.href || "#", className: "institutional-block",
                  "data-section-path": path,
                },
                  h("div", { className: "institutional-content" },
                    h("h3", { className: "institutional-title" }, item.title || "")
                  )
                )
              : h("div", { key: i, className: "card", "data-section-path": path }, [
                  item.image && h("img", {
                    key: "img",
                    src: item.image,
                    alt: item.title || "",
                    className: "card-img",
                    style: imageStyle(item),
                  }),
                  item.icon && !item.image && h("div", { key: "ic", className: "card-icon" },
                    h("i", { "data-lucide": item.icon })
                  ),
                  h("h3", { key: "t", className: "card-title" }, item.title || ""),
                  item.text && h("p", { key: "tx", className: "card-desc" }, item.text),
                  item.href && h("a", { key: "ln", href: item.href, className: "card-link" },
                    (item.linkLabel || "Ver más") + " →"
                  ),
                ]);
          })
        )
      )
    );
  }

  function renderText(block) {
    const widthClass =
      ({ narrow: "cms-width-narrow", normal: "cms-width-normal", wide: "cms-width-wide" }[
        block.maxWidth
      ]) || "cms-width-normal";
    return h("section", { className: "section" },
      h("div", { className: "container" },
        h(
          "div",
          {
            className: `cms-rich-text ${widthClass} align-${block.align || "left"}`,
          },
          [
            block.heading && h("h2", { key: "h" }, block.heading),
            h("div", {
              key: "b",
              dangerouslySetInnerHTML: { __html: renderMarkdown(block.body) },
            }),
          ]
        )
      )
    );
  }

  function renderTextImage(block) {
    return h("section", { className: "section" },
      h("div", { className: "container" },
        h(
          "div",
          {
            className: "cms-text-image" + (block.imagePosition === "left" ? " reverse" : ""),
          },
          [
            h("div", { key: "txt" }, [
              block.heading && h("h2", { key: "h" }, block.heading),
              h("div", {
                key: "b",
                dangerouslySetInnerHTML: { __html: renderMarkdown(block.body) },
              }),
              (block.buttons || []).length > 0 && h(
                "div",
                { key: "btns", className: "cms-buttons" },
                block.buttons.map((btn, i) =>
                  h("a", { key: i, href: btn.href || "#", className: buttonClass(btn.style) }, btn.label || "")
                )
              ),
            ]),
            block.image && h("img", {
              key: "img",
              src: block.image,
              alt: block.imageAlt || "",
              style: imageStyle({ imageFit: block.imageFit, imagePosition: block.imageAnchor }),
            }),
          ]
        )
      )
    );
  }

  function renderGallery(block, sectionIdx) {
    return h("section", { className: "section" },
      h("div", { className: "container" }, [
        block.title && h("h2", { key: "t", className: "gallery-title" }, block.title),
        h("div", { key: "g", className: "gallery-grid" },
          (block.images || []).map((item, i) =>
            h("div", {
              key: i,
              "data-section-path": sectionIdx != null ? `${sectionIdx}.${i}` : undefined,
            },
              h("img", {
                src: item.image,
                alt: item.alt || "",
                className: "gallery-img",
                style: imageStyle(item),
              })
            )
          )
        ),
      ])
    );
  }

  function renderResourceList(block, sectionIdx) {
    return h("section", { className: "section" },
      h("div", { className: "container" },
        h("div", { className: "resource-list" },
          (block.items || []).map((item, i) =>
            h("div", {
              key: i,
              className: "resource-item",
              "data-section-path": sectionIdx != null ? `${sectionIdx}.${i}` : undefined,
            }, [
              h("h3", { key: "t" }, item.title || ""),
              item.description && h("p", { key: "d" }, item.description),
              item.href && h("a", { key: "l", href: item.href }, "Abrir"),
            ])
          )
        )
      )
    );
  }

  function renderStaffList(block, sectionIdx) {
    const director = block.director;
    const shape = block.photoShape || "rectangle";
    return h(
      "section",
      {
        className: `section staff-section shape-${shape}`,
        style: { backgroundColor: "var(--color-bg-secondary)", paddingTop: "2rem" },
      },
      h("div", { className: "container" }, [
        director && h("div", { key: "dir", className: "director-card" }, [
          director.image && h("img", {
            key: "img",
            src: director.image,
            alt: director.name || "",
            className: "director-photo",
            style: imageStyle(director),
          }),
          h("div", { key: "r", className: "staff-role" }, director.role || ""),
          h("h2", { key: "n" }, director.name || ""),
          director.description && h("p", { key: "d" }, director.description),
        ]),
        h("div", { key: "g", className: "staff-grid" },
          (block.people || []).map((person, i) =>
            h("div", {
              key: i,
              className: "staff-card",
              "data-section-path": sectionIdx != null ? `${sectionIdx}.${i}` : undefined,
            }, [
              person.image && h("img", {
                key: "img",
                src: person.image,
                alt: person.name || "",
                className: "staff-photo",
                style: imageStyle(person),
              }),
              h("div", { key: "info", className: "staff-info" }, [
                h("div", { key: "r", className: "staff-role" }, person.role || ""),
                h("h3", { key: "n", className: "staff-name" }, person.name || ""),
                (person.subjects || []).length > 0 && h(
                  "div",
                  { key: "s", className: "staff-subjects" },
                  person.subjects.map((subj, j) =>
                    h("span", { key: j, className: "subject-tag" },
                      typeof subj === "string" ? subj : subj.subject || ""
                    )
                  )
                ),
              ]),
            ])
          )
        ),
      ])
    );
  }

  function renderContact(block, sectionIdx) {
    return h("section", { className: "section" },
      h("div", { className: "container" },
        h("div", { className: "contact-grid" }, [
          h("div", { key: "info", className: "contact-info-card" }, [
            h("h3", { key: "t" }, "Información de Contacto"),
            block.intro && h("p", {
              key: "i",
              style: { marginBottom: "2rem", opacity: 0.8 },
            }, block.intro),
            ...(block.items || []).map((item, i) =>
              h("div", {
                key: "item-" + i,
                className: "info-item",
                "data-section-path": sectionIdx != null ? `${sectionIdx}.${i}` : undefined,
              }, [
                h("i", { key: "ic", "data-lucide": item.icon || "info" }),
                h("div", { key: "d" }, [
                  h("h4", { key: "h" }, item.title || ""),
                  ...(item.lines || []).map((line, j) =>
                    h("p", { key: j }, typeof line === "string" ? line : line.line || "")
                  ),
                ]),
              ])
            ),
          ]),
          block.showForm && h("div", {
            key: "form",
            className: "contact-form",
            style: { padding: "2rem", border: "1px dashed #999", borderRadius: "6px", fontStyle: "italic", opacity: 0.7 },
          }, "[Formulario de contacto se mostrará aquí en la página publicada]"),
        ])
      )
    );
  }

  // ─── Dispatcher ─────────────────────────────────────────────────────────────

  function renderBlock(block, sectionIdx) {
    if (!block || !block.type) return null;
    switch (block.type) {
      case "hero":          return renderHero(block, sectionIdx);
      case "section_header": return renderSectionHeader(block);
      case "feature_bar":   return renderFeatureBar(block, sectionIdx);
      case "cards":         return renderCards(block, sectionIdx);
      case "text":          return renderText(block);
      case "text_image":    return renderTextImage(block);
      case "gallery":       return renderGallery(block, sectionIdx);
      case "resource_list": return renderResourceList(block, sectionIdx);
      case "staff_list":    return renderStaffList(block, sectionIdx);
      case "contact":       return renderContact(block, sectionIdx);
      default:
        return h("div", {
          style: {
            padding: "1.5rem",
            margin: "1rem 0",
            background: "#f4f2eb",
            border: "1px dashed #999",
            borderRadius: "6px",
            fontFamily: "monospace",
            fontSize: "0.85rem",
          },
        }, [
          h("strong", { key: "t" }, `[${block.type}]`),
          h("div", { key: "n", style: { marginTop: "0.5rem", opacity: 0.7 } },
            "Tipo de bloque sin renderizador. Edición funciona normalmente."
          ),
        ]);
    }
  }

  // ─── Page-level preview ─────────────────────────────────────────────────────

  /** Friendly Spanish names for the corner badge that appears on glow. */
  const blockLabels = {
    hero: "Portada principal",
    section_header: "Encabezado de sección",
    feature_bar: "Barra de beneficios",
    cards: "Tarjetas",
    text: "Texto",
    text_image: "Texto con imagen",
    gallery: "Galería",
    resource_list: "Lista de documentos",
    staff_list: "Autoridades y profesores",
    contact: "Contacto",
  };

  const PagePreview = function (props) {
    try {
      const data = props.entry.get("data").toJS();
      const sections = Array.isArray(data.sections) ? data.sections : [];
      if (sections.length === 0) {
        return h("div", { className: "cms-preview-root" },
          h("div", {
            style: { padding: "3rem 2rem", textAlign: "center", color: "#888", fontStyle: "italic" },
          }, "Esta página aún no tiene secciones. Use 'Add secciones de la página' para añadir bloques.")
        );
      }
      return h(
        "div",
        { className: "cms-preview-root" },
        sections.map((section, i) =>
          h(
            "div",
            {
              key: i,
              "data-section-index": i,
              "data-section-path": String(i),
              "data-section-label": blockLabels[section.type] || section.type,
            },
            renderBlock(section, i)
          )
        )
      );
    } catch (err) {
      console.error("[preview.js] PagePreview render failed:", err);
      return h("div", {
        style: { padding: "2rem", color: "#a00", fontFamily: "monospace", fontSize: "12px" },
      }, "Error al renderizar la vista previa: " + (err && err.message ? err.message : String(err)));
    }
  };

  // Register for both collection names and known file names within files:
  // collections, since Decap's lookup behavior differs between folder and
  // files collections in some versions.
  CMS.registerPreviewTemplate("publicPages", PagePreview);
  CMS.registerPreviewTemplate("homepage", PagePreview);
  CMS.registerPreviewTemplate("inicio", PagePreview); // file name within homepage

  // ─── Generic content-entry preview ──────────────────────────────────────────
  // Renders avisos, clases, tareas, recursos with their CSS — title, optional
  // date/category, optional intro, optional image, then the markdown body.
  // Each collection has slightly different fields; we read whatever's present.

  function formatDate(value) {
    if (!value) return "";
    try {
      const d = new Date(value);
      return d.toLocaleDateString("es-MX", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (_) {
      return String(value);
    }
  }

  const ContentEntryPreview = function (props) {
    const data = props.entry.get("data").toJS();
    const date = data.date || data.dueDate;
    const subtitleParts = [];
    if (date) subtitleParts.push(formatDate(date));
    if (data.category) subtitleParts.push(data.category);

    return h("div", { className: "cms-preview-root" },
      h("article", {
        className: "section",
        style: { paddingTop: "3rem", paddingBottom: "3rem", maxWidth: "780px", margin: "0 auto" },
      }, [
        h("div", { key: "container", className: "container" }, [
          h("h1", { key: "t", style: { marginBottom: "0.5rem" } }, data.title || ""),
          subtitleParts.length > 0 && h("p", {
            key: "sub",
            style: { color: "var(--color-text-light)", fontStyle: "italic", marginBottom: "1.5rem" },
          }, subtitleParts.join(" · ")),
          data.image && h("img", {
            key: "img",
            src: data.image,
            alt: data.title || "",
            style: { width: "100%", maxHeight: "320px", objectFit: "cover", borderRadius: "8px", marginBottom: "1.5rem" },
          }),
          data.description && h("p", {
            key: "desc",
            style: { fontSize: "1.05rem", marginBottom: "1.5rem", color: "var(--color-text-light)" },
          }, data.description),
          data.link && h("p", { key: "link" },
            h("a", { href: data.link, style: { color: "var(--color-primary)" } }, data.link)
          ),
          data.body && h("div", {
            key: "body",
            className: "cms-rich-text cms-width-normal",
            dangerouslySetInnerHTML: { __html: renderMarkdown(data.body) },
          }),
        ]),
      ])
    );
  };

  CMS.registerPreviewTemplate("avisos", ContentEntryPreview);
  CMS.registerPreviewTemplate("clases", ContentEntryPreview);
  CMS.registerPreviewTemplate("tareas", ContentEntryPreview);
  CMS.registerPreviewTemplate("recursos", ContentEntryPreview);

  console.log("[preview.js] Decap preview templates registered (10 block types).");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootPreviewTemplates);
} else {
  bootPreviewTemplates();
}
