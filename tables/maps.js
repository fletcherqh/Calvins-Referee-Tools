/* Calvin’s Referee Tools — maps.js
 * Source of truth for Treasure Map generation (house rules).
 * Exposes: maps.treasureMap() -> string (no side-effects).
 *
 * Integration:
 *   - In HTML button: output(maps.treasureMap())
 *   - In odd-tables.js magicOrMap(): return maps.treasureMap();
 *
 * Dependencies expected (already in project):
 *   - dice.d6(), dice.d8(), dice.d10(), dice.d20(), dice.d100()
 *   - dice.pick(array)                                   // uniform pick
 *   - dice.Extraction()                                  // returns phrase like "the Iron Marches" (adjective + place)
 *   - Distance & Direction: use existing project helpers:
 *       • getDistance():  prefer questGeas.randomDistance() if present; else dice.randomDistance() if present;
 *                         else dice.Distance() / dice.distance() if present.
 *       • getDirection(): prefer dice.randomDirection(); else dice.Direction() / dice.direction().
 *   - Name arrays (loaded before this file):
 *       • maleMagicUserNames, femaleMagicuserNames
 *       • LawfulMaleClericNames, LawfulFemaleClericNames, ChaoticMaleClericNames, ChaoticFemaleClericNames
 *
 * Notes:
 *   - Prints numbers like “10,000gp” with a single period only at the end of the sentence (as per later formatting pass).
 *   - Uses “and” (not “&”) in phrases we build.
 *   - Map Results here express treasure categories/counts in prose only; they do NOT roll/print actual items or coin totals.
 *     (Future phases can expand to generate detailed items using the same counts without changing this API.)
 */

