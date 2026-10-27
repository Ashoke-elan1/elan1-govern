/* ==========================================================================
   Reference · Design system v2.0 — documentation screens (door: reference)
   v2.0: the elan1 console family look — parent elan1 type (Bricolage Grotesque,
   Outfit, JetBrains Mono), ink top bar, grouped sidebar, screen-info pill and
   screen notes, and the v2 console vocabulary helpers (verdict … minibar).
   Routes: /reference/design-system (+ /colour /type /space /iconography /brand),
           /reference/components (+ /:name), /reference/patterns (+ /:name),
           /reference/accessibility, /reference/changelog
   The page renders itself: every specimen is the real component and every
   measured value is read from the browser in the theme currently applied.
   ========================================================================== */
(function () {
  'use strict';
  var E1 = window.E1, c = E1.c, esc = E1.esc;

  /* ---- Subnav: design-system pages inside the Reference door ------------- */
  E1.navAdd('reference', { id: 'ds-colour', label: 'Colour', href: '#/reference/design-system/colour', group: 'Design system', after: 'design-system' });
  E1.navAdd('reference', { id: 'ds-type', label: 'Type', href: '#/reference/design-system/type', group: 'Design system', after: 'ds-colour' });
  E1.navAdd('reference', { id: 'ds-space', label: 'Space, density & motion', href: '#/reference/design-system/space', group: 'Design system', after: 'ds-type' });
  E1.navAdd('reference', { id: 'ds-icons', label: 'Iconography', href: '#/reference/design-system/iconography', group: 'Design system', after: 'ds-space' });
  E1.navAdd('reference', { id: 'ds-brand', label: 'Brand in product', href: '#/reference/design-system/brand', group: 'Design system', after: 'ds-icons' });
  E1.navAdd('reference', { id: 'accessibility', label: 'Accessibility', href: '#/reference/accessibility', group: 'Design system', after: 'patterns' });
  E1.navAdd('reference', { id: 'changelog', label: 'Changelog', href: '#/reference/changelog', group: 'Design system', after: 'accessibility' });
  E1.navItem('reference', 'design-system').label = 'Overview';

  /* ---- Helpers ------------------------------------------------------------ */
  function rv(token) { try { return getComputedStyle(document.documentElement).getPropertyValue(token).trim(); } catch (e) { return ''; } }
  function here() { return '#' + E1.state.route.path; }
  function sec(id, title, lead, body, eyebrow) { return c.section({ id: id, title: title, lead: lead, body: body, eyebrow: eyebrow }); }
  function spec(title, stage, o) {
    o = o || {};
    return '<div class="e1-spec"' + (o.id ? ' id="' + esc(o.id) + '"' : '') + '>' + (title || o.note ? '<div class="e1-spec__bar"><span class="e1-spec__title">' + esc(title || '') + '</span>' + (o.note ? '<span class="e1-spec__note">' + esc(o.note) + '</span>' : '') + '</div>' : '') +
      '<div class="e1-spec__stage' + (o.col ? ' e1-spec__stage--col' : '') + (o.plain ? ' e1-spec__stage--plain' : '') + '"' + (o.style ? ' style="' + esc(o.style) + '"' : '') + '>' + stage + '</div>' + (o.foot ? '<div class="e1-spec__foot">' + o.foot + '</div>' : '') + '</div>';
  }
  function themePair(html) {
    return '<div class="e1-spec"><div class="e1-spec__bar"><span class="e1-spec__title">Both themes, side by side</span><span class="e1-spec__note">The same markup under a light and a dark token scope</span></div>' +
      '<div class="e1-themepair"><div data-theme="light"><p class="e1-label">Light · paper</p>' + html + '</div><div data-theme="dark"><p class="e1-label">Dark · ink</p>' + html + '</div></div></div>';
  }
  var DS_TABS = [
    ['design-system', 'Overview', '#/reference/design-system'], ['ds-colour', 'Colour', '#/reference/design-system/colour'], ['ds-type', 'Type', '#/reference/design-system/type'],
    ['ds-space', 'Space', '#/reference/design-system/space'], ['ds-icons', 'Icons', '#/reference/design-system/iconography'], ['ds-brand', 'Brand', '#/reference/design-system/brand'],
    ['components', 'Components', '#/reference/components'], ['patterns', 'Patterns', '#/reference/patterns'], ['layouts', 'Layouts and chrome', '#/reference/layouts'],
    ['accessibility', 'Accessibility', '#/reference/accessibility'], ['changelog', 'Changelog', '#/reference/changelog']
  ];
  function dsTabs(active) {
    return c.tabs(DS_TABS.map(function (t) {
      var it = { id: t[0], label: t[1], href: t[2] };
      if (t[0] === 'components' && typeof REG !== 'undefined') it.count = REG.length;
      if (t[0] === 'patterns' && typeof PATTERNS !== 'undefined') it.count = PATTERNS.length;
      return it;
    }), active, { label: 'Design system pages' });
  }
  function page(o) {
    var toc = o.toc && o.toc.length ? c.toc(o.toc) : '';
    var active = o.tab || ((E1.state.route && E1.state.route.def && E1.state.route.def.section) || 'design-system');
    return c.pageHeader({ title: o.title, eyebrow: o.eyebrow || 'Design system · v2.0', lead: o.lead, actions: o.actions, meta: o.meta, back: o.back, tabs: dsTabs(active) }) + (o.top || '') +
      '<div class="e1-docpage' + (toc ? ' has-toc' : '') + '"><div class="e1-docpage__main">' + o.body + stamp(o.title) + '</div>' + (toc ? '<aside class="e1-docpage__toc">' + toc + '</aside>' : '') + '</div>';
  }
  function stamp(what) {
    return '<p class="e1-stamp"><span>Rendered ' + esc(E1.fmt.dateTime(new Date())) + '</span><span>·</span><span>' + esc(what) + '</span><span>·</span><span>Tokens v2.0 · Components v2.0 · Brand Book v1.0</span><span>·</span><span>' + (E1.state.theme === 'dark' ? 'Dark' : 'Light') + ' theme, ' + esc(E1.state.density) + ' density</span></p>';
  }
  function reg(path, section, title, render, extra) {
    E1.route(path, Object.assign({ title: title, layout: 'console', door: 'reference', section: section, render: render }, extra || {}));
  }
  function list(items) { return '<ul>' + items.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>'; }
  function dodont(dos, donts) {
    return '<div class="e1-dodont"><div class="e1-dodont__do"><h4>' + c.icon('check', 14) + 'Do</h4>' + list(dos.map(esc)) + '</div><div class="e1-dodont__dont"><h4>' + c.icon('x', 14) + 'Do not</h4>' + list(donts.map(esc)) + '</div></div>';
  }
  function tbl(head, rows, caption, cls) {
    return '<div class="e1-table-wrap"><table class="e1-table ' + (cls || '') + '"><caption class="e1-sr">' + esc(caption || '') + '</caption><thead><tr>' + head.map(function (h) { return '<th scope="col">' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr>' + r.map(function (v, i) { return i === 0 ? '<th scope="row">' + v + '</th>' : '<td>' + v + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }
  function tokenCount() {
    var n = 0, seen = {};
    try {
      Array.prototype.forEach.call(document.styleSheets, function (ss) {
        var rules; try { rules = ss.cssRules; } catch (e) { return; }
        Array.prototype.forEach.call(rules || [], function walk(r) {
          if (r.cssRules) Array.prototype.forEach.call(r.cssRules, walk);
          if (r.style && r.selectorText && /:root/.test(r.selectorText)) {
            for (var i = 0; i < r.style.length; i++) { var p = r.style[i]; if (p.indexOf('--') === 0 && !seen[p]) { seen[p] = 1; n++; } }
          }
        });
      });
    } catch (e) { /* cross-origin */ }
    if (!n) { // file:// blocks cssRules; the computed style lists custom properties instead
      try { var cs = getComputedStyle(document.documentElement); for (var i = 0; i < cs.length; i++) if (cs[i].indexOf('--') === 0) n++; } catch (e2) { /* old engine */ }
    }
    return n;
  }

  /* ---- Colour maths (WCAG 2.x relative luminance) ------------------------- */
  function parseColour(s) {
    s = String(s || '').trim();
    var m;
    if ((m = /^#([0-9a-f]{3})$/i.exec(s))) { return m[1].split('').map(function (h) { return parseInt(h + h, 16); }); }
    if ((m = /^#([0-9a-f]{6})/i.exec(s))) { return [0, 2, 4].map(function (i) { return parseInt(m[1].substr(i, 2), 16); }); }
    if ((m = /^rgba?\(([^)]+)\)/i.exec(s))) { return m[1].split(/[ ,\/]+/).slice(0, 3).map(Number); }
    return null;
  }
  function lum(rgb) { var a = rgb.map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]; }
  function ratio(fg, bg) { var a = parseColour(fg), b = parseColour(bg); if (!a || !b) return null; var l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); }
  E1.contrast = function (fgToken, bgToken) { return ratio(rv(fgToken), rv(bgToken)); };

  /* =========================================================================
     OVERVIEW
     ========================================================================= */
  var PRINCIPLES = [
    ['L1', 'Colour exists only as tokens', 'A theme change is a token change, never a class change. One literal hex in a screen file is a rejection.'],
    ['L2', 'Clay never encodes state', 'Clay is brand emphasis and selection. The moment it can mean approved, the approval gate loses its accent.'],
    ['L3', 'Colour never carries meaning alone', 'Every status ships with a word and a glyph. Every ladder reads in greyscale by the count of its filled steps.'],
    ['L4', 'Never show what the level does not ship', 'At Assurance Level 1 there is no signature, anchor time or verifier verdict, so there is no row for one.'],
    ['L5', 'Density is a root setting', 'No component sets its own row height or control height. The root decides, so every table changes together.'],
    ['L6', 'One disc, one angle', 'One disc per surface. Where a layout needs a diagonal, it runs on the 50° bearing and never crosses type.'],
    ['L7', 'Empty states are findings', 'Three required props: what is missing, why, and what would fill it. “No data” does not ship.'],
    ['L8', 'Plain, specific, answerable', 'British English, sentence case, numerals, Indian grouping. Say what the agent did and who approved it.']
  ];
  var SUBPAGES = [
    ['Colour', 'ds-colour', '#/reference/design-system/colour', 'Primitives, roles, the six statuses, ladders, the viz ramp and a live contrast audit.', function () { return '<span class="e1-disc" style="--disc:18px"></span>' + c.badge('good', 'Approved') + c.badge('critical', 'Refused') + c.blast(3, { compact: true }); }],
    ['Type', 'ds-type', '#/reference/design-system/type', 'Bricolage Grotesque, Outfit and JetBrains Mono — the parent elan1 layer — on the product scale.', function () { return '<span class="e1-text-title">Aa</span><span style="font-family:var(--font-ui)">Outfit</span><span class="e1-mono">₹27,64,300</span>'; }],
    ['Space, density & motion', 'ds-space', '#/reference/design-system/space', 'The 8px baseline, three densities, radii, elevation, motion and breakpoints.', function () { return c.segmented([{ id: 'c', label: 'Compact' }, { id: 'd', label: 'Default' }, { id: 'o', label: 'Comfortable' }], 'd'); }],
    ['Iconography', 'ds-icons', '#/reference/design-system/iconography', c.iconNames().length + ' stroke icons on a 24 grid, searchable, click to copy.', function () { return ['work', 'records', 'agents', 'assurance', 'gate', 'chain', 'seal'].map(function (n) { return c.icon(n, 20); }).join(''); }],
    ['Brand in product', 'ds-brand', '#/reference/design-system/brand', 'Logo in the console, the disc system in UI, voice, writing rules.', function () { return c.disc({ variant: 'gate', size: 22 }) + '<span class="e1-caption">The agent drafts it. You commit it.</span>'; }],
    ['Components', 'components', '#/reference/components', 'Every E1.c helper, one page each, with variants, props, do and do not — including the v2 console vocabulary.', function () { return c.verdict('clean', 'Reconciled', { icon: 'check' }) + c.cost(1.2) + c.gateDots(['passed', 'passed', 'passed', 'waiting']); }],
    ['Patterns', 'patterns', '#/reference/patterns', 'How components compose: decide, refuse, diff, chain standing, L1 honesty.', function () { return c.outcome('refused') + c.blast(3, { compact: true }) + c.level('L1', { short: true }); }],
    ['Layouts and chrome', 'layouts', '#/reference/layouts', 'Six shells, and the console chrome: ink top bar, grouped sidebar, screen-info pill and screen notes.', function () { return c.doorMark('work') + c.doorMark('records') + c.doorMark('agents') + c.doorMark('assurance') + '<span class="e1-caption">Notes · pill</span>'; }],
    ['Accessibility', 'accessibility', '#/reference/accessibility', 'WCAG 2.2 AA, criterion by criterion, and how each is met.', function () { return c.kbd('Tab') + c.kbd('Enter') + '<span class="e1-caption">focus ring 3:1</span>'; }],
    ['Changelog', 'changelog', '#/reference/changelog', 'Every decision from v1.0 to v2.0, with the reason and the migration.', function () { return c.badge('info', 'v2.0') + '<span class="e1-caption">24 Sep 2026</span>'; }]
  ];

  reg('/reference/design-system', 'design-system', 'Design system', function () {
    var comps = c.names().length, icons = c.iconNames().length, toks = tokenCount(), routes = E1.routes.filter(function (r) { return !r.def.redirect; }).length;
    var body =
      sec('thesis', 'The thesis', 'Consistency across hundreds of screens and eight parallel builders cannot be achieved by discipline. It has to be achieved by components that make the wrong thing impossible.',
        c.card({ body: '<div class="e1-prose"><p>A design system whose rules live in a document is a document. A design system whose rules live in the component signatures is a system. So colour exists only as tokens, and a theme change is a token change. Density is a root setting, so a table cannot decide its own row height. An empty state takes three required arguments, so it cannot be written without naming what is missing and what would fill it. A proof seal reads the assurance level, so an L1 screen cannot render a signature row even by accident.</p>' +
          '<p>v2.0 keeps every v1.1 token name and API, and changes the look to the elan1 console family: the parent elan1 type layer again (Bricolage Grotesque, Outfit, JetBrains Mono), an ink top bar, a wide grouped sidebar, compact page headers with underline tabs, and a screen-info pill with screen notes on every screen. It adds the console vocabulary a product console needs — verdicts, costs, attention lists, consequence strips, gate cells and dots, letter chips, tags, channels, honesty marks, freshness stamps and share bars.</p></div>' })) +
      sec('principles', 'Eight rules', 'Each rule is enforced by a signature, a token or a check — not by a reviewer remembering.',
        '<ol class="e1-principles" role="list">' + PRINCIPLES.map(function (p) { return '<li><span class="e1-principles__k">' + p[0] + '</span><span class="e1-principles__t">' + esc(p[1]) + '</span><span class="e1-principles__d">' + esc(p[2]) + '</span></li>'; }).join('') + '</ol>') +
      sec('pages', 'In this system', null,
        '<div class="e1-linkcards">' + SUBPAGES.map(function (s) {
          return '<a class="e1-linkcard" href="' + s[2] + '"><span class="e1-linkcard__top"><span class="e1-linkcard__t">' + esc(s[0]) + '</span>' + c.icon('arrow-right', 16) + '</span><span class="e1-linkcard__d">' + esc(s[3]) + '</span><span class="e1-linkcard__prev" aria-hidden="true">' + s[4]() + '</span></a>';
        }).join('') + '</div>') +
      sec('architecture', 'Token architecture', 'Three layers. Components consume roles; roles consume brand primitives; nothing skips a layer.',
        '<div class="e1-arch">' +
          '<div class="e1-arch__col"><div class="e1-arch__h"><span class="e1-label">1</span><strong>Brand primitive</strong></div><p class="e1-caption e1-muted" style="margin-bottom:8px">The Brand Book value. Audited, rarely changed.</p>' +
            [['--brand-clay', '--brand-clay'], ['--brand-kiln', '--brand-kiln'], ['--ink-600', '--ink-600'], ['--brand-verdigris', '--brand-verdigris']].map(function (t) { return '<div class="e1-arch__row"><span class="e1-arch__dot" style="background:var(' + t[1] + ')"></span>' + t[0] + '</div>'; }).join('') + '</div>' +
          '<div class="e1-arch__col"><div class="e1-arch__h"><span class="e1-label">2</span><strong>Role token</strong></div><p class="e1-caption e1-muted" style="margin-bottom:8px">What a value is for. Redefined per theme and density.</p>' +
            [['--border-accent', '--border-accent'], ['--text-link', '--text-link'], ['--level-2-fill', '--level-2-fill'], ['--state-good', '--state-good']].map(function (t) { return '<div class="e1-arch__row"><span class="e1-arch__dot" style="background:var(' + t[1] + ')"></span>' + t[0] + '</div>'; }).join('') + '</div>' +
          '<div class="e1-arch__col"><div class="e1-arch__h"><span class="e1-label">3</span><strong>Component</strong></div><p class="e1-caption e1-muted" style="margin-bottom:8px">The class a screen uses. Never a literal colour.</p>' +
            ['.e1-btn--gate left edge', 'a, .e1-link', '.e1-level--2', '.e1-badge--good'].map(function (t) { return '<div class="e1-arch__row">' + c.icon('arrow-right', 12) + esc(t) + '</div>'; }).join('') + '</div>' +
        '</div>' +
        '<div style="margin-top:16px">' + c.callout({ kind: 'rule', title: 'Why the dark theme is defined, not inverted', body: '<p>Inverting paper gives a grey page and a clay that vibrates. The dark theme redefines each role: the page ground becomes ink, the accent steps from kiln to ember, statuses brighten to hold 4.5:1 on their own tinted grounds. The chrome is ink in both themes, so the frame of the product never moves.</p>' }) + '</div>') +
      sec('v2', 'What changed in v2.0, and why', 'A product review of v1 found that the screens read as a website. v2.0 makes them read as a product console, on the same engine and API.',
        tbl(['Change', 'Why', 'Effect on screens'], [
          ['Type: Bricolage Grotesque, Outfit, JetBrains Mono', 'The parent elan1 token layer, shared by every product in the elan1 console family. v1.1’s Schibsted and Plex pairing is retired.', 'None — screens use --font-display, --font-ui, --font-mono. Titles use --weight-title (700).'],
          ['Console chrome', 'Ink top bar (tenant, environment, level, search, waiting count, theme, density, person), wide grouped sidebar that collapses to a rail, footer strip.', 'Nothing to call — the console layout draws it.'],
          ['Screen-info pill and screen notes', 'Every screen states its number, type and section, with prev/next and the atlas; Notes opens its states, components, rules and sources.', 'Inventory items in js/inventory.js drive both.'],
          ['Page header tabs; stat bar, badge, aside, foot, flag', 'The console page header is eyebrow · title · lead · actions · underline tabs; stat cards carry a share bar and a source foot.', 'c.pageHeader({tabs}), c.stat({bar, badge, aside, foot, flag}).'],
          ['Fourteen console-vocabulary helpers', 'Queue rows, home lists and decision screens need small, exact parts that v1.1 drew by hand.', 'c.verdict, cost, attention, miniHead, gateCells, gateDots, letter, doorMark, tag, channel, honesty, asOf, who, minibar.'],
          ['Gate, meter, door, series, channel and honesty tokens', 'The new parts read role tokens only, in both themes.', '--gate-*, --meter-*, --door-*, --series-*, --channel-*, --honesty-ground.']
        ], 'What changed in v2.0') + '<p style="margin-top:12px"><a href="#/reference/changelog">Read every decision in the changelog</a></p>') +
      sec('grammar', 'The six screen types', 'Every screen is one of these. A seventh is an architecture change, not a design decision.',
        tbl(['Type', 'What it is', 'Anatomy', 'Example'], [
          ['home', 'A role’s landing surface', 'pageHeader → stat row → attention queue → recent proofs', '<a href="#/work/today">Today</a>'],
          ['list', 'Many records of one kind', 'pageHeader → toolbar → filters (in the URL) → table', '<a href="#/records/objects">Objects</a>'],
          ['record', 'One record through the four doors', 'pageHeader → tabs → body → audit stamp', '<a href="#/records/objects">A record</a>'],
          ['queue', 'Work waiting on a person, oldest first', 'table with countdowns → Decide: diff, gates, gate button', '<a href="#/work/approvals">Approvals</a>'],
          ['builder', 'A declaration being authored', 'stepper → blocks → validation against the block', '<a href="#/records/studio">Studio</a>'],
          ['ledger', 'The proof chain, read-only', 'chain standing → entries → seal → export', '<a href="#/assurance/proof">Proof & chain</a>']
        ], 'The six screen types')) +
      sec('doors', 'The four doors', 'Rail order is fixed: Work, Records, Agents, Assurance. Reference sits below a divider and is not a door.',
        '<div class="e1-grid e1-grid--4">' + E1.DOORS.map(function (d) {
          var n = E1.nav[d];
          return '<a class="e1-linkcard" href="' + esc(E1.doorHome(d)) + '"><span class="e1-linkcard__top">' + c.icon(n.icon, 22) + '<span class="e1-kbd">g ' + n.key + '</span></span><span class="e1-linkcard__t">' + esc(n.label) + '</span><span class="e1-linkcard__d">' + esc(n.question) + '. ' + n.items.length + ' sections.</span></a>';
        }).join('') + '</div>');
    return page({
      title: 'Design system', eyebrow: 'Reference · elan1 design system',
      lead: 'The elan1 design system, documented by rendering itself. Every specimen is the real component, and every measured value is read from the browser in the theme you are reading it in.',
      meta: c.tag('Tokens v2.0') + c.tag('Components v2.0') + c.tag('Brand Book v1.0') + '<span>Owner: Design, elan1 · Review cycle: every two quarters · the look follows the elan1 console family</span>',
      top: '<div class="e1-grid e1-grid--4" style="margin-bottom:24px">' +
          c.stat({ label: 'Tokens', value: toks ? E1.fmt.num(toks) : '—', aside: c.honesty('[measured]'), note: toks ? 'Custom properties resolved on :root in this browser.' : 'This browser does not expose custom properties for counting.', foot: '<span>tokens.css</span>' + c.asOf(E1.fmt.time(new Date()).replace(' IST', '')) }) +
          c.stat({ label: 'Components', value: String(REG.length), badge: c.verdict('info', REG.filter(function (r) { return r.v2; }).length + ' new in v2.0'), note: comps + ' E1.c helpers plus the core overlays, each with its own page.', href: '#/reference/components' }) +
          c.stat({ label: 'Icons', value: String(icons), note: 'Hand-drawn, 24 grid, 1.5px stroke.', foot: '<span>' + Object.keys(c.iconAliases ? c.iconAliases() : {}).length + ' aliases</span><span>--icon-stroke 1.5</span>' }) +
          c.stat({ label: 'Routes registered', value: String(routes), note: 'Read from the router at render time.', foot: '<span>' + E1.inventory().length + ' in the screen inventory</span>' + c.asOf(E1.fmt.time(new Date()).replace(' IST', '')) }) +
        '</div>',
      actions: c.button('Open components', { kind: 'secondary', href: '#/reference/components', icon: 'grid' }) + c.button('Read the framework API', { kind: 'primary', href: '#/reference/components/button', icon: 'code' }),
      toc: [{ id: 'thesis', label: 'The thesis' }, { id: 'principles', label: 'Eight rules' }, { id: 'pages', label: 'In this system' }, { id: 'architecture', label: 'Token architecture' }, { id: 'v2', label: 'What changed in v2.0' }, { id: 'grammar', label: 'Six screen types' }, { id: 'doors', label: 'The four doors' }],
      body: body
    });
  }, { keywords: 'foundations tokens design system overview principles', crumbs: [['Reference', '#/reference/design-system']] });

  /* =========================================================================
     COLOUR
     ========================================================================= */
  function swatch(token, use, o) {
    o = o || {};
    var v = rv(token) || '—';
    return '<div class="e1-swatch"><div class="e1-swatch__chip" style="background:var(' + token + ')' + (o.chipStyle ? ';' + o.chipStyle : '') + '"></div><div class="e1-swatch__body"><span class="e1-swatch__name">' + esc(token) + '</span><span class="e1-swatch__val">' + esc(v) + '</span>' + (use ? '<span class="e1-swatch__use">' + esc(use) + '</span>' : '') + '</div></div>';
  }
  function ramp(name) {
    return '<div class="e1-ramp" role="img" aria-label="' + esc(name) + ' ramp, 100 to 900">' + [100, 200, 300, 400, 500, 600, 700, 800, 900].map(function (s) {
      var tok = '--' + name + '-' + s, light = s <= 400;
      var base = (name === 'clay' && s === 500) || (name === 'ink' && s === 800);
      return '<div class="' + (base ? 'is-base' : '') + '" style="background:var(' + tok + ');color:var(' + (light ? '--ink-800' : '--ink-100') + ')" title="' + esc(tok + ' ' + rv(tok)) + '"><strong>' + s + (base ? ' base' : '') + '</strong><span>' + esc(rv(tok)) + '</span></div>';
    }).join('') + '</div>';
  }
  var CONTRAST = [
    ['--text-primary', '--bg-surface', 'Body text on a card', 4.5],
    ['--text-primary', '--bg-canvas', 'Body text on the page ground', 4.5],
    ['--text-secondary', '--bg-surface', 'Supporting sentences', 4.5],
    ['--text-tertiary', '--bg-surface', 'Captions and labels', 4.5],
    ['--text-tertiary', '--bg-sunken', 'Table header labels', 4.5],
    ['--text-accent', '--bg-surface', 'Links and brand emphasis', 4.5],
    ['--text-inverse', '--text-primary', 'Primary and gate button labels', 4.5],
    ['--text-on-chrome', '--bg-chrome', 'Rail and top bar labels', 4.5],
    ['--text-on-chrome-quiet', '--bg-chrome', 'Rail micro labels, tenant line', 4.5],
    ['--chrome-sandbox-fg', '--bg-chrome', 'Sandbox badge on the top bar', 4.5],
    ['--state-good', '--state-good-bg', 'Good badge', 4.5],
    ['--state-warning', '--state-warning-bg', 'Warning badge', 4.5],
    ['--state-serious', '--state-serious-bg', 'Serious badge', 4.5],
    ['--state-critical', '--state-critical-bg', 'Critical badge', 4.5],
    ['--state-info', '--state-info-bg', 'Info badge', 4.5],
    ['--state-neutral', '--state-neutral-bg', 'Neutral badge', 4.5],
    ['--level-1', '--level-1-bg', 'L1 Guarded pill', 4.5],
    ['--level-2', '--level-2-bg', 'L2 Attested pill', 4.5],
    ['--level-3', '--level-3-bg', 'L3 Proven pill', 4.5],
    ['--actor-agent-fg', '--actor-agent-bg', 'Agent avatar glyph', 3.0],
    ['--actor-person-fg', '--actor-person-bg', 'Person avatar initials', 4.5],
    ['--border-default', '--bg-surface', 'Input edge — non-text', 3.0],
    ['--focus-ring', '--bg-canvas', 'Focus ring — non-text', 3.0],
    ['--focus-ring', '--bg-surface', 'Focus ring on a card — non-text', 3.0],
    ['--chart-series-primary', '--bg-surface', 'Chart line and bars — non-text', 3.0],
    ['--chart-series-accent', '--bg-surface', 'Highlighted series — non-text', 3.0],
    ['--brand-clay', '--bg-canvas', 'The disc — non-text', 3.0]
  ];
  function contrastTable() {
    var pass = 0;
    var rows = CONTRAST.map(function (p) {
      var r = ratio(rv(p[0]), rv(p[1])), ok = r !== null && r >= p[3];
      if (ok) pass++;
      return '<tr><th scope="row"><span class="e1-row" style="gap:10px;flex-wrap:nowrap"><span aria-hidden="true" style="display:inline-grid;place-items:center;width:34px;height:26px;border-radius:3px;border:1px solid var(--border-subtle);background:var(' + p[1] + ');color:var(' + p[0] + ');font:600 13px var(--font-ui)">Aa</span><span class="e1-mono" style="font-size:12px">' + esc(p[0]) + ' <span class="e1-muted">on</span> ' + esc(p[1]) + '</span></span></th>' +
        '<td>' + esc(p[2]) + '</td><td class="is-right e1-mono">' + (r === null ? '—' : r.toFixed(2) + ':1') + '</td><td class="is-right e1-mono">' + p[3].toFixed(1) + ':1</td><td>' + (r === null ? c.badge('neutral', 'Not measurable') : ok ? c.badge('good', 'Passes') : c.badge('critical', 'Fails')) + '</td></tr>';
    }).join('');
    return { pass: pass, html: '<div class="e1-table-wrap"><table class="e1-table"><caption class="e1-sr">Measured contrast ratios for the key colour pairs in the current theme</caption><thead><tr><th scope="col">Pair</th><th scope="col">Where it is used</th><th scope="col" class="is-right">Measured</th><th scope="col" class="is-right">Floor</th><th scope="col">Verdict</th></tr></thead><tbody>' + rows + '</tbody></table></div>' };
  }

  reg('/reference/design-system/colour', 'ds-colour', 'Colour', function () {
    var ct = contrastTable();
    var body =
      sec('primitives', 'Brand primitives', 'The Brand Book values. Components never consume these directly — they consume the role tokens below.',
        '<div class="e1-swatches">' +
          swatch('--brand-ink', 'The chrome. Rail, top bar, primary fill. Carries all body text on paper.') +
          swatch('--brand-clay', 'The single accent. Emphasis and selection, never state. Clears 3:1 on both grounds.') +
          swatch('--brand-paper', 'The page ground in the light theme. Warm, not white.') +
          swatch('--brand-bone', 'Wells, code blocks, inset areas, table headers.') +
          swatch('--brand-slate', 'Chrome active state; the second plane on ink.') +
          swatch('--brand-graphite', 'Secondary text on paper at 7.3:1.') +
          swatch('--brand-ember', 'The accent that survives an ink ground. 2.5:1 on paper — decoration only there.') +
          swatch('--brand-kiln', 'The accent that reaches 7:1 on paper. Text and links.') +
        '</div>' +
        '<h3 class="e1-text-section" style="margin:24px 0 12px">Functional primitives</h3><p class="e1-muted" style="margin-bottom:12px;max-width:var(--measure)">These four exist so that clay never has to mean anything. They reach the product only through the status and blast roles, never as a brand colour.</p>' +
        '<div class="e1-swatches">' + swatch('--brand-verdigris', 'Approved, committed, healthy.') + swatch('--brand-amber', 'Awaiting approval, held.') + swatch('--brand-crimson', 'Rejected, failed, blocked. Cooler than clay on purpose.') + swatch('--brand-cobalt', 'Informational, in progress. Also the focus ring.') + '</div>') +
      sec('ramps', 'The two ramps', 'Clay and ink, nine steps each. 100–300 tints and hovers · 500 base · 700–900 text on tints.',
        '<div class="e1-stack">' + '<p class="e1-label">Clay</p>' + ramp('clay') + '<p class="e1-label" style="margin-top:8px">Ink</p>' + ramp('ink') + '</div>') +
      sec('surfaces', 'Surface roles', 'What a colour is for, not what it looks like. This is why the dark theme is defined rather than inverted.',
        '<div class="e1-swatches">' + [
          ['--bg-canvas', 'The page ground.'], ['--bg-surface', 'Cards, panels, tables.'], ['--bg-sunken', 'Wells, code, table headers.'], ['--bg-raised', 'Popovers, dialogs, menus.'],
          ['--bg-chrome', 'Rail and top bar. Always ink, in both themes.'], ['--bg-chrome-hover', 'Rail item hover.'], ['--bg-chrome-active', 'Rail item current.'],
          ['--bg-hover', 'Row and control hover.'], ['--bg-active', 'Row pressed.'], ['--bg-selected', 'Selection. Clay, and therefore never a status.']
        ].map(function (s) { return swatch(s[0], s[1]); }).join('') + '</div>') +
      sec('text', 'Text roles', 'Tertiary is for captions and labels. It is not a quieter body colour.',
        '<div class="e1-swatches">' + [
          ['--text-primary', 'Body, table cells, headings.'], ['--text-secondary', 'Supporting sentences, subtitles.'], ['--text-tertiary', 'Captions and labels only.'], ['--text-disabled', 'A control that cannot be operated.'],
          ['--text-inverse', 'Text on a primary or gate fill.'], ['--text-on-chrome', 'Rail and top bar labels.'], ['--text-on-chrome-quiet', 'Rail micro labels, tenant line.'], ['--text-accent', 'Brand emphasis. Never “approved”.'], ['--text-link', 'Links. Same value as the accent, named separately.']
        ].map(function (s) { return swatch(s[0], s[1]); }).join('') + '</div>') +
      sec('borders', 'Border roles', 'Strong is the decided edge: approvals, primary fills, the proof seal.',
        '<div class="e1-swatches">' + [['--border-subtle', 'Table rules, dividers, card edges.'], ['--border-default', 'Inputs, buttons, menus. 3:1 on surface.'], ['--border-strong', 'The decided edge — approvals, seals.'], ['--border-accent', 'Selection edge and the gate button’s left edge.'], ['--border-chrome', 'Rules inside the ink chrome.']].map(function (s) { return swatch(s[0], s[1]); }).join('') + '</div>') +
      sec('status', 'The reserved status palette', 'Six statuses, and no seventh. Never used for a data series, a category or a brand accent. Each ships with a word and a glyph.',
        tbl(['State', 'Means', 'Badge', 'Subtle', 'Tokens'], [
          ['Good', 'Approved, committed, healthy, verified.', c.badge('good', 'Committed'), c.badge('good', 'Passed', { subtle: true }), '<code>--state-good · -bg · -border</code>'],
          ['Warning', 'Waiting on a person, approaching a limit.', c.badge('warning', 'Awaiting approval'), c.badge('warning', 'Expiring', { subtle: true }), '<code>--state-warning · -accent · -bg · -border</code>'],
          ['Serious', 'Held, drifting, partially declared.', c.badge('serious', 'Held'), c.badge('serious', 'Drifting', { subtle: true }), '<code>--state-serious · -bg · -border</code>'],
          ['Critical', 'Platform failure, broken chain, blocked, unrated.', c.badge('critical', 'Platform failure'), c.badge('critical', 'Break at #3,882', { subtle: true }), '<code>--state-critical · -bg · -border</code>'],
          ['Info', 'In progress, informational, scheduled.', c.badge('info', 'In progress'), c.badge('info', 'Scheduled', { subtle: true }), '<code>--state-info · -bg · -border</code>'],
          ['Neutral', 'No signal; and a refusal — “Not done” is a correct, free outcome, never red.', c.badge('neutral', 'Not done', { icon: 'refuse' }), c.badge('neutral', 'Not checked', { subtle: true }), '<code>--state-neutral · -bg · -border</code>']
        ], 'Status palette')) +
      sec('ladders', 'Ladders that are not statuses', 'Blast radius, assurance level and actor kind are properties, not health signals. Each has its own tokens, and each reads without colour.',
        '<div class="e1-grid e1-grid--3">' +
          c.card({ title: 'Blast radius', eyebrow: '--blast-1…5', body: '<div class="e1-stack e1-stack--sm">' + [1, 2, 3, 4, 5].map(function (n) { return c.blast(n, { note: false }); }).join('') + '</div><p class="e1-caption e1-muted" style="margin-top:12px">The five declared radius values. Reversibility is a separate chip: ' + c.reversible('24 h') + ' ' + c.reversible(false) + '</p>' }) +
          c.card({ title: 'Assurance level', eyebrow: 'v1.1 · --level-1…3', body: '<div class="e1-stack e1-stack--sm">' + ['L1', 'L2', 'L3'].map(function (L) { return '<div class="e1-row">' + c.level(L) + '<span class="e1-caption e1-muted">' + esc(E1.LEVELS[L].claim) + '</span></div>'; }).join('') + '</div><p class="e1-caption e1-muted" style="margin-top:12px">An ordered ladder on the ink ramp. The number of filled bars carries the order.</p>' }) +
          c.card({ title: 'Actor kind', eyebrow: 'v1.1 · --actor-*', body: '<div class="e1-stack e1-stack--sm">' + c.actor({ name: 'Venkat Raman', kind: 'person', role: 'Accounts head' }) + c.actor({ name: 'ar-agent', kind: 'agent', role: 'A2 Propose' }) + c.actor({ name: 'Kernel', kind: 'system', role: 'Rung 8 proof' }) + '</div><p class="e1-caption e1-muted" style="margin-top:12px">Person is a circle, agent a square with a cut corner on the 50° bearing, and the kind is always written.</p>' }) +
        '</div>') +
      sec('viz', 'The visualisation ramp', 'The clay and ink fusion, mixed in OKLab. Sequential by construction, so a chart cannot accidentally imply a status.',
        '<div class="e1-ramp" style="grid-template-columns:repeat(8,minmax(0,1fr))" role="img" aria-label="Visualisation ramp, eight steps">' + [1, 2, 3, 4, 5, 6, 7, 8].map(function (i) { return '<div style="background:var(--viz-' + i + ');color:var(' + (i >= 6 ? '--ink-800' : '--ink-100') + ')"><strong>' + i + '</strong><span>' + esc(rv('--viz-' + i)) + '</span></div>'; }).join('') + '</div>' +
        '<div class="e1-grid e1-grid--2" style="margin-top:16px">' +
          c.card({ body: c.meter([{ label: 'Sales invoices', value: 1184 }, { label: 'Payments', value: 906 }, { label: 'Stock moves', value: 732 }, { label: 'Supplier bills', value: 441 }, { label: 'Other', value: 470 }], { caption: 'Committed writes by write type, 1–24 Sep 2026' }) }) +
          c.card({ body: c.lineChart({ title: 'Governed writes per week', labels: ['W31', 'W32', 'W33', 'W34', 'W35', 'W36', 'W37', 'W38'], series: [{ name: 'This quarter', values: [212, 236, 251, 244, 268, 281, 276, 302], accent: true }, { name: 'Last quarter', values: [180, 192, 201, 214, 208, 219, 231, 238], muted: true }], height: 160 }) }) +
        '</div>' +
        '<p class="e1-caption e1-muted" style="margin-top:10px">Chart roles (v1.1): <code>--chart-series-primary</code>, <code>--chart-series-accent</code> (the one highlighted series), <code>--chart-series-muted</code> (comparison), <code>--chart-grid</code>, <code>--chart-axis</code>, <code>--chart-label</code>, and <code>--chart-1…8</code> for categories.</p>') +
      sec('zones', 'Diagram zones', 'Diagrams only, never status. Architecture and flow diagrams colour their regions with --zone-*; nothing outside a diagram may use them.',
        '<div class="e1-grid e1-grid--3">' + [['kernel', 'Kernel', 'The nine-rung write path, the proof store.'], ['consumer', 'Consumer', 'The app or agent calling act.write.'], ['runtime', 'Runtime', 'Sandbox, live apply, the adapters.'], ['people', 'People', 'Approvers, owners, the resolver set.'], ['refusal', 'Refusal', 'Where a write stops. Dashed, because it is a boundary, not an error.'], ['external', 'External', 'ERPNext, the bank, GSTN — outside the organisation.']].map(function (z) {
          return '<div class="e1-zone e1-zone--' + z[0] + '"><div class="e1-zone__label">' + esc(z[1]) + '</div><p class="e1-caption" style="margin-top:4px">' + esc(z[2]) + '</p><p class="e1-mono e1-caption" style="margin-top:6px;color:var(--text-secondary)">--zone-' + z[0] + ' · -bg</p></div>';
        }).join('') + '</div>' +
        '<div style="margin-top:12px">' + c.callout({ kind: 'rule', title: 'Never a status.', body: '<p>--zone-refusal is not “refused”, and --zone-people is not “approved”. Outside a diagram, use c.outcome(), c.badge() and c.blast(). Class helpers: <code>.e1-zone .e1-zone--kernel</code> … <code>--external</code>, with <code>.e1-zone__label</code>.</p>' }) + '</div>') +
      sec('pair', 'Light and dark', 'The same components under both token scopes. Chrome stays ink; everything else is redefined.',
        themePair('<div class="e1-row">' + c.button('Approve and commit', { kind: 'gate' }) + c.button('Secondary') + '</div><div class="e1-row">' + c.badge('good', 'Committed') + c.badge('warning', 'Waiting on a person') + c.outcome('refused') + c.level('L1') + '</div>' + c.blast(3) + '<p style="color:var(--text-secondary)">Credit check clean against <a href="#/records/object/SINV-2026-01187">SINV-2026-01187</a>.</p>')) +
      sec('contrast', 'Measured contrast', 'Computed in the browser from the resolved tokens, against the WCAG 2.2 floors: 4.5:1 for text, 3:1 for non-text. Switch the theme in the top bar and every ratio re-measures.',
        '<div class="e1-row" style="margin-bottom:12px">' + (ct.pass === CONTRAST.length ? c.badge('good', ct.pass + ' of ' + CONTRAST.length + ' pairs pass') : c.badge('critical', (CONTRAST.length - ct.pass) + ' of ' + CONTRAST.length + ' pairs fail')) + '<span class="e1-caption e1-muted">' + (E1.state.theme === 'dark' ? 'Dark' : 'Light') + ' theme, measured ' + esc(E1.fmt.time(new Date())) + '</span>' + c.button(E1.state.theme === 'dark' ? 'Measure the light theme' : 'Measure the dark theme', { kind: 'ghost', size: 'sm', icon: E1.state.theme === 'dark' ? 'sun' : 'moon', attrs: 'data-action="theme"' }) + '</div>' + ct.html);
    return page({
      title: 'Colour', lead: 'Colour exists only as tokens. Clay is emphasis and selection, never a status. Six statuses carry state, always with a word. Everything on this page is read from the stylesheet as it resolves right now.',
      toc: [{ id: 'primitives', label: 'Brand primitives' }, { id: 'ramps', label: 'Ramps' }, { id: 'surfaces', label: 'Surface roles' }, { id: 'text', label: 'Text roles' }, { id: 'borders', label: 'Border roles' }, { id: 'status', label: 'Status palette' }, { id: 'ladders', label: 'Ladders' }, { id: 'viz', label: 'Visualisation' }, { id: 'zones', label: 'Diagram zones' }, { id: 'pair', label: 'Light and dark' }, { id: 'contrast', label: 'Measured contrast' }],
      body: body
    });
  }, { keywords: 'colour color palette tokens contrast status clay ink' });

  /* =========================================================================
     TYPE
     ========================================================================= */
  var SCALE = [
    ['display', 'Governed intelligence', 'Hub and website display. Rare — one per screen at most.', 'var(--font-display)', 'var(--weight-bold)', 'var(--tracking-display)'],
    ['page-title', 'Awaiting approval', 'Console page title, in the page header (v2.0).', 'var(--font-display)', 'var(--weight-title)', 'var(--tracking-title)'],
    ['title', 'Approval queue', 'Docs and dialog titles.', 'var(--font-display)', 'var(--weight-title)', 'var(--tracking-title)'],
    ['section', 'Reason chain', 'Panel and section heading.', 'var(--font-display)', 'var(--weight-semibold)', '-.01em'],
    ['lead', 'Four approvals are waiting on you. The oldest has waited 6 days 4 hours.', 'One lead paragraph, at the top of a screen. Outfit 400.', 'var(--font-ui)', 'var(--weight-light)', '0'],
    ['body', 'Credit check clean for ACME Textiles: exposure ₹2,88,000 against a ₹3,00,000 limit.', 'Body copy and every table cell.', 'var(--font-ui)', 'var(--weight-regular)', '0'],
    ['caption', 'Reversible for 30 days from commit.', 'Captions, helper text, badges.', 'var(--font-ui)', 'var(--weight-regular)', '0'],
    ['label', 'BLAST RADIUS', 'The uppercase label. The only letterspaced type.', 'var(--font-ui)', 'var(--weight-semibold)', 'var(--tracking-label)'],
    ['micro', '#4,101 · committed', 'Dense chrome only. Rail labels, seal footers.', 'var(--font-ui)', 'var(--weight-medium)', '0']
  ];
  reg('/reference/design-system/type', 'ds-type', 'Type', function () {
    var faces =
      '<div class="e1-grid e1-grid--3">' +
        '<div class="e1-face"><p class="e1-label">Headings · --font-display</p><span class="e1-face__aa" style="font-family:var(--font-display);font-weight:700">Aa Gg1</span><strong style="font:600 var(--text-section)/1.2 var(--font-display)">Bricolage Grotesque</strong><p class="e1-face__abc" style="font-family:var(--font-display)">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz 0123456789</p><p class="e1-caption e1-muted">The parent elan1 display face, with an optical-size axis so a 26px page title and a 13px card head both hold. Page and card titles at 700 (--weight-title), hub display at 800, section heads at 600, tracked −1% to −3%.</p></div>' +
        '<div class="e1-face"><p class="e1-label">Interface and body · --font-ui</p><span class="e1-face__aa" style="font-family:var(--font-ui);font-weight:400">Aa Il1</span><strong style="font:600 var(--text-section)/1.2 var(--font-ui)">Outfit</strong><p class="e1-face__abc" style="font-family:var(--font-ui)">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz 0123456789</p><p class="e1-caption e1-muted">The parent elan1 interface face: geometric, open and calm at 13–14px for a seven-hour working day. Body 400, controls and row heads 500, labels and emphasis 600.</p></div>' +
        '<div class="e1-face"><p class="e1-label">Identifiers · --font-mono</p><span class="e1-face__aa e1-mono" style="font-size:56px">0O 1l</span><strong style="font:600 var(--text-section)/1.2 var(--font-mono)">JetBrains Mono</strong><p class="e1-face__abc e1-mono">8d54d944fc…4f3c62fe<br>₹27,64,300 · 33AAACK4821M1Z7</p><p class="e1-caption e1-muted">Hashes, amounts, GSTINs, run and sequence numbers, costs and times. Dotted zero and tabular figures, so a column of digits cannot jitter as a value updates.</p></div>' +
      '</div>' +
      '<div style="margin-top:16px">' + c.callout({ kind: 'info', title: 'Loading', body: '<p>index.html loads the three families from Google Fonts with <code>display=swap</code>. Each stack falls back to a system face with similar metrics — Helvetica Neue or Arial for Bricolage, system-ui for Outfit, ui-monospace for JetBrains Mono — so an offline or sandboxed page still holds its layout. The lockup is an image and never depends on a font.</p>' }) + '</div>';
    var scale = '<div class="e1-card"><div class="e1-card__body">' + SCALE.map(function (s) {
      var size = rv('--text-' + s[0]), lh = rv('--lh-' + s[0]);
      return '<div class="e1-typespec"><div class="e1-typespec__meta"><code>--text-' + s[0] + '</code><span class="e1-mono">' + esc(size) + ' / ' + esc(lh) + '</span><span>' + esc(s[2]) + '</span></div>' +
        '<div class="e1-typespec__sample" style="font-family:' + s[3] + ';font-size:var(--text-' + s[0] + ');line-height:var(--lh-' + s[0] + ');font-weight:' + s[4] + ';letter-spacing:' + s[5] + (s[0] === 'label' ? ';text-transform:uppercase' : '') + (s[0] === 'lead' ? ';color:var(--text-secondary)' : '') + '">' + esc(s[1]) + '</div></div>';
    }).join('') + '</div></div>';
    var weights = tbl(['Token', 'Value', 'Face and use'], [
      ['<code>--weight-light</code>', rv('--weight-light'), 'Kept for v1.1 call sites; v2.0 leads are regular'],
      ['<code>--weight-regular</code>', rv('--weight-regular'), 'Outfit body, leads and table cells'],
      ['<code>--weight-medium</code>', rv('--weight-medium'), 'Outfit controls, table row headers, names'],
      ['<code>--weight-semibold</code>', rv('--weight-semibold'), 'Outfit labels and emphasis · Bricolage section heads'],
      ['<code>--weight-title</code>', rv('--weight-title'), 'Bricolage page and card titles (v2.0)'],
      ['<code>--weight-bold</code>', rv('--weight-bold'), 'Bricolage hub and website display (the parent value, 800)']
    ], 'Weights');
    var numerals = '<div class="e1-grid e1-grid--2">' +
      c.card({ title: 'Numerals in data', body: c.kv([['Amount', c.amount(2764300, { strong: true }), { html: true }], ['Short form', E1.fmt.inrShort(2764300), { mono: true }], ['Crore', E1.fmt.inr(42500000), { mono: true }], ['Sequence', '#' + E1.fmt.num(4101), { mono: true }], ['Hash', c.hash('8d54d944fcf42b4f0737dbf452bc25356388738b9df18839e24efa204f3c62fe'), { html: true }], ['When', E1.fmt.dateTime(new Date()), {}]]) }) +
      c.card({ title: 'Numerals in prose', body: '<p class="e1-prose">Numerals for all quantities, including one to nine: 4 approvals are waiting, not four. Proportional figures in running text; tabular figures in tables and data. Amounts use Indian grouping — ₹18,42,760, never ₹1,842,760 — and times are shown in IST with the zone written.</p>' }) + '</div>';
    var rules = dodont([
      'Use Bricolage Grotesque for headings and Outfit for everything else. Two faces, plus JetBrains Mono for identifiers, costs and times.',
      'Set headings and buttons in sentence case. Uppercase is for 11px labels only, tracked +8%.',
      'Keep body measure between 45 and 75 characters (--measure is 68ch).',
      'Use at most two type sizes per element; hierarchy comes from weight and space.',
      'Use tabular figures (.e1-mono or .e1-num) wherever numbers align in a column.'
    ], [
      'Do not letterspace display or body type. Only labels are tracked.',
      'Do not typeset the wordmark. The lockup is a drawn asset; use the image.',
      'Do not justify text or turn hyphenation on. Ragged right.',
      'Do not use Title Case for headings; it is reserved for proper nouns.',
      'Do not set anything below 10px. --text-micro is the floor, and only in dense chrome.'
    ]);
    var why = c.card({ body: '<div class="e1-prose"><p>The Brand Book’s scale is drawn for a 1920px page: display at 140px, page title at 76px, body at 27px. Those magnitudes are right for a page a person reads once, standing up. An operator reconciling GSTR-2B needs forty rows on a screen, not eleven.</p><p>So the product scale keeps the parent faces and rules and drops the poster magnitudes: display 34, page title 26, title 24, section 18, lead 16, body 14, caption 12, label 11, micro 10 — sized for a person who sits in front of it for seven hours.</p></div>' });
    return page({
      title: 'Type', lead: 'Bricolage Grotesque for headings, Outfit for the interface, JetBrains Mono for anything a person might need to compare character by character — the parent elan1 token layer, as every console in the family uses it.',
      toc: [{ id: 'faces', label: 'The three faces' }, { id: 'scale', label: 'Product type scale' }, { id: 'weights', label: 'Weights' }, { id: 'numerals', label: 'Numerals' }, { id: 'why', label: 'Why not the brand scale' }, { id: 'rules', label: 'Rules' }],
      body: sec('faces', 'The three faces', 'The parent elan1 token layer. All three are SIL Open Font License 1.1.', faces) +
        sec('scale', 'The product type scale', 'Rendered live at real size. Sizes and line heights are read from the token layer, so this specimen cannot disagree with the CSS.', scale) +
        sec('weights', 'Weights', null, weights) +
        sec('numerals', 'Numerals', null, numerals) +
        sec('why', 'Why the product scale is not the brand scale', null, why) +
        sec('rules', 'Rules', null, rules)
    });
  }, { keywords: 'typography fonts type scale bricolage outfit jetbrains mono' });

  /* =========================================================================
     SPACE, DENSITY, MOTION
     ========================================================================= */
  E1.action('ds-replay', function (el) {
    var box = document.getElementById(el.getAttribute('aria-controls'));
    if (!box) return;
    box.style.setProperty('--mw', box.clientWidth + 'px');
    box.classList.remove('is-run'); void box.offsetWidth;
    box.classList.add('is-run');
  });
  reg('/reference/design-system/space', 'ds-space', 'Space, density & motion', function () {
    var spaces = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (i) { return '<div class="e1-spacebar"><code>--space-' + i + '</code><span class="e1-muted">' + esc(rv('--space-' + i)) + '</span><i style="width:var(--space-' + i + ')"></i></div>'; }).join('');
    var dens = [['--row-height', 'Table row'], ['--control-height', 'Buttons, inputs'], ['--control-height-sm', 'Small controls'], ['--control-height-lg', 'Large controls'], ['--pane-padding', 'Card and pane padding'], ['--cell-padding-x', 'Cell padding, horizontal'], ['--cell-padding-y', 'Cell padding, vertical'], ['--stack-gap', 'Gap between stacked blocks']];
    var sample = c.table({
      caption: 'Sales invoices, rendered at the density currently selected',
      columns: [{ key: 'inv', label: 'Invoice', mono: true }, { key: 'vendor', label: 'Customer' }, { key: 'amt', label: 'Amount', align: 'right', render: function (r) { return c.amount(r.amt); } }, { key: 'due', label: 'Due' }, { key: 'st', label: 'Status', render: function (r) { return c.badge(r.st[0], r.st[1]); } }],
      rows: [
        { inv: 'SINV-2026-01187', vendor: 'ACME Textiles', amt: 240000, due: '24 Oct 2026', st: ['warning', 'Waiting on a person'] },
        { inv: 'SINV-2026-01162', vendor: 'Lakshmi Garments', amt: 186400, due: '10 Oct 2026', st: ['good', 'Committed'] },
        { inv: 'INV-2026-0834', vendor: 'Shree Murugan Traders', amt: 200000, due: '—', st: ['info', 'Cancelled (irreversible)'] },
        { inv: 'SINV-2026-01171', vendor: 'Tiruppur Knit Exports', amt: 482160, due: '18 Oct 2026', st: ['serious', 'IRN pending'] },
        { inv: 'SINV-2026-01190', vendor: 'Shree Ganesh Handlooms', amt: 96500, due: '—', st: ['neutral', 'Not done'] }
      ]
    });
    var density = spec('Density, live', '<div class="e1-stack" style="width:100%">' +
      '<div class="e1-row e1-row--between"><div class="e1-row">' + c.segmented([{ id: 'compact', label: 'Compact' }, { id: 'default', label: 'Default' }, { id: 'comfortable', label: 'Comfortable' }], E1.state.density, { name: 'ds-density', label: 'Density' }) + '<span class="e1-caption e1-muted">This changes the whole console, not this table.</span></div>' + c.button('Approve and commit', { kind: 'gate' }) + '</div>' +
      sample + '<div class="e1-grid e1-grid--4">' + dens.map(function (d) { return '<div class="e1-stat" style="padding:10px 12px"><div class="e1-stat__label">' + esc(d[1]) + '</div><div class="e1-mono" style="margin-top:4px">' + esc(d[0]) + '</div><div class="e1-text-section" style="margin-top:2px">' + esc(rv(d[0])) + '</div></div>'; }).join('') + '</div></div>', { col: true, plain: true, note: 'Currently ' + E1.state.density });
    var radii = [['--radius-none', 'Table cells, seals — anything that must read as a record.'], ['--radius-sm', 'Inputs, buttons, badges.'], ['--radius-md', 'Cards and panes.'], ['--radius-lg', 'Dialogs and popovers.'], ['--radius-full', 'The disc, avatars, chips, progress tracks.']];
    var elev = [['--shadow-1', 'A card lifted off the canvas. Almost nothing.'], ['--shadow-2', 'A menu, a segmented-control thumb.'], ['--shadow-3', 'A popover over content.'], ['--shadow-4', 'A modal dialog. The only step that darkens the room.']];
    var durs = [['--dur-instant', 'Hover and press.'], ['--dur-fast', 'Colour and opacity on controls. The default.'], ['--dur-base', 'A panel opening, a value moving.'], ['--dur-slow', 'A dialog entering. The longest the system allows.']];
    var eases = [['--ease-out', 'Anything leaving or settling. The workhorse.'], ['--ease-in-out', 'A value travelling between two known points.'], ['--ease-entrance', 'A surface arriving — dialogs, popovers.']];
    var motion = '<div class="e1-grid e1-grid--2">' +
      c.card({ title: 'Durations', eyebrow: 'All on --ease-out', body: '<div class="e1-stack">' + durs.map(function (d, i) { var id = 'mb-d' + i; return '<div><div class="e1-row e1-row--between"><span><code>' + d[0] + '</code> <span class="e1-muted e1-mono">' + esc(rv(d[0])) + '</span></span>' + c.button('Replay', { kind: 'ghost', size: 'sm', icon: 'play', attrs: 'data-action="ds-replay" aria-controls="' + id + '"' }) + '</div><div class="e1-motionbox" id="' + id + '" style="margin-top:6px"><i style="transition-duration:var(' + d[0] + ')"></i></div><p class="e1-caption e1-muted" style="margin-top:4px">' + esc(d[1]) + '</p></div>'; }).join('') + '</div>' }) +
      c.card({ title: 'Easings', eyebrow: 'All at --dur-slow', body: '<div class="e1-stack">' + eases.map(function (d, i) { var id = 'mb-e' + i; return '<div><div class="e1-row e1-row--between"><span><code>' + d[0] + '</code></span>' + c.button('Replay', { kind: 'ghost', size: 'sm', icon: 'play', attrs: 'data-action="ds-replay" aria-controls="' + id + '"' }) + '</div><div class="e1-motionbox" id="' + id + '" style="margin-top:6px"><i style="transition-duration:var(--dur-slow);transition-timing-function:var(' + d[0] + ')"></i></div><p class="e1-caption e1-muted" style="margin-top:4px">' + esc(d[1]) + ' <span class="e1-mono">' + esc(rv(d[0])) + '</span></p></div>'; }).join('') + '</div>' +
        '<p class="e1-caption" style="margin-top:12px">Reduced motion collapses all four durations to 0 at the token layer — no per-component check.</p>' }) + '</div>';
    var layoutConsts = tbl(['Token', 'Value', 'Use'], [
      ['<code>--content-max</code>', rv('--content-max'), 'Reading pages and forms'], ['<code>--content-wide</code>', rv('--content-wide'), 'Console content ceiling'], ['<code>--measure</code>', rv('--measure'), 'Body measure'],
      ['<code>--rail-width</code>', rv('--rail-width'), 'Door rail'], ['<code>--subnav-width</code>', rv('--subnav-width'), 'Door sections panel (v1.1)'], ['<code>--topbar-height</code>', rv('--topbar-height'), 'Ink top bar'], ['<code>--subbar-height</code>', rv('--subbar-height'), 'Breadcrumb bar'],
      ['<code>--panel-width</code> · <code>--panel-width-wide</code>', rv('--panel-width') + ' · ' + rv('--panel-width-wide'), 'Split-view side panels'], ['<code>--tabbar-height</code>', rv('--tabbar-height'), 'Mobile door tab bar (v1.1)'], ['<code>--touch-min</code>', rv('--touch-min'), 'Minimum touch target (v1.1)'], ['<code>--bearing</code>', rv('--bearing'), 'The house angle for any diagonal']
    ], 'Layout constants');
    var bps = tbl(['Token', 'Width', 'What changes'], [
      ['<code>--bp-xs</code>', '360px', 'Smallest supported phone. Everything must work here.'], ['<code>--bp-sm</code>', '560px', 'Gate rows drop their ids; refusal card un-indents.'],
      ['<code>--bp-md</code>', '720px', 'The rail becomes a bottom tab bar; sections open as a sheet; grids collapse to one column.'], ['<code>--bp-lg</code>', '1024px', 'The sections panel leaves the grid and opens as a drawer.'],
      ['<code>--bp-xl</code>', '1280px', 'The on-this-page table of contents appears.'], ['<code>--bp-2xl</code>', '1536px', 'Content stops at --content-wide.']
    ], 'Breakpoints');
    var sizes = '<div class="e1-grid e1-grid--2">' +
      c.card({ title: 'Icon sizes', eyebrow: 'v1.1', body: '<div class="e1-row" style="gap:20px;align-items:flex-end">' + [['xs', 12], ['sm', 14], ['md', 16], ['lg', 20], ['xl', 24]].map(function (s) { return '<div style="display:flex;flex-direction:column;align-items:center;gap:6px">' + c.icon('assurance', s[1]) + '<code style="font-size:11px">--icon-' + s[0] + '</code><span class="e1-caption e1-muted">' + s[1] + 'px</span></div>'; }).join('') + '</div>' }) +
      c.card({ title: 'Avatar sizes', eyebrow: 'v1.1', body: '<div class="e1-row" style="gap:16px;align-items:flex-end">' + ['xs', 'sm', 'md', 'lg', 'xl'].map(function (s) { return '<div style="display:flex;flex-direction:column;align-items:center;gap:6px">' + c.avatar('Venkat Raman', { size: s }) + '<code style="font-size:11px">--avatar-' + s + '</code><span class="e1-caption e1-muted">' + esc(rv('--avatar-' + s)) + '</span></div>'; }).join('') + c.avatar('ar-agent', { kind: 'agent', size: 'lg' }) + '</div>' }) + '</div>';
    var zs = tbl(['Token', 'Value', 'Layer'], [['<code>--z-sticky</code>', rv('--z-sticky'), 'Breadcrumb bar, sticky table heads'], ['<code>--z-chrome</code>', rv('--z-chrome'), 'Top bar, rail, tab bar (v1.1)'], ['<code>--z-overlay</code>', rv('--z-overlay'), 'Menus and popovers'], ['<code>--z-modal</code>', rv('--z-modal'), 'Dialogs, drawers, sheets'], ['<code>--z-palette</code>', rv('--z-palette'), 'Command palette (v1.1)'], ['<code>--z-toast</code>', rv('--z-toast'), 'Toasts'], ['<code>--z-tooltip</code>', rv('--z-tooltip'), 'Tooltips (v1.1)']], 'Z-index');
    return page({
      title: 'Space, density & motion', lead: 'Ten spacing steps on an 8px baseline. Three densities decided at the root. Radii kept small because the brand’s only true curve is a circle. Motion that settles, never bounces.',
      toc: [{ id: 'spacing', label: 'Spacing' }, { id: 'density', label: 'Density' }, { id: 'grid', label: 'Grid' }, { id: 'layout', label: 'Layout constants' }, { id: 'breakpoints', label: 'Breakpoints' }, { id: 'radius', label: 'Radius' }, { id: 'elevation', label: 'Elevation' }, { id: 'motion', label: 'Motion' }, { id: 'sizes', label: 'Icon and avatar sizes' }, { id: 'z', label: 'Z-index' }],
      body: sec('spacing', 'The spacing scale', 'The 4px half-step exists for the inside of a control, and nowhere else.', c.card({ body: spaces })) +
        sec('density', 'Density', 'A root token. No component sets a row height, cell padding or control height of its own.', density) +
        sec('grid', 'Grid', '12 equal columns with a 16px gutter on an 8px baseline. Standard splits: 6+6, 8+4, 4+4+4, 3×4.', spec('12 columns', '<div class="e1-gridcols" style="width:100%">' + new Array(13).join('<i></i>') + '</div>', { col: true })) +
        sec('layout', 'Layout constants', 'The measure, the content width and the house bearing are tokens too.', layoutConsts) +
        sec('breakpoints', 'Breakpoints', 'Documented as tokens; media queries use the literal values because custom properties cannot appear in @media.', bps) +
        sec('radius', 'Radius', 'Restrained on purpose. Everything between 0 and full is deliberately small.', spec('', radii.map(function (r) { return '<div style="display:flex;flex-direction:column;gap:6px;width:150px"><div class="e1-radius" style="border-radius:var(' + r[0] + ')' + (r[0] === '--radius-full' ? ';width:64px' : '') + '"></div><code style="font-size:11px">' + r[0] + ' · ' + esc(rv(r[0])) + '</code><span class="e1-caption e1-muted">' + esc(r[1]) + '</span></div>'; }).join(''), { style: 'gap:24px;align-items:flex-start' })) +
        sec('elevation', 'Elevation', 'Shadows are tinted with the ink, so a raised surface still belongs to the same room.', spec('', elev.map(function (e) { return '<div style="display:flex;flex-direction:column;gap:8px;width:180px"><div class="e1-elev" style="box-shadow:var(' + e[0] + ')">' + e[0] + '</div><span class="e1-caption e1-muted">' + esc(e[1]) + '</span></div>'; }).join(''), { style: 'gap:28px;align-items:flex-start;padding:32px' })) +
        sec('motion', 'Motion', null, motion) +
        sec('sizes', 'Icon and avatar sizes', null, sizes) +
        sec('z', 'Z-index', null, zs)
    });
  }, {
    keywords: 'spacing density grid radius shadow elevation motion animation breakpoints z-index',
    mount: function (el) { el.addEventListener('e1:change', function (e) { if (e.target.getAttribute('data-name') === 'ds-density') E1.set('density', e.detail.value); }); }
  });

  /* =========================================================================
     ICONOGRAPHY
     ========================================================================= */
  reg('/reference/design-system/iconography', 'ds-icons', 'Iconography', function (p, q) {
    var names = c.iconNames(), aliases = c.iconAliases();
    var grid = '<div class="e1-icongrid" id="ds-icongrid">' + names.map(function (n) {
      var al = Object.keys(aliases).filter(function (a) { return aliases[a] === n; });
      return '<button type="button" class="e1-icontile" data-name="' + esc(n + ' ' + al.join(' ')) + '" data-copy="' + esc("E1.c.icon('" + n + "', 16)") + '" data-copy-label="' + esc(n) + '" title="' + esc(n + (al.length ? ' · alias ' + al.join(', ') : '')) + '">' + c.icon(n, 24) + '<span>' + esc(n) + '</span></button>';
    }).join('') + '</div><p id="ds-icon-empty" class="e1-muted" hidden style="margin-top:12px">No icon matches. Try “chain”, “seal”, “approve” or a door name.</p>';
    return page({
      title: 'Iconography', lead: 'Hand-drawn on a 24 grid with a 1.5px stroke that stays 1.5px at every size, square terminals, and currentColor. Any diagonal runs on the 50° bearing. Click an icon to copy its call.',
      actions: c.button('Copy the full name list', { kind: 'secondary', icon: 'copy', attrs: 'data-copy="' + esc(names.join(', ')) + '" data-copy-label="Icon names"' }),
      toc: [{ id: 'all', label: 'All icons' }, { id: 'sizes', label: 'Sizes' }, { id: 'house', label: 'Governance marks' }, { id: 'rules', label: 'Rules' }],
      body: sec('all', names.length + ' icons', 'Search by name or alias. Aliases: ' + Object.keys(aliases).join(', ') + '.',
          '<div style="max-width:420px;margin-bottom:16px">' + c.searchBox({ id: 'ds-icon-q', placeholder: 'Search icons', label: 'Search icons', value: q.q || '' }) + '</div>' + grid) +
        sec('sizes', 'Sizes', 'The stroke does not scale with the icon, so a 12px glyph and a 24px glyph read as one family.',
          spec('', [12, 14, 16, 20, 24, 32].map(function (s) { return '<div style="display:flex;flex-direction:column;align-items:center;gap:8px;width:72px">' + c.icon('approve', s) + '<span class="e1-caption e1-mono">' + s + 'px</span></div>'; }).join(''), { style: 'gap:16px;align-items:flex-end' })) +
        sec('house', 'Governance marks', 'Some glyphs carry a fixed meaning and are used nowhere else.',
          tbl(['Icon', 'Name', 'Means'], [
            [c.icon('gate', 20), '<code>gate</code>', 'The half disc. A human decision point — the gate button and nothing else.'],
            [c.icon('refuse', 20), '<code>refuse</code>', 'Refused by policy. Never used for “cancel”.'],
            [c.icon('chain', 20), '<code>chain</code>', 'Hash-chained record (L1).'],
            [c.icon('seal', 20), '<code>seal</code>', 'Signed seal. Appears only at L2 and above.'],
            [c.icon('agents', 20), '<code>agents</code>', 'An agent actor, and the Agents door.'],
            [c.icon('sparkle', 20), '<code>sparkle</code>', 'Claude attribution only (“Built on Claude”). Never decoration.'],
            [c.icon('undo', 20), '<code>undo</code>', 'A declared reversal plan.']
          ], 'Governance marks')) +
        sec('rules', 'Rules', null, dodont([
          'Pair every status icon with a word. The badge does this for you.',
          'Give every icon-only button a label; c.button(label, {iconOnly:true}) makes it the accessible name.',
          'Use currentColor so the icon takes the text role of its context.',
          'Add a new icon only after it appears in three real screens.'
        ], [
          'Do not use an icon as the only signal of a state, a kind or an outcome.',
          'Do not recolour icons with status colours outside a badge, gate row or timeline mark.',
          'Do not mix in icons from other sets; their stroke and terminals will not match.',
          'Do not use the gate mark or the sparkle for anything else.'
        ]))
    });
  }, {
    keywords: 'icons iconography svg glyphs',
    mount: function (el) {
      var input = el.querySelector('#ds-icon-q'), tiles = el.querySelectorAll('.e1-icontile'), empty = el.querySelector('#ds-icon-empty');
      function filter() {
        var q = input.value.toLowerCase().trim(), shown = 0;
        Array.prototype.forEach.call(tiles, function (t) { var ok = !q || t.getAttribute('data-name').indexOf(q) >= 0; t.hidden = !ok; if (ok) shown++; });
        empty.hidden = shown > 0;
      }
      if (input) { input.addEventListener('input', filter); filter(); }
    }
  });

  /* =========================================================================
     BRAND IN PRODUCT
     ========================================================================= */
  var SAY = [
    ['Approve and commit', 'Submit', 'A button names what happens to the record, not what happens to the form.'],
    ['Not done — credit limit', 'Something went wrong', 'An error that does not name the rule cannot be acted on by the person reading it.'],
    ['ar-agent proposed this; Venkat Raman approved it.', 'This was processed automatically.', 'Passive voice hides the owner. Every governed write has an answerable person.'],
    ['Cannot publish — the Assurance door has no evaluation set', 'Complete all steps to continue', 'The blocker is named, not counted.'],
    ['Nothing is waiting for you. Agents are running at their declared autonomy.', 'No data', 'An empty state names what is missing and what would fill it.'],
    ['Authorised, behaviour, organisation', 'Authorized, behavior, organization', 'British English throughout the product and the documentation.'],
    ['4 approvals are waiting', 'Four approvals are waiting', 'Numerals for all quantities, so a number can be scanned rather than read.'],
    ['Reversible for 30 days from commit', 'Easily undoable', 'A reversal has a window and a plan. Vagueness in a reversal is a defect.'],
    ['This record is hash-chained. It is not signed.', 'Tamper-proof, immutable audit trail', 'At L1 we may say tamper-evident to you. We may not say signed, immutable or court-ready.']
  ];
  reg('/reference/design-system/brand', 'ds-brand', 'Brand in product', function () {
    var logos = '<div class="e1-grid e1-grid--3">' +
      '<div class="e1-spec"><div class="e1-spec__stage" style="background:var(--brand-paper);justify-content:center;min-height:150px"><img src="assets/brand/elan1-logo-navy.png" alt="elan1 primary lockup on paper" width="160"></div><div class="e1-spec__foot"><strong>Primary.</strong> Ink wordmark, clay disc, on paper. Public site, auth card, documents.</div></div>' +
      '<div class="e1-spec"><div class="e1-spec__stage" style="background:var(--brand-ink);background-image:none;justify-content:center;min-height:150px"><img src="assets/brand/elan1-logo-white.png" alt="elan1 reversed lockup on ink" width="160"></div><div class="e1-spec__foot"><strong>Reversed.</strong> White wordmark, clay disc, on ink. The console top bar and the footer.</div></div>' +
      '<div class="e1-spec"><div class="e1-spec__stage" style="justify-content:center;min-height:150px;gap:20px">' + c.disc({ size: 40, label: 'elan1 disc' }) + c.disc({ size: 16 }) + '</div><div class="e1-spec__foot"><strong>Disc alone.</strong> Below 96px wide the wordmark comes off: favicon, app icon, tenant switcher.</div></div>' +
      '</div>' +
      '<div class="e1-grid e1-grid--2" style="margin-top:16px">' + c.callout({ kind: 'rule', title: 'Minimum 96px on screen', body: '<p>The lockup never renders narrower than 96px, including in the 48px top bar. Clear space is one disc diameter on every side; nothing sets inside it.</p>' }) + c.callout({ kind: 'rule', title: 'Never on clay, never on imagery', body: '<p>Allowed grounds: paper, ink, bone and the ink ramp above 700. Never stretch, rotate, recolour, outline or re-typeset the mark, and never lock a descriptor to it.</p>' }) + '</div>';
    var discs = [['mark', 'Mark disc', 'Favicon, app icon, bullet.'], ['gate', 'The gate', 'The human decision point. The gate button carries it.'], ['aperture', 'Aperture', 'Observability, audit, focus on one record. The 404 uses it.'], ['orbit', 'Orbit', 'An agent working a cycle; loading and run states.'], ['eclipse', 'Eclipse', 'Human and agent on the same task.'], ['trail', 'Trail', 'Progression on the 50° bearing.']];
    var discSys = '<div class="e1-grid e1-grid--3">' + discs.map(function (d) { return '<div class="e1-spec"><div class="e1-spec__stage" style="justify-content:center;min-height:120px">' + c.disc({ variant: d[0], size: d[0] === 'trail' ? 24 : 44 }) + '</div><div class="e1-spec__foot"><strong>' + esc(d[1]) + '.</strong> ' + esc(d[2]) + ' <code>c.disc({variant:\'' + d[0] + '\'})</code></div></div>'; }).join('') + '</div>' +
      '<div class="e1-grid e1-grid--2" style="margin-top:16px">' + spec('Progress arc — the disc derivation for completion', c.progressArc(7, 11, { label: 'Evaluation battery', sub: '7 of 11 cases' }) + c.progressArc(92, 100, { size: 56, label: 'Coverage' }), { style: 'justify-content:center;gap:40px' }) +
      c.card({ title: 'Rules for the disc in UI', body: '<ol class="e1-prose" style="padding-left:18px;margin:0"><li>One circle per surface. If the screen already uses a coloured dot for status or presence, the brand disc does not appear. Our badges use glyphs, not dots, for this reason.</li><li>Always a true circle, flat clay, no internal detail.</li><li>Two scales, nothing between: element scale (under 2U) or page scale (cropped, over a third of the width — the auth field crop).</li><li>Where discs travel or trail, they do it on the 50° bearing.</li><li>One derivation per surface; they are alternatives, not a set.</li></ol>' }) + '</div>';
    var voice = '<div class="e1-grid e1-grid--4">' + [
      ['Plain', 'Short words for large ideas. If a sentence needs a second reading, rewrite it.', 'A person approves it before it happens.', 'Human-in-the-loop orchestration paradigms.'],
      ['Specific', 'Numbers, names and dates beat adjectives. Publish the tolerance with the value.', 'Ten apps, one control plane.', 'A comprehensive suite of solutions.'],
      ['Answerable', 'We name the limit and the owner. Nothing is automatic if a person signs it.', 'The agent drafts it. You commit it.', 'Fully autonomous, end to end.'],
      ['Unhurried', 'Confident without urgency. We are removing a risk, not selling a race.', 'Start with one process. Add the next when it holds.', 'Transform your entire enterprise today.']
    ].map(function (v) { return c.card({ title: v[0], body: '<p class="e1-caption e1-muted" style="min-height:48px">' + esc(v[1]) + '</p><p class="e1-label" style="margin-top:12px;color:var(--state-good)">We say</p><p style="margin-top:4px">' + esc(v[2]) + '</p><p class="e1-label" style="margin-top:12px;color:var(--state-critical)">Not</p><p style="margin-top:4px;color:var(--text-secondary);text-decoration:line-through;text-decoration-color:var(--state-critical)">' + esc(v[3]) + '</p>' }); }).join('') + '</div>';
    var writing = '<ol class="e1-principles" role="list">' + [
      ['01', 'Sentence case for headings and buttons.', 'Title Case is reserved for proper nouns. Labels are uppercase and tracked.'],
      ['02', 'Numerals for all quantities.', 'Including one to nine. 4 approvals, not four approvals.'],
      ['03', '“Agentic” describes the application, not the outcome.', 'Never “agentic value”.'],
      ['04', 'Never claim autonomy where an approval exists.', 'Accuracy here is a compliance matter.'],
      ['05', 'Say what the agent did and who approved it.', 'Passive voice hides the owner.'],
      ['06', 'Attribute the model.', '“Built on Claude” is a credential, written in full on first mention.'],
      ['07', 'One idea per sentence, one claim per paragraph.', 'Cut the second adjective.'],
      ['08', 'Localise currency, date and number formats.', 'British English, ₹ in Indian grouping, dates as 24 Sep 2026, times in IST.']
    ].map(function (p) { return '<li><span class="e1-principles__k">' + p[0] + '</span><span class="e1-principles__t">' + esc(p[1]) + '</span><span class="e1-principles__d">' + esc(p[2]) + '</span></li>'; }).join('') + '</ol>';
    var pairs = '<div class="e1-table-wrap"><table class="e1-table e1-saypairs"><caption class="e1-sr">The product voice as pairs</caption><thead><tr><th scope="col">We say</th><th scope="col">We never say</th><th scope="col">Why</th></tr></thead><tbody>' +
      SAY.map(function (s) { return '<tr><th scope="row">' + esc(s[0]) + '</th><td>' + esc(s[1]) + '</td><td>' + esc(s[2]) + '</td></tr>'; }).join('') + '</tbody></table></div>';
    var words = '<div class="e1-grid e1-grid--2">' +
      c.card({ title: 'Words we keep', body: '<div class="e1-wordlist">' + ['governed', 'approve', 'commit', 'answerable', 'configuration', 'control plane', 'record', 'exception', 'limit', 'process', 'refused', 'reversible'].map(function (w) { return '<span>' + esc(w) + '</span>'; }).join('') + '</div>' }) +
      c.card({ title: 'Words we do not use', body: '<div class="e1-wordlist e1-wordlist--no">' + ['revolutionary', 'game-changing', 'seamless', 'cutting-edge', 'unlock', 'supercharge', 'turnkey', 'frictionless', 'next-generation', 'leverage (as a verb)', 'tamper-proof (at L1)', 'immutable (at L1)'].map(function (w) { return '<span>' + esc(w) + '</span>'; }).join('') + '</div>' }) + '</div>';
    return page({
      title: 'Brand in product', lead: 'How the Brand Book v1.0 shows up inside the console: the lockup on ink chrome, the disc as a system rather than decoration, and a voice that says what happened and who answers for it.',
      toc: [{ id: 'logo', label: 'Logo in product' }, { id: 'disc', label: 'The disc system' }, { id: 'voice', label: 'Voice and tone' }, { id: 'writing', label: 'Writing rules' }, { id: 'pairs', label: 'We say / not' }, { id: 'words', label: 'Words' }],
      body: sec('logo', 'Logo in product', 'Use the supplied artwork. The console uses the reversed lockup on its ink top bar; public pages switch between primary and reversed with the theme.', logos) +
        sec('disc', 'The disc system in UI', 'Away from the logo the disc becomes a system: an aperture, a gate, an orbit. Each derivation does a job the layout needs.', discSys) +
        sec('voice', 'Voice and tone', 'Brand Book 01.6.', voice) +
        sec('writing', 'Writing rules', 'Brand Book 01.7.', writing) +
        sec('pairs', 'The product voice, stated as pairs', null, pairs) +
        sec('words', 'Words', null, words)
    });
  }, { keywords: 'brand logo disc voice tone writing words' });

  /* =========================================================================
     COMPONENTS — one registry drives the index and every component page
     ========================================================================= */
  var S = { // shared sample data for specimens — canonical set (spec §4, Kaveri Spinning Mills, 24 Sep 2026)
    hash4101: '9a51354948ef61d10149fa91ad1bf6a8676f94e7d6f2b0f7d1920797b8fb2c7e', hash4100: '4c0869898c7bb333c6ad353c482fcc8f9603ededb2760f3f055096b25fe6f93d', hash4099: 'b7f2efbcc6e235db0bb4ee5503f6b0fd9ff7c45e935efe567961e023cca70e61', hash4098: '1e9ccae3f2d4f75f1834c9fbd1d2a0c7a67ae6d7cf14caf6505e649c547f83a5', hash4097: '64ab95807b29ae7ff1c03c14d0267e98e409936df46dbf7b8764329fbd90d2f0',
    gates: [ // OB-2026-0412 · erp.sales_invoice.submit · erp.ar v7 — every declared gate
      { id: 'G1', name: 'Consent', result: 'passed', words: 'Recorded consent covers invoicing for ACME Textiles; expires 31 Mar 2027.', version: 'erp.ar v7' },
      { id: 'G2', name: 'Residency (Mumbai)', result: 'passed', words: 'Record and tenant are both in residency domain in · Mumbai.', version: 'erp.ar v7' },
      { id: 'G3', name: 'Retention', result: 'passed', words: 'The invoice is inside its 8-year retention window.', version: 'erp.ar v7' },
      { id: 'G7', name: 'Counterparty (ACME Textiles, known)', result: 'passed', words: 'Registered customer with a validated GSTIN; not on any sanctions list checked 24 Sep 2026.', version: 'erp.ar v7' },
      { id: 'G9', name: 'Precondition', result: 'passed', words: 'Credit limit ₹3,00,000; exposure after this write ₹2,88,000.', version: 'erp.ar v7' },
      { id: 'G4', name: 'Dual control', result: 'passed', words: 'Above ₹2,00,000, so a second named person is required: Venkat Raman (ar-approvers).', version: 'erp.ar v7' },
      { id: 'G6', name: 'Budget', result: 'passed', words: '212 of 400 drafts declared for September used.', version: 'erp.ar v7' }
    ],
    gatesRefused: [ // #4,098 · the same write type, refused at rung 3
      { id: 'G1', name: 'Consent', result: 'passed', words: 'Recorded consent covers invoicing for ACME Textiles.', version: 'erp.ar v7' },
      { id: 'G2', name: 'Residency (Mumbai)', result: 'passed', words: 'Record and tenant are both in in · Mumbai.', version: 'erp.ar v7' },
      { id: 'G3', name: 'Retention', result: 'passed', words: 'Inside the 8-year retention window.', version: 'erp.ar v7' },
      { id: 'G7', name: 'Counterparty (ACME Textiles, known)', result: 'passed', words: 'Registered customer with a validated GSTIN.', version: 'erp.ar v7' },
      { id: 'G9', name: 'Precondition', result: 'failed', words: 'Credit limit ₹3,00,000; exposure after this invoice ₹4,20,000.', version: 'erp.ar v7' },
      { id: 'G4', name: 'Dual control', result: 'passed', words: 'Venkat Raman is in the resolver set.', version: 'erp.ar v7' },
      { id: 'G5', name: 'Rate', result: 'skipped', words: 'Not declared for this write type.', version: 'erp.ar v7' }
    ],
    diff: [ // SINV-2026-01187 · ACME Textiles
      { field: 'Invoice status', before: 'Draft', after: 'Submitted', material: true },
      { field: 'Grand total', before: '₹2,40,000', after: '₹2,40,000', mono: true },
      { field: 'ACME Textiles outstanding', before: '₹48,000', after: '₹2,88,000', material: true, mono: true },
      { field: 'e-Invoice IRN', before: '', after: 'Requested' },
      { field: 'Due date', before: '', after: '24 Oct 2026' },
      { field: 'Customer', before: 'ACME Textiles', after: 'ACME Textiles' },
      { field: 'Credit limit', before: '₹3,00,000', after: '₹3,00,000', mono: true }
    ],
    chain: function () {
      return [
        { seq: 4101, digest: S.hash4101, prev: S.hash4100, writeType: 'erp.sales_invoice.submit', outcome: 'committed', actorKind: 'agent', at: '24 Sep 2026, 15:02 IST', href: '#/assurance/proof/4101' },
        { seq: 4100, digest: S.hash4100, prev: S.hash4099, writeType: 'platform.obligation.resolve', outcome: 'committed', actorKind: 'person', at: '24 Sep 2026, 15:02 IST', href: '#/assurance/proof/4100' },
        { seq: 4099, digest: S.hash4099, prev: S.hash4098, writeType: 'erp.sales_invoice.submit', outcome: 'escalated', actorKind: 'agent', at: '24 Sep 2026, 14:16 IST', href: '#/assurance/proof/4099' },
        { seq: 4098, digest: S.hash4098, prev: S.hash4097, writeType: 'erp.sales_invoice.submit', outcome: 'refused', actorKind: 'agent', at: '24 Sep 2026, 14:07 IST', href: '#/assurance/proof/4098' }
      ];
    },
    rows: [ // obligations, now = 15:28 IST
      { id: 'OB-2026-0412', what: 'Submit invoice SINV-2026-01187 · ACME Textiles', who: ['ar-agent', 'agent'], amt: 240000, blast: 2, gates: '5 of 5', due: 192 },
      { id: 'OB-2026-0411', what: 'Release supplier payment run · 14 suppliers', who: ['ap-agent', 'agent'], amt: 1842760, blast: 3, gates: '8 of 8', due: 52 },
      { id: 'OB-2026-0414', what: 'Change credit limit · ACME Textiles · ₹3,00,000 → ₹5,00,000', who: ['Rekha Subramanian', 'person'], amt: null, blast: 2, gates: '6 of 6', due: 238 }
    ]
  };
  function approvalsTable(opts) {
    opts = opts || {};
    return c.table({
      caption: 'Approvals waiting on you', dense: opts.dense, rowHref: function () { return '#/work/approvals'; },
      columns: [
        { key: 'what', label: 'Proposed', render: function (r) { return '<span class="e1-strong">' + esc(r.what) + '</span><br><span class="e1-caption e1-mono e1-muted">' + esc(r.id) + '</span>'; } },
        { key: 'who', label: 'Proposed by', render: function (r) { return c.actor({ name: r.who[0], kind: r.who[1], size: 'sm' }); } },
        { key: 'amt', label: 'Amount', align: 'right', render: function (r) { return r.amt === null ? c.blast(r.blast, { compact: true }) : c.amount(r.amt); } },
        { key: 'gates', label: 'Gates', render: function (r) { return r.gates.charAt(0) === r.gates.slice(-1) ? c.badge('good', r.gates + ' passed') : c.badge('critical', r.gates + ' passed'); } },
        { key: 'due', label: 'Expires', render: function (r) { return c.countdown(E1.ahead(r.due)); } }
      ],
      rows: S.rows
    });
  }

  function P(name, type, def, desc) { return [name, type, def, desc]; }
  var REG = [
    /* ---------- Page structure ---------- */
    { name: 'pageHeader', title: 'Page header', group: 'Page structure', sig: 'E1.c.pageHeader({title, lead, actions, meta, eyebrow, back, tabs})', summary: 'One per screen: a small uppercase eyebrow, the 26px title, one lead sentence, actions bottom-right, a meta row and underline tabs.',
      props: [P('title', 'string', '—', 'Sentence case. Required.'), P('lead', 'string', '—', 'One sentence, Outfit 400, at most 70 characters wide.'), P('tabs', 'html', '—', 'v2.0. Usually c.tabs(…); drawn as underline tabs under the header.'), P('actions', 'html', '—', 'Buttons, right-aligned; wraps under the title on narrow screens.'), P('meta', 'html', '—', 'Badges and facts under the title.'), P('eyebrow', 'string', '—', 'A short kicker in clay caps.'), P('back', '[label, href]', '—', 'A back link above the title.')],
      demos: [['Default', function () { return c.pageHeader({ title: 'Approvals', eyebrow: 'Work', lead: '4 approvals are waiting on you. The oldest expires in 38 minutes.', actions: c.button('Filters', { icon: 'filter' }) + c.button('Open the oldest', { kind: 'primary', href: '#/work/approvals' }), meta: c.badge('warning', '4 waiting') + '<span>Resolver set: accounts payable</span>', back: ['Today', '#/work/today'], tabs: c.tabs([{ id: 'mine', label: 'Waiting on me', href: '#/work/approvals?filter=mine', count: 4 }, { id: 'all', label: 'All open', href: '#/work/approvals?filter=all', count: 14 }, { id: 'decided', label: 'Decided', href: '#/work/approvals?filter=decided' }], 'mine') }).replace('<h1 ', '<p role="presentation" ').replace('</h1>', '</p>'); }, { plain: true }]],
      code: "E1.c.pageHeader({\n  title: 'Approvals',\n  lead: '4 approvals are waiting on you.',\n  actions: E1.c.button('Open the oldest', {kind:'primary', href:'#/work/decide/OB-2026-0412'}),\n  meta: E1.c.badge('warning', '4 waiting')\n})",
      dos: ['Write the lead as a sentence with a number in it.', 'Keep actions to two or three; put the rest in a menu.'], donts: ['Do not put a second h1 anywhere on the screen.', 'Do not use the eyebrow for status.'], a11y: ['Renders the only <h1> on the screen; the router moves focus to the main region on navigation and announces the title.'] },
    { name: 'section', title: 'Section', group: 'Page structure', sig: 'E1.c.section({title, id, lead, actions, body, eyebrow})', summary: 'A titled block of a page with an optional lead and actions. Sections are the targets of a table of contents.',
      props: [P('title', 'string', '—', 'Rendered as <h2>.'), P('id', 'string', '—', 'Anchor for c.toc().'), P('lead', 'string', '—', 'One sentence.'), P('actions', 'html', '—', 'Right-aligned.'), P('body', 'html', '—', 'The content.')],
      demos: [['Default', function () { return c.section({ title: 'Recent proofs', id: 'demo-sec', lead: 'Every governed write on this tenant in the last 24 hours.', actions: c.button('Open the chain', { kind: 'ghost', href: '#/assurance/proof', iconRight: 'arrow-right' }), body: c.card({ body: '<p class="e1-muted">Section body.</p>' }) }); }, { plain: true, col: true }]],
      code: "E1.c.section({ id:'proofs', title:'Recent proofs', lead:'…', body: html })", dos: ['Give sections ids when the page has a table of contents.'], donts: ['Do not nest sections more than one level.'], a11y: ['Labelled by its heading through aria-labelledby.'] },
    { name: 'toolbar', title: 'Toolbar', group: 'Page structure', sig: 'E1.c.toolbar(left, right)', summary: 'A row above a table: search and filters on the left, view controls and actions on the right.',
      props: [P('left', 'html', '—', 'Search, filters.'), P('right', 'html', '—', 'Segmented view, export, primary action.')],
      demos: [['Default', function () { return '<div style="width:100%">' + c.toolbar(c.searchBox({ placeholder: 'Search approvals', kbd: '/' }) + c.filters([{ label: 'Waiting on me', href: '#/work/approvals?filter=mine', active: true, count: 4 }, { label: 'Raised by an agent', href: '#/work/approvals?filter=agent', count: 3 }]), c.button('Export', { icon: 'download' })) + '</div>'; }, { col: true }]],
      code: "E1.c.toolbar(E1.c.searchBox({placeholder:'Search'}) + E1.c.filters(chips), E1.c.button('Export', {icon:'download'}))", dos: ['Keep filter state in the URL.'], donts: ['Do not put more than one primary button in a toolbar.'], a11y: ['Filter chips are links with aria-current when active.'] },
    { name: 'card', title: 'Card', group: 'Page structure', sig: 'E1.c.card({title, eyebrow, actions, body, footer, flush, cls, id})', summary: 'A white surface on the paper ground for one idea: a panel, a list, a form.',
      props: [P('title', 'string', '—', 'Rendered as <h3>.'), P('eyebrow', 'string', '—', 'Kicker above the title.'), P('actions', 'html', '—', 'Top-right actions.'), P('body', 'html', '—', 'Content.'), P('footer', 'html', '—', 'Caption row.'), P('flush', 'bool', 'false', 'Removes body padding so a table can sit edge to edge.')],
      demos: [['Default and flush', function () { return '<div class="e1-grid e1-grid--2" style="width:100%">' + c.card({ title: 'Limits and authority', eyebrow: 'You', body: c.kv([['Resolver set', 'ar-approvers'], ['Dual control above', '₹2,00,000']]), footer: '<span>From erp.ar v7</span><a href="#/agents/autonomy">Autonomy grants</a>' }) + c.card({ title: 'Waiting on you', flush: true, actions: c.button('All', { kind: 'ghost', size: 'sm', href: '#/work/approvals' }), body: approvalsTable({ dense: true }) }) + '</div>'; }, { col: true }]],
      code: "E1.c.card({ title:'Limits and authority', body: E1.c.kv(pairs), footer:'From erp.ar v7' })", dos: ['One idea per card.'], donts: ['Do not nest cards inside cards.', 'Do not colour a card by status; use a badge or callout inside it.'], a11y: ['A <section> with an <h3>; screen readers list it as a region only when titled.'] },

    /* ---------- Actions ---------- */
    { name: 'button', title: 'Button', group: 'Actions', sig: "E1.c.button(label, {kind, href, icon, iconRight, size, iconOnly, disabled, loading, type, attrs, full})", summary: 'Five kinds, three sizes. Gate is reserved: it commits a governed write or records a human decision.',
      props: [P('label', 'string', '—', 'Required, even for iconOnly — it becomes the accessible name.'), P('kind', "'primary'|'secondary'|'ghost'|'danger'|'gate'", "'secondary'", 'Gate draws the half-disc and the clay left edge.'), P('href', 'string', '—', 'Renders an <a> instead of a <button>.'), P('icon / iconRight', 'icon name', '—', 'Leading or trailing icon.'), P('size', "'sm'|'md'|'lg'", "'md'", 'Heights come from the density tokens.'), P('iconOnly', 'bool', 'false', 'Hides the label visually; keeps it for assistive technology and as a tooltip.'), P('disabled / loading', 'bool', 'false', 'Loading shows a spinner and aria-busy.'), P('attrs', 'string', '—', "Extra attributes, e.g. 'data-action=\"approve\"'.")],
      demos: [
        ['Kinds', function () { return c.button('Primary', { kind: 'primary' }) + c.button('Secondary') + c.button('Ghost', { kind: 'ghost' }) + c.button('Reject', { kind: 'danger', icon: 'reject' }) + c.button('Approve and commit', { kind: 'gate' }); }],
        ['Sizes', function () { return c.button('Small', { size: 'sm' }) + c.button('Medium') + c.button('Large', { size: 'lg' }) + c.button('Approve and commit', { kind: 'gate', size: 'lg' }); }],
        ['States', function () { return c.button('With icon', { icon: 'download' }) + c.button('Trailing icon', { iconRight: 'arrow-right' }) + c.button('Disabled', { disabled: true }) + c.button('Recording your decision…', { kind: 'gate', loading: true }) + c.button('More actions', { iconOnly: true, icon: 'more' }) + c.button('Copy link', { iconOnly: true, icon: 'copy', kind: 'ghost' }); }]
      ],
      code: "E1.c.button('Approve and commit', { kind:'gate', attrs:'data-action=\"approve\"' })\nE1.c.button('Open the record', { kind:'secondary', href:'#/records/objects', iconRight:'arrow-right' })",
      dos: ['Name what happens to the record: “Approve and commit”, “Reverse this write”.', 'Keep Approve and Reject apart with a gap of at least 8px (16px on touch).'], donts: ['Do not use the gate kind for anything that does not commit or record a decision.', 'Do not write “Submit”, “OK” or “Click here”.'], a11y: ['A real <button> or <a>; the focus ring is the token, never removed.', 'Icon-only buttons carry the label as visually hidden text and a title.'] },
    { name: 'menu', title: 'Menu', group: 'Actions', sig: 'E1.c.menu({label, icon, iconOnly, kind, size, align, items:[{label, href, action, value, icon, note, danger, divider, checked}]})', summary: 'A trigger and a popover list. Arrow keys, Home and End move; Escape closes and returns focus.',
      props: [P('label', 'string', '—', 'Trigger label and the menu’s accessible name.'), P('items', 'array', '—', 'Links (href) or actions (action + value). divider:true draws a separator; checked makes a radio item.'), P('align', "'left'|'right'", "'left'", 'Which edge the popover aligns to.'), P('iconOnly', 'bool', 'false', 'A compact “more” trigger.')],
      demos: [['Row actions', function () { return c.menu({ label: 'Row actions', icon: 'more', iconOnly: true, kind: 'ghost', items: [{ label: 'Open the record', icon: 'file', href: '#/records/objects' }, { label: 'Show the proof', icon: 'proof', href: '#/assurance/proof' }, { divider: true }, { label: 'Reverse this write', icon: 'undo', href: '#/work/requests', note: 'Reversible for 30 days' }] }) + c.menu({ label: 'Sort', icon: 'sort', items: [{ label: 'Oldest deadline first', checked: true, href: '#/work/approvals?sort=deadline' }, { label: 'Largest amount first', checked: false, href: '#/work/approvals?sort=amount' }] }); }, { style: 'min-height:200px;align-items:flex-start' }]],
      code: "E1.c.menu({ label:'Row actions', iconOnly:true, icon:'more', items:[{label:'Open', href:'#/…'}, {divider:true}, {label:'Reverse', action:'reverse', value:'W-4101'}] })",
      dos: ['Put destructive items last, after a divider.'], donts: ['Do not hide the primary action of a screen in a menu.'], a11y: ['role="menu" with menuitem / menuitemradio; aria-expanded on the trigger; roving focus with the arrow keys.'] },
    { name: 'tooltip', title: 'Tooltip', group: 'Actions', sig: 'E1.c.tooltip(html, tip, {side})', summary: 'CSS-only, no positioning library, never steals focus. The tip is also exposed to assistive technology.',
      props: [P('html', 'html', '—', 'The anchor content.'), P('tip', 'string', '—', 'Plain text.'), P('side', "'top'|'right'|'bottom'|'left'", "'top'", '')],
      demos: [['Sides', function () { return ['top', 'right', 'bottom', 'left'].map(function (s) { return c.tooltip(c.button('Tooltip ' + s, { kind: 'secondary' }), 'Opens on the ' + s, { side: s }); }).join(''); }, { style: 'padding:56px 24px;justify-content:center;gap:24px' }]],
      code: "E1.c.tooltip(E1.c.hash(digest), 'SHA-256 over the frozen sixteen-field preimage')", dos: ['Use for a definition or the full value of something truncated.'], donts: ['Do not put anything a person needs to act on inside a tooltip.'], a11y: ['Connected with aria-describedby; shows on hover and on keyboard focus.'] },
    { name: 'kbd', title: 'Keyboard key', group: 'Actions', sig: "E1.c.kbd(...keys)", summary: 'One or more keys, joined with +.',
      props: [P('...keys', 'string', '—', 'Each argument is one key.')],
      demos: [['Default', function () { return '<span>Press ' + c.kbd('Ctrl', 'K') + ' for the command palette, ' + c.kbd('g') + ' then ' + c.kbd('w') + ' for Work, ' + c.kbd('?') + ' for all shortcuts.</span>'; }]],
      code: "E1.c.kbd('Ctrl','K')", dos: ['Write Ctrl on Windows and Linux; the palette also accepts ⌘.'], donts: ['Do not document shortcuts that are not wired.'], a11y: ['Rendered as <kbd>.'] },

    /* ---------- Status and identity ---------- */
    { name: 'badge', title: 'Badge', group: 'Status and identity', sig: "E1.c.badge(state, label, {subtle, icon})", summary: 'A status: one of six reserved states, always with a word and a glyph. A badge is a status; a chip is a selection.',
      props: [P('state', "'good'|'warning'|'serious'|'critical'|'info'|'neutral'", '—', 'Anything else renders neutral.'), P('label', 'string', 'state name', 'The word. Name the actual state: “Committed”, not “Good”.'), P('subtle', 'bool', 'false', 'No fill, for rows that already carry an edge.'), P('icon', 'icon name | false', 'per state', 'Override or remove the glyph (keep it unless space forbids).')],
      demos: [['Filled', function () { return c.badge('good', 'Committed') + c.badge('warning', 'Awaiting approval') + c.badge('serious', 'Held') + c.badge('critical', 'Platform failure') + c.badge('info', 'In progress') + c.badge('neutral', 'Not done'); }], ['Subtle', function () { return c.badge('good', 'Passed', { subtle: true }) + c.badge('warning', 'Expiring', { subtle: true }) + c.badge('serious', 'Drifting', { subtle: true }) + c.badge('critical', 'Failed', { subtle: true }) + c.badge('info', 'Scheduled', { subtle: true }) + c.badge('neutral', 'Not checked', { subtle: true }); }]],
      code: "E1.c.badge('warning', 'Waiting on a person')\n// for write outcomes prefer E1.c.outcome('refused')  → neutral “Not done”", dos: ['Use the state’s real name as the label.'], donts: ['Do not use clay for a status.', 'Do not invent a seventh state.'], a11y: ['The word carries the meaning; the colour and glyph reinforce it.'] },
    { name: 'chip', title: 'Chip', group: 'Status and identity', sig: "E1.c.chip(label, {href, selected, count, removable, attrs, icon})", summary: 'A selection or a filter. Selected chips wear clay, which is selection and not status.',
      props: [P('label', 'string', '—', ''), P('href', 'string', '—', 'Link chip (filters in the URL).'), P('selected', 'bool', 'false', 'aria-current or aria-pressed.'), P('count', 'number', '—', 'Mono count.'), P('removable', 'bool', 'false', 'Adds an ×.')],
      demos: [['Default', function () { return c.chip('One record') + c.chip('One counterparty', { selected: true }) + c.chip('Batch', { count: 12 }) + c.chip('Mill 2', { removable: true, selected: true }) + c.chip('Customer master', { icon: 'records' }); }]],
      code: "E1.c.chip('Waiting on me', { href:'#/work/approvals?filter=mine', selected:true, count:4 })", dos: ['Use for filters and removable tokens.'], donts: ['Do not use a chip to show a status.'], a11y: ['Button chips expose aria-pressed; link chips expose aria-current.'] },
    { name: 'level', title: 'Assurance level', group: 'Status and identity', sig: "E1.c.level(L, {short})", summary: 'L1 Guarded, L2 Attested, L3 Proven. An ordered ladder on the ink ramp; the number of filled bars carries the order.',
      props: [P('L', "'L1'|'L2'|'L3'|1|2|3", '—', ''), P('short', 'bool', 'false', 'Renders “L2” without the name.')],
      demos: [['Levels', function () { return c.level('L1') + c.level('L2') + c.level('L3') + c.level('L1', { short: true }) + c.level('L2', { short: true }); }], ['Reading the current level', function () { return '<p>E1.state.level is <code>' + E1.state.level + '</code>. ' + (E1.atLeast('L2') ? 'L2 elements are shown.' : 'L2 elements are hidden.') + ' Change it from the pill in the top bar.</p>'; }]],
      code: "E1.c.level(E1.state.level)\nif (E1.atLeast('L2')) { /* show signature, anchor, verdict */ }", dos: ['Label every L2 or L3 screen element with its level while the tenant runs at L1.'], donts: ['Do not colour a level with a status colour.', 'Do not show a signature, anchor time or verdict at L1.'], a11y: ['The pill has a title with the full name; the text carries L1/L2/L3.'] },
    { name: 'avatar', title: 'Avatar', group: 'Status and identity', sig: "E1.c.avatar(name, {kind, size})", summary: 'Person is a circle with initials. Agent is a square with a cut corner on the 50° bearing. Shape carries the kind.',
      props: [P('name', 'string', '—', 'Initials are derived for people.'), P('kind', "'person'|'agent'|'system'", "'person'", ''), P('size', "'xs'|'sm'|'md'|'lg'|'xl'", "'md'", '20 / 24 / 32 / 40 / 56px.')],
      demos: [['Kinds and sizes', function () { return ['xs', 'sm', 'md', 'lg', 'xl'].map(function (s) { return c.avatar('Venkat Raman', { size: s }); }).join('') + ['xs', 'sm', 'md', 'lg', 'xl'].map(function (s) { return c.avatar('ar-agent', { kind: 'agent', size: s }); }).join('') + c.avatar('Kernel', { kind: 'system', size: 'lg' }); }]],
      code: "E1.c.avatar('ar-agent', {kind:'agent', size:'sm'})", dos: ['Prefer c.actor(), which also writes the kind in words.'], donts: ['Do not use a photo for an agent.'], a11y: ['Decorative (aria-hidden); the name is always written next to it.'] },
    { name: 'actor', title: 'Actor', group: 'Status and identity', sig: "E1.c.actor({name, kind, role, href, size, model})", summary: 'Who did it, and whether a person or an agent — stated in words, not an icon alone (E06).',
      props: [P('name', 'string', '—', ''), P('kind', "'person'|'agent'|'system'", "'person'", 'Written as Person, Agent or Platform.'), P('role', 'string', '—', 'Role or autonomy level.'), P('model', 'string', '—', 'For agents: the model, e.g. “Built on Claude”.'), P('href', 'string', '—', 'Links the name.'), P('size', "'sm'|'md'", "'md'", '')],
      demos: [['Default', function () { return c.actor({ name: 'Venkat Raman', kind: 'person', role: 'Accounts head', href: '#/account/profile' }) + c.actor({ name: 'ar-agent', kind: 'agent', role: 'A2 Propose', model: 'Claude' }) + c.actor({ name: 'Kernel', kind: 'system', role: 'Rung 8' }) + c.actor({ name: 'ap-agent', kind: 'agent', size: 'sm' }); }, { style: 'gap:28px' }]],
      code: "E1.c.actor({ name:'ar-agent', kind:'agent', role:'A2 Propose' })", dos: ['Show the proposer on every queue row and every decision screen.'], donts: ['Do not let an agent appear in a resolver set or a “Send to” control.'], a11y: ['The kind is text, so it is read aloud.'] },
    { name: 'hash', title: 'Hash', group: 'Status and identity', sig: "E1.c.hash(value, {copy, head, tail, label})", summary: 'A digest shortened to head…tail in mono, with the full value on hover and a copy button.',
      props: [P('value', 'string', '—', 'Full hex digest.'), P('copy', 'bool', 'true', 'Show the copy button.'), P('head / tail', 'number', '10 / 8', 'Characters kept.')],
      demos: [['Default', function () { return c.hash(S.hash4101) + c.hash(S.hash4100, { head: 6, tail: 6 }) + c.hash(S.hash4098, { copy: false }); }]],
      code: "E1.c.hash(entry.digest)", dos: ['Keep the copy button wherever someone might paste the value into a verifier.'], donts: ['Do not shorten a hash below 6+6.'], a11y: ['The copy button is labelled “Copy the full hash”.'] },
    { name: 'amount', title: 'Amount', group: 'Status and identity', sig: "E1.c.amount(n, {sign, decimals, strong})", summary: 'Rupees in JetBrains Mono with tabular figures and Indian grouping.',
      props: [P('n', 'number', '—', ''), P('sign', 'bool', 'false', '+ prefix on positives.'), P('decimals', 'number', '0', ''), P('strong', 'bool', 'false', 'Semibold.')],
      demos: [['Default', function () { return c.amount(2764300, { strong: true }) + c.amount(1248500) + c.amount(-1249, { sign: true }) + c.amount(42500000) + c.amount(1249.5, { decimals: 2 }); }]],
      code: "E1.c.amount(2764300)   // ₹27,64,300\nE1.fmt.inr(2764300)     // '₹27,64,300'\nE1.fmt.inrShort(2764300) // '₹27.6 L'", dos: ['Right-align amount columns.'], donts: ['Do not use Western grouping (₹2,764,300).'], a11y: ['Screen readers read the digits; the ₹ symbol reads as “rupee”.'] },

    /* ---------- Data ---------- */
    { name: 'stat', title: 'Stat tile', group: 'Data', sig: "E1.c.stat({label, value, unit, delta, deltaTone, note, spark, href, bar, badge, aside, foot, flag})", summary: 'A number with its label and a sentence. A trend is never carried by the line alone — the number is always stated. v2.0 adds a share bar, a badge, a label aside, a source foot and a warning flag.',
      props: [P('bar', 'number | {value, max, state}', '—', 'v2.0. A c.minibar() under the number.'), P('badge', 'html', '—', 'v2.0. A verdict or badge under the number.'), P('aside', 'html', '—', 'v2.0. Right of the label, e.g. c.honesty(\'₹0\').'), P('foot', 'html', '—', 'v2.0. A strip at the bottom: source · c.asOf().'), P('flag', 'bool', 'false', 'v2.0. A warning edge on top. Pair with a word in the note.'), P('label', 'string', '—', 'Uppercase label.'), P('value', 'string|number', '—', 'Pre-formatted.'), P('unit', 'string', '—', 'Small suffix, e.g. %.'), P('delta', 'string', '—', 'e.g. “+8.2%”; a leading − draws a down arrow.'), P('deltaTone', "'good'|'critical'|'neutral'", "'neutral'", 'Whether this direction is good here.'), P('note', 'string', '—', 'One sentence.'), P('spark', 'number[]', '—', 'Sparkline values.'), P('href', 'string', '—', 'Makes the tile a link.')],
      demos: [['v2.0 parts', function () { return '<div class="e1-grid e1-grid--4" style="width:100%">' + c.stat({ label: 'Budget used', value: '71%', bar: { value: 71, max: 100 }, note: '₹69,900 of ₹98,000 for September.', foot: '<span>Meter</span>' + c.asOf('14:05') }) + c.stat({ label: 'Chain', value: '4,112', badge: c.verdict('clean', 'Continuous', { icon: 'check' }), note: 'Checked nightly at 02:10 IST.' }) + c.stat({ label: 'Refusals this month', value: '171', aside: c.honesty('₹0'), note: 'Recorded at ₹0, never billed.' }) + c.stat({ label: 'Expiring today', value: '2', flag: true, note: 'Two approvals expire before 18:00 IST.', href: '#/work/approvals' }) + '</div>'; }, { col: true }], ['Row', function () { return '<div class="e1-grid e1-grid--4" style="width:100%">' + c.stat({ label: 'Governed writes', value: '3,733', delta: '+8.2%', note: '1–24 Sep 2026, billable commits.', spark: [18, 22, 21, 26, 25, 30, 29, 34, 33, 38] }) + c.stat({ label: 'Waiting on a person', value: '14', note: 'The soonest, OB-2026-0417, expires in 38 min.', href: '#/work/approvals' }) + c.stat({ label: 'Not done', value: '171', delta: '+9', deltaTone: 'neutral', note: 'Refusals meter at ₹0. They are the product working.' }) + c.stat({ label: 'Reversals', value: '2', delta: '−1', deltaTone: 'good', note: 'Both inside the declared window.' }) + '</div>'; }, { col: true }]],
      code: "E1.c.stat({ label:'Awaiting approval', value:'4', note:'Oldest has waited 6 days 4 hours.', href:'#/work/approvals' })", dos: ['Say what the number means in the note.'], donts: ['Do not colour the value by status.'], a11y: ['The sparkline has an accessible name stating first and last values.'] },
    { name: 'table', title: 'Table', group: 'Data', sig: "E1.c.table({columns:[{key, label, align, mono, width, render, html, nowrap}], rows, rowHref, dense, empty, caption, sort, stickyHead})", summary: 'A real <table> with <th scope>. Row height comes from density. Rows can link; the first cell carries a real anchor for keyboard users.',
      props: [P('columns', 'array', '—', 'render(row, i) returns HTML; otherwise the value is escaped.'), P('rows', 'object[]', '—', ''), P('rowHref', 'fn(row) | key', '—', 'Clickable rows.'), P('dense', 'bool', 'false', 'Uses the dense cell padding.'), P('empty', 'object | html', '—', 'c.empty() props when rows is empty.'), P('caption', 'string', '—', 'Visually hidden caption. Always give one.'), P('sort', '{key, dir}', '—', 'Sets aria-sort on the header.'), P('stickyHead', 'bool', 'false', 'Header sticks inside a scrolling wrapper.')],
      demos: [['Queue rows', function () { return '<div style="width:100%">' + approvalsTable() + '</div>'; }, { col: true }], ['Empty', function () { return '<div style="width:100%">' + c.table({ columns: [{ key: 'a', label: 'A' }], rows: [], empty: { title: 'Nothing is waiting for you', why: 'Agents are running at their declared autonomy; anything that needs a person will appear here.', action: { label: 'What arrives here', href: '#/records/write-types' }, compact: true } }) + '</div>'; }, { col: true }]],
      code: "E1.c.table({\n  caption: 'Approvals waiting on you',\n  columns: [\n    {key:'what', label:'Proposed'},\n    {key:'amount', label:'Amount', align:'right', render: r => E1.c.amount(r.amount)}\n  ],\n  rows: data,\n  rowHref: r => '#/work/decide/' + r.id,\n  empty: {title:'Nothing is waiting for you', why:'…', action:{label:'What arrives here', href:'#/records/write-types'}}\n})",
      dos: ['Right-align numbers and use mono for identifiers.', 'Always pass an empty state that names what would fill the table.'], donts: ['Do not set a row height on a table; density decides.', 'Do not build tables from divs.'], a11y: ['Real <th scope="col"> and <th scope="row">; a caption; aria-sort on sorted columns.'] },
    { name: 'kv', title: 'Key and value', group: 'Data', sig: "E1.c.kv(pairs, {cols, compact})", summary: 'A definition list. Pairs as [key, value, {mono, html}]. Hashes and amounts take the mono flag.',
      props: [P('pairs', 'array', '—', '[k, v, {mono, html}] or {k, v, mono, html}. Empty values read “Not recorded”.'), P('cols', '1|2', '1', 'Two columns on wide screens.'), P('compact', 'bool', 'false', 'Tighter rows.')],
      demos: [['Two columns', function () { return '<div style="width:100%">' + c.kv([['Write type', 'erp.sales_invoice.submit', { mono: true }], ['Module', 'Accounts receivable'], ['Amount', '₹2,40,000', { mono: true }], ['Idempotency key', 'sha256(customer_id + invoice_no + posting_date)', { mono: true }], ['Declaration', 'erp.ar v7', { mono: true }], ['Reversal', '']], { cols: 2 }) + '</div>'; }, { col: true, plain: true }]],
      code: "E1.c.kv([['Write type','erp.sales_invoice.submit',{mono:true}], ['Amount', E1.fmt.inr(1248500), {mono:true}]])", dos: ['Use “Not recorded” rather than a dash for a missing value that should exist.'], donts: ['Do not put actions inside values.'], a11y: ['<dl>, <dt>, <dd>.'] },
    { name: 'diff', title: 'Difference table', group: 'Data', sig: "E1.c.diff(rows, {caption, collapse})", summary: 'Field-level before and after as a real table. Changed rows are marked in words; material rows carry a strong left edge; unchanged rows collapse behind “Show all fields”.',
      props: [P('rows', '[{field, before, after, changed, material, mono}]', '—', 'changed defaults to before !== after.'), P('caption', 'string', '—', 'Visible caption.'), P('collapse', 'bool', 'true', 'Hide unchanged rows until asked.')],
      demos: [['Decide screen diff', function () { return '<div style="width:100%">' + c.diff(S.diff, { caption: 'Field-level changes proposed by this write. Rows marked Material move money or the record of account.' }) + '</div>'; }, { col: true }]],
      code: "E1.c.diff([\n  {field:'Credit limit', before:'₹3,00,000', after:'₹2,40,000', material:true, mono:true},\n  {field:'Customer', before:'ACME Textiles', after:'ACME Textiles'}\n], {caption:'Field-level changes'})",
      dos: ['Show every field the proof binding commits.', 'On mobile, keep the collapse — changed fields first.'], donts: ['Do not summarise a diff into a sentence.'], a11y: ['A screen reader says “Credit limit, before ₹3,00,000, after ₹2,40,000”. Changed and Material are words, not only colour.'] },
    { name: 'timeline', title: 'Timeline', group: 'Data', sig: "E1.c.timeline(items)", summary: 'Every governed write that touched a record, with refusals and escalations alongside commits. A timeline of successes only lies by omission.',
      props: [P('items', '[{time, title, body, state, actor:{name,kind,role}, href, meta}]', '—', 'state is one of the six.')],
      demos: [['Record history', function () { return '<div style="width:100%;max-width:560px">' + c.timeline([
        { time: '24 Sep 2026, 15:02 IST', title: 'Committed · SINV-2026-01187 submitted', body: '₹2,40,000 to ACME Textiles, approved by Venkat Raman. Proof #4,101.', state: 'good', actor: { name: 'ar-agent', kind: 'agent', role: 'A2 Propose' }, href: '#/assurance/proof/4101' },
        { time: '24 Sep 2026, 15:02 IST', title: 'Approved OB-2026-0412', body: 'Resolving an obligation is itself a governed write. Proof #4,100.', state: 'good', actor: { name: 'Venkat Raman', kind: 'person', role: 'Accounts head' }, href: '#/assurance/proof/4100' },
        { time: '24 Sep 2026, 14:16 IST', title: 'Waiting on a person · OB-2026-0412', body: 'ar-agent is at A2 Propose, so a person approves before anything is written. Proof #4,099.', state: 'warning', href: '#/work/decide/OB-2026-0412' },
        { time: '24 Sep 2026, 14:07 IST', title: 'Not done — credit limit', body: 'Limit ₹3,00,000 · exposure after this invoice ₹4,20,000 · erp.ar v7. Proof #4,098.', state: 'neutral', actor: { name: 'ar-agent', kind: 'agent' }, href: '#/work/not-done/4098' }]) + '</div>'; }, { col: true, plain: true }]],
      code: "E1.c.timeline([{ time:'24 Sep 2026, 15:02 IST', title:'Committed · SINV-2026-01187 submitted', state:'good', actor:{name:'ar-agent', kind:'agent'}, href:'#/assurance/proof/4101' }])", dos: ['Include refusals and escalations.'], donts: ['Do not show relative times alone on a record; write the date.'], a11y: ['An ordered list; state words are in the titles.'] },
    { name: 'meter', title: 'Meter bar', group: 'Data', sig: "E1.c.meter(segments, {caption, format})", summary: 'Composition on the visualisation ramp, never the status palette. The legend states the numbers.',
      props: [P('segments', '[{label, value}]', '—', ''), P('caption', 'string', '—', ''), P('format', 'fn(n)', 'Indian grouping', '')],
      demos: [['Default', function () { return '<div style="width:100%">' + c.meter([{ label: 'Committed', value: 3733 }, { label: 'Waiting on a person', value: 317 }, { label: 'Not done', value: 171 }], { caption: 'Governed writes, 1–24 Sep 2026' }) + '</div>'; }, { col: true }]],
      code: "E1.c.meter([{label:'Automatic', value:812}, {label:'After a gate', value:331}], {caption:'Governed writes'})", dos: ['Order segments from the largest or by a natural order.'], donts: ['Do not colour a refusal segment red — it is a composition, not a verdict.'], a11y: ['role="img" with a label listing every segment; the legend repeats the numbers.'] },
    { name: 'progress', title: 'Progress', group: 'Data', sig: "E1.c.progress(value, max, {label, state, note})", summary: 'A linear track with the number stated beside it.',
      props: [P('value', 'number', '—', ''), P('max', 'number', '100', ''), P('label', 'string', '—', ''), P('state', "status | 'accent'", 'ink', 'Only when the bar really is a status.'), P('note', 'string', '“n of max”', '')],
      demos: [['Default', function () { return '<div class="e1-stack" style="width:100%;max-width:520px">' + c.progress(7, 11, { label: 'Evaluation battery' }) + c.progress(11, 11, { label: 'Declarations complete', state: 'good' }) + c.progress(3, 11, { label: 'Reversal plans written', state: 'warning' }) + c.progress(64, 100, { label: 'Setup', state: 'accent', note: '64%' }) + '</div>'; }, { col: true }]],
      code: "E1.c.progress(7, 11, {label:'Evaluation battery'})", dos: ['State the count.'], donts: ['Do not use a progress bar as an instruction; name the blocker instead.'], a11y: ['role="progressbar" with aria-valuenow, min and max.'] },
    { name: 'progressArc', title: 'Progress arc', group: 'Data', sig: "E1.c.progressArc(value, max, {size, label, sub})", summary: 'The disc derivation for completion or a run in flight. Clay, because it is brand emphasis, not a verdict.',
      props: [P('value / max', 'number', '— / 100', ''), P('size', 'number', '72', 'Pixels.'), P('label / sub', 'string', '—', 'Caption lines.')],
      demos: [['Sizes', function () { return c.progressArc(7, 11, { label: 'Evaluation battery', sub: '7 of 11' }) + c.progressArc(92, 100, { size: 96, label: 'Coverage' }) + c.progressArc(30, 100, { size: 48 }); }, { style: 'gap:40px;align-items:flex-end' }]],
      code: "E1.c.progressArc(7, 11, {label:'Evaluation battery', sub:'7 of 11'})", dos: ['One per surface (it is a disc).'], donts: ['Do not place it next to the logo.'], a11y: ['role="img" labelled with the percentage.'] },
    { name: 'sparkline', title: 'Sparkline', group: 'Data', sig: "E1.c.sparkline(values, {width, height, title, area, accent})", summary: 'A trend without axes. Always beside a stated number.',
      props: [P('values', 'number[]', '—', ''), P('width / height', 'number', '96 / 28', 'The SVG stretches to its container width.'), P('title', 'string', '“Trend”', 'Accessible name prefix.'), P('area', 'bool', 'true', ''), P('accent', 'bool', 'false', 'Clay line.')],
      demos: [['Default', function () { return '<div style="width:200px">' + c.sparkline([4, 6, 5, 8, 7, 9, 12, 11, 14], { title: 'Writes' }) + '</div><div style="width:200px">' + c.sparkline([14, 12, 13, 9, 10, 7, 6], { title: 'Refusals', accent: true }) + '</div>'; }]],
      code: "E1.c.sparkline([4,6,5,8,7,9,12], {title:'Writes per day'})", dos: ['Put the latest value in text next to it.'], donts: ['Do not use a sparkline where the reader needs to read values.'], a11y: ['Accessible name states the first and last values.'] },
    { name: 'barChart', title: 'Bar chart', group: 'Data', sig: "E1.c.barChart({data, title, height, unit, format, highlight, horizontal})", summary: 'Inline SVG on chart tokens with an accessible title and a hidden data table.',
      props: [P('data', '[{label, value}]', '—', ''), P('title', 'string', '—', 'Required; it is the figure caption.'), P('highlight', 'index', '—', 'One bar in the accent.'), P('horizontal', 'bool', 'false', 'Labelled horizontal bars.'), P('format', 'fn(n)', 'Indian grouping', ''), P('unit', 'string', '—', ''), P('height', 'number', '200', '')],
      demos: [['Vertical and horizontal', function () { var d = [{ label: 'Mon', value: 212 }, { label: 'Tue', value: 236 }, { label: 'Wed', value: 251 }, { label: 'Thu', value: 244 }, { label: 'Fri', value: 302 }, { label: 'Sat', value: 96 }, { label: 'Sun', value: 41 }]; return '<div class="e1-grid e1-grid--2" style="width:100%">' + c.card({ body: c.barChart({ title: 'Governed writes this week', data: d, highlight: 4 }) }) + c.card({ body: c.barChart({ title: 'Refusals by code', horizontal: true, data: [{ label: 'GATE.PRECONDITION', value: 41 }, { label: 'POLICY.DENIED_BY_RULE', value: 28 }, { label: 'GATE.DUAL_CONTROL', value: 12 }, { label: 'POLICY.BLAST_RADIUS', value: 5 }], highlight: 0 }) }) + '</div>'; }, { col: true }]],
      code: "E1.c.barChart({ title:'Governed writes this week', data:[{label:'Mon', value:212}], highlight:4 })", dos: ['Highlight at most one bar.'], donts: ['Do not colour bars with statuses.'], a11y: ['<figure> with <figcaption>; a visually hidden <table> carries the values.'] },
    { name: 'lineChart', title: 'Line chart', group: 'Data', sig: "E1.c.lineChart({series:[{name, values, accent, muted}], labels, title, height, unit, format, area})", summary: 'One measured series, optionally one accent and one muted comparison. Legend states the latest values.',
      props: [P('series', 'array', '—', 'accent → clay; muted → dashed comparison.'), P('labels', 'string[]', '—', 'X-axis labels.'), P('title', 'string', '—', ''), P('area', 'bool', 'false', 'Fill under the first series.')],
      demos: [['Default', function () { return '<div style="width:100%">' + c.card({ body: c.lineChart({ title: 'Refusal rate by week', unit: '%', area: true, labels: ['W31', 'W32', 'W33', 'W34', 'W35', 'W36', 'W37', 'W38'], series: [{ name: 'Refusal rate', values: [9.1, 9.8, 10.2, 11.9, 11.1, 10.6, 11.2, 11.4] }, { name: 'Previous quarter', values: [8.2, 8.6, 9.0, 8.8, 9.4, 9.9, 9.6, 10.1], muted: true }] }) }) + '</div>'; }, { col: true }]],
      code: "E1.c.lineChart({ title:'Refusal rate', labels:weeks, series:[{name:'Rate', values:v}] })", dos: ['Start the y-axis at zero.'], donts: ['Do not show more than three series.'], a11y: ['Hidden data table with every point.'] },
    { name: 'donut', title: 'Donut', group: 'Data', sig: "E1.c.donut({data, title, size, centre:{value, label}, format})", summary: 'Composition with a stated centre value and a legend with numbers and shares.',
      props: [P('data', '[{label, value}]', '—', ''), P('title', 'string', '—', ''), P('centre', '{value, label}', '—', ''), P('size', 'number', '160', '')],
      demos: [['Default', function () { return c.card({ body: c.donut({ title: 'Writes by blast radius', centre: { value: '3,733', label: 'writes' }, data: [{ label: 'One record', value: 1077 }, { label: 'One counterparty', value: 2649 }, { label: 'Batch', value: 7 }, { label: 'Whole tenant', value: 0 }] }) }); }, { col: true }]],
      code: "E1.c.donut({ title:'Writes by blast radius', centre:{value:'1,284', label:'writes'}, data })", dos: ['Keep to five segments or fewer.'], donts: ['Do not use a donut for a ladder that has its own component.'], a11y: ['Each segment has a <title>; hidden table included.'] },
    { name: 'json', title: 'JSON viewer', group: 'Data', sig: "E1.c.json(value, {open, title})", summary: 'Native <details> tree for payloads and proof preimages, with copy.',
      props: [P('value', 'any', '—', ''), P('open', 'number', '1', 'Depth expanded initially.'), P('title', 'string', '—', 'Adds a bar with copy.')],
      demos: [['Proof preimage', function () { return '<div style="width:100%">' + c.json({ seq: 4101, prev_digest: S.hash4100.slice(0, 16) + '…', write_type: 'erp.sales_invoice.submit', actor_kind: 'agent', autonomy: 'A2', outcome: 'committed', mode: 'live', obligation_ref: 'OB-2026-0412', declaration: { id: 'erp.ar', version: 7 }, policy_version: 11, fields: { name: 'SINV-2026-01187', customer: 'ACME Textiles', grand_total: 240000, docstatus: 1 } }, { title: 'Preimage (16 fields, 8 shown)', open: 1 }) + '</div>'; }, { col: true }]],
      code: "E1.c.json(entry, {title:'Preimage', open:1})", dos: ['Use for developer and auditor views.'], donts: ['Do not show raw JSON to an approver instead of a diff.'], a11y: ['Keyboard: Enter or Space toggles each node.'] },
    { name: 'tree', title: 'Tree', group: 'Data', sig: "E1.c.tree(nodes)", summary: 'Nested structure — declaration blocks, pack contents — with native disclosure.',
      props: [P('nodes', '[{label, icon, href, open, meta, children}]', '—', '')],
      demos: [['Declaration', function () { return '<div style="width:100%;max-width:480px">' + c.tree([{ label: 'erp.ar v7', icon: 'file-text', open: true, children: [{ label: 'identity', meta: 'declared' }, { label: 'shape', meta: 'declared' }, { label: 'write_types', open: true, children: [{ label: 'erp.sales_invoice.submit', meta: 'one counterparty', href: '#/records/write-types/erp.sales_invoice.submit' }, { label: 'erp.credit_note.submit', meta: 'one counterparty', href: '#/records/write-types' }] }, { label: 'gates', meta: '9' }, { label: 'proof_binding', meta: '16 fields' }, { label: 'channels', meta: 'console, whatsapp' }] }]) + '</div>'; }, { col: true }]],
      code: "E1.c.tree([{label:'erp.ar v7', open:true, children:[{label:'gates', meta:'9'}]}])", dos: ['Open the path to the current item.'], donts: ['Do not go deeper than four levels.'], a11y: ['Native <details>/<summary>.'] },
    { name: 'code', title: 'Code block', group: 'Data', sig: "E1.c.code(block, lang, {title})", summary: 'Mono block on bone with a copy button.',
      props: [P('block', 'string', '—', 'Raw text (escaped).'), P('lang', 'string', '—', 'Label only; no highlighting.'), P('title', 'string', 'lang', 'Bar label.')],
      demos: [['Default', function () { return '<div style="width:100%">' + c.code("curl -X POST https://api.elan1.ai/v1/act.write \\\n  -H 'Authorization: Bearer $ELAN1_SANDBOX_KEY' \\\n  -d '{\"write_type\":\"erp.payment_entry.submit\",\"idempotency_key\":\"…\"}'", 'shell', { title: 'Sandbox request' }) + '</div>'; }, { col: true }]],
      code: "E1.c.code(snippet, 'shell', {title:'Sandbox request'})", dos: ['Use sandbox keys in examples.'], donts: ['Do not show a production key, even redacted.'], a11y: ['Copy button announces through a toast.'] },

    /* ---------- Governance ---------- */
    { name: 'gates', title: 'Gate results', group: 'Governance', sig: "E1.c.gates(list, {title, version})", summary: 'Every declared gate’s result — not only the failures — in plain words, each with the declaration version it ran against (E06 §03).',
      props: [P('list', "[{id, name, result:'passed'|'failed'|'pending'|'waiting'|'skipped'|'not_run', words, version}]", '—', 'pending/waiting: the gate waits on something outside the write, e.g. a second person (warning).'), P('version', 'string', '—', 'Shown in the summary.')],
      demos: [['All passed (OB-2026-0412)', function () { return '<div style="width:100%">' + c.gates(S.gates, { version: 'erp.ar v7 · policy v11' }) + '</div>'; }, { col: true }], ['Mixed, from #4,098', function () { return '<div style="width:100%">' + c.gates(S.gatesRefused, { version: 'erp.ar v7 · policy v11' }) + '</div>'; }, { col: true }], ['Waiting on a second person', function () { return '<div style="width:100%">' + c.gates([{ id: 'G1', name: 'Consent', result: 'passed', words: 'Recorded consent covers supplier payments.', version: 'erp.ap v5' }, { id: 'G4', name: 'Dual control', result: 'pending', words: 'Ravi Shankar has approved; waiting on Meenakshi Iyer as the second named person.', version: 'erp.ap v5' }, { id: 'G6', name: 'Budget', result: 'passed', words: '3 of 6 payment runs declared for September used.', version: 'erp.ap v5' }]) + '</div>'; }, { col: true }]],
      code: "E1.c.gates([{id:'G1', name:'Consent', result:'passed', words:'…', version:'erp.ar v7'}])", dos: ['Show all gates, in declared order.', 'Put the two numbers that decided a precondition in the words.'], donts: ['Do not show only “5 of 5” on the Decide screen; the list is required there.'], a11y: ['Each row states passed/failed/skipped in words and with a distinct glyph and border.'] },
    { name: 'rungs', title: 'Write path', group: 'Governance', sig: "E1.c.rungs({at, outcome, include0b, notes, compact})", summary: 'The Right Path: rung 0b STOP (counted separately) and the nine rungs of the one write function. A refusal is NEUTRAL “Not done” and jumps to rung 8 (recorded) and 9 (metered at zero); only a platform failure is critical.',
      props: [P('outcome', "'committed'|'refused'|'escalated'|'running'|'platform'", "'committed'", ''), P('at', "1–9 | '0b' (or 0)", '9 (6 when escalated)', 'The rung reached. at:\'0b\' shows 0b automatically.'), P('include0b', 'bool', 'false', 'Prepend rung 0b STOP.'), P('notes', "{n|'0b': string}", 'rung descriptions', 'Override the note under a rung.'), P('compact', 'bool', 'false', 'Hide notes.')],
      demos: [['Committed, with 0b', function () { return '<div style="width:100%">' + c.rungs({ outcome: 'committed', include0b: true }) + '</div>'; }, { col: true }], ['Not done at rung 3 (neutral)', function () { return '<div style="width:100%">' + c.rungs({ outcome: 'refused', at: 3, include0b: true, notes: { 3: 'G9 precondition: exposure ₹4,20,000 > limit ₹3,00,000' } }) + '</div>'; }, { col: true }], ['Refused at 0b — tenant stopped', function () { return '<div style="width:100%">' + c.rungs({ outcome: 'refused', at: '0b', compact: true, notes: { '0b': 'POLICY.TENANT_STOPPED' } }) + '</div>'; }, { col: true }], ['Platform failure at rung 7 (critical)', function () { return '<div style="width:100%">' + c.rungs({ outcome: 'platform', at: 7, include0b: true, compact: true }) + '</div>'; }, { col: true }], ['Waiting on a person at rung 6', function () { return '<div style="width:100%">' + c.rungs({ outcome: 'escalated', compact: true }) + '</div>'; }, { col: true }], ['Running', function () { return '<div style="width:100%">' + c.rungs({ outcome: 'running', at: 7, compact: true }) + '</div>'; }, { col: true }]],
      code: "E1.c.rungs({ outcome:'refused', at:3, include0b:true, notes:{3:'G9 precondition failed'} })\nE1.c.rungs({ outcome:'platform', at:7 })   // PLATFORM.TARGET_UNREACHABLE", dos: ['Use on the proof and refusal screens to show where the write stopped.', 'Include 0b wherever the whole Right Path is explained.'], donts: ['Do not colour a refused rung red.', 'Do not imply a fast path; all rungs always appear.'], a11y: ['An ordered list; each rung states its outcome in words; aria-current marks a running rung.'] },
    { name: 'chain', title: 'Proof chain', group: 'Governance', sig: "E1.c.chain(entries, {standing, scope, count, breakAt, checkedAt})", summary: 'Chain standing in three values — continuous, break at seq N, not checked — with the scope and count printed next to the word (E06 decision 3).',
      props: [P('entries', "[{seq, digest, prev, writeType, outcome, at, actorKind, href}]", '—', ''), P('standing', "'continuous'|'break'|'not_checked'", "'not_checked'", 'Never a bare green tick.'), P('scope', 'string', '—', 'e.g. “3 of 23 write types”.'), P('count', 'string', '—', 'e.g. “4,097 entries”.'), P('breakAt', 'number', '—', 'The seq whose prev does not match.'), P('checkedAt', 'string', '—', '')],
      demos: [['Continuous', function () { return '<div style="width:100%">' + c.chain(S.chain(), { standing: 'continuous', scope: '19 of 23 write types', count: 'seq 1–4,112', checkedAt: 'nightly 02:10 IST' }) + '</div>'; }, { col: true }], ['Break', function () { return '<div style="width:100%">' + c.chain(S.chain().slice(0, 2), { standing: 'break', breakAt: 4100, scope: 'incident mock · all write types', count: '2 entries shown' }) + '</div>'; }, { col: true }], ['Not checked', function () { return '<div style="width:100%">' + c.chain([], { standing: 'not_checked', scope: 'Deccan Auto · seq 1,201–1,284', count: 'written after last night’s run' }) + '</div>'; }, { col: true }]],
      code: "E1.c.chain(entries, { standing:'continuous', scope:'3 of 23 write types', count:'4,101 entries' })", dos: ['Print scope and count next to the standing word, always.'], donts: ['Do not show “Verified” for a chain checked over a subset.'], a11y: ['Standing is text; the break row is marked in words.'] },
    { name: 'seal', title: 'Proof seal', group: 'Governance', sig: "E1.c.seal({seq, writeType, outcome, code, blast, reversible, amount, actor, approver, at, digest, prev, declaration, policy, level, signer, keyId, anchor, verdict, counter})", summary: 'The proof of one governed write. At L1 it is an honest “hash-chained, not signed” record with no signature row. At L2/L3 (preview) it adds signature, anchor and verdict, labelled with the level.',
      props: [P('level', "'L1'|'L2'|'L3'", 'E1.state.level', 'Decides which rows may exist.'), P('seq / digest / prev', 'number / string', '—', ''), P('writeType, outcome, code', 'string', '—', 'outcome as in c.outcome().'), P('blast, reversible', '1–5 · window|false', '—', 'Drawn with c.blast() and c.reversible().'), P('amount', 'number', '—', ''), P('actor', '{name, kind}', '—', 'The proposer.'), P('approver', 'string', '—', 'A person.'), P('signer, keyId, anchor, verdict', 'string', '—', 'Rendered only at L2+.'), P('counter', 'string', '—', 'Rendered only at L3.')],
      demos: [['L1 — hash-chained, not signed', function () { return '<div style="width:100%;max-width:560px">' + c.seal({ level: 'L1', seq: 4101, writeType: 'erp.sales_invoice.submit', outcome: 'committed', blast: 2, reversible: '24 h', amount: 240000, actor: { name: 'ar-agent', kind: 'agent' }, approver: 'Venkat Raman', at: '24 Sep 2026, 15:02 IST', declaration: 'erp.ar v7', policy: 'policy v11', digest: S.hash4101, prev: S.hash4100 }) + '</div>'; }, { col: true }], ['L2 — preview', function () { return '<div style="width:100%;max-width:560px">' + c.seal({ level: 'L2', seq: 4101, writeType: 'erp.sales_invoice.submit', outcome: 'committed', blast: 2, reversible: '24 h', amount: 240000, approver: 'Venkat Raman', at: '24 Sep 2026, 15:02 IST', digest: S.hash4101, prev: S.hash4100, keyId: 'ed25519:7a1f…c02e', anchor: '24 Sep 2026, 15:05 IST · batch 1,882' }) + '</div>'; }, { col: true }]],
      code: "E1.c.seal({ seq:4101, writeType:'erp.sales_invoice.submit', digest, prev, approver:'Venkat Raman' }) // level defaults to E1.state.level",
      dos: ['Let the level decide the rows; pass level only to show a labelled preview.'], donts: ['Do not render an empty “Signed by” row at L1.', 'Do not call an L1 record tamper-proof or signed.'], a11y: ['An <article> labelled “Proof #4,101”; the honesty sentence is text, not a tooltip.'] },
    { name: 'refusal', title: 'Refusal', group: 'Governance', sig: "E1.c.refusal({code, title, rule, ruleName, version, numbers, change, action, proofHref, at})", summary: 'Not done, in the words of the thing tried. Names the rule and its version, the two numbers that failed, and the one next action. The code appears once, small.',
      props: [P('title', 'string', '—', '“Not done — credit limit”.'), P('code', 'string', '—', 'e.g. GATE.PRECONDITION_FAILED. PLATFORM.* switches to the “our failure” copy.'), P('ruleName / version', 'string', '—', ''), P('rule', 'string', '—', 'One sentence.'), P('numbers', '[{label, value}]', '—', 'The two numbers.'), P('change', 'string', '—', 'What would change the outcome.'), P('action', '{label, href} | html', '—', 'Exactly one operator action (itself a governed write).'), P('proofHref', 'string', '—', '“Show the record of this refusal”.'), P('at', 'string', '—', 'Time.')],
      demos: [['Policy refusal', function () { return '<div style="width:100%">' + c.refusal({ code: 'GATE.PRECONDITION_FAILED', title: 'Not done — credit limit', ruleName: 'Customer credit limit', version: 'erp.ar v7', rule: 'An invoice may not take a customer above their credit limit.', numbers: [{ label: 'Credit limit', value: '₹3,00,000' }, { label: 'Exposure after this invoice', value: '₹4,20,000' }], change: 'Reduce the invoice by ₹1,20,000, or request a limit change — itself a governed write that Venkat Raman approves.', action: { label: 'Request a limit change', href: '#/work/request/erp.credit_limit.change' }, proofHref: '#/assurance/proof/4098', at: '24 Sep 2026, 14:07 IST · #4,098' }) + '</div>'; }, { col: true }], ['Platform failure', function () { return '<div style="width:100%">' + c.refusal({ code: 'PLATFORM.TARGET_UNREACHABLE', title: 'Our failure — ERPNext did not answer', action: { label: 'Open the record of this failure', href: '#/work/not-done/4102', kind: 'secondary' }, at: '24 Sep 2026, 15:10 IST · #4,102' }) + '</div>'; }, { col: true }]],
      code: "E1.c.refusal({ code:'GATE.PRECONDITION_FAILED', title:'Not done — credit limit', rule:'…', numbers:[{label:'Credit limit', value:'₹3,00,000'}, {label:'Exposure after', value:'₹4,20,000'}], action:{label:'Request a limit change', href:'#/work/request/erp.credit_limit.change'}, proofHref:'#/assurance/proof/4098' })",
      dos: ['Name the rule and its version.', 'Offer exactly one next action.'], donts: ['Do not apologise.', 'Do not say “insufficient permissions” or “something went wrong”.'], a11y: ['An <article> with an <h3>; numbers are a <dl>.'] },
    { name: 'blast', title: 'Blast radius', group: 'Governance', sig: "E1.c.blast(n, {compact, note})", summary: 'The five declared radius values — One record, One counterparty, Batch, Whole tenant, Crosses an organisation boundary — as a stepped band whose order reads without colour. Deliberately not the status palette; reversibility is a separate chip.',
      props: [P('n', "1–5 | 'one_record'|'one_counterparty'|'batch'|'tenant'|'cross_boundary'", '—', 'UI words (“Whole tenant”) are accepted too. c.blastLevel(x) resolves any form to 1–5.'), P('compact', 'bool', 'false', 'Band and name only.'), P('note', 'string | false', 'the value’s definition', '')],
      demos: [['Full', function () { return '<div class="e1-stack">' + [1, 2, 3, 4, 5].map(function (n) { return c.blast(n); }).join('') + '</div>'; }], ['Compact, by declared key', function () { return ['one_record', 'one_counterparty', 'batch', 'tenant', 'cross_boundary'].map(function (k) { return c.blast(k, { compact: true }); }).join(''); }, { style: 'gap:20px' }], ['With reversibility beside it', function () { return '<span class="e1-row">' + c.blast('one_counterparty', { compact: true }) + c.reversible('24 h') + '</span><span class="e1-row">' + c.blast('batch', { compact: true }) + c.reversible(false) + '</span><span class="e1-row">' + c.blast('cross_boundary', { compact: true }) + c.reversible(false) + '</span>'; }, { style: 'gap:24px' }]],
      code: "E1.c.blast('one_counterparty')      // declared key\nE1.c.blast(3, {compact:true})        // Batch\nE1.c.blast(wt.blast) + E1.c.reversible(wt.undoWindow || false)", dos: ['Show on every queue row and above the fold on Decide.', 'Pair with c.reversible() — radius and reversibility are separate facts.'], donts: ['Do not use a status badge for a radius.', 'Do not use the v1.0 words (Contained, Material, Irreversible) — they are accepted as deprecated aliases only.'], a11y: ['Includes “blast radius n of 5” as text; the band is aria-hidden.'] },
    { name: 'reversible', title: 'Reversibility', group: 'Governance', sig: "E1.c.reversible(windowOrFalse, {note})", summary: 'Whether a declared reversal plan exists, and for how long: “Reversible · 24 h” or “Irreversible”. Separate from blast radius.',
      props: [P('windowOrFalse', "string | hours | true | false", '—', "'24 h', '30 days', 720 (→ '30 days'), true (no window stated), false → Irreversible."), P('note', 'string', 'derived', 'Tooltip text.')],
      demos: [['Default', function () { return c.reversible('24 h') + c.reversible(720) + c.reversible(72) + c.reversible(true) + c.reversible(false); }]],
      code: "E1.c.reversible('24 h')   // Reversible · 24 h\nE1.c.reversible(false)   // Irreversible", dos: ['Show the window the declaration states — target_native_undo 24 h, snapshot_restore 720 h.'], donts: ['Do not say “easily undoable”. A reversal has a window and a plan.'], a11y: ['Text plus an undo or lock glyph; never colour alone.'] },
    { name: 'outcome', title: 'Outcome', group: 'Governance', sig: "E1.c.outcome(kind, {code, subtle, label})", summary: 'The outcome of a governed write. Exactly three — Committed, Not done, Waiting on a person — plus Expired and Platform failure. A refusal is a correct, free outcome, so “Not done” is neutral, never red.',
      props: [P('kind', "'committed'|'refused'|'escalated'|'expired'|'platform'|'reversed'", "'committed'", 'Aliases: refuse, not_done, escalate, waiting, allow.'), P('code', 'string', '—', 'Shown once, small, in mono. A PLATFORM.* code forces the platform outcome.'), P('subtle', 'bool', 'false', 'No fill.'), P('label', 'string', 'per kind', 'Override the words.')],
      demos: [['Kinds', function () { return c.outcome('committed') + c.outcome('refused') + c.outcome('escalated') + c.outcome('expired') + c.outcome('platform') + c.outcome('reversed'); }], ['With codes', function () { return c.outcome('refused', { code: 'GATE.PRECONDITION_FAILED' }) + c.outcome('refused', { code: 'PLATFORM.TARGET_UNREACHABLE' }) + c.outcome('escalated', { code: 'OB-2026-0412', subtle: true }); }]],
      code: "E1.c.outcome('refused', {code:'GATE.PRECONDITION_FAILED'})   // neutral “Not done”\nE1.c.outcome(entry.outcome)", dos: ['Use for every proof, chain entry and timeline outcome.'], donts: ['Do not show “Refused” in critical red.', 'Do not invent a “succeeded with warnings” state — there is no warn.'], a11y: ['Each kind has its own glyph and its own words.'] },
    { name: 'locked', title: 'Locked (L2/L3 explainer)', group: 'Governance', sig: "E1.c.locked({level, title, why, items, preview, always, compact})", summary: 'What an L2 or L3 screen shows while the tenant is below that level: “This arrives at Assurance Level 2 Attested”, why, what arrives, and “Preview as L2”. Never a blank screen.',
      props: [P('level', "'L2'|'L3'", "'L2'", ''), P('title', 'string', '“This arrives at Assurance Level n Name”', ''), P('why', 'string', 'the level’s claim', ''), P('items', 'string[]', '—', 'What arrives.'), P('preview', 'bool', 'true', 'Shows “Preview as L2”, which calls E1.setLevel().'), P('always', 'bool', 'false', 'Render even when the level is already met (documentation). By default returns “” once E1.atLeast(level).'), P('compact', 'bool', 'false', '')],
      demos: [['L2', function () { return '<div style="width:100%">' + c.locked({ level: 'L2', always: true, items: ['Ed25519 signature over the frozen sixteen-field preimage', 'RFC 3161 anchor, batched, with the unanchored gap shown', 'Exportable evidence bundle and the free offline verifier'] }) + '</div>'; }, { col: true }], ['L3, compact', function () { return '<div style="width:100%">' + c.locked({ level: 'L3', always: true, compact: true, why: 'Counter-signature by a party that is not elan1, and a second independent seal implementation.' }) + '</div>'; }, { col: true }]],
      code: "render: () => E1.atLeast('L2') ? bundlesTable() : E1.c.locked({ level:'L2', items:['Exportable evidence bundle', 'Offline verifier'] })\n// the button runs E1.setLevel('L2') — same as the top-bar pill", dos: ['Say what arrives, in the claim words of that level.'], donts: ['Do not render an empty L2 table or a disabled export button at L1.', 'Do not show dates; show the gate.'], a11y: ['A labelled <section>; the preview button is a real button.'] },
    { name: 'autonomy', title: 'Autonomy ladder', group: 'Governance', sig: "E1.c.autonomy(level, {compact})", summary: 'A0 Observe to A5 Act broad. A missing grant renders as “A0 Observe (no grant)” in the same form as an explicit A0, because that is what it means.',
      props: [P('level', "'A0'…'A5' | 0–5 | null", '—', 'null/undefined = no grant.'), P('compact', 'bool', 'false', 'Inline steps for table cells.')],
      demos: [['Full', function () { return '<div style="width:100%">' + c.autonomy('A2') + '</div>'; }, { col: true }], ['Compact, including a missing grant', function () { return c.autonomy('A4', { compact: true }) + c.autonomy('A0', { compact: true }) + c.autonomy(null, { compact: true }); }, { style: 'gap:24px' }]],
      code: "E1.c.autonomy(grant ? grant.level : null, {compact:true})", dos: ['Resolve a missing grant to A0 and say “no grant”.'], donts: ['Do not show a blank cell for a missing grant.'], a11y: ['aria-current marks the level; the description is text.'] },
    { name: 'countdown', title: 'Countdown', group: 'Governance', sig: "E1.c.countdown(deadline, {label, warn})", summary: 'Time left on an obligation. Static at render, ticked every second by core; turns warning under an hour and says “Expired” at zero.',
      props: [P('deadline', 'ISO string | Date', '—', 'Use E1.ahead(minutes) for sample data.'), P('warn', 'minutes', '60', ''), P('label', 'string', '—', 'Screen-reader prefix.')],
      demos: [['Default', function () { return c.countdown(E1.ahead(134)) + c.countdown(E1.ahead(38)) + c.countdown(E1.ahead(0.4)) + c.countdown(E1.ago(5)); }, { style: 'gap:24px' }]],
      code: "E1.c.countdown(obligation.expiresAt, {label:'Expires'})", dos: ['Pair with the absolute time on the Decide screen.'], donts: ['Do not animate the countdown.'], a11y: ['role="timer" with aria-live off, so it never interrupts; the absolute time is in the title.'] },

    /* ---------- States ---------- */
    { name: 'empty', title: 'Empty state', group: 'States', sig: "E1.c.empty({title, why, fill, action, icon, compact})", summary: 'Names what is missing, why, and what would fill it. Law 7 made structural.',
      props: [P('title', 'string', '—', 'What this is, stated as a finding.'), P('why', 'string', '—', 'Why it is empty.'), P('fill', 'string', '—', 'What would fill it.'), P('action', '{label, href} | html | array', '—', ''), P('icon', 'icon name', "'aperture'", ''), P('compact', 'bool', 'false', '')],
      demos: [['Default', function () { return '<div style="width:100%">' + c.empty({ title: 'Nothing is waiting for you', why: 'Agents are running at their declared autonomy; anything that needs a person will appear here.', fill: 'Write types that escalate to you: erp.sales_invoice.submit above ₹2,00,000, erp.credit_note.submit and erp.credit_limit.change.', action: { label: 'What arrives here', href: '#/work/approvals/arrives' } }) + '</div>'; }, { col: true }]],
      code: "E1.c.empty({ title:'No declaration yet', why:'A module without a declaration has no screens, because there is nothing to render.', action:{label:'Open Studio', href:'#/records/studio'} })",
      dos: ['Explain why an empty queue is empty.'], donts: ['Do not write “No data” or “Nothing here”.'], a11y: ['Heading level 3, so it sits under the page’s sections.'] },
    { name: 'error', title: 'Error state', group: 'States', sig: "E1.c.error({title, body, reassurance, code, action})", summary: 'What happened, what did not happen, and what to do. The reassurance line matters.',
      props: [P('title', 'string', '—', ''), P('body', 'string', '—', ''), P('reassurance', 'string', '—', 'What did not happen.'), P('code', 'string', '—', 'Once, small.'), P('action', '{label, href} | html', '—', '')],
      demos: [['Queue cannot load', function () { return '<div style="width:100%">' + c.error({ title: 'We cannot show your approvals right now.', reassurance: 'Nothing has been approved in the meantime and nothing expires while this is down.', code: 'PLATFORM.QUEUE_UNAVAILABLE', action: { label: 'Try again', href: '#/work/approvals' } }) + '</div>'; }, { col: true }]],
      code: "E1.c.error({ title:'We cannot show your approvals right now.', reassurance:'Nothing has been approved in the meantime…' })", dos: ['Say both facts, in order: what failed, what did not change.'], donts: ['Do not blame the user.'], a11y: ['role="alert".'] },
    { name: 'callout', title: 'Callout', group: 'States', sig: "E1.c.callout({kind, title, body})", summary: 'A rule, a caveat or a note inside a page. Rule is the house’s strongest aside.',
      props: [P('kind', "'rule'|'caveat'|'info'|'good'|'warning'|'critical'", "'info'", ''), P('title', 'string', '—', ''), P('body', 'html', '—', '')],
      demos: [['Kinds', function () { return '<div class="e1-stack" style="width:100%">' + c.callout({ kind: 'rule', title: 'An agent may never be an approver at L1.', body: '<p>The resolver set contains people only; Send to offers no agents.</p>' }) + c.callout({ kind: 'caveat', title: 'Budgets are design targets.', body: '<p>Every p50 here is unverified until Gate 1 replaces it with readings.</p>' }) + c.callout({ kind: 'info', title: 'Sandbox data', body: '<p>This tenant is in the sandbox. Nothing reaches a live system.</p>' }) + '</div>'; }, { col: true }]],
      code: "E1.c.callout({kind:'rule', title:'…', body:'<p>…</p>'})", dos: ['Use rule for a platform invariant.'], donts: ['Do not stack more than two callouts.'], a11y: ['An <aside>; the kind is a word in the title.'] },
    { name: 'skeleton', title: 'Skeleton', group: 'States', sig: "E1.c.skeleton({kind, lines, rows})", summary: 'The shape of what is loading. Shimmer collapses under reduced motion.',
      props: [P('kind', "'text'|'table'|'card'|'stat'", "'text'", ''), P('lines', 'number', '3', ''), P('rows', 'number', '5', '')],
      demos: [['Kinds', function () { return '<div class="e1-grid e1-grid--3" style="width:100%">' + c.skeleton({ kind: 'stat' }) + c.skeleton({ kind: 'card' }) + '<div>' + c.skeleton({ lines: 4 }) + '</div></div><div style="width:100%;margin-top:12px">' + c.skeleton({ kind: 'table', rows: 3 }) + '</div>'; }, { col: true }]],
      code: "E1.c.skeleton({kind:'table', rows:5})", dos: ['Match the final layout.'], donts: ['Do not show a skeleton for more than a few seconds; show an error state instead.'], a11y: ['aria-busy with a hidden “Loading”.'] },

    /* ---------- Navigation ---------- */
    { name: 'tabs', title: 'Tabs', group: 'Navigation', sig: "E1.c.tabs(items, active, {kind, label})", summary: 'Tabs are links, so every view has an address. Line tabs for a page, enclosed tabs inside a pane.',
      props: [P('items', '[{id, label, href, count}]', '—', ''), P('active', 'string', '—', 'Active id.'), P('kind', "'line'|'enclosed'", "'line'", ''), P('label', 'string', "'Views'", 'aria-label of the nav.')],
      demos: [['Line', function () { return '<div style="width:100%">' + c.tabs([{ id: 'q', label: 'Waiting on me', href: '#/work/approvals', count: 4 }, { id: 'a', label: 'Waiting on anyone', href: '#/work/approvals?filter=anyone', count: 11 }, { id: 'e', label: 'Expiring within an hour', href: '#/work/approvals?filter=expiring', count: 1 }, { id: 'd', label: 'Decided', href: '#/work/approvals?filter=decided' }], 'q') + '</div>'; }, { col: true }], ['Enclosed', function () { return c.tabs([{ id: 'd', label: 'Difference', href: '#/reference/components/tabs' }, { id: 'g', label: 'Gates', href: '#/reference/components/tabs?t=g' }, { id: 'e', label: 'Evidence', href: '#/reference/components/tabs?t=e' }], 'd', { kind: 'enclosed' }); }]],
      code: "E1.c.tabs([{id:'mine', label:'Waiting on me', href:'#/work/approvals?filter=mine', count:4}], query.filter || 'mine')", dos: ['Put the tab state in the URL.'], donts: ['Do not use tabs for a sequence of steps; use a stepper.'], a11y: ['A <nav> of links with aria-current="page" on the active one.'] },
    { name: 'filters', title: 'Filters', group: 'Navigation', sig: "E1.c.filters(chips, {label, clearHref})", summary: 'Filter chips whose state lives in the URL, so a filtered view can be pasted into a message (E06 §02).',
      props: [P('chips', '[{label, href, active, count}]', '—', ''), P('label', 'string', '—', 'Visible group label.'), P('clearHref', 'string', '—', 'A Clear link.')],
      demos: [['Default', function () { return c.filters([{ label: 'Waiting on me', href: '#/work/approvals?filter=mine', active: true, count: 4 }, { label: 'Expiring within an hour', href: '#/work/approvals?filter=expiring', count: 1 }, { label: 'Raised by an agent', href: '#/work/approvals?filter=agent', count: 3 }, { label: 'Material', href: '#/work/approvals?blast=3' }], { label: 'Show', clearHref: '#/work/approvals' }); }]],
      code: "E1.c.filters([{label:'Waiting on me', href:E1.href('/work/approvals',{filter:'mine'}), active:q.filter==='mine'}])", dos: ['Build hrefs with E1.href(path, query).'], donts: ['Do not keep filter state only in memory.'], a11y: ['role="group" labelled; active chip has aria-current.'] },
    { name: 'segmented', title: 'Segmented control', group: 'Navigation', sig: "E1.c.segmented(items, active, {name, label, size})", summary: 'Two to four mutually exclusive options. With hrefs they are links; without, radio buttons that emit e1:change.',
      props: [P('items', '[{id, label, href, icon}]', '—', ''), P('active', 'string', '—', ''), P('name', 'string', '—', 'data-name on the group, to tell groups apart in e1:change.'), P('label', 'string', '—', 'Accessible name.'), P('size', "'sm'", '—', '')],
      demos: [['Default', function () { return c.segmented([{ id: '7', label: '7 days' }, { id: '30', label: '30 days' }, { id: '90', label: '90 days' }], '30', { name: 'range', label: 'Range' }) + c.segmented([{ id: 'l', label: 'List', icon: 'list' }, { id: 'g', label: 'Grid', icon: 'grid' }], 'l', { size: 'sm', label: 'View' }); }]],
      code: "E1.c.segmented([{id:'7',label:'7 days'},{id:'30',label:'30 days'}], '30', {name:'range'})\n// in mount: el.addEventListener('e1:change', e => …e.detail.value)", dos: ['Keep to four options or fewer.'], donts: ['Do not use for navigation between screens; use tabs.'], a11y: ['radiogroup with arrow-key selection, or a group of links.'] },
    { name: 'breadcrumb', title: 'Breadcrumb', group: 'Navigation', sig: "E1.c.breadcrumb(items)", summary: 'The console renders crumbs automatically from door and section; use this helper inside other layouts.',
      props: [P('items', '[[label, href|null]]', '—', 'The last item is the current page.')],
      demos: [['Default', function () { return c.breadcrumb([['Work', '#/work/today'], ['Approvals', '#/work/approvals'], ['OB-2026-0412', null]]); }]],
      code: "E1.c.breadcrumb([['Work','#/work/today'], ['Approvals','#/work/approvals'], ['Decide', null]])", dos: ['Pass crumbs in the route definition for deep screens.'], donts: ['Do not repeat the page title in the page header and the crumb at a different wording.'], a11y: ['<nav aria-label="Breadcrumb"> with aria-current on the last item.'] },
    { name: 'pagination', title: 'Pagination', group: 'Navigation', sig: "E1.c.pagination({page, pages, href, total, label})", summary: 'Numbered page links with previous and next; the page lives in the URL.',
      props: [P('page / pages', 'number', '—', ''), P('href', 'fn(p) → string', '—', ''), P('total', 'number', '—', 'Shows “n results”.')],
      demos: [['Default', function () { return '<div style="width:100%">' + c.pagination({ page: 4, pages: 12, total: 4101, href: function (p) { return E1.href('/reference/components/pagination', { page: p }); } }) + '</div>'; }, { col: true }]],
      code: "E1.c.pagination({ page:+q.page||1, pages:12, total:4101, href: p => E1.href('/assurance/proof', {page:p}) })", dos: ['Show the total.'], donts: ['Do not use infinite scroll on a ledger.'], a11y: ['aria-current="page"; previous and next are labelled.'] },
    { name: 'stepper', title: 'Stepper', group: 'Navigation', sig: "E1.c.stepper(steps, current)", summary: 'A sequence you cannot skip forward in — Author, Validate, Simulate, Certify.',
      props: [P('steps', "string[] | [{label, note}]", '—', ''), P('current', 'number', '—', '0-based.')],
      demos: [['Studio', function () { return '<div style="width:100%">' + c.stepper([{ label: 'Author', note: '7 blocks' }, { label: 'Validate', note: '2 failures' }, { label: 'Simulate', note: 'fixtures only' }, { label: 'Certify', note: 'a named person' }], 1) + '</div>'; }, { col: true }]],
      code: "E1.c.stepper(['Author','Validate','Simulate','Certify'], 1)", dos: ['Name the blocker on the current step.'], donts: ['Do not let a person jump ahead.'], a11y: ['aria-current="step"; each step states done/current/not started.'] },
    { name: 'toc', title: 'Table of contents', group: 'Navigation', sig: "E1.c.toc(items, {title})", summary: 'In-page links that scroll without changing the route.',
      props: [P('items', '[{id, label}]', '—', 'ids of sections on the page.'), P('title', 'string', "'On this page'", '')],
      demos: [['Default', function () { return c.toc([{ id: 'specimens', label: 'Specimens' }, { id: 'usage', label: 'Usage' }, { id: 'props', label: 'Props' }]); }]],
      code: "E1.c.toc([{id:'gates', label:'Gates'}])", dos: ['Use on long reference pages.'], donts: ['Do not use on operational screens.'], a11y: ['Links keep a valid href; focus moves to the target.'] },

    /* ---------- Forms ---------- */
    { name: 'field', title: 'Field', group: 'Forms', sig: "E1.c.field(label, control, {id, help, error, required, optional})", summary: 'Label, control, then a hint or an error. An error replaces the hint; it never stacks under it.',
      props: [P('label', 'string', '—', ''), P('control', 'html', '—', 'Build it with the same id.'), P('id', 'string', '—', 'Binds <label for>; the message gets id-msg.'), P('help', 'string', '—', ''), P('error', 'string', '—', 'Replaces help.'), P('required / optional', 'bool', 'false', '')],
      demos: [['States', function () {
        return '<div class="e1-grid e1-grid--2" style="width:100%">' +
          '<div>' + c.field('Customer', c.select({ id: 'f-v', options: ['ACME Textiles', 'Lakshmi Garments', 'Shree Murugan Traders'], describedBy: 'f-v-msg' }), { id: 'f-v', help: 'The customer master record this write applies to.' }) +
          c.field('Amount', c.input({ id: 'f-a', prefix: '₹', suffix: 'INR', value: '4,20,000', invalid: true, mono: true, describedBy: 'f-a-msg' }), { id: 'f-a', required: true, error: 'Takes ACME Textiles to ₹4,68,000 against a ₹3,00,000 credit limit. Reduce the amount or request a limit change. erp.ar v7.' }) +
          c.field('Idempotency key', c.input({ id: 'f-k', value: 'sha256(customer_id + invoice_no + posting_date)', readonly: true, mono: true }), { id: 'f-k', help: 'Derived, never typed.' }) + '</div>' +
          '<div>' + c.field('Reason for rejecting', c.textarea({ id: 'f-r', placeholder: 'At least one sentence. This is recorded on the proof.', describedBy: 'f-r-msg' }), { id: 'f-r', required: true, help: 'Recorded on the proof. Written once, never edited.' }) +
          c.field('Out of scope reason', c.input({ id: 'f-n', value: 'tbd', invalid: true, describedBy: 'f-n-msg' }), { id: 'f-n', error: 'An honest unknown needs a sentence. What would change your answer?' }) +
          c.field('Model', c.input({ id: 'f-m', value: 'Frontier Large (US) — unrated', disabled: true }), { id: 'f-m', help: 'A model cannot be routed above its certification band.' }) + '</div></div>';
      }, { col: true, plain: true }]],
      code: "E1.c.field('Reason for rejecting',\n  E1.c.textarea({id:'reason', describedBy:'reason-msg'}),\n  {id:'reason', required:true, error: tooShort ? 'A rejection needs at least one sentence.' : null, help:'Recorded on the proof.'})",
      dos: ['Write errors that say what would make the value acceptable.', 'Reject “n/a” and “tbd” with a sentence.'], donts: ['Do not show a hint and an error together.', 'Do not validate on every keystroke.'], a11y: ['<label for>; the message is referenced by aria-describedby; errors use role="alert" and aria-invalid.'] },
    { name: 'input', title: 'Input', group: 'Forms', sig: "E1.c.input({name, id, value, placeholder, type, prefix, suffix, invalid, disabled, readonly, mono, required, attrs, describedBy})", summary: 'Text input with optional prefix and suffix.',
      props: [P('prefix / suffix', 'string', '—', 'e.g. ₹ and INR.'), P('invalid', 'bool', 'false', 'aria-invalid and a critical edge.'), P('mono', 'bool', 'false', 'For identifiers and amounts.'), P('type', 'string', "'text'", '')],
      demos: [['Default', function () { return '<div class="e1-grid e1-grid--3" style="width:100%">' + c.input({ placeholder: 'Search vendors', 'name': 'q' }) + c.input({ prefix: '₹', value: '5,00,000', mono: true }) + c.input({ value: 'tbd', invalid: true }) + '</div>'; }, { col: true }]],
      code: "E1.c.input({id:'amt', prefix:'₹', mono:true, value:E1.fmt.num(500000)})", dos: ['Always wrap in c.field for a visible label.'], donts: ['Do not use placeholder as the label.'], a11y: ['See field.'] },
    { name: 'select', title: 'Select', group: 'Forms', sig: "E1.c.select({name, id, options, value, disabled, invalid, attrs, describedBy})", summary: 'Native select with the house chevron.',
      props: [P('options', "string[] | [{value, label}]", '—', ''), P('value', 'string', '—', 'Selected value.')],
      demos: [['Default', function () { return '<div style="width:320px">' + c.select({ options: [{ value: 'A0', label: 'A0 Observe' }, { value: 'A2', label: 'A2 Propose' }, { value: 'A3', label: 'A3 Act reversible' }], value: 'A2' }) + '</div>'; }]],
      code: "E1.c.select({id:'grant', options:['A0','A1','A2'], value:'A2'})", dos: ['Use native select for ≤ 15 options.'], donts: ['Do not build custom listboxes without a need.'], a11y: ['Native semantics.'] },
    { name: 'textarea', title: 'Textarea', group: 'Forms', sig: "E1.c.textarea({name, id, value, rows, placeholder, invalid, disabled, attrs, describedBy})", summary: 'Multi-line text; resizes vertically.',
      props: [P('rows', 'number', '3', '')],
      demos: [['Default', function () { return '<div style="width:100%;max-width:480px">' + c.textarea({ placeholder: 'At least one sentence.', rows: 3 }) + '</div>'; }, { col: true }]],
      code: "E1.c.textarea({id:'reason', rows:4})", dos: ['Say what will happen to the text (recorded on the proof).'], donts: [], a11y: ['See field.'] },
    { name: 'checkbox', title: 'Checkbox', group: 'Forms', sig: "E1.c.checkbox({label, name, id, value, checked, disabled, note, attrs})", summary: 'A real input, visually hidden, with a visible ringed partner.',
      props: [P('label', 'string', '—', ''), P('note', 'string', '—', 'Second line.'), P('checked / disabled', 'bool', 'false', '')],
      demos: [['Default', function () { return '<div>' + c.checkbox({ label: 'Three-way match verified', checked: true }) + c.checkbox({ label: 'GST 2B reconciled', note: 'All 4 invoices appear in GSTR-2B for August 2026.' }) + c.checkbox({ label: 'Disabled', disabled: true }) + '</div>'; }]],
      code: "E1.c.checkbox({id:'match', label:'Three-way match verified', checked:true})", dos: [], donts: ['Do not use a checkbox to approve a write; use the gate button.'], a11y: ['Native checkbox; focus ring on the visible box.'] },
    { name: 'radio', title: 'Radio', group: 'Forms', sig: "E1.c.radio({label, name, id, value, checked, disabled, note, attrs})", summary: 'One of a set. Use the same name.',
      props: [P('name', 'string', '—', 'Required to group.')],
      demos: [['Default', function () { return '<div role="radiogroup" aria-label="Route">' + c.radio({ name: 'route', label: 'Route to Sovereign Mid (Mumbai)', note: 'Certified to material', checked: true }) + c.radio({ name: 'route', label: 'Raise through the human-required gate' }) + '</div>'; }]],
      code: "E1.c.radio({name:'route', value:'mid', label:'Sovereign Mid', checked:true})", dos: ['Wrap in a radiogroup with a label.'], donts: [], a11y: ['Native radio; arrow keys move within the group.'] },
    { name: 'toggle', title: 'Toggle', group: 'Forms', sig: "E1.c.toggle({label, name, id, checked, disabled, note, attrs})", summary: 'A switch for a setting that applies immediately.',
      props: [P('checked', 'bool', 'false', '')],
      demos: [['Default', function () { return '<div>' + c.toggle({ label: 'Notify the controller after every commit', checked: true }) + c.toggle({ label: 'Require dual control above ₹5,00,000', note: 'A declaration change; itself a governed write.' }) + '</div>'; }]],
      code: "E1.c.toggle({id:'notify', label:'Notify after every commit', checked:true})", dos: ['Use for immediate settings.'], donts: ['Do not use a toggle for a governance change without saying it is a governed write.'], a11y: ['role="switch" on a native checkbox.'] },
    { name: 'searchBox', title: 'Search box', group: 'Forms', sig: "E1.c.searchBox({name, id, value, placeholder, kbd, label, attrs})", summary: 'Search input with an icon and an optional key hint.',
      props: [P('kbd', 'string', '—', 'Shows a key hint.'), P('label', 'string', 'placeholder', 'Accessible name.')],
      demos: [['Default', function () { return '<div style="width:360px">' + c.searchBox({ placeholder: 'Search approvals', kbd: '/' }) + '</div>'; }]],
      code: "E1.c.searchBox({placeholder:'Search objects', value:q.q})", dos: ['Reflect the query in the URL.'], donts: [], a11y: ['role="search"; input labelled.'] },

    /* ---------- Brand ---------- */
    { name: 'disc', title: 'Disc', group: 'Brand', sig: "E1.c.disc({size, variant, label})", summary: 'The brand disc — a true circle, flat clay. One per surface. Variants are the Brand Book derivations used in UI.',
      props: [P('size', 'number', '12', 'Pixels.'), P('variant', "'mark'|'gate'|'aperture'|'orbit'|'eclipse'|'trail'", "'mark'", ''), P('label', 'string', '—', 'Makes it an image with a name; otherwise decorative.')],
      demos: [['Variants', function () { return ['mark', 'gate', 'aperture', 'orbit', 'eclipse', 'trail'].map(function (v) { return '<div style="display:flex;flex-direction:column;align-items:center;gap:8px;width:90px">' + c.disc({ variant: v, size: v === 'trail' ? 18 : 36 }) + '<code style="font-size:11px">' + v + '</code></div>'; }).join(''); }, { style: 'gap:20px' }]],
      code: "E1.c.disc({variant:'aperture', size:48})", dos: ['Use at element scale (under 2U) or page scale, nothing between.'], donts: ['Do not place a disc on a screen that uses coloured status dots.', 'Do not use two derivations on one surface.'], a11y: ['Decorative unless labelled.'] },
    { name: 'icon', title: 'Icon', group: 'Brand', sig: "E1.c.icon(name, size, {label, cls})", summary: 'Inline SVG from the house set. See Iconography for all ' + c.iconNames().length + '.',
      props: [P('name', 'string', '—', 'Icon or alias.'), P('size', 'number', '16', ''), P('label', 'string', '—', 'Gives role="img" and a name; otherwise aria-hidden.')],
      demos: [['Doors', function () { return ['work', 'records', 'agents', 'assurance', 'book'].map(function (n) { return c.icon(n, 24); }).join(''); }, { style: 'gap:20px' }]],
      code: "E1.c.icon('assurance', 20)", dos: ['Pair with text.'], donts: ['Do not use an icon alone for a state.'], a11y: ['Decorative by default.'] },

    /* ---------- Overlays (core) ---------- */
    /* ---------- Console vocabulary (v2.0) ---------- */
    { name: 'verdict', v2: true, title: 'Verdict', group: 'Console vocabulary', sig: "E1.c.verdict(kind, label, {icon, strong})", summary: 'A bordered result word for a check, a run or a reconciliation — Reconciled, Conditional, Blocked. The word carries the meaning; the border only groups it.',
      props: [P('kind', "'pass'|'clean'|'conditional'|'warn'|'watch'|'fail'|'blocked'|'info'|'na' | state", '—', 'Mapped to one of the six statuses.'), P('label', 'string', '—', 'The result in words. Required.'), P('icon', 'icon name', '—', 'Optional leading icon.'), P('strong', 'bool', 'false', 'The large headline form under a page title.')],
      demos: [['Kinds', function () { return c.verdict('pass', 'Passed', { icon: 'check' }) + c.verdict('clean', 'Reconciled · 0.04%') + c.verdict('conditional', 'Conditional') + c.verdict('watch', 'Licence watch') + c.verdict('blocked', 'Blocked') + c.verdict('info', 'Running') + c.verdict('na', 'Not applicable'); }],
        ['Strong', function () { return c.verdict('clean', 'Chain continuous · seq 1–4,112', { icon: 'check', strong: true }) + c.verdict('warn', 'Two approvals expire today', { strong: true }); }]],
      code: "E1.c.verdict('clean', 'Reconciled · 0.04%', {icon:'check'})", dos: ['Use for the result of a check, a nightly run or a reconciliation.', 'Keep the label short and specific: a number beats an adjective.'], donts: ['Do not use a verdict for the outcome of a governed write; use c.outcome().', 'Do not colour a verdict clay.'], a11y: ['The label is real text; the border and icon are decoration (the icon is aria-hidden).'] },
    { name: 'cost', v2: true, title: 'Cost', group: 'Console vocabulary', sig: "E1.c.cost(amount, {decimals, note, free})", summary: 'The rupee cost of one metered action, in mono with a quiet ₹. Zero is stated, in the good tone — a refusal costs ₹0.',
      props: [P('amount', 'number', '—', 'Rupees. Paise are shown when present.'), P('decimals', 'number', 'auto', '2 when the amount has paise, else 0.'), P('note', 'string', '—', 'A short suffix, e.g. “per month”.'), P('free', 'bool', 'amount === 0', 'Force or suppress the free treatment.')],
      demos: [['Default', function () { return c.cost(1.2) + c.cost(18.4) + c.cost(240, { note: 'per month' }) + c.cost(0); }]],
      code: "E1.c.cost(1.2)   // ₹ 1.20\nE1.c.cost(0)     // ₹ 0, free", dos: ['Show the cost beside the action that incurs it, before the person commits.'], donts: ['Do not round a metered price to hide paise.', 'Do not use c.cost for totals on an invoice; use c.amount().'], a11y: ['The ₹ is text; the title attribute states the full amount and whether it is metered.'] },
    { name: 'attention', v2: true, title: 'Needs your attention', group: 'Console vocabulary', sig: "E1.c.attention(items, {empty})", summary: 'The list of things waiting on this person: one action per row, oldest first, with the facts a decision rests on in a mono meta line.',
      props: [P('items', 'array', '[]', '{title, href, kind, icon, gate, badge, body, meta, metaMono, actions, waiting}.'), P('item.gate', 'bool', 'false', 'Draws the gate glyph: this row is a human decision.'), P('item.meta', 'html | html[]', '—', 'c.who, c.channel, c.gateDots, c.cost, c.countdown …'), P('item.actions', '{label, href, kind} | array | html', '—', 'One primary action per row.'), P('o.empty', 'c.empty() props', '—', 'Shown when there are no items.')],
      demos: [['In a card', function () { return '<div style="width:100%">' + c.card({ title: 'Needs your attention', flush: true, body: c.attention([
          { kind: 'Approval waiting for you', gate: true, title: 'Submit invoice SINV-2026-01187 · ACME Textiles', href: '#/work/decide/OB-2026-0412', badge: c.badge('info', 'Waiting for you'), body: 'ar-agent proposes ₹2,40,000. All seven gates passed; above ₹2,00,000 a second person approves.', meta: [c.who('Priya Nair'), c.channel('Web'), c.gateDots(['passed', 'passed', 'passed', 'passed', 'passed', 'passed', 'passed']), c.cost(1.2), c.countdown(E1.ahead(192), { bar: true })], actions: [{ label: 'Review', href: '#/work/decide/OB-2026-0412', kind: 'primary' }] },
          { kind: 'Refusal to read', icon: 'refuse', title: 'Not done — credit limit · #4,098', href: '#/work/not-done/4098', body: 'Exposure after this invoice would be ₹4,20,000 against a ₹3,00,000 limit.', meta: [c.channel('Agent'), c.cost(0)], actions: [{ label: 'Open', href: '#/work/not-done/4098' }] }
        ]) }) + '</div>'; }, { col: true }],
        ['Empty', function () { return '<div style="width:100%">' + c.card({ title: 'Needs your attention', flush: true, body: c.attention([]) }) + '</div>'; }, { col: true }]],
      code: "E1.c.card({ title:'Needs your attention', flush:true, body: E1.c.attention([{ gate:true, kind:'Approval waiting for you', title:'Submit invoice SINV-2026-01187', href:'#/work/decide/OB-2026-0412', meta:[E1.c.who('Priya Nair'), E1.c.cost(1.2)], actions:[{label:'Review', href:'#/work/decide/OB-2026-0412', kind:'primary'}] }]) })",
      dos: ['Order oldest first.', 'Give each row exactly one primary action.', 'Put the numbers a person decides on in the meta line.'], donts: ['Do not approve from this list; the action opens the decision.', 'Do not mix tenants in one list.'], a11y: ['A <ul> of items; each title is a link. The gate glyph is aria-hidden and the kind is written as text.'] },
    { name: 'miniHead', v2: true, title: 'Consequence strip', group: 'Console vocabulary', sig: "E1.c.miniHead(cells, {lg})", summary: 'Two to five label-and-value cells in one bordered row — what a decision changes, how far it reaches, whether it can be undone, what it costs.',
      props: [P('cells', '{label, value | html, note}[]', '—', '2 to 5 cells.'), P('lg', 'bool', 'false', 'Larger values, for the top of a Decide screen.')],
      demos: [['Default', function () { return '<div style="width:100%">' + c.miniHead([{ label: 'Changes', value: '3 fields' }, { label: 'Blast radius', value: 'One counterparty' }, { label: 'Undo', value: 'Reversible', note: '24 h' }, { label: 'Cost', html: c.cost(1.2) }]) + '</div>'; }, { col: true }],
        ['Large', function () { return '<div style="width:100%">' + c.miniHead([{ label: 'Amount', value: '₹2,40,000' }, { label: 'Gates', html: c.gateDots(['passed', 'passed', 'passed', 'passed', 'passed', 'passed', 'passed']) }, { label: 'Expires', html: c.countdown(E1.ahead(192)) }], { lg: true }) + '</div>'; }, { col: true }]],
      code: "E1.c.miniHead([{label:'Changes', value:'3 fields'}, {label:'Undo', value:'Reversible', note:'24 h'}, {label:'Cost', html:E1.c.cost(1.2)}])", dos: ['Put it directly under the title of a decision.'], donts: ['Do not use it for more than five facts; use c.kv().'], a11y: ['A <dl>: each cell is a <dt>/<dd> pair.'] },
    { name: 'gateCells', v2: true, title: 'Gate cells', group: 'Console vocabulary', sig: "E1.c.gateCells(list, {title, suite, min})", summary: 'What we tested: one cell per declared gate with its id, name and result as a word. The compact companion to c.gates().',
      props: [P('list', '{id, name, result}[]', '—', 'result passed|failed|pending|waiting|running|skipped|not_run.'), P('title', 'string | false', "'What we tested'", 'Head label; false hides the head.'), P('suite', 'string', '—', 'Policy or suite version, in mono.'), P('min', 'number', '—', 'Minimum cell width in px.')],
      demos: [['All passed', function () { return '<div style="width:100%">' + c.gateCells(S.gates, { suite: 'erp.ar v7 · policy v11' }) + '</div>'; }, { col: true }],
        ['One failed, one skipped', function () { return '<div style="width:100%">' + c.gateCells(S.gatesRefused, { suite: 'erp.ar v7 · policy v11' }) + '</div>'; }, { col: true }]],
      code: "E1.c.gateCells(gates, {suite:'erp.ar v7 · policy v11'})", dos: ['Show every declared gate, including skipped ones.'], donts: ['Do not replace the full c.gates() list on a Decide screen; cells summarise it.'], a11y: ['A list; every cell states its result in words, never by colour alone.'] },
    { name: 'gateDots', v2: true, title: 'Gate dots', group: 'Console vocabulary', sig: "E1.c.gateDots(list)", summary: 'One square per gate for a dense queue row. The summary sentence is the accessible name and the tooltip.',
      props: [P('list', "string[] | {result}[]", '—', 'passed|failed|pending|waiting|running|skipped|not_run.')],
      demos: [['Default', function () { return c.gateDots(['passed', 'passed', 'passed', 'passed', 'passed', 'passed', 'passed']) + c.gateDots(['passed', 'passed', 'passed', 'passed', 'failed', 'passed', 'skipped']) + c.gateDots(['passed', 'passed', 'passed', 'waiting']); }]],
      code: "E1.c.gateDots(['passed','passed','waiting'])  // “2 of 3 gates passed, 1 waiting”", dos: ['Use in rows where a full gate list will not fit.'], donts: ['Do not use gate dots without a way to open the full list.'], a11y: ['role="img" with the summary as aria-label, e.g. “6 of 7 gates passed, 1 failed”.'] },
    { name: 'letter', v2: true, title: 'Letter chip', group: 'Console vocabulary', sig: "E1.c.letter(ch, {door, label, size})", summary: 'A single initial on a ramp tone — a door, a pack or a product line. Never a status, and never on its own without a word or a label.',
      props: [P('ch', 'string', '—', 'First character is used, upper-cased.'), P('door', "'work'|'records'|'agents'|'assurance'|'reference'", '—', 'Uses the door ramp tone.'), P('label', 'string', '—', 'Accessible name and tooltip when no word sits beside it.'), P('size', "'lg'", '—', 'Larger chip.')],
      demos: [['Packs', function () { return c.letter('L', { label: 'ledger1' }) + '<span>ledger1</span>' + c.letter('I', { label: 'invoice1' }) + '<span>invoice1</span>' + c.letter('C', { label: 'collect1' }) + '<span>collect1</span>'; }], ['Sizes', function () { return c.letter('W', { door: 'work', label: 'Work' }) + c.letter('W', { door: 'work', label: 'Work', size: 'lg' }); }]],
      code: "E1.c.letter('L', {label:'ledger1'})", dos: ['Pair a chip with its word in lists and filters.'], donts: ['Do not use a letter chip to show a status or a level.'], a11y: ['With label the chip is titled and has a visually hidden name; without one it is aria-hidden, so the word beside it must be present.'] },
    { name: 'doorMark', v2: true, title: 'Door mark', group: 'Console vocabulary', sig: "E1.c.doorMark(door, {word, size})", summary: 'The door’s letter chip — W, R, A, S, X — optionally with the door name as a word, on the door’s ramp tone.',
      props: [P('door', "'work'|'records'|'agents'|'assurance'|'reference'", '—', 'Required.'), P('word', 'bool', 'false', 'Adds the door name.'), P('size', "'lg'", '—', 'Larger chip.')],
      demos: [['With the word', function () { return E1.DOORS.concat(['reference']).map(function (d) { return c.doorMark(d, { word: true }); }).join(''); }], ['Chip only', function () { return E1.DOORS.map(function (d) { return c.doorMark(d); }).join(''); }]],
      code: "E1.c.doorMark('work', {word:true})", dos: ['Use to say which door a search result or notification belongs to.'], donts: ['Do not invent a fifth door letter.'], a11y: ['Without word, the door name is the chip’s accessible name.'] },
    { name: 'tag', v2: true, title: 'Tag', group: 'Console vocabulary', sig: "E1.c.tag(text, {icon})", summary: 'A mono label on the sunken ground for a technical kind — a write type, a DocType, a declaration block, a version.',
      props: [P('text', 'string', '—', 'Escaped.'), P('icon', 'icon name', '—', 'Optional leading icon.')],
      demos: [['Default', function () { return c.tag('erp.sales_invoice.submit') + c.tag('Custom Field · Customer') + c.tag('policy v11', { icon: 'layers' }) + c.tag('Tokens v2.0'); }]],
      code: "E1.c.tag('erp.sales_invoice.submit')", dos: ['Use for identifiers a developer or auditor will search for.'], donts: ['Do not use a tag for a status; use c.badge().', 'Do not use a tag as a link; use c.chip().'], a11y: ['Plain text; the icon is aria-hidden.'] },
    { name: 'channel', v2: true, title: 'Channel', group: 'Console vocabulary', sig: "E1.c.channel(name, {icon})", summary: 'Where a request came from or where a person will be reached: Web, API, WhatsApp, Voice, Email, Agent, Connector, MCP.',
      props: [P('name', 'string', '—', 'The channel in words.'), P('icon', 'icon name | false', 'by name', 'Override or remove the icon.')],
      demos: [['Every channel', function () { return ['Web', 'API', 'WhatsApp', 'Voice', 'Email', 'Agent', 'Connector', 'MCP'].map(function (n) { return c.channel(n); }).join(''); }]],
      code: "E1.c.channel('WhatsApp')", dos: ['Show the channel next to who asked.'], donts: ['Do not show a channel the tenant has not consented to.'], a11y: ['The channel name is text; the icon is aria-hidden.'] },
    { name: 'honesty', v2: true, title: 'Honesty mark', group: 'Console vocabulary', sig: "E1.c.honesty(text)", summary: 'A small mono chip that says what kind of number sits beside it — ₹0, [measured], [modelled], sample data.',
      props: [P('text', 'string', '—', 'Short. Brackets for provenance, ₹0 for unbilled.')],
      demos: [['Marks', function () { return c.honesty('₹0') + c.honesty('[measured]') + c.honesty('[modelled]') + c.honesty('sample data'); }], ['Beside a stat', function () { return '<div style="width:280px">' + c.stat({ label: 'Refusals this month', value: '171', aside: c.honesty('₹0'), note: 'Recorded at ₹0, never billed.' }) + '</div>'; }]],
      code: "E1.c.stat({ label:'Refusals this month', value:'171', aside: E1.c.honesty('₹0') })", dos: ['Mark every modelled figure as modelled.'], donts: ['Do not use it for a status or a warning.'], a11y: ['Plain text, read in place.'] },
    { name: 'asOf', v2: true, title: 'As-of stamp', group: 'Console vocabulary', sig: "E1.c.asOf(time, {state, label})", summary: 'How fresh a number is: a dot and a time. Stale, not updating and not measured are said in words to screen readers and in the tooltip.',
      props: [P('time', 'string', '—', 'Pre-formatted, e.g. “14:05”.'), P('state', "'fresh'|'old'|'dead'|'none'", "'fresh'", 'Freshness.'), P('label', 'string', "'As of'", 'Tooltip prefix.')],
      demos: [['States', function () { return c.asOf('14:05') + c.asOf('Yesterday 23:10', { state: 'old' }) + c.asOf('21 Sep, 02:10', { state: 'dead' }) + c.asOf('—', { state: 'none' }); }]],
      code: "E1.c.asOf('14:05')  ·  E1.c.asOf('Yesterday 23:10', {state:'old'})", dos: ['Put it in a stat foot or a table caption for any number read from another system.'], donts: ['Do not show a stale number without saying it is stale.'], a11y: ['The state word is in a visually hidden span and in the title.'] },
    { name: 'who', v2: true, title: 'Who', group: 'Console vocabulary', sig: "E1.c.who(name, {kind})", summary: 'Initials in an ink circle and a name, for dense rows. Use c.actor() where the kind and role must be read.',
      props: [P('name', 'string', '—', 'Full name.'), P('kind', "'person'|'agent'", "'person'", 'Agents get the agent glyph.')],
      demos: [['Default', function () { return c.who('Venkat Raman') + c.who('Priya Nair') + c.who('ar-agent', { kind: 'agent' }); }]],
      code: "E1.c.who('Priya Nair')", dos: ['Use in queue rows, attention lists and tables.'], donts: ['Do not use for the proposer on a Decide screen; that is c.actor() with the kind in words.'], a11y: ['The name is text; the avatar is decorative.'] },
    { name: 'minibar', v2: true, title: 'Mini bar', group: 'Console vocabulary', sig: "E1.c.minibar(value, max, {state, held, label})", summary: 'A thin share-of-whole bar — a budget used, a quota held. The percentage is its accessible name; the number is always stated beside it.',
      props: [P('value', 'number', '—', ''), P('max', 'number', '100', ''), P('state', "'good'|'warning'|'critical'|'ink'", '—', 'Meter tone by default.'), P('held', 'number', '—', 'A second, lighter segment (reserved, not yet used).'), P('label', 'string', '—', 'Prefix for the accessible name.')],
      demos: [['Default', function () { return '<div class="e1-stack" style="width:280px">' + [[71, 100, {}, '₹69,900 of ₹98,000 budget'], [212, 400, { held: 60 }, '212 of 400 drafts, 60 held'], [92, 100, { state: 'warning' }, '92% of the September cap'], [11, 11, { state: 'ink' }, '11 of 11 steps']].map(function (x) { return '<div><div class="e1-caption e1-muted" style="margin-bottom:4px">' + esc(x[3]) + '</div>' + c.minibar(x[0], x[1], Object.assign({ label: x[3] }, x[2])) + '</div>'; }).join('') + '</div>'; }]],
      code: "E1.c.minibar(71, 100, {label:'Budget used'})", dos: ['State the number in words next to the bar.'], donts: ['Do not use a mini bar for progress through steps; use c.progress().'], a11y: ['role="img" with “label: 71%”.'] },

    { name: 'modal', title: 'Modal dialog', group: 'Overlays', sig: "E1.modal({title, body, actions:[{label, kind, href, onClick(e, close, el), close}], size, eyebrow, dismissable, onClose})", summary: 'Focus trapped, Escape closes, the scrim closes, focus returns to the trigger. onClick returning false keeps it open.',
      props: [P('title', 'string', '—', ''), P('body', 'html', '—', ''), P('actions', 'array', '—', 'The last action defaults to primary.'), P('size', "'sm'|'md'|'lg'", "'md'", ''), P('dismissable', 'bool', 'true', 'false disables scrim and Escape.')],
      demos: [['Live', function () { return c.button('Open a decision dialog', { kind: 'secondary', attrs: 'data-action="ds-demo-modal"' }) + c.button('Open a confirm', { kind: 'ghost', attrs: 'data-action="ds-demo-confirm"' }); }]],
      code: "E1.modal({ title:'Reject this write', body:E1.c.field('Reason', E1.c.textarea({id:'r'}), {id:'r', required:true}),\n  actions:[{label:'Cancel', kind:'ghost'}, {label:'Reject', kind:'danger', onClick:(e, close, el) => { if (el.querySelector('#r').value.length < 12) return false; }}] })",
      dos: ['Use for a decision that needs a sentence.'], donts: ['Do not open a modal from a modal.'], a11y: ['role="dialog" aria-modal; labelled by its title.'] },
    { name: 'drawer', title: 'Drawer and sheet', group: 'Overlays', sig: "E1.drawer({title, body, actions, side:'right'|'left'|'bottom', width, eyebrow, onClose}) · E1.sheet({...})", summary: 'A side panel for detail without leaving the list; a bottom sheet on phones.',
      props: [P('side', "'right'|'left'|'bottom'", "'right'", ''), P('width', 'CSS length', '520px', '')],
      demos: [['Live', function () { return c.button('Open a drawer', { attrs: 'data-action="ds-demo-drawer"' }) + c.button('Open a bottom sheet', { kind: 'ghost', attrs: 'data-action="ds-demo-sheet"' }); }]],
      code: "E1.drawer({ title:'Proof #4,101', body: E1.c.seal({...}) })", dos: ['Keep the list visible behind it.'], donts: ['Do not put a multi-step flow in a drawer.'], a11y: ['Same contract as the modal.'] },
    { name: 'toast', title: 'Toast', group: 'Overlays', sig: "E1.toast(message, kind, {title, action:{label, href}, timeout})", summary: 'An outcome announced once: “Approved. Posted. Proof 4101.” Polite by default; critical toasts are alerts.',
      props: [P('message', 'string', '—', ''), P('kind', "status", "'neutral'", ''), P('title', 'string', '—', ''), P('action', '{label, href}', '—', ''), P('timeout', 'ms', '4200', '0 keeps it until dismissed.')],
      demos: [['Live', function () { return c.button('Approved', { attrs: 'data-action="ds-demo-toast" data-value="good"' }) + c.button('Not done', { attrs: 'data-action="ds-demo-toast" data-value="neutral"' }) + c.button('Info', { attrs: 'data-action="ds-demo-toast" data-value="info"' }); }]],
      code: "E1.toast('Approved. Posted. Proof 4101.', 'good', {action:{label:'Open the record', href:'#/assurance/proof'}})", dos: ['State the outcome and the proof number.'], donts: ['Do not use a toast for a refusal the person must act on; show the refusal card.'], a11y: ['role="status" (polite) or role="alert" for critical.'] },
    { name: 'command-palette', title: 'Command palette', group: 'Overlays', sig: "E1.palette() · E1.cmdAdd({id, label, hint, icon, group, keywords, run})", summary: 'Ctrl/Cmd+K. Fuzzy search over every registered route by title, plus actions. Keyboard navigable.',
      props: [P('run', "string href | function", '—', 'For cmdAdd.'), P('group', 'string', "'Screens'", 'Heading in the list.'), P('keywords', 'string', '—', 'Extra match text.')],
      demos: [['Live', function () { return c.button('Open the palette', { icon: 'search', attrs: 'data-action="palette"' }) + '<span class="e1-caption e1-muted">or press ' + c.kbd('Ctrl', 'K') + '</span>'; }]],
      code: "E1.cmdAdd({ id:'new-decl', label:'New declaration', group:'Actions', icon:'plus', run:'#/records/studio?new=1' })", dos: ['Give every route a real title; the palette lists them.'], donts: ['Do not register destructive actions in the palette.'], a11y: ['combobox + listbox with aria-activedescendant.'] }
  ];
  E1.dsRegistry = REG;
  var REGBY = {}; REG.forEach(function (r) { REGBY[r.name] = r; });
  REG.forEach(function (r) { E1.cmdAdd({ id: 'cmp:' + r.name, label: r.title, hint: '/reference/components/' + r.name, icon: 'grid', group: 'Components', keywords: r.name + ' component ' + r.group, run: '#/reference/components/' + r.name }); });

  E1.action('ds-demo-modal', function () {
    E1.modal({ eyebrow: 'OB-2026-0412 · erp.sales_invoice.submit', title: 'Reject this write', size: 'md',
      body: '<p>Rejecting records your decision on the proof. The agent is told the reason and nothing is written to ERPNext.</p><div style="margin-top:16px">' + c.field('Reason', c.textarea({ id: 'dm-r', placeholder: 'At least one sentence.', describedBy: 'dm-r-msg' }), { id: 'dm-r', required: true, help: 'Recorded on the proof. Written once, never edited.' }) + '</div>',
      actions: [{ label: 'Cancel', kind: 'ghost' }, { label: 'Reject and record', kind: 'danger', onClick: function (e, close, el) {
        var v = el.querySelector('#dm-r').value.trim();
        if (v.split(/\s+/).length < 4) { var f = el.querySelector('.e1-field'); f.classList.add('is-invalid'); var m = f.querySelector('#dm-r-msg'); m.className = 'e1-field__error'; m.setAttribute('role', 'alert'); m.innerHTML = c.icon('alert', 12) + '<span>A rejection needs at least one sentence, so the proposer knows what to change.</span>'; el.querySelector('#dm-r').setAttribute('aria-invalid', 'true'); return false; }
        E1.toast('Rejected. Recorded on proof #4,113. Nothing was written to ERPNext.', 'good');
      } }] });
  });
  E1.action('ds-demo-confirm', function () { E1.confirm({ title: 'Reverse this write?', body: '<p>This creates a compensating write, itself governed, inside the 30-day window.</p>', confirmLabel: 'Reverse this write', kind: 'gate', onConfirm: function () { E1.toast('Reversal proposed. It needs one approval.', 'info'); } }); });
  E1.action('ds-demo-drawer', function () { E1.drawer({ eyebrow: 'Assurance', title: 'Proof #4,101', body: c.seal({ seq: 4101, writeType: 'erp.sales_invoice.submit', outcome: 'committed', blast: 2, reversible: '24 h', amount: 240000, approver: 'Venkat Raman', actor: { name: 'ar-agent', kind: 'agent' }, at: '24 Sep 2026, 15:02 IST', digest: S.hash4101, prev: S.hash4100 }), actions: [{ label: 'Close', kind: 'ghost' }, { label: 'Open proof #4,101', kind: 'primary', href: '#/assurance/proof/4101' }] }); });
  E1.action('ds-demo-sheet', function () { E1.sheet({ title: 'Approve on the phone', body: '<p class="e1-muted">The diff collapses to changed fields only. Show all fields expands it.</p><div style="margin-top:12px">' + c.diff(S.diff) + '</div>', actions: [{ label: 'Reject', kind: 'danger' }, { label: 'Approve and commit', kind: 'gate' }] }); });
  E1.action('ds-demo-toast', function (el) { var k = el.getAttribute('data-value'); E1.toast(k === 'good' ? 'Approved. Posted. Proof #4,101.' : k === 'neutral' ? 'Not done — credit limit. Nothing was changed; this refusal is recorded as #4,098.' : 'Chain continuous · seq 1–4,112 · 19 of 23 write types.', k, k === 'good' ? { action: { label: 'Open the proof', href: '#/assurance/proof/4101' } } : k === 'neutral' ? { action: { label: 'Open', href: '#/work/not-done/4098' } } : {}); });

  var GROUPS = ['Page structure', 'Actions', 'Status and identity', 'Data', 'Governance', 'Console vocabulary', 'States', 'Navigation', 'Forms', 'Brand', 'Overlays'];
  var PREVIEW = {
    pageHeader: function () { return '<span class="e1-text-section">Approvals</span>'; }, button: function () { return c.button('Approve and commit', { kind: 'gate', size: 'sm' }) + c.button('Reject', { kind: 'danger', size: 'sm' }); },
    badge: function () { return c.badge('good', 'Committed') + c.badge('neutral', 'Not done'); }, chip: function () { return c.chip('Batch', { selected: true }) + c.chip('Mill 2'); }, level: function () { return c.level('L1') + c.level('L2', { short: true }); },
    avatar: function () { return c.avatar('Venkat Raman', { size: 'sm' }) + c.avatar('Agent', { kind: 'agent', size: 'sm' }); }, actor: function () { return c.actor({ name: 'ar-agent', kind: 'agent', size: 'sm' }); },
    hash: function () { return c.hash(S.hash4101, { copy: false }); }, amount: function () { return c.amount(2764300, { strong: true }); }, stat: function () { return '<span class="e1-bignum" style="font-size:24px">1,284</span><span class="e1-caption e1-muted">writes</span>'; },
    blast: function () { return c.blast(3, { compact: true }); }, reversible: function () { return c.reversible('24 h') + c.reversible(false); }, outcome: function () { return c.outcome('committed') + c.outcome('refused'); }, locked: function () { return c.icon('lock', 18) + '<span class="e1-caption">Arrives at L2 · Preview as L2</span>'; }, autonomy: function () { return c.autonomy('A2', { compact: true }); }, countdown: function () { return c.countdown(E1.ahead(38)); },
    progress: function () { return '<div style="width:100%">' + c.progress(7, 11) + '</div>'; }, progressArc: function () { return c.progressArc(64, 100, { size: 44 }); }, sparkline: function () { return '<div style="width:120px">' + c.sparkline([3, 5, 4, 7, 6, 9, 11]) + '</div>'; },
    disc: function () { return c.disc({ size: 22 }) + c.disc({ variant: 'gate', size: 22 }) + c.disc({ variant: 'aperture', size: 22 }); }, icon: function () { return ['work', 'records', 'agents', 'assurance'].map(function (n) { return c.icon(n, 20); }).join(''); },
    kbd: function () { return c.kbd('Ctrl', 'K'); }, segmented: function () { return c.segmented([{ id: 'a', label: '7d' }, { id: 'b', label: '30d' }], 'b', { size: 'sm' }); }, input: function () { return '<div style="width:100%">' + c.input({ prefix: '₹', value: '5,00,000', mono: true }) + '</div>'; },
    checkbox: function () { return c.checkbox({ label: 'Verified', checked: true }); }, toggle: function () { return c.toggle({ label: 'Notify', checked: true }); }, radio: function () { return c.radio({ name: 'pv', label: 'Sovereign Mid', checked: true }); },
    gates: function () { return c.badge('good', '5 of 6 passed', { subtle: true }) + c.badge('critical', '1 failed', { subtle: true }); }, refusal: function () { return c.icon('refuse', 18, { cls: 'e1-tone--critical' }) + '<strong>Not done — credit limit</strong>'; },
    seal: function () { return c.icon('chain', 18) + '<span class="e1-caption">Hash-chained, not signed</span>'; }, chain: function () { return c.badge('good', 'Continuous', { icon: 'chain' }) + '<span class="e1-caption e1-muted">19 of 23 write types</span>'; },
    empty: function () { return c.icon('aperture', 18) + '<span class="e1-caption">Nothing is waiting for you</span>'; }, error: function () { return c.icon('alert', 18, { cls: 'e1-tone--critical' }) + '<span class="e1-caption">We cannot show your approvals</span>'; },
    tabs: function () { return '<span class="e1-tab is-active" style="height:28px">Waiting on me</span><span class="e1-tab" style="height:28px">Decided</span>'; }, filters: function () { return c.chip('Waiting on me', { selected: true, count: 4 }) + c.chip('Agent'); },
    stepper: function () { return '<span class="e1-caption">Author → <strong>Validate</strong> → Simulate → Certify</span>'; }, rungs: function () { return '<span class="e1-mono e1-caption">1 · 2 · <strong class="e1-tone--critical">3 ✕</strong> · … · 8 · 9</span>'; },
    verdict: function () { return c.verdict('clean', 'Reconciled', { icon: 'check' }) + c.verdict('blocked', 'Blocked'); }, cost: function () { return c.cost(1.2) + c.cost(0); },
    attention: function () { return c.icon('gate', 18) + '<span class="e1-caption">Oldest first · one action each</span>'; }, miniHead: function () { return '<span class="e1-caption e1-mono">CHANGES 3 · UNDO 24 h · ₹1.20</span>'; },
    gateCells: function () { return c.gateCells(S.gates.slice(0, 4), { title: false }); }, gateDots: function () { return c.gateDots(['passed', 'passed', 'passed', 'passed', 'failed', 'passed', 'skipped']); },
    letter: function () { return c.letter('L', { label: 'ledger1' }) + c.letter('I', { label: 'invoice1' }) + c.letter('C', { label: 'collect1' }); }, doorMark: function () { return c.doorMark('work', { word: true }); },
    tag: function () { return c.tag('erp.sales_invoice.submit'); }, channel: function () { return c.channel('WhatsApp') + c.channel('MCP'); }, honesty: function () { return c.honesty('₹0') + c.honesty('[measured]'); },
    asOf: function () { return c.asOf('14:05') + c.asOf('Yesterday', { state: 'old' }); }, who: function () { return c.who('Priya Nair'); }, minibar: function () { return '<div style="width:140px">' + c.minibar(71, 100) + '</div>'; },
    'command-palette': function () { return c.kbd('Ctrl', 'K') + '<span class="e1-caption e1-muted">Search every screen</span>'; }, toast: function () { return '<span class="e1-caption">Approved. Posted. Proof 4101.</span>'; },
    modal: function () { return c.icon('grid', 18) + '<span class="e1-caption">Focus-trapped dialog</span>'; }, drawer: function () { return c.icon('panel-left', 18) + '<span class="e1-caption">Right, left or bottom</span>'; }
  };

  reg('/reference/components', 'components', 'Components', function (p, q) {
    var body = '<div style="max-width:420px;margin-bottom:8px">' + c.searchBox({ id: 'cmp-q', placeholder: 'Filter components', label: 'Filter components', value: q.q || '' }) + '</div>' +
      GROUPS.map(function (g) {
        var items = REG.filter(function (r) { return r.group === g; });
        var id = 'g-' + g.toLowerCase().replace(/[^a-z]+/g, '-');
        return '<div class="cmp-group" data-group>' + sec(id, g, null, '<div class="e1-linkcards">' + items.map(function (r) {
          var prev = PREVIEW[r.name] ? PREVIEW[r.name]() : '<code class="e1-caption">E1.c.' + esc(r.name) + '()</code>';
          return '<a class="e1-linkcard" href="#/reference/components/' + esc(r.name) + '" data-name="' + esc((r.name + ' ' + r.title + ' ' + r.summary + (r.v2 ? ' v2 new' : '')).toLowerCase()) + '"><span class="e1-linkcard__top"><span class="e1-linkcard__t">' + esc(r.title) + '</span><span class="e1-row" style="gap:6px">' + (r.v2 ? c.tag('v2.0') : '') + '<code class="e1-caption">' + esc(r.name) + '</code></span></span><span class="e1-linkcard__d">' + esc(r.summary) + '</span><span class="e1-linkcard__prev" aria-hidden="true">' + prev + '</span></a>';
        }).join('') + '</div>') + '</div>';
      }).join('');
    return page({
      title: 'Components', lead: REG.length + ' components. Each is a string-returning helper on E1.c (overlays live on E1), each has its own page with live variants, props, do and do not, and accessibility notes. A component absent from this index does not exist.',
      actions: c.button('What is new in v2.0', { kind: 'secondary', href: '#/reference/components?q=v2', icon: 'filter' }) + c.button('Open the button page', { kind: 'primary', href: '#/reference/components/button', iconRight: 'arrow-right' }),
      top: '<div class="e1-grid e1-grid--4" style="margin-bottom:24px">' +
        c.stat({ label: 'Components', value: String(REG.length), note: 'Every one has a page, rendered live by its helper.' }) +
        c.stat({ label: 'New in v2.0', value: String(REG.filter(function (r) { return r.v2; }).length), badge: c.verdict('info', 'Console vocabulary'), note: 'Verdict to mini bar.', href: '#/reference/components?q=v2' }) +
        c.stat({ label: 'Groups', value: String(GROUPS.length), note: GROUPS.slice(0, 3).join(', ') + ' …' }) +
        c.stat({ label: 'E1.c helpers', value: String(c.names().length), aside: c.honesty('[measured]'), note: 'Counted from E1.c at render time.', foot: '<span>components.js</span>' + c.asOf(E1.fmt.time(new Date()).replace(' IST', '')) }) +
      '</div>',
      toc: GROUPS.map(function (g) { return { id: 'g-' + g.toLowerCase().replace(/[^a-z]+/g, '-'), label: g }; }),
      body: body
    });
  }, {
    keywords: 'components library ui kit',
    mount: function (el) {
      var input = el.querySelector('#cmp-q'); if (!input) return;
      function f() {
        var q = input.value.toLowerCase().trim();
        Array.prototype.forEach.call(el.querySelectorAll('[data-group]'), function (g) {
          var any = 0;
          Array.prototype.forEach.call(g.querySelectorAll('.e1-linkcard'), function (a) { var ok = !q || a.getAttribute('data-name').indexOf(q) >= 0; a.hidden = !ok; if (ok) any++; });
          g.hidden = !any;
        });
      }
      input.addEventListener('input', f); f();
    }
  });

  reg('/reference/components/:name', 'components', function (p) { var r = REGBY[p.name]; return r ? r.title : 'Component not found'; }, function (p) {
    var r = REGBY[p.name];
    if (!r) {
      return c.pageHeader({ title: 'There is no component called “' + p.name + '”', back: ['Components', '#/reference/components'] }) +
        c.empty({ title: 'Not in the registry', why: 'Every component in the system is listed on the index, and this name is not one of them.', fill: 'If the pattern already appears in three real screens, propose it with its signature first.', action: { label: 'Open the component index', href: '#/reference/components' } });
    }
    var i = REG.indexOf(r), prev = REG[i - 1], next = REG[i + 1];
    var demos = r.demos.map(function (d) { var o = d[2] || {}; return spec(d[0], d[1](), o); }).join('');
    var props = '<div class="e1-table-wrap"><table class="e1-table e1-props"><caption class="e1-sr">Props for ' + esc(r.title) + '</caption><thead><tr><th scope="col">Prop</th><th scope="col">Type</th><th scope="col">Default</th><th scope="col">Description</th></tr></thead><tbody>' +
      r.props.map(function (x) { return '<tr><th scope="row">' + esc(x[0]) + '</th><td><code>' + esc(x[1]) + '</code></td><td class="e1-mono">' + esc(x[2]) + '</td><td>' + esc(x[3]) + '</td></tr>'; }).join('') + '</tbody></table></div>';
    var related = REG.filter(function (x) { return x.group === r.group && x !== r; }).slice(0, 6);
    var body =
      sec('specimens', 'Specimens', 'Rendered live by the helper itself, in the current theme and density.', demos) +
      sec('usage', 'Usage', null, c.code(r.code, 'js', { title: r.sig })) +
      sec('props', 'Props', null, props) +
      (r.dos.length || r.donts.length ? sec('guidance', 'Do and do not', null, dodont(r.dos, r.donts)) : '') +
      sec('a11y', 'Accessibility', null, c.card({ body: '<ul class="e1-prose" style="margin:0;padding-left:18px">' + r.a11y.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul>' })) +
      (related.length ? sec('related', 'Related in ' + r.group, null, '<div class="e1-row">' + related.map(function (x) { return c.chip(x.title, { href: '#/reference/components/' + x.name }); }).join('') + '</div>') : '') +
      '<nav class="e1-row e1-row--between" aria-label="Previous and next component" style="margin-top:40px">' +
        (prev ? c.button(prev.title, { kind: 'secondary', href: '#/reference/components/' + prev.name, icon: 'arrow-left' }) : '<span></span>') +
        (next ? c.button(next.title, { kind: 'secondary', href: '#/reference/components/' + next.name, iconRight: 'arrow-right' }) : '<span></span>') + '</nav>';
    return page({
      title: r.title, eyebrow: 'Component · ' + r.group, lead: r.summary,
      meta: '<code class="e1-mono" style="font-size:12px;background:var(--bg-sunken);padding:3px 8px;border-radius:3px;overflow-wrap:anywhere">' + esc(r.sig) + '</code>',
      toc: [{ id: 'specimens', label: 'Specimens' }, { id: 'usage', label: 'Usage' }, { id: 'props', label: 'Props' }, { id: 'guidance', label: 'Do and do not' }, { id: 'a11y', label: 'Accessibility' }],
      body: body
    });
  }, { example: '/reference/components/button', crumbs: [['Reference', '#/reference/design-system'], ['Components', '#/reference/components']] });

  /* =========================================================================
     PATTERNS
     ========================================================================= */
  function miniDecide(compactPhone, noActions) {
    return '<div class="e1-stack">' +
      '<div class="e1-row e1-row--between e1-row--top"><div><p class="e1-label">OB-2026-0412 · erp.sales_invoice.submit</p><h3 class="e1-text-section" style="margin-top:4px">Submit invoice SINV-2026-01187 · ACME Textiles · ₹2,40,000</h3></div>' + c.countdown(E1.ahead(192), { label: 'Expires' }) + '</div>' +
      '<div class="e1-row" style="gap:16px">' + c.actor({ name: 'ar-agent', kind: 'agent', role: 'A2 Propose' }) + c.blast(2, { compact: !!compactPhone }) + c.reversible('24 h') + '</div>' +
      c.diff(S.diff.slice(0, compactPhone ? 5 : 7)) +
      (compactPhone ? '<p class="e1-caption">' + c.badge('good', '7 of 7 gates passed') + '</p>' : c.gates(S.gates, { version: 'erp.ar v7 · policy v11' })) +
      c.callout({ kind: 'info', title: 'Why this reached you', body: '<p>evaluate() returned allow at policy version 11. ar-agent is at A2 Propose, so a person approves before anything is written. You are in ar-approvers.</p>' }) +
      (noActions ? '' : '<div class="e1-row" style="gap:16px">' + c.button('Reject', { kind: 'danger', icon: 'reject', attrs: 'data-action="ds-demo-modal"' }) + c.button('Approve and commit', { kind: 'gate', attrs: 'data-action="ds-demo-toast" data-value="good"' }) + '</div>') + '</div>';
  }
  var PATTERNS = [
    { id: 'empty-states', title: 'Empty states', summary: 'An empty screen is a finding. Say what is missing, why, and what would fill it.', refs: ['empty', 'table'],
      rule: 'Every empty state takes three things: what this is, why it is empty, and what would fill it. An empty queue that explains itself is the difference between “working” and “broken”.',
      example: function () { return '<div class="e1-grid e1-grid--2" style="width:100%">' + c.empty({ title: 'Nothing is waiting for you', why: 'Agents are running at their declared autonomy; anything that needs a person will appear here.', action: { label: 'What arrives here', href: '#/records/write-types' } }) + c.empty({ title: 'No declaration yet', why: 'A module without a declaration has no screens, because there is nothing to render.', fill: 'Author the seven blocks in Studio, validate them, and a named person certifies the version.', action: { label: 'Open Studio', href: '#/records/studio' }, icon: 'file-text' }) + '</div>'; },
      dos: ['Link to the thing that would fill the screen.', 'For an empty Assurance door, say that the missing declaration is a finding.'], donts: ['Do not hide a door because it is empty.', 'Do not write “No data”, “Nothing here” or “Get started!”.'] },
    { id: 'error-states', title: 'Error states', summary: 'What failed, and — in the next sentence — what did not change.', refs: ['error', 'refusal', 'toast'],
      rule: 'A platform failure says both facts in order: the thing did not complete, and nothing was changed. If a person approved and the write then failed: “Your approval was recorded. The write itself did not complete, and nothing was changed. We have been paged.”',
      example: function () { return '<div class="e1-stack" style="width:100%">' + c.error({ title: 'We cannot show your approvals right now.', reassurance: 'Nothing has been approved in the meantime and nothing expires while this is down.', action: { label: 'Try again', href: '#/work/approvals' } }) + c.error({ title: 'Your approval was recorded. The write itself did not complete.', body: 'The live re-run disagreed with the sandbox (GATE.SANDBOX_DIVERGED), so the snapshot was restored.', reassurance: 'Nothing was changed in ERPNext. We have been paged.', code: 'GATE.SANDBOX_DIVERGED', action: { label: 'Open the proof', href: '#/assurance/proof' } }) + '</div>'; },
      dos: ['Pause expiry during an outage and say so.'], donts: ['Do not show a stack trace to an approver.', 'Do not apologise in place of an explanation.'] },
    { id: 'refusal', title: 'Refusal', summary: 'A correct refusal is the product working. It names the rule, the numbers and the next action.', refs: ['refusal', 'rungs'],
      rule: 'Every refusal code maps to exactly one operator action. A refusal code whose screen offers no next action has not been finished. PLATFORM.* refusals use the blunt copy: this is our failure, not a rule.',
      example: function () { return '<div class="e1-stack" style="width:100%">' + c.refusal({ code: 'GATE.PRECONDITION_FAILED', title: 'Not done — credit limit', ruleName: 'Customer credit limit', version: 'erp.ar v7', rule: 'An invoice may not take a customer above their credit limit.', numbers: [{ label: 'Credit limit', value: '₹3,00,000' }, { label: 'Exposure after this invoice', value: '₹4,20,000' }], change: 'Reduce the invoice by ₹1,20,000, or request a limit change.', action: { label: 'Request a limit change', href: '#/work/request/erp.credit_limit.change' }, proofHref: '#/assurance/proof/4098', at: '24 Sep 2026, 14:07 IST · #4,098' }) + c.rungs({ outcome: 'refused', at: 3, compact: true }) + '</div>'; },
      dos: ['Title it in the words of the thing tried: “Not done — credit limit”.', 'Show the code once, small, because support asks for it.'], donts: ['Do not colour a refusal red; it is a correct, free outcome. Use c.outcome(\'refused\') — neutral “Not done”.', 'Do not render a refusal as a toast that says the run failed.', 'Do not say “insufficient permissions”; say “You proposed this, so you cannot also approve it. Send it to: …”.'] },
    { id: 'outcomes', title: 'Outcomes', summary: 'Three outcomes, no warn: Committed, Not done, Waiting on a person — plus Expired and Platform failure.', refs: ['outcome', 'refusal', 'chain'],
      rule: 'Every governed write ends in exactly one outcome. Committed is good. Not done (a refusal) is neutral: it is a correct, free outcome that meters at zero, never an error, so it is never red. Waiting on a person (an escalation) is warning until a named person decides. PLATFORM.* is our failure and is the only critical outcome. There is no “succeeded with warnings”.',
      example: function () { return '<div class="e1-stack" style="width:100%">' + '<div class="e1-row">' + c.outcome('committed') + c.outcome('refused') + c.outcome('escalated') + c.outcome('expired') + c.outcome('platform') + '</div>' + c.table({ caption: 'Recent outcomes', dense: true, columns: [{ key: 'seq', label: 'Proof', mono: true }, { key: 'wt', label: 'Write type', mono: true }, { key: 'o', label: 'Outcome', render: function (r) { return c.outcome(r.o, { code: r.code }); } }, { key: 'm', label: 'Meter', align: 'right', mono: true }], rowHref: function (r) { return '#/assurance/proof/' + r.seq.replace(/\D/g, ''); }, rows: [{ seq: '#4,101', wt: 'erp.sales_invoice.submit', o: 'committed', m: '1' }, { seq: '#4,102', wt: 'erp.payment_entry.submit', o: 'refused', code: 'PLATFORM.TARGET_UNREACHABLE', m: '0' }, { seq: '#4,108', wt: 'erp.sales_invoice.submit', o: 'refused', code: 'GATE.BUDGET_EXHAUSTED', m: '0' }, { seq: '#4,110', wt: 'erp.journal_entry.submit', o: 'refused', code: 'POLICY.OBLIGATION_EXPIRED', m: '0' }, { seq: '#4,111', wt: 'erp.payment_run.submit', o: 'escalated', code: 'OB-2026-0411', m: '0' }] }) + '</div>'; },
      dos: ['Show refusals on the same table as commits, with a meter of 0.'], donts: ['Do not colour “Not done” red.', 'Do not add a fourth outcome.'] },
    { id: 'decide', title: 'Approval: decide', summary: 'An approver who presses Approve has already seen the diff, the gate results and the policy version, or the screen is wrong.', refs: ['diff', 'gates', 'actor', 'blast', 'countdown', 'button'],
      rule: 'Above the fold: the one-line proposal, the proposer with Agent or Person in words, the deadline and the blast radius. Then the whole diff, every declared gate’s result, the decision and why it reached a human. Approve and Reject are never adjacent without a gap; Reject requires a sentence.',
      example: function () { return '<div style="width:100%">' + c.card({ body: miniDecide(false) }) + '</div>'; },
      dos: ['Record the decision as a governed write and announce “Approved. Posted. Proof 4101.”', 'Offer “Send to” with people only when the approver is also the proposer.'], donts: ['Do not bulk-approve different write types.', 'Do not let an agent appear in the resolver set.'] },
    { id: 'diff', title: 'Diff', summary: 'Field-level before and after, as a real table, with material rows marked in words.', refs: ['diff'],
      rule: 'Nothing is summarised away; a diff a human cannot read is not a control. Unchanged rows collapse behind “Show all fields”; changed and material rows stay visible and say so in words.',
      example: function () { return '<div style="width:100%">' + c.diff(S.diff, { caption: 'Field-level changes proposed by this write' }) + '</div>'; },
      dos: ['Use mono for amounts and identifiers.', 'Strike the before value and weight the after value.'], donts: ['Do not colour a row red or green without the Changed word.'] },
    { id: 'chain-standing', title: 'Chain standing', summary: 'Continuous, break at seq N, or not checked — with the scope and count adjacent.', refs: ['chain', 'seal'],
      rule: 'A chain that verifies over 3 of 23 write types is a verified chain over almost nothing, and it reads identically on screen unless the screen says so. Standing is three-valued, and the scope is printed next to the word.',
      example: function () { return '<div class="e1-stack" style="width:100%">' + c.chain(S.chain().slice(0, 2), { standing: 'continuous', scope: '19 of 23 write types', count: 'seq 1–4,112', checkedAt: 'nightly 02:10 IST' }) + c.chain([], { standing: 'not_checked', scope: 'Deccan Auto · seq 1,201–1,284', count: 'written after last night’s run' }) + '</div>'; },
      dos: ['Show refusals in the chain; they are sealed like commits.'], donts: ['Do not show a green tick for “verified”.'] },
    { id: 'l1-vs-l2', title: 'L1 vs L2 honesty', summary: 'Never render what the level does not ship. Label every preview.', refs: ['seal', 'locked', 'level'],
      rule: 'At L1 there is no signature, no anchor time and no verifier verdict, so there is no row for one — not even an empty one. The Proof screen says, in the interface: “This record is hash-chained. It is not signed, and it cannot yet be checked by someone who does not trust elan1. That arrives at Assurance Level 2.” Screens read E1.state.level; L2/L3 elements appear only when the level allows and are labelled with it.',
      example: function () { return '<div class="e1-grid e1-grid--2" style="width:100%">' + c.seal({ level: 'L1', seq: 4101, writeType: 'erp.sales_invoice.submit', outcome: 'committed', approver: 'Venkat Raman', at: '24 Sep 2026, 15:02 IST', digest: S.hash4101, prev: S.hash4100 }) + '<div class="e1-stack">' + c.locked({ level: 'L2', always: true, why: 'A stranger holding the key fingerprint, obtained out of band, can check the record without trusting elan1. None of that is claimed at L1, so none of it is shown.', items: ['Ed25519 signature over the frozen preimage', 'RFC 3161 anchor time, batched', 'Offline verifier verdict', 'Exportable evidence bundle'] }) + c.seal({ level: 'L2', seq: 4101, writeType: 'erp.sales_invoice.submit', outcome: 'committed', approver: 'Venkat Raman', at: '24 Sep 2026, 15:02 IST', digest: S.hash4101, prev: S.hash4100, keyId: 'ed25519:7a1f…c02e', anchor: '24 Sep 2026, 15:05 IST' }) + '</div></div>'; },
      code: "html += E1.atLeast('L2')\n  ? E1.c.kv([['Signed by', key], ['Anchored', anchorTime]])\n  : E1.c.locked({ level:'L2', items:['Ed25519 signature', 'Anchor time', 'Verifier verdict'] }); // “Preview as L2” calls E1.setLevel('L2')",
      dos: ['Say “tamper-evident to you” at L1.'], donts: ['Do not say tamper-proof, signed, independently verifiable, court-ready or immutable at L1.'] },
    { id: 'forms', title: 'Forms and validation', summary: 'An honest unknown needs a sentence.', refs: ['field', 'input', 'textarea'],
      rule: 'Every declaration field takes a value, out_of_scope with an ADR reference, or not_measurable with a reason and a would_change_if — each at least twelve characters. “n/a” and “tbd” are rejected with: “An honest unknown needs a sentence. What would change your answer?” Validate on blur and on submit, not on every keystroke; an error replaces the hint.',
      example: function () { return '<div class="e1-grid e1-grid--2" style="width:100%"><div>' + c.field('Retention window', c.input({ id: 'pf-a', value: 'tbd', invalid: true, describedBy: 'pf-a-msg' }), { id: 'pf-a', required: true, error: 'An honest unknown needs a sentence. What would change your answer?' }) + '</div><div>' + c.field('Retention window', c.input({ id: 'pf-b', value: 'not_measurable: awaiting the legal retention memo; would change if counsel sets 8 years' }), { id: 'pf-b', required: true, help: 'A value, out_of_scope with an ADR, or not_measurable with a reason.' }) + '</div></div>'; },
      dos: ['Say what would make the value acceptable.', 'Keep the typed value when showing the error.'], donts: ['Do not clear the field on error.', 'Do not accept “n/a”.'] },
    { id: 'tables-density', title: 'Tables and density', summary: 'The root decides row height. Numbers align. Rows link.', refs: ['table', 'segmented'],
      rule: 'Tables use density tokens only, right-align numbers in mono, carry a real anchor in the first cell when the row links, and always pass an empty state. Density is a person’s preference for the whole console, set from the top bar.',
      example: function () { return '<div style="width:100%">' + approvalsTable({ dense: E1.state.density === 'compact' }) + '<p class="e1-caption e1-muted" style="margin-top:8px">Density is ' + esc(E1.state.density) + '. Change it from the top bar and this table follows.</p></div>'; },
      dos: ['Put the most decision-relevant column first.'], donts: ['Do not set heights, paddings or font sizes on a table.'] },
    { id: 'filters-in-url', title: 'Filters in the URL', summary: 'A filtered view can be pasted into a message.', refs: ['filters', 'tabs', 'pagination'],
      rule: 'Filters, tabs, sort and page live in the query string: #/work/approvals?filter=mine&sort=deadline. Build links with E1.href(path, query); read them from the query argument of render.',
      example: function () { var q = E1.state.route.query; var f = q.filter || 'mine'; return '<div class="e1-stack" style="width:100%">' + c.filters([{ label: 'Waiting on me', href: E1.href('/reference/patterns/filters-in-url', { filter: 'mine' }), active: f === 'mine', count: 4 }, { label: 'Expiring within an hour', href: E1.href('/reference/patterns/filters-in-url', { filter: 'expiring' }), active: f === 'expiring', count: 1 }, { label: 'Raised by an agent', href: E1.href('/reference/patterns/filters-in-url', { filter: 'agent' }), active: f === 'agent', count: 3 }], { label: 'Show' }) + '<p class="e1-caption">This page’s address is now <code>' + esc(location.hash || '') + '</code>.</p></div>'; },
      code: "render: (params, query) => E1.c.filters([\n  {label:'Waiting on me', href:E1.href('/work/approvals', {filter:'mine'}), active:(query.filter||'mine')==='mine'}\n])",
      dos: ['Default a missing filter explicitly.'], donts: ['Do not keep filter state in memory or storage.'] },
    { id: 'notifications', title: 'Notifications', summary: 'Say what happened, who did it, and link to the real screen.', refs: ['toast', 'actor'],
      rule: 'Every notification names the actor kind (Agent, Person, Platform), the amount or the outcome, and links to a real route. Outcomes of your own actions arrive as a toast: “Approved. Posted. Proof 4101.” WhatsApp carries the same line and a deep link; a “yes” in a chat thread is not informed consent to a write whose diff the person has not seen.',
      example: function () { var n = (E1.data.notifications || []).slice(0, 3); return '<div class="e1-card" style="width:100%;max-width:440px"><div class="e1-notif__list" style="max-height:none">' + n.map(function (x) { return '<a class="e1-notif' + (x.unread ? ' is-unread' : '') + '" href="' + esc(x.href) + '"><span class="e1-notif__icon e1-tone--' + esc(x.state) + '">' + c.icon(x.icon || { good: 'approve', warning: 'clock', serious: 'alert', critical: 'alert', info: 'info' }[x.state] || 'bell', 16) + '</span><span class="e1-notif__text"><span class="e1-notif__title">' + esc(x.title) + '</span><span class="e1-notif__body">' + esc(x.body) + '</span><span class="e1-notif__meta">' + esc(x.actorKind === 'agent' ? 'Agent' : x.actorKind === 'person' ? 'Person' : 'Platform') + ' · ' + esc(E1.fmt.rel(x.at)) + '</span></span></a>'; }).join('') + '</div></div>' + c.button('Show an outcome toast', { attrs: 'data-action="ds-demo-toast" data-value="good"' }); },
      dos: ['Mark unread with a bar and the word, not colour alone.'], donts: ['Do not notify about something the person cannot act on or open.'] },
    { id: 'mobile-approval', title: 'Mobile approval', summary: 'The same Decide screen at 390px: changed fields first, 44px targets, the actions apart.', refs: ['diff', 'button', 'countdown'],
      rule: 'The console is responsive to 360px. On a phone the rail becomes a bottom tab bar, sections open as a sheet, the diff collapses to changed fields with “Show all fields”, and Approve and Reject are 48px tall with a 12px gap. See the live mobile layout preview.',
      example: function () { return '<div class="e1-row" style="gap:24px;align-items:flex-start"><div style="width:390px;max-width:100%;border:1px solid var(--border-subtle);border-radius:24px;overflow:hidden;background:var(--bg-canvas)"><div class="e1-m-appbar"><a href="#/reference/patterns" aria-label="Back">' + c.icon('arrow-left', 20) + '</a><span class="e1-m-appbar__title">Decide</span><span style="width:44px"></span></div><div class="e1-m-body">' + miniDecide(true, true) + '</div><div class="e1-m-actions">' + c.button('Reject', { kind: 'danger' }) + c.button('Approve', { kind: 'gate' }) + '</div></div>' +
        '<div class="e1-stack" style="max-width:320px">' + c.callout({ kind: 'rule', title: 'WhatsApp approval', body: '<p>Only write types declared whatsapp_approve: true — low value, reversible, one-record blast radius — accept an APPROVE reply. Everything else is deep-link only: “Open the console to see the change and decide.”</p>' }) + c.button('Open the mobile layout preview', { kind: 'primary', href: '#/reference/layouts/mobile', iconRight: 'arrow-right' }) + '</div></div>'; },
      dos: ['Keep a visible gap between the two decisions.'], donts: ['Do not approve from a notification without the diff.'] },
    { id: 'command-palette', title: 'Command palette', summary: 'Every screen is one keystroke away, by its real title.', refs: ['command-palette', 'kbd'],
      rule: 'Ctrl or ⌘ + K opens a fuzzy search over every registered route (by title, path and keywords) plus actions: theme, density, assurance level, environment, shortcuts, sign out. Routes with :params appear through their example path. Screen files add actions with E1.cmdAdd.',
      example: function () { return c.button('Open the palette', { kind: 'primary', icon: 'search', attrs: 'data-action="palette"' }) + '<span>' + c.kbd('Ctrl', 'K') + '</span><span class="e1-caption e1-muted">' + E1.routes.filter(function (r) { return !r.def.redirect && r.def.palette !== false && (!r.keys.length || r.def.example); }).length + ' screens are searchable right now.</span>'; },
      dos: ['Give every route a sentence-case title and keywords.'], donts: ['Do not rely on the palette as the only way to reach a screen.'] }
  ];
  var PBY = {}; PATTERNS.forEach(function (x) { PBY[x.id] = x; });
  PATTERNS.forEach(function (x) { E1.cmdAdd({ id: 'pat:' + x.id, label: 'Pattern: ' + x.title, hint: '/reference/patterns/' + x.id, icon: 'layers', group: 'Patterns', keywords: x.summary, run: '#/reference/patterns/' + x.id }); });

  reg('/reference/patterns', 'patterns', 'Patterns', function () {
    return page({
      title: 'Patterns', lead: 'How components compose into the moments that matter: deciding, refusing, reading a diff, reading the chain, and staying honest about the assurance level.',
      body: sec('all', PATTERNS.length + ' patterns', null, '<div class="e1-linkcards">' + PATTERNS.map(function (x) {
        return '<a class="e1-linkcard" href="#/reference/patterns/' + x.id + '"><span class="e1-linkcard__top"><span class="e1-linkcard__t">' + esc(x.title) + '</span>' + c.icon('arrow-right', 16) + '</span><span class="e1-linkcard__d">' + esc(x.summary) + '</span><span class="e1-linkcard__prev" aria-hidden="true">' + x.refs.map(function (r) { return '<code class="e1-caption">' + esc(r) + '</code>'; }).join('<span class="e1-muted">·</span>') + '</span></a>';
      }).join('') + '</div>')
    });
  }, { keywords: 'patterns ux flows' });

  reg('/reference/patterns/:name', 'patterns', function (p) { var x = PBY[p.name]; return x ? x.title : 'Pattern not found'; }, function (p) {
    var x = PBY[p.name];
    if (!x) return c.pageHeader({ title: 'There is no pattern called “' + p.name + '”', back: ['Patterns', '#/reference/patterns'] }) + c.empty({ title: 'Not in the pattern library', why: 'Every pattern is listed on the index.', action: { label: 'Open the patterns', href: '#/reference/patterns' } });
    var i = PATTERNS.indexOf(x), prev = PATTERNS[i - 1], next = PATTERNS[i + 1];
    return page({
      title: x.title, eyebrow: 'Pattern', lead: x.summary,
      toc: [{ id: 'rule', label: 'The rule' }, { id: 'example', label: 'Live example' }, { id: 'guidance', label: 'Do and do not' }, { id: 'components', label: 'Components' }],
      body: sec('rule', 'The rule', null, c.callout({ kind: 'rule', body: '<p>' + esc(x.rule) + '</p>' })) +
        sec('example', 'Live example', 'Built from the real components.', spec('', x.example(), { col: false, plain: false, style: 'align-items:flex-start' }) + (x.code ? '<div style="margin-top:12px">' + c.code(x.code, 'js') + '</div>' : '')) +
        sec('guidance', 'Do and do not', null, dodont(x.dos, x.donts)) +
        sec('components', 'Components used', null, '<div class="e1-row">' + x.refs.map(function (r) { return c.chip(REGBY[r] ? REGBY[r].title : r, { href: '#/reference/components/' + r }); }).join('') + '</div>') +
        '<nav class="e1-row e1-row--between" aria-label="Previous and next pattern" style="margin-top:40px">' + (prev ? c.button(prev.title, { kind: 'secondary', href: '#/reference/patterns/' + prev.id, icon: 'arrow-left' }) : '<span></span>') + (next ? c.button(next.title, { kind: 'secondary', href: '#/reference/patterns/' + next.id, iconRight: 'arrow-right' }) : '<span></span>') + '</nav>'
    });
  }, { example: '/reference/patterns/decide', crumbs: [['Reference', '#/reference/design-system'], ['Patterns', '#/reference/patterns']] });

  /* =========================================================================
     LAYOUTS — the six shells, each with a live preview route
     ========================================================================= */
  E1.navAdd('reference', { id: 'layouts', label: 'Layouts and chrome', href: '#/reference/layouts', group: 'Design system', after: 'patterns' });
  var LAYOUTS = [
    ['console', 'Console', 'Ink top bar, the wide grouped sidebar (a rail when collapsed), the breadcrumb bar, the main pane and the footer strip. Every operational screen.', '#/reference/design-system'],
    ['public', 'Public', 'The marketing website: sticky paper header with the site navigation, ink footer with the descriptor.', '#/reference/layouts/public'],
    ['auth', 'Auth', 'A thin header strip naming the surface, the form on the canvas, and an ink panel of facts about how signing in works. No page-scale disc.', '#/reference/layouts/auth'],
    ['wizard', 'Wizard', 'Onboarding: a header with progress and Save and exit, numbered steps on the left, the step in the middle, and a running summary on the right. Registered by the access screens.', '#/onboarding'],
    ['bare', 'Bare', 'A standalone page — the public verifier — with a thin header and no account chrome.', '#/reference/layouts/bare'],
    ['doc', 'Doc', 'Reference documentation: docs navigation on the left, the article, and an on-this-page list built from its headings.', '#/reference/layouts/doc'],
    ['mobile', 'Mobile', 'Content inside a 390 × 844 phone frame on a paper backdrop; full-bleed on a real phone.', '#/reference/layouts/mobile']
  ];
  reg('/reference/layouts', 'layouts', 'Layouts and chrome', function () {
    return page({
      title: 'Layouts and chrome', lead: 'Seven shells, and the console chrome every operational screen sits in. A route picks a shell with layout: …; the shell owns the chrome, the screen owns only its content.',
      toc: [{ id: 'six', label: 'The layouts' }, { id: 'chrome', label: 'Console chrome' }, { id: 'pill', label: 'Screen-info pill and notes' }, { id: 'options', label: 'Route options' }, { id: 'mobile-helpers', label: 'Helpers inside the phone' }],
      top: c.miniHead([{ label: 'Shells', value: String(LAYOUTS.length) }, { label: 'Sidebar', value: rv('--sidebar-width') || '232px', note: 'rail when collapsed' }, { label: 'Top bar', value: rv('--topbar-height') || '48px', note: 'ink, both themes' }, { label: 'Drawer', value: rv('--drawer-width') || '440px' }, { label: 'Content max', value: rv('--screen-max') || '1440px' }]) + '<div style="height:24px"></div>',
      body: sec('six', 'The layouts', null, tbl(['Layout', 'What it is', 'Route option', 'Preview'], LAYOUTS.map(function (l) { return [esc(l[1]), esc(l[2]), '<code>layout: \'' + l[0] + '\'</code>', '<a href="' + l[3] + '">Open</a>']; }), 'Layouts')) +
        sec('chrome', 'Console chrome', 'The look follows the elan1 console family. The console layout draws all of it; a screen never builds its own chrome.',
          tbl(['Part', 'What it holds', 'Rules'], [
            ['Ink top bar', 'elan1 lockup · Console surface switcher · tenant name with GSTIN and residency · environment pill (Sandbox / Live) · assurance-level pill · “Search or ask elan1… Ctrl K” · waiting-on-you count · notifications · theme · density · name, role and avatar.', 'Ink in both themes. The waiting count links to Approvals and uses the gate icon, because it counts human decisions.'],
            ['Grouped sidebar', 'Today, then WORK · RECORDS · AGENTS · ASSURANCE. The current door lists every item under its sub-group labels; the others show three items and “More · n”. A separator, REFERENCE, Learn, and a footer with the level line.', '232px, ink. <code>[</code> or the footer chevron collapses it to an icon rail; at 1024px and below it is always the rail; at 720px and below it opens as a drawer from the hamburger or the tab bar’s More.'],
            ['Breadcrumb bar', 'Door / section / screen, with a “Sandbox data” or “Live data” honesty tag on the right.', 'Sticky. Built from the route’s door, section and title unless the route passes crumbs.'],
            ['Page header', 'Eyebrow · 26px title · lead · actions bottom-right · meta · underline tabs.', 'One h1 per screen. Tabs are links, so every view has an address.'],
            ['Footer strip', 'Release and console version · residency · assurance level and what it claims.', 'Always states the level honestly: at L1, “every write hash-chained, not signed”.'],
            ['Mobile tab bar', 'Today and the four doors, plus More.', 'Below 720px only; 44px targets.']
          ], 'Console chrome') +
          '<div class="e1-row" style="margin-top:12px">' + c.button('Open the navigation drawer', { icon: 'menu', attrs: 'data-action="sections"' }) + c.button('Collapse or expand the sidebar', { kind: 'ghost', icon: 'panel-left', attrs: 'data-action="panel"' }) + c.button('Open the palette', { kind: 'ghost', icon: 'search', attrs: 'data-action="palette"' }) + '</div>') +
        sec('pill', 'Screen-info pill and screen notes', 'On every layout, bottom right. Hidden inside iframes, in thumbnails, and with ?pill=0.',
          '<div class="e1-grid e1-grid--2">' +
            c.card({ title: 'The pill', body: c.kv([['Reads', 'NNN · TYPE · Section · Title'], ['Prev and next', 'The neighbouring screens in the inventory'], ['Grid', 'The screen atlas, scrolled to this screen'], ['Notes', 'Opens the screen notes drawer'], ['Key', '<span>' + c.kbd('i') + ' shows or hides it; the choice is remembered</span>', { html: true }]]), footer: '<span>Driven by js/inventory.js</span>' + c.button('Hide or show the pill', { kind: 'ghost', size: 'sm', attrs: 'data-action="ds-pill"' }) }) +
            c.card({ title: 'Screen notes', body: c.kv([['Identity', 'Id, number, type, surface, route, pattern and file'], ['States', 'Every state of the screen, each a link'], ['Components', 'The E1.c helpers the screen uses'], ['Rules', 'The rules it must keep, e.g. L1 honesty'], ['Sources', 'The specification documents it answers to']]), footer: '<span>Routes not in the inventory get route-only notes</span>' + c.button('Open this screen’s notes', { kind: 'secondary', size: 'sm', icon: 'file-text', attrs: 'data-action="screen-notes"' }) }) +
          '</div>') +
        sec('options', 'Route options each layout reads', null, tbl(['Option', 'Layouts', 'Effect'], [
          ['<code>door</code>, <code>section</code>', 'console', 'Lights the rail door and the sections item; builds the breadcrumb.'],
          ['<code>crumbs</code>', 'console, doc', 'Overrides the automatic breadcrumb. The page title is appended as the current crumb.'],
          ['<code>wide</code>', 'console', 'Removes the content max width (dense tables, canvases).'],
          ['<code>bareTitle</code>', 'bare', 'The label beside the logo, e.g. “Public verifier”.'],
          ['<code>lead</code>, <code>back</code>', 'mobile', 'The caption beside the phone and a back button to the console screen.'],
          ['<code>E1.site</code>', 'public', 'Header links, CTAs and footer columns. Links to unregistered routes are hidden automatically.'],
          ['<code>E1.docNavAdd(group, {label, href})</code>', 'doc', 'Adds a link to the docs navigation.']
        ], 'Route options')) +
        sec('mobile-helpers', 'Helpers inside the phone', null, tbl(['Class', 'Use'], [['<code>.e1-m-appbar</code> + <code>.e1-m-appbar__title</code>', 'Sticky app bar with 44px back and action targets.'], ['<code>.e1-m-body</code>', '16px padded stack.'], ['<code>.e1-m-actions</code>', 'Sticky two-button decision bar, 48px buttons, 12px gap.'], ['<code>.e1-m-tabbar</code>', 'In-app tab bar for a phone screen.']], 'Mobile helpers'))
    });
  }, { keywords: 'layouts shells console public auth bare doc mobile wizard chrome sidebar top bar pill screen notes' });
  E1.action('ds-pill', function () { if (E1.togglePill) E1.togglePill(); });

  var LOREM = '<p>The layout owns the chrome; the screen owns this content. Nothing on this page is a real screen — it exists so the shell can be seen and tested.</p>';
  E1.route('/reference/layouts/public', { title: 'Public layout preview', layout: 'public', keywords: 'website marketing', render: function () {
    return '<section style="max-width:var(--content-wide);margin:0 auto;padding:72px 32px 24px"><p class="e1-eyebrow">// Layout preview · public</p><h1 style="font:700 56px/1.02 var(--font-display);letter-spacing:var(--tracking-display);max-width:16ch">Governed agentic applications for the work that commits your business.</h1><p class="e1-text-lead" style="margin-top:20px;max-width:56ch;font-size:20px;line-height:30px">Ten agentic apps on one control plane, and a person answerable for every action that commits the business. elan1 is built on Claude.</p><div class="e1-row" style="margin-top:28px">' + c.button('Back to the layouts', { kind: 'primary', size: 'lg', href: '#/reference/layouts', icon: 'arrow-left' }) + '</div></section>';
  } });
  E1.route('/reference/layouts/auth', { title: 'Auth layout preview', layout: 'auth', render: function () {
    return '<p class="e1-eyebrow">Layout preview · auth</p><h1 class="e1-text-title">Sign in to elan1</h1><p class="e1-muted" style="margin:6px 0 20px">Use your work email. Your tenant is chosen after sign-in.</p>' +
      c.field('Work email', c.input({ id: 'la-e', type: 'email', placeholder: 'venkat.raman@kaverispinning.in' }), { id: 'la-e' }) + c.button('Continue', { kind: 'primary', full: true, href: '#/reference/layouts' }) + '<p class="e1-caption e1-muted" style="margin-top:16px">This is a layout preview. <a href="#/reference/layouts">Back to the layouts</a>.</p>';
  } });
  E1.route('/reference/layouts/bare', { title: 'Bare layout preview', layout: 'bare', bareTitle: 'Layout preview · bare', render: function () {
    return c.pageHeader({ title: 'Verify a record', eyebrow: 'Public verifier', lead: 'Paste a proof bundle or a digest. This page runs without an elan1 account.' }) + c.card({ body: c.field('Digest', c.input({ id: 'lb-d', mono: true, value: S.hash4101 }), { id: 'lb-d' }) + c.callout({ kind: 'caveat', title: 'L1 records cannot be verified by a stranger.', body: '<p>They are hash-chained, not signed. Independent verification arrives at Assurance Level 2.</p>' }) }) + '<p style="margin-top:16px"><a href="#/reference/layouts">Back to the layouts</a></p>';
  } });
  E1.route('/reference/layouts/doc', { title: 'Doc layout preview', layout: 'doc', crumbs: [['Docs', '#/reference/layouts/doc'], ['Guides', '#/reference/layouts/doc']], render: function () {
    return '<h1>Declaring a write type</h1><p class="e1-text-lead">A write type that is not declared cannot be attempted. There is no generic write.</p>' + LOREM +
      '<h2 id="doc-blocks">The seven blocks</h2><p>identity · shape · permissions · write_types · gates · proof_binding · channels.</p>' +
      '<h3 id="doc-gates">Gates</h3><p>Six gates can never be skipped: consent, residency, retention, dual control, counterparty and precondition.</p>' + c.code("write_types:\n  - name: erp.payment_entry.submit\n    blast_radius: one_counterparty\n    reversal: recall_before_neft_cutoff", 'yaml') +
      '<h2 id="doc-validate">Validate and simulate</h2><p>Validation shows failures against the block that caused them. Simulation runs against synthetic fixtures only.</p><p><a href="#/reference/layouts">Back to the layouts</a></p>';
  } });
  E1.docNavAdd('Layout preview', { label: 'Declaring a write type', href: '#/reference/layouts/doc' });
  E1.docNavAdd('Layout preview', { label: 'All layouts', href: '#/reference/layouts' });
  E1.route('/reference/layouts/mobile', { title: 'Decide on a phone', layout: 'mobile', lead: 'Changed fields first, 48px decision buttons with a 12px gap, and the countdown beside the proposal.', back: ['Back to the layouts', '#/reference/layouts'], render: function () {
    return '<div class="e1-m-appbar"><a href="#/reference/layouts" aria-label="Back to the layouts">' + c.icon('arrow-left', 20) + '</a><span class="e1-m-appbar__title">Decide</span><span style="width:44px" aria-hidden="true"></span></div>' +
      '<div class="e1-m-body">' + miniDecide(true, true) + '</div>' +
      '<div class="e1-m-actions">' + c.button('Reject', { kind: 'danger', attrs: 'data-action="ds-demo-modal"' }) + c.button('Approve', { kind: 'gate', attrs: 'data-action="ds-demo-toast" data-value="good"' }) + '</div>';
  } });

  /* =========================================================================
     ACCESSIBILITY
     ========================================================================= */
  var WCAG = [
    ['1.1.1', 'Non-text content', 'A', 'Icons are aria-hidden beside text or carry a label; charts have a <figcaption> and a hidden data table; the logo has alt text.'],
    ['1.3.1', 'Info and relationships', 'A', 'Tables are real <table>s with <th scope>; the diff is a table; key/value is a <dl>; fields use <label for> and aria-describedby.'],
    ['1.4.1', 'Use of colour', 'A', 'Every status is a word plus a glyph; ladders read by filled-step count; diff rows say Changed and Material in words.'],
    ['1.4.3', 'Contrast (minimum)', 'AA', 'Measured live on the Colour page for both themes; every text pair clears 4.5:1.'],
    ['1.4.4', 'Resize text', 'AA', 'All type in px tokens scales with browser zoom; layouts reflow at 200%.'],
    ['1.4.10', 'Reflow', 'AA', 'Works at 360px wide (320 CSS px at 400% zoom): rail → tab bar, grids → one column, tables scroll inside their wrapper.'],
    ['1.4.11', 'Non-text contrast', 'AA', 'Input borders, focus ring, chart series and the disc clear 3:1; measured on the Colour page.'],
    ['1.4.12', 'Text spacing', 'AA', 'No fixed-height text containers; line heights are tokens.'],
    ['1.4.13', 'Content on hover or focus', 'AA', 'Tooltips show on hover and focus, never hide content, and dismiss with Escape by moving focus.'],
    ['2.1.1', 'Keyboard', 'A', 'The whole approval path works without a mouse: queue, open, read the diff, decide, confirm.'],
    ['2.1.2', 'No keyboard trap', 'A', 'Dialogs trap focus by design and always release it with Escape or a Close button.'],
    ['2.1.4', 'Character key shortcuts', 'A', 'Single-key shortcuts (t, [, ?, g then a letter) can be turned off in Profile and preferences, and never fire while typing.'],
    ['2.2.1', 'Timing adjustable', 'A', 'Countdowns show business deadlines, not session timeouts; expiry is paused during a platform outage; timers never auto-submit.'],
    ['2.4.1', 'Bypass blocks', 'A', 'A “Skip to content” control is the first focus stop in every layout.'],
    ['2.4.2', 'Page titled', 'A', 'document.title is “<screen> · elan1”, set on every route change.'],
    ['2.4.3', 'Focus order', 'A', 'DOM order matches visual order; on navigation focus moves to the main region and the title is announced.'],
    ['2.4.7', 'Focus visible', 'AA', 'A 2px cobalt ring with a 2px offset, at 3:1 against its background, in both themes. Outlines are never removed.'],
    ['2.4.11', 'Focus not obscured (minimum)', 'AA', 'Sections scroll with a margin below the sticky bars; popovers never cover the focused control.'],
    ['2.5.3', 'Label in name', 'A', 'Icon-only buttons use their visible tooltip text as the accessible name.'],
    ['2.5.7', 'Dragging movements', 'AA', 'Nothing in the system requires dragging.'],
    ['2.5.8', 'Target size (minimum)', 'AA', 'Controls are at least 26px on desktop; on coarse pointers the density tokens lift them to 44px.'],
    ['3.1.1', 'Language of page', 'A', '<html lang="en-GB">.'],
    ['3.2.1 · 3.2.2', 'On focus · on input', 'A', 'Focus and selection never navigate; segmented controls change a view only on activation.'],
    ['3.3.1 · 3.3.3', 'Error identification · suggestion', 'A · AA', 'Errors are text beside the field, say what would be acceptable, and set aria-invalid.'],
    ['3.3.2', 'Labels or instructions', 'A', 'Every control is wrapped in c.field with a visible label.'],
    ['3.3.8', 'Accessible authentication', 'AA', 'Sign-in allows password managers and paste; no cognitive puzzles.'],
    ['4.1.2', 'Name, role, value', 'A', 'Native elements first; menus, tabs, switches and the palette use the matching ARIA roles and states.'],
    ['4.1.3', 'Status messages', 'AA', 'Toasts use role="status" (or "alert" for critical); navigation and outcomes are announced through a polite live region.']
  ];
  reg('/reference/accessibility', 'accessibility', 'Accessibility', function () {
    return page({
      title: 'Accessibility', lead: 'WCAG 2.2 AA is a property of the components, not a review at the end. This page states, criterion by criterion, how the system meets it — and where a screen can still break it.',
      toc: [{ id: 'criteria', label: 'WCAG 2.2 AA' }, { id: 'keyboard', label: 'Keyboard' }, { id: 'focus', label: 'Focus' }, { id: 'screens', label: 'What screens must still do' }, { id: 'testing', label: 'How we test' }],
      body: sec('criteria', 'WCAG 2.2 AA, criterion by criterion', null, tbl(['Criterion', 'Name', 'Level', 'How the system meets it'], WCAG.map(function (w) { return ['<span class="e1-mono">' + w[0] + '</span>', esc(w[1]), esc(w[2]), esc(w[3])]; }), 'WCAG criteria')) +
        sec('keyboard', 'Keyboard', 'Every shortcut, and the keys inside components.', tbl(['Where', 'Keys', 'Does'], [
          ['Anywhere', c.kbd('Ctrl', 'K'), 'Command palette'], ['Anywhere', c.kbd('g') + ' then ' + c.kbd('w') + ' ' + c.kbd('r') + ' ' + c.kbd('a') + ' ' + c.kbd('s') + ' ' + c.kbd('x'), 'Work, Records, Agents, Assurance, Reference'],
          ['Anywhere', c.kbd('['), 'Sections panel'], ['Anywhere', c.kbd('t'), 'Theme'], ['Anywhere', c.kbd('?'), 'Shortcut sheet'],
          ['Menus', c.kbd('↑') + ' ' + c.kbd('↓') + ' ' + c.kbd('Home') + ' ' + c.kbd('End') + ' ' + c.kbd('Esc'), 'Move, jump, close and return focus'],
          ['Segmented', c.kbd('←') + ' ' + c.kbd('→'), 'Select the previous or next option'], ['Dialogs', c.kbd('Tab') + ' ' + c.kbd('Esc'), 'Cycle within; close and return focus'],
          ['Palette', c.kbd('↑') + ' ' + c.kbd('↓') + ' ' + c.kbd('Enter'), 'Move and open'], ['Tables', c.kbd('Tab') + ' ' + c.kbd('Enter'), 'Each linked row has a real link in its first cell']
        ], 'Keyboard') + '<div class="e1-row" style="margin-top:12px">' + c.button('Open the shortcut sheet', { icon: 'command', attrs: 'data-action="shortcuts"' }) + c.button('Turn single-key shortcuts off', { kind: 'ghost', href: '#/account/profile' }) + '</div>') +
        sec('focus', 'Focus', 'Focus is not a variant — it is the token.', spec('', c.button('Tab to me', { kind: 'secondary' }) + c.button('Approve and commit', { kind: 'gate' }) + '<span style="display:inline-grid;place-items:center;height:32px;padding:0 12px;border-radius:3px;box-shadow:var(--focus-shadow);background:var(--bg-surface)">:focus-visible, drawn permanently</span>', { note: 'Contrast ' + ((E1.contrast('--focus-ring', '--bg-canvas') || 0).toFixed(2)) + ':1 on the canvas' })) +
        sec('screens', 'What screens must still do', 'The components cannot do these for you.', c.card({ body: '<ol class="e1-prose" style="margin:0;padding-left:18px"><li>Give every table a caption and every chart a title.</li><li>Write link text that makes sense out of context — “Open the proof”, not “here”.</li><li>Keep Approve and Reject apart; require a sentence for a rejection.</li><li>Pass an empty state to every table and list.</li><li>Use c.field for every control so it has a visible label.</li><li>Never communicate a state by colour, position or an icon alone.</li><li>Keep text in British English and plain enough to survive translation to Tamil and Hindi.</li></ol>' })) +
        sec('testing', 'How we test', null, tbl(['Check', 'How', 'When'], [['Automated', 'axe-core over every registered route in both themes', 'Every build'], ['Keyboard walk', 'The approval path, start to proof, without a mouse', 'Every change to Work'], ['Screen readers', 'NVDA with Firefox, VoiceOver with Safari on macOS and iOS, TalkBack on Android', 'Each release'], ['Zoom and reflow', '200% and 400% zoom; 360px viewport', 'Each release'], ['Reduced motion', 'prefers-reduced-motion: reduce', 'Each release'], ['Contrast', 'The Colour page’s live table, both themes', 'Every token change']], 'Testing'))
    });
  }, { keywords: 'accessibility a11y wcag keyboard screen reader contrast' });

  /* =========================================================================
     CHANGELOG
     ========================================================================= */
  var CHANGES = [
    ['D-01', 'Type', '--font-display: Bricolage Grotesque', '--font-display: Schibsted Grotesk', 'Brand Book v1.0 §04.1 governs. Schibsted gets darker without getting wider; Bricolage stays in the drawn lockup only.', 'None — token name unchanged.'],
    ['D-02', 'Type', '--font-ui: Outfit', '--font-ui: IBM Plex Sans', 'Drawn for engineering documentation; unambiguous 1, l, I; true tabular figures at 13px.', 'None.'],
    ['D-03', 'Type', '--font-mono: JetBrains Mono', '--font-mono: IBM Plex Mono', 'Same family as the UI face, so a hash beside a label reads as one voice.', 'None.'],
    ['D-04', 'Type', '--weight-bold: 800', '--weight-bold: 700; added --weight-light 300, --weight-semibold 600', 'Schibsted display is specified at 700; Plex leads at 300 and labels at 600.', 'Headings render one step lighter.'],
    ['D-05', 'Colour', 'No level ladder', '--level-1…3 with -bg, -border, -fill', 'L1/L2/L3 are a property of the proof and the claim, never a status or clay.', 'Use c.level().'],
    ['D-06', 'Colour', 'No actor tokens', '--actor-person-*, --actor-agent-*, --actor-system-*', 'E06: the proposer is stated in words and shape.', 'Use c.actor().'],
    ['D-07', 'Colour', 'Charts used --viz-* directly', '--chart-series-primary/-accent/-muted, --chart-grid/-axis/-label, --chart-1…8', 'Two-series charts need a measured, an accent and a comparison role that work in both themes.', '--viz-* remain for ramps and meters.'],
    ['D-08', 'Colour', 'Functional colours implicit', '--brand-verdigris, --brand-amber, --brand-crimson, --brand-cobalt as primitives', 'Brand Book 03.3 names them; roles now point at named primitives.', 'None.'],
    ['D-09', 'Focus', '--focus-ring only', '--focus-width, --focus-gap, --focus-shadow', 'One composite ring for custom controls (checkbox box, chips).', 'Use var(--focus-shadow).'],
    ['D-10', 'Loading', '—', '--skeleton-base, --skeleton-shine, --skeleton-dur', 'Skeletons shimmer on tokens and stop under reduced motion.', 'Use c.skeleton().'],
    ['D-11', 'Overlays', '—', '--scrim, --scrim-strong, --z-chrome, --z-palette, --z-tooltip', 'Dialogs, palette and tooltips needed an explicit stack.', 'None.'],
    ['D-12', 'Layout', '—', '--bp-xs…2xl (documented), --subnav-width, --tabbar-height, --touch-min, --content-wide', 'Responsive to 360px and a mobile tab bar under 720px.', 'Media queries use literal values.'],
    ['D-13', 'Sizes', '—', '--icon-xs…xl, --icon-stroke, --avatar-xs…xl', 'Icons keep a 1.5px stroke at every size; avatars have five sizes.', 'None.'],
    ['D-14', 'Chrome', 'Toast and sandbox badge used literals', '--toast-*, --chrome-sandbox-*, --text-on-chrome-strong', 'No literal hex outside tokens.css.', 'None.'],
    ['D-15', 'Theme', 'Theme only on :root', 'Also on any [data-theme] element', 'Side-by-side light and dark specimens; embedded previews.', 'None.'],
    ['D-16', 'IA', 'Seven destinations (Home … Learn)', 'Four doors — Work, Records, Agents, Assurance — plus Reference below a divider', 'E06 and Four Doors v2.0: no fifth door and no Settings tab.', 'Register routes with door and section.'],
    ['D-18', 'Blast radius', 'Four classes: Contained · Reversible · Material · Irreversible (--blast-1…4)', 'Five declared values: One record · One counterparty · Batch · Whole tenant · Crosses an organisation boundary (--blast-1…5)', 'Lead decision: the radius is what the kernel measures at rung 5; reversibility is a different fact.', 'c.blast(n) takes 1–5 or the declared key; old words are deprecated aliases. --blast-4 is now orange; --blast-5 is crimson.'],
    ['D-19', 'Components', 'Reversibility folded into the radius', 'c.reversible(window|false): “Reversible · 24 h” / “Irreversible”', 'Separate chip, so a batch can be reversible and one record can be irreversible.', 'Add beside c.blast().'],
    ['D-20', 'Outcomes', 'Refused rendered critical red', 'c.outcome(kind): Committed · Not done (neutral) · Waiting on a person · Expired · Platform failure (critical)', 'A refusal is a correct, free outcome, not an error. The refusal card is neutral; only PLATFORM.* is critical.', 'Use c.outcome() for every outcome.'],
    ['D-21', 'Assurance level', 'Screens hid or blanked L2/L3 content', 'E1.setLevel(L) and c.locked({level})', 'An L2/L3 screen at L1 shows what arrives and offers a labelled preview.', 'Replace blank states with c.locked().'],
    ['D-22', 'Colour', '—', '--zone-kernel, -consumer, -runtime, -people, -refusal, -external (+ -bg)', 'Architecture diagrams need regions that cannot be mistaken for status.', 'Diagrams only.'],
    ['D-23', 'IA', 'Tenants under Agents', 'Tenants under Records; new items in every door', 'Lead decision: tenants are records; keys, channels, people and roles are Agents; meter, billing and plan are Assurance.', 'section ids per README §6.'],
    ['D-17', 'Components', 'React components (governance.tsx)', 'String-returning helpers on E1.c, one page each', 'A static, build-free site that eight engineers extend in parallel.', 'See the framework README.']
  ];
  var CHANGES_V2 = [
    ['V2-01', 'Type', '--font-display: Schibsted Grotesk · --font-ui: IBM Plex Sans · --font-mono: IBM Plex Mono', '--font-display: Bricolage Grotesque · --font-ui: Outfit · --font-mono: JetBrains Mono', 'Back to the parent elan1 token layer that every product in the elan1 console family inherits. Reverses D-01 to D-03.', 'None — token names unchanged.'],
    ['V2-02', 'Type', '--weight-bold: 700', '--weight-bold: 800 (parent) · new --weight-title: 700 · new --text-page-title: 26px', 'Bricolage titles read best at 700; the hub display keeps the parent 800.', 'Page and card titles use --weight-title.'],
    ['V2-03', 'Chrome', 'Ink top bar with four-door rail and a separate sections panel', 'Ink top bar (tenant, GSTIN · residency, environment, level, “Search or ask elan1… Ctrl K”, waiting count, theme, density, person) and a 232px grouped sidebar that collapses to a rail', 'One navigation column instead of two; the current door shows every item under its sub-groups.', 'None — layout: \'console\' draws it. E1.navAdd group labels become sidebar sub-labels.'],
    ['V2-04', 'Chrome', '—', 'Screen-info pill and Screen notes drawer on every layout', 'Every screen states its number, type and section, and opens its states, components, rules and sources.', 'Add screens to js/inventory.js (window.E1_SCREENS).'],
    ['V2-05', 'Components', 'c.pageHeader({title, lead, actions, meta, eyebrow, back})', 'Adds tabs; eyebrow is a small uppercase label; title 26px; actions bottom-right', 'The console page header: eyebrow · title · lead · actions · underline tabs.', 'Pass tabs: c.tabs(…).'],
    ['V2-06', 'Components', 'c.stat({label, value, … href})', 'Adds bar, badge, aside, foot, flag', 'Stat cards carry a share bar, a verdict, an honesty mark, a source and freshness foot, and a warning edge.', 'Optional props.'],
    ['V2-07', 'Components', '—', 'c.verdict, c.cost, c.attention, c.miniHead, c.gateCells, c.gateDots', 'Queue rows, home lists and decision screens drew these by hand in v1.1.', 'Replace hand-drawn markup with the helpers.'],
    ['V2-08', 'Components', '—', 'c.letter, c.doorMark, c.tag, c.channel, c.honesty, c.asOf, c.who, c.minibar', 'Small exact parts for dense rows: identity, provenance, freshness and share.', 'None.'],
    ['V2-09', 'Tokens', '—', '--gate-*, --env-sandbox-*, --env-live-*, --meter-*, --door-*, --series-1…4, --channel-*, --honesty-ground, --sidebar-width, --drawer-width, --screen-max, --z-pill', 'The new parts read role tokens only, in both themes.', 'None.'],
    ['V2-10', 'Components', 'Cards with a plain head; tinted chips', 'Cards have a 48px bordered head and a sunken foot; callouts are tinted banners; tabs underline in clay; chips are square with count pills; people avatars are initials in an ink circle', 'The console family’s component shapes.', 'None — class names unchanged.'],
    ['V2-11', 'Packaging', 'One SPA entry', 'A hub (index.html), atlas, foundations, components, patterns and research pages, and one HTML file per screen under screens/', 'Screens can be opened, linked and reviewed one by one.', 'window.E1_FILE_MODE, E1_BASE and E1_START; use E1.asset() for image paths.']
  ];
  reg('/reference/changelog', 'changelog', 'Changelog', function () {
    function rows(list) { return list.map(function (d) { return ['<span class="e1-mono">' + d[0] + '</span>', esc(d[1]), '<code>' + esc(d[2]) + '</code>', '<code>' + esc(d[3]) + '</code>', esc(d[4]), esc(d[5])]; }); }
    return page({
      title: 'Changelog', lead: 'v1.1 → v2.0, 24 Sep 2026: the elan1 console family look on the same engine. No token was removed or renamed, and every v1.1 API still works; below it, the v1.0 → v1.1 history.',
      meta: c.tag('v2.0 · 24 Sep 2026') + c.tag('v1.1 · 24 Sep 2026') + '<span>Next review: March 2027</span>',
      top: '<div class="e1-grid e1-grid--4" style="margin-bottom:24px">' +
        c.stat({ label: 'v2.0 decisions', value: String(CHANGES_V2.length), badge: c.verdict('clean', 'Backward compatible', { icon: 'check' }), note: 'Every v1.1 call still renders.' }) +
        c.stat({ label: 'New helpers', value: '14', note: 'Verdict to mini bar, each with its own page.', href: '#/reference/components?q=v2' }) +
        c.stat({ label: 'Tokens removed', value: '0', aside: c.honesty('[measured]'), note: 'Deprecated names are kept for a full minor.' }) +
        c.stat({ label: 'v1.1 decisions', value: String(CHANGES.length), note: 'D-01 to D-03 are reversed by V2-01.' }) +
      '</div>',
      toc: [{ id: 'v2', label: 'v1.1 → v2.0' }, { id: 'decisions', label: 'v1.0 → v1.1' }, { id: 'versioning', label: 'Versioning' }],
      body: sec('v2', 'v1.1 → v2.0 decisions', 'A product review of v1 found that it read as a website. v2.0 changes the look and the packaging; the engine, the routes and the API stay.', tbl(['#', 'Area', 'v1.1', 'v2.0', 'Why', 'Migration'], rows(CHANGES_V2), 'v2.0 decisions')) +
        sec('decisions', 'v1.0 → v1.1 decisions', 'Kept as history. Where v2.0 reverses a decision, the v2.0 row says so.', tbl(['#', 'Area', 'v1.0', 'v1.1', 'Why', 'Migration'], rows(CHANGES), 'v1.1 decisions')) +
        sec('versioning', 'Versioning', 'Four layers, versioned separately, because they change at different speeds.', tbl(['Layer', 'Version', 'Rule'], [
          ['Brand Book', 'v1.0', 'Changes annually at most. The wordmark, the bearing, the clay.'],
          ['Token layer', 'v2.0', 'A token is never deleted in a minor release — it is deprecated and kept for one full minor. v2.0 changed values, not names.'],
          ['Components', 'v2.0', 'A prop is added in a minor release; removed only in a major, after the call sites are counted. v2.0 removed nothing.'],
          ['Screen grammar', 'v2.0', 'Four doors and six screen types, now drawn in the console family chrome. A seventh screen type is a change to the platform, not a design decision.']
        ], 'Versioning'))
    });
  }, { keywords: 'changelog release notes versions decisions' });
})();
