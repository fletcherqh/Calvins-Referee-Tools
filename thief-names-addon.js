/*! thief-names-addon.js
 * Ensures a working "Thief (Names)" button in the Names group.
 * - Defines oddNames.thiefName() and oddNames.thiefEpithet() if missing.
 * - Injects a "Thief (Names)" button next to the existing Names buttons.
 * - Uses output() when available, otherwise safely prepends to #output-log/#output.
 */
(function (g) {
  var w = g || window;
  var oddNames = w.oddNames = w.oddNames || {};

  var THIEF_ADJECTIVES = [
    "Hood","Hooded","Cloak","Cloaked","Danger","Grey","Hidden","Silver","Shadow","Shade",
    "Dash","Slim","Swift","Secret","Silent","Spy","Crouching","Whisper","Sharp","Split","Jack","Cold"
  ];
  var THIEF_NOUNS = [
    "Viper","Crawler","Snake","Serpent","Scorpion","Spider","Rat","Ratter","Mouser","Cat",
    "Tiger","Leopard","Snapper","Swiper","Strike","Striker","Fox","Weasel","Stote","Dagger","Knife","Blade"
  ];
  function pick(a){ return a[Math.floor(Math.random()*a.length)]; }

  if (typeof oddNames.thiefName !== "function") {
    oddNames.thiefName = function(){ return pick(THIEF_ADJECTIVES) + " " + pick(THIEF_NOUNS); };
  }

  if (typeof oddNames.thiefEpithet !== "function") {
    oddNames.thiefEpithet = function(){
      var mu = w.magicUserEpithets, nf = w.neutralFightingManAmazonEpithets, cf = w.chaoticFightingManAmazonEpithets;
      function take(arr){ return Array.isArray(arr) && arr.length ? pick(arr) : null; }
      var coin = Math.random() < 0.5, epi = null;
      if (coin) epi = take(mu); else { var c=[nf,cf].filter(x => Array.isArray(x)&&x.length); if (c.length) epi = pick(c); }
      if (!epi) epi = take(mu) || take(nf) || take(cf);
      return epi ? ("the " + epi) : "of the Night";
    };
  }

  w.oddTables = w.oddTables || {};
  if (typeof w.oddTables.safeNpcThief !== "function" && typeof w.oddTables.npcThief === "function") {
    w.oddTables.safeNpcThief = function (level, alignment) {
      try { return w.oddTables.npcThief(level, alignment); }
      catch (e) { var msg=(e&&e.message)?e.message:String(e); return "⚠️ Thief error: " + msg; }
    };
  }

  function safeOutput(text){
    if (typeof w.output === "function") { w.output(text); return; }
    var el = document.getElementById("output-log") || document.getElementById("output");
    if (el) { var prev = el.textContent || ""; el.textContent = text + (prev ? "\\n" + prev : ""); }
    else { console.log(text); }
  }

  function ensureButton() {
    if (document.getElementById("thiefButton")) return;
    var namesGroup =
      document.getElementById("names-buttons") ||
      document.querySelector('#names-buttons, .names-buttons, #names .btn-group, .buttonLabel + .collapse.in');
    var btn = document.createElement("button");
    btn.id = "thiefButton"; btn.className = "btn btn-default btn-xs"; btn.textContent = "Thief (Names)";
    btn.addEventListener("click", function(){
      var name = (oddNames.thiefName ? oddNames.thiefName() : "Hidden Fox");
      var epi  = (oddNames.thiefEpithet ? oddNames.thiefEpithet() : "of the Night");
      safeOutput(name + ", " + epi);
    });
    if (namesGroup) namesGroup.appendChild(btn); else document.body.appendChild(btn);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ensureButton);
  else ensureButton();
})(typeof window !== "undefined" ? window : this);