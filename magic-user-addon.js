/*! magic-user-addon.js
 * Ensures oddNames.magicUserName exists and adds a Magic-User Names button if desired.
 * Does not interfere with existing npcWizard; safe wrapper calls it when available.
 */
(function (g) {
  var w = g || window;
  w.oddNames = w.oddNames || {};
  var oddNames = w.oddNames;

  function pick(a){ return a[Math.floor(Math.random()*a.length)]; }

  // Define magic-user name generator if missing
  if (typeof oddNames.magicUserName !== "function") {
    var MU_FIRST = ["Ael","Bel","Cal","Del","El","Fel","Gal","Hel","Iol","Jor","Kel","Lor","Mel","Nel","Orl","Pel","Quel","Rel","Sel","Tel","Ul","Vel","Wel","Xel","Yel","Zel"];
    var MU_LAST  = ["adan","azar","bor","cad","dan","ean","fiel","gorn","har","ian","jor","kas","lor","mor","nar","or","phas","qen","ras","sor","tor","ul","vor","wyr","xen","yor","zor"];
    oddNames.magicUserName = function(){
      return pick(MU_FIRST) + pick(MU_LAST);
    };
  }

  // Define epithet accessor if project doesn't expose one; prefer global magicUserEpithets
  if (typeof oddNames.magicUserEpithet !== "function") {
    oddNames.magicUserEpithet = function(){
      var arr = w.magicUserEpithets;
      if (Array.isArray(arr) && arr.length) return pick(arr);
      return "Mysterious";
    };
  }

})(typeof window !== "undefined" ? window : this);