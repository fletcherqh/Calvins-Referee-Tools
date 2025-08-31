// names/monsterNames.js
// Calvin's Referee Tools — Monster naming data (dragons first)
// Baby step: DATA ONLY (no generator logic yet).
// After you drop this in `names/monsterNames.js` and load it before your tables,
// you can access it as `window.oddMonsterNames.dragons`.

window.oddMonsterNames = window.oddMonsterNames || {};
window.oddMonsterNames.dragons = {
  gold: {
    familyNames: [
      "Ryuu","Tatsu","Loong","Ming","Tang","Jin"
    ],
    personalNames: [
      "Koku","Kar","Sekir","Akai","Suir","Seir","Hyou","Hakur","Shiroi",
      "Tian","Shen","Fuzang","Di","Ying","Yang","Jiao","Pan","Huang",
      "Fei","Qui","Chi","Zhu","Hong","Shen","Bashe","Teng"
    ]
  },
  // Chaotic-style colors use Prefix + shared Suffix + optional Adjective epithet
  red:   { prefixes: ["Igno","Agni","Verma","Flamo","Phos","Incener"] },
  blue:  { prefixes: ["Amber","Ether","Azur","Sapphi","Ultra","Cerule"] },
  green: { prefixes: ["Verda","Verdu","Viridi","Emera","Beryl","Malachi"] },
  black: { prefixes: ["Shadow","Shad","Penumbra","Ebon","Obsidi","Rave"] },
  white: { prefixes: ["Crysta","Glacia","Achroma","Albino","Alaba","Porcel"] },
  chaotic: {
    suffixes: ["ax","lax","phax","phylax","phyl","thrax"],
    adjectives: [
      "Acrimonious","Atrocious","Blasphemous","Barbarous","Callous","Covetous","Cretinous",
      "Cankerous","Ceremonious","Contentious","Carnivorous","Conspicuous","Contemptuous",
      "Deleterious","Decorous","Disharmonious","Devious","Disastrous","Disingenuous",
      "Duplicitous","Enormous","Erroneous","Eponymous","Envious","Factitious","Fatuous",
      "Felonious","Furious","Ferocious","Fallacious","Fantabulous","Fabulous","Factious",
      "Frivolous","Facetious","Glorious","Glamorous","Gorgeous","Ginormous","Gluttonous",
      "Garrulous","Hideous","Horrendous","Hazardous","Heinous","Injurious","Illustrious",
      "Ingenious","Impervious","Idolatrous","Incautious","Impious","Injudicious",
      "Incommodious","Inharmonious","Infelicitous","Ingenious","Impetuous","Infamous",
      "Invidious","Infectious","Imperious","Ignominious","Indecorous","Inglorious",
      "Iniquitous","Insidious","Insalubrious","Inauspicious","Irreligious","Incongruous",
      "Incestuous","Jealous","Lustrous","Lucious","Litigious","Laborious","Luxurious",
      "Lucifugous","Libidinous","Libelous","Larcenous","Ludicrous","Loquacious","Libelous",
      "Lascivious","Lecherous","Licentious","Malicious","Marvelous","Meticulous","Monstrous",
      "Mischievous","Minacious","Murderous","Murmurous","Mendacious","Monotonous","Mutinous",
      "Misogynous","Marvelous","Malodorous","Nauseous","Nefarious","Noxious","Notorious",
      "Odious","Ominous","Officious","Onerous","Outrageous","Ostentatious","Odorous",
      "Obstreperous","Obnoxious","Odoriferous","Opprobrious","Precious","Prosperous",
      "Prestigious","Prodigious","Portentous","Pernicious","Pompous","Perilous","Pretentious",
      "Preposterous","Pestiferous","Pugnacious","Ponderous","Parsimonious","Promiscuous",
      "Presumptuous","Querulous","Quarrelous","Raucous","Rapacious","Rambunctious","Ravenous",
      "Ruinous","Rancorous","Rampageous","Rebellious","Rivalrous","Riotous","Ridiculous",
      "Rumbustious","Specious","Stupendous","Slanderous","Superfluous","Scrofulous",
      "Sacrilegious","Scabrous","Spurious","Scandalous","Slumberous","Seditious","Suspicious",
      "Tortuous","Tyrannous","Treacherous","Treasonous","Tedious","Tumultuous","Tremendous",
      "Tenacious","Tendentious","Traitorous","Thunderous","Tortious","Troublous","Tempestuous",
      "Torturous","Tendentious","Titonous","Unctuous","Unrighteous","Uproarious","Ungenerous",
      "Ulcerous","Unharmonious","Unhumorous","Unconscientious","Ungracious","Unchivalrous",
      "Usurious","Unscrupulous","Unpropitious","Unmelodious","Vigorous","Villainous",
      "Vociferous","Vaporous","Voluminous","Vulturous","Verminous","Vicious","Venemous",
      "Vexatious","Vainglorious","Vacuous","Voracious","Vertiginous","Wrongous"
    ]
  }
};
