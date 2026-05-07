/**
 * Iframe-side bridge for the Decap preview pane.
 *
 * Injected into the preview iframe by /admin/binding.js once it identifies
 * the iframe (by detecting [data-section-index] elements inside its document).
 *
 * Sets up:
 *   - Marker so binding.js can re-find this iframe on subsequent operations
 *   - Message listener for cms-hover-section + cms-sync-scroll {from:"form"}
 *   - Scroll detector that emits cms-sync-scroll {from:"preview"}
 *
 * Re-injection is idempotent — a flag on the iframe's window prevents double
 * setup if binding.js polls and re-injects.
 */
(function () {
  if (window.__sanBasilioBridgeAttached) return;
  window.__sanBasilioBridgeAttached = true;
  window.__sanBasilioCmsPreview = true;

  const SILENCE_MS = 250;
  let silentUntil = 0;
  let lastEmittedIdx = -1; // hysteresis: only emit when the centered section *changes*

  // ─── Inbound: parent → preview ─────────────────────────────────────────────
  window.addEventListener("message", (e) => {
    if (!e.data) return;

    if (e.data.type === "cms-hover-section") {
      document.querySelectorAll(".cms-hover-glow").forEach((el) =>
        el.classList.remove("cms-hover-glow")
      );
      // Path-aware: try the most-specific marker first ("5.1.0"), then peel
      // segments off until something matches ("5.1", then "5"). This lets us
      // glow a person card when hovering deep, and the whole staff section
      // when hovering its top-level field.
      const path = Array.isArray(e.data.path) ? e.data.path.slice() : [];
      // Back-compat: if no path, fall back to the legacy single index.
      if (path.length === 0 && typeof e.data.index === "number" && e.data.index >= 0) {
        path.push(e.data.index);
      }
      while (path.length > 0) {
        const key = path.join(".");
        const target =
          document.querySelector(`[data-section-path="${key}"]`) ||
          (path.length === 1
            ? document.querySelector(`[data-section-index="${key}"]`)
            : null);
        if (target) {
          target.classList.add("cms-hover-glow");
          break;
        }
        path.pop();
      }
      return;
    }

    if (e.data.type === "cms-sync-scroll" && e.data.from === "form") {
      const target = document.querySelector(`[data-section-index="${e.data.index}"]`);
      if (!target) return;
      silentUntil = Date.now() + SILENCE_MS;
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
  });

  // ─── Outbound: preview scroll → parent follows ─────────────────────────────
  let scrollTimer = null;
  function onScroll() {
    if (Date.now() < silentUntil) return;
    if (scrollTimer) return;
    scrollTimer = setTimeout(() => {
      scrollTimer = null;
      const wrappers = Array.from(document.querySelectorAll("[data-section-index]"));
      if (wrappers.length === 0) return;
      const center = window.innerHeight / 2;
      let bestIdx = -1;
      let bestDist = Infinity;
      wrappers.forEach((w) => {
        const rect = w.getBoundingClientRect();
        const wCenter = (rect.top + rect.bottom) / 2;
        const dist = Math.abs(wCenter - center);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = parseInt(w.getAttribute("data-section-index"), 10);
        }
      });
      if (bestIdx < 0 || !window.parent) return;
      if (bestIdx === lastEmittedIdx) return;
      lastEmittedIdx = bestIdx;
      window.parent.postMessage(
        { type: "cms-sync-scroll", from: "preview", index: bestIdx },
        "*"
      );
    }, 80);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("scroll", onScroll, { passive: true, capture: true });

  console.log("[preview-bridge.js] Bridge attached inside preview iframe.");
})();
