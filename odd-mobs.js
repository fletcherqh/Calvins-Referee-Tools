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

/* global dice, oddTables, oddNames */

/* monster prototype */
function Monster (name, plural, alignment, armorClass, move, auxMove, hitDice, hitMod, damage, damageMod, lairChance, treasureType) {
	this.name = name;
	this.plural = plural;
	this.alignment = alignment;
	this.armorClass = armorClass;
	this.move = move;
	this.auxMove = auxMove;
	this.hitDice = hitDice;
	this.hitMod = hitMod;
	this.damage = damage;
	this.damageMod = damageMod;
	this.lairChance = lairChance;
	this.treasureType = treasureType;
}

Monster.prototype.shortDesc = function (number) {
	var statline;
	if (typeof number === "number") {
		if (number === 1) {
			statline = 1 + " " + this.name;
		} else {
			statline = number + " " + this.plural;
		}
	} else {
		statline = this.name;
	}
	statline += " (" +
		this.alignment + " " +
		"Mv" + this.move + (this.auxMove ? "/" + this.auxMove : "") + " " +
		this.armorClass + "AC " +
		this.hitDice + (this.hitMod ? "+" + this.hitMod : "") + "HD" + " " +
		this.damage + "d6" + (this.damageMod ? "+" + this.damageMod : "") +
		")";
	return statline;
};

Monster.prototype.toString = function () {
	return this.name +
		" AL:" + this.alignment +
		" HD:" + this.hitDice + (this.hitMod ? "+" + this.hitMod : "") +
		" AC:" + this.armorClass +
		" Dam:" + this.damage + "d6" + (this.damageMod ? "+" + this.damageMod : "") +
		" Mv:" + this.move + (this.auxMove ? "/" + this.auxMove : "") +
		" lair" + this.lairChance + "%"; 
}; 

/* basic monster library */
var oddMonsters = {
	'version': '0.1',
};

//no armor, probably armed with spears and darts or slings
oddMonsters.levy = new Monster("levy", "levies", "LNC", 9, 12, 0, 1, 0, 1, 0, 15, oddTables.treasureTypeA);
//leather & shield
oddMonsters.lightfoot = new Monster("light foot", "light foot", "LNC", 6, 12, 0, 1, 0, 1, 0, 15, oddTables.treasureTypeA);
//mail & shield, throwing axes or spears
oddMonsters.heavyfoot = new Monster("heavy foot", "heavy foot", "LNC", 4, 9, 0, 1, 0, 1, 0, 15, oddTables.treasureTypeA);
//plate & shield
oddMonsters.armoredfoot = new Monster("armored foot", "armored foot", "LNC", 2, 6, 0, 1, 0, 1, 0, 15, oddTables.treasureTypeA);
//leather, short bow
oddMonsters.archer = new Monster("archer", "archers", "LNC", 7, 12, 0, 1, 0, 1, 0, 15, oddTables.treasureTypeA);
//leather, light crossbow
oddMonsters.crossbow = new Monster("crossbow", "crossbows", "LNC", 7, 12, 0, 1, 0, 1, 0, 15, oddTables.treasureTypeA);
//mail, heavy crossbow
oddMonsters.heavycrossbow = new Monster("heavy crossbow", "heavy crossbows", "LNC", 5, 9, 0, 1, 0, 1, 0, 15, oddTables.treasureTypeA);
//leather & shield, light war horse, no barding
oddMonsters.lightcavalry = new Monster("light cavalry", "light cavalry", "LNC", 6, 24, 0, 1, 0, 1, 0, 15, oddTables.treasureTypeA);
//leather, short bow, light war horse, no barding
oddMonsters.lightcavalryarcher = new Monster("light horse archer", "light horse archers", "LNC", 7, 24, 0, 1, 0, 1, 0, 15, oddTables.treasureTypeA);
//mail & shield, medium war horse, no barding
oddMonsters.mediumcavalry = new Monster("medium cavalry", "medium cavalry", "LNC", 4, 18, 0, 1, 0, 1, 0, 15, oddTables.treasureTypeA);
//mail, short bow, medium war horse, no barding
oddMonsters.mediumcavalryarcher = new Monster("medium horse archer", "medium horse archer", "LNC", 5, 18, 0, 1, 0, 1, 0, 15, oddTables.treasureTypeA);
//plate & shield, heavy war horse, barding
oddMonsters.heavycavalry = new Monster("heavy cavalry", "medium cavalry", "LNC", 2, 12, 0, 1, 0, 1, 0, 15, oddTables.treasureTypeA);


oddMonsters.bandit = new Monster("bandit", "bandits", "NC", 7, 12, 0, 1, 0, 1, 0, 15, oddTables.treasureTypeA);
oddMonsters.berserker = new Monster("berserker", "berserkers", "N", 7, 12, 0, 1, 1, 1, 0, 15, oddTables.treasureTypeA);
oddMonsters.brigand = new Monster("brigand", "brigands", "C", 7, 12, 0, 1, 0, 1, 0, 15, oddTables.treasureTypeA);
oddMonsters.nomad = new Monster("nomad", "nomads", "NC", 7, 12, 0, 1, 0, 1, 0, 15, oddTables.treasureTypeADesert);
oddMonsters.dervish = new Monster("dervish", "dervishes", "L", 7, 12, 0, 1, 0, 1, 0, 15, oddTables.treasureTypeADesert);
oddMonsters.buccaneer = new Monster("buccaneer", "buccaneers", "NC", 7, 12, 0, 1, 0, 1, 0, 15, oddTables.treasureTypeAWater);
oddMonsters.pirate = new Monster("pirate", "pirates", "C", 7, 12, 0, 1, 0, 1, 0, 15, oddTables.treasureTypeAWater);

oddMonsters.caveman = new Monster("caveman", "cavemen", "N", 9, 12, 0, 2, 0, 1, 0, 15, oddTables.treasureTypeA);
oddMonsters.merman = new Monster("merman", "mermen", "N", 7, 12, 0, 1, 1, 1, 0, 15, oddTables.treasureTypeAWater);

oddMonsters.kobold = new Monster("kobold", "kobolds", "C", 7, 6, 0, 0.5, 0, 1, 0, 50, oddTables.treasureTypeNil);
oddMonsters.goblin = new Monster("goblin", "goblins", "C", 6, 6, 0, 1, -1, 1, 0, 50, oddTables.treasureTypeNil);
oddMonsters.goblinElite = new Monster("elite goblin", "elite goblins", "C", 5, 9, 0, 1, 1, 1, 0, 50, oddTables.treasureTypeNil);
oddMonsters.orc = new Monster("orc", "orcs", "NC", 6, 9, 0, 1, 0, 1, 0, 50, oddTables.treasureTypeD);
oddMonsters.hobgoblin = new Monster("hobgoblin", "hobgoblins", "C", 5, 9, 0, 1, 1, 1, 0, 30, oddTables.treasureTypeD);
oddMonsters.hobgoblinElite = new Monster("elite hobgoblin", "elite hobgoblins", "C", 5, 9, 0, 4, 1, 1, 2, 30, oddTables.treasureTypeNil);
oddMonsters.gnoll = new Monster("gnoll", "gnolls", "C", 5, 9, 0, 2, 0, 1, 0, 30, oddTables.treasureTypeD);
oddMonsters.gnollElite = new Monster("elite gnoll", "elite gnolls", "C", 4, 12, 0, 6, 3, 1, 0, 50, oddTables.treasureTypeNil);

