/* ==========================================================================
   elan1 core v1.1 — window.E1
   Hash router, registry, state, shell renderer (console, public, auth, bare,
   doc, mobile), overlays (menu popovers, modal, drawer, sheet, toast, command
   palette, shortcut sheet), formatting helpers.
   Vanilla ES2019. No dependencies. Works from file:// and in a sandboxed
   iframe (every storage access is wrapped in try/catch).
   ========================================================================== */
(function () {
  'use strict';

  var E1 = window.E1 = window.E1 || {};
  E1.version = '1.1.0';

  /* ------------------------------------------------------------------------
     Utilities
     ------------------------------------------------------------------------ */

  /** HTML-escape any value. null/undefined → ''. */
  E1.esc = function (s) {
    if (s === null || s === undefined) return '';
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var esc = E1.esc;

  /** Persistent per-browser storage. Never throws. Keys are prefixed "e1.". */
  E1.store = {
    get: function (k, d) {
      try { var v = window.localStorage.getItem('e1.' + k); return v === null ? d : JSON.parse(v); }
      catch (e) { return d; }
    },
    set: function (k, v) {
      try { window.localStorage.setItem('e1.' + k, JSON.stringify(v)); } catch (e) { /* storage blocked */ }
    }
  };

  /** Build a query string from an object (skips null/undefined/''). */
  E1.qs = function (obj) {
    var parts = [];
    Object.keys(obj || {}).forEach(function (k) {
      var v = obj[k];
      if (v === null || v === undefined || v === '') return;
      parts.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
    });
    return parts.length ? '?' + parts.join('&') : '';
  };

  /** Build an href: E1.href('/work/approvals', {filter:'mine'}) → '#/work/approvals?filter=mine'. */
  E1.href = function (path, query) {
    path = String(path || '/').replace(/^#/, '');
    if (path.charAt(0) !== '/') path = '/' + path;
    return '#' + path + E1.qs(query);
  };

  /** A unique id for DOM wiring. */
  var uidN = 0;
  E1.uid = function (p) { uidN += 1; return (p || 'e1') + '-' + uidN; };

  /* ------------------------------------------------------------------------
     Formatting — Indian grouping, Asia/Kolkata time, relative time, hashes
     ------------------------------------------------------------------------ */
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function toDate(d) {
    if (d instanceof Date) return d;
    if (typeof d === 'number') return new Date(d);
    if (typeof d === 'string') return new Date(d);
    return new Date();
  }
  function ist(d) { // shift to IST wall clock, read with getUTC*
    var t = toDate(d).getTime();
    return new Date(t + 330 * 60000);
  }
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function groupIndian(intStr) {
    if (intStr.length <= 3) return intStr;
    var last3 = intStr.slice(-3), rest = intStr.slice(0, -3);
    return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
  }

  E1.fmt = {
    /** Indian digit grouping: 2764300 → '27,64,300'. decimals default 0. */
    num: function (n, decimals) {
      if (n === null || n === undefined || isNaN(n)) return '—';
      decimals = decimals || 0;
      var neg = n < 0, s = Math.abs(Number(n)).toFixed(decimals), parts = s.split('.');
      return (neg ? '−' : '') + groupIndian(parts[0]) + (parts[1] ? '.' + parts[1] : '');
    },
    /** Rupees with Indian grouping: E1.fmt.inr(2764300) → '₹27,64,300'. opts.decimals, opts.sign ('+' prefix for positives). */
    inr: function (n, opts) {
      opts = opts || {};
      if (n === null || n === undefined || isNaN(n)) return '—';
      var body = E1.fmt.num(Math.abs(n), opts.decimals || 0);
      var sign = n < 0 ? '−' : (opts.sign && n > 0 ? '+' : '');
      return sign + '₹' + body;
    },
    /** Compact rupees: 2764300 → '₹27.6 L', 42000000 → '₹4.2 Cr', 84000 → '₹84,000'. */
    inrShort: function (n) {
      if (n === null || n === undefined || isNaN(n)) return '—';
      var a = Math.abs(n), s = n < 0 ? '−' : '';
      if (a >= 1e7) return s + '₹' + (a / 1e7).toFixed(a >= 1e8 ? 0 : 1).replace(/\.0$/, '') + ' Cr';
      if (a >= 1e5) return s + '₹' + (a / 1e5).toFixed(a >= 1e6 ? 0 : 1).replace(/\.0$/, '') + ' L';
      return s + '₹' + E1.fmt.num(a);
    },
    /** Percent: E1.fmt.pct(11.44, 1) → '11.4%'. */
    pct: function (n, d) { return (n === null || n === undefined || isNaN(n)) ? '—' : Number(n).toFixed(d === undefined ? 0 : d) + '%'; },
    /** '24 Sep 2026' (Asia/Kolkata). */
    date: function (d) { var x = ist(d); return x.getUTCDate() + ' ' + MONTHS[x.getUTCMonth()] + ' ' + x.getUTCFullYear(); },
    /** '14:05 IST'. */
    time: function (d) { var x = ist(d); return pad(x.getUTCHours()) + ':' + pad(x.getUTCMinutes()) + ' IST'; },
    /** '24 Sep 2026, 14:05 IST'. */
    dateTime: function (d) { return E1.fmt.date(d) + ', ' + E1.fmt.time(d); },
    /** Relative to now: '3 min ago', 'in 2 h', 'just now', '4 days ago'. */
    rel: function (d, now) {
      var diff = toDate(d).getTime() - (now ? toDate(now).getTime() : Date.now());
      var a = Math.abs(diff), fut = diff > 0, v, u;
      if (a < 45000) return 'just now';
      if (a < 3600000) { v = Math.round(a / 60000); u = 'min'; }
      else if (a < 86400000) { v = Math.round(a / 3600000); u = 'h'; }
      else if (a < 86400000 * 45) { v = Math.round(a / 86400000); u = v === 1 ? 'day' : 'days'; }
      else { return E1.fmt.date(d); }
      return fut ? 'in ' + v + ' ' + u : v + ' ' + u + ' ago';
    },
    /** A duration in ms → '2h 14m', '14m 05s', '3d 4h'. */
    duration: function (ms) {
      ms = Math.max(0, ms);
      var s = Math.floor(ms / 1000), d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
      if (d > 0) return d + 'd ' + h + 'h';
      if (h > 0) return h + 'h ' + pad(m) + 'm';
      return m + 'm ' + pad(sec) + 's';
    },
    /** 'fa671de7ed…de9ff5e3' (head 10, tail 8 by default). */
    shortHash: function (h, head, tail) {
      h = String(h || ''); head = head || 10; tail = tail || 8;
      return h.length <= head + tail + 1 ? h : h.slice(0, head) + '…' + h.slice(-tail);
    },
    /** Plural helper: E1.fmt.plural(3,'approval') → '3 approvals'. */
    plural: function (n, word, pluralWord) { return E1.fmt.num(n) + ' ' + (n === 1 ? word : (pluralWord || word + 's')); }
  };

  /** Timestamps relative to page load, for sample data: E1.ago(90) → ISO 90 min ago; E1.ahead(30) → ISO 30 min ahead. */
  var LOAD = Date.now();
  E1.ago = function (mins) { return new Date(LOAD - mins * 60000).toISOString(); };
  E1.ahead = function (mins) { return new Date(LOAD + mins * 60000).toISOString(); };

  /* ------------------------------------------------------------------------
     State
     ------------------------------------------------------------------------ */
  var prefersDark = false;
  try { prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; } catch (e) { /* no mm */ }

  E1.state = {
    theme: E1.store.get('theme', prefersDark ? 'dark' : 'light'), // 'light' | 'dark'
    density: E1.store.get('density', 'default'),                   // 'compact' | 'default' | 'comfortable'
    level: E1.store.get('level', 'L1'),                             // 'L1' | 'L2' | 'L3'
    env: E1.store.get('env', 'sandbox'),                            // 'sandbox' | 'production'
    tenant: E1.store.get('tenant', 'kaveri-spinning'),
    panel: E1.store.get('panel', true),                             // wide sidebar (true) or icon rail (false) on desktop
    singleKeys: E1.store.get('singleKeys', true),                   // single-character shortcuts (WCAG 2.1.4: can be turned off)
    route: { path: '/', params: {}, query: {}, def: null, pattern: null }
  };
  var PERSIST = { theme: 1, density: 1, level: 1, env: 1, tenant: 1, panel: 1, singleKeys: 1 };

  function applyRootAttrs() {
    var r = document.documentElement;
    r.setAttribute('data-theme', E1.state.theme);
    r.setAttribute('data-density', E1.state.density);
    r.setAttribute('data-level', E1.state.level);
    r.setAttribute('data-env', E1.state.env);
  }

  /**
   * Set a state key, persist it (theme, density, level, env, tenant, panel),
   * re-render the current route, and dispatch `e1:state` on document.
   * opts.silent skips the re-render.
   */
  E1.set = function (key, value, opts) {
    opts = opts || {};
    E1.state[key] = value;
    if (PERSIST[key]) E1.store.set(key, value);
    applyRootAttrs();
    try { document.dispatchEvent(new CustomEvent('e1:state', { detail: { key: key, value: value } })); } catch (e) { /* old */ }
    if (!opts.silent) E1.render({ keepScroll: true });
  };

  /* ------------------------------------------------------------------------
     Navigation model — the Four Doors + Reference
     ------------------------------------------------------------------------ */
  E1.DOORS = ['work', 'records', 'agents', 'assurance'];
  E1.nav = {
    work: {
      label: 'Work', icon: 'work', question: 'What needs me now', key: 'w',
      items: [
        { id: 'today', label: 'Today', href: '#/work/today', group: 'Queues' },
        { id: 'approvals', label: 'Approvals', href: '#/work/approvals', group: 'Queues', count: 14 },
        { id: 'escalations', label: 'Escalations', href: '#/work/escalations', group: 'Queues' },
        { id: 'not-done', label: 'Not done', href: '#/work/not-done', group: 'Queues', count: 7 },
        { id: 'requests', label: 'Requests', href: '#/work/requests', group: 'Changes' },
        { id: 'reviews', label: 'Reviews', href: '#/work/reviews', group: 'Changes' },
        { id: 'obligations', label: 'Obligations calendar', href: '#/work/obligations', group: 'Plan' }
      ]
    },
    records: {
      label: 'Records', icon: 'records', question: 'What changed, and what may change?', key: 'r',
      items: [
        { id: 'systems', label: 'Connected systems', href: '#/records/systems', group: 'State' },
        { id: 'objects', label: 'Objects', href: '#/records/objects', group: 'State' },
        { id: 'declarations', label: 'Declarations', href: '#/records/declarations', group: 'Declare' },
        { id: 'studio', label: 'Studio', href: '#/records/studio', group: 'Declare' },
        { id: 'write-types', label: 'Write types', href: '#/records/write-types', group: 'Declare' },
        { id: 'changesets', label: 'Changesets & runs', href: '#/records/changesets', group: 'Change' },
        { id: 'packs', label: 'Packs', href: '#/records/packs', group: 'Change' },
        { id: 'tenants', label: 'Tenants', href: '#/records/tenants', group: 'Access' }
      ]
    },
    agents: {
      label: 'Agents', icon: 'agents', question: 'Who and what is acting here', key: 'a',
      items: [
        { id: 'registry', label: 'Registry', href: '#/agents/registry', group: 'Agents' },
        { id: 'discovered', label: 'Discovered', href: '#/agents/discovered', group: 'Agents' },
        { id: 'autonomy', label: 'Autonomy', href: '#/agents/autonomy', group: 'Agents' },
        { id: 'graduation', label: 'Graduation', href: '#/agents/graduation', group: 'Agents' },
        { id: 'people', label: 'People', href: '#/agents/people', group: 'People' },
        { id: 'roles', label: 'Roles', href: '#/agents/roles', group: 'People' },
        { id: 'keys', label: 'Keys', href: '#/agents/keys', group: 'Access' },
        { id: 'channels', label: 'Channels', href: '#/agents/channels', group: 'Access' },
        { id: 'tools', label: 'Tools', href: '#/agents/tools', group: 'Integrations' },
        { id: 'webhooks', label: 'Webhooks', href: '#/agents/webhooks', group: 'Integrations' }
      ]
    },
    assurance: {
      label: 'Assurance', icon: 'assurance', question: 'Can I show someone this was done properly', key: 's',
      items: [
        { id: 'proof', label: 'Proof', href: '#/assurance/proof', group: 'Evidence' },
        { id: 'chain', label: 'Chain standing', href: '#/assurance/chain', group: 'Evidence' },
        { id: 'coverage', label: 'Coverage', href: '#/assurance/coverage', group: 'Evidence' },
        { id: 'refusals', label: 'Refusals', href: '#/assurance/refusals', group: 'Evidence' },
        { id: 'enforcement', label: 'Enforcement', href: '#/assurance/enforcement', group: 'Evidence' },
        { id: 'system-map', label: 'System map', href: '#/assurance/system-map', group: 'Operations' },
        { id: 'runtime', label: 'Runtime', href: '#/assurance/runtime', group: 'Operations' },
        { id: 'incidents', label: 'Incidents', href: '#/assurance/incidents', group: 'Operations' },
        { id: 'level', label: 'Assurance level', href: '#/assurance/level', group: 'Level' },
        { id: 'upgrade', label: 'Upgrade to L2', href: '#/assurance/upgrade', group: 'Level' },
        { id: 'bundles', label: 'Evidence bundles', href: '#/assurance/bundles', group: 'Level' },
        { id: 'exports', label: 'Exports', href: '#/assurance/exports', group: 'Level' },
        { id: 'receipts', label: 'Action receipts', href: '#/assurance/receipts', group: 'Level' },
        { id: 'controls', label: 'Controls & regulations', href: '#/assurance/controls', group: 'Level' },
        { id: 'disclosures', label: 'Disclosures', href: '#/assurance/disclosures', group: 'Level' },
        { id: 'meter', label: 'Meter', href: '#/assurance/meter', group: 'Account' },
        { id: 'invoices', label: 'Invoices', href: '#/assurance/invoices', group: 'Account' },
        { id: 'plan', label: 'Plan', href: '#/assurance/plan', group: 'Account' }
      ]
    },
    reference: {
      label: 'Reference', icon: 'book', question: 'How this is built', key: 'x',
      items: [
        { id: 'design-system', label: 'Design system', href: '#/reference/design-system', group: 'Design system' },
        { id: 'components', label: 'Components', href: '#/reference/components', group: 'Design system' },
        { id: 'patterns', label: 'Patterns', href: '#/reference/patterns', group: 'Design system' },
        { id: 'competitors', label: 'Competitor study', href: '#/reference/competitors', group: 'Market' },
        { id: 'benchmarks', label: 'Benchmarks', href: '#/reference/benchmarks', group: 'Market' },
        { id: 'screen-map', label: 'Screen map', href: '#/reference/screen-map', group: 'Programme' },
        { id: 'ia', label: 'Information architecture', href: '#/reference/ia', group: 'Programme' },
        { id: 'flows', label: 'Flows', href: '#/reference/flows', group: 'Programme' },
        { id: 'atlas', label: 'Architecture atlas', href: '#/reference/atlas', group: 'Programme' },
        { id: 'decisions', label: 'Decisions', href: '#/reference/decisions', group: 'Programme' },
        { id: 'sources', label: 'Sources', href: '#/reference/sources', group: 'Programme' }
      ]
    }
  };

  /**
   * Append (or replace, by id) a sidebar item in a door.
   * item: {id, label, href, group?, count?, after?: id, before?: id}
   */
  E1.navAdd = function (door, item) {
    var d = E1.nav[door];
    if (!d) { d = E1.nav[door] = { label: door, icon: 'file', question: '', items: [] }; }
    var items = d.items, i;
    for (i = 0; i < items.length; i++) { if (items[i].id === item.id) { items[i] = Object.assign({}, items[i], item); return items[i]; } }
    var idx = -1, ref = item.after || item.before;
    if (ref) { for (i = 0; i < items.length; i++) { if (items[i].id === ref) { idx = item.after ? i + 1 : i; break; } } }
    if (idx < 0) items.push(item); else items.splice(idx, 0, item);
    return item;
  };

  /** Find a nav item by door + id. */
  E1.navItem = function (door, id) {
    var d = E1.nav[door]; if (!d) return null;
    for (var i = 0; i < d.items.length; i++) if (d.items[i].id === id) return d.items[i];
    return null;
  };

  /** The home href for a door: the first item's href. */
  E1.doorHome = function (door) { var d = E1.nav[door]; return d && d.items[0] ? d.items[0].href : '#/'; };

  /* Public site navigation — the public-site agent may overwrite these arrays.
     Links to unregistered routes are hidden automatically. */
  E1.site = {
    header: [
      { label: 'Product', href: '#/product' },
      { label: 'Assurance levels', href: '#/assurance-levels' },
      { label: 'Packs', href: '#/packs' },
      { label: 'Pricing', href: '#/pricing' },
      { label: 'Developers', href: '#/developers' },
      { label: 'Verify a record', href: '#/verify' }
    ],
    cta: [
      { label: 'Sign in', href: '#/auth/sign-in', kind: 'ghost' },
      { label: 'Book a working session', href: '#/demo', kind: 'primary' }
    ],
    footer: [
      { title: 'Product', links: [{ label: 'Control plane', href: '#/product' }, { label: 'How it works', href: '#/product/how-it-works' }, { label: 'Assurance levels', href: '#/assurance-levels' }, { label: 'Packs', href: '#/packs' }, { label: 'Pricing', href: '#/pricing' }] },
      { title: 'Proof', links: [{ label: 'Verify a record', href: '#/verify' }, { label: 'Evidence', href: '#/evidence' }, { label: 'Security', href: '#/security' }, { label: 'Developers', href: '#/developers' }, { label: 'Status', href: '#/status' }] },
      { title: 'Company', links: [{ label: 'About', href: '#/about' }, { label: 'Careers', href: '#/careers' }, { label: 'Contact', href: '#/contact' }, { label: 'Glossary', href: '#/glossary' }, { label: 'Design system', href: '#/reference/design-system' }] }
    ],
    legal: 'elan1 is built on Claude. Governed agentic applications for the work that commits your business.',
    filter: false // true hides links whose route is not registered
  };

  /* Doc layout navigation: [{title, items:[{label, href}]}] */
  E1.docNav = [];
  /** Add a link to the doc layout's left navigation under a group title. */
  E1.docNavAdd = function (groupTitle, item) {
    var g = null;
    for (var i = 0; i < E1.docNav.length; i++) if (E1.docNav[i].title === groupTitle) g = E1.docNav[i];
    if (!g) { g = { title: groupTitle, items: [] }; E1.docNav.push(g); }
    g.items.push(item);
    return item;
  };

  /* ------------------------------------------------------------------------
     Router
     ------------------------------------------------------------------------ */
  E1.routes = [];

  function compile(pattern) {
    var keys = [];
    var norm = normPath(pattern);
    var src = norm.split('/').map(function (seg) {
      if (seg.charAt(0) === ':') { keys.push(seg.slice(1)); return '([^/]+)'; }
      if (seg === '*') { keys.push('rest'); return '(.*)'; }
      return seg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }).join('/');
    var statics = norm.split('/').filter(function (s) { return s && s.charAt(0) !== ':' && s !== '*'; }).length;
    return { re: new RegExp('^' + src + '$'), keys: keys, statics: statics, segs: norm.split('/').length };
  }
  function normPath(p) {
    p = String(p || '/').replace(/^#/, '');
    if (p.charAt(0) !== '/') p = '/' + p;
    if (p.length > 1) p = p.replace(/\/+$/, '');
    return p;
  }

  /**
   * Register a screen.
   * def: {title (string|fn(params,query)), layout, door, section, crumbs, render(params,query) → html,
   *       mount?(el,params,query), example?: '/path/with/real/id' (palette entry for :param routes),
   *       keywords?: string, palette?: false, redirect?: '/path', lead?: string (mobile caption),
   *       wide?: bool (console: remove max width), back?: [label, href] (mobile/bare),
   *       docNav?: [{title, items:[{label, href, active?}]}] | fn(params, query) → that (doc layout: replaces E1.docNav), docLabel?: string (doc header label, default 'Docs') }
   * Registering the same pattern twice replaces the earlier definition.
   */
  E1.route = function (pattern, def) {
    var c = compile(pattern);
    var entry = { pattern: normPath(pattern), re: c.re, keys: c.keys, statics: c.statics, segs: c.segs, def: def || {} };
    for (var i = 0; i < E1.routes.length; i++) {
      if (E1.routes[i].pattern === entry.pattern) { E1.routes[i] = entry; return entry; }
    }
    E1.routes.push(entry);
    return entry;
  };

  function parseQuery(s) {
    var q = {};
    if (!s) return q;
    s.split('&').forEach(function (pair) {
      if (!pair) return;
      var i = pair.indexOf('='), k = i < 0 ? pair : pair.slice(0, i), v = i < 0 ? '' : pair.slice(i + 1);
      try { k = decodeURIComponent(k.replace(/\+/g, ' ')); v = decodeURIComponent(v.replace(/\+/g, ' ')); } catch (e) { /* keep raw */ }
      q[k] = v;
    });
    return q;
  }
  function parseHash(h) {
    h = (h === undefined ? window.location.hash : h).replace(/^#/, '');
    if (!h) h = '/';
    var qi = h.indexOf('?');
    var path = normPath(qi < 0 ? h : h.slice(0, qi));
    return { path: path, query: parseQuery(qi < 0 ? '' : h.slice(qi + 1)) };
  }
  E1.parse = parseHash;

  /** Match a path against the registry. Most specific (most static segments) wins. */
  E1.match = function (path) {
    path = normPath(path);
    var best = null;
    E1.routes.forEach(function (r) {
      var m = r.re.exec(path);
      if (!m) return;
      if (!best || r.statics > best.r.statics) best = { r: r, m: m };
    });
    if (!best) return null;
    var params = {};
    best.r.keys.forEach(function (k, i) { try { params[k] = decodeURIComponent(best.m[i + 1]); } catch (e) { params[k] = best.m[i + 1]; } });
    return { route: best.r, def: best.r.def, params: params, pattern: best.r.pattern };
  };

  /** True if a path (or '#/path?x') resolves to a registered route. */
  E1.hasRoute = function (path) { return !!E1.match(parseHash(String(path).replace(/^#?/, '#')).path); };

  /** Navigate. E1.go('/work/approvals', {filter:'mine'}) or E1.go('#/x'). opts.replace uses location.replace. */
  E1.go = function (path, query, opts) {
    if (query && (query.replace === true) && opts === undefined) { opts = query; query = null; }
    opts = opts || {};
    var raw = String(path || '/');
    var target = raw.charAt(0) === '#' ? raw : E1.href(raw, query || undefined);
    if (target === window.location.hash) { E1.render(); return; }
    if (isForeign(target)) { // split build: the route lives in the other file
      if (opts.replace) window.location.replace(otherHref(target)); else window.location.href = otherHref(target);
      return;
    }
    if (opts.replace) {
      try { window.location.replace(target); } catch (e) { window.location.hash = target; }
    } else {
      window.location.hash = target;
    }
  };

  /* ------------------------------------------------------------------------
     Delegated events and actions
     ------------------------------------------------------------------------ */
  var handlers = [];
  /** Register a delegated listener once (at file load): E1.on('click', '[data-foo]', function(e, el){...}). */
  E1.on = function (type, selector, fn) { handlers.push({ type: type, sel: selector, fn: fn }); ensureListener(type); };
  var listening = {};
  function ensureListener(type) {
    if (listening[type]) return;
    listening[type] = true;
    document.addEventListener(type, function (e) {
      for (var i = 0; i < handlers.length; i++) {
        var h = handlers[i];
        if (h.type !== type) continue;
        var el = e.target && e.target.closest ? e.target.closest(h.sel) : null;
        if (el) { try { h.fn(e, el); } catch (err) { reportError(err); } }
      }
    }, type === 'focus' || type === 'blur');
  }

  var actions = {};
  /** Register a named action for `data-action="name"` elements: E1.action('approve', function(el, e){...}). */
  E1.action = function (name, fn) { actions[name] = fn; };
  E1.on('click', '[data-action]', function (e, el) {
    var fn = actions[el.getAttribute('data-action')];
    if (!fn) return;
    if (el.tagName === 'A') e.preventDefault();
    fn(el, e);
  });

  /* ------------------------------------------------------------------------
     Layers: overlays live outside #e1-root so re-renders never destroy them
     ------------------------------------------------------------------------ */
  function layer(id, attrs) {
    var el = document.getElementById(id);
    if (!el) {
      el = document.createElement('div');
      el.id = id;
      Object.keys(attrs || {}).forEach(function (k) { el.setAttribute(k, attrs[k]); });
      document.body.appendChild(el);
    }
    return el;
  }

  /** Announce text to screen readers (polite). */
  E1.announce = function (msg) {
    var l = layer('e1-live', { 'aria-live': 'polite', 'aria-atomic': 'true', 'class': 'e1-sr' });
    l.textContent = '';
    setTimeout(function () { l.textContent = msg; }, 30);
  };

  /* ---- Toast ---------------------------------------------------------------- */
  /**
   * E1.toast(message, kind?, opts?) — kind: 'good'|'warning'|'serious'|'critical'|'info'|'neutral' (default 'neutral').
   * opts: {title, action:{label, href}, timeout (ms, default 4200; 0 = sticky)}.
   */
  E1.toast = function (msg, kind, opts) {
    opts = opts || {}; kind = kind || 'neutral';
    var wrap = layer('e1-toasts', { 'class': 'e1-toasts', role: 'region', 'aria-label': 'Notifications' });
    var t = document.createElement('div');
    t.className = 'e1-toast e1-toast--' + kind;
    t.setAttribute('role', kind === 'critical' ? 'alert' : 'status');
    var ic = { good: 'check', warning: 'clock', serious: 'alert', critical: 'refuse', info: 'info', neutral: 'info' }[kind] || 'info';
    t.innerHTML = '<span class="e1-toast__icon">' + E1.icon(ic, 16) + '</span>' +
      '<div class="e1-toast__body">' + (opts.title ? '<strong>' + esc(opts.title) + '</strong>' : '') + '<span>' + esc(msg) + '</span></div>' +
      (opts.action ? '<a class="e1-toast__action" href="' + esc(opts.action.href) + '">' + esc(opts.action.label) + '</a>' : '') +
      '<button type="button" class="e1-toast__close" aria-label="Dismiss">' + E1.icon('x', 14) + '</button>';
    wrap.appendChild(t);
    var kill = function () { t.classList.add('is-leaving'); setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 200); };
    t.querySelector('.e1-toast__close').addEventListener('click', kill);
    if (opts.action) t.querySelector('.e1-toast__action').addEventListener('click', kill);
    var to = opts.timeout === undefined ? 4200 : opts.timeout;
    if (to) setTimeout(kill, to);
    return { close: kill, el: t };
  };

  /* ---- Overlay stack: modal, drawer, sheet, palette ------------------------ */
  var stack = [];
  var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

  function openOverlay(kind, html, opts) {
    opts = opts || {};
    var host = layer('e1-layer', { 'class': 'e1-layer' });
    var ov = document.createElement('div');
    ov.className = 'e1-ov e1-ov--' + kind + (opts.side ? ' e1-ov--' + opts.side : '');
    ov.innerHTML = '<div class="e1-ov__scrim" data-ov-close></div>' + html;
    host.appendChild(ov);
    var entry = { el: ov, kind: kind, trigger: document.activeElement, onClose: opts.onClose, dismissable: opts.dismissable !== false };
    stack.push(entry);
    document.documentElement.classList.add('e1-has-overlay');
    requestAnimationFrame(function () {
      ov.classList.add('is-open');
      var f = ov.querySelector('[autofocus]') || ov.querySelector('.e1-dialog__body ' + FOCUSABLE.split(',').join(',.e1-dialog__body ')) || ov.querySelector(FOCUSABLE);
      if (f) { try { f.focus({ preventScroll: true }); } catch (e) { f.focus(); } }
    });
    ov.addEventListener('click', function (e) {
      var c = e.target.closest('[data-ov-close]');
      if (c && (entry.dismissable || c.tagName === 'BUTTON')) { e.preventDefault(); closeEntry(entry); }
    });
    return entry;
  }
  function closeEntry(entry) {
    var i = stack.indexOf(entry);
    if (i < 0) return;
    stack.splice(i, 1);
    entry.el.classList.remove('is-open');
    entry.el.classList.add('is-leaving');
    setTimeout(function () { if (entry.el.parentNode) entry.el.parentNode.removeChild(entry.el); }, 220);
    if (!stack.length) document.documentElement.classList.remove('e1-has-overlay');
    if (entry.onClose) { try { entry.onClose(); } catch (e) { reportError(e); } }
    if (entry.trigger && entry.trigger.focus && document.body.contains(entry.trigger)) { try { entry.trigger.focus({ preventScroll: true }); } catch (e) { /* gone */ } }
  }
  /** Close the top overlay (modal/drawer/sheet/palette). E1.close(true) closes all. */
  E1.close = function (all) {
    closePops();
    if (all) { while (stack.length) closeEntry(stack[stack.length - 1]); return; }
    if (stack.length) closeEntry(stack[stack.length - 1]);
  };

  function renderActions(actionsList, entryRef) {
    return (actionsList || []).map(function (a, i) {
      var kind = a.kind || (i === actionsList.length - 1 ? 'primary' : 'secondary');
      var attrs = ' data-ov-act="' + i + '"' + (a.close === false ? '' : '') + (a.attrs ? ' ' + a.attrs : '');
      if (a.href) return '<a class="e1-btn e1-btn--' + kind + '" href="' + esc(a.href) + '"' + attrs + '>' + (a.icon ? E1.icon(a.icon, 16) : '') + '<span>' + esc(a.label) + '</span></a>';
      return '<button type="button" class="e1-btn e1-btn--' + kind + '"' + attrs + (a.disabled ? ' disabled' : '') + '>' + (a.icon ? E1.icon(a.icon, 16) : '') + '<span>' + esc(a.label) + '</span></button>';
    }).join('');
  }
  function wireActions(entry, list) {
    (list || []).forEach(function (a, i) {
      var b = entry.el.querySelector('[data-ov-act="' + i + '"]');
      if (!b) return;
      b.addEventListener('click', function (e) {
        var keep = false;
        if (a.onClick) { keep = a.onClick(e, function () { closeEntry(entry); }, entry.el) === false; }
        if (!keep && a.close !== false) closeEntry(entry);
      });
    });
  }

  /**
   * E1.modal({title, body (html), actions:[{label, kind, href?, onClick?(e, close, el) → false keeps open, close?:false}],
   *           size:'sm'|'md'|'lg', eyebrow?, dismissable?:true, onClose?}) → {el, close}
   * Focus is trapped; Escape and the scrim close it; focus returns to the trigger.
   */
  E1.modal = function (o) {
    o = o || {};
    var id = E1.uid('dlg');
    var html = '<div class="e1-dialog e1-dialog--' + (o.size || 'md') + '" role="dialog" aria-modal="true" aria-labelledby="' + id + '">' +
      '<header class="e1-dialog__head"><div>' + (o.eyebrow ? '<p class="e1-eyebrow">' + esc(o.eyebrow) + '</p>' : '') +
      '<h2 class="e1-dialog__title" id="' + id + '">' + esc(o.title || '') + '</h2></div>' +
      '<button type="button" class="e1-iconbtn" data-ov-close aria-label="Close dialog">' + E1.icon('x', 18) + '</button></header>' +
      '<div class="e1-dialog__body">' + (o.body || '') + '</div>' +
      (o.actions && o.actions.length ? '<footer class="e1-dialog__foot">' + renderActions(o.actions) + '</footer>' : '') +
      '</div>';
    var entry = openOverlay('modal', html, o);
    wireActions(entry, o.actions);
    return { el: entry.el, close: function () { closeEntry(entry); } };
  };

  /**
   * E1.drawer({title, body, actions?, side:'right'|'left'|'bottom', width?, eyebrow?, onClose?, cls?}) → {el, close}
   */
  E1.drawer = function (o) {
    o = o || {};
    var id = E1.uid('drw'), side = o.side || 'right';
    var html = '<aside class="e1-drawer e1-drawer--' + side + (o.cls ? ' ' + esc(o.cls) : '') + '" role="dialog" aria-modal="true" aria-labelledby="' + id + '"' + (o.width ? ' style="width:' + esc(o.width) + '"' : '') + '>' +
      (side === 'bottom' ? '<div class="e1-drawer__grip" aria-hidden="true"></div>' : '') +
      '<header class="e1-drawer__head"><div>' + (o.eyebrow ? '<p class="e1-eyebrow">' + esc(o.eyebrow) + '</p>' : '') +
      '<h2 class="e1-drawer__title" id="' + id + '">' + esc(o.title || '') + '</h2></div>' +
      '<button type="button" class="e1-iconbtn" data-ov-close aria-label="Close">' + E1.icon('x', 18) + '</button></header>' +
      '<div class="e1-drawer__body">' + (o.body || '') + '</div>' +
      (o.actions && o.actions.length ? '<footer class="e1-drawer__foot">' + renderActions(o.actions) + '</footer>' : '') +
      '</aside>';
    var entry = openOverlay('drawer', html, { side: side, onClose: o.onClose });
    wireActions(entry, o.actions);
    return { el: entry.el, close: function () { closeEntry(entry); } };
  };

  /** E1.sheet({title, body, actions?}) — a bottom sheet (drawer side 'bottom'). */
  E1.sheet = function (o) { o = Object.assign({}, o || {}, { side: 'bottom' }); return E1.drawer(o); };

  /**
   * E1.confirm({title, body, confirmLabel, kind:'primary'|'danger'|'gate', onConfirm}) — a two-button modal.
   */
  E1.confirm = function (o) {
    return E1.modal({
      title: o.title, body: o.body, size: 'sm', eyebrow: o.eyebrow,
      actions: [{ label: o.cancelLabel || 'Cancel', kind: 'ghost' }, { label: o.confirmLabel || 'Confirm', kind: o.kind || 'primary', onClick: o.onConfirm }]
    });
  };

  /* ---- Popovers / menus (data-pop) ---------------------------------------- */
  function closePops(except) {
    var open = document.querySelectorAll('[data-pop][aria-expanded="true"]');
    for (var i = 0; i < open.length; i++) {
      if (open[i] === except) continue;
      open[i].setAttribute('aria-expanded', 'false');
      var p = document.getElementById(open[i].getAttribute('data-pop'));
      if (p) p.hidden = true;
    }
  }
  E1.closePops = closePops;
  function popItems(p) { return Array.prototype.slice.call(p.querySelectorAll('[role="menuitem"],[role="menuitemradio"],[role="menuitemcheckbox"],.e1-pop__focus')); }
  E1.on('click', '[data-pop]', function (e, btn) {
    e.preventDefault();
    var p = document.getElementById(btn.getAttribute('data-pop'));
    if (!p) return;
    var open = btn.getAttribute('aria-expanded') === 'true';
    closePops(btn);
    btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    p.hidden = open;
    if (!open) {
      var items = popItems(p);
      var sel = p.querySelector('[aria-checked="true"]') || items[0];
      if (sel && e.detail === 0) sel.focus(); // keyboard-opened → focus first item
      else if (sel) { try { p.focus({ preventScroll: true }); } catch (x) { /* ok */ } }
    }
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    if (e.target.closest('[data-pop]')) return;
    var inPop = e.target.closest('.e1-pop');
    if (inPop && !e.target.closest('a,[role="menuitem"],[role="menuitemradio"],[data-pop-close]')) return;
    closePops();
  });
  document.addEventListener('keydown', function (e) {
    var p = e.target.closest ? e.target.closest('.e1-pop') : null;
    if (!p) return;
    var items = popItems(p);
    var i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); (items[i + 1] || items[0]).focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); (items[i - 1] || items[items.length - 1]).focus(); }
    else if (e.key === 'Home') { e.preventDefault(); if (items[0]) items[0].focus(); }
    else if (e.key === 'End') { e.preventDefault(); if (items.length) items[items.length - 1].focus(); }
    else if (e.key === 'Escape') {
      e.preventDefault(); e.stopPropagation();
      var btn = document.querySelector('[data-pop="' + p.id + '"]');
      closePops(); if (btn) btn.focus();
    } else if (e.key === 'Tab') { closePops(); }
  });

  /* ---- Copy ----------------------------------------------------------------- */
  /** Copy text to the clipboard and toast. Works without the async clipboard API. */
  E1.copy = function (text, label) {
    var ok = false;
    try {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      ok = document.execCommand && document.execCommand('copy');
      document.body.removeChild(ta);
    } catch (e) { ok = false; }
    try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).catch(function () { }); ok = true; } } catch (e) { /* blocked */ }
    E1.toast(ok ? (label || 'Copied') + ' to the clipboard' : 'Copy is blocked here. Select the text and copy it by hand.', ok ? 'good' : 'warning', { timeout: 2200 });
  };
  E1.on('click', '[data-copy]', function (e, el) {
    e.preventDefault();
    var v = el.getAttribute('data-copy');
    if (v === '' || v === 'next') { var t = el.closest('.e1-code'); v = t ? t.querySelector('code').textContent : ''; }
    E1.copy(v, el.getAttribute('data-copy-label'));
  });

  /* ---- In-page scroll links (TOC). href stays a valid route. ---------------- */
  E1.on('click', '[data-scrollto]', function (e, el) {
    var t = document.getElementById(el.getAttribute('data-scrollto'));
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    t.setAttribute('tabindex', '-1');
    try { t.focus({ preventScroll: true }); } catch (x) { /* ok */ }
  });

  /* ---- Clickable table rows ---------------------------------------------- */
  E1.on('click', 'tr[data-href]', function (e, tr) {
    if (e.target.closest('a,button,input,select,textarea,label,summary')) return;
    var sel = window.getSelection && String(window.getSelection());
    if (sel) return;
    E1.go(tr.getAttribute('data-href'));
  });

  /* ---- Segmented control (button variant) ---------------------------------- */
  E1.on('click', '.e1-seg button[role="radio"]', function (e, b) {
    var g = b.closest('.e1-seg');
    Array.prototype.forEach.call(g.querySelectorAll('button[role="radio"]'), function (x) {
      x.setAttribute('aria-checked', x === b ? 'true' : 'false'); x.tabIndex = x === b ? 0 : -1;
    });
    try { g.dispatchEvent(new CustomEvent('e1:change', { bubbles: true, detail: { value: b.getAttribute('data-value') } })); } catch (x) { /* old */ }
  });
  E1.on('keydown', '.e1-seg button[role="radio"]', function (e, b) {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(e.key) < 0) return;
    e.preventDefault();
    var all = Array.prototype.slice.call(b.closest('.e1-seg').querySelectorAll('button[role="radio"]'));
    var i = all.indexOf(b) + (e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 1);
    var n = all[(i + all.length) % all.length]; n.focus(); n.click();
  });

  /* ---- Diff: show all fields ------------------------------------------------ */
  E1.action('diff-toggle', function (el) {
    var t = document.getElementById(el.getAttribute('aria-controls'));
    if (!t) return;
    var on = t.classList.toggle('is-expanded');
    el.setAttribute('aria-expanded', on ? 'true' : 'false');
    el.querySelector('span').textContent = on ? 'Show changed fields only' : el.getAttribute('data-label');
  });

  /* ---- Built-in actions ------------------------------------------------------ */
  E1.action('theme', function () {
    var next = E1.state.theme === 'dark' ? 'light' : 'dark';
    E1.set('theme', next);
    E1.announce(next === 'dark' ? 'Dark theme' : 'Light theme');
  });
  E1.action('density', function (el) { E1.set('density', el.getAttribute('data-value') || 'default'); E1.announce('Density ' + E1.state.density); });
  /** Set the assurance level shown ('L1'|'L2'|'L3') — same effect as the top-bar pill: persists, re-renders, toasts. opts.silent skips the toast. */
  E1.setLevel = function (L, opts) {
    L = String(L || 'L1').toUpperCase();
    if (!LEVELS[L]) return;
    E1.set('level', L);
    if (!(opts && opts.silent)) E1.toast(LEVELS[L].note, 'info', { title: 'Viewing as ' + L + ' ' + LEVELS[L].name });
  };
  E1.action('level', function (el) { E1.setLevel(el.getAttribute('data-value')); });
  E1.action('env', function (el) {
    var v = el.getAttribute('data-value');
    E1.set('env', v);
    E1.toast(v === 'production' ? 'Writes now reach live systems of record through the governed path.' : 'Writes apply to the per-tenant sandbox. Nothing reaches a live system.', v === 'production' ? 'warning' : 'info', { title: v === 'production' ? 'Production' : 'Sandbox' });
  });
  E1.action('tenant', function (el) {
    E1.set('tenant', el.getAttribute('data-value'));
    var t = E1.tenant();
    E1.toast('You are now working in ' + (t ? t.name : 'this tenant') + '.', 'neutral');
  });
  E1.action('panel', function () { E1.set('panel', !E1.state.panel); });
  E1.action('palette', function () { E1.palette(); });
  E1.action('shortcuts', function () { E1.shortcuts(); });
  E1.action('close', function () { E1.close(); });
  E1.action('skip', function () { var m = document.getElementById('e1-main'); if (m) { m.focus(); } });
  /** Open the whole console navigation in a drawer (mobile and tablet; also the tab bar's More). */
  E1.navDrawer = function () {
    var def = (E1.state.route && E1.state.route.def) || {};
    return E1.drawer({ title: splitMode() === 'reference' ? 'elan1 Reference' : 'elan1 Console', eyebrow: E1.tenant().name, side: 'left', cls: 'e1-drawer--nav', body: sidebarNav(def, true) });
  };
  E1.action('sections', function () { E1.navDrawer(); });
  E1.action('more-doors', function () { E1.navDrawer(); });
  E1.action('side-more', function (el) {
    var door = el.getAttribute('data-value'), list = document.getElementById(el.getAttribute('aria-controls'));
    if (!list) return;
    var open = list.hidden;
    list.hidden = !open;
    sideOpen[door] = open; E1.store.set('sideOpen', sideOpen);
    el.setAttribute('aria-expanded', open ? 'true' : 'false');
    var n = list.querySelectorAll('.e1-side__item').length;
    el.innerHTML = E1.icon(open ? 'chevron-up' : 'chevron-down', 14) + '<span>' + (open ? 'Fewer' : 'More · ' + n) + '</span>';
  });
  // Close sheets when a link inside them is followed
  E1.on('click', '.e1-ov a[href^="#/"]', function () { setTimeout(function () { E1.close(true); }, 0); });

  /* Tenants (data.js provides E1.data.tenants) */
  E1.tenant = function () {
    var list = (E1.data && E1.data.tenants) || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === E1.state.tenant) return list[i];
    return list[0] || { id: 'x', name: 'Tenant', short: 'T', pack: '', region: '', city: '' };
  };

  /* ------------------------------------------------------------------------
     Assurance levels (E07)
     ------------------------------------------------------------------------ */
  var LEVELS = E1.LEVELS = {
    L1: { name: 'Guarded', phase: 'Phase 1 · available now', claim: 'The write was controlled.', note: 'Proof records are hash-chained, not signed. No signature, anchor time or verifier verdict is shown.' },
    L2: { name: 'Attested', phase: 'After the L2 gate (Phase 3)', claim: 'A stranger can check that.', note: 'Preview. Seals show an Ed25519 signature, the RFC 3161 anchor and the offline verifier verdict.' },
    L3: { name: 'Proven', phase: 'After the L3 gate (Phase 4)', claim: 'The record survives us.', note: 'Preview. Adds counter-signature by a party that is not elan1 and a second independent seal implementation.' }
  };
  /** True when the current assurance level is at least L (e.g. E1.atLeast('L2')). */
  E1.atLeast = function (L) { return Number(String(E1.state.level).slice(1)) >= Number(String(L).slice(1)); };

  /* ------------------------------------------------------------------------
     Command palette
     ------------------------------------------------------------------------ */
  /* Split build (tools/split.py): window.E1_SPLIT = {mode:'platform'|'reference', other:'<the other file>', foreign(href)}.
     Absent in the normal SPA and the multi-page package, where every helper below is a no-op. */
  function splitMode() { return (window.E1_SPLIT && window.E1_SPLIT.mode) || ''; }
  function isForeign(h) { try { return !!(splitMode() && window.E1_SPLIT.foreign && window.E1_SPLIT.foreign(String(h || ''))); } catch (e) { return false; } }
  function otherHref(h) { return ((window.E1_SPLIT && window.E1_SPLIT.other) || '') + (h || ''); }
  function otherWord() { return splitMode() === 'platform' ? 'the reference' : 'the platform'; }
  E1.split = { mode: splitMode, foreign: isForeign, other: otherHref };
  var commands = [];
  /** Add a palette action: E1.cmdAdd({id, label, hint?, icon?, group?, keywords?, run(): void | href}). */
  E1.cmdAdd = function (c) { commands = commands.filter(function (x) { return x.id !== c.id; }); commands.push(c); return c; };

  function builtInCommands() {
    var list = [
      { id: 'theme', label: E1.state.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme', icon: E1.state.theme === 'dark' ? 'sun' : 'moon', group: 'Actions', keywords: 'theme dark light mode', run: function () { actions.theme(); } },
      { id: 'd-compact', label: 'Density: compact', icon: 'rows', group: 'Actions', keywords: 'density rows', run: function () { E1.set('density', 'compact'); } },
      { id: 'd-default', label: 'Density: default', icon: 'rows', group: 'Actions', keywords: 'density rows', run: function () { E1.set('density', 'default'); } },
      { id: 'd-comfortable', label: 'Density: comfortable', icon: 'rows', group: 'Actions', keywords: 'density rows', run: function () { E1.set('density', 'comfortable'); } },
      { id: 'lvl1', label: 'View as L1 Guarded', icon: 'assurance', group: 'Actions', keywords: 'assurance level l1', run: function () { E1.set('level', 'L1'); } },
      { id: 'lvl2', label: 'View as L2 Attested (preview)', icon: 'seal', group: 'Actions', keywords: 'assurance level l2 signed', run: function () { E1.set('level', 'L2'); } },
      { id: 'lvl3', label: 'View as L3 Proven (preview)', icon: 'seal', group: 'Actions', keywords: 'assurance level l3', run: function () { E1.set('level', 'L3'); } },
      { id: 'env', label: E1.state.env === 'sandbox' ? 'Switch to Production' : 'Switch to Sandbox', icon: 'server', group: 'Actions', keywords: 'environment sandbox production', run: function () { E1.set('env', E1.state.env === 'sandbox' ? 'production' : 'sandbox'); } },
      { id: 'panel', label: E1.state.panel ? 'Collapse the sidebar to a rail' : 'Expand the sidebar', icon: 'panel-left', group: 'Actions', keywords: 'sidebar subnav rail panel', run: function () { E1.set('panel', !E1.state.panel); } },
      { id: 'pill', label: 'Show or hide the screen-info pill', icon: 'info', group: 'Actions', keywords: 'pill screen notes review', run: function () { E1.togglePill(); } },
      { id: 'notes', label: 'Screen notes for this screen', icon: 'file-text', group: 'Actions', keywords: 'notes spec states components rules', run: function () { setTimeout(E1.screenNotes, 30); } },
      { id: 'keys', label: 'Keyboard shortcuts', icon: 'command', group: 'Actions', keywords: 'help keys', run: function () { setTimeout(E1.shortcuts, 30); } },
      { id: 'signout', label: 'Sign out', icon: 'log-out', group: 'Actions', keywords: 'logout', run: '#/auth/sign-in' }
    ];
    if (splitMode() === 'platform') list.push({ id: 'open-reference', label: 'Open the reference (separate file)', hint: 'All screens · design system · research', icon: 'book', group: 'Actions', keywords: 'reference design system atlas every screen competitors benchmarks decisions', run: otherHref('#/hub') });
    if (splitMode() === 'reference') list.push({ id: 'open-platform', label: 'Open the platform (separate file)', hint: 'Today', icon: 'home', group: 'Actions', keywords: 'platform console today work', run: otherHref('#/work/today') });
    return list.concat(commands);
  }
  function inventoryEntries() {
    return inventory().map(function (it, i) {
      var r = it.route ? parseHash('#' + String(it.route).replace(/^#/, '')) : null;
      var m = r ? E1.match(r.path) : null, d = m ? m.def : {};
      var icon = d.door && E1.nav[d.door] ? E1.nav[d.door].icon : 'file';
      return { id: 's:' + (it.id || i), label: pad3(it.n !== undefined ? it.n : i + 1) + '  ' + (it.title || it.id), hint: it.route || it.file, icon: icon, group: 'Screens' + (it.surface ? ' · ' + it.surface : ''), keywords: [it.id, it.section, it.type, it.spec].filter(Boolean).join(' '), run: E1.screenHref(it), path: r ? r.path : null };
    });
  }
  function routeEntries() {
    var out = [];
    E1.routes.forEach(function (r) {
      var d = r.def;
      if (d.palette === false || d.redirect) return;
      var path = r.keys.length ? d.example : r.pattern;
      if (!path) return;
      var title = typeof d.title === 'function' ? safeTitle(d, parseParams(r, path), {}) : (d.title || path);
      var door = d.door && E1.nav[d.door] ? E1.nav[d.door].label : ({ public: 'Website', auth: 'Sign in', bare: 'Public', doc: 'Docs', mobile: 'Mobile' }[d.layout] || 'Screens');
      var icon = d.door && E1.nav[d.door] ? E1.nav[d.door].icon : ({ public: 'globe', auth: 'lock', bare: 'file', doc: 'book', mobile: 'phone' }[d.layout] || 'file');
      out.push({ id: 'r:' + r.pattern, label: title, hint: path, icon: icon, group: door, keywords: (d.keywords || '') + ' ' + path.replace(/[\/-]/g, ' '), run: '#' + path });
    });
    return out;
  }
  function parseParams(r, path) { var m = r.re.exec(path), p = {}; if (m) r.keys.forEach(function (k, i) { p[k] = m[i + 1]; }); return p; }
  function safeTitle(d, params, query) { try { return typeof d.title === 'function' ? d.title(params || {}, query || {}) : (d.title || ''); } catch (e) { return ''; } }

  /** Fuzzy score: subsequence with bonuses for word starts and contiguity. 0 = no match. */
  E1.fuzzy = function (q, text) {
    q = String(q || '').toLowerCase().trim(); text = String(text || '').toLowerCase();
    if (!q) return 1;
    var direct = text.indexOf(q);
    if (direct >= 0) return 1000 - direct + (direct === 0 || /\W/.test(text.charAt(direct - 1)) ? 200 : 0);
    var score = 0, ti = 0, last = -2, first = -1;
    for (var qi = 0; qi < q.length; qi++) {
      var ch = q.charAt(qi);
      if (ch === ' ') continue;
      var found = text.indexOf(ch, ti);
      if (found < 0) return 0;
      if (first < 0) first = found;
      if (found - first > q.length * 3) return 0;
      score += 10;
      if (found === last + 1) score += 15;
      if (found === 0 || /[\s\/\-_&]/.test(text.charAt(found - 1))) score += 20;
      score -= Math.min(found - ti, 10);
      last = found; ti = found + 1;
    }
    return Math.max(score, 1);
  };

  var paletteState = null;
  /** Open the command palette (Ctrl/Cmd+K). */
  E1.palette = function () {
    if (paletteState) return;
    var id = E1.uid('pal');
    var html = '<div class="e1-palette" role="dialog" aria-modal="true" aria-label="Command palette">' +
      '<div class="e1-palette__search">' + E1.icon('search', 18) +
      '<input type="text" class="e1-palette__input" placeholder="Search screens and actions" aria-label="Search screens and actions" role="combobox" aria-expanded="true" aria-controls="' + id + '" aria-autocomplete="list" autocomplete="off" spellcheck="false" autofocus>' +
      '<kbd class="e1-kbd">Esc</kbd></div>' +
      '<div class="e1-palette__list" id="' + id + '" role="listbox" aria-label="Results"></div>' +
      '<footer class="e1-palette__foot"><span><kbd class="e1-kbd">↑</kbd><kbd class="e1-kbd">↓</kbd> move</span><span><kbd class="e1-kbd">Enter</kbd> open</span><span><kbd class="e1-kbd">?</kbd> all shortcuts</span></footer>' +
      '</div>';
    var entry = openOverlay('palette', html, { onClose: function () { paletteState = null; } });
    var input = entry.el.querySelector('input'), list = entry.el.querySelector('.e1-palette__list');
    var inv = inventoryEntries(), seen = {};
    inv.forEach(function (x) { if (x.path) seen[x.path] = 1; });
    var all = inv.concat(routeEntries().filter(function (x) { return !seen[String(x.run).replace(/^#/, '').split('?')[0]]; })).concat(builtInCommands());
    if (splitMode()) { // this file's screens first; the other file's are labelled and listed after them
      var own = [], away = [];
      var doorGroups = {}; E1.DOORS.forEach(function (d) { if (E1.nav[d]) doorGroups[E1.nav[d].label] = 1; });
      all.forEach(function (x) {
        if (typeof x.run === 'function' && splitMode() === 'reference' && doorGroups[x.group]) { away.push({ id: x.id, label: x.label, hint: x.hint, icon: x.icon, group: x.group + ' · opens ' + otherWord(), keywords: x.keywords, run: x.run }); return; }
        if (typeof x.run === 'string' && isForeign(x.run)) away.push({ id: x.id, label: x.label, hint: x.hint, icon: x.icon, group: x.group + ' · opens ' + otherWord(), keywords: x.keywords, run: otherHref(x.run), path: x.path }); else own.push(x); });
      all = own.concat(away);
    }
    paletteState = { entry: entry, sel: 0, items: [] };
    function draw() {
      var q = input.value;
      var scored = all.map(function (c) {
        var s = Math.max(E1.fuzzy(q, c.label) * 2, E1.fuzzy(q, c.group + ' ' + c.label), E1.fuzzy(q, c.keywords || '') * 0.6, E1.fuzzy(q, c.hint || '') * 0.8);
        return { c: c, s: s };
      }).filter(function (x) { return x.s > 0; });
      if (q) scored.sort(function (a, b) { return b.s - a.s; });
      var items = scored.slice(0, q ? 40 : 200).map(function (x) { return x.c; });
      paletteState.items = items;
      if (paletteState.sel >= items.length) paletteState.sel = 0;
      if (!items.length) {
        list.innerHTML = '<div class="e1-palette__empty"><strong>Nothing matches “' + esc(q) + '”.</strong><span>Try a screen name such as “approvals” or an action such as “dark”.</span></div>';
        input.removeAttribute('aria-activedescendant');
        return;
      }
      var html2 = '', lastGroup = null;
      items.forEach(function (c, i) {
        if (!q && c.group !== lastGroup) { html2 += '<div class="e1-palette__group" role="presentation">' + esc(c.group) + '</div>'; lastGroup = c.group; }
        html2 += '<div class="e1-palette__item' + (i === paletteState.sel ? ' is-active' : '') + '" role="option" id="' + id + '-' + i + '" aria-selected="' + (i === paletteState.sel) + '" data-i="' + i + '">' +
          '<span class="e1-palette__icon">' + E1.icon(c.icon || 'arrow-right', 16) + '</span>' +
          '<span class="e1-palette__label">' + esc(c.label) + '</span>' +
          (q ? '<span class="e1-palette__groupname">' + esc(c.group) + '</span>' : '') +
          (c.hint ? '<span class="e1-palette__hint">' + esc(c.hint) + '</span>' : '') + '</div>';
      });
      list.innerHTML = html2;
      input.setAttribute('aria-activedescendant', id + '-' + paletteState.sel);
      var act = list.querySelector('.is-active'); if (act && act.scrollIntoView) act.scrollIntoView({ block: 'nearest' });
    }
    function run(i) {
      var c = paletteState && paletteState.items[i];
      if (!c) return;
      closeEntry(entry);
      if (typeof c.run === 'string') { if (c.run.charAt(0) === '#') E1.go(c.run); else window.location.href = c.run; } else if (typeof c.run === 'function') c.run();
    }
    input.addEventListener('input', function () { paletteState.sel = 0; draw(); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); paletteState.sel = Math.min(paletteState.sel + 1, paletteState.items.length - 1); draw(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); paletteState.sel = Math.max(paletteState.sel - 1, 0); draw(); }
      else if (e.key === 'Enter') { e.preventDefault(); run(paletteState.sel); }
      else if (e.key === 'Tab') { e.preventDefault(); }
    });
    list.addEventListener('click', function (e) { var it = e.target.closest('[data-i]'); if (it) run(Number(it.getAttribute('data-i'))); });
    list.addEventListener('mousemove', function (e) {
      var it = e.target.closest('[data-i]'); if (!it) return;
      var i = Number(it.getAttribute('data-i'));
      if (i !== paletteState.sel) { paletteState.sel = i; Array.prototype.forEach.call(list.querySelectorAll('[data-i]'), function (x) { var on = Number(x.getAttribute('data-i')) === i; x.classList.toggle('is-active', on); x.setAttribute('aria-selected', on); }); input.setAttribute('aria-activedescendant', id + '-' + i); }
    });
    draw();
    setTimeout(function () { input.focus(); }, 20);
  };

  /* ------------------------------------------------------------------------
     Keyboard shortcuts
     ------------------------------------------------------------------------ */
  var SHORTCUTS = [
    { keys: ['Ctrl', 'K'], alt: ['⌘', 'K'], label: 'Open the command palette' },
    { keys: ['g', 'w'], label: 'Go to Work' },
    { keys: ['g', 'r'], label: 'Go to Records' },
    { keys: ['g', 'a'], label: 'Go to Agents' },
    { keys: ['g', 's'], label: 'Go to Assurance' },
    { keys: ['g', 'x'], label: 'Go to Reference' },
    { keys: ['['], label: 'Collapse or expand the sidebar' },
    { keys: ['t'], label: 'Switch light and dark theme' },
    { keys: ['i'], label: 'Show or hide the screen-info pill' },
    { keys: ['?'], label: 'Show this sheet' },
    { keys: ['Esc'], label: 'Close a menu, dialog or drawer' }
  ];
  E1.shortcuts = function () {
    var rows = SHORTCUTS.filter(function (s) { return hasRef() || s.keys.join('') !== 'gx'; }).map(function (s) {
      return '<tr><th scope="row">' + esc(s.label) + '</th><td>' + s.keys.map(function (k) { return '<kbd class="e1-kbd">' + esc(k) + '</kbd>'; }).join('<span class="e1-kbd-then">' + (s.keys[0] === 'g' ? 'then' : '+') + '</span>') +
        (s.alt ? ' <span class="e1-muted">or</span> ' + s.alt.map(function (k) { return '<kbd class="e1-kbd">' + esc(k) + '</kbd>'; }).join('<span class="e1-kbd-then">+</span>') : '') + '</td></tr>';
    }).join('');
    E1.modal({
      title: 'Keyboard shortcuts', eyebrow: 'Console', size: 'md',
      body: '<table class="e1-table e1-shortcuts"><caption class="e1-sr">Keyboard shortcuts</caption><thead><tr><th scope="col">Action</th><th scope="col">Keys</th></tr></thead><tbody>' + rows + '</tbody></table>' +
        '<p class="e1-caption e1-muted" style="margin-top:12px">Single-letter shortcuts are ignored while you are typing in a field. The entire approval path — queue, open, read the diff, decide — works without a mouse.</p>',
      actions: [{ label: 'Done', kind: 'primary' }]
    });
  };

  var gPending = 0;
  document.addEventListener('keydown', function (e) {
    var t = e.target, typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (paletteState) { closeEntry(paletteState.entry); } else { closePops(); E1.palette(); }
      return;
    }
    if (e.key === 'Escape') {
      if (document.querySelector('[data-pop][aria-expanded="true"]')) { closePops(); return; }
      if (stack.length) { var top = stack[stack.length - 1]; if (top.dismissable) { e.preventDefault(); closeEntry(top); } return; }
    }
    if (e.key === 'Tab' && stack.length) { // focus trap
      var el = stack[stack.length - 1].el;
      var f = Array.prototype.filter.call(el.querySelectorAll(FOCUSABLE), function (x) { return x.offsetParent !== null || x === document.activeElement; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (!el.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      return;
    }
    if (typing || e.ctrlKey || e.metaKey || e.altKey || stack.length || !E1.state.singleKeys) return;
    var now = Date.now();
    if (gPending && now - gPending < 1200) {
      gPending = 0;
      var map = { w: 'work', r: 'records', a: 'agents', s: 'assurance', x: 'reference' };
      if (map[e.key] && E1.nav[map[e.key]]) { e.preventDefault(); var dh = E1.doorHome(map[e.key]); if (isForeign(dh)) window.location.href = otherHref(dh); else E1.go(dh); }
      return;
    }
    if (e.key === 'g') { gPending = now; return; }
    if (e.key === '?') { e.preventDefault(); E1.shortcuts(); }
    else if (e.key === '[') { e.preventDefault(); E1.set('panel', !E1.state.panel); }
    else if (e.key === 't') { actions.theme(); }
    else if (e.key === 'i') { E1.togglePill(); }
  });

  /* ------------------------------------------------------------------------
     Shell rendering
     Ink top bar · wide grouped sidebar that collapses to an icon rail · sticky breadcrumb bar · footer strip · mobile drawer + tab bar.
     ------------------------------------------------------------------------ */
  /** Base path of the package for shared assets: window.E1_ROOT, else window.E1_BASE ('' at the package root, '../' in screens/),
   *  else '../' in file mode and '' in the SPA. */
  E1.rootPath = function () {
    if (typeof window.E1_ROOT === 'string') return window.E1_ROOT;
    if (typeof window.E1_BASE === 'string') return window.E1_BASE;
    return window.E1_FILE_MODE ? '../' : '';
  };
  /** Resolve a shared asset path ('assets/brand/x.png') against E1.rootPath(). Absolute URLs and data: URIs pass through. */
  E1.asset = function (p) { p = String(p || ''); return /^(?:[a-z]+:|\/|#)/i.test(p) ? p : E1.rootPath() + p; };

  var LOGO_WHITE = 'assets/brand/elan1-logo-white.png';
  var LOGO_NAVY = 'assets/brand/elan1-logo-navy.png';
  function logo(kind, href, cls) {
    return '<a class="e1-logo ' + (cls || '') + '" href="' + (href || '#/') + '" aria-label="elan1 — home">' +
      (kind === 'auto'
        ? '<img class="e1-logo--onlight" src="' + E1.asset(LOGO_NAVY) + '" alt="elan1" width="96" height="37"><img class="e1-logo--ondark" src="' + E1.asset(LOGO_WHITE) + '" alt="" width="96" height="37">'
        : '<img src="' + E1.asset(kind === 'white' ? LOGO_WHITE : LOGO_NAVY) + '" alt="elan1" width="96" height="37">') + '</a>';
  }
  E1.logo = logo;

  function initials(name) { return String(name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join(''); }

  function menuItem(o) {
    // o: {label, href?, action?, value?, icon?, checked?(radio), note?, danger?, trail?}
    var role = o.checked === undefined ? 'menuitem' : 'menuitemradio';
    var inner = (o.icon ? '<span class="e1-menu__icon">' + E1.icon(o.icon, 16) + '</span>' : (o.checked !== undefined ? '<span class="e1-menu__check">' + (o.checked ? E1.icon('check', 14) : '') + '</span>' : '')) +
      '<span class="e1-menu__text"><span class="e1-menu__label">' + esc(o.label) + '</span>' + (o.note ? '<span class="e1-menu__note">' + esc(o.note) + '</span>' : '') + '</span>' + (o.trail || '');
    var attrs = ' role="' + role + '" tabindex="-1" class="e1-menu__item' + (o.danger ? ' is-danger' : '') + '"' + (o.checked !== undefined ? ' aria-checked="' + !!o.checked + '"' : '');
    if (o.href) return '<a href="' + esc(o.href) + '"' + attrs + '>' + inner + '</a>';
    return '<button type="button"' + attrs + (o.action ? ' data-action="' + esc(o.action) + '"' : '') + (o.value ? ' data-value="' + esc(o.value) + '"' : '') + '>' + inner + '</button>';
  }
  E1.menuItem = menuItem;

  var ENV_WORD = { sandbox: 'Sandbox', production: 'Live' };
  function envWord() { return ENV_WORD[E1.state.env] || 'Sandbox'; }
  function firstRoute(list) { for (var i = 0; i < list.length; i++) if (E1.hasRoute(list[i])) return '#' + list[i]; return null; }
  function atlasHref(id) {
    if (E1.hub && typeof E1.hub.atlasHref === 'function') { try { return E1.hub.atlasHref(id); } catch (e) { /* fall through */ } }
    if (splitMode() === 'platform') return otherHref('#/hub/atlas' + (id ? '?focus=' + encodeURIComponent(id) : ''));
    return window.E1_FILE_MODE ? E1.asset('atlas.html') + (id ? '#' + id : '') : '#/reference/screen-map';
  }
  function hasRef() { return !!(E1.nav && E1.nav.reference); }
  function learnHref() { return firstRoute(['/learn', '/developers', '/glossary', '/reference/design-system']) || '#/reference/design-system'; }

  function topbar(def) {
    var s = E1.state, t = E1.tenant(), L = LEVELS[s.level] || LEVELS.L1;
    var tenants = (E1.data && E1.data.tenants) || [];
    var notes = (E1.data && E1.data.notifications) || [];
    var unread = notes.filter(function (n) { return n.unread; }).length;
    var user = (E1.data && E1.data.user) || { name: 'User', role: '' };
    var levelNum = s.level.slice(1);
    var appr = E1.navItem('work', 'approvals');
    var waiting = (E1.data && E1.data.user && E1.data.user.waiting !== undefined) ? E1.data.user.waiting : (appr && appr.count);
    var tenantSub = (t.gstin ? 'GSTIN ' + t.gstin : (t.city || 'Tenant')) + ' · ' + (t.residency || t.region || '');

    var surfaceItems = [
      ['Console', '#/work/today', 'grid', 'Work · Records · Agents · Assurance'],
      ['Public website', firstRoute(['/']), 'globe', 'What a prospect sees'],
      ['Developer docs', firstRoute(['/developers']), 'code', 'KernelPort, SDKs, the verifier'],
      ['Verify a record', firstRoute(['/verify']), 'fingerprint', 'Offline verifier, no account'],
      ['Auditor portal', firstRoute(['/auditor']), 'scale', 'Read-only engagement view']
    ].filter(function (x) { return x[1]; });
    if (splitMode() === 'reference') surfaceItems = surfaceItems.map(function (x) { return [x[0], isForeign(x[1]) ? otherHref(x[1]) : x[1], x[2], x[3]]; });
    var surfaceMenu = '<div class="e1-pop e1-pop--menu" id="pop-surface" role="menu" aria-label="Switch surface" hidden tabindex="-1">' +
      '<div class="e1-menu__head">' + (splitMode() === 'reference' ? 'Surfaces · open the platform file' : 'Surfaces') + '</div>' +
      surfaceItems.map(function (x) { return menuItem({ label: x[0], note: x[3], icon: x[2], href: x[1] }); }).join('') +
      '<div class="e1-menu__sep" role="separator"></div>' +
      (splitMode() === 'platform' ?
        menuItem({ label: 'Every screen', note: 'Screen atlas · opens the reference file', icon: 'grid', href: atlasHref() }) +
        menuItem({ label: 'Design system', note: 'Opens the reference file', icon: 'book', href: otherHref('#/reference/design-system') }) :
        menuItem({ label: 'Every screen', icon: 'grid', href: atlasHref() }) +
        menuItem({ label: 'Design system', icon: 'book', href: '#/reference/design-system' })) + '</div>';

    var tenantMenu = '<div class="e1-pop e1-pop--menu e1-pop--wide" id="pop-tenant" role="menu" aria-label="Switch tenant" hidden tabindex="-1">' +
      '<div class="e1-menu__head">Tenants you can act in</div>' +
      tenants.map(function (x) { return menuItem({ label: x.name, note: x.city + ' · ' + x.pack + ' · ' + x.region + ' residency' + (x.statusNote ? ' · ' + x.statusNote : ''), checked: x.id === s.tenant, action: 'tenant', value: x.id }); }).join('') +
      (splitMode() === 'reference' ? '' : '<div class="e1-menu__sep" role="separator"></div>' + menuItem({ label: 'Manage tenants', icon: 'building', href: '#/records/tenants' })) + '</div>';

    var envMenu = '<div class="e1-pop e1-pop--menu" id="pop-env" role="menu" aria-label="Environment" hidden tabindex="-1">' +
      '<div class="e1-menu__head">Environment</div>' +
      menuItem({ label: 'Sandbox', note: 'Per-tenant sandbox. Nothing reaches a live system.', checked: s.env === 'sandbox', action: 'env', value: 'sandbox' }) +
      menuItem({ label: 'Live', note: 'Production. Governed writes reach live systems of record.', checked: s.env === 'production', action: 'env', value: 'production' }) + '</div>';

    var levelMenu = '<div class="e1-pop e1-pop--menu e1-pop--wide" id="pop-level" role="menu" aria-label="Assurance level" hidden tabindex="-1">' +
      '<div class="e1-menu__head">Assurance level · what the proof may claim</div>' +
      ['L1', 'L2', 'L3'].map(function (k) {
        return menuItem({ label: k + ' ' + LEVELS[k].name + (k === 'L1' ? '' : ' · preview'), note: LEVELS[k].claim + ' ' + LEVELS[k].phase + '.', checked: s.level === k, action: 'level', value: k, trail: '<span class="e1-level-bars e1-level-bars--' + k.slice(1) + '" aria-hidden="true"><i></i><i></i><i></i></span>' });
      }).join('') +
      (splitMode() === 'reference' ? '' : '<div class="e1-menu__sep" role="separator"></div>' + menuItem({ label: 'What each level lets you say', icon: 'info', href: '#/assurance/level' })) + '</div>';

    var notifMenu = '<div class="e1-pop e1-pop--notif e1-pop--right" id="pop-notif" role="menu" aria-label="Notifications" hidden tabindex="-1">' +
      '<div class="e1-notif__head"><strong>Notifications</strong><span class="e1-caption e1-muted">' + unread + ' unread</span></div>' +
      '<div class="e1-notif__list">' + notes.map(function (n) {
        var ic = n.icon || { good: 'approve', warning: 'clock', serious: 'alert', critical: 'alert', info: 'info', neutral: 'bell' }[n.state] || 'bell';
        return '<a role="menuitem" tabindex="-1" class="e1-notif' + (n.unread ? ' is-unread' : '') + '" href="' + esc(n.href) + '">' +
          '<span class="e1-notif__icon e1-tone--' + esc(n.state || 'neutral') + '">' + E1.icon(ic, 16) + '</span>' +
          '<span class="e1-notif__text"><span class="e1-notif__title">' + esc(n.title) + '</span><span class="e1-notif__body">' + esc(n.body) + '</span>' +
          '<span class="e1-notif__meta">' + esc(n.actorKind === 'agent' ? 'Agent' : n.actorKind === 'person' ? 'Person' : 'Platform') + ' · ' + esc(E1.fmt.rel(n.at)) + '</span></span>' +
          (n.unread ? '<span class="e1-sr">Unread</span>' : '') + '</a>';
      }).join('') + '</div>' +
      '<a class="e1-notif__all" role="menuitem" tabindex="-1" href="#/work/today">Everything waiting on you in Today ' + E1.icon('arrow-right', 14) + '</a></div>';

    var densityMenu = '<div class="e1-pop e1-pop--menu e1-pop--right" id="pop-density" role="menu" aria-label="Density" hidden tabindex="-1">' +
      '<div class="e1-menu__head">Density · the whole console</div>' +
      [['default', 'Default', '40px rows'], ['compact', 'Compact', '32px rows'], ['comfortable', 'Comfortable', '48px rows']].map(function (d) {
        return menuItem({ label: d[1], note: d[2], checked: s.density === d[0], action: 'density', value: d[0] });
      }).join('') + '</div>';

    var userMenu = '<div class="e1-pop e1-pop--menu e1-pop--right" id="pop-user" role="menu" aria-label="Account" hidden tabindex="-1">' +
      '<div class="e1-menu__user"><span class="e1-avatar e1-avatar--person e1-avatar--md" aria-hidden="true">' + esc(initials(user.name)) + '</span><span><strong>' + esc(user.name) + '</strong><span class="e1-caption e1-muted">' + esc(user.role) + '</span><span class="e1-caption e1-muted">' + esc(user.email || '') + '</span></span></div>' +
      '<div class="e1-menu__sep" role="separator"></div>' +
      (splitMode() === 'reference' ? '' : menuItem({ label: 'Profile and preferences', icon: 'user', href: '#/account/profile' })) +
      menuItem({ label: 'Keyboard shortcuts', icon: 'command', action: 'shortcuts' }) +
      (splitMode() === 'platform' ? menuItem({ label: 'Reference (opens separately)', note: 'Every screen, design system, research', icon: 'book', href: otherHref('#/hub') }) :
        menuItem({ label: 'Design system', icon: 'book', href: '#/reference/design-system' })) +
      '<div class="e1-menu__sep" role="separator"></div>' +
      (splitMode() === 'reference' ? menuItem({ label: 'Open the platform', note: 'The platform file', icon: 'home', href: otherHref('#/work/today') }) :
        menuItem({ label: 'Sign out', icon: 'log-out', href: '#/auth/sign-in' })) + '</div>';

    var dark = s.theme === 'dark';
    var dens = s.density.charAt(0).toUpperCase() + s.density.slice(1);
    return '<header class="e1-topbar" role="banner">' +
      '<button type="button" class="e1-skip" data-action="skip">Skip to content</button>' +
      '<button type="button" class="e1-tbbtn e1-topbar__menu" data-action="sections" aria-label="Open navigation">' + E1.icon('menu', 18) + '</button>' +
      '<div class="e1-topbar__brand">' + logo('white', E1.doorHome(splitMode() === 'reference' ? 'reference' : 'work'), 'e1-logo--chrome') + '</div>' +
      '<div class="e1-popwrap e1-hide-md"><button type="button" class="e1-tbbtn e1-surface" data-pop="pop-surface" aria-haspopup="menu" aria-expanded="false" aria-label="Surface: Console. Switch surface"><span>Console</span>' + E1.icon('chevron-down', 12) + '</button>' + surfaceMenu + '</div>' +
      '<div class="e1-topbar__ctx">' +
        '<div class="e1-popwrap"><button type="button" class="e1-tenant" data-pop="pop-tenant" aria-haspopup="menu" aria-expanded="false" aria-label="Tenant: ' + esc(t.name) + '. Switch tenant">' +
          '<span class="e1-tenant__mark" aria-hidden="true">' + esc(t.short || initials(t.name)) + '</span>' +
          '<span class="e1-tenant__text"><span class="e1-tenant__name">' + esc(t.name) + '</span><span class="e1-tenant__sub">' + esc(tenantSub) + '</span></span></button>' + tenantMenu + '</div>' +
        '<div class="e1-popwrap"><button type="button" class="e1-envpill e1-envpill--' + s.env + '" data-pop="pop-env" aria-haspopup="menu" aria-expanded="false" aria-label="Environment: ' + envWord() + '. Change environment"><i aria-hidden="true"></i><span>' + envWord() + '</span></button>' + envMenu + '</div>' +
        '<div class="e1-popwrap"><button type="button" class="e1-levelpill e1-levelpill--' + levelNum + '" data-pop="pop-level" aria-haspopup="menu" aria-expanded="false" aria-label="Assurance level ' + s.level + ' ' + L.name + '. Change level">' +
          '<span class="e1-level-bars e1-level-bars--' + levelNum + '" aria-hidden="true"><i></i><i></i><i></i></span><span class="e1-levelpill__k">' + s.level + '</span><span class="e1-levelpill__n">' + L.name + '</span></button>' + levelMenu + '</div>' +
      '</div>' +
      '<div class="e1-topbar__spacer"></div>' +
      '<button type="button" class="e1-cmdk" data-action="palette" aria-label="Search or ask elan1 (Ctrl K)">' + E1.icon('search', 15) + '<span class="e1-cmdk__text">Search or ask elan1…</span><span class="e1-cmdk__keys"><kbd>Ctrl K</kbd></span></button>' +
      '<div class="e1-topbar__spacer e1-topbar__spacer--r"></div>' +
      '<div class="e1-topbar__tools">' +
        (appr && splitMode() !== 'reference' ? '<a class="e1-tbbtn e1-hide-sm" href="' + esc(appr.href) + '" aria-label="Waiting on you: ' + esc(waiting || 0) + ' approvals" title="Waiting on you">' + E1.icon('gate', 17) + (waiting ? '<span class="e1-tbbtn__count e1-tbbtn__count--accent">' + esc(waiting) + '</span>' : '') + '</a>' : '') +
        (splitMode() === 'reference' ? '' : '<div class="e1-popwrap"><button type="button" class="e1-tbbtn" data-pop="pop-notif" aria-haspopup="menu" aria-expanded="false" aria-label="Notifications, ' + unread + ' unread">' + E1.icon('bell', 17) + (unread ? '<span class="e1-tbbtn__count" aria-hidden="true">' + unread + '</span>' : '') + '</button>' + notifMenu + '</div>') +
        '<button type="button" class="e1-tbbtn" data-action="theme" aria-label="' + (dark ? 'Switch to light theme' : 'Switch to dark theme') + '" title="' + (dark ? 'Light theme' : 'Dark theme') + ' (t)">' + E1.icon(dark ? 'sun' : 'moon', 16) + '<span class="e1-tbbtn__text">' + (dark ? 'Light' : 'Dark') + '</span></button>' +
        '<div class="e1-popwrap e1-hide-sm"><button type="button" class="e1-tbbtn" data-pop="pop-density" aria-haspopup="menu" aria-expanded="false" aria-label="Density: ' + s.density + '. Change density">' + E1.icon('rows', 16) + '<span class="e1-tbbtn__text">' + dens + '</span></button>' + densityMenu + '</div>' +
        '<div class="e1-popwrap"><button type="button" class="e1-userbtn" data-pop="pop-user" aria-haspopup="menu" aria-expanded="false" aria-label="Account: ' + esc(user.name) + '">' +
          '<span class="e1-userbtn__text"><b>' + esc(user.name) + '</b><span>' + esc(user.role) + '</span></span>' +
          '<span class="e1-avatar e1-avatar--person e1-avatar--chrome" aria-hidden="true">' + esc(initials(user.name)) + '</span></button>' + userMenu + '</div>' +
      '</div>' +
    '</header>';
  }

  /* ---- Sidebar and rail ------------------------------------ */
  var ITEM_ICON = {
    today: 'home', approvals: 'gate', escalations: 'alert', 'not-done': 'refuse', requests: 'send', reviews: 'eye', obligations: 'calendar',
    systems: 'server', objects: 'records', declarations: 'file-text', studio: 'edit', 'write-types': 'tag', changesets: 'git-branch', packs: 'package', tenants: 'building',
    registry: 'agents', discovered: 'search', autonomy: 'sliders', graduation: 'arrow-up-right', people: 'users', roles: 'user', keys: 'key', channels: 'message', tools: 'plug', webhooks: 'zap',
    proof: 'proof', chain: 'chain', coverage: 'pie', refusals: 'refuse', enforcement: 'lock', 'system-map': 'layers', runtime: 'activity', incidents: 'alert',
    level: 'assurance', upgrade: 'arrow-up-right', bundles: 'package', exports: 'export', receipts: 'file-text', controls: 'scale', disclosures: 'book', meter: 'chart-bar', invoices: 'rupee', plan: 'sliders',
    'design-system': 'grid', components: 'layers', patterns: 'rows', competitors: 'chart-line', benchmarks: 'chart-bar', 'screen-map': 'grid', ia: 'git-branch', flows: 'activity', atlas: 'globe', decisions: 'flag', sources: 'book'
  };
  var ICON_WORDS = [[/overview|home/i, 'home'], [/proof/i, 'proof'], [/chain/i, 'chain'], [/key/i, 'key'], [/people|person/i, 'users'], [/role/i, 'user'], [/agent|registry/i, 'agents'], [/tool/i, 'plug'],
    [/webhook/i, 'zap'], [/channel/i, 'message'], [/system/i, 'server'], [/object|actor/i, 'records'], [/declar|lexicon|polic/i, 'file-text'], [/studio/i, 'edit'], [/write/i, 'tag'], [/changeset|run/i, 'git-branch'],
    [/pack/i, 'package'], [/tenant/i, 'building'], [/coverage/i, 'pie'], [/refus|not done/i, 'refuse'], [/enforce|security|stop/i, 'lock'], [/map/i, 'layers'], [/incident|break/i, 'alert'], [/level|assur/i, 'assurance'],
    [/bundle/i, 'package'], [/export/i, 'export'], [/receipt|invoice/i, 'file-text'], [/control|regulat/i, 'scale'], [/disclos/i, 'book'], [/meter|spend|cost/i, 'chart-bar'], [/plan/i, 'sliders'],
    [/residency|region/i, 'globe'], [/access/i, 'key'], [/readiness|check/i, 'check'], [/anchor|time/i, 'clock'], [/verif/i, 'fingerprint'], [/counterpart/i, 'users'], [/certif/i, 'seal'], [/erasure|delete/i, 'trash'],
    [/calendar|obligation/i, 'calendar'], [/decided|history/i, 'history'], [/request/i, 'send'], [/review/i, 'eye']];
  function itemIcon(it, door) {
    if (it.icon) return it.icon;
    if (ITEM_ICON[it.id]) return ITEM_ICON[it.id];
    for (var i = 0; i < ICON_WORDS.length; i++) if (ICON_WORDS[i][0].test(it.label || '')) return ICON_WORDS[i][1];
    return (E1.nav[door] && E1.nav[door].icon) || 'file';
  }
  var sideOpen = E1.store.get('sideOpen', {}) || {};
  var SIDE_PEEK = 3;
  function hasCount(it) { return it.count !== undefined && it.count !== null && it.count !== ''; }
  function sideItem(it, on, door, quiet) {
    return '<a class="e1-side__item' + (on ? ' is-active' : '') + (quiet ? ' is-quiet' : '') + '" href="' + esc(it.href) + '"' + (on ? ' aria-current="page"' : '') + '>' +
      E1.icon(itemIcon(it, door), 16) + '<span class="e1-side__label">' + esc(it.label) + '</span>' +
      (hasCount(it) ? '<span class="e1-side__count">' + esc(it.count) + '</span>' : '') + '</a>';
  }
  function sideGroup(door, def, opts) {
    var d = E1.nav[door]; if (!d) return '';
    var cur = def.door === door, section = cur ? def.section : null;
    var items = d.items.filter(function (it) { return !(door === 'work' && it.id === 'today'); });
    var id = 'side-g-' + door;
    var multi = {}; items.forEach(function (it) { multi[it.group || ''] = 1; });
    var showSubs = cur && Object.keys(multi).length > 1;
    var open = cur || !!sideOpen[door];
    var html = '<div class="e1-side__group' + (cur ? ' is-current' : '') + (opts && opts.reference ? ' is-reference' : '') + '" data-door="' + door + '">' +
      '<div class="e1-side__glabel" id="' + id + '" title="' + esc(d.question || '') + '"><span>' + esc(d.label) + '</span>' + (d.count ? '<span class="e1-side__gcount">' + esc(d.count) + '</span>' : '') + '</div>' +
      '<div role="list" aria-labelledby="' + id + '">';
    var lastGroup = items.length ? (items[0].group || '') : null, more = '';
    items.forEach(function (it, i) {
      var row = '';
      if (showSubs && (it.group || '') !== lastGroup) { row += '<div class="e1-side__sub" role="presentation">' + esc(it.group || '') + '</div>'; lastGroup = it.group || ''; }
      row += '<div role="listitem">' + sideItem(it, it.id === section, door) + '</div>';
      if (cur || i < SIDE_PEEK) html += row; else more += row;
    });
    html += '</div>';
    if (more) {
      var n = items.length - SIDE_PEEK;
      html += '<div class="e1-side__more" id="' + id + '-more" role="list"' + (open ? '' : ' hidden') + '>' + more + '</div>' +
        '<button type="button" class="e1-side__toggle" data-action="side-more" data-value="' + door + '" aria-controls="' + id + '-more" aria-expanded="' + open + '">' +
        E1.icon(open ? 'chevron-up' : 'chevron-down', 14) + '<span>' + (open ? 'Fewer' : 'More · ' + n) + '</span></button>';
    }
    return html + '</div>';
  }
  function sidebarNav(def, drawer) {
    var today = E1.navItem('work', 'today');
    var L = LEVELS[E1.state.level] || LEVELS.L1;
    var onToday = def.door === 'work' && def.section === 'today';
    return '<nav class="e1-side' + (drawer ? ' e1-side--drawer' : '') + '" aria-label="Console">' +
      '<div class="e1-side__scroll">' +
        (splitMode() === 'reference' ?
          sideItem({ id: 'open-platform', label: 'Open the platform', href: otherHref('#/work/today'), icon: 'home' }, false, 'reference') +
          '<div class="e1-side__sep" role="separator"></div>' + sideGroup('reference', def, { reference: true }) :
          (today ? sideItem({ id: 'today', label: today.label, href: today.href, count: today.count, icon: 'home' }, onToday, 'work') : '') +
          E1.DOORS.map(function (k) { return sideGroup(k, def); }).join('') +
          (hasRef() ? '<div class="e1-side__sep" role="separator"></div>' + sideGroup('reference', def, { reference: true }) : '') +
          '<div class="e1-side__sep" role="separator"></div>' +
          sideItem({ id: 'learn', label: 'Learn', href: learnHref(), icon: 'book' }, false, 'reference', true)) +
      '</div>' +
      '<div class="e1-side__foot"><div class="e1-side__foottext"><span>elan1 · Governed agentic applications</span><span>' + esc(E1.state.level + ' ' + L.name) + (E1.state.level === 'L1' ? ' · hash-chained, not signed' : ' · preview') + '</span></div>' +
        (drawer ? '' : '<button type="button" class="e1-side__collapse" data-action="panel" aria-label="Collapse the sidebar ([)" title="Collapse ([)">' + E1.icon('chevrons-left', 16) + '</button>') + '</div>' +
      '</nav>';
  }
  function rail(def) {
    var door = def.door;
    var today = E1.navItem('work', 'today');
    function item(href, icon, label, on, count, title, quiet) {
      return '<a class="e1-rail__item' + (on ? ' is-active' : '') + (quiet ? ' e1-rail__item--quiet' : '') + '" href="' + esc(href) + '"' + (on ? ' aria-current="page"' : '') + ' title="' + esc(title || label) + '">' +
        E1.icon(icon, 20) + '<span class="e1-rail__label">' + esc(label) + '</span>' + (count ? '<span class="e1-rail__count">' + esc(count) + '</span>' : '') + '</a>';
    }
    var onToday = door === 'work' && def.section === 'today';
    var appr = E1.navItem('work', 'approvals');
    return '<nav class="e1-rail" aria-label="Doors">' +
      (today && splitMode() !== 'reference' ? item(today.href, 'home', 'Today', onToday, null, 'Today') : '') +
      (splitMode() === 'reference' ? [] : E1.DOORS).map(function (k) {
        var d = E1.nav[k];
        return item(k === 'work' && appr ? appr.href : E1.doorHome(k), d.icon, d.label, door === k && !onToday, k === 'work' && appr ? appr.count : d.count, d.label + ' — ' + d.question + ' (g ' + d.key + ')');
      }).join('') +
      '<div class="e1-rail__sep" role="presentation"></div>' +
      (splitMode() === 'reference' ? item(otherHref('#/work/today'), 'home', 'Platform', false, null, 'Open the platform') : '') +
      (hasRef() ? item(E1.doorHome('reference'), 'book', 'Reference', door === 'reference', null, 'Reference — not a door (g x)', true) : '') +
      '<div class="e1-rail__spacer"></div>' +
      (splitMode() === 'reference' ? '' : item(learnHref(), 'help', 'Learn', false, null, 'Learn', true)) +
      '<button type="button" class="e1-rail__toggle" data-action="panel" aria-label="Expand the sidebar ([)" title="Expand ([)">' + E1.icon('chevrons-right', 16) + '</button>' +
      '</nav>';
  }
  function crumbsFor(def, title) {
    var list = [];
    if (def.crumbs && def.crumbs.length) list = def.crumbs.slice();
    else if (def.door && E1.nav[def.door]) {
      var d = E1.nav[def.door];
      list.push([d.label, E1.doorHome(def.door)]);
      var it = def.section ? E1.navItem(def.door, def.section) : null;
      if (it && it.label !== title) list.push([it.label, it.href]);
    }
    var lastLabel = list.length ? list[list.length - 1][0] : null;
    if (title && lastLabel !== title) list.push([title, null]);
    else if (list.length) list[list.length - 1] = [list[list.length - 1][0], null];
    return list;
  }
  function crumbHtml(list) {
    if (!list.length) return '';
    return '<nav class="e1-crumbs" aria-label="Breadcrumb"><ol>' + list.map(function (c, i) {
      var last = i === list.length - 1;
      return '<li>' + (c[1] && !last ? '<a href="' + esc(c[1]) + '">' + esc(c[0]) + '</a>' : '<span' + (last ? ' aria-current="page"' : '') + '>' + esc(c[0]) + '</span>') + (last ? '' : '<span class="e1-crumbs__sep" aria-hidden="true">/</span>') + '</li>';
    }).join('') + '</ol></nav>';
  }
  E1.crumbHtml = crumbHtml;

  function tabbar(def) {
    var onToday = def.door === 'work' && def.section === 'today';
    var today = E1.navItem('work', 'today');
    return '<nav class="e1-tabbar" aria-label="Doors">' +
      (splitMode() === 'reference' ?
        '<a class="e1-tabbar__item" href="' + esc(otherHref('#/work/today')) + '">' + E1.icon('home', 20) + '<span>Platform</span></a>' +
        (hasRef() ? '<a class="e1-tabbar__item' + (def.door === 'reference' ? ' is-active' : '') + '" href="' + esc(E1.doorHome('reference')) + '"' + (def.door === 'reference' ? ' aria-current="page"' : '') + '>' + E1.icon('book', 20) + '<span>Reference</span></a>' : '') :
      (today ? '<a class="e1-tabbar__item' + (onToday ? ' is-active' : '') + '" href="' + esc(today.href) + '"' + (onToday ? ' aria-current="page"' : '') + '>' + E1.icon('home', 20) + '<span>Today</span></a>' : '')) +
      (splitMode() === 'reference' ? [] : E1.DOORS).map(function (k) {
        var d = E1.nav[k], on = def.door === k && !onToday;
        return '<a class="e1-tabbar__item' + (on ? ' is-active' : '') + '" href="' + esc(E1.doorHome(k)) + '"' + (on ? ' aria-current="page"' : '') + '>' + E1.icon(d.icon, 20) + '<span>' + esc(d.label) + '</span></a>';
      }).join('') + '<button type="button" class="e1-tabbar__item' + (def.door === 'reference' && splitMode() !== 'reference' ? ' is-active' : '') + '" data-action="sections">' + E1.icon('menu', 20) + '<span>More</span></button></nav>';
  }

  function footStrip() {
    var t = E1.tenant(), L = LEVELS[E1.state.level] || LEVELS.L1;
    return '<footer class="e1-foot"><span><span class="e1-foot__brand">elan1</span> Console · Release 2026.09 · <span class="e1-mono">console 2.0.0</span></span>' +
      '<span>Data stays in India · ' + esc(t.region || 'Mumbai') + ' residency</span>' +
      '<span>' + esc(E1.state.level + ' ' + L.name) + ' · ' + (E1.state.level === 'L1' ? 'every write hash-chained, not signed' : 'preview of a later level') + '</span></footer>';
  }

  var layouts = {};
  E1.layouts = layouts;

  layouts.console = function (content, def, title) {
    var cls = 'e1-app e1-app--console' + (E1.state.panel ? ' is-panel' : ' is-rail') + (def.wide ? ' is-wide' : '');
    return '<div class="' + cls + '">' + topbar(def) + sidebarNav(def) + rail(def) +
      '<main class="e1-main" id="e1-main" tabindex="-1">' +
        '<div class="e1-crumbbar">' + crumbHtml(crumbsFor(def, title)) +
          '<span class="e1-crumbbar__env e1-envtag e1-envtag--' + E1.state.env + '" title="' + (E1.state.env === 'sandbox' ? 'Every figure on this screen is sample data from the per-tenant sandbox.' : 'Live tenant data.') + '">' + (E1.state.env === 'sandbox' ? 'Sandbox data' : 'Live data') + '</span></div>' +
        '<div class="e1-content">' + content + '</div>' + footStrip() +
      '</main>' + tabbar(def) + '</div>';
  };

  function siteLinks(list) { return (list || []).filter(function (l) { return (!E1.site.filter || E1.hasRoute(l.href)) && !isForeign(l.href); }); }

  layouts.public = function (content, def) {
    var here = '#' + E1.state.route.path;
    var nav = siteLinks(E1.site.header).map(function (l) { return '<a class="e1-site__link' + (l.href === here ? ' is-active' : '') + '" href="' + esc(l.href) + '"' + (l.href === here ? ' aria-current="page"' : '') + '>' + esc(l.label) + '</a>'; }).join('');
    var cta = siteLinks(E1.site.cta).map(function (l) { return '<a class="e1-btn e1-btn--' + (l.kind || 'primary') + '" href="' + esc(l.href) + '"><span>' + esc(l.label) + '</span></a>'; }).join('');
    var foot = E1.site.footer.map(function (col) {
      var links = siteLinks(col.links); if (!links.length) return '';
      return '<div class="e1-site__fcol"><h2 class="e1-label">' + esc(col.title) + '</h2><ul role="list">' + links.map(function (l) { return '<li><a href="' + esc(l.href) + '">' + esc(l.label) + '</a></li>'; }).join('') + '</ul></div>';
    }).join('');
    var menuId = 'pop-sitenav';
    return '<div class="e1-app e1-app--public">' +
      '<header class="e1-site__header" role="banner"><button type="button" class="e1-skip" data-action="skip">Skip to content</button><div class="e1-site__bar">' + logo('auto', E1.hasRoute('/') ? '#/' : E1.doorHome('work')) +
        '<nav class="e1-site__nav" aria-label="Site">' + nav + '</nav><div class="e1-site__cta">' + cta +
        '<button type="button" class="e1-iconbtn e1-site__theme" data-action="theme" aria-label="' + (E1.state.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme') + '">' + E1.icon(E1.state.theme === 'dark' ? 'sun' : 'moon', 18) + '</button>' +
        '<div class="e1-popwrap e1-site__menu"><button type="button" class="e1-iconbtn" data-pop="' + menuId + '" aria-haspopup="menu" aria-expanded="false" aria-label="Menu">' + E1.icon('menu', 20) + '</button>' +
        '<div class="e1-pop e1-pop--menu e1-pop--right" id="' + menuId + '" role="menu" hidden tabindex="-1">' + siteLinks(E1.site.header.concat(E1.site.cta)).map(function (l) { return menuItem({ label: l.label, href: l.href }); }).join('') + '</div></div>' +
      '</div></div></header>' +
      '<main class="e1-main e1-site__main" id="e1-main" tabindex="-1">' + content + '</main>' +
      '<footer class="e1-site__footer"><div class="e1-site__fwrap"><div class="e1-site__fbrand">' + logo('white', E1.hasRoute('/') ? '#/' : E1.doorHome('work')) +
        '<p class="e1-site__descriptor">The Agentic Transformation Company</p><p class="e1-site__legal">' + esc(E1.site.legal) + '</p></div>' + foot + '</div>' +
        '<div class="e1-site__fbase"><span>© 2026 elan1</span><span>Written in British English. Amounts in Indian grouping. Times in IST.</span></div></footer>' +
      '</div>';
  };

  layouts.auth = function (content, def) {
    return '<div class="e1-app e1-app--auth">' +
      '<button type="button" class="e1-skip" data-action="skip">Skip to content</button>' +
      '<aside class="e1-auth__brand" aria-label="elan1">' + logo('white', E1.hasRoute('/') ? '#/' : '#/auth/sign-in') +
        '<div class="e1-auth__statement"><p class="e1-auth__kicker">// Governed by design</p><p class="e1-auth__line">The agent drafts it.<br><span>You commit it.</span></p>' +
        '<p class="e1-auth__sub">Every write is checked against versioned rules before it happens, and a named person approves the ones that need one.</p></div>' +
        '<p class="e1-auth__foot">elan1 is built on Claude. Mumbai residency by default.</p>' +
        '<span class="e1-auth__field" aria-hidden="true"></span></aside>' +
      '<main class="e1-auth__main" id="e1-main" tabindex="-1"><div class="e1-auth__card">' + content + '</div>' +
        '<p class="e1-auth__legal">Protected sign-in. Sessions end after 12 hours of inactivity.</p></main>' +
      '</div>';
  };

  layouts.bare = function (content, def, title) {
    return '<div class="e1-app e1-app--bare">' +
      '<header class="e1-bare__head" role="banner"><button type="button" class="e1-skip" data-action="skip">Skip to content</button>' + logo('auto', E1.hasRoute('/') ? '#/' : E1.doorHome('work')) +
        '<span class="e1-bare__title">' + esc(def.bareTitle || title || '') + '</span>' +
        '<button type="button" class="e1-iconbtn" data-action="theme" aria-label="' + (E1.state.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme') + '">' + E1.icon(E1.state.theme === 'dark' ? 'sun' : 'moon', 18) + '</button></header>' +
      '<main class="e1-bare__main" id="e1-main" tabindex="-1">' + content + '</main>' +
      '<footer class="e1-bare__foot"><span>elan1 · The Agentic Transformation Company</span><span>This page runs without an elan1 account.</span></footer>' +
      '</div>';
  };

  /* Doc nav for a route: def.docNav (array, or function(params, query) → array) replaces E1.docNav for that route. */
  function docNavFor(def) {
    var r = E1.state.route, dn = def.docNav;
    if (typeof dn === 'function') { try { dn = dn(r.params || {}, r.query || {}); } catch (e) { reportError(e); dn = null; } }
    return Array.isArray(dn) ? dn : (E1.docNav || []);
  }
  layouts.doc = function (content, def, title) {
    var here = '#' + E1.state.route.path;
    var nav = docNavFor(def).map(function (g) {
      return '<div class="e1-docnav__group"><div class="e1-subnav__glabel">' + esc(g.title) + '</div><ul role="list">' + g.items.map(function (it) {
        var on = it.active !== undefined ? !!it.active : it.href === here;
        return '<li><a class="e1-subnav__item' + (on ? ' is-active' : '') + '" href="' + esc(it.href) + '"' + (on ? ' aria-current="page"' : '') + '><span>' + esc(it.label) + '</span></a></li>';
      }).join('') + '</ul></div>';
    }).join('');
    return '<div class="e1-app e1-app--doc">' +
      '<header class="e1-doc__head" role="banner"><button type="button" class="e1-skip" data-action="skip">Skip to content</button>' + logo('auto', E1.hasRoute('/') ? '#/' : E1.doorHome('work')) + '<span class="e1-doc__brandsep">' + esc(def.docLabel || 'Docs') + '</span>' +
        '<button type="button" class="e1-doc__search" data-action="palette">' + E1.icon('search', 16) + '<span>Search the docs</span><kbd class="e1-kbd">Ctrl K</kbd></button>' +
        '<button type="button" class="e1-iconbtn" data-action="theme" aria-label="' + (E1.state.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme') + '">' + E1.icon(E1.state.theme === 'dark' ? 'sun' : 'moon', 18) + '</button></header>' +
      '<div class="e1-doc__body">' + (nav ? '<nav class="e1-docnav" aria-label="Documentation">' + nav + '</nav>' : '') +
        '<main class="e1-doc__main" id="e1-main" tabindex="-1">' + (def.crumbs ? crumbHtml(crumbsFor(def, title)) : '') + '<article class="e1-prose e1-doc__article">' + content + '</article></main>' +
        '<aside class="e1-doc__toc" aria-label="On this page"></aside></div>' +
      '</div>';
  };

  layouts.mobile = function (content, def, title) {
    var back = def.back || null;
    return '<div class="e1-app e1-app--mobile">' +
      '<button type="button" class="e1-skip" data-action="skip">Skip to content</button>' +
      '<div class="e1-mstage">' +
        '<aside class="e1-mstage__side">' + logo('auto', E1.doorHome('work')) +
          '<p class="e1-label">Mobile · 390 × 844</p><h1 class="e1-mstage__title">' + esc(title) + '</h1>' +
          (def.lead ? '<p class="e1-mstage__lead">' + esc(def.lead) + '</p>' : '') +
          (back ? '<a class="e1-btn e1-btn--secondary" href="' + esc(back[1]) + '">' + E1.icon('arrow-left', 16) + '<span>' + esc(back[0]) + '</span></a>' : '') +
        '</aside>' +
        '<div class="e1-phone" role="region" aria-label="Phone preview: ' + esc(title) + '">' +
          '<div class="e1-phone__status" aria-hidden="true"><span>' + E1.fmt.time(new Date()).replace(' IST', '') + '</span><span class="e1-phone__notch"></span><span class="e1-phone__sig"><i></i><i></i><i></i><i></i> 5G</span></div>' +
          '<main class="e1-phone__screen" id="e1-main" tabindex="-1">' + content + '</main>' +
          '<div class="e1-phone__home" aria-hidden="true"></div>' +
        '</div>' +
      '</div></div>';
  };

  /* ------------------------------------------------------------------------
     Built-in routes: door roots, profile, 404
     ------------------------------------------------------------------------ */
  ['work', 'records', 'agents', 'assurance', 'reference'].forEach(function (d) {
    E1.route('/' + d, { title: E1.nav[d].label, redirect: function () { return E1.doorHome(d); }, palette: false });
  });

  E1.route('/account/profile', {
    title: 'Profile and preferences', layout: 'console', keywords: 'account user settings preferences',
    crumbs: [['Account', null]],
    render: function () {
      var u = (E1.data && E1.data.user) || {}, c = E1.c;
      return c.pageHeader({ title: 'Profile and preferences', lead: 'Who you are to the platform, and how the console looks to you. Preferences are stored in this browser only.' }) +
        '<div class="e1-grid e1-grid--2">' +
        c.card({ title: 'Identity', body: '<div class="e1-row" style="gap:16px;margin-bottom:16px">' + c.avatar(u.name, { kind: 'person', size: 'xl' }) + '<div><div class="e1-text-section">' + esc(u.name) + '</div><div class="e1-muted">' + esc(u.role) + '</div></div></div>' +
          c.kv([['Email', u.email], ['Actor kind', 'Person'], ['Actor id', u.actorId, { mono: true }], ['Resolver sets', (u.resolverSets || []).join(', ')], ['Payment authority', u.authority]]) }) +
        c.card({ title: 'Preferences', body:
          c.field('Theme', c.segmented([{ id: 'light', label: 'Light' }, { id: 'dark', label: 'Dark' }], E1.state.theme, { name: 'pref-theme', label: 'Theme' })) +
          c.field('Density', c.segmented([{ id: 'compact', label: 'Compact' }, { id: 'default', label: 'Default' }, { id: 'comfortable', label: 'Comfortable' }], E1.state.density, { name: 'pref-density', label: 'Density' }), { help: 'Changes every table and control in the console.' }) +
          c.field('Assurance level shown', c.segmented([{ id: 'L1', label: 'L1 Guarded' }, { id: 'L2', label: 'L2 Attested' }, { id: 'L3', label: 'L3 Proven' }], E1.state.level, { name: 'pref-level', label: 'Assurance level' }), { help: 'L2 and L3 are previews. Your tenant runs at L1.' }) +
          c.field('Keyboard', c.toggle({ id: 'pref-keys', label: 'Single-key shortcuts', note: 't, [, ? and g then a letter. Ctrl K always works.', checked: E1.state.singleKeys })) }) +
        '</div>';
    },
    mount: function (el) {
      var k = el.querySelector('#pref-keys');
      if (k) k.addEventListener('change', function () { E1.set('singleKeys', k.checked, { silent: true }); E1.toast(k.checked ? 'Single-key shortcuts are on.' : 'Single-key shortcuts are off. Ctrl K still opens the palette.', 'neutral'); });
      el.addEventListener('e1:change', function (e) {
        var g = e.target.getAttribute('data-name'), v = e.detail.value;
        if (g === 'pref-theme') E1.set('theme', v); else if (g === 'pref-density') E1.set('density', v); else if (g === 'pref-level') E1.set('level', v);
      });
    }
  });

  function notFound(path) {
    var seg = path.split('/')[1];
    var door = E1.nav[seg] ? seg : null;
    var sugg = routeEntries().filter(function (r) { return !isForeign(r.run); }).map(function (r) { return { r: r, s: E1.fuzzy(path.replace(/[\/-]/g, ' ').trim(), r.label + ' ' + r.hint) }; })
      .filter(function (x) { return x.s > 0; }).sort(function (a, b) { return b.s - a.s; }).slice(0, 4).map(function (x) { return x.r; });
    return {
      title: 'Not found', layout: 'console', door: door, section: null,
      render: function () {
        return '<section class="e1-404">' +
          '<div class="e1-404__mark" aria-hidden="true"><span class="e1-disc e1-disc--aperture"></span></div>' +
          '<p class="e1-label">404 · no screen at this address</p>' +
          '<h1 class="e1-404__title">There is no screen at this address.</h1>' +
          '<p class="e1-404__lead">The link may be from a version of the console that has since changed, or the screen has not been built yet. Nothing was changed by opening it.</p>' +
          '<p class="e1-404__path"><span class="e1-label">Address</span> <code>#' + esc(path) + '</code></p>' +
          (sugg.length ? '<div class="e1-404__sugg"><p class="e1-label">Closest screens</p><ul role="list">' + sugg.map(function (s) { return '<li><a href="' + esc(s.run) + '">' + E1.icon(s.icon, 16) + '<span>' + esc(s.label) + '</span><code>' + esc(s.hint) + '</code></a></li>'; }).join('') + '</ul></div>' : '') +
          '<div class="e1-row" style="gap:8px;margin-top:24px">' + (splitMode() === 'reference' ? E1.c.button('Go to All screens', { kind: 'primary', href: E1.doorHome('reference'), icon: 'grid' }) : E1.c.button('Go to Today', { kind: 'primary', href: E1.doorHome('work'), icon: 'work' })) + E1.c.button('Search every screen', { kind: 'secondary', icon: 'search', attrs: 'data-action="palette"' }) + '</div>' +
          '</section>';
      }
    };
  }

  function errorDef(err, def) {
    return {
      title: 'This screen failed to render', layout: def && def.layout === 'console' ? 'console' : (def && def.layout) || 'console', door: def && def.door, section: def && def.section,
      render: function () {
        return E1.c.error({ title: 'This screen failed to render.', body: 'This is our failure, not a rule. Nothing was changed. The error below is what an engineer needs.', code: String(err && err.message || err), action: { label: 'Reload the screen', href: '#' + E1.state.route.path } });
      }
    };
  }

  /* ------------------------------------------------------------------------
     Screen inventory · screen-info pill · Screen notes (review aids, both
     references put them on every screen). Data: window.E1_SCREENS, an array of
     {n, id, file, title, route, pattern, surface, section, type, states:[{label, href}],
      components:[], rules:[], src:[], spec} loaded by js/inventory.js (optional).
     ------------------------------------------------------------------------ */
  function inventory() { return Array.isArray(window.E1_SCREENS) ? window.E1_SCREENS : []; }
  E1.inventory = inventory;
  var invCache = { list: null, pats: [] };
  function invPatterns() {
    var L = inventory();
    if (invCache.list !== L || invCache.pats.length !== L.length) {
      invCache.list = L;
      invCache.pats = L.map(function (it) {
        var r = it.route ? parseHash('#' + String(it.route).replace(/^#/, '')) : null;
        var m = it.pattern ? { pattern: normPath(it.pattern) } : (r ? E1.match(r.path) : null);
        return { path: r ? r.path : null, query: r ? r.query : {}, pattern: m ? m.pattern : null };
      });
    }
    return invCache.pats;
  }
  function sameQuery(a, b) {
    a = a || {}; b = b || {};
    var ka = Object.keys(a).filter(function (k) { return k !== 'pill' && k !== 'thumb'; }), kb = Object.keys(b).filter(function (k) { return k !== 'pill' && k !== 'thumb'; });
    if (ka.length !== kb.length) return false;
    for (var i = 0; i < ka.length; i++) if (String(a[ka[i]]) !== String(b[ka[i]])) return false;
    return true;
  }
  /** Index into E1_SCREENS of the item for a route (default: the current one), or -1. Exact route wins, then same path, then same pattern. */
  E1.screenIndex = function (path, query) {
    var L = inventory(); if (!L.length) return -1;
    var r = E1.state.route || {};
    path = normPath(path || r.path || '/'); query = query || (path === r.path ? r.query : {}) || {};
    var m = E1.match(path), pat = m ? m.pattern : null, best = -1, score = 0, pinned = window.E1_SCREEN_ID;
    invPatterns().forEach(function (p, i) {
      var sc = 0;
      if (pinned && L[i].id === pinned && p.path === path) sc = 5;
      else if (p.path === path && sameQuery(p.query, query)) sc = 4;
      else if (p.path === path && !Object.keys(p.query).length) sc = 3;
      else if (p.path === path) sc = 2;
      else if (pat && p.pattern === pat) sc = Object.keys(p.query).length ? 0.5 : 1;
      if (sc > score) { score = sc; best = i; }
    });
    return best;
  };
  /** The inventory item for the current route (or null). */
  E1.screen = function () { var i = E1.screenIndex(); return i < 0 ? null : inventory()[i]; };
  function pad3(n) { n = String(n === undefined || n === null ? '' : n); return n.length >= 3 || !/^\d+$/.test(n) ? n : ('00' + n).slice(-3); }
  /** Href to an inventory item: its screens/*.html file in file mode, its hash route otherwise. */
  E1.screenHref = function (it) {
    if (!it) return '#/reference/screen-map';
    if (window.E1_FILE_MODE && it.file) return E1.asset('screens/' + it.file);
    return it.route ? '#' + String(it.route).replace(/^#/, '') : (it.file ? E1.asset('screens/' + it.file) : '#/reference/screen-map');
  };
  function atlasItemHref(it) { return atlasHref(it ? it.id : null); }
  function inFrame() { try { if (window.self !== window.top) return true; } catch (e) { return true; } return /(?:^|[?&])thumb=1/.test(window.location.search) || /[?&]thumb=1/.test(window.location.hash); }
  function pillWanted() {
    var q = (E1.state.route && E1.state.route.query) || {};
    if (q.pill === '1') return true;
    if (q.pill === '0' || inFrame()) return false;
    return E1.store.get('pill', true) !== false;
  }
  function layoutWord(def) { return { console: 'Console', public: 'Website', auth: 'Sign in', bare: 'Public', doc: 'Docs', mobile: 'Mobile', wizard: 'Onboarding' }[def.layout || 'console'] || 'Screen'; }

  function renderPill(title) {
    var host = layer('e1-pill', { 'class': 'e1-pill-layer' });
    if (!pillWanted()) { host.innerHTML = ''; return; }
    var L = inventory(), i = E1.screenIndex(), it = i >= 0 ? L[i] : null, def = E1.state.route.def || {};
    var layout = def.layout || 'console';
    host.setAttribute('data-layout', layout);
    var num, type, where, prev = '', next = '';
    if (it) {
      num = pad3(it.n !== undefined ? it.n : i + 1); type = it.type || layoutWord(def);
      where = (it.section && it.section !== it.title ? it.section + ' · ' : '') + (it.title || '');
      var R = splitMode() ? L.filter(function (x) { return x === it || !isForeign(E1.screenHref(x)); }) : L, j = R.indexOf(it);
      var p = R[(j - 1 + R.length) % R.length], n = R[(j + 1) % R.length];
      prev = '<a class="e1-pill__btn" href="' + esc(E1.screenHref(p)) + '" aria-label="Previous screen: ' + esc(pad3(p.n) + ' ' + p.title) + '" data-tip="' + esc(pad3(p.n) + ' ' + p.title) + '">' + E1.icon('chevron-left', 16) + '</a>';
      next = '<a class="e1-pill__btn" href="' + esc(E1.screenHref(n)) + '" aria-label="Next screen: ' + esc(pad3(n.n) + ' ' + n.title) + '" data-tip="' + esc(pad3(n.n) + ' ' + n.title) + '">' + E1.icon('chevron-right', 16) + '</a>';
    } else {
      num = '—'; type = layoutWord(def);
      var sec = def.door && E1.nav[def.door] ? E1.nav[def.door].label : '';
      where = [sec, title].filter(Boolean).join(' · ');
    }
    host.innerHTML = '<div class="e1-pill" role="navigation" aria-label="Screen information">' +
      '<b class="e1-pill__n">' + esc(num) + '</b><span class="e1-pill__type">' + esc(type) + '</span>' +
      '<span class="e1-pill__where" title="' + esc(where) + '">' + esc(where) + '</span>' + prev +
      '<a class="e1-pill__btn" href="' + esc(atlasItemHref(it)) + '" aria-label="Every screen" data-tip="Every screen">' + E1.icon('grid', 16) + '</a>' + next +
      '<button type="button" class="e1-pill__notes" data-action="screen-notes" aria-label="Screen notes (i hides this pill)">' + E1.icon('file-text', 15) + '<span>Notes</span></button></div>';
  }

  function listBlock(label, arr, fmt) {
    if (typeof arr === 'string') arr = arr ? [arr] : [];
    if (!arr || !arr.length) return '';
    return '<section class="e1-notes__block"><h3 class="e1-label">' + esc(label) + '</h3><ul class="e1-notes__list">' + arr.map(function (x) { return '<li>' + (fmt ? fmt(x) : esc(x)) + '</li>'; }).join('') + '</ul></section>';
  }
  function stateHref(s, it) {
    var h = typeof s === 'string' ? null : s.href;
    if (!h) return E1.screenHref(it);
    if (h.charAt(0) === '#' || /^[a-z]+:/i.test(h)) return h;
    if (h.charAt(0) === '/') return '#' + h;
    if (h.charAt(0) === '?') return E1.screenHref(it).split('?')[0] + h;
    return E1.asset(h);
  }
  /** Open the Screen notes drawer for the current route (id, number, type, surface, route, states, components, rules, sources, spec). */
  E1.screenNotes = function () {
    var r = E1.state.route || {}, def = r.def || {}, it = E1.screen();
    var title = safeTitle(def, r.params, r.query) || 'This screen';
    var here = '#' + r.path + E1.qs(r.query);
    var body;
    if (it) {
      body = (it.spec ? '<p class="e1-notes__spec">' + esc(it.spec) + '</p>' : '') +
        '<dl class="e1-kv e1-kv--compact e1-notes__kv">' +
        [['Screen id', it.id, true], ['Number', pad3(it.n), true], ['Type', it.type], ['Surface', [it.surface, it.section].filter(Boolean).join(' · ')],
         ['Route', '<a href="' + esc(E1.screenHref(it)) + '"><code>' + esc(it.route || '') + '</code></a>', false, true], ['Pattern', it.pattern || r.pattern, true], ['File', it.file ? 'screens/' + it.file : '', true]]
          .filter(function (x) { return x[1]; })
          .map(function (x) { return '<div class="e1-kv__row"><dt>' + esc(x[0]) + '</dt><dd' + (x[2] ? ' class="e1-mono"' : '') + '>' + (x[3] ? x[1] : esc(x[1])) + '</dd></div>'; }).join('') + '</dl>' +
        (it.states && it.states.length ? '<section class="e1-notes__block"><h3 class="e1-label">States · ' + it.states.length + '</h3><div class="e1-notes__states">' +
          it.states.map(function (s) { var lab = typeof s === 'string' ? s : s.label; var h = stateHref(s, it); return '<a class="e1-chip' + (h === here ? ' is-selected' : '') + '" href="' + esc(h) + '">' + esc(lab) + '</a>'; }).join('') + '</div></section>' : '') +
        (it.components && it.components.length ? '<section class="e1-notes__block"><h3 class="e1-label">Components used · ' + it.components.length + '</h3><div class="e1-notes__tags">' + it.components.map(function (x) { return '<span class="e1-tag">' + esc(x) + '</span>'; }).join('') + '</div></section>' : '') +
        listBlock('Rules this screen keeps', it.rules) + listBlock('Source documents', it.src);
    } else {
      body = '<p class="e1-notes__spec">This route is not in the numbered screen inventory yet, so it has no notes beyond what the router knows.</p>' +
        '<dl class="e1-kv e1-kv--compact e1-notes__kv">' + [['Route', here], ['Pattern', r.pattern || '(none — not found)'], ['Layout', def.layout || 'console'], ['Door', def.door || '—'], ['Section', def.section || '—']]
          .map(function (x) { return '<div class="e1-kv__row"><dt>' + esc(x[0]) + '</dt><dd class="e1-mono">' + esc(x[1]) + '</dd></div>'; }).join('') + '</dl>';
    }
    return E1.drawer({
      eyebrow: 'Screen notes' + (it ? ' · ' + pad3(it.n) + ' · ' + (it.type || '') : ''), title: it ? it.title : title, cls: 'e1-drawer--notes', width: 'min(440px, 100vw)', body: body,
      actions: [{ label: 'Every screen', kind: 'secondary', href: atlasItemHref(it), icon: 'grid' }, { label: 'Done', kind: 'primary' }]
    });
  };
  E1.action('screen-notes', function () { E1.screenNotes(); });
  /** Show or hide the screen-info pill (key i). Persists per browser. */
  E1.togglePill = function (on) {
    if (on === undefined) on = E1.store.get('pill', true) === false;
    E1.store.set('pill', !!on);
    renderPill(document.title.replace(/ · elan1$/, ''));
    E1.announce(on ? 'Screen information shown' : 'Screen information hidden');
  };

  /* ------------------------------------------------------------------------
     Render
     ------------------------------------------------------------------------ */
  var errors = E1.errors = [];
  function reportError(err) { errors.push(err); if (window.console && console.error) console.error(err); }

  var lastPath = null;
  /** Re-render the current route. opts.keepScroll keeps the scroll position. */
  E1.render = function (opts) {
    opts = opts || {};
    var root = document.getElementById('e1-root');
    if (!root) { root = document.createElement('div'); root.id = 'e1-root'; document.body.insertBefore(root, document.body.firstChild); }
    applyRootAttrs();
    var loc = parseHash();
    var m = E1.match(loc.path);
    if (m && m.def.redirect) {
      var to = typeof m.def.redirect === 'function' ? m.def.redirect(m.params, loc.query) : m.def.redirect;
      E1.go(to, null, { replace: true });
      return;
    }
    var def = m ? m.def : notFound(loc.path), params = m ? m.params : {};
    E1.state.route = { path: loc.path, params: params, query: loc.query, def: def, pattern: m ? m.pattern : null };
    closePops();
    var content, title = safeTitle(def, params, loc.query);
    try { content = def.render ? def.render(params, loc.query) : ''; }
    catch (err) { reportError(err); def = errorDef(err, def); content = def.render(); title = def.title; }
    var layout = layouts[def.layout || 'console'] ? def.layout || 'console' : 'console';
    var scroller = document.scrollingElement || document.documentElement;
    var keep = opts.keepScroll || (lastPath === loc.path);
    var y = scroller.scrollTop;
    var sideEl = root.querySelector('.e1-side__scroll'), sideY = sideEl ? sideEl.scrollTop : 0;
    root.innerHTML = layouts[layout](content, def, title);
    document.title = (title ? title + ' · ' : '') + 'elan1';
    var sideNew = root.querySelector('.e1-side__scroll');
    if (sideNew) {
      sideNew.scrollTop = sideY;
      var act = sideNew.querySelector('.e1-side__item.is-active');
      if (act && (act.offsetTop < sideNew.scrollTop || act.offsetTop + act.offsetHeight > sideNew.scrollTop + sideNew.clientHeight)) sideNew.scrollTop = Math.max(0, act.offsetTop - 80);
    }
    var main = document.getElementById('e1-main');
    if (def.mount) { try { def.mount(main, params, loc.query); } catch (err2) { reportError(err2); } }
    if (layout === 'doc') buildDocToc();
    try { renderPill(title); } catch (errP) { reportError(errP); }
    tick();
    if (keep) { scroller.scrollTop = y; }
    else {
      scroller.scrollTop = 0;
      var ps = document.querySelector('.e1-phone__screen'); if (ps) ps.scrollTop = 0;
      if (lastPath !== null && main) { try { main.focus({ preventScroll: true }); } catch (e) { /* ok */ } E1.announce(title); }
    }
    lastPath = loc.path;
    try { document.dispatchEvent(new CustomEvent('e1:render', { detail: E1.state.route })); } catch (e) { /* old */ }
  };

  function buildDocToc() {
    var aside = document.querySelector('.e1-doc__toc'); if (!aside) return;
    var hs = document.querySelectorAll('.e1-doc__article h2[id], .e1-doc__article h3[id]');
    if (!hs.length) { aside.innerHTML = ''; return; }
    var here = '#' + E1.state.route.path + E1.qs(E1.state.route.query);
    aside.innerHTML = '<p class="e1-label">On this page</p><ul role="list">' + Array.prototype.map.call(hs, function (h) {
      return '<li class="is-' + h.tagName.toLowerCase() + '"><a href="' + esc(here) + '" data-scrollto="' + esc(h.id) + '">' + esc(h.textContent) + '</a></li>';
    }).join('') + '</ul>';
  }

  /* Countdown ticker: updates every [data-deadline] once a second */
  function tick() {
    var els = document.querySelectorAll('[data-deadline]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i], dl = new Date(el.getAttribute('data-deadline')).getTime(), left = dl - Date.now();
      var warn = Number(el.getAttribute('data-warn') || 60) * 60000;
      var txt = el.querySelector('.e1-countdown__t') || el;
      if (left <= 0) { txt.textContent = 'Expired'; el.setAttribute('data-state', 'critical'); }
      else { txt.textContent = E1.fmt.duration(left) + ' left'; el.setAttribute('data-state', left < warn ? 'warning' : 'neutral'); }
      var win = Number(el.getAttribute('data-window') || 0), bar = el.querySelector('.e1-countdown__bar i');
      if (win && bar) bar.style.width = Math.max(0, Math.min(100, left / (win * 60000) * 100)).toFixed(1) + '%';
    }
  }
  E1.tick = tick;
  setInterval(tick, 1000);

  window.addEventListener('hashchange', function () { if (stack.length) E1.close(true); else closePops(); E1.render(); });
  window.addEventListener('error', function (e) { errors.push(e.error || e.message); });

  /** Boot the router (called by app.js on DOMContentLoaded). */
  E1.start = function (opts) {
    opts = opts || {};
    applyRootAttrs();
    if (!window.location.hash || window.location.hash === '#') {
      var home = window.E1_START ? String(window.E1_START).replace(/^#/, '') : (E1.hasRoute('/') ? '/' : (opts.fallback || '/work/today'));
      if (home !== '/') { E1.go(home, null, { replace: true }); return; }
    } else if (!E1.hasRoute(parseHash().path) && parseHash().path === '/' && opts.fallback) {
      E1.go(opts.fallback, null, { replace: true }); return;
    }
    E1.render();
  };

  /* E1.icon is provided by components.js; this stub keeps core usable alone. */
  if (!E1.icon) E1.icon = function () { return ''; };
})();
