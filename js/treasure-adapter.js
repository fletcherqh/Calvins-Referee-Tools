/* ===========================================================
 * Treasure Adapter — Step 1: Map-vs-Magic Hook (20%)
 * Scope:
 *  - 1-in-5 swap of a Magic Item → “Treasure Map …”
 *  - Maps print before Magic; maps NEVER counted in totals
 *  - One-time force toggle for acceptance testing
 * Works with BOTH styles of treasure builders:
 *  (A) return an object { magicItems, treasureMaps, totals, ... }
 *  (B) return a STRING already formatted for output
 * =========================================================== */
(function (root) {
  const g = (typeof window !== 'undefined') ? window : globalThis;

  // ---- tiny debug switch (leave false) ----
  const DEBUG = false;
  const dbg = (...a) => { if (DEBUG && g.console) console.log('[TreasureAdapter]', ...a); };

  // ---- fallback dice.percentChance(n) if none exists ----
  const fallbackDice = {
    percentChance: function (n) {
      const r = Math.floor(Math.random() * 100) + 1; // 1..100
      return r <= n;
    }
  };

  // ---- singleton adapter ----
  const adapter = g.treasureAdapter = g.treasureAdapter || {};
  adapter.config = { mapChance: 0.20 };

  adapter.flags = Object.assign({
    useMapVsMagicHook: true,
    forceMapOnce: false,            // next eligible swap = 100%, then auto-resets
    mapSwapChancePercent: 20        // production rate (1-in-5)
  }, adapter.flags || {});

  // ========== OBJECT PATH (builders that return a hoard object) ==========
  adapter.applyMapVsMagic = function applyMapVsMagic(hoard) {
    if (!adapter.flags.useMapVsMagicHook || !hoard) return hoard;

    const d = (g.dice && typeof g.dice.percentChance === 'function') ? g.dice : fallbackDice;

    hoard.magicItems   = hoard.magicItems   || [];
    hoard.treasureMaps = hoard.treasureMaps || [];

    const keptMagic = [];
    for (let i = 0; i < hoard.magicItems.length; i++) {
      const item = hoard.magicItems[i];
      const force  = adapter.flags.forceMapOnce === true;
      const chance = d.percentChance(adapter.flags.mapSwapChancePercent);
      const should = force || chance;

      if (should) {
        if (force) adapter.flags.forceMapOnce = false; // consume one-shot
        hoard.treasureMaps.push(makeMapPlaceholderFrom(item));
      } else {
        keptMagic.push(item);
      }
    }

    hoard.magicItems = keptMagic;

    // Maps have no gp value → totals unchanged.
    // Print hint: maps before magic.
    hoard._printOrder = hoard._printOrder || [
      'treasureMaps', 'magicItems', 'books', 'valuables', 'jewelry', 'gems', 'relics', 'coins'
    ];

    dbg('applyMapVsMagic (object) ran');
    return hoard;
  };

  // ========== STRING PATH (builders that return already-formatted text) ==========
  function swapMapIntoTextIfNeeded(text) {
    if (!adapter.flags.useMapVsMagicHook) return text;

    const d = (g.dice && typeof g.dice.percentChance === 'function') ? g.dice : fallbackDice;
    const force  = adapter.flags.forceMapOnce === true;
    const chance = d.percentChance(adapter.flags.mapSwapChancePercent);
    if (!(force || chance)) return text;
    if (force) adapter.flags.forceMapOnce = false;

    const lines = String(text).split(/\r?\n/);

    // Heuristic: first line that *looks like* a magic item entry
    // pick the first line that is NOT coins/gems/jewelry/map/header
// pick the first line that is NOT coins/gems/jewelry/map/header
const magicLineIdx = lines.findIndex((l) => {
  const s = String(l).trim();
  if (!s) return false;
  if (/^Treasure Type/i.test(s)) return false;                      // header
  if (/^Map to/i.test(s)) return false;                             // legacy maps
  if (/^[0-9,]+\s*(cp|sp|gp)\b/i.test(s)) return false;             // coins
  if (/^\d+\s+gems?\s+worth\b/i.test(s)) return false;              // gems plural
  if (/^a\s+gem\s+worth\b/i.test(s)) return false;                  // gem singular
  if (/^\d+\s+pieces?\s+of\s+jewelry\s+worth\b/i.test(s)) return false; // jewelry plural
  if (/^a\s+piece\s+of\s+jewelry\s+worth\b/i.test(s)) return false;     // jewelry singular
  return true; // likely a magic item line (armor, weapon, scroll, potion, ring, etc.)
});

    if (magicLineIdx === -1) return text; // nothing to swap in this roll

    const stolen = lines.splice(magicLineIdx, 1)[0].trim();
    const cleaned = stolen.replace(/^a\s+|^an\s+/i, '');
    const mapLine = `Treasure Map (found instead of: ${cleaned})`;

    // Insert the map where that first magic line was (keeps order; maps “before” remaining magic)
    lines.splice(magicLineIdx, 0, mapLine);

    dbg('applyMapVsMagic (string) ran');
    return lines.join('\n');
  }

  // ========== UTILITIES ==========
  function makeMapPlaceholderFrom(magicItem) {
    let note = '';
    try {
      const text = (typeof magicItem === 'string') ? magicItem
               : (magicItem && (magicItem.label || magicItem.name || magicItem.title || magicItem.type)) || '';
      if (text) note = ` (found instead of: ${sanitize(text)})`;
    } catch (_) {}
    return `Treasure Map${note}`;
  }

  function sanitize(s) { return String(s).replace(/\s+/g, ' ').trim(); }

  // ========== INSTALL WRAPPER ==========
  // Wrap treasure builders under oddTables.* so the hook runs for GUI clicks.
  adapter.install = function install() {
    const ot = g.oddTables || g.odd_tables || g.odd || {};
    const candidates = [];
    for (const k in ot) {
      if (!Object.prototype.hasOwnProperty.call(ot, k)) continue;
      if (typeof ot[k] !== 'function') continue;
      if (/^(treasure|hoard)/i.test(k)) candidates.push(k);
    }

    candidates.forEach((fnName) => {
      const orig = ot[fnName];
      // Avoid double-wrapping
      if (orig && orig.__treasureAdapterWrapped) return;

      const wrapped = function wrappedTreasure(/*...args*/) {
        const result = orig.apply(this, arguments);

        // Path A: object hoard
        if (result && typeof result === 'object') {
          try { adapter.applyMapVsMagic(result); } catch (_) {}
          return result;
        }
        // Path B: formatted string
        if (typeof result === 'string') {
          try { return swapMapIntoTextIfNeeded(result); } catch (_) { return result; }
        }
        return result;
      };
      wrapped.__treasureAdapterWrapped = true;
      ot[fnName] = wrapped;
      dbg('wrapping oddTables.' + fnName);
    });
  };

})(this);