oddMonsters.ogre = new Monster("ogre", "orgres", "C", 5, 9, 0, 4, 1, 1, 2, 30, oddTables.treasureTypeC);
oddMonsters.troll = new Monster("troll", "trolls", "C", 4, 12, 0, 6, 3, 1, 0, 50, oddTables.treasureTypeD);
oddMonsters.hillgiant = new Monster("hill giant", "hill giants", "NC", 4, 12, 0, 8, 0, 2, 0, 30, oddTables.treasureTypeE);
oddMonsters.stonegiant = new Monster("stone giant", "stone giants", "NC", 4, 12, 0, 9, 0, 2, 0, 30, oddTables.treasureTypeE);
oddMonsters.frostgiant = new Monster("frost giant", "frost giants", "NC", 4, 12, 0, 10, 1, 2, 1, 30, oddTables.treasureTypeE);
oddMonsters.firegiant = new Monster("fire giant", "fire giants", "NC", 4, 12, 0, 11, 3, 2, 2, 30, oddTables.treasureTypeE);
oddMonsters.cloudgiant = new Monster("cloud giant", "cloud giants", "NC", 4, 12, 0, 12, 2, 3, 0, 30, oddTables.treasureTypeE);

oddMonsters.skeleton = new Monster("skeleton", "skeletons", "X", 7, 6, 0, 0.5, 0, 1, 0, 0, oddTables.treasureTypeNil);
oddMonsters.zombie = new Monster("zombie", "zombies", "X", 8, 6, 0, 1, 0, 1, 0, 0, oddTables.treasureTypeNil);
oddMonsters.ghoul = new Monster("ghoul", "ghouls", "C", 6, 9, 0, 2, 0, 1, 0, 20, oddTables.treasureTypeB);
oddMonsters.wight = new Monster("wight", "wights", "C", 5, 9, 0, 3, 0, 1, 0, 60, oddTables.treasureTypeB);
oddMonsters.wraith = new Monster("wraith", "wraiths", "C", 3, 12, 24, 5, 1, 1, 0, 20, oddTables.treasureTypeE);
oddMonsters.mummy = new Monster("mummy", "mummies", "C", 3, 6, 0, 5, 1, 1, 0, 30, oddTables.treasureTypeD);
oddMonsters.spectre = new Monster("spectre", "spectres", "C", 2, 15, 30, 6, 0, 1, 0, 25, oddTables.treasureTypeE);
oddMonsters.vampire = new Monster("vampire", "vampires", "C", 2, 12, 18, 7, 0, 1, 0, 20, oddTables.treasureTypeF);

oddMonsters.cockatrice = new Monster("cockatrice", "conckatrices", "N", 6, 9, 18, 5, 0, 1, 0, 35, oddTables.treasureTypeD);
oddMonsters.basilisk = new Monster("basilisk", "basilisks", "N", 4, 6, 0, 5, 0, 1, 0, 40, oddTables.treasureTypeF);
oddMonsters.medusa = new Monster("medusa", "medusae", "C", 8, 9, 0, 4, 0, 1, 0, 75, oddTables.treasureTypeF);
oddMonsters.gorgon = new Monster("gorgon", "gorgons", "C", 2, 12, 0, 8, 0, 1, 0, 50, oddTables.treasureTypeE);

oddMonsters.manticore = new Monster("manticore", "manticoras", "C", 4, 12, 18, 6, 1, 1, 0, 25, oddTables.treasureTypeD);
oddMonsters.hydra = new Monster("hydra", "hydrae", "N", 5, 12, 0, 5, 0, 1, 0, 25, oddTables.treasureTypeB);
oddMonsters.chimera = new Monster("chimera", "chimerae", "NC", 4, 12, 18, 9, 0, 1, 0, 50, oddTables.treasureTypeF);
oddMonsters.wyvern = new Monster("wyvern", "wyverns", "N", 3, 9, 24, 7, 0, 1, 0, 60, oddTables.treasureTypeE);
oddMonsters.gargoyle = new Monster("gargoyle", "gargoyles", "C", 5, 9, 15, 4, 0, 1, 0, 25, oddTables.treasureTypeC);
oddMonsters.purpleworm = new Monster("purple worm", "purple worms", "N", 6, 6, 0, 15, 0, 1, 0, 25, oddTables.treasureTypeD);

oddMonsters.whitedragon = new Monster("white dragon", "white dragons", "NC", 2, 9, 24, 6, 0, 1, 0, 60, oddTables.treasureTypeH);
oddMonsters.blackdragon = new Monster("black dragon", "black dragons", "NC", 2, 9, 24, 7, 0, 1, 0, 60, oddTables.treasureTypeH);
oddMonsters.greendragon = new Monster("green dragon", "green dragons", "NC", 2, 9, 24, 8, 0, 1, 0, 60, oddTables.treasureTypeH);
oddMonsters.bluedragon = new Monster("blue dragon", "blue dragons", "NC", 2, 9, 24, 9, 0, 1, 0, 60, oddTables.treasureTypeH);
oddMonsters.reddragon = new Monster("red dragon", "red dragons", "NC", 2, 9, 24, 10, 0, 1, 0, 60, oddTables.treasureTypeH);
oddMonsters.golddragon = new Monster("gold dragon", "gold dragons", "L", 2, 9, 24, 11, 0, 1, 0, 60, oddTables.treasureTypeH);

oddMonsters.werewolf = new Monster("werewolf", "werewolves", "NC", 5, 15, 0, 4, 0, 1, 0, 15, oddTables.treasureTypeC);
oddMonsters.wereboar = new Monster("wereboar", "wereboars", "NC", 4, 12, 0, 4, 1, 1, 0, 15, oddTables.treasureTypeC);
oddMonsters.weretiger = new Monster("weretiger", "weretigers", "NC", 3, 12, 0, 5, 0, 1, 0, 15, oddTables.treasureTypeC);
oddMonsters.werebear = new Monster("werebear", "werebears", "LN", 2, 9, 0, 6, 0, 1, 0, 15, oddTables.treasureTypeC);

oddMonsters.minotaur = new Monster("minotaur", "minotaurs", "NC", 6, 12, 0, 6, 0, 1, 0, 10, oddTables.treasureTypeC);
oddMonsters.centaur = new Monster("centaur", "centaurs", "LN", 5, 18, 0, 4, 0, 1, 0, 5, oddTables.treasureTypeA);
oddMonsters.unicorn = new Monster("unicorn", "unicorns", "L", 2, 24, 0, 4, 0, 1, 0, 0, oddTables.treasureTypeNil);
oddMonsters.nixie = new Monster("nixie", "nixies", "N", 7, 12, 0, 1, 0, 1, 0, 100, oddTables.treasureTypeB);
oddMonsters.pixie = new Monster("pixie", "pixies", "N", 6, 9, 18, 1, 0, 1, 0, 25, oddTables.treasureTypeC);
oddMonsters.dryad = new Monster("dryad", "dryads", "N", 5, 12, 0, 2, 0, 1, 0, 20, oddTables.treasureTypeD);
oddMonsters.treant = new Monster("treant", "treants", "L", 2, 6, 0, 8, 0, 1, 0, 0, oddTables.treasureTypeNil);

oddMonsters.gnome = new Monster("gnome", "gnomes", "LN", 5, 6, 0, 1, 0, 1, 0, 60, oddTables.treasureTypeC);
oddMonsters.dwarf = new Monster("dwarf", "dwarves", "LN", 4, 6, 0, 1, 0, 1, 0, 50, oddTables.treasureTypeG);
oddMonsters.halfling = new Monster("halfling", "halflings", "LN", 7, 9, 0, 1, 0, 1, 0, 75, oddTables.treasureTypeC);
oddMonsters.elf = new Monster("elf", "elves", "LN", 5, 12, 0, 1, 1, 1, 0, 25, oddTables.treasureTypeE);
oddMonsters.fairy = new Monster("fairy", "fairies", "LNC", 5, 12, 0, 1, 1, 1, 0, 25, oddTables.treasureTypeE);

