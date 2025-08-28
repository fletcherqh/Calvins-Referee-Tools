/* Dwarf-specific first names */
'use strict';
/* global dice, oddNames */
if (typeof oddNames === 'undefined') { var oddNames = {}; }
oddNames._dwarfMaleFirst = [
  "Rocky",
  "Toughy",
  "Smarty",
  "Droopy",
  "Snappy",
  "Pappy",
  "Noffy",
  "Pokey",
  "Sloppy",
  "Poppy",
  "Boppy",
  "Bopper",
  "Cappy",
  "Dapper",
  "Gem",
  "Hairy",
  "Hopper",
  "Jasper",
  "Jiffy",
  "Jug",
  "Laffy",
  "Naffer",
  "Popper",
  "Roper",
  "Rip",
  "Torn",
  "Torg",
  "Tapper",
  "Tappy",
  "Tipper",
  "Snappy",
  "Swifty",
  "Xander",
  "Yodler",
  "Zippy",
  "Whooper",
  "Tekel",
  "Aparsin",
  "Og",
  "Grumbles"
];
oddNames._dwarfFemaleFirst = [
  "Apple",
  "Braid",
  "Button",
  "Dotty",
  "Dimple",
  "Diamond",
  "Emerald",
  "Goldie",
  "Gaia",
  "Gem",
  "Maia",
  "Henrietta",
  "Harrietta",
  "Jade",
  "Moira",
  "Nora",
  "Opal",
  "Petra",
  "Pearl",
  "Ruby",
  "Sapphire",
  "Tara",
  "Turquoise",
  "Ursala",
  "Velma",
  "Wipple",
  "Xenobia",
  "Yolanda",
  "Zora",
  "Menee"
];

/** Return a dwarf first name by gender: 'M' or 'F' (any other => random) */
oddNames.dwarfFirstName = function(gender) {
  if (gender === 'M') return dice.pick(oddNames._dwarfMaleFirst);
  if (gender === 'F') return dice.pick(oddNames._dwarfFemaleFirst);
  return dice.flip() ? dice.pick(oddNames._dwarfMaleFirst) : dice.pick(oddNames._dwarfFemaleFirst);
};