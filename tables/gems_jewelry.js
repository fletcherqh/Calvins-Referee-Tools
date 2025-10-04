/* Calvin’s Referee Tools • Gems & Jewelry v1.0.0
 * File: tables/gems_jewelry.js (dropped here as .txt per user request)
 *
 * Scope:
 *  - Pure string builders (no DOM, no logging, no side effects).
 *  - No adapters and no rewiring here. We’ll wire to JB anchors later.
 *
 * Exposes (globals):
 *  - houseGems.lineForOne()                 -> string (1 gem line; may add extra lines for Quest/Geas/Curse)
 *  - houseGems.linesForCount(count)         -> string (grouped gem lines + totals, ends with \n)
 *  - houseJewelry.lineForValue(gp)          -> string (1 jewelry line; may add extra lines for Quest/Geas/Curse)
 *  - houseJewelry.linesForValues(gpArray)   -> string (grouped jewelry lines + totals, ends with \n)
 *
 * Formatting targets (per Spec v1.2; strict):
 *  Gems singleton:  "100gp. (10p.) Medium Diamond"
 *  Gems group:      "500gp. value (50p.) from sum of 5 Medium Rubies, 100gp. (10p.) each"
 *  Gems totals:     "1100gp. Total gem value (85p. Total gem encumbrance)"
 *  Jewelry item:    "[gp.] (100p.) <Metal> & <Gem Type> <Item Type>[; enchanted to …]"
 *  Jewelry group:   "[TOTAL]gp. value ([TOTAL_P]p.) from sum of [COUNT] <Metal> & <Gem> <ItemPlural>, [EACH]gp. (100p.) each"
 *  Jewelry totals:  "[SUM]gp. Total jewelry value ([SUM_P]p. Total jewelry encumbrance)"
 *
 * Notes:
 *  - Gem >= 1000gp. is enchanted; Jewelry >= 7000gp. is enchanted.
 *  - For the three special enchantments (Quest/Geas/Curse), if global functions exist:
 *      randomQuestContract(), randomGeasContract(), randomCurseContract()
 *    we append their (possibly multi-line) strings starting on the next line.
 *  - RNG helpers inside to keep this standalone; later we can swap to dice.js if desired.
 */

