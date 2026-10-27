/* ==========================================================================
   elan1 · ASSURANCE door — Level 1, operations and money (owner: assurance-core)
   "Can I show someone this was done properly?"
   Routes: /assurance · proof · proof/:seq · proof/:seq/path · chain · coverage · refusals · refusals/register ·
   refusals/:code · enforcement · level · system-map · runtime · residency · security · access · incidents ·
   incidents/:id · readiness · meter · meter/:line · invoices · invoices/:id · plan · plan/upgrade · reconciliation
   Sources: spec-phase1-console §1.4, §1.7, §1.9–1.12, §2.4, §4 · spec-tm · spec-atlas Figs 1/3/4/6/7/13/25/27/28/32
   · spec-im §5 · spec-phase4-group A-01…A-25 · competitors-1 (questions as widget titles; every count opens records).
   Sample data: Kaveri Spinning Mills Pvt Ltd, 24 Sep 2026 (IST). Sandbox data — not a real customer.
   ========================================================================== */
(function () {
  'use strict';
  var E1 = window.E1, c = E1.c, esc = E1.esc, fmt = E1.fmt;

  /* ------------------------------------------------------------------------
     Small helpers
     ------------------------------------------------------------------------ */
  function num(n) { return fmt.num(n); }
  function P(n) { return '#' + num(n); }
  function seqLink(n, label) { return '<a class="e1-mono ac-seq" href="#/assurance/proof/' + n + '">' + esc(label || P(n)) + '</a>'; }
  function mono(s) { return '<span class="e1-mono">' + esc(s) + '</span>'; }
  function muted(s) { return '<span class="e1-muted">' + esc(s) + '</span>'; }
  function iso(day, hm) { return '2026-09-' + (day < 10 ? '0' + day : day) + 'T' + hm + ':00+05:30'; }
  function q(query, extra) { var o = {}, k; for (k in query) if (query[k] !== undefined && query[k] !== '') o[k] = query[k]; for (k in extra) { if (extra[k] === null || extra[k] === '') delete o[k]; else o[k] = extra[k]; } return o; }
  function stateMenu(path, items) {
    return c.menu({ label: 'View states', icon: 'layers', align: 'right', items: items.map(function (it) { return { label: it[0], href: '#' + path + (it[1] ? '?state=' + it[1] : ''), icon: it[2] || 'eye' }; }) });
  }
  function fresh(label, minutesAgo, absolute) {
    return '<span class="ac-fresh" title="' + esc(absolute || fmt.dateTime(E1.ago(minutesAgo))) + '">' + c.asOf(label + ' ' + fmt.rel(E1.ago(minutesAgo)), { label: label, state: minutesAgo > 1440 ? 'old' : undefined }) + '</span>';
  }
  function freshAt(label, isoStr) {
    return '<span class="ac-fresh" title="' + esc(fmt.dateTime(isoStr)) + '">' + c.asOf(label + ' ' + fmt.time(isoStr), { label: label }) + '</span>';
  }
  function tri(state, label) { // three-valued: passed | failed | not_measured
    var m = { passed: ['good', 'Passed', 'check'], failed: ['critical', 'Failed', 'x'], not_measured: ['neutral', 'Not measured', 'minus'], continuous: ['good', 'Continuous', 'chain'], not_checked: ['neutral', 'Not checked', 'skip'], break: ['critical', 'Break', 'refuse'] }[state] || ['neutral', state, 'minus'];
    return c.verdict(m[0], label || m[1], { icon: m[2] });
  }
  function tag(label, kind) { return '<span class="ac-tag' + (kind ? ' ac-tag--' + kind : '') + '">' + esc(label) + '</span>'; }
  function unverified() { return c.honesty('target [unverified]'); }
  function srcConflict(note) { return c.tooltip(tag('Source conflict', 'conflict'), note); }
  function sentence(s) { return '<p class="ac-sentence">' + esc(s) + '</p>'; }
  function qcard(o) { // a card titled with the question an auditor asks
    return '<section class="e1-card ac-q' + (o.cls ? ' ' + o.cls : '') + '"><header class="ac-q__head"><p class="ac-q__q">' + esc(o.q) + '</p>' + (o.fresh ? '<div class="ac-q__fresh">' + o.fresh + '</div>' : '') + '</header>' +
      '<div class="ac-q__body">' + o.body + '</div>' + (o.foot ? '<footer class="ac-q__foot">' + o.foot + '</footer>' : '') + '</section>';
  }
  function linkArrow(label, href) { return '<a class="ac-more" href="' + esc(href) + '">' + esc(label) + c.icon('arrow-right', 12) + '</a>'; }
  function page(inner) { return '<div class="ac-page">' + inner + '</div>'; }
  function crumbsA(extra) { return [['Assurance', '#/assurance']].concat(extra || []); }

  /* Sibling pages → underline tabs under the page header (v2 pane header, rung1 / stack1). Detail pages keep their back link. */
  var SIB = [
    [['proof', 'Proof', '/assurance/proof'], ['chain', 'Chain standing', '/assurance/chain'], ['coverage', 'Coverage', '/assurance/coverage'], ['refusals', 'Refusals', '/assurance/refusals', ['/assurance/refusals/register']], ['enforcement', 'Enforcement', '/assurance/enforcement']],
    [['system-map', 'System map', '/assurance/system-map'], ['runtime', 'Runtime', '/assurance/runtime'], ['residency', 'Residency', '/assurance/residency'], ['security', 'Security', '/assurance/security'], ['access', 'Access log', '/assurance/access'], ['incidents', 'Incidents', '/assurance/incidents'], ['readiness', 'L1 readiness', '/assurance/readiness']],
    [['level', 'Assurance level', '/assurance/level'], ['upgrade', 'Upgrade to L2', '/assurance/upgrade'], ['bundles', 'Evidence bundles', '/assurance/bundles'], ['exports', 'Exports', '/assurance/exports', ['/assurance/export']], ['anchoring', 'Anchoring', '/assurance/anchoring'], ['profiles', 'Verifier profiles', '/assurance/profiles'], ['verify-runs', 'Verifier runs', '/assurance/verify-runs']],
    [['receipts', 'Action receipts', '/assurance/receipts'], ['counterparties', 'Counterparties', '/assurance/counterparties'], ['disclosures', 'Disclosures', '/assurance/disclosures'], ['certification', 'Certification', '/assurance/certification'], ['l3', 'L3 readiness', '/assurance/l3']],
    [['meter', 'Meter', '/assurance/meter'], ['invoices', 'Invoices', '/assurance/invoices'], ['plan', 'Plan', '/assurance/plan'], ['reconciliation', 'Reconciliation', '/assurance/reconciliation']]
  ];
  function sibTabs() {
    var path = ((E1.state.route || {}).path || '').replace(/\/+$/, '');
    for (var g = 0; g < SIB.length; g++) for (var i = 0; i < SIB[g].length; i++) {
      var t = SIB[g][i];
      if (t[2] === path || (t[3] && t[3].indexOf(path) >= 0)) {
        return c.tabs(SIB[g].map(function (x) { return { id: x[0], label: x[1], href: '#' + x[2] }; }), t[0], { label: 'Pages in this group' });
      }
    }
    return '';
  }
  function ph(o) { if (!o.back && !o.tabs) { var t = sibTabs(); if (t) o = Object.assign({}, o, { tabs: t }); } return c.pageHeader(o); }

  /* deterministic hex for sample digests */
  function hex(seed, len) {
    var s = (seed >>> 0) || 1, out = '';
    while (out.length < len) { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; out += ('00000000' + s.toString(16)).slice(-8); }
    return out.slice(0, len);
  }
  function rng(seed) { var s = (seed * 2654435761) >>> 0; return function () { s = (Math.imul(s ^ (s >>> 15), 2246822507) + 0x9e3779b9) >>> 0; s = (s ^ (s >>> 13)) >>> 0; return (s % 100000) / 100000; }; }
  function uuid(seed) { var h = hex(seed, 32); return h.slice(0, 8) + '-' + h.slice(8, 12) + '-4' + h.slice(13, 16) + '-a' + h.slice(17, 20) + '-' + h.slice(20, 32); }
  var ZERO_UUID = '00000000-0000-0000-0000-000000000000';
  var ZERO_DIGEST = new Array(65).join('0');

  /* ------------------------------------------------------------------------
     Scoped styles (tokens only; diagram zones only inside diagrams)
     ------------------------------------------------------------------------ */
  (function styles() {
    if (document.getElementById('ac-styles')) return;
    var css = [
      '.ac-page{display:flex;flex-direction:column;gap:var(--space-5)}',
      '.ac-page>.e1-ph{margin-bottom:0}.ac-page>.e1-tabs--line{margin-bottom:calc(var(--space-2) * -1)}.ac-page>.e1-section{margin-top:var(--space-2)}.ac-page>.e1-section:first-child{margin-top:0}',
      '.ac-grid{display:grid;gap:var(--space-4)}',
      '.ac-grid--2{grid-template-columns:repeat(2,minmax(0,1fr))}.ac-grid--3{grid-template-columns:repeat(3,minmax(0,1fr))}.ac-grid--4{grid-template-columns:repeat(4,minmax(0,1fr))}',
      '@media (max-width:1180px){.ac-grid--4{grid-template-columns:repeat(2,minmax(0,1fr))}.ac-grid--3{grid-template-columns:repeat(2,minmax(0,1fr))}}',
      '@media (max-width:760px){.ac-grid--2,.ac-grid--3,.ac-grid--4{grid-template-columns:minmax(0,1fr)}}',
      '.ac-split{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:var(--space-5);align-items:start}',
      '@media (max-width:1180px){.ac-split{grid-template-columns:minmax(0,1fr)}}',
      '.ac-side{display:flex;flex-direction:column;gap:var(--space-4);position:sticky;top:var(--space-4)}',
      '@media (max-width:1180px){.ac-side{position:static}}',
      '.ac-fresh{display:inline-flex;align-items:center;gap:4px;white-space:nowrap}',
      '.ac-freshrow{display:flex;flex-wrap:wrap;gap:var(--space-2) var(--space-4);align-items:center}',
      '.ac-tag{display:inline-flex;align-items:center;gap:4px;height:18px;padding:0 5px;font:var(--weight-medium) var(--text-label)/1 var(--font-mono);border-radius:var(--radius-sm);border:1px dashed var(--border-default);background:var(--honesty-ground);color:var(--text-tertiary);white-space:nowrap;vertical-align:middle}',
      '.ac-tag--conflict{border-style:solid;border-color:var(--state-warning-border);background:var(--state-warning-bg);color:var(--text-primary)}',
      '.ac-tag--solid{border-style:solid}',
      '.ac-quote{margin:0;font-size:var(--text-body);line-height:var(--lh-body);color:var(--text-primary);padding-left:10px;border-left:2px solid var(--border-default)}',
      '.ac-sentence{font:var(--weight-regular) var(--text-body)/var(--lh-body) var(--font-ui);color:var(--text-primary);margin:0}',
      '.ac-q{display:flex;flex-direction:column}',
      '.ac-q .ac-sentence{padding-left:10px;border-left:2px solid var(--border-default);color:var(--text-secondary)}',
      '.ac-q__head{display:flex;justify-content:space-between;gap:var(--space-3);align-items:center;min-height:48px;padding:10px var(--pane-padding);border-bottom:1px solid var(--border-subtle)}',
      '.ac-q__q{font:var(--weight-title) 15px/1.3 var(--font-display);letter-spacing:-.01em;color:var(--text-primary);margin:0}',
      '.ac-q__fresh{flex:none}',
      '.ac-q__body{padding:var(--space-4) var(--pane-padding);display:flex;flex-direction:column;gap:var(--space-3);flex:1;font-size:var(--text-caption);line-height:var(--lh-caption);color:var(--text-secondary)}',
      '.ac-q__foot{border-top:1px solid var(--border-subtle);padding:8px var(--pane-padding);display:flex;gap:var(--space-4);flex-wrap:wrap;background:color-mix(in srgb,var(--bg-sunken) 45%,var(--bg-surface));border-radius:0 0 var(--radius-md) var(--radius-md)}',
      '.ac-big{font:var(--weight-title) 28px/32px var(--font-display);letter-spacing:var(--tracking-title);color:var(--text-primary);font-variant-numeric:tabular-nums}',
      'a.ac-big{text-decoration:none}a.ac-big:hover{text-decoration:underline}',
      '.ac-big small{font:var(--weight-regular) var(--text-caption)/1 var(--font-ui);letter-spacing:0;color:var(--text-secondary);margin-left:6px}',
      '.ac-more{display:inline-flex;align-items:center;gap:4px;font-size:var(--text-caption);font-weight:var(--weight-medium)}',
      '.ac-seq{white-space:nowrap}',
      '.ac-line{display:flex;justify-content:space-between;gap:var(--space-3);align-items:baseline;padding:6px 0;border-bottom:1px solid var(--border-subtle);font-size:var(--text-caption);color:var(--text-primary)}',
      '.ac-line:last-child{border-bottom:0}',
      '.ac-line>span:last-child{font-family:var(--font-mono);font-variant-numeric:tabular-nums;white-space:nowrap}',
      '.ac-claims{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0;border:1px solid var(--border-subtle);border-radius:var(--radius-md);overflow:hidden;background:var(--bg-surface);box-shadow:var(--shadow-1)}',
      '@media (max-width:760px){.ac-claims{grid-template-columns:minmax(0,1fr)}}',
      '.ac-claims>div{padding:var(--space-4) var(--pane-padding)}',
      '.ac-claims>div+div{border-left:1px solid var(--border-subtle)}',
      '@media (max-width:760px){.ac-claims>div+div{border-left:0;border-top:1px solid var(--border-subtle)}}',
      '.ac-claims h3{display:flex;align-items:center;gap:6px;font-size:var(--text-label);line-height:var(--lh-label);letter-spacing:var(--tracking-label);text-transform:uppercase;margin:0 0 var(--space-3);color:var(--text-tertiary);font-weight:var(--weight-semibold)}',
      '.ac-claims ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:var(--space-2)}',
      '.ac-claims li{display:flex;gap:8px;align-items:flex-start;font-size:var(--text-body);line-height:var(--lh-body)}',
      '.ac-claims li svg{flex:none;margin-top:3px}',
      '.ac-claims .ac-say{font-size:var(--text-body);line-height:var(--lh-body);color:var(--text-primary)}',
      '.ac-2col{display:grid;grid-template-columns:232px minmax(0,1fr);gap:var(--space-5);align-items:start}',
      '@media (max-width:980px){.ac-2col{grid-template-columns:minmax(0,1fr)}}',
      '.ac-facets{display:flex;flex-direction:column;gap:var(--space-4);font-size:13px}',
      '.ac-facet h3{font-size:var(--text-label);letter-spacing:var(--tracking-label);text-transform:uppercase;color:var(--text-tertiary);font-weight:var(--weight-semibold);margin:0 0 6px}',
      '.ac-facet ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:1px}',
      '.ac-facet a{display:flex;justify-content:space-between;gap:8px;align-items:center;padding:6px 8px;border-radius:var(--radius-sm);color:var(--text-primary);text-decoration:none;min-height:32px}',
      '.ac-facet a:hover{background:var(--bg-hover)}',
      '.ac-facet a[aria-current]{background:var(--bg-selected);box-shadow:inset 2px 0 0 var(--border-accent);font-weight:var(--weight-semibold)}',
      '.ac-facet a .ac-n{font:var(--weight-medium) var(--text-label)/18px var(--font-mono);min-width:22px;padding:0 6px;text-align:center;border-radius:var(--radius-full);background:var(--bg-sunken);color:var(--text-secondary)}',
      '@media (max-width:980px){.ac-facets{flex-direction:row;flex-wrap:wrap}.ac-facet{min-width:180px;flex:1}}',
      '.ac-tablebar{display:flex;justify-content:space-between;align-items:center;gap:var(--space-3);flex-wrap:wrap;margin-bottom:var(--space-3)}',
      '.ac-wt{display:flex;flex-direction:column;line-height:1.3}.ac-wt small{font-family:var(--font-mono);font-size:var(--text-label);color:var(--text-tertiary)}',
      '.ac-honest{border:1px solid var(--border-subtle);border-left:3px solid var(--level-1-border);background:var(--honesty-ground);border-radius:var(--radius-md);padding:var(--space-3) var(--space-4);display:flex;gap:var(--space-3);align-items:flex-start}',
      '.ac-honest p{margin:0;font-size:var(--text-body);line-height:var(--lh-body);color:var(--text-primary)}',
      '.ac-honest .e1-label{display:block;margin-bottom:4px}',
      '.ac-rel{display:flex;align-items:stretch;gap:0;flex-wrap:wrap}',
      '.ac-rel__n{flex:1;min-width:180px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:var(--space-3);background:var(--bg-surface);box-shadow:var(--shadow-1);text-decoration:none;color:var(--text-primary);display:flex;flex-direction:column;gap:6px;font-size:var(--text-caption)}',
      '.ac-rel__n:hover{border-color:var(--border-strong);background:var(--bg-hover)}',
      '.ac-rel__n.is-here{border-color:var(--border-accent);box-shadow:0 0 0 1px var(--border-accent)}',
      '.ac-rel__arrow{display:flex;align-items:center;padding:0 6px;color:var(--text-tertiary)}',
      '@media (max-width:760px){.ac-rel{flex-direction:column}.ac-rel__arrow{transform:rotate(90deg);justify-content:center;padding:4px 0}}',
      '.ac-ladder{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0;border:1px solid var(--border-subtle);border-radius:var(--radius-md);overflow:hidden;background:var(--bg-surface);box-shadow:var(--shadow-1)}',
      '.ac-rung{display:grid;grid-template-columns:64px minmax(0,1fr) 180px;gap:var(--space-4);padding:var(--space-3) var(--space-4);border-top:1px solid var(--border-subtle);align-items:start}',
      '.ac-rung:first-child{border-top:0}',
      '@media (max-width:760px){.ac-rung{grid-template-columns:48px minmax(0,1fr)}.ac-rung__t{grid-column:2}}',
      '.ac-rung__n{font:var(--weight-semibold) var(--text-caption)/1 var(--font-mono);display:flex;flex-direction:column;align-items:center;gap:6px;color:var(--text-secondary)}',
      '.ac-rung__dot{width:26px;height:26px;border-radius:var(--radius-sm);display:grid;place-items:center;border:1.5px solid var(--border-strong);background:var(--bg-surface)}',
      '.ac-rung--passed .ac-rung__dot{border-color:var(--state-good);color:var(--state-good);background:var(--state-good-bg)}',
      '.ac-rung--refused .ac-rung__dot{border-color:var(--state-neutral);color:var(--text-primary);background:var(--state-neutral-bg);border-width:2px}',
      '.ac-rung--platform .ac-rung__dot{border-color:var(--state-critical);color:var(--state-critical);background:var(--state-critical-bg)}',
      '.ac-rung--escalated .ac-rung__dot{border-color:var(--state-warning);color:var(--state-warning);background:var(--state-warning-bg)}',
      '.ac-rung--skipped{background:var(--bg-sunken)}.ac-rung--skipped .ac-rung__main{color:var(--text-tertiary)}',
      '.ac-rung--stop .ac-rung__dot{border-style:dashed}',
      '.ac-rung__name{font-weight:var(--weight-semibold);font-size:var(--text-body);display:flex;gap:8px;align-items:center;flex-wrap:wrap}',
      '.ac-rung__name code{font-size:var(--text-caption);color:var(--text-secondary);font-weight:var(--weight-medium)}',
      '.ac-rung__rule{font-size:var(--text-caption);line-height:var(--lh-caption);color:var(--text-secondary);margin:2px 0 0}',
      '.ac-rung__detail{margin-top:var(--space-2);font-size:var(--text-caption)}',
      '.ac-rung__t{font-size:var(--text-caption);display:flex;flex-direction:column;gap:4px;align-items:flex-end;text-align:right}',
      '@media (max-width:760px){.ac-rung__t{align-items:flex-start;text-align:left}}',
      '.ac-rung__ms{font:var(--weight-semibold) var(--text-body)/1.2 var(--font-mono);color:var(--text-primary)}',
      '.ac-rung__bar{width:120px;height:4px;border-radius:var(--radius-full);background:var(--bg-sunken);position:relative;overflow:hidden}',
      '.ac-rung__bar i{position:absolute;left:0;top:0;bottom:0;background:var(--meter-used,var(--chart-series-primary));border-radius:var(--radius-full)}',
      '.ac-substeps{list-style:none;margin:var(--space-2) 0 0;padding:0;display:flex;flex-wrap:wrap;gap:6px}',
      '.ac-substeps li{display:inline-flex;align-items:center;gap:4px;height:22px;font-size:var(--text-caption);padding:0 8px;border-radius:var(--radius-sm);border:1px solid var(--border-subtle);background:var(--bg-sunken)}',
      '.ac-strip{display:flex;gap:0;overflow-x:auto;padding:4px 2px 10px;scrollbar-width:thin}',
      '.ac-strip__b{flex:none;width:92px;border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:8px;background:var(--bg-surface);text-decoration:none;color:var(--text-primary);display:flex;flex-direction:column;gap:4px;font-size:var(--text-label)}',
      '.ac-strip__b:hover{background:var(--bg-hover)}',
      '.ac-strip__b.is-refused{border-style:dashed;border-color:var(--border-strong)}',
      '.ac-strip__b.is-escalated{box-shadow:inset 0 3px 0 var(--state-warning)}',
      '.ac-strip__b.is-committed{box-shadow:inset 0 3px 0 var(--state-good)}',
      '.ac-strip__b.is-platform{box-shadow:inset 0 3px 0 var(--state-critical)}',
      '.ac-strip__b.is-broken{border-color:var(--state-critical);border-width:2px}',
      '.ac-strip__b strong{font:var(--weight-semibold) var(--text-caption)/1.2 var(--font-mono)}',
      '.ac-strip__l{flex:none;width:14px;align-self:center;height:2px;background:var(--border-strong)}',
      '.ac-strip__l.is-broken{background:repeating-linear-gradient(90deg,var(--state-critical) 0 3px,transparent 3px 6px)}',
      '.ac-map{border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);overflow:hidden;box-shadow:var(--shadow-1)}',
      '.ac-map__bar{display:flex;justify-content:space-between;align-items:center;gap:var(--space-3);flex-wrap:wrap;min-height:48px;padding:8px var(--pane-padding);border-bottom:1px solid var(--border-subtle)}',
      '.ac-map__stage{overflow:auto;background-image:radial-gradient(var(--border-subtle) 1px,transparent 1px);background-size:18px 18px}',
      '.ac-map svg{display:block;min-width:900px;width:100%;height:auto}',
      '.ac-map text{font-family:var(--font-ui);fill:var(--text-primary)}',
      '.ac-map .t-s{font-size:11px;fill:var(--text-secondary)}.ac-map .t-m{font-family:var(--font-mono);font-size:10.5px;fill:var(--text-secondary)}',
      '.ac-map .t-h{font-size:13px;font-weight:var(--weight-semibold)}.ac-map .t-z{font-size:10px;font-weight:var(--weight-semibold);letter-spacing:var(--tracking-label);text-transform:uppercase}',
      '.ac-node{cursor:pointer;outline:none}',
      '.ac-node rect.b{stroke-width:1.5;rx:6}',
      '.ac-node:hover rect.b,.ac-node:focus rect.b{stroke-width:2.5}',
      '.ac-node:focus-visible rect.b{stroke:var(--focus-ring);stroke-width:3}',
      '.z-kernel rect.b{fill:var(--zone-kernel-bg);stroke:var(--zone-kernel)}.z-kernel .t-z{fill:var(--zone-kernel)}',
      '.z-consumer rect.b{fill:var(--zone-consumer-bg);stroke:var(--zone-consumer)}.z-consumer .t-z{fill:var(--zone-consumer)}',
      '.z-runtime rect.b{fill:var(--zone-runtime-bg);stroke:var(--zone-runtime)}.z-runtime .t-z{fill:var(--zone-runtime)}',
      '.z-people rect.b{fill:var(--zone-people-bg);stroke:var(--zone-people)}.z-people .t-z{fill:var(--zone-people)}',
      '.z-external rect.b{fill:var(--zone-external-bg);stroke:var(--zone-external)}.z-external .t-z{fill:var(--zone-external)}',
      '.z-refusal rect.b{fill:var(--zone-refusal-bg);stroke:var(--zone-refusal)}.z-refusal .t-z{fill:var(--zone-refusal)}',
      '.is-l2 rect.b{stroke-dasharray:6 4;fill:var(--bg-surface)}.is-l2 text{opacity:.85}',
      '.ac-map .zone-frame{fill:none;stroke-width:1.5;stroke-dasharray:7 5}',
      '.ac-map .zf-kernel{stroke:var(--zone-kernel)}.ac-map .zf-runtime{stroke:var(--zone-runtime)}.ac-map .zf-external{stroke:var(--zone-external)}',
      '.ac-map .edge{fill:none;stroke:var(--text-tertiary);stroke-width:1.5}',
      '.ac-map .edge-a{stroke:var(--zone-kernel);stroke-width:2}',
      '.ac-map .edge-b{stroke:var(--zone-consumer);stroke-width:2;stroke-dasharray:8 4 2 4}',
      '.ac-map .edge-l2{stroke:var(--zone-kernel);stroke-dasharray:5 4}',
      '.ac-map .seam{stroke:var(--zone-runtime);stroke-width:1.5;stroke-dasharray:10 6}',
      '.ac-map .dot-good{fill:var(--state-good)}.ac-map .dot-warning{fill:var(--state-warning)}.ac-map .dot-neutral{fill:var(--state-neutral)}',
      '.ac-map .lock{fill:var(--bg-surface);stroke:var(--border-strong)}',
      '.ac-legend{display:flex;flex-wrap:wrap;gap:var(--space-2) var(--space-4);padding:10px var(--pane-padding);border-top:1px solid var(--border-subtle);font-size:var(--text-caption);color:var(--text-secondary);background:color-mix(in srgb,var(--bg-sunken) 45%,var(--bg-surface))}',
      '.ac-legend span{display:inline-flex;align-items:center;gap:6px}',
      '.ac-legend i{display:inline-block;width:14px;height:10px;border-radius:2px;border:1.5px solid}',
      '.ac-legend i.l{height:0;border-width:1px 0 0;width:22px}',
      '.ac-planes{display:flex;flex-direction:column;gap:6px}',
      '.ac-plane{display:grid;grid-template-columns:56px minmax(0,1.2fr) minmax(0,1fr) 150px;gap:var(--space-3);align-items:center;padding:10px 12px;border-radius:var(--radius-sm);border:1.5px solid var(--z);background:var(--zb);cursor:pointer;text-align:left;font:inherit;color:var(--text-primary);width:100%}',
      '.ac-plane:hover,.ac-plane:focus-visible{box-shadow:0 0 0 2px var(--z)}',
      '.ac-plane.is-hl{box-shadow:0 0 0 3px var(--focus-ring)}',
      '@media (max-width:760px){.ac-plane{grid-template-columns:48px minmax(0,1fr)}.ac-plane>:nth-child(n+3){grid-column:2}}',
      '.ac-plane b{font-family:var(--font-mono)}',
      '.ac-rule{display:flex;gap:10px;align-items:flex-start;padding:8px 10px;border-radius:var(--radius-sm);cursor:pointer;border:1px solid transparent;background:none;font:inherit;text-align:left;color:var(--text-primary);width:100%}',
      '.ac-rule:hover,.ac-rule:focus-visible,.ac-rule.is-on{border-color:var(--border-default);background:var(--bg-hover)}',
      '.ac-rule .e1-mono{flex:none;width:22px;height:22px;border-radius:var(--radius-sm);display:grid;place-items:center;border:1px solid var(--border-strong);font-size:var(--text-label)}',
      '.ac-ladder3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--space-3)}',
      '@media (max-width:980px){.ac-ladder3{grid-template-columns:minmax(0,1fr)}}',
      '.ac-lv{border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);box-shadow:var(--shadow-1);padding:var(--space-4) var(--pane-padding);display:flex;flex-direction:column;gap:var(--space-3)}',
      '.ac-lv.is-current{border-color:var(--border-accent);box-shadow:inset 0 3px 0 var(--border-accent),var(--shadow-1)}',
      '.ac-lv.is-spec{border-style:dashed}',
      '.ac-lv h3{margin:0;font:var(--weight-title) 16px/1.3 var(--font-display);letter-spacing:-.01em}',
      '.ac-lv ul{margin:0;padding-left:18px;font-size:var(--text-caption);line-height:var(--lh-caption);display:flex;flex-direction:column;gap:4px;color:var(--text-secondary)}',
      '.ac-matrix td,.ac-matrix th{white-space:nowrap}',
      '.ac-cell{display:inline-flex;align-items:center;gap:4px;height:20px;font-size:var(--text-caption);padding:0 7px;border-radius:var(--radius-sm);border:1px solid var(--border-default);background:var(--bg-surface)}',
      '.ac-cell--enf{border-color:var(--state-good-border);background:var(--state-good-bg)}',
      '.ac-cell--adv{border-color:var(--state-info-border);background:var(--state-info-bg);border-style:dashed}',
      '.ac-cell--appr{border-color:var(--border-default)}',
      '.ac-region{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:var(--space-5);align-items:start}',
      '@media (max-width:980px){.ac-region{grid-template-columns:minmax(0,1fr)}}',
      '.ac-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:0;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);overflow:hidden;box-shadow:var(--shadow-1)}',
      '.ac-kpis>*{padding:10px 14px;border-right:1px solid var(--border-subtle);border-bottom:1px solid var(--border-subtle);margin-bottom:-1px;text-decoration:none;color:inherit;display:flex;flex-direction:column;gap:3px;min-width:0}',
      '.ac-kpis>*:last-child{border-right:0}',
      'a.ac-kpi:hover{background:var(--bg-hover)}',
      '.ac-kpi .e1-label{color:var(--text-tertiary)}',
      '.ac-kpi__v{font:var(--weight-title) 20px/1.25 var(--font-display);letter-spacing:var(--tracking-title);font-variant-numeric:tabular-nums;overflow-wrap:anywhere}',
      '.ac-kpi__v--sm{font-size:var(--text-lead);line-height:1.3}',
      '.ac-big--sm{font-size:20px;line-height:26px}',
      '.ac-kpi__n{font-size:var(--text-caption);line-height:var(--lh-caption);color:var(--text-secondary)}',
      '.ac-pipe{display:flex;gap:0;flex-wrap:wrap;align-items:stretch}',
      '.ac-pipe>div{flex:1;min-width:130px;padding:10px 14px;border:1px solid var(--border-subtle);background:var(--bg-surface);font-size:var(--text-caption);color:var(--text-secondary);display:flex;flex-direction:column;gap:3px}',
      '.ac-pipe>div+div{border-left:0}',
      '.ac-pipe>div:first-child{border-radius:var(--radius-md) 0 0 var(--radius-md)}.ac-pipe>div:last-child{border-radius:0 var(--radius-md) var(--radius-md) 0}',
      '.ac-pipe b{font:var(--weight-title) 17px/1.25 var(--font-display);color:var(--text-primary);font-variant-numeric:tabular-nums}',
      '@media (max-width:760px){.ac-pipe>div{min-width:45%}.ac-pipe>div+div{border-left:1px solid var(--border-subtle)}.ac-pipe>div{border-radius:var(--radius-sm)!important}}',
      '.ac-invoice{border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);box-shadow:var(--shadow-1);padding:var(--space-5) var(--space-6);display:flex;flex-direction:column;gap:var(--space-5)}',
      '@media (max-width:720px){.ac-invoice{padding:var(--space-4)}}',
      '.ac-invoice__head{display:flex;justify-content:space-between;gap:var(--space-4);flex-wrap:wrap}',
      '.ac-inv-total td,.ac-inv-total th{font-weight:var(--weight-semibold);border-top:2px solid var(--border-strong)}',
      '.ac-inv-refused th,.ac-inv-refused td{background:var(--bg-sunken)}',
      '.ac-check{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}',
      '.ac-check li{display:grid;grid-template-columns:40px minmax(0,1fr) auto;gap:var(--space-3);padding:var(--space-3) 0;border-top:1px solid var(--border-subtle);align-items:start}',
      '.ac-check li:first-child{border-top:0}',
      '.ac-check .e1-mono{color:var(--text-tertiary);font-size:var(--text-caption);padding-top:2px}',
      '.ac-check p{margin:2px 0 0;font-size:var(--text-caption);line-height:var(--lh-caption);color:var(--text-secondary)}',
      '@media (max-width:760px){.ac-check li{grid-template-columns:32px minmax(0,1fr)}.ac-check li>:last-child{grid-column:2}}',
      '.ac-dl-inline{display:flex;flex-wrap:wrap;gap:var(--space-2) var(--space-5);font-size:var(--text-caption)}',
      '.ac-dl-inline>div{display:flex;flex-direction:column;gap:2px}',
      '.ac-dl-inline dt{font-size:var(--text-label);letter-spacing:var(--tracking-label);text-transform:uppercase;color:var(--text-tertiary);font-weight:var(--weight-semibold)}',
      '.ac-dl-inline dd{margin:0;font-family:var(--font-mono)}',
      '.ac-feed{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}',
      '.ac-feed li{display:grid;grid-template-columns:28px minmax(0,1fr) auto;gap:var(--space-3);padding:var(--space-3) 0;border-top:1px solid var(--border-subtle);align-items:start;font-size:var(--text-body)}',
      '.ac-feed li:first-child{border-top:0}',
      '.ac-feed__i{width:28px;height:28px;border-radius:var(--radius-sm);display:grid;place-items:center;background:var(--bg-sunken);border:1px solid var(--border-subtle);color:var(--text-secondary)}',
      '.ac-feed p{margin:2px 0 0;font-size:var(--text-caption);line-height:var(--lh-caption);color:var(--text-secondary)}',
      '.ac-banner{display:flex;gap:var(--space-3);align-items:flex-start;padding:var(--space-3) var(--space-4);border-radius:var(--radius-md);border:1px solid var(--state-critical-border);background:var(--state-critical-bg)}',
      '.ac-banner--info{border-color:var(--state-info-border);background:var(--state-info-bg)}',
      '.ac-banner--neutral{border-color:var(--state-neutral-border);background:var(--state-neutral-bg)}',
      '.ac-banner--warning{border-color:var(--state-warning-border);background:var(--state-warning-bg)}',
      '.ac-banner p{margin:2px 0 0;font-size:var(--text-caption);line-height:var(--lh-caption);color:var(--text-secondary)}',
      '.ac-banner strong{font-size:var(--text-body);font-weight:var(--weight-semibold)}',
      '.ac-details summary{cursor:pointer;font-weight:var(--weight-semibold);padding:var(--space-2) 0;list-style:none;display:flex;align-items:center;gap:6px}',
      '.ac-details summary::-webkit-details-marker{display:none}',
      '.ac-details[open] summary .ac-chev{transform:rotate(90deg)}',
      '.ac-chev{transition:transform var(--dur-fast)}',
      '.ac-form{display:grid;grid-template-columns:repeat(3,minmax(0,1fr)) auto;gap:var(--space-3);align-items:end}',
      '@media (max-width:760px){.ac-form{grid-template-columns:minmax(0,1fr)}}',
      '.ac-hl-row th,.ac-hl-row td{background:var(--bg-selected)}',
      '.ac-nowrap{white-space:nowrap}',
      '.ac-muted-note{font-size:var(--text-caption);line-height:var(--lh-caption);color:var(--text-secondary);margin:0}',
      '.ac-totalrow{font-weight:var(--weight-semibold);padding:10px 12px;border:1px solid var(--border-subtle);border-top:0;border-radius:0 0 var(--radius-md) var(--radius-md);background:var(--bg-sunken)}',
      '.ac-total{flex-wrap:wrap}.ac-total>span:last-child{white-space:normal}',
      '@media (max-width:760px){.ac-line{flex-wrap:wrap}.ac-line>span:last-child{white-space:normal}}'
    ].join('\n');
    var st = document.createElement('style'); st.id = 'ac-styles'; st.textContent = css; document.head.appendChild(st);
  })();

  /* ------------------------------------------------------------------------
     Data — E1.data.assurance (canonical: spec-phase1-console §4)
     ------------------------------------------------------------------------ */
  var WT = {
    'erp.sales_invoice.submit': { label: 'Submit invoice', radius: 2, rev: '24 h', decl: 'erp.ar', v: 7, pol: 11, ch: ['web', 'mcp', 'mobile', 'messaging'], gates: ['consent', 'residency', 'retention', 'counterparty', 'precondition', 'dual_control', 'budget'] },
    'erp.sales_invoice.cancel': { label: 'Cancel invoice', radius: 2, rev: false, decl: 'erp.ar', v: 7, pol: 11, ch: ['web', 'voice'], gates: ['consent', 'residency', 'retention', 'counterparty', 'precondition', 'dual_control'] },
    'erp.payment_entry.submit': { label: 'Record payment', radius: 2, rev: 720, decl: 'erp.ar', v: 7, pol: 11, ch: ['web', 'api'], gates: ['consent', 'residency', 'retention', 'counterparty', 'precondition'] },
    'erp.purchase_order.submit': { label: 'Submit purchase order', radius: 2, rev: 720, decl: 'erp.ap', v: 5, pol: 9, ch: ['web', 'api'], gates: ['consent', 'residency', 'retention', 'counterparty', 'precondition', 'dual_control', 'budget'] },
    'erp.purchase_invoice.submit': { label: 'Book supplier bill', radius: 2, rev: 720, decl: 'erp.ap', v: 5, pol: 9, ch: ['web', 'api', 'mcp'], gates: ['consent', 'residency', 'retention', 'counterparty', 'precondition', 'dual_control'] },
    'erp.purchase_receipt.submit': { label: 'Record goods receipt', radius: 2, rev: 720, decl: 'erp.ap', v: 5, pol: 9, ch: ['web', 'api'], gates: ['consent', 'residency', 'retention', 'counterparty', 'precondition'] },
    'erp.credit_note.submit': { label: 'Raise credit note', radius: 2, rev: 720, decl: 'erp.ar', v: 7, pol: 11, ch: ['web'], gates: ['consent', 'residency', 'retention', 'counterparty', 'precondition', 'dual_control'] },
    'erp.credit_limit.change': { label: 'Change credit limit', radius: 2, rev: 720, decl: 'erp.ar', v: 7, pol: 11, ch: ['web'], gates: ['consent', 'residency', 'retention', 'counterparty', 'precondition', 'dual_control'] },
    'erp.customer.create': { label: 'Add customer', radius: 1, rev: 720, decl: 'erp.ar', v: 7, pol: 11, ch: ['web', 'api'], gates: ['consent', 'residency', 'retention', 'counterparty', 'precondition'] },
    'erp.customer.update': { label: 'Update customer', radius: 1, rev: 720, decl: 'erp.ar', v: 7, pol: 11, ch: ['web', 'api'], gates: ['consent', 'residency', 'retention', 'counterparty', 'precondition'] },
    'erp.supplier.create': { label: 'Add supplier', radius: 1, rev: 720, decl: 'erp.ap', v: 5, pol: 9, ch: ['web', 'api', 'mcp'], gates: ['consent', 'residency', 'retention', 'counterparty', 'precondition'] },
    'erp.journal_entry.submit': { label: 'Post journal entry', radius: 1, rev: 720, decl: 'erp.ar', v: 7, pol: 11, ch: ['web'], gates: ['consent', 'residency', 'retention', 'counterparty', 'precondition', 'dual_control', 'schedule'] },
    'erp.stock_entry.submit': { label: 'Move stock', radius: 1, rev: 720, decl: 'erp.stock', v: 3, pol: 4, ch: ['web', 'api', 'mobile', 'messaging'], gates: ['consent', 'residency', 'retention', 'counterparty', 'precondition', 'rate'] },
    'erp.delivery_note.submit': { label: 'Submit delivery note', radius: 1, rev: 720, decl: 'erp.stock', v: 3, pol: 4, ch: ['web', 'api'], gates: ['consent', 'residency', 'retention', 'counterparty', 'precondition'] },
    'erp.price_list.update': { label: 'Update price list', radius: 3, rev: 168, decl: 'erp.ar', v: 7, pol: 11, ch: ['web'], gates: ['consent', 'residency', 'retention', 'counterparty', 'precondition', 'dual_control', 'rate'] },
    'erp.payment_run.submit': { label: 'Release supplier payment run', radius: 3, rev: false, decl: 'erp.ap', v: 5, pol: 9, ch: ['web', 'voice'], gates: ['consent', 'residency', 'retention', 'counterparty', 'precondition', 'dual_control', 'budget', 'schedule'] },
    'erp.period.close': { label: 'Close accounting period', radius: 4, rev: 72, decl: 'erp.ar', v: 7, pol: 11, ch: ['web'], gates: ['consent', 'residency', 'retention', 'counterparty', 'precondition', 'dual_control'] },
    'erp.gstr1.file': { label: 'File GSTR-1', radius: 5, rev: false, decl: 'erp.ar', v: 7, pol: 11, ch: ['web'], gates: ['consent', 'residency', 'retention', 'counterparty', 'precondition', 'dual_control', 'schedule'] },
    'platform.declaration.certify': { label: 'Certify declaration version', radius: 4, rev: false, decl: 'platform', v: 3, pol: 3, ch: ['web'], gates: ['residency', 'dual_control'] },
    'platform.tenant.stop': { label: 'Stop tenant', radius: 4, rev: 'lift stop', decl: 'platform', v: 3, pol: 3, ch: ['web'], gates: ['residency', 'dual_control'] },
    'platform.autonomy.grant': { label: 'Change autonomy grant', radius: 1, rev: 720, decl: 'platform', v: 3, pol: 3, ch: ['web'], gates: ['residency', 'dual_control'] },
    'platform.obligation.resolve': { label: 'Approve or reject', radius: 1, rev: null, decl: 'platform', v: 3, pol: 3, ch: ['web', 'mobile', 'messaging', 'voice'], gates: ['residency', 'dual_control'] },
    'platform.breakglass': { label: 'Break-glass', radius: 4, rev: null, decl: 'platform', v: 3, pol: 3, ch: ['web'], gates: ['residency', 'dual_control'] }
  };
  var WT_NAMES = Object.keys(WT);
  var BASIS = { 1: 'per record', 2: 'per counterparty', 3: 'per batch', 4: 'per tenant', 5: 'per crossing' };
  function wt(name) { return WT[name] || { label: name, radius: 1, rev: 720, decl: 'erp.ar', v: 7, pol: 11, ch: ['web'], gates: ['consent', 'residency', 'retention', 'counterparty', 'precondition'] }; }
  function wtCell(name) { return '<span class="ac-wt"><span>' + esc(wt(name).label) + '</span><small>' + esc(name) + '</small></span>'; }
  var GATE_ID = { consent: 'G1', residency: 'G2', retention: 'G3', dual_control: 'G4', rate: 'G5', budget: 'G6', counterparty: 'G7', schedule: 'G8', precondition: 'G9' };
  var GATE_NAME = { consent: 'Consent', residency: 'Residency (Mumbai)', retention: 'Retention', dual_control: 'Dual control', rate: 'Rate', budget: 'Budget', counterparty: 'Counterparty', schedule: 'Schedule', precondition: 'Precondition' };

  /* Canonical digests (head…tail) from §4.6; the middle is filled deterministically so every full digest is stable. */
  var DIG = { 4089: ['71e0', 'c2d9'], 4090: ['a3f9', '5e2b'], 4091: ['0c7d', '91fa'], 4092: ['5b12', 'e804'], 4093: ['e9aa', '1370'], 4094: ['2f64', 'a0cb'], 4095: ['8d3e', '77c1'], 4096: ['c150', '4b9e'], 4097: ['64ab', 'd2f0'], 4098: ['1e9c', '83a5'], 4099: ['b7f2', '0e61'], 4100: ['4c08', 'f93d'], 4101: ['9a51', '2c7e'], 4102: ['d6e3', '1b48'], 4103: ['7702', 'ae19'], 4104: ['3fb0', '6c55'], 4105: ['e18d', '09b2'], 4106: ['5a7c', 'd3e0'], 4107: ['0bd4', '71f8'], 4108: ['c9e1', '4a02'], 4109: ['62f7', 'b8d9'], 4110: ['18ac', 'e57d'], 4111: ['f04b', '2d96'], 4112: ['a8e2', '07c3'] };
  function digest(seq) {
    if (seq <= 0) return ZERO_DIGEST;
    var d = DIG[seq];
    return d ? d[0] + hex(seq * 7919, 56) + d[1] : hex(seq * 104729 + 17, 64);
  }

  var HEAD = 4112;
  var CANON = [
    { seq: 4090, t: '10:02', wt: 'erp.supplier.create', actor: 'Priya Nair', kind: 'person', aut: 'A3', out: 'committed', object: 'Coimbatore Castings Pvt Ltd (33AAECC9120B1Z4)', objId: 'SUP-2026-00188', ch: 'web',
      fields: [['supplier_name', 'Coimbatore Castings Pvt Ltd', 'internal'], ['gstin', '33AAECC9120B1Z4', 'internal'], ['supplier_group', 'Castings', 'internal'], ['payment_terms', '45 days', 'financial']] },
    { seq: 4091, t: '10:19', wt: 'erp.purchase_invoice.submit', actor: 'ap-agent', kind: 'agent', aut: 'A3', out: 'committed', object: 'ACC-PINV-2026-00541 · ₹1,86,440', objId: 'ACC-PINV-2026-00541', amount: 186440, ch: 'api',
      fields: [['supplier', 'Coimbatore Castings Pvt Ltd', 'internal'], ['bill_no', 'CC/26-27/1182', 'financial'], ['grand_total', '186440.00', 'financial'], ['purchase_order', 'PO-2026-00309', 'internal'], ['purchase_receipt', 'MAT-PRE-2026-00417', 'internal']] },
    { seq: 4092, t: '10:44', wt: 'erp.sales_invoice.submit', actor: 'Invoice Agent', kind: 'agent', aut: 'A1', out: 'refused', code: 'GATE.COUNTERPARTY_UNKNOWN', gate: 'counterparty', rung: 3, object: 'Shree Ganesh Handlooms (unregistered)', ch: 'web',
      words: 'Shree Ganesh Handlooms is not a registered customer with a validated GSTIN.',
      fields: [['customer', 'Shree Ganesh Handlooms', 'internal'], ['posting_date', '2026-09-24', 'internal'], ['grand_total', '64200.00', 'financial']] },
    { seq: 4093, t: '11:03', wt: 'erp.purchase_order.submit', actor: 'ap-agent', kind: 'agent', aut: 'A2', out: 'escalated', obl: 'OB-2026-0409', rung: 6, note: 'Dual control above ₹5 lakh', object: 'PO-2026-00318 · ₹6,20,000', amount: 620000, ch: 'api',
      fields: [['supplier', 'Coimbatore Castings Pvt Ltd', 'internal'], ['grand_total', '620000.00', 'financial'], ['schedule_date', '2026-10-06', 'internal']] },
    { seq: 4094, t: '11:21', wt: 'platform.obligation.resolve', actor: 'Venkat Raman', kind: 'person', aut: null, out: 'committed', decision: 'approve', obl: 'OB-2026-0409', note: 'Resolves OB-2026-0409 (approve)', object: 'OB-2026-0409', ch: 'web' },
    { seq: 4095, t: '11:21', wt: 'erp.purchase_order.submit', actor: 'ap-agent', kind: 'agent', aut: 'A2', out: 'committed', obl: 'OB-2026-0409', note: 'Resubmission, obligation_ref OB-2026-0409', object: 'PO-2026-00318 · ₹6,20,000', objId: 'PO-2026-00318', amount: 620000, ch: 'api',
      fields: [['supplier', 'Coimbatore Castings Pvt Ltd', 'internal'], ['grand_total', '620000.00', 'financial'], ['schedule_date', '2026-10-06', 'internal']] },
    { seq: 4096, t: '11:40', wt: 'platform.obligation.resolve', actor: 'Ravi Shankar', kind: 'person', aut: null, out: 'refused', code: 'GATE.DUAL_CONTROL_SAME_ACTOR', gate: 'dual_control', rung: 3, obl: 'OB-2026-0418', object: 'OB-2026-0418', ch: 'web',
      words: 'Ravi Shankar proposed CN-2026-00077, so he cannot also approve it. Send it to Venkat Raman or Meenakshi Iyer.' },
    { seq: 4097, t: '11:42', wt: 'erp.payment_entry.submit', actor: 'Rekha Subramanian', kind: 'person', aut: 'A4', out: 'committed', note: 'Undo until 24 Oct 2026, 11:42', object: 'PE-2026-00972 · ACME Textiles · ₹1,12,500', objId: 'PE-2026-00972', amount: 112500, ch: 'web',
      fields: [['party', 'ACME Textiles', 'internal'], ['paid_amount', '112500.00', 'financial'], ['posting_date', '2026-09-24', 'internal'], ['reference_no', 'UTR 426801', 'financial'], ['mode_of_payment', 'NEFT', 'internal']] },
    { seq: 4098, t: '14:07', wt: 'erp.sales_invoice.submit', actor: 'ar-agent', kind: 'agent', aut: 'A3', out: 'refused', code: 'GATE.PRECONDITION_FAILED', gate: 'precondition', rung: 3, object: 'ACME Textiles · ₹4,20,000', amount: 420000, ch: 'web',
      words: 'An invoice may not take a customer above their credit limit. Limit ₹3,00,000 · exposure after this invoice ₹4,20,000.',
      fields: [['customer', 'ACME Textiles', 'internal'], ['posting_date', '2026-09-24', 'internal'], ['grand_total', '420000.00', 'financial'], ['items[0].item_code', 'YARN-40S', 'internal'], ['items[0].qty', '1400', 'internal'], ['items[0].rate', '300.00', 'financial']] },
    { seq: 4099, t: '14:16', wt: 'erp.sales_invoice.submit', actor: 'ar-agent', kind: 'agent', aut: 'A2', out: 'escalated', obl: 'OB-2026-0412', rung: 6, note: 'A2 Propose — a person approves before rung 7', object: 'SINV-2026-01187 · ACME Textiles · ₹2,40,000', amount: 240000, ch: 'web',
      fields: [['customer', 'ACME Textiles', 'internal'], ['posting_date', '2026-09-24', 'internal'], ['grand_total', '240000.00', 'financial'], ['items[0].item_code', 'YARN-40S', 'internal'], ['items[0].qty', '800', 'internal'], ['items[0].rate', '300.00', 'financial']] },
    { seq: 4100, t: '15:02', wt: 'platform.obligation.resolve', actor: 'Venkat Raman', kind: 'person', aut: null, out: 'committed', decision: 'approve', obl: 'OB-2026-0412', note: 'Resolves OB-2026-0412 (approve)', object: 'OB-2026-0412', ch: 'web' },
    { seq: 4101, t: '15:02', wt: 'erp.sales_invoice.submit', actor: 'ar-agent', kind: 'agent', aut: 'A2', out: 'committed', obl: 'OB-2026-0412', approver: 'Venkat Raman', note: 'IRN requested; undo until 25 Sep 15:02 (IRN), 24 Oct (credit note)', object: 'SINV-2026-01187 · ACME Textiles · ₹2,40,000', objId: 'SINV-2026-01187', amount: 240000, ch: 'web',
      fields: [['customer', 'ACME Textiles', 'internal'], ['posting_date', '2026-09-24', 'internal'], ['grand_total', '240000.00', 'financial'], ['items[0].item_code', 'YARN-40S', 'internal'], ['items[0].qty', '800', 'internal'], ['items[0].rate', '300.00', 'financial']] },
    { seq: 4102, t: '15:10', wt: 'erp.payment_entry.submit', actor: 'bank-recon-agent', kind: 'agent', aut: 'A3', out: 'refused', code: 'PLATFORM.TARGET_UNREACHABLE', rung: 7, note: 'Paged · INC-0421', object: 'UTR 426817 · ₹75,000', amount: 75000, ch: 'api',
      fields: [['party', 'Shree Murugan Traders', 'internal'], ['paid_amount', '75000.00', 'financial'], ['reference_no', 'UTR 426817', 'financial']] },
    { seq: 4103, t: '15:12', wt: 'erp.sales_invoice.cancel', actor: 'Collections Agent', kind: 'agent', aut: 'A2', out: 'escalated', obl: 'OB-2026-0413', rung: 6, note: 'Irreversible — cannot be auto-approved', object: 'INV-2026-0834 · ₹2,00,000', amount: 200000, ch: 'web',
      fields: [['sales_invoice', 'INV-2026-0834', 'internal'], ['reason', 'Duplicate billing against DN-2026-0551', 'internal']] },
    { seq: 4104, t: '15:19', wt: 'platform.obligation.resolve', actor: 'Ravi Shankar', kind: 'person', aut: null, out: 'committed', decision: 'approve', obl: 'OB-2026-0413', note: 'Approved by voice · recording ref VR-2026-09-24-0192', object: 'OB-2026-0413', ch: 'voice' },
    { seq: 4105, t: '15:19', wt: 'erp.sales_invoice.cancel', actor: 'Collections Agent', kind: 'agent', aut: 'A2', out: 'committed', obl: 'OB-2026-0413', approver: 'Ravi Shankar', note: 'Irreversible', object: 'INV-2026-0834', objId: 'INV-2026-0834', amount: 200000, ch: 'web',
      fields: [['sales_invoice', 'INV-2026-0834', 'internal'], ['reason', 'Duplicate billing against DN-2026-0551', 'internal']] },
    { seq: 4106, t: '15:21', wt: 'erp.supplier.create', actor: 'vendor-onboarding agent', kind: 'agent', aut: 'A0', out: 'refused', code: 'POLICY.AUTONOMY_INSUFFICIENT', rung: 6, object: 'Palani Dyes & Chemicals', ch: 'mcp',
      words: 'vendor-onboarding agent has no grant for Add supplier, so it is at A0 Observe (no grant). Add supplier needs A2 Propose.',
      fields: [['supplier_name', 'Palani Dyes & Chemicals', 'internal'], ['gstin', '33AAHFP2210L1Z6', 'internal']] },
    { seq: 4107, t: '15:22', wt: 'erp.credit_limit.change', actor: 'Rekha Subramanian', kind: 'person', aut: 'A2', out: 'escalated', obl: 'OB-2026-0414', rung: 6, object: 'ACME Textiles · ₹3,00,000 → ₹5,00,000', ch: 'web',
      fields: [['customer', 'ACME Textiles', 'internal'], ['credit_limit', '500000.00', 'financial']] },
    { seq: 4108, t: '15:24', wt: 'erp.sales_invoice.submit', actor: 'rung1 drafting agent', kind: 'agent', aut: 'A2', out: 'refused', code: 'GATE.BUDGET_EXHAUSTED', gate: 'budget', rung: 3, object: 'Lakshmi Garments', ch: 'web',
      words: 'rung1 drafting agent has used 250 of 250 drafts declared for September.',
      fields: [['customer', 'Lakshmi Garments', 'internal'], ['grand_total', '38400.00', 'financial']] },
    { seq: 4109, t: '15:25', wt: 'platform.obligation.resolve', actor: 'Venkat Raman', kind: 'person', aut: null, out: 'committed', decision: 'reject', obl: 'OB-2026-0410', note: 'Rejected: “Margin on 40s combed falls below 6%; recheck with sales before changing.” The original write is told POLICY.APPROVAL_DECLINED.', object: 'Price list update · OB-2026-0410', ch: 'web' },
    { seq: 4110, t: '15:26', wt: 'erp.journal_entry.submit', actor: 'close-agent', kind: 'agent', aut: 'A1', out: 'refused', code: 'POLICY.OBLIGATION_EXPIRED', rung: 6, obl: 'OB-2026-0405', object: 'JV provision', ch: 'web',
      words: 'OB-2026-0405 lapsed at 15:26 with nobody deciding. Expiry is itself a recorded governed event.',
      fields: [['user_remark', 'Freight provision Aug', 'internal'], ['total_debit', '135000.00', 'financial']] },
    { seq: 4111, t: '15:27', wt: 'erp.payment_run.submit', actor: 'ap-agent', kind: 'agent', aut: 'A2', out: 'escalated', obl: 'OB-2026-0411', rung: 6, note: 'Needs Ravi Shankar and Meenakshi Iyer', object: '14 suppliers · ₹18,42,760', amount: 1842760, ch: 'web',
      fields: [['suppliers', '14', 'internal'], ['total', '1842760.00', 'financial'], ['bank_account', 'HDFC ··· 4471', 'financial']] },
    { seq: 4112, t: '15:28', wt: 'erp.stock_entry.submit', actor: 'stock-agent', kind: 'agent', aut: 'A4', out: 'refused', code: 'GATE.SANDBOX_DIVERGED', rung: 7, gate: 'precondition', object: 'STE-2026-02214 · 1,200 kg cotton', ch: 'api',
      words: 'The check on your live books disagreed with the shadow sandbox: Mill 2 bin C-14 held 1,180 kg, not 1,200 kg. Snapshot restored.',
      fields: [['stock_entry_type', 'Material Transfer', 'internal'], ['items[0].item_code', 'COTTON-SHANKAR6', 'internal'], ['items[0].qty', '1200', 'internal'], ['from_warehouse', 'Mill 1 Stores', 'internal'], ['to_warehouse', 'Mill 2 Stores', 'internal']] }
  ];
  var CANON_BY = {}; CANON.forEach(function (e) { CANON_BY[e.seq] = e; });

  /* Actors per write type for synthesised entries (older than #4,090) */
  var SYN_ACTORS = {
    'erp.sales_invoice.submit': [['ar-agent', 'agent', 'A2'], ['Invoice Agent', 'agent', 'A1'], ['Rekha Subramanian', 'person', 'A2']],
    'erp.payment_entry.submit': [['bank-recon-agent', 'agent', 'A3'], ['Rekha Subramanian', 'person', 'A4']],
    'erp.purchase_invoice.submit': [['ap-agent', 'agent', 'A3']],
    'erp.purchase_order.submit': [['ap-agent', 'agent', 'A2']],
    'erp.stock_entry.submit': [['stock-agent', 'agent', 'A4'], ['Priya Nair', 'person', 'A3']],
    'erp.supplier.create': [['Priya Nair', 'person', 'A3']],
    'erp.customer.create': [['Rekha Subramanian', 'person', 'A3']],
    'platform.obligation.resolve': [['Venkat Raman', 'person', null], ['Ravi Shankar', 'person', null], ['Meenakshi Iyer', 'person', null]],
    'erp.journal_entry.submit': [['Priya Nair', 'person', 'A2'], ['close-agent', 'agent', 'A1']],
    'erp.credit_note.submit': [['Ravi Shankar', 'person', 'A2']]
  };
  var SYN_WT = [['erp.sales_invoice.submit', 30], ['erp.payment_entry.submit', 22], ['erp.stock_entry.submit', 17], ['erp.purchase_invoice.submit', 11], ['platform.obligation.resolve', 8], ['erp.purchase_order.submit', 4], ['erp.supplier.create', 2], ['erp.customer.create', 2], ['erp.journal_entry.submit', 2], ['erp.credit_note.submit', 2]];
  var SYN_CODES = [['GATE.PRECONDITION_FAILED', 'precondition', 3, 58], ['GATE.COUNTERPARTY_UNKNOWN', 'counterparty', 3, 21], ['POLICY.AUTONOMY_INSUFFICIENT', null, 6, 17], ['GATE.BUDGET_EXHAUSTED', 'budget', 3, 14], ['GATE.DUAL_CONTROL_SAME_ACTOR', 'dual_control', 3, 12], ['POLICY.APPROVAL_DECLINED', null, 6, 11], ['POLICY.OBLIGATION_EXPIRED', null, 6, 9], ['POLICY.DENIED_BY_RULE', null, 4, 7], ['GATE.SANDBOX_DIVERGED', 'precondition', 7, 6], ['POLICY.CHANNEL_NOT_PERMITTED', null, 2, 5], ['GATE.RATE_EXCEEDED', 'rate', 3, 4], ['GATE.OUTSIDE_SCHEDULE', 'schedule', 3, 3], ['PLATFORM.TARGET_UNREACHABLE', null, 7, 3], ['PLATFORM.LOG_APPEND_FAILED', null, 8, 1]];
  function pickW(r, list, wi) { var tot = list.reduce(function (a, x) { return a + x[wi]; }, 0), v = r() * tot; for (var i = 0; i < list.length; i++) { v -= list[i][wi]; if (v <= 0) return list[i]; } return list[0]; }

  var BASE_T = new Date('2026-09-24T10:02:00+05:30').getTime();
  function synth(seq) {
    var r = rng(seq);
    var w = pickW(r, SYN_WT, 1)[0];
    var acts = SYN_ACTORS[w] || [['ar-agent', 'agent', 'A2']];
    var a = acts[Math.floor(r() * acts.length)];
    var roll = r(), out = 'committed', code = null, gate = null, rung = null, obl = null;
    if (roll > 0.86 && roll <= 0.955) { var cd = pickW(r, SYN_CODES, 3); out = 'refused'; code = cd[0]; gate = cd[1]; rung = cd[2]; }
    else if (roll > 0.955 && w !== 'platform.obligation.resolve') { out = 'escalated'; rung = 6; obl = 'OB-2026-0' + (300 + (seq % 100)); }
    var t = new Date(BASE_T - (4090 - seq) * 9.4 * 60000 - Math.floor(r() * 240) * 1000);
    var amt = /invoice|payment|order/.test(w) ? Math.round((20000 + r() * 380000) / 10) * 10 : null;
    return { seq: seq, at: t.toISOString(), wt: w, actor: a[0], kind: a[1], aut: a[2], out: out, code: code, gate: gate, rung: rung, obl: obl, ch: 'web', amount: amt, synth: true,
      object: amt ? fmt.inr(amt) : null, fields: amt ? [['grand_total', amt.toFixed(2), 'financial'], ['posting_date', t.toISOString().slice(0, 10), 'internal']] : [['record', 'as declared in ' + wt(w).decl, 'internal']] };
  }
  function entry(seq) {
    seq = Number(seq);
    if (!(seq >= 1 && seq <= HEAD) || Math.floor(seq) !== seq) return null;
    var e = CANON_BY[seq] ? Object.assign({}, CANON_BY[seq]) : synth(seq);
    if (!e.at) e.at = iso(24, e.t);
    var w = wt(e.wt);
    e.decl = w.decl; e.v = w.v; e.pol = (e.out === 'refused' && e.rung && e.rung < 4) ? 0 : w.pol; e.label = w.label; e.radius = w.radius;
    e.basis = BASIS[w.radius];
    e.qty = e.out === 'committed' ? 1 : 0;
    e.digest = digest(seq); e.prev = digest(seq - 1);
    e.writeId = uuid(seq * 31 + 7); e.recordId = e.out === 'committed' && !/^platform\./.test(e.wt) ? uuid(seq * 53 + 11) : (e.out === 'committed' ? uuid(seq * 53 + 11) : ZERO_UUID);
    e.recordVersion = e.out === 'committed' ? 1 : 0;
    e.mode = 'live'; e.enf = e.ch === 'mcp' ? 'Enforced · token acceptance' : 'Enforced · credential custody';
    e.platform = /^PLATFORM\./.test(e.code || '');
    return e;
  }
  function range(from, to) { var out = []; for (var s = to; s >= from; s--) { var e = entry(s); if (e) out.push(e); } return out; }

  /* Refusal register (§1.7; closed register, E02 §06). active: 'L1' | 'define' | 'proposed' | 'L3' */
  var REG = [
    ['POLICY.TENANT_STOPPED', 'policy', '0b', null, 'Not done — this workspace is stopped', 'The tenant is stopped', 'Resolve the stop event; it names its cause class', 'View stop event', '#/records/tenants/kaveri-spinning'],
    ['POLICY.ACTOR_NOT_PERMITTED', 'policy', '1', null, 'Not done — not allowed for you', 'permissions does not grant this actor kind this write type', 'Grant it in a new declaration version, or resubmit as a permitted actor', 'Open declaration', '#/records/declarations/erp.ar'],
    ['POLICY.DELEGATION_INVALID', 'policy', '1', null, 'Not done — delegation has lapsed', 'on_behalf_of is not a live delegation', 'Renew the delegation', 'Renew delegation', '#/records/actors'],
    ['POLICY.WRITE_TYPE_UNKNOWN', 'policy', '2', null, 'Not done — this action is not declared', 'Not in write_types at that version', 'Publish a version that declares it', 'Open Studio', '#/records/studio/erp.ar'],
    ['POLICY.CHANNEL_NOT_PERMITTED', 'policy', '2', null, 'Not done — not allowed from this channel', 'channels does not carry this write type', 'Use a permitted channel or declare this one', 'See the channels', '#/agents/channels'],
    ['POLICY.DECLARATION_UNRESOLVED', 'policy', '2', null, 'Not done — declaration version not certified', 'Version absent or uncertified', 'Certify it', 'Go to Certify', '#/records/studio/erp.ar?step=certify'],
    ['POLICY.DENIED_BY_RULE', 'policy', '4', null, 'Not done — a rule does not allow this', 'A named rule denied at policy_version', 'Read the named rule; change the request or the rule', 'Read the rule', '#/records/policies/11'],
    ['POLICY.NO_RULE_MATCHED', 'policy', '4', null, 'Not done — no rule covers this case', 'No rule covers this case', 'Author a rule. Never widen a default', 'Open Studio', '#/records/studio/erp.ar'],
    ['POLICY.BLAST_RADIUS_EXCEEDED', 'policy', '5', null, 'Not done — touches more than declared', 'Wider than declared', 'Narrow the request, or raise the declared radius (which forces dual control)', 'Change declaration', '#/records/studio/erp.ar'],
    ['POLICY.AUTONOMY_INSUFFICIENT', 'policy', '6', null, 'Not done — autonomy too low', 'Grant below what this write type needs', 'Raise the grant — itself a governed write — or route to approval', 'Request a grant change', '#/agents/autonomy'],
    ['POLICY.APPROVAL_DECLINED', 'policy', '6', null, 'Not done — the approver rejected it', 'An approver declined', 'Address the approver’s basis and resubmit', 'Read the reason', '#/work/decide/OB-2026-0410?state=rejected'],
    ['POLICY.OBLIGATION_EXPIRED', 'policy', '6', null, 'Not done — nobody decided in time', 'The escalation expired unresolved', 'Resubmit; expiry is itself a recorded governed event', 'Resubmit', '#/work/requests'],
    ['GATE.CONSENT_MISSING', 'gate', '3', 'G1', 'Not done — no consent on file', 'No consent covers this purpose', 'Capture consent', 'Capture consent', '#/records/systems/erpnext'],
    ['GATE.CONSENT_EXPIRED', 'gate', '3', 'G1', 'Not done — consent has lapsed', 'Consent lapsed', 'Re-capture', 'Re-capture consent', '#/records/systems/erpnext'],
    ['GATE.RESIDENCY_MISMATCH', 'gate', '3', 'G2', 'Not done — data would leave its residency', 'Record’s residency domain ≠ tenant’s', 'Never override. Escalate to the residency runbook', 'Open the residency runbook', '#/assurance/residency'],
    ['GATE.RETENTION_WINDOW_CLOSED', 'gate', '3', 'G3', 'Not done — outside the retention window', 'Record outside its declared retention window', 'Do not write. Check the retention declaration', 'Open the retention declaration', '#/records/declarations/erp.ar'],
    ['GATE.DUAL_CONTROL_PENDING', 'gate', '3', 'G4', 'Waiting — needs a second approver', 'No second approver yet', 'Request approval', 'Request approval', '#/work/approvals'],
    ['GATE.DUAL_CONTROL_SAME_ACTOR', 'gate', '3', 'G4', 'You proposed this, so you cannot also approve it', 'Approver equals requester', 'Find a second named actor', 'Send to a second approver', '#/work/decide/OB-2026-0418?state=same-actor'],
    ['GATE.RATE_EXCEEDED', 'gate', '3', 'G5', 'Not done — above the declared rate', 'Above the declared per-actor rate', 'Wait, or raise the declared rate', 'Change the declared rate', '#/records/studio/erp.stock'],
    ['GATE.BUDGET_EXHAUSTED', 'gate', '3', 'G6', 'Not done — budget used up for this period', 'Above the declared per-period budget', 'Raise the budget; never truncate silently', 'Raise the budget', '#/records/studio/erp.ar'],
    ['GATE.COUNTERPARTY_UNKNOWN', 'gate', '3', 'G7', 'Not done — counterparty not registered', 'Counterparty not registered', 'Register it', 'Register it in ERPNext', '#/records/systems/erpnext'],
    ['GATE.COUNTERPARTY_SANCTIONED', 'gate', '3', 'G7', 'Not done — counterparty is on a sanctions list', 'Counterparty on a sanctions list', 'Never override. Escalate to compliance', 'Escalate to compliance', '#/work/escalations'],
    ['GATE.OUTSIDE_SCHEDULE', 'gate', '3', 'G8', 'Not done — outside the operating window', 'Outside the declared operating window', 'Wait, or change the window', 'Change the window', '#/records/studio/erp.ar'],
    ['GATE.PRECONDITION_FAILED', 'gate', '3', 'G9', 'Not done — credit limit', 'A declared record state does not hold', 'Fix the record state', 'Request a limit change', '#/work/request/erp.credit_limit.change'],
    ['GATE.SANDBOX_DIVERGED', 'gate', '3 (raised at 7)', null, 'Not done — the check on your live books disagreed', 'Live re-run disagreed with the sandbox result', 'Snapshot restored. Investigate before resubmitting', 'View both results', '#/assurance/proof/4112/path'],
    ['PLATFORM.REGISTRY_UNAVAILABLE', 'platform', '2', null, 'Our failure — declaration registry down', 'Registry down', 'Page. Retry with the same intent_id', 'See runtime health', '#/assurance/runtime'],
    ['PLATFORM.POLICY_UNAVAILABLE', 'platform', '4', null, 'Our failure — rule engine down', 'Rule engine down', 'Page. Never fall back to a default allow', 'See runtime health', '#/assurance/runtime'],
    ['PLATFORM.TARGET_UNREACHABLE', 'platform', '7', null, 'Our failure — ERPNext did not answer', 'Target unreachable', 'Page. Nothing was applied', 'Open the incident', '#/assurance/incidents/INC-0421'],
    ['PLATFORM.TOKEN_MINT_FAILED', 'platform', '7', null, 'Our failure — could not open a one-time key', 'Could not mint the short-lived credential', 'Page', 'See runtime health', '#/assurance/runtime'],
    ['PLATFORM.WRITER_LOCK_LOST', 'platform', '7', null, 'Our failure — the write was interrupted', 'Single-writer lock lost', 'Page. Snapshot restored', 'See runtime health', '#/assurance/runtime'],
    ['PLATFORM.LOG_APPEND_FAILED', 'platform', '8', null, 'Our failure — proof not yet written', 'Chain append failed', 'Page. Outbox retries in order', 'See runtime health', '#/assurance/runtime'],
    ['PLATFORM.CHAIN_HEAD_CONFLICT', 'platform', '8', null, 'Our failure — workspace stopped for safety', 'Two chain writers for one tenant', 'P0. Stop the tenant', 'See incidents', '#/assurance/incidents'],
    ['POLICY.DECLARATION_INVALID', 'policy', 'define', null, 'Declaration not accepted', 'Fails the schema or a semantic rule', 'Shows the first failing rule with its block and field', 'Back to Validate', '#/records/studio/erp.ar?step=validate', 'define'],
    ['POLICY.VERSION_NOT_SEQUENTIAL', 'policy', 'define', null, 'Version number out of order', 'Version ≠ last + 1 (“Gaps are a rejection”)', 'Rebase on version N and certify again (proposed wording)', 'Open Studio', '#/records/studio/erp.ar', 'define'],
    ['POLICY.NOT_CERTIFIED', 'policy', 'define', null, 'Not certified yet', 'No named certifier', 'A named person must certify this version (proposed wording)', 'Go to Certify', '#/records/studio/erp.ar?step=certify', 'define'],
    ['PLATFORM.AUTONOMY_UNAVAILABLE', 'platform', '6', null, 'Our failure — autonomy table unavailable', 'Autonomy table unavailable (build recommendation)', 'Page. Refuse; never assume a grant', 'See runtime health', '#/assurance/runtime', 'proposed'],
    ['POLICY.RECEIPT_AUDIENCE_MISMATCH', 'policy', '—', null, 'Not done — this receipt was issued to someone else', 'Receipt audience does not match', 'Return it; do not act on it', 'Action receipts', '#/assurance/receipts', 'L3'],
    ['POLICY.RECEIPT_EXPIRED', 'policy', '—', null, 'Not done — this receipt has expired', 'Receipt past its expiry', 'Ask the issuer for a fresh receipt', 'Action receipts', '#/assurance/receipts', 'L3'],
    ['POLICY.TRUST_ANCHOR_UNKNOWN', 'policy', '—', null, 'Not done — we do not know the issuer’s key', 'Trust anchor unknown', 'Pin the issuer’s fingerprint out of band', 'Counterparties', '#/assurance/counterparties', 'L3'],
    ['POLICY.RECEIPT_UNVERIFIED', 'policy', '—', null, 'Not done — this receipt did not verify', 'Receipt failed verification', 'Stop; this is forensic, not commercial — do not negotiate it over email', 'Action receipts', '#/assurance/receipts', 'L3'],
    ['GATE.RECEIPT_REPLAYED', 'gate', '3', null, 'Not done — this receipt was already used', 'Receipt replayed', 'Do not accept it twice; ask why it was resent', 'Action receipts', '#/assurance/receipts', 'L3'],
    ['POLICY.AUTONOMY_NOT_EARNED', 'policy', '6', null, 'Not done — this autonomy has not been earned', 'Precedent conditions not met', 'Keep the approval route; graduation needs its conditions', 'Graduation', '#/agents/graduation', 'L3']
  ].map(function (r) { return { code: r[0], cls: r[1], rung: r[2], gateId: r[3], title: r[4], means: r[5], action: r[6], button: r[7], href: r[8], active: r[9] || 'L1' }; });
  var REG_BY = {}; REG.forEach(function (r) { REG_BY[r.code] = r; });
  function reg(code) { return REG_BY[code] || { code: code, cls: String(code).split('.')[0].toLowerCase(), rung: '—', title: 'Not done — ' + code, means: 'Not in the published register', action: 'Ask support; this code is not in the closed register', button: 'Refusal register', href: '#/assurance/refusals/register', active: 'unknown' }; }

  /* Refusal counts this period (1–24 Sep) — sums to 171; platform = our failures */
  var REF_COUNTS = [['GATE.PRECONDITION_FAILED', 58], ['GATE.COUNTERPARTY_UNKNOWN', 21], ['POLICY.AUTONOMY_INSUFFICIENT', 17], ['GATE.BUDGET_EXHAUSTED', 14], ['GATE.DUAL_CONTROL_SAME_ACTOR', 12], ['POLICY.APPROVAL_DECLINED', 11], ['POLICY.OBLIGATION_EXPIRED', 9], ['POLICY.DENIED_BY_RULE', 7], ['GATE.SANDBOX_DIVERGED', 6], ['POLICY.CHANNEL_NOT_PERMITTED', 5], ['GATE.RATE_EXCEEDED', 4], ['GATE.OUTSIDE_SCHEDULE', 3], ['PLATFORM.TARGET_UNREACHABLE', 3], ['PLATFORM.LOG_APPEND_FAILED', 1]];
  var REF_BY_CODE = {}; REF_COUNTS.forEach(function (r) { REF_BY_CODE[r[0]] = r[1]; });
  var REF_TOTAL = 171;
  function refClassTotals() { var t = { policy: 0, gate: 0, platform: 0 }; REF_COUNTS.forEach(function (r) { t[reg(r[0]).cls] += r[1]; }); return t; }

  /* Meter (Kaveri, 1–24 Sep 2026) — totals: 3,733 committed · 171 refused · 317 escalated */
  var METER = [
    ['erp.sales_invoice.submit', 1184, 94, 190], ['erp.payment_entry.submit', 906, 14, 0], ['erp.purchase_invoice.submit', 441, 22, 61], ['erp.purchase_order.submit', 118, 6, 34],
    ['erp.stock_entry.submit', 690, 9, 3], ['erp.supplier.create', 15, 7, 0], ['erp.customer.create', 12, 4, 0], ['erp.price_list.update', 4, 0, 4], ['erp.payment_run.submit', 3, 0, 3],
    ['erp.journal_entry.submit', 20, 3, 3], ['erp.credit_limit.change', 9, 0, 11], ['erp.sales_invoice.cancel', 6, 0, 6], ['erp.credit_note.submit', 7, 0, 2], ['platform.obligation.resolve', 318, 12, null]
  ].map(function (r) { return { wt: r[0], committed: r[1], refused: r[2], escalated: r[3], basis: BASIS[wt(r[0]).radius] }; });
  var MT = METER.reduce(function (a, r) { a.committed += r.committed; a.refused += r.refused; a.escalated += r.escalated || 0; return a; }, { committed: 0, refused: 0, escalated: 0 });

  var PLANS = [
    { id: 'L1', name: 'L1 Guarded', floor: 180000, incl: 480000, over: 1.60, status: 'Building · Phase 1' },
    { id: 'L2', name: 'L2 Attested', floor: 600000, incl: 1500000, over: 1.20, status: 'Frozen specification · after the L2 gate (Phase 3)' },
    { id: 'L3', name: 'L3 Proven', floor: 2400000, incl: 4200000, over: 0.90, status: 'Frozen specification · entry is an event (Phase 4)' },
    { id: 'SOV', name: 'Sovereign / on-premises', floor: 12000000, incl: null, over: 0.55, status: 'Per deployment per year' }
  ];

  E1.data.assurance = {
    tenant: 'kaveri-spinning', head: HEAD, writeTypes: WT, canon: CANON, register: REG, refusalCounts: REF_COUNTS, meter: METER, meterTotals: MT, plans: PLANS,
    chain: { standing: 'continuous', from: 1, to: HEAD, scope: '19 of 23 write types', checkedAt: iso(24, '02:10'), worker: 'integrity-walker 1.4.2' },
    entry: entry, range: range
  };

  /* ------------------------------------------------------------------------
     Navigation additions (door: assurance)
     ------------------------------------------------------------------------ */
  E1.navAdd('assurance', { id: 'overview', label: 'Overview', href: '#/assurance', group: 'Evidence', before: 'proof' });
  E1.navAdd('assurance', { id: 'residency', label: 'Residency', href: '#/assurance/residency', group: 'Operations', after: 'incidents' });
  E1.navAdd('assurance', { id: 'security', label: 'Security', href: '#/assurance/security', group: 'Operations', after: 'residency' });
  E1.navAdd('assurance', { id: 'access', label: 'Access log', href: '#/assurance/access', group: 'Operations', after: 'security' });
  E1.navAdd('assurance', { id: 'readiness', label: 'L1 readiness', href: '#/assurance/readiness', group: 'Operations', after: 'access' });
  E1.navAdd('assurance', { id: 'reconciliation', label: 'Reconciliation', href: '#/assurance/reconciliation', group: 'Account', after: 'plan' });

  function route(path, def) { E1.route(path, Object.assign({ layout: 'console', door: 'assurance' }, def)); }

  /* ------------------------------------------------------------------------
     Shared renderers
     ------------------------------------------------------------------------ */
  var KIND_WORD = { person: 'Person', agent: 'Agent', system: 'Platform' };
  function actorHref(name, kind) {
    var agents = { 'ar-agent': 1, 'ap-agent': 1, 'bank-recon-agent': 1, 'stock-agent': 1, 'gst-agent': 1, 'close-agent': 1 };
    if (kind === 'agent') return agents[name] ? '#/agents/agent/' + name : '#/agents/registry';
    var p = (E1.data.people || []).filter(function (x) { return x.name === name; })[0];
    return p ? '#/agents/people/' + p.id : '#/agents/people';
  }
  function actorCell(e, withHref) { return c.actor({ name: e.actor, kind: e.kind, role: e.aut ? e.aut + (e.aut === 'A0' ? ' (no grant)' : '') : null, size: 'sm', href: withHref ? actorHref(e.actor, e.kind) : null }); }
  function whenCell(isoStr) { return '<span class="ac-nowrap">' + esc(fmt.date(isoStr).replace(/ \d{4}$/, '')) + ' · <span class="e1-mono">' + esc(fmt.time(isoStr).replace(' IST', '')) + '</span></span>'; }
  function outcomeOf(e) { return c.outcome(e.platform ? 'platform' : e.out, { code: e.code, subtle: true }); }
  function outcomeWord(e) { return e.platform ? 'Platform failure' : { committed: 'Committed', refused: 'Not done', escalated: 'Waiting on a person' }[e.out]; }
  function meterCell(e) { return e.qty ? '<span class="e1-mono">1</span> <span class="e1-muted">' + esc(e.basis) + '</span>' : '<span class="e1-mono">0</span> ' + c.honesty('₹0'); }
  function chainStanding(o) {
    o = o || {};
    return c.chain(o.entries || [], { standing: o.standing || 'continuous', scope: o.scope || '19 of 23 write types', count: o.count || ('seq 1–' + num(HEAD) + ' · ' + num(HEAD) + ' entries'), breakAt: o.breakAt, checkedAt: o.checkedAt || 'nightly 02:10 IST · head re-walked ' + fmt.rel(E1.ago(2)) });
  }
  function relGroup(e) {
    var groups = [[4093, 4094, 4095], [4099, 4100, 4101], [4103, 4104, 4105]];
    for (var i = 0; i < groups.length; i++) if (groups[i].indexOf(e.seq) >= 0) return groups[i];
    return null;
  }
  var NUMS = {
    4098: [{ label: 'Credit limit', value: '₹3,00,000' }, { label: 'Exposure after this invoice', value: '₹4,20,000' }, { label: 'Declaration', value: 'erp.ar v7' }],
    4092: [{ label: 'Customer', value: 'Shree Ganesh Handlooms' }, { label: 'GSTIN on file', value: 'none' }],
    4106: [{ label: 'Grant held', value: 'A0 Observe (no grant)' }, { label: 'Needed', value: 'A2 Propose' }],
    4108: [{ label: 'Drafts used', value: '250 of 250' }, { label: 'Period', value: 'September 2026' }],
    4110: [{ label: 'Obligation', value: 'OB-2026-0405' }, { label: 'Expired', value: '24 Sep 2026, 15:26 IST' }],
    4112: [{ label: 'Sandbox result', value: '1,200 kg moved' }, { label: 'Live re-run', value: '1,180 kg on hand' }],
    4096: [{ label: 'Proposer', value: 'Ravi Shankar' }, { label: 'Approver attempted', value: 'Ravi Shankar' }]
  };
  var GATE_WORDS = {
    consent: 'Consent on file for this purpose (billing and collections)', residency: 'Record domain in = tenant domain in (Mumbai)', retention: 'Inside the declared retention window',
    counterparty: 'Counterparty registered with a validated GSTIN; not on a sanctions list', precondition: 'Declared record state holds', dual_control: 'Second named actor present',
    budget: 'Within the declared period budget', rate: 'Within the declared per-actor rate', schedule: 'Inside the operating window 08:00–22:00 IST'
  };
  function gateList(e) {
    var w = wt(e.wt), stopRung = e.out === 'refused' ? (e.rung === '0b' ? 0 : Number(e.rung)) : 99;
    return w.gates.map(function (g) {
      var res = 'passed', words = GATE_WORDS[g];
      if (stopRung < 3) { res = 'not_run'; words = 'Not reached — the ladder stopped at rung ' + e.rung; }
      else if (e.out === 'refused' && e.gate === g && e.rung === 3) { res = 'failed'; words = e.words || reg(e.code).means; }
      else if (e.out === 'refused' && e.gate === g && e.rung === 7) { res = 'passed'; words = 'Passed on the shadow sandbox; the re-run on live disagreed (rung 7)'; }
      else if (g === 'dual_control' && e.out === 'escalated') { res = 'not_run'; words = 'Waiting — a second named approver resolves ' + (e.obl || 'the obligation'); }
      else if (g === 'dual_control' && e.approver) { words = 'Second named actor: ' + e.approver + ' (approval recorded one entry earlier)'; }
      else if (g === 'precondition' && e.seq === 4101) { words = 'Credit limit ₹3,00,000; exposure after this write ₹2,40,000'; }
      return { id: GATE_ID[g], name: GATE_NAME[g], result: res, words: words, version: e.decl + ' v' + e.v };
    });
  }

  /* ------------------------------------------------------------------------
     /assurance/proof — the event log (Stripe-style, faceted, paged by seq)
     ------------------------------------------------------------------------ */
  var FACETS = [
    { key: 'outcome', label: 'Outcome', opts: [['committed', 'Committed'], ['refused', 'Not done'], ['escalated', 'Waiting on a person'], ['platform', 'Our failures']] },
    { key: 'kind', label: 'Actor kind', opts: [['agent', 'Agent'], ['person', 'Person']] },
    { key: 'cls', label: 'Refusal class', opts: [['gate', 'Gate'], ['policy', 'Policy'], ['platform', 'Platform']] },
    { key: 'mode', label: 'Mode', opts: [['live', 'live'], ['sandbox', 'sandbox']] }
  ];
  function matchFacet(e, key, val) {
    if (!val) return true;
    if (key === 'outcome') return val === 'platform' ? e.platform : (e.out === val && (val !== 'refused' || !e.platform));
    if (key === 'kind') return e.kind === val;
    if (key === 'cls') return e.out === 'refused' && reg(e.code).cls === val;
    if (key === 'mode') return e.mode === val;
    if (key === 'wt') return e.wt === val;
    if (key === 'code') return e.code === val;
    if (key === 'q') { var s = String(val).toLowerCase().replace(/[#,]/g, ''); return (String(e.seq) === s) || [e.wt, e.label, e.actor, e.object, e.code, e.obl].join(' ').toLowerCase().indexOf(String(val).toLowerCase()) >= 0; }
    return true;
  }
  function applyFilters(list, query, skip) {
    return list.filter(function (e) { return ['outcome', 'kind', 'cls', 'mode', 'wt', 'code', 'q'].every(function (k) { return k === skip || matchFacet(e, k, query[k]); }); });
  }
  function proofWindow(query) {
    var to = Math.min(HEAD, Number(query.to) || HEAD), from = Math.max(1, Number(query.from) || (to - 199));
    if (to - from > 999) from = to - 999;
    return { from: from, to: to, list: range(from, to) };
  }
  route('/assurance/proof', {
    title: 'Proof', section: 'proof', keywords: 'proof chain event log records seq entries hash',
    render: function (p, query) {
      var win = proofWindow(query), st = query.state;
      var base = '/assurance/proof';
      var facetHtml = FACETS.map(function (f) {
        var pool = applyFilters(win.list, query, f.key);
        return '<div class="ac-facet"><h3>' + esc(f.label) + '</h3><ul role="list">' +
          '<li><a href="' + E1.href(base, q(query, (function () { var o = { page: null }; o[f.key] = null; return o; })())) + '"' + (!query[f.key] ? ' aria-current="true"' : '') + '><span>All</span><span class="ac-n">' + num(pool.length) + '</span></a></li>' +
          f.opts.map(function (o) {
            var n = pool.filter(function (e) { return matchFacet(e, f.key, o[0]); }).length;
            var ex = { page: null }; ex[f.key] = o[0];
            return '<li><a href="' + E1.href(base, q(query, ex)) + '"' + (query[f.key] === o[0] ? ' aria-current="true"' : '') + '><span>' + esc(o[1]) + '</span><span class="ac-n">' + num(n) + '</span></a></li>';
          }).join('') + '</ul></div>';
      }).join('');
      var wts = {}; applyFilters(win.list, query, 'wt').forEach(function (e) { wts[e.wt] = (wts[e.wt] || 0) + 1; });
      facetHtml += '<div class="ac-facet"><h3>Write type</h3><ul role="list">' + Object.keys(wts).sort(function (a, b) { return wts[b] - wts[a]; }).slice(0, 8).map(function (k) {
        return '<li><a href="' + E1.href(base, q(query, { wt: query.wt === k ? null : k, page: null })) + '"' + (query.wt === k ? ' aria-current="true"' : '') + '><span>' + esc(wt(k).label) + '</span><span class="ac-n">' + num(wts[k]) + '</span></a></li>';
      }).join('') + '</ul></div>';

      var rows = applyFilters(win.list, query);
      var per = 25, pages = Math.max(1, Math.ceil(rows.length / per)), pg = Math.min(pages, Math.max(1, Number(query.page) || 1));
      var slice = rows.slice((pg - 1) * per, pg * per);
      var active = ['outcome', 'kind', 'cls', 'mode', 'wt', 'code', 'q'].filter(function (k) { return query[k]; });
      var chips = active.map(function (k) { var ex = { page: null }; ex[k] = null; return c.chip(k === 'wt' ? wt(query[k]).label : k === 'q' ? '“' + query[k] + '”' : String(query[k]), { href: E1.href(base, q(query, ex)), removable: true, selected: true }); }).join('');

      var tableHtml;
      if (st === 'loading') tableHtml = c.skeleton({ kind: 'table', rows: 8 });
      else if (st === 'error') tableHtml = c.error({ title: 'We cannot read the proof log right now.', body: 'The evidence store did not answer within 5 seconds.', reassurance: 'Nothing has been written, changed or lost. Governed writes keep being recorded; the outbox holds them in commit order until the log answers.', code: 'PLATFORM.LOG_APPEND_FAILED', action: [{ label: 'Try again', href: '#/assurance/proof' }, { label: 'Runtime health', href: '#/assurance/runtime' }] });
      else if (st === 'empty') tableHtml = c.empty({ title: 'No proof entries yet', why: 'This tenant has not attempted a governed write, so the chain has no genesis entry. Refusals would appear here too — they are recorded like commits.', fill: 'The first write, allowed or refused, becomes #1 with a prev_digest of 32 zero octets.', icon: 'chain', action: { label: 'Try one in the sandbox', href: '#/developers/quickstart' } });
      else tableHtml = c.table({
        caption: 'Proof entries', dense: true, rowHref: function (e) { return '#/assurance/proof/' + e.seq; },
        columns: [
          { key: 'seq', label: 'Seq', mono: true, nowrap: true, render: function (e) { return P(e.seq); } },
          { key: 'at', label: 'Recorded', render: function (e) { return whenCell(e.at); } },
          { key: 'wt', label: 'Write type', render: function (e) { return wtCell(e.wt); } },
          { key: 'actor', label: 'Actor', render: function (e) { return actorCell(e); } },
          { key: 'out', label: 'Outcome', render: outcomeOf },
          { key: 'digest', label: 'Digest', mono: true, render: function (e) { return '<span title="' + esc(e.digest) + '">' + esc(fmt.shortHash(e.digest, 4, 4)) + '</span>'; } },
          { key: 'mode', label: 'Mode', mono: true, render: function (e) { return esc(e.mode); } },
          { key: 'qty', label: 'Meter', align: 'right', render: meterCell }
        ],
        rows: slice,
        empty: { title: 'No entries match these filters', why: 'Nothing in seq ' + num(win.from) + '–' + num(win.to) + ' has this combination. Refusals and escalations are recorded like commits, so an empty result is a real answer, not a gap.', action: { label: 'Clear filters', href: '#/assurance/proof' }, icon: 'filter' }
      });

      var ranges = c.segmented([
        { id: 'today', label: 'Today', href: E1.href(base, q(query, { from: 4090, to: HEAD, page: null })) },
        { id: 'last', label: 'Last 200', href: E1.href(base, q(query, { from: null, to: null, page: null })) },
        { id: 'k', label: 'Last 1,000', href: E1.href(base, q(query, { from: HEAD - 999, to: HEAD, page: null })) }
      ], Number(query.from) === 4090 ? 'today' : Number(query.from) === HEAD - 999 ? 'k' : 'last', { label: 'Range', size: 'sm' });

      return page(
        ph({
          title: 'Proof', lead: 'Every governed write on this tenant leaves one hash-chained record — commits, refusals and escalations alike. Open any row to see exactly what was recorded.',
          actions: stateMenu(base, [['Default', ''], ['Loading', 'loading'], ['Empty tenant', 'empty'], ['Log unavailable', 'error']]) +
            c.button('Chain standing', { href: '#/assurance/chain', icon: 'chain' }) + c.button('Evidence export', { href: '#/assurance/export', icon: 'lock', kind: 'ghost' }),
          meta: '<div class="ac-freshrow">' + c.level(E1.state.level) + '<span class="e1-caption">Chain head ' + seqLink(HEAD) + '</span><span class="e1-caption">Continuous · seq 1–' + num(HEAD) + ' · 19 of 23 write types</span>' + fresh('Head re-walked', 2) + '</div>'
        }) +
        '<div class="ac-2col"><aside class="ac-facets" aria-label="Filters">' + facetHtml + '</aside><div>' +
        '<div class="ac-tablebar"><form class="e1-row" data-ac-search style="flex:1;min-width:240px;gap:8px">' + c.searchBox({ id: 'ac-proof-q', value: query.q || '', placeholder: 'Search seq, write type, actor, object or code', label: 'Search proof entries' }) + '</form>' +
        '<div class="e1-row" style="gap:8px">' + ranges + '<form class="e1-row" data-ac-jump style="gap:6px"><label class="e1-sr" for="ac-jump">Go to seq</label>' + c.input({ id: 'ac-jump', placeholder: 'Go to #', mono: true, attrs: 'inputmode="numeric" style="width:104px"' }) + c.button('Open', { type: 'submit', size: 'sm' }) + '</form></div></div>' +
        (chips ? '<div class="e1-row" style="margin-bottom:12px;gap:6px"><span class="e1-caption e1-muted">Filtered by</span>' + chips + '<a class="e1-caption" href="#/assurance/proof">Clear all</a></div>' : '') +
        '<p class="ac-muted-note" style="margin-bottom:8px">Showing ' + num(slice.length) + ' of ' + num(rows.length) + ' matching entries in seq ' + num(win.from) + '–' + num(win.to) + '. Paged by sequence number, never by offset, so a link to a page always shows the same entries.</p>' +
        tableHtml +
        (st ? '' : '<div style="margin-top:12px">' + c.pagination({ page: pg, pages: pages, total: rows.length, label: num(rows.length) + ' entries', href: function (n) { return E1.href(base, q(query, { page: n })); } }) + '</div>') +
        '</div></div>'
      );
    },
    mount: function (el, p, query) {
      var f = el.querySelector('[data-ac-search]');
      if (f) f.addEventListener('submit', function (ev) { ev.preventDefault(); var v = el.querySelector('#ac-proof-q').value.trim(); E1.go('/assurance/proof', q(query, { q: v || null, page: null })); });
      var j = el.querySelector('[data-ac-jump]');
      if (j) j.addEventListener('submit', function (ev) {
        ev.preventDefault(); var v = String(el.querySelector('#ac-jump').value).replace(/[^0-9]/g, '');
        if (!v) { E1.toast('Type a sequence number, for example 4101.', 'info'); return; }
        E1.go('/assurance/proof/' + v);
      });
    }
  });

  /* ------------------------------------------------------------------------
     /assurance/proof/:seq — one proof record (E06 §05)
     ------------------------------------------------------------------------ */
  function parseSeq(s) { return Number(String(s || '').replace(/[#,\s]/g, '')); }
  function leadFor(e) {
    var who = e.actor + ' (' + KIND_WORD[e.kind] + ')';
    if (e.out === 'committed') {
      if (e.wt === 'platform.obligation.resolve') return (e.decision === 'reject' ? 'Rejected' : 'Approved') + ' ' + e.obl + ' — ' + who + '. An approval is itself a governed write, so it has its own record.';
      return 'Committed · ' + e.label + (e.object ? ' · ' + e.object : '') + ' · by ' + who + (e.approver ? ', approved by ' + e.approver : '') + '. Metered at 1 ' + e.basis + '.';
    }
    if (e.out === 'escalated') return 'Waiting on a person · ' + e.label + (e.object ? ' · ' + e.object : '') + ' · proposed by ' + who + '. The ladder stopped at rung 6; nothing was written. Metered at 0.';
    if (e.platform) return 'Our failure, not a rule · ' + e.label + ' by ' + who + '. Nothing was changed, you were not billed, and we were paged.';
    return reg(e.code).title + ' · ' + e.label + ' by ' + who + '. A refusal is a correct, recorded outcome, metered at ₹0.';
  }
  function notFound(n, pathLabel) {
    return page(ph({ title: 'Proof ' + (isNaN(n) ? 'not found' : P(n)), lead: 'There is no record at this address in this tenant’s chain.', back: ['All proof entries', '#/assurance/proof'] }) +
      c.empty({ title: isNaN(n) ? 'That is not a sequence number' : 'No proof entry ' + P(n) + ' exists in this tenant’s chain', why: 'The chain for Kaveri Spinning Mills runs from #1 to ' + P(HEAD) + ' without gaps. Sequence numbers are assigned in commit order and never skipped' + (pathLabel ? '; a write path exists only for a recorded entry.' : '.'), fill: 'If you were given this number by someone else, check which tenant their record belongs to — sequence numbers are per tenant.', icon: 'chain', action: [{ label: 'Open the chain head ' + P(HEAD), href: '#/assurance/proof/' + HEAD }, { label: 'Search the proof log', href: '#/assurance/proof' }] }));
  }
  function sixteen(e) {
    var tenant = uuid(4821) , rows = [
      ['F01', 'tenant_id', 'uuid · 16', tenant], ['F02', 'seq', 'uint64 · 8', String(e.seq)], ['F03', 'prev_digest', 'digest · 32', e.prev], ['F04', 'write_id', 'uuid · 16', e.writeId],
      ['F05', 'write_type', 'string · 5–64', e.wt], ['F06', 'declaration_id', 'uuid · 16', uuid(e.decl.length * 977 + e.v)], ['F07', 'declaration_version', 'uint32 · 4', String(e.v)],
      ['F08', 'policy_version', 'uint32 · 4', String(e.pol) + (e.pol === 0 ? '  (rung 4 not reached)' : '')], ['F09', 'actor_id', 'uuid · 16', uuid(e.actor.length * 7907 + 3)],
      ['F10', 'actor_kind', 'enum · 5|6', e.kind === 'person' ? 'human' : e.kind], ['F11', 'autonomy_level', 'uint8 · 1', e.aut ? String(Number(e.aut.slice(1))) + '  (' + e.aut + ')' : '—  (approval; not an autonomy grant)'],
      ['F12', 'record_id', 'uuid · 16', e.recordId], ['F13', 'record_version', 'uint32 · 4', String(e.recordVersion)], ['F14', 'payload_hash', 'digest · 32', hex(e.seq * 131 + 5, 64)],
      ['F15', 'lexicon_hash', 'digest · 32', hex(2026 * 9 + 1, 64)], ['F16', 'recorded_at', 'timestamp · 20', new Date(e.at).toISOString().replace(/\.\d{3}Z$/, 'Z')]
    ];
    return '<div class="e1-table-wrap"><table class="e1-table is-dense"><caption class="e1-sr">The sixteen sealed fields</caption><thead><tr><th scope="col">#</th><th scope="col">Field</th><th scope="col">Encoding · octets</th><th scope="col">Value</th></tr></thead><tbody>' +
      rows.map(function (r) { return '<tr><th scope="row" class="e1-mono">' + r[0] + '</th><td class="e1-mono">' + esc(r[1]) + '</td><td class="e1-muted">' + esc(r[2]) + '</td><td class="e1-mono" style="word-break:break-all">' + (r[0] === 'F03' && e.seq > 1 ? '<a href="#/assurance/proof/' + (e.seq - 1) + '">' + esc(r[3]) + '</a>' : esc(r[3])) + '</td></tr>'; }).join('') +
      '</tbody></table></div><p class="ac-muted-note" style="margin-top:8px">Preimage = LP("elan1.proof.seal.v6") ‖ LP(F01) ‖ … ‖ LP(F16); digest = SHA-256(preimage). Outcome, refusal code, mode and enforcement mode are kept beside the record, outside the preimage.</p>';
  }
  function relStrip(e) {
    var g = relGroup(e); if (!g) return '';
    var words = ['Escalated', 'Approved', 'Committed'];
    return c.section({ id: 'related', title: 'One approved decision, three records', lead: 'The escalation, the approval and the resubmitted write each have their own entry. The kernel keeps no suspended-and-resumed state.', body:
      '<div class="ac-rel">' + g.map(function (s, i) {
        var x = entry(s);
        return (i ? '<div class="ac-rel__arrow" aria-hidden="true">' + c.icon('arrow-right', 16) + '</div>' : '') +
          '<a class="ac-rel__n' + (s === e.seq ? ' is-here' : '') + '" href="#/assurance/proof/' + s + '"' + (s === e.seq ? ' aria-current="page"' : '') + '><span class="e1-label">' + words[i] + ' · ' + P(s) + '</span>' + outcomeOf(x) +
          '<span class="e1-caption">' + esc(x.actor) + ' · ' + KIND_WORD[x.kind] + ' · ' + esc(fmt.time(x.at)) + '</span><span class="e1-caption e1-muted">Meter ' + x.qty + '</span></a>';
      }).join('') + '</div>' });
  }
  function establishes(e) {
    return '<div class="ac-claims"><div><h3>' + c.icon('check', 14) + 'This record establishes</h3><ul>' +
      ['That a write of type ' + e.wt + ' was attempted at ' + fmt.dateTime(e.at) + ' and decided: ' + outcomeWord(e).toLowerCase() + '.', 'Which declaration (' + e.decl + ' v' + e.v + ') and rule set (policy ' + e.pol + ') were in force.', 'That it follows ' + P(e.seq - 1) + ' in this tenant’s chain; any later change to either would break the link.', 'That the payload fields listed above were committed through a salted hash.']
        .map(function (s) { return '<li>' + c.icon('check', 12) + '<span>' + esc(s) + '</span></li>'; }).join('') +
      '</ul></div><div><h3>' + c.icon('x', 14) + 'It does not establish</h3><ul>' +
      ['That someone who does not trust elan1 can check it without us — at L1, verify requires us.', 'That the underlying business transaction was genuine or correctly priced.', 'That the chain was not cut after its last entry: a chain cut at 4,000 of 4,200 is internally consistent. Nightly reconciliation against ERPNext is what catches that.', 'Anything about records written outside elan1.']
        .map(function (s) { return '<li>' + c.icon('minus', 12) + '<span>' + esc(s) + '</span></li>'; }).join('') + '</ul></div></div>';
  }
  function honesty() {
    if (E1.atLeast('L2')) return '';
    return '<div class="ac-honest" role="note">' + c.icon('chain', 20) + '<div><span class="e1-label">' + 'Assurance Level 1 · Guarded' + '</span><p>This record is hash-chained. It is not signed, and it cannot yet be checked by someone who does not trust elan1. That arrives at Assurance Level 2.</p></div></div>';
  }
  route('/assurance/proof/:seq', {
    title: function (p) { var n = parseSeq(p.seq); return isNaN(n) ? 'Proof' : 'Proof ' + P(n); }, section: 'proof', example: '/assurance/proof/4101',
    crumbs: crumbsA([['Proof', '#/assurance/proof']]), keywords: 'proof record seal digest prev_digest',
    render: function (p, query) {
      var n = parseSeq(p.seq), e = entry(n);
      if (!e) return notFound(n);
      var sandbox = query.mode === 'sandbox' || (E1.tenant() && E1.tenant().env === 'sandbox');
      if (sandbox) { e.mode = 'sandbox'; e.enf = 'Attested advisory'; e.qty = 0; }
      var around = range(Math.max(1, e.seq - 3), Math.min(HEAD, e.seq + 3)).reverse().map(function (x) { return { seq: x.seq, digest: x.digest, prev: x.prev, writeType: x.wt, outcome: x.platform ? 'refused' : x.out, at: fmt.time(x.at), actorKind: x.kind === 'person' ? 'person' : 'agent', href: '#/assurance/proof/' + x.seq }; });
      var r = e.code ? reg(e.code) : null;
      var kv = [
        ['seq', P(e.seq), { mono: true }], ['Outcome', outcomeOf(e) + (e.decision ? ' <span class="e1-caption">decision: ' + esc(e.decision) + '</span>' : ''), { html: true }],
        ['prev_digest', c.hash(e.prev, { label: 'Previous digest' }) + (e.seq > 1 ? ' ' + seqLink(e.seq - 1, 'ties to ' + P(e.seq - 1)) : ' <span class="e1-caption">genesis: 32 zero octets</span>'), { html: true }],
        ['digest', c.hash(e.digest), { html: true }],
        ['Write type', wtCell(e.wt), { html: true }], ['Declaration version', '<a class="e1-mono" href="#/records/declarations/' + esc(e.decl) + '/v/' + e.v + '">' + esc(e.decl + ' v' + e.v) + '</a>', { html: true }],
        ['Policy version', e.pol ? '<a class="e1-mono" href="#/records/policies/' + e.pol + '">policy ' + e.pol + '</a>' : '<span class="e1-mono">0</span> <span class="e1-caption">rung 4 not reached</span>', { html: true }],
        ['Actor', actorCell(e, true), { html: true }], ['Actor kind', KIND_WORD[e.kind]], ['Autonomy', e.aut ? c.autonomy(e.aut, { compact: true }) : '<span class="e1-muted">An approval — not an autonomy grant</span>', { html: true }],
        ['Refusal code', r ? '<a class="e1-mono" href="#/assurance/refusals/' + esc(e.code) + '">' + esc(e.code) + '</a> <span class="e1-caption">' + esc(r.cls) + ' · rung ' + esc(r.rung) + '</span>' : '<span class="e1-muted">None — not a refusal</span>', { html: true }],
        ['Mode', '<span class="e1-mono">' + esc(e.mode) + '</span>' + (e.mode === 'sandbox' ? ' ' + c.badge('info', 'Sandbox tenant', { subtle: true }) : ''), { html: true }],
        ['Enforcement mode', '<a href="#/assurance/enforcement">' + esc(e.enf) + '</a>', { html: true }], ['Channel', e.ch, { mono: true }],
        ['Recorded at', fmt.dateTime(e.at) + ' · platform clock'], ['assurance_level', '1', { mono: true }]
      ];
      var fieldsTbl = c.table({ caption: 'Fields committed by proof_binding', dense: true, columns: [
        { key: 0, label: 'Field', mono: true, render: function (f) { return esc(f[0]); } }, { key: 1, label: 'Value as committed', mono: true, render: function (f) { return esc(f[1]); } }, { key: 2, label: 'Classification', render: function (f) { return esc(f[2]); } }],
        rows: e.fields || [['obligation_id', e.obl || '—', 'internal'], ['decision', e.decision || 'approve', 'internal'], ['basis.surface_plan', 'sp:erp_sales_invoice@7#c41e…', 'internal'], ['basis.rendered_payload_digest', fmt.shortHash(hex(e.seq * 3, 64), 6, 6), 'internal'], ['channel', e.ch, 'internal']],
        empty: { title: 'No payload fields bound', why: 'This write type binds no payload fields.' } });
      var refusalCard = '';
      if (e.out === 'refused') {
        refusalCard = c.refusal({ code: e.code, title: r.title, ruleName: e.gate ? GATE_ID[e.gate] + ' ' + GATE_NAME[e.gate] : 'Rung ' + r.rung, version: e.decl + ' v' + e.v + (e.pol ? ' · policy ' + e.pol : ''), rule: e.words || r.means, numbers: NUMS[e.seq] || [], action: { label: r.button, href: r.href }, at: fmt.dateTime(e.at) });
      } else if (e.out === 'escalated') {
        refusalCard = c.callout({ kind: 'warning', title: 'Waiting on a person · ' + (e.obl || ''), body: '<p>' + esc(e.note || 'The proposing actor’s autonomy does not reach rung 7 for this write type, so an obligation was created for a named human.') + ' Nothing was written. When a person approves, the write is resubmitted and climbs from rung 0b again with its own record.</p><p style="margin-top:8px">' + c.button('Open the obligation', { href: '#/work/decide/' + (e.obl || 'OB-2026-0412'), size: 'sm', icon: 'gate' }) + '</p>' });
      }
      var side = c.seal({ seq: e.seq, writeType: e.wt, outcome: e.platform ? 'platform' : e.out, code: e.code, blast: e.radius, reversible: wt(e.wt).rev === false ? false : (wt(e.wt).rev || undefined), amount: e.amount, actor: { name: e.actor, kind: e.kind === 'person' ? 'person' : 'agent' }, approver: e.approver, at: fmt.dateTime(e.at), digest: e.digest, prev: e.prev, declaration: e.decl + ' v' + e.v, policy: 'policy ' + e.pol }) +
        c.card({ title: 'Meter event', body: c.kv([['event_id', fmt.shortHash(uuid(e.seq * 17), 8, 4), { mono: true }], ['write_id', fmt.shortHash(e.writeId, 8, 4), { mono: true }], ['Basis', e.basis], ['Quantity', e.qty ? '1' : '0 — ₹0', { mono: true }], ['Outcome', outcomeWord(e)]], { compact: true }) + (e.qty ? '' : '<p class="ac-muted-note" style="margin-top:8px">' + (e.mode === 'sandbox' ? 'Sandbox events are emitted at quantity zero and never billed.' : 'Refusals and escalations meter at zero, enforced by a database CHECK.') + '</p>'),
          footer: linkArrow('Open on the meter', '#/assurance/meter/' + e.wt + '?seq=' + e.seq) }) +
        c.card({ title: 'Go to', body: '<ul class="ac-feed">' + [
          e.objId ? ['file', 'Open the object ' + e.objId, '#/records/object/' + e.objId] : null,
          e.obl ? ['gate', 'Open the obligation ' + e.obl, '#/work/decide/' + e.obl] : null,
          e.out === 'refused' ? ['refuse', 'Not done explanation', '#/work/not-done/' + e.seq] : null,
          ['activity', 'Write path inspector', '#/assurance/proof/' + e.seq + '/path'],
          ['records', 'Write type ' + e.wt, '#/records/write-types/' + e.wt],
          e.kind === 'agent' ? ['agents', 'Agent ' + e.actor, actorHref(e.actor, 'agent')] : null
        ].filter(Boolean).map(function (x) { return '<li style="grid-template-columns:28px minmax(0,1fr)"><span class="ac-feed__i">' + c.icon(x[0], 14) + '</span><a href="' + esc(x[2]) + '">' + esc(x[1]) + '</a></li>'; }).join('') + '</ul>',
          footer: '<span class="e1-caption e1-muted">Walk the chain with ' + c.kbd('[') + ' and ' + c.kbd(']') + '</span>' });
      var prevNext = '<div class="e1-row" style="gap:6px">' + (e.seq > 1 ? c.button('Previous ' + P(e.seq - 1), { href: '#/assurance/proof/' + (e.seq - 1), icon: 'chevron-left', size: 'sm', kind: 'ghost' }) : '') + (e.seq < HEAD ? c.button('Next ' + P(e.seq + 1), { href: '#/assurance/proof/' + (e.seq + 1), iconRight: 'chevron-right', size: 'sm', kind: 'ghost' }) : '<span class="e1-caption e1-muted">Chain head</span>') + '</div>';
      return page(
        ph({
          eyebrow: 'Proof record · ' + e.label, title: 'Proof ' + P(e.seq), lead: leadFor(e),
          actions: c.menu({ label: 'View states', icon: 'layers', align: 'right', items: [{ label: 'Live entry (this tenant)', href: '#/assurance/proof/' + e.seq }, { label: 'Sandbox tenant entry', href: '#/assurance/proof/' + e.seq + '?mode=sandbox' }, { label: 'An approval, three entries', href: '#/assurance/proof/4100' }, { label: 'A refusal', href: '#/assurance/proof/4098' }, { label: 'Our failure', href: '#/assurance/proof/4102' }, { label: 'Not found', href: '#/assurance/proof/' + (HEAD + 88) }] }) +
            c.button('Write path', { href: '#/assurance/proof/' + e.seq + '/path', icon: 'activity' }) +
            c.button('Verify this range', { kind: 'primary', icon: 'chain', attrs: 'data-action="ac-verify" data-from="' + Math.max(1, e.seq - 3) + '" data-to="' + Math.min(HEAD, e.seq + 3) + '"' }),
          meta: '<div class="ac-freshrow">' + outcomeOf(e) + c.level(E1.state.level) + '<span class="e1-caption">mode: <span class="e1-mono">' + esc(e.mode) + '</span></span><span class="e1-caption">' + esc(e.enf) + '</span>' + fresh('Chain around it re-walked', 2) + '</div>'
        }) +
        (e.mode === 'sandbox' ? '<div class="ac-banner ac-banner--info" role="note">' + c.icon('info', 18) + '<div><strong>Sandbox tenant — this entry can never be presented as a production one.</strong><p>It was recorded into the sandbox chain marked mode: sandbox and metered at quantity zero. Enforcement: Attested advisory.</p></div></div>' : '') +
        '<div class="ac-split"><div class="ac-page" style="gap:var(--space-5)">' +
        refusalCard + honesty() +
        (E1.atLeast('L2') ? c.card({ title: 'Level 2 preview: what a stranger could check', eyebrow: 'Preview · not live at your tenant', body: c.kv([['Signature', 'Ed25519 over the same 32-octet digest', {}], ['Key fingerprint', 'k_in_20270401_9c3a · SHA-256 3f1c…a8d0', { mono: true }], ['Merkle inclusion', 'batch 2027-04-01T10:15Z · path of 10 digests', {}], ['Anchor time', 'no later than 10:15 IST · two timestamp authorities', {}]]) + '<p class="ac-muted-note" style="margin-top:8px">' + c.level(E1.state.level) + ' Preview only. Records written at L1 stay L1 and are never back-signed.</p>' }) : '') +
        c.card({ title: 'The record', actions: prevNext, body: c.kv(kv, { cols: 2 }) }) +
        c.section({ id: 'fields', title: 'Exactly what was committed', lead: 'The fields this write type binds in proof_binding, with the values as committed. The chain holds their salted hash (F14), never the payload.', body: fieldsTbl }) +
        relStrip(e) +
        c.section({ id: 'chain', title: 'The chain around it', lead: 'Three entries either side. Each ties to the one before it by prev_digest.', actions: linkArrow('Chain standing', '#/assurance/chain'), body: chainStanding({ entries: around, scope: '19 of 23 write types', count: 'seq ' + num(around[0].seq) + '–' + num(around[around.length - 1].seq) + ' shown · 1–' + num(HEAD) + ' checked' }) }) +
        c.section({ id: 'gates', title: 'Gate results, kept beside the record', lead: 'Every declared gate in declared order — not only the one that decided.', body: gateList(e).length ? c.gates(gateList(e), { version: e.decl + ' v' + e.v + ' · policy ' + e.pol }) : muted('No gates declared.') }) +
        '<details class="ac-details e1-card" style="padding:0 var(--space-4)"><summary>' + c.icon('chevron-right', 14, { cls: 'ac-chev' }) + 'Full record — the sixteen fields F01–F16</summary><div style="padding-bottom:var(--space-4)">' + sixteen(e) + '</div></details>' +
        c.section({ id: 'limits', title: 'What this record establishes', body: establishes(e) }) +
        '</div><aside class="ac-side" aria-label="Seal and links">' + side + '</aside></div>'
      );
    }
  });

  /* keyboard: [ and ] walk the chain on proof pages */
  document.addEventListener('keydown', function (ev) {
    var r = E1.state && E1.state.route; if (!r || !r.pattern || r.pattern.indexOf('/assurance/proof/:seq') !== 0) return;
    var t = ev.target; if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
    var n = parseSeq(r.params.seq); if (isNaN(n)) return;
    var suffix = /\/path$/.test(r.pattern) ? '/path' : '';
    if (ev.key === '[' && n > 1) { ev.preventDefault(); E1.go('/assurance/proof/' + (n - 1) + suffix); }
    if (ev.key === ']' && n < HEAD) { ev.preventDefault(); E1.go('/assurance/proof/' + (n + 1) + suffix); }
  });

  /* Verify a range (L1: verify requires us) — shared by proof and chain screens */
  function verifyResult(from, to, broken) {
    from = Math.max(1, from); to = Math.min(HEAD, to);
    var n = to - from + 1, wts = {}; range(from, to).forEach(function (x) { wts[x.wt] = 1; });
    var body = broken
      ? c.callout({ kind: 'critical', title: 'Break at seq 3,882 · field prev_digest', body: '<p>prev_digest does not match ' + P(3881) + '. Expected <span class="e1-mono">a376…9e01</span>, found <span class="e1-mono">0000…0000</span>. P0 raised 02:11 IST.</p><p>What this means: an entry was altered or removed after it was written. The chain tells us something changed; it cannot yet tell a stranger who wrote it.</p>' })
      : '<div class="ac-banner ac-banner--neutral" style="border-color:var(--state-good-border);background:var(--state-good-bg)">' + c.icon('chain', 18) + '<div><strong>Continuous · seq ' + num(from) + '–' + num(to) + ' · ' + num(n) + ' ' + (n === 1 ? 'entry' : 'entries') + ' · ' + Object.keys(wts).length + ' write types in range</strong><p>Every preimage recomputed, every digest matched and every prev_digest tied to the entry before it. Checked ' + esc(fmt.dateTime(new Date())) + '.</p></div></div>';
    return body + '<div style="margin-top:12px">' + c.kv([['Range', 'seq ' + num(from) + '–' + num(to), { mono: true }], ['Scope', 'full records · ' + Object.keys(wts).length + ' write types in range'], ['Declarations resolved', 'erp.ar v7 · erp.ap v5 · erp.stock v3 · platform v3', { mono: true }], ['Checked by', 'elan1 verify (KernelPort) · integrity-walker 1.4.2']], { compact: true }) + '</div>' +
      '<div class="ac-honest" style="margin-top:12px" role="note">' + c.icon('info', 18) + '<div><span class="e1-label">Limit</span><p>At L1, verify requires us. This result was computed by elan1 on elan1’s infrastructure; someone who does not trust elan1 cannot yet repeat it on their own machine.</p></div></div>';
  }

  /* ------------------------------------------------------------------------
     /assurance/proof/:seq/path — write path inspector (0b + nine rungs)
     ------------------------------------------------------------------------ */
  var RUNGS10 = [
    ['0b', 'STOP', 'Is the tenant stopped? Checks tenant, residency and the stop flag.', 4, 'kernel'],
    ['1', 'IDENTITY', 'actor_id and actor_kind from the token, never the payload; delegation confers no autonomy.', null, 'kernel'],
    ['2', 'WRITE DOOR', 'The write type exists at an explicit declaration version and is reachable from this channel. There is no generic write.', null, 'kernel'],
    ['3', 'PRE-GATES', 'Declared gates in declared order, pure functions of as_of; all run even after the first failure.', 8, 'kernel'],
    ['4', 'evaluate()', 'Versioned rules over a projection of declared fields → allow, refuse or escalate. No model in this path.', 12, 'kernel'],
    ['5', 'GUARDRAIL', 'Measured blast radius against the declared value.', 8, 'kernel'],
    ['6', 'AUTONOMY', 'The A0–A5 grant for this actor and write type; a missing grant is A0; too low escalates to a person.', null, 'kernel'],
    ['7', 'ACT', 'Snapshot → shadow sandbox apply → gate re-run → identical bytes to live on a single-use 10-minute credential → re-run on live → commit plus outbox.', 18, 'kernel'],
    ['8', 'PROOF', 'Assign seq, chain prev_digest, SHA-256 over the sixteen-field preimage. Refusals are recorded too.', 12, 'kernel'],
    ['9', 'METERED', 'Exactly one meter event; refusals and escalations at quantity zero by a database CHECK.', 2, 'kernel']
  ];
  var TARGET_NOTE = { '0b': '4 ms for 0b–2 together', '1': 'in 0b–2 budget', '2': 'in 0b–2 budget', '5': '8 ms for 5–6 together', '6': 'in 5–6 budget', '7': '18 ms kernel only; ERPNext pair ≤ 1,200 ms p95' };
  function rungIndex(r) { return r === '0b' ? 0 : Number(r); }
  function pathStates(e) {
    var stop = e.out === 'committed' ? 99 : e.out === 'escalated' ? 6 : rungIndex(String(e.rung || 3));
    return RUNGS10.map(function (r, i) {
      if (e.out === 'committed') return 'passed';
      if (i < stop) return 'passed';
      if (i === stop) return e.out === 'escalated' ? 'escalated' : (e.platform ? 'platform' : 'refused');
      if (i === 8) return 'recorded';
      if (i === 9) return 'zero';
      return 'skipped';
    });
  }
  route('/assurance/proof/:seq/path', {
    title: function (p) { var n = parseSeq(p.seq); return isNaN(n) ? 'Write path' : 'Write path · ' + P(n); }, section: 'proof', example: '/assurance/proof/4101/path',
    crumbs: crumbsA([['Proof', '#/assurance/proof']]), keywords: 'rungs right path inspector timings latency ladder',
    render: function (p) {
      var n = parseSeq(p.seq), e = entry(n);
      if (!e) return notFound(n, true);
      var r = rng(e.seq * 5 + 1), states = pathStates(e);
      var ms = RUNGS10.map(function (x, i) { return [0.4, 1.1, 1.9, 6.8, 9.7, 2.2, 3.9, 14.2, 10.6, 1.4][i] * (0.8 + r() * 0.4); });
      var totalKernel = ms.reduce(function (a, v, i) { return a + (states[i] === 'skipped' ? 0 : v); }, 0);
      var erp = e.out === 'committed' && !/^platform\./.test(e.wt) ? Math.round(620 + r() * 420) : (e.code === 'GATE.SANDBOX_DIVERGED' ? Math.round(700 + r() * 300) : 0);
      var WORD = { passed: 'Passed', refused: 'Refused here', platform: 'Our failure here', escalated: 'Escalated here', recorded: 'Recorded', zero: 'Metered at zero', skipped: 'Not reached' };
      var ICON = { passed: 'check', refused: 'refuse', platform: 'alert', escalated: 'gate', recorded: 'check', zero: 'check', skipped: 'minus' };
      var stopAt = states.indexOf('refused') >= 0 ? states.indexOf('refused') : states.indexOf('platform') >= 0 ? states.indexOf('platform') : states.indexOf('escalated');
      function detail(i) {
        var st = states[i];
        if (st === 'skipped') return '<p class="ac-rung__rule">Not reached — the ladder stopped at rung ' + RUNGS10[stopAt][0] + '.</p>';
        switch (i) {
          case 0: return '<div class="ac-rung__detail">Kaveri Spinning Mills is live · residency <span class="e1-mono">in</span> · no stop event.</div>';
          case 1: return '<div class="ac-rung__detail">' + actorCell(e, true) + ' <span class="e1-caption">actor_kind set from the token</span></div>';
          case 2: return '<div class="ac-rung__detail">' + mono(e.wt) + ' at ' + mono(e.decl + ' v' + e.v) + ' · channel ' + mono(e.ch) + ' carries it</div>';
          case 3: return '<div class="ac-rung__detail">' + c.gates(gateList(e), { version: e.decl + ' v' + e.v }) + '</div>';
          case 4: return '<div class="ac-rung__detail">Decision: <strong>' + (e.out === 'refused' && e.rung === 4 ? 'refuse' : 'allow') + '</strong> at ' + mono('policy ' + (e.pol || 11)) + ' · no model in this path · replay gives the same answer</div>';
          case 5: return '<div class="ac-rung__detail">Measured reach: ' + c.blast(e.radius, { compact: true }) + ' — equals the declared radius</div>';
          case 6: return '<div class="ac-rung__detail">' + (e.aut ? c.autonomy(e.aut) : '<span>Approval by a person — resolver set ar-approvers</span>') +
            (st === 'escalated' ? '<p class="ac-rung__rule">An obligation was created: <a href="#/work/decide/' + esc(e.obl || '') + '">' + esc(e.obl || '') + '</a>, human resolvers only, expiry 4 h (declared). Rung 7 is never reached; the write is resubmitted after approval.</p>' : '') +
            (e.approver ? '<p class="ac-rung__rule">Resubmission carries obligation_ref ' + esc(e.obl) + ', approved by ' + esc(e.approver) + ' one entry earlier.</p>' : '') +
            (st === 'refused' ? '<p class="ac-rung__rule">' + esc(e.words || reg(e.code).means) + '</p>' : '') + '</div>';
          case 7:
            var steps = [['Snapshot taken', 'passed'], ['Shadow sandbox apply', 'passed'], ['Gate re-run on sandbox', 'passed'], ['One-time credential · 10 min · one write', 'passed'], ['Identical bytes to live (ERPNext via Frappe API)', 'passed'], ['Gate re-run on live', 'passed'], ['Commit + outbox row', 'passed']];
            if (e.code === 'GATE.SANDBOX_DIVERGED') { steps[5][1] = 'failed'; steps[6] = ['Snapshot restored — nothing kept', 'restored']; }
            if (e.platform && e.rung === 7) { steps[4][1] = 'failed'; steps[5][1] = 'skipped'; steps[6] = ['Nothing applied to live', 'restored']; }
            return '<ul class="ac-substeps" role="list">' + steps.map(function (s) { return '<li>' + c.icon(s[1] === 'passed' ? 'check' : s[1] === 'failed' ? 'x' : s[1] === 'restored' ? 'undo' : 'minus', 12) + esc(s[0]) + (s[1] === 'failed' ? ' — <strong>failed</strong>' : '') + '</li>'; }).join('') + '</ul>' +
              (erp ? '<p class="ac-rung__rule">Sandbox and live applies together: <span class="e1-mono">' + num(erp) + ' ms</span> against a design target of ≤ 1,200 ms p95 ' + unverified() + '</p>' : '') +
              (e.objId ? '<p class="ac-rung__rule">ERPNext returned <a href="#/records/object/' + esc(e.objId) + '">' + esc(e.objId) + '</a> and its inverse operation.</p>' : '');
          case 8: return '<div class="ac-rung__detail">seq ' + seqLink(e.seq) + ' · digest ' + c.hash(e.digest) + ' · ties to ' + seqLink(e.seq - 1) + '</div>';
          case 9: return '<div class="ac-rung__detail">One meter event · basis ' + esc(e.basis) + ' · quantity <strong class="e1-mono">' + e.qty + '</strong>' + (e.qty ? '' : ' · ₹0') + '</div>';
        }
        return '';
      }
      var ladder = '<ol class="ac-ladder" aria-label="Write path: stop check and nine rungs">' + RUNGS10.map(function (x, i) {
        var st = states[i], tgt = x[3];
        return '<li class="ac-rung ac-rung--' + st + (i === 0 ? ' ac-rung--stop' : '') + '"' + (i === stopAt ? ' aria-current="step"' : '') + '>' +
          '<div class="ac-rung__n"><span class="ac-rung__dot">' + c.icon(ICON[st], 14) + '</span><span>' + x[0] + '</span></div>' +
          '<div class="ac-rung__main"><div class="ac-rung__name">' + esc(x[1]) + ' <span class="e1-caption e1-muted" style="font-weight:var(--weight-medium)">' + esc(WORD[st]) + '</span></div><p class="ac-rung__rule">' + esc(x[2]) + '</p>' + detail(i) + '</div>' +
          '<div class="ac-rung__t">' + (st === 'skipped' ? '<span class="e1-muted">—</span>' : '<span class="ac-rung__ms">' + ms[i].toFixed(1) + ' ms</span><span class="ac-rung__bar" aria-hidden="true"><i style="width:' + Math.min(100, ms[i] / 18 * 100).toFixed(0) + '%"></i></span>') +
          '<span class="e1-muted">' + (tgt ? 'target p50 ' + tgt + ' ms' : esc(TARGET_NOTE[x[0]] || '')) + '</span>' + (tgt || TARGET_NOTE[x[0]] ? unverified() : '') + '</div></li>';
      }).join('') + '</ol>';
      var summary = e.out === 'committed' ? 'Climbed every rung and committed' : e.out === 'escalated' ? 'Stopped at rung 6 — waiting on a person' : e.platform ? 'Stopped at rung ' + e.rung + ' — our failure, nothing applied' : 'Refused at rung ' + e.rung + ' — recorded and metered at ₹0';
      return page(
        ph({
          eyebrow: 'Write path inspector · ' + e.label, title: 'Write path of ' + P(e.seq), back: ['Proof ' + P(e.seq), '#/assurance/proof/' + e.seq],
          lead: summary + '. Every governed write climbs the same ten checks in the same order, and each leaves a row behind.',
          actions: c.menu({ label: 'View states', icon: 'layers', align: 'right', items: [{ label: 'Committed after approval', href: '#/assurance/proof/4101/path' }, { label: 'Refused at a gate', href: '#/assurance/proof/4098/path' }, { label: 'Escalated at rung 6', href: '#/assurance/proof/4099/path' }, { label: 'Refused at rung 6 (no grant)', href: '#/assurance/proof/4106/path' }, { label: 'Shadow sandbox disagreed', href: '#/assurance/proof/4112/path' }, { label: 'Our failure at rung 7', href: '#/assurance/proof/4102/path' }] }) +
            c.button('Replay the decision', { icon: 'refresh', attrs: 'data-action="ac-replay" data-seq="' + e.seq + '"' }) + c.button('Open the proof', { kind: 'primary', href: '#/assurance/proof/' + e.seq, icon: 'proof' })
        }) +
        '<div class="ac-kpis">' +
        '<div class="ac-kpi"><span class="e1-label">Outcome</span><span>' + c.outcome(e.platform ? 'platform' : e.out, { subtle: true }) + '</span><span class="ac-kpi__n e1-mono" style="word-break:break-all">' + esc(e.code || 'no refusal code') + '</span></div>' +
        '<div class="ac-kpi"><span class="e1-label">Kernel time</span><span class="ac-kpi__v">' + totalKernel.toFixed(1) + ' ms</span><span class="ac-kpi__n">target ≈ 64 ms p50 ' + unverified() + '</span></div>' +
        '<div class="ac-kpi"><span class="e1-label">ERPNext pair</span><span class="ac-kpi__v">' + (erp ? num(erp) + ' ms' : '—') + '</span><span class="ac-kpi__n">' + (erp ? 'sandbox + live applies' : 'not reached') + '</span></div>' +
        '<div class="ac-kpi"><span class="e1-label">Decision</span><span class="ac-kpi__v ac-kpi__v--sm">' + esc(e.out === 'refused' && e.rung === 4 ? 'refuse · policy ' + e.pol : e.out === 'refused' && e.rung < 4 ? 'Not reached' : 'allow · policy ' + e.pol) + '</span><span class="ac-kpi__n">' + esc(e.decl + ' v' + e.v + (e.out === 'refused' && e.rung < 4 ? ' · stopped at rung ' + e.rung : '')) + '</span></div>' +
        '<div class="ac-kpi"><span class="e1-label">Autonomy</span><span class="ac-kpi__v ac-kpi__v--sm">' + esc(e.aut || 'Approval') + '</span><span class="ac-kpi__n">' + esc(e.kind === 'agent' ? 'Agent' : 'Person') + '</span></div>' +
        '<div class="ac-kpi"><span class="e1-label">Meter</span><span class="ac-kpi__v ac-kpi__v--sm">' + e.qty + (e.qty ? '' : ' · ₹0') + '</span><span class="ac-kpi__n">' + esc(e.basis) + '</span></div></div>' +
        c.callout({ kind: 'caveat', title: 'Timings are observations of this one write, not SLO readings.', body: '<p>Span durations come from one OpenTelemetry span per rung. The per-rung budgets are design targets and carry [unverified] until measured under load; see <a href="#/assurance/runtime">Runtime</a>.</p>' }) +
        ladder +
        '<p class="ac-muted-note">After an approval, the resubmitted write climbs again from 0b — it is never resumed. Walk neighbouring writes with ' + c.kbd('[') + ' and ' + c.kbd(']') + '.</p>'
      );
    }
  });
  E1.action('ac-replay', function (el) {
    var e = entry(el.getAttribute('data-seq'));
    E1.toast('Same inputs, same versions, same as_of → same decision: ' + (e.out === 'refused' ? 'refuse (' + e.code + ')' : e.out === 'escalated' ? 'escalate at rung 6' : 'allow') + '. Replays are determinism checks and are not recorded as writes.', 'info', { title: 'Replay of ' + P(e.seq) + ' matched' });
  });

  /* ------------------------------------------------------------------------
     /assurance/chain — standing, nightly runs, verify a range, break variant
     ------------------------------------------------------------------------ */
  function strip(list, brokenSeq) {
    return '<div class="ac-strip" role="list" aria-label="Chain strip">' + list.map(function (x, i) {
      var cls = x.platform ? 'is-platform' : 'is-' + x.out;
      var br = brokenSeq && x.seq === brokenSeq;
      return (i ? '<span class="ac-strip__l' + (br ? ' is-broken' : '') + '" aria-hidden="true"></span>' : '') +
        '<a role="listitem" class="ac-strip__b ' + cls + (br ? ' is-broken' : '') + '" href="#/assurance/proof/' + x.seq + '" title="' + esc(P(x.seq) + ' · ' + x.wt + ' · ' + outcomeWord(x)) + '"><strong>' + P(x.seq) + '</strong><span>' + esc(outcomeWord(x)) + '</span><span class="e1-mono e1-muted">' + esc(fmt.shortHash(x.digest, 4, 0).replace('…', '')) + '…</span>' + (br ? '<span class="e1-tone--critical">prev_digest ≠</span>' : '') + '</a>';
    }).join('') + '</div>';
  }
  var NIGHTLY = (function () {
    var out = [], head = 4041;
    for (var d = 24; d >= 11; d--) {
      var missed = d === 17;
      out.push({ id: 'ir-2026-09-' + d, at: iso(d, missed ? '06:40' : '02:10'), from: 1, to: head, verdict: 'continuous', wts: 19 - (d < 15 ? 1 : 0), dur: (41 + (d % 7) * 3) + 's', worker: d >= 19 ? '1.4.2' : '1.4.1', note: missed ? 'Re-run after the 02:10 job was missed' : '' });
      if (missed) out.push({ id: 'ir-2026-09-17-a', at: iso(17, '02:10'), from: 1, to: head, verdict: 'not_checked', wts: 0, dur: '—', worker: '1.4.1', note: 'Job missed: dead-man switch paged 03:10 IST. A missed run is Not checked, never a pass.' });
      head -= 150 + ((d * 37) % 60);
    }
    return out;
  })();
  route('/assurance/chain', {
    title: 'Chain standing', section: 'chain', keywords: 'chain integrity continuity verify nightly break',
    render: function (p, query) {
      var st = query.state || 'continuous';
      var tab = query.tab || 'standing';
      var head = range(HEAD - 7, HEAD).reverse();
      var standingHtml, banner = '';
      if (st === 'break') {
        banner = '<div class="ac-banner" role="alert">' + c.icon('refuse', 20) + '<div><strong>Break at seq 3,882 · prev_digest does not match #3,881 · P0 raised 02:11 IST</strong><p>What this means: an entry was altered or removed after it was written. The chain tells us something changed; it cannot yet tell a stranger who wrote it. Writes are paused for this organisation until the gap is documented and verified.</p><p style="margin-top:8px">' + c.button('Open incident INC-0399', { href: '#/assurance/incidents/INC-0399', size: 'sm', kind: 'danger', icon: 'alert' }) + ' ' + c.button('Open ' + P(3882), { href: '#/assurance/proof/3882', size: 'sm' }) + '</p></div></div>' +
          c.callout({ kind: 'caveat', title: 'Preview of the incident state.', body: '<p>Kaveri Spinning Mills’ chain is continuous. This view shows what the screen says when a nightly run finds a break, so it can be reviewed before it is ever needed.</p>' });
        var brk = range(3878, 3886).reverse();
        standingHtml = chainStanding({ entries: brk.slice(2, 7).map(function (x) { return { seq: x.seq, digest: x.digest, prev: x.seq === 3882 ? ZERO_DIGEST : x.prev, writeType: x.wt, outcome: x.platform ? 'refused' : x.out, at: fmt.dateTime(x.at), actorKind: x.kind === 'person' ? 'person' : 'agent', href: '#/assurance/proof/' + x.seq }; }), standing: 'break', breakAt: 3882, scope: '19 of 23 write types', count: 'first failure at seq 3,882 of 1–4,041', checkedAt: '02:10 IST · detected 02:11' }) + '<div style="margin-top:12px">' + strip(brk, 3882) + '</div>';
      } else if (st === 'not-checked') {
        standingHtml = chainStanding({ entries: head.slice(0, 4).map(function (x) { return { seq: x.seq, digest: x.digest, prev: x.prev, writeType: x.wt, outcome: x.platform ? 'refused' : x.out, at: fmt.time(x.at), actorKind: x.kind === 'person' ? 'person' : 'agent', href: '#/assurance/proof/' + x.seq }; }).reverse(), standing: 'not_checked', scope: 'seq 4,042–4,112', count: '71 entries written after last night’s run', checkedAt: 'head re-walk paused' }) +
          '<p class="ac-muted-note" style="margin-top:8px">Seq 1–4,041 were continuous at 02:10 IST. The 71 entries after that are Not checked until the head re-walk resumes or tonight’s run completes. Not checked is never shown as a pass.</p>';
      } else {
        standingHtml = chainStanding({ entries: head.slice(0, 5).map(function (x) { return { seq: x.seq, digest: x.digest, prev: x.prev, writeType: x.wt, outcome: x.platform ? 'refused' : x.out, at: fmt.time(x.at), actorKind: x.kind === 'person' ? 'person' : 'agent', href: '#/assurance/proof/' + x.seq }; }).reverse(), count: 'seq 1–' + num(HEAD) + ' · ' + num(HEAD) + ' entries', checkedAt: 'nightly 02:10 IST (1–4,041) · head re-walked ' + fmt.rel(E1.ago(2)) + ' (4,042–4,112)' }) +
          '<div style="margin-top:12px">' + strip(range(4090, HEAD)) + '</div>';
      }
      var tabs = c.tabs([
        { id: 'standing', label: 'Standing', href: E1.href('/assurance/chain', q(query, { tab: null })) },
        { id: 'runs', label: 'Nightly runs', href: E1.href('/assurance/chain', q(query, { tab: 'runs' })), count: NIGHTLY.length },
        { id: 'verify', label: 'Verify a range', href: E1.href('/assurance/chain', q(query, { tab: 'verify' })) }
      ], tab, { label: 'Chain views' });
      var runsTbl = c.table({ caption: 'Nightly integrity runs', dense: true, columns: [
        { key: 'id', label: 'Run', mono: true },
        { key: 'at', label: 'Started', render: function (r) { return whenCell(r.at); } },
        { key: 'range', label: 'Range', mono: true, render: function (r) { return 'seq ' + num(r.from) + '–' + num(r.to); } },
        { key: 'n', label: 'Records', align: 'right', mono: true, render: function (r) { return r.verdict === 'not_checked' ? '0' : num(r.to - r.from + 1); } },
        { key: 'wts', label: 'Write types (printed, never implied)', render: function (r) { return r.wts ? num(r.wts) + ' of 23' : '<span class="e1-muted">none</span>'; } },
        { key: 'v', label: 'Verdict', render: function (r) { return tri(r.verdict) + (r.note ? '<div class="e1-caption e1-muted" style="margin-top:4px;white-space:normal;max-width:280px">' + esc(r.note) + '</div>' : ''); } },
        { key: 'dur', label: 'Took', mono: true }, { key: 'worker', label: 'Worker', mono: true }
      ], rows: st === 'break' ? [{ id: 'ir-2026-09-24', at: iso(24, '02:10'), from: 1, to: 4041, verdict: 'break', wts: 19, dur: '38s', worker: '1.4.2', note: 'FAIL at seq 3,882: prev_digest mismatch, expected a376… got 0000…' }].concat(NIGHTLY.slice(1)) : NIGHTLY,
        empty: { title: 'No nightly runs yet', why: 'The first run starts at 02:10 IST after the tenant’s first governed write.' } });
      var verifyForm = c.card({ title: 'Verify a range', body:
        '<form class="ac-form" data-ac-verify>' + c.field('From seq', c.input({ id: 'ac-vf', value: String(st === 'break' ? 3870 : 4090), mono: true, attrs: 'inputmode="numeric"' }), { id: 'ac-vf' }) +
        c.field('To seq', c.input({ id: 'ac-vt', value: String(st === 'break' ? 3890 : HEAD), mono: true, attrs: 'inputmode="numeric"' }), { id: 'ac-vt' }) +
        c.field('Scope', c.select({ id: 'ac-vs', options: [{ value: 'full', label: 'Full records (recompute every preimage)' }, { value: 'links', label: 'Links only (prev_digest walk)' }] }), { id: 'ac-vs' }) +
        c.button('Verify', { kind: 'primary', type: 'submit', icon: 'chain' }) + '</form>' +
        '<p class="ac-muted-note" style="margin-top:12px">Returns continuous, or the first failure with its sequence number, field and reason. At L1, verify requires us: the check runs on elan1’s infrastructure.</p>' });
      var body = tab === 'runs' ? runsTbl : tab === 'verify' ? verifyForm : standingHtml;
      return page(
        ph({ title: 'Chain standing', lead: 'Is the record complete and unbroken? Continuity is three-valued — continuous, break at a sequence number, or not checked — and always printed with its scope and count.',
          actions: stateMenu('/assurance/chain', [['Continuous (today)', ''], ['Not checked over a range', 'not-checked'], ['Break at seq 3,882 (preview)', 'break']]) + c.button('Verify the whole chain', { kind: 'primary', icon: 'chain', attrs: 'data-action="ac-verify" data-from="1" data-to="' + HEAD + '"' + (st === 'break' ? ' data-broken="1"' : '') }),
          meta: '<div class="ac-freshrow">' + freshAt('Nightly full walk', iso(24, '02:10')) + fresh('Head re-walked', 2) + freshAt('Chain-head receipt sent', iso(24, '02:15')) + '</div>' }) +
        banner + tabs + body +
        '<div class="ac-grid ac-grid--3">' +
        qcard({ q: 'Could the chain be cut at the end without anyone noticing?', body: '<p class="e1-caption">A chain cut at 4,000 of 4,200 is internally consistent and reads as complete. At L1, reconciliation against ERPNext — not chain verification — does the real work: every committed change in the target must have a record.</p>', foot: linkArrow('Reconciliation, last night: 0 mismatches', '#/assurance/reconciliation') }) +
        qcard({ q: 'Who could check this without trusting elan1?', body: '<p class="e1-caption">Nobody yet. At L1, verify requires us. From Level 2 a party holding our key fingerprint can check an evidence bundle on their own machine.</p>', foot: linkArrow('What each level lets you say', '#/assurance/level') }) +
        qcard({ q: 'What does the tenant hold independently of us?', body: '<p class="e1-caption">A daily chain-head receipt: at 02:15 IST the head seq and digest go to your notice contact, Meenakshi Iyer, by e-mail. It is not an anchor and is never called one — it lets you notice if a head you were told about later changes.</p>', foot: '<span class="e1-caption e1-mono">head ' + P(4041) + ' · ' + esc(fmt.shortHash(digest(4041), 8, 8)) + '</span>' }) +
        '</div>'
      );
    },
    mount: function (el, p, query) {
      var f = el.querySelector('[data-ac-verify]');
      if (f) f.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var a = parseSeq(el.querySelector('#ac-vf').value), b = parseSeq(el.querySelector('#ac-vt').value);
        if (isNaN(a) || isNaN(b) || a < 1 || b < a) { E1.toast('Give a range with From at least 1 and To not below From.', 'warning', { title: 'Check the range' }); return; }
        if (b > HEAD) { E1.toast('The chain ends at ' + P(HEAD) + '. Verifying up to the head instead.', 'info'); b = HEAD; }
        var probe = document.createElement('span'); probe.setAttribute('data-from', a); probe.setAttribute('data-to', b);
        if (query.state === 'break' && a <= 3882 && b >= 3882) probe.setAttribute('data-broken', '1');
        acVerify(probe);
      });
    }
  });
  function acVerify(el) {
    var from = Number(el.getAttribute('data-from')) || 1, to = Number(el.getAttribute('data-to')) || HEAD;
    var d = E1.drawer({ title: 'Verify seq ' + num(from) + '–' + num(to), eyebrow: 'On-demand verify · KernelPort verify()', body: c.skeleton({ kind: 'card' }), actions: [{ label: 'Close', kind: 'secondary' }, { label: 'Open the first entry', kind: 'primary', href: '#/assurance/proof/' + from }] });
    setTimeout(function () { var b = d.el.querySelector('.e1-drawer__body') || d.el; b.innerHTML = verifyResult(from, to, el.getAttribute('data-broken') === '1'); E1.announce('Verification finished for seq ' + from + ' to ' + to); }, 650);
  }
  E1.action('ac-verify', acVerify);

  /* ------------------------------------------------------------------------
     /assurance/coverage — write types covered vs not checked (live vs modelled)
     ------------------------------------------------------------------------ */
  var COVER = [
    ['erp.sales_invoice.submit', 1911, 612, 12, 9, 12], ['erp.payment_entry.submit', 1034, 420, 5, 5, 5], ['erp.stock_entry.submit', 812, 390, 7, 7, 7], ['erp.purchase_invoice.submit', 574, 388, 9, 6, 9],
    ['platform.obligation.resolve', 402, 244, 6, 6, 6], ['erp.purchase_receipt.submit', 212, 180, 6, 3, 6], ['erp.purchase_order.submit', 171, 210, 9, 5, 9], ['erp.delivery_note.submit', 148, 160, 6, 2, 6],
    ['erp.customer.update', 36, 90, 6, 2, 6], ['erp.supplier.create', 31, 120, 7, 3, 7], ['erp.journal_entry.submit', 29, 140, 9, 3, 8], ['erp.customer.create', 18, 110, 6, 2, 6],
    ['erp.credit_limit.change', 14, 80, 8, 2, 8], ['erp.credit_note.submit', 11, 96, 8, 1, 8], ['erp.sales_invoice.cancel', 9, 88, 8, 1, 8], ['platform.declaration.certify', 7, 40, 5, 1, 5],
    ['erp.price_list.update', 6, 64, 8, 1, 8], ['platform.autonomy.grant', 5, 36, 5, 1, 5], ['erp.payment_run.submit', 3, 72, 10, 0, 10],
    ['erp.period.close', 0, 24, 8, 0, 8], ['erp.gstr1.file', 0, 18, 9, 0, 7], ['platform.tenant.stop', 0, 12, 4, 0, 4], ['platform.breakglass', 0, 6, 4, 0, 3]
  ].map(function (r) { return { wt: r[0], live: r[1], modelled: r[2], reach: r[3], seenLive: r[4], seenFix: r[5] }; });
  route('/assurance/coverage', {
    title: 'Coverage', section: 'coverage', keywords: 'coverage write types live modelled sandbox fixtures refusal paths',
    render: function (p, query) {
      var view = query.view || 'all';
      var live = COVER.filter(function (r) { return r.live > 0; }).length, full = COVER.filter(function (r) { return r.reach && r.seenLive === r.reach; }).length;
      var modelledOnly = COVER.filter(function (r) { return !r.live; }).length, fixGap = COVER.filter(function (r) { return r.seenFix < r.reach; }).length;
      var rows = COVER.filter(function (r) { return view === 'live' ? r.live > 0 : view === 'modelled' ? !r.live : view === 'paths' ? r.seenLive < r.reach : true; });
      return page(
        ph({ title: 'Coverage', lead: 'Which write types does the evidence actually cover? Always a count of 23 — live proof from this tenant is shown apart from modelled proof from the reference tenant, never merged.',
          actions: c.button('Proof by write type', { href: '#/assurance/proof', icon: 'proof' }) + c.button('Write types', { href: '#/records/write-types', icon: 'records', kind: 'ghost' }),
          meta: '<div class="ac-freshrow">' + freshAt('Coverage computed with the nightly run', iso(24, '02:10')) + '</div>' }) +
        '<div class="ac-kpis">' +
        '<a class="ac-kpi" href="' + E1.href('/assurance/coverage', { view: 'live' }) + '"><span class="e1-label">Live evidence</span><span class="ac-kpi__v">' + live + ' of 23</span><span class="ac-kpi__n">write types with mode: live entries</span></a>' +
        '<a class="ac-kpi" href="' + E1.href('/assurance/coverage', { view: 'modelled' }) + '"><span class="e1-label">Modelled only</span><span class="ac-kpi__v">' + modelledOnly + ' of 23</span><span class="ac-kpi__n">sandbox fixtures, no live write yet</span></a>' +
        '<a class="ac-kpi" href="' + E1.href('/assurance/coverage', { view: 'paths' }) + '"><span class="e1-label">Every refusal path seen live</span><span class="ac-kpi__v">' + full + ' of 23</span><span class="ac-kpi__n">all reachable codes observed in production</span></a>' +
        '<div class="ac-kpi"><span class="e1-label">Fixture gaps</span><span class="ac-kpi__v">' + fixGap + '</span><span class="ac-kpi__n">write types with a reachable code no fixture exercises</span></div></div>' +
        c.callout({ kind: 'rule', title: 'Why the count sits next to the word.', body: '<p>“A chain that verifies over three of twenty-three write types is a verified chain over almost nothing, and it reads identically on screen unless the screen says so.” Chain standing on this tenant is continuous over 19 of 23 write types; the other 4 have no live entries to check.</p>' }) +
        c.tabs([{ id: 'all', label: 'All write types', href: '#/assurance/coverage', count: 23 }, { id: 'live', label: 'Live', href: E1.href('/assurance/coverage', { view: 'live' }), count: live }, { id: 'modelled', label: 'Modelled only', href: E1.href('/assurance/coverage', { view: 'modelled' }), count: modelledOnly }, { id: 'paths', label: 'Refusal paths incomplete', href: E1.href('/assurance/coverage', { view: 'paths' }), count: 23 - full }], view, { label: 'Coverage views' }) +
        c.table({ caption: 'Coverage by write type', dense: true, rowHref: function (r) { return '#/records/write-types/' + r.wt; }, columns: [
          { key: 'wt', label: 'Write type', render: function (r) { return wtCell(r.wt); } },
          { key: 'live', label: 'Live entries', align: 'right', render: function (r) { return r.live ? '<a class="e1-mono" href="' + E1.href('/assurance/proof', { wt: r.wt }) + '">' + num(r.live) + '</a>' : '<span class="e1-mono">0</span>'; } },
          { key: 'modelled', label: 'Modelled (sandbox)', align: 'right', mono: true, render: function (r) { return num(r.modelled); } },
          { key: 'st', label: 'Chain standing over it', render: function (r) { return r.live ? tri('continuous', 'Continuous') : tri('not_checked', 'Not checked · no live entries'); } },
          { key: 'last', label: 'Last verified', render: function (r) { return r.live ? '<span class="e1-mono">02:10 IST</span>' : muted('—'); } },
          { key: 'paths', label: 'Refusal codes seen live', render: function (r) { return '<span class="e1-mono">' + r.seenLive + ' of ' + r.reach + '</span> ' + c.progress(r.seenLive, r.reach, {}); } },
          { key: 'fix', label: 'In fixtures', render: function (r) { return r.seenFix === r.reach ? '<span class="e1-mono">' + r.seenFix + ' of ' + r.reach + '</span>' : '<span class="e1-mono">' + r.seenFix + ' of ' + r.reach + '</span> ' + c.badge('warning', 'Add a fixture that fails', { subtle: true }); } }
        ], rows: rows, empty: { title: 'Nothing in this view', why: 'Every write type is outside this filter.', action: { label: 'Show all 23', href: '#/assurance/coverage' } } }) +
        '<p class="ac-muted-note">Modelled means entries with mode: sandbox from the reference tenant and simulation; live means mode: live on this tenant. A write type with no live entry is Not checked, not passed.</p>'
      );
    }
  });

  /* ------------------------------------------------------------------------
     /assurance/refusals — list, trends, by code (refusals are evidence, ₹0)
     ------------------------------------------------------------------------ */
  route('/assurance/refusals', {
    title: 'Refusals', section: 'refusals', keywords: 'refusals not done refused codes trends evidence zero',
    render: function (p, query) {
      var view = query.view || 'list', st = query.state;
      var ct = refClassTotals(), allEv = MT.committed + MT.refused + MT.escalated;
      var win = range(HEAD - 199, HEAD).filter(function (e) { return e.out === 'refused'; });
      var list = win.filter(function (e) {
        return (!query.cls || reg(e.code).cls === query.cls) && (!query.kind || e.kind === query.kind) && (!query.ch || e.ch === query.ch) && (!query.code || e.code === query.code);
      });
      function chip(key, val, label) { var ex = {}; ex[key] = query[key] === val ? null : val; return { label: label, href: E1.href('/assurance/refusals', q(query, ex)), active: query[key] === val }; }
      var listHtml = c.filters([chip('cls', 'gate', 'Gate'), chip('cls', 'policy', 'Policy'), chip('cls', 'platform', 'Our failures'), chip('kind', 'agent', 'Agent'), chip('kind', 'person', 'Person'), chip('ch', 'web', 'web'), chip('ch', 'api', 'api'), chip('ch', 'mcp', 'mcp')], { label: 'Show', clearHref: '#/assurance/refusals' }) +
        '<div style="margin-top:12px">' + c.table({ caption: 'Refusals', dense: true, rowHref: function (e) { return '#/assurance/proof/' + e.seq; }, columns: [
          { key: 'seq', label: 'Seq', mono: true, render: function (e) { return P(e.seq); } },
          { key: 'at', label: 'Time', render: function (e) { return whenCell(e.at); } },
          { key: 'wt', label: 'Write type', render: function (e) { return wtCell(e.wt); } },
          { key: 'actor', label: 'Actor', render: function (e) { return actorCell(e); } },
          { key: 'code', label: 'Code', render: function (e) { return '<a class="e1-mono" href="#/assurance/refusals/' + esc(e.code) + '" style="font-size:var(--text-caption)">' + esc(e.code) + '</a><div class="e1-caption">' + esc(reg(e.code).title) + '</div>'; } },
          { key: 'cls', label: 'Class', render: function (e) { var k = reg(e.code).cls; return k === 'platform' ? c.badge('critical', 'Our failure', { subtle: true }) : esc(k); } },
          { key: 'rung', label: 'Rung', mono: true, nowrap: true, render: function (e) { return esc(String(e.rung)) + (e.gate ? ' · ' + GATE_ID[e.gate] : ''); } },
          { key: 'm', label: 'Meter', align: 'right', render: function () { return '<span class="e1-mono">0 · ₹0</span>'; } }
        ], rows: list, empty: { title: 'No refusals match', why: 'Nothing in the most recent 200 entries was refused with these filters. That is a real answer: refusals are recorded like commits, so none are hidden.', action: { label: 'Clear filters', href: '#/assurance/refusals' }, icon: 'filter' } }) + '</div>' +
        '<p class="ac-muted-note" style="margin-top:8px">Showing refusals in seq ' + num(HEAD - 199) + '–' + num(HEAD) + '. ' + '<a href="' + E1.href('/assurance/proof', { outcome: 'refused', from: HEAD - 999, to: HEAD }) + '">Open the last 1,000 entries, refusals only</a>.</p>';
      var byCode = '<div class="ac-grid ac-grid--2">' + c.card({ body: c.barChart({ title: 'Refusals by code, 1–24 Sep', horizontal: true, data: REF_COUNTS.map(function (r) { return { label: r[0].replace(/^(GATE|POLICY|PLATFORM)\./, ''), value: r[1] }; }) }) }) +
        c.card({ flush: true, body: c.table({ caption: 'Refusals by code', dense: true, rowHref: function (r) { return '#/assurance/refusals/' + r[0]; }, columns: [
          { key: 0, label: 'Code', render: function (r) { return '<span class="e1-mono" style="font-size:var(--text-caption)">' + esc(r[0]) + '</span><div class="e1-caption">' + esc(reg(r[0]).title) + '</div>'; } },
          { key: 'r', label: 'Rung', mono: true, render: function (r) { return esc(reg(r[0]).rung); } },
          { key: 1, label: 'Count', align: 'right', mono: true, render: function (r) { return num(r[1]); } },
          { key: 'z', label: 'Billed', align: 'right', mono: true, render: function () { return '₹0'; } }
        ], rows: REF_COUNTS }) }) + '</div>';
      var weeks = ['27 Aug', '3 Sep', '10 Sep', '17 Sep', '24 Sep'];
      var trend = '<div class="ac-grid ac-grid--2">' + c.card({ body: c.lineChart({ title: 'Refusal rate by week', unit: '% of governed writes', labels: weeks, series: [{ name: 'All refusals', values: [5.6, 4.9, 4.3, 3.9, 4.1] }, { name: 'Our failures', values: [0.3, 0.1, 0.1, 0.0, 0.1], muted: true }], format: function (n) { return n.toFixed(1) + '%'; } }) }) +
        c.card({ title: 'Refusal rate beside cost per governed action', body: '<p class="e1-caption">Published side by side every month, so that a falling cost cannot hide a loosened gate.</p>' +
          '<div class="ac-line"><span>Refusal rate, 1–24 Sep</span><span>' + (MT.refused / allEv * 100).toFixed(1) + '%</span></div>' +
          '<div class="ac-line"><span>Cost per governed action (elan1’s cost to serve)</span><span>not yet measured</span></div>' +
          '<div class="ac-line"><span>Modelled cost per governed action</span><span>₹0.20 ' + tag('modelled') + '</span></div>' +
          '<div class="ac-line"><span>Price of a refusal</span><span>₹0 · always</span></div>' }) + '</div>';
      var body = st === 'empty' ? c.empty({ title: 'No refusals this period', why: 'Nothing attempted on this tenant was refused between 1 and 24 September. Refusals would appear here at ₹0; they have not happened either.', fill: 'A period with no refusals at all is worth a look: check that gates are enabled and fixtures exercise them.', icon: 'refuse', action: { label: 'Coverage of refusal paths', href: '#/assurance/coverage?view=paths' } })
        : view === 'codes' ? byCode : view === 'trend' ? trend : listHtml;
      return page(
        ph({ title: 'Refusals', lead: 'What did the system say no to, and why? Refusals are evidence, not noise: each one is a typed, recorded outcome with an operator action, and it costs ₹0.',
          actions: stateMenu('/assurance/refusals', [['This period', ''], ['No refusals', 'empty']]) + c.button('Refusal register', { href: '#/assurance/refusals/register', icon: 'book' }),
          meta: '<div class="ac-freshrow"><span class="e1-caption">Period 1–24 Sep 2026 · IST</span>' + fresh('Updated', 1) + '</div>' }) +
        '<div class="ac-kpis">' +
        '<a class="ac-kpi" href="' + E1.href('/assurance/proof', { outcome: 'refused' }) + '"><span class="e1-label">Refused this period</span><span class="ac-kpi__v">' + num(MT.refused) + '</span><span class="ac-kpi__n">₹0 billed · ' + (MT.refused / allEv * 100).toFixed(1) + '% of governed writes</span></a>' +
        '<a class="ac-kpi" href="' + E1.href('/assurance/refusals', { cls: 'gate' }) + '"><span class="e1-label">Gate class</span><span class="ac-kpi__v">' + num(ct.gate) + '</span><span class="ac-kpi__n">a declared gate did not hold</span></a>' +
        '<a class="ac-kpi" href="' + E1.href('/assurance/refusals', { cls: 'policy' }) + '"><span class="e1-label">Policy class</span><span class="ac-kpi__v">' + num(ct.policy) + '</span><span class="ac-kpi__n">a rule, grant or approval said no</span></a>' +
        '<a class="ac-kpi" href="' + E1.href('/assurance/refusals', { cls: 'platform' }) + '"><span class="e1-label">Our failures</span><span class="ac-kpi__v">' + num(ct.platform) + '</span><span class="ac-kpi__n">PLATFORM.* · paged · not billed</span></a></div>' +
        c.tabs([{ id: 'list', label: 'Refusals', href: E1.href('/assurance/refusals', q(query, { view: null })) }, { id: 'codes', label: 'By code', href: E1.href('/assurance/refusals', { view: 'codes' }), count: REF_COUNTS.length }, { id: 'trend', label: 'Trend', href: E1.href('/assurance/refusals', { view: 'trend' }) }], view, { label: 'Refusal views' }) +
        body
      );
    }
  });

  /* ------------------------------------------------------------------------
     /assurance/refusals/register — the closed register
     ------------------------------------------------------------------------ */
  route('/assurance/refusals/register', {
    title: 'Refusal register', section: 'refusals', crumbs: crumbsA([['Refusals', '#/assurance/refusals']]), keywords: 'refusal register codes closed list operator action',
    render: function (p, query) {
      var f = query.show || 'l1';
      var groups = { l1: REG.filter(function (r) { return r.active === 'L1'; }), define: REG.filter(function (r) { return r.active === 'define'; }), proposed: REG.filter(function (r) { return r.active === 'proposed'; }), l3: REG.filter(function (r) { return r.active === 'L3'; }) };
      var rows = f === 'all' ? REG : groups[f] || groups.l1;
      var STATUS = { L1: c.badge('good', 'In the L1 register', { subtle: true, icon: 'check' }), define: c.badge('info', 'define only', { subtle: true, icon: 'info' }), proposed: c.badge('neutral', 'Proposed', { subtle: true, icon: 'minus' }), L3: c.badge('neutral', 'L3 — specified', { subtle: true, icon: 'lock' }) };
      return page(
        ph({ title: 'Refusal register', lead: 'The closed list of every way elan1 can say no. Each code maps to one rung, one class and one operator action; a code whose screen offers no next action is not finished.',
          actions: c.button('Public pages for developers', { href: '#/developers/refusals', icon: 'code', kind: 'ghost' }) + c.button('Refusals this period', { href: '#/assurance/refusals', icon: 'refuse' }) }) +
        '<div class="ac-banner ac-banner--warning" role="note">' + c.icon('info', 18) + '<div><strong>43 codes in 3 classes (policy 14 · gate 19 · platform 10), 28 active at L1 — as stated in E02 §06.</strong><p>35 codes are named in the published register below (32 runtime + 3 define-only). The other 8 are Level 2 codes for signing, anchoring, bundles and verifier profiles that are not yet published, and the active-at-L1 set of 28 is not enumerated. We show every named code and do not invent the rest. ' + srcConflict('E02 names 32 runtime codes plus 3 define codes; the headline says 43 with 28 active at L1.') + '</p></div></div>' +
        '<div class="ac-tablebar">' + c.tabs([{ id: 'l1', label: 'Runtime, L1 register', href: '#/assurance/refusals/register', count: groups.l1.length }, { id: 'define', label: 'define only', href: E1.href('/assurance/refusals/register', { show: 'define' }), count: groups.define.length }, { id: 'proposed', label: 'Proposed', href: E1.href('/assurance/refusals/register', { show: 'proposed' }), count: groups.proposed.length }, { id: 'l3', label: 'L3 specified', href: E1.href('/assurance/refusals/register', { show: 'l3' }), count: groups.l3.length }, { id: 'all', label: 'Everything named', href: E1.href('/assurance/refusals/register', { show: 'all' }), count: REG.length }], f, { label: 'Register views' }) +
        '<div style="min-width:260px">' + c.searchBox({ id: 'ac-reg-q', placeholder: 'Filter codes, titles or actions', label: 'Filter the register' }) + '</div></div>' +
        '<div data-ac-reg>' + c.table({ caption: 'Refusal register', dense: true, rowHref: function (r) { return '#/assurance/refusals/' + r.code; }, columns: [
          { key: 'code', label: 'Code', render: function (r) { return '<span class="e1-mono" style="font-size:var(--text-caption)">' + esc(r.code) + '</span>'; } },
          { key: 'cls', label: 'Class · rung', render: function (r) { return esc(r.cls) + ' · <span class="e1-mono">' + esc(r.rung) + '</span>' + (r.gateId ? ' · <span class="e1-mono">' + r.gateId + '</span>' : ''); } },
          { key: 'title', label: 'On screen', render: function (r) { return '<strong class="e1-strong">' + esc(r.title) + '</strong><div class="e1-caption e1-muted">' + esc(r.means) + '</div>'; } },
          { key: 'action', label: 'Operator action (verbatim)', render: function (r) { return '<span class="e1-caption">“' + esc(r.action) + '”</span>'; } },
          { key: 'btn', label: 'Next step on screen', render: function (r) { return '<a href="' + esc(r.href) + '">' + esc(r.button) + '</a>'; } },
          { key: 'n', label: 'This period', align: 'right', mono: true, render: function (r) { return REF_BY_CODE[r.code] ? num(REF_BY_CODE[r.code]) : '0'; } },
          { key: 'st', label: 'Status', render: function (r) { return STATUS[r.active] || ''; } }
        ], rows: rows }) + '</div>' +
        '<p class="ac-muted-note">Not in the kernel register: rung1 Voice channel codes (VOICE_*), rung1 APPROVAL_EXPIRED and GATE_AUDIT_TRAIL_DISABLED. Plain-words titles are proposed wording awaiting sign-off, except “Not done — credit limit”, which is sourced; a precondition title is generated from the failing predicate’s declared label.</p>'
      );
    },
    mount: function (el) {
      var inp = el.querySelector('#ac-reg-q'); if (!inp) return;
      inp.addEventListener('input', function () {
        var v = inp.value.toLowerCase(), shown = 0;
        Array.prototype.forEach.call(el.querySelectorAll('[data-ac-reg] tbody tr'), function (tr) { var ok = tr.textContent.toLowerCase().indexOf(v) >= 0; tr.hidden = !ok; if (ok) shown++; });
        E1.announce(shown + ' codes shown');
      });
    }
  });

  /* ------------------------------------------------------------------------
     /assurance/refusals/:code
     ------------------------------------------------------------------------ */
  var CODE_EXAMPLE = { 'GATE.PRECONDITION_FAILED': 4098, 'GATE.COUNTERPARTY_UNKNOWN': 4092, 'POLICY.AUTONOMY_INSUFFICIENT': 4106, 'GATE.BUDGET_EXHAUSTED': 4108, 'GATE.DUAL_CONTROL_SAME_ACTOR': 4096, 'POLICY.OBLIGATION_EXPIRED': 4110, 'PLATFORM.TARGET_UNREACHABLE': 4102, 'GATE.SANDBOX_DIVERGED': 4112 };
  route('/assurance/refusals/:code', {
    title: function (p) { return REG_BY[p.code] ? p.code : 'Refusal code'; }, section: 'refusals', example: '/assurance/refusals/GATE.PRECONDITION_FAILED',
    crumbs: crumbsA([['Refusals', '#/assurance/refusals'], ['Register', '#/assurance/refusals/register']]), keywords: 'refusal code detail',
    render: function (p) {
      var r = REG_BY[p.code];
      if (!r) return page(ph({ title: 'Unknown refusal code', lead: 'This code is not in elan1’s closed register.', back: ['Refusal register', '#/assurance/refusals/register'] }) +
        c.empty({ title: '“' + p.code + '” is not a code elan1 can return', why: 'The register is closed: every refusal elan1 returns is one of the named codes, each tied to one rung and one operator action. A new code needs 30 days’ internal and 60 days’ external notice.', fill: 'If a system showed you this code, it did not come from the elan1 kernel — for example a rung1 Voice channel code.', icon: 'book', action: { label: 'Open the register', href: '#/assurance/refusals/register' } }));
      var ex = CODE_EXAMPLE[r.code] ? entry(CODE_EXAMPLE[r.code]) : null;
      var occ = range(HEAD - 199, HEAD).filter(function (e) { return e.code === r.code; });
      var count = REF_BY_CODE[r.code] || 0;
      var platform = r.cls === 'platform', stopped = r.code === 'POLICY.TENANT_STOPPED';
      var example = c.refusal({ code: r.code, title: ex && ex.words ? r.title : r.title, ruleName: r.gateId ? r.gateId + ' ' + (GATE_NAME[Object.keys(GATE_ID).filter(function (k) { return GATE_ID[k] === r.gateId; })[0]] || '') : 'Rung ' + r.rung, version: 'erp.ar v7 · policy 11', rule: ex ? (ex.words || r.means) : r.means, numbers: ex ? (NUMS[ex.seq] || []) : [], action: { label: r.button, href: r.href }, proofHref: ex ? '#/assurance/proof/' + ex.seq : null, at: ex ? fmt.dateTime(ex.at) : null });
      return page(
        ph({ eyebrow: r.cls + ' class · rung ' + r.rung + (r.gateId ? ' · ' + r.gateId : ''), title: r.title, lead: r.means + '. Operator action: “' + r.action + '”',
          actions: c.button('Public page', { href: '#/developers/refusals/' + r.code, icon: 'code', kind: 'ghost' }) + c.button(r.button, { href: r.href, kind: 'primary', iconRight: 'arrow-right' }),
          meta: '<div class="ac-freshrow"><span class="e1-mono e1-caption">' + esc(r.code) + '</span>' + ({ L1: c.badge('good', 'In the L1 register', { subtle: true }), define: c.badge('info', 'define only', { subtle: true }), proposed: c.badge('neutral', 'Proposed', { subtle: true }), L3: c.badge('neutral', 'L3 — specified', { subtle: true }) }[r.active] || '') + '</div>' }) +
        '<div class="ac-split"><div class="ac-page" style="gap:var(--space-5)">' +
        c.section({ id: 'looks', title: 'What the person who tried sees', lead: ex ? 'Rendered from ' + P(ex.seq) + ' on this tenant.' : 'Rendered from the register; no example on this tenant yet.', body: example }) +
        c.section({ id: 'occ', title: 'On this tenant', lead: count ? num(count) + ' this period, all at ₹0.' : 'Not seen this period.', body: occ.length ? c.table({ caption: 'Occurrences', dense: true, rowHref: function (e) { return '#/assurance/proof/' + e.seq; }, columns: [
          { key: 'seq', label: 'Seq', mono: true, render: function (e) { return P(e.seq); } }, { key: 'at', label: 'Time', render: function (e) { return whenCell(e.at); } }, { key: 'wt', label: 'Write type', render: function (e) { return wtCell(e.wt); } }, { key: 'a', label: 'Actor', render: function (e) { return actorCell(e); } }, { key: 'm', label: 'Meter', align: 'right', render: function () { return '<span class="e1-mono">₹0</span>'; } }
        ], rows: occ }) : c.empty({ compact: true, title: count ? 'None in the most recent 200 entries' : 'Not seen on this tenant', why: count ? 'The ' + num(count) + ' occurrences this period are older than the last 200 entries.' : 'No write on Kaveri Spinning Mills has been refused with this code. The reference tenant’s fixtures exercise it.', action: { label: 'Search the proof log', href: E1.href('/assurance/proof', { q: r.code, from: HEAD - 999, to: HEAD }) }, icon: 'refuse' }) }) +
        '</div><aside class="ac-side">' +
        c.card({ title: 'How this code behaves', body: c.kv([['Class', r.cls], ['Rung', r.rung, { mono: true }], ['Gate', r.gateId || '—', { mono: true }], ['HTTP', stopped ? '200 · outcome refused' : '200 · outcome refused', { mono: true }], ['Proof entry', stopped ? 'None — a stopped workspace writes nothing' : 'Yes · record_id zeroed, record_version 0'], ['Meter', stopped ? 'No event' : 'Quantity 0 · ₹0'], ['Retry', platform ? 'Yes, with the same intent_id' : 'Never retry a refusal'], ['Pages someone', platform ? 'Yes — every platform refusal pages' : 'No']], { compact: true }) }) +
        (platform ? c.callout({ kind: 'critical', title: 'This is our failure, not a rule.', body: '<p>Nothing was changed, you have not been billed, and we have been paged. A governance layer that reported its own failures as policy refusals would be lying to you.</p>' }) : c.callout({ kind: 'rule', title: 'A refusal is a correct outcome.', body: '<p>It returns HTTP 200, carries a full record and meters at zero. It is never shown as an error.</p>' })) +
        '</aside></div>'
      );
    }
  });

  /* ------------------------------------------------------------------------
     /assurance/enforcement — modes per channel × write type
     ------------------------------------------------------------------------ */
  var SENT = {
    enforced: 'This write could not have occurred without passing the gates.',
    advisory: 'Every proposed write was evaluated against a versioned policy and the decision is recorded.'
  };
  var CHANNELS = [['web', 'Web console', 'submit'], ['api', 'API', 'submit'], ['mcp', 'MCP', 'submit'], ['mobile', 'Mobile', 'approve'], ['messaging', 'WhatsApp', 'approve'], ['voice', 'Voice', 'approve']];
  route('/assurance/enforcement', {
    title: 'Enforcement', section: 'enforcement', keywords: 'enforcement mode enforced attested advisory channels credential custody token acceptance',
    render: function (p, query) {
      var adv = query.state === 'advisory';
      function cell(name, ch) {
        var has = wt(name).ch.indexOf(ch[0]) >= 0;
        if (!has) return '<span class="e1-muted" aria-label="Cannot be attempted from this route">—</span>';
        if (adv) return c.tooltip('<span class="ac-cell ac-cell--adv">' + c.icon('eye', 12) + 'Attested advisory</span>', SENT.advisory);
        var mech = ch[0] === 'mcp' ? 'token acceptance' : 'credential custody';
        return c.tooltip('<span class="ac-cell ac-cell--enf">' + c.icon('check', 12) + (ch[2] === 'approve' ? 'Approve · Enforced' : 'Enforced') + '</span>', SENT.enforced + ' Mechanism: ' + mech + '.');
      }
      var rows = (adv ? ['ll.invoice.post', 'll.customer.create', 'll.credit_note.post'] : WT_NAMES);
      var matrix = adv ? c.table({ caption: 'Enforcement by channel and write type (LedgerLoop)', dense: true, columns: [
          { key: 'n', label: 'Write type', render: function (n) { return '<span class="ac-wt"><span>' + esc({ 'll.invoice.post': 'Post invoice', 'll.customer.create': 'Add customer', 'll.credit_note.post': 'Post credit note' }[n]) + '</span><small>' + esc(n) + '</small></span>'; } },
          { key: 'mcp', label: 'MCP', render: function () { return c.tooltip('<span class="ac-cell ac-cell--adv">' + c.icon('eye', 12) + 'Attested advisory</span>', SENT.advisory); } },
          { key: 'web', label: 'Web console', render: function () { return '<span class="e1-muted" aria-label="Cannot be attempted from this route">—</span>'; } },
          { key: 'b', label: 'Boundary', render: function () { return '<span class="e1-caption">Advisory since 15 Sep 2026 · promotion review not started</span>'; } },
          { key: 'f', label: 'Caller-performed writes', align: 'right', mono: true, render: function (n) { return { 'll.invoice.post': '211', 'll.customer.create': '38', 'll.credit_note.post': '9' }[n]; } }
        ], rows: rows })
        : '<div class="ac-matrix">' + c.table({ caption: 'Enforcement by channel and write type', dense: true, stickyHead: true, columns: [{ key: 'n', label: 'Write type', render: function (n) { return wtCell(n); } }].concat(CHANNELS.map(function (ch) { return { key: ch[0], label: ch[1], render: function (n) { return cell(n, ch); } }; })), rows: rows }) + '</div>';
      var modeCards = '<div class="ac-grid ac-grid--2">' +
        c.card({ eyebrow: 'Enforced · credential custody or token acceptance', title: 'The kernel holds the credential', body: sentence('“' + SENT.enforced + '”') + '<p class="e1-caption" style="margin-top:10px">Only the single writer can reach ERPNext, with a one-write credential that lives ten minutes. A second write credential fails the build (C2).</p>' }) +
        c.card({ eyebrow: 'Attested advisory', title: 'The caller holds the credential', body: sentence('“' + SENT.advisory + '”') + '<p class="e1-caption" style="margin-top:10px">May not say: “we block”, “we prevent”, “cannot”, “nothing gets through without us”. Every record carries the caller-performed flag.</p>' }) + '</div>';
      return page(
        ph({ title: 'Enforcement', lead: adv ? 'LedgerLoop’s sandbox tenant runs in Attested advisory: every attempt is evaluated and recorded, and the caller performs the write.' : 'Was every write checked before it happened — and which sentence may you say about it? Mode is declared per channel and write type, recorded beside every entry and printed in any export.',
          actions: stateMenu('/assurance/enforcement', [['This tenant (Enforced)', ''], ['Attested advisory tenant (preview)', 'advisory']]) + c.button('Channels', { href: '#/agents/channels', icon: 'message', kind: 'ghost' }),
          meta: '<div class="ac-freshrow">' + (adv ? c.badge('info', 'Previewing LedgerLoop Software · sandbox tenant', { subtle: true }) : '<span class="e1-caption">23 write types · 6 channels · declared in erp.ar v7, erp.ap v5, erp.stock v3, platform v3</span>') + '</div>' }) +
        (adv ? '<div class="ac-banner ac-banner--info" role="note">' + c.icon('info', 18) + '<div><strong>In this mode the caller holds the credential.</strong><p>elan1 evaluated and recorded every attempt, including refusals; it did not perform the write. 258 records carry the caller-performed flag this period.</p></div></div>'
          : '<div class="ac-banner ac-banner--neutral" style="border-color:var(--state-good-border);background:var(--state-good-bg)" role="note">' + c.icon('check', 18) + '<div><strong>Every declared route on this tenant is Enforced.</strong><p>You may say, of every governed write since 16 Sep 2026: “' + esc(SENT.enforced) + '” Before that date, MCP writes were Attested advisory — see the boundary below.</p></div></div>') +
        modeCards +
        c.section({ id: 'matrix', title: adv ? 'Channels and write types' : 'By channel and write type', lead: 'A dash means the action cannot be attempted from that route at all — it is not a permission question. Hover a cell for the sentence it permits.', body: matrix }) +
        (adv ? c.section({ id: 'promote', title: 'Promotion to Enforced', lead: 'Advisory becomes Enforced per write type, after a review, as a new certified declaration version.', body: '<ol class="ac-check">' + [
          ['1', 'At least 30 days of advisory traffic', '9 of 30 days so far', 'not_measured'], ['2', 'Mechanism chosen: credential custody or token acceptance', 'Not chosen yet', 'not_measured'], ['3', 'Bypass proof against the real target (C2)', 'Not run', 'not_measured'], ['4', 'No long-lived credential anywhere in the caller’s estate', 'Not evidenced', 'not_measured'], ['5', 'Rollback drill, both paths', 'Not run', 'not_measured']
        ].map(function (x) { return '<li><span class="e1-mono">' + x[0] + '</span><div><strong>' + esc(x[1]) + '</strong><p>' + esc(x[2]) + '</p></div>' + tri(x[3]) + '</li>'; }).join('') + '</ol>' })
          : c.section({ id: 'boundary', title: 'Boundaries', lead: 'When a mode changes, the date and the counts on each side are printed in both directions.', body: c.table({ caption: 'Mode boundaries', dense: true, columns: [
            { key: 0, label: 'Route', render: function (r) { return esc(r[0]); } }, { key: 1, label: 'Before', render: function (r) { return r[1]; } }, { key: 2, label: 'Boundary', render: function (r) { return r[2]; } }, { key: 3, label: 'After', render: function (r) { return r[3]; } }, { key: 4, label: 'Review', render: function (r) { return r[4]; } }
          ], rows: [['MCP · erp.purchase_invoice.submit, erp.supplier.create, erp.sales_invoice.submit', 'Attested advisory · seq 1–3,522 · <span class="e1-mono">212</span> caller-performed writes', '16 Sep 2026, 11:00 IST · ' + seqLink(3523), 'Enforced · token acceptance · seq 3,523 →', '<a href="#/work/reviews">Promotion review</a> · certified by Arjun Mehta · ' + seqLink(3522)], ['Web, API, mobile, WhatsApp, voice', 'Enforced from the first write', '—', 'Enforced · credential custody', 'Production review, 2 Sep 2026']] }) })) +
        '<p class="ac-muted-note">Advisory is never described as enforcement. If an Enforced write type ever records an unrecorded write in the target, it reverts to Attested advisory automatically and a P1 is raised.</p>'
      );
    }
  });

  /* ------------------------------------------------------------------------
     /assurance/level — the assurance ladder
     ------------------------------------------------------------------------ */
  route('/assurance/level', {
    title: 'Assurance level', section: 'level', keywords: 'assurance level l1 l2 l3 guarded attested proven claim may say',
    render: function () {
      var cur = E1.state.level, tenantL = 'L1';
      var cols = [
        { L: 'L1', status: 'Building · Phase 1 · available now', claim: 'L1 says the write was controlled.', buyer: 'Operations or finance owner — “can I let this run?”',
          runs: ['Stop check and nine rungs in one order; six gates never skippable', 'evaluate() with no model; A0–A5 autonomy, missing grant = A0', 'A named person approves; dual control at G4', 'Shadow sandbox on every write; 30-day reversal where declared', 'Hash chain of every write, refusal and escalation — unsigned', 'Refusals metered at 0 by a database CHECK'],
          may: 'Checked against versioned rules before it happened; a person approved; tamper-evident to you, the chain holder.', mayNot: ['signed', 'tamper-proof', 'immutable', 'independently verifiable', 'court-ready'], gate: 'Definition of done 1–10 and conformance C1–C14' },
        { L: 'L2', status: 'Frozen specification · after the L2 gate (Phase 3)', claim: 'L2 says a stranger can check that.', buyer: 'The auditor’s counterparty — “can I hand this over?”',
          runs: ['Ed25519 over the same digest at rung 8', 'Key custody per residency domain', 'Merkle root timestamped by two authorities', 'Evidence bundle and a free offline verifier', 'Verifier profiles executing', 'Unanchored head shown on this door'],
          may: 'A party with our key fingerprint, got out of band, can verify this bundle on an air-gapped machine with no elan1 process.', mayNot: ['accepted by MCA / RBI / SEBI', 'court-ready', 'immutable', 'verifies your books'], gate: '12 measurements, including 64 vectors octet-identical in two implementations' },
        { L: 'L3', status: 'Frozen specification · entry is an event (Phase 4)', claim: 'L3 says the record survives us.', buyer: 'The market — “does this survive the vendor?”',
          runs: ['Cross-organisation verification', 'Selective disclosure', 'Customer-held keys; sovereign deployment', 'Earned autonomy A2 → A3', 'Action Receipt published standard', 'Counter-signature by a party that is not elan1'],
          may: 'The format is published; a receipt stays checkable after we are gone.', mayNot: ['tamper-proof', 'regulator-approved', 'transaction genuine', 'standardised'], gate: 'An outside auditor accepts an L2 bundle in a real engagement and says so in writing' }
      ];
      var ladder = '<div class="ac-ladder3">' + cols.map(function (x) {
        var isTenant = x.L === tenantL;
        return '<article class="ac-lv' + (isTenant ? ' is-current' : ' is-spec') + '" aria-label="' + esc(x.L + ' ' + E1.LEVELS[x.L].name) + '">' +
          '<div class="e1-row e1-row--between">' + c.level(x.L) + (isTenant ? c.badge('good', 'Your tenant', { subtle: true }) : c.badge('neutral', 'Specified, not built', { subtle: true, icon: 'lock' })) + '</div>' +
          '<h3>' + esc(x.claim) + '</h3><p class="e1-caption e1-muted" style="margin:0">' + esc(x.status) + '</p>' +
          '<div><p class="e1-label">What runs</p><ul>' + x.runs.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul></div>' +
          '<div><p class="e1-label">May say</p><p class="ac-quote" style="margin-top:4px">“' + esc(x.may) + '”</p></div>' +
          '<div><p class="e1-label">May not say</p><p class="e1-caption" style="margin:4px 0 0">' + x.mayNot.map(function (s) { return '<s>' + esc(s) + '</s>'; }).join(' · ') + '</p></div>' +
          '<div><p class="e1-label">Buyer</p><p class="e1-caption" style="margin:4px 0 0">' + esc(x.buyer) + '</p></div>' +
          '<div><p class="e1-label">Gate</p><p class="e1-caption" style="margin:4px 0 0">' + esc(x.gate) + '</p></div></article>';
      }).join('') + '</div>';
      var pre = [
        ['1', 'Preimage unchanged since the first record', 'Replayed seq 1–4,112 at 02:10 IST; every preimage is Seal v6, 16 fields.', 'passed'],
        ['2', 'Key custody in-domain, with a registered successor', 'No signing keys exist at Level 1. Arrives at L2.', 'not_measured'],
        ['3', 'Anchor interval SLO measured for a month', 'No anchoring at Level 1. Arrives at L2.', 'not_measured'],
        ['4', 'Offline verifier passes the vectors and refuses the tampered bundle', 'Verifier is a frozen specification. Arrives at L2.', 'not_measured'],
        ['5', 'A certified verifier profile for a regime the tenant is in', 'in-mca-audit-trail v1 is specified, not certified.', 'not_measured'],
        ['6', 'Whole-history continuity', 'Continuous · seq 1–4,112 · 19 of 23 write types · 02:10 IST.', 'passed'],
        ['7', 'proof_binding covers the regime’s fields', 'erp.ar v7 binds 6 of the 8 fields the MCA audit-trail profile names; edit_reason and edited_by are not bound.', 'failed']
      ];
      return page(
        ph({ title: 'Assurance level', lead: 'What does each level let you say, and what does it not? A level is a property of the proof and the claim, never of the policy: the same declaration carries across all three.',
          actions: c.button('Preview as L2', { icon: 'eye', attrs: 'data-action="level" data-value="L2"' }) + c.button('Upgrade to L2', { href: '#/assurance/upgrade', kind: 'primary', iconRight: 'arrow-right' }),
          meta: '<div class="ac-freshrow">' + c.level('L1') + '<span class="e1-caption">Kaveri Spinning Mills runs at L1 Guarded</span>' + (cur !== 'L1' ? c.badge('info', 'You are previewing ' + cur + ' ' + E1.LEVELS[cur].name, { subtle: true }) + c.button('Back to L1', { size: 'sm', kind: 'ghost', attrs: 'data-action="level" data-value="L1"' }) : '') + '</div>' }) +
        ladder +
        c.section({ id: 'regulator', title: 'What you may say to your regulator today', body: '<div class="ac-honest">' + c.icon('scale', 20) + '<div><span class="e1-label">L1 · verbatim, E07 §07</span><p>“Our agents cannot write to our books without passing rules we set, a person approves anything material, and we have an unbroken internal record of every attempt including the refusals.”</p></div></div>' +
          '<p class="ac-muted-note" style="margin-top:10px">L1 serves the MCA audit-trail rule, GST e-invoicing, RBI FREE-AI, the DPDP Rules and the EU AI Act as an internal control, and none of them as independent proof. elan1 holds no certification of any kind.</p>' }) +
        c.section({ id: 'pre', title: 'L1 → L2: the seven preconditions', lead: 'Verified by replay and measurement, never asserted. At L1 most read “not measured — arrives at L2”.', actions: linkArrow('The upgrade runbook', '#/assurance/upgrade'), body: '<ol class="ac-check">' + pre.map(function (x) { return '<li><span class="e1-mono">' + x[0] + '</span><div><strong>' + esc(x[1]) + '</strong><p>' + esc(x[2]) + '</p></div>' + tri(x[3]) + '</li>'; }).join('') + '</ol>' }) +
        c.callout({ kind: 'rule', title: 'Records written at L1 stay L1 and are labelled L1 for ever.', body: '<p>If this tenant moves to L2, signing starts at a named sequence number. Everything before it — today seq 1–4,112 — stays Level 1 and is never back-signed. The boundary date and the count on each side will be shown here.</p>' })
      );
    }
  });

  /* ------------------------------------------------------------------------
     /assurance/system-map — zoomable live architecture (Figs 1, 4, 3)
     ------------------------------------------------------------------------ */
  var NODES = {};
  function N(id, o) { o.id = id; NODES[id] = o; return o; }
  function svgText(x, y, s, cls, anchor) { return '<text x="' + x + '" y="' + y + '" class="' + (cls || '') + '"' + (anchor ? ' text-anchor="' + anchor + '"' : '') + '>' + esc(s) + '</text>'; }
  function node(n) {
    var zone = n.zone || 'kernel', lines = n.lines || [];
    var h = '<g class="ac-node z-' + zone + (n.l2 ? ' is-l2' : '') + '" data-ac-node="' + esc(n.id) + '" tabindex="0" role="button" aria-label="' + esc(n.title + (n.status ? ', ' + n.statusWord : '') + '. Open details') + '">' +
      '<rect class="b" x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h + '" rx="6"/>' +
      (n.zlabel ? svgText(n.x + 10, n.y + 15, n.zlabel, 't-z') : '') +
      svgText(n.x + 10, n.y + (n.zlabel ? 32 : 20), n.title, 't-h');
    lines.forEach(function (l, i) { h += svgText(n.x + 10, n.y + (n.zlabel ? 48 : 36) + i * 14, l, 't-s'); });
    if (n.status) {
      var dy = n.y + n.h - 10;
      h += '<circle cx="' + (n.x + 14) + '" cy="' + (dy - 3) + '" r="4" class="dot-' + n.status + '"/>' + svgText(n.x + 22, dy, n.statusWord, 't-s');
    }
    if (n.l2) h += svgText(n.x + n.w - 8, n.y + 15, 'L2 · not built', 't-m', 'end');
    if (n.shut) h += svgText(n.x + n.w - 8, n.y + 15, 'SHUT', 't-m', 'end');
    return h + '</g>';
  }
  function edge(d, cls, label, lx, ly, anchor) { return '<path class="edge ' + (cls || '') + '" d="' + d + '" marker-end="url(#ac-arrow)"/>' + (label ? svgText(lx, ly, label, 't-m', anchor) : ''); }
  var ARROW = '<defs><marker id="ac-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="var(--text-tertiary)"/></marker></defs>';

  function contextMap(showL2) {
    var ns = [
      N('agents', { x: 20, y: 50, w: 210, h: 92, zone: 'consumer', zlabel: 'People and agents', title: 'AI agents', lines: ['A0–A5 per write type', 'propose; never an allow'], status: 'good', statusWord: '11 registered', tip: 'actor_kind agent, set by the kernel from the token and never claimed by the tool. They hold A0–A5 per write type and produce write intents, never an allow.', last: 'stock-agent · ' + P(4112) + ' · 15:28 IST', links: [['Agent registry', '#/agents/registry'], ['Autonomy grants', '#/agents/autonomy']] }),
      N('operators', { x: 20, y: 160, w: 210, h: 70, zone: 'people', title: 'Operators', lines: ['stop switch, grants, keys'], status: 'good', statusWord: '3 people', tip: 'Tenant admins and declaration certifiers (a named human). They control the stop switch, grants and keys, and each of those actions is itself a governed write.', last: 'Arjun Mehta certified erp.ar v7 · 19 Sep', links: [['People and roles', '#/agents/people'], ['Stop switch', '#/work/stop']] }),
      N('approvers', { x: 20, y: 250, w: 210, h: 70, zone: 'people', title: 'Approvers', lines: ['named humans only'], status: 'good', statusWord: '14 waiting', tip: 'Named humans in the resolver set. They see the diff, every gate and the policy version first. An agent may never approve.', last: 'Venkat Raman approved OB-2026-0412 · ' + P(4100), links: [['Approvals', '#/work/approvals']] }),
      N('rung1', { x: 270, y: 20, w: 235, h: 78, zone: 'consumer', zlabel: 'Consumer', title: 'rung1 Enterprise', lines: ['hosted ERPNext · Mode A'], status: 'good', statusWord: 'Connected', tip: 'The first consumer; hosted ERPNext; Mode A enforced; Phase 1. It calls the kernel in-process through the SDK.', last: 'SDK call ' + fmt.rel(E1.ago(1)), links: [['Connected systems', '#/records/systems']] }),
      N('thirdparty', { x: 520, y: 20, w: 235, h: 78, zone: 'consumer', zlabel: 'Third parties', title: 'Third-party agents', lines: ['MCP / HTTP'], status: 'good', statusWord: 'Connected', tip: 'Vendors over MCP/HTTP. Mode B (Attested advisory) by default; on this tenant MCP is Enforced by token acceptance since 16 Sep 2026.', last: 'vendor-onboarding agent · ' + P(4106), links: [['Enforcement', '#/assurance/enforcement'], ['Discovered agents', '#/agents/discovered']] }),
      N('kernelport', { x: 270, y: 160, w: 485, h: 42, zone: 'kernel', title: 'KernelPort v1 · define · assert · seal · verify · scope · refuse', status: null, tip: 'The one contract every consumer calls: define, assert, seal, verify, scope, refuse. The tenant comes from the token.', last: 'assert ' + fmt.rel(E1.ago(1)), links: [['KernelPort reference', '#/developers/kernelport']] }),
      N('console', { x: 270, y: 222, w: 150, h: 84, zone: 'kernel', zlabel: 'P5', title: 'Console', lines: ['Four Doors'], status: 'good', statusWord: 'Operational', tip: 'The Four Doors, compiled from declarations: Approvals, Decide, Not done, Record, Proof, Studio.', last: 'You, just now', links: [['Work', '#/work/today']] }),
      N('packs', { x: 270, y: 322, w: 150, h: 84, zone: 'kernel', zlabel: 'P8 packs', title: 'ledger1', lines: ['invoice1 · collect1'], status: 'good', statusWord: 'Installed', tip: 'Regulatory packs are configuration, not code: a declaration plus a verifier profile each. ledger1 (MCA audit trail) is installed on this tenant.', last: 'ledger1 installed 2 Sep 2026', links: [['Packs', '#/records/packs/ledger1']] }),
      N('kernel', { x: 435, y: 222, w: 320, h: 184, zone: 'kernel', zlabel: 'P3 · plane shut', title: 'elan1 kernel', lines: ['Right Path: 0b STOP + nine rungs', 'Gates G1–G9 · evaluate() with no model', 'Single writer · hash-chained record', 'One meter event; refusals at quantity 0', 'Closed register: 43 codes, 28 at L1'], status: 'good', statusWord: 'Operational · head ' + P(HEAD), zoom: 'components', tip: 'The one write function: nine rungs, evaluate(), proof and meter. Plane P3 is shut: nothing above it imports a kernel type.', last: P(HEAD) + ' refused GATE.SANDBOX_DIVERGED · 15:28 IST', links: [['Write path of ' + P(4101), '#/assurance/proof/4101/path'], ['Runtime health', '#/assurance/runtime']] }),
      N('stack1', { x: 270, y: 478, w: 485, h: 72, zone: 'runtime', zlabel: 'P1 · separate venture', title: 'stack1 runtime', lines: ['fusion.run · trace · tools · guard · gateway — ap-south-1 Mumbai'], status: 'good', statusWord: 'Operational', tip: 'Compute, queues, storage, the sandbox pool and observability. It never builds on the governed write path; no stack1 package imports elan1.', last: 'outbox lag 0.4 s', links: [['Runtime health', '#/assurance/runtime']] }),
      N('regulators', { x: 800, y: 20, w: 280, h: 62, zone: 'external', zlabel: 'Assurance parties', title: 'Regulators', lines: ['MCA · GSTN · RBI · CERT-In · DPDP Board'], tip: 'Dated obligations. There is no conformance claim at L1.', last: '—', links: [['Assurance level', '#/assurance/level']] }),
      N('auditors', { x: 800, y: 96, w: 280, h: 62, zone: 'external', title: 'Auditors', lines: ['at L1 they reconstruct through elan1'], tip: 'Statutory auditor: reconstructs through elan1 at L1 (“verify requires us”); checks a bundle offline at L2.', last: '—', links: [['Auditor portal', '#/auditor']] }),
      N('counterparties', { x: 800, y: 172, w: 280, h: 62, zone: 'external', title: 'Counterparties', lines: ['G7: known and not sanctioned'], tip: 'Counterparty organisations: G7 checks they are known and not sanctioned; at L3 they verify receipts between organisations.', last: 'ACME Textiles · G7 passed · ' + P(4101), links: [['Counterparties', '#/assurance/counterparties']] }),
      N('erpnext', { x: 800, y: 300, w: 280, h: 106, zone: 'external', zlabel: 'System of record · P2', title: 'ERPNext (hosted)', lines: ['kaveri.rung1.in · via Frappe API', 'written only by the single writer'], status: 'good', statusWord: 'Reachable · 180 ms', tip: 'The Phase 1 system of record, written only through Frappe’s API, never the ORM, with one single-use credential per write.', last: 'SINV-2026-01187 submitted · 15:02 IST', links: [['Connected systems', '#/records/systems/erpnext'], ['Incident INC-0421', '#/assurance/incidents/INC-0421']] })
    ];
    if (showL2) ns.push(
      N('tsa', { x: 800, y: 430, w: 135, h: 60, zone: 'external', l2: true, title: 'Timestamp auth.', lines: ['RFC 3161 · two'], tip: 'RFC 3161 at two authorities, one India-based. They receive a hash and a nonce only. Level 2 — specified, not built.', last: 'Not built', links: [['Anchoring', '#/assurance/anchoring']] }),
      N('verifier', { x: 945, y: 430, w: 135, h: 60, zone: 'external', l2: true, title: 'Offline verifier', lines: ['free · zero deps'], tip: 'Zero dependencies, runs on the reviewer’s own machine against an evidence bundle, six exit codes. Level 2 — specified, not built.', last: 'Not built', links: [['Verifier', '#/verify']] })
    );
    var edges =
      edge('M230 96 C250 96 250 60 268 60', '', '', 0, 0) +
      edge('M230 195 C250 195 250 250 268 250', '', '', 0, 0) +
      edge('M230 285 C250 285 250 270 268 270', '', '', 0, 0) +
      edge('M387 98 L387 158', 'edge-a', 'Mode A · SDK · ' + num(MT.committed) + ' this month', 380, 132, 'end') +
      edge('M637 98 L637 158', 'edge-b', 'MCP / HTTP · 31 writes', 646, 132) +
      edge('M755 360 L798 360', '', '', 0, 0) +
      edge('M755 250 C780 250 780 127 798 127', '', '', 0, 0) +
      (showL2 ? edge('M755 395 C780 395 780 460 798 460', 'edge-l2', '', 0, 0) : '');
    var frame = '<rect class="zone-frame zf-kernel" x="255" y="148" width="515" height="270" rx="10"/>' + svgText(262, 436, 'elan1 — the perimeter', 't-z') +
      '<line class="seam" x1="255" y1="452" x2="770" y2="452"/>' + svgText(520, 468, 'fusion.*/v1 seam — the kernel runs on the runtime, never inside it', 't-m', 'middle');
    return '<svg viewBox="0 0 1100 ' + (showL2 ? 560 : 560) + '" role="group" aria-label="elan1 in context: people and agents, consumers, the kernel, the runtime and external parties">' + ARROW + frame + edges + ns.map(node).join('') + '</svg>';
  }
  function componentsMap(showL2) {
    var surf = [['sdk', 'SDK @elan1/kernel', 'Mode A · in-process', 'An in-process library for Mode A; the kernel holds the credential, so writes are enforced.'], ['mcp', 'MCP server', '34 tools · 18 ro · 10 stage · 6 act', '34 tools (18 read, 10 stage, 6 act) for third-party agents. Tool descriptions are pinned by hash in the declaration.'], ['http', 'HTTP /v1 + webhooks', 'act · ro · ctl', 'act, ro and ctl families; ctl cannot read any record. Webhooks are HMAC-signed and carry seq.'], ['consolec', 'Console (P5 renderers)', 'the Four Doors', 'The Four Doors, compiled from the declaration: Approvals, Decide, Not done, Record, Proof, Studio.']];
    var ns = surf.map(function (s, i) { return N(s[0], { x: 20 + i * 265, y: 20, w: 255, h: 62, zone: 'consumer', title: s[1], lines: [s[2]], status: 'good', statusWord: 'Operational', tip: s[3], last: 'call ' + fmt.rel(E1.ago(1 + i)), links: [['Developer docs', '#/developers']] }); });
    ns.push(N('kp2', { x: 20, y: 98, w: 1050, h: 34, zone: 'kernel', title: 'KernelPort v1 — define · assert · seal · verify · scope · refuse · the tenant comes from the token, never an argument', tip: 'The one contract every consumer calls.', last: 'assert ' + fmt.rel(E1.ago(1)), links: [['KernelPort', '#/developers/kernelport']] }));
    var core = [
      ['exec', 'Right Path executor', 'rungs 0b–9 · idempotent on intent_id', 'The one write function; runs the stop check and nine rungs in fixed order, idempotent on intent_id.', '#/developers/right-path'],
      ['gateeng', 'Gate engine · rung 3', 'G1–G9 as pure functions', 'Runs gates G1–G9 in declared order as pure functions; records a result row per gate.', '#/assurance/proof/4098/path'],
      ['policy', 'Policy service · rung 4', 'evaluate() · no model', 'Versioned rules over declared fields; returns allow, refuse or escalate. No model, no record read.', '#/records/policies/11'],
      ['guard', 'Guardrail + autonomy · 5–6', 'blast radius · A0–A5', 'Checks the write’s real reach against its declared radius, then the actor’s A0–A5 grant; a missing grant is A0.', '#/agents/autonomy'],
      ['approval', 'Approval service', 'human-only resolver sets', 'Holds open obligations, their expiry and the human-only resolver set.', '#/work/approvals'],
      ['register', 'Refusal register', '43 codes · 28 at L1', 'The closed list of typed refusal codes, each tied to one rung and one operator action.', '#/assurance/refusals/register'],
      ['writer', 'Single writer · rung 7', 'snapshot · shadow sandbox · broker', 'The only process holding a credential to the books; applies to a shadow sandbox first, then live. The broker mints a one-write, ten-minute credential.', '#/assurance/proof/4101/path'],
      ['chainw', 'Chain writer · rung 8', 'seq · prev_digest · SHA-256', 'Appends the sixteen-field record to the tenant’s hash chain in commit order.', '#/assurance/chain'],
      ['meterc', 'Meter · rung 9', 'one event · refusals at 0', 'Writes exactly one meter event per action; refusals and escalations count zero; meter.reconcile() runs nightly.', '#/assurance/meter']
    ];
    core.forEach(function (s, i) { var col = i % 3, row = Math.floor(i / 3); ns.push(N(s[0], { x: 32 + col * 245, y: 172 + row * 78, w: 235, h: 68, zone: 'kernel', title: s[1], lines: [s[2]], status: 'good', statusWord: s[0] === 'chainw' ? 'Continuous · ' + P(HEAD) : 'Operational', tip: s[3], last: s[0] === 'writer' ? 'last apply 15:28 IST · snapshot restored' : 'last event 15:28 IST', links: [['Open', s[4]]] })); });
    ns.push(N('studio', { x: 790, y: 150, w: 280, h: 60, zone: 'kernel', zlabel: 'P4 declaration plane', title: 'Studio', lines: ['author → validate → simulate → certify'], tip: 'Where a declaration is authored, validated, simulated and certified by a named human.', last: 'erp.ar v8 awaiting certification', links: [['Studio', '#/records/studio']] }));
    ns.push(N('registry', { x: 790, y: 218, w: 280, h: 52, zone: 'kernel', title: 'Compiler and registry', lines: ['every version kept, never compacted'], tip: 'Turns a certified declaration into a content-addressed surface plan, write types and meter basis; keeps every version for ever.', last: 'erp.ar v7 in force', links: [['Declarations', '#/records/declarations']] }));
    ns.push(N('packsc', { x: 790, y: 286, w: 280, h: 52, zone: 'kernel', zlabel: 'P8', title: 'ledger1 · invoice1 · collect1', tip: 'Declaration + certified verifier profile + export mapping; no pack table in the registry.', last: 'ledger1 installed', links: [['Packs', '#/records/packs']] }));
    ns.push(N('erp2', { x: 790, y: 354, w: 280, h: 62, zone: 'external', zlabel: 'System of record', title: 'ERPNext via Frappe API', status: 'good', statusWord: 'Reachable', tip: 'Never the ORM. The adapter returns the inverse operation for every write.', last: 'SINV-2026-01187 · 15:02 IST', links: [['Connected systems', '#/records/systems/erpnext']] }));
    if (showL2) [['signer', 'Signer', 'Ed25519 over the digest'], ['anchor', 'Anchor batcher', 'Merkle → RFC 3161 × 2'], ['bundle', 'Bundle exporter', 'eight-member bundle'], ['offline', 'Offline verifier', 'six exit codes']].forEach(function (s, i) {
      ns.push(N(s[0], { x: 32 + i * 262, y: 432, w: 250, h: 56, zone: 'kernel', l2: true, title: s[1], lines: [s[2]], tip: s[1] + ' — Level 2, frozen specification, not built.', last: 'Not built', links: [['Upgrade to L2', '#/assurance/upgrade']] }));
    });
    var rt = ['run/v1', 'trace/v1', 'tools/v1', 'guard/v1', 'gateway/v1', 'OpenBao', 'Postgres RLS', 'Outbox', 'Sandboxes'];
    var yR = showL2 ? 530 : 460;
    rt.forEach(function (s, i) { ns.push(N('rt' + i, { x: 20 + i * 117, y: yR, w: 110, h: 50, zone: 'runtime', title: s, status: 'good', statusWord: 'Up', tip: { 'run/v1': 'Temporal: durable workflows; every governed write runs in one.', 'trace/v1': 'OpenTelemetry spans, one per rung.', 'tools/v1': 'MCP tool servers for ERPNext, with per-call authorisation.', 'guard/v1': 'Safety verdicts that feed gate checks and never grant an allow.', 'gateway/v1': 'Model calls, upstream of assert and never inside it.', 'OpenBao': 'The per-tenant secrets path.', 'Postgres RLS': 'Tenant-scoped database with a synchronous standby in a second zone.', 'Outbox': 'Same-transaction outbox that feeds the chain writer in commit order.', 'Sandboxes': 'The sandbox pool: shadow environments for rung-7 dry runs.' }[s], last: 'healthy', links: [['Runtime health', '#/assurance/runtime']] })); });
    var H = yR + 70;
    var frame = '<rect class="zone-frame zf-kernel" x="20" y="150" width="755" height="262" rx="10"/>' + (showL2 ? '<rect class="zone-frame zf-kernel" x="20" y="418" width="1050" height="82" rx="10" style="stroke-dasharray:3 4"/>' : '') + svgText(30, 164, 'Kernel core · P3 · shut', 't-z') +
      (showL2 ? svgText(30, 426, 'Level 2 · frozen specification, not built', 't-z') : svgText(30, 432, 'Level 2 components hidden — use “Show Level 2 / 3”', 't-m')) +
      '<line class="seam" x1="20" y1="' + (yR - 14) + '" x2="1070" y2="' + (yR - 14) + '"/>' + svgText(545, yR - 20, 'fusion.*/v1 seam · stack1 runtime (P1) below', 't-m', 'middle');
    return '<svg viewBox="0 0 1090 ' + H + '" role="group" aria-label="elan1 components by zone">' + ARROW + frame + ns.map(node).join('') + '</svg>';
  }
  var PLANES = [
    ['P8', 'Packs', 'ledger1, invoice1, collect1: a declaration plus a verifier profile each', 'Yes, intended churn', 'elan1', 'kernel'],
    ['P7', 'Apps', 'Horizontal apps, one declaration each (rung1 Enterprise, Revenue, Commerce)', 'Yes', 'rung1 · third parties', 'consumer'],
    ['P6', 'Channels', 'web, API, messaging, voice — declared in block 7', 'Yes, per channel', 'rung1 / elan1 MCP·HTTP', 'consumer'],
    ['P5', 'Surfaces', 'Shared renderers; screens compiled from a declaration', 'Hard, one team', 'elan1 renderers', 'kernel'],
    ['P4', 'Declaration plane', 'Schema, write-type descriptors, lexicon, policy versions', 'Forward only, never migrated', 'elan1 schema', 'kernel'],
    ['P3', 'Kernel', 'The one write function: nine rungs, evaluate(), proof, meter', 'SHUT', 'elan1', 'kernel'],
    ['P2', 'System of record', 'Write API and record store — hosted ERPNext first', 'Hard', 'customer’s books / rung1 hosts', 'external'],
    ['P1', 'Platform runtime', 'Compute, queues, object store, secrets, outbox via fusion.*/v1', 'Yes, deliberately boring', 'stack1', 'runtime'],
    ['P0', 'Residency and tenancy', 'Region ap-south-1, tenant, key custody, erasure salt store', 'SHUT, no migration path', 'elan1 policy / stack1 operation', 'people']
  ];
  var RULES = [
    ['1', 'Nothing above P3 imports a kernel type (C1).', 'P3,P4,P5'], ['2', 'No module reachable from rungs 3–8 imports a model client (I1, C1).', 'P3'], ['3', 'No stack1 package imports elan1; no elan1 package in a stack1 image (B1, B2).', 'P1,P3'],
    ['4', 'The control plane has no network route to the record store; default-deny (B5).', 'P1,P2'], ['5', 'Exactly one write credential per environment; every other path fails (C2).', 'P2,P3'], ['6', 'define rejects a version ≠ last + 1; “latest” is a rejection (C13).', 'P4'],
    ['7', 'A resource outside the region allow-list fails the build.', 'P0'], ['8', 'RLS on every tenant table; a cross-tenant read test runs in CI.', 'P0,P1'], ['9', 'No “signed”, “tamper-proof” or “independently verifiable” in rendered L1 copy (C14).', 'P5,P6']
  ];
  function planesView() {
    return '<div class="ac-region" style="grid-template-columns:minmax(0,1fr) 380px"><div class="ac-planes" role="list" aria-label="Planes P8 to P0, cheaper to change at the top">' + PLANES.map(function (pl) {
      return '<button type="button" role="listitem" class="ac-plane e1-zone--' + pl[5] + '" data-ac-plane="' + pl[0] + '" style="--z:var(--zone-' + pl[5] + ');--zb:var(--zone-' + pl[5] + '-bg)"><b>' + pl[0] + '</b><span><strong>' + esc(pl[1]) + '</strong><br><span class="e1-caption">' + esc(pl[2]) + '</span></span><span class="e1-caption">' + (/SHUT/.test(pl[3]) ? c.icon('lock', 12) + ' ' : '') + esc(pl[3]) + '</span><span class="e1-caption">' + esc(pl[4]) + '</span></button>';
    }).join('') + '<p class="ac-muted-note">Read bottom-up as a cost gradient: costlier to change at the bottom, cheaper at the top.</p></div>' +
      '<div>' + c.card({ title: 'Nine boundary rules, each a failing build', body: '<div role="list">' + RULES.map(function (r) { return '<button type="button" role="listitem" class="ac-rule" data-ac-rule="' + r[2] + '"><span class="e1-mono">' + r[0] + '</span><span class="e1-caption">' + esc(r[1]) + ' <span class="e1-muted">· ' + esc(r[2].replace(/,/g, ' | ')) + '</span></span></button>'; }).join('') + '</div><p class="ac-muted-note" style="margin-top:8px">“An instruction in a document is advice; a failing build is a control.” Hover or select a rule to highlight the planes it separates.</p>', footer: linkArrow('Evidence per rule on Controls', '#/assurance/controls') }) + '</div></div>';
  }
  route('/assurance/system-map', {
    title: 'System map', section: 'system-map', wide: true, keywords: 'architecture system map context components planes live',
    render: function (p, query) {
      var zoom = query.zoom || 'context', l2 = query.l2 === '1';
      var zooms = ['context', 'components', 'planes'], zi = Math.max(0, zooms.indexOf(zoom));
      var stage = zoom === 'planes' ? '<div style="padding:var(--space-4)">' + planesView() + '</div>' : (zoom === 'components' ? componentsMap(l2) : contextMap(l2));
      var legend = '<div class="ac-legend" aria-label="Legend">' +
        [['kernel', 'elan1 (kernel, packs, console)'], ['consumer', 'Consumers and agents'], ['runtime', 'stack1 runtime'], ['people', 'People who decide'], ['external', 'External systems and parties']].map(function (z) { return '<span><i style="border-color:var(--zone-' + z[0] + ');background:var(--zone-' + z[0] + '-bg)"></i>' + esc(z[1]) + '</span>'; }).join('') +
        '<span><i class="l" style="border-color:var(--zone-kernel);border-top-style:solid"></i>Mode A · built</span><span><i class="l" style="border-color:var(--zone-consumer);border-top-style:dashed"></i>MCP / HTTP</span><span><i style="border-color:var(--border-strong);border-style:dashed"></i>Level 2 · specified, not built</span><span>● status dot always carries a word</span></div>';
      return page(
        ph({ title: 'System map', lead: 'What is actually running behind this tenant, and where does each piece sit? Zoom from context to components to planes; select any box for what it does, its status and its last event.',
          actions: c.button('Zoom out', { icon: 'minus', href: E1.href('/assurance/system-map', q(query, { zoom: zooms[Math.max(0, zi - 1)] })), disabled: zi === 0 }) + c.button('Zoom in', { icon: 'plus', href: E1.href('/assurance/system-map', q(query, { zoom: zooms[Math.min(2, zi + 1)] })), disabled: zi === 2 }) + c.button('Runtime health', { href: '#/assurance/runtime', icon: 'activity', kind: 'ghost' }),
          meta: '<div class="ac-freshrow">' + fresh('Statuses refreshed', 1) + '<span class="e1-caption">Colours mark zones, never status. Status is the dot plus its word.</span></div>' }) +
        '<div class="ac-map"><div class="ac-map__bar">' + c.segmented([{ id: 'context', label: '1 · Context', href: E1.href('/assurance/system-map', q(query, { zoom: null })) }, { id: 'components', label: '2 · Components', href: E1.href('/assurance/system-map', q(query, { zoom: 'components' })) }, { id: 'planes', label: '3 · Planes', href: E1.href('/assurance/system-map', q(query, { zoom: 'planes' })) }], zoom, { label: 'Zoom level' }) +
        (zoom === 'planes' ? '' : c.segmented([{ id: '0', label: 'Level 1 only', href: E1.href('/assurance/system-map', q(query, { l2: null })) }, { id: '1', label: 'Show Level 2 / 3', href: E1.href('/assurance/system-map', q(query, { l2: '1' })) }], l2 ? '1' : '0', { label: 'Level overlay', size: 'sm' })) + '</div>' +
        '<div class="ac-map__stage">' + stage + '</div>' + (zoom === 'planes' ? '' : legend) + '</div>' +
        (l2 && zoom !== 'planes' ? c.callout({ kind: 'caveat', title: 'Dashed boxes are specified, not built.', body: '<p>They are shown so you can see what Level 2 adds. On an L1 tenant they never show a live status.</p>' }) : '') +
        '<p class="ac-muted-note">Adapted from the elan1 Architecture Atlas, Figures 1, 3 and 4 (draft for review, 23 Sep 2026). Parked ventures are left out of tenant consoles.</p>'
      );
    },
    mount: function (el) {
      function hl(planes) { Array.prototype.forEach.call(el.querySelectorAll('[data-ac-plane]'), function (b) { b.classList.toggle('is-hl', planes.indexOf(b.getAttribute('data-ac-plane')) >= 0); }); }
      Array.prototype.forEach.call(el.querySelectorAll('[data-ac-rule]'), function (b) {
        var ps = b.getAttribute('data-ac-rule').split(',');
        b.addEventListener('mouseenter', function () { hl(ps); }); b.addEventListener('focus', function () { hl(ps); });
        b.addEventListener('mouseleave', function () { hl([]); }); b.addEventListener('blur', function () { hl([]); });
        b.addEventListener('click', function () { hl(ps); E1.announce('Rule highlights planes ' + ps.join(' and ')); });
      });
      Array.prototype.forEach.call(el.querySelectorAll('[data-ac-plane]'), function (b) {
        b.addEventListener('click', function () {
          var pl = PLANES.filter(function (x) { return x[0] === b.getAttribute('data-ac-plane'); })[0];
          var rules = RULES.filter(function (r) { return r[2].split(',').indexOf(pl[0]) >= 0; });
          E1.drawer({ eyebrow: 'Plane ' + pl[0], title: pl[1], body: c.kv([['Holds', pl[2]], ['Changeable', pl[3]], ['Owner', pl[4]]]) + '<h3 class="e1-label" style="margin:16px 0 8px">Boundary rules on this plane</h3><ul class="ac-feed">' + rules.map(function (r) { return '<li style="grid-template-columns:28px minmax(0,1fr)"><span class="ac-feed__i e1-mono">' + r[0] + '</span><span>' + esc(r[1]) + '</span></li>'; }).join('') + '</ul>', actions: [{ label: 'Controls and evidence', href: '#/assurance/controls', kind: 'primary' }] });
        });
      });
    }
  });
  function openNode(id) {
    var n = NODES[id]; if (!n) return;
    E1.drawer({ eyebrow: (n.zlabel || { kernel: 'elan1', consumer: 'Consumers and agents', runtime: 'stack1 runtime', people: 'People who decide', external: 'External' }[n.zone || 'kernel']) + (n.l2 ? ' · Level 2, not built' : ''), title: n.title,
      body: '<p style="margin:0 0 12px">' + esc(n.tip) + '</p>' + c.kv([['Status', n.l2 ? c.badge('neutral', 'Specified, not built', { icon: 'lock' }) : n.status ? c.badge(n.status, n.statusWord) : muted('No live status — an external party'), { html: true }], ['Last event', n.last || '—'], ['Zone', { kernel: 'elan1', consumer: 'Consumer / surface', runtime: 'stack1 runtime (separate venture)', people: 'People who decide', external: 'External system or party' }[n.zone || 'kernel']]]) +
        (n.lines && n.lines.length ? '<p class="ac-muted-note" style="margin-top:12px">' + esc(n.lines.join(' · ')) + '</p>' : ''),
      actions: (n.zoom ? [{ label: 'Zoom into components', href: '#/assurance/system-map?zoom=' + n.zoom, kind: 'secondary', icon: 'plus' }] : []).concat((n.links || []).slice(0, 2).map(function (l, i) { return { label: l[0], href: l[1], kind: i === (n.links.length > 1 ? 1 : 0) ? 'primary' : 'secondary' }; })) });
  }
  E1.on('click', '[data-ac-node]', function (e, el) { openNode(el.getAttribute('data-ac-node')); });
  E1.on('keydown', '[data-ac-node]', function (e, el) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openNode(el.getAttribute('data-ac-node')); } });

  /* ------------------------------------------------------------------------
     /assurance/runtime — health, SLO targets, latency by rung, queues, stop switch
     ------------------------------------------------------------------------ */
  var COMPONENTS = [
    ['Submission (write API and MCP)', 'good', 'Operational', 'Golden write probe returned the expected sealed refusal 1 min ago'],
    ['Gates and rule engine', 'good', 'Operational', 'policy 11 loaded · 0 platform refusals in the last hour'],
    ['Single writer', 'good', 'Operational', 'One writer per tenant · 0 lock losses today'],
    ['Chain integrity', 'good', 'Continuous · checked 02:10 IST', 'Driven by a dead-man signal: a missed nightly job flips this by itself'],
    ['Meter', 'good', 'Operational', 'Meter lag p99 3 s'],
    ['ERPNext target (kaveri.rung1.in)', 'good', 'Reachable · recovered 15:14 IST', 'Was unreachable 15:10–15:14 · INC-0421'],
    ['Console', 'good', 'Operational', ''],
    ['Sandbox key issuance', 'good', 'Operational', 'p95 38 s against < 60 s'],
    ['Signing (KMS)', 'neutral', 'Not at Level 1', 'Arrives at L2'],
    ['Anchoring (two TSAs)', 'neutral', 'Not at Level 1', 'Arrives at L2']
  ];
  var SLOS = [
    ['Governed write, kernel-side, p50', '≤ 120 ms', 'MEASURE THIS'], ['Governed write, kernel-side, p99', '≤ 450 ms', 'MEASURE THIS · kill criterion at 10 partners'], ['Rungs 0b–9 sum, p50', '≈ 64 ms', 'design target'],
    ['Sandbox + live applies (hosted ERPNext), p95', '≤ 1,200 ms', 'design target'], ['Governed write end to end, incl. target, p95', '≤ 2 s', 'MEASURE THIS'], ['Proof record write (rung 8), p50', '≤ 40 ms', 'MEASURE THIS'],
    ['Outbox → record lag, p99', '≤ 2 s', 'estimate'], ['Meter lag, p99', '≤ 30 s', 'MEASURE THIS'], ['Sandbox key → usable tenant', '< 60 s, p95 published', 'readiness']
  ];
  var INVARIANTS = [['Committed writes without a chained record', '0'], ['Records mutated outside the writer', '0'], ['Meter events without a write; refusals with quantity ≠ 0', '0']];
  route('/assurance/runtime', {
    title: 'Runtime', section: 'runtime', keywords: 'runtime health slo latency queue outbox stop switch status',
    render: function (p, query) {
      var rng2 = query.range || '24h';
      var compTbl = '<ul class="ac-feed">' + COMPONENTS.map(function (x) { return '<li><span class="ac-feed__i">' + c.icon(x[1] === 'good' ? 'check' : 'minus', 14) + '</span><div><strong>' + esc(x[0]) + '</strong>' + (x[3] ? '<p>' + esc(x[3]) + '</p>' : '') + '</div>' + c.badge(x[1], x[2], { subtle: x[1] === 'neutral' }) + '</li>'; }).join('') + '</ul>';
      var rungRows = [['0b–2', 'Stop · identity · write door', 4, 3.1, 4.8], ['3', 'Pre-gates', 8, 6.4, 11.2], ['4', 'evaluate()', 12, 9.1, 15.0], ['5–6', 'Guardrail · autonomy', 8, 5.7, 8.9], ['7', 'Act (kernel only)', 18, 14.8, 22.3], ['8', 'Proof', 12, 10.2, 17.7], ['9', 'Metered', 2, 1.3, 2.4]];
      var lat = c.table({ caption: 'Latency by rung', dense: true, columns: [
        { key: 0, label: 'Rung', mono: true, render: function (r) { return esc(r[0]); } }, { key: 1, label: 'Checks', render: function (r) { return esc(r[1]); } },
        { key: 2, label: 'Target p50', align: 'right', render: function (r) { return '<span class="e1-mono">' + r[2] + ' ms</span> ' + unverified(); } },
        { key: 3, label: 'Observed p50', align: 'right', mono: true, render: function (r) { return r[3].toFixed(1) + ' ms'; } },
        { key: 4, label: 'Observed p95', align: 'right', mono: true, render: function (r) { return r[4].toFixed(1) + ' ms'; } },
        { key: 5, label: '', render: function (r) { return '<span class="ac-rung__bar" style="display:inline-block;vertical-align:middle" aria-hidden="true"><i style="width:' + Math.min(100, r[3] / r[2] * 70).toFixed(0) + '%"></i></span>'; } }
      ], rows: rungRows });
      return page(
        ph({ title: 'Runtime', lead: 'Is the system healthy right now? Evidence integrity pages someone; latency does not. Targets are shown as targets, never as readings.',
          actions: c.segmented([{ id: '24h', label: '24 hours', href: E1.href('/assurance/runtime', { range: null }) }, { id: '7d', label: '7 days', href: E1.href('/assurance/runtime', { range: '7d' }) }, { id: '30d', label: '30 days', href: E1.href('/assurance/runtime', { range: '30d' }) }], rng2, { label: 'Time range', size: 'sm' }) + c.button('Public status', { href: '#/status', icon: 'external', kind: 'ghost' }),
          meta: '<div class="ac-freshrow">' + fresh('Probed', 1) + '<span class="e1-caption">The kernel publishes no availability promise yet: a quarter of data comes first.</span></div>' }) +
        '<div class="ac-kpis">' +
        '<div class="ac-kpi"><span class="e1-label">Outbox depth</span><span class="ac-kpi__v">0</span><span class="ac-kpi__n">rows waiting for the chain writer</span>' + c.sparkline([0, 1, 0, 2, 0, 0, 3, 1, 0, 0, 0, 0], { title: 'Outbox depth, last hour', height: 22 }) + '</div>' +
        '<div class="ac-kpi"><span class="e1-label">Outbox → record lag, p99</span><span class="ac-kpi__v">0.4 s</span><span class="ac-kpi__n">estimate ≤ 2 s · pages if over</span></div>' +
        '<div class="ac-kpi"><span class="e1-label">Meter lag, p99</span><span class="ac-kpi__v">3 s</span><span class="ac-kpi__n">target ≤ 30 s ' + unverified() + '</span></div>' +
        '<a class="ac-kpi" href="#/work/approvals"><span class="e1-label">Waiting on people</span><span class="ac-kpi__v">14</span><span class="ac-kpi__n">open obligations · expiry paused in an outage</span></a>' +
        '<a class="ac-kpi" href="#/assurance/incidents"><span class="e1-label">Open incidents</span><span class="ac-kpi__v">1</span><span class="ac-kpi__n">P2 · verifying</span></a></div>' +
        '<div class="ac-grid ac-grid--2">' + c.card({ title: 'Components', body: compTbl }) +
        '<div class="ac-page" style="gap:var(--space-4)">' + c.card({ title: 'Stop switch', body: '<div class="e1-row" style="gap:10px;margin-bottom:10px">' + c.badge('good', 'Not stopped · writes flow') + '</div><p class="e1-caption" style="margin:0">Throwing the stop is a governed write with dual control. It stops all writes including refusals, and it is verified — not assumed — by attempting a write and expecting POLICY.TENANT_STOPPED. Reads, verify and exports continue.</p>' +
          '<div style="margin-top:12px">' + c.kv([['Who can ask', 'Meenakshi Iyer, Ravi Shankar, Arjun Mehta'], ['Second approver', 'required'], ['Last stop drill', '12 Sep 2026 · ref-tenant · probe refused as expected']], { compact: true }) + '</div>', footer: c.button('Request a stop', { href: '#/work/stop', kind: 'danger', icon: 'stop', size: 'sm' }) + ' ' + c.button('Tenant record', { href: '#/records/tenants/kaveri-spinning', size: 'sm', kind: 'ghost' }) }) +
        c.card({ title: 'Nightly jobs', body: '<ul class="ac-feed">' + [
          ['Chain integrity', '02:10 IST · continuous · 1–4,041', 'good', 'Continuous', '#/assurance/chain'], ['Two-way reconciliation', '02:30 IST · 0 mismatches', 'good', 'Passed', '#/assurance/reconciliation'], ['Refusal replay (determinism)', '02:45 IST · 171 of 171 decisions reproduced', 'good', 'Passed', '#/assurance/refusals'], ['KMS Sign reconciliation', 'Level 2', 'neutral', 'Not at L1', '#/assurance/level'], ['Anchor lag', 'Level 2', 'neutral', 'Not at L1', '#/assurance/level']
        ].map(function (x) { return '<li><span class="ac-feed__i">' + c.icon('clock', 14) + '</span><div><a href="' + x[4] + '"><strong>' + esc(x[0]) + '</strong></a><p>' + esc(x[1]) + '</p></div>' + c.badge(x[2], x[3], { subtle: x[2] === 'neutral' }) + '</li>'; }).join('') + '</ul><p class="ac-muted-note">Each job pings a dead-man switch on success; silence pages.</p>' }) + '</div></div>' +
        c.section({ id: 'slo', title: 'Service levels', lead: 'Three kinds that are never mixed: targets to measure, invariants with no error budget, and readiness numbers. None is quoted to a customer until measured under load.', body:
          '<div class="ac-grid ac-grid--2" style="align-items:start">' + c.card({ title: 'Targets', flush: true, body: c.table({ caption: 'SLO targets', dense: true, columns: [
            { key: 0, label: 'Indicator', render: function (r) { return esc(r[0]); } }, { key: 1, label: 'Target', mono: true, render: function (r) { return esc(r[1]); } }, { key: 2, label: 'Class', render: function (r) { return tag(r[2]); } }, { key: 3, label: 'Reading', render: function () { return tri('not_measured', 'Not measured'); } }
          ], rows: SLOS }) }) +
          c.card({ title: 'Invariants — no error budget', body: INVARIANTS.map(function (x) { return '<div class="ac-line"><span>' + esc(x[0]) + '</span><span>' + x[1] + ' · last night ' + c.badge('good', 'Holds', { subtle: true }) + '</span></div>'; }).join('') + '<p class="ac-muted-note" style="margin-top:10px">“A correctness claim with a budget is one we have already decided to break.” Any non-zero value pages.</p>' }) + '</div>' }) +
        c.section({ id: 'latency', title: 'Latency by rung', lead: 'Observed from one span per rung over the last ' + ({ '24h': '24 hours (1,212 writes)', '7d': '7 days (8,640 writes)', '30d': '30 days (4,221 writes this month)' }[rng2] || '24 hours') + '. Observations, not SLO readings.', body: lat }) +
        c.section({ id: 'failclosed', title: 'If a dependency fails', lead: 'Fail closed: “A control that degrades to allow is not a control.”', body: c.table({ caption: 'Fail-closed behaviour', dense: true, columns: [
          { key: 0, label: 'Dependency down', render: function (r) { return esc(r[0]); } }, { key: 1, label: 'Rung', mono: true, render: function (r) { return esc(r[1]); } }, { key: 2, label: 'Code', render: function (r) { return r[2] ? '<a class="e1-mono" style="font-size:var(--text-caption)" href="#/assurance/refusals/' + esc(r[2]) + '">' + esc(r[2]) + '</a>' : muted('none'); } }, { key: 3, label: 'Behaviour', render: function (r) { return esc(r[3]); } }, { key: 4, label: 'Pages', render: function (r) { return r[4] ? 'Yes' : 'No'; } }
        ], rows: [['Tenant stopped (deliberate)', '0b', 'POLICY.TENANT_STOPPED', 'Refuse, no chain entry', false], ['Declaration registry', '2', 'PLATFORM.REGISTRY_UNAVAILABLE', 'Refuse at the write door', true], ['Rule engine', '4', 'PLATFORM.POLICY_UNAVAILABLE', 'Refuse; never a default allow', true], ['Credential broker', '7', 'PLATFORM.TOKEN_MINT_FAILED', 'Refuse', true], ['Target after sandbox', '7', 'PLATFORM.TARGET_UNREACHABLE', 'Nothing reaches live', true], ['Writer lock', '7', 'PLATFORM.WRITER_LOCK_LOST', 'Snapshot restored', true], ['Chain append', '8', 'PLATFORM.LOG_APPEND_FAILED', 'Committed, proof pending; the outbox retries in order', true], ['Two chain writers', '8', 'PLATFORM.CHAIN_HEAD_CONFLICT', 'P0; tenant stopped', true]] }) }) +
        '<p class="ac-muted-note">When the kernel is unreachable, consumers say: “We cannot check this change right now. Nothing was changed.”</p>'
      );
    }
  });

  /* ------------------------------------------------------------------------
     /assurance/residency — India · Mumbai, DPDP
     ------------------------------------------------------------------------ */
  function residencyMap() {
    var box = function (x, y, w, h, zone, title, sub, dashed) { return '<g class="z-' + zone + (dashed ? ' is-l2' : '') + '"><rect class="b" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" style="stroke-width:1.5"/>' + svgText(x + 10, y + 20, title, 't-h') + (sub ? svgText(x + 10, y + 36, sub, 't-s') : '') + '</g>'; };
    return '<div class="ac-map"><div class="ac-map__stage"><svg viewBox="0 0 900 400" role="img" aria-label="Residency map: domain in, region ap-south-1 Mumbai with three availability zones; nothing leaves India at Level 1">' + ARROW +
      '<rect class="zone-frame zf-kernel" x="20" y="20" width="620" height="360" rx="12"/>' + svgText(34, 42, 'Residency domain in · India', 't-z') + svgText(34, 60, 'Every proof record stays here. G2 residency is never skippable and has no override.', 't-s') +
      '<rect class="zone-frame zf-external" x="40" y="76" width="580" height="286" rx="10" style="stroke-dasharray:4 4"/>' + svgText(54, 98, 'Region ap-south-1 · Mumbai', 't-h') + svgText(54, 114, 'sole region · no second region, including for DR', 't-s') +
      box(56, 132, 176, 212, 'kernel', 'AZ a · primary', 'Postgres primary (RLS)') + svgText(66, 196, '• chain store (insert-only)', 't-s') + svgText(66, 212, '• meter ledger', 't-s') + svgText(66, 228, '• writes and gate results', 't-s') + svgText(66, 244, '• salt store (P0)', 't-s') + svgText(66, 260, '• OpenBao per-tenant path', 't-s') +
      box(242, 132, 176, 212, 'kernel', 'AZ b · standby', 'synchronous standby') + svgText(252, 196, '• Postgres standby', 't-s') + svgText(252, 212, '• sandbox pool', 't-s') + svgText(252, 228, '• Temporal workers', 't-s') +
      box(428, 132, 176, 212, 'kernel', 'AZ c · backups', 'encrypted, 30 days') + svgText(438, 196, '• nightly backups + PITR', 't-s') + svgText(438, 212, '• WORM object store', 't-s') + svgText(438, 228, '• logs 180 days (no PII)', 't-s') +
      box(680, 40, 200, 80, 'external', 'Timestamp authorities', 'Level 2 — not built', true) + svgText(690, 106, 'only a Merkle root + nonce', 't-m') +
      '<path class="edge edge-l2" d="M640 90 L678 80" marker-end="url(#ac-arrow)"/>' +
      box(680, 160, 200, 60, 'external', 'Gulf domain', 'not before 1 Apr 2028', true) + box(680, 236, 200, 60, 'external', 'EU domain', 'not before 1 Apr 2029', true) +
      svgText(690, 330, 'Each future domain gets its own', 't-s') + svgText(690, 346, 'region and signing key. Records', 't-s') + svgText(690, 362, 'never cross a domain.', 't-s') +
      '</svg></div></div>';
  }
  route('/assurance/residency', {
    title: 'Residency', section: 'residency', keywords: 'residency india mumbai ap-south-1 dpdp data location subprocessors retention',
    render: function () {
      var stores = [['Proof log (chain)', 'per-tenant hash chain', 'chain writer · rung 8', 'RLS · per tenant', 'Indefinitely (MCA floor 8 years) ' + srcConflict('O05 says 7 years WORM; E11/E15 say indefinitely. Shown as indefinitely until resolved.'), 'L1'], ['Meter ledger', 'insert-only meter events', 'meter · rung 9', 'RLS', '8 years', 'L1'], ['Writes and gate results', 'one row per write and per gate', 'Right Path executor', 'RLS', '8 years', 'L1'], ['Snapshots', 'pre-apply snapshots for reversal', 'single writer · rung 7', 'per tenant', '30 days', 'L1'], ['Salt store', 'per-record salts (erasure)', 'chain writer', 'per tenant · P0', 'until erasure', 'L1'], ['Application logs', 'no PII, no payload', 'all services', 'hashed tenant ref', '180 days, India', 'L1'], ['Security and access logs', 'who accessed what', 'console and API edge', 'per tenant', '≥ 1 year (180 days minimum in India)', 'L1']];
      var subs = [['Amazon Web Services', 'Compute, storage and backups for the whole evidence plane', 'ap-south-1 Mumbai', '1 Aug 2026', 'Evidenced · region allow-list in CI'], ['stack1 (group company)', 'Operates the runtime: workflows, queues, sandbox pool', 'ap-south-1 Mumbai', '1 Aug 2026', 'Evidenced · contract DR-002'], ['WhatsApp Business Platform (Meta)', 'Notification text and deep links only — no record payload, no amounts above the declared ceiling', 'Outside India', '2 Sep 2026', 'Flagged · notification-only channel'], ['Transactional e-mail', 'Chain-head receipts and notices to named contacts', 'to be named', '—', 'Not evidenced — provider not yet chosen']];
      return page(
        ph({ title: 'Residency', lead: 'Where does this tenant’s data live? In India, in one region — ap-south-1, Mumbai — across three availability zones. Nothing that elan1 records leaves India at Level 1.',
          actions: c.button('Copy the sub-processor list', { icon: 'copy', attrs: 'data-copy="' + esc(subs.map(function (s) { return s[0] + ' — ' + s[1] + ' — ' + s[2]; }).join('\n')) + '" data-copy-label="Sub-processor list"' }) + c.button('Security', { href: '#/assurance/security', icon: 'lock', kind: 'ghost' }),
          meta: '<div class="ac-freshrow"><span class="e1-caption">Tenant residency <span class="e1-mono">in · Mumbai</span></span>' + freshAt('Region allow-list checked in CI', iso(24, '09:12')) + '</div>' }) +
        '<div class="ac-region">' + residencyMap() + '<div class="ac-page" style="gap:var(--space-4)">' +
        c.card({ title: 'Data residency', body: c.kv([['Domain', 'in', { mono: true }], ['Region', 'ap-south-1 · Mumbai'], ['Availability zones', '3 · synchronous standby in a second zone'], ['Second region', 'None, including for DR, until counsel confirms'], ['Hosting profile', 'H1 · hosted shared domain'], ['RPO / RTO', 'Not yet set — due 15 Oct 2026']], { compact: true }) }) +
        c.card({ title: 'DPDP', body: c.kv([['Role for tenant data', 'Data Processor'], ['Role for our own users', 'Data Fiduciary'], ['DPA', 'In place before the first real record'], ['Consent ledger', 'Purpose, timestamp, lawful basis, notice version'], ['Erasure', 'A governed write · irreversible · dual control · 72 h']], { compact: true }), footer: linkArrow('Erasure cases', '#/records/erasure') }) + '</div></div>' +
        c.section({ id: 'stores', title: 'What is stored, by whom, for how long', body: c.table({ caption: 'Store inventory', dense: true, columns: [
          { key: 0, label: 'Store', render: function (r) { return '<strong class="e1-strong">' + esc(r[0]) + '</strong><div class="e1-caption e1-muted">' + esc(r[1]) + '</div>'; } }, { key: 2, label: 'Only writer', render: function (r) { return esc(r[2]); } }, { key: 3, label: 'Tenancy', render: function (r) { return esc(r[3]); } }, { key: 4, label: 'Retention', render: function (r) { return r[4]; } }, { key: 5, label: 'Level', render: function (r) { return c.level(r[5], { short: true }); } }
        ], rows: stores }) }) +
        c.section({ id: 'subs', title: 'Sub-processors', lead: 'Published to tenants with notice before any addition.', body: c.table({ caption: 'Sub-processors', dense: true, columns: [
          { key: 0, label: 'Name', render: function (r) { return '<strong class="e1-strong">' + esc(r[0]) + '</strong>'; } }, { key: 1, label: 'What they process', render: function (r) { return esc(r[1]); } }, { key: 2, label: 'Region', render: function (r) { return r[2] === 'Outside India' ? c.badge('warning', 'Outside India', { subtle: true }) : esc(r[2]); } }, { key: 3, label: 'Added', mono: true, render: function (r) { return esc(r[3]); } }, { key: 4, label: 'Evidence', render: function (r) { return esc(r[4]); } }
        ], rows: subs }) }) +
        c.callout({ kind: 'rule', title: 'Erasure keeps the chain intact.', body: '<p>Erasing a data subject destroys their salt, so the payload becomes unbound while every digest still holds. A verifier then reads “chain intact, payload unbound”. We do not claim erasure is solved: the counsel question is open until 30 Nov 2026 and must be settled before the first paying tenant.</p>' })
      );
    }
  });

  /* ------------------------------------------------------------------------
     /assurance/security — access, keys, residency, sub-processors, claims boundary
     ------------------------------------------------------------------------ */
  route('/assurance/security', {
    title: 'Security', section: 'security', keywords: 'security access keys isolation backups certification claims boundary',
    render: function () {
      var rows = [
        ['Access', 'SSO and MFA for everyone in this tenant; approvals re-authenticate after 15 minutes idle', '24 Sep · 0 sessions without MFA', 'passed', '#/assurance/access'],
        ['Token classes', 'Three classes and no fourth: tenant (reaches writes), control (Studio, no record read), ops (read-only, no tenant data)', 'C1 import graph · 24 Sep 09:12 build', 'passed', '#/agents/keys'],
        ['Keys', '3 production keys issued by elan1, 1 revoked; 2 sandbox keys; 1 control token; 1 ops token. Rotation window 90 days.', 'sk_live_…9c1e rotate by 1 Dec 2026', 'passed', '#/agents/keys'],
        ['Target credentials', 'One single-use credential per write, ten-minute life; no long-lived key to ERPNext exists', 'C2 bypass attempt · 24 Sep · every other path failed', 'passed', '#/assurance/readiness'],
        ['Tenant isolation', 'tenant_id NOT NULL and RLS on every table; per-tenant secrets path and namespaces', 'Cross-tenant read test · 23 Sep 02:50', 'passed', '#/assurance/controls'],
        ['Residency', 'ap-south-1 Mumbai only; build fails outside the region allow-list', 'CI · 24 Sep 09:12', 'passed', '#/assurance/residency'],
        ['Backups', 'PITR and nightly encrypted backups, kept 30 days', 'Last backup 24 Sep 01:00', 'passed', '#/assurance/runtime'],
        ['Restore drill', 'Quarterly restore drill that re-verifies a sample of the evidence store', 'Not yet run — “a backup that has never been restored is not a backup”', 'not_measured', '#/assurance/readiness'],
        ['Incident response', 'CERT-In responder named; six-hour reporting path; tenant update in 72 h', 'Six-hour path tested once · 5 Sep 2026', 'passed', '#/assurance/incidents'],
        ['Break-glass', 'A declared write type with dual control, recorded and visible to you; alert within 1 minute', '0 uses this period', 'passed', '#/work/break-glass'],
        ['Signing keys (L2)', 'At Phase 3 the signing key is held in elan1’s cloud account under managed KMS; a sufficiently privileged insider in that account could alter the key policy. One key per residency domain, not per tenant.', 'No signing keys exist at Level 1', 'not_measured', '#/agents/keys/signing']
      ];
      return page(
        ph({ title: 'Security', lead: 'What protects this tenant, and how do we know? Every row carries its evidence — a date and a link — or says plainly that it is not evidenced.',
          actions: c.button('Residency', { href: '#/assurance/residency', icon: 'map-pin' }) + c.button('Access log', { href: '#/assurance/access', icon: 'eye', kind: 'ghost' }) }) +
        '<div class="ac-banner ac-banner--neutral" role="note">' + c.icon('info', 18) + '<div><strong>We hold no certification of any kind.</strong><p>No SOC 2, no ISO/IEC 27001, no ISO/IEC 42001, no assessment against NIST AI RMF. If that changes, this line will read “we hold X, covering Y, issued on Z” — and never sit beside an assurance level.</p></div></div>' +
        c.table({ caption: 'Security controls with evidence', columns: [
          { key: 0, label: 'Area', render: function (r) { return '<strong class="e1-strong">' + esc(r[0]) + '</strong>'; } },
          { key: 1, label: 'What we do', render: function (r) { return '<span class="e1-caption" style="font-size:13px">' + esc(r[1]) + '</span>'; } },
          { key: 2, label: 'Evidence', render: function (r) { return '<a href="' + r[4] + '">' + esc(r[2]) + '</a>'; } },
          { key: 3, label: 'Status', render: function (r) { return tri(r[3]); } }
        ], rows: rows }) +
        c.section({ id: 'claims', title: 'The claims boundary', lead: 'The sentences sales, support and you may use about this tenant today.', body:
          '<div class="ac-claims"><div><h3>' + c.icon('check', 14) + 'We say</h3><ul>' + ['Hash-chained, tamper-evident to you, the chain holder.', 'Every attempt is recorded, including the refusals.', 'At L1, verify requires us.', 'Data, logs and keys stay in India (ap-south-1).'].map(function (s) { return '<li>' + c.icon('check', 12) + '<span class="ac-say">' + esc(s) + '</span></li>'; }).join('') + '</ul></div>' +
          '<div><h3>' + c.icon('x', 14) + 'We never say</h3><ul>' + ['“Signed”, “independently verifiable” or “cryptographic proof” at Level 1.', '“Tamper-proof”, “immutable”, “court-ready” or “legally admissible” at any level.', '“We cannot see your data” — true only with customer-held keys.', 'That a regulator has accepted, approved or reviewed this.'].map(function (s) { return '<li>' + c.icon('x', 12) + '<span>' + esc(s) + '</span></li>'; }).join('') + '</ul></div></div>' })
      );
    }
  });

  /* ------------------------------------------------------------------------
     /assurance/access — who accessed what
     ------------------------------------------------------------------------ */
  var ACCESS = [
    ['15:31', 'Venkat Raman', 'person', 'tenant · console', 'Viewed', 'Proof #4,101', '#/assurance/proof/4101', 'Tiruppur · 49.207.x.x'],
    ['15:29', 'Venkat Raman', 'person', 'tenant · console', 'Viewed', 'Assurance overview', '#/assurance', 'Tiruppur · 49.207.x.x'],
    ['15:28', 'stock-agent', 'agent', 'tenant · SDK', 'Read', 'erp.stock v3 declaration', '#/records/declarations/erp.stock', 'ap-south-1'],
    ['15:21', 'vendor-onboarding agent', 'agent', 'tenant · MCP read.records', 'Read', 'Supplier list (read.records)', '#/records/objects', 'ap-south-1'],
    ['15:19', 'Ravi Shankar', 'person', 'tenant · voice', 'Decided', 'OB-2026-0413 (approve)', '#/assurance/proof/4104', 'Voice · +91 ··· 4410'],
    ['15:05', 'Farah Sheikh', 'person', 'control · Studio', 'Edited draft', 'erp.ar v8 (draft)', '#/records/studio/erp.ar', 'Bengaluru · 106.51.x.x'],
    ['15:02', 'Venkat Raman', 'person', 'tenant · console', 'Decided', 'OB-2026-0412 (approve)', '#/assurance/proof/4100', 'Tiruppur · 49.207.x.x'],
    ['14:40', 'Meenakshi Iyer', 'person', 'tenant · console', 'Viewed', 'Meter, September', '#/assurance/meter', 'Coimbatore · 117.216.x.x'],
    ['12:30', 'Farah Sheikh', 'person', 'tenant · sandbox key', 'Verified', 'ref-tenant seq 1–10,000 (C9)', '#/assurance/readiness', 'Bengaluru · 106.51.x.x'],
    ['02:30', 'nightly-verifier', 'system', 'ops · read-only', 'Reconciled', 'Meter ↔ proof ↔ ERPNext, 23 Sep', '#/assurance/reconciliation', 'ap-south-1'],
    ['02:11', 'on-call (ops token)', 'system', 'ops · read-only, no tenant data', 'Read', 'Chain head digest only', '#/assurance/chain', 'ap-south-1'],
    ['02:10', 'nightly-verifier', 'system', 'ops · read-only', 'Verified', 'Seq 1–4,041', '#/assurance/chain', 'ap-south-1']
  ];
  route('/assurance/access', {
    title: 'Access log', section: 'access', keywords: 'access log who accessed audit reads sessions',
    render: function (p, query) {
      var rows = ACCESS.filter(function (r) { return (!query.kind || r[2] === query.kind) && (!query.cls || r[3].indexOf(query.cls) === 0); });
      function chip(key, val, label) { var ex = {}; ex[key] = query[key] === val ? null : val; return { label: label, href: E1.href('/assurance/access', q(query, ex)), active: query[key] === val }; }
      return page(
        ph({ title: 'Access log', lead: 'Who looked at, decided or verified what, and with which kind of token? Reads are logged here; they never enter the proof chain and are never metered.',
          actions: stateMenu('/assurance/access', [['Today', ''], ['Log unavailable', 'error']]) + c.button('People and roles', { href: '#/agents/people', icon: 'users', kind: 'ghost' }),
          meta: '<div class="ac-freshrow"><span class="e1-caption">24 Sep 2026 · IST · kept 180 days in India, no payloads</span>' + fresh('Updated', 0) + '</div>' }) +
        '<div class="ac-kpis"><div class="ac-kpi"><span class="e1-label">Sessions today</span><span class="ac-kpi__v">7</span><span class="ac-kpi__n">all with MFA</span></div><div class="ac-kpi"><span class="e1-label">Control-token actions</span><span class="ac-kpi__v">1</span><span class="ac-kpi__n">Studio · no record reads possible</span></div><div class="ac-kpi"><span class="e1-label">Ops-token reads</span><span class="ac-kpi__v">3</span><span class="ac-kpi__n">no tenant data</span></div><a class="ac-kpi" href="#/work/break-glass"><span class="e1-label">Break-glass</span><span class="ac-kpi__v">0</span><span class="ac-kpi__n">uses this period · visible to you</span></a></div>' +
        c.filters([chip('kind', 'person', 'Person'), chip('kind', 'agent', 'Agent'), chip('kind', 'system', 'Platform'), chip('cls', 'tenant', 'Tenant token'), chip('cls', 'control', 'Control token'), chip('cls', 'ops', 'Ops token')], { label: 'Show', clearHref: '#/assurance/access' }) +
        (query.state === 'error' ? c.error({ title: 'We cannot show the access log right now.', reassurance: 'Access is still being logged; nothing is lost. The log store in Mumbai did not answer.', action: { label: 'Try again', href: '#/assurance/access' } }) :
          c.table({ caption: 'Access log', dense: true, columns: [
            { key: 0, label: 'Time', mono: true, render: function (r) { return esc(r[0]) + ' IST'; } },
            { key: 1, label: 'Who', render: function (r) { return c.actor({ name: r[1], kind: r[2], size: 'sm' }); } },
            { key: 3, label: 'Token · surface', render: function (r) { return esc(r[3]); } },
            { key: 4, label: 'Action', render: function (r) { return esc(r[4]); } },
            { key: 5, label: 'What', render: function (r) { return '<a href="' + esc(r[6]) + '">' + esc(r[5]) + '</a>'; } },
            { key: 7, label: 'From', render: function (r) { return '<span class="e1-caption">' + esc(r[7]) + '</span>'; } }
          ], rows: rows, empty: { title: 'No access matches', why: 'Nobody accessed this tenant with that kind of token today.', action: { label: 'Clear filters', href: '#/assurance/access' }, icon: 'eye' } })) +
        '<p class="ac-muted-note">An ops token cannot read tenant data and a control token has no route to a record store — both are enforced by the token class, not by this screen.</p>'
      );
    }
  });

  /* ------------------------------------------------------------------------
     /assurance/incidents and /assurance/incidents/:id
     ------------------------------------------------------------------------ */
  var INC = [
    { id: 'INC-0421', sev: 'P2', cls: 'other', title: 'ERPNext target unreachable for 4 minutes (kaveri.rung1.in)', by: 'Platform-class refusal on ' + P(4102) + ' · pager', status: 'contained', noticed: iso(24, '15:10'), declared: iso(24, '15:12'), contained: iso(24, '15:14'), certin: 'not_reportable', runbook: 'Fail-closed: target after sandbox', seqs: [[4102, 4102, 'continuous', 'One platform refusal; nothing applied to live; not billed']], tl: [['15:10', 'Noticed', 'PLATFORM.TARGET_UNREACHABLE on ' + P(4102) + ' paged the on-call engineer.', 'critical'], ['15:12', 'Declared P2', 'One tenant, one target. No write proceeded without a decision.', 'warning'], ['15:14', 'Contained', 'Frappe API answering again; golden write probe returned the expected refusal.', 'info'], ['15:31', 'Verifying', 'Re-walking seq 4,100–4,112 and reconciling against ERPNext before closing.', 'neutral']] },
    { id: 'INC-0417', sev: 'P2', cls: 'other', title: 'Nightly integrity job missed its 02:10 run', by: 'Dead-man switch · 03:10 IST', status: 'closed', noticed: iso(17, '03:10'), declared: iso(17, '03:12'), contained: iso(17, '06:40'), verified: iso(17, '06:52'), closed: iso(18, '11:00'), certin: 'not_reportable', runbook: 'RB1 record writer behind (adapted)', seqs: [[1, 3302, 'continuous', 'Re-run at 06:40 found the chain continuous']], tl: [['03:10', 'Noticed', 'No success ping from the 02:10 job.', 'critical'], ['03:12', 'Declared P2', 'Chain integrity component flipped to Not checked automatically.', 'warning'], ['06:40', 'Re-run', 'Continuous · seq 1–3,302.', 'good'], ['11:00 (18 Sep)', 'Closed', 'Post-incident note published.', 'good']] },
    { id: 'INC-0412', sev: 'P2', cls: 'other', title: 'Sandbox tenant provisioning slow (p95 71 s)', by: 'Readiness SLO monitor', status: 'closed', noticed: iso(19, '09:14'), declared: iso(19, '09:20'), contained: iso(19, '13:05'), verified: iso(19, '15:00'), closed: iso(20, '10:30'), certin: 'not_reportable', runbook: 'Sandbox pool capacity', seqs: [], tl: [['09:14', 'Noticed', 'Sandbox key → usable tenant p95 at 71 s, against < 60 s.', 'warning'], ['13:05', 'Contained', 'Pool warmed to 12 spare tenants.', 'info'], ['10:30 (20 Sep)', 'Closed', 'p95 back to 38 s for 24 hours.', 'good']] }
  ];
  var INC_DRILL = { id: 'INC-0399', sev: 'P0', cls: 'chain_gap', title: 'Break at seq 3,882 · prev_digest mismatch (incident-state preview)', by: 'Nightly integrity job · 02:11 IST', status: 'open', noticed: iso(24, '02:11'), declared: iso(24, '02:14'), certin: 'pending', runbook: 'RB3 write committed without a record · RB4 record mutated outside the kernel', preview: true, seqs: [[1, 3881, 'continuous', 'Checked'], [3882, 3882, 'break', 'prev_digest does not match #3,881'], [3883, 4041, 'not_checked', 'Cannot be checked past a break']], tl: [['02:11', 'Noticed', 'FAIL at seq 3,882: prev_digest mismatch, expected a376… got 0000…', 'critical'], ['02:14', 'Declared P0', 'Tenant stopped at rung 0b: writes are paused for this organisation.', 'critical'], ['02:20', 'Stop verified', 'A probe write returned POLICY.TENANT_STOPPED as expected.', 'info']] };
  var SEV_STATE = { P0: 'critical', P1: 'serious', P2: 'warning', P3: 'neutral' };
  var STATUS_WORD = { open: ['critical', 'Open'], contained: ['info', 'Contained · verifying'], closed: ['good', 'Closed · verified'] };
  function sevBadge(s) { return c.badge(SEV_STATE[s], s + ' · ' + { P0: 'evidence integrity', P1: 'kernel unavailable', P2: 'degraded', P3: 'question' }[s]); }
  route('/assurance/incidents', {
    title: 'Incidents', section: 'incidents', keywords: 'incidents cert-in severity runbook outage',
    render: function (p, query) {
      var list = query.state === 'empty' ? [] : INC;
      return page(
        ph({ title: 'Incidents', lead: 'What went wrong, what did it touch, and is it closed on evidence? History here is never edited, and an incident cannot be closed on a theory.',
          actions: stateMenu('/assurance/incidents', [['This tenant', ''], ['No incidents', 'empty']]) + c.button('Chain-break preview', { href: '#/assurance/incidents/INC-0399', icon: 'eye', kind: 'ghost' }) + c.button('Public status', { href: '#/status', icon: 'external', kind: 'ghost' }),
          meta: '<div class="ac-freshrow"><span class="e1-caption">Clocks: CERT-In 6 h from noticing · tenant update 72 h · post-incident note 5 working days</span></div>' }) +
        c.table({ caption: 'Incidents', rowHref: function (r) { return '#/assurance/incidents/' + r.id; }, columns: [
          { key: 'id', label: 'Incident', mono: true },
          { key: 'title', label: 'What happened', render: function (r) { return '<strong class="e1-strong">' + esc(r.title) + '</strong><div class="e1-caption e1-muted">Detected by ' + esc(r.by) + '</div>'; } },
          { key: 'sev', label: 'Severity', render: function (r) { return sevBadge(r.sev); } },
          { key: 'cls', label: 'Class', mono: true },
          { key: 'st', label: 'Status', render: function (r) { var s = STATUS_WORD[r.status]; return c.badge(s[0], s[1], { subtle: true }); } },
          { key: 'n', label: 'Noticed', render: function (r) { return whenCell(r.noticed); } },
          { key: 'ci', label: 'CERT-In', render: function (r) { return esc({ not_reportable: 'Not reportable', filed: 'Filed', pending: 'Decision pending' }[r.certin]); } }
        ], rows: list, empty: { title: 'No incidents on this tenant', why: 'Nothing has gone wrong that touched Kaveri Spinning Mills’ writes, records or meter. Incidents would appear here with their clocks, the sequence ranges they touched and the runbook used.', icon: 'check', action: { label: 'See the chain-break preview', href: '#/assurance/incidents/INC-0399' } } })
      );
    }
  });
  route('/assurance/incidents/:id', {
    title: function (p) { return p.id; }, section: 'incidents', example: '/assurance/incidents/INC-0421', crumbs: crumbsA([['Incidents', '#/assurance/incidents']]),
    render: function (p) {
      var inc = p.id === INC_DRILL.id ? INC_DRILL : INC.filter(function (x) { return x.id === p.id; })[0];
      if (!inc) return page(ph({ title: p.id, lead: 'No incident with this id touched this tenant.', back: ['All incidents', '#/assurance/incidents'] }) + c.empty({ title: 'No incident ' + p.id + ' on this tenant', why: 'Incident ids are platform-wide; this one either did not touch Kaveri Spinning Mills or does not exist. History is never edited, so nothing was removed.', icon: 'alert', action: { label: 'All incidents', href: '#/assurance/incidents' } }));
      var done = { contained: !!inc.contained, verified: !!inc.verified, closed: !!inc.closed };
      var certDue = new Date(new Date(inc.noticed).getTime() + 6 * 3600000).toISOString();
      var clocks = '<div class="ac-grid ac-grid--3">' +
        c.card({ title: 'CERT-In report', body: '<p class="ac-big ac-big--sm">' + esc({ not_reportable: 'Not reportable', filed: 'Filed', pending: 'Decision pending' }[inc.certin]) + '</p><p class="e1-caption">Due ' + esc(fmt.dateTime(certDue)) + ' · six hours from noticing. “If unclear, file.”</p>' + (inc.certin === 'pending' ? c.countdown(certDue, { label: 'CERT-In due', warn: 120 }) : '') }) +
        c.card({ title: 'Tenant update', body: '<p class="ac-big ac-big--sm">' + (inc.status === 'closed' ? 'Sent' : 'Every 30 min for P0/P1') + '</p><p class="e1-caption">Written update within 72 hours; to Meenakshi Iyer (notice contact).</p>' }) +
        c.card({ title: 'Post-incident note', body: '<p class="ac-big ac-big--sm">' + (inc.closed ? 'Published' : 'Due in 5 working days') + '</p><p class="e1-caption">A P0 without a published note is itself a P1.</p>' }) + '</div>';
      return page(
        ph({ eyebrow: inc.id + ' · ' + inc.cls, title: inc.title, lead: 'Detected by ' + inc.by + '. Runbook: ' + inc.runbook + '.',
          actions: (inc.status !== 'closed' ? c.button('Mark contained', { attrs: 'data-action="ac-inc" data-step="contain"', disabled: done.contained }) + c.button('Verify', { attrs: 'data-action="ac-inc" data-step="verify"', kind: 'primary', icon: 'chain' }) + c.button('Close', { attrs: 'data-action="ac-inc" data-step="close" data-verified="' + (done.verified ? 1 : 0) + '"', disabled: !done.verified }) : c.button('Post-incident note', { icon: 'file-text', attrs: 'data-action="ac-inc" data-step="note"' })),
          meta: '<div class="ac-freshrow">' + sevBadge(inc.sev) + c.badge(STATUS_WORD[inc.status][0], STATUS_WORD[inc.status][1], { subtle: true }) + '<span class="e1-caption">Noticed ' + esc(fmt.dateTime(inc.noticed)) + ' — the clock starts here</span></div>' }) +
        (inc.preview ? c.callout({ kind: 'caveat', title: 'Preview of the incident state.', body: '<p>Kaveri Spinning Mills’ chain is continuous. This P0 is rendered from the chain-break sample so the screen can be reviewed before it is ever needed.</p>' }) : '') +
        clocks +
        '<div class="ac-split"><div class="ac-page" style="gap:var(--space-5)">' +
        c.section({ id: 'tl', title: 'Timeline', lead: 'Never edited.', body: c.timeline(inc.tl.map(function (t) { return { time: t[0] + ' IST', title: t[1], body: t[2], state: t[3] }; })) }) +
        c.section({ id: 'seqs', title: 'Sequence ranges touched', lead: 'Each range with its state after recovery. A lost record is never back-filled: a gap record is written instead.', body: inc.seqs.length ? c.table({ caption: 'Affected ranges', dense: true, columns: [
          { key: 0, label: 'Range', render: function (r) { return r[0] === r[1] ? seqLink(r[0]) : seqLink(r[0]) + '–' + seqLink(r[1]); } }, { key: 2, label: 'State', render: function (r) { return tri(r[2]); } }, { key: 3, label: 'Note', render: function (r) { return esc(r[3]); } }
        ], rows: inc.seqs }) : c.empty({ compact: true, title: 'No proof entries touched', why: 'This incident affected a platform service, not this tenant’s chain.', icon: 'chain' }) }) +
        '</div><aside class="ac-side">' + c.card({ title: 'Record', body: c.kv([['Severity', inc.sev], ['Class', inc.cls, { mono: true }], ['Declared', fmt.dateTime(inc.declared)], ['Contained', inc.contained ? fmt.dateTime(inc.contained) : 'Not yet'], ['Verified', inc.verified ? fmt.dateTime(inc.verified) : 'Not yet — required before close'], ['Closed', inc.closed ? fmt.dateTime(inc.closed) : 'Open'], ['Domains', 'in · Mumbai']], { compact: true }) }) +
        c.callout({ kind: 'rule', title: 'An incident cannot be closed on a theory.', body: '<p>The last runbook step is a command with an expected output. Close stays disabled until that verification has run.</p>' }) + '</aside></div>'
      );
    }
  });
  E1.action('ac-inc', function (el) {
    var s = el.getAttribute('data-step');
    if (s === 'verify') { E1.toast('Re-walked seq 4,100–4,112: continuous. Reconciled against ERPNext: 0 mismatches. You can close the incident now.', 'good', { title: 'Verified' }); var b = document.querySelector('[data-action="ac-inc"][data-step="close"]'); if (b) { b.disabled = false; b.setAttribute('data-verified', '1'); } return; }
    if (s === 'contain') { E1.toast('Containment recorded with the time and your name.', 'info', { title: 'Marked contained' }); el.disabled = true; return; }
    if (s === 'close') {
      if (el.getAttribute('data-verified') !== '1') { E1.toast('Verify first: an incident cannot be closed on a theory.', 'warning'); return; }
      E1.confirm({ title: 'Close this incident?', body: '<p>Closing records the verification result and starts the five-working-day clock for the post-incident note.</p>', confirmLabel: 'Close incident', onConfirm: function () { E1.toast('Incident closed on verified evidence. Note due in 5 working days.', 'good', { title: 'Closed' }); } });
      return;
    }
    if (s === 'note') E1.toast('The post-incident note opens as a read-only document for your tenant.', 'info');
  });

  /* ------------------------------------------------------------------------
     /assurance/readiness — L1 definition of done
     ------------------------------------------------------------------------ */
  route('/assurance/readiness', {
    title: 'L1 readiness', section: 'readiness', keywords: 'readiness definition of done conformance c1 c14 checklist',
    render: function () {
      var done = [
        ['1', 'Rung-skip suite: every intent climbs 0b–9 in order; no fast path, batch variant, admin mode or decision cache', 'C3 rung completeness over 100 intents · 24 Sep', 'passed', true],
        ['2', 'Import graph: nothing above P3 imports a kernel type; no model client reachable from rungs 3–8', 'C1 · every build · last 24 Sep 09:12', 'passed', true],
        ['3', 'Nightly two-way reconciliation of write ↔ record ↔ meter', 'C10 · last night 02:30 · 0 mismatches', 'passed', true],
        ['4', 'Refusal register lint: every code maps to one rung, one class and one operator action', 'CI register lint · 24 Sep', 'passed', true],
        ['5', 'Database CHECK: a refusal meters at quantity zero', 'Constraint refusal_meters_zero · attempted insert rejected in C8', 'passed', true],
        ['6', 'One write credential per environment; bypass attempts fail', 'C2 against the real ERPNext target · 24 Sep', 'passed', true],
        ['7', 'Nightly chain integrity with three-valued continuity', 'C9 over 10,000 records (flipped octet, reordered pair, duplicate, gap)', 'passed', true],
        ['8', 'The Proof screen carries the L1 sentence; no banned claim renders at L1', 'C14 string check over rendered copy', 'passed', false],
        ['9', 'Coverage is reported as x of y write types', 'This door: “19 of 23”', 'passed', false],
        ['10', 'Latency published as measured, not as targets', 'Load test not yet run', 'not_measured', false]
      ];
      var conf = [['C1', 'Import graph', 'passed', true], ['C2', 'Bypass attempt', 'passed', true], ['C3', 'Rung completeness (100 intents)', 'passed'], ['C4', 'Determinism replay', 'passed'], ['C5', 'Fail-closed matrix', 'passed'], ['C6', 'Missing grant → A0 (1,000 fuzzed)', 'passed'], ['C7', 'Idempotency', 'passed'], ['C8', 'Refusal shape (200, code, rung, zeroed record, qty 0)', 'passed'], ['C9', 'Chain integrity (10,000 records)', 'passed'], ['C10', 'Meter reconciliation', 'passed'], ['C11', 'Approval separation', 'passed'], ['C12', 'Rollback drill, both paths', 'not_measured'], ['C13', 'Version pinning', 'passed'], ['C14', 'Claim boundary', 'passed']];
      var ops = [['Security baseline (13 rows)', 'passed', '13 of 13 evidenced'], ['Tenancy: RLS and cross-tenant read test', 'passed', '23 Sep 02:50'], ['Backups', 'passed', 'nightly · PITR'], ['Restore drill', 'failed', 'Not run; RPO/RTO due 15 Oct 2026'], ['Alerting: dead-man and pager tested', 'passed', '17 Sep (real miss, paged)'], ['Runbooks RB1–RB12 with a final verify command', 'passed', 'reviewed 20 Sep'], ['Rollback: every deploy carries its inverse', 'passed', 'inverse.json on 24 Sep deploy'], ['Kill criteria signed', 'passed', 'founder and elan1 lead, 1 Sep 2026']];
      var p1 = done.filter(function (d) { return d[3] === 'passed'; }).length, p2 = conf.filter(function (d) { return d[2] === 'passed'; }).length, p3 = ops.filter(function (d) { return d[1] === 'passed'; }).length;
      return page(
        ph({ title: 'L1 readiness', lead: 'Is the L1 claim finished? The definition of done, the conformance suite and the operational bar — each passed, failed or not measured, with how we know. Never a bare tick.',
          actions: c.button('Conformance tests', { href: '#/developers/conformance', icon: 'code', kind: 'ghost' }) }) +
        '<div class="ac-kpis"><div class="ac-kpi"><span class="e1-label">Definition of done</span><span class="ac-kpi__v">' + p1 + ' of 10</span><span class="ac-kpi__n">items 1–7 are hard gates · all 7 passed</span></div><div class="ac-kpi"><span class="e1-label">Conformance C1–C14</span><span class="ac-kpi__v">' + p2 + ' of 14</span><span class="ac-kpi__n">“The suite is the claim.”</span></div><div class="ac-kpi"><span class="e1-label">Operational bar</span><span class="ac-kpi__v">' + p3 + ' of ' + ops.length + '</span><span class="ac-kpi__n">restore drill outstanding</span></div></div>' +
        c.callout({ kind: 'caveat', title: 'Two items are not green.', body: '<p>The rule is that this checklist is green before any customer is onboarded. The latency item and the restore drill are open; they are shown open, not hidden.</p>' }) +
        c.section({ id: 'dod', title: 'Definition of done', lead: 'Items 1–7 are hard gates; 8–10 make the claim honest. Wording summarised from E01 §06 and the atlas.', body: '<ol class="ac-check">' + done.map(function (d) { return '<li><span class="e1-mono">' + d[0] + '</span><div><strong>' + esc(d[1]) + '</strong>' + (d[4] ? ' ' + tag('hard gate', 'solid') : '') + '<p>How we know: ' + esc(d[2]) + '</p></div>' + tri(d[3]) + '</li>'; }).join('') + '</ol>' }) +
        c.section({ id: 'conf', title: 'Conformance C1–C14', lead: 'Run on the reference tenant; the result file is attached to every production-key request. C1 and C2 run first and are disqualifying.', body: c.table({ caption: 'Conformance results', dense: true, columns: [
          { key: 0, label: 'Test', mono: true, render: function (r) { return esc(r[0]); } }, { key: 1, label: 'What it asserts', render: function (r) { return esc(r[1]) + (r[3] ? ' ' + tag('disqualifying', 'solid') : ''); } }, { key: 2, label: 'Result', render: function (r) { return tri(r[2]); } }, { key: 4, label: 'Last run', mono: true, render: function (r) { return r[2] === 'not_measured' ? '—' : '24 Sep 12:30'; } }
        ], rows: conf }) }) +
        c.section({ id: 'ops', title: 'Operational bar', body: '<ol class="ac-check">' + ops.map(function (d, i) { return '<li><span class="e1-mono">' + (i + 1) + '</span><div><strong>' + esc(d[0]) + '</strong><p>' + esc(d[2]) + '</p></div>' + tri(d[1]) + '</li>'; }).join('') + '</ol>' })
      );
    }
  });

  /* ------------------------------------------------------------------------
     Money: /assurance/meter, /meter/:line, /invoices, /invoices/:id, /plan, /plan/upgrade, /reconciliation
     ------------------------------------------------------------------------ */
  var FLOOR_M = 15000, PACK_M = 11250, INCL_M = 40000, OVER = 1.60;
  var ACCRUED = FLOOR_M + PACK_M; // overage 0
  function pipeline() {
    var all = MT.committed + MT.refused + MT.escalated;
    return '<div class="ac-pipe" role="list" aria-label="Metering pipeline, 1–24 September">' + [
      ['Governed actions', num(all), 'committed, refused, escalated'], ['Rung 8 · proof', num(all), 'records, refusals included'], ['Rung 9 · metered', num(all), 'exactly one event each'],
      ['Meter ledger', num(MT.committed) + ' × 1', num(MT.refused + MT.escalated) + ' × 0 by CHECK'], ['meter.reconcile()', '0', 'mismatches · 02:30 IST'], ['Rate and invoice', 'at close', 'period open until 30 Sep']
    ].map(function (x) { return '<div role="listitem"><span class="e1-label">' + esc(x[0]) + '</span><b>' + esc(x[1]) + '</b><span class="e1-muted">' + esc(x[2]) + '</span></div>'; }).join('') + '</div>';
  }
  route('/assurance/meter', {
    title: 'Meter', section: 'meter', keywords: 'meter billing usage governed actions refusals zero cost allowance',
    render: function (p, query) {
      var st = query.state, sandbox = st === 'sandbox';
      var rows = METER.slice();
      var hl = query.seq ? entry(query.seq) : null;
      var tbl = c.table({ caption: 'Governed writes this period by write type', dense: true, rowHref: function (r) { return '#/assurance/meter/' + r.wt; }, columns: [
        { key: 'wt', label: 'Write type', render: function (r) { return wtCell(r.wt) + (r.wt === 'platform.obligation.resolve' ? ' ' + srcConflict('TM §19.3 meters approvals at quantity 0 (meter class approval); E06 counts them per record. Shown as E06 until decided.') : ''); } },
        { key: 'basis', label: 'Basis', render: function (r) { return esc(r.basis); } },
        { key: 'committed', label: 'Committed', align: 'right', mono: true, render: function (r) { return sandbox ? num(r.committed) + ' × 0' : num(r.committed); } },
        { key: 'refused', label: 'Refused · qty 0', align: 'right', render: function (r) { return '<a class="e1-mono" href="' + E1.href('/assurance/meter/' + r.wt, { outcome: 'refused' }) + '">' + num(r.refused) + '</a> ' + c.honesty('₹0') + ''; } },
        { key: 'escalated', label: 'Escalated · qty 0', align: 'right', render: function (r) { return r.escalated === null ? muted('—') : '<span class="e1-mono">' + num(r.escalated) + '</span> ' + c.honesty('₹0') + ''; } },
        { key: 'cost', label: 'Cost to date', align: 'right', render: function (r) { return sandbox ? '<span class="e1-mono">₹0</span>' : c.cost(0, { free: false, note: 'in allowance' }); } },
        { key: 'go', label: 'Records', render: function (r) { return '<a href="#/assurance/meter/' + esc(r.wt) + '">Show the records</a>'; } }
      ], rows: rows });
      var totalRow = '<div class="ac-line ac-total ac-totalrow"><span>Total, 1–24 Sep</span><span>' + num(MT.committed) + ' billable · ' + num(MT.refused) + ' refused · ₹0 · ' + num(MT.escalated) + ' escalated · ₹0</span></div>';
      return page(
        ph({ title: 'Meter', lead: 'What are you paying for, and does every line trace to a record? One meter event per governed write; refusals show quantity zero, visibly, on the same table.',
          actions: stateMenu('/assurance/meter', [['Open period', ''], ['Period close blocked', 'blocked'], ['Sandbox tenant', 'sandbox'], ['No writes yet', 'empty']]) + c.button('Invoices', { href: '#/assurance/invoices', icon: 'file-text' }) + c.button('Reconciliation', { href: '#/assurance/reconciliation', icon: 'scale', kind: 'ghost' }),
          meta: '<div class="ac-freshrow">' + c.badge(st === 'blocked' ? 'serious' : 'info', st === 'blocked' ? 'Period blocked' : 'Period open', { subtle: true }) + '<span class="e1-caption">1–30 Sep 2026 · periods cut in IST · closes 1 Oct + 24 h</span>' + freshAt('Reconciled both ways', iso(24, '02:30')) + fresh('Meter updated', 0) + '</div>' }) +
        (st === 'blocked' ? '<div class="ac-banner" role="alert">' + c.icon('alert', 18) + '<div><strong>Period close is blocked: M2 found 1 proof record with no meter event.</strong><p>The invoice is held and on-call has been paged. Your period stays open until it is fixed; nothing is billed over an unreconciled period.</p><p style="margin-top:6px">' + c.button('Open reconciliation', { href: '#/assurance/reconciliation?state=blocked', size: 'sm' }) + '</p></div></div>' : '') +
        (sandbox ? '<div class="ac-banner ac-banner--info" role="note">' + c.icon('info', 18) + '<div><strong>Sandbox events — quantity zero, not billed.</strong><p>Every write in a sandbox tenant is recorded and metered at quantity zero. Nothing on this screen becomes an invoice line.</p></div></div>' : '') +
        (hl ? c.callout({ kind: 'info', title: 'Meter event for ' + P(hl.seq), body: '<p>' + esc(hl.label) + ' · basis ' + esc(hl.basis) + ' · quantity ' + hl.qty + (hl.qty ? '' : ' · ₹0') + '. It sits in the <a href="#/assurance/meter/' + esc(hl.wt) + '?seq=' + hl.seq + '">' + esc(hl.wt) + '</a> line.</p>' }) : '') +
        (st === 'empty' ? c.empty({ title: 'No governed writes this period', why: 'Nothing was committed, refused or escalated on this tenant between 1 and 24 September. Refusals would appear here at ₹0; they have not happened either.', icon: 'rupee', action: { label: 'Plan and allowance', href: '#/assurance/plan' } }) :
          '<div class="ac-kpis">' +
          '<a class="ac-kpi" href="' + E1.href('/assurance/meter/included') + '"><span class="e1-label">Billable, committed</span><span class="ac-kpi__v">' + num(MT.committed) + '</span><span class="ac-kpi__n">quantity 1 each</span></a>' +
          '<a class="ac-kpi" href="' + E1.href('/assurance/meter/refused') + '"><span class="e1-label">Refused</span><span class="ac-kpi__v">' + num(MT.refused) + ' · ₹0</span><span class="ac-kpi__n">quantity 0 by database CHECK</span></a>' +
          '<a class="ac-kpi" href="' + E1.href('/assurance/meter/escalated') + '"><span class="e1-label">Escalated</span><span class="ac-kpi__v">' + num(MT.escalated) + ' · ₹0</span><span class="ac-kpi__n">quantity 0 while waiting</span></a>' +
          '<a class="ac-kpi" href="#/assurance/plan"><span class="e1-label">Monthly allowance</span><span class="ac-kpi__v">' + (MT.committed / INCL_M * 100).toFixed(1) + '%</span>' + c.progress(MT.committed, INCL_M, {}) + '<span class="ac-kpi__n">' + num(MT.committed) + ' of ' + num(INCL_M) + ' included</span></a>' +
          '<a class="ac-kpi" href="#/assurance/invoices/INV-KS-2026-09"><span class="e1-label">Cost to date</span><span class="ac-kpi__v">' + (sandbox ? '₹0' : esc(fmt.inr(ACCRUED))) + '</span><span class="ac-kpi__n">floor ₹15,000 + ledger1 ₹11,250 + overage ₹0 · ex-GST</span></a></div>' +
          pipeline() +
          c.section({ id: 'lines', title: 'By write type', lead: 'Basis comes from the declared blast radius; it is normative and never configurable per customer.', body: tbl + totalRow }) +
          '<div class="ac-grid ac-grid--2">' + c.card({ title: 'Cost per governed action', body: '<div class="ac-line"><span>Measured cost to serve (published weekly)</span><span>not yet measured</span></div><div class="ac-line"><span>Modelled cost to serve</span><span>₹0.20 ' + tag('modelled') + '</span></div><div class="ac-line"><span>Refusal rate beside it</span><span>' + (MT.refused / (MT.committed + MT.refused + MT.escalated) * 100).toFixed(1) + '%</span></div><p class="ac-muted-note" style="margin-top:8px">Published with its denominator named: committed actions only.</p>' }) +
          c.card({ title: 'Why refusals are free', body: '<p class="ac-quote">“When a CFO asks whether we are incentivised to make the system say no, that constraint is the answer.”</p><p class="ac-muted-note" style="margin-top:8px">The caller never supplies a quantity; a database CHECK refuses a non-zero refusal row; the nightly run asserts it again. Throttles (429) and platform failures are not billed either.</p>' }) + '</div>')
      );
    }
  });

  var SPECIAL_LINES = {
    included: { title: 'Governed actions — included', filter: function (e) { return e.out === 'committed'; }, qty: MT.committed, note: 'Committed governed actions inside your monthly allowance of 40,000.' },
    overage: { title: 'Governed actions — beyond allowance', filter: function () { return false; }, qty: 0, note: 'Nothing went beyond the allowance this period.' },
    refused: { title: 'Refused · ₹0', filter: function (e) { return e.out === 'refused'; }, qty: MT.refused, note: 'Shown on the face of every invoice at ₹0.' },
    escalated: { title: 'Escalated · ₹0', filter: function (e) { return e.out === 'escalated'; }, qty: MT.escalated, note: 'Writes that waited on a person; the resubmitted write is billed if it commits.' }
  };
  route('/assurance/meter/:line', {
    title: function (p) { return SPECIAL_LINES[p.line] ? SPECIAL_LINES[p.line].title : WT[p.line] ? wt(p.line).label : 'Invoice line'; }, section: 'meter', example: '/assurance/meter/erp.sales_invoice.submit', crumbs: crumbsA([['Meter', '#/assurance/meter']]),
    render: function (p, query) {
      var line = p.line, sp = SPECIAL_LINES[line], isWt = !!WT[line];
      if (line === 'floor' || line === 'pack-ledger1') {
        return page(ph({ title: line === 'floor' ? 'Platform floor' : 'ledger1 regulatory pack', lead: 'A fixed line: it has no write_id because it is not metered.', back: ['Meter', '#/assurance/meter'] }) +
          c.card({ body: c.kv([['Amount', line === 'floor' ? '₹15,000 a month (₹1,80,000 a year)' : '₹11,250 a month (₹1,35,000 a year)'], ['What it pays for', line === 'floor' ? 'The right to run an evidence plane: append-only storage that never compacts, a registry that keeps every version for ever, and the residency footprint.' : 'The ledger1 declaration and verifier profile for the MCA audit-trail rule, kept current.'], ['Discountable', line === 'floor' ? 'No — the floor is not discountable, by anybody' : 'Only with an end date']]) }) +
          '<p class="ac-muted-note">Metered lines — governed actions, refusals, escalations — each open their records by write_id and seq.</p>');
      }
      if (!sp && !isWt) return page(ph({ title: 'Invoice line not found', lead: 'No line with this name exists on this tenant’s meter.', back: ['Meter', '#/assurance/meter'] }) + c.empty({ title: '“' + line + '” is not a line on this meter', why: 'Lines are write types, or the fixed lines on an invoice. An invoice line with no write_id cannot exist: the schema has no such row.', icon: 'rupee', action: { label: 'Back to the meter', href: '#/assurance/meter' } }));
      var m = isWt ? METER.filter(function (r) { return r.wt === line; })[0] : null;
      var ev = range(HEAD - 199, HEAD).filter(function (e) { return (sp ? sp.filter(e) : e.wt === line) && (!query.outcome || e.out === query.outcome); });
      var hlSeq = query.seq ? Number(query.seq) : null;
      var title = sp ? sp.title : wt(line).label + ' · ' + line;
      var tblHtml = c.table({ caption: 'Meter events behind this line', dense: true, rowHref: function (e) { return '#/assurance/proof/' + e.seq; }, columns: [
        { key: 'seq', label: 'Seq', mono: true, render: function (e) { return P(e.seq) + (e.seq === hlSeq ? ' ' + c.badge('info', 'This one', { subtle: true }) : ''); } },
        { key: 'ev', label: 'event_id', mono: true, render: function (e) { return esc(fmt.shortHash(uuid(e.seq * 17), 8, 4)); } },
        { key: 'wid', label: 'write_id', mono: true, render: function (e) { return esc(fmt.shortHash(e.writeId, 8, 4)); } },
        { key: 'at', label: 'At', render: function (e) { return whenCell(e.at); } },
        { key: 'wt', label: 'Write type', render: function (e) { return wtCell(e.wt); } },
        { key: 'out', label: 'Outcome', render: outcomeOf },
        { key: 'basis', label: 'Basis', render: function (e) { return esc(e.basis); } },
        { key: 'qty', label: 'Qty', align: 'right', mono: true, render: function (e) { return String(e.qty); } },
        { key: 'price', label: 'Price', align: 'right', mono: true, render: function (e) { return e.qty ? '₹0 · included' : '₹0'; } }
      ], rows: ev, empty: { title: line === 'overage' ? 'Nothing went beyond your allowance' : 'No events of this kind in the most recent 200 entries', why: line === 'overage' ? '3,733 of the 40,000 governed actions included this month have been used, so this line is zero.' : 'The period total is on the meter; the most recent 200 entries hold none of these.', icon: 'rupee', action: { label: 'Back to the meter', href: '#/assurance/meter' } } });
      return page(
        ph({ eyebrow: 'Invoice line · September 2026', title: title, lead: 'Show the records behind this line: every meter event, by write_id and seq, opens its proof record. ' + (sp ? sp.note : 'Basis ' + m.basis + '.'),
          actions: (isWt ? c.segmented([{ id: 'all', label: 'All', href: E1.href('/assurance/meter/' + line, q(query, { outcome: null })) }, { id: 'committed', label: 'Committed', href: E1.href('/assurance/meter/' + line, q(query, { outcome: 'committed' })) }, { id: 'refused', label: 'Refused', href: E1.href('/assurance/meter/' + line, q(query, { outcome: 'refused' })) }, { id: 'escalated', label: 'Escalated', href: E1.href('/assurance/meter/' + line, q(query, { outcome: 'escalated' })) }], query.outcome || 'all', { label: 'Outcome', size: 'sm' }) : '') +
            c.button('Dispute this line', { icon: 'flag', attrs: 'data-action="ac-dispute" data-line="' + esc(line) + '"' }) }) +
        '<div class="ac-kpis">' +
        (m ? '<div class="ac-kpi"><span class="e1-label">Committed · billable</span><span class="ac-kpi__v">' + num(m.committed) + '</span><span class="ac-kpi__n">' + esc(m.basis) + '</span></div><div class="ac-kpi"><span class="e1-label">Refused</span><span class="ac-kpi__v">' + num(m.refused) + ' · ₹0</span><span class="ac-kpi__n">quantity 0</span></div><div class="ac-kpi"><span class="e1-label">Escalated</span><span class="ac-kpi__v">' + (m.escalated === null ? '—' : num(m.escalated) + ' · ₹0') + '</span><span class="ac-kpi__n">quantity 0</span></div>'
          : '<div class="ac-kpi"><span class="e1-label">Quantity this period</span><span class="ac-kpi__v">' + num(sp.qty) + '</span><span class="ac-kpi__n">1–24 Sep</span></div>') +
        '<div class="ac-kpi"><span class="e1-label">Line amount to date</span><span class="ac-kpi__v">₹0</span><span class="ac-kpi__n">' + (line === 'refused' || line === 'escalated' ? 'always ₹0' : 'inside the allowance') + '</span></div>' +
        '<a class="ac-kpi" href="#/assurance/reconciliation"><span class="e1-label">Reconciled</span><span class="ac-kpi__v">0</span><span class="ac-kpi__n">mismatches · 02:30 IST</span></a></div>' +
        '<p class="ac-muted-note">Showing events in seq ' + num(HEAD - 199) + '–' + num(HEAD) + '. A disputed line holds only its seq range; the rest of the invoice proceeds. If a record does not support the line, the line is credited in full and a meter defect is opened.</p>' +
        tblHtml
      );
    }
  });
  E1.action('ac-dispute', function (el) {
    var line = el.getAttribute('data-line') || 'this line';
    var m = E1.modal({ title: 'Dispute ' + line, eyebrow: 'Holds only this line’s seq range',
      body: '<p style="margin-top:0">The rest of the invoice proceeds. The dispute is settled against the proof records: if a record does not support the line, it is credited in full.</p>' +
        c.field('What looks wrong', c.textarea({ id: 'ac-dsp', rows: 4, placeholder: 'For example: 12 invoices on 18 Sep were submitted twice from the ERPNext side, not through elan1.', describedBy: 'ac-dsp-msg' }), { id: 'ac-dsp', required: true, help: 'At least one sentence (12 characters or more). It is recorded with your name.' }),
      actions: [{ label: 'Cancel', kind: 'secondary' }, { label: 'Hold this line', kind: 'primary', close: false, onClick: function (e, close, root) {
        var ta = (root || m.el).querySelector('#ac-dsp'), v = ta ? ta.value.trim() : '';
        if (v.length < 12) { var f = ta.closest('.e1-field'); f.classList.add('is-invalid'); ta.setAttribute('aria-invalid', 'true'); var msg = f.querySelector('#ac-dsp-msg'); if (msg) { msg.textContent = 'Say what looks wrong in at least one sentence — 12 characters or more.'; msg.className = 'e1-field__error'; msg.setAttribute('role', 'alert'); } ta.focus(); return false; }
        close(); E1.toast('Line ' + line + ' is held while it is checked against the proof records. The rest of the invoice proceeds.', 'info', { title: 'Dispute recorded', action: { label: 'Reconciliation', href: '#/assurance/reconciliation' } });
      } }] });
  });

  var INVOICES = {
    'INV-KS-2026-09': { id: 'INV-KS-2026-09', period: 'September 2026', from: '1 Sep 2026', to: '30 Sep 2026', status: 'open', issued: null, lines: [
      ['floor', 'Platform floor · L1 Guarded · September', '1 month', FLOOR_M, 'Not discountable'],
      ['included', 'Governed actions — included', num(MT.committed) + ' of ' + num(INCL_M), 0, 'seq ranges by write type'],
      ['overage', 'Governed actions — beyond allowance', '0 × ₹1.60', 0, ''],
      ['refused', 'Refused', num(MT.refused), 0, 'always ₹0'],
      ['escalated', 'Escalated (waited on a person)', num(MT.escalated), 0, 'always ₹0'],
      ['pack-ledger1', 'ledger1 regulatory pack', '1 month', PACK_M, '₹1,35,000 a year']
    ] },
    'INV-KS-2026-P1': { id: 'INV-KS-2026-P1', period: 'Pilot · 5 Jun – 2 Sep 2026', from: '5 Jun 2026', to: '2 Sep 2026', status: 'issued', issued: '3 Sep 2026', pilot: true, lines: [
      ['included', 'Pilot governed actions (2,000 hard stop)', '1,962 of 2,000', 0, 'pilot price ₹0'],
      ['refused', 'Refused', '88', 0, 'always ₹0'],
      ['escalated', 'Escalated (waited on a person)', '141', 0, 'always ₹0'],
      ['floor', 'Platform floor · L1 · 90 days', '90 days', 0, 'discount of 100% from list ₹44,384, ended 2 Sep 2026']
    ] }
  };
  function invTotals(inv) { var sub = inv.lines.reduce(function (a, l) { return a + l[3]; }, 0); var gst = Math.round(sub * 0.18); return { sub: sub, gst: gst, total: sub + gst }; }
  route('/assurance/invoices', {
    title: 'Invoices', section: 'invoices', keywords: 'invoices billing refused zero gst',
    render: function (p, query) {
      var blocked = query.state === 'blocked';
      var list = [INVOICES['INV-KS-2026-09'], INVOICES['INV-KS-2026-P1']];
      return page(
        ph({ title: 'Invoices', lead: 'Every invoice shows its refusals at ₹0 on the face of the invoice, and every metered line opens the records behind it.',
          actions: stateMenu('/assurance/invoices', [['Default', ''], ['September blocked', 'blocked']]) + c.button('Meter', { href: '#/assurance/meter', icon: 'rupee', kind: 'ghost' }) }) +
        c.table({ caption: 'Invoices', rowHref: function (r) { return '#/assurance/invoices/' + r.id; }, columns: [
          { key: 'id', label: 'Invoice', mono: true }, { key: 'period', label: 'Period' },
          { key: 'st', label: 'Status', render: function (r) { return r.status === 'issued' ? c.badge('good', 'Issued ' + r.issued, { subtle: true }) : blocked ? c.badge('serious', 'Blocked · unreconciled', { subtle: true }) : c.badge('info', 'Period open · draft', { subtle: true }); } },
          { key: 'c', label: 'Committed', align: 'right', mono: true, render: function (r) { return r.lines.filter(function (l) { return l[0] === 'included'; })[0][2].split(' ')[0]; } },
          { key: 'r', label: 'Refused', align: 'right', render: function (r) { return '<span class="e1-mono">' + r.lines.filter(function (l) { return l[0] === 'refused'; })[0][2] + '</span> ' + c.honesty('₹0') + ''; } },
          { key: 't', label: 'Total incl. GST', align: 'right', render: function (r) { return c.amount(invTotals(r).total, { strong: true }); } }
        ], rows: list }) +
        '<p class="ac-muted-note">An invoice is never issued over an unreconciled period. If two meters disagree, the invoice goes out at the lower number and the difference is carried as a named open item with an owner and a date.</p>'
      );
    }
  });
  route('/assurance/invoices/:id', {
    title: function (p) { return p.id; }, section: 'invoices', example: '/assurance/invoices/INV-KS-2026-09', crumbs: crumbsA([['Invoices', '#/assurance/invoices']]),
    render: function (p) {
      var inv = INVOICES[p.id];
      if (!inv) return page(ph({ title: p.id, lead: 'No invoice with this number exists for this tenant.', back: ['Invoices', '#/assurance/invoices'] }) + c.empty({ title: 'No invoice ' + p.id, why: 'Kaveri Spinning Mills has two invoices: the pilot (₹0) and September, which is still open.', icon: 'file-text', action: { label: 'All invoices', href: '#/assurance/invoices' } }));
      var t = invTotals(inv), t0 = E1.tenant() || {};
      var lines = '<div class="e1-table-wrap"><table class="e1-table"><caption class="e1-sr">Invoice lines</caption><thead><tr><th scope="col">Line</th><th scope="col">Quantity</th><th scope="col" class="is-right">Amount</th><th scope="col">Records</th><th scope="col"><span class="e1-sr">Dispute</span></th></tr></thead><tbody>' +
        inv.lines.map(function (l) {
          var metered = ['included', 'overage', 'refused', 'escalated'].indexOf(l[0]) >= 0;
          return '<tr class="' + (l[0] === 'refused' ? 'ac-inv-refused' : '') + '"><th scope="row">' + esc(l[1]) + (l[4] ? '<div class="e1-caption e1-muted" style="font-weight:var(--weight-regular)">' + esc(l[4]) + '</div>' : '') + '</th><td class="e1-mono">' + esc(l[2]) + '</td><td class="is-right">' + c.amount(l[3]) + '</td><td>' + (metered ? '<a href="#/assurance/meter/' + l[0] + '">Show the records behind this line</a>' : '<a href="#/assurance/meter/' + l[0] + '">Fixed line — why</a>') + '</td><td>' + (metered && inv.status !== 'issued' ? c.button('Dispute', { size: 'sm', kind: 'ghost', attrs: 'data-action="ac-dispute" data-line="' + esc(l[1]) + '"' }) : '') + '</td></tr>';
        }).join('') +
        '<tr><th scope="row">Subtotal</th><td></td><td class="is-right">' + c.amount(t.sub) + '</td><td colspan="2"></td></tr>' +
        '<tr><th scope="row">IGST 18%</th><td></td><td class="is-right">' + c.amount(t.gst) + '</td><td colspan="2"></td></tr>' +
        '<tr class="ac-inv-total"><th scope="row">Total</th><td></td><td class="is-right">' + c.amount(t.total, { strong: true }) + '</td><td colspan="2"></td></tr></tbody></table></div>';
      return page(
        ph({ eyebrow: inv.status === 'issued' ? 'Tax invoice · issued ' + inv.issued : 'Draft · period open', title: inv.id, lead: inv.status === 'issued' ? 'Issued after the period was reconciled in both directions.' : 'Draft for the open period. It is issued only after the period closes and reconciles; figures move until then.',
          actions: c.button('Print', { icon: 'file-text', attrs: 'onclick="window.print()"', kind: 'ghost' }) + c.button('Meter', { href: '#/assurance/meter', icon: 'rupee' }) }) +
        (inv.status !== 'issued' ? c.callout({ kind: 'info', title: 'Not issued yet.', body: '<p>Period closes 30 Sep 2026; closing takes up to 24 hours; the invoice issues once M1–M5 all read zero.</p>' }) : '') +
        '<article class="ac-invoice"><div class="ac-invoice__head"><div><p class="e1-label">From</p><p style="margin:4px 0 0"><strong>elan1 Private Limited</strong><br><span class="e1-caption">Sample invoice · sandbox data</span></p></div>' +
        '<div><p class="e1-label">Billed to</p><p style="margin:4px 0 0"><strong>' + esc(t0.name || 'Kaveri Spinning Mills Pvt Ltd') + '</strong><br><span class="e1-caption e1-mono">GSTIN ' + esc(t0.gstin || '33AAACK4821M1Z7') + '</span></p></div>' +
        '<div><p class="e1-label">Period</p><p style="margin:4px 0 0">' + esc(inv.from) + ' – ' + esc(inv.to) + '<br><span class="e1-caption">Plan L1 Guarded · billed monthly</span></p></div></div>' +
        lines +
        '<p class="ac-muted-note">Every line resolves to hash-chained records. If a record does not support a line, the line is credited in full. Refusals are metered at quantity zero and never billed; the count is printed here, not hidden in a portal.</p></article>'
      );
    }
  });

  route('/assurance/plan', {
    title: 'Plan', section: 'plan', keywords: 'plan pricing allowance level l1 l2 upgrade price book',
    render: function () {
      return page(
        ph({ title: 'Plan', lead: 'What have you signed up for, and how much of it have you used? L1 Guarded, with ledger1 — and what each level would cost.',
          actions: c.button('Move to L2 Attested', { href: '#/assurance/plan/upgrade?to=L2', kind: 'primary', iconRight: 'arrow-right' }) }) +
        '<div class="ac-banner ac-banner--warning" role="note">' + c.icon('info', 18) + '<div><strong>Indicative pricing — modelled, subject to change before general availability.</strong><p>This is the modelled elan1 price book (plan of record), not a published price list. In Phase 1 elan1 is consumed inside rung1’s published price and has no external price list yet. ' + srcConflict('E07: elan1 is inside rung1’s price (₹2,499 / 7,999 / 19,999 / 49,999+ a month by turnover band). The IM price book is shown here so the invoice shape can be reviewed.') + '</p></div></div>' +
        '<div class="ac-grid ac-grid--2">' + c.card({ eyebrow: 'Current plan', title: 'L1 Guarded + ledger1', body: c.kv([['Platform floor', '₹1,80,000 a year · ₹15,000 a month'], ['Included governed actions', '4,80,000 a year · 40,000 a month'], ['Beyond the allowance', '₹1.60 per governed action'], ['Pack', 'ledger1 · ₹1,35,000 a year'], ['Term', '2 Sep 2026 – 1 Sep 2027'], ['Discount', 'None. Every discount carries an end date.'], ['Refusals', '₹0, always']], { compact: true }) }) +
        c.card({ eyebrow: 'Used', title: 'Allowance this plan year', body: c.progress(MT.committed, 480000, { label: 'Governed actions, plan year to date', note: num(MT.committed) + ' of 4,80,000' }) + '<div style="height:12px"></div>' + c.progress(MT.committed, INCL_M, { label: 'This month', note: num(MT.committed) + ' of 40,000' }) +
          '<p class="ac-muted-note" style="margin-top:12px">At this month’s pace you would use about 4,700 a month — well inside the allowance. Included actions are consumed first.</p>', footer: linkArrow('Meter', '#/assurance/meter') }) + '</div>' +
        c.section({ id: 'plans', title: 'Plans by level', lead: 'Per tenant per year. The included rate rises with the level while the overage rate falls: the floor is a right to run an evidence plane, the overage is consumption.', body: c.table({ caption: 'Plans', columns: [
          { key: 'name', label: 'Plan', render: function (r) { return (r.id !== 'SOV' ? c.level(r.id) : '<strong>' + esc(r.name) + '</strong>') + (r.id === 'L1' ? ' ' + c.badge('good', 'Current', { subtle: true }) : ''); } },
          { key: 'floor', label: 'Platform floor', align: 'right', render: function (r) { return c.amount(r.floor); } },
          { key: 'incl', label: 'Included actions', align: 'right', mono: true, render: function (r) { return r.incl ? num(r.incl) : '—'; } },
          { key: 'over', label: 'Beyond allowance', align: 'right', mono: true, render: function (r) { return '₹' + r.over.toFixed(2); } },
          { key: 'status', label: 'Availability', render: function (r) { return '<span class="e1-caption">' + esc(r.status) + '</span>'; } }
        ], rows: PLANS }) }) +
        '<div class="ac-grid ac-grid--2">' + c.card({ title: 'Add-ons', body: [['Regulatory pack (blended)', '₹1,35,000 per tenant per year'], ['Verifier profile (L2)', '₹3,00,000 per regime per year'], ['Evidence bundle beyond allowance (L2)', '₹2,500 each'], ['Counterparty verification seat (L3)', '₹45,000 per year — receiving-side console access, never the verifier']].map(function (x) { return '<div class="ac-line"><span>' + esc(x[0]) + '</span><span>' + esc(x[1]) + '</span></div>'; }).join('') }) +
        c.card({ title: 'Always ₹0', body: [['A refusal', '₹0'], ['The offline verifier', '₹0 — source, to anyone, for ever'], ['Sandbox tenants', 'metered at quantity 0'], ['Approvals and throttles', 'never billed']].map(function (x) { return '<div class="ac-line"><span>' + esc(x[0]) + '</span><span>' + esc(x[1]) + '</span></div>'; }).join('') + '<p class="ac-muted-note" style="margin-top:8px">No per-seat price and no outcome price, at any level. The floor, the meter basis and the price of a refusal are never discounted.</p>' }) + '</div>'
      );
    }
  });

  route('/assurance/plan/upgrade', {
    title: 'Change plan', section: 'plan', crumbs: crumbsA([['Plan', '#/assurance/plan']]), keywords: 'upgrade plan l2 attested price delta boundary',
    render: function (p, query) {
      var to = query.to === 'L3' ? 'L3' : 'L2', tp = PLANS.filter(function (x) { return x.id === to; })[0], cur = PLANS[0];
      var delta = tp.floor - cur.floor;
      return page(
        ph({ title: 'Move to ' + to + ' ' + E1.LEVELS[to].name, lead: 'What changes, what it costs, and where the boundary falls. Moving level is a governed write with dual control; nothing is re-declared or migrated.', back: ['Plan', '#/assurance/plan'],
          actions: c.segmented([{ id: 'L2', label: 'To L2 Attested', href: E1.href('/assurance/plan/upgrade', { to: 'L2' }) }, { id: 'L3', label: 'To L3 Proven', href: E1.href('/assurance/plan/upgrade', { to: 'L3' }) }], to, { label: 'Target level', size: 'sm' }) }) +
        c.stepper([{ label: 'What changes' }, { label: 'Price' }, { label: 'Key custody' }, { label: 'Boundary' }, { label: 'Approval' }], 0) +
        c.locked({ level: to, always: true, compact: true, title: to + ' ' + E1.LEVELS[to].name + ' is a frozen specification today', why: to === 'L2' ? 'It arrives after the L2 gate (Phase 3). Asking now records your intent as a governed write; nothing changes at your tenant until every precondition is met.' : 'Entry to L3 is an event: an outside auditor accepts an L2 bundle in a real engagement. L2 comes first.' }) +
        '<div class="ac-grid ac-grid--2">' +
        c.card({ title: '1 · What changes', body: '<ul style="margin:0;padding-left:18px;line-height:1.6">' + (to === 'L2' ? ['Records are signed from a named sequence number onward — Ed25519 over the same digest.', 'Merkle roots are timestamped by two authorities within 15 minutes.', 'You can export an evidence bundle that a stranger checks offline with the free verifier.', 'Everything before the boundary stays Level 1 for ever.'] : ['Cross-organisation receipts and selective disclosure.', 'Customer-held keys become possible.', 'A counter-signature by a party that is not elan1.']).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' }) +
        c.card({ title: '2 · Price', body: '<div class="ac-line"><span>Platform floor</span><span>' + esc(fmt.inr(cur.floor)) + ' → ' + esc(fmt.inr(tp.floor)) + '</span></div><div class="ac-line"><span>Difference per year</span><span>+' + esc(fmt.inr(delta)) + '</span></div><div class="ac-line"><span>Included actions</span><span>' + num(cur.incl) + ' → ' + num(tp.incl) + '</span></div><div class="ac-line"><span>Beyond allowance</span><span>₹1.60 → ₹' + tp.over.toFixed(2) + '</span></div>' + (to === 'L2' ? '<div class="ac-line"><span>Verifier profile in-mca-audit-trail</span><span>₹3,00,000 a year</span></div><div class="ac-line"><span>The verifier itself</span><span>₹0</span></div>' : '') + '<p class="ac-muted-note" style="margin-top:8px">Modelled prices, subject to change before general availability.</p>' }) +
        c.card({ title: '3 · Key custody', body: c.radio({ name: 'ac-kc', id: 'ac-kc1', label: 'elan1 KMS, one key per residency domain (in · Mumbai)', note: 'At Phase 3 the key sits in elan1’s cloud account; a sufficiently privileged insider there could alter the key policy.', checked: true }) + c.radio({ name: 'ac-kc', id: 'ac-kc2', label: 'Your own HSM (customer-held keys)', note: 'Level 3 only.', disabled: to !== 'L3', checked: false }) }) +
        c.card({ title: '4 · Boundary preview', body: '<p style="margin:0">Records <span class="e1-mono">1–' + num(HEAD) + '</span> stay L1. Signing starts at the next record after stage 2 of the runbook — an irreversible step that needs a second named person at Decide.</p>' + '<div style="margin-top:12px">' + strip(range(HEAD - 3, HEAD)) + '</div><p class="ac-muted-note">Nothing is back-signed. Use “records from {date} are signed; the {n} records before that date are Level 1” — never “the tenant’s records are signed”.</p>' }) + '</div>' +
        c.card({ title: '5 · Approval', body: '<p style="margin:0 0 12px">Requesting the move is a governed write with dual control. You propose it; a second named person — Meenakshi Iyer or Ravi Shankar — approves it at Decide.</p>' + c.button('Request the move to ' + to, { kind: 'gate', attrs: 'data-action="ac-upgrade" data-to="' + to + '"' }) + ' ' + c.button('Read the upgrade runbook', { href: '#/assurance/upgrade', kind: 'ghost', iconRight: 'arrow-right' }) })
      );
    }
  });
  E1.action('ac-upgrade', function (el) {
    var to = el.getAttribute('data-to');
    E1.confirm({ title: 'Request the move to ' + to + '?', eyebrow: 'Governed write · dual control', body: '<p>This records a request, proposed by you. It waits on a second named approver and changes nothing at your tenant until every precondition is verified.</p>', confirmLabel: 'Record the request', kind: 'gate',
      onConfirm: function () { E1.toast('Recorded as a governed write and waiting on Meenakshi Iyer as the second approver. Nothing has changed yet.', 'warning', { title: 'Waiting on a person · OB-2026-0426', action: { label: 'Open approvals', href: '#/work/approvals' } }); } });
  });

  var RECON = [];
  (function () {
    for (var d = 23; d >= 12; d--) {
      var rec = 150 + ((d * 53) % 90), m = [0, 0, 0, 0, 0], note = '';
      if (d === 16) { m[4] = null; note = 'M5 not measured: the ERPNext change feed snapshot was unavailable. Re-run next night covered both days.'; }
      if (d === 12) { m[2] = 1; note = 'One outcome disagreement, corrected by meter_adjustment ADJ-0003 (approved by Ravi Shankar and Meenakshi Iyer). Never an update.'; }
      RECON.push({ day: d, at: iso(d + 1, '02:30'), records: rec, events: rec, target: Math.round(rec * 0.86), m: m, note: note });
    }
  })();
  route('/assurance/reconciliation', {
    title: 'Reconciliation', section: 'reconciliation', keywords: 'reconciliation meter proof invoice m1 m5 nightly two-way',
    render: function (p, query) {
      var blocked = query.state === 'blocked';
      var CHECKS = [['M1', 'Meter events with no proof record'], ['M2', 'Proof records with no meter event'], ['M3', 'Outcome disagreement (zeroed record ↔ non-committed meter)'], ['M4', 'Non-zero quantity on anything but a committed production action'], ['M5', 'Committed changes in ERPNext with no record — the only check that catches writes around the kernel']];
      var last = RECON[0];
      function cellM(v) { return v === null ? tri('not_measured', 'Not measured') : v === 0 ? '<span class="e1-mono">0</span>' : c.badge('serious', String(v) + ' found'); }
      return page(
        ph({ title: 'Reconciliation', lead: 'Does every meter event trace to a record, every record to a meter event, and every change in ERPNext to a record? Checked nightly in both directions.',
          actions: stateMenu('/assurance/reconciliation', [['Last night', ''], ['Period close blocked', 'blocked']]) + c.button('Run now', { icon: 'refresh', kind: 'primary', attrs: 'data-action="ac-recon"' }),
          meta: '<div class="ac-freshrow">' + freshAt('Last run', iso(24, '02:30')) + '<span class="e1-caption">covering 23 Sep · both directions</span></div>' }) +
        (blocked ? '<div class="ac-banner" role="alert">' + c.icon('alert', 18) + '<div><strong>M2 = 1: proof ' + P(4088) + ' has no meter event.</strong><p>The September invoice is blocked and on-call has been paged. The first two lines of this check being non-zero is a P0. The fix will be a new meter_adjustment row with a named approver — never an update.</p></div></div>' : '') +
        '<div class="ac-kpis">' + CHECKS.map(function (x, i) { var v = blocked && i === 1 ? 1 : last.m[i]; return '<div class="ac-kpi"><span class="e1-label">' + x[0] + '</span><span class="ac-kpi__v">' + (v === null ? '—' : v) + '</span><span class="ac-kpi__n">' + esc(x[1]) + '</span></div>'; }).join('') + '</div>' +
        c.section({ id: 'runs', title: 'Nightly runs', body: c.table({ caption: 'Reconciliation runs', dense: true, columns: [
          { key: 'day', label: 'Covers', render: function (r) { return '<span class="ac-nowrap">' + r.day + ' Sep 2026</span>'; } },
          { key: 'rec', label: 'Records ↔ events', align: 'right', mono: true, render: function (r) { return num(r.records) + ' ↔ ' + num(r.events); } },
          { key: 'tg', label: 'ERPNext changes ↔ committed', align: 'right', mono: true, render: function (r) { return num(r.target) + ' ↔ ' + num(r.target); } }
        ].concat(CHECKS.map(function (x, i) { return { key: x[0], label: x[0], align: 'center', render: function (r) { return cellM(blocked && r === last && i === 1 ? 1 : r.m[i]); } }; })).concat([
          { key: 'note', label: 'Note', render: function (r) { return r.note ? '<span class="e1-caption" style="white-space:normal;display:block;max-width:300px">' + esc(r.note) + '</span>' : muted('—'); } }
        ]), rows: RECON }) }) +
        '<div class="ac-grid ac-grid--2">' + c.card({ title: 'Tolerances', body: [['Kernel meter ↔ rung1 credit ledger', 'zero — the kernel is right'], ['Runtime meter ↔ component counters', '0.5%'], ['Untraceable invoice line', 'zero — removed and credited'], ['At invoice time, unresolved', 'bill the lower number; carry the gap as a named open item']].map(function (x) { return '<div class="ac-line"><span>' + esc(x[0]) + '</span><span>' + esc(x[1]) + '</span></div>'; }).join('') }) +
        c.card({ title: 'Billing period', body: c.stepper(['Open', 'Closing', 'Reconciled', 'Rated', 'Invoiced'], 0) + '<p class="ac-muted-note" style="margin-top:10px">Closing starts at period end and lasts up to 24 hours. Any M1–M4 above zero moves the period to Blocked, pages, and tells you the period is open and why.</p>' }) + '</div>'
      );
    }
  });
  E1.action('ac-recon', function (el) {
    el.disabled = true; E1.toast('Reconciling seq 4,042–4,112 against the meter and ERPNext…', 'info');
    setTimeout(function () { el.disabled = false; E1.toast('71 records ↔ 71 meter events; 38 ERPNext changes ↔ 38 committed records. M1–M5 all zero.', 'good', { title: 'Reconciled' }); }, 900);
  });

  /* ------------------------------------------------------------------------
     /assurance — overview: the questions an auditor asks
     ------------------------------------------------------------------------ */
  route('/assurance', {
    title: 'Overview', section: 'overview', keywords: 'assurance overview claim auditor chain coverage refusals meter',
    render: function (p, query) {
      var st = query.state, L = E1.state.level, lv = E1.LEVELS[L];
      var ct = refClassTotals();
      if (st === 'loading') return page(ph({ title: 'Assurance', lead: 'Reading the chain, the meter and the runtime…' }) + '<div class="ac-grid ac-grid--3">' + [1, 2, 3, 4, 5, 6].map(function () { return c.card({ body: c.skeleton({ kind: 'stat' }) }); }).join('') + '</div>');
      var claimsL1 = '<div class="ac-claims"><div><h3>' + c.icon('check', 14) + 'What you can claim today · ' + esc(L + ' ' + lv.name) + '</h3><ul>' +
        (L === 'L1' ? ['Our agents cannot write to our books without passing rules we set.', 'A person approves anything material, and the approval is its own record.', 'We have an unbroken internal record of every attempt, including the refusals.', 'The record is tamper-evident to us, the chain holder.'] : L === 'L2' ? ['A party with our key fingerprint, got out of band, can verify a bundle on an air-gapped machine with no elan1 process.', 'Records from the boundary onward carry a signature and an anchor time.'] : ['The format is published; a receipt stays checkable after elan1 is gone.'])
          .map(function (s) { return '<li>' + c.icon('check', 12) + '<span class="ac-say">' + esc(s) + '</span></li>'; }).join('') + '</ul>' + (L !== 'L1' ? '<p class="ac-muted-note" style="margin-top:10px">Preview: your tenant runs at L1. ' + c.button('Back to L1', { size: 'sm', kind: 'ghost', attrs: 'data-action="level" data-value="L1"' }) + '</p>' : '') + '</div>' +
        '<div><h3>' + c.icon('x', 14) + 'What you cannot claim yet</h3><ul>' +
        ['That someone who does not trust elan1 can check a record — at L1, verify requires us.', 'That records are signed or carry an anchor time. That arrives at Assurance Level 2.', 'That this satisfies the MCA audit-trail rule, or any regulator’s acceptance.', 'That the evidence covers all 23 write types — it covers 19.']
          .map(function (s) { return '<li>' + c.icon('minus', 12) + '<span>' + esc(s) + '</span></li>'; }).join('') + '</ul><p style="margin:12px 0 0">' + linkArrow('What each level lets you say', '#/assurance/level') + '</p></div></div>';
      var cards = [
        qcard({ q: 'Is the record complete and unbroken?', fresh: fresh('Checked', 2), body: '<div class="e1-row" style="gap:8px">' + tri('continuous', 'Continuous') + '<span class="e1-caption">three-valued · never a bare tick</span></div><a class="ac-big" href="#/assurance/chain">seq 1–' + num(HEAD) + '<small>' + num(HEAD) + ' entries</small></a><p class="e1-caption" style="margin:0">Over 19 of 23 write types. Full walk nightly at 02:10 IST; the head is re-walked every 5 minutes.</p>', foot: linkArrow('Chain standing', '#/assurance/chain') + linkArrow('Verify a range', '#/assurance/chain?tab=verify') }),
        qcard({ q: 'Which write types does the evidence cover?', fresh: freshAt('Computed', iso(24, '02:10')), body: '<a class="ac-big" href="#/assurance/coverage?view=live">19 of 23<small>write types with live evidence</small></a>' + c.progress(19, 23, {}) + '<p class="e1-caption" style="margin:0">Every reachable refusal path seen live for <a href="#/assurance/coverage?view=paths">3 of 23</a>. Four write types are modelled only.</p>', foot: linkArrow('Coverage', '#/assurance/coverage') }),
        qcard({ q: 'Was every write checked before it happened?', body: '<a class="ac-big" href="#/assurance/enforcement">23 of 23<small>write types Enforced</small></a><p class="ac-quote">“This write could not have occurred without passing the gates.”</p><p class="e1-caption" style="margin:0">MCP routes Enforced by token acceptance since 16 Sep 2026; before that, Attested advisory.</p>', foot: linkArrow('Enforcement by channel', '#/assurance/enforcement') }),
        qcard({ q: 'What did the system refuse — and did anyone pay for it?', fresh: fresh('Updated', 1), body: '<a class="ac-big" href="#/assurance/refusals">' + num(MT.refused) + ' · ₹0<small>refused, 1–24 Sep</small></a>' + c.meter([{ label: 'Gate', value: ct.gate }, { label: 'Policy', value: ct.policy }, { label: 'Our failures', value: ct.platform }], {}) , foot: linkArrow('Refusals', '#/assurance/refusals') + linkArrow('Register', '#/assurance/refusals/register') }),
        qcard({ q: 'Did a person approve what needed a person?', body: '<a class="ac-big" href="' + E1.href('/assurance/proof', { outcome: 'escalated' }) + '">' + num(MT.escalated) + '<small>writes waited on a person</small></a>' + '<div class="ac-line"><span>Approvals and rejections recorded as their own writes</span><span><a href="' + E1.href('/assurance/proof', { wt: 'platform.obligation.resolve' }) + '">318</a></span></div><div class="ac-line"><span>Proposer tried to approve their own write</span><span><a href="#/assurance/refusals/GATE.DUAL_CONTROL_SAME_ACTOR">12 refused</a></span></div><div class="ac-line"><span>Expired with nobody deciding</span><span><a href="#/assurance/refusals/POLICY.OBLIGATION_EXPIRED">9</a></span></div>', foot: linkArrow('Open approvals now: 14', '#/work/approvals') + linkArrow('Obligation history', '#/work/obligations') }),
        qcard({ q: 'Does every invoice line trace to a record?', fresh: freshAt('Reconciled', iso(24, '02:30')), body: '<a class="ac-big" href="#/assurance/meter">' + num(MT.committed) + '<small>billable governed actions</small></a><div class="ac-line"><span>Mismatches, both directions</span><span><a href="#/assurance/reconciliation">0</a></span></div><div class="ac-line"><span>Cost to date, ex-GST</span><span><a href="#/assurance/invoices/INV-KS-2026-09">' + esc(fmt.inr(ACCRUED)) + '</a></span></div>', foot: linkArrow('Meter', '#/assurance/meter') + linkArrow('Invoices', '#/assurance/invoices') }),
        qcard({ q: 'Is it running properly right now?', fresh: fresh('Probed', 1), body: '<div class="e1-row" style="gap:8px">' + c.badge('good', '8 components operational') + c.badge('info', '1 incident verifying', { subtle: true }) + '</div><p class="e1-caption" style="margin:0">ERPNext was unreachable 15:10–15:14 IST. One write was refused as our failure (' + seqLink(4102) + '); nothing was applied and it was not billed.</p>', foot: linkArrow('Runtime', '#/assurance/runtime') + linkArrow('INC-0421', '#/assurance/incidents/INC-0421') }),
        qcard({ q: 'Where does the data live?', body: '<a class="ac-big ac-big--sm" href="#/assurance/residency">India · Mumbai<small>ap-south-1, three zones</small></a><p class="e1-caption" style="margin:0">No second region, including for disaster recovery. Nothing elan1 records leaves India at Level 1.</p>', foot: linkArrow('Residency', '#/assurance/residency') + linkArrow('Security', '#/assurance/security') }),
        qcard({ q: 'Who has looked at it?', body: '<a class="ac-big" href="#/assurance/access">12<small>access events today</small></a><div class="ac-line"><span>Break-glass uses this period</span><span><a href="#/work/break-glass">0</a></span></div><div class="ac-line"><span>Sessions without MFA</span><span>0</span></div>', foot: linkArrow('Access log', '#/assurance/access') })
      ].join('');
      var feed = '<ul class="ac-feed">' + [
        ['refuse', 'Not done — the check on your live books disagreed', 'stock-agent tried to move 1,200 kg of cotton; Mill 2 held 1,180 kg. Snapshot restored.', '#/assurance/proof/4112', '15:28'],
        ['gate', 'Waiting on a person · OB-2026-0411', 'Supplier payment run, 14 suppliers, ₹18,42,760 — needs Ravi Shankar and Meenakshi Iyer.', '#/assurance/proof/4111', '15:27'],
        ['check', 'Committed after approval · ' + P(4101), 'SINV-2026-01187 to ACME Textiles, ₹2,40,000 — escalated ' + P(4099) + ', approved ' + P(4100) + ' by Venkat Raman.', '#/assurance/proof/4101', '15:02'],
        ['file-text', 'erp.ar v8 is waiting to be certified', 'If certified, it adds erp.sales_invoice.cancel as irreversible and changes what ar-agent and Collections Agent may propose. OB-2026-0424 waits on Arjun Mehta.', '#/records/declarations/erp.ar', '14:50'],
        ['chain', 'Chain checked overnight', 'Continuous · seq 1–4,041 · 19 of 23 write types. Chain-head receipt sent to Meenakshi Iyer at 02:15.', '#/assurance/chain', '02:10']
      ].map(function (x) { return '<li><span class="ac-feed__i">' + c.icon(x[0], 14) + '</span><div><a href="' + x[3] + '"><strong>' + esc(x[1]) + '</strong></a><p>' + esc(x[2]) + '</p></div><span class="e1-caption e1-mono">' + x[4] + '</span></li>'; }).join('') + '</ul>';
      return page(
        ph({ title: 'Assurance', lead: 'Can you show someone this was done properly? What you can claim today at ' + L + ' ' + lv.name + ', what you cannot yet, and the records behind every number.',
          actions: stateMenu('/assurance', [['Today', ''], ['Loading', 'loading'], ['Tenant stopped', 'stopped']]) + c.button('What each level lets you say', { href: '#/assurance/level', kind: 'ghost', icon: 'info' }) + c.button('Open the proof log', { href: '#/assurance/proof', kind: 'primary', icon: 'proof' }),
          meta: '<div class="ac-freshrow">' + c.level('L1') + '<span class="e1-caption">Kaveri Spinning Mills · production · in · Mumbai</span>' + fresh('Chain checked', 2) + freshAt('Reconciled', iso(24, '02:30')) + fresh('Meter updated', 0) + '</div>' }) +
        (st === 'stopped' ? '<div class="ac-banner" role="alert">' + c.icon('stop', 18) + '<div><strong>This workspace is stopped (suspected credential exposure) since 24 Sep 2026, 16:05 IST, by Meenakshi Iyer with Arjun Mehta.</strong><p>No writes, including refusals, are being recorded. Reads, verify and this door keep working. The stop itself is a governed write with its own record.</p><p style="margin-top:6px">' + c.button('View stop event', { href: '#/records/tenants/kaveri-spinning', size: 'sm' }) + '</p></div></div>' : '') +
        claimsL1 +
        '<div class="ac-honest" role="note">' + c.icon('info', 18) + '<div><span class="e1-label">Your level</span><p>This is Assurance Level 1. Level 2 adds signatures and offline verification; it arrives after the L2 gate (Phase 3), and records written before then stay Level 1.</p></div></div>' +
        c.section({ id: 'questions', title: 'The questions an auditor asks', lead: 'Every number opens the records behind it.', body: '<div class="ac-grid ac-grid--3">' + cards + '</div>' }) +
        '<div class="ac-grid ac-grid--2" style="align-items:start">' + c.card({ title: 'What changed recently', body: feed, footer: linkArrow('All proof entries', '#/assurance/proof') }) +
        '<div class="ac-page" style="gap:var(--space-4)">' + c.card({ title: 'Deprecation notices', body: c.empty({ compact: true, icon: 'check', title: 'None for this tenant', why: 'Your integration uses /v1, which is current. No Deprecation or Sunset header has been sent to you in the last 30 days.', action: { label: 'Versioning policy', href: '#/developers/versioning' } }) }) +
        c.locked({ level: 'L2', compact: true, items: ['A signature on every record from a named sequence number', 'An anchor time from two timestamp authorities', 'An evidence bundle a stranger checks offline, with a free verifier'] }) + '</div></div>'
      );
    }
  });
})();
