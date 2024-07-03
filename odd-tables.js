/*
 * This is free and unencumbered software released into the public domain.
 * 
 * Anyone is free to copy, modify, publish, use, compile, sell, or
 * distribute this software, either in source code form or as a compiled
 * binary, for any purpose, commercial or non-commercial, and by any
 * means.
 * 
 * In jurisdictions that recognize copyright laws, the author or authors
 * of this software dedicate any and all copyright interest in the
 * software to the public domain. We make this dedication for the benefit
 * of the public at large and to the detriment of our heirs and
 * successors. We intend this dedication to be an overt act of
 * relinquishment in perpetuity of all present and future rights to this
 * software under copyright law.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
 * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * 
 * For more information, please refer to <http://unlicense.org/>
 */
 
'use strict';

/* global dice, oddMonsters, oddNames */

/* Declare object */
var oddTables = {
	'version': '0.1',
};

var oddPrefs = {
	'version': '0.1',

	'suppressNames':false,			//Don't give names for characters/castles/swords
	'useGenderedTitles':false,		//Use titles like "Swordswoman" for female characters

	'rerollEmptyTreasure':false,	//If a treasure table generates no treasure, start over
	'correctDetectMeal':false,		//Change sword power from "Detect Meal and what kind" to "Detect Metal and what kind",

	'allowNeutralClerics':false,	//Allow clerics of any level to be neutral
	'allowClericCastles':true,		//Include clerics in generated castle encounters
	'rawClericItems':false,			
	'forceSwordAlignment':false,	//Swords that are created as part of a leveled character's equipment will match their alignment
	'forceNpcAlignment':false,		//NPCs that are created as leaders of an encounter will match the alignment of that creature

	'greyDexAC':false,				//Give a bonus/malus to Armor class based on the Supplement I: Greyhawk tables
	'greyItems':false,				//Include magic Items from Supplement I
	'greySpellbooks':false,			//Generate spellbooks for NPCs per Supplement I
	'greySpells':false,				//Include spells from Supplement I in scrolls and spellbooks
	'greyMonsters':false,			//Include monsters from Supplement I in encounter tables

	'deltaThiefCastles':false,		//Include theives in generated castle encounters per Delta's table
	'deltaDungeonEncounters':false, //Use Delta's alternative dungeon encounter table
	'deltaFighterAbilities':false,	//Give created fighters abilities according to Delta's OED appendix
};

/* Preferences Object
toggle for whether high level clerics may be neutral
toggle for dexterity modifier applying to armor class
toggle for boosting ability scores for higher-level characters
toggle for adding Delta's feats to fighters

toggle for including Greyhawk spells
toggle for including Greyhawk magic items
toggle for including Greyhawk monsters

toggle for including Delta's thief castles in castle generator
	toggle for removing cleric castles in castle generator

toggle for including theives in encounter tables
toggle for including clerics in encounter tables
toggle for generating NPC cleric items strictly RAW or the slightly more generous current version.
toggle for forcing NPC sword alignment to match the NPC's alignment.
toggle for forcing NPC alignment to match encounter base monster type alignment.

*/

/* Misc. Convenience Functions */
oddTables.indentLines = function (text) {
	var i, strings, output = "";
	strings = text.split("\n");
	for (i = 0; i < strings.length; i++) {
		output = "\t" + strings[i] + "\n";
	}
	return output;
};

oddTables.rtrim = function (text) {
    return text.replace(/\s+$/g, '');
};

oddTables.ltrim = function (text) {
	return text.replace(/^\s+/g, '');
};


/* static tables */
// function ClassTableRow(mname, mplural, fname, fplural, xp) {
// 	this.mname = mname;
// 	this.mplural = mplural;
// 	this.fname = fname;
// 	this.fplural = fplural;
// 	this.xp = xp;
// };

// var oddClassTable = {
// 	'version': '0.1',
// 	fighter: [
// 		new ClassTableRow("man","men","woman","women",-1),
// 		new ClassTableRow("Veteran","Veterans","Veteran","Veterans",0),
// 		new ClassTableRow("Warrior","Warriors","Warrior","Warriors",2000),
// 		new ClassTableRow("Swordsman","Swordsmen","Swordswoman","Swordswomen",4000),
// 		new ClassTableRow("Hero","Heroes","Heroine","Heroines",8000),
// 		new ClassTableRow("Swashbuckler","Swashbucklers","Swashbuckler","Swashbucklers",16000),
// 		new ClassTableRow("Myrmidon","Myrmidons","Myrmidon","Myrmidons",32000),
// 		new ClassTableRow("Champion","Champions","Champion","Champions",64000),
// 		new ClassTableRow("Superhero","Superheroes","Superheroine","Superheroines",120000),
// 		new ClassTableRow("Lord","Lords","Lady","Ladies",240000)
// 	],
// 	magicuser: [
// 		new ClassTableRow("apprentice","apprentices","aprentice","aprentices",-1),
// 		new ClassTableRow("Medium","Mediums","Medium","Mediums",0),
// 		new ClassTableRow("Seer","Seers","Seeress","Seeresses",2500),
// 		new ClassTableRow("Conjurer","Conjurers","Conjuress","Conjuresses",5000),
// 		new ClassTableRow("Theurgist","Theurgists","Theurgist","Theurgists",10000),
// 		new ClassTableRow("Thaumaturgist","Thaumaturgists","Thaumaturgist","Thaumaturgists",20000),
// 		new ClassTableRow("Magician","Magicians","Magician","Magicians",35000),
// 		new ClassTableRow("Enchanter","Enchanters","Enchantress","Enchantress",50000),
// 		new ClassTableRow("Warlock","Warlocks","Witch","Witches",75000),
// 		new ClassTableRow("Sorcerer","Sorcerers","Sorceress","Sorceresses",100000),
// 		new ClassTableRow("Necromancer","Necromancers","Necromancer","Necromancers",200000),
// 		new ClassTableRow("Wizard","Wizards","Wizardess","Wizardess",300000)
// 	],
// 	cleric: [ //deacon, subdeacon, acolyte, exorcist, lector, porter
// 		new ClassTableRow("layman","laymen","laywoman","laywomen",-1),
// 		new ClassTableRow("Acolyte","Acolytes","Acolyte","Acolytes",0),
// 		new ClassTableRow("Adept","Adepts","Adept","Adepts",1500),
// 		new ClassTableRow("Priest","Priests","Priestess","Priestesses",3000),
// 		new ClassTableRow("Vicar","Vicars","Vicar","Vicar",6000),
// 		new ClassTableRow("Curate","Curates","Curate","Curates",12000),
// 		new ClassTableRow("Bishop","Bishops","Bishop","Bishops",25000),
// 		new ClassTableRow("Lama","Lamas","Lama","Lama",50000),
// 		new ClassTableRow("Patriarch","Patriarchs","Matriarch","Matriarchs",100000)
// 	],
// 	anticleric [
// 		new ClassTableRow("layman","laymen","laywoman","laywomen",-1),
// 		new ClassTableRow("Evil Acolyte","Evil Acolytes","Evil Acolyte","Evil Acolytes",0),
// 		new ClassTableRow("Evil Adept","Evil Adepts","Evil Adept","Evil Adepts",1500),
// 		new ClassTableRow("Evil Priest","Evil Priests","Evil Priestess","Evil Priestesses",3000),
// 		new ClassTableRow("Shaman","Shamans","Shamaness","Shamanesses",6000),
// 		new ClassTableRow("Evil Curate","Evil Curates","Evil Curate","Evil Curates",12000),
// 		new ClassTableRow("Evil Bishop","Evil Bishops","Evil Bishop","Evil Bishops",25000),
// 		new ClassTableRow("Evil Lama","Evil Lamas","Evil Lama","Evil Lama",50000),
// 		new ClassTableRow("Evil High Priest","Evil High Priests","Evil High Priestess","Evil High Priestesses",100000)
// 	],
// 	thief [
// 		new ClassTableRow("man","men","woman","women",-1),
// 		new ClassTableRow("Apprentice","Apprentices","Apprentice","Apprentices",0),
// 		new ClassTableRow("Footpad","Footpads","Footpad","Footpads",1200),
// 		new ClassTableRow("Robber","Robbers","Robber","Robbers",2400),
// 		new ClassTableRow("Burglar","Burglars","Burglar","Burglars",4800),
// 		new ClassTableRow("Cutpurse","Cutpurses","Cutpurse","Cutpurses",9600),
// 		new ClassTableRow("Sharper","Sharpers","Sharper","Sharpers",20000),
// 		new ClassTableRow("Pilferer","Pilferers","Pilferer","Pilferers",40000),
// 		new ClassTableRow("Master Pilferer","Master Pilferers","Master Pilferer","Master Pilferers",60000),
// 		new ClassTableRow("Thief","Theives","Thief","Thieves",90000),
// 		new ClassTableRow("Master Thief","Master Theives","Master Thief","Master Thieves",125000)
// 	],
// };


// function Equipment (name, price, weight) {
// 	this.name = name;
// 	this.price = price;
// 	this.weight = weight;
// };

// Equipment.prototype.tableRow = function () {
// 	return "<tr><td>"+this.name+"</td><td>"+this.price+"</td><td>"+this.weight+"</td></tr>";
// };

// var oddEquipment = {
// 	'version': '0.1',
// };
// oddEquipment.dagger = new Equipment("dagger",3,20);
// oddEquipment.handAxe = new Equipment("handAxe",3,50);
// oddEquipment.mace = new Equipment("mace",5,50);
// oddEquipment.sword = new Equipment("sword",10,50);
// oddEquipment.battleAxe = new Equipment("battle axe",7,100);
// oddEquipment.morningStar = new Equipment("morning star",6,100);
// oddEquipment.flail = new Equipment("flail",8,100);
// oddEquipment.spear = new Equipment("spear",1,100);
// oddEquipment.poleArm = new Equipment("pole arm",7,150);
// oddEquipment.harberd = new Equipment("halberd",7,150);
// oddEquipment.twoHandedSword = new Equipment("two-handed sword",15,150);
// oddEquipment.lance = new Equipment("lance",4,150);
// oddEquipment.pike = new Equipment("pike",5,150);
// oddEquipment.shortBow = new Equipment("short bow",25,50);
// oddEquipment.longBow = new Equipment("long bow",40,50);
// oddEquipment.compositeBow = new Equipment("composite bow",50,50);
// oddEquipment.lightCrossbow = new Equipment("light crossbow",15,100);
// oddEquipment.heavyCrossbow = new Equipment("heavy crossbow",25,100);
// oddEquipment.quiver = new Equipment("quiver of 20 arrows",10,50);
// oddEquipment.case = new Equipment("case of 30 quarrels",10,50);
// oddEquipment.arrows = new Equipment("20 arrows/30 quarrels",5,50);
// oddEquipment.silverArrow = new Equipment("silver tipped arrow",5,0);

// oddEquipment.leatherArmor = new Equipment("leather armor",15,250);
// oddEquipment.chainArmor = new Equipment("chain-mail armor",30,500);
// oddEquipment.plateArmor = new Equipment("plate armor",50,750);
// oddEquipment.helmet = new Equipment("helmet",10,50);
// oddEquipment.shield = new Equipment("shield",10,150);

// oddEquipment.rope = new Equipment("50' of rope",1,0);
// oddEquipment.pole = new Equipment("10' pole",1,0);
// oddEquipment.spikes = new Equipment("12 iron spikes",1,0);
// oddEquipment.smallSack = new Equipment("small sack",1,0);
// oddEquipment.largeSack = new Equipment("large sack",2,0);
// oddEquipment.waterSkin = new Equipment("water/wine skin",1,0);
// oddEquipment.torches = new Equipment("6 torches",1,0);
// oddEquipment.lantern = new Equipment("lantern",10,0);
// oddEquipment.oil = new Equipment("flask of oil",2,0);
// oddEquipment.stakes = new Equipment("3 stakes and mallet",3,0);
// oddEquipment.steelMirror = new Equipment("steel mirror",5,0);
// oddEquipment.silverMirror = new Equipment("silver mirror, small",15,0);
// oddEquipment.woodCross = new Equipment("wooden cross",2,0);
// oddEquipment.silverCross = new Equipment("silver cross",25,0);
// oddEquipment.holyWater = new Equipment("holy water vial",25,0);
// oddEquipment.wolvesbane = new Equipment("wolvesbane, bunch",10,0);
// oddEquipment.belladona = new Equipment("belladona, bunch",10,0);
// oddEquipment.garlic = new Equipment("garlic, bud",5,0);
// oddEquipment.wine = new Equipment("wine, quart",1,0);
// oddEquipment.ironRations = new Equipment("iron rations, 1 person/week",15,0);
// oddEquipment.standardRations = new Equipment("standard rations, 1 person/week",5,0);

// oddEquipment.mule = new Equipment("mule",20,0);
// oddEquipment.draftHorse = new Equipment("draft horse",30,0);
// oddEquipment.lightHorse = new Equipment("light horse",40,0);
// oddEquipment.mediumHorse = new Equipment("medium warhorse",100,0);
// oddEquipment.heavyHorse = new Equipment("heavy warhorse",200,0);
// oddEquipment.saddle = new Equipment("saddle",25,0);
// oddEquipment.saddleBags = new Equipment("saddle bags",10,0);
// oddEquipment.cart = new Equipment("cart",100,0);
// oddEquipment.wagon = new Equipment("wagon",200,0);
// oddEquipment.raft = new Equipment("raft",40,0);
// oddEquipment.smallBoat = new Equipment("small boat",100,0);
// oddEquipment.smallShip = new Equipment("small merchant ship",5000,0);
// oddEquipment.largeShip = new Equipment("large merchant ship",20000,0);
// oddEquipment.smallGalley = new Equipment("small galley",10000,0);
// oddEquipment.largeGalley = new Equipment("large galley",30000,0);


/* general utility tables */
oddTables.characterStats = function () {
	var output = "";
	output += "S:" + dice.d6(3) + " \t";
	output += "I:" + dice.d6(3) + " \t";
	output += "W:" + dice.d6(3) + " \t";
	output += "C:" + dice.d6(3) + " \t";
	output += "D:" + dice.d6(3) + " \t";
	output += "X:" + dice.d6(3) + " \t";
	output += "G:" + (dice.d6(3) * 10) + " \t";
	output += "HP:" + dice.d6(1);
	return output;
};

oddTables.reaction = function (modifier) {
	var roll = dice.d6(2);
	roll += (typeof modifier === "number") ? modifier : 0;
	if (roll <= 2) {
		return "Reaction Roll (" + roll + "): Attempts to attack";
	} else if (roll <= 5) {
		return "Reaction Roll (" + roll + "): Hostile reation";
	} else if (roll <= 8) {
		return "Reaction Roll (" + roll + "): Uncertain";
	} else if (roll <= 11) {
		return "Reaction Roll (" + roll + "): Accepts offer";
	} else {
		return "Reaction Roll (" + roll + "): Enthusiast, Loyalty +3";
	}
};

oddTables.loyalty = function (modifier) {
	var roll = dice.d6(2);
	roll += (typeof modifier === "number") ? modifier : 0;
	if (roll <= 3) {
		return "Loyalty (" + roll + "): Will desert at first opportunity";
	} else if (roll <= 6) {
		return "Loyalty (" + roll + "): -2 on morale dice";
	} else if (roll <= 8) {
		return "Loyalty (" + roll + "): -1 on morale dice";
	} else if (roll <= 12) {
		return "Loyalty (" + roll + "): Average morale dice";
	} else if (roll <= 14) {
		return "Loyalty (" + roll + "): +1 on morale dice";
	} else if (roll <= 18) {
		return "Loyalty (" + roll + "): +2 on morale dice";
	} else {
		return "Loyalty (" + roll + "): Need never check morale";
	}
};

/* spell tables */

oddTables.spellsMu1 = ["Detect Magic", "Hold Portal", "Read Magic", 
		"Read Languages", "Protection/Evil", "Light", "Charm Person", 
		"Sleep"];

oddTables.spellsMu2 = ["Detect Invisible", "Levitate", "Phantasmal Forces", 
		"Locate Object", "Invisibility", "Wizard Lock", "Detect Evil", "ESP", 
		"Continual Light", "Knock"];

oddTables.spellsMu3 = ["Fly", "Hold Person", "Dispel Magic", "Clairvoyance", 
		"Clairaudience", "Fire Ball", "Lightning Bolt", 
		"Protection/Evil, 10' r.", "Invisibility, 10' r.", "Infravision", 
		"Slow Spell", "Haste Spell", "Protection/Normal Missiles", 
		"Water Breathing"];

oddTables.spellsMu4 = ["Polymorph Self", "Polymorph Others", "Remove Curse", 
		"Wall of Fire", "Wall of Ice", "Confusion", "Charm Monster", 
		"Growth/Plant", "Dimension Door", "Wizard Eye", "Massmorph", 
		"Hallucinatory Terrain"];

oddTables.spellsMu5 = ["Teleport", "Hold Monster", "Conjure Elemental", 
		"Telekenesis", "Transmute Rock-Mud", "Wall of Stone", "Wall of Iron", 
		"Animate Dead", "Magic Jar", "Contact Higher Plane", "Pass-Wall", 
		"Cloudkill", "Feeblemind", "Growth/Animal"];

