// ====================================================================
// tables/valuable_items.js
// Spec: Ref Tool Review and Analysis — Valuable Items module
// Exports (globals):
//   - randomValuable(): string  // rolls its own value by band, then formats per Spec v1.2
//   - valuableFromValue(gp): string  // uses provided gp; formats per Spec v1.2
//
// Remember for next chat (wiring + setup text):
// - randomValuable() = independent button
// - valuableFromValue(gp) = integration into oddTables (e.g., 1-in-6 jewelry swap)
// - Later formatting phase: add a Valuables section aggregator/totals (mirror Gems totals)
// ====================================================================

(function(global){
  "use strict";

  // ------------------------------------------------------------
  // A. Dice utilities: use JB's dice if available; else local stubs
  // ------------------------------------------------------------
  const dice = (function(){
    const d = (global.dice && typeof global.dice.d10 === 'function') ? global.dice : null;
    if (d) return global.dice;
    // Local stubs (uniform)
    return {
      d10: () => Math.floor(Math.random()*10)+1,
      d100: () => Math.floor(Math.random()*100)+1,
      pick: (arr) => arr[Math.floor(Math.random()*arr.length)]
    };
  })();

  // ------------------------------------------------------------
  // B. Hooks so we don’t guess external function names
  //    (Set these from outside later if desired)
  // ------------------------------------------------------------
  const hooks = global.valuablesHooks || {};
  // Expected (OPTIONAL):
  // hooks.fmName(), hooks.fmEpithet(alignment)      // alignment for epithet pools: 'L','N','C'
  // hooks.amName(), hooks.amEpithet(alignment)
  // hooks.muName(), hooks.muEpithet(alignment)
  // hooks.clName(alignment), hooks.clPatron(alignment) // alignment: 'L' or 'C' (CL names/patrons must match)
  // hooks.quest() -> string
  // hooks.geas()  -> string
  // hooks.curse() -> string

  function randomAlignLC() { return dice.pick(['L','C']); }
  function randomAlignLNC() { return dice.pick(['L','N','C']); }

  // ------------------------------------------------------------
  // C. Encumbrance by type (p.)
  // ------------------------------------------------------------
  const ENC = {
    JAR: 10, CASE: 25, INSTRUMENT: 50, OBJECT: 100, BOLT: 250, BARREL: 500
  };

  // ------------------------------------------------------------
  // D. Metals (local copies) & Colored Gold palette
  // ------------------------------------------------------------
  const COLORED_GOLD = ['Blue','Green','Red','Purple','White','Pink','Iridescent','Translucent'];
  const PRECIOUS_METALS = ['Electrum','Gold','Silver']; // colored handled separately
  const BASE_METALS = ['Brass','Bronze','Copper','Pewter','Steel','Tin'];

  function pickPreciousMetal() {
    // Small chance to use colored gold; else Electrum/Gold/Silver
    const useColored = (dice.d10() === 1);
    if (useColored) return dice.pick(COLORED_GOLD) + ' Gold';
    return dice.pick(PRECIOUS_METALS);
  }
  function pickBaseMetal() { return dice.pick(BASE_METALS); }

  // ------------------------------------------------------------
  // E. Value tiers
  // ------------------------------------------------------------
  function tierFromValue(gp) {
    if (gp >= 7000) return 'T3_7000_PLUS';
    if (gp >= 4000) return 'T2_4000_6000';
    return 'T1_1000_3000';
  }

  // randomValuable(): pick tier uniformly; roll gp within tier uniformly;
  // round to nearest 100gp; ties (.50) round up.
  function rollValueByTierUniform() {
    const tier = dice.pick(['T1_1000_3000','T2_4000_6000','T3_7000_PLUS']);
    let v;
    if (tier === 'T1_1000_3000') v = 1000 + Math.random()*(3000-1000);
    else if (tier === 'T2_4000_6000') v = 4000 + Math.random()*(6000-4000);
    else v = 7000 + Math.random()*3000; // sample 7k–10k by default
    const rem = v % 100;
    const rounded = rem < 50 ? v - rem : v - rem + 100;
    return Math.max(1000, Math.round(rounded));
  }

  // ------------------------------------------------------------
  // F. Type selection by d10
  // ------------------------------------------------------------
  function pickTypeByD10() {
    const roll = dice.d10();
    if (roll === 1) return 'JAR';
    if (roll === 2 || roll === 3) return 'CASE';
    if (roll === 4) return 'INSTRUMENT';
    if (roll >= 5 && roll <= 7) return 'OBJECT';
    if (roll === 8) return 'BOLT';
    return 'BARREL'; // 9–10
  }

  // ------------------------------------------------------------
  // G. Lists — per tier & type (uniform)
  // ------------------------------------------------------------
  const T1 = {
    JAR: ['Henna powder','Exotic honey','Preserved dates','Pickled eggs','Garum (fish sauce)','Canned fruits','Exotic nuts'],
    CASE: ['Turmeric','Sage','Paprika','Rosemary','Parsley','Thyme','Snuff','Chew','Black tea','Ancient rare cheese rounds'],
    INSTRUMENT: ['Bronze cymbals','Carved drum','Wooden pipes','Silver handbells'],
    OBJECT: ['Brass Lampstand','Table Brass Candelabra','Jeweled Net','Ceramic jar','Enameled gourd','Glass jug','Fine clay pot','Ceremonial mask','Exotic bird plumage','Python hide','Leopard hide','Bear fur'],
    BOLT: ['Cotton','Canvas'],
    BARREL: ['Salt','Fine ale','Java']
  };

  const T2 = {
    JAR: ['Rose oil','Jasmine essence','Aloe','Benzoin'],
    CASE: ['Anise','Cumin','Cardamom','Cloves','Cinnamon bark','Dried ginger','Black Pepper','Red Pepper','Frankincense','Medicinal herbs','White tea','Green tea','Yellow tea'],
    INSTRUMENT: ['Exotic stringed instrument','Ivory horn','Silver flute'],
    OBJECT: ['Alabaster jar','Amphora','Brass Bucket','Aspersorium','Jade Coffer','Ivory Coffer','Ebony Coffer','Puzzle Box','Game set','Jeweled Net','Ebony Chair','Ivory Chair','[Non-precious metal] Bedframe','[Non-precious metal] Table','Wall Mirror','[Non-precious metal] Bath','Standing Brass Candelabra','Table Silver Candelabra','Silver Charger','Curtains with brass rings','Screen of bamboo and rice paper','Incunabula','Crocodile leather','Lion hide','Tiger skin','Elephant hide'],
    BOLT: ['Fine Linen','Scarlet Wool'],
    BARREL: ['Wine','Pipe weed']
  };

  const T3 = {
    JAR: ['Cassia','Kohl for eyes','Exotic rouge','Spike Nard','Sparkling wine','Myrrh'],
    CASE: ['Saffron','Nutmeg','Hashish','Cannabis','Oolong','Rare medicinal herbs','Sandalwood'],
    INSTRUMENT: ['Crystal chimes','Golden lyre','Master craftsman’s harp'],
    OBJECT: ['Statuette of [Statuette/Bust table]','Bust of [Statuette/Bust table]','Painting of [Painting/Tapestry table]','Jeweled Box','[Metal] Throne','Ebony Table','Ivory Table','Standing Mirror','Standing Silver Candelabra','Silver Tea Service','Tapestry of [Painting/Tapestry table]','Parthian Rug','Vase of Old Cathay','Groman Urn','Ermine robe','Mink coat','Jade comb','Porphyry gaming table'],
    BOLT: ['Silk','Cashmere','Tyrian Cloth','Cloth-of-gold'],
    BARREL: ['Distilled spirits of alcohol','Exotic salts']
  };

  // ------------------------------------------------------------
  // H. Statuette/Bust (always enchanted): materials & depictions
  // ------------------------------------------------------------
  const STATUE_MATERIALS = ['Alabaster','Onyx','Porphyry','Obsidian','Rare Wood','Wood','Stone','Marble','Granite','Bronze','Golden','Jade'];

  function depiction_StatuetteBust() {
    const kind = dice.pick(['KING','QUEEN','SAGE','SAINT']);
    if (kind === 'KING') {
      const name = hooks.fmName ? hooks.fmName() : 'Unnamed';
      const epithet = hooks.fmEpithet ? hooks.fmEpithet(randomAlignLNC()) : null;
      const full = epithet ? `${name} the ${epithet}` : name;
      return `King ${full}`;
    }
    if (kind === 'QUEEN') {
      const name = hooks.amName ? hooks.amName() : 'Unnamed';
      const epithet = hooks.amEpithet ? hooks.amEpithet(randomAlignLNC()) : null;
      const full = epithet ? `${name} the ${epithet}` : name;
      return `Queen ${full}`;
    }
    if (kind === 'SAGE') {
      const name = hooks.muName ? hooks.muName() : 'Unnamed';
      const epithet = hooks.muEpithet ? hooks.muEpithet(randomAlignLNC()) : null;
      const full = epithet ? `${name} ${epithet} the Sage` : `${name} the Sage`;
      return full;
    }
    // SAINT / THE DAMNED — alignment L/C, names and patrons must match
    const align = randomAlignLC();
    const saintOrDamned = (align === 'L') ? 'Saint' : 'The Damned';
    const name = hooks.clName ? hooks.clName(align) : 'Unnamed';
    const patron = hooks.clPatron ? hooks.clPatron(align) : 'unknown patron';
    return `${saintOrDamned} ${name} of ${patron}`;
  }

  // ------------------------------------------------------------
  // I. Painting/Tapestry depictions (no enchantment)
  // ------------------------------------------------------------
  const PAINTING_TAPESTRY_DEPICTIONS = [
    'Wilderness landscape',
    'Portrait of [Statuette/Bust image depiction table]',
    'Still life of abundance within a palace',
    'Mythological story',
    'Epic quest',
    'Legendary battle',
    'Grotesque monster',
    'Bucolic Hunting scene'
  ];

  function expandPaintingPortraitDepiction() {
    const inner = depiction_StatuetteBust();
    return `Portrait of ${inner}`;
  }

  // ------------------------------------------------------------
  // J. Enchantments (verbatim). Inline generation for quest/geas/curse via hooks
  // ------------------------------------------------------------
  const ENCHANTMENTS = [
    'Charm the bearer or character will not part from the item',
    'Mesmerize willing subjects',
    'sparkle on its own in darkness, glowing as bright as a candle',
    'Sing a ballad about the bearer',
    'Grant memory of the previous night’s dreams',
    'Present a miniature pyrotechnic display',
    'Serve as a magic mouth for the owner',
    'Ignite tender',
    'Provide deep sleep when placed under pillow at night, +1hp to rest',
    'Heal the bearer, +1hp, once per day',
    'Protect from poison & venom, granting an additional saving throw',
    'Protect from disease, granting an additional saving throw',
    'Protect from vampires (and other level draining attacks), granting a saving throw (or an additional one, if applicable) against one level of life energy drain',
    'Grant a bonus to Charisma when worn',
    'Grant a bonus to [Intelligence/Strength/Wisdom/Constitution/Dexterity]',
    'Restore life to a recently murdered innocent victim',
    'Restore life energy to bearer in exchange for draining life energy from another victim',
    'Place a Quest on the bearer of [index quest table]',
    'Place a Geas on the bearer of [index geas table]',
    'Place a Curse on the bearer of [index curse table]'
  ];

  function expandEnchantment(raw) {
    if (raw.includes('[index quest table]')) {
      const tail = hooks.quest ? hooks.quest() : '[index quest table]';
      return raw.replace('[index quest table]', tail);
    }
    if (raw.includes('[index geas table]')) {
      const tail = hooks.geas ? hooks.geas() : '[index geas table]';
      return raw.replace('[index geas table]', tail);
    }
    if (raw.includes('[index curse table]')) {
      const tail = hooks.curse ? hooks.curse() : '[index curse table]';
      return raw.replace('[index curse table]', tail);
    }
    if (raw.includes('[Intelligence/Strength/Wisdom/Constitution/Dexterity]')) {
      const stat = dice.pick(['Intelligence','Strength','Wisdom','Constitution','Dexterity']);
      return raw.replace('[Intelligence/Strength/Wisdom/Constitution/Dexterity]', stat);
    }
    return raw;
  }

  // ------------------------------------------------------------
  // K. Formatting helpers
  // ------------------------------------------------------------
  function fmtLine(gp, p, text) {
    const gpInt = Math.round(gp);
    const pInt = Math.round(p);
    return `${gpInt}gp. (${pInt}p.) ${text}`;
  }

  function resolveMetalPlaceholders(label, gp) {
    const isT3 = gp >= 7000;
    if (label.includes('[Metal]')) {
      const metal = isT3 ? pickPreciousMetal() : pickBaseMetal();
      label = label.replace('[Metal]', metal);
    }
    if (label.includes('[Non-precious metal]')) {
      const metal = isT3 ? pickPreciousMetal() : pickBaseMetal();
      label = label.replace('[Non-precious metal]', metal);
    }
    return label;
  }

  // ------------------------------------------------------------
  // L. Main generator
  // ------------------------------------------------------------
  function pickItemFor(tier, type, gp) {
    const pool = (tier === 'T1_1000_3000') ? T1 :
                 (tier === 'T2_4000_6000') ? T2 : T3;
    let item = dice.pick(pool[type]);

    // Expand subtables for art
    if (type === 'OBJECT') {
      if (item === 'Statuette of [Statuette/Bust table]') {
        const mat = dice.pick(STATUE_MATERIALS);
        const dep = depiction_StatuetteBust();
        const enchRaw = dice.pick(ENCHANTMENTS);
        const ench = expandEnchantment(enchRaw);
        item = `Statuette of ${mat} depicting ${dep}; enchanted to ${ench}`;
      }
      else if (item === 'Bust of [Statuette/Bust table]') {
        const mat = dice.pick(STATUE_MATERIALS);
        const dep = depiction_StatuetteBust();
        const enchRaw = dice.pick(ENCHANTMENTS);
        const ench = expandEnchantment(enchRaw);
        item = `Bust of ${mat} depicting ${dep}; enchanted to ${ench}`;
      }
      else if (item === 'Painting of [Painting/Tapestry table]') {
        let dep = dice.pick(PAINTING_TAPESTRY_DEPICTIONS);
        if (dep.includes('[Statuette/Bust image depiction table]')) dep = expandPaintingPortraitDepiction();
        item = `Painting depicting ${dep}`; // no enchantment
      }
      else if (item === 'Tapestry of [Painting/Tapestry table]') {
        let dep = dice.pick(PAINTING_TAPESTRY_DEPICTIONS);
        if (dep.includes('[Statuette/Bust image depiction table]')) dep = expandPaintingPortraitDepiction();
        item = `Tapestry depicting ${dep}`; // no enchantment
      }
    }

    // Resolve metal placeholders (7k+ metal furnishings => precious)
    item = resolveMetalPlaceholders(item, gp);

    // Container wording
    if (type === 'JAR')   item = `Jar of ${item}`;
    if (type === 'CASE')  item = `Case of ${item}`;
    if (type === 'BOLT')  item = `Bolt of ${item}`;
    if (type === 'BARREL')item = `Barrel of ${item}`;

    return item;
  }

  function encumbranceForType(type) {
    switch(type){
      case 'JAR': return ENC.JAR;
      case 'CASE': return ENC.CASE;
      case 'INSTRUMENT': return ENC.INSTRUMENT;
      case 'OBJECT': return ENC.OBJECT;
      case 'BOLT': return ENC.BOLT;
      case 'BARREL': return ENC.BARREL;
    }
    return ENC.OBJECT;
  }

  function maybeAddEnchantment(text, type, gp) {
    // Always enchanted already for Statuette/Bust.
    // For 7k+ Objects and Instruments only: 1-in-6 chance to add enchantment (containers excluded).
    const isT3 = gp >= 7000;
    if (!isT3) return text;
    if (!(type === 'OBJECT' || type === 'INSTRUMENT')) return text;

    // true 1-in-6 chance
    if (Math.floor(Math.random()*6) === 0) {
      const enchRaw = dice.pick(ENCHANTMENTS);
      const ench = expandEnchantment(enchRaw);
      if (!/enchanted to /.test(text)) return `${text}; enchanted to ${ench}`;
    }
    return text;
  }

  // ------------------------------------------------------------
  // M. Public API
  // ------------------------------------------------------------
  function valuableFromValue(gp) {
    const tier = tierFromValue(gp);
    const type = pickTypeByD10();
    const item = pickItemFor(tier, type, gp);
    const p = encumbranceForType(type);
    const withMaybeEnch = maybeAddEnchantment(item, type, gp);
    return fmtLine(gp, p, withMaybeEnch);
  }

  function randomValuable() {
    const gp = rollValueByTierUniform();
    return valuableFromValue(gp);
  }

  // ------------------------------------------------------------
  // N. Exports
  // ------------------------------------------------------------
  global.valuableFromValue = valuableFromValue;
  global.randomValuable = randomValuable;

  // ------------------------------------------------------------
  // O. Anchors for coding clarity
  //  // === Value Tier 1000–3000 ===  -> T1 lists above
  //  // === Value Tier 4000–6000 ===  -> T2 lists above
  //  // === Value Tier 7000+ ===      -> T3 lists above
  // ------------------------------------------------------------

  // Optional local smoke tests (commented out)
  // console.log(randomValuable());
  // console.log(valuableFromValue(1200));
  // console.log(valuableFromValue(4800));
  // console.log(valuableFromValue(9000));

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
