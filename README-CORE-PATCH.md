# Core Minimum Structure Patch

This patch adds **two tiny, GUI-preserving helpers** to make future changes safer without altering your layout or existing behavior.

## Files included

```
js/output-log.js     # append-only Output Log helper (adds global appendLine)
js/bindings.js       # inert binding helper; opt-in, doesn't override inline onclicks
tests/button-contract.json  # optional: for future smoke tests
```

## How to install (minimal)

1. Copy `js/output-log.js` and `js/bindings.js` into your site's `js/` folder.
2. In `test_main.html`, add these two `<script>` tags **near the end, before `</body>`**, after your data scripts:
   ```html
   <script src="js/output-log.js"></script>
   <script src="js/bindings.js"></script>
   ```
3. Do **not** remove existing scripts or inline `onclick` handlers. This patch is inert until you call it.

## How to use (when ready)

- To ensure append-only + blank line spacing, make each button's function write like this:
  ```js
  appendLine("Your generated text");
  ```
- If a function returns a string but doesn't write to the Output Log itself, you can optionally attach it with:
  ```js
  Bindings.bindIfPresent('thiefBtn', NPC.generateThief);
  ```
  This will append the returned string to the Output Log automatically.
  *Note:* `bindings.js` does not auto-bind anything — it only binds when you explicitly call it.

## Optional dev step: button contract smoke test

The included `tests/button-contract.json` is a placeholder map of button IDs to functions.
You can ignore it for now. Later, we can add a tiny console function to load it and verify all buttons wire correctly.

---

## GitHub Desktop: commit as a new branch (recommended)

1. **Open GitHub Desktop** with your local repo.
2. Click the branch dropdown and choose **"New Branch"**.
3. Name it something clear, e.g.:
   - `chore/core-output-helpers`
   - `fix/min-core-structure`
4. Click **"Create branch"**.
5. Copy the new files (`js/output-log.js`, `js/bindings.js`, `tests/button-contract.json`) into your repo.
6. In GitHub Desktop, you’ll see the changes on the left. Enter a commit message, e.g.:
   - `feat: add append-only Output Log helper`
   - `chore: add optional bindings helper`
7. Click **"Commit to <branch-name>"**.
8. Click **"Push origin"** to upload the branch to GitHub.
9. (Optional) Open a Pull Request from this branch to `main` when you're ready.

## Why this helps

- Guarantees **append-only** Output Log with a **blank line** spacer (your non-negotiable rule).
- Avoids breaking existing GUI or handlers — **no auto-binding** or global rewiring.
- Creates a stable foundation for wiring class-specific getters and fixing broken buttons one by one.
