/**
 * Optional binding helper (inert by default).
 * Use bindIfPresent('thiefBtn', NPC.generateThief) to attach without breaking inline handlers.
 * This file does NOT auto-bind anything; it's here to keep load order consistent and available.
 */
(function (global) {
  function byId(id) { return document.getElementById(id); }

  function bindIfPresent(id, fn) {
    const el = byId(id);
    if (!el) return false;
    if (typeof fn !== "function") {
      console.warn("bindIfPresent: function missing for", id);
      return false;
    }
    // Attach without removing existing inline handlers; use addEventListener
    el.addEventListener("click", function (e) {
      try {
        const out = fn();
        // If fn returns a string, append it; otherwise assume fn handled output
        if (typeof out === "string") {
          (global.appendLine || console.log)(out);
        }
      } catch (err) {
        console.error("Error running handler for #" + id + ":", err);
      }
    });
    return true;
  }

  global.Bindings = { bindIfPresent };
})(window);
