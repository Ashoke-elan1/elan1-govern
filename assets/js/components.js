/* ==========================================================================
   elan1 components v2.0 — E1.c.*
   Every helper returns an HTML string. Text arguments are escaped unless the
   JSDoc says the argument is HTML. Colour comes only from tokens (classes in
   components.css). Status is always a word plus a shape, never colour alone.
   ========================================================================== */
(function () {
  'use strict';
  var E1 = window.E1;
  var esc = E1.esc;
  var c = E1.c = {};

  /* ------------------------------------------------------------------------
     Icons — 24 grid, 1.5px stroke (non-scaling), square terminals, currentColor
     ------------------------------------------------------------------------ */
  var DOT = function (cx, cy) { return '<circle cx="' + cx + '" cy="' + cy + '" r="1.3" fill="currentColor" stroke="none"/>'; };
  var I = {
    /* doors */
    work: '<path d="M3 13.5h5l1.5 2.5h5l1.5-2.5h5"/><path d="M5.5 5h13L21 13.5V19H3v-5.5z"/>',
    records: '<ellipse cx="12" cy="5.5" rx="7.5" ry="2.5"/><path d="M4.5 5.5v13c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5v-13"/><path d="M4.5 12c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5"/>',
    agents: '<rect x="4.5" y="8" width="15" height="12" rx="2"/><path d="M12 4.5V8M9.5 13v2M14.5 13v2M2 12.5v3.5M22 12.5v3.5"/>' + DOT(12, 3.5),
    assurance: '<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    /* governance */
    approve: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.8 2.8L16.5 9"/>',
    reject: '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
    refuse: '<circle cx="12" cy="12" r="9"/><path d="M5.7 5.7l12.6 12.6"/>',
    gate: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 0 0 17z" fill="currentColor" stroke="none"/>',
    proof: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 14l2 2 4-4.5"/>',
    chain: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.2 1.2"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.2-1.2"/>',
    hash: '<path d="M5 9h15M4 15h15M10.5 3.5l-2 17M16 3.5l-2 17"/>',
    key: '<circle cx="8" cy="15.5" r="4"/><path d="M11 12.5l8.5-8.5M16 7.5l2.5 2.5M13.5 10l2 2"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="1.5"/><path d="M8 10.5v-3a4 4 0 0 1 8 0v3M12 14.5v2.5"/>',
    unlock: '<rect x="5" y="10.5" width="14" height="10" rx="1.5"/><path d="M8 10.5v-3a4 4 0 0 1 7.7-1.5M12 14.5v2.5"/>',
    seal: '<circle cx="12" cy="9.5" r="6"/><circle cx="12" cy="9.5" r="2.5"/><path d="M8.5 14.5L7 21l5-2.5 5 2.5-1.5-6.5"/>',
    stamp: '<path d="M12 3a3 3 0 0 0-3 3c0 1.6 1 2.4 1 4v2.5h4V10c0-1.6 1-2.4 1-4a3 3 0 0 0-3-3z"/><path d="M4.5 12.5h15v4h-15zM6 20.5h12"/>',
    fingerprint: '<path d="M6.5 18.5c1-1.8 1.5-4 1.5-6.5a4 4 0 0 1 8 0c0 3-.4 5.5-1.3 7.5"/><path d="M12 12c0 3.5-.8 6.3-2.5 8.5"/><path d="M4.5 14.5c.3-.8.5-1.6.5-2.5a7 7 0 0 1 12-4.9M19 11.5c.1 2.3-.1 4.6-.6 6.7"/>',
    scale: '<path d="M12 3.5v17M7.5 20.5h9M5 6.5h14"/><path d="M5 6.5L2.5 13a2.5 2.5 0 0 0 5 0zM19 6.5L16.5 13a2.5 2.5 0 0 0 5 0z"/>',
    undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
    aperture: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/>' + DOT(12, 12),
    sparkle: '<path d="M11 3c.6 4.4 2.6 6.4 7 7-4.4.6-6.4 2.6-7 7-.6-4.4-2.6-6.4-7-7 4.4-.6 6.4-2.6 7-7z"/><path d="M19 15.5v5M16.5 18h5"/>',
    /* time */
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    timer: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V10M9.5 2.5h5M18.5 6.5l1.5-1.5"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="1.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    history: '<path d="M3.5 12a8.5 8.5 0 1 0 2.5-6L3.5 8.5M3.5 4v4.5H8"/><path d="M12 8v4.5l3 1.5"/>',
    /* feedback */
    alert: '<path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 10v4.5"/>' + DOT(12, 17.2),
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/>' + DOT(12, 7.8),
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.5v.7"/>' + DOT(12, 17),
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    skip: '<circle cx="12" cy="12" r="9" stroke-dasharray="3 3"/><path d="M8 12h8"/>',
    /* actions */
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5l5 5"/>',
    filter: '<path d="M3.5 5h17l-6.5 7.5v6l-4 2v-8z"/>',
    sort: '<path d="M8 4v16M4.5 7.5L8 4l3.5 3.5M16 20V4M12.5 16.5L16 20l3.5-3.5"/>',
    download: '<path d="M12 3.5v12M7 10.5l5 5 5-5M4.5 20.5h15"/>',
    upload: '<path d="M12 15.5v-12M7 8.5l5-5 5 5M4.5 20.5h15"/>',
    'export': '<path d="M8 9H5v11.5h14V9h-3M12 3v11M8.5 6.5L12 3l3.5 3.5"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',
    copy: '<rect x="8.5" y="8.5" width="12" height="12" rx="1.5"/><path d="M15.5 8.5v-4a1 1 0 0 0-1-1h-10a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h4"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    'eye-off': '<path d="M9.9 5.8A9.7 9.7 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.6 3.4M6.6 6.9C4 8.6 2.5 12 2.5 12S6 18.5 12 18.5c1.9 0 3.5-.6 4.9-1.5"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2M3.5 3.5l17 17"/>',
    edit: '<path d="M4 20h4L19.5 8.5l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    trash: '<path d="M4 6.5h16M9.5 6.5V4h5v2.5M6 6.5l1 14h10l1-14M10 10.5v6M14 10.5v6"/>',
    sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
    send: '<path d="M21 3L10 14M21 3l-7 18-4-7-7-4z"/>',
    tag: '<path d="M3.5 3.5h8l9 9-8 8-9-9z"/>' + DOT(8, 8),
    /* people & places */
    user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c.8-3.8 3.8-6 7.5-6s6.7 2.2 7.5 6"/>',
    users: '<circle cx="9" cy="8.5" r="3.5"/><path d="M2.5 20c.7-3.4 3.3-5.5 6.5-5.5s5.8 2.1 6.5 5.5M15 5.2a3.5 3.5 0 0 1 0 6.6M17.5 14.8c2 .7 3.5 2.5 4 5.2"/>',
    building: '<path d="M4 21V4h11v17M15 9h5v12M2.5 21h19M7.5 8h4M7.5 12h4M7.5 16h4"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
    'map-pin': '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    home: '<path d="M3.5 11L12 4l8.5 7M5.5 9.5V20h13V9.5M10 20v-5.5h4V20"/>',
    'log-out': '<path d="M9.5 20.5h-5v-17h5M15 16.5l4.5-4.5L15 7.5M19.5 12H9"/>',
    /* systems */
    server: '<rect x="3.5" y="4" width="17" height="7" rx="1.5"/><rect x="3.5" y="13" width="17" height="7" rx="1.5"/>' + DOT(7.5, 7.5) + DOT(7.5, 16.5),
    cloud: '<path d="M7 18.5a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 8.5a4.5 4.5 0 0 1-.5 10z"/>',
    plug: '<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4"/>',
    'git-branch': '<circle cx="6" cy="5.5" r="2"/><circle cx="6" cy="18.5" r="2"/><circle cx="18" cy="7.5" r="2"/><path d="M6 7.5v9M18 9.5a6 6 0 0 1-6 6H8"/>',
    code: '<path d="M8.5 7l-5 5 5 5M15.5 7l5 5-5 5M13.5 4.5l-3 15"/>',
    terminal: '<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M7 9l3 3-3 3M12.5 15.5H17"/>',
    command: '<path d="M9 9V6.5A2.5 2.5 0 1 0 6.5 9H9zm0 0h6m-6 0v6m6-6V6.5A2.5 2.5 0 1 1 17.5 9H15zm0 0v6m0 0H9m6 0v2.5a2.5 2.5 0 1 0 2.5-2.5H15zm-6 0v2.5A2.5 2.5 0 1 1 6.5 15H9z"/>',
    zap: '<path d="M13.5 2.5L5 13.5h6l-1 8 8.5-11h-6z"/>',
    /* media */
    play: '<path d="M7 4.5v15l12-7.5z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    stop: '<rect x="5.5" y="5.5" width="13" height="13" rx="1"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.5-4.5L4 8M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.5 4.5L20 16M20 20v-4h-4"/>',
    /* arrows */
    'arrow-left': '<path d="M20 12H4M10 6l-6 6 6 6"/>',
    'arrow-right': '<path d="M4 12h16M14 6l6 6-6 6"/>',
    'arrow-up': '<path d="M12 20V4M6 10l6-6 6 6"/>',
    'arrow-down': '<path d="M12 4v16M6 14l6 6 6-6"/>',
    'arrow-up-right': '<path d="M7 17L17 7M8 7h9v9"/>',
    'chevron-left': '<path d="M15 5l-7 7 7 7"/>',
    'chevron-right': '<path d="M9 5l7 7-7 7"/>',
    'chevron-up': '<path d="M5 15l7-7 7 7"/>',
    'chevron-down': '<path d="M5 9l7 7 7-7"/>',
    'chevrons-left': '<path d="M12 5l-7 7 7 7M19 5l-7 7 7 7"/>',
    'chevrons-right': '<path d="M5 5l7 7-7 7M12 5l7 7-7 7"/>',
    'chevrons-up-down': '<path d="M7 9l5-5 5 5M7 15l5 5 5-5"/>',
    /* chrome */
    more: DOT(5.5, 12) + DOT(12, 12) + DOT(18.5, 12),
    'more-vertical': DOT(12, 5.5) + DOT(12, 12) + DOT(12, 18.5),
    menu: '<path d="M4 6.5h16M4 12h16M4 17.5h16"/>',
    bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 20.5h4"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>',
    rows: '<rect x="4" y="4" width="16" height="4.5"/><rect x="4" y="10" width="16" height="4"/><rect x="4" y="15.5" width="16" height="4.5"/>',
    'panel-left': '<rect x="3.5" y="4.5" width="17" height="15" rx="1.5"/><path d="M9.5 4.5v15"/>',
    grid: '<rect x="4" y="4" width="6.5" height="6.5"/><rect x="13.5" y="4" width="6.5" height="6.5"/><rect x="4" y="13.5" width="6.5" height="6.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5"/>',
    list: '<path d="M8.5 6.5h12M8.5 12h12M8.5 17.5h12"/>' + DOT(4.5, 6.5) + DOT(4.5, 12) + DOT(4.5, 17.5),
    /* documents */
    book: '<path d="M12 6.5C10.5 5 8 4.5 3 4.5v14c5 0 7.5.5 9 2 1.5-1.5 4-2 9-2v-14c-5 0-7.5.5-9 2zM12 6.5v14"/>',
    file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
    'file-text': '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12.5h6M9 16h6M9 9h2"/>',
    folder: '<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2.5h8.5A1.5 1.5 0 0 1 21 9v9.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z"/>',
    'package': '<path d="M12 3l8.5 4.5v9L12 21l-8.5-4.5v-9z"/><path d="M3.5 7.5L12 12l8.5-4.5M12 12v9M7.8 5.3l8.4 4.5"/>',
    layers: '<path d="M12 3.5l9 4.5-9 4.5L3 8z"/><path d="M3 12l9 4.5 9-4.5M3 16l9 4.5 9-4.5"/>',
    /* data */
    activity: '<path d="M3 12h4l2.5-6.5 5 13 2.5-6.5h4"/>',
    'chart-bar': '<path d="M3.5 20.5h17M6.5 17v-6M11 17V6M15.5 17v-8M20 17v-3"/>',
    'chart-line': '<path d="M3.5 3.5v17h17"/><path d="M7 15l3.5-4 3 2.5L19 7"/>',
    pie: '<path d="M11 4a8.5 8.5 0 1 0 9 9h-9z"/><path d="M14 2.5a7.5 7.5 0 0 1 7.5 7.5H14z"/>',
    rupee: '<path d="M6.5 4.5h11M6.5 9h11M9 4.5c5 0 5 9 0 9H6.5l8 6.5"/>',
    /* channels */
    message: '<path d="M4.5 19.5l1.1-3.6A8.5 8.5 0 1 1 8.4 18.6z"/>' + DOT(8.5, 12) + DOT(12, 12) + DOT(15.5, 12),
    phone: '<path d="M5 4h3.5l1.5 4.5-2 1.5a11 11 0 0 0 6 6l1.5-2 4.5 1.5V19a1.5 1.5 0 0 1-1.5 1.5A16 16 0 0 1 3.5 5.5 1.5 1.5 0 0 1 5 4z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3.5 6l8.5 7 8.5-7"/>',
    flag: '<path d="M5 21V4M5 4.5h12l-2.5 4 2.5 4H5"/>'
  };
  /* aliases */
  var ALIAS = { inbox: 'work', database: 'records', bot: 'agents', 'shield-check': 'assurance', link: 'chain', whatsapp: 'message', settings: 'sliders', reference: 'book', balance: 'scale', reversal: 'undo', pencil: 'edit', close: 'x', 'check-circle': 'approve' };

  /** Every icon name (aliases excluded), sorted. */
  c.iconNames = function () { return Object.keys(I).sort(); };
  /** Alias map (alias → canonical name). */
  c.iconAliases = function () { return Object.assign({}, ALIAS); };

  /**
   * An inline SVG icon.
   * @param {string} name   icon name (see c.iconNames()) or alias
   * @param {number} [size=16]
   * @param {{label?:string, cls?:string}} [opts] label makes it role="img" with an accessible name; otherwise aria-hidden
   * @returns {string} html
   */
  c.icon = function (name, size, opts) {
    opts = opts || {};
    size = size || 16;
    var body = I[name] || I[ALIAS[name]] || '<rect x="5" y="5" width="14" height="14" stroke-dasharray="2 2"/>';
    var a11y = opts.label ? ' role="img" aria-label="' + esc(opts.label) + '"' : ' aria-hidden="true"';
    return '<svg class="e1-icon' + (opts.cls ? ' ' + esc(opts.cls) : '') + '" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" focusable="false"' + a11y + '>' + body + '</svg>';
  };
  E1.icon = c.icon;

  /* ------------------------------------------------------------------------
     Internal helpers
     ------------------------------------------------------------------------ */
  function attrs(extra) { return extra ? ' ' + extra : ''; }
  function actionHtml(a, defaultKind) {
    if (!a) return '';
    if (typeof a === 'string') return a;
    if (Array.isArray(a)) return a.map(function (x, i) { return actionHtml(x, i === 0 ? defaultKind : 'secondary'); }).join('');
    return c.button(a.label, { kind: a.kind || defaultKind || 'primary', href: a.href, icon: a.icon, size: a.size, attrs: a.attrs });
  }
  var STATE_ICON = { good: 'check', warning: 'clock', serious: 'alert', critical: 'x', info: 'info', neutral: 'minus' };
  var STATE_WORD = { good: 'Good', warning: 'Warning', serious: 'Serious', critical: 'Critical', info: 'Info', neutral: 'Neutral' };
  var STATES = ['good', 'warning', 'serious', 'critical', 'info', 'neutral'];
  function stateOf(s) { return STATES.indexOf(s) >= 0 ? s : 'neutral'; }
  function initials(name) { return String(name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join(''); }

  /* ------------------------------------------------------------------------
     Brand
     ------------------------------------------------------------------------ */
  /**
   * The brand disc — a true circle, flat clay. One per surface.
   * @param {{size?:number, variant?:'mark'|'gate'|'aperture'|'orbit'|'eclipse'|'trail', label?:string}} [o]
   */
  c.disc = function (o) {
    o = o || {};
    var v = o.variant || 'mark', s = o.size || 12;
    var a = o.label ? ' role="img" aria-label="' + esc(o.label) + '"' : ' aria-hidden="true"';
    return '<span class="e1-disc e1-disc--' + esc(v) + '" style="--disc:' + s + 'px"' + a + '></span>';
  };

  /* ------------------------------------------------------------------------
     Page structure
     ------------------------------------------------------------------------ */
  /**
   * Page header: one per screen.
   * @param {{title:string, lead?:string, actions?:string(html), meta?:string(html), eyebrow?:string, back?:[label, href], tabs?:string(html) (e.g. c.tabs(...)), id?:string}} o
   */
  c.pageHeader = function (o) {
    o = o || {};
    return '<header class="e1-ph">' +
      (o.back ? '<a class="e1-ph__back" href="' + esc(o.back[1]) + '">' + c.icon('arrow-left', 14) + '<span>' + esc(o.back[0]) + '</span></a>' : '') +
      '<div class="e1-ph__row"><div class="e1-ph__text">' +
      (o.eyebrow ? '<p class="e1-eyebrow">' + esc(o.eyebrow) + '</p>' : '') +
      '<h1 class="e1-ph__title">' + esc(o.title) + '</h1>' +
      (o.lead ? '<p class="e1-ph__lead">' + esc(o.lead) + '</p>' : '') +
      '</div>' + (o.actions ? '<div class="e1-ph__actions">' + o.actions + '</div>' : '') + '</div>' +
      (o.meta ? '<div class="e1-ph__meta">' + o.meta + '</div>' : '') +
      (o.tabs ? '<div class="e1-ph__tabs">' + o.tabs + '</div>' : '') +
      '</header>';
  };

  /**
   * A titled page section.
   * @param {{title:string, id?:string, lead?:string, actions?:string(html), body:string(html), eyebrow?:string}} o
   */
  c.section = function (o) {
    return '<section class="e1-section"' + (o.id ? ' id="' + esc(o.id) + '"' : '') + ' aria-labelledby="' + esc((o.id || 's') + '-h') + '">' +
      '<div class="e1-section__head"><div>' + (o.eyebrow ? '<p class="e1-eyebrow">' + esc(o.eyebrow) + '</p>' : '') +
      '<h2 class="e1-section__title" id="' + esc((o.id || 's') + '-h') + '">' + esc(o.title) + '</h2>' +
      (o.lead ? '<p class="e1-section__lead">' + esc(o.lead) + '</p>' : '') + '</div>' +
      (o.actions ? '<div class="e1-section__actions">' + o.actions + '</div>' : '') + '</div>' +
      (o.body || '') + '</section>';
  };

  /**
   * Toolbar row: left and right slots (HTML).
   * @param {string} left @param {string} [right]
   */
  c.toolbar = function (left, right) {
    return '<div class="e1-toolbar"><div class="e1-toolbar__l">' + (left || '') + '</div>' + (right ? '<div class="e1-toolbar__r">' + right + '</div>' : '') + '</div>';
  };

  /**
   * Card.
   * @param {{title?:string, eyebrow?:string, actions?:string(html), body?:string(html), footer?:string(html), flush?:bool, cls?:string, id?:string}} o
   */
  c.card = function (o) {
    o = o || {};
    var head = (o.title || o.actions || o.eyebrow) ? '<header class="e1-card__head"><div>' + (o.eyebrow ? '<p class="e1-eyebrow">' + esc(o.eyebrow) + '</p>' : '') + (o.title ? '<h3 class="e1-card__title">' + esc(o.title) + '</h3>' : '') + '</div>' + (o.actions ? '<div class="e1-card__actions">' + o.actions + '</div>' : '') + '</header>' : '';
    return '<section class="e1-card' + (o.flush ? ' e1-card--flush' : '') + (o.cls ? ' ' + esc(o.cls) : '') + '"' + (o.id ? ' id="' + esc(o.id) + '"' : '') + '>' + head +
      '<div class="e1-card__body">' + (o.body || '') + '</div>' + (o.footer ? '<footer class="e1-card__foot">' + o.footer + '</footer>' : '') + '</section>';
  };

  /* ------------------------------------------------------------------------
     Actions
     ------------------------------------------------------------------------ */
  /**
   * Button or link-button. Gate is reserved: it commits a governed write or records a human decision.
   * @param {string} label  accessible name (always required, also for iconOnly)
   * @param {{kind?:'primary'|'secondary'|'ghost'|'danger'|'gate', href?:string, icon?:string, iconRight?:string,
   *          size?:'sm'|'md'|'lg', iconOnly?:bool, disabled?:bool, loading?:bool, type?:string, attrs?:string, full?:bool}} [o]
   */
  c.button = function (label, o) {
    o = o || {};
    var kind = o.kind || 'secondary';
    var cls = 'e1-btn e1-btn--' + kind + (o.size && o.size !== 'md' ? ' e1-btn--' + o.size : '') + (o.iconOnly ? ' e1-btn--icon' : '') + (o.loading ? ' is-loading' : '') + (o.full ? ' e1-btn--full' : '');
    var isz = o.size === 'sm' ? 14 : 16;
    var inner = (o.loading ? '<span class="e1-spinner" aria-hidden="true"></span>' : (kind === 'gate' && !o.icon ? '<span class="e1-btn__gate" aria-hidden="true"></span>' : (o.icon ? c.icon(o.icon, isz) : ''))) +
      (o.iconOnly ? '<span class="e1-sr">' + esc(label) + '</span>' : '<span>' + esc(label) + '</span>') +
      (o.iconRight ? c.icon(o.iconRight, isz) : '');
    var tip = o.iconOnly ? ' title="' + esc(label) + '"' : '';
    if (o.href && !o.disabled) return '<a class="' + cls + '" href="' + esc(o.href) + '"' + tip + attrs(o.attrs) + '>' + inner + '</a>';
    return '<button type="' + (o.type || 'button') + '" class="' + cls + '"' + tip + (o.disabled ? ' disabled' : '') + (o.loading ? ' aria-busy="true"' : '') + attrs(o.attrs) + '>' + inner + '</button>';
  };

  /**
   * Menu: a trigger button and a popover list (keyboard: arrows, Home/End, Escape).
   * @param {{label:string, icon?:string, iconOnly?:bool, kind?:string, size?:string, align?:'left'|'right',
   *          items:Array<{label, href?, action?, value?, icon?, note?, danger?, divider?:true, checked?:bool}>}} o
   */
  c.menu = function (o) {
    var id = E1.uid('menu');
    var items = (o.items || []).map(function (it) { return it.divider ? '<div class="e1-menu__sep" role="separator"></div>' : E1.menuItem(it); }).join('');
    var kind = o.kind || 'secondary';
    return '<div class="e1-popwrap">' +
      '<button type="button" class="e1-btn e1-btn--' + kind + (o.iconOnly ? ' e1-btn--icon' : '') + (o.size === 'sm' ? ' e1-btn--sm' : '') + '" data-pop="' + id + '" aria-haspopup="menu" aria-expanded="false"' + (o.iconOnly ? ' title="' + esc(o.label) + '"' : '') + '>' +
      (o.icon ? c.icon(o.icon, 16) : '') + (o.iconOnly ? '<span class="e1-sr">' + esc(o.label) + '</span>' : '<span>' + esc(o.label) + '</span>' + c.icon('chevron-down', 14)) + '</button>' +
      '<div class="e1-pop e1-pop--menu' + (o.align === 'right' ? ' e1-pop--right' : '') + '" id="' + id + '" role="menu" aria-label="' + esc(o.label) + '" hidden tabindex="-1">' + items + '</div></div>';
  };

  /**
   * Tooltip on any inline HTML (CSS-only; the tip is also exposed to assistive technology).
   * @param {string} html  the anchor content (HTML)
   * @param {string} tip   plain text
   * @param {{side?:'top'|'right'|'bottom'|'left'}} [o]
   */
  c.tooltip = function (html, tip, o) {
    o = o || {};
    var id = E1.uid('tip');
    return '<span class="e1-tip" data-tip="' + esc(tip) + '" data-side="' + esc(o.side || 'top') + '" tabindex="0" aria-describedby="' + id + '">' + html + '<span class="e1-sr" id="' + id + '" role="tooltip">' + esc(tip) + '</span></span>';
  };

  /**
   * Keyboard keys: c.kbd('Ctrl','K') → <kbd>Ctrl</kbd><kbd>K</kbd>
   */
  c.kbd = function () {
    return Array.prototype.map.call(arguments, function (k) { return '<kbd class="e1-kbd">' + esc(k) + '</kbd>'; }).join('<span class="e1-kbd-then">+</span>');
  };

  /* ------------------------------------------------------------------------
     Status and identity
     ------------------------------------------------------------------------ */
  /**
   * Status pill — one of the six reserved states, always with a word and a mark: “• Waiting for you”.
   * The default mark is a small shape per state (check · ring · diamond · triangle · dot · dash), so it reads without colour.
   * @param {'good'|'warning'|'serious'|'critical'|'info'|'neutral'} state
   * @param {string} [label] defaults to the state name
   * @param {{subtle?:bool, icon?:string|false}} [o]  icon: an icon name instead of the mark; false: no mark
   */
  c.badge = function (state, label, o) {
    o = o || {};
    var s = stateOf(state);
    // default: the state's shape mark (dot-sized, one shape per state); o.icon names an icon instead; false = no mark
    var ic = o.icon === false ? '' : o.icon ? c.icon(o.icon, 12) : '<span class="e1-badge__mark" aria-hidden="true"></span>';
    return '<span class="e1-badge e1-badge--' + s + (o.subtle ? ' e1-badge--subtle' : '') + '">' + ic + '<span>' + esc(label || STATE_WORD[s]) + '</span></span>';
  };

  /**
   * Chip — a selection or filter, never a status. Selected chips wear clay (selection).
   * @param {string} label
   * @param {{href?:string, selected?:bool, count?:number, removable?:bool, attrs?:string, icon?:string}} [o]
   */
  c.chip = function (label, o) {
    o = o || {};
    var inner = (o.icon ? c.icon(o.icon, 14) : '') + '<span>' + esc(label) + '</span>' + (o.count !== undefined ? '<span class="e1-chip__count">' + esc(E1.fmt.num(o.count)) + '</span>' : '') + (o.removable ? '<span class="e1-chip__x" aria-hidden="true">' + c.icon('x', 12) + '</span>' : '');
    var cls = 'e1-chip' + (o.selected ? ' is-selected' : '');
    if (o.href) return '<a class="' + cls + '" href="' + esc(o.href) + '"' + (o.selected ? ' aria-current="true"' : '') + attrs(o.attrs) + '>' + inner + (o.removable ? '<span class="e1-sr"> (remove)</span>' : '') + '</a>';
    return '<button type="button" class="' + cls + '" aria-pressed="' + !!o.selected + '"' + attrs(o.attrs) + '>' + inner + '</button>';
  };

  /**
   * Assurance level pill: L1 Guarded · L2 Attested · L3 Proven. Order carried by filled bars.
   * @param {'L1'|'L2'|'L3'|1|2|3} L
   * @param {{short?:bool}} [o] short renders "L2" only
   */
  c.level = function (L, o) {
    o = o || {};
    var n = String(L).replace(/\D/g, '') || '1';
    var name = (E1.LEVELS['L' + n] || {}).name || '';
    return '<span class="e1-level e1-level--' + n + '" title="Assurance level ' + n + ' — ' + esc(name) + '"><span class="e1-level-bars e1-level-bars--' + n + '" aria-hidden="true"><i></i><i></i><i></i></span><span class="e1-level__k">L' + n + '</span>' + (o.short ? '' : '<span class="e1-level__n">' + esc(name) + '</span>') + '</span>';
  };

  /**
   * Avatar. Person = circle with initials. Agent = square with a bot glyph. Shape carries the kind.
   * @param {string} name
   * @param {{kind?:'person'|'agent'|'system', size?:'xs'|'sm'|'md'|'lg'|'xl'}} [o]
   */
  c.avatar = function (name, o) {
    o = o || {};
    var kind = o.kind || 'person', size = o.size || 'md';
    var px = { xs: 10, sm: 12, md: 16, lg: 20, xl: 26 }[size] || 16;
    var inner = kind === 'agent' ? c.icon('agents', px) : kind === 'system' ? c.icon('server', px) : esc(initials(name));
    return '<span class="e1-avatar e1-avatar--' + kind + ' e1-avatar--' + size + '" aria-hidden="true">' + inner + '</span>';
  };

  /**
   * Actor: who did it, and whether a person or an agent — stated in words, not only by the icon.
   * @param {{name:string, kind?:'person'|'agent'|'system', role?:string, href?:string, size?:'sm'|'md', model?:string}} o
   */
  c.actor = function (o) {
    o = o || {};
    var kind = o.kind || 'person';
    var word = { person: 'Person', agent: 'Agent', system: 'Platform' }[kind];
    var name = o.href ? '<a href="' + esc(o.href) + '">' + esc(o.name) + '</a>' : esc(o.name);
    return '<span class="e1-actor e1-actor--' + kind + (o.size === 'sm' ? ' e1-actor--sm' : '') + '">' + c.avatar(o.name, { kind: kind, size: o.size === 'sm' ? 'xs' : 'sm' }) +
      '<span class="e1-actor__text"><span class="e1-actor__name">' + name + '</span><span class="e1-actor__meta"><span class="e1-actor__kind">' + word + '</span>' + (o.role ? ' · ' + esc(o.role) : '') + (o.model ? ' · ' + esc(o.model) : '') + '</span></span></span>';
  };

  /**
   * Short hash in mono with the full value in a tooltip and an optional copy button.
   * @param {string} value @param {{copy?:bool, head?:number, tail?:number, label?:string}} [o]
   */
  c.hash = function (value, o) {
    o = o || {};
    return '<span class="e1-hash"><code title="' + esc(value) + '">' + esc(E1.fmt.shortHash(value, o.head, o.tail)) + '</code>' +
      (o.copy === false ? '' : '<button type="button" class="e1-hash__copy" data-copy="' + esc(value) + '" data-copy-label="' + esc(o.label || 'Hash') + '" aria-label="Copy the full hash">' + c.icon('copy', 12) + '</button>') + '</span>';
  };

  /**
   * An amount in rupees: mono, tabular, Indian grouping. c.amount(2764300) → ₹27,64,300
   * @param {number} n @param {{sign?:bool, decimals?:number, strong?:bool}} [o]
   */
  c.amount = function (n, o) {
    o = o || {};
    return '<span class="e1-amount' + (o.strong ? ' is-strong' : '') + '">' + esc(E1.fmt.inr(n, o)) + '</span>';
  };

  /* ------------------------------------------------------------------------
     Data display
     ------------------------------------------------------------------------ */
  /**
   * Stat tile. A trend is never carried by the line alone — the number is stated.
   * @param {{label:string, value:string|number, unit?:string, delta?:string, deltaTone?:'good'|'critical'|'neutral', note?:string, spark?:number[], href?:string,
   *          bar?:number|{value:number, max?:number, state?:'good'|'warning'|'critical'|'ink'}, badge?:string(html), aside?:string(html), foot?:string(html), flag?:bool}} o
   *   bar: a mini bar under the number (a number is a percentage) · badge: HTML under the number (e.g. c.badge) ·
   *   aside: HTML at the right of the label (e.g. c.honesty('₹0')) · foot: HTML strip at the bottom (source · as-of) · flag: a warning edge on top
   */
  c.stat = function (o) {
    o = o || {};
    var tone = o.deltaTone || 'neutral';
    var d = o.delta ? '<span class="e1-stat__delta e1-tone--' + esc(tone) + '">' + c.icon(/^[-−]/.test(String(o.delta)) ? 'arrow-down' : 'arrow-up', 12) + esc(o.delta) + '</span>' : '';
    var tag = o.href ? 'a' : 'div';
    var bar = '';
    if (o.bar !== undefined && o.bar !== null) {
      var b = typeof o.bar === 'number' ? { value: o.bar, max: 100 } : o.bar;
      bar = '<div class="e1-stat__bar">' + c.minibar(b.value, b.max || 100, { state: b.state, label: o.label }) + '</div>';
    }
    return '<' + tag + ' class="e1-stat' + (o.flag ? ' e1-stat--flag' : '') + '"' + (o.href ? ' href="' + esc(o.href) + '"' : '') + '><div class="e1-stat__label"><span>' + esc(o.label) + '</span>' + (o.aside || '') + '</div>' +
      '<div class="e1-stat__row"><span class="e1-stat__value">' + esc(o.value) + (o.unit ? '<span class="e1-stat__unit">' + esc(o.unit) + '</span>' : '') + '</span>' + d + '</div>' +
      (o.badge ? '<div class="e1-stat__note">' + o.badge + '</div>' : '') + bar +
      (o.spark ? '<div class="e1-stat__spark">' + c.sparkline(o.spark, { width: 200, height: 28, title: o.label + ' trend' }) + '</div>' : '') +
      (o.note ? '<div class="e1-stat__note">' + esc(o.note) + '</div>' : '') +
      (o.foot ? '<div class="e1-stat__foot">' + o.foot + '</div>' : '') + '</' + tag + '>';
  };

  /**
   * Data table — a real <table> with <th scope>. Cells are escaped unless the column has render() or html:true.
   * @param {{columns:Array<{key:string, label:string, align?:'left'|'right'|'center', mono?:bool, width?:string, render?:function(row,i):string, html?:bool, nowrap?:bool}>,
   *          rows:Array<Object>, rowHref?:function(row):string|string, dense?:bool, empty?:Object|string, caption?:string, sort?:{key, dir:'asc'|'desc'}, stickyHead?:bool}} o
   */
  c.table = function (o) {
    o = o || {};
    var cols = o.columns || [], rows = o.rows || [];
    if (!rows.length) {
      var em = o.empty || { title: 'Nothing to show', why: 'No rows match this view.' };
      return typeof em === 'string' ? em : c.empty(em);
    }
    var head = '<thead><tr>' + cols.map(function (col) {
      var sorted = o.sort && o.sort.key === col.key;
      return '<th scope="col" class="' + (col.align ? 'is-' + col.align : '') + '"' + (col.width ? ' style="width:' + esc(col.width) + '"' : '') + (sorted ? ' aria-sort="' + (o.sort.dir === 'desc' ? 'descending' : 'ascending') + '"' : '') + '>' + esc(col.label) + (sorted ? c.icon(o.sort.dir === 'desc' ? 'arrow-down' : 'arrow-up', 12) : '') + '</th>';
    }).join('') + '</tr></thead>';
    var body = '<tbody>' + rows.map(function (row, i) {
      var href = typeof o.rowHref === 'function' ? o.rowHref(row, i) : (o.rowHref ? row[o.rowHref] : null);
      return '<tr' + (href ? ' data-href="' + esc(href) + '" class="is-link"' : '') + '>' + cols.map(function (col, ci) {
        var v = col.render ? col.render(row, i) : (col.html ? row[col.key] : esc(row[col.key]));
        if (v === undefined || v === null || v === '') v = '<span class="e1-muted" aria-label="none">—</span>';
        if (ci === 0 && href) v = '<a class="e1-table__link" href="' + esc(href) + '">' + v + '</a>';
        var cls = [col.align ? 'is-' + col.align : '', col.mono ? 'e1-mono' : '', col.nowrap ? 'is-nowrap' : ''].filter(Boolean).join(' ');
        return ci === 0 ? '<th scope="row" class="' + cls + '">' + v + '</th>' : '<td class="' + cls + '">' + v + '</td>';
      }).join('') + '</tr>';
    }).join('') + '</tbody>';
    return '<div class="e1-table-wrap' + (o.stickyHead ? ' is-sticky' : '') + '"><table class="e1-table' + (o.dense ? ' is-dense' : '') + '">' + (o.caption ? '<caption class="e1-sr">' + esc(o.caption) + '</caption>' : '') + head + body + '</table></div>';
  };

  /**
   * Key/value list (<dl>). Pairs as arrays [k, v, {mono, html}] or objects {k, v, mono, html}. Values escaped unless html.
   * @param {Array} pairs @param {{cols?:1|2, compact?:bool}} [o]
   */
  c.kv = function (pairs, o) {
    o = o || {};
    return '<dl class="e1-kv' + (o.cols === 2 ? ' e1-kv--2' : '') + (o.compact ? ' e1-kv--compact' : '') + '">' + (pairs || []).map(function (p) {
      var k = Array.isArray(p) ? p[0] : p.k, v = Array.isArray(p) ? p[1] : p.v, f = (Array.isArray(p) ? p[2] : p) || {};
      var val = f.html ? v : esc(v);
      if (v === undefined || v === null || v === '') val = '<span class="e1-muted">Not recorded</span>';
      return '<div class="e1-kv__row"><dt>' + esc(k) + '</dt><dd' + (f.mono ? ' class="e1-mono"' : '') + '>' + val + '</dd></div>';
    }).join('') + '</dl>';
  };

  /**
   * Field-level diff as a real table. Unchanged rows collapse behind “Show all fields”.
   * @param {Array<{field:string, before:any, after:any, changed?:bool, material?:bool, mono?:bool}>} rows
   * @param {{caption?:string, collapse?:bool (default true), title?:string}} [o]
   */
  c.diff = function (rows, o) {
    o = o || {};
    var id = E1.uid('diff');
    var collapse = o.collapse !== false;
    var changedN = 0;
    var body = (rows || []).map(function (r) {
      var changed = r.changed !== undefined ? r.changed : String(r.before) !== String(r.after);
      if (changed) changedN++;
      var mono = r.mono ? ' e1-mono' : '';
      var before = r.before === null || r.before === undefined || r.before === '' ? '<span class="e1-muted">Not set</span>' : (changed ? '<del>' + esc(r.before) + '</del>' : esc(r.before));
      var after = r.after === null || r.after === undefined || r.after === '' ? '<span class="e1-muted">Not set</span>' : (changed ? '<ins>' + esc(r.after) + '</ins>' : esc(r.after));
      return '<tr class="' + (changed ? 'is-changed' : 'is-same') + (r.material ? ' is-material' : '') + '"><th scope="row">' + esc(r.field) +
        ((r.material || changed) ? ' <span class="e1-diff__tags">' + (r.material ? '<span class="e1-diff__tag e1-diff__tag--material">Material' + (changed ? '<span class="e1-sr">, changed</span>' : '') + '</span>' : '<span class="e1-diff__tag">Changed</span>') + '</span>' : '') + '</th>' +
        '<td class="e1-diff__before' + mono + '">' + before + '</td><td class="e1-diff__after' + mono + '">' + after + '</td></tr>';
    }).join('');
    var sameN = (rows || []).length - changedN;
    var label = 'Show all ' + (rows || []).length + ' fields';
    return '<div class="e1-diff' + (collapse ? '' : ' is-expanded') + '" id="' + id + '">' +
      '<table class="e1-table e1-diff__table"><caption class="' + (o.caption ? 'e1-diff__caption' : 'e1-sr') + '">' + esc(o.caption || 'Field-level changes') + '</caption>' +
      '<thead><tr><th scope="col">Field</th><th scope="col">Before</th><th scope="col">After</th></tr></thead><tbody>' + body + '</tbody></table>' +
      (collapse && sameN > 0 ? '<div class="e1-diff__more"><span class="e1-caption e1-muted">' + changedN + ' changed · ' + sameN + ' unchanged hidden</span><button type="button" class="e1-btn e1-btn--ghost e1-btn--sm" data-action="diff-toggle" aria-controls="' + id + '" aria-expanded="false" data-label="' + esc(label) + '">' + c.icon('chevrons-up-down', 14) + '<span>' + esc(label) + '</span></button></div>' : '') +
      '</div>';
  };

  /**
   * Gate results — every declared gate, not only the failures, each in plain words with the declaration version.
   * @param {Array<{id:string, name:string, result:'passed'|'failed'|'pending'|'waiting'|'skipped'|'not_run', words?:string, version?:string}>} list
   *   pending/waiting = the gate is waiting on something outside the write (e.g. dual control waiting on a second person): warning tone.
   * @param {{title?:string, version?:string}} [o]
   */
  c.gates = function (list, o) {
    o = o || {};
    list = list || [];
    var map = { passed: ['good', 'check', 'Passed'], failed: ['critical', 'x', 'Failed'], pending: ['warning', 'clock', 'Waiting'], waiting: ['warning', 'clock', 'Waiting'], skipped: ['neutral', 'skip', 'Skipped'], not_run: ['neutral', 'minus', 'Not run'] };
    var passed = list.filter(function (g) { return g.result === 'passed'; }).length;
    var failed = list.filter(function (g) { return g.result === 'failed'; }).length;
    var waiting = list.filter(function (g) { return g.result === 'pending' || g.result === 'waiting'; }).length;
    return '<div class="e1-gates">' +
      '<div class="e1-gates__sum"><strong>' + passed + ' of ' + list.length + ' gates passed</strong>' + (failed ? ' · <span class="e1-tone--critical">' + failed + ' failed</span>' : '') + (waiting ? ' · <span class="e1-tone--warning">' + waiting + ' waiting</span>' : '') + (o.version ? ' · <span class="e1-mono">' + esc(o.version) + '</span>' : '') + '</div>' +
      '<ol class="e1-gates__list" role="list">' + list.map(function (g) {
        var m = map[g.result] || map.not_run;
        return '<li class="e1-gate e1-gate--' + esc(g.result) + '"><span class="e1-gate__icon e1-tone--' + m[0] + '">' + c.icon(m[1], 14) + '</span>' +
          '<span class="e1-gate__id e1-mono">' + esc(g.id) + '</span><span class="e1-gate__main"><span class="e1-gate__name">' + esc(g.name) + ' — <span class="e1-tone--' + m[0] + '">' + m[2].toLowerCase() + '</span></span>' +
          (g.words ? '<span class="e1-gate__words">' + esc(g.words) + '</span>' : '') + '</span>' +
          (g.version ? '<span class="e1-gate__ver e1-mono">' + esc(g.version) + '</span>' : '') + '</li>';
      }).join('') + '</ol></div>';
  };

  var RUNGS = [
    ['Identity', 'Who is acting, on whose behalf'], ['Write door', 'The write type exists at a version'], ['Pre-gates', 'Every declared gate runs'],
    ['Evaluate', 'Policy at a fixed version'], ['Guardrail', 'Blast radius as declared'], ['Autonomy', 'Grant A0–A5 for this write type'],
    ['Act', 'Sandbox first, then live'], ['Proof', 'Hash-chained record'], ['Metered', 'One meter event; refusals at zero']
  ];
  c.RUNGS = RUNGS;
  var RUNG0B = ['Stop', 'The tenant is not stopped'];
  /**
   * The nine-rung write path as a stepper, optionally preceded by rung 0b STOP (counted separately).
   * A refusal is a correct outcome, so a refused rung is NEUTRAL; only a platform failure is critical.
   * @param {{at?:number|'0b' (0 = 0b), outcome?:'committed'|'refused'|'escalated'|'running'|'platform', include0b?:bool, notes?:Object<number|'0b',string>, compact?:bool}} o
   *   committed: every rung passed. running: rungs before `at` passed, `at` in progress.
   *   refused at N: N is “Not done”, N+1–7 not reached, 8 records the refusal, 9 meters zero.
   *   refused at 0b (tenant stopped): nothing after it runs — a stopped tenant writes no chain entry.
   *   platform at N (e.g. 7): N is “Platform failure” (critical), 8 records it, 9 meters zero.
   *   escalated (at 6 by default): 7 not reached, 8 records the obligation, 9 meters zero.
   */
  c.rungs = function (o) {
    o = o || {};
    var out = o.outcome || 'committed', notes = o.notes || {};
    var rawAt = o.at;
    var at = rawAt === '0b' || rawAt === 0 ? 0 : (rawAt || (out === 'escalated' ? 6 : 9));
    var show0b = !!o.include0b || at === 0;
    var WORD = { passed: 'Passed', refused: 'Not done', platform: 'Platform failure', escalated: 'Waiting on a person', skipped: 'Not reached', current: 'In progress', pending: 'Waiting', recorded: 'Recorded', zero: 'Metered at zero', norecord: 'No record' };
    var ICON = { passed: 'check', refused: 'refuse', platform: 'alert', escalated: 'gate', skipped: 'minus', current: 'clock', pending: 'minus', recorded: 'check', zero: 'check', norecord: 'minus' };
    var list = (show0b ? [{ n: 0, key: '0b', r: RUNG0B }] : []).concat(RUNGS.map(function (r, i) { return { n: i + 1, key: String(i + 1), r: r }; }));
    function stateOf(n) {
      if (out === 'committed') return 'passed';
      if (out === 'running') return n < at ? 'passed' : n === at ? 'current' : 'pending';
      if (at === 0) return n === 0 ? (out === 'platform' ? 'platform' : 'refused') : (n === 8 ? 'norecord' : 'skipped');
      if (n < at) return 'passed';
      if (n === at) return out === 'refused' ? 'refused' : out === 'platform' ? 'platform' : 'escalated';
      if (n === 8) return 'recorded';
      if (n === 9) return 'zero';
      return 'skipped';
    }
    var DONE = { passed: 1, recorded: 1, zero: 1, refused: 1, platform: 1, escalated: 1 };
    return '<ol class="e1-rungs' + (show0b ? ' e1-rungs--0b' : '') + (o.compact ? ' e1-rungs--compact' : '') + '" aria-label="Write path: ' + (show0b ? 'rung 0b and ' : '') + 'nine rungs">' + list.map(function (x) {
      var st = stateOf(x.n);
      var note = notes[x.key] || notes[x.n] || (st === 'norecord' ? 'A stopped tenant writes nothing, not even a refusal' : x.r[1]);
      return '<li class="e1-rung e1-rung--' + st + (x.n === 0 ? ' e1-rung--0b' : '') + '"' + (st === 'current' ? ' aria-current="step"' : '') + '><span class="e1-rung__n">' + (DONE[st] ? c.icon(ICON[st], 12) : x.key) + '</span>' +
        '<span class="e1-rung__t"><span class="e1-rung__name">' + x.key + ' · ' + x.r[0] + '</span><span class="e1-rung__state">' + WORD[st] + '</span>' +
        (!o.compact ? '<span class="e1-rung__note">' + esc(note) + '</span>' : '') + '</span></li>';
    }).join('') + '</ol>';
  };

  /**
   * Timeline. Refusals and escalations appear alongside commits.
   * @param {Array<{time:string, title:string, body?:string, state?:string, actor?:{name,kind}, href?:string, meta?:string}>} items
   */
  c.timeline = function (items) {
    return '<ol class="e1-timeline" role="list">' + (items || []).map(function (it) {
      var s = stateOf(it.state);
      return '<li class="e1-tl e1-tl--' + s + '"><span class="e1-tl__mark e1-tone--' + s + '">' + c.icon(STATE_ICON[s] === 'minus' ? 'clock' : STATE_ICON[s], 12) + '</span>' +
        '<div class="e1-tl__body"><div class="e1-tl__time">' + esc(it.time) + '</div>' +
        '<div class="e1-tl__title">' + (it.href ? '<a href="' + esc(it.href) + '">' + esc(it.title) + '</a>' : esc(it.title)) + '</div>' +
        (it.body ? '<div class="e1-tl__text">' + esc(it.body) + '</div>' : '') +
        (it.actor ? '<div class="e1-tl__actor">' + c.actor({ name: it.actor.name, kind: it.actor.kind, role: it.actor.role, size: 'sm' }) + '</div>' : '') +
        (it.meta ? '<div class="e1-tl__meta">' + it.meta + '</div>' : '') + '</div></li>';
    }).join('') + '</ol>';
  };

  /* The outcomes: Committed · Not done (refused) · Waiting on a person (escalated), plus expired and platform failure.
     A refusal is a correct, free outcome, so it is NEUTRAL — never red. [state, label, icon] */
  var OUTCOME = {
    committed: ['good', 'Committed', 'check'], refused: ['neutral', 'Not done', 'refuse'], escalated: ['warning', 'Waiting on a person', 'gate'],
    expired: ['neutral', 'Expired', 'timer'], platform: ['critical', 'Platform failure', 'alert'], reversed: ['info', 'Reversed', 'undo']
  };
  var OUTCOME_ALIAS = { refuse: 'refused', 'not done': 'refused', not_done: 'refused', escalate: 'escalated', waiting: 'escalated', commit: 'committed', allow: 'committed', failure: 'platform', platform_failure: 'platform' };
  /**
   * Outcome of a governed write. kind: 'committed' | 'refused' ("Not done", neutral) | 'escalated' ("Waiting on a person") |
   * 'expired' | 'platform' ("Platform failure", critical) | 'reversed'. A PLATFORM.* code forces 'platform'.
   * @param {string} kind @param {{code?:string, subtle?:bool, label?:string}} [o]
   */
  c.outcome = function (kind, o) {
    o = o || {};
    kind = String(kind || 'committed').toLowerCase();
    kind = OUTCOME_ALIAS[kind] || kind;
    if (o.code && /^PLATFORM\./.test(o.code)) kind = 'platform';
    var m = OUTCOME[kind] || ['neutral', kind, 'minus'];
    return '<span class="e1-outcome e1-outcome--' + esc(kind) + '">' + c.badge(m[0], o.label || m[1], { subtle: o.subtle, icon: m[2] }) +
      (o.code ? '<code class="e1-outcome__code">' + esc(o.code) + '</code>' : '') + '</span>';
  };
  /**
   * Proof chain with three-valued standing, scope and count adjacent — never a bare green tick.
   * @param {Array<{seq:number, digest:string, prev:string, writeType:string, outcome:'committed'|'refused'|'escalated'|'reversed', at?:string, actorKind?:'person'|'agent', href?:string}>} entries
   * @param {{standing:'continuous'|'break'|'not_checked', scope?:string, count?:string, breakAt?:number, checkedAt?:string}} o
   */
  c.chain = function (entries, o) {
    o = o || {};
    var st = o.standing || 'not_checked';
    var SM = {
      continuous: ['good', 'chain', 'Continuous'],
      'break': ['critical', 'refuse', 'Break at seq ' + (o.breakAt ? E1.fmt.num(o.breakAt) : '?')],
      not_checked: ['neutral', 'skip', 'Not checked over this range']
    }[st];
    var head = '<div class="e1-chain__standing e1-chain__standing--' + st + '"><span class="e1-tone--' + SM[0] + '">' + c.icon(SM[1], 16) + '</span>' +
      '<div><div class="e1-chain__word">Chain standing: <strong>' + esc(SM[2]) + '</strong></div>' +
      '<div class="e1-chain__scope">' + (o.scope ? '<span>Scope: ' + esc(o.scope) + '</span>' : '') + (o.count ? '<span>' + esc(o.count) + '</span>' : '') + (o.checkedAt ? '<span>Checked ' + esc(o.checkedAt) + '</span>' : '') + '</div></div>' +
      (E1.state.level === 'L1' ? '<span class="e1-chain__l1">' + c.level('L1', { short: true }) + ' hash-chained, not signed</span>' : '') + '</div>';
    var list = '<ol class="e1-chain__list" role="list">' + (entries || []).map(function (e, i) {
      var broken = st === 'break' && o.breakAt === e.seq;
      return '<li class="e1-chain__entry' + (broken ? ' is-broken' : '') + '">' +
        '<div class="e1-chain__seq e1-mono">#' + esc(E1.fmt.num(e.seq)) + '</div>' +
        '<div class="e1-chain__main"><div class="e1-chain__top">' + c.outcome(e.outcome, { subtle: true }) + '<span class="e1-mono e1-chain__wt">' + (e.href ? '<a href="' + esc(e.href) + '">' + esc(e.writeType) + '</a>' : esc(e.writeType)) + '</span>' +
        (e.actorKind ? '<span class="e1-caption e1-muted">' + (e.actorKind === 'agent' ? 'Agent' : 'Person') + '</span>' : '') + (e.at ? '<span class="e1-caption e1-muted">' + esc(e.at) + '</span>' : '') + '</div>' +
        '<div class="e1-chain__hashes"><span><span class="e1-label">Digest</span> ' + c.hash(e.digest) + '</span><span><span class="e1-label">Ties to</span> ' + c.hash(e.prev, { label: 'Previous digest' }) + (broken ? ' <strong class="e1-tone--critical">does not match #' + E1.fmt.num(e.seq - 1) + '</strong>' : '') + '</span></div></div></li>';
    }).join('') + '</ol>';
    return '<div class="e1-chain">' + head + list + '</div>';
  };

  /**
   * Proof seal. At L1 it is an honest “hash-chained, not signed” record: no Signed-by row, no anchor time, no verifier verdict.
   * At L2/L3 (preview) it shows the signature, anchor and verdict, labelled with the level.
   * @param {{seq:number, writeType:string, outcome?:string, code?:string, blast?:1|2|3|4|5|string, reversible?:string|number|boolean, amount?:number, actor?:{name,kind}, approver?:string, at?:string,
   *          digest:string, prev?:string, declaration?:string, policy?:string, level?:'L1'|'L2'|'L3', signer?:string, keyId?:string, anchor?:string, verdict?:string, counter?:string}} o
   */
  c.seal = function (o) {
    o = o || {};
    var L = o.level || E1.state.level || 'L1';
    var n = Number(String(L).slice(1));
    var rows = [
      ['Write type', o.writeType, { mono: true }],
      o.amount !== undefined ? ['Amount', E1.fmt.inr(o.amount), { mono: true }] : null,
      o.actor ? ['Proposed by', c.actor({ name: o.actor.name, kind: o.actor.kind, size: 'sm' }), { html: true }] : null,
      o.approver ? ['Approved by', c.actor({ name: o.approver, kind: 'person', size: 'sm' }), { html: true }] : null,
      o.at ? ['Recorded', o.at] : null,
      o.declaration ? ['Declaration', o.declaration, { mono: true }] : null,
      o.policy ? ['Policy', o.policy, { mono: true }] : null,
      ['Digest', c.hash(o.digest), { html: true }],
      o.prev ? ['Previous', c.hash(o.prev, { label: 'Previous digest' }), { html: true }] : null
    ];
    if (n >= 2) {
      rows.push(['Signed by', (o.signer || 'elan1 seal key, Mumbai') + (o.keyId ? ' · ' + o.keyId : ''), { mono: false }]);
      rows.push(['Anchored', o.anchor || 'RFC 3161 time-stamp, batched', {}]);
      rows.push(['Verifier verdict', c.badge('good', o.verdict || 'Verified offline'), { html: true }]);
    }
    if (n >= 3) rows.push(['Counter-signed by', o.counter || 'Independent counter-signatory', {}]);
    rows = rows.filter(Boolean);
    var head = '<header class="e1-seal__head"><span class="e1-seal__emblem" aria-hidden="true">' + c.icon(n >= 2 ? 'seal' : 'chain', 20) + '</span>' +
      '<div><p class="e1-label">' + (n >= 2 ? 'Proof seal' : 'Proof record') + ' · #' + esc(E1.fmt.num(o.seq)) + '</p><p class="e1-seal__title">' + (n >= 2 ? 'Ed25519 signed' + (n >= 3 ? ', counter-signed' : '') : 'Hash-chained, not signed') + '</p></div>' +
      '<div class="e1-seal__right">' + c.outcome(o.outcome || 'committed', { code: o.code }) + c.level(L) + '</div></header>';
    var foot = n >= 2
      ? '<footer class="e1-seal__foot">' + c.icon('info', 14) + '<span>' + (n >= 3 ? 'Preview of Assurance Level 3. ' : 'Preview of Assurance Level 2. ') + 'A party holding the key fingerprint, obtained out of band, can verify this record on an air-gapped machine.</span></footer>'
      : '<footer class="e1-seal__foot e1-seal__foot--l1">' + c.icon('info', 14) + '<span>This record is hash-chained. It is not signed, and it cannot yet be checked by someone who does not trust elan1. That arrives at Assurance Level 2.</span></footer>';
    return '<article class="e1-seal e1-seal--l' + n + '" aria-label="Proof #' + esc(E1.fmt.num(o.seq)) + '">' + head +
      (o.blast || o.reversible !== undefined ? '<div class="e1-seal__blast">' + (o.blast ? c.blast(o.blast, { compact: true }) : '') + (o.reversible !== undefined ? c.reversible(o.reversible) : '') + '</div>' : '') +
      c.kv(rows, { compact: true }) + foot + '</article>';
  };

  /* ------------------------------------------------------------------------
     States: empty, error, refusal, callout, skeleton
     ------------------------------------------------------------------------ */
  /**
   * Empty state: names what is missing, why, and what would fill it.
   * @param {{title:string, why:string, fill?:string, action?:{label,href,kind?,icon?}|string(html)|Array, icon?:string, compact?:bool}} o
   */
  c.empty = function (o) {
    o = o || {};
    return '<div class="e1-empty' + (o.compact ? ' e1-empty--compact' : '') + '">' +
      '<span class="e1-empty__icon" aria-hidden="true">' + c.icon(o.icon || 'aperture', 22) + '</span>' +
      '<h3 class="e1-empty__title">' + esc(o.title) + '</h3>' +
      '<p class="e1-empty__why">' + esc(o.why) + '</p>' +
      (o.fill ? '<p class="e1-empty__fill">' + esc(o.fill) + '</p>' : '') +
      (o.action ? '<div class="e1-empty__actions">' + actionHtml(o.action, 'secondary') + '</div>' : '') + '</div>';
  };

  /**
   * Error state. Says what happened, what did NOT happen, and what to do.
   * @param {{title:string, body?:string, reassurance?:string, code?:string, action?:{label,href}|string|Array}} o
   */
  c.error = function (o) {
    o = o || {};
    return '<div class="e1-errorstate" role="alert">' +
      '<span class="e1-errorstate__icon" aria-hidden="true">' + c.icon('alert', 20) + '</span>' +
      '<div><h3 class="e1-errorstate__title">' + esc(o.title) + '</h3>' +
      (o.body ? '<p>' + esc(o.body) + '</p>' : '') + (o.reassurance ? '<p class="e1-errorstate__re">' + esc(o.reassurance) + '</p>' : '') +
      (o.code ? '<p class="e1-errorstate__code"><span class="e1-label">Code</span> <code>' + esc(o.code) + '</code></p>' : '') +
      (o.action ? '<div class="e1-errorstate__actions">' + actionHtml(o.action, 'secondary') + '</div>' : '') + '</div></div>';
  };

  /**
   * Refusal card — “Not done — <words of the thing tried>”. Names the rule, its version, the numbers, and the next action.
   * The code appears once, small, because support asks for it. PLATFORM.* codes get the blunt “our failure” copy.
   * @param {{code:string, title:string, rule?:string, ruleName?:string, version?:string, numbers?:Array<{label,value}>, change?:string,
   *          action?:{label,href,kind?}|string|Array, proofHref?:string, at?:string}} o
   */
  c.refusal = function (o) {
    o = o || {};
    var platform = /^PLATFORM\./.test(o.code || '');
    return '<article class="e1-refusal' + (platform ? ' e1-refusal--platform' : '') + '">' +
      '<header class="e1-refusal__head"><span class="e1-refusal__icon" aria-hidden="true">' + c.icon(platform ? 'alert' : 'refuse', 20) + '</span><div>' +
      '<p class="e1-label e1-refusal__eyebrow">' + (platform ? 'Platform failure · our failure, not a rule' : 'Not done · refused by a declared rule') + '</p>' +
      '<h3 class="e1-refusal__title">' + esc(o.title) + '</h3></div></header>' +
      '<div class="e1-refusal__body">' +
      (platform ? '<p class="e1-refusal__rule">This is our failure, not a rule. Nothing was changed, you have not been billed, and we have been paged.</p>' :
        (o.ruleName ? '<p class="e1-refusal__rulename"><span class="e1-label">Rule</span> ' + esc(o.ruleName) + (o.version ? ' <span class="e1-mono e1-muted">' + esc(o.version) + '</span>' : '') + '</p>' : '') +
        (o.rule ? '<p class="e1-refusal__rule">' + esc(o.rule) + '</p>' : '')) +
      (o.numbers && o.numbers.length ? '<dl class="e1-refusal__nums">' + o.numbers.map(function (x) { return '<div><dt>' + esc(x.label) + '</dt><dd class="e1-mono">' + esc(x.value) + '</dd></div>'; }).join('') + '</dl>' : '') +
      (o.change ? '<p class="e1-refusal__change"><span class="e1-label">What would change the outcome</span><br>' + esc(o.change) + '</p>' : '') +
      '</div>' +
      '<footer class="e1-refusal__foot"><div class="e1-refusal__actions">' + actionHtml(o.action, 'primary') + (o.proofHref ? c.button('Show the record of this refusal', { kind: 'ghost', href: o.proofHref, icon: 'proof' }) : '') + '</div>' +
      '<p class="e1-refusal__meta"><code>' + esc(o.code) + '</code>' + (o.version && !o.ruleName ? ' · <span class="e1-mono">' + esc(o.version) + '</span>' : '') + (o.at ? ' · ' + esc(o.at) : '') + '</p></footer></article>';
  };

  /**
   * Callout.
   * @param {{kind?:'rule'|'caveat'|'info'|'good'|'warning'|'critical', title?:string, body:string(html)}} o
   */
  c.callout = function (o) {
    o = o || {};
    var k = o.kind || 'info';
    var ic = { rule: 'scale', caveat: 'alert', info: 'info', good: 'check', warning: 'clock', critical: 'refuse' }[k] || 'info';
    var word = { rule: 'Rule', caveat: 'Caveat', info: 'Note', good: 'Good', warning: 'Warning', critical: 'Critical' }[k];
    return '<aside class="e1-callout e1-callout--' + esc(k) + '"><span class="e1-callout__icon" aria-hidden="true">' + c.icon(ic, 16) + '</span><div>' +
      '<p class="e1-callout__title"><span class="e1-label">' + word + '</span>' + (o.title ? ' ' + esc(o.title) : '') + '</p><div class="e1-callout__body">' + (o.body || '') + '</div></div></aside>';
  };

  /**
   * Locked explainer for an L2/L3 feature while the viewer is below that level — never a blank screen.
   * Renders “This arrives at Assurance Level 2 Attested”, why, what arrives, and a “Preview as L2” button (E1.setLevel).
   * Returns '' when E1.state.level already meets `level` unless o.always is true.
   * @param {{level?:'L2'|'L3', title?:string, why?:string, items?:string[], preview?:bool (default true), always?:bool, compact?:bool}} o
   */
  c.locked = function (o) {
    o = o || {};
    var L = String(o.level || 'L2').toUpperCase(), meta = E1.LEVELS[L] || { name: '' };
    if (!o.always && E1.atLeast(L)) return '';
    var title = o.title || ('This arrives at Assurance Level ' + L.slice(1) + ' ' + meta.name);
    return '<section class="e1-locked' + (o.compact ? ' e1-locked--compact' : '') + '" aria-label="' + esc(title) + '">' +
      '<span class="e1-locked__icon" aria-hidden="true">' + c.icon('lock', 20) + '</span>' +
      '<div class="e1-locked__body"><div class="e1-locked__top">' + c.level(L) + '<span class="e1-caption e1-muted">Your tenant runs at ' + esc(E1.state.level) + ' ' + esc((E1.LEVELS[E1.state.level] || {}).name || '') + '</span></div>' +
      '<h3 class="e1-locked__title">' + esc(title) + '</h3>' +
      '<p class="e1-locked__why">' + esc(o.why || (meta.claim ? meta.claim + ' ' : '') + 'Nothing on this screen is claimed at your current level, so nothing is shown as if it were.') + '</p>' +
      (o.items && o.items.length ? '<ul class="e1-locked__items">' + o.items.map(function (x) { return '<li>' + c.icon('check', 12) + '<span>' + esc(x) + '</span></li>'; }).join('') + '</ul>' : '') +
      '<div class="e1-locked__actions">' + (o.preview === false ? '' : c.button('Preview as ' + L, { kind: 'secondary', icon: 'eye', attrs: 'data-action="level" data-value="' + esc(L) + '"' })) +
      c.button('What each level lets you say', { kind: 'ghost', href: '#/assurance/level', iconRight: 'arrow-right' }) + '</div></div></section>';
  };

  /**
   * Skeleton placeholder while loading (shimmer collapses under reduced motion).
   * @param {{kind?:'text'|'table'|'card'|'stat', lines?:number, rows?:number}} [o]
   */
  c.skeleton = function (o) {
    o = o || {};
    var k = o.kind || 'text', i, h = '';
    if (k === 'table') { for (i = 0; i < (o.rows || 5); i++) h += '<div class="e1-skel__row"><span class="e1-skel" style="width:22%"></span><span class="e1-skel" style="width:34%"></span><span class="e1-skel" style="width:14%"></span><span class="e1-skel" style="width:12%"></span></div>'; }
    else if (k === 'stat') h = '<span class="e1-skel" style="width:40%;height:10px"></span><span class="e1-skel" style="width:55%;height:26px;margin-top:10px"></span><span class="e1-skel" style="width:70%;margin-top:10px"></span>';
    else if (k === 'card') h = '<span class="e1-skel" style="width:35%;height:14px"></span>' + [90, 80, 86, 60].map(function (w) { return '<span class="e1-skel" style="width:' + w + '%;margin-top:10px"></span>'; }).join('');
    else { for (i = 0; i < (o.lines || 3); i++) h += '<span class="e1-skel" style="width:' + [92, 84, 66, 78, 58][i % 5] + '%"></span>'; }
    return '<div class="e1-skelwrap e1-skelwrap--' + k + '" aria-busy="true" aria-live="polite"><span class="e1-sr">Loading</span>' + h + '</div>';
  };

  /* ------------------------------------------------------------------------
     Governance ladders
     ------------------------------------------------------------------------ */
  var BLAST = [
    ['one_record', 'One record', 'The write touches a single record.'],
    ['one_counterparty', 'One counterparty', 'The write touches records of one customer, supplier or bank.'],
    ['batch', 'Batch', 'The write touches many records in one declared batch.'],
    ['tenant', 'Whole tenant', 'The write changes state across the whole tenant.'],
    ['cross_boundary', 'Crosses an organisation boundary', 'The write leaves the organisation — a filing, a bank, a regulator.']
  ];
  c.BLAST = BLAST;
  var BLAST_ALIAS = { // accepted string forms → 1..5 (v1.0 names are deprecated aliases)
    one_record: 1, 'one record': 1, record: 1, contained: 1,
    one_counterparty: 2, 'one counterparty': 2, counterparty: 2, reversible: 2,
    batch: 3, material: 3,
    tenant: 4, 'whole tenant': 4, whole_tenant: 4, irreversible: 4,
    cross_boundary: 5, 'cross boundary': 5, 'crosses an organisation boundary': 5, cross_organisation: 5
  };
  /** Resolve 1–5, a declared key ('batch') or a UI word ('Whole tenant') to 1–5. */
  c.blastLevel = function (n) {
    if (typeof n === 'string') { var k = n.toLowerCase().trim(); n = BLAST_ALIAS[k] || BLAST_ALIAS[k.replace(/-/g, '_')] || Number(k) || 1; }
    return Math.max(1, Math.min(5, Math.round(n || 1)));
  };
  /**
   * Blast-radius stepped band — the five declared radius values. The count and height of filled
   * steps carries the order, so it reads in greyscale. Deliberately not the status palette.
   * Reversibility is a separate property: see c.reversible().
   * @param {1|2|3|4|5|'one_record'|'one_counterparty'|'batch'|'tenant'|'cross_boundary'} n
   * @param {{compact?:bool, note?:string|false}} [o]
   */
  c.blast = function (n, o) {
    o = o || {};
    n = c.blastLevel(n);
    var b = BLAST[n - 1];
    var steps = [1, 2, 3, 4, 5].map(function (i) { return '<i class="' + (i <= n ? 'is-on' : '') + '"></i>'; }).join('');
    return '<span class="e1-blast e1-blast--' + n + (o.compact ? ' e1-blast--compact' : '') + '" title="Blast radius ' + n + ' of 5 — ' + esc(b[1]) + ' (' + b[0] + ')">' +
      '<span class="e1-blast__band" aria-hidden="true">' + steps + '</span><span class="e1-blast__text"><span class="e1-blast__name">' + esc(b[1]) + '</span>' +
      (o.compact || o.note === false ? '' : '<span class="e1-blast__note">' + esc(o.note || b[2]) + '</span>') + '</span><span class="e1-sr"> — blast radius ' + n + ' of 5</span></span>';
  };

  /**
   * Reversibility chip — separate from blast radius. c.reversible('24 h') → “Reversible · 24 h”; c.reversible(false) → “Irreversible”.
   * @param {string|number|boolean} windowOrFalse  a window ('24 h', '30 days'), hours as a number (720 → '30 days'), true (no window stated) or false
   * @param {{note?:string, compact?:bool}} [o]
   */
  c.reversible = function (w, o) {
    o = o || {};
    if (w === false || w === null || w === 'irreversible') {
      return '<span class="e1-rev e1-rev--no" title="' + esc(o.note || 'No compensating action. Never runs automatically.') + '">' + c.icon('lock', 12) + '<span>Irreversible</span></span>';
    }
    var win = typeof w === 'number' ? (w >= 48 && w % 24 === 0 ? (w / 24) + ' days' : w + ' h') : (w === true || w === undefined ? '' : String(w));
    return '<span class="e1-rev e1-rev--yes" title="' + esc(o.note || 'A declared reversal plan exists' + (win ? ' for ' + win : '') + '.') + '">' + c.icon('undo', 12) + '<span>Reversible' + (win ? ' · ' + esc(win) : '') + '</span></span>';
  };

  var AUTO = [['A0', 'Observe', 'Reads only; cannot reach rung 7'], ['A1', 'Draft', 'Produces an intent a person submits'], ['A2', 'Propose', 'Submits; a person approves first'],
    ['A3', 'Act reversible', 'Acts alone where a reversal plan exists'], ['A4', 'Act bounded', 'Acts alone inside declared radius and budget'], ['A5', 'Act broad', 'Tenant scope; dual control on the declaration']];
  c.AUTONOMY = AUTO;
  /**
   * Autonomy ladder A0–A5. A missing grant renders as “A0 Observe (no grant)” in the same form as an explicit A0.
   * @param {'A0'|'A1'|'A2'|'A3'|'A4'|'A5'|number|null} level  null/undefined = no grant
   * @param {{compact?:bool}} [o]
   */
  c.autonomy = function (level, o) {
    o = o || {};
    var none = level === null || level === undefined || level === '';
    var n = none ? 0 : Number(String(level).replace(/\D/g, '')) || 0;
    var label = AUTO[n][0] + ' ' + AUTO[n][1] + (none ? ' (no grant)' : '');
    if (o.compact) return '<span class="e1-auto e1-auto--compact" title="' + esc(AUTO[n][2]) + '"><span class="e1-auto__steps" aria-hidden="true">' + AUTO.map(function (a, i) { return '<i class="' + (i <= n ? 'is-on' : '') + (i === n ? ' is-cur' : '') + '"></i>'; }).join('') + '</span><span class="e1-auto__label">' + esc(label) + '</span></span>';
    return '<div class="e1-auto"><ol class="e1-auto__ladder" aria-label="Autonomy ladder">' + AUTO.map(function (a, i) {
      return '<li class="' + (i < n ? 'is-below' : i === n ? 'is-cur' : 'is-above') + '"' + (i === n ? ' aria-current="step"' : '') + '><span class="e1-auto__k">' + a[0] + '</span><span class="e1-auto__n">' + a[1] + '</span></li>';
    }).join('') + '</ol><p class="e1-auto__desc"><strong>' + esc(label) + '.</strong> ' + esc(AUTO[n][2]) + '.</p></div>';
  };

  /* ------------------------------------------------------------------------
     Progress and meters
     ------------------------------------------------------------------------ */
  /**
   * Linear progress with its number stated.
   * @param {number} value @param {number} [max=100] @param {{label?:string, state?:string, note?:string}} [o]
   */
  c.progress = function (value, max, o) {
    o = o || {}; max = max || 100;
    var pct = Math.max(0, Math.min(100, value / max * 100));
    return '<div class="e1-progress' + (o.state ? ' e1-progress--' + esc(o.state) : '') + '">' +
      (o.label ? '<div class="e1-progress__top"><span>' + esc(o.label) + '</span><span class="e1-mono">' + esc(o.note || (E1.fmt.num(value) + ' of ' + E1.fmt.num(max))) + '</span></div>' : '') +
      '<div class="e1-progress__track" role="progressbar" aria-valuemin="0" aria-valuemax="' + max + '" aria-valuenow="' + value + '"' + (o.label ? ' aria-label="' + esc(o.label) + '"' : '') + '><span style="width:' + pct.toFixed(1) + '%"></span></div></div>';
  };

  /**
   * Progress arc — the disc derivation for completion or a run in flight.
   * @param {number} value @param {number} [max=100] @param {{size?:number, label?:string, sub?:string}} [o]
   */
  c.progressArc = function (value, max, o) {
    o = o || {}; max = max || 100;
    var s = o.size || 72, sw = Math.max(4, Math.round(s / 12)), r = (s - sw) / 2, circ = 2 * Math.PI * r;
    var pct = Math.max(0, Math.min(1, value / max));
    return '<figure class="e1-arc" style="width:' + s + 'px"><svg width="' + s + '" height="' + s + '" viewBox="0 0 ' + s + ' ' + s + '" role="img" aria-label="' + esc((o.label || 'Progress') + ': ' + Math.round(pct * 100) + '%') + '">' +
      '<circle cx="' + s / 2 + '" cy="' + s / 2 + '" r="' + r + '" fill="none" class="e1-arc__track" stroke-width="' + sw + '"/>' +
      '<circle cx="' + s / 2 + '" cy="' + s / 2 + '" r="' + r + '" fill="none" class="e1-arc__val" stroke-width="' + sw + '" stroke-dasharray="' + (circ * pct).toFixed(2) + ' ' + circ.toFixed(2) + '" transform="rotate(-90 ' + s / 2 + ' ' + s / 2 + ')"/></svg>' +
      '<span class="e1-arc__v">' + Math.round(pct * 100) + '<small>%</small></span>' + (o.label ? '<figcaption class="e1-arc__l">' + esc(o.label) + (o.sub ? '<span>' + esc(o.sub) + '</span>' : '') + '</figcaption>' : '') + '</figure>';
  };

  /**
   * Meter bar — composition on the visualisation ramp (never the status palette), with a legend that states numbers.
   * @param {Array<{label:string, value:number}>} segments @param {{caption?:string, format?:function(n):string}} [o]
   */
  c.meter = function (segments, o) {
    o = o || {};
    var total = (segments || []).reduce(function (a, s) { return a + s.value; }, 0) || 1;
    var fmt = o.format || function (n) { return E1.fmt.num(n); };
    return '<figure class="e1-meter">' + (o.caption ? '<figcaption class="e1-meter__cap">' + esc(o.caption) + '</figcaption>' : '') +
      '<div class="e1-meter__bar" role="img" aria-label="' + esc((o.caption ? o.caption + ': ' : '') + segments.map(function (s) { return s.label + ' ' + fmt(s.value); }).join(', ')) + '">' +
      segments.map(function (s, i) { return '<span class="e1-viz-' + ((i % 8) + 1) + '" style="width:' + (s.value / total * 100).toFixed(2) + '%"></span>'; }).join('') + '</div>' +
      '<ul class="e1-legend" role="list">' + segments.map(function (s, i) { return '<li><i class="e1-viz-' + ((i % 8) + 1) + '"></i><span>' + esc(s.label) + '</span><span class="e1-mono">' + esc(fmt(s.value)) + ' · ' + Math.round(s.value / total * 100) + '%</span></li>'; }).join('') + '</ul></figure>';
  };

  /* ------------------------------------------------------------------------
     Charts — inline SVG, token colours, accessible titles + a hidden data table
     ------------------------------------------------------------------------ */
  function srTable(caption, head, rows) {
    return '<table class="e1-sr"><caption>' + esc(caption) + '</caption><thead><tr>' + head.map(function (h) { return '<th scope="col">' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr>' + r.map(function (v, i) { return i === 0 ? '<th scope="row">' + esc(v) + '</th>' : '<td>' + esc(v) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>';
  }
  function niceMax(v) { if (v <= 0) return 1; var p = Math.pow(10, Math.floor(Math.log(v) / Math.LN10)), f = v / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p; }

  /**
   * Sparkline.
   * @param {number[]} values @param {{width?:number, height?:number, title?:string, area?:bool, accent?:bool}} [o]
   */
  c.sparkline = function (values, o) {
    o = o || {}; values = values || [];
    var w = o.width || 96, h = o.height || 28, pad = 2;
    var min = Math.min.apply(null, values), max = Math.max.apply(null, values), rng = max - min || 1;
    var pts = values.map(function (v, i) { return [pad + i * (w - pad * 2) / Math.max(1, values.length - 1), h - pad - (v - min) / rng * (h - pad * 2)]; });
    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('');
    var last = pts[pts.length - 1] || [0, 0];
    return '<svg class="e1-spark' + (o.accent ? ' is-accent' : '') + '" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" width="100%" height="' + h + '" role="img" aria-label="' + esc((o.title || 'Trend') + ': from ' + values[0] + ' to ' + values[values.length - 1]) + '">' +
      (o.area !== false ? '<path class="e1-spark__area" d="' + d + 'L' + last[0].toFixed(1) + ' ' + h + 'L' + pad + ' ' + h + 'Z"/>' : '') +
      '<path class="e1-spark__line" d="' + d + '" vector-effect="non-scaling-stroke"/><circle class="e1-spark__dot" cx="' + last[0].toFixed(1) + '" cy="' + last[1].toFixed(1) + '" r="2"/></svg>';
  };

  /**
   * Bar chart (vertical by default).
   * @param {{data:Array<{label:string, value:number}>, title:string, height?:number, unit?:string, format?:function, highlight?:number (index), horizontal?:bool}} o
   */
  c.barChart = function (o) {
    o = o || {};
    var data = o.data || [], fmt = o.format || function (n) { return E1.fmt.num(n); };
    var id = E1.uid('bar'), max = niceMax(Math.max.apply(null, data.map(function (d) { return d.value; })));
    if (o.horizontal) {
      return '<figure class="e1-chart e1-hbar" aria-labelledby="' + id + '"><figcaption class="e1-chart__title" id="' + id + '">' + esc(o.title) + '</figcaption>' +
        '<ul role="list" aria-hidden="true">' + data.map(function (d, i) {
          return '<li><span class="e1-hbar__l">' + esc(d.label) + '</span><span class="e1-hbar__track"><span class="' + (i === o.highlight ? 'is-hl' : '') + '" style="width:' + (d.value / max * 100).toFixed(1) + '%"></span></span><span class="e1-hbar__v e1-mono">' + esc(fmt(d.value)) + '</span></li>';
        }).join('') + '</ul>' + srTable(o.title, ['Category', 'Value'], data.map(function (d) { return [d.label, fmt(d.value)]; })) + '</figure>';
    }
    var W = 560, H = o.height || 200, L = 44, B = 26, T = 10, R = 8;
    var bw = (W - L - R) / Math.max(1, data.length), gap = Math.min(bw * 0.36, 18);
    var grid = [0, 0.25, 0.5, 0.75, 1].map(function (f) {
      var y = T + (H - T - B) * (1 - f);
      return '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y.toFixed(1) + '" y2="' + y.toFixed(1) + '" class="e1-chart__grid"/><text x="' + (L - 8) + '" y="' + (y + 3.5).toFixed(1) + '" class="e1-chart__tick" text-anchor="end">' + esc(fmt(max * f)) + '</text>';
    }).join('');
    var bars = data.map(function (d, i) {
      var h = (H - T - B) * d.value / max, x = L + i * bw + gap / 2, y = H - B - h;
      return '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + (bw - gap).toFixed(1) + '" height="' + Math.max(0, h).toFixed(1) + '" class="e1-chart__bar' + (i === o.highlight ? ' is-hl' : '') + '"><title>' + esc(d.label + ': ' + fmt(d.value)) + '</title></rect>' +
        '<text x="' + (x + (bw - gap) / 2).toFixed(1) + '" y="' + (H - 8) + '" class="e1-chart__tick" text-anchor="middle">' + esc(d.label) + '</text>';
    }).join('');
    return '<figure class="e1-chart" aria-labelledby="' + id + '"><figcaption class="e1-chart__title" id="' + id + '">' + esc(o.title) + (o.unit ? ' <span class="e1-muted">(' + esc(o.unit) + ')</span>' : '') + '</figcaption>' +
      '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" role="img" aria-labelledby="' + id + '" preserveAspectRatio="xMidYMid meet">' + grid + '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + (H - B) + '" y2="' + (H - B) + '" class="e1-chart__axis"/>' + bars + '</svg>' +
      srTable(o.title, ['Category', 'Value'], data.map(function (d) { return [d.label, fmt(d.value)]; })) + '</figure>';
  };

  /**
   * Donut chart with a stated centre value and a legend with numbers.
   * @param {{data:Array<{label:string, value:number}>, title:string, size?:number, centre?:{value:string, label:string}, format?:function}} o
   */
  c.donut = function (o) {
    o = o || {};
    var data = o.data || [], fmt = o.format || function (n) { return E1.fmt.num(n); };
    var s = o.size || 160, sw = Math.round(s * 0.16), r = (s - sw) / 2, circ = 2 * Math.PI * r;
    var total = data.reduce(function (a, d) { return a + d.value; }, 0) || 1, acc = 0, id = E1.uid('donut');
    var segs = data.map(function (d, i) {
      var len = d.value / total * circ, gap = data.length > 1 ? Math.min(2, len / 3) : 0;
      var seg = '<circle cx="' + s / 2 + '" cy="' + s / 2 + '" r="' + r + '" fill="none" stroke-width="' + sw + '" class="e1-viz-s' + ((i % 8) + 1) + '" stroke-dasharray="' + Math.max(0, len - gap).toFixed(2) + ' ' + circ.toFixed(2) + '" stroke-dashoffset="' + (-acc).toFixed(2) + '" transform="rotate(-90 ' + s / 2 + ' ' + s / 2 + ')"><title>' + esc(d.label + ': ' + fmt(d.value)) + '</title></circle>';
      acc += len; return seg;
    }).join('');
    return '<figure class="e1-chart e1-donut" aria-labelledby="' + id + '"><figcaption class="e1-chart__title" id="' + id + '">' + esc(o.title) + '</figcaption><div class="e1-donut__row">' +
      '<div class="e1-donut__fig" style="width:' + s + 'px;height:' + s + 'px"><svg width="' + s + '" height="' + s + '" viewBox="0 0 ' + s + ' ' + s + '" role="img" aria-labelledby="' + id + '">' + segs + '</svg>' +
      (o.centre ? '<span class="e1-donut__c"><strong>' + esc(o.centre.value) + '</strong><span>' + esc(o.centre.label) + '</span></span>' : '') + '</div>' +
      '<ul class="e1-legend e1-legend--col" role="list">' + data.map(function (d, i) { return '<li><i class="e1-viz-' + ((i % 8) + 1) + '"></i><span>' + esc(d.label) + '</span><span class="e1-mono">' + esc(fmt(d.value)) + ' · ' + Math.round(d.value / total * 100) + '%</span></li>'; }).join('') + '</ul></div>' +
      srTable(o.title, ['Category', 'Value', 'Share'], data.map(function (d) { return [d.label, fmt(d.value), Math.round(d.value / total * 100) + '%']; })) + '</figure>';
  };

  /**
   * Line chart. One series may be the accent; the rest use the primary/muted chart tokens.
   * @param {{series:Array<{name:string, values:number[], accent?:bool, muted?:bool}>, labels:string[], title:string, height?:number, unit?:string, format?:function, area?:bool}} o
   */
  c.lineChart = function (o) {
    o = o || {};
    var series = o.series || [], labels = o.labels || [], fmt = o.format || function (n) { return E1.fmt.num(n); };
    var W = 560, H = o.height || 200, L = 44, B = 26, T = 10, R = 12, id = E1.uid('line');
    var all = []; series.forEach(function (s) { all = all.concat(s.values); });
    var max = niceMax(Math.max.apply(null, all)), n = labels.length;
    var X = function (i) { return L + i * (W - L - R) / Math.max(1, n - 1); }, Y = function (v) { return T + (H - T - B) * (1 - v / max); };
    var grid = [0, 0.25, 0.5, 0.75, 1].map(function (f) { var y = Y(max * f); return '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y.toFixed(1) + '" y2="' + y.toFixed(1) + '" class="e1-chart__grid"/><text x="' + (L - 8) + '" y="' + (y + 3.5).toFixed(1) + '" class="e1-chart__tick" text-anchor="end">' + esc(fmt(max * f)) + '</text>'; }).join('');
    var every = Math.ceil(n / 8);
    var xt = labels.map(function (l, i) { return i % every ? '' : '<text x="' + X(i).toFixed(1) + '" y="' + (H - 8) + '" class="e1-chart__tick" text-anchor="middle">' + esc(l) + '</text>'; }).join('');
    var lines = series.map(function (s, si) {
      var d = s.values.map(function (v, i) { return (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1); }).join('');
      var cls = s.accent ? 'is-accent' : s.muted ? 'is-muted' : 'is-primary';
      var area = (o.area && si === 0) ? '<path class="e1-chart__area ' + cls + '" d="' + d + 'L' + X(s.values.length - 1).toFixed(1) + ' ' + (H - B) + 'L' + L + ' ' + (H - B) + 'Z"/>' : '';
      var li = s.values.length - 1;
      return area + '<path class="e1-chart__line ' + cls + '" d="' + d + '"' + (s.muted ? ' stroke-dasharray="4 3"' : '') + '/><circle class="e1-chart__pt ' + cls + '" cx="' + X(li).toFixed(1) + '" cy="' + Y(s.values[li]).toFixed(1) + '" r="3"/>';
    }).join('');
    var legend = '<ul class="e1-legend" role="list">' + series.map(function (s) { return '<li><i class="e1-legend__line ' + (s.accent ? 'is-accent' : s.muted ? 'is-muted' : 'is-primary') + '"></i><span>' + esc(s.name) + '</span><span class="e1-mono">' + esc(fmt(s.values[s.values.length - 1])) + ' latest</span></li>'; }).join('') + '</ul>';
    return '<figure class="e1-chart" aria-labelledby="' + id + '"><figcaption class="e1-chart__title" id="' + id + '">' + esc(o.title) + (o.unit ? ' <span class="e1-muted">(' + esc(o.unit) + ')</span>' : '') + '</figcaption>' +
      '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" role="img" aria-labelledby="' + id + '">' + grid + '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + (H - B) + '" y2="' + (H - B) + '" class="e1-chart__axis"/>' + xt + lines + '</svg>' + legend +
      srTable(o.title, ['Period'].concat(series.map(function (s) { return s.name; })), labels.map(function (l, i) { return [l].concat(series.map(function (s) { return fmt(s.values[i]); })); })) + '</figure>';
  };

  /* ------------------------------------------------------------------------
     Navigation components
     ------------------------------------------------------------------------ */
  /**
   * Tabs as links (each tab is a route or a ?query). Active tab has aria-current="page".
   * @param {Array<{id:string, label:string, href:string, count?:number}>} items @param {string} active id
   * @param {{kind?:'line'|'enclosed', label?:string}} [o]
   */
  c.tabs = function (items, active, o) {
    o = o || {};
    return '<nav class="e1-tabs e1-tabs--' + (o.kind || 'line') + '" aria-label="' + esc(o.label || 'Views') + '"><ul role="list">' + (items || []).map(function (t) {
      var on = t.id === active;
      return '<li><a class="e1-tab' + (on ? ' is-active' : '') + '" href="' + esc(t.href) + '"' + (on ? ' aria-current="page"' : '') + '><span>' + esc(t.label) + '</span>' + (t.count !== undefined ? '<span class="e1-tab__count">' + esc(E1.fmt.num(t.count)) + '</span>' : '') + '</a></li>';
    }).join('') + '</ul></nav>';
  };

  /**
   * Filter chips whose state lives in the URL, so a view can be pasted into a message.
   * @param {Array<{label:string, href:string, active?:bool, count?:number}>} chips @param {{label?:string, clearHref?:string}} [o]
   */
  c.filters = function (chips, o) {
    o = o || {};
    return '<div class="e1-filters" role="group" aria-label="' + esc(o.label || 'Filters') + '">' + (o.label ? '<span class="e1-filters__label">' + esc(o.label) + '</span>' : '') +
      (chips || []).map(function (ch) { return c.chip(ch.label, { href: ch.href, selected: ch.active, count: ch.count }); }).join('') +
      (o.clearHref ? '<a class="e1-filters__clear" href="' + esc(o.clearHref) + '">Clear</a>' : '') + '</div>';
  };

  /**
   * Segmented control: 2–4 mutually exclusive options. With href → links; without → radio buttons that emit `e1:change` {value}.
   * @param {Array<{id:string, label:string, href?:string, icon?:string}>} items @param {string} active
   * @param {{name?:string, label?:string, size?:'sm'}} [o]
   */
  c.segmented = function (items, active, o) {
    o = o || {};
    var links = items.length && items[0].href;
    return '<div class="e1-seg' + (o.size === 'sm' ? ' e1-seg--sm' : '') + '" role="' + (links ? 'group' : 'radiogroup') + '" aria-label="' + esc(o.label || o.name || 'Options') + '"' + (o.name ? ' data-name="' + esc(o.name) + '"' : '') + '>' + items.map(function (it) {
      var on = it.id === active, inner = (it.icon ? c.icon(it.icon, 14) : '') + '<span>' + esc(it.label) + '</span>';
      if (links) return '<a class="e1-seg__item' + (on ? ' is-active' : '') + '" href="' + esc(it.href) + '"' + (on ? ' aria-current="true"' : '') + '>' + inner + '</a>';
      return '<button type="button" class="e1-seg__item" role="radio" aria-checked="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-value="' + esc(it.id) + '">' + inner + '</button>';
    }).join('') + '</div>';
  };

  /**
   * Breadcrumb.
   * @param {Array<[label:string, href:string|null]>} items  the last item is the current page
   */
  c.breadcrumb = function (items) { return E1.crumbHtml(items || []); };

  /**
   * Pagination with links.
   * @param {{page:number, pages:number, href:function(p):string, total?:number, label?:string}} o
   */
  c.pagination = function (o) {
    var p = o.page, n = o.pages, list = [], i;
    for (i = 1; i <= n; i++) { if (i === 1 || i === n || Math.abs(i - p) <= 1) list.push(i); else if (list[list.length - 1] !== '…') list.push('…'); }
    return '<nav class="e1-pager" aria-label="Pages">' + (o.total !== undefined ? '<span class="e1-pager__total">' + esc(o.label || (E1.fmt.num(o.total) + ' results')) + '</span>' : '') + '<ul role="list">' +
      '<li>' + (p > 1 ? '<a class="e1-pager__btn" href="' + esc(o.href(p - 1)) + '" aria-label="Previous page">' + c.icon('chevron-left', 14) + '</a>' : '<span class="e1-pager__btn is-disabled" aria-hidden="true">' + c.icon('chevron-left', 14) + '</span>') + '</li>' +
      list.map(function (x) { return '<li>' + (x === '…' ? '<span class="e1-pager__gap">…</span>' : x === p ? '<span class="e1-pager__btn is-current" aria-current="page">' + x + '</span>' : '<a class="e1-pager__btn" href="' + esc(o.href(x)) + '">' + x + '</a>') + '</li>'; }).join('') +
      '<li>' + (p < n ? '<a class="e1-pager__btn" href="' + esc(o.href(p + 1)) + '" aria-label="Next page">' + c.icon('chevron-right', 14) + '</a>' : '<span class="e1-pager__btn is-disabled" aria-hidden="true">' + c.icon('chevron-right', 14) + '</span>') + '</li></ul></nav>';
  };

  /**
   * Stepper (e.g. Author → Validate → Simulate → Certify). Steps before `current` are done.
   * @param {Array<string|{label:string, note?:string}>} steps @param {number} current  0-based index
   */
  c.stepper = function (steps, current) {
    return '<ol class="e1-stepper" role="list">' + (steps || []).map(function (s, i) {
      var st = i < current ? 'done' : i === current ? 'current' : 'todo';
      var label = typeof s === 'string' ? s : s.label, note = typeof s === 'string' ? '' : s.note;
      return '<li class="e1-step e1-step--' + st + '"' + (st === 'current' ? ' aria-current="step"' : '') + '><span class="e1-step__n">' + (st === 'done' ? c.icon('check', 12) : i + 1) + '</span><span class="e1-step__t"><span class="e1-step__l">' + esc(label) + '</span>' +
        '<span class="e1-sr"> — ' + { done: 'done', current: 'current step', todo: 'not started' }[st] + '</span>' + (note ? '<span class="e1-step__note">' + esc(note) + '</span>' : '') + '</span></li>';
    }).join('') + '</ol>';
  };

  /**
   * Table of contents for long pages (links scroll in place; href stays a valid route).
   * @param {Array<{id:string, label:string}>} items @param {{title?:string}} [o]
   */
  c.toc = function (items, o) {
    o = o || {};
    var here = '#' + E1.state.route.path + E1.qs(E1.state.route.query);
    return '<nav class="e1-toc" aria-label="' + esc(o.title || 'On this page') + '"><p class="e1-label">' + esc(o.title || 'On this page') + '</p><ol role="list">' + (items || []).map(function (it, i) {
      return '<li><a href="' + esc(here) + '" data-scrollto="' + esc(it.id) + '"><span class="e1-toc__n">' + (i + 1) + '</span>' + esc(it.label) + '</a></li>';
    }).join('') + '</ol></nav>';
  };

  /* ------------------------------------------------------------------------
     Forms
     ------------------------------------------------------------------------ */
  var fid = function (o) { return o.id || E1.uid('f'); };
  /**
   * Text input.
   * @param {{name?:string, id?:string, value?:string, placeholder?:string, type?:string, prefix?:string, suffix?:string, invalid?:bool, disabled?:bool, readonly?:bool, mono?:bool, required?:bool, attrs?:string, describedBy?:string}} [o]
   */
  c.input = function (o) {
    o = o || {};
    var inp = '<input class="e1-input' + (o.mono ? ' e1-mono' : '') + '" type="' + esc(o.type || 'text') + '"' + (o.id ? ' id="' + esc(o.id) + '"' : '') + (o.name ? ' name="' + esc(o.name) + '"' : '') +
      (o.value !== undefined ? ' value="' + esc(o.value) + '"' : '') + (o.placeholder ? ' placeholder="' + esc(o.placeholder) + '"' : '') + (o.invalid ? ' aria-invalid="true"' : '') + (o.required ? ' required aria-required="true"' : '') +
      (o.disabled ? ' disabled' : '') + (o.readonly ? ' readonly' : '') + (o.describedBy ? ' aria-describedby="' + esc(o.describedBy) + '"' : '') + attrs(o.attrs) + '>';
    if (!o.prefix && !o.suffix) return inp;
    return '<span class="e1-inputgroup' + (o.invalid ? ' is-invalid' : '') + (o.disabled ? ' is-disabled' : '') + '">' + (o.prefix ? '<span class="e1-inputgroup__affix">' + esc(o.prefix) + '</span>' : '') + inp + (o.suffix ? '<span class="e1-inputgroup__affix">' + esc(o.suffix) + '</span>' : '') + '</span>';
  };
  /**
   * Select.
   * @param {{name?:string, id?:string, options:Array<string|{value:string,label:string}>, value?:string, disabled?:bool, invalid?:bool, attrs?:string, describedBy?:string}} o
   */
  c.select = function (o) {
    o = o || {};
    return '<span class="e1-selectwrap"><select class="e1-select"' + (o.id ? ' id="' + esc(o.id) + '"' : '') + (o.name ? ' name="' + esc(o.name) + '"' : '') + (o.disabled ? ' disabled' : '') + (o.invalid ? ' aria-invalid="true"' : '') + (o.describedBy ? ' aria-describedby="' + esc(o.describedBy) + '"' : '') + attrs(o.attrs) + '>' +
      (o.options || []).map(function (op) { var v = typeof op === 'string' ? op : op.value, l = typeof op === 'string' ? op : op.label; return '<option value="' + esc(v) + '"' + (String(v) === String(o.value) ? ' selected' : '') + '>' + esc(l) + '</option>'; }).join('') +
      '</select>' + c.icon('chevron-down', 14) + '</span>';
  };
  /**
   * Textarea.
   * @param {{name?:string, id?:string, value?:string, rows?:number, placeholder?:string, invalid?:bool, disabled?:bool, attrs?:string, describedBy?:string}} [o]
   */
  c.textarea = function (o) {
    o = o || {};
    return '<textarea class="e1-textarea"' + (o.id ? ' id="' + esc(o.id) + '"' : '') + (o.name ? ' name="' + esc(o.name) + '"' : '') + ' rows="' + (o.rows || 3) + '"' + (o.placeholder ? ' placeholder="' + esc(o.placeholder) + '"' : '') + (o.invalid ? ' aria-invalid="true"' : '') + (o.disabled ? ' disabled' : '') + (o.describedBy ? ' aria-describedby="' + esc(o.describedBy) + '"' : '') + attrs(o.attrs) + '>' + esc(o.value || '') + '</textarea>';
  };
  function choice(type, o) {
    o = o || {};
    var id = fid(o);
    return '<label class="e1-choice e1-choice--' + type + (o.disabled ? ' is-disabled' : '') + '" for="' + esc(id) + '"><input type="' + (type === 'switch' ? 'checkbox' : type) + '" id="' + esc(id) + '"' + (o.name ? ' name="' + esc(o.name) + '"' : '') + (o.value !== undefined ? ' value="' + esc(o.value) + '"' : '') +
      (o.checked ? ' checked' : '') + (o.disabled ? ' disabled' : '') + (type === 'switch' ? ' role="switch"' : '') + attrs(o.attrs) + '><span class="e1-choice__box" aria-hidden="true">' + (type === 'checkbox' ? c.icon('check', 12) : '') + '</span><span class="e1-choice__label">' + esc(o.label) + (o.note ? '<span class="e1-choice__note">' + esc(o.note) + '</span>' : '') + '</span></label>';
  }
  /** Checkbox. @param {{label:string, name?:string, id?:string, value?:string, checked?:bool, disabled?:bool, note?:string, attrs?:string}} o */
  c.checkbox = function (o) { return choice('checkbox', o); };
  /** Radio. @param {{label:string, name:string, id?:string, value?:string, checked?:bool, disabled?:bool, note?:string, attrs?:string}} o */
  c.radio = function (o) { return choice('radio', o); };
  /** Toggle switch (a checkbox with role="switch"). @param {{label:string, name?:string, id?:string, checked?:bool, disabled?:bool, note?:string, attrs?:string}} o */
  c.toggle = function (o) { return choice('switch', o); };

  /**
   * Field: label, control, then a hint or an error. An error replaces the hint; it never stacks under it.
   * Pass the control's id in o.id so the label is bound (for controls built with the same id).
   * @param {string} label @param {string} control  HTML
   * @param {{id?:string, help?:string, error?:string, required?:bool, optional?:bool}} [o]
   */
  c.field = function (label, control, o) {
    o = o || {};
    var id = o.id || '';
    var msgId = id ? id + '-msg' : '';
    return '<div class="e1-field' + (o.error ? ' is-invalid' : '') + '">' +
      (id ? '<label class="e1-field__label" for="' + esc(id) + '">' : '<span class="e1-field__label">') + esc(label) +
      (o.required ? ' <span class="e1-field__req" aria-hidden="true">*</span><span class="e1-sr"> (required)</span>' : '') + (o.optional ? ' <span class="e1-field__opt">optional</span>' : '') + (id ? '</label>' : '</span>') +
      '<div class="e1-field__control">' + control + '</div>' +
      (o.error ? '<p class="e1-field__error"' + (msgId ? ' id="' + esc(msgId) + '"' : '') + ' role="alert">' + c.icon('alert', 12) + '<span>' + esc(o.error) + '</span></p>' : (o.help ? '<p class="e1-field__help"' + (msgId ? ' id="' + esc(msgId) + '"' : '') + '>' + esc(o.help) + '</p>' : '')) +
      '</div>';
  };

  /**
   * Search box with an optional keyboard hint.
   * @param {{name?:string, id?:string, value?:string, placeholder?:string, kbd?:string, label?:string, attrs?:string}} [o]
   */
  c.searchBox = function (o) {
    o = o || {};
    return '<div class="e1-search" role="search">' + c.icon('search', 16) + '<input type="search" class="e1-search__input"' + (o.id ? ' id="' + esc(o.id) + '"' : '') + ' name="' + esc(o.name || 'q') + '" value="' + esc(o.value || '') + '" placeholder="' + esc(o.placeholder || 'Search') + '" aria-label="' + esc(o.label || o.placeholder || 'Search') + '"' + attrs(o.attrs) + '>' + (o.kbd ? '<kbd class="e1-kbd">' + esc(o.kbd) + '</kbd>' : '') + '</div>';
  };

  /* ------------------------------------------------------------------------
     Time
     ------------------------------------------------------------------------ */
  /**
   * Countdown to a deadline. Static text at render; core ticks it every second. Turns warning under `warn` minutes.
   * @param {string|Date} deadline ISO
   * @param {{label?:string, warn?:number (minutes, default 60), bar?:bool, window?:number (minutes the whole window lasts; default 72 h)}} [o]
   *   bar: a 40px bar before the time showing how much of the window is left — the time is always stated too
   */
  c.countdown = function (deadline, o) {
    o = o || {};
    var iso = deadline instanceof Date ? deadline.toISOString() : String(deadline);
    var left = new Date(iso).getTime() - Date.now();
    var txt = left <= 0 ? 'Expired' : E1.fmt.duration(left) + ' left';
    var st = left <= 0 ? 'critical' : left < (o.warn || 60) * 60000 ? 'warning' : 'neutral';
    var win = o.bar ? (o.window || 72 * 60) : 0;
    var bar = o.bar ? '<span class="e1-countdown__bar" aria-hidden="true"><i style="width:' + Math.max(0, Math.min(100, left / (win * 60000) * 100)).toFixed(1) + '%"></i></span>' : '';
    return '<span class="e1-countdown' + (o.bar ? ' has-bar' : '') + '" data-deadline="' + esc(iso) + '" data-warn="' + (o.warn || 60) + '"' + (win ? ' data-window="' + win + '"' : '') + ' data-state="' + st + '" role="timer" title="Expires ' + esc(E1.fmt.dateTime(iso)) + '">' + c.icon('timer', 12) + bar + (o.label ? '<span class="e1-sr">' + esc(o.label) + ': </span>' : '') + '<span class="e1-countdown__t">' + txt + '</span></span>';
  };

  /* ------------------------------------------------------------------------
     Code, JSON, tree
     ------------------------------------------------------------------------ */
  /**
   * Code block with a copy button.
   * @param {string} block  raw code (escaped) @param {string} [lang] @param {{title?:string}} [o]
   */
  c.code = function (block, lang, o) {
    o = o || {};
    return '<div class="e1-code"><div class="e1-code__bar"><span class="e1-label">' + esc(o.title || lang || 'Code') + '</span><button type="button" class="e1-btn e1-btn--ghost e1-btn--sm" data-copy="" data-copy-label="Code">' + c.icon('copy', 14) + '<span>Copy</span></button></div>' +
      '<pre><code' + (lang ? ' class="lang-' + esc(lang) + '"' : '') + '>' + esc(block) + '</code></pre></div>';
  };

  /**
   * JSON viewer using native <details>. Depth < open are expanded.
   * @param {*} value @param {{open?:number (default 1), title?:string}} [o]
   */
  c.json = function (value, o) {
    o = o || {};
    var openDepth = o.open === undefined ? 1 : o.open;
    function node(k, v, depth) {
      var key = k !== null ? '<span class="e1-json__k">' + esc(k) + '</span>: ' : '';
      if (v === null) return '<div class="e1-json__row">' + key + '<span class="e1-json__null">null</span></div>';
      if (Array.isArray(v) || typeof v === 'object') {
        var arr = Array.isArray(v), keys = arr ? v.map(function (_, i) { return i; }) : Object.keys(v);
        return '<details class="e1-json__node"' + (depth < openDepth ? ' open' : '') + '><summary>' + key + '<span class="e1-json__b">' + (arr ? '[' : '{') + '</span><span class="e1-json__n">' + keys.length + (arr ? ' items' : ' keys') + '</span></summary>' +
          '<div class="e1-json__kids">' + keys.map(function (kk) { return node(arr ? null : kk, v[kk], depth + 1); }).join('') + '</div><span class="e1-json__b">' + (arr ? ']' : '}') + '</span></details>';
      }
      var cls = typeof v === 'string' ? 'e1-json__s' : typeof v === 'number' ? 'e1-json__num' : 'e1-json__bool';
      return '<div class="e1-json__row">' + key + '<span class="' + cls + '">' + esc(typeof v === 'string' ? '"' + v + '"' : String(v)) + '</span></div>';
    }
    return '<div class="e1-json">' + (o.title ? '<div class="e1-code__bar"><span class="e1-label">' + esc(o.title) + '</span><button type="button" class="e1-btn e1-btn--ghost e1-btn--sm" data-copy="' + esc(JSON.stringify(value, null, 2)) + '" data-copy-label="JSON">' + c.icon('copy', 14) + '<span>Copy</span></button></div>' : '') + '<div class="e1-json__body">' + node(null, value, 0) + '</div></div>';
  };

  /**
   * Tree (native <details> for branches).
   * @param {Array<{label:string, icon?:string, href?:string, open?:bool, meta?:string, children?:Array}>} nodes
   */
  c.tree = function (nodes) {
    function li(n) {
      var label = (n.icon ? c.icon(n.icon, 14) : '') + (n.href ? '<a href="' + esc(n.href) + '">' + esc(n.label) + '</a>' : '<span>' + esc(n.label) + '</span>') + (n.meta ? '<span class="e1-tree__meta">' + esc(n.meta) + '</span>' : '');
      if (n.children && n.children.length) return '<li><details' + (n.open ? ' open' : '') + '><summary>' + c.icon('chevron-right', 12, { cls: 'e1-tree__chev' }) + label + '</summary><ul role="group">' + n.children.map(li).join('') + '</ul></details></li>';
      return '<li><span class="e1-tree__leaf">' + label + '</span></li>';
    }
    return '<ul class="e1-tree" role="tree">' + (nodes || []).map(li).join('') + '</ul>';
  };

  /* ------------------------------------------------------------------------
     v2 additions — the elan1 console console vocabulary
     ------------------------------------------------------------------------ */
  var VERDICT = { pass: 'good', passed: 'good', clean: 'good', good: 'good', ok: 'good', continuous: 'good',
    conditional: 'warning', warn: 'warning', warning: 'warning', waiting: 'warning', pending: 'warning',
    watch: 'serious', serious: 'serious', fail: 'critical', failed: 'critical', blocked: 'critical', critical: 'critical', 'break': 'critical',
    info: 'info', running: 'info', na: 'neutral', neutral: 'neutral', skipped: 'neutral', not_run: 'neutral' };
  /**
   * Verdict pill: a bordered result word — Passed, Conditional, Licence watch, Blocked. No mark; the word carries it.
   * @param {string} kind  pass|clean|conditional|warn|watch|fail|blocked|info|na (or a state name)
   * @param {string} label @param {{icon?:string, strong?:bool}} [o] strong: the large "Blocking green · 46 nights" form
   */
  c.verdict = function (kind, label, o) {
    o = o || {};
    var s = VERDICT[String(kind || '').toLowerCase()] || stateOf(kind);
    return '<span class="e1-verdict e1-verdict--' + s + (o.strong ? ' e1-verdict--strong' : '') + '">' + (o.icon ? c.icon(o.icon, o.strong ? 14 : 12) : '') + '<span>' + esc(label) + '</span></span>';
  };

  /**
   * Cost chip in rupees: c.cost(18.4) → “₹ 18.40”; c.cost(0) → “₹ 0 · free” in the good tone.
   * @param {number} amount @param {{decimals?:number, note?:string, free?:bool}} [o]
   */
  c.cost = function (amount, o) {
    o = o || {};
    var n = Number(amount) || 0, free = o.free !== undefined ? o.free : n === 0;
    var dec = o.decimals !== undefined ? o.decimals : (n % 1 ? 2 : 0);
    return '<span class="e1-cost' + (free ? ' is-free' : '') + '" title="' + esc('₹' + E1.fmt.num(n, dec) + (free ? ' — not metered' : '')) + '"><span class="e1-cost__r">₹</span>' + esc(E1.fmt.num(n, dec)) +
      (o.note ? '<span class="e1-cost__note">' + esc(o.note) + '</span>' : '') + '</span>';
  };

  /**
   * “Needs your attention” list: one action per row, oldest first.
   * @param {Array<{title:string, href?:string, kind?:string, icon?:string, gate?:bool, badge?:string(html), body?:string, meta?:string|Array<string(html)>, metaMono?:bool,
   *               actions?:string(html)|{label,href,kind?}|Array, waiting?:bool}>} items
   * @param {{empty?:Object}} [o]  empty: c.empty options when there are no items
   */
  c.attention = function (items, o) {
    o = o || {};
    items = items || [];
    if (!items.length) return c.empty(o.empty || { title: 'Nothing needs you', why: 'No approval, refusal or obligation is waiting on you.', compact: true });
    return '<ul class="e1-attn" role="list">' + items.map(function (it) {
      var meta = Array.isArray(it.meta) ? it.meta.join('') : (it.meta ? (it.metaMono ? esc(it.meta) : it.meta) : '');
      return '<li class="e1-attn__item' + (it.waiting ? ' is-waiting' : '') + '">' +
        '<span class="e1-attn__ic' + (it.gate ? ' e1-attn__ic--gate' : '') + '" aria-hidden="true">' + c.icon(it.gate ? 'gate' : (it.icon || 'work'), 18) + '</span>' +
        '<div class="e1-attn__main">' + (it.kind ? '<div class="e1-attn__kind">' + esc(it.kind) + '</div>' : '') +
        '<div class="e1-attn__title">' + (it.href ? '<a href="' + esc(it.href) + '">' + esc(it.title) + '</a>' : '<span>' + esc(it.title) + '</span>') + (it.badge || '') + '</div>' +
        (it.body ? '<div class="e1-attn__body">' + esc(it.body) + '</div>' : '') +
        (meta ? '<div class="e1-attn__meta' + (it.metaMono ? ' e1-attn__meta--mono' : '') + '">' + meta + '</div>' : '') + '</div>' +
        (it.actions ? '<div class="e1-attn__act">' + actionHtml(it.actions, 'secondary').replace(/e1-btn e1-btn--(\w+)"/g, 'e1-btn e1-btn--$1 e1-btn--sm"') + '</div>' : '<span></span>') + '</li>';
    }).join('') + '</ul>';
  };

  /**
   * Mini-head: the one-line consequence strip — 2 to 5 cells of label + value (+ small note).
   * c.miniHead([{label:'Changes', value:'4'}, {label:'Blast radius', value:'One counterparty'}, {label:'Undo', value:'Reversible', note:'24 h'}, {label:'Cost', html:c.cost(18.4)}])
   * @param {Array<{label:string, value?:string|number, html?:string, note?:string}>} cells @param {{lg?:bool}} [o]
   */
  c.miniHead = function (cells, o) {
    o = o || {}; cells = cells || [];
    return '<dl class="e1-minihead' + (o.lg ? ' e1-minihead--lg' : '') + '" style="--cols:' + Math.max(1, cells.length) + '">' + cells.map(function (x) {
      return '<div><dt>' + esc(x.label) + '</dt><dd>' + (x.html !== undefined ? x.html : esc(x.value)) + (x.note ? '<small>' + esc(x.note) + '</small>' : '') + '</dd></div>';
    }).join('') + '</dl>';
  };

  var DOOR_LETTER = { work: 'W', records: 'R', agents: 'A', assurance: 'S', reference: 'X' };
  /**
   * Letter chip: a door or product initial on a ramp tone. Never alone — put the word next to it, or pass label.
   * c.letter('W', {door:'work'}) · c.letter('L', {label:'ledger1'}) · c.doorMark('assurance', {word:true})
   * @param {string} ch @param {{door?:'work'|'records'|'agents'|'assurance'|'reference', label?:string, size?:'lg'}} [o]
   */
  c.letter = function (ch, o) {
    o = o || {};
    return '<span class="e1-letter' + (o.door ? ' e1-letter--' + esc(o.door) : '') + (o.size === 'lg' ? ' e1-letter--lg' : '') + '"' + (o.label ? ' title="' + esc(o.label) + '"' : ' aria-hidden="true"') + '>' + esc(String(ch || '?').charAt(0).toUpperCase()) + '</span>' + (o.label ? '<span class="e1-sr">' + esc(o.label) + '</span>' : '');
  };
  /** Door mark: the door's letter chip, with the door name as a word when o.word (e.g. “W WORK”). */
  c.doorMark = function (door, o) {
    o = o || {};
    var d = E1.nav && E1.nav[door], name = d ? d.label : door;
    var chip = c.letter(DOOR_LETTER[door] || String(name).charAt(0), { door: door, size: o.size, label: o.word ? null : name });
    return o.word ? '<span class="e1-lettertag">' + chip + '<span>' + esc(name) + '</span></span>' : chip;
  };

  var GATE_WORD = { passed: 'Passed', failed: 'Failed', pending: 'Waiting', waiting: 'Waiting', running: 'Running', skipped: 'Skipped', not_run: 'Not run' };
  /**
   * Gate cells — “What we tested”: one cell per declared gate with its id, name and result in words.
   * @param {Array<{id:string, name:string, result:'passed'|'failed'|'pending'|'waiting'|'running'|'skipped'|'not_run'}>} list
   * @param {{title?:string, suite?:string, min?:number (cell min width px)}} [o]
   */
  c.gateCells = function (list, o) {
    o = o || {}; list = list || [];
    var passed = list.filter(function (g) { return g.result === 'passed'; }).length;
    return '<div class="e1-gatecells">' + (o.title !== false ? '<div class="e1-gatecells__head"><span class="e1-label">' + esc(o.title || 'What we tested') + '</span><span class="e1-caption e1-muted">' + passed + ' of ' + list.length + ' passed' + (o.suite ? ' · <span class="e1-mono">' + esc(o.suite) + '</span>' : '') + '</span></div>' : '') +
      '<ul class="e1-gatecells__grid" role="list"' + (o.min ? ' style="grid-template-columns:repeat(auto-fill,minmax(' + Number(o.min) + 'px,1fr))"' : '') + '>' + list.map(function (g) {
        var res = GATE_WORD[g.result] ? g.result : 'not_run';
        return '<li class="e1-gcell e1-gcell--' + res + '"><b>' + esc(g.id) + '</b><span class="e1-gcell__n" title="' + esc(g.name) + '">' + esc(g.name) + '</span><span class="e1-gcell__r">' + GATE_WORD[res] + '</span></li>';
      }).join('') + '</ul></div>';
  };
  /**
   * Gate dots: one square per gate, with the summary as the accessible name.
   * @param {Array<string|{id?:string, result:string}>} list results: passed|failed|pending|waiting|running|skipped|not_run
   */
  c.gateDots = function (list) {
    list = (list || []).map(function (g) { return typeof g === 'string' ? { result: g } : g; });
    var p = list.filter(function (g) { return g.result === 'passed'; }).length, f = list.filter(function (g) { return g.result === 'failed'; }).length, w = list.filter(function (g) { return g.result === 'pending' || g.result === 'waiting'; }).length;
    var sum = p + ' of ' + list.length + ' gates passed' + (f ? ', ' + f + ' failed' : '') + (w ? ', ' + w + ' waiting' : '');
    return '<span class="e1-gatedots" role="img" aria-label="' + esc(sum) + '" title="' + esc(sum) + '">' + list.map(function (g) { return '<i class="is-' + esc(g.result) + '"></i>'; }).join('') + '</span>';
  };

  /** Tag: a mono label on the sunken ground — c.tag('Custom Field · Customer'). @param {string} text @param {{icon?:string}} [o] */
  c.tag = function (text, o) { o = o || {}; return '<span class="e1-tag">' + (o.icon ? c.icon(o.icon, 12) : '') + esc(text) + '</span>'; };
  var CHANNEL_ICON = { web: 'globe', api: 'code', whatsapp: 'message', voice: 'phone', email: 'mail', agent: 'agents', connector: 'plug', mcp: 'plug', console: 'grid', mobile: 'phone' };
  /** Channel badge: c.channel('WhatsApp'). @param {string} name @param {{icon?:string|false}} [o] */
  c.channel = function (name, o) {
    o = o || {};
    var ic = o.icon === false ? '' : c.icon(o.icon || CHANNEL_ICON[String(name).toLowerCase()] || 'arrow-right', 12);
    return '<span class="e1-channel">' + ic + esc(name) + '</span>';
  };
  /** Honesty mark: a small mono chip such as ‘₹0’, ‘[MEASURED]’ or ‘sample data’. */
  c.honesty = function (text) { return '<span class="e1-honesty">' + esc(text) + '</span>'; };
  /**
   * As-of stamp: c.asOf('08:02') · c.asOf('Yesterday 23:10', {state:'old'}).
   * @param {string} time @param {{state?:'fresh'|'old'|'dead'|'none', label?:string}} [o]
   */
  c.asOf = function (time, o) {
    o = o || {};
    var st = o.state && o.state !== 'fresh' ? ' e1-asof--' + esc(o.state) : '';
    var word = { fresh: 'fresh', old: 'stale', dead: 'not updating', none: 'not measured' }[o.state || 'fresh'];
    return '<span class="e1-asof' + st + '" title="' + esc((o.label || 'As of') + ' ' + time + ' · ' + word) + '">' + esc(time) + '<span class="e1-sr"> (' + word + ')</span></span>';
  };
  /** Person chip for a row: initials in an ink circle + a name. @param {string} name @param {{kind?:'person'|'agent'}} [o] */
  c.who = function (name, o) { o = o || {}; return '<span class="e1-who">' + c.avatar(name, { kind: o.kind || 'person', size: 'xs' }) + '<span>' + esc(name) + '</span></span>'; };
  /**
   * Mini bar — a thin share-of-whole bar with its number stated in the accessible name.
   * @param {number} value @param {number} [max=100] @param {{state?:'good'|'warning'|'critical'|'ink', held?:number, label?:string}} [o] held: a second, lighter segment
   */
  c.minibar = function (value, max, o) {
    o = o || {}; max = max || 100;
    var pct = Math.max(0, Math.min(100, value / max * 100)), held = o.held ? Math.max(0, Math.min(100 - pct, o.held / max * 100)) : 0;
    return '<div class="e1-minibar' + (o.state ? ' e1-minibar--' + esc(o.state) : '') + '" role="img" aria-label="' + esc((o.label ? o.label + ': ' : '') + Math.round(pct) + '%') + '"><span style="width:' + pct.toFixed(1) + '%"></span>' + (held ? '<span class="is-held" style="width:' + held.toFixed(1) + '%"></span>' : '') + '</div>';
  };

  /* ------------------------------------------------------------------------
     Registry for the documentation (component index)
     ------------------------------------------------------------------------ */
  c.names = function () { return Object.keys(c).filter(function (k) { return typeof c[k] === 'function' && ['names', 'iconNames', 'iconAliases'].indexOf(k) < 0; }); };
})();
