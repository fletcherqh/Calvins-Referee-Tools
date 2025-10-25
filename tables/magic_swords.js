/*
 * Calvin’s Referee Tools — Perilous Realms
 * tables/magic_swords.js
 *
 * Sections implemented in this drop:
 *   A) OUTPUT FORMAT (locked order & phrasing where fully specified)
 *   B) CORE TABLES (Alignment, Modifiers by Alignment incl. Life-drain & +3 Cursed,
 *                   Target rules and Target Table, Mission (1-in-10), INT/EGO/Fame,
 *                   Make, Inscription (incl. Conditional one-line Quest/Geas))
 *
 * Notes
 * - Later sections (C..H etc.) will be added in subsequent passes; all such areas are
 *   clearly marked TODO with stubs that do not guess beyond A+B.
 * - No GUI wiring here. This module returns strings only; caller logs them.
 * - No globals: exported via magicSwords namespace at the end of the IIFE.
 */

const magicSwords = (() => {
  /* =====================
   * Random helpers
   * ===================== */
  const rng = {
    int: (n) => 1 + Math.floor(Math.random() * n), // 1..n
    pick: (arr) => arr[Math.floor(Math.random() * arr.length)],
    chance: (n, d) => rng.int(d) <= n, // n-in-d
  };

  /* =====================
   * Enums / tags
   * ===================== */
  const ALIGN = Object.freeze({ LAW: 'Lawful', NEU: 'Neutral', CHA: 'Chaotic' });
  const GLOW  = Object.freeze({ [ALIGN.LAW]: 'Blue', [ALIGN.NEU]: 'Green', [ALIGN.CHA]: 'Red' });

  // Special labels that print on the Bonus line (and are echoed in Extraordinary text)
  const SPECIAL = Object.freeze({
    FLAMING: 'Flaming',
    LOCATE: 'Locate Object',
    WISHES: 'Wishes',
    CHARM:  'Charm Person',
    LIFEDRAIN: 'Life-energy Draining',
    CURSED: 'Cursed',
  });

  // Specific target classes (appear as the label after "+X vs.")
  const TARGET = Object.freeze({
    DRAGONS: 'Dragons',
    UNDEAD: 'Undead',
    EVIL_HUMANOIDS: 'Fell',         // prints as class name "Fell" per canon table
    LYCANS: 'Lycanthropes',
    GIANTS: 'Giants',
    FAE: 'Fæ',
    CLASSICAL: 'Classical',         // Acheron style
    GOTHIC: 'Gothic',
    MAGIC_USERS_ENCHANTED: 'Magic-users and Enchanted Monsters',
    MAGIC_USERS_ELEMENTALS: 'Magic-users and Elementals',
    LAW_CLERGY: 'Lawful Clerics',
    CHAOTIC_CLERGY: 'Chaotic Clerics',
    EVIL_CLERGY: 'Evil Clerics',
  });

  /* =====================
   * B1) Alignment (d6: 1–3 L, 4–5 N, 6 C) and inverted re-roll
   * ===================== */
  function rollAlignment() {
    const d = rng.int(6);
    if (d <= 3) return ALIGN.LAW;
    if (d <= 5) return ALIGN.NEU;
    return ALIGN.CHA;
  }
  function rerollAlignmentInverted() {
    const d = rng.int(6);
    if (d <= 3) return ALIGN.CHA; // 1–3 → Chaotic
    if (d <= 5) return ALIGN.NEU; // 4–5 → Neutral
    return ALIGN.LAW;             // 6   → Lawful
  }

  /* =====================
   * B2) Modifiers by Alignment + special cases
   * - Lawful: d6 1–3 +1, 4–5 +2, 6 +3
   * - Neutral: d6 1–3 +1, 4–5 +2, 6 → Life-energy Draining (no numeric bonus, no targets) & inverted alignment re-roll
   * - Chaotic: d6 1–3 +1, 4–5 +2, 6 → +3 Cursed (no target)
   * ===================== */
  function rollBaseByAlignment(alignment) {
    const d = rng.int(6);
    if (alignment === ALIGN.LAW) {
      if (d <= 3) return { type: 'NUM', base: 1 };
      if (d <= 5) return { type: 'NUM', base: 2 };
      return { type: 'NUM', base: 3 };
    }
    if (alignment === ALIGN.NEU) {
      if (d <= 3) return { type: 'NUM', base: 1 };
      if (d <= 5) return { type: 'NUM', base: 2 };
      // 6 → Life-drain special
      return { type: 'LIFEDRAIN' };
    }
    // Chaotic
    if (d <= 3) return { type: 'NUM', base: 1 };
    if (d <= 5) return { type: 'NUM', base: 2 };
    return { type: 'CURSED_PLUS3' };
  }

  /* =====================
   * B3) Target rules and tables
   * ===================== */
  function rollSpecialPlus1Column() {
    const d = rng.int(6);
    if (d <= 3) return { kind: 'VS_DRAGONS', vsTarget: TARGET.DRAGONS, vsBonus: 3 }; // +1, +3 vs Dragons
    if (d <= 5) return { kind: 'SPECIAL', special: SPECIAL.FLAMING };
    // 6 → Special (+1 Special column): 50/50 Locate Object / Wishes
    return { kind: 'SPECIAL', special: rng.chance(1,2) ? SPECIAL.LOCATE : SPECIAL.WISHES };
  }

  function rollTargetTableFor(baseBonus) {
    // For +1 and +2 only. Returns one of:
    //  { type:'NONE' }
    //  { type:'VS', vsBonus, vsClassLabel }
    //  { type:'SPECIAL', special } // Flaming / Wishes / Locate / Charm
    //  { type:'VS_DRAGONS', vsBonus:3, vsClassLabel:'Dragons' }
    const d = rng.int(6);
    if (baseBonus === 1) {
      if (d <= 3) return { type: 'NONE' }; // N/A
      if (d <= 5) return { type: 'VS', vsBonus: 2, vsClassLabel: rollSpecificTargetLabel() };
      // 6 → Special +1 column
      const r = rollSpecialPlus1Column();
      if (r.kind === 'VS_DRAGONS') return { type: 'VS_DRAGONS', vsBonus: 3, vsClassLabel: TARGET.DRAGONS };
      return { type: 'SPECIAL', special: r.special };
    }
    if (baseBonus === 2) {
      if (d <= 3) return { type: 'VS', vsBonus: 3, vsClassLabel: rollSpecificTargetLabel() };
      if (d <= 5) return { type: 'SPECIAL', special: SPECIAL.CHARM };
      return { type: 'NONE' }; // 6 → N/A
    }
    // baseBonus 3 handled elsewhere (always target unless special exceptions handled in B2)
    return { type: 'NONE' };
  }

  // Specific Target Table (d20). Returns the class label string for the Bonus line.
  // Lawful & Neutral column vs Chaotic column mapping per spec.
  function rollSpecificTargetLabel(alignment = ALIGN.LAW) {
    const d = rng.int(20);
    if (alignment === ALIGN.CHA) {
      // Chaotic column
      if (d <= 5)  return TARGET.FAE;                    // 1–5 Fæ
      if (d <= 10) return TARGET.CLASSICAL;              // 6–10 Classical
      if (d <= 14) return TARGET.GOTHIC;                 // 11–14 Gothic
      if (d <= 17) return TARGET.GIANTS;                 // 15–17 Giants
      if (d <= 19) return TARGET.MAGIC_USERS_ELEMENTALS; // 18–19 Magic-users & Elementals
      return TARGET.LAW_CLERGY;                           // 20 Lawful Clerics
    }
    // Lawful & Neutral column
    if (d <= 5)  return 'Fell';                                   // 1–5 Fell (evil humanoids)
    if (d <= 10) return TARGET.UNDEAD;                             // 6–10 Undead
    if (d <= 14) return TARGET.LYCANS;                             // 11–14 Lycanthropes
    if (d <= 17) return TARGET.GIANTS;                             // 15–17 Giants
    if (d <= 19) return TARGET.MAGIC_USERS_ENCHANTED;              // 18–19 Magic-users & Enchanted Monsters
    return 'Evil Clerics';                                         // 20 Evil Clerics
  }

  /* =====================
   * B4) Mission (1-in-10 chance, any sword)
   * - Sets INT=12, EGO=12.
   * - Naming precedence (prefix) handled in later sections; we just record mission target.
   * - Mission line: paralysis for Lawful/Neutral; disintegration for Chaotic; Neutral can apply either as appropriate.
   * ===================== */
  const MISSION_TARGET = Object.freeze({ MAGES:'Magic-users', CLERICS:'Clerics', FIGHTERS:'Fighting-men', POWERS:'Powers', MONSTERS:'Monsters' });
  function maybeRollMission() {
    if (!rng.chance(1,10)) return null; // 1-in-10
    const d = rng.int(6);
    const t = (d===1)?MISSION_TARGET.MAGES:
              (d===2)?MISSION_TARGET.CLERICS:
              (d===3)?MISSION_TARGET.FIGHTERS:
              (d===4||d===5)?MISSION_TARGET.POWERS:MISSION_TARGET.MONSTERS;
    return { target: t };
  }

  function missionSaveEffectForAlignment(alignment) {
    // On successful attack vs opposite alignment (Neutral may attack either):
    // Lawful/Neutral → paralysis; Chaotic → disintegration.
    return (alignment === ALIGN.CHA) ? 'disintegration' : 'paralysis';
  }

  /* =====================
   * B5) INT & Communication
   * ===================== */
  function deriveINT(hasMission, hasTarget) {
    if (hasMission) return 12;
    if (hasTarget)  return rng.int(10) + 2; // d10+2 → 3..12
    return rng.int(12); // d12 → 1..12
  }

  function communicationLine(INT, languagesList) {
    if (INT <= 6) return null; // no line
    if (INT <= 9) return 'Communication: Empathy only';
    if (INT === 10) return `Communication: Empathy, Speaks: ${languagesList.join(', ')}`;
    if (INT === 11) return `Communication: Empathy, Speaks: ${languagesList.join(', ')}; reads magic`;
    // INT >= 12
    return `Communication: Empathy, Telepathy, Speaks: ${languagesList.join(', ')}; reads magic`;
  }

  /* =====================
   * B6) EGO
   * ===================== */
  function deriveEGO(INT, hasMission, hasTarget) {
    if (INT <= 6) return null; // No EGO if INT <= 6
    if (hasMission) return 12;
    if (hasTarget)  return rng.int(12); // d12
    return rng.int(10); // d10
  }

  /* =====================
   * B7) Fame (only if EGO present and EGO ≥ 7)
   * D10: 1 Unknown, 2–3 Obscure, 4–7 Well-known, 8–9 Famous, 10 Renown
   * ===================== */
  function rollFameAdj(EGO) {
    if (EGO == null || EGO < 7) return null;
    const d = rng.int(10);
    if (d === 1) return 'Unknown';
    if (d <= 3)  return 'Obscure';
    if (d <= 7)  return 'Well-known';
    if (d <= 9)  return 'Famous';
    return 'Renown'; // 10
  }

  /* =====================
   * B8) Make (Blade / Hilt)
   * ===================== */
  function rollBlade() {
    const d = rng.int(20);
    if (d === 1) return 'Energy';
    if (d <= 3)  return 'Crystal';
    if (d <= 5)  return 'Gold';
    if (d <= 7)  return 'Silver';
    if (d <= 10) return 'Obsidian';
    return 'Steel';
  }
  function rollHilt() {
    const d = rng.int(10);
    if (d === 1) return 'in hilt of Inlaid with semiprecious stones';
    if (d <= 3)  return 'in hilt of Bone';
    if (d <= 5)  return 'in hilt of Ebony';
    if (d <= 7)  return 'in hilt of Ivory';
    if (d <= 9)  return 'in hilt of Gold';
    return 'in hilt of Inlaid with precious stones';
  }

  /* =====================
   * B9) Inscription
   * ===================== */
  const INSCR = Object.freeze({ ANCIENT:'Ancient', FAY:'Fay', COSMIC:'Cosmic', CYPHER:'Cypher', LOST:'Lost', CONDITIONAL:'Conditional' });

  function rollInscriptionType() {
    const d = rng.int(20);
    if (d <= 5)  return INSCR.ANCIENT;
    if (d <= 10) return INSCR.FAY;
    if (d <= 14) return INSCR.COSMIC;
    if (d <= 17) return INSCR.CYPHER;
    if (d <= 19) return INSCR.LOST;
    return INSCR.CONDITIONAL; // 20
  }

  function chooseLanguageFor(inscrType, alignment) {
    // Base languages for each bucket; this is a light placeholder list for A+B scope.
    const LANG = {
      Common: 'Common', Elven:'Elven', Dwarven:'Dwarven', Alien:'Alien',
      Ancient:'Ancient', Celestial:'Celestial', Elemental:'Elemental', Chthonic:'Chthonic'
    };
    if (inscrType === INSCR.FAY) {
      const d = rng.int(6);
      return (d <= 3) ? LANG.Elven : (d <= 5) ? LANG.Dwarven : LANG.Alien;
    }
    if (inscrType === INSCR.COSMIC) {
      return alignment === ALIGN.LAW ? LANG.Celestial : alignment === ALIGN.NEU ? LANG.Elemental : LANG.Chthonic;
    }
    // Ancient, Cypher, Lost, Conditional → pick a named tongue (Ancient for Ancient; else random suitable)
    if (inscrType === INSCR.ANCIENT) return LANG.Ancient;
    // For Cypher/Lost/Conditional, we still choose an underlying named tongue (use Ancient/Elven/Dwarven/Celestial/Elemental/Chthonic at random)
    const pool = [LANG.Ancient, LANG.Elven, LANG.Dwarven, LANG.Celestial, LANG.Elemental, LANG.Chthonic];
    return rng.pick(pool);
  }

  function questGeasOneLine() {
    // Stub for /tables/quest-geas.js integration — returns one prefixed line.
    // Distribution per spec: 1–3 Quest, 4–5 Geas, 6 Sacrifice-type within Quest/Geas subset.
    const d = rng.int(6);
    if (d <= 3) return `Quest: Recover a relic from a perilous ruin.`;
    if (d <= 5) return `Geas: Swear fealty to the patron and complete their charge.`;
    return `Geas: Offer a costly sacrifice at an ancient altar.`; // sacrifice-style demand represented within Geas subset text
  }

  function cursesParenthetical() {
    // Stub for /tables/curses.js — parenthetical phrase only, no trailing period.
    const pool = [
      'drains bearer\'s vitality',
      'compels cruel speech',
      'hungers for betrayal',
      'whispers in forbidden tongues'
    ];
    return rng.pick(pool);
  }

  /* =====================
   * Name generation — Section C will supply full prefix/suffix rules.
   * For A+B we avoid guessing. Emit a placeholder line that clearly marks TODO.
   * ===================== */
  function nameLinePlaceholder(alignment) {
    // Until Section C, produce a neutral, non-misleading placeholder name.
    // Caller sees a Name line but understands that C will replace this generator.
    const tokens = ['Blade', 'Brand', 'Edge', 'Fang', 'Ward', 'Aegis'];
    return `${rng.pick(tokens)} of ${alignment}`;
  }

  /* =====================
   * Languages list for Communication line
   * - Always include Common first
   * - Second is the inscription language (underlying) unless Cypher/Lost/Conditional, in which case we still include the underlying tongue in parentheses for Inscription, but for languages we include the underlying (not "Cypher/Lost/Conditional")
   * - Additional languages up to INT-based allowance (max 6). A+B only explicitly requires presence/absence; count granularity is left for later sections. We will include Common + underlying only to avoid guessing.
   * ===================== */
  function buildLanguagesList(INT, underlyingTongue) {
    if (INT <= 9) return []; // No languages printed for INT 1–9 per table ("Yes" starts at 10)
    const list = ['Common'];
    if (underlyingTongue && !list.includes(underlyingTongue)) list.push(underlyingTongue);
    return list; // Keep to two entries under A+B remit
  }

  /* =====================
   * Assembler for a single sword
   * ===================== */
  function buildSword() {
    // 1) Alignment first
    let alignment = rollAlignment();

    // 2) Base modifier by alignment (with special cases)
    const basePick = rollBaseByAlignment(alignment);

    // State bag
    const state = {
      alignment,
      baseBonus: null,            // number or null (Life-drain case)
      specials: [],               // array of SPECIAL.* labels (for Bonus line labels)
      extraordinary: [],          // array of effect texts for Extraordinary line
      vs: null,                   // { bonus: number, label: string } or null
      mission: null,              // { target } or null
      INT: null,
      EGO: null,
      fame: null,
      name: null,
      inscription: null,          // { type, text, underlying }
      make: null,                 // { blade, hilt }
      glow: null,
      stMod: 0,                   // ST +# (A+B do not define the math; keep +0 placeholder)
    };

    // Handle special base cases
    if (basePick.type === 'LIFEDRAIN') {
      // Neutral 6 → Life-energy Draining: suppress numeric bonuses; re-roll alignment inverted; no targets
      alignment = rerollAlignmentInverted();
      state.alignment = alignment;
      state.baseBonus = null; // no numeric bonus
      state.specials.push(SPECIAL.LIFEDRAIN);
      state.extraordinary.push('Life-drain.');
    } else if (basePick.type === 'CURSED_PLUS3') {
      // Chaotic 6 → +3 Cursed (no targets)
      state.baseBonus = 3;
      state.specials.push(SPECIAL.CURSED);
      state.extraordinary.push(`Cursed (${cursesParenthetical()}).`);
    } else {
      state.baseBonus = basePick.base; // 1,2,3
    }

    // 3) Target rules
    if (state.baseBonus === 3 && !state.specials.includes(SPECIAL.CURSED)) {
      // +3 always target (except Life-drain/Cursed handled above). Roll on Specific Target Table.
      state.vs = { bonus: 3, label: rollSpecificTargetLabel(alignment) };
    } else if (state.baseBonus === 1 || state.baseBonus === 2) {
      const t = rollTargetTableFor(state.baseBonus);
      if (t.type === 'VS' || t.type === 'VS_DRAGONS') {
        state.vs = { bonus: t.vsBonus, label: t.vsClassLabel };
      } else if (t.type === 'SPECIAL') {
        state.specials.push(t.special);
        // Extraordinary echo for specials (with Wishes count below at print-time)
        if (t.special === SPECIAL.FLAMING) state.extraordinary.push('Ignites combustibles.');
        else if (t.special === SPECIAL.LOCATE) state.extraordinary.push('Locate Object.');
        else if (t.special === SPECIAL.CHARM) state.extraordinary.push('Charm Person.');
        else if (t.special === SPECIAL.WISHES) {
          // Will add exact count at render-time (2d4 remaining)
        }
      }
    }

    // 4) Mission (1-in-10), any sword
    state.mission = maybeRollMission();

    // 5) INT (depends on Mission/Target) & 6) EGO
    state.INT = deriveINT(!!state.mission, !!state.vs);
    state.EGO = deriveEGO(state.INT, !!state.mission, !!state.vs);

    // 7) Fame (only if EGO ≥ 7)
    state.fame = rollFameAdj(state.EGO);

    // 8) Make (Blade/Hilt) and Glow
    state.make = { blade: rollBlade(), hilt: rollHilt() };
    state.glow = GLOW[state.alignment];

    // 9) Inscription
    const insType = rollInscriptionType();
    const underlying = chooseLanguageFor(insType, state.alignment);
    let inscriptionText = '';
    if (insType === INSCR.ANCIENT || insType === INSCR.FAY || insType === INSCR.COSMIC) {
      inscriptionText = `Inscription: Name inscribed in ${underlying}`;
    } else if (insType === INSCR.CYPHER) {
      inscriptionText = `Inscription: Name written in cypher (original tongue: ${underlying})`;
    } else if (insType === INSCR.LOST) {
      inscriptionText = `Inscription: Name has been lost to time (original tongue: ${underlying})`;
    } else {
      // CONDITIONAL
      inscriptionText = `Inscription: Ancient name discernible upon completing geas (${underlying})`;
    }
    state.inscription = { type: insType, text: inscriptionText, underlying };

    // 10) Name line (placeholder until Section C supplies full naming)
    state.name = nameLinePlaceholder(state.alignment);

    return state;
  }

  /* =====================
   * Renderers (to strings) per Section A order
   * ===================== */
  function render(state) {
    const lines = [];

    // 1) Name line
    lines.push(state.name);

    // 2) Bonus (Modifier) line
    //   [Modifier(s)], [target if any], [special quality if any], [fame if applicable] [alignment] Sword
    const parts = [];

    // numeric modifiers (Life-drain is the only case without any numeric bonus)
    if (state.baseBonus != null) parts.push(`+${state.baseBonus}`);

    // +vs phrase
    if (state.vs) parts.push(`+${state.vs.bonus} vs. ${state.vs.label}`);

    // specials (Flaming / Wishes / Locate / Charm / Cursed / Life-drain)
    const specialLabels = [...state.specials];
    if (specialLabels.length) parts.push(specialLabels.join(', '));

    // Build the final segment: [fame if any] + [alignment] + ' Sword' (no comma between fame and alignment)
    const finalSegment = `${state.fame ? state.fame + ' ' : ''}${state.alignment} Sword`;
    parts.push(finalSegment);

    lines.push(parts.join(', '));


    // 3) Stats line: INT [#]  EGO [# if present]  ST +[#]  Glows [Blue/Green/Red] 15’ r.
    const statsBits = [`INT ${state.INT}`];
    if (state.EGO != null) statsBits.push(`EGO ${state.EGO}`);
    statsBits.push(`ST +${state.stMod}`);
    statsBits.push(`Glows ${state.glow} 15’ r.`);
    lines.push(statsBits.join('  '));

    // 4) Mission line (if any)
    if (state.mission) {
      const save = missionSaveEffectForAlignment(state.alignment);
      lines.push(`Mission: slay ${state.mission.target}; opponents save vs ${save}`);
    }

    // 5) Communication line (if any)
    const langs = buildLanguagesList(state.INT, state.inscription.underlying);
    const comm = communicationLine(state.INT, langs);
    if (comm) lines.push(comm);

    // 6) Extraordinary line (if any) — include echo descriptions for specials
    const extra = [...state.extraordinary];
    if (state.specials.includes(SPECIAL.WISHES)) {
      const wishes = rng.int(4) + rng.int(4); // 2d4 remaining
      extra.push(`Grants ${wishes} Wishes.`);
    }
    if (extra.length) lines.push(`Extraordinary: ${extra.join(' ')}`);

    // 7) Detect / Intellectual abilities line (if any)
    // TODO: Implement in later section; omitted if none.

    // 8) Egotistical ability (if EGO ≥ 9) — flavor line ending with a (mechanic tag)
    // TODO: Implement in later section per EGO tables; only emit once added.

    // 9) Make line
    lines.push(`Blade of ${state.make.blade} ${state.make.hilt}`);

    // 10) Inscription line (ALWAYS)
    lines.push(state.inscription.text);

    // 11) Conditional add-on (if inscription is Conditional)
    if (state.inscription.type === INSCR.CONDITIONAL) {
      lines.push(questGeasOneLine());
    }

    return lines.join('\n');
  }

  /* =====================
   * Public API
   * ===================== */
  function randomLine() { return render(buildSword()); }

  return Object.freeze({
    randomLine,
    line: randomLine,
    // Light debug exports to help testing without exposing internals as globals
    _debug: {
      rollAlignment, rerollAlignmentInverted, rollBaseByAlignment, rollTargetTableFor, rollSpecificTargetLabel
    }
  });
})();