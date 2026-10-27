/* ==========================================================================
   elan1 shared sample data — E1.data
   Canonical set: research/spec-phase1-console.md §4.1–4.2 (now = 24 Sep 2026, IST).
   Keep small. Screen agents add their own as E1.data.<area> = {...} in their
   own screen file, using the same names and ids so cross-links agree.
   Packs are ledger1 · invoice1 · collect1 (never the retired Enterprise 1 names).
   ========================================================================== */
(function () {
  'use strict';
  var E1 = window.E1;
  E1.data = E1.data || {};

  /* §4.1 Tenants. status: 'live' | 'onboarding' | 'stopped' | 'pre-ga' | 'reference' */
  E1.data.tenants = [
    { id: 'kaveri-spinning', name: 'Kaveri Spinning Mills Pvt Ltd', short: 'KS', city: 'Tiruppur', gstin: '33AAACK4821M1Z7', host: 'ERPNext (hosted) kaveri.rung1.in', region: 'Mumbai', residency: 'in · Mumbai', env: 'production', mode: 'Enforced · credential custody', level: 'L1', pack: 'ledger1', status: 'live', chainHead: 4112 },
    { id: 'deccan-auto', name: 'Deccan Auto Components Pvt Ltd', short: 'DA', city: 'Pune', gstin: '27AADCD7719K1Z3', host: 'ERPNext (hosted) deccan.rung1.in', region: 'Mumbai', residency: 'in · Mumbai', env: 'production', mode: 'Enforced · credential custody', level: 'L1', pack: 'ledger1', status: 'live', chainHead: 1284 },
    { id: 'sahyadri-agro', name: 'Sahyadri Agro Foods LLP', short: 'SA', city: 'Nashik', gstin: '27ABDFS3321P1ZQ', host: 'ERPNext (hosted)', region: 'Mumbai', residency: 'in · Mumbai', env: 'production', mode: 'Enforced', level: 'L1', pack: 'invoice1', status: 'onboarding', statusNote: 'Onboarding', chainHead: null },
    { id: 'nilgiri-tea', name: 'Nilgiri Tea Traders Pvt Ltd', short: 'NT', city: 'Coonoor', gstin: '33AADCN6604H1Z2', host: 'ERPNext (hosted)', region: 'Mumbai', residency: 'in · Mumbai', env: 'production', mode: 'Enforced', level: 'L1', pack: 'ledger1', status: 'stopped', statusNote: 'Stopped', stop: { reason: 'Suspected credential exposure', at: '2026-09-24T16:05:00+05:30', by: ['Meenakshi Iyer', 'Arjun Mehta'] }, chainHead: 612 },
    { id: 'ledgerloop-sbx', name: 'LedgerLoop Software Pvt Ltd', short: 'LL', city: 'Bengaluru', gstin: '29AAFCL5520Q1ZB', host: 'Sandbox ERPNext site', region: 'Mumbai', residency: 'in · Mumbai', env: 'sandbox', mode: 'Attested advisory (MCP)', level: 'L1', pack: 'invoice1', status: 'pre-ga', statusNote: 'Design partner · Pre-GA', chainHead: 318 },
    { id: 'ref-tenant', name: 'Reference tenant (synthetic fixtures)', short: 'RT', city: 'Synthetic', gstin: null, host: 'Sandbox ERPNext', region: 'Mumbai', residency: 'in · Mumbai', env: 'sandbox', mode: 'Enforced', level: 'L1', pack: 'ledger1', status: 'reference', statusNote: 'Reference', chainHead: 10000 }
  ];

  /* §4.2 People (Kaveri tenant). kind: 'person' | 'system'. mayApprove: true | false | 'certify' | null */
  E1.data.people = [
    { id: 'rekha-subramanian', name: 'Rekha Subramanian', role: 'Accounts executive', kind: 'person', mayApprove: false },
    { id: 'priya-nair', name: 'Priya Nair', role: 'Accounts executive', kind: 'person', mayApprove: false },
    { id: 'venkat-raman', name: 'Venkat Raman', role: 'Accounts head (ar-approvers)', kind: 'person', mayApprove: true },
    { id: 'ravi-shankar', name: 'Ravi Shankar', role: 'Finance manager', kind: 'person', mayApprove: true },
    { id: 'meenakshi-iyer', name: 'Meenakshi Iyer', role: 'Owner', kind: 'person', mayApprove: true },
    { id: 'farah-sheikh', name: 'Farah Sheikh', role: 'Declaration author (elan1)', kind: 'person', mayApprove: null },
    { id: 'arjun-mehta', name: 'Arjun Mehta', role: 'elan1 lead, certifier', kind: 'person', mayApprove: 'certify' },
    { id: 'nightly-verifier', name: 'nightly-verifier', role: 'System job', kind: 'system', mayApprove: false }
  ];

  /* The signed-in user: an approver in ar-approvers */
  E1.data.user = {
    id: 'venkat-raman',
    name: 'Venkat Raman',
    role: 'Accounts head',
    email: 'venkat.raman@kaverispinning.in',
    actorId: 'act_hum_venkat_raman',
    kind: 'person',
    mayApprove: true,
    resolverSets: ['ar-approvers'],
    authority: 'Approves erp.sales_invoice.submit, erp.credit_note.submit and erp.credit_limit.change; dual control above ₹2,00,000'
  };

  E1.data.env = {
    sandbox: { label: 'Sandbox', note: 'Per-tenant sandbox restored from a snapshot. Nothing reaches a live system.' },
    production: { label: 'Production', note: 'Governed writes reach ERPNext through Frappe’s own API.' }
  };

  /* Notifications link only to canonical routes (ROUTES.md). actorKind: 'agent' | 'person' | 'platform'. icon optional. */
  E1.data.notifications = [
    { id: 'n1', unread: true, state: 'warning', icon: 'gate', actorKind: 'agent', at: E1.ago(13), href: '#/work/decide/OB-2026-0412',
      title: 'Waiting on you · OB-2026-0412', body: 'ar-agent proposed submitting SINV-2026-01187 to ACME Textiles for ₹2,40,000. 5 of 5 checks passed.' },
    { id: 'n2', unread: true, state: 'warning', icon: 'timer', actorKind: 'agent', at: E1.ago(2), href: '#/work/decide/OB-2026-0411',
      title: 'Expires in 52 min · OB-2026-0411', body: 'ap-agent proposed a supplier payment run: 14 suppliers, ₹18,42,760. Needs Ravi Shankar and Meenakshi Iyer.' },
    { id: 'n3', unread: true, state: 'neutral', icon: 'refuse', actorKind: 'agent', at: E1.ago(4), href: '#/work/not-done/4108',
      title: 'Not done — budget used up for this period', body: 'rung1 drafting agent has used 250 of 250 drafts declared for September. Proof #4,108.' },
    { id: 'n4', unread: true, state: 'serious', icon: 'stop', actorKind: 'person', at: E1.ago(1), href: '#/records/tenants/nilgiri-tea',
      title: 'Nilgiri Tea Traders is stopped', body: 'Suspected credential exposure. Stopped by Meenakshi Iyer and Arjun Mehta; all writes, including refusals, are halted.' },
    { id: 'n5', unread: false, state: 'good', actorKind: 'person', at: E1.ago(26), href: '#/assurance/proof/4101',
      title: 'Committed · proof #4,101', body: 'You approved OB-2026-0412; SINV-2026-01187 was submitted to ERPNext. Reversible for 24 h (cancel IRN).' },
    { id: 'n6', unread: false, state: 'info', icon: 'chain', actorKind: 'platform', at: E1.ago(796), href: '#/assurance/chain',
      title: 'Chain checked overnight', body: 'Continuous · seq 1–4,112 · 19 of 23 write types · checked nightly 02:10 IST.' }
  ];
})();