oddMonsters.pegasus = new Monster("pegasus", "pegasi", "L", 6, 24, 48, 2, 2, 1, 0, 0, oddTables.treasureTypeNil);
oddMonsters.hippogriff = new Monster("hippogriff", "hippogriffs", "L", 5, 18, 36, 3, 1, 1, 0, 0, oddTables.treasureTypeNil);
oddMonsters.griffon = new Monster("griffon", "griffons", "N", 3, 12, 30, 7, 0, 1, 0, 10, oddTables.treasureTypeE);
oddMonsters.roc = new Monster("roc", "rocs", "LN", 4, 6, 48, 6, 0, 1, 0, 20, oddTables.treasureTypeI);

oddMonsters.invisiblestalker = new Monster("invisible stalker", "invisible stalkers", "N", 3, 12, 12, 8, 0, 1, 0, 0, oddTables.treasureTypeNil);
oddMonsters.djinn = new Monster("djinn", "djinn", "N", 5, 9, 24, 7, 1, 2, -1, 0, oddTables.treasureTypeNil);
oddMonsters.efreet = new Monster("efreet", "efreet", "NC", 3, 9, 24, 10, 0, 2, 0, 0, oddTables.treasureTypeNil);
oddMonsters.balrog = new Monster("balrog", "balrogs", "C", 2, 6, 15, 10, 0, 1, 1, 25, oddTables.treasureTypeF);

oddMonsters.airelemental = new Monster("air elemental", "air elementals", "N", 2, 0, 36, 8, 0, 1, 1, 0, oddTables.treasureTypeNil);
oddMonsters.earthelemental = new Monster("earth elemental", "earth elementals", "N", 2, 6, 0, 8, 0, 3, 0, 0, oddTables.treasureTypeNil);
oddMonsters.fireelemental = new Monster("fire elemental", "fire elementals", "N", 2, 12, 0, 8, 0, 2, 0, 0, oddTables.treasureTypeNil);
oddMonsters.waterelemental = new Monster("water elemental", "water elementals", "N", 2, 6, 18, 8, 0, 2, 0, 0, oddTables.treasureTypeNil);

oddMonsters.ochrejelly = new Monster("ochre jelly", "ochre jellies", "N", 8, 3, 0, 5, 0, 1, 0, 0, oddTables.treasureTypeNil);
oddMonsters.blackpudding = new Monster("black pudding", "black puddings", "N", 6, 6, 0, 10, 0, 3, 0, 0, oddTables.treasureTypeNil);
oddMonsters.greenslime = new Monster("green slime", "green slimes", "N", 9, 0, 0, 2, 0, 1, 0, 0, oddTables.treasureTypeNil);
oddMonsters.grayooze = new Monster("gray ooze", "gray oozes", "N", 8, 1, 0, 3, 0, 2, 0, 0, oddTables.treasureTypeNil);
oddMonsters.yellowmold = new Monster("yellow mold", "yellow mold", "N", 9, 0, 0, 0, 0, 0, oddTables.treasureTypeNil);

oddMonsters.lighthorse = new Monster("light horse", "light horses", "N", 7, 24, 0, 2, 0, 1, 0, 0, oddTables.treasureTypeNil);
oddMonsters.mediumhorse = new Monster("medium horse", "medium horses", "N", 7, 18, 0, 2, 1, 1, 0, 0, oddTables.treasureTypeNil);
oddMonsters.heavyhorse = new Monster("heavy horse", "heavy horses", "N", 7, 12, 0, 3, 0, 1, 0, 0, oddTables.treasureTypeNil);
oddMonsters.drafthorse = new Monster("draft horse", "draft horses", "N", 7, 12, 0, 2, 1, 1, 0, 0, oddTables.treasureTypeNil);
oddMonsters.mule = new Monster("mule", "mules", "N", 7, 12, 0, 2, 1, 1, 0, 0, oddTables.treasureTypeNil);

//missing monsters; see also: http://odd74.proboards.com/thread/1536/animal-stats
oddMonsters.giantRat = new Monster("giant rat", "giant rats", "N", 7, 12, 0, 0.5, 0, 1, 0, 10, oddTables.treasureTypeC);
oddMonsters.centipede = new Monster("centipede", "centipedes", "N", 9, 9, 0, 0, 1, 0, 0, 0, oddTables.treasureTypeNil);
oddMonsters.giantSpider = new Monster("giant spider", "giant spiders", "N", 8, 9, 0, 1, 0, 1, 0, 60, oddTables.treasureTypeC);
oddMonsters.giantLizard = new Monster("giant lizard", "giant lizards", "N", 7, 9, 0, 2, 0, 1, 0, 0, oddTables.treasureTypeNil);
oddMonsters.giantHog = new Monster("giant hog", "giant hogs", "N", 7, 12, 0, 3, 0, 1, 0, 0, oddTables.treasureTypeNil);
oddMonsters.giantSnake = new Monster("giant snake", "giant snakes", "N", 7, 9, 0, 2, 1, 1, 0, 0, oddTables.treasureTypeNil);
oddMonsters.giantWeasel = new Monster("giant weasel", "giant weasels", "N", 7, 12, 0, 2, 1, 1, 0, 0, oddTables.treasureTypeNil);
oddMonsters.giantBeetle = new Monster("giant beetle", "giant beetles", "N", 3, 9, 0, 4, 0, 1, 0, 0, oddTables.treasureTypeNil);
oddMonsters.giantScorpion = new Monster("giant scorpion", "giant scorpions", "N", 3, 9, 0, 3, 1, 1, 0, 0, oddTables.treasureTypeNil);
oddMonsters.whiteApe = new Monster("white ape", "white ape", "N", 6, 12, 0, 6, 0, 1, 2, 10, oddTables.treasureTypeC);

oddMonsters.vermin = new Monster("vermin", "vermin", "N", 8, 3, 0, 0, 1, 0, 1, 0, oddTables.treasureTypeNil);
oddMonsters.bat = new Monster("bat", "bats", "N", 9, 3, 18, 0, 0, 1, 0, 1, 0, oddTables.treasureTypeNil);
oddMonsters.wolf = new Monster("wolf", "wolves", "N", 8, 15, 0, 1, 0, 1, 0, 0, oddTables.treasureTypeNil);
oddMonsters.boar = new Monster("boar", "boars", "N", 8, 12, 0, 1, 1, 1, 0, 0, oddTables.treasureTypeNil);
oddMonsters.panther = new Monster("panther", "panthers", "N", 8, 12, 0, 2, 0, 1, 0, 0, oddTables.treasureTypeNil);
oddMonsters.bear = new Monster("bear", "bears", "N", 8, 12, 0, 3, 0, 1, 1, 0, oddTables.treasureTypeNil);

//giant crabs
//giant octopi
//giant squid
//giant leeches
//giant fish - 9ft sabertooth salmon?
//dragon turtle

//giant toads
//giant ants
//apes
//lions

//tyr rex
//pter'dyle
//triceratops
//bronto
//stegosaur

//apt
//banth
//thoat
//calot
//orluk
//sith
//thark
//darseen

//cave bear - comparable in size to polar/grizzly bears
	//short-faced bear is larger
//dire wolf - only a little bigger than modern wolves
//sabre tooth tiger - bigger and sturdier than modern tigers
//spotted lion - smaller mountain predator
	//american lion is 25% larger than modern lion
//mastadon - assume ~10 hd based on AD&D elephant
//wooly rhino - smaller than elephant, ~8 HD
//titanothere - probably smaller than wooly rhino
//mammoth - assume ~10 hd based on AD&D elephant

//even more!
//giant condor (5m/16ft wingspan, nearly pteronodon size)
//giant moa / terror bird


/* Encounters */
var oddEncounters = {
	'version': '0.1',
};

