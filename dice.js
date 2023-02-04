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

/* Declare dice object */
var dice = {
	'version': '1.0.2',
};

/* basic randomization helpers */
dice.randomIntFromInterval = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

/* core dice/numeric functions */
dice.d = function (number, sides) {
	var i, result;
	number = (typeof number === "number") ? number : 1;
	number = (number < 1) ? 1 : number;
	sides = (typeof sides === "number") ? sides : 6;
	sides = (sides < 2) ? 2 : sides;
	result = 0;
	for (i = 0; i < number; i += 1) {
		result += dice.randomIntFromInterval(1,sides);
	}
	return result;
};

dice.pool = function (sides, pool, threshold) {
	var i, roll, successes, fumble, result;
	result = "";
	successes = 0;
	fumble = true;
	for (i = 0; i < pool; i++) {
		roll = dice.d(1, sides);
		if (roll >= threshold) {
			successes += 1;
			fumble = false;
		} else if (roll === 1) {
			successes -= 1;
		}
		result = result + roll + ", ";
	}
	if (fumble && successes < 1) {
		return result + "fumble!";
	} else if (successes < 1) {
		return result + "failure";
	}
	return result + successes + " successes";
};

dice.sr4Pool = function (poolSize) {
	var i, successes;
	successes = 0;
	for (i = 0; i < poolSize; i++) {
		successes += dice.d6() > 3 ? 1 : 0
	}
	return successes;
};

dice.parse = function (formula, loud) {
	var pattern, matches, number, sides, mult, multOp, add, addSign, result;
	pattern = /([1-9]\d*)?[dD]([1-9]\d*)?([/x*÷][1-9]\d*)?([-+]\d+)?/;
	matches = pattern.exec(formula);
	if (matches === null) {
		return "Sorry, couldn't parse your dice formula";
	}
	number = Number(matches[1]);
	sides = Number(matches[2]);
	result = dice.d(number, sides);
	if (matches[3]) {
		multOp = matches[3].substring(0,1);
		if (multOp === "/") {
			multOp = "÷";
		}
		mult = Number(matches[3].substring(1,matches[3].length));
		if (multOp === "÷") {
			result = Math.round(result / mult);
		} else {
			multOp = "x";
			result *= mult;
		}
	} else {
		multOp = "x";
		mult = 1;
	}
	if (matches[4]) {
		addSign = (matches[4].substring(0,1));
		add = Number(matches[4].substring(1,matches[4].length));
		if (addSign == "-") {
			result -= add;
		} else {
			result += add;
		}
	} else {
		addSign = "+";
		add = 0;
	}
	if (loud) {
		return number + "d" + sides +
			(mult !== 1 ? multOp + mult : "") +
			(add !== 0 ? addSign + add : "") +
			":" + result;
	} else {
		return result;
	}
};

/* make multiple rolls, e.g. 3d6 7 times, giving independent results */
dice.multiple = function (rolls, number, sides) {
	var result, i;
	result = "";
	for (i = 0; i < rolls; i++) {
		result += dice.d(number, sides) + "\t";
	}
	return result;
};

/* roll dice numbered -1, 0, and +1 */
dice.fudge = function (number) {
	var i, result;
	number = (typeof number === "number") ? number : 1;
	number = (number < 1) ? 1 : number;
	result = 0;
	for (i = 0; i < number; i += 1) {
		result += dice.randomIntFromInterval(1,3) - 2;
	}
	return result;
};

/* list convenience functions */
dice.pick = function (list) {
	var newList;
	//if it's an array, return a random element
	if (Array.isArray(list)) {
		return list[dice.randomIntFromInterval(0, list.length-1)];
	} else if (typeof list === "object") {
		//if it's an object, return a random property
		newList = [];
		for (var key in list) {
  			if (list.hasOwnProperty(key)) {
    			newList[newList.length] = list[key];
  			}
		}
		if (newList.length > 0) {
		return dice.pick(newList);
		}
	}
	//just return the thing itself; it'll probably be stringified
	return list;
};

