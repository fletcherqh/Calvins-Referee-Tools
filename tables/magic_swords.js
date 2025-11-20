// /tables/magic_swords.js
// Perilous Realms Magic Sword Generation & Naming
// PURE GENERATORS — no DOM, no logging, no wiring in this file.
// All wiring will be done later in a separate chat.


// -------------------------------------------------------------
// Step 2: Canonical tables, prefixes, suffixes, and constants
// (no behavior; pure data mirroring the authoritative document)
// -------------------------------------------------------------

// ---------------------------
// Alignment & Glow
// ---------------------------

const ALIGNMENT = {
  LAWFUL: "Lawful",
  NEUTRAL: "Neutral",
  CHAOTIC: "Chaotic"
};

// 1.1 Alignment table (d6)
const ALIGNMENT_TABLE = [
  { min: 1, max: 3, alignment: ALIGNMENT.LAWFUL },
  { min: 4, max: 5, alignment: ALIGNMENT.NEUTRAL },
  { min: 6, max: 6, alignment: ALIGNMENT.CHAOTIC }
];

// 2.5 Inverted Alignment table (d6)
const INVERTED_ALIGNMENT_TABLE = [
  { min: 1, max: 3, alignment: ALIGNMENT.CHAOTIC },
  { min: 4, max: 5, alignment: ALIGNMENT.NEUTRAL },
  { min: 6, max: 6, alignment: ALIGNMENT.LAWFUL }
];

// 1.6 Glow color table
const GLOW_COLOR_BY_ALIGNMENT = {
  [ALIGNMENT.LAWFUL]: "blue",
  [ALIGNMENT.NEUTRAL]: "green",
  [ALIGNMENT.CHAOTIC]: "red"
};

// ---------------------------
// Alignment-derived Name Prefixes (1.3–1.5)
// ---------------------------

// 1.3 Lawful prefixes
const LAWFUL_PREFIXES = [
  "Law",
  "Order",
  "Blesséd",
  "Just",
  "True",
  "Azure",
  "Life",
  "Day",
  "Light",
  "Bliss",
  "Civil",
  "Herald",
  "Angel",
  "Ancient",
  "Mountain",
  "Height",
  "Elder"
];

// 1.4 Neutral prefixes
const NEUTRAL_PREFIXES = [
  "Tribe",
  "Loyal",
  "Even",
  "Verdant",
  "Dusk",
  "Dawn",
  "Elysian",
  "Sylvan",
  "Druid",
  "Oracle",
  "Glade",
  "Broad",
  "Essence",
  "Stone",
  "Hearth",
  "Moss",
  "River",
  "Oak",
  "Daemon",
  "Harvest"
];

// 1.5 Chaotic prefixes
const CHAOTIC_PREFIXES = [
  "Chaos",
  "Mayhem",
  "Cruel",
  "Red",
  "Crimson",
  "Blood",
  "Nix",
  "Dark",
  "Dis",
  "Barbarian",
  "Abyss",
  "Fathom",
  "Demon",
  "Under",
  "Howl",
  "Woe",
  "Devil",
  "Mort"
];

// ---------------------------
// Inscription tables (1.7–1.9)
// ---------------------------

const INSCRIPTION_TYPE = {
  ANCIENT: "Ancient",
  FAY: "Fay",
  COSMIC: "Cosmic",
  CYPHER: "Cypher",
  LOST: "Lost",
  CONDITIONAL: "Conditional"
};

// 1.7 General Inscription table (d20)
const INSCRIPTION_GENERAL_TABLE = [
  { min: 1, max: 5, type: INSCRIPTION_TYPE.ANCIENT },
  { min: 6, max: 10, type: INSCRIPTION_TYPE.FAY },
  { min: 11, max: 14, type: INSCRIPTION_TYPE.COSMIC },
  { min: 15, max: 17, type: INSCRIPTION_TYPE.CYPHER },
  { min: 18, max: 19, type: INSCRIPTION_TYPE.LOST },
  { min: 20, max: 20, type: INSCRIPTION_TYPE.CONDITIONAL }
];

// 1.8 Fay Inscription table (d6)
const INSCRIPTION_FAY_TABLE = [
  { min: 1, max: 3, language: "Elven" },
  { min: 4, max: 5, language: "Dwarven" },
  { min: 6, max: 6, language: "Alien" }
];

// 1.9 Cosmic inscription rules (Cosmic tongue matches alignment)
const COSMIC_LANGUAGE_BY_ALIGNMENT = {
  [ALIGNMENT.LAWFUL]: "Celestial",
  [ALIGNMENT.NEUTRAL]: "Elemental",
  [ALIGNMENT.CHAOTIC]: "Chthonic"
};

// ---------------------------
// Bonus & Special tables (2.1–2.8)
// ---------------------------

// 2.1 Lawful Sword Bonus table (d6)
const LAWFUL_BONUS_TABLE = [
  { min: 1, max: 3, bonus: "+1" },
  { min: 4, max: 5, bonus: "+2" },
  { min: 6, max: 6, bonus: "+3" }
];

// 2.3 Neutral Sword Bonus or Special table (d6)
const NEUTRAL_BONUS_OR_SPECIAL_TABLE = [
  { min: 1, max: 3, type: "BONUS", bonus: "+1" },
  { min: 4, max: 5, type: "BONUS", bonus: "+2" },
  { min: 6, max: 6, type: "SPECIAL", special: "LIFE_DRAINING" }
];

// 2.7 Chaotic Sword Bonus and Special table (d6)
const CHAOTIC_BONUS_OR_SPECIAL_TABLE = [
  { min: 1, max: 3, type: "BONUS", bonus: "+1" },
  { min: 4, max: 5, type: "BONUS", bonus: "+2" },
  { min: 6, max: 6, type: "SPECIAL", special: "PLUS3_CURSED" } // "+3 Cursed"
];

// Special sword types enum for convenience
const SPECIAL_SWORD_TYPE = {
  LIFE_DRAINING: "LIFE_DRAINING",
  PLUS3_CURSED: "PLUS3_CURSED",
  FLAMING: "FLAMING",
  LOCATE_OBJECT: "LOCATE_OBJECT",
  WISHES: "WISHES",
  CHARM_PERSON: "CHARM_PERSON"
};

// ---------------------------
// +1 Target or Special (2.9–2.11)
// ---------------------------

// 2.9 +1 Sword Target or Special table (d6)
const PLUS1_TARGET_OR_SPECIAL_TABLE = [
  { min: 1, max: 3, result: "NO_TARGET" },
  { min: 4, max: 5, result: "PLUS2_VS_SPECIFIC_TARGET" },
  { min: 6, max: 6, result: "SPECIAL_PLUS1_TABLE" }
];

// 2.11 Special +1 table (d6)
const SPECIAL_PLUS1_TABLE = [
  { min: 1, max: 3, type: "PLUS3_VS_DRAGONS" },
  { min: 4, max: 5, type: SPECIAL_SWORD_TYPE.FLAMING },
  { min: 6, max: 6, type: "LOCATE_OR_WISHES" } // 50/50 split
];

// ---------------------------
// +2 Target or Special (2.16)
// ---------------------------

// 2.16 “+2” Sword Target and Special table (d6)
const PLUS2_TARGET_OR_SPECIAL_TABLE = [
  { min: 1, max: 3, result: "PLUS3_VS_SPECIFIC_TARGET" },
  { min: 4, max: 5, result: SPECIAL_SWORD_TYPE.CHARM_PERSON },
  { min: 6, max: 6, result: "NO_TARGET" }
];

// ---------------------------
// Specific Target table & prefixes (2.20–2.21)
// ---------------------------

// 2.20 Specific Target by AL table (d20)
const SPECIFIC_TARGET = {
  FELL: "Fell",
  FAY: "Fay",
  UNDEAD: "Undead",
  CLASSICAL: "Classical",
  LYCANTHROPES: "Lycanthropes",
  GOTHIC: "Gothic",
  GIANTS: "Giants",
  MU_ENCHANTED: "Magic-users & Enchanted monsters",
  MU_ELEMENTALS: "Magic-users & Elementals",
  EVIL_CLERICS: "Evil Clerics",
  LAWFUL_CLERICS: "Lawful Clerics",
  DRAGONS: "Dragons" // special case from 2.12
};

const SPECIFIC_TARGET_TABLE = [
  {
    min: 1,
    max: 5,
    lawfulOrNeutral: SPECIFIC_TARGET.FELL,
    chaotic: SPECIFIC_TARGET.FAY
  },
  {
    min: 6,
    max: 10,
    lawfulOrNeutral: SPECIFIC_TARGET.UNDEAD,
    chaotic: SPECIFIC_TARGET.CLASSICAL
  },
  {
    min: 11,
    max: 14,
    lawfulOrNeutral: SPECIFIC_TARGET.LYCANTHROPES,
    chaotic: SPECIFIC_TARGET.GOTHIC
  },
  {
    min: 15,
    max: 17,
    lawfulOrNeutral: SPECIFIC_TARGET.GIANTS,
    chaotic: SPECIFIC_TARGET.GIANTS
  },
  {
    min: 18,
    max: 19,
    lawfulOrNeutral: SPECIFIC_TARGET.MU_ENCHANTED,
    chaotic: SPECIFIC_TARGET.MU_ELEMENTALS
  },
  {
    min: 20,
    max: 20,
    lawfulOrNeutral: SPECIFIC_TARGET.EVIL_CLERICS,
    chaotic: SPECIFIC_TARGET.LAWFUL_CLERICS
  }
];

// 2.21 Specific Target rules – naming prefixes
const SPECIFIC_TARGET_PREFIX_BY_TARGET_AND_ALIGNMENT = {
  [SPECIFIC_TARGET.FELL]: {
    any: "Fell"
  },
  [SPECIFIC_TARGET.FAY]: {
    any: "Fæ"
  },
  [SPECIFIC_TARGET.UNDEAD]: {
    any: ["Shadow", "Shade"] // two equally weighted options
  },
  [SPECIFIC_TARGET.CLASSICAL]: {
    any: "Acheron"
  },
  [SPECIFIC_TARGET.LYCANTHROPES]: {
    any: "Lycan"
  },
  [SPECIFIC_TARGET.GOTHIC]: {
    any: "Goth"
  },
  [SPECIFIC_TARGET.GIANTS]: {
    [ALIGNMENT.LAWFUL]: "Titan",
    [ALIGNMENT.NEUTRAL]: "Titan",
    [ALIGNMENT.CHAOTIC]: "Jotún"
  },
  [SPECIFIC_TARGET.MU_ENCHANTED]: {
    any: "Witch"
  },
  [SPECIFIC_TARGET.MU_ELEMENTALS]: {
    any: "Wizard"
  },
  [SPECIFIC_TARGET.EVIL_CLERICS]: {
    [ALIGNMENT.LAWFUL]: "Desol",
    [ALIGNMENT.NEUTRAL]: "Desol"
  },
  [SPECIFIC_TARGET.LAWFUL_CLERICS]: {
    [ALIGNMENT.CHAOTIC]: "Crux"
  }
};

// ---------------------------
// Life-energy Draining & Cursed prefixes (2.4, 2.8)
// ---------------------------

// 2.4 Life-energy Draining prefixes (two equally weighted)
const LIFE_DRAINING_PREFIXES = ["Soul", "Vita"];

// 2.4 Life-energy Draining extraordinary description text
const LIFE_DRAINING_EXTRAORDINARY_TEXT =
  "Drains life-energy upon successful attack and imparts life-energy to wielder when suffering life-energy drain";

// 2.8 +3 Chaotic Cursed sword prefixes (two equally weighted)
const CURSED_PLUS3_PREFIXES = ["Wyrd", "Hex"];

// 2.8 +3 Chaotic Cursed sword extraordinary description text
const PLUS3_CURSED_EXTRAORDINARY_TEXT =
  "triple bonus to damage vs. declared targets";

// 2.8 +3 Chaotic Cursed sword condition text template
const PLUS3_CURSED_CONDITION_TEMPLATE =
  "Condition: when wielder declares target, character saves or ";

// ---------------------------
// Special +1 prefixes (2.12–2.15)
// ---------------------------

// 2.12 “+3 vs. Dragons” prefixes
const DRAGONS_PREFIXES = ["Draco", "Wyrm"];

// 2.13 Flaming prefixes
const FLAMING_PREFIXES = ["Bright", "Flame", "Fire", "Blaze", "Pyre"];

// 2.13 Flaming extraordinary text
const FLAMING_EXTRAORDINARY_TEXT =
  "Ignites combustibles upon successful attack";

// 2.14 Locate Object prefix and extraordinary text
const LOCATE_OBJECT_PREFIX = "Seeker";
const LOCATE_OBJECT_EXTRAORDINARY_TEXT = "casts Locate Object spell";

// 2.15 Wishes prefix and extraordinary text
const WISHES_PREFIX = "Boon";
const WISHES_EXTRAORDINARY_TEXT_SUFFIX = "remaining wishes";

// 2.18 Charm Person prefix and extraordinary text
const CHARM_PERSON_PREFIX = "Spell";
const CHARM_PERSON_EXTRAORDINARY_TEXT = "casts Charm Person spell";

// ---------------------------
// Mission tables & prefixes (3.1–3.5)
// ---------------------------

const MISSION_TARGET = {
  MAGIC_USERS: "Magic-users",
  CLERICS: "Clerics",
  FIGHTING_MEN: "Fighting-men",
  POWERS: "Powers",
  MONSTERS: "Monsters"
};

// 3.2 Mission slay target table (d6)
const MISSION_TARGET_TABLE = [
  { min: 1, max: 1, target: MISSION_TARGET.MAGIC_USERS },
  { min: 2, max: 2, target: MISSION_TARGET.CLERICS },
  { min: 3, max: 3, target: MISSION_TARGET.FIGHTING_MEN },
  { min: 4, max: 4, target: MISSION_TARGET.POWERS },
  { min: 5, max: 6, target: MISSION_TARGET.MONSTERS }
];

// 3.3–3.5 Mission Prefixes by alignment and target
const MISSION_PREFIX_BY_ALIGNMENT_AND_TARGET = {
  [ALIGNMENT.LAWFUL]: {
    [MISSION_TARGET.MAGIC_USERS]: "Mage",
    [MISSION_TARGET.CLERICS]: "Inquest",
    [MISSION_TARGET.FIGHTING_MEN]: "War",
    [MISSION_TARGET.POWERS]: "Demon",
    [MISSION_TARGET.MONSTERS]: "Beast"
  },
  [ALIGNMENT.NEUTRAL]: {
    [MISSION_TARGET.MAGIC_USERS]: "Mage",
    [MISSION_TARGET.CLERICS]: "Sacer",
    [MISSION_TARGET.FIGHTING_MEN]: "War",
    [MISSION_TARGET.POWERS]: "Numen",
    [MISSION_TARGET.MONSTERS]: "Beast"
  },
  [ALIGNMENT.CHAOTIC]: {
    [MISSION_TARGET.MAGIC_USERS]: "Wizen",
    [MISSION_TARGET.CLERICS]: "Sacer",
    [MISSION_TARGET.FIGHTING_MEN]: "War",
    [MISSION_TARGET.POWERS]: "Angel",
    [MISSION_TARGET.MONSTERS]: "Beast"
  }
};

