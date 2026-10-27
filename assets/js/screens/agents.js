/* ==========================================================================
   AGENTS door — "Who and what is acting here?"   (owner: agents)
   Routes: /agents/registry · /agents/agent/:id · /agents/discovered · /agents/map
           /agents/autonomy · /agents/autonomy/history · /agents/autonomy/:classId
           /agents/autonomy/:classId/propose · /agents/graduation · /agents/graduation/:classId
           /agents/keys · /agents/keys/signing · /agents/keys/policy · /agents/keys/:id
           /agents/keys/:id/rotate · /agents/keys/:id/revoke
           /agents/channels · /agents/channels/:id · /agents/tools · /agents/webhooks
           /agents/people · /agents/people/:id · /agents/roles
   Sources: spec-phase1-console §1.6, §1.14–1.15, §2.3, F8, §4.3–4.8 · spec-tm §1.3, §2.3–2.4, §6.3
            spec-phase2-3-evidence §1.7, §2.2 · spec-phase4-group §1.7, G-01…G-04 · competitors-1/2.
   Demo clock: 24 Sep 2026, 15:28 IST (spec §4.5).
   ========================================================================== */
(function () {
  'use strict';
  var E1 = window.E1, c = E1.c, esc = E1.esc, fmt = E1.fmt;
  var NOW = new Date('2026-09-24T15:28:00+05:30').getTime();
  var DAY = 86400000;

  /* ------------------------------------------------------------------------
     Local styles (tokens only; prefix ag-)
     ------------------------------------------------------------------------ */
  (function injectStyle() {
    if (document.getElementById('ag-style')) return;
    var css = [
      '.ag-strip{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:var(--space-3);margin-top:var(--space-5)}',
      '.ag-strip .e1-stat{min-height:100%}',
      '.ag-lane{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;margin-top:var(--space-5);border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface);overflow:hidden}',
      '.ag-lane__step{position:relative;display:flex;flex-direction:column;gap:4px;padding:14px 16px 14px 20px;color:var(--text-primary);text-decoration:none;border-right:1px solid var(--border-subtle);min-width:0}',
      '.ag-lane__step:last-child{border-right:0}',
      '.ag-lane__step:hover{background:var(--bg-hover)}',
      '.ag-lane__step.is-active{background:var(--bg-selected);box-shadow:inset 0 -2px 0 var(--border-accent)}',
      '.ag-lane__top{display:flex;align-items:baseline;gap:8px}',
      '.ag-lane__n{font:var(--weight-title) 22px/1 var(--font-display);font-variant-numeric:tabular-nums}',
      '.ag-lane__k{font-size:var(--text-label);letter-spacing:var(--tracking-label);text-transform:uppercase;font-weight:var(--weight-semibold);color:var(--text-secondary)}',
      '.ag-lane__d{font-size:var(--text-caption);line-height:var(--lh-caption);color:var(--text-secondary)}',
      '.ag-lane__arrow{position:absolute;right:-9px;top:50%;transform:translateY(-50%);z-index:1;width:18px;height:18px;border-radius:50%;background:var(--bg-surface);border:1px solid var(--border-subtle);display:grid;place-items:center;color:var(--text-tertiary)}',
      '@media (max-width:720px){.ag-lane{grid-template-columns:repeat(2,minmax(0,1fr))}.ag-lane__step:nth-child(2){border-right:0}.ag-lane__step:nth-child(-n+2){border-bottom:1px solid var(--border-subtle)}.ag-lane__arrow{display:none}}',
      '.ag-tag{display:inline-flex;align-items:center;gap:4px;padding:1px 7px;border:1px solid var(--border-default);border-radius:var(--radius-sm);font-size:var(--text-caption);line-height:18px;color:var(--text-secondary);white-space:nowrap;background:var(--bg-surface)}',
      '.ag-tag--adv{border-style:dashed}',
      '.ag-claude{display:inline-flex;align-items:center;gap:4px;font-size:var(--text-caption);color:var(--text-accent);white-space:nowrap}',
      '.ag-sub{display:block;font-size:var(--text-caption);color:var(--text-tertiary);font-family:var(--font-mono);margin-top:2px}',
      '.ag-num{font-family:var(--font-mono);font-variant-numeric:tabular-nums}',
      '.ag-owner{display:flex;align-items:center;gap:6px;font-family:var(--font-ui);margin-top:4px}',
      '.ag-wh .e1-card__title{word-break:break-all}.ag-wh .e1-card__head,.ag-disc .e1-card__head{flex-wrap:wrap}',
      '.ag-c7{display:grid;grid-template-columns:auto auto;gap:0 10px;margin:0;font-size:var(--text-caption);line-height:17px;white-space:nowrap}.ag-c7 dt{color:var(--text-secondary)}.ag-c7 dd{margin:0;text-align:right;font-family:var(--font-mono);font-variant-numeric:tabular-nums}',
      '.ag-grants{display:flex;flex-direction:column;align-items:flex-start;gap:3px}',
      '.ag-grants__row{display:flex;gap:6px;align-items:center;white-space:nowrap;font-size:var(--text-caption)}',
      '.ag-grants__wt{color:var(--text-secondary)}',
      '.ag-more{font-size:var(--text-caption);color:var(--text-tertiary)}',
      /* autonomy matrix */
      '.ag-matrix-wrap{position:relative;overflow-x:auto;border:1px solid var(--border-subtle);border-radius:var(--radius-md);background:var(--bg-surface)}',
      '.ag-matrix{border-collapse:separate;border-spacing:0;width:100%;font-size:var(--text-caption)}',
      '.ag-matrix th,.ag-matrix td{border-bottom:1px solid var(--border-subtle);padding:5px;vertical-align:top;text-align:left}',
      '.ag-matrix thead th{background:var(--bg-sunken);font-weight:var(--weight-semibold);min-width:80px;max-width:104px;line-height:15px;font-size:var(--text-label);letter-spacing:var(--tracking-label);text-transform:uppercase;color:var(--text-tertiary);padding:8px 6px}',
      '.ag-matrix thead th .ag-sub{text-transform:none;letter-spacing:0;font-weight:var(--weight-regular)}',
      '.ag-matrix tbody th,.ag-matrix td{padding:7px 6px}',
      '.ag-matrix thead th a{color:var(--text-primary);text-decoration:none}.ag-matrix thead th a:hover{text-decoration:underline}',
      '.ag-matrix thead th .ag-sub{font-size:var(--text-label);word-break:break-all}',
      '.ag-matrix tbody th{position:sticky;left:0;z-index:1;background:var(--bg-surface);min-width:150px;font-weight:var(--weight-regular);border-right:1px solid var(--border-subtle)}',
      '.ag-matrix thead th:first-child{position:sticky;left:0;z-index:2;border-right:1px solid var(--border-subtle)}',
      '.ag-matrix tr.is-focus th,.ag-matrix tr.is-focus td{background:var(--bg-selected)}',
      '.ag-cell{display:flex;flex-direction:column;gap:3px;padding:6px 7px;border:1px solid var(--border-subtle);border-radius:var(--radius-sm);color:var(--text-primary);text-decoration:none;background:var(--bg-surface);min-height:50px}',
      '.ag-cell:hover{border-color:var(--border-strong)}',
      '.ag-cell__top{display:flex;align-items:center;gap:6px}',
      '.ag-cell__k{font:var(--weight-semibold) var(--text-caption)/1 var(--font-mono)}',
      '.ag-cell__n{font-size:var(--text-label);line-height:var(--lh-label);color:var(--text-secondary)}',
      '.ag-cell__note{font-size:var(--text-label);line-height:var(--lh-label);color:var(--text-tertiary)}',
      '.ag-ticks{display:inline-flex;gap:2px}.ag-ticks i{display:block;width:5px;height:10px;background:var(--border-subtle)}.ag-ticks i.is-on{background:var(--text-secondary)}.ag-ticks i.is-cur{background:var(--text-primary)}',
      '.ag-cell.is-cap{border-style:dashed}',
      /* ladder cards */
      '.ag-ladder{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:var(--space-2)}',
      '@media (max-width:1100px){.ag-ladder{grid-template-columns:repeat(3,minmax(0,1fr))}}',
      '@media (max-width:560px){.ag-ladder{grid-template-columns:minmax(0,1fr)}}',
      '.ag-rung{border:1px solid var(--border-subtle);border-top:3px solid var(--text-tertiary);border-radius:var(--radius-md);box-shadow:var(--shadow-1);padding:12px;background:var(--bg-surface);display:flex;flex-direction:column;gap:6px}',
      '.ag-rung__k{font:var(--weight-title) 17px/1 var(--font-mono)}',
      '.ag-rung__n{font:var(--weight-title) var(--text-body)/1.3 var(--font-display)}',
      '.ag-rung__d{font-size:var(--text-caption);line-height:var(--lh-caption);color:var(--text-secondary);flex:1}',
      '.ag-rung__c{font-size:var(--text-caption);color:var(--text-tertiary);border-top:1px solid var(--border-subtle);padding-top:6px}',
      /* checklist */
      '.ag-check{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}',
      '.ag-check li{display:grid;grid-template-columns:22px minmax(0,1fr) auto;gap:10px;padding:10px 0;border-bottom:1px solid var(--border-subtle);align-items:start}',
      '.ag-check li:last-child{border-bottom:0}',
      '.ag-check__n{font:var(--weight-semibold) var(--text-caption)/20px var(--font-mono);color:var(--text-tertiary)}',
      '.ag-check__t{font-size:var(--text-body)}.ag-check__t small{display:block;color:var(--text-secondary);font-size:var(--text-caption);margin-top:2px}',
      /* reveal */
      '.ag-reveal{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:12px 14px;border:1px dashed var(--border-strong);border-radius:var(--radius-md);background:var(--bg-sunken)}',
      '.ag-reveal code{font:var(--weight-medium) var(--text-body)/1.4 var(--font-mono);word-break:break-all;flex:1;min-width:0}',
      /* key window */
      '.ag-window{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0;margin:8px 0}',
      '.ag-window__seg{padding:10px 12px;border:1px solid var(--border-subtle);background:var(--bg-sunken);font-size:var(--text-caption);min-width:0}',
      '.ag-window__seg+.ag-window__seg{border-left:0}',
      '.ag-window__seg.is-this{background:var(--bg-surface);border-color:var(--border-strong);box-shadow:inset 0 3px 0 var(--text-primary)}',
      '.ag-window__seg b{display:block;font-family:var(--font-mono);font-size:var(--text-caption);word-break:break-all}',
      /* channel cells */
      '.ag-ch{display:inline-flex;align-items:center;gap:4px;font-size:var(--text-caption);white-space:nowrap}',
      '.ag-ch--none{color:var(--text-tertiary)}',
      /* map */
      '.ag-map{width:100%;height:auto;display:block}',
      '.ag-map text{font-family:var(--font-ui);fill:var(--text-primary)}',
      '.ag-map .ag-map__meta{fill:var(--text-secondary);font-size:10px;font-family:var(--font-mono)}',
      '.ag-map .ag-map__col{fill:var(--text-tertiary);font-size:10px;letter-spacing:var(--tracking-label);font-weight:var(--weight-semibold)}',
      '.ag-map .ag-edge{fill:none;stroke:var(--border-default);stroke-width:1.2;stroke-dasharray:3 3}',
      '.ag-map .ag-edge--stage{stroke:var(--zone-runtime);stroke-width:1.4;stroke-dasharray:6 3}',
      '.ag-map .ag-edge--write{stroke:var(--zone-consumer);stroke-width:2.6;stroke-dasharray:none}',
      '.ag-map .is-dim{opacity:.12}',
      '.ag-map a:focus-visible rect{stroke-width:3}',
      '.ag-map a{cursor:pointer;text-decoration:none}.ag-map a text{text-decoration:none}',
      '.ag-legend{display:flex;flex-wrap:wrap;gap:var(--space-4);font-size:var(--text-caption);color:var(--text-secondary);margin-top:var(--space-3)}',
      '.ag-legend span{display:inline-flex;align-items:center;gap:6px}',
      '.ag-legend svg{flex:none}',
      /* misc */
      '.ag-kvs{display:flex;flex-direction:column;gap:var(--space-4)}',
      '.ag-inline{display:flex;flex-wrap:wrap;gap:6px;align-items:center}',
      '.ag-muted-row{color:var(--text-tertiary)}',
      '.ag-desc{font-size:var(--text-caption);color:var(--text-secondary);max-width:46ch}',
      '.ag-fieldset{border:0;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}',
      '.ag-fieldset legend{font-size:var(--text-label);letter-spacing:var(--tracking-label);text-transform:uppercase;font-weight:var(--weight-semibold);color:var(--text-secondary);margin-bottom:6px}',
      '.ag-steps{list-style:none;margin:0;padding:0;counter-reset:ag;display:flex;flex-direction:column;gap:10px}',
      '.ag-steps li{counter-increment:ag;position:relative;padding-left:32px;min-height:22px;font-size:var(--text-body);line-height:var(--lh-body)}',
      '.ag-steps li::before{content:counter(ag);position:absolute;left:0;top:0;width:22px;height:22px;border-radius:50%;border:1px solid var(--border-default);display:grid;place-items:center;font:var(--weight-semibold) var(--text-label)/1 var(--font-mono);color:var(--text-secondary)}',
      '.ag-foot{margin-top:var(--space-6);font-size:var(--text-caption);color:var(--text-tertiary)}',
      '.ag-perm{display:inline-flex;align-items:center;gap:5px;font-size:var(--text-caption);white-space:nowrap}',
      '.ag-perm--no{color:var(--text-tertiary)}',
      '.ag-tablenote{font-size:var(--text-caption);color:var(--text-secondary);margin-top:var(--space-2)}',
      '.ag-pre{margin:0;padding:12px 14px;background:var(--bg-sunken);border:1px solid var(--border-subtle);border-radius:var(--radius-md);font:var(--weight-regular) var(--text-caption)/1.55 var(--font-mono);white-space:pre-wrap;word-break:break-word;color:var(--text-primary)}'
    ].join('\n');
    var s = document.createElement('style');
    s.id = 'ag-style';
    s.textContent = css;
    document.head.appendChild(s);
  })();

  /* ------------------------------------------------------------------------
     Sample data (canonical names and ids from spec-phase1-console §4)
     ------------------------------------------------------------------------ */
  function hex64(seed) {
    var out = '', h = 2166136261 >>> 0, i, j;
    for (j = 0; out.length < 64; j++) {
      for (i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i) + j * 31; h = Math.imul(h, 16777619) >>> 0; }
      out += ('00000000' + h.toString(16)).slice(-8);
    }
    return out.slice(0, 64);
  }
  function pinHash(head, tail, seed) { var m = hex64(seed); return head + m.slice(head.length, 64 - tail.length) + tail; }
  function ist(d, t) { return d + 'T' + (t || '00:00') + ':00+05:30'; }

  /* Write types: blast 1–5, rev = window | false, ch = what each channel may do
     (s submit · a approve · sa submit and approve · r approve by reply · l deep link only · v approve only, spoken + OTP · n notify + deep link · '' cannot be attempted) */
  var WT = [
    { name: 'erp.sales_invoice.submit', label: 'Submit invoice', blast: 2, rev: '24 h', plan: 'target_native_undo 24 h (cancel IRN) → compensating_entry (credit note)', dual: 'Above ₹2,00,000', decl: 'erp.ar', ver: 7, tenant: 'kaveri-spinning', ch: { web: 'sa', mobile: 'a', whatsapp: 'l', voice: '', email: 'n', api: '', mcp: 's' } },
    { name: 'erp.sales_invoice.cancel', label: 'Cancel invoice', blast: 2, rev: false, plan: 'Irreversible — cannot be auto-approved', dual: 'Always', decl: 'sales_invoice', ver: 4, tenant: 'kaveri-spinning', ch: { web: 'sa', mobile: 'a', whatsapp: 'l', voice: 'v', email: 'n', api: '', mcp: '' }, apiNote: '“a compromised API key should never be able to wipe out invoices”' },
    { name: 'erp.payment_entry.submit', label: 'Record payment', blast: 2, rev: '30 days', plan: 'snapshot_restore 720 h → compensating_entry', dual: 'No', decl: 'erp.ar', ver: 7, tenant: 'kaveri-spinning', ch: { web: 'sa', mobile: 'a', whatsapp: 'l', voice: '', email: 'n', api: 's', mcp: '' } },
    { name: 'erp.purchase_order.submit', label: 'Submit purchase order', blast: 2, rev: '30 days', plan: 'target_native_undo 720 h', dual: 'Above ₹5,00,000', decl: 'erp.ap', ver: 5, tenant: 'kaveri-spinning', ch: { web: 'sa', mobile: 'a', whatsapp: 'l', voice: '', email: 'n', api: 's', mcp: '' } },
    { name: 'erp.purchase_invoice.submit', label: 'Book supplier bill', blast: 2, rev: '30 days', plan: 'compensating_entry (debit note)', dual: 'Above ₹2,00,000', decl: 'erp.ap', ver: 5, tenant: 'kaveri-spinning', ch: { web: 'sa', mobile: 'a', whatsapp: 'l', voice: '', email: 'n', api: 's', mcp: 's' } },
    { name: 'erp.payment_run.submit', label: 'Release supplier payment run', blast: 3, rev: false, plan: 'Irreversible — money leaves the bank', dual: 'Always', decl: 'erp.ap', ver: 5, tenant: 'kaveri-spinning', ch: { web: 'sa', mobile: 'a', whatsapp: 'l', voice: 'v', email: 'n', api: '', mcp: '' } },
    { name: 'erp.supplier.create', label: 'Add supplier', blast: 1, rev: '30 days', plan: 'snapshot_restore 720 h', dual: 'No', decl: 'erp.ap', ver: 5, tenant: 'kaveri-spinning', ch: { web: 'sa', mobile: 'a', whatsapp: 'l', voice: '', email: 'n', api: 's', mcp: 's' } },
    { name: 'erp.stock_entry.submit', label: 'Move stock', blast: 1, rev: '30 days', plan: 'target_native_undo 720 h', dual: 'No', decl: 'erp.stock', ver: 3, tenant: 'kaveri-spinning', ch: { web: 'sa', mobile: 'a', whatsapp: 'r', voice: '', email: 'n', api: 's', mcp: '' } },
    { name: 'erp.journal_entry.submit', label: 'Post journal entry', blast: 1, rev: '30 days', plan: 'compensating_entry', dual: 'Above ₹1,00,000', decl: 'erp.ar', ver: 7, tenant: 'kaveri-spinning', ch: { web: 'sa', mobile: 'a', whatsapp: 'l', voice: '', email: 'n', api: '', mcp: '' } },
    { name: 'erp.price_list.update', label: 'Update price list', blast: 3, rev: '7 days', plan: 'snapshot_restore 168 h', dual: 'Always', decl: 'erp.ar', ver: 7, tenant: 'kaveri-spinning', ch: { web: 'sa', mobile: 'a', whatsapp: 'l', voice: '', email: 'n', api: '', mcp: '' } },
    { name: 'erp.period.close', label: 'Close accounting period', blast: 4, rev: '72 h', plan: 'target_native_undo 72 h (reopen)', dual: 'Always (forced by tenant scope)', decl: 'erp.ar', ver: 7, tenant: 'kaveri-spinning', ch: { web: 'sa', mobile: 'a', whatsapp: 'l', voice: '', email: 'n', api: '', mcp: '' } },
    { name: 'erp.gstr1.file', label: 'File GSTR-1', blast: 5, rev: false, plan: 'Irreversible — proof_binding must be non-empty', dual: 'Always (forced by crossing a boundary)', decl: 'erp.ar', ver: 7, tenant: 'kaveri-spinning', ch: { web: 'sa', mobile: 'a', whatsapp: 'l', voice: '', email: 'n', api: '', mcp: '' } },
    { name: 'erp.credit_note.submit', label: 'Raise credit note', blast: 2, rev: '30 days', plan: 'compensating_entry', dual: 'Always', decl: 'erp.ar', ver: 7, tenant: 'kaveri-spinning', ch: { web: 'sa', mobile: 'a', whatsapp: 'l', voice: '', email: 'n', api: '', mcp: '' } },
    { name: 'erp.credit_limit.change', label: 'Change credit limit', blast: 2, rev: '30 days', plan: 'snapshot_restore 720 h', dual: 'Always', decl: 'erp.ar', ver: 7, tenant: 'kaveri-spinning', ch: { web: 'sa', mobile: 'a', whatsapp: 'l', voice: '', email: 'n', api: '', mcp: '' } },
    { name: 'erp.customer.create', label: 'Add customer', blast: 1, rev: '30 days', plan: 'snapshot_restore 720 h', dual: 'No', decl: 'erp.ar', ver: 7, tenant: 'kaveri-spinning', ch: { web: 'sa', mobile: 'a', whatsapp: 'l', voice: '', email: 'n', api: 's', mcp: '' } },
    { name: 'platform.obligation.resolve', label: 'Approve or reject', blast: 1, rev: null, plan: 'An approval is itself a governed write', dual: 'G4 by definition', decl: 'platform', ver: 3, tenant: '*', ch: { web: 'a', mobile: 'a', whatsapp: 'r', voice: 'v', email: 'n', api: '', mcp: '' }, humansOnly: true },
    { name: 'll.invoice.post', label: 'Post invoice', blast: 2, rev: '30 days', plan: 'compensating_entry (credit note)', dual: 'Above ₹2,00,000', decl: 'll.billing', ver: 3, tenant: 'ledgerloop-sbx', ch: { web: 'sa', mobile: 'a', whatsapp: '', voice: '', email: 'n', api: '', mcp: 's' } },
    { name: 'erp.journal_entry.submit@deccan', alias: 'erp.journal_entry.submit', label: 'Post journal entry', blast: 1, rev: '30 days', plan: 'compensating_entry', dual: 'Above ₹1,00,000', decl: 'erp.gl', ver: 4, tenant: 'deccan-auto', ch: { web: 'sa', mobile: 'a', whatsapp: 'l', voice: '', email: 'n', api: '', mcp: '' } }
  ];
  var MATRIX_WT = ['erp.sales_invoice.submit', 'erp.sales_invoice.cancel', 'erp.payment_entry.submit', 'erp.purchase_order.submit', 'erp.purchase_invoice.submit', 'erp.payment_run.submit', 'erp.supplier.create', 'erp.stock_entry.submit', 'erp.journal_entry.submit', 'erp.price_list.update', 'erp.period.close', 'erp.gstr1.file'];

  var TOOLS = [
    { id: 'read.records', scope: 'ro', args: '{type, filter, as_of?}', returns: 'permission-filtered rows', desc: 'Read permission-filtered rows of a declared record type, as of a stated time. Never writes.', head: '5c1a', tail: '90e2', system: 'erpnext' },
    { id: 'read.evidence', scope: 'ro', args: '{seq_from, seq_to}', returns: 'proof entries', desc: 'Read proof entries between two sequence numbers. Refusals are included.', head: 'b7d3', tail: '41c8', system: 'chain' },
    { id: 'read.declaration', scope: 'ro', args: '{declaration_id, version?}', returns: 'the seven blocks', desc: 'Read the seven blocks of a declaration at an explicit version. Never resolves to latest.', head: '0e6f', tail: 'aa13', system: 'registry' },
    { id: 'read.meter', scope: 'ro', args: '{period}', returns: 'events and totals', desc: 'Read meter events and totals for a period. Refusals appear at quantity zero.', head: '3a90', tail: '7f25', system: 'chain' },
    { id: 'stage.write', scope: 'stage', args: '{write_type, payload, as_of}', returns: 'request object, validated, no side effects', desc: 'Stage a write request. Validated, no side effects. Submit with act.write.', head: 'c82b', tail: '1d06', system: 'sandbox' },
    { id: 'act.write', scope: 'act', args: '{request, idempotency_key}', returns: 'committed · refused · escalated', desc: 'Submit a staged write with an idempotency key. Returns committed, refused or escalated. A refusal is an answer: do not retry it.', head: '9e02', tail: 'b3f1', system: 'erpnext', prev: { head: 'd41c', tail: '07aa', ver: 6, desc: 'Submit a staged write. Returns committed, refused or escalated.' } },
    { id: 'act.escalate', scope: 'act', args: '{obligation_id, decision, note}', returns: 'resolution (refused from any agent token)', desc: 'Resolve an obligation. Refused from any agent token: agents never approve.', head: '6d4e', tail: 'c0b9', system: 'people' }
  ];

  var AGENTS = [
    { id: 'ar-agent', name: 'ar-agent', tenant: 'kaveri-spinning', owner: 'venkat-raman', model: 'claude-sonnet', vendor: 'Anthropic', via: 'rung1', channel: 'SDK', mode: 'enforced', stage: 'live', grants: { 'erp.sales_invoice.submit': 'A2' }, tools: ['read.records', 'stage.write', 'act.write'], c7: [212, 1, 9], key: 'key-prod-01', since: '2026-09-02', regSeq: 2869, decl: 'erp.ar v7', purpose: 'Drafts sales invoices from confirmed sales orders and submits them for approval.', delegation: { to: 'ravi-shankar', wt: 'erp.sales_invoice.submit', from: '2026-09-20', until: '2026-10-04', seq: 3702, what: 'Sponsor duties while Venkat Raman is on leave' } },
    { id: 'rung1-drafting-agent', name: 'rung1 drafting agent', tenant: 'kaveri-spinning', owner: 'venkat-raman', model: 'claude-haiku', vendor: 'Anthropic', via: 'rung1', channel: 'SDK', mode: 'enforced', stage: 'live', grants: { 'erp.sales_invoice.submit': 'A2' }, caps: { 'erp.sales_invoice.submit': 'A2' }, tools: ['read.records', 'stage.write', 'act.write'], c7: [38, 0, 14], since: '2026-09-04', regSeq: 2911, decl: 'erp.ar v7', purpose: 'Prepares invoice drafts inside rung1 for the accounts team. Declared budget: 250 drafts a month.' },
    { id: 'invoice-agent', name: 'Invoice Agent', tenant: 'kaveri-spinning', owner: 'rekha-subramanian', model: 'claude-sonnet', vendor: 'Anthropic', via: 'rung1', channel: 'Agent', mode: 'enforced', stage: 'live', grants: { 'erp.sales_invoice.submit': 'A1', 'erp.price_list.update': 'A2' }, tools: ['read.records', 'read.declaration', 'stage.write', 'act.write'], c7: [64, 1, 6], since: '2026-09-03', regSeq: 2890, decl: 'erp.ar v7', purpose: 'Drafts invoices and price-list updates inside rung1; a person submits the invoices.' },
    { id: 'collections-agent', name: 'Collections Agent', tenant: 'kaveri-spinning', owner: 'ravi-shankar', model: 'claude-sonnet', vendor: 'Anthropic', via: 'rung1', channel: 'Agent', mode: 'enforced', stage: 'live', grants: { 'erp.sales_invoice.cancel': 'A2' }, tools: ['read.records', 'read.evidence', 'read.declaration', 'stage.write', 'act.write'], c7: [3, 1, 1], key: 'key-prod-02', since: '2026-09-02', regSeq: 2871, decl: 'sales_invoice v4', purpose: 'Chases overdue receivables and proposes cancellations of disputed invoices. Cancellation is irreversible, so a person always approves.' },
    { id: 'ap-agent', name: 'ap-agent', tenant: 'kaveri-spinning', owner: 'ravi-shankar', model: 'gpt-4.1-mini', vendor: 'OpenAI', via: null, channel: 'SDK', mode: 'enforced', stage: 'live', grants: { 'erp.purchase_invoice.submit': 'A3', 'erp.purchase_order.submit': 'A2', 'erp.payment_run.submit': 'A2' }, tools: ['read.records', 'read.evidence', 'read.declaration', 'read.meter', 'stage.write', 'act.write'], c7: [118, 3, 7], key: 'key-prod-04', since: '2026-06-12', regSeq: 412, decl: 'erp.ap v5', purpose: 'Books supplier bills after PO and GRN cross-check, raises purchase orders and proposes payment runs.' },
    { id: 'bank-recon-agent', name: 'bank-recon-agent', tenant: 'kaveri-spinning', owner: 'rekha-subramanian', model: 'llama-3.1-70b', vendor: 'Meta', via: 'stack1 gateway', channel: 'SDK', mode: 'enforced', stage: 'live', grants: { 'erp.payment_entry.submit': 'A3' }, tools: ['read.records', 'read.evidence', 'stage.write', 'act.write'], c7: [241, 0, 4], key: 'key-prod-03', since: '2026-09-05', regSeq: 3010, decl: 'erp.ar v7', purpose: 'Matches bank statement lines to receipts and records payments.' },
    { id: 'stock-agent', name: 'stock-agent', tenant: 'kaveri-spinning', owner: 'priya-nair', model: 'claude-haiku', vendor: 'Anthropic', via: null, channel: 'SDK', mode: 'enforced', stage: 'live', grants: { 'erp.stock_entry.submit': 'A4', 'erp.journal_entry.submit': 'A0' }, tools: ['read.records', 'stage.write', 'act.write'], c7: [187, 1, 3], since: '2026-09-06', regSeq: 3094, decl: 'erp.stock v3', purpose: 'Moves stock between mills inside a declared radius and budget. Reads stock journals only.' },
    { id: 'gst-agent', name: 'gst-agent', tenant: 'kaveri-spinning', owner: 'venkat-raman', model: 'sarvam-m', vendor: 'Sarvam AI', via: null, channel: 'SDK', mode: 'enforced', stage: 'live', grants: { 'erp.gstr1.file': 'A1' }, tools: ['read.records', 'stage.write'], c7: [0, 1, 0], since: '2026-09-10', regSeq: 3301, decl: 'erp.ar v7', purpose: 'Prepares the monthly GSTR-1 return. A person submits and files it.' },
    { id: 'close-agent', name: 'close-agent (overnight)', tenant: 'kaveri-spinning', owner: 'meenakshi-iyer', model: 'claude-sonnet', vendor: 'Anthropic', via: null, channel: 'SDK', mode: 'enforced', stage: 'live', grants: { 'erp.period.close': 'A1', 'erp.journal_entry.submit': 'A1' }, tools: ['read.records', 'read.meter', 'stage.write'], c7: [0, 1, 2], since: '2026-09-08', regSeq: 3187, decl: 'erp.ar v7', purpose: 'Runs month-end close checks overnight and drafts provisions and the period close.' },
    { id: 'vendor-onboarding-agent', name: 'vendor-onboarding agent', tenant: 'kaveri-spinning', owner: 'priya-nair', model: 'gpt-4.1-mini', vendor: 'OpenAI', via: null, channel: 'MCP', mode: 'enforced', stage: 'live', grants: {}, tools: ['read.records', 'stage.write'], c7: [0, 0, 5], since: '2026-09-23', regSeq: 4031, decl: 'erp.ap v5', purpose: 'Collects supplier KYC and proposes new supplier records. Registered, but no grant yet.' },
    { id: 'credit-review-agent', name: 'credit-review agent', tenant: 'kaveri-spinning', owner: 'ravi-shankar', model: 'claude-sonnet', vendor: 'Anthropic', via: 'rung1', channel: 'SDK', mode: 'enforced', stage: 'scoped', grants: { 'erp.credit_limit.change': 'A1' }, tools: ['read.records', 'read.evidence', 'stage.write'], c7: [0, 0, 0], sbx: 26, since: '2026-09-18', regSeq: 3598, decl: 'erp.ar v7', purpose: 'Reviews customer exposure and drafts credit-limit changes. Proven in the sandbox tenant; waiting for its production review.' },
    { id: 'tds-agent', name: 'tds-agent', tenant: 'kaveri-spinning', owner: 'venkat-raman', model: 'claude-haiku', vendor: 'Anthropic', via: null, channel: 'MCP', mode: 'enforced', stage: 'registered', grants: {}, tools: ['read.records'], c7: [0, 0, 0], since: '2026-09-22', regSeq: 3988, decl: '—', purpose: 'Will compute TDS on supplier bills. Registered with an owner; no write type is scoped yet.' },
    { id: 'stack1-p3-agent', name: 'stack1 P3 automation agent', tenant: 'deccan-auto', ownerText: 'Deccan Auto (tenant)', model: 'stack1 gateway', vendor: 'stack1 gateway', via: null, channel: 'SDK', mode: 'enforced', stage: 'live', grants: { 'erp.journal_entry.submit@deccan': 'A1' }, tools: ['read.records', 'read.declaration', 'stage.write', 'act.write'], c7: [0, 14, 2], since: '2026-08-19', regSeq: 88, decl: 'erp.gl v4', purpose: 'Drafts month-end journal entries for Deccan Auto Components.' },
    { id: 'ledgerloop-billing-agent', name: 'LedgerLoop billing agent', tenant: 'ledgerloop-sbx', ownerText: 'LedgerLoop (design partner)', model: 'their own (not disclosed)', vendor: 'LedgerLoop', via: null, channel: 'MCP', mode: 'advisory', stage: 'live', grants: { 'll.invoice.post': 'A2' }, tools: ['read.records', 'read.evidence', 'read.declaration', 'read.meter', 'stage.write', 'act.write', 'act.escalate'], c7: [41, 3, 12], key: 'key-sbx-01', since: '2026-09-15', regSeq: 12, decl: 'll.billing v3', purpose: 'Posts invoices from LedgerLoop’s billing product into its customers’ books, through MCP.' }
  ];

  /* Proof entries 24 Sep 2026 (spec §4.6), plus a few earlier ones for agent timelines */
  var PROOF = [
    [4079, '12:48', 'erp.sales_invoice.submit', 'ar-agent', 'A2', 'committed', '', 'SINV-2026-01181 · Tirupur Knits · ₹1,18,000'],
    [4083, '13:12', 'erp.stock_entry.submit', 'stock-agent', 'A4', 'committed', '', 'STE-2026-02211 · 800 kg to Mill 1'],
    [4086, '13:40', 'erp.sales_invoice.submit', 'ar-agent', 'A2', 'committed', '', 'SINV-2026-01184 · Sri Balaji Fabrics · ₹86,400'],
    [4088, '09:12', 'erp.payment_entry.submit', 'bank-recon-agent', 'A3', 'committed', '', 'PE-2026-00968 · ₹2,10,000'],
    [4090, '10:02', 'erp.supplier.create', 'priya-nair', 'A3', 'committed', '', 'Coimbatore Castings Pvt Ltd'],
    [4091, '10:19', 'erp.purchase_invoice.submit', 'ap-agent', 'A3', 'committed', '', 'ACC-PINV-2026-00541 · ₹1,86,440'],
    [4092, '10:44', 'erp.sales_invoice.submit', 'invoice-agent', 'A1', 'refused', 'GATE.COUNTERPARTY_UNKNOWN', 'Shree Ganesh Handlooms (unregistered)'],
    [4093, '11:03', 'erp.purchase_order.submit', 'ap-agent', 'A2', 'escalated', 'OB-2026-0409', 'PO-2026-00318 · ₹6,20,000'],
    [4094, '11:21', 'platform.obligation.resolve', 'venkat-raman', '', 'committed', '', 'Approved OB-2026-0409'],
    [4095, '11:21', 'erp.purchase_order.submit', 'ap-agent', 'A2', 'committed', '', 'PO-2026-00318 · resubmitted'],
    [4096, '11:40', 'platform.obligation.resolve', 'ravi-shankar', '', 'refused', 'GATE.DUAL_CONTROL_SAME_ACTOR', 'OB-2026-0418'],
    [4097, '11:42', 'erp.payment_entry.submit', 'rekha-subramanian', 'A4', 'committed', '', 'PE-2026-00972 · ACME Textiles · ₹1,12,500'],
    [4098, '14:07', 'erp.sales_invoice.submit', 'ar-agent', 'A3', 'refused', 'GATE.PRECONDITION_FAILED', 'ACME Textiles · ₹4,20,000'],
    [4099, '14:16', 'erp.sales_invoice.submit', 'ar-agent', 'A2', 'escalated', 'OB-2026-0412', 'ACME Textiles · ₹2,40,000'],
    [4100, '15:02', 'platform.obligation.resolve', 'venkat-raman', '', 'committed', '', 'Approved OB-2026-0412'],
    [4101, '15:02', 'erp.sales_invoice.submit', 'ar-agent', 'A2', 'committed', '', 'SINV-2026-01187 · ₹2,40,000'],
    [4102, '15:10', 'erp.payment_entry.submit', 'bank-recon-agent', 'A3', 'platform', 'PLATFORM.TARGET_UNREACHABLE', 'UTR 426817 · ₹75,000'],
    [4103, '15:12', 'erp.sales_invoice.cancel', 'collections-agent', 'A2', 'escalated', 'OB-2026-0413', 'INV-2026-0834 · ₹2,00,000'],
    [4104, '15:19', 'platform.obligation.resolve', 'ravi-shankar', '', 'committed', '', 'Approved OB-2026-0413 by voice'],
    [4105, '15:19', 'erp.sales_invoice.cancel', 'collections-agent', 'A2', 'committed', '', 'INV-2026-0834 · irreversible'],
    [4106, '15:21', 'erp.supplier.create', 'vendor-onboarding-agent', null, 'refused', 'POLICY.AUTONOMY_INSUFFICIENT', 'Palani Dyes & Chemicals'],
    [4107, '15:22', 'erp.credit_limit.change', 'rekha-subramanian', 'A2', 'escalated', 'OB-2026-0414', 'ACME Textiles'],
    [4108, '15:24', 'erp.sales_invoice.submit', 'rung1-drafting-agent', 'A2', 'refused', 'GATE.BUDGET_EXHAUSTED', 'Lakshmi Garments'],
    [4109, '15:25', 'platform.obligation.resolve', 'venkat-raman', '', 'committed', '', 'Rejected OB-2026-0410'],
    [4110, '15:26', 'erp.journal_entry.submit', 'close-agent', 'A1', 'refused', 'POLICY.OBLIGATION_EXPIRED', 'JV provision'],
    [4111, '15:27', 'erp.payment_run.submit', 'ap-agent', 'A2', 'escalated', 'OB-2026-0411', '14 suppliers · ₹18,42,760'],
    [4112, '15:28', 'erp.stock_entry.submit', 'stock-agent', 'A4', 'refused', 'GATE.SANDBOX_DIVERGED', 'STE-2026-02214 · snapshot restored']
  ].map(function (r) { return { seq: r[0], at: ist('2026-09-24', r[1]), wt: r[2], actor: r[3], level: r[4], outcome: r[5], code: r[6], obj: r[7] }; });
  var EXTRA_LAST = { 'gst-agent': { at: ist('2026-09-24', '11:32'), text: 'Waiting on a person · OB-2026-0420', href: '#/work/decide/OB-2026-0420', outcome: 'escalated' },
    'credit-review-agent': { at: ist('2026-09-23', '18:05'), text: 'Sandbox proof #211 (mode: sandbox)', href: '#/assurance/proof/211', outcome: 'committed' },
    'tds-agent': null,
    'stack1-p3-agent': { at: ist('2026-09-24', '14:40'), text: 'Waiting on a person · Deccan Auto', href: '#/records/tenants/deccan-auto', outcome: 'escalated' },
    'ledgerloop-billing-agent': { at: ist('2026-09-24', '13:55'), text: 'Not done · #318 · mode: sandbox', href: '#/assurance/proof/318', outcome: 'refused' } };

  /* Autonomy history (grant changes are governed writes) */
  var HISTORY = [
    { at: ist('2026-09-24', '15:22'), agent: 'bank-recon-agent', wt: 'erp.payment_entry.submit', from: 'A3', to: 'A4', dir: 'waiting', by: 'rekha-subramanian', approver: 'meenakshi-iyer', obl: 'OB-2026-0425' },
    { at: ist('2026-09-23', '17:05'), agent: 'vendor-onboarding-agent', wt: 'erp.supplier.create', from: null, to: null, dir: 'register', by: 'priya-nair', approver: 'ravi-shankar', seq: 4031, note: 'Registered with no grant. It reads A0 Observe (no grant) on every write type until a grant is approved.' },
    { at: ist('2026-09-21', '12:10'), agent: 'invoice-agent', wt: 'erp.sales_invoice.submit', from: 'A2', to: 'A1', dir: 'lower', by: 'rekha-subramanian', seq: 4012, note: 'One press by one person. No reason was required.' },
    { at: ist('2026-09-19', '18:30'), agent: 'rung1-drafting-agent', wt: 'erp.sales_invoice.submit', from: 'A3', to: 'A2', dir: 'auto', seq: 3951, note: 'Declaration erp.ar v7 was certified by Arjun Mehta and caps drafting agents at A2 on Submit invoice. The grant followed the declaration.' },
    { at: ist('2026-09-16', '11:45'), agent: 'gst-agent', wt: 'erp.gstr1.file', from: 'A1', to: 'A2', dir: 'declined', by: 'venkat-raman', approver: 'meenakshi-iyer', seq: 3640, note: '“Filing leaves the organisation; keep a person submitting until two filing cycles are clean.”' },
    { at: ist('2026-09-12', '16:20'), agent: 'stock-agent', wt: 'erp.stock_entry.submit', from: 'A3', to: 'A4', dir: 'raise', by: 'priya-nair', approver: 'ravi-shankar', seq: 3455, note: 'Bounded to 2,000 kg per movement and ₹5,00,000 per day, as declared in erp.stock v3.' },
    { at: ist('2026-09-11', '10:05'), agent: 'ap-agent', wt: 'erp.purchase_invoice.submit', from: 'A2', to: 'A3', dir: 'raise', by: 'ravi-shankar', approver: 'meenakshi-iyer', seq: 3402, note: 'A debit note is the declared reversal plan, so A3 is allowed.' },
    { at: ist('2026-09-05', '14:40'), agent: 'bank-recon-agent', wt: 'erp.payment_entry.submit', from: null, to: 'A3', dir: 'raise', by: 'rekha-subramanian', approver: 'ravi-shankar', seq: 3011 },
    { at: ist('2026-09-02', '11:15'), agent: 'ar-agent', wt: 'erp.sales_invoice.submit', from: null, to: 'A2', dir: 'raise', by: 'venkat-raman', approver: 'meenakshi-iyer', seq: 2870 }
  ];

  /* People (humans only): resolver sets, human grants */
  var PEOPLE_X = {
    'venkat-raman': { sets: ['ar-approvers'], approves: ['erp.sales_invoice.submit', 'erp.credit_note.submit', 'erp.credit_limit.change', 'erp.journal_entry.submit', 'erp.price_list.update'], grants: { 'erp.sales_invoice.submit': 'A4', 'erp.credit_note.submit': 'A2' }, email: 'venkat.raman@kaverispinning.in', last: ist('2026-09-24', '15:25'), signIn: 'SSO · Google Workspace · step-up for every approval', roleId: 'accounts-head' },
    'ravi-shankar': { sets: ['ap-approvers', 'treasury-dual', 'close-approvers'], approves: ['erp.purchase_order.submit', 'erp.purchase_invoice.submit', 'erp.payment_run.submit', 'erp.sales_invoice.cancel', 'erp.stock_entry.submit', 'erp.period.close'], grants: { 'erp.purchase_order.submit': 'A3', 'erp.payment_entry.submit': 'A4' }, email: 'ravi.shankar@kaverispinning.in', last: ist('2026-09-24', '15:19'), signIn: 'SSO · Google Workspace · voice approvals enrolled (Tamil)', roleId: 'finance-manager' },
    'meenakshi-iyer': { sets: ['ar-approvers', 'treasury-dual', 'close-approvers', 'owners'], approves: ['erp.payment_run.submit', 'erp.period.close', 'erp.gstr1.file', 'platform.autonomy.grant', 'platform.tenant.stop'], grants: {}, email: 'meenakshi.iyer@kaverispinning.in', last: ist('2026-09-24', '14:02'), signIn: 'SSO · Google Workspace · hardware key', roleId: 'owner' },
    'rekha-subramanian': { sets: [], approves: [], grants: { 'erp.payment_entry.submit': 'A4', 'erp.credit_limit.change': 'A2' }, email: 'rekha.s@kaverispinning.in', last: ist('2026-09-24', '15:22'), signIn: 'SSO · Google Workspace', roleId: 'accounts-exec' },
    'priya-nair': { sets: ['stores-approvers'], approves: ['erp.stock_entry.submit'], grants: { 'erp.supplier.create': 'A3', 'erp.journal_entry.submit': 'A2' }, email: 'priya.nair@kaverispinning.in', last: ist('2026-09-24', '15:05'), signIn: 'SSO · Google Workspace · WhatsApp reply-approval enrolled', roleId: 'accounts-exec', approvesNote: 'Stock movements only, and only by WhatsApp reply where whatsapp_approve is declared' },
    'farah-sheikh': { sets: [], approves: [], grants: {}, email: 'farah@elan1.in', last: ist('2026-09-24', '15:05'), signIn: 'elan1 staff · SSO', roleId: 'decl-author', staff: true },
    'arjun-mehta': { sets: ['certifiers'], approves: ['platform.declaration.certify'], grants: {}, email: 'arjun@elan1.in', last: ist('2026-09-24', '12:40'), signIn: 'elan1 staff · SSO · hardware key', roleId: 'certifier', staff: true }
  };
  var SETS = {
    'ar-approvers': { label: 'ar-approvers', what: 'Submit invoice above ₹2,00,000, credit notes, credit-limit changes' },
    'ap-approvers': { label: 'ap-approvers', what: 'Purchase orders above ₹5,00,000 and supplier bills above ₹2,00,000' },
    'treasury-dual': { label: 'treasury-dual', what: 'Supplier payment runs — two of this set, always' },
    'close-approvers': { label: 'close-approvers', what: 'Period close — two of this set' },
    'stores-approvers': { label: 'stores-approvers', what: 'Stock movements (WhatsApp reply allowed)' },
    'owners': { label: 'owners', what: 'Autonomy changes, stop switch, GSTR-1 filing' },
    'certifiers': { label: 'certifiers', what: 'Certify declaration versions (elan1)' }
  };

  var KEYS = [
    { id: 'key-prod-01', prefix: 'sk_live_…9c1e', cls: 'tenant', env: 'production', tenant: 'kaveri-spinning', actor: 'ar-agent', level: 'A2', scopes: ['act'], created: '2026-09-02', last: ist('2026-09-24', '15:02'), rotateBy: '2026-12-01', status: 'active', note: 'Issued by elan1', issuedSeq: 2868 },
    { id: 'key-prod-02', prefix: 'sk_live_…3d07', cls: 'tenant', env: 'production', tenant: 'kaveri-spinning', actor: 'collections-agent', level: 'A2', scopes: ['act'], created: '2026-09-02', last: ist('2026-09-24', '15:12'), rotateBy: '2026-12-01', status: 'active', note: 'Issued by elan1', issuedSeq: 2872 },
    { id: 'key-prod-03', prefix: 'sk_live_…71b2', cls: 'tenant', env: 'production', tenant: 'kaveri-spinning', actor: 'bank-recon-agent', level: 'A3', scopes: ['act'], created: '2026-09-05', last: ist('2026-09-24', '15:10'), rotateBy: '2026-12-04', status: 'active', note: 'Issued by elan1', issuedSeq: 3012 },
    { id: 'key-prod-04', prefix: 'sk_live_…e6d4', cls: 'tenant', env: 'production', tenant: 'kaveri-spinning', actor: 'ap-agent', level: 'A3', scopes: ['act'], created: '2026-09-02', last: ist('2026-09-24', '15:27'), rotateBy: '2026-12-01', status: 'active', note: 'Issued by elan1 · successor of sk_live_…0a5c', issuedSeq: 2866 },
    { id: 'key-prod-00', prefix: 'sk_live_…0a5c', cls: 'tenant', env: 'production', tenant: 'kaveri-spinning', actor: 'ap-agent', level: 'A3', scopes: ['act'], created: '2026-06-12', last: ist('2026-09-02', '09:58'), rotateBy: null, status: 'revoked', note: 'Revoked (rotated 02 Sep 2026)', revokedAt: ist('2026-09-03', '10:00'), revokedSeq: 2891 },
    { id: 'key-sbx-01', prefix: 'sk_sbx_…4f2a', cls: 'tenant', env: 'sandbox', tenant: 'ledgerloop-sbx', actor: 'ledgerloop-billing-agent', level: 'A2', scopes: ['stage', 'act'], created: '2026-09-15', last: ist('2026-09-24', '13:55'), rotateBy: '2026-12-14', status: 'active', note: '10 writes/min, 2 concurrent' },
    { id: 'key-sbx-02', prefix: 'sk_sbx_…b811', cls: 'tenant', env: 'sandbox', tenant: 'ref-tenant', actorPerson: 'farah-sheikh', level: 'A4', scopes: ['ro', 'stage', 'act'], created: '2026-09-01', last: ist('2026-09-24', '12:30'), rotateBy: '2026-11-30', status: 'active', note: '10 writes/min, 2 concurrent' },
    { id: 'key-sbx-03', prefix: 'sk_sbx_…c390', cls: 'tenant', env: 'sandbox', tenant: 'ref-tenant', actorPerson: 'farah-sheikh', level: 'A4', scopes: ['ro', 'stage', 'act'], created: '2026-07-06', last: ist('2026-09-19', '17:44'), rotateBy: '2026-10-04', status: 'active', note: '10 writes/min, 2 concurrent' },
    { id: 'key-ctl-01', prefix: 'ctl_…77aa', cls: 'control', env: 'control', tenant: null, actorPerson: 'farah-sheikh', level: null, scopes: ['ctl'], created: '2026-09-01', last: ist('2026-09-24', '15:05'), rotateBy: '2026-11-30', status: 'active', note: 'Studio and registry · cannot reach a record store' },
    { id: 'key-ops-01', prefix: 'ops_…e021', cls: 'ops', env: 'ops', tenant: null, actorText: 'on-call', level: null, scopes: ['ro'], created: '2026-09-01', last: ist('2026-09-24', '02:11'), rotateBy: '2026-11-30', status: 'active', note: 'Read-only · no tenant data' }
  ];

  var SIGNING = [
    { id: 'k_in_20270401_9c3a', cls: 'Domain signing', status: 'retired', from: '2027-04-01T00:00:00Z', to: '2027-07-01T00:00:00Z', succ: 'k_in_20270701_4d7e', fp: 'ed25519:9c3a 51f0 8e27 44b1 … 02de', signed: '4,112 (reference tenant; pre-GA practice rotation)', custody: 'AWS KMS · ap-south-1 · ECC_NIST_EDWARDS25519', rotSeq: '1,204 (operator chain)' },
    { id: 'k_in_20270701_4d7e', cls: 'Domain signing', status: 'active', from: '2027-07-01T00:00:00Z', to: null, succ: 'k_in_20280701_b21f', fp: 'ed25519:3f9a 1c07 d2e6 5b90 … 8b2e', signed: '2,81,904 (all tenants in domain in)', custody: 'AWS KMS · ap-south-1 · ECC_NIST_EDWARDS25519', rotSeq: '1,204 (operator chain)' },
    { id: 'k_in_20280701_b21f', cls: 'Domain signing', status: 'registered', from: '2028-07-01T00:00:00Z', to: null, succ: null, fp: 'ed25519:b21f 6e44 09ca 1f73 … 7a31', signed: '0', custody: 'AWS KMS · ap-south-1 · ECC_NIST_EDWARDS25519', rotSeq: '—' },
    { id: 'k_inx_20270901_77e0', cls: 'Domain signing (dedicated, drill)', status: 'revoked', from: '2027-09-01T00:00:00Z', to: '2027-10-03T02:11:00Z', succ: 'k_inx_20271003_0be5', fp: 'ed25519:77e0 a4d2 …', signed: '9,480', custody: 'AWS KMS · ap-south-1 · ECC_NIST_EDWARDS25519', rotSeq: '—', tSuspect: '2027-10-03T02:11:00Z', reason: 'KMS audit shows a Sign call the platform cannot account for (drill DR-07)' },
    { id: 'ka_in_20270601', cls: 'Anchor client', status: 'active', from: '2027-06-01T00:00:00Z', to: null, succ: null, fp: '— (authenticates us to a timestamp authority; signs nothing a reader verifies)', signed: 'n/a', custody: 'KMS · ap-south-1', rotSeq: '—' },
    { id: 'kr_2027_01', cls: 'Release', status: 'active', from: '2027-06-20T00:00:00Z', to: '2029-06-20T00:00:00Z', succ: null, fp: 'ed25519:1d8c 7e02 …', signed: '3 releases', custody: 'Offline hardware token · holders: Sanjay Kulkarni, Rohan Kapoor', rotSeq: '—' }
  ];

  var CHANNELS = [
    { id: 'web', name: 'Web console', kind: 'web', role: 'Submit and approve', mayApprove: 'Yes', icon: 'grid', mode: 'Enforced', rule: 'The only channel that shows the whole diff, every declared gate and the policy version before anyone decides. Every write type is declared for it.', preview: ['What an approver sees', '#/work/approvals'] },
    { id: 'mobile', name: 'Mobile PWA', kind: 'mobile', role: 'Approve (responsive to 360px)', mayApprove: 'Yes', icon: 'phone', mode: 'Enforced', rule: 'Approve and reject from a phone. Changed fields first, 48px Approve and Reject with a 12px gap, the countdown beside the proposal.', preview: ['Open the phone view', '#/m/approvals'] },
    { id: 'whatsapp', name: 'WhatsApp', kind: 'messaging', role: '“a notification and low-stakes-approval channel”', mayApprove: 'By reply, only where whatsapp_approve is declared', icon: 'message', mode: 'Enforced', quote: 'messaging is read-only here, because WhatsApp is easy to spoof and shouldn’t be trusted to move money', rule: 'Reply APPROVE or REJECT works only where the write type declares whatsapp_approve: true — low value (at or below ₹1,00,000), reversible, one record. Everything else carries a deep link: “Open the console to see the change and decide.” Consent (G1) also checks WhatsApp opt-out.', preview: ['See the WhatsApp message', '#/channels/whatsapp'] },
    { id: 'voice', name: 'Voice (rung1 Voice)', kind: 'voice', role: '“Inbound only… Approvals only”', mayApprove: 'Answer a pending approval only', icon: 'phone', mode: 'Enforced', rule: 'Can only answer a pending approval — never start a write. Needs a spoken confirmation and a one-time code. Tamil or English. The recording reference is kept on the proof (e.g. VR-2026-09-24-0192 on #4,104).', preview: ['Hear the voice flow', '#/channels/voice'] },
    { id: 'email', name: 'E-mail', kind: 'email (not in the block 7 enum)', role: 'Notification plus deep link', mayApprove: 'No', icon: 'mail', mode: 'Enforced', rule: 'Delivers items into Work with a deep link. Nothing is approvable by e-mail and nothing can be submitted by e-mail.', preview: ['See the e-mail', '#/channels/email'] },
    { id: 'api', name: 'API', kind: 'api', role: 'Another system calling us', mayApprove: 'No', icon: 'code', mode: 'Enforced', quote: 'a compromised API key should never be able to wipe out invoices', rule: 'Create is declared; cancel is not. An API key reaches only the write types its declaration lists, and only through /v1/writes with a tenant token.', preview: ['HTTP API reference', '#/developers/api'] },
    { id: 'mcp', name: 'MCP', kind: 'mcp', role: 'The Doorway for third-party agents', mayApprove: 'No (may_approve: false)', icon: 'plug', mode: 'Attested advisory unless proven Enforced', rule: 'Third-party agents call the 34 MCP tools with an OAuth 2.1 bearer tenant token; static keys are not accepted. Tool descriptions are hash-pinned in the declaration. may_approve is false: an MCP agent can never resolve an obligation.', preview: ['MCP server reference', '#/developers/mcp'] }
  ];
  var CH_WORDS = { s: ['Submit', 'send'], a: ['Approve', 'approve'], sa: ['Submit and approve', 'check'], r: ['Approve by reply', 'message'], l: ['Deep link only', 'external'], v: ['Approve only · spoken + code', 'phone'], n: ['Notify + deep link', 'mail'], '': ['Cannot be attempted', 'minus'] };

  var WEBHOOKS = [
    { id: 'wh-01', url: 'https://hooks.kaverispinning.in/elan1', events: ['write.committed', 'write.refused', 'write.escalated', 'obligation.resolved', 'obligation.expired', 'declaration.certified', 'tenant.stopped'], status: 'healthy', secret: '2026-09-02', last: ist('2026-09-24', '15:28'), code: 200, ms: 184, seq: 4112, gap: 'none' },
    { id: 'wh-02', url: 'https://erp-bridge.kaveri.rung1.in/events', events: ['write.committed', 'write.refused', 'write.escalated', 'obligation.resolved'], status: 'healthy', secret: '2026-09-02', last: ist('2026-09-24', '15:28'), code: 200, ms: 96, seq: 4112, gap: 'none' },
    { id: 'wh-03', url: 'https://bi.kaverispinning.in/ingest/elan1', events: ['write.committed'], status: 'committed-only', secret: '2026-09-10', last: ist('2026-09-24', '15:19'), code: 200, ms: 241, seq: 4105, gap: 'by-design' },
    { id: 'wh-04', url: 'https://alerts.kaverispinning.in/pager', events: ['write.refused', 'obligation.expired', 'tenant.stopped'], status: 'failing', secret: '2026-08-28', last: ist('2026-09-24', '15:28'), code: 503, ms: 30000, seq: 4108, gap: 'detected', gapText: '#4,110 and #4,112 not yet delivered · retrying with backoff, attempt 3 of 5' }
  ];
  var DELIVERIES = [
    ['evt_01J8Z4…c2', 'wh-04', 'write.refused', 4112, 503, 3, ist('2026-09-24', '15:28')],
    ['evt_01J8Z4…c1', 'wh-01', 'write.refused', 4112, 200, 1, ist('2026-09-24', '15:28')],
    ['evt_01J8Z4…c0', 'wh-02', 'write.refused', 4112, 200, 1, ist('2026-09-24', '15:28')],
    ['evt_01J8Z4…b9', 'wh-01', 'write.escalated', 4111, 200, 1, ist('2026-09-24', '15:27')],
    ['evt_01J8Z4…b7', 'wh-04', 'obligation.expired', 4110, 503, 2, ist('2026-09-24', '15:26')],
    ['evt_01J8Z4…b6', 'wh-01', 'obligation.expired', 4110, 200, 1, ist('2026-09-24', '15:26')],
    ['evt_01J8Z4…b2', 'wh-01', 'obligation.resolved', 4109, 200, 1, ist('2026-09-24', '15:25')],
    ['evt_01J8Z4…a8', 'wh-04', 'write.refused', 4108, 200, 1, ist('2026-09-24', '15:24')],
    ['evt_01J8Z4…a3', 'wh-03', 'write.committed', 4105, 200, 1, ist('2026-09-24', '15:19')],
    ['evt_01J8Z4…9f', 'wh-01', 'write.committed', 4101, 200, 1, ist('2026-09-24', '15:02')],
    ['evt_01J8Z4…9e', 'wh-03', 'write.committed', 4101, 200, 1, ist('2026-09-24', '15:02')]
  ].map(function (r) { return { id: r[0], wh: r[1], type: r[2], seq: r[3], code: r[4], attempt: r[5], at: r[6] }; });

  var DISCOVERED = [
    { id: 'disc-01', name: 'Claude Desktop (MCP client)', seen: ist('2026-09-24', '12:14'), first: ist('2026-09-22', '10:03'), where: 'MCP boundary · clientInfo “claude-desktop”', token: 'Tenant token issued to Priya Nair (a person)', calls: 46, writes: 3, tools: ['read.records', 'stage.write', 'act.write'], finding: 'An MCP client acting as an agent presented a person’s token. The kernel sets actor_kind; it is never claimed. Its 3 write attempts were refused at rung 1 (POLICY.ACTOR_NOT_PERMITTED) and recorded; nothing reached ERPNext.', suggest: 'Declare it as an agent with Priya Nair as owner, or block it.', vendor: 'Anthropic', model: 'claude (client-selected)', state: 'new' },
    { id: 'disc-02', name: 'tally-sync-bot', seen: ist('2026-09-23', '21:40'), first: ist('2026-09-23', '21:38'), where: 'MCP boundary · unknown client id mcp_cli_7f21', token: 'No valid tenant token', calls: 12, writes: 0, tools: ['read.records'], finding: 'Every call was rejected (401) at the boundary before the kernel, so there are no proof entries and nothing was read.', suggest: 'Declare it if someone in Kaveri Spinning Mills runs it; otherwise block it.', vendor: 'Unknown', model: 'unknown', state: 'new' },
    { id: 'disc-03', name: 'Second caller on ar-agent’s key', seen: ist('2026-09-24', '14:51'), first: ist('2026-09-24', '14:30'), where: 'HTTP /v1/writes · new network (AS 24560, Bengaluru)', token: 'sk_live_…9c1e (bound to ar-agent)', calls: 7, writes: 2, tools: ['stage.write', 'act.write'], finding: 'A second process is using ar-agent’s production key from a network ar-agent has never used. Its 2 writes were governed as ar-agent at A2 and are waiting on a person; nothing committed.', suggest: 'Link it to ar-agent if it is a new worker, or block it and rotate the key.', vendor: '—', model: 'unknown', state: 'new', linkTo: 'ar-agent' },
    { id: 'disc-04', name: 'rung1 drafting agent · worker 2', seen: ist('2026-09-20', '09:15'), first: ist('2026-09-20', '09:02'), where: 'SDK in-process · rung1 host 2', token: 'rung1 service credential', calls: 0, writes: 0, tools: [], finding: 'A second worker of a registered agent.', state: 'linked', linkTo: 'rung1-drafting-agent', by: 'venkat-raman', seq: 3688 },
    { id: 'disc-05', name: 'Invoice Agent · mobile runner', seen: ist('2026-09-17', '16:40'), first: ist('2026-09-17', '16:40'), where: 'rung1 mobile · agent route', token: 'rung1 agent credential', calls: 0, writes: 0, tools: [], finding: 'The same Invoice Agent, running from the rung1 mobile app.', state: 'linked', linkTo: 'invoice-agent', by: 'rekha-subramanian', seq: 3591 },
    { id: 'disc-06', name: 'gpt-researcher (browser extension)', seen: ist('2026-09-18', '19:22'), first: ist('2026-09-18', '19:20'), where: 'MCP boundary · clientInfo “gpt-researcher”', token: 'Tenant token issued to Rekha Subramanian', calls: 5, writes: 1, tools: ['read.records', 'act.write'], finding: 'Blocked by Meenakshi Iyer. The block is itself a governed write.', state: 'blocked', by: 'meenakshi-iyer', seq: 3612 }
  ];

  var GRAD = [
    { id: 'erp.sales_invoice.submit', kind: 'agent', blast: 'one_counterparty', level: 'A2', sub: 1142, unam: 900, am: 11, dec: 4, exp: 3, rev: 1, corr: 0, div: 0, score: 87, verdict: 'eligible', agents: ['ar-agent'], seqs: '12,001–58,940', drill: '02 Aug 2028', computed: '24 Sep 2028, 02:10 IST', gates: [['GATE.PRECONDITION_FAILED', 120], ['GATE.COUNTERPARTY_UNKNOWN', 61], ['GATE.PRECONDITION_FAILED · credit limit', 22], ['GATE.RETENTION_WINDOW_CLOSED', 11]] },
    { id: 'erp.purchase_order.submit', kind: 'agent', blast: 'one_counterparty', level: 'A2', sub: 486, unam: 402, am: 38, dec: 9, exp: 6, rev: 2, corr: 0, div: 0, score: 61, verdict: 'ineligible', fail: 3, failText: 'approved_unamended ratio below threshold', agents: ['ap-agent'], seqs: '12,044–58,902', drill: '14 Jul 2028', computed: '24 Sep 2028, 02:10 IST' },
    { id: 'erp.stock_entry.submit', kind: 'agent', blast: 'one_record', level: 'A2', sub: 1930, unam: 1210, am: 20, dec: 2, exp: 1, rev: 0, corr: 1, div: 0, score: null, verdict: 'ineligible', fail: 4, failText: 'hard bar: corrected_after_window', agents: ['stock-agent'], seqs: '12,010–58,931', drill: '30 Jun 2028', computed: '24 Sep 2028, 02:10 IST' },
    { id: 'erp.sales_invoice.cancel', kind: 'agent', blast: 'one_counterparty', level: 'A2', sub: 612, verdict: 'never', failText: 'irreversible write type has no A3', agents: ['collections-agent'] },
    { id: 'erp.period.close', kind: 'agent', blast: 'tenant', level: 'A1', sub: 6, verdict: 'never', failText: 'tenant scope forces dual control', neverBy: true, agents: ['close-agent'] },
    { id: 'erp.purchase_invoice.submit', kind: 'agent', blast: 'one_counterparty', level: 'A3', sup: '14 Oct 2028', sub: 2318, score: 91, verdict: 'supervised', agents: ['ap-agent'], seqs: '11,902–58,939', drill: '09 Jun 2028', computed: '24 Sep 2028, 02:10 IST', samples: { routed: 23, committed: 21, declined: 1, amended: 1 } },
    { id: 'erp.journal_entry.submit', kind: 'agent', blast: 'one_record', level: 'A2', revokedOn: '03 Sep 2028', verdict: 'revoked', failText: 'GATE.SANDBOX_DIVERGED at seq 57,102 (automatic)', agents: ['close-agent'] },
    { id: 'erp.payment_entry.submit', kind: 'agent', blast: 'one_counterparty', level: 'A3', sub: 1411, verdict: 'not_measurable', failText: 'chain continuity over the window is incomplete (seq 88,120–88,164)', agents: ['bank-recon-agent'] }
  ];
  var CONDITIONS = [
    ['≥ 90 days of continuous history', false],
    ['≥ 200 records with ≥ 100 approvals', false],
    ['approved_unamended ratio ≥ threshold (set in score_v1)', false],
    ['Zero corrected_after_window and zero sandbox_diverged', true],
    ['Reversal plan drilled once, dated', true],
    ['No declaration or policy_version change in the last 30 days', false],
    ['Tenant not stopped and no open P0', false],
    ['precedent_score ≥ threshold, computed within 24 h', false]
  ];

  var ROLES = [
    { id: 'owner', label: 'Owner', who: ['meenakshi-iyer'] },
    { id: 'finance-manager', label: 'Finance manager', who: ['ravi-shankar'] },
    { id: 'accounts-head', label: 'Accounts head', who: ['venkat-raman'] },
    { id: 'accounts-exec', label: 'Accounts executive', who: ['rekha-subramanian', 'priya-nair'] },
    { id: 'decl-author', label: 'Declaration author (elan1)', who: ['farah-sheikh'] },
    { id: 'certifier', label: 'Certifier (elan1)', who: ['arjun-mehta'] },
    { id: 'auditor', label: 'Auditor (read only)', who: [] }
  ];
  /* y yes · n no · d yes, as one of two named people · s scoped to their resolver sets · o own proposals only */
  var PERMS = [
    ['Submit governed writes in the web console', 'y', 'y', 'y', 'y', 'n', 'n', 'n'],
    ['Approve or reject obligations', 's', 's', 's', 'n', 'n', 'n', 'n'],
    ['Be the second approver under dual control', 'd', 'd', 'd', 'n', 'n', 'n', 'n'],
    ['Propose an autonomy raise', 'y', 'y', 'y', 'o', 'n', 'n', 'n'],
    ['Approve an autonomy raise', 'd', 'd', 'n', 'n', 'n', 'n', 'n'],
    ['Lower autonomy or pause an agent (one press)', 'y', 'y', 'y', 'o', 'n', 'n', 'n'],
    ['Declare or block a discovered agent', 'y', 'y', 'y', 'n', 'n', 'n', 'n'],
    ['Create a sandbox key', 'y', 'y', 'y', 'y', 'y', 'n', 'n'],
    ['Request a production key or its rotation', 'y', 'y', 'n', 'n', 'n', 'n', 'n'],
    ['Revoke a key', 'y', 'y', 'y', 'n', 'n', 'n', 'n'],
    ['Throw or lift the stop switch', 'd', 'd', 'n', 'n', 'n', 'n', 'n'],
    ['Author a declaration version', 'n', 'n', 'n', 'n', 'y', 'n', 'n'],
    ['Certify a declaration version', 'n', 'n', 'n', 'n', 'n', 'd', 'n'],
    ['Manage webhook endpoints', 'y', 'y', 'n', 'n', 'n', 'n', 'n'],
    ['Invite people and change roles', 'd', 'n', 'n', 'n', 'n', 'n', 'n'],
    ['Read proof, chain standing and coverage', 'y', 'y', 'y', 'y', 'y', 'y', 'y']
  ];

  E1.data.agents = { agents: AGENTS, writeTypes: WT, tools: TOOLS, keys: KEYS, signingKeys: SIGNING, channels: CHANNELS, webhooks: WEBHOOKS, deliveries: DELIVERIES, discovered: DISCOVERED, history: HISTORY, graduation: GRAD, roles: ROLES, permissions: PERMS, people: PEOPLE_X, proof: PROOF };

  /* ------------------------------------------------------------------------
     Prototype state (per viewer; E1.store wraps storage)
     ------------------------------------------------------------------------ */
  function ov() { var o = E1.store.get('ag.ov', null); if (!o || typeof o !== 'object') o = {}; ['paused', 'grants', 'disc', 'keys', 'pending', 'wh'].forEach(function (k) { if (!o[k]) o[k] = k === 'pending' ? [] : {}; }); return o; }
  function saveOv(o) { E1.store.set('ag.ov', o); }
  function nextSeq() { var n = Number(E1.store.get('ag.seq', 4112)) + 1; E1.store.set('ag.seq', n); return n; }
  function nextObl() { var n = Number(E1.store.get('ag.obl', 425)) + 1; E1.store.set('ag.obl', n); return 'OB-2026-' + ('0000' + n).slice(-4); }

  /* ------------------------------------------------------------------------
     Lookups and small renderers
     ------------------------------------------------------------------------ */
  function person(id) { return (E1.data.people || []).filter(function (p) { return p.id === id; })[0] || null; }
  function personName(id) { var p = person(id); return p ? p.name : id; }
  function personActor(id, o) { var p = person(id); if (!p) return esc(id || '—'); return c.actor({ name: p.name, kind: p.kind === 'system' ? 'system' : 'person', role: (o && o.role) || p.role.replace(/ \(.*\)$/, ''), href: (o && o.nolink) ? null : '#/agents/people/' + p.id, size: 'sm' }); }
  function agent(id) { return AGENTS.filter(function (a) { return a.id === id; })[0] || null; }
  function wtOf(name) { return WT.filter(function (w) { return w.name === name; })[0] || null; }
  function wtName(w) { return w.alias || w.name; }
  function wtCell(name, o) { var w = wtOf(name); if (!w) return '<span class="e1-mono">' + esc(name) + '</span>'; return (o && o.link ? '<a href="#/agents/autonomy/' + esc(w.name) + '">' + esc(w.label) + '</a>' : esc(w.label)) + '<span class="ag-sub">' + esc(wtName(w)) + '</span>'; }
  function ownerName(a) { return a.owner ? personName(a.owner) : a.ownerText; }
  function isClaude(a) { return a.vendor === 'Anthropic'; }
  function claudeTag() { return '<span class="ag-claude">' + c.icon('sparkle', 12) + '<span>Built on Claude</span></span>'; }
  function modeTag(m) { return m === 'advisory' ? '<span class="ag-tag ag-tag--adv">Attested advisory</span>' : '<span class="ag-tag">' + c.icon('lock', 11) + 'Enforced</span>'; }
  function lvlNum(L) { return L === null || L === undefined ? -1 : Number(String(L).replace(/\D/g, '')); }
  function lvlName(L) { var n = lvlNum(L); return n < 0 ? 'A0 Observe (no grant)' : c.AUTONOMY[n][0] + ' ' + c.AUTONOMY[n][1]; }
  function grantOf(a, wt) { var o = ov(); var k = a.id + '|' + wt; if (Object.prototype.hasOwnProperty.call(o.grants, k)) return o.grants[k]; var g = a.grants[wt]; return g === undefined ? null : g; }
  function grantsOf(a) { var out = {}; Object.keys(a.grants).forEach(function (k) { out[k] = grantOf(a, k); }); var o = ov(); Object.keys(o.grants).forEach(function (k) { var p = k.split('|'); if (p[0] === a.id) out[p[1]] = o.grants[k]; }); return out; }
  function isPaused(a) { return !!ov().paused[a.id]; }
  function ceilingOf(w, a) { var n = w.rev === false ? 2 : 4; if (a && a.caps && a.caps[w.name]) n = Math.min(n, lvlNum(a.caps[w.name])); return n; }
  function ceilingWhy(w, a) {
    if (a && a.caps && a.caps[w.name]) return 'Declaration ' + a.decl + ' caps ' + a.name + ' at ' + a.caps[w.name] + ' on this write type.';
    if (w.rev === false) return 'Irreversible — cannot be auto-approved. A2 Propose is the ceiling.';
    return 'A5 Act broad needs dual control on the declaration itself; ' + w.decl + ' v' + w.ver + ' does not declare it.';
  }
  function effect(L, w) {
    var n = lvlNum(L);
    if (n <= 0) return 'Reads only; cannot reach rung 7';
    if (n === 1) return 'Drafts; a person submits';
    if (n === 2) return w && w.rev === false ? 'Proposes; a person always approves' : 'needs A3 — escalates to approval';
    if (n === 3) return 'Acts alone; reversal plan exists';
    if (n === 4) return 'Acts alone inside declared radius and budget';
    return 'Acts at tenant scope';
  }
  function trunc(t, n) { return t.length > n ? t.slice(0, n - 1) + '…' : t; }
  function ticks(L) { var n = lvlNum(L); return '<span class="ag-ticks" aria-hidden="true">' + [0, 1, 2, 3, 4, 5].map(function (i) { return '<i class="' + (i <= Math.max(n, 0) ? 'is-on' : '') + (i === Math.max(n, 0) ? ' is-cur' : '') + '"></i>'; }).join('') + '</span>'; }
  function stageBadge(a) {
    if (isPaused(a)) return c.badge('warning', 'Paused', { icon: 'pause' });
    return { live: c.badge('good', 'Live'), scoped: c.badge('info', 'Scoped · sandbox'), registered: c.badge('neutral', 'Registered') }[a.stage] || c.badge('neutral', a.stage);
  }
  function lastOf(a) {
    var rows = PROOF.filter(function (p) { return p.actor === a.id; });
    if (rows.length) { var r = rows[rows.length - 1]; return { at: r.at, text: '#' + fmt.num(r.seq) + ' · ' + (wtOf(r.wt) || { label: r.wt }).label, href: '#/assurance/proof/' + r.seq, outcome: r.outcome, code: r.code }; }
    return EXTRA_LAST[a.id] || null;
  }
  function when(iso) { var d = new Date(iso); var today = new Date(NOW); return (fmt.date(d) === fmt.date(today) ? 'Today, ' + fmt.time(d) : fmt.dateTime(d)); }
  function outcomeBadge(o, code) { return c.outcome(o === 'platform' ? 'platform' : o, { code: code && /^(GATE|POLICY|PLATFORM)\./.test(code) ? code : undefined, subtle: true }); }
  function daysLeft(dateStr) { return Math.ceil((new Date(dateStr + 'T23:59:59+05:30').getTime() - NOW) / DAY); }
  function agentsFor(t) { return AGENTS.filter(function (a) { return a.tenant === t; }); }
  function tenantName(id) { var t = (E1.data.tenants || []).filter(function (x) { return x.id === id; })[0]; return t ? t.name : id; }
  function approvers(exclude) { return (E1.data.people || []).filter(function (p) { return p.mayApprove === true && p.id !== exclude; }); }
  function uid() { return (E1.data.user && E1.data.user.id) || 'venkat-raman'; }
  function crumbs(extra) { return [['Agents', '#/agents/registry']].concat(extra || []); }
  /* v2: sibling screens as underline tabs in the page header (rung1 pane header); in-page views become filter chips */
  function sibTabs(id) {
    var it = E1.navItem('agents', id); if (!it || !it.group) return '';
    var list = E1.nav.agents.items.filter(function (x) { return x.group === it.group; });
    if (it.group === 'Access') list = [{ id: 'keys', label: 'API keys', href: '#/agents/keys' }, { id: 'signing', label: 'Signing keys', href: '#/agents/keys/signing' }, { id: 'policy', label: 'Key policy', href: '#/agents/keys/policy' }].concat(list.filter(function (x) { return x.id !== 'keys'; }));
    return list.length > 1 ? c.tabs(list.map(function (x) { return { id: x.id, label: x.label, href: x.href, count: x.count }; }), id, { label: it.group }) : '';
  }
  function accessTabs(id) { var t = sibTabs('keys'); return t.replace(/ is-active"/, '"').replace(/ aria-current="page"/, '').replace(new RegExp('class="e1-tab"( href="#/agents/' + (id === 'keys' ? 'keys"' : id === 'signing' ? 'keys/signing"' : id === 'policy' ? 'keys/policy"' : id + '"') + ')'), 'class="e1-tab is-active"$1 aria-current="page"'); }
  function tabsAsFilters(items, active, label) {
    return c.filters(items.map(function (t) { return { label: t.label, href: t.href, count: t.count, active: t.id === active }; }), { label: label });
  }
  function reg(path, def) { return E1.route(path, Object.assign({ layout: 'console', door: 'agents' }, def)); }
  function stateMenu(path, q, states) {
    var cur = q.state || '';
    return c.menu({ label: 'View states', icon: 'eye', size: 'sm', align: 'right', items: [{ label: 'Populated', href: E1.href(path, without(q, 'state')), checked: !cur }].concat(states.map(function (s) { var qq = Object.assign({}, q); qq.state = s[0]; return { label: s[1], href: E1.href(path, qq), checked: cur === s[0] }; })) });
  }
  function without(q, key) { var o = {}; Object.keys(q || {}).forEach(function (k) { if (k !== key) o[k] = q[k]; }); return o; }
  function variant(q, o) {
    if (q.state === 'empty' && o.empty) return c.empty(o.empty);
    if (q.state === 'error') return c.error(o.error || { title: 'We cannot show this right now.', body: 'The agent registry did not answer within 10 seconds.', reassurance: 'Nothing has changed while this page was unavailable: grants, keys and pauses are governed writes, and none were made.', code: 'PLATFORM.REGISTRY_UNAVAILABLE', action: { label: 'Try again', href: E1.href(E1.state.route.path, without(q, 'state')) } });
    if (q.state === 'loading') return '<div class="e1-stack">' + '<div class="ag-strip">' + [1, 2, 3, 4].map(function () { return c.skeleton({ kind: 'stat' }); }).join('') + '</div>' + c.skeleton({ kind: 'table', rows: 6 }) + '</div>';
    return null;
  }
  function notFound(what, id, back) {
    return c.pageHeader({ title: what + ' not found', lead: 'There is no ' + what.toLowerCase() + ' with the id “' + id + '” in ' + tenantName(E1.state.tenant) + '.' }) +
      c.empty({ title: 'Nothing is registered under “' + id + '”', why: 'Ids are exact. It may belong to another tenant, or it was never registered.', fill: 'Open the list and pick the one you meant.', action: { label: back[0], href: back[1] }, icon: 'search' });
  }
  function ruleNever() { return c.callout({ kind: 'rule', title: 'An agent can never approve. It is never in a resolver set.', body: '<p>Resolver sets contain humans only. An agent token that calls <code>act.escalate</code> is refused, and <code>may_approve</code> cannot be true for an agent.</p>' }); }

  /* ------------------------------------------------------------------------
     Global actions (registered once)
     ------------------------------------------------------------------------ */
  E1.action('ag-pause', function (el) {
    var a = agent(el.getAttribute('data-value')); if (!a) return;
    E1.confirm({
      title: 'Pause ' + a.name + '?', eyebrow: 'Governed write · platform.agent.pause', kind: 'danger', confirmLabel: 'Pause agent',
      body: '<div class="e1-prose"><p>From its next write, ' + esc(a.name) + ' is refused at rung 1 and every refusal is recorded. In-flight writes complete. Obligations it already proposed stay open for a person to decide.</p><p>Pausing takes autonomy away, so it needs one person and one press, and no reason. Resuming raises it again, so a second named person approves the resume.</p></div>',
      onConfirm: function () {
        var o = ov(), seq = nextSeq();
        o.paused[a.id] = { seq: seq, at: new Date(NOW + 60000).toISOString(), by: uid() }; saveOv(o);
        E1.toast(a.name + ' is paused from its next write. The pause is proof #' + fmt.num(seq) + '.', 'info', { title: 'Paused', action: { label: 'Open proof #' + fmt.num(seq), href: '#/assurance/proof/' + seq } });
        E1.announce(a.name + ' paused'); E1.render({ keepScroll: true });
      }
    });
  });
  E1.action('ag-resume', function (el) {
    var a = agent(el.getAttribute('data-value')); if (!a) return;
    var opts = approvers(uid()).map(function (p) { return { value: p.id, label: p.name + ' · ' + p.role.replace(/ \(.*\)$/, '') }; });
    E1.modal({
      title: 'Request to resume ' + a.name, eyebrow: 'Governed write · dual control', size: 'md',
      body: '<div class="e1-stack"><p>Resuming gives ' + esc(a.name) + ' back what it was allowed to do. That is a raise, so two named people take part: you propose, a second person approves in Work.</p>' +
        c.field('Second approver', c.select({ id: 'ag-res-appr', options: opts, value: 'meenakshi-iyer' }), { id: 'ag-res-appr', help: 'People only. You cannot approve your own request.' }) + '</div>',
      actions: [{ label: 'Cancel', kind: 'ghost' }, { label: 'Send for approval', kind: 'primary', onClick: function (e, close, m) {
        var who = m.querySelector('#ag-res-appr').value, obl = nextObl(), o = ov();
        o.paused[a.id].resume = { obl: obl, approver: who }; saveOv(o);
        E1.toast('Resume request ' + obl + ' is waiting on ' + personName(who) + '. ' + a.name + ' stays paused until then.', 'warning', { title: 'Waiting on a person', action: { label: 'Open ' + obl, href: '#/work/decide/' + obl } });
        E1.render({ keepScroll: true });
      } }]
    });
  });
  E1.action('ag-lower', function (el) {
    var p = (el.getAttribute('data-value') || '').split('|'), a = agent(p[0]), w = wtOf(p[1]); if (!a || !w) return;
    var cur = grantOf(a, w.name), n = lvlNum(cur); if (n <= 0) return;
    var to = 'A' + (n - 1);
    E1.confirm({
      title: 'Lower ' + a.name + ' to ' + lvlName(to) + '?', eyebrow: 'Governed write · platform.autonomy.grant', kind: 'primary', confirmLabel: 'Lower to ' + to,
      body: '<div class="e1-stack"><p><strong>' + esc(w.label) + '</strong> <span class="e1-mono e1-muted">' + esc(wtName(w)) + '</span></p><p>' + c.autonomy(cur, { compact: true }) + ' → ' + c.autonomy(to, { compact: true }) + '</p><p class="e1-caption">Takes effect at the next write. In-flight writes complete. Taking autonomy back needs one person, one press and no reason; it still leaves a proof entry.</p></div>',
      onConfirm: function () {
        var o = ov(), seq = nextSeq(); o.grants[a.id + '|' + w.name] = to; o.lowered = o.lowered || []; o.lowered.unshift({ at: new Date(NOW + 60000).toISOString(), agent: a.id, wt: w.name, from: cur, to: to, seq: seq, by: uid() }); saveOv(o);
        E1.toast(a.name + ' is at ' + lvlName(to) + ' on ' + w.label + ' from its next write.', 'info', { title: 'Lowered · proof #' + fmt.num(seq), action: { label: 'Open proof', href: '#/assurance/proof/' + seq } });
        E1.render({ keepScroll: true });
      }
    });
  });
  E1.action('ag-reset', function () {
    E1.store.set('ag.ov', {}); E1.store.set('ag.seq', 4112); E1.store.set('ag.obl', 425);
    E1.toast('Prototype state reset: pauses, lowered grants, discovered decisions and key changes are back to the sample data.', 'neutral'); E1.render();
  });

  E1.navAdd('agents', { id: 'map', label: 'Map', href: '#/agents/map', group: 'Agents', after: 'discovered' });

  /* ========================================================================
     REGISTRY
     ======================================================================== */
  reg('/agents/registry', {
    title: 'Agent registry', section: 'registry', wide: true, crumbs: crumbs(), keywords: 'agents model owner mcp sdk inventory pause',
    render: function (params, q) {
      var path = '/agents/registry', t = E1.state.tenant, all = agentsFor(t), o = ov();
      var nDisc = DISCOVERED.filter(function (d) { return (o.disc[d.id] || {}).state ? false : d.state === 'new'; }).length;
      var declaredLocal = DISCOVERED.filter(function (d) { return (o.disc[d.id] || {}).state === 'declared'; }).length;
      var stages = { registered: 0, scoped: 0, live: 0 };
      all.forEach(function (a) { stages[a.stage] = (stages[a.stage] || 0) + 1; });
      if (t === 'kaveri-spinning') stages.registered += declaredLocal; else nDisc = 0;
      var paused = all.filter(isPaused).length;
      var noGrant = all.filter(function (a) { var g = grantsOf(a); return a.tools.indexOf('stage.write') >= 0 && !Object.keys(g).some(function (k) { return lvlNum(g[k]) > 0; }); }).length;
      var header = c.pageHeader({
        tabs: sibTabs('registry'), title: 'Agents', eyebrow: 'Agents · registry',
        lead: all.length ? 'Who and what is acting in ' + tenantName(t) + ': ' + fmt.plural(stages.live, 'live agent') + ', each with a named owner, a model, its tools and what it may do on its own.' : 'Who and what is acting here. Nothing is registered in this tenant yet.',
        actions: stateMenu(path, q, [['empty', 'Empty'], ['loading', 'Loading'], ['error', 'Error']]) + c.button('Agent map', { href: '#/agents/map', icon: 'git-branch' }) + c.button('Register an agent', { kind: 'primary', icon: 'plus', href: '#/developers/quickstart' })
      });
      if (!all.length && !q.state) q = Object.assign({}, q, { state: 'empty' });
      var v = variant(q, { empty: { title: 'No agent is registered.', why: 'Agents reach elan1 through the SDK or MCP; register one with a sandbox key to see it here.', fill: 'Undeclared agents seen at the MCP boundary wait in Discovered until someone declares or blocks them.', icon: 'agents', action: [{ label: 'Register with a sandbox key', href: '#/developers/quickstart' }, { label: 'Open Discovered', href: '#/agents/discovered' }] } });
      if (v) return header + v;

      var strip = '<div class="ag-strip" role="list" aria-label="Agent counts">' + [
        { label: 'Registered agents', value: fmt.num(all.length + (t === 'kaveri-spinning' ? declaredLocal : 0)), note: 'Each has a named owner.' },
        { label: 'Live', value: fmt.num(stages.live - paused), note: 'Writing in production.', href: E1.href(path, { stage: 'live' }) },
        { label: 'Paused', value: fmt.num(paused), note: paused ? 'Refused at rung 1 until resumed.' : 'None paused.', href: E1.href(path, { stage: 'paused' }) },
        { label: 'Undeclared at the MCP boundary', value: fmt.num(nDisc), note: 'Nothing they ask for is written.', href: '#/agents/discovered' },
        { label: 'Write tools but no grant', value: fmt.num(noGrant), note: 'Read A0 Observe (no grant).', href: E1.href(path, { filter: 'nogrant' }) },
        { label: 'Without a named owner', value: '0', note: 'Refused: “This action needs a person behind it”.' }
      ].map(function (s) { return '<div role="listitem">' + c.stat(s) + '</div>'; }).join('') + '</div>';

      var lane = [
        ['discovered', nDisc, 'Discovered', 'Seen at the MCP boundary, not declared.', '#/agents/discovered'],
        ['registered', stages.registered, 'Registered', 'Owner named. No write type scoped.', E1.href(path, { stage: 'registered' })],
        ['scoped', stages.scoped, 'Scoped', 'Write types and grants declared; proven in the sandbox tenant.', E1.href(path, { stage: 'scoped' })],
        ['live', stages.live, 'Live', 'Governed writes in production.', E1.href(path, { stage: 'live' })]
      ];
      var laneHtml = '<nav class="ag-lane" aria-label="Staging lane: discovered, registered, scoped, live">' + lane.map(function (l, i) {
        return '<a class="ag-lane__step' + (q.stage === l[0] ? ' is-active' : '') + '" href="' + esc(l[4]) + '"' + (q.stage === l[0] ? ' aria-current="true"' : '') + '><span class="ag-lane__top"><span class="ag-lane__n">' + fmt.num(l[1]) + '</span><span class="ag-lane__k">' + esc(l[2]) + '</span></span><span class="ag-lane__d">' + esc(l[3]) + '</span>' + (i < 3 ? '<span class="ag-lane__arrow" aria-hidden="true">' + c.icon('chevron-right', 12) + '</span>' : '') + '</a>';
      }).join('') + '</nav>';

      var rows = all.slice();
      if (q.stage === 'paused') rows = rows.filter(isPaused);
      else if (q.stage) rows = rows.filter(function (a) { return a.stage === q.stage; });
      if (q.channel) rows = rows.filter(function (a) { return a.channel.toLowerCase() === q.channel; });
      if (q.mode) rows = rows.filter(function (a) { return a.mode === q.mode; });
      if (q.filter === 'nogrant') rows = rows.filter(function (a) { var g = grantsOf(a); return !Object.keys(g).some(function (k) { return lvlNum(g[k]) > 0; }); });
      if (q.q) rows = rows.filter(function (a) { return E1.fuzzy(q.q, [a.name, ownerName(a), a.model, a.channel, a.purpose].join(' ')) > 0; });

      function chip(label, key, val) { var qq = Object.assign({}, q); if (q[key] === val) delete qq[key]; else qq[key] = val; return { label: label, href: E1.href(path, qq), active: q[key] === val, count: all.filter(function (a) { return key === 'channel' ? a.channel.toLowerCase() === val : a.mode === val; }).length }; }
      var toolbar = c.toolbar(
        '<form class="ag-inline" data-ag-search role="search">' + c.searchBox({ id: 'ag-q', placeholder: 'Filter agents', value: q.q || '', label: 'Filter agents' }) + '</form>' +
        c.filters([chip('SDK', 'channel', 'sdk'), chip('MCP', 'channel', 'mcp'), chip('Agent route', 'channel', 'agent')], { label: 'Channel' }) +
        c.filters([chip('Enforced', 'mode', 'enforced'), chip('Attested advisory', 'mode', 'advisory')], { label: 'Mode' }),
        (Object.keys(without(q, 'state')).length ? '<a class="e1-filters__clear" href="#/agents/registry">Clear filters</a>' : '')
      );

      var table = c.table({
        caption: 'Registered agents in ' + tenantName(t), dense: false,
        rowHref: function (a) { return '#/agents/agent/' + a.id; },
        columns: [
          { key: 'name', label: 'Agent · owner', render: function (a) { return c.actor({ name: a.name, kind: 'agent', role: a.channel === 'Agent' ? 'agent route' : a.channel, size: 'sm' }) + '<span class="ag-sub ag-owner"><span>Owner</span>' + c.who(ownerName(a)) + '</span>'; } },
          { key: 'model', label: 'Model', render: function (a) { return '<span class="e1-mono">' + esc(a.model) + '</span>' + (isClaude(a) ? '<div>' + claudeTag() + '</div>' : (a.via ? '<span class="ag-sub">via ' + esc(a.via) + '</span>' : '')); } },
          { key: 'auto', label: 'Autonomy per write type', render: function (a) {
            var g = grantsOf(a), ks = Object.keys(g);
            if (!ks.length || !ks.some(function (k) { return lvlNum(g[k]) > 0; })) return '<div class="ag-grants"><div class="ag-grants__row">' + ticks(null) + '<span>A0 Observe (no grant)</span></div><span class="ag-more">on every write type</span></div>';
            ks.sort(function (x, y) { return lvlNum(g[y]) - lvlNum(g[x]); });
            return '<div class="ag-grants">' + ks.slice(0, 2).map(function (k) { var w = wtOf(k); return '<div class="ag-grants__row">' + ticks(g[k]) + '<span class="ag-num">' + esc(g[k] || 'A0') + '</span><span class="ag-grants__wt">' + esc(w ? w.label : k) + '</span></div>'; }).join('') + (ks.length > 2 ? '<span class="ag-more">+ ' + (ks.length - 2) + ' more</span>' : '') + '</div>';
          } },
          { key: 'tools', label: 'Tools', align: 'right', render: function (a) { return '<span class="ag-num">' + a.tools.length + '</span>'; } },
          { key: 'last', label: 'Last activity', render: function (a) { var l = lastOf(a); if (!l) return '<span class="e1-muted">No writes yet</span>'; return '<span class="e1-caption">' + esc(when(l.at)) + '</span><div>' + outcomeBadge(l.outcome) + '</div>'; } },
          { key: 'c', label: 'Last 7 days', render: function (a) { return '<dl class="ag-c7"><dt>Committed</dt><dd>' + fmt.num(a.c7[0]) + '</dd><dt>Waiting</dt><dd>' + fmt.num(a.c7[1]) + '</dd><dt>Not done</dt><dd>' + fmt.num(a.c7[2]) + '</dd></dl>'; } },
          { key: 'st', label: 'Status · mode', render: function (a) { return '<div class="ag-grants">' + stageBadge(a) + '<span>' + modeTag(a.mode) + '</span></div>'; } }
        ],
        rows: rows,
        empty: { title: 'No agent matches these filters', why: 'The filters in the address bar hide every registered agent.', fill: 'Clear them to see all ' + fmt.plural(all.length, 'agent') + '.', action: { label: 'Clear filters', href: '#/agents/registry' }, icon: 'filter' }
      });

      return header + ruleNever() + strip + laneHtml +
        c.section({ id: 'list', title: 'Registered agents', lead: 'Counts are the last 7 days, plain counts from the chain: committed, waiting on a person, not done. No scores.', body: toolbar + '<div style="margin-top:var(--space-3)">' + table + '</div>' +
          '<p class="ag-tablenote">Not done is a correct, free outcome: a refusal meters at ₹0 and is recorded like any other write. The counts open as proof entries on each agent.</p>' }) +
        '<p class="ag-foot">Prototype state is kept in this browser only. ' + c.button('Reset prototype state', { kind: 'ghost', size: 'sm', icon: 'refresh', attrs: 'data-action="ag-reset"' }) + '</p>';
    },
    mount: function (el) {
      var form = el.querySelector('[data-ag-search]');
      if (!form) return;
      var input = form.querySelector('input');
      form.addEventListener('submit', function (e) { e.preventDefault(); var q = Object.assign({}, E1.state.route.query); if (input.value) q.q = input.value; else delete q.q; E1.go('/agents/registry', q); });
      input.addEventListener('input', function () {
        var v = input.value.trim().toLowerCase();
        el.querySelectorAll('#list tbody tr').forEach(function (tr) { tr.hidden = !!v && tr.textContent.toLowerCase().indexOf(v) < 0; });
      });
    }
  });

  /* ========================================================================
     AGENT PROFILE
     ======================================================================== */
  reg('/agents/agent/:id', {
    title: function (p) { var a = agent(p.id); return a ? a.name : 'Agent'; }, section: 'registry', example: '/agents/agent/ar-agent', wide: true,
    crumbs: crumbs([['Registry', '#/agents/registry']]), keywords: 'agent profile model tools pause',
    render: function (p, q) {
      var a = agent(p.id);
      if (!a) return notFound('Agent', p.id, ['Open the registry', '#/agents/registry']);
      var path = '/agents/agent/' + a.id;
      var paused = ov().paused[a.id];
      var actions = stateMenu(path, q, [['loading', 'Loading'], ['error', 'Error']]) + c.button('Show on map', { href: '#/agents/map?focus=' + a.id, icon: 'git-branch' }) +
        (paused ? (paused.resume ? c.button('Resume requested', { disabled: true, icon: 'clock' }) : c.button('Request resume', { icon: 'play', attrs: 'data-action="ag-resume" data-value="' + esc(a.id) + '"' }))
          : (a.stage === 'live' ? c.button('Pause agent', { kind: 'danger', icon: 'pause', attrs: 'data-action="ag-pause" data-value="' + esc(a.id) + '"' }) : '')) +
        c.button('Propose an autonomy change', { kind: 'primary', href: '#/agents/autonomy/' + (Object.keys(a.grants)[0] || 'erp.supplier.create') + '/propose?agent=' + a.id });
      var header = c.pageHeader({
        eyebrow: 'Agent · act_agt_' + a.id.replace(/-/g, '_'), title: a.name,
        lead: a.purpose,
        actions: actions,
        meta: stageBadge(a) + modeTag(a.mode) + '<span>' + esc(a.channel === 'Agent' ? 'Agent route inside rung1' : a.channel) + '</span><span>Owner ' + esc(ownerName(a)) + '</span>' + (isClaude(a) ? claudeTag() : '') + '<span>' + esc(tenantName(a.tenant)) + '</span>'
      });
      var v = variant(q, {});
      if (v) return header + v;

      var pauseBanner = paused ? c.callout({ kind: 'warning', title: 'Paused since ' + fmt.dateTime(paused.at) + ' by ' + personName(paused.by) + '.', body: '<p>Every write it attempts is refused at rung 1 and recorded. The pause is <a href="#/assurance/proof/' + paused.seq + '">proof #' + fmt.num(paused.seq) + '</a>. ' + (paused.resume ? 'Resume request <a href="#/work/decide/' + esc(paused.resume.obl) + '">' + esc(paused.resume.obl) + '</a> is waiting on ' + esc(personName(paused.resume.approver)) + '.' : 'Resuming is a raise, so a second named person approves it.') + '</p>' }) : '';
      var scopedBanner = a.stage === 'scoped' ? c.callout({ kind: 'info', title: 'Scoped, not live.', body: '<p>' + esc(a.name) + ' has proven all three outcomes in the sandbox tenant (' + fmt.num(a.sbx || 0) + ' proof entries, mode: sandbox). It writes to production only after the production review. <a href="#/work/reviews">Open reviews</a>.</p>' }) : a.stage === 'registered' ? c.callout({ kind: 'info', title: 'Registered with an owner. No write type is scoped yet.', body: '<p>Until a declaration version scopes its write types and a grant is approved, it reads A0 Observe (no grant) everywhere and cannot reach rung 7.</p>' }) : '';

      /* Autonomy grants */
      var g = grantsOf(a);
      var tenantWts = WT.filter(function (w) { return w.tenant === a.tenant; });
      var granted = tenantWts.filter(function (w) { return Object.prototype.hasOwnProperty.call(g, w.name); });
      var ungranted = tenantWts.filter(function (w) { return !Object.prototype.hasOwnProperty.call(g, w.name); });
      /* An agent with no grant still shows the write type it was registered for, reading A0 Observe (no grant) */
      if (!granted.length && a.id === 'vendor-onboarding-agent') { granted = [wtOf('erp.supplier.create')]; ungranted = ungranted.filter(function (w) { return w.name !== 'erp.supplier.create'; }); }
      function grantRow(w) { return { w: w, g: Object.prototype.hasOwnProperty.call(g, w.name) ? g[w.name] : null }; }
      var gcols = [
        { key: 'wt', label: 'Write type', render: function (r) { return wtCell(r.w.name, { link: true }); } },
        { key: 'g', label: 'Grant · ceiling', render: function (r) { return c.autonomy(r.g, { compact: true }) + '<span class="ag-sub">ceiling A' + ceilingOf(r.w, a) + '</span>'; } },
        { key: 'e', label: 'What rung 6 does', render: function (r) { return '<span class="e1-caption">' + esc(effect(r.g, r.w)) + '</span>'; } },
        { key: 'act', label: 'Change', render: function (r) {
          var n = lvlNum(r.g), out = '';
          if (n < ceilingOf(r.w, a)) out += c.button('Propose a raise', { size: 'sm', href: '#/agents/autonomy/' + r.w.name + '/propose?agent=' + a.id });
          if (n > 0) out += c.button('Lower to A' + (n - 1), { size: 'sm', kind: 'ghost', attrs: 'data-action="ag-lower" data-value="' + esc(a.id + '|' + r.w.name) + '"' });
          return '<div class="ag-inline">' + (out || '<span class="e1-caption e1-muted">At its ceiling</span>') + '</div>';
        } }
      ];
      var grantTable = c.table({ caption: 'Autonomy grants for ' + a.name, columns: gcols, rows: granted.map(grantRow), empty: { title: 'No grant on any write type', why: a.name + ' reads A0 Observe (no grant) everywhere.', fill: 'Propose a grant; a second named person approves it.', compact: true } });
      var ungrantedHtml = ungranted.length ? '<details class="e1-details" style="margin-top:var(--space-3)"><summary class="e1-caption">Show the ' + ungranted.length + ' other write types in this tenant — all read A0 Observe (no grant)</summary><div style="margin-top:var(--space-2)">' +
        c.table({ caption: 'Write types with no grant', dense: true, columns: gcols, rows: ungranted.map(grantRow) }) + '</div></details>' : '';

      /* Tools */
      var toolRows = a.tools.map(function (tid) { return TOOLS.filter(function (t) { return t.id === tid; })[0]; }).filter(Boolean);
      var toolTable = c.table({
        caption: 'Tools and their pinned descriptions', columns: [
          { key: 'id', label: 'Tool', render: function (t) { return '<span class="e1-mono">' + esc(t.id) + '</span>'; } },
          { key: 'scope', label: 'Scope', render: function (t) { return '<span class="ag-tag">' + esc(t.scope) + '</span>'; } },
          { key: 'desc', label: 'Description it was shown', render: function (t) { return '<span class="ag-desc">' + esc(t.desc) + '</span>'; } },
          { key: 'hash', label: 'Pinned hash', nowrap: true, render: function (t) { return c.hash(pinHash(t.head, t.tail, t.id + a.decl), { head: 4, tail: 4, label: 'Description hash' }) + '<span class="ag-sub">in ' + esc(a.decl) + '</span>'; } },
          { key: 'st', label: 'Status', render: function (t) { return t.prev && a.decl === 'erp.ar v7' ? c.badge('info', 'Changed', { icon: 'git-branch' }) + '<span class="ag-sub" style="font-family:var(--font-ui)">version change, v6 → v7</span>' : '<span class="e1-caption e1-muted">Unchanged</span>'; } }
        ], rows: toolRows, empty: { title: 'No tools', why: 'This agent has no tool in its allow-list, so it cannot call elan1.', compact: true }
      });
      var act = TOOLS.filter(function (t) { return t.id === 'act.write'; })[0];
      var changed = a.decl === 'erp.ar v7' && a.tools.indexOf('act.write') >= 0;
      var descHistory = changed ? c.card({ title: 'Description version history · act.write', eyebrow: 'A changed description shows as a version change, not a silent update', body:
        c.diff([{ field: 'Description', before: act.prev.desc, after: act.desc, material: true }, { field: 'description_sha256', before: act.prev.head + '…' + act.prev.tail, after: act.head + '…' + act.tail, mono: true }, { field: 'Pinned in', before: 'erp.ar v6', after: 'erp.ar v7', mono: true }], { caption: 'act.write description, v6 → v7', collapse: false }) +
        '<div style="margin-top:var(--space-4)">' + c.timeline([
          { time: '19 Sep 2026, 18:30 IST', title: 'Description changed · version change · certified by Arjun Mehta', body: 'Hash 9e02…b3f1 pinned in erp.ar v7. The agent was shown the new text from its next call; nothing changed silently.', state: 'info', href: '#/records/declarations/erp.ar/v/7' },
          { time: '11 Sep 2026, 16:05 IST', title: 'Pinned in erp.ar v6 · certified by Arjun Mehta', body: 'Hash d41c…07aa.', state: 'neutral', href: '#/records/declarations/erp.ar/v/6' }
        ]) + '</div>' }) : '';

      /* Recent governed writes */
      var writes = PROOF.filter(function (r) { return r.actor === a.id; }).slice().reverse();
      var writesTable = c.table({
        caption: 'Recent governed writes by ' + a.name, rowHref: function (r) { return '#/assurance/proof/' + r.seq; },
        columns: [
          { key: 'seq', label: 'Proof', nowrap: true, render: function (r) { return '<span class="ag-num">#' + fmt.num(r.seq) + '</span><span class="ag-sub" style="font-family:var(--font-ui)">' + esc(fmt.time(r.at)) + '</span>'; } },
          { key: 'wt', label: 'Write type · autonomy then', render: function (r) { return esc((wtOf(r.wt) || { label: r.wt }).label) + '<span class="ag-sub">' + esc(r.wt) + ' · ' + esc(r.level === null ? 'A0 (no grant)' : r.level) + '</span>'; } },
          { key: 'obj', label: 'Record', render: function (r) { return '<span class="e1-caption">' + esc(r.obj) + '</span>'; } },
          { key: 'o', label: 'Outcome', render: function (r) { return c.outcome(r.outcome, { subtle: true }) + (/\./.test(r.code || '') ? '<span class="ag-sub">' + esc(r.code) + '</span>' : ''); } },
          { key: 'go', label: 'Next', nowrap: true, render: function (r) { if (r.outcome === 'escalated' && /^OB-/.test(r.code)) return '<a href="#/work/decide/' + esc(r.code) + '">' + esc(r.code) + '</a>'; if (r.outcome === 'refused' || r.outcome === 'platform') return '<a href="#/work/not-done/' + r.seq + '">Why not done</a>'; return '<a href="#/assurance/proof/' + r.seq + '/path">Right path</a>'; } }
        ], rows: writes,
        empty: { title: 'No governed writes yet', why: a.stage === 'live' ? 'This agent has not attempted a write in production.' : 'It is not live, so nothing it does reaches the production chain.', fill: a.stage === 'scoped' ? 'Its sandbox proof entries are marked mode: sandbox.' : 'Writes, refusals and escalations all appear here once it acts.', action: { label: 'Open the proof list', href: '#/assurance/proof' }, compact: true }
      });

      /* Side panel */
      var key = a.key ? KEYS.filter(function (k) { return k.id === a.key; })[0] : null;
      var identity = c.card({ title: 'Identity', body: c.kv([
        ['actor_id', 'act_agt_' + a.id.replace(/-/g, '_'), { mono: true }],
        ['actor_kind', 'Agent — set by the kernel, never claimed'],
        ['Registered', fmt.date(ist(a.since)) + ' · proof #' + fmt.num(a.regSeq)],
        ['Declaration', a.decl, { mono: true }],
        ['Credential', key ? '<a href="#/agents/keys/' + key.id + '" class="e1-mono">' + esc(key.prefix) + '</a> · tenant token · ' + esc(key.scopes.join(', ')) : (a.channel === 'MCP' ? 'OAuth 2.1 tenant token, 5–15 min; static keys are not accepted on MCP' : 'In-process SDK — short-lived tenant tokens, no static key'), { html: true }]
      ], { compact: true }) });
      var model = c.card({ title: 'Model', body: c.kv([['Model', a.model, { mono: true }], ['Vendor', a.vendor], ['Reached through', a.via || (a.channel === 'MCP' ? 'MCP (their own runtime)' : 'SDK')]], { compact: true }) +
        (isClaude(a) ? '<div class="e1-callout e1-callout--info" style="margin-top:var(--space-3)"><span class="e1-callout__icon" aria-hidden="true">' + c.icon('sparkle', 16) + '</span><div><p class="e1-callout__title"><span class="e1-label">Built on Claude</span></p><div class="e1-callout__body"><p>This agent’s model is Claude, made by Anthropic. elan1 records what the agent wrote and why; it does not grade the model.</p></div></div></div>' : '') +
        '<p class="e1-caption e1-muted" style="margin-top:var(--space-3)">A model may produce a write intent. It may never produce an allow (I1).</p>' });
      var owner = c.card({ title: 'Owner and delegation', body: '<div class="ag-kvs">' + (a.owner ? personActor(a.owner) : '<span>' + esc(a.ownerText) + '</span>') +
        '<p class="e1-caption">The owner is the person behind the agent (its sponsor). An agent token with no sponsor is refused: “This action needs a person behind it.”</p>' +
        (a.delegation ? c.kv([['Delegated to', personName(a.delegation.to)], ['For', a.delegation.what], ['Write type', a.delegation.wt, { mono: true }], ['Window', fmt.date(ist(a.delegation.from)) + ' – ' + fmt.date(ist(a.delegation.until))], ['Granted by', '<a href="#/assurance/proof/' + a.delegation.seq + '">proof #' + fmt.num(a.delegation.seq) + '</a> · dual control', { html: true }]], { compact: true }) : '<p class="e1-caption e1-muted">No delegation is live.</p>') +
        '<p class="e1-caption e1-muted">A delegation passes a person’s duties to another person. It never names an agent and never raises autonomy. <a href="#/records/actors/' + esc(a.owner || a.id) + '">Actors and delegations</a></p></div>' });
      var counts = c.card({ title: 'Last 7 days', body: c.kv([['Committed', fmt.num(a.c7[0]), { mono: true }], ['Waiting on a person', '<a class="ag-num" href="#/work/approvals?filter=anyone">' + fmt.num(a.c7[1]) + '</a>', { html: true }], ['Not done', '<a class="ag-num" href="#/work/not-done">' + fmt.num(a.c7[2]) + '</a>', { html: true }]], { compact: true }) + '<p class="e1-caption e1-muted" style="margin-top:var(--space-2)">Plain counts from the chain. Not done meters at ₹0.</p>' });

      var main = '<div class="e1-stack e1-stack--lg">' + pauseBanner + scopedBanner +
        c.section({ id: 'autonomy', title: 'Autonomy grants', lead: 'Per write type. A missing grant reads A0 Observe (no grant), in the same form as an explicit A0. Raising needs two named people; lowering is one press.', actions: c.button('History', { size: 'sm', kind: 'ghost', href: '#/agents/autonomy/history?agent=' + a.id, icon: 'history' }), body: grantTable + ungrantedHtml }) +
        c.section({ id: 'tools', title: 'Tools', lead: 'The hash-pinned descriptions it was shown. A changed description shows as a version change, not a silent update.', actions: c.button('All tools', { size: 'sm', kind: 'ghost', href: '#/agents/tools' }), body: toolTable + (descHistory ? '<div style="margin-top:var(--space-4)">' + descHistory + '</div>' : '') }) +
        c.section({ id: 'writes', title: 'Recent governed writes', lead: 'Committed, waiting and not done — a timeline of successes only would lie by omission.', actions: c.button('All in proof', { size: 'sm', kind: 'ghost', href: '#/assurance/proof' }), body: writesTable }) + '</div>';
      var side = '<aside class="e1-stack">' + identity + model + owner + counts + ruleNever() + '</aside>';
      return header + '<div class="e1-split">' + main + side + '</div>';
    }
  });

  /* ========================================================================
     DISCOVERED (undeclared agents inbox)
     ======================================================================== */
  function discState(d) { var s = (ov().disc[d.id] || {}).state; return s || d.state; }
  reg('/agents/discovered', {
    title: 'Discovered agents', section: 'discovered', crumbs: crumbs(), keywords: 'shadow undeclared inbox declare block',
    render: function (p, q) {
      var path = '/agents/discovered', tab = q.tab || 'new', o = ov();
      var counts = { new: 0, linked: 0, blocked: 0, declared: 0 };
      DISCOVERED.forEach(function (d) { counts[discState(d)]++; });
      var header = c.pageHeader({ tabs: sibTabs('discovered'), eyebrow: 'Agents · discovered', title: 'Discovered agents', lead: 'Agents seen at the MCP or API boundary that nobody has declared. Each gets Declare, Link to an existing agent, or Block. Nothing enters Work without a declaration.', actions: stateMenu(path, q, [['empty', 'Empty'], ['error', 'Error']]) + c.button('Staging lane', { href: '#/agents/registry', icon: 'rows' }) });
      var v = variant(q, { empty: { title: 'No undeclared agent has been seen', why: 'Every caller at the MCP and API boundary in the last 30 days matched a registered agent or a person.', fill: 'When an unknown client calls, it lands here as Undeclared, and its write attempts are refused and recorded until someone declares it.', action: { label: 'Open the registry', href: '#/agents/registry' }, icon: 'search' } });
      if (v) return header + v;
      var tabs = tabsAsFilters([
        { id: 'new', label: 'Action needed', href: E1.href(path, { tab: 'new' }), count: counts.new },
        { id: 'declared', label: 'Declared', href: E1.href(path, { tab: 'declared' }), count: counts.declared },
        { id: 'linked', label: 'Linked', href: E1.href(path, { tab: 'linked' }), count: counts.linked },
        { id: 'blocked', label: 'Blocked', href: E1.href(path, { tab: 'blocked' }), count: counts.blocked }
      ], tab, 'Show');
      var list = DISCOVERED.filter(function (d) { return discState(d) === tab; });
      var body = list.length ? '<div class="e1-stack">' + list.map(function (d) {
        var st = o.disc[d.id] || {};
        var acts = tab === 'new' ? '<div class="ag-inline">' + c.button('Declare', { kind: 'primary', size: 'sm', icon: 'plus', attrs: 'data-ag-disc="declare" data-id="' + d.id + '"' }) + c.button('Link to existing', { size: 'sm', icon: 'chain', attrs: 'data-ag-disc="link" data-id="' + d.id + '"' }) + c.button('Block', { size: 'sm', kind: 'danger', icon: 'stop', attrs: 'data-ag-disc="block" data-id="' + d.id + '"' }) + '</div>'
          : '<p class="e1-caption">' + esc({ linked: 'Linked to ', blocked: 'Blocked by ', declared: 'Declared by ' }[tab]) + (tab === 'linked' ? '<a href="#/agents/agent/' + esc(st.linkTo || d.linkTo) + '">' + esc((agent(st.linkTo || d.linkTo) || {}).name || d.linkTo) + '</a> by ' + esc(personName(st.by || d.by)) : esc(personName(st.by || d.by))) + ' · <a href="#/assurance/proof/' + (st.seq || d.seq) + '">proof #' + fmt.num(st.seq || d.seq) + '</a>' + (tab === 'declared' ? ' · now in the registry as Registered, A0 Observe (no grant)' : '') + '</p>';
        return c.card({ cls: 'ag-disc', eyebrow: d.where, title: d.name, actions: tab === 'new' ? c.badge('warning', 'Undeclared', { icon: 'alert' }) : c.badge('neutral', { linked: 'Linked', blocked: 'Blocked', declared: 'Declared' }[tab]), body:
          '<p>' + esc(d.finding) + '</p>' +
          '<div style="margin-top:var(--space-3)">' + c.kv([['First seen', fmt.dateTime(d.first)], ['Last seen', fmt.dateTime(d.seen)], ['Credential presented', d.token], ['Calls', fmt.num(d.calls) + (d.writes ? ' · ' + fmt.plural(d.writes, 'write attempt') : ' · no write attempts')], ['Tools asked for', d.tools.length ? d.tools.join(', ') : '—', { mono: true }], ['Model', d.model]], { cols: 2, compact: true }) + '</div>' +
          (d.suggest && tab === 'new' ? '<p class="e1-caption" style="margin-top:var(--space-3)"><strong>What would settle it:</strong> ' + esc(d.suggest) + '</p>' : ''), footer: acts });
      }).join('') + '</div>' : c.empty({ title: { new: 'Nothing needs a decision', linked: 'Nothing is linked yet', blocked: 'Nothing is blocked', declared: 'Nothing has been declared from here yet' }[tab], why: tab === 'new' ? 'Every agent seen at the boundary has been declared, linked or blocked.' : 'Items move here when someone decides them in Action needed.', action: { label: 'Open Action needed', href: E1.href(path, { tab: 'new' }) }, compact: true });
      return header + c.callout({ kind: 'rule', title: 'Found is not accepted.', body: '<p>A discovered agent writes nothing: its write attempts are refused and recorded until it is declared with a named owner. Declaring it gives it A0 Observe (no grant) on every write type; grants are proposed separately and need two named people.</p>' }) +
        '<div style="margin-top:var(--space-5)">' + tabs + '</div><div style="margin-top:var(--space-4)">' + body + '</div>';
    },
    mount: function (el) {
      el.addEventListener('click', function (e) {
        var b = e.target.closest('[data-ag-disc]'); if (!b) return;
        var d = DISCOVERED.filter(function (x) { return x.id === b.getAttribute('data-id'); })[0]; if (!d) return;
        var kind = b.getAttribute('data-ag-disc');
        function done(state, extra, msg) { var o = ov(), seq = nextSeq(); o.disc[d.id] = Object.assign({ state: state, seq: seq, by: uid() }, extra || {}); saveOv(o); E1.toast(msg + ' Proof #' + fmt.num(seq) + '.', 'info', { title: { declared: 'Declared', linked: 'Linked', blocked: 'Blocked' }[state], action: { label: 'Open proof', href: '#/assurance/proof/' + seq } }); E1.render({ keepScroll: true }); }
        if (kind === 'block') {
          E1.confirm({ title: 'Block ' + d.name + '?', eyebrow: 'Governed write · platform.actor.block', kind: 'danger', confirmLabel: 'Block', body: '<p>Every later call from this client is refused and recorded. Blocking takes nothing away from a registered agent, so one person and one press is enough.</p>' + (d.id === 'disc-03' ? '<p class="e1-caption">It uses ar-agent’s key. Rotate that key after blocking: <a href="#/agents/keys/key-prod-01/rotate">Request rotation</a>.</p>' : ''), onConfirm: function () { done('blocked', {}, d.name + ' is blocked.'); } });
        } else if (kind === 'link') {
          var opts = agentsFor(E1.state.tenant).map(function (a) { return { value: a.id, label: a.name }; });
          E1.modal({ title: 'Link ' + d.name + ' to a registered agent', eyebrow: 'Governed write · platform.actor.link', body: '<div class="e1-stack"><p>Use this when the caller is the same agent running somewhere new. It inherits that agent’s owner, grants and tools — nothing more.</p>' + c.field('Registered agent', c.select({ id: 'ag-link', options: opts, value: d.linkTo || opts[0].value }), { id: 'ag-link' }) + '</div>',
            actions: [{ label: 'Cancel', kind: 'ghost' }, { label: 'Link', kind: 'primary', onClick: function (e2, close, m) { var to = m.querySelector('#ag-link').value; done('linked', { linkTo: to }, d.name + ' is linked to ' + agent(to).name + '.'); } }] });
        } else {
          var owners = (E1.data.people || []).filter(function (x) { return x.kind === 'person'; }).map(function (x) { return { value: x.id, label: x.name + ' · ' + x.role.replace(/ \(.*\)$/, '') }; });
          E1.modal({ title: 'Declare ' + d.name, eyebrow: 'Governed write · platform.actor.register', size: 'md', body: '<div class="e1-stack">' +
            c.field('Agent name', c.input({ id: 'ag-dn', value: d.name.replace(/ \(.*\)$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }), { id: 'ag-dn', required: true, help: 'Lower case, as it will appear on every proof entry.' }) +
            c.field('Owner', c.select({ id: 'ag-do', options: [{ value: '', label: 'Choose a person' }].concat(owners), value: d.id === 'disc-01' ? 'priya-nair' : '' }), { id: 'ag-do', required: true, help: 'People only. The owner is the person behind the agent.' }) +
            c.field('Model', c.input({ id: 'ag-dm', value: d.model === 'unknown' ? '' : d.model, placeholder: 'e.g. claude-sonnet' }), { id: 'ag-dm', optional: true }) +
            c.callout({ kind: 'info', title: 'It starts at A0 Observe (no grant) on every write type.', body: '<p>Grants are proposed afterwards; each needs two named people.</p>' }) + '</div>',
            actions: [{ label: 'Cancel', kind: 'ghost' }, { label: 'Declare agent', kind: 'primary', onClick: function (e2, close, m) {
              var ow = m.querySelector('#ag-do'), nm = m.querySelector('#ag-dn');
              if (!ow.value || !nm.value.trim()) { ow.setAttribute('aria-invalid', ow.value ? 'false' : 'true'); nm.setAttribute('aria-invalid', nm.value.trim() ? 'false' : 'true'); E1.toast('Name the agent and choose its owner. Every agent needs a person behind it.', 'warning'); return false; }
              done('declared', { name: nm.value.trim(), owner: ow.value }, nm.value.trim() + ' is registered with ' + personName(ow.value) + ' as owner, at A0 Observe (no grant).');
            } }] });
        }
      });
    }
  });

  /* ========================================================================
     MAP (agent ↔ tool ↔ system)
     ======================================================================== */
  var SYSTEMS = [
    { id: 'erpnext', label: 'ERPNext', sub: 'kaveri.rung1.in · system of record' },
    { id: 'sandbox', label: 'Shadow sandbox', sub: 'snapshot, apply, re-run gates' },
    { id: 'chain', label: 'Proof chain and meter', sub: 'per-tenant, hash-chained' },
    { id: 'registry', label: 'Declaration registry', sub: 'seven blocks, explicit versions' },
    { id: 'people', label: 'People (resolver sets)', sub: 'humans only decide' }
  ];
  reg('/agents/map', {
    title: 'Agent map', section: 'map', wide: true, crumbs: crumbs(), keywords: 'graph diagram tools systems',
    render: function (p, q) {
      var list = agentsFor(E1.state.tenant).filter(function (a) { return a.stage !== 'registered'; });
      var focus = q.focus && agent(q.focus) ? q.focus : null;
      var header = c.pageHeader({ tabs: sibTabs('map'), eyebrow: 'Agents · map', title: 'Agent map', lead: 'Which agent can call which tool, and where each tool lands. Write-capable edges are drawn heavy; read edges are dotted. Select an agent to trace it.', actions: (focus ? c.button('Show all agents', { href: '#/agents/map', icon: 'x' }) : '') + c.button('Registry', { href: '#/agents/registry', icon: 'list' }) });
      if (!list.length) return header + c.empty({ title: 'Nothing to draw', why: 'No agent in this tenant has tools yet.', action: { label: 'Open the registry', href: '#/agents/registry' } });
      var tools = TOOLS.filter(function (t) { return list.some(function (a) { return a.tools.indexOf(t.id) >= 0; }); });
      var rowH = 44, top = 34, W = 1080;
      var H = Math.max(list.length * rowH, tools.length * 58, SYSTEMS.length * 80) + top + 16;
      var ax = 12, aw = 262, tx = 450, tw = 176, sx = 800, sw = 268;
      function ay(i) { return top + i * ((H - top - 16) / list.length) + 4; }
      function ty(i) { return top + i * ((H - top - 16) / tools.length) + 6; }
      function sy(i) { return top + i * ((H - top - 16) / SYSTEMS.length) + 10; }
      var ah = Math.min(36, (H - top - 16) / list.length - 8), th = 40, shh = 52;
      function kindOf(tid) { return /^act\./.test(tid) ? 'write' : tid === 'stage.write' ? 'stage' : 'read'; }
      function curve(x1, y1, x2, y2) { var mx = (x1 + x2) / 2; return 'M' + x1 + ',' + y1 + ' C' + mx + ',' + y1 + ' ' + mx + ',' + y2 + ' ' + x2 + ',' + y2; }
      var edges = '', nodes = '', edgeRows = [];
      list.forEach(function (a, i) {
        a.tools.forEach(function (tid) {
          var ti = tools.map(function (t) { return t.id; }).indexOf(tid); if (ti < 0) return;
          var k = kindOf(tid), dim = focus && focus !== a.id;
          edges += '<path class="ag-edge ag-edge--' + k + (dim ? ' is-dim' : '') + '" d="' + curve(ax + aw, ay(i) + ah / 2, tx, ty(ti) + th / 2) + '"><title>' + esc(a.name + ' → ' + tid) + '</title></path>';
          edgeRows.push({ a: a, tid: tid, k: k });
        });
      });
      tools.forEach(function (t, i) {
        var si = SYSTEMS.map(function (s) { return s.id; }).indexOf(t.system); var k = kindOf(t.id);
        var dim = focus && agent(focus).tools.indexOf(t.id) < 0;
        edges += '<path class="ag-edge ag-edge--' + k + (dim ? ' is-dim' : '') + '" d="' + curve(tx + tw, ty(i) + th / 2, sx, sy(si) + shh / 2) + '"><title>' + esc(t.id + ' → ' + SYSTEMS[si].label) + '</title></path>';
        if (t.id === 'act.write') { var s2 = SYSTEMS.map(function (s) { return s.id; }).indexOf('sandbox'); edges += '<path class="ag-edge ag-edge--write' + (dim ? ' is-dim' : '') + '" d="' + curve(tx + tw, ty(i) + th / 2, sx, sy(s2) + shh / 2) + '"><title>act.write → Shadow sandbox (every write, production included)</title></path>'; }
      });
      list.forEach(function (a, i) {
        var dim = focus && focus !== a.id, y = ay(i);
        var gg = grantsOf(a), top1 = Object.keys(gg).sort(function (x, y2) { return lvlNum(gg[y2]) - lvlNum(gg[x]); })[0];
        nodes += '<a href="#/agents/map?focus=' + esc(a.id) + '" aria-label="' + esc(a.name + ', agent. Trace its edges') + '"' + (dim ? ' class="is-dim"' : '') + '><rect x="' + ax + '" y="' + y + '" width="' + aw + '" height="' + ah + '" rx="3" fill="var(--zone-runtime-bg)" stroke="var(--zone-runtime)" stroke-width="' + (focus === a.id ? 2.5 : 1.2) + '"/>' +
          '<text x="' + (ax + 10) + '" y="' + (y + 15) + '" font-size="12" font-weight="600">' + esc(a.name) + '</text>' +
          '<text class="ag-map__meta" x="' + (ax + 10) + '" y="' + (y + 28) + '">' + esc(trunc('Agent · ' + a.channel + ' · ' + (top1 ? (gg[top1] || 'A0') + ' on ' + (wtOf(top1) || { label: top1 }).label : 'A0 (no grant)') + (isPaused(a) ? ' · paused' : ''), 44)) + '</text></a>';
      });
      tools.forEach(function (t, i) {
        var y = ty(i), k = kindOf(t.id), dim = focus && agent(focus).tools.indexOf(t.id) < 0;
        nodes += '<g' + (dim ? ' class="is-dim"' : '') + '><rect x="' + tx + '" y="' + y + '" width="' + tw + '" height="' + th + '" rx="3" fill="var(--zone-kernel-bg)" stroke="var(--zone-kernel)" stroke-width="' + (k === 'write' ? 2.2 : 1) + '"/>' +
          '<text x="' + (tx + 10) + '" y="' + (y + 17) + '" font-size="12" font-weight="600" style="font-family:var(--font-mono)">' + esc(t.id) + '</text>' +
          '<text class="ag-map__meta" x="' + (tx + 10) + '" y="' + (y + 31) + '">' + esc('scope ' + t.scope + (k === 'write' ? ' · can change a record' : k === 'stage' ? ' · no side effects' : ' · read only')) + '</text></g>';
      });
      SYSTEMS.forEach(function (s, i) {
        var y = sy(i), z = s.id === 'erpnext' ? 'external' : s.id === 'people' ? 'people' : 'kernel';
        nodes += '<g><rect x="' + sx + '" y="' + y + '" width="' + sw + '" height="' + shh + '" rx="3" fill="var(--zone-' + z + '-bg)" stroke="var(--zone-' + z + ')" stroke-width="1.2"/>' +
          '<text x="' + (sx + 10) + '" y="' + (y + 21) + '" font-size="12" font-weight="600">' + esc(s.label) + '</text>' +
          '<text class="ag-map__meta" x="' + (sx + 10) + '" y="' + (y + 37) + '">' + esc(s.sub) + '</text></g>';
      });
      var cols = '<text class="ag-map__col" x="' + ax + '" y="16">AGENTS (' + list.length + ')</text><text class="ag-map__col" x="' + tx + '" y="16">TOOLS (' + tools.length + ')</text><text class="ag-map__col" x="' + sx + '" y="16">WHERE THEY LAND</text>';
      var svg = '<svg class="ag-map" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-labelledby="ag-map-t ag-map-d"><title id="ag-map-t">Agent, tool and system map for ' + esc(tenantName(E1.state.tenant)) + '</title><desc id="ag-map-d">' + esc(list.length + ' agents connect to ' + tools.length + ' tools. act.write edges are write-capable and reach ERPNext through the shadow sandbox. The same edges are listed in the table below.') + '</desc>' + cols + edges + nodes + '</svg>';
      var legend = '<div class="ag-legend" aria-hidden="false">' +
        '<span><svg width="34" height="8" aria-hidden="true"><path d="M0,4 H34" style="stroke:var(--zone-consumer);stroke-width:2.6"/></svg>Write-capable (act) — can change a record</span>' +
        '<span><svg width="34" height="8" aria-hidden="true"><path d="M0,4 H34" style="stroke:var(--zone-runtime);stroke-width:1.4;stroke-dasharray:6 3"/></svg>Stage — validated, no side effects</span>' +
        '<span><svg width="34" height="8" aria-hidden="true"><path d="M0,4 H34" style="stroke:var(--border-default);stroke-width:1.2;stroke-dasharray:3 3"/></svg>Read only</span>' +
        '<span>Zones are diagram colours, never status.</span></div>';

      var fa = focus ? agent(focus) : null;
      var panel;
      if (fa) {
        var g = grantsOf(fa);
        panel = c.card({ eyebrow: 'Tracing', title: fa.name, actions: c.button('Profile', { size: 'sm', href: '#/agents/agent/' + fa.id }), body:
          '<p class="e1-caption">' + esc(fa.purpose) + '</p>' +
          '<h4 class="e1-label" style="margin-top:var(--space-4)">Write-capable edges</h4>' +
          (fa.tools.indexOf('act.write') >= 0 ? '<ul class="e1-stack e1-stack--sm" style="list-style:none;padding:0;margin:var(--space-2) 0 0">' + Object.keys(g).map(function (k) { var w = wtOf(k); return '<li>' + c.autonomy(g[k], { compact: true }) + '<div class="e1-caption">' + esc(w ? w.label : k) + ' → ERPNext' + (lvlNum(g[k]) === 2 ? ' · a person approves first' : lvlNum(g[k]) < 2 ? ' · cannot reach rung 7 on its own' : ' · acts alone within its declaration') + '</div></li>'; }).join('') + '</ul>' : '<p class="e1-caption e1-muted">None. It has no act tool, so it cannot change a record.</p>') +
          '<h4 class="e1-label" style="margin-top:var(--space-4)">Approval path</h4><p class="e1-caption">Anything it proposes above its grant becomes an obligation for a person in a resolver set. It is never in one.</p>' });
      } else {
        var wc = edgeRows.filter(function (e) { return e.k === 'write'; }).length;
        panel = c.card({ title: 'What this map shows', body: c.kv([['Agents', fmt.num(list.length)], ['Tools in use', fmt.num(tools.length) + ' of 34'], ['Agent → tool edges', fmt.num(edgeRows.length)], ['Write-capable edges', fmt.num(wc)]], { compact: true }) +
          '<p class="e1-caption" style="margin-top:var(--space-3)">Every act.write runs through the shadow sandbox first — production included — and then reaches ERPNext with a single-use credential.</p><p class="e1-caption">Select an agent on the map to trace it.</p>' });
      }
      var edgeTable = '<details class="e1-details"><summary>Read the map as a table (' + edgeRows.length + ' edges)</summary><div style="margin-top:var(--space-2)">' + c.table({ caption: 'Agent to tool edges', dense: true, columns: [
        { key: 'a', label: 'Agent', render: function (r) { return '<a href="#/agents/agent/' + r.a.id + '">' + esc(r.a.name) + '</a>'; } },
        { key: 't', label: 'Tool', render: function (r) { return '<span class="e1-mono">' + esc(r.tid) + '</span>'; } },
        { key: 'k', label: 'Edge', render: function (r) { return { write: '<strong>Write-capable</strong>', stage: 'Stage, no side effects', read: 'Read only' }[r.k]; } },
        { key: 's', label: 'Lands in', render: function (r) { var t = TOOLS.filter(function (x) { return x.id === r.tid; })[0]; return esc(SYSTEMS.filter(function (s) { return s.id === t.system; })[0].label); } }
      ], rows: focus ? edgeRows.filter(function (e) { return e.a.id === focus; }) : edgeRows }) + '</div></details>';
      return header + c.card({ body: svg + legend }) + '<div class="e1-grid e1-grid--2" style="margin-top:var(--space-4);align-items:start">' + panel + '<div class="e1-stack">' + ruleNever() + edgeTable + '</div></div>';
    }
  });

  /* ========================================================================
     AUTONOMY
     ======================================================================== */
  function ladderCards(counts) {
    var verb = ['“reads only; cannot reach rung 7 by any path”', '“produces a write intent a human must submit”', '“submits; a human approves before rung 7”', '“acts alone where a reversal plan exists”', '“acts alone inside a declared blast radius and budget”', '“acts alone at tenant scope; requires dual control on the declaration itself”'];
    return '<div class="ag-ladder" role="list">' + c.AUTONOMY.map(function (a, i) {
      var cnt = counts ? (i === 0 ? fmt.num(counts.explicit0) + ' explicit A0 · ' + fmt.num(counts.none) + ' cells with no grant' : fmt.plural(counts[i] || 0, 'grant') + ' in this tenant') : '';
      return '<div class="ag-rung" role="listitem" style="border-top-color:' + (i === 0 ? 'var(--border-default)' : 'var(--text-' + (i < 3 ? 'secondary' : 'primary') + ')') + '"><span class="ag-rung__k">' + a[0] + '</span><span class="ag-rung__n">' + a[1] + '</span><span class="ag-rung__d">' + esc(verb[i]) + '</span><span class="ag-rung__c">' + esc(cnt) + '</span></div>';
    }).join('') + '</div>';
  }
  function pendingList() {
    var o = ov();
    var rows = HISTORY.filter(function (h) { return h.dir === 'waiting'; }).map(function (h) { return { agent: h.agent, wt: h.wt, from: h.from, to: h.to, by: h.by, approver: h.approver, obl: h.obl, at: h.at }; }).concat(o.pending || []);
    return rows;
  }
  reg('/agents/autonomy', {
    title: 'Autonomy', section: 'autonomy', wide: true, crumbs: crumbs(), keywords: 'A0 A1 A2 A3 A4 A5 grants matrix ladder',
    render: function (p, q) {
      var path = '/agents/autonomy', list = agentsFor(E1.state.tenant);
      var cols = (E1.state.tenant === 'kaveri-spinning' ? MATRIX_WT : WT.filter(function (w) { return w.tenant === E1.state.tenant; }).map(function (w) { return w.name; })).map(wtOf);
      var counts = [0, 0, 0, 0, 0, 0];
      counts.explicit0 = 0; counts.none = 0;
      list.forEach(function (a) { cols.forEach(function (w) { var g = grantOf(a, w.name), n = lvlNum(g); if (g === null) counts.none++; else if (n === 0) counts.explicit0++; else counts[n]++; }); });
      var header = c.pageHeader({ tabs: sibTabs('autonomy'), eyebrow: 'Agents · autonomy', title: 'Autonomy', lead: 'What each agent may do on its own, per write type. A missing grant reads A0 Observe (no grant) — never a blank.', actions: stateMenu(path, q, [['empty', 'Empty'], ['error', 'Error']]) + c.button('History', { href: '#/agents/autonomy/history', icon: 'history' }) + c.button('Earned autonomy', { href: '#/agents/graduation', icon: 'chart-line' }) });
      var v = variant(q, { empty: { title: 'No agent, so no grant', why: 'Autonomy is granted per agent and write type, and no agent is registered in this tenant.', fill: 'Register an agent; it starts at A0 Observe (no grant) everywhere.', action: { label: 'Open the registry', href: '#/agents/registry' }, icon: 'agents' } });
      if (!list.length && !v) v = variant({ state: 'empty' }, { empty: { title: 'No agent, so no grant', why: 'Autonomy is granted per agent and write type, and no agent is registered in ' + tenantName(E1.state.tenant) + '.', fill: 'Register an agent; it starts at A0 Observe (no grant) everywhere.', action: { label: 'Open the registry', href: '#/agents/registry' }, icon: 'agents' } });
      if (v) return header + v;

      var pend = pendingList();
      var pendHtml = pend.length ? c.card({ title: 'Changes waiting on a person', flush: true, body: c.table({ caption: 'Pending autonomy changes', dense: true, columns: [
        { key: 'o', label: 'Obligation', render: function (r) { return '<a class="e1-mono" href="#/work/decide/' + esc(r.obl) + '">' + esc(r.obl) + '</a>'; } },
        { key: 'a', label: 'Agent', render: function (r) { return '<a href="#/agents/agent/' + esc(r.agent) + '">' + esc((agent(r.agent) || {}).name || r.agent) + '</a>'; } },
        { key: 'w', label: 'Write type', render: function (r) { return wtCell(r.wt); } },
        { key: 'c', label: 'Change', render: function (r) { return '<span class="ag-num">' + esc((r.from || 'A0 (no grant)') + ' → ' + r.to) + '</span>'; } },
        { key: 'p', label: 'Proposed by', render: function (r) { return esc(personName(r.by)); } },
        { key: 'd', label: 'Decides', render: function (r) { return esc(personName(r.approver)); } }
      ], rows: pend }) }) : '';

      var focusAgent = q.agent;
      var thead = '<thead><tr><th scope="col">Agent</th>' + cols.map(function (w) { return '<th scope="col"><a href="#/agents/autonomy/' + esc(w.name) + '">' + esc(w.label) + '</a><span class="ag-sub">' + esc(wtName(w)) + '</span>' + (w.rev === false ? '<span class="ag-sub" style="font-family:var(--font-ui)">Irreversible · ceiling A2</span>' : '') + '</th>'; }).join('') + '</tr></thead>';
      var tbody = '<tbody>' + list.map(function (a) {
        return '<tr' + (focusAgent === a.id ? ' class="is-focus"' : '') + '><th scope="row"><a href="#/agents/agent/' + a.id + '">' + esc(a.name) + '</a><span class="ag-sub" style="font-family:var(--font-ui)">Agent · ' + esc(ownerName(a)) + (isPaused(a) ? ' · Paused' : '') + '</span></th>' + cols.map(function (w) {
          var L = grantOf(a, w.name), n = lvlNum(L), none = L === null;
          var note = n === 2 && w.rev !== false ? 'needs A3 — escalates to approval' : n === 2 ? 'a person always approves' : n === 1 ? 'drafts only' : '';
          return '<td><a class="ag-cell" href="#/agents/autonomy/' + esc(w.name) + '?agent=' + esc(a.id) + '" aria-label="' + esc(a.name + ' on ' + w.label + ': ' + lvlName(L)) + '"><span class="ag-cell__top">' + ticks(L) + '<span class="ag-cell__k">' + (none ? 'A0' : esc(L)) + '</span></span><span class="ag-cell__n">' + esc(none ? 'Observe (no grant)' : c.AUTONOMY[n][1]) + '</span>' + (note ? '<span class="ag-cell__note">' + esc(note) + '</span>' : '') + '</a></td>';
        }).join('') + '</tr>';
      }).join('') + '</tbody>';
      var matrix = '<div class="ag-matrix-wrap"><table class="ag-matrix"><caption class="e1-sr">Autonomy grants: agents by write type</caption>' + thead + tbody + '</table></div>' +
        '<p class="ag-tablenote">A0 Observe (no grant) and an explicit A0 are drawn the same way on purpose: both mean the agent cannot reach rung 7. Select a cell to see who else holds that write type, its ceiling and its history.</p>';

      var rules = c.callout({ kind: 'rule', title: 'How autonomy changes', body: '<ul style="margin:0;padding-left:18px"><li>Raising a grant is itself a governed write (<code>platform.autonomy.grant</code>, dual control): one person proposes, a second named person approves.</li><li>Taking it back is one press by one person, with no reason required. It takes effect at the next write.</li><li>“No reversal plan means no A3 or above.” Irreversible write types can never be auto-approved.</li><li>A5 requires dual control on the declaration itself. There is no API, toggle or support action that sets an autonomy level.</li><li>Autonomy is written A0–A5. The letter L is reserved for Assurance Levels.</li></ul>' });

      return header + c.section({ id: 'ladder', title: 'The ladder, A0 to A5', lead: 'What rung 6 permits at each level, in the words of the kernel contract.', body: ladderCards(counts) }) +
        '<div style="margin-top:var(--space-5)">' + rules + '</div>' +
        (pendHtml ? c.section({ id: 'pending', title: 'Waiting on a person', lead: 'Raises are obligations in Work until a second named person decides.', body: pendHtml }) : '') +
        c.section({ id: 'matrix', title: 'Grants: agents × write types', lead: tenantName(E1.state.tenant) + ' · ' + fmt.plural(list.length, 'agent') + ' × ' + fmt.plural(cols.length, 'write type') + '. People hold grants too — they are granted, not graduated; see People.', actions: c.button('Propose a change', { size: 'sm', kind: 'primary', href: '#/agents/autonomy/' + cols[0].name + '/propose' }), body: matrix });
    }
  });

  reg('/agents/autonomy/history', {
    title: 'Autonomy history', section: 'autonomy', crumbs: crumbs([['Autonomy', '#/agents/autonomy']]), keywords: 'grant changes raised lowered audit',
    render: function (p, q) {
      var path = '/agents/autonomy/history', o = ov();
      var rows = (o.lowered || []).map(function (l) { return Object.assign({ dir: 'lower', note: 'One press by one person. No reason was required.' }, l); }).concat((o.pending || []).map(function (x) { return Object.assign({ dir: 'waiting' }, x); })).concat(HISTORY);
      var f = q.filter || 'all';
      var shown = rows.filter(function (r) { if (q.agent && r.agent !== q.agent) return false; return f === 'all' || (f === 'raised' && (r.dir === 'raise' || r.dir === 'waiting' || r.dir === 'declined')) || (f === 'lowered' && (r.dir === 'lower' || r.dir === 'auto')) || (f === 'auto' && r.dir === 'auto'); });
      function ch(id, label) { var qq = Object.assign({}, q, { filter: id }); if (id === 'all') delete qq.filter; return { label: label, href: E1.href(path, qq), active: f === id, count: rows.filter(function (r) { return (!q.agent || r.agent === q.agent) && (id === 'all' || (id === 'raised' && (r.dir === 'raise' || r.dir === 'waiting' || r.dir === 'declined')) || (id === 'lowered' && (r.dir === 'lower' || r.dir === 'auto')) || (id === 'auto' && r.dir === 'auto')); }).length }; }
      var header = c.pageHeader({ eyebrow: 'Agents · autonomy', title: 'Autonomy history', lead: 'Every grant change is a governed write with its own proof entry: who proposed it, who approved it, and when it took effect.' + (q.agent && agent(q.agent) ? ' Showing ' + agent(q.agent).name + '.' : ''), back: ['Autonomy', '#/agents/autonomy'], actions: stateMenu(path, q, [['empty', 'Empty']]) });
      var v = variant(q, { empty: { title: 'No autonomy change has been made', why: 'Every agent is still at the grant it was registered with.', fill: 'Proposals, approvals, declines and one-press lowerings will all appear here with their proof entries.', action: { label: 'Open the matrix', href: '#/agents/autonomy' }, icon: 'history' } });
      if (v) return header + v;
      var DIR = { raise: ['good', 'Raised', 'arrow-up'], lower: ['info', 'Lowered', 'arrow-down'], auto: ['info', 'Lowered automatically', 'arrow-down'], declined: ['neutral', 'Not done · declined', 'refuse'], waiting: ['warning', 'Waiting on a person', 'gate'], register: ['neutral', 'Registered, no grant', 'plus'] };
      var table = c.table({ caption: 'Autonomy changes', columns: [
        { key: 'at', label: 'When', render: function (r) { return '<span class="e1-caption">' + esc(fmt.dateTime(r.at)) + '</span>'; } },
        { key: 'a', label: 'Agent', render: function (r) { return '<a href="#/agents/agent/' + esc(r.agent) + '">' + esc((agent(r.agent) || {}).name || r.agent) + '</a>'; } },
        { key: 'w', label: 'Write type', render: function (r) { return wtCell(r.wt, { link: true }); } },
        { key: 'c', label: 'Change', render: function (r) { return r.dir === 'register' ? '<span class="ag-num">A0 (no grant)</span>' : '<span class="ag-num">' + esc((r.from || 'A0 (no grant)') + ' → ' + r.to) + '</span>'; } },
        { key: 'd', label: 'Outcome', render: function (r) { var d = DIR[r.dir]; return c.badge(d[0], d[1], { icon: d[2], subtle: true }); } },
        { key: 'who', label: 'Two named people', render: function (r) { if (r.dir === 'auto') return '<span class="e1-caption">Triggered by the declaration</span>'; if (r.dir === 'lower') return esc(personName(r.by)) + '<span class="ag-sub" style="font-family:var(--font-ui)">one person, one press</span>'; return esc(personName(r.by)) + ' → ' + esc(personName(r.approver)); } },
        { key: 's', label: 'Proof', render: function (r) { return r.seq ? '<a class="ag-num" href="#/assurance/proof/' + r.seq + '">#' + fmt.num(r.seq) + '</a>' : r.obl ? '<a class="e1-mono" href="#/work/decide/' + esc(r.obl) + '">' + esc(r.obl) + '</a>' : '—'; } },
        { key: 'n', label: 'Note', render: function (r) { return r.note ? '<span class="ag-desc">' + esc(r.note) + '</span>' : ''; } }
      ], rows: shown, empty: { title: 'Nothing matches this filter', why: 'No change of this kind has been recorded' + (q.agent ? ' for this agent' : '') + '.', action: { label: 'Show all changes', href: E1.href(path) }, compact: true } });
      var qa = c.card({ title: 'What an auditor can answer from this page', flush: true, body: c.table({ caption: 'Questions and where the answer is', dense: true, columns: [{ key: 'q', label: 'Question' }, { key: 'a', label: 'Answered by' }], rows: [
        { q: 'Who raised this agent’s autonomy, and who agreed?', a: 'The platform.autonomy.grant proof entry: the proposer and a second named approver.' },
        { q: 'Could anyone raise it alone?', a: 'No. The write type declares dual control; a same-actor attempt is refused with GATE.DUAL_CONTROL_SAME_ACTOR.' },
        { q: 'Was it ever taken back?', a: 'Lowered rows: one person, one press, its own proof entry, effective at the next write.' },
        { q: 'At what level did the agent act on a given write?', a: 'Field F11 autonomy_level on that write’s proof entry.' }
      ] }) });
      return header + c.filters([ch('all', 'All'), ch('raised', 'Raises'), ch('lowered', 'Lowered'), ch('auto', 'Automatic')], { label: 'Show', clearHref: q.agent ? path : null }) + '<div style="margin-top:var(--space-3)">' + table + '</div><div style="margin-top:var(--space-6)">' + qa + '</div>';
    }
  });

  reg('/agents/autonomy/:classId', {
    title: function (p) { var w = wtOf(p.classId); return w ? 'Autonomy · ' + w.label : 'Autonomy'; }, section: 'autonomy', example: '/agents/autonomy/erp.sales_invoice.submit',
    crumbs: crumbs([['Autonomy', '#/agents/autonomy']]), keywords: 'write type grants ceiling',
    render: function (p, q) {
      var w = wtOf(p.classId);
      if (!w) return notFound('Write type', p.classId, ['Open the autonomy matrix', '#/agents/autonomy']);
      var list = agentsFor(w.tenant === '*' ? E1.state.tenant : w.tenant);
      var cap = ceilingOf(w);
      var header = c.pageHeader({ eyebrow: 'Autonomy · write type', title: w.label, lead: 'Who may do ' + wtName(w) + ' on their own, and how far this write type lets anyone go.', back: ['Autonomy', '#/agents/autonomy'],
        actions: c.button('Declaration', { href: '#/records/write-types/' + wtName(w), icon: 'file-text' }) + c.button('Earned autonomy', { href: '#/agents/graduation/' + w.name, icon: 'chart-line' }) + (w.humansOnly ? '' : c.button('Propose a raise', { kind: 'primary', href: '#/agents/autonomy/' + w.name + '/propose' + (q.agent ? '?agent=' + q.agent : '') })),
        meta: '<span class="e1-mono">' + esc(wtName(w)) + '</span>' + c.blast(w.blast, { compact: true }) + (w.rev === null ? '' : c.reversible(w.rev)) + '<span>Dual control: ' + esc(w.dual) + '</span><span class="e1-mono">' + esc(w.decl + ' v' + w.ver) + '</span>' });
      if (w.humansOnly) return header + ruleNever() + c.empty({ title: 'Only people hold this write type', why: 'Approving or rejecting is platform.obligation.resolve. An agent can never approve, so no agent can be granted it at any level.', action: { label: 'See who approves', href: '#/agents/people' }, icon: 'users' });
      var ceilCard = c.card({ title: 'Ceiling for this write type', body: c.autonomy('A' + cap) + '<p class="e1-caption" style="margin-top:var(--space-3)">' + esc(ceilingWhy(w)) + '</p>' + (w.rev === false ? '<p class="e1-caption"><strong>Irreversible — cannot be auto-approved.</strong> Reversal plan: ' + esc(w.plan) + '.</p>' : '<p class="e1-caption">Reversal plan: <span class="e1-mono">' + esc(w.plan) + '</span></p>') });
      var rows = list.map(function (a) { return { a: a, g: grantOf(a, w.name) }; }).sort(function (x, y) { return lvlNum(y.g) - lvlNum(x.g); });
      var table = c.table({ caption: 'Agent grants on ' + w.label, columns: [
        { key: 'a', label: 'Agent', render: function (r) { return c.actor({ name: r.a.name, kind: 'agent', role: ownerName(r.a), href: '#/agents/agent/' + r.a.id, size: 'sm' }) + (q.agent === r.a.id ? ' ' + c.badge('info', 'Selected', { subtle: true, icon: 'eye' }) : ''); } },
        { key: 'g', label: 'Grant', render: function (r) { return c.autonomy(r.g, { compact: true }); } },
        { key: 'e', label: 'What rung 6 does', render: function (r) { return '<span class="e1-caption">' + esc(effect(r.g, w)) + '</span>'; } },
        { key: 's', label: 'Since', render: function (r) { var h = HISTORY.filter(function (x) { return x.agent === r.a.id && x.wt === w.name && x.seq && x.dir !== 'declined'; })[0]; return h ? '<span class="e1-caption">' + esc(fmt.date(h.at)) + ' · </span><a class="ag-num" href="#/assurance/proof/' + h.seq + '">#' + fmt.num(h.seq) + '</a>' : '<span class="e1-caption e1-muted">' + (r.g === null ? 'Never granted' : 'At registration · #' + fmt.num(r.a.regSeq)) + '</span>'; } },
        { key: 'x', label: 'Change', render: function (r) { var n = lvlNum(r.g), out = ''; if (n < ceilingOf(w, r.a)) out += c.button('Propose a raise', { size: 'sm', href: '#/agents/autonomy/' + w.name + '/propose?agent=' + r.a.id }); if (n > 0) out += c.button('Lower to A' + (n - 1), { size: 'sm', kind: 'ghost', attrs: 'data-action="ag-lower" data-value="' + esc(r.a.id + '|' + w.name) + '"' }); return '<div class="ag-inline">' + (out || '<span class="e1-caption e1-muted">At its ceiling</span>') + '</div>'; } }
      ], rows: rows, empty: { title: 'No agent in this tenant', why: 'Grants are per agent.', compact: true } });
      var humans = Object.keys(PEOPLE_X).filter(function (id) { return PEOPLE_X[id].grants[w.name]; }).map(function (id) { return { id: id, g: PEOPLE_X[id].grants[w.name] }; });
      var humanHtml = c.table({ caption: 'People with a grant', dense: true, columns: [
        { key: 'p', label: 'Person', render: function (r) { return personActor(r.id); } },
        { key: 'g', label: 'Grant', render: function (r) { return c.autonomy(r.g, { compact: true }); } },
        { key: 'e', label: 'What it means', render: function (r) { return '<span class="e1-caption">' + esc(effect(r.g, w)) + '</span>'; } }
      ], rows: humans, empty: { title: 'No person holds a grant on this write type', why: 'People submit it through Work at A0; whoever approves is in a resolver set, which is separate from autonomy.', compact: true } });
      var hist = HISTORY.filter(function (h) { return h.wt === w.name; }).map(function (h) {
        var t = { raise: 'Raised ' + (h.from || 'A0 (no grant)') + ' → ' + h.to, lower: 'Lowered ' + h.from + ' → ' + h.to + ' · one press', auto: 'Lowered automatically ' + h.from + ' → ' + h.to, declined: 'Declined ' + h.from + ' → ' + h.to, waiting: 'Proposed ' + h.from + ' → ' + h.to + ' · waiting on ' + personName(h.approver), register: 'Registered with no grant' }[h.dir];
        return { time: fmt.dateTime(h.at), title: ((agent(h.agent) || {}).name || h.agent) + ' · ' + t, body: h.note || (h.by ? 'Proposed by ' + personName(h.by) + (h.approver ? ', decided by ' + personName(h.approver) : '') + '.' : ''), state: { raise: 'good', lower: 'info', auto: 'info', declined: 'neutral', waiting: 'warning', register: 'neutral' }[h.dir], href: h.seq ? '#/assurance/proof/' + h.seq : '#/work/decide/' + h.obl };
      });
      return header + '<div class="e1-split e1-split--wide"><div class="e1-stack e1-stack--lg">' +
        c.section({ id: 'agents', title: 'Agents', lead: 'Raising needs two named people. Lowering is one press, no reason.', body: table }) +
        c.section({ id: 'people', title: 'People', lead: 'Humans are granted, not graduated.', body: humanHtml }) +
        c.section({ id: 'history', title: 'History', lead: 'Each change is its own proof entry.', actions: c.button('All history', { size: 'sm', kind: 'ghost', href: '#/agents/autonomy/history' }), body: hist.length ? c.timeline(hist) : c.empty({ title: 'No change on this write type yet', why: 'Every grant here is the one it was registered with.', compact: true }) }) +
        '</div><aside class="e1-stack">' + ceilCard + c.card({ title: 'Earned autonomy', body: '<p class="e1-caption">At Assurance Level 3, A2 → A3 for agents on this write type is earned through graduation only — counts and thresholds, a justification written by a person, and a second approver.</p>' + c.button('Open graduation', { size: 'sm', href: '#/agents/graduation/' + w.name, iconRight: 'arrow-right' }) }) + ruleNever() + '</aside></div>';
    }
  });

  /* Propose (grant raise at L1, or graduation A2 → A3 at L3 with ?via=graduation) */
  reg('/agents/autonomy/:classId/propose', {
    title: function (p, q) { return q && q.via === 'graduation' ? 'Propose A3' : 'Propose an autonomy change'; }, section: 'autonomy', example: '/agents/autonomy/erp.sales_invoice.submit/propose',
    crumbs: crumbs([['Autonomy', '#/agents/autonomy']]), keywords: 'raise grant dual control',
    render: function (p, q) {
      var w = wtOf(p.classId);
      if (!w || w.humansOnly) return notFound('Write type', p.classId, ['Open the autonomy matrix', '#/agents/autonomy']);
      var path = '/agents/autonomy/' + w.name + '/propose';
      if (q.via === 'graduation') return renderGraduatePropose(w, q, path);
      var list = agentsFor(w.tenant).filter(function (a) { return a.stage !== 'registered'; });
      var a = agent(q.agent) && agent(q.agent).tenant === w.tenant ? agent(q.agent) : (list.filter(function (x) { return grantOf(x, w.name) !== null; })[0] || list[0]);
      var header = c.pageHeader({ eyebrow: 'Governed write · platform.autonomy.grant · dual control', title: 'Propose an autonomy change', lead: 'Raising what an agent may do on its own needs two named people: you propose, a second person approves in Work. Nothing changes until they do.', back: ['Autonomy · ' + w.label, '#/agents/autonomy/' + w.name],
        actions: stateMenu(path, q, [['submitted', 'Submitted'], ['same-actor', 'Refused · same person'], ['capped', 'Refused · above ceiling']]) });
      if (!a) return header + c.empty({ title: 'No agent can hold this write type', why: 'No agent in this tenant is registered for it.', action: { label: 'Open the registry', href: '#/agents/registry' } });
      var cur = grantOf(a, w.name), curN = lvlNum(cur), cap = ceilingOf(w, a);

      if (q.state === 'submitted') {
        var obl = q.obl || 'OB-2026-0426', to = q.to || 'A' + Math.min(curN + 1, cap), appr = q.approver || 'meenakshi-iyer';
        return header + c.callout({ kind: 'good', title: 'Proposal recorded. Nothing has changed yet.', body: '<p>' + esc(obl) + ' is waiting on ' + esc(personName(appr)) + '. If they approve, ' + esc(a.name) + ' acts at ' + esc(lvlName(to)) + ' on ' + esc(w.label) + ' from its next write.</p>' }) +
          '<div class="e1-grid e1-grid--2" style="margin-top:var(--space-5)">' + c.card({ title: 'What was recorded', body: c.kv([['Obligation', '<a class="e1-mono" href="#/work/decide/' + esc(obl) + '">' + esc(obl) + '</a>', { html: true }], ['Write type', 'platform.autonomy.grant', { mono: true }], ['Agent', a.name], ['On', wtName(w), { mono: true }], ['Change', (cur || 'A0 (no grant)') + ' → ' + to, { mono: true }], ['Proposed by', personName(uid())], ['Decides', personName(appr)], ['Expires', 'in 4 h (declared default for this write type)']], { compact: true }) }) +
          c.card({ title: 'What happens next', body: '<ol class="ag-steps"><li>' + esc(personName(appr)) + ' sees the change, its ceiling and your reason in Work.</li><li>Approve → the grant takes effect at the agent’s next write. The escalation, the resolution and the grant are three proof entries.</li><li>Reject → nothing changes; the reason is recorded.</li><li>Nobody decides in 4 h → it expires, and the expiry is its own proof entry.</li></ol><div class="ag-inline" style="margin-top:var(--space-4)">' + c.button('Open ' + obl, { href: '#/work/decide/' + obl, kind: 'primary' }) + c.button('Back to the matrix', { href: '#/agents/autonomy?agent=' + a.id }) + '</div>' }) + '</div>';
      }
      if (q.state === 'same-actor') {
        return header + c.refusal({ code: 'GATE.DUAL_CONTROL_SAME_ACTOR', title: 'You proposed this, so you cannot also approve it', rule: 'A second named actor must approve this write_id. The proposer and the approver of an autonomy raise are never the same person.', ruleName: 'G4 Dual control', version: 'platform v3', numbers: [{ label: 'Proposed by', value: personName(uid()) }, { label: 'Approver chosen', value: personName(uid()) }], action: { label: 'Send to a second person', href: E1.href(path, { agent: a.id }) }, proofHref: '#/assurance/proof/4113' });
      }
      if (q.state === 'capped') {
        return header + c.refusal({ code: 'POLICY.DENIED_BY_RULE', title: 'Not done — ' + w.label + ' cannot go above A' + ceilingOf(w, a), rule: w.rev === false ? 'No reversal plan means no A3 or above. Irreversible write types can never be auto-approved.' : ceilingWhy(w, a), ruleName: 'Autonomy ceiling', version: w.decl + ' v' + w.ver, numbers: [{ label: 'Proposed', value: 'A' + (ceilingOf(w, a) + 1) }, { label: 'Ceiling', value: 'A' + ceilingOf(w, a) }], action: { label: 'Open the declaration', href: '#/records/declarations/' + w.decl }, proofHref: '#/assurance/proof/4113' });
      }

      var agentOpts = list.map(function (x) { return { value: x.id, label: x.name + ' · now ' + lvlName(grantOf(x, w.name)) }; });
      var levels = c.AUTONOMY.map(function (L, i) {
        var dis = i <= curN || i > cap, note;
        if (i <= curN) note = i === curN ? 'Current grant' : 'Lower than now — lowering needs no proposal';
        else if (i > cap) note = i >= 3 && w.rev === false ? 'No reversal plan means no A3 or above' : ceilingWhy(w, a);
        else note = L[2];
        return c.radio({ name: 'ag-to', id: 'ag-to-' + i, value: 'A' + i, label: L[0] + ' ' + L[1], note: note, disabled: dis, checked: i === curN + 1 && i <= cap });
      }).join('');
      var appr = approvers(uid()).map(function (x) { return { value: x.id, label: x.name + ' · ' + x.role.replace(/ \(.*\)$/, '') }; });
      var form = '<form class="e1-stack" data-ag-propose novalidate>' +
        c.field('Agent', c.select({ id: 'ag-agent', options: agentOpts, value: a.id }), { id: 'ag-agent', help: 'Agents only. People are granted through their role.' }) +
        '<div>' + c.kv([['Write type', w.label + ' · ' + wtName(w)], ['Current grant', lvlName(cur)], ['Ceiling', 'A' + cap + ' — ' + ceilingWhy(w, a)]], { compact: true }) + '</div>' +
        (curN >= cap ? c.callout({ kind: 'info', title: a.name + ' is already at its ceiling on ' + w.label + '.', body: '<p>There is nothing higher to propose. To lower it, use one press on the agent’s page — no proposal needed.</p>' }) :
          '<fieldset class="ag-fieldset"><legend>Proposed level</legend>' + levels + '</fieldset>') +
        c.field('Why this agent has earned it', c.textarea({ id: 'ag-why', rows: 4, placeholder: 'Say what you have seen it do, with numbers where you have them.', describedBy: 'ag-why-msg' }), { id: 'ag-why', required: true, help: 'At least one sentence. The approver reads it, and it is recorded on the proof.' }) +
        c.field('Second approver', c.select({ id: 'ag-appr', options: [{ value: '', label: 'Choose a person' }].concat(appr) }), { id: 'ag-appr', required: true, help: 'People who may approve autonomy changes. You are not listed: you cannot approve your own proposal.' }) +
        '<div class="ag-inline">' + c.button('Submit for approval', { kind: 'primary', type: 'submit', disabled: curN >= cap }) + c.button('Cancel', { kind: 'ghost', href: '#/agents/autonomy/' + w.name }) + '</div></form>';
      var side = c.card({ title: 'What happens when you submit', body: '<ol class="ag-steps"><li>Your proposal is a governed write, <span class="e1-mono">platform.autonomy.grant</span> — one record, dual control.</li><li>It becomes an obligation waiting on the person you choose. It expires in 4 h.</li><li>If approved, the grant takes effect at the agent’s next write.</li><li>Taking it back later is one press by one person, with no reason required.</li></ol>' }) +
        c.callout({ kind: 'rule', title: 'Never a toggle.', body: '<p>There is no switch, dropdown or API field that sets an autonomy level. Levels change only through this governed write.</p>' });
      return header + '<div class="e1-split e1-split--wide"><div>' + c.card({ body: form }) + '</div><aside class="e1-stack">' + side + '</aside></div>';
    },
    mount: function (el, p, q) {
      var form = el.querySelector('[data-ag-propose]'); if (!form) return;
      var w = wtOf(p.classId);
      form.querySelector('#ag-agent').addEventListener('change', function (e) { E1.go('/agents/autonomy/' + w.name + '/propose', { agent: e.target.value }, { replace: true }); });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var why = form.querySelector('#ag-why'), appr = form.querySelector('#ag-appr'), to = form.querySelector('input[name="ag-to"]:checked');
        var ok = true;
        var whyMsg = el.querySelector('#ag-why-msg');
        if (why.value.trim().length < 12) { why.setAttribute('aria-invalid', 'true'); if (whyMsg) { whyMsg.textContent = 'Write at least one sentence (12 characters or more) so the approver knows why.'; whyMsg.classList.add('is-error'); } ok = false; } else { why.removeAttribute('aria-invalid'); if (whyMsg) { whyMsg.textContent = 'At least one sentence. The approver reads it, and it is recorded on the proof.'; whyMsg.classList.remove('is-error'); } }
        if (!appr.value) { appr.setAttribute('aria-invalid', 'true'); ok = false; } else appr.removeAttribute('aria-invalid');
        if (!to) { ok = false; E1.toast('Choose the level you are proposing.', 'warning'); }
        if (!ok) { E1.announce('The proposal needs a reason and a second approver.'); (why.getAttribute('aria-invalid') ? why : appr).focus(); return; }
        var ag = form.querySelector('#ag-agent').value, a = agent(ag), obl = nextObl(), o = ov();
        o.pending = (o.pending || []).filter(function (x) { return !(x.agent === ag && x.wt === w.name); });
        o.pending.unshift({ agent: ag, wt: w.name, from: grantOf(a, w.name), to: to.value, by: uid(), approver: appr.value, obl: obl, at: new Date(NOW + 60000).toISOString() }); saveOv(o);
        E1.toast('Proposal ' + obl + ' is waiting on ' + personName(appr.value) + '.', 'warning', { title: 'Waiting on a person' });
        E1.go('/agents/autonomy/' + w.name + '/propose', { agent: ag, state: 'submitted', obl: obl, to: to.value, approver: appr.value });
      });
    }
  });

  /* ========================================================================
     GRADUATION (earned autonomy A2 → A3, L3)
     ======================================================================== */
  function gradOf(id) { return GRAD.filter(function (g) { return g.id === id; })[0] || null; }
  function verdictBadge(g) {
    return { eligible: c.badge('info', 'Eligible for A3', { icon: 'check' }), ineligible: c.badge('neutral', 'Not eligible — ' + g.failText), never: c.badge('neutral', (g.neverBy ? 'Never by graduation — ' : 'Never — ') + g.failText, { icon: 'lock' }), supervised: c.badge('info', 'Supervised, 1 in 10', { icon: 'eye' }), revoked: c.badge('neutral', 'Revoked: ' + g.failText, { icon: 'arrow-down' }), not_measurable: c.badge('warning', 'Not measurable', { icon: 'minus' }) }[g.verdict];
  }
  function gradLocked(extra) {
    return c.locked({ level: 'L3', title: 'Earned autonomy arrives at Assurance Level 3 Proven', why: 'Graduation raises an agent from A2 to A3 on the record of what it has already done. It waits until the model boundary is proven in production. A model may produce a write intent. It may never produce an allow.', items: ['Counters per action class over a 180-day window', 'Eight eligibility conditions, hard bars flagged', 'A justification written by a person, never pre-filled', 'A second named approver, and a 30-day supervised period', 'Revoke to A2 in one press, no reason required'] }) + (extra || '') +
      c.section({ id: 'today', title: 'What you can do today', lead: 'At your level, autonomy changes are proposed by one person and approved by a second.', body: '<div class="ag-inline">' + c.button('Open the autonomy matrix', { href: '#/agents/autonomy', kind: 'primary' }) + c.button('Autonomy history', { href: '#/agents/autonomy/history' }) + '</div>' }) +
      c.section({ id: 'conditions', title: 'The eight conditions graduation will check', lead: 'Counts and thresholds only. No recommendation, and no model in the decision.', body: c.card({ body: '<ol class="ag-check">' + CONDITIONS.map(function (x, i) { return '<li><span class="ag-check__n">' + (i + 1) + '</span><span class="ag-check__t">' + esc(x[0]) + '</span>' + (x[1] ? '<span class="ag-tag">Hard bar</span>' : '<span></span>') + '</li>'; }).join('') + '</ol>' }) });
  }
  reg('/agents/graduation', {
    title: 'Graduation', section: 'graduation', wide: true, crumbs: crumbs(), keywords: 'earned autonomy precedent A3 L3',
    render: function (p, q) {
      var path = '/agents/graduation';
      var header = c.pageHeader({ tabs: sibTabs('graduation'), eyebrow: 'Agents · earned autonomy · L3', title: 'Graduation', lead: 'Which action classes have a record long enough to be considered for A3 — counts and thresholds only. A person writes the justification; a second person decides.', actions: E1.atLeast('L3') ? stateMenu(path, q, [['empty', 'Empty']]) + c.button('Autonomy history', { href: '#/agents/autonomy/history', icon: 'history' }) : c.level('L3') });
      if (!E1.atLeast('L3')) return header + gradLocked();
      var v = variant(q, { empty: { title: 'No agent has written through this tenant long enough to have precedent.', why: 'A class needs 90 days of continuous history and 200 records before it can be considered.', fill: 'Your tenant has 22 days of history on the chain.', action: { label: 'Open the autonomy matrix', href: '#/agents/autonomy' }, icon: 'chart-line' } });
      if (v) return header + v;
      var f = q.filter || 'all';
      var match = function (g) { return f === 'all' || g.verdict === f || (f === 'not_measurable' && g.verdict === 'not_measurable'); };
      function ch(id, label) { var qq = Object.assign({}, q, { filter: id }); if (id === 'all') delete qq.filter; return { label: label, href: E1.href(path, qq), active: f === id, count: GRAD.filter(function (g) { return id === 'all' || g.verdict === id; }).length }; }
      var dash = function (v) { return v === undefined || v === null ? '<span class="e1-muted">—</span>' : '<span class="ag-num">' + fmt.num(v) + '</span>'; };
      var table = c.table({ caption: 'Action classes and their evidence', rowHref: function (g) { return '#/agents/graduation/' + g.id; }, columns: [
        { key: 'id', label: 'Action class', render: function (g) { return '<span class="e1-mono">' + esc(g.id.replace(/^erp\./, '')) + '</span><span class="ag-sub" style="font-family:var(--font-ui)">' + esc(g.kind + ' · ' + g.blast) + '</span>'; } },
        { key: 'l', label: 'Level', render: function (g) { return '<span class="ag-num">' + esc(g.level) + '</span>' + (g.sup ? '<span class="ag-sub" style="font-family:var(--font-ui)">supervised until ' + esc(g.sup) + '</span>' : g.revokedOn ? '<span class="ag-sub" style="font-family:var(--font-ui)">revoked ' + esc(g.revokedOn) + '</span>' : ''); } },
        { key: 's', label: 'Submitted', align: 'right', render: function (g) { return dash(g.sub); } },
        { key: 'a', label: 'Approvals unamended / amended / declined', align: 'right', render: function (g) { return g.unam === undefined ? dash() : '<span class="ag-num">' + fmt.num(g.unam) + ' / ' + fmt.num(g.am) + ' / ' + fmt.num(g.dec) + '</span>'; } },
        { key: 'e', label: 'Expired', align: 'right', render: function (g) { return dash(g.exp); } },
        { key: 'r', label: 'Reversed in window', align: 'right', render: function (g) { return dash(g.rev); } },
        { key: 'c', label: 'Corrected after', align: 'right', render: function (g) { return dash(g.corr); } },
        { key: 'd', label: 'Sandbox diverged', align: 'right', render: function (g) { return dash(g.div); } },
        { key: 'sc', label: 'Score (score_v1)', align: 'right', render: function (g) { return dash(g.score); } },
        { key: 'v', label: 'Verdict', render: function (g) { return verdictBadge(g); } }
      ], rows: GRAD.filter(match), empty: { title: 'No class matches this filter', why: 'Try another filter.', action: { label: 'Show all', href: E1.href(path) }, compact: true } });
      return header +
        c.callout({ kind: 'caveat', title: 'Preview with sample counts — dated 24 Sep 2028, window 180 days.', body: '<p>These are illustrative counts for a tenant with 180 days of history. Kaveri Spinning Mills has 22 days on its chain today, so none of its classes could be considered yet.</p>' }) +
        '<div class="e1-grid e1-grid--2" style="margin-top:var(--space-4)">' + c.callout({ kind: 'rule', title: 'Numbers, not recommendations.', body: '<p>No model in the decision path, and no model in the graduation decision. There is no “we suggest approving”. Refusals are not failures: the refusal rate is neutral in the score.</p>' }) +
        c.callout({ kind: 'rule', title: 'Earned, and always revocable.', body: '<p>A2 → A3 by graduation only; never on an irreversible write type, never by graduation at tenant or cross-boundary scope. Lowering needs one person and one press, and no justification.</p>' }) + '</div>' +
        c.section({ id: 'classes', title: 'Action classes', lead: 'An action class is (tenant, write type, actor kind, blast radius) — not a single agent.', body: c.filters([ch('all', 'All'), ch('eligible', 'Eligible'), ch('supervised', 'Supervised'), ch('revoked', 'Revoked'), ch('not_measurable', 'Not measurable'), ch('never', 'Never')], { label: 'Show' }) + '<div style="margin-top:var(--space-3)">' + table + '</div>' });
    }
  });

  reg('/agents/graduation/:classId', {
    title: function (p) { return 'Graduation · ' + String(p.classId).replace(/^erp\./, ''); }, section: 'graduation', wide: true, example: '/agents/graduation/erp.sales_invoice.submit',
    crumbs: crumbs([['Graduation', '#/agents/graduation']]), keywords: 'action class counters eligibility',
    render: function (p, q) {
      var g = gradOf(p.classId), w = wtOf(p.classId);
      if (!g && !w) return notFound('Action class', p.classId, ['Open graduation', '#/agents/graduation']);
      var label = w ? w.label : p.classId;
      var header = c.pageHeader({ eyebrow: 'Action class · ' + p.classId + ' · agent', title: label, lead: 'The record this class has earned, in counts. The decision to raise it belongs to two named people.', back: ['Graduation', '#/agents/graduation'],
        actions: E1.atLeast('L3') && g ? stateMenu('/agents/graduation/' + p.classId, q, [['not-measurable', 'Not measurable'], ['stale', 'Stale score']]) + c.button('Recompute', { icon: 'refresh', attrs: 'data-ag-recompute' }) +
          (g.level === 'A3' ? c.button('Revoke to A2', { kind: 'danger', icon: 'arrow-down', attrs: 'data-ag-revoke' }) : '') +
          (g.verdict === 'eligible' ? c.button('Propose A3', { kind: 'primary', href: '#/agents/autonomy/' + p.classId + '/propose?via=graduation' }) : (g.level === 'A2' ? c.button('Propose A3', { kind: 'primary', disabled: true }) : '')) : c.level('L3') });
      if (!E1.atLeast('L3')) return header + gradLocked(w ? c.card({ title: 'This write type today', body: c.kv([['Write type', wtName(w), { mono: true }], ['Blast radius', c.blast(w.blast, { compact: true }), { html: true }], ['Reversibility', w.rev === null ? '—' : c.reversible(w.rev), { html: true }]], { cols: 2, compact: true }) + '<div style="margin-top:var(--space-3)">' + c.button('See current grants', { size: 'sm', href: '#/agents/autonomy/' + w.name }) + '</div>' }) : '');
      if (!g) return header + c.empty({ title: 'No precedent for this class yet', why: 'A class needs 90 days of continuous history and 200 records before it can be considered.', action: { label: 'Open graduation', href: '#/agents/graduation' } });
      var stateQ = q.state;
      var gateHtml = (g.gates || []).length ? c.table({ caption: 'Refusals by gate', dense: true, columns: [{ key: 'k', label: 'Not done, by code', render: function (r) { return '<span class="e1-mono e1-caption">' + esc(r[0].replace(/ ·.*$/, '')) + '</span>' + (/·/.test(r[0]) ? '<span class="ag-sub" style="font-family:var(--font-ui)">' + esc(r[0].split('· ')[1]) + '</span>' : ''); } }, { key: 'n', label: 'Count', align: 'right', render: function (r) { return '<span class="ag-num">' + fmt.num(r[1]) + '</span>'; } }], rows: g.gates }) + '<p class="ag-tablenote">Refusals are shown neutral. A refusal is a correct outcome, and the refusal rate is neutral in the score.</p>' : '';
      var counters = [['submitted', g.sub], ['escalated', g.unam !== undefined ? g.unam + g.am + g.dec + g.exp : undefined], ['approved_unamended', g.unam, 'The load-bearing counter'], ['approved_amended', g.am], ['declined', g.dec], ['expired', g.exp], ['reversed_in_window', g.rev], ['corrected_after_window', g.corr, 'The worst signal'], ['sandbox_diverged', g.div], ['refused_by_gate', (g.gates || []).reduce(function (s, r) { return s + r[1]; }, 0) || undefined], ['refused_by_policy', g.unam !== undefined ? 7 : undefined]];
      var countersHtml = c.table({ caption: 'Counters', dense: true, columns: [{ key: 'k', label: 'Counter', render: function (r) { return '<span class="e1-mono">' + esc(r[0]) + '</span>' + (r[2] ? '<span class="ag-sub" style="font-family:var(--font-ui)">' + esc(r[2]) + '</span>' : ''); } }, { key: 'v', label: 'Count', align: 'right', render: function (r) { return r[1] === undefined ? '<span class="e1-muted">not measured</span>' : '<span class="ag-num">' + fmt.num(r[1]) + '</span>'; } }], rows: counters });
      var cond = CONDITIONS.map(function (x, i) {
        var st = 'passed';
        if (g.verdict === 'ineligible' && g.fail === i + 1) st = 'failed';
        if (g.verdict === 'not_measurable' && (i === 0 || i === 7)) st = 'not measured';
        if (stateQ === 'not-measurable' && (i === 0 || i === 7)) st = 'not measured';
        if (stateQ === 'stale' && i === 7) st = 'failed';
        if (g.verdict === 'never') st = i === 0 ? 'not measured' : 'not measured';
        var badge = st === 'passed' ? c.badge('good', 'Passed') : st === 'failed' ? c.badge('neutral', 'Not met', { icon: 'x' }) : c.badge('warning', 'Not measured', { icon: 'minus' });
        var detail = ['Continuous since 27 Mar 2028 · seq ' + (g.seqs || '—'), (g.sub ? fmt.num(g.sub) + ' records · ' + fmt.num((g.unam || 0) + (g.am || 0) + (g.dec || 0)) + ' approvals' : 'not measured'), g.unam !== undefined ? 'ratio ' + ((g.unam / Math.max(1, g.unam + g.am + g.dec)) * 100).toFixed(1) + '% · threshold set in score_v1' : 'not measured', 'corrected_after_window ' + (g.corr || 0) + ' · sandbox_diverged ' + (g.div || 0), g.drill ? 'Drilled ' + g.drill : 'No drill recorded', 'erp.ar v7 in force since 19 Sep; policy 11', 'Tenant live · no open P0', stateQ === 'stale' ? 'Last computed 26 Sep 2028 — stale. A stale score cannot be used in a graduation.' : (g.score ? 'score_v1 = ' + g.score + ' · computed ' + g.computed : 'not measurable — chain continuity over the window is incomplete (seq 88,120–88,164)')][i];
        return '<li><span class="ag-check__n">' + (i + 1) + '</span><span class="ag-check__t">' + esc(x[0]) + (x[1] ? ' <span class="ag-tag">Hard bar</span>' : '') + '<small>' + esc(detail) + '</small></span>' + badge + '</li>';
      }).join('');
      var banner = '';
      if (g.verdict === 'never') banner = c.callout({ kind: 'rule', title: (g.neverBy ? 'Never by graduation — ' : 'Never — ') + g.failText + '.', body: '<p>' + (g.neverBy ? 'Tenant and cross-boundary classes change only by a declared grant with dual control, never by graduation.' : 'No reversal plan means no A3 or above. This class stays at A2 or below for good.') + '</p>' });
      else if (g.verdict === 'revoked') banner = c.callout({ kind: 'info', title: 'Revoked to A2 on ' + g.revokedOn + ' — ' + g.failText + '.', body: '<p>Reversion is not a failure state. A re-proposal needs a fresh 30-day window; two revocations mean an ADR is needed before a third proposal.</p>' });
      else if (g.verdict === 'not_measurable' || stateQ === 'not-measurable') banner = c.callout({ kind: 'warning', title: 'not_measurable — chain continuity over the window is incomplete (seq 88,120–88,164).', body: '<p>What would change this: the nightly chain check covering that range. Until then no graduation can be proposed.</p>' });
      else if (stateQ === 'stale') banner = c.callout({ kind: 'warning', title: 'Last computed 26 Sep 2028 — stale.', body: '<p>A stale score cannot be used in a graduation. Recompute before proposing or deciding.</p>' });
      var sup = g.sup ? c.card({ title: 'Supervised period', body: c.kv([['Until', g.sup], ['Sampling', '1 in 10, chosen by record digest'], ['Samples routed', fmt.num(g.samples.routed)], ['Committed unamended', fmt.num(g.samples.committed)], ['Amended', fmt.num(g.samples.amended)], ['Declined', fmt.num(g.samples.declined)]], { compact: true }) + '<div style="margin-top:var(--space-3)">' + c.button('Open supervised samples', { size: 'sm', href: '#/work/approvals?filter=supervised' }) + '</div>' }) : '';
      var modelNote = g.score ? c.card({ title: 'Summary', body: '<p class="e1-caption e1-muted">' + c.icon('sparkle', 12) + ' Summary written by a model. Check it against the counts.</p><p>' + esc(label) + ' by agents: ' + fmt.num(g.sub) + ' submitted over 180 days; ' + fmt.num(g.unam) + ' approved unamended, ' + fmt.num(g.dec) + ' declined, ' + fmt.num(g.corr || 0) + ' corrected after the window.</p>' }) : '';
      var hist = c.timeline([
        g.verdict === 'revoked' ? { time: g.revokedOn + ' 2028', title: 'Revoked to A2 automatically', body: g.failText + '. Effective at the next write.', state: 'info', href: '#/assurance/proof/57102' } : null,
        g.sup ? { time: '14 Sep 2028', title: 'Graduated to A3 · supervised until ' + g.sup, body: 'Proposed by Priya Nair, approved by Arjun Mehta. Justification recorded verbatim.', state: 'good', href: '#/assurance/proof/58311' } : null,
        { time: '27 Mar 2028', title: 'Window opened · 180 days', body: 'Counters start from the first record in the window.', state: 'neutral' }
      ].filter(Boolean));
      return header + c.callout({ kind: 'caveat', title: 'Preview with sample counts — dated 24 Sep 2028.', body: '<p>Illustrative counts for a tenant with 180 days of history; not Kaveri Spinning Mills’ own.</p>' }) + (banner ? '<div style="margin-top:var(--space-3)">' + banner + '</div>' : '') + '<div class="e1-split e1-split--wide" style="margin-top:var(--space-4)"><div class="e1-stack e1-stack--lg">' +
        c.section({ id: 'cond', title: 'Eight conditions', lead: 'Each is passed, not met or not measured. Hard bars cannot be outweighed.', body: c.card({ body: '<ol class="ag-check">' + cond + '</ol>' }) }) +
        c.section({ id: 'counters', title: 'Counters in full', lead: 'Rolling window 180 days. Score ' + (g.score ? 'score_v1 = ' + g.score + ' over seq ' + g.seqs : 'not computed') + '.', body: '<div class="e1-grid e1-grid--2">' + countersHtml + (gateHtml || c.empty({ title: 'No refusal breakdown', why: 'Counters are not measured for this class.', compact: true })) + '</div>' }) +
        c.section({ id: 'history', title: 'Graduation and revocation history', body: hist }) +
        '</div><aside class="e1-stack">' + c.card({ title: 'Class', body: c.kv([['Write type', p.classId, { mono: true }], ['Actor kind', 'Agent'], ['Blast radius', g.blast, { mono: true }], ['Level now', g.level + (g.sup ? ' supervised' : '')], ['Agents in class', (g.agents || []).map(function (id) { return '<a href="#/agents/agent/' + id + '">' + esc((agent(id) || {}).name || id) + '</a>'; }).join(', '), { html: true }], ['Reversal drill', g.drill || 'None recorded']], { compact: true }) }) + sup + modelNote + '</aside></div>';
    },
    mount: function (el, p) {
      el.addEventListener('click', function (e) {
        if (e.target.closest('[data-ag-recompute]')) { E1.toast('Recomputed from the chain: the same numbers. A different result from the same records would raise a P0.', 'good', { title: 'Recomputed' }); }
        if (e.target.closest('[data-ag-revoke]')) {
          E1.confirm({ title: 'Revoke ' + p.classId.replace(/^erp\./, '') + ' to A2?', eyebrow: 'Governed write · one press', kind: 'danger', confirmLabel: 'Revoke to A2', body: '<p>Takes effect at the next write. In-flight writes complete.</p><p class="e1-caption">No justification is required. Lowering needs one person and one press.</p>', onConfirm: function () { var s = nextSeq(); E1.toast('Revoked to A2 from the next write. Proof #' + fmt.num(s) + '.', 'info', { title: 'Revoked', action: { label: 'Open proof', href: '#/assurance/proof/' + s } }); } });
        }
      });
    }
  });

  function renderGraduatePropose(w, q, path) {
    var g = gradOf(w.name);
    var header = c.pageHeader({ eyebrow: 'Governed write · autonomy.graduate · dual control · blast radius tenant', title: 'Propose A3', lead: 'Raise this action class from A2 to A3 on its own record. You write the justification; a second named person decides.', back: ['Graduation · ' + w.label, '#/agents/graduation/' + w.name],
      actions: E1.atLeast('L3') ? stateMenu(path, q, [['submitted', 'Submitted'], ['not-earned', 'Refused · not earned']]) : c.level('L3') });
    if (!E1.atLeast('L3')) return header + gradLocked();
    if (!g || g.verdict !== 'eligible' || q.state === 'not-earned') {
      var gg = g || { failText: 'no precedent yet' };
      return header + c.refusal({ code: 'POLICY.AUTONOMY_NOT_EARNED', title: 'Not done — this class has not earned A3', rule: 'A2 → A3 by graduation only, and only when all eight conditions hold.', ruleName: 'Earned autonomy', version: 'score_v1', numbers: [{ label: 'First failing condition', value: gg.verdict === 'eligible' ? 'approved_unamended ratio below threshold' : (gg.failText || '—') }, { label: 'What would change it', value: 'A fresh 30-day window with the condition met' }], action: { label: 'Open the class', href: '#/agents/graduation/' + w.name }, proofHref: '#/assurance/proof/4113' });
    }
    if (q.state === 'submitted') {
      return header + c.callout({ kind: 'good', title: 'Submitted. Nothing changes until a second person decides.', body: '<p>GA-2028-0412 is waiting on ' + esc(personName(q.approver || 'arjun-mehta')) + '. They will see the counts, the score, the seq range and your justification verbatim — and no recommendation.</p>' }) + '<div class="ag-inline" style="margin-top:var(--space-4)">' + c.button('Open GA-2028-0412', { kind: 'primary', href: '#/work/decide/GA-2028-0412' }) + c.button('Back to the class', { href: '#/agents/graduation/' + w.name }) + '</div>';
    }
    var appr = (E1.data.people || []).filter(function (x) { return x.kind === 'person' && x.id !== uid() && (x.mayApprove === true || x.mayApprove === 'certify'); }).map(function (x) { return { value: x.id, label: x.name + ' · ' + x.role.replace(/ \(.*\)$/, '') }; });
    var form = '<form class="e1-stack" data-ag-grad novalidate>' +
      c.kv([['Class', w.name + ' · agent · ' + g.blast], ['Change', 'A2 Propose → A3 Act reversible'], ['Evidence snapshot', fmt.num(g.sub) + ' submitted · ' + fmt.num(g.unam) + ' / ' + fmt.num(g.am) + ' / ' + fmt.num(g.dec) + ' approvals · 0 corrected after window · 0 sandbox diverged'], ['Score', 'score_v1 = ' + g.score + ' · seq ' + g.seqs + ' · computed ' + g.computed], ['Reversal plan', w.plan + ' · drilled ' + g.drill], ['Supervised period', '30 days · 1 in 10 writes to a person, chosen by the record’s own digest']], { compact: true }) +
      c.field('Justification', c.textarea({ id: 'ag-just', rows: 5, describedBy: 'ag-just-msg' }), { id: 'ag-just', required: true, help: 'Required, and not pre-filled by us. Write it in your own words; it is recorded verbatim.' }) +
      '<div>' + c.button('Draft with a model', { size: 'sm', kind: 'ghost', icon: 'sparkle', attrs: 'data-ag-draft' }) + '<span class="e1-caption e1-muted"> A draft is marked as a draft; you must edit it before you can submit.</span></div>' +
      c.field('Second approver', c.select({ id: 'ag-gappr', options: [{ value: '', label: 'Choose a person' }].concat(appr) }), { id: 'ag-gappr', required: true, help: 'Cannot be you.' }) +
      '<div class="ag-inline">' + c.button('Submit for approval', { kind: 'primary', type: 'submit' }) + c.button('Cancel', { kind: 'ghost', href: '#/agents/graduation/' + w.name }) + '</div></form>';
    return header + '<div class="e1-split e1-split--wide"><div>' + c.card({ body: form }) + '</div><aside class="e1-stack">' + c.callout({ kind: 'rule', title: 'No recommendation.', body: '<p>There is no “we suggest approving”. The approver sees numbers and your words.</p>' }) + c.callout({ kind: 'info', title: 'Revoking later is one press.', body: '<p>Anyone with the role can take it back to A2 at any time, with no justification.</p>' }) + '</aside></div>';
  }
  E1.on('click', '[data-ag-draft]', function (e) {
    var t = document.getElementById('ag-just'); if (!t) return;
    t.value = '[DRAFT — written by a model; edit before submitting] Over 180 days this class submitted 1,142 invoices; 900 were approved unamended and none was corrected after the window.';
    t.setAttribute('data-draft', t.value); t.focus();
  });
  E1.on('submit', '[data-ag-grad]', function (e, form) {
    e.preventDefault();
    var t = form.querySelector('#ag-just'), a = form.querySelector('#ag-gappr'), msg = document.getElementById('ag-just-msg');
    var bad = t.value.trim().length < 12 ? 'Write the justification yourself — at least one sentence.' : (t.getAttribute('data-draft') && t.value === t.getAttribute('data-draft')) || /^\[DRAFT/.test(t.value) ? 'Edit the model draft and remove the DRAFT marker. The justification must be yours.' : '';
    if (bad) { t.setAttribute('aria-invalid', 'true'); if (msg) { msg.textContent = bad; msg.classList.add('is-error'); } t.focus(); return; }
    if (!a.value) { a.setAttribute('aria-invalid', 'true'); a.focus(); E1.toast('Choose the second approver.', 'warning'); return; }
    var r = E1.state.route; E1.go(r.path, { via: 'graduation', state: 'submitted', approver: a.value });
  });

  /* ========================================================================
     KEYS
     ======================================================================== */
  function keyOf(id) { var k = KEYS.filter(function (x) { return x.id === id; })[0]; if (!k) return null; var o = ov().keys[id]; return o ? Object.assign({}, k, o) : k; }
  function keyStatus(k) {
    if (k.status === 'revoked') return c.badge('neutral', 'Revoked', { icon: 'x' });
    if (k.status === 'overlap') return c.badge('info', 'Rotating · overlap 24 h', { icon: 'refresh' });
    if (k.status === 'requested') return c.badge('warning', 'Rotation requested', { icon: 'clock' });
    var d = k.rotateBy ? daysLeft(k.rotateBy) : null;
    if (d !== null && d <= 14) return c.badge('warning', 'Rotate within ' + d + ' days');
    return c.badge('good', 'Active');
  }
  function keyActor(k) { if (k.actor) return '<a href="#/agents/agent/' + esc(k.actor) + '">' + esc(agent(k.actor).name) + '</a>' + (k.level ? ' · <span class="ag-num">' + esc(k.level) + '</span>' : ''); if (k.actorPerson) return '<a href="#/agents/people/' + esc(k.actorPerson) + '">' + esc(personName(k.actorPerson)) + '</a>' + (k.level ? ' · <span class="ag-num">' + esc(k.level) + '</span>' : ''); return esc(k.actorText || '—'); }
  function clsWord(k) { return { tenant: 'Tenant token', control: 'Control token', ops: 'Ops token' }[k.cls]; }
  function envWord(k) { return k.env === 'production' ? 'Production · ' + tenantName(k.tenant).replace(/ Spinning Mills Pvt Ltd$/, '') : k.env === 'sandbox' ? 'Sandbox tenant · ' + k.tenant : k.env === 'control' ? 'Studio and registry' : 'Operations'; }
  function allKeys() { var o = ov(); var extra = Object.keys(o.keys).filter(function (id) { return o.keys[id].isNew; }).map(function (id) { return Object.assign({ id: id }, o.keys[id]); }); return KEYS.map(function (k) { return keyOf(k.id); }).concat(extra); }

  reg('/agents/keys', {
    title: 'Keys', section: 'keys', wide: true, crumbs: crumbs(), keywords: 'api keys sandbox production rotation',
    render: function (p, q) {
      var path = '/agents/keys', tab = q.tab || 'all', keys = allKeys();
      var header = c.pageHeader({ tabs: accessTabs('keys'), eyebrow: 'Agents · access', title: 'Keys', lead: 'API keys, sandbox and production: who each is bound to, when it was last used, and when it must be rotated.', actions: stateMenu(path, q, [['empty', 'Empty'], ['error', 'Error']]) + c.button('Key policy', { href: '#/agents/keys/policy', icon: 'file-text' }) + c.button('Request a production key', { href: '#/developers/production-request', icon: 'send' }) + c.button('Create sandbox key', { kind: 'primary', icon: 'plus', attrs: 'data-ag-newkey' }) });
      var v = variant(q, { empty: { title: 'No keys yet.', why: 'Create a sandbox key to start; production keys are issued by elan1 after the onboarding checklist.', action: [{ label: 'Create sandbox key', href: '#/developers/sandbox-key' }, { label: 'What the checklist asks', href: '#/developers/production-request' }], icon: 'key' }, error: { title: 'We cannot list your keys right now.', body: 'The key service did not answer.', reassurance: 'Your keys keep working while this page is unavailable. Nothing has been issued, rotated or revoked.', code: 'PLATFORM.REGISTRY_UNAVAILABLE', action: { label: 'Try again', href: E1.href(path) } } });
      if (v) return header + v;
      var shown = keys.filter(function (k) { return tab === 'all' || (tab === 'production' && k.env === 'production') || (tab === 'sandbox' && k.env === 'sandbox') || (tab === 'control' && (k.cls === 'control' || k.cls === 'ops')); });
      var tabs = tabsAsFilters([
        { id: 'all', label: 'All', href: E1.href(path), count: keys.length },
        { id: 'production', label: 'Production', href: E1.href(path, { tab: 'production' }), count: keys.filter(function (k) { return k.env === 'production'; }).length },
        { id: 'sandbox', label: 'Sandbox tenant', href: E1.href(path, { tab: 'sandbox' }), count: keys.filter(function (k) { return k.env === 'sandbox'; }).length },
        { id: 'control', label: 'Control and ops', href: E1.href(path, { tab: 'control' }), count: keys.filter(function (k) { return k.cls !== 'tenant'; }).length }
      ], tab, 'Keys');
      var soon = keys.filter(function (k) { return k.status !== 'revoked' && k.rotateBy && daysLeft(k.rotateBy) <= 14; });
      var table = c.table({ caption: 'API keys', rowHref: function (k) { return '#/agents/keys/' + k.id; }, columns: [
        { key: 'prefix', label: 'Key', nowrap: true, render: function (k) { return '<span class="e1-mono">' + esc(k.prefix) + '</span><span class="ag-sub" style="font-family:var(--font-ui)">' + esc(k.id) + '</span>'; } },
        { key: 'cls', label: 'Class', render: function (k) { return esc(clsWord(k)); } },
        { key: 'env', label: 'Environment', render: function (k) { return esc(envWord(k)); } },
        { key: 'actor', label: 'Bound to · level', render: keyActor },
        { key: 'sc', label: 'Scopes', render: function (k) { return '<span class="ag-inline">' + k.scopes.map(function (s) { return '<span class="ag-tag">' + esc(s) + '</span>'; }).join('') + '</span>'; } },
        { key: 'cr', label: 'Created', render: function (k) { return '<span class="e1-caption">' + esc(fmt.date(ist(k.created))) + '</span>'; } },
        { key: 'lu', label: 'Last used', render: function (k) { return k.last ? '<span class="e1-caption">' + esc(when(k.last)) + '</span>' : '<span class="e1-caption e1-muted">Not used yet</span>'; } },
        { key: 'rb', label: 'Rotation window', render: function (k) { if (k.status === 'revoked') return '<span class="e1-caption e1-muted">—</span>'; if (!k.rotateBy) return '—'; var d = daysLeft(k.rotateBy); return '<span class="e1-caption">rotate by ' + esc(fmt.date(ist(k.rotateBy))) + '</span><span class="ag-sub" style="font-family:var(--font-ui)">' + fmt.plural(d, 'day') + ' left</span>'; } },
        { key: 'st', label: 'Status', render: function (k) { return keyStatus(k) + (k.note ? '<span class="ag-sub" style="font-family:var(--font-ui)">' + esc(k.note) + '</span>' : ''); } }
      ], rows: shown, empty: { title: 'No keys in this view', why: 'Switch tabs to see the others.', action: { label: 'All keys', href: E1.href(path) }, compact: true } });
      return header +
        c.callout({ kind: 'rule', title: 'Production keys are issued by us, never self-serve in Phase 1.', body: '<p>A production key is issued by elan1 after a person reads the onboarding checklist (items 3, 5, 8 and 11), scoped to your tenant, its declared write types and its residency domain, and shown once. Sandbox keys are self-serve and reach only a sandbox tenant with synthetic fixtures.</p>' }) +
        (soon.length ? '<div style="margin-top:var(--space-4)">' + c.callout({ kind: 'warning', title: fmt.plural(soon.length, 'key') + ' must be rotated within 14 days.', body: '<p>' + soon.map(function (k) { return '<a class="e1-mono" href="#/agents/keys/' + k.id + '/rotate">' + esc(k.prefix) + '</a> — rotate by ' + esc(fmt.date(ist(k.rotateBy))) + ' (' + fmt.plural(daysLeft(k.rotateBy), 'day') + ' left)'; }).join('<br>') + '</p>' }) + '</div>' : '') +
        '<div style="margin-top:var(--space-5)">' + tabs + '</div><div style="margin-top:var(--space-3)">' + table + '</div>' +
        '<div class="e1-grid e1-grid--2" style="margin-top:var(--space-6)">' + c.card({ title: 'Signing keys', body: E1.atLeast('L2') ? '<p>The domain signing key register, custody holders and fingerprints.</p>' + c.button('Open signing keys', { size: 'sm', href: '#/agents/keys/signing', iconRight: 'arrow-right' }) : '<p class="e1-caption">Signing keys arrive at Assurance Level 2. At Level 1 records are hash-chained, not signed, and there is no key material anywhere.</p>' + c.button('Why there are none', { size: 'sm', href: '#/agents/keys/signing', iconRight: 'arrow-right' }) }) +
        c.card({ title: 'Webhook secrets', body: '<p class="e1-caption">Each webhook endpoint has its own signing secret, rotated separately from API keys.</p>' + c.button('Open webhooks', { size: 'sm', href: '#/agents/webhooks', iconRight: 'arrow-right' }) }) + '</div>';
    }
  });
  E1.on('click', '[data-ag-newkey]', function () {
    var bind = [{ value: 'ledgerloop-billing-agent', label: 'LedgerLoop billing agent (sandbox tenant ledgerloop-sbx)' }, { value: 'farah-sheikh', label: 'Farah Sheikh (reference tenant)' }, { value: 'credit-review-agent', label: 'credit-review agent (reference tenant)' }];
    E1.modal({ title: 'Create a sandbox key', eyebrow: 'Self-serve · sandbox tenant only', size: 'md', body: '<div class="e1-stack">' +
      c.field('Bind to', c.select({ id: 'ag-nk-b', options: bind, value: 'credit-review-agent' }), { id: 'ag-nk-b', help: 'A tenant token carries one tenant, one actor and one autonomy level.' }) +
      '<fieldset class="ag-fieldset"><legend>Scopes</legend>' + c.checkbox({ id: 'ag-nk-ro', label: 'ro — read', checked: true }) + c.checkbox({ id: 'ag-nk-st', label: 'stage — validate with no side effects', checked: true }) + c.checkbox({ id: 'ag-nk-ac', label: 'act — submit writes to the sandbox tenant' }) + '</fieldset>' +
      c.callout({ kind: 'info', title: 'Limits: 10 writes a minute, 2 concurrent, 5,000 a month.', body: '<p>Sandbox writes carry mode: sandbox, are metered at quantity zero and can never be presented as production ones.</p>' }) + '</div>',
      actions: [{ label: 'Cancel', kind: 'ghost' }, { label: 'Create key', kind: 'primary', onClick: function (e, close, m) {
        var id = 'key-sbx-' + String(Date.now()).slice(-4), full = 'sk_sbx_' + hex64(id).slice(0, 32), o = ov();
        var b = m.querySelector('#ag-nk-b').value, isAgent = !!agent(b);
        var scopes = [['ag-nk-ro', 'ro'], ['ag-nk-st', 'stage'], ['ag-nk-ac', 'act']].filter(function (s) { return m.querySelector('#' + s[0]).checked; }).map(function (s) { return s[1]; });
        o.keys[id] = { isNew: true, prefix: 'sk_sbx_…' + full.slice(-4), cls: 'tenant', env: 'sandbox', tenant: b === 'ledgerloop-billing-agent' ? 'ledgerloop-sbx' : 'ref-tenant', actor: isAgent ? b : null, actorPerson: isAgent ? null : b, level: 'A1', scopes: scopes.length ? scopes : ['ro'], created: '2026-09-24', last: null, rotateBy: '2026-12-23', status: 'active', note: 'Created just now · 10 writes/min, 2 concurrent' };
        saveOv(o);
        setTimeout(function () {
          E1.modal({ title: 'Your new sandbox key', eyebrow: 'Shown once', body: '<div class="e1-stack"><div class="ag-reveal"><code>' + esc(full) + '</code>' + c.button('Copy', { size: 'sm', icon: 'copy', attrs: 'data-copy="' + esc(full) + '" data-copy-label="Sandbox key"' }) + '</div><p><strong>We will not show this again.</strong> Store it in your secret manager now. If you lose it, rotate the key.</p></div>', actions: [{ label: 'I have stored it', kind: 'primary', onClick: function () { E1.render(); } }] });
        }, 60);
      } }] });
  });

  reg('/agents/keys/signing', {
    title: 'Signing keys', section: 'keys', wide: true, crumbs: crumbs([['Keys', '#/agents/keys']]), keywords: 'L2 signing custody fingerprint kms',
    render: function (p, q) {
      var header = c.pageHeader({ tabs: accessTabs('signing'), eyebrow: 'Agents · keys · L2', title: 'Signing keys', lead: 'The keys that will sign each record’s digest at Assurance Level 2: who holds custody, their fingerprints and their windows. Never the key material.', back: ['Keys', '#/agents/keys'], actions: c.level('L2') + c.button('Key policy', { href: '#/agents/keys/policy', icon: 'file-text' }) });
      if (!E1.atLeast('L2')) {
        return header + c.locked({ level: 'L2', title: 'Signing arrives at Assurance Level 2 Attested', why: 'No signing keys exist at Level 1. Records are hash-chained, not signed. Signing arrives at Assurance Level 2.', items: ['A register of domain signing keys, one per residency domain', 'Custody holders and fingerprints — never key material', 'Rotation with abutting windows: “Overlap: none”', 'Revocation with a declared T_suspect'] }) +
          '<div style="margin-top:var(--space-5)">' + c.empty({ title: 'At L1 there are no keys, and there is no key material anywhere — not in a config file, not in a vault, not “just for testing”.', why: 'A record at Level 1 is checked by the chain’s hash links, which you can verify only with us. That limitation is stated on every proof page.', fill: 'The upgrade to Level 2 generates the first key inside the custody module, where it stays.', action: [{ label: 'The L1 → L2 upgrade', href: '#/assurance/upgrade' }, { label: 'API keys', href: '#/agents/keys' }], icon: 'key' }) + '</div>';
      }
      var cls = q.cls || 'domain';
      var map = { domain: /^Domain/, anchor: /^Anchor/, release: /^Release/, transport: /^Transport/ };
      var rows = SIGNING.filter(function (k) { return map[cls].test(k.cls); });
      var tabs = tabsAsFilters([{ id: 'domain', label: 'Domain signing', href: '#/agents/keys/signing' }, { id: 'anchor', label: 'Anchor client', href: '#/agents/keys/signing?cls=anchor' }, { id: 'release', label: 'Release', href: '#/agents/keys/signing?cls=release' }, { id: 'transport', label: 'Transport', href: '#/agents/keys/signing?cls=transport' }], cls, 'Class');
      var ST = { active: ['good', 'Active'], retired: ['neutral', 'Retired'], registered: ['info', 'Registered — valid_from in future'], revoked: ['neutral', 'Revoked'] };
      var table = c.table({ caption: 'Signing key register', columns: [
        { key: 'id', label: 'key_id', render: function (k) { return '<span class="e1-mono">' + esc(k.id) + '</span><span class="ag-sub" style="font-family:var(--font-ui)">' + esc(k.cls) + '</span>'; } },
        { key: 'st', label: 'Status', render: function (k) { var s = ST[k.status]; return c.badge(s[0], s[1], { subtle: true }) + (k.tSuspect ? '<span class="ag-sub">T_suspect ' + esc(k.tSuspect) + '</span>' : ''); } },
        { key: 'w', label: 'Window (UTC)', render: function (k) { return '<span class="e1-mono e1-caption">' + esc(k.from.slice(0, 10)) + ' → ' + esc(k.to ? k.to.slice(0, 10) : 'open') + '</span>'; } },
        { key: 's', label: 'Successor', render: function (k) { return k.succ ? '<span class="e1-mono e1-caption">' + esc(k.succ) + '</span>' : '—'; } },
        { key: 'fp', label: 'Fingerprint', render: function (k) { return '<span class="e1-mono e1-caption">' + esc(k.fp) + '</span>'; } },
        { key: 'n', label: 'Records signed', align: 'right', render: function (k) { return '<span class="ag-num">' + esc(k.signed) + '</span>'; } },
        { key: 'c', label: 'Custody', render: function (k) { return '<span class="e1-caption">' + esc(k.custody) + '</span>'; } }
      ], rows: rows, empty: cls === 'transport' ? { title: 'Transport keys are not in the evidence path', why: 'TLS and the per-write single-use credential live in ordinary platform secret management. They sign nothing a reader verifies.', compact: true, icon: 'lock' } : { title: 'No key in this class', why: 'None registered.', compact: true } });
      var rev = SIGNING.filter(function (k) { return k.status === 'revoked'; })[0];
      return header + c.callout({ kind: 'caveat', title: 'One signing key per residency domain, not per tenant.', body: '<p>A tenant cannot prove its records were signed by a key no other tenant’s records used. A dedicated key requires a dedicated residency domain (Enterprise) or customer-held keys (Level 3).</p>' }) +
        '<div style="margin-top:var(--space-5)">' + tabs + '</div><div style="margin-top:var(--space-3)">' + table + '</div>' +
        '<div class="e1-grid e1-grid--2" style="margin-top:var(--space-5)">' +
        c.card({ title: 'Window for k_in_20270701_4d7e', body: '<div class="ag-window"><div class="ag-window__seg">Predecessor<b>k_in_20270401_9c3a</b>2027-04-01 → 2027-07-01</div><div class="ag-window__seg is-this">This key<b>k_in_20270701_4d7e</b>2027-07-01 → 2028-07-01</div><div class="ag-window__seg">Successor<b>k_in_20280701_b21f</b>from 2028-07-01</div></div>' + c.badge('good', 'Overlap: none') + '<p class="e1-caption" style="margin-top:var(--space-2)">Windows abut, never overlap. Rotation record seq 1,204 (operator chain), requested by Meera Iyer and approved by Arjun Rao, registered thirty days before the cut.</p>' }) +
        c.card({ title: 'Revoked key · ' + rev.id, body: '<p class="e1-caption">T_suspect ' + esc(rev.tSuspect) + ' · “' + esc(rev.reason) + '”</p><ul style="margin:var(--space-2) 0 0;padding-left:18px"><li>They still verify.</li><li>They are no longer exclusive.</li><li>They are still anchored.</li></ul><p class="e1-caption" style="margin-top:var(--space-2)">9,311 of the 9,480 records are covered by anchors issued before T_suspect; 169 are not.</p>' }) + '</div>' +
        '<div class="ag-inline" style="margin-top:var(--space-5)">' + c.button('Request key material', { icon: 'download', attrs: 'data-ag-material' }) + '<span class="e1-caption e1-muted">There is no Export, no Download and no “Sign” action anywhere. There is no administrative “sign this” surface.</span></div>' +
        '<p class="ag-foot">Key-use reconciliation, 25 Oct 2027, domain in: Sign calls 3,118 · signed records 3,118 · reconciled · scope all tenants in domain in. Dual control applies to generating, registering, rotating and revoking a key; none has an emergency variant.</p>';
    }
  });
  E1.on('click', '[data-ag-material]', function () {
    E1.modal({ title: 'Not done — key material cannot leave custody', eyebrow: 'Refusal', size: 'sm', body: c.refusal({ code: 'POLICY.DENIED_BY_RULE', title: 'Not done — key material is never exported', rule: 'A custody module that can export a key is not a custody module.', ruleName: 'Key custody (E16)', version: 'platform v3', numbers: [{ label: 'Key material exported, ever', value: '0' }], action: { label: 'Read the key policy', href: '#/agents/keys/policy' } }), actions: [{ label: 'Close', kind: 'primary' }] });
  });

  reg('/agents/keys/policy', {
    title: 'Key policy', section: 'keys', crumbs: crumbs([['Keys', '#/agents/keys']]), keywords: 'rotation window token classes kms',
    render: function () {
      var header = c.pageHeader({ tabs: accessTabs('policy'), eyebrow: 'Agents · keys', title: 'Key policy', lead: 'The rules every key follows: who issues it, what it can reach, how long it lives and how it is rotated.', back: ['Keys', '#/agents/keys'] });
      var rules = c.table({ caption: 'API key rules', columns: [{ key: 'k', label: 'Rule' }, { key: 'v', label: 'What it means' }], rows: [
        { k: 'Production keys', v: 'Issued by elan1 after a human review, never self-serve. Scoped to tenant, declared write types and residency domain.' },
        { k: 'Sandbox keys', v: 'Self-serve. An isolated sandbox tenant with synthetic fixtures; 10 writes a minute, 2 concurrent, 5,000 a month hard stop; provisioned in under 60 seconds.' },
        { k: 'Shown once', v: 'A key is shown once when it is created, then masked. We cannot show it again.' },
        { k: 'Rotation window', v: '90 days. A key turns “Rotate within n days” 14 days before its date.' },
        { k: 'Rotation overlap', v: 'Sandbox: the old key keeps working for 24 hours after the new one is shown, then is revoked. Production: rotated by elan1 on request, with the same overlap.' },
        { k: 'Exchange', v: 'Keys are exchanged for short-lived tenant tokens (5–15 minutes) by client credentials. Static keys are not accepted on MCP.' },
        { k: 'Revocation', v: 'A governed write by one person. Calls with a revoked key are rejected before the kernel and leave no proof entry; the revocation itself does.' }
      ] });
      var classes = c.table({ caption: 'Token classes', columns: [{ key: 'k', label: 'Class' }, { key: 'v', label: 'Reaches' }, { key: 'n', label: 'Never reaches' }], rows: [
        { k: 'Tenant token', v: 'One tenant, one actor, one autonomy level. The only class that reaches /v1/writes. Scopes ro, stage, act.', n: 'Another tenant; the registry' },
        { k: 'Control token', v: 'Studio, registry, /v1/declarations, /v1/actors, /v1/tenants.', n: 'Any record store — there is no network route' },
        { k: 'Ops token', v: 'Read-only operations.', n: 'Tenant data. Break-glass is a governed write, not a token.' },
        { k: 'Service token', v: 'stack1 internal.', n: 'KernelPort' }
      ] });
      var l2 = E1.atLeast('L2') ? c.section({ id: 'kms', title: 'Signing key custody (L2)', lead: 'The KMS key policy, verbatim. We do not write to the provider’s configuration history.', body: '<pre class="ag-pre">{\n  "KeySpec": "ECC_NIST_EDWARDS25519",\n  "Origin": "AWS_KMS",\n  "Region": "ap-south-1",\n  "Statement": [{\n    "Effect": "Allow",\n    "Principal": { "AWS": "arn:aws:iam::…:role/elan1-chain-writer-in" },\n    "Action": "kms:Sign",\n    "Resource": "*"\n  }]\n}</pre>' + '<div style="margin-top:var(--space-3)">' + c.callout({ kind: 'caveat', title: 'The limitation, stated unprompted.', body: '<p>At Phase 3 the signing key is held in our cloud account under a managed KMS. A sufficiently privileged insider in that account could alter the key policy. The custody model that removes this is customer-held keys, which is L3.</p>' }) + '</div>' }) :
        c.section({ id: 'kms', title: 'Signing key custody', body: c.locked({ level: 'L2', compact: true, title: 'Signing key custody arrives at Assurance Level 2 Attested', why: 'At Level 1 there is no signing key and no custody policy to show.' }) });
      return header + c.section({ id: 'api', title: 'API keys', body: rules }) + c.section({ id: 'classes', title: 'Token classes', body: classes }) + l2;
    }
  });

  reg('/agents/keys/:id', {
    title: function (p) { var k = keyOf(p.id); return k ? 'Key ' + k.prefix : 'Key'; }, section: 'keys', example: '/agents/keys/key-prod-01',
    crumbs: crumbs([['Keys', '#/agents/keys']]), keywords: 'api key detail',
    render: function (p, q) {
      var k = keyOf(p.id) || (ov().keys[p.id] ? Object.assign({ id: p.id }, ov().keys[p.id]) : null);
      if (!k) return notFound('Key', p.id, ['Open keys', '#/agents/keys']);
      var prod = k.env === 'production' || k.cls !== 'tenant';
      var header = c.pageHeader({ eyebrow: clsWord(k) + ' · ' + envWord(k), title: k.prefix, lead: (k.actor ? 'Bound to ' + agent(k.actor).name : k.actorPerson ? 'Bound to ' + personName(k.actorPerson) : 'Used by ' + (k.actorText || 'operations')) + (k.level ? ' at ' + lvlName(k.level) : '') + '. ' + (prod ? 'Issued by elan1.' : 'Self-serve sandbox key.'), back: ['Keys', '#/agents/keys'],
        actions: k.status === 'revoked' ? '' : c.button(prod ? 'Request rotation from elan1' : 'Rotate', { icon: 'refresh', href: '#/agents/keys/' + k.id + '/rotate', kind: 'primary' }) + c.button('Revoke', { icon: 'stop', kind: 'danger', href: '#/agents/keys/' + k.id + '/revoke' }),
        meta: keyStatus(k) + '<span class="e1-mono">' + esc(k.id) + '</span>' });
      var d = k.rotateBy ? daysLeft(k.rotateBy) : null, total = k.rotateBy ? Math.round((new Date(ist(k.rotateBy)) - new Date(ist(k.created))) / DAY) : null;
      var windowCard = c.card({ title: 'Rotation window', body: k.status === 'revoked' ? '<p>Revoked ' + esc(fmt.dateTime(k.revokedAt || new Date(NOW).toISOString())) + (k.revokedSeq ? ' · <a href="#/assurance/proof/' + k.revokedSeq + '">proof #' + fmt.num(k.revokedSeq) + '</a>' : '') + '. Calls with it are rejected before the kernel.</p>' :
        c.progress(total - d, total, { label: 'Created ' + fmt.date(ist(k.created)) + ' → rotate by ' + fmt.date(ist(k.rotateBy)), note: fmt.plural(d, 'day') + ' left', state: d <= 14 ? 'warning' : 'accent' }) + '<p class="e1-caption" style="margin-top:var(--space-2)">The key turns “Rotate within n days” 14 days before its date. ' + (prod ? 'Production keys are rotated by elan1 on request.' : 'Sandbox keys rotate themselves here, with a 24-hour overlap.') + '</p>' });
      var reach = c.card({ title: 'What this key can reach', body: c.kv([['Class', clsWord(k)], ['Tenant', k.tenant ? tenantName(k.tenant) : '—'], ['Scopes', k.scopes.join(', '), { mono: true }], ['Endpoint families', k.cls === 'tenant' ? (k.scopes.indexOf('act') >= 0 ? '/v1/writes, /v1/obligations, /v1/records, /v1/evidence, /v1/meter' : '/v1/records, /v1/evidence, /v1/meter') : k.cls === 'control' ? '/v1/declarations, /v1/actors, /v1/tenants' : 'status and metrics only', { mono: true }], ['Cannot reach', k.cls === 'control' ? 'Any record store' : k.cls === 'ops' ? 'Tenant data' : 'Another tenant; the declaration registry'], ['Exchange', 'Client credentials → tenant token, 5–15 min']], { compact: true }) });
      var usage = c.card({ title: 'Use, last 7 days', body: k.status === 'revoked' ? c.empty({ title: 'No use since revocation', why: 'The last accepted call was ' + fmt.dateTime(k.last) + '.', compact: true }) : c.stat({ label: 'Token exchanges', value: fmt.num(k.env === 'production' ? 1284 : 96), spark: k.env === 'production' ? [140, 162, 171, 158, 190, 212, 251] : [8, 12, 20, 14, 9, 18, 15], note: 'Last used ' + (k.last ? when(k.last) : 'never') + ' · from ap-south-1 (Mumbai)' }) });
      var hist = c.timeline([
        k.status === 'revoked' ? { time: fmt.dateTime(k.revokedAt || new Date(NOW).toISOString()), title: 'Revoked', body: k.note || '', state: 'neutral', href: k.revokedSeq ? '#/assurance/proof/' + k.revokedSeq : null } : null,
        k.last ? { time: fmt.dateTime(k.last), title: 'Last used', state: 'info' } : null,
        { time: fmt.date(ist(k.created)), title: prod ? 'Issued by elan1' + (k.issuedSeq ? ' · proof #' + fmt.num(k.issuedSeq) : '') : 'Created · shown once', body: prod ? 'After the production review. Shown once to the named production owner.' : 'Self-serve sandbox key.', state: 'good', href: k.issuedSeq ? '#/assurance/proof/' + k.issuedSeq : null }
      ].filter(Boolean));
      return header + '<div class="e1-split e1-split--wide"><div class="e1-stack e1-stack--lg">' + windowCard + usage + c.section({ id: 'history', title: 'History', body: hist }) + '</div><aside class="e1-stack">' + reach + (prod ? c.callout({ kind: 'rule', title: 'Production keys are issued by us, never self-serve in Phase 1.', body: '<p>Rotation is a request to elan1 (platform.key.rotate, dual control).</p>' }) : '') + '</aside></div>';
    }
  });

  reg('/agents/keys/:id/rotate', {
    title: 'Rotate key', section: 'keys', example: '/agents/keys/key-sbx-03/rotate', crumbs: crumbs([['Keys', '#/agents/keys']]), keywords: 'rotation overlap',
    render: function (p, q) {
      var k = keyOf(p.id);
      if (!k) return notFound('Key', p.id, ['Open keys', '#/agents/keys']);
      var prod = k.env === 'production' || k.cls !== 'tenant';
      var back = ['Key ' + k.prefix, '#/agents/keys/' + k.id];
      if (k.status === 'revoked') return c.pageHeader({ title: 'Rotate ' + k.prefix, back: back }) + c.empty({ title: 'This key is revoked, so there is nothing to rotate', why: k.note || 'It no longer works.', action: { label: 'Open keys', href: '#/agents/keys' }, icon: 'key' });
      var step = Math.max(1, Math.min(4, Number(q.step) || 1));
      if (prod) {
        var steps = ['Request', 'elan1 review · two people', 'New key issued · shown once', 'Overlap 24 h', 'Old key revoked'];
        var cur = q.state === 'requested' || k.status === 'requested' ? 1 : 0;
        var header = c.pageHeader({ eyebrow: 'Governed write · platform.key.rotate · dual control', title: 'Request rotation from elan1', lead: 'You cannot rotate a production key yourself in Phase 1. Ask us; two people at elan1 review it, and the new key is shown once to your production owner.', back: back, actions: stateMenu('/agents/keys/' + k.id + '/rotate', q, [['requested', 'Requested']]) });
        var body = cur === 1 ? c.callout({ kind: 'good', title: 'Rotation requested for ' + k.prefix + '.', body: '<p>We review within two working days. Your key keeps working until the new one has been in use for 24 hours. We will write to Meenakshi Iyer (production owner) when the new key is ready.</p>' }) + '<div class="ag-inline" style="margin-top:var(--space-4)">' + c.button('Back to the key', { href: '#/agents/keys/' + k.id }) + c.button('All keys', { href: '#/agents/keys' }) + '</div>' :
          c.card({ body: '<form class="e1-stack" data-ag-rotreq>' + c.kv([['Key', k.prefix, { mono: true }], ['Bound to', (k.actor ? agent(k.actor).name : personName(k.actorPerson) || k.actorText) + (k.level ? ' · ' + k.level : '')], ['Rotate by', k.rotateBy ? fmt.date(ist(k.rotateBy)) + ' · ' + fmt.plural(daysLeft(k.rotateBy), 'day') + ' left' : '—']], { compact: true }) +
            c.field('Why now', c.select({ id: 'ag-rr-why', options: [{ value: 'window', label: 'Scheduled — the rotation window is due' }, { value: 'staff', label: 'Someone who handled the key has left' }, { value: 'exposure', label: 'Suspected exposure' }, { value: 'other', label: 'Other' }] }), { id: 'ag-rr-why' }) +
            c.field('Note for elan1', c.textarea({ id: 'ag-rr-note', rows: 3, placeholder: 'Optional' }), { id: 'ag-rr-note', optional: true }) +
            c.callout({ kind: 'info', title: 'Suspect the key is exposed?', body: '<p>Revoke it now — one press — and request a new one. If more than one key may be exposed, <a href="#/work/stop">request a stop</a> instead.</p>' }) +
            '<div class="ag-inline">' + c.button('Request rotation from elan1', { kind: 'primary', type: 'submit', icon: 'send' }) + c.button('Revoke instead', { kind: 'danger', href: '#/agents/keys/' + k.id + '/revoke' }) + '</div></form>' });
        return header + c.stepper(steps, cur) + '<div style="margin-top:var(--space-5)">' + body + '</div>';
      }
      var o = ov(), rs = o.keys[k.id + ':rot'] || {};
      var full = rs.full || ('sk_sbx_' + hex64(k.id + 'rot').slice(0, 32));
      var steps2 = ['Confirm', 'New key · shown once', 'Overlap · both keys work', 'Old key revoked'];
      var h2 = c.pageHeader({ eyebrow: 'Sandbox key · self-serve', title: 'Rotate ' + k.prefix, lead: 'Create a new key, move your traffic across while both work for 24 hours, then the old one is revoked.', back: back });
      var b;
      if (step === 1) b = c.card({ body: '<div class="e1-stack">' + c.kv([['Key', k.prefix, { mono: true }], ['Bound to', (k.actor ? agent(k.actor).name : personName(k.actorPerson)) + ' · ' + k.level], ['Scopes', k.scopes.join(', '), { mono: true }], ['Rotate by', fmt.date(ist(k.rotateBy)) + ' · ' + fmt.plural(daysLeft(k.rotateBy), 'day') + ' left']], { compact: true }) + '<p>The new key has the same binding, level and scopes. You will see it once.</p><div class="ag-inline">' + c.button('Create the new key', { kind: 'primary', attrs: 'data-ag-rot="2"' }) + c.button('Cancel', { kind: 'ghost', href: '#/agents/keys/' + k.id }) + '</div></div>' });
      else if (step === 2) b = c.card({ body: rs.shown ? c.empty({ title: 'The new key has already been shown once', why: 'We will not show it again.', fill: 'If you did not store it, rotate again; the unstored key will be revoked.', action: { label: 'Continue to the overlap', href: E1.href('/agents/keys/' + k.id + '/rotate', { step: 3 }) }, compact: true }) :
        '<div class="e1-stack"><div class="ag-reveal"><code>' + esc(full) + '</code>' + c.button('Copy', { size: 'sm', icon: 'copy', attrs: 'data-copy="' + esc(full) + '" data-copy-label="New sandbox key"' }) + '</div><p><strong>We will not show this again.</strong> Store it in your secret manager, then deploy it.</p>' + c.checkbox({ id: 'ag-stored', label: 'I have stored the new key' }) + '<div class="ag-inline">' + c.button('Continue', { kind: 'primary', attrs: 'data-ag-rot="3" id="ag-rot-go"', disabled: true }) + '</div></div>' });
      else if (step === 3) {
        var used = rs.used;
        b = c.card({ title: 'Both keys work until ' + fmt.dateTime(new Date(NOW + DAY)), body: c.table({ caption: 'Keys during the overlap', columns: [{ key: 'k', label: 'Key', mono: true }, { key: 's', label: 'Status', html: true }, { key: 'l', label: 'Last used' }], rows: [{ k: k.prefix, s: c.badge('info', 'Old · revoked at the end of the overlap', { subtle: true }), l: when(k.last) }, { k: 'sk_sbx_…' + full.slice(-4), s: c.badge('good', 'New · active', { subtle: true }), l: used ? 'Today, ' + fmt.time(new Date(NOW + 120000)) : 'Not used yet' }] }) +
          '<p class="e1-caption" style="margin-top:var(--space-3)">Watch the last-used times: when traffic has moved to the new key, revoke the old one now or let the overlap end.</p><div class="ag-inline" style="margin-top:var(--space-3)">' + c.button('Refresh last used', { icon: 'refresh', attrs: 'data-ag-rot="used"' }) + c.button('Revoke the old key now', { kind: 'primary', attrs: 'data-ag-rot="4"' }) + '</div>' });
      } else b = c.callout({ kind: 'good', title: 'Rotated. ' + k.prefix + ' is revoked.', body: '<p>The new key sk_sbx_…' + esc(full.slice(-4)) + ' is active until ' + fmt.date(new Date(NOW + 90 * DAY)) + '. The revocation is <a href="#/assurance/proof/' + (rs.seq || 4113) + '">proof #' + fmt.num(rs.seq || 4113) + '</a> (mode: sandbox).</p>' }) + '<div class="ag-inline" style="margin-top:var(--space-4)">' + c.button('All keys', { href: '#/agents/keys', kind: 'primary' }) + '</div>';
      return h2 + c.stepper(steps2, step - 1 + (step === 4 ? 1 : 0)) + '<div style="margin-top:var(--space-5)">' + b + '</div>';
    },
    mount: function (el, p) {
      var k = keyOf(p.id); if (!k) return;
      var chk = el.querySelector('#ag-stored'), go = el.querySelector('#ag-rot-go');
      if (chk && go) chk.addEventListener('change', function () { go.disabled = !chk.checked; });
      el.addEventListener('click', function (e) {
        var b = e.target.closest('[data-ag-rot]'); if (!b || b.disabled) return;
        var v = b.getAttribute('data-ag-rot'), o = ov(), key = k.id + ':rot'; o.keys[key] = o.keys[key] || {};
        if (v === '2') { o.keys[key] = { full: 'sk_sbx_' + hex64(k.id + 'rot' + Date.now()).slice(0, 32) }; saveOv(o); E1.go('/agents/keys/' + k.id + '/rotate', { step: 2 }); }
        else if (v === '3') { o.keys[key].shown = true; saveOv(o); E1.go('/agents/keys/' + k.id + '/rotate', { step: 3 }); }
        else if (v === 'used') { o.keys[key].used = true; saveOv(o); E1.render({ keepScroll: true }); E1.toast('Traffic has reached the new key.', 'good'); }
        else if (v === '4') { var s = nextSeq(); o.keys[key].seq = s; o.keys[k.id] = { status: 'revoked', revokedAt: new Date(NOW + 180000).toISOString(), revokedSeq: s, note: 'Revoked (rotated today)' }; saveOv(o); E1.go('/agents/keys/' + k.id + '/rotate', { step: 4 }); }
      });
      var f = el.querySelector('[data-ag-rotreq]');
      if (f) f.addEventListener('submit', function (e) { e.preventDefault(); var o = ov(); o.keys[k.id] = { status: 'requested' }; saveOv(o); E1.toast('Rotation requested. elan1 reviews within two working days.', 'info', { title: 'Requested' }); E1.go('/agents/keys/' + k.id + '/rotate', { state: 'requested' }); });
    }
  });

  reg('/agents/keys/:id/revoke', {
    title: 'Revoke key', section: 'keys', example: '/agents/keys/key-prod-01/revoke', crumbs: crumbs([['Keys', '#/agents/keys']]), keywords: 'revoke compromise',
    render: function (p, q) {
      var k = keyOf(p.id);
      if (!k) return notFound('Key', p.id, ['Open keys', '#/agents/keys']);
      var header = c.pageHeader({ eyebrow: 'Governed write · platform.key.revoke', title: 'Revoke ' + k.prefix, lead: 'Revoking takes access away, so one person can do it now, and no approval is needed. It cannot be undone; you would request a new key.', back: ['Key ' + k.prefix, '#/agents/keys/' + k.id], actions: stateMenu('/agents/keys/' + k.id + '/revoke', q, [['done', 'Revoked']]) });
      if (k.status === 'revoked' || q.state === 'done') {
        return header + c.callout({ kind: 'good', title: k.prefix + ' is revoked.', body: '<p>Calls with it are now rejected (401) before they reach the kernel, so they leave no proof entry. The revocation itself is <a href="#/assurance/proof/' + (k.revokedSeq || 4113) + '">proof #' + fmt.num(k.revokedSeq || 4113) + '</a>.</p>' }) + '<div class="ag-inline" style="margin-top:var(--space-4)">' + (k.env === 'production' ? c.button('Request a new production key', { kind: 'primary', href: '#/developers/production-request' }) : c.button('Create a sandbox key', { kind: 'primary', href: '#/agents/keys' })) + c.button('All keys', { href: '#/agents/keys' }) + '</div>';
      }
      var who = k.actor ? agent(k.actor).name : k.actorPerson ? personName(k.actorPerson) : (k.actorText || 'operations');
      return header + '<div class="e1-split e1-split--wide"><div>' + c.card({ body: '<form class="e1-stack" data-ag-revoke novalidate>' +
        c.field('Cause', c.select({ id: 'ag-rv-cause', options: [{ value: '', label: 'Choose a cause' }, { value: 'exposure', label: 'Suspected credential exposure' }, { value: 'unused', label: 'No longer used' }, { value: 'staff', label: 'Someone who handled it has left' }, { value: 'rotation', label: 'Left over from a rotation' }] }), { id: 'ag-rv-cause', required: true, help: 'Recorded on the proof. The cause class is the only required field.' }) +
        c.field('Note', c.textarea({ id: 'ag-rv-note', rows: 3 }), { id: 'ag-rv-note', optional: true }) +
        '<div class="ag-inline">' + c.button('Revoke this key', { kind: 'danger', type: 'submit', icon: 'stop' }) + c.button('Cancel', { kind: 'ghost', href: '#/agents/keys/' + k.id }) + '</div></form>' }) + '</div>' +
        '<aside class="e1-stack">' + c.card({ title: 'What happens', body: '<ol class="ag-steps"><li>From the next call, ' + esc(who) + ' is rejected at the boundary with this key.</li><li>' + (k.actor ? 'Its open obligations stay open for a person to decide.' : 'Nothing already recorded changes.') + '</li><li>The revocation is its own proof entry.</li></ol>' }) +
        c.callout({ kind: 'warning', title: 'More than one key exposed?', body: '<p>Stop the tenant instead. The stop halts every write, including refusals, and needs two people. <a href="#/work/stop">Request a stop</a>.</p>' }) + '</aside></div>';
    },
    mount: function (el, p) {
      var f = el.querySelector('[data-ag-revoke]'); if (!f) return;
      f.addEventListener('submit', function (e) {
        e.preventDefault(); var cause = f.querySelector('#ag-rv-cause');
        if (!cause.value) { cause.setAttribute('aria-invalid', 'true'); cause.focus(); E1.toast('Choose a cause. It is recorded on the proof.', 'warning'); return; }
        var o = ov(), s = nextSeq(); o.keys[p.id] = { status: 'revoked', revokedAt: new Date(NOW + 60000).toISOString(), revokedSeq: s, note: 'Revoked today · ' + cause.options[cause.selectedIndex].text }; saveOv(o);
        E1.toast('Key revoked. Proof #' + fmt.num(s) + '.', 'info', { title: 'Revoked' }); E1.go('/agents/keys/' + p.id + '/revoke', { state: 'done' });
      });
    }
  });

  /* ========================================================================
     CHANNELS
     ======================================================================== */
  function chCell(code, extra) { var w = CH_WORDS[code || '']; return '<span class="ag-ch' + (code ? '' : ' ag-ch--none') + '">' + (code ? c.icon(w[1], 12) : '') + '<span' + (code ? '' : ' aria-hidden="true"') + '>' + esc(code ? w[0] : '—') + '</span>' + (code ? '' : '<span class="e1-sr">' + esc(w[0]) + '</span>') + '</span>' + (extra || ''); }
  reg('/agents/channels', {
    title: 'Channels', section: 'channels', wide: true, crumbs: crumbs(), keywords: 'whatsapp voice mobile email api mcp web',
    render: function () {
      var wts = WT.filter(function (w) { return w.tenant === 'kaveri-spinning' || w.tenant === '*'; });
      var header = c.pageHeader({ tabs: accessTabs('channels'), eyebrow: 'Agents · access', title: 'Channels', lead: 'The routes by which a write or an approval can reach elan1, and what each may do per write type. “A channel adapts; it never decides.”', actions: c.button('Channel block in the declaration', { href: '#/records/declarations/erp.ar', icon: 'file-text' }) });
      var cards = '<div class="e1-grid e1-grid--auto">' + CHANNELS.map(function (ch) {
        return '<a class="e1-linkcard" href="#/agents/channels/' + ch.id + '" style="text-decoration:none"><span class="e1-row">' + c.icon(ch.icon, 16) + '<strong>' + esc(ch.name) + '</strong></span><span class="e1-caption e1-muted">kind: ' + esc(ch.kind) + '</span><span class="e1-caption">' + esc(ch.role.replace(/[“”]/g, '')) + '</span><span class="e1-caption">May approve: ' + esc(ch.mayApprove) + '</span><span class="e1-caption e1-muted">' + esc(ch.mode) + '</span></a>';
      }).join('') + '</div>';
      var ids = CHANNELS.map(function (x) { return x.id; });
      var thead = '<thead><tr><th scope="col">Write type</th>' + CHANNELS.map(function (ch) { return '<th scope="col"><a href="#/agents/channels/' + ch.id + '">' + esc(ch.name.replace(/ \(.*\)$/, '')) + '</a></th>'; }).join('') + '</tr></thead>';
      var tbody = '<tbody>' + wts.map(function (w) { return '<tr><th scope="row"><a href="#/records/write-types/' + esc(wtName(w)) + '">' + esc(w.label) + '</a><span class="ag-sub">' + esc(wtName(w)) + '</span></th>' + ids.map(function (id) { return '<td>' + chCell(w.ch[id], id === 'api' && w.apiNote ? '<sup class="e1-caption">1</sup>' : '') + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody>';
      return header + '<div class="e1-grid e1-grid--2">' + c.callout({ kind: 'rule', title: 'A blank cell is not a permission question.', body: '<p>“A blank cell means the action simply cannot be attempted from that route. It is not a permission question.” A write from an undeclared channel is refused with POLICY.CHANNEL_NOT_PERMITTED.</p>' }) + ruleNever() + '</div>' +
        c.section({ id: 'kinds', title: 'Channels', lead: 'Six kinds are declarable in block 7; e-mail is notification-only. Agent and Connector are internal routes.', body: cards }) +
        c.section({ id: 'matrix', title: 'What each channel may do, per write type', lead: 'Kaveri Spinning Mills · from the channels block of each declaration in force.', body: '<div class="ag-matrix-wrap"><table class="ag-matrix"><caption class="e1-sr">Channel permissions per write type</caption>' + thead + tbody + '</table></div>' +
          '<div class="ag-legend">' + Object.keys(CH_WORDS).map(function (k) { return '<span>' + chCell(k) + (k ? '' : ' Cannot be attempted from that route') + '</span>'; }).join('') + '</div><p class="ag-tablenote"><sup>1</sup> Cancel invoice is never declared for the API: “a compromised API key should never be able to wipe out invoices”.</p>' });
    }
  });

  reg('/agents/channels/:id', {
    title: function (p) { var ch = CHANNELS.filter(function (x) { return x.id === p.id; })[0]; return ch ? ch.name : 'Channel'; }, section: 'channels', example: '/agents/channels/whatsapp',
    crumbs: crumbs([['Channels', '#/agents/channels']]), keywords: 'channel detail',
    render: function (p) {
      var ch = CHANNELS.filter(function (x) { return x.id === p.id; })[0];
      if (!ch) return notFound('Channel', p.id, ['Open channels', '#/agents/channels']);
      var wts = WT.filter(function (w) { return w.tenant === 'kaveri-spinning' || w.tenant === '*'; });
      var can = wts.filter(function (w) { return w.ch[ch.id]; }), cannot = wts.filter(function (w) { return !w.ch[ch.id]; });
      var header = c.pageHeader({ eyebrow: 'Channel · kind ' + ch.kind, title: ch.name, lead: ch.role.replace(/[“”]/g, '') + '. ' + (ch.id === 'mcp' ? 'An MCP agent can never resolve an obligation.' : ''), back: ['Channels', '#/agents/channels'], actions: c.button(ch.preview[0], { href: ch.preview[1], icon: 'eye', kind: 'primary' }), meta: '<span class="ag-tag">' + esc(ch.mode) + '</span><span>May approve: ' + esc(ch.mayApprove) + '</span>' });
      var modes = ch.id === 'mcp' ? c.table({ caption: 'Mode per tenant', columns: [{ key: 't', label: 'Tenant' }, { key: 'm', label: 'Mode', html: true }, { key: 's', label: 'The sentence we may say' }], rows: [
        { t: 'Kaveri Spinning Mills', m: modeTag('enforced') + ' <span class="e1-caption">credential custody</span>', s: 'elan1 holds the only credential that can write to ERPNext for these write types, so a write that does not pass the gates is not made.' },
        { t: 'LedgerLoop Software (sandbox tenant)', m: modeTag('advisory'), s: 'LedgerLoop’s agent reports each write to elan1, which checks and records it. elan1 does not hold the credential, so a write that is never reported is not seen.' }
      ] }) : c.kv([['Mode', ch.mode], ['Mechanism', 'credential custody'], ['The sentence we may say', 'elan1 holds the credential; a write from this channel that does not pass every gate is not made.']], { compact: true });
      return header + '<div class="e1-split e1-split--wide"><div class="e1-stack e1-stack--lg">' +
        c.section({ id: 'rule', title: 'The rule for this channel', body: '<div class="e1-prose"><p>' + esc(ch.rule) + '</p>' + (ch.quote ? '<blockquote>“' + esc(ch.quote) + '”</blockquote>' : '') + '</div>' }) +
        c.section({ id: 'may', title: 'What it may do', lead: fmt.plural(can.length, 'write type') + ' declared for this channel.', body: c.table({ caption: 'Write types on this channel', columns: [{ key: 'w', label: 'Write type', render: function (w) { return wtCell(w.name); } }, { key: 'c', label: 'May', render: function (w) { return chCell(w.ch[ch.id]); } }, { key: 'b', label: 'Blast radius', render: function (w) { return c.blast(w.blast, { compact: true }); } }, { key: 'r', label: 'Reversibility', render: function (w) { return w.rev === null ? '—' : c.reversible(w.rev); } }], rows: can, empty: { title: 'No write type is declared for this channel', why: 'Everything is attempted elsewhere.', compact: true } }) }) +
        c.section({ id: 'cannot', title: 'Cannot be attempted here', lead: 'Not a permission question: the route does not carry these.', body: cannot.length ? '<p class="ag-inline">' + cannot.map(function (w) { return '<span class="ag-tag">' + esc(w.label) + '</span>'; }).join('') + '</p>' : '<p class="e1-caption e1-muted">Every write type in this tenant is carried.</p>' }) +
        '</div><aside class="e1-stack">' + c.card({ title: 'Enforcement mode', body: modes }) + (ch.id === 'mcp' || ch.id === 'api' ? c.card({ title: 'Agents on this channel', body: '<ul class="e1-stack e1-stack--sm" style="list-style:none;padding:0;margin:0">' + AGENTS.filter(function (a) { return a.channel.toLowerCase() === ch.id; }).map(function (a) { return '<li>' + c.actor({ name: a.name, kind: 'agent', role: tenantName(a.tenant).replace(/ Pvt Ltd$/, ''), href: '#/agents/agent/' + a.id, size: 'sm' }) + '</li>'; }).join('') + '</ul>' }) : '') + ruleNever() + '</aside></div>';
    }
  });

  /* ========================================================================
     TOOLS
     ======================================================================== */
  reg('/agents/tools', {
    title: 'Tools', section: 'tools', wide: true, crumbs: crumbs(), keywords: 'mcp tools allow-list hash pinned',
    render: function () {
      var list = AGENTS.filter(function (a) { return a.stage !== 'registered' || a.tenant === E1.state.tenant; });
      var header = c.pageHeader({ tabs: sibTabs('tools'), eyebrow: 'Agents · integrations', title: 'Tools', lead: 'The MCP and SDK tools each agent may call, with the description it was shown pinned by hash. A changed description is a new declaration version, never a silent update.', actions: c.button('MCP reference', { href: '#/developers/mcp', icon: 'book' }) });
      var catalogue = c.table({ caption: 'Tools', columns: [
        { key: 'id', label: 'Tool', render: function (t) { return '<span class="e1-mono">' + esc(t.id) + '</span>'; } },
        { key: 'sc', label: 'Scope', render: function (t) { return '<span class="ag-tag">' + esc(t.scope) + '</span>'; } },
        { key: 'a', label: 'Arguments', render: function (t) { return '<span class="e1-mono e1-caption">' + esc(t.args) + '</span>'; } },
        { key: 'r', label: 'Returns', render: function (t) { return '<span class="e1-caption">' + esc(t.returns) + '</span>'; } },
        { key: 'd', label: 'Description shown to agents', render: function (t) { return '<span class="ag-desc">' + esc(t.desc) + '</span>'; } },
        { key: 'h', label: 'description_sha256', render: function (t) { return c.hash(pinHash(t.head, t.tail, t.id), { head: 4, tail: 4, label: 'description_sha256' }) + (t.prev ? '<div>' + c.badge('info', 'Changed in erp.ar v7', { subtle: true, icon: 'git-branch' }) + '</div>' : ''); } },
        { key: 'n', label: 'Agents allowed', align: 'right', render: function (t) { return '<span class="ag-num">' + list.filter(function (a) { return a.tools.indexOf(t.id) >= 0; }).length + '</span>'; } }
      ], rows: TOOLS });
      var thead = '<thead><tr><th scope="col">Agent</th>' + TOOLS.map(function (t) { return '<th scope="col"><span class="e1-mono">' + esc(t.id) + '</span><span class="ag-sub">' + esc(t.scope) + '</span></th>'; }).join('') + '</tr></thead>';
      var tbody = '<tbody>' + list.map(function (a) { return '<tr><th scope="row"><a href="#/agents/agent/' + a.id + '">' + esc(a.name) + '</a><span class="ag-sub" style="font-family:var(--font-ui)">' + esc(a.channel + ' · ' + tenantName(a.tenant).replace(/ (Pvt Ltd|LLP)$/, '').replace(/ Software$/, '')) + '</span></th>' + TOOLS.map(function (t) {
        var on = a.tools.indexOf(t.id) >= 0;
        var note = on && t.id === 'act.escalate' ? '<span class="ag-sub" style="font-family:var(--font-ui)">every call refused</span>' : '';
        return '<td>' + (on ? '<span class="ag-ch">' + c.icon('check', 12) + '<span>Allowed</span></span>' + note : '<span class="ag-ch ag-ch--none">' + c.icon('minus', 12) + '<span>Not in list</span></span>') + '</td>';
      }).join('') + '</tr>'; }).join('') + '</tbody>';
      return header + c.callout({ kind: 'info', title: '34 tools in Phase 1: 18 ro · 10 stage · 6 act.', body: '<p>The seven named in the technical memorandum are listed here; the full catalogue is in the <a href="#/developers/mcp">MCP reference</a>. Every tool in <code>tools/list</code> carries <code>_meta</code>: <code>elan1/declaration</code>, <code>elan1/description_sha256</code> and <code>elan1/scope</code>.</p>' }) +
        c.section({ id: 'catalogue', title: 'Catalogue', body: catalogue }) +
        c.section({ id: 'allow', title: 'Allow-lists', lead: 'Which agent may call which tool. Allowing a tool does not grant autonomy: act.write still climbs every rung.', body: '<div class="ag-matrix-wrap"><table class="ag-matrix"><caption class="e1-sr">Tool allow-list per agent</caption>' + thead + tbody + '</table></div>' +
          '<p class="ag-tablenote">act.escalate is in LedgerLoop’s list because its MCP client requests it, but every call from an agent token is refused: agents never resolve obligations. Refusals return <code>isError: false</code>, because an error “invites the agent’s framework to retry”.</p>' });
    }
  });

  /* ========================================================================
     WEBHOOKS
     ======================================================================== */
  reg('/agents/webhooks', {
    title: 'Webhooks', section: 'webhooks', wide: true, crumbs: crumbs(), keywords: 'events deliveries endpoints signature seq gap',
    render: function (p, q) {
      var path = '/agents/webhooks', tab = q.tab || 'endpoints', o = ov();
      var hooks = WEBHOOKS.concat(Object.keys(o.wh).map(function (id) { return o.wh[id]; }));
      var header = c.pageHeader({ tabs: sibTabs('webhooks'), eyebrow: 'Agents · integrations', title: 'Webhooks', lead: 'Where elan1 tells your systems what happened: every write, refusal and escalation, each signed and carrying its seq so a gap is detectable.', actions: stateMenu(path, q, [['empty', 'Empty'], ['error', 'Error']]) + c.button('Webhook reference', { href: '#/developers/webhooks', icon: 'book' }) + c.button('Add endpoint', { kind: 'primary', icon: 'plus', attrs: 'data-ag-addwh' }) });
      var v = variant(q, { empty: { title: 'No webhook endpoint is registered', why: 'Your systems learn about writes only by polling (every 10 seconds or slower).', fill: 'Add an HTTPS endpoint and subscribe to the seven events; verify the signature and prove seq-gap detection before production.', action: { label: 'Add endpoint', href: '#/developers/webhooks' }, icon: 'send' }, error: { title: 'We cannot list your endpoints right now.', body: 'The delivery service did not answer.', reassurance: 'Deliveries continue while this page is unavailable. Failed ones retry with backoff.', code: 'PLATFORM.REGISTRY_UNAVAILABLE', action: { label: 'Try again', href: E1.href(path) } } });
      if (v) return header + v;
      var tabs = tabsAsFilters([{ id: 'endpoints', label: 'Endpoints', href: E1.href(path), count: hooks.length }, { id: 'deliveries', label: 'Deliveries', href: E1.href(path, { tab: 'deliveries' }), count: DELIVERIES.length }], tab, 'View');
      var body;
      if (tab === 'deliveries') {
        var rows = DELIVERIES.filter(function (d) { return !q.endpoint || d.wh === q.endpoint; });
        body = c.filters(WEBHOOKS.map(function (w) { var qq = Object.assign({}, q, { endpoint: w.id }); if (q.endpoint === w.id) delete qq.endpoint; return { label: w.url.replace(/^https:\/\//, '').split('/')[0], href: E1.href(path, qq), active: q.endpoint === w.id }; }), { label: 'Endpoint', clearHref: q.endpoint ? E1.href(path, { tab: 'deliveries' }) : null }) + '<div style="margin-top:var(--space-3)">' +
          c.table({ caption: 'Recent deliveries', columns: [
            { key: 'id', label: 'Event', render: function (d) { return '<span class="e1-mono e1-caption">' + esc(d.id) + '</span>'; } },
            { key: 't', label: 'Type', render: function (d) { return '<span class="e1-mono">' + esc(d.type) + '</span>'; } },
            { key: 's', label: 'Seq', render: function (d) { return '<a class="ag-num" href="#/assurance/proof/' + d.seq + '">#' + fmt.num(d.seq) + '</a>'; } },
            { key: 'e', label: 'Endpoint', render: function (d) { return '<span class="e1-caption">' + esc(WEBHOOKS.filter(function (w) { return w.id === d.wh; })[0].url.replace(/^https:\/\//, '')) + '</span>'; } },
            { key: 'c', label: 'Response', render: function (d) { return d.code === 200 ? c.badge('good', '200 OK', { subtle: true }) : c.badge('critical', d.code + ' · attempt ' + d.attempt + ' of 5', { subtle: true }); } },
            { key: 'at', label: 'When', render: function (d) { return '<span class="e1-caption">' + esc(fmt.time(d.at)) + '</span>'; } },
            { key: 'x', label: '', render: function (d) { return d.code !== 200 ? c.button('Redeliver', { size: 'sm', attrs: 'data-ag-redeliver="' + esc(d.id) + '"' }) : ''; } }
          ], rows: rows, empty: { title: 'No deliveries to this endpoint today', why: 'It is subscribed to events that have not happened yet.', compact: true } }) + '</div>';
      } else {
        body = '<div class="e1-stack">' + hooks.map(function (w) {
          var st = w.status === 'failing' ? c.badge('critical', 'Failing · 503', { icon: 'alert' }) : w.status === 'committed-only' ? c.badge('warning', 'Committed only') : w.status === 'new' ? c.badge('info', 'New · not delivered yet') : c.badge('good', 'Delivering');
          var gap = w.gap === 'none' ? '<span class="e1-caption">No seq gap · last seq delivered <a href="#/assurance/proof/' + w.seq + '">#' + fmt.num(w.seq) + '</a></span>' : w.gap === 'detected' ? c.badge('warning', 'Seq gap detected', { icon: 'alert' }) + ' <span class="e1-caption">' + esc(w.gapText) + '</span>' : w.gap === 'by-design' ? c.badge('neutral', 'Gaps by design') + ' <span class="e1-caption">Receives write.committed only, so refusals and escalations appear as gaps.</span>' : '<span class="e1-caption e1-muted">Nothing delivered yet</span>';
          return c.card({ cls: 'ag-wh', eyebrow: w.id, title: w.url, actions: st, body:
            '<div class="ag-inline" style="margin-bottom:var(--space-3)">' + w.events.map(function (e) { return '<span class="ag-tag e1-mono">' + esc(e) + '</span>'; }).join('') + '</div>' +
            c.kv([['Last delivery', w.last ? fmt.dateTime(w.last) + ' · ' + w.code + (w.code === 200 ? ' · ' + w.ms + ' ms' : ' · timed out after 30 s') : '—'], ['Seq continuity', gap, { html: true }], ['Signing secret', 'Rotated ' + fmt.date(ist(w.secret)) + ' · HMAC over the body · X-Elan1-Signature, X-Elan1-Timestamp · 5-minute window']], { cols: 1, compact: true }) +
            (w.status === 'committed-only' ? '<div style="margin-top:var(--space-3)">' + c.callout({ kind: 'caveat', title: '“A consumer that only handles the committed case will silently lose writes.”', body: '<p>Subscribe it to write.refused and write.escalated too, or treat every gap as a write it did not see.</p>' }) + '</div>' : ''),
            footer: '<div class="ag-inline">' + c.button('Deliveries', { size: 'sm', href: E1.href(path, { tab: 'deliveries', endpoint: w.id }) }) + c.button('Send test event', { size: 'sm', attrs: 'data-ag-test="' + esc(w.id) + '"' }) + c.button('Rotate secret', { size: 'sm', kind: 'ghost', attrs: 'data-ag-whrot="' + esc(w.id) + '"' }) + '</div>' });
        }).join('') + '</div>';
      }
      var evs = c.card({ title: 'The seven events', body: '<ul class="e1-stack e1-stack--sm" style="list-style:none;padding:0;margin:0">' + ['write.committed', 'write.refused', 'write.escalated', 'obligation.resolved', 'obligation.expired', 'declaration.certified', 'tenant.stopped'].map(function (e) { return '<li class="e1-mono e1-caption">' + esc(e) + '</li>'; }).join('') + '</ul><p class="e1-caption" style="margin-top:var(--space-3)">Delivery is at least once, so consumers are idempotent on write_id. Every write payload carries seq and digest.</p>' });
      return header + '<div class="e1-split e1-split--wide"><div>' + tabs + '<div style="margin-top:var(--space-4)">' + body + '</div></div><aside class="e1-stack">' + evs + c.card({ title: 'Payload', body: c.code('{\n  "type": "write.escalated",\n  "id": "evt_01J8Z4…b9",\n  "tenant_id": "kaveri-spinning",\n  "created_at": "2026-09-24T09:57:00Z",\n  "data": {\n    "write_id": "e2a9…",\n    "obligation_id": "OB-2026-0411",\n    "autonomy_level": "A2",\n    "seq": 4111,\n    "digest": "f04b…2d96"\n  }\n}', 'json') + '<p class="e1-caption e1-muted" style="margin-top:var(--space-2)">Illustrative envelope (build recommendation).</p>' }) + '</aside></div>';
    }
  });
  E1.on('click', '[data-ag-test]', function (e, el) { E1.toast('Test event sent to ' + el.getAttribute('data-ag-test') + '. It is marked test and carries no seq.', 'info', { title: 'Sent' }); });
  E1.on('click', '[data-ag-redeliver]', function () { E1.toast('Queued for redelivery with the same event id, so your consumer can de-duplicate on write_id.', 'info', { title: 'Redelivery queued' }); });
  E1.on('click', '[data-ag-whrot]', function (e, el) {
    var id = el.getAttribute('data-ag-whrot'), secret = 'whsec_' + hex64(id + Date.now()).slice(0, 32);
    E1.confirm({ title: 'Rotate the signing secret for ' + id + '?', confirmLabel: 'Rotate secret', body: '<p>We sign with the new secret from now on. The old secret stays valid for verification for 24 hours so your consumer can switch.</p>', onConfirm: function () { setTimeout(function () { E1.modal({ title: 'New signing secret', eyebrow: 'Shown once', body: '<div class="ag-reveal"><code>' + esc(secret) + '</code>' + c.button('Copy', { size: 'sm', icon: 'copy', attrs: 'data-copy="' + esc(secret) + '" data-copy-label="Signing secret"' }) + '</div><p style="margin-top:var(--space-3)"><strong>We will not show this again.</strong></p>', actions: [{ label: 'Done', kind: 'primary' }] }); }, 60); } });
  });
  E1.on('click', '[data-ag-addwh]', function () {
    var evs = ['write.committed', 'write.refused', 'write.escalated', 'obligation.resolved', 'obligation.expired', 'declaration.certified', 'tenant.stopped'];
    E1.modal({ title: 'Add a webhook endpoint', size: 'md', body: '<div class="e1-stack">' + c.field('Endpoint URL', c.input({ id: 'ag-wh-url', placeholder: 'https://', mono: true }), { id: 'ag-wh-url', required: true, help: 'HTTPS only.' }) +
      '<fieldset class="ag-fieldset"><legend>Events</legend>' + evs.map(function (e, i) { return c.checkbox({ id: 'ag-wh-e' + i, label: e, checked: i < 3 }); }).join('') + '</fieldset>' +
      c.callout({ kind: 'caveat', title: 'Subscribe to refusals and escalations too.', body: '<p>A consumer that only handles the committed case will silently lose writes.</p>' }) + '</div>',
      actions: [{ label: 'Cancel', kind: 'ghost' }, { label: 'Add endpoint', kind: 'primary', onClick: function (ev, close, m) {
        var u = m.querySelector('#ag-wh-url'), msg = m.querySelector('#ag-wh-url-msg');
        if (!/^https:\/\/[^\s/]+\.[^\s]+/.test(u.value.trim())) { u.setAttribute('aria-invalid', 'true'); if (msg) { msg.textContent = 'Enter a full https:// address.'; msg.classList.add('is-error'); } u.focus(); return false; }
        var chosen = evs.filter(function (e, i) { return m.querySelector('#ag-wh-e' + i).checked; });
        var o = ov(), id = 'wh-0' + (5 + Object.keys(o.wh).length); o.wh[id] = { id: id, url: u.value.trim(), events: chosen.length ? chosen : ['write.committed'], status: 'new', secret: '2026-09-24', last: null, gap: 'new' }; saveOv(o);
        E1.toast('Endpoint ' + id + ' added. Its signing secret is shown in the next step once.', 'good', { title: 'Added' }); E1.render();
      } }] });
  });

  /* ========================================================================
     PEOPLE
     ======================================================================== */
  function humans() { return (E1.data.people || []).filter(function (p) { return p.kind === 'person'; }); }
  function approvesText(id) { var x = PEOPLE_X[id] || {}; if (x.approvesNote) return x.approvesNote; return (x.approves || []).length ? fmt.plural(x.approves.length, 'write type') : 'Nothing'; }
  reg('/agents/people', {
    title: 'People', section: 'people', wide: true, crumbs: crumbs(), keywords: 'humans approvers resolver sets',
    render: function (p, q) {
      var path = '/agents/people', list = humans();
      var header = c.pageHeader({ tabs: sibTabs('people'), eyebrow: 'Agents · people', title: 'People', lead: 'The humans who submit, approve and certify in ' + tenantName(E1.state.tenant) + ': their roles and the resolver sets they decide in. People only — an agent is never listed here.', actions: stateMenu(path, q, [['empty', 'Empty']]) + c.button('Roles', { href: '#/agents/roles', icon: 'layers' }) + c.button('Invite a person', { kind: 'primary', icon: 'plus', attrs: 'data-ag-invite' }) });
      var v = variant(q, { empty: { title: 'Only you are here', why: 'Nobody else has been invited to this tenant, so nothing can be approved: dual control needs a second named person.', action: { label: 'Invite a person', href: '#/agents/roles' }, icon: 'users' } });
      if (v) return header + v;
      var sets = q.set;
      var rows = list.filter(function (x) { return !sets || ((PEOPLE_X[x.id] || {}).sets || []).indexOf(sets) >= 0; });
      var table = c.table({ caption: 'People', rowHref: function (x) { return '#/agents/people/' + x.id; }, columns: [
        { key: 'n', label: 'Person', render: function (x) { return c.actor({ name: x.name, kind: 'person', role: x.role.replace(/ \(.*\)$/, ''), size: 'sm' }); } },
        { key: 'r', label: 'Role', render: function (x) { var rid = (PEOPLE_X[x.id] || {}).roleId; var r = ROLES.filter(function (y) { return y.id === rid; })[0]; return esc(r ? r.label : x.role); } },
        { key: 's', label: 'Resolver sets', render: function (x) { var s = (PEOPLE_X[x.id] || {}).sets || []; return s.length ? '<span class="ag-inline">' + s.map(function (k) { return '<span class="ag-tag e1-mono">' + esc(k) + '</span>'; }).join('') + '</span>' : '<span class="e1-caption e1-muted">None</span>'; } },
        { key: 'a', label: 'May approve', render: function (x) { return x.mayApprove === true ? c.badge('good', 'Yes', { subtle: true }) + '<span class="ag-sub" style="font-family:var(--font-ui)">' + esc(approvesText(x.id)) + '</span>' : x.mayApprove === 'certify' ? c.badge('info', 'Certifies declarations', { subtle: true }) : x.id === 'priya-nair' ? c.badge('neutral', 'Stock only, by reply', { subtle: true }) : '<span class="e1-caption e1-muted">No</span>'; } },
        { key: 'sp', label: 'Owns agents', align: 'right', render: function (x) { return '<span class="ag-num">' + AGENTS.filter(function (a) { return a.owner === x.id; }).length + '</span>'; } },
        { key: 'l', label: 'Last active', render: function (x) { var d = (PEOPLE_X[x.id] || {}).last; return d ? '<span class="e1-caption">' + esc(when(d)) + '</span>' : '—'; } }
      ], rows: rows, empty: { title: 'Nobody is in this resolver set', why: 'Choose another set.', action: { label: 'Everyone', href: E1.href(path) }, compact: true } });
      var setCards = '<div class="e1-grid e1-grid--auto">' + Object.keys(SETS).map(function (k) { var members = humans().filter(function (x) { return ((PEOPLE_X[x.id] || {}).sets || []).indexOf(k) >= 0; }); return '<a class="e1-linkcard" href="' + esc(E1.href(path, { set: k })) + '" style="text-decoration:none"' + (sets === k ? ' aria-current="true"' : '') + '><strong class="e1-mono">' + esc(k) + '</strong><span class="e1-caption">' + esc(SETS[k].what) + '</span><span class="e1-caption e1-muted">' + esc(members.map(function (m) { return m.name; }).join(', ')) + '</span></a>'; }).join('') + '</div>';
      return header + c.callout({ kind: 'rule', title: 'Resolver sets contain humans only.', body: '<p>An agent can never approve, and is never in a resolver set. System jobs such as nightly-verifier are actors, not people: see <a href="#/records/actors">Records · Actors</a>.</p>' }) +
        c.section({ id: 'people', title: 'People', lead: sets ? 'In resolver set ' + sets + '.' : fmt.plural(list.length, 'person') + ', including two elan1 staff who author and certify declarations.', actions: sets ? c.button('Everyone', { size: 'sm', kind: 'ghost', href: E1.href(path) }) : '', body: table }) +
        c.section({ id: 'sets', title: 'Resolver sets', lead: 'Who may decide what. An obligation is sent to a set; any one of its people may resolve it, never the proposer.', body: setCards });
    }
  });
  E1.on('click', '[data-ag-invite]', function () {
    E1.modal({ title: 'Invite a person', size: 'md', body: '<div class="e1-stack">' + c.field('Name', c.input({ id: 'ag-iv-n' }), { id: 'ag-iv-n', required: true }) + c.field('Work e-mail', c.input({ id: 'ag-iv-e', type: 'email', placeholder: 'name@kaverispinning.in' }), { id: 'ag-iv-e', required: true }) + c.field('Role', c.select({ id: 'ag-iv-r', options: ROLES.filter(function (r) { return !/elan1/.test(r.label); }).map(function (r) { return { value: r.id, label: r.label }; }), value: 'accounts-exec' }), { id: 'ag-iv-r', help: 'Changing roles and inviting are dual-control for the Owner role: a second owner confirms.' }) + '</div>',
      actions: [{ label: 'Cancel', kind: 'ghost' }, { label: 'Send invitation', kind: 'primary', onClick: function (e, close, m) { var n = m.querySelector('#ag-iv-n'), em = m.querySelector('#ag-iv-e'); if (!n.value.trim() || !/@/.test(em.value)) { (n.value.trim() ? em : n).setAttribute('aria-invalid', 'true'); E1.toast('A name and a work e-mail are needed.', 'warning'); return false; } E1.toast('Invitation sent to ' + em.value + '. Joining is recorded on the chain.', 'good', { title: 'Invited' }); } }] });
  });

  reg('/agents/people/:id', {
    title: function (p) { var x = person(p.id); return x ? x.name : 'Person'; }, section: 'people', example: '/agents/people/venkat-raman',
    crumbs: crumbs([['People', '#/agents/people']]), keywords: 'person approver profile',
    render: function (p) {
      var x = person(p.id);
      if (!x) return notFound('Person', p.id, ['Open people', '#/agents/people']);
      if (x.kind !== 'person') return c.pageHeader({ title: x.name, lead: 'A system job, not a person.', back: ['People', '#/agents/people'] }) + c.empty({ title: 'People lists humans only', why: x.name + ' is a system actor. It can never approve.', action: { label: 'Open it in Records · Actors', href: '#/records/actors/' + x.id }, icon: 'server' });
      var e = PEOPLE_X[x.id] || { sets: [], approves: [], grants: {} };
      var role = ROLES.filter(function (r) { return r.id === e.roleId; })[0];
      var header = c.pageHeader({ eyebrow: 'Person' + (e.staff ? ' · elan1 staff' : ''), title: x.name, lead: x.role + '. ' + (x.mayApprove === true ? 'Approves in ' + e.sets.join(', ') + '.' : x.mayApprove === 'certify' ? 'Certifies declaration versions.' : 'Does not approve.'), back: ['People', '#/agents/people'], meta: c.actor({ name: x.name, kind: 'person', role: role ? role.label : x.role, size: 'sm' }) + (E1.data.user && E1.data.user.id === x.id ? c.badge('info', 'You', { subtle: true }) : '') });
      var decisions = PROOF.filter(function (r) { return r.actor === x.id; }).slice().reverse();
      var decTable = c.table({ caption: 'Recent governed writes and decisions', rowHref: function (r) { return '#/assurance/proof/' + r.seq; }, columns: [
        { key: 's', label: 'Proof', render: function (r) { return '<span class="ag-num">#' + fmt.num(r.seq) + '</span>'; } },
        { key: 't', label: 'Time', render: function (r) { return '<span class="e1-caption">' + esc(fmt.time(r.at)) + '</span>'; } },
        { key: 'w', label: 'Write type', render: function (r) { return wtCell(r.wt); } },
        { key: 'o', label: 'Record', render: function (r) { return '<span class="e1-caption">' + esc(r.obj) + '</span>'; } },
        { key: 'x', label: 'Outcome', render: function (r) { return outcomeBadge(r.outcome, r.code); } }
      ], rows: decisions, empty: { title: 'No governed write by ' + x.name + ' today', why: 'Submissions, approvals, rejections and refusals by this person appear here with their proof entries.', compact: true } });
      var approveTable = e.approves.length ? c.table({ caption: 'Write types this person may approve', dense: true, columns: [{ key: 'w', label: 'Write type', render: function (n) { return n === 'platform.autonomy.grant' || n === 'platform.tenant.stop' || n === 'platform.declaration.certify' ? '<span class="e1-mono">' + esc(n) + '</span>' : wtCell(n); } }, { key: 'd', label: 'Dual control', render: function (n) { var w = wtOf(n); return esc(w ? w.dual : 'Always'); } }], rows: e.approves }) : c.empty({ title: x.name + ' approves nothing', why: 'Not in any resolver set.', compact: true });
      var grants = Object.keys(e.grants);
      var grantHtml = grants.length ? c.table({ caption: 'Autonomy grants', dense: true, columns: [{ key: 'w', label: 'Write type', render: function (n) { return wtCell(n, { link: true }); } }, { key: 'g', label: 'Grant', render: function (n) { return c.autonomy(e.grants[n], { compact: true }); } }], rows: grants }) + '<p class="ag-tablenote">Humans are granted, not graduated. Missing grants read A0 Observe (no grant).</p>' : c.empty({ title: 'No autonomy grant', why: 'Submissions by this person escalate or refuse according to each write type’s rules.', compact: true });
      var owns = AGENTS.filter(function (a) { return a.owner === x.id; });
      var side = c.card({ title: 'Contact and sign-in', body: c.kv([['E-mail', e.email || '—', { mono: true }], ['Sign-in', e.signIn || '—'], ['Last active', e.last ? fmt.dateTime(e.last) : '—'], ['Role', role ? role.label : x.role]], { compact: true }) + '<div style="margin-top:var(--space-3)">' + c.button('Role permissions', { size: 'sm', href: '#/agents/roles' }) + '</div>' }) +
        c.card({ title: 'Agents this person owns', body: owns.length ? '<ul class="e1-stack e1-stack--sm" style="list-style:none;padding:0;margin:0">' + owns.map(function (a) { return '<li>' + c.actor({ name: a.name, kind: 'agent', role: a.model, href: '#/agents/agent/' + a.id, size: 'sm' }) + '</li>'; }).join('') + '</ul>' : '<p class="e1-caption e1-muted">None.</p>' }) +
        c.card({ title: 'Delegations', body: x.id === 'venkat-raman' ? '<p class="e1-caption">Given: sponsor duties for ar-agent to Ravi Shankar, 20 Sep – 4 Oct 2026 · <a href="#/assurance/proof/3702">proof #3,702</a> (dual control).</p>' : x.id === 'ravi-shankar' ? '<p class="e1-caption">Received: sponsor duties for ar-agent from Venkat Raman, 20 Sep – 4 Oct 2026 · <a href="#/assurance/proof/3702">proof #3,702</a>.</p>' : '<p class="e1-caption e1-muted">None live. A delegation never names an agent and never raises autonomy.</p>' });
      return header + '<div class="e1-split e1-split--wide"><div class="e1-stack e1-stack--lg">' +
        c.section({ id: 'sets', title: 'Resolver sets', body: e.sets.length ? '<div class="e1-grid e1-grid--auto">' + e.sets.map(function (k) { return '<a class="e1-linkcard" href="#/agents/people?set=' + esc(k) + '" style="text-decoration:none"><strong class="e1-mono">' + esc(k) + '</strong><span class="e1-caption">' + esc(SETS[k].what) + '</span></a>'; }).join('') + '</div>' : c.empty({ title: 'In no resolver set', why: 'Obligations are never sent to ' + x.name + '.', compact: true }) }) +
        c.section({ id: 'approves', title: 'May approve', body: approveTable }) +
        c.section({ id: 'grants', title: 'Autonomy as a person', body: grantHtml }) +
        c.section({ id: 'decisions', title: 'Recent governed writes', body: decTable }) +
        '</div><aside class="e1-stack">' + side + '</aside></div>';
    }
  });

  reg('/agents/roles', {
    title: 'Roles', section: 'roles', wide: true, crumbs: crumbs(), keywords: 'permissions matrix dual control',
    render: function () {
      var header = c.pageHeader({ tabs: sibTabs('roles'), eyebrow: 'Agents · people', title: 'Roles', lead: 'What each role may do, and where a second named person is required. Roles hold permissions; resolver sets hold people; an agent holds neither.', actions: c.button('People', { href: '#/agents/people', icon: 'users' }) });
      var W = { y: ['check', 'Yes'], n: ['minus', 'No'], d: ['users', 'Yes, as one of two'], s: ['filter', 'In their resolver sets'], o: ['user', 'Their own only'] };
      var thead = '<thead><tr><th scope="col">Permission</th>' + ROLES.map(function (r) { return '<th scope="col">' + esc(r.label) + '<span class="ag-sub" style="font-family:var(--font-ui)">' + esc(r.who.length ? r.who.map(personName).join(', ') : 'nobody yet') + '</span></th>'; }).join('') + '</tr></thead>';
      var tbody = '<tbody>' + PERMS.map(function (row) { return '<tr><th scope="row">' + esc(row[0]) + '</th>' + row.slice(1).map(function (v) { var w = W[v]; return '<td><span class="ag-perm' + (v === 'n' ? ' ag-perm--no' : '') + '">' + c.icon(w[0], 12) + '<span>' + esc(w[1]) + '</span></span></td>'; }).join('') + '</tr>'; }).join('') + '</tbody>';
      var dual = c.table({ caption: 'Dual-control eligibility', dense: true, columns: [{ key: 'w', label: 'Governed write' }, { key: 'who', label: 'Who may be the second person' }], rows: [
        { w: 'Supplier payment run (erp.payment_run.submit)', who: 'Two of treasury-dual: Ravi Shankar, Meenakshi Iyer' },
        { w: 'Autonomy raise (platform.autonomy.grant)', who: 'Owner or Finance manager, never the proposer' },
        { w: 'Stop switch (platform.tenant.stop)', who: 'Owner or Finance manager, never the person who threw it' },
        { w: 'Certify a declaration (platform.declaration.certify)', who: 'Certifier, never the author' },
        { w: 'Close accounting period (erp.period.close)', who: 'Two of close-approvers' }
      ] });
      return header + c.section({ id: 'matrix', title: 'Role → permissions', lead: 'Words and a shape in every cell; never colour alone.', body: '<div class="ag-matrix-wrap"><table class="ag-matrix"><caption class="e1-sr">Permissions by role</caption>' + thead + tbody + '</table></div>' }) +
        '<div class="e1-grid e1-grid--2" style="margin-top:var(--space-6)">' + c.card({ title: 'Dual-control eligibility', flush: true, body: dual }) +
        '<div class="e1-stack">' + c.callout({ kind: 'rule', title: 'No admin mode.', body: '<p>There is no role that skips the rungs. Break-glass is a declared write type with dual control, recorded in the operator’s own chain and visible to you.</p>' }) + ruleNever() + '</div></div>';
    }
  });
})();
