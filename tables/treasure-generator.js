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
  // 1. Public API placeholders (no logic yet)
  // ---------------------------------------------------------------

  // Running the engine before it's implemented will give clear feedback.
  treasureEngine.run = function (schemaKey) {
    return `treasureEngine.run("${schemaKey}") called, but engine not implemented yet.`;
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
          die === "d4"   ? dice.d4   :
          die === "d6"   ? dice.d6   :
          die === "d8"   ? dice.d8   :
          die === "d10"  ? dice.d10  :
          die === "d12"  ? dice.d12  :
          die === "d20"  ? dice.d20  :
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
          die === "d4"   ? dice.d4   :
          die === "d6"   ? dice.d6   :
          die === "d8"   ? dice.d8   :
          die === "d10"  ? dice.d10  :
          die === "d12"  ? dice.d12  :
          die === "d20"  ? dice.d20  :
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


  // ==================================================================
  // END OF CURRENT IMPLEMENTATION PHASE
  // ==================================================================

})(typeof window !== "undefined" ? window : globalThis);
