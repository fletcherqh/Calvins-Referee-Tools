// Non-module controller for file:// usage (Safari-friendly)
(function(){
  function $(sel, root){ return (root||document).querySelector(sel); }
  function render(result){
    var out = $('#output'); if (!out) return;
    var text = (typeof result === 'string') ? result : JSON.stringify(result, null, 2);
    out.textContent = text;
  }
  function renderError(err){
    var out = document.querySelector('#output'); if (!out) return;
    out.textContent = '⚠️ ' + (err && err.message ? err.message : err);
  }

  var actions = {
    'roll:thief': function(){ return window.oddTables && window.dice ? window.oddTables.npcThief(window.dice.d10()) : 'Missing oddTables/dice'; },
    'roll:cleric': function(){ return window.oddTables ? window.oddTables.npcCleric(window.dice.d10()) : 'Missing oddTables/dice'; },
    'roll:dwarf': function(){ return window.oddTables ? window.oddTables.npcDwarf(window.dice.d10()) : 'Missing oddTables/dice'; },
    'roll:halfling': function(){ return window.oddTables ? window.oddTables.npcHalfling(window.dice.d10()) : 'Missing oddTables/dice'; },
    'roll:elf': function(){ return window.oddTables ? window.oddTables.npcElfTwoLevels(window.dice.d4(), window.dice.d8()) : 'Missing oddTables/dice'; }
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
