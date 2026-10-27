/* =============================================================================
   elan1 screens — ASSURANCE door, Level 2 Attested and Level 3 Proven
   Owner: assurance-evidence. Routes: see ROUTES.md "ASSURANCE door (L2 Attested / L3 Proven)".
   Sources: spec-phase2-3-evidence (E12–E19), spec-phase4-group (E20–E26), spec-tm, spec-atlas (Figs 10, 15, 22, 24, 25).
   Every L2/L3 screen renders a designed locked explainer plus a faded preview below the level it needs.
   ============================================================================= */
(function () {
  'use strict';
  var c = E1.c, esc = E1.esc, F = E1.fmt;

  /* ---------------------------------------------------------------------------
     Local styles (prefix ae-). Colours only through tokens.
     --------------------------------------------------------------------------- */
  (function injectStyles() {
    if (document.getElementById('ae-styles')) return;
    var css = [
      '.ae-lvtag{display:inline-flex;align-items:center;gap:8px;font-weight:var(--weight-medium);color:var(--text-primary)}',
      '.ae-preview{margin-top:var(--space-5)}',
      '.ae-preview__label{display:flex;align-items:center;gap:8px;margin:0 0 var(--space-4);padding:10px 14px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);background:var(--bg-sunken);color:var(--text-secondary);font-size:var(--text-caption)}',
      '.ae-preview__body{opacity:.5;filter:grayscale(.35);pointer-events:none;user-select:none;max-height:1500px;overflow:hidden;-webkit-mask-image:linear-gradient(to bottom,black 60%,transparent);mask-image:linear-gradient(to bottom,black 60%,transparent)}',
      '.ae-bnd{display:flex;width:100%;min-height:40px;border:1px solid var(--border-default);border-radius:var(--radius-sm);overflow:hidden;background:var(--bg-surface)}',
      '.ae-bnd__seg{display:flex;align-items:center;gap:6px;padding:0 10px;min-width:64px;font:var(--weight-medium) var(--text-caption)/1.2 var(--font-mono);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text-primary)}',
      '.ae-bnd__seg--1{background:var(--level-1-bg)}',
      '.ae-bnd__seg--2{background:var(--level-2-bg);border-left:2px solid var(--level-2)}',
      '.ae-bnd__seg--3{background:var(--level-3-bg);border-left:2px solid var(--level-3)}',
      '.ae-bnd__seg--1+.ae-bnd__seg--1{border-left:2px solid var(--level-1)}',
      '.ae-bnd__seg--2+.ae-bnd__seg--1{border-left:2px solid var(--level-1)}',
      '.ae-bndlegend{list-style:none;margin:10px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:6px 22px;font-size:var(--text-caption);color:var(--text-secondary)}',
      '.ae-bndlegend li{display:flex;align-items:center;gap:8px}',
      '.ae-bndlegend b{font-weight:var(--weight-semibold);color:var(--text-primary)}',
      '.ae-line{font:var(--weight-medium) var(--text-body)/var(--lh-body) var(--font-mono);color:var(--text-primary);margin:0}',
      '.ae-limits{margin:0;padding:12px 16px;border:1px solid var(--border-subtle);border-left:3px solid var(--border-strong);background:var(--honesty-ground);border-radius:var(--radius-md)}',
      '.ae-limits p{margin:0;font-size:var(--text-body);line-height:var(--lh-body);color:var(--text-primary)}',
      '.ae-limits cite{display:block;margin-top:8px;font-style:normal;font-size:var(--text-caption);color:var(--text-tertiary)}',
      '.ae-trace{display:flex;align-items:stretch;gap:0;width:100%}',
      '.ae-trace__node{flex:1 1 0;min-width:0;display:flex;flex-direction:column;gap:6px;padding:10px 14px;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);box-shadow:var(--shadow-1)}',
      '.ae-trace__node.is-broken{border-color:var(--state-critical-border);background:var(--state-critical-bg)}',
      '.ae-trace__k{font:var(--weight-semibold) var(--text-label)/1 var(--font-ui);letter-spacing:var(--tracking-label);text-transform:uppercase;color:var(--text-tertiary)}',
      '.ae-trace__v{font:var(--weight-semibold) var(--text-caption)/1.35 var(--font-mono);color:var(--text-primary);overflow-wrap:anywhere}',
      '.ae-trace__d{font-size:var(--text-caption);line-height:var(--lh-caption);color:var(--text-secondary)}',
      '.ae-trace__arrow{flex:none;width:30px;display:grid;place-items:center;color:var(--text-tertiary)}',
      '.ae-trace__arrow svg{transform:rotate(0deg)}',
      '@media (max-width:980px){.ae-trace{flex-direction:column}.ae-trace__arrow{width:100%;height:26px}.ae-trace__arrow svg{transform:rotate(90deg)}}',
      '.ae-steps{list-style:none;margin:0;padding:0;display:grid;gap:0}',
      '.ae-steps>li{display:grid;grid-template-columns:28px minmax(0,1fr) auto;gap:14px;align-items:start;padding:14px 0;border-bottom:1px solid var(--border-subtle)}',
      '.ae-steps>li:last-child{border-bottom:0}',
      '.ae-steps__n{width:26px;height:26px;border-radius:var(--radius-sm);display:grid;place-items:center;font:var(--weight-semibold) var(--text-caption)/1 var(--font-mono);border:1.5px solid var(--border-default);color:var(--text-secondary);background:var(--bg-surface)}',
      '.ae-steps__n.is-done{background:var(--text-primary);border-color:var(--text-primary);color:var(--text-inverse)}',
      '.ae-steps__n.is-irrev{border-color:var(--state-serious);color:var(--state-serious)}',
      '.ae-steps__t{margin:0;font-weight:var(--weight-semibold)}',
      '.ae-steps__t a{color:var(--text-primary)}',
      '.ae-steps__d{margin:2px 0 0;font-size:var(--text-caption);color:var(--text-secondary)}',
      '.ae-steps__side{display:flex;flex-wrap:wrap;gap:6px;justify-content:flex-end}',
      '@media (max-width:720px){.ae-steps>li{grid-template-columns:28px minmax(0,1fr)}.ae-steps__side{grid-column:2;justify-content:flex-start}}',
      '.ae-wiz{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:6px}',
      '.ae-wiz a{display:inline-flex;align-items:center;gap:8px;min-height:32px;padding:4px 10px 4px 5px;border:1px solid var(--border-subtle);border-radius:var(--radius-sm);color:var(--text-secondary);text-decoration:none;font-size:var(--text-caption);font-weight:var(--weight-medium);background:var(--bg-surface)}',
      '.ae-wiz a:hover{background:var(--bg-hover)}',
      '.ae-wiz a[aria-current]{border-color:var(--border-accent);color:var(--text-primary);background:var(--bg-selected);box-shadow:inset 0 -2px 0 var(--border-accent)}',
      '.ae-wiz__n{width:22px;height:22px;border-radius:var(--radius-sm);display:grid;place-items:center;font:var(--weight-semibold) var(--text-label)/1 var(--font-mono);border:1.5px solid var(--border-default);background:var(--bg-surface)}',
      '.ae-wiz a.is-done .ae-wiz__n{background:var(--text-primary);border-color:var(--text-primary);color:var(--text-inverse)}',
      '.ae-wiz a.is-irrev .ae-wiz__n{border-color:var(--state-serious);color:var(--state-serious)}',
      '.ae-task{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px 16px;align-items:start;padding:12px var(--pane-padding);border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);box-shadow:var(--shadow-1)}',
      '.ae-task+.ae-task{margin-top:10px}',
      '.ae-task__t{margin:0;font-weight:var(--weight-semibold)}',
      '.ae-task__d{margin:2px 0 0;font-size:var(--text-caption);color:var(--text-secondary)}',
      '.ae-task__out{grid-column:1/-1}',
      '.ae-out{margin:0;padding:10px 12px;border-radius:var(--radius-sm);background:var(--bg-sunken);border:1px solid var(--border-subtle);font:var(--weight-regular) var(--text-caption)/1.6 var(--font-mono);color:var(--text-primary);overflow-wrap:anywhere;white-space:pre-wrap}',
      '.ae-out__cap{display:block;margin-bottom:4px;font:var(--weight-semibold) var(--text-micro)/1 var(--font-ui);letter-spacing:var(--tracking-label);text-transform:uppercase;color:var(--text-tertiary)}',
      '.ae-hero{display:flex;flex-wrap:wrap;align-items:center;gap:10px 16px;padding:12px var(--pane-padding);border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);box-shadow:var(--shadow-1)}',
      '.ae-hero__big{font:var(--weight-title) var(--text-section)/var(--lh-section) var(--font-display);letter-spacing:-.01em;margin:0}',
      '.ae-two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--stack-gap)}',
      '@media (max-width:860px){.ae-two{grid-template-columns:minmax(0,1fr)}}',
      '.ae-list{margin:0;padding-left:18px;display:grid;gap:6px;font-size:var(--text-body);line-height:var(--lh-body)}',
      '.ae-list--plain{list-style:none;padding:0}',
      '.ae-rcpt{display:grid;grid-template-columns:minmax(0,400px) minmax(0,1fr);gap:var(--space-5);align-items:start}',
      '@media (max-width:1080px){.ae-rcpt{grid-template-columns:minmax(0,1fr)}}',
      '.ae-rcpt__card{background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-md);box-shadow:var(--shadow-1);overflow:hidden}',
      '.ae-rcpt__top{padding:16px var(--pane-padding);border-bottom:1px dashed var(--border-default)}',
      '.ae-rcpt__issuer{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}',
      '.ae-rcpt__amt{margin:6px 0 2px;font:var(--weight-title) 28px/32px var(--font-display);letter-spacing:var(--tracking-title);font-variant-numeric:tabular-nums}',
      '.ae-rcpt__sub{margin:0;color:var(--text-secondary);font-size:var(--text-body)}',
      '.ae-rcpt__rows{padding:4px var(--pane-padding)}',
      '.ae-rcpt__row{display:flex;justify-content:space-between;gap:16px;padding:8px 0;border-bottom:1px solid var(--border-subtle);font-size:var(--text-caption)}',
      '.ae-rcpt__row:last-child{border-bottom:0}',
      '.ae-rcpt__row>span:first-child{color:var(--text-tertiary);font-size:var(--text-label);letter-spacing:var(--tracking-label);text-transform:uppercase;font-weight:var(--weight-semibold)}',
      '.ae-rcpt__row>span:last-child{text-align:right;overflow-wrap:anywhere;min-width:0}',
      '.ae-rcpt__foot{padding:10px var(--pane-padding);border-top:1px solid var(--border-subtle);background:color-mix(in srgb,var(--bg-sunken) 45%,var(--bg-surface));font-size:var(--text-caption);line-height:var(--lh-caption);color:var(--text-secondary)}',
      '.ae-log{margin:0;padding:14px 16px;background:var(--bg-sunken);border:1px solid var(--border-subtle);border-radius:var(--radius-md);font:var(--weight-regular) var(--text-caption)/1.75 var(--font-mono);overflow-x:auto}',
      '.ae-log__row{display:grid;grid-template-columns:150px minmax(0,1fr);gap:14px}',
      '.ae-log__k{color:var(--text-tertiary)}',
      '.ae-log__v{color:var(--text-primary);overflow-wrap:anywhere}',
      '.ae-log__row.is-sub .ae-log__k{padding-left:14px}',
      '@media (max-width:600px){.ae-log__row{grid-template-columns:minmax(0,1fr);gap:0;padding-bottom:6px}}',
      '.ae-report{list-style:none;margin:0;padding:0;counter-reset:aerep}',
      '.ae-report>li{counter-increment:aerep;display:grid;grid-template-columns:34px minmax(0,1fr);gap:10px;padding:12px 0;border-bottom:1px solid var(--border-subtle)}',
      '.ae-report>li:last-child{border-bottom:0}',
      '.ae-report>li::before{content:counter(aerep);width:24px;height:24px;border-radius:var(--radius-sm);display:grid;place-items:center;font:var(--weight-semibold) var(--text-label)/1 var(--font-mono);border:1.5px solid var(--border-default);color:var(--text-secondary)}',
      '.ae-report h3{margin:2px 0 6px;font-size:var(--text-body);font-weight:var(--weight-semibold)}',
      '.ae-fgrid td,.ae-fgrid th{vertical-align:middle}',
      '.ae-count{font:var(--weight-title) 17px/1.3 var(--font-display);font-variant-numeric:tabular-nums}',
      '.ae-tok{display:grid;gap:10px}',
      '.ae-sticky{position:sticky;top:12px}',
      '.ae-drop{display:grid;place-items:center;gap:6px;padding:26px 16px;border:1.5px dashed var(--border-strong);border-radius:var(--radius-md);background:var(--bg-sunken);text-align:center;color:var(--text-secondary);font-size:var(--text-caption)}',
      '.ae-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--stack-gap)}',
      '@media (max-width:1100px){.ae-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}}',
      '@media (max-width:480px){.ae-kpis{grid-template-columns:minmax(0,1fr)}}',
      '.ae-said{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--stack-gap)}',
      '@media (max-width:860px){.ae-said{grid-template-columns:minmax(0,1fr)}}',
      '.ae-nav{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:var(--space-6);padding-top:var(--space-4);border-top:1px solid var(--border-subtle)}',
      '.ae-mt{margin-top:var(--space-4)}',
      '.ae-mt-s{margin-top:var(--space-2)}',
      '.ae-nowrap{white-space:nowrap}',
      '.ae-two>.e1-section{margin-top:0}',
      '.e1-stack>.e1-section{margin-top:var(--space-4)}',
      '.e1-stack>.e1-section:first-child{margin-top:0}',
      '.e1-section+.ae-two,.e1-callout+.ae-two,.ae-two+.e1-section{margin-top:var(--space-6)}',
      '.e1-section+.e1-callout,.e1-callout+.e1-callout,.ae-kpis+.e1-callout,.ae-hero+.e1-callout,.e1-callout+.ae-kpis,.e1-locked+.e1-callout{margin-top:var(--space-5)}'
    ].join('\n');
    var s = document.createElement('style');
    s.id = 'ae-styles';
    s.textContent = css;
    document.head.appendChild(s);
  })();

  /* ---------------------------------------------------------------------------
     Deterministic sample digests, ids and fingerprints
     --------------------------------------------------------------------------- */
  function hx(seed, len) {
    var h = 2166136261 >>> 0, s = String(seed), out = '', i;
    for (i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    while (out.length < len) {
      h ^= h << 13; h >>>= 0; h ^= h >>> 17; h ^= h << 5; h >>>= 0;
      out += ('00000000' + h.toString(16)).slice(-8);
    }
    return out.slice(0, len);
  }
  function dg(head, tail, seed) { head = head || ''; tail = tail || ''; return head + hx(seed || (head + '·' + tail), 64 - head.length - tail.length) + tail; }
  function uuid(seed) { var h = hx('u' + seed, 32); return h.slice(0, 8) + '-' + h.slice(8, 12) + '-4' + h.slice(13, 16) + '-a' + h.slice(17, 20) + '-' + h.slice(20, 32); }
  function fpr(hex) { return 'ed25519:' + hex.match(/.{1,4}/g).join(' '); }
  var ZERO_UUID = '00000000-0000-0000-0000-000000000000';

  /* ---------------------------------------------------------------------------
     Sample data — E1.data.evidence
     Kaveri Spinning Mills after a Level 2 upgrade on 12 Aug 2027 (preview), and at L3 in Sep 2028 (preview).
     Numbers follow spec-phase2-3-evidence §4, renamed to the canonical tenant.
     --------------------------------------------------------------------------- */
  var LIMITS_MCA = 'A PASS under in-mca-audit-trail v1 establishes that the changes contained in this bundle were made through the elan1 governed write path, that each carries an actor, an actor kind, a target record identifier and a platform-clock timestamp, that the sequence is unbroken and externally anchored, and that the refused attempts are present. It does not establish that the books of account are complete: changes made directly in the accounting system, outside this write path, are recorded by that system’s own audit trail and are not in this bundle. It does not establish that the transactions were genuine, that the rules applied were adequate, or that this bundle satisfies any obligation — that determination belongs to the reader. This profile is the vendor’s reading of the obligation; it has not been reviewed or accepted by the Ministry of Corporate Affairs or by any regulator.';
  var RECEIPT_LIMITS = 'This establishes that the issuer’s governed write path produced this record under these rules at this time. It does not establish that the underlying transaction occurred.';
  var PROMISE = [
    'Every governed change of these types went through stated rules, with a named actor and, where required, a named approver.',
    'Here is a file covering a period you choose. Your auditor can check it on their own machine, offline, with software they did not get from us.',
    'Here is what that file does not establish, in the profile’s own words, printed in every report.'
  ];
  var FROZEN_L2 = 'An L1 → L2 upgrade provisions a key, switches signing on at a named sequence number, switches anchoring on, installs a certified profile, and exports a bundle that verifies offline. The tenant’s declaration is unchanged except for one addition to block 6. Writes never stop.';
  var L1_HONESTY = 'This record is hash-chained. It is not signed, and it cannot yet be checked by someone who does not trust elan1. That arrives at Assurance Level 2.';

  var KEY = { id: 'k_in_20270701_4d7e', fp: '3f9a1c07' + hx('fp4d7e', 52) + '8b2e', from: '2027-07-01T00:00:00Z', successor: 'k_in_20280701_b21f', custody: 'AWS KMS · ap-south-1 · ECC_NIST_EDWARDS25519', status: 'active' };
  var KEY2 = { id: 'k_in_20280701_b21f', fp: 'b21f6e44' + hx('fpb21f', 52) + '7a31', from: '2028-07-01T00:00:00Z', status: 'active' };

  var D = E1.data.evidence = {
    tenant: { name: 'Kaveri Spinning Mills Pvt Ltd', short: 'Kaveri Spinning Mills', id: '7c1e2f90-5b3d-4e8a-9f61-0d2c8e11a04b', domain: 'in', region: 'ap-south-1 · Mumbai', org: 'ar-org:kaverispinning.example', auditor: 'CA Lakshmi Iyer, Iyer Menon & Co., Chartered Accountants' },
    today: { head: 4112, date: '24 Sep 2026', standing: 'continuous · seq 1–4,112 · 19 of 23 write types · checked nightly 02:10 IST' },
    boundary: { seq: 41207, at: '2027-08-12T06:30:11Z', l1: 41206, head: 53686, headAt: '2027-10-26T10:36:02Z', l2: 12480, date: '12 August 2027', genesis: dg('e3b7', '41c9') },
    keys: [KEY, KEY2],
    genesisDigest: dg('e3b7', '41c9'),
    /* ----- Bundles: the export log (we keep the manifest digest and the export record, nothing else) ----- */
    bundles: [
      { id: 'EB-2027-0001', at: '2027-08-12T09:10:24Z', by: 'Arjun Rao', byRole: 'elan1 upgrade operator', from: 40801, to: 41400, refusals: 29, unanch: 0, profile: 'in-mca-audit-trail v1', redaction: 'ledger1-default', rec: 41401, note: 'Dry export at upgrade stage 4 — spans the boundary on purpose', run: 10 },
      { id: 'EB-2027-0002', at: '2027-08-13T11:20:44Z', by: 'Venkat Raman', byRole: 'Accounts head', from: 41207, to: 41560, refusals: 17, unanch: 0, profile: 'in-mca-audit-trail v1', redaction: 'ledger1-default', rec: 41566, note: 'First bundle — exported by the tenant at upgrade stage 5', run: 11 },
      { id: 'EB-2027-0003', at: '2027-08-22T09:05:10Z', by: 'Venkat Raman', byRole: 'Accounts head', from: 38001, to: 45000, refusals: 318, unanch: 0, profile: null, redaction: 'ledger1-default', rec: 45012, note: 'Boundary-spanning, no profile claimed — integrity checks only', run: 2 },
      { id: 'EB-2027-0004', at: '2027-10-01T05:30:00Z', by: 'Ravi Shankar', byRole: 'Finance manager', from: 41207, to: 50112, refusals: 441, unanch: 0, profile: 'in-mca-audit-trail v1', redaction: 'ledger1-default', rec: 50131, note: 'Q2 FY 2027–28 (Jul–Sep) for the statutory auditor', run: 7 },
      { id: 'EB-2027-0005', at: '2027-10-12T08:44:19Z', by: 'Venkat Raman', byRole: 'Accounts head', from: 44001, to: 51000, refusals: 344, unanch: 0, profile: 'in-mca-audit-trail v1', redaction: 'ledger1-default', rec: 51688, note: 'Covers three records whose payload salts were destroyed under erasure request ER-0193', run: 3 },
      { id: 'EB-2027-0006', at: '2027-10-19T11:02:51Z', by: 'Venkat Raman', byRole: 'Accounts head', from: 41207, to: 52940, refusals: 576, unanch: 0, profile: 'in-mca-audit-trail v1', redaction: 'ledger1-default', rec: 52963, note: 'The clean range, after the export over the 18 Oct night was refused' },
      { id: 'EB-2027-0007', at: '2027-10-26T10:42:17Z', by: 'Venkat Raman', byRole: 'Accounts head', from: 41207, to: 53686, refusals: 611, unanch: 22, profile: 'in-mca-audit-trail v1', redaction: 'ledger1-default', rec: 53687, note: 'Level 2 range to date, for the half-year review', run: 1, digest: dg('4be1', '90cf'), file: 'kaveri-ledger1-2027-07-01_2027-10-26.tar' },
      { id: 'EB-2027-0008', at: '2027-10-26T14:15:03Z', by: 'Venkat Raman', byRole: 'Accounts head', from: 41207, to: 53686, refusals: 611, unanch: 22, profile: 'in-mca-audit-trail v1', redaction: 'ledger1-default', rec: 53702, note: 'Re-export of EB-2027-0007 for CA Lakshmi Iyer — byte-identical except exported_at', reexportOf: 'EB-2027-0007' }
    ],
    /* ----- Refused and other export writes (the full governed export log) ----- */
    exportsExtra: [
      { at: '2027-10-19T10:58:02Z', by: 'Venkat Raman', from: 41207, to: 53011, profile: 'in-mca-audit-trail v1', outcome: 'refused', code: 'GATE.PRECONDITION_FAILED', rec: 52961, why: 'The nightly integrity run for 18 Oct 2027 did not complete, so seq 52,941–53,011 is not checked over this range. The last clean night covers seq 1–52,940.', offer: 'Exported the clean range instead', offerHref: '#/assurance/bundles/EB-2027-0006' },
      { at: '2027-10-23T07:12:40Z', by: 'Priya Nair', from: 41207, to: 53300, profile: 'in-mca-audit-trail v1', outcome: 'refused', code: 'GATE.RESIDENCY_VIOLATION', rec: 53318, why: 'The request reached an endpoint outside residency domain in. A bundle for this tenant is generated in-domain or not at all.', offer: 'Use the in-domain endpoint', offerHref: '#/assurance/export' },
      { at: '2027-10-24T16:40:00Z', by: 'Ravi Shankar', from: 1, to: 53600, profile: 'in-mca-audit-trail v1', outcome: 'refused', code: 'GATE.PRECONDITION_FAILED', rec: 53611, why: 'The profile window starts at 2027-07-01 and needs Level 2. Records seq 1–41,206 are Level 1. Offered two sub-ranges: seq 1–41,206 with no profile claimed, and seq 41,207–53,600 under in-mca-audit-trail v1.', offer: 'Open the builder with the two sub-ranges', offerHref: '#/assurance/export?from=1&to=41206&profile=none' }
    ],
    auditorRequests: [
      { at: '2027-10-25T06:30:00Z', by: 'CA Lakshmi Iyer', what: 'Bundle for seq 41,207 onward under in-mca-audit-trail v1, plus the key fingerprint by a separate channel', supplied: 'EB-2027-0008 on 26 Oct 2027; fingerprint by signed letter, 27 Oct 2027', rec: 53420 },
      { at: '2027-09-29T09:00:00Z', by: 'CA Lakshmi Iyer', what: 'Chain continuity report, declaration versions verbatim, nightly integrity output for every night of Q2', supplied: 'EB-2027-0004 on 1 Oct 2027 with the continuity report', rec: 50090 }
    ],
    /* ----- Anchor batches (two authorities, at least one India-based) ----- */
    tsa: [
      { id: 'emudhra', name: 'eMudhra', country: 'India', role: 'India-based authority', policy: 'RFC 3161 time-stamping practice statement, version as issued', source: 'Traceable to NPL India via NTP; ±1 s accuracy', sla: '99.9% availability · 800 ms p95 response', cert: 'TSA certificate valid to Mar 2032; archival policy 10 years', contract: 'Contracted in writing · priced per year [sample]', tokens: 7124, degraded: 1 },
      { id: 'digicert', name: 'DigiCert', country: 'United States', role: 'Global authority', policy: 'RFC 3161 time-stamping practice statement, version as issued', source: 'Traceable to UTC(NIST); ±1 s accuracy', sla: '99.9% availability · 600 ms p95 response', cert: 'TSA certificate valid to Nov 2031; archival policy 10 years', contract: 'Contracted in writing · priced per year [sample]', tokens: 7121, degraded: 2 }
    ],
    batches: [
      { id: 'b_20271026_1030_7c1e', from: 53641, to: 53664, root: dg('5c1d', 'e0a9'), a: '2027-10-26T10:30:02Z', b: '2027-10-26T10:30:03Z', status: 'anchored', lag: '5 m 25 s', closed: '2027-10-26T10:30:00Z' },
      { id: 'b_20271026_1015_7c1e', from: 53623, to: 53640, root: dg('a2e0', '17b4'), a: '2027-10-26T10:15:02Z', b: '2027-10-26T10:15:02Z', status: 'anchored', lag: '3 m 58 s', closed: '2027-10-26T10:15:00Z' },
      { id: 'b_20271026_1000_7c1e', from: 53609, to: 53622, root: dg('0f71', '9c20'), a: '2027-10-26T10:00:03Z', b: '2027-10-26T10:00:04Z', status: 'anchored', lag: '6 m 12 s', closed: '2027-10-26T10:00:00Z' },
      { id: 'b_20271026_0945_7c1e', from: 53580, to: 53608, root: dg('d833', '4e1a'), a: '2027-10-26T09:45:02Z', b: '2027-10-26T09:45:03Z', status: 'anchored', lag: '11 m 40 s', closed: '2027-10-26T09:45:00Z' },
      { id: 'b_20271021_0915_7c1e', from: 52980, to: 53011, root: dg('61b9', 'aa3e'), a: '2027-10-21T09:15:03Z', b: null, bNote: 'timeout', status: 'single_anchor', lag: '0 m 03 s', closed: '2027-10-21T09:15:00Z' },
      { id: 'b_20271019_0915_7c1e', from: 52801, to: 52888, root: dg('f403', '9d02'), a: '2027-10-19T10:21:40Z', b: '2027-10-19T10:24:11Z', status: 'late', lag: '1 h 06 m', closed: '2027-10-19T09:15:00Z', incident: 'ANC-2027-03' },
      { id: 'b_20270812_0630_7c1e', from: 41207, to: 41219, root: dg('8e2a', '4c71'), a: '2027-08-12T06:45:02Z', b: '2027-08-12T06:45:03Z', status: 'anchored', lag: '14 m 51 s', closed: '2027-08-12T06:45:00Z', first: true }
    ],
    openBatch: { from: 53665, to: 53686 },
    anchorIncidents: [
      { id: 'ANC-2027-03', start: '2027-10-19T09:14:00Z', end: '2027-10-19T10:20:00Z', a: 'Unreachable 09:14–10:20 (network route)', b: 'Unreachable 09:14–10:22 (authority maintenance)', cause: 'Both authorities failed for more than four consecutive intervals. Writes and signing continued; the unanchored head grew to 88 records.', batches: 'b_20271019_0915_7c1e and the four batches behind it, anchored oldest first, each with its own root and its true token time', maxHead: 88, status: 'Closed · write-up published 21 Oct 2027' },
      { id: 'ANC-2027-02', start: '2027-10-21T09:15:00Z', end: '2027-10-21T09:15:30Z', a: 'Token issued 09:15:03', b: 'Timeout after 30 s', cause: 'One authority timed out on one interval. The batch is single_anchor — a degraded state, not a failure.', batches: 'b_20271021_0915_7c1e', maxHead: 32, status: 'Closed · no write-up required (one interval)' }
    ],
    /* ----- Verifier profiles ----- */
    profiles: [
      { id: 'in-mca-audit-trail', v: 1, regime: 'MCA audit trail for accounting software (Companies (Accounts) Rules, edit-log requirement)', issuer: 'Ministry of Corporate Affairs', jur: 'IN', author: 'Rohan Kapoor', certifier: 'Kavya Menon', status: 'certified', certifiedAt: '2027-06-18', ruleAsAt: '2023-04-01', from: '2027-07-01', to: null, p: 12, installed: true, installedAt: '2027-08-12T09:02:10Z', installRec: 41398, pack: 'ledger1', minL: 2, limits: LIMITS_MCA, digest: dg('aa60', '31f2'), fixture: 'fx-ledger1-2027.06', confAt: '2027-06-16' },
      { id: 'in-gst-einvoice', v: 1, regime: 'GST e-invoicing through the Invoice Registration Portal', issuer: 'Central Board of Indirect Taxes and Customs', jur: 'IN', author: 'Rohan Kapoor', certifier: null, status: 'draft', ruleAsAt: '2020-10-01', from: null, to: null, p: 7, installed: false, pack: 'invoice1', minL: 2, limits: null, digest: null, note: 'Second pack. Fails G-E in part: we govern the write that requests the IRN; we do not own the clearance.' },
      { id: 'in-dpdp-rules', v: 1, regime: 'Digital Personal Data Protection Rules — consent and erasure', issuer: 'Ministry of Electronics and Information Technology', jur: 'IN', author: 'Farah Sheikh', certifier: null, status: 'draft', ruleAsAt: '2025-11-13', from: '2027-05-13', to: null, p: 5, installed: false, pack: null, minL: 2, limits: null, digest: null },
      { id: 'in-rbi-collections', v: 1, regime: 'RBI fair practices on recovery (collections conduct)', issuer: 'Reserve Bank of India', jur: 'IN', author: 'Rohan Kapoor', certifier: null, status: 'draft', ruleAsAt: null, from: null, to: null, p: 3, installed: false, pack: 'collect1', minL: 2, limits: null, digest: null, note: 'Spec sketch — rule citations need counsel confirmation. Not applicable to this tenant.' },
      { id: 'in-sebi-aiml', v: 1, regime: 'SEBI AI/ML consultation — actor-kind separation', issuer: 'Securities and Exchange Board of India', jur: 'IN', author: 'Rohan Kapoor', certifier: 'Arjun Mehta', status: 'withdrawn', withdrawnAt: '2027-09-14', ruleAsAt: '2025-06-20', from: '2027-07-01', to: '2027-09-14', p: 12, installed: false, pack: null, minL: 2, limits: null, digest: dg('5e0b', 'c7d2'), note: 'Withdrawn on 14 Sep 2027: it bound clause text from a consultation paper, not a final instrument. Bundles claiming this version exit 4 UNSUPPORTED with the withdrawal date printed.' },
      { id: 'eu-ai-act-art12', v: 1, regime: 'EU AI Act Article 12 — record-keeping (proposed)', issuer: 'European Union', jur: 'EU', author: 'Farah Sheikh', certifier: null, status: 'draft', ruleAsAt: null, from: null, to: null, p: 2, installed: false, pack: null, minL: 2, limits: null, digest: null, note: 'Proposed. Engaged only through an EU customer.' }
    ],
    checks: [
      { id: 'C01', kind: 'structural', statement: 'Every governed change to a book of account appears as a record', onFail: 'fail_profile', clauses: ['Cl. 1'] },
      { id: 'C02', kind: 'binding', statement: 'Each record names who made the change and whether they were a person or software', onFail: 'fail_profile', clauses: ['Cl. 1'] },
      { id: 'C03', kind: 'binding', statement: 'Each change identifies the record changed and the version written', onFail: 'fail_profile', clauses: ['Cl. 2'] },
      { id: 'C04', kind: 'temporal', statement: 'Each change carries the date it was made, from the platform clock', onFail: 'fail_profile', clauses: ['Cl. 3'] },
      { id: 'C05', kind: 'integrity', statement: 'The trail cannot have been disabled without detection', onFail: 'fail_integrity', clauses: ['Cl. 4'] },
      { id: 'C06', kind: 'temporal', statement: 'The trail cannot have been silently truncated', onFail: 'fail_integrity', clauses: ['Cl. 4'] }
    ],
    conformance: [
      ['P1', 'Clause coverage'], ['P2', 'Name resolution'], ['P3', 'Known-good'], ['P4', 'Known-tampered — all 28 negatives exit 1'], ['P5', 'Known-nonconforming — exit 2, never 1'], ['P6', 'Incomplete — exit 3, never 2'],
      ['P7', 'Erasure wording — the string FAIL appears nowhere'], ['P8', 'L1 dry-run'], ['P9', 'Scope printing'], ['P10', 'Limits statement'], ['P11', 'Second reader'], ['P12', 'Offline']
    ]
  };

  /* Verifier runs (reports readers attached; the verifier records nothing itself) */
  D.runs = [
    { n: 1, bundle: 'EB-2027-0007', scenario: 'Kaveri Level 2 range, ledger1 profile', verdict: 'PASS', detail: '12,480 records · 23 of 23 write types · C01–C06 passed · Notes: “22 records unanchored at export”', by: 'Venkat Raman', src: 'tenant', at: '2027-10-26T11:05:00Z', profile: 'in-mca-audit-trail v1', from: 41207, to: 53686, refusals: 611 },
    { n: 2, bundle: 'EB-2027-0003', scenario: 'Boundary-spanning seq 38,001–45,000, no profile claimed', verdict: 'PASS', detail: 'Scope: “Level 1: 3,206 records (seq 38,001–41,206) · Level 2: 3,794 records (seq 41,207–45,000)”. Signature rows not_applicable — assurance level 1 for the Level 1 segment only', by: 'Venkat Raman', src: 'tenant', at: '2027-08-22T09:40:00Z', profile: null, from: 38001, to: 45000, refusals: 318, spans: true },
    { n: 3, bundle: 'EB-2027-0005', scenario: 'Range with three erased payloads (DPDP erasure ER-0193)', verdict: 'PASS — payload unbound', detail: 'Notes: “seq 44,019, 47,302, 50,881: chain intact, payload unbound”', by: 'CA Lakshmi Iyer', src: 'auditor', at: '2027-10-13T05:10:00Z', profile: 'in-mca-audit-trail v1', from: 44001, to: 51000, refusals: 344 },
    { n: 4, bundle: null, scenario: 'L1 dry run of the profile against reference fixtures (before the upgrade)', verdict: 'PASS — unsigned, assurance level 1', detail: 'C06 not_applicable — assurance level 1', by: 'Rohan Kapoor', src: 'reference', at: '2027-07-20T08:00:00Z', profile: 'in-mca-audit-trail v1', from: 1, to: 10000, refusals: 412, l1: true },
    { n: 5, bundle: null, scenario: 'Published tampered bundle', verdict: 'FAIL_INTEGRITY', detail: '“FAIL at seq 3,181: prev_digest mismatch, expected a376… got 0000…”', by: 'Venkat Raman', src: 'tenant', at: '2027-08-13T11:48:00Z', profile: 'in-mca-audit-trail v1', from: 1, to: 10000, refusals: 412, first: 'FAIL at seq 3,181: prev_digest mismatch, expected a376… got 0000…' },
    { n: 6, bundle: null, scenario: 'Sound bundle, budget gate disabled on erp.journal_entry.submit at v6, refusals omitted (reference fixture)', verdict: 'FAIL_PROFILE', detail: 'First failure: “C01 structural … refusals_required: true, refusal_count 0”', by: 'Rohan Kapoor', src: 'reference', at: '2027-06-16T10:00:00Z', profile: 'in-mca-audit-trail v1', from: 1, to: 10000, refusals: 0, first: 'C01 structural at bundle level: refusals_required: true, refusal_count 0 — expected at least one refused record in range, found none' },
    { n: 7, bundle: 'EB-2027-0004', scenario: 'Auditor’s copy of EB-2027-0004 missing declarations/…_v8.json in transit', verdict: 'INCOMPLETE', detail: '“Missing member: declarations/(9a41…, 8)” — the bundle was re-sent in full the same day', by: 'CA Lakshmi Iyer', src: 'auditor', at: '2027-10-02T07:25:00Z', profile: 'in-mca-audit-trail v1', from: 41207, to: 50112, refusals: 441, first: 'Missing member: declarations/(9a41…, 8) — referenced by F06/F07 on 2,214 records' },
    { n: 8, bundle: null, scenario: 'Bundle claiming in-mca-audit-trail v3 (reference fixture)', verdict: 'UNSUPPORTED', detail: '“Unknown profile version: in-mca-audit-trail v3”', by: 'Rohan Kapoor', src: 'reference', at: '2027-06-16T10:20:00Z', profile: 'in-mca-audit-trail v3', from: 1, to: 10000, refusals: 412 },
    { n: 9, bundle: null, scenario: 'elan1-verify --bundel …', verdict: 'USAGE', detail: '“Unknown argument --bundel”', by: 'CA Lakshmi Iyer', src: 'auditor', at: '2027-10-26T15:02:00Z', profile: null, from: null, to: null },
    { n: 10, bundle: 'EB-2027-0001', scenario: 'Upgrade stage 4 dry export over seq 40,801–41,400', verdict: 'FAIL_PROFILE', detail: 'min_assurance_level 2: 406 records in range are Level 1 (seq 40,801–41,206). Expected and useful.', by: 'Arjun Rao', src: 'operator', at: '2027-08-12T09:14:00Z', profile: 'in-mca-audit-trail v1', from: 40801, to: 41400, refusals: 29, spans: true, first: 'bundle_requirements.min_assurance_level 2 unmet at seq 40,801: assurance_level 1 (406 records, seq 40,801–41,206)' },
    { n: 11, bundle: 'EB-2027-0002', scenario: 'First bundle, exported by the tenant at upgrade stage 5', verdict: 'PASS', detail: '354 records · 17 refusals · C01–C06 passed', by: 'Venkat Raman', src: 'tenant', at: '2027-08-13T11:41:00Z', profile: 'in-mca-audit-trail v1', from: 41207, to: 41560, refusals: 17 }
  ];

  /* The six exit codes; code 0 has three verdict strings */
  var EXIT = {
    'PASS': { code: 0, tone: 'good', means: 'Every integrity check passed and every profile check passed', does: 'Rely on it within the limits statement' },
    'PASS — payload unbound': { code: 0, tone: 'good', means: 'One or more records’ payload salts were destroyed under an erasure obligation. Chain intact, payload unbound', does: 'Note it. This is not a failure and must never be printed as one' },
    'PASS — unsigned, assurance level 1': { code: 0, tone: 'neutral', means: 'Structure and chain verified; signature, key-window and anchor checks not_applicable', does: 'Treat as internal control evidence only. It is not third-party-checkable' },
    'FAIL_INTEGRITY': { code: 1, tone: 'critical', means: 'A digest, a chain link, a signature, an inclusion path or an anchor did not verify', does: 'Stop. This is a forensic question, not a compliance question' },
    'FAIL_PROFILE': { code: 2, tone: 'serious', means: 'Integrity is sound; a profile requirement is unmet', does: 'The records are trustworthy and the bundle does not meet this regime’s requirements. Two different findings' },
    'INCOMPLETE': { code: 3, tone: 'warning', means: 'A referenced declaration version, lexicon or anchor member is missing from the bundle', does: 'Ask for a complete bundle. Do not treat as a failure of the records' },
    'UNSUPPORTED': { code: 4, tone: 'neutral', means: 'Unknown profile version or unknown domain string', does: 'Obtain the matching verifier. Never interpret' },
    'USAGE': { code: 5, tone: 'neutral', means: 'Bad arguments, unreadable file', does: 'Operator error' }
  };

  /* ---------------------------------------------------------------------------
     Small helpers
     --------------------------------------------------------------------------- */
  function num(n) { return F.num(n); }
  function sq(n) { return '#' + F.num(n); }
  function rng(a, b) { return 'seq ' + num(a) + '–' + num(b); }
  function seqA(n, label) { return '<a class="e1-mono" href="#/assurance/proof/' + esc(n) + '">' + esc(label || sq(n)) + '</a>'; }
  function mono(s) { return '<span class="e1-mono">' + esc(s) + '</span>'; }
  function utc(iso, noLocal) { return '<span class="e1-mono">' + esc(iso) + '</span>' + (noLocal ? '' : '<br><span class="e1-caption e1-muted">' + esc(F.dateTime(iso)) + '</span>'); }
  function ist(iso) { return F.dateTime(iso); }
  function day(iso) { return F.date(iso); }
  function sec(id, title, body, o) { o = o || {}; return c.section({ id: 'ae-' + id, title: title, lead: o.lead, actions: o.actions, eyebrow: o.eyebrow, body: body }); }
  function para(t, cls) { return '<p' + (cls ? ' class="' + cls + '"' : '') + '>' + esc(t) + '</p>'; }
  function limitsBlock(text, cite) { return '<blockquote class="ae-limits"><p>' + esc(text) + '</p>' + (cite ? '<cite>' + esc(cite) + '</cite>' : '') + '</blockquote>'; }
  function out(caption, text) { return '<pre class="ae-out"><span class="ae-out__cap">' + esc(caption) + '</span>' + esc(text) + '</pre>'; }
  function ulist(items, plain) { return '<ul class="ae-list' + (plain ? ' ae-list--plain' : '') + '">' + items.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>'; }
  function escList(items) { return items.map(function (x) { return esc(x); }); }
  function kpis(list) { return '<div class="ae-kpis">' + list.map(function (s) { return c.stat(s); }).join('') + '</div>'; }
  function bundleById(id) { for (var i = 0; i < D.bundles.length; i++) if (D.bundles[i].id === id) return D.bundles[i]; return null; }
  function profileById(id) { for (var i = 0; i < D.profiles.length; i++) if (D.profiles[i].id === id) return D.profiles[i]; return null; }
  function runByN(n) { for (var i = 0; i < D.runs.length; i++) if (String(D.runs[i].n) === String(n)) return D.runs[i]; return null; }
  function recordsOf(b) { return b.to - b.from + 1; }
  function bundleDigest(b) { return b.digest || dg(hx(b.id, 4), hx(b.id + 't', 4), b.id); }
  function manifestDigest(b) { return dg(hx(b.id + 'm', 4), hx(b.id + 'mt', 4), b.id + 'manifest'); }
  function bundleFile(b) { return b.file || ('kaveri-' + (b.profile ? 'ledger1-' : 'integrity-') + b.id.toLowerCase() + '.tar'); }
  function exitBadge(v, o) {
    var e = EXIT[v] || { code: '?', tone: 'neutral' };
    o = o || {};
    return c.verdict(e.tone, e.code + ' ' + v, { icon: e.tone === 'good' ? 'check' : (e.tone === 'neutral' ? 'info' : 'alert') });
  }
  function levelsOf(from, to) {
    var s = [], B = D.boundary.seq;
    if (from < B) s.push({ level: 1, from: from, to: Math.min(to, B - 1) });
    if (to >= B) s.push({ level: 2, from: Math.max(from, B), to: to });
    return s;
  }
  var STATE_ICON = { good: 'check', warning: 'clock', serious: 'alert', critical: 'alert', info: 'info', neutral: 'minus' };

  /** A boundary bar: segments with counts in words; never colour alone. */
  function boundaryBar(segs, o) {
    o = o || {};
    var total = segs.reduce(function (a, s) { return a + (s.to - s.from + 1); }, 0) || 1;
    var WORD = { 1: 'Level 1 — hash-chained, not signed', 2: 'Level 2 — signed and anchored', 3: 'Level 3' };
    return '<figure class="ae-bndfig" style="margin:0">' +
      '<div class="ae-bnd" role="img" aria-label="' + esc(segs.map(function (s) { return 'Level ' + s.level + ': ' + rng(s.from, s.to) + ', ' + num(s.to - s.from + 1) + ' records'; }).join('; ')) + '">' +
      segs.map(function (s) {
        var n = s.to - s.from + 1;
        return '<span class="ae-bnd__seg ae-bnd__seg--' + s.level + '" style="flex:' + n + ' 1 0">' + c.icon(s.level >= 2 ? 'seal' : 'chain', 12) + 'L' + s.level + ' · ' + esc(num(n)) + '</span>';
      }).join('') + '</div>' +
      '<ul class="ae-bndlegend" role="list">' + segs.map(function (s) {
        return '<li>' + c.level('L' + s.level, { short: true }) + '<span><b>' + esc(rng(s.from, s.to)) + '</b> · ' + esc(num(s.to - s.from + 1)) + ' records · ' + esc(s.note || WORD[s.level]) + '</span></li>';
      }).join('') + '</ul>' + (o.caption ? '<figcaption class="e1-caption e1-muted ae-mt-s">' + esc(o.caption) + '</figcaption>' : '') + '</figure>';
  }
  function boundaryLine(l2count) {
    return 'Signing on at seq ' + num(D.boundary.seq) + ' · ' + num(D.boundary.l1) + ' records at Level 1 · ' + num(l2count === undefined ? D.boundary.l2 : l2count) + ' at Level 2';
  }
  var TRUE_SENTENCE = 'Records from 12 August 2027 are signed; the 41,206 records before that date are Level 1 and are labelled so.';

  /* Level tag for the page header meta */
  function levelMeta(L, extra) {
    var h = '';
    if (L === 'L2') h += '<span class="ae-lvtag">' + c.level('L2') + '<span>Level 2 Attested</span></span>';
    else if (L === 'L3') h += '<span class="ae-lvtag">' + c.level('L3') + '<span>Level 3 Proven — preview, not available</span></span>';
    var note = extra !== undefined ? extra : (L === 'L3' ? 'Sample data: Kaveri Spinning Mills as it would look at Level 3, September 2028.' : L === 'L2' ? 'Sample data: Kaveri Spinning Mills after its Level 2 upgrade on 12 Aug 2027 · head #53,686 on 26 Oct 2027.' : '');
    if (note) h += '<span>' + esc(note) + '</span>';
    return h;
  }
  function statesMenu(path, q, list) {
    return c.menu({ label: 'View states', icon: 'layers', align: 'right', items: [{ label: 'Default', href: E1.href(path), checked: !q.state }].concat(list.map(function (s) { return { label: s.label, note: s.note, href: E1.href(path, { state: s.id }), checked: q.state === s.id }; })) });
  }

  /**
   * One screen: header, then the body — or, below the level it needs, the locked explainer and a faded preview.
   * o: {L, title, lead, eyebrow, back, actions, meta, body(), stateBody(state), states:[{id,label}], path, q, lock:{why, items}}
   */
  function screen(o) {
    var q = o.q || {};
    var ok = !o.L || E1.atLeast(o.L);
    var acts = ok ? (o.actions || '') + (o.states ? statesMenu(o.path, q, o.states) : '') : '';
    var head = ph({ title: o.title, lead: o.lead, eyebrow: o.eyebrow, back: o.back, actions: acts, meta: o.metaHtml !== undefined ? o.metaHtml : levelMeta(o.L, o.meta) });
    if (ok) {
      var alt = q.state && o.stateBody ? o.stateBody(q.state) : null;
      return head + (alt || o.body());
    }
    var word = o.L === 'L3' ? 'Level 3' : 'Level 2';
    return head + c.locked({ level: o.L, why: o.lock && o.lock.why, items: o.lock && o.lock.items }) +
      '<div class="ae-preview"><p class="ae-preview__label">' + c.icon('eye', 14) + '<span>Faded preview of this ' + word + ' screen with sample data. It is not your records, and nothing on it is claimed at ' + esc(E1.state.level) + ' ' + esc((E1.LEVELS[E1.state.level] || {}).name || '') + '. Use “Preview as ' + esc(o.L) + '” to review it at full strength.</span></p>' +
      '<div class="ae-preview__body" inert aria-hidden="true">' + o.body() + '</div></div>';
  }
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
  function loadingState() { return c.skeleton({ kind: 'stat' }) + '<div class="ae-mt">' + c.skeleton({ kind: 'table', rows: 6 }) + '</div>'; }

  /* ---------------------------------------------------------------------------
     Nav: Level group additions and a Level 3 preview group (≤ 5 groups per door)
     --------------------------------------------------------------------------- */
  E1.navAdd('assurance', { id: 'anchoring', label: 'Anchoring', href: '#/assurance/anchoring', group: 'Level', after: 'exports' });
  E1.navAdd('assurance', { id: 'profiles', label: 'Verifier profiles', href: '#/assurance/profiles', group: 'Level', after: 'anchoring' });
  E1.navAdd('assurance', { id: 'verify-runs', label: 'Verifier runs', href: '#/assurance/verify-runs', group: 'Level', after: 'profiles' });
  E1.navAdd('assurance', { id: 'receipts', group: 'Level 3 preview' });
  E1.navAdd('assurance', { id: 'disclosures', group: 'Level 3 preview' });
  E1.navAdd('assurance', { id: 'certification', label: 'Certification', href: '#/assurance/certification', group: 'Level 3 preview', after: 'disclosures' });
  E1.navAdd('assurance', { id: 'l3', label: 'L3 readiness', href: '#/assurance/l3', group: 'Level 3 preview', after: 'certification' });

  var CR = [['Assurance', '#/assurance']];

  /* ===========================================================================
     UPGRADE — the L1 → L2 runbook (E19) as a guided wizard
     At L1 the wizard is a rehearsal: nothing is signed or written. At L2+ it is the recorded history.
     =========================================================================== */
  var STAGES = [
    { n: 0, name: 'Pre-flight', rev: 'fully', how: 'Nothing changed.', lead: 'Replay the whole chain, confirm the key register and the profile registry, and record the head seq every later step refers to.', at: '2027-08-12T05:40:00Z',
      tasks: [
        { k: 'replay', label: 'Run the full-chain replay', d: 'Every digest recomputed from seq 1. Replay, not assertion. Anything other than continuous stops here.', out: 'continuous, 41,188 records, seq 1–41,188, all 23 write types\nduration 00:04:12 · worker v1.4.2' },
        { k: 'keys', label: 'Confirm the key register', d: 'An active key for residency domain in, with a registered successor.', out: 'k_in_20270701_4d7e  active   valid_from 2027-07-01T00:00:00Z\nk_in_20280701_b21f  registered — signs from 2028-07-01T00:00:00Z · Overlap: none' },
        { k: 'profile', label: 'Confirm the profile registry entry', d: 'A certified profile for a regime the tenant is in, with an author and a different certifier.', out: 'in-mca-audit-trail v1 · certified 2027-06-18 · author Rohan Kapoor · certifier Kavya Menon' },
        { k: 'head', label: 'Record the tenant’s head seq', d: 'This number is the one every later step refers to.', out: 'Head seq recorded: 41,188 · 2027-08-12T05:40:00Z' }
      ] },
    { n: 1, name: 'Key provisioning', rev: 'fully', how: 'Unbind the tenant from the key. No record was signed. The key stays in the register, unused for this tenant.', lead: 'Bind the tenant to the domain signing key with signing still off, and publish the fingerprint out of band before any record is signed.', at: '2027-08-12T05:52:00Z',
      tasks: [
        { k: 'bind', label: 'Bind the tenant to the domain key', d: 'Nothing signs yet.', out: 'Key bound · signing off\nkey_id k_in_20270701_4d7e · recorded at #41,191', rec: 41191 },
        { k: 'publish', label: 'Publish the fingerprint to the notice contact', d: 'Out of band, before any record is signed, and recorded. A reader who receives the fingerprint after the records is a reader who received it from the same party who produced them.', out: 'Fingerprint sent to Meenakshi Iyer (Owner, notice contact)\nchannel: signed letter by courier + DNS TXT record on kaverispinning.example\nrecorded at #41,192 · 2027-08-12T05:58:12Z', rec: 41192 }
      ] },
    { n: 2, name: 'Signing on', irrev: true, rev: 'partially', how: 'Signing is switched off; the chain continues at assurance_level 1 from the next record. Records already signed stay signed.', lead: 'The irreversible instant. Enabling signing is a governed write with dual_control: true, approved by a second named person at Decide.', at: '2027-08-12T06:29:40Z',
      tasks: [
        { k: 'request', label: 'Request approval to enable signing', d: 'A governed write that climbs the nine rungs. A second named human approves at Decide — never the requester, never an agent.', out: 'OB-2027-1207 raised by Arjun Rao (elan1 upgrade operator) at #41,198\napproved by Arjun Mehta (elan1 lead) at #41,205\nenablement recorded at #41,206', rec: 41206 },
        { k: 'boundary', label: 'The chain writer signs the next record', d: 'That record’s seq is the boundary, B. Records 1 … B−1 are assurance_level 1 with no signature member.', out: 'Signing on at seq 41,207 · 41,206 records at Level 1 · 0 at Level 2', rec: 41207 },
        { k: 'verify10', label: 'Verify the first ten signed records with the tenant’s fingerprint', d: 'Using the fingerprint the tenant was given, not one from our own registry.', out: 'seq 41,207–41,216 · 10 records · signatures verified against ed25519:3f9a 1c07 … 8b2e (from the tenant’s letter)', l2only: true }
      ] },
    { n: 3, name: 'Anchoring on', rev: 'fully', how: 'Anchoring is switched off. Batches already stamped stay stamped and remain valid evidence.', lead: 'Enable the anchor service. The first batch closes at the interval and is stamped by both authorities; the unanchored head rises, then falls to zero.', at: '2027-08-12T06:31:05Z',
      tasks: [
        { k: 'enable', label: 'Enable the anchor service for the tenant', d: 'The first batch opens. Anchoring never refuses or delays a write.', out: 'Anchoring on · recorded at #41,209 · interval ≤15 minutes (Growth tier SLO)', rec: 41209 },
        { k: 'fall', label: 'Watch the unanchored head fall to zero', d: 'If it does not fall within two intervals, stop and follow the degraded path.', out: 'head 13 at 06:44 → 0 at 06:45:03 (first batch anchored)', l2only: true },
        { k: 'tokens', label: 'Confirm anchors/ for the first batch', d: 'Two tokens, two certification paths and the revocation data captured at anchor time.', out: 'b_20270812_0630_7c1e · seq 41,207–41,219 · 13 leaves\neMudhra genTime 2027-08-12T06:45:02Z · DigiCert genTime 2027-08-12T06:45:03Z', l2only: true }
      ] },
    { n: 4, name: 'Profile installed', rev: 'fully', how: 'The profile is uninstalled. The declaration version stays published — versions are never withdrawn — and is simply not referenced by new writes.', lead: 'Confirm the declaration version carrying the proof_binding addition, install the certified profile, and run a dry export.', at: '2027-08-12T09:02:10Z',
      tasks: [
        { k: 'decl', label: 'Confirm the declaration version with the block 6 addition', d: 'The only place an upgrade touches the declaration. erp.ar v12 was certified before signing on, so every signed record carries the bound fields.', out: 'erp.ar v12 · certified by Arjun Mehta (author Farah Sheikh) · #41,160 · 2027-08-12T05:12:30Z\nproof_binding + redaction_profile ledger1-default, + fields posting_date, grand_total, items[].item_code, items[].qty, items[].rate', rec: 41160 },
        { k: 'install', label: 'Install in-mca-audit-trail v1 on the tenant', d: 'applies_to_records_from must not be later than the boundary; if it is, installation refuses and prints both dates.', out: 'Installed · applies_to_records_from 2027-07-01 · boundary 2027-08-12 · recorded at #41,398', rec: 41398 },
        { k: 'dry', label: 'Run a dry export and verify it', d: 'A 2 FAIL_PROFILE here is expected and useful: it is far better found now.', out: 'EB-2027-0001 · seq 40,801–41,400 → exit 2 FAIL_PROFILE\nmin_assurance_level 2 unmet: 406 records are Level 1 (seq 40,801–41,206)', rec: 41401 }
      ] },
    { n: 5, name: 'First bundle', rev: 'n/a', how: 'A bundle already handed over cannot be recalled and must not be described as invalid.', lead: 'The tenant exports the bundle themselves, verifies it offline, and watches the published tampered bundle exit 1. If they cannot, the upgrade is not finished.', at: '2027-08-13T11:20:44Z',
      tasks: [
        { k: 'export', label: 'Tenant exports the bundle themselves', d: 'From the product, without our involvement.', out: 'EB-2027-0002 · seq 41,207–41,560 · 354 records · 17 refusals · exported by Venkat Raman · #41,566', rec: 41566, tenant: true },
        { k: 'pass', label: 'Tenant verified 0 PASS', d: 'Over the Level 2 range, and a boundary-spanning range printing both levels and both counts.', out: '0 PASS · in-mca-audit-trail v1 · C01–C06 passed · report attached by Venkat Raman', tenant: true, l2only: true },
        { k: 'tampered', label: 'Tenant watched the tampered bundle exit 1', d: 'A verifier nobody has watched refuse is not a verifier.', out: '1 FAIL_INTEGRITY · FAIL at seq 3,181: prev_digest mismatch, expected a376… got 0000…', tenant: true, l2only: true }
      ] }
  ];
  var CLOSE_STEPS = [
    ['Verify over the whole chain, seq 1 to head', 'continuous · seq 1–41,588 · 41,588 records · 23 of 23 write types · both segments printed'],
    ['Customer exports a boundary-spanning bundle and verifies it offline', '0 PASS · scope names Level 1 and Level 2 with both counts'],
    ['Customer verifies a bundle wholly inside the Level 2 range against the installed profile', '0 PASS · EB-2027-0002 · clause results and the limits statement printed'],
    ['KMS Sign calls reconcile with signed records for the first full night', 'reconciled · 13 Aug 2027 · Sign calls 3,118 · signed records 3,118 · all tenants in domain in'],
    ['The unanchored head returned to zero within the published interval', 'yes · 06:45:03 on 12 Aug 2027'],
    ['The boundary row is rendered on the Assurance door with counts on each side', 'visible to the customer without asking'],
    ['Write the closing record', 'boundary seq, boundary timestamp, counts, profile installed, the bundle digest the customer verified, and both named humans']
  ];

  function rehearsal() { return E1.store.get('ae.rehearsal', {}) || {}; }
  function done(stage, k) {
    if (E1.atLeast('L2')) return true;
    var r = rehearsal(); return !!(r[stage] && r[stage][k]);
  }
  function stageDone(s) { return s.tasks.every(function (t) { return done(s.n, t.k); }); }
  function wizardNav(active) {
    var items = STAGES.map(function (s) { return { id: String(s.n), label: s.name, href: '#/assurance/upgrade/' + s.n, done: stageDone(s), irrev: s.irrev }; });
    items.push({ id: 'close', label: 'Close', href: '#/assurance/upgrade/close', done: E1.atLeast('L2') });
    return '<nav aria-label="Upgrade stages"><ol class="ae-wiz" role="list">' + items.map(function (it, i) {
      var on = it.id === String(active);
      return '<li><a href="' + it.href + '" class="' + (it.done ? 'is-done' : '') + (it.irrev ? ' is-irrev' : '') + '"' + (on ? ' aria-current="step"' : '') + '><span class="ae-wiz__n">' + (it.done ? c.icon('check', 12) : (i < 6 ? i : '✓')) + '</span>' + esc(it.label) + (it.irrev ? '<span class="e1-sr"> (irreversible)</span>' : '') + (it.done ? '<span class="e1-sr"> — done</span>' : '') + '</a></li>';
    }).join('') + '</ol></nav>';
  }
  function modeBanner(stageAt) {
    if (E1.atLeast('L2')) return c.callout({ kind: 'good', title: 'Recorded history', body: '<p>This stage ran on ' + esc(ist(stageAt)) + ' and every step is a governed write in the tenant’s own chain. The customer can read the whole upgrade there afterwards, which is the point.</p>' });
    return c.callout({ kind: 'caveat', title: 'Rehearsal — nothing is signed and nothing is written', body: '<p>Your tenant runs at L1 Guarded and the upgrade has no date. Walk the runbook so the people involved know what each screen will print. Outputs are the runbook’s worked example, not your records.</p>' });
  }

  function upgradeOverview(p, q) {
    var L2 = E1.atLeast('L2');
    var status = L2
      ? '<div class="ae-hero"><span class="e1-badge e1-badge--good">' + c.icon('check', 12) + '<span>Closed</span></span><p class="ae-hero__big">Closed on 13 Aug 2027 by record ' + seqA(41611) + '</p><span class="e1-caption e1-muted">Operator Arjun Rao · second named person Arjun Mehta · customer Venkat Raman</span></div>' +
        '<div class="ae-mt">' + boundaryBar([{ level: 1, from: 1, to: D.boundary.l1 }, { level: 2, from: D.boundary.seq, to: D.boundary.head }]) + '</div>' +
        '<p class="ae-line ae-mt">' + esc(boundaryLine()) + '</p><p class="e1-caption e1-muted ae-mt-s">' + esc(TRUE_SENTENCE) + '</p>'
      : '<div class="ae-hero"><span class="e1-badge e1-badge--neutral">' + c.icon('minus', 12) + '<span>Not scheduled</span></span><p class="ae-hero__big">Your upgrade date is not set yet.</p></div>' +
        '<p class="e1-text-body ae-mt">Level 2 depends on platform readiness items that are not complete; we do not give a date until they are. Preconditions 2 to 5 below are ours, not yours. Precondition 7 is the only one you take part in.</p>' +
        '<div class="ae-mt">' + boundaryBar([{ level: 1, from: 1, to: D.today.head, note: 'written so far — will stay Level 1 forever' }], { caption: 'Today, 24 Sep 2026: every record is Level 1. When signing switches on, the next record becomes the boundary B; nothing before it is ever signed.' }) + '</div>';

    var changes = [
      ['Records from the boundary carry a signature member and a key_id', 'The seven declaration blocks — identity, shape, permissions, write_types, gates, channels, and block 6 except for one addition'],
      ['Records from the boundary acquire an anchor_ref once their batch closes', 'The sixteen fields, their order, their encoding, the preimage and the digest'],
      ['assurance_level on new records reads 2', 'The nine rungs, their order, and which gates are never skippable'],
      ['The Assurance door gains the unanchored-head line and the boundary row', 'The policy versions, the rules, the refusal codes, the autonomy grants'],
      ['Bundle export becomes available, with a claimed profile', 'The meter basis, which stays the declared blast radius'],
      ['SKU 2 lines appear on the invoice', 'seq, which continues from wherever it was. The chain does not restart'],
      ['A per-record salt begins to be retained for erasure', 'Everything already written, in every respect']
    ];
    var cmp = c.table({ caption: 'What changes, and what stays exactly as it was', columns: [{ key: 'a', label: 'Changes' }, { key: 'b', label: 'Stays exactly as it was' }], rows: changes.map(function (r) { return { a: r[0], b: r[1] }; }) });

    var demo = c.table({ caption: 'in-mca-audit-trail v1, check C06', columns: [
      { key: 'id', label: 'Check', mono: true }, { key: 's', label: 'Statement' },
      { key: 'l1', label: 'At Level 1 today', html: true }, { key: 'l2', label: 'At Level 2', html: true }], rows: [
      { id: 'C05', s: 'The trail cannot have been disabled without detection', l1: c.badge('neutral', 'passed — within your own chain', { icon: 'minus' }), l2: c.badge('good', 'passed — signed, checkable by a stranger') },
      { id: 'C06', s: 'The trail cannot have been silently truncated', l1: '<code class="e1-mono">not_applicable — assurance level 1</code>', l2: c.badge('good', 'passed — head anchored ≤15 min') }] });

    var pre = L2 ? [
      ['The proof preimage is frozen and unchanged since the first record', 'Replay of seq 1–41,188 on 12 Aug 2027: every digest recomputed, 0 mismatches', 'true', 'Forensic if false'],
      ['Key custody in the residency domain, with a rotation window and a registered successor', 'k_in_20270701_4d7e active; a rotation already performed in production on 1 Jul 2027 (operator chain #1,204); successor registered', 'true', 'Platform readiness — no date until true'],
      ['The anchor interval is a published SLO for the tier', '≤15 minutes, Growth tier; measured July 2027: p99 lag 13 m 52 s', 'true', 'Platform readiness — no date until true'],
      ['The offline verifier passes the published vectors, including refusing the tampered bundle', 'Verifier v1.0.3: all positives pass, 28 of 28 negatives refused, tampered bundle exits 1; byte-identical builds on two machines', 'true', 'Platform readiness — no date until true'],
      ['A certified profile exists for a regime the tenant is in', 'in-mca-audit-trail v1 · certified 18 Jun 2027 · author Rohan Kapoor · certifier Kavya Menon', 'true', 'Platform readiness — no date until true'],
      ['Chain continuity over the whole history reads continuous, with scope and count', 'continuous · seq 1–41,188 · 41,188 records · 23 of 23 write types · full_chain', 'true', 'Forensic if false'],
      ['proof_binding covers every field the regime’s bundle must contain', 'erp.ar v12 validated, certified 12 Aug 2027 at #41,160', 'true', 'Your declaration work']
    ] : [
      ['The proof preimage is frozen and unchanged since the first record', 'Replay of seq 1–4,112 on 24 Sep 2026, 02:10 IST: every digest recomputed, 0 mismatches', 'true', 'Forensic if false'],
      ['Key custody in the residency domain, with a rotation window and a registered successor', 'No signing key exists for domain in. At Level 1 there is no key material anywhere — not in a config file, not in a vault, not “just for testing”.', 'false', 'Platform readiness — no date until true'],
      ['The anchor interval is a published SLO for the tier', 'No authority is contracted yet, so there is no measured month.', 'not measured', 'Platform readiness — no date until true'],
      ['The offline verifier passes the published vectors, including refusing the tampered bundle', 'The vector set is not frozen; the verifier is in build. No vector run exists.', 'not measured', 'Platform readiness — no date until true'],
      ['A certified profile exists for a regime the tenant is in', 'in-mca-audit-trail v1 is a draft (7 of 12 conformance tests). No certifier has signed it off.', 'false', 'Platform readiness — no date until true'],
      ['Chain continuity over the whole history reads continuous, with scope and count', 'continuous · seq 1–4,112 · 19 of 23 write types. A partial scope does not satisfy this precondition.', 'not measured', 'Forensic if a break is found'],
      ['proof_binding covers every field the regime’s bundle must contain', 'erp.ar v7 binds customer and grand_total only; in-mca-audit-trail needs posting_date and items[] as well.', 'false', 'Your declaration work']
    ];
    var ST = { 'true': ['good', 'True'], 'false': ['warning', 'False'], 'not measured': ['neutral', 'Not measured'] };
    var preTable = c.table({ caption: 'The seven preconditions, verified not asserted', columns: [
      { key: 'n', label: '#', mono: true, width: '36px' }, { key: 'p', label: 'Precondition' }, { key: 'e', label: 'Evidence', html: true },
      { key: 's', label: 'Status', html: true, nowrap: true }, { key: 'r', label: 'If it fails', html: true }],
      rows: pre.map(function (r, i) {
        return { n: i + 1, p: r[0], e: esc(r[1]) + (i === 6 && !L2 ? '<div class="ae-mt-s">' + c.button('Open the declaration', { size: 'sm', kind: 'secondary', href: '#/records/declarations/erp.ar', iconRight: 'arrow-right' }) + '</div>' : ''), s: c.badge(ST[r[2]][0], ST[r[2]][1]), r: '<span class="e1-caption">' + esc(r[3]) + '</span>' };
      }) });

    var stagesList = '<ol class="ae-steps" role="list">' + STAGES.map(function (s) {
      var d = stageDone(s);
      return '<li><span class="ae-steps__n' + (d ? ' is-done' : '') + (s.irrev ? ' is-irrev' : '') + '">' + (d ? c.icon('check', 12) : s.n) + '</span><div><p class="ae-steps__t"><a href="#/assurance/upgrade/' + s.n + '">Stage ' + s.n + ' — ' + esc(s.name) + '</a></p><p class="ae-steps__d">' + esc(s.lead) + '</p></div>' +
        '<div class="ae-steps__side">' + (s.irrev ? c.badge('serious', 'Irreversible — needs a second named person at Decide') : '') + c.badge('neutral', 'Rollback: ' + s.rev, { subtle: true, icon: 'undo' }) + '</div></li>';
    }).join('') + '<li><span class="ae-steps__n' + (L2 ? ' is-done' : '') + '">' + (L2 ? c.icon('check', 12) : '✓') + '</span><div><p class="ae-steps__t"><a href="#/assurance/upgrade/close">Close — the verification that closes the upgrade</a></p><p class="ae-steps__d">Seven checks, then the closing record. There is no “closed with follow-ups”.</p></div><div class="ae-steps__side">' + c.button('Rollback plan', { size: 'sm', kind: 'ghost', href: '#/assurance/upgrade/rollback', icon: 'undo' }) + '</div></li></ol>';

    var comms = c.timeline(L2 ? [
      { time: '29 Jul 2027 · 14 days ahead', title: 'Notice sent to Meenakshi Iyer (Owner, notice contact)', body: 'The window; writes will not stop; one additive declaration version; the fingerprint and its channel; the boundary rule; “records written before the upgrade will remain Level 1 permanently and will not be signed retrospectively.”', state: 'good' },
      { time: '12 Aug 2027, 12:10 IST', title: 'Boundary confirmation sent', body: boundaryLine(0) + ' · boundary timestamp 2027-08-12T06:30:11Z. One line, kept by both parties.', state: 'good' },
      { time: '13 Aug 2027', title: 'First-bundle note for the auditor', body: 'One page for CA Lakshmi Iyer: what the bundle is, how to get the verifier from a source other than us, the command, what a PASS means and what it does not. It sells nothing.', state: 'good', href: '#/assurance/bundles/EB-2027-0002' }
    ] : [
      { time: 'Not sent', title: 'Notice — at least fourteen days ahead', body: 'Goes to the named notice contact, not a shared inbox. It is written before the upgrade and sent only once a window is agreed.', state: 'neutral' },
      { time: 'Not sent', title: 'Boundary confirmation — on the day', body: 'Names the boundary seq, the boundary timestamp and the counts on each side.', state: 'neutral' },
      { time: 'Not sent', title: 'First-bundle note — after', body: 'A one-page note for your auditor. It does not sell anything.', state: 'neutral' }
    ]);

    var never = c.callout({ kind: 'rule', title: 'Never back-signed', body: '<p>Back-signing a record produced before a key existed is exactly the fraud this product is built to make impossible. There is no “sign earlier records”, “re-sign range” or “tidy up” action anywhere, and the kernel refuses one if it is asked.</p><p>Never say “the tenant’s records are signed”. The true sentence is: “' + esc(TRUE_SENTENCE) + '”</p>' +
      '<div class="e1-row ae-mt">' + c.button('Sign earlier records', { disabled: true, icon: 'lock', attrs: 'aria-describedby="ae-nb-why"' }) + '<span class="e1-caption e1-muted" id="ae-nb-why">Not available, by design. Records 1 … B−1 stay Level 1, are labelled Level 1, and are never signed afterwards.</span></div>' });

    return screen({
      L: null, q: q, path: '/assurance/upgrade',
      eyebrow: 'Level 2 Attested upgrade', title: 'Upgrade to Level 2 Attested',
      lead: 'Five stages plus pre-flight, one irreversible instant, and a boundary rendered with counts on each side. You do not re-declare, do not migrate and do not stop writing.',
      metaHtml: c.level('L2') + '<span>' + (L2 ? 'Closed 13 Aug 2027 · sample history for Kaveri Spinning Mills' : 'Your tenant runs at L1 Guarded · head #4,112 on 24 Sep 2026') + '</span>',
      actions: c.button(L2 ? 'Open the closing record' : 'Walk the runbook', { kind: 'primary', href: L2 ? '#/assurance/proof/41611' : '#/assurance/upgrade/0', iconRight: 'arrow-right' }) + c.button('Rollback plan', { href: '#/assurance/upgrade/rollback', icon: 'undo' }),
      body: function () {
        return sec('status', L2 ? 'Status' : 'Where you stand', status) +
          c.callout({ kind: 'rule', title: 'The frozen sentence', body: '<p>' + esc(FROZEN_L2) + '</p>' }) +
          sec('stages', 'The runbook', stagesList, { lead: 'Each stage is its own screen. Stage 2 is the only step that cannot be undone.' }) +
          sec('preconditions', 'Preconditions', preTable, { lead: L2 ? 'All seven read true on 12 Aug 2027, each with evidence attached.' : 'Measured on 24 Sep 2026. A failure on 1 or 6 stops everything and becomes a forensic question; 2 to 5 are platform readiness and you are not told a date until they read true; 7 is your declaration work.' }) +
          sec('demo', 'What Level 2 buys, in one row', demo, { lead: 'C06 on a Level 1 dry run reads not_applicable — assurance level 1. That single row is the clearest available demonstration of what Level 2 buys.' }) +
          sec('changes', 'What changes, and what does not', cmp, { lead: 'The one declaration change is an additive block 6 proof_binding version. If an upgrade needs a second change, the upgrade is wrong.' }) +
          '<div class="ae-two">' + sec('comms', 'Customer communications', comms) + sec('never', 'The records before the boundary', never) + '</div>';
      }
    });
  }

  function stageScreen(p, q) {
    var n = Number(p.stage);
    var s = STAGES[n];
    if (!(p.stage in { 0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 }) || !s) {
      return ph({ title: 'There is no stage “' + p.stage + '”', back: ['Upgrade to Level 2 Attested', '#/assurance/upgrade'] }) +
        c.empty({ title: 'The runbook has stages 0 to 5, then close', why: 'An upgrade is five stages plus pre-flight. Rollback and close have their own screens.', action: [{ label: 'Stage 0 — Pre-flight', href: '#/assurance/upgrade/0' }, { label: 'Rollback plan', href: '#/assurance/upgrade/rollback' }] });
    }
    var L2 = E1.atLeast('L2');
    var tasks = s.tasks.map(function (t) {
      var isDone = done(n, t.k);
      var right;
      if (L2) right = t.rec ? c.button('Record ' + sq(t.rec), { size: 'sm', kind: 'ghost', href: '#/assurance/proof/' + t.rec, iconRight: 'arrow-right' }) : c.badge('good', 'Done');
      else if (isDone) right = c.badge('neutral', 'Rehearsed', { icon: 'check' });
      else if (t.k === 'request') right = c.button('Request approval', { size: 'sm', kind: 'gate', attrs: 'data-action="ae-request-signing"' });
      else if (t.k === 'replay') right = c.button('Run replay', { size: 'sm', kind: 'primary', icon: 'play', attrs: 'data-action="ae-replay"' });
      else right = c.button(t.tenant ? 'Mark as done by the tenant' : 'Rehearse', { size: 'sm', icon: t.tenant ? 'user' : 'play', attrs: 'data-action="ae-stage-do" data-value="' + n + ':' + t.k + '"' });
      var o = '';
      if (isDone) {
        if (t.l2only && !L2) o = c.locked({ level: 'L2', compact: true, title: 'This output arrives at Assurance Level 2 Attested', why: 'It carries a signature, an anchor time or a verifier verdict, so it is not shown at your level — not even as an example.' });
        else o = out(L2 ? 'Printed ' + ist(s.at) : 'Worked example output — not your records', t.out);
      }
      return '<div class="ae-task"><div><p class="ae-task__t">' + esc(t.label) + '</p><p class="ae-task__d">' + esc(t.d) + '</p></div><div>' + right + '</div>' + (o ? '<div class="ae-task__out">' + o + '</div>' : '') + '</div>';
    }).join('');

    var extra = '';
    if (n === 1) {
      extra = sec('key', 'The domain signing key', c.card({ body: c.kv([
        ['key_id', KEY.id, { mono: true }], ['Class', 'Domain signing key — signs the 32-octet record digest at rung 8'],
        ['Fingerprint', '<span class="e1-mono">' + esc(fpr(KEY.fp.slice(0, 16)) + ' … ' + KEY.fp.slice(-4)) + '</span><div class="e1-caption e1-muted">Obtain it from your own source — the notice contact’s letter — never from a bundle or this page alone.</div>', { html: true }],
        ['Window', 'valid_from 2027-07-01T00:00:00Z · valid_to — · successor k_in_20280701_b21f', { mono: true }],
        ['Custody', KEY.custody], ['Shared', 'One signing key per residency domain, not per tenant. This key also signs other tenants’ records in domain in.']
      ]) + '<div class="e1-row ae-mt">' + c.button('Open the key', { size: 'sm', href: '#/agents/keys/' + KEY.id, iconRight: 'arrow-right' }) + c.button('Key policy evidence', { size: 'sm', kind: 'ghost', href: '#/agents/keys/policy' }) + '</div>' }));
    } else if (n === 2) {
      extra = c.callout({ kind: 'critical', title: 'The irreversible instant', body: '<p>Stage 2 is the only step in this runbook that cannot be undone. Signing can be switched off again; the records already signed stay signed. That is correct and intended — an unsignable record is the whole product — but it means stage 2 is the point of no return and is approved as such.</p>' }) +
        sec('b', 'The boundary', boundaryBar(L2 ? [{ level: 1, from: 1, to: 41206 }, { level: 2, from: 41207, to: 41216, note: 'the first ten signed records' }] : [{ level: 1, from: 1, to: 41206, note: 'worked example — stays Level 1 forever' }], { caption: 'Records 1 … B−1 are assurance_level 1 with no signature member; records from B carry a signature and a key_id. prev_digest links across B.' }) + '<p class="ae-line ae-mt">' + esc(boundaryLine(0)) + '</p>') +
        sec('refusals', 'When this stage refuses', ulist([
          esc('Enabling signing while the previous night’s integrity run is incomplete refuses at precondition, and the screen shows the last clean night.'),
          esc('An enablement approved by the operator who requested it refuses with ') + '<code>GATE.DUAL_CONTROL_SAME_ACTOR</code>' + esc(', and Send to lists eligible people — never an agent.') + ' ' + c.button('Try approving it yourself', { size: 'sm', kind: 'ghost', attrs: 'data-action="ae-self-approve"' }),
          esc('KMS unavailable during stage 2: the domain fails closed, writes refuse with a platform-class code, nothing is signed with a stale key, and the page goes out.')
        ]));
    } else if (n === 3) {
      var head = [0, 3, 7, 11, 13, 13, 0, 2, 5, 0];
      extra = sec('head', 'Unanchored head', '<div class="e1-card"><div class="e1-card__body">' + c.lineChart({ title: 'Records unanchored, first hour after anchoring on', labels: ['06:31', '06:34', '06:37', '06:40', '06:43', '06:44', '06:45', '06:50', '06:58', '07:00'], series: [{ name: 'Unanchored records', values: head }], height: 180 }) +
        '<p class="e1-caption e1-muted">Rises as the first batch fills, falls to 0 when both tokens arrive. If it does not fall within two intervals, stop and follow the degraded path.</p></div></div>') +
        c.callout({ kind: 'info', title: 'Machinery, not a governed write', body: '<p>Anchoring does not appear in the tenant’s chain and never refuses or delays a write. If both authorities are unavailable, writes and signing continue, the unanchored head grows, and the upgrade waits.</p>' }) +
        (L2 ? '<div class="e1-row ae-mt">' + c.button('Open the first batch', { href: '#/assurance/anchoring/b_20270812_0630_7c1e', iconRight: 'arrow-right' }) + '</div>' : '');
    } else if (n === 4) {
      extra = sec('decl', 'Declaration block 6 — the one addition', c.diff([
        { field: 'proof_binding.redaction_profile', before: '—', after: 'ledger1-default', mono: true, material: true },
        { field: 'proof_binding.fields[]', before: 'customer, grand_total', after: 'customer, posting_date, grand_total, items[].item_code, items[].qty, items[].rate', mono: true, material: true },
        { field: 'proof_binding.canonicalisation', before: 'elan1_lp_v1', after: 'elan1_lp_v1', mono: true },
        { field: 'gates (declared order)', before: 'consent, residency, retention, counterparty, precondition, dual_control, budget', after: 'consent, residency, retention, counterparty, precondition, dual_control, budget', mono: true }
      ], { caption: 'erp.ar v11 → v12' }) + '<div class="e1-row ae-mt">' + c.button('Open erp.ar v12', { size: 'sm', href: '#/records/declarations/erp.ar/v/12', iconRight: 'arrow-right' }) + c.button('Open the profile', { size: 'sm', kind: 'ghost', href: '#/assurance/profiles/in-mca-audit-trail' }) + '</div>');
    } else if (n === 5) {
      extra = sec('links', 'What the tenant uses', '<div class="e1-row">' + c.button('Export a bundle', { href: '#/assurance/export', icon: 'download' }) + c.button('Get the verifier', { href: '#/verify', icon: 'terminal' }) + c.button('The tampered bundle', { href: '#/verify/tampered', kind: 'ghost' }) + '</div>' +
        '<p class="e1-caption e1-muted ae-mt">The tenant’s checkboxes are attested by the tenant. elan1 is not in the room when they run the verifier, and the verifier reports to no one.</p>');
    }

    var side = c.card({ title: 'If we stop here', body: c.kv([['Reversible', s.rev === 'n/a' ? 'Not applicable' : s.rev.charAt(0).toUpperCase() + s.rev.slice(1)], ['How', s.how]], { compact: true }) + '<div class="ae-mt">' + c.button('Rollback plan', { size: 'sm', kind: 'ghost', href: '#/assurance/upgrade/rollback', icon: 'undo' }) + '</div>' }) +
      '<div class="ae-mt">' + c.card({ title: 'Who acts', body: ulist(escList(n === 5 ? ['Venkat Raman — Accounts head, exports and verifies', 'Meenakshi Iyer — Owner, notice contact'] : n === 2 ? ['Arjun Rao — elan1 upgrade operator, requests', 'Arjun Mehta — elan1 lead, second named person, approves', 'Meenakshi Iyer — told on the day'] : n === 4 ? ['Farah Sheikh — declaration author', 'Arjun Mehta — certifies erp.ar v12', 'Arjun Rao — installs the profile'] : ['Arjun Rao — elan1 upgrade operator', 'Meera Iyer — key custodian'])), plain: true }) + '</div>';

    var prev = n > 0 ? c.button('Stage ' + (n - 1) + ' — ' + STAGES[n - 1].name, { href: '#/assurance/upgrade/' + (n - 1), icon: 'arrow-left' }) : c.button('Runbook overview', { href: '#/assurance/upgrade', icon: 'arrow-left' });
    var next = n < 5 ? c.button('Stage ' + (n + 1) + ' — ' + STAGES[n + 1].name, { kind: 'primary', href: '#/assurance/upgrade/' + (n + 1), iconRight: 'arrow-right' }) : c.button('Close the upgrade', { kind: 'primary', href: '#/assurance/upgrade/close', iconRight: 'arrow-right' });

    return ph({ eyebrow: 'Level 2 Attested upgrade · stage ' + n + ' of 5', title: 'Stage ' + n + ' — ' + s.name, lead: s.lead, back: ['Upgrade to Level 2 Attested', '#/assurance/upgrade'],
      actions: (s.irrev ? c.badge('serious', 'Irreversible') : '') + (!L2 ? c.button('Reset rehearsal', { size: 'sm', kind: 'ghost', icon: 'refresh', attrs: 'data-action="ae-rehearsal-reset"' }) : ''),
      meta: c.level('L2') + '<span>Level 2 Attested upgrade</span><span>' + c.kbd('[') + ' previous · ' + c.kbd(']') + ' next stage</span>' }) +
      wizardNav(n) + '<div class="ae-mt">' + modeBanner(s.at) + '</div>' +
      '<div class="e1-split ae-mt"><div class="e1-stack">' + sec('tasks', 'Steps', tasks) + extra + '</div><aside class="ae-sticky">' + side + '</aside></div>' +
      '<nav class="ae-nav" aria-label="Stage navigation">' + prev + next + '</nav>';
  }

  function closeScreen(p, q) {
    var L2 = E1.atLeast('L2');
    var r = rehearsal().close || {};
    var rows = CLOSE_STEPS.map(function (s, i) {
      var isDone = L2 || r[i];
      return '<div class="ae-task"><div><p class="ae-task__t"><span class="e1-mono">' + (i + 1) + '</span> · ' + esc(s[0]) + '</p>' + (isDone ? '<div class="ae-mt-s">' + (L2 ? out('Recorded 13 Aug 2027', s[1]) : out('Worked example — not your records', i < 3 && !L2 ? 'Arrives at Level 2 — a verdict is not shown at your level' : s[1])) + '</div>' : '') + '</div><div>' +
        (L2 ? c.badge('good', 'Done') : isDone ? c.badge('neutral', 'Rehearsed', { icon: 'check' }) : (i === 6 ? '' : c.button('Rehearse', { size: 'sm', icon: 'play', attrs: 'data-action="ae-close-step" data-value="' + i + '"' }))) + '</div></div>';
    }).join('');
    var allDone = L2 || CLOSE_STEPS.slice(0, 6).every(function (_, i) { return r[i]; });
    var closing = c.card({ title: 'The closing record', body: c.kv([
      ['Boundary seq', '41,207', { mono: true }], ['Boundary timestamp', '2027-08-12T06:30:11Z', { mono: true }],
      ['Counts', '41,206 at Level 1 · 354 at Level 2 on the day of close'], ['Profile installed', 'in-mca-audit-trail v1', { mono: true }],
      ['Bundle the customer verified', L2 ? '<code class="e1-mono">EB-2027-0002</code> · ' + c.hash(bundleDigest(bundleById('EB-2027-0002'))) : '<span class="e1-muted">Recorded at close</span>', { html: true }],
      ['Named humans', 'Arjun Rao (operator) · Arjun Mehta (second named person)']
    ]) + '<div class="e1-row ae-mt">' + (L2 ? c.button('Open closing record #41,611', { kind: 'primary', href: '#/assurance/proof/41611', iconRight: 'arrow-right' }) :
      c.button('Write closing record', { kind: 'gate', disabled: !allDone, attrs: 'data-action="ae-close-record"' }) + (!allDone ? '<span class="e1-caption e1-muted">Rehearse steps 1 to 6 first. Any failed step reopens the upgrade.</span>' : '')) + '</div>' });
    return ph({ eyebrow: 'Level 2 Attested upgrade · Flow 3', title: 'Close the upgrade', lead: 'The upgrade is closed by this record and by nothing else — not by a ticket, not by an email, not by an operator’s opinion.', back: ['Upgrade to Level 2 Attested', '#/assurance/upgrade'], meta: c.level('L2') + '<span>Level 2 Attested upgrade</span>' }) +
      wizardNav('close') + '<div class="ae-mt">' + modeBanner('2027-08-13T16:05:00Z') + '</div>' +
      '<div class="e1-split ae-mt"><div class="e1-stack">' + sec('checks', 'Seven checks', rows, { lead: 'A partial-scope result does not close an upgrade. Any step failing reopens it; there is no partial close and no “closed with follow-ups”.' }) + '</div><aside class="ae-sticky">' + closing + '</aside></div>' +
      '<nav class="ae-nav" aria-label="Stage navigation">' + c.button('Stage 5 — First bundle', { href: '#/assurance/upgrade/5', icon: 'arrow-left' }) + c.button('Runbook overview', { href: '#/assurance/upgrade', iconRight: 'arrow-right' }) + '</nav>';
  }

  function rollbackScreen(p, q) {
    var L2 = E1.atLeast('L2');
    var tbl = c.table({ caption: 'Rollback by stage reached', columns: [{ key: 's', label: 'Stage reached' }, { key: 'r', label: 'Reversible', html: true }, { key: 'h', label: 'How' }], rows: STAGES.map(function (s) {
      return { s: s.n + ' — ' + s.name, r: c.badge(s.rev === 'fully' ? 'good' : s.rev === 'partially' ? 'serious' : 'neutral', s.rev === 'n/a' ? 'Not applicable' : s.rev.charAt(0).toUpperCase() + s.rev.slice(1)), h: s.how };
    }) });
    var island = boundaryBar([{ level: 1, from: 1, to: 41206, note: 'Level 1 — never signed' }, { level: 2, from: 41207, to: 41480, note: 'Level 2 — the signed island; stays signed' }, { level: 1, from: 41481, to: 41720, note: 'Level 1 again — from the next record after signing stops' }], { caption: 'Example: signing switched off after seq 41,480. The chain is continuous, every record verifies, and chain.json carries both boundaries with their counts.' });
    var form = c.card({ title: L2 ? 'Switch signing off' : 'Rehearse switching signing off', body:
      c.field('Reason, written into the tenant’s chain', c.textarea({ id: 'ae-rb-reason', rows: 3, placeholder: 'For example: We stopped signing on 14 August because the anchor pair could not be contracted', describedBy: 'ae-rb-reason-msg' }), { id: 'ae-rb-reason', required: true, help: 'A sentence a future auditor is entitled to read. At least 12 characters. Recorded verbatim as a governed write.' }) +
      c.checkbox({ id: 'ae-rb-notify', label: 'Notify the customer in writing within 24 hours', note: 'Names the three ranges and what is true of each.', checked: true, disabled: true }) +
      '<div class="e1-row ae-mt">' + c.button(L2 ? 'Switch signing off' : 'Rehearse', { kind: 'danger', icon: 'pause', attrs: 'data-action="ae-rollback"' }) + '</div>' });
    return ph({ eyebrow: 'Level 2 Attested upgrade · Flow 2', title: 'Rollback', lead: 'Any stage can be stopped. After stage 2, signing stops but signed records stay signed — a signed island. Ugly, and honest.', back: ['Upgrade to Level 2 Attested', '#/assurance/upgrade'], meta: c.level('L2') + '<span>Level 2 Attested upgrade</span>' }) +
      wizardNav('rollback') +
      '<div class="e1-split ae-mt"><div class="e1-stack">' + sec('table', 'What can be undone', tbl) + sec('island', 'The signed island, previewed', island) +
      sec('stand', 'The segments stand', '<div class="e1-row">' + c.button('Sign the trailing segment', { disabled: true, icon: 'lock', attrs: 'aria-describedby="ae-stand"' }) + '<span class="e1-caption e1-muted" id="ae-stand">The segments stand. A request to remove or re-sign the signed island is refused by the kernel.</span></div>' +
        '<p class="e1-caption e1-muted ae-mt">If signing cannot be switched off because the control plane is unavailable, the tenant keeps signing — a degraded-but-safe state, not an emergency.</p>') +
      '</div><aside class="ae-sticky">' + form + '</aside></div>';
  }

  E1.route('/assurance/upgrade', { title: 'Upgrade to Level 2 Attested', layout: 'console', door: 'assurance', section: 'upgrade', crumbs: CR, keywords: 'l2 attested runbook upgrade boundary signing', render: upgradeOverview });
  E1.route('/assurance/upgrade/rollback', { title: 'Upgrade rollback', layout: 'console', door: 'assurance', section: 'upgrade', crumbs: CR.concat([['Upgrade to L2', '#/assurance/upgrade']]), keywords: 'signed island rollback', render: rollbackScreen });
  E1.route('/assurance/upgrade/close', { title: 'Close the upgrade', layout: 'console', door: 'assurance', section: 'upgrade', crumbs: CR.concat([['Upgrade to L2', '#/assurance/upgrade']]), keywords: 'closing record', render: closeScreen });
  E1.route('/assurance/upgrade/:stage', { title: function (p) { var s = STAGES[Number(p.stage)]; return s && /^[0-5]$/.test(p.stage) ? 'Stage ' + p.stage + ' — ' + s.name : 'Upgrade stage'; }, layout: 'console', door: 'assurance', section: 'upgrade', crumbs: CR.concat([['Upgrade to L2', '#/assurance/upgrade']]), example: '/assurance/upgrade/2', keywords: 'upgrade stage pre-flight key signing anchoring profile bundle', render: stageScreen });

  /* ===========================================================================
     EVIDENCE BUNDLES, EXPORT BUILDER, EXPORT LOG (E15) — Level 2 Attested
     =========================================================================== */
  var MEMBERS = [
    ['manifest.json', 'What is in the bundle, the range, the counts, the digests of every other member, and the profile claimed', 'Always'],
    ['seals.jsonl', 'One record per line, in seq order — the sixteen fields, the digest, the assurance level, and at L2 the signature and key_id', 'Always'],
    ['chain.json', 'Genesis digest, head digest, the seq range, and the boundary rows where the assurance level or the signing key changes', 'Always'],
    ['anchors/', 'One file per closed batch: the RFC 3161 token, the Merkle root, the leaf count, and each covered record’s inclusion path, with the TSA certification path and revocation data captured at anchor time', 'Level 2'],
    ['keys.json', 'key_id, valid_from, valid_to, status, successor_id, and the public key fingerprint — never the key', 'Level 2'],
    ['declarations/', 'Every referenced declaration version, verbatim, one file per (declaration_id, version)', 'Always'],
    ['lexicon/', 'Every term set referenced by F15, verbatim, one file per lexicon digest', 'Always'],
    ['VERIFY.txt', 'How to check this without us, what each failure looks like, and what a PASS does not prove', 'Always']
  ];
  var NEVER_IN = 'Never in a bundle: payloads (F14 commits to them without carrying them), salts, key material, any executable, script or URL to fetch, and the target system’s current state.';
  var LOCK_BUNDLE = { why: 'Evidence export arrives at Level 2. At L1 there is no bundle, no signature, no anchor and no verifier profile — a third party would have to trust our infrastructure to rely on your records.', items: ['An eight-member bundle a stranger can check offline', 'A claimed verifier profile, with its limits statement printed in every report', 'Bundle export at ₹0; the verifier free, to anyone'] };

  function memberRows(b) {
    var n = recordsOf(b), l2 = levelsOf(b.from, b.to).filter(function (s) { return s.level === 2; })[0];
    var l2n = l2 ? l2.to - l2.from + 1 : 0, batches = Math.max(1, Math.round(l2n / 15.26));
    return [
      { path: 'manifest.json', bytes: 3184, sha: manifestDigest(b) },
      { path: 'seals.jsonl', bytes: n * 640, sha: dg(hx(b.id + 's', 4), hx(b.id + 's2', 4), b.id + 'seals') },
      { path: 'chain.json', bytes: 1236 + (l2 && l2.from > b.from ? 180 : 0), sha: dg(hx(b.id + 'c', 4), '', b.id + 'chain') },
      { path: 'anchors/', bytes: l2 ? batches * 6144 + l2n * 1024 : 0, files: l2 ? batches : 0, sha: l2 ? dg(hx(b.id + 'a', 4), '', b.id + 'anchors') : null },
      { path: 'keys.json', bytes: l2 ? 612 : 0, sha: l2 ? dg(hx(b.id + 'k', 4), '', b.id + 'keys') : null },
      { path: 'declarations/', bytes: 5 * 9820, files: 5, sha: dg(hx(b.id + 'd', 4), '', b.id + 'decl') },
      { path: 'lexicon/', bytes: 2 * 14200, files: 2, sha: dg(hx(b.id + 'l', 4), '', b.id + 'lex') },
      { path: 'VERIFY.txt', bytes: 4410, sha: dg(hx(b.id + 'v', 4), '', b.id + 'verify') }
    ];
  }
  function manifestOf(b) {
    var segs = levelsOf(b.from, b.to);
    var m = {
      bundle_format: 'elan1.evidence.bundle.v1', tenant_id: D.tenant.id, seq_from: b.from, seq_to: b.to, record_count: recordsOf(b), refusal_count: b.refusals,
      assurance_levels: segs.map(function (s) { return { level: s.level, count: s.to - s.from + 1, seq_from: s.from, seq_to: s.to }; }),
      continuity_scope: 'full_chain'
    };
    if (b.profile) { m.profile_id = b.profile.split(' ')[0]; m.profile_version = Number(b.profile.split(' v')[1]); }
    m.redaction_profile = b.redaction;
    m.members = memberRows(b).filter(function (r) { return r.sha; }).map(function (r) { return { path: r.path, bytes: r.bytes, sha256: r.sha }; });
    m.unanchored_head = b.unanch;
    m.exported_at = b.at;
    m.verifier_digest = dg('0d7c', '55a1');
    return m;
  }
  function verifyCmd(b) {
    return 'elan1-verify --bundle ' + bundleFile(b) + (b.profile ? ' --profile ' + b.profile.replace(' v', '-v') + '.json' : '') + ' --key-fingerprint <fingerprint from your own source>';
  }
  function wrapText(t, w) { var out = [], line = ''; String(t).split(' ').forEach(function (word) { if ((line + ' ' + word).trim().length > w) { out.push(line.trim()); line = word; } else line += ' ' + word; }); if (line.trim()) out.push(line.trim()); return out.join('\n'); }
  function exportReadyLine(b) {
    return 'Export ready — ' + num(recordsOf(b)) + ' records, ' + num(b.refusals) + ' refusals, ' + num(b.unanch) + ' unanchored, ' + (b.profile ? 'profile ' + b.profile : 'no profile claimed');
  }

  function bundlesList(p, q) {
    var rows = D.bundles.slice().reverse();
    var tbl = function (list) {
      return c.table({ caption: 'Evidence bundles exported from this tenant', columns: [
        { key: 'id', label: 'Bundle', nowrap: true, render: function (r) { return '<a class="e1-table__link e1-mono" href="#/assurance/bundles/' + esc(r.id) + '">' + esc(r.id) + '</a>'; } },
        { key: 'at', label: 'Exported', render: function (r) { return esc(ist(r.at)); }, nowrap: true },
        { key: 'by', label: 'By', render: function (r) { return c.actor({ name: r.by, kind: 'person', role: r.byRole, size: 'sm' }); } },
        { key: 'rng', label: 'Range', mono: true, nowrap: true, render: function (r) { return esc(rng(r.from, r.to)); } },
        { key: 'n', label: 'Records', align: 'right', mono: true, render: function (r) { return esc(num(recordsOf(r))); } },
        { key: 'ref', label: 'Refusals', align: 'right', mono: true, render: function (r) { return esc(num(r.refusals)); } },
        { key: 'un', label: 'Unanchored', align: 'right', mono: true, render: function (r) { return esc(num(r.unanch)); } },
        { key: 'pr', label: 'Profile claimed', render: function (r) { return r.profile ? mono(r.profile) : '<span class="e1-muted">No profile claimed</span>'; } },
        { key: 'lv', label: 'Levels', render: function (r) { return levelsOf(r.from, r.to).map(function (s) { return c.level('L' + s.level, { short: true }); }).join(' '); } },
        { key: 'dg', label: 'Bundle digest', render: function (r) { return c.hash(bundleDigest(r), { head: 6, tail: 4, label: 'Bundle digest' }); } },
        { key: 'rec', label: 'Export record', render: function (r) { return seqA(r.rec); } },
        { key: 'x', label: 'Actions', render: function (r) { return c.menu({ label: 'Actions for ' + r.id, iconOnly: true, icon: 'more', size: 'sm', align: 'right', items: [{ label: 'Open', href: '#/assurance/bundles/' + r.id, icon: 'file' }, { label: 'Re-export', action: 'ae-reexport', value: r.id, icon: 'refresh', note: 'Byte-identical except exported_at' }, { label: 'Hand-off note for your auditor', action: 'ae-handoff', value: r.id, icon: 'file-text' }] }); } }
      ], rows: list, rowHref: function (r) { return '#/assurance/bundles/' + r.id; }, empty: {
        title: 'No bundles exported yet', why: 'A bundle is generated when you ask for a period; we do not keep copies.', fill: 'Choose a range and a profile, and the export is written as a governed record in your chain.', action: { label: 'Export a bundle', href: '#/assurance/export' }, icon: 'package' } });
    };
    return screen({
      L: 'L2', q: q, path: '/assurance/bundles', title: 'Evidence bundles',
      lead: 'Files your auditor can check on their own machine, offline, with software they did not get from us.',
      actions: c.button('Export a bundle', { kind: 'primary', icon: 'download', href: '#/assurance/export' }) + c.button('Get the verifier', { href: '#/verify', icon: 'terminal' }),
      states: [{ id: 'empty', label: 'Empty', note: 'No bundle exported yet' }, { id: 'loading', label: 'Loading' }, { id: 'error', label: 'Error' }],
      lock: LOCK_BUNDLE,
      stateBody: function (s) {
        if (s === 'empty') return tbl([]);
        if (s === 'loading') return loadingState();
        if (s === 'error') return c.error({ title: 'We cannot list your bundles right now.', body: 'The export log did not answer within 10 seconds.', reassurance: 'Nothing was exported or changed. Every export is a record in your chain, so the list is rebuilt from it when this comes back.', code: 'PLATFORM.REGISTRY_UNAVAILABLE', action: { label: 'Try again', href: '#/assurance/bundles' } });
        return null;
      },
      body: function () {
        return kpis([
          { label: 'Bundles exported', value: num(D.bundles.length), note: 'Since the boundary on 12 Aug 2027' },
          { label: 'Latest', value: 'EB-2027-0008', note: '26 Oct 2027 · re-export for CA Lakshmi Iyer', href: '#/assurance/bundles/EB-2027-0008' },
          { label: 'Bundle export price', value: '₹0', note: '“Rationing the export teaches the customer not to use it.”' },
          { label: 'The offline verifier', value: '₹0', note: 'Free, as source, to anyone — including non-customers.', href: '#/verify' }
        ]) +
        c.callout({ kind: 'info', title: 'We keep the record, not the file', body: '<p>We keep the manifest digest and the export as a governed write, and we keep nothing else. A customer who loses a bundle re-exports it; a re-export over the same range and profile is byte-identical except for exported_at. Download links expire after 24 hours.</p>' }) +
        sec('list', 'Export log', tbl(rows), { actions: c.button('Full export history', { size: 'sm', kind: 'ghost', href: '#/assurance/exports', iconRight: 'arrow-right' }) }) +
        sec('members', 'What every bundle contains', c.table({ caption: 'elan1.evidence.bundle.v1 — eight members', columns: [{ key: 'm', label: 'Member', mono: true }, { key: 'c', label: 'Contents' }, { key: 'w', label: 'Present', html: true }], rows: MEMBERS.map(function (m) { return { m: m[0], c: m[1], w: m[2] === 'Always' ? c.badge('neutral', 'Always', { icon: false }) : c.level('L2', { short: true }) + ' <span class="e1-caption">at Level 2</span>' }; }) }) +
          '<p class="e1-caption e1-muted ae-mt">' + esc(NEVER_IN) + ' The manifest is not signed as a whole; every member is digested inside it.</p>', { lead: 'A bundle is a directory that needs nothing from us: self-contained, inert, claim-bearing.' });
      }
    });
  }

  function bundleDetail(p, q) {
    var b = bundleById(p.id);
    if (!b) {
      return screen({ L: 'L2', q: q, title: 'No export record ' + p.id, lead: 'We do not keep bundles, so there is nothing here to download.', back: ['Evidence bundles', '#/assurance/bundles'], lock: LOCK_BUNDLE,
        body: function () { return c.empty({ title: 'This tenant’s chain has no export record called ' + p.id, why: 'Bundle ids come from the export record written when a bundle is prepared. If you hold the file, its manifest names that record.', fill: 'Export the period again — the result is byte-identical except for exported_at.', action: [{ label: 'Export a bundle', href: '#/assurance/export' }, { label: 'Open the export log', href: '#/assurance/bundles' }], icon: 'package' }); } });
    }
    var segs = levelsOf(b.from, b.to), mf = manifestOf(b), prof = b.profile ? profileById(b.profile.split(' ')[0]) : null;
    var runs = D.runs.filter(function (r) { return r.bundle === b.id; });
    var members = c.table({ caption: 'Members, with their byte length and SHA-256', columns: [
      { key: 'path', label: 'Path', mono: true }, { key: 'files', label: 'Files', align: 'right', mono: true, render: function (r) { return esc(r.files !== undefined ? num(r.files) : '1'); } },
      { key: 'bytes', label: 'Bytes', align: 'right', mono: true, render: function (r) { return r.sha ? esc(num(r.bytes)) : '—'; } },
      { key: 'sha', label: 'SHA-256', render: function (r) { return r.sha ? c.hash(r.sha, { label: r.path + ' SHA-256' }) : '<span class="e1-muted">Not present — no Level 2 records in range</span>'; } }], rows: memberRows(b) });
    var chainRows = [{ k: 'Genesis digest', v: c.hash(D.genesisDigest, { label: 'Genesis digest' }) }, { k: 'Range', v: mono(rng(b.from, b.to)) }];
    if (segs.length > 1) chainRows.push({ k: 'Boundary row', v: mono('assurance_level 1 → 2 at seq 41,207 · 2027-08-12T06:30:11Z · 41,206 before (chain) · ' + num(segs[1].to - segs[1].from + 1) + ' after (in range)') });
    else if (segs[0].level === 2) chainRows.push({ k: 'Boundary row', v: mono('assurance_level 1 → 2 at seq 41,207 (before this range) — carried so the reader can position the range') });
    chainRows.push({ k: 'Key change rows', v: esc('None in range — k_in_20270701_4d7e throughout') });
    var keysTbl = segs.some(function (s) { return s.level === 2; }) ? c.card({ body: c.kv([['key_id', KEY.id, { mono: true }], ['valid_from', '2027-07-01T00:00:00Z', { mono: true }], ['valid_to', '— (open)', { mono: true }], ['status', c.badge('good', 'active'), { html: true }], ['successor_id', KEY.successor, { mono: true }], ['Fingerprint', fpr(KEY.fp.slice(0, 8)) + ' … ' + KEY.fp.slice(-4), { mono: true }]], { compact: true }) }) + '<p class="e1-caption e1-muted ae-mt-s">Key material is never in a bundle. This key also signs other tenants’ records in domain in; this bundle counts only yours. Compare the fingerprint with the one you were sent by letter — never with this page alone.</p>' : c.empty({ compact: true, title: 'No keys.json in this bundle', why: 'Every record in range is Level 1, so nothing in it was signed.' });
    var verifyTxt = 'HOW TO CHECK THIS BUNDLE WITHOUT US\n\n' + verifyCmd(b).replace(' --profile', ' \\\n    --profile').replace(' --key-fingerprint', ' \\\n    --key-fingerprint') + '\n\nObtain the key fingerprint from your own source — not from this bundle.\n\nExit codes\n  0 PASS · 0 PASS — payload unbound · 0 PASS — unsigned, assurance level 1\n  1 FAIL_INTEGRITY  stop: a forensic question, not a compliance question\n  2 FAIL_PROFILE    records sound; this regime’s requirements unmet\n  3 INCOMPLETE      ask for a complete bundle\n  4 UNSUPPORTED     obtain the matching verifier\n  5 USAGE           operator error\n\nWHAT A PASS DOES NOT PROVE\n' + wrapText(prof && prof.limits ? prof.limits : 'No profile is claimed, so the verifier runs integrity checks only. A PASS says the records are intact, chained and, at Level 2, signed and anchored. It makes no claim for any regime.', 96);
    var runsHtml = runs.length ? c.table({ caption: 'Reports readers attached for this bundle', columns: [{ key: 'v', label: 'Exit', html: true, render: function (r) { return exitBadge(r.verdict); } }, { key: 'd', label: 'Detail', render: function (r) { return esc(r.detail); } }, { key: 'by', label: 'Attached by', render: function (r) { return esc(r.by + ' · ' + ist(r.at)); } }], rows: runs, rowHref: function (r) { return '#/assurance/verify-runs?run=' + r.n; } }) + '<p class="e1-caption e1-muted ae-mt-s">Submitted by the reader; elan1 did not run these. The verifier records nothing and reports to no one.</p>'
      : c.empty({ compact: true, title: 'No report attached yet', why: 'The verifier phones home to no one, so we only see a report if a reader chooses to attach it.', action: { label: 'Get the verifier', href: '#/verify' } });

    return screen({
      L: 'L2', q: q, title: 'Evidence bundle ' + b.id, lead: exportReadyLine(b), back: ['Evidence bundles', '#/assurance/bundles'],
      actions: c.button('Download .tar', { kind: 'primary', icon: 'download', attrs: 'data-action="ae-download" data-value="' + esc(b.id) + '"' }) + c.button('Copy verifier command', { icon: 'copy', attrs: 'data-copy="' + esc(verifyCmd(b)) + '" data-copy-label="Verifier command"' }) +
        c.menu({ label: 'More', align: 'right', items: [{ label: 'Hand-off note for your auditor', action: 'ae-handoff', value: b.id, icon: 'file-text' }, { label: 'Re-export', action: 'ae-reexport', value: b.id, icon: 'refresh', note: 'Byte-identical except exported_at' }, { label: 'Open in the auditor portal', href: '#/auditor/bundle/' + b.id, icon: 'external' }, { label: 'Open the export record', href: '#/assurance/proof/' + b.rec, icon: 'proof' }] }),
      lock: LOCK_BUNDLE,
      body: function () {
        return '<div class="ae-hero">' + c.icon('package', 20) + '<div><p class="e1-label">' + esc(bundleFile(b)) + '</p><p class="ae-line">' + esc(exportReadyLine(b)) + '</p></div><span style="margin-left:auto">' + c.hash(bundleDigest(b), { label: 'Bundle digest' }) + '</span></div>' +
          '<p class="e1-caption e1-muted ae-mt-s">Exported ' + esc(ist(b.at)) + ' by ' + esc(b.by) + ' · export record ' + seqA(b.rec) + ' · ' + esc(b.note) + '</p>' +
          '<div class="ae-mt">' + c.callout({ kind: 'rule', title: 'Verify it yourself first.', body: '<p>If it does not pass for you it will not pass for them.</p><div class="e1-row ae-mt-s">' + c.button('Get the verifier', { size: 'sm', href: '#/verify', icon: 'terminal' }) + c.button('Watch it refuse the tampered bundle', { size: 'sm', kind: 'ghost', href: '#/verify/tampered' }) + '</div>' }) + '</div>' +
          sec('claim', 'What this bundle establishes — and what it does not', '<div class="ae-said">' + c.card({ title: 'The promise', body: '<ol class="ae-list">' + PROMISE.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>' }) +
            c.card({ title: prof && prof.limits ? 'Limits statement — ' + b.profile + ', verbatim' : 'No profile claimed', body: prof && prof.limits ? limitsBlock(prof.limits, 'Printed in section 8 of every report under this profile.') : '<p class="e1-text-body">Absent means no claim, and the verifier runs integrity checks only. A PASS says the records are intact and chained' + (segs.some(function (s) { return s.level === 2; }) ? ', and the Level 2 records signed and anchored' : '') + '. It says nothing about any regime.</p>' }) + '</div>') +
          sec('levels', 'Assurance levels in range', boundaryBar(segs) + (segs.length > 1 ? '<p class="e1-caption e1-muted ae-mt-s">The scope section of every report prints both levels and both counts. Records before seq 41,207 are Level 1 and are labelled so; they were never signed.</p>' : '')) +
          sec('manifest', 'Manifest', '<div class="ae-two">' + c.card({ body: c.kv([
            ['bundle_format', mf.bundle_format, { mono: true }], ['tenant_id', mf.tenant_id, { mono: true }], ['seq_from · seq_to', num(b.from) + ' · ' + num(b.to), { mono: true }],
            ['record_count', num(mf.record_count) + ' (= seq_to − seq_from + 1)', { mono: true }], ['refusal_count', num(b.refusals), { mono: true }],
            ['continuity_scope', 'full_chain', { mono: true }], ['profile_id · profile_version', b.profile ? b.profile.replace(' v', ' · ') : 'Absent — no claim; integrity checks only', { mono: !!b.profile }],
            ['redaction_profile', b.redaction, { mono: true }], ['unanchored_head', num(b.unanch) + (b.unanch === 0 ? ' — 0 is a value, not an absence' : ' records unanchored at export'), { mono: true }],
            ['exported_at', b.at, { mono: true }], ['verifier_digest', c.hash(mf.verifier_digest, { label: 'Verifier digest' }), { html: true }], ['manifest digest', c.hash(manifestDigest(b), { label: 'Manifest digest' }), { html: true }]
          ], { compact: true }) }) + c.json(mf, { title: 'manifest.json', open: 1 }) + '</div>') +
          sec('members', 'Members', members) +
          '<div class="ae-two">' + sec('chainjson', 'chain.json — boundary rows', c.card({ body: c.kv(chainRows.map(function (r) { return [r.k, r.v, { html: true }]; }), { compact: true }) })) + sec('keys', 'keys.json', keysTbl) + '</div>' +
          sec('verifytxt', 'VERIFY.txt', c.code(verifyTxt, 'text', { title: 'VERIFY.txt (preview)' }) + '<p class="e1-caption e1-muted ae-mt-s">The command never carries a fingerprint from us. The reader supplies their own.</p>') +
          sec('reports', 'Verification reports attached', runsHtml, { actions: c.button('All verifier runs', { size: 'sm', kind: 'ghost', href: '#/assurance/verify-runs', iconRight: 'arrow-right' }) });
      }
    });
  }

  /* ---- Export builder ---- */
  function exportSummary(from, to, profile) {
    var n = to - from + 1, segs = levelsOf(from, to);
    var refusals = Math.round(n * 611 / 12480);
    var un = to >= D.openBatch.from ? Math.min(22, to - D.openBatch.from + 1) : 0;
    var warn = [];
    if (profile !== 'none' && from < D.boundary.seq) warn.push(c.refusal({ code: 'GATE.PRECONDITION_FAILED', title: 'Not done — the profile window splits this range', ruleName: 'Profile window', version: 'in-mca-audit-trail v1', rule: 'A record is judged by the profile version whose window covers its recorded_at. in-mca-audit-trail v1 needs Level 2, and records before seq 41,207 are Level 1.', numbers: [{ label: 'Level 1 in range', value: num(Math.min(to, 41206) - from + 1) }, { label: 'Level 2 in range', value: num(Math.max(0, to - 41206)) }], change: 'Export the two sub-ranges: the Level 1 part with no profile claimed, and the Level 2 part under the profile.', action: [{ label: 'Level 1 part, no profile', href: E1.href('/assurance/export', { from: from, to: Math.min(to, 41206), profile: 'none' }) }].concat(to >= 41207 ? [{ label: 'Level 2 part under the profile', href: E1.href('/assurance/export', { from: 41207, to: to }) }] : []) }));
    if (n > 250000) warn.push(c.refusal({ code: 'GATE.PRECONDITION_FAILED', title: 'Not done — larger than one export', ruleName: 'Export size limit [placeholder]', rule: 'An oversized export is refused with the limit and a suggested split, never silently truncated.', numbers: [{ label: 'Records asked for', value: num(n) }, { label: 'Limit per export', value: '2,50,000' }], action: { label: 'Split into two exports', href: E1.href('/assurance/export', { from: from, to: from + Math.floor(n / 2) - 1 }) } }));
    return '<div class="e1-stack">' +
      '<div class="ae-kpis">' + c.stat({ label: 'Records', value: num(n) }) + c.stat({ label: 'Refusals', value: num(refusals), note: 'Included in full' }) + c.stat({ label: 'Unanchored at export', value: num(un), note: un ? 'Open batch — anchored within 15 min' : '0 is a value, not an absence' }) + c.stat({ label: 'Continuity scope', value: 'full_chain' }) + '</div>' +
      boundaryBar(segs) + warn.join('') + '</div>';
  }
  function exportScreen(p, q) {
    var from = Math.max(1, parseInt(q.from, 10) || 41207), to = Math.min(D.boundary.head, parseInt(q.to, 10) || D.boundary.head);
    if (to < from) to = from;
    var profile = q.profile === 'none' ? 'none' : 'in-mca-audit-trail';
    var refusalFor = {
      residency: c.refusal({ code: 'GATE.RESIDENCY_VIOLATION', title: 'Not done — outside the residency domain', ruleName: 'Residency', rule: 'A bundle for this tenant is generated in residency domain in, or not at all.', numbers: [{ label: 'Requested from', value: 'ap-southeast-1 endpoint' }, { label: 'Tenant domain', value: 'in · Mumbai' }], action: { label: 'Use the in-domain endpoint', href: '#/assurance/export' }, proofHref: '#/assurance/proof/53318', at: '23 Oct 2027 · #53,318' }),
      unresolved: c.refusal({ code: 'POLICY.DECLARATION_UNRESOLVED', title: 'Not done — a declaration version could not be resolved', ruleName: 'Every referenced version travels with the bundle', rule: 'Every declaration version and lexicon a record references must be inside the bundle, verbatim.', numbers: [{ label: 'Missing', value: '(9a41…, 8)' }, { label: 'Referenced by', value: '2,214 records' }], action: { label: 'Open the declaration', href: '#/records/declarations/erp.ar' } }),
      precondition: c.refusal({ code: 'GATE.PRECONDITION_FAILED', title: 'Not done — the nightly integrity run did not complete', ruleName: 'Precondition: a clean nightly run covers the range', rule: 'We do not report an unchecked range as clean.', numbers: [{ label: 'Last clean night', value: '17 Oct 2027 · seq 1–52,940' }, { label: 'Not checked', value: 'seq 52,941–53,011' }], action: { label: 'Export the clean range instead', href: E1.href('/assurance/export', { from: 41207, to: 52940 }) }, proofHref: '#/assurance/proof/52961', at: '19 Oct 2027 · #52,961' }),
      store: c.error({ title: 'The export could not be written.', body: 'The object store in domain in did not answer.', reassurance: 'Nothing partial was written and nothing was recorded. Retrying is safe: the export is idempotent.', code: 'PLATFORM.TARGET_UNREACHABLE', action: { label: 'Try again', href: '#/assurance/export' } })
    };
    return screen({
      L: 'L2', q: q, path: '/assurance/export', title: 'Export a bundle', back: ['Evidence bundles', '#/assurance/bundles'],
      lead: 'Choose a range and a profile. You see the counts before anything is generated; preparing the export is a governed write.',
      states: [{ id: 'residency', label: 'Refused — residency' }, { id: 'unresolved', label: 'Refused — declaration unresolved' }, { id: 'precondition', label: 'Refused — nightly run incomplete' }, { id: 'store', label: 'Error — object store unavailable' }],
      lock: LOCK_BUNDLE,
      stateBody: function (s) { return refusalFor[s] ? '<div class="e1-split"><div class="e1-stack">' + refusalFor[s] + c.button('Back to the builder', { href: '#/assurance/export', icon: 'arrow-left' }) + '</div></div>' : null; },
      body: function () {
        var fields = [
          { n: 'invoice_no', c: 'internal' }, { n: 'posting_date', c: 'internal' }, { n: 'customer', c: 'confidential' }, { n: 'grand_total', c: 'confidential' },
          { n: 'items[].item_code', c: 'internal' }, { n: 'items[].qty', c: 'internal' }, { n: 'items[].rate', c: 'confidential' }
        ];
        var form = c.card({ title: 'Scope', body:
          '<div class="ae-two">' + c.field('From seq', c.input({ id: 'ae-from', value: String(from), mono: true, type: 'number', attrs: 'min="1" max="53686"' }), { id: 'ae-from', help: 'Seq 1 is the genesis record.' }) +
          c.field('To seq', c.input({ id: 'ae-to', value: String(to), mono: true, type: 'number', attrs: 'min="1" max="53686"' }), { id: 'ae-to', help: 'Head is seq 53,686.' }) + '</div>' +
          '<div class="e1-row ae-mt-s"><span class="e1-caption e1-muted">Quick ranges</span>' + c.chip('Level 2 to date', { href: E1.href('/assurance/export', { from: 41207, to: 53686 }), selected: from === 41207 && to === 53686 }) + c.chip('Q2 FY 2027–28', { href: E1.href('/assurance/export', { from: 41207, to: 50112 }) }) + c.chip('October 2027', { href: E1.href('/assurance/export', { from: 50113, to: 53686 }) }) + c.chip('Spanning the boundary', { href: E1.href('/assurance/export', { from: 38001, to: 45000, profile: 'none' }) }) + '</div>' +
          '<div class="e1-divider ae-mt"></div>' +
          '<fieldset class="ae-mt" style="border:0;padding:0;margin:0"><legend class="e1-field__label">Verifier profile</legend><div class="e1-stack e1-stack--sm ae-mt-s">' +
          c.radio({ name: 'ae-profile', id: 'ae-prof-mca', value: 'in-mca-audit-trail', label: 'in-mca-audit-trail v1 — installed', note: 'Four clauses, checks C01–C06. min_assurance_level 2 · applies to records from 2027-07-01.', checked: profile !== 'none' }) +
          c.radio({ name: 'ae-profile', id: 'ae-prof-none', value: 'none', label: 'No profile claimed', note: 'The manifest omits the profile, and the verifier runs integrity checks only.', checked: profile === 'none' }) + '</div></fieldset>' +
          '<div class="e1-divider ae-mt"></div>' +
          '<p class="e1-field__label ae-mt">Redaction profile</p><p class="e1-text-body" style="margin:4px 0 8px"><code class="e1-mono">ledger1-default</code> <span class="e1-caption e1-muted">— read-only, from declaration erp.ar v12 block 6. One redaction profile per export at Level 2.</span></p>' +
          c.table({ caption: 'Fields committed in F14 under ledger1-default', dense: true, columns: [{ key: 'n', label: 'Field', mono: true }, { key: 'c', label: 'Classification' }, { key: 's', label: 'In this bundle', html: true }], rows: fields.map(function (f) { return { n: f.n, c: f.c, s: c.badge('neutral', 'Committed — value withheld', { icon: 'lock' }) }; }) }) +
          '<p class="e1-caption e1-muted ae-mt-s">Payloads never travel in a bundle; each field is present as a commitment inside F14. Revealing chosen fields to a chosen reader is selective disclosure, which arrives at Level 3. ' + '<a href="#/assurance/disclosures/new">See the disclosure composer</a></p>' });
        var cost = c.card({ title: 'Cost', body: c.kv([
          ['Bundle export', '₹0 · metered at the tenant basis, quantity 1'], ['Verifier profile', 'in-mca-audit-trail — ₹6,00,000 per regime per year [modelled], unlimited exports'], ['The offline verifier', '₹0, source, to anyone'], ['Anchoring', 'Never a metered unit']
        ], { compact: true }) + '<div class="ae-mt-s">' + c.button('Your plan', { size: 'sm', kind: 'ghost', href: '#/assurance/plan', iconRight: 'arrow-right' }) + '</div>' });
        return '<div class="e1-split"><div class="e1-stack">' + form +
          sec('summary', 'Before anything is generated', '<div id="ae-summary">' + exportSummary(from, to, profile) + '</div>') +
          '<div class="e1-row">' + c.button('Prepare export', { kind: 'gate', icon: 'package', attrs: 'data-action="ae-prepare-export"' }) + c.button('Cancel', { kind: 'ghost', href: '#/assurance/bundles' }) + '<span class="e1-caption e1-muted">Climbs the nine rungs: residency, retention, consent and precondition are checked, then the eight members are assembled and the manifest is written last.</span></div>' +
          '</div><aside class="e1-stack">' + cost + c.callout({ kind: 'rule', title: 'Verify it yourself first.', body: '<p>If it does not pass for you it will not pass for them.</p>' }) + '</aside></div>';
      }
    });
  }

  function exportsHistory(p, q) {
    var f = q.outcome || 'all';
    var all = D.bundles.map(function (b) { return { at: b.at, by: b.by, from: b.from, to: b.to, profile: b.profile, outcome: 'committed', rec: b.rec, bundle: b.id, note: b.note }; })
      .concat(D.exportsExtra.map(function (x) { return { at: x.at, by: x.by, from: x.from, to: x.to, profile: x.profile, outcome: 'refused', code: x.code, rec: x.rec, why: x.why, offer: x.offer, offerHref: x.offerHref }; }))
      .sort(function (a, b) { return a.at < b.at ? 1 : -1; });
    var list = all.filter(function (r) { return f === 'all' || r.outcome === f; });
    var cnt = function (o) { return all.filter(function (r) { return o === 'all' || r.outcome === o; }).length; };
    var newest = all[0] && all[0].at;
    var table = function (rows) {
      return c.table({ caption: 'Every export request, as a governed write', columns: [
        { key: 'at', label: 'Requested', nowrap: true, render: function (r) { return esc(ist(r.at)); } },
        { key: 'by', label: 'By', render: function (r) { return c.actor({ name: r.by, kind: 'person', size: 'sm' }); } },
        { key: 'r', label: 'Range', mono: true, nowrap: true, render: function (r) { return esc(rng(r.from, r.to)); } },
        { key: 'p', label: 'Profile', render: function (r) { return r.profile ? mono(r.profile) : '<span class="e1-muted">No profile claimed</span>'; } },
        { key: 'o', label: 'Outcome', render: function (r) { return c.outcome(r.outcome, { code: r.code }); } },
        { key: 'res', label: 'Result', render: function (r) { return r.bundle ? '<a class="e1-mono" href="#/assurance/bundles/' + esc(r.bundle) + '">' + esc(r.bundle) + '</a><div class="e1-caption e1-muted">' + esc(r.note) + '</div>' : '<span class="e1-caption">' + esc(r.why) + '</span><div class="ae-mt-s"><a href="' + esc(r.offerHref) + '">' + esc(r.offer) + '</a></div>'; } },
        { key: 'rec', label: 'Record', render: function (r) { return seqA(r.rec); } },
        { key: 'dl', label: 'Download', render: function (r) { return r.bundle ? (r.at === newest ? c.badge('info', 'Link valid 24 h', { subtle: true }) : '<span class="e1-caption e1-muted">Link expired — we keep no copy</span>') : '<span class="e1-caption e1-muted">Nothing was exported</span>'; } }
      ], rows: rows, empty: { title: f === 'refused' ? 'No export has been refused' : 'No exports yet', why: f === 'refused' ? 'A refused export is a record too — the chain shows it with its code and the offer made.' : 'Exports appear here the moment they are requested, whether they are prepared or refused.', action: { label: 'Export a bundle', href: '#/assurance/export' } } });
    };
    return screen({
      L: 'L2', q: q, path: '/assurance/exports', title: 'Exports',
      lead: 'Every export request, prepared or refused, is a governed record in your chain — including the ones your auditor asked for.',
      actions: c.button('Export a bundle', { kind: 'primary', icon: 'download', href: '#/assurance/export' }),
      states: [{ id: 'empty', label: 'Empty' }, { id: 'loading', label: 'Loading' }, { id: 'error', label: 'Error' }],
      lock: LOCK_BUNDLE,
      stateBody: function (s) {
        if (s === 'empty') return c.empty({ title: 'No exports yet', why: 'Nothing has been exported from this tenant since the boundary on 12 Aug 2027.', fill: 'An export is generated on request and handed over. The request itself is the record we keep.', action: { label: 'Export a bundle', href: '#/assurance/export' }, icon: 'package' });
        if (s === 'loading') return loadingState();
        if (s === 'error') return c.error({ title: 'We cannot show your export history right now.', reassurance: 'Nothing has been exported in the meantime; exports are records in your chain and will reappear here.', code: 'PLATFORM.REGISTRY_UNAVAILABLE', action: { label: 'Try again', href: '#/assurance/exports' } });
        return null;
      },
      body: function () {
        return c.filters([{ label: 'All', href: E1.href('/assurance/exports'), active: f === 'all', count: cnt('all') }, { label: 'Prepared', href: E1.href('/assurance/exports', { outcome: 'committed' }), active: f === 'committed', count: cnt('committed') }, { label: 'Not done', href: E1.href('/assurance/exports', { outcome: 'refused' }), active: f === 'refused', count: cnt('refused') }], { label: 'Show' }) +
          '<div class="ae-mt">' + table(list) + '</div>' +
          sec('requests', 'Evidence requests from your auditor', c.table({ caption: 'Requests made by the auditor, each a governed write in your chain', columns: [
            { key: 'at', label: 'Requested', render: function (r) { return esc(ist(r.at)); }, nowrap: true }, { key: 'by', label: 'Requested by', render: function (r) { return c.actor({ name: r.by, kind: 'person', role: 'Statutory auditor', size: 'sm' }); } },
            { key: 'what', label: 'What was asked' }, { key: 'sup', label: 'What was supplied' }, { key: 'rec', label: 'Record', render: function (r) { return seqA(r.rec); } }], rows: D.auditorRequests, empty: { title: 'No requests from your auditor', why: 'Requests your auditor makes through the auditor portal are recorded here, so you can see that they asked and what was supplied.' } }), { lead: 'Your auditor asked, and you can see what was supplied — both are records in your chain.', actions: c.button('Auditor portal', { size: 'sm', kind: 'ghost', href: '#/auditor', iconRight: 'arrow-right' }) });
      }
    });
  }

  E1.route('/assurance/bundles', { title: 'Evidence bundles', layout: 'console', door: 'assurance', section: 'bundles', crumbs: CR, keywords: 'bundle evidence export l2 manifest', render: bundlesList });
  E1.route('/assurance/bundles/:id', { title: function (p) { return 'Bundle ' + p.id; }, layout: 'console', door: 'assurance', section: 'bundles', crumbs: CR.concat([['Evidence bundles', '#/assurance/bundles']]), example: '/assurance/bundles/EB-2027-0007', keywords: 'manifest members verify', render: bundleDetail });
  E1.route('/assurance/export', { title: 'Export a bundle', layout: 'console', door: 'assurance', section: 'exports', crumbs: CR.concat([['Exports', '#/assurance/exports']]), keywords: 'export bundle builder profile range', render: exportScreen,
    mount: function (el) {
      if (!E1.atLeast('L2')) return;
      var box = el.querySelector('#ae-summary'); if (!box) return;
      function upd() {
        var fEl = el.querySelector('#ae-from'), tEl = el.querySelector('#ae-to');
        var a = parseInt(fEl.value, 10), b = parseInt(tEl.value, 10);
        var prof = (el.querySelector('input[name="ae-profile"]:checked') || {}).value || 'in-mca-audit-trail';
        var bad = !(a >= 1 && b >= a && b <= D.boundary.head);
        fEl.setAttribute('aria-invalid', bad ? 'true' : 'false'); tEl.setAttribute('aria-invalid', bad ? 'true' : 'false');
        box.innerHTML = bad ? c.callout({ kind: 'warning', title: 'Check the range', body: '<p>From must be at least 1, To at most 53,686 (the head), and From no later than To.</p>' }) : exportSummary(a, b, prof);
      }
      ['#ae-from', '#ae-to'].forEach(function (s) { var i = el.querySelector(s); if (i) i.addEventListener('input', upd); });
      Array.prototype.forEach.call(el.querySelectorAll('input[name="ae-profile"]'), function (r) { r.addEventListener('change', upd); });
    } });
  E1.route('/assurance/exports', { title: 'Exports', layout: 'console', door: 'assurance', section: 'exports', crumbs: CR, keywords: 'export history log auditor requests', render: exportsHistory });

  /* ===========================================================================
     ANCHORING (E17) — Level 2 Attested
     =========================================================================== */
  var ANCHOR_RULE = 'This digest existed, in this form, no later than this instant, according to a party who has no interest in the matter. Nothing more.';
  var ANCHOR_NOT = [
    'Not that the record was created at that time. Only that it existed by then. A record could have been fabricated an hour earlier and anchored on schedule.',
    'Not that the record is complete. An anchor covers what was submitted; what it detects is a record removed after it was submitted.',
    'Not that we are honest. If we anchor fabricated records faithfully, the anchors are faithful evidence of fabricated records.',
    'Not a legal effect. An RFC 3161 token from a licensed Indian CA has whatever standing Indian law gives it. That is not our determination.'
  ];
  var LOCK_ANCHOR = { why: 'Anchoring arrives at Level 2. At Level 1 there is no external time anchor, so a chain cut at the tail cannot be detected from the chain alone — test for it by reconciliation against the target system.', items: ['A Merkle root of each batch, time-stamped by two authorities, one India-based', 'The unanchored head, shown on the Assurance door', 'A published interval: ≤15 minutes, per tier'] };
  var BSTAT = { anchored: ['good', 'Anchored'], single_anchor: ['warning', 'single_anchor'], late: ['info', 'Anchored late'], open: ['neutral', 'Open'] };
  function batchById(id) { for (var i = 0; i < D.batches.length; i++) if (D.batches[i].id === id) return D.batches[i]; return null; }

  function anchoringScreen(p, q) {
    var tab = q.tab || 'batches', st = q.status || 'all';
    var degraded = q.state === 'degraded';
    var rows = D.batches.slice();
    rows.unshift({ id: '(open)', from: D.openBatch.from, to: D.openBatch.to, status: 'open', root: null, a: null, b: null, lag: '—' });
    var filtered = rows.filter(function (r) { return st === 'all' || r.status === st; });
    var batchTable = c.table({ caption: 'Anchor batches, newest first', columns: [
      { key: 'id', label: 'Batch', render: function (r) { return r.status === 'open' ? '<span class="e1-mono e1-muted">(open)</span>' : '<a class="e1-table__link e1-mono" href="#/assurance/anchoring/' + esc(r.id) + '">' + esc(r.id) + '</a>'; } },
      { key: 'r', label: 'Range', mono: true, nowrap: true, render: function (r) { return esc(rng(r.from, r.to)); } },
      { key: 'l', label: 'Leaves', align: 'right', mono: true, render: function (r) { return esc(num(r.to - r.from + 1)); } },
      { key: 'root', label: 'Merkle root', nowrap: true, render: function (r) { return r.root ? c.hash(r.root, { head: 4, tail: 4, label: 'Merkle root' }) : '<span class="e1-muted">—</span>'; } },
      { key: 'a', label: 'eMudhra genTime', mono: true, nowrap: true, render: function (r) { return r.a ? esc(r.a) : '<span class="e1-muted">—</span>'; } },
      { key: 'b', label: 'DigiCert genTime', mono: true, nowrap: true, render: function (r) { return r.b ? esc(r.b) : (r.bNote ? '<span class="e1-muted">— (' + esc(r.bNote) + ')</span>' : '<span class="e1-muted">—</span>'); } },
      { key: 's', label: 'Status', nowrap: true, render: function (r) { return r.status === 'open' ? c.badge('neutral', 'Open', { icon: 'clock' }) : c.badge(BSTAT[r.status][0], BSTAT[r.status][1]); } },
      { key: 'lag', label: 'Lag', align: 'right', mono: true, nowrap: true }
    ], rows: filtered, rowHref: function (r) { return r.status === 'open' ? null : '#/assurance/anchoring/' + r.id; }, empty: { title: 'No batches in this state', why: 'Nothing matches this filter over the range shown.', action: { label: 'Show all batches', href: '#/assurance/anchoring' } } });
    var auth = '<div class="ae-two">' + D.tsa.map(function (a) {
      return c.card({ title: a.name, eyebrow: a.role, actions: c.badge('good', 'In the pair'), body: c.kv([
        ['Country', a.country], ['Practice statement', a.policy], ['Time source', a.source], ['SLA', a.sla], ['Certificate', a.cert], ['Contract', a.contract], ['Tokens this month', num(a.tokens), { mono: true }], ['Degraded intervals', num(a.degraded), { mono: true }]
      ], { compact: true }) + '<div class="e1-row ae-mt">' + c.button('Remove from pair', { size: 'sm', kind: 'danger', icon: 'x', attrs: 'data-action="ae-remove-tsa" data-value="' + esc(a.name) + '"' }) + '</div>' });
    }).join('') + '</div>' +
      '<div class="ae-mt">' + c.callout({ kind: 'rule', title: 'The two-authority rule', body: '<p>Every batch is anchored by two authorities, and at least one is India-based. A bundle verifies if either token verifies; a bundle where the two tokens disagree about the root is an integrity failure and a P0.</p><p>Free public authorities are for development and reference only — never in a production bundle. Running with a known-bad authority to preserve the pair is worse than running with one.</p>' }) + '</div>';
    var inc = c.table({ caption: 'Anchoring incidents', columns: [
      { key: 'id', label: 'Incident', mono: true }, { key: 'w', label: 'Window', render: function (r) { return esc(ist(r.start) + ' → ' + F.time(r.end)); } },
      { key: 'cause', label: 'What happened' }, { key: 'm', label: 'Max unanchored', align: 'right', mono: true, render: function (r) { return esc(num(r.maxHead)); } },
      { key: 's', label: 'Status' }, { key: 'x', label: 'Write-up', render: function (r) { return c.button('Open', { size: 'sm', kind: 'ghost', attrs: 'data-action="ae-anc-incident" data-value="' + esc(r.id) + '"' }); } }
    ], rows: D.anchorIncidents, empty: { title: 'No anchoring incidents', why: 'Both authorities have answered every interval since anchoring was switched on.' } });
    var body = function () {
      var head = degraded
        ? c.callout({ kind: 'warning', title: 'Anchoring degraded since 09:14 — 88 records unanchored', body: '<p>Both authorities have failed for four consecutive intervals. Writes and signing continue; nothing is refused or delayed. Outstanding batches will be anchored oldest first, each with its own root and its true token time — never merged.</p>' })
        : '<div class="ae-hero">' + c.icon('clock', 20) + '<p class="ae-line">last counter-signature 6 minutes ago, 22 records unanchored</p><span class="e1-caption e1-muted">Published interval ≤15 minutes, Growth tier · the open batch closes at 10:45 UTC</span></div>';
      var tabs = c.tabs([{ id: 'batches', label: 'Batches', href: E1.href('/assurance/anchoring', { tab: 'batches' }), count: D.batches.length + 1 }, { id: 'authorities', label: 'Authorities', href: E1.href('/assurance/anchoring', { tab: 'authorities' }), count: 2 }, { id: 'incidents', label: 'Incidents', href: E1.href('/assurance/anchoring', { tab: 'incidents' }), count: D.anchorIncidents.length }], tab);
      var content = tab === 'authorities' ? auth : tab === 'incidents' ? inc + '<p class="e1-caption e1-muted ae-mt-s">A batch anchored late carries its true token time. Incident history is appended, never edited.</p>' :
        c.filters(['all', 'anchored', 'late', 'single_anchor', 'open'].map(function (s) { return { label: s === 'all' ? 'All' : s === 'late' ? 'Anchored late' : s === 'single_anchor' ? 'single_anchor' : s.charAt(0).toUpperCase() + s.slice(1), href: E1.href('/assurance/anchoring', s === 'all' ? null : { status: s }), active: st === s, count: rows.filter(function (r) { return s === 'all' || r.status === s; }).length }; }), { label: 'Status' }) + '<div class="ae-mt">' + batchTable + '</div>';
      return head + '<div class="ae-mt">' + kpis([
        { label: 'p99 lag, September', value: '14 m 10 s', note: 'Against a ≤15 minute SLO' }, { label: 'Batches this month', value: '2,318', note: 'Idle intervals produce no batch and no token' },
        { label: 'single_anchor', value: '1', note: 'A degraded state, not a failure' }, { label: 'Degraded intervals', value: '1', note: '19 Oct 2027, 09:14–10:20', href: E1.href('/assurance/anchoring', { tab: 'incidents' }) }]) + '</div>' +
        '<div class="ae-mt">' + tabs + '</div><div class="ae-mt">' + content + '</div>' +
        '<div class="ae-two ae-mt">' + c.callout({ kind: 'rule', title: 'What an anchor proves', body: '<p>' + esc(ANCHOR_RULE) + '</p><p>Existence, form, and an upper bound on time.</p>' }) +
        c.callout({ kind: 'info', title: 'Machinery, not a governed write', body: '<p>Anchoring does not appear in your chain, is never a metered unit, and never refuses or delays a write. We do not run a blockchain.</p>' }) + '</div>';
    };
    return screen({ L: 'L2', q: q, path: '/assurance/anchoring', title: 'Anchoring', lead: 'Each closed batch of record digests is time-stamped by two independent authorities within 15 minutes. An anchor is an upper bound on time — nothing more.',
      states: [{ id: 'degraded', label: 'Degraded', note: 'Both authorities failing' }, { id: 'loading', label: 'Loading' }], lock: LOCK_ANCHOR,
      stateBody: function (s) { return s === 'loading' ? loadingState() : null; }, body: body });
  }

  function batchScreen(p, q) {
    var b = batchById(p.batch);
    if (!b) {
      return screen({ L: 'L2', q: q, title: 'No batch ' + p.batch, lead: 'This tenant has no closed anchor batch with that id.', back: ['Anchoring', '#/assurance/anchoring'], lock: LOCK_ANCHOR,
        body: function () { return c.empty({ title: 'Batch not found', why: 'Batch ids name the tenant and the minute the batch closed, for example b_20271026_1030_7c1e. Idle intervals produce no batch.', action: { label: 'All batches', href: '#/assurance/anchoring' }, icon: 'clock' }); } });
    }
    var n = b.to - b.from + 1, depth = Math.ceil(Math.log(n) / Math.LN2);
    var token = function (who, t, ok) {
      if (!t) return c.card({ title: who, eyebrow: 'Authority B · global', actions: c.badge('warning', 'No token'), body: '<p class="e1-text-body">Timed out after 30 seconds. The batch is <code>single_anchor</code>: anchored by one authority. A degraded state, not a failure — a bundle verifies if either token verifies.</p>' });
      return c.card({ title: who, eyebrow: who === 'eMudhra' ? 'Authority A · India-based' : 'Authority B · global', actions: c.badge('good', 'Token verified'), body: c.kv([
        ['messageImprint', 'SHA-256 ' + b.root.slice(0, 4) + '…' + b.root.slice(-4), { mono: true }], ['genTime', t, { mono: true }], ['Policy id', 'As issued by the authority'], ['Accuracy', '±1 s'],
        ['Nonce', '0x' + hx(b.id + who, 4) + '…' + hx(b.id + who + 'n', 2), { mono: true }], ['Round trip', (who === 'eMudhra' ? 412 : 388) + ' ms', { mono: true }],
        ['Certification path', '3 certificates, captured at anchor time'], ['Revocation data', 'OCSP response captured ' + t, { mono: false }]
      ], { compact: true }) });
    };
    return screen({
      L: 'L2', q: q, title: b.id, lead: 'Batch of ' + num(n) + ' record digests, ' + rng(b.from, b.to) + '. ' + (b.status === 'late' ? 'Anchored late — it carries its true token time.' : b.status === 'single_anchor' ? 'Anchored by one authority. A degraded state, not a failure.' : 'Anchored by both authorities.'),
      back: ['Anchoring', '#/assurance/anchoring'], lock: LOCK_ANCHOR,
      actions: c.button('Export a bundle covering this batch', { icon: 'download', href: E1.href('/assurance/export', { from: b.from, to: b.to }) }),
      body: function () {
        return '<div class="ae-hero">' + c.badge(BSTAT[b.status][0], BSTAT[b.status][1]) + '<span class="ae-line">' + esc(rng(b.from, b.to)) + ' · ' + num(n) + ' leaves · lag ' + esc(b.lag) + '</span>' + (b.incident ? c.button('Incident ' + b.incident, { size: 'sm', kind: 'ghost', attrs: 'data-action="ae-anc-incident" data-value="' + esc(b.incident) + '"' }) : '') + '</div>' +
          '<div class="ae-two ae-mt">' + c.card({ title: 'Batch', body: c.kv([['Tenant', D.tenant.name], ['Range', rng(b.from, b.to), { mono: true }], ['Leaf count', num(n), { mono: true }], ['Closed at', b.closed, { mono: true }], ['Records', '<a href="#/assurance/proof/' + b.from + '">First record ' + esc(sq(b.from)) + '</a> · <a href="#/assurance/proof/' + b.to + '">last ' + esc(sq(b.to)) + '</a>', { html: true }]], { compact: true }) }) +
          c.card({ title: 'Merkle tree', body: c.kv([['Root', c.hash(b.root, { label: 'Merkle root' }), { html: true }], ['Construction', 'RFC 6962 §2.1 · leaf(d) = SHA-256(0x00 ‖ d) · node(l, r) = SHA-256(0x01 ‖ l ‖ r)'], ['Odd final node', 'Promoted, not duplicated'], ['Inclusion path length', depth + ' sibling digests per record', { mono: true }]], { compact: true }) }) + '</div>' +
          sec('tokens', 'Tokens', '<div class="ae-two">' + token('eMudhra', b.a) + token('DigiCert', b.b) + '</div>', { lead: 'Each token wraps the root in a TimeStampReq with a fresh nonce. A token whose imprint does not match the root is discarded and retried; a future genTime is discarded.' }) +
          sec('path', 'Inclusion path explorer', c.card({ body: '<div class="e1-row" style="align-items:flex-end;gap:12px">' + c.field('Record seq in this batch', c.input({ id: 'ae-ip-seq', value: String(Math.min(b.to, b.from + 9)), mono: true, type: 'number', attrs: 'min="' + b.from + '" max="' + b.to + '"' }), { id: 'ae-ip-seq', help: 'Between ' + num(b.from) + ' and ' + num(b.to) + '.' }) + '</div><div id="ae-ip-out" class="ae-mt"></div>' }), { lead: 'Pick a record to see the sibling digests that lead from its leaf to the root. The verifier walks exactly this path.' }) +
          sec('proves', 'What this anchor proves, and what it does not', '<div class="ae-two">' + c.callout({ kind: 'rule', title: 'Proves', body: '<p>' + esc(ANCHOR_RULE) + '</p>' }) + c.card({ title: 'Does not prove', body: ulist(escList(ANCHOR_NOT)) }) + '</div>');
      }
    });
  }
  function inclusionPath(b, s) {
    var n = b.to - b.from + 1, depth = Math.ceil(Math.log(n) / Math.LN2), idx = s - b.from, rows = [], i;
    for (i = 0; i < depth; i++) {
      var sib = idx ^ 1;
      rows.push({ lvl: i, side: (idx % 2) ? 'left' : 'right', d: dg(hx(b.id + s + i, 4), hx(b.id + i, 4), b.id + ':' + s + ':' + i), note: sib * Math.pow(2, i) + b.from > b.to && i === 0 ? 'promoted (odd final node)' : '' });
      idx = Math.floor(idx / 2);
    }
    return c.table({ caption: 'Inclusion path for ' + sq(s), dense: true, columns: [{ key: 'lvl', label: 'Level', mono: true, align: 'right' }, { key: 'side', label: 'Sibling on the' }, { key: 'd', label: 'Sibling digest', render: function (r) { return c.hash(r.d, { label: 'Sibling digest' }); } }, { key: 'note', label: 'Note' }], rows: rows }) +
      '<p class="e1-caption e1-muted ae-mt-s">leaf = SHA-256(0x00 ‖ digest of ' + esc(sq(s)) + ') → ' + depth + ' steps → root ' + esc(b.root.slice(0, 4) + '…' + b.root.slice(-4)) + '. ' + depth + ' digests, ' + depth * 32 + ' octets.</p>';
  }

  E1.route('/assurance/anchoring', { title: 'Anchoring', layout: 'console', door: 'assurance', section: 'anchoring', crumbs: CR, keywords: 'anchor rfc 3161 timestamp authority tsa batch merkle', render: anchoringScreen });
  E1.route('/assurance/anchoring/:batch', { title: function (p) { return 'Batch ' + p.batch; }, layout: 'console', door: 'assurance', section: 'anchoring', crumbs: CR.concat([['Anchoring', '#/assurance/anchoring']]), example: '/assurance/anchoring/b_20271026_1030_7c1e', keywords: 'anchor batch token inclusion path', render: batchScreen,
    mount: function (el, p) {
      if (!E1.atLeast('L2')) return;
      var b = batchById(p.batch), inp = el.querySelector('#ae-ip-seq'), o = el.querySelector('#ae-ip-out');
      if (!b || !inp || !o) return;
      function upd() {
        var s = parseInt(inp.value, 10);
        if (!(s >= b.from && s <= b.to)) { inp.setAttribute('aria-invalid', 'true'); o.innerHTML = c.callout({ kind: 'warning', title: 'Not in this batch', body: '<p>' + esc(sq(s || 0)) + ' is outside ' + esc(rng(b.from, b.to)) + '. Records in other batches have their own paths.</p>' }); return; }
        inp.setAttribute('aria-invalid', 'false'); o.innerHTML = inclusionPath(b, s);
      }
      inp.addEventListener('input', upd); upd();
    } });

  /* ===========================================================================
     VERIFIER PROFILES (E13) — authored and certified at L1 as L2 preparation; they execute at L2
     =========================================================================== */
  var PSTAT = { certified: 'good', draft: 'neutral', superseded: 'info', withdrawn: 'warning' };
  var CLAUSES_MCA = [
    { ref: 'Cl. 1', text: 'Audit trail of each and every transaction', kind: 'record_keeping', wt: '*', gates: '—', fields: 'F04, F05, F09, F10, F16', checks: 'C01, C02' },
    { ref: 'Cl. 2', text: 'Creating an edit log of each change made in books of account', kind: 'record_keeping', wt: '*', gates: 'precondition', fields: 'F12, F13, F14, F07', checks: 'C03' },
    { ref: 'Cl. 3', text: 'Along with the date when such changes were made', kind: 'record_keeping', wt: '*', gates: '—', fields: 'F16', checks: 'C04' },
    { ref: 'Cl. 4', text: 'The audit trail shall not be disabled', kind: 'non_repudiation', wt: '*', gates: '—', fields: 'F02, F03', checks: 'C05, C06' }
  ];
  function profileBanner() {
    if (E1.atLeast('L2')) return '';
    return c.callout({ kind: 'caveat', title: 'Level 2 preparation', body: '<p>Profiles are authored and certified now. They execute against your records from Level 2 — until then a dry run uses reference fixtures, not your records, and its verdict is labelled so. Nothing here is a verification of your chain.</p>' });
  }
  function profilesScreen(p, q) {
    var rows = D.profiles;
    var tbl = function (list) {
      return c.table({ caption: 'Verifier profile registry', columns: [
        { key: 'id', label: 'profile_id', nowrap: true, render: function (r) { return '<a class="e1-table__link e1-mono" href="#/assurance/profiles/' + esc(r.id) + '">' + esc(r.id) + '</a>'; } },
        { key: 'v', label: 'Version', mono: true, align: 'right' },
        { key: 'regime', label: 'Regime' }, { key: 'issuer', label: 'Issuer' }, { key: 'jur', label: 'Jurisdiction', mono: true },
        { key: 'st', label: 'Status', render: function (r) { return c.badge(PSTAT[r.status], r.status); } },
        { key: 'a', label: 'Author · certifier', render: function (r) { return esc(r.author) + '<div class="e1-caption e1-muted">' + esc(r.certifier || 'No certifier yet') + '</div>'; } },
        { key: 'ra', label: 'rule_as_at', mono: true, render: function (r) { return esc(r.ruleAsAt || '—'); } },
        { key: 'w', label: 'Applies to records', mono: true, render: function (r) { return esc(r.from ? r.from + ' → ' + (r.to || '—') : '—'); } },
        { key: 'pp', label: 'P1–P12', align: 'right', mono: true, render: function (r) { return esc(r.p + '/12'); } },
        { key: 'in', label: 'On this tenant', render: function (r) { return r.installed ? (E1.atLeast('L2') ? c.badge('good', 'Installed') : c.badge('neutral', 'Installs at upgrade stage 4', { icon: 'clock' })) : '<span class="e1-muted">No</span>'; } }
      ], rows: list, rowHref: function (r) { return '#/assurance/profiles/' + r.id; }, empty: { title: 'No certified profile for your regimes yet', why: 'A profile binds each clause of one regime to a write type, a gate and a field — by name.', fill: 'Author one in eight blocks; a certifier who is not the author signs it off.', action: { label: 'New profile', href: '#/assurance/profiles/new' }, icon: 'file-text' } });
    };
    return screen({
      L: null, q: q, path: '/assurance/profiles', title: 'Verifier profiles',
      lead: 'A profile is a checkable claim — this bundle is conforming for this regime under this profile version.',
      metaHtml: c.level('L2') + '<span>' + (E1.atLeast('L2') ? 'Level 2 Attested — profiles execute against your records' : 'Level 2 preparation — authored and certified now, executed from Level 2') + '</span>',
      actions: c.button('New profile', { kind: 'primary', icon: 'plus', href: '#/assurance/profiles/new' }),
      states: [{ id: 'empty', label: 'Empty' }, { id: 'error', label: 'Error' }],
      stateBody: function (s) {
        if (s === 'empty') return profileBanner() + tbl([]);
        if (s === 'error') return c.error({ title: 'The profile registry did not answer.', reassurance: 'Nothing was registered or changed. Retrying is safe.', code: 'PLATFORM.REGISTRY_UNAVAILABLE', action: { label: 'Try again', href: '#/assurance/profiles' } });
        return null;
      },
      body: function () {
        return profileBanner() + (E1.atLeast('L2') ? '' : '<div class="ae-mt"></div>') +
          c.callout({ kind: 'rule', title: 'A clause binds to a write type, a gate and a field — by name — or it does not bind.', body: '<p>Every profile names its author and a different certifier. A bundle is judged under the profile version it claims, not the current one.</p>' }) +
          sec('registry', 'Registry', tbl(rows)) +
          sec('versions', 'How versions change', c.table({ caption: 'Versioning rules', columns: [{ key: 'w', label: 'When' }, { key: 'r', label: 'What happens' }], rows: [
            { w: 'A clarification', r: 'A new version. The old one stays certified.' },
            { w: 'A new or altered obligation', r: 'The old version becomes superseded — and keeps verifying.' },
            { w: 'The regime is withdrawn, or the profile was wrong', r: 'Withdrawn. A bundle claiming it exits 4 UNSUPPORTED with the withdrawal date printed.' }] }));
      }
    });
  }

  function profileDetail(p, q) {
    if (p.id === 'new') return profileNew(p, q);
    var pr = profileById(p.id);
    if (!pr) {
      return ph({ title: 'No profile called “' + p.id + '”', back: ['Verifier profiles', '#/assurance/profiles'] }) +
        c.empty({ title: 'Not in the registry', why: 'profile_id follows the pattern jurisdiction-regime, for example in-mca-audit-trail. This one is not registered.', action: [{ label: 'Open the registry', href: '#/assurance/profiles' }, { label: 'New profile', href: '#/assurance/profiles/new' }], icon: 'file-text' });
    }
    var tab = q.tab || 'binding';
    var isMca = pr.id === 'in-mca-audit-trail';
    var tabs = [['identity', 'Identity'], ['binding', 'Regime binding'], ['bundle', 'Bundle requirements'], ['checks', 'Checks'], ['vocab', 'Report vocabulary'], ['limits', 'Limits statement'], ['versioning', 'Versioning'], ['conformance', 'Conformance']];
    var content;
    if (tab === 'identity') content = c.card({ body: c.kv([['profile_id', pr.id, { mono: true }], ['profile_version', String(pr.v), { mono: true }], ['regime_name', pr.regime], ['issuer', pr.issuer], ['jurisdiction', pr.jur, { mono: true }], ['author', pr.author], ['certifier', pr.certifier || 'None yet — never the author'], ['status', c.badge(PSTAT[pr.status], pr.status), { html: true }], ['Profile digest', pr.digest ? c.hash(pr.digest, { label: 'Profile digest' }) : '<span class="e1-muted">Computed at certification</span>', { html: true }]], { cols: 2 }) });
    else if (tab === 'binding') content = isMca ? c.table({ caption: 'regime_binding — one row per clause, clause text quoted', columns: [
      { key: 'ref', label: 'clause_ref', mono: true }, { key: 'text', label: 'clause_text', render: function (r) { return '<q>' + esc(r.text) + '</q>'; } }, { key: 'kind', label: 'obligation_kind', mono: true },
      { key: 'wt', label: 'Write types', mono: true }, { key: 'gates', label: 'Gates', mono: true }, { key: 'fields', label: 'Fields', mono: true }, { key: 'checks', label: 'Checks', mono: true }, { key: 'd', label: 'Disposition', render: function () { return c.badge('good', 'bound'); } }], rows: CLAUSES_MCA }) + '<div class="e1-row ae-mt">' + c.button('Trace a clause to its proof fields', { size: 'sm', href: '#/assurance/regulations/in-mca-audit-trail?clause=2', iconRight: 'arrow-right' }) + '</div>'
      : c.empty({ title: 'No clause is bound yet', why: pr.status === 'withdrawn' ? 'This version bound clause text from a consultation paper. It was withdrawn rather than left to mislead.' : 'Clause text is quoted verbatim before it can bind; a blank is a validation failure, never a draft state.', action: { label: 'Open the regulation', href: '#/assurance/regulations/' + pr.id }, compact: true });
    else if (tab === 'bundle') content = c.card({ body: c.kv([['required_members', 'manifest.json, seals.jsonl, chain.json, anchors/, keys.json, declarations/, lexicon/, VERIFY.txt', { mono: true }], ['min_assurance_level', '2 — any profile that asserts non-repudiation', { mono: true }], ['proof_binding_fields', 'customer, posting_date, grand_total, items[].item_code, items[].qty, items[].rate', { mono: true }], ['redaction_profile', 'ledger1-default', { mono: true }], ['refusals_required', 'true', { mono: true }], ['continuity_scope', 'full_chain', { mono: true }]]) });
    else if (tab === 'checks') content = c.table({ caption: 'checks[]', columns: [{ key: 'id', label: 'check_id', mono: true }, { key: 'kind', label: 'kind', mono: true }, { key: 'statement', label: 'Statement' }, { key: 'onFail', label: 'on_fail', render: function (r) { return c.badge(r.onFail === 'fail_integrity' ? 'critical' : 'serious', r.onFail, { subtle: true }); } }, { key: 'cl', label: 'Clauses', mono: true, render: function (r) { return esc(r.clauses.join(', ')); } }], rows: isMca ? D.checks : [], empty: { title: 'No checks yet', why: 'A check without a clause is an orphan, and an orphan is a validation error.', compact: true } }) + (isMca ? '<p class="e1-caption e1-muted ae-mt-s">C06 on a Level 1 dry run reads <code>not_applicable — assurance level 1</code>.</p>' : '');
    else if (tab === 'vocab') content = c.card({ body: c.kv([['A record', 'an entry in the audit trail (edit log)'], ['A committed write', 'a change made in the books of account'], ['A refusal', 'an attempted change that was not made'], ['recorded_at', 'the date when such change was made (platform clock)'], ['The chain is continuous', 'the audit trail has not been disabled']]) + '<p class="e1-caption e1-muted">The regime’s own words, used in section 5 of every report. We would rather an auditor told us where they are wrong.</p>' });
    else if (tab === 'limits') content = pr.limits ? limitsBlock(pr.limits, 'Required; more than 200 characters; unique; reproduced verbatim in every report.') : c.callout({ kind: 'caveat', title: 'Limits statement — not yet certified', body: '<p>A draft limits statement is not shown, so that nobody quotes it as if it were real.</p>' });
    else if (tab === 'versioning') content = c.card({ body: c.kv([['supersedes', '—'], ['rule_as_at', pr.ruleAsAt || '—', { mono: true }], ['applies_to_records_from', pr.from || '—', { mono: true }], ['applies_to_records_to', pr.to || '—', { mono: true }]]) + '<p class="e1-caption e1-muted">A record is judged by the profile version whose window covers its recorded_at, and by no other.</p>' });
    else content = c.table({ caption: 'Conformance P1–P12' + (pr.fixture ? ' · fixture set ' + pr.fixture : ''), columns: [{ key: 'id', label: 'Test', mono: true }, { key: 'n', label: 'Name' }, { key: 'r', label: 'Result', render: function (r) { return r.ok ? c.badge('good', 'passed') : c.badge('neutral', 'not run', { icon: 'minus' }); } }, { key: 'd', label: 'Date', mono: true }], rows: D.conformance.map(function (t, i) { return { id: t[0], n: t[1], ok: i < pr.p, d: i < pr.p ? (pr.confAt || '2027-09-02') : '—' }; }) });

    var L2 = E1.atLeast('L2');
    var actions = c.button('Dry run against fixtures', { icon: 'play', attrs: 'data-action="ae-dryrun" data-value="' + esc(pr.id) + '"' }) +
      (pr.status === 'certified' ? c.button(pr.installed && L2 ? 'Installed on this tenant' : 'Install on tenant', { kind: 'primary', disabled: pr.installed && L2, icon: 'package', attrs: 'data-action="ae-install-profile" data-value="' + esc(pr.id) + '"' }) : pr.status === 'draft' ? c.button('Request certification', { kind: 'primary', icon: 'gate', attrs: 'data-action="ae-certify" data-value="' + esc(pr.id) + '"' }) : '');
    return ph({ eyebrow: 'Verifier profile', title: pr.id + ' v' + pr.v, lead: pr.regime, back: ['Verifier profiles', '#/assurance/profiles'], actions: actions,
      meta: c.badge(PSTAT[pr.status], pr.status) + '<span>' + esc(pr.issuer + ' · ' + pr.jur) + '</span><span>Author ' + esc(pr.author) + ' · certifier ' + esc(pr.certifier || 'none yet') + '</span>' + (pr.pack ? '<a href="#/records/packs/' + esc(pr.pack) + '">Pack ' + esc(pr.pack) + '</a>' : '') + c.level('L2') + '<span>' + (L2 ? 'Level 2 Attested' : 'Level 2 preparation') + '</span>' }) +
      profileBanner() +
      (pr.status === 'withdrawn' ? c.callout({ kind: 'warning', title: 'Withdrawn on ' + day(pr.withdrawnAt + 'T00:00:00Z'), body: '<p>' + esc(pr.note) + '</p>' }) : pr.note ? c.callout({ kind: 'info', title: 'Note', body: '<p>' + esc(pr.note) + '</p>' }) : '') +
      (pr.limits ? sec('limits-top', 'What a PASS under this profile does not establish', limitsBlock(pr.limits, 'Verbatim. Limits travel with claims: this statement is printed wherever this profile’s PASS is shown.')) : '') +
      '<div class="ae-mt">' + c.tabs(tabs.map(function (t) { return { id: t[0], label: t[1], href: E1.href('/assurance/profiles/' + pr.id, { tab: t[0] }) }; }), tab, { label: 'Profile blocks' }) + '</div><div class="ae-mt">' + content + '</div>';
  }

  function profileNew(p, q) {
    var blocks = ['profile_identity', 'regime_binding', 'bundle_requirements', 'checks[]', 'report_vocabulary', 'limits_statement', 'versioning', 'conformance'];
    return ph({ eyebrow: 'Verifier profile · draft', title: 'New verifier profile', lead: 'Eight blocks. Every field takes a value, out_of_scope with an ADR, or not_measurable with a reason and what would change it.', back: ['Verifier profiles', '#/assurance/profiles'],
      actions: c.button('Save draft', { icon: 'check', attrs: 'data-action="ae-profile-save"' }) + c.button('Request certification', { kind: 'primary', icon: 'gate', attrs: 'data-action="ae-certify" data-value="new"' }),
      meta: c.level('L2') + '<span>Level 2 preparation — authoring is allowed at every level</span>' }) +
      c.stepper(blocks, 0) +
      '<div class="e1-split ae-mt"><div class="e1-stack">' +
      c.card({ title: '1 · profile_identity', body: '<div class="ae-two">' + c.field('profile_id', c.input({ id: 'ae-pid', mono: true, placeholder: 'in-gst-einvoice', describedBy: 'ae-pid-msg' }), { id: 'ae-pid', required: true, help: 'Pattern ^[a-z]{2}-[a-z0-9-]{3,40}$ — jurisdiction first.' }) + c.field('regime_name', c.input({ id: 'ae-regime', placeholder: 'GST e-invoicing through the Invoice Registration Portal' }), { id: 'ae-regime', required: true }) + '</div>' +
        '<div class="ae-two">' + c.field('author', c.input({ id: 'ae-author', value: E1.data.user ? E1.data.user.name : 'Venkat Raman', readonly: true }), { id: 'ae-author', help: 'You. The certifier must be someone else.' }) + c.field('certifier', c.select({ id: 'ae-cert', options: ['Choose a person', 'Arjun Mehta — elan1 lead', 'Kavya Menon — elan1 certifier'] }), { id: 'ae-cert', help: 'People only. Never the author, never an agent.' }) + '</div>' }) +
      c.card({ title: '2 · regime_binding', body: c.field('clause_text — quoted, not paraphrased', c.textarea({ id: 'ae-clause', rows: 3, placeholder: 'Paste the clause verbatim from the instrument' }), { id: 'ae-clause', required: true }) +
        '<div class="ae-two">' + c.field('binds_write_types', c.input({ id: 'ae-bwt', mono: true, value: 'erp.sales_invoice.submit' }), { id: 'ae-bwt' }) + c.field('binds_gates', c.input({ id: 'ae-bg', mono: true, value: 'irn_gate' }), { id: 'ae-bg', error: 'irn_gate is not declared in erp.ar v12. A profile that binds to a gate nobody declared binds to nothing.' }) + '</div>' +
        c.callout({ kind: 'rule', body: '<p>A clause binds to a write type, a gate and a field — by name — or it does not bind. Names resolve live against certified declarations; an unresolvable name is an error, not a warning.</p>' }) }) +
      c.card({ title: '6 · limits_statement', body: c.field('What a PASS under this profile does not establish', c.textarea({ id: 'ae-lim', rows: 5, placeholder: 'A PASS under this profile establishes … It does not establish …', describedBy: 'ae-lim-msg' }), { id: 'ae-lim', required: true, help: 'More than 200 characters, unique across the registry, reproduced verbatim in every report.' }) + '<p class="e1-caption ae-mt-s"><span id="ae-lim-count" class="e1-mono">0</span> of at least 201 characters</p>' }) +
      '</div><aside class="e1-stack">' + c.card({ title: 'Blocks', body: ulist(blocks.map(function (b, i) { return '<span class="e1-mono">' + (i + 1) + '</span> · <code>' + esc(b) + '</code>'; }), true) }) +
      c.callout({ kind: 'info', title: 'Certification is dual control', body: '<p>Request certification sends a governed write to a named person at Decide. If you try to certify your own profile the write refuses with GATE.DUAL_CONTROL_SAME_ACTOR.</p>' }) + '</aside></div>';
  }

  E1.route('/assurance/profiles', { title: 'Verifier profiles', layout: 'console', door: 'assurance', section: 'profiles', crumbs: CR, keywords: 'verifier profile regime clause limits statement', render: profilesScreen });
  E1.route('/assurance/profiles/:id', { title: function (p) { return p.id === 'new' ? 'New verifier profile' : p.id; }, layout: 'console', door: 'assurance', section: 'profiles', crumbs: CR.concat([['Verifier profiles', '#/assurance/profiles']]), example: '/assurance/profiles/in-mca-audit-trail', keywords: 'profile checks conformance limits', render: profileDetail,
    mount: function (el, p) {
      var t = el.querySelector('#ae-lim'), n = el.querySelector('#ae-lim-count');
      if (t && n) t.addEventListener('input', function () { n.textContent = String(t.value.length); n.className = 'e1-mono ' + (t.value.length > 200 ? 'e1-tone--good' : ''); });
    } });

  /* ===========================================================================
     VERIFIER RUNS — reports readers attached (the verifier records nothing) · Level 2 Attested
     =========================================================================== */
  var INTEGRITY = ['Recompute every preimage', 'Recompute every digest', 'Verify every signature against keys.json windows and the supplied fingerprint', 'seq contiguity', 'prev_digest linkage', 'Merkle inclusion paths', 'Anchor token time precedes now', 'Resolve every declaration version and lexicon digest'];
  function integrityResults(r) {
    var NA = 'not_applicable — assurance level 1';
    return INTEGRITY.map(function (name, i) {
      var res = 'passed';
      if (r.verdict === 'UNSUPPORTED' || r.verdict === 'USAGE') res = 'not run';
      else if (r.l1 && (i === 2 || i === 5 || i === 6)) res = NA;
      else if (r.spans && (i === 2 || i === 5 || i === 6)) res = 'passed (Level 2 segment) · ' + NA + ' (Level 1 segment)';
      if (r.verdict === 'FAIL_INTEGRITY' && i === 4) res = 'failed';
      if (r.verdict === 'INCOMPLETE' && i === 7) res = 'failed — member missing';
      return { n: i + 1, name: name, res: res };
    });
  }
  function resBadge(res) {
    if (/^failed/.test(res)) return c.badge('critical', res);
    if (/^passed/.test(res) && res.indexOf('not_applicable') < 0) return c.badge('good', res);
    if (res === 'not run') return c.badge('neutral', 'not run', { icon: 'minus' });
    return '<code class="e1-mono">' + esc(res) + '</code>';
  }
  function reportHtml(r) {
    var e = EXIT[r.verdict];
    var prof = r.profile && r.profile.indexOf('in-mca-audit-trail v1') === 0 ? profileById('in-mca-audit-trail') : null;
    var scope = r.from ? rng(r.from, r.to) + ' · ' + num(r.to - r.from + 1) + ' records · ' + num(r.refusals || 0) + ' refusals · 23 of 23 write types · continuity scope full_chain' + (r.spans ? ' · Level 1: ' + num(41206 - r.from + 1) + ' records (' + rng(r.from, 41206) + ') · Level 2: ' + num(r.to - 41206) + ' records (' + rng(41207, r.to) + ')' : '') + ' · positioned inside a chain whose genesis digest is e3b7…41c9' : 'Not established — the verifier stopped before reading the bundle';
    var clauses = !prof ? (r.profile ? 'Not evaluated — ' + r.profile + ' is not supported by this verifier' : 'No profile claimed — integrity checks only') :
      r.verdict === 'FAIL_PROFILE' ? '4 clauses bound · first unmet requirement below · other checks passed' : r.l1 ? '4 clauses bound · C01–C05 passed · C06 not_applicable — assurance level 1' : '4 clauses bound · C01–C06 passed';
    var notes = r.verdict === 'PASS — payload unbound' ? 'seq 44,019, 47,302, 50,881: chain intact, payload unbound (salts destroyed under erasure request ER-0193)' : r.n === 1 ? '22 records unanchored at export time; 1 batch single_anchor (b_20271021_0915_7c1e); no key rotation spanned; no payloads unbound' : r.verdict === 'INCOMPLETE' ? 'Ask for a complete bundle. Do not treat as a failure of the records.' : r.verdict === 'FAIL_PROFILE' ? 'The records are trustworthy and the bundle does not meet this regime’s requirements. A conversation about controls, never about tampering.' : r.verdict === 'FAIL_INTEGRITY' ? 'Stop. This is a forensic question, not a compliance question.' : '—';
    return '<div class="ae-hero">' + exitBadge(r.verdict) + '<span class="e1-caption e1-muted">' + esc(e.does) + '</span></div>' +
      (r.verdict === 'PASS — payload unbound' ? '<div class="ae-mt-s">' + c.callout({ kind: 'info', title: 'Chain intact, payload unbound', body: '<p>Salts destroyed under an erasure obligation. This is a pass and is never printed as anything else.</p>' }) + '</div>' : '') +
      '<ol class="ae-report ae-mt" role="list">' +
      '<li><div><h3>Verdict</h3><p class="ae-line">' + esc(e.code + ' ' + r.verdict) + '</p></div></li>' +
      '<li><div><h3>The claim</h3><p class="e1-text-body">' + esc((r.profile || 'No profile claimed') + (prof ? ' · rule_as_at 2023-04-01' : '') + (r.from ? ' · bundle claims ' + rng(r.from, r.to) : '') + ' · tenant 7c1e…a04b') + '</p></div></li>' +
      '<li><div><h3>Scope</h3><p class="e1-text-body">' + esc(scope) + '</p></div></li>' +
      '<li><div><h3>Integrity results</h3>' + c.table({ caption: 'Eight integrity steps', dense: true, columns: [{ key: 'n', label: '#', mono: true }, { key: 'name', label: 'Step' }, { key: 'res', label: 'Result', html: true, render: function (x) { return resBadge(x.res); } }], rows: integrityResults(r) }) + '</div></li>' +
      '<li><div><h3>Clause results</h3><p class="e1-text-body">' + esc(clauses) + '</p></div></li>' +
      '<li><div><h3>First failure, in full</h3>' + (r.first ? '<p class="ae-line">' + esc(r.first) + '</p>' : '<p class="e1-text-body">None.</p>') + '</div></li>' +
      '<li><div><h3>Notes</h3><p class="e1-text-body">' + esc(notes) + '</p></div></li>' +
      '<li><div><h3>Limits</h3>' + (prof ? limitsBlock(prof.limits) : '<p class="e1-text-body">' + (r.profile ? 'The claimed profile is not supported by this verifier, so no limits statement is printed. Obtain the matching verifier.' : 'No profile claimed: a PASS says the records are intact and chained, and nothing about any regime.') + '</p>') + '</div></li>' +
      '<li><div><h3>Reproduction</h3>' + c.code(r.verdict === 'USAGE' ? 'elan1-verify --bundel kaveri-ledger1-2027-07-01_2027-10-26.tar' : 'elan1-verify --bundle ' + (r.bundle ? bundleFile(bundleById(r.bundle)) : 'reference-fixture.tar') + (r.profile ? ' --profile ' + r.profile.replace(' v', '-v') + '.json' : '') + ' --key-fingerprint 3f9a1c07…8b2e\nverifier v1.0.3 (0d7c…55a1) · profile digest aa60…31f2 · bundle digest ' + (r.bundle ? bundleDigest(bundleById(r.bundle)).slice(0, 4) + '…' + bundleDigest(bundleById(r.bundle)).slice(-4) : 'published fixture'), 'shell', { title: 'Command, verifier, profile and bundle digests' }) + '<p class="e1-caption e1-muted ae-mt-s">The fingerprint here is the one the reader typed from their own source. We never pre-fill it.</p></div></li>' +
      '</ol>';
  }
  function verifyRunsScreen(p, q) {
    var code = q.code;
    var list = D.runs.filter(function (r) { return code === undefined || code === '' || String(EXIT[r.verdict].code) === String(code); });
    var counts = {}; D.runs.forEach(function (r) { var k = EXIT[r.verdict].code; counts[k] = (counts[k] || 0) + 1; });
    var SRC = { tenant: 'Tenant', auditor: 'Auditor', operator: 'elan1 operator', reference: 'Reference fixture' };
    var tbl = c.table({ caption: 'Verifier reports', columns: [
      { key: 'n', label: '#', mono: true, align: 'right' },
      { key: 'v', label: 'Exit', html: true, nowrap: true, render: function (r) { return exitBadge(r.verdict) + (r.verdict === 'PASS — payload unbound' ? '<div class="e1-caption e1-muted">chain intact, payload unbound</div>' : ''); } },
      { key: 's', label: 'Bundle or scenario', render: function (r) { return (r.bundle ? '<a class="e1-mono" href="#/assurance/bundles/' + esc(r.bundle) + '">' + esc(r.bundle) + '</a><br>' : '') + '<span class="e1-caption">' + esc(r.scenario) + '</span>'; } },
      { key: 'd', label: 'Key detail', render: function (r) { return '<span class="e1-caption">' + esc(r.detail) + '</span>'; } },
      { key: 'by', label: 'Attached by', render: function (r) { return esc(r.by) + '<div class="e1-caption e1-muted">' + esc(SRC[r.src]) + ' · ' + esc(ist(r.at)) + '</div>'; } },
      { key: 'x', label: 'Report', render: function (r) { return c.button('Open report', { size: 'sm', kind: 'ghost', attrs: 'data-action="ae-run-report" data-value="' + r.n + '"' }); } }
    ], rows: list, empty: { title: 'No report with this exit code', why: 'Readers attach reports by choice; the verifier itself records nothing and reports to no one.', action: { label: 'Show every report', href: '#/assurance/verify-runs' } } });
    var exitTable = c.table({ caption: 'Six exit codes; code 0 has three verdict strings', columns: [{ key: 'b', label: 'Exit', html: true, nowrap: true, render: function (r) { return exitBadge(r.v); } }, { key: 'm', label: 'Means' }, { key: 'd', label: 'What the reader does' }], rows: Object.keys(EXIT).map(function (k) { return { v: k, m: EXIT[k].means, d: EXIT[k].does }; }) });
    var confuse = c.table({ caption: 'The three failures a verifier must never confuse', columns: [{ key: 'k', label: '' }, { key: 'a', label: '1 FAIL_INTEGRITY' }, { key: 'b', label: '2 FAIL_PROFILE' }, { key: 'c', label: '3 INCOMPLETE' }], rows: [
      { k: 'What happened', a: 'The data was altered, or the signature is wrong', b: 'The data is sound; the regime’s requirements are not met', c: 'The bundle is missing a piece' },
      { k: 'Who has a problem', a: 'Whoever held the records', b: 'Whoever designed the controls, or chose the scope', c: 'Whoever built the export' },
      { k: 'The reader’s next move', a: 'Forensics', b: 'A conversation about controls', c: 'Ask for a complete bundle' },
      { k: 'Reporting it as the wrong one', a: 'Accuses a customer of tampering', b: 'Hides a P0', c: 'Turns a packaging bug into an accusation' }] });
    return screen({
      L: 'L2', q: q, path: '/assurance/verify-runs', title: 'Verifier runs',
      lead: 'Reports from the offline verifier that readers chose to attach. The verifier makes no network call and records nothing — we only see what people give us.',
      actions: c.button('Get the verifier', { kind: 'primary', icon: 'terminal', href: '#/verify' }) + c.button('Exit codes explained', { href: '#/verify/exit-codes' }),
      states: [{ id: 'empty', label: 'Empty' }],
      lock: { why: 'A verifier verdict about your records is a Level 2 artefact. At L1 there is no bundle to verify and no verdict to show, so none is shown — not even an empty one.', items: ['Nine-section reports with the exit code and the scope line', 'FAIL_INTEGRITY, FAIL_PROFILE and INCOMPLETE kept apart, always', 'The profile’s limits statement printed with every PASS'] },
      stateBody: function (s) { return s === 'empty' ? c.empty({ title: 'No reports attached yet', why: 'The verifier phones home to no one. A report appears here only when a reader attaches one to a bundle.', fill: 'Verify your own bundle first and attach the report; if it does not pass for you it will not pass for them.', action: { label: 'Get the verifier', href: '#/verify' }, icon: 'terminal' }) : null; },
      body: function () {
        return c.callout({ kind: 'caveat', title: 'Submitted by the reader; elan1 did not run these', body: '<p>Reference-fixture runs are ours and are labelled so. Every other row is a report a tenant, an auditor or an operator attached by choice.</p>' }) +
          '<div class="ae-mt">' + c.filters([{ label: 'All', href: '#/assurance/verify-runs', active: code === undefined || code === '', count: D.runs.length }].concat([0, 1, 2, 3, 4, 5].map(function (k) { return { label: k + ' ' + ['PASS', 'FAIL_INTEGRITY', 'FAIL_PROFILE', 'INCOMPLETE', 'UNSUPPORTED', 'USAGE'][k], href: E1.href('/assurance/verify-runs', { code: k }), active: String(code) === String(k), count: counts[k] || 0 }; })), { label: 'Exit code' }) + '</div>' +
          '<div class="ae-mt">' + tbl + '</div>' +
          sec('codes', 'What each exit code means', exitTable, { lead: '1 and 2 must never be collapsed. FAIL_INTEGRITY means somebody’s records were altered; FAIL_PROFILE means an honest record set does not meet a regime’s requirements. 3 is never reported as either.' }) +
          sec('confuse', 'Three failures, three different people', confuse);
      }
    });
  }
  E1.route('/assurance/verify-runs', { title: 'Verifier runs', layout: 'console', door: 'assurance', section: 'verify-runs', crumbs: CR, keywords: 'verifier exit code pass fail_integrity fail_profile incomplete report', render: verifyRunsScreen,
    mount: function (el, p, q) { if (q.run && E1.atLeast('L2')) setTimeout(function () { openReport(q.run); }, 0); } });
  function openReport(n) {
    var r = runByN(n); if (!r) return;
    E1.drawer({ title: 'Verification report #' + r.n, eyebrow: r.scenario, width: 720, body: reportHtml(r) + '<p class="e1-caption e1-muted ae-mt">Nine sections, in this order, every time. Section 8 is what makes sections 1 to 7 credible.</p>' });
  }

  /* ===========================================================================
     CONTROLS AND REGULATIONS (E21) — clause → control → gate → write type → proof field
     Level 2 Attested: rows are compiled from certified verifier profiles. No “compliant” claim, anywhere.
     =========================================================================== */
  var FIELD_NAMES = { F01: 'tenant_id', F02: 'seq', F03: 'prev_digest', F04: 'write_id', F05: 'write_type', F06: 'declaration_id', F07: 'declaration_version', F08: 'policy_version', F09: 'actor_id', F10: 'actor_kind', F11: 'autonomy_level', F12: 'record_id', F13: 'record_version', F14: 'payload_hash', F15: 'lexicon_hash', F16: 'recorded_at' };
  var FIELD_PLAIN = { F01: 'Tenant identifier', F02: 'Sequence number', F03: 'Previous digest', F04: 'Write identifier', F05: 'Write type', F06: 'Declaration identifier', F07: 'Declaration version', F08: 'Policy version', F09: 'Actor identifier', F10: 'Actor kind', F11: 'Autonomy level', F12: 'Record identifier', F13: 'Record version', F14: 'Payload digest', F15: 'Lexicon digest', F16: 'Recorded at' };
  D.controls = [
    { id: 'C-AT-01', v: 1, name: 'Every change records who, what kind, and when', statement: 'Every submission of a governed sales invoice records the actor, the actor kind and the time it was recorded, and the record cannot be altered afterwards.', kind: 'preventive', mode: 'per_event', status: 'certified', wt: ['erp.sales_invoice.submit', 'erp.sales_invoice.cancel', 'erp.journal_entry.submit'], gates: ['precondition', 'retention'], decl: 'erp.ar v12', actorKinds: 'human · agent · system', fields: ['F04', 'F09', 'F10', 'F16', 'F03'], pbf: 'customer, posting_date, grand_total, items[]', test: { id: 'T-01', assertion: 'F09, F10 and F16 are present on every record and F03 equals the digest of seq − 1, over the full chain.', population: 'Every record in the period, refusals included', exc: 'none_permitted', onFail: 'fail_profile' }, result: 'Yes', over: 12480, author: 'Rohan Kapoor', certifier: 'Kavya Menon', certAt: '2027-06-18', owner: 'Accounts head', named: [['in-mca-audit-trail', 1], ['in-mca-audit-trail', 2], ['in-mca-audit-trail', 3]] },
    { id: 'C-AT-02', v: 1, name: 'Every refusal is recorded with its code and gate', statement: 'Every refused submission is recorded with its refusal code and the gate that raised it.', kind: 'detective', mode: 'per_event', status: 'certified', wt: ['erp.sales_invoice.submit'], gates: ['precondition'], decl: 'erp.ar v12', actorKinds: 'human · agent · system', fields: ['F05', 'F12', 'F13', 'F16'], pbf: '—', test: { id: 'T-02', assertion: 'Every refused attempt appears as a full sixteen-field record with a zeroed record identifier and a register code.', population: 'All refusals in the period (611)', exc: 'none_permitted', onFail: 'fail_profile' }, result: 'Yes', over: 611, author: 'Rohan Kapoor', certifier: 'Kavya Menon', certAt: '2027-06-18', owner: 'Accounts head', named: [['in-mca-audit-trail', 2]] },
    { id: 'C-AT-03', v: 1, name: 'The trail cannot be disabled or truncated unseen', statement: 'The chain is continuous over its whole history and its head is anchored by two independent authorities within the published interval.', kind: 'detective', mode: 'continuous', status: 'certified', wt: ['*'], scopeNote: 'Every write type in the declaration, because disabling the trail is a property of the chain, not of one write.', gates: [], decl: 'erp.ar v12', actorKinds: 'human · agent · system', fields: ['F02', 'F03'], pbf: '—', test: { id: 'T-03', assertion: 'seq is contiguous, prev_digest links every record, and every closed batch carries at least one verified RFC 3161 token.', population: 'The full chain', exc: 'exceptions_listed', onFail: 'fail_integrity' }, result: 'Yes', over: 12480, author: 'Rohan Kapoor', certifier: 'Kavya Menon', certAt: '2027-06-18', owner: 'Accounts head', named: [['in-mca-audit-trail', 4]], minL: 2 },
    { id: 'C-EI-01', v: 1, name: 'An e-invoice request leaves only for a registered counterparty', statement: 'Every sales invoice submission that requests an IRN passes the counterparty gate with a validated GSTIN before the request leaves the write path.', kind: 'preventive', mode: 'per_event', status: 'draft', wt: ['erp.sales_invoice.submit'], gates: ['counterparty', 'precondition'], decl: 'erp.ar v12', actorKinds: 'human · agent', fields: ['F05', 'F12', 'F14'], pbf: 'irn — not bound', broken: 'irn is not in proof_binding.fields[] at erp.ar v12. The IRN is the portal’s artefact, not ours — an expected payload field missing from F14, the most common real failure.', test: { id: 'T-04', assertion: 'Every submission with an IRN request carries a counterparty gate result of passed.', population: 'Sales invoices requesting an IRN', exc: 'exceptions_with_adr', onFail: 'fail_profile' }, result: 'Not measurable', author: 'Rohan Kapoor', certifier: null, owner: 'Accounts head', named: [['in-gst-einvoice', 1]] },
    { id: 'C-EI-02', v: 1, name: 'Late cancellation is declared irreversible and needs a second person', statement: 'A sales invoice cancelled after the 24-hour IRN window is declared irreversible and requires a second named person before it is written.', kind: 'preventive', mode: 'per_event', status: 'draft', wt: ['erp.sales_invoice.cancel'], gates: ['dual_control'], decl: 'erp.ar v12', actorKinds: 'human · agent', fields: ['F05', 'F09', 'F10', 'F16'], pbf: '—', test: { id: 'T-05', assertion: 'Every cancellation record has an approval record by a different named person.', population: 'All cancellations', exc: 'none_permitted', onFail: 'fail_profile' }, result: 'Not measurable', author: 'Rohan Kapoor', certifier: null, owner: 'Accounts head', named: [['in-gst-einvoice', 2]] },
    { id: 'C-DP-01', v: 1, name: 'No personal field is written without a consent basis', statement: 'Every write that touches a field classified personal carries a recorded consent basis, checked at the consent gate.', kind: 'preventive', mode: 'per_event', status: 'draft', wt: ['erp.customer.create', 'erp.supplier.create'], gates: ['consent'], decl: 'erp.ar v12', actorKinds: 'human · agent · system', fields: ['F05', 'F14'], pbf: 'contact_mobile (personal)', test: { id: 'T-06', assertion: 'Every write touching a personal field has a consent gate result of passed.', population: 'Writes touching personal fields', exc: 'none_permitted', onFail: 'fail_profile' }, result: 'Not measurable', author: 'Farah Sheikh', certifier: null, owner: 'Owner', named: [['in-dpdp-rules', 1]] },
    { id: 'C-DP-02', v: 1, name: 'An erasure destroys the salt and leaves the chain intact', statement: 'An approved erasure destroys the record’s payload salt; the chain continues to verify and reports the payload as unbound.', kind: 'corrective', mode: 'per_event', status: 'draft', wt: ['platform.erasure.execute'], gates: ['retention', 'dual_control'], decl: 'platform v5', actorKinds: 'human', fields: ['F14'], pbf: '—', test: { id: 'T-07', assertion: 'Every erasure leaves the chain continuous and the verifier printing PASS — payload unbound for the affected seqs.', population: 'Erasure cases in the period (3)', exc: 'none_permitted', onFail: 'fail_integrity' }, result: 'Not measurable', author: 'Farah Sheikh', certifier: null, owner: 'Owner', named: [['in-dpdp-rules', 2]] },
    { id: 'C-AK-01', v: 1, name: 'Agent changes are separable from human changes', statement: 'Every record states whether a person, a software agent or a scheduled system made the change, so agent changes can be retrieved separately.', kind: 'detective', mode: 'continuous', status: 'draft', wt: ['*'], scopeNote: 'Every write type, because actor-kind separation is claimed about the whole record set, not a subset.', gates: [], decl: 'erp.ar v12', actorKinds: 'human · agent · system', fields: ['F09', 'F10', 'F11'], pbf: '—', test: { id: 'T-08', assertion: 'F10 is one of human, agent, system on every record, never inferred.', population: 'The full chain', exc: 'none_permitted', onFail: 'fail_profile' }, result: 'Not measurable', author: 'Rohan Kapoor', certifier: null, owner: 'Finance manager', named: [['in-sebi-aiml', 1]] },
    { id: 'C-HO-01', v: 1, name: 'A person approves consequential agent writes', statement: 'Every consequential write proposed by a software agent at A2 or below is approved by a named person before it is written.', kind: 'preventive', mode: 'per_event', status: 'draft', wt: ['erp.payment_run.submit', 'erp.sales_invoice.cancel'], gates: ['dual_control'], decl: 'erp.ap v7', actorKinds: 'agent', fields: ['F09', 'F10', 'F11'], pbf: '—', test: { id: 'T-09', assertion: 'Every agent-proposed consequential write has an approval record by a named person.', population: 'Agent writes on the two write types', exc: 'none_permitted', onFail: 'fail_profile' }, result: 'Not measurable', author: 'Rohan Kapoor', certifier: null, owner: 'Finance manager', named: [], orphan: true }
  ];
  D.regulations = [
    { id: 'in-mca-audit-trail', v: 1, regime: 'Audit trail (edit log) for accounting software', issuer: 'Ministry of Corporate Affairs', jur: 'IN', instrument: 'Companies (Accounts) Rules — audit-trail requirement for accounting software (the precise clause reference is confirmed with the entity’s own CA; we do not assert it)', ruleAsAt: '2023-04-01', inForce: '1 Apr 2023', status: 'certified', author: 'Rohan Kapoor', certifier: 'Kavya Menon', certAt: '2027-06-18', profile: 'in-mca-audit-trail v1', minL: 2, pack: 'ledger1', applies: true,
      doesNot: 'It does not establish that the books of account are complete, that an invoice was commercially genuine, or that the MCA has reviewed this reading of the rule. It is our reading, dated, with its author and certifier named.',
      clauses: [
        { ref: 'Cl. 1', text: 'Audit trail of each and every transaction', kind: 'record_keeping', sev: 'blocking', disp: 'bound', controls: ['C-AT-01'], checks: 'C01, C02', gate: 'precondition, retention', wt: 'erp.sales_invoice.submit (+ .cancel, erp.journal_entry.submit)', fields: ['F04', 'F05', 'F09', 'F10', 'F16'] },
        { ref: 'Cl. 2', text: 'Creating an edit log of each change made in books of account', kind: 'record_keeping', sev: 'blocking', disp: 'bound', controls: ['C-AT-01', 'C-AT-02'], checks: 'C03', gate: 'precondition', wt: 'erp.sales_invoice.submit · one_counterparty · dual control above ₹2,00,000', fields: ['F12', 'F13', 'F14', 'F07'] },
        { ref: 'Cl. 3', text: 'Along with the date when such changes were made', kind: 'record_keeping', sev: 'blocking', disp: 'bound', controls: ['C-AT-01'], checks: 'C04', gate: 'retention', wt: '* (every write type in erp.ar v12)', fields: ['F16'] },
        { ref: 'Cl. 4', text: 'The audit trail shall not be disabled', kind: 'non_repudiation', sev: 'blocking', disp: 'bound', controls: ['C-AT-03'], checks: 'C05, C06', gate: '— (detective control: none required)', wt: '* (every write type in erp.ar v12)', fields: ['F02', 'F03'] }
      ], windows: [{ v: 'in-mca-audit-trail v1', from: '2027-07-01', to: '—', count: 12480 }] },
    { id: 'in-gst-einvoice', v: 1, regime: 'GST e-invoicing through the Invoice Registration Portal', issuer: 'Central Board of Indirect Taxes and Customs', jur: 'IN', instrument: 'CGST Rules — e-invoicing (clause text to be quoted verbatim before certification)', ruleAsAt: '2020-10-01', inForce: '1 Oct 2020', status: 'draft', author: 'Rohan Kapoor', certifier: null, profile: 'in-gst-einvoice v1 (draft)', minL: 2, pack: 'invoice1', applies: true,
      doesNot: 'The IRN, the portal response and the 24-hour cancellation window are the accounting system’s evidence and not ours.',
      clauses: [
        { ref: 'IRN', text: '', kind: 'record_keeping', sev: 'blocking', disp: 'not_measurable', reason: 'The IRN is issued by the Invoice Registration Portal, not by our write path.', would: 'Would change if the portal response were returned through a governed write we own.', controls: ['C-EI-01'], checks: '—', gate: 'counterparty, precondition', wt: 'erp.sales_invoice.submit', fields: ['F05', 'F12', 'F14'], broken: 4 },
        { ref: 'Cancel', text: '', kind: 'record_keeping', sev: 'material', disp: 'bound', controls: ['C-EI-02'], checks: '—', gate: 'dual_control', wt: 'erp.sales_invoice.cancel · irreversible after 24 h', fields: ['F05', 'F09', 'F10', 'F16'] }
      ], windows: [] },
    { id: 'in-dpdp-rules', v: 1, regime: 'Digital Personal Data Protection Rules — consent and erasure', issuer: 'Ministry of Electronics and Information Technology', jur: 'IN', instrument: 'Digital Personal Data Protection Rules, notified 13 Nov 2025; main obligations from 13 May 2027', ruleAsAt: '2025-11-13', inForce: '13 May 2027', status: 'draft', author: 'Farah Sheikh', certifier: null, profile: 'in-dpdp-rules v1 (draft)', minL: 2, pack: null, applies: true,
      doesNot: 'Consent decisions are provable to a supervisory body only for signed records. It does not establish that the consent was freely given, or that personal data held outside this write path was erased.',
      clauses: [
        { ref: 'Consent', text: '', kind: 'record_keeping', sev: 'blocking', disp: 'bound', controls: ['C-DP-01'], checks: '—', gate: 'consent', wt: 'erp.customer.create, erp.supplier.create', fields: ['F05', 'F14'] },
        { ref: 'Erasure', text: '', kind: 'retention', sev: 'blocking', disp: 'bound', controls: ['C-DP-02'], checks: '—', gate: 'retention, dual_control', wt: 'platform.erasure.execute · irreversible', fields: ['F14'] },
        { ref: 'Breach intimation', text: '', kind: 'disclosure', sev: 'material', disp: 'out_of_scope', adr: 'ADR-0417', reason: 'Breach intimation is an operator obligation under the incident process, not a governed write.', controls: [], checks: '—', gate: '—', wt: '—', fields: [] }
      ], windows: [] },
    { id: 'in-rbi-free-ai', v: 1, regime: 'RBI FREE-AI — human oversight of consequential AI actions', issuer: 'Reserve Bank of India', jur: 'IN', instrument: 'FREE-AI committee report, 13 Aug 2025 — a report, not a circular', ruleAsAt: '2025-08-13', inForce: '—', status: 'draft', author: 'Rohan Kapoor', certifier: null, profile: '—', minL: 2, pack: 'collect1', applies: false, applyNote: 'Not applicable to Kaveri Spinning Mills. Engaged only through a regulated NBFC or bank customer, never cold.',
      doesNot: 'It is a committee report, not a circular. Nothing here anticipates the text of a circular that has not been issued.',
      clauses: [{ ref: 'Oversight', text: '', kind: 'human_oversight', sev: 'advisory', disp: 'not_measurable', reason: 'A committee report is not an instrument; there is no clause text to quote.', would: 'Would change when the RBI issues a circular with clause text.', controls: ['C-HO-01'], checks: '—', gate: 'dual_control', wt: 'erp.payment_run.submit', fields: ['F09', 'F10', 'F11'] }], windows: [] },
    { id: 'in-sebi-aiml', v: 1, regime: 'SEBI AI/ML — separation of agent and human actions', issuer: 'Securities and Exchange Board of India', jur: 'IN', instrument: 'Consultation paper, 20 Jun 2025 — final circular unconfirmed', ruleAsAt: '2025-06-20', inForce: '—', status: 'draft', author: 'Rohan Kapoor', certifier: null, profile: 'in-sebi-aiml v1 (withdrawn 14 Sep 2027)', minL: 2, pack: null, applies: false, applyNote: 'Watch only. A profile bound to the consultation text was withdrawn on 14 Sep 2027.',
      doesNot: 'The proposed retention period is not final; we hold records indefinitely and do not yet offer a per-regime retention profile.',
      clauses: [{ ref: 'Separation', text: '', kind: 'segregation', sev: 'material', disp: 'not_measurable', reason: 'The final circular is unconfirmed, so there is no clause text to bind.', would: 'Would change on publication of a final circular.', controls: ['C-AK-01'], checks: '—', gate: '— (detective)', wt: '*', fields: ['F09', 'F10', 'F11'] }], windows: [] }
  ];
  function controlById(id) { for (var i = 0; i < D.controls.length; i++) if (D.controls[i].id === id) return D.controls[i]; return null; }
  function regById(id) { for (var i = 0; i < D.regulations.length; i++) if (D.regulations[i].id === id) return D.regulations[i]; return null; }
  var LOCK_CTRL = { why: 'Controls and regulations are compiled from certified verifier profiles, and a profile executes only against signed records. At Level 1 the gates run at rung 3 on every write, but no regulation object is consulted and none is claimed.', items: ['Clause → control → gate → write type → proof field, resolved by name and version', 'operated_throughout results with population and period', 'The “does not establish” line beside every bound clause'] };
  var DISP = { bound: ['good', 'bound'], out_of_scope: ['neutral', 'out_of_scope'], not_measurable: ['warning', 'not_measurable'] };
  var RES = { 'Yes': 'good', 'No': 'critical', 'Not measurable': 'neutral' };

  /** Five-link trace: clause → control → gate → write type → proof field */
  function trace(reg, cl) {
    var ctl = controlById(cl.controls[0]);
    var nodes = [
      { k: 'Regulation clause', v: reg.id + ' v' + reg.v + ' · ' + cl.ref, d: cl.text ? '“' + cl.text + '” · ' + cl.kind + ' · ' + cl.sev : 'Clause text not yet quoted · ' + cl.kind, broken: !cl.text && cl.disp === 'bound' ? 'A blank is a validation failure, never a draft state.' : null },
      { k: 'Control', v: ctl ? ctl.id + ' v' + ctl.v : 'none', d: ctl ? ctl.kind + ' · ' + ctl.mode + ' · ' + ctl.name : 'A clause that expects no control is out_of_scope with an ADR, or the regulation is incomplete.', broken: ctl ? null : 'No control named.' },
      { k: 'Gate', v: cl.gate, d: ctl && ctl.kind === 'preventive' ? 'Declared and enabled in ' + ctl.decl + '; runs at rung 3 on every write, pass or fail.' : 'Detective and corrective controls may name no gate.' },
      { k: 'Write type', v: cl.wt, d: 'Blast radius, dual control and a reversal plan — or honestly irreversible.' },
      { k: 'Proof field', v: cl.fields.length ? cl.fields.join(' · ') : '—', d: cl.fields.map(function (f) { return FIELD_NAMES[f]; }).join(', ') + (ctl && ctl.pbf && ctl.pbf !== '—' ? ' · proof_binding: ' + ctl.pbf : ''), broken: cl.broken === 4 ? (ctl && ctl.broken) : null }
    ];
    return '<div class="ae-trace" role="list" aria-label="Five-link trace for ' + esc(reg.id + ' ' + cl.ref) + '">' + nodes.map(function (nd, i) {
      return (i ? '<span class="ae-trace__arrow" aria-hidden="true">' + c.icon('arrow-right', 16) + '</span>' : '') +
        '<div class="ae-trace__node' + (nd.broken ? ' is-broken' : '') + '" role="listitem"><span class="ae-trace__k">' + (i + 1) + ' · ' + esc(nd.k) + '</span><span class="ae-trace__v">' + esc(nd.v) + '</span><span class="ae-trace__d">' + esc(nd.d) + '</span>' +
        (nd.broken ? c.badge('critical', 'Broken link') + '<span class="ae-trace__d">' + esc(nd.broken) + '</span>' : c.badge('good', 'Resolved', { subtle: true })) + '</div>';
    }).join('') + '</div>';
  }

  function controlsScreen(p, q) {
    var tbl = function (rows) {
      return c.table({ caption: 'Controls register', columns: [
        { key: 'id', label: 'control_id', nowrap: true, render: function (r) { return '<a class="e1-table__link e1-mono" href="#/assurance/controls/' + esc(r.id) + '">' + esc(r.id) + '</a> <span class="e1-mono e1-muted">v' + r.v + '</span>'; } },
        { key: 'name', label: 'Control', render: function (r) { return '<strong>' + esc(r.name) + '</strong><div class="e1-caption e1-muted">' + esc(r.statement) + '</div>'; } },
        { key: 'k', label: 'Kind · mode', mono: true, render: function (r) { return esc(r.kind) + '<br>' + esc(r.mode); } },
        { key: 'st', label: 'Status', render: function (r) { return c.badge(PSTAT[r.status], r.status); } },
        { key: 'g', label: 'Gates', mono: true, render: function (r) { return esc(r.gates.length ? r.gates.join(', ') : '—'); } },
        { key: 'res', label: 'Operated throughout', render: function (r) { return c.badge(RES[r.result], r.result) + (r.over ? '<div class="e1-caption e1-muted">over ' + esc(num(r.over)) + ' records</div>' : ''); } },
        { key: 'n', label: 'Named by', render: function (r) { return r.named.length ? r.named.map(function (x) { return '<a class="e1-mono" href="#/assurance/regulations/' + esc(x[0]) + '?clause=' + x[1] + '">' + esc(x[0]) + ' · ' + esc(regById(x[0]).clauses[x[1] - 1].ref) + '</a>'; }).join('<br>') : c.badge('warning', 'Orphan — named by no bound clause (L0-R03)'); } }
      ], rows: rows, rowHref: function (r) { return '#/assurance/controls/' + r.id; }, empty: { title: 'No controls yet', why: 'A control is one assertion with a named gate and a stated population. A control that asserts two things is two controls.', action: { label: 'Open a regulation', href: '#/assurance/regulations' } } });
    };
    return screen({
      L: 'L2', q: q, path: '/assurance/controls', title: 'Controls',
      lead: 'One assertion each, with a named gate and a stated population. A control that cannot name its gate is prose.',
      actions: c.button('Run test for period', { kind: 'primary', icon: 'play', attrs: 'data-action="ae-control-test" data-value="C-AT-01"' }) + c.button('Regulations', { href: '#/assurance/regulations', iconRight: 'arrow-right' }),
      states: [{ id: 'empty', label: 'Empty' }], lock: LOCK_CTRL,
      stateBody: function (s) { return s === 'empty' ? tbl([]) : null; },
      body: function () {
        return c.tabs([{ id: 'c', label: 'Controls', href: '#/assurance/controls', count: D.controls.length }, { id: 'r', label: 'Regulations', href: '#/assurance/regulations', count: D.regulations.length }], 'c') +
          '<div class="ae-mt">' + kpis([{ label: 'Certified', value: String(D.controls.filter(function (x) { return x.status === 'certified'; }).length), note: 'From in-mca-audit-trail v1' }, { label: 'Operated throughout', value: '3 of 3', note: 'Certified controls, 12 Aug – 26 Oct 2027' }, { label: 'Drafts', value: String(D.controls.filter(function (x) { return x.status === 'draft'; }).length), note: 'Not measurable until certified' }, { label: 'Orphans', value: '1', note: 'C-HO-01 — named by no bound clause' }]) + '</div>' +
          c.callout({ kind: 'caveat', title: 'Operated throughout is not “compliant”', body: '<p>A Yes says a control’s test held over a stated population and period. Whether that satisfies any obligation is the reader’s determination, not ours. Controls and regulations become declaration families in their own right later; today each certified row here is compiled from a verifier profile.</p>' }) +
          sec('register', 'Register', tbl(D.controls));
      }
    });
  }

  function controlDetail(p, q) {
    var ct = controlById(p.id);
    if (!ct) {
      return screen({ L: 'L2', q: q, title: 'No control ' + p.id, lead: 'control_id follows the pattern C-XX-00, for example C-AT-01.', back: ['Controls', '#/assurance/controls'], lock: LOCK_CTRL, body: function () { return c.empty({ title: 'Not in the register', why: 'This tenant has no control with that id at any version.', action: { label: 'Open the register', href: '#/assurance/controls' } }); } });
    }
    return screen({
      L: 'L2', q: q, title: ct.id + ' v' + ct.v + ' — ' + ct.name, lead: ct.statement, back: ['Controls', '#/assurance/controls'], lock: LOCK_CTRL,
      actions: c.button('Run test for period', { kind: 'primary', icon: 'play', attrs: 'data-action="ae-control-test" data-value="' + esc(ct.id) + '"' }) + c.button('Open failing records', { href: E1.href('/assurance/proof', { control: ct.id }), icon: 'proof' }),
      body: function () {
        var res = ct.status === 'certified'
          ? '<div class="ae-hero">' + c.badge(RES[ct.result], 'Operated throughout: ' + ct.result) + '<p class="ae-line">' + esc(ct.id + ' operated throughout 12 Aug 2027 – 26 Oct 2027 over ' + num(ct.over) + ' records: ' + ct.result) + '</p></div>'
          : '<div class="ae-hero">' + c.badge('neutral', 'Not measurable') + '<p class="e1-text-body" style="margin:0">A draft control has no result. It is measured from the first period after a certifier who is not the author signs it.</p></div>';
        var traces = ct.named.map(function (x) { var r = regById(x[0]); var cl = r.clauses[x[1] - 1]; return '<p class="e1-label ae-mt">' + esc(r.id + ' · ' + cl.ref) + '</p>' + trace(r, cl); }).join('');
        return res +
          '<div class="ae-two ae-mt">' + c.card({ title: 'Identity', body: c.kv([['control_id', ct.id, { mono: true }], ['control_version', String(ct.v) + ' — never “latest”', { mono: true }], ['control_kind', ct.kind, { mono: true }], ['operating_mode', ct.mode, { mono: true }], ['status', c.badge(PSTAT[ct.status], ct.status), { html: true }], ['owner_role', ct.owner + ' — a role, never a person']], { compact: true }) }) +
          c.card({ title: 'Coverage', body: c.kv([['Declaration', ct.decl, { mono: true }], ['Write types', ct.wt.join(', '), { mono: true }], ['Scope note', ct.scopeNote || '—'], ['Gates', ct.gates.length ? ct.gates.join(', ') : 'None — ' + ct.kind + ' control', { mono: true }], ['Actor kinds', ct.actorKinds]], { compact: true }) }) +
          c.card({ title: 'Evidence expectation', body: c.kv([['Record fields', ct.fields.map(function (f) { return f + ' ' + FIELD_NAMES[f]; }).join(', '), { mono: true }], ['proof_binding fields', ct.pbf, { mono: true }], ['Gate results required', 'yes'], ['Refusals required', 'yes'], ['Approval record required', ct.gates.indexOf('dual_control') >= 0 ? 'yes' : 'no'], ['continuity_scope', 'full_chain', { mono: true }]], { compact: true }) }) +
          c.card({ title: 'Test ' + ct.test.id, body: c.kv([['Assertion', ct.test.assertion], ['Population', ct.test.population], ['exception_handling', ct.test.exc, { mono: true }], ['on_fail', ct.test.onFail, { mono: true }], ['Certification', ct.certifier ? 'Author ' + ct.author + ' · certifier ' + ct.certifier + ' · ' + ct.certAt : 'Author ' + ct.author + ' · no certifier yet']], { compact: true }) }) + '</div>' +
          (ct.broken ? '<div class="ae-mt">' + c.callout({ kind: 'critical', title: 'A link in this control’s chain is broken', body: '<p>' + esc(ct.broken) + '</p><p>Mark the clause not_measurable with a reason and what would change it, or bind the field in a new declaration version.</p>' }) + '</div>' : '') +
          (ct.orphan ? '<div class="ae-mt">' + c.callout({ kind: 'warning', title: 'Orphan control (L0-R03)', body: '<p>No bound clause names this control. The RBI FREE-AI row that would name it is not_measurable, because a committee report is not an instrument.</p>' }) + '</div>' : '') +
          (traces ? sec('trace', 'Where this control sits in the chain', traces) : '') +
          sec('history', 'Version history', c.timeline([{ time: ct.certAt ? day(ct.certAt + 'T00:00:00Z') : 'Draft', title: ct.id + ' v' + ct.v + (ct.certifier ? ' certified by ' + ct.certifier : ' drafted by ' + ct.author), body: ct.certifier ? 'Dual control: the certifier is not the author. Versions are immutable and append-only.' : 'Awaiting a certifier who is not the author.', state: ct.certifier ? 'good' : 'neutral' }]));
      }
    });
  }

  function regulationsScreen(p, q) {
    var field = q.field;
    var rows = D.regulations;
    var matches = [];
    if (field) D.regulations.forEach(function (r) { r.clauses.forEach(function (cl, i) { if (cl.fields.indexOf(field) >= 0) matches.push({ r: r, cl: cl, i: i + 1 }); }); });
    var tbl = c.table({ caption: 'Regulations bound to this tenant', columns: [
      { key: 'id', label: 'regulation_id', nowrap: true, render: function (r) { return '<a class="e1-table__link e1-mono" href="#/assurance/regulations/' + esc(r.id) + '">' + esc(r.id) + '</a> <span class="e1-mono e1-muted">v' + r.v + '</span>'; } },
      { key: 'regime', label: 'Regime', render: function (r) { return esc(r.regime) + '<div class="e1-caption e1-muted">' + esc(r.issuer + ' · ' + r.jur) + '</div>'; } },
      { key: 'st', label: 'Status', render: function (r) { return c.badge(PSTAT[r.status], r.status) + (r.applies ? '' : '<div class="e1-caption e1-muted">Not applicable here</div>'); } },
      { key: 'cl', label: 'Clauses', render: function (r) { var b = 0, o = 0, n = 0; r.clauses.forEach(function (x) { if (x.disp === 'bound') b++; else if (x.disp === 'out_of_scope') o++; else n++; }); return '<span class="e1-caption">' + b + ' bound · ' + o + ' out_of_scope · ' + n + ' not_measurable</span>'; } },
      { key: 'bu', label: 'Blocking unmet', align: 'right', mono: true, render: function (r) { return esc(String(r.status === 'certified' ? 0 : r.clauses.filter(function (x) { return x.sev === 'blocking' && x.disp !== 'bound'; }).length)); } },
      { key: 'pr', label: 'Profile', mono: true, render: function (r) { return esc(r.profile); } },
      { key: 'ml', label: 'Min level', render: function (r) { return c.level('L' + r.minL, { short: true }); } },
      { key: 'ce', label: 'Certified', render: function (r) { return r.certifier ? esc(r.certifier + ' · ' + r.certAt) : '<span class="e1-muted">Not certified</span>'; } }
    ], rows: rows, rowHref: function (r) { return '#/assurance/regulations/' + r.id; }, empty: { title: 'No regulation is bound to this tenant', why: 'A regulation turns “we comply with the MCA audit-trail rule” from a claim in a deck into a query.', fill: 'Add one from a pack (ledger1, invoice1, collect1) or author one.', action: { label: 'Open the packs', href: '#/records/packs' } } });
    var mapping = c.table({ caption: 'Obligations you already carry — what the record helps with, and where it stops', columns: [{ key: 'o', label: 'Obligation' }, { key: 'd', label: 'Date' }, { key: 'h', label: 'What the record helps with' }, { key: 's', label: 'Where it stops' }], rows: [
      { o: 'MCA audit trail for accounting software', d: 'In force since 1 Apr 2023', h: 'An unbroken, non-disableable record of every change with actor, kind and time, plus the refused attempts, for every change the platform made', s: 'Changes made directly in the accounting system are that system’s audit trail, not ours. The two must be reconciled.' },
      { o: 'GST e-invoicing', d: 'In force', h: 'The write that produced the invoice was gated, approved where required, and recorded, with the reversal plan stated', s: 'It does not evidence the IRN, the portal response or the 24-hour cancellation window; those live in the accounting system' },
      { o: 'RBI FREE-AI', d: 'Report, 13 Aug 2025', h: 'Human-in-the-loop on consequential actions, demonstrable per action; refusals recorded; agent actions separable by the actor-kind field', s: 'It is a committee report, not a circular. Nothing here anticipates a circular that has not been issued' },
      { o: 'SEBI AI/ML consultation', d: '20 Jun 2025; final circular unconfirmed', h: 'Everything a software agent did, retained separately from everything a person did, per action', s: 'The proposed retention period is not final' },
      { o: 'DPDP Rules', d: 'Notified 13 Nov 2025; main obligations 13 May 2027', h: 'Consent and residency as gates that cannot be switched off; erasure through the declared retention gate, with the chain surviving erasure', s: 'Consent decisions are provable to a supervisory body only once records are signed — Level 2' }] });
    return screen({
      L: 'L2', q: q, path: '/assurance/regulations', title: 'Regulations',
      lead: 'Each clause quoted verbatim and bound, by name and version, to a control, a gate, a write type and a proof field — or marked, with a reason, as not bound.',
      actions: c.button('Controls', { href: '#/assurance/controls', iconRight: 'arrow-right' }),
      states: [{ id: 'empty', label: 'Empty' }], lock: LOCK_CTRL,
      stateBody: function (s) { return s === 'empty' ? c.empty({ title: 'No regulation is bound to this tenant', why: 'A regulation turns “we comply with the MCA audit-trail rule” from a claim in a deck into a query.', fill: 'Add one from a pack (ledger1, invoice1, collect1) or author one.', action: { label: 'Open the packs', href: '#/records/packs' }, icon: 'scale' }) : null; },
      body: function () {
        return c.tabs([{ id: 'c', label: 'Controls', href: '#/assurance/controls', count: D.controls.length }, { id: 'r', label: 'Regulations', href: '#/assurance/regulations', count: D.regulations.length }], 'r') +
          '<div class="ae-mt">' + c.callout({ kind: 'rule', title: 'We make no conformance claim', body: '<p>Bound means a clause resolves to named gates, write types and record fields. It never means compliant. A profile is our reading of an obligation, dated, with its author and certifier named — no regulator has reviewed it.</p>' }) + '</div>' +
          sec('list', 'Bound and draft regulations', tbl) +
          sec('back', 'Trace back from a proof field', c.filters(Object.keys(FIELD_NAMES).map(function (f) { return { label: f + ' ' + FIELD_NAMES[f], href: E1.href('/assurance/regulations', { field: f }), active: field === f }; }), { label: 'Field', clearHref: field ? '#/assurance/regulations' : undefined }) +
            (field ? '<div class="ae-mt">' + c.table({ caption: 'Clauses that bind ' + field + ' ' + FIELD_NAMES[field], columns: [{ key: 'r', label: 'Regulation', render: function (m) { return '<a class="e1-mono" href="#/assurance/regulations/' + esc(m.r.id) + '?clause=' + m.i + '">' + esc(m.r.id + ' · ' + m.cl.ref) + '</a>'; } }, { key: 't', label: 'Clause', render: function (m) { return m.cl.text ? '<q>' + esc(m.cl.text) + '</q>' : '<span class="e1-muted">Clause text not yet quoted</span>'; } }, { key: 'c', label: 'Controls', mono: true, render: function (m) { return esc(m.cl.controls.join(', ') || '—'); } }, { key: 'd', label: 'Disposition', render: function (m) { return c.badge(DISP[m.cl.disp][0], DISP[m.cl.disp][1]); } }], rows: matches, empty: { title: 'No clause binds ' + field, why: 'No regulation on this tenant expects this record field. That is a fact about the bindings, not a gap in the record.', compact: true } }) + '</div>' : '<p class="e1-caption e1-muted ae-mt-s">Pick one of the sixteen fields to see every clause that relies on it — the reverse of the five-link chain.</p>'), { lead: 'The most persuasive auditor-facing view: start at a field the record carries and walk back to the clauses that need it.' }) +
          sec('mapping', 'Where the record helps, and where it stops', mapping, { lead: 'Read the middle column as internal control evidence and the right-hand column as the limit.' });
      }
    });
  }

  function regulationDetail(p, q) {
    var r = regById(p.id);
    if (!r) {
      return screen({ L: 'L2', q: q, title: 'No regulation ' + p.id, lead: 'regulation_id follows the pattern jurisdiction-regime, for example in-mca-audit-trail.', back: ['Regulations', '#/assurance/regulations'], lock: LOCK_CTRL, body: function () { return c.empty({ title: 'Not bound to this tenant', why: 'This tenant has no regulation with that id at any version.', action: { label: 'Open the regulations', href: '#/assurance/regulations' }, icon: 'scale' }); } });
    }
    var ci = Math.max(1, Math.min(r.clauses.length, parseInt(q.clause, 10) || 1)), cl = r.clauses[ci - 1];
    var clauseTbl = c.table({ caption: 'Clauses', columns: [
      { key: 'ref', label: 'clause_ref', render: function (x) { return '<a class="e1-mono" href="' + esc(E1.href('/assurance/regulations/' + r.id, { clause: x.i })) + '">' + esc(x.ref) + '</a>' + (x.i === ci ? ' <span class="e1-caption e1-muted">(traced below)</span>' : ''); } },
      { key: 'text', label: 'clause_text — quoted', render: function (x) { return x.text ? '<q>' + esc(x.text) + '</q>' : '<span class="e1-tone--warning">' + c.icon('alert', 12) + ' Not yet quoted</span><div class="e1-caption e1-muted">A blank is a validation failure, never a draft state (L0-R01).</div>'; } },
      { key: 'kind', label: 'obligation_kind', mono: true }, { key: 'sev', label: 'Severity', mono: true },
      { key: 'd', label: 'Disposition', render: function (x) { return c.badge(DISP[x.disp][0], DISP[x.disp][1]) + (x.adr ? '<div class="e1-caption e1-mono">' + esc(x.adr) + '</div>' : '') + (x.reason ? '<div class="e1-caption e1-muted">' + esc(x.reason) + '</div>' : '') + (x.would ? '<div class="e1-caption e1-muted">' + esc(x.would) + '</div>' : ''); } },
      { key: 'ct', label: 'expects_controls', render: function (x) { return x.controls.length ? x.controls.map(function (id) { return '<a class="e1-mono" href="#/assurance/controls/' + esc(id) + '">' + esc(id) + '@1</a>'; }).join(', ') : '—'; } },
      { key: 'ch', label: 'check_ids', mono: true, render: function (x) { return esc(x.checks); } }
    ], rows: r.clauses.map(function (x, i) { return Object.assign({ i: i + 1 }, x); }) });
    return screen({
      L: 'L2', q: q, title: r.regime, lead: r.instrument, eyebrow: r.id + ' v' + r.v, back: ['Regulations', '#/assurance/regulations'], lock: LOCK_CTRL,
      actions: c.button('Validate', { icon: 'check', attrs: 'data-action="ae-validate-reg" data-value="' + esc(r.id) + '"' }) + c.button('Simulate', { icon: 'play', attrs: 'data-action="ae-simulate-reg" data-value="' + esc(r.id) + '"' }) +
        (r.status === 'draft' ? c.button('Submit for certification', { kind: 'primary', icon: 'gate', attrs: 'data-action="ae-certify" data-value="' + esc(r.id) + '"' }) : ''),
      metaHtml: '<span class="ae-lvtag">' + c.level('L2') + '<span>Level 2 Attested</span></span>' + c.badge(PSTAT[r.status], r.status) + '<span>' + esc(r.issuer + ' · ' + r.jur) + '</span><span class="e1-mono">rule_as_at ' + esc(r.ruleAsAt) + ' · in force ' + esc(r.inForce) + '</span><span>' + esc(r.certifier ? 'Author ' + r.author + ' · certifier ' + r.certifier : 'Author ' + r.author + ' · no certifier yet') + '</span>',
      body: function () {
        return (r.applies ? '' : c.callout({ kind: 'caveat', title: 'Not applicable to this tenant', body: '<p>' + esc(r.applyNote) + '</p>' })) +
          c.callout({ kind: 'rule', title: 'Does not establish', body: '<p>' + esc(r.doesNot) + '</p>' }) +
          sec('clauses', 'Clauses', clauseTbl) +
          sec('trace', 'Five-link chain — ' + cl.ref, trace(r, cl) + '<p class="e1-caption e1-muted ae-mt-s">Each link is resolved by name and version, or the row is not bound and says so. A control that cannot name its gate is prose.</p>', { lead: 'Clause → control → gate → write type → proof field.' }) +
          sec('windows', 'Profile windows', r.windows.length ? c.table({ caption: 'Which profile version judges which records', columns: [{ key: 'v', label: 'Profile version', mono: true }, { key: 'from', label: 'applies_to_records_from', mono: true }, { key: 'to', label: 'applies_to_records_to', mono: true }, { key: 'count', label: 'Records in window', align: 'right', mono: true, render: function (x) { return esc(num(x.count)); } }], rows: r.windows }) + '<p class="e1-caption e1-muted ae-mt-s">A record is judged by the profile version whose window covers its recorded_at, and by no other. A change that would judge records by a rule that did not exist when they were written is refused.</p>'
            : c.empty({ compact: true, title: 'No certified profile window yet', why: 'Records are judged only under a certified profile version. This regulation has none.' }));
      }
    });
  }

  E1.route('/assurance/controls', { title: 'Controls', layout: 'console', door: 'assurance', section: 'controls', crumbs: CR, keywords: 'controls operated throughout test clause gate', render: controlsScreen });
  E1.route('/assurance/controls/:id', { title: function (p) { return p.id; }, layout: 'console', door: 'assurance', section: 'controls', crumbs: CR.concat([['Controls', '#/assurance/controls']]), example: '/assurance/controls/C-AT-01', render: controlDetail });
  E1.route('/assurance/regulations', { title: 'Regulations', layout: 'console', door: 'assurance', section: 'controls', crumbs: CR, keywords: 'regulation clause mca gst dpdp rbi sebi five-link trace', render: regulationsScreen });
  E1.route('/assurance/regulations/:id', { title: function (p) { var r = regById(p.id); return r ? r.id : 'Regulation'; }, layout: 'console', door: 'assurance', section: 'controls', crumbs: CR.concat([['Regulations', '#/assurance/regulations']]), example: '/assurance/regulations/in-mca-audit-trail', keywords: 'clause trace proof field', render: regulationDetail });

  /* ===========================================================================
     LEVEL 3 PREVIEWS — action receipts (E22, E25), counterparties, selective disclosure (E23)
     =========================================================================== */
  var LOCK_L3 = { why: 'Cross-organisation verification and selective disclosure arrive at Level 3 Proven, which begins only when an auditor who does not work for us has accepted a Level 2 bundle in a real engagement and said so in writing.', items: ['A receipt a counterparty checks without trusting your vendor or theirs', 'Disclosure field by field, without revealing the payload', 'A counterparty register with pinned fingerprints'] };
  D.sdFields = [
    { n: 'invoice_no', cls: 'internal' }, { n: 'posting_date', cls: 'internal' }, { n: 'due_date', cls: 'internal' }, { n: 'customer', cls: 'confidential' },
    { n: 'customer_gstin', cls: 'confidential' }, { n: 'grand_total', cls: 'confidential' }, { n: 'tax_amount', cls: 'confidential' }, { n: 'items_count', cls: 'internal' },
    { n: 'payment_terms', cls: 'internal', low: true }, { n: 'credit_limit_satisfied', cls: 'internal', low: true }, { n: 'contact_mobile', cls: 'personal' }
  ];
  D.sdProfiles = [
    { id: 'auditor-statutory', kind: 'auditor', fields: ['invoice_no', 'posting_date', 'grand_total'], why: 'The statutory auditor needs to tie each record to a ledger entry by number, date and amount, and nothing about the customer.' },
    { id: 'lender-working-capital', kind: 'lender', fields: ['invoice_no', 'customer', 'grand_total', 'due_date', 'credit_limit_satisfied'], why: 'The lender finances receivables and needs the debtor, the amount, the due date and whether the credit limit held — not tax detail.' },
    { id: 'counterparty-invoice', kind: 'counterparty', fields: ['invoice_no', 'posting_date', 'grand_total'], why: 'The customer checks that the invoice they received is the one we recorded: number, date and amount only.' },
    { id: 'internal-review', kind: 'internal', fields: ['invoice_no', 'posting_date', 'due_date', 'customer', 'customer_gstin', 'grand_total', 'tax_amount', 'items_count', 'payment_terms', 'credit_limit_satisfied', 'contact_mobile'], why: 'Internal review of every committed field.', lint: 'S15 — a whole-set profile reveals everything; is that what you meant?' }
  ];
  D.receipts = [
    { id: 'AR-2028-0412', dir: 'issued', seq: 118204, wt: 'erp.sales_invoice.submit', outcome: 'committed', object: 'SINV-2028-04412', amount: 2764300, audience: 'ar-org:acmetextiles.example', aName: 'ACME Textiles', disclosed: ['invoice_no', 'posting_date', 'grand_total'], values: { invoice_no: 'SINV-2028-04412', posting_date: '2028-09-24', grand_total: '27,64,300.00' }, key: KEY2.id, anchored: 'b_20280924_1000_7c1e', gen: '2028-09-24T10:00:03Z', expires: '2028-10-01T10:04:12Z', issuedRec: 118209, at: '2028-09-24T10:04:12Z', bound: 'Bound at ACME Textiles record #8,902', route: 'Pinned fingerprint', actor: 'ar-agent', actorKind: 'agent', A: 'A3' },
    { id: 'AR-2028-0413', dir: 'issued', seq: 118236, wt: 'erp.sales_invoice.submit', outcome: 'refused', code: 'GATE.PRECONDITION_FAILED', object: 'Attempted invoice · ACME Textiles', amount: null, audience: 'ar-org:acmetextiles.example', aName: 'ACME Textiles', disclosed: ['invoice_no', 'credit_limit_satisfied'], values: { invoice_no: 'SINV-DRAFT-04419', credit_limit_satisfied: 'false' }, key: KEY2.id, anchored: 'b_20280924_1030_7c1e', gen: '2028-09-24T10:30:02Z', expires: '2028-10-01T10:41:00Z', issuedRec: 118241, at: '2028-09-24T10:41:00Z', bound: 'Not bound yet', route: 'Pinned fingerprint', actor: 'ar-agent', actorKind: 'agent', A: 'A3' },
    { id: 'AR-2028-0409', dir: 'issued', seq: 117480, wt: 'erp.payment_entry.submit', outcome: 'committed', object: 'PE-2028-03310', amount: 812400, audience: 'ar-org:suryaauto.example', aName: 'Surya Auto Components', disclosed: ['invoice_no', 'grand_total', 'due_date', 'customer'], values: { invoice_no: 'PINV-2028-01876', grand_total: '8,12,400.00', due_date: '2028-09-30', customer: 'Surya Auto Components Pvt Ltd' }, key: KEY2.id, anchored: 'b_20280919_1415_7c1e', gen: '2028-09-19T14:15:02Z', expires: '2028-09-26T14:20:00Z', issuedRec: 117486, at: '2028-09-19T14:20:00Z', bound: 'Bound at Surya Auto record #22,140', route: 'Key document', actor: 'bank-recon-agent', actorKind: 'agent', A: 'A3', expired: true },
    { id: 'AR-2028-0415', dir: 'issued', seq: 118311, wt: 'erp.sales_invoice.submit', outcome: 'committed', object: 'SINV-2028-04431', amount: 486000, audience: 'ar-org:acmetextiles.example', aName: 'ACME Textiles', disclosed: ['invoice_no', 'posting_date', 'grand_total'], values: { invoice_no: 'SINV-2028-04431', posting_date: '2028-09-24', grand_total: '4,86,000.00' }, key: KEY2.id, anchored: null, gen: null, expires: '2028-10-01T11:02:00Z', issuedRec: 118313, at: '2028-09-24T11:02:00Z', bound: 'Not bound yet', route: 'Pinned fingerprint', actor: 'Invoice Agent', actorKind: 'agent', A: 'A2' },
    { id: 'RR-2028-0077', dir: 'received', seq: 22140, wt: 'sup.payment.advice', outcome: 'committed', object: 'Payment advice · UTR 518822', amount: 812400, issuer: 'ar-org:suryaauto.example', iName: 'Surya Auto Components', verdict: 'PASS', disclosed: ['utr', 'amount', 'value_date', 'invoice_ref'], total: 9, route: 'Key document', routeLine: 'Accepted on a key document fetched four minutes ago', binding: 'Bound at record #1,17,660', at: '2028-09-19T15:02:00Z' },
    { id: 'RR-2028-0078', dir: 'received', seq: 8902, wt: 'cus.invoice.accept', outcome: 'committed', object: 'Acceptance of SINV-2028-04412', amount: 2764300, issuer: 'ar-org:acmetextiles.example', iName: 'ACME Textiles', verdict: 'PASS', disclosed: ['invoice_no', 'amount', 'accepted_on'], total: 7, route: 'Pinned fingerprint', routeLine: 'Accepted on a pinned fingerprint since March 2028', binding: 'Not bound', at: '2028-09-24T12:15:00Z' },
    { id: 'RR-2028-0079', dir: 'received', seq: 4410, wt: 'lsp.delivery.confirm', outcome: 'committed', object: 'Delivery confirmation', amount: null, issuer: 'ar-org:deccanfreight.example', iName: 'Deccan Freight', verdict: 'GATE.COUNTERPARTY_UNKNOWN', disclosed: [], total: 6, route: '—', routeLine: 'Issuer not in the register', binding: 'Refused · GATE.COUNTERPARTY_UNKNOWN', at: '2028-09-23T09:40:00Z' },
    { id: 'RR-2028-0080', dir: 'received', seq: 22188, wt: 'sup.credit_note.issue', outcome: 'committed', object: 'Credit note CN-SA-0912', amount: 64200, issuer: 'ar-org:suryaauto.example', iName: 'Surya Auto Components', verdict: 'POLICY.RECEIPT_UNVERIFIED', disclosed: ['amount'], total: 9, route: 'Key document', routeLine: 'Digest mismatch on F14 — forensic, not commercial', binding: 'Refused · POLICY.RECEIPT_UNVERIFIED', at: '2028-09-22T16:05:00Z' },
    { id: 'RR-2028-0081', dir: 'received', seq: 8811, wt: 'cus.po.issue', outcome: 'committed', object: 'Purchase order ACME-PO-7781', amount: 1920000, issuer: 'ar-org:acmetextiles.example', iName: 'ACME Textiles', verdict: 'POLICY.RECEIPT_EXPIRED', disclosed: ['po_no', 'amount'], total: 8, route: 'Pinned fingerprint', routeLine: 'Past expires_at by 2 days', binding: 'Refused · POLICY.RECEIPT_EXPIRED', at: '2028-09-20T08:00:00Z' }
  ];
  D.counterparties = [
    { org: 'ar-org:acmetextiles.example', name: 'ACME Textiles', status: 'active', route: 'Pinned fingerprint', fp: 'SHA256:9f2c…a41e', keys: 'acm_in_20280301_1a0c · 2028-03-01 → —', first: '2028-03-04', last: '2028-09-24T12:15:00Z', line: 'Accepted on a pinned fingerprint since March 2028', issued: 14, received: 9 },
    { org: 'ar-org:suryaauto.example', name: 'Surya Auto Components', status: 'active', route: 'Key document', fp: 'SHA256:4e71…09bd', keys: 'sa_in_20280601_77f3 · 2028-06-01 → —', first: '2028-06-11', last: '2028-09-24T10:32:00Z', line: 'Accepted on a key document fetched four minutes ago', issued: 6, received: 11 },
    { org: 'ar-org:coimbatorecastings.example', name: 'Coimbatore Castings Pvt Ltd', status: 'active', route: 'Pinned fingerprint', fp: 'SHA256:c0de…3b52', keys: 'cc_in_20280815_4a19 · 2028-08-15 → —', first: '2028-09-02', last: null, line: 'Registered — no receipt exchanged yet', issued: 0, received: 0, isNew: true },
    { org: 'ar-org:deccanfreight.example', name: 'Deccan Freight', status: 'unknown', route: '—', fp: '—', keys: '—', first: '2028-09-23', last: null, line: 'GATE.COUNTERPARTY_UNKNOWN — register under your own due diligence first', issued: 0, received: 1 },
    { org: 'ar-org:[redacted].example', name: '[redacted]', status: 'sanctioned', route: '—', fp: '—', keys: '—', first: '2028-07-30', last: null, line: 'On a sanctions list. Never overridable — escalate to compliance', issued: 0, received: 0 }
  ];
  D.disclosures = [
    { at: '2028-09-24T10:04:12Z', kind: 'counterparty', profile: 'counterparty-invoice', range: 'seq 1,18,204 (receipt AR-2028-0412)', fields: ['invoice_no', 'posting_date', 'grand_total'], by: 'Venkat Raman', rec: 118209, digest: dg('b41f', '9c07') },
    { at: '2028-09-10T07:30:00Z', kind: 'lender', profile: 'lender-working-capital', range: 'seq 98,001–1,12,480', fields: ['invoice_no', 'customer', 'grand_total', 'due_date', 'credit_limit_satisfied'], by: 'Ravi Shankar', rec: 112611, digest: dg('77a0', '1e5c') },
    { at: '2028-09-03T05:45:00Z', kind: 'auditor', profile: 'auditor-statutory', range: 'seq 98,001–1,10,480', fields: ['invoice_no', 'posting_date', 'grand_total'], by: 'Venkat Raman', rec: 110502, digest: dg('3d19', 'aa04') }
  ];
  var SD_LIMITS = [
    ['Disclosure hides values, not shape.', 'F01–F16 are always fully disclosed. Tenant, sequence, write type, actor kind, autonomy level and time travel with every record.'],
    ['A low-entropy field is guessable.', 'Commitment is not encryption. A recipient who knows a field has four possible values can test all four against the commitment.'],
    ['Undisclosed does not mean unknowable.', 'The same small-valued field committed in many records is still a single guess away. The mitigation is declaration design, not cryptography.'],
    ['No predicate proofs.', 'We cannot prove “under the limit” without revealing the number, or committing the answer as its own field at write time.'],
    ['No unlinkability.', 'Two receipts from one tenant are linkable, always.'],
    ['Pre-boundary records are not disclosable.', 'Records under elan1_lp_v1 commit the payload as a whole. This is permanent for those records.'],
    ['We still hold the salts,', 'unless the tenant holds their own keys and salt store. Until then “we cannot see your data” remains a sentence we may not say.'],
    ['A disclosure is irrevocable.', 'Once a field’s salt and value are handed over, they are known. The export record exists so that at least the fact of the disclosure is not deniable.']
  ];
  function rcById(id) { for (var i = 0; i < D.receipts.length; i++) if (D.receipts[i].id === id) return D.receipts[i]; return null; }
  var RC_VERDICT = { 'PASS': ['good', 'PASS'], 'GATE.COUNTERPARTY_UNKNOWN': ['neutral', 'Not done · GATE.COUNTERPARTY_UNKNOWN'], 'POLICY.RECEIPT_UNVERIFIED': ['critical', 'POLICY.RECEIPT_UNVERIFIED — forensic'], 'POLICY.RECEIPT_EXPIRED': ['neutral', 'Not done · POLICY.RECEIPT_EXPIRED'] };
  var RECEIVER = [
    ['POLICY.RECEIPT_AUDIENCE_MISMATCH', 'Addressed to another organisation', 'Return it. Do not act on it'],
    ['POLICY.RECEIPT_EXPIRED', 'Past expires_at', 'Ask for a fresh receipt'],
    ['POLICY.TRUST_ANCHOR_UNKNOWN', 'No discovery route resolved', 'Establish the relationship out of band first'],
    ['POLICY.RECEIPT_UNVERIFIED', 'Digest, signature or inclusion path failed', 'Stop. This is forensic, not commercial. Do not negotiate it over email'],
    ['GATE.RECEIPT_REPLAYED', 'Already accepted', 'Treat as the same event, not a second one'],
    ['GATE.COUNTERPARTY_UNKNOWN', 'Issuer not in register', 'Register, under whatever due diligence they already run']
  ];

  function receiptsScreen(p, q) {
    var tab = q.tab === 'received' ? 'received' : 'issued';
    var issued = D.receipts.filter(function (r) { return r.dir === 'issued'; }), received = D.receipts.filter(function (r) { return r.dir === 'received'; });
    var issuedTbl = c.table({ caption: 'Receipts issued', columns: [
      { key: 'id', label: 'Receipt', nowrap: true, render: function (r) { return '<a class="e1-table__link e1-mono" href="#/assurance/receipts/' + esc(r.id) + '">' + esc(r.id) + '</a>'; } },
      { key: 's', label: 'Source record', render: function (r) { return seqA(r.seq) + '<div class="e1-caption e1-mono">' + esc(r.wt) + '</div>'; } },
      { key: 'o', label: 'Outcome', render: function (r) { return c.outcome(r.outcome, { code: r.code }); } },
      { key: 'a', label: 'Audience', render: function (r) { return '<span class="e1-mono">' + esc(r.audience) + '</span>'; } },
      { key: 'd', label: 'Disclosed', render: function (r) { return esc(r.disclosed.length + ' of 11 fields'); } },
      { key: 'k', label: 'key_id', mono: true, render: function (r) { return esc(r.key); } },
      { key: 'an', label: 'Anchor', render: function (r) { return r.anchored ? c.badge('good', 'Anchored', { subtle: true }) : c.badge('neutral', 'unanchored — stated in the receipt', { icon: 'clock' }); } },
      { key: 'e', label: 'Expires', render: function (r) { return r.expired ? '<span class="e1-muted">Expired ' + esc(day(r.expires)) + '</span>' : esc(ist(r.expires)); } },
      { key: 'b', label: 'Binding', render: function (r) { return '<span class="e1-caption">' + esc(r.bound) + '</span>'; } },
      { key: 'rec', label: 'Issued at', render: function (r) { return seqA(r.issuedRec); } }
    ], rows: issued, rowHref: function (r) { return '#/assurance/receipts/' + r.id; }, empty: { title: 'No receipts issued', why: 'A receipt lets a counterparty check one write without trusting your vendor or theirs.', fill: 'Issue one from any signed record whose write type names a counterparty.', action: { label: 'Counterparty register', href: '#/assurance/counterparties' } } });
    var receivedTbl = c.table({ caption: 'Receipts received', columns: [
      { key: 'id', label: 'Receipt', nowrap: true, render: function (r) { return '<a class="e1-table__link e1-mono" href="#/assurance/receipts/' + esc(r.id) + '">' + esc(r.id) + '</a>'; } },
      { key: 'i', label: 'Issuer', render: function (r) { return esc(r.iName) + '<div class="e1-caption e1-mono">' + esc(r.issuer) + '</div>'; } },
      { key: 'ob', label: 'What it records', render: function (r) { return esc(r.object) + '<div class="e1-caption e1-mono">' + esc(r.wt) + ' · issuer ' + esc(sq(r.seq)) + '</div>'; } },
      { key: 'v', label: 'Verdict', render: function (r) { var v = RC_VERDICT[r.verdict]; return c.badge(v[0], v[1]); } },
      { key: 'r', label: 'Discovery route', render: function (r) { return '<span class="e1-caption">' + esc(r.routeLine) + '</span>'; } },
      { key: 'd', label: 'Disclosed', render: function (r) { return esc(r.disclosed.length + ' of ' + r.total + ' — ' + (r.total - r.disclosed.length) + ' withheld'); } },
      { key: 'b', label: 'Binding', render: function (r) { return r.binding === 'Not bound' && r.verdict === 'PASS' ? c.button('Bind into our chain', { size: 'sm', kind: 'gate', attrs: 'data-action="ae-bind-receipt" data-value="' + esc(r.id) + '"' }) : '<span class="e1-caption">' + esc(r.binding) + '</span>'; } }
    ], rows: received, rowHref: function (r) { return '#/assurance/receipts/' + r.id; }, empty: { title: 'No receipts received', why: 'Receipts arrive by whatever channel your counterparty uses — email, an EDI drop — and you verify them here. We never deliver them.' } });
    var members = c.table({ caption: 'action-receipt/1 members', dense: true, columns: [{ key: 'm', label: 'Member', mono: true }, { key: 'c', label: 'Contents' }, { key: 'l', label: 'Level', mono: true }], rows: [
      { m: 'format · seal_suite', c: 'action-receipt/1 · elan1-seal-v6', l: 'all' }, { m: 'sealed_fields · digest', c: 'F01–F16, SHA-256 — a refusal carries zeroes, not omissions', l: 'all' },
      { m: 'signature · key_id', c: 'Pure Ed25519; an identifier, never a key', l: 'CL-2' }, { m: 'anchor', c: 'rfc3161-6962: path, root, leaf count, token', l: 'CL-3' },
      { m: 'audience · nonce · expires_at', c: 'The envelope, signed separately from the record', l: 'CL-4' }, { m: 'disclosure_suite · disclosures', c: 'elan1-sd-v1: per-field openings', l: 'CL-D' },
      { m: 'issuer · limits', c: 'ar-org:<domain>; the producer’s limits statement, verbatim', l: 'all' }] });
    return screen({
      L: 'L3', q: q, path: '/assurance/receipts', title: 'Action receipts',
      lead: 'One record, one signature, one anchor — a receipt a counterparty can check without trusting your vendor or theirs.',
      actions: c.button('Issue receipt', { kind: 'primary', icon: 'send', attrs: 'data-action="ae-issue-receipt"' }) + c.button('Verify a receipt', { icon: 'upload', attrs: 'data-action="ae-verify-receipt"' }),
      states: [{ id: 'empty', label: 'Empty' }], lock: LOCK_L3,
      stateBody: function (s) { return s === 'empty' ? c.empty({ title: 'No receipts issued', why: 'A receipt lets a counterparty check one write without trusting your vendor or theirs.', fill: 'Issue one from any signed record whose write type names a counterparty.', action: [{ label: 'Issue receipt', href: '#/assurance/receipts' }, { label: 'Counterparty register', href: '#/assurance/counterparties' }], icon: 'send' }) : null; },
      body: function () {
        return kpis([{ label: 'Issued this month', value: String(issued.length), note: 'One is a refusal — same template' }, { label: 'Received this month', value: String(received.length), note: '2 refused, 1 forensic' }, { label: 'Your conformance', value: 'CL-2 · CL-3 · CL-4 · CL-D', note: 'Self-asserted with a published vector run' }, { label: 'Counterparties', value: String(D.counterparties.filter(function (x) { return x.status === 'active'; }).length), note: 'Active in the register', href: '#/assurance/counterparties' }]) +
          '<div class="ae-mt">' + c.tabs([{ id: 'issued', label: 'Issued', href: E1.href('/assurance/receipts', { tab: 'issued' }), count: issued.length }, { id: 'received', label: 'Received', href: E1.href('/assurance/receipts', { tab: 'received' }), count: received.length }], tab) + '</div>' +
          '<div class="ae-mt">' + (tab === 'issued' ? issuedTbl : receivedTbl + sec('codes', 'When a received receipt is refused', c.table({ caption: 'Receiver refusal codes', columns: [{ key: 'c', label: 'Code', mono: true }, { key: 'm', label: 'Means' }, { key: 'd', label: 'Receiver does' }], rows: RECEIVER.map(function (x) { return { c: x[0], m: x[1], d: x[2] }; }) }) + '<p class="e1-caption e1-muted ae-mt-s">GATE.COUNTERPARTY_SANCTIONED is never overridable; escalate to compliance. There is no “degraded verification mode” — a receipt verifies or it does not.</p>')) + '</div>' +
          '<div class="ae-two ae-mt">' + sec('std', 'The standard fields', members) + sec('limits', 'What every receipt says about itself', limitsBlock(RECEIPT_LIMITS, 'The limits line, printed on every receipt and in every verification report.') + '<p class="e1-caption e1-muted ae-mt">A receipt attests only a call that was made. A producer that records fabricated events faithfully produces faithful receipts of fabricated events.</p>') + '</div>';
      }
    });
  }

  function receiptDetail(p, q) {
    var r = rcById(p.id);
    if (!r) {
      return screen({ L: 'L3', q: q, title: 'No receipt ' + p.id, lead: 'Receipt ids start AR- for issued and RR- for received.', back: ['Action receipts', '#/assurance/receipts'], lock: LOCK_L3, body: function () { return c.empty({ title: 'Not in this tenant’s receipts', why: 'We do not deliver or store other organisations’ receipts; if you hold the file, verify it and it will appear here.', action: { label: 'Action receipts', href: '#/assurance/receipts' }, icon: 'send' }); } });
    }
    var issued = r.dir === 'issued', refused = r.outcome === 'refused';
    var digest = dg(hx(r.id, 4), hx(r.id + 'z', 4), r.id + 'digest');
    var sixteen = [
      ['F01', D.tenant.id], ['F02', String(r.seq)], ['F03', dg(hx(r.id + 'p', 4), '', r.id + 'prev')], ['F04', uuid(r.id + 'w')], ['F05', r.wt], ['F06', uuid('erp.ar')], ['F07', '19'], ['F08', '18'],
      ['F09', uuid(r.actor || r.issuer)], ['F10', r.actorKind || 'agent'], ['F11', (r.A || 'A2') + ' (encoded ' + String(r.A || 'A2').slice(1) + ')'], ['F12', refused ? ZERO_UUID + ' (refusal)' : uuid(r.id + 'rec')], ['F13', refused ? '0 (refusal)' : '1'],
      ['F14', dg(hx(r.id + 'f14', 4), '', r.id + 'payload')], ['F15', dg('9b0e', '', 'lexicon-2028-09')], ['F16', r.at.replace(/:\d\dZ$/, function (m) { return m; })]
    ];
    var steps = [
      ['Parse format', 'action-receipt/1', 'passed'], ['Resolve seal_suite, anchor_suite, disclosure_suite', 'elan1-seal-v6 · rfc3161-6962 · elan1-sd-v1', 'passed'],
      ['Check audience', issued ? r.audience : 'ar-org:kaverispinning.example', 'passed'], ['Check expires_at', r.expires ? r.expires : '—', r.verdict === 'POLICY.RECEIPT_EXPIRED' ? 'EXPIRED' : 'passed'],
      ['Reconstruct the preimage and compute the digest', 'sixteen fields, 329-octet form', r.verdict === 'POLICY.RECEIPT_UNVERIFIED' ? 'FAIL_INTEGRITY — F14' : 'passed'],
      ['Resolve the issuer’s key by a configured route', issued ? r.route : (r.route || '—'), r.verdict === 'GATE.COUNTERPARTY_UNKNOWN' ? 'TRUST_ANCHOR_UNKNOWN' : 'passed'],
      ['Check the key window covers recorded_at', 'k_in_20280701_b21f · 2028-07-01 → —', 'passed'], ['Verify the record signature', 'Ed25519, pure', 'passed'],
      ['Verify the envelope signature', 'digest ‖ audience ‖ nonce ‖ expires_at', 'passed'], ['Verify the anchor', r.anchored ? 'inclusion path → root → token time before now' : 'no anchor at issue', r.anchored || !issued ? 'passed' : 'UNANCHORED — reported, not failed'],
      ['Recompute each disclosed field commitment', (r.disclosed.length) + ' disclosed · ' + ((issued ? 11 : r.total) - r.disclosed.length) + ' withheld', 'passed'], ['Check the nonce against the seen-set', '128-bit nonce', 'passed'], ['Emit the report', 'claim echo, verdict, route, counts, limits verbatim', 'passed']
    ];
    var stepTone = function (s) { return s === 'passed' ? c.badge('good', 'passed') : /FAIL/.test(s) ? c.badge('critical', s) : /UNANCHORED/.test(s) ? c.badge('info', s) : c.badge('neutral', s); };
    var total = issued ? 11 : r.total;
    var card = '<article class="ae-rcpt__card" aria-label="Receipt ' + esc(r.id) + '">' +
      '<div class="ae-rcpt__top"><div class="ae-rcpt__issuer"><div><p class="e1-label">' + (issued ? 'Issued by' : 'Issued to you by') + '</p><p class="e1-strong" style="margin:2px 0 0">' + esc(issued ? D.tenant.name : r.iName) + '</p><p class="e1-caption e1-mono e1-muted" style="margin:0">' + esc(issued ? D.tenant.org : r.issuer) + '</p></div>' + c.outcome(r.outcome, { code: r.code }) + '</div>' +
      '<p class="e1-label">' + (refused ? 'Not done — nothing was written' : 'Receipt for a governed write') + '</p>' +
      '<p class="ae-rcpt__amt">' + (r.amount && (r.disclosed.indexOf('grand_total') >= 0 || r.disclosed.indexOf('amount') >= 0) ? esc(F.inr(r.amount)) : refused ? '₹0 metered' : '<span class="e1-muted">Amount withheld</span>') + '</p>' +
      '<p class="ae-rcpt__sub">' + esc(r.object) + '</p></div>' +
      '<div class="ae-rcpt__rows">' + [
        ['Write type', '<span class="e1-mono">' + esc(r.wt) + '</span>'], ['Record', issued ? seqA(r.seq) : mono('issuer ' + sq(r.seq))], ['Recorded at', mono(r.at)],
        [issued ? 'Audience' : 'Addressed to', mono(issued ? r.audience : 'ar-org:kaverispinning.example')], ['Expires', mono(r.expires || '—')],
        ['Disclosed', esc(r.disclosed.length + ' of ' + total + ' fields — ' + (total - r.disclosed.length) + ' withheld')], ['Anchored', r.anchored || !issued ? esc(r.anchored ? 'Yes · ' + r.gen : 'Yes') : esc('unanchored at issue — the receipt says so')],
        [issued ? 'Binding' : 'Binding', esc(issued ? r.bound : r.binding)]
      ].map(function (x) { return '<div class="ae-rcpt__row"><span>' + esc(x[0]) + '</span><span>' + x[1] + '</span></div>'; }).join('') + '</div>' +
      '<div class="ae-rcpt__foot">' + esc(RECEIPT_LIMITS) + '</div></article>';
    var logRows = [
      ['format', 'action-receipt/1'], ['seal_suite', 'elan1-seal-v6'], ['digest', digest], ['signature', hx(r.id + 'sig', 64) + hx(r.id + 'sig2', 64)], ['key_id', issued ? r.key : 'published by ' + r.issuer],
      ['anchor.suite', r.anchored || !issued ? 'rfc3161-6962' : '— (unanchored)'], ['anchor.root', r.anchored ? dg(hx(r.anchored, 4), '', r.anchored) : '—', true], ['anchor.leaf_count', r.anchored ? '31' : '—', true], ['anchor.path', r.anchored ? '5 sibling digests' : '—', true], ['anchor.token', r.anchored ? 'eMudhra genTime ' + r.gen : '—', true],
      ['issuer', issued ? D.tenant.org : r.issuer], ['audience', issued ? r.audience : 'ar-org:kaverispinning.example'], ['nonce', '0x' + hx(r.id + 'nonce', 32)], ['expires_at', r.expires || '—'],
      ['disclosure_suite', 'elan1-sd-v1'], ['disclosures', r.disclosed.join(', ') || 'none'], ['limits', RECEIPT_LIMITS]
    ];
    var log = '<div class="ae-log" role="table" aria-label="Receipt members">' + logRows.map(function (x) { return '<div class="ae-log__row' + (x[2] ? ' is-sub' : '') + '" role="row"><span class="ae-log__k" role="rowheader">' + esc(x[0]) + '</span><span class="ae-log__v" role="cell">' + esc(x[1]) + '</span></div>'; }).join('') + '</div>';
    var disc = issued ? c.table({ caption: 'Disclosed values with their commitment check', dense: true, columns: [{ key: 'n', label: 'Field', mono: true }, { key: 'v', label: 'Value', mono: true }, { key: 's', label: 'Commitment', html: true }], rows: D.sdFields.map(function (f) { var on = r.disclosed.indexOf(f.n) >= 0; return { n: f.n, v: on ? (r.values[f.n] || '—') : '', s: on ? c.badge('good', 'disclosed · verifies') : c.badge('neutral', 'withheld', { icon: 'eye-off' }) }; }) }) + '<p class="e1-caption e1-muted ae-mt-s">Withheld is not missing, and missing is not altered.</p>' : '';
    return screen({
      L: 'L3', q: q, title: 'Receipt ' + r.id, lead: (issued ? 'Issued to ' + r.aName : 'Received from ' + r.iName) + ' · ' + r.object + (refused ? ' · a refused write gets the same receipt, with zeroes where a committed write has values.' : ''),
      back: ['Action receipts', '#/assurance/receipts'], lock: LOCK_L3,
      actions: c.button('Open dispute', { href: '#/assurance/receipts/' + r.id + '/dispute', icon: 'flag' }) + (issued ? c.button('Download receipt', { kind: 'primary', icon: 'download', attrs: 'data-action="ae-download-receipt" data-value="' + esc(r.id) + '"' }) : c.button('Ask issuer for a reversal receipt', { icon: 'copy', attrs: 'data-copy="Please issue a reversal receipt for ' + esc(r.id) + ' (issuer record ' + esc(sq(r.seq)) + '). We will verify it offline and bind it into our chain." data-copy-label="Request text"' })),
      body: function () {
        var routeLine = issued ? (r.route === 'Pinned fingerprint' ? 'ACME Textiles accepts our key on a pinned fingerprint since March 2028' : 'Surya Auto accepts our key on a key document fetched at verification time') : r.routeLine;
        return (r.verdict === 'POLICY.RECEIPT_UNVERIFIED' ? c.callout({ kind: 'critical', title: 'Stop. This is forensic, not commercial.', body: '<p>The digest over F14 did not verify. Do not negotiate it over email. Capture the exact bytes and open a dispute.</p>' }) : '') +
          '<div class="ae-rcpt">' + card + '<div class="e1-stack">' + c.card({ title: 'Log entry', eyebrow: 'Every member, as the verifier reads it', body: log }) +
          c.card({ title: 'Discovery route', body: '<p class="ae-line">' + esc(routeLine) + '</p><p class="e1-caption e1-muted">A hint inside a receipt is used to look up, never to trust. elan1 never operates a trust anchor.</p>' }) + '</div></div>' +
          sec('steps', 'Thirteen verification steps, in order', c.table({ caption: 'Normative order: cheap, non-cryptographic refusals first', dense: true, columns: [{ key: 'n', label: '#', mono: true, align: 'right' }, { key: 's', label: 'Step' }, { key: 'i', label: 'Input', mono: true }, { key: 'r', label: 'Result', html: true }], rows: steps.map(function (s, i) { return { n: i + 1, s: s[0], i: s[1], r: stepTone(s[2]) }; }) })) +
          sec('sixteen', 'The sixteen sealed fields', c.table({ caption: 'Always shown in full — disclosure hides values, not shape', dense: true, columns: [{ key: 'f', label: 'Field', mono: true }, { key: 'n', label: 'Name', mono: true }, { key: 'p', label: 'Plain name' }, { key: 'v', label: 'Value', mono: true }], rows: sixteen.map(function (x) { return { f: x[0], n: FIELD_NAMES[x[0]], p: FIELD_PLAIN[x[0]], v: x[1] }; }) })) +
          (issued ? sec('disc', 'Disclosed fields', disc) : '') +
          sec('limits', 'Limits', limitsBlock(RECEIPT_LIMITS, 'Carried in the receipt as its limits member and reproduced in every report.'));
      }
    });
  }

  function disputeScreen(p, q) {
    var r = rcById(p.id) || { id: p.id, dir: 'received', iName: 'the other organisation', seq: 0 };
    return screen({
      L: 'L3', q: q, title: 'Dispute ' + r.id, lead: 'Capture the exact bytes, run the published verifier on both sides, and name the failure class. The next move follows from the class.', back: ['Receipt ' + r.id, '#/assurance/receipts/' + r.id], lock: LOCK_L3,
      body: function () {
        return c.callout({ kind: 'rule', title: 'elan1 does not adjudicate between two organisations.', body: '<p>We supply the specification, the verifier and our own records about our own conduct. Any request to declare a counterparty wrong is declined in writing.</p>' }) +
          '<div class="ae-mt">' + c.stepper(['Capture exact bytes', 'Run the published verifier', 'Failure class', 'Next move', 'Bundle request'], 0) + '</div>' +
          '<div class="e1-split ae-mt"><div class="e1-stack">' +
          c.card({ title: '1 · Capture the exact bytes', body: '<label class="ae-drop" for="ae-dsp-file">' + c.icon('upload', 20) + '<span><strong>Choose the receipt file exactly as received</strong></span><span>Not a screenshot, not a forwarded copy. Its SHA-256 is shown before anything else happens.</span><input type="file" id="ae-dsp-file" class="e1-sr"></label><p class="e1-caption ae-mt-s" id="ae-dsp-hash">No file chosen.</p>' }) +
          c.card({ title: '2 · Run the published verifier — both parties', body: c.table({ caption: 'Verifier runs', dense: true, columns: [{ key: 'w', label: 'Who' }, { key: 'v', label: 'Verifier', mono: true }, { key: 'e', label: 'Result', html: true }], rows: [{ w: D.tenant.short, v: 'elan1-verify v2.0.1', e: r.verdict === 'POLICY.RECEIPT_UNVERIFIED' ? c.badge('critical', '1 FAIL_INTEGRITY — F14') : c.badge('neutral', 'Not run yet', { icon: 'minus' }) }, { w: r.iName || 'Counterparty', v: 'their own build', e: c.badge('neutral', 'Awaiting their run', { icon: 'clock' }) }] }) + '<p class="e1-caption e1-muted ae-mt-s">Both runs use a verifier obtained independently. Recomputing a digest with the function that computed it proves nothing.</p>' }) +
          c.card({ title: '3 · Failure class', body: '<fieldset style="border:0;padding:0;margin:0"><legend class="e1-sr">Failure class</legend><div class="e1-stack e1-stack--sm">' +
            c.radio({ name: 'ae-dsp-class', value: 'digest', label: 'Digest mismatch — forensic', note: 'The bytes were altered, or the issuer’s record is not what they sent. Stop; forensics.', checked: r.verdict === 'POLICY.RECEIPT_UNVERIFIED' }) +
            c.radio({ name: 'ae-dsp-class', value: 'signature', label: 'Signature invalid', note: 'A route-2 key-document resolution is the first suspect. Re-resolve out of band.' }) +
            c.radio({ name: 'ae-dsp-class', value: 'path', label: 'Inclusion path invalid', note: 'Ask for the anchors/ member covering the record.' }) +
            c.radio({ name: 'ae-dsp-class', value: 'procedural', label: 'Audience or expiry', note: 'Procedural, not forensic. Ask for a reissue.' }) + '</div></fieldset>' +
            c.field('What you saw, in a sentence', c.textarea({ id: 'ae-dsp-note', rows: 3, placeholder: 'For example: F14 recomputes to 4e2a… against a declared 9c07…' }), { id: 'ae-dsp-note', required: true, help: 'At least 12 characters. Recorded as a governed write in your chain.' }) +
            '<div class="e1-row ae-mt">' + c.button('Record the dispute', { kind: 'primary', icon: 'flag', attrs: 'data-action="ae-dispute-submit"' }) + '</div>' }) +
          '</div><aside class="e1-stack">' + c.card({ title: 'Next moves by class', body: c.kv([['Digest mismatch', 'Forensics. Request the issuer’s bundle over the range.'], ['Signature invalid', 'Re-resolve the key out of band.'], ['Inclusion path invalid', 'Request anchors/ for the batch.'], ['Audience or expiry', 'Ask for a reissue.']], { compact: true }) }) +
          c.card({ title: '5 · Bundle request', body: '<p class="e1-text-body">If the dispute is forensic, ask the issuer for a bundle covering the record. It verifies offline, on your machine.</p>' + c.button('Copy the request text', { size: 'sm', icon: 'copy', attrs: 'data-copy="Please export an evidence bundle covering your record ' + esc(sq(r.seq || 0)) + ' under your installed profile, and send the key fingerprint by a separate channel." data-copy-label="Bundle request"' }) }) + '</aside></div>';
      }
    });
  }

  function counterpartiesScreen(p, q) {
    var ST = { active: ['good', 'Active'], unknown: ['neutral', 'Unknown'], sanctioned: ['critical', 'Sanctioned'] };
    return screen({
      L: 'L3', q: q, path: '/assurance/counterparties', title: 'Counterparties',
      lead: 'Organisations whose receipts you accept, and to whom you issue — each with the route by which you trust their key.',
      actions: c.button('Register counterparty', { kind: 'primary', icon: 'plus', attrs: 'data-action="ae-register-cp"' }) + c.button('Pin fingerprint', { icon: 'fingerprint', attrs: 'data-action="ae-pin-fp"' }),
      states: [{ id: 'empty', label: 'Empty' }], lock: LOCK_L3,
      stateBody: function (s) { return s === 'empty' ? c.empty({ title: 'No counterparties registered', why: 'The counterparty gate refuses any write that names an unregistered counterparty, so register one before issuing or accepting receipts.', action: { label: 'Action receipts', href: '#/assurance/receipts' }, icon: 'building' }) : null; },
      body: function () {
        return c.callout({ kind: 'warning', title: 'Before the first receipt to a new counterparty', body: '<p>Receipts disclose your governed-write volume between them. Anyone holding two receipts from you can see roughly how many writes you made in between — a receiver who gets receipt 1,18,204 in September and 1,34,900 in October knows you made roughly 16,700 governed writes in between. If you cannot accept that for this counterparty, do not issue receipts to them.</p><p>The issue screen asks you to confirm this, once, for every new audience.</p>' }) +
          sec('register', 'Register', c.table({ caption: 'Counterparty register', columns: [
            { key: 'o', label: 'org_id', render: function (r) { return '<span class="e1-mono">' + esc(r.org) + '</span><div class="e1-caption">' + esc(r.name) + '</div>'; } },
            { key: 's', label: 'Status', render: function (r) { return c.badge(ST[r.status][0], ST[r.status][1]) + (r.isNew ? '<div class="e1-caption e1-muted">No receipt yet — warning applies</div>' : ''); } },
            { key: 'r', label: 'Route', render: function (r) { return esc(r.route) + (r.route === 'Pinned fingerprint' ? '<div class="e1-caption e1-muted">Strongest route</div>' : r.route === 'Key document' ? '<div class="e1-caption e1-muted">Moderate — fetched from /.well-known</div>' : ''); } },
            { key: 'k', label: 'Accepted key_ids', mono: true, render: function (r) { return esc(r.keys); } },
            { key: 'f', label: 'Fingerprint', mono: true, render: function (r) { return esc(r.fp); } },
            { key: 'l', label: 'Standing', render: function (r) { return '<span class="e1-caption">' + esc(r.line) + '</span>'; } },
            { key: 'n', label: 'Receipts', align: 'right', mono: true, render: function (r) { return esc(r.issued + ' out · ' + r.received + ' in'); } },
            { key: 'ls', label: 'Last verified', render: function (r) { return r.last ? esc(ist(r.last)) : '<span class="e1-muted">Never</span>'; } }
          ], rows: D.counterparties, empty: { title: 'No counterparties registered', why: 'The counterparty gate refuses any write naming an unregistered counterparty.' } })) +
          sec('routes', 'Discovery routes, in strict order', c.table({ caption: 'How an issuer’s key is found', dense: true, columns: [{ key: 'n', label: '#', mono: true }, { key: 'r', label: 'Route' }, { key: 's', label: 'Strength' }, { key: 'w', label: 'Here' }], rows: [
            { n: 1, r: 'Out-of-band fingerprint, pinned', s: 'Highest', w: 'Shipped' }, { n: 2, r: 'Issuer-published key document at https://<domain>/.well-known/action-receipt-keys', s: 'Moderate', w: 'Shipped' },
            { n: 3, r: 'Trust anchor attestation', s: 'Specified, not operated', w: 'elan1 never operates a trust anchor' }, { n: 4, r: 'In-receipt hint', s: 'None — used to look up, never to trust', w: 'Never a fallback' }] }));
      }
    });
  }

  function disclosuresScreen(p, q) {
    var verdicts = c.table({ caption: 'Withheld is not missing, and missing is not altered', columns: [{ key: 's', label: 'Situation' }, { key: 'e', label: 'Exit', html: true }], rows: [
      { s: 'Required field disclosed and verifies', e: exitBadge('PASS') }, { s: 'Required field not disclosed', e: exitBadge('FAIL_PROFILE') }, { s: 'Disclosed field digest mismatch', e: exitBadge('FAIL_INTEGRITY') + ' <span class="e1-caption">naming record and field</span>' },
      { s: 'disclosures.jsonl referenced but absent', e: exitBadge('INCOMPLETE') }, { s: 'Salt destroyed by erasure', e: exitBadge('PASS — payload unbound') + ' <span class="e1-caption">never a failure</span>' }, { s: 'Field not required and withheld', e: exitBadge('PASS') }, { s: 'A v1 verifier given a v2 bundle', e: exitBadge('UNSUPPORTED') }] });
    return screen({
      L: 'L3', q: q, path: '/assurance/disclosures', title: 'Disclosures',
      lead: 'What you showed to whom, field by field. A disclosure cannot be taken back, so every one is on this list.',
      actions: c.button('New disclosure', { kind: 'primary', icon: 'plus', href: '#/assurance/disclosures/new' }),
      states: [{ id: 'empty', label: 'Empty' }], lock: LOCK_L3,
      stateBody: function (s) { return s === 'empty' ? c.empty({ title: 'Nothing has been disclosed from this tenant', why: 'Every export will appear here with the fields it revealed, because a disclosure cannot be taken back.', action: { label: 'New disclosure', href: '#/assurance/disclosures/new' }, icon: 'eye' }) : null; },
      body: function () {
        return sec('history', 'Disclosure history', c.table({ caption: 'Every disclosure, with the fields it revealed', columns: [
          { key: 'at', label: 'Date', render: function (r) { return esc(ist(r.at)); }, nowrap: true }, { key: 'k', label: 'Recipient kind', render: function (r) { return c.badge('neutral', r.kind, { icon: false }); } },
          { key: 'p', label: 'Disclosure profile', mono: true, render: function (r) { return esc(r.profile); } }, { key: 'r', label: 'Range', mono: true, render: function (r) { return esc(r.range); } },
          { key: 'f', label: 'Revealed', render: function (r) { return '<span class="e1-mono e1-caption">' + esc(r.fields.join(', ')) + '</span><div class="e1-caption">' + esc(r.fields.length + ' of 11 revealed · ' + (11 - r.fields.length) + ' withheld') + '</div>'; } },
          { key: 'd', label: 'Bundle digest', render: function (r) { return c.hash(r.digest, { head: 6, tail: 4 }); } }, { key: 'b', label: 'By', render: function (r) { return esc(r.by); } }, { key: 's', label: 'Record', render: function (r) { return seqA(r.rec); } }
        ], rows: D.disclosures, empty: { title: 'Nothing has been disclosed', why: 'Every export will appear here with the fields it revealed.' } })) +
          sec('profiles', 'Disclosure profiles', c.table({ caption: 'Declared in erp.ar v19, block 6', columns: [{ key: 'id', label: 'Profile', mono: true }, { key: 'kind', label: 'Audience' }, { key: 'f', label: 'Fields', render: function (r) { return '<span class="e1-caption e1-mono">' + esc(r.fields.join(', ')) + '</span><div class="e1-caption">' + r.fields.length + ' of 11</div>'; } }, { key: 'why', label: 'Justification' }, { key: 'l', label: 'Lint', render: function (r) { return r.lint ? c.badge('warning', r.lint) : (r.fields.indexOf('contact_mobile') >= 0 ? '' : '<span class="e1-muted">—</span>'); } }], rows: D.sdProfiles }), { lead: 'A new profile is a new declaration version. Justification is at least 40 characters.' }) +
          '<div class="ae-two">' + sec('hide', 'What disclosure does not hide', '<ol class="ae-list">' + SD_LIMITS.map(function (x) { return '<li><strong>' + esc(x[0]) + '</strong> ' + esc(x[1]) + '</li>'; }).join('') + '</ol>') + sec('verdicts', 'How a verifier reads a redacted bundle', verdicts) + '</div>';
      }
    });
  }

  function disclosureNew(p, q) {
    var prof = q.profile || 'auditor-statutory', sp = D.sdProfiles.filter(function (x) { return x.id === prof; })[0] || D.sdProfiles[0];
    return screen({
      L: 'L3', q: q, title: 'New disclosure', lead: 'Choose a range, a verifier profile and a disclosure profile. You see exactly what is revealed and what stays a commitment before anything is exported.', back: ['Disclosures', '#/assurance/disclosures'], lock: LOCK_L3,
      body: function () {
        var grid = c.table({ caption: 'Committed fields in proof_binding (erp.ar v19)', columns: [
          { key: 'n', label: 'Field', mono: true }, { key: 'c', label: 'Classification', render: function (f) { return f.cls === 'personal' ? c.badge('warning', 'personal', { icon: 'user' }) : esc(f.cls); } },
          { key: 'w', label: 'Note', render: function (f) { return f.low ? '<span class="e1-caption e1-tone--warning">' + c.icon('alert', 12) + ' Low entropy — guessable by trial</span>' : ''; } },
          { key: 't', label: 'Reveal to this recipient', render: function (f) { return c.toggle({ id: 'ae-sd-' + f.n.replace(/[^a-z_]/g, ''), label: 'Reveal ' + f.n, checked: sp.fields.indexOf(f.n) >= 0, attrs: 'data-sd="' + esc(f.n) + '"' }); } }
        ], rows: D.sdFields });
        return '<div class="e1-split"><div class="e1-stack">' +
          c.card({ title: 'Scope', body: '<div class="ae-two">' + c.field('Range', c.input({ id: 'ae-sd-range', value: 'seq 98,001–1,18,480', mono: true }), { id: 'ae-sd-range', help: 'Records from seq 98,001 are committed field by field (elan1_lp_sd_v1).' }) +
            c.field('Verifier profile', c.select({ id: 'ae-sd-vp', options: ['in-mca-audit-trail v1', 'No profile claimed'] }), { id: 'ae-sd-vp' }) + '</div>' +
            c.field('Disclosure profile', c.select({ id: 'ae-sd-prof', options: D.sdProfiles.map(function (x) { return { value: x.id, label: x.id + ' — ' + x.kind }; }), value: sp.id }), { id: 'ae-sd-prof', help: sp.why }) }) +
          c.card({ title: 'The sixteen fields', body: '<p class="e1-text-body" style="margin:0">' + c.icon('lock', 14) + ' F01–F16 are always disclosed in full: tenant, sequence, write type, actor kind, autonomy level and time travel with every record. Gate results are disclosed as a set or not at all. The record salt is never disclosed.</p>' }) +
          c.card({ title: 'Committed fields', body: grid + '<div id="ae-sd-consent" class="ae-mt"></div>' }) +
          '<div class="e1-row">' + c.button('Export with this disclosure', { kind: 'gate', icon: 'package', attrs: 'data-action="ae-disclose-export"' }) + c.button('Cancel', { kind: 'ghost', href: '#/assurance/disclosures' }) + '</div>' +
          '</div><aside class="e1-stack ae-sticky"><div class="ae-hero" style="flex-direction:column;align-items:flex-start">' + '<p class="e1-label">Live</p><p class="ae-hero__big" id="ae-sd-count">You are revealing ' + sp.fields.length + ' of 11 fields</p><p class="e1-caption e1-muted" style="margin:0" id="ae-sd-withheld">' + (11 - sp.fields.length) + ' stay as commitments — withheld, not missing.</p></div>' +
          c.card({ title: 'What the recipient will see', body: '<div id="ae-sd-preview"></div>' }) +
          c.callout({ kind: 'warning', title: 'Pre-boundary records are not disclosable', body: '<p>Records before seq 98,001 commit the payload as a whole (elan1_lp_v1). A range crossing that line is never silently split; you are offered the two sub-ranges.</p>' }) + '</aside></div>';
      }
    });
  }

  /* ===========================================================================
     CERTIFICATION AND REGULATOR ENGAGEMENT (E26), L3 READINESS (E20)
     =========================================================================== */
  function certificationScreen(p, q) {
    var certs = c.table({ caption: 'Certifications — status, date and scope only', columns: [{ key: 's', label: 'Standard' }, { key: 'st', label: 'Status', render: function (r) { return c.badge('neutral', r.st, { icon: 'minus' }); } }, { key: 'd', label: 'Date', mono: true }, { key: 'sc', label: 'Scope' }, { key: 'n', label: 'Note' }], rows: [
      { s: 'ISO/IEC 42001', st: 'Not held', d: '—', sc: '—', n: 'Three process gaps open: impact assessment, internal audit, management review' },
      { s: 'SOC 2 Type I', st: 'Not held', d: '—', sc: '—', n: 'Security mandatory; Processing Integrity is the criterion our product is made of' },
      { s: 'SOC 2 Type II', st: 'Not held', d: '—', sc: '—', n: 'An observation window of 3–12 months [unverified] after readiness' },
      { s: 'ISO/IEC 27001', st: 'Not held', d: '—', sc: '—', n: '—' },
      { s: 'NIST AI RMF', st: 'No assessment', d: '—', sc: '—', n: 'We do not claim a mapping' }] });
    var iso = c.table({ caption: 'ISO/IEC 42001 — what it requires, what we would build, what we already produce', columns: [{ key: 'r', label: 'The standard requires' }, { key: 'b', label: 'We would have to build' }, { key: 'p', label: 'We already produce', render: function (x) { return x.gap ? c.badge('warning', 'Nothing yet. Real gap') : esc(x.p); } }], rows: [
      { r: 'A defined scope and AI policy', b: 'Both, as management-system artefacts', p: 'The scope freezes (L1, L2, L3), dated and versioned' },
      { r: 'Roles, responsibilities and competence', b: 'Named ownership, documented', p: 'owner_role in every declaration; a named author and certifier on every declaration, profile, control and pack' },
      { r: 'AI risk assessment and treatment', b: 'A documented, repeatable process', p: 'The refusal register; blast radius and reversal plan per write type; the five pack gates' },
      { r: 'AI system impact assessment', b: 'A process, applied per system', gap: true },
      { r: 'Human oversight', b: 'Demonstrated, not asserted', p: 'Rung 6, obligations, dual control, and F10/F11 sealed on every record — our strongest area by a distance' },
      { r: 'Logging and traceability', b: 'Records that survive scrutiny', p: 'The hash-chained record, signed at L2, and an offline verifier a third party can run' },
      { r: 'Change management', b: 'Documented and enforced', p: 'Every declaration, profile, control and regulation version is append-only and dual-control certified' },
      { r: 'Internal audit programme', b: 'A programme, on a cycle', gap: true },
      { r: 'Management review', b: 'Recorded, on a cycle', gap: true },
      { r: 'Incident response and corrective action', b: 'Documented and exercised', p: 'Runbooks; the key-compromise procedure; supersede-never-withdraw for defective releases' }] });
    var claims = ['Consequential changes made by an AI agent to a system of record pass through a single governed write path, where versioned rules and declared gates decide, a human approves what must be approved, and the refusals are recorded as carefully as the successes.',
      'Every such decision produces a record in an append-only, hash-chained log; at Assurance Level 2 the record is signed with a key held in the customer’s residency domain and anchored to independent timestamp authorities.',
      'A reviewer can verify those records themselves, offline, on their own machine, using software they did not get from us — and from Phase 4, against a published specification anyone may implement.'];
    var notClaim = c.table({ caption: 'The limits of the claim, handed over unprompted', columns: [{ key: 'a', label: 'We do not claim' }, { key: 'b', label: 'Because' }], rows: [
      { a: 'That a transaction was genuine', b: 'A receipt proves a governed write happened under stated rules. Commercial reality is outside it' },
      { a: 'That the rules were adequate', b: 'We enforce the customer’s declared rules. Whether they are the right rules is the customer’s judgement and yours' },
      { a: 'That the customer’s books are verified', b: 'The record covers writes through the write path. Direct changes in the accounting system are that system’s audit trail' },
      { a: 'That we are certified, accredited or approved', b: 'Until a certificate exists with a date on it, and then only for what it covers' },
      { a: 'That any regulator has accepted this', b: 'No regulator has reviewed a verifier profile. A profile is our reading of an obligation and says so' },
      { a: 'That the record is tamper-proof, immutable, court-ready or legally admissible', b: 'Banned words at every level, permanently. The correct term is tamper-evident' },
      { a: 'That an anchor proves when something happened', b: 'An anchor is an upper bound on time. Existence, form, and no later than — nothing more' },
      { a: 'That we cannot see customer data', b: 'Only true for a customer holding their own keys and salts, and then a fact about that deployment' }] });
    var engage = c.table({ caption: 'Engagement plan — opportunistic, none of it a launch', columns: [{ key: 'a', label: 'Audience' }, { key: 'r', label: 'Route in' }, { key: 's', label: 'Status', render: function (x) { return c.badge(x.t, x.s, { icon: false }); } }], rows: [
      { a: 'Public consultations — SEBI, MeitY, RBI, EU calls for evidence', r: 'A written response, on the record', s: 'Whenever one is open', t: 'neutral' },
      { a: 'A customer’s own supervisor conversation', r: 'The customer leads; we answer technical questions only', s: 'Customer-led, when examined', t: 'neutral' },
      { a: 'Industry bodies and CA institutes', r: 'Working session on the MCA audit-trail reading', s: 'Requested corrections', t: 'info' },
      { a: 'RBI, against FREE-AI (13 Aug 2025)', r: 'Through a regulated customer. Never cold', s: 'Not engaged', t: 'neutral' },
      { a: 'SEBI, against the AI/ML consultation', r: 'Consultation response first', s: 'On a final circular', t: 'neutral' },
      { a: 'EU authorities and notified bodies', r: 'Only through an EU customer', s: 'Not started', t: 'neutral' },
      { a: 'Data Protection Board (DPDP)', r: 'Through a customer, or a consultation', s: '2027 onward', t: 'neutral' },
      { a: 'IRDAI working group', r: 'Watch only', s: 'Not engaged', t: 'neutral' }] });
    return screen({
      L: null, q: q, path: '/assurance/certification', title: 'Certification and regulator engagement',
      lead: 'Where we actually stand, stated first, so nothing below reads as progress we have not made.',
      metaHtml: c.badge('neutral', 'Not certified', { icon: 'minus' }) + '<span>Owned by the founder and the elan1 lead · read-only for tenants</span><span>Level 3 Proven dossier — shown at every level, because an honest “no” is not a feature</span>',
      body: function () {
        return c.callout({ kind: 'caveat', title: 'We hold no certification of any kind.', body: '<p>No SOC 2, no ISO/IEC 27001, no ISO/IEC 42001, no assessment against NIST AI RMF.</p>' }) +
          sec('status', 'Status', certs + '<p class="e1-caption e1-muted ae-mt-s">When a certificate exists this page will say “we hold X, covering Y, issued on Z” — and nothing else. A certificate never appears beside an assurance-level pill.</p>') +
          sec('rule', 'The sequencing decision', c.callout({ kind: 'rule', body: '<p>We certify to the standard the first paying evidence customer’s auditor names, and not before. Indian or European customer, AI governance: ISO/IEC 42001 first. US software buyer, security review: SOC 2 Type I, with a Type II window opened behind it. Never both in parallel. Cost: auditor fees plus surveillance [unverified — obtain three quotes before budgeting].</p>' })) +
          sec('iso', 'ISO/IEC 42001 gap list', iso, { lead: 'Our evidence is unusually strong and our management system barely exists. ISO 42001 certifies the second.' }) +
          sec('claim', 'The regulator-facing claim — three sentences', '<ol class="ae-list">' + claims.map(function (x) { return '<li>' + esc('“' + x + '”') + '</li>'; }).join('') + '</ol><p class="e1-caption e1-muted ae-mt-s">Nothing is claimed to a regulator or a certification body that a verifier cannot demonstrate. Every sentence maps to an exit code, a named artefact or a dated document.</p>') +
          sec('limits', 'What we do not claim', notClaim) +
          sec('selfcheck', 'How a reviewer checks it themselves', '<ol class="ae-list">' + escList(['Obtain the verifier and check its digest against the published SHA256SUMS and release signature.', 'Rebuild it from source with the documented toolchain and compare digests.', 'Read the source: standard library only, empty lockfile, small enough to read in a day.', 'Run it against a bundle, air-gapped, with a key fingerprint from a source other than us.', 'Run it against our published tampered bundle and watch it exit 1 FAIL_INTEGRITY.', 'Write their own verifier from the published specification and vectors. The strongest thing you can do with this is not use our software.']).map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol><div class="e1-row ae-mt">' + c.button('The verifier', { size: 'sm', href: '#/verify' }) + c.button('Tampered bundle', { size: 'sm', kind: 'ghost', href: '#/verify/tampered' }) + c.button('For regulators', { size: 'sm', kind: 'ghost', href: '#/regulators' }) + '</div>') +
          '<div class="ae-two">' + sec('ask', 'What we ask for — none of it approval', '<ol class="ae-list">' + escList(['Tell us where a clause binding is wrong.', 'Tell us what a supervisory reader wants in a report.', 'Tell us whether an open receipt format is useful to supervisory tooling.', 'Give us a named contact for defect reports.']).map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol><p class="e1-caption e1-muted ae-mt-s">Never: an endorsement, a no-objection letter, a listing, a pilot they must justify, a waiver, or any statement we could quote in a sales document.</p>') +
          sec('who', 'Who speaks for us', c.kv([['Any regulator or supervisor meeting', 'The founder, always, with the elan1 lead for technical detail. Nobody else.'], ['A consultation response', 'Drafted by the elan1 lead, signed by the founder'], ['A customer’s examination', 'The customer leads; we answer technical questions only'], ['A defect report from a regulator', 'Acknowledged by the elan1 lead within five working days']], { compact: true }) + '<p class="e1-caption e1-muted ae-mt-s">Every regulator interaction is recorded as a governed write in our own operator chain.</p>') + '</div>' +
          sec('plan', 'Engagement plan', engage);
      }
    });
  }

  function l3Screen(p, q) {
    var entry = c.table({ caption: 'The entry condition — four tests', columns: [{ key: 'n', label: '#', mono: true }, { key: 't', label: 'Test' }, { key: 'e', label: 'Evidence' }, { key: 's', label: 'Status', render: function () { return c.badge('neutral', 'Not met', { icon: 'minus' }); } }], rows: [
      { n: 1, t: 'The auditor ran the offline verifier on their own machine', e: 'Their account of it, in writing we may keep' },
      { n: 2, t: 'They relied on the bundle for a working paper or a finding', e: 'The working paper reference' },
      { n: 3, t: 'They can state, unprompted, what a PASS does not establish', e: 'Their words, recorded (pack test T8)' },
      { n: 4, t: 'They would ask for one again, in writing', e: 'The written statement' }] });
    var DONE = [['The entry condition is met', 'The auditor’s written statement, with all four tests satisfied'], ['A second seal implementation, written by a team with no access to the first’s source, agrees octet for octet on all 64 vectors and a full production chain', 'Empty diff, published with the disagreement log'],
      ['The Action Receipt specification is published under terms that let a competitor implement it, with vectors and a tampered bundle', 'The published artefacts and the licence text'], ['One implementation by an organisation that is not us passes the conformance suite', 'Their name, their result, their permission to cite it — or an honest statement that nobody did'],
      ['Two organisations exchange, accept and verify a receipt in production, each binding it into their own chain', 'The two chains, the two records, the two verifier runs'], ['A redacted bundle verifies, and a verifier reports a field as not disclosed rather than missing', 'The disclosure flows, run by someone outside the team'],
      ['One tenant signs with a key we have never held, and we can show we hold no copy', 'Key ceremony record, plus our own key register showing no entry'], ['At least one non-elan1 counter-signature is in production, under a commercial arrangement', 'The contract and the counter-signed roots'],
      ['An action class has graduated A2 → A3 on recorded evidence, and a separate one has been revoked', 'Both governed writes, with their records'], ['No model is reachable from rungs 3, 4, 5, 6 or 8, and the precedent score replays from the chain alone', 'Import-graph check in CI, plus a replay producing the identical score'],
      ['A regulator-facing reviewer has checked a receipt themselves without our help', 'The reviewer’s own account of it'], ['Every claim in L3 sales material maps to a row in the claim boundary', 'Founder review before any L3 material is issued']];
    var done = c.table({ caption: 'Definition of done — twelve measurements', columns: [{ key: 'n', label: '#', mono: true, align: 'right' }, { key: 'd', label: 'Done means' }, { key: 'h', label: 'How we know' }, { key: 's', label: 'Status', render: function () { return c.badge('neutral', 'Not met', { icon: 'minus' }); } }], rows: DONE.map(function (x, i) { return { n: i + 1, d: x[0], h: x[1] }; }) });
    var caps = [['Cross-organisation verification', '#/assurance/receipts'], ['Selective disclosure', '#/assurance/disclosures'], ['Customer-held keys', '#/agents/keys/signing'], ['Sovereign deployment — a deployment spec, not a proof capability', '#/assurance/residency'], ['Precedent intelligence', '#/agents/autonomy'], ['Earned autonomy A2 → A3', '#/agents/graduation'], ['The Action Receipt standard', '#/standard']];
    return screen({
      L: null, q: q, path: '/assurance/l3', title: 'Level 3 Proven readiness',
      lead: 'Gates, not dates. Level 3 begins on an event — an outside auditor accepts a Level 2 bundle in a real engagement and says so in writing.',
      metaHtml: '<span class="ae-lvtag">' + c.level('L3') + '<span>Level 3 Proven — not started</span></span><span>Every row below reads “Not met”, and says so plainly.</span>',
      body: function () {
        return c.callout({ kind: 'caveat', title: 'L3 has not started.', body: '<p>It begins when an outside auditor has accepted an L2 bundle in a real engagement and said so in writing. Until then elan1 is an L2 business, and says so plainly. No L3 capability is designed, staffed or promised before that — including a slide.</p>' }) +
          sec('frozen', 'What Level 3 means', limitsBlock('At L3 an elan1 action receipt is defined by a public specification, produced by two independent implementations that agree octet for octet, signed by a key the customer may hold themselves, anchored by parties that are not us, verifiable by an organisation that has no relationship with us, disclosable field by field without revealing the payload, and usable after this company has ceased to exist. It still does not prove the transaction was genuine, it still does not prove the rules were adequate, and no regulator has approved it.', 'The frozen sentence for Level 3.')) +
          sec('entry', 'Entry condition', entry, { lead: 'The auditor does not work for us and is not paid by us.' }) +
          sec('done', 'Definition of done', done, { lead: 'Items 1–3 block the level. Items 4, 5 and 8 decide whether “open” and “cross-organisation” are true words. Items 9 and 10 protect the model boundary. Items 11 and 12 keep the claim honest.' }) +
          '<div class="ae-two">' + sec('caps', 'Six capabilities and the standard', '<ul class="ae-list ae-list--plain">' + caps.map(function (x) { return '<li>' + c.icon('lock', 12) + ' <a href="' + x[1] + '">' + esc(x[0]) + '</a></li>'; }).join('') + '</ul><p class="e1-caption e1-muted ae-mt-s">Three conditions: a second independent seal implementation; published vectors including a known-tampered bundle; counter-signature by a party that is not us. L3 adds no new meter and no seventeenth field.</p>') +
          sec('say', 'The claim boundary', '<p class="e1-label">Do not say, at any level</p>' + ulist(escList(['Tamper-proof', 'Court-ready or legally admissible', 'Approved by a regulator', 'Certified — unless a dated certificate exists, and then only for its scope', 'The transaction was genuine', 'Your books are verified', 'The agent is safe because it earned A3', 'We cannot see your data — except as a fact about a customer-held-key deployment', 'Standardised — say published until another organisation’s implementation passes'])) + '<p class="e1-caption e1-muted ae-mt-s">Conformance levels are not merged with assurance levels: L1 produces CL-1 receipts only; L2 produces CL-2 and CL-3; L3 adds CL-4 and CL-D.</p>') + '</div>';
      }
    });
  }

  E1.route('/assurance/receipts', { title: 'Action receipts', layout: 'console', door: 'assurance', section: 'receipts', crumbs: CR, keywords: 'receipt cross-organisation issue verify counterparty l3', render: receiptsScreen });
  E1.route('/assurance/receipts/:id', { title: function (p) { return 'Receipt ' + p.id; }, layout: 'console', door: 'assurance', section: 'receipts', crumbs: CR.concat([['Action receipts', '#/assurance/receipts']]), example: '/assurance/receipts/AR-2028-0412', render: receiptDetail });
  E1.route('/assurance/receipts/:id/dispute', { title: function (p) { return 'Dispute ' + p.id; }, layout: 'console', door: 'assurance', section: 'receipts', crumbs: CR.concat([['Action receipts', '#/assurance/receipts']]), example: '/assurance/receipts/RR-2028-0080/dispute', render: disputeScreen,
    mount: function (el) {
      var f = el.querySelector('#ae-dsp-file'), o = el.querySelector('#ae-dsp-hash');
      if (f && o) f.addEventListener('change', function () { var file = f.files && f.files[0]; o.innerHTML = file ? 'SHA-256 of <strong>' + esc(file.name) + '</strong> (' + esc(num(file.size)) + ' bytes): <code class="e1-mono">' + esc(dg(hx(file.name, 4), hx(file.size, 4), file.name + file.size)) + '</code>' : 'No file chosen.'; });
    } });
  E1.route('/assurance/counterparties', { title: 'Counterparties', layout: 'console', door: 'assurance', section: 'receipts', crumbs: CR.concat([['Action receipts', '#/assurance/receipts']]), keywords: 'counterparty register org_id fingerprint pinned', render: counterpartiesScreen });
  E1.route('/assurance/disclosures', { title: 'Disclosures', layout: 'console', door: 'assurance', section: 'disclosures', crumbs: CR, keywords: 'selective disclosure withheld revealed fields', render: disclosuresScreen });
  E1.route('/assurance/disclosures/new', { title: 'New disclosure', layout: 'console', door: 'assurance', section: 'disclosures', crumbs: CR.concat([['Disclosures', '#/assurance/disclosures']]), keywords: 'disclosure composer reveal fields', render: disclosureNew,
    mount: function (el) {
      if (!E1.atLeast('L3')) return;
      var countEl = el.querySelector('#ae-sd-count'), wEl = el.querySelector('#ae-sd-withheld'), cons = el.querySelector('#ae-sd-consent'), prev = el.querySelector('#ae-sd-preview'), sel = el.querySelector('#ae-sd-prof');
      function upd() {
        var on = Array.prototype.filter.call(el.querySelectorAll('input[data-sd]'), function (i) { return i.checked; }).map(function (i) { return i.getAttribute('data-sd'); });
        var kind = (D.sdProfiles.filter(function (x) { return x.id === sel.value; })[0] || {}).kind;
        countEl.textContent = 'You are revealing ' + on.length + ' of 11 fields';
        wEl.textContent = (11 - on.length) + ' stay as commitments — withheld, not missing.';
        cons.innerHTML = on.indexOf('contact_mobile') >= 0 && kind !== 'internal' ? c.refusal({ code: 'GATE.CONSENT_MISSING', title: 'Not done — a personal field without consent', ruleName: 'Consent', rule: 'contact_mobile is classified personal. It may be revealed to this recipient only with a recorded consent basis.', action: [c.button('Drop this field', { kind: 'primary', attrs: 'data-action="ae-drop-field"' }), c.button('Capture consent', { attrs: 'data-action="ae-capture-consent"' })] }) : '';
        prev.innerHTML = '<ul class="ae-list ae-list--plain" aria-label="Receiver’s view">' + D.sdFields.map(function (f) { var o = on.indexOf(f.n) >= 0; return '<li class="e1-row e1-row--between"><code class="e1-mono">' + esc(f.n) + '</code>' + (o ? c.badge('good', 'Value + salt', { subtle: true, icon: 'eye' }) : c.badge('neutral', 'Withheld', { subtle: true, icon: 'eye-off' })) + '</li>'; }).join('') + '</ul><p class="e1-caption e1-muted ae-mt-s">A revealed value checks against F14. A withheld field is a commitment — never reported as missing.</p>';
      }
      Array.prototype.forEach.call(el.querySelectorAll('input[data-sd]'), function (i) { i.addEventListener('change', upd); });
      if (sel) sel.addEventListener('change', function () { E1.go('/assurance/disclosures/new', { profile: sel.value }); });
      upd();
    } });
  E1.route('/assurance/certification', { title: 'Certification and regulator engagement', layout: 'console', door: 'assurance', section: 'certification', crumbs: CR, keywords: 'iso 42001 soc 2 certification regulator dossier', render: certificationScreen });
  E1.route('/assurance/l3', { title: 'Level 3 Proven readiness', layout: 'console', door: 'assurance', section: 'l3', crumbs: CR, keywords: 'l3 proven readiness entry condition definition of done gates', render: l3Screen });

  /* ===========================================================================
     Interactions (registered once, at load)
     =========================================================================== */
  function main() { return document.getElementById('e1-main') || document; }
  function setFieldError(root, id, msg) {
    var inp = root.querySelector('#' + id); if (!inp) return;
    var field = inp.closest('.e1-field'); inp.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (!field) return;
    var help = field.querySelector('.e1-field__help, .e1-field__error');
    if (msg) {
      field.classList.add('is-invalid');
      var err = document.createElement('p'); err.className = 'e1-field__error'; err.id = id + '-msg'; err.setAttribute('role', 'alert');
      err.innerHTML = c.icon('alert', 12) + '<span>' + esc(msg) + '</span>';
      if (help) help.replaceWith(err); else field.appendChild(err);
      inp.setAttribute('aria-describedby', id + '-msg'); inp.focus();
    } else field.classList.remove('is-invalid');
  }
  function needSentence(root, id, what) {
    var v = ((root.querySelector('#' + id) || {}).value || '').trim();
    if (v.length < 12) { setFieldError(root, id, (what || 'A reason') + ' needs a sentence — at least 12 characters. An honest reason is one a future auditor can read.'); return null; }
    setFieldError(root, id, null); return v;
  }
  function sendTo(opts) {
    var people = [['Arjun Mehta', 'elan1 lead · certifier'], ['Kavya Menon', 'elan1 certifier'], ['Meenakshi Iyer', 'Owner'], ['Ravi Shankar', 'Finance manager']].filter(function (x) { return x[0] !== opts.exclude; });
    return E1.modal({
      eyebrow: opts.eyebrow || 'Dual control', title: opts.title,
      body: '<p class="e1-text-body">' + esc(opts.body) + '</p>' + c.field('Send to', c.select({ id: 'ae-sendto', options: people.map(function (x) { return { value: x[0], label: x[0] + ' — ' + x[1] }; }) }), { id: 'ae-sendto', help: 'People only. The requester cannot approve their own request, and an agent is never an approver.' }),
      actions: [{ label: 'Cancel', kind: 'ghost' }, { label: opts.cta || 'Send for approval', kind: 'gate', onClick: function (e, close, el) {
        var who = (el.querySelector('#ae-sendto') || {}).value; close();
        if (opts.done) opts.done(who);
        E1.toast('Sent to ' + who + '. It waits at Decide until a named person approves or rejects it.', 'info', { title: 'Waiting on a person', action: { label: 'Open Decide', href: '#/work/decide/' + opts.obligation } });
      } }]
    });
  }
  function mark(stage, k, v) {
    var r = rehearsal(); r[stage] = r[stage] || {}; r[stage][k] = v === undefined ? true : v; E1.store.set('ae.rehearsal', r);
  }

  E1.action('ae-stage-do', function (el) {
    var parts = String(el.getAttribute('data-value')).split(':');
    mark(Number(parts[0]), parts[1]);
    E1.toast('Rehearsed. Nothing was signed or written.', 'neutral', { title: 'Stage ' + parts[0] });
    E1.render({ keepScroll: true });
  });
  E1.action('ae-rehearsal-reset', function () { E1.store.set('ae.rehearsal', {}); E1.toast('Rehearsal reset.', 'neutral'); E1.render({ keepScroll: true }); });
  E1.action('ae-replay', function () {
    var m = E1.modal({ eyebrow: 'Stage 0 · rehearsal', title: 'Full-chain replay', dismissable: false, body: '<p class="e1-text-body">Recomputing every preimage and digest from seq 1, in order.</p><div id="ae-rp-bar" class="ae-mt">' + c.progress(0, 41188, { label: 'Records recomputed' }) + '</div>', actions: [{ label: 'Running…', kind: 'secondary', disabled: true }] });
    var n = 0, t = setInterval(function () {
      n = Math.min(41188, n + 6863);
      var box = m.el.querySelector('#ae-rp-bar'); if (box) box.innerHTML = c.progress(n, 41188, { label: 'Records recomputed', state: n === 41188 ? 'good' : undefined });
      if (n === 41188) { clearInterval(t); setTimeout(function () { m.close(); mark(0, 'replay'); E1.toast('continuous, 41,188 records, seq 1–41,188, all 23 write types', 'good', { title: 'Replay complete (worked example)' }); E1.render({ keepScroll: true }); }, 350); }
    }, 220);
  });
  E1.action('ae-request-signing', function () {
    sendTo({ title: 'Request approval to enable signing', obligation: 'OB-2027-1207', exclude: 'Arjun Rao', cta: 'Request approval', eyebrow: 'Stage 2 · the irreversible instant',
      body: 'Enabling signing is a governed write with dual_control: true. From the next record, every record is signed; records before it stay Level 1 forever. The approver sees the boundary seq preview and this callout before deciding.',
      done: function () { mark(2, 'request'); mark(2, 'boundary'); E1.render({ keepScroll: true }); } });
  });
  E1.action('ae-self-approve', function () {
    E1.modal({ eyebrow: 'Stage 2', title: 'You requested this, so you cannot also approve it', body: c.refusal({ code: 'GATE.DUAL_CONTROL_SAME_ACTOR', title: 'Not done — same person on both sides', ruleName: 'Dual control', rule: 'Enabling signing needs a second named person. The approver is never the requester and never an agent.', numbers: [{ label: 'Requested by', value: 'Arjun Rao' }, { label: 'Approve attempted by', value: 'Arjun Rao' }], action: { label: 'Send to Arjun Mehta', href: '#/work/decide/OB-2027-1207' } }), actions: [{ label: 'Close', kind: 'secondary' }] });
  });
  E1.action('ae-close-step', function (el) { var r = rehearsal(); r.close = r.close || {}; r.close[el.getAttribute('data-value')] = true; E1.store.set('ae.rehearsal', r); E1.render({ keepScroll: true }); });
  E1.action('ae-close-record', function () {
    E1.confirm({ eyebrow: 'Flow 3', title: 'Write the closing record?', body: '<p>This rehearsal writes nothing. On the day, the record carries the boundary seq, the boundary timestamp, the counts, the profile installed, the bundle digest the customer verified, and both named humans.</p>', confirmLabel: 'Write closing record (rehearsal)', onConfirm: function () { E1.toast('Rehearsal complete. On the day this is the only thing that closes the upgrade.', 'good', { title: 'Closing record (rehearsal)' }); } });
  });
  E1.action('ae-rollback', function () {
    var root = main(); var v = needSentence(root, 'ae-rb-reason', 'The reason'); if (!v) return;
    E1.confirm({ eyebrow: E1.atLeast('L2') ? 'Governed write' : 'Rehearsal', title: 'Switch signing off?', kind: 'danger',
      body: '<p>The next record carries no signature member. Records already signed stay signed — the segments stand. The customer is told in writing within 24 hours, naming the three ranges.</p>' + limitsBlock(v, 'Recorded verbatim'),
      confirmLabel: 'Switch signing off', onConfirm: function () { E1.toast(E1.atLeast('L2') ? 'Signing is off from the next record. The reason is recorded and the customer notice is queued.' : 'Rehearsed. Nothing was switched off.', E1.atLeast('L2') ? 'warning' : 'neutral', { title: 'Rollback' }); } });
  });
  E1.action('ae-download', function (el) {
    var b = bundleById(el.getAttribute('data-value')) || {};
    E1.toast(bundleFile(b) + ' is ready. The link expires in 24 hours; we keep no copy. Verify it yourself first.', 'good', { title: 'Download prepared', action: { label: 'Get the verifier', href: '#/verify' } });
  });
  E1.action('ae-reexport', function (el) {
    var id = el.getAttribute('data-value'), b = bundleById(id);
    E1.confirm({ title: 'Re-export ' + id + '?', body: '<p>The same range (' + esc(rng(b.from, b.to)) + ') and the same profile produce a bundle that is byte-identical except for exported_at. It is a new governed write, metered at ₹0.</p>', confirmLabel: 'Re-export', onConfirm: function () { E1.toast('Re-exported ' + id + '. Only exported_at differs, so its manifest digest differs too.', 'good', { title: 'Export ready' }); } });
  });
  E1.action('ae-handoff', function (el) {
    var b = bundleById(el.getAttribute('data-value')) || D.bundles[6];
    var prof = b.profile ? profileById(b.profile.split(' ')[0]) : null;
    E1.drawer({ title: 'Hand-off note for your auditor', eyebrow: b.id + ' · one page, sells nothing', width: 620, body:
      '<div class="e1-stack">' + para('To CA Lakshmi Iyer, Iyer Menon & Co. From ' + D.tenant.name + '.') +
      c.card({ title: 'What this is', body: para('An evidence bundle covering ' + rng(b.from, b.to) + ' — ' + num(recordsOf(b)) + ' records, ' + num(b.refusals) + ' refusals, ' + (b.profile ? 'claiming profile ' + b.profile : 'with no profile claimed') + '. Bundle digest ' + bundleDigest(b).slice(0, 8) + '…' + bundleDigest(b).slice(-4) + '.') }) +
      c.card({ title: 'How to get the verifier — not from us', body: para('From the published release, a package registry, or a build from source. Check its digest against SHA256SUMS and the release signature. It is free and has no dependencies.') }) +
      c.card({ title: 'The command', body: c.code(verifyCmd(b), 'shell') + para('The key fingerprint was sent to you by letter. Use that one — not one from the bundle or from us.', 'e1-caption') }) +
      c.card({ title: 'What a PASS means, and what it does not', body: prof && prof.limits ? limitsBlock(prof.limits) : para('Integrity only: intact, chained and, for Level 2 records, signed and anchored. Nothing about any regime.') }) +
      '<div class="e1-row">' + c.button('Copy the note', { kind: 'primary', icon: 'copy', attrs: 'data-copy="' + esc('Evidence bundle ' + b.id + ' · ' + rng(b.from, b.to) + ' · ' + verifyCmd(b)) + '" data-copy-label="Hand-off note"' }) + '</div></div>' });
  });
  E1.action('ae-prepare-export', function () {
    var root = main(), fEl = root.querySelector('#ae-from'), tEl = root.querySelector('#ae-to');
    var a = parseInt(fEl && fEl.value, 10), b = parseInt(tEl && tEl.value, 10);
    var prof = (root.querySelector('input[name="ae-profile"]:checked') || {}).value || 'in-mca-audit-trail';
    if (!(a >= 1 && b >= a && b <= D.boundary.head)) { setFieldError(root, 'ae-from', 'From must be at least 1 and no later than To; To at most 53,686.'); return; }
    if (prof !== 'none' && a < D.boundary.seq) { E1.toast('The profile window splits this range. Use one of the two sub-ranges offered below the summary.', 'neutral', { title: 'Not done — nothing was exported' }); return; }
    var steps = ['Resolving every declaration version and lexicon', 'Gate check: residency, retention, consent, precondition', 'Assembling the eight members and digesting each', 'Writing manifest.json last, then the export record'];
    var m = E1.modal({ eyebrow: 'Governed write', title: 'Preparing the export', dismissable: false, body: '<div id="ae-px">' + c.rungs({ outcome: 'running', at: 3, compact: true }) + '</div><ol class="ae-list ae-mt" id="ae-px-steps">' + steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>', actions: [{ label: 'Cancel — nothing partial is written', kind: 'ghost', onClick: function () { clearInterval(t); E1.toast('Cancelled. Nothing partial was written.', 'neutral'); } }] });
    var i = 0, t = setInterval(function () {
      i++;
      var li = m.el.querySelectorAll('#ae-px-steps li'); if (li[i - 1]) li[i - 1].innerHTML = c.icon('check', 12) + ' ' + esc(steps[i - 1]);
      var rp = m.el.querySelector('#ae-px'); if (rp) rp.innerHTML = c.rungs({ outcome: i >= 4 ? 'committed' : 'running', at: 3 + i * 1.5 | 0, compact: true });
      if (i >= 4) {
        clearInterval(t);
        var id = 'EB-2027-' + ('000' + (D.bundles.length + 1)).slice(-4);
        D.bundles.push({ id: id, at: new Date().toISOString().replace(/\.\d+Z$/, 'Z'), by: (E1.data.user && E1.data.user.name) || 'Venkat Raman', byRole: 'Accounts head', from: a, to: b, refusals: Math.round((b - a + 1) * 611 / 12480), unanch: b >= D.openBatch.from ? Math.min(22, b - D.openBatch.from + 1) : 0, profile: prof === 'none' ? null : 'in-mca-audit-trail v1', redaction: 'ledger1-default', rec: D.boundary.head + D.bundles.length + 12, note: 'Exported just now from the builder' });
        setTimeout(function () { m.close(); E1.go('/assurance/bundles/' + id); E1.toast('Verify it yourself first. If it does not pass for you it will not pass for them.', 'good', { title: 'Export ready — ' + id }); }, 400);
      }
    }, 520);
  });
  E1.action('ae-remove-tsa', function (el) {
    var who = el.getAttribute('data-value');
    E1.modal({ eyebrow: 'Operational action', title: 'Remove ' + who + ' from the pair', body: '<p class="e1-text-body">Running with a known-bad authority to preserve the pair is worse than running with one. Batches continue single_anchor until a replacement is contracted.</p>' + c.field('Written reason', c.textarea({ id: 'ae-tsa-reason', rows: 3 }), { id: 'ae-tsa-reason', required: true, help: 'At least 12 characters. Recorded in the operator chain.' }),
      actions: [{ label: 'Cancel', kind: 'ghost' }, { label: 'Remove from pair', kind: 'danger', onClick: function (e, close, m) { if (!needSentence(m, 'ae-tsa-reason', 'The reason')) return false; close(); E1.toast(who + ' removed. New batches are single_anchor — a degraded state, not a failure.', 'warning', { title: 'Authority removed' }); } }] });
  });
  E1.action('ae-anc-incident', function (el) {
    var x = D.anchorIncidents.filter(function (i) { return i.id === el.getAttribute('data-value'); })[0]; if (!x) return;
    E1.drawer({ title: 'Anchoring incident ' + x.id, eyebrow: x.status, width: 560, body: c.kv([['Window', ist(x.start) + ' → ' + F.time(x.end)], ['eMudhra', x.a], ['DigiCert', x.b], ['Cause', x.cause], ['Batches affected', x.batches], ['Maximum unanchored head', num(x.maxHead) + ' records', { mono: true }]]) + '<div class="ae-mt">' + c.callout({ kind: 'info', body: '<p>A batch anchored late carries its true token time. Outstanding batches are anchored oldest first and never merged. This write-up is appended, never edited.</p>' }) + '</div>' });
  });
  E1.action('ae-run-report', function (el) { openReport(el.getAttribute('data-value')); });
  E1.action('ae-dryrun', function (el) {
    var id = el.getAttribute('data-value'), L2 = E1.atLeast('L2');
    var good = { n: 'g', verdict: L2 ? 'PASS' : 'PASS — unsigned, assurance level 1', scenario: 'Known-good fixture', profile: id + ' v1', from: 1, to: 10000, refusals: 412, l1: !L2 };
    E1.drawer({ title: 'Dry run — not a verification of your records', eyebrow: id + ' v1 · fixture set fx-ledger1-2027.06', width: 760, body:
      c.callout({ kind: 'caveat', body: '<p>Reference fixtures, not your records. ' + (L2 ? '' : 'At Level 1, signature, key-window and anchor rows read not_applicable — assurance level 1, and C06 reads not_applicable — assurance level 1.') + '</p>' }) +
      '<div class="ae-two ae-mt">' + c.card({ title: 'Known-good bundle — must exit 0', body: exitBadge(good.verdict) + '<p class="e1-caption e1-muted ae-mt-s">' + (L2 ? 'C01–C06 passed.' : 'C01–C05 passed · C06 not_applicable — assurance level 1.') + '</p>' }) +
      c.card({ title: 'Known-tampered bundle — must exit 1', body: exitBadge('FAIL_INTEGRITY') + '<p class="ae-line ae-mt-s e1-caption">FAIL at seq 3,181: prev_digest mismatch, expected a376… got 0000…</p>' }) + '</div>' });
  });
  E1.action('ae-install-profile', function (el) {
    if (!E1.atLeast('L2')) {
      E1.modal({ eyebrow: 'Install on tenant', title: 'Installs at upgrade stage 4', body: c.refusal({ code: 'GATE.PRECONDITION_FAILED', title: 'Not done — this profile needs Level 2', ruleName: 'min_assurance_level', rule: 'in-mca-audit-trail asserts non-repudiation, so it needs signed records. Your tenant runs at L1 Guarded.', numbers: [{ label: 'Required', value: 'Level 2' }, { label: 'Your tenant', value: 'Level 1' }], action: { label: 'See the upgrade runbook', href: '#/assurance/upgrade' } }), actions: [{ label: 'Close', kind: 'secondary' }] });
      return;
    }
    E1.toast('Already installed at #41,398 · applies to records from 2027-07-01.', 'neutral');
  });
  E1.action('ae-certify', function (el) {
    var id = el.getAttribute('data-value');
    sendTo({ title: 'Request certification' + (id === 'new' ? '' : ' of ' + id), obligation: 'OB-2027-0977', exclude: 'Rohan Kapoor', cta: 'Request certification', eyebrow: 'Dual control · certifier ≠ author',
      body: 'Certification is a governed write. The certifier sees the clause bindings, the P1–P12 results and the limits statement, verbatim. If you try to certify your own work it refuses with GATE.DUAL_CONTROL_SAME_ACTOR.' });
  });
  E1.action('ae-profile-save', function () { E1.toast('Draft saved. A draft is not certified and executes nowhere.', 'neutral', { title: 'Saved' }); });
  E1.action('ae-control-test', function (el) {
    var ct = controlById(el.getAttribute('data-value')) || D.controls[0];
    E1.drawer({ title: 'Run ' + ct.test.id + ' for a period', eyebrow: ct.id + ' v' + ct.v, width: 560, body:
      '<div class="ae-two">' + c.field('From', c.input({ id: 'ae-ct-from', value: '2027-08-12', mono: true }), { id: 'ae-ct-from' }) + c.field('To', c.input({ id: 'ae-ct-to', value: '2027-10-26', mono: true }), { id: 'ae-ct-to' }) + '</div>' +
      c.kv([['Assertion', ct.test.assertion], ['Population', ct.test.population], ['Result', ct.status === 'certified' ? c.badge('good', 'Operated throughout: Yes') + ' <span class="e1-caption">over ' + num(ct.over) + ' records · 0 exceptions</span>' : c.badge('neutral', 'Not measurable — draft control'), { html: true }]]) +
      '<p class="e1-caption e1-muted ae-mt">A Yes is a fact about a population and a period. It is not a statement that any obligation is met.</p>' });
  });
  E1.action('ae-validate-reg', function (el) {
    var r = regById(el.getAttribute('data-value')); if (!r) return;
    var errs = r.clauses.filter(function (x) { return !x.text; }).map(function (x) { return 'L0-R01 · ' + x.ref + ': clause text blank — a blank is a validation failure, never a draft state.'; });
    r.clauses.forEach(function (x) { if (x.broken === 4) errs.push('L0-C03 · ' + x.ref + ': an expected payload field (irn) is missing from F14 at erp.ar v12.'); });
    if (r.clauses.some(function (x) { return x.sev === 'blocking' && x.disp === 'not_measurable'; })) errs.push('L0-R06: A blocking obligation we cannot measure is not a pack. Bind it, scope it out with an ADR, or stop.');
    E1.drawer({ title: 'Validation — ' + r.id + ' v' + r.v, eyebrow: 'L0-C01…C05 · L0-R01…R06 · no platform needed', width: 600, body: errs.length ? c.callout({ kind: 'critical', title: errs.length + ' validation ' + (errs.length === 1 ? 'failure' : 'failures'), body: ulist(escList(errs)) }) : c.callout({ kind: 'good', title: 'Valid', body: '<p>Every clause is quoted, every link resolves by name and version, and no control is an orphan.</p>' }) });
  });
  E1.action('ae-simulate-reg', function (el) {
    var r = regById(el.getAttribute('data-value')); if (!r) return;
    var OUT = { bound: ['good', 'established'], not_measurable: ['neutral', 'not_applicable'], out_of_scope: ['neutral', 'not_applicable'] };
    E1.drawer({ title: 'Simulate — ' + r.id, eyebrow: 'On the reference tenant fixture', width: 600, body: c.table({ caption: 'Per-clause result', columns: [{ key: 'ref', label: 'Clause', mono: true }, { key: 'o', label: 'Result', html: true }], rows: r.clauses.map(function (x) { var o = r.status === 'certified' ? OUT[x.disp] : x.broken ? ['warning', 'unmet'] : OUT[x.disp]; return { ref: x.ref, o: c.badge(o[0], o[1]) }; }) }) + '<p class="e1-caption e1-muted ae-mt">Results are established · unmet · not_disclosed · not_applicable. A simulation is not a verification of your records.</p>' });
  });
  E1.action('ae-issue-receipt', function () {
    var d = E1.drawer({ title: 'Issue a receipt', eyebrow: 'Level 3 Proven · preview', width: 600, body:
      c.field('Source record', c.input({ id: 'ae-ir-seq', value: '1,18,312', mono: true }), { id: 'ae-ir-seq', help: 'erp.sales_invoice.submit · SINV-2028-04432 · ₹3,12,480 · committed' }) +
      c.field('Counterparty', c.select({ id: 'ae-ir-cp', options: D.counterparties.map(function (x) { return { value: x.org, label: x.name + ' — ' + x.org }; }) }), { id: 'ae-ir-cp' }) +
      '<div id="ae-ir-warn"></div>' +
      c.field('Disclosure profile', c.select({ id: 'ae-ir-dp', options: ['counterparty-invoice — 3 of 11 fields', 'lender-working-capital — 5 of 11 fields'] }), { id: 'ae-ir-dp' }) +
      c.field('Expires', c.select({ id: 'ae-ir-exp', options: ['7 days', '3 days', '14 days'] }), { id: 'ae-ir-exp' }) +
      '<div class="e1-row ae-mt">' + c.button('Issue receipt', { kind: 'gate', icon: 'send', attrs: 'id="ae-ir-go"' }) + '</div>' });
    var root = d.el, sel = root.querySelector('#ae-ir-cp'), warn = root.querySelector('#ae-ir-warn');
    function upd() {
      var cp = D.counterparties.filter(function (x) { return x.org === sel.value; })[0];
      warn.innerHTML = cp.status === 'unknown' ? c.refusal({ code: 'GATE.COUNTERPARTY_UNKNOWN', title: 'Not done — counterparty not registered', rule: 'Register this counterparty first, under whatever due diligence you already run.', action: { label: 'Register this counterparty first', href: '#/assurance/counterparties' } })
        : cp.status === 'sanctioned' ? c.callout({ kind: 'critical', title: 'This counterparty is on a sanctions list.', body: '<p>This cannot be overridden. Escalate to compliance.</p>' })
        : cp.isNew || cp.issued === 0 ? c.callout({ kind: 'warning', title: 'First receipt to this audience', body: '<p>Receipts disclose your governed-write volume between them. Anyone holding two receipts from you can see roughly how many writes you made in between. If you cannot accept that for this counterparty, do not issue receipts to them.</p>' + c.checkbox({ id: 'ae-ir-ack', label: 'I understand, and accept it for ' + cp.name }) }) : '';
    }
    sel.addEventListener('change', upd); upd();
    root.querySelector('#ae-ir-go').addEventListener('click', function () {
      var cp = D.counterparties.filter(function (x) { return x.org === sel.value; })[0];
      if (cp.status !== 'active') { E1.toast('No receipt was issued and nothing partial exists.', 'neutral', { title: 'Not done' }); return; }
      var ack = root.querySelector('#ae-ir-ack'); if (ack && !ack.checked) { ack.focus(); E1.toast('Confirm the volume-disclosure warning first.', 'warning'); return; }
      d.close(); E1.toast('Receipt issued — record 1,18,312, audience ' + cp.org + ', expires in 7 days', 'good', { title: 'Receipt issued' });
    });
  });
  E1.action('ae-verify-receipt', function () {
    E1.drawer({ title: 'Verify a receipt', eyebrow: 'Offline · no network call during verification', width: 560, body: '<label class="ae-drop" for="ae-vr-file">' + c.icon('upload', 20) + '<strong>Choose a receipt file</strong><span>The claim is echoed first, then the audience, expiry, key, digest, signature, anchor and disclosures are checked in the normative order.</span><input type="file" id="ae-vr-file" class="e1-sr"></label>' +
      '<p class="e1-caption e1-muted ae-mt">Key discovery is explicit and reported: a pinned fingerprint first, then the issuer’s key document. A hint inside the receipt is never trusted.</p>' + '<div class="ae-mt">' + c.button('Open a verified example', { href: '#/assurance/receipts/RR-2028-0077', iconRight: 'arrow-right' }) + '</div>' });
  });
  E1.action('ae-bind-receipt', function (el) {
    sendTo({ title: 'Bind ' + el.getAttribute('data-value') + ' into our chain', obligation: 'OB-2028-0512', exclude: 'Venkat Raman', cta: 'Request binding', eyebrow: 'receipt.accept · crosses an organisation boundary',
      body: 'Binding writes a receipt.accept record in your chain naming the issuer’s record. It is dual control. There is no callback to the issuer.' });
  });
  E1.action('ae-register-cp', function () {
    E1.modal({ eyebrow: 'Governed write', title: 'Register a counterparty', body: c.field('org_id', c.input({ id: 'ae-cp-org', mono: true, placeholder: 'ar-org:example.in' }), { id: 'ae-cp-org', required: true, help: 'DNS-anchored: ar-org:<domain>.' }) + c.field('Display name', c.input({ id: 'ae-cp-name' }), { id: 'ae-cp-name' }) + c.field('Due diligence reference', c.input({ id: 'ae-cp-dd', placeholder: 'Your own KYC or vendor file reference' }), { id: 'ae-cp-dd', help: 'The register records that you did it; it does not do it for you.' }),
      actions: [{ label: 'Cancel', kind: 'ghost' }, { label: 'Register', kind: 'primary', onClick: function (e, close, m) { var v = (m.querySelector('#ae-cp-org').value || '').trim(); if (!/^ar-org:[a-z0-9.-]+\.[a-z]{2,}$/.test(v)) { setFieldError(m, 'ae-cp-org', 'Use ar-org: followed by a domain, for example ar-org:acmetextiles.example.'); return false; } close(); E1.toast(v + ' registered. Pin its fingerprint out of band before accepting receipts.', 'good', { title: 'Registered' }); } }] });
  });
  E1.action('ae-pin-fp', function () {
    E1.modal({ eyebrow: 'Strongest route', title: 'Pin a fingerprint', body: '<p class="e1-text-body">Type the fingerprint exactly as your counterparty gave it to you out of band — a signed letter, a call you placed, a meeting. Never copy it from a receipt.</p>' + c.field('Counterparty', c.select({ id: 'ae-pf-cp', options: D.counterparties.filter(function (x) { return x.status === 'active'; }).map(function (x) { return x.org; }) }), { id: 'ae-pf-cp' }) + c.field('Fingerprint', c.input({ id: 'ae-pf-fp', mono: true, placeholder: 'SHA256:…' }), { id: 'ae-pf-fp', required: true }) + c.field('How you received it', c.input({ id: 'ae-pf-how', placeholder: 'Signed letter, 2 Sep 2028' }), { id: 'ae-pf-how', required: true }),
      actions: [{ label: 'Cancel', kind: 'ghost' }, { label: 'Pin', kind: 'primary', onClick: function (e, close, m) { var v = (m.querySelector('#ae-pf-fp').value || '').trim(); if (v.length < 16) { setFieldError(m, 'ae-pf-fp', 'That is too short to be a fingerprint. Type the whole value you were given.'); return false; } if (!needSentence(m, 'ae-pf-how', 'How you received it')) return false; close(); E1.toast('Pinned. Receipts from this counterparty now resolve by route 1.', 'good'); } }] });
  });
  E1.action('ae-dispute-submit', function () {
    var root = main(); if (!needSentence(root, 'ae-dsp-note', 'What you saw')) return;
    E1.toast('Dispute recorded as a governed write in your chain. elan1 does not adjudicate; the next move follows from the failure class.', 'info', { title: 'Dispute recorded' });
  });
  E1.action('ae-disclose-export', function () {
    var root = main();
    var on = Array.prototype.filter.call(root.querySelectorAll('input[data-sd]'), function (i) { return i.checked; }).map(function (i) { return i.getAttribute('data-sd'); });
    var kind = ((D.sdProfiles.filter(function (x) { return x.id === (root.querySelector('#ae-sd-prof') || {}).value; })[0]) || {}).kind;
    if (on.indexOf('contact_mobile') >= 0 && kind !== 'internal') { E1.toast('A personal field is revealed without consent. Drop it or capture consent first.', 'neutral', { title: 'Not done — GATE.CONSENT_MISSING' }); return; }
    E1.confirm({ eyebrow: 'A disclosure is irrevocable', title: 'Reveal ' + on.length + ' of 11 fields?', body: '<p>Once a field’s salt and value are handed over, they are known. There is no recall. The export record exists so that at least the fact of the disclosure is not deniable.</p><p class="e1-mono e1-caption">' + esc(on.join(', ')) + '</p>', confirmLabel: 'Export with this disclosure',
      onConfirm: function () { E1.toast('Export ready — 20,480 records, 1,004 refusals, 0 unanchored, profile in-mca-audit-trail v1, disclosure profile ' + ((root.querySelector('#ae-sd-prof') || {}).value || '') + ' revealing ' + on.length + ' of 11 fields', 'good', { title: 'Verify it yourself first' }); } });
  });
  E1.action('ae-capture-consent', function () { E1.toast('Consent is captured as its own governed write by the owner of the relationship. The disclosure waits until it exists.', 'info', { title: 'Consent request opened' }); });
  E1.action('ae-drop-field', function () {
    var i = main().querySelector('input[data-sd="contact_mobile"]'); if (!i) return;
    i.checked = false; i.dispatchEvent(new Event('change', { bubbles: true }));
    E1.toast('contact_mobile dropped. Saving this as a profile makes a new declaration version.', 'neutral');
  });
  E1.action('ae-download-receipt', function (el) { E1.toast(el.getAttribute('data-value') + '.json is ready. Send it with the invoice; we do not deliver receipts.', 'good', { title: 'Receipt file' }); });

  /* Keyboard: [ and ] step through the upgrade stages */
  document.addEventListener('keydown', function (e) {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target; if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    var r = E1.state.route || {}; if (r.pattern !== '/assurance/upgrade/:stage') return;
    var n = Number(r.params && r.params.stage);
    if (e.key === '[' && n > 0) { e.preventDefault(); E1.go('/assurance/upgrade/' + (n - 1)); }
    if (e.key === ']') { e.preventDefault(); E1.go(n < 5 ? '/assurance/upgrade/' + (n + 1) : '/assurance/upgrade/close'); }
  });

  E1.cmdAdd({ id: 'ae-export', label: 'Export an evidence bundle', hint: '/assurance/export', icon: 'download', group: 'Actions', keywords: 'bundle l2 evidence', run: '#/assurance/export' });
  E1.cmdAdd({ id: 'ae-upgrade', label: 'Walk the L1 → L2 upgrade runbook', hint: '/assurance/upgrade/0', icon: 'assurance', group: 'Actions', keywords: 'upgrade attested signing boundary', run: '#/assurance/upgrade/0' });
  E1.cmdAdd({ id: 'ae-tampered', label: 'Open the verifier report for the tampered bundle', hint: '/assurance/verify-runs?run=5', icon: 'terminal', group: 'Actions', keywords: 'fail_integrity tampered', run: '#/assurance/verify-runs?run=5' });
})();
