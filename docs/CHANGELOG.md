# Changelog — elan1 platform screens

All three versions are dated 24 Sep 2026.

## v3 — Reference separated

- The Reference section is removed from the platform and delivered as its own part: every route under `/reference/`
  and `/hub` — All screens, screen atlas, design system foundations, components, patterns, layouts, accessibility
  and changelog, competitor study, benchmarks, screen map, sources, information architecture, flows, atlas figures and
  decisions.
- The platform has 275 screens across 11 surfaces; the reference has 29. Each part is numbered
  from 1, and the pill's previous and next stay inside the part.
- `index.html` at the root now opens the console at Work › Today. The All screens hub moves to
  `reference/index.html`, with the atlas and the four reference pages beside it in `reference/`.
- The console sidebar shows Today and the four doors only; the Reference group below the divider is gone.
- Links that cross from one part to the other open the other part at the same route. Two single-file versions,
  `elan1-platform-screens-v3-standalone.html` and `elan1-reference-v3-standalone.html`, link to each other when kept
  in the same folder.
- The package folder is `elan1-platform-v3/`. `docs/screen-inventory.csv` is replaced by
  `screen-inventory-platform.csv` and `screen-inventory-reference.csv`, with a `states_count` column. This changelog
  is new.
- Built by `tools/split.py` and `tools/package_v3.py` on top of the v2 build.

## v2 — platform console look, per-screen files, inventory

- The platform takes the elan1 console look: ink top bar (lockup, tenant, environment, assurance level pill,
  "Search or ask elan1… Ctrl K", waiting-on-you count, notifications, theme, density, user), a wide grouped sidebar
  with the four doors, page headers with eyebrow, lead, actions and underline tabs, stat cards, "Needs your attention"
  lists, verdict pills and gate cells.
- Fonts return to the parent elan1 layer: Bricolage Grotesque (headings), Outfit (interface), JetBrains Mono
  (identifiers, amounts), replacing Schibsted Grotesk, IBM Plex Sans and IBM Plex Mono.
- One HTML file per screen under `screens/`, each booting the shared engine at its own route, with a thumbnail per
  screen.
- A numbered screen inventory (`js/inventory.js`, `window.E1_SCREENS`): 304 screens and 538
  documented states, with type, surface, section, level, components, rules, sources and a spec line per screen. It
  drives the hub, the atlas, the pill, Screen notes, previous/next and the command palette.
- The screen-info pill (number, type, section, previous/next, atlas grid) and the Screen notes drawer on every
  screen.
- A hub (All screens), a screen atlas and four reference pages (foundations, components, patterns, research) added as
  console pages: 6 new routes, 278 route patterns in all.

## v1 — first build

- The first complete, clickable build of the platform on elan1 design system v1.1: one hash-routed single-page
  prototype with 272 route patterns (7 redirects), covering the public site, access and
  onboarding, the console's four doors (Work, Records, Agents, Assurance), mobile and channels, the portals, the
  developer portal and a Reference section (design system, competitor study, screen map, sources, IA, flows, atlas
  figures, decisions).
- Fonts: Schibsted Grotesk (headings), IBM Plex Sans (interface), IBM Plex Mono (identifiers, amounts).
- Delivered as `index.html` with `css/`, `js/` and `assets/`, and as one standalone file.
