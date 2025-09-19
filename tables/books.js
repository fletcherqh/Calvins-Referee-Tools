// tables/books.js
// Calvin’s Referee Tools — Book generator (console smoke-testable)
// Usage: output(randomBook())  or  output(bookFromValue(1200))

(function (global) {
  "use strict";

  // ---------- dice helpers ----------
  var D = (typeof dice !== "undefined") ? dice : {
    d6:  function (n) { n = n || 1; var s=0; for (var i=0;i<n;i++) s += 1+Math.floor(Math.random()*6);  return s; },
    d10: function (n) { n = n || 1; var s=0; for (var i=0;i<n;i++) s += 1+Math.floor(Math.random()*10); return s; },
    d12: function (n) { n = n || 1; var s=0; for (var i=0;i<n;i++) s += 1+Math.floor(Math.random()*12); return s; },
    d100:function (n) { n = n || 1; var s=0; for (var i=0;i<n;i++) s += 1+Math.floor(Math.random()*100);return s; },
    pick:function (arr){ return arr[Math.floor(Math.random()*arr.length)]; },
    Extraction:function(){ return "Ivory Sea"; }
  };
  function pick(a){ return D.pick(a); }
  function oneIn(n){ return D.d100(1) <= Math.floor(100/n); }
  function fiftyFifty(){ return D.d100(1) <= 50; }

  // ---------- number table ----------
  function numberTable(){
    var n = D.d12(1);
    if (n === 10 && oneIn(6)) {
      var r = D.d100(1); while (r < 13) r = D.d100(1); n = r;
    }
    var words = {1:"Singular",2:"Twin",3:"Triple",4:"Four",5:"Five",6:"Six",7:"Seven",8:"Eight",9:"Nine",10:"Ten",11:"Eleven",12:"Twelve"};
    return { n:n, word: (n<=12 ? words[n] : String(n)) };
  }
  function pluralForm(base, n){
    if (n === 1) return base;
    if (base==="Strategy")   return "Strategies";
    if (base==="Exercise")   return "Exercises";
    if (base==="Oracle")     return "Oracles";
    if (base==="Sage")       return "Sages";
    if (base==="Sutra")      return "Sutras";
    if (base==="Vision")     return "Visions";
    if (base==="Showing")    return "Showings";
    if (base==="Revelation") return "Revelations";
    return base + "s";
  }

  // ---------- name helpers (pull from existing globals if present) ----------
  function muName(){
    if (typeof magicUserNames !== "undefined" && magicUserNames.length) return pick(magicUserNames);
    if (typeof maleMagicUserNames !== "undefined" && typeof femaleMagicuserNames !== "undefined") {
      return pick(fiftyFifty() ? maleMagicUserNames : femaleMagicuserNames);
    }
    return "Nameless Magus";
  }
  function clericName(isChaotic){
    var maleLaw = (typeof LawfulMaleClericNames !== "undefined") ? LawfulMaleClericNames : [];
    var femLaw  = (typeof LawfulFemaleClericNames !== "undefined") ? LawfulFemaleClericNames : [];
    var maleCh  = (typeof ChaoticMaleClericNames !== "undefined") ? ChaoticMaleClericNames : [];
    var femCh   = (typeof ChaoticFemaleClericNames !== "undefined") ? ChaoticFemaleClericNames : [];
    var pool = isChaotic ? (fiftyFifty()?maleCh:femCh) : (fiftyFifty()?maleLaw:femLaw);
    return pool.length ? pick(pool) : "Unnamed Cleric";
  }
  function clericPatron(isChaotic){
    var law = (typeof LawfulClericPatrons !== "undefined") ? LawfulClericPatrons : [];
    var ch  = (typeof ChaoticClericPatrons !== "undefined") ? ChaoticClericPatrons : [];
    var pool = isChaotic ? ch : law;
    return pool.length ? pick(pool) : "The Unknown Patron";
  }
  function clericOrder(isChaotic){
    var law = (typeof LawfulClericOrders !== "undefined") ? LawfulClericOrders : [];
    var ch  = (typeof ChaoticClericOrders !== "undefined") ? ChaoticClericOrders : [];
    var pool = isChaotic ? ch : law;
    return pool.length ? pick(pool) : "Order of the Veil";
  }
  function fmName(){ return (typeof fightingManNames !== "undefined" && fightingManNames.length) ? pick(fightingManNames) : "Hector"; }
  function amName(){ return (typeof amazonNames      !== "undefined" && amazonNames.length)      ? pick(amazonNames)      : "Bellona"; }
  function monarchAndName(){ return fiftyFifty() ? {title:"King",  name:fmName()} : {title:"Queen", name:amName()}; }

  // ---------- other sources ----------
  function extraction(){ return (typeof D.Extraction === "function") ? D.Extraction() : "Ivory Sea"; }
  function exilePhrase(){ return (typeof exileTable === "function") ? exileTable() : "the Ethereal Plane"; }

  // ---------- arcane book types ----------
  var typePrepositional = [
    "Album of","Lexicon of","Cyclopedia of","Compendium of","Manual of","Enchiridion of",
    "Essays on","Dissertation Concerning","Thesis Concerning","Treatise Concerning",
    "Hypothesis of","Theory of","Tablet of","Book of","Codex of","Tome of","Notes on","Guide to","Principles of"
  ];
  var typeAdjectival   = ["Simplified","Introductory","Elementary","Intermediate","Advanced","Complex"];
  var typeSubjectFirst = ["for Dummies","for the Mentally Insane","for the Completely Deranged","for the Morally Degenerate","for Absolute Beginners","for Experts","for the Adept","Made Simple"];

  // ---------- subjects ----------
  var elements  = ["Earth","Water","Air","Fire","Ether"];
  var festivals = ["Imbolc","Midsommer","Samhain","Yule"];

  function theoreticalSubject(){
    var num = numberTable();
    var list = [
      "Astrology","Alchemy","Cosmogony","Cosmology","Cryptozoology","Physics","Changes","Arcana",
      "Asceticism","Sacrifice","Ritual","Contemplation","Theoretic Philosophy","Metaphysics",
      "Obscurities","Oddities","The Unexplained","Magical Rhetoric","Paradoxical Logic",
      "Somatic Mimetic Memorization of Spells for Instantaneous Casting",
      "Magnetism: Make it Work for You","Demonology","Necronomicon","Music of the Spheres",
      "Prestidigitation","Ventriloquy","Illusion","Phantasmagoria","Fantastical Husbandry","Fantastical Horticulture",
      "The Element of " + pick(elements),
      "Materia Prima",
      "Journey to the Elemental Plane of " + pick(elements),
      "Journey to " + exilePhrase(),
      "Legends of " + (fiftyFifty()?fmName():amName()),
      "Lore of "     + (fiftyFifty()?fmName():amName()),
      "Flora & Fauna of the " + extraction(),
      "Bestiary of the "      + extraction(),
      "Lapidary of the "      + extraction(),
      "Herbalistic Journal of the " + extraction(),
      "Cosmograph of " + exilePhrase(),
      num.word + " " + pluralForm("Revelation", num.n) + " of the Night Sky"
    ];
    return pick(list);
  }

  function arcanaSubject(){
    var list = [
      "Apotropy","Cosmic Resonance","Gematria","Transformations","Sympathetic Magic: Feel it Out for Yourself",
      "Sorcery","Enchantment","Incantation","Summoning","Geomancy","Astromancy","Divination",
      "Necromancy","Spagyrics","Attainment of the Opus Magnus","Apotropaic Magic","Thaumaturgy","Theurgy",
      "Spirit Mediation","Vision-quest","Conjuration","Adept Attainment","Mystagogy","Wizardry",
      "Invocation","Manifestation","Astral Projection"
    ];
    return pick(list);
  }

  function arcaneTitle(isTheoretical) {
   var subject = isTheoretical ? theoreticalSubject() : arcanaSubject();
   var owner = muName() + "'s ";
   var family = D.d6(1); // 1–2 prepositional, 3–4 adjectival, 5–6 subject-first
   if (family <= 2) {
    return owner + pick(typePrepositional) + " " + subject;
   } else if (family <= 4) {
    return owner + pick(typeAdjectival) + " " + subject;
   } else {
    var suffix = pick(typeSubjectFirst);
    return owner + subject + (suffix === "Made Simple" ? " Made Simple" : " " + suffix);
   }
  }


  // ---------- clerical titles ----------
  function scriptureTitle(isChaotic){
    var cn = clericName(isChaotic);
    var pt = clericPatron(isChaotic);
    var num = numberTable();
    var mq  = monarchAndName();
    var simplePlural = function(w){ return fiftyFifty()? w : (w+"s"); };

    var opts = [
      "Classic of the " + extraction(),
      "Canon of " + cn,
      simplePlural("Oracle") + " of the " + extraction(),
      "Psalms of " + mq.title + " " + mq.name,
      "Odes of " + mq.title + " " + mq.name,
      "Prophecies of " + pt,
      "Apocalypse of " + cn,
      "Testament of " + pt,
      "Chronicle of the " + extraction(),
      "History of the " + extraction(),
      "Annals of the " + extraction(),
      "Laws of " + pt,
      pt + "'s Rites of " + pick(festivals),
      cn + "'s " + num.word + " " + pluralForm("Vision",      num.n) + " of " + exilePhrase(),
      cn + "'s " + num.word + " " + pluralForm("Showing",     num.n) + " of " + exilePhrase(),
      cn + "'s " + num.word + " " + pluralForm("Revelation",  num.n) + " of " + exilePhrase(),
      "Proverbs of King " + fmName(),
      "Maxims of " + cn,
      "Sayings of " + cn,
      "Analects of " + muName(),
      pluralForm("Sutra", 2) + " of the " + num.word + " " + pluralForm("Sage", num.n),
      "Puranas of the " + num.word + " " + pluralForm("Sage", num.n),
      "Songs of " + pt,
      "Epic of " + pt,
      "Prayers of " + cn,
      "Epistles of " + cn + " to the Church of the " + extraction(),
      "Sufferings of " + pt,
      "Instructions of " + pt
    ];
    return pick(opts);
  }

  function theologyTitle(isChaotic){
    var cn  = clericName(isChaotic);
    var pt  = clericPatron(isChaotic);
    var ord = clericOrder(isChaotic);
    var num = numberTable();
    var fm  = fiftyFifty()? fmName() : amName();

    var canonicalSubset = [
      "Canon of " + clericName(isChaotic),
      pluralForm("Oracle",2) + " of the " + extraction(),
      "Testament of " + pt,
      "Chronicle of the " + extraction(),
      "History of the " + extraction(),
      "Annals of the " + extraction(),
      "Laws of " + pt
    ];

    var opts = [
      cn + "'s Commentary on " + pick(canonicalSubset),
      cn + "'s Centuries on " + pt,
      cn + "'s Demonology",
      cn + "'s Angelology",
      cn + "'s Theogony of " + pt,
      cn + "'s Dogmatics in " + num.word + " " + (num.n===1 ? "Book" : "Books"),
      "The Teachings of " + (isChaotic ? (cn + " the Damned") : ("the Holy " + cn)),
      "The Catechism of " + ord,
      "Mystagogy of " + (isChaotic ? ("the Nefarious " + pt) : ("the Holy " + pt)),
      cn + "'s Necrology",
      cn + "'s Ceremonial",
      pt + "'s Mythology",
      fm + "'s Book of " + numberTable().word + " " + pluralForm("Strategy", numberTable().n),
      fm + "'s " + D.d12(1) + " " + pluralForm("Exercise", 2)
    ];
    return pick(opts);
  }

  // ---------- main API ----------
  function bookFromValue(gp){
    var isClerical = (D.d6(1) <= 2); // 1-in-3 clerical; otherwise arcane
    var title;
    if (isClerical) {
      var isChaotic = (D.d6(1) <= 2); // 1-in-3 Chaotic; else Lawful
      if (gp <= 900) {
        title = theologyTitle(isChaotic);                  // Theology
      } else {
        var prefix = (gp <= 1500) ? "The Lesser " : "The Great ";
        title = prefix + scriptureTitle(isChaotic);        // Scripture
      }
    } else {
      var isTheoretical = (gp <= 1200);                    // Arcane split
      title = arcaneTitle(isTheoretical);
    }
    return title + "\n" + gp + "gp. Book (100p.)";
  }

  function randomBook(){
    var gp = D.d6(3) * 100; // 300–1800
    return bookFromValue(gp);
  }

  // ---------- expose ----------
  global.randomBook   = randomBook;
  global.bookFromValue = bookFromValue;

})(window);
