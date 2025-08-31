// names/monsterNameHelpers.js
// Tiny generator that reads from names/monsterNames.js data.
// Baby step: expose oddTables.dragonName(color, opts).
// Returns { name, family: <string|null>, suffix: <string|null> }.
//
// Usage examples in console:
//  oddTables.dragonName('Gold')
//  oddTables.dragonName('Red')
//  const a = oddTables.dragonName('Red'); const b = oddTables.dragonName('Red', { suffix: a.suffix });
//  const g1 = oddTables.dragonName('Gold'); const g2 = oddTables.dragonName('Gold', { family: g1.family });

window.testFromHelpers = "helpers loaded";
(function(){
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  window.oddTables = window.oddTables || {};

  window.oddTables.dragonName = function(color, opts = {}) {

    const dataRoot = (window.oddMonsterNames && window.oddMonsterNames.dragons) || {};
    if (!color) return { name: 'Nameless', family: null, suffix: null };

    const key = String(color).toLowerCase();
    const entry = dataRoot[key];
    const chaotic = dataRoot.chaotic;

    if (!entry) return { name: 'Nameless', family: null, suffix: null };

    // GOLD (family + personal), reusable family for pairs
    if (key === 'gold') {
      const family = opts.family || pick(entry.familyNames || []);
      const personal = pick(entry.personalNames || []);
      const full = `${family} ${personal}`;
      return { name: full, family, suffix: null };
    }

    // Chaotic colors: prefix + shared chaotic suffix, optional adjective epithet
    const prefixes = entry.prefixes || [];
    const suffixes = (chaotic && chaotic.suffixes) || [];
    const adjectives = (chaotic && chaotic.adjectives) || [];

    // fallbacks to keep it safe
    const suffix = (typeof opts.suffix === 'string' && opts.suffix.length) ? opts.suffix
                  : (suffixes.length ? pick(suffixes) : '');
    const prefix = prefixes.length ? pick(prefixes) : 'Nameless';
    let base = `${prefix}${suffix}`;

    if (opts.addAdjective && adjectives.length) {
      base = `${base} the ${pick(adjectives)}`;
    }
    return { name: base, family: null, suffix: suffix || null };
  };
})();