// ---------------------------
// Intelligence, Abilities & Communication (4.1–4.7)
// ---------------------------

// 4.2 INT to Ability determination (no direct table object needed yet; logic-driven),
// but we keep the thresholds as constants for clarity:
const INT_THRESHOLDS = {
  NO_ABILITIES_MAX: 6,
  FIRST_DETECT: 7,
  SECOND_DETECT: 8,
  THIRD_DETECT_MIN: 9,
  THIRD_DETECT_MAX: 11,
  EXTRA_AND_DETECT_INT: 12
};

// 4.5 General Language table (d10)
const GENERAL_LANGUAGE_TABLE = [
  { min: 1, max: 4, type: "ANCIENT", language: "Ancient" },
  { min: 5, max: 8, type: "FAY_TABLE" }, // defer to FAY_LANGUAGE_TABLE
  { min: 9, max: 10, type: "COSMIC" } // defer to COSMIC_LANGUAGE_BY_ALIGNMENT
];

// 4.6 Fay Language table (d6)
const FAY_LANGUAGE_TABLE = [
  { min: 1, max: 3, language: "Elven" },
  { min: 4, max: 5, language: "Dwarven" },
  { min: 6, max: 6, language: "Alien" }
];

// 4.7 Cosmic language rules – reuse COSMIC_LANGUAGE_BY_ALIGNMENT for spoken languages as well.

// ---------------------------
// Detect Abilities (4.8–4.10)
// ---------------------------

const DETECT_ABILITY = {
  GEMS: "Gems",
  GOLD: "Gold",
  METAL_AND_KIND: "Metal & kind",
  SHIFTING_SLOPING: "Shifting & sloping walls, rooms, and floors",
  MAGIC: "Magic",
  EVIL: "Evil",
  INVISIBLE: "Invisible",
  SECRET_DOORS: "Secret doors",
  TRAPS: "Traps",
  EXTRAORDINARY_ROLL: "EXTRAORDINARY_ROLL"
};

// 4.9 Detect Abilities table (d10 + sum of numerical bonuses)
const DETECT_ABILITIES_TABLE = [
  { min: 2, max: 3, ability: DETECT_ABILITY.GEMS },
  { min: 4, max: 5, ability: DETECT_ABILITY.GOLD },
  { min: 6, max: 7, ability: DETECT_ABILITY.METAL_AND_KIND },
  { min: 8, max: 8, ability: DETECT_ABILITY.SHIFTING_SLOPING },
  { min: 9, max: 9, ability: DETECT_ABILITY.MAGIC },
  { min: 10, max: 10, ability: DETECT_ABILITY.EVIL },
  { min: 11, max: 11, ability: DETECT_ABILITY.INVISIBLE },
  { min: 12, max: 12, ability: DETECT_ABILITY.SECRET_DOORS },
  { min: 13, max: 13, ability: DETECT_ABILITY.TRAPS },
  { min: 14, max: 99, ability: DETECT_ABILITY.EXTRAORDINARY_ROLL } // 14+
];


// ---------------------------
// Extraordinary Abilities (4.11–4.16)
// ---------------------------

const EXTRAORDINARY_TYPE = {
  PSYCHIC: "PSYCHIC",
  TRANSPORT: "TRANSPORT",
  UNIQUE: "UNIQUE"
};

// 4.11 Extraordinary Ability type table (d10)
const EXTRAORDINARY_TYPE_TABLE = [
  { min: 1, max: 4, type: EXTRAORDINARY_TYPE.PSYCHIC },
  { min: 5, max: 7, type: EXTRAORDINARY_TYPE.TRANSPORT },
  { min: 8, max: 9, type: EXTRAORDINARY_TYPE.UNIQUE },
  { min: 10, max: 10, type: "ROLL_TWICE" }
];

// 4.12 Psychic ability table (d6)
const PSYCHIC_ABILITY_TABLE = [
  { min: 1, max: 1, id: "CLAIRAUDIENCE", text: "Clairaudience" },
  { min: 2, max: 2, id: "CLAIRVOYANCE", text: "Clairvoyance" },
  { min: 3, max: 3, id: "ESP", text: "ESP" },
  { min: 4, max: 5, id: "TELEPATHY", text: "Telepathy –communicate by thought 6” r." },
  { min: 6, max: 6, id: "XRAY_VISION", text: "X-ray vision" }
];

// 4.13 Transport ability table (d6)
const TRANSPORT_ABILITY_TABLE = [
  { min: 1, max: 2, id: "TELEKINESIS", text: "Telekinesis" },
  { min: 3, max: 4, id: "LEVITATION", text: "Levitation" },
  { min: 5, max: 5, id: "TELEPORTATION", text: "Teleportation" },
  { min: 6, max: 6, id: "FLY", text: "Fly" }
];

// 4.14 Unique ability table (d6)
const UNIQUE_ABILITY_TABLE = [
  { min: 1, max: 3, id: "ILLUSION", text: "Illusion - casts Phantasmal Forces spell" },
  { min: 4, max: 5, id: "HEALING", text: "Healing - casts Cure Light Wounds once per character per day" },
  {
    min: 6,
    max: 6,
    id: "STRENGTH",
    text: "Strength - add 2 to 4 times character lvl. for 1-10 rounds of combat or 1-6 turns of exploration, once per day"
  }
];

// 4.16 Extraordinary Abilities naming prefixes (awesomeness-ordered via tables)
const EXTRAORDINARY_PREFIX_BY_ID = {
  CLAIRAUDIENCE: "Farsound",
  CLAIRVOYANCE: "Farsight",
  ESP: "Aether",
  TELEPATHY: "Whisper",
  XRAY_VISION: "Seer",
  TELEKINESIS: "Force",
  LEVITATION: "Glide",
  TELEPORTATION: ["Way", "Gate"], // two equally weighted options
  FLY: ["Wing", "Wind"], // two equally weighted options
  ILLUSION: {
    [ALIGNMENT.LAWFUL]: "Dream",
    [ALIGNMENT.NEUTRAL]: "Glamour",
    [ALIGNMENT.CHAOTIC]: "Phantom"
  },
  HEALING: "Hale",
  STRENGTH: "Might"
};


// ---------------------------
// Saving Throw (ST) & EGO (6.1–7.3)
// ---------------------------

// ST bonus is computed from:
//   S = sum of all numerical bonuses
//   +2 per Extraordinary Ability
//   +2 if sword has Mission
// We do not need a table for ST itself; this is pure formula.

// 7.2 Fame table (d10 + EGO score)
const FAME_ADJECTIVE_TABLE = [
  { min: 8, max: 9, adjective: "Unknown" },
  { min: 10, max: 11, adjective: "Obscure" },
  { min: 12, max: 15, adjective: "Well-known" },
  { min: 16, max: 18, adjective: "Famous" },
  { min: 19, max: 22, adjective: "Renown" }
];

// 7.3 Egotistical effect table (d8 + EGO score)
const EGOTISTICAL_EFFECT_TABLE = [
  {
    min: 10,
    max: 10,
    text: "When advancing for attack, a chorus of incorporeal voices joyfully sing the praises of the blade (check morale)"
  },
  {
    min: 11,
    max: 11,
    text: "When advancing for attack, blade audibly describes the manner of death its opponents face (check morale)"
  },
  {
    min: 12,
    max: 12,
    text: "When advancing for attack, the sword proclaims its lineage in a booming voice (check: morale)"
  },
  {
    min: 13,
    max: 13,
    text: "When victims killed, or opponents fail save, they mutter on about the sword’s fearsomeness (check: morale)"
  },
  {
    min: 14,
    max: 14,
    text: "When held aloft, the sword vibrates loudly until blood is spilled (check encounter)"
  },
  {
    min: 15,
    max: 15,
    text: "When held aloft, the sword sings a piercing note (check: encounter)"
  },
  {
    min: 16,
    max: 16,
    text: "Upon successful attack, sword’s edge throws off cold sparks that shoot out into any darknesses beyond (check: encounter)"
  },
  {
    min: 17,
    max: 17,
    text: "When held aloft or advancing for attack, sword leaps to receive a lightning strike (check morale & encounter)"
  },
  {
    min: 18,
    max: 18,
    text: "When held aloft or advancing for attack, an ethereal voice utters an ominous yet impenetrable omen (check morale & encounter)"
  },
  {
    min: 19,
    max: 20,
    text: "Upon conclusion of any new combat encounter, the sword audibly challenges any other magic-sword-wielding character (check: EGO struggle & NPC reaction)"
  }
];


// -------------------------------------------------------------
// End of Step 2: all canonical tables and constants are defined.
// Next steps will add behavior and generation logic.
// -------------------------------------------------------------

// -------------------------------------------------------------
// Step 3a: Core random helpers and SwordState scaffold
// (no full generation logic yet)
// -------------------------------------------------------------

// ---------------------------
// Random utility functions
// ---------------------------

/**
 * Roll 1dN and return an integer in [1, sides].
 */
function _rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

/**
 * Roll NdM and return the sum.
 */
function _rollDice(num, sides) {
  let total = 0;
  for (let i = 0; i < num; i++) {
    total += _rollDie(sides);
  }
  return total;
}

/**
 * Roll 1dN, then select the matching entry from a range-based table.
 * Table rows are objects with { min, max, ... }.
 */
function _rollOnRangeTable(table, sides) {
  const roll = _rollDie(sides);
  for (let i = 0; i < table.length; i++) {
    const row = table[i];
    if (roll >= row.min && roll <= row.max) {
      return { row, roll };
    }
  }
  // Should never happen if tables are correct.
  return { row: null, roll };
}

/**
 * Given a table already rolled (e.g., d20 + bonus), select the matching row.
 */
function _lookupRangeTableByValue(table, value) {
  for (let i = 0; i < table.length; i++) {
    const row = table[i];
    if (value >= row.min && value <= row.max) {
      return row;
    }
  }
  return null;
}

/**
 * Choose a random element from an array.
 */
function _choice(array) {
  if (!array || array.length === 0) return null;
  const idx = Math.floor(Math.random() * array.length);
  return array[idx];
}

// ---------------------------
// SwordState scaffold
// ---------------------------

/**
 * Internal SwordState object.
 * This is NOT exposed; public functions will eventually format it into
 * the canonical multi-line string.
 *
 * Fields are grouped roughly by output line:
 *
 * 1. namePrefix, nameSuffix, finalName
 * 2. bonuses / targets / alignment / fame / specials
 * 3. INT, EGO, ST, glowColor
 * 4. mission
 * 5. communication
 * 6. extraordinaryAbilities
 * 7. detectAbilities
 * 8. egotisticalEffect
 * 9. make (blade, hilt)
 * 10. inscription (type, originalLanguage)
 * 11. condition (curse, geas)
 */
function _createEmptySwordState() {
  return {
    // Core identity
    alignment: null,           // "Lawful" | "Neutral" | "Chaotic"
    glowColor: null,           // "blue" | "green" | "red"

    // Bonuses & target structure
    baseBonus: 0,              // numeric base bonus (1,2,3 or 0 for Life-drain)
    bonusSegments: [],         // e.g., [{ amount: 1, vs: null }, { amount: 2, vs: "Undead" }]
    isLifeDraining: false,
    isPlus3Cursed: false,
    isFlaming: false,
    isLocateObject: false,
    isWishes: false,
    wishesRemaining: 0,
    isCharmPerson: false,

    // Mission
    hasMission: false,
    missionTarget: null,       // e.g., "Magic-users", "Monsters"
    missionOpposingAlignmentDescriptor: null, // e.g., "chaotic Magic-users"
    missionEffect: null,       // "paralysis" | "disintegration"

    // INT / EGO / ST
    intScore: 0,
    egoScore: null,            // null if no EGO
    fameAdjective: null,       // Unknown / Obscure / Well-known / Famous / Renown
    stBonus: 0,                // ST+N

    // Communication
    hasEmpathy: false,
    hasTelepathy: false,
    canSpeak: false,
    speaksLanguages: [],       // array of language strings
    readsMagic: false,

    // Abilities
    detectAbilities: [],       // array of DETECT_ABILITY values
    extraordinaryAbilities: [],// array of { id, text }
    // For naming precedence: which category drove the name?
    namingPrefixCategory: null, // "MISS" | "SPEC" | "EXTR" | "TK" | "DETC" | "AL"

    // Egotistical effect
    egotisticalEffectText: null,

    // Make
    bladeMake: null,           // e.g., "steel", "steeled gold", "jet"
    hiltMake: null,            // e.g., "inlaid with precious stones", "of bone"

    // Inscription
    inscriptionType: null,     // INSCRIPTION_TYPE.*
    inscriptionLanguage: null, // the displayed language (Ancient, Elven, Celestial, etc.) or "Cypher"/"Lost"/"Conditional" text is inferred later
    inscriptionOriginalLanguage: null, // underlying language for Cypher/Lost/Conditional

    // Condition
    hasCurseCondition: false,
    curseText: null,           // randomCurse() string embedded text
    hasGeasCondition: false,
    geasText: null,            // randomGeas() string embedded text

    // Name
    namePrefix: null,
    nameSuffix: null,
    finalName: null            // fully joined prefix + suffix, with or without hyphen (computed later)
  };
}

// -------------------------------------------------------------
// NOTE:
// The actual core generator (_generateSword) and the wiring of
// magicSword(), swordOrRelic(), and the specialized generators
// into this pipeline will be implemented in the next part of
// Step 3. This scaffold ensures we have a clear, explicit data
// model to attach all the canonical rules to without guessing.
// -------------------------------------------------------------

// -------------------------------------------------------------
// Step 3b: Alignment, bonuses, specials, and targets
// (core random sword skeleton – no printing yet)
// -------------------------------------------------------------

// ---------------------------
// Alignment helpers
// ---------------------------

function _setAlignmentAndGlow(state, alignment) {
  state.alignment = alignment;
  state.glowColor = GLOW_COLOR_BY_ALIGNMENT[alignment] || null;
}

/**
 * Roll alignment using table 1.1 (unless already forced or set).
 */
function _determineAlignmentRandom(state) {
  if (state.alignment) {
    // Already set (e.g., by an alignment-specific generator later).
    state.glowColor = GLOW_COLOR_BY_ALIGNMENT[state.alignment] || null;
    return;
  }
  const result = _rollOnRangeTable(ALIGNMENT_TABLE, 6);
  _setAlignmentAndGlow(state, result.row.alignment);
}

/**
 * Invert alignment using table 2.5 (for Life-energy Draining swords).
 */
function _invertAlignmentForLifeDraining(state) {
  const result = _rollOnRangeTable(INVERTED_ALIGNMENT_TABLE, 6);
  _setAlignmentAndGlow(state, result.row.alignment);
}

// ---------------------------
// Bonus & target helpers
// ---------------------------

/**
 * Push a numeric bonus segment.
 * amount: 1, 2, 3 (or 0 for no numeric)
 * vs: null or a specific target string (e.g. "Undead", "Dragons").
 */
