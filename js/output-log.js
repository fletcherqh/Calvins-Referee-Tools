/**
 * Output Log helper (append-only with blank-line spacer).
 * Non-destructive and GUI-preserving.
 * 
 * Usage:
 *   appendLine("Your text");
 *   appendLine("No extra spacer", { spacer: false });
 */
(function (global) {
  function getOutputElement() {
    // Prefer a <pre> inside #output, else #output, else any [data-output-log]
    return (
      document.querySelector("#output pre") ||
      document.querySelector("#output") ||
      document.querySelector("[data-output-log]")
    );
  }

  function normalizeText(s) {
    // Ensure it's a string and trim trailing spaces (not newlines)
    return (s == null ? "" : String(s)).replace(/[ \t]+$/g, "");
  }

  function appendLine(text, opts) {
    const el = getOutputElement();
    if (!el) {
      console.warn("appendLine: No output element found (#output or [data-output-log]).");
      return;
    }
    const spacer = (opts && typeof opts.spacer === "boolean") ? opts.spacer : true;
    const line = normalizeText(text);

    // Get current text (works for both <pre> and <div>)
    const current = el.textContent || "";
    const nl = spacer ? "\n\n" : "\n";
    const next = current ? (current + nl + line) : line;

    el.textContent = next;
  }

  // Expose a safe global
  global.appendLine = appendLine;
  global.OutputLog = { appendLine };
})(window);