//Villages are for the random villages attracted to PC castles after they are established
oddEncounters.village = function () {
	var result,
		noun, name,
		numberEncountered, fyrd, population, taxes,
		archers, foot;
		
	numberEncountered = dice.d10(4); //number of 10-person figures of fyrd
	fyrd = numberEncountered * 10;
	population = fyrd * 5;
	taxes = fyrd * 10;

	foot = Math.round(numberEncountered * 0.6);
	archers = Math.round(numberEncountered * 0.4);

	if (fyrd <= 200 && dice.flip()) {
		name = oddNames.hamletName();
		noun = "hamlet";
	} else if (fyrd >= 300 && dice.flip()) {
		name = oddNames.townName();
		noun = "town";
	} else {
		name = oddNames.villageName();
		noun = "village";
	}

	result = name + " (" + noun + ", population " + population + ")\n";
	result += "TaxRevenue: " + taxes + "gp\n";
	result += "Fyrd: \n";
	if (foot > 0) {
		result += "\t" + oddMonsters.lightfoot.shortDesc(10*foot) + "\n";
	}
	if (archers > 0) {
		result += "\t" + oddMonsters.archer.shortDesc(10*archers) + "\n";
	}

	return result;
};

oddEncounters.bandits = function () {
	var result, i, numberEncountered, 
		foot, archers, lightCav, medCav, prisoners,
		sarges, louies, captains, mages, clerics, fighters;
		
	numberEncountered = dice.d10(3); //number of 10-person figures
	foot = Math.round(numberEncountered * 0.4);
	numberEncountered -= foot;
	archers = Math.round(numberEncountered * 0.5);
	numberEncountered -= archers;
	lightCav = Math.round(numberEncountered * 0.66);
	numberEncountered -= lightCav;
	medCav = numberEncountered;
	numberEncountered = foot + archers + lightCav + medCav;
	prisoners = Math.round(numberEncountered / 2);

	sarges = Math.floor(numberEncountered / 3);
	louies = Math.floor(numberEncountered / 5);
	captains = Math.floor(numberEncountered / 10);

	if (numberEncountered === 30) {
		mages = 1;
		clerics = dice.flip() ? 1 : 0;
	} else {
		mages = dice.flip() ? 1 : 0;
		clerics = dice.d4() >= 4 ? 1 : 0;
	}

	fighters = [];
	for (i = 0; i < sarges; i ++) {
		fighters.push(4);
	}
	for (i = 0; i < louies; i++) {
		fighters.push(dice.flip() ? 5 : 6);
	}
	for (i = 0; i < captains; i++) {
		fighters.push(dice.flip() ? 8 : 9);
	}

	result = "Bandit Lair" + "\n";
	if (foot > 0) {
		// result += "\t" + 10*foot + " light foot" + "\n";
		result += "\t" + oddMonsters.lightfoot.shortDesc(10*foot) + "\n";
	}
	if (archers > 0) {
		result += "\t" + oddMonsters.archer.shortDesc(10*archers) + "\n";
	}
	if (lightCav > 0) { 
		result += "\t" + oddMonsters.lightcavalry.shortDesc(10*lightCav) + "\n";
	}
	if (medCav > 0) {
		result += "\t" + oddMonsters.mediumcavalry.shortDesc(10*medCav) +"\n";
	}

	result += "\n";
	
	for (i = 0; i < fighters.length; i++) {
		result += oddTables.npcFighter(fighters[i], "N") + "\n";
	}

	for (i = 0; i < mages; i++) {
		result += oddTables.npcWizard(dice.chanceIn6(4) ? 10 : 11, "N") + "\n";
	}

	for (i = 0; i < clerics; i++) {
		result += oddTables.npcCleric(8) + "\n";
	}

	result += oddMonsters.bandit.treasureType();
	if (prisoners > 0) {
		result += "\t" + prisoners + " prisoners";
	}


	return result;
};

oddEncounters.brigands = function () {
	var result, i, numberEncountered, 
		foot, archers, lightCav, medCav, prisoners,
		sarges, louies, captains, mages, clerics, fighters;
		
	numberEncountered = dice.d10(3); //number of 10-person figures
	foot = Math.round(numberEncountered * 0.4);
	numberEncountered -= foot;
	archers = Math.round(numberEncountered * 0.5);
	numberEncountered -= archers;
	lightCav = Math.round(numberEncountered * 0.66);
	numberEncountered -= lightCav;
	medCav = numberEncountered;
	numberEncountered = foot + archers + lightCav + medCav;
	prisoners = Math.round(numberEncountered / 2);

	sarges = Math.floor(numberEncountered / 3);
	louies = Math.floor(numberEncountered / 5);
	captains = Math.floor(numberEncountered / 10);

	if (numberEncountered === 30) {
		mages = 1;
		clerics = dice.flip() ? 1 : 0;
	} else {
		mages = dice.flip() ? 1 : 0;
		clerics = dice.d4() >= 4 ? 1 : 0;
	}

	fighters = [];
	for (i = 0; i < sarges; i ++) {
		fighters.push(4);
	}
	for (i = 0; i < louies; i++) {
		fighters.push(dice.flip() ? 5 : 6);
	}
	for (i = 0; i < captains; i++) {
		fighters.push(dice.flip() ? 8 : 9);
	}

	result = "Brigand Lair" + "\n";
	if (foot > 0) {
		// result += "\t" + 10*foot + " light foot" + "\n";
		result += "\t" + oddMonsters.lightfoot.shortDesc(10*foot) + "\n";
	}
	if (archers > 0) {
		result += "\t" + oddMonsters.archer.shortDesc(10*archers) + "\n";
	}
	if (lightCav > 0) { 
		result += "\t" + oddMonsters.lightcavalry.shortDesc(10*lightCav) + "\n";
	}
	if (medCav > 0) {
		result += "\t" + oddMonsters.mediumcavalry.shortDesc(10*medCav) +"\n";
	}

	result += "\n";
	
	for (i = 0; i < fighters.length; i++) {
		result += oddTables.npcFighter(fighters[i], "C") + "\n";
	}

	for (i = 0; i < mages; i++) {
		result += oddTables.npcWizard(dice.chanceIn6(4) ? 10 : 11, "C") + "\n";
	}

	for (i = 0; i < clerics; i++) {
		result += oddTables.npcCleric(8,"C") + "\n";
	}

	result += oddTables.treasureTypeA();
	if (prisoners > 0) {
		result += "\t" + prisoners + " prisoners";
	}

	return result;
};

oddEncounters.berserkers = function () {
	var result, i, numberEncountered, 
		foot, sarges, louies, captains, fighters;
		
	//this is the common interpretation; older sources say 1d10 * 3 figures
	numberEncountered = dice.d10(3); //number of 10-person figures
	foot = numberEncountered;

	sarges = Math.floor(numberEncountered / 3);
	louies = Math.floor(numberEncountered / 5);
	captains = Math.floor(numberEncountered / 10);

	fighters = [];
	for (i = 0; i < sarges; i ++) {
		fighters.push(4);
	}
	for (i = 0; i < louies; i++) {
		fighters.push(dice.flip() ? 5 : 6);
	}
	for (i = 0; i < captains; i++) {
		fighters.push(dice.flip() ? 8 : 9);
	}

	result = "Berserker Lair" + "\n";
	if (foot > 0) {
		result += "\t" + oddMonsters.berserker.shortDesc(10*foot) + "\n";
	}

	result += "\n";
	
	for (i = 0; i < fighters.length; i++) {
		result += oddTables.npcFighter(fighters[i], "N") + "\n";
	}

	result += oddMonsters.berserker.treasureType();

	return result;
};