function _addBonusSegment(state, amount, vs) {
  if (amount && amount !== 0) {
    state.bonusSegments.push({ amount: amount, vs: vs || null });
  }
}

/**
 * Roll on the Specific Target table 2.20, using sword alignment.
 */
function _rollSpecificTarget(state) {
  const d20 = _rollDie(20);
  const row = _lookupRangeTableByValue(SPECIFIC_TARGET_TABLE, d20);
  if (!row) return null;

  if (state.alignment === ALIGNMENT.CHAOTIC) {
    return row.chaotic;
  }
  // Lawful & Neutral share the same column.
  return row.lawfulOrNeutral;
}

/**
 * Helper: mark special type flags on state.
 */
function _setSpecialType(state, specialType) {
  if (specialType === SPECIAL_SWORD_TYPE.LIFE_DRAINING) {
    state.isLifeDraining = true;
  } else if (specialType === SPECIAL_SWORD_TYPE.PLUS3_CURSED) {
    state.isPlus3Cursed = true;
  } else if (specialType === SPECIAL_SWORD_TYPE.FLAMING) {
    state.isFlaming = true;
  } else if (specialType === SPECIAL_SWORD_TYPE.LOCATE_OBJECT) {
    state.isLocateObject = true;
  } else if (specialType === SPECIAL_SWORD_TYPE.WISHES) {
    state.isWishes = true;
  } else if (specialType === SPECIAL_SWORD_TYPE.CHARM_PERSON) {
    state.isCharmPerson = true;
  }
}

// ---------------------------
// Base bonus & special resolution
// ---------------------------

/**
 * Determine base bonus, special status, and any built-in target structure,
 * according to alignment tables 2.1, 2.3, 2.7 and their downstream rules.
 *
 * This ONLY handles:
 * - base numeric bonuses
 * - life-energy draining special
 * - +3 Chaotic Cursed special
 * - Flaming / Locate Object / Wishes / Charm Person specials
 * - +2 vs [Specific Target], +3 vs [Specific Target], +3 vs Dragons
 *
 * It does NOT yet handle:
 * - Missions
 * - INT/EGO/ST
 * - Detect / Extraordinary from INT
 * - Naming
 * - Make / Inscription / Condition
 */
function _determineBonusesAndSpecialsRandom(state) {
  // Ensure we have an alignment first.
  _determineAlignmentRandom(state);

  // Lawful base: table 2.1
  if (state.alignment === ALIGNMENT.LAWFUL) {
    const result = _rollOnRangeTable(LAWFUL_BONUS_TABLE, 6);
    const baseBonusStr = result.row.bonus; // "+1", "+2", "+3"
    const baseBonus = parseInt(baseBonusStr.replace("+", ""), 10);
    state.baseBonus = baseBonus;

    if (baseBonus === 1) {
      _handlePlus1Branch(state);
    } else if (baseBonus === 2) {
      _handlePlus2Branch(state);
    } else if (baseBonus === 3) {
      // 2.2 "+3 Lawful Swords" rules:
      // Always determine specific target via 2.20.
      const target = _rollSpecificTarget(state);
      _addBonusSegment(state, 3, target); // "+3 vs. [target]"
      // No separate +1/+2 segment; the sword is simply +3 vs that target.
      // No special (other than being +3 targeted).
    }

    return;
  }

  // Neutral base: table 2.3
  if (state.alignment === ALIGNMENT.NEUTRAL) {
    const result = _rollOnRangeTable(NEUTRAL_BONUS_OR_SPECIAL_TABLE, 6);
    if (result.row.type === "BONUS") {
      const baseBonusStr = result.row.bonus; // "+1" or "+2"
      const baseBonus = parseInt(baseBonusStr.replace("+", ""), 10);
      state.baseBonus = baseBonus;

      if (baseBonus === 1) {
        _handlePlus1Branch(state);
      } else if (baseBonus === 2) {
        _handlePlus2Branch(state);
      }
    } else if (result.row.type === "SPECIAL" &&
               result.row.special === SPECIAL_SWORD_TYPE.LIFE_DRAINING) {
      // 2.4 Life-energy Draining rules:
      state.baseBonus = 0; // no numeric modifiers at all
      state.isLifeDraining = true;
      // Re-roll alignment on inverted table 2.5.
      _invertAlignmentForLifeDraining(state);
      // No numeric bonus segments, no targets.
    }
    return;
  }

  // Chaotic base: table 2.7
  if (state.alignment === ALIGNMENT.CHAOTIC) {
    const result = _rollOnRangeTable(CHAOTIC_BONUS_OR_SPECIAL_TABLE, 6);
    if (result.row.type === "BONUS") {
      const baseBonusStr = result.row.bonus; // "+1" or "+2"
      const baseBonus = parseInt(baseBonusStr.replace("+", ""), 10);
      state.baseBonus = baseBonus;

      if (baseBonus === 1) {
        _handlePlus1Branch(state);
      } else if (baseBonus === 2) {
        _handlePlus2Branch(state);
      }
    } else if (result.row.type === "SPECIAL" &&
               result.row.special === SPECIAL_SWORD_TYPE.PLUS3_CURSED) {
      // 2.8 "+3 Chaotic Cursed Sword" rules:
      state.baseBonus = 3;
      state.isPlus3Cursed = true;
      // No additional targets; just +3 Chaotic Cursed.
      _addBonusSegment(state, 3, null);
      // Later: Condition line will use PLUS3_CURSED_CONDITION_TEMPLATE and randomCurse().
    }
    return;
  }
}

// ---------------------------
// +1 branch (2.9–2.15)
// ---------------------------

/**
 * Handle "+1" sword Target/Special table 2.9 and downstream rules:
 * - NO TARGET → simple +1 sword
 * - +2 vs [Specific Target] (2.9–2.10, 2.20–2.21)
 * - Special +1 table (2.11) → +3 vs Dragons / Flaming / Locate Object / Wishes
 */
function _handlePlus1Branch(state) {
  const result = _rollOnRangeTable(PLUS1_TARGET_OR_SPECIAL_TABLE, 6);

  if (result.row.result === "NO_TARGET") {
    // 2.10 NO TARGET: "+1 [AL] Sword"
    _addBonusSegment(state, 1, null);
    // No target, no special.
    return;
  }

  if (result.row.result === "PLUS2_VS_SPECIFIC_TARGET") {
    // 2.10 "+1, +2 vs [Specific Target]"
    const target = _rollSpecificTarget(state);
    // Base +1 (no vs)
    _addBonusSegment(state, 1, null);
    // +2 vs target
    _addBonusSegment(state, 2, target);
    return;
  }

  if (result.row.result === "SPECIAL_PLUS1_TABLE") {
    // 2.11 Special +1 table
    const specResult = _rollOnRangeTable(SPECIAL_PLUS1_TABLE, 6);

    if (specResult.row.type === "PLUS3_VS_DRAGONS") {
      // 2.12 "+3 vs Dragons"
      state.baseBonus = 1; // base is still +1
      _addBonusSegment(state, 1, null);
      _addBonusSegment(state, 3, SPECIFIC_TARGET.DRAGONS); // "+3 vs Dragons"
      // Special type is "vs Dragons" but not flagged as one of the SPECIAL_SWORD_TYPE.*,
      // because rules treat it as a target, not as Flaming/Locate/Wishes/Charm.
      return;
    }

    if (specResult.row.type === SPECIAL_SWORD_TYPE.FLAMING) {
      // 2.13 Flaming sword rules
      state.baseBonus = 1;
      state.isFlaming = true;

      if (state.alignment === ALIGNMENT.LAWFUL ||
          state.alignment === ALIGNMENT.NEUTRAL) {
        // Lawful & Neutral: +1, +2 vs Trolls, +3 vs Undead
        _addBonusSegment(state, 1, null);
        _addBonusSegment(state, 2, "Trolls");
        _addBonusSegment(state, 3, SPECIFIC_TARGET.UNDEAD);
      } else if (state.alignment === ALIGNMENT.CHAOTIC) {
        // Chaotic: +1, +2 vs Pegasi, Hippogriffs and Rocs, +3 vs Ents
        _addBonusSegment(state, 1, null);
        _addBonusSegment(state, 2, "Pegasi, Hippogriffs and Rocs");
        _addBonusSegment(state, 3, "Ents");
      }
      return;
    }

    if (specResult.row.type === "LOCATE_OR_WISHES") {
      // 2.11, 2.14, 2.15 – 50/50 split: Locate Object / Wishes
      const choice = Math.random() < 0.5 ? SPECIAL_SWORD_TYPE.LOCATE_OBJECT : SPECIAL_SWORD_TYPE.WISHES;

      if (choice === SPECIAL_SWORD_TYPE.LOCATE_OBJECT) {
        // 2.14 Locate Object
        state.baseBonus = 1;
        state.isLocateObject = true;
        _addBonusSegment(state, 1, null);
        // No additional targets; special handled later on Extraordinary line.
      } else {
        // 2.15 Wishes
        state.baseBonus = 1;
        state.isWishes = true;
        _addBonusSegment(state, 1, null);
        state.wishesRemaining = _rollDice(2, 4); // 2d4 wishes (2–8)
      }
      return;
    }
  }
}

// ---------------------------
// +2 branch (2.16–2.19)
// ---------------------------

/**
 * Handle "+2" sword Target/Special table 2.16 and downstream:
 * - +3 vs [Specific Target] (2.17)
 * - Charm Person (2.18)
 * - NO TARGET (2.19)
 */
function _handlePlus2Branch(state) {
  const result = _rollOnRangeTable(PLUS2_TARGET_OR_SPECIAL_TABLE, 6);

  if (result.row.result === "PLUS3_VS_SPECIFIC_TARGET") {
    // 2.17 "+2, +3 vs [Specific Target]"
    const target = _rollSpecificTarget(state);
    state.baseBonus = 2;
    _addBonusSegment(state, 2, null);
    _addBonusSegment(state, 3, target);
    return;
  }

  if (result.row.result === SPECIAL_SWORD_TYPE.CHARM_PERSON) {
    // 2.18 Charm Person sword
    state.baseBonus = 2;
    state.isCharmPerson = true;
    _addBonusSegment(state, 2, null);
    // No specific target; extraordinary Charm Person handled later.
    return;
  }

  if (result.row.result === "NO_TARGET") {
    // 2.19 "+2 NO TARGET"
    state.baseBonus = 2;
    _addBonusSegment(state, 2, null);
    // No target, not Special.
    return;
  }
}

// -------------------------------------------------------------
// Step 3c: INT score and numeric bonus helpers
// (no Detect/Extraordinary/EGO/ST yet)
// -------------------------------------------------------------

/**
 * Compute S = sum of all numeric bonuses, per 6.1–6.2.
 * Example: a Flaming sword (+1, +2 vs Trolls, +3 vs Undead) → S = 1 + 2 + 3 = 6.
 * Life-energy Draining swords have no numeric bonuses; S will be 0.
 */
function _computeNumericBonusSum(state) {
  let sum = 0;
  if (state.bonusSegments && state.bonusSegments.length > 0) {
    for (let i = 0; i < state.bonusSegments.length; i++) {
      const seg = state.bonusSegments[i];
      if (typeof seg.amount === "number") {
        sum += seg.amount;
      }
    }
  }
  return sum;
}

/**
 * Helper: does this sword have any specific target?
 * "Target" means any bonus segment with a non-null 'vs' clause, e.g. "+2 vs. Undead".
 */
function _hasTarget(state) {
  if (!state.bonusSegments) return false;
  for (let i = 0; i < state.bonusSegments.length; i++) {
    if (state.bonusSegments[i].vs) {
      return true;
    }
  }
  return false;
}

/**
 * Helper: is this a Special sword in the sense of 4.1?
 * Special swords are:
 * - Life-energy Draining
 * - +3 Chaotic Cursed
 * - Flaming
 * - Locate Object
 * - Wishes
 * - Charm Person
 */
function _isSpecialSword(state) {
  return !!(
    state.isLifeDraining ||
    state.isPlus3Cursed ||
    state.isFlaming ||
    state.isLocateObject ||
    state.isWishes ||
    state.isCharmPerson
  );
}

/**
 * Determine INT score, per 4.1:
 *
 * - Swords with mission have INT 12.
 * - Special swords (Life-energy Draining, Cursed, Flaming, Locate Object, Wish, Charm Person),
 *   and swords with target, but without mission, roll d10+2 (3–12).
 * - Swords that are not special, and without mission or target roll d12 (1–12).
 *
 * NOTE:
 * This function assumes:
 * - state.hasMission is already set (later step will set this before calling here).
 * - Special flags and bonus segments are already determined.
 */
function _determineIntScore(state) {
  if (state.hasMission) {
    // Swords with mission have INT 12.
    state.intScore = 12;
    return;
  }

  const special = _isSpecialSword(state);
  const hasTarget = _hasTarget(state);

  if (special || hasTarget) {
    // Special swords and swords with target, but without mission:
    // d10+2 → INT 3–12.
    state.intScore = _rollDie(10) + 2;
  } else {
    // Swords that are not special, and without mission or target:
    // d12 → INT 1–12.
    state.intScore = _rollDie(12);
  }
}

// -------------------------------------------------------------
// Step 3d: Mission rules (3.1–3.5)
// -------------------------------------------------------------

/**
 * Internal: determine the descriptive mission target phrase used in the
 * Mission line, including opposing alignment where required.
 *
 * Per 3.1:
 * - Lawful and Chaotic sword missions target the *opposing* alignment.
 * - Neutral swords use no alignment adjective in front of the mission target.
 *
 * Examples:
 * - Lawful sword, target Magic-users → "chaotic Magic-users"
 * - Chaotic sword, target Magic-users → "lawful Magic-users"
 * - Neutral sword, target Magic-users → "Magic-users"
 */
function _computeMissionOpposingAlignmentDescriptor(state, missionTarget) {
  if (state.alignment === ALIGNMENT.LAWFUL) {
    return "chaotic " + missionTarget;
  }
  if (state.alignment === ALIGNMENT.CHAOTIC) {
    return "lawful " + missionTarget;
  }
  // Neutral swords: no alignment adjective.
  return missionTarget;
}

/**
 * Internal: determine the mission effect string used in the Mission line.
 *
 * Per 3.1:
 * - Lawful and Neutral swords inflict paralysis.
 * - Chaotic swords inflict disintegration.
 */
function _computeMissionEffect(state) {
  if (state.alignment === ALIGNMENT.CHAOTIC) {
    return "disintegration";
  }
  // Lawful & Neutral:
  return "paralysis";
}

/**
 * Internal: assign a mission target using table 3.2.
 * Returns one of MISSION_TARGET.* or null.
 */
function _rollMissionTarget() {
  const result = _rollOnRangeTable(MISSION_TARGET_TABLE, 6);
  return result.row ? result.row.target : null;
}

/**
 * Internal: assign mission data to the sword state.
 * This sets:
 * - hasMission = true
 * - missionTarget
 * - missionOpposingAlignmentDescriptor
 * - missionEffect
 *
 * NOTE:
 * Prefix for naming will later come from MISSION_PREFIX_BY_ALIGNMENT_AND_TARGET
 * when we choose the final name prefix (MISS > SPEC > EXTR > TK > DETC > AL).
 */
