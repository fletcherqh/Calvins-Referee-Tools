
/* Calvin’s Referee Tools — Insanity tables (scaffold)
   File: tables/insanity.js

   Exposes (globals):
     - insanityTable()          -> string (name only; no trailing period)
     - randomInsanity()         -> "[Insanity Name] with 2d6 [unit]."
     - randomInsanityContract() -> 4-line wrapper for button use

   Notes:
     - All subtables (Phobias, Delusions, Hallucinated Monster) live here.
     - Duration unit by d10: 10=weeks, 7–9=days, 1–6=hours.
*/

(function (global) {
  // ---------- RNG helpers (prefer your dice.* if present) ----------
  function rollD6() {
    return (global.dice && typeof dice.d6 === "function")
      ? dice.d6()
      : (Math.floor(Math.random() * 6) + 1);
  }
  function roll2d6Sum() {
    return (global.dice && typeof dice.d6 === "function")
      ? dice.d6(2)
      : rollD6() + rollD6();
  }
  function rollD10() {
    return (global.dice && typeof dice.d10 === "function")
      ? dice.d10()
      : (Math.floor(Math.random() * 10) + 1);
  }
  function pick(arr) {
    var i = (global.dice && typeof dice.d100 === "function")
      ? Math.floor((dice.d100() - 1) * arr.length / 100)
      : Math.floor(Math.random() * arr.length);
    return arr[i];
  }

  // ---------- Duration unit ----------
  function unitFromD10(n) {
    if (n === 10) return "weeks";
    if (n >= 7)   return "days";
    return "hours";
  }

  // ---------- Subtables ----------
  function phobia() {
    var items = [
      "Arachnophobia",
      "Agoraphobia",
      "Claustrophobia",
      "Acrophobia",
      "Hemophobia",
      "Nyctophobia",
      "Nosophobia (fear of disease)",
      "Ophidiophobia (fear of snakes)",
      "Trypophobia (fear of patterns)"
    ];
    return pick(items);
  }

  function delusion() {
    var items = [
      "grandeur",
      "persecution",
      "significance (connecting events)",
      "reading other minds",
      "mind being read",
      "thoughts being injected"
    ];
    return pick(items);
  }

  function hallucinatedMonster() {
    var items = [
      "an assassin",
      "a thief",
      "orcs",
      "goblins",
      "a witch",
      "a demon",
      "a druid",
      "a damsel",
      "a white dragon",
      "a black dragon",
      "a blue dragon",
      "a green dragon",
      "a red dragon",
      "a golden dragon",
      "a giant",
      "a griffon",
      "a chimera",
      "a pegasus",
      "a manticore",
      "a wyvern",
      "a werewolf",
      "a skeleton",
      "a zombie",
      "a ghoul",
      "a wight",
      "a wraith",
      "a mummy",
      "a spectre",
      "a vampire",
      "a basilisk",
      "a Medusa",
      "a Lammasu",
      "a behemoth",
      "their mother-in-law",
      "their worst childhood bully",
      "the bogey man"
    ];
    return pick(items);
  }

  // ---------- Main picker (name only; no trailing period) ----------
  function insanityTable() {
    // Weighted-ish pool (≈ d20 feel)
    var pool = [
      "Amnesia",
      "Catatonia",
      "Obsessive Counting",
      "Delusion of Phantom limb",
      "Doubling (again that day)",
      "Hallucinations of " + hallucinatedMonster(),
      "Hysteria",
      "Melancholia",
      "Repetition (immediate)",
      "Ritualizing",
      "Delusions of " + delusion(),
      phobia(),
      // weights
      "Obsessive Counting",
      "Ritualizing",
      "Hysteria",
      "Melancholia",
      phobia(),
      phobia(),
      "Delusions of " + delusion(),
      "Delusions of " + delusion()
    ];
    return pick(pool);
  }

  // REPLACE lines 145–151 (inclusive) in tables/insanity.js with this:
  function randomInsanity() {
  var name = insanityTable();
  var unit = unitFromD10(rollD10());
  var len  = roll2d6Sum();                 // roll the 2d6 and use the sum
  return name + " for " + len + " " + unit + ".";
}

  function randomInsanityContract() {
    var name = insanityTable();            // no trailing period
    var unit = unitFromD10(rollD10());
    var len  = roll2d6Sum();               // show summed value
    var line0 = "Upon encountering Eldritch Abomination or Arcana, check INT or character develops " + name + ".";
    var line1 = "Save against Adversity of permanent " + name + ".";
    var line2 = "If save succeeds, then character suffers " + name + " for " + len + " " + unit + ".";
    var line3 = "Save to halve the length of time.";
    return [line0, line1, line2, line3].join("\n");
  }

  // ---------- expose ----------
  global.insanityTable = insanityTable;
  global.randomInsanity = randomInsanity;
  global.randomInsanityContract = randomInsanityContract;

})(window);

