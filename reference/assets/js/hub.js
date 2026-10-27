/* ==========================================================================
   elan1 platform workspace — "All screens", the screen atlas and the design
   system pages, rendered INSIDE the console chrome (layout 'console', door
   'reference'), like any other workspace in the product.
     /hub              All screens (stats, start here, filters, every screen)
     /hub/atlas        Screen atlas (filters by surface / type / door, grid or table)
     /hub/foundations  /hub/components  /hub/patterns  /hub/research
                       — the /reference/* renders with in-page section tabs
   Reads window.E1_SCREENS (js/inventory.js) and window.E1_FILE_MODE.
   In file mode (the packaged site) links go to files: index.html, atlas.html,
   screens/<file>; window.E1_ROOT (or E1_BASE) is '' at the package root and
   '../' in screens/. Load after the screen files, before app.js.
   ========================================================================== */
(function () {
  'use strict';
  if (!window.E1) return;
  var E1 = window.E1, esc = E1.esc;
  function c() { return E1.c; }
  var BASE = typeof window.E1_ROOT === 'string' ? window.E1_ROOT : (window.E1_BASE || '');
  function FILE() { return !!window.E1_FILE_MODE; }
  function LIST() { return window.E1_SCREENS || []; }

  /* A screen file opens at the lowest Assurance Level at which it is live (inventory 'level'),
     without persisting it: below that level the route shows the "arrives at Level N" explainer. */
  var LV = { L1: 1, L2: 2, L3: 3 };
  if (window.E1_LEVEL && E1.state && LV[window.E1_LEVEL] > (LV[E1.state.level] || 1)) E1.state.level = window.E1_LEVEL;

  /* ------------------------------------------------------------------------
     Asset paths in pages below the package root (screens/*.html):
     every 'assets/…' src/href rendered by any layout gets BASE prepended.
     ------------------------------------------------------------------------ */
  if (BASE) {
    var fixHtml = function (html) {
      return typeof html === 'string' ? html.replace(/(\s(?:src|href|poster|srcset)=)(["'])assets\//g, '$1$2' + BASE + 'assets/').replace(/url\((["']?)assets\//g, 'url($1' + BASE + 'assets/') : html;
    };
    var wrapLayouts = function () {
      var L = E1.layouts || {};
      Object.keys(L).forEach(function (k) {
        var fn = L[k];
        if (typeof fn !== 'function' || fn.__hubFixed) return;
        var w = function () { return fixHtml(fn.apply(this, arguments)); };
        w.__hubFixed = true; L[k] = w;
      });
    };
    var origRender = E1.render;
    E1.render = function () { wrapLayouts(); return origRender.apply(this, arguments); };
    var fixNode = function (n) {
      if (!n || n.nodeType !== 1) return;
      var list = n.tagName === 'IMG' || n.tagName === 'SOURCE' ? [n] : (n.querySelectorAll ? n.querySelectorAll('img,source') : []);
      for (var i = 0; i < list.length; i++) {
        var s = list[i].getAttribute('src');
        if (s && s.indexOf('assets/') === 0) list[i].setAttribute('src', BASE + s);
      }
    };
    try {
      new MutationObserver(function (ms) {
        ms.forEach(function (m) { if (m.type === 'attributes') fixNode(m.target); else m.addedNodes.forEach(fixNode); });
      }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
    } catch (e) { /* old browser: layouts are already fixed */ }
  }

  /* ------------------------------------------------------------------------
     Links
     ------------------------------------------------------------------------ */
  var PAGES = {
    overview: { file: 'index.html', route: '/hub', label: 'All screens' },
    atlas: { file: 'atlas.html', route: '/hub/atlas', label: 'Screen atlas' },
    foundations: { file: 'foundations.html', route: '/hub/foundations', label: 'Foundations' },
    components: { file: 'components.html', route: '/hub/components', label: 'Components' },
    patterns: { file: 'patterns.html', route: '/hub/patterns', label: 'Patterns and flows' },
    research: { file: 'research.html', route: '/hub/research', label: 'Research' }
  };
  var CONSOLE_ROUTE = '/work/today';

  function currentPageKey() {
    var path = (E1.state && E1.state.route && E1.state.route.path) || '';
    for (var k in PAGES) if (PAGES[k].route === path) return k;
    return null;
  }
  function pageHref(key, query) {
    if (key === 'console') return FILE() ? BASE + 'console.html' : '#' + CONSOLE_ROUTE;
    var p = PAGES[key]; if (!p) return '#/hub';
    var q = query ? E1.qs(query) : '';
    if (FILE()) {
      if (currentPageKey() === key && !BASE) return '#' + p.route + q;   /* same page: stay in it */
      return BASE + p.file + (q ? '#' + p.route + q : '');
    }
    return '#' + p.route + q;
  }
  function screenHref(s) { return !s ? '#/hub' : FILE() ? BASE + 'screens/' + s.file : '#' + s.route; }
  function pathOf(r) { r = String(r || '').replace(/^#/, ''); var i = r.indexOf('?'); return i < 0 ? r : r.slice(0, i); }
  function byRoute(route) {
    route = String(route || '').replace(/^#/, '');
    var L = LIST(), i;
    for (i = 0; i < L.length; i++) if (L[i].route === route) return L[i];
    var p = pathOf(route);
    for (i = 0; i < L.length; i++) if (pathOf(L[i].route) === p) return L[i];
    var m = E1.match && E1.match(p);
    if (m) for (i = 0; i < L.length; i++) if (L[i].pattern === m.pattern) return L[i];
    return null;
  }
  /** Href for any SPA route: the screen file when it is in the inventory (plus the hash when it differs). */
  function routeHref(route) {
    route = String(route || '').replace(/^#/, '');
    if (!FILE()) return '#' + route;
    var s = byRoute(route);
    if (!s) return BASE + 'console.html#' + route;
    return BASE + 'screens/' + s.file + (s.route === route ? '' : '#' + route);
  }
  function atlasHref(id) { return pageHref('atlas', id ? { focus: id } : null); }
  function thumbSrc(s) { return (window.E1_THUMBS && window.E1_THUMBS[s.id]) || BASE + 'thumbs/' + s.id + '.jpg'; }
  function current() {
    var r = E1.state && E1.state.route; if (!r) return null;
    return byRoute(r.path + E1.qs(r.query || {}));
  }
  E1.hub = { pages: PAGES, pageHref: pageHref, screenHref: screenHref, routeHref: routeHref, atlasHref: atlasHref, thumb: thumbSrc, byRoute: byRoute, current: current, screens: LIST };

  /* Sidebar: a "Platform" group at the top of Reference. */
  E1.navAdd('reference', { id: 'hub', label: 'All screens', href: pageHref('overview'), group: 'Platform', before: E1.nav.reference && E1.nav.reference.items[0] ? E1.nav.reference.items[0].id : undefined });
  E1.navAdd('reference', { id: 'hub-atlas', label: 'Screen atlas', href: pageHref('atlas'), group: 'Platform', after: 'hub' });

  /* ------------------------------------------------------------------------
     Styles (tokens only; everything else is the console's own components)
     ------------------------------------------------------------------------ */
  var CSS = [
    '.hub-stats{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:var(--space-3,12px)}',
    '.hub-split{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:var(--space-4,16px);align-items:start;margin-top:var(--space-5,24px)}',
    '.hub-panel{background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-md);overflow:hidden}',
    '.hub-panel__h{display:flex;justify-content:space-between;align-items:baseline;gap:8px;padding:12px 16px;border-bottom:1px solid var(--border-subtle)}',
    '.hub-panel__h h2{font:var(--weight-semibold,600) 15px/1.3 var(--font-ui);margin:0}',
    '.hub-panel__h span{font-size:12px;color:var(--text-tertiary)}',
    '.hub-steps{list-style:none;margin:0;padding:0}',
    '.hub-step{display:grid;grid-template-columns:28px minmax(0,150px) minmax(0,1fr) auto;gap:12px;align-items:center;padding:8px 16px;border-top:1px solid var(--border-subtle);text-decoration:none;color:var(--text-primary);font-size:13px}',
    '.hub-steps li:first-child .hub-step{border-top:0}',
    '.hub-step:hover{background:var(--bg-hover)}',
    '.hub-step__n{font-family:var(--font-mono);font-size:11px;color:var(--text-tertiary)}',
    '.hub-step__t{font-weight:var(--weight-semibold,600)}',
    '.hub-step__s{color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.hub-step__id{font-family:var(--font-mono);font-size:11px;color:var(--text-tertiary);white-space:nowrap}',
    '.hub-step.is-key .hub-step__n{color:var(--text-accent)}',
    '.hub-links{list-style:none;margin:0;padding:0}',
    '.hub-links a{display:grid;grid-template-columns:20px minmax(0,1fr) auto;gap:10px;align-items:center;padding:10px 16px;border-top:1px solid var(--border-subtle);text-decoration:none;color:var(--text-primary);font-size:13px}',
    '.hub-links li:first-child a{border-top:0}',
    '.hub-links a:hover{background:var(--bg-hover)}',
    '.hub-links a svg{color:var(--text-secondary)}',
    '.hub-links b{display:block;font-weight:var(--weight-semibold,600)}',
    '.hub-links small{display:block;color:var(--text-secondary);font-size:12px;line-height:1.4}',
    '.hub-links code{font-family:var(--font-mono);font-size:11px;color:var(--text-tertiary)}',
    '.hub-surfaces{padding:6px 16px 12px}',
    '.hub-surf{display:grid;grid-template-columns:minmax(0,1fr) 36px 80px;gap:10px;align-items:center;padding:5px 0;font-size:12.5px;color:var(--text-secondary);text-decoration:none}',
    '.hub-surf:hover{color:var(--text-primary)}',
    '.hub-surf b{font-family:var(--font-mono);font-weight:500;color:var(--text-primary);text-align:right;font-size:12px}',
    '.hub-bar{height:6px;border-radius:3px;background:var(--bg-sunken);overflow:hidden}',
    '.hub-bar i{display:block;height:100%;background:var(--text-tertiary);border-radius:3px}',
    /* filter bar */
    '.hub-controls{margin-top:var(--space-5,24px);border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);padding:10px 14px;display:flex;flex-direction:column;gap:8px}',
    '.hub-crow{display:flex;gap:10px;align-items:center;flex-wrap:wrap}',
    '.hub-crow__l{width:60px;flex:none;font-size:var(--text-label,11px);font-weight:var(--weight-semibold,600);letter-spacing:var(--tracking-label,.06em);text-transform:uppercase;color:var(--text-tertiary)}',
    '.hub-grow{flex:1}',
    '.hub-chips{display:flex;gap:6px;flex-wrap:wrap;flex:1;min-width:0}',
    '.hub-chip{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 10px;border-radius:var(--radius-full,999px);border:1px solid var(--border-default);background:var(--bg-canvas);color:var(--text-secondary);font:inherit;font-size:12.5px;cursor:pointer}',
    '.hub-chip .n{font-family:var(--font-mono);font-size:11px;color:var(--text-tertiary)}',
    '.hub-chip:hover{border-color:var(--border-strong);color:var(--text-primary)}',
    '.hub-chip[aria-pressed="true"]{background:var(--bg-selected);border-color:var(--border-accent);color:var(--text-primary)}',
    '.hub-search{display:flex;align-items:center;gap:8px;height:32px;padding:0 10px;min-width:300px;border:1px solid var(--border-default);border-radius:var(--radius-sm);background:var(--bg-canvas);color:var(--text-tertiary)}',
    '.hub-search input{flex:1;border:0;background:none;font:inherit;font-size:13px;color:var(--text-primary);outline:0;min-width:0}',
    '.hub-search:focus-within{border-color:var(--border-accent);box-shadow:var(--focus-shadow,none)}',
    '.hub-count{font-size:12.5px;color:var(--text-secondary);white-space:nowrap}',
    '.hub-count b{font-family:var(--font-mono);font-weight:500;color:var(--text-primary)}',
    '.hub-seg{display:inline-flex;border:1px solid var(--border-default);border-radius:var(--radius-sm);overflow:hidden}',
    '.hub-seg button{height:30px;padding:0 10px;border:0;background:var(--bg-surface);color:var(--text-secondary);font:inherit;font-size:12.5px;cursor:pointer;display:inline-flex;align-items:center;gap:6px}',
    '.hub-seg button + button{border-left:1px solid var(--border-default)}',
    '.hub-seg button[aria-pressed="true"]{background:var(--bg-selected);color:var(--text-primary);font-weight:var(--weight-semibold,600)}',
    /* groups + cards */
    '.hub-grp{margin-top:var(--space-6,32px);scroll-margin-top:calc(var(--topbar-height,48px) + 48px)}',
    '.hub-gh{display:flex;align-items:baseline;justify-content:space-between;gap:12px;flex-wrap:wrap;padding-bottom:8px;margin-bottom:12px;border-bottom:1px solid var(--border-subtle)}',
    '.hub-gh h2{font:var(--weight-semibold,600) var(--text-section,17px)/1.3 var(--font-display);margin:0;display:flex;align-items:baseline;gap:8px}',
    '.hub-gh h2 span{font:400 12px var(--font-mono);color:var(--text-tertiary)}',
    '.hub-gh p{margin:0;font-size:12px;color:var(--text-tertiary);max-width:80ch}',
    '.hub-gh p a{color:var(--text-secondary)}',
    '.hub-as{display:flex;align-items:center;gap:8px;margin:14px 0 10px}',
    '.hub-as h3{font-size:var(--text-label,11px);font-weight:var(--weight-semibold,600);letter-spacing:var(--tracking-label,.06em);text-transform:uppercase;color:var(--text-tertiary);margin:0}',
    '.hub-as span{font-family:var(--font-mono);font-size:11px;color:var(--text-tertiary)}',
    '.hub-as::after{content:"";flex:1;height:1px;background:var(--border-subtle)}',
    '.hub-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--hub-min,200px),1fr));gap:12px}',
    '.hub-card{display:flex;flex-direction:column;overflow:hidden;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-md);text-decoration:none;color:var(--text-primary);position:relative;scroll-margin-top:120px}',
    '.hub-card:hover{border-color:var(--border-strong);box-shadow:var(--shadow-1)}',
    '.hub-card:focus-visible{outline:var(--focus-width,2px) solid var(--focus-ring);outline-offset:2px}',
    '.hub-card__thumb{position:relative;display:block;aspect-ratio:1440/900;background:var(--bg-sunken);border-bottom:1px solid var(--border-subtle);overflow:hidden}',
    '.hub-card__thumb img{display:block;width:100%;height:100%;object-fit:cover;object-position:top left}',
    '.hub-card__ph{position:absolute;inset:0;display:none;place-items:center;font-family:var(--font-mono);font-size:11px;color:var(--text-tertiary);padding:8px;text-align:center}',
    '.hub-card__thumb.is-missing img{display:none}',
    '.hub-card__thumb.is-missing .hub-card__ph{display:grid}',
    '.hub-card__b{display:flex;flex-direction:column;gap:4px;padding:8px 10px 10px;flex:1}',
    '.hub-card__m{display:flex;align-items:center;gap:6px}',
    '.hub-id{font-family:var(--font-mono);font-size:11px;color:var(--text-secondary)}',
    '.hub-ty{font-size:10px;font-weight:var(--weight-semibold,600);letter-spacing:.06em;text-transform:uppercase;color:var(--text-secondary);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:0 5px;line-height:16px}',
    '.hub-no{margin-left:auto;font-family:var(--font-mono);font-size:10.5px;color:var(--text-tertiary)}',
    '.hub-card__t{font-weight:var(--weight-semibold,600);font-size:13px;line-height:1.3}',
    '.hub-card__sec{font-size:11.5px;color:var(--text-tertiary)}',
    '.hub-card__s{font-size:12px;line-height:1.4;color:var(--text-secondary);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
    '.hub-card__src{margin-top:auto;padding-top:5px;border-top:1px solid var(--border-subtle);font-family:var(--font-mono);font-size:10.5px;color:var(--text-tertiary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.hub-card.is-target{border-color:var(--border-accent);box-shadow:0 0 0 2px var(--border-accent)}',
    '.hub-tv{margin-top:var(--space-5,24px)}',
    '.hub-tv tr.is-target td{background:var(--bg-selected)}',
    '.hub-tv .hub-grprow td{background:var(--bg-sunken);font-weight:var(--weight-semibold,600)}',
    '.hub-tv .spec{font-size:12.5px;color:var(--text-secondary);max-width:60ch}',
    '.hub-root [hidden]{display:none!important}',
    'body:has(.hub-root) .e1-pill-layer{display:none!important}',
    '@media (max-width:1100px){.hub-stats{grid-template-columns:repeat(3,minmax(0,1fr))}.hub-split{grid-template-columns:1fr}}',
    '@media (max-width:720px){.hub-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.hub-step{grid-template-columns:24px minmax(0,1fr);row-gap:2px}.hub-step__s{grid-column:2;white-space:normal}.hub-step__id{grid-column:2}.hub-search{min-width:0;flex:1 1 100%}.hub-crow__l{width:auto;flex-basis:100%}.hub-cards{--hub-min:150px}}'
  ].join('\n');
  (function injectCss() {
    if (document.getElementById('e1-hub-css')) return;
    var st = document.createElement('style'); st.id = 'e1-hub-css'; st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
  })();

  /* ------------------------------------------------------------------------
     Inventory helpers
     ------------------------------------------------------------------------ */
  function icon(n, s) { return E1.icon ? E1.icon(n, s || 16) : ''; }
  /* Console first, then the other ways in, the website, the reference, the system states. */
  var SURFACE_ORDER = ['console · work', 'console · records', 'console · agents', 'console · assurance', 'console · evidence (l2/l3)',
    'mobile & channels', 'portals', 'developer portal', 'access & onboarding', 'public site', 'design system & reference', 'system'];
  function surfRank(k) { var i = SURFACE_ORDER.indexOf(String(k).toLowerCase()); return i < 0 ? 99 : i; }
  function groupBy(list, key) {
    var order = [], map = {};
    list.forEach(function (s) { var k = s[key] || 'Other'; if (!map[k]) { map[k] = []; order.push(k); } map[k].push(s); });
    return { order: order, map: map };
  }
  function bySurface(L) {
    var g = groupBy(L, 'surface');
    g.order = g.order.map(function (k, i) { return [k, i]; }).sort(function (a, b) { return (surfRank(a[0]) - surfRank(b[0])) || (a[1] - b[1]); }).map(function (x) { return x[0]; });
    return g;
  }
  function doorOf(s) {
    if (s.door && E1.DOORS.indexOf(s.door) > -1) return s.door;
    var seg = pathOf(s.route).split('/')[1];
    return E1.DOORS.indexOf(seg) > -1 ? seg : (seg === 'reference' ? 'reference' : 'none');
  }
  var DOOR_LABEL = { work: 'Work', records: 'Records', agents: 'Agents', assurance: 'Assurance', reference: 'Reference', none: 'Outside the doors' };
  function num3(n) { n = String(n); while (n.length < 3) n = '0' + n; return n; }
  function statesCount(L) { return L.reduce(function (a, s) { return a + Math.max(1, (s.states || []).length); }, 0); }
  function srcText(s) { return Array.isArray(s.src) ? s.src.join(', ') : (s.src || ''); }
  function haystack(s) {
    return [s.n, num3(s.n), s.id, s.file, s.title, s.route, s.surface, s.section, s.type, srcText(s), s.spec, (s.components || []).join(' ')].join(' ').toLowerCase();
  }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function cssEsc(s) { return String(s).replace(/[^a-zA-Z0-9_-]/g, function (ch) { return '\\' + ch; }); }
  function focusId(f) {
    if (!f) return null; f = String(f).toLowerCase();
    var L = LIST();
    for (var i = 0; i < L.length; i++) if (String(L[i].id).toLowerCase() === f || String(L[i].file).toLowerCase() === f || String(L[i].n) === f.replace(/^0+/, '')) return L[i].id;
    return null;
  }
  function focusCard(el, sel) {
    var t = el.querySelector(sel); if (!t) return;
    t.classList.add('is-target');
    setTimeout(function () { try { t.scrollIntoView({ block: 'center' }); } catch (e) { t.scrollIntoView(); } }, 30);
  }

  var SURFACE_NOTES = {
    'public site': 'The website: product, assurance levels, packs, pricing, audiences, trust and the company pages.',
    'access & onboarding': 'Sign-in, single sign-on, invitations, tenant choice, account pages and the eleven-step setup.',
    'console · work': 'What needs me now — Today, approvals, Decide, not done, requests, reviews and obligations.',
    'mobile & channels': 'Deciding on a phone, and approvals through WhatsApp, voice and e-mail.',
    'console · records': 'What changed, and what may change — systems, objects, declarations, the studio, write types, tenants, packs.',
    'console · agents': 'Who and what is acting here — registry, autonomy, graduation, people, roles, keys and channels.',
    'console · assurance': 'Can I show someone this was done properly — proof, chain, coverage, refusals, operations, the meter.',
    'console · evidence (l2/l3)': 'What arrives at Level 2 Attested and Level 3 Proven — signing, anchoring, bundles, receipts, controls.',
    'portals': 'Outside readers — the offline verifier, auditor, regulator, counterparty and partner portals, the trust centre.',
    'developer portal': 'Quickstart, KernelPort, the SDKs, the HTTP API, webhooks, the seal, the verifier, conformance.',
    'design system & reference': 'The design system and the programme documents, live inside the console.',
    'system': 'Not found, not allowed, maintenance, offline and outage — what happened, that nothing changed, the way on.'
  };
  function surfaceNote(k, list) {
    var n = SURFACE_NOTES[String(k).toLowerCase()];
    if (n) return n;
    var secs = groupBy(list, 'section').order;
    return secs.slice(0, 6).join(' · ') + (secs.length > 6 ? ' and ' + (secs.length - 6) + ' more' : '');
  }

  function card(s, opts) {
    opts = opts || {};
    return '<a class="hub-card" id="' + (opts.idPrefix || 'hc-') + esc(s.id) + '" href="' + esc(screenHref(s)) + '" data-id="' + esc(s.id) + '" aria-label="' + esc(s.id + ' ' + s.title) + '">' +
      '<span class="hub-card__thumb"><img loading="lazy" decoding="async" src="' + esc(thumbSrc(s)) + '" alt="" onerror="this.parentNode.classList.add(\'is-missing\')">' +
        '<span class="hub-card__ph" aria-hidden="true">' + esc(s.file) + '</span></span>' +
      '<span class="hub-card__b"><span class="hub-card__m"><span class="hub-id">' + esc(s.id) + '</span><span class="hub-ty">' + esc(s.type || 'screen') + '</span><span class="hub-no">' + num3(s.n) + '</span></span>' +
        '<span class="hub-card__t">' + esc(s.title) + '</span>' +
        (opts.full ? '<span class="hub-card__sec">' + esc(s.section) + '</span><span class="hub-card__s">' + esc(s.spec || '') + '</span>' +
          (srcText(s) ? '<span class="hub-card__src" title="Sources: ' + esc(srcText(s)) + '">' + esc(srcText(s)) + '</span>' : '') : '') +
      '</span></a>';
  }
  function chipRow(id, label, vals, counts, sel, fmt) {
    sel = sel ? String(sel).split(',') : [];
    return '<div class="hub-crow"><span class="hub-crow__l">' + esc(label) + '</span><div class="hub-chips" id="' + id + '" role="group" aria-label="Filter by ' + esc(label.toLowerCase()) + '">' +
      '<button type="button" class="hub-chip" data-all aria-pressed="' + (!sel.length) + '">All</button>' +
      vals.map(function (v) { return '<button type="button" class="hub-chip" data-v="' + esc(v) + '" aria-pressed="' + (sel.indexOf(v) > -1) + '">' + esc(fmt ? fmt(v) : v) + ' <span class="n">' + counts(v) + '</span></button>'; }).join('') + '</div></div>';
  }
  /* Shared in-page filtering for both pages. */
  function wireFilters(el, opts) {
    var L = LIST(), by = {}; L.forEach(function (s) { by[s.id] = s; });
    var sel = opts.sel, q = el.querySelector(opts.q);
    var cards = [].slice.call(el.querySelectorAll(opts.cards)), rows = opts.rows ? [].slice.call(el.querySelectorAll(opts.rows)) : [];
    function match(s) {
      if (sel.surface.length && sel.surface.indexOf(s.surface) < 0) return false;
      if (sel.type.length && sel.type.indexOf(s.type) < 0) return false;
      if (sel.door && sel.door.length && sel.door.indexOf(doorOf(s)) < 0) return false;
      var words = q.value.toLowerCase().split(/\s+/).filter(Boolean), h = haystack(s);
      return words.every(function (w) { return h.indexOf(w) > -1; });
    }
    function apply() {
      var n = 0;
      cards.forEach(function (x) { var ok = match(by[x.getAttribute('data-id')]); x.hidden = !ok; if (ok) n++; });
      el.querySelectorAll('[data-sec]').forEach(function (a) { var v = a.querySelectorAll('.hub-card:not([hidden])').length; a.hidden = !v; var sn = a.querySelector('[data-sn]'); if (sn) sn.textContent = v; });
      el.querySelectorAll('.hub-grp').forEach(function (a) { var v = a.querySelectorAll('.hub-card:not([hidden])').length; a.hidden = !v; a.querySelector('[data-gn]').textContent = v + ' screen' + (v === 1 ? '' : 's'); });
      rows.forEach(function (r) { r.hidden = !match(by[r.getAttribute('data-id')]); });
      el.querySelectorAll('tr[data-grp]').forEach(function (g) { var k = g.getAttribute('data-grp'); g.hidden = !rows.some(function (r) { return !r.hidden && by[r.getAttribute('data-id')].surface === k; }); });
      el.querySelector(opts.count).innerHTML = 'Showing <b>' + n + '</b> of <b>' + L.length + '</b>';
      el.querySelector(opts.empty).hidden = n > 0;
    }
    Object.keys(opts.chips).forEach(function (key) {
      var box = el.querySelector(opts.chips[key]); if (!box) return;
      box.addEventListener('click', function (e) {
        var b = e.target.closest('.hub-chip'); if (!b) return;
        var arr = sel[key];
        if (b.hasAttribute('data-all')) arr.length = 0;
        else { var v = b.getAttribute('data-v'), i = arr.indexOf(v); if (i > -1) arr.splice(i, 1); else arr.push(v); }
        box.querySelectorAll('.hub-chip').forEach(function (ch) { ch.setAttribute('aria-pressed', ch.hasAttribute('data-all') ? String(!arr.length) : String(arr.indexOf(ch.getAttribute('data-v')) > -1)); });
        apply();
      });
    });
    q.addEventListener('input', apply);
    el.addEventListener('click', function (e) {
      if (!e.target.closest('[data-hub-clear]')) return;
      Object.keys(sel).forEach(function (k) { sel[k].length = 0; }); q.value = '';
      el.querySelectorAll('.hub-chip').forEach(function (ch) { ch.setAttribute('aria-pressed', String(ch.hasAttribute('data-all'))); });
      apply(); q.focus();
    });
    apply();
  }
  function emptyBlock(id, L) {
    return '<div id="' + id + '" hidden style="margin-top:24px">' + c().empty({
      title: 'No screen matches these filters',
      why: 'None of the ' + L.length + ' screens has that text in its number, id, title, section, spec or sources within the selected filters.',
      fill: 'Clear the filters, or search for a record id such as OB-2026-0412, a route word such as “proof”, or a type such as “decide”.',
      action: '<button type="button" class="e1-btn e1-btn--secondary" data-hub-clear><span>Clear filters</span></button>'
    }) + '</div>';
  }

  /* ------------------------------------------------------------------------
     /hub — All screens
     ------------------------------------------------------------------------ */
  var JOURNEY = [
    ['Ask', 'A person asks for a change in plain words', '/work/requests'],
    ['Propose', 'An agent drafts the write; it arrives in a queue', '/work/approvals'],
    ['Gates', 'Ten checks run before anything reaches the system', '/assurance/proof/4101/path'],
    ['Decide', 'What changes, why, who asked, every gate', '/work/decide/OB-2026-0412'],
    ['Approve or reject', 'A named person commits it, or says no with a reason', '/work/decide/OB-2026-0412?state=approved'],
    ['Act', 'The write lands in the system of record, once', '/work/writes/4101'],
    ['Proof', 'A hash-linked record of who did what, and why', '/assurance/proof/4101'],
    ['Meter', 'Every governed write is counted and priced', '/assurance/meter'],
    ['Verify', 'Anyone can check the bundle offline', '/verify'],
    ['Undo', 'Reverse it inside its window, with its own proof', '/work/reverse/4097']
  ];
  var REFLINKS = [
    ['atlas', 'rows', 'Screen atlas', 'Every screen with its spec and sources, as a grid or a table'],
    ['foundations', 'layers', 'Foundations', 'Colour, type, space and motion, icons, brand in product'],
    ['components', 'grid', 'Components', 'Every E1.c component with its states, layouts, accessibility'],
    ['patterns', 'git-branch', 'Patterns and flows', 'Screen patterns, end-to-end flows, information architecture'],
    ['research', 'eye', 'Research', '27 competitors, benchmarks, sources, atlas figures, decisions']
  ];

  function renderOverview(params, query) {
    var L = LIST(), g = bySurface(L), types = groupBy(L, 'type');
    if (!L.length) return '<div class="hub-root">' + c().pageHeader({ eyebrow: 'elan1 platform', title: 'All screens' }) + c().empty({ title: 'The screen inventory has not loaded', why: 'window.E1_SCREENS is empty, so there are no screens to list.', fill: 'Load js/inventory.js before js/hub.js.' }) + '</div>';
    var header = c().pageHeader({
      eyebrow: 'elan1 platform', title: 'All screens',
      lead: 'Every screen of the platform in one workspace — ' + L.length + ' of them, each a live page you can open, numbered in review order.',
      actions: c().button('Design system', { icon: 'layers', href: pageHref('foundations') }) + c().button('Screen atlas', { icon: 'grid', href: pageHref('atlas') }) + c().button('Open the console', { kind: 'primary', icon: 'home', href: pageHref('console') })
    });
    var stats = '<div class="hub-stats">' +
      c().stat({ label: 'Screens', value: String(L.length), note: 'Each is its own file, linked and numbered.', href: pageHref('atlas') }) +
      c().stat({ label: 'States documented', value: String(statesCount(L)), note: 'Clickable variants, listed in each screen’s notes.' }) +
      c().stat({ label: 'Doors', value: '4', note: 'Work · Records · Agents · Assurance.', href: pageHref('console') }) +
      c().stat({ label: 'Surfaces', value: String(g.order.length), note: 'Console, portals, developer portal, website and more.' }) +
      c().stat({ label: 'Source documents', value: '87', note: 'Every screen names the ones that shaped it.', href: pageHref('research', { tab: 'sources' }) }) +
      '</div>';
    var steps = '<section class="hub-panel" aria-labelledby="hub-start"><div class="hub-panel__h"><h2 id="hub-start">Start here · the governed write in ten screens</h2><span>Each row opens the real screen</span></div><ol class="hub-steps" role="list">' +
      JOURNEY.map(function (j, i) {
        var s = byRoute(j[2]);
        return '<li><a class="hub-step' + (i === 3 ? ' is-key' : '') + '" href="' + esc(routeHref(j[2])) + '"><span class="hub-step__n">' + (i < 9 ? '0' : '') + (i + 1) + '</span><span class="hub-step__t">' + esc(j[0]) + '</span><span class="hub-step__s">' + esc(j[1]) + '</span><span class="hub-step__id">' + esc(s ? s.id + ' · ' + s.title : j[2]) + '</span></a></li>';
      }).join('') + '</ol></section>';
    var side = '<div style="display:flex;flex-direction:column;gap:16px">' +
      '<section class="hub-panel" aria-labelledby="hub-ds"><div class="hub-panel__h"><h2 id="hub-ds">Reference</h2><span>elan1 design system v1.1</span></div><ul class="hub-links" role="list">' +
        REFLINKS.map(function (r) { return '<li><a href="' + esc(pageHref(r[0])) + '">' + icon(r[1], 16) + '<span><b>' + esc(r[2]) + '</b><small>' + esc(r[3]) + '</small></span>' + icon('chevron-right', 14) + '</a></li>'; }).join('') + '</ul></section>' +
      '</div>';
    var controls = '<section class="hub-controls" aria-label="Filter screens"><div class="hub-crow">' +
        '<label class="hub-search">' + icon('search', 14) + '<span class="e1-sr">Search screens</span><input id="hub-q" type="search" value="' + esc(query.q || '') + '" placeholder="Search by number, id, title, section or spec" autocomplete="off"></label>' +
        '<span class="hub-count" id="hub-count" aria-live="polite"></span><span class="hub-grow"></span>' +
        c().button('Screen atlas', { size: 'sm', icon: 'grid', href: pageHref('atlas') }) + '</div>' +
        chipRow('hub-f-surface', 'Surface', g.order, function (v) { return g.map[v].length; }, query.surface) +
        chipRow('hub-f-type', 'Type', types.order, function (v) { return types.map[v].length; }, query.type) +
      '</section>';
    var groups = g.order.map(function (k) {
      var list = g.map[k], first = list[0];
      return '<section class="hub-grp" id="hg-' + esc(slug(k)) + '" data-surface="' + esc(k) + '" aria-labelledby="hgh-' + esc(slug(k)) + '"><div class="hub-gh"><h2 id="hgh-' + esc(slug(k)) + '">' + esc(k) + ' <span data-gn>' + list.length + ' screens</span></h2>' +
        '<p>' + esc(surfaceNote(k, list)) + ' · starts at <a href="' + esc(screenHref(first)) + '">' + esc(first.id + ' ' + first.title) + '</a></p></div>' +
        '<div class="hub-cards">' + list.map(function (s) { return card(s); }).join('') + '</div></section>';
    }).join('');
    return '<div class="hub-root">' + header + stats + '<div class="hub-split">' + steps + side + '</div>' + controls + groups + emptyBlock('hub-empty', L) + '</div>';
  }
  function mountOverview(el, params, query) {
    if (!el.querySelector('#hub-q')) return;
    wireFilters(el, { q: '#hub-q', cards: '.hub-card', count: '#hub-count', empty: '#hub-empty',
      sel: { surface: query.surface ? query.surface.split(',') : [], type: query.type ? query.type.split(',') : [] },
      chips: { surface: '#hub-f-surface', type: '#hub-f-type' } });
    var fid = focusId(query.focus);
    if (fid) focusCard(el, '#hc-' + cssEsc(fid));
  }

  /* ------------------------------------------------------------------------
     /hub/atlas
     ------------------------------------------------------------------------ */
  function renderAtlas(params, query) {
    var L = LIST(), g = bySurface(L), types = groupBy(L, 'type'), doors = groupBy(L.map(function (s) { return { d: doorOf(s) }; }), 'd');
    var view = query.view || (E1.store ? E1.store.get('hub.atlas.view', 'grid') : 'grid');
    var size = query.size || (E1.store ? E1.store.get('hub.atlas.size', 'medium') : 'medium');
    var MIN = { large: 360, medium: 260, small: 200 };
    var doorVals = ['work', 'records', 'agents', 'assurance', 'reference', 'none'].filter(function (d) { return doors.map[d]; });
    var header = c().pageHeader({
      eyebrow: 'elan1 platform', title: 'Screen atlas',
      lead: 'Every screen as a thumbnail of the real page, grouped by surface then section, with its type, sources and a one-line spec. ' + L.length + ' screens · ' + statesCount(L) + ' states.',
      actions: c().button('Information architecture', { icon: 'layers', href: pageHref('patterns', { tab: 'ia' }) }) + c().button('Flows', { icon: 'git-branch', href: pageHref('patterns', { tab: 'flows' }) }) + c().button('All screens', { kind: 'primary', icon: 'rows', href: pageHref('overview') })
    });
    var controls = '<section class="hub-controls" aria-label="Filter screens"><div class="hub-crow">' +
        '<label class="hub-search">' + icon('search', 14) + '<span class="e1-sr">Search screens</span><input id="at-q" type="search" value="' + esc(query.q || '') + '" placeholder="Number, id, title, spec or source — e.g. 012, decide, W-03" autocomplete="off"></label>' +
        '<span class="hub-count" id="at-count" aria-live="polite"></span><span class="hub-grow"></span>' +
        '<div class="hub-seg" role="group" aria-label="Thumbnail size" id="at-size">' + [['large', 'Large'], ['medium', 'Medium'], ['small', 'Small']].map(function (x) { return '<button type="button" data-size="' + x[0] + '" aria-pressed="' + (size === x[0]) + '">' + x[1] + '</button>'; }).join('') + '</div>' +
        '<div class="hub-seg" role="group" aria-label="View" id="at-view"><button type="button" data-view="grid" aria-pressed="' + (view !== 'table') + '">' + icon('grid', 14) + 'Grid</button><button type="button" data-view="table" aria-pressed="' + (view === 'table') + '">' + icon('list', 14) + 'Table</button></div></div>' +
        chipRow('at-surface', 'Surface', g.order, function (v) { return g.map[v].length; }, query.surface) +
        chipRow('at-type', 'Type', types.order, function (v) { return types.map[v].length; }, query.type) +
        chipRow('at-door', 'Door', doorVals, function (v) { return doors.map[v].length; }, query.door, function (v) { return DOOR_LABEL[v] || v; }) +
      '</section>';
    var grid = '<div id="at-grid"' + (view === 'table' ? ' hidden' : '') + ' style="--hub-min:' + (MIN[size] || 260) + 'px">' + g.order.map(function (k) {
      var list = g.map[k], secs = groupBy(list, 'section'), first = list[0];
      return '<section class="hub-grp" data-surface="' + esc(k) + '" aria-labelledby="ag-' + esc(slug(k)) + '"><div class="hub-gh"><h2 id="ag-' + esc(slug(k)) + '">' + esc(k) + ' <span data-gn>' + list.length + ' screens</span></h2>' +
        '<p>' + esc(surfaceNote(k, list)) + ' · starts at <a href="' + esc(screenHref(first)) + '">' + esc(first.file) + '</a></p></div>' +
        secs.order.map(function (sec) {
          var sl = secs.map[sec];
          return '<div data-sec><div class="hub-as"><h3>' + esc(sec) + '</h3><span data-sn>' + sl.length + '</span></div><div class="hub-cards">' + sl.map(function (s) { return card(s, { full: true, idPrefix: 'at-' }); }).join('') + '</div></div>';
        }).join('') + '</section>';
    }).join('') + '</div>';
    var table = '<div id="at-table" class="hub-tv"' + (view === 'table' ? '' : ' hidden') + '><div class="e1-table-wrap"><table class="e1-table e1-table--dense"><caption class="e1-sr">All screens with surface, section, type, states, sources and spec</caption>' +
      '<thead><tr><th scope="col" style="text-align:right">No.</th><th scope="col">Screen</th><th scope="col">Section</th><th scope="col">Type</th><th scope="col" style="text-align:right">States</th><th scope="col">Sources</th><th scope="col">Spec</th></tr></thead><tbody>' +
      g.order.map(function (k) {
        return '<tr class="hub-grprow" data-grp="' + esc(k) + '"><td colspan="7">' + esc(k) + '</td></tr>' + g.map[k].map(function (s) {
          return '<tr data-id="' + esc(s.id) + '" id="tr-' + esc(s.id) + '"><td class="e1-num" style="text-align:right">' + num3(s.n) + '</td><td><a href="' + esc(screenHref(s)) + '">' + esc(s.title) + '</a><div class="e1-caption e1-muted e1-mono">' + esc(s.id + ' · ' + s.file) + '</div></td><td>' + esc(s.section) + '</td><td><span class="hub-ty">' + esc(s.type) + '</span></td><td class="e1-num" style="text-align:right">' + Math.max(1, (s.states || []).length) + '</td><td class="e1-caption e1-mono">' + esc(srcText(s)) + '</td><td class="spec">' + esc(s.spec || '') + '</td></tr>';
        }).join('');
      }).join('') + '</tbody></table></div></div>';
    return '<div class="hub-root">' + header + controls + grid + table + emptyBlock('at-empty', L) + '</div>';
  }
  function mountAtlas(el, params, query) {
    var grid = el.querySelector('#at-grid'), table = el.querySelector('#at-table');
    var MIN = { large: 360, medium: 260, small: 200 };
    wireFilters(el, { q: '#at-q', cards: '#at-grid .hub-card', rows: '#at-table tr[data-id]', count: '#at-count', empty: '#at-empty',
      sel: { surface: query.surface ? query.surface.split(',') : [], type: query.type ? query.type.split(',') : [], door: query.door ? query.door.split(',') : [] },
      chips: { surface: '#at-surface', type: '#at-type', door: '#at-door' } });
    el.querySelector('#at-size').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return; var v = b.getAttribute('data-size');
      grid.style.setProperty('--hub-min', (MIN[v] || 260) + 'px'); if (E1.store) E1.store.set('hub.atlas.size', v);
      this.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    });
    el.querySelector('#at-view').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return; var v = b.getAttribute('data-view');
      grid.hidden = v === 'table'; table.hidden = v !== 'table'; if (E1.store) E1.store.set('hub.atlas.view', v);
      this.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    });
    var fid = focusId(query.focus);
    if (fid) focusCard(el, table.hidden ? '#at-' + cssEsc(fid) : '#tr-' + cssEsc(fid));
  }

  /* ------------------------------------------------------------------------
     Design-system pages: the live /reference/* renders with section tabs.
     The wrapped page keeps its own header (one h1); the tabs join it.
     ------------------------------------------------------------------------ */
  var REF = {
    foundations: {
      title: 'Foundations', section: 'design-system',
      tabs: [['overview', 'Overview', '/reference/design-system'], ['colour', 'Colour', '/reference/design-system/colour'], ['type', 'Type', '/reference/design-system/type'], ['space', 'Space, density and motion', '/reference/design-system/space'], ['iconography', 'Iconography', '/reference/design-system/iconography'], ['brand', 'Brand in product', '/reference/design-system/brand']]
    },
    components: {
      title: 'Components', section: 'components',
      tabs: [['gallery', 'Gallery', '/reference/components'], ['layouts', 'Layouts', '/reference/layouts'], ['accessibility', 'Accessibility', '/reference/accessibility'], ['changelog', 'Changelog', '/reference/changelog']]
    },
    patterns: {
      title: 'Patterns and flows', section: 'patterns',
      tabs: [['patterns', 'Patterns', '/reference/patterns'], ['flows', 'Flows', '/reference/flows'], ['ia', 'Information architecture', '/reference/ia'], ['screen-map', 'Screen map', '/reference/screen-map']]
    },
    research: {
      title: 'Research', section: 'competitors',
      tabs: [['competitors', 'Competitor study', '/reference/competitors'], ['benchmarks', 'Benchmarks', '/reference/benchmarks'], ['sources', 'Sources', '/reference/sources'], ['atlas', 'Atlas figures', '/reference/atlas'], ['decisions', 'Decisions', '/reference/decisions']]
    }
  };
  var TAB_NAV = { overview: 'design-system', colour: 'ds-colour', type: 'ds-type', space: 'ds-space', iconography: 'ds-icons', brand: 'ds-brand', gallery: 'components' };
  var REF_MAP = {};
  Object.keys(REF).forEach(function (k) { REF[k].tabs.forEach(function (t, i) { REF_MAP[t[2]] = [k, i ? t[0] : null]; }); });
  function mapRefLinks(html) {
    html = String(html).replace(/href="#(\/reference\/[^"?#]*)"/g, function (m, p) {
      var hit = REF_MAP[p.replace(/\/$/, '')];
      if (!hit) return m;
      return 'href="' + esc(pageHref(hit[0], hit[1] ? { tab: hit[1] } : null)) + '"';
    });
    if (!FILE()) return html;
    /* file mode: a link to a screen opens that screen's own file (so its pill and notes are right) */
    return html.replace(/href="#(\/(?!reference\/|reference"|hub\b)[^"]*)"/g, function (m, r) {
      var route = r.replace(/&amp;/g, '&');
      return byRoute(route) ? 'href="' + esc(routeHref(route)) + '"' : m;
    });
  }
  function refTab(key, query) {
    var R = REF[key], t = R.tabs[0];
    for (var i = 0; i < R.tabs.length; i++) if (R.tabs[i][0] === query.tab) t = R.tabs[i];
    return t;
  }
  function innerQuery(query) { var q = {}; Object.keys(query || {}).forEach(function (k) { if (k !== 'tab') q[k] = query[k]; }); return q; }
  function renderRef(key, params, query) {
    var R = REF[key], t = refTab(key, query), m = E1.match(t[2]), body;
    try { body = m && m.def.render ? m.def.render(m.params || {}, innerQuery(query)) : c().pageHeader({ eyebrow: R.title, title: t[1] }) + c().empty({ title: 'This reference page is not registered', why: 'The route ' + t[2] + ' has no screen.' }); }
    catch (err) { E1.errors.push(err); body = c().pageHeader({ eyebrow: R.title, title: t[1] }) + c().error({ title: 'This reference page failed to render.', body: 'Nothing was changed.', code: String(err && err.message || err) }); }
    var tabs = c().tabs(R.tabs.map(function (x, i) { return { id: x[0], label: x[1], href: pageHref(key, i ? { tab: x[0] } : null) }; }), t[0], { label: R.title + ' sections' });
    body = mapRefLinks(body);
    var ph = body.indexOf('<header class="e1-ph"'), at = ph > -1 ? body.indexOf('</header>', ph) : -1;
    if (at > -1) {
      body = body.slice(0, at) + '<div class="e1-ph__tabs">' + tabs + '</div>' + body.slice(at);
    } else {
      body = tabs + body;
    }
    return '<div class="hub-root hub-ref">' + body + '</div>';
  }
  function mountRef(key, el, params, query) {
    var t = refTab(key, query), m = E1.match(t[2]);
    if (m && m.def.mount) { try { m.def.mount(el, m.params || {}, innerQuery(query)); } catch (err) { E1.errors.push(err); } }
  }

  /* ------------------------------------------------------------------------
     Routes — console pages in the Reference door
     ------------------------------------------------------------------------ */
  var PLATFORM_CRUMB = function () { return [['Reference', pageHref('overview')]]; };
  E1.route('/hub', { title: 'All screens', layout: 'console', door: 'reference', section: 'hub', wide: true, crumbs: PLATFORM_CRUMB(),
    keywords: 'all screens every screen index platform inventory thumbnails', render: renderOverview, mount: mountOverview });
  E1.route('/hub/atlas', { title: 'Screen atlas', layout: 'console', door: 'reference', section: 'hub-atlas', wide: true, crumbs: PLATFORM_CRUMB(),
    keywords: 'atlas thumbnails every screen inventory filter table', render: renderAtlas, mount: mountAtlas });
  Object.keys(REF).forEach(function (k) {
    E1.route('/hub/' + k, {
      title: function (p, q) { var t = refTab(k, q || {}); return t === REF[k].tabs[0] ? REF[k].title : REF[k].title + ' · ' + t[1]; },
      layout: 'console', door: 'reference', section: REF[k].section, crumbs: PLATFORM_CRUMB(),
      keywords: 'design system ' + REF[k].tabs.map(function (t) { return t[1]; }).join(' '),
      render: function (p, q) {
        /* highlight the sidebar item of the tab being shown */
        var t = refTab(k, q || {}), id = TAB_NAV[t[0]] || t[0], def = this && this.def ? this.def : (E1.state.route && E1.state.route.def);
        if (def) def.section = E1.navItem('reference', id) ? id : REF[k].section;
        return renderRef(k, p, q);
      },
      mount: function (el, p, q) { mountRef(k, el, p, q); }
    });
  });
})();
