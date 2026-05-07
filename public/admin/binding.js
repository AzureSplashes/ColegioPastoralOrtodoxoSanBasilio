/**
 * Decap form ↔ preview visual binding.
 *
 * Watches the form pane for hover/focus on fields belonging to a list collection
 * (e.g. "sections"), figures out which list-item index the cursor is on, and
 * postMessages the preview iframe so it can highlight the matching block.
 *
 * Pairs with the receiver in preview.js (look for the "message" listener).
 * Drop-in for any Decap project with a sections-style list field.
 *
 * Tweak CONFIG below per-project; everything else should work as-is.
 */

(function () {
  const CONFIG = {
    /** Name of the list field that contains the blocks Father is editing.
     *  Match this to your `name:` in config.yml — usually "sections" or "blocks". */
    sectionListFieldName: "sections",

    /** postMessage type. Receiver in preview.js listens for this exact string.
     *  Change only if you need to coexist with another postMessage protocol. */
    messageType: "cms-hover-section",

    /** Throttle for postMessage sends to avoid spam on rapid mouse moves. */
    throttleMs: 30,

    /** Section-aware sync scroll. When the form scrolls, find which list-item
     *  is most centered in the viewport and tell the preview to scroll to its
     *  matching block. Reverse direction also handled (preview → form). */
    syncScroll: true,

    /** How long to ignore our own scroll events after receiving a sync message —
     *  prevents the "form scrolls → preview scrolls → form scrolls" feedback loop. */
    syncSilenceMs: 350,
  };

  // ─── State ────────────────────────────────────────────────────────────────

  let lastSentPathKey = "__init__"; // serialized path for cheap comparison
  let throttleTimer = null;

  // ─── DOM helpers ──────────────────────────────────────────────────────────

  /**
   * Find the preview iframe by walking all iframes and checking each one's
   * document for our [data-section-index] markers (which preview.js's
   * PagePreview component renders). This identifies the preview pane
   * regardless of Decap's class names and distinguishes it from the Slate
   * markdown editor's iframe and the Netlify Identity modal.
   *
   * Once found, we inject preview-bridge.js into the iframe so it sets up
   * its own message listener and scroll detector. Idempotent — the bridge
   * script self-guards via a window flag.
   */
  function findPreviewIframe() {
    const iframes = document.querySelectorAll("iframe");
    for (const iframe of iframes) {
      try {
        const doc = iframe.contentDocument;
        if (!doc) continue;
        // Already bridged? Reuse it.
        if (iframe.contentWindow && iframe.contentWindow.__sanBasilioBridgeAttached) {
          return iframe;
        }
        // First-time detection: the preview tree contains our wrappers.
        if (doc.querySelector("[data-section-index]")) {
          injectPreviewBridge(iframe);
          return iframe;
        }
      } catch (_) {
        // Cross-origin iframe — skip.
      }
    }
    return null;
  }

  /** Inject preview-bridge.js into the iframe's document. */
  function injectPreviewBridge(iframe) {
    try {
      const doc = iframe.contentDocument;
      if (!doc) return;
      if (iframe.contentWindow.__sanBasilioBridgeAttached) return;
      const script = doc.createElement("script");
      script.src = "/admin/preview-bridge.js";
      script.async = false;
      doc.head.appendChild(script);
    } catch (e) {
      console.warn("[binding.js] Failed to inject preview-bridge:", e);
    }
  }

  /** Polling watcher: keep looking until we find the preview iframe.
   *  Re-runs every time the user navigates to a different entry, since
   *  Decap may tear down and remount the preview iframe. */
  function startPreviewWatcher() {
    setInterval(() => {
      findPreviewIframe();
    }, 1000);
  }

  /**
   * Walk up from `el` looking for a list-item ancestor that lives inside the
   * configured section list. Return its index among siblings of the same kind,
   * or -1 if not found.
   *
   * Decap renders list items with internal class names that vary by version
   * (ListControl-item, listControlItem, etc.). We use a wildcard match so we
   * don't break on minor releases.
   */
  const ITEM_SELECTOR =
    '[class*="listControlItem"], [class*="SortableListItem"], [class*="ListControl-item"], [data-testid*="list-item"]';

  /**
   * Walk up from `el` collecting the index of every list-item ancestor.
   * Returns the path from outermost-down: [5] for "section 5", [5, 1] for
   * "section 5 → list-item 1 inside it". Empty array if not inside any list.
   *
   * preview-bridge.js uses the path to find the most-specific
   * [data-section-path] marker in the preview iframe, falling back to the
   * top-level section if nested markers aren't tagged.
   */
  function findSectionPath(el) {
    if (!el || !(el instanceof Element)) return [];
    const path = [];
    let current = el;
    while (current && current !== document.body) {
      if (current.matches && current.matches(ITEM_SELECTOR)) {
        const parent = current.parentElement;
        if (parent) {
          const siblings = Array.from(parent.children).filter(
            (c) => c.matches && c.matches(ITEM_SELECTOR)
          );
          const idx = siblings.indexOf(current);
          if (idx >= 0) path.unshift(idx);
        }
      }
      current = current.parentElement;
    }
    return path;
  }

  // ─── postMessage emitter ──────────────────────────────────────────────────

  function send(path) {
    const key = path.length === 0 ? "__none__" : path.join(".");
    if (key === lastSentPathKey) return;
    if (throttleTimer) return;
    throttleTimer = setTimeout(() => {
      throttleTimer = null;
      const iframe = findPreviewIframe();
      if (!iframe || !iframe.contentWindow) return;
      iframe.contentWindow.postMessage(
        {
          type: CONFIG.messageType,
          // Top-level index for backward compat / sync-scroll. -1 = clear.
          index: path.length > 0 ? path[0] : -1,
          // Full nested path for granular highlighting.
          path: path,
        },
        "*"
      );
      lastSentPathKey = key;
    }, CONFIG.throttleMs);
  }

  // ─── Sync scroll: form → preview ──────────────────────────────────────────

  let formSilentUntil = 0;
  let formScrollContainer = null;
  let formScrollTimer = null;

  /** Walk up from `el` until we find an ancestor whose computed overflow-y is
   *  scrollable. That's the form pane. Falls back to the document scroll root. */
  function findScrollContainer(el) {
    let current = el;
    while (current && current !== document.body) {
      const style = getComputedStyle(current);
      if (/(auto|scroll)/.test(style.overflowY)) return current;
      current = current.parentElement;
    }
    return document.scrollingElement || document.documentElement;
  }

  /** Find which list-item is most centered in the form's viewport. Returns -1
   *  if no items rendered yet. */
  function findCenteredFormItem() {
    const items = Array.from(document.querySelectorAll(
      ITEM_SELECTOR
    ));
    if (items.length === 0) return -1;
    if (!formScrollContainer) formScrollContainer = findScrollContainer(items[0]);

    const containerRect = formScrollContainer.getBoundingClientRect
      ? formScrollContainer.getBoundingClientRect()
      : { top: 0, height: window.innerHeight };
    const center = containerRect.top + containerRect.height / 2;

    let bestIdx = -1;
    let bestDist = Infinity;
    items.forEach((item, i) => {
      const rect = item.getBoundingClientRect();
      const itemCenter = (rect.top + rect.bottom) / 2;
      const dist = Math.abs(itemCenter - center);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    });
    return bestIdx;
  }

  function onFormScroll() {
    if (!CONFIG.syncScroll) return;
    if (Date.now() < formSilentUntil) return;
    if (formScrollTimer) return;
    formScrollTimer = setTimeout(() => {
      formScrollTimer = null;
      const idx = findCenteredFormItem();
      if (idx < 0) return;
      const iframe = findPreviewIframe();
      if (!iframe || !iframe.contentWindow) return;
      iframe.contentWindow.postMessage(
        { type: "cms-sync-scroll", from: "form", index: idx },
        "*"
      );
    }, 50);
  }

  /** Listen for sync messages coming back from the preview iframe. */
  window.addEventListener("message", (e) => {
    if (!e.data || e.data.type !== "cms-sync-scroll") return;
    if (e.data.from !== "preview") return;

    const items = Array.from(document.querySelectorAll(
      ITEM_SELECTOR
    ));
    const target = items[e.data.index];
    if (!target) return;

    formSilentUntil = Date.now() + CONFIG.syncSilenceMs;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  // ─── Event wiring ─────────────────────────────────────────────────────────

  function onPointerMove(e) {
    send(findSectionPath(e.target));
  }

  function onPointerLeave() {
    send([]); // clear glow
  }

  // Attach lazily — Decap takes a moment to mount its DOM. We retry until the
  // form pane appears, then bind once.
  function attach() {
    const formRoot = document.querySelector(".nc-app, [class*='AppMainContainer'], #nc-root");
    if (!formRoot) {
      setTimeout(attach, 200);
      return;
    }
    formRoot.addEventListener("mouseover", onPointerMove, { passive: true });
    formRoot.addEventListener("focusin", onPointerMove, { passive: true });
    formRoot.addEventListener("mouseleave", onPointerLeave, { passive: true });

    // Sync scroll: attach scroll listener to whichever container actually scrolls.
    if (CONFIG.syncScroll) {
      const firstItem = document.querySelector(
        ITEM_SELECTOR
      );
      if (firstItem) {
        formScrollContainer = findScrollContainer(firstItem);
        formScrollContainer.addEventListener("scroll", onFormScroll, { passive: true });
      }
      // Window-level fallback in case the body itself is the scrolling element.
      window.addEventListener("scroll", onFormScroll, { passive: true });
    }

    // Preview iframe detection runs on a 1s poll because Decap creates and
    // destroys the iframe as the user navigates between entries.
    startPreviewWatcher();

    // Floating "Add" button — quick access to the Add control for whichever list
    // the user is currently editing in.
    attachFloatingAdd();

    console.log(
      `[binding.js] Hover-glow bound (list="${CONFIG.sectionListFieldName}", syncScroll=${CONFIG.syncScroll}).`
    );
  }

  // ─── Floating "+" button: jump-to-Add anywhere in the form ────────────────
  // Tracks the deepest list-item the user has clicked into (`activeSelection`).
  // When clicked, finds the matching Add control and scrolls + clicks it,
  // surfacing Decap's native template dropdown wherever Father is editing.

  let floatingAddBtn = null;
  let activeSelection = null;

  function attachFloatingAdd() {
    injectFloatingAddStyles();
    floatingAddBtn = buildFloatingAddButton();
    document.body.appendChild(floatingAddBtn);

    // Only show in entry-editor views. Hidden on login, dashboard, and
    // collection lists — where there's no top-level "Add sección" button to
    // scroll to anyway. Decap uses hash routing; watch for navigation.
    updateFloatingAddVisibility();
    window.addEventListener("hashchange", updateFloatingAddVisibility);
    // Decap also remounts the URL state via popstate during some transitions.
    window.addEventListener("popstate", updateFloatingAddVisibility);
  }

  /** True when the URL points to an entry editor (existing or new entry). */
  function isEditorView() {
    const hash = window.location.hash || "";
    return /\/(entries|new)\//.test(hash);
  }

  function updateFloatingAddVisibility() {
    if (!floatingAddBtn) return;
    floatingAddBtn.style.display = isEditorView() ? "flex" : "none";
  }

  function injectFloatingAddStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .cms-floating-add {
        position: fixed;
        left: 28px;
        top: 50%;
        transform: translateY(-50%);
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: rgba(59, 34, 94, 0.95);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 6px 22px rgba(59, 34, 94, 0.35);
        z-index: 9999;
        border: none;
        padding: 0;
        font-family: system-ui, -apple-system, sans-serif;
        transition: background 200ms, opacity 200ms, transform 200ms, box-shadow 200ms;
        user-select: none;
      }
      .cms-floating-add svg {
        display: block;
      }
      .cms-floating-add:hover {
        background: rgba(59, 34, 94, 1);
        transform: translateY(-50%) scale(1.06);
        box-shadow: 0 8px 28px rgba(59, 34, 94, 0.5);
      }
      .cms-floating-add[data-state="idle"] {
        opacity: 0.35;
        cursor: not-allowed;
        background: rgba(120, 120, 120, 0.85);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      .cms-floating-add[data-state="idle"]:hover {
        transform: translateY(-50%);
        background: rgba(120, 120, 120, 0.85);
      }
      .cms-floating-add-tooltip {
        position: absolute;
        left: 70px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.88);
        color: #fff;
        padding: 8px 14px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 400;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 200ms;
      }
      .cms-floating-add:hover .cms-floating-add-tooltip {
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  }

  function buildFloatingAddButton() {
    const btn = document.createElement("button");
    btn.className = "cms-floating-add";
    btn.setAttribute("data-state", "active");
    btn.setAttribute("type", "button");
    btn.setAttribute("aria-label", "Subir y añadir nueva sección");

    // Icon: up-arrow with a small "+" badge in the upper-right corner.
    // Semantic: "scroll up to the Add control."
    btn.innerHTML = `
      <svg viewBox="0 0 28 28" width="26" height="26" fill="none" stroke="currentColor"
           stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="11" y1="22" x2="11" y2="9"></line>
        <polyline points="5 15 11 9 17 15"></polyline>
        <circle cx="21" cy="9" r="5" fill="currentColor" stroke="none"></circle>
        <line x1="21" y1="6.5" x2="21" y2="11.5" stroke="white" stroke-width="1.6"></line>
        <line x1="18.5" y1="9" x2="23.5" y2="9" stroke="white" stroke-width="1.6"></line>
      </svg>
    `;

    const tooltip = document.createElement("span");
    tooltip.className = "cms-floating-add-tooltip";
    tooltip.textContent = "Subir y añadir sección";
    btn.appendChild(tooltip);
    btn.addEventListener("click", onFloatingAddClick);
    return btn;
  }

  /**
   * Walk up from a focused/clicked element to find the DEEPEST list-item
   * ancestor. That becomes our "active selection" — siblings of this item are
   * what the floating button will add new entries among.
   */
  function findDeepestListItemAncestor(el) {
    let current = el;
    while (current && current !== document.body) {
      if (current.matches && current.matches(ITEM_SELECTOR)) {
        return current;
      }
      current = current.parentElement;
    }
    return null;
  }

  function onFormFocusIn(e) {
    // Don't let our own button steal selection state.
    if (e.target && e.target.closest && e.target.closest(".cms-floating-add")) return;
    const found = findDeepestListItemAncestor(e.target);
    if (found) {
      activeSelection = found;
      updateFloatingAddState();
    }
  }

  function onFormClick(e) {
    if (e.target && e.target.closest && e.target.closest(".cms-floating-add")) return;
    const found = findDeepestListItemAncestor(e.target);
    if (found) {
      activeSelection = found;
      updateFloatingAddState();
    }
  }

  function updateFloatingAddState() {
    if (!floatingAddBtn) return;
    const tooltip = floatingAddBtn.querySelector(".cms-floating-add-tooltip");
    const valid = activeSelection && document.body.contains(activeSelection);
    if (valid) {
      floatingAddBtn.setAttribute("data-state", "active");
      if (tooltip) tooltip.textContent = "Añadir aquí";
    } else {
      floatingAddBtn.setAttribute("data-state", "idle");
      if (tooltip) tooltip.textContent = "Seleccione una sección primero";
      activeSelection = null;
    }
  }

  /**
   * Find the Decap "Add ..." button belonging to the same list as the active
   * selection — i.e., the button that adds a sibling.
   *
   * Decap renders each list as: a container, an items wrapper holding the
   * list-items, and an Add button as a sibling of the items wrapper. So we
   * walk: selection → items wrapper → list container → look for a button
   * inside but outside any list-item.
   */
  /**
   * Find the page-level "Add secciones de la página" dropdown trigger.
   * Always returns the same target regardless of selection — the floating
   * button is a remote control for adding new top-level sections from anywhere.
   *
   * Filtering by aria-haspopup="true" picks the typed-list dropdown trigger
   * specifically (a <span role="button"> in Decap), not nested Add buttons.
   */
  function findTopLevelAddButton() {
    const all = Array.from(document.querySelectorAll('button, [role="button"]'));
    return (
      all.find(
        (el) =>
          el.getAttribute("aria-haspopup") === "true" &&
          /add|añad/i.test(el.textContent || "")
      ) || null
    );
  }

  /** Activate a Decap control reliably. Two cases:
   *
   *  1. Dropdown trigger (aria-haspopup="true"): the menu opens on mousedown
   *     and a document-level click listener closes it. Firing the full
   *     sequence opens-then-closes; we fire ONLY mousedown.
   *
   *  2. Plain Add button (uniform list): standard onClick handler. Fire the
   *     full mousedown→mouseup→click sequence.
   */
  function fireRealClick(el) {
    if (!el) return;
    if (typeof el.focus === "function") {
      try { el.focus({ preventScroll: true }); } catch (_) { el.focus(); }
    }
    const opts = { bubbles: true, cancelable: true, view: window, button: 0, buttons: 1 };
    const isDropdown = el.getAttribute("aria-haspopup") === "true";

    if (isDropdown) {
      // mousedown alone — don't fire the closing click.
      el.dispatchEvent(new MouseEvent("mousedown", opts));
      return;
    }

    // Plain button: full click sequence.
    el.dispatchEvent(new MouseEvent("mousedown", opts));
    el.dispatchEvent(new MouseEvent("mouseup", opts));
    el.dispatchEvent(new MouseEvent("click", opts));
  }

  function onFloatingAddClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const targetBtn = findTopLevelAddButton();
    if (!targetBtn) {
      console.warn("[binding.js] Top-level Add button not found.");
      return;
    }
    targetBtn.scrollIntoView({ behavior: "smooth", block: "center" });
    // After the scroll settles, focus + pulse the button so it's visually
    // obvious where to click. Decap's dropdown is unreliable to activate
    // synthetically, so we defer the click to the user.
    setTimeout(() => {
      try { targetBtn.focus({ preventScroll: true }); } catch (_) {}
      pulseElement(targetBtn);
    }, 400);
  }

  /** Brief visual highlight to draw the eye to the just-scrolled-to button. */
  function pulseElement(el) {
    const original = el.style.boxShadow || "";
    el.style.transition = "box-shadow 250ms ease";
    el.style.boxShadow = "0 0 0 4px rgba(59, 34, 94, 0.6), 0 0 24px rgba(59, 34, 94, 0.4)";
    setTimeout(() => {
      el.style.boxShadow = original;
    }, 1200);
  }

  // ─── Dashboard hover preview ──────────────────────────────────────────────
  // On the collection list view, hovering an entry row pops a small iframe
  // showing the live page so Father can identify it visually before clicking in.

  let rowPreviewEl = null;
  let rowPreviewTimer = null;
  let lastPreviewSlug = null;

  function isDashboardView() {
    const hash = window.location.hash || "";
    return /^#\/collections\/[^/]+\/?$/.test(hash);
  }

  /** Map of collection name → URL prefix for live-page preview. The clases/
   *  tareas/recursos routes are behind /alumnos/ auth — the iframe will show
   *  the login page if the editor isn't logged into the portal in the same
   *  browser. Father may see a redirect/404; that's an acceptable trade-off
   *  since the alternative is no preview. */
  const PREVIEWABLE_COLLECTIONS = {
    publicPages: "",
    homepage: "",
    avisos: "avisos/",
    clases: "alumnos/clases/",
    tareas: "alumnos/tareas/",
    recursos: "alumnos/recursos/",
  };

  function currentCollectionName() {
    const m = (window.location.hash || "").match(/^#\/collections\/([^/]+)/);
    return m ? m[1] : null;
  }

  function getSlugFromAnchor(a) {
    const href = a.getAttribute("href") || "";
    const m = href.match(/\/entries\/(.+?)(?:[/?#]|$)/);
    return m ? m[1] : null;
  }

  function ensureRowPreviewElement() {
    if (rowPreviewEl) return rowPreviewEl;
    rowPreviewEl = document.createElement("div");
    rowPreviewEl.className = "cms-row-preview";
    rowPreviewEl.innerHTML = `
      <div class="cms-row-preview-frame">
        <iframe sandbox="allow-same-origin allow-scripts" loading="lazy"></iframe>
      </div>
      <div class="cms-row-preview-label">Vista previa</div>
    `;
    document.body.appendChild(rowPreviewEl);
    return rowPreviewEl;
  }

  function injectRowPreviewStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .cms-row-preview {
        position: fixed;
        width: 420px;
        height: 520px;
        background: #fff;
        border: 1px solid rgba(59, 34, 94, 0.2);
        border-radius: 8px;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
        overflow: hidden;
        z-index: 9998;
        display: none;
        opacity: 0;
        transition: opacity 180ms ease;
        pointer-events: none;
      }
      .cms-row-preview.visible {
        display: block;
        opacity: 1;
      }
      .cms-row-preview-frame {
        width: 100%;
        height: calc(100% - 28px);
        overflow: hidden;
        background: #f4f2eb;
      }
      .cms-row-preview-frame iframe {
        width: 1280px;
        height: 1600px;
        border: none;
        transform: scale(0.328);   /* 420/1280 */
        transform-origin: top left;
        background: #fff;
      }
      .cms-row-preview-label {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 28px;
        line-height: 28px;
        text-align: center;
        font-size: 12px;
        font-family: system-ui, -apple-system, sans-serif;
        background: rgba(59, 34, 94, 0.92);
        color: #fff;
        font-weight: 500;
      }
    `;
    document.head.appendChild(style);
  }

  function positionRowPreview(el, sourceRect) {
    // Place to the right of the hovered row by default; flip to left if the
    // right side would clip the viewport.
    const margin = 16;
    const w = el.offsetWidth || 420;
    const h = el.offsetHeight || 520;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let left = sourceRect.right + margin;
    if (left + w > vw - margin) left = sourceRect.left - w - margin;
    if (left < margin) left = margin;
    let top = sourceRect.top + sourceRect.height / 2 - h / 2;
    if (top < margin) top = margin;
    if (top + h > vh - margin) top = vh - h - margin;
    el.style.left = left + "px";
    el.style.top = top + "px";
  }

  function showRowPreview(anchor) {
    const slug = getSlugFromAnchor(anchor);
    if (!slug) return;
    const collection = currentCollectionName();
    if (!(collection in PREVIEWABLE_COLLECTIONS)) return;
    const prefix = PREVIEWABLE_COLLECTIONS[collection];
    const url = `/${prefix}${slug}/`;
    const cacheKey = url;
    if (cacheKey === lastPreviewSlug && rowPreviewEl?.classList.contains("visible")) return;
    const el = ensureRowPreviewElement();
    const iframe = el.querySelector("iframe");
    if (cacheKey !== lastPreviewSlug) {
      iframe.src = url;
      lastPreviewSlug = cacheKey;
    }
    positionRowPreview(el, anchor.getBoundingClientRect());
    el.classList.add("visible");
  }

  function hideRowPreview() {
    if (!rowPreviewEl) return;
    rowPreviewEl.classList.remove("visible");
  }

  function onDashboardMouseOver(e) {
    if (!isDashboardView()) {
      hideRowPreview();
      return;
    }
    if (!(currentCollectionName() in PREVIEWABLE_COLLECTIONS)) return;
    const anchor = e.target.closest('a[href*="/entries/"]');
    if (!anchor) return;
    if (rowPreviewTimer) clearTimeout(rowPreviewTimer);
    rowPreviewTimer = setTimeout(() => showRowPreview(anchor), 180);
  }

  function onDashboardMouseOut(e) {
    if (e.target.closest('a[href*="/entries/"]')) {
      if (rowPreviewTimer) clearTimeout(rowPreviewTimer);
      rowPreviewTimer = setTimeout(hideRowPreview, 150);
    }
  }

  function attachDashboardPreview() {
    injectRowPreviewStyles();
    document.addEventListener("mouseover", onDashboardMouseOver, { passive: true });
    document.addEventListener("mouseout", onDashboardMouseOut, { passive: true });
    window.addEventListener("hashchange", () => {
      if (!isDashboardView()) hideRowPreview();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      attach();
      attachDashboardPreview();
    });
  } else {
    attach();
    attachDashboardPreview();
  }
})();
