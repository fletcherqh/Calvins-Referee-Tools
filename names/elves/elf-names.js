// names/elves/elf-names.js
(function (g) {
  function pick(a){ return a[Math.floor(Math.random()*a.length)]; }

  const api = {
    feminineName: () => pick((g.elfNames && g.elfNames.feminine) || ["Elaria"]),
    masculineName: () => pick((g.elfNames && g.elfNames.masculine) || ["Aelar"]),
    neutralName:   () => pick((g.elfNames && g.elfNames.neutral)   || ["Ash"]),
  };

  g.elfNames = Object.assign({}, g.elfNames, api);
})(window);
