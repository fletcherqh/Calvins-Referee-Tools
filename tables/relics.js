/* Calvin Wargaming • Relics v1.0.0
   File: tables/relics.js

   Exposes (globals):
     - randomRelic()  -> multi-line relic description block

   Notes:
   - Pulls quest/curse from existing subsystems if present:
       randomQuestContract()  (quest-geas.js)
       randomCurseContract()  (curse.js)
   - Pulls cleric names/patrons from existing pools:
       LawfulMaleClericNames, LawfulFemaleClericNames,
       ChaoticMaleClericNames, ChaoticFemaleClericNames,
       LawfulClericPatrons, ChaoticClericPatrons
*/

(function (global) {
  'use strict';

  // -------- utils ----------
  function d(n) { return Math.floor(Math.random() * n) + 1; }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function aAn(nextWord) {
    var w = (nextWord || '').trim().toLowerCase();
    return /^[aeiou]/.test(w) ? 'An' : 'A';
  }
  function safe(fnName) { return (global && typeof global[fnName] === 'function') ? global[fnName] : null; }

  // -------- local tables ----------
  var MATERIALS = [
    "Golden",
    "Silver",
    "Engraved Electrum",
    "Gem encrusted brass",
    "Enamelled glass mosaic",
    // "Ivory" (law) / "Obsidian" (chaos) handled specially
    "Gilt copper",
    "Champlevé Enameled bronze"
  ];

  // Container table (1–10). Each maps to a size class for relic sub-range.
  var CONTAINERS = [
    { law: "Ring", chaos: "Ring", size: "small" },                      // 1
    { law: "Amulet", chaos: "Amulet", size: "small" },                  // 2
    { law: "Medallion", chaos: "Medallion", size: "small" },            // 3
    { law: "Philactory", chaos: "Philactory", size: "small" },          // 4  (spelling per spec)
    { law: "Pendant", chaos: "Pendant", size: "medium" },               // 5
    { law: "Pectoral Cross", chaos: "Pectoral Pentacle", size: "medium" }, // 6
    { law: "Processional Cross", chaos: "Processional Pentacle", size: "medium" }, // 7
    { law: "Coffer", chaos: "Coffer", size: "large" },                   // 8
    { law: "Ark", chaos: "Ark", size: "large" },                         // 9
    { law: "Ossuary", chaos: "Ossuary", size: "large" }                  // 10
  ];

  // Relic table (1–12). One row has alignment split.
  var RELIC_ITEMS = [
    { law: "a Lock of hair", chaos: "a Lock of hair" },             // 1
    { law: "a Patch from the robe", chaos: "a Patch from the robe" }, // 2
    { law: "a Tooth", chaos: "a Tooth" },                           // 3
    { law: "an Umbilical cord", chaos: "an Umbilical cord" },       // 4
    { law: "the Weeping Sacred Image", chaos: "the Bleeding Effigy" }, // 5 (split)
    { law: "an Eye", chaos: "an Eye" },                             // 6
    { law: "a Finger", chaos: "a Finger" },                         // 7
    { law: "the Heart", chaos: "the Heart" },                       // 8
    { law: "a Hand", chaos: "a Hand" },                             // 9
    { law: "the Skull", chaos: "the Skull" },                       // 10
    { law: "an Arm", chaos: "an Arm" },                             // 11
    { law: "a Femur", chaos: "a Femur" }                            // 12 (spelling corrected)
  ];

  // Zeal 9+ "voice" effects (alignment-split)
  var ZEAL_SPOKEN_EFFECTS = [
   { law: "exhorts the faithful",                            chaos: "converts the infidel" },
   { law: "blesses the faithful",                            chaos: "curses the infidel" },
   { law: "reveals the truth (as spell of true seeing) to its wielder", chaos: "decieves the infidel with the noble lie" },
  ];


  // Sagacious powers by threshold number (2..15+). Alignment picks side where split.
  function sagaciousPowerFor(n, isLaw) {
    if (n <= 3) return "Detect alignment";
    if (n <= 5) return "Detect curse";
    if (n <= 7) return isLaw ? "Heal" : "Inflict wound";
    if (n <= 9) return isLaw ? "Bless" : "Bane";
    if (n === 10) return isLaw ? "Remove curse" : "Curse";
    if (n === 11) return isLaw ? "Cure disease" : "Inflict disease";
    if (n === 12) return isLaw ? "Neutralize poison" : "Poisons";
    if (n === 13) return isLaw ? "Speak with Hallows" : "Speak with Damned";
    if (n === 14) return "Commune with relic’s patron"; // will swap to specific name later
    return isLaw ? "Raise dead" : "Finger of Death"; // 15+
  }

  // ---------- core ----------
  function randomRelic() {
    var lines = [];

    // Alignment
    var isLaw = d(6) <= 4; // 1–4 Lawful; 5–6 Chaotic
    var alignWord = isLaw ? "Lawful" : "Chaotic";

    // Modifiers
    var modRoll = d(6);
    var baseMod = (modRoll <= 3) ? 1 : (modRoll === 6 ? 2 : 1); // +1 / +2 / (+1 with +2 vs.)
    var hasVsTarget = (modRoll >= 4 && modRoll <= 5);
    var targetBonus = hasVsTarget ? 2 : 0;
    var totalModForST = baseMod + targetBonus;

    var vsTarget = null;
    if (hasVsTarget) {
      var t = d(10);
      if (t <= 3) vsTarget = "Mummies";
      else if (t <= 5) vsTarget = "Spectres";
      else if (t <= 9) vsTarget = "Vampires";
      else vsTarget = isLaw ? "Demons" : "Angels"; // flip on alignment rule
    }

    // Life-energy 1-in-10
    var hasLife = (d(10) === 1);
    var lifeLine = null;
    if (hasLife) {
      lifeLine = isLaw ? "Upon touch, restores one life-energy level." : "Upon touch, drains one life-energy level.";
    }

    // WIS
    var WIS;
    var isPlus2Relic = (modRoll === 6);
    if (hasLife) {
      WIS = 12;
    } else if (isPlus2Relic) {
      WIS = d(10) + 2;
    } else {
      WIS = d(12);
    }

    // Number of powers
    var powerCount = (WIS <= 6) ? 0 : (WIS <= 9 ? 1 : (WIS <= 11 ? 2 : 3));

    // Sagacious power roll basis
    var sagaciousModSum = (hasVsTarget ? 3 : baseMod) + (hasLife ? 1 : 0); // +1 / +3 / +2 then +1 if life
    var rawPowers = [];
    if (powerCount > 0) {
      var seen = {};
      while (rawPowers.length < powerCount) {
        var roll = d(12) + sagaciousModSum;
        if (roll > 15) roll = 16; // treat 15+ as cap bucket
        var key = roll + (isLaw ? "L" : "C");
        if (seen[key]) continue; // re-roll duplicates
        seen[key] = true;
        rawPowers.push(roll);
      }
      // sort by table order (ascending)
      rawPowers.sort(function(a,b){return a-b;});
    }

    // Convert powers to text (handle "Commune..." swap to actual name below)
    var powerTexts = rawPowers.map(function(n){ return sagaciousPowerFor(n, isLaw); });

    // Zeal (only if WIS ≥ 7)
    var zeal = null;
    if (WIS >= 7) {
      if (hasLife) zeal = d(10) + 2;
      else if (isPlus2Relic) zeal = d(12);
      else zeal = d(10);
    }

    // Fame only if Zeal exists
    var fameWord = null;
    if (zeal !== null) {
      var f = d(10);
      if (f === 1) fameWord = "Unknown";
      else if (f <= 3) fameWord = "Obscure";
      else if (f <= 7) fameWord = "Well-known";
      else if (f <= 9) fameWord = "Famous";
      else fameWord = "Renown";
    }

    // Container (d10 → size band)
    var cIdx = d(10) - 1;
    var container = CONTAINERS[cIdx];
    var containerName = isLaw ? container.law : container.chaos;

    // Relic item sub-range by size band
    var low, high;
    if (container.size === "small") { low = 1; high = 6; }
    else if (container.size === "medium") { low = 3; high = 8; }
    else { low = 7; high = 12; }
    var relicIdx = (low - 1) + Math.floor(Math.random() * (high - low + 1));
    var relicItem = isLaw ? RELIC_ITEMS[relicIdx].law : RELIC_ITEMS[relicIdx].chaos;

    // Material (Ivory/Obsidian alignment swap handled here)
    var material = pick(MATERIALS);
    if (Math.random() < 0.25) { // occasional special material slot
      material = isLaw ? "Ivory" : "Obsidian";
    }

    // Name & Patron (alignment-matched, 50/50 M/F)
    function pickClericName(isLaw) {
      var male = isLaw ? global.LawfulMaleClericNames : global.ChaoticMaleClericNames;
      var female = isLaw ? global.LawfulFemaleClericNames : global.ChaoticFemaleClericNames;
      var pool = (male && female) ? (Math.random() < 0.5 ? male : female) : (male || female || ["Nameless"]);
      return pick(pool);
    }
    var clericName = pickClericName(isLaw);
    var patronPool = isLaw ? global.LawfulClericPatrons : global.ChaoticClericPatrons;
    var patron = patronPool ? pick(patronPool) : (isLaw ? "The Holy" : "The Abyssal Powers");

    // Swap "Commune with relic’s patron" to specific name
    powerTexts = powerTexts.map(function(p){
      if (p === "Commune with relic’s patron") {
        return "Commune with " + (isLaw ? ("Saint " + clericName) : (clericName + " the Damned"));
      }
      return p;
    });

    // Saving throw bonus
    var totalST = totalModForST + powerCount + (hasLife ? 2 : 0);

    // Glow text
    var glow = isLaw ? "emits a warm glow, 15’ r." : "emits a sickening green glow, 15’ r.";

    // Make line (with A/An on first printed word = Fame if present, else Sacred/Sacrilegious)
    var leadWord = fameWord || (isLaw ? "Sacred" : "Sacrilegious");
    var article = aAn(leadWord);
    var alignTag = isLaw ? "Sacred" : "Sacrilegious";
    var makeLine =
      article + " " +
      (fameWord ? (fameWord + " ") : "") +
      alignTag + " " + material + " " + containerName +
      " with " + relicItem + " of " +
      (isLaw ? ("Saint " + clericName) : (clericName + " the Damned")) +
      " of " + patron;

    // Header line
    var header = (hasVsTarget
      ? ("+1 " + alignWord + " Relic, +2 vs. " + vsTarget + ", that " + glow)
      : ("+" + baseMod + " " + alignWord + " Relic, that " + glow));

    // Stats line
    var statsParts = [];
    if (zeal !== null) statsParts.push("ZEAL" + zeal);
    statsParts.push("WIS" + WIS);
    statsParts.push("+" + totalST + "ST");
    var statsLine = statsParts.join(" ");

    // Powers line (singular/plural label and semicolons only if >1)
    var powersLine = null;
    if (powerCount > 0) {
      var label = (powerCount === 1) ? "Sagacious Power: " : "Sagacious Powers: ";
      powersLine = label + powerTexts.join("; ");
    }

    // Voice line (Zeal ≥ 9)
    var voiceLine = null;
    if (zeal !== null && zeal >= 9) {
     var who = isLaw ? ("Saint " + clericName) : (clericName + " the Damned");
     var spoken = pick(ZEAL_SPOKEN_EFFECTS);
     var effect = isLaw ? spoken.law : spoken.chaos;
     voiceLine = "With the voice of " + who + " the relic " + effect + ".";
    }

    // Quest lines (always LAST)
    var questLines = [];
    var curseFn = safe("randomCurseContract");
    var questFn = safe("randomQuestContract");

    // Zeal sacrifice overrides +2 quest if Zeal > 0 on a +2 relic
    var shouldUseZealSacrifice =
      (zeal !== null && zeal > 0) && (isPlus2Relic || !isPlus2Relic);

    if (zeal !== null && zeal > 0 && (isPlus2Relic || !isPlus2Relic)) {
      // Zeal sacrifice (single line; alignment-specific; append full curse sentence)
      var inlineCurse = curseFn ? curseFn() : "[index: randomCurseContract]";
      if (isLaw) {
        questLines.push("Use contingent upon a tithe of all treasure and the sacrifice of everything necessary for solemn high celestial service or " + inlineCurse);
      } else {
        questLines.push("Use contingent upon a tithe of all treasure and the sacrifice of an innocent victim or " + inlineCurse);
      }
    } else if (isPlus2Relic) {
      // +2 quest (Option B wording): two tidy lines
      var questText = null, failCurse = null;
      if (questFn) {
        // Use the full quest contract text; split into quest sentence + failure line
        var block = questFn();
        // Extract the first sentence for quest, and the explicit "Failure to comply: ..." line
        var linesQ = String(block).split(/\r?\n/).map(function(s){return s.trim();}).filter(Boolean);
        var firstSentence = linesQ[0] || "Save or Character must undertake a quest.";
        var failureLine = (linesQ.find(function(s){return /^Failure to comply:/i.test(s);}) || "");
        questText = firstSentence.replace(/\s*$/,'');
        failCurse = failureLine || (curseFn ? ("Failure to comply: " + curseFn()) : "Failure to comply: [index: randomCurseContract]");
      } else {
        questText = "Save or Character must undertake a quest.";
        failCurse = (curseFn ? ("Failure to comply: " + curseFn()) : "Failure to comply: [index: randomCurseContract]");
      }
      questLines.push("Use contingent upon " + questText);
      questLines.push(failCurse);
    }

    // Assemble in required order
    lines.push(makeLine + ".");
    lines.push(header);
    lines.push(statsLine);
    if (lifeLine) lines.push(lifeLine);
    if (powersLine) lines.push(powersLine);
    if (voiceLine) lines.push(voiceLine);
    // Quest lines last
    for (var i=0;i<questLines.length;i++) lines.push(questLines[i]);

    return lines.join("\n");
  }

  // expose
  global.randomRelic = randomRelic;

})(this);
