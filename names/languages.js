// Calvin's Referee Tools — Random Language Generator
// Equal odds among: Ancient, Barbarian, Fell, Elven, Dwarven, Cosmic.
// If Cosmic: return one of Chthonic, Elemental, Celestial (equal odds).

(function attachLanguageGenerator (root) {
  const base = ["Ancient", "Barbarian", "Fell", "Elven", "Dwarven", "Cosmic"];
  const cosmic = ["Chthonic", "Elemental", "Celestial"];

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function rollLanguage() {
    const top = pick(base);
    return top === "Cosmic" ? pick(cosmic) : top;
  }

  // Public API for console smoke tests and later button wiring:
  root.randomLanguage = function randomLanguage() { return rollLanguage(); };
})(window);
