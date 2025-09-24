// tables/maps.js
// Calvin’s Referee Tools — Treasure Maps (Spec v1.2 §C)
// Step 1: Data & formatting helpers only (string-in, string-out).
// No adapters, no totals changes, no chooser edits. Legacy pipeline untouched.
//
// Exports (under window.tables.maps):
//  - randomMapSource()
//  - randomMapScript()             // Ancient = 1/4; others = 1/8 each
//  - randomMapResult()             // d8 table; concrete rolls; item uniqueness
//  - formatMapLine({source,script,result,distance,direction})  // final string
//
// Step 2 will wire oddTables.treasureMap() to these helpers and pass distance/direction.

(function (global) {
  const G = global;
  const NS = (G.tables = G.tables || {});
  NS.maps = NS.maps || {};

  // ---------- Utilities ----------
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function weightedPick(pairs) {
    // pairs: [{v: 'Ancient', w: 2}, {v:'Elemental', w:1}, ...]
    const total = pairs.reduce((s, p) => s + (p.w || 1), 0);
    let r = Math.random() * total;
    for (const p of pairs) {
      r -= (p.w || 1);
      if (r <= 0) return p.v;
    }
    return pairs[pairs.length - 1].v;
  }

  function toTitle(s) {
    return String(s || '').replace(/\s+/g, ' ').trim();
  }

  function startsWithThe(s) {
    return /^\s*the\s+/i.test(s || '');
  }

  function withThe(s) {
    const t = String(s || '').trim();
    return startsWithThe(t) ? t : `the ${t}`;
  }

  function pluralizeSimple(noun) {
    const s = String(noun || '').trim();
    if (!s) return s;
    if (/[sxz]$/i.test(s) || /(?:sh|ch)$/i.test(s)) return `${s}es`;
    if (/[y]$/i.test(s) && !/[aeiou]y$/i.test(s)) return `${s.slice(0, -1)}ies`;
    if (/s$/i.test(s)) return s; // already plural
    return `${s}s`;
  }

  function formatIntSelectiveCommas(n) {
    // No commas for 1,000–9,000; commas for 10,000+
    if (n >= 10000) return n.toLocaleString('en-US');
    return String(n);
  }

  function fmtCurrency(n, denom /* 'gp' | 'sp' */) {
    return `${formatIntSelectiveCommas(n)}${denom}`;
  }

  function listEnglish(items) {
    const arr = items.filter(Boolean).map(x => String(x).trim()).filter(Boolean);
    if (arr.length === 0) return '';
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
    return `${arr.slice(0, -1).join(', ')}, and ${arr[arr.length - 1]}`;
  }

  // ---------- Name helpers (fallback-safe) ----------
  function muName() {
    // Try known sources; fall back gracefully.
    try {
      if (G.oddTables && typeof G.oddTables.magicUserName === 'function') return G.oddTables.magicUserName();
      if (G.names && Array.isArray(G.names.MagicUserNames)) return pick(G.names.MagicUserNames);
    } catch {}
    return 'Merion the Grey';
  }

  function clName() {
    try {
      if (G.oddTables && typeof G.oddTables.clericName === 'function') return G.oddTables.clericName();
      // Try common buckets if present
      if (G.names && Array.isArray(G.names.LawfulMaleClericNames)) return pick(G.names.LawfulMaleClericNames);
      if (G.names && Array.isArray(G.names.LawfulFemaleClericNames)) return pick(G.names.LawfulFemaleClericNames);
      if (G.names && Array.isArray(G.names.ChaoticMaleClericNames)) return pick(G.names.ChaoticMaleClericNames);
      if (G.names && Array.isArray(G.names.ChaoticFemaleClericNames)) return pick(G.names.ChaoticFemaleClericNames);
    } catch {}
    return 'Eldan of the White Hand';
  }

  function extraction() {
    try {
      if (G.dice && typeof G.dice.Extraction === 'function') return toTitle(G.dice.Extraction());
    } catch {}
    return 'the Northern Marches';
  }

  function extractionPlural() {
    const base = extraction();
    // If already plural-looking (ends with "s"), leave it
    if (/\b(?:Plains|Hills|Sands|Marches|Wastes|Isles|Lands)\b$/i.test(base)) return base;
    return pluralizeSimple(base.replace(/^the\s+/i, ''));
  }

  // ---------- Magic item helpers (JB anchors; safe fallbacks) ----------
  function anyMagicItem() {
    try {
      if (G.oddTables && typeof G.oddTables.magicItem === 'function') {
        return toTitle(G.oddTables.magicItem());
      }
    } catch {}
    return 'a magic item';
  }

  function anyMagicItemNoSwords() {
    try {
      if (G.oddTables && typeof G.oddTables.magicItemNoSwords === 'function') {
        return toTitle(G.oddTables.magicItemNoSwords());
      }
    } catch {}
    // Fallback: filter out swords with a few retries
    for (let tries = 0; tries < 20; tries++) {
      const name = anyMagicItem();
      if (!/sword/i.test(name)) return name;
    }
    return 'a magic item (not a sword)';
  }

  function potionItem() {
    try {
      if (G.oddTables && typeof G.oddTables.potion === 'function') {
        // JB’s potion takes a boolean flag
        return toTitle(G.oddTables.potion(true));
      }
    } catch {}
    // Graceful fallback
    const x = anyMagicItem();
    if (/potion/i.test(x)) return x;
    return 'a potion (random)';
  }

  function scrollItem() {
    try {
      if (G.oddTables && typeof G.oddTables.scroll === 'function') {
        return toTitle(G.oddTables.scroll());
      }
    } catch {}
    const x = anyMagicItem();
    if (/scroll/i.test(x)) return x;
    return 'a scroll (random)';
  }

  function uniqueItems(targetCount, opts) {
    const out = [];
    const seen = new Set();
    const pickFn = opts?.noSwords ? anyMagicItemNoSwords : anyMagicItem;

    // Pre-seed requirements
    if (opts?.requirePotion) {
      const p = potionItem();
      out.push(p); seen.add(p.toLowerCase());
    }
    if (opts?.requireScroll) {
      const s = scrollItem();
      if (!seen.has(s.toLowerCase())) {
        out.push(s); seen.add(s.toLowerCase());
      }
    }

    // Fill remaining slots with uniqueness cap
    const want = Math.max(0, targetCount - out.length);
    let guard = 200;
    while (out.length < targetCount && guard-- > 0) {
      const cand = pickFn();
      const key = cand.toLowerCase();
      if (seen.has(key)) continue;
      out.push(cand);
      seen.add(key);
    }
    return out;
  }

  // ---------- Public: randomMapSource ----------
  function randomMapSource() {
    const mu = muName();
    const cl = clName();
    const ex = extraction();
    const exPlural = extractionPlural();

    const templates = [
      `${mu}’s Geography of ${withThe(ex)}`,
      `The Travels of ${mu} throughout ${withThe(ex)}`,
      `${mu}’s Cartography of ${withThe(ex)}`,
      `${mu}’s Atlas of ${withThe(exPlural)}`,
      `The Journals of ${mu}’s Travels in ${withThe(ex)}`,
      `An epistle of ${cl}’s to ${toTitle(ex)}`,
      `Parchment written with blood for ink`,
      `Sketch of shaking hand on parchment`,
      `Torn out page of a book with curious notes in the margin`,
      `Useless memorandum with strange diagram on the back`,
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  // ---------- Public: randomMapScript (Ancient = 1/4; others = 1/8) ----------
  function randomMapScript() {
    return weightedPick([
      { v: 'Ancient', w: 2 },      // 2/8 = 1/4
      { v: 'Elemental', w: 1 },    // 1/8 each
      { v: 'Celestial', w: 1 },
      { v: 'Chthonic',  w: 1 },
      { v: 'Code',      w: 1 },
      { v: 'Cypher',    w: 1 },
      { v: 'Cant',      w: 1 },
    ]);
  }

  // ---------- Currency & count rolls ----------
  function rollSp_10k_40k() {
    // 4d10 × 1000 sp (per your decision)
    if (G.dice && typeof G.dice.d10 === 'function') {
      return G.dice.d10(4) * 1000;
    }
    // Fallback approximation: uniform 4..40
    const n = 4 + Math.floor(Math.random() * 37);
    return n * 1000;
  }

  function rollGp_5k_30k() {
    // 5d6 × 1000 gp
    if (G.dice && typeof G.dice.d6 === 'function') {
      return G.dice.d6(5) * 1000;
    }
    // Fallback approximation: uniform 5..30
    const n = 5 + Math.floor(Math.random() * 26);
    return n * 1000;
  }

  function rollGems_2_20() {
    if (G.dice && typeof G.dice.d10 === 'function') return G.dice.d10(2);
    return 2 + Math.floor(Math.random() * 19);
  }
  function rollGems_5_30() {
    if (G.dice && typeof G.dice.d6 === 'function') return G.dice.d6(5);
    return 5 + Math.floor(Math.random() * 26);
  }
  function rollGems_10_60() {
    if (G.dice && typeof G.dice.d6 === 'function') return G.dice.d6(10);
    return 10 + Math.floor(Math.random() * 51);
  }
  function rollGems_1_100() {
    if (G.dice && typeof G.dice.d100 === 'function') return G.dice.d100(1);
    return 1 + Math.floor(Math.random() * 100);
  }
  function rollJewelry_2_20() {
    if (G.dice && typeof G.dice.d10 === 'function') return G.dice.d10(2);
    return 2 + Math.floor(Math.random() * 19);
  }

  // ---------- Public: randomMapResult (returns a single result string) ----------
  function randomMapResult() {
    const roll = (G.dice && typeof G.dice.d8 === 'function') ? G.dice.d8(1) : (1 + Math.floor(Math.random() * 8));

    // Helpers for composing pieces
    function part_sp() {
      return fmtCurrency(rollSp_10k_40k(), 'sp');
    }
    function part_gp() {
      return fmtCurrency(rollGp_5k_30k(), 'gp');
    }

    function part_gems(count) {
      return `${count} gems`;
    }
    function part_jewelry(count) {
      return `${count} jewelry items`;
    }

    function parts_join(parts, itemsNeeded = 0, itemOpts = undefined) {
      const cleaned = parts.filter(Boolean);
      if (itemsNeeded > 0) {
        const items = uniqueItems(itemsNeeded, itemOpts);
        if (items.length === 1) {
          cleaned.push(items[0]);
        } else if (items.length > 1) {
          cleaned.push(listEnglish(items));
        }
      }
      return listEnglish(cleaned);
    }

    switch (roll) {
      case 1: {
        const p = [part_sp()];
        // + any 1 magic item
        return parts_join(p, 1);
      }
      case 2: {
        const p = [part_gp()];
        return parts_join(p, 1);
      }
      case 3: {
        const p = [part_sp(), part_gp()];
        return parts_join(p, 2);
      }
      case 4: {
        const p = [part_sp(), part_gems(rollGems_2_20())];
        return parts_join(p, 2);
      }
      case 5: {
        const p = [part_gp(), part_gems(rollGems_5_30())];
        return parts_join(p, 2);
      }
      case 6: {
        const p = [part_sp(), part_gp(), part_gems(rollGems_1_100())];
        // 5 items, include one scroll and one potion
        return parts_join(p, 5, { requireScroll: true, requirePotion: true });
      }
      case 7: {
        const p = [part_gems(rollGems_10_60()), part_jewelry(rollJewelry_2_20())];
        // 3 items, no swords
        return parts_join(p, 3, { noSwords: true });
      }
      case 8: {
        const p = [
          // #3 treasure:
          part_sp(), part_gp(),
          // #7 treasure (gems + jewelry):
          part_gems(rollGems_10_60()), part_jewelry(rollJewelry_2_20()),
        ];
        // 4 items, include at least one potion
        return parts_join(p, 4, { requirePotion: true });
      }
      default: {
        // Shouldn’t happen; fall back to a modest hoard
        return parts_join([part_gp()], 1);
      }
    }
  }

  // ---------- Public: formatMapLine ----------
  // Accepts the already-rolled pieces + distance/direction (Step 2 will supply these).
  function formatMapLine({ source, script, result, distance, direction }) {
    const src = toTitle(source);
    const scr = toTitle(script);
    const res = String(result || '').trim();

    let dd = '';
    if (distance != null && direction) {
      // Caller supplies a number for miles + an 8-way direction like 'NE'
      dd = `${distance} miles ${String(direction).toUpperCase()}`;
    }

    // Final sentence per spec (spell out "and", no extra commas before NE)
    // e.g., "The Travels of ... Written in Ancient. Provides a map to 24,000gp and Potion of Animal Control. 15 miles NE."
    const end = dd ? ` ${dd}.` : '';
    return `${src}. Written in ${scr}. Provides a map to ${res}.${end}`;
  }

  // Exports
  NS.maps.randomMapSource = randomMapSource;
  NS.maps.randomMapScript = randomMapScript;
  NS.maps.randomMapResult = randomMapResult;
  NS.maps.formatMapLine   = formatMapLine;

})(typeof window !== 'undefined' ? window : globalThis);
