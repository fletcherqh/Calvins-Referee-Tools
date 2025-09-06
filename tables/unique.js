/* tables/unique.js
   Random Unique Monster Generator (console-testable)
   Commit 1 for branch: feat/monster-generator

   Exposes:
     window.randomMonster = randomMonster;
     window.randomMonsterContract = randomMonsterContract;

   Usage (console smoke tests):
     randomMonster()
     randomMonsterContract()
*/

// ----- helpers -----
(function () {
  'use strict';

  function roll(n, sides) {
    // roll n dice of 'sides' sides, return sum
    sides = sides || 6;
    let s = 0;
    for (let i = 0; i < n; i++) s += Math.floor(Math.random() * sides) + 1;
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

  function pluralize(word, n) {
    return n === 1 ? word : word + 's';
  }

  // safe random percent check (e.g., 27% => true if 1..27 on d100)
  function chance(percent) {
    return Math.random() * 100 < percent;
  }

  // roll Nd6 as a single sum string (e.g., "HP 12; 9; 17" for each creature)
  function rollHPList(numCreatures, hd) {
    const out = [];
    for (let i = 0; i < numCreatures; i++) {
      out.push(roll(hd, 6));
    }
    return out;
  }

  // ----- tables -----

  // Size by HD (HD roll on d10: 1-2 Small, 3-4 Human-sized, 5-6 Large, 7-8 Huge, 9-10 Humongous with HD = d4+8; roll twice on flavor)
  function sizeByHD(hd, hdRawD10) {
    if (hdRawD10 <= 2) return 'Small';
    if (hdRawD10 <= 4) return 'Human-sized';
    if (hdRawD10 <= 6) return 'Large';
    if (hdRawD10 <= 8) return 'Huge';
    return 'Humongous';
  }

  // Actions by HD
  function actionsByHD(hd) {
    if (hd <= 3) return 'Hive mind';
    if (hd <= 7) return '2';
    if (hd <= 11) return '3';
    return '4';
  }

  // Damage by HD
  function damageByHD(hd) {
    if (hd <= 2) return 'Unit damage';
    if (hd <= 5) return ''; // no output
    if (hd <= 11) return '2d6 damage';
    return '3d6 damage';
  }

  // Number appearing: 10/HD (min 1). Decimal remainder = % chance of +1.
  function numberAppearing(hd) {
    const raw = 10 / hd;
    const base = Math.floor(raw);
    const remainder = raw - base;
    const extra = remainder > 0 && chance(remainder * 100) ? 1 : 0;
    return Math.max(1, base + extra);
  }

  // Magical sub-tables
  const magicalSpiceTable = [
    'Regenerates 3hp per round',
    'Casts Fear',
    'Magic resistant (+4 to saves against magic)',
    'Casts mass-Charm',
    'Immolates attacker when struck',
    'Drains life energy when touched or struck'
  ];

  const magicalHeadsTable = [
    'regenerate when severed',
    'cast Fear through shrieking screams',
    'are protected under anti magic shell',
    'stretch outward on pseudopod-like stalks',
    'Immolate victim upon successful bite',
    'drain victim’s life energy upon successful bite'
  ];

  const magicalEyesTable = [
    'cast cone of cold',
    'cast heat-ray',
    'cast spell cancellation',
    'cast Charm',
    'turn flesh to stone',
    'drain the victim’s life energy'
  ];

  // Flavor additive master list with resolver functions
  // Entries can be strings or objects with a 'resolve' function returning string(s)
  const FLAVOR = [
    { resolve: () => 'Mesmerizing eyes that ' + pick(magicalEyesTable) },
    'Poison bite',
    'Poison sting',
    'Prehensile nose, grapples',
    'Trunk mouth, grapples',
    'Neck-stalk, grapples',
    { resolve: () => `${roll(2, 6)} limbs, grapple` },
    'Claws, additional attack',
    'Prehensile tail, grapples',
    { resolve: () => {
        const heads = d(6) + 1; // d6 + 1 heads
        return `${heads} heads that ${pick(magicalHeadsTable)}`;
      }
    },
    'Forked tongue, grapple',
    'Forked tongue poisons',
    { resolve: (ctx) => {
        // Wings, flight -> add flight MV (double) later; also return text
        ctx.wings = true;
        return 'Wings, flight';
      }
    },
    'Horns grant additional attack',
    'Antlers grant additional attack',
    'Paralysis upon successful attack',
    'Tentacles, grapple',
    { resolve: () => {
        // disease hook: use Disease output text (single line)
        // expects window.randomDisease() to be available
        try {
          if (typeof window !== 'undefined' && typeof window.randomDisease === 'function') {
            return 'Contagious disease; upon successful attack ' + window.randomDisease();
          }
        } catch (e) { /* fall through */ }
        return 'Contagious disease; upon successful attack (see Disease table)';
      }
    },
    'Slimy: weapons/victims stick',
    'Translucent; advantage to surprise',
    'Extremely strong: bonus to damage',
    'Casts webs as missile',
    'Quill-covered ectoderm, shoots 1d6 as missiles per round',
    'Shoots pseudopod as missile',
    'Vegetable; weapons get stuck',
    'Mineral; breaks normal weapons; magic weapons ½ damage',
    { resolve: (ctx, pushFlavor) => {
        // "Roll twice without duplicates, if rolled again, thrice without duplicates, ignore thereafter"
        // Implement as: remove this placeholder and add 2 additional unique flavors now.
        const extras = rollDistinctFlavors(2, ctx, pushFlavor);
        return extras.join('; '); // we still return text for logging, though we'll also push separately
      }
    }
  ];

  function resolveFlavor(entry, ctx) {
    if (typeof entry === 'string') return entry;
    if (entry && typeof entry.resolve === 'function') {
      // allow entry to add side effects (e.g., wings) and return its text
      // Some entries may push additional items via a callback; handle simply by returning single string here
      return entry.resolve(ctx, (txt) => uniquePush(ctx._flavor, txt));
    }
    return String(entry);
  }

  function rollOneFlavor(ctx) {
    const entry = pick(FLAVOR);
    const text = resolveFlavor(entry, ctx);
    return text;
  }

  function rollDistinctFlavors(n, ctx, pushFlavor) {
    const results = [];
    let safety = 50;
    while (results.length < n && safety-- > 0) {
      const t = rollOneFlavor(ctx);
      if (t && results.indexOf(t) === -1 && (!ctx._flavor || ctx._flavor.indexOf(t) === -1)) {
        results.push(t);
        if (typeof pushFlavor === 'function') pushFlavor(t);
      }
    }
    return results;
  }

  // AC skin descriptions (d8+1 => 2..9)
  function skinByAC(ac, ctx) {
    // 2-3: magical ectoderm [+spice]; 4-5 armored ectoderm; 6-7 tough hide; 8-9 membranous ectoderm
    if (ac <= 3) {
      // always at least one magical spice for magical ectoderm
      if (ctx.spices.length === 0) {
        const s = pick(magicalSpiceTable);
        uniquePush(ctx.spices, s);
      }
      return 'magical ectoderm';
    }
    if (ac <= 5) return 'armored ectoderm';
    if (ac <= 7) return 'tough hide';
    return 'membranous ectoderm';
  }

  // MV: d4*3 => 3,6,9,12 with descriptors; ooze 1-in-3 chance to add magical spice
  function moveAndDescriptor(ctx) {
    const mvBase = d(4) * 3; // 3/6/9/12
    let desc = '';
    if (mvBase === 3) {
      desc = 'ooze';
      if (d(3) === 1) {
        // add a magical spice if not already present
        let spice = pick(magicalSpiceTable);
        let safety = 20;
        while (ctx.spices.indexOf(spice) !== -1 && safety-- > 0) spice = pick(magicalSpiceTable);
        uniquePush(ctx.spices, spice);
      }
    } else if (mvBase === 6) {
      desc = 'undead-like monster';
    } else if (mvBase === 9) {
      desc = 'human-like monster';
    } else {
      desc = 'animal-like monster';
    }

    let mvText = 'MV' + mvBase;
    if (ctx.wings) {
      mvText = 'MV' + mvBase + '/MV' + (mvBase * 2);
    }
    return { mvBase, mvText, desc };
  }

  // AC roll with special AC2 override rule:
  // AC = d8+1 (2..9). For AC 2, 1-in-3 chance: set AC to (-1, 0, or 1), and roll TWO magical spices, no duplicates.
  function rollACAndSkin(ctx) {
    let ac = d(8) + 1; // 2..9
    if (ac === 2 && d(3) === 1) {
      // special override: AC becomes -1,0,1 via (d3)-2
      ac = d(3) - 2; // -1..1
      // add two distinct magical spices
      while (ctx.spices.length < 2) {
        const s = pick(magicalSpiceTable);
        uniquePush(ctx.spices, s);
      }
      // ensure no duplicates in spices array beyond two entries
      ctx.spices = ctx.spices.slice(0, Math.max(2, ctx.spices.length));
    }
    const skin = skinByAC(ac, ctx);
    return { ac, skin };
  }

  // HD roll:
  // Roll d10. If 1–8, HD = that roll. If 9–10, HD = d4+8 (9–12) and roll twice on flavor additive (no duplicates).
  function rollHDandFlavorSeed(ctx) {
    const hdRaw = d(10);
    let hd;
    let extraFlavor = 0;
    if (hdRaw <= 8) {
      hd = hdRaw;
    } else {
      hd = d(4) + 8; // 9..12
      extraFlavor = 2;
    }
    return { hd, hdRaw, extraFlavor };
  }

  // ----- core build -----

  function monsterTable() {
    // Build one unique monster record per spec; returns a structured object
    const ctx = {
      spices: [],
      wings: false,
      _flavor: [] // track flavor lines to avoid duplicates within this monster
    };

    // HD and size
    const { hd, hdRaw, extraFlavor } = rollHDandFlavorSeed(ctx);
    const sizeText = sizeByHD(hd, hdRaw);

    // Number appearing
    const n = numberAppearing(hd);

    // AC & skin
    const { ac, skin } = rollACAndSkin(ctx);

    // Damage and actions
    const actions = actionsByHD(hd);
    const dmg = damageByHD(hd);

    // Move
    const mv = moveAndDescriptor(ctx);

    // Flavor additives
    // Start with extraFlavor (from hd 9-10) rolls; always avoid duplicates.
    const flavorLines = [];
    function pushFlavor(txt) {
      if (!txt) return;
      // Some "roll twice" entry may return a composite string; keep as given but also track duplicates
      // Break on '; ' to capture multiples injected by resolver
      const parts = String(txt).split('; ').map(s => s.trim()).filter(Boolean);
      parts.forEach(p => {
        if (flavorLines.indexOf(p) === -1) flavorLines.push(p);
        if (ctx._flavor.indexOf(p) === -1) ctx._flavor.push(p);
      });
    }

    // Always roll at least one flavor additive
    pushFlavor(rollOneFlavor(ctx));

    // Add HD-based extra rolls (for humongous path)
    const hdExtra = extraFlavor;
    for (let i = 0; i < hdExtra; i++) {
      // keep trying until you find a new one
      let safety = 50;
      while (safety-- > 0) {
        const f = rollOneFlavor(ctx);
        if (f && flavorLines.indexOf(f) === -1) {
          pushFlavor(f);
          break;
        }
      }
    }

    // Prepare Magical Spice line (avoid duplicates)
    // ctx.spices already deduped; may have been added by skin or ooze or elsewhere
    const spicesLine = ctx.spices.length ? ('Magical spice: ' + ctx.spices.join('; ')) : '';

    // Wings post-processing (flight doubles already reflected in mv.mvText)
    // done in resolver via ctx.wings and in moveAndDescriptor()

    // HP list per creature (each is HD d6)
    const hpList = rollHPList(n, hd);

    // Compose
    return {
      // header
      count: n,
      labelSingular: 'Anomalous Eldritch Aberration',
      labelPlural: 'Anomalous Eldritch Aberrations',
      // stat block
      hd,
      ac,
      mvText: mv.mvText,
      mvDesc: mv.desc,
      hpEach: hpList, // array of sums
      actions,
      damage: dmg,
      // descriptions
      sizeText,
      skin,
      spices: ctx.spices.slice(),
      spicesLine,
      flavor: flavorLines.slice()
    };
  }

  // ----- public strings -----

  function renderOneLiner(rec) {
    const noun = rec.count === 1 ? rec.labelSingular : rec.labelPlural;
    return `Random Monster: ${rec.count} ${noun}`;
  }

  function renderContract(rec) {
    // Lines per spec:
    // [Number appearing] Anomalous Eldritch Aberration/s
    // #HD AC# MV# HP [list]
    // [# actions per round]; [type of damage]
    // [Magical spice, if any]
    // [HD size description] [MV description] with [skin description].
    // [Flavor additive]
    const noun = rec.count === 1 ? rec.labelSingular : rec.labelPlural;
    const header = `${rec.count} ${noun}`;

    const line2 = `${rec.hd}HD AC${rec.ac} ${rec.mvText} HP ` + rec.hpEach.join('; ');

    const actionsAndDamage = rec.damage
      ? `${rec.actions}; ${rec.damage}`
      : `${rec.actions}`;

    const spiceLine = rec.spicesLine; // may be empty string

    const bodyLine = `${rec.sizeText} ${rec.mvDesc} with ${rec.skin}.`;

    const flavorLine = rec.flavor.length ? rec.flavor.join('; ') : '';

    // join non-empty lines with \n
    return [header, line2, actionsAndDamage, spiceLine, bodyLine, flavorLine]
      .filter(s => s && s.trim().length > 0)
      .join('\n');
  }

  // ----- exposed API -----

  function randomMonster() {
    const rec = monsterTable();
    return renderOneLiner(rec);
  }

  function randomMonsterContract() {
    const rec = monsterTable();
    return renderContract(rec);
  }

  // keep monsterTable available for console inspection if needed
  window.monsterTable = monsterTable;
  window.randomMonster = randomMonster;
  window.randomMonsterContract = randomMonsterContract;
})();
