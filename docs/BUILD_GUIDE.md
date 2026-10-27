# Build guide — elan1 platform screens v3

How the package is made and regenerated, and the rules that keep it consistent.

## Source

Everything is generated from one single-page prototype, the v2 SPA in `v2/`:

```
v2/index.html            the SPA shell; lists the stylesheets and scripts in load order
v2/css/                  tokens.css (elan1 Tokens v1.1) · components.css · layout.css
v2/js/core.js            router, shell (top bar, sidebar, pill, notes), palette, state, overlays
v2/js/components.js      E1.c — the component helpers
v2/js/data.js            E1.data — the shared sample data (tenant, people, notifications)
v2/js/screens/*.js       the screens, one file per area, between <!-- SCREENS:BEGIN --> and <!-- SCREENS:END -->
v2/js/inventory.js       window.E1_SCREENS — every screen, numbered, with states, rules, sources and spec
v2/js/hub.js             the All screens hub, the atlas and the four reference pages (/hub, /hub/*)
v2/js/app.js             boot
v2/assets/               brand files and images
v2/README-framework.md   the full framework cheat-sheet
```

The v2 router registers 278 route patterns (7 of them redirects); 36 are
reference routes. The inventory holds 304 entries: 275 platform and 29 reference.

## Regenerate

Run the three tools in this order:

```
cd v2
python3 tools/generate.py      # v2 pages, thumbnails, standalone and zip; --no-thumbs keeps the thumbnails,
                               # --only-pages writes pages and docs only
python3 tools/split.py         # the two single-file versions: the platform without Reference, and the reference
python3 tools/package_v3.py    # assembles elan1-platform-v3/ and zips it
python3 tools/verify.py        # opens the generated pages with Playwright and checks them
```

- **`tools/generate.py`** reads `v2/index.html` for the stylesheet and script list, so a new screen file added
  between the SCREENS markers is picked up. It writes one entry file per inventory item and one per hub page, renders
  a thumbnail per screen (Playwright, 1440 × 900, light theme, scaled to 480 px, JPEG), and copies `css/`, `js/` and
  `assets/` under `assets/`.
- **`tools/split.py`** builds two single-file versions from the same shell, with CSS, scripts and images inlined:
  - *platform*: leaves out `js/screens/reference-ds.js`, `js/screens/reference-research.js` and `js/hub.js`, deletes
    `E1.nav.reference` (so the sidebar has no Reference group), keeps only platform entries in `E1_SCREENS` and
    renumbers them from 1; starts at `/work/today`.
  - *reference*: keeps only reference entries, renumbered from 1, inlines their thumbnails and starts at `/hub`.
  - Both carry a small guard (`window.E1_SPLIT`) that decides whether a route belongs to the other part
    (`/^\/(reference|hub)(\/|$)/`). A click on such a link, or a hash change to such a route, opens the other file at
    the same route, so the two files must sit in the same folder.
- **`tools/package_v3.py`** lays out the delivered folder: the platform at the root (`index.html` opening the console
  at Today, `console.html`, `screens/`, `assets/`), the reference under `reference/` (`index.html` = All screens,
  `atlas.html`, `foundations.html`, `components.html`, `patterns.html`, `research.html`, `screens/`, `thumbs/`), the
  two single-file versions at the root under their v3 names, and `docs/`.

## How an entry file boots

Every HTML file is the SPA shell with a short script added in `<head>`:

```html
<script>
  window.E1_FILE_MODE = true;           // links to other screens go to files, not hash routes
  window.E1_ROOT = window.E1_BASE = '../';   // '' at the package root, '../' inside screens/
  window.E1_START = '/work/decide/OB-2026-0412';   // the route this file opens at
  window.E1_SCREEN_ID = 'W-03';         // screen files only: which inventory entry this file is
  window.E1_LEVEL = 'L2';               // only for screens that are live at L2 or L3
</script>
```

With no hash, the router renders `E1_START`. Links inside a screen are ordinary hash links (`#/assurance/proof/4101`)
and render in place. `?thumb=1` marks the page as a thumbnail capture and hides the pill and notes. Images are
resolved with `E1.asset('assets/…')`, so a screen does not need to know where its file sits. Do not add a `<base>`
tag: it breaks the hash links.

## The inventory and the two CSVs

`v2/js/inventory.js` defines `window.E1_SCREENS` (fields `components, file, id, level, n, pattern, route, rules, section, spec, src, states, surface, title, type`),
`window.E1_SCREEN_TYPES` and `window.E1_SURFACES`. It drives the hub, the atlas, the pill, Screen notes,
previous/next and the palette, so counts on every page come from one list.

An entry is a reference entry when its route (without the query) matches `^/(reference|hub)(/|$)`. The two CSVs in
`docs/` are written from the inventory with that rule, each renumbered from 1 in inventory order:

```python
import csv, json, re, subprocess
js = ("const vm=require('vm'),fs=require('fs');const c={window:{}};vm.createContext(c);"
      "vm.runInContext(fs.readFileSync('v2/js/inventory.js','utf8'),c);"
      "process.stdout.write(JSON.stringify(c.window.E1_SCREENS))")
L = json.loads(subprocess.run(['node', '-e', js], capture_output=True, text=True, check=True).stdout)
ref = lambda s: bool(re.match(r'^/(reference|hub)(/|$)', s['route'].split('?')[0]))
for name, part, folder in (('platform', False, 'screens/'), ('reference', True, 'reference/screens/')):
    with open('docs/screen-inventory-%s.csv' % name, 'w', newline='', encoding='utf-8') as fh:
        w = csv.writer(fh)
        w.writerow(['n', 'id', 'file', 'title', 'surface', 'section', 'type', 'route', 'states_count', 'src', 'spec'])
        for i, s in enumerate([s for s in L if ref(s) == part], 1):
            src = s.get('src') or ''
            w.writerow([i, s['id'], folder + s['file'], s['title'], s['surface'], s['section'], s['type'],
                        s['route'], len(s.get('states') or []), '; '.join(src) if isinstance(src, list) else src,
                        s.get('spec', '')])
```

## The E1 API in brief

The full reference is `v2/README-framework.md`. The calls a screen author uses most:

| Call | Does |
|---|---|
| `E1.route(pattern, def)` | Register a screen: `title`, `layout` (`console`, `public`, `auth`, `bare`, `doc`, `mobile`), `door`, `section`, `crumbs`, `example`, `render(params, query)`, `mount(el, params, query)`. |
| `E1.go(path, query?)` / `E1.href(path, query?)` | Navigate / build a `#/…` link. |
| `E1.match(path)` / `E1.hasRoute(path)` | Resolve a path to its route. |
| `E1.navAdd(door, item)` | Add a sidebar item to a door. |
| `E1.state` / `E1.set(key, value)` | Theme, density, level, environment, tenant; persisted and re-rendered. |
| `E1.setLevel(L)` / `E1.atLeast('L2')` | Set the assurance level shown / test it before showing signature, anchor or verdict UI. |
| `E1.toast`, `E1.modal`, `E1.drawer`, `E1.sheet`, `E1.confirm`, `E1.close` | Feedback and overlays. |
| `E1.palette()`, `E1.cmdAdd(entry)`, `E1.shortcuts()` | Command palette and shortcut sheet. |
| `E1.on(type, selector, fn)`, `E1.action(name, fn)` | Delegated listeners and `data-action` handlers. |
| `E1.esc(value)` | Escape every data value put into HTML. |
| `E1.store.get/set` | Local storage, wrapped so a blocked store does not break the page. |
| `E1.asset(path)` | Resolve an image path in both file mode and single-file mode. |
| `E1.inventory()`, `E1.screen()`, `E1.screenHref(item)`, `E1.screenNotes()`, `E1.togglePill()` | The inventory, the current entry, its file, Screen notes and the pill. |
| `E1.c.*` | Components: page header, stat cards, tables with `empty:`, chips, outcome, blast radius, gates, diff, actor, level, locked explainer and more. |
| `E1.data` | Shared sample data: tenant Kaveri Spinning Mills, people, notifications. Areas add `E1.data.<area>`. |
| `E1.fmt` | Formatting: ₹ in Indian grouping, dates, times and durations. |

## Adding or changing a screen

1. Register the route in its area file, `v2/js/screens/<area>.js`.
2. Add one entry to `v2/js/inventory.js`: `n, id, file, title, route, pattern, surface, section, type, level,
   states, components, rules, src, spec`. `file` must be unique; `route` is where the file opens.
3. The route decides the part: under `/reference/` or `/hub` it goes to the reference, anything else to the platform.
4. Run the three tools. Pages, thumbnails, counts, previous/next, the palette and both CSVs follow from the inventory.

## Rules

1. Every link is `href="#/…"`: never `#` or `javascript:`, and no dead links.
2. A platform screen may link to a reference route (it opens the reference) but must not depend on reference scripts;
   the platform build does not load them.
3. Escape data with `E1.esc`. Use `E1.store`, never local storage directly. Use `E1.asset` for image paths.
4. L1 honesty: no "Signed by", signature, anchor time or verifier verdict unless `E1.atLeast('L2')`, and label the
   level with `E1.c.level()`.
5. Outcomes are Committed · Not done · Waiting on a person, plus platform failure. A refusal is neutral and names the
   rule, the numbers and one action.
6. Every table or list has an empty state that says what is missing, why, and what would fill it.
7. Colour only through tokens; clay is emphasis, never a status; a status always carries a word.
8. Exactly one h1 per screen. Sentence case, British English, ₹ in Indian grouping.
9. Register listeners at file load or on `el` inside `mount`, never on `document` inside `mount`.
10. Figures in documents are derived from the files (inventory, router, folders), never typed by hand.
