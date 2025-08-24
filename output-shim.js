/**
 * output-shim.js — ensures appending/prepending behavior across pages.
 * Include this BEFORE odd-mobs.js and other button scripts.
 */
(function () {
  function appendLine(text) {
    if (typeof window.output === 'function') { window.output(text); return; }
    var el = document.getElementById('output-log') || document.getElementById('output');
    if (el) {
      var prev = el.textContent || '';
      el.textContent = text + (prev ? '\n' + prev : '');
    } else {
      console.log(text);
    }
  }
  window.outputResult = appendLine;
})();