oddTables.spellsMu6 = ["Stone-Flesh", "Reincarnation", "Invisible Stalker", 
		"Lower Water", "Part Water", "Projected Image", "Anti-Magic Shell", 
		"Death Spell", "Geas", "Disintegrate", "Move Earth", 
		"Control Weather"];

oddTables.spellMuAny = function () {
	switch (dice.d6()) {
		case 1: return dice.pick(oddTables.spellsMu1);
		case 2: return dice.pick(oddTables.spellsMu2);
		case 3: return dice.pick(oddTables.spellsMu3);
		case 4: return dice.pick(oddTables.spellsMu4);
		case 5: return dice.pick(oddTables.spellsMu5);
		default: return dice.pick(oddTables.spellsMu6);
	}
};

oddTables.spellsClr1 = ["Cure Light Wounds", "Purify Food & Water", 
		"Detect Magic", "Detect Evil", "Protection/Evil", "Light"];

oddTables.spellsClr2 = ["Find Traps", "Hold Person", "Bless", 
		"Speak with Animals"];

oddTables.spellsClr3 = ["Remove Curse", "Cure Disease", "Locate Object", 
		"Continual Light"];

oddTables.spellsClr4 = ["Neutralize Poison", "Cure Serious Wounds", 
		"Protection/Evil, 10'r.", "Turn sticks to snakes", 
		"Speak with plants", "Create Water"];

oddTables.spellsClr5 = ["Dispell Evil", "Raise Dead", "Commune", "Quest", 
		"Insect Plague", "Create Food"];

oddTables.spellClrAny = function () {
	switch (dice.d5()) {
		case 1: return dice.pick(oddTables.spellsClr1);
		case 2: return dice.pick(oddTables.spellsClr2);
		case 3: return dice.pick(oddTables.spellsClr3);
		case 4: return dice.pick(oddTables.spellsClr4);
		default: return dice.pick(oddTables.spellsClr5);
	}
};

oddTables.spellsEvil1 = ["Inflict Light Wounds", "Putrify Food & Water", 
		"Detect Magic", "Detect Holy", "Protection/Holy", "Darkness"];

oddTables.spellsEvil2 = ["Find Traps", "Hold Person", "Curse", 
		"Speak with Animals"];

oddTables.spellsEvil3 = ["Remove Curse", "Inflict Disease", "Locate Object", 
		"Continual Darkness"];

oddTables.spellsEvil4 = ["Neutralize Poison", "Inflict Serious Wounds", 
		"Protection/Holy, 10'r.", "Turn sticks to snakes", 
		"Speak with plants", "Create Water"];

oddTables.spellsEvil5 = ["Dispell Holy", "Finger of Death", "Commune", "Quest", 
		"Insect Plague", "Create Food"];

oddTables.spellEvilAny = function () {
	switch (dice.d5()) {
		case 1: return dice.pick(oddTables.spellsEvil1);
		case 2: return dice.pick(oddTables.spellsEvil2);
		case 3: return dice.pick(oddTables.spellsEvil3);
		case 4: return dice.pick(oddTables.spellsEvil4);
		default: return dice.pick(oddTables.spellsEvil5);
	}
};

oddTables.spellAny = function () {
	if (dice.in6(2)) {
		return oddTables.spellClrAny();
	}
	return oddTables.spellMuAny();
};

oddTables.spellBookMu = function (level, numSpells) {
	var spell, spells = [], spellArray;
	switch (level) {
		case 6: spellArray = oddTables.spellsMu6; break;
		case 5: spellArray = oddTables.spellsMu5; break;
		case 4: spellArray = oddTables.spellsMu4; break;
		case 3: spellArray = oddTables.spellsMu3; break;
		case 2: spellArray = oddTables.spellsMu2; break;
		default: spellArray = oddTables.spellsMu1; break;
	}
	while (spells.length < numSpells && spells.length < spellArray.length) {
		spell = dice.pick(spellArray);
		while (spells.indexOf(spell) !== -1) {
			spell = dice.pick(spellArray);
		}
		spells.push(spell);
	}
	spells = spells.sort();
	return spells;
};

oddTables.spellBookClr = function (level, numSpells) {
	var spell, spells = [], spellArray;
	switch (level) {
		case 5: spellArray = oddTables.spellsClr5; break;
		case 4: spellArray = oddTables.spellsClr4; break;
		case 3: spellArray = oddTables.spellsClr3; break;
		case 2: spellArray = oddTables.spellsClr2; break;
		default: spellArray = oddTables.spellsClr1; break;
	}
	while (spells.length < numSpells && spells.length < spellArray.length) {
		spell = dice.pick(spellArray);
		while (spells.indexOf(spell) !== -1) {
			spell = dice.pick(spellArray);
		}
		spells.push(spell);
	}
	spells = spells.sort();
	return spells;
};

oddTables.spellBookEvil = function (level, numSpells) {
	var spell, spells = [], spellArray;
	switch (level) {
		case 5: spellArray = oddTables.spellsEvil5; break;
		case 4: spellArray = oddTables.spellsEvil4; break;
		case 3: spellArray = oddTables.spellsEvil3; break;
		case 2: spellArray = oddTables.spellsEvil2; break;
		default: spellArray = oddTables.spellsEvil1; break;
	}
	while (spells.length < numSpells && spells.length < spellArray.length) {
		spell = dice.pick(spellArray);
		while (spells.indexOf(spell) !== -1) {
			spell = dice.pick(spellArray);
		}
		spells.push(spell);
	}
	spells = spells.sort();
	return spells;
};

// magic item tables
oddTables.basicLawfulSword = function () {
	var roll = dice.d100(1);
	if (roll <= 35) {
		return "Sword +1";
	} else if (roll <= 40) {
		return "Sword +1, +2 vs Lycanthropes";
	} else if (roll <= 45) {
		return "Sword +1, +2 vs. Magic-Users and Enchanted Monsters";
	} else if (roll <= 50) {
		return "Sword +1, Locating Objects Ability";
	} else if (roll <= 60) {
		return "Sword +1 , +3 vs. Trolls";
	} else if (roll <= 65) {
		return "Sword, Flaming: +1, +2 vs. Trolls, +3 vs. Undead";
	} else if (roll <= 70) {
		return "Sword +1, Wishes Included (" + dice.d4(2) + ")";
	} else if (roll <= 75) {
		return "Sword +1, +3 vs. Dragons";
	} else if (roll <= 78) {
		return "Sword +2";
	} else if (roll <= 80) {
		return "Sword +2, Charm Person Ability";
	} else if (roll <= 82) {
		return "Sword +3";
	} else if (roll <= 83) {
		return "Sword, One Life Energy Draining Ability";
	} else {
		return "Sword -2 (Cursed Sword)";
	}
};

oddTables.basicChaoticSword = function () {
	var roll = dice.d100(1);
	if (roll <= 35) {
		return "Sword +1";
	} else if (roll <= 40) {
		return "Sword +1, +2 vs Lycanthropes";
	} else if (roll <= 45) {
		return "Sword +1, +2 vs. Magic-Users and Enchanted Monsters";
	} else if (roll <= 50) {
		return "Sword +1, Locating Objects Ability";
	} else if (roll <= 60) {
		return "Sword +1 , +3 vs. Clerics";
	} else if (roll <= 65) {
		return "Sword, Flaming: +1, +2 vs. Pegasi, Hippogriffs, Rocs, +3 vs. Treants";
	} else if (roll <= 70) {
		return "Sword +1, Wishes Included (" + dice.d4(2) + ")";
	} else if (roll <= 75) {
		return "Sword +1, +3 vs. Dragons";
	} else if (roll <= 78) {
		return "Sword +2";
	} else if (roll <= 80) {
		return "Sword +2, Charm Person Ability";
	} else if (roll <= 82) {
		return "Sword +3";
	} else if (roll <= 83) {
		return "Sword, One Life Energy Draining Ability";
	} else {
		return "Sword -2 (Cursed Sword)";
	}
};

oddTables.magicSwordExtraordinaryAbilities = function (roll) {
	if (roll <= 10) {
		return "Clairaudience";
	} else if (roll <= 20) {
		return "Clairvoyance";
	} else if (roll <= 30) {
		return "ESP";
	} else if (roll <= 40) {
		return "Telepathy";
	} else if (roll <= 50) {
		return "Telekenesis";
	} else if (roll <= 59) {
		return "Teleportation";
	} else if (roll <= 68) {
		return "X-Ray Vision";
	} else if (roll <= 77) {
		return "Illusion Generation";
	} else if (roll <= 82) {
		return "Levitation";
	} else if (roll <= 87) {
		return "Flying";
	} else if (roll <= 92) {
		return "Healing";
	} else if (roll <= 97) {
		return "1-4 Times Normal Strength for 1-10 Turns Employable Once/Day";
	} else {
		throw "Invalid roll for magicSwordExtraordinaryAbilities";
	}
};

oddTables.magicSwordPrimaryPowers = function (roll) {
	if (roll <= 15) {
		return "Note Shifting Walls & Rooms";
	} else if (roll <= 30) {
		return "Detect Sloping Passages";
	} else if (roll <= 40) {
		return "Locate Secret Doors";
	} else if (roll <= 50) {
		return "Detect Traps";
	} else if (roll <= 60) {
		return "See Invisible Objects";
	} else if (roll <= 70) {
		return "Detect Evil and/or Gold";
	} else if (roll <= 80) {
		return "Detect Meal & What Kind";
	} else if (roll <= 90) {
		return "Detect Magic";
	} else if (roll <= 95) {
		return "Detect Gems (# and Size)";
	} else {
		throw "Invalid roll for magicSwordExtraordinaryAbilities";
	}
};

oddTables.magicSwordLanguages = function (roll) {
	var result = 0;
	if (roll === 100) {
		while (roll === 100) {
			roll = dice.d100(1);
		}
		result += oddTables.magicSwordLanguages(roll);
	}
	roll = dice.d100(1);
	while (roll === 100) {
		roll = dice.d100(1);
	}
	if (roll <= 50) {
		return 1;
	} else if (roll <= 70) {
		return 2;
	} else if (roll <= 85) {
		return 3;
	} else if (roll <= 95) {
		return 4;
	} else if (roll <= 99) {
		return 5;
	} else {
		throw "Invalid roll for magicSwordLanguages";
	}
};

oddTables.magicSword = function () {
	var roll, result, i,
		alignment, baseSword, intelligence, ego, egoBonus, communication, 
		numPrimaryPowers, numExtraordinaryAbilities,
		powers, specialPurpose;
	roll = dice.d100();
	if (roll <= 65) {
		alignment = "Lawful";
		baseSword = oddTables.basicLawfulSword();
	} else if (roll <= 90) {
		alignment = "Neutral";
		baseSword = oddTables.basicLawfulSword();
	} else {
		alignment = "Chaotic";
		baseSword = oddTables.basicChaoticSword();
	}

	powers = [];
	intelligence = dice.d12();

	if (intelligence <= 6) {
		ego = 0;
		numExtraordinaryAbilities = 0;
		numPrimaryPowers = 0;
		communication = "None";
	} else if (intelligence <= 7) {
		ego = dice.d12();
		numExtraordinaryAbilities = 0;
		numPrimaryPowers = 1;
		communication = "Empathy";
	} else if (intelligence <= 8) {
		ego = dice.d12();
		numExtraordinaryAbilities = 0;
		numPrimaryPowers = 2;
		communication = "Empathy";
	} else if (intelligence <= 9) {
		ego = dice.d12();
		numExtraordinaryAbilities = 0;
		numPrimaryPowers = 3;
		communication = "Empathy";
	} else if (intelligence <= 10) {
		ego = dice.d12();
		numExtraordinaryAbilities = 0;
		numPrimaryPowers = 3;
		communication = "Speaks " + oddTables.magicSwordLanguages(dice.d100(1));
	} else if (intelligence <= 11) {
		ego = dice.d12();
		numExtraordinaryAbilities = 0;
		numPrimaryPowers = 3;
		communication = "Speaks " + oddTables.magicSwordLanguages(dice.d100(1));
		powers[powers.length] = "Read Magic";
	} else {
		ego = dice.d12();
		numExtraordinaryAbilities = 1;
		numPrimaryPowers = 3;
		communication = "Telepathy and speaks " + oddTables.magicSwordLanguages(dice.d100(1));
		powers[powers.length] = "Read Magic";
	}

	roll = dice.d100(1);
	if (roll >= 91) {
		if (alignment === "Chaotic") {
			specialPurpose = "Special Purpose: " +
				dice.pick(["Slay Magic-Users", "Slay Clerics", "Slay Fighting-Men", "Slay Monsters", "Defeat Law"]) +
				", disintigrates Lawful oppenents";
		} else if (alignment === "Lawful") {
			specialPurpose = "Special Purpose: " +
				dice.pick(["Slay Magic-Users", "Slay Clerics", "Slay Fighting-Men", "Slay Monsters", "Defeat Chaos"]) +
				", paralyzes Chaotic opponents";
		} else {
			specialPurpose = "Special Purpose: " +
				dice.pick(["Slay Magic-Users", "Slay Clerics", "Slay Fighting-Men", "Slay Monsters", "Defeat Law", "Defeat Chaos"]) +
				", adds +1 to all saving throws";	
		}
		ego = 12;
		intelligence = 12;
		numExtraordinaryAbilities = 1;
		numPrimaryPowers = 3;
		communication = "Telepathy and speaks " + oddTables.magicSwordLanguages(dice.d100(1));
		powers[powers.length] = "Read Magic";
	}

	for (i = numPrimaryPowers; i > 0; i--) {
		roll = dice.d100(1);
		if (roll >= 96 && roll <= 99) {
			numPrimaryPowers += 1;
		}
	}
	while (numPrimaryPowers > 0) {
		roll = dice.d100(1);
		if (roll === 100) {
			numExtraordinaryAbilities += 1;
		} else {
			while (roll >= 96) {
				roll = dice.d100(1);
			}
			powers[powers.length] = 
				oddTables.magicSwordPrimaryPowers(roll);
			numPrimaryPowers--;
		}
	}

	for (i = numExtraordinaryAbilities; i > 0; i--) {
		roll = dice.d100(1);
		if (roll >= 98 && roll <= 99) {
			numExtraordinaryAbilities += 1;
		} else if (roll === 100) {
			numExtraordinaryAbilities += 2;
		}
	}
	while (numExtraordinaryAbilities > 0) {
		roll = dice.d100(1);
		while (roll >= 98) {
			roll = dice.d100(1);
		}
		powers[powers.length] = 
			oddTables.magicSwordExtraordinaryAbilities(roll);
		egoBonus++;
		numExtraordinaryAbilities--;
	}

	result = oddNames.swordName() + ", " + alignment + " " + baseSword;
	if (intelligence >= 7) {
		result += "\n\tInt: " + intelligence +
			" Ego: " + ego +
			(egoBonus ? ("+" + egoBonus) : "") +
			", " + communication;
	}
	if (specialPurpose) {
		result += "\n\t" + specialPurpose;
	}
	for (i = 0; i < powers.length; i++) {
		result += "\n\t" + powers[i];
	}
	return result;
};

oddTables.armor = function () {
	var roll = dice.d100(1);
	if (roll <= 30) {
		return "Shield +1";
	} else if (roll <= 60) {
		return "Armor +1";
	} else if (roll <= 75) {
		return "Armor & Shield +1";
	} else if (roll <= 83) {
		return "Shield +2";
	} else if (roll <= 90) {
		return "Armor +2";
	} else if (roll <= 97) {
		return "Armor & Shield +2";
	} else {
		return "Shield +3";
	}
};

oddTables.armorOnly = function () {
	var roll = dice.d100(1);
    if (roll <= 60) {
		return 1;
	} 
	return 2;
};

oddTables.shieldOnly = function () {
	var roll = dice.d100(1);
	if (roll <= 83) {
		return 1;
	} else if (roll <= 97) {
		return 2;
	}
	return 3;
};

oddTables.miscWeapon = function () {
	var roll = dice.d100(1); 
	if (roll <= 25) { 
		return "10 Magic Arrows";
	} else if (roll <= 40) {
		return (dice.d10(3)) + " Magic Arrows";
	} else if (roll <= 55) {
		return "Dagger +1 vs. Man-Sized Opponents, +3 vs. Orcs, Goblins and Kobolds";
	} else if (roll <= 60) {
		return "Dagger +2 vs. Man-Sized Opponents, +3 vs. Orcs, Goblins and Kobolds";
	} else if (roll <= 65) {
		return "Magic Bow";
	} else if (roll <= 70) {
		return "Axe +1";
	} else if (roll <= 80) {
		return "Mace +2";
	} else if (roll <= 85) {
		return "War Hammer +1";
	} else if (roll <= 89) {
		return "War Hammer +2";
	} else if (roll <= 90) {
		return "War Hammer +3, 6\" Throwing Range with Return";
	} else if (roll <= 96) {
		return "Spear +1";
	} else if (roll <= 99) {
		return "Spear +2";
	} else {
		return "Spear +3";
	}
};

oddTables.potion = function (verbose) {
	var result;
	result = "";
	if (typeof verbose !== "undefined" && verbose) {
		result += "Potion of ";
	}
	result += dice.pick(["Growth", "Diminuation", "Giant Strength", 
		"Invisibility", "Gaseous Form", "Polymorph (Self)", 
		"Speed", "Levitation", "Flying", "ESP", "Delusion", 
		"Healing", "Longevity", "Clairvoyance", "Clairaudience", 
		"Animal Control", "Undead Control", "Plant Control", 
		"Human Control", "Giant Control", "Dragon Control", 
		"Poison", "Invulnerability", "Fire Resistance", 
		"Treasure Finding", "Heroism"]);
	return result;
};

