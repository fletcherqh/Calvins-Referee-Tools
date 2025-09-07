/* Calvin Wargaming • Curse v1.0.0
   File: tables/curse.js

   Exposes (globals):
     - randomCurse()           -> "Random Curse: …"
     - randomCurseContract()   -> multi-line wrapper for GUI

   Notes:
     - Pulls single-line inserts from existing subsystems:
         Disease:   randomDisease()
         Insanity:  randomInsanity()
         Exile:     randomExile()
         Direction: randomDirection8()  (not required here; exile already uses it)
         Unique:    randomMonster() / randomMonsterContract() (reserved for later)
*/

(function (global) {
  'use strict';

  // ---------- local tables ----------
  var PARTS = [
    "nose","ears","eyes","hands","feet","fingers","head","mouth","teeth","nails",
    "hair","arms","legs","trunk","chest","skin","toes","back","shoulders","knees"
  ];

  var SKIN_COLORS = [
    "chalky","bruised","pink","red","blue","green","jaundiced","purple",
    "orange","grey","leathery"
    // polkadots handled separately
  ];

  var ANIMALS_MONSTERS = [
    "a chicken","a duck","a frog","a toad","a horny toad","a mosquito","a fly",
    "a beetle","a cockroach","a junebug",
    "an orc","a goblin","a troll","a giant","green slime","a gargoyle","a spectre",
    "a vampire","a minotaur","a cockatrice"
  ];

  // ---------- utils ----------
  function d(n) { return Math.floor(Math.random() * n) + 1; }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // Skin condition, with a 1-in-4 chance of "covered in [color] polkadots"
  function skinCondition() {
    if (d(4) === 1) return "covered in " + pick(SKIN_COLORS) + " polkadots";
    return pick(SKIN_COLORS);
  }

  // Pull just the disease NAME from randomDisease()’s sentence output.
  // Example incoming: "Leprosy which, left untreated, will result in death in 1 weeks"
  function diseaseNameFromSentence(s) {
    var idx = s.indexOf(" which");
    return (idx > 0) ? s.slice(0, idx) : s; // fallback: whole string
  }

  // Hooks to other systems (defensive in case not loaded yet)
  function safe(fnName) { return (global[fnName] && typeof global[fnName] === "function") ? global[fnName] : null; }

  // Build one curse line (no trailing period, we add it in the wrapper)
  function curseLine() {
    var diseaseFn  = safe("randomDisease");
    var insanityFn = safe("randomInsanity");
    var exileFn    = safe("randomExile");
    // var direction8 = safe("randomDirection8"); // reserved if we want direction-only effects later
    // var monsterFn  = safe("randomMonster");     // reserved for future “manifest” style

    var options = [
      function () { return "warts erupting over character’s " + pick(PARTS); },
      function () { return "enlargement of character’s " + pick(PARTS); },
      function () { return "the shrinking of character’s " + pick(PARTS); },
      function () { return "growing a new " + pick(PARTS); },
      function () { return "uncontrollable shaking of character’s " + pick(PARTS); },
      function () { return "a repulsively stinking disease that turns the character’s skin " + skinCondition(); },
      function () {
        if (diseaseFn) {
          var sent = diseaseFn();
          return "the Disease of " + diseaseNameFromSentence(sent);
        }
        return "a wasting disease"; // graceful fallback
      },
      function () {
        if (insanityFn) return insanityFn(); // already a concise single line
        return "a debilitating madness";
      },
      function () {
        if (exileFn) {
          // ex: "Exiled to the Abyss." -> make it a noun phrase
          var s = exileFn().replace(/^Exiled to /, "exile to ");
          s = s.replace(/\.$/, ""); // strip trailing period if present
          return s;
        }
        return "banishment to an unknown realm";
      },
      function () { return "being turned into " + pick(ANIMALS_MONSTERS); },
      function () { return "blindness"; },
      function () { return "deafness"; },
      function () { return "growing taller"; },
      function () { return "growing shorter"; },
      function () { return "narcolepsy"; },
      function () { return "compulsive truthfulness"; },
      function () { return "compulsive lying"; },
      function () { return "crying fits"; },
      function () { return "laughing fits"; }
    ];

    return pick(options)();
  }

  // ---------- public API ----------
  function randomCurse() {
    return "Random Curse: " + cap(curseLine()) + ".";
  }

  function randomCurseContract() {
  return "Character cursed with " + curseLine() + ".";
  }

  // ---------- expose globals ----------
  global.randomCurse = randomCurse;
  global.randomCurseContract = randomCurseContract;

})(window);
