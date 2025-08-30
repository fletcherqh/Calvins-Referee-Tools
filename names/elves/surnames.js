// names/elves/surnames.js
(function (g) {
  function pick(a){ return a[Math.floor(Math.random()*a.length)]; }

  // Prefixes (de-dashed, TitleCase)
  const P = [
    "Dazzle","Star","Sky","Forest","Green","Grey","Glade","Grove","Silver","Sylvan",
    "Sea","Tree","Alder","Elder","Meadow","Moon","Wood","Wander","Wonder","Weird"
  ];

  // Suffixes (de-dashed, lower-case)
  const S = [
    "dust","haze","brook","river","windle","mist","drop","dew","blade","searcher",
    "gazer","way","walker","strider","leaper","flight","hunter","bender","mind"
  ];

  function surname() { return pick(P) + pick(S); }

  // attach to same namespace we’re using for first names
  g.elfNames = Object.assign({}, g.elfNames, { surname });
  // optional: expose lists for inspection
  g.elfSurnameParts = { prefixes: P, suffixes: S };
})(window);