function _assignMission(state) {
  const missionTarget = _rollMissionTarget();
  if (!missionTarget) {
    return;
  }

  state.hasMission = true;
  state.missionTarget = missionTarget;
  state.missionOpposingAlignmentDescriptor =
    _computeMissionOpposingAlignmentDescriptor(state, missionTarget);
  state.missionEffect = _computeMissionEffect(state);
}

/**
 * Public-facing mission decision logic for the core generator:
 *
 * Per 3.1:
 * - Every sword has a 1:10 (10%) chance of having a unique Mission
 *   to slay a particular target.
 *
 * This function assumes:
 * - state.alignment is already determined.
 * - Bonuses/specials/targets have already been set.
 *
 * It will:
 * - With 1-in-10 chance, assign a mission using _assignMission(state).
 * - Otherwise leave hasMission = false.
 *
 * IMPORTANT:
 * - INT and EGO must be determined *after* this is called, since
 *   mission swords always have INT 12 and EGO 12.
 */
function _maybeAssignMission(state) {
  const roll = _rollDie(10);
  if (roll === 1) {
    _assignMission(state);
  }
}

// -------------------------------------------------------------
// Step 3e: EGO, Fame, and Egotistical effects (7.1–7.3)
// -------------------------------------------------------------

/**
 * Helper: does this sword qualify as "special" for EGO/INT purposes?
 * Same definition as _isSpecialSword, but kept separate for clarity.
 *
 * Special swords are:
 * - Life-energy Draining
 * - +3 Chaotic Cursed
 * - Flaming
 * - Locate Object
 * - Wishes
 * - Charm Person
 */
function _isSpecialForEgo(state) {
  return _isSpecialSword(state);
}

/**
 * Determine EGO score, Fame adjective, and Egotistical effect.
 *
 * Per 7.1:
 * - Swords with INT < 7 do not have an EGO score; skip EGO entirely.
 * - All swords with INT >= 7 have an EGO score.
 * - Swords with Mission have EGO 12.
 * - Special swords (Life-energy Draining, Cursed, Flaming, Locate Object, Wish, Charm Person)
 *   and swords with target, but without Mission roll d12 → EGO 1–12.
 * - Swords that are not Special, and without mission or target roll d10 → EGO 1–10.
 *
 * Per 7.2:
 * - Swords with EGO >= 7 receive a Fame adjective (Unknown / Obscure / Well-known / Famous / Renown)
 *   based on d10 + EGO score.
 *
 * Per 7.3:
 * - Swords with EGO >= 9 receive an Egotistical effect (Boast line),
 *   based on d8 + EGO score and the EGOTISTICAL_EFFECT_TABLE.
 */
function _determineEgoFameAndEffect(state) {
  // If INT < 7, there is no EGO at all.
  if (state.intScore < 7) {
    state.egoScore = null;
    state.fameAdjective = null;
    state.egotisticalEffectText = null;
    return;
  }

  // INT >= 7 → EGO must exist.
  // 7.1: priority for Mission first.
  if (state.hasMission) {
    // Swords with Mission have EGO 12.
    state.egoScore = 12;
  } else {
    const special = _isSpecialForEgo(state);
    const hasTarget = _hasTarget(state);

    if (special || hasTarget) {
      // Special swords and swords with target, but without mission:
      // d12 → EGO 1–12.
      state.egoScore = _rollDie(12);
    } else {
      // Not special, and without mission or target:
      // d10 → EGO 1–10.
      state.egoScore = _rollDie(10);
    }
  }

  // If for some reason EGO is still null/undefined, bail out defensively.
  if (state.egoScore == null) {
    state.fameAdjective = null;
    state.egotisticalEffectText = null;
    return;
  }

  // 7.2 Fame adjective: only if EGO >= 7.
  if (state.egoScore >= 7) {
    const fameRoll = _rollDie(10) + state.egoScore; // d10 + EGO score
    const fameRow = _lookupRangeTableByValue(FAME_ADJECTIVE_TABLE, fameRoll);
    state.fameAdjective = fameRow ? fameRow.adjective : null;
  } else {
    state.fameAdjective = null;
  }

  // 7.3 Egotistical effect: only if EGO >= 9.
  if (state.egoScore >= 9) {
    const egoEffectRoll = _rollDie(8) + state.egoScore; // d8 + EGO score
    const effectRow = _lookupRangeTableByValue(EGOTISTICAL_EFFECT_TABLE, egoEffectRoll);
    state.egotisticalEffectText = effectRow ? effectRow.text : null;
  } else {
    state.egotisticalEffectText = null;
  }
}

// -------------------------------------------------------------
// Step 3f: Detect Abilities and Extraordinary Abilities
// (4.2, 4.8–4.10, 4.11–4.16, plus specials)
// -------------------------------------------------------------

/**
 * Internal helper: add a Detect ability if not already present.
 */
function _addDetectAbility(state, ability) {
  if (!ability) return;
  if (!state.detectAbilities) {
    state.detectAbilities = [];
  }
  for (let i = 0; i < state.detectAbilities.length; i++) {
    if (state.detectAbilities[i] === ability) {
      return; // no duplicates
    }
  }
  state.detectAbilities.push(ability);
}

/**
 * Internal helper: add an Extraordinary ability if not already present.
 * id: internal id (e.g., "CLAIRAUDIENCE", "FLY", "ILLUSION", etc.)
 * text: full rules text to print
 * type: EXTRAORDINARY_TYPE.PSYCHIC / TRANSPORT / UNIQUE / "SPECIAL"
 */
function _addExtraordinaryAbility(state, id, text, type) {
  if (!id || !text) return;
  if (!state.extraordinaryAbilities) {
    state.extraordinaryAbilities = [];
  }
  for (let i = 0; i < state.extraordinaryAbilities.length; i++) {
    if (state.extraordinaryAbilities[i].id === id) {
      return; // no duplicates
    }
  }
  state.extraordinaryAbilities.push({
    id: id,
    text: text,
    type: type || null
  });
}

/**
 * Internal: roll one or more Extraordinary abilities according to 4.11–4.14
 * and add them to state.extraordinaryAbilities (avoiding duplicates).
 *
 * 4.11:
 * - 1–4: Psychic ability table
 * - 5–7: Transport ability table
 * - 8–9: Unique ability table
 * - 10: Roll twice on this table; re-roll duplicates
 */
function _rollExtraordinaryAbilitiesOnce(state) {
  const result = _rollOnRangeTable(EXTRAORDINARY_TYPE_TABLE, 10);
  if (!result.row) return;

  const type = result.row.type;

  // Helper: roll one ability from a given table and type.
  function rollFromTable(table, typeConst) {
    const r = _rollOnRangeTable(table, 6);
    if (!r.row) return;
    _addExtraordinaryAbility(state, r.row.id, r.row.text, typeConst);
  }

  if (type === EXTRAORDINARY_TYPE.PSYCHIC) {
    rollFromTable(PSYCHIC_ABILITY_TABLE, EXTRAORDINARY_TYPE.PSYCHIC);
  } else if (type === EXTRAORDINARY_TYPE.TRANSPORT) {
    rollFromTable(TRANSPORT_ABILITY_TABLE, EXTRAORDINARY_TYPE.TRANSPORT);
  } else if (type === EXTRAORDINARY_TYPE.UNIQUE) {
    rollFromTable(UNIQUE_ABILITY_TABLE, EXTRAORDINARY_TYPE.UNIQUE);
  } else if (type === "ROLL_TWICE") {
    // Roll twice on Extraordinary type table; re-roll duplicates.
    // We implement this by rolling twice, ensuring differing (id) results
    // via _addExtraordinaryAbility's duplicate protection.
    _rollExtraordinaryAbilitiesOnce(state);
    _rollExtraordinaryAbilitiesOnce(state);
  }
}

/**
 * Internal: apply Special sword Extraordinary abilities
 * (Life-energy Draining, +3 Cursed, Flaming, Locate Object, Wishes, Charm Person)
 * to the state.extraordinaryAbilities array.
 *
 * Per 2.4, 2.8, 2.13–2.15, 2.18:
 * - Life-energy Draining counts as an Extraordinary ability.
 * - +3 Chaotic Cursed swords have a triple-damage Extraordinary.
 * - Flaming swords: Ignites combustibles upon successful attack.
 * - Locate Object swords: casts Locate Object spell.
 * - Wishes swords: "[N] remaining wishes".
 * - Charm Person swords: casts Charm Person spell.
 *
 * These are considered type "SPECIAL" for later ST calculation and printing order.
 */
function _applySpecialExtraordinaryAbilities(state) {
  if (state.isLifeDraining) {
    _addExtraordinaryAbility(
      state,
      "LIFE_DRAINING",
      LIFE_DRAINING_EXTRAORDINARY_TEXT,
      "SPECIAL"
    );
  }

  if (state.isPlus3Cursed) {
    _addExtraordinaryAbility(
      state,
      "PLUS3_CURSED",
      "triple bonus to damage vs. declared targets",
      "SPECIAL"
    );
  }

  if (state.isFlaming) {
    _addExtraordinaryAbility(
      state,
      "FLAMING",
      FLAMING_EXTRAORDINARY_TEXT,
      "SPECIAL"
    );
  }

  if (state.isLocateObject) {
    _addExtraordinaryAbility(
      state,
      "LOCATE_OBJECT",
      LOCATE_OBJECT_EXTRAORDINARY_TEXT,
      "SPECIAL"
    );
  }

  if (state.isWishes) {
    const n = state.wishesRemaining || 0;
    const text =
      n > 0
        ? n + " " + WISHES_EXTRAORDINARY_TEXT_SUFFIX
        : WISHES_EXTRAORDINARY_TEXT_SUFFIX;
    _addExtraordinaryAbility(
      state,
      "WISHES",
      text,
      "SPECIAL"
    );
  }

  if (state.isCharmPerson) {
    _addExtraordinaryAbility(
      state,
      "CHARM_PERSON",
      CHARM_PERSON_EXTRAORDINARY_TEXT,
      "SPECIAL"
    );
  }
}

/**
 * Determine Detect abilities (4.2, 4.8–4.10) and
 * Extraordinary abilities from Detect 14+ and INT 12 (4.2, 4.11–4.14).
 *
 * Per 4.2:
 * INT / Powers
 * 1–6: NO abilities
 * 7:   roll once on Detect table
 * 8:   roll twice on Detect table
 * 9–11: roll thrice on Detect table
 * 12:  roll thrice on Detect table AND roll once for an Extraordinary Ability
 *
 * Detect rolling per 4.8–4.9:
 * - For swords with Detect abilities (INT >= 7), roll on Detect table
 *   adding sum of all numerical bonuses (S) to 1d10.
 * - Re-roll duplicates.
 * - On result 14+, roll one Extraordinary Ability instead (4.9, 14+).
 *
 * Extraordinary abilities:
 * - From INT = 12 (one roll on 4.11–4.14)
 * - From Detect table when result >= 14
 * - From special sword types (applied separately).
 */
function _determineDetectAndExtraordinary(state) {
  // First, apply any Special sword Extraordinary abilities.
  _applySpecialExtraordinaryAbilities(state);

  const intScore = state.intScore || 0;

  // INT 1–6: no Detect abilities, no INT-derived Extraordinary.
  if (intScore <= 6) {
    return;
  }

  // Determine how many Detect rolls based on INT (4.2).
  let detectRolls = 0;
  if (intScore === 7) {
    detectRolls = 1;
  } else if (intScore === 8) {
    detectRolls = 2;
  } else if (intScore >= 9 && intScore <= 11) {
    detectRolls = 3;
  } else if (intScore === 12) {
    detectRolls = 3; // plus one separate Extraordinary roll, below.
  }

  // Numeric bonus sum S (for Detect and later for ST and languages).
  const S = _computeNumericBonusSum(state);

  // Detect rolls:
  for (let i = 0; i < detectRolls; i++) {
    // 4.8: d10 + sum of numerical bonuses.
    const baseRoll = _rollDie(10);
    const total = baseRoll + S;
    const row = _lookupRangeTableByValue(DETECT_ABILITIES_TABLE, total);
    if (!row) continue;

    if (row.ability === DETECT_ABILITY.EXTRAORDINARY_ROLL) {
      // 4.9: 14+ → Roll one Extraordinary Ability using 4.11–4.14.
      _rollExtraordinaryAbilitiesOnce(state);
    } else {
      // Normal Detect ability; avoid duplicates.
      _addDetectAbility(state, row.ability);
    }
  }

  // INT 12: additional Extraordinary ability (4.2).
  if (intScore === 12) {
    _rollExtraordinaryAbilitiesOnce(state);
  }
}

// -------------------------------------------------------------
// Step 3g: Inscriptions (1.7–1.9) and Conditions (11)
// -------------------------------------------------------------

/**
 * Internal: roll a spoken/original language using 4.5–4.7.
 *
 * This is used for:
 * - Spoken languages (Communication)
 * - Original language when inscription is Cypher / Lost / Conditional.
 *
 * 4.5 General Language (d10):
 * 1–4: Ancient
 * 5–8: Fay Language table (4.6)
 * 9–10: alignment-determined Cosmic language (4.7)
 */
function _rollOriginalLanguageFromSpokenTables(alignment) {
  const result = _rollOnRangeTable(GENERAL_LANGUAGE_TABLE, 10);
  if (!result.row) return null;

  if (result.row.type === "ANCIENT") {
    return "Ancient";
  }

  if (result.row.type === "FAY_TABLE") {
    const fay = _rollOnRangeTable(FAY_LANGUAGE_TABLE, 6);
    return fay.row ? fay.row.language : null;
  }

  if (result.row.type === "COSMIC") {
    return COSMIC_LANGUAGE_BY_ALIGNMENT[alignment] || null;
  }

  return null;
}

/**
 * Determine inscription type and languages (1.7–1.9).
 *
 * Sets:
 * - inscriptionType (INSCRIPTION_TYPE.*)
 * - inscriptionLanguage (visible language/descriptor for line 10)
 * - inscriptionOriginalLanguage (for Cypher / Lost / Conditional)
 *
 * Rules:
 * 1.7 General Inscription table (d20):
 * 1–5: Ancient          → language = Ancient
 * 6–10: Fay table       → language = Elven/Dwarven/Alien (1.8)
 * 11–14: Cosmic         → language = Celestial/Elemental/Chthonic (1.9)
 * 15–17: Cypher         → language = "Cypher"; original language from 4.5–4.7
 * 18–19: Lost           → language = "Lost";   original language from 4.5–4.7
 * 20: Conditional       → type = Conditional; original language from 4.5–4.7
 */
