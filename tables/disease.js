/* Calvin Wargaming • Disease v1.0.1 */
(function () {
  const DISEASES = [
    { name: "Lycanthropy",                dice: "1d6", unit: "months" },
    { name: "Leprosy",                    dice: "1d6", unit: "weeks" },
    { name: "Mummy Rot",                  dice: "1d6", unit: "days" },
    { name: "The Ague (Malaria)",         dice: "1d6", unit: "hours" },
    { name: "Hydrophobia (Rabies)",       dice: "1d6", unit: "turns" },
    { name: "The Black Plague (Bubonic)", dice: "1d3", unit: "turns" },
    { name: "The Red Death",              dice: "1d6", unit: "rounds/1 turn" },
    { name: "Cordycepsis (Zombification)",dice: "1d3", unit: "rounds/1 mv" }
  ];

  function roll(expr) {
    const m = String(expr).trim().match(/^(\d+)d(\d+)([+-]\d+)?$/i);
    if (!m) throw new Error("Bad dice expression: " + expr);
    const n = parseInt(m[1], 10);
    const sides = parseInt(m[2], 10);
    const mod = m[3] ? parseInt(m[3], 10) : 0;
    let total = 0;
    for (let i = 0; i < n; i++) total += 1 + Math.floor(Math.random() * sides);
    return total + mod;
  }

  function pluralize(unit, n) {
    if (unit.includes("/")) return unit; // keep "rounds/1 turn" literal
    if (n === 1 && unit.endsWith("s")) return unit.slice(0, -1);
    return unit;
  }

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function buildSentence(d) {
    const n = roll(d.dice);
    const unit = pluralize(d.unit, n);
    return `${d.name} which, left untreated, will result in death in ${n} ${unit}`;
  }

  function randomDisease() {
    const d = pick(DISEASES);
    return buildSentence(d);
  }

  function randomDiseaseContract() {
    return `Character contracts ${randomDisease()}`;
  }

  // expose globals
  window.randomDisease = randomDisease;
  window.randomDiseaseContract = randomDiseaseContract;
})();
