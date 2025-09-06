/* Calvin Wargaming · Exile v1.0 */
;(function (global) {
  // ----- Tables -----
  var PLANETS = [
    "The Sun","The Moon","Mercury","Cytheria","Mars",
    "Jupiter","Saturn","Planet Eris","The Forbidden Planet","Planet X"
  ];

  var PLANES = [
    "The Prime Material Plane","The Ethereal Plane","The Plane of Fire",
    "The Plane of Air","The Plane of Water","The Plane of Earth",
    "The Sphere of the Fixed Stars (“Astral Plane”)","The Primum Mobile"
  ];

  var AFTERLIFE = [
    "Hell","Hades","Elysian Fields","Purgatory","the Fabled City of Brass",
    "Tartarus","the Abyss"
  ];

  // Utility: lowercase leading "The " -> "the "
  function downcaseLeadingThe(s) {
    return s.startsWith("The ") ? ("the " + s.slice(4)) : s;
  }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  // Equal odds across the four branches
  function exileTable() {
    var idx = Math.floor(Math.random() * 4); // 0..3
    if (idx === 0) return downcaseLeadingThe(pick(PLANETS));
    if (idx === 1) return downcaseLeadingThe(pick(PLANES));
    if (idx === 2) return downcaseLeadingThe(pick(AFTERLIFE));
    // Direction branch: "the [direction] 1,000 miles"
    var dir = (typeof global.randomDirection8 === "function")
      ? global.randomDirection8()
      : "the North";
    return dir + " 1,000 miles";
  }

function randomExile() {
  return "Exiled to " + exileTable() + ".";
}

// Button wrapper (per spec: just the one line)
function randomExileContract() {
  return randomExile();
}

// expose globals
global.exileTable = exileTable;
global.randomExile = randomExile;
global.randomExileContract = randomExileContract;
})(window);
