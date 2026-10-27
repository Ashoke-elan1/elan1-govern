/* ==========================================================================
   elan1 · RECORDS door — "What changed, and what may change?"
   Owner: records. Routes: /records/* (see ROUTES.md).
   Records never holds a second copy of host-system records: every object
   links out ("Open in ERPNext"). Pinned fields plus a governed timeline only.
   Sources: spec-phase1-console §1.3, §2.2, F6, F7, §4 · spec-tm §1.2–1.8, §6.2
   · spec-phase2-3-evidence §1.9–1.11, §2.3 · spec-phase4-group §1.4, R-03 · spec-atlas Fig 10.
   ========================================================================== */
(function () {
  'use strict';
  var E1 = window.E1, c = E1.c, esc = E1.esc, fmt = E1.fmt;

  /* ------------------------------------------------------------------------
     Local styles (tokens only; prefix rec-)
     ------------------------------------------------------------------------ */
  (function styles() {
    if (document.getElementById('rec-style')) return;
    var css = [
      '.rec-gbanner{display:flex;gap:12px;align-items:flex-start;padding:12px 16px;margin:0 0 20px;border:1px solid var(--state-serious-border);background:var(--state-serious-bg);border-radius:var(--radius-md);color:var(--text-primary)}',
      '.rec-gbanner__icon{color:var(--state-serious);flex:none;margin-top:2px}',
      '.rec-gbanner p{margin:0}.rec-gbanner__t{font-weight:var(--weight-semibold)}',
      '.rec-gbanner__a{margin-left:auto;flex:none}',
      '.rec-stack{display:flex;flex-direction:column;gap:var(--space-5)}',
      '.rec-stack--sm{gap:var(--space-3)}',
      '.rec-meta{display:flex;flex-wrap:wrap;gap:6px 16px;align-items:center;font-size:var(--text-caption);color:var(--text-secondary)}',
      '.rec-meta b{color:var(--text-primary);font-weight:var(--weight-medium)}',
      '.rec-muted{color:var(--text-secondary)}.rec-quiet{color:var(--text-tertiary)}',
      '.rec-mono{font-family:var(--font-mono);font-variant-numeric:tabular-nums}',
      '.rec-small{font-size:var(--text-caption);line-height:var(--lh-caption)}',
      '.rec-label{font-size:var(--text-label);letter-spacing:var(--tracking-label);text-transform:uppercase;color:var(--text-tertiary);font-weight:var(--weight-semibold)}',
      '.rec-chips{display:flex;flex-wrap:wrap;gap:6px;align-items:center}',
      '.rec-tag{display:inline-flex;align-items:center;gap:4px;padding:1px 7px;border:1px solid var(--border-default);border-radius:var(--radius-sm);font-size:var(--text-caption);line-height:18px;color:var(--text-secondary);background:var(--bg-surface);white-space:nowrap}',
      '.rec-tag--mono{font-family:var(--font-mono)}',
      '.rec-tag--lock{border-style:solid;color:var(--text-primary)}',
      '.rec-tag--off{border-style:dashed;color:var(--text-tertiary)}',
      '.rec-tag--accent{border-color:var(--border-accent);color:var(--text-accent)}',
      '.rec-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:var(--space-5)}',
      '.rec-split{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:var(--space-5);align-items:start}',
      '@media (max-width:1100px){.rec-split{grid-template-columns:minmax(0,1fr)}}',
      '@media (max-width:760px){.rec-two{grid-template-columns:minmax(0,1fr)}}',
      /* sentence */
      '.rec-sentence{font:var(--weight-regular) 17px/28px var(--font-display);color:var(--text-primary);margin:0;max-width:62em}',
      '.rec-sentence a{color:inherit;text-decoration:none;border-bottom:2px solid var(--border-accent);padding:0 1px}',
      '.rec-sentence a:hover{background:var(--bg-selected)}',
      '.rec-sentence .rec-q{color:var(--text-tertiary)}',
      '.rec-sentence small{display:inline;font:var(--weight-medium) var(--text-label)/1 var(--font-mono);color:var(--text-accent);vertical-align:super;margin-left:1px}',
      /* seven blocks */
      '.rec-block{border:1px solid var(--border-subtle);border-radius:var(--radius-md);box-shadow:var(--shadow-1);background:var(--bg-surface);overflow:hidden}',
      '.rec-block+.rec-block{margin-top:var(--space-4)}',
      '.rec-block__head{display:flex;gap:12px;align-items:center;padding:12px 16px;border-bottom:1px solid var(--border-subtle);background:var(--bg-sunken)}',
      '.rec-block__n{flex:none;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font:var(--weight-semibold) var(--text-caption)/1 var(--font-mono);border:1px solid var(--border-strong);color:var(--text-primary);background:var(--bg-surface)}',
      '.rec-block__t{font:var(--weight-title) 15px/20px var(--font-display);margin:0}',
      '.rec-block__s{font-size:var(--text-caption);color:var(--text-secondary);margin:0}',
      '.rec-block__body{padding:14px 16px}',
      '.rec-block__head .rec-block__x{margin-left:auto}',
      /* disposition */
      '.rec-disp{display:inline-flex;align-items:center;gap:6px;flex-wrap:wrap}',
      '.rec-disp--oos{color:var(--text-tertiary)}',
      '.rec-nm{display:block;border-left:2px solid var(--border-strong);padding:2px 0 2px 10px;font-size:var(--text-caption);color:var(--text-secondary)}',
      '.rec-nm b{color:var(--text-primary);font-weight:var(--weight-medium)}',
      /* studio */
      '.rec-studio{display:grid;grid-template-columns:210px minmax(0,1fr) 330px;gap:var(--space-4);align-items:start}',
      '@media (max-width:1280px){.rec-studio{grid-template-columns:200px minmax(0,1fr)}.rec-studio__side{grid-column:1 / -1}}',
      '@media (max-width:820px){.rec-studio{grid-template-columns:minmax(0,1fr)}}',
      '.rec-blocknav{list-style:none;margin:0;padding:6px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);position:sticky;top:12px}',
      '.rec-blocknav a{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:var(--radius-md);color:var(--text-primary);text-decoration:none;font-size:var(--text-body)}',
      '.rec-blocknav a:hover{background:var(--bg-hover)}',
      '.rec-blocknav a[aria-current="true"]{background:var(--bg-selected);box-shadow:inset 3px 0 0 var(--brand-clay)}',
      '.rec-blocknav .rec-bn__n{font:var(--weight-semibold) var(--text-label)/1 var(--font-mono);color:var(--text-tertiary);width:14px}',
      '.rec-blocknav .rec-bn__s{margin-left:auto;display:inline-flex;gap:4px;align-items:center;font-size:var(--text-label);font-weight:var(--weight-semibold)}',
      '.rec-bn__foot{border-top:1px solid var(--border-subtle);margin-top:6px;padding:10px 10px 4px;font-size:var(--text-caption);color:var(--text-secondary)}',
      '.rec-prop{display:grid;grid-template-columns:minmax(150px,210px) minmax(0,1fr);gap:8px 16px;padding:14px 0;border-top:1px solid var(--border-subtle)}',
      '.rec-prop:first-child{border-top:0;padding-top:4px}',
      '@media (max-width:760px){.rec-prop{grid-template-columns:minmax(0,1fr)}}',
      '.rec-prop__k{font:var(--weight-medium) var(--text-caption)/18px var(--font-mono);color:var(--text-primary);word-break:break-word}',
      '.rec-prop__h{display:block;font:var(--weight-regular) var(--text-caption)/var(--lh-caption) var(--font-ui);color:var(--text-secondary);margin-top:3px}',
      '.rec-prop__c{display:flex;flex-direction:column;gap:8px;min-width:0}',
      '.rec-prop__row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}',
      '.rec-prop__row>.e1-field{flex:1 1 200px;margin:0}',
      '.rec-inline-err{display:flex;gap:6px;align-items:flex-start;font-size:var(--text-caption);color:var(--state-critical);margin:0}',
      '.rec-inline-warn{display:flex;gap:6px;align-items:flex-start;font-size:var(--text-caption);color:var(--text-secondary);margin:0}',
      '.rec-inline-ok{display:flex;gap:6px;align-items:center;font-size:var(--text-caption);color:var(--state-good);margin:0}',
      '.rec-gatelist{list-style:none;margin:0;padding:0;counter-reset:g;display:flex;flex-direction:column;gap:6px}',
      '.rec-gatelist li{display:flex;align-items:center;gap:8px;padding:6px 8px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);font-size:var(--text-body)}',
      '.rec-gatelist .rec-gl__n{font:var(--weight-semibold) var(--text-label)/1 var(--font-mono);color:var(--text-tertiary);width:18px}',
      '.rec-gatelist .rec-gl__a{margin-left:auto;display:flex;gap:4px}',
      '.rec-wtpick{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 14px}',
      '.rec-preview{border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--bg-surface);box-shadow:var(--shadow-1);overflow:hidden;position:sticky;top:12px}',
      '.rec-preview__bar{display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--bg-sunken);border-bottom:1px solid var(--border-subtle);font-size:var(--text-caption);color:var(--text-secondary)}',
      '.rec-preview__body{padding:14px;display:flex;flex-direction:column;gap:12px}',
      '.rec-preview__title{font:var(--weight-title) 15px/20px var(--font-display);margin:0}',
      '.rec-preview ol{margin:0;padding-left:18px;font-size:var(--text-caption);color:var(--text-secondary)}',
      '.rec-preview ol li{padding:2px 0}',
      '.rec-sayline{font-size:var(--text-caption);color:var(--text-secondary);border-left:2px solid var(--border-accent);padding-left:8px;margin:0}',
      '.rec-lines{display:flex;flex-direction:column;gap:4px}',
      /* issues */
      '.rec-issues{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}',
      '.rec-issues li{display:grid;grid-template-columns:20px minmax(0,1fr) auto;gap:10px;padding:12px 0;border-top:1px solid var(--border-subtle);align-items:start}',
      '.rec-issues li:first-child{border-top:0}',
      '.rec-issues__rule{font:var(--weight-semibold) var(--text-caption)/var(--lh-caption) var(--font-mono);color:var(--text-primary)}',
      '.rec-issues__t{margin:2px 0 0;font-size:var(--text-body)}',
      '.rec-issues__where{margin:4px 0 0;font-size:var(--text-caption);color:var(--text-tertiary);font-family:var(--font-mono)}',
      /* sim */
      '.rec-sim__wt{border:1px solid var(--border-subtle);border-radius:var(--radius-md);box-shadow:var(--shadow-1);background:var(--bg-surface)}',
      '.rec-sim__wt+.rec-sim__wt{margin-top:var(--space-4)}',
      '.rec-sim__head{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;padding:12px 16px;border-bottom:1px solid var(--border-subtle)}',
      '.rec-sim__body{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:16px;padding:14px 16px}',
      '@media (max-width:900px){.rec-sim__body{grid-template-columns:minmax(0,1fr)}}',
      '.rec-sim__gate{display:grid;grid-template-columns:18px 22px minmax(0,1fr) auto;gap:8px;align-items:center;padding:5px 0;border-top:1px solid var(--border-subtle);font-size:var(--text-body)}',
      '.rec-sim__gate:first-child{border-top:0}',
      '.rec-sim__gate .rec-mono{font-size:var(--text-caption);color:var(--text-tertiary)}',
      /* roadmap tiles */
      '.rec-sysgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px}',
      '.rec-systile{display:flex;flex-direction:column;gap:6px;padding:14px;border:1px dashed var(--border-default);border-radius:var(--radius-md);text-decoration:none;color:var(--text-primary);background:var(--bg-canvas)}',
      '.rec-systile:hover{border-color:var(--border-strong);background:var(--bg-hover)}',
      '.rec-systile b{font:var(--weight-title) var(--text-body)/18px var(--font-display)}',
      '.rec-systile span{font-size:var(--text-caption);color:var(--text-secondary)}',
      '.rec-sysrow{display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap}',
      '.rec-sysmark{flex:none;width:44px;height:44px;border-radius:var(--radius-md);display:grid;place-items:center;border:1px solid var(--border-default);background:var(--bg-sunken);color:var(--text-primary)}',
      /* promise */
      '.rec-promise{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);border:1px solid var(--border-subtle);border-radius:var(--radius-md);box-shadow:var(--shadow-1);overflow:hidden;background:var(--bg-surface)}',
      '@media (max-width:860px){.rec-promise{grid-template-columns:minmax(0,1fr)}}',
      '.rec-promise>div{padding:16px 18px}',
      '.rec-promise>div+div{border-left:1px solid var(--border-subtle);background:var(--bg-sunken)}',
      '@media (max-width:860px){.rec-promise>div+div{border-left:0;border-top:1px solid var(--border-subtle)}}',
      '.rec-promise ol{margin:8px 0 0;padding-left:18px}.rec-promise li{margin:6px 0}',
      '.rec-promise p{margin:8px 0 0;font-size:var(--text-caption);line-height:18px;color:var(--text-secondary)}',
      /* five-link chain */
      '.rec-links{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:0;align-items:stretch}',
      '@media (max-width:900px){.rec-links{grid-template-columns:minmax(0,1fr)}}',
      '.rec-link{position:relative;padding:12px 14px;border:1px solid var(--border-default);background:var(--bg-surface);font-size:var(--text-caption)}',
      '.rec-link+.rec-link{border-left:0}',
      '@media (max-width:900px){.rec-link+.rec-link{border-left:1px solid var(--border-default);border-top:0}}',
      '.rec-link:first-child{border-radius:var(--radius-md) 0 0 var(--radius-md)}',
      '.rec-link:last-child{border-radius:0 var(--radius-md) var(--radius-md) 0}',
      '.rec-link b{display:block;font:var(--weight-semibold) var(--text-body)/18px var(--font-ui);color:var(--text-primary);margin:4px 0 2px}',
      '.rec-link code{font-size:var(--text-label)}',
      /* compare */
      '.rec-cls{display:inline-flex;align-items:center;gap:4px;font-size:var(--text-caption);font-weight:var(--weight-semibold)}',
      /* matrix */
      '.rec-matrix td{white-space:nowrap}',
      '.rec-cell-none{color:var(--text-tertiary);font-size:var(--text-caption)}',
      /* clock */
      '.rec-clock{display:flex;gap:16px;align-items:center;padding:14px 16px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);box-shadow:var(--shadow-1);background:var(--bg-surface)}',
      '.rec-clock__big{font:var(--weight-title) 20px/1 var(--font-mono)}',
      /* stat row */
      '.rec-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--stack-gap)}',
      '@media (max-width:1100px){.rec-stats{grid-template-columns:repeat(2,minmax(0,1fr))}}',
      '@media (max-width:480px){.rec-stats{grid-template-columns:minmax(0,1fr)}}',
      '.rec-table-note{font-size:var(--text-caption);color:var(--text-tertiary);margin:8px 0 0}',
      '.rec-kbdhint{font-size:var(--text-caption);color:var(--text-tertiary)}',
      '.rec-hr{border:0;border-top:1px solid var(--border-subtle);margin:var(--space-4) 0}',
      '.rec-empty-inline{padding:12px 0;font-size:var(--text-caption);color:var(--text-secondary)}',
      '.rec-steps{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}',
      '.rec-steps>li{border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);padding:14px 16px}',
      '.rec-steps>li.is-current{border-color:var(--border-accent);box-shadow:var(--shadow-1)}',
      '.rec-steps>li.is-todo{background:var(--bg-canvas)}',
      '.rec-step__h{display:flex;gap:10px;align-items:center;flex-wrap:wrap}',
      '.rec-step__h h3{margin:0;font:var(--weight-title) var(--text-body)/20px var(--font-display)}',
      '.rec-step__b{margin:8px 0 0 34px;font-size:var(--text-body);color:var(--text-secondary)}',
      '@media (max-width:600px){.rec-step__b{margin-left:0}}',
      '.rec-step__n{flex:none;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;border:1px solid var(--border-strong);font:var(--weight-semibold) var(--text-label)/1 var(--font-mono)}',
      '.rec-step__n.is-done{background:var(--state-good-bg);border-color:var(--state-good-border);color:var(--state-good)}',
      '.rec-step__n.is-blocked{background:var(--state-neutral-bg);color:var(--text-tertiary)}',
      '.rec-cmp td,.rec-cmp th{vertical-align:top}',
      '.rec-stack .e1-kv dd>.e1-actor,.rec-split .e1-kv dd>.e1-actor,.rec-stack .e1-table td .e1-actor{max-width:100%}'
    ].join('\n');
    var s = document.createElement('style');
    s.id = 'rec-style';
    s.textContent = css;
    document.head.appendChild(s);
  })();

  /* ------------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------------ */
  function hex(seed, len) {
    var h = 2166136261 >>> 0, out = '', s = String(seed);
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    while (out.length < len) { h ^= h << 13; h >>>= 0; h ^= h >>> 17; h ^= h << 5; h >>>= 0; out += ('00000000' + h.toString(16)).slice(-8); }
    return out.slice(0, len);
  }
  /** A 64-hex digest whose short form is head…tail, e.g. dg('7e41','d80f') → 7e41…d80f */
  function dg(head, tail) { return head + hex(head + tail, 64 - head.length - tail.length) + tail; }
  function iso(day, hm) { return '2026-09-' + (day < 10 ? '0' + day : day) + 'T' + hm + ':00+05:30'; }
  function num(n) { return fmt.num(n); }
  function seqTxt(n) { return '#' + fmt.num(n); }
  function seqLink(n, o) {
    o = o || {};
    return '<a class="rec-mono" href="#/assurance/proof/' + n + '"' + (o.label ? ' aria-label="' + esc(o.label) + '"' : '') + '>' + (o.prefix === false ? '' : 'proof ') + seqTxt(n) + '</a>';
  }
  function tag(label, mod, title) { return '<span class="rec-tag' + (mod ? ' rec-tag--' + mod.split(' ').join(' rec-tag--') : '') + '"' + (title ? ' title="' + esc(title) + '"' : '') + '>' + label + '</span>'; }
  function mono(s) { return '<span class="rec-mono">' + esc(s) + '</span>'; }
  function short(h) { return E1.fmt.shortHash(h, 4, 4); }
  function hashc(h, label) { return c.hash(h, { head: 4, tail: 4, label: label || 'Digest' }); }
  function kindWord(k) { return { person: 'Person', human: 'Person', agent: 'Agent', system: 'System', platform: 'System' }[k] || k; }
  function actorHref(name) {
    var a = findActor(name);
    return a ? '#/records/actors/' + a.id : null;
  }
  function personByName(n) { return (E1.data.people || []).filter(function (p) { return p.name === n; })[0]; }
  function stateMenu(path, list) {
    return c.menu({
      label: 'View states', icon: 'eye', align: 'right', size: 'sm',
      items: [{ label: 'Default', href: '#' + path, icon: 'check' }].concat(list.map(function (s) { return { label: s[1], href: '#' + path + '?state=' + s[0], icon: s[2] || 'eye' }; }))
    });
  }
  function hostBtn(label, path, o) {
    o = o || {};
    return c.button(label || 'Open in ERPNext', { kind: o.kind || 'secondary', size: o.size, icon: 'external', attrs: 'data-action="rec-host" data-url="' + esc('kaveri.rung1.in/app/' + path) + '"' });
  }
  function outcomeOf(o, code) { return c.outcome(o, { code: code }); }
  function stateForOutcome(o, code) {
    if (code && /^PLATFORM\./.test(code)) return 'critical';
    return { committed: 'good', refused: 'neutral', escalated: 'warning', expired: 'neutral', reversed: 'info', staged: 'info' }[o] || 'neutral';
  }
  function stopBanner() {
    var t = E1.tenant ? E1.tenant() : null;
    if (!t || t.status !== 'stopped' || !t.stop) return '';
    return '<div class="rec-gbanner" role="status"><span class="rec-gbanner__icon">' + c.icon('stop', 18) + '</span><div><p class="rec-gbanner__t">Tenant stopped</p><p>This workspace is stopped (' + esc(t.stop.reason.toLowerCase()) + ') since ' + esc(fmt.dateTime(t.stop.at)) + ', by ' + esc(t.stop.by[0]) + ' with ' + esc(t.stop.by[1]) + '. No writes, including refusals, are being recorded.</p></div>' +
      '<span class="rec-gbanner__a">' + c.button('View stop event', { size: 'sm', href: '#/records/tenants/' + t.id }) + '</span></div>';
  }
  function page(header, body) { return stopBanner() + header + '<div class="rec-stack">' + body + '</div>'; }
  /* v2: sibling screens of the same sidebar group as underline tabs in the page header (rung1 pane header) */
  function sibTabs(id) {
    var it = E1.navItem('records', id); if (!it || !it.group) return '';
    var list = E1.nav.records.items.filter(function (x) { return x.group === it.group; });
    return list.length > 1 ? c.tabs(list.map(function (x) { return { id: x.id, label: x.label, href: x.href, count: x.count }; }), id, { label: it.group }) : '';
  }
  function tabsAsFilters(items, active, label) {
    return c.filters(items.map(function (t) { return { label: t.label, href: t.href, count: t.count, active: t.id === active }; }), { label: label });
  }
  function errorState(what, reassurance) {
    return c.error({ title: 'We cannot show ' + what + ' right now.', body: 'The Records door could not reach the declaration registry. This is our failure, not a rule.', reassurance: reassurance || 'Nothing has been written, approved or refused in the meantime because of this screen. Governed writes keep climbing the rungs and keep being recorded.', code: 'PLATFORM.REGISTRY_UNAVAILABLE', action: { label: 'Try again', href: '#' + E1.state.route.path } });
  }
  function loadingState() { return '<div class="rec-stack">' + '<div class="rec-stats">' + [1, 2, 3, 4].map(function () { return c.skeleton({ kind: 'stat' }); }).join('') + '</div>' + c.skeleton({ kind: 'table', rows: 6 }) + '</div>'; }
  function tenantShort() { var t = E1.tenant(); return t ? t.name : 'this tenant'; }

  /* ------------------------------------------------------------------------
     Sample data — E1.data.records (canonical names from spec §4)
     ------------------------------------------------------------------------ */
  var GATES = {
    consent: { g: 'G1', name: 'Consent', never: true, asserts: 'a recorded, unexpired consent covering this purpose', codes: ['GATE.CONSENT_MISSING', 'GATE.CONSENT_EXPIRED'] },
    residency: { g: 'G2', name: 'Residency', never: true, asserts: 'the record’s residency domain matches the tenant’s', codes: ['GATE.RESIDENCY_MISMATCH'] },
    retention: { g: 'G3', name: 'Retention', never: true, asserts: 'the record is inside its declared retention window', codes: ['GATE.RETENTION_WINDOW_CLOSED'] },
    dual_control: { g: 'G4', name: 'Dual control', never: true, asserts: 'a second named actor has approved this write_id', codes: ['GATE.DUAL_CONTROL_PENDING', 'GATE.DUAL_CONTROL_SAME_ACTOR'] },
    rate: { g: 'G5', name: 'Rate', never: false, asserts: 'within the declared per-actor rate', codes: ['GATE.RATE_EXCEEDED'] },
    budget: { g: 'G6', name: 'Budget', never: false, asserts: 'within the declared per-period budget', codes: ['GATE.BUDGET_EXHAUSTED'] },
    counterparty: { g: 'G7', name: 'Counterparty', never: true, asserts: 'the counterparty is known and not sanctioned', codes: ['GATE.COUNTERPARTY_UNKNOWN', 'GATE.COUNTERPARTY_SANCTIONED'] },
    schedule: { g: 'G8', name: 'Schedule', never: false, asserts: 'inside a declared operating window', codes: ['GATE.OUTSIDE_SCHEDULE'] },
    precondition: { g: 'G9', name: 'Precondition', never: true, asserts: 'a declared record state holds', codes: ['GATE.PRECONDITION_FAILED'] }
  };
  var GATE_ORDER = ['consent', 'residency', 'retention', 'dual_control', 'rate', 'budget', 'counterparty', 'schedule', 'precondition'];
  var BASE5 = ['consent', 'residency', 'retention', 'counterparty', 'precondition'];
  var BASIS = { 1: 'per record', 2: 'per counterparty', 3: 'per batch', 4: 'per tenant', 5: 'per crossing' };
  var BLASTKEY = { 1: 'one_record', 2: 'one_counterparty', 3: 'batch', 4: 'tenant', 5: 'cross_boundary' };
  var CHANNELS = [
    { id: 'web', name: 'Web console', kind: 'web' }, { id: 'mobile', name: 'Mobile PWA', kind: 'mobile' },
    { id: 'messaging', name: 'WhatsApp', kind: 'messaging' }, { id: 'voice', name: 'rung1 Voice', kind: 'voice' },
    { id: 'api', name: 'rung1 SDK / API', kind: 'api' }, { id: 'mcp', name: 'MCP doorway', kind: 'mcp' }
  ];

  /* Write types (spec §4.4). rev: {m, h, after, note} or false (irreversible). cap = declared autonomy cap. */
  function W(name, label, decl, ver, blast, dual, rev, gates, ch, cap, intent, cov, extra) {
    return Object.assign({ name: name, label: label, decl: decl, ver: ver, blast: blast, dual: dual, rev: rev, gates: gates, ch: ch, cap: cap, intent: intent, cov: cov, mode: 'Enforced' }, extra || {});
  }
  var WT = [
    W('erp.sales_invoice.submit', 'Submit invoice', 'erp.ar', 7, 2, 'Above ₹2,00,000', { m: 'target_native_undo', h: 24, after: 'compensating_entry', note: 'Cancel the IRN within 24 h, then a credit note (compensating entry). Never a silent delete.' },
      ['consent', 'residency', 'retention', 'counterparty', 'precondition', 'dual_control', 'budget'], { web: 'submit · approve', mobile: 'approve', messaging: 'deep link only', api: 'submit', mcp: 'submit' }, 'A3',
      'Submit a tax invoice to one customer for goods already delivered, at the agreed price and terms.', { live: 1493, modelled: 412 }, { expiry: '4 h (declared)' }),
    W('erp.sales_invoice.cancel', 'Cancel invoice', 'sales_invoice', 4, 2, 'Always', false,
      ['consent', 'residency', 'retention', 'counterparty', 'precondition', 'dual_control'], { web: 'submit · approve', voice: 'approve', mobile: 'approve' }, 'A2',
      'Cancel a submitted tax invoice and its IRN inside the 24-hour e-invoice window, with the reason recorded.', { live: 41, modelled: 96 }, { note: 'Never auto-approved. API ✗: a compromised API key should never be able to wipe out invoices.' }),
    W('erp.payment_entry.submit', 'Record payment', 'erp.ar', 7, 2, 'No', { m: 'snapshot_restore', h: 720, after: 'compensating_entry' },
      BASE5.slice(), { web: 'submit · approve', api: 'submit' }, 'A4', 'Record a payment received from one counterparty against open invoices, matched to a bank line.', { live: 920, modelled: 140 }),
    W('erp.purchase_order.submit', 'Submit purchase order', 'erp.ap', 5, 2, 'Above ₹5,00,000', { m: 'target_native_undo', h: 720, after: 'compensating_entry' },
      ['consent', 'residency', 'retention', 'counterparty', 'precondition', 'dual_control', 'budget'], { web: 'submit · approve', api: 'submit' }, 'A3', 'Place a purchase order with one supplier for goods or services at the agreed rate and delivery date.', { live: 158, modelled: 60 }),
    W('erp.purchase_invoice.submit', 'Book supplier bill', 'erp.ap', 5, 2, 'Above ₹2,00,000', { m: 'compensating_entry', h: 720, after: 'compensating_entry', note: 'A debit note reverses a booked bill.' },
      ['consent', 'residency', 'retention', 'counterparty', 'precondition', 'dual_control'], { web: 'submit · approve', api: 'submit', mcp: 'submit' }, 'A3', 'Book a supplier bill once its purchase order and goods receipt note agree with it (PO and GRN cross-checked).', { live: 524, modelled: 88 }),
    W('erp.credit_note.submit', 'Raise credit note', 'erp.ar', 7, 2, 'Always', { m: 'compensating_entry', h: 720, after: 'not_reversible' },
      ['consent', 'residency', 'retention', 'counterparty', 'precondition', 'dual_control'], { web: 'submit · approve' }, 'A2', 'Raise a credit note to one customer that reduces what they owe against a named invoice.', { live: 37, modelled: 24 }),
    W('erp.credit_limit.change', 'Change credit limit', 'erp.ar', 7, 2, 'Always', { m: 'snapshot_restore', h: 720, after: 'compensating_entry' },
      ['consent', 'residency', 'retention', 'counterparty', 'precondition', 'dual_control'], { web: 'submit · approve' }, 'A2', 'Change the credit limit extended to one customer, with the old and new limits stated side by side.', { live: 12, modelled: 20 }),
    W('erp.customer.create', 'Add customer', 'erp.ar', 7, 1, 'No', { m: 'snapshot_restore', h: 720, after: 'compensating_entry' },
      BASE5.slice(), { web: 'submit · approve', api: 'submit' }, 'A3', 'Add a customer with a validated GSTIN so that invoices can be raised to them.', { live: 214, modelled: 30 }),
    W('erp.customer.update', 'Update customer terms', 'erp.ar', 7, 1, 'On GSTIN change', { m: 'target_native_undo', h: 720, after: 'compensating_entry' },
      ['consent', 'residency', 'retention', 'counterparty', 'precondition', 'dual_control'], { web: 'submit · approve', api: 'submit' }, 'A3', 'Update one customer’s credit terms or GSTIN; a GSTIN change always needs a second approver.', { live: 18, modelled: 12 }),
    W('erp.price_list.update', 'Update price list', 'erp.ar', 7, 3, 'Always', { m: 'snapshot_restore', h: 168, after: 'compensating_entry' },
      BASE5.concat(['dual_control', 'rate']), { web: 'submit · approve' }, 'A2', 'Change selling prices for a declared set of items on one price list from a stated date.', { live: 8, modelled: 16 }),
    W('erp.supplier.create', 'Add supplier', 'erp.ap', 5, 1, 'No', { m: 'snapshot_restore', h: 720, after: 'compensating_entry' },
      BASE5.slice(), { web: 'submit · approve', api: 'submit', mcp: 'submit' }, 'A3', 'Add a supplier with a validated GSTIN and bank account so bills and payments can be recorded.', { live: 38, modelled: 30 }),
    W('erp.payment_run.submit', 'Release supplier payment run', 'erp.ap', 5, 3, 'Always', false,
      BASE5.concat(['dual_control', 'budget', 'schedule']), { web: 'submit · approve', voice: 'approve' }, 'A2', 'Release a batch of supplier payments from the bank; money leaves the company and cannot be recalled.', { live: 6, modelled: 18 }, { note: 'Money leaves the bank. Never auto-approved.' }),
    W('erp.stock_entry.submit', 'Move stock', 'erp.stock', 3, 1, 'No', { m: 'target_native_undo', h: 720, after: 'compensating_entry' },
      BASE5.concat(['rate']), { web: 'submit · approve', mobile: 'approve', messaging: 'approve by reply', api: 'submit' }, 'A4', 'Move a stated quantity of one item between warehouses or into production.', { live: 744, modelled: 90 }, { note: 'whatsapp_approve: true — the one write type here that may be approved by reply.' }),
    W('erp.journal_entry.submit', 'Post journal entry', 'erp.gl', 2, 3, 'Above ₹1,00,000', { m: 'compensating_entry', h: 720, after: 'not_reversible' },
      BASE5.concat(['dual_control', 'budget', 'schedule']), { web: 'submit · approve' }, 'A2', 'Post a journal entry that moves amounts between ledger accounts inside an open accounting period.', { live: 96, modelled: 44 }),
    W('erp.period.close', 'Close accounting period', 'erp.gl', 2, 4, 'Yes (forced by radius)', { m: 'target_native_undo', h: 72, after: 'not_reversible', note: 'Reopen the period within 72 h.' },
      BASE5.concat(['dual_control']), { web: 'submit · approve' }, 'A1', 'Close an accounting period so that no further entries can be posted to it without reopening it.', { live: 0, modelled: 12 }),
    W('erp.gstr1.file', 'File GSTR-1', 'erp.gl', 2, 5, 'Yes (forced by radius)', false,
      BASE5.concat(['dual_control', 'schedule']), { web: 'submit · approve' }, 'A1', 'File the GSTR-1 return of outward supplies for one month with the GST portal.', { live: 0, modelled: 8 }, { note: 'Crosses an organisation boundary, so proof_binding must be non-empty.' }),
    W('platform.declaration.certify', 'Certify declaration version', 'platform', 3, 4, 'Always', false,
      ['residency', 'retention', 'precondition', 'dual_control'], { web: 'submit · approve' }, 'A0', 'Certify one version of a declaration so that it becomes resolvable; versions are kept verbatim for ever.', { live: 9, modelled: 14 }),
    W('platform.tenant.stop', 'Stop tenant', 'platform', 3, 4, 'Always', { m: 'target_native_undo', h: 0, after: 'not_reversible', note: 'Lifted by a second governed write (lift stop), also under dual control.' },
      ['residency', 'precondition', 'dual_control'], { web: 'submit · approve' }, 'A0', 'Stop every write for one tenant, including refusals, until the stop is lifted under dual control.', { live: 0, modelled: 6 }),
    W('platform.autonomy.grant', 'Change autonomy grant', 'platform', 3, 1, 'Always', { m: 'snapshot_restore', h: 720, after: 'compensating_entry' },
      ['residency', 'retention', 'precondition', 'dual_control'], { web: 'submit · approve' }, 'A0', 'Change the autonomy grant an agent holds for one write type; there is no API that sets it directly.', { live: 14, modelled: 10 }),
    W('platform.obligation.resolve', 'Approve or reject', 'platform', 3, 1, 'G4 by definition', { m: 'none', h: 0, after: 'not_reversible', note: 'A resolution is not reversed; a new write is proposed instead.' },
      ['residency', 'precondition', 'dual_control'], { web: 'approve', mobile: 'approve', messaging: 'approve by reply', voice: 'approve' }, 'A0', 'Approve or reject one obligation; an approval is itself a governed write, not a flag.', { live: 330, modelled: 40 }),
    W('platform.breakglass', 'Break-glass', 'platform', 3, 4, 'Always', { m: 'none', h: 0, after: 'not_reversible', note: 'Time-boxed; recorded in the operator chain and visible to the tenant.' },
      ['residency', 'retention', 'precondition', 'dual_control'], { web: 'submit · approve' }, 'A0', 'Open a time-boxed emergency access path, recorded in the operator chain and visible to the tenant.', { live: 0, modelled: 2 }),
    W('platform.erasure.execute', 'Execute erasure plan', 'platform', 3, 2, 'Always', false,
      ['consent', 'residency', 'retention', 'precondition', 'dual_control'], { web: 'submit · approve' }, 'A0', 'Destroy the per-record salts and derived copies named in an approved erasure plan for one data principal.', { live: 1, modelled: 6 }),
    W('platform.delegation.grant', 'Grant delegation', 'platform', 3, 1, 'Always', { m: 'snapshot_restore', h: 720, after: 'compensating_entry' },
      ['residency', 'precondition', 'dual_control'], { web: 'submit · approve' }, 'A0', 'Let one named person act on behalf of another for declared write types inside a stated window.', { live: 11, modelled: 8 })
  ];
  var WTX = {}; WT.forEach(function (w) { WTX[w.name] = w; });
  function wt(name) {
    if (WTX[name]) return WTX[name];
    var bare = String(name || '').replace(/^erp\./, '');
    if (WTX['erp.' + bare]) return WTX['erp.' + bare];
    return null;
  }
  function wtLabel(name) { var w = wt(name); return w ? w.label : name; }

  /* Proof entries (spec §4.6), Kaveri Spinning Mills chain, 24 Sep 2026. */
  function P(seq, hm, w, actor, kind, level, outcome, code, note, object, meter, day) {
    return { seq: seq, at: iso(day || 24, hm), wt: w, actor: actor, kind: kind, level: level, outcome: outcome, code: code, note: note, object: object, meter: meter };
  }
  var PROOF = [
    P(4090, '10:02', 'erp.supplier.create', 'Priya Nair', 'person', 'A3', 'committed', null, 'Coimbatore Castings Pvt Ltd (33AAECC9120B1Z4)', 'supp-coimbatore-castings', '1 per record'),
    P(4091, '10:19', 'erp.purchase_invoice.submit', 'ap-agent', 'agent', 'A3', 'committed', null, 'ACC-PINV-2026-00541 · ₹1,86,440', 'ACC-PINV-2026-00541', '1 per counterparty'),
    P(4092, '10:44', 'erp.sales_invoice.submit', 'Invoice Agent', 'agent', 'A1', 'refused', 'GATE.COUNTERPARTY_UNKNOWN', 'Shree Ganesh Handlooms is not a registered customer with a validated GSTIN.', 'cust-shree-ganesh-handlooms', '0'),
    P(4093, '11:03', 'erp.purchase_order.submit', 'ap-agent', 'agent', 'A2', 'escalated', null, 'OB-2026-0409 · dual control above ₹5 lakh', 'PO-2026-00318', '0'),
    P(4094, '11:21', 'platform.obligation.resolve', 'Venkat Raman', 'person', 'A4', 'committed', null, 'Approved · resolves OB-2026-0409', 'PO-2026-00318', '1 per record'),
    P(4095, '11:21', 'erp.purchase_order.submit', 'ap-agent', 'agent', 'A2', 'committed', null, 'Resubmission with obligation_ref OB-2026-0409 · ₹6,20,000', 'PO-2026-00318', '1 per counterparty'),
    P(4096, '11:40', 'platform.obligation.resolve', 'Ravi Shankar', 'person', 'A4', 'refused', 'GATE.DUAL_CONTROL_SAME_ACTOR', 'Ravi proposed CN-2026-00077 himself, so he cannot also approve it.', 'CN-2026-00077', '0'),
    P(4097, '11:42', 'erp.payment_entry.submit', 'Rekha Subramanian', 'person', 'A4', 'committed', null, 'ACME Textiles · ₹1,12,500 · undo until 24 Oct 2026, 11:42', 'PE-2026-00972', '1 per counterparty'),
    P(4098, '14:07', 'erp.sales_invoice.submit', 'ar-agent', 'agent', 'A3', 'refused', 'GATE.PRECONDITION_FAILED', 'Not done — credit limit. Limit ₹3,00,000 · exposure after this invoice ₹4,20,000.', 'SINV-2026-01187', '0'),
    P(4099, '14:16', 'erp.sales_invoice.submit', 'ar-agent', 'agent', 'A2', 'escalated', null, 'Reduced to ₹2,40,000 · OB-2026-0412 waiting on ar-approvers', 'SINV-2026-01187', '0'),
    P(4100, '15:02', 'platform.obligation.resolve', 'Venkat Raman', 'person', 'A4', 'committed', null, 'Approved · resolves OB-2026-0412', 'SINV-2026-01187', '1 per record'),
    P(4101, '15:02', 'erp.sales_invoice.submit', 'ar-agent', 'agent', 'A2', 'committed', null, 'IRN requested · undo until 25 Sep 15:02 (IRN), 24 Oct (credit note)', 'SINV-2026-01187', '1 per counterparty'),
    P(4102, '15:10', 'erp.payment_entry.submit', 'bank-recon-agent', 'agent', 'A3', 'refused', 'PLATFORM.TARGET_UNREACHABLE', 'Our failure — ERPNext did not answer. Nothing was applied; paged.', 'UTR-426817', '0 (not billable)'),
    P(4103, '15:12', 'erp.sales_invoice.cancel', 'Collections Agent', 'agent', 'A2', 'escalated', null, 'OB-2026-0413 · irreversible, dual control', 'INV-2026-0834', '0'),
    P(4104, '15:19', 'platform.obligation.resolve', 'Ravi Shankar', 'person', 'A4', 'committed', null, 'Approved by voice · recording ref VR-2026-09-24-0192', 'INV-2026-0834', '1 per record'),
    P(4105, '15:19', 'erp.sales_invoice.cancel', 'Collections Agent', 'agent', 'A2', 'committed', null, 'Invoice and IRN cancelled · irreversible', 'INV-2026-0834', '1 per counterparty'),
    P(4106, '15:21', 'erp.supplier.create', 'vendor-onboarding agent', 'agent', 'A0', 'refused', 'POLICY.AUTONOMY_INSUFFICIENT', 'A0 Observe (no grant). Add supplier needs A2 Propose.', 'supp-palani-dyes', '0'),
    P(4107, '15:22', 'erp.credit_limit.change', 'Rekha Subramanian', 'person', 'A2', 'escalated', null, '₹3,00,000 → ₹5,00,000 · OB-2026-0414', 'cust-acme-textiles', '0'),
    P(4108, '15:24', 'erp.sales_invoice.submit', 'rung1 drafting agent', 'agent', 'A2', 'refused', 'GATE.BUDGET_EXHAUSTED', '250 of 250 drafts declared for September used.', 'cust-lakshmi-garments', '0'),
    P(4109, '15:25', 'platform.obligation.resolve', 'Venkat Raman', 'person', 'A4', 'committed', null, 'Rejected OB-2026-0410: “Margin on 40s combed falls below 6%; recheck with sales before changing.”', 'PL-YARN-40S', '1 per record'),
    P(4110, '15:26', 'erp.journal_entry.submit', 'close-agent', 'agent', 'A1', 'refused', 'POLICY.OBLIGATION_EXPIRED', 'OB-2026-0405 lapsed unresolved; expiry is itself a recorded governed event.', 'JV-2026-00912', '0'),
    P(4111, '15:27', 'erp.payment_run.submit', 'ap-agent', 'agent', 'A2', 'escalated', null, '14 suppliers · ₹18,42,760 · OB-2026-0411', 'PAYRUN-2026-0924', '0'),
    P(4112, '15:28', 'erp.stock_entry.submit', 'stock-agent', 'agent', 'A4', 'refused', 'GATE.SANDBOX_DIVERGED', 'Live re-run disagreed with the shadow sandbox (bin quantity changed). Snapshot restored.', 'STE-2026-02214', '0')
  ];
  /* Older entries, for longer object timelines. */
  var OLDER = [
    P(3412, '12:40', 'erp.sales_invoice.submit', 'Invoice Agent', 'agent', 'A1', 'committed', null, 'Submitted by Priya Nair from the Invoice Agent’s draft · ₹2,00,000', 'INV-2026-0834', '1 per counterparty', 2),
    P(2118, '10:05', 'erp.customer.create', 'Priya Nair', 'person', 'A3', 'committed', null, 'ACME Textiles · GSTIN 33AAGCA1182D1ZK validated', 'cust-acme-textiles', '1 per record', 1),
    P(3960, '16:12', 'erp.credit_limit.change', 'Rekha Subramanian', 'person', 'A2', 'committed', null, '₹2,00,000 → ₹3,00,000 · approved by Venkat Raman (#3,959)', 'cust-acme-textiles', '1 per counterparty', 20),
    P(3102, '11:30', 'erp.purchase_order.submit', 'ap-agent', 'agent', 'A2', 'committed', null, 'PO-2026-00291 · ₹3,40,000', 'supp-coimbatore-castings', '1 per counterparty', 8),
    P(4061, '23:40', 'erp.journal_entry.submit', 'Priya Nair', 'person', 'A4', 'committed', null, 'Depreciation, August — drafted by close-agent, submitted by Priya Nair', 'JV-2026-00905', '1 per batch', 23),
    P(4064, '23:52', 'erp.journal_entry.submit', 'close-agent', 'agent', 'A1', 'escalated', null, 'Freight provision — OB-2026-0405 raised, expires in 4 h', 'JV-2026-00912', '0', 23)
  ];
  var ALLP = PROOF.concat(OLDER);
  function proofFor(objId) { return ALLP.filter(function (p) { return p.object === objId; }).sort(function (a, b) { return b.seq - a.seq; }); }

  /* Agents (spec §4.3) */
  var AGENTS = [
    { id: 'ar-agent', name: 'ar-agent', owner: 'Venkat Raman', model: 'claude-sonnet (via rung1)', channel: 'SDK', mode: 'Enforced', grants: [['erp.sales_invoice.submit', 'A2']], tools: ['read.records', 'stage.write', 'act.write'] },
    { id: 'rung1-drafting-agent', name: 'rung1 drafting agent', owner: 'Venkat Raman', model: 'claude-haiku', channel: 'SDK', mode: 'Enforced', grants: [['erp.sales_invoice.submit', 'A2']], tools: ['read.records', 'stage.write', 'act.write'] },
    { id: 'invoice-agent', name: 'Invoice Agent', owner: 'Rekha Subramanian', model: 'claude-sonnet', channel: 'Agent', mode: 'Enforced', grants: [['erp.sales_invoice.submit', 'A1'], ['erp.price_list.update', 'A2']], tools: ['read.records', 'read.declaration', 'stage.write', 'act.write'] },
    { id: 'collections-agent', name: 'Collections Agent', owner: 'Ravi Shankar', model: 'claude-sonnet', channel: 'Agent', mode: 'Enforced', grants: [['erp.sales_invoice.cancel', 'A2']], tools: ['read.records', 'read.evidence', 'stage.write', 'act.write', 'act.escalate'] },
    { id: 'ap-agent', name: 'ap-agent', owner: 'Ravi Shankar', model: 'gpt-4.1-mini', channel: 'SDK', mode: 'Enforced', grants: [['erp.purchase_invoice.submit', 'A3'], ['erp.purchase_order.submit', 'A2'], ['erp.payment_run.submit', 'A2']], tools: ['read.records', 'read.declaration', 'read.meter', 'stage.write', 'act.write', 'act.escalate'] },
    { id: 'bank-recon-agent', name: 'bank-recon-agent', owner: 'Rekha Subramanian', model: 'llama-3.1-70b (stack1 gateway)', channel: 'SDK', mode: 'Enforced', grants: [['erp.payment_entry.submit', 'A3']], tools: ['read.records', 'stage.write', 'act.write', 'act.escalate'] },
    { id: 'stock-agent', name: 'stock-agent', owner: 'Priya Nair', model: 'claude-haiku', channel: 'SDK', mode: 'Enforced', grants: [['erp.stock_entry.submit', 'A4']], tools: ['read.records', 'stage.write', 'act.write'] },
    { id: 'gst-agent', name: 'gst-agent', owner: 'Venkat Raman', model: 'sarvam-m', channel: 'SDK', mode: 'Enforced', grants: [['erp.gstr1.file', 'A1']], tools: ['read.records', 'stage.write'] },
    { id: 'close-agent', name: 'close-agent', owner: 'Meenakshi Iyer', model: 'claude-sonnet', channel: 'SDK', mode: 'Enforced', grants: [['erp.period.close', 'A1'], ['erp.journal_entry.submit', 'A1']], tools: ['read.records', 'read.meter', 'stage.write'] },
    { id: 'vendor-onboarding-agent', name: 'vendor-onboarding agent', owner: 'Priya Nair', model: 'gpt-4.1-mini', channel: 'MCP', mode: 'Enforced', grants: [['erp.supplier.create', null]], tools: ['read.records', 'stage.write'] }
  ];
  var SYSTEMS_ACTORS = [
    { id: 'nightly-verifier', name: 'nightly-verifier', role: 'System job · chain integrity run, nightly 02:10 IST', kind: 'system', note: 'Walks seq and prev_digest for every tenant’s chain. Never approves; never writes to a host.' },
    { id: 'single-writer', name: 'single-writer (erpnext-kaveri)', role: 'Kernel single writer · rung 7', kind: 'system', note: 'Holds the only credential to kaveri.rung1.in. Mints one single-use credential with a 10-minute life per write.' }
  ];
  var DELEGATIONS = [
    { id: 'D-2026-014', from: 'Venkat Raman', to: 'Ravi Shankar', wts: ['platform.obligation.resolve · ar-approvers'], from_at: '2026-09-26', until: '2026-10-03', seq: 4071, status: 'Scheduled', reason: 'Venkat is on leave 26 Sep–3 Oct; Ravi resolves ar-approvers obligations on his behalf.' },
    { id: 'D-2026-011', from: 'Meenakshi Iyer', to: 'Venkat Raman', wts: ['erp.credit_limit.change'], from_at: '2026-09-01', until: '2026-09-30', seq: 2811, status: 'Active', reason: 'Venkat approves credit-limit changes up to ₹10,00,000 on the owner’s behalf this quarter-end.' },
    { id: 'D-2026-009', from: 'Ravi Shankar', to: 'Priya Nair', wts: ['erp.journal_entry.submit'], from_at: '2026-08-15', until: '2026-09-15', seq: 2366, status: 'Lapsed', reason: 'Month-end journals while Ravi was travelling. Lapsed 15 Sep; a write on it now refuses with POLICY.DELEGATION_INVALID.' }
  ];
  function findActor(name) {
    var p = personByName(name); if (p) return { id: p.id, name: p.name, kind: p.kind === 'system' ? 'system' : 'person', role: p.role };
    var a = AGENTS.filter(function (x) { return x.name === name || x.id === name; })[0]; if (a) return { id: a.id, name: a.name, kind: 'agent', role: 'Agent · owner ' + a.owner };
    var s = SYSTEMS_ACTORS.filter(function (x) { return x.name === name || x.id === name; })[0]; if (s) return s;
    return null;
  }

  /* Declarations (spec §4.10). status: certified | in_validation | draft */
  var DECLS = [
    { id: 'erp.ar', slug: 'erp_ar', name: 'rung1 — Accounts receivable (ERPNext)', owner: 'Accounts head', sor: 'erpnext', residency: 'in', current: 7, draft: 8, status: 'certified', lexicon: 'rung1/erpnext/gst/2026-09', policy: 11, recordType: 'Sales Invoice',
      description: 'Changes to what customers owe Kaveri Spinning Mills: invoices, credit notes, credit limits, customers and receipts.',
      versions: [
        { v: 1, by: 'Arjun Mehta', at: '2026-08-12', digest: dg('a01c', '3e77'), seq: 1422, sup: null, change: 'First version: erp.sales_invoice.submit and erp.customer.create.' },
        { v: 2, by: 'Arjun Mehta', at: '2026-08-18', digest: dg('b7d2', '0c19'), seq: 1788, sup: 1, change: 'Added erp.payment_entry.submit (receipts matched to a bank line).' },
        { v: 3, by: 'Arjun Mehta', at: '2026-08-22', digest: dg('1f9a', 'a442'), seq: 2003, sup: 2, change: 'Added erp.credit_limit.change with dual control.' },
        { v: 4, by: 'Arjun Mehta', at: '2026-08-28', digest: dg('6e04', 'b2d1'), seq: 2471, sup: 3, change: 'Added erp.price_list.update (batch, rate gate on).' },
        { v: 5, by: 'Arjun Mehta', at: '2026-09-04', digest: dg('55d0', '19ea'), seq: 2904, sup: 4, change: 'Added erp.credit_note.submit; raised the dual-control threshold to ₹2,00,000 (loosening, ADR-0127).' },
        { v: 6, by: 'Arjun Mehta', at: '2026-09-11', digest: dg('0a7f', 'c6b3'), seq: 3377, sup: 5, change: 'Tightened precondition: no duplicate invoice number.' },
        { v: 7, by: 'Arjun Mehta', at: '2026-09-19', digest: dg('7e41', 'd80f'), seq: 3862, sup: 6, change: 'ar-agent act.write description hash changed (d41c…07aa → 9e02…b3f1).' },
        { v: 8, by: null, at: null, digest: null, seq: null, sup: 7, change: 'Adds erp.sales_invoice.cancel (irreversible); awaiting certification OB-2026-0424.', draft: true }
      ] },
    { id: 'sales_invoice', slug: 'sales_invoice', name: 'rung1 — Sales invoicing (ERPNext)', owner: 'Accounts head', sor: 'erpnext', residency: 'in', current: 4, status: 'certified', lexicon: 'rung1/erpnext/gst/2026-09', policy: 11, recordType: 'Sales Invoice',
      description: 'The rung1 drafting and cancellation path for sales invoices, including the 24-hour IRN window.',
      versions: [
        { v: 3, by: 'Arjun Mehta', at: '2026-09-02', digest: dg('9b11', '2f60'), seq: 2771, sup: 2, change: 'Budget gate: 250 drafts per agent per month.' },
        { v: 4, by: 'Arjun Mehta', at: '2026-09-18', digest: dg('3b9e', 'c41d'), seq: 3790, sup: 3, change: 'Dual control above ₹2 lakh; cancel declared irreversible.' }
      ] },
    { id: 'erp.ap', slug: 'erp_ap', name: 'rung1 — Accounts payable (ERPNext)', owner: 'Finance manager', sor: 'erpnext', residency: 'in', current: 5, status: 'certified', lexicon: 'rung1/erpnext/gst/2026-09', policy: 8, recordType: 'Purchase Invoice',
      description: 'Changes to what Kaveri Spinning Mills owes suppliers: orders, bills, suppliers and payment runs.',
      versions: [
        { v: 4, by: 'Arjun Mehta', at: '2026-09-09', digest: dg('41e7', '9d02'), seq: 3208, sup: 3, change: 'Payment run declared irreversible, schedule gate on (banking hours).' },
        { v: 5, by: 'Arjun Mehta', at: '2026-09-17', digest: dg('92cc', '4e10'), seq: 3720, sup: 4, change: 'PO and GRN cross-check added to the supplier-bill precondition.' }
      ] },
    { id: 'erp.stock', slug: 'erp_stock', name: 'rung1 — Stock movements (ERPNext)', owner: 'Stores head', sor: 'erpnext', residency: 'in', current: 3, status: 'certified', lexicon: 'rung1/erpnext/gst/2026-09', policy: 4, recordType: 'Stock Entry',
      description: 'Movements of yarn, cotton and consumables between the mills’ warehouses and into production.',
      versions: [
        { v: 2, by: 'Arjun Mehta', at: '2026-08-30', digest: dg('77b0', '1ac8'), seq: 2560, sup: 1, change: 'Rate gate: 40 moves per agent per hour.' },
        { v: 3, by: 'Arjun Mehta', at: '2026-09-12', digest: dg('c3a8', '77f2'), seq: 3420, sup: 2, change: 'whatsapp_approve on stock_entry (one record, reversible).' }
      ] },
    { id: 'erp.gl', slug: 'erp_gl', name: 'rung1 — Ledger, close and GST filing (ERPNext)', owner: 'Finance manager', sor: 'erpnext', residency: 'in', current: 2, status: 'certified', lexicon: 'rung1/erpnext/gst/2026-09', policy: 5, recordType: 'Journal Entry',
      description: 'Journal entries, period close and the monthly GSTR-1 filing that leaves the organisation.',
      versions: [
        { v: 1, by: 'Arjun Mehta', at: '2026-09-03', digest: dg('2a6f', 'e310'), seq: 2840, sup: null, change: 'First version: journal entries and period close.' },
        { v: 2, by: 'Arjun Mehta', at: '2026-09-15', digest: dg('6c2d', '0b91'), seq: 3611, sup: 1, change: 'Added erp.gstr1.file (crosses an organisation boundary; proof_binding non-empty).' }
      ] },
    { id: 'platform', slug: 'platform', name: 'elan1 Platform', owner: 'elan1 lead', sor: 'elan1', residency: 'in', current: 3, status: 'certified', lexicon: 'elan1/platform/2026-09', policy: 3, recordType: 'Platform object',
      description: 'The platform’s own governed writes: certification, stop, autonomy, approvals, delegation, erasure and break-glass.',
      versions: [
        { v: 2, by: 'Kavya Menon', at: '2026-09-06', digest: dg('0e5a', '8c31'), seq: 3005, sup: 1, change: 'Erasure and delegation declared as governed writes.' },
        { v: 3, by: 'Kavya Menon', at: '2026-09-20', digest: dg('1f06', 'ab54'), seq: 3904, sup: 2, change: 'Break-glass declared (there is no admin mode).' }
      ] },
    { id: 'erp.assets', slug: 'erp_assets', name: 'rung1 — Fixed assets (ERPNext)', owner: 'Finance manager', sor: 'erpnext', residency: 'in', current: null, draft: 1, status: 'draft', lexicon: 'rung1/erpnext/gst/2026-09', policy: null, recordType: 'Asset',
      description: 'Capitalising, depreciating and disposing of the mills’ plant and machinery.',
      versions: [{ v: 1, by: null, at: null, digest: null, seq: null, sup: null, change: 'Draft: erp.asset.capitalise and erp.asset.dispose.', draft: true }] }
  ];
  var DX = {}; DECLS.forEach(function (d) { DX[d.id] = d; });
  function declWts(id) { return WT.filter(function (w) { return w.decl === id; }); }

  /* erp.ar v7: the seven blocks (for detail, version view and Studio seed). */
  var AR_SHAPE = [
    { f: 'customer', type: 'reference', card: 'one', req: true, cls: 'internal', ref: 'Customer', bound: true },
    { f: 'customer_gstin', type: 'string', card: 'one', req: true, cls: 'personal', bound: false, adr: 'ADR-0131' },
    { f: 'posting_date', type: 'date', card: 'one', req: true, cls: 'internal', bound: true },
    { f: 'grand_total', type: 'decimal', card: 'one', req: true, cls: 'financial', bound: true },
    { f: 'outstanding_amount', type: 'decimal', card: 'one', req: true, cls: 'financial', bound: true },
    { f: 'credit_limit', type: 'decimal', card: 'one', req: true, cls: 'financial', ref: 'Customer.credit_limit', bound: true },
    { f: 'credit_exposure', type: 'decimal', card: 'one', req: false, cls: 'financial', bound: false, adr: 'ADR-0133' },
    { f: 'items[].item_code', type: 'string', card: 'many', req: true, cls: 'internal', bound: true },
    { f: 'items[].qty', type: 'decimal', card: 'many', req: true, cls: 'financial', bound: true },
    { f: 'items[].rate', type: 'decimal', card: 'many', req: true, cls: 'financial', bound: true },
    { f: 'irn', type: 'string', card: 'one', req: false, cls: 'internal', bound: false },
    { f: 'status', type: 'enum', card: 'one', req: true, cls: 'internal', bound: false }
  ];
  var AR_LINKS = [['customer', 'Customer', 'one'], ['payments', 'Payment Entry', 'many'], ['returns', 'Sales Invoice (is_return)', 'many']];
  var AR_GRANTS = [
    { kind: 'agent', role: 'ar-agent', wt: 'erp.sales_invoice.submit', min: 'A2', approve: false },
    { kind: 'agent', role: 'rung1 drafting agent', wt: 'erp.sales_invoice.submit', min: 'A1', approve: false },
    { kind: 'agent', role: 'Invoice Agent', wt: 'erp.price_list.update', min: 'A2', approve: false },
    { kind: 'agent', role: 'bank-recon-agent', wt: 'erp.payment_entry.submit', min: 'A3', approve: false },
    { kind: 'human', role: 'Accounts executive', wt: 'erp.sales_invoice.submit · erp.payment_entry.submit · erp.credit_limit.change', min: 'A4', approve: false },
    { kind: 'human', role: 'ar-approvers (Accounts head)', wt: 'erp.sales_invoice.submit · erp.credit_note.submit · erp.credit_limit.change · erp.price_list.update', min: 'A4', approve: true },
    { kind: 'human', role: 'Finance manager', wt: 'erp.credit_note.submit · erp.customer.update', min: 'A4', approve: true },
    { kind: 'human', role: 'Owner', wt: 'every write type in this declaration', min: 'A4', approve: true }
  ];
  var AR_GATES = {
    consent: { on: true, params: 'purpose = invoicing · WhatsApp opt-out honoured', asof: 'posting_date' },
    residency: { on: true, params: 'residency_domain = in', asof: 'recorded_at' },
    retention: { on: true, params: { nm: true, reason: 'Retention for AR records depends on counsel’s reading of s.128(5) against GST record rules.', wci: 'Counsel confirms eight financial years from the end of the year of entry.' }, asof: 'posting_date' },
    dual_control: { on: true, params: 'grand_total > 200000 · always for credit notes, credit limits, price lists', asof: 'recorded_at' },
    rate: { on: true, params: '60 writes per actor per minute', asof: 'recorded_at' },
    budget: { on: true, params: '400 invoices per agent per month', asof: 'posting_date' },
    counterparty: { on: true, params: 'registered customer · GSTIN validated · not sanctioned', asof: 'posting_date' },
    schedule: { on: false, params: 'no operating window', adr: 'ADR-0119', asof: '—' },
    precondition: { on: true, params: 'credit_exposure + grand_total ≤ credit_limit · no duplicate invoice number · period not closed', asof: 'posting_date' }
  };
  var AR_CHANNELS = [
    { name: 'Web console', kind: 'web', wts: 'all 7', approve: true, mode: 'enforced' },
    { name: 'Mobile PWA', kind: 'mobile', wts: 'approve only', approve: true, mode: 'enforced' },
    { name: 'WhatsApp', kind: 'messaging', wts: 'notification and deep link', approve: false, mode: 'enforced' },
    { name: 'rung1 SDK', kind: 'api', wts: 'erp.sales_invoice.submit · erp.payment_entry.submit · erp.customer.create · erp.customer.update', approve: false, mode: 'enforced' },
    { name: 'MCP doorway', kind: 'mcp', wts: 'erp.sales_invoice.submit', approve: false, mode: 'enforced' }
  ];
  /* Version-to-version changes for compare (block, field, before, after, class, adr). */
  var AR_CHANGES = {
    2: [{ b: 'write_types', f: 'erp.payment_entry.submit', a: 'Declared · one counterparty · snapshot_restore 720 h', cls: 'Structural' }, { b: 'channels', f: 'rung1 SDK · write_types', bf: 'erp.sales_invoice.submit', a: 'erp.sales_invoice.submit · erp.payment_entry.submit', cls: 'Structural' }],
    3: [{ b: 'write_types', f: 'erp.credit_limit.change', a: 'Declared · one counterparty · dual control always', cls: 'Structural' }, { b: 'permissions', f: 'Accounts executive · erp.credit_limit.change', a: 'min_autonomy A4 · may_approve false', cls: 'Structural' }],
    4: [{ b: 'write_types', f: 'erp.price_list.update', a: 'Declared · batch · snapshot_restore 168 h', cls: 'Structural' }, { b: 'gates', f: 'rate.params', bf: '120 writes per actor per minute', a: '60 writes per actor per minute', cls: 'Tightening' }],
    5: [{ b: 'write_types', f: 'erp.credit_note.submit', a: 'Declared · one counterparty · compensating_entry', cls: 'Structural' }, { b: 'gates', f: 'dual_control.params', bf: 'grand_total > 100000', a: 'grand_total > 200000', cls: 'Loosening', adr: 'ADR-0127' }],
    6: [{ b: 'gates', f: 'precondition.params', bf: 'credit_exposure + grand_total ≤ credit_limit · period not closed', a: 'credit_exposure + grand_total ≤ credit_limit · no duplicate invoice number · period not closed', cls: 'Tightening' }],
    7: [{ b: 'channels', f: 'MCP · act.write description hash', bf: 'd41c…07aa', a: '9e02…b3f1', cls: 'Editorial', note: 'A tool description is pinned by hash. Changing it needs certification: we pay a certification for a typo fix.' }],
    8: [{ b: 'write_types', f: 'erp.sales_invoice.cancel', a: 'Declared · one counterparty · irreversible: true · dual control always', cls: 'Structural' }, { b: 'channels', f: 'rung1 Voice · write_types', bf: 'not registered for erp.ar', a: 'erp.sales_invoice.cancel (approve only)', cls: 'Structural' }, { b: 'gates', f: 'schedule.adr', bf: 'ADR-0119', a: 'ADR-0142', cls: 'Editorial' }]
  };

  /* Objects: pinned fields read from the host as current state; never a copy. */
  var OBJECTS = [
    { id: 'SINV-2026-01187', type: 'Sales Invoice', title: 'SINV-2026-01187 · ACME Textiles', decl: 'erp.ar', ver: 7, host: 'sales-invoice/SINV-2026-01187', reverse: { until: '25 Sep 2026, 15:02 IST', how: 'Cancel the IRN (fast path, 24 h), then a credit note until 24 Oct 2026' },
      pinned: [['Customer', 'ACME Textiles'], ['Posting date', '24 Sep 2026'], ['Grand total', '₹2,40,000', true], ['Items', 'YARN-40S · 800 kg × ₹300'], ['Outstanding', '₹2,40,000', true], ['Status', 'Submitted · IRN requested'], ['Credit limit (customer)', '₹3,00,000', true], ['customer_gstin', 'Not pinned — personal field (ADR-0131)']] },
    { id: 'INV-2026-0834', type: 'Sales Invoice', title: 'INV-2026-0834 · Shree Murugan Traders', decl: 'sales_invoice', ver: 4, host: 'sales-invoice/INV-2026-0834',
      pinned: [['Customer', 'Shree Murugan Traders'], ['Posting date', '02 Sep 2026'], ['Grand total', '₹2,00,000', true], ['Status', 'Cancelled · IRN cancelled'], ['Cancellation', 'Irreversible — declared as such']] },
    { id: 'PO-2026-00318', type: 'Purchase Order', title: 'PO-2026-00318 · Coimbatore Castings Pvt Ltd', decl: 'erp.ap', ver: 5, host: 'purchase-order/PO-2026-00318', reverse: { until: '24 Oct 2026, 11:21 IST', how: 'Cancel the order in ERPNext (target-native undo)' },
      pinned: [['Supplier', 'Coimbatore Castings Pvt Ltd'], ['Grand total', '₹6,20,000', true], ['Schedule date', '08 Oct 2026'], ['Status', 'To receive and bill']] },
    { id: 'PE-2026-00972', type: 'Payment Entry', title: 'PE-2026-00972 · ACME Textiles', decl: 'erp.ar', ver: 7, host: 'payment-entry/PE-2026-00972', reverse: { until: '24 Oct 2026, 11:42 IST', how: 'Restore the snapshot (fast path), then a compensating entry' },
      pinned: [['Party', 'ACME Textiles'], ['Paid amount', '₹1,12,500', true], ['Reference', 'UTR 426551'], ['Status', 'Submitted']] },
    { id: 'ACC-PINV-2026-00541', type: 'Purchase Invoice', title: 'ACC-PINV-2026-00541 · Coimbatore Castings Pvt Ltd', decl: 'erp.ap', ver: 5, host: 'purchase-invoice/ACC-PINV-2026-00541', reverse: { until: '24 Oct 2026, 10:19 IST', how: 'A debit note (compensating entry)' },
      pinned: [['Supplier', 'Coimbatore Castings Pvt Ltd'], ['Grand total', '₹1,86,440', true], ['PO and GRN', 'Cross-checked'], ['Status', 'Unpaid']] },
    { id: 'STE-2026-02214', type: 'Stock Entry', title: 'STE-2026-02214 · Cotton to Mill 2', decl: 'erp.stock', ver: 3, host: 'stock-entry/STE-2026-02214',
      pinned: [['Purpose', 'Material transfer'], ['Item', 'Raw cotton (Shankar-6)'], ['Quantity', '1,200 kg'], ['Status', 'Draft — the governed write did not complete']] },
    { id: 'cust-acme-textiles', type: 'Customer', title: 'ACME Textiles', decl: 'erp.ar', ver: 7, host: 'customer/ACME%20Textiles',
      pinned: [['Customer group', 'Wholesale'], ['Credit limit', '₹3,00,000', true], ['Outstanding', '₹3,52,500', true], ['GSTIN status', 'Validated']] },
    { id: 'supp-coimbatore-castings', type: 'Supplier', title: 'Coimbatore Castings Pvt Ltd', decl: 'erp.ap', ver: 5, host: 'supplier/Coimbatore%20Castings%20Pvt%20Ltd',
      pinned: [['GSTIN', '33AAECC9120B1Z4'], ['Supplier group', 'Castings'], ['Payment terms', '45 days']] },
    { id: 'cust-shree-ganesh-handlooms', type: 'Customer', title: 'Shree Ganesh Handlooms', decl: 'erp.ar', ver: 7, host: null, absent: 'Not in ERPNext. Every governed attempt to invoice this counterparty was refused, so no record was created.', pinned: [] },
    { id: 'supp-palani-dyes', type: 'Supplier', title: 'Palani Dyes & Chemicals', decl: 'erp.ap', ver: 5, host: null, absent: 'Not in ERPNext. The only governed attempt to create it was refused (autonomy too low).', pinned: [] },
    { id: 'cust-lakshmi-garments', type: 'Customer', title: 'Lakshmi Garments', decl: 'erp.ar', ver: 7, host: 'customer/Lakshmi%20Garments', pinned: [['Customer group', 'Retail'], ['Credit limit', '₹1,50,000', true], ['Outstanding', '₹64,800', true]] },
    { id: 'UTR-426817', type: 'Payment Entry', title: 'UTR 426817 · ₹75,000', decl: 'erp.ar', ver: 7, host: null, absent: 'Not in ERPNext. The write failed on our side (PLATFORM.TARGET_UNREACHABLE) and nothing was applied.', pinned: [] },
    { id: 'JV-2026-00912', type: 'Journal Entry', title: 'JV-2026-00912 · Freight provision, September', decl: 'erp.gl', ver: 2, host: 'journal-entry/JV-2026-00912', pinned: [['Total debit', '₹1,35,000', true], ['Status', 'Draft — resubmitted by Priya Nair as OB-2026-0422']] },
    { id: 'PAYRUN-2026-0924', type: 'Payment run', title: 'Supplier payment run · 24 Sep · 14 suppliers', decl: 'erp.ap', ver: 5, host: 'payment-order/PAYRUN-2026-0924', pinned: [['Suppliers', '14'], ['Total', '₹18,42,760', true], ['Status', 'Waiting on Ravi Shankar and Meenakshi Iyer']] },
    { id: 'CN-2026-00077', type: 'Sales Invoice', title: 'CN-2026-00077 · ACME Textiles (credit note)', decl: 'erp.ar', ver: 7, host: 'sales-invoice/CN-2026-00077', pinned: [['Against', 'SINV-2026-01102'], ['Amount', '₹48,300', true], ['Status', 'Draft — waiting on a second approver']] },
    { id: 'PL-YARN-40S', type: 'Price list', title: 'Standard Selling · Yarn 40s combed', decl: 'erp.ar', ver: 7, host: 'price-list/Standard%20Selling', pinned: [['Items', '38'], ['Status', 'Unchanged — the proposed update was rejected']] },
    { id: 'JV-2026-00905', type: 'Journal Entry', title: 'JV-2026-00905 · Depreciation, August', decl: 'erp.gl', ver: 2, host: 'journal-entry/JV-2026-00905', reverse: { until: '23 Oct 2026, 23:40 IST', how: 'A reversing journal (compensating entry)' }, pinned: [['Total debit', '₹4,82,160', true], ['Status', 'Submitted']] }
  ];
  var OX = {}; OBJECTS.forEach(function (o) { OX[o.id] = o; });

  /* Connected systems (Four Doors §06, spec-atlas §2.9) */
  var SYSTEMS = [
    { id: 'erpnext-kaveri', name: 'ERPNext', host: 'kaveri.rung1.in', kind: 'Hosted ERPNext (rung1 hosted mode)', version: 'ERPNext v15.41 · Frappe v15.38', mode: 'Enforced · credential custody', status: 'connected', decls: ['erp.ar', 'sales_invoice', 'erp.ap', 'erp.stock', 'erp.gl'], lastSeq: 4112, lastAt: iso(24, '15:28'), mints: 212 }
  ];
  var ROADMAP = [
    { group: 'Enterprise', items: [['tally', 'Tally', 'Read-only source', 'Migration and opening balances read from Tally; elan1 never writes to it.'], ['zoho-books', 'Zoho Books', 'Read-only source', 'Read for reconciliation only.'], ['odoo', 'Odoo', 'Not built', 'A named future target.'], ['erpnext-self', 'Customer-run ERPNext', 'Phase 2 · Attested advisory until promoted', 'Your own ERPNext server; Enforced only after a promotion review.']] },
    { group: 'Revenue', items: [['twenty', 'Twenty', 'Not built', 'CRM target named in the documents.'], ['zoho-crm', 'Zoho CRM', 'Not built', 'CRM target named in the documents.'], ['hubspot', 'HubSpot', 'Not built', 'CRM target named in the documents.'], ['salesforce', 'Salesforce', 'Not built', 'CRM target named in the documents.']] },
    { group: 'Commerce', items: [['shopify', 'Shopify', 'Not built', 'Commerce target named in the documents.'], ['woo', 'WooCommerce', 'Not built', 'Commerce target named in the documents.'], ['ondc', 'ONDC', 'Not built', 'Network target named in the documents.'], ['ucp', 'UCP', 'Not built', 'Named in the documents.']] },
    { group: 'Later targets', items: [['sap', 'SAP', 'Named, not built', 'Named later target.'], ['oracle', 'Oracle', 'Named, not built', 'Named later target.'], ['temenos', 'Temenos', 'Named, not built', 'Named later target.'], ['finacle', 'Finacle', 'Named, not built', 'Named later target.']] }
  ];
  function roadmapItem(id) { var r = null; ROADMAP.forEach(function (g) { g.items.forEach(function (i) { if (i[0] === id) r = { id: i[0], name: i[1], status: i[2], note: i[3], group: g.group }; }); }); return r; }

  /* Changesets and runs */
  var RUNS = [
    { id: 'RUN-2026-0923-CLOSE', name: 'Overnight close run · August books', agent: 'close-agent', kind: 'agent', start: iso(23, '22:00'), end: iso(24, '02:40'), trigger: 'Scheduled · nightly during close week', autonomy: 'A1 Draft', summary: 'Drafted 9 journal entries and the August period close. People submitted what they agreed with; one draft lapsed.',
      items: [
        { obj: 'JV-2026-00905', what: 'Depreciation, August', wt: 'erp.journal_entry.submit', outcome: 'committed', seq: 4061, note: 'Submitted by Priya Nair from the agent’s draft' },
        { obj: 'JV-2026-00912', what: 'Freight provision, September', wt: 'erp.journal_entry.submit', outcome: 'escalated', seq: 4064, note: 'OB-2026-0405 raised' },
        { obj: 'JV-2026-00912', what: 'Freight provision, September', wt: 'erp.journal_entry.submit', outcome: 'refused', code: 'POLICY.OBLIGATION_EXPIRED', seq: 4110, note: 'OB-2026-0405 lapsed; Priya resubmitted as OB-2026-0422' },
        { obj: null, what: 'Close accounting period · August 2026', wt: 'erp.period.close', outcome: 'escalated', seq: null, ob: 'OB-2026-0419', note: 'Waiting on Meenakshi Iyer and Ravi Shankar' },
        { obj: null, what: '7 more journal drafts (bank charges, accruals, GST set-off)', wt: 'erp.journal_entry.submit', outcome: 'staged', seq: null, note: 'Staged intents — not governed writes until a person submits them' }
      ] },
    { id: 'RUN-2026-0924-AP', name: 'Supplier bills and payment run', agent: 'ap-agent', kind: 'agent', start: iso(24, '10:15'), end: iso(24, '15:27'), trigger: 'Inbox of supplier bills', autonomy: 'A3 / A2 by write type', summary: 'Booked one bill alone (A3), proposed one order above ₹5 lakh and proposed the week’s payment run.',
      items: [
        { obj: 'ACC-PINV-2026-00541', what: 'Supplier bill · ₹1,86,440', wt: 'erp.purchase_invoice.submit', outcome: 'committed', seq: 4091 },
        { obj: 'PO-2026-00318', what: 'Purchase order · ₹6,20,000', wt: 'erp.purchase_order.submit', outcome: 'escalated', seq: 4093, note: 'OB-2026-0409' },
        { obj: 'PO-2026-00318', what: 'Purchase order · resubmitted', wt: 'erp.purchase_order.submit', outcome: 'committed', seq: 4095, note: 'After Venkat Raman approved (#4,094)' },
        { obj: 'PAYRUN-2026-0924', what: 'Payment run · 14 suppliers · ₹18,42,760', wt: 'erp.payment_run.submit', outcome: 'escalated', seq: 4111, note: 'OB-2026-0411 · irreversible' }
      ] },
    { id: 'RUN-2026-0924-BANK', name: 'Bank reconciliation · HDFC current account', agent: 'bank-recon-agent', kind: 'agent', start: iso(24, '14:58'), end: iso(24, '15:10'), trigger: 'Bank statement received 14:55', autonomy: 'A3 Act reversible', summary: 'Matched 38 bank lines. 12 receipts recorded earlier today; one failed on our side and nothing was applied.',
      items: [
        { obj: 'PE-2026-00972', what: 'Receipt · ACME Textiles · ₹1,12,500', wt: 'erp.payment_entry.submit', outcome: 'committed', seq: 4097, note: 'Recorded by Rekha Subramanian from the agent’s match' },
        { obj: 'UTR-426817', what: 'Receipt · UTR 426817 · ₹75,000', wt: 'erp.payment_entry.submit', outcome: 'refused', code: 'PLATFORM.TARGET_UNREACHABLE', seq: 4102, note: 'Our failure; retried with the same intent at 15:14' }
      ] },
    { id: 'RUN-2026-0920-TALLY', name: 'Migration record · Tally opening balances', agent: 'Priya Nair', kind: 'person', start: iso(20, '09:30'), end: iso(20, '13:05'), trigger: 'One-off migration (Tally is a read-only source)', autonomy: 'A3 (person)', summary: '214 customers created through the governed path; 3 refused because their GSTINs did not validate. Tally itself was only read.',
      items: [
        { obj: 'cust-acme-textiles', what: '211 customers created', wt: 'erp.customer.create', outcome: 'committed', seq: 3931, note: 'seq 3,720–3,930 range, one proof each' },
        { obj: null, what: '3 customers refused — GSTIN not validated', wt: 'erp.customer.create', outcome: 'refused', code: 'GATE.COUNTERPARTY_UNKNOWN', seq: 3932, note: 'Listed in the migration record for the accounts team' }
      ] }
  ];

  /* Tenant extras (base data in E1.data.tenants) */
  var TENANT_X = {
    'kaveri-spinning': { created: '01 Aug 2026', contract: 'Signed · rung1 Enterprise · DPA in place', notice: 'Meenakshi Iyer (Owner)', owner: 'Venkat Raman (Accounts head)', hosting: 'H1 · rung1 hosted', system: 'erpnext-kaveri', stops: [] },
    'deccan-auto': { created: '12 Aug 2026', contract: 'Signed · rung1 Enterprise', notice: 'Finance controller', owner: 'Accounts head', hosting: 'H1 · rung1 hosted', stops: [] },
    'sahyadri-agro': { created: '19 Sep 2026', contract: 'Signed · onboarding', notice: 'Partner', owner: 'Not yet named', hosting: 'H1 · rung1 hosted', stops: [] },
    'nilgiri-tea': { created: '05 Aug 2026', contract: 'Signed · rung1 Enterprise', notice: 'Director (finance)', owner: 'Accounts head', hosting: 'H1 · rung1 hosted', stops: [{ at: '2026-09-24T16:05:00+05:30', what: 'Stopped', cause: 'Suspected credential exposure', by: 'Meenakshi Iyer', second: 'Arjun Mehta', seq: 612, ob: 'OB-2026-0398', reason: 'A production key for the tenant’s ERPNext site was pasted into a support ticket. Stop until the key is rotated and the ticket system purged.' }] },
    'ledgerloop-sbx': { created: '15 Sep 2026', contract: 'Design partner · Pre-GA', notice: 'LedgerLoop CTO', owner: 'LedgerLoop', hosting: 'Sandbox tenant', stops: [] },
    'ref-tenant': { created: '01 Aug 2026', contract: 'Internal · synthetic fixtures (C9 suite)', notice: 'elan1 on-call', owner: 'Arjun Mehta', hosting: 'Sandbox tenant', stops: [] }
  };
  var STOP_CAUSES = ['Suspected credential exposure', 'Agent misbehaviour', 'Customer request', 'Residency concern', 'Platform incident'];

  /* Packs (spec-phase2-3 §1.9–1.11, §4.6) */
  var PACKS = [
    { id: 'ledger1', name: 'ledger1', title: 'The First India Pack', status: 'Bound as a declaration · evidence at L2', tone: 'info', domain: 'Changes to the books of account, and the evidence that each one passed stated rules.',
      regime: 'Ministry of Corporate Affairs — Companies (Accounts) Rules, audit trail (edit log) for accounting software', inForce: 'In force since 1 April 2023', buyer: 'The promoter or finance controller of a ₹5–50 crore firm, usually on their CA’s advice. Budget line: audit and compliance, not software.', auditor: 'The statutory auditor', price: '₹1,35,000 / tenant / year', profile: 'in-mca-audit-trail v1', minLevel: 'L2', owner: 'elan1 lead',
      scores: [['G-A', 'A dated hook', 'pass', 'In force since 1 April 2023.'], ['G-B', 'An auditor', 'pass', 'The statutory auditor, named in the pilot.'], ['G-C', 'Reversible, or honestly irreversible', 'pass', 'Native cancel or a compensating instrument, declared.'], ['G-D', 'Evidence sold separately', 'provisional', 'Pass, provisionally — this is the gate the pilot actually tests.'], ['G-E', 'We own the write', 'pass', 'rung1 hosted mode: the single writer is the only path.']],
      wts: [['sales_invoice.submit', 'one_counterparty', 'target_native_undo — cancel the IRN and the invoice', 'Above ₹2 lakh'], ['sales_invoice.cancel', 'one_counterparty', 'Honestly irreversible after the 24-hour IRN window; declared as such', 'Always'], ['purchase_invoice.submit', 'one_counterparty', 'target_native_undo', 'Above ₹2 lakh'], ['payment_entry.submit', 'one_counterparty', 'compensating_instrument', 'Always'], ['journal_entry.submit', 'batch', 'compensating_instrument', 'Always'], ['customer.update (credit terms, GSTIN)', 'one_record', 'target_native_undo', 'On GSTIN change']],
      gates: ['consent', 'residency', 'retention', 'counterparty', 'precondition', 'dual_control', 'budget'], gateNote: 'Budget is declared on for this pack because a runaway journal entry is the failure mode the buyer imagines first.',
      clauses: [['Audit trail of each and every transaction', 'record_keeping', '*', '—', 'F04, F05, F09, F10, F16', 'C01, C02'], ['Creating an edit log of each change made in books of account', 'record_keeping', '*', 'precondition', 'F12, F13, F14, F07', 'C03'], ['Along with the date when such changes were made', 'record_keeping', '*', '—', 'F16', 'C04'], ['The audit trail shall not be disabled', 'non_repudiation', '*', '—', 'F02, F03', 'C05, C06']],
      tests: [['T1', 'Declaration validates', 'passed', 'erp.ar v7 and erp.gl v2 validate on every certification.'], ['T2', 'Profile certified', 'not_run', 'The verifier profile is certified at L2.'], ['T3', 'Reversal is honest (dated drill)', 'passed', 'Drill 12 Sep 2026 on ref-tenant: compensating instrument on a journal entry.'], ['T4', 'Refusals are real', 'passed', '7 gates, 7 fixture refusals on ref-tenant.'], ['T5', 'Bundle verifies offline', 'not_run', 'Arrives at L2.'], ['T6', 'Tampered bundle refuses', 'not_run', 'Arrives at L2.'], ['T7', 'Non-conforming bundle is not accused', 'not_run', 'Arrives at L2.'], ['T8', 'The auditor reads it', 'not_run', 'In the 90-day pilot, with the statutory auditor.']],
      limits: 'A PASS under in-mca-audit-trail v1 establishes that the changes contained in this bundle were made through the elan1 governed write path, that each carries an actor, an actor kind, a target record identifier and a platform-clock timestamp, that the sequence is unbroken and externally anchored, and that the refused attempts are present. It does not establish that the books of account are complete: changes made directly in the accounting system, outside this write path, are recorded by that system’s own audit trail and are not in this bundle. It does not establish that the transactions were genuine, that the rules applied were adequate, or that this bundle satisfies any obligation — that determination belongs to the reader. This profile is the vendor’s reading of the obligation; it has not been reviewed or accepted by the Ministry of Corporate Affairs or by any regulator.',
      pilot: 'One customer, one statutory auditor, 90 days. Starts when the tenant reaches L2 Attested.' },
    { id: 'invoice1', name: 'invoice1', title: 'GST e-invoicing', status: 'Second pack · profile not yet certified', tone: 'neutral', domain: 'Tax invoices requested through the governed path, and the evidence that each request passed stated rules.',
      regime: 'GST e-invoicing mandate (IRN)', inForce: 'e-invoicing mandate in force', buyer: 'The finance controller of a GST-registered firm above the e-invoicing threshold.', auditor: 'GST officer at assessment; statutory auditor at year end', price: 'Not priced yet [unverified]', profile: 'Not yet authored', minLevel: 'L2', owner: 'elan1 lead',
      scores: [['G-A', 'A dated hook', 'pass', 'The e-invoicing mandate.'], ['G-B', 'An auditor', 'pass', 'GST officer at assessment; auditor at year end.'], ['G-C', 'Reversible, or honestly irreversible', 'pass', 'Invoice reversible; IRN irreversible after 24 h.'], ['G-D', 'Evidence sold separately', 'pass', 'A separate evidence line exists.'], ['G-E', 'We own the write', 'partial', 'We govern the write that requests it; we do not own the clearance.']],
      wts: [['sales_invoice.submit', 'one_counterparty', 'target_native_undo — cancel the IRN within 24 h', 'Above ₹2 lakh'], ['sales_invoice.cancel', 'one_counterparty', 'Irreversible after 24 h', 'Always']],
      gates: ['consent', 'residency', 'retention', 'counterparty', 'precondition', 'dual_control'], gateNote: 'Second pack: “not abandoned; it is second”.',
      clauses: [], tests: [['T1', 'Declaration validates', 'passed', 'Shares erp.ar.'], ['T2', 'Profile certified', 'not_run', 'Not authored.'], ['T3', 'Reversal is honest', 'not_run', 'Drill not yet scheduled.'], ['T4', 'Refusals are real', 'not_run', ''], ['T5', 'Bundle verifies offline', 'not_run', ''], ['T6', 'Tampered bundle refuses', 'not_run', ''], ['T7', 'Non-conforming bundle is not accused', 'not_run', ''], ['T8', 'The auditor reads it', 'not_run', '']],
      limits: 'The IRN, the portal response and the 24-hour cancellation window are the accounting system’s evidence and not ours. This profile will say so in every report.', hook: '8,55,738 GSTINs generated e-invoices in FY25-26, 21.4 crore IRNs.',
      pilot: 'Not scheduled. Why second: it fails G-E in part.' },
    { id: 'collect1', name: 'collect1', title: 'Collections conduct', status: 'Spec sketch — rule citations need counsel confirmation', tone: 'neutral', domain: 'Governed collection calls, promises and dispositions, with the evidence that each passed conduct, telecom and data rules.',
      regime: 'RBI fair-practices code on recovery · telecom DLT rules · DPDP', inForce: 'Citations need counsel confirmation', buyer: 'The head of collections at a lender, with compliance as co-signer.', auditor: 'Lender’s compliance function; RBI inspection', price: '₹1,35,000 / year per regime (monthly share) · per governed call, refusals at zero', profile: 'in-rbi-collections v1 (sketch)', minLevel: 'L2', owner: 'elan1 lead',
      scores: [['G-A', 'A dated hook', 'pass', 'Pass, counsel to confirm.'], ['G-B', 'An auditor', 'pass', 'Lender’s compliance; inspection.'], ['G-C', 'Reversible, or honestly irreversible', 'pass', 'call.attempt honestly irreversible.'], ['G-D', 'Evidence sold separately', 'pass', 'Evidence sold separately per regime.'], ['G-E', 'We own the write', 'open', 'We own the call record. The write into the lender’s collection system may belong to their core software.']],
      wts: [['call.attempt', '—', 'Irreversible', '—'], ['call.record', '—', 'Append-only', '—'], ['promise.capture', '—', 'Reversible, retractable with its own record', '—'], ['disposition.set', '—', 'Reversible', '—'], ['escalation.raise', '—', 'Reversible', '—'], ['preference.update', '—', 'Irreversible by design — never undone by an agent', '—']],
      gates: [], gateNote: 'Fourteen gates in three phases: before the dial (lawful basis, preference scrub, time window, attempt cap and cooling period, script and template version, authority band, number and series), during the call (disclosure, identity check, read-back, prohibited-language guard, human path) and after (recording integrity, disposition recorded).',
      clauses: [], tests: [], limits: 'That the debt is valid. That the person who answered is the borrower, beyond the identity check performed. That the conversation was kind. And the audio is proved authentic only from our capture point onward.',
      pilot: 'One lender, one early-bucket book, one quarter, three languages, with an auditor login from day one and cost per governed call published weekly beside their human baseline.' }
  ];
  var PKX = {}; PACKS.forEach(function (p) { PKX[p.id] = p; });

  /* Lexicon (F15) */
  var LEXICON = {
    ref: 'rung1/erpnext/gst/2026-09', hash: dg('5d8e', 'a1c4'),
    versions: [{ id: '2026-09', hash: dg('5d8e', 'a1c4'), at: '19 Sep 2026', seq: 3861, by: 'Arjun Mehta', note: 'credit exposure now includes submitted but unpaid sales orders' }, { id: '2026-08', hash: dg('b20f', '6e93'), at: '12 Aug 2026', seq: 1421, by: 'Arjun Mehta', note: 'First term set for rung1 on ERPNext' }],
    terms: [
      ['credit limit', 'The most a customer may owe at any moment, set on the Customer record and changed only by erp.credit_limit.change.', 'Customer.credit_limit', '₹, ex-GST', '2026-08'],
      ['credit exposure', 'What the customer owes now: outstanding invoices plus submitted but unpaid sales orders, before this write.', 'derived: outstanding + open orders', '₹', '2026-09'],
      ['grand total', 'The invoice amount including GST, after discounts, as ERPNext computes it.', 'Sales Invoice.grand_total', '₹', '2026-08'],
      ['outstanding amount', 'The part of an invoice that has not been paid or credited.', 'Sales Invoice.outstanding_amount', '₹', '2026-08'],
      ['posting date', 'The business date the entry belongs to — supplied as as_of, never taken from a clock.', 'posting_date', 'date (IST)', '2026-08'],
      ['counterparty', 'A registered customer, supplier or bank with a validated GSTIN, not on a sanctions list.', 'Customer / Supplier', '—', '2026-08'],
      ['GSTIN', 'The 15-character GST identification number, validated against the portal before first use.', 'tax_id', '—', '2026-08'],
      ['IRN', 'The invoice reference number returned by the e-invoice portal; cancellable within 24 hours.', 'Sales Invoice.irn', '—', '2026-08'],
      ['period closed', 'An accounting period after erp.period.close, into which nothing may be posted without reopening.', 'Accounting Period.closed', '—', '2026-08'],
      ['PO and GRN cross-checked', 'A supplier bill whose quantities and rates agree with both its purchase order and goods receipt note.', 'derived', '—', '2026-08']
    ]
  };

  /* Policy (rung 4 rule sets) */
  var POLICIES = {
    11: { v: 11, decl: 'erp.ar', applies: 'erp.ar v6–v8', at: '19 Sep 2026', seq: 3863, by: 'Arjun Mehta', supersedes: 10,
      projection: ['grand_total', 'customer', 'credit_limit', 'credit_exposure', 'posting_date', 'items[].rate', 'price_list_rate', 'actor_kind', 'new_limit', 'current_limit', 'item_count'],
      rules: [
        ['R-SI-01', 'erp.sales_invoice.submit', 'customer.gstin_status = validated and grand_total ≤ 50,00,000', 'allow', 'Routine invoices to validated customers are allowed; gates and autonomy still apply.'],
        ['R-SI-02', 'erp.sales_invoice.submit', 'grand_total > 50,00,000', 'escalate', 'Very large invoices always reach a person, whatever the agent’s grant.'],
        ['R-SI-03', 'erp.sales_invoice.submit', 'any items[].rate < price_list_rate × 0.94', 'escalate', 'Margin below 6% goes to ar-approvers.'],
        ['R-CN-01', 'erp.credit_note.submit', 'always', 'escalate', 'Every credit note reaches a person.'],
        ['R-CL-01', 'erp.credit_limit.change', 'actor_kind = agent', 'refuse', 'An agent may not change a credit limit. Ask an owner to submit it, or change the permission.'],
        ['R-CL-02', 'erp.credit_limit.change', 'new_limit > current_limit × 1.5', 'escalate', 'Large increases reach the owner as well as ar-approvers.'],
        ['R-PE-01', 'erp.payment_entry.submit', 'matched bank line present', 'allow', 'Receipts matched to a bank line are allowed.'],
        ['R-PL-01', 'erp.price_list.update', 'item_count > 20', 'escalate', 'Large price changes reach a person.']
      ] },
    10: { v: 10, decl: 'erp.ar', applies: 'erp.ar v5–v6', at: '11 Sep 2026', seq: 3378, by: 'Arjun Mehta', supersedes: 9, removed: ['R-SI-03'] }
  };

  /* DPDP erasure cases (spec-phase4 R-03, spec-tm §1.7) */
  var ERASURE = [
    { id: 'ER-2026-0004', principal: 'Customer contact · Lakshmi Garments (proprietor)', opened: E1.ago(31 * 60), deadline: E1.ahead(41 * 60), status: 'plan', approvals: [{ name: 'Priya Nair', role: 'Tenant admin (proposer)', done: true }, { name: 'Meenakshi Iyer', role: 'Owner (second approver)', done: false }], via: 'E-mail to the grievance officer', verified: 'Verified by a one-time code to the registered mobile and the GSTIN on file · Priya Nair', records: 14, ob: 'OB-2026-0428' },
    { id: 'ER-2026-0003', principal: 'Former employee · payroll contact', opened: '2026-09-15T11:20:00+05:30', closedAt: '2026-09-16T17:05:00+05:30', status: 'refused', approvals: [{ name: 'Priya Nair', role: 'Tenant admin', done: true }, { name: 'Meenakshi Iyer', role: 'Owner', done: true }], via: 'Letter', verified: 'Verified in person · Priya Nair', records: 6, statute: 'Companies Act 2013, s.128(5): books of account kept for eight financial years', expires: '31 Mar 2034' },
    { id: 'ER-2026-0002', principal: 'Walk-in buyer · WhatsApp enquiry', opened: '2026-09-02T09:40:00+05:30', closedAt: '2026-09-04T12:10:00+05:30', status: 'completed', approvals: [{ name: 'Priya Nair', role: 'Tenant admin', done: true }, { name: 'Venkat Raman', role: 'Accounts head', done: true }], via: 'WhatsApp opt-out and request', verified: 'Verified by a one-time code to the same WhatsApp number · Priya Nair', records: 3, seq: 2871, receipt: 'ERR-2026-0002-7c1e' }
  ];

  E1.data.records = { gates: GATES, writeTypes: WT, proof: PROOF, older: OLDER, agents: AGENTS, delegations: DELEGATIONS, declarations: DECLS, objects: OBJECTS, systems: SYSTEMS, roadmap: ROADMAP, runs: RUNS, packs: PACKS, lexicon: LEXICON, policies: POLICIES, erasure: ERASURE, tenantsX: TENANT_X };

  /* ------------------------------------------------------------------------
     Navigation: the re-scoped question, and the sections the door lacks
     ------------------------------------------------------------------------ */
  if (E1.nav && E1.nav.records) E1.nav.records.question = 'What changed, and what may change?';
  E1.navAdd('records', { id: 'lexicon', label: 'Lexicon', href: '#/records/lexicon', group: 'Declare', after: 'write-types' });
  E1.navAdd('records', { id: 'policies', label: 'Rule sets', href: '#/records/policies/11', group: 'Declare', after: 'lexicon' });
  E1.navAdd('records', { id: 'actors', label: 'Actors & delegations', href: '#/records/actors', group: 'Access', before: 'tenants' });
  E1.navAdd('records', { id: 'erasure', label: 'Erasure requests', href: '#/records/erasure', group: 'Access', after: 'tenants' });

  var R = ['Records', '#/records/systems'];
  function reg(path, def) { E1.route(path, Object.assign({ layout: 'console', door: 'records' }, def)); }

  /* ========================================================================
     CONNECTED SYSTEMS
     ======================================================================== */
  reg('/records/systems', {
    title: 'Connected systems', section: 'systems', keywords: 'erpnext host tally zoho odoo hubspot shopify credential custody',
    render: function (p, q) {
      var path = '/records/systems';
      var head = c.pageHeader({
        tabs: sibTabs('systems'), title: 'Connected systems', eyebrow: 'Records · state',
        lead: 'Where governed writes land, and what changed there. elan1 keeps no second copy of these records: every object links out to its host.',
        actions: stateMenu(path, [['empty', 'Empty — nothing connected'], ['error', 'Error — registry unreachable'], ['loading', 'Loading']]) + c.button('View declarations', { href: '#/records/declarations?system=erpnext', icon: 'file-text' })
      });
      if (q.state === 'loading') return page(head, loadingState());
      if (q.state === 'error') return page(head, errorState('your connected systems'));
      if (q.state === 'empty') return page(head, c.empty({ icon: 'plug', title: 'No system of record is connected.', why: 'elan1 governs writes to a system you already use; connect one to see its governed history here.', fill: 'Phase 1 connects hosted ERPNext through rung1. The single writer then holds the only credential to it.', action: [{ label: 'Start onboarding: connect a system', href: '#/onboarding/system' }, { label: 'What elan1 connects to', href: '#/product/how-it-works' }] }));
      var s = SYSTEMS[0];
      var stats = '<div class="rec-stats">' +
        c.stat({ label: 'Connected', value: '1', note: 'ERPNext at kaveri.rung1.in, Enforced with credential custody.', href: '#/records/systems/erpnext-kaveri' }) +
        c.stat({ label: 'Last governed write', value: seqTxt(s.lastSeq), note: 'Move stock · Not done · ' + fmt.time(s.lastAt), href: '#/assurance/proof/4112' }) +
        c.stat({ label: 'Single-use credentials today', value: num(s.mints), note: '10-minute life, one write each. Long-lived credentials: 0.' }) +
        c.stat({ label: 'Declarations bound', value: String(s.decls.length), note: 'erp.ar, sales_invoice, erp.ap, erp.stock, erp.gl', href: '#/records/declarations?system=erpnext' }) + '</div>';
      var table = c.table({
        caption: 'Connected systems', rowHref: function (r) { return '#/records/systems/' + r.id; },
        columns: [
          { key: 'name', label: 'System', html: true, render: function (r) { return '<strong>' + esc(r.name) + '</strong> <span class="rec-muted">· ' + esc(r.host) + '</span><div class="rec-small rec-muted">' + esc(r.kind) + '</div>'; } },
          { key: 'version', label: 'Host version', render: function (r) { return '<span class="rec-small">' + esc(r.version) + '</span>'; } },
          { key: 'mode', label: 'Enforcement mode', render: function (r) { return c.badge('good', r.mode, { icon: 'lock' }); } },
          { key: 'decls', label: 'Declarations', align: 'right', render: function (r) { return '<span class="rec-mono">' + r.decls.length + '</span>'; } },
          { key: 'last', label: 'Last governed write', render: function (r) { return seqLink(r.lastSeq, { prefix: false }) + ' <span class="rec-muted rec-small">' + esc(fmt.time(r.lastAt)) + '</span>'; } },
          { key: 'adapter', label: 'Adapter', render: function () { return c.badge('good', 'Reachable', { subtle: true }); } },
          { key: 'open', label: 'Host', render: function (r) { return hostBtn('Open in ERPNext', '', { size: 'sm', kind: 'ghost' }); } }
        ], rows: SYSTEMS
      });
      var road = ROADMAP.map(function (g) {
        return '<div class="rec-stack--sm rec-stack"><p class="rec-label">' + esc(g.group) + '</p><div class="rec-sysgrid">' + g.items.map(function (i) {
          return '<a class="rec-systile" href="#/records/systems/' + esc(i[0]) + '"><b>' + esc(i[1]) + '</b><span>' + esc(i[2]) + '</span></a>';
        }).join('') + '</div></div>';
      }).join('');
      return page(head,
        stats +
        c.section({ id: 'connected', title: 'Connected now', lead: 'Governed writes reach ERPNext through Frappe’s own API, never the ORM, with a single-use credential minted for each write.', body: table }) +
        c.callout({ kind: 'rule', title: 'Enforced is claimed only where we hold the only credential.', body: '<p>In Phase 1 that is rung1 hosted mode. Any other system is <strong>Attested advisory</strong> until a promotion review proves otherwise, and the screens say so. Records never holds a second copy of invoices, ledgers, deals or orders.</p>' }) +
        c.section({ id: 'roadmap', title: 'Not connected yet', lead: 'Named in the documents. Each becomes available when a governed write runs against it in a customer’s tenant — gates, not dates.', body: '<div class="rec-stack">' + road + '</div>' })
      );
    }
  });

  reg('/records/systems/:id', {
    title: function (p) { var s = SYSTEMS.filter(function (x) { return x.id === p.id; })[0]; var r = roadmapItem(p.id); return s ? 'ERPNext · kaveri.rung1.in' : r ? r.name : p.id; },
    section: 'systems', crumbs: [R, ['Connected systems', '#/records/systems']], example: '/records/systems/erpnext-kaveri',
    render: function (p, q) {
      var s = SYSTEMS.filter(function (x) { return x.id === p.id || (p.id === 'erpnext' && x.id === 'erpnext-kaveri'); })[0];
      if (!s) {
        var r = roadmapItem(p.id);
        var head2 = c.pageHeader({ title: r ? r.name : p.id, eyebrow: 'Connected systems · ' + (r ? r.group : 'unknown'), lead: r ? r.note : 'No system is registered under this name for ' + tenantShort() + '.', back: ['Connected systems', '#/records/systems'] });
        return page(head2, c.card({ body: '<div class="rec-sysrow"><span class="rec-sysmark">' + c.icon('plug', 20) + '</span><div class="rec-stack rec-stack--sm" style="flex:1;min-width:240px">' +
          c.kv([['Status', r ? r.status : 'Not registered'], ['Enforcement mode', r && /Read-only/.test(r.status) ? 'None — elan1 only reads from it and never writes' : 'None yet. When connected: Attested advisory until a promotion review proves Enforced.'], ['Governed writes', '0 — nothing has been written here through elan1'], ['What would make it available', 'A declared adapter, a single writer that holds the only credential, and a governed write running in a customer’s tenant.']], { cols: 1 }) +
          '</div></div>' }) +
          c.empty({ compact: true, title: 'No governed history for ' + (r ? r.name : p.id), why: 'Nothing is connected, so nothing has been governed here. Records never copies host data to fill the gap.', action: [{ label: 'Back to connected systems', href: '#/records/systems' }, { label: 'See the roadmap', href: '#/roadmap' }] }));
      }
      var head = c.pageHeader({
        title: 'ERPNext · kaveri.rung1.in', eyebrow: 'Connected system · ' + s.kind,
        lead: 'The system of record for Kaveri Spinning Mills. Only the kernel’s single writer can change it through elan1; people can still change it directly in ERPNext, and those changes are not shown here.',
        back: ['Connected systems', '#/records/systems'],
        actions: stateMenu('/records/systems/' + p.id, [['error', 'Host unreachable']]) + c.button('Test reachability', { icon: 'activity', attrs: 'data-action="rec-ping"' }) + hostBtn('Open in ERPNext', '', { kind: 'primary' }),
        meta: c.badge('good', 'Enforced · credential custody', { icon: 'lock' }) + ' ' + tag('residency in · Mumbai') + ' ' + tag(esc(s.version), 'mono')
      });
      var err = q.state === 'error' ? c.error({ title: 'We cannot reach ERPNext right now.', body: 'The last read-only check at ' + fmt.time(E1.ago(3)) + ' timed out. Writes that need ERPNext refuse with PLATFORM.TARGET_UNREACHABLE and nothing is applied.', reassurance: 'The governed history below is complete and comes from the proof chain, not from ERPNext.', code: 'PLATFORM.TARGET_UNREACHABLE', action: { label: 'Test reachability again', href: '#/records/systems/' + p.id } }) : '';
      var health = c.card({ title: 'Connection health', body: c.kv([
        ['Reachability', q.state === 'error' ? c.badge('critical', 'Not answering') : c.badge('good', 'Answering read-only checks'), { html: true }],
        ['Last read-only check', fmt.dateTime(E1.ago(2))],
        ['Write path', 'Frappe REST API, never the ORM'],
        ['ERPNext pair latency', '≤ 1,200 ms p95 — target [unverified]'],
        ['Adapter', 'elan1-erpnext 0.9.3 · inverse operations declared for 7 write types']
      ]) });
      var custody = c.card({ title: 'Credential custody', body: c.kv([
        ['Who holds the credential', 'The kernel’s single writer, and nobody else through elan1'],
        ['Per write', 'One single-use credential, 10-minute life, scoped to one write'],
        ['Minted today', num(s.mints) + ' · last at 15:28 IST for ' + seqTxt(4112)],
        ['Long-lived credentials', '0'],
        ['Custody mode', 'Enforced · credential custody (sealed per write type)']
      ]) });
      var resid = c.card({ title: 'Residency', body: c.kv([['Residency domain', 'in'], ['Region', 'ap-south-1 (Mumbai), three availability zones'], ['Data outside India', 'None. No second region until a residency decision is written down.'], ['Checked by', 'G2 Residency on every write, never skippable']]) + '<p class="rec-table-note"><a href="#/assurance/residency">Residency on the Assurance door</a></p>' });
      var decls = c.table({
        caption: 'Declarations bound to this system', rowHref: function (r) { return '#/records/declarations/' + r.id; },
        columns: [{ key: 'name', label: 'Declaration', html: true, render: function (r) { return esc(r.name) + '<div class="rec-small rec-mono rec-muted">' + esc(r.id) + '</div>'; } }, { key: 'current', label: 'In force', render: function (r) { return mono('v' + r.current); } }, { key: 'owner', label: 'Owner role' }, { key: 'n', label: 'Write types', align: 'right', render: function (r) { return mono(declWts(r.id).length); } }],
        rows: s.decls.map(function (id) { return DX[id]; })
      });
      var inv = c.table({
        caption: 'Reversal support by write type', columns: [
          { key: 'label', label: 'Write type', html: true, render: function (w) { return '<a href="#/records/write-types/' + esc(w.name) + '">' + esc(w.label) + '</a><div class="rec-small rec-mono rec-muted">' + esc(w.name) + '</div>'; } },
          { key: 'rev', label: 'Inverse operation', render: function (w) { return w.rev ? mono(w.rev.m) + (w.rev.h ? ' <span class="rec-muted rec-small">· ' + (w.rev.h >= 48 ? w.rev.h / 24 + ' days' : w.rev.h + ' h') + '</span>' : '') : c.reversible(false); } },
          { key: 'after', label: 'After the window', render: function (w) { return w.rev ? mono(w.rev.after) : '<span class="rec-muted">—</span>'; } }
        ], rows: WT.filter(function (w) { return /^erp\./.test(w.name); }).slice(0, 9)
      });
      var recent = c.timeline(PROOF.slice(-6).reverse().map(function (e) {
        return { time: fmt.dateTime(e.at), title: wtLabel(e.wt) + ' · ' + (e.outcome === 'committed' ? 'Committed' : e.outcome === 'escalated' ? 'Waiting on a person' : (/^PLATFORM/.test(e.code || '') ? 'Platform failure' : 'Not done')), body: e.note, state: stateForOutcome(e.outcome, e.code), href: '#/assurance/proof/' + e.seq, meta: seqLink(e.seq) + ' · ' + esc(kindWord(e.kind)) + ' · ' + esc(e.actor) };
      }));
      return page(head, err +
        '<div class="rec-two">' + health + custody + '</div>' +
        '<div class="rec-two">' + resid + c.card({ title: 'Last governed write', body: c.kv([['Proof', seqLink(4112), { html: true }], ['Write type', 'Move stock · erp.stock_entry.submit'], ['Outcome', c.outcome('refused', { code: 'GATE.SANDBOX_DIVERGED' }), { html: true }], ['What happened', 'The live re-run disagreed with the shadow sandbox; the snapshot was restored and nothing was changed.']]) }) + '</div>' +
        c.section({ id: 'decls', title: 'Declarations bound', lead: 'A write type exists only at an explicit declaration version. There is no generic write.', body: decls }) +
        c.section({ id: 'reversal', title: 'Reversal support', lead: 'Undo is chosen by the system: the fast path inside the window, a compensating instrument after it. Never a silent delete.', body: inv }) +
        c.section({ id: 'recent', title: 'Recent governed writes', lead: 'Refusals and escalations are listed with commits.', actions: c.button('All proof entries', { href: '#/assurance/proof', size: 'sm', iconRight: 'arrow-right', kind: 'ghost' }), body: recent })
      );
    }
  });

  /* ========================================================================
     OBJECTS
     ======================================================================== */
  function objStats(o) {
    var list = proofFor(o.id), n = { committed: 0, refused: 0, escalated: 0 };
    list.forEach(function (e) { n[e.outcome] = (n[e.outcome] || 0) + 1; });
    return { list: list, n: n, last: list[0] };
  }
  reg('/records/objects', {
    title: 'Objects', section: 'objects', keywords: 'records timeline invoice customer supplier',
    render: function (p, q) {
      var path = '/records/objects';
      var types = {}; OBJECTS.forEach(function (o) { types[o.type] = (types[o.type] || 0) + 1; });
      var qs = String(q.q || '').toLowerCase();
      var rows = OBJECTS.filter(function (o) { return (!q.type || o.type === q.type) && (!qs || (o.title + ' ' + o.id + ' ' + o.type).toLowerCase().indexOf(qs) >= 0); });
      if (q.outcome) rows = rows.filter(function (o) { var s = objStats(o); return s.n[q.outcome] > 0; });
      var head = c.pageHeader({
        tabs: sibTabs('objects'), title: 'Objects', eyebrow: 'Records · state',
        lead: 'Every record a governed write has touched — including the ones it was refused — with its timeline. Current values stay in ERPNext; we pin only the declared fields.',
        actions: stateMenu(path, [['empty', 'Empty — nothing governed yet'], ['error', 'Error'], ['loading', 'Loading']]) + hostBtn('Open ERPNext', '', {})
      });
      if (q.state === 'loading') return page(head, c.skeleton({ kind: 'table', rows: 8 }));
      if (q.state === 'error') return page(head, errorState('the objects list'));
      var chips = [{ label: 'All', href: E1.href(path, { q: q.q }), active: !q.type, count: OBJECTS.length }].concat(Object.keys(types).map(function (t) { return { label: t, href: E1.href(path, { type: t, q: q.q, outcome: q.outcome }), active: q.type === t, count: types[t] }; }));
      var oc = c.filters([{ label: 'Any outcome', href: E1.href(path, { type: q.type, q: q.q }), active: !q.outcome }, { label: 'Has a refusal', href: E1.href(path, { type: q.type, q: q.q, outcome: 'refused' }), active: q.outcome === 'refused' }, { label: 'Waiting on a person', href: E1.href(path, { type: q.type, q: q.q, outcome: 'escalated' }), active: q.outcome === 'escalated' }], { label: 'Outcome' });
      var tbl = q.state === 'empty' ? c.empty({ title: 'No governed write has touched a record yet.', why: 'Objects appear here the first time a governed write — committed, refused or escalated — names them. Changes made directly in ERPNext are not shown.', fill: 'An agent or a person submitting through the web console, the SDK or MCP fills this list.', action: { label: 'Make a first request', href: '#/work/requests' } }) :
        c.table({
          caption: 'Objects touched by governed writes', rowHref: function (o) { return '#/records/object/' + encodeURIComponent(o.id); },
          empty: { title: 'No object matches this view', why: 'Nothing with that record type or text has been touched by a governed write.', action: { label: 'Clear filters', href: '#' + path } },
          columns: [
            { key: 'title', label: 'Object', html: true, render: function (o) { return '<strong>' + esc(o.title) + '</strong>' + (o.absent ? '<div class="rec-small rec-muted">Not in ERPNext</div>' : ''); } },
            { key: 'type', label: 'Record type' },
            { key: 'decl', label: 'Declaration', render: function (o) { return mono(o.decl + ' v' + o.ver); } },
            { key: 'n', label: 'Governed writes', html: true, render: function (o) { var s = objStats(o); return '<span class="rec-small">' + [s.n.committed ? s.n.committed + ' committed' : '', s.n.refused ? s.n.refused + ' not done' : '', s.n.escalated ? s.n.escalated + ' waiting' : ''].filter(Boolean).join(' · ') + '</span>'; } },
            { key: 'last', label: 'Last outcome', html: true, render: function (o) { var s = objStats(o); return s.last ? c.outcome(s.last.outcome, { code: s.last.code && /^PLATFORM/.test(s.last.code) ? s.last.code : null, subtle: true }) : ''; } },
            { key: 'at', label: 'Last write', html: true, nowrap: true, render: function (o) { var s = objStats(o); return s.last ? seqLink(s.last.seq, { prefix: false }) + ' <span class="rec-small rec-muted">' + esc(fmt.rel(s.last.at, new Date('2026-09-24T15:30:00+05:30'))) + '</span>' : ''; } }
          ], rows: rows
        });
      return page(head,
        c.toolbar('<form class="rec-objsearch" data-rec-search="' + path + '">' + c.searchBox({ placeholder: 'Search objects by id or name', value: q.q, label: 'Search objects' }) + '</form>', '<span class="rec-kbdhint">' + rows.length + ' of ' + OBJECTS.length + ' objects</span>') +
        c.filters(chips, { label: 'Record type' }) + oc + tbl +
        c.callout({ kind: 'rule', title: 'Records never holds a second copy.', body: '<p>No list or form here rebuilds an ERPNext DocType screen. Each object shows its pinned fields, read from ERPNext as current state, and a governed timeline from the proof chain. For anything else, open it in ERPNext.</p>' })
      );
    }
  });

  function tlItem(e, o) {
    var plat = e.code && /^PLATFORM/.test(e.code);
    var title = (e.outcome === 'committed' ? 'Committed' : e.outcome === 'escalated' ? 'Waiting on a person' : plat ? 'Our failure' : 'Not done') + ' · ' + wtLabel(e.wt);
    var meta = c.outcome(e.outcome, { code: e.code, subtle: true }) + ' <span class="rec-small">' + seqLink(e.seq) + ' · <span class="rec-mono">' + esc(e.wt) + '</span> · ' + esc(e.level) + ' · meter ' + esc(e.meter) + '</span>';
    return { time: fmt.dateTime(e.at), title: title, body: e.note, state: stateForOutcome(e.outcome, e.code), actor: { name: e.actor, kind: e.kind === 'person' ? 'person' : e.kind }, href: '#/assurance/proof/' + e.seq, meta: meta };
  }
  function synthObject(id) {
    return { id: id, type: 'Record', title: id, decl: 'erp.ar', ver: 7, host: 'search?q=' + encodeURIComponent(id), pinned: [], synthetic: true };
  }
  reg('/records/object/:id', {
    title: function (p) { var o = OX[p.id]; return o ? o.title : p.id; }, section: 'objects', crumbs: [R, ['Objects', '#/records/objects']], example: '/records/object/SINV-2026-01187', keywords: 'governed timeline pinned fields',
    render: function (p, q) {
      var o = OX[p.id] || synthObject(p.id), list = proofFor(o.id), path = '/records/object/' + encodeURIComponent(o.id);
      var view = q.view === 'table' ? 'table' : 'timeline';
      var d = DX[o.decl];
      var actions = stateMenu(path, [['error', 'ERPNext unreachable'], ['empty', 'No governed writes yet']]) +
        (o.reverse && q.state !== 'empty' ? c.button('Reverse this', { icon: 'undo', href: '#/work/reverse/' + encodeURIComponent(o.id) }) : '') +
        (o.host ? hostBtn('Open in ERPNext', o.host, { kind: 'primary' }) : '');
      var head = c.pageHeader({
        title: o.title, eyebrow: o.type + ' · ' + o.decl + ' v' + o.ver,
        lead: 'Current state from ERPNext, the fields this declaration pins, and every governed write that touched this record — including refusals and escalations.',
        back: ['Objects', '#/records/objects'], actions: actions,
        meta: '<span class="rec-meta"><span>Declaration <a class="rec-mono" href="#/records/declarations/' + esc(o.decl) + '/v/' + o.ver + '">' + esc(o.decl) + ' v' + o.ver + '</a></span>' + (d ? '<span>Owner role <b>' + esc(d.owner) + '</b></span>' : '') + '<span>Tenant <b>' + esc(tenantShort()) + '</b></span></span>'
      });
      if (q.state === 'empty') list = [];
      var pinnedBody;
      if (q.state === 'error') pinnedBody = c.error({ title: 'We cannot reach ERPNext to show current values.', body: 'The governed history below is complete and comes from the proof chain.', reassurance: 'Nothing about this record has changed because of this error.', code: 'PLATFORM.TARGET_UNREACHABLE' });
      else if (o.absent) pinnedBody = c.empty({ compact: true, icon: 'records', title: 'There is no record in ERPNext.', why: o.absent, fill: 'A refusal writes a proof entry with a zero record id, so the attempt is still on the timeline.' });
      else if (!o.pinned.length) pinnedBody = c.empty({ compact: true, icon: 'records', title: 'No pinned fields for this record.', why: 'We found no declaration that pins fields for “' + o.id + '”. Its current values live only in ERPNext.', action: o.host ? hostBtn('Open in ERPNext', o.host) : null });
      else pinnedBody = c.kv(o.pinned.map(function (x) { return [x[0], x[1], { mono: !!x[2] }]; })) + '<p class="rec-table-note">Pinned from ' + esc(o.decl) + ' v' + o.ver + ' · read from ERPNext ' + esc(fmt.rel(E1.ago(1))) + ' · not a copy</p>';
      var timeline;
      if (!list.length) timeline = c.empty({ icon: 'history', title: 'No governed write has touched this record yet.', why: 'Changes made directly in ERPNext before elan1 was connected are not shown here.', fill: 'The first write, refusal or escalation that names this record starts its timeline.', action: o.host ? hostBtn('Open in ERPNext', o.host) : { label: 'All objects', href: '#/records/objects' } });
      else if (view === 'table') timeline = c.table({
        caption: 'Governed writes on ' + o.title, rowHref: function (e) { return '#/assurance/proof/' + e.seq; },
        columns: [
          { key: 'seq', label: 'Proof', html: true, render: function (e) { return '<span class="rec-mono">' + seqTxt(e.seq) + '</span>'; } },
          { key: 'at', label: 'When', nowrap: true, render: function (e) { return esc(fmt.dateTime(e.at)); } },
          { key: 'wt', label: 'Write type', html: true, render: function (e) { return esc(wtLabel(e.wt)) + '<div class="rec-small rec-mono rec-muted">' + esc(e.wt) + '</div>'; } },
          { key: 'actor', label: 'Actor', html: true, render: function (e) { return c.actor({ name: e.actor, kind: e.kind, size: 'sm', href: actorHref(e.actor) }); } },
          { key: 'outcome', label: 'Outcome', html: true, render: function (e) { return c.outcome(e.outcome, { code: e.code }); } },
          { key: 'meter', label: 'Meter', render: function (e) { return '<span class="rec-mono rec-small">' + esc(e.meter) + '</span>'; } }
        ], rows: list
      });
      else timeline = c.timeline(list.map(function (e) { return tlItem(e, o); }));
      var counts = list.reduce(function (a, e) { a[e.outcome] = (a[e.outcome] || 0) + 1; return a; }, {});
      var side = c.card({ title: 'Pinned fields', eyebrow: 'Current state', body: pinnedBody }) +
        (o.reverse && list.length ? c.card({ title: 'Reverse this', body: '<p class="rec-small" style="margin:0 0 10px">' + esc(o.reverse.how) + '. Available until ' + esc(o.reverse.until) + '. A reversal is a governed write with its own proof.</p>' + c.button('Reverse this', { icon: 'undo', href: '#/work/reverse/' + encodeURIComponent(o.id), full: true }) }) : '') +
        c.card({ title: 'Why refusals are here', body: '<p class="rec-small" style="margin:0">A timeline of successes only is a timeline that lies by omission. Every refusal and escalation that named this record is listed, metered at zero.</p>' });
      return page(head,
        '<div class="rec-split"><div class="rec-stack">' +
        c.section({ id: 'timeline', title: 'Governed timeline', lead: list.length ? (list.length + ' entries, newest first · ' + [counts.committed ? counts.committed + ' committed' : '', counts.refused ? counts.refused + ' not done' : '', counts.escalated ? counts.escalated + ' waiting on a person' : ''].filter(Boolean).join(' · ')) : null,
          actions: list.length ? c.segmented([{ id: 'timeline', label: 'Timeline', href: E1.href(path, { state: q.state }), icon: 'history' }, { id: 'table', label: 'Table', href: E1.href(path, { view: 'table', state: q.state }), icon: 'rows' }], view, { label: 'View', size: 'sm' }) : '', body: timeline }) +
        '</div><div class="rec-stack">' + side + '</div></div>'
      );
    }
  });

  /* ========================================================================
     DECLARATIONS
     ======================================================================== */
  var STATUS = { certified: ['good', 'Certified'], in_validation: ['info', 'In validation'], draft: ['neutral', 'Draft'], superseded: ['neutral', 'Superseded'], withdrawn: ['neutral', 'Withdrawn'] };
  function declStatus(d) {
    var dr = studioDraft(d.id, true);
    if (dr && dr.certified) return c.badge('good', 'Certified · v' + dr.version);
    if (d.status === 'certified' && d.draft) return c.badge('good', 'Certified') + ' <span class="rec-small rec-muted">v' + d.draft + ' in validation</span>';
    var s = STATUS[d.status] || STATUS.draft; return c.badge(s[0], s[1]);
  }
  function curVer(d) { var dr = studioDraft(d.id, true); return dr && dr.certified && DX[d.id] ? dr.version : d.current; }
  function lastCert(d) { var v = d.versions.filter(function (x) { return !x.draft; }); return v[v.length - 1]; }
  reg('/records/declarations', {
    title: 'Declarations', section: 'declarations', keywords: 'ontology seven blocks certified version',
    render: function (p, q) {
      var path = '/records/declarations';
      var head = c.pageHeader({
        tabs: sibTabs('declarations'), title: 'Declarations', eyebrow: 'Records · declare',
        lead: 'What may change, and how: each declaration names the thing, its shape, who may change it, through which write types, under which gates, proving which fields, over which channels.',
        actions: stateMenu(path, [['empty', 'Empty — no declaration yet'], ['error', 'Error'], ['loading', 'Loading']]) + c.button('Compare versions', { href: '#/records/declarations/erp.ar/compare?from=6&to=7', icon: 'git-branch' }) + c.button('New declaration', { kind: 'primary', icon: 'plus', href: '#/records/studio/new' })
      });
      if (q.state === 'loading') return page(head, c.skeleton({ kind: 'table', rows: 6 }));
      if (q.state === 'error') return page(head, errorState('your declarations'));
      if (q.state === 'empty') return page(head, c.empty({ icon: 'file-text', title: 'No declaration yet.', why: 'A module without a declaration has no screens, because there is nothing to render.', fill: 'Author one in the Declaration Studio: seven blocks, validated, simulated against the reference tenant and certified by a named person.', action: { label: 'Open the Studio', href: '#/records/studio/new', kind: 'primary' } }));
      var rows = DECLS.filter(function (d) { return (!q.system || d.sor === q.system) && (!q.status || d.status === q.status); });
      var counts = { certified: 0, draft: 0 }; DECLS.forEach(function (d) { counts[d.status] = (counts[d.status] || 0) + 1; });
      var chips = c.filters([
        { label: 'All', href: E1.href(path, { system: q.system }), active: !q.status, count: DECLS.length },
        { label: 'Certified', href: E1.href(path, { status: 'certified', system: q.system }), active: q.status === 'certified', count: counts.certified },
        { label: 'Draft', href: E1.href(path, { status: 'draft', system: q.system }), active: q.status === 'draft', count: counts.draft }
      ], { label: 'Status', clearHref: (q.status || q.system) ? '#' + path : null }) +
        c.filters([{ label: 'Any system', href: E1.href(path, { status: q.status }), active: !q.system }, { label: 'ERPNext', href: E1.href(path, { system: 'erpnext', status: q.status }), active: q.system === 'erpnext' }, { label: 'elan1 platform', href: E1.href(path, { system: 'elan1', status: q.status }), active: q.system === 'elan1' }], { label: 'System of record' });
      var tbl = c.table({
        caption: 'Declarations', rowHref: function (d) { return '#/records/declarations/' + d.id; },
        empty: { title: 'No declaration matches this filter', why: 'Try another status or system of record.', action: { label: 'Show all', href: '#' + path } },
        columns: [
          { key: 'name', label: 'Name', html: true, render: function (d) { return '<strong>' + esc(d.name) + '</strong><div class="rec-small rec-mono rec-muted">' + esc(d.id) + ' · slug ' + esc(d.slug) + '</div>'; } },
          { key: 'owner', label: 'Owner role' },
          { key: 'sor', label: 'System', render: function (d) { return '<span class="rec-small">' + (d.sor === 'erpnext' ? 'ERPNext' : 'elan1') + ' · ' + esc(d.residency) + '</span>'; } },
          { key: 'current', label: 'Certified version', render: function (d) { return d.current ? mono('v' + d.current) : '<span class="rec-muted">none</span>'; } },
          { key: 'by', label: 'Certified by', html: true, render: function (d) { var v = lastCert(d); return v ? c.actor({ name: v.by, kind: 'person', size: 'sm', role: fmt.date(v.at) }) : '<span class="rec-muted rec-small">Not certified</span>'; } },
          { key: 'n', label: 'Write types', align: 'right', render: function (d) { return mono(declWts(d.id).length || (d.status === 'draft' ? 2 : 0)); } },
          { key: 'status', label: 'Status', html: true, render: function (d) { return declStatus(d); } }
        ], rows: rows
      });
      return page(head, chips + tbl +
        c.callout({ kind: 'rule', title: 'There is no such thing as a small change to a governed declaration.', body: '<p>Versions are integers, exactly last + 1, kept verbatim for ever. A typo fix is a new version, validated, simulated and certified by a named person who is not its author.</p>' }));
    }
  });

  /* Block model for any declaration (erp.ar is fully specified; others are derived from their write types). */
  function blocksFor(d) {
    var wts = declWts(d.id);
    if (d.id === 'erp.ar') return { shape: AR_SHAPE, links: AR_LINKS, grants: AR_GRANTS, gates: AR_GATES, channels: AR_CHANNELS, wts: wts };
    var gset = {}; wts.forEach(function (w) { w.gates.forEach(function (g) { gset[g] = true; }); });
    var gates = {}; GATE_ORDER.forEach(function (g) { if (gset[g]) gates[g] = { on: true, params: GATES[g].asserts, asof: 'posting_date' }; else if (!GATES[g].never) gates[g] = { on: false, params: 'not used by these write types', adr: 'ADR-01' + (20 + GATE_ORDER.indexOf(g)), asof: '—' }; });
    var shape = [{ f: 'name', type: 'string', card: 'one', req: true, cls: 'internal', bound: true }, { f: 'party', type: 'reference', card: 'one', req: true, cls: 'internal', bound: true }, { f: 'posting_date', type: 'date', card: 'one', req: true, cls: 'internal', bound: true }, { f: 'amount', type: 'decimal', card: 'one', req: false, cls: 'financial', bound: true }, { f: 'status', type: 'enum', card: 'one', req: true, cls: 'internal', bound: false }];
    var chset = {}; wts.forEach(function (w) { Object.keys(w.ch).forEach(function (k) { chset[k] = true; }); });
    var channels = CHANNELS.filter(function (ch) { return chset[ch.id]; }).map(function (ch) { return { name: ch.name, kind: ch.kind, wts: wts.filter(function (w) { return w.ch[ch.id]; }).map(function (w) { return w.name; }).join(' · '), approve: ch.id !== 'api' && ch.id !== 'mcp', mode: 'enforced' }; });
    var grants = wts.map(function (w) { return { kind: 'human', role: d.owner, wt: w.name, min: 'A4', approve: true }; });
    return { shape: shape, links: [], grants: grants, gates: gates, channels: channels, wts: wts };
  }
  function dispHtml(v) {
    if (v && typeof v === 'object' && v.nm) return '<span class="rec-nm"><b>Not measured.</b> ' + esc(v.reason) + '<br><b>Would change if:</b> ' + esc(v.wci) + '</span>';
    if (v && typeof v === 'object' && v.oos) return c.tooltip('<span class="rec-disp rec-disp--oos">' + c.icon('eye-off', 12) + ' Hidden</span>', 'Out of scope by decision ' + v.oos);
    return esc(v);
  }
  function blockCard(n, key, title, sub, body, extra) {
    return '<section class="rec-block" id="blk-' + key + '" aria-labelledby="blk-' + key + '-t"><header class="rec-block__head"><span class="rec-block__n">' + n + '</span><div><h3 class="rec-block__t" id="blk-' + key + '-t">' + esc(title) + ' <span class="rec-mono rec-quiet" style="font-size:12px;font-weight:400">' + key + '</span></h3><p class="rec-block__s">' + esc(sub) + '</p></div>' + (extra ? '<span class="rec-block__x">' + extra + '</span>' : '') + '</header><div class="rec-block__body">' + body + '</div></section>';
  }
  function sentenceHtml(d, B, path) {
    function a(key, txt, n) { return '<a href="' + esc('#' + path) + '" data-scrollto="blk-' + key + '">' + txt + '</a><small>' + n + '</small>'; }
    var fin = B.shape.filter(function (f) { return f.cls === 'financial'; }).length, bound = B.shape.filter(function (f) { return f.bound; }).length;
    var agents = B.grants.filter(function (g) { return g.kind === 'agent'; }).length, roles = B.grants.filter(function (g) { return g.kind === 'human'; }).length;
    var gcount = Object.keys(B.gates).filter(function (g) { return B.gates[g].on; }).length;
    return '<p class="rec-sentence">This thing — ' + a('identity', esc(d.recordType) + ' in ' + (d.sor === 'erpnext' ? 'ERPNext' : 'elan1') + ', owned by the ' + esc(d.owner), 1) + ' — ' +
      'shaped this way — ' + a('shape', B.shape.length + ' fields, ' + fin + ' financial', 2) + ' — ' +
      'may be changed by these actors — ' + a('permissions', (agents ? agents + ' agents and ' : '') + roles + ' roles of people', 3) + ' — ' +
      'through these write types — ' + a('write_types', B.wts.length + ' declared', 4) + ' — ' +
      'subject to these gates — ' + a('gates', gcount + ' in declared order', 5) + ' — ' +
      'proving these fields — ' + a('proof_binding', bound + ' bound into the payload hash', 6) + ' — ' +
      'over these channels — ' + a('channels', B.channels.map(function (ch) { return ch.name; }).join(', '), 7) + '.</p>';
  }
  function sevenBlocks(d, B, ver) {
    var ident = c.kv([['declaration_id', 'd-' + hex(d.id, 8) + '-' + hex(d.id + 'x', 4), { mono: true }], ['name', d.name], ['slug', d.slug, { mono: true }], ['owner_role', d.owner + ' — a role, not a person; people leave'], ['residency_domain', d.residency, { mono: true }], ['system_of_record', d.sor, { mono: true }], ['lexicon_ref', '<a class="rec-mono" href="#/records/lexicon">' + esc(d.lexicon) + '</a>', { html: true }], ['description', d.description]], { cols: 2 });
    var shape = '<p class="rec-small rec-muted" style="margin:0 0 10px">record_type <span class="rec-mono">' + esc(d.recordType) + '</span> (ERPNext DocType)</p>' + c.table({
      caption: 'Shape fields', dense: true, columns: [
        { key: 'f', label: 'Field', mono: true }, { key: 'type', label: 'Type', mono: true }, { key: 'card', label: 'Cardinality', mono: true },
        { key: 'req', label: 'Required', render: function (f) { return f.req ? 'Yes' : 'No'; } },
        { key: 'cls', label: 'Classification', render: function (f) { return tag(esc(f.cls), f.cls === 'financial' || f.cls === 'personal' ? 'accent' : ''); } },
        { key: 'bound', label: 'In proof', html: true, render: function (f) { return f.bound ? c.badge('good', 'Bound', { subtle: true }) : f.adr ? c.tooltip('<span class="rec-disp rec-disp--oos">' + c.icon('eye-off', 12) + ' Not bound</span>', 'Out of scope by decision ' + f.adr) : '<span class="rec-muted rec-small">Not bound</span>'; } }
      ], rows: B.shape
    }) + (B.links.length ? '<p class="rec-small" style="margin:10px 0 0"><span class="rec-label">Links</span> ' + B.links.map(function (l) { return mono(l[0]) + ' → ' + esc(l[1]) + ' (' + l[2] + ')'; }).join(' · ') + '</p>' : '');
    var perms = c.table({ caption: 'Permission grants', dense: true, columns: [
      { key: 'kind', label: 'Actor kind', render: function (g) { return esc(kindWord(g.kind)); } }, { key: 'role', label: 'Role or actor' },
      { key: 'wt', label: 'Write types', render: function (g) { return '<span class="rec-mono rec-small">' + esc(g.wt) + '</span>'; } },
      { key: 'min', label: 'Min autonomy', render: function (g) { return c.autonomy(g.min, { compact: true }); } },
      { key: 'approve', label: 'May approve', render: function (g) { return g.approve ? 'Yes' : 'No'; } }
    ], rows: B.grants }) + '<p class="rec-table-note">may_approve is never true for an agent. A control an actor may not use is not rendered at all.</p>';
    var wts = c.table({ caption: 'Write types', dense: true, rowHref: function (w) { return '#/records/write-types/' + w.name; }, columns: [
      { key: 'label', label: 'Write type', html: true, render: function (w) { return esc(w.label) + '<div class="rec-small rec-mono rec-muted">' + esc(w.name) + '</div>'; } },
      { key: 'blast', label: 'Blast radius', html: true, render: function (w) { return c.blast(w.blast, { compact: true }); } },
      { key: 'dual', label: 'Dual control' },
      { key: 'rev', label: 'Reversal', html: true, render: function (w) { return w.rev ? c.reversible(w.rev.h || true) + '<div class="rec-small rec-mono rec-muted">' + esc(w.rev.m) + '</div>' : c.reversible(false); } },
      { key: 'gates', label: 'Gates', render: function (w) { return '<span class="rec-mono rec-small">' + w.gates.length + '</span>'; } }
    ], rows: B.wts, empty: { title: 'No write type is declared', why: 'A draft may exist before its write types do. It cannot be certified in this state.' } });
    var gates = c.table({ caption: 'Gates', dense: true, columns: [
      { key: 'g', label: 'Gate', html: true, render: function (r) { return '<span class="rec-mono rec-muted">' + GATES[r.k].g + '</span> ' + esc(GATES[r.k].name); } },
      { key: 'on', label: 'Enabled', html: true, render: function (r) { return r.v.on ? 'Yes' : 'No' + (r.v.adr ? ' · ' + c.tooltip(mono(r.v.adr), 'Disabled by decision ' + r.v.adr) : ''); } },
      { key: 'never', label: 'Skippable', render: function (r) { return GATES[r.k].never ? tag(c.icon('lock', 11) + ' never', 'lock') : 'yes (commercial)'; } },
      { key: 'params', label: 'params', html: true, render: function (r) { return '<span class="rec-small">' + dispHtml(r.v.params) + '</span>'; } },
      { key: 'codes', label: 'refusal_codes', render: function (r) { return '<span class="rec-mono rec-small">' + GATES[r.k].codes.map(function (x) { return x.replace('GATE.', ''); }).join(', ') + '</span>'; } }
    ], rows: GATE_ORDER.filter(function (k) { return B.gates[k]; }).map(function (k) { return { k: k, v: B.gates[k] }; }) });
    var bound = B.shape.filter(function (f) { return f.bound; }).map(function (f) { return mono(f.f); }).join(', ');
    var pb = c.kv([['fields[] → F14', bound || '—', { html: true }], ['canonicalisation', 'elan1_lp_v1', { mono: true }], ['salt_scope', 'per_record', { mono: true }], ['redaction_profile', dispHtml({ oos: 'ADR-0107' }) + ' <span class="rec-small rec-muted">ignored at L1</span>', { html: true }]], { cols: 1 });
    var ch = c.table({ caption: 'Channels', dense: true, columns: [
      { key: 'name', label: 'Channel' }, { key: 'kind', label: 'kind', mono: true },
      { key: 'wts', label: 'write_types', render: function (x) { return '<span class="rec-small rec-mono">' + esc(x.wts) + '</span>'; } },
      { key: 'approve', label: 'may_approve', render: function (x) { return x.approve ? 'Yes' : 'No'; } },
      { key: 'mode', label: 'mode', html: true, render: function (x) { return x.mode === 'enforced' ? c.badge('good', 'Enforced', { subtle: true, icon: 'lock' }) : c.badge('info', 'Attested advisory', { subtle: true }); } }
    ], rows: B.channels }) + '<p class="rec-table-note">A blank cell means the action cannot be attempted from that route. It is not a permission question.</p>';
    return blockCard(1, 'identity', 'Identity', 'This thing', ident) + blockCard(2, 'shape', 'Shape', 'shaped this way', shape) + blockCard(3, 'permissions', 'Permissions', 'may be changed by these actors', perms) +
      blockCard(4, 'write_types', 'Write types', 'through these write types', wts) + blockCard(5, 'gates', 'Gates', 'subject to these gates', gates) + blockCard(6, 'proof_binding', 'Proof binding', 'proving these fields', pb) + blockCard(7, 'channels', 'Channels', 'over these channels', ch);
  }
  function versionTable(d) {
    var dr = studioDraft(d.id, true);
    var rows = d.versions.slice().reverse().map(function (v) {
      if (v.draft && dr && dr.certified && dr.version === v.v) return Object.assign({}, v, { change: v.change.replace(/; awaiting certification.*$/, '.'), draft: false, by: dr.certified.by, at: '2026-09-24', seq: dr.certified.seq, digest: dg('3b9e', 'c41d') });
      return v;
    });
    return c.table({ caption: 'Version history', rowHref: function (v) { return '#/records/declarations/' + d.id + '/v/' + v.v; }, columns: [
      { key: 'v', label: 'Version', html: true, render: function (v) { var cv = curVer(d); return mono('v' + v.v) + (v.v === cv && !v.draft ? ' ' + c.badge('good', 'In force', { subtle: true }) : v.draft ? ' ' + c.badge('neutral', 'Draft', { subtle: true }) : (v.v < cv ? ' ' + c.badge('neutral', 'Superseded', { subtle: true, icon: false }) : '')); } },
      { key: 'by', label: 'Certified by', html: true, render: function (v) { return v.by ? c.actor({ name: v.by, kind: 'person', size: 'sm' }) : '<span class="rec-muted rec-small">Not certified</span>'; } },
      { key: 'at', label: 'Date', nowrap: true, render: function (v) { return v.at ? esc(fmt.date(v.at)) : '—'; } },
      { key: 'digest', label: 'Compiled digest', html: true, render: function (v) { return v.digest ? hashc(v.digest, 'Compiled digest') : '<span class="rec-muted">—</span>'; } },
      { key: 'sup', label: 'Supersedes', render: function (v) { return v.sup ? mono('v' + v.sup) : '—'; } },
      { key: 'seq', label: 'Certification', html: true, render: function (v) { return v.seq ? seqLink(v.seq) : (v.draft && d.id === 'erp.ar' ? '<a class="rec-mono" href="#/work/decide/OB-2026-0424">OB-2026-0424</a>' : '—'); } },
      { key: 'change', label: 'Change', render: function (v) { return '<span class="rec-small">' + esc(v.change) + '</span>'; } }
    ], rows: rows });
  }
  function renderDecl(d, ver, q) {
    var B = blocksFor(d);
    var vObj = d.versions.filter(function (v) { return v.v === ver; })[0];
    var isDraft = !vObj || vObj.draft;
    var dr = studioDraft(d.id, true);
    if (vObj && vObj.draft && dr && dr.certified) isDraft = false;
    var path = '/records/declarations/' + d.id + (ver !== d.current ? '/v/' + ver : '');
    var cur = curVer(d);
    var superseded = !isDraft && cur && ver < cur;
    var cert = vObj && !isDraft ? (vObj.by ? vObj : { by: dr.certified.by, at: '2026-09-24', seq: dr.certified.seq, digest: dg('3b9e', 'c41d') }) : null;
    var head = c.pageHeader({
      title: d.name, eyebrow: 'Declaration · ' + d.id + ' v' + ver + (isDraft ? ' · draft' : superseded ? ' · superseded' : ' · in force'),
      lead: 'Read as one sentence, then block by block. Every field carries a value, an out-of-scope decision, or a sentence saying why it cannot be measured — never a blank.',
      back: ['Declarations', '#/records/declarations'],
      actions: c.button('Compare versions', { icon: 'git-branch', href: '#/records/declarations/' + d.id + '/compare?from=' + Math.max(1, ver - 1) + '&to=' + ver }) + c.button(isDraft ? 'Continue in Studio' : 'Edit as new version', { kind: 'primary', icon: 'edit', href: '#/records/studio/' + d.id + '?step=author' }),
      meta: (isDraft ? c.badge('neutral', 'Draft · not resolvable') : superseded ? c.badge('neutral', 'Superseded by v' + cur) : c.badge('good', 'Certified · in force')) + ' ' + tag('owner ' + esc(d.owner)) + ' ' + tag(esc(d.sor) + ' · ' + esc(d.residency), 'mono') + (d.policy ? ' ' + '<a class="rec-tag rec-tag--mono" href="#/records/policies/' + d.policy + '">policy ' + d.policy + '</a>' : '')
    });
    var banner = superseded ? c.callout({ kind: 'info', title: 'This version is superseded, and still resolves.', body: '<p>Writes pinned to v' + ver + ' keep resolving v' + ver + ', and records written under it still explain themselves. New intents must name v' + cur + '.</p>' }) :
      isDraft ? c.callout({ kind: 'caveat', title: 'Draft — nothing can be written under this version yet.', body: '<p>It becomes resolvable only after Validate, Simulate and Certify by a named person who is not its author. ' + (d.id === 'erp.ar' ? 'Certification is waiting on <a href="#/work/decide/OB-2026-0424">OB-2026-0424</a>.' : '') + '</p>' }) :
      c.callout({ kind: 'rule', body: '<p>Every version is kept verbatim, for ever. Records written under version ' + Math.max(1, ver - 1) + ' still explain themselves.</p>' });
    var certCard = cert ? c.card({ title: 'Certification record', body: c.kv([
      ['Certified by', c.actor({ name: cert.by, kind: 'person', role: cert.by === 'Arjun Mehta' ? 'elan1 lead, certifier' : 'elan1, certifier', href: '#/records/actors/' + (cert.by === 'Arjun Mehta' ? 'arjun-mehta' : 'kavya-menon') }), { html: true }],
      ['Author', c.actor({ name: d.id === 'platform' ? 'Arjun Mehta' : 'Farah Sheikh', kind: 'person', role: 'Declaration author (elan1)' }), { html: true }],
      ['Date', fmt.date(cert.at)],
      ['Governed write', 'platform.declaration.certify · dual control · irreversible', { mono: false }],
      ['Record', seqLink(cert.seq), { html: true }],
      ['Supersedes', vObj && vObj.sup ? 'v' + vObj.sup : 'nothing — first version', { mono: false }],
      ['Compiled digest', hashc(cert.digest, 'Compiled digest'), { html: true }],
      ['Surface plan', 'sp:' + d.slug + '@' + ver + '#' + short(cert.digest).replace('…', ''), { mono: true }]
    ], { cols: 2 }) + (E1.atLeast('L2') ? '' : '<p class="rec-table-note">' + c.level('L1', { short: true }) + ' The certification is a hash-chained record. It is not signed; that arrives at Assurance Level 2.</p>') }) :
      c.card({ title: 'Certification record', body: c.empty({ compact: true, icon: 'stamp', title: 'Not certified', why: 'A named person who is not the author must certify this version before anything can be written under it.', action: { label: 'Go to Certify', href: '#/records/studio/' + d.id + '?step=certify' } }) });
    var toc = c.toc([{ id: 'sentence', label: 'As one sentence' }, { id: 'blk-identity', label: '1 · identity' }, { id: 'blk-shape', label: '2 · shape' }, { id: 'blk-permissions', label: '3 · permissions' }, { id: 'blk-write_types', label: '4 · write_types' }, { id: 'blk-gates', label: '5 · gates' }, { id: 'blk-proof_binding', label: '6 · proof_binding' }, { id: 'blk-channels', label: '7 · channels' }, { id: 'versions', label: 'Version history' }]);
    return page(head, banner +
      c.card({ id: 'sentence', eyebrow: 'Read as one sentence', body: sentenceHtml(d, B, path) + '<p class="rec-table-note">“This thing, shaped this way, may be changed by these actors through these write types, subject to these gates, proving these fields, over these channels.” Each underlined phrase opens its block.</p>' }) +
      certCard + '<div>' + sevenBlocks(d, B, ver) + '</div>' +
      c.section({ id: 'versions', title: 'Version history', lead: 'Integers, exactly last + 1. Nothing resolves to “latest”.', actions: c.button('Compare two versions', { size: 'sm', icon: 'git-branch', href: '#/records/declarations/' + d.id + '/compare' }), body: versionTable(d) })
    );
  }
  function declOrSynth(id) {
    if (DX[id]) return DX[id];
    return { id: id, slug: String(id).replace(/[^a-z0-9_]/g, '_').slice(0, 48), name: id, owner: 'Not named', sor: 'erpnext', residency: 'in', current: null, status: 'draft', lexicon: LEXICON.ref, recordType: 'Unknown', description: 'No declaration is registered under this id.', versions: [], missing: true };
  }
  function missingDecl(id) {
    return c.pageHeader({ title: 'No declaration called “' + id + '”', eyebrow: 'Declarations', back: ['Declarations', '#/records/declarations'] }) +
      c.empty({ icon: 'file-text', title: 'No declaration is registered under this id.', why: 'Declarations are resolved by id and an explicit integer version. Nothing resolves to a near match or to “latest”.', action: [{ label: 'All declarations', href: '#/records/declarations' }, { label: 'Start one in the Studio', href: '#/records/studio/new' }] });
  }
  reg('/records/declarations/:id', {
    title: function (p) { return DX[p.id] ? DX[p.id].name : p.id; }, section: 'declarations', crumbs: [R, ['Declarations', '#/records/declarations']], example: '/records/declarations/erp.ar',
    render: function (p, q) { var d = DX[p.id]; if (!d) return missingDecl(p.id); return renderDecl(d, curVer(d) || d.draft, q); }
  });
  reg('/records/declarations/:id/v/:ver', {
    title: function (p) { return (DX[p.id] ? DX[p.id].id : p.id) + ' v' + p.ver; }, section: 'declarations', crumbs: [R, ['Declarations', '#/records/declarations']], example: '/records/declarations/erp.ar/v/6',
    render: function (p, q) {
      var d = DX[p.id]; if (!d) return missingDecl(p.id);
      var v = parseInt(p.ver, 10);
      if (!(v > 0) || !d.versions.filter(function (x) { return x.v === v; }).length) {
        var known = d.versions.map(function (x) { return 'v' + x.v; }).join(', ');
        return c.pageHeader({ title: d.id + ' v' + esc(p.ver), eyebrow: 'Declaration version', back: [d.name, '#/records/declarations/' + d.id] }) +
          c.empty({ icon: 'history', title: 'There is no version ' + p.ver + ' of ' + d.id + '.', why: 'Versions are exactly last + 1, so gaps are a rejection. Kept here: ' + known + '. Earlier versions are kept verbatim in the registry; this prototype shows the ones listed.', action: { label: 'Version history', href: '#/records/declarations/' + d.id } });
      }
      return renderDecl(d, v, q);
    }
  });

  var CLS = { Structural: ['info', 'Structural'], Tightening: ['good', 'Tightening'], Loosening: ['warning', 'Loosening'], Editorial: ['neutral', 'Editorial'] };
  reg('/records/declarations/:id/compare', {
    title: 'Compare versions', section: 'declarations', crumbs: [R, ['Declarations', '#/records/declarations']], example: '/records/declarations/erp.ar/compare?from=6&to=7',
    render: function (p, q) {
      var d = DX[p.id]; if (!d) return missingDecl(p.id);
      var vs = d.versions.map(function (v) { return v.v; });
      var to = parseInt(q.to, 10) || d.current || vs[vs.length - 1], from = parseInt(q.from, 10) || Math.max(vs[0], to - 1);
      if (from > to) { var t = from; from = to; to = t; }
      var changes = [];
      for (var v = from + 1; v <= to; v++) {
        if (d.id === 'erp.ar' && AR_CHANGES[v]) AR_CHANGES[v].forEach(function (ch) { changes.push(Object.assign({ v: v }, ch)); });
        else { var vo = d.versions.filter(function (x) { return x.v === v; })[0]; if (vo) changes.push({ v: v, b: 'summary', f: 'version ' + v, a: vo.change, cls: /tighten/i.test(vo.change) ? 'Tightening' : /loosen/i.test(vo.change) ? 'Loosening' : 'Structural' }); }
      }
      var opts = vs.map(function (x) { var vo = d.versions.filter(function (y) { return y.v === x; })[0]; return { value: x, label: 'v' + x + (vo.draft ? ' (draft)' : x === d.current ? ' (in force)' : '') }; });
      var picker = '<form class="rec-prop__row" data-rec-compare="' + esc(d.id) + '" style="align-items:flex-end">' +
        c.field('From', c.select({ id: 'cmp-from', name: 'from', options: opts, value: from }), { id: 'cmp-from' }) +
        c.field('To', c.select({ id: 'cmp-to', name: 'to', options: opts, value: to }), { id: 'cmp-to' }) +
        c.button('Compare', { kind: 'primary', type: 'submit', icon: 'git-branch' }) + '</form>';
      var tally = {}; changes.forEach(function (ch) { tally[ch.cls] = (tally[ch.cls] || 0) + 1; });
      var loosen = changes.filter(function (ch) { return ch.cls === 'Loosening'; });
      var head = c.pageHeader({ title: 'Compare ' + d.id + ' v' + from + ' → v' + to, eyebrow: 'Declaration · compare versions', lead: 'What changed between two certified versions, block by block. Loosening a gate needs a decision reference; nothing changes silently.', back: [d.name, '#/records/declarations/' + d.id] });
      var tbl = c.table({ caption: 'Changes', cls: 'rec-cmp', columns: [
        { key: 'v', label: 'In', render: function (r) { return '<a class="rec-mono" href="#/records/declarations/' + esc(d.id) + '/v/' + r.v + '">v' + r.v + '</a>'; } },
        { key: 'b', label: 'Block', render: function (r) { return '<span class="rec-mono rec-small">' + esc(r.b) + '</span>'; } },
        { key: 'f', label: 'Field', render: function (r) { return '<span class="rec-mono rec-small">' + esc(r.f) + '</span>'; } },
        { key: 'bf', label: 'Before', html: true, render: function (r) { return r.bf ? '<del class="rec-small">' + esc(r.bf) + '</del>' : '<span class="rec-muted rec-small">Not declared</span>'; } },
        { key: 'a', label: 'After', html: true, render: function (r) { return '<ins class="rec-small" style="text-decoration:none">' + esc(r.a) + '</ins>' + (r.note ? '<div class="rec-small rec-muted">' + esc(r.note) + '</div>' : ''); } },
        { key: 'cls', label: 'Change class', html: true, render: function (r) { var k = CLS[r.cls] || CLS.Structural; return c.badge(k[0], k[1], { subtle: true }) + (r.adr ? ' ' + c.tooltip(mono(r.adr), 'Loosening requires a decision reference') : ''); } }
      ], rows: changes, empty: { title: 'Nothing to compare', why: 'Choose two different versions. The same version compared with itself has no changes.' } });
      return page(head, c.card({ body: picker }) +
        (changes.length ? '<div class="rec-chips">' + Object.keys(tally).map(function (k) { return c.badge((CLS[k] || CLS.Structural)[0], tally[k] + ' ' + k.toLowerCase(), { subtle: true }); }).join('') + '<span class="rec-small rec-muted">Change classes: Editorial · Tightening · Loosening (+ADR) · Structural (new declaration version)</span></div>' : '') +
        (loosen.length ? c.callout({ kind: 'warning', title: 'This range loosens a gate.', body: '<p>' + loosen.map(function (l) { return '<span class="rec-mono">' + esc(l.f) + '</span> in v' + l.v + ' is justified by <span class="rec-mono">' + esc(l.adr || 'no ADR') + '</span>'; }).join('; ') + '. A loosening without a decision reference fails validation.</p>' }) : '') +
        tbl);
    }
  });

  /* ========================================================================
     DECLARATION STUDIO — author › validate › simulate › certify
     (E06 §06, E03 §06, spec F6). "You cannot skip forward."
     ======================================================================== */
  var S = { drafts: {} };
  var HONEST = 'An honest unknown needs a sentence. What would change your answer?';
  var BLOCKS = [['identity', 'Identity'], ['shape', 'Shape'], ['permissions', 'Permissions'], ['write_types', 'Write types'], ['gates', 'Gates'], ['proof_binding', 'Proof binding'], ['channels', 'Channels']];
  var STEPS = [['author', 'Author', 'Block by block'], ['validate', 'Validate', 'Against the block'], ['simulate', 'Simulate', 'Reference tenant'], ['certify', 'Certify', 'A named person']];
  var STAGE_N = { author: 0, validated: 1, simulated: 2, certified: 3 };
  var ROLES = ['Accounts head', 'Finance manager', 'Stores head', 'Owner', 'elan1 lead'];
  var CH_OPTS = [{ value: '', label: '—' }, { value: 'submit', label: 'submit' }, { value: 'approve', label: 'approve' }, { value: 'submit · approve', label: 'submit · approve' }, { value: 'approve by reply', label: 'approve by reply' }, { value: 'deep link only', label: 'deep link only' }];

  function V(val) { return { disp: 'value', val: val, adr: '', reason: '', wci: '' }; }
  function edWt(w) {
    return { name: w.name, label: w.label, intent: V(w.intent), blast: w.blast, dual: /^No$/.test(w.dual) ? 'no' : /Above/.test(w.dual) ? 'threshold' : 'always', threshold: (/₹([\d,]+)/.exec(w.dual) || [])[1] || '', gates: w.gates.slice(),
      rev: w.rev ? { mode: 'plan', method: w.rev.m === 'none' ? 'snapshot_restore' : w.rev.m, hours: w.rev.h || 24, after: w.rev.after, text: '' } : { mode: 'irreversible', method: 'snapshot_restore', hours: 24, after: 'compensating_entry', text: '' },
      ch: Object.assign({}, w.ch), isNew: false };
  }
  function seedDraft(id, over) {
    var d = DX[id];
    var base = d && d.current ? d.current : null;
    var dr = {
      id: id, name: (over && over.name) || (d ? d.name : id), version: d ? (d.draft || (d.current || 0) + 1) : 1, base: base, author: 'Farah Sheikh', stage: 'author', changed: false, sim: null, noFail: {}, extraFixture: {}, certAs: 'Farah Sheikh', certResult: null, certified: null,
      identity: {
        name: V((over && over.name) || (d ? d.name : id)), slug: V((over && over.slug) || (d ? d.slug : String(id).replace(/[^a-z0-9_]/g, '_'))), owner_role: V((over && over.owner) || (d ? d.owner : 'Accounts head')),
        residency_domain: V('in'), system_of_record: V('erpnext'), lexicon_ref: V(d ? d.lexicon : LEXICON.ref), description: V((over && over.description) || (d ? d.description : ''))
      },
      shape: (id === 'erp.ar' ? AR_SHAPE : blocksFor(declOrSynth(id)).shape).map(function (f) { return Object.assign({}, f, { adr: f.adr || '' }); }),
      grants: (id === 'erp.ar' ? AR_GRANTS : blocksFor(declOrSynth(id)).grants).map(function (g) { return Object.assign({}, g); }),
      wts: declWts(id).map(edWt),
      gates: {}, pb: { redaction: { disp: 'out_of_scope', val: '', adr: 'ADR-0107', reason: '', wci: '' }, canon: 'elan1_lp_v1' },
      chmode: { web: 'enforced', mobile: 'enforced', messaging: 'enforced', voice: 'enforced', api: 'enforced', mcp: 'enforced' }
    };
    var src = id === 'erp.ar' ? AR_GATES : blocksFor(declOrSynth(id)).gates;
    GATE_ORDER.forEach(function (k) {
      var g = src[k] || { on: GATES[k].never, params: GATES[k].asserts, adr: '' };
      var params = g.params && typeof g.params === 'object' && g.params.nm ? { disp: 'not_measurable', val: '', adr: '', reason: g.params.reason, wci: g.params.wci } : V(g.params || '');
      dr.gates[k] = { on: g.on !== false, params: params, adr: g.adr || '' };
    });
    if (id === 'erp.ar') {
      /* F6: Farah adds erp.sales_invoice.cancel to v8 and types "tbd" for its reversal plan. */
      dr.wts.push({ name: 'erp.sales_invoice.cancel', label: 'Cancel invoice', intent: V('Cancel an invoice.'), blast: 2, dual: 'always', threshold: '', gates: ['consent', 'residency', 'retention', 'counterparty', 'precondition', 'dual_control'],
        rev: { mode: 'undecided', method: 'target_native_undo', hours: 24, after: 'not_reversible', text: 'tbd' }, ch: { web: 'submit · approve', voice: 'approve' }, isNew: true });
      dr.gates.schedule.adr = '';
      dr.noFail['erp.customer.create'] = true;
    }
    if (!dr.wts.length) dr.wts.push({ name: 'erp.' + String(dr.identity.slug.val || 'record').replace(/^erp_/, '') + '.submit', label: '', intent: V(''), blast: 1, dual: 'no', threshold: '', gates: BASE5.slice(), rev: { mode: 'undecided', method: 'snapshot_restore', hours: 720, after: 'compensating_entry', text: '' }, ch: { web: 'submit · approve' }, isNew: true });
    return dr;
  }
  function studioDraft(id, peek) {
    if (S.drafts[id]) return S.drafts[id];
    if (peek) return null;
    S.drafts[id] = seedDraft(id);
    return S.drafts[id];
  }

  /* ---- validation ---- */
  function isHonestFail(v) { return /^(n\/?a|tbd|tba|todo|unknown|-|\?|none)$/i.test(String(v || '').trim()); }
  function propIssue(p, allowBlank) {
    if (!p) return null;
    if (p.disp === 'out_of_scope') return /^ADR-[0-9]{4}$/.test(String(p.adr || '').trim()) ? null : { rule: 'Three dispositions', text: 'Out of scope needs its decision reference, written ADR-nnnn (for example ADR-0142).' };
    if (p.disp === 'not_measurable') {
      if (isHonestFail(p.reason) || isHonestFail(p.wci)) return { rule: 'Three dispositions', text: HONEST };
      if (String(p.reason || '').trim().length < 12 || String(p.wci || '').trim().length < 12) return { rule: 'Three dispositions', text: 'Not measurable needs a reason and what would change it, each at least 12 characters. Anything shorter is “tbd” in a costume.' };
      return null;
    }
    if (isHonestFail(p.val)) return { rule: 'Three dispositions', text: HONEST };
    if (!allowBlank && !String(p.val || '').trim()) return { rule: 'Three dispositions', text: 'A blank is a validation failure, never a draft state. Give a value, scope it out with an ADR, or say why it cannot be measured.' };
    return null;
  }
  function shortWt(n) { return String(n || '').replace(/^erp\.|^platform\./, ''); }
  function validate(dr) {
    var fails = [], warns = [];
    function F(block, rule, text, where, fix) { fails.push({ block: block, rule: rule, text: text, where: where, fix: fix || {} }); }
    function Wn(block, rule, text, where, fix) { warns.push({ block: block, rule: rule, text: text, where: where, fix: fix || {} }); }
    Object.keys(dr.identity).forEach(function (k) { var i = propIssue(dr.identity[k]); if (i) F('identity', i.rule, i.text, 'identity · ' + k, { block: 'identity' }); });
    if (dr.identity.slug.disp === 'value' && !/^[a-z0-9_]{3,48}$/.test(dr.identity.slug.val || '')) F('identity', 'Schema', 'slug must match ^[a-z0-9_]{3,48}$ — lower-case letters, digits and underscores, 3 to 48 long.', 'identity · slug', { block: 'identity' });
    var names = {};
    dr.wts.forEach(function (w, i) {
      var nm = shortWt(w.name) || 'write type ' + (i + 1), fx = { block: 'write_types', wt: i };
      if (!/^[a-z0-9_]+(\.[a-z0-9_]+){1,3}$/.test(w.name || '')) F('write_types', 'Schema', nm + ' needs a name of the form <slug>.<verb>, 5–64 characters.', 'write_types · ' + nm + ' · name', fx);
      if (names[w.name]) F('write_types', 'Schema', 'Two write types are both called ' + w.name + '.', 'write_types · ' + nm, fx); names[w.name] = true;
      if (!String(w.label || '').trim()) F('write_types', 'Schema', nm + ' needs a label: the words an approver reads on the button and in the Decide header.', 'write_types · ' + nm + ' · label', fx);
      var ii = propIssue(w.intent); if (ii) F('write_types', ii.rule, nm + ' intent: ' + ii.text, 'write_types · ' + nm + ' · intent', fx);
      else if (w.intent.disp === 'value' && (String(w.intent.val).trim().length < 40 || String(w.intent.val).trim().toLowerCase() === String(w.label).trim().toLowerCase())) Wn('write_types', 'LN-05', nm + ': the intent is under 40 characters or repeats the label. Say what the write does, to whom, and why a person would want it.', 'write_types · ' + nm + ' · intent', fx);
      if (w.rev.mode === 'undecided') F('write_types', 'L0-S03', 'L0-S03 — ' + nm + ' declares neither a reversal plan nor irreversible: true. Every write type must say which it is.', 'write_types · ' + nm + ' · reversal_plan', fx);
      if (w.rev.mode === 'plan' && !(Number(w.rev.hours) > 0) && w.rev.method !== 'compensating_entry') F('write_types', 'L0-S03', nm + ': a reversal plan needs a window in hours greater than 0.', 'write_types · ' + nm + ' · reversal_plan.window_hours', fx);
      if (w.rev.mode === 'irreversible' && Number(w.blast) < 2) F('write_types', 'L0-S04', 'L0-S04 — ' + nm + ' is irreversible, so its blast radius must be One counterparty or wider.', 'write_types · ' + nm + ' · blast_radius', fx);
      if (Number(w.blast) >= 4 && w.dual === 'no') F('write_types', 'L0-S05', 'L0-S05 — ' + nm + ' touches ' + (w.blast == 5 ? 'across an organisation boundary' : 'the whole tenant') + ', which forces dual control.', 'write_types · ' + nm + ' · dual_control', fx);
      if (Number(w.blast) === 5 && !dr.shape.some(function (f) { return f.bound; })) F('proof_binding', 'L0-S06', 'L0-S06 — ' + nm + ' crosses an organisation boundary, so proof_binding must not be empty.', 'proof_binding · fields', { block: 'proof_binding' });
      BASE5.forEach(function (g) { if (w.gates.indexOf(g) < 0) F('write_types', 'Never-skippable gate', nm + ' does not run ' + GATES[g].name + ' (' + GATES[g].g + '), a gate that can never be skipped. Add it in its declared place.', 'write_types · ' + nm + ' · gates', fx); });
      if (w.dual !== 'no' && w.gates.indexOf('dual_control') < 0) F('write_types', 'Never-skippable gate', nm + ' declares dual control but does not run the Dual control gate (G4).', 'write_types · ' + nm + ' · gates', fx);
      w.gates.forEach(function (g) { if (dr.gates[g] && !dr.gates[g].on) F('gates', 'L0-S02', 'L0-S02 — ' + nm + ' names ' + GATES[g].name + ', which is disabled in the gates block.', 'gates · ' + g, { block: 'gates' }); });
      var onAny = Object.keys(w.ch || {}).some(function (k) { return w.ch[k]; });
      if (!onAny) F('channels', 'L0-S10', 'L0-S10 — ' + nm + ' is not carried by any channel, so it could never be attempted.', 'channels · ' + nm, { block: 'channels' });
      if (w.rev.mode === 'irreversible' && w.ch && w.ch.messaging === 'approve by reply') F('channels', 'Channel rule', nm + ' is irreversible; WhatsApp reply-approval is only for one-record, reversible write types.', 'channels · WhatsApp · ' + nm, { block: 'channels' });
    });
    dr.grants.forEach(function (g) { if (g.kind === 'agent' && g.approve) F('permissions', 'L0-S11', 'L0-S11 — ' + g.role + ' is an agent, and may_approve is never true for an agent. Resolver sets contain humans only.', 'permissions · ' + g.role, { block: 'permissions' }); });
    GATE_ORDER.forEach(function (k) {
      var g = dr.gates[k];
      if (!g.on && GATES[k].never && dr.wts.some(function (w) { return w.gates.indexOf(k) >= 0; })) F('gates', 'Never-skippable gate', GATES[k].name + ' is never skippable and cannot be disabled.', 'gates · ' + k, { block: 'gates' });
      if (!g.on && !GATES[k].never && !/^ADR-[0-9]{4}$/.test(String(g.adr || '').trim())) Wn('gates', 'LN-07', GATES[k].name + ' is disabled without an ADR. Say which decision turned it off.', 'gates · ' + k + ' · adr', { block: 'gates' });
      if (g.on) { var pi = propIssue(g.params, !GATES[k].never); if (pi) F('gates', pi.rule, GATES[k].name + ' params: ' + pi.text, 'gates · ' + k + ' · params', { block: 'gates' }); }
    });
    dr.shape.forEach(function (f) { if ((f.cls === 'financial' || f.cls === 'personal') && !f.bound && !/^ADR-[0-9]{4}$/.test(String(f.adr || '').trim())) Wn('proof_binding', 'LN-06', f.f + ' is ' + f.cls + ' and absent from proof_binding with no ADR.', 'proof_binding · ' + f.f, { block: 'proof_binding' }); });
    var pr = propIssue(dr.pb.redaction, true); if (pr) F('proof_binding', pr.rule, 'redaction_profile: ' + pr.text, 'proof_binding · redaction_profile', { block: 'proof_binding' });
    var lines = lineCount(dr);
    if (lines > 900) Wn('identity', 'LN-01', 'This declaration is ' + num(lines) + ' lines. It has become a program. Split it.', 'whole declaration', { block: 'identity' });
    return { fails: fails, warns: warns, lines: lines, valid: !fails.length };
  }
  function lineCount(dr) { try { return JSON.stringify({ i: dr.identity, s: dr.shape, p: dr.grants, w: dr.wts, g: dr.gates, b: dr.pb, c: dr.chmode }, null, 2).split('\n').length; } catch (e) { return 0; } }
  function blockIssues(res, key) { return { f: res.fails.filter(function (x) { return x.block === key; }).length, w: res.warns.filter(function (x) { return x.block === key; }).length }; }

  /* ---- model access ---- */
  function target(dr, path) {
    var s = path.split('.');
    switch (s[0]) {
      case 'identity': return { o: dr.identity[s[1]], prop: true };
      case 'wt': var w = dr.wts[+s[1]]; if (!w) return null; if (s[2] === 'intent') return { o: w.intent, prop: true }; if (s[2] === 'rev') return { o: w.rev }; return { o: w, k: s[2] };
      case 'gates': var g = dr.gates[s[1]]; if (s[2] === 'params') return { o: g.params, prop: true }; return { o: g, k: s[2] };
      case 'pb': if (s[1] === 'redaction') return { o: dr.pb.redaction, prop: true }; return { o: dr.pb, k: s[1] };
      case 'shape': return { o: dr.shape[+s[1]], k: s[2] };
      case 'grants': return { o: dr.grants[+s[1]], k: s[2] };
      case 'ch': return { o: dr.wts[+s[1]].ch, k: s[2] };
      case 'chmode': return { o: dr.chmode, k: s[1] };
    }
    return null;
  }
  function setVal(dr, path, f, v) {
    var t = target(dr, path); if (!t || !t.o) return;
    if (t.prop || path.split('.')[2] === 'rev') t.o[f || 'val'] = v; else t.o[t.k] = v;
    if (dr.stage !== 'author' || dr.sim) { dr.changed = dr.stage !== 'author'; dr.stage = 'author'; dr.sim = null; dr.certResult = null; }
  }
  function pid(path) { return 'rp-' + path.replace(/[^a-z0-9]/gi, '-'); }

  /* ---- render pieces ---- */
  function stepNav(dr, cur, id) {
    var reach = STAGE_N[dr.stage] || 0, res = validate(dr);
    return '<nav aria-label="Studio steps" class="rec-snavwrap"><ol class="rec-snav">' + STEPS.map(function (s, i) {
      var open = i === 0 || i === 1 || (i === 2 && reach >= 1) || (i === 3 && reach >= 2);
      var done = (i === 0 && reach >= 1) || (i === 1 && reach >= 1) || (i === 2 && reach >= 2) || (i === 3 && !!dr.certified);
      var why = i === 2 ? 'Validate first' : i === 3 ? 'Simulate first' : '';
      var inner = '<span class="rec-snav__n">' + (done ? c.icon('check', 12) : i + 1) + '</span><span class="rec-snav__t"><b>' + s[1] + '</b><small>' + (open ? s[2] : why) + '</small></span>';
      var cls = 'rec-snav__i' + (s[0] === cur ? ' is-current' : '') + (done ? ' is-done' : '') + (!open ? ' is-locked' : '');
      return '<li class="' + cls + '">' + (open ? '<a href="#/records/studio/' + esc(id) + '?step=' + s[0] + '"' + (s[0] === cur ? ' aria-current="step"' : '') + '>' + inner + '</a>' : '<span aria-disabled="true" title="' + esc(why) + '">' + inner + (i ? '<span class="e1-sr"> — locked: ' + esc(why) + '</span>' : '') + '</span>') + '</li>';
    }).join('') + '</ol></nav>';
  }
  function stripHtml(dr) {
    var res = validate(dr);
    return '<div class="rec-strip" id="rec-strip">' +
      '<span class="rec-strip__i">' + c.badge(dr.certified ? 'good' : 'neutral', dr.certified ? 'Certified · v' + dr.version : 'Draft · v' + dr.version, { subtle: true }) + '</span>' +
      (dr.base ? '<span class="rec-strip__i rec-small">based on <a class="rec-mono" href="#/records/declarations/' + esc(dr.id) + '/v/' + dr.base + '">v' + dr.base + '</a></span>' : '<span class="rec-strip__i rec-small">first version</span>') +
      '<span class="rec-strip__i rec-small">author ' + c.actor({ name: dr.author, kind: 'person', size: 'sm' }) + '</span>' +
      '<span class="rec-strip__i rec-small ' + (res.lines > 900 ? 'e1-tone--warning' : '') + '"><span class="rec-mono">' + num(res.lines) + '</span> of 900 lines</span>' +
      '<span class="rec-strip__i rec-small">' + (res.fails.length ? '<span class="e1-tone--critical">' + c.icon('x', 12) + ' ' + fmt.plural(res.fails.length, 'failure') + '</span>' : '<span class="e1-tone--good">' + c.icon('check', 12) + ' no failures</span>') + ' · ' + fmt.plural(res.warns.length, 'lint warning') + '</span>' +
      (dr.changed ? '<span class="rec-strip__i rec-small e1-tone--warning">' + c.icon('clock', 12) + ' Changed since validation — validate again</span>' : '') +
      '</div>';
  }
  function blockNav(dr, block, id) {
    var res = validate(dr);
    return '<ul class="rec-blocknav" id="rec-bn" role="list" aria-label="Declaration blocks">' + BLOCKS.map(function (b, i) {
      var n = blockIssues(res, b[0]);
      var s = n.f ? '<span class="rec-bn__s e1-tone--critical">' + c.icon('x', 11) + n.f + '<span class="e1-sr"> failures</span></span>' : n.w ? '<span class="rec-bn__s e1-tone--warning">' + c.icon('alert', 11) + n.w + '<span class="e1-sr"> warnings</span></span>' : '<span class="rec-bn__s e1-tone--good">' + c.icon('check', 11) + '<span class="e1-sr">no issues</span></span>';
      return '<li><a href="#/records/studio/' + esc(id) + '?step=author&block=' + b[0] + '"' + (b[0] === block ? ' aria-current="true"' : '') + '><span class="rec-bn__n">' + (i + 1) + '</span><span>' + b[1] + '</span>' + s + '</a></li>';
    }).join('') + '<li class="rec-bn__foot">Every field is a value, out of scope with an ADR, or not measurable with a reason. Never a blank.</li></ul>';
  }
  function dispSeg(path, p) {
    return '<div data-rec-seg="' + esc(path) + '">' + c.segmented([{ id: 'value', label: 'Value' }, { id: 'out_of_scope', label: 'Out of scope' }, { id: 'not_measurable', label: 'Not measurable' }], p.disp, { name: 'disp', label: 'Disposition', size: 'sm' }) + '</div>';
  }
  function msgFor(p, allowBlank) {
    var i = propIssue(p, allowBlank);
    if (!i) return p.disp === 'value' && !String(p.val || '').trim() ? '' : '<p class="rec-inline-ok">' + c.icon('check', 12) + (p.disp === 'value' ? 'Value' : p.disp === 'out_of_scope' ? 'Hidden, with ' + esc(p.adr) + ' on hover' : 'Not measured, with both sentences shown') + '</p>';
    return '<p class="rec-inline-err" role="alert">' + c.icon('alert', 12) + '<span>' + esc(i.text) + '</span></p>';
  }
  function propControl(path, p, o) {
    o = o || {};
    var id = pid(path), body;
    if (p.disp === 'out_of_scope') body = c.input({ id: id + '-adr', value: p.adr, placeholder: 'ADR-0142', mono: true, attrs: 'data-p="' + esc(path) + '" data-f="adr" aria-label="Decision reference"' });
    else if (p.disp === 'not_measurable') body = c.field('Reason', c.textarea({ id: id + '-r', rows: 2, value: p.reason, attrs: 'data-p="' + esc(path) + '" data-f="reason"' }), { id: id + '-r' }) + c.field('What would change your answer', c.textarea({ id: id + '-w', rows: 2, value: p.wci, attrs: 'data-p="' + esc(path) + '" data-f="wci"' }), { id: id + '-w' });
    else if (o.options) body = c.select({ id: id + '-v', value: p.val, options: o.options, attrs: 'data-p="' + esc(path) + '" data-f="val" aria-label="' + esc(o.label || path) + '"' });
    else if (o.rows) body = c.textarea({ id: id + '-v', rows: o.rows, value: p.val, placeholder: o.placeholder, attrs: 'data-p="' + esc(path) + '" data-f="val" aria-label="' + esc(o.label || path) + '"' });
    else body = c.input({ id: id + '-v', value: p.val, mono: !!o.mono, placeholder: o.placeholder, attrs: 'data-p="' + esc(path) + '" data-f="val" aria-label="' + esc(o.label || path) + '"' });
    return '<div class="rec-prop__c">' + (o.noDisp ? '' : dispSeg(path, p)) + '<div class="rec-stack rec-stack--sm">' + body + '</div><div id="' + id + '-m" aria-live="polite">' + msgFor(p, o.allowBlank) + '</div></div>';
  }
  function propRow(k, help, control) { return '<div class="rec-prop"><div><span class="rec-prop__k">' + esc(k) + '</span><span class="rec-prop__h">' + esc(help) + '</span></div>' + control + '</div>'; }

  function edIdentity(dr) {
    var I = dr.identity;
    return propRow('name', 'What people call this declaration.', propControl('identity.name', I.name, { label: 'name' })) +
      propRow('slug', 'Lower case, digits and underscores; 3 to 48 characters.', propControl('identity.slug', I.slug, { mono: true, label: 'slug', noDisp: true })) +
      propRow('owner_role', 'A role, not a person — people leave.', propControl('identity.owner_role', I.owner_role, { options: ROLES, label: 'owner role', noDisp: true })) +
      propRow('residency_domain', 'G2 compares every record against this. Phase 1 is in only.', propControl('identity.residency_domain', I.residency_domain, { options: [{ value: 'in', label: 'in · India (Mumbai)' }], label: 'residency', noDisp: true })) +
      propRow('system_of_record', 'Phase 1 writes to ERPNext only.', propControl('identity.system_of_record', I.system_of_record, { options: [{ value: 'erpnext', label: 'erpnext' }], label: 'system of record', noDisp: true })) +
      propRow('lexicon_ref', 'The term set sealed into F15 so words mean later what they meant on the day.', propControl('identity.lexicon_ref', I.lexicon_ref, { options: [LEXICON.ref, 'rung1/erpnext/gst/2026-08'], label: 'lexicon', noDisp: true })) +
      propRow('description', 'One plain sentence.', propControl('identity.description', I.description, { rows: 2, label: 'description' }));
  }
  function edShape(dr) {
    return '<p class="rec-small rec-muted" style="margin:0 0 10px">record_type <span class="rec-mono">' + esc(dr.id === 'erp.ar' ? 'Sales Invoice' : 'ERPNext DocType') + '</span>. Classification drives what proof_binding must cover.</p>' +
      c.table({ caption: 'Shape fields', dense: true, columns: [
        { key: 'f', label: 'Field', mono: true }, { key: 'type', label: 'Type', mono: true }, { key: 'card', label: 'Cardinality', mono: true },
        { key: 'cls', label: 'Classification', html: true, render: function (f, i) { return c.select({ id: 'sh-' + i, value: f.cls, options: ['public', 'internal', 'personal', 'financial'], attrs: 'data-p="shape.' + i + '.cls" aria-label="Classification of ' + esc(f.f) + '"' }); } }
      ], rows: dr.shape });
  }
  function edPerms(dr) {
    return c.table({ caption: 'Permission grants', dense: true, columns: [
      { key: 'kind', label: 'Actor kind', render: function (g) { return esc(kindWord(g.kind)); } }, { key: 'role', label: 'Role or actor' },
      { key: 'wt', label: 'Write types', render: function (g) { return '<span class="rec-mono rec-small">' + esc(g.wt) + '</span>'; } },
      { key: 'min', label: 'min_autonomy', html: true, render: function (g, i) { return c.select({ id: 'gr-m-' + i, value: g.min, options: ['A0', 'A1', 'A2', 'A3', 'A4', 'A5'], attrs: 'data-p="grants.' + i + '.min" aria-label="Minimum autonomy for ' + esc(g.role) + '"' }); } },
      { key: 'approve', label: 'may_approve', html: true, render: function (g, i) { return c.checkbox({ id: 'gr-a-' + i, label: g.approve ? 'Yes' : 'No', checked: g.approve, attrs: 'data-p="grants.' + i + '.approve"' }); } }
    ], rows: dr.grants }) + '<p class="rec-table-note">Try ticking may_approve for an agent: validation fails with L0-S11 at once.</p>';
  }
  function edWts(dr, wi, id) {
    var w = dr.wts[wi] || dr.wts[0]; if (!w) return c.empty({ compact: true, title: 'No write type yet', why: 'A declaration with no write type has nothing to render.', action: c.button('Add write type', { kind: 'primary', icon: 'plus', attrs: 'data-rec-act="wt-add"' }) });
    wi = dr.wts.indexOf(w);
    var res = validate(dr);
    var pick = '<div class="rec-wtpick" role="group" aria-label="Write types in this declaration">' + dr.wts.map(function (x, i) {
      var bad = res.fails.some(function (f) { return f.fix && f.fix.wt === i; });
      return c.chip((x.label || shortWt(x.name) || 'Untitled') + (x.isNew ? ' · new' : ''), { href: '#/records/studio/' + id + '?step=author&block=write_types&wt=' + i, selected: i === wi, icon: bad ? 'alert' : null });
    }).join('') + c.button('Add write type', { size: 'sm', kind: 'ghost', icon: 'plus', attrs: 'data-rec-act="wt-add"' }) + '</div>';
    var p = 'wt.' + wi;
    var gl = '<ol class="rec-gatelist" aria-label="Gates in declared order">' + w.gates.map(function (g, gi) {
      return '<li><span class="rec-gl__n">' + (gi + 1) + '</span><span class="rec-mono rec-small rec-muted">' + GATES[g].g + '</span><span>' + esc(GATES[g].name) + '</span>' + (GATES[g].never ? tag(c.icon('lock', 11) + ' never skippable', 'lock') : '') +
        '<span class="rec-gl__a">' + c.button('Move up', { size: 'sm', kind: 'ghost', iconOnly: true, icon: 'arrow-up', disabled: gi === 0, attrs: 'data-rec-act="gate-up" data-i="' + gi + '"' }) + c.button('Move down', { size: 'sm', kind: 'ghost', iconOnly: true, icon: 'arrow-down', disabled: gi === w.gates.length - 1, attrs: 'data-rec-act="gate-down" data-i="' + gi + '"' }) + c.button('Remove ' + GATES[g].name, { size: 'sm', kind: 'ghost', iconOnly: true, icon: 'x', attrs: 'data-rec-act="gate-rm" data-i="' + gi + '"' }) + '</span></li>';
    }).join('') + '</ol>';
    var missing = GATE_ORDER.filter(function (g) { return w.gates.indexOf(g) < 0; });
    var add = missing.length ? '<div class="rec-prop__row">' + c.select({ id: 'gate-add-sel', options: missing.map(function (g) { return { value: g, label: GATES[g].g + ' · ' + GATES[g].name }; }), attrs: 'aria-label="Gate to add"' }) + c.button('Add gate', { size: 'sm', icon: 'plus', attrs: 'data-rec-act="gate-add"' }) + '</div>' : '';
    var rv = w.rev;
    var revBody = rv.mode === 'plan' ? '<div class="rec-prop__row">' + c.field('method', c.select({ id: pid(p + '.rev') + '-m', value: rv.method, options: ['snapshot_restore', 'compensating_entry', 'target_native_undo'], attrs: 'data-p="' + p + '.rev" data-f="method"' }), { id: pid(p + '.rev') + '-m' }) +
        c.field('window_hours', c.input({ id: pid(p + '.rev') + '-h', type: 'number', value: rv.hours, mono: true, attrs: 'data-p="' + p + '.rev" data-f="hours" min="0"' }), { id: pid(p + '.rev') + '-h' }) +
        c.field('after_window', c.select({ id: pid(p + '.rev') + '-a', value: rv.after, options: ['compensating_entry', 'not_reversible'], attrs: 'data-p="' + p + '.rev" data-f="after"' }), { id: pid(p + '.rev') + '-a' }) + '</div>' :
      rv.mode === 'irreversible' ? '<p class="rec-small" style="margin:0">' + c.reversible(false) + ' <span class="rec-muted">irreversible: true — forces One counterparty or wider and bars auto-approval. It will never be offered “Reverse this”.</span></p>' :
      c.input({ id: pid(p + '.rev') + '-t', value: rv.text, placeholder: 'Say which it is', attrs: 'data-p="' + p + '.rev" data-f="text" aria-label="Reversal plan"' }) + '<div id="' + pid(p + '.rev') + '-m" aria-live="polite">' + (isHonestFail(rv.text) || !String(rv.text || '').trim() ? '<p class="rec-inline-err" role="alert">' + c.icon('alert', 12) + '<span>' + HONEST + ' Declare a reversal plan, or irreversible: true.</span></p>' : '<p class="rec-inline-warn">' + c.icon('alert', 12) + '<span>Written down, but not declared. Choose Reversal plan or Irreversible.</span></p>') + '</div>';
    var chs = CHANNELS.filter(function (ch) { return w.ch[ch.id]; }).map(function (ch) { return tag(esc(ch.name) + ': ' + esc(w.ch[ch.id])); }).join('') || '<span class="rec-inline-err">' + c.icon('alert', 12) + ' Not on any channel</span>';
    return pick +
      propRow('name', '<slug>.<verb>, e.g. erp.sales_invoice.cancel.', '<div class="rec-prop__c">' + c.input({ id: pid(p + '.name'), value: w.name, mono: true, attrs: 'data-p="' + p + '.name" aria-label="Write type name"' }) + '</div>') +
      propRow('label', 'The words on the approver’s button and in the Decide header.', '<div class="rec-prop__c">' + c.input({ id: pid(p + '.label'), value: w.label, attrs: 'data-p="' + p + '.label" aria-label="Label"' }) + '</div>') +
      propRow('intent', 'At least 40 characters, and not a repeat of the label.', propControl(p + '.intent', w.intent, { rows: 2, label: 'intent' })) +
      propRow('blast_radius', 'Sets the meter basis. Whole tenant and cross-boundary force dual control.', '<div class="rec-prop__c">' + c.select({ id: pid(p + '.blast'), value: w.blast, options: c.BLAST.map(function (b, i) { return { value: i + 1, label: b[1] + ' (' + b[0] + ')' }; }), attrs: 'data-p="' + p + '.blast" aria-label="Blast radius"' }) + '<span class="rec-small rec-muted">Meter basis: <b>' + BASIS[w.blast] + '</b></span></div>') +
      propRow('dual_control', 'A second named person approves this write_id.', '<div class="rec-prop__c"><div class="rec-prop__row">' + c.select({ id: pid(p + '.dual'), value: w.dual, options: [{ value: 'no', label: 'No' }, { value: 'always', label: 'Always' }, { value: 'threshold', label: 'Above a threshold' }], attrs: 'data-p="' + p + '.dual" aria-label="Dual control"' }) + (w.dual === 'threshold' ? c.input({ id: pid(p + '.threshold'), value: w.threshold, prefix: '₹', mono: true, attrs: 'data-p="' + p + '.threshold" aria-label="Threshold"' }) : '') + '</div></div>') +
      propRow('gates[]', 'Declared order is semantic. Every gate runs, even after the first failure.', '<div class="rec-prop__c">' + gl + add + '</div>') +
      propRow('reversal_plan', 'Exactly one of a reversal plan or irreversible: true (L0-S03).', '<div class="rec-prop__c"><div data-rec-seg="' + p + '.rev.mode">' + c.segmented([{ id: 'plan', label: 'Reversal plan' }, { id: 'irreversible', label: 'Irreversible' }, { id: 'undecided', label: 'Not declared' }], rv.mode, { name: 'revmode', label: 'Reversal', size: 'sm' }) + '</div>' + revBody + '</div>') +
      propRow('channels', 'Edited in block 7 · Channels.', '<div class="rec-prop__c"><div class="rec-chips">' + chs + '</div><a class="rec-small" href="#/records/studio/' + esc(id) + '?step=author&block=channels">Edit the channel matrix</a></div>');
  }
  function edGates(dr) {
    return GATE_ORDER.map(function (k) {
      var g = dr.gates[k], G = GATES[k], path = 'gates.' + k;
      var ctl = '<div class="rec-prop__c"><div class="rec-prop__row">' + (G.never ? tag(c.icon('lock', 11) + ' Never skippable · always on', 'lock') : c.toggle({ id: pid(path + '.on'), label: g.on ? 'Enabled' : 'Disabled', checked: g.on, attrs: 'data-p="' + path + '.on"' })) + '</div>' +
        (g.on ? '<span class="rec-label">params</span>' + propControl(path + '.params', g.params, { rows: 1, label: G.name + ' params', allowBlank: !G.never }) :
          c.field('Decision that turned it off', c.input({ id: pid(path + '.adr'), value: g.adr, placeholder: 'ADR-0142', mono: true, attrs: 'data-p="' + path + '.adr"' }), { id: pid(path + '.adr'), help: 'LN-07 warns when rate, budget or schedule is off without an ADR.' })) + '</div>';
      return propRow(G.g + ' · ' + k, G.asserts + '. Raises ' + G.codes.join(', ') + '.', ctl);
    }).join('');
  }
  function edPb(dr) {
    return '<p class="rec-small rec-muted" style="margin:0 0 10px">Bound fields are committed inside F14 (payload_hash) with a per-record salt. A financial or personal field left out needs an ADR (LN-06).</p>' +
      c.table({ caption: 'Proof binding fields', dense: true, columns: [
        { key: 'f', label: 'Field', mono: true }, { key: 'cls', label: 'Classification', render: function (f) { return tag(esc(f.cls), f.cls === 'financial' || f.cls === 'personal' ? 'accent' : ''); } },
        { key: 'bound', label: 'Bound', html: true, render: function (f, i) { return c.checkbox({ id: 'pb-' + i, label: f.bound ? 'In F14' : 'Not bound', checked: f.bound, attrs: 'data-p="shape.' + i + '.bound"' }); } },
        { key: 'adr', label: 'ADR if not bound', html: true, render: function (f, i) { return f.bound || (f.cls !== 'financial' && f.cls !== 'personal') ? '<span class="rec-muted rec-small">—</span>' : c.input({ id: 'pba-' + i, value: f.adr, placeholder: 'ADR-0131', mono: true, attrs: 'data-p="shape.' + i + '.adr" aria-label="ADR for ' + esc(f.f) + '"' }); } }
      ], rows: dr.shape }) +
      '<div style="margin-top:12px">' + propRow('canonicalisation', 'elan1_lp_v1 at Phase 1; elan1_lp_sd_v1 arrives with selective disclosure.', '<div class="rec-prop__c">' + c.select({ id: 'pb-canon', value: dr.pb.canon, options: ['elan1_lp_v1'], attrs: 'data-p="pb.canon" aria-label="Canonicalisation"' }) + '</div>') +
      propRow('salt_scope', 'per_record at Phase 1. Destroying a salt unbinds the payload for erasure; digests still hold.', '<div class="rec-prop__c"><span class="rec-mono">per_record</span></div>') +
      propRow('redaction_profile', 'Ignored at L1. Declare it out of scope with its decision.', propControl('pb.redaction', dr.pb.redaction, { label: 'redaction profile', allowBlank: true })) + '</div>';
  }
  function edChannels(dr) {
    return '<div class="e1-table-wrap"><table class="e1-table is-dense rec-matrix"><caption class="e1-sr">Channel matrix: write type by channel</caption><thead><tr><th scope="col">Write type</th>' + CHANNELS.map(function (ch) { return '<th scope="col">' + esc(ch.name) + '<div class="rec-small rec-mono rec-muted">' + ch.kind + '</div></th>'; }).join('') + '</tr></thead><tbody>' +
      dr.wts.map(function (w, i) { return '<tr><th scope="row">' + esc(w.label || shortWt(w.name)) + '<div class="rec-small rec-mono rec-muted">' + esc(w.name) + '</div></th>' + CHANNELS.map(function (ch) { return '<td>' + c.select({ id: 'ch-' + i + '-' + ch.id, value: w.ch[ch.id] || '', options: CH_OPTS, attrs: 'data-p="ch.' + i + '.' + ch.id + '" aria-label="' + esc((w.label || w.name) + ' on ' + ch.name) + '"' }) + '</td>'; }).join('') + '</tr>'; }).join('') +
      '<tr><th scope="row">mode</th>' + CHANNELS.map(function (ch) { return '<td>' + c.select({ id: 'chm-' + ch.id, value: dr.chmode[ch.id], options: [{ value: 'enforced', label: 'Enforced' }, { value: 'attested_advisory', label: 'Attested advisory' }], attrs: 'data-p="chmode.' + ch.id + '" aria-label="Mode of ' + esc(ch.name) + '"' }) + '</td>'; }).join('') + '</tr>' +
      '</tbody></table></div><p class="rec-table-note">“—” means the action cannot be attempted from that route. It is not a permission question. A channel adapts; it never decides.</p>';
  }
  function chSentence(w, dr) {
    var out = [];
    CHANNELS.forEach(function (ch) {
      var v = w.ch[ch.id]; if (!v) return;
      var mode = dr.chmode[ch.id] === 'attested_advisory' ? ' (Attested advisory: the write is recorded after the fact; we do not claim to have stopped anything)' : '';
      var s = v === 'submit' ? 'may be submitted' : v === 'approve' ? 'may be approved' : v === 'submit · approve' ? 'may be submitted and approved' : v === 'approve by reply' ? 'may be approved by replying APPROVE' : 'is announced with a deep link only; nothing is approvable there';
      out.push('<p class="rec-sayline">From ' + esc(ch.name) + ', “' + esc(w.label || w.name) + '” ' + s + '.' + esc(mode) + '</p>');
    });
    return out.join('') || '<p class="rec-inline-err">' + c.icon('alert', 12) + ' Not on any channel — it could never be attempted.</p>';
  }
  function previewHtml(dr, wi) {
    var w = dr.wts[wi] || dr.wts[0]; if (!w) return '';
    var res = validate(dr);
    var sample = /cancel/.test(w.name) ? 'INV-2026-0834 · Shree Murugan Traders · ₹2,00,000' : /credit_limit/.test(w.name) ? 'ACME Textiles · ₹3,00,000 → ₹5,00,000' : /payment_entry/.test(w.name) ? 'ACME Textiles · ₹1,12,500' : /price_list/.test(w.name) ? 'Yarn 40s combed · 38 items' : 'ACME Textiles · ₹2,40,000';
    var rev = w.rev.mode === 'plan' ? c.reversible(Number(w.rev.hours) || true) : w.rev.mode === 'irreversible' ? c.reversible(false) + ' <span class="rec-small rec-muted">Irreversible — cannot be auto-approved</span>' : '<span class="rec-inline-err">' + c.icon('alert', 12) + ' Reversal not declared: this screen cannot tell the approver whether they can undo it.</span>';
    return '<aside class="rec-preview" id="rec-pv" aria-label="Compiled surface preview"><div class="rec-preview__bar">' + c.icon('eye', 14) + '<span>Compiled surface preview · what the approver will see</span></div><div class="rec-preview__body">' +
      '<p class="rec-label">OB-preview · <span class="rec-mono">' + esc(w.name || 'unnamed') + '</span></p>' +
      '<h3 class="rec-preview__title">' + esc(w.label || 'Label not set') + ' · ' + esc(sample) + '</h3>' +
      c.actor({ name: /cancel/.test(w.name) ? 'Collections Agent' : 'ar-agent', kind: 'agent', role: 'A2 Propose', size: 'sm' }) +
      c.blast(w.blast, { compact: false }) + '<div>' + rev + '</div>' +
      '<div><p class="rec-label">Gates, in declared order</p><ol>' + w.gates.map(function (g) { return '<li>' + esc(GATES[g].name) + (g === 'dual_control' && w.dual === 'threshold' ? ' (above ₹' + esc(w.threshold) + ')' : '') + '</li>'; }).join('') + '</ol></div>' +
      '<div class="rec-small">Meter basis <b>' + BASIS[w.blast] + '</b> · refusals metered at zero</div>' +
      '<div class="rec-lines"><p class="rec-label">The sentence each channel may say</p>' + chSentence(w, dr) + '</div>' +
      c.progress(Math.min(res.lines, 900), 900, { label: 'Declaration length', note: num(res.lines) + ' of 900 lines', state: res.lines > 900 ? 'warning' : 'accent' }) +
      '</div></aside>';
  }
  function editorFor(dr, block, wi, id) {
    var titles = { identity: 'This thing', shape: 'shaped this way', permissions: 'may be changed by these actors', write_types: 'through these write types', gates: 'subject to these gates', proof_binding: 'proving these fields', channels: 'over these channels' };
    var n = BLOCKS.map(function (b) { return b[0]; }).indexOf(block) + 1;
    var body = block === 'identity' ? edIdentity(dr) : block === 'shape' ? edShape(dr) : block === 'permissions' ? edPerms(dr) : block === 'gates' ? edGates(dr) : block === 'proof_binding' ? edPb(dr) : block === 'channels' ? edChannels(dr) : edWts(dr, wi, id);
    return '<div id="rec-ed">' + blockCard(n, block, BLOCKS[n - 1][1], titles[block], body) + '</div>';
  }

  /* ---- simulation ---- */
  var SIM_PRE = { 'erp.sales_invoice.submit': [3, 'credit limit exceeded'], 'erp.sales_invoice.cancel': [1, 'outside the 24-hour IRN window'], 'erp.credit_limit.change': [1, 'new limit below current exposure'], 'erp.payment_entry.submit': [1, 'no open invoice to match'], 'erp.credit_note.submit': [2, 'credit note exceeds the invoice outstanding'], 'erp.price_list.update': [1, 'effective date in a closed period'], 'erp.customer.update': [1, 'GSTIN not validated'] };
  function simulate(dr) {
    return dr.wts.map(function (w) {
      var fixtures = 24, ref = [], noFail = dr.noFail[w.name] && !dr.extraFixture[w.name];
      var gates = w.gates.map(function (g) {
        var fail = 0, code = null, why = '';
        if (!noFail) {
          if (g === 'counterparty') { fail = 2; code = 'GATE.COUNTERPARTY_UNKNOWN'; why = 'unregistered counterparty'; }
          if (g === 'precondition') { var sp = SIM_PRE[w.name]; if (sp) { fail = sp[0]; code = 'GATE.PRECONDITION_FAILED'; why = sp[1]; } }
          if (g === 'dual_control' && w.dual !== 'no') { fail = w.dual === 'always' ? 5 : 3; code = 'GATE.DUAL_CONTROL_PENDING'; why = 'no second approver yet'; }
          if (g === 'budget') { fail = 1; code = 'GATE.BUDGET_EXHAUSTED'; why = 'period budget used up'; }
          if (g === 'rate') { fail = 1; code = 'GATE.RATE_EXCEEDED'; why = 'burst above the per-actor rate'; }
        }
        if (noFail === false && dr.extraFixture[w.name] && g === 'counterparty') { fail = 1; code = 'GATE.COUNTERPARTY_UNKNOWN'; why = 'added fixture: customer with an unvalidated GSTIN'; }
        if (code) ref.push([code, fail, why, GATES[g].g]);
        return { g: g, pass: fixtures - fail, fail: fail, code: code };
      });
      var refused = ref.reduce(function (a, r) { return a + r[1]; }, 0);
      var esc_ = /cancel|credit_note|credit_limit|price_list/.test(w.name) ? 0 : (w.dual === 'no' ? 2 : 4);
      return { w: w, fixtures: fixtures, gates: gates, refusals: ref, refused: refused, escalated: esc_, allowed: fixtures - refused - esc_ };
    });
  }
  function simReport(dr, id) {
    var R = dr.sim;
    var tot = R.reduce(function (a, r) { a.f += r.fixtures; a.r += r.refused; a.e += r.escalated; a.a += r.allowed; return a; }, { f: 0, r: 0, e: 0, a: 0 });
    var zero = R.filter(function (r) { return !r.refused; });
    return '<div class="rec-stats">' + c.stat({ label: 'Fixtures run', value: num(tot.f), note: 'Reference tenant · synthetic · mode: sandbox' }) + c.stat({ label: 'Allowed', value: num(tot.a), note: 'Would commit after the shadow sandbox' }) + c.stat({ label: 'Not done', value: num(tot.r), note: 'Refusals the fixtures produced · metered at zero' }) + c.stat({ label: 'Waiting on a person', value: num(tot.e), note: 'Escalated at rung 6 by the autonomy grant' }) + '</div>' +
      (zero.length ? c.callout({ kind: 'warning', title: 'A simulation with no refusals in it is a simulation that has not been designed.', body: '<p>' + zero.map(function (r) { return '<span class="rec-mono">' + esc(r.w.name) + '</span>'; }).join(', ') + ' produced no refusals. Add a fixture that fails.</p>' }) : '') +
      R.map(function (r) {
        var head = '<div class="rec-sim__head"><div><strong>' + esc(r.w.label) + '</strong> <span class="rec-mono rec-small rec-muted">' + esc(r.w.name) + '</span></div>' + c.blast(r.w.blast, { compact: true }) + '<span class="rec-small">Meter basis <b>' + BASIS[r.w.blast] + '</b></span>' +
          '<span class="rec-small rec-muted" style="margin-left:auto">' + r.allowed + ' allowed · ' + r.refused + ' not done · ' + r.escalated + ' waiting</span></div>';
        var gl = '<p class="rec-label" style="margin:0 0 6px">Gates that would run, in this order</p>' + r.gates.map(function (g, i) {
          return '<div class="rec-sim__gate"><span class="rec-mono">' + (i + 1) + '</span><span class="rec-mono">' + GATES[g.g].g + '</span><span>' + esc(GATES[g.g].name) + '</span><span class="rec-small">' + g.pass + ' passed' + (g.fail ? ' · <b>' + g.fail + ' failed</b>' : '') + '</span></div>';
        }).join('');
        var rf = r.refusals.length ? c.table({ caption: 'Refusals produced', dense: true, columns: [
          { key: 0, label: 'Code', render: function (x) { return '<a class="rec-mono rec-small" href="#/assurance/refusals/' + esc(x[0]) + '">' + esc(x[0]) + '</a>'; } }, { key: 1, label: 'Count', align: 'right', render: function (x) { return mono('×' + x[1]); } }, { key: 2, label: 'Fixture', render: function (x) { return '<span class="rec-small">' + esc(x[2]) + '</span>'; } }
        ], rows: r.refusals }) : '<div class="rec-stack rec-stack--sm">' + c.callout({ kind: 'warning', title: 'No refusals', body: '<p>This simulation produced no refusals. Add a fixture that fails.</p>' }) + c.button('Add a fixture that fails', { size: 'sm', icon: 'plus', attrs: 'data-rec-act="add-fixture" data-wt="' + esc(r.w.name) + '"' }) + '</div>';
        return '<section class="rec-sim__wt">' + head + '<div class="rec-sim__body"><div>' + gl + '</div><div><p class="rec-label" style="margin:0 0 6px">Refusals the fixtures produced</p>' + rf + '</div></div></section>';
      }).join('');
  }
  function blockedStep(title, why, href, label) {
    return c.card({ body: '<div class="rec-sysrow"><span class="rec-sysmark">' + c.icon('lock', 20) + '</span><div class="rec-stack rec-stack--sm" style="flex:1;min-width:240px"><h2 class="e1-text-section" style="margin:0">' + esc(title) + '</h2><p class="rec-muted" style="margin:0">' + esc(why) + '</p><div>' + c.button(label, { kind: 'primary', href: href, iconRight: 'arrow-right' }) + '</div></div></div>' });
  }

  /* ---- studio routes ---- */
  reg('/records/studio', {
    title: 'Declaration Studio', section: 'studio', keywords: 'author validate simulate certify declaration',
    render: function (p, q) {
      var path = '/records/studio';
      var head = c.pageHeader({ tabs: sibTabs('studio'), title: 'Declaration Studio', eyebrow: 'Records · declare', lead: 'Author a declaration block by block, validate it against the rules, simulate it on the reference tenant, and have a named person certify it. You cannot skip forward.',
        actions: stateMenu(path, [['empty', 'Empty — no declaration yet']]) + c.button('New declaration', { kind: 'primary', icon: 'plus', href: '#/records/studio/new' }) });
      if (q.state === 'empty') return page(head, c.empty({ icon: 'file-text', title: 'No declaration yet.', why: 'A module without a declaration has no screens, because there is nothing to render.', action: { label: 'New declaration', href: '#/records/studio/new', kind: 'primary' } }));
      var ar = studioDraft('erp.ar', true), res = ar ? validate(ar) : null;
      var arStage = ar ? (ar.certified ? 'Certified · v8' : ar.stage === 'simulated' ? 'Simulated · ready to certify' : ar.stage === 'validated' ? 'Valid · ready to simulate' : res.fails.length ? fmt.plural(res.fails.length, 'failure') + ' at Validate' : 'In author') : '1 failure at Validate (L0-S03)';
      var drafts = [
        { id: 'erp.ar', name: 'rung1 — Accounts receivable (ERPNext)', v: 8, base: 7, what: 'Adds erp.sales_invoice.cancel (irreversible)', stage: arStage, author: 'Farah Sheikh', ob: 'OB-2026-0424' },
        { id: 'erp.assets', name: 'rung1 — Fixed assets (ERPNext)', v: 1, base: null, what: 'First version', stage: 'In author', author: 'Farah Sheikh' }
      ].concat(Object.keys(S.drafts).filter(function (k) { return !DX[k]; }).map(function (k) { var d = S.drafts[k]; return { id: k, name: d.identity.name.val, v: d.version, base: null, what: 'First version', stage: d.certified ? 'Certified' : 'In author', author: d.author }; }));
      var tbl = c.table({ caption: 'Drafts in progress', rowHref: function (r) { return '#/records/studio/' + r.id + '?step=author'; }, columns: [
        { key: 'name', label: 'Declaration', html: true, render: function (r) { return '<strong>' + esc(r.name) + '</strong><div class="rec-small rec-mono rec-muted">' + esc(r.id) + ' · draft v' + r.v + (r.base ? ' on v' + r.base : '') + '</div>'; } },
        { key: 'what', label: 'Change' }, { key: 'author', label: 'Author', html: true, render: function (r) { return c.actor({ name: r.author, kind: 'person', size: 'sm' }); } },
        { key: 'stage', label: 'Where it is', html: true, render: function (r) { return c.badge(/Certified/.test(r.stage) ? 'good' : /failure/.test(r.stage) ? 'warning' : 'info', r.stage, { subtle: true }); } }
      ], rows: drafts });
      var cert = c.table({ caption: 'Certified declarations', rowHref: function (d) { return '#/records/studio/' + d.id + '?step=author'; }, columns: [
        { key: 'name', label: 'Declaration', html: true, render: function (d) { return esc(d.name) + '<div class="rec-small rec-mono rec-muted">' + esc(d.id) + '</div>'; } },
        { key: 'current', label: 'In force', render: function (d) { return mono('v' + d.current); } },
        { key: 'next', label: 'Next version', render: function (d) { return mono('v' + ((d.draft || d.current) + (d.draft ? 0 : 1))); } },
        { key: 'go', label: '', html: true, render: function (d) { return '<span class="rec-small">Edit as new version →</span>'; } }
      ], rows: DECLS.filter(function (d) { return d.current && d.id !== 'erp.ar'; }) });
      var modes = c.table({ caption: 'Studio modes, in order', columns: [
        { key: 'n', label: 'Step', mono: true, width: '64px' }, { key: 't', label: 'Mode', html: true, nowrap: true, render: function (r) { return '<strong>' + esc(r.t) + '</strong>'; } }, { key: 'd', label: 'What it does' }
      ], rows: STEPS.map(function (s, i) {
        var txt = ['Seven blocks, one after another. Every field is a value, out of scope with an ADR, or not measurable with a reason and what would change it. The compiled Decide screen previews beside the source.',
          'Schema, the semantic rules L0-S01 to L0-S11 and lint LN-01 to LN-07. Failures show against the block that caused them, not as a list of codes.',
          'Runs every write type against the reference tenant’s synthetic fixtures, never production records: gates in order, blast radius, meter basis and the refusals produced.',
          'A named person who is not the author presses Certify this version. It is a governed write with dual control, and their name is on it.'][i];
        return { n: String(i + 1), t: s[1], d: txt };
      }) });
      return page(head,
        c.section({ id: 'drafts', title: 'Drafts in progress', body: tbl }) +
        c.section({ id: 'modes', title: 'Four modes, one after another', lead: 'AUTHOR → VALIDATE → SIMULATE → CERTIFY, then COMPILE and RESOLVE. Nothing resolves to “latest”.', body: modes }) +
        c.section({ id: 'certified', title: 'Start a new version of a certified declaration', lead: 'There is no such thing as a small change to a governed declaration.', body: cert }) +
        c.callout({ kind: 'info', title: 'Studio runs on a control token.', body: '<p>Authoring as <strong>Farah Sheikh</strong> (Declaration author, elan1) with <span class="rec-mono">ctl_…77aa</span> — Studio and registry only. A control token has no network route to any record store.</p>' })
      );
    }
  });

  reg('/records/studio/new', {
    title: 'New declaration', section: 'studio', crumbs: [R, ['Studio', '#/records/studio']],
    render: function () {
      var head = c.pageHeader({ title: 'New declaration', eyebrow: 'Studio · block 1 of 7 · identity', lead: 'Start with who owns it and where it lives. Everything else is authored block by block in the Studio, and nothing can be written until a named person certifies version 1.', back: ['Studio', '#/records/studio'] });
      var form = '<form id="rec-new" class="rec-stack" novalidate>' +
        c.field('Name', c.input({ id: 'nd-name', value: 'rung1 — Bank guarantees (ERPNext)', attrs: 'required' }), { id: 'nd-name', required: true, help: 'What people call it, e.g. “rung1 — Accounts receivable (ERPNext)”.' }) +
        c.field('Slug', c.input({ id: 'nd-slug', value: 'erp_bank_guarantee', mono: true, attrs: 'required data-rec-slug' }), { id: 'nd-slug', required: true, help: 'Lower case, digits and underscores; 3 to 48 characters. It becomes the declaration id.' }) +
        '<div class="rec-two">' + c.field('Owner role', c.select({ id: 'nd-owner', options: ROLES, value: 'Finance manager' }), { id: 'nd-owner', help: 'A role, not a person — people leave.' }) +
        c.field('System of record', c.select({ id: 'nd-sor', options: [{ value: 'erpnext', label: 'ERPNext (kaveri.rung1.in)' }], value: 'erpnext' }), { id: 'nd-sor', help: 'Phase 1 writes to hosted ERPNext only.' }) + '</div>' +
        '<div class="rec-two">' + c.field('Residency domain', c.select({ id: 'nd-res', options: [{ value: 'in', label: 'in · India (Mumbai)' }], value: 'in' }), { id: 'nd-res' }) +
        c.field('Lexicon', c.select({ id: 'nd-lex', options: [LEXICON.ref], value: LEXICON.ref }), { id: 'nd-lex', help: 'Its hash is sealed into every record as F15.' }) + '</div>' +
        c.field('Description', c.textarea({ id: 'nd-desc', rows: 2, value: 'Bank guarantees issued to suppliers and customers, their renewals and their release.' }), { id: 'nd-desc', help: 'One plain sentence. “tbd” is not accepted.' }) +
        '<div class="e1-row">' + c.button('Create draft v1 and open Author', { kind: 'primary', type: 'submit', icon: 'arrow-right' }) + c.button('Cancel', { kind: 'ghost', href: '#/records/studio' }) + '</div></form>';
      return head + '<div class="rec-split">' + c.card({ body: form }) + '<div class="rec-stack">' +
        c.card({ title: 'What happens next', body: '<ol class="rec-small" style="margin:0;padding-left:18px"><li>Author the other six blocks.</li><li>Validate: failures show against their block.</li><li>Simulate on the reference tenant.</li><li>A named certifier who is not you certifies v1.</li></ol>' }) +
        c.callout({ kind: 'rule', body: '<p>A module without a declaration has no screens, because there is nothing to render.</p>' }) + '</div></div>';
    },
    mount: function (el) {
      var f = el.querySelector('#rec-new'); if (!f) return;
      function check() {
        var s = el.querySelector('#nd-slug'), ok = /^[a-z0-9_]{3,48}$/.test(s.value);
        s.setAttribute('aria-invalid', ok ? 'false' : 'true');
        var fld = s.closest('.e1-field'); if (fld) fld.classList.toggle('is-invalid', !ok);
        var m = el.querySelector('#nd-slug-msg'); if (m) m.textContent = ok ? 'Lower case, digits and underscores; 3 to 48 characters. It becomes the declaration id.' : 'Use only a–z, 0–9 and _, 3 to 48 characters (no dots, spaces or capitals).';
        var d = el.querySelector('#nd-desc'), dm = el.querySelector('#nd-desc-msg'), bad = isHonestFail(d.value) || !d.value.trim();
        if (dm) dm.textContent = bad ? HONEST : 'One plain sentence. “tbd” is not accepted.';
        d.setAttribute('aria-invalid', bad ? 'true' : 'false');
        return ok && !bad;
      }
      f.addEventListener('input', check);
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!check()) { E1.toast('Fix the highlighted fields first.', 'warning'); return; }
        var slug = el.querySelector('#nd-slug').value;
        var id = 'erp.' + slug.replace(/^erp_/, '');
        S.drafts[id] = seedDraft(id, { name: el.querySelector('#nd-name').value, slug: slug, owner: el.querySelector('#nd-owner').value, description: el.querySelector('#nd-desc').value });
        E1.toast('Draft v1 created · ' + id, 'good', { title: 'Accepted as a draft' });
        E1.go('/records/studio/' + id, { step: 'author', block: 'shape' });
      });
    }
  });

  reg('/records/studio/:id', {
    title: function (p) { return 'Studio · ' + p.id; }, section: 'studio', crumbs: [R, ['Studio', '#/records/studio']], example: '/records/studio/erp.ar?step=author', wide: true,
    render: function (p, q) {
      var id = p.id, dr = studioDraft(id);
      var step = ['author', 'validate', 'simulate', 'certify'].indexOf(q.step) >= 0 ? q.step : 'author';
      var reach = STAGE_N[dr.stage] || 0;
      var head = c.pageHeader({
        title: dr.identity.name.val || id, eyebrow: 'Declaration Studio · ' + id + ' · draft v' + dr.version,
        lead: 'the elan1 Ontology, attested by transactions that cleared, not extracted from documents. Author › Validate › Simulate › Certify — you cannot skip forward.',
        back: ['Studio', '#/records/studio'],
        actions: c.menu({ label: 'Draft', icon: 'more', size: 'sm', align: 'right', items: [{ label: 'Reset this draft', action: 'rec-reset', value: id, icon: 'refresh' }, { label: 'View v' + (dr.base || 1) + ' in force', href: DX[id] ? '#/records/declarations/' + id : '#/records/declarations', icon: 'file-text' }, { label: 'Registry down on certify', href: '#/records/studio/' + id + '?step=certify&state=registry-down', icon: 'alert' }] }) +
          c.button('Save draft', { icon: 'check', attrs: 'data-rec-act="save"' }) +
          (step === 'author' ? c.button('Validate', { kind: 'primary', iconRight: 'arrow-right', href: '#/records/studio/' + id + '?step=validate' }) : '')
      });
      var top = stepNav(dr, step, id) + stripHtml(dr);
      var body;
      if (step === 'author') {
        var block = BLOCKS.some(function (b) { return b[0] === q.block; }) ? q.block : (dr.wts.some(function (w) { return w.isNew; }) ? 'write_types' : 'identity');
        var wi = q.wt !== undefined ? +q.wt : Math.max(0, dr.wts.map(function (w) { return w.isNew; }).lastIndexOf(true));
        body = '<div class="rec-studio" data-block="' + block + '" data-wt="' + wi + '"><div>' + blockNav(dr, block, id) + '</div><div class="rec-studio__main">' + editorFor(dr, block, wi, id) +
          '<div class="e1-row" style="justify-content:space-between;margin-top:16px"><span class="rec-kbdhint">' + c.kbd('Ctrl', 'Enter') + ' validates</span>' + c.button('Validate', { kind: 'primary', iconRight: 'arrow-right', href: '#/records/studio/' + id + '?step=validate' }) + '</div></div>' +
          '<div class="rec-studio__side" id="rec-pvwrap">' + previewHtml(dr, wi) + '</div></div>';
      } else if (step === 'validate') {
        var res = validate(dr);
        if (res.valid && dr.stage === 'author') { dr.stage = 'validated'; dr.changed = false; top = stepNav(dr, step, id) + stripHtml(dr); }
        var groups = BLOCKS.map(function (b, i) {
          var f = res.fails.filter(function (x) { return x.block === b[0]; }), w = res.warns.filter(function (x) { return x.block === b[0]; });
          if (!f.length && !w.length) return '';
          function li(x, bad) { var fx = x.fix || {}; return '<li><span class="' + (bad ? 'e1-tone--critical' : 'e1-tone--warning') + '">' + c.icon(bad ? 'x' : 'alert', 16) + '</span><div><div class="rec-issues__rule">' + (x.text.indexOf(x.rule) === 0 ? (bad ? 'Semantic rule' : 'Lint') : esc(x.rule)) + (bad ? '' : ' · lint warning') + '</div><p class="rec-issues__t">' + esc(x.text) + '</p><p class="rec-issues__where">' + esc(x.where) + '</p></div>' + c.button('Fix', { size: 'sm', href: '#/records/studio/' + id + '?step=author&block=' + (fx.block || b[0]) + (fx.wt !== undefined ? '&wt=' + fx.wt : ''), iconRight: 'arrow-right' }) + '</li>'; }
          return blockCard(i + 1, b[0], b[1], (f.length ? fmt.plural(f.length, 'failure') : 'No failures') + ' · ' + fmt.plural(w.length, 'lint warning'), '<ul class="rec-issues" role="list">' + f.map(function (x) { return li(x, true); }).join('') + w.map(function (x) { return li(x, false); }).join('') + '</ul>');
        }).join('');
        var clean = BLOCKS.filter(function (b) { var n = blockIssues(res, b[0]); return !n.f && !n.w; }).map(function (b) { return tag(c.icon('check', 11) + ' ' + b[1]); }).join('');
        body = '<div class="rec-stack">' + (res.valid ?
          c.callout({ kind: 'good', title: 'Valid' + (res.warns.length ? ' — with ' + fmt.plural(res.warns.length, 'lint warning') : ''), body: '<p>Schema, L0-S01 to L0-S11 and every never-skippable gate check out. Lint warnings are about authoring, not outcomes; they do not block Simulate.</p>' }) :
          c.callout({ kind: 'critical', title: 'Not valid — ' + fmt.plural(res.fails.length, 'failure') + '. Simulate stays locked.', body: '<p>Each failure is shown against the block that caused it. Fix jumps to the field.</p>' })) +
          groups + (clean ? '<div class="rec-chips"><span class="rec-label">No issues</span>' + clean + '</div>' : '') +
          '<div class="e1-row" style="justify-content:space-between">' + c.button('Back to Author', { icon: 'arrow-left', href: '#/records/studio/' + id + '?step=author' }) +
          (res.valid ? c.button('Simulate', { kind: 'primary', iconRight: 'arrow-right', href: '#/records/studio/' + id + '?step=simulate' }) : c.button('Simulate — validate first', { disabled: true })) + '</div></div>';
      } else if (step === 'simulate') {
        if (reach < 1) body = blockedStep('Validate first', 'You cannot skip forward. Simulate runs only on a declaration that validates.', '#/records/studio/' + id + '?step=validate', 'Go to Validate');
        else body = '<div class="rec-stack">' + c.card({ body: '<div class="e1-row" style="justify-content:space-between"><div><p style="margin:0"><strong>Reference tenant</strong> · <span class="rec-mono">ref-tenant</span> · synthetic fixtures (C9 suite) · mode: sandbox</p><p class="rec-small rec-muted" style="margin:4px 0 0">Runs the write types against the reference tenant’s synthetic fixtures, never production records. Nothing is billed.</p></div>' +
          c.button(dr.sim ? 'Run again' : 'Run simulation', { kind: dr.sim ? 'secondary' : 'primary', icon: 'play', attrs: 'data-rec-act="run-sim"' }) + '</div>' }) +
          '<div id="rec-simout">' + (dr.sim ? simReport(dr, id) : c.empty({ icon: 'play', compact: true, title: 'Not run yet', why: 'Press Run simulation. Each write type reports the gates that would run, in order, the blast radius it resolves to, its meter basis and the refusals the fixtures produced.' })) + '</div>' +
          '<div class="e1-row" style="justify-content:space-between">' + c.button('Back to Validate', { icon: 'arrow-left', href: '#/records/studio/' + id + '?step=validate' }) + (dr.sim ? c.button('Continue to Certify', { kind: 'primary', iconRight: 'arrow-right', href: '#/records/studio/' + id + '?step=certify' }) : c.button('Continue to Certify — run it first', { disabled: true })) + '</div></div>';
      } else {
        if (reach < 2) body = blockedStep(reach < 1 ? 'Validate first' : 'Simulate first', 'You cannot skip forward. Certify opens once the declaration validates and has been simulated on the reference tenant.', '#/records/studio/' + id + '?step=' + (reach < 1 ? 'validate' : 'simulate'), reach < 1 ? 'Go to Validate' : 'Go to Simulate');
        else body = certifyBody(dr, id, q);
      }
      return stopBanner() + head + top + body;
    },
    mount: function (el, p, q) { mountStudio(el, p.id, q); }
  });

  function certifyBody(dr, id, q) {
    var res = validate(dr), last = DX[id] && DX[id].current ? DX[id].current : 0;
    var pinned = [['read.records', dg('1c0e', '44a2')], ['stage.write', dg('7ab2', '90d1')], ['act.write', dg('9e02', 'b3f1')]];
    var result = '';
    if (dr.certified) result = c.callout({ kind: 'good', title: 'Certified · ' + id + ' v' + dr.version + ' · by ' + dr.certified.by + ' · proof ' + seqTxt(dr.certified.seq) + ' · compiled digest 3b9e…c41d', body: '<p>Accepted at version ' + dr.version + '. COMPILE produced the surface plan, the registry entries and the meter basis per write type. Version ' + dr.version + ' is now resolvable; writes pinned to v' + (dr.version - 1) + ' keep resolving v' + (dr.version - 1) + '. Webhook <span class="rec-mono">declaration.certified</span> sent.</p><div class="e1-row">' + c.button('Open v' + dr.version, { href: '#/records/declarations/' + id + '/v/' + dr.version, kind: 'primary', icon: 'file-text' }) + c.button('Show the record', { href: '#/assurance/proof/' + dr.certified.seq, icon: 'proof' }) + '</div>' });
    else if (dr.certResult === 'same') result = c.refusal({ code: 'GATE.DUAL_CONTROL_SAME_ACTOR', title: 'You wrote this version, so you cannot also certify it', ruleName: 'G4 Dual control', rule: 'Certification is a governed write with dual control. A named person who is not the author must press Certify this version.', numbers: [{ label: 'Author', value: dr.author }, { label: 'Pressed by', value: dr.author }], action: { label: 'Send to Arjun Mehta', kind: 'primary', icon: 'send', attrs: 'data-rec-act="send-cert"' }, proofHref: '#/assurance/proof/4113', at: fmt.dateTime(new Date()) });
    else if (dr.certResult === 'sent') result = c.callout({ kind: 'info', title: 'Sent to Arjun Mehta. You will see the outcome here.', body: '<p>The obligation <a class="rec-mono" href="#/work/decide/OB-2026-0424">OB-2026-0424</a> is waiting on Arjun Mehta (elan1 lead, certifier). Switch “Certifying as” to see his screen.</p>' });
    else if (dr.certResult === 'registry') result = c.refusal({ code: 'PLATFORM.REGISTRY_UNAVAILABLE', title: 'Our failure — declaration registry down', action: { label: 'Try again', kind: 'primary', icon: 'refresh', attrs: 'data-rec-act="certify"' } }) + '<p class="rec-small rec-muted">Nothing was registered. Try again; it is safe.</p>';
    var who = '<div data-rec-seg="certAs">' + c.segmented([{ id: 'Farah Sheikh', label: 'Farah Sheikh' }, { id: 'Arjun Mehta', label: 'Arjun Mehta' }], dr.certAs, { name: 'certAs', label: 'Certifying as' }) + '</div>';
    return '<div class="rec-stack"><div id="rec-certout">' + result + '</div><div class="rec-split"><div class="rec-stack">' +
      c.card({ title: 'What you are certifying', body: c.kv([
        ['Declaration', id + ' · ' + dr.identity.name.val],
        ['Version', '<span class="rec-mono">v' + dr.version + '</span> ' + (dr.version === last + 1 ? c.badge('good', 'Version must be ' + dr.version + ' (last + 1) — holds', { subtle: true }) : c.badge('critical', 'Version must be ' + (last + 1) + ' (last + 1)')), { html: true }],
        ['Author', c.actor({ name: dr.author, kind: 'person', role: 'Declaration author (elan1)' }), { html: true }],
        ['Validate', res.valid ? 'Valid · ' + fmt.plural(res.warns.length, 'lint warning') : 'Not valid'],
        ['Simulate', dr.sim ? dr.sim.reduce(function (a, r) { return a + r.fixtures; }, 0) + ' fixtures · ' + dr.sim.reduce(function (a, r) { return a + r.refused; }, 0) + ' refusals produced' : 'Not run'],
        ['Compiled artefact digest', hashc(dg('3b9e', 'c41d'), 'Compiled digest') + ' <span class="rec-small rec-muted">preview until certified</span>', { html: true }],
        ['Surface plan', 'sp:' + dr.identity.slug.val + '@' + dr.version + '#3b9e…', { mono: true }]
      ]) }) +
      c.card({ title: 'Pinned tool descriptions', body: '<p class="rec-small rec-muted" style="margin:0 0 8px">The declaration pins each MCP tool description by hash. Changing one requires certification — we pay a certification for a typo fix.</p>' + c.table({ caption: 'Pinned tool descriptions', dense: true, columns: [{ key: 0, label: 'Tool', mono: true }, { key: 1, label: 'Description hash', html: true, render: function (r) { return hashc(r[1], 'Description hash'); } }], rows: pinned }) }) +
      '</div><div class="rec-stack">' +
      c.card({ title: 'Certify this version', body: '<div class="rec-stack rec-stack--sm"><p class="rec-small" style="margin:0">A named person presses this. Their name is on it. It is the governed write <span class="rec-mono">platform.declaration.certify</span> — whole tenant, irreversible, dual control.</p>' +
        '<span class="rec-label">Certifying as</span>' + who + '<p class="rec-small rec-muted" style="margin:0">Farah Sheikh wrote v' + dr.version + '; Arjun Mehta (elan1 lead) certifies. Prototype: choose who is at the keyboard.</p>' +
        c.button('Certify this version', { kind: 'gate', full: true, attrs: 'data-rec-act="certify"', disabled: !!dr.certified }) + '</div>' }) +
      (E1.atLeast('L2') ? '' : '<p class="rec-small rec-muted">' + c.level('L1', { short: true }) + ' The certification record is hash-chained, not signed. There is no “Signed by” row at L1.</p>') +
      '</div></div></div>';
  }

  function mountStudio(el, id, q) {
    var dr = studioDraft(id), wrap = el.querySelector('.rec-studio');
    var block = wrap ? wrap.getAttribute('data-block') : null, wi = wrap ? +wrap.getAttribute('data-wt') : 0;
    function refresh(full) {
      var bn = el.querySelector('#rec-bn'); if (bn) bn.outerHTML = blockNav(dr, block, id);
      var st = el.querySelector('#rec-strip'); if (st) st.outerHTML = stripHtml(dr);
      var sn = el.querySelector('.rec-snavwrap'); if (sn) sn.outerHTML = stepNav(dr, q.step || 'author', id);
      var pv = el.querySelector('#rec-pv'); if (pv) pv.outerHTML = previewHtml(dr, wi);
      if (full) { var ed = el.querySelector('#rec-ed'); if (ed) ed.outerHTML = editorFor(dr, block, wi, id); }
    }
    function inlineMsg(path) {
      var t = target(dr, path); if (!t) return;
      var m = el.querySelector('#' + pid(path) + '-m'); if (!m) return;
      if (/\.rev$/.test(path)) { m.innerHTML = isHonestFail(t.o.text) || !String(t.o.text || '').trim() ? '<p class="rec-inline-err" role="alert">' + c.icon('alert', 12) + '<span>' + HONEST + ' Declare a reversal plan, or irreversible: true.</span></p>' : '<p class="rec-inline-warn">' + c.icon('alert', 12) + '<span>Written down, but not declared. Choose Reversal plan or Irreversible.</span></p>'; return; }
      if (t.prop) m.innerHTML = msgFor(t.o, /^gates\.(rate|budget|schedule)|^pb\./.test(path));
    }
    el.addEventListener('input', function (e) {
      var t = e.target, path = t.getAttribute && t.getAttribute('data-p'); if (!path || t.tagName === 'SELECT' || t.type === 'checkbox') return;
      var v = t.value; if (/\.blast$/.test(path)) v = +v;
      setVal(dr, path, t.getAttribute('data-f'), v); inlineMsg(path); refresh(false);
    });
    el.addEventListener('change', function (e) {
      var t = e.target, path = t.getAttribute && t.getAttribute('data-p'); if (!path) return;
      if (t.tagName !== 'SELECT' && t.type !== 'checkbox') return;
      var v = t.type === 'checkbox' ? t.checked : t.value; if (/\.blast$/.test(path)) v = +v;
      setVal(dr, path, t.getAttribute('data-f'), v); refresh(true);
      E1.announce('Updated ' + path.replace(/\./g, ' '));
    });
    el.addEventListener('e1:change', function (e) {
      var host = e.target.closest ? e.target.closest('[data-rec-seg]') : null; if (!host) return;
      var path = host.getAttribute('data-rec-seg'), v = e.detail && e.detail.value;
      if (path === 'certAs') { dr.certAs = v; dr.certResult = null; var o = el.querySelector('#rec-certout'); if (o) o.innerHTML = ''; return; }
      if (/\.rev\.mode$/.test(path)) { dr.wts[+path.split('.')[1]].rev.mode = v; setVal(dr, path.replace(/\.mode$/, ''), 'mode', v); }
      else setVal(dr, path, 'disp', v);
      refresh(true);
    });
    el.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-rec-act]') : null; if (!b || b.disabled) return;
      var act = b.getAttribute('data-rec-act'), w = dr.wts[wi];
      if (act === 'save') { E1.toast('Draft v' + dr.version + ' saved. Nothing is resolvable until it is certified.', 'good', { title: 'Saved' }); return; }
      if (act === 'wt-add') { dr.wts.push({ name: 'erp.new_write_type.submit', label: '', intent: V(''), blast: 1, dual: 'no', threshold: '', gates: BASE5.slice(), rev: { mode: 'undecided', method: 'snapshot_restore', hours: 720, after: 'compensating_entry', text: '' }, ch: { web: 'submit · approve' }, isNew: true }); dr.stage = 'author'; dr.sim = null; E1.go('/records/studio/' + id, { step: 'author', block: 'write_types', wt: dr.wts.length - 1 }); return; }
      if (w && /^gate-/.test(act)) {
        var i = +b.getAttribute('data-i');
        if (act === 'gate-up' && i > 0) { w.gates.splice(i - 1, 0, w.gates.splice(i, 1)[0]); }
        if (act === 'gate-down' && i < w.gates.length - 1) { w.gates.splice(i + 1, 0, w.gates.splice(i, 1)[0]); }
        if (act === 'gate-rm') { var gone = w.gates.splice(i, 1)[0]; E1.announce(GATES[gone].name + ' removed'); }
        if (act === 'gate-add') { var sel = el.querySelector('#gate-add-sel'); if (sel) w.gates.push(sel.value); }
        setVal(dr, 'wt.' + wi + '.gates', null, w.gates); refresh(true); return;
      }
      if (act === 'run-sim') {
        var out = el.querySelector('#rec-simout'); if (out) out.innerHTML = c.skeleton({ kind: 'card' }) + c.skeleton({ kind: 'card' });
        b.disabled = true;
        setTimeout(function () { dr.sim = simulate(dr); if (STAGE_N[dr.stage] < 2) dr.stage = 'simulated'; E1.toast('Simulation finished on ref-tenant · ' + dr.sim.length + ' write types', 'info'); E1.render({ keepScroll: true }); }, 700);
        return;
      }
      if (act === 'add-fixture') { var n = b.getAttribute('data-wt'); dr.extraFixture[n] = true; dr.noFail[n] = false; dr.sim = simulate(dr); E1.toast('Fixture added: a customer with an unvalidated GSTIN. Simulation re-run.', 'info'); E1.render({ keepScroll: true }); return; }
      if (act === 'send-cert') { dr.certResult = 'sent'; E1.toast('Sent to Arjun Mehta. You will see the outcome here.', 'info', { action: { label: 'Open OB-2026-0424', href: '#/work/decide/OB-2026-0424' } }); E1.render({ keepScroll: true }); return; }
      if (act === 'certify') {
        if (q.state === 'registry-down' && dr.certResult !== 'registry') { dr.certResult = 'registry'; E1.render({ keepScroll: true }); return; }
        if (dr.certAs === dr.author) { dr.certResult = 'same'; E1.render({ keepScroll: true }); E1.announce('Not done. You wrote this version, so you cannot also certify it.'); return; }
        E1.confirm({ title: 'Certify ' + id + ' v' + dr.version + '?', eyebrow: 'Governed write · dual control', kind: 'gate', confirmLabel: 'Certify this version',
          body: '<p>You are <strong>Arjun Mehta</strong>. Your name goes on this version. Certification is irreversible: v' + dr.version + ' is kept verbatim for ever, and a later fix is a new version.</p>',
          onConfirm: function () { E1.toast('Recording your decision…', 'info', { timeout: 900 }); setTimeout(function () { dr.certified = { by: 'Arjun Mehta', seq: id === 'erp.ar' ? 4113 : 4114 }; dr.stage = 'certified'; dr.certResult = null; E1.announce('Certified. Proof ' + dr.certified.seq); E1.render({ keepScroll: true }); }, 800); } });
      }
    });
    el.addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && (q.step || 'author') === 'author') { e.preventDefault(); E1.go('/records/studio/' + id, { step: 'validate' }); } });
  }
  E1.action('rec-reset', function (el) { var id = el.getAttribute('data-value'); delete S.drafts[id]; E1.toast('Draft reset to its seed.', 'info'); E1.render(); });

  (function moreStyles() {
    var s = document.getElementById('rec-style'); if (!s) return;
    s.textContent += '\n' + [
      '.rec-snav{list-style:none;margin:0 0 12px;padding:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;border:1px solid var(--border-subtle);border-radius:var(--radius-md);overflow:hidden;background:var(--bg-surface);box-shadow:var(--shadow-1)}',
      '@media (max-width:760px){.rec-snav{grid-template-columns:repeat(2,minmax(0,1fr))}}',
      '.rec-snav__i>a,.rec-snav__i>span{display:flex;gap:10px;align-items:center;padding:12px 14px;text-decoration:none;color:var(--text-primary);height:100%;box-sizing:border-box}',
      '.rec-snav__i+.rec-snav__i{border-left:1px solid var(--border-subtle)}',
      '.rec-snav__i>a:hover{background:var(--bg-hover)}',
      '.rec-snav__i.is-current>a{background:var(--bg-surface);box-shadow:inset 0 -2px 0 var(--brand-clay)}',
      '.rec-snav__i.is-locked>span{color:var(--text-tertiary);background:var(--bg-canvas);cursor:not-allowed}',
      '.rec-snav__n{flex:none;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;border:1px solid var(--border-strong);font:var(--weight-semibold) var(--text-label)/1 var(--font-mono)}',
      '.rec-snav__i.is-done .rec-snav__n{background:var(--state-good-bg);border-color:var(--state-good-border);color:var(--state-good)}',
      '.rec-snav__i.is-locked .rec-snav__n{border-style:dashed}',
      '.rec-snav__t{display:flex;flex-direction:column;min-width:0}.rec-snav__t b{font-size:var(--text-body);font-weight:var(--weight-semibold)}.rec-snav__t small{font-size:var(--text-caption);color:var(--text-secondary)}',
      '.rec-strip{display:flex;flex-wrap:wrap;gap:8px 18px;align-items:center;padding:10px 14px;margin:0 0 16px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-sunken)}',
      '.rec-strip__i{display:inline-flex;align-items:center;gap:6px}',
      '.rec-strip .e1-actor__meta{display:none}'
    ].join('\n');
  })();

  /* ========================================================================
     WRITE TYPES
     ======================================================================== */
  function chCell(w, id) { var v = w.ch[id]; return v ? '<span class="rec-small">' + esc(v) + '</span>' : '<span class="rec-cell-none" title="Cannot be attempted from this route">—</span>'; }
  reg('/records/write-types', {
    title: 'Write types', section: 'write-types', keywords: 'blast radius reversal dual control gates channels meter basis',
    render: function (p, q) {
      var path = '/records/write-types', view = q.view === 'channels' ? 'channels' : 'list';
      var rows = WT.filter(function (w) {
        return (!q.decl || w.decl === q.decl) && (!q.blast || w.blast === +q.blast) && (!q.rev || (q.rev === 'irreversible' ? !w.rev : !!w.rev)) &&
          (!q.q || (w.name + ' ' + w.label).toLowerCase().indexOf(String(q.q).toLowerCase()) >= 0);
      });
      var head = c.pageHeader({ tabs: sibTabs('write-types'), title: 'Write types', eyebrow: 'Records · declare', lead: 'Every change that can be attempted, with its blast radius, reversal, dual control, gates in declared order and the channels that carry it. There is no generic write.',
        actions: stateMenu(path, [['empty', 'Empty'], ['error', 'Error']]) + c.segmented([{ id: 'list', label: 'Registry', href: E1.href(path, { decl: q.decl, blast: q.blast, rev: q.rev }), icon: 'list' }, { id: 'channels', label: 'Channel matrix', href: E1.href(path, { view: 'channels', decl: q.decl }), icon: 'grid' }], view, { label: 'View', size: 'sm' }) });
      if (q.state === 'error') return page(head, errorState('the write-type registry'));
      if (q.state === 'empty') return page(head, c.empty({ title: 'No write type is declared yet.', why: 'Write types exist only inside a certified declaration version. Without one, nothing can be attempted — there is no generic write.', action: { label: 'Open the Studio', href: '#/records/studio' } }));
      var covered = WT.filter(function (w) { return w.cov.live > 0; }).length;
      var filt = c.filters([{ label: 'Any radius', href: E1.href(path, { decl: q.decl, rev: q.rev, view: q.view }), active: !q.blast }].concat(c.BLAST.map(function (b, i) { return { label: b[1], href: E1.href(path, { blast: i + 1, decl: q.decl, rev: q.rev, view: q.view }), active: +q.blast === i + 1, count: WT.filter(function (w) { return w.blast === i + 1; }).length }; })), { label: 'Blast radius' }) +
        c.filters([{ label: 'All', href: E1.href(path, { blast: q.blast, decl: q.decl, view: q.view }), active: !q.rev }, { label: 'Reversible', href: E1.href(path, { rev: 'reversible', blast: q.blast, decl: q.decl, view: q.view }), active: q.rev === 'reversible' }, { label: 'Irreversible', href: E1.href(path, { rev: 'irreversible', blast: q.blast, decl: q.decl, view: q.view }), active: q.rev === 'irreversible' }], { label: 'Reversal', clearHref: (q.blast || q.rev || q.decl) ? E1.href(path, { view: q.view }) : null });
      var empty = { title: 'No write type matches', why: 'Nothing declared fits these filters.', action: { label: 'Clear filters', href: '#' + path } };
      var body;
      if (view === 'channels') body = c.table({ caption: 'Channel matrix', rowHref: function (w) { return '#/records/write-types/' + w.name; }, empty: empty, columns: [{ key: 'label', label: 'Write type', html: true, render: function (w) { return esc(w.label) + '<div class="rec-small rec-mono rec-muted">' + esc(w.name) + '</div>'; } }].concat(CHANNELS.map(function (ch) { return { key: ch.id, label: ch.name, html: true, render: function (w) { return chCell(w, ch.id); } }; })), rows: rows }) + '<p class="rec-table-note">A blank cell carries the text “cannot be attempted from this route”. It is not a permission question. WhatsApp reply-approval exists only where declared (one record, reversible).</p>';
      else body = c.table({ caption: 'Write types', rowHref: function (w) { return '#/records/write-types/' + w.name; }, empty: empty, columns: [
        { key: 'label', label: 'Write type', html: true, render: function (w) { return '<strong>' + esc(w.label) + '</strong><div class="rec-small rec-mono rec-muted">' + esc(w.name) + '</div>'; } },
        { key: 'decl', label: 'Declaration', render: function (w) { return '<a class="rec-mono rec-small" href="#/records/declarations/' + esc(w.decl) + '">' + esc(w.decl) + ' v' + w.ver + '</a>'; } },
        { key: 'blast', label: 'Blast radius', html: true, render: function (w) { return c.blast(w.blast, { compact: true }); } },
        { key: 'dual', label: 'Dual control', render: function (w) { return '<span class="rec-small">' + esc(w.dual) + '</span>'; } },
        { key: 'rev', label: 'Reversal', html: true, render: function (w) { return w.rev ? c.reversible(w.rev.h || true) : c.reversible(false); } },
        { key: 'gates', label: 'Gates', html: true, nowrap: true, render: function (w) { return c.tooltip('<span class="rec-small">' + w.gates.length + ' in order</span>', w.gates.map(function (g) { return GATES[g].name; }).join(' › ')) + '<div class="rec-small rec-muted">' + w.gates.filter(function (g) { return GATES[g].never; }).length + ' never skippable</div>'; } },
        { key: 'basis', label: 'Meter basis', render: function (w) { return '<span class="rec-small">' + BASIS[w.blast] + '</span>'; } },
        { key: 'cov', label: 'Coverage', html: true, nowrap: true, render: function (w) { return w.cov.live ? '<span class="rec-small"><span class="rec-mono">' + num(w.cov.live) + '</span> live · <span class="rec-mono">' + num(w.cov.modelled) + '</span> modelled</span>' : '<span class="rec-small rec-muted">modelled only · ' + num(w.cov.modelled) + '</span>'; } }
      ], rows: rows });
      return page(head, '<div class="rec-stats">' + c.stat({ label: 'Declared write types', value: String(WT.length), note: 'Across ' + DECLS.filter(function (d) { return d.current; }).length + ' certified declarations.' }) + c.stat({ label: 'Chain coverage', value: covered + ' of ' + WT.length, note: 'Write types with live entries in the checked chain. Never merged with modelled.', href: '#/assurance/coverage' }) + c.stat({ label: 'Irreversible', value: String(WT.filter(function (w) { return !w.rev; }).length), note: 'Never auto-approved; never offered “Reverse this”.', href: E1.href(path, { rev: 'irreversible' }) }) + c.stat({ label: 'Dual control always', value: String(WT.filter(function (w) { return /Always|forced|Yes/.test(w.dual); }).length), note: 'Whole-tenant and cross-boundary radius force it.' }) + '</div>' + filt + body);
    }
  });

  function reachableCodes(w) {
    var codes = [];
    w.gates.forEach(function (g) { GATES[g].codes.forEach(function (x) { codes.push([x, GATES[g].g + ' · rung 3']); }); });
    codes.push(['POLICY.ACTOR_NOT_PERMITTED', 'rung 1'], ['POLICY.DENIED_BY_RULE', 'rung 4'], ['POLICY.NO_RULE_MATCHED', 'rung 4'], ['POLICY.BLAST_RADIUS_EXCEEDED', 'rung 5'], ['POLICY.AUTONOMY_INSUFFICIENT', 'rung 6'], ['POLICY.APPROVAL_DECLINED', 'rung 6'], ['POLICY.OBLIGATION_EXPIRED', 'rung 6'], ['GATE.SANDBOX_DIVERGED', 'rung 7'], ['PLATFORM.TARGET_UNREACHABLE', 'rung 7 · our failure']);
    return codes;
  }
  reg('/records/write-types/:name', {
    title: function (p) { var w = wt(p.name); return w ? w.label : p.name; }, section: 'write-types', crumbs: [R, ['Write types', '#/records/write-types']], example: '/records/write-types/erp.sales_invoice.submit',
    render: function (p) {
      var w = wt(p.name);
      if (!w) return c.pageHeader({ title: p.name, eyebrow: 'Write type', back: ['Write types', '#/records/write-types'] }) + c.empty({ icon: 'refuse', title: 'This write type is not declared.', why: 'A write type exists only at an explicit declaration version. An intent naming it would be refused with POLICY.WRITE_TYPE_UNKNOWN.', fill: 'Publish a version that declares it.', action: [{ label: 'Open the Studio', href: '#/records/studio' }, { label: 'All write types', href: '#/records/write-types' }] });
      var head = c.pageHeader({ title: w.label, eyebrow: 'Write type · ' + w.decl + ' v' + w.ver, lead: w.intent, back: ['Write types', '#/records/write-types'],
        actions: c.button('Edit in Studio', { icon: 'edit', href: '#/records/studio/' + w.decl + '?step=author&block=write_types' }) + (/^erp\./.test(w.name) ? c.button('Request this', { kind: 'primary', icon: 'send', href: '#/work/request/' + w.name }) : ''),
        meta: mono(w.name) + ' ' + c.blast(w.blast, { compact: true }) + ' ' + (w.rev ? c.reversible(w.rev.h || true) : c.reversible(false)) + ' ' + c.badge('good', w.mode, { subtle: true, icon: 'lock' }) });
      var props = c.kv([
        ['Blast radius', c.blast(w.blast), { html: true }],
        ['Reversibility', w.rev ? c.reversible(w.rev.h || true) + ' <span class="rec-mono rec-small">' + esc(w.rev.m) + (w.rev.h ? ' · window_hours ' + w.rev.h : '') + ' · after_window ' + esc(w.rev.after) + '</span>' + (w.rev.note ? '<div class="rec-small rec-muted">' + esc(w.rev.note) + '</div>' : '') : c.reversible(false) + ' <span class="rec-small rec-muted">irreversible: true — cannot be auto-approved</span>', { html: true }],
        ['Dual control', w.dual],
        ['Autonomy cap', c.autonomy(w.cap, { compact: true }) + '<div class="rec-small rec-muted">' + (!w.rev ? 'Irreversible, so nothing above A2 Propose acts alone. No reversal plan means no A3 or above.' : 'The declaration caps grants here; raising a grant is itself a governed write.') + '</div>', { html: true }],
        ['Meter basis', BASIS[w.blast] + ' · 1 when committed, 0 for every refusal'],
        ['Enforcement mode', w.mode + ' · credential custody'],
        ['Obligation expiry', w.expiry || '4 h (declared default; asserted, not observed)'],
        ['Coverage', num(w.cov.live) + ' live · ' + num(w.cov.modelled) + ' modelled (reference tenant) — shown apart, never merged']
      ], { cols: 2 }) + (w.note ? c.callout({ kind: 'caveat', body: '<p>' + esc(w.note) + '</p>' }) : '');
      var gl = '<ol class="rec-gatelist" aria-label="Gates in declared order">' + w.gates.map(function (g, i) {
        return '<li><span class="rec-gl__n">' + (i + 1) + '</span><span class="rec-mono rec-small rec-muted">' + GATES[g].g + '</span><span><strong>' + esc(GATES[g].name) + '</strong> <span class="rec-small rec-muted">— ' + esc(GATES[g].asserts) + '</span></span><span class="rec-gl__a">' + (GATES[g].never ? tag(c.icon('lock', 11) + ' never skippable', 'lock') : tag('declared on')) + '</span></li>';
      }).join('') + '</ol><p class="rec-table-note">Declared order is semantic. Every gate runs, even after the first failure, and every result is recorded.</p>';
      var chm = '<div class="e1-table-wrap"><table class="e1-table is-dense rec-matrix"><caption class="e1-sr">Channels for this write type</caption><thead><tr>' + CHANNELS.map(function (ch) { return '<th scope="col">' + esc(ch.name) + '</th>'; }).join('') + '</tr></thead><tbody><tr>' + CHANNELS.map(function (ch) { return '<td>' + chCell(w, ch.id) + '</td>'; }).join('') + '</tr></tbody></table></div>';
      var grants = (w.decl === 'erp.ar' ? AR_GRANTS.filter(function (g) { return g.wt.indexOf(w.name) >= 0 || /every/.test(g.wt); }) : [{ kind: 'human', role: DX[w.decl] ? DX[w.decl].owner : 'Owner', wt: w.name, min: 'A4', approve: true }]).concat(AGENTS.filter(function (a) { return a.grants.some(function (g) { return g[0] === w.name; }) && w.decl !== 'erp.ar'; }).map(function (a) { return { kind: 'agent', role: a.name, wt: w.name, min: a.grants.filter(function (g) { return g[0] === w.name; })[0][1], approve: false }; }));
      var gtbl = c.table({ caption: 'Permission grants', dense: true, columns: [{ key: 'kind', label: 'Actor kind', render: function (g) { return esc(kindWord(g.kind)); } }, { key: 'role', label: 'Role or actor' }, { key: 'min', label: 'Autonomy', html: true, render: function (g) { return c.autonomy(g.min, { compact: true }); } }, { key: 'approve', label: 'May approve', render: function (g) { return g.approve ? 'Yes' : 'No'; } }], rows: grants });
      var recent = PROOF.concat(OLDER).filter(function (e) { return e.wt === w.name; }).sort(function (a, b) { return b.seq - a.seq; });
      var rtbl = c.table({ caption: 'Recent governed writes', rowHref: function (e) { return '#/assurance/proof/' + e.seq; }, empty: { compact: true, title: 'No governed write of this type in the recent chain', why: 'Coverage above says how many live and modelled entries exist in total.' }, columns: [
        { key: 'seq', label: 'Proof', render: function (e) { return mono(seqTxt(e.seq)); } }, { key: 'at', label: 'When', nowrap: true, render: function (e) { return esc(fmt.dateTime(e.at)); } },
        { key: 'actor', label: 'Actor', html: true, render: function (e) { return c.actor({ name: e.actor, kind: e.kind, size: 'sm' }); } },
        { key: 'o', label: 'Outcome', html: true, render: function (e) { return c.outcome(e.outcome, { code: e.code }); } },
        { key: 'obj', label: 'Object', html: true, render: function (e) { return OX[e.object] ? '<a href="#/records/object/' + esc(e.object) + '">' + esc(OX[e.object].title) + '</a>' : '<span class="rec-small">' + esc(e.object) + '</span>'; } }
      ], rows: recent });
      var codes = c.table({ caption: 'Refusal codes reachable', dense: true, columns: [{ key: 0, label: 'Code', render: function (x) { return '<a class="rec-mono rec-small" href="#/assurance/refusals/' + esc(x[0]) + '">' + esc(x[0]) + '</a>'; } }, { key: 1, label: 'Where', render: function (x) { return '<span class="rec-small">' + esc(x[1]) + '</span>'; } }], rows: reachableCodes(w) });
      return page(head,
        c.card({ title: 'Declared properties', body: props }) +
        '<div class="rec-two">' + c.card({ title: 'Gates, in declared order', body: gl }) + c.card({ title: 'Refusal codes reachable', body: codes }) + '</div>' +
        c.section({ id: 'channels', title: 'Channels', lead: 'A channel adapts; it never decides.', body: chm }) +
        c.section({ id: 'grants', title: 'Who may do this', lead: 'A control the actor may not use is not rendered at all.', body: gtbl }) +
        c.section({ id: 'recent', title: 'Recent writes', lead: 'Committed, not done and waiting on a person, side by side.', body: rtbl }));
    }
  });

  /* ========================================================================
     CHANGESETS AND RUNS
     ======================================================================== */
  function runCounts(r) { var n = { committed: 0, refused: 0, escalated: 0, staged: 0 }; r.items.forEach(function (i) { n[i.outcome]++; }); return n; }
  reg('/records/changesets', {
    title: 'Changesets and runs', section: 'changesets', keywords: 'overnight run agent batch migration',
    render: function (p, q) {
      var path = '/records/changesets';
      var head = c.pageHeader({ tabs: sibTabs('changesets'), title: 'Changesets and runs', eyebrow: 'Records · change', lead: 'What an overnight job or an agent run changed, write by write: each with its outcome, its proof and a link to the record in its host.', actions: stateMenu(path, [['empty', 'Empty'], ['error', 'Error']]) });
      if (q.state === 'error') return page(head, errorState('runs'));
      var rows = q.state === 'empty' ? [] : RUNS.filter(function (r) { return !q.kind || r.kind === q.kind; });
      var tbl = c.table({ caption: 'Runs', rowHref: function (r) { return '#/records/changesets/' + r.id; }, empty: { title: 'No run has changed anything yet.', why: 'A run appears here when an agent or a scheduled job submits one or more governed writes together.', fill: 'Standing agents such as close-agent and bank-recon-agent fill this list.', action: { label: 'See the agents', href: '#/agents/registry' } }, columns: [
        { key: 'name', label: 'Run', html: true, render: function (r) { return '<strong>' + esc(r.name) + '</strong><div class="rec-small rec-mono rec-muted">' + esc(r.id) + '</div>'; } },
        { key: 'agent', label: 'By', html: true, render: function (r) { return c.actor({ name: r.agent, kind: r.kind, size: 'sm', role: r.autonomy }); } },
        { key: 'when', label: 'When', nowrap: true, render: function (r) { return '<span class="rec-small">' + esc(fmt.dateTime(r.start)) + '<br>to ' + esc(fmt.time(r.end)) + '</span>'; } },
        { key: 'n', label: 'What it touched', html: true, render: function (r) { var n = runCounts(r); return '<span class="rec-small">' + [n.committed ? n.committed + ' committed' : '', n.refused ? n.refused + ' not done' : '', n.escalated ? n.escalated + ' waiting' : '', n.staged ? n.staged + ' staged' : ''].filter(Boolean).join(' · ') + '</span>'; } },
        { key: 'trigger', label: 'Trigger', render: function (r) { return '<span class="rec-small">' + esc(r.trigger) + '</span>'; } }
      ], rows: rows });
      return page(head, c.filters([{ label: 'All', href: '#' + path, active: !q.kind }, { label: 'Agent runs', href: E1.href(path, { kind: 'agent' }), active: q.kind === 'agent' }, { label: 'By a person', href: E1.href(path, { kind: 'person' }), active: q.kind === 'person' }], { label: 'Run by' }) + tbl +
        c.callout({ kind: 'info', body: '<p>A run is not a batch variant of the write path. Every item climbed the rungs on its own and left its own record; there is no fast path and no decision cache.</p>' }));
    }
  });
  reg('/records/changesets/:id', {
    title: function (p) { var r = RUNS.filter(function (x) { return x.id === p.id; })[0]; return r ? r.name : p.id; }, section: 'changesets', crumbs: [R, ['Changesets and runs', '#/records/changesets']], example: '/records/changesets/RUN-2026-0923-CLOSE',
    render: function (p) {
      var r = RUNS.filter(function (x) { return x.id === p.id; })[0];
      if (!r) return c.pageHeader({ title: p.id, eyebrow: 'Run', back: ['Changesets and runs', '#/records/changesets'] }) + c.empty({ icon: 'history', title: 'No run is recorded under this id.', why: 'Runs are listed by the agent or person who started them. This id is not one of them.', action: { label: 'All runs', href: '#/records/changesets' } });
      var n = runCounts(r);
      var head = c.pageHeader({ title: r.name, eyebrow: 'Run · ' + r.id, lead: r.summary, back: ['Changesets and runs', '#/records/changesets'],
        actions: (r.kind === 'agent' ? c.button('Open agent', { icon: 'agents', href: '#/agents/agent/' + (AGENTS.filter(function (a) { return a.name === r.agent; })[0] || {}).id }) : '') + hostBtn('Open in ERPNext', 'List/Journal Entry', { kind: 'secondary' }) });
      var tbl = c.table({ caption: 'What the run touched', columns: [
        { key: 'what', label: 'Change', html: true, render: function (i) { return (i.obj && OX[i.obj] ? '<a href="#/records/object/' + esc(i.obj) + '"><strong>' + esc(i.what) + '</strong></a>' : '<strong>' + esc(i.what) + '</strong>') + (i.note ? '<div class="rec-small rec-muted">' + esc(i.note) + '</div>' : ''); } },
        { key: 'wt', label: 'Write type', render: function (i) { return '<a class="rec-mono rec-small" href="#/records/write-types/' + esc(i.wt) + '">' + esc(i.wt) + '</a>'; } },
        { key: 'o', label: 'Outcome', html: true, render: function (i) { return i.outcome === 'staged' ? c.badge('info', 'Staged — not a write yet', { subtle: true, icon: 'edit' }) : c.outcome(i.outcome, { code: i.code }); } },
        { key: 'seq', label: 'Record', html: true, nowrap: true, render: function (i) { return i.seq ? seqLink(i.seq) : i.ob ? '<a class="rec-mono" href="#/work/decide/' + esc(i.ob) + '">' + esc(i.ob) + '</a>' : '<span class="rec-muted rec-small">No record (staging is not governed)</span>'; } },
        { key: 'host', label: 'Host', html: true, render: function (i) { return i.obj && OX[i.obj] && OX[i.obj].host ? hostBtn('Open', OX[i.obj].host, { size: 'sm', kind: 'ghost' }) : '<span class="rec-muted rec-small">—</span>'; } }
      ], rows: r.items });
      return page(head,
        '<div class="rec-stats">' + c.stat({ label: 'Committed', value: String(n.committed), note: 'Metered at the write type’s basis.' }) + c.stat({ label: 'Not done', value: String(n.refused), note: 'Refusals, recorded, metered at zero.' }) + c.stat({ label: 'Waiting on a person', value: String(n.escalated), note: 'The run stopped there; it does not retry.' }) + c.stat({ label: 'Staged', value: String(n.staged), note: 'Drafts a person must submit (A1).' }) + '</div>' +
        '<div class="rec-split"><div>' + c.section({ id: 'touched', title: 'What the run touched', body: tbl }) + '</div><div class="rec-stack">' +
        c.card({ title: 'Run', body: c.kv([['Started by', c.actor({ name: r.agent, kind: r.kind, role: r.autonomy }), { html: true }], ['Window', fmt.dateTime(r.start) + ' – ' + fmt.time(r.end)], ['Trigger', r.trigger], ['Autonomy', r.autonomy]], { cols: 1 }) }) +
        c.callout({ kind: 'rule', body: '<p>An escalated item stops the run for that item: “It stops; it does not retry.” A person resolves it in Work.</p>' }) + '</div></div>');
    }
  });

  /* ========================================================================
     ACTORS AND DELEGATIONS
     ======================================================================== */
  function lastAction(name) { var e = ALLP.filter(function (x) { return x.actor === name; }).sort(function (a, b) { return b.seq - a.seq; })[0]; return e; }
  function allActors() {
    return (E1.data.people || []).filter(function (p) { return p.kind !== 'system'; }).map(function (p) { return { id: p.id, name: p.name, kind: 'person', role: p.role, may: p.mayApprove }; })
      .concat(AGENTS.map(function (a) { return { id: a.id, name: a.name, kind: 'agent', role: 'Owner ' + a.owner + ' · ' + a.model, may: false }; }))
      .concat(SYSTEMS_ACTORS.concat([{ id: 'nightly-verifier', name: 'nightly-verifier' }]).filter(function (s, i, arr) { return arr.map(function (x) { return x.id; }).indexOf(s.id) === i; }).map(function (s) { var x = SYSTEMS_ACTORS.filter(function (y) { return y.id === s.id; })[0]; return { id: x.id, name: x.name, kind: 'system', role: x.role, may: false }; }));
  }
  function mayText(a) {
    if (a.kind !== 'person') return 'Never';
    if (a.may === 'certify') return 'Certifies declaration versions';
    if (a.may === true) return a.name === 'Venkat Raman' ? 'Invoices, credit notes, credit limits (ar-approvers)' : a.name === 'Ravi Shankar' ? 'Credit notes, purchase orders, payment runs' : 'Every write type (Owner)';
    if (a.may === null) return 'Authors declarations; approves nothing';
    return 'No';
  }
  reg('/records/actors', {
    title: 'Actors and delegations', section: 'actors', keywords: 'people agents systems delegation on behalf of',
    render: function (p, q) {
      var path = '/records/actors', kind = ['person', 'agent', 'system'].indexOf(q.kind) >= 0 ? q.kind : 'all';
      var list = allActors(), rows = list.filter(function (a) { return kind === 'all' || a.kind === kind; });
      var head = c.pageHeader({ tabs: sibTabs('actors'), title: 'Actors and delegations', eyebrow: 'Records · access', lead: 'Everyone and everything that can appear on a record: people, agents and system jobs, what each may approve, and who acts on whose behalf.', actions: stateMenu(path, [['error', 'Error']]) + c.button('People and roles', { href: '#/agents/people', icon: 'users' }) });
      if (q.state === 'error') return page(head, errorState('actors'));
      var tabs = tabsAsFilters([{ id: 'all', label: 'All', href: '#' + path, count: list.length }, { id: 'person', label: 'People', href: E1.href(path, { kind: 'person' }), count: list.filter(function (a) { return a.kind === 'person'; }).length }, { id: 'agent', label: 'Agents', href: E1.href(path, { kind: 'agent' }), count: AGENTS.length }, { id: 'system', label: 'Systems', href: E1.href(path, { kind: 'system' }), count: SYSTEMS_ACTORS.length }], kind, 'Kind');
      var tbl = c.table({ caption: 'Actors', rowHref: function (a) { return '#/records/actors/' + a.id; }, columns: [
        { key: 'name', label: 'Actor', html: true, render: function (a) { return c.actor({ name: a.name, kind: a.kind, role: a.role }); } },
        { key: 'kind', label: 'Kind', render: function (a) { return esc(kindWord(a.kind)); } },
        { key: 'may', label: 'May approve', render: function (a) { return '<span class="rec-small">' + esc(mayText(a)) + '</span>'; } },
        { key: 'del', label: 'Delegations', html: true, render: function (a) { var d = DELEGATIONS.filter(function (x) { return x.from === a.name || x.to === a.name; }); return d.length ? '<span class="rec-small">' + d.map(function (x) { return (x.to === a.name ? 'for ' + x.from : 'to ' + x.to) + ' · ' + x.status.toLowerCase(); }).join('<br>') + '</span>' : '<span class="rec-muted rec-small">None</span>'; } },
        { key: 'last', label: 'Last governed action', html: true, nowrap: true, render: function (a) { var e = lastAction(a.name); return e ? seqLink(e.seq, { prefix: false }) + ' <span class="rec-small rec-muted">' + esc(wtLabel(e.wt)) + '</span>' : '<span class="rec-muted rec-small">—</span>'; } }
      ], rows: rows });
      var dtbl = c.table({ caption: 'Delegations', rowHref: function (d) { return '#/records/actors/' + (personByName(d.to) || {}).id + '?tab=delegations'; }, columns: [
        { key: 'id', label: 'Delegation', mono: true },
        { key: 'who', label: 'Who acts for whom', html: true, render: function (d) { return '<strong>' + esc(d.to) + '</strong> on behalf of ' + esc(d.from); } },
        { key: 'wts', label: 'Write types', render: function (d) { return '<span class="rec-mono rec-small">' + esc(d.wts.join(', ')) + '</span>'; } },
        { key: 'win', label: 'Window', nowrap: true, render: function (d) { return '<span class="rec-small">' + esc(fmt.date(d.from_at)) + ' – ' + esc(fmt.date(d.until)) + '</span>'; } },
        { key: 'st', label: 'Status', html: true, render: function (d) { return c.badge(d.status === 'Active' ? 'good' : d.status === 'Lapsed' ? 'neutral' : 'info', d.status, { subtle: true }); } },
        { key: 'seq', label: 'Granted by', html: true, render: function (d) { return seqLink(d.seq); } }
      ], rows: DELEGATIONS });
      return page(head, tabs + tbl + c.section({ id: 'delegations', title: 'Delegations', lead: 'Delegation confers accountability, never autonomy. It names a person, never an agent, and is granted by a dual-control governed write.', body: dtbl }));
    }
  });
  reg('/records/actors/:id', {
    title: function (p) { var a = allActors().filter(function (x) { return x.id === p.id; })[0]; return a ? a.name : p.id; }, section: 'actors', crumbs: [R, ['Actors', '#/records/actors']], example: '/records/actors/venkat-raman',
    render: function (p) {
      var a = allActors().filter(function (x) { return x.id === p.id; })[0];
      if (!a) {
        var nm = p.id.split('-').map(function (s) { return s.charAt(0).toUpperCase() + s.slice(1); }).join(' ');
        a = { id: p.id, name: nm, kind: 'person', role: p.id === 'kavya-menon' ? 'elan1 certifier (platform declarations)' : 'Not in this tenant’s actor list', may: p.id === 'kavya-menon' ? 'certify' : false, synthetic: true };
      }
      var ag = AGENTS.filter(function (x) { return x.id === a.id; })[0];
      var acts = ALLP.filter(function (e) { return e.actor === a.name; }).sort(function (x, y) { return y.seq - x.seq; });
      var dels = DELEGATIONS.filter(function (d) { return d.from === a.name || d.to === a.name; });
      var head = c.pageHeader({ title: a.name, eyebrow: 'Actor · ' + kindWord(a.kind), lead: a.kind === 'agent' ? 'An agent: it may propose and, within its grant, act. It never approves.' : a.kind === 'system' ? 'A system job. It never approves and never writes to a host.' : 'A person. Their name is on every write they submit or approve.',
        back: ['Actors', '#/records/actors'],
        actions: (a.kind === 'agent' ? c.button('Agent in the registry', { href: '#/agents/agent/' + a.id, icon: 'agents' }) + c.button('Autonomy grants', { href: '#/agents/autonomy', icon: 'sliders' }) : a.kind === 'person' ? c.button('Person and roles', { href: '#/agents/people/' + a.id, icon: 'user' }) : ''),
        meta: c.actor({ name: a.name, kind: a.kind, role: a.role }) });
      var facts = a.kind === 'agent' ? c.kv([['Sponsor (the person behind it)', ag.owner], ['Model', ag.model], ['Channel', ag.channel], ['Enforcement mode', ag.mode], ['Tools', ag.tools.join(', '), { mono: true }], ['May approve', 'Never — an agent may never be an approver']], { cols: 2 }) :
        a.kind === 'system' ? c.kv([['Role', a.role], ['May approve', 'Never'], ['Note', (SYSTEMS_ACTORS.filter(function (s) { return s.id === a.id; })[0] || {}).note || '']], { cols: 1 }) :
        c.kv([['Role', a.role], ['May approve', mayText(a)], ['Resolver sets', a.name === 'Venkat Raman' ? 'ar-approvers' : a.name === 'Ravi Shankar' ? 'ap-approvers, ar-approvers (credit notes)' : a.name === 'Meenakshi Iyer' ? 'owners' : 'None'], ['Actor id', 'act_hum_' + a.id.replace(/-/g, '_'), { mono: true }]], { cols: 2 });
      var grants = ag ? c.table({ caption: 'Autonomy grants', columns: [{ key: 0, label: 'Write type', html: true, render: function (g) { return '<a href="#/records/write-types/' + esc(g[0]) + '">' + esc(wtLabel(g[0])) + '</a><div class="rec-small rec-mono rec-muted">' + esc(g[0]) + '</div>'; } }, { key: 1, label: 'Grant', html: true, render: function (g) { return c.autonomy(g[1], { compact: true }); } }], rows: ag.grants }) +
        (ag.id === 'ar-agent' ? c.callout({ kind: 'info', title: 'Description changed · version change · certified by Arjun Mehta, 19 Sep 2026', body: '<p>Tool <span class="rec-mono">act.write</span> description hash <span class="rec-mono">d41c…07aa</span> (erp.ar v6) → <span class="rec-mono">9e02…b3f1</span> (erp.ar v7). A changed description shows as a version change, never a silent update.</p>' }) : '') : '';
      var dtbl = dels.length ? c.table({ caption: 'Delegations', columns: [
        { key: 'id', label: 'Delegation', mono: true }, { key: 'who', label: 'Direction', html: true, render: function (d) { return d.to === a.name ? 'Acts for <strong>' + esc(d.from) + '</strong>' : '<strong>' + esc(d.to) + '</strong> acts for ' + esc(a.name); } },
        { key: 'wts', label: 'Write types', render: function (d) { return '<span class="rec-mono rec-small">' + esc(d.wts.join(', ')) + '</span>'; } },
        { key: 'win', label: 'Window', nowrap: true, render: function (d) { return '<span class="rec-small">' + esc(fmt.date(d.from_at)) + ' – ' + esc(fmt.date(d.until)) + '</span>'; } },
        { key: 'st', label: 'Status', html: true, render: function (d) { return c.badge(d.status === 'Active' ? 'good' : d.status === 'Lapsed' ? 'neutral' : 'info', d.status, { subtle: true }) + (d.status === 'Lapsed' ? '<div class="rec-small rec-muted">Writes on it refuse: POLICY.DELEGATION_INVALID</div>' : ''); } },
        { key: 'act', label: '', html: true, render: function (d) { return c.button(d.status === 'Lapsed' ? 'Renew delegation' : 'Extend', { size: 'sm', kind: d.status === 'Lapsed' ? 'primary' : 'secondary', attrs: 'data-action="rec-renew" data-value="' + esc(d.id) + '"' }); } }
      ], rows: dels }) : c.empty({ compact: true, icon: 'users', title: 'No delegation', why: a.kind === 'agent' ? 'Delegations name people only. An agent cannot hold or grant one.' : 'Nobody acts on ' + a.name + '’s behalf, and they act for nobody else.' });
      var tl = acts.length ? c.timeline(acts.slice(0, 10).map(function (e) { return tlItem(e); })) : c.empty({ compact: true, icon: 'history', title: 'No governed action in the recent chain', why: a.kind === 'system' ? 'System jobs read the chain; they do not appear on it as actors of a write.' : 'Nothing this actor did appears in the recent sample of the chain.' });
      return page(head, (a.synthetic ? c.callout({ kind: 'caveat', body: '<p>' + esc(a.name) + ' is not in ' + esc(tenantShort()) + '’s actor list. Shown from platform records.</p>' }) : '') +
        c.card({ title: 'Identity', body: facts }) +
        (grants ? c.section({ id: 'grants', title: 'Autonomy grants', lead: 'There is no API that sets an autonomy level; a change is itself a governed write. A missing grant is A0 Observe (no grant).', body: grants }) : '') +
        c.section({ id: 'delegations', title: 'Delegations', lead: 'Delegation confers accountability, never autonomy.', body: dtbl }) +
        c.section({ id: 'actions', title: 'Recent governed actions', lead: 'Refusals included.', body: tl }));
    }
  });
  E1.action('rec-renew', function (btn) {
    var d = DELEGATIONS.filter(function (x) { return x.id === btn.getAttribute('data-value'); })[0]; if (!d) return;
    var others = (E1.data.people || []).filter(function (p) { return p.kind === 'person' && p.mayApprove === true && p.name !== d.from && p.name !== d.to; });
    E1.modal({ title: (d.status === 'Lapsed' ? 'Renew ' : 'Extend ') + d.id, eyebrow: 'Governed write · platform.delegation.grant · dual control', size: 'md',
      body: '<div class="rec-stack rec-stack--sm"><p style="margin:0"><strong>' + esc(d.to) + '</strong> acts on behalf of <strong>' + esc(d.from) + '</strong> for <span class="rec-mono">' + esc(d.wts.join(', ')) + '</span>.</p>' +
        c.field('Until', c.input({ id: 'dl-until', type: 'date', value: '2026-10-31' }), { id: 'dl-until', help: 'A delegation always has an end date.' }) +
        c.field('Reason', c.textarea({ id: 'dl-why', rows: 2, placeholder: 'At least a sentence' }), { id: 'dl-why', required: true, help: 'Recorded on the proof. At least 12 characters.' }) +
        c.field('Second approver', c.select({ id: 'dl-who', options: others.map(function (p) { return { value: p.name, label: p.name + ' · ' + p.role }; }) }), { id: 'dl-who', help: 'People only. Not ' + d.from + ' or ' + d.to + '.' }) +
        '<p class="rec-small rec-muted" style="margin:0">Delegation confers accountability, never autonomy: ' + esc(d.to) + ' gains no autonomy grant from this.</p></div>',
      actions: [{ label: 'Cancel', kind: 'ghost' }, { label: 'Request renewal', kind: 'primary', onClick: function (e, close, m) {
        var why = m.querySelector('#dl-why'), msg = m.querySelector('#dl-why-msg');
        if (String(why.value).trim().length < 12) { why.setAttribute('aria-invalid', 'true'); if (msg) { msg.textContent = 'A reason needs at least a sentence (12 characters or more).'; msg.style.color = 'var(--state-critical)'; } why.focus(); return false; }
        var who = m.querySelector('#dl-who').value;
        E1.toast('Renewal requested · OB-2026-0429 is waiting on ' + who + '.', 'warning', { title: 'Waiting on a person', action: { label: 'Open OB-2026-0429', href: '#/work/decide/OB-2026-0429' } });
      } }] });
  });

  /* ========================================================================
     TENANTS (moved here from Agents by the re-scope) · stop switch (F7)
     ======================================================================== */
  var TSTATUS = { live: ['good', 'Live'], stopped: ['serious', 'Stopped'], onboarding: ['info', 'Onboarding'], 'pre-ga': ['neutral', 'Sandbox tenant · Pre-GA'], reference: ['neutral', 'Sandbox tenant · Reference'] };
  var STOPREQ = {};
  function tenantById(id) { return (E1.data.tenants || []).filter(function (t) { return t.id === id; })[0]; }
  function tStatus(t) { var s = TSTATUS[t.status] || ['neutral', t.status]; return c.badge(s[0], s[1] + (t.status === 'stopped' && t.stop ? ' · ' + t.stop.reason.toLowerCase() : ''), { icon: t.status === 'stopped' ? 'stop' : undefined }); }
  function stopBannerFor(t) {
    if (!t || t.status !== 'stopped' || !t.stop) return '';
    return '<div class="rec-gbanner" role="status"><span class="rec-gbanner__icon">' + c.icon('stop', 18) + '</span><div><p class="rec-gbanner__t">Tenant stopped</p><p>This workspace is stopped (' + esc(t.stop.reason.toLowerCase()) + ') since ' + esc(fmt.dateTime(t.stop.at)) + ', by ' + esc(t.stop.by[0]) + ' with ' + esc(t.stop.by[1]) + '. No writes, including refusals, are being recorded.</p></div></div>';
  }
  reg('/records/tenants', {
    title: 'Tenants', section: 'tenants', keywords: 'residency stop switch tenant status',
    render: function (p, q) {
      var path = '/records/tenants', all = E1.data.tenants || [];
      var rows = all.filter(function (t) { return !q.status || t.status === q.status || (q.status === 'sandbox' && t.env === 'sandbox'); });
      var head = c.pageHeader({ tabs: sibTabs('tenants'), title: 'Tenants', eyebrow: 'Records · access', lead: 'Each organisation elan1 governs writes for: where its data lives, whether it is live, and the stop switch that halts every write — refusals included.', actions: stateMenu(path, [['error', 'Error'], ['loading', 'Loading']]) });
      if (q.state === 'loading') return page(head, c.skeleton({ kind: 'table', rows: 6 }));
      if (q.state === 'error') return page(head, errorState('tenants'));
      var cnt = function (s) { return all.filter(function (t) { return t.status === s; }).length; };
      var chips = c.filters([{ label: 'All', href: '#' + path, active: !q.status, count: all.length }, { label: 'Live', href: E1.href(path, { status: 'live' }), active: q.status === 'live', count: cnt('live') }, { label: 'Stopped', href: E1.href(path, { status: 'stopped' }), active: q.status === 'stopped', count: cnt('stopped') }, { label: 'Onboarding', href: E1.href(path, { status: 'onboarding' }), active: q.status === 'onboarding', count: cnt('onboarding') }, { label: 'Sandbox tenants', href: E1.href(path, { status: 'sandbox' }), active: q.status === 'sandbox', count: all.filter(function (t) { return t.env === 'sandbox'; }).length }], { label: 'Status' });
      var tbl = c.table({ caption: 'Tenants', rowHref: function (t) { return '#/records/tenants/' + t.id; }, empty: { title: 'No tenant has this status', why: 'Try another filter.', action: { label: 'All tenants', href: '#' + path } }, columns: [
        { key: 'name', label: 'Tenant', html: true, render: function (t) { return '<strong>' + esc(t.name) + '</strong><div class="rec-small rec-muted">' + esc(t.city) + ' · <span class="rec-mono">' + esc(t.id) + '</span></div>'; } },
        { key: 'host', label: 'Host system', render: function (t) { return '<span class="rec-small">' + esc(t.host) + '</span>'; } },
        { key: 'res', label: 'Residency', render: function (t) { return '<span class="rec-small">' + esc(t.residency) + '</span>'; } },
        { key: 'env', label: 'Environment', render: function (t) { return t.env === 'sandbox' ? '<span class="rec-small">Sandbox tenant</span>' : '<span class="rec-small">Production</span>'; } },
        { key: 'mode', label: 'Mode', render: function (t) { return '<span class="rec-small">' + esc(t.mode) + '</span>'; } },
        { key: 'level', label: 'Level', html: true, render: function (t) { return c.level(t.level, { short: true }); } },
        { key: 'status', label: 'Status', html: true, render: function (t) { return tStatus(t) + (STOPREQ[t.id] ? '<div class="rec-small e1-tone--warning">Stop requested · ' + STOPREQ[t.id].ob + '</div>' : ''); } },
        { key: 'head', label: 'Chain head', align: 'right', render: function (t) { return t.chainHead ? mono(seqTxt(t.chainHead)) : '<span class="rec-muted">—</span>'; } }
      ], rows: rows });
      return page(head, chips + tbl + c.callout({ kind: 'rule', title: 'Throwing the stop is a governed write with dual control.', body: '<p>It stops all writes including refusals, and it is the only refusal without a proof record: every assert returns POLICY.TENANT_STOPPED with the reason class and the time the stop was set. The stop itself seals a record. There is no admin mode.</p>' }));
    }
  });
  reg('/records/tenants/:id', {
    title: function (p) { var t = tenantById(p.id); return t ? t.name : p.id; }, section: 'tenants', crumbs: [R, ['Tenants', '#/records/tenants']], example: '/records/tenants/nilgiri-tea',
    render: function (p) {
      var t = tenantById(p.id);
      if (!t) return c.pageHeader({ title: p.id, eyebrow: 'Tenant', back: ['Tenants', '#/records/tenants'] }) + c.empty({ icon: 'building', title: 'No tenant with this id.', why: 'Tenancy comes from the token, never from a call argument. This id is not one of the tenants you can act in.', action: { label: 'All tenants', href: '#/records/tenants' } });
      var x = TENANT_X[t.id] || {}, stopped = t.status === 'stopped', req = STOPREQ[t.id];
      var head = c.pageHeader({ title: t.name, eyebrow: 'Tenant · ' + t.id, lead: stopped ? 'Stopped. Nothing is written for this organisation — not even refusals — until two people lift the stop.' : 'Where this organisation’s data lives, how its writes are enforced, and the switch that stops them.',
        back: ['Tenants', '#/records/tenants'],
        actions: stopped ? c.button('Lift the stop', { kind: 'primary', icon: 'play', href: '#/records/tenants/' + t.id + '/stop' }) : (t.env === 'production' && t.status === 'live' ? c.button(req ? 'Stop requested' : 'Stop this tenant', { kind: 'danger', icon: 'stop', href: '#/records/tenants/' + t.id + '/stop' }) : ''),
        meta: tStatus(t) + ' ' + c.level(t.level) + ' ' + tag(esc(t.residency)) + ' ' + tag(t.env === 'sandbox' ? 'Sandbox tenant' : 'Production') });
      var facts = c.kv([['Legal name', t.name + ', ' + t.city], ['GSTIN', t.gstin || '—', { mono: true }], ['Host system', t.id === 'kaveri-spinning' ? '<a href="#/records/systems/erpnext-kaveri">' + esc(t.host) + '</a>' : esc(t.host), { html: true }], ['Residency domain', 'in · ' + t.region + ' (ap-south-1)'], ['Environment', t.env === 'sandbox' ? 'Sandbox tenant · synthetic data · not billed' : 'Production'], ['Enforcement mode', t.mode], ['Assurance level', c.level(t.level), { html: true }], ['Chain head', t.chainHead ? '<a class="rec-mono" href="#/assurance/chain">' + seqTxt(t.chainHead) + '</a>' : 'No entries yet', { html: true }], ['Pack', t.pack, { mono: true }], ['Hosting profile', x.hosting || '—'], ['Created', x.created || '—'], ['Contract', x.contract || '—'], ['Notice contact', (x.notice || '—') + ' — a person, not a distribution list'], ['Production owner', x.owner || '—']], { cols: 2 });
      var modes = c.table({ caption: 'Enforcement mode by channel', dense: true, columns: [{ key: 'name', label: 'Channel' }, { key: 'kind', label: 'kind', mono: true }, { key: 'mode', label: 'Mode', html: true, render: function (ch) { return t.mode.indexOf('advisory') >= 0 && (ch.id === 'mcp' || ch.id === 'api') ? c.badge('info', 'Attested advisory', { subtle: true }) : c.badge('good', 'Enforced', { subtle: true, icon: 'lock' }); } }], rows: CHANNELS });
      var stops = (x.stops || []);
      var stopCard = stopped ? c.card({ title: 'Stop event', body: c.kv([['Cause class', t.stop.reason], ['Set at', fmt.dateTime(t.stop.at)], ['Requested by', c.actor({ name: t.stop.by[0], kind: 'person', role: 'requester' }), { html: true }], ['Second approver', c.actor({ name: t.stop.by[1], kind: 'person', role: 'elan1 lead' }), { html: true }], ['Reason', stops[0] ? stops[0].reason : '—'], ['Record', 'The stop itself is ' + (stops[0] ? 'proof ' + seqTxt(stops[0].seq) + ' in this tenant’s chain' : 'recorded') ], ['Webhook', 'tenant.stopped', { mono: true }]], { cols: 1 }) + '<div class="e1-row" style="margin-top:12px">' + c.button('Lift the stop', { kind: 'primary', icon: 'play', href: '#/records/tenants/' + t.id + '/stop' }) + '</div>' }) :
        c.card({ title: 'Stop switch', body: '<p class="rec-small" style="margin:0 0 12px">Stopping halts every write for ' + esc(t.name) + ', including refusals, at rung 0b. It is a governed write with dual control, so it needs a second named person.</p>' + (req ? c.callout({ kind: 'warning', title: 'Stop requested · waiting on ' + req.second, body: '<p>' + esc(req.cause) + ' — “' + esc(req.reason) + '”. <a href="#/work/decide/' + req.ob + '">Open ' + req.ob + '</a>.</p>' }) : '') + (t.env === 'production' && t.status === 'live' ? c.button(req ? 'View the stop request' : 'Stop this tenant', { kind: 'danger', icon: 'stop', href: '#/records/tenants/' + t.id + '/stop', full: true }) : '<p class="rec-small rec-muted" style="margin:0">' + (t.env === 'sandbox' ? 'A sandbox tenant writes nothing to a live system; revoke its sandbox key instead.' : 'Not live yet: nothing to stop.') + '</p>') });
      var hist = c.table({ caption: 'Stop history', dense: true, empty: { compact: true, icon: 'history', title: 'Never stopped', why: 'Stop events are append-only: the latest event wins and nothing is updated. None has been written for this tenant.' }, columns: [{ key: 'at', label: 'When', render: function (s) { return esc(fmt.dateTime(s.at)); } }, { key: 'what', label: 'Event' }, { key: 'cause', label: 'Cause class' }, { key: 'by', label: 'By', render: function (s) { return esc(s.by + ' + ' + s.second); } }, { key: 'seq', label: 'Record', html: true, render: function (s) { return mono(seqTxt(s.seq)); } }], rows: stops });
      return stopBannerFor(t) + head + '<div class="rec-stack">' + '<div class="rec-split"><div class="rec-stack">' + c.card({ title: 'Tenant', body: facts }) + c.section({ id: 'modes', title: 'Enforcement mode by channel', lead: 'Declared per channel and write type, sealed, never set in a call.', body: modes }) + '</div><div class="rec-stack">' + stopCard + c.card({ title: 'Stop history', body: hist }) + '</div></div></div>';
    }
  });
  reg('/records/tenants/:id/stop', {
    title: function (p) { var t = tenantById(p.id); return t && t.status === 'stopped' ? 'Lift the stop' : 'Stop this tenant'; }, section: 'tenants', crumbs: [R, ['Tenants', '#/records/tenants']], example: '/records/tenants/kaveri-spinning/stop',
    render: function (p) {
      var t = tenantById(p.id);
      if (!t) return c.empty({ title: 'No tenant with this id.', why: 'There is nothing to stop here.', action: { label: 'All tenants', href: '#/records/tenants' } });
      var stopped = t.status === 'stopped', req = STOPREQ[t.id];
      var me = (E1.data.user || {}).name || 'Venkat Raman';
      var seconds = (E1.data.people || []).filter(function (x) { return x.kind === 'person' && (x.mayApprove === true || x.mayApprove === 'certify') && x.name !== me; });
      var head = c.pageHeader({ title: stopped ? 'Lift the stop on ' + t.name : 'Stop ' + t.name, eyebrow: 'Tenant · ' + (stopped ? 'lift stop' : 'stop switch') + ' · governed write · dual control', lead: stopped ? 'Lifting is the same pattern as stopping: a governed write, with a reason, approved by a second named person. Writes resume only when it commits.' : 'This stops all writes including refusals, for every agent and person in this tenant, until two people lift it.', back: [t.name, '#/records/tenants/' + t.id] });
      if (req && !stopped) return head + '<div class="rec-stack">' + c.callout({ kind: 'warning', title: 'Waiting on ' + req.second, body: '<p>Your request to stop ' + esc(t.name) + ' is recorded as an obligation. Nothing stops until ' + esc(req.second) + ' approves it in Decide.</p>' }) +
        c.card({ body: c.kv([['Obligation', '<a class="rec-mono" href="#/work/decide/' + req.ob + '">' + req.ob + '</a>', { html: true }], ['Cause class', req.cause], ['Reason', req.reason], ['Requested by', c.actor({ name: me, kind: 'person' }), { html: true }], ['Second approver', c.actor({ name: req.second, kind: 'person' }), { html: true }], ['Write type', 'platform.tenant.stop · Whole tenant · dual control', { mono: false }]]) }) +
        '<div class="e1-row">' + c.button('Open ' + req.ob, { kind: 'primary', href: '#/work/decide/' + req.ob }) + c.button('Withdraw the request', { kind: 'ghost', attrs: 'data-action="rec-stop-withdraw" data-value="' + esc(t.id) + '"' }) + '</div></div>';
      var causes = stopped ? '' : c.field('Cause class', '<div class="rec-stack rec-stack--sm" role="radiogroup" aria-label="Cause class">' + STOP_CAUSES.map(function (cz, i) { return c.radio({ name: 'cause', id: 'cz-' + i, value: cz, label: cz }); }).join('') + '</div>', { required: true, help: 'Named in every POLICY.TENANT_STOPPED refusal while the stop holds.' });
      var form = '<form id="rec-stopform" class="rec-stack" novalidate>' + (stopped ? stopBannerFor(t) : '') + causes +
        c.field('Reason', c.textarea({ id: 'st-why', rows: 3, placeholder: stopped ? 'What has been fixed, and how you know' : 'What happened, in a sentence or more' }), { id: 'st-why', required: true, help: 'At least a sentence. It is recorded on the stop event.' }) +
        c.field('Second approver', c.select({ id: 'st-who', options: seconds.map(function (x) { return { value: x.name, label: x.name + ' · ' + x.role }; }) }), { id: 'st-who', help: 'People only. You cannot approve your own request.' }) +
        c.callout({ kind: stopped ? 'info' : 'caveat', title: stopped ? 'Writes resume only after the second approval commits.' : 'This stops all writes including refusals.', body: stopped ? '<p>Agents that were refused POLICY.TENANT_STOPPED do not retry on their own; people resubmit what still matters.</p>' : '<p>Every assert for ' + esc(t.name) + ' returns POLICY.TENANT_STOPPED, carrying the cause class and the time the stop was set, and writes no chain entry. Open obligations keep their clocks paused. The stop itself seals a record.</p>' }) +
        '<div class="e1-row">' + c.button(stopped ? 'Request to lift the stop' : 'Request stop', { kind: stopped ? 'primary' : 'danger', type: 'submit', icon: stopped ? 'play' : 'stop' }) + c.button('Cancel', { kind: 'ghost', href: '#/records/tenants/' + t.id }) + '</div></form>';
      return head + '<div class="rec-split">' + c.card({ body: form }) + '<div class="rec-stack">' + c.card({ title: 'What happens', body: '<ol class="rec-small" style="margin:0;padding-left:18px"><li>Your request becomes an obligation for the second approver.</li><li>They decide in Work → Decide, with your reason in front of them.</li><li>' + (stopped ? 'On approval the stop lifts; the lift seals its own record.' : 'On approval the tenant turns Stopped, every console shows the banner, and webhook tenant.stopped fires.') + '</li></ol>' }) +
        c.card({ title: 'The governed write', body: c.kv([['Write type', 'platform.tenant.stop', { mono: true }], ['Blast radius', c.blast(4, { compact: true }), { html: true }], ['Dual control', 'Always'], ['Undo', stopped ? 'This is the undo' : 'Lift the stop (also dual control)']], { cols: 1 }) }) + '</div></div>';
    },
    mount: function (el, p) {
      var f = el.querySelector('#rec-stopform'); if (!f) return;
      var t = tenantById(p.id), stopped = t.status === 'stopped';
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var why = el.querySelector('#st-why'), msg = el.querySelector('#st-why-msg'), cause = el.querySelector('input[name="cause"]:checked');
        var ok = true;
        if (!stopped && !cause) { ok = false; E1.toast('Choose a cause class.', 'warning'); }
        if (String(why.value).trim().length < 12 || isHonestFail(why.value)) { ok = false; why.setAttribute('aria-invalid', 'true'); if (msg) { msg.textContent = 'A reason needs at least a sentence (12 characters or more).'; msg.style.color = 'var(--state-critical)'; } why.focus(); }
        if (!ok) return;
        var second = el.querySelector('#st-who').value;
        E1.confirm({ title: stopped ? 'Request to lift the stop?' : 'Request a stop of ' + t.name + '?', eyebrow: 'Governed write · dual control', kind: stopped ? 'primary' : 'danger', confirmLabel: stopped ? 'Request lift' : 'Request stop',
          body: '<p>' + (stopped ? 'Writes resume only after ' : 'Nothing stops until ') + '<strong>' + esc(second) + '</strong> approves it. Your reason is recorded on the event.</p>',
          onConfirm: function () {
            var ob = stopped ? 'OB-2026-0430' : 'OB-2026-0426';
            if (!stopped) STOPREQ[t.id] = { ob: ob, cause: cause.value, reason: why.value, second: second };
            E1.toast((stopped ? 'Lift requested' : 'Stop requested') + ' · ' + ob + ' is waiting on ' + second + '.', 'warning', { title: 'Waiting on a person', action: { label: 'Open ' + ob, href: '#/work/decide/' + ob } });
            if (stopped) E1.go('/records/tenants/' + t.id); else E1.render();
          } });
      });
    }
  });
  E1.action('rec-stop-withdraw', function (b) { delete STOPREQ[b.getAttribute('data-value')]; E1.toast('Stop request withdrawn. The withdrawal is recorded.', 'info'); E1.render(); });

  /* ========================================================================
     PACKS (configuration, not code; the sellable unit of L2)
     ======================================================================== */
  var REJECTED = [['agri1', 'G-B', 'Subsidy audits are annual and on paper.'], ['legal1', 'G-E', 'We would read somebody else’s log; reading a log is observation.'], ['energy1', 'G-E', 'The write path belongs to SCADA vendors.'], ['public1', 'G-A, G-D', 'No dated hook, and nobody buys the evidence separately.'], ['edu1', 'G-D', 'Evidence is a nice-to-have attached to something else.'], ['retail1', 'G-B', 'Nobody audits a price change.']];
  function packTests(pk) { var t = pk.tests || []; return { passed: t.filter(function (x) { return x[2] === 'passed'; }).length, total: 8 }; }
  function scoreBadge(s) { return s === 'pass' ? c.badge('good', 'Pass') : s === 'provisional' ? c.badge('warning', 'Pass, provisionally') : s === 'partial' ? c.badge('warning', 'Partial') : s === 'open' ? c.badge('neutral', 'Open') : c.badge('critical', 'Fail'); }
  function promise(pk) {
    return '<div class="rec-promise"><div><p class="rec-label">What it gives you</p><ol><li>Every governed change of these types went through stated rules, with a named actor and, where required, a named approver.</li><li>Here is a file covering a period you choose. Your auditor can check it on their own machine, offline, with software they did not get from us.</li><li>Here is what that file does not establish, in the profile’s own words, printed in every report.</li></ol></div>' +
      '<div><p class="rec-label">What it does not establish</p><p>' + esc(pk.limits) + '</p></div></div>';
  }
  reg('/records/packs', {
    title: 'Packs', section: 'packs', keywords: 'ledger1 invoice1 collect1 regulatory pack',
    render: function (p, q) {
      var path = '/records/packs';
      var head = c.pageHeader({ tabs: sibTabs('packs'), title: 'Packs', eyebrow: 'Records · change', lead: 'A pack is one declaration, one certified verifier profile and one export mapping, aimed at one buyer with one auditor under one dated obligation. Packs are the sale. Screens are the surface.', actions: stateMenu(path, [['empty', 'Empty — no pack installed']]) });
      if (q.state === 'empty') return page(head, c.empty({ icon: 'package', title: 'No packs installed.', why: 'A pack is one declaration, one certified verifier profile and one export mapping for one dated obligation.', fill: 'ledger1, the First India Pack, is first. Its evidence arrives at Assurance Level 2.', action: { label: 'Look at ledger1', href: '#/records/packs/ledger1' } }));
      var cards = '<div class="e1-grid e1-grid--3">' + PACKS.map(function (pk) {
        var t = packTests(pk);
        return c.card({ eyebrow: pk.title, title: pk.name, actions: c.badge(pk.tone, pk.status.split(' · ')[0].split(' — ')[0], { subtle: true }), body:
          '<div class="rec-stack rec-stack--sm"><p class="rec-small" style="margin:0">' + esc(pk.domain) + '</p>' +
          c.kv([['Obligation', pk.inForce], ['Auditor', pk.auditor], ['Profile', pk.profile], ['Price', pk.price]], { cols: 1, compact: true }) +
          (pk.tests.length ? c.progress(t.passed, 8, { label: 'Pack tests T1–T8', note: t.passed + ' of 8 passed', state: 'accent' }) : '<p class="rec-small rec-muted" style="margin:0">Tests not defined yet — spec sketch.</p>') + '</div>',
          footer: c.button('Open ' + pk.name, { href: '#/records/packs/' + pk.id, size: 'sm', iconRight: 'arrow-right' }) });
      }).join('') + '</div>';
      var rej = c.table({ caption: 'Portfolio register', dense: true, columns: [{ key: 0, label: 'Candidate', mono: true }, { key: 1, label: 'Gate failed' }, { key: 2, label: 'The sentence' }], rows: REJECTED });
      return page(head, cards +
        c.callout({ kind: 'rule', body: '<p>Packs live under Records and are verified under Assurance — never a fifth door. A pack is configuration: the kernel has no pack table. A gate scored “probably” is scored fail.</p>' }) +
        c.section({ id: 'register', title: 'Rejected by name', lead: 'The portfolio register. It is not softened, parked or renamed.', body: rej }));
    }
  });
  reg('/records/packs/:id', {
    title: function (p) { return PKX[p.id] ? PKX[p.id].name + ' · ' + PKX[p.id].title : p.id; }, section: 'packs', crumbs: [R, ['Packs', '#/records/packs']], example: '/records/packs/ledger1',
    render: function (p, q) {
      var pk = PKX[p.id];
      if (!pk) return c.pageHeader({ title: p.id, eyebrow: 'Pack', back: ['Packs', '#/records/packs'] }) + c.empty({ icon: 'package', title: 'No pack called “' + p.id + '”.', why: 'The packs are ledger1, invoice1 and collect1. Other candidates are either in the portfolio register or not yet scored.', action: { label: 'All packs', href: '#/records/packs' } });
      var path = '/records/packs/' + pk.id, tab = q.tab || 'overview';
      var tabs = c.tabs([['overview', 'Overview'], ['gates', 'Pack gates'], ['write-types', 'Write types'], ['declared', 'Gates'], ['clauses', 'Clause to proof'], ['tests', 'Tests'], ['pilot', 'Pilot']].map(function (t) { return { id: t[0], label: t[1], href: E1.href(path, { tab: t[0] === 'overview' ? null : t[0] }) }; }), tab, { label: 'Pack blocks' });
      var head = c.pageHeader({ tabs: tabs, title: pk.name + ' · ' + pk.title, eyebrow: 'Pack · configuration, not code', lead: pk.domain, back: ['Packs', '#/records/packs'],
        actions: (pk.id === 'ledger1' ? c.button('Open profile', { href: '#/assurance/profiles/in-mca-audit-trail', icon: 'file-text' }) : '') + c.button('Install pack', { kind: 'primary', icon: 'download', href: '#/records/packs/' + pk.id + '/install' }),
        meta: c.badge(pk.tone, pk.status) + ' ' + tag('min level ' + pk.minLevel) + ' ' + tag(esc(pk.price)) });
      var body;
      if (tab === 'gates') body = c.table({ caption: 'Pack gate scores', columns: [{ key: 0, label: 'Gate', mono: true }, { key: 1, label: 'Test' }, { key: 2, label: 'Score', html: true, render: function (s) { return scoreBadge(s[2]); } }, { key: 3, label: 'Sentence' }], rows: pk.scores }) + '<p class="rec-table-note">All five must pass. A gate scored “probably” is scored fail. Scores are kept for ever.</p>';
      else if (tab === 'write-types') body = c.table({ caption: 'Pack write types', columns: [{ key: 0, label: 'Write type', mono: true }, { key: 1, label: 'Blast radius', html: true, render: function (w) { return w[1] === '—' ? '<span class="rec-muted">—</span>' : c.blast(w[1], { compact: true }); } }, { key: 2, label: 'Reversal' }, { key: 3, label: 'Dual control' }], rows: pk.wts });
      else if (tab === 'declared') body = (pk.gates.length ? '<ol class="rec-gatelist" aria-label="Gates in declared order">' + pk.gates.map(function (g, i) { return '<li><span class="rec-gl__n">' + (i + 1) + '</span><span class="rec-mono rec-small rec-muted">' + GATES[g].g + '</span><span>' + esc(GATES[g].name) + '</span><span class="rec-gl__a">' + (GATES[g].never ? tag(c.icon('lock', 11) + ' never skippable', 'lock') : tag('declared on', 'accent')) + '</span></li>'; }).join('') + '</ol>' : '') + '<p class="rec-small" style="margin:12px 0 0">' + esc(pk.gateNote) + '</p>';
      else if (tab === 'clauses') body = pk.clauses.length ? '<div class="rec-stack"><div class="rec-links" aria-label="Five-link chain">' + [['Regulation clause', 'Rule 3(1) · audit trail', 'in-mca-audit-trail v1'], ['Control', 'C-AT-01 v1 · preventive', 'Phase 4 — specified, not built'], ['Gate', 'precondition, retention', 'erp.ar v7'], ['Write type', 'sales_invoice.submit', 'one counterparty'], ['Proof field', 'F04 · F09 · F10 · F16 · F03', 'F14 ← proof_binding']].map(function (l) { return '<div class="rec-link"><span class="rec-label">' + esc(l[0]) + '</span><b>' + esc(l[1]) + '</b><code>' + esc(l[2]) + '</code></div>'; }).join('') + '</div>' +
        c.table({ caption: 'Clauses to checks', columns: [{ key: 0, label: 'Clause (quoted)' }, { key: 1, label: 'Obligation kind', mono: true }, { key: 2, label: 'Write types', mono: true }, { key: 3, label: 'Gates', mono: true }, { key: 4, label: 'Fields', mono: true }, { key: 5, label: 'Checks', mono: true }], rows: pk.clauses }) +
        c.callout({ kind: 'info', body: '<p>C06 on an L1 dry run reads <span class="rec-mono">not_applicable — assurance level 1</span>. That single row is the clearest available demonstration of what L2 buys. Controls and Regulations families arrive later; today a verifier profile is the unit.</p>' }) + '</div>' :
        c.empty({ compact: true, icon: 'scale', title: 'No clause map yet', why: pk.id === 'collect1' ? 'Spec sketch: rule citations need counsel confirmation before any clause is bound.' : 'The profile for this pack is not authored yet, so no clause is bound to a check.' });
      else if (tab === 'tests') body = pk.tests.length ? c.table({ caption: 'Pack tests', columns: [{ key: 0, label: 'Test', mono: true }, { key: 1, label: 'Name' }, { key: 2, label: 'Result', html: true, render: function (t) { return t[2] === 'passed' ? c.badge('good', 'Passed') : c.badge('neutral', 'Not run', { icon: 'minus' }); } }, { key: 3, label: 'Evidence', render: function (t) { return '<span class="rec-small">' + esc(t[3]) + '</span>'; } }], rows: pk.tests }) : c.empty({ compact: true, title: 'No tests yet', why: 'Spec sketch. T1–T8 are defined when the pack is admitted.' });
      else if (tab === 'pilot') body = c.card({ body: '<p style="margin:0">' + esc(pk.pilot) + '</p>' }) + c.callout({ kind: 'rule', body: '<p>A conversation with an auditor is never described, internally or externally, as validation.</p>' });
      else body = '<div class="rec-two">' + c.card({ title: 'Identity and obligation', body: c.kv([['pack_id', pk.id, { mono: true }], ['Version', '1'], ['Owner role', pk.owner], ['Obligation', pk.regime], ['Dated hook', pk.inForce]].concat(pk.hook ? [['Hook', pk.hook]] : []), { cols: 1 }) }) +
        c.card({ title: 'Buyer and auditor', body: c.kv([['Buyer', pk.buyer], ['Auditor', pk.auditor], ['Declaration', pk.id === 'collect1' ? 'Not authored' : 'rung1’s ERPNext declaration at the version current at pilot start · erp.ar v7, erp.gl v2'], ['Profile binding', pk.profile + ' · min_assurance_level 2 · refusals_required · continuity full_chain'], ['Price', pk.price]], { cols: 1 }) }) + '</div>';
      return page(head, (tab === 'overview' ? promise(pk) : '') + '<div>' + body + '</div>');
    }
  });
  var INSTALL = [['Level check', 'min_assurance_level: 2. The tenant must be at L2 Attested.'], ['Declaration match', 'The tenant’s declaration contains the pack’s write types at the pinned version, gates in order.'], ['proof_binding addition', 'A new declaration version adds the fields the profile needs, certified under dual control.'], ['Profile install', 'applies_to_records_from must not be later than the tenant’s boundary; otherwise both dates are printed.'], ['Dry export', 'Export and verify once. A 2 FAIL_PROFILE here is expected and useful.'], ['First bundle', 'The tenant exports the first bundle themselves and verifies it.']];
  reg('/records/packs/:id/install', {
    title: function (p) { return 'Install ' + p.id; }, section: 'packs', crumbs: [R, ['Packs', '#/records/packs']], example: '/records/packs/ledger1/install',
    render: function (p, q) {
      var pk = PKX[p.id];
      if (!pk) return c.empty({ title: 'No pack called “' + p.id + '”.', why: 'Nothing to install.', action: { label: 'All packs', href: '#/records/packs' } });
      var head = c.pageHeader({ title: 'Install ' + pk.name, eyebrow: 'Pack · install · governed', lead: 'Binding a pack to a tenant is a governed write, refused if the pack’s minimum level is above the tenant’s — with the shortfall printed.', back: [pk.name, '#/records/packs/' + pk.id] });
      if (pk.id !== 'ledger1') return head + c.card({ body: c.empty({ icon: 'package', title: pk.name + ' cannot be installed yet.', why: pk.status + '. ' + (pk.id === 'collect1' ? 'Nothing is installable from a spec sketch.' : 'Its verifier profile is not certified, so there is nothing to bind.'), action: [{ label: 'Back to ' + pk.name, href: '#/records/packs/' + pk.id }, { label: 'Install ledger1 instead', href: '#/records/packs/ledger1/install' }] }) });
      var L2 = E1.atLeast('L2'), step = Math.max(1, Math.min(7, parseInt(q.step, 10) || 1));
      if (!L2) step = 1;
      var list = '<ol class="rec-steps" role="list">' + INSTALL.map(function (s, i) {
        var n = i + 1, st = !L2 ? (n === 1 ? 'blocked' : 'todo') : n < step ? 'done' : n === step ? 'current' : 'todo';
        var extra = '';
        if (n === 1 && !L2) extra = '<div class="rec-step__b">' + c.refusal({ code: 'POLICY.DENIED_BY_RULE', title: 'Not done — ledger1 requires Level 2 (min_assurance_level: 2)', rule: 'A pack is bound to a tenant only at or above its minimum assurance level.', numbers: [{ label: 'Required', value: 'L2 Attested' }, { label: 'This tenant', value: E1.state.level + ' ' + E1.LEVELS[E1.state.level].name }], action: { label: 'Upgrade to L2', href: '#/assurance/upgrade', kind: 'primary' } }) + '<div style="margin-top:10px">' + c.button('Preview as L2', { icon: 'eye', attrs: 'data-action="level" data-value="L2"' }) + '</div></div>';
        else if (st === 'current') {
          var detail = n === 1 ? 'Tenant is at ' + E1.state.level + ' ' + E1.LEVELS[E1.state.level].name + '. Check passes.' : n === 2 ? 'erp.ar v7 and erp.gl v2 contain all six write types; gates in order: consent › residency › retention › counterparty › precondition › dual control › budget.' : n === 3 ? 'erp.ar v9 adds the proof_binding fields the profile expects. It goes through the Studio and a named certifier.' : n === 4 ? 'in-mca-audit-trail v1 · applies_to_records_from 2027-07-01 · tenant boundary seq B checked.' : n === 5 ? 'Dry export verified: 2 FAIL_PROFILE on the pre-boundary range, as expected; 0 PASS on the bound range.' : 'The tenant exports the first bundle without our help and runs the offline verifier.';
          var btn = n === 3 ? c.button('Open proof_binding in Studio', { href: '#/records/studio/erp.ar?step=author&block=proof_binding', icon: 'edit' }) + ' ' : n === 6 ? c.button('Go to evidence export', { href: '#/assurance/export', icon: 'export' }) + ' ' : '';
          extra = '<div class="rec-step__b"><p style="margin:0 0 10px">' + esc(detail) + '</p>' + btn + c.button(n === 6 ? 'Finish install' : 'Mark done and continue', { kind: 'primary', href: '#/records/packs/ledger1/install?step=' + (n + 1), iconRight: 'arrow-right' }) + '</div>';
        } else extra = '<div class="rec-step__b">' + esc(s[1]) + '</div>';
        return '<li class="' + (st === 'current' ? 'is-current' : st === 'todo' ? 'is-todo' : '') + '"><div class="rec-step__h"><span class="rec-step__n ' + (st === 'done' ? 'is-done' : st === 'blocked' ? 'is-blocked' : '') + '">' + (st === 'done' ? c.icon('check', 12) : st === 'blocked' ? c.icon('lock', 12) : n) + '</span><h3>' + esc(s[0]) + '</h3>' + (st === 'done' ? c.badge('good', 'Done', { subtle: true }) : st === 'blocked' ? c.badge('neutral', 'Not done', { subtle: true, icon: 'refuse' }) : '') + '</div>' + extra + '</li>';
      }).join('') + '</ol>';
      var done = L2 && step >= 7 ? c.callout({ kind: 'good', title: 'ledger1 installed · profile in-mca-audit-trail v1 · applies to records from 2027-07-01', body: '<p>Preview at L2. Records before the boundary stay Level 1 for ever and are not signed retrospectively.</p>' }) : '';
      return head + '<div class="rec-split"><div class="rec-stack">' + done + list + '</div><div class="rec-stack">' + promise(pk) + '</div></div>';
    }
  });

  /* ========================================================================
     LEXICON · RULE SETS
     ======================================================================== */
  function lexPage(ver) {
    var v = LEXICON.versions.filter(function (x) { return x.id === ver; })[0] || LEXICON.versions[0];
    var terms = LEXICON.terms.filter(function (t) { return v.id === '2026-09' || t[4] === '2026-08'; }).map(function (t) { return v.id === '2026-08' && t[0] === 'credit exposure' ? [t[0], 'What the customer owes now: outstanding invoices, before this write.', t[2], t[3], '2026-08'] : t; });
    if (v.id === '2026-08' && !terms.some(function (t) { return t[0] === 'credit exposure'; })) terms.splice(1, 0, ['credit exposure', 'What the customer owes now: outstanding invoices, before this write.', 'Customer.outstanding', '₹', '2026-08']);
    var head = c.pageHeader({ tabs: sibTabs('lexicon'), title: 'Lexicon', eyebrow: 'Records · declare · ' + LEXICON.ref.replace('2026-09', v.id), lead: 'The term set a declaration uses. Its hash is sealed into every record as F15, so “credit limit” means years from now what it meant on the day.',
      actions: c.segmented(LEXICON.versions.map(function (x) { return { id: x.id, label: x.id, href: '#/records/lexicon/' + x.id }; }), v.id, { label: 'Version', size: 'sm' }) });
    var diff = v.id === '2026-09' ? c.section({ id: 'diff', title: 'Changed from 2026-08', body: c.diff([{ field: 'credit exposure', before: 'What the customer owes now: outstanding invoices, before this write.', after: 'What the customer owes now: outstanding invoices plus submitted but unpaid sales orders, before this write.', material: true }], { caption: 'Term changes', collapse: false }) }) : '';
    return page(head, c.card({ body: c.kv([['lexicon_ref', LEXICON.ref.replace('2026-09', v.id), { mono: true }], ['lexicon_hash (F15)', hashc(v.hash, 'Lexicon hash'), { html: true }], ['Recorded', v.at + ' · ' + seqTxt(v.seq) + ' · by ' + v.by], ['Used by', 'erp.ar, sales_invoice, erp.ap, erp.stock, erp.gl'], ['Change', v.note]], { cols: 2 }) }) +
      c.table({ caption: 'Terms', columns: [{ key: 0, label: 'Term', html: true, render: function (t) { return '<strong>' + esc(t[0]) + '</strong>'; } }, { key: 1, label: 'Meaning' }, { key: 2, label: 'Source field', mono: true }, { key: 3, label: 'Unit' }, { key: 4, label: 'Since', mono: true }], rows: terms }) + diff +
      c.callout({ kind: 'rule', body: '<p>Lexicons are kept verbatim, for ever. A record written under 2026-08 is read with 2026-08, never with a later meaning.</p>' }));
  }
  reg('/records/lexicon', { title: 'Lexicon', section: 'lexicon', keywords: 'terms lexicon_hash F15', render: function () { return lexPage('2026-09'); } });
  reg('/records/lexicon/:id', { title: function (p) { return 'Lexicon ' + p.id; }, section: 'lexicon', crumbs: [R, ['Lexicon', '#/records/lexicon']], example: '/records/lexicon/2026-08', render: function (p) {
    if (!LEXICON.versions.some(function (v) { return v.id === p.id; })) return c.pageHeader({ title: 'Lexicon ' + p.id, back: ['Lexicon', '#/records/lexicon'] }) + c.empty({ icon: 'book', title: 'No term set with this id.', why: 'Kept here: ' + LEXICON.versions.map(function (v) { return v.id; }).join(', ') + '. A record’s F15 names exactly one.', action: { label: 'Current lexicon', href: '#/records/lexicon' } });
    return lexPage(p.id);
  } });

  function policyPage(v) {
    var P = POLICIES[v];
    var head = c.pageHeader({ tabs: sibTabs('policies'), title: 'Rule set · policy ' + v, eyebrow: 'Records · declare · rung 4 evaluate()', lead: 'Versioned rules over a projection of declared fields. allow, refuse or escalate — no model in this path, and never a default allow.',
      actions: c.segmented([9, 10, 11].map(function (x) { return { id: String(x), label: 'v' + x, href: '#/records/policies/' + x }; }), String(v), { label: 'Version', size: 'sm' }) });
    if (!P) return head + c.empty({ icon: 'scale', title: 'Policy version ' + v + ' is not in this sample.', why: 'Every policy version is kept verbatim in the registry. This prototype carries versions 10 and 11 of the erp.ar rule set.', action: [{ label: 'Policy 11 (in force)', href: '#/records/policies/11' }, { label: 'Policy 10', href: '#/records/policies/10' }] });
    var base = POLICIES[11];
    var rules = base.rules.filter(function (r) { return !(P.removed && P.removed.indexOf(r[0]) >= 0); });
    var tbl = c.table({ caption: 'Rules', columns: [
      { key: 0, label: 'Rule', mono: true }, { key: 1, label: 'Write type', render: function (r) { return '<a class="rec-mono rec-small" href="#/records/write-types/' + esc(r[1]) + '">' + esc(r[1]) + '</a>'; } },
      { key: 2, label: 'If', render: function (r) { return '<span class="rec-mono rec-small">' + esc(r[2]) + '</span>'; } },
      { key: 3, label: 'Then', html: true, render: function (r) { return r[3] === 'allow' ? c.badge('good', 'allow', { subtle: true }) : r[3] === 'refuse' ? c.badge('neutral', 'refuse', { subtle: true, icon: 'refuse' }) : c.badge('warning', 'escalate', { subtle: true, icon: 'gate' }); } },
      { key: 4, label: 'In plain words', render: function (r) { return '<span class="rec-small">' + esc(r[4]) + '</span>'; } }
    ], rows: rules });
    return page(head, c.card({ body: c.kv([['policy_version', String(v), { mono: true }], ['Applies to', P.applies], ['Recorded', P.at + ' · ' + seqTxt(P.seq) + ' · by ' + P.by], ['Supersedes', 'policy ' + P.supersedes], ['default', 'no_rule_matched → POLICY.NO_RULE_MATCHED (never a default allow)', { mono: false }]], { cols: 2 }) }) +
      c.section({ id: 'projection', title: 'Projection', lead: 'Declared fields only. A rule cannot read what the declaration does not name.', body: '<div class="rec-chips">' + base.projection.map(function (f) { return tag(esc(f), 'mono'); }).join('') + '</div>' }) +
      c.section({ id: 'rules', title: 'Rules', lead: rules.length + ' rules · evaluated in order · a refusal names its rule and this version', body: tbl }) +
      (P.removed ? c.callout({ kind: 'info', title: 'Policy 11 added R-SI-03', body: '<p>Margin below 6% now escalates to ar-approvers. It is why Venkat Raman’s rejection of OB-2026-0410 reads “Margin on 40s combed falls below 6%”.</p>' }) : '') +
      c.callout({ kind: 'rule', body: '<p>“Author a rule. Never widen a default.” A write no rule covers is refused with POLICY.NO_RULE_MATCHED and a record.</p>' }));
  }
  reg('/records/policies', { title: 'Rule sets', section: 'policies', redirect: '/records/policies/11' });
  reg('/records/policies/:v', { title: function (p) { return 'Policy ' + p.v; }, section: 'policies', crumbs: [R, ['Rule sets', '#/records/policies/11']], example: '/records/policies/11', render: function (p) { return policyPage(parseInt(p.v, 10) || p.v); } });

  /* ========================================================================
     DPDP ERASURE (R-03)
     ======================================================================== */
  var ESTAT = { plan: ['warning', 'Plan waiting on a second approver'], refused: ['neutral', 'Refused in writing'], completed: ['good', 'Erasure completed'], open: ['info', 'Opened · verifying'] };
  var ERASE_PLAN = [
    ['ERPNext · Contact CONT-00318 and the customer’s contact fields', 'Erased by ERPNext’s own delete, through the governed write', 'erase'],
    ['elan1 salt store · per-record salts for the 14 records naming this person', 'Salts destroyed; the payload can no longer be linked to its digest', 'erase'],
    ['Notification log · 6 WhatsApp messages and 2 e-mails', 'Purged', 'erase'],
    ['Search index and approval-screen caches', 'Purged', 'erase'],
    ['Tax invoices issued to Lakshmi Garments (4)', 'Retained with erased identifiers — books of account are kept for eight financial years [counsel to confirm]', 'retain'],
    ['Database snapshots', 'Not restored; they age out within 30 days', 'expire']
  ];
  reg('/records/erasure', {
    title: 'Erasure requests', section: 'erasure', keywords: 'DPDP erasure data principal salt',
    render: function (p, q) {
      var path = '/records/erasure';
      var head = c.pageHeader({ tabs: sibTabs('erasure'), title: 'Erasure requests', eyebrow: 'Records · access · DPDP', lead: 'A data principal asks to be erased. Within 72 hours we say what can go, what the law makes us keep, and — after two people approve — destroy it. The chain stays intact.',
        actions: stateMenu(path, [['empty', 'Empty']]) + c.button('New erasure request', { kind: 'primary', icon: 'plus', href: '#/records/erasure/new' }) });
      var rows = q.state === 'empty' ? [] : ERASURE;
      var tbl = c.table({ caption: 'Erasure cases', rowHref: function (e) { return '#/records/erasure/' + e.id; }, empty: { icon: 'user', title: 'No erasure request is open.', why: 'Requests arrive from the grievance officer’s inbox, WhatsApp opt-outs or letters, and are opened here with a 72-hour clock.', action: { label: 'New erasure request', href: '#/records/erasure/new' } }, columns: [
        { key: 'id', label: 'Case', mono: true },
        { key: 'principal', label: 'Data principal' },
        { key: 'opened', label: 'Opened', nowrap: true, render: function (e) { return esc(fmt.dateTime(e.opened)); } },
        { key: 'clock', label: '72-hour clock', html: true, render: function (e) { return e.deadline ? c.countdown(e.deadline, { label: 'Erasure due', warn: 720 }) : '<span class="rec-small rec-muted">Closed ' + esc(fmt.date(e.closedAt)) + '</span>'; } },
        { key: 'approvals', label: 'Approvals', render: function (e) { return mono(e.approvals.filter(function (a) { return a.done; }).length + ' of 2'); } },
        { key: 'status', label: 'Status', html: true, render: function (e) { var s = ESTAT[e.status]; return c.badge(s[0], s[1], { subtle: true }); } }
      ], rows: rows });
      return page(head, tbl + c.callout({ kind: 'rule', title: 'Erasure is a governed write: irreversible, dual control, 72 hours.', body: '<p>The subject’s per-record salts are destroyed and derived copies purged. Every digest in the chain still holds; the payload is simply no longer linkable. A statutory conflict is refused in writing, naming the obligation and the date it expires. The case stays open until every location reports; it is never closed by a partial success.</p>' }));
    }
  });
  reg('/records/erasure/new', {
    title: 'New erasure request', section: 'erasure', crumbs: [R, ['Erasure requests', '#/records/erasure']],
    render: function () {
      var head = c.pageHeader({ title: 'New erasure request', eyebrow: 'DPDP · open a case', lead: 'Opening the case starts the 72-hour clock. Nothing is erased until an erasure plan is approved by two people.', back: ['Erasure requests', '#/records/erasure'] });
      var form = '<form id="rec-erform" class="rec-stack" novalidate>' +
        c.field('Data principal', c.input({ id: 'er-who', value: '', placeholder: 'How the person is known to you, e.g. “Customer contact · Shree Murugan Traders”' }), { id: 'er-who', required: true, help: 'Enough to find their records. Do not paste identity documents here.' }) +
        '<div class="rec-two">' + c.field('Received via', c.select({ id: 'er-via', options: ['E-mail to the grievance officer', 'WhatsApp opt-out and request', 'Letter', 'In person'] }), { id: 'er-via' }) +
        c.field('Verification', c.select({ id: 'er-ver', options: ['One-time code to the registered mobile', 'One-time code to the registered e-mail', 'In person, with a document seen and not kept'] }), { id: 'er-ver' }) + '</div>' +
        c.field('Records that name them', '<div class="rec-small rec-muted">Found by the declared personal fields across erp.ar and erp.ap: 3 customer contacts, 11 invoices, 6 notifications. The plan lists each location.</div>', {}) +
        c.callout({ kind: 'caveat', title: 'Erasure is irreversible.', body: '<p>Destroying a salt cannot be undone. The records stay in the chain; their payloads become unbound. At L2 the offline verifier reports this as a pass with the payload unbound — never as a failure.</p>' }) +
        '<div class="e1-row">' + c.button('Open case and start the 72-hour clock', { kind: 'primary', type: 'submit', icon: 'timer' }) + c.button('Cancel', { kind: 'ghost', href: '#/records/erasure' }) + '</div></form>';
      return head + '<div class="rec-split">' + c.card({ body: form }) + c.card({ title: 'Clock', body: '<p class="rec-small" style="margin:0">72 hours from opening, in IST. It pauses only during a declared platform outage, and the screen says so.</p>' }) + '</div>';
    },
    mount: function (el) {
      var f = el.querySelector('#rec-erform'); if (!f) return;
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var who = el.querySelector('#er-who'), msg = el.querySelector('#er-who-msg');
        if (String(who.value).trim().length < 6) { who.setAttribute('aria-invalid', 'true'); if (msg) { msg.textContent = 'Say how the person is known to you, so their records can be found.'; msg.style.color = 'var(--state-critical)'; } who.focus(); return; }
        var id = 'ER-2026-00' + (ERASURE.length + 2);
        ERASURE.unshift({ id: id, principal: who.value, opened: new Date().toISOString(), deadline: E1.ahead(72 * 60), status: 'open', approvals: [{ name: 'Venkat Raman', role: 'Proposer', done: false }, { name: 'Meenakshi Iyer', role: 'Second approver', done: false }], via: el.querySelector('#er-via').value, verified: 'Pending · ' + el.querySelector('#er-ver').value, records: 20 });
        E1.toast('Case ' + id + ' opened. The 72-hour clock is running.', 'info', { title: 'Opened' });
        E1.go('/records/erasure/' + id);
      });
    }
  });
  reg('/records/erasure/:id', {
    title: function (p) { return 'Erasure ' + p.id; }, section: 'erasure', crumbs: [R, ['Erasure requests', '#/records/erasure']], example: '/records/erasure/ER-2026-0004',
    render: function (p) {
      var e = ERASURE.filter(function (x) { return x.id === p.id; })[0];
      if (!e) return c.pageHeader({ title: 'Erasure ' + p.id, back: ['Erasure requests', '#/records/erasure'] }) + c.empty({ icon: 'user', title: 'No erasure case with this reference.', why: 'Case references look like ER-2026-0004.', action: { label: 'All erasure requests', href: '#/records/erasure' } });
      var s = ESTAT[e.status];
      var stepIdx = { open: 1, plan: 2, refused: 3, completed: 5 }[e.status];
      var head = c.pageHeader({ title: 'Erasure ' + e.id, eyebrow: 'DPDP erasure case', lead: e.principal, back: ['Erasure requests', '#/records/erasure'],
        actions: e.status === 'plan' || e.status === 'open' ? c.button('Refuse in writing', { icon: 'refuse', attrs: 'data-action="rec-er-refuse" data-value="' + esc(e.id) + '"' }) + c.button('Approve erasure plan', { kind: 'gate', attrs: 'data-action="rec-er-approve" data-value="' + esc(e.id) + '"' }) : '',
        meta: c.badge(s[0], s[1]) });
      var clock = e.deadline ? '<div class="rec-clock">' + c.icon('timer', 20) + '<div><div class="rec-label">72-hour clock</div><div class="rec-clock__big">' + c.countdown(e.deadline, { label: 'Erasure due', warn: 720 }) + '</div><div class="rec-small rec-muted">Due ' + esc(fmt.dateTime(e.deadline)) + '</div></div></div>' : '<div class="rec-clock">' + c.icon('check', 20) + '<div><div class="rec-label">Closed</div><div class="rec-small">' + esc(fmt.dateTime(e.closedAt)) + ' · inside 72 hours</div></div></div>';
      var plan = c.table({ caption: 'Erasure plan', columns: [{ key: 0, label: 'Location' }, { key: 1, label: 'What happens', render: function (r) { return '<span class="rec-small">' + esc(r[1]) + '</span>'; } }, { key: 2, label: e.status === 'completed' ? 'Result' : 'Plan', html: true, render: function (r) { return e.status === 'completed' ? (r[2] === 'retain' ? c.badge('neutral', 'Retained, identifiers erased', { subtle: true }) : r[2] === 'expire' ? c.badge('info', 'Ageing out', { subtle: true }) : c.badge('good', 'Done', { subtle: true })) : e.status === 'refused' ? c.badge('neutral', 'Not done', { subtle: true, icon: 'refuse' }) : r[2] === 'retain' ? c.badge('neutral', 'Keep', { subtle: true }) : r[2] === 'expire' ? c.badge('info', 'Ages out', { subtle: true }) : c.badge('warning', 'Erase', { subtle: true, icon: 'trash' }); } }], rows: ERASE_PLAN });
      var keeps = '<div class="rec-two">' + c.card({ title: 'What is erased', body: '<ul class="rec-small" style="margin:0;padding-left:18px"><li>The contact’s name, mobile and e-mail in ERPNext</li><li>The per-record salts behind their payload hashes</li><li>Messages, caches and search entries that repeat them</li></ul>' }) +
        c.card({ title: 'What the proof keeps', body: '<ul class="rec-small" style="margin:0;padding-left:18px"><li>seq, prev_digest and digest — the chain stays continuous</li><li>write type, declaration and policy versions, recorded_at</li><li>actor id (pseudonymous) and actor kind</li><li>payload_hash — now unbound: it cannot be linked back to the person</li></ul>' }) + '</div>';
      var extra = e.status === 'refused' ? c.refusal({ code: 'GATE.RETENTION_WINDOW_CLOSED', title: 'Not done — the law requires us to keep these records', rule: 'Refused in writing with the statutory obligation and the date it expires.', ruleName: e.statute, numbers: [{ label: 'Records kept', value: String(e.records) }, { label: 'Obligation expires', value: e.expires }], action: { label: 'Reopen when it expires', href: '#/records/erasure/new' }, at: fmt.dateTime(e.closedAt) }) :
        e.status === 'completed' ? c.callout({ kind: 'good', title: 'Erasure completed', body: '<p>Receipt <span class="rec-mono">' + esc(e.receipt) + '</span> sent to the data principal. Recorded as ' + seqLink(e.seq) + '. Chain intact, payload unbound for ' + e.records + ' records.</p>' }) + (E1.atLeast('L2') ? '' : c.locked({ level: 'L2', compact: true, title: 'The offline verifier’s reading of erased records arrives at Assurance Level 2 Attested', items: ['“PASS — payload unbound”, never a failure', 'Bundles that name the erasure case'] })) : '';
      return page(head,
        c.stepper(['Opened', 'Verified', 'Erasure plan', 'Two approvals', 'Executed', 'Closed'], stepIdx) +
        '<div class="rec-split"><div class="rec-stack">' + extra +
        c.section({ id: 'plan', title: 'Erasure plan · every location', lead: 'One row per place the person appears. The case closes only when every row reports.', body: plan }) + keeps + '</div>' +
        '<div class="rec-stack">' + clock + c.card({ title: 'Case', body: c.kv([['Received via', e.via], ['Requester verification', e.verified], ['Records naming them', String(e.records)], ['Write type', 'platform.erasure.execute · irreversible · dual control'], ['Obligation', e.ob ? '<a class="rec-mono" href="#/work/decide/' + e.ob + '">' + e.ob + '</a>' : '—', { html: true }]], { cols: 1 }) }) +
        c.card({ title: 'Two approvals', body: '<ul class="rec-small" style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px">' + e.approvals.map(function (a) { return '<li class="e1-row">' + (a.done ? '<span class="e1-tone--good">' + c.icon('check', 14) + '</span>' : '<span class="e1-tone--warning">' + c.icon('clock', 14) + '</span>') + c.actor({ name: a.name, kind: 'person', role: a.role, size: 'sm' }) + '<span class="rec-muted">' + (a.done ? 'Approved' : 'Waiting') + '</span></li>'; }).join('') + '</ul>' }) + '</div></div>');
    }
  });
  E1.action('rec-er-approve', function (b) {
    var e = ERASURE.filter(function (x) { return x.id === b.getAttribute('data-value'); })[0]; if (!e) return;
    E1.confirm({ title: 'Approve the erasure plan for ' + e.id + '?', eyebrow: 'Governed write · irreversible · dual control', kind: 'gate', confirmLabel: 'Approve erasure plan', body: '<p>This cannot be undone. The salts named in the plan will be destroyed and derived copies purged once the second approver also approves. The retained rows stay, with identifiers erased.</p>',
      onConfirm: function () { E1.toast('Your approval is recorded. ' + (e.ob || 'The obligation') + ' is waiting on Meenakshi Iyer.', 'warning', { title: 'Waiting on a person', action: { label: 'Open ' + (e.ob || 'Decide'), href: '#/work/decide/' + (e.ob || 'OB-2026-0428') } }); } });
  });
  E1.action('rec-er-refuse', function (b) {
    var e = ERASURE.filter(function (x) { return x.id === b.getAttribute('data-value'); })[0]; if (!e) return;
    E1.modal({ title: 'Refuse ' + e.id + ' in writing', eyebrow: 'The data principal receives this text', body: '<div class="rec-stack rec-stack--sm">' + c.field('Statutory obligation', c.input({ id: 'rf-stat', value: 'Companies Act 2013, s.128(5)' }), { id: 'rf-stat', help: 'Name the law, not “policy”.' }) + c.field('Date it expires', c.input({ id: 'rf-exp', type: 'date', value: '2034-03-31' }), { id: 'rf-exp' }) + c.field('Reason', c.textarea({ id: 'rf-why', rows: 3 }), { id: 'rf-why', required: true, help: 'At least a sentence (12 characters or more).' }) + '</div>',
      actions: [{ label: 'Cancel', kind: 'ghost' }, { label: 'Refuse in writing', kind: 'primary', onClick: function (ev, close, m) { var w = m.querySelector('#rf-why'), msg = m.querySelector('#rf-why-msg'); if (String(w.value).trim().length < 12) { w.setAttribute('aria-invalid', 'true'); if (msg) { msg.textContent = 'A refusal needs at least a sentence. The person reads this.'; msg.style.color = 'var(--state-critical)'; } w.focus(); return false; } E1.toast('Refusal recorded and sent to the data principal, naming the obligation and its expiry.', 'info', { title: 'Refused in writing' }); } }] });
  });

  /* ========================================================================
     Global handlers
     ======================================================================== */
  E1.action('rec-host', function (b) { E1.toast('Opens https://' + b.getAttribute('data-url') + ' in ERPNext, in a new tab. Records keeps no copy of it.', 'info', { title: 'Open in ERPNext' }); });
  E1.action('rec-ping', function () { E1.toast('ERPNext answered a read-only call in 184 ms. Nothing was written.', 'good', { title: 'Reachable' }); });
  E1.on('submit', 'form[data-rec-search]', function (e, f) { e.preventDefault(); var v = (f.querySelector('input[type="search"]') || {}).value || ''; var q = Object.assign({}, E1.state.route.query, { q: v || null }); E1.go(f.getAttribute('data-rec-search'), q); });
  E1.on('submit', 'form[data-rec-compare]', function (e, f) { e.preventDefault(); E1.go('/records/declarations/' + f.getAttribute('data-rec-compare') + '/compare', { from: f.querySelector('#cmp-from').value, to: f.querySelector('#cmp-to').value }); });
  E1.cmdAdd && E1.cmdAdd({ id: 'rec-studio-ar', label: 'Continue erp.ar v8 in the Studio', run: '#/records/studio/erp.ar?step=author', group: 'Records', icon: 'edit', keywords: 'declaration certify cancel invoice' });
})();
