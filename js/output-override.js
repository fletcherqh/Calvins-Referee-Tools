/* Output Log override v1.1: newest-at-top + exactly one blank line between entries.
   This prevents double spacing if a button already adds a newline. */
(function () {
  function el() { return document.getElementById("output-log"); }
  function rtrimNewlines(s){ return String(s).replace(/[\r\n]+$/g, ""); }
  function ltrimNewlines(s){ return String(s).replace(/^[\r\n]+/g, ""); }
  window.output = function (stuff) {
    var box = el(); if (!box) return;
    var current = box.textContent || "";
    var line = (stuff == null ? "" : String(stuff)).replace(/[ \t]+$/g, "");
    line = rtrimNewlines(line);
    current = ltrimNewlines(current);
    box.textContent = current ? (line + "\n\n" + current) : line;
  };
})();