oddTables.spellScroll = function (number) {
	var result, i;
	result = "Spell Scroll (";
	number = (typeof number === "number") ? number : 1;
	for (i = 0; i < number; i++) {
		result += oddTables.spellMuAny();
		if (i <= (number - 1)) {
			result += ", ";
		}
	}
	result += ")";
	return result;
};

oddTables.scrollCurse = function () {
	var roll = dice.d8(1);
	if (roll <= 2) {
		return "Any monster of the referee's choice";
	} else if (roll <= 4) {
		return "Disease, fatal in 3 turns unless healed";
	} else if (roll <= 6) {
		return "Polymorph to insect of referee's choice";
	} else if (roll <= 7) {
		return "Transportation 1,000 miles, random direction";
	} else {
		return "Transportation to another planet";
	}
};

oddTables.scroll = function () {
	var roll = dice.d100(1); 
	if (roll <= 20) {
		return oddTables.spellScroll(1);
	} else if (roll <= 35) {
		return oddTables.spellScroll(2);
	} else if (roll <= 45) {
		return oddTables.spellScroll(3);
	} else if (roll <= 50) {
		return oddTables.spellScroll(7);
	} else if (roll <= 60) {
		return "Curse Scroll: " + oddTables.scrollCurse();
	} else if (roll <= 70) {
		return "Scroll of Protection: Lycanthropes";
	} else if (roll <= 80) {
		return "Scroll of Protection: Undead";
	} else if (roll <= 90) {
		return "Scroll of Protection: Elementals";
	} else {
		return "Scroll of Protection: Magic";
	}
};

oddTables.ring = function (verbose) {
	var result, roll;
	result = "";
	if (typeof verbose !== "undefined" && verbose) {
		result += "Ring of ";
	}
	roll = dice.d100(1);
	if (roll <= 9) {
		result += "Invisibility";
	} else if (roll <= 15) {
		result += "Mammal Control";
	} else if (roll <= 21) {
		result += "Human Control";
	} else if (roll <= 30) {
		result += "Weakness";
	} else if (roll <= 39) {
		result += "Protection";
	} else if (roll <= 49) {
		result += "Three Wishes";
	} else if (roll <= 60) {
		result += "Delusion";
	} else if (roll <= 70) {
		result += "Water Walking";
	} else if (roll <= 80) {
		result += "Fire Resistance";
	} else if (roll <= 85) {
		result += "Protection, 5' r.";
	} else if (roll <= 90) {
		result += "Regeneration";
	} else if (roll <= 92) {
		result += "Djinn Summoning";
	} else if (roll <= 94) {
		result += "Telekenisis";
	} else if (roll <= 96) {
		result += "X-Ray Vision";
	} else if (roll <= 98) {
		result += "Spell Turning";
	} else if (roll <= 99) {
		result += "Spell Storing";
	} else {
		result += "Many Wishes (" + dice.d6(4) + ")";
	}
	return result;
};

oddTables.wand = function () {
	var result, roll;
	result = "";
	roll = dice.d100(1);
	if (roll <= 15) {
		result += "Wand of Metal Detection";
	} else if (roll <= 20) {
		result += "Wand of Enemy Detection";
	} else if (roll <= 25) {
		result += "Wand of Magic Detection";
	} else if (roll <= 30) {
		result += "Wand of Secret Doors & Traps Detection";
	} else if (roll <= 35) {
		result += "Wand of Illusion";
	} else if (roll <= 40) {
		result += "Wand of Fear";
	} else if (roll <= 45) {
		result += "Wand of Cold";
	} else if (roll <= 50) {
		result += "Wand of Paralization";
	} else if (roll <= 55) {
		result += "Wand of Fire Balls";
	} else if (roll <= 60) {
		result += "Wand of Lightning Bolts";
	} else if (roll <= 65) {
		result += "Wand of Polymorph";
	} else if (roll <= 70) {
		result += "Wand of Negation";
	} else if (roll <= 80) {
		result += "Staff of Healing";
	} else if (roll <= 85) {
		result += "Staff of Commanding";
	} else if (roll <= 90) {
		result += "Snake Staff";
	} else if (roll <= 95) {
		result += "Staff of Striking";
	} else if (roll <= 97) {
		result += "Staff of Withering*";
	} else if (roll <= 99) {
		result += "Staff of Power";
	} else {
		result += "Staff of Wizardry";
	}
	return result;
};

oddTables.miscMagic = function () {
	var result, roll;
	result = "";
	roll = dice.d100(1);
	if (roll <= 4) {
		result += "Crystal Ball";
	} else if (roll <= 6) {
		result += "Crystal Ball with Clairaudience";
	} else if (roll <= 7) {
		result += "Crystal Ball with ESP";
	} else if (roll <= 12) {
		result += "Medallion of ESP, 3\" Range";
	} else if (roll <= 15) {
		result += "Medallion of ESP, 9\" Range*";
	} else if (roll <= 18) {
		result += "Amulet vs. Crystal Balls and ESP";
	} else if (roll <= 24) {
		result += "Scarab of Protection from Evil High Priests";
	} else if (roll <= 29) {
		result += "Bag of Holding";
	} else if (roll <= 30) {
		result += "Censor Controlling Air Elementals";
	} else if (roll <= 31) {
		result += "Stone Controlling Earth Elementals";
	} else if (roll <= 32) {
		result += "Brazier Commanding Fire Elementals";
	} else if (roll <= 33) {
		result += "Bowl Commanding Water Elementals";
	} else if (roll <= 35) {
		result += "Efreet Bottle";
	} else if (roll <= 38) {
		result += "Displacer Cloak";
	} else if (roll <= 47) {
		result += "Elven Cloak and Boots";
	} else if (roll <= 52) {
		result += "Boots of Speed";
	} else if (roll <= 57) {
		result += "Boots of Levitation";
	} else if (roll <= 62) {
		result += "Boots of Traveling and Leaping";
	} else if (roll <= 67) {
		result += "Broom of Flying";
	} else if (roll <= 72) {
		result += "Helm of Reading -Magic and Languages";
	} else if (roll <= 75) {
		result += "Helm of Telepathy";
	} else if (roll <= 76) {
		result += "Helm of Teleportation";
	} else if (roll <= 87) {
		result += "Helm of Chaos (Law)";
	} else if (roll <= 88) {
		result += "Flying Carpet";
	} else if (roll <= 89) {
		result += "Drums of Panic, 24\" Range";
	} else if (roll <= 90) {
		result += "Horn of Blasting, 10\" Range";
	} else if (roll <= 97) {
		result += "Gauntlets of Ogre Power";
	} else if (roll <= 99) {
		result += "Girdle of Giant Strength";
	} else {
		result += "Mirror of Life Trapping";
	}
	return result;
};

oddTables.clericItem = function () {
	var result, roll;
	result = "";
	roll = dice.d100(1);
	if (roll <= 15) {
		result += "Wand of Metal Detection";
	} else if (roll <= 20) {
		result += "Wand of Enemy Detection";
	} else if (roll <= 25) {
		result += "Wand of Magic Detection";
	} else if (roll <= 30) {
		result += "Wand of Secret Doors & Traps Detection";
	} else if (roll <= 35) {
		result += "Wand of Illusion";
	} else if (roll <= 40) {
		result += "Wand of Fear";
	} else if (roll <= 45) {
		result += "Wand of Paralyzation";
	} else if (roll <= 50) {
		result += "Wand of Paralyzation";
	} else if (roll <= 60) {
		result += "Mace +2";
	} else if (roll <= 65) {
		result += "Hammer +1";
	} else if (roll <= 69) {
		result += "Hammer +2";
	} else if (roll <= 70) {
		result += "Hammer +3, Throwing";
	} else if (roll <= 80) {
		result += "Staff of Healing";
	} else if (roll <= 85) {
		result += "Staff of Commanding";
	} else if (roll <= 90) {
		result += "Snake Staff";
	} else if (roll <= 95) {
		result += "Staff of Striking";
	} else {
		result += "Staff of Withering*";
	}
	return result;
};

oddTables.magicItem = function () {
	var roll = dice.d100(1);
	if (roll <= 20) {
		return oddTables.magicSword();
	} else if (roll <= 35) {
		return oddTables.armor();
	} else if (roll <= 40) {
		return oddTables.miscWeapon();
	} else if (roll <= 65) {
		return oddTables.potion(true);
	} else if (roll <= 85) {
		return oddTables.scroll();
	} else if (roll <= 90) {
		return oddTables.ring(true);
	} else if (roll <= 95) {
		return oddTables.wand();
	} else {
		return oddTables.miscMagic();
	}
};

oddTables.magicItemArms = function () {
	var roll = dice.d6(1);
	if (roll <= 2) {
		return oddTables.magicSword();
	} else if (roll <= 4) {
		return oddTables.armor();
	} else  {
		return oddTables.miscWeapon();
	}
};

oddTables.magicItemNoSwords = function () {
	var roll = dice.d100(1);
	while (roll <= 20) {
		roll = dice.d100(1);
	}
	if (roll <= 35) {
		return oddTables.armor();
	} else if (roll <= 40) {
		return oddTables.miscWeapon();
	} else if (roll <= 65) {
		return oddTables.potion(true);
	} else if (roll <= 85) {
		return oddTables.scroll();
	} else if (roll <= 90) {
		return oddTables.ring(true);
	} else if (roll <= 95) {
		return oddTables.wand();
	} else {
		return oddTables.miscMagic();
	}
};

oddTables.magicItemNoArms = function () {
	var roll = dice.d100(1);
	while (roll <= 40) {
		roll = dice.d100(1);
	}
	if (roll <= 65) {
		return oddTables.potion(true);
	} else if (roll <= 85) {
		return oddTables.scroll();
	} else if (roll <= 90) {
		return oddTables.ring(true);
	} else if (roll <= 95) {
		return oddTables.wand();
	} else {
		return oddTables.miscMagic();
	}
};

oddTables.magicOrMap = function () {
	var roll = dice.d100(1);
	if (roll <= 75) {
		return oddTables.magicItem();
	}  else {
		return oddTables.treasureMap();
	}
};

oddTables.gemValue = function () {
	var roll, baseIndex;
	roll = dice.d100(1);
	if (roll <= 10) {
		baseIndex = 1; 
	} else if (roll <= 25) {
		baseIndex = 2;
	} else if (roll <= 75) {
		baseIndex = 3;
	} else if (roll <= 90) {
		baseIndex = 4;
	} else {
		baseIndex = 5;
	}

	roll = dice.d6();
	while (roll === 6) {
		baseIndex++;
		roll = dice.d6();
	}

	switch (baseIndex) {
		case  1: return     10;
		case  2: return     50;
		case  3: return    100;
		case  4: return    500;
		case  5: return   1000;
		case  6: return   5000;
		case  7: return  10000;
		case  8: return  25000;
		case  9: return  50000;
		case 10: return 100000;
		default: return 500000;
	}
};

// oddTables.gems = function (number) {
// 	var numLots, result;
// 	number = (typeof number === "number") ? number : 1;
// 	number = (number < 1) ? 1 : number;
// 	numLots = Math.floor(number / 10);
// 	number = number % 10;

// 	result = "";
// 	while (numLots > 0) {
// 		result += "10 gems worth " + oddTables.gemValue() + "gp each\n\t";
// 		numLots--;
// 	}
// 	if (number > 5) {
// 		result += "5 gems worth " + oddTables.gemValue() + "gp each\n\t";
// 		number = number - 5;
// 	}
// 	while (number > 0) {
// 		result += "1 gem worth " + oddTables.gemValue() + "gp\n\t";
// 		number--;
// 	}
// 	return result;
// };

oddTables.gems = function (number) {
	var items, val, groups, result;
	number = (typeof number === "number") ? number : 1;
	number = (number < 1) ? 1 : number;
	items = [];
	groups = [];
	result = "";
	while (number > 0) {
		// result += "1 gem worth " + oddTables.gemValue() + "gp\n\t";
		// items.push(oddTables.gemValue());
		val = oddTables.gemValue();
		if (typeof groups[val] === "number") {
			groups[val] = groups[val] + 1;
		} else {
			groups[val] = 1;
		}
		number--;
	}
	// items.sort(function(a,b){return b-a;});
	// while (number < items.length) {
	// 	// result += "a gem worth " + item[number] + "gp\n\t";
	// 	if (items[number] != null) {
	// 		groups[items[number]] = 1;
	// 	} else {
	// 		groups[items[number]] = groups[items[number]] + 1;
	// 	}
	// 	number++;
	// }
	groups.forEach(function(item, index){ 
		result += (item === 1 ? "a gem" : item + " gems") +
			" worth " + index + "gp" +
			(item === 1 ? "" : " each") +
			"\n\t";
		});
	return result;
};

oddTables.jewelry = function (number) {
	var roll, items, val, groups, result;
	number = (typeof number === "number") ? number : 1;
	number = (number < 1) ? 1 : number;
	items = [];
	groups = [];
	result = "";
	while (number > 0) {
		roll = dice.d100(1);
		if (roll <= 20) {
			// result += "a piece of jewelry worth " + (dice.d6(3) * 100) + "gp\n\t";
			// items.push(dice.d6(3) * 100);
			val = dice.d6(3) * 100;
		} else if (roll <= 80) {
			// result += "a piece of jewelry worth " + (dice.d6(1) * 1000) + "gp\n\t";
			// items.push(dice.d6(1) * 1000);
			val = dice.d6(1) * 1000;
		} else {
			// result += "a piece of jewelry worth " + (dice.d10(1) * 1000) + "gp\n\t";
			// items.push(dice.d10(1) * 1000);
			val = dice.d10(1) * 1000;
		}
		if (typeof groups[val] === "number") {
			groups[val] = groups[val] + 1;
		} else {
			groups[val] = 1;
		}
		number--;
	}
	// items.sort(function(a,b){return b-a;});
	// while (number < items.length) {
	// 	// result += "a piece of jewelry worth " + item[number] + "gp\n\t";
	// 	if (typeof items[number] != undefined) {
	// 		groups[items[number]] = 1;
	// 	} else {
	// 		groups[items[number]] = groups[items[number]] + 1;
	// 	}
	// 	number++;
	// }
	groups.forEach(function(item, index){ 
		result += (item === 1 ? "a piece" : item + " pieces") +
			" of jewelry worth " + index + "gp" +
			(item === 1 ? "" : " each") +
			"\n\t";
		});
	return result;
};

oddTables.treasureMap = function () {
	var roll1, roll2, i, result;
	result = "Map to ";
	roll1 = dice.d10();
	if (roll1 <= 6) {
		//map to treasure
		roll2 = dice.d8();
		if (roll2 <= 1) {
			result += (dice.d4()) + "0,000 silver";
		} else if (roll2 <= 2) {
			result += (dice.d6(5)) + "0,000 gold";
		} else if (roll2 <= 3) {
			result += (dice.d4()) + "0,000 silver and " + (dice.d6(5)) + "0,000 gold";
		} else if (roll2 <= 4) {
			result += (dice.d4()) + "0,000 silver\n" +
				(dice.d6(5)) + "0,000 gold\n" +
				oddTables.gems(dice.d10(2));
		} else if (roll2 <= 5) {
			result += (dice.d4()) + "0,000 silver, " +
				(dice.d6(5)) + "0,000 gold" +
				oddTables.gems(dice.d6(5));
		} else if (roll2 <= 6) {
			result += (dice.d4()) + "0,000 silver\n" +
				(dice.d6(5)) + "0,000 gold\n" +
				oddTables.gems(dice.d100(1));
		} else if (roll2 <= 7) {
			result += oddTables.gems(dice.d6(1) * 10) +
				oddTables.jewelry(dice.d10(2));
		} else {
			result += (dice.d4()) + "0,000 silver\n" +
				(dice.d6(5)) + "0,000 gold\n" +
				oddTables.gems(dice.d6(1) * 10) +
				oddTables.jewelry(dice.d10(2));
		}
	} else if (roll1 <= 9) {
		//map to magic
		roll2 = dice.d8();
		if (roll2 <= 3) {
			result += oddTables.magicItem();
		} else if (roll2 <= 5) {
			result += oddTables.magicItem() + "\n" + oddTables.magicItem();
		} else if (roll2 <= 6) {
			for (i = 0; i < 3; i++) {
				result += oddTables.magicItemNoSwords() + "\n";
			}
		} else if (roll2 <= 7) {
			result += oddTables.potion(true) + "\n";
			for (i = 0; i < 3; i++) {
				result += oddTables.magicItem() + "\n";
			}
		} else {
			result += oddTables.potion(true) + "\n";
			result += oddTables.scroll() + "\n";
			for (i = 0; i < 3; i++) {
				result += oddTables.magicItem() + "\n";
			}
		}
	} else {
		//map to magic and treasure
		roll2 = dice.d8();
		if (roll2 <= 1) {
			result += (dice.d4()) + "0,000 silver and " + oddTables.magicItem();
		} else if (roll2 <= 2) {
			result += (dice.d6(5)) + "0,000 gold and " + oddTables.magicItem();
		} else if (roll2 <= 3) {
			result += (dice.d4()) + "0,000 silver\n" +
				(dice.d6(5)) + "0,000 gold\n" +
				oddTables.magicItem() + "\n" +
				oddTables.magicItem() + "\n";
		} else if (roll2 <= 4) {
			for (i = 0; i < 3; i++) {
				result += oddTables.magicItemNoSwords() + "\n";
			}
			result += "another map to " + oddTables.gems(dice.d6(1) * 10) +
				oddTables.jewelry(dice.d10(2));
		} else if (roll2 <= 5) {
			result += (dice.d4()) + "0,000 silver, " +
				oddTables.gems(dice.d6(5)) +
				oddTables.magicItem() + "\n" + oddTables.magicItem();
		} else if (roll2 <= 6) {
			result += oddTables.magicItem();
			result += "another map to " + (dice.d4()) + "0,000 silver";
		} else if (roll2 <= 7) {
			result += (dice.d4()) + "0,000 silver\n" +
				(dice.d6(5)) + "0,000 gold\n" +
				oddTables.gems(dice.d100(1));
			result += oddTables.potion(true) + "\n";
			result += oddTables.scroll() + "\n";
			for (i = 0; i < 3; i++) {
				result += oddTables.magicItem() + "\n";
			}
		} else {
			result += (dice.d4()) + "0,000 silver\n" +
				(dice.d6(5)) + "0,000 gold\n" +
				oddTables.gems(dice.d6(1) * 10) +
				oddTables.jewelry(dice.d10(2));
			result += oddTables.potion(true) + "\n";
			for (i = 0; i < 3; i++) {
				result += oddTables.magicItem() + "\n";
			}
		}
	}
	return result;
};

