/* Dwarf-specific surnames (prefix + suffix, hyphens removed at the seam) */
'use strict';
/* global dice, oddNames */
if (typeof oddNames === 'undefined') { var oddNames = {}; }
oddNames._dwarfSurnamePrefix = [
  "Gold-",
  "Gold-",
  "Silver-",
  "Copper-",
  "Mithril-",
  "Led-",
  "Iron-",
  "Gem-",
  "Gem-",
  "Jewel-",
  "Jewel-",
  "Rock-",
  "Rock-",
  "Stone-",
  "Marble-",
  "Granite-",
  "Slate-",
  "Clay-",
  "Loam-",
  "Oak-"
];
oddNames._dwarfSurnameSuffix = [
  "-finder",
  "-seeker",
  "-spliter",
  "-binder",
  "-comber",
  "-heaver",
  "-dropper",
  "-miner",
  "-digger",
  "-smith",
  "-holder",
  "-cleaver",
  "-clever",
  "-carver",
  "-ceiler",
  "-fastner",
  "-lifter",
  "-prover",
  "-thrower",
  "-trader"
];

oddNames._stripHyphens = function(s, mode) {
  if (mode === 'end') return s.replace(/-+$/,'');
  if (mode === 'start') return s.replace(/^-+/,'');
  return s.replace(/^-+| -+$/g,'');
};

/** Return a dwarf surname like Oakfinder, Gemsmith, etc. */
oddNames.dwarfSurname = function() {
  var pre = dice.pick(oddNames._dwarfSurnamePrefix);
  var suf = dice.pick(oddNames._dwarfSurnameSuffix);
  pre = oddNames._stripHyphens(pre, 'end');
  suf = oddNames._stripHyphens(suf, 'start');
  return pre + suf;
};