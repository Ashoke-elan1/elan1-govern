# elan1 platform screens v3

elan1 platform · design system v1.1 · designed, not yet built
Package documentation, 24 Sep 2026.

This package holds the elan1 platform as static HTML, and the reference that documents it, as two separate parts.

- **The platform**: 275 screens across 11 surfaces, with 502 documented states (each
  screen's Default plus 227 variants on 96 screens).
- **The reference**: 29 screens — the design system (foundations, components, patterns, layouts,
  accessibility, changelog), the competitor study, benchmarks, screen map, sources, information architecture, flows,
  atlas figures and decisions — with 36 documented states, reached through the All screens hub, the screen
  atlas and four reference pages.

Nothing here is a built product.

## 1. How to open it

1. Unzip the package. It opens as the folder `elan1-platform-v3/`.
2. Open `index.html` in a current browser (Chrome, Edge, Firefox or Safari). It opens the console at Work › Today.
3. For the reference, open `reference/index.html` (All screens).

Everything is static HTML, CSS and JavaScript: no build step, no server, nothing to install.

- **Single-file versions.** `elan1-platform-screens-v3-standalone.html` (the platform) and
  `elan1-reference-v3-standalone.html` (the reference) sit at the root. Each is one file with its images inlined.
  Keep the two in the same folder: links from one to the other open the other file by name.
- **Fonts** (Bricolage Grotesque, Outfit, JetBrains Mono) load from Google Fonts. Offline, the pages fall back to
  system fonts and the layouts still hold.
- **Preferences** (theme, density, assurance level shown, pill on or off) are kept in this browser's local storage, for
  this viewer only. Every page renders correctly without them.

## 2. What is where

```
elan1-platform-v3/
  index.html                               the platform: opens the console at Work › Today
  console.html                             the console, also at Work › Today
  screens/                                 one HTML file per platform screen (275)
  assets/                                  css/ (tokens, components, layout), js/ (the engine, screens,
                                           inventory), brand/ and other images
  reference/
    index.html                             All screens: counts, filters and every screen as a card
    atlas.html                             screen atlas: thumbnails with spec and sources; grid or table
    foundations.html                       colour, type, space/density/motion, iconography, brand in product
    components.html                        component gallery, layouts, accessibility, changelog
    patterns.html                          patterns, flows, information architecture, screen map
    research.html                          competitor study, benchmarks, sources, atlas figures, decisions
    screens/                               one HTML file per reference screen (29)
    thumbs/                                screen thumbnails for the hub and the atlas
  elan1-platform-screens-v3-standalone.html   the platform in one file
  elan1-reference-v3-standalone.html          the reference in one file
  docs/                                    this file, BUILD_GUIDE.md, CHANGELOG.md and the two inventory CSVs
```

### Platform screens per surface

| Surface | Screens | Enters at |
|---|---|---|
| Public site | 38 | `screens/p-01-home.html` |
| Access & onboarding | 27 | `screens/a-01-sign-in.html` |
| Console · Work | 25 | `screens/t-01-today.html` |
| Mobile & channels | 6 | `screens/m-01-approvals-on-a-phone.html` |
| Console · Records | 32 | `screens/r-01-connected-systems.html` |
| Console · Agents | 23 | `screens/g-01-agent-registry.html` |
| Console · Assurance | 26 | `screens/s-01-assurance-overview.html` |
| Console · Evidence (L2/L3) | 31 | `screens/e-01-upgrade-to-level-2.html` |
| Portals | 34 | `screens/x-01-verify-a-bundle.html` |
| Developer portal | 28 | `screens/d-01-developers.html` |
| System | 5 | `screens/z-01-not-found.html` |
| **Total** | **275** | |

Assurance level at which a screen is live: L1 246, L2 15, L3 14.

### Reference pages

The reference pages show the reference screens under section tabs. Screens per tab:

| Page | Tab | Screens |
|---|---|---|
| `reference/foundations.html` | Overview | 1 |
| `reference/foundations.html` | Colour | 1 |
| `reference/foundations.html` | Type | 1 |
| `reference/foundations.html` | Space, density and motion | 1 |
| `reference/foundations.html` | Iconography | 1 |
| `reference/foundations.html` | Brand in product | 1 |
| `reference/components.html` | Gallery | 2 |
| `reference/components.html` | Layouts | 6 |
| `reference/components.html` | Accessibility | 1 |
| `reference/components.html` | Changelog | 1 |
| `reference/patterns.html` | Patterns | 2 |
| `reference/patterns.html` | Flows | 2 |
| `reference/patterns.html` | Information architecture | 1 |
| `reference/patterns.html` | Screen map | 1 |
| `reference/research.html` | Competitor study | 2 |
| `reference/research.html` | Benchmarks | 1 |
| `reference/research.html` | Sources | 1 |
| `reference/research.html` | Atlas figures | 2 |
| `reference/research.html` | Decisions | 1 |
| **Total** | | **29** |

`reference/index.html` (All screens) and `reference/atlas.html` are built from the inventory and are not entries in it.

### Screen types

| Type | Meaning | Platform | Reference |
|---|---|---|---|
| home | Role or door landing: stat row, attention list, recent proofs | 6 | 0 |
| list | Toolbar, URL filters, a real table; rows open a record | 66 | 0 |
| record | One object: sections or tabs, ending in its proof or audit stamp | 54 | 0 |
| decide | A person records a decision or commits a governed write | 21 | 0 |
| wizard | A stepper, one decision per step, no skipping | 34 | 0 |
| doc | Reference and specification reading page | 24 | 23 |
| auth | Sign-in and session pages without console chrome | 11 | 1 |
| system | 403, 404, maintenance, offline and outage states | 5 | 0 |
| public | Public website and trust pages | 39 | 1 |
| mobile | Phone screens and channel previews | 6 | 1 |
| map | Diagram or explorer | 9 | 3 |

### The two inventory lists

`docs/screen-inventory-platform.csv` (275 rows, numbered 1–275) and
`docs/screen-inventory-reference.csv` (29 rows, numbered 1–29). Columns: `n,id,file,title,surface,section,type,route,states_count,src,spec`. `n` is the
number shown on the screen-info pill in that part; `file` is the path inside the package; `states_count` counts
Default and every variant.

## 3. How the two parts link to each other

- The platform has no Reference section. The console sidebar shows Today and the four doors (Work, Records, Agents,
  Assurance); the Reference group that sat below the divider in v2 is gone.
- A reference route is any route under `/reference/` or `/hub`. Everything else is a platform route.
- A link in a platform screen that points at a reference route opens the matching page in the reference, and a link in
  the reference that points at a platform route opens the matching platform screen. The same holds for a route typed
  into the address bar.
- In the single-file versions the link goes to the other file with the same route, for example
  `elan1-reference-v3-standalone.html#/reference/competitors`. This only works when both files sit in the same folder.
- Numbering is per part: the platform runs 1–275, the reference 1–29. Previous and next on the
  pill stay inside the part you are in.

## 4. How to review

Start at `index.html` and use the console as a user would. A short path through the governed write:

1. `screens/t-01-today.html` — Today (where the day starts).
2. `screens/w-01-approvals.html` — Approvals (the queue waiting on a person).
3. `screens/w-03-decide.html` — Decide (a person commits a governed write: consequence, diff, gates, one button).
4. `screens/w-10-not-done-refusal.html` — Not done: refusal explained (a refusal: neutral, recorded, ₹0).
5. `screens/s-03-proof-record.html` — Proof record (the proof record the write leaves behind).

Review aids on every screen:

- **Theme.** The top bar switches light and dark (the word and icon show the current theme).
- **Density.** Default, Compact or Comfortable, from the top bar.
- **Assurance level pill.** L1 Guarded · L2 Attested · L3 Proven. At L1 no screen shows "Signed by", a signature,
  an anchor time or a verifier verdict: they are absent, not stubbed. A screen that is only live at L2 or L3 opens at
  its level; below that level the same route shows a designed "arrives at Level N" explainer with a way to preview.
- **Ctrl K** (Cmd K on a Mac) opens the command palette: every screen by number, title, section or spec, plus
  commands. `?` lists all keyboard shortcuts; `[` collapses the sidebar to the icon rail.
- **Screen-info pill**, bottom right: number · type · section · title, previous and next in inventory order, and a
  grid button to the screen atlas. `i` shows or hides it; `?pill=0` in the address hides it for a
  screenshot.
- **Screen notes**, opened from the pill: id, number, type, surface, route, pattern, file, every state as a link,
  the components used, the rules that apply, the source documents and the one-line spec.
- **States.** Every screen has a Default. 96 platform screens have further states (227 in
  all): open them from Screen notes, or from the screen's own "View states" menu where it has one. `states_count`
  in the CSV says how many to expect.
- **Links work.** Every row, id, chip and button with a destination goes to it. Inside a screen file, in-page links
  render through the hash router (`screens/w-03-decide.html#/assurance/proof/4101` renders the proof record).
- **Narrow widths.** At 1024 px and below the sidebar becomes the icon rail; at 720 px and below a menu button opens it
  as a drawer and a bottom tab bar appears.

## 5. Rules every screen keeps

- Outcomes are exactly three — Committed · Not done · Waiting on a person — plus platform failure. A refusal is
  neutral, never red.
- At Assurance Level 1 nothing is shown as signed, anchored or verified. L2 and L3 screens label their level.
- Colour only through tokens. Clay is emphasis, never a status. A status always carries a word.
- British English, sentence case, ₹ in Indian grouping (₹27,64,300), times in IST.
- The four doors — Work, Records, Agents, Assurance — and nothing else in the rail.