oddEncounters.desertNomads = function () {
	var result, i, numberEncountered, 
		archers, horseArchers, lightCav, medCav,
		sarges, louies, captains, mages, clerics, fighters;
		
	numberEncountered = dice.d10(3); //number of 10-person figures
	lightCav = Math.round(numberEncountered * 0.50);
	numberEncountered -= lightCav;
	horseArchers = Math.round(numberEncountered * 0.4);
	numberEncountered -= horseArchers;
	medCav = numberEncountered;
	archers = dice.d3(1)+1; //this is in addition to the number encountered

	numberEncountered = horseArchers + lightCav + medCav;

	sarges = Math.floor(numberEncountered / 3);
	louies = Math.floor(numberEncountered / 5);
	captains = Math.floor(numberEncountered / 10);

	if (numberEncountered === 30) {
		mages = 1;
		clerics = dice.flip() ? 1 : 0;
	} else {
		mages = dice.flip() ? 1 : 0;
		clerics = dice.d4() >= 4 ? 1 : 0;
	}

	fighters = [];
	for (i = 0; i < sarges; i ++) {
		fighters.push(4);
	}
	for (i = 0; i < louies; i++) {
		fighters.push(dice.flip() ? 5 : 6);
	}
	for (i = 0; i < captains; i++) {
		fighters.push(dice.flip() ? 8 : 9);
	}

	result = "Desert Nomads" + "\n";
	if (lightCav > 0) { 
		result += "\t" + oddMonsters.lightcavalry.shortDesc(10*lightCav) + "\n";
	}
	if (horseArchers > 0) {
		result += "\t" + oddMonsters.lightcavalryarcher.shortDesc(10*horseArchers) + "\n";
	}
	if (medCav > 0) {
		result += "\t" + oddMonsters.mediumcavalry.shortDesc(10*medCav) +"\n";
	}
	if (archers > 0) {
		result += "\t" + oddMonsters.archer.shortDesc(10*archers) + "(defending camp)\n";
	}

	result += "\n";
	
	for (i = 0; i < fighters.length; i++) {
		result += oddTables.npcFighter(fighters[i], "N") + "\n";
	}

	for (i = 0; i < mages; i++) {
		result += oddTables.npcWizard(dice.chanceIn6(4) ? 10 : 11, "N") + "\n";
	}

	for (i = 0; i < clerics; i++) {
		result += oddTables.npcCleric(8) + "\n";
	}

	result += oddMonsters.nomad.treasureType();

	return result;
};

oddEncounters.steppeNomads = function () {
	var result, i, numberEncountered, 
		archers, lightCav, lightCavArchers, medCav, medCavArchers,
		sarges, louies, captains, mages, clerics, fighters;
		
	numberEncountered = dice.d10(3); //number of 10-person figures
	lightCavArchers = Math.round(numberEncountered * 0.5);
	numberEncountered -= lightCavArchers;
	lightCav = Math.round(numberEncountered * 0.4);
	numberEncountered -= lightCav;
	medCavArchers = Math.round(numberEncountered * 0.66);
	numberEncountered -= medCavArchers;
	medCav = numberEncountered;
	archers = dice.d3(1)+1; //this is in addition to the number encountered

	numberEncountered = lightCav + lightCavArchers + medCav + medCavArchers; //recalculate due to rounding

	sarges = Math.floor(numberEncountered / 3);
	louies = Math.floor(numberEncountered / 5);
	captains = Math.floor(numberEncountered / 10);

	if (numberEncountered === 30) {
		mages = 1;
		clerics = dice.flip() ? 1 : 0;
	} else {
		mages = dice.flip() ? 1 : 0;
		clerics = dice.d4() >= 4 ? 1 : 0;
	}

	fighters = [];
	for (i = 0; i < sarges; i ++) {
		fighters.push(4);
	}
	for (i = 0; i < louies; i++) {
		fighters.push(dice.flip() ? 5 : 6);
	}
	for (i = 0; i < captains; i++) {
		fighters.push(dice.flip() ? 8 : 9);
	}

	result = "Steppe Nomad Lair" + "\n";
	if (lightCav > 0) { 
		result += "\t" + oddMonsters.lightcavalry.shortDesc(10*lightCav) + "\n";
	}
	if (lightCavArchers > 0) {
		result += "\t" + oddMonsters.lightcavalryarcher.shortDesc(10*lightCavArchers) + "\n";
	}
	if (medCav > 0) {
		result += "\t" + oddMonsters.mediumcavalry.shortDesc(10*medCav) +"\n";
	}
	if (medCavArchers > 0) {
		result += "\t" + oddMonsters.mediumcavalryarcher.shortDesc(10*medCavArchers) +"\n";
	}	
	if (archers > 0) {
		result += "\t" + oddMonsters.archer.shortDesc(10*archers) + "(defending camp)\n";
	}

	result += "\n";
	
	for (i = 0; i < fighters.length; i++) {
		result += oddTables.npcFighter(fighters[i], "N") + "\n";
	}

	for (i = 0; i < mages; i++) {
		result += oddTables.npcWizard(dice.chanceIn6(4) ? 10 : 11, "N") + "\n";
	}

	for (i = 0; i < clerics; i++) {
		result += oddTables.npcCleric(8) + "\n";
	}

	result += oddMonsters.nomad.treasureType();

	return result;
};

oddEncounters.dervishes = function () {
	var result, i, numberEncountered, 
		archers, horseArchers, lightCav, medCav,
		sarges, louies, captains, mages, clerics, fighters;

	numberEncountered = dice.d10(3); //number of 10-person figures
	lightCav = Math.round(numberEncountered * 0.50);
	numberEncountered -= lightCav;
	horseArchers = Math.round(numberEncountered * 0.4);
	numberEncountered -= horseArchers;
	medCav = numberEncountered;
	archers = dice.d3(1)+1; //this is in addition to the number encountered

	numberEncountered = horseArchers + lightCav + medCav;

	sarges = Math.floor(numberEncountered / 3);
	louies = Math.floor(numberEncountered / 5);
	captains = Math.floor(numberEncountered / 10);

	if (numberEncountered === 30) {
		mages = 1;
	} else {
		mages = dice.flip() ? 1 : 0;
	}
	clerics = 1;

	fighters = [];
	for (i = 0; i < sarges; i ++) {
		fighters.push(4);
	}
	for (i = 0; i < louies; i++) {
		fighters.push(dice.flip() ? 5 : 6);
	}
	for (i = 0; i < captains; i++) {
		fighters.push(dice.flip() ? 8 : 9);
	}

	result = "Dervish Lair" + "\n";
	if (lightCav > 0) { 
		result += "\t" + oddMonsters.lightcavalry.shortDesc(10*lightCav) + "\n";
	}
	if (horseArchers > 0) {
		result += "\t" + oddMonsters.lightcavalryarcher.shortDesc(10*horseArchers) + "\n";
	}
	if (medCav > 0) {
		result += "\t" + oddMonsters.mediumcavalry.shortDesc(10*medCav) +"\n";
	}
	if (archers > 0) {
		result += "\t" + oddMonsters.archer.shortDesc(10*archers) + "(defending camp)\n";
	}

	result += "\n";

	for (i = 0; i < clerics; i++) {
		result += oddTables.npcCleric((dice.d3()+7),"L") + "\n";
	}
	
	for (i = 0; i < fighters.length; i++) {
		result += oddTables.npcFighter(fighters[i], "L") + "\n";
	}

	for (i = 0; i < mages; i++) {
		result += oddTables.npcWizard(dice.chanceIn6(4) ? 10 : 11, "L") + "\n";
	}

	result += oddMonsters.dervish.treasureType();

	return result;
};