function _determineInscription(state) {
  const result = _rollOnRangeTable(INSCRIPTION_GENERAL_TABLE, 20);
  if (!result.row) return;

  const type = result.row.type;
  state.inscriptionType = type;
  state.inscriptionLanguage = null;
  state.inscriptionOriginalLanguage = null;

  if (type === INSCRIPTION_TYPE.ANCIENT) {
    // 1–5: Ancient (actual language)
    state.inscriptionLanguage = "Ancient";
    // No separate original language.
    return;
  }

  if (type === INSCRIPTION_TYPE.FAY) {
    // 6–10: Fay table 1.8
    const fay = _rollOnRangeTable(INSCRIPTION_FAY_TABLE, 6);
    if (fay.row) {
      state.inscriptionLanguage = fay.row.language; // Elven / Dwarven / Alien
    }
    return;
  }

  if (type === INSCRIPTION_TYPE.COSMIC) {
    // 11–14: Cosmic language matches alignment (1.9)
    state.inscriptionLanguage = COSMIC_LANGUAGE_BY_ALIGNMENT[state.alignment] || null;
    return;
  }

  if (type === INSCRIPTION_TYPE.CYPHER) {
    // 15–17: Cypher, with original language from 4.5–4.7
    const originalLang = _rollOriginalLanguageFromSpokenTables(state.alignment);
    state.inscriptionLanguage = "Cypher";
    state.inscriptionOriginalLanguage = originalLang;
    return;
  }

  if (type === INSCRIPTION_TYPE.LOST) {
    // 18–19: Lost, with original language from 4.5–4.7
    const originalLang = _rollOriginalLanguageFromSpokenTables(state.alignment);
    state.inscriptionLanguage = "Lost";
    state.inscriptionOriginalLanguage = originalLang;
    return;
  }

  if (type === INSCRIPTION_TYPE.CONDITIONAL) {
    // 20: Conditional – inscription contingent on fulfillment of geas.
    // Visible language is determined at print time ("contingent upon fulfillment of geas ..."),
    // but we still need the original language from 4.5–4.7.
    const originalLang = _rollOriginalLanguageFromSpokenTables(state.alignment);
    state.inscriptionLanguage = "Conditional";
    state.inscriptionOriginalLanguage = originalLang;
    return;
  }
}

/**
 * Determine Condition line contents (11):
 *
 * - If sword is cursed (+3 Chaotic Cursed from 2.7–2.8), we set:
 *     hasCurseCondition = true
 *     curseText = randomCurse()
 *
 * - If inscription is Conditional (1.7–1.9), we set:
 *     hasGeasCondition = true
 *     geasText = randomGeas()
 *
 * The printing logic later will:
 * - Use the proper phrasing:
 *     For curse:  "Condition: Each time target declared character saves or suffers [randomCurse()]"
 *     For geas:   "Condition: name delivered if character will [randomGeas()]"
 *     For both:   join them with "; "
 *
 * NOTE:
 * - We assume randomCurse() and randomGeas() are globally available
 *   from /tables/curse.js and /tables/quest-geas.js respectively.
 */
function _determineConditions(state) {
  // Reset flags.
  state.hasCurseCondition = false;
  state.curseText = null;
  state.hasGeasCondition = false;
  state.geasText = null;

  // Cursed sword condition (only +3 Chaotic Cursed swords per 2.7–2.8).
  if (state.isPlus3Cursed && typeof randomCurse === "function") {
    state.hasCurseCondition = true;
    state.curseText = randomCurse(); // e.g., "Random Curse: Growing taller"
  }

  // Conditional inscription → geas condition (1.7, 1.9, 11).
  if (state.inscriptionType === INSCRIPTION_TYPE.CONDITIONAL &&
      typeof randomGeas === "function") {
    state.hasGeasCondition = true;
    state.geasText = randomGeas(); // e.g., "Rescue a Leaf 120 miles to the East."
  }
}

// -------------------------------------------------------------
// Step 3h: Communication & Spoken Languages (4.3–4.7)
// -------------------------------------------------------------

/**
 * Internal helper: pick the "language of the inscription" for
 * the purposes of spoken language ordering.
 *
 * Per 4.3:
 * - If Speaks, first language is always Common.
 * - If more than one language, the next language is always that
 *   of the language of its Inscription (even if Lost, Cypher, or Conditional).
 *
 * For Cypher / Lost / Conditional, we treat the "language of its inscription"
 * as the original language (inscriptionOriginalLanguage).
 * For Ancient / Fay / Cosmic, that is just inscriptionLanguage.
 */
function _getInscriptionTongueForSpeech(state) {
  // Prefer original language if present (Cypher/Lost/Conditional).
  if (state.inscriptionOriginalLanguage) {
    return state.inscriptionOriginalLanguage;
  }
  return state.inscriptionLanguage || null;
}

/**
 * Internal helper: add a spoken language string to state.speaksLanguages,
 * enforcing max 6 and avoiding duplicates.
 */
function _addSpokenLanguage(state, lang) {
  if (!lang) return;
  if (!state.speaksLanguages) {
    state.speaksLanguages = [];
  }
  // Max languages: 6.
  if (state.speaksLanguages.length >= 6) return;

  for (let i = 0; i < state.speaksLanguages.length; i++) {
    if (state.speaksLanguages[i] === lang) {
      return; // no duplicates
    }
  }
  state.speaksLanguages.push(lang);
}

/**
 * Determine Communication & Languages per 4.3–4.7.
 *
 * 4.3 Communication rules:
 * - INT >= 7  → Empathy
 * - INT >= 10 → Speaks; first language known is always Common.
 *   If more than one language, second is always "language of its Inscription"
 *   (even if Lost, Cypher, or Conditional, using original language).
 * - INT >= 11 → Reads magic
 * - INT = 12  → Telepathy as well.
 *
 * 4.4 Number of languages spoken:
 * - The number of languages a sword with Speaks ability knows is determined
 *   by the sum of its numerical bonuses (S).
 *   Examples:
 *   - +1 → 1 language (Common).
 *   - Flaming (+1, +2, +3) → 6 languages total.
 * - Max languages: 6.
 *
 * 4.5–4.7 Spoken language tables:
 * - We use _rollOriginalLanguageFromSpokenTables(alignment) to roll
 *   Ancient / Fay / Cosmic languages as needed.
 */
function _determineCommunicationAndLanguages(state) {
  const intScore = state.intScore || 0;

  // Reset communication flags and list.
  state.hasEmpathy = false;
  state.hasTelepathy = false;
  state.canSpeak = false;
  state.speaksLanguages = [];
  state.readsMagic = false;

  // INT < 7 → no communication at all.
  if (intScore < 7) {
    return;
  }

  // INT >= 7 → Empathy
  state.hasEmpathy = true;

  // INT >= 11 → Reads magic
  if (intScore >= 11) {
    state.readsMagic = true;
  }

  // INT >= 12 → Telepathy as well (prints before Empathy later).
  if (intScore >= 12) {
    state.hasTelepathy = true;
  }

  // INT >= 10 → Speaks
  if (intScore >= 10) {
    state.canSpeak = true;

  // Number of languages is based on sum of numerical bonuses (S), per 4.4.
  // Special case: Life-energy Draining swords have no numeric bonuses,
  // but if they can speak, we want them to know both Common and the
  // language of their Inscription (minimum 2 languages).
    let S = _computeNumericBonusSum(state);

  // Minimum number of languages for speaking swords:
  // - Normally: at least 1 (Common).
  // - Life-energy Draining swords: at least 2 (Common + inscription tongue).
  let minLanguages = state.isLifeDraining ? 2 : 1;
  if (S < minLanguages) {
      S = minLanguages;
  }

  let languagesDesired = S;
  if (languagesDesired > 6) {
     languagesDesired = 6;
  }

    // 1) First language: always Common.
    if (languagesDesired >= 1) {
      _addSpokenLanguage(state, "Common");
    }

    // 2) Second language: language of its Inscription, if applicable.
    if (languagesDesired >= 2) {
      const inscriptionTongue = _getInscriptionTongueForSpeech(state);
      _addSpokenLanguage(state, inscriptionTongue);
    }

    // 3) Remaining languages: from spoken language tables 4.5–4.7.
    //    Re-roll duplicates. Respect max 6.
    while (state.speaksLanguages.length < languagesDesired &&
           state.speaksLanguages.length < 6) {
      const lang = _rollOriginalLanguageFromSpokenTables(state.alignment);
      _addSpokenLanguage(state, lang);
    }
  }
}


// -------------------------------------------------------------
// Step 3i: Saving Throw bonus (ST) – rules 6.1–6.2
// -------------------------------------------------------------

/**
 * Internal helper: count Extraordinary abilities for ST purposes.
 *
 * Per 6.1–6.2:
 * - "Extraordinary Ability add two each."
 * - This includes:
 *   - All INT/Detect-derived Extraordinary abilities (4.11–4.14).
 *   - All Special sword Extraordinary abilities (Life-energy Draining,
 *     +3 Chaotic Cursed, Flaming, Locate Object, Wishes, Charm Person),
 *     which we already added to state.extraordinaryAbilities in
 *     _applySpecialExtraordinaryAbilities().
 */
function _countExtraordinaryAbilitiesForSt(state) {
  if (!state.extraordinaryAbilities || state.extraordinaryAbilities.length === 0) {
    return 0;
  }
  return state.extraordinaryAbilities.length;
}

/**
 * Determine ST bonus and store in state.stBonus.
 *
 * Per 6.1–6.2:
 * - S = sum of all numerical bonuses.
 *   (Example: Flaming sword +1, +2 vs Trolls, +3 vs Undead → S = 1 + 2 + 3 = 6.)
 * - Extraordinary Ability add two each.
 * - Mission adds two.
 *
 * Formula:
 *   ST bonus # = S (+2 per Extraordinary Ability) (+2 if sword has Mission)
 *
 * Example from spec:
 * - Flaming sword baseline S = 6 → ST+6
 * - Flaming sword with Mission and one Extraordinary Ability:
 *   S 6 + 2 (Mission) + 2 (Extraordinary) = ST+10
 */
function _determineSavingThrowBonus(state) {
  // Base S from numeric bonuses.
  const S = _computeNumericBonusSum(state);

  // Count Extraordinary abilities (including specials).
  const extraCount = _countExtraordinaryAbilitiesForSt(state);
  const extraBonus = extraCount * 2;

  // Mission adds +2 if present.
  const missionBonus = state.hasMission ? 2 : 0;

  const total = S + extraBonus + missionBonus;

  state.stBonus = total;
}


// -------------------------------------------------------------
// Step 3j: Naming – category, prefix, suffix, euphony
// (MISS > SPEC > EXTR > TK > DETC > AL)
// -------------------------------------------------------------

// ---------------------------
// Suffix buckets (5.2–5.8)
// ---------------------------

// 5.2 TK — Neutral (alignment neutral, always safe for any targeted sword)
const SUFFIX_TK_NEUTRAL = [
  "-bane",
  "-slayer",
  "-feller",
  "-hewer",
  "-breaker",
  "-sunder",
  "-sunderer",
  "-scourge",
  "-rend",
  "-render"
];

// 5.3 TK — Soft-Lawful
const SUFFIX_TK_SOFT_LAWFUL = [
  "-queller",
  "-smiter"
];

// 5.4 TK — Soft-Chaotic
const SUFFIX_TK_SOFT_CHAOTIC = [
  "-reaver",
  "-wrack",
  "-wrecker",
  "-doom",
  "-venger",
  "-ravager"
];

// 5.5 TK – Life-energy drain
const SUFFIX_TK_LIFE_DRAIN = [
  "-drinker",
  "-eater"
];

// 5.6 Neutral (Alignment-Neutral / Always-Safe)
const SUFFIX_NEUTRAL = [
  "-blade",
  "-brand",
  "-edge",
  "-cut",
  "-cutter",
  "-cleave",
  "-cleaver",
  "-slice",
  "-slicer",
  "-slash",
  "-slasher",
  "-piercer",
  "-stinger",
  "-glaive",
  "-sabre",
  "-shield",
  "-hearth"
];

// 5.7 Soft-Lawful (alignment-weighted)
const SUFFIX_SOFT_LAWFUL = [
  "-avenger",
  "-aegis",
  "-ward",
  "-warden",
  "-vigil",
  "-oath"
];

// 5.8 Soft-Chaotic (alignment-weighted)
const SUFFIX_SOFT_CHAOTIC = [
  "-fang",
  "-wrack",
  "-wrecker",
  "-doom",
  "-reaver",
  "-howl",
  "-blight",
  "-ruin",
  "-claw"
];

// ---------------------------
// Detect naming helpers (4.10)
// ---------------------------

const DETECT_NAMING_RANK = {};
DETECT_NAMING_RANK[DETECT_ABILITY.GEMS] = 1;
DETECT_NAMING_RANK[DETECT_ABILITY.GOLD] = 2;
DETECT_NAMING_RANK[DETECT_ABILITY.METAL_AND_KIND] = 3;
DETECT_NAMING_RANK[DETECT_ABILITY.SHIFTING_SLOPING] = 4;
DETECT_NAMING_RANK[DETECT_ABILITY.MAGIC] = 5;
DETECT_NAMING_RANK[DETECT_ABILITY.EVIL] = 6;
DETECT_NAMING_RANK[DETECT_ABILITY.INVISIBLE] = 7;
DETECT_NAMING_RANK[DETECT_ABILITY.SECRET_DOORS] = 8;
DETECT_NAMING_RANK[DETECT_ABILITY.TRAPS] = 9;

// Prefixes per 4.10.
const DETECT_PREFIX_BY_ABILITY = {};
DETECT_PREFIX_BY_ABILITY[DETECT_ABILITY.GEMS] = "Gem";
DETECT_PREFIX_BY_ABILITY[DETECT_ABILITY.GOLD] = "Geld";
DETECT_PREFIX_BY_ABILITY[DETECT_ABILITY.METAL_AND_KIND] = "Ferrum";
DETECT_PREFIX_BY_ABILITY[DETECT_ABILITY.SHIFTING_SLOPING] = "Plumb";
DETECT_PREFIX_BY_ABILITY[DETECT_ABILITY.MAGIC] = "Arcana";
DETECT_PREFIX_BY_ABILITY[DETECT_ABILITY.EVIL] = "Woe";
DETECT_PREFIX_BY_ABILITY[DETECT_ABILITY.INVISIBLE] = "Sight";
DETECT_PREFIX_BY_ABILITY[DETECT_ABILITY.SECRET_DOORS] = "Thyr";
DETECT_PREFIX_BY_ABILITY[DETECT_ABILITY.TRAPS] = "Snare";

// ---------------------------
// Extraordinary naming helpers (4.16)
// ---------------------------

// Awesomeness rank: psychic < transport < unique, and within each
// table from least (top) to most awesome (bottom).
const EXTRA_NAMING_RANK_BY_ID = {
  // Psychic (least awesome)
  CLAIRAUDIENCE: 1,
  CLAIRVOYANCE: 2,
  ESP: 3,
  TELEPATHY: 4,
  XRAY_VISION: 5,

  // Transport
  TELEKINESIS: 6,
  LEVITATION: 7,
  TELEPORTATION: 8,
  FLY: 9,

  // Unique (most awesome)
  ILLUSION: 10,
  HEALING: 11,
  STRENGTH: 12
};

