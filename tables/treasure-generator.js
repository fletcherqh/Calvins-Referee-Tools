/* ======================================================================
 * Calvin’s Referee Tools — treasure-generator.js
 * Shared Treasure Engine (Phase 1 — Implementation Begins)
 *
 * Overview:
 *   This module replaces the legacy per-table treasure logic found in
 *   odd-tables.js with a unified data-driven engine. Each treasure type
 *   (A–I, variants, and later Level 1–13) will be defined by a schema
 *   object describing its coin, gem, jewelry, and magic behaviors.
 *   The engine will interpret these schemas to produce final treasure
 *   descriptions in the canonical output format.
 *
 * Guiding Rules:
 *   - NO GUESSING: All behavior follows canonical definitions exactly.
 *   - NO LOGIC IN SCHEMAS: Schemas contain only data, not code.
 *   - PURE STRING GENERATOR: No DOM side-effects; output is pure text.
 *   - CANONICAL ORDER:
 *       MAGIC ITEMS → TREASURE MAPS → VALUABLE ITEMS → BOOKS →
 *       JEWELRY → GEMS → COINAGE
 *   - Omit empty categories entirely.
 *   - Magic items and maps have no gp value; they never contribute to
 *     GRAND TOTAL.
 *   - Coins/gems/jewelry/books/valuables receive per-category subtotals
 *     where appropriate.
 *   - GRAND TOTAL printed only when more than one valued category
 *     contributes gp > 0.
 *   - “No nil non-magic treasure” safeguard:
 *       If a roll produces no non-magic gp value, reroll coins+gems+
 *       jewelry+valuables+books (never magic/maps) until some gp appears
 *       or a safety cap is reached.
 *   - Left-justified output; no tab characters; predictable blank lines.
 *
 * Project Workflow:
 *   This file is implemented in small, verifiable steps (coins → gems →
 *   jewelry → magic → section assembly → totals → schemas). Older JB
 *   treasure-table functions remain in odd-tables.js as historical
 *   references until migration is complete.
 *
 * Status:
 *   Implementation begins below with Section 0 (global container) and
 *   Section 1 (public API placeholders). All other parts follow in later
 *   phases.
 *
 * ====================================================================== */

// ======================================================================
// START OF IMPLEMENTATION — SECTIONS 0, 1, AND 4.1 (COINS)
// ======================================================================