oddEncounters.buccaneers = function () {
	var result, i, numberEncountered, 
		foot, crossbows, heavycrossbows,
		sarges, louies, captains, mages, clerics, fighters;

	numberEncountered = dice.d10(3); //number of 10-person figures
	foot = Math.round(numberEncountered * 0.6);
	numberEncountered -= foot;
	crossbows = Math.round(numberEncountered * 0.8);
	numberEncountered -= crossbows;
	heavycrossbows = numberEncountered;
	numberEncountered = foot + crossbows + heavycrossbows; //recalculate to correct for rounding

	sarges = Math.floor(numberEncountered / 3);
	louies = Math.floor(numberEncountered / 5);
	captains = Math.floor(numberEncountered / 10);

	if (numberEncountered === 30) {
		mages = 1;
		clerics = dice.flip() ? 1 : 0;
	} else {
		mages = dice.flip() ? 1 : 0;
		clerics = dice.d4() >= 4 ? 1 : 0;
	}

	fighters = [];
	for (i = 0; i < sarges; i ++) {
		fighters.push(4);
	}
	for (i = 0; i < louies; i++) {
		fighters.push(dice.flip() ? 5 : 6);
	}
	for (i = 0; i < captains; i++) {
		fighters.push(dice.flip() ? 8 : 9);
	}

	result = "Buccaneer Lair" + "\n";
	if (foot > 0) {
		result += "\t" + oddMonsters.lightfoot.shortDesc(10*foot) + "\n";
	}
	if (crossbows > 0) {
		result += "\t" + oddMonsters.crossbow.shortDesc(10*crossbows) + "\n";
	}
	if (heavycrossbows > 0) { 
		result += "\t" + oddMonsters.heavycrossbow.shortDesc(10*heavycrossbows) + "\n";
	}

	result += "\n";
	
	for (i = 0; i < fighters.length; i++) {
		result += oddTables.npcFighter(fighters[i], "N") + "\n";
	}

	for (i = 0; i < mages; i++) {
		result += oddTables.npcWizard(dice.chanceIn6(4) ? 10 : 11, "N") + "\n";
	}

	for (i = 0; i < clerics; i++) {
		result += oddTables.npcCleric(8) + "\n";
	}

	result += oddMonsters.buccaneer.treasureType();

	return result;
};

oddEncounters.pirates = function () {
	var result, i, numberEncountered, 
		foot, crossbows, heavycrossbows,
		sarges, louies, captains, mages, clerics, fighters;
		
	numberEncountered = dice.d10(3); //number of 10-person figures
	foot = Math.round(numberEncountered * 0.6);
	numberEncountered -= foot;
	crossbows = Math.round(numberEncountered * 0.8);
	numberEncountered -= crossbows;
	heavycrossbows = numberEncountered;
	numberEncountered = foot + crossbows + heavycrossbows; //recalculate to correct for rounding

	sarges = Math.floor(numberEncountered / 3);
	louies = Math.floor(numberEncountered / 5);
	captains = Math.floor(numberEncountered / 10);

	if (numberEncountered === 30) {
		mages = 1;
		clerics = dice.flip() ? 1 : 0;
	} else {
		mages = dice.flip() ? 1 : 0;
		clerics = dice.d4() >= 4 ? 1 : 0;
	}

	fighters = [];
	for (i = 0; i < sarges; i ++) {
		fighters.push(4);
	}
	for (i = 0; i < louies; i++) {
		fighters.push(dice.flip() ? 5 : 6);
	}
	for (i = 0; i < captains; i++) {
		fighters.push(dice.flip() ? 8 : 9);
	}

	result = "Pirate Lair" + "\n";
	if (foot > 0) {
		result += "\t" + oddMonsters.lightfoot.shortDesc(10*foot) + "\n";
	}
	if (crossbows > 0) {
		result += "\t" + oddMonsters.crossbow.shortDesc(10*crossbows) + "\n";
	}
	if (heavycrossbows > 0) { 
		result += "\t" + oddMonsters.heavycrossbow.shortDesc(10*heavycrossbows) + "\n";
	}

	result += "\n";
	
	for (i = 0; i < fighters.length; i++) {
		result += oddTables.npcFighter(fighters[i], "C") + "\n";
	}

	for (i = 0; i < mages; i++) {
		result += oddTables.npcWizard(dice.chanceIn6(4) ? 10 : 11, "C") + "\n";
	}

	for (i = 0; i < clerics; i++) {
		result += oddTables.npcCleric(8,"C") + "\n";
	}

	result += oddMonsters.pirate.treasureType();

	return result;
};

oddEncounters.goblins = function () {
	var result, numberEncountered;
	numberEncountered = dice.d10(4);
	result = "Globlin Lair" + "\n";
	result += "\t" + oddMonsters.goblin.shortDesc(10*numberEncountered) + "\n";
	result += "\t" + oddMonsters.goblinElite.shortDesc(dice.d6(5)+1) + "\n";
	result += "Misc. Treasure: " + dice.d6(numberEncountered*10) + "gp";
	return result;
};

oddEncounters.kobolds = function () {
	var result, numberEncountered;
	numberEncountered = dice.d10(4);
	result = "Kobold Lair" + "\n";
	result += "\t" + oddMonsters.kobold.shortDesc(10*numberEncountered) + "\n";
	result += "Misc. Treasure: " + dice.d6(numberEncountered*10) + "gp";
	return result;
};

oddEncounters.orcWagons = function () {
	var result, i, numberEncountered, wagons;
	wagons = dice.d8();
	numberEncountered = dice.d10(3) + wagons;
	result = "Orc Wagon Train" + "\n";
	result += "\t" + oddMonsters.orc.shortDesc(10*numberEncountered) + "\n";
	for (i = 0; i < wagons; i++) {
		result += "\t" + "wagon with " + (dice.d6(2)*100) + " gp" + "\n";
	}
	if (dice.flip()) {
		switch (dice.d6()) {
			case 1: result += oddTables.npcFighter(7, "C");
				break;
			case 2:
			case 3:
			case 4: result += oddTables.npcFighter(8, "C");
				break;
			default: result += oddTables.npcFighter(9, "C");
				break;
		}
	} else {
		switch (dice.d6()) {
			case 1: result += oddTables.npcWizard(9, "C");
				break;
			case 2:
			case 3:
			case 4: result += oddTables.npcWizard(10, "C");
				break;
			default: result += oddTables.npcWizard(11, "C");
				break;
		}
	}
	return result;
};

oddEncounters.orcs = function () {
	var result, i, numberEncountered, 
		lair,
		foot,
		mages, fighters, beasts;

	numberEncountered = dice.d10(3); //number of 10-person figures
	foot = numberEncountered;
	numberEncountered = foot;

	fighters = [];
	mages = [];
	beasts = [];
	if (dice.d6() >= 5) {
		lair = "village";
		if (dice.d100 <= (25*numberEncountered/10)) {
			switch (dice.d6()) {
				case 1: fighters.push(7);
					break;
				case 2:
				case 3:
				case 4: fighters.push(8);
					break;
				default: fighters.push(9);
					break;
			}
		}
		if (dice.d100() <= (numberEncountered)) {
			mages.push(11);
		}
		if (dice.d100() <= (15*numberEncountered/5)) {
			beasts.push(dice.d6() + " " + oddMonsters.ogre.shortDesc());
		}
	} else {
		lair = "cave complex";
		if (dice.d100() <= (10*numberEncountered/5)) {
			beasts.push(dice.d6() + " " + oddMonsters.ogre.shortDesc());
		}
		if (dice.d100() <= (numberEncountered)) {
			beasts.push(dice.d4() + " " + oddMonsters.troll.shortDesc());
		}
		if (dice.d100() <= (numberEncountered)) {
			beasts.push(oddMonsters.reddragon.shortDesc());
		}
		if (dice.d100() <= (25*numberEncountered/10)) {
			// First print M & T, pg 7: 25% chance of a Balrog per 100 Orcs in a Cave Complex, Nil chance in a Village
			beasts.push(oddMonsters.balrog.shortDesc());
		}
	}

	result = "Orc " + lair + "\n";
	result += "\t" + oddMonsters.orc.shortDesc(10*foot) + "\n";
	
	for (i = 0; i < fighters.length; i++) {
		result += oddTables.npcFighter(fighters[i], "C") + "\n";
	}

	for (i = 0; i < mages.length; i++) {
		result += oddTables.npcWizard(dice.chanceIn6(4) ? 10 : 11, "C") + "\n";
	}

	for (i = 0; i < beasts.length; i++) {
		result += beasts[i] + "\n";
	}

	result += oddTables.treasureTypeD();

	return result;
};