// Prefixes per 4.16.
function _extraPrefixForAbilityId(state, id) {
  switch (id) {
    case "CLAIRAUDIENCE": return "Farsound";
    case "CLAIRVOYANCE":  return "Farsight";
    case "ESP":           return "Aether";
    case "TELEPATHY":     return "Whisper";
    case "XRAY_VISION":   return "Seer";
    case "TELEKINESIS":   return "Force";
    case "LEVITATION":    return "Glide";
    case "TELEPORTATION": {
      // Two equally weighted options: “Way”; “Gate”
      return Math.random() < 0.5 ? "Way" : "Gate";
    }
    case "FLY": {
      // Two equally weighted options: “Wing”; “Wind”
      return Math.random() < 0.5 ? "Wing" : "Wind";
    }
    case "ILLUSION": {
      // Three alignment-determined options:
      // L: “Dream”; N: “Glamour”; C: “Phantom”
      if (state.alignment === ALIGNMENT.LAWFUL) return "Dream";
      if (state.alignment === ALIGNMENT.NEUTRAL) return "Glamour";
      return "Phantom"; // Chaotic
    }
    case "HEALING":  return "Hale";
    case "STRENGTH": return "Might";
    default:
      return null;
  }
}

// ---------------------------
// Alignment prefix pools (1.3–1.5)
// ---------------------------

const ALIGNMENT_PREFIXES = {};
ALIGNMENT_PREFIXES[ALIGNMENT.LAWFUL] = [
  "Law",
  "Order",
  "Blesséd",
  "Just",
  "True",
  "Azure",
  "Life",
  "Day",
  "Light",
  "Bliss",
  "Civil",
  "Herald",
  "Angel",
  "Ancient",
  "Mountain",
  "Height",
  "Elder"
];

ALIGNMENT_PREFIXES[ALIGNMENT.NEUTRAL] = [
  "Tribe",
  "Loyal",
  "Even",
  "Verdant",
  "Dusk",
  "Dawn",
  "Elysian",
  "Sylvan",
  "Druid",
  "Oracle",
  "Glade",
  "Broad",
  "Essence",
  "Stone",
  "Hearth",
  "Moss",
  "River",
  "Oak",
  "Daemon",
  "Harvest"
];

ALIGNMENT_PREFIXES[ALIGNMENT.CHAOTIC] = [
  "Chaos",
  "Mayhem",
  "Cruel",
  "Red",
  "Crimson",
  "Blood",
  "Nix",
  "Dark",
  "Dis",
  "Barbarian",
  "Abyss",
  "Fathom",
  "Demon",
  "Under",
  "Howl",
  "Woe",
  "Devil",
  "Mort"
];

// ---------------------------
// Naming category helpers
// ---------------------------

/**
 * Helper: is this sword "Special" in the sense of naming:
 * Life-energy Draining, +3 Chaotic Cursed, Flaming, Locate Object,
 * Wishes, Charm Person.
 */
function _isSpecialForNaming(state) {
  return _isSpecialSword(state);
}

/**
 * Determine which category will contribute the name prefix,
 * per precedence:
 *
 * MISS > SPEC > EXTR > TK > DETC > AL
 *
 * MISS: mission swords (3.1–3.5)
 * SPEC: special swords (2.x Life drain, +3 Cursed, Flaming, Locate, Wishes, Charm)
 * EXTR: swords with Extraordinary abilities (but not special, no mission)
 * TK:   swords with target(s) (but no mission/special/extr)
 * DETC: swords with Detect abilities (but no higher categories)
 * AL:   fallback to alignment-derived prefixes (1.3–1.5)
 */
function _determineNamingCategory(state) {
  if (state.hasMission) {
    return "MISS";
  }
  if (_isSpecialForNaming(state)) {
    return "SPEC";
  }
  if (state.extraordinaryAbilities && state.extraordinaryAbilities.length > 0) {
    return "EXTR";
  }
  if (_hasTarget(state)) {
    return "TK";
  }
  if (state.detectAbilities && state.detectAbilities.length > 0) {
    return "DETC";
  }
  return "AL";
}

// ---------------------------
// Prefix selection per category
// ---------------------------

/**
 * Choose a prefix from the Mission tables 3.3–3.5 using
 * MISSION_PREFIX_BY_ALIGNMENT_AND_TARGET (defined in the tables section).
 */
function _chooseMissionPrefix(state) {
  if (!MISSION_PREFIX_BY_ALIGNMENT_AND_TARGET[state.alignment]) return null;
  const map = MISSION_PREFIX_BY_ALIGNMENT_AND_TARGET[state.alignment];
  if (!map[state.missionTarget]) return null;
  return map[state.missionTarget];
}

/**
 * Choose a prefix for Special swords (2.4, 2.8, 2.12–2.15, 2.18).
 *
 * Life-energy Draining: Soul / Vita
 * +3 Chaotic Cursed: Wyrd / Hex
 * Flaming: Bright / Flame / Fire / Blaze / Pyre
 * Locate Object: Seeker
 * Wishes: Boon
 * Charm Person: Spell
 *
 * "+3 vs Dragons" is treated as a TK-based special target (Draco / Wyrm),
 * handled in the TK branch based on SPECIFIC_TARGET.DRAGONS.
 */
function _chooseSpecialPrefix(state) {
  if (state.isLifeDraining) {
    return Math.random() < 0.5 ? "Soul" : "Vita";
  }
  if (state.isPlus3Cursed) {
    return Math.random() < 0.5 ? "Wyrd" : "Hex";
  }
  if (state.isFlaming) {
    const options = ["Bright", "Flame", "Fire", "Blaze", "Pyre"];
    return _choice(options);
  }
  if (state.isLocateObject) {
    return "Seeker";
  }
  if (state.isWishes) {
    return "Boon";
  }
  if (state.isCharmPerson) {
    return "Spell";
  }
  return null;
}

/**
 * Determine the "strongest" target for naming (TK) purposes.
 * If multiple targets, choose the one with the highest bonus;
 * break ties arbitrarily by first encountered.
 */
function _getStrongestTarget(state) {
  let best = null;
  let bestBonus = -Infinity;
  if (!state.bonusSegments) return null;
  for (let i = 0; i < state.bonusSegments.length; i++) {
    const seg = state.bonusSegments[i];
    if (!seg.vs) continue;
    if (typeof seg.amount === "number" && seg.amount > bestBonus) {
      bestBonus = seg.amount;
      best = seg.vs;
    }
  }
  return best;
}

/**
 * Map a target description string to its canonical TK prefix
 * per 2.21 and 2.12.
 */
function _targetPrefixForTarget(state, target) {
  if (!target) return null;

  // Normalize known specific targets
  switch (target) {
    case SPECIFIC_TARGET.FELL:          return "Fell";
    case SPECIFIC_TARGET.FAY:           return "Fæ";
    case SPECIFIC_TARGET.UNDEAD:        {
      // Two equally weighted options: "Shadow" / "Shade"
      return Math.random() < 0.5 ? "Shadow" : "Shade";
    }
    case SPECIFIC_TARGET.CLASSICAL:     return "Acheron";
    case SPECIFIC_TARGET.LYCANTHROPES:  return "Lycan";
    case SPECIFIC_TARGET.GOTHIC:        return "Goth";
    case SPECIFIC_TARGET.GIANTS: {
      // Giants: L/N → "Titan"; C → "Jotún"
      if (state.alignment === ALIGNMENT.CHAOTIC) return "Jotún";
      return "Titan";
    }
    case SPECIFIC_TARGET.MU_ENCHANTED:  return "Witch";
    case SPECIFIC_TARGET.MU_ELEMENTALS: return "Wizard";
    case SPECIFIC_TARGET.EVIL_CLERICS:  return "Desol";
    case SPECIFIC_TARGET.LAWFUL_CLERICS:return "Crux";
    case SPECIFIC_TARGET.DRAGONS: {
      // 2.12 "+3 vs Dragons": Draco / Wyrm (TK-based)
      return Math.random() < 0.5 ? "Draco" : "Wyrm";
    }
    default:
      return null;
  }
}

/**
 * Choose a TK-based prefix (2.21, 2.12, 2.10, 2.17).
 * Uses the strongest target (highest bonus) and maps it to
 * the canonical TK prefix via _targetPrefixForTarget.
 */
function _chooseTargetPrefix(state) {
  const strongestTarget = _getStrongestTarget(state);
  if (!strongestTarget) return null;
  return _targetPrefixForTarget(state, strongestTarget);
}

/**
 * Choose a Detect-based prefix (4.10) using the most awesome
 * Detect ability present on the sword.
 */
function _chooseDetectPrefix(state) {
  if (!state.detectAbilities || state.detectAbilities.length === 0) {
    return null;
  }
  let bestAbility = null;
  let bestRank = -Infinity;
  for (let i = 0; i < state.detectAbilities.length; i++) {
    const ability = state.detectAbilities[i];
    const rank = DETECT_NAMING_RANK[ability] || 0;
    if (rank > bestRank) {
      bestRank = rank;
      bestAbility = ability;
    }
  }
  if (!bestAbility) return null;
  return DETECT_PREFIX_BY_ABILITY[bestAbility] || null;
}

/**
 * Choose an Extraordinary-based prefix (4.16) using the most
 * awesome Extraordinary ability present (EXTR category only;
 * SPECIAL abilities are already handled under SPEC).
 */
function _chooseExtraordinaryPrefix(state) {
  if (!state.extraordinaryAbilities || state.extraordinaryAbilities.length === 0) {
    return null;
  }

  let bestId = null;
  let bestRank = -Infinity;

  for (let i = 0; i < state.extraordinaryAbilities.length; i++) {
    const ex = state.extraordinaryAbilities[i];
    // Skip special-type extraordinary abilities here; they name under SPEC.
    if (ex.type === "SPECIAL") continue;

    const rank = EXTRA_NAMING_RANK_BY_ID[ex.id] || 0;
    if (rank > bestRank) {
      bestRank = rank;
      bestId = ex.id;
    }
  }

  if (!bestId) {
    return null;
  }
  return _extraPrefixForAbilityId(state, bestId);
}

/**
 * Choose an alignment-based prefix (1.3–1.5) as fallback.
 */
function _chooseAlignmentPrefix(state) {
  const list = ALIGNMENT_PREFIXES[state.alignment];
  if (!list || list.length === 0) return null;
  return _choice(list);
}

/**
 * Top-level prefix chooser, based on naming category.
 */
function _chooseNamePrefix(state) {
  const category = _determineNamingCategory(state);
  state.namingPrefixCategory = category;

  let prefix = null;

  if (category === "MISS") {
    prefix = _chooseMissionPrefix(state);
  } else if (category === "SPEC") {
    prefix = _chooseSpecialPrefix(state);
  } else if (category === "EXTR") {
    prefix = _chooseExtraordinaryPrefix(state);
  } else if (category === "TK") {
    prefix = _chooseTargetPrefix(state);
  } else if (category === "DETC") {
    prefix = _chooseDetectPrefix(state);
  }

  if (!prefix) {
    // Fallback to alignment prefix.
    prefix = _chooseAlignmentPrefix(state);
  }

  state.namePrefix = prefix;
  return prefix;
}

// ---------------------------
// Suffix selection per context (5.1–5.9)
// ---------------------------

/**
 * Helper: get suffix options for Neutral-only cases.
 */
function _suffixesNeutralOnly() {
  return SUFFIX_NEUTRAL.slice();
}

/**
 * Helper: get suffix options for Neutral + soft AL (non-TK).
 */
function _suffixesNeutralSoftByAlignment(state) {
  let suffixes = SUFFIX_NEUTRAL.slice();
  if (state.alignment === ALIGNMENT.LAWFUL) {
    suffixes = suffixes.concat(SUFFIX_SOFT_LAWFUL);
  } else if (state.alignment === ALIGNMENT.CHAOTIC) {
    suffixes = suffixes.concat(SUFFIX_SOFT_CHAOTIC);
  }
  // Neutral swords: only neutral suffixes.
  return suffixes;
}

/**
 * Helper: get suffix options for TK Neutral + soft AL (5.2, 5.3, 5.4).
 */
function _suffixesTkNeutralSoftByAlignment(state) {
  let suffixes = SUFFIX_TK_NEUTRAL.slice();
  if (state.alignment === ALIGNMENT.LAWFUL) {
    suffixes = suffixes.concat(SUFFIX_TK_SOFT_LAWFUL);
  } else if (state.alignment === ALIGNMENT.CHAOTIC) {
    suffixes = suffixes.concat(SUFFIX_TK_SOFT_CHAOTIC);
  }
  // Neutral swords: only TK neutral suffixes.
  return suffixes;
}

/**
 * Helper: get suffix options for Life-energy Draining swords:
 * TK Life drain + TK soft AL (5.5 plus 5.3/5.4).
 */
function _suffixesLifeDrain(state) {
  let suffixes = SUFFIX_TK_LIFE_DRAIN.slice();
  if (state.alignment === ALIGNMENT.LAWFUL) {
    suffixes = suffixes.concat(SUFFIX_TK_SOFT_LAWFUL);
  } else if (state.alignment === ALIGNMENT.CHAOTIC) {
    suffixes = suffixes.concat(SUFFIX_TK_SOFT_CHAOTIC);
  }
  // If Neutral Life-drain, stick to life-drain suffixes only.
  return suffixes;
}

/**
 * Helper: get suffix options for +3 Chaotic Cursed swords:
 * Neutral (5.6) or Soft Chaotic (5.8).
 */
function _suffixesPlus3Cursed() {
  return SUFFIX_NEUTRAL.concat(SUFFIX_SOFT_CHAOTIC);
}

/**
 * Determine suffix options based on naming category and
 * sword properties, per specific rules in sections 2, 3, 4, 5.
 */
function _getSuffixOptionsForName(state) {
  const category = state.namingPrefixCategory;

  // Mission (3.1): Neutral and Soft Alignment TK suffixes (5.2 and 5.3 or 5.4).
  if (category === "MISS") {
    return _suffixesTkNeutralSoftByAlignment(state);
  }

  // Specials (2.x):
  if (category === "SPEC") {
    if (state.isLifeDraining) {
      // 2.4 Life-energy Draining: TK Life drain (5.5) + TK soft AL.
      return _suffixesLifeDrain(state);
    }
    if (state.isPlus3Cursed) {
      // 2.8 "+3 Chaotic Cursed Sword": Neutral (5.6) or Soft Chaotic (5.8).
      return _suffixesPlus3Cursed();
    }
    if (state.isFlaming) {
      // 2.13 Flaming: Neutral TK or Soft Alignment TK (5.2 and 5.3 or 5.4).
      return _suffixesTkNeutralSoftByAlignment(state);
    }
    if (state.isLocateObject || state.isWishes || state.isCharmPerson) {
      // 2.14, 2.15, 2.18: Neutral or Soft Alignment suffixes (5.6 and 5.7 or 5.8).
      return _suffixesNeutralSoftByAlignment(state);
    }
  }

  // EXTR: 4.16 – N and soft AL suffixes.
  if (category === "EXTR") {
    // The spec references N and soft AL; we follow the pattern used for
    // other non-TK prefixes: Neutral + soft alignment suffixes.
    return _suffixesNeutralSoftByAlignment(state);
  }

  // TK: 2.10, 2.12, 2.17, 2.21 – Neutral TK and Soft AL TK suffixes (5.2, 5.3, 5.4).
  if (category === "TK") {
    return _suffixesTkNeutralSoftByAlignment(state);
  }

  // DETC: 4.10 – Neutral and Soft Alignment suffixes (5.6 and 5.7 or 5.8).
  if (category === "DETC") {
    return _suffixesNeutralSoftByAlignment(state);
  }

  // AL fallback: 5.1 – Neutral buckets for Neutral; Neutral + Soft-L or Soft-C for L/C.
  return _suffixesNeutralSoftByAlignment(state);
}

