/* Calvin’s Referee Tools — maps.js (rev5)
 * Treasure Map generation (house rules).
 * API: maps.treasureMap() -> string (no side-effects)
 *
 * Rev5 changes:
 *  - Coins now rolled: 
 *      • sp: 1d4 × 10000 (10000–40000)
 *      • gp: 1d6 × 5000 (5000–30000)
 *  - Gems/Jewelry counts rolled per ranges (2–20, 5–30, 1–100, d6×10, 2d10).
 *  - Magic items section labeled “Magic Items:”
 *  - Distance/direction section labeled “Location:”
 */

(function initMapsNamespace() {
  if (!window.maps) window.maps = {};
  const _g = window;

  // ---------- Utilities ----------
  function exists(x) { return typeof x !== 'undefined' && x !== null; }
  function pick(arr) {
    if (!arr || !arr.length) throw new Error('maps.js: dice.pick() fallback needs a non-empty array.');
    if (exists(_g.dice) && typeof _g.dice.pick === 'function') return _g.dice.pick(arr);
    return arr[Math.floor(Math.random() * arr.length)];
  }
  function d(n) {
    if (exists(_g.dice)) {
      const fn = _g.dice['d' + n];
      if (typeof fn === 'function') return fn();
    }
    return 1 + Math.floor(Math.random() * n);
  }
  function randInt(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }

  // Distance/Direction
  function getDistance() {
    if (exists(_g.questGeas) && typeof _g.questGeas.randomDistance === 'function') return _g.questGeas.randomDistance();
    if (exists(_g.dice) && typeof _g.dice.randomDistance === 'function') return _g.dice.randomDistance();
    if (exists(_g.dice) && typeof _g.dice.Distance === 'function') return _g.dice.Distance();
    if (exists(_g.dice) && typeof _g.dice.distance === 'function') return _g.dice.distance();
    return (d(30)) + ' miles';
  }
  function getDirection() {
    if (exists(_g.dice) && typeof _g.dice.randomDirection === 'function') return _g.dice.randomDirection();
    if (exists(_g.dice) && typeof _g.dice.Direction === 'function') return _g.dice.Direction();
    if (exists(_g.dice) && typeof _g.dice.direction === 'function') return _g.dice.direction();
    const dirs = ['N','NE','E','SE','S','SW','W','NW'];
    return pick(dirs);
  }

  // ---------- Names & Extraction ----------
  function randomMUName() {
    const gender = d(2) === 1 ? 'male' : 'female';
    if (gender === 'male') {
      if (exists(_g.maleMagicUserNames)) return pick(_g.maleMagicUserNames);
    } else {
      if (exists(_g.femaleMagicuserNames)) return pick(_g.femaleMagicuserNames);
      if (exists(_g.femaleMagicUserNames)) return pick(_g.femaleMagicUserNames);
    }
    return 'Unnamed Magus';
  }
  function randomClericName() {
    const gender = d(2) === 1 ? 'male' : 'female';
    const axis   = d(2) === 1 ? 'Lawful' : 'Chaotic';
    const key = axis + (gender === 'male' ? 'Male' : 'Female') + 'ClericNames';
    if (exists(_g[key])) return pick(_g[key]);
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

  // ---------- Source ----------
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
  function pluralizeExtraction(extr) { const t = extr.trim(); return t.endsWith('s') ? extr : extr + 's'; }
  function realizeSource() {
    let t = pick(sourceTemplates);
    t = t.replace('[MU name]', randomMUName());
    t = t.replace('[CL name]', randomClericName());
    const extr = extractionPhrase();
    if (t.includes('[extraction (plural)]')) t = t.replace('[extraction (plural)]', pluralizeExtraction(extr));
    t = t.replace('[extraction]', extr);
    return t;
  }

  // ---------- Script (weighted) ----------
  const scriptWeighted = [
    {name:"Ancient", w:2}, {name:"Ancient", w:2},
    {name:"Elemental", w:1}, {name:"Celestial", w:1}, {name:"Chthonic", w:1},
    {name:"Code", w:1}, {name:"Cypher", w:1}, {name:"Cant", w:1}
  ];
  function realizeScript() {
    let total = 0; for (const s of scriptWeighted) total += s.w;
    let roll = Math.random() * total;
    for (const s of scriptWeighted) { if ((roll -= s.w) <= 0) return s.name; }
    return "Ancient";
  }

  // ---------- Coins / Gems / Jewelry ----------
  function rollSp() { return (d(4) * 10000) + "sp"; }
  function rollGp() { return (d(6) * 5000) + "gp"; }

  function rollGems_2to20() { return randInt(2,20) + " Gems"; }
  function rollGems_5to30() { return randInt(5,30) + " Gems"; }
  function rollGems_1to100() { return randInt(1,100) + " Gems"; }
  function rollGems_10to60() { return (d(6)*10) + " Gems"; }

  function rollJewelry_2to20() { return (d(10)+d(10)) + " Jewelry Items"; }

  // ---------- Magic item generation ----------
  function rollMagicItem(opts) {
    const noSwords = opts && opts.noSwords;
    if (noSwords && exists(_g.oddTables) && typeof _g.oddTables.magicItemNoSwords === 'function') {
      return _g.oddTables.magicItemNoSwords();
    }
    if (exists(_g.oddTables) && typeof _g.oddTables.magicItem === 'function') {
      return _g.oddTables.magicItem();
    }
    return "a magic item";
  }
  function rollPotion() {
    if (exists(_g.oddTables) && typeof _g.oddTables.potion === 'function') return _g.oddTables.potion(true);
    return "a potion";
  }
  function rollScroll() {
    if (exists(_g.oddTables) && typeof _g.oddTables.scroll === 'function') return _g.oddTables.scroll();
    return "a scroll";
  }
  function sanitizeItemText(s) { return String(s || "").replace(/\s+$/g, ""); }
  function rollUniqueItems(count, opts) {
    const items = []; const seen = new Set(); let guard = 0;
    while (items.length < count && guard < 100) {
      guard++;
      const raw = sanitizeItemText(rollMagicItem(opts));
      const key = raw.toLowerCase();
      if (!seen.has(key)) { seen.add(key); items.push(raw); }
    }
    return items;
  }

  // ---------- Map Result ----------
  function realizeMapResult(r) {
    let parts = []; let items = [];

    switch (r) {
      case 1: parts.push(rollSp()); items = rollUniqueItems(1, {}); break;
      case 2: parts.push(rollGp()); items = rollUniqueItems(1, {}); break;
      case 3: parts.push(rollSp(), rollGp()); items = rollUniqueItems(2, {}); break;
      case 4: parts.push(rollSp(), rollGems_2to20()); items = rollUniqueItems(2, {}); break;
      case 5: parts.push(rollGp(), rollGems_5to30()); items = rollUniqueItems(2, {}); break;
      case 6: {
        parts.push(rollSp(), rollGp(), rollGems_1to100());
        const forced = [sanitizeItemText(rollScroll()), sanitizeItemText(rollPotion())];
        const remaining = rollUniqueItems(3, {});
        items = [...forced];
        const seen = new Set(items.map(s => s.toLowerCase()));
        for (const it of remaining) { if (!seen.has(it.toLowerCase())) { seen.add(it.toLowerCase()); items.push(it); } }
        while (items.length < 5) { const nxt = sanitizeItemText(rollMagicItem({})); if (!seen.has(nxt.toLowerCase())) { seen.add(nxt.toLowerCase()); items.push(nxt); } }
        break;
      }
      case 7: parts.push(rollGems_10to60(), rollJewelry_2to20()); items = rollUniqueItems(3, {noSwords:true}); break;
      case 8: {
        parts.push(rollSp(), rollGp(), rollGems_10to60(), rollJewelry_2to20());
        const forced = [sanitizeItemText(rollPotion())];
        const remaining = rollUniqueItems(3, {});
        items = [...forced];
        const seen = new Set(items.map(s => s.toLowerCase()));
        for (const it of remaining) { if (!seen.has(it.toLowerCase())) { seen.add(it.toLowerCase()); items.push(it); } }
        while (items.length < 4) { const nxt = sanitizeItemText(rollMagicItem({})); if (!seen.has(nxt.toLowerCase())) { seen.add(nxt.toLowerCase()); items.push(nxt); } }
        break;
      }
      default: parts.push(rollGp()); items = rollUniqueItems(1, {});
    }

    return { treasureText: parts.join("; "), items };
  }

  // ---------- Public API ----------
  function treasureMap() {
    const source = realizeSource();
    const script = realizeScript();
    const roll = d(8);
    const res = realizeMapResult(roll);
    const distance = getDistance();
    const direction = getDirection();
    const itemsPart = res.items && res.items.length ? " Magic Items: " + res.items.join("; ") + "." : "";
    return source + ". Written in " + script + ". Provides a map to " + res.treasureText + "." +
           itemsPart + " Location: " + distance + " " + direction + ".";
  }

  _g.maps.treasureMap = treasureMap;
})();