oddEncounters.hobgoblins = function () {
	var result, numberEncountered;
	numberEncountered = dice.d10(2);
	result = "Hobgoblin Lair" + "\n";
	result += "\t" + oddMonsters.hobgoblin.shortDesc(10*numberEncountered) + "\n";
	result += "\t" + oddMonsters.hobgoblinElite.shortDesc(dice.d4(2)+1) + "\n";
	result += oddMonsters.hobgoblin.treasureType();
	return result;
};

oddEncounters.gnolls = function () {
	var result, numberEncountered;
	numberEncountered = dice.d10(2);
	result = "Gnoll Lair" + "\n";
	result += "\t" + oddMonsters.gnoll.shortDesc(10*numberEncountered) + "\n";
	result += "\t" + oddMonsters.gnollElite.shortDesc(dice.d4(1)+1) + "\n";
	result += oddMonsters.gnoll.treasureType();
	return result;
};

oddEncounters.ogres = function () {
	var result, numberEncountered;
	numberEncountered = dice.d6(3);
	result = "Ogre Lair" + "\n";
	result += "\t" + oddMonsters.ogre.shortDesc(numberEncountered) + "\n";
	result += oddMonsters.ogre.treasureType();
	return result;
};

oddEncounters.trolls = function () {
	var result, numberEncountered;
	numberEncountered = dice.d6(2);
	result = "Troll Lair" + "\n";
	result += "\t" + oddMonsters.troll.shortDesc(numberEncountered) + "\n";
	result += oddMonsters.troll.treasureType();
	return result;
};

oddEncounters.dwarves = function () {
	var result, i, numberEncountered, leaders;
	numberEncountered = dice.d10(4); //number of 10-person figures
	leaders = Math.floor(numberEncountered / 4);
	result = "Dwarf Lair" + "\n";
	result += "\t" + oddMonsters.dwarf.shortDesc(10*numberEncountered) + "\n";

	for (i = 0; i < leaders; i++) {
		result += oddTables.npcDwarf(dice.d6(1), "L");
	}

	result += oddMonsters.dwarf.treasureType();
	return result;
};

oddEncounters.elves = function () {
	var result, i, numberEncountered, levelFighter, levelMagic,
		spears, bows,
		leaders;

	numberEncountered = dice.d10(3); //number of 10-person figures
	bows = Math.round(numberEncountered * 0.5);
	numberEncountered -= bows;
	spears = numberEncountered;
	numberEncountered = spears + bows;

	result = "Elf Lair" + "\n";
	result += "\t" + oddMonsters.elf.shortDesc(10*bows) + " - with bows" + "\n";
	result += "\t" + oddMonsters.elf.shortDesc(10*spears) + " - with spears" + "\n";

	leaders = Math.floor(numberEncountered / 5);
	for (i = 0; i < leaders; i++) {
		levelFighter = dice.d4(1);
		levelFighter = (levelFighter == 1 ? 2 : levelFighter);
		levelMagic = dice.d6(1);
		levelMagic = (levelMagic == 1 ? 2 : levelMagic);
		levelMagic = (levelMagic == 6 ? 5 : levelMagic);
		result += oddTables.npcElfTwoLevels(levelFighter, levelMagic, "L");
	}
	leaders = Math.floor(numberEncountered / 10);
	for (i = 0; i < leaders; i++) {
		result += oddTables.npcElfTwoLevels(4,8,"L"); //hero-warlock
	}
	result += oddMonsters.elf.treasureType();
	return result;
};

oddEncounters.gnomes = function () {
	var result, numberEncountered;
	numberEncountered = dice.d10(4);
	result = "Gnome Lair" + "\n";
	result += "\t" + oddMonsters.gnome.shortDesc(10 * numberEncountered) + "\n";
	result += oddMonsters.gnome.treasureType();
	return result;
};

oddEncounters.nixies = function () {
	var result, numberEncountered, fish;
	numberEncountered = dice.d10();
	fish = dice.d10() * 10;
	result = "Nixie Lair" + "\n";
	result += "\t" + oddMonsters.nixie.shortDesc(10 * numberEncountered) + "\n";
	result += "\t" + fish + " giant fish" + "\n";
	result += "\t" + numberEncountered + " Charm Person spells" + "\n";
	result += oddMonsters.nixie.treasureType();
	return result;
};

oddEncounters.pixies = function () {
	var result, numberEncountered;
	numberEncountered = dice.d10();
	result = "Pixie Lair" + "\n";
	result += "\t" + oddMonsters.pixie.shortDesc(10 * numberEncountered) + "\n";
	result += oddMonsters.pixie.treasureType();
	return result;
};

oddEncounters.lycanthropes = function () {
	switch (dice.d4()) {
		default: return oddEncounters.werewolves();
		case  2: return oddEncounters.wereboars();
		case  3: return oddEncounters.weretigers();
		case  4: return oddEncounters.werebears();
	}
};

oddEncounters.werewolves = function () {
	var result, numberEncountered;
	numberEncountered = dice.d10(2);
	result = "Werewolf Lair" + "\n";
	result += "\t" + oddMonsters.werewolf.shortDesc(numberEncountered) + "\n";
	result += oddMonsters.werewolf.treasureType();
	return result;
};

oddEncounters.wereboars = function () {
	var result, numberEncountered;
	numberEncountered = dice.d10(2);
	result = "Wereboar Lair" + "\n";
	result += "\t" + oddMonsters.wereboar.shortDesc(numberEncountered) + "\n";
	result += oddMonsters.wereboar.treasureType();
	return result;
};

oddEncounters.weretigers = function () {
	var result, numberEncountered;
	numberEncountered = dice.d10(2);
	result = "Weretiger Lair" + "\n";
	result += "\t" + oddMonsters.weretiger.shortDesc(numberEncountered) + "\n";
	result += oddMonsters.weretiger.treasureType();
	return result;
};

oddEncounters.werebears = function () {
	var result, numberEncountered;
	numberEncountered = dice.d10(2);
	result = "Werebear Lair" + "\n";
	result += "\t" + oddMonsters.werebear.shortDesc(numberEncountered) + "\n";
	result += oddMonsters.werebear.treasureType();
	return result;
};

oddEncounters.giants = function () {
	switch (dice.d10()) {
		default: return oddEncounters.hillgiants();
		case  7: return oddEncounters.stonegiants();
		case  8: return oddEncounters.frostgiants();
		case  9: return oddEncounters.firegiants();
		case 10: return oddEncounters.cloudgiants();
	}
};

oddEncounters.giantPets = function() {
	switch (dice.d6()) {
		default: return (dice.d6()+4) + "-headed " + oddMonsters.hydra.shortDesc(); 
		case  5: return oddMonsters.wolf(dice.d6(6));
		case  6: return oddMonsters.bear(dice.d6(3));
	}
};

oddEncounters.hillgiants = function () {
	var result, numberEncountered;
	numberEncountered = dice.d8();
	result = "Hill Giant Cave" + "\n";
	result += "\t" + oddMonsters.hillgiant.shortDesc(numberEncountered) + "\n";
	result += oddMonsters.hillgiant.treasureType();
	return result;
};

oddEncounters.stonegiants = function () {
	var result, numberEncountered;
	numberEncountered = dice.d8();
	result = "Stone Giant Cave" + "\n";
	result += "\t" + oddMonsters.stonegiant.shortDesc(numberEncountered) + "\n";
	result += oddMonsters.stonegiant.treasureType();
	return result;
};