/* boolean convenience functions */
dice.flip = function() {
	return (dice.d2() === 1) ? true : false;
};

dice.percentChance = function (chance) {
	chance = (typeof chance === "number") ? chance : 50;
	return (dice.d100() <= chance);
};

dice.permilleChance = function (chance) {
	chance = (typeof chance === "number") ? chance : 500;
	return (dice.d1000() <= chance);
};

dice.permyriadChance = function (chance) {
	chance = (typeof chance === "number") ? chance : 5000;
	return (dice.d10000() <= chance);
};

dice.chanceIn6 = function(chance) {
	chance = (typeof chance === "number") ? chance : 3;
	return (dice.d6() <= chance);
};

dice.chanceIn20 = function(chance) {
	chance = (typeof chance === "number") ? chance : 10;
	return (dice.d20() <= chance);
};

/* dice/numeric convenience functions */
dice.d0 = function () { return 0; };
dice.d1 = function (number) { return number; };
dice.d2 = function (number) { return dice.d(number, 2); };
dice.d3 = function (number) { return dice.d(number, 3); };
dice.d4 = function (number) { return dice.d(number, 4); };
dice.d5 = function (number) { return dice.d(number, 5); };
dice.d6 = function (number) { return dice.d(number, 6); };
dice.d7 = function (number) { return dice.d(number, 7); };
dice.d8 = function (number) { return dice.d(number, 8); };
dice.d9 = function (number) { return dice.d(number, 9); };
dice.d10 = function (number) { return dice.d(number, 10); };
dice.d11 = function (number) { return dice.d(number, 11); };
dice.d12 = function (number) { return dice.d(number, 12); };
dice.d13 = function (number) { return dice.d(number, 13); };
dice.d14 = function (number) { return dice.d(number, 14); };
dice.d15 = function (number) { return dice.d(number, 14); };
dice.d16 = function (number) { return dice.d(number, 16); };
dice.d17 = function (number) { return dice.d(number, 17); };
dice.d18 = function (number) { return dice.d(number, 18); };
dice.d19 = function (number) { return dice.d(number, 19); };
dice.d20 = function (number) { return dice.d(number, 20); };
dice.d24 = function (number) { return dice.d(number, 24); };
dice.d30 = function (number) { return dice.d(number, 30); };
dice.d34 = function (number) { return dice.d(number, 34); };
dice.d48 = function (number) { return dice.d(number, 48); };
dice.d50 = function (number) { return dice.d(number, 50); };
dice.d60 = function (number) { return dice.d(number, 60); };
dice.d100 = function (number) { return dice.d(number, 100); };
dice.d120 = function (number) { return dice.d(number, 120); };
dice.d1000 = function (number) { return dice.d(number, 1000); };
dice.d10000 = function (number) { return dice.d(number, 10000); };

/* playing cards */
dice.cardSuit = function () { return dice.pick(["♥","♠","♦","♣"]); };
dice.cardRank = function () { return dice.pick(["A","2","3","4","5","6","7","8","9","10","J","Q","K"]); };
dice.card = function () { return dice.cardRank() + dice.cardSuit(); };

/* specialized dice for assorted games */
dice.dF = function (number) {
	return dice.fudge(number); 
};

dice.travD66 = function () {
	return (dice.d6(1)*10) + dice.d6(1);
};

dice.inNomineD666 = function () {
	var roll1, roll2, roll3;
	roll1 = dice.d6(1);
	roll2 = dice.d6(1);
	roll3 = dice.d6(1);
	if (roll1 === 1 && roll2 === 1 && roll3 === 1) {
		return "divine intervention";
	} else if (roll1 === 6 && roll2 === 6 && roll3 === 6) {
		return "infernal intervention";
	} else {
		return (roll1+roll2) + ":" + roll3;
	}
};

dice.dMathematicians = function () {
	return dice.pick("0","1","i","e","φ","π");
};