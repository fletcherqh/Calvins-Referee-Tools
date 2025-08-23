# Phase 1 Notes

## Run locally
Open `test_main.html` directly or run a static server (e.g. `python3 -m http.server`).

## Scripts
We added `js/app.js` and `js/ui/render.js` (ES modules). Add at the end of `test_main.html`:
```html
<script type="module" src="js/app.js"></script>
```

## Controls
Use `data-action` attributes on buttons/dropdowns:
```html
<button data-action="roll:thief">Thief</button>
```
Results render into:
```html
<pre id="output" class="output" aria-live="polite"></pre>
```