//treasure table I
oddTables.treasureTypeA = function () {
	var result, i;
	result = "Treasure Type A (Land)";
	if (dice.percentChance(25)) {
		result += "\n\t" + (dice.d6(1) * 1000) + "cp";
	}
	if (dice.percentChance(30)) {
		result += "\n\t" + (dice.d6(1) * 1000) + "sp";
	}
	if (dice.percentChance(35)) {
		result += "\n\t" + (dice.d6(2) * 1000) + "gp";
	}
	if (dice.percentChance(50)) {
		result += "\n\t" + oddTables.gems(dice.d6(6)).trim();
	}
	if (dice.percentChance(50)) {
		result += "\n\t" + oddTables.jewelry(dice.d6(6)).trim();
	}
	if (dice.percentChance(40)) {
		for (i = 0; i < 3; i++) {
			result += "\n\t" + oddTables.magicOrMap().trim();
		}
	}
	result += "\n";
	return result;
};

oddTables.treasureTypeADesert = function () {
	var result, i;
	result = "Treasure Type A (Desert)";
	if (dice.percentChance(20)) {
		result += "\n\t" + (dice.d4(1) * 1000) + "cp";
	}
	if (dice.percentChance(25)) {
		result += "\n\t" + (dice.d4(1) * 1000) + "sp";
	}
	if (dice.percentChance(30)) {
		result += "\n\t" + (dice.d6(1) * 1000) + "gp";
	}
	if (dice.percentChance(50)) {
		result += "\n\t" + oddTables.gems(dice.d4(1) * 10).trim();
	}
	if (dice.percentChance(50)) {
		result += "\n\t" + oddTables.jewelry(dice.d4(1) * 10).trim();
	}
	if (dice.percentChance(60)) {
		for (i = 0; i < 3; i++) {
			result += "\n\t" + oddTables.magicItem().trim();
		}
	}
	result += "\n";
	return result;
};

oddTables.treasureTypeAWater = function () {
	var result;
	result = "Treasure Type A (Water)";
	if (dice.percentChance(60)) {
		result += "\n\t" + (dice.d6(5) * 1000) + "gp";
	}
	if (dice.percentChance(60)) {
		result += "\n\t" + oddTables.gems(dice.d6(1) * 10).trim();
	}
	if (dice.percentChance(60)) {
		result += "\n\t" + oddTables.jewelry(dice.d6(1) * 10).trim();
	}
	if (dice.percentChance(50)) {
		result += "\n\t" + oddTables.treasureMap().trim();
	}
	result += "\n";
	return result;
};

oddTables.treasureTypeB = function () {
	var result;
	result = "Treasure Type B";
	if (dice.percentChance(50)) {
		result += "\n\t" + (dice.d8(1) * 1000) + "cp";
	}
	if (dice.percentChance(25)) {
		result += "\n\t" + (dice.d6(1) * 1000) + "sp";
	}
	if (dice.percentChance(25)) {
		result += "\n\t" + (dice.d3(2) * 1000) + "gp";
	}
	if (dice.percentChance(25)) {
		result += "\n\t" + oddTables.gems(dice.d6(1)).trim();
	}
	if (dice.percentChance(25)) {
		result += "\n\t" + oddTables.jewelry(dice.d6(1)).trim();
	}
	if (dice.percentChance(10)) {
		result += "\n\t" + oddTables.magicItemArms().trim();
	}
	result += "\n";
	return result;
};

oddTables.treasureTypeC = function () {
	var result, i;
	result = "Treasure Type C";
	if (dice.percentChance(20)) {
		result += "\n\t" + (dice.d12(1) * 1000) + "cp";
	}
	if (dice.percentChance(30)) {
		result += "\n\t" + (dice.d4(1) * 1000) + "sp";
	}
	if (dice.percentChance(25)) {
		result += "\n\t" + oddTables.gems(dice.d4(1)).trim();
	}
	if (dice.percentChance(25)) {
		result += "\n\t" + oddTables.jewelry(dice.d4(1)).trim();
	}
	if (dice.percentChance(40)) {
		for (i = 0; i < 2; i++) {
			result += "\n\t" + oddTables.magicOrMap().trim();
		}
	}
	result += "\n";
	return result;
};

oddTables.treasureTypeD = function () {
	var result, i;
	result = "Treasure Type D";
	if (dice.percentChance(10)) {
		result += "\n\t" + (dice.d8(1) * 1000) + "cp";
	}
	if (dice.percentChance(15)) {
		result += "\n\t" + (dice.d12(1) * 1000) + "sp";
	}
	if (dice.percentChance(60)) {
		result += "\n\t" + (dice.d6(1) * 1000) + "gp";
	}
	if (dice.percentChance(30)) {
		result += "\n\t" + oddTables.gems(dice.d8(1)).trim();
	}
	if (dice.percentChance(30)) {
		result += "\n\t" + oddTables.jewelry(dice.d8(1)).trim();
	}
	if (dice.percentChance(40)) {
		result += "\n\t" + oddTables.potion(true);
		for (i = 0; i < 2; i++) {
			result += "\n\t" + oddTables.magicOrMap().trim();
		}
	}
	result += "\n";
	return result;
};

oddTables.treasureTypeE = function () {
	var result, i;
	result = "Treasure Type E";
	if (dice.percentChance(5)) {
		result += "\n\t" + (dice.d10(1) * 1000) + "cp";
	}
	if (dice.percentChance(30)) {
		result += "\n\t" + (dice.d12(1) * 1000) + "sp";
	}
	if (dice.percentChance(25)) {
		result += "\n\t" + (dice.d8(1) * 1000) + "gp";
	}
	if (dice.percentChance(10)) {
		result += "\n\t" + oddTables.gems(dice.d10(1)).trim();
	}
	if (dice.percentChance(10)) {
		result += "\n\t" + oddTables.jewelry(dice.d10(1)).trim();
	}
	if (dice.percentChance(40)) {
		result += "\n\t" + oddTables.scroll(true);
		for (i = 0; i < 3; i++) {
			result += "\n\t" + oddTables.magicOrMap().trim();
		}
	}
	result += "\n";
	return result;
};

oddTables.treasureTypeF = function () {
	var result, i;
	result = "Treasure Type F";
	if (dice.percentChance(10)) {
		result += "\n\t" + (dice.d10(2) * 1000) + "sp";
	}
	if (dice.percentChance(25)) {
		result += "\n\t" + (dice.d12(1) * 1000) + "gp";
	}
	if (dice.percentChance(20)) {
		result += "\n\t" + oddTables.gems(dice.d12(2)).trim();
	}
	if (dice.percentChance(20)) {
		result += "\n\t" + oddTables.jewelry(dice.d12(2)).trim();
	}
	if (dice.percentChance(35)) {
		result += "\n\t" + oddTables.potion(true).trim();
		result += "\n\t" + oddTables.scroll(true).trim();
		for (i = 0; i < 3; i++) {
			result += "\n\t" + oddTables.magicItemNoArms().trim();
		}
	}
	result += "\n";
	return result;
};

oddTables.treasureTypeG = function () {
	var result, i;
	result = "Treasure Type G";
	if (dice.percentChance(75)) {
		result += "\n\t" + (dice.d4(1) * 10000) + "gp";
	}
	if (dice.percentChance(25)) {
		result += "\n\t" + oddTables.gems(dice.d6(3)).trim();
	}
	if (dice.percentChance(25)) {
		result += "\n\t" + oddTables.jewelry(dice.d10(1)).trim();
	}
	if (dice.percentChance(40)) {
		result += "\n\t" + oddTables.scroll(true).trim();
		for (i = 0; i < 4; i++) {
			result += "\n\t" + oddTables.magicOrMap().trim();
		}
	}
	result += "\n";
	return result;
};

oddTables.treasureTypeHHalf = function () {
	var result, i;
	result = "Treasure Type H (Half)";
	if (dice.percentChance(25)) {
		result += "\n\t" + (dice.d8(3) * 500) + "cp";
	}
	if (dice.percentChance(50)) {
		result += "\n\t" + (dice.d100(1) * 500) + "sp";
	}
	if (dice.percentChance(75)) {
		result += "\n\t" + (dice.d6(1) * 5000) + "gp";
	}
	if (dice.percentChance(50)) {
		result += "\n\t" + oddTables.gems(dice.d50(1)).trim();
	}
	if (dice.percentChance(50)) {
		result += "\n\t" + oddTables.jewelry(dice.d2(1) * 10).trim();
	}
	if (dice.percentChance(20)) {
		if (dice.percentChance(50)) {
			result += "\n\t" + oddTables.potion(true).trim();
		}
		if (dice.percentChance(50)) {
			result += "\n\t" + oddTables.scroll(true).trim();
		}
		for (i = 0; i < 2; i++) {
			result += "\n\t" + oddTables.magicOrMap().trim();
		}
	}
	result += "\n";
	return result;
};

oddTables.treasureTypeH = function () {
	var result, i;
	result = "Treasure Type H";
	if (dice.percentChance(25)) {
		result += "\n\t" + (dice.d8(3) * 1000) + "cp";
	}
	if (dice.percentChance(50)) {
		result += "\n\t" + (dice.d100(1) * 1000) + "sp";
	}
	if (dice.percentChance(75)) {
		result += "\n\t" + (dice.d6(1) * 10000) + "gp";
	}
	if (dice.percentChance(50)) {
		result += "\n\t" + oddTables.gems(dice.d100(1)).trim();
	}
	if (dice.percentChance(50)) {
		result += "\n\t" + oddTables.jewelry(dice.d4(1) * 10).trim();
	}
	if (dice.percentChance(20)) {
		result += "\n\t" + oddTables.potion(true).trim();
		result += "\n\t" + oddTables.scroll(true).trim();
		for (i = 0; i < 4; i++) {
			result += "\n\t" + oddTables.magicOrMap().trim();
		}
	}
	result += "\n";
	return result;
};

oddTables.treasureTypeHDouble = function () {
	var result, i;
	result = "Treasure Type H (Double)";
	if (dice.percentChance(25)) {
		result += "\n\t" + (dice.d8(3) * 2000) + "cp";
	}
	if (dice.percentChance(50)) {
		result += "\n\t" + (dice.d100(1) * 2000) + "sp";
	}
	if (dice.percentChance(75)) {
		result += "\n\t" + (dice.d6(1) * 20000) + "gp";
	}
	if (dice.percentChance(50)) {
		result += "\n\t" + oddTables.gems(dice.d100(2)).trim();
	}
	if (dice.percentChance(50)) {
		result += "\n\t" + oddTables.jewelry(dice.d4(2) * 10).trim();
	}
	if (dice.percentChance(20)) {
		result += "\n\t" + oddTables.potion(true).trim();
		result += "\n\t" + oddTables.potion(true).trim();
		result += "\n\t" + oddTables.scroll(true).trim();
		result += "\n\t" + oddTables.scroll(true).trim();
		for (i = 0; i < 8; i++) {
			result += "\n\t" + oddTables.magicOrMap().trim();
		}
	}
	result += "\n";
	return result;
};

oddTables.treasureTypeI = function () {
	var result;
	result = "Treasure Type I";
	if (dice.percentChance(50)) {
		result += "\n\t" + oddTables.gems(dice.d8(2)).trim();
	}
	if (dice.percentChance(50)) {
		result += "\n\t" + oddTables.jewelry(dice.d8(2)).trim();
	}
	if (dice.percentChance(20)) {
		result += "\n\t" + oddTables.magicOrMap().trim();
	}
	result += "\n";
	return result;
};

oddTables.treasureTypeNil = function () {
	return ""; //placeholder for encounters with no treasure
};

//treasure table II
oddTables.treasureLevel1 = function () {
	var result;
	result = "Level 1 Treasure";
	result += "\n\t" + (dice.d6(1) * 200) + "cp";
	result += "\n\t" + (dice.d6(1) * 100) + "sp";
	result += "\n\t" + (dice.d6(1) * 10) + "gp";
	if (dice.percentChance(10)) {
		result += "\n\t" + oddTables.gems(dice.d6(1)).trim();
	}
	if (dice.percentChance(10)) {
		result += "\n\t" + oddTables.jewelry(dice.d6(1)).trim();
	}
	if (dice.percentChance(10)) {
		result += "\n\t" + oddTables.magicOrMap().trim();
	}
	result += "\n";
	return result;
};

oddTables.treasureLevel2to3 = function () {
	var result;
	result = "Level 2-3 Treasure";
	result += "\n\t" + (dice.d12(1) * 200) + "cp";
	result += "\n\t" + (dice.d12(1) * 100) + "sp";
	result += "\n\t" + (dice.d6(1) * 100) + "gp";
	if (dice.percentChance(20)) {
		result += "\n\t" + oddTables.gems(dice.d6(1)).trim();
	}
	if (dice.percentChance(20)) {
		result += "\n\t" + oddTables.jewelry(dice.d6(1)).trim();
	}
	if (dice.percentChance(15)) {
		result += "\n\t" + oddTables.magicOrMap().trim();
	}
	result += "\n";
	return result;
};

oddTables.treasureLevel4to5 = function () {
	var result;
	result = "Level 4-5 Treasure";
	result += "\n\t" + (dice.d6(1) * 2000) + "cp";
	result += "\n\t" + (dice.d6(1) * 1000) + "sp";
	result += "\n\t" + (dice.d6(1) * 200) + "gp";
	if (dice.percentChance(30)) {
		result += "\n\t" + oddTables.gems(dice.d6(1)).trim();
	}
	if (dice.percentChance(30)) {
		result += "\n\t" + oddTables.jewelry(dice.d6(1)).trim();
	}
	if (dice.percentChance(20)) {
		result += "\n\t" + oddTables.magicOrMap().trim();
	}
	result += "\n";
	return result;
};

oddTables.treasureLevel6to7 = function () {
	var result;
	result = "Level 6-7 Treasure";
	result += "\n\t" + (dice.d6(1) * 5000) + "cp";
	result += "\n\t" + (dice.d6(1) * 2000) + "sp";
	result += "\n\t" + (dice.d6(1) * 500) + "gp";
	if (dice.percentChance(40)) {
		result += "\n\t" + oddTables.gems(dice.d6(1)).trim();
	}
	if (dice.percentChance(40)) {
		result += "\n\t" + oddTables.jewelry(dice.d6(1)).trim();
	}
	if (dice.percentChance(25)) {
		result += "\n\t" + oddTables.magicOrMap().trim();
	}
	result += "\n";
	return result;
};

oddTables.treasureLevel8to9 = function () {
	var result;
	result = "Level 8-9 Treasure";
	result += "\n\t" + (dice.d6(1) * 5000) + "cp";
	result += "\n\t" + (dice.d6(1) * 5000) + "sp";
	result += "\n\t" + (dice.d6(1) * 1000) + "gp";
	if (dice.percentChance(50)) {
		result += "\n\t" + oddTables.gems(dice.d12(1)).trim();
	}
	if (dice.percentChance(50)) {
		result += "\n\t" + oddTables.jewelry(dice.d12(1)).trim();
	}
	if (dice.percentChance(30)) {
		result += "\n\t" + oddTables.magicOrMap().trim();
	}
	result += "\n";
	return result;
};

oddTables.treasureLevel10to12 = function () {
	var result;
	result = "Level 10-12 Treasure";
	result += "\n\t" + (dice.d6(1) * 10000) + "cp";
	result += "\n\t" + (dice.d6(1) * 5000) + "sp";
	result += "\n\t" + (dice.d6(1) * 2000) + "gp";
	if (dice.percentChance(60)) {
		result += "\n\t" + oddTables.gems(dice.d12(1)).trim();
	}
	if (dice.percentChance(60)) {
		result += "\n\t" + oddTables.jewelry(dice.d12(1)).trim();
	}
	if (dice.percentChance(35)) {
		result += "\n\t" + oddTables.magicOrMap().trim();
	}
	result += "\n";
	return result;
};

