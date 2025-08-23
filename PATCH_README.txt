Phase 1 — Minimal Patch

Files included (copy these into your repo, merging folders as needed):
1) test_main.html
2) js/app-nomodule.js
3) css/components.css (optional; just styles the #output box)

Where to place them:
- test_main.html   -> repo root (replace your existing test_main.html)
- js/app-nomodule.js -> repo/js/ (create js/ if missing)
- css/components.css -> repo/css/ (optional)

What changed:
- Converted race controls to data-action (Thief/Cleric/Dwarf/Halfling/Elf)
- Added a shared output box: <pre id="output" class="output" aria-live="polite">
- Added a Safari-friendly controller (app-nomodule.js) that calls oddTables + dice
- Ensured scripts load at the end of <body> in this order:
    <script src="dice.js"></script>
    <script src="odd-tables.js"></script>
    <script src="js/app-nomodule.js"></script>

How to test:
- Double-click test_main.html to open in Safari
- Click Thief/Cleric/Dwarf/Halfling/Elf — results print in the <pre id="output"> box

GitHub Desktop:
- Make sure you’re on branch chore/phase1-structure
- Commit the file changes and Push origin
- Open/refresh your PR