(function (global) {
  "use strict";

  // ---------------------------------------------------------------
  // 0. Create the global engine container
  // ---------------------------------------------------------------
  const treasureEngine = {};

  // Attach to global namespace
  global.treasureEngine = treasureEngine;

  // ---------------------------------------------------------------
  // 1. Public API + Nil-Safeguard Helpers
  // ---------------------------------------------------------------

  // Run the treasure engine for a given schema key.
  //
  // Schema contract (for now, minimal and generic):
  //   treasureEngine.TREASURE_SCHEMAS[schemaKey] = {
  //     title: string,                        // title line for output
  //     rollNonMagic: function (state) {},    // rolls coins/gems/jewelry/books/valuables
  //     rollMagicAndMaps: function (state) {} // rolls magic items and maps
  //   };
  //
  // This function:
  //   - Creates a fresh state object.
  //   - Calls schema.rollNonMagic(state) via applyNilSafeguard()
  //       to enforce the "no nil non-magic treasure" rule.
  //   - Calls schema.rollMagicAndMaps(state) if present.
  //   - Uses buildFullOutput(title, state) to assemble sections + GRAND TOTAL.
  //

  treasureEngine.run = function (schemaKey) {
    var schema = treasureEngine.TREASURE_SCHEMAS[schemaKey];

    if (!schema) {
      return 'treasureEngine.run("' + schemaKey + '"): no schema registered.';
    }

    var state = {};

    // Defensive defaults so body builder doesn’t choke
    state.magicItems = [];
    state.mapsList = [];
    state.valuablesLines = [];
    state.booksLines = [];
    state.jewelryText = "";
    state.gemsText = "";
    state.coinLines = [];

    state.totalCoinGpValue = 0;
    state.totalCoinEncumbrance = 0;
    state.gemsGpValue = 0;
    state.gemsEncumbrance = 0;
    state.jewelryGpValue = 0;
    state.jewelryEncumbrance = 0;
    state.booksGpValue = 0;
    state.booksEncumbrance = 0;
    state.valuablesGpValue = 0;
    state.valuablesEncumbrance = 0;

    // 1) Roll all NON-MAGIC treasure with nil-safeguard
    if (typeof schema.rollNonMagic === "function") {
      treasureEngine.applyNilSafeguard(function (st) {
        // Ensure `this` inside rollNonMagic is the schema object
        schema.rollNonMagic.call(schema, st);
      }, state, 5);
    }

    // 2) Roll MAGIC ITEMS / MAPS (never rerolled by nil-safeguard)
    if (typeof schema.rollMagicAndMaps === "function") {
      schema.rollMagicAndMaps(state);
    }

    // 3) Build full output (sections + GRAND TOTAL) with a safe title
    var title = (schema.title && String(schema.title).trim()) ||
                ("// Treasure (" + schemaKey + ") //");

    return treasureEngine.buildFullOutput(title, state);
  };

  // ---------------------------------------------------------------
  // Nil-safeguard helpers
  // ---------------------------------------------------------------

  // Return true if any non-magic category contributes gp value.
  treasureEngine.hasNonMagicValue = function (state) {
    if (!state) return false;

    var gp =
      (state.totalCoinGpValue || 0) +
      (state.gemsGpValue || 0) +
      (state.jewelryGpValue || 0) +
      (state.booksGpValue || 0) +
      (state.valuablesGpValue || 0);

    return gp > 0;
  };

  // Reroll only NON-MAGIC treasure (coins/gems/jewelry/books/valuables)
  // until some gp value appears or maxAttempts is reached.
  // Magic items and maps on state are NEVER reset or rerolled here.
  treasureEngine.applyNilSafeguard = function (rollNonMagicFn, state, maxAttempts) {
    if (typeof rollNonMagicFn !== "function") {
      return;
    }

    // Default safety cap = 5 attempts
    var cap = (typeof maxAttempts === "number" && maxAttempts > 0)
      ? Math.floor(maxAttempts)
      : 5;

    function resetNonMagic(s) {
      // Coins
      s.cpCoins = 0;
      s.spCoins = 0;
      s.gpCoins = 0;
      s.spValueGp = 0;
      s.cpValueGp = 0;
      s.totalCoinGpValue = 0;
      s.totalCoinEncumbrance = 0;
      s.coinLines = [];

      // Gems
      s.gemsText = "";
      s.gemsGpValue = 0;
      s.gemsEncumbrance = 0;

      // Jewelry
      s.jewelryText = "";
      s.jewelryGpValue = 0;
      s.jewelryEncumbrance = 0;

      // Books
      s.booksLines = [];
      s.booksGpValue = 0;
      s.booksEncumbrance = 0;

      // Valuables
      s.valuablesLines = [];
      s.valuablesGpValue = 0;
      s.valuablesEncumbrance = 0;
    }

    var attempt = 0;

    while (attempt < cap) {
      resetNonMagic(state);
      rollNonMagicFn(state);

      if (treasureEngine.hasNonMagicValue(state)) {
        break;
      }

      attempt += 1;
    }
  };

  // Empty registries to be populated in future phases.
  treasureEngine.TREASURE_SCHEMAS = {};
  treasureEngine.MAGIC_PLANS = {};

  // ======================================================================
  // SECTION 4.1 — COINS ENGINE (isolated, not yet wired into run())
  // ======================================================================
  //
  // rollCoins(schema, state)
  //
  //   - Reads coin specs from schema.coins (an array).
  //   - Updates state with:
  //        state.cpCoins, state.spCoins, state.gpCoins
  //        state.spValueGp, state.cpValueGp
  //        state.totalCoinGpValue, state.totalCoinEncumbrance
  //        state.coinLines (array of strings for the COINAGE section)
  //
  //   - Does NOT print anything. The run() method will later assemble
  //     sections in canonical order.
  // ======================================================================

  treasureEngine.rollCoins = function (schema, state) {
    // Initialize coin state
    state.cpCoins = 0;
    state.spCoins = 0;
    state.gpCoins = 0;

    // For each coin specification in the schema
    (schema.coins || []).forEach(function (spec) {
      // spec = { type, chance, dice, count, multiplier }

      if (dice.percentChance(spec.chance)) {
        // Parse the dice expression (e.g., "d4", "d6", "d100")
        var die = (spec.dice || "").toLowerCase();
               var fn =
          die === "d2"   ? dice.d2   :
          die === "d3"   ? dice.d3   :
          die === "d4"   ? dice.d4   :
          die === "d6"   ? dice.d6   :
          die === "d8"   ? dice.d8   :
          die === "d10"  ? dice.d10  :
          die === "d12"  ? dice.d12  :
          die === "d20"  ? dice.d20  :
          die === "d50"  ? dice.d50  :
          die === "d100" ? dice.d100 :
          null;

        if (typeof fn === "function") {
          var amount = fn(spec.count) * spec.multiplier;

          if (spec.type === "cp")      { state.cpCoins += amount; }
          else if (spec.type === "sp") { state.spCoins += amount; }
          else if (spec.type === "gp") { state.gpCoins += amount; }
        }
      }
    });

    // Derived gp-values (sp/cp converted, house rule)
    state.spValueGp = Math.ceil(state.spCoins / 2); // 1gp = 2sp
    state.cpValueGp = Math.ceil(state.cpCoins / 3); // 1gp = 3cp

    // Category totals
    state.totalCoinGpValue =
      state.gpCoins + state.spValueGp + state.cpValueGp;

    state.totalCoinEncumbrance =
      state.gpCoins + state.spCoins + state.cpCoins; // 1p. per coin

    // Build COINAGE lines (string array)
    state.coinLines = [];

    var coinTypes = 0;

    if (state.gpCoins > 0) {
      coinTypes++;
      state.coinLines.push(
        state.gpCoins + "gp (" + state.gpCoins + "p. encumbrance)"
      );
    }

    if (state.spCoins > 0) {
      coinTypes++;
      state.coinLines.push(
        state.spCoins +
          "sp = " + state.spValueGp + "gp value (" +
          state.spCoins + "p. encumbrance)"
      );
    }

    if (state.cpCoins > 0) {
      coinTypes++;
      state.coinLines.push(
        state.cpCoins +
          "cp = " + state.cpValueGp + "gp value (" +
          state.cpCoins + "p. encumbrance)"
      );
    }

    // Add total line only when >1 coin type
    if (coinTypes > 1) {
      state.coinLines.push(
        state.totalCoinGpValue +
          "gp Total coin value (" +
          state.totalCoinEncumbrance +
          "p. total coin encumbrance)"
      );
    }
  };

  // ======================================================================
  // SECTION 4.2 — GEMS ENGINE (isolated, not yet wired into run())
  // ======================================================================
  //
  // rollGems(schema, state)
  //
  //   - Reads gem specs from schema.gems (array of:
  //       { chance: %, dice: "d6"|"d4"|..., count: N } ).
  //   - Sums all gem counts that successfully roll.
  //   - Uses houseGems.bundleForCount(totalCount) when available to get:
  //       text + total gp + total p. encumbrance.
  //   - Falls back to oddTables.gems(totalCount) if houseGems is missing
  //     (in that case, gp/encumbrance are left as 0).
  //
  //   - Updates state with:
  //       state.gemsText
  //       state.gemsGpValue
  //       state.gemsEncumbrance
  //
  //   - Does NOT print anything. The run() method will later assemble
  //     sections in canonical order.
  // ======================================================================

  treasureEngine.rollGems = function (schema, state) {
    state.gemsText = "";
    state.gemsGpValue = 0;
    state.gemsEncumbrance = 0;

    if (!schema || !schema.gems) {
      return;
    }

    var totalCount = 0;

    (schema.gems || []).forEach(function (spec) {
      // spec = { chance, dice, count }

      if (dice.percentChance(spec.chance)) {
        var die = (spec.dice || "").toLowerCase();
        var fn =
          die === "d2"   ? dice.d2   :
          die === "d3"   ? dice.d3   :
          die === "d4"   ? dice.d4   :
          die === "d6"   ? dice.d6   :
          die === "d8"   ? dice.d8   :
          die === "d10"  ? dice.d10  :
          die === "d12"  ? dice.d12  :
          die === "d20"  ? dice.d20  :
          die === "d50"  ? dice.d50  :
          die === "d100" ? dice.d100 :
          null;

        if (typeof fn === "function") {
          var count = fn(spec.count);
          if (count > 0) {
            totalCount += count;
          }
        }
      }
    });

    if (totalCount <= 0) {
      return;
    }

    // Prefer the structured helper when available.
    if (typeof houseGems === "object" &&
        houseGems !== null &&
        typeof houseGems.bundleForCount === "function") {

      var bundle = houseGems.bundleForCount(totalCount) || {};
      state.gemsText = (bundle.text || "").trim();
      state.gemsGpValue = bundle.totalGp || 0;
      state.gemsEncumbrance = bundle.totalP || 0;

    } else if (typeof oddTables === "object" &&
               oddTables !== null &&
               typeof oddTables.gems === "function") {

      var legacy = oddTables.gems(totalCount);
      state.gemsText = (legacy || "").trim();
      // In legacy mode we have no structured totals, so leave gp/p at 0.
      state.gemsGpValue = 0;
      state.gemsEncumbrance = 0;
    }
  };

  // ======================================================================
  // SECTION 4.3 — JEWELRY + BOOK / VALUABLE SWAPS (isolated helper)
  // ======================================================================
  //
  // rollJewelryWithSwaps(attemptCount, state)
  //
  //   - Mirrors the behavior of oddTables.jewelry(number):
  //       * For each attempt, roll d100 to select value band:
  //           <= 20  -> 3d6 * 100 gp   (low band)
  //           <= 80  -> 1d6 * 1000 gp  (mid band)
  //           >  80  -> 1d10 * 1000 gp (high band)
  //       * 1-in-6 chance per item to swap:
  //           - Low band  -> Book (bookFromValue)
  //           - Mid/High  -> Valuable (valuableFromValue)
  //       * Otherwise, keeps the gp value as jewelry.
  //
  //   - Populates state fields:
  //       state.jewelryText          (string, may be empty)
  //       state.jewelryGpValue       (number, total gp from jewelry)
  //       state.jewelryEncumbrance   (number, total p. from jewelry)
  //
  //       state.booksLines           (array of strings)
  //       state.booksGpValue         (number, total gp from books)
  //       state.booksEncumbrance     (number, total p. from books)
  //
  //       state.valuablesLines       (array of strings)
  //       state.valuablesGpValue     (number, total gp from valuables)
  //       state.valuablesEncumbrance (number, total p. from valuables)
  //
  //   - Requires:
  //       houseJewelry.bundleForValues(values) for canonical jewelry text
  //       bookFromValue(gp), valuableFromValue(gp) for swaps
  //
  //   - Does NOT print anything and does NOT know about schemas yet.
  // ======================================================================

  treasureEngine.rollJewelryWithSwaps = function (attemptCount, state) {
    // Normalize attemptCount
    if (typeof attemptCount !== "number" || attemptCount <= 0) {
      attemptCount = 0;
    } else {
      attemptCount = Math.floor(attemptCount);
    }

    // Initialize jewelry/book/valuable state
    state.jewelryText = "";
    state.jewelryGpValue = 0;
    state.jewelryEncumbrance = 0;

    state.booksLines = [];
    state.booksGpValue = 0;
    state.booksEncumbrance = 0;

    state.valuablesLines = [];
    state.valuablesGpValue = 0;
    state.valuablesEncumbrance = 0;

    if (attemptCount <= 0) {
      return;
    }

    // Local helper to mirror the legacy _bookOneLine() normalization
    function _bookOneLine(gpVal) {
      if (typeof bookFromValue !== "function") {
        return String(gpVal) + "gp. (100p.) Book";
      }

      var s = bookFromValue(gpVal);
      if (typeof s !== "string") return (s + "");

      var lines = s
        .split("\n")
        .map(function (t) { return t.trim(); })
        .filter(Boolean);

      if (lines.length === 1) return lines[0];

      // Legacy defensive logic: try to find the "gp. Book" line + title line and reorder.
      var gpIdx = -1;
      for (var i = 0; i < lines.length; i++) {
        if (/\bgp\.\s*Book\b/.test(lines[i])) {
          gpIdx = i;
          break;
        }
      }
      var titleIdx = (gpIdx === 0 && lines.length > 1)
        ? 1
        : (gpIdx > 0 ? 0 : -1);

      if (gpIdx !== -1 && titleIdx !== -1) {
        return lines[titleIdx] + " " + lines[gpIdx];
      }
      return lines.join(" ");
    }

    var jewelryValues = [];   // gp values that remain jewelry
    var bookLines = [];       // lines for Books section
    var valuableLines = [];   // lines for Valuables section

    while (attemptCount > 0) {
      var roll = dice.d100(1);
      var val;

      if (roll <= 20) {
        // Low band: 3d6 * 100 gp
        val = dice.d6(3) * 100;
      } else if (roll <= 80) {
        // Mid band: 1d6 * 1000 gp
        val = dice.d6(1) * 1000;
      } else {
        // High band: 1d10 * 1000 gp
        val = dice.d10(1) * 1000;
      }

      // 1-in-6 swap per item
      if (dice.d6(1) === 1) {
        // Low band swap -> Book
        if (roll <= 20 && typeof bookFromValue === "function") {
          var bLine = _bookOneLine(val);
          bLine = (bLine || "").trim();
          if (bLine) {
            bookLines.push(bLine);
            // Parse gp/p. from prefix, e.g. "1100gp. (100p.) Book: ..."
            var bm = /^(\d+)gp\. \((\d+)p\.\)/.exec(bLine);
            if (bm) {
              state.booksGpValue += parseInt(bm[1], 10);
              state.booksEncumbrance += parseInt(bm[2], 10);
            }
          }
        }
        // Mid/High swap -> Valuable
        else if (typeof valuableFromValue === "function") {
          var vLine = valuableFromValue(val);
          vLine = (vLine || "").trim();
          if (vLine) {
            valuableLines.push(vLine);
            // Parse gp/p. from prefix, e.g. "2000gp. (50p.) <text>."
            var vm = /^(\d+)gp\. \((\d+)p\.\)/.exec(vLine);
            if (vm) {
              state.valuablesGpValue += parseInt(vm[1], 10);
              state.valuablesEncumbrance += parseInt(vm[2], 10);
            }
          }
        } else {
          // If no book/valuable functions, keep as jewelry
          jewelryValues.push(val);
        }
      } else {
        // No swap: stays as jewelry
        jewelryValues.push(val);
      }

      attemptCount -= 1;
    }

    // JEWELRY: use structured helper when available
    if (jewelryValues.length > 0 &&
        typeof houseJewelry === "object" &&
        houseJewelry !== null &&
        typeof houseJewelry.bundleForValues === "function") {

      var jBundle = houseJewelry.bundleForValues(jewelryValues) || {};
      state.jewelryText = (jBundle.text || "").trim();
      state.jewelryGpValue = jBundle.totalGp || 0;
      state.jewelryEncumbrance = jBundle.totalP || 0;
    }

    // BOOKS and VALUABLES: copy lines into state
    if (bookLines.length > 0) {
      state.booksLines = bookLines.slice();
    }
    if (valuableLines.length > 0) {
      state.valuablesLines = valuableLines.slice();
    }
  };

  // ======================================================================
  // SECTION 4.4 — MAGIC + TREASURE MAPS ENGINE (plans + runner)
  // ======================================================================
  //
  // rollMagicAndMaps(magicKey, state)
  //
  //   - Initializes magic/maps state on the given state object:
  //       state.magicItems = []  // array of strings
  //       state.mapsList   = []  // array of strings
  //
  //   - Looks up a plan in treasureEngine.MAGIC_PLANS[magicKey].
  //     If the plan is a function, calls:
  //         plan(state)
  //     and expects that plan to push strings into:
  //         state.magicItems
  //         state.mapsList
  //
  //   - This engine does NOT assign gp value or encumbrance to magic or
  //     maps, in keeping with the global rule that they never contribute
  //     to GRAND TOTAL.
  //
  //   - All canonical behavior (potions/scrolls, magic vs map splits,
  //     number of rolls, etc.) will later be encoded in MAGIC_PLANS
  //     entries such as:
  //         treasureEngine.MAGIC_PLANS.TTA_LAND = function (state) { ... }
  //
  //   - For now, this is just the common runner + state structure.
  // ======================================================================

  treasureEngine.rollMagicAndMaps = function (magicKey, state) {
    // Initialize magic/maps arrays on state
    state.magicItems = [];
    state.mapsList = [];

    if (!magicKey) {
      return;
    }

    var plans = treasureEngine.MAGIC_PLANS || {};
    var plan = plans[magicKey];

    if (typeof plan === "function") {
      // Delegate all canonical behavior to the plan function.
      // The plan can call oddTables.magicItem(), maps.treasureMap(), etc.
      plan(state);
    }
  };

  // ======================================================================
  // INTERNAL HELPER — REPLICATES oddTables.magicOrMap() BUT ROUTES
  // OUTPUTS TO MAGIC ITEMS vs MAPS (75% / 25% SPLIT)
  // ======================================================================

  treasureEngine._magicOrMapRolls = function (count, state) {
    var n = (typeof count === "number" && count > 0) ? Math.floor(count) : 0;
    if (n <= 0) return;

    for (var i = 0; i < n; i++) {
      var roll = dice.d100(1);

      // 75% → magic item
      if (roll <= 75) {
        if (typeof oddTables === "object" &&
            oddTables !== null &&
            typeof oddTables.magicItem === "function") {

          var mi = oddTables.magicItem();
          if (mi) {
            state.magicItems.push(String(mi).trim());
          }
        }
      }

      // 25% → treasure map
      else {
        if (typeof maps === "object" &&
            maps !== null &&
            typeof maps.treasureMap === "function") {

          var tm = maps.treasureMap();
          if (tm) {
            state.mapsList.push(String(tm).trim());
          }
        }
      }
    }
  };

  // ======================================================================
  // SECTION 5 — SECTION ASSEMBLY HELPERS (text only, no schemas)
  // ======================================================================
  //
  // These helpers take a populated state object (coins, gems, jewelry,
  // books, valuables, magic, maps) and build the final text sections in
  // canonical order:
  //
  //   MAGIC ITEMS → TREASURE MAPS → VALUABLE ITEMS → BOOKS →
  //   JEWELRY → GEMS → COINAGE
  //
  // They do NOT roll anything and do NOT know about specific treasure
  // types. They only format what is already in state.
  // ======================================================================

  // Small helper: append a labeled section if body is non-empty.
  // Returns an updated string; does not mutate the original.
  treasureEngine._appendSection = function (currentText, label, body) {
    if (!body) return currentText;

    // Ensure body is trimmed but preserve internal newlines
    body = String(body).replace(/\s+$/, "");

    if (!currentText) {
      return label + ":\n" + body;
    } else {
      // One blank line between sections
      return currentText + "\n\n" + label + ":\n" + body;
    }
  };

  // Build all treasure sections (without title line, without GRAND TOTAL).
  // Expects state fields:
  //   magicItems:   string[]
  //   mapsList:     string[]
  //   valuablesLines: string[]
  //   booksLines:     string[]
  //   jewelryText:    string
  //   gemsText:       string
  //   coinLines:      string[]
  //
  // Returns a single multi-line string with headings and bodies.

   treasureEngine.buildBodyFromState = function (state) {
    var text = "";

    // MAGIC ITEMS: each item separated by a blank line
    var magicBody = "";
    if (Array.isArray(state.magicItems) && state.magicItems.length > 0) {
      magicBody = state.magicItems.join("\n\n");
    }

    // TREASURE MAPS: each map separated by a blank line
    var mapsBody = "";
    if (Array.isArray(state.mapsList) && state.mapsList.length > 0) {
      mapsBody = state.mapsList.join("\n\n");
    }

    // VALUABLE ITEMS: one per line + optional subtotal
    var valuablesBody = "";
    if (Array.isArray(state.valuablesLines) && state.valuablesLines.length > 0) {
      var vLines = state.valuablesLines.slice(); // don’t mutate state
      if (vLines.length > 1 && state.valuablesGpValue && state.valuablesGpValue > 0) {
        var vTotalLine =
          state.valuablesGpValue + "gp. Total items value (" +
          (state.valuablesEncumbrance || 0) + "p. Total items encumbrance)";
        vLines.push(vTotalLine);
      }
      valuablesBody = vLines.join("\n");
    }

    // BOOKS: one per line + optional subtotal
    var booksBody = "";
    if (Array.isArray(state.booksLines) && state.booksLines.length > 0) {
      var bLines = state.booksLines.slice(); // don’t mutate state
      if (bLines.length > 1 && state.booksGpValue && state.booksGpValue > 0) {
        var bTotalLine =
          state.booksGpValue + "gp. Total book value (" +
          (state.booksEncumbrance || 0) + "p. Total book encumbrance)";
        bLines.push(bTotalLine);
      }
      booksBody = bLines.join("\n");
    }

    // JEWELRY: full block from houseJewelry.bundleForValues
    var jewelryBody = "";
    if (state.jewelryText) {
      jewelryBody = String(state.jewelryText).trim();
    }

    // GEMS: full block from houseGems.bundleForCount
    var gemsBody = "";
    if (state.gemsText) {
      gemsBody = String(state.gemsText).trim();
    }

    // COINAGE: one line per coin type + optional total line
    var coinsBody = "";
    if (Array.isArray(state.coinLines) && state.coinLines.length > 0) {
      coinsBody = state.coinLines.join("\n");
    }

    // Canonical order:
    text = treasureEngine._appendSection(text, "MAGIC ITEMS", magicBody);
    text = treasureEngine._appendSection(text, "MAPS", mapsBody);
    text = treasureEngine._appendSection(text, "ITEMS", valuablesBody);
    text = treasureEngine._appendSection(text, "BOOKS", booksBody);
    text = treasureEngine._appendSection(text, "JEWELRY", jewelryBody);
    text = treasureEngine._appendSection(text, "GEMS", gemsBody);
    text = treasureEngine._appendSection(text, "COINAGE", coinsBody);

    return text;
  };

  // ======================================================================
  // GRAND TOTAL HELPER (coins + gems + jewelry + books + valuables)
  // ======================================================================
  //
  // buildGrandTotal(state)
  //
  // Uses numeric totals already stored on state:
  //   totalCoinGpValue, totalCoinEncumbrance
  //   gemsGpValue,      gemsEncumbrance
  //   jewelryGpValue,   jewelryEncumbrance
  //   booksGpValue,     booksEncumbrance
  //   valuablesGpValue, valuablesEncumbrance
  //
  // Returns either:
  //   ""  (no GRAND TOTAL to print), or
  //   "GRAND TOTAL:\n<line>"
  //
  // Rule:
  //   - Only include categories where gp total > 0.
  //   - Only print GRAND TOTAL when more than one valued category contributes.
  // ======================================================================

  treasureEngine.buildGrandTotal = function (state) {
    var gtGp = 0;
    var gtEnc = 0;
    var contributors = 0;

    // Coins
    if (state.totalCoinGpValue && state.totalCoinGpValue > 0) {
      gtGp += state.totalCoinGpValue;
      gtEnc += state.totalCoinEncumbrance || 0;
      contributors += 1;
    }

    // Gems
    if (state.gemsGpValue && state.gemsGpValue > 0) {
      gtGp += state.gemsGpValue;
      gtEnc += state.gemsEncumbrance || 0;
      contributors += 1;
    }

    // Jewelry
    if (state.jewelryGpValue && state.jewelryGpValue > 0) {
      gtGp += state.jewelryGpValue;
      gtEnc += state.jewelryEncumbrance || 0;
      contributors += 1;
    }

    // Books
    if (state.booksGpValue && state.booksGpValue > 0) {
      gtGp += state.booksGpValue;
      gtEnc += state.booksEncumbrance || 0;
      contributors += 1;
    }

    // Valuables
    if (state.valuablesGpValue && state.valuablesGpValue > 0) {
      gtGp += state.valuablesGpValue;
      gtEnc += state.valuablesEncumbrance || 0;
      contributors += 1;
    }

    if (contributors <= 1 || gtGp <= 0) {
      return "";
    }

    return "GRAND TOTAL:\n" +
      gtGp + "gp. Treasure value (" +
      gtEnc + "p. encumbrance)";
  };

  // ======================================================================
  // SECTION 6 — FULL OUTPUT ASSEMBLY (title + body + GRAND TOTAL)
  // ======================================================================
  //
  // buildFullOutput(title, state)
  //
  //   - title: string for the first line (e.g., "// Treasure Type A (Land) //")
  //   - state: object populated by the various roll* engines
  //
  // Returns a single string:
  //   <title>\n\n<sections>[\n\nGRAND TOTAL:\n...]\n
  //
  // Notes:
  //   - If there are no non-empty sections, returns just the title + "\n".
  //   - GRAND TOTAL block is appended only when buildGrandTotal(state)
  //     returns a non-empty string.
  // ======================================================================

  treasureEngine.buildFullOutput = function (title, state) {
    var safeTitle = String(title || "").trim();
    if (!safeTitle) {
      safeTitle = "// Treasure //";
    }

    // Build the sections body (may be empty string)
    var body = treasureEngine.buildBodyFromState(state || {});

    // Build GRAND TOTAL (may be empty string)
    var grand = treasureEngine.buildGrandTotal(state || {});

    var out = safeTitle;

    if (body) {
      out += "\n\n" + body;
    }

    if (grand) {
      out += "\n\n" + grand;
    }

    // Final trailing newline for consistency with existing oddTables output
    out += "\n";

    return out;
  };

// ======================================================================
// SECTION X — WILDERNESS TREASURE TABLES (A–I, with variants)
// ======================================================================
//
// Each schema below uses the shared engines:
//   - rollCoins()
//   - rollGems()
//   - rollJewelryWithSwaps()
//   - rollMagicAndMaps()
//   - _magicOrMapRolls()
//   - applyNilSafeguard() via run()
//
// All numeric chances, dice expressions, and counts are taken directly
// from the legacy oddTables code you provided.
//
// ======================================================================


// ---------------------------------------------------------------
// MAGIC PLANS
// ---------------------------------------------------------------

// TTA_LAND magic plan (40%, 3 rolls, 75% magic / 25% map)
treasureEngine.MAGIC_PLANS.TTA_LAND = function (state) {
  if (!dice.percentChance(40)) return;
  treasureEngine._magicOrMapRolls(3, state);
};

// TTA_DESERT magic plan (60%, 3 magic items — Desert table had no maps)
treasureEngine.MAGIC_PLANS.TTA_DESERT = function (state) {
  if (!dice.percentChance(60)) return;

  for (var i = 0; i < 3; i++) {
    if (typeof oddTables.magicItem === "function") {
      var mi = oddTables.magicItem();
      if (mi) state.magicItems.push(String(mi).trim());
    }
  }
};

// TTA_WATER magic plan (50%, 1 map)
treasureEngine.MAGIC_PLANS.TTA_WATER = function (state) {
  if (!dice.percentChance(50)) return;

  if (typeof maps.treasureMap === "function") {
    var m = maps.treasureMap();
    if (m) state.mapsList.push(String(m).trim());
  }
};

// TTB magic plan (10%, 1 magicItemArms)
treasureEngine.MAGIC_PLANS.TTB = function (state) {
  if (!dice.percentChance(10)) return;

  if (typeof oddTables.magicItemArms === "function") {
    var mi = oddTables.magicItemArms();
    if (mi) state.magicItems.push(String(mi).trim());
  }
};

// TTC magic plan (40%, 2 rolls → magicOrMap)
treasureEngine.MAGIC_PLANS.TTC = function (state) {
  if (!dice.percentChance(40)) return;
  treasureEngine._magicOrMapRolls(2, state);
};

// TTD magic plan (40%, potion + 2 rolls magicOrMap)
treasureEngine.MAGIC_PLANS.TTD = function (state) {
  if (!dice.percentChance(40)) return;

  if (typeof oddTables.potion === "function") {
    var pot = oddTables.potion(true);
    if (pot) state.magicItems.push(String(pot).trim());
  }

  treasureEngine._magicOrMapRolls(2, state);
};

// TTE magic plan (40%, scroll + 3 rolls magicOrMap)
treasureEngine.MAGIC_PLANS.TTE = function (state) {
  if (!dice.percentChance(40)) return;

  if (typeof oddTables.scroll === "function") {
    var scr = oddTables.scroll(true);
    if (scr) state.magicItems.push(String(scr).trim());
  }

  treasureEngine._magicOrMapRolls(3, state);
};

// TTF magic plan (35%, potion + scroll + 3× no-arms items)
treasureEngine.MAGIC_PLANS.TTF = function (state) {
  if (!dice.percentChance(35)) return;

  if (typeof oddTables.potion === "function") {
    var pot = oddTables.potion(true);
    if (pot) state.magicItems.push(String(pot).trim());
  }

  if (typeof oddTables.scroll === "function") {
    var scr = oddTables.scroll(true);
    if (scr) state.magicItems.push(String(scr).trim());
  }

  if (typeof oddTables.magicItemNoArms === "function") {
    for (var i = 0; i < 3; i++) {
      var mi = oddTables.magicItemNoArms();
      if (mi) state.magicItems.push(String(mi).trim());
    }
  }
};

// TTG magic plan (40%, scroll + 4 rolls magicOrMap)
treasureEngine.MAGIC_PLANS.TTG = function (state) {
  if (!dice.percentChance(40)) return;

  if (typeof oddTables.scroll === "function") {
    var scr = oddTables.scroll(true);
    if (scr) state.magicItems.push(String(scr).trim());
  }

  treasureEngine._magicOrMapRolls(4, state);
};

// TTH_HALF magic plan (20%, optional potion, optional scroll, + 2× magic/map)
treasureEngine.MAGIC_PLANS.TTH_HALF = function (state) {
  if (!dice.percentChance(20)) return;

  if (dice.percentChance(50) && typeof oddTables.potion === "function") {
    var pot = oddTables.potion(true);
    if (pot) state.magicItems.push(String(pot).trim());
  }
  if (dice.percentChance(50) && typeof oddTables.scroll === "function") {
    var scr = oddTables.scroll(true);
    if (scr) state.magicItems.push(String(scr).trim());
  }

  treasureEngine._magicOrMapRolls(2, state);
};

// TTH_FULL magic plan (20%, potion + scroll + 4 rolls magicOrMap)
treasureEngine.MAGIC_PLANS.TTH_FULL = function (state) {
  if (!dice.percentChance(20)) return;

  if (typeof oddTables.potion === "function") {
    var pot = oddTables.potion(true);
    if (pot) state.magicItems.push(String(pot).trim());
  }
  if (typeof oddTables.scroll === "function") {
    var scr = oddTables.scroll(true);
    if (scr) state.magicItems.push(String(scr).trim());
  }

  treasureEngine._magicOrMapRolls(4, state);
};

// TTH_DOUBLE magic plan (20%, 2× potion, 2× scroll, 8× magicOrMap)
treasureEngine.MAGIC_PLANS.TTH_DOUBLE = function (state) {
  if (!dice.percentChance(20)) return;

  for (var i = 0; i < 2; i++) {
    var pot = oddTables.potion(true);
    if (pot) state.magicItems.push(String(pot).trim());
  }

  for (var j = 0; j < 2; j++) {
    var scr = oddTables.scroll(true);
    if (scr) state.magicItems.push(String(scr).trim());
  }

  treasureEngine._magicOrMapRolls(8, state);
};

// TTI magic plan (20%, 1 roll magicOrMap)
treasureEngine.MAGIC_PLANS.TTI = function (state) {
  if (!dice.percentChance(20)) return;
  treasureEngine._magicOrMapRolls(1, state);
};


// ---------------------------------------------------------------
// SCHEMAS (NON-MAGIC)
// ---------------------------------------------------------------

// ----- A (Land) -----
treasureEngine.TREASURE_SCHEMAS.TTA_LAND = {
  title: "// Treasure Type A (Land) //",
  coins: [
    { type: "cp", chance: 25, dice: "d6", count: 1, multiplier: 1000 },
    { type: "sp", chance: 30, dice: "d6", count: 1, multiplier: 1000 },
    { type: "gp", chance: 35, dice: "d6", count: 2, multiplier: 1000 }
  ],
  gems: [
    { chance: 50, dice: "d6", count: 6 }
  ],
  rollNonMagic: function (state) {
    treasureEngine.rollCoins(this, state);
    treasureEngine.rollGems(this, state);
    if (dice.percentChance(50)) {
      treasureEngine.rollJewelryWithSwaps(dice.d6(6), state);
    }
  },
  rollMagicAndMaps: function (state) {
    treasureEngine.rollMagicAndMaps("TTA_LAND", state);
  }
};

// ----- A (Desert) -----
treasureEngine.TREASURE_SCHEMAS.TTA_DESERT = {
  title: "// Treasure Type A (Desert) //",
  coins: [
    { type: "cp", chance: 20, dice: "d4", count: 1, multiplier: 1000 },
    { type: "sp", chance: 25, dice: "d4", count: 1, multiplier: 1000 },
    { type: "gp", chance: 30, dice: "d6", count: 1, multiplier: 1000 }
  ],
  gems: [
    { chance: 50, dice: "d4", count: 10 }
  ],
  rollNonMagic: function (state) {
    treasureEngine.rollCoins(this, state);
    treasureEngine.rollGems(this, state);

    if (dice.percentChance(50)) {
      treasureEngine.rollJewelryWithSwaps(dice.d4(10), state);
    }
  },
  rollMagicAndMaps: function (state) {
    treasureEngine.rollMagicAndMaps("TTA_DESERT", state);
  }
};

// ----- A (Water) -----
treasureEngine.TREASURE_SCHEMAS.TTA_WATER = {
  title: "// Treasure Type A (Water) //",
  coins: [
    { type: "gp", chance: 60, dice: "d6", count: 5, multiplier: 1000 }
  ],
  gems: [
    { chance: 60, dice: "d6", count: 10 }
  ],
  rollNonMagic: function (state) {
    treasureEngine.rollCoins(this, state);
    treasureEngine.rollGems(this, state);

    if (dice.percentChance(60)) {
      treasureEngine.rollJewelryWithSwaps(dice.d6(10), state);
    }
  },
  rollMagicAndMaps: function (state) {
    treasureEngine.rollMagicAndMaps("TTA_WATER", state);
  }
};

// ----- B -----
treasureEngine.TREASURE_SCHEMAS.TTB = {
  title: "// Treasure Type B //",
  coins: [
    { type: "cp", chance: 50, dice: "d8", count: 1, multiplier: 1000 },
    { type: "sp", chance: 25, dice: "d6", count: 1, multiplier: 1000 },
    { type: "gp", chance: 25, dice: "d3", count: 2, multiplier: 1000 }
  ],
  gems: [
    { chance: 25, dice: "d6", count: 1 }
  ],
  rollNonMagic: function (state) {
    treasureEngine.rollCoins(this, state);
    treasureEngine.rollGems(this, state);

    if (dice.percentChance(25)) {
      treasureEngine.rollJewelryWithSwaps(dice.d6(1), state);
    }
  },
  rollMagicAndMaps: function (state) {
    treasureEngine.rollMagicAndMaps("TTB", state);
  }
};

// ----- C -----
treasureEngine.TREASURE_SCHEMAS.TTC = {
  title: "// Treasure Type C //",
  coins: [
    { type: "cp", chance: 20, dice: "d12", count: 1, multiplier: 1000 },
    { type: "sp", chance: 30, dice: "d4", count: 1, multiplier: 1000 }
  ],
  gems: [
    { chance: 25, dice: "d4", count: 1 }
  ],
  rollNonMagic: function (state) {
    treasureEngine.rollCoins(this, state);
    treasureEngine.rollGems(this, state);

    if (dice.percentChance(25)) {
      treasureEngine.rollJewelryWithSwaps(dice.d4(1), state);
    }
  },
  rollMagicAndMaps: function (state) {
    treasureEngine.rollMagicAndMaps("TTC", state);
  }
};

// ----- D -----
treasureEngine.TREASURE_SCHEMAS.TTD = {
  title: "// Treasure Type D //",
  coins: [
    { type: "cp", chance: 10, dice: "d8", count: 1, multiplier: 1000 },
    { type: "sp", chance: 15, dice: "d12", count: 1, multiplier: 1000 },
    { type: "gp", chance: 60, dice: "d6", count: 1, multiplier: 1000 }
  ],
  gems: [
    { chance: 30, dice: "d8", count: 1 }
  ],
  rollNonMagic: function (state) {
    treasureEngine.rollCoins(this, state);
    treasureEngine.rollGems(this, state);

    if (dice.percentChance(30)) {
      treasureEngine.rollJewelryWithSwaps(dice.d8(1), state);
    }
  },
  rollMagicAndMaps: function (state) {
    treasureEngine.rollMagicAndMaps("TTD", state);
  }
};

// ----- E -----
treasureEngine.TREASURE_SCHEMAS.TTE = {
  title: "// Treasure Type E //",
  coins: [
    { type: "cp", chance: 5, dice: "d10", count: 1, multiplier: 1000 },
    { type: "sp", chance: 30, dice: "d12", count: 1, multiplier: 1000 },
    { type: "gp", chance: 25, dice: "d8", count: 1, multiplier: 1000 }
  ],
  gems: [
    { chance: 10, dice: "d10", count: 1 }
  ],
  rollNonMagic: function (state) {
    treasureEngine.rollCoins(this, state);
    treasureEngine.rollGems(this, state);

    if (dice.percentChance(10)) {
      treasureEngine.rollJewelryWithSwaps(dice.d10(1), state);
    }
  },
  rollMagicAndMaps: function (state) {
    treasureEngine.rollMagicAndMaps("TTE", state);
  }
};

// ----- F -----
treasureEngine.TREASURE_SCHEMAS.TTF = {
  title: "// Treasure Type F //",
  coins: [
    { type: "sp", chance: 10, dice: "d10", count: 2, multiplier: 1000 },
    { type: "gp", chance: 25, dice: "d12", count: 1, multiplier: 1000 }
  ],
  gems: [
    { chance: 20, dice: "d12", count: 2 }
  ],
  rollNonMagic: function (state) {
    treasureEngine.rollCoins(this, state);
    treasureEngine.rollGems(this, state);

    if (dice.percentChance(20)) {
      treasureEngine.rollJewelryWithSwaps(dice.d12(2), state);
    }
  },
  rollMagicAndMaps: function (state) {
    treasureEngine.rollMagicAndMaps("TTF", state);
  }
};

// ----- G -----
treasureEngine.TREASURE_SCHEMAS.TTG = {
  title: "// Treasure Type G //",
  coins: [
    { type: "gp", chance: 75, dice: "d4", count: 1, multiplier: 10000 }
  ],
  gems: [
    { chance: 25, dice: "d6", count: 3 }
  ],
  rollNonMagic: function (state) {
    treasureEngine.rollCoins(this, state);
    treasureEngine.rollGems(this, state);

    if (dice.percentChance(25)) {
      treasureEngine.rollJewelryWithSwaps(dice.d10(1), state);
    }
  },
  rollMagicAndMaps: function (state) {
    treasureEngine.rollMagicAndMaps("TTG", state);
  }
};

// ----- H (Half) -----
treasureEngine.TREASURE_SCHEMAS.TTH_HALF = {
  title: "// Treasure Type H (Half) //",
  coins: [
    { type: "cp", chance: 25, dice: "d8", count: 3, multiplier: 500 },
    { type: "sp", chance: 50, dice: "d100", count: 1, multiplier: 500 },
    { type: "gp", chance: 75, dice: "d6", count: 1, multiplier: 5000 }
  ],
  gems: [
    { chance: 50, dice: "d50", count: 1 }
  ],
  rollNonMagic: function (state) {
    treasureEngine.rollCoins(this, state);
    treasureEngine.rollGems(this, state);

    if (dice.percentChance(50)) {
      treasureEngine.rollJewelryWithSwaps(dice.d2(1) * 10, state);
    }
  },
  rollMagicAndMaps: function (state) {
    treasureEngine.rollMagicAndMaps("TTH_HALF", state);
  }
};

// ----- H (Full) -----
treasureEngine.TREASURE_SCHEMAS.TTH_FULL = {
  title: "// Treasure Type H //",
  coins: [
    { type: "cp", chance: 25, dice: "d8", count: 3, multiplier: 1000 },
    { type: "sp", chance: 50, dice: "d100", count: 1, multiplier: 1000 },
    { type: "gp", chance: 75, dice: "d6", count: 1, multiplier: 10000 }
  ],
  gems: [
    { chance: 50, dice: "d100", count: 1 }
  ],
  rollNonMagic: function (state) {
    treasureEngine.rollCoins(this, state);
    treasureEngine.rollGems(this, state);

    if (dice.percentChance(50)) {
      treasureEngine.rollJewelryWithSwaps(dice.d4(1) * 10, state);
    }
  },
  rollMagicAndMaps: function (state) {
    treasureEngine.rollMagicAndMaps("TTH_FULL", state);
  }
};

// ----- H (Double) -----
treasureEngine.TREASURE_SCHEMAS.TTH_DOUBLE = {
  title: "// Treasure Type H (Double) //",
  coins: [
    { type: "cp", chance: 25, dice: "d8", count: 3, multiplier: 2000 },
    { type: "sp", chance: 50, dice: "d100", count: 1, multiplier: 2000 },
    { type: "gp", chance: 75, dice: "d6", count: 1, multiplier: 20000 }
  ],
  gems: [
    { chance: 50, dice: "d100", count: 2 }
  ],
  rollNonMagic: function (state) {
    treasureEngine.rollCoins(this, state);
    treasureEngine.rollGems(this, state);

    if (dice.percentChance(50)) {
      treasureEngine.rollJewelryWithSwaps(dice.d4(2) * 10, state);
    }
  },
  rollMagicAndMaps: function (state) {
    treasureEngine.rollMagicAndMaps("TTH_DOUBLE", state);
  }
};

// ----- I -----
treasureEngine.TREASURE_SCHEMAS.TTI = {
  title: "// Treasure Type I //",
  coins: [],
  gems: [
    { chance: 50, dice: "d8", count: 2 }
  ],
  rollNonMagic: function (state) {
    treasureEngine.rollCoins(this, state);
    treasureEngine.rollGems(this, state);

    if (dice.percentChance(50)) {
      treasureEngine.rollJewelryWithSwaps(dice.d8(2), state);
    }
  },
  rollMagicAndMaps: function (state) {
    treasureEngine.rollMagicAndMaps("TTI", state);
  }
};

  // ==================================================================
  // END OF CURRENT IMPLEMENTATION PHASE
  // ==================================================================

})(typeof window !== "undefined" ? window : globalThis);
