/* =========================================================
 * Treasure Adapter — Step 1 (clean pass)
 * Map-vs-Magic hook with 20% swap, string + object support.
 * No edits to odd-tables.js required.
 * ======================================================= */
(function (root) {
  const g = (typeof window !== 'undefined') ? window : globalThis;

  // ---- config & flags (tweakable from console) ----
  const adapter = g.treasureAdapter = g.treasureAdapter || {};
  adapter.config = adapter.config || { mapChance: 0.20 }; // 20%
  adapter.flags  = Object.assign({
    useMapVsMagicHook: true,
    forceMapOnce: false,           // next eligible swap = 100%, then auto-reset
    mapSwapChancePercent: 20       // fallback when no dice.percentChance()
  }, adapter.flags || {});

  // ---- tiny debug switch (leave false) ----
  const DEBUG = false;
  const dbg = (...a) => { if (DEBUG && g.console) console.log('[TreasureAdapter]', ...a); };

  // ---- fallback d100 if project dice helper not present ----
  const fallbackDice = {
    percentChance(n) {
      const r = Math.floor(Math.random() * 100) + 1; // 1..100
      return r <= n;
    }
  };

  // ---- helpers ----
  function sanitize(s) { return String(s).replace(/\s+/g, ' ').trim(); }

  function makeMapPlaceholderFrom(magicItem) {
    try {
      const note = sanitize(magicItem);
      if (note) return `Treasure Map (found instead of: ${note})`;
    } catch (_) {}
    return `Treasure Map`;
  }

  // (B) STRING PATH — swap inside a formatted string
  function swapMapIntoTextIfNeeded(text) {
    if (!adapter.flags.useMapVsMagicHook) return text;
    if (typeof text !== 'string') return text;

    const d = (g.dice && typeof g.dice.percentChance === 'function') ? g.dice : fallbackDice;
    const force = adapter.flags.forceMapOnce === true;
    const should = force || d.percentChance(adapter.config?.mapChance ? Math.round(adapter.config.mapChance * 100) : adapter.flags.mapSwapChancePercent);

    if (!should) return text;

    // Try to find the first "magic line" heuristically.
    // We look for common magic keywords; if none, we leave text unchanged.
    const lines = text.split(/\r?\n/);
    const magicIdx = lines.findIndex(l =>
      /\b(potion|scroll|ring|wand|staff|rod|sword|armor|shield|arrows?|spell|wand|cloak|boots|bracers|amulet|necklace|misc(ellany)?|magic)\b/i.test(l)
    );
    if (magicIdx === -1) return text;

    const replaced = makeMapPlaceholderFrom(lines[magicIdx]);
    lines[magicIdx] = replaced;

    if (force) adapter.flags.forceMapOnce = false; // consume the one-shot
    return lines.join('\n');
  }

  // (A) OBJECT PATH — move first magic item into treasureMaps[]
  function applyMapVsMagic(hoard) {
    if (!adapter.flags.useMapVsMagicHook || !hoard || typeof hoard !== 'object') return hoard;

    const d = (g.dice && typeof g.dice.percentChance === 'function') ? g.dice : fallbackDice;
    const force = adapter.flags.forceMapOnce === true;
    const chancePercent = adapter.config?.mapChance ? Math.round(adapter.config.mapChance * 100) : adapter.flags.mapSwapChancePercent;
    const should = force || d.percentChance(chancePercent);

    if (!should) return hoard;

    const magic = Array.isArray(hoard.magicItems) ? hoard.magicItems : [];
    if (magic.length === 0) return hoard;

    const first = magic.shift(); // remove first magic item
    hoard.magicItems = magic;

    if (!Array.isArray(hoard.treasureMaps)) hoard.treasureMaps = [];
    hoard.treasureMaps.push(makeMapPlaceholderFrom(first));

    if (force) adapter.flags.forceMapOnce = false; // consume the one-shot
    return hoard;
  }

  // Expose string swapper for a possible future output() hook (not needed now)
  adapter.swapText = swapMapIntoTextIfNeeded;
  adapter.applyMapVsMagic = applyMapVsMagic;

  // ========== INSTALL WRAPPER ==========
  // Wrap treasure builders under oddTables.* so the hook runs for GUI clicks.
  adapter.install = function install() {
    const ot = g.oddTables || g.odd_tables || g.odd || {};
    const candidates = [];
    for (const k in ot) {
      if (!Object.prototype.hasOwnProperty.call(ot, k)) continue;
      if (typeof ot[k] !== 'function') continue;
      // Only wrap functions that *start* with treasure/hoard to avoid helpers.
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
          try { return applyMapVsMagic(result); } catch (_) { return result; }
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
