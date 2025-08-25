/* Output Log override: newest-at-top + guaranteed blank line.
   Safe to include after the existing output() is defined. */
(function () {
  function el() { return document.getElementById("output-log"); }
  window.output = function (stuff) {
    var box = el(); if (!box) return;
    var current = box.textContent || "";
    var line = (stuff == null ? "" : String(stuff)).replace(/[ \t]+$/g, "");
    box.textContent = current ? (line + "\n\n" + current) : line;
  };
})();