(function initMapsNamespace() {
  if (!window.maps) window.maps = {};
  const _g = window;

  // ---------- Utilities ----------

  function exists(x) { return typeof x !== 'undefined' && x !== null; }

  function pick(arr) {
    if (!arr || !arr.length) throw new Error('maps.js: dice.pick() fallback needs a non-empty array.');
    if (exists(_g.dice) && typeof _g.dice.pick === 'function') return _g.dice.pick(arr);
    // Fallback uniform
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function d(n) {
    if (exists(_g.dice)) {
      const fn = _g.dice['d' + n];
      if (typeof fn === 'function') return fn();
    }
    return 1 + Math.floor(Math.random() * n);
  }

  // Distance/Direction wrappers (no guessing at final names; try common project variants)
  function getDistance() {
    // Prefer quest-geas tables if present
    if (exists(_g.questGeas) && typeof _g.questGeas.randomDistance === 'function') return _g.questGeas.randomDistance();
    // dice.js variants
    if (exists(_g.dice) && typeof _g.dice.randomDistance === 'function') return _g.dice.randomDistance();
    if (exists(_g.dice) && typeof _g.dice.Distance === 'function') return _g.dice.Distance();
    if (exists(_g.dice) && typeof _g.dice.distance === 'function') return _g.dice.distance();
    // Fallback: 1–30 miles
    return (d(30)) + ' miles';
  }

  function getDirection() {
    if (exists(_g.dice) && typeof _g.dice.randomDirection === 'function') return _g.dice.randomDirection();
    if (exists(_g.dice) && typeof _g.dice.Direction === 'function') return _g.dice.Direction();
    if (exists(_g.dice) && typeof _g.dice.direction === 'function') return _g.dice.direction();
    // Fallback compass
    const dirs = ['N','NE','E','SE','S','SW','W','NW'];
    return pick(dirs);
  }

  // ---------- Names & Extraction ----------

  function randomMUName() {
    const gender = d(2) === 1 ? 'male' : 'female';
    if (gender === 'male') {
      if (exists(_g.maleMagicUserNames)) return pick(_g.maleMagicUserNames);
    } else {
      if (exists(_g.femaleMagicuserNames)) return pick(_g.femaleMagicuserNames); // project’s lowercase “u”
      if (exists(_g.femaleMagicUserNames)) return pick(_g.femaleMagicUserNames);
    }
    return 'Unnamed Magus';
  }

  function randomClericName() {
    const gender = d(2) === 1 ? 'male' : 'female';
    const axis   = d(2) === 1 ? 'Lawful' : 'Chaotic';
    const key = axis + (gender === 'male' ? 'Male' : 'Female') + 'ClericNames';
    if (exists(_g[key])) return pick(_g[key]);
    // Explicit fallbacks
    if (axis === 'Lawful') {
      if (gender === 'male' && exists(_g.LawfulMaleClericNames)) return pick(_g.LawfulMaleClericNames);
      if (gender === 'female' && exists(_g.LawfulFemaleClericNames)) return pick(_g.LawfulFemaleClericNames);
    } else {
      if (gender === 'male' && exists(_g.ChaoticMaleClericNames)) return pick(_g.ChaoticMaleClericNames);
      if (gender === 'female' && exists(_g.ChaoticFemaleClericNames)) return pick(_g.ChaoticFemaleClericNames);
    }
    return 'Unnamed Cleric';
  }

  function extractionPhrase() {
    if (exists(_g.dice) && typeof _g.dice.Extraction === 'function') return _g.dice.Extraction();
    return 'unknown lands';
  }

  // ---------- Field: Source (uniform) ----------
  const sourceTemplates = [
    "[MU name]’s Geography of [extraction]",
    "The Travels of [MU name] throughout the [extraction]",
    "[MU name]’s Cartography of [extraction]",
    "[MU name]’s Atlas of [extraction (plural)]",
    "The Journals of [MU name]’s Travels in the [extraction]",
    "An epistle of [CL name]’s to [extraction]",
    "Parchment written with blood for ink",
    "Sketch of shaking hand on parchment",
    "Torn out page of a book with curious notes in the margin",
    "Useless memorandum with strange diagram on the back"
  ];

  function pluralizeExtraction(extr) {
    // naive pluralization: add 's' if not already endswith 's'
    const t = extr.trim();
    return t.endsWith('s') ? extr : extr + 's';
  }

  function realizeSource() {
    let t = pick(sourceTemplates);
    t = t.replace('[MU name]', randomMUName());
    t = t.replace('[CL name]', randomClericName());
    const extr = extractionPhrase();
    if (t.includes('[extraction (plural)]')) {
      t = t.replace('[extraction (plural)]', pluralizeExtraction(extr));
    }
    t = t.replace('[extraction]', extr);
    return t;
  }

  // ---------- Field: Script ----------
  // If a global mapScripts array exists (from your tables), we will use it; otherwise default to a minimal set.
  const fallbackScripts = ["Ancient", "Scholarly hand", "Crabbed script", "Runes"];
  function realizeScript() {
    const arr = (exists(_g.mapScripts) && Array.isArray(_g.mapScripts) && _g.mapScripts.length) ? _g.mapScripts : fallbackScripts;
    return pick(arr);
  }

  // ---------- Field: Map Result (d8 uniform) ----------
  function realizeMapResult() {
    switch (d(8)) {
      case 1: return "10–40K sp. and any 1 magic item";
      case 2: return "5–30K gp. and any 1 magic item";
      case 3: return "#1 and #2 above for treasure and any 2 magic items";
      case 4: return "#1 above for treasure, plus 2–20 Gems and any 2 magic items";
      case 5: return "#2 above for treasure, plus 5–30 Gems and any 2 magic items";
      case 6: return "#3 above for treasure, plus 1–100 Gems and 5 magic items of which one is a scroll and one is a potion";
      case 7: return "10–60 Gems, 2–20 Jewelry and 3 magic items, no swords";
      case 8: return "#3 and #7 above for treasure, and 4 magic items, of which one is a potion";
      default: return "5–30K gp. and any 1 magic item";
    }
  }

  // ---------- Public API ----------
  function treasureMap() {
    const source = realizeSource();
    const script = realizeScript();
    const result = realizeMapResult();
    const distance = getDistance();
    const direction = getDirection();
    return source + ". Written in " + script + ". Provides a map to " + result + ". " + distance + " " + direction + ".";
  }

  // attach
  window.maps.treasureMap = treasureMap;
})();