oddTables.treasureLevel13 = function () {
	var result;
	result = "Level 13+ Treasure";
	result += "\n\t" + (dice.d6(1) * 20000) + "cp";
	result += "\n\t" + (dice.d6(1) * 10000) + "sp";
	result += "\n\t" + (dice.d6(1) * 5000) + "gp";
	if (dice.percentChance(70)) {
		result += "\n\t" + oddTables.gems(dice.d12(1)).trim();
	}
	if (dice.percentChance(70)) {
		result += "\n\t" + oddTables.jewelry(dice.d12(1)).trim();
	}
	if (dice.percentChance(40)) {
		result += "\n\t" + oddTables.magicOrMap().trim();
	}
	result += "\n";
	return result;
};

//dungeon encounters
oddTables.monsterLevel1 = function () {
	// return dice.pick(["Kobolds", "Goblins", "Skeletons", "Orcs", "Giant Rats", 
	// 	"Centipedes", "Bandits", "Spiders"]);
	switch (dice.d8()) { 
		case 1: return oddMonsters.kobold.toString();
		case 2: return oddMonsters.goblin.toString();
		case 3: return oddMonsters.skeleton.toString();
		case 4: return oddMonsters.orc.toString();
		case 5: return oddMonsters.giantRat.toString();
		case 6: return oddMonsters.centipede.toString();
		case 7: return oddMonsters.bandit.toString();
		case 8: return oddMonsters.giantSpider.toString();
	}
};

oddTables.monsterLevel2 = function () {
	// return dice.pick(["Hobgoblins", "Zombies", "Lizards", "Warriors", "Conjurers", 
	// 	"Gnolls", "Thouls", "Ghouls", "Berserkers", "Theurgists"]);
	switch (dice.d10()) { 
		case 1: return oddMonsters.hobgoblin.toString();
		case 2: return oddMonsters.zombie.toString();
		case 3: return oddMonsters.giantLizard.toString();
		case 4: return "Warriors";
		case 5: return "Conjurers";
		case 6: return oddMonsters.gnoll.toString();
		case 7: return oddMonsters.ghoul.toString();
		case 8: return oddMonsters.ghoul.toString();
		case 9: return oddMonsters.berserker.toString();
		case 10: return "Theurgists";
	}
};

oddTables.monsterLevel3 = function () {
	// return dice.pick(["Wights", "Heroes", "Giant Hogs", "Giant Ants", "Ochre Jelly", 
	// 	"Thaumaturgists", "Swashbucklers", "Magicians", "Giant Snakes", 
	// 	"Giant Weasles"]);
	switch (dice.d10()) { 
		case 1: return oddMonsters.wight.toString();
		case 2: return "Heroes";
		case 3: return oddMonsters.giantHog.toString();
		case 4: return oddMonsters.giantAnt.toString();
		case 5: return oddMonsters.ochreJelly.toString();
		case 6: return "Thaumaturgists";
		case 7: return "Swashbucklers";
		case 8: return "Magicians";
		case 9: return oddMonsters.giantSnake.toString();
		case 10: return oddMonsters.giantWeasel.toString();
	}
};

oddTables.monsterLevel4 = function () {
	// return dice.pick(["Wraiths", "Ogres", "Evil Priests", "Myrmidons", 
	// 	"Giant Beetles", "Giant Scorpions", "Lycanthropes", "Gargoyles", 
	// 	"White Apes", "Enchanters"]);
	switch (dice.d10()) { 
		case 1: return oddMonsters.wraith.toString();
		case 2: return oddMonsters.ogre.toString();
		case 3: return "Evil Priests";
		case 4: return "Myrmidons";
		case 5: return oddMonsters.giantBeetle.toString();
		case 6: return oddMonsters.giantScorpion.toString();
		case 7: return "Lycanthropes";
		case 8: return oddMonsters.gargoyle.toString();
		case 9: return oddMonsters.whiteApe.toString();
		case 10: return "Enchanters";
	}
};

oddTables.monsterLevel5 = function () {
	// return dice.pick(["Trolls", "Superheros", "Wyverns", "Spectres", "Mummies", 
	// 	"Minotaurs", "Manticores", "Cockatrices", "Sorcerers", "Wyverns", 
	// 	"Hydra (6-8 Heads)", "Medusae"]);
	switch (dice.d12()) { 
		case 1: return oddMonsters.troll.toString();
		case 2: return "Superheros";
		case 3: return oddMonsters.wyvern.toString();
		case 4: return oddMonsters.spectre.toString();
		case 5: return oddMonsters.mummy.toString();
		case 6: return oddMonsters.minotaur.toString();
		case 7: return oddMonsters.manticore.toString();
		case 8: return oddMonsters.cockatrice.toString();
		case 9: return "Sorcerers";
		case 10: return oddMonsters.wyvern.toString();
		case 11: return (dice.d3() + 5) + "-headed " + oddMonsters.hydra.toString();
		case 12: return oddMonsters.medusa.toString();
	}
};

oddTables.monsterLevel6 = function () {
	// return dice.pick(["Giants", "Hydra (9-12 heads)", "Dragons", "Basilisks", 
	// 	"Gorgons", "Chimeras", "Vampires", "Lords", "Balrogs", "Wizards*", 
	// 	"Evil High Priests*", "Purple Worms"]);
	switch (dice.d12()) { 
		case 1: return "Giants";
		case 2: return (dice.d4() + 8) + "-headed " + oddMonsters.hydra.toString();
		case 3: return "Dragons";
		case 4: return oddMonsters.basilisk.toString();
		case 5: return oddMonsters.gorgon.toString();
		case 6: return oddMonsters.chimera.toString();
		case 7: return oddMonsters.vampire.toString();
		case 8: return "Lords";
		case 9: return oddMonsters.balrogs.toString();
		case 10: return "Wizards";
		case 11: return "Evil High Priests";
		case 12: return oddMonsters.purpleWorm.toString();
	}
};

oddTables.dungeonLevel1 = function () {
	switch (dice.d6()) {
		case 1:
		case 2: return dice.d6() + " " + oddTables.monsterLevel1();
		case 3:
		case 4: return Math.round(dice.d6() / 2) + " " + oddTables.monsterLevel2();
		case 5: return Math.round(dice.d6() / 4) + " " + oddTables.monsterLevel3();
		case 6: return "1 " + oddTables.monsterLevel4();
	}
};

oddTables.dungeonLevel2 = function () {
	switch (dice.d6()) {
		case 1: return dice.d6(2) + " " + oddTables.monsterLevel1();
		case 2: return dice.d6() + " " + oddTables.monsterLevel2();
		case 3:
		case 4: return Math.round(dice.d6() / 2) + " " + oddTables.monsterLevel3();
		case 5: return Math.round(dice.d6() / 4) + " " + oddTables.monsterLevel4();
		case 6: return "1 " + oddTables.monsterLevel5();
	}
};

oddTables.dungeonLevel3 = function () {
	switch (dice.d6()) {
		case 1: return dice.d6(2) + " " + oddTables.monsterLevel2();
		case 2: return dice.d6() + " " + oddTables.monsterLevel3();
		case 3:
		case 4: return Math.round(dice.d6() / 2) + " " + oddTables.monsterLevel4();
		case 5: return Math.round(dice.d6() / 4) + " " + oddTables.monsterLevel5();
		case 6: return "1 " + oddTables.monsterLevel6();
	}
};

oddTables.dungeonLevel4to5 = function () {
	switch (dice.d6()) {
		case 1: return dice.d6(2) + " " + oddTables.monsterLevel3();
		case 2: 
		case 3: return dice.d6() + " " + oddTables.monsterLevel4();
		case 4: 
		case 5: return Math.round(dice.d6() / 2) + " " + oddTables.monsterLevel5();
		case 6: return Math.round(dice.d6() / 4) + " " + oddTables.monsterLevel6();
	}
};

oddTables.dungeonLevel6to7 = function () {
	switch (dice.d6()) {
		case 1: return dice.d6(2) + " " + oddTables.monsterLevel4();
		case 2: 
		case 3: 
		case 4: return dice.d6() + " " + oddTables.monsterLevel5();
		case 5:  
		case 6: return Math.round(dice.d6() / 2) + " " + oddTables.monsterLevel6();
	}
};

oddTables.dungeonLevel8to9 = function () {
	switch (dice.d6()) {
		case 1: 
		case 2: return dice.d6(2) + " " + oddTables.monsterLevel5();
		case 3: 
		case 4: 
		case 5:  
		case 6: return dice.d6() + " " + oddTables.monsterLevel6();
	}
};

oddTables.dungeonLevel10t12 = function () {
	switch (dice.d6()) {
		case 1: return dice.d6(2) + " " + oddTables.monsterLevel5();
		case 2: 
		case 3: 
		case 4: 
		case 5:  
		case 6: return dice.d6() + " " + oddTables.monsterLevel6();
	}
};

oddTables.dungeonLevel13 = function () {
	return dice.d6() + " " + oddTables.monsterLevel6();
};

//wilderness encounters

oddTables.monsterHumanTypical = function () {
	switch (dice.d12()) {
		case  1: return "Bandits";
		case  2: return "Brigands";
		case  3: return "Necromancer";
		case  4: return "Wizard";
		case  5: return "Bandits";
		case  6: return "Berserkers";
		case  7: return "Lord";
		case  8: return "Superhero";
		case  9: return "Brigands";
		case 10: return "Bandits";
		case 11: return "Evil High Priest";
		case 12: return "Patriarch";
	}
};

oddTables.monsterHumanMountain = function () {
	switch (dice.d12()) {
		case  1: return "Bandits";
		case  2: return "Berserkers";
		case  3: return "Brigands";
		case  4: return "Lord";
		case  5: return "Wizard";
		case  6: return "Superhero";
		case  7: return "Cavemen";
		case  8: return "Necromancer";
		case  9: return "Evil High Priest";
		case 10: return "Cavemen";
		case 11: return "Patriarch";
		case 12: return "Berserkers";
	}
};

oddTables.monsterHumanDesert = function () {
	switch (dice.d6()) {
		case  1: return "Nomads";
		case  2: return "Dervishes";
		case  3: return "Nomads";
		case  4: return "Lord";
		case  5: return "Wizard";
		case  6: return "Nomads";
	}
};

oddTables.monsterHumanBarsoom = function () {
	switch (dice.d6()) {
		case  1: return "Red Martians";
		case  2: return "Tharks";
		case  3: return "Black Martians";
		case  4: return "Yellow Martians";
		case  5: return "Tharks";
		case  6: return "White Martians";
	}
};

oddTables.monsterHumanWater = function () {
	switch (dice.d6()) {
		case  1: return "Buccaneers";
		case  2: return "Pirates";
		case  3: return "Buccaneers";
		case  4: return "Pirates";
		case  5: return "Buccaneers";
		case  6: return "Mermen";
	}
};

oddTables.monsterFlyer = function () {
	switch (dice.d12()) {
		case  1: return "Pegasi";
		case  2: return "Rocs";
		case  3: return "Chimerae";
		case  4: return "Hippogriffs";
		case  5: return "Griffons";
		case  6: return "Manticores";
		case  7: return "Rocs";
		case  8: return "Wyverns";
		case  9: return "Dragons";
		case 10: return "Pegasi";
		case 11: return "Hippogriffs";
		case 12: return "Balrogs";
	}
};

oddTables.monsterSwimmer = function () {
	switch (dice.d12()) {
		case  1: return "Giant Crabs";
		case  2: return "Nixies";
		case  3: return "Giant Octopi";
		case  4: return "Giant Squid";
		case  5: return "Sea Monster";
		case  6: return "Giant Snakes";
		case  7: return "Crocodiles";
		case  8: return "Giant Leeches";
		case  9: return "Mermen";
		case 10: return "Nixies";
		case 11: return "Giant Fish";
		case 12: return "Dragon Turtle";
	}
};

oddTables.monsterUndead = function () {
	switch (dice.d8()) {
		case  1: return "Skeletons";
		case  2: return "Zombies";
		case  3: return "Ghouls";
		case  4: return "Wights";
		case  5: return "Wraiths";
		case  6: return "Mummies";
		case  7: return "Spectres";
		case  8: return "Vampires";
	}
};

oddTables.monsterHumanoid = function () {
	switch (dice.d12()) {
		case  1: return "Kobolds";
		case  2: return "Goblins";
		case  3: return "Orcs";
		case  4: return "Hobgoblins";
		case  5: return "Gnolls";
		case  6: return "Ogres";
		case  7: return "Trolls";
		case  8: return "Giants";
		case  9: return "Gnomes";
		case 10: return "Dwarves";
		case 11: return "Elves";
		case 12: return "Ents";
	}
};

oddTables.monsterLycanthrope = function () {
	switch (dice.d4()) {
		case  1: return "Werewolves";
		case  2: return "Wereboars";
		case  3: return "Weretigers";
		case  4: return "Werebears";
	}
};

oddTables.monsterDragon = function () {
	switch (dice.d12()) {
		case  1: return "Black Dragons";
		case  2: return "White Dragons";
		case  3: return "Green Dragons";
		case  4: return "Blue Dragons";
		case  5: return "Red Dragons";
		case  6: return "Gold Dragons";
		case  7: return "Cockatrices";
		case  8: return "Basilisks";
		case  9: return "Wyverns";
		case 10: return "Balrogs";
		case 11: return "Chimerae";
		case 12: return "Hydra (7-12 heads)";
	}
};

oddTables.monsterAnimal = function () {
	switch (dice.d12()) {
		case  1: return "Spiders";
		case  2: return "Centipedes";
		case  3: return "Lizards";
		case  4: return "Toads";
		case  5: return "Ants";
		case  6: return "Weasels";
		case  7: return "Apes";
		case  8: return "Beetles";
		case  9: return "Scorpions";
		case 10: return "Lions";
		case 11: return "Boars";
		case 12: return "Snakes";
	}
};

oddTables.monsterMiscFey = function () {
	switch (dice.d8()) {
		case  1: return "Centaurs";
		case  2: return "Unicorns";
		case  3: return "Minotaurs";
		case  4: return "Gorgons";
		case  5: return "Pixies";
		case  6: return "Manticores";
		case  7: return "Dryads";
		case  8: return "Medusae";
	}
};

oddTables.monsterMiscDino = function () {
	switch (dice.d8()) {
		case  1: return "Tyrannosaurus Rex";
		case  2: return "Pterodactyl";
		case  3: return "Triceratops";
		case  4: return "Brontosaurus";
		case  5: return "Stegosaurus";
		case  6: return "Tyrannosaurus Rex";
		case  7: return "Pterodactyl";
		case  8: return "Brontosaurus";
	}
};

oddTables.monsterBarsoom = function () {
	switch (dice.d12()) {
		case  1: return "Apts";
		case  2: return "Banths";
		case  3: return "Thoats";
		case  4: return "Calots";
		case  5: return "White Apes";
		case  6: return "Thoats";
		case  7: return "Orluks";
		case  8: return "Sith";
		case  9: return "Tharks";
		case 10: return "Darseen";
		case 11: return "Banths";
		case 12: return "Tharks";
	}
};

oddTables.monsterIceAge = function () {
	switch (dice.d12()) {
		case  1: return "Cave Bears";
		case  2: return "Dire Wolves";
		case  3: return "Sabre Tooth Tigers";
		case  4: return "Mastadons";
		case  5: return "Spotted Lions";
		case  6: return "Wooly Rhino";
		case  7: return "Titanotheres";
		case  8: return "Cave Bears";
		case  9: return "Mammoths";
		case 10: return "Sabre Tooth Tigers";
		case 11: return "Dire Wolves";
		case 12: return "Spotted Lions";
	}
};

oddTables.encounterClear = function () {
	switch (dice.d8()) {
		case 1: return oddTables.monsterHumanTypical();
		case 2: return oddTables.monsterFlyer();
		case 3: return oddTables.monsterHumanoid();
		case 4: return oddTables.monsterLycanthrope();
		case 5: return oddTables.monsterAnimal();
		case 6: return oddTables.monsterHumanTypical();
		case 7: return oddTables.monsterAnimal();
		case 8: return oddTables.monsterDragon();
	}
};

oddTables.encounterWoods = function () {
	switch (dice.d8()) {
		case 1: return oddTables.monsterHumanTypical();
		case 2: return oddTables.monsterFlyer();
		case 3: return oddTables.monsterHumanoid();
		case 4: return oddTables.monsterLycanthrope();
		case 5: return oddTables.monsterLycanthrope();
		case 6: return oddTables.monsterHumanTypical();
		case 7: return oddTables.monsterAnimal();
		case 8: return oddTables.monsterDragon();
	}
};

oddTables.encounterRiver = function () {
	switch (dice.d8()) {
		case 1: return oddTables.monsterHumanWater();
		case 2: return oddTables.monsterFlyer();
		case 3: return oddTables.monsterHumanoid();
		case 4: return oddTables.monsterLycanthrope();
		case 5: return oddTables.monsterSwimmer();
		case 6: return oddTables.monsterSwimmer();
		case 7: return oddTables.monsterAnimal();
		case 8: return oddTables.monsterDragon();
	}
};

