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

/* global dice, Confluxor, feminineCensusNames, masculineCensusNames, epithets, fighterNames */

/* Declare object */
var oddNames = {
	'version': '0.1',
};

oddNames.feminineConfluxor = new Confluxor();
oddNames.feminineConfluxor.parse(feminineCensusNames.join("\n"),"\n");

oddNames.feminineName = function () {
	return oddNames.feminineConfluxor.generate(1)[0];
};

oddNames.masculineConfluxor = new Confluxor();
oddNames.masculineConfluxor.parse(masculineCensusNames.join("\n"),"\n");

oddNames.masculineName = function () {
	return oddNames.masculineConfluxor.generate(1)[0];
};

//Fighter Names - Calvin
oddNames.fighterName = function () {
	return dice.pick(fighterNames) + " the " + dice.pick(fighterEpithets);
};
//end fighterNames

//Fighter Names - Calvin
oddNames.magicUserName = function () {
	return dice.pick(magicUserNames) + " the " + dice.pick(magicUserEpithets);
};
//end fighterNames

oddNames.epithet = function () {
	return " the " + dice.pick(epithets);
};

oddNames.placePrefix = function () {
	return dice.pick(["Aelf","Ald","Ash","Axe","Barrow","Bear","Bee","Black",
		"Blue","Breeze","Bryn","Byrn","Cant","Caribou","Cedar","Claw","Cloud",
		"Coal","Cold","Copper","Crow","Dark","Dawn","Dead","Deer","Down",
		"Dusk","Dverg","Dwarf","Eagle","East","Elf","Even","Fair","Far",
		"Feast","Fel","Fey","Flax","Fog","Forth","Fox","Frost","Gale","Goat",
		"Gold","Good","Great","Green","Grey","Grief","Grim","Gull","Gyre",
		"Hale","Hammer","Hawk","Hay","Heath","Heather","Hel","Helm","Hemlock",
		"High","Honey","Hoof","Horn","Hot","Ice","In","Iron","Jam","Ken",
		"Kolb","Krak","Light","Long","Lor","Low","Marten","Milk","Mist","Moon",
		"Moose","Moss","Moth","Near","Night","Noon","North","Oak","Old","Orca",
		"Out","Owl","Ox","Pine","Plough","Rabbit","Raven","Red","Rime","Root",
		"Rot","Run","Rye","Salmon","Salt","Sea","Seal","Seed","Shade","Sheave",
		"Shep","Shield","Sig","Silver","Sky","Small","Smoke","South","Spear",
		"Spruce","Stan","Star","Stone","Storm","Sun","Sword","Sæx","Tern",
		"Thorn","Tin","Tooth","Troll","Up","Urd","Wald","Warm","West","Whale",
		"White","Wich","Willow","Witch","Woad","Wolf","Wood","Wool","Wyrm",
		"Yew","Yng","Young"]);
};

oddNames.castleName = function () {
	return oddNames.placePrefix() + dice.pick(["berg","caer","castle","hall","hearth","hold","rock","tower"]);
};

oddNames.townName = function () {
	return oddNames.placePrefix() + dice.pick(["borough","burg","burgh","bury","don","haven","ington","ston","town","wall"]);
};

oddNames.villageName = function () {
	return oddNames.placePrefix() + dice.pick(["gate","field","holm","ley","spring","stead","sted","vale","ville","worth","wich"]);
};

oddNames.hamletName = function () {
	return oddNames.placePrefix() + dice.pick(["ald","back","croft","cote","heath","ham","ingham","thorpe","wald"]);
};

oddNames.swordPrefix = function () {
	return dice.pick(["Aelf","Ald","Ash","Axe","Barrow","Battle","Bear","Bee","Black",
		"Blue","Breeze","Claw","Cloud",
		"Cold","Copper","Crow","Dark","Day","Dawn","Dread",
		"Dusk","Dverg","Dwarf","Eagle","Elf","Fair",
		"Fel","Fey","Fierce","Fiend","Foe","Frost","Gale","Glory",
		"Gold","Good","Grave","Great","Green","Grey","Grief","Grim",
		"Hale","Hawk","Heart","Hel","Helm",
		"High","Horn","Ice","Iron",
		"Leg","Light","Long",
		"Mail",
		"Night","Noon","Oak","Old","Ox",
		"Pale","Raven","Red","Rime",
		"Salt","Sea","Shade","Sheave",
		"Shield","Silver","Sky","Small","Smoke","Spear",
		"Star","Stone","Storm","Sun",
		"Tooth","Troll",
		"War","Wave","White","Wich","Wind","Witch","Wolf","Wood","Wyrm"]);
};

oddNames.swordName = function () {
	return oddNames.swordPrefix() + dice.pick(["beater","biter","blade","brand","breaker","cleaver",
		"cusher","cutter","eater","edge","flame","hammer","maker","thorn","slayer","splitter","sword","sæx"]);
};

/* Orc Tribes 
Grinning Skull
Bloddy Axe
Vile Rune
Red Eye
Death Moon
Broken Bone
Leprous Hand
*/
