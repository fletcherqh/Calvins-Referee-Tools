
/* Non-module controller (Safari-friendly) with robust action dispatch.
   Tries multiple function name variants for each action and renders to #output or #output-log.
*/
(function(){
  function pickOutput(){
    return document.querySelector('#output') || document.querySelector('#output-log') || null;
  }
  function render(result){
    var out = pickOutput(); if (!out) return;
    var text = (result == null) ? '⚠️ No result returned'
             : (typeof result === 'string') ? result
             : JSON.stringify(result, null, 2);
    var prev = out.textContent || '';
      out.textContent = text + (prev ? '
' + prev : '');
  }
  function renderError(err){
    var out = pickOutput(); if (!out) return;
    out.textContent = '⚠️ ' + (err && err.message ? err.message : err);
  }
  function has(obj, path){
    try {
      var parts = path.split('.'), cur = obj;
      for (var i=0;i<parts.length;i++){ if (cur == null) return false; cur = cur[parts[i]]; }
      return typeof cur !== 'undefined';
    } catch(e){ return false; }
  }
  function get(obj, path){
    var parts = path.split('.'), cur = obj;
    for (var i=0;i<parts.length;i++){ if (cur == null) return undefined; cur = cur[parts[i]]; }
    return cur;
  }
  function firstCallable(paths){
    for (var i=0;i<paths.length;i++){
      var p = paths[i];
      if (typeof p === 'function') return p;
      if (typeof p === 'string' && has(window, p)){
        var f = get(window, p);
        if (typeof f === 'function') return f;
      }
    }
    return null;
  }
  function ensureDice(){
    if (!window.dice){
      throw new Error('Missing dice.js (window.dice not found)');
    }
    return window.dice;
  }
  function actionThief(){
    var dice = ensureDice();
    var f = firstCallable(['oddTables.npcThief','oddTables.rollThief','oddTables.thief','rollThief','npcThief','thief']);
    if (!f) throw new Error('No thief generator found (npcThief/rollThief/thief)');
    return (f.length >= 1) ? f(dice.d10()) : f();
  }
  function actionCleric(){
    var dice = ensureDice();
    var f = firstCallable(['oddTables.npcCleric','oddTables.rollCleric','oddTables.cleric','rollCleric','npcCleric','cleric']);
    if (!f) throw new Error('No cleric generator found (npcCleric/rollCleric/cleric)');
    return (f.length >= 1) ? f(dice.d10()) : f();
  }
  function actionDwarf(){
    var dice = ensureDice();
    var f = firstCallable(['oddTables.npcDwarf','oddTables.rollDwarf','oddTables.dwarf','rollDwarf','npcDwarf','dwarf']);
    if (!f) throw new Error('No dwarf generator found (npcDwarf/rollDwarf/dwarf)');
    return (f.length >= 1) ? f(dice.d10()) : f();
  }
  function actionHalfling(){
    var dice = ensureDice();
    var f = firstCallable(['oddTables.npcHalfling','oddTables.rollHalfling','oddTables.halfling','rollHalfling','npcHalfling','halfling']);
    if (!f) throw new Error('No halfling generator found (npcHalfling/rollHalfling/halfling)');
    return (f.length >= 1) ? f(dice.d10()) : f();
  }
  function actionElf(){
    var dice = ensureDice();
    var two = firstCallable(['oddTables.npcElfTwoLevels','npcElfTwoLevels']);
    if (two){ return two(dice.d4(), dice.d8()); }
    var single = firstCallable(['oddTables.npcElf','oddTables.rollElf','oddTables.elf','rollElf','npcElf','elf']);
    if (!single) throw new Error('No elf generator found (npcElfTwoLevels/npcElf/rollElf/elf)');
    return (single.length >= 1) ? single(dice.d10()) : single();
  }
  var actions = {
    'roll:thief':    actionThief,
    'roll:cleric':   actionCleric,
    'roll:dwarf':    actionDwarf,
    'roll:halfling': actionHalfling,
    'roll:elf':      actionElf
  };
  document.addEventListener('DOMContentLoaded', function(){
    document.body.addEventListener('click', function(e){
      var el = e.target.closest && e.target.closest('[data-action]');
      if (!el) return;
      var fn = actions[el.dataset.action];
      if (!fn) return;
      e.preventDefault();
      try { render(fn()); }
      catch (err) { console.error(err); renderError(err); }
    });
  });
})();