oddTables.encounterSwamp = function () {
	switch (dice.d8()) {
		case 1: return oddTables.monsterHumanWater();
		case 2: return oddTables.monsterFlyer();
		case 3: return oddTables.monsterHumanoid();
		case 4: return oddTables.monsterLycanthrope();
		case 5: return oddTables.monsterSwimmer();
		case 6: return oddTables.monsterUndead();
		case 7: return oddTables.monsterUndead();
		case 8: return oddTables.monsterDragon();
	}
};

oddTables.encounterMountains = function () {
	switch (dice.d8()) {
		case 1: return oddTables.monsterHumanTypical();
		case 2: return oddTables.monsterFlyer();
		case 3: return oddTables.monsterHumanoid();
		case 4: return oddTables.monsterLycanthrope();
		case 5: return oddTables.monsterAnimal();
		case 6: return oddTables.monsterHumanoid();
		case 7: return oddTables.monsterDragon();
		case 8: return oddTables.monsterDragon();
	}
};

oddTables.encounterDesert = function () {
	switch (dice.d6()) {
		case 1: return oddTables.monsterHumanTypical();
		case 2: return oddTables.monsterFlyer();
		case 3: return oddTables.monsterHumanoid();
		case 4: return oddTables.monsterLycanthrope();
		case 5: return oddTables.monsterAnimal();
		case 6: return oddTables.monsterDragon();
	}
};

oddTables.encounterCity = function () {
	switch (dice.d4()) {
		case 1: return oddTables.monsterHumanTypical();
		case 2: return oddTables.monsterUndead();
		case 3: return oddTables.monsterUndead();
		case 4: return oddTables.monsterHumanTypical();
	}
};

oddTables.encounterMars = function () {
	switch (dice.d2()) {
		case 1: return oddTables.monsterHumanBarsoom();
		case 2: return oddTables.monsterBarsoom();
	}
};

oddTables.encounterLostWorld = function () {
	switch (dice.d3()) {
		case 1: return "Cave Men";
		case 2: return oddTables.monsterIceAge();
		case 3: return oddTables.monsterMiscDino();
	}
};

//NPCs

oddTables.abilityMod = function (abilityScore) {
	abilityScore = Math.floor((typeof abilityScore === "number") ? abilityScore : 10);
	if (abilityScore <= 5) {
		return -2;
	} else if (abilityScore <= 8) {
		return -1;
	} else if (abilityScore <= 12) {
		return 0;
	} else if (abilityScore <= 15) {
		return 1;
	} else {
		return 2;
	}
};

oddTables.npcAlignment = function () {
	switch (dice.d3()) {
		case 1: return "L";
		case 2: return "N";
		default: return "C";
	}	
};

oddTables.npcGender = function () {
	var roll = dice.d100();
	if (roll <= 1) {
		return "*";
	} else if (roll <= 50) {
		return "M";
	} else {
		return "F";
	}
};

oddTables.npcFighter = function (level, alignment, gender) {
	var output = "", i = 0, roll = 0, hp = 0, 
			title, name, gender, hd = 1, hpBonus = 0, ac, aStr, aInt, aWis, aCon, aDex, aCha, sword, armor = 0, shield = 0;
	level = Math.floor((typeof level === "number") ? level : 1);
	level = (level < 1 ? 1 : level);

	//randomly pick basics 
	if (!(alignment == "L" || alignment == "N" || alignment == "C")) {
		alignment = oddTables.npcAlignment();
	}
	
	if (!(gender == "M" || gender == "F")) {
		gender = oddTables.npcGender();
	}

	//get name
	if (gender == "M") {
		if (alignment == "L") {
			name = dice.pick(fightingManNames) + " the " + dice.pick(lawfulFightingManAmazonEpithets);
		}
		if (alignment == "N") {
			name = dice.pick(fightingManNames) + " the " + dice.pick(neutralFightingManAmazonEpithets);
		}
		if (alignment == "C") {
			name = dice.pick(fightingManNames) + " the " + dice.pick(chaoticFightingManAmazonEpithets);
		}
	}
	else if (gender == "F") {
		if (alignment == "L") {
			name = dice.pick(amazonNames) + " the " + dice.pick(lawfulFightingManAmazonEpithets);
		}
		if (alignment == "N") {
			name = dice.pick(amazonNames) + " the " + dice.pick(neutralFightingManAmazonEpithets);
		}
		if (alignment == "C") {
			name = dice.pick(amazonNames) + " the " + dice.pick(chaoticFightingManAmazonEpithets);
		}
	}

	//name = oddNames.fighterName();

	// determine basic level derivatives 
	switch (level) {
		case 1: 
			title = "Veteran";
			hd = 1;
			hpBonus = 1;
			break;
		case 2: 
			title = "Warrior";
			hd = 2;
			hpBonus = 0;
			break;
		case 3:
			title = "Swordsman";
			hd = 3;
			hpBonus = 0;
			break;
		case 4:
			title = "Hero";
			hd = 4;
			hpBonus = 0;
			break;
		case 5:
			title = "Swashbuckler";
			hd = 5;
			hpBonus = 1;
			break;
		case 6:
			title = "Myrmidon";
			hd = 6;
			hpBonus = 0;
			break;
		case 7:
			title = "Champion";
			hd = 7;
			hpBonus = 1;
			break;
		case 8:
			title = "Superhero";
			hd = 8;
			hpBonus = 2;
			break;
		case 9:
			title = "Lord";
			hd = 9;
			hpBonus = 3;
			break;
		default:
			title = "Lord";
			hd = 10;
			hpBonus = level - 9;
			break;
	}

	//roll ability scores
	aStr = dice.d6(3);
	aInt = dice.d6(3);
	aWis = dice.d6(3);
	aCon = dice.d6(3);
	aDex = dice.d6(3);
	aCha = dice.d6(3);

	//roll HP
	for (i = 0; i < hd; i++) {
		roll = dice.d6() + oddTables.abilityMod(aCon);
		roll = (roll < 1) ? 1 : roll;
		hp += roll;
	}
	hp += hpBonus;

	//generate magic items
	if (dice.percentChance(level * 5)) {
		sword = oddTables.magicSword();
	}
	if (dice.percentChance(level * 5)) {
		armor = oddTables.armorOnly();
	}
	if (dice.percentChance(level * 5)) {
		shield = oddTables.shieldOnly();
	}
	//OED version: sword, armor(+shield?), potion, misc.
	//default to +1, then half chance to increase by 1, repeating

	//calculate AC
	//assume plate & shield for base AC 2
	ac = 2 - armor - shield - oddTables.abilityMod(aDex);

	//generate output string
	output += title + " " + name + "\n";
	output += gender + " ";
	output += alignment + " ";
	output += "F" + level + " ";
	output += "S:" + aStr + " ";
	output += "I:" + aInt + " ";
	output += "W:" + aWis + " ";
	output += "C:" + aCon + " ";
	output += "D:" + aDex + " ";
	output += "X:" + aCha + " ";
	output += "HP:" + hp + " ";
	output += "AC:" + ac + " ";
	output += "\n";
	if (armor > 0) {
		output += "Armor +" + armor + "\n";
	}
	if (shield > 0) {
		output += "Shield +" + shield + "\n";
	}
	if (sword) {
		output += sword;
	}
	output = output.trim();
	output += "\n";
	return output;
};

oddTables.npcDwarf = function (level, alignment) {
	var output = "", i = 0, roll = 0, hp = 0, 
			title, name, gender, hd = 1, hpBonus = 0, ac, aStr, aInt, aWis, aCon, aDex, aCha, sword, armor = 0, shield = 0;
	level = Math.floor((typeof level === "number") ? level : 1);
	level = (level < 1 ? 1 : level);

	//randomly pick basics
	if (!(alignment == "L" || alignment == "N" || alignment == "C")) {
		alignment = "L";
	}
	gender = oddTables.npcGender();
	if (gender === "M" || gender === "*" && dice.flip()) {
		name = oddNames.masculineName();
	} else {
		name = oddNames.feminineName();
	}
	name += oddNames.epithet();

	// determine basic level derivatives 
	switch (level) {
		case 1: 
			title = "Dwarf Veteran";
			hd = 1;
			hpBonus = 1;
			break;
		case 2: 
			title = "Dwarf Warrior";
			hd = 2;
			hpBonus = 0;
			break;
		case 3:
			title = "Dwarf Swordsman";
			hd = 3;
			hpBonus = 0;
			break;
		case 4:
			title = "Dwarf Hero";
			hd = 4;
			hpBonus = 0;
			break;
		case 5:
			title = "Dwarf Swashbuckler";
			hd = 5;
			hpBonus = 1;
			break;
		default:
			title = "Dwarf Myrmidon";
			hd = 6;
			hpBonus = 0;
			break;
	}

	//roll ability scores
	aStr = dice.d6(3);
	aInt = dice.d6(3);
	aWis = dice.d6(3);
	aCon = dice.d6(3);
	aDex = dice.d6(3);
	aCha = dice.d6(3);

	//roll HP
	for (i = 0; i < hd; i++) {
		roll = dice.d6() + oddTables.abilityMod(aCon);
		roll = (roll < 1) ? 1 : roll;
		hp += roll;
	}
	hp += hpBonus;

	//generate magic items
	if (dice.percentChance(level * 5)) {
		sword = oddTables.magicSword();
	}
	if (dice.percentChance(level * 5)) {
		armor = oddTables.armorOnly();
	}
	if (dice.percentChance(level * 5)) {
		shield = oddTables.shieldOnly();
	}
	//OED version: sword, armor(+shield?), potion, misc.
	//default to +1, then half chance to increase by 1, repeating

	//calculate AC
	//assume plate & shield for base AC 2
	ac = 2 - armor - shield - oddTables.abilityMod(aDex);

	//generate output string
	output += title + " " + name + "\n";
	output += gender + " ";
	output += alignment + " ";
	output += "F" + level + " ";
	output += "S:" + aStr + " ";
	output += "I:" + aInt + " ";
	output += "W:" + aWis + " ";
	output += "C:" + aCon + " ";
	output += "D:" + aDex + " ";
	output += "X:" + aCha + " ";
	output += "HP:" + hp + " ";
	output += "AC:" + ac + " ";
	output += "\n";
	if (armor > 0) {
		output += "Armor +" + armor + "\n";
	}
	if (shield > 0) {
		output += "Shield +" + shield + "\n";
	}
	if (sword) {
		output += sword;
	}
	output = output.trim();
	output += "\n";
	return output;
};

oddTables.npcHalfling = function (level, alignment) {
	var output = "", i = 0, roll = 0, hp = 0, 
			title, name, gender, hd = 1, hpBonus = 0, ac, aStr, aInt, aWis, aCon, aDex, aCha, sword, armor = 0, shield = 0;
	level = Math.floor((typeof level === "number") ? level : 1);
	level = (level < 1 ? 1 : level);

	//randomly pick basics
	if (!(alignment == "L" || alignment == "N" || alignment == "C")) {
		alignment = "L";
	}
	gender = oddTables.npcGender();
	if (gender === "M" || gender === "*" && dice.flip()) {
		name = oddNames.masculineName();
	} else {
		name = oddNames.feminineName();
	}
	name += oddNames.epithet();

	// determine basic level derivatives 
	switch (level) {
		case 1: 
			title = "Halfling Veteran";
			hd = 1;
			hpBonus = 1;
			break;
		case 2: 
			title = "Halfling Warrior";
			hd = 2;
			hpBonus = 0;
			break;
		case 3:
			title = "Halfling Swordsman";
			hd = 3;
			hpBonus = 0;
			break;
		default:
			title = "Halfling Hero";
			hd = 4;
			hpBonus = 0;
			break;
	}

	//roll ability scores
	aStr = dice.d6(3);
	aInt = dice.d6(3);
	aWis = dice.d6(3);
	aCon = dice.d6(3);
	aDex = dice.d6(3);
	aCha = dice.d6(3);

	//roll HP
	for (i = 0; i < hd; i++) {
		roll = dice.d6() + oddTables.abilityMod(aCon);
		roll = (roll < 1) ? 1 : roll;
		hp += roll;
	}
	hp += hpBonus;

	//generate magic items
	if (dice.percentChance(level * 5)) {
		sword = oddTables.magicSword();
	}
	if (dice.percentChance(level * 5)) {
		armor = oddTables.armorOnly();
	}
	if (dice.percentChance(level * 5)) {
		shield = oddTables.shieldOnly();
	}
	//OED version: sword, armor(+shield?), potion, misc.
	//default to +1, then half chance to increase by 1, repeating

	//calculate AC
	//assume plate & shield for base AC 2
	ac = 2 - armor - shield - oddTables.abilityMod(aDex);

	//generate output string
	output += title + " " + name + "\n";
	output += gender + " ";
	output += alignment + " ";
	output += "F" + level + " ";
	output += "S:" + aStr + " ";
	output += "I:" + aInt + " ";
	output += "W:" + aWis + " ";
	output += "C:" + aCon + " ";
	output += "D:" + aDex + " ";
	output += "X:" + aCha + " ";
	output += "HP:" + hp + " ";
	output += "AC:" + ac + " ";
	output += "\n";
	if (armor > 0) {
		output += "Armor +" + armor + "\n";
	}
	if (shield > 0) {
		output += "Shield +" + shield + "\n";
	}
	if (sword) {
		output += sword;
	}
	output = output.trim();
	output += "\n";
	return output;
};

oddTables.npcThief = function (level, alignment) {
	var output = "", i = 0, roll = 0, hp = 0, 
			title, name, gender, hd = 1, hpBonus = 0, ac, aStr, aInt, aWis, aCon, aDex, aCha, sword, armor = 0, ring;
	level = Math.floor((typeof level === "number") ? level : 1);
	level = (level < 1 ? 1 : level);

	//randomly pick basics
	if (!(alignment == "L" || alignment == "N" || alignment == "C")) {
		alignment = oddTables.npcAlignment();
	}
	gender = oddTables.npcGender();
	if (gender === "M" || gender === "*" && dice.flip()) {
		name = oddNames.masculineName();
	} else {
		name = oddNames.feminineName();
	}
	name += oddNames.epithet();

	// determine basic level derivatives 
	switch (level) {
		case 1: 
			title = "Apprentice";
			hd = 1;
			hpBonus = 0;
			break;
		case 2: 
			title = "Footpad";
			hd = 2;
			hpBonus = 0;
			break;
		case 3:
			title = "Robber";
			hd = 3;
			hpBonus = 0;
			break;
		case 4:
			title = "Burglar";
			hd = 3;
			hpBonus = 1;
			break;
		case 5:
			title = "Cutpurse";
			hd = 4;
			hpBonus = 0;
			break;
		case 6:
			title = "Sharper";
			hd = 4;
			hpBonus = 1;
			break;
		case 7:
			title = "Pilferer";
			hd = 5;
			hpBonus = 0;
			break;
		case 8:
			title = "Master Pilferer";
			hd = 6;
			hpBonus = 0;
			break;
		case 9:
			title = "Thief";
			hd = 7;
			hpBonus = 0;
      break;
		default:
			title = "Master Thief";
			hd = 7;
			hpBonus = level - 9;
			break;
	}

	//roll ability scores
	aStr = dice.d6(3);
	aInt = dice.d6(3);
	aWis = dice.d6(3);
	aCon = dice.d6(3);
	aDex = dice.d6(3);
	aCha = dice.d6(3);

	//roll HP
	for (i = 0; i < hd; i++) {
		roll = dice.d6() + oddTables.abilityMod(aCon);
		roll = (roll < 1) ? 1 : roll;
		hp += roll;
	}
	hp += hpBonus;

	//generate magic items
	if (dice.percentChance(level * 5)) {
		sword = oddTables.magicSword();
	}
	if (dice.percentChance(level * 5)) {
		armor = oddTables.armorOnly();
	}
	if (dice.percentChance(level * 5)) {
		ring = oddTables.ring(true);
	}
	//OED version: sword, armor(+shield?), potion, misc.
	//default to +1, then half chance to increase by 1, repeating

	//calculate AC
	//assume leather for base AC 7
	ac = 7 - armor - oddTables.abilityMod(aDex);
	if (ring === "Ring of Protection") {
		ac = 2;
	}

	//generate output string
	output += title + " " + name + "\n";
	output += gender + " ";
	output += alignment + " ";
	output += "T" + level + " ";
	output += "S:" + aStr + " ";
	output += "I:" + aInt + " ";
	output += "W:" + aWis + " ";
	output += "C:" + aCon + " ";
	output += "D:" + aDex + " ";
	output += "X:" + aCha + " ";
	output += "HP:" + hp + " ";
	output += "AC:" + ac + " ";
	output += "\n";
	if (armor > 0) {
		output += "Leather Armor +" + armor + "\n";
	}
	if (ring) {
		output += ring + "\n";
	}
	if (sword) {
		output += sword;
	}
	output = output.trim();
	output += "\n";
	return output;
};