// ---------------------------
// Euphony rules & final name (5.9)
// ---------------------------

/**
 * Decide whether to hyphenate prefix + suffixRoot per 5.9:
 *
 * - Treat "æ" as a vowel.
 * - Do not hyphenate smooth vowel+consonant joins.
 * - Insert hyphen if the join makes a harsh double-consonant
 *   or double-vowel start: if the final letter of the prefix
 *   and the first letter of the suffix root are both vowels
 *   or both consonants.
 *
 * Examples in the spec:
 * - "Bright-blade"; "Beast-fang"; "Law-edge"; "Fæwrecker";
 *   "Arcanablade"; "Souleater".
 */
function _joinPrefixAndSuffixWithEuphony(prefix, suffix) {
  if (!prefix || !suffix) return null;

  // Suffix is stored with leading "-", e.g. "-blade"
  let root = suffix;
  if (root.charAt(0) === "-") {
    root = root.substring(1);
  }

  if (prefix.length === 0 || root.length === 0) {
    return prefix + root;
  }

  const vowels = "aeiouyæAEIOUYÆ";

  const lastChar = prefix.charAt(prefix.length - 1);
  const firstChar = root.charAt(0);

  const lastIsVowel = vowels.indexOf(lastChar) !== -1;
  const firstIsVowel = vowels.indexOf(firstChar) !== -1;

  // If both vowels OR both consonants → insert hyphen.
  // Otherwise (vowel+consonant or consonant+vowel) → no hyphen.
  const needsHyphen = (lastIsVowel && firstIsVowel) || (!lastIsVowel && !firstIsVowel);

  if (needsHyphen) {
    return prefix + "-" + root;
  }
  return prefix + root;
}

/**
 * Determine suffix and final name, storing:
 * - state.nameSuffix
 * - state.finalName
 */
function _determineSuffixAndFinalName(state) {
  const prefix = state.namePrefix;
  if (!prefix) {
    state.nameSuffix = null;
    state.finalName = null;
    return;
  }

  const suffixOptions = _getSuffixOptionsForName(state);
  if (!suffixOptions || suffixOptions.length === 0) {
    state.nameSuffix = null;
    state.finalName = prefix;
    return;
  }

  const suffix = _choice(suffixOptions);
  state.nameSuffix = suffix;

  const finalName = _joinPrefixAndSuffixWithEuphony(prefix, suffix);
  state.finalName = finalName;
}

/**
 * High-level naming function:
 * - Chooses the naming category.
 * - Picks the appropriate prefix.
 * - Picks a legal suffix.
 * - Applies euphony to build finalName.
 */
function _determineSwordName(state) {
  _chooseNamePrefix(state);
  _determineSuffixAndFinalName(state);
}


// -------------------------------------------------------------
// Step 3k: Core generator pipeline – _generateSword()
// -------------------------------------------------------------

/**
 * Core internal generator.
 *
 * For now this is the "fully random" sword:
 * - Alignment via 1.1 (with inversion for Life-energy Draining per 2.5).
 * - Bonuses, specials, and targets via 2.x.
 * - 1-in-10 chance of Mission via 3.1–3.5.
 * - INT via 4.1.
 * - Detect + Extraordinary via 4.2, 4.8–4.16 (including specials).
 * - EGO, Fame, Egotistical effect via 7.1–7.3.
 * - Inscription via 1.7–1.9 (using 4.5–4.7 for original language when needed).
 * - Communication + languages via 4.3–4.7.
 * - Conditions (curse and/or geas) via 2.8, 1.7, 11 with randomCurse/randomGeas.
 * - ST via 6.1–6.2.
 * - Name prefix, suffix, and final name via MISS > SPEC > EXTR > TK > DETC > AL
 *   and suffix buckets 5.2–5.8 plus euphony 5.9.
 *
 * NOTE:
 * - Make (blade + hilt, 8.1–8.3) is NOT yet determined here; that
 *   will be added in a later increment once namingPrefixCategory
 *   is available for the Make-table bonuses.
 */
function _generateSword(options) {
  // options reserved for future use (alignment-specific, etc.)
  const state = _createEmptySwordState();

  // 1) Alignment, bonuses, specials, targets (2.x, 1.1, 2.5)
  _determineBonusesAndSpecialsRandom(state);

  // 2) Mission (3.1–3.5) – 1-in-10 chance, must happen before INT/EGO.
  _maybeAssignMission(state);

  // 3) INT (4.1) – depends on mission, specials, and targets.
  _determineIntScore(state);

  // 4) Detect + Extraordinary (4.2, 4.8–4.16) – includes special-derived
  //    Extraordinary abilities.
  _determineDetectAndExtraordinary(state);

  // 5) EGO, Fame, Egotistical effect (7.1–7.3) – depends on INT,
  //    mission, specials, and targets.
  _determineEgoFameAndEffect(state);

  // 6) Inscription (1.7–1.9) – depends on alignment; for Cypher/Lost/
  //    Conditional, we also roll original language via 4.5–4.7.
  _determineInscription(state);

  // 7) Communication + spoken languages (4.3–4.7) – depends on INT,
  //    alignment, numeric bonus sum S, and inscription language.
  _determineCommunicationAndLanguages(state);

  // 8) Conditions (11) – curse from +3 Chaotic Cursed, geas from
  //    Conditional inscription, using randomCurse() and randomGeas().
  _determineConditions(state);

  // 9) Saving Throw (ST) (6.1–6.2) – S (sum of numeric bonuses) plus
  //    +2 per Extraordinary ability plus +2 if sword has Mission.
  _determineSavingThrowBonus(state);

  // 10) Name (1., 2., 3., 4., 5.) – category precedence:
  //     MISS > SPEC > EXTR > TK > DETC > AL,
  //     then prefix choice, suffix bucket, and euphony.
  _determineSwordName(state);

  // 11) Make (8.1–8.3) – use namingPrefixCategory for roll bonuses,
  //     then Blade make (8.2) and Hilt make (8.3).
  _determineMake(state);

  return state;
}


// -------------------------------------------------------------
// Step 3L: Make – Blade and Hilt (8.1–8.3)
// -------------------------------------------------------------

// 8.2 Blade make table (d20 + bonus)
const BLADE_MAKE_TABLE = [
  { min: 1,  max: 11, blade: "steel" },
  { min: 12, max: 14, blade: "steeled silver" },
  { min: 15, max: 17, blade: "steeled gold" },
  { min: 18, max: 20, bladeLN: "jet",     bladeC: "obsidian" },
  { min: 21, max: 23, bladeLN: "crystal", bladeC: "adamant" },
  { min: 24, max: 25, blade: "energy" }
];

// 8.3 Hilt make table (d10 + bonus)
const HILT_MAKE_TABLE = [
  {
    min: 1,
    max: 3,
    hilt: "inlaid with semi-precious stones"
  },
  {
    min: 4,
    max: 6,
    hilt: "inlaid with precious stones"
  },
  {
    min: 7,
    max: 9,
    hiltLN: "of ebony",
    hiltC: "of bone"
  },
  {
    min: 10,
    max: 11,
    hiltLN: "of ivory",
    hiltC: "fashioned from a sabretooth"
  },
  {
    min: 12,
    max: 13,
    hilt: "of gold"
  },
  {
    min: 14,
    max: 15,
    hiltLN: "of oak",
    hiltC: "of wormwood"
  }
];

/**
 * Make roll bonus by naming prefix category (8.1):
 *
 * MISS: +5
 * SPEC: +4
 * EXTR: +3
 * TK:   +2
 * DETC: +1
 * AL:   +0
 */
function _getMakeRollBonus(state) {
  switch (state.namingPrefixCategory) {
    case "MISS": return 5;
    case "SPEC": return 4;
    case "EXTR": return 3;
    case "TK":   return 2;
    case "DETC": return 1;
    case "AL":
    default:
      return 0;
  }
}

/**
 * Determine blade make using 8.2 and naming prefix bonus.
 *
 * D20 (+bonus) / Blade
 *  1–11 : steel
 * 12–14 : steeled silver
 * 15–17 : steeled gold
 * 18–20 : L-N jet; C obsidian
 * 21–23 : L-N crystal; C adamant
 * 24–25 : energy
 */
function _determineBladeMake(state) {
  const bonus = _getMakeRollBonus(state);
  let roll = _rollDie(20) + bonus;
  if (roll < 1) roll = 1;
  if (roll > 25) roll = 25;

  const row = _lookupRangeTableByValue(BLADE_MAKE_TABLE, roll);
  if (!row) return;

  if (row.blade) {
    state.bladeMake = row.blade;
    return;
  }

  // Alignment-sensitive entries.
  if (row.bladeLN || row.bladeC) {
    if (state.alignment === ALIGNMENT.CHAOTIC) {
      state.bladeMake = row.bladeC || row.bladeLN || null;
    } else {
      // Lawful & Neutral share LN results.
      state.bladeMake = row.bladeLN || row.bladeC || null;
    }
  }
}

/**
 * Determine hilt make using 8.3 and naming prefix bonus.
 *
 * D10 (+bonus) / Hilt
 *  1–3  : inlaid with semi-precious stones
 *  4–6  : inlaid with precious stones
 *  7–9  : L-N of ebony; C of bone
 * 10–11 : L-N of ivory; C fashioned from a sabretooth
 * 12–13 : of gold
 * 14–15 : L-N of oak; C of wormwood
 */
function _determineHiltMake(state) {
  const bonus = _getMakeRollBonus(state);
  let roll = _rollDie(10) + bonus;
  if (roll < 1) roll = 1;
  if (roll > 15) roll = 15;

  const row = _lookupRangeTableByValue(HILT_MAKE_TABLE, roll);
  if (!row) return;

  if (row.hilt) {
    state.hiltMake = row.hilt;
    return;
  }

  // Alignment-sensitive entries.
  if (row.hiltLN || row.hiltC) {
    if (state.alignment === ALIGNMENT.CHAOTIC) {
      state.hiltMake = row.hiltC || row.hiltLN || null;
    } else {
      // Lawful & Neutral share LN results.
      state.hiltMake = row.hiltLN || row.hiltC || null;
    }
  }
}

/**
 * High-level Make function (8.1–8.3):
 * - Uses namingPrefixCategory to apply the correct roll bonus.
 * - Rolls blade make from 8.2.
 * - Rolls hilt make from 8.3.
 *
 * Resulting fields:
 * - state.bladeMake
 * - state.hiltMake
 *
 * These are then printed as:
 *   "Make: Blade of [bladeMake] in hilt [hiltMake]"
 */
function _determineMake(state) {
  _determineBladeMake(state);
  _determineHiltMake(state);
}


// -------------------------------------------------------------
// Step 4: Printers for the 11 output lines
// -------------------------------------------------------------

// Alignment display words
function _alignmentWord(alignment) {
  if (alignment === ALIGNMENT.LAWFUL) return "Lawful";
  if (alignment === ALIGNMENT.NEUTRAL) return "Neutral";
  if (alignment === ALIGNMENT.CHAOTIC) return "Chaotic";
  return "";
}

// ---------------------------
// 1) Name line
// ---------------------------

function _formatNameLine(state) {
  // Spec: print the determined name alone (in italics conceptually).
  // Examples: Blueblade, Fell-fang, Flame-edge, Wyrd-reaver.
  return state.finalName || "";
}

// ---------------------------
// 2) Bonus(es) line
// ---------------------------

function _formatBonusLine(state) {
  // Life-energy Draining: no numeric bonuses, just "[Fame] [Alignment] Life-energy Draining Sword"
  // +3 Chaotic Cursed: "+3, [Fame] Chaotic Cursed Sword"
  // Others: "+1, +2 vs. Fell, Famous Lawful Flaming Sword", etc.

  const alignmentWord = _alignmentWord(state.alignment);

  // Build numeric segments: "+X" or "+X vs. Target"
  let numericSegments = [];
  if (state.bonusSegments && state.bonusSegments.length > 0) {
    for (let i = 0; i < state.bonusSegments.length; i++) {
      const seg = state.bonusSegments[i];
      if (typeof seg.amount === "number" && seg.amount !== 0) {
        if (seg.vs) {
          numericSegments.push("+" + seg.amount + " vs. " + seg.vs);
        } else {
          numericSegments.push("+" + seg.amount);
        }
      }
    }
  }

  const numericText = numericSegments.join(", ");
  const fame = state.fameAdjective || null;
  const isLife = !!state.isLifeDraining;
  const isCursed = !!state.isPlus3Cursed;
  const isFlaming = !!state.isFlaming;
  const isLocate = !!state.isLocateObject;
  const isWishes = !!state.isWishes;
  const isCharm = !!state.isCharmPerson;

  let line = "";

  if (numericText) {
    // With numeric portion at the front.
    if (fame) {
      // "+1, +2 vs. Dragons, Famous Lawful Sword"
      line = numericText + ", " + fame + " " + alignmentWord;
    } else {
      // "+1, +2 vs. Fell, Chaotic Sword"
      line = numericText + ", " + alignmentWord;
    }
  } else {
    // No numeric portion (e.g. Life-energy Draining without numeric bonuses).
    if (fame) {
      line = fame + " " + alignmentWord;
    } else {
      line = alignmentWord;
    }
  }

  // Specials appended as adjectives.
  if (isLife) {
    line += " Life-energy Draining";
  }
  if (isCursed) {
    line += " Cursed";
  }
  if (isFlaming) {
    line += " Flaming";
  }
  if (isLocate) {
    line += " Locate Object";
  }
  if (isWishes) {
    line += " Wishes";
  }
  if (isCharm) {
    line += " Charm Person";
  }

  line += " Sword";

  return line;
}

// ---------------------------
// 3) Stats line
// ---------------------------

function _formatStatsLine(state) {
  // "INT [#]; [EGO [#] if any]; ST+[#]; Glows [color] 15’r."
  const parts = [];

  parts.push("INT " + (state.intScore != null ? state.intScore : 0));

  if (state.egoScore != null && state.egoScore !== undefined) {
    parts.push("EGO " + state.egoScore);
  }

  // ST+N
  const st = (state.stBonus != null ? state.stBonus : 0);
  parts.push("ST+" + st);

  // Glow color determined by alignment (1.6)
  const glow = state.glowColor || "";
  parts.push("Glows " + glow + " 15’r.");

  return parts.join("; ");
}

// From here on, lines are considered "indented conceptually", but since
// we are returning plain strings, we do not insert leading spaces.

// ---------------------------
// 4) Mission line (if any)
// ---------------------------