(function (global) {
  'use strict';

  /* ========== RNG helpers (standalone, dice-faithful) ========== */
  function r(d) { return Math.floor(Math.random() * d) + 1; }            // 1..d
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }   // uniform
  function oneIn(n) { return r(n) === 1; }
  function dPercent() { return r(100); }

  /* ========== Constants & tables ========== */

  // Precious and Semiprecious type lists (spellings/diacritics preserved)
  var PRECIOUS_TYPES = ["Diamond","Emerald","Opal","Pearl","Ruby","Sapphire"];
  var SEMI_TYPES = [
    "Agate","Amber","Amethyst","Aquamarine","Aventurine","Barite","Bloodstone","Carnelian","Chalcedony",
    "Chrysoberyl","Chrysoprase","Coral","Fluorite","Garnet","Hematite","Ivory","Jade","Jasper","Jet","Labradorite",
    "Lapis Lazuli","Lazulite","Malachite","Moonstone","Nacre (Mother-of-pearl)","Obsidian","Onyx","Peridot","Porphyry",
    "Pyrite","Quartz","Sardonyx","Shell","Spinel","Sunstone","Tiger’s Eye","Topaz","Tourmaline","Turquoise","Zircon",
    "Fulgurite (lightning glass)"
  ];

  // Jewelry item types (d20 uniform)
  var JEWELRY_ITEMS = [
    "Anklet","Buckle","Bracelet","Bracer","Brooch","Circlet","Hair Clip","Comb","Crown","Greaves",
    "Medallion","Mirror","Necklace","Pendant","Earring","Ring","Nose Ring","Scabbard","Tiara","Trophy"
  ];

  // Precious / Base metals
  var COLORED_GOLD = ["Blue","Green","Red","Purple","White","Pink","Iridescent","Translucent"];
  var PRECIOUS_METALS = ["Colored Gold","Electrum","Gold","Gold","Silver","Silver"]; // d6 mapping
  var BASE_METALS =    ["Brass","Bronze","Copper","Pewter","Steel","Tin"];          // d6 mapping

  // Gem value steps (with 1-in-6 escalating rule)
  var VALUE_STEPS = [10, 50, 100, 500, 1000, 5000, 10000, 25000, 50000, 100000, 250000, 500000];

  // Size → encumbrance mappings (p.) by category & value
  var SIZE_ORDER = ["Tiny","Small","Medium","Large","Huge","Giant","Humongous"];
  function sizeEncFor(precious, value) {
    if (precious) {
      if (value <= 10)   return { size: "Tiny",   p: 1   };
      if (value <= 50)   return { size: "Small",  p: 5   };
      if (value <= 100)  return { size: "Medium", p: 10  };
      if (value <= 500)  return { size: "Large",  p: 25  };
      if (value <= 1000) return { size: "Huge",   p: 50  };
      return { size: "Giant", p: 100 }; // >1000 always Precious → Giant 100p.
    } else {
      if (value <= 10)   return { size: "Small",  p: 5   };
      if (value <= 50)   return { size: "Medium", p: 10  };
      if (value <= 100)  return { size: "Large",  p: 25  };
      if (value <= 500)  return { size: "Huge",   p: 50  };
      // At 1000, semiprecious is possible (d6=6); table says Giant 100p.
      return { size: "Giant", p: 100 };
    }
  }

  /* ========== Helpers: formatting & plurals ========== */
  function gp(n) { return String(n) + "gp."; }        // No thousands separators per current style
  function pUnits(n) { return String(n) + "p."; }     // Encumbrance

  // Gem type plural for group lines (overrides where requested)
  function pluralGemType(type) {
    var overrides = {
      "Tiger’s Eye": "Tiger Eye stones",
      "Tiger's Eye": "Tiger Eye stones",
      "Nacre (Mother-of-pearl)": "Nacre (Mother-of-pearl) stones",
      "Jade": "Jade stones",
      "Fulgurite (lightning glass)": "Fulgurites",
      "Porphyry": "Porphyry stones",
      "Sardonyx": "Sardonyx stones",
      "Lapis Lazuli": "Lapis Lazuli"
    };
    if (overrides[type]) return overrides[type];
    // default English-ish pluralization
    if (/y$/i.test(type) && !/[aeiou]y$/i.test(type)) return type.replace(/y$/i, "ies");
    if (/(s|x|z|ch|sh)$/i.test(type)) return type + "es";
    return type + "s";
  }

  function pluralItemType(item) {
    if (item === "Greaves") return "Greaves";
    if (/y$/i.test(item) && !/[aeiou]y$/i.test(item)) return item.replace(/y$/i, "ies"); // Trophy -> Trophies
    if (/(s|x|z|ch|sh)$/i.test(item)) return item + "es"; // Brooch -> Brooches
    return item + "s";
  }

  function sortGroupsByTotalThenLabel(groups) {
    // groups: array of { key, totalGp, label, ... }
    groups.sort(function(a, b) {
      if (b.totalGp !== a.totalGp) return b.totalGp - a.totalGp;
      if (a.label < b.label) return -1;
      if (a.label > b.label) return 1;
      return 0;
    });
  }

  /* ========== Enchantments ========== */

  var ENCHANTMENTS_BASE = [
    "Charm the bearer or character will not part from the item",
    "Mesmerize willing subjects",
    "sparkle on its own in darkness, glowing as bright as a candle",
    "Sing a ballad about the bearer",
    "Grant memory of the previous night’s dreams",
    "Present a miniature pyrotechnic display",
    "Serve as a magic mouth for the owner",
    "Ignite tender",
    "Provide deep sleep when placed under pillow at night, +1hp to rest",
    "Heal the bearer, +1hp, once per day",
    "Protect from poison & venom, granting an additional saving throw",
    "Protect from disease, granting an additional saving throw",
    "Protect from vampires (and other level draining attacks), granting a saving throw (or an additional one, if applicable) against one level of life energy drain",
    "Grant a bonus to Charisma when worn",
    "Grant a bonus to [Intelligence/Strength/Wisdom/Constitution/Dexterity]",
    "Restore life to a recently murdered innocent victim",
    "Restore life energy to bearer in exchange for draining life energy from another victim",
    "Place a Quest on the bearer of [index quest table]",
    "Place a Geas on the bearer of [index geas table]",
    "Place a Curse on the bearer of [index curse table]"
  ];

  // Jewelry-only addendum (metal-aware; timeframe randomized)
  function jewelryOnlyEnchantment(metal) {
    var mode = pick(["gazed upon","over the course of a " + pick(["month","week","day","hour"])]);
    return "stone set in worked " + metal + " flower that opens and closes when " + mode;
  }

  function pickEnchantment(isJewelry, metalForJewelry) {
    var pool = ENCHANTMENTS_BASE.slice();
    if (isJewelry) pool.push(jewelryOnlyEnchantment(metalForJewelry));
    var effect = typeof pool[0] === "function" ? pick(pool)() : pick(pool);
    if (typeof effect === "function") effect = effect(); // just in case
    return effect;
  }

  function maybeAppendSubtableLines(effect) {
    // For Quest/Geas/Curse, append new lines if API exists
    try {
      if (/Quest on the bearer/i.test(effect) && typeof global.randomQuestContract === "function") {
        return "\n" + global.randomQuestContract();
      }
      if (/Geas on the bearer/i.test(effect) && typeof global.randomGeasContract === "function") {
        return "\n" + global.randomGeasContract();
      }
      if (/Curse on the bearer/i.test(effect) && typeof global.randomCurseContract === "function") {
        return "\n" + global.randomCurseContract();
      }
    } catch (e) { /* stay silent; pure builder */ }
    return "";
  }

  /* ========== Gems generation ========== */

  function baseGemValue() {
    var roll = dPercent(); // 01..100
    if (roll <= 10) return 10;
    if (roll <= 25) return 50;
    if (roll <= 75) return 100;
    if (roll <= 90) return 500;
    return 1000; // 91–00
  }

  function escalateValue(val) {
    // 1-in-6 repeatable step-ups
    while (oneIn(6)) {
      var idx = VALUE_STEPS.indexOf(val);
      if (idx === -1) {
        // If off-table, double as a safe continuation
        val = val * 2;
      } else if (idx < VALUE_STEPS.length - 1) {
        val = VALUE_STEPS[idx + 1];
      } else {
        val = val * 2; // continue pattern beyond table
      }
    }
    return val;
  }

  function isPreciousForValue(val) {
    if (val > 1000) return true;                 // >1000 always Precious
    var d6 = r(6);
    if (val === 1000) return d6 <= 5;
    if (val === 500)  return d6 <= 4;
    if (val === 100)  return d6 <= 3;
    if (val === 50)   return d6 <= 2;
    // 10 gp row
    return d6 <= 1;
  }

  function pickGemType(precious) {
    return precious ? pick(PRECIOUS_TYPES) : pick(SEMI_TYPES);
  }

  function generateGem() {
    var v = escalateValue(baseGemValue());
    var precious = isPreciousForValue(v);
    var se = sizeEncFor(precious, v);
    var type = pickGemType(precious);
    return {
      value: v,
      precious: precious,
      size: se.size,
      enc: se.p,
      type: type
    };
  }

  function gemSingletonLine(gem) {
   // "100gp. (10p.) Medium Diamond"
   var line = gp(gem.value) + " (" + pUnits(gem.enc) + ") " + gem.size + " " + gem.type;

   // Gems ≥ 1000gp → enchanted (probability/threshold unchanged)
   if (gem.value >= 1000) {
    var effect = pickEnchantment(false, null);

    // Strip trailing placeholder: " of [index ... table]" (Quest/Geas/Curse)
    var clean = effect.replace(/\s+of\s+\[index\s+(quest|geas|curse)\s+table\]/i, "");

    // Main line prints the clean effect
    line += "; enchanted to " + clean;

    // Newline: keep existing subtable expansion behavior
    line += maybeAppendSubtableLines(effect);
   }

   return line;
 }


  function gemGroupsFrom(count) {
    var groups = {}; // key -> {count, value, enc, size, type, totalGp, totalP, label}
    var totalGp = 0, totalP = 0;

    for (var i = 0; i < count; i++) {
      var g = generateGem();
      totalGp += g.value;
      totalP  += g.enc;
      var key = [g.value, g.size, g.type].join("|"); // group by per-gem value + size + type
      if (!groups[key]) {
        groups[key] = {
          key: key,
          count: 0,
          value: g.value,
          enc: g.enc,
          size: g.size,
          type: g.type,
          totalGp: 0,
          totalP: 0
        };
      }
      groups[key].count += 1;
      groups[key].totalGp += g.value;
      groups[key].totalP  += g.enc;
    }

    // Convert to array and sort
    var arr = Object.keys(groups).map(function(k) {
      var it = groups[k];
      it.label = it.size + " " + pluralGemType(it.type);
      return it;
    });
    arr.sort(function(a, b) {
      if (b.totalGp !== a.totalGp) return b.totalGp - a.totalGp;
      // then by Type, then Size order
      if (a.type < b.type) return -1;
      if (a.type > b.type) return 1;
      return SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size);
    });

    return { groups: arr, totalGp: totalGp, totalP: totalP };
  }

  /* ========== Jewelry generation ========== */

  function preciousMetalChanceByBand(gpVal) {
    // A: <1800 (1-in-6), B: 1800–6999 (2-in-3), C: >=7000 (always Precious)
    if (gpVal >= 7000) return 1; // certainty
    if (gpVal >= 1800) return 2/3;
    return 1/6;
  }

  function rollMetalFor(gpVal) {
    var preciousChance = preciousMetalChanceByBand(gpVal);
    var usePrecious = (gpVal >= 7000) ? true : (Math.random() < preciousChance);
    var metal = usePrecious ? PRECIOUS_METALS[r(6)-1] : BASE_METALS[r(6)-1];
    if (metal === "Colored Gold") {
      metal = pick(COLORED_GOLD) + " Gold";
    }
    return { metal: metal, isPrecious: usePrecious };
  }

  function pickJewelryStone(gpVal, metalIsPrecious) {
    var stonesArePrecious = (gpVal >= 7000) ? true : (metalIsPrecious && Math.random() < (2/3));
    return stonesArePrecious ? pick(PRECIOUS_TYPES) : pick(SEMI_TYPES);
  }

  function generateJewelryItem(gpVal) {
    var met = rollMetalFor(gpVal);
    var stone = pickJewelryStone(gpVal, met.isPrecious);
    var item  = pick(JEWELRY_ITEMS);
    var enc   = 100; // p.
    var enchant = null, extra = "";
    if (gpVal >= 7000) {
      enchant = pickEnchantment(true, met.metal);
      extra = maybeAppendSubtableLines(enchant);
    }
    return {
      gp: gpVal,
      enc: enc,
      metal: met.metal,
      stone: stone,
      item: item,
      enchant: enchant,  // null or string
      extra: extra       // "" or "\n..." (Quest/Geas/Curse)
    };
  }

  function jewelrySingletonLine(j) {
   var line = gp(j.gp) + " (100p.) " + j.metal + " & " + j.stone + " " + j.item;
   if (j.enchant) {
    var e = j.enchant;

    // If the enchantment lists abilities in brackets, pick exactly one (20% each)
    var abilityListRe = /\[(?:Intelligence|Strength|Wisdom|Constitution|Dexterity)(?:\/(?:Intelligence|Strength|Wisdom|Constitution|Dexterity))*\]/i;
    if (abilityListRe.test(e)) {
      var _opts = ["Intelligence","Strength","Wisdom","Constitution","Dexterity"];
      e = e.replace(abilityListRe, function () {
        return _opts[Math.floor(Math.random() * _opts.length)];
      });
    }

    // Strip generic bracket placeholders (e.g., [index quest table])
    e = e.replace(/\[[^\]]+\]/g, "").replace(/\s{2,}/g, " ").trim();
    // Clean trailing "of" left by removing placeholders like "... of [index quest table]"
    e = e.replace(/\s+of\s*$/i, "");

    line += "; enchanted to " + e;
    line += j.extra || ""; // may add multi-line contract text
   }
   return line;
  }


  function jewelryGroupsFrom(gpArray) {
    var groups = {}; // key -> {count, eachGp, totalGp, totalP, metal, stone, item}
    var sumGp = 0, sumP = 0;

    for (var i = 0; i < gpArray.length; i++) {
      var j = generateJewelryItem(gpArray[i]);
      sumGp += j.gp;
      sumP  += j.enc;

      // Group identical items: same gp, metal, stone, item (enchantment ignored for grouping line text)
      var key = [j.gp, j.metal, j.stone, j.item].join("|");
      if (!groups[key]) {
        groups[key] = {
          key: key,
          count: 0,
          eachGp: j.gp,
          totalGp: 0,
          totalP: 0,
          metal: j.metal,
          stone: j.stone,
          item: j.item
        };
      }
      groups[key].count += 1;
      groups[key].totalGp += j.gp;
      groups[key].totalP  += j.enc;
    }

    var arr = Object.keys(groups).map(function(k) {
      var it = groups[k];
      it.label = it.metal + " & " + it.stone + " " + pluralItemType(it.item);
      return it;
    });

    sortGroupsByTotalThenLabel(arr);
    return { groups: arr, totalGp: sumGp, totalP: sumP };
  }

  /* ========== Public API ========== */

  var houseGems = {
    lineForOne: function () {
      return gemSingletonLine(generateGem());
    },
    linesForCount: function (count) {
  count = (typeof count === "number" && count > 0) ? Math.floor(count) : 1;
  var agg = gemGroupsFrom(count);

  var lines = agg.groups.map(function (g) {
    var lead = gp(g.totalGp) + " value (" + pUnits(g.totalP) + ")";
    if (g.count === 1) {
      // Singleton wording: one item, singular, no "value", no "each"
      var line = gp(g.value) + " (" + pUnits(g.enc) + ") " + g.size + " " + g.type;

      if (g.value >= 1000) {
        var effect = pickEnchantment(false, null);
        var clean = effect.replace(/\s+of\s+\[index\s+(quest|geas|curse)\s+table\]/i, "");
        line += ", enchanted to " + clean;
        line += maybeAppendSubtableLines(effect);
      }

      return line;
    } else {
      // Group wording: keep totals line unchanged
      return lead + " from sum of " + g.count + " " + g.size + " " +
             pluralGemType(g.type) + ", " + gp(g.value) +
             " (" + pUnits(g.enc) + ") each";
    }
  });

  if (agg.groups.length > 1) {
    lines.push(
      gp(agg.totalGp) + " Total gem value (" + pUnits(agg.totalP) + " Total gem encumbrance)"
    );
  }

  return lines.join("\n") + "\n";
}

  };

  var houseJewelry = {
    lineForValue: function (gpVal) {
      gpVal = (typeof gpVal === "number" && gpVal > 0) ? Math.floor(gpVal) : 300;
      return jewelrySingletonLine(generateJewelryItem(gpVal));
    },
    linesForValues: function (gpArray) {
  gpArray = Array.isArray(gpArray) ? gpArray.slice() : [];
  if (gpArray.length === 0) return ""; // nothing to print

  var agg = jewelryGroupsFrom(gpArray);

  var lines = agg.groups.map(function (g) {
    // Build the item label, pluralize only when count > 1
    var itemPlural = pluralItemType(g.item);
    var itemLabel = g.metal + " & " + g.stone + " " + (g.count === 1 ? g.item : itemPlural);

    // Common lead: total value + total encumbrance for this group
    var lead = gp(g.totalGp) + " value (" + pUnits(g.totalP) + ")";

    if (g.count === 1) {
     // Singleton wording, fixed encumbrance at 100p. (no "value")
     var line = gp(g.eachGp) + " (" + pUnits(100) + ") " + itemLabel;
     if (g.eachGp >= 7000) {
      var jeffect = pickEnchantment(true, g.metal);
      line += ", enchanted to " + jEffect;
     }
     return line;
   } else {

        // Group wording, fixed per-item encumbrance at 100p.
        return lead + " from sum of " + g.count + " " + itemLabel + ", " +
            gp(g.eachGp) + " (" + pUnits(100) + ") each";
    }
});
    if (agg.groups.length > 1) {
  lines.push(gp(agg.totalGp) + " Total jewelry value (" +
             pUnits(agg.totalP) + " Total jewelry encumbrance)");
}
return lines.join("\n") + "\n";

}
};


// expose
global.houseGems = houseGems;
global.houseJewelry = houseJewelry;
global.generateGem = generateGem;
global.generateJewelryItem = generateJewelryItem;
global.gemSingletonLine = gemSingletonLine;
global.jewelrySingletonLine = jewelrySingletonLine;
})(typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : this));