oddTables.npcCleric = function (level, alignment) {
	var output = "", i = 0, roll = 0, hp = 0, 
			title, name, gender, hd = 1, hpBonus = 0, ac, aStr, aInt, aWis, aCon, aDex, aCha, spells = [], sword, armor = 0, shield = 0;
	level = Math.floor((typeof level === "number") ? level : 1);
	level = (level < 1 ? 1 : level);
	
	//randomly pick basics
	if (!(alignment === "L" || alignment === "N" || alignment === "C")) {
		if (level >= 7) {
			alignment = dice.flip() ? "L" : "C";
		} else {
			alignment = oddTables.npcAlignment();
		}
	}
	gender = oddTables.npcGender();

	name = oddNames.clericName();

	// determine basic level derivatives 
	switch (level) {
		case 1: 
			title = alignment === "C" ? "Evil Acolyte" : "Acolyte";
			hd = 1;
			hpBonus = 0;
			break;
		case 2: 
			title = alignment === "C" ? "Evil Adept" : "Adept";
			hd = 2;
			hpBonus = 0;
			spells.push(alignment === "C" ? oddTables.spellBookEvil(1,1).join(", ") : oddTables.spellBookClr(1,1).join(", "));
			break;
		case 3:
			title = alignment === "C" ? "Evil Priest" : "Village Priest";
			hd = 3;
			hpBonus = 0;
			spells.push(alignment === "C" ? oddTables.spellBookEvil(1,2).join(", ") : oddTables.spellBookClr(1,2).join(", "));
			break;
		case 4:
			title = alignment === "C" ? "Shaman" : "Vicar";
			hd = 4;
			hpBonus = 0;
			spells.push(alignment === "C" ? oddTables.spellBookEvil(1,2).join(", ") : oddTables.spellBookClr(1,2).join(", "));
			spells.push(alignment === "C" ? oddTables.spellBookEvil(2,1).join(", ") : oddTables.spellBookClr(2,1).join(", "));
			break;
		case 5:
			title = alignment === "C" ? "Evil Curate" : "Curate";
			hd = 4;
			hpBonus = 1;
			spells.push(alignment === "C" ? oddTables.spellBookEvil(1,2).join(", ") : oddTables.spellBookClr(1,2).join(", "));
			spells.push(alignment === "C" ? oddTables.spellBookEvil(2,2).join(", ") : oddTables.spellBookClr(2,2).join(", "));
			break;
		case 6:
			title = alignment === "C" ? "Evil Bishop" : "Bishop";
			hd = 5;
			hpBonus = 0;
			spells.push(alignment === "C" ? oddTables.spellBookEvil(1,2).join(", ") : oddTables.spellBookClr(1,2).join(", "));
			spells.push(alignment === "C" ? oddTables.spellBookEvil(2,2).join(", ") : oddTables.spellBookClr(2,2).join(", "));
			spells.push(alignment === "C" ? oddTables.spellBookEvil(3,1).join(", ") : oddTables.spellBookClr(3,1).join(", "));
			spells.push(alignment === "C" ? oddTables.spellBookEvil(4,1).join(", ") : oddTables.spellBookClr(4,1).join(", "));
			break;
		case 7:
			title = alignment === "C" ? "Evil Lama" : "Lama";
			hd = 6;
			hpBonus = 0;
			spells.push(alignment === "C" ? oddTables.spellBookEvil(1,2).join(", ") : oddTables.spellBookClr(1,2).join(", "));
			spells.push(alignment === "C" ? oddTables.spellBookEvil(2,2).join(", ") : oddTables.spellBookClr(2,2).join(", "));
			spells.push(alignment === "C" ? oddTables.spellBookEvil(3,2).join(", ") : oddTables.spellBookClr(3,2).join(", "));
			spells.push(alignment === "C" ? oddTables.spellBookEvil(4,1).join(", ") : oddTables.spellBookClr(4,1).join(", "));
			spells.push(alignment === "C" ? oddTables.spellBookEvil(5,1).join(", ") : oddTables.spellBookClr(5,1).join(", "));
			break;
		case 8:
			title = alignment === "C" ? "Evil High Priest" : "Patriarch";
			hd = 7;
			hpBonus = 0;
			spells.push(alignment === "C" ? oddTables.spellBookEvil(1,2).join(", ") : oddTables.spellBookClr(1,2).join(", "));
			spells.push(alignment === "C" ? oddTables.spellBookEvil(2,2).join(", ") : oddTables.spellBookClr(2,2).join(", "));
			spells.push(alignment === "C" ? oddTables.spellBookEvil(3,2).join(", ") : oddTables.spellBookClr(3,2).join(", "));
			spells.push(alignment === "C" ? oddTables.spellBookEvil(4,2).join(", ") : oddTables.spellBookClr(4,2).join(", "));
			spells.push(alignment === "C" ? oddTables.spellBookEvil(5,2).join(", ") : oddTables.spellBookClr(5,2).join(", "));
			break;
		case 9:
			title = alignment === "C" ? "Evil High Priest" : "Patriarch";
			hd = 7;
			hpBonus = 1;
			spells.push(alignment === "C" ? oddTables.spellBookEvil(1,3).join(", ") : oddTables.spellBookClr(1,3).join(", "));
			spells.push(alignment === "C" ? oddTables.spellBookEvil(2,3).join(", ") : oddTables.spellBookClr(2,3).join(", "));
			spells.push(alignment === "C" ? oddTables.spellBookEvil(3,3).join(", ") : oddTables.spellBookClr(3,3).join(", "));
			spells.push(alignment === "C" ? oddTables.spellBookEvil(4,2).join(", ") : oddTables.spellBookClr(4,2).join(", "));
			spells.push(alignment === "C" ? oddTables.spellBookEvil(5,2).join(", ") : oddTables.spellBookClr(5,2).join(", "));
			break;
		default:
			title = alignment === "C" ? "Evil High Priest" : "Patriarch";
			hd = 7;
			hpBonus = level - 8;
			spells.push(alignment === "C" ? oddTables.spellBookEvil(1,3).join(", ") : oddTables.spellBookClr(1,3).join(", "));
			spells.push(alignment === "C" ? oddTables.spellBookEvil(2,3).join(", ") : oddTables.spellBookClr(2,3).join(", "));
			spells.push(alignment === "C" ? oddTables.spellBookEvil(3,3).join(", ") : oddTables.spellBookClr(3,3).join(", "));
			spells.push(alignment === "C" ? oddTables.spellBookEvil(4,3).join(", ") : oddTables.spellBookClr(4,3).join(", "));
			spells.push(alignment === "C" ? oddTables.spellBookEvil(5,3).join(", ") : oddTables.spellBookClr(5,3).join(", "));
			break;
	}

	//roll ability scores
	aStr = dice.d6(3);
	aInt = dice.d6(3);
	aWis = dice.d6(3);
	aCon = dice.d6(3);
	aDex = dice.d6(3);
	aCha = dice.d6(3);

	//roll HP
	for (i = 0; i < hd; i++) {
		roll = dice.d6() + oddTables.abilityMod(aCon);
		roll = (roll < 1) ? 1 : roll;
		hp += roll;
	}
	hp += hpBonus;

	//generate magic items
	if (dice.percentChance(level * 5)) {
		sword = oddTables.clericItem();
	}
	if (dice.percentChance(level * 5)) {
		armor = oddTables.armorOnly();
	}
	if (dice.percentChance(level * 5)) {
		shield = oddTables.shieldOnly();
	}
	//OED version: sword, armor(+shield?), potion, misc.
	//default to +1, then half chance to increase by 1, repeating

	//calculate AC
	//assume plate & shield for base AC 2
	ac = 2 - armor - shield - oddTables.abilityMod(aDex);

	//generate output string
	output += title + " " + name + "\n";
	output += gender + " ";
	output += alignment + " ";
	output += "C" + level + " ";
	output += "S:" + aStr + " ";
	output += "I:" + aInt + " ";
	output += "W:" + aWis + " ";
	output += "C:" + aCon + " ";
	output += "D:" + aDex + " ";
	output += "X:" + aCha + " ";
	output += "HP:" + hp + " ";
	output += "AC:" + ac + " ";
	output += "\n";
	if (armor > 0) {
		output += "Armor +" + armor + "\n";
	}
	if (shield > 0) {
		output += "Shield +" + shield + "\n";
	}
	if (sword) {
		output += sword + "\n";
	}
	output += "spellbook: " + spells.join("\n") + "\n";
	output = output.trim();
	output += "\n";
	return output;
};

oddTables.npcWizard = function (level, alignment) {
	var output = "", i = 0, roll = 0, hp = 0, 
			title, name, gender, hd = 1, hpBonus = 0, ac, aStr, aInt, aWis, aCon, aDex, aCha, spells = [], sword, ring, miscItem;
	level = Math.floor((typeof level === "number") ? level : 1);
	level = (level < 1 ? 1 : level);
	
	//randomly pick basics
	if (!(alignment == "L" || alignment == "N" || alignment == "C")) {
		alignment = oddTables.npcAlignment();
	}
	gender = oddTables.npcGender();
	name = oddNames.magicUserName();

	// determine basic level derivatives 
	// determine basic level derivatives 
	switch (level) {
		case 1: 
			title = "Medium";
			hd = 1;
			hpBonus = 0;
			spells.push(oddTables.spellBookMu(1,1).join(", "));
			break;
		case 2: 
			title = "Seer";
			hd = 1;
			hpBonus = 1;
			spells.push(oddTables.spellBookMu(1,2).join(", "));
			break;
		case 3:
			title = "Conjurer";
			hd = 2;
			hpBonus = 0;
			spells.push(oddTables.spellBookMu(1,3).join(", "));
			spells.push(oddTables.spellBookMu(2,1).join(", "));
			break;
		case 4:
			title = "Theurgist";
			hd = 2;
			hpBonus = 1;
			spells.push(oddTables.spellBookMu(1,4).join(", "));
			spells.push(oddTables.spellBookMu(2,2).join(", "));
			break;
		case 5:
			title = "Thaumaturgist";
			hd = 3;
			hpBonus = 0;
			spells.push(oddTables.spellBookMu(1,4).join(", "));
			spells.push(oddTables.spellBookMu(2,2).join(", "));
			spells.push(oddTables.spellBookMu(3,1).join(", "));
			break;
		case 6:
			title = "Magician";
			hd = 3;
			hpBonus = 1;
			spells.push(oddTables.spellBookMu(1,4).join(", "));
			spells.push(oddTables.spellBookMu(2,2).join(", "));
			spells.push(oddTables.spellBookMu(3,2).join(", "));
			break;
		case 7:
			title = "Enchanter";
			hd = 4;
			hpBonus = 0;
			spells.push(oddTables.spellBookMu(1,4).join(", "));
			spells.push(oddTables.spellBookMu(2,3).join(", "));
			spells.push(oddTables.spellBookMu(3,2).join(", "));
			spells.push(oddTables.spellBookMu(4,1).join(", "));
			break;
		case 8:
			title = "Warlock";
			hd = 5;
			hpBonus = 0;
			spells.push(oddTables.spellBookMu(1,4).join(", "));
			spells.push(oddTables.spellBookMu(2,3).join(", "));
			spells.push(oddTables.spellBookMu(3,3).join(", "));
			spells.push(oddTables.spellBookMu(4,2).join(", "));
			break;
		case 9:
			title = "Sorcerer";
			hd = 6;
			hpBonus = 1;
			spells.push(oddTables.spellBookMu(1,4).join(", "));
			spells.push(oddTables.spellBookMu(2,3).join(", "));
			spells.push(oddTables.spellBookMu(3,3).join(", "));
			spells.push(oddTables.spellBookMu(4,2).join(", "));
			spells.push(oddTables.spellBookMu(5,1).join(", "));
			break;
		case 10: 
			title = "Necromancer";
			hd = 7;
			hpBonus = 0;
			spells.push(oddTables.spellBookMu(1,4).join(", "));
			spells.push(oddTables.spellBookMu(2,4).join(", "));
			spells.push(oddTables.spellBookMu(3,3).join(", "));
			spells.push(oddTables.spellBookMu(4,3).join(", "));
			spells.push(oddTables.spellBookMu(5,2).join(", "));
			break;
		case 11: 
			title = "Wizard";
			hd = 8;
			hpBonus = 1;
			spells.push(oddTables.spellBookMu(1,4).join(", "));
			spells.push(oddTables.spellBookMu(2,4).join(", "));
			spells.push(oddTables.spellBookMu(3,4).join(", "));
			spells.push(oddTables.spellBookMu(4,3).join(", "));
			spells.push(oddTables.spellBookMu(5,3).join(", "));
			break;
		case 12: 
			title = "Wizard";
			hd = 8;
			hpBonus = 2;
			spells.push(oddTables.spellBookMu(1,4).join(", "));
			spells.push(oddTables.spellBookMu(2,4).join(", "));
			spells.push(oddTables.spellBookMu(3,4).join(", "));
			spells.push(oddTables.spellBookMu(4,4).join(", "));
			spells.push(oddTables.spellBookMu(5,4).join(", "));
			spells.push(oddTables.spellBookMu(6,1).join(", "));
			break;
		case 13: 
			title = "Wizard";
			hd = 8;
			hpBonus = 3;
			spells.push(oddTables.spellBookMu(1,5).join(", "));
			spells.push(oddTables.spellBookMu(2,5).join(", "));
			spells.push(oddTables.spellBookMu(3,5).join(", "));
			spells.push(oddTables.spellBookMu(4,4).join(", "));
			spells.push(oddTables.spellBookMu(5,4).join(", "));
			spells.push(oddTables.spellBookMu(6,2).join(", "));
			break;
		case 14: 
			title = "Wizard";
			hd = 8;
			hpBonus = 3;
			spells.push(oddTables.spellBookMu(1,5).join(", "));
			spells.push(oddTables.spellBookMu(2,5).join(", "));
			spells.push(oddTables.spellBookMu(3,5).join(", "));
			spells.push(oddTables.spellBookMu(4,4).join(", "));
			spells.push(oddTables.spellBookMu(5,4).join(", "));
			spells.push(oddTables.spellBookMu(6,3).join(", "));
			break;
		case 15: 
			title = "Wizard";
			hd = 9;
			hpBonus = 1;
			spells.push(oddTables.spellBookMu(1,5).join(", "));
			spells.push(oddTables.spellBookMu(2,5).join(", "));
			spells.push(oddTables.spellBookMu(3,5).join(", "));
			spells.push(oddTables.spellBookMu(4,4).join(", "));
			spells.push(oddTables.spellBookMu(5,4).join(", "));
			spells.push(oddTables.spellBookMu(6,4).join(", "));
			break;
		default:
			title = "Wizard";
			hd = 9;
			hpBonus = level - 14;
			spells.push(oddTables.spellBookMu(1,5).join(", "));
			spells.push(oddTables.spellBookMu(2,5).join(", "));
			spells.push(oddTables.spellBookMu(3,5).join(", "));
			spells.push(oddTables.spellBookMu(4,5).join(", "));
			spells.push(oddTables.spellBookMu(5,5).join(", "));
			spells.push(oddTables.spellBookMu(6,5).join(", "));
			break;
	}

	//roll ability scores
	aStr = dice.d6(3);
	aInt = dice.d6(3);
	aWis = dice.d6(3);
	aCon = dice.d6(3);
	aDex = dice.d6(3);
	aCha = dice.d6(3);

	//roll HP
	for (i = 0; i < hd; i++) {
		roll = dice.d6() + oddTables.abilityMod(aCon);
		roll = (roll < 1) ? 1 : roll;
		hp += roll;
	}
	hp += hpBonus;

	//generate magic items
	if (dice.percentChance(level * 5)) {
		sword = oddTables.wand();
	}
	if (dice.percentChance(level * 5)) {
		ring = oddTables.ring(true);
	}
	if (dice.percentChance(level * 5)) {
		miscItem = oddTables.miscMagic();
	}
	//OED version: sword, armor(+shield?), potion, misc.
	//default to +1, then half chance to increase by 1, repeating

	//calculate AC
	//assume no armor for base AC 9
	if (ring === "Ring of Protection") {
		ac = 2;
	} else {
		ac = 9;
	}

	//generate output string
	output += title + " " + name + "\n";
	output += gender + " ";
	output += alignment + " ";
	output += "M" + level + " ";
	output += "S:" + aStr + " ";
	output += "I:" + aInt + " ";
	output += "W:" + aWis + " ";
	output += "C:" + aCon + " ";
	output += "D:" + aDex + " ";
	output += "X:" + aCha + " ";
	output += "HP:" + hp + " ";
	output += "AC:" + ac + " ";
	output += "\n";
	if (ring) {
		output += ring + "\n";
	}
	if (miscItem > 0) {
		output += miscItem + "\n";
	}
	if (sword) {
		output += sword + "\n";
	}
	output += "spellbook: " + spells.join("\n") + "\n";
	output = output.trim();
	output += "\n";
	return output;
};

