/* tables/unique.js
   Random Unique Monster Generator (console-testable)
   Branch: feat/monster-generator  |  Commit 1

   Exposes:
     window.randomMonster = randomMonster;
     window.randomMonsterContract = randomMonsterContract;

   Console smoke tests:
     randomMonster()
     randomMonsterContract()
     monsterTable()   // inspect structured record
*/

(function () {
  'use strict';

  // ---------- dice & utils ----------
  function roll(n, sides) {
    sides = sides || 6;
    var s = 0;
    for (var i = 0; i < n; i++) s += Math.floor(Math.random() * sides) + 1;
    return s;
  }

  function d(sides) {
    return Math.floor(Math.random() * sides) + 1;
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function uniquePush(arr, item) {
    if (arr.indexOf(item) === -1) arr.push(item);
  }

  function chance(percent) {
    return Math.random() * 100 < percent;
  }

  function rollHPList(numCreatures, hd) {
    var out = [];
    for (var i = 0; i < numCreatures; i++) {
      out.push(roll(hd, 6));
    }
    return out;
  }

  // ---------- tables ----------
  var magicalSpiceTable = [
    'Regenerates 3hp per round',
    'Casts Fear',
    'Magic resistant (+4 to saves against magic)',
    'Casts mass-Charm',
    'Immolates attacker when struck',
    'Drains life energy when touched or struck'
  ];

  var magicalHeadsTable = [
    'regenerate when severed',
    'cast Fear through shrieking screams',
    'are protected under anti magic shell',
    'stretch outward on pseudopod-like stalks',
    'Immolate victim upon successful bite',
    'drain the victim\'s life energy upon successful bite'
  ];

  var magicalEyesTable = [
    'cast cone of cold',
    'cast heat-ray',
    'cast spell cancellation',
    'cast Charm',
    'turn flesh to stone',
    'drain the victim\'s life energy'
  ];

  // ---------- rules helpers ----------
  // HD size description by original d10
  function sizeByHD(hd, hdRawD10) {
    if (hdRawD10 <= 2) return 'Small';
    if (hdRawD10 <= 4) return 'Human-sized';
    if (hdRawD10 <= 6) return 'Large';
    if (hdRawD10 <= 8) return 'Huge';
    return 'Humongous';
  }

  // Actions per round (text)
  function actionsByHD(hd) {
    if (hd <= 3) return 'Hive mind';
    if (hd <= 7) return '2';
    if (hd <= 11) return '3';
    return '4';
  }

  // Damage by HD (text; '' means no line)
  function damageByHD(hd) {
    if (hd <= 2) return 'Unit damage';
    if (hd <= 5) return '';
    if (hd <= 11) return '2d6 damage';
    return '3d6 damage';
  }

  // Number appearing: floor(10/HD), minimum 1; fractional remainder is % for +1
  function numberAppearing(hd) {
    var raw = 10 / hd;
    var base = Math.floor(raw);
    var remainder = raw - base;
    var extra = (remainder > 0 && chance(remainder * 100)) ? 1 : 0;
    return Math.max(1, base + extra);
  }

  // AC and skin description
  // AC = d8+1 (2..9). If AC == 2, 1-in-3: set AC to (-1,0,1) and roll TWO magical spices (no dups).
  function rollACAndSkin(ctx) {
    var ac = d(8) + 1; // 2..9
    if (ac === 2 && d(3) === 1) {
      ac = d(3) - 2; // -1..1
      // Add two distinct magical spices (avoid duplicates with existing ctx.spices)
      while (ctx.spices.length < 2) {
        var s = pick(magicalSpiceTable);
        if (ctx.spices.indexOf(s) === -1) ctx.spices.push(s);
      }
    }
    var skin;
    if (ac <= 3) {
      skin = 'magical ectoderm';
      // Ensure at least one magical spice when skin is magical ectoderm
      if (ctx.spices.length === 0) {
        uniquePush(ctx.spices, pick(magicalSpiceTable));
      }
    } else if (ac <= 5) {
      skin = 'armored ectoderm';
    } else if (ac <= 7) {
      skin = 'tough hide';
    } else {
      skin = 'membranous ectoderm';
    }
    return { ac: ac, skin: skin };
  }

  // Movement
  // MV = d4*3 => 3 (ooze), 6 (undead-like), 9 (human-like), 12 (animal-like)
  // If ooze, 1-in-3 add a magical spice (no dups).
  // If ctx.wings true, print "MVx/2x" (e.g., MV9/18).
  function moveAndDescriptor(ctx) {
    var mvBase = d(4) * 3;
    var desc = (mvBase === 3) ? 'ooze'
             : (mvBase === 6) ? 'undead-like monster'
             : (mvBase === 9) ? 'human-like monster'
             : 'animal-like monster';

    if (mvBase === 3 && d(3) === 1) {
      var extra = pick(magicalSpiceTable);
      if (ctx.spices.indexOf(extra) === -1) ctx.spices.push(extra);
    }

    var mvText = 'MV' + mvBase;
    if (ctx.wings) {
      mvText = 'MV' + mvBase + '/' + (mvBase * 2); // e.g., MV9/18
    }
    return { mvBase: mvBase, mvText: mvText, desc: desc };
  }

  // HD roll: d10 => 1..8 = HD; 9..10 => HD = d4+8 (9..12) and seed 2 extra flavors
  function rollHDandFlavorSeed() {
    var hdRaw = d(10);
    var hd, extraFlavor = 0;
    if (hdRaw <= 8) {
      hd = hdRaw;
    } else {
      hd = d(4) + 8; // 9..12
      extraFlavor = 2;
    }
    return { hd: hd, hdRaw: hdRaw, extraFlavor: extraFlavor };
  }

  // ---------- flavor system ----------
  // Each flavor can be a string or an object with resolve(ctx) -> string (and side effects).
  var FLAVOR = [
    { resolve: function (ctx) { return 'Mesmerizing eyes that ' + pick(magicalEyesTable); } },
    'Poison bite',
    'Poison sting',
    'Prehensile nose, grapples',
    'Trunk mouth, grapples',
    'Neck-stalk, grapples',
    { resolve: function () { return (roll(2, 6)) + ' limbs, grapple'; } },
    'Claws, additional attack',
    'Prehensile tail, grapples',
    { resolve: function () { var heads = d(6) + 1; return heads + ' heads that ' + pick(magicalHeadsTable); } },
    'Forked tongue, grapple',
    'Forked tongue poisons',
    { resolve: function (ctx) { ctx.wings = true; return 'Wings, flight'; } },
    'Horns grant additional attack',
    'Antlers grant additional attack',
    'Paralysis upon successful attack',
    'Tentacles, grapple',
    { resolve: function () {
        try {
          if (typeof window !== 'undefined' && typeof window.randomDisease === 'function') {
            return 'Contagious disease; upon successful attack ' + window.randomDisease();
          }
        } catch (e) {}
        return 'Contagious disease; upon successful attack (see Disease table)';
      } },
    'Slimy: weapons/victims stick',
    'Translucent; advantage to surprise',
    'Extremely strong: bonus to damage',
    'Casts webs as missile',
    'Quill-covered ectoderm, shoots 1d6 as missiles per round',
    'Shoots pseudopod as missile',
    'Vegetable; weapons get stuck',
    'Mineral; breaks normal weapons; magic weapons 1/2 damage',
    { resolve: function (ctx, pushFlavor) {
        // Roll twice without duplicates (if rolled again, thrice); implement as add 2 distinct extra flavors now.
        // We also return a joined string for log completeness.
        var extras = rollDistinctFlavors(2, ctx, pushFlavor);
        return extras.join('; ');
      } }
  ];

  function resolveFlavor(entry, ctx, pushFlavor) {
    if (typeof entry === 'string') return entry;
    if (entry && typeof entry.resolve === 'function') {
      return entry.resolve(ctx, pushFlavor);
    }
    return String(entry);
  }

  function rollOneFlavor(ctx, pushFlavor) {
    var entry = pick(FLAVOR);
    var text = resolveFlavor(entry, ctx, pushFlavor);
    return text;
  }

  function rollDistinctFlavors(n, ctx, pushFlavor) {
    var results = [];
    var guard = 60;
    while (results.length < n && guard-- > 0) {
      var t = rollOneFlavor(ctx, pushFlavor);
      if (!t) continue;
      // Split any composite "a; b" returned by special resolvers
      var parts = String(t).split('; ').map(function (s) { return s.trim(); }).filter(Boolean);
      for (var i = 0; i < parts.length && results.length < n; i++) {
        var p = parts[i];
        if (results.indexOf(p) === -1 && (!ctx._flavor || ctx._flavor.indexOf(p) === -1)) {
          results.push(p);
          if (typeof pushFlavor === 'function') pushFlavor(p);
        }
      }
    }
    return results;
  }

  // ---------- core record builder ----------
  function monsterTable() {
    var ctx = {
      spices: [],
      wings: false,
      _flavor: [] // internal tracker to avoid duplicates
    };

    // HD & size
    var hdSeed = rollHDandFlavorSeed();
    var hd = hdSeed.hd;
    var hdRaw = hdSeed.hdRaw;
    var extraFlavor = hdSeed.extraFlavor;
    var sizeText = sizeByHD(hd, hdRaw);

    // Number appearing
    var count = numberAppearing(hd);

    // AC & skin (may seed spices)
    var acSkin = rollACAndSkin(ctx);

    // Actions & damage
    var actions = actionsByHD(hd);
    var damage = damageByHD(hd);

    // Flavor additives FIRST (wings may be set here)
    var flavorLines = [];
    function pushFlavor(txt) {
      if (!txt) return;
      var parts = String(txt).split('; ').map(function (s) { return s.trim(); }).filter(Boolean);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        if (flavorLines.indexOf(p) === -1) flavorLines.push(p);
        if (ctx._flavor.indexOf(p) === -1) ctx._flavor.push(p);
      }
    }

    // Always at least one flavor
    pushFlavor(rollOneFlavor(ctx, pushFlavor));

    // Extra flavor when HD path is humongous (9..12)
    for (var ef = 0; ef < extraFlavor; ef++) {
      var guard = 60;
      while (guard-- > 0) {
        var f = rollOneFlavor(ctx, pushFlavor);
        if (f && flavorLines.indexOf(f) === -1) { pushFlavor(f); break; }
      }
    }

    // Defensive: if any rolled flavor text includes Wings, ensure flag before MV
    if (!ctx.wings && flavorLines.indexOf('Wings, flight') !== -1) {
      ctx.wings = true;
    }

    // Move (AFTER flavor so wings can double MV)
    var mv = moveAndDescriptor(ctx);

    // Magical spice line (if any)
    var spicesLine = ctx.spices.length ? ctx.spices.join('; ') : '';

    // HP per creature (sum of d6 equal to HD)
    var hpEach = rollHPList(count, hd);

    // Build record
    return {
      count: count,
      labelSingular: 'Anomalous Eldritch Aberration',
      labelPlural: 'Anomalous Eldritch Aberrations',
      hd: hd,
      hdRaw: hdRaw,
      sizeText: sizeText,
      ac: acSkin.ac,
      skin: acSkin.skin,
      mvText: mv.mvText,
      mvDesc: mv.desc,
      hpEach: hpEach,
      actions: actions,
      damage: damage,
      spices: ctx.spices.slice(),
      spicesLine: spicesLine,
      flavor: flavorLines.slice()
    };
  }

  // ---------- renderers ----------
  function renderOneLiner(rec) {
    var noun = rec.count === 1 ? rec.labelSingular : rec.labelPlural;
    return rec.count === 1
      ? ('Random Monster: ' + noun)
      : ('Random Monster: ' + rec.count + ' ' + noun);
  }

  function renderContract(rec) {
    // Header line
    var noun = rec.count === 1 ? rec.labelSingular : rec.labelPlural;
    var header = (rec.count === 1) ? (noun) : (rec.count + ' ' + noun);

    // Line 2: "#HD AC# MV#(/2x if wings) HP a; b; c"
    var line2 = rec.hd + 'HD AC' + rec.ac + ' ' + rec.mvText + ' HP ' + rec.hpEach.join('; ');

    // Line 3: actions wording
    // If "Hive mind" use it literally; else print "N actions per round"
    var actionsText = (rec.actions === 'Hive mind')
      ? 'Hive mind'
      : (rec.actions + ' actions per round');

    var line3 = rec.damage ? (actionsText + '; ' + rec.damage) : actionsText;

    // Line 4: Magical spice (optional)
    var line4 = rec.spicesLine; // may be empty

    // Line 5: size/move/skin description
    var line5 = rec.sizeText + ' ' + rec.mvDesc + ' with ' + rec.skin + '.';

    // Line 6: Flavor additives (optional)
    var line6 = (rec.flavor && rec.flavor.length) ? rec.flavor.join('; ') : '';

    // Join non-empty lines
    var lines = [header, line2, line3, line4, line5, line6].filter(function (s) {
      return s && s.trim().length > 0;
    });

    return lines.join('\n');
  }

  // ---------- public API ----------
  function randomMonster() {
    var rec = monsterTable();
    return renderOneLiner(rec);
  }

  function randomMonsterContract() {
    var rec = monsterTable();
    return renderContract(rec);
  }

  // Expose for HTML button & console
  window.monsterTable = monsterTable;
  window.randomMonster = randomMonster;
  window.randomMonsterContract = randomMonsterContract;
})();