function _formatMissionLine(state) {
  if (!state.hasMission) return null;

  // Spec 3.1:
  // "Mission to slay [descriptor]: upon successful attack opponent saves against [effect]"
  // e.g. "Mission to slay chaotic Magic-users: upon successful attack opponent saves against paralysis"
  const targetDesc = state.missionOpposingAlignmentDescriptor || state.missionTarget || "";
  const effect = state.missionEffect || "";
  return "Mission to slay " + targetDesc + ": upon successful attack opponent saves against " + effect;
}

// ---------------------------
// 5) Communication line (if any)
// ---------------------------

function _formatCommunicationLine(state) {
  const hasTelepathy = !!state.hasTelepathy;
  const hasEmpathy = !!state.hasEmpathy;
  const canSpeak = !!state.canSpeak;
  const readsMagic = !!state.readsMagic;

  if (!hasTelepathy && !hasEmpathy && !canSpeak && !readsMagic) {
    return null;
  }

  const segments = [];

  // Telepathy first, then Empathy.
  if (hasTelepathy) {
    segments.push("Telepathy");
  }
  if (hasEmpathy) {
    segments.push("Empathy");
  }

  if (canSpeak && state.speaksLanguages && state.speaksLanguages.length > 0) {
    segments.push("Speaks: " + state.speaksLanguages.join(", "));
  }

  let line = "Communication: ";
  line += segments.join(", ");

  if (readsMagic) {
    line += "; Reads magic";
  }

  return line;
}

// ---------------------------
// 6) Extraordinary Ability line (if any)
// ---------------------------

function _formatExtraordinaryLine(state) {
  if (!state.extraordinaryAbilities || state.extraordinaryAbilities.length === 0) {
    return null;
  }

  // We want to print in order of "awesomeness."
  // We'll treat SPECIAL-type extraordinary abilities as highest
  // precedence, then order the rest by EXTRA_NAMING_RANK_BY_ID
  // (larger rank = more awesome), printing from most awesome to least.

  const specials = [];
  const normals = [];

  for (let i = 0; i < state.extraordinaryAbilities.length; i++) {
    const ex = state.extraordinaryAbilities[i];
    if (ex.type === "SPECIAL") {
      specials.push(ex);
    } else {
      normals.push(ex);
    }
  }

  // Assign ranks for normals based on EXTRA_NAMING_RANK_BY_ID.
  normals.sort(function (a, b) {
    const ra = EXTRA_NAMING_RANK_BY_ID[a.id] || 0;
    const rb = EXTRA_NAMING_RANK_BY_ID[b.id] || 0;
    // Descending: most awesome first
    return rb - ra;
  });

  // Specials come first (in the order they were added), then normals.
  const ordered = specials.concat(normals);

  const texts = [];
  for (let i = 0; i < ordered.length; i++) {
    texts.push(ordered[i].text);
  }

  return "Extraordinary: " + texts.join("; ");
}

// ---------------------------
// 7) Detect Ability line (if any)
// ---------------------------

const DETECT_LABEL_BY_ABILITY = {};
DETECT_LABEL_BY_ABILITY[DETECT_ABILITY.GEMS] = "Gems";
DETECT_LABEL_BY_ABILITY[DETECT_ABILITY.GOLD] = "Gold";
DETECT_LABEL_BY_ABILITY[DETECT_ABILITY.METAL_AND_KIND] = "Metal & kind";
DETECT_LABEL_BY_ABILITY[DETECT_ABILITY.SHIFTING_SLOPING] = "Shifting & sloping walls, rooms, and floors";
DETECT_LABEL_BY_ABILITY[DETECT_ABILITY.MAGIC] = "Magic";
DETECT_LABEL_BY_ABILITY[DETECT_ABILITY.EVIL] = "Evil";
DETECT_LABEL_BY_ABILITY[DETECT_ABILITY.INVISIBLE] = "Invisible";
DETECT_LABEL_BY_ABILITY[DETECT_ABILITY.SECRET_DOORS] = "Secret doors";
DETECT_LABEL_BY_ABILITY[DETECT_ABILITY.TRAPS] = "Traps";

function _formatDetectLine(state) {
  if (!state.detectAbilities || state.detectAbilities.length === 0) {
    return null;
  }

  // Order from most awesome to least awesome, per your correction:
  // table goes least→most down the rows; for printing we reverse: most→least.
  const abilities = state.detectAbilities.slice();
  abilities.sort(function (a, b) {
    const ra = DETECT_NAMING_RANK[a] || 0;
    const rb = DETECT_NAMING_RANK[b] || 0;
    return rb - ra; // descending
  });

  const labels = [];
  for (let i = 0; i < abilities.length; i++) {
    const label = DETECT_LABEL_BY_ABILITY[abilities[i]];
    if (label) {
      labels.push(label);
    }
  }

  if (labels.length === 0) {
    return null;
  }

  return "Detects: " + labels.join(", ");
}

// ---------------------------
// 8) Egotistical effect line (if any)
// ---------------------------

function _formatEgotisticalEffectLine(state) {
  if (!state.egotisticalEffectText) return null;
  // Example: "Boast: when drawn chorus of incorporeal voices joyfully sing praises of the blade (Check: morale)"
  return "Boast: " + state.egotisticalEffectText;
}

// ---------------------------
// 9) Make line
// ---------------------------

function _formatMakeLine(state) {
  // "Make: Blade of [blade type] in hilt [hilt type]"
  const blade = state.bladeMake || "steel";
  const hilt = state.hiltMake || "inlaid with semi-precious stones";
  return "Make: Blade of " + blade + " in hilt " + hilt;
}

// ---------------------------
// 10) Inscription line
// ---------------------------

function _formatInscriptionLine(state) {
  // All swords have an inscription of some kind.
  // Patterns:
  // - "Name: inscribed in [language]"
  // - "Name: inscribed in Cypher (original language: [language])"
  // - "Name: lost to time (original language: [language])"
  // - "Name: contingent upon fulfillment of geas (original language: [language])"

  const type = state.inscriptionType;
  const lang = state.inscriptionLanguage;
  const original = state.inscriptionOriginalLanguage;

  if (type === INSCRIPTION_TYPE.CYPHER) {
    return "Name: inscribed in Cypher (original language: " + (original || "Unknown") + ")";
  }

  if (type === INSCRIPTION_TYPE.LOST) {
    return "Name: lost to time (original language: " + (original || "Unknown") + ")";
  }

  if (type === INSCRIPTION_TYPE.CONDITIONAL) {
    // We know from the spec that Conditional always draws from randomGeas()
    // for the Condition line; here we only mention "fulfillment of geas".
    return "Name: contingent upon fulfillment of geas (original language: " + (original || "Unknown") + ")";
  }

  // For Ancient, Fay, Cosmic, etc., we have a direct language.
  // Example: "Name: inscribed in Elven"
  return "Name: inscribed in " + (lang || "Unknown");
}

// ---------------------------
// 11) Condition line (if any)
// ---------------------------

function _formatConditionLine(state) {
  const hasCurse = !!state.hasCurseCondition && !!state.curseText;
  const hasGeas = !!state.hasGeasCondition && !!state.geasText;

  if (!hasCurse && !hasGeas) {
    return null;
  }

  let parts = [];

  if (hasCurse) {
    // "Condition: Each time target declared character saves or suffers [randomCurse()]"
    parts.push("Each time target declared character saves or suffers " + state.curseText);
  }

  if (hasGeas) {
    // "Condition: name delivered if character will [randomGeas()]"
    parts.push("name delivered if character will " + state.geasText);
  }

  return "Condition: " + parts.join("; ");
}

// ---------------------------
// Full sword formatter
// ---------------------------

/**
 * Format a fully generated SwordState into the canonical
 * 11-line (with optional lines skipped) multi-line string.
 */
function _formatSword(state) {
  const lines = [];

  // 1. Name
  lines.push(_formatNameLine(state));

  // 2. Bonuses
  lines.push(_formatBonusLine(state));

  // 3. Stats
  lines.push(_formatStatsLine(state));

  // 4. Mission (if any)
  const missionLine = _formatMissionLine(state);
  if (missionLine) lines.push(missionLine);

  // 5. Communication (if any)
  const commLine = _formatCommunicationLine(state);
  if (commLine) lines.push(commLine);

  // 6. Extraordinary (if any)
  const extrLine = _formatExtraordinaryLine(state);
  if (extrLine) lines.push(extrLine);

  // 7. Detect (if any)
  const detectLine = _formatDetectLine(state);
  if (detectLine) lines.push(detectLine);

  // 8. Egotistical effect (if any)
  const egoLine = _formatEgotisticalEffectLine(state);
  if (egoLine) lines.push(egoLine);

  // 9. Make
  lines.push(_formatMakeLine(state));

  // 10. Inscription
  lines.push(_formatInscriptionLine(state));

  // 11. Condition (if any)
  const condLine = _formatConditionLine(state);
  if (condLine) lines.push(condLine);

  return lines.join("\n");
}

// -------------------------------------------------------------
// Core generator bridge – generate state, then format
// -------------------------------------------------------------

function _generateSword(options) {
  // options reserved for future use (alignment-specific, etc.)
  var state = _createEmptySwordState();

  // 1) Alignment, bonuses, specials, targets (2.x, 1.1, 2.5)
  _determineBonusesAndSpecialsRandom(state);

  // 2) Mission (3.1–3.5) – 1-in-10 chance, must happen before INT/EGO.
  _maybeAssignMission(state);

  // 3) INT (4.1) – depends on mission, specials, and targets.
  _determineIntScore(state);

  // 4) Detect + Extraordinary (4.2, 4.8–4.16) – includes special-derived
  //    Extraordinary abilities.
  _determineDetectAndExtraordinary(state);

  // 5) EGO, Fame, Egotistical effect (7.1–7.3).
  _determineEgoFameAndEffect(state);

  // 6) Inscription (1.7–1.9).
  _determineInscription(state);

  // 7) Communication + spoken languages (4.3–4.7).
  _determineCommunicationAndLanguages(state);

  // 8) Conditions (11) – curse/geas.
  _determineConditions(state);

  // 9) Saving Throw (6.1–6.2).
  _determineSavingThrowBonus(state);

  // 10) Name (prefix, suffix, euphony).
  _determineSwordName(state);

  // 11) Make (blade + hilt, 8.1–8.3).
  _determineMake(state);

  return state;
}

/**
 * Helper: generate a sword with an optional predicate constraint.
 * If predicate is provided, we re-roll up to maxAttempts until
 * we find a sword that satisfies predicate(state).
 */
function _generateSwordFiltered(options, predicate, maxAttempts) {
  var attempts = maxAttempts || 100;
  var lastState = null;

  for (var i = 0; i < attempts; i++) {
    var state = _generateSword(options || {});
    lastState = state;
    if (!predicate || predicate(state)) {
      return state;
    }
  }

  // Fallback: if we somehow didn't match after many attempts,
  // return the last generated sword rather than failing.
  return lastState || _generateSword(options || {});
}

/**
 * Helper: generate and format a sword in one step.
 */
function _generateAndFormatSword(options, predicate) {
  var state = _generateSwordFiltered(options, predicate, 200);
  return _formatSword(state);
}

// -------------------------------------------------------------
// Public Exports — Short-name style
// -------------------------------------------------------------

// Return a fully random magic sword (no relic override).
function magicSword() {
  return _generateAndFormatSword({}, null);
}

// 1-in-5 chance to return a relic instead.
function swordOrRelic() {
  if (typeof randomRelic === "function") {
    var roll = _rollDie(5);
    if (roll === 1) {
      return randomRelic();
    }
  }
  return magicSword();
}

// -------------------------------------------------------------
// Alignment-specific
// -------------------------------------------------------------

function lawfulSword() {
  return _generateAndFormatSword({}, function (state) {
    return state.alignment === ALIGNMENT.LAWFUL;
  });
}

function neutralSword() {
  return _generateAndFormatSword({}, function (state) {
    return state.alignment === ALIGNMENT.NEUTRAL;
  });
}

function chaoticSword() {
  return _generateAndFormatSword({}, function (state) {
    return state.alignment === ALIGNMENT.CHAOTIC;
  });
}

// -------------------------------------------------------------
// Bonus-specific
// -------------------------------------------------------------

// -------------------------------------------------------------
// Bonus-specific (TEMPORARY STUBS)
// -------------------------------------------------------------
//
// NOTE (design TODO):
// These are *not yet* true +1/+2/+3 base-bonus generators.
// In the canonical spec, they must:
//   - Force the base bonus result in the alignment tables (2.1, 2.3, 2.7),
//   - Then run the full pipeline (specials, targets, mission, INT/EGO,
//     detect/extraordinary, ST, Make, naming, inscriptions, conditions).
//
// Current behavior: simple aliases to magicSword(). Do NOT wire these
// to GUI buttons yet. They exist only to avoid reference errors.

function plus1Sword() {
  return _generateAndFormatSword({}, function (state) {
    return _getMaxNumericBonus(state) === 1;
  });
}

function plus2Sword() {
  return _generateAndFormatSword({}, function (state) {
    return _getMaxNumericBonus(state) === 2;
  });
}

function plus3Sword() {
  return _generateAndFormatSword({}, function (state) {
    return _getMaxNumericBonus(state) === 3;
  });
}

// -------------------------------------------------------------
// Special-type
// -------------------------------------------------------------

function lifeDrainingSword() {
  return _generateAndFormatSword({}, function (state) {
    return !!state.isLifeDraining;
  });
}

function cursedSword() {
  return _generateAndFormatSword({}, function (state) {
    return !!state.isPlus3Cursed;
  });
}

function flamingSword() {
  return _generateAndFormatSword({}, function (state) {
    return !!state.isFlaming;
  });
}

function locateObjectSword() {
  return _generateAndFormatSword({}, function (state) {
    return !!state.isLocateObject;
  });
}

function wishesSword() {
  return _generateAndFormatSword({}, function (state) {
    return !!state.isWishes;
  });
}

function charmPersonSword() {
  return _generateAndFormatSword({}, function (state) {
    return !!state.isCharmPerson;
  });
}

function missionSword() {
  return _generateAndFormatSword({}, function (state) {
    return !!state.hasMission;
  });
}



// -------------------------------------------------------------
// Console Smoke Tests (developer notes only)
// -------------------------------------------------------------
//
// In Safari/Chrome console, after page load:
//
//   magicSword()
//   swordOrRelic()
//
// Alignment-specific:
//   magicSwordLawful()
//   magicSwordNeutral()
//   magicSwordChaotic()
//
// Bonus-specific (currently using max numeric bonus classification):
//   magicSwordPlus1()
//   magicSwordPlus2()
//   magicSwordPlus3()
//
// Special / table-specific:
//   magicSwordLifeDrain()
//   magicSwordCursed()
//   magicSwordFlaming()
//   magicSwordLocateObject()
//   magicSwordWishes()
//   magicSwordCharmPerson()
//   magicSwordWithMission()
//
// Example usage:
//   console.log(magicSword());
//   console.log(swordOrRelic());
//
// Reminder:
//   Output may look compressed in console; the in-browser output log
//   (using output.appendLine()) will show proper line breaks.
// -------------------------------------------------------------