oddTables.npcElf = function (level, alignment) {
	var output = "", i = 0, roll = 0, hp = 0, 
			title, name, gender, hd = 1, hpBonus = 0, ac, aStr, aInt, aWis, aCon, aDex, aCha, spells = [], sword, ring, miscItem;
	level = Math.floor((typeof level === "number") ? level : 1);
	level = (level < 1 ? 1 : level);
	
	//randomly pick basics
	if (!(alignment == "L" || alignment == "N" || alignment == "C")) {
		alignment = "L";
	}
	gender = oddTables.npcGender();
	if (gender === "M" || gender === "*" && dice.flip()) {
		name = oddNames.masculineName();
	} else {
		name = oddNames.feminineName();
	}
	name += oddNames.epithet();

	// determine basic level derivatives 
	switch (level) {
		case 1: 
			title = "Elf Veteran-Medium";
			hd = 1;
			hpBonus = 0;
			spells.push(oddTables.spellBookMu(1,1).join(", "));
			break;
		case 2: 
			title = "Elf Warrior-Seer";
			hd = 1;
			hpBonus = 1;
			spells.push(oddTables.spellBookMu(1,2).join(", "));
			break;
		case 3:
			title = "Elf Swordsman-Conjurer";
			hd = 2;
			hpBonus = 0;
			spells.push(oddTables.spellBookMu(1,3).join(", "));
			spells.push(oddTables.spellBookMu(2,1).join(", "));
			break;
		case 4:
			title = "Elf Hero-Theurgist";
			hd = 2;
			hpBonus = 1;
			spells.push(oddTables.spellBookMu(1,4).join(", "));
			spells.push(oddTables.spellBookMu(2,2).join(", "));
			break;
		case 5:
			title = "Elf Hero-Thaumaturgist";
			hd = 3;
			hpBonus = 0;
			spells.push(oddTables.spellBookMu(1,4).join(", "));
			spells.push(oddTables.spellBookMu(2,2).join(", "));
			spells.push(oddTables.spellBookMu(3,1).join(", "));
			break;
		case 6:
			title = "Elf Hero-Magician";
			hd = 3;
			hpBonus = 1;
			spells.push(oddTables.spellBookMu(1,4).join(", "));
			spells.push(oddTables.spellBookMu(2,2).join(", "));
			spells.push(oddTables.spellBookMu(3,2).join(", "));
			break;
		case 7:
			title = "Elf Hero-Enchanter";
			hd = 4;
			hpBonus = 0;
			spells.push(oddTables.spellBookMu(1,4).join(", "));
			spells.push(oddTables.spellBookMu(2,3).join(", "));
			spells.push(oddTables.spellBookMu(3,2).join(", "));
			spells.push(oddTables.spellBookMu(4,1).join(", "));
			break;
		default:
			title = "Elf Hero-Warlock";
			hd = 5;
			hpBonus = 0;
			spells.push(oddTables.spellBookMu(1,4).join(", "));
			spells.push(oddTables.spellBookMu(2,3).join(", "));
			spells.push(oddTables.spellBookMu(3,3).join(", "));
			spells.push(oddTables.spellBookMu(4,2).join(", "));
			break;
	}

	//roll ability scores
	aStr = dice.d6(3);
	aInt = dice.d6(3);
	aWis = dice.d6(3);
	aCon = dice.d6(3);
	aDex = dice.d6(3);
	aCha = dice.d6(3);

	//roll HP
	for (i = 0; i < hd; i++) {
		roll = dice.d6() + oddTables.abilityMod(aCon);
		roll = (roll < 1) ? 1 : roll;
		hp += roll;
	}
	hp += hpBonus;

	//generate magic items
	if (dice.percentChance(level * 5)) {
		sword = oddTables.wand();
	}
	if (dice.percentChance(level * 5)) {
		ring = oddTables.ring(true);
	}
	if (dice.percentChance(level * 5)) {
		miscItem = oddTables.miscMagic();
	}
	//OED version: sword, armor(+shield?), potion, misc.
	//default to +1, then half chance to increase by 1, repeating

	//calculate AC
	//assume no armor for base AC 9
	if (ring === "Ring of Protection") {
		ac = 2;
	} else {
		ac = 5; //default elf AC
	}

	//generate output string
	output += title + " " + name + "\n";
	output += gender + " ";
	output += alignment + " ";
	output += "M" + level + " ";
	output += "S:" + aStr + " ";
	output += "I:" + aInt + " ";
	output += "W:" + aWis + " ";
	output += "C:" + aCon + " ";
	output += "D:" + aDex + " ";
	output += "X:" + aCha + " ";
	output += "HP:" + hp + " ";
	output += "AC:" + ac + " ";
	output += "\n";
	if (ring) {
		output += ring + "\n";
	}
	if (miscItem > 0) {
		output += miscItem + "\n";
	}
	if (sword) {
		output += sword + "\n";
	}
	output += "spellbook: " + spells.join("\n") + "\n";
	output = output.trim();
	output += "\n";
	return output;
};

oddTables.npcElfTwoLevels = function (levelFighter, levelMagic, alignment) {
	var output = "", i = 0, roll = 0, hp = 0, 
			title, name, gender, hd = 1, hpBonus = 0, ac, aStr, aInt, aWis, aCon, aDex, aCha, spells = [], sword, ring, miscItem;
	levelFighter = Math.floor((typeof levelFighter === "number") ? levelFighter : 1);
	levelFighter = (levelFighter < 1 ? 1 : levelFighter);
	levelFighter = (levelFighter > 4 ? 4 : levelFighter);

	levelMagic = Math.floor((typeof levelMagic === "number") ? levelMagic : 1);
	levelMagic = (levelMagic < 1 ? 1 : levelMagic);
	levelMagic = (levelMagic > 8 ? 8 : levelMagic);
	
	//randomly pick basics
	if (!(alignment == "L" || alignment == "N" || alignment == "C")) {
		alignment = "L";
	}
	gender = oddTables.npcGender();
	if (gender === "M" || gender === "*" && dice.flip()) {
		name = oddNames.masculineName();
	} else {
		name = oddNames.feminineName();
	}
	name += oddNames.epithet();

	// determine basic level derivatives 
	switch (levelFighter) {
		case 1: 
			title = "Veteran";
			hd = 1;
			hpBonus = 1;
			break;
		case 2: 
			title = "Warrior";
			hd = 2;
			hpBonus = 0;
			break;
		case 3:
			title = "Swordsman";
			hd = 3;
			hpBonus = 0;
			break;
		default:
			title = "Hero";
			hd = 4;
			hpBonus = 0;
			break;
	}
	switch (levelMagic) {
		case 1: 
			title = title + "-Medium";
			spells.push(oddTables.spellBookMu(1,1).join(", "));
			break;
		case 2: 
			title = title + "-Seer";
			spells.push(oddTables.spellBookMu(1,2).join(", "));
			break;
		case 3:
			title = title + "-Conjurer";
			if (hd < 2) {
				hd = 2;
				hpBonus = 0;
			}
			spells.push(oddTables.spellBookMu(1,3).join(", "));
			spells.push(oddTables.spellBookMu(2,1).join(", "));
			break;
		case 4:
			title = title + "-Theurgist";
			if (hd < 2) {
				hd = 2;
				hpBonus = 1;
			}
			spells.push(oddTables.spellBookMu(1,4).join(", "));
			spells.push(oddTables.spellBookMu(2,2).join(", "));
			break;
		case 5:
			title = title + "-Thaumaturgist";
			if (hd < 3) {
				hd = 3;
				hpBonus = 0;
			}
			spells.push(oddTables.spellBookMu(1,4).join(", "));
			spells.push(oddTables.spellBookMu(2,2).join(", "));
			spells.push(oddTables.spellBookMu(3,1).join(", "));
			break;
		case 6:
			title = title + "-Magician";
			if (hd < 3) {
				hd = 3;
				hpBonus = 1;
			}
			spells.push(oddTables.spellBookMu(1,4).join(", "));
			spells.push(oddTables.spellBookMu(2,2).join(", "));
			spells.push(oddTables.spellBookMu(3,2).join(", "));
			break;
		case 7:
			title = title + "-Enchanter";
			if (hd < 4) {
				hd = 4;
				hpBonus = 0;
			}
			spells.push(oddTables.spellBookMu(1,4).join(", "));
			spells.push(oddTables.spellBookMu(2,3).join(", "));
			spells.push(oddTables.spellBookMu(3,2).join(", "));
			spells.push(oddTables.spellBookMu(4,1).join(", "));
			break;
		default:
			title = title + "-Warlock";
			if (hd < 5) {
				hd = 5;
				hpBonus = 0;
			}
			spells.push(oddTables.spellBookMu(1,4).join(", "));
			spells.push(oddTables.spellBookMu(2,3).join(", "));
			spells.push(oddTables.spellBookMu(3,3).join(", "));
			spells.push(oddTables.spellBookMu(4,2).join(", "));
			break;
	}

	//roll ability scores
	aStr = dice.d6(3);
	aInt = dice.d6(3);
	aWis = dice.d6(3);
	aCon = dice.d6(3);
	aDex = dice.d6(3);
	aCha = dice.d6(3);

	//roll HP
	for (i = 0; i < hd; i++) {
		roll = dice.d6() + oddTables.abilityMod(aCon);
		roll = (roll < 1) ? 1 : roll;
		hp += roll;
	}
	hp += hpBonus;

	//generate magic items
	if (dice.percentChance(levelMagic * 5)) {
		sword = oddTables.wand();
	}
	if (dice.percentChance(levelMagic * 5)) {
		ring = oddTables.ring(true);
	}
	if (dice.percentChance(levelMagic * 5)) {
		miscItem = oddTables.miscMagic();
	}
	//OED version: sword, armor(+shield?), potion, misc.
	//default to +1, then half chance to increase by 1, repeating

	//calculate AC
	//assume no armor for base AC 9
	if (ring === "Ring of Protection") {
		ac = 2;
	} else {
		ac = 5; //default elf AC, presumably mail
	}

	//generate output string
	output += title + " " + name + "\n";
	output += gender + " ";
	output += alignment + " ";
	output += "F" + levelFighter + "/M" + levelMagic + " ";
	output += "S:" + aStr + " ";
	output += "I:" + aInt + " ";
	output += "W:" + aWis + " ";
	output += "C:" + aCon + " ";
	output += "D:" + aDex + " ";
	output += "X:" + aCha + " ";
	output += "HP:" + hp + " ";
	output += "AC:" + ac + " ";
	output += "\n";
	if (ring) {
		output += ring + "\n";
	}
	if (miscItem > 0) {
		output += miscItem + "\n";
	}
	if (sword) {
		output += sword + "\n";
	}
	output += "spellbook: " + spells.join("\n") + "\n";
	output = output.trim();
	output += "\n";
	return output;
};

//OED Fighter Feats: 1 per 4 levels, starting at 4
//OED Wizard spells: 4-10 per usable spell level (2d4+2?)
//OED Wizard items: potion, scroll, wand, misc.
//OED Thief items: same as fighter


//castle encounters
oddTables.castleEncounter = function () {
	var result, roll1, roll2;
	result = "";
	//if (preferences.clericCastles && preferences.thiefCastles) {
	//	roll1 = dice.d8();
	// } else if (preferences.clericCastles) {
	// 	roll1 = dice.d6();
	// } else if (preferences.thiefCastles) {
	// 	roll1 = dice.d6();
	// 	if (roll1 >= 5) {
	// 		roll1 += 2;
	// 	}
	// } else {
	// 	roll1 = dice.d4();
	// }
	roll1 = dice.d6();
	roll2 = dice.d4();
	if (roll1 === 1) {
		//Lord
		result += oddNames.castleName() + ", castle of the ";
		result += oddTables.npcFighter(9).trim();
		if (roll2 === 1) {
			result += "\n\t" + dice.d8() + " Champions";
		} else if (roll2 === 2) {
			result += "\n\t" + dice.d6() + " Griffons ridden by Heroes";
		} else if (roll2 === 3) {
			result += "\n\t" + dice.d10() + " Myrmidons";
		} else {
			result += "\n\t" + dice.d4() + " Giants";
		}
		if (dice.percentChance(25)) {
			result += "\n\tLevel " + (dice.d4()+4) + " Magic User";
		}
		if (dice.percentChance(50)) {
			result += "\n\tLevel " + (dice.d4()+2) + " Cleric";
		}
		result += "\n\t" + (dice.d6(3) * 10) + " Men-at-Arms";
	} else if (roll1 === 2) {
		//Superhero
		result += oddNames.castleName() + ", castle of the ";
		result += oddTables.npcFighter(8).trim();
		if (roll2 === 1) {
			result += "\n\t" + dice.d8() + " Myrmidons";
		} else if (roll2 === 2) {
			result += "\n\t" + dice.d4() + " Rocs ridden by Heroes";
		} else if (roll2 === 3) {
			result += "\n\t" + dice.d4() + " Ogres";
		} else {
			result += "\n\t" + dice.d10() + " S'bucks";
		}
		if (dice.percentChance(25)) {
			result += "\n\tLevel " + (dice.d4()+4) + " Magic User";
		}
		if (dice.percentChance(50)) {
			result += "\n\tLevel " + (dice.d4()+2) + " Cleric";
		}
		result += "\n\t" + (dice.d6(3) * 10) + " Men-at-Arms";
	} else if (roll1 === 3) {
		//Wizard
		result += oddNames.castleName() + ", castle of the ";
		result += oddTables.npcWizard(11).trim();
		if (roll2 === 1) {
			result += "\n\t" + dice.d4() + " Dragons";
		} else if (roll2 === 2) {
			result += "\n\t" + dice.d4() + " Balrogs";
		} else if (roll2 === 3) {
			result += "\n\t" + dice.d4() + " Wyverns";
		} else {
			result += "\n\t" + dice.d4() + " Basilisks";
		}
		if (dice.percentChance(25)) {
			result += "\n\tLevel " + (dice.d4()+4) + " Fighting-Man";
		}
		if (dice.percentChance(50)) {
			result += "\n\tLevel " + (dice.d4()+3) + " Apprentice Magic-User";
		}
		result += "\n\t" + (dice.d6(3) * 10) + " Men-at-Arms";
	} else if (roll1 === 4) {
		//Necromancer
		result += oddNames.castleName() + ", castle of the ";
		result += oddTables.npcWizard(10).trim();
		if (roll2 === 1) {
			result += "\n\t" + dice.d4() + " Chimerae";
		} else if (roll2 === 2) {
			result += "\n\t" + dice.d6() + " Manticores";
		} else if (roll2 === 3) {
			result += "\n\t" + dice.d12() + " Lycanthropes";
		} else {
			result += "\n\t" + dice.d12() + " Gargoyles";
		}
		if (dice.percentChance(25)) {
			result += "\n\tLevel " + (dice.d4()+4) + " Fighting-Man";
		}
		if (dice.percentChance(50)) {
			result += "\n\tLevel " + (dice.d4()+3) + " Apprentice Magic-User";
		}
		result += "\n\t" + (dice.d6(3) * 10) + " Men-at-Arms";
	} else if (roll1 === 5) {
		//Patriarch
		result += oddNames.castleName() + ", castle of the ";
		result += oddTables.npcCleric(8,"L").trim();
		if (roll2 === 1) {
			result += "\n\t" + dice.d20() + " Heroes";
		} else if (roll2 === 2) {
			result += "\n\t" + dice.d6() + " Superheros";
		} else if (roll2 === 3) {
			result += "\n\t" + dice.d10() + " Ents";
		} else {
			result += "\n\t" + dice.d8() + " Hippogriffs ridden by Heros";
		}
		if (dice.percentChance(50)) {
			result += "\n\t" + dice.d6() + " Level " + (dice.d4()+3) + " Assistant Clerics";
		}
		result += "\n\t" + (dice.d6(3) * 10) + " Men-at-Arms";
	} else if (roll1 === 6) {
		//Evil High Priest
		result += oddNames.castleName() + ", castle of the ";
		result += oddTables.npcCleric(8,"C").trim();
		if (roll2 === 1) {
			result += "\n\t" + dice.d10() + " Trolls";
		} else if (roll2 === 2) {
			result += "\n\t" + dice.d6() + " Vampires";
		} else if (roll2 === 3) {
			result += "\n\t" + dice.d20() + " White Apes";
		} else {
			result += "\n\t" + dice.d10() + " Spectres";
		}
		if (dice.percentChance(50)) {
			result += "\n\t" + dice.d6() + " Level " + (dice.d4()+3) + " Assistant Clerics";
		}
		result += "\n\t" + (dice.d6(3) * 10) + " Men-at-Arms";
	//Delta's Castles & Cutpurses http://deltasdnd.blogspot.com/2012/07/castles-cutpurses
	} else if (roll1 === 7) {
		//Master Thief
		result += oddNames.castleName() + ", castle of the ";
		result += oddTables.npcThief(10).trim();
		if (roll2 === 1) {
			result += "\n\t" + dice.d8() + " Master Pilferers";
		} else if (roll2 === 2) {
			result += "\n\t" + dice.d8() + " Pilferers";
		} else if (roll2 === 3) {
			result += "\n\t" + dice.d8() + " doppelgangers";
		} else {
			result += "\n\t" + dice.d6() + " Elven Hero-Theurgists";
		}
		if (dice.percentChance(25)) {
			result += "\n\tLevel " + (dice.d4()+4) + " Magic User";
		}
		result += "\n\t" + (dice.d6(3) * 10) + " Men-at-Arms";
	} else if (roll1 === 8) {
		//Thief
		result += oddNames.castleName() + ", castle of the ";
		result += oddTables.npcThief(9).trim();
		if (roll2 === 1) {
			result += "\n\t" + dice.d8() + " Pilferers";
		} else if (roll2 === 2) {
			result += "\n\t" + dice.d10() + " Sharpers";
		} else if (roll2 === 3) {
			result += "\n\t" + dice.d12() + " wererats";
		} else {
			result += "\n\t" + dice.d8() + " bugbears";
		}
		if (dice.percentChance(25)) {
			result += "\n\tLevel " + (dice.d4()+4) + " Magic User";
		}
		result += "\n\t" + (dice.d6(3) * 10) + " Men-at-Arms";
	}
	return result.trim() + "\n";
};
