// tables/quest-geas.js
// Calvin's Referee Tools — Quest & Geas (console-testable)
// Public API: randomGeasContract(), randomQuestContract()

/* ---------- helpers ---------- */
function rg_roll(n, d) {
  let t = 0;
  for (let i = 0; i < n; i++) t += Math.floor(Math.random() * d) + 1;
  return t;
}
function rg_choice(a) { return a[Math.floor(Math.random() * a.length)]; }
function rg_distancePhrase() {
  // Distance formula: roll d6 for # of d6, then roll that many d6; sum * 5 miles.
  const howMany = rg_roll(1, 6);
  const miles = rg_roll(howMany, 6) * 5;
  let dir = (typeof randomDirection8 === "function") ? randomDirection8() : "north";
  // Avoid "to the the ..." if dir already includes an article
  const needsThe = !/^the\s+/i.test(dir);
  return `${miles} miles to ${needsThe ? 'the ' : ''}${dir}`;
}

/* ---------- base tables ---------- */
// Action table (d20 result 18–20)
const RG_ACTIONS = [
  {t:"Expectorate"}, {t:"Spin around"}, {t:"Stomp"}, {t:"Jump"}, {t:"Clap"},
  {t:"Sing"}, {t:"Whistle"}, {t:"Scream"}, {t:"Throw rock"}, {t:"Light a fire"},
  {t:"Dig hole"},
  {t:"Smell", needs:"object"},
  {t:"Listen to", needs:"object"},
  {t:"Watch", needs:"object"},
  {t:"Contemplate", needs:"object"},
  {t:"Note plants"}, {t:"Note stars"}, {t:"Note wind"}, {t:"Note birds"},
  {t:"Sacrifice", needs:"creature"}
];

// Creature table
const RG_DRAGONS  = ["a Golden Dragon","a Red Dragon","a Blue Dragon","a Green Dragon","a Black Dragon","a White Dragon"];
const RG_GIANTS   = ["an ogre","a troll","a Hill Giant","a Hill Giant","a Stone Giant","a Frost Giant","a Fire Giant","a Cloud Giant","a Cyclops","a Titan"];
const RG_FLYERS   = ["a Pegasus","a Roc","a Chimera","a Hippogriff","a Griffon","a Manticore","a Wyvern","a teradactyl"];
const RG_LYCANS   = ["a Werewolf","a Werewolf","a Werebear","a Weretiger","a Wererat","a Wereboar"];
const RG_UNDEAD   = ["a skeleton","a zombie","a ghoul","a wight","a wraith","a mummy","a spectre","a vampire"];
const RG_POWERS   = ["a demon","a demon","a daemon","a god","a goddess","an angel"];

const RG_CREATURES_CORE = [
  "a Fighting-man","a Magic-user","a Cleric","a Thief","an Elf","a Dwarf","a Hobbit",
  "a pilgrim","a merchant","a damsel"
];
function rg_creature() {
  const buckets = [
    () => rg_choice(RG_CREATURES_CORE),
    () => rg_choice(RG_DRAGONS),
    () => rg_choice(RG_GIANTS),
    () => rg_choice(RG_FLYERS),
    () => rg_choice(RG_LYCANS),
    () => rg_choice(RG_UNDEAD),
    () => rg_choice(RG_POWERS),
    () => {
      if (typeof randomMonsterContract === "function") {
        const um = randomMonsterContract();
        if (um && typeof um === "string" && um.trim().length > 0) return um;
      }
      return "a unique monster";
    }
  ];
  return rg_choice(buckets)();
}

// Object table
const RG_OBJECTS = [
  "a Leaf","a Root","a Pebble","an Egg","Bones","Sand","a Spear","a Sword","a Scroll",
  "Offal","Water","Fungus","a Ring","a Dagger","a Gem","a Chest","a Bottle","Sandals","a Quill","a Sack"
];

/* ---------- mission generator ---------- */
function rg_object() { return rg_choice(RG_OBJECTS); }

function rg_mission() {
  const d = rg_roll(1, 20);

  // 18–20: action
  if (d >= 18) {
    const a = rg_choice(RG_ACTIONS);
    if (a.needs === "object") return `${a.t} ${rg_object()}.`;
    if (a.needs === "creature") return `${a.t} ${rg_creature()}.`;
    return `${a.t}.`;
  }

  // 10–17: predicate for Creature (some require travel)
  if (d >= 10) {
    const verb = rg_choice(["Guard","Destroy","Locate","Escort","Fetch","Rescue"]);
    let target = rg_creature();
    // If the chosen creature came back as a full “contract” (from randomMonsterContract),
    // keep it as-is; otherwise it's a short noun phrase.
    const needsTravel = ["Locate","Escort","Fetch","Rescue"].includes(verb);
    const travel = needsTravel ? ` ${rg_distancePhrase()}` : "";
    return `${verb} ${target}${travel}.`;
  }

  // 1–9: predicate for Object (some require travel)
  const verb = rg_choice(["Rescue","Carry","Fetch","Locate","Destroy","Guard"]);
  const obj = ` ${rg_object()}`;
  const needsTravel = ["Rescue","Carry","Fetch","Locate"].includes(verb);
  const travel = needsTravel ? ` ${rg_distancePhrase()}` : "";
  return `${verb}${obj}${travel}.`;
}

/* ---------- public contracts ---------- */
function randomGeasContract() {
  const lines = [];
  lines.push(`Save or Character must ${rg_mission()}`);
  lines.push(`Character makes additional save if geas conflicts with character’s alignment or if performance would result in immediate or obvious death.`);
  // Poor wording 1-in-6
  if (rg_roll(1,6) === 1) {
    lines.push(`Character makes additional save due to poor wording of the geas.`);
  }
  lines.push(`4d6 CON check or victim loses 1 CON point per day of ignoring command.`);
  lines.push(`Death at CON 0.`);
  return lines.filter(Boolean).join("\n");
}

/* ---------- simple-line geas ---------- */
function randomGeas() {
  // Returns a single one-line geas, using the same mission generator as randomGeasContract.
  return rg_mission();
}

function randomQuestContract() {
  const lines = [];
  lines.push(`Save or Character must ${rg_mission()}`);
  lines.push(`Character makes additional save if quest conflicts with character’s alignment or if performance would result in immediate or obvious death.`);
  // Poor wording 1-in-6
  if (rg_roll(1,6) === 1) {
    lines.push(`Character makes additional save due to poor wording of the quest.`);
  }
  const curseText = (typeof randomCurseContract === "function")
    ? randomCurseContract()
    : "Character cursed with a grievous malediction.";
  lines.push(`Failure to comply: ${curseText}`);
  return lines.filter(Boolean).join("\n");
}

/* ---------- GUI glue (optional) ---------- */
function geasButton()  { printToLog(randomGeasContract()); }
function questButton() { printToLog(randomQuestContract()); }

// expose for gems/jewelry subtables
window.randomGeas        = randomGeas;
window.randomGeasContract  = randomGeasContract;
window.randomQuestContract = randomQuestContract;