oddEncounters.frostgiants = function () {
	var result, numberEncountered;
	numberEncountered = dice.d8();
	result = "Frost Giant Castle" + "\n";
	result += "\t" + oddMonsters.frostgiant.shortDesc(numberEncountered) + "\n";
	if (dice.flip()) {
		result += "\t" + oddEncounters.giantPets() + "\n";
	}
	result += oddMonsters.frostgiant.treasureType();
	return result;
};

oddEncounters.firegiants = function () {
	var result, numberEncountered;
	numberEncountered = dice.d8();
	result = "Fire Giant Castle" + "\n";
	result += "\t" + oddMonsters.firegiant.shortDesc(numberEncountered) + "\n";
	if (dice.flip()) {
		result += "\t" + oddEncounters.giantPets() + "\n";
	}
	result += oddMonsters.firegiant.treasureType();
	return result;
};

oddEncounters.cloudgiants = function () {
	var result, numberEncountered;
	numberEncountered = dice.d8();
	result = "Cloud Giant Castle" + "\n";
	result += "\t" + oddMonsters.cloudgiant.shortDesc(numberEncountered) + "\n";
	if (dice.flip()) {
		result += "\t" + oddEncounters.giantPets() + "\n";
	}
	result += oddMonsters.cloudgiant.treasureType();
	return result;
};

/* Dragons */

function DragonType (color, breathType, breathShape, hdLow, hdMid, hdHi, talkChance, spellChance, maxSpellLvl, sleepChance) {
	this.color = color;
	this.breathType = breathType;
	this.breathShape = breathShape;
	this.hdLow = hdLow;
	this.hdMid = hdMid;
	this.hdHi = hdHi;
	this.talkChance = talkChance;
	this.spellChance = spellChance;
	this.maxSpellLvl = maxSpellLvl;
	this.sleepChance = sleepChance;
}
var dragonTypes = {
	'version': '0.1',
};
dragonTypes.white = new DragonType("white", "cold", "8\"x3\" cone", 5, 6, 7, 25, 0, 0, 60);
dragonTypes.black = new DragonType("black", "acid", "6\"x½\" line", 6, 7, 8, 40, 5, 1, 50);
dragonTypes.green = new DragonType("green", "gas", "5\"x4\" cloud", 7, 8, 9, 55, 10, 2, 40);
dragonTypes.blue = new DragonType("blue", "lightning", "10\"x½\" line", 8, 9, 10, 70, 2, 15, 30);
dragonTypes.red = new DragonType("red", "fire", "9\"x3\" cone", 9, 10, 11, 85, 15, 3, 20);
dragonTypes.gold = new DragonType("gold", "fire or gas", "9\"x3\" cone or 5\"x4\" cloud", 10, 11, 12, 100, 100, 6, 10);

oddEncounters.dragon = function (age, type) {
	var i, roll1, spellLevels, dragon;

	dragon = {};

	age = age || dice.d6(1);
	type = type || dice.pick(dragonTypes.white,dragonTypes.black,dragonTypes.green,dragonTypes.blue,dragonTypes.red,dragonTypes.gold);

	dragon.age = age;
	dragon.type = type;

	roll1 = dice.d5(1);
	if (roll1 === 1) {
		dragon.size = "small ";
		dragon.hd = type.hdLow;
	} else if (roll1 === 5) {
		dragon.size = "";
		dragon.hd = type.hdMid;
	} else {
		dragon.size = "large ";
		dragon.hd = type.hdHi;
	}
	dragon.hp = dragon.hd * age;
	dragon.talks = dice.percentChance(type.talkChance);
	if (dragon.talks) {
		dragon.castsSpells = dice.percentChance(type.spellChance);
	}
	dragon.sleeping = dice.percentChance(type.sleepChance);

	if (dragon.castsSpells) {
		dragon.maxSpellLvl = Math.max(type.maxSpellLvl, age);
		spellLevels = [];
		for (i = 0; i < dragon.maxSpellLvl; i++) {
			spellLevels[i] = 0;
		}
		for (i = 0; i < dragon.hd; i++) {
			spellLevels[dice.d(1,dragon.maxSpellLvl)-1] += 1;
		}
		dragon.spells = [];
		for (i = 0; i < spellLevels.length; i++) {
			dragon.spells.push(oddTables.spellBookMu(i+1,spellLevels[i]).join(", "));
		}
	}

	switch (age) {
		case 1: dragon.ageDesc = "very young"; break;
		case 2: dragon.ageDesc = "young"; break;
		case 3: dragon.ageDesc = "sub-adult"; break;
		case 4: dragon.ageDesc = "adult"; break;
		case 5: dragon.ageDesc = "old"; break;
		case 6: dragon.ageDesc = "very old"; break;
	}

	dragon.description = dragon.size + dragon.ageDesc + " " + type.color + " dragon";
	dragon.statLine = "(" + dragon.hd + "hd, " + dragon.hp + "hp, " +
		"breathes " + type.breathShape + " of " + type.breathType + " for " + dragon.hp + " hp)";
	dragon.extras = "This dragon is " + (dragon.sleeping ? "asleep" : "awake");
	if (dragon.castsSpells) {
		dragon.extras += " and can speak and cast these spells: " + dragon.spells;
	} else {
		dragon.extras += " and " + (dragon.talks ? "can speak" : "cannot speak");
	}
	return dragon;
};

oddEncounters.dragonEncounter = function (type) {
	var i, numberEncountered, dragons, maxAge, hoard, result;

	// type = type || 
	// 	dice.pick(dragonTypes.white,dragonTypes.black,dragonTypes.green,dragonTypes.blue,dragonTypes.red,dragonTypes.gold);
	if (!type) {
		switch(dice.d6()) {
			case 1: type = dragonTypes.white; break;
			case 2: type = dragonTypes.black; break;
			case 3: type = dragonTypes.green; break;
			case 4: type = dragonTypes.blue; break;
			case 5: type = dragonTypes.red; break;
			default: type = dragonTypes.gold; break;
		}
	}


	numberEncountered = dice.d4(1);
	dragons = [];
	if (numberEncountered === 1) {
		dragons.push(oddEncounters.dragon(dice.d6(1), type));
	} else if (numberEncountered === 2) {
		dragons.push(oddEncounters.dragon(dice.d3(1)+3, type));
		dragons.push(oddEncounters.dragon(dice.d3(1)+3, type));
	} else if (numberEncountered === 3) {
		dragons.push(oddEncounters.dragon(dice.d3(1)+3, type));
		dragons.push(oddEncounters.dragon(dice.d3(1)+3, type));
		dragons.push(oddEncounters.dragon(1, type));
	} else if (numberEncountered === 4) {
		dragons.push(oddEncounters.dragon(dice.d3(1)+3, type));
		dragons.push(oddEncounters.dragon(dice.d3(1)+3, type));
		dragons.push(oddEncounters.dragon(1, type));
		dragons.push(oddEncounters.dragon(1, type));
	}

	maxAge = 0;
	for (i = 0; i < dragons.length; i++) {
		maxAge = dragons[i].age > maxAge ? dragons[i].age : maxAge;
	}
	if (maxAge >= 6) {
		hoard = oddTables.treasureTypeHDouble();
	} else if (maxAge <= 3) {
		hoard = oddTables.treasureTypeHHalf();
	} else {
		hoard = oddTables.treasureTypeH();
	}

	result = "Dragon Encounter";
	for (i = 0; i < dragons.length; i++) {
		result += "\n" + dragons[i].description + " " + dragons[i].statLine + "\n\t" + dragons[i].extras;
	} 
	result += "\n" + hoard;
	return result;
};


//http://odd74.proboards.com/thread/7606/analysis-od-treasure-types
//includes image of treasure table including prisoners
//2-10 or 2 per 10 for type A water & land, 1-20  or 1 per 20 for type A desert