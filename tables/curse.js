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
    "nose","ear","eye","hand","foot","finger","head","mouth","set of teeth","nail",
    "head of hair","arm","leg","trunk","chest","skin","toe","backside","shoulder","knee"
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
      var diseaseContract = safe("randomDiseaseContract");
      if (diseaseContract) {
       // e.g., "Character contracts Leprosy which, left untreated, ..."
      var s = diseaseContract();
       s = s.replace(/^Character contracts /, ""); // drop the leading tag
       return s; // "Leprosy which, left untreated, ..."
      }
      if (diseaseFn) {
       // fallback: single-sentence version if contract isn't present
       return diseaseFn();
      }
      return "a wasting disease"; // graceful fallback
    },
    function () {
      var ic = safe("randomInsanityContract");
      if (ic) {
       var text = ic();                  // full 4-line contract
       var lines = String(text).split("\n");
       var l1 = lines[1] || "";          // "Save against Adversity of permanent NAME."
       var l2 = lines[2] || "";          // "If save succeeds, then character suffers NAME for …"
       var l3 = lines[3] || "";          // "Save to halve the length of time."
       // Extract NAME from l1
       var m = l1.match(/permanent (.+)\./);
       var name = m ? m[1] : "a debilitating madness";
       // Return multi-line block: first line = NAME, then l1–l3 unchanged
       return [name, l1, l2, l3].join("\n");
      }
      // Fallback: one-liner if contract function isn’t available
      if (insanityFn) return insanityFn();
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
   var text = curseLine();
   if (text.indexOf("\n") !== -1) {
    // Multi-line case (e.g., Insanity)
    var parts = text.split("\n");
    var first = parts.shift(); // name only, no trailing period
    return ["Character cursed with " + first + ".", parts.join("\n")].join("\n");
   }
   // Single-line case (all other curse options)
   return "Character cursed with " + text + ".";
  }


  // ---------- expose globals ----------
  global.randomCurse = randomCurse;
  global.randomCurseContract = randomCurseContract;

})(window);
