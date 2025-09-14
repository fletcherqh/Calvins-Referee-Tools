// tables/tavern.js
// Calvin’s Referee Tools — Tavern Name generator
// Smoke-testable in console: randomTavernName()

(function (global) {
  "use strict";

  // --- helpers ---
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function coin(n) { return Math.random() < (n || 0.5); }
  function oneIn(n) { return Math.floor(Math.random() * n) === 0; }

  // --- tables ---
  const ADJ = ["Aulden","Ashen","Bald","Bandy","Big","Black","Blue","Bonny","Brass","Bronze","Brown","Burly","Buxom","Copper","Crowing","Dancing","Dark","Dead","Dirty","Dour","Eight","Fell","Fiery","Five","Flaming","Flying","Four","Frosty","Gay","Giddy","Golden","Brand","Green","Grey","Growling","Hale","Happy","Hearty","Homely","Howling","Iron","Ivory","Ivy","Jade","Jolly","Jovial","Joyful","Lame","Large","Leaping","Little","Lone","Long","Lucky","Mean","Merry","Muddy","Murky","Nine","Noble","North","Odd","Old","Olden","Pale","Pure","Raucous","Red","Rising","Roaring","Royal","Ruddy","Running","Savage","Scarlet","Scrawny","Seven","Silver","Singing","Six","Sleeping","Slippery","Small","Smoky","Stout","Sweaty","Tiny","True","Two","Twin","West","White","Wild","Windy","Winking","Wise","Worthy","Ye","Ye Olde","Yodeling"];

  const ANIMAL = ["Antelope","Baboon","Badger","Bass","Bat","Balrog","Beaver","Beetle","Boar","Bullfrog","Bear","Camel","Cat","Chimera","Cock","Cod","Cougar","Crocodile","Crab","Crow","Dinosaur","Doe","Dog","Dolphin","Donkey","Dragon","Duck","Dove","Eagle","Eel","Elk","Elephant","Falcon","Fish","Faun","Fox","Foal","Fowl","Frog","Gazelle","Gander","Goat","Goose","Greyhound","Griffin","Hare","Hart","Harpy","Hawk","Hippogriff","Hog","Horse","Hound","Hyena","Iguana","Jackal","Jaguar","Lamb","Leech","Lizard","Lobster","Lynx","Mare","Mastodon","Medusa","Monkey","Nag","Naga","Octopus","Otter","Owl","Peccary","Pegasus","Pheasant","Pony","Pig","Rabbit","Racehorse","Ram","Rat","Roc","Roe","Scorpion","Seagull","Sealion","Shark","Sphinx","Squid","Stag","Swallow","Swan","Tiger","Toad","Trout","Turtle","Unicorn","Warthog","Whale","Wolf","Wolverine"];

  const PERSON = ["Archer","Angel","Baker","Barbarian","Bard","Bandit","Berserker","Brewer","Brigand","Baron","Beggar","Buffoon","Blacksmith","Cooper","Count","Constable","Champion","Churl","Chief","Dancer","Demon","Devil","Duke","Dwaf","Elf","Earl","Fishwife","Flogger","Freemason","Friar","Friend","Ghost","Giant","Golem","Guardian","Hero","Heroine","Huntsman","Hunter","Hag","Highwayman","Halfling","Hangman","Imp","Jester","Jockey","King","Knave","Knight","Leprechaun","Maiden","Man","Mason","Merman","Mermaid","Miner","Nomad","Nobleman","Nymph","Ogre","Orc","Paladin","Pikeman","Pirate","Pixie","Potter","Prince","Queen","Rogue","Ruler","Sailor","Sage","Sergeant","Squire","Smith","Scribe","Seaman","Saint","Sheriff","Shipwright","Shepherd","Titan","Tailor","Thief","Triton","Troll","Traveler","Vampire","Veteran","Vixen","Vicar","Wanderer","Werewolf","Windwalker","Wench","Witch","Warrior","Yeti","Yachtsman","Zombie"];

  const ITEM = ["Ale","Anchor","Arrow","Bacon","Banner","Barley","Barrel","Battle Axe","Beehive","Boot","Bottle","Bow","Brew","Bridge","Brook","Bugle","Bush","Canteen","Cart","Cask","City","Coach","Copperpiece","Crown","Crossroads","Cup","Dagger","Dock","Elms","Ferry","Fiddle","Flagon","Flail","Flask","Flag","Flute","Foam","Glass","Globe","Glove","Goblet","Grapes","Grove","Goldpiece","Harp","Helm","Horn","Horseshoe","Ivy","Jerkin","Jersey","Jug","Keys","Lantern","Mace","Market","Mead","Moat","Moon","Mug","Net","Oak","Olive-branch","Pillars","Plough","Plume","Posts","Pot","Quiver","Rock","Rod","Rose","Sceptre","Saddle","Shield","Ship","Silverpiece","Staff","Star","Spear","Sun","Sword","Tankard","Thistle","Torch","Tub","Tumbler","Turf","Vault","Vessel","Village","Vine","Wagon","Wand","Wedge","Whistle","Wheatsheaf","Willow","Wheel","Yew Tree"];

  const PARTS = [
    ["[Person]’s Arms"],
    ["[Animal] in Hand"],
    ["[Item] in Hand"],
    ["[Animal]’s Head"],
    ["[Person]’s Head"],
    ["[Person]’s Mug"]
  ];

  const ENDINGS = ["Alehouse","Cellar","Club","Guesthouse","Public House","Inn","Lodge","Meadhall","Resthouse","Tavern","Roadhouse","Hall"];

  // --- builders ---
  function pairFrom(a, b) {
    const left = pick(a), right = pick(b);
    // avoid dupes like "Boar and Boar"
    if (a === b && right === left) return pairFrom(a, b);
    return left + " and " + right;
  }

  function firstSixPairing() {
    // 1–6: the six pairings listed first in the master table
    const roll = Math.floor(Math.random() * 6) + 1;
    switch (roll) {
      case 1: return pairFrom(PERSON, ITEM);
      case 2: return pairFrom(PERSON, ANIMAL);
      case 3: return pairFrom(PERSON, PERSON);
      case 4: return pairFrom(ITEM, ANIMAL);
      case 5: return pairFrom(ANIMAL, ANIMAL);
      case 6: return pairFrom(ITEM, ITEM);
    }
  }

  function partsStyle() {
    const spec = pick(PARTS)[0];
    return spec
      .replace("[Person]", pick(PERSON))
      .replace("[Animal]", pick(ANIMAL))
      .replace("[Item]", pick(ITEM));
  }

  function baseName() {
    // ~1 in 6: use Parts style (“Archer’s Arms”, etc.)
    if (oneIn(6)) return partsStyle();

    const roll = Math.floor(Math.random() * 11) + 1; // 1..11 (master table)
    switch (roll) {
      case 1: return pairFrom(PERSON, ITEM);
      case 2: return pairFrom(PERSON, ANIMAL);
      case 3: return pairFrom(PERSON, PERSON);
      case 4: return pairFrom(ITEM, ANIMAL);
      case 5: return pairFrom(ANIMAL, ANIMAL);
      case 6: return pairFrom(ITEM, ITEM);
      case 7: { // [Adjective] + random from first six
        return pick(ADJ) + " " + firstSixPairing();
      }
      case 8: { // [Adjective], [Adjective] + random from first six
        let a1 = pick(ADJ), a2 = pick(ADJ);
        while (a2 === a1) a2 = pick(ADJ);
        return a1 + ", " + a2 + " " + firstSixPairing();
      }
      case 9: return pick(ADJ) + " " + pick(PERSON);
      case 10: return pick(ADJ) + " " + pick(ITEM);
      case 11: return pick(ADJ) + " " + pick(ANIMAL);
    }
  }

  function maybeEnding(name) {
    // 1:3 chance to add an ending
    if (oneIn(3)) return name + " " + pick(ENDINGS);
    return name;
  }

  function needsThePrefix(name) {
    // Don’t add “The” before “Ye …” styles or if name already begins with an article
    const lower = name.toLowerCase();
    return !(lower.startsWith("ye ") || lower.startsWith("ye olde") || lower.startsWith("the "));
  }

  function randomTavernName() {
    let name = baseName();
    name = maybeEnding(name);
    if (needsThePrefix(name)) name = "The " + name;
    return name;
  }

  // expose
  global.randomTavernName = randomTavernName;

})(window);
