Phase 1 — Minimal Patch (v2)

Copy these into your repo (merge folders, replace files when prompted):

1) test_main.html           -> repo root (replaces your test_main.html)
2) js/app-nomodule.js       -> repo/js/ (create js/ if needed)

Changes made:
- Added data-action attributes to existing race controls where we detected npcThief / npcCleric / npcDwarf / npcHalfling / npcElfTwoLevels calls.
  (We did NOT remove your original onclick handlers.)
- Ensured scripts at the very end of <body> include:
    <script src="dice.js"></script>
    <script src="odd-tables.js"></script>
    <script src="js/app-nomodule.js"></script>
- The controller renders output into #output if present, otherwise falls back to #output-log.

How to test:
- Double-click test_main.html to open it.
- Click Thief / Cleric / Dwarf / Halfling / Elf and watch output appear in your usual output area.
- If a button still shows no output, please tell me which one and I’ll tailor the dispatcher to your exact function names.
Patched source file used: /mnt/data/_phase1_fresh2/Calvins-Referee-Tools/test_main.html
