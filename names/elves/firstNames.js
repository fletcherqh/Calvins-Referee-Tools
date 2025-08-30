// names/elves/firstNames.js
(function (g) {
  const feminine = [
    "Aeliana","Aeryn","Althaea","Amaris","Aralyn","Caelynn","Daelia","Elaria",
    "Elyndra","Faelith","Ilyra","Kaeriel","Laerisa","Lethiel","Liraen","Maelira",
    "Naevia","Nymeris","Orielle","Raelith","Saelune","Sylvara","Taenya","Thiriel"
  ];

  const masculine = [
    "Aelar","Aeric","Arannis","Baelion","Caelric","Daelric","Elandor","Elyrion",
    "Faelar","Halion","Ilrion","Kaelreth","Laerion","Lorandor","Maelion","Naeric",
    "Orelion","Raethor","Saelion","Taeral","Therion","Vaelor","Vaerion","Zalerion"
  ];

  // Woodsy unisex options if you ever want them
  const neutral = [
    "Ash","Briar","Dell","Fenn","Flint","Frost","Gale","Glen","Ilex","Ivy",
    "Jun","Lake","Lark","Moss","Oak","Quill","Reed","Rune","Vale","Wren"
  ];

  g.elfNames = { feminine, masculine, neutral };

  // tiny helper for console testing (not wired to UI yet)
  g.pickElfFirst = function (gender = "u") {
    const pool = gender === "f" ? feminine :
                 gender === "m" ? masculine :
                 neutral.concat(feminine, masculine);
    return pool[Math.floor(Math.random() * pool.length)];
  };
})(window);
