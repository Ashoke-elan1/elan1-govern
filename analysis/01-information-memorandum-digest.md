# 01 — Information Memorandum digest (Elan1 Govern, Series A IM, revised 27 Oct 2026)

Source: `elan1-govern-information-memorandum.txt` (pdftotext of the 285-page IM: R1–R16 revision supplement + original §1–§19 + Appendices A–G). Line refs below are to that text file (`L####`). Purpose: everything that shapes the React front end (console + public/developer surfaces).

Reading rules that matter for the UI:
- **The revision supplement (R1–R16) governs** where it disagrees with original pages (L255–259). "elan1" in the original meaning the product/kernel = **Elan1 Govern**; "elan1 Private Limited" stays the entity (L272–276).
- **Two status scales exist** and the UI will need both as visual badges:
  - Provenance marks (for numbers/claims): `PUBLISHED`, `MEASURED`, `MODELLED`, `UNVERIFIED` (L282–283).
  - Code status marks (for capabilities): `BUILT` (in repo at commit 22388ad, "Built is not shipped"), `PARTIAL`, `NEEDS LOGIC` (designed, to build next), `SPECIFIED` / `DESIGN ONLY` (no code), `ABSENT`, `PROPOSED` (unsigned wording/decision) (L291–321).
- There are **two products described at once**: the *specified* kernel (KernelPort, nine rungs, Declaration, Seal v6, L1/L2/L3) which "remains the target", and the *built* Elan1 Govern (rulebooks, receipts, MCP proxy, 13 console areas) which is "the current, partial Level 1 implementation" (DR-016, L1974–1980). The front end must present the built product truthfully and leave room to grow into the spec.

---

## 1. Product in one paragraph + core concepts glossary

### 1.1 The product
Elan1 Govern sits between an AI agent and the tools/systems it acts on. Before a tool call runs it checks the agent's key, whether the agent is paused, that a **signed rulebook** exists and its signature is valid, that the tool is known and switched on, and that the arguments are valid; then it evaluates rules ("strictest matching rule wins", quotas can turn an allow into an ask, anything no rule allows is refused) and answers **Allow · Ask a person · Refuse** (L687–704). On the **MCP route** Elan1 Govern runs the tool itself holding the credentials ("governed run" = Enforced); on **REST/SDK** it only answers and the agent acts ("check and record" = Attested advisory) (L1092–1110). Every decision, approval, outcome and admin change becomes a **receipt**: Ed25519-signed, hash-chained per organisation, with **hourly signed checkpoints**; an **auditor pack** exports receipts + checkpoints + keys + signed manifest + PDF summary, and **`govern verify`** checks it offline with no account (L957–985). The billing unit is the **governed action** ("one tool call decided by Elan1 Govern"); refusals are free (quantity zero, DB-enforced) — but **no meter/billing exists in code yet** (L817–819). The company's commercial one-liner: "sells the right to say this write could not have happened without approval, and here is the receipt that proves it" (L2416). Lead sentence that needs no signature: **"A model may produce a write intent; it may never produce an allow."** (L3193–3194, L15837).

### 1.2 Glossary (terms a UI would show)
Built terms are marked (B); specification terms (S). Where both exist, the built term should be the default UI term and the spec term shown only in L2/L3/roadmap/spec contexts.

**Decisions, actions, approvals**
| Term | Definition (crisp) | Source |
|---|---|---|
| Governed action (B/S) | One tool call decided by Elan1 Govern; the billing unit. Spec: "permitted, executed, recorded and billed" — one row in the chain, one meter event, one invoice line, one thing an auditor can open. Read metering undecided. | L2254–2255, L15700–15705 |
| Allow · Ask a person · Refuse (B) | The three decisions. Spec equivalents: committed / escalated / refused ("there is no warn"; "escalate is the honest version of warn"). | L2233, L3386–3388 |
| Rulebook (B) | Signed YAML policy for one agent; built form of the Declaration. `default: refuse` mandatory; versions, diff, sign and publish; signature verified on every call. | L712–728, L2230 |
| Rule / strictest rule wins (B) | Rules match a tool or a risk tag, with conditions and count/sum quotas. | L722–724 |
| Risk tag (B) | One of 8 labels on a tool: **reads data, writes data, moves money, sends external, personal data, deletes, changes access, changes production**. Rules can match a tag. | L2231–2232 |
| Quota (B) | A count or sum per time window that can turn an allow into an ask. | L2232–2233 |
| Approval (B) | Held call routed to a named person via web, signed single-use e-mail/phone links, Slack, WhatsApp. Chat buttons only for rules marked "approvable in chat", never for deletes, access changes, production changes, personal data, uncapped payments. Default expiry **24 h → refused**. Password re-asked if last sign-in >10 min (Slack/WhatsApp buttons skip this). | L731–741 |
| Approval states | Built: pending → approved / refused / expired (24 h). Spec (precedent counters) adds: approved_unamended, approved_amended, declined, expired, reversed_in_window, corrected_after_window. Spec escalation: "named human resolver set and a four-hour expiry". | L736, L5959–5965, L3442–3444 |
| Dual control (S, partly B) | Two named humans; proposer may never approve. Built: assessments need a different person's sign-off. Rulebook dual control is "Not yet on code". | L770–773, L887 |
| Emergency stop (B, PARTIAL) | Owners/admins type **STOP**: pauses every agent, refuses every new call, writes a receipt and an incident report; does **not** cancel approvals already waiting. | L783–793, L2250–2251 |
| Auto-pause (B, PARTIAL) | Off by default; acts only on high-severity alerts (3 of 6 detectors can raise). | L783–785 |
| Alerts (B) | 6 statistical detectors. | L783 |
| Rule suggestion (B) | Nightly draft rule from ≥10 consistent approvals over 30 days; published only by a person (open as draft or dismiss). | L796–798, L2248–2249 |
| Try an action (B) | Rulebook test of a single hypothetical call. | L726 |
| Test on past actions (B) | Replay a draft rulebook over the last 7 or 30 days of calls from the encrypted replay store (arguments kept 30 days, on by default — DPDP risk). | L2249–2250, L2221 |
| Kill switch / stop set (S) | Rung 0b: tenant kill switch, revocation, blacklist, regulator directive. | L3266 |

**Evidence**
| Term | Definition | Source |
|---|---|---|
| Receipt (B) | One signed, hash-chained record of a decision, approval, outcome or administrative change. 22 top-level fields (most optional); stores a SHA-256 of tool+arguments and a minimal summary of values the rules inspected, never full arguments. Calls rejected before the guard (invalid key, rate limit) produce no receipt. | L957–961, L2234 |
| Chain (B) | One chain per organisation; each receipt carries the previous hash from a genesis value; gap-free sequence numbers (DB lock). | L962–963 |
| Checkpoint (B) | Hourly signature over the chain head (if the chain moved); also on demand. | L974–975, L2235 |
| Key rotation (B) | `key.rotated` receipt signed by the old key names the new one; retired keys verify old receipts. Spec key id form: `k_in_20270401_9c3a`; statuses active / retired / revoked. | L976–978, L5369–5372 |
| Auditor pack (B) | Zip (`gate-evidence-bundle/1` — internal name) with receipts, checkpoints, public keys, signed manifest, README, PDF summary, compliance map. | L979–981, L2235–2236 |
| `govern verify` (B) | Offline verifier, no account; checks schema, sequence, links, hashes, signatures, key retirement, checkpoints, manifest, file digests. Exit **0 intact / 1 broken or not verified / 2 usage error or missing file**. | L982–985 |
| Evidence bundle (S) | Directory "that needs nothing from elan1": `manifest.json`, `seals.jsonl`, `chain.json`, `anchors/` (L2), `keys.json` (L2), `declarations/`, `lexicon/`, `VERIFY.txt` (+ a 9th disclosures member at L3). Never contains payloads or key material. Manifest not signed as a whole. | L4981–5082, L15691–15698 |
| Unanchored head (S) | Records not yet covered by an anchor at export time; "zero is a value, not an absence". | L4994, L5075–5076 |
| Offline verifier (S) exit codes | **0 PASS · 0 PASS — payload unbound · 0 PASS — unsigned, assurance level 1 · 1 FAIL_INTEGRITY · 2 FAIL_PROFILE · 3 INCOMPLETE · 4 UNSUPPORTED · 5 USAGE**. "Altered is not unmet requirement is not missing piece." | L5126–5147 |
| Anchor (S) | RFC 3161 token over a Merkle root of a batch; proves "existed, in this form, no later than this instant". Two authorities, ≥1 India-based (eMudhra + one of DigiCert/Sectigo/GlobalSign/Entrust). `single_anchor` = degraded state. Interval ≤15 min. | L5200–5273 |
| Seal / Seal Spec v6 (S) | `elan1.proof.seal.v6`: 16 frozen fields — tenant, sequence, previous digest, write identifier, write type, declaration identifier, declaration version, policy version, actor, actor kind, autonomy level, record identifier, record version, payload digest, lexicon digest, recorded-at. Ed25519 at L2. Built receipt is a different format. | L4833–4898, L998–1000 |
| Verifier profile (S) | Machine-checkable regime claim, jurisdiction-prefixed (`in-mca-audit-trail`, `in-rbi-collections`), 8 blocks, clause→write type+gate+field binding, limits statement ≥200 chars, never certified by its author. | L5451–5528 |
| Limits statement (S) | What a PASS does not establish; reproduced verbatim in every verification report. | L3716–3717 |
| Action Receipt (S) | Published portable receipt standard (13 members: format, seal_suite, sealed_fields, digest, issuer, limits always; signature, key_id from CL-2; anchor CL-3; audience, nonce, expires_at CL-4; disclosure_suite, disclosures). Conformance CL-1 Structural, CL-2 Attested, CL-3 Anchored, CL-4 Addressed, CL-D Disclosing. | L6406–6477 |
| Selective disclosure (S, L3) | Reveal some committed fields; "you are revealing 3 of 11 committed fields"; "Withheld is not missing, and missing is not altered." | L5791–5901 |
| Tamper-evident | The only permitted integrity word at every level. | L4828–4830 |

**Levels, modes, autonomy, gates**
| Term | Definition | Source |
|---|---|---|
| Assurance levels (S) | **L1 Guarded** (enforcement, approval, single writer, hash-chained log, metering; buyer: operator), **L2 Attested** (Ed25519 seal, RFC 3161 at two authorities, bundles, zero-dep offline verifier; buyer: auditor's counterparty), **L3 Proven** (cross-org verification, selective disclosure, customer-held keys, earned autonomy; buyer: "the market"). "Levels of a claim, never SKUs with brand names." Built status: L1 PARTIAL, L2/L3 SPECIFIED. | L2471–2483, L3549–3573, L1148–1170 |
| Upgrade boundary (S) | L1→L2 is a retrofit; records before the boundary "stay L1 for ever"; bundle and screen show boundary date and counts each side. | L3582–3591, L9869–9876 |
| Enforced / Attested advisory (S) = Governed run / Check and record (B) | Enforced: kernel holds the credential; refusal means the write did not happen. Advisory: caller holds the credential; "evaluated and recorded". Mode set per write type, rendered on the assurance screen, printed in every export. Promotion per write type after ≥30 days + bypass proof. | L3494–3531, L1092–1123, L2252–2253 |
| Autonomy A0–A5 (S) | **A0 Observe** (reads only), **A1 Draft**, **A2 Propose**, **A3 Act reversible**, **A4 Act bounded**, **A5 Act broad**. Missing grant → A0. No A6. "There is no API that sets an autonomy level." Not built ("no autonomy ladder"). | L3380–3384, L15614–15621, L1370–1372 |
| Earned autonomy / graduation (S, L3) | Only A2→A3 graduates; dual-control governed write `autonomy.graduate`; 30-day supervised period at 1-in-10 sampling; revocation is one person, one press. | L5904–6112 |
| Action class (S) | (tenant_id, write_type, actor_kind, blast_radius) — unit of autonomy. | L5956–5958 |
| Pre-gates G1–G9 (S) | **G1 consent, G2 residency, G3 retention, G4 dual control, G5 rate, G6 budget, G7 counterparty, G8 schedule, G9 precondition.** Six never skippable (consent, residency, retention, dual control, counterparty, precondition); only rate, budget, schedule may be declared off. First failure sets the code; remaining gates still run and record. | L15791–15798, L3372–3378 |
| Nine rungs / the Right Path (S) | 0b STOP · 1 IDENTITY · 2 WRITE DOOR · 3 PRE-GATES · 4 evaluate() · 5 GUARDRAIL · 6 AUTONOMY · 7 ACT · 8 PROOF · 9 METERED. Built pipeline has stop, identity, pre-gates, evaluate, act (MCP only), proof; guardrail is quotas only; write door, autonomy, meter absent. | L3264–3290, L1337–1343 |
| Blast radius (S) | `one_record · one_counterparty · batch · tenant · cross_boundary`. Irreversible ⇒ ≥ one counterparty and never auto-approved; tenant/cross_boundary ⇒ dual control; cross_boundary ⇒ non-empty proof binding. Meter basis derives from it (per record/counterparty/batch/tenant/crossing). | L15917–15934, L4622–4624 |
| Write type (S) | `<slug>.<verb>` e.g. `sales_invoice.submit`, with blast radius, ordered gates, and a reversal plan or `irreversible: true`. Built equivalent: tool + risk tags. | L15917–15934, L1351 |
| Declaration (S) | Seven blocks: identity, shape, permissions, write_types, gates, proof_binding, channels. JSON <900 lines; versions immutable; nothing resolves to "latest" in production. | L3451–3456, L15651–15661 |
| Refusal code (S) | Closed register: **43 codes — policy 14, gate 19, platform 10**; 28 active at L1; +6 at L3 (e.g. `POLICY.RECEIPT_AUDIENCE_MISMATCH`, `POLICY.RECEIPT_EXPIRED`, `POLICY.TRUST_ANCHOR_UNKNOWN`, `POLICY.RECEIPT_UNVERIFIED`, `GATE.RECEIPT_REPLAYED`, `GATE.COUNTERPARTY_UNKNOWN`); example `GATE.PRECONDITION_FAILED`; `PLATFORM.*` = "we failed", never billable, pages. Built: rule id + reason; 6 fixed system ids (e.g. `gate-error`). | L4295–4307, L5755–5759, L1355, L716 |
| Refusal vs rejection vs platform failure (S) | Refusal = HTTP 200, full record, meter 0, never retry. Rejection = 4xx, no record (429 rate limit). Platform failure = 5xx or 200 with `PLATFORM.*`, full record, not billable, retry same intent. | L4318–4338 |
| Meter (S) | Rung 9; one event per governed action; every event carries `write_id` + sequence; refusals quantity 0 via DB CHECK. Not built. | L15763–15768, L817 |
| KernelPort (S) | Six calls: `define`, `assert`, `seal`, `verify`, `scope`, `refuse`. Built analogue: `/v1/check`, `/v1/record`, `/v1/approvals/:id` + MCP. | L3214–3232, L1330–1332 |
| Token classes (S) | Tenant token (only class that reaches writes), control token, read-only operations token. Built: agent keys prefixed, stored as SHA-256, shown once (`gk_` prefix internal). | L4616–4621, L1242 |
| Sandbox key / production key (S) | Sandbox self-serve on e-mail verification, isolated tenant, synthetic fixtures, chain marked sandbox, meter 0, 10 writes/min, 2 concurrent, provisioned <60 s. Production key never self-serve; human review, 2 working days. Built: any owner/admin self-issues agent keys, no sandbox/prod split. | L4640–4661, L1838–1840 |
| Single writer (S) | One process mutates the target per tenant via single-use credential, 10-minute life, one write. | L15881–15886 |
| Reversal / rollback (S) | "Reverse this" control valid 30 days from the declared reversal plan. | L3418–3419 |

**Organisation, packs, compliance**
| Term | Definition | Source |
|---|---|---|
| Organisation (B) | The built term for a tenant. | L2252 |
| Agent (B) | Has a slug, key, rulebook; can be paused. Add-agent wizard gives an MCP address + key. | L1836–1837 |
| Connector (B) | Built-in integration (Gmail, Zoho Books India DC; demo data by default) or a customer's MCP server behind Elan1 Govern ("Your MCP servers"; tools start switched off with suggested risk tags). | L760–766, L2236–2237 |
| Industry pack (B) | Starter rulebook + framework set chosen at onboarding: Finance and accounting; Healthcare; HR and recruiting; Customer support; Sales and marketing; Engineering and DevOps; General. Each enables ISO/IEC 42001 + NIST AI RMF + region frameworks. Not a regulatory pack; descriptive label, never a *1 name. | L1590–1617 |
| Regulatory pack (S) | One declaration + one certified verifier profile + one regime export; `ledger1` (MCA), `invoice1` (GST e-invoicing), `collect1` (RBI collections). None built. "Pack" never used alone. | L1590–1610, L2255–2256 |
| Framework / control / coverage (B) | 10 coded frameworks; 13 product controls; coverage = share of requirements with live receipt evidence ("a count of evidence and not a test that a control works"). All labelled **"Draft — needs legal review"**. | L776–780, L1629–1655 |
| AI inventory (B) | Register of AI systems (no model-name field). | L769, L2239–2248 |
| Assessment (B) | Scored questionnaire (3 templates, explained deterministic scores) with second-person sign-off; risk tier + review date set only by an approved assessment. | L769–773 |
| Precedent (S) | Per-tenant computation, e.g. "this write resembles forty earlier writes, three of which were refused"; never cross-tenant. | L15782–15789 |
| Counterparty register (S, L3) | Shows per receipt which key-discovery route resolved ("accepted on a pinned fingerprint since March 2028" vs "fetched four minutes ago"). | L5654–5657 |
| `ar-org:<domain>` (S, L3) | DNS-anchored organisation identity, e.g. `ar-org:acmetextiles.example`. | L5627–5628 |
| Planes P0–P8 (S) | P0 residency/tenancy … P3 kernel, P4 declarations, P5 surfaces, P6 channels, P7 apps, P8 packs. "L" reserved for assurance levels; "A" for autonomy. | L15725–15730, L15775–15780 |

---

## 2. Personas, buyers and users

Original framing: **"Three buyers, and a fourth who pays in cash"** (§3.6, L3085) and **"Three people pay, at three different moments, for three different artefacts"** (§11.6, L7615). Confusing them "is the commonest way to lose a deal" (L3086–3087).

| Persona | Who | The question they ask (quoted) | Jobs-to-be-done | Level / surface |
|---|---|---|---|---|
| **Operator** | Finance controller / head of operations "being asked to let an agent touch the books"; ops or finance owner | "can I let this run without it doing something I cannot undo?" (L7620–7621) | Enforcement; human approval on writes that need it; "an autonomy ladder they can lower in a minute"; a path back (rollback); emergency stop; see every attempt including refusals | L1 Guarded; console Today, Agents, Rulebooks, Approvals, Activity, Alerts/Stop |
| **End user / maker** | e.g. "Rekha, an accounts executive" at a mid-sized manufacturer (worked example) | Implicit: did my action go through, and if not why? | Sees "Payment recorded · proof #4,097" with "Reverse this" (30 days), or "Not done — credit limit" with the two failing numbers and two next actions (request limit change / reduce invoice) | Outcome/result screens (L3394–3440) |
| **Approver** | A named human in the resolver set; never the proposer; for dual control a second named human | Implicit: what exactly am I approving? | Approve/decline from web, e-mail/phone link, Slack, WhatsApp; product design function is measured by "Approver sees diff, gate results and policy version" (L10102–10103). The approval records "a digest of the payload they were actually shown" (L3445–3446). | Approvals area, `/approve/[token]` |
| **Auditor's counterparty / assurance** | External/statutory auditor, a lender's diligence team, a compliance function, a CA firm carrying audit-trail responsibility; head of internal audit | "can I verify this without trusting the vendor?" (L7630); "can they hand a third party something checkable without asking the vendor" (L3096–3097) | Signatures, external time anchor, exportable bundle, a verifier "they did not get from the party being verified"; read limits statement; reconcile chain vs target system's own audit trail | L2 Attested; Evidence area, auditor pack, verifier, Auditor role switching orgs |
| **Counterparty / regulator** | Two governed firms transacting; an examination team "that must check a receipt in ten years" | "does this survive the vendor?" (L7638) | Open format, second implementation, published test vectors incl. tampered bundle, non-vendor signature | L3 Proven; receipt verification, counterparty register |
| **Insurer (fourth party)** | Specialist AI carriers (Klaimee, Testudo, HSB/Munich Re, Mayflower+Hadron, Agent Insured, Corgi, AIUC-1 + Lloyd's) | Wants "trace-level evidence of individual task sequences"; oversight evidence; kill switches; authority scoping (L3113–3117) | Price exposure per interaction = per governed action | Future: receipt as underwriting artefact (FY2027-28) |
| **CFO (economic buyer)** | Signs the Rule 11(g) representation | Asks "within about ten minutes" whether the vendor is "incentivised to make the system say no" (L3622) | Wants "412 refused, ₹0" on the invoice | Billing/invoice screen |
| **Builder / developer (third party over MCP)** | Third-party vendor or customer engineer integrating an agent | Implicit: how do I get from sandbox to production? | Sandbox key on e-mail verification; prove allow/refuse/escalate in sandbox; request production key (enforcement mode in writing, reversal plan or irreversible flag per write type, named human certifier, named production owner); conformance suite; status page; 12-month sunset notices | Developer portal, sandbox, production-key request, status page |
| **CA firm (channel partner)** | The CA "who signs off the books" for a ₹5–50 crore firm | Introduces, frames the obligation, reads the verification report (L9537–9538) | Multi-client view (built Auditor role "switches between client organisations"); certification levels Introducer / Implementer / Verifier | Partner/CA console |
| **Audit firm** | "Accept or reject the evidence; author the day-0 necessity statement"; takes no revenue share | Day-0: "what three questions would you ask … what would you need to see to rely on a record like this" (L9631–9633) | Run verifier air-gapped (day 77), reconcile (day 78), write verdict (day 80) | Pilot page / verifier |
| **Systems integrator / Platform OEM** | Deploy, author declarations, first-line support / embed under own brand | — | SI keeps 18% + delivery margin; OEM: "no elan1 mark appears at all" on an OEM console; only `X-Fusion-Contract` header survives (L13688–13692) | White-label theming |
| **Internal reviewers / pack factory** | Production-key reviewer; regulatory engineer; declaration owner; profile author; profile certifier (never the author) | — | Review 4 things only; certify profiles under dual control | Internal/admin tooling (spec) |

Built roles: "Five roles; auditors switch between client organisations" (L801–803). Named in text: **owner**, **admin** (emergency stop), **auditor**; the other two are not named in this document. Production-key review, profile certification and graduation approval imply additional role capabilities in the spec.

---

## 3. End-to-end user journeys (step by step)

### J1. Onboarding (built, PARTIAL)
1. `/signup` → create organisation (sign-in: argon2id, ≥12-char password, optional TOTP, lockout 1 min doubling to 1 h; OIDC SSO with DNS-verified domains, optional SSO-only) (L1212–1216).
2. `/onboarding` asks for **company, industry (7 industry packs) and regions**. Does *not* ask currency or time zone (contradicting the design brief; flagged) (L812–814, L2101–2105). Industry choice seeds a starter rulebook + frameworks (ISO 42001 + NIST AI RMF + region frameworks).
3. `/invite/[token]` for teammates. Design: 18 of 21 screens on code; password reset to build (L864–866).

### J2. Connect an agent / tools (built)
1. Agents → **Add-agent wizard** (`/agents/new`) issues an **MCP address and a key** (key shown once) (L1836–1837, L1242).
2. Connectors: enable Gmail / Zoho Books (demo data default; live mode never run against a real account) or add **"Your MCP servers"**: upstream behind Elan1 Govern, single auth header, SSRF guard, **new tools start switched off** with suggested risk tags (L760–766, L1224–1228).
3. Choose route: MCP proxy (governed run) vs REST `/v1/check` + `/v1/record` + `/v1/approvals/:id` or TS/Python SDK (check and record). UI must state the mode truthfully per route.
4. Spec developer path (not built): sandbox key → prove the three outcomes in sandbox (incl. a real refusal and a real escalation resolved by a real human) → production-key request with conformance result file, declaration version, target system, residency domain, named production owner → human review of four things → 2 working days (L4649–4661, L9724–9731).

### J3. Write the rulebook (built)
1. `/rulebooks/[slug]`: visual builder kept in sync with YAML; rules match tool or risk tag, conditions, count/sum quotas; `default: refuse` required (L722–728).
2. **Try an action** → **Test on past actions** (replay 7 or 30 days) → **diff** against prior version → **sign and publish** (every published version signed and verified on every call).
3. Rule suggestions arrive nightly (≥10 consistent approvals / 30 days) → open as draft or dismiss.
4. Not yet on code: dual control for publishing (L887).
5. Spec equivalent: declaration versions are integers, forward-only; "latest" is a rejection in production; loosening a gate needs a new version plus an ADR (L4782–4784).

### J4. Runtime and approvals (built)
1. Agent calls a tool → checks (key → paused? → signed rulebook valid → tool known/on → args valid) → rules → Allow / Ask a person / Refuse.
2. Ask a person → approval to web/e-mail/phone link/Slack/WhatsApp (chat only where approvable-in-chat and not a delete/access/production/personal-data/uncapped-payment) → approver decides → MCP route runs the tool → receipt. Unanswered after 24 h → refused (L731–741).
3. Spec flavour of the same: escalation creates an obligation with named resolver set and 4-hour expiry; approval is itself a governed write; resubmission commits; "Four proof entries for one business decision" (seq 4,099–4,101) (L3442–3448).
4. Not yet on code: backup-approver rerouting (L873–875).

### J5. Monitor, alert, stop (built, PARTIAL)
1. Today `/` (built; due-dates panel not yet), Activity `/activity` (receipts log).
2. Alerts `/alerts` from 6 detectors; optional auto-pause (off by default).
3. Emergency stop: type **STOP** → all agents paused, new calls refused, receipt + incident report. Incident record page to build (L913–915). Known gap: approvals waiting are not cancelled.

### J6. Evidence export (built: auditor pack; spec: bundle)
1. `/evidence`: sign checkpoint on demand; export **auditor pack** (zip + PDF summary + compliance map).
2. Spec export flow: choose range + profile → screen shows **record count, refusal count and unanchored head before anything is generated** → unresolved declaration stops export by name → residency gate → precondition requires a completed nightly integrity run (else "export the clean range instead") → "Export ready — 12,480 records, 611 refusals, 22 unanchored, profile in-mca-audit-trail v1" → **"Verify it yourself first. If it does not pass for you it will not pass for them."** Oversized export refused with suggested split; re-export byte-identical except timestamp; export itself is a governed write (L5091–5115).

### J7. Auditor verification (built: CLI; to build: web verifier)
1. Auditor (Auditor role, switches client organisations) or recipient gets the pack.
2. Obtains the key fingerprint **out of band** — built limit: the pack carries its own public key; claim holds only with `--key` or a compared fingerprint (L1041–1049).
3. Runs `govern verify` offline → exit 0/1/2. Spec: six exit codes; verifier from published release or built from source; run on air-gapped machine; run against the published tampered bundle "and watch it refuse"; six routes to check the verifier (L7132–7141).
4. Reconcile chain against the target system's own audit trail (spec: "a change in the target with no elan1 record is the finding that matters", L3903–3905).
5. The **web verifier** is listed as "to build" in the Developer portal/public-site area (L924–928).

### J8. Compliance (built)
1. `/compliance` → `/compliance/[framework]`: 10 frameworks, 13 controls, coverage from receipts, "Draft — needs legal review" on screen and in every export. Regime-specific profiles not yet on code (L908–910).
2. `/inventory`, `/inventory/[id]` AI systems register; `/assessments`, `/assessments/[id]` with second-person sign-off setting risk tier and review date.

### J9. 90-day pack pilot (spec; Motion three)
Day 0 auditor's half day (necessity statement → `not_measurable` rows) → Day 1 tenant upgrades L1→L2, boundary date + counts shown to customer and auditor same day → Days 2–75 normal operation, refusals not worked around → **Day 76 customer exports the bundle themselves, without help** → Day 77 auditor runs verifier air-gapped + tampered bundle → Day 78 two-way reconciliation vs ERPNext's audit trail → Day 80 auditor's written verdict (published internally verbatim) → Day 85 founder asks "would you pay for this on its own line?" (L9630–9676, L3893–3909).

### J10. Assurance upgrade L1→L2 (spec)
Seven preconditions, a named irreversible instant, rollback path, closing record; "success criterion … that it was boring"; signature from a named sequence onward; boundary date and counts each side rendered on screen (L3593–3598, L9869–9888).

### J11. Earned autonomy (spec, L3)
Proposal shows class, current/proposed level, counters, score (0–100), function version, sequence range, reversal plan and drill date, and an owner-written justification ("never pre-filled"); second approver sees "the numbers, not a recommendation"; 30-day supervised period, 1-in-10 sampled to a human; auto-revert below maintenance threshold; revocation = one person, one press (L6029–6068).

### J12. Erasure (spec)
Irreversible governed write; two named approvers; 72-hour clock; erasure plan shown before deletion; salt destroyed; failed job stays open (L6902–6910). Built: "erasure requests" absent (L2033).

### J13. Cross-organisation receipt (spec, L3)
Issue: separate governed write; issuance screen warns about volume disclosure "before the first receipt to a new audience" (L5786–5788). Receive: audience → expiry → key route (printed) → digest → signature → anchor (UNANCHORED reported not failed) → disclosures → replay → limits line. Accept: `receipt.accept` write, cross-boundary, dual control (L5707–5735).

### J14. Billing (spec, not built)
Invoice lines tie to `write_id` + sequence; refusals shown "412 refused, ₹0" on the same table as billed lines "with a control that opens the underlying records by write identifier and sequence"; never invoiced over an unreconciled period (L3629–3633, L13342–13346).

---

## 4. Feature / capability list by console area

13 built areas (R4 table, L859–936). "Four Doors" (Work · Records · Agents · Assurance) is **superseded by the 13 console areas** (L1852–1853, L1391). Console: 27 page routes, 53 API route handlers; 275 design screens, 113 on code (38 one-to-one, 75 merged), 26 to build next, 116 deferred, 17 built screens with no design (L843–857).

| # | Area (routes) | Features | Status |
|---|---|---|---|
| 1 | Sign-in & onboarding (`/login /signup /invite/[token] /onboarding`) | Password (argon2id, ≥12 chars), TOTP, lockout; OIDC SSO, DNS-verified domains, SSO-only; invites; onboarding: company, industry (7 packs), regions | BUILT (18/21 design screens) |
| | | Password reset | NEEDS LOGIC (to build) |
| | | Currency/time-zone at onboarding | ABSENT (brief asked for it) |
| | | SAML, SCIM | SPECIFIED/ABSENT (not built) |
| 2 | Today (`/`) | Home dashboard (demo org "Demo Traders Pvt Ltd") | BUILT (3/4) |
| | | Due-dates panel | NEEDS LOGIC |
| 3 | Approvals (`/approvals /approvals/[id] /approve/[token]`) | Web, signed single-use e-mail/phone links, Slack, WhatsApp; approvable-in-chat rules; 24 h expiry→refuse; password re-ask >10 min | BUILT (9/11) |
| | | Backup-approver rerouting | NEEDS LOGIC |
| | | Spec: approver sees diff, gate results, policy version; payload digest shown recorded | SPECIFIED (partially reflected) |
| 4 | Activity (`/activity`) | Receipt log per organisation (decisions, approvals, outcomes, admin changes) | BUILT (11/18) |
| | | Deferred record views | DESIGN ONLY |
| 5 | Agents (`/agents /agents/new /agents/[slug]`) | Add-agent wizard (MCP address + key), pause, per-agent rulebook | BUILT (9/10) |
| | | Agent map | DESIGN ONLY |
| | | Autonomy ladder A0–A5, graduation | SPECIFIED |
| 6 | Rulebooks (`/rulebooks /rulebooks/[slug]`) | Visual builder ↔ YAML, tool/risk-tag rules, conditions, quotas, versions, diff, Try an action, Test on past actions (7/30 d), sign & publish, rule suggestions | BUILT (21/23) |
| | | Dual control on publish | NEEDS LOGIC |
| | | Declaration (7 blocks), write types, G1–G9 gates, blast radius | SPECIFIED |
| 7 | Connectors (`/connectors`) | Gmail, Zoho Books (India DC; demo data), "Your MCP servers" (tools off by default, suggested tags, single header auth, SSRF guard) | BUILT / PARTIAL (6/6 screens; live never run) |
| | | Tool description pinning by hash | SPECIFIED (contradicted by code) |
| 8 | Evidence (`/evidence`) | Receipts, hourly + on-demand checkpoints, key rotation, auditor pack (zip + PDF + compliance map), `govern verify` | BUILT (8/10) |
| | | Spec bundle layout (8 members), six exit codes, zero-dep verifier | PARTIAL |
| | | RFC 3161 anchoring, KMS/HSM custody, Seal v6, verifier profiles, selective disclosure | SPECIFIED |
| 9–10 | Inventory, Assessments (`/inventory /inventory/[id] /assessments /assessments/[id]`) | AI system register; 3 assessment templates, deterministic explained scores, second-person sign-off sets risk tier & review date | BUILT (2/4; 2 assessment screens deferred; 5 built screens lack design) |
| 11 | Compliance (`/compliance /compliance/[framework]`) | 10 frameworks (EU AI Act, NIST AI RMF 1.0, ISO/IEC 42001, DPDP Act 2023, RBI FREE-AI, GDPR, HIPAA, SOC 2 (2017), Colorado AI Act, NYC LL 144), 13 controls, coverage from receipts, "Draft — needs legal review" | BUILT (6/11) |
| | | Regime-specific profiles (ledger1 etc.) | SPECIFIED |
| 12 | Alerts & emergency stop (`/alerts /alerts/[id]`) | 6 detectors, auto-pause (off by default), STOP | PARTIAL (4/6) |
| | | Incident record page; expire/block pending approvals on stop | NEEDS LOGIC |
| 13 | Settings (`/settings /settings/sso /settings/notifications`) | SSO, notifications, roles (5) | BUILT (15/18) |
| | | Sessions, preferences | NEEDS LOGIC |
| — | Developer portal; public site and portals | OpenAPI 3.1 (agent API), TS + Python SDKs, signed webhooks (HMAC + timestamp, 8 attempts), `govern` CLI, examples for LangChain, OpenAI Agents SDK, Claude, Cursor exist in repo | BUILT (code) but **0 of 88 design screens**; developer docs and **web verifier to build**; most public site deferred |
| — | Billing; assurance L1–L3 | Meter, plans, invoices, levels | SPECIFIED (0 of 39 screens; "Deferred: no meter, no levels") |
| — | System pages | 404, error boundary BUILT; 403, maintenance, offline to build | — |

Other SPECIFIED/ABSENT items the UI must not imply exist (E.1 addendum, L2016–2039): meter/billing/plans/invoices; assurance levels; RFC 3161; KMS/HSM; Seal v6 + vectors; second implementation; verifier profiles; selective disclosure; erasure requests; data residency; idempotency keys; durable workflow engine; DB row-level security; SAML/SCIM; upstream OAuth; in-process enforced mode; closed refusal-code register; multi-instance rate limiting; webhook outbox; any certification; any production deployment; live Gmail/Zoho runs.

Built gaps the UI should be honest about: allowed/approved MCP action runs before its receipt is written — a failed receipt write raises a **health alert** (L1128–1143); daily limits checked outside the chain lock (L1276–1277); upstream descriptions passed as-is (L1280–1281).

Spec-only screens/sentences explicitly named in the IM (good to design for): assurance screen showing mode per write type (L3514); export screen with counts + unanchored head (L5091–5101); anchoring-degraded banner "Anchoring degraded since 09:14 — 88 records unanchored" (L5268–5269); upgrade boundary display (L9636–9637); erasure plan (L6904–6906); graduation proposal (L6031–6035); counterparty register (L5654–5657); issuance warning (L5786–5788); disclosure export "you are revealing 3 of 11 committed fields" (L5892–5893); invoice with refusal line (L3629–3631); public status page "with chain integrity as its own component" (L9734–9736); public mapping table (L9153–9156).

---

## 5. Pricing and packaging (Appendix A, §14.5) — full detail

Caveats the pricing page must carry: **pre-revenue; every price is a modelled list price; no buyer has been quoted; "there is no published price list"** (L9826–9831, L13191–13199). The external L1 per-action price at GA "is not yet set"; agreed boundaries are floor ₹0.40 and ceiling ≈₹8.80 (Agentforce anchor) (L13434–13442). FX: ₹90 = US$1. 1 crore = 1,00,00,000; 1 lakh = 1,00,000.

### A.1 Platform floors and included allowances (per tenant per year)
| Level | Floor (₹) | US$ | Included governed actions / yr | Effective ₹/action at full inclusion |
|---|---|---|---|---|
| L1 Guarded | 1,80,000 | 2,000 | 4,80,000 | 0.375 |
| L2 Attested | 6,00,000 | 6,667 | 15,00,000 | 0.400 |
| L3 Proven | 24,00,000 | 26,667 | 42,00,000 | 0.571 |
| Sovereign / on-premises deployment | 1,20,00,000 per deployment per year | 1,33,333 | — | — |

### A.2 Per-action rates beyond allowance
| Route | ₹ / governed action | US$ | Note |
|---|---|---|---|
| L1 Guarded | 1.60 | 0.0178 | Modelled; external L1 price not set |
| L2 Attested | 1.20 | 0.0133 | |
| L3 Proven | 0.90 | 0.0100 | |
| Sovereign deployment | 0.55 | 0.0061 | Lowest rate; customer carries ops cost |
| Internal transfer to rung1 | 0.40 | 0.0044 | From 1 Jan 2027; reset quarterly vs measured cost |

Included rate rises with level while overage falls ("the opposite of a volume discount and is deliberate") (L9796–9798).

### A.3 Packs, evidence SKU, partners
| Line | Unit | ₹ | US$ |
|---|---|---|---|
| Regulatory pack (blended) | per tenant per year | 1,35,000 | 1,500 |
| Evidence bundle beyond allowance | each | 2,500 | 28 |
| Verifier profile | per regime per year | 3,00,000 | 3,333 |
| Counterparty verification seat (L3 shape) | per year | 45,000 | 500 |
| Partner certification | per firm per year | 1,50,000 | 1,667 |
| **Offline verifier** | — | **0, as source, to anyone, at every level, for ever** | — |
| **A refusal** | — | **0** | — |

Evidence has three shapes (bundle / profile — "the preferred shape" / seat). Open tension: spec says export unlimited and free; price book charges per bundle beyond allowance (L5548–5552, L13280–13288).

### A.4 Rules that travel with prices (UI must reflect)
- Refusals metered at quantity zero, never billed — DB constraint.
- **Floor not discountable by anybody.** elan1 lead may cut overage up to 20% below list for ≤12 months; founder unlimited and may change tier; nobody touches floor, meter basis or refusal price; **no discount on the evidence line at L2**; every discount has an end date; a pilot price names the list price it discounts (L13326–13332).
- List prices flat to March 2029, then +4% p.a.
- Partners keep **18% of list** on partner-sourced revenue (contra-revenue line).
- Every meter event carries `write_id` + sequence; a line without one cannot be invoiced; if two meters disagree, invoice at the lower number, difference is a named open item with owner and date.
- **No per-seat price and no outcome price, anywhere, at any level** (L13348–13353).
- The meter basis derives from blast radius and is never configurable per customer (L3616–3620).

### Modelled deal sizes (L7460–7476, L7619–7642)
- Entry, L1 + one pack: ₹3,15,000/yr (US$3,500); typical L1 year one ₹3–10 lakh.
- Mid-market L2, 3M actions, 1 pack, 1 profile: ₹28,35,000 (US$31,500); typical L2 ₹25–40 lakh.
- Large regulated L3, 10M actions, 2 packs, 2 profiles, 20 seats: ₹93,90,000 (US$1.04M); typical L3 ₹90 lakh–₹1.2 crore incl. sovereign.
- Sovereign: ₹1.20 crore before volume.
- Blended external revenue per paying tenant Mar 2031: ₹40.2 lakh (US$44,700).

### Revenue lines (₹ crore, FY2028-29 / FY2029-30 / FY2030-31; A.5)
Platform licence 2.37 / 9.05 / 23.55 · Governed actions external 11.96 / 58.70 / 176.98 · Internal (rung1) 2.18 / 5.58 / 11.20 · Evidence SKU 1.09 / 6.32 / 17.84 · Regulatory packs 0.83 / 3.24 / 7.63 · Sovereign 0.00 / 2.46 / 9.46 · Partner certification 0.26 / 0.75 / 1.69 · Channel margin (contra) −0.61 / −4.93 / −18.04 · **Total 18.08 / 81.18 / 230.32**.

### Competitive price anchors (A.6)
Microsoft Agent 365 US$15/user/month (or in M365 E7); Salesforce Agentforce US$0.10/action (≈₹8.80); ServiceNow AI Control Tower free for one year (bundle valued US$2M).

### Revision-supplement switches (R16, all off by default)
Governance-layer add-on ₹90,000/yr per tenant (attach 5%→20%); reads metered at ₹0.10 (half of allowed reads, two reads per write; refusals free); read runtime cost = half a write. Read metering is undecided (DR-015) (L2297–2321).

### Implications for UI
- **Pricing page**: three assurance-level cards (L1 Guarded / L2 Attested / L3 Proven) + Sovereign deployment; add-ons (regulatory pack, verifier profile, counterparty seat, evidence bundle); "Verifier — free, forever, to anyone"; "Refusals — ₹0"; no seats, no "Pro/Plus/Premium/Enterprise"; INR primary with optional USD; "modelled / not yet published" disclosure while pre-revenue.
- **Billing/meter screen**: platform floor, included allowance used vs remaining, overage at level rate, refusal count at ₹0 on the same table, drill-through by `write_id`/sequence, reconciliation status (never invoice an unreconciled period), discount with end date, partner-sourced flag. Note meter/billing are SPECIFIED only.

---

## 6. Competition

### 6.1 The map and scoring rule
- Axis 1: position relative to the action (assessment & documentation ↔ runtime enforcement); Axis 2: model-centric ↔ business-action-centric. "The tell is always the data model" (L7737–7747).
- Four quadrants: Documentation × model-centric; Enforcement × model-centric; Enforcement × action-centric single-vendor; **Enforcement × action-centric, portable, with a record a stranger can check — "Empty. Including our row."** (L7837–7852). ~262 vendors surveyed (L2558).
- Scoring rule (DR-010, "designed is not shipped"): YES only if running in a customer's production tenant and publicly evidenced; Partial = narrow slice or not the load-bearing part; No = absent, announced, roadmap, datasheet, or built but not in production. Scores as at 20 Sep 2026, UNVERIFIED unless marked (L7855–7874).
- Four matrix columns: **Stops a business write at runtime · Per-action record of the write · Independently checkable · Refusal recorded as evidence** (L7897–7900).
- R12 adds four governance-layer columns: AI inventory · Risk/impact assessment with sign-off · Framework/policy library · Coverage counted from runtime decision records (L1757–1761).

### 6.2 Every named competitor
Matrix cells are given as Stops / Record / Independently checkable / Refusal-as-evidence.

| Vendor | Quadrant | Central object / what they do | Matrix score | Funding / notes | Elan1 wins / loses |
|---|---|---|---|---|---|
| Credo AI | Doc × model | use case / model; governance platform; "Agent Governor" Research Preview (27 Oct 2026) | No/No/No/No; gov-layer: inventory Yes, assessment Yes, library Yes ("20+ standards"), coverage-from-runtime Not stated | Funding behind paid DBs; Forrester AI wave Q3 2025 leader (with IBM) | Wins: runtime receipts. Loses: governance layer ships to customers today |
| Trustible | Doc × model | use case / regulation | No ×4; gov-layer Yes ×3 (UNVERIFIED), coverage No | Seed US$4.6M Jun 2025 | Same as above |
| Holistic AI | Doc × model | model risk; risk, bias, EU AI Act mapping | No ×4 | ≈US$35M (low confidence); Gartner MQ sole Challenger; **do not confuse with "H Company" (Paris, ≈US$200M)** | — |
| Saidot | Doc × model | use case / policy | No ×4 | not asserted | — |
| Cranium | Doc × model | AI asset inventory | No ×4 | Series A US$25M Nov 2023 (total ≈US$32M UNVERIFIED) | — |
| Relyance | Doc × model | data flow | No ×4 | not asserted | — |
| Truyo | Doc × model | use case / privacy request | No ×4 | Gartner MQ Leader | — |
| OneTrust | Doc × model | policy / data asset | No ×4 | valuation last verified 2021 | — |
| Vanta | Doc × model | control evidence | No ×4 | Series D US$150M at US$4.15B; US$300M ARR, 16,000+ customers — proof the "prove you are compliant" budget pays | Elan1 produces evidence of enforcement, per action |
| Drata | Doc × model | control / agent; AI Agent Governance = "monitoring, not enforcement" | No ×4 | not asserted | — |
| IBM watsonx.governance | Doc × model | model | No ×4 | MQ Leader; Forrester leader | — |
| Monitaur | Doc × model (closest language) | model + control evidence; "policy-to-proof workflows with cryptographic audit logs" | No / **Partial** (evidence about a model) / No / No | ≈US$13M total (Series A US$6M 2024); Gartner Visionary; "highest narrative threat", not architectural | Enforces nothing; evidence about a model not a business write |
| ModelOp (with Kong) | Doc × model / Enf × model | model | No ×4 | not asserted | — |
| Norm Ai | Doc × model | "Regulation as code, without a write path" | — | Series C US$120M at US$1.2B (7 Jul 2026); earlier US$48M Series B | — |
| Patronus AI | Doc × model | "pure-governance anchor"; evaluation | No ×4 (trace/eval row) | Series B US$50M (total US$70.5M) | — |
| anecdotes | (compliance) | — | — | Series B US$55M (total US$85M) | — |
| Sprinto | (compliance automation, India) | automated evidence collection | — | Series B US$20M (total US$31.5M); ≈US$20M ARR | Budget proof; enforces nothing |
| Scrut Automation | (compliance) | — | — | funding not confirmed | — |
| Zenity | Enf × model | agent security | **Partial** (blocks agent behaviours)/No/No/No | US$125M Series C 3 Aug 2026 | No business-write record |
| Noma Security | Enf × model | agent / AI runtime | Partial/No/No/No | US$100M Series B (total US$132M) | "the record is a trace" |
| WitnessAI | Enf × model | AI interaction (network) | Partial (network layer)/No/No/No | US$58M Series B (total US$85.5M) | — |
| Straiker | Enf × model | agent runtime | Partial/No/No/No | US$64M Series A | — |
| HiddenLayer | Enf × model | model / agent harness | Partial/No/No/No | US$100M Series B (total US$186M) | — |
| Airia | Enf × model (agent gateway) | agent | Partial (agent gateway)/No/No/No | US$100M growth | R12: meets Elan1 now that it governs every tool call |
| Fiddler AI | Enf × model | model interaction | Partial (policy at execution)/No — traces/No/No | US$30M Series C | — |
| Lakera | Enf × model (on map) | — | — | acquired by Check Point ≈US$300M (contested vs US$202M) | — |
| Arize · Braintrust · Patronus · Arthur | trace / evaluation | trace / evaluation | No ×4 | — | — |
| Microsoft Agent 365 | Enf × model (identity) | agent identity; discovery via Defender/Intune; runtime blocking of coding agents; "audit-ready evidence generation"; GA 1 May 2026, US$15/user/mo | Partial / No — audit logs / No / No | platform | Partial on non-Microsoft agents; evidence attested by Microsoft. Threat #1 in "what would end it" |
| AWS Bedrock Guardrails / AgentCore | Enf × model | model call / tool access | Partial (inside AWS account)/No/No/No | platform | "stops outside the AWS account boundary" |
| Google Model Armor / Agentspace | Enf × model | prompt / response | Partial/No/No/No | platform | — |
| Boomi Agent Control Tower | Enf × model (integration) | registry, guardrails, kill switch; 75,000+ agents | Partial / No — observability and audit logs / No / No | platform | "most likely to be mistaken for us"; signs nothing |
| Kong AI Gateway / Agent Gateway | Enf × model | API call | Partial (at gateway)/No/No/No | — | gateway competition (R12) |
| UiPath | Enf (automation) | automation run | Partial UNVERIFIED / No / No / No | — | — |
| Palantir AIP | Enf × action, single-vendor | the action, inside Foundry | **Yes** (Foundry objects) / **Yes** (Foundry) / No / Partial | platform | "proves the design is right"; single estate, not portable or third-party verifiable |
| ServiceNow AI Control Tower | Enf × action, single-vendor | agent / workflow; kill switch; 30+ integrations (SAP, Oracle, Workday); free 1 yr | Partial (inside ServiceNow) / Partial (workflow records) / No / No | MQ Leader; US$11.6B 2025 M&A (Armis, Moveworks, Veza) | "single largest threat in the portfolio" |
| SAP Agent Hub | Enf × action, single-vendor | agent | Partial (inside SAP) / Partial (SAP's own document trail) / No / No | MQ Niche Player | "existential scenario" if SAP ships signed write-path gating |
| Salesforce Agentforce Operations | Enf × action, single-vendor | agent action in Salesforce; "permanent audit trail … against workflow blueprints"; US$0.10/action | Partial / Partial / No / No | platform | evidence lives inside Salesforce |
| **Elan1 Govern — in production** | (claims the empty quadrant) | the agent tool call | **No / No / No / No** — no customer tenant | — | "we have the design and nobody's books" |
| **Elan1 Govern — in code (22388ad)** | — | tool call, reads and writes, vs signed rulebook | Partial (governed run on MCP) / YES IN CODE / Partial (offline verifier, vendor-held key, key travels in pack, no timestamp, one impl) / YES IN CODE; gov-layer BUILT ×4 (coverage = receipt counts) | — | Only distinctive gov-layer cell: coverage counted from the same signed receipts; "narrow … and an unproven one" |

Adjacent / non-competitor parties named:
- **Identity (compose, never compete)**: Microsoft Entra Agent ID; Okta / Auth0 "Auth for MCP" + Okta MCP server ("Okta answers may this agent call this tool; we answer … does this write require a human, and what proof exists afterward"); SPIFFE/SPIRE; KYA-OS (Vouched → DIF) (L8608–8655).
- **Policy engines**: Open Policy Agent "signs the policy bundle, not the decision" (L3031–3033, L8034–8036).
- **Receipt formats**: IETF draft `draft-marques-asqav-compliance-receipts-08` (31 Aug 2026, expires 4 Mar 2027); agentreceipts.ai, RCPT Protocol, PipeLab, Provenant; Notarized Agents paper (arXiv 2606.04193); feature requests at LangGraph, Microsoft AutoGen, ByteDance deer-flow (L6318–6338).
- **Standards precedents**: SCITT RFC 9943, COSE Receipts RFC 9942, SD-JWT RFC 9901, Sigstore/Rekor v2, in-toto/SLSA, C2PA (conformance programme as precedent) (L8704–8766).
- **Payment rails** (rival definitions of an authorised action): AP2 (Google), ACP (Stripe/OpenAI/Meta), x402, Visa TAP, Mastercard Agent Pay (L8658–8701).
- **Open-source host threat (Class B)**: Frappe (~30,000 sites, owns permissions model, ships agent tooling) (L8442–8446).
- **Certified competitor**: Crator holds SOC 2 since Apr 2026 [unverified] (L6983).
- **Exits (underwriting floor 4×–10×)**: CalypsoAI→F5 US$180M; Protect AI→Palo Alto US$500–700M; Robust Intelligence→Cisco ≈US$400M; Lakera→Check Point ≈US$300M; plus W&B→CoreWeave, Statsig→OpenAI, Prompt Security→SentinelOne, Galileo→Cisco, Langfuse→ClickHouse, Promptfoo→OpenAI, Humanloop→Anthropic, Aim→Cato, Invariant Labs→Snyk, Apex→Tenable, Onum→CrowdStrike (L8300–8322).
- Analyst framing: Gartner AI Governance Platform MQ (June 2026): 13 met criteria; **zero inclusion criteria require independently verifiable evidence**; Leaders IBM, ServiceNow, Truyo. A circulating Forrester chart is the GRC Wave, not AI governance (L8052–8068).

### 6.3 Where Elan1 wins / loses (positioning lines)
- Wins (claimed, specification-level): single writer closes the suppression attack; per-decision signed chained receipts; offline verification by a party who distrusts the vendor; refusals recorded as carefully as allows; cross-vendor (governs writes into SAP, Oracle EBS, Temenos, Finacle, Tally — none of the platforms does) (L8205–8211); never per-seat; enters via ERP/audit budget.
- Loses: nothing in production; no certification; behind on governance layer; widened scope (every tool call) puts it against gateways and documentation platforms "on breadth" (L1569–1578, L2216).

### 6.4 "What would end it"
- §12.7 closures: (1) Microsoft extends Agent 365 evidence to cross-platform business writes with an independently verifiable receipt; (2) ServiceNow gains approvals/write operations into systems of record it does not own ("if it extends … we are a feature"); (3) SAP or Oracle ship native write-path approval gating with signed evidence ("existential"); (4) any two of Microsoft, ServiceNow, SAP, Boomi make governance an included capability (L8213–8240).
- §1.9: an auditor tests an L2 bundle and declines to rely on it; measured cost per action does not fall; a platform ships cross-system write-path enforcement with external verifiable evidence; plus DPDP erasure vs hash chain (legal) (L2663–2678).
- §13.11: agents never get write access at scale; the platform absorbs the kernel; auditors/regulators/courts keep accepting ordinary logs (L9273–9340).
- Watch list classes: A incumbent bundling (10 rows), B open-source host moves up (9), C price collapse (6; trigger: any vendor prices a governed business action below ₹4; own cost > transfer price two months), D regulator/standard changes (7) (L8432–8463).

---

## 7. GTM motions and the surfaces each needs

Four motions (§14, L9385–9392); "Motion two is the one that decides whether this is a company."

| Motion | What it is | Gate it must clear | Surfaces it needs |
|---|---|---|---|
| 1. Captive first consumer | rung1 Enterprise consumes the kernel; ₹0.40 per committed action from 1 Jan 2027; 60k / 120k / 180k actions Jan–Mar 2027 | "The meter reconciles" — clean two-way reconciliation across a full month, first invoice 31 Jan 2027 | Meter + reconciliation view; internal invoice; "Checked and recorded by the elan1 layer" proof label and "rung1 · by elan1" footer inside rung1 screens (L13694–13707) |
| 2. CA & audit-firm channel | CA firms, audit firms, SIs, platform OEMs; certification Introducer / Implementer / Verifier (Verifier only from L2, Apr 2028); 18% of list; partners 6→28→70→140 | Channel falsifier: after 20 CA conversations, <3 agree to introduce a client ⇒ falsified | **Multi-client console** (Auditor role switching organisations — BUILT); partner certification status + claim-boundary training per level; partner-sourced attribution; referral/introduction flow; client roster; read-the-report view for CAs; white-label OEM theming with no elan1 mark |
| 3. Direct enterprise / 90-day pack pilot | ledger1 (MCA) first, then invoice1, collect1 | Day-80 auditor verdict; Day-85 "would you pay … on its own line?" | **Pilot page / pilot tracker** (day 0→85 timeline, necessity statement, `not_measurable` rows, L1→L2 boundary display, self-serve export at day 76, verdict capture); regime-specific compliance/profile view; evidence export |
| 4. Third parties over MCP | Advisory by default; sandbox self-serve; production key reviewed | Bypass proof (30 days + every other path failing); kill criterion 30 Jun 2027 (proposed reword: "against the Elan1 Govern agent API (MCP or REST)") | **Developer portal** (0 of 88 screens built): docs, OpenAPI, SDKs, CLI, examples (LangChain, OpenAI Agents SDK, Claude, Cursor), sandbox signup, production-key request, conformance suite, **public status page with chain integrity component**, published incident process, 12-month sunset/deprecation notices to a named human, **web verifier** |

Other public surfaces implied:
- **Public verifier page / verifier release page**: binaries, source, checksums, release signature, build instructions, vectors, deliberately tampered bundle; superseded releases with dated note (L5179–5192); licences CC BY 4.0 / Apache-2.0 / CC0 (L6220–6225).
- **Action Receipt spec site**: spec text, conformance levels, suite registry (`elan1-seal-v6`, `rfc3161-6962`, `elan1-sd-v1`), errata, public comment (60 days), defect reports with no account (ack within 5 working days) (L6229–6236, L6584–6590).
- **Public mapping table**: Action Receipt field → EU AI Act Art. 12/14/19/26 → NIST → ISO 42001 Annex A → DPDP → MCA Rule 3(1) → SEBI ("That table is the product's credibility") (L9153–9156).
- **Pricing page**, **sub-processor list**, **privacy notice**, **DPA** (gate for letting outsiders log in, L6742–6753).
- International: India first (only India through FY2027-28); GCC & Singapore (sovereign deployments) from FY2028-29; EU via a customer/notified body; US last (L9903–9956) → INR-first, residency (ap-south-1 Mumbai) messaging.

Self-serve: "Multi-industry onboarding implies a direct self-serve motion that the plan does not contain. It is not added to the plan in this edition." (L1844–1845) — the built signup exists, but GTM does not plan for it.

---

## 8. Copy and wording rules the UI must obey

### 8.1 Claim boundary
- **The three-sentence claim** (regulator-facing): single governed path where rules/gates decide, a human approves what must be approved, refusals recorded as carefully as successes; every decision produces an append-only hash-chained record (signed + anchored at L2); a reviewer can verify offline with software they did not get from us (L7072–7084).
- **Current L1 sentence (PROPOSED, unsigned replacement)**: "At L1, Elan1 Govern decides whether a tool call is allowed before it runs. On its MCP route it holds the call for a named person where the rulebook requires it and refuses anything not explicitly allowed; on its SDK and REST routes it advises and records, and the agent acts. It records each decision … in a per-organisation hash chain, signed with a key Elan1 Govern holds, with hourly signed checkpoints. The record is tamper-evident. It is not yet anchored to an external time source, and not yet verifiable by a party who does not trust us." (L1186–1193)
- **Mode wording (PROPOSED)**: "Blocks", "prevents", "cannot happen without approval" only of the **governed run on the MCP proxy, for tools whose credentials Elan1 Govern holds**. For check and record: "every proposed action was evaluated against a signed rulebook and the decision is recorded" (L1118–1123). Spec equivalents: Enforced "this write could not have occurred without passing the gates"; Advisory "every attempt is evaluated and recorded, including the ones we refused" (L4663–4668). Writing "enforced" about an advisory integration "is the one claim that would end a first enterprise deal" (L9713–9715).
- **External verification**: hold any external verification claim until the founder decides whether §7.3 applies; until then receipts are "signed and internally verifiable" (L1066–1070).
- **Limits handed over unprompted**: does not claim the transaction was genuine; that rules were adequate; that books are verified; that elan1 is certified/accredited/approved; that any regulator accepted it; tamper-proof/immutable/court-ready/admissible; that an anchor proves when something happened; that elan1 cannot see customer data; that an agent is safe because it earned autonomy (L7088–7112).
- Certifications: "we hold X, covering Y, issued on Z", nothing else; no certification logo beside an assurance-level claim (L7053–7055). Currently: no SOC 2, ISO 27001, ISO 42001, or NIST assessment.
- Compliance/framework content always labelled **"Draft — needs legal review"** on screen and in every export (L1653–1654).
- Industry packs for HR & recruiting and Healthcare are "starter configurations" only — "not a claim of compliance" (L1622–1626).
- Never describe an auditor conversation as validation; no auditor logos/quotes/endorsements (L9550–9555).
- Precedent copy: "precedent is not prediction and earned autonomy is not a safety argument" (L6108–6110); approver screens show numbers, never "we suggest approving" (L6033–6035).
- Selective disclosure: "we cannot see your data" may not be said (L5886–5887).

### 8.2 Banned words / sentences
- **Permanently, every level**: "tamper-proof", "immutable", "court-ready", "legally admissible", "certified", "approved by a regulator", "your books are verified" (L6196–6198); "we are certified, accredited or approved" (before a dated certificate); "we cannot see customer data"; any "regulator X has accepted/approved/endorsed/reviewed this", incl. "we are in conversation with regulator X" (L7115–7121).
- **At L1**: "signed" (proposed to be lifted by DR-017 for the built product), "tamper-proof", "immutable", "court-ready", "independently verifiable"; "platform" / "AI platform" of elan1 at L1 (L13681–13684). Conformance test C14 fails the build on "signed", "tamper-proof", "independently verifiable" in rendered copy at L1 (L4354–4357).
- **Of MCP/HTTP integrations (advisory)**: "prevented", "blocked", "cannot"; "we block", "we prevent", "nothing gets through without us"; "enforced" of any advisory deployment (L3510–3513, L13684–13685).
- **Everywhere**: "leverage", "robust", "seamless", "enterprise-grade", "best-in-class"; "powered by" in any endorsement (L13685–13686).
- **In product/tier names**: "Pro", "Plus", "Premium", "Enterprise" (rung1 Enterprise is a flagged contradiction) (L13673–13675, L13725–13733).
- "governance" in any rung1 or stack1 document (DR-009).
- "open" (standard) → say "published" until three independent implementations exist (L6241, L6192–6193).
- "gate" (repo code name: `@gate/*`, gate-signature webhook header, `gk_` keys) **must not appear in customer copy** (L1926–1930). Note the auditor pack's internal format string `gate-evidence-bundle/1`.
- "Pack" never alone — "regulatory pack" or "industry pack" (L2255–2256).
- "Guardrail" in the elan1 sense is rung 5, not prompt filtering (L15707–15710).
- "Validation" of auditor conversations; "traction" for internal rung1 revenue (L13768–13772).

### 8.3 Naming, case, grammar
- **"Elan1 Govern"** — written exactly so, capital E (DR-014 amends the lowercase rule for this product name only) (L1916–1918, L1962–1964).
- **elan1** (entity/brand), **rung1**, **stack1**, **verna1**, packs **ledger1 / invoice1 / collect1** — always lowercase, even at sentence start; rewrite the sentence rather than capitalise (L13676–13678). Retired all-caps forms (ELAN1, CORE1, REV1, GTM1) "do not come back as a styling choice" (L13634).
- Product lines: `<brand> <Line>` (e.g., "rung1 Enterprise"). Pack ids match `^[a-z][a-z0-9]{2,15}1$`. Industry packs are descriptive labels, never *1 names.
- Assurance levels: **L1 Guarded, L2 Attested, L3 Proven**; autonomy **A0–A5** ("autonomy L3" means A3 — never use L for autonomy); planes P0–P8.
- Retired names never to appear: core1, rev1, gtm1, commerce1, fusion1 (contracts `fusion.*/v1` kept), "Governed Intelligence Platform"/GIP, "Governed Action Model"/GAM, LOM, start1, run1, academy1, sovereign1; unknown names sales1, market1, people1, finance1, insight1 (L13604–13652).
- Endorsement placement: inside rung1 screens elan1 appears only as "Checked and recorded by the elan1 layer" and "rung1 · by elan1"; at L2 endorsement "flips to the front" on exports; OEM consoles show no elan1 mark (only `X-Fusion-Contract` header) (L13688–13707).
- Language: the IM is written in **British English** (organisation, licence, authorise, programme, recognise) and Indian numbering (lakh/crore, ₹1,80,000). **"Built on Claude" does not appear in the IM**; the only Claude references are SDK examples ("examples for LangChain, the OpenAI Agents SDK, Claude and Cursor", L808–809) and competitor context. Any "Built on Claude" rule must come from another source.
- Marketing posture: honest-by-construction; "nothing is claimed that a verifier cannot demonstrate"; every sentence maps "to a verifier exit code, a named artefact or a dated document" (L7067–7070).
- Refusals are a "product surface, designed once and rendered from the declaration" (L3231–3232); show the failing values and next actions, never a 4xx-style error.

---

## 9. Key numbers for realistic demo data

**Worked example (spec §4.4)**: Rekha (accounts executive, mid-sized manufacturer on hosted ERPNext); A4 on `erp.payment_entry.submit`, declaration `erp.ar` v7, policy v11, blast radius one counterparty; gates consent, residency (Mumbai), retention, counterparty, precondition; result "Payment recorded · proof #4,097" + "Reverse this" 30 days. Agent `ar-agent` at A3 proposes sales invoice for **ACME Textiles ₹4,20,000** vs credit limit **₹3,00,000** → `GATE.PRECONDITION_FAILED`, seq 4,098, meter 0, "Not done — credit limit". At ₹2,40,000 with A2 → escalation seq 4,099, approval 4,100, commit 4,101; escalation expiry 4 h.

**Built demo**: organisation "Demo Traders Pvt Ltd" (seeded); Gmail + Zoho Books accounts-payable flow; 7 industry packs; 8 risk tags; 10 frameworks; 13 controls; 3 assessment templates; 6 alert detectors (3 can raise high severity); 5 roles; approvals expire 24 h; password re-ask after 10 min; rule suggestions ≥10 approvals / 30 days; replay 7 or 30 days; replay store retention 30 days; checkpoints hourly; webhooks up to 8 attempts; lockout 1 min → 1 h; password ≥12 chars; 27 page routes, 53 API handlers; 275 design screens / 113 on code; 397/398 unit tests, 40/40 Python SDK tests; "580 automated tests" UNVERIFIED; 23 Playwright tests; 47 commits in ≈15.5 h; ≈33,600 lines; 400 files.

**Spec sentences / counters for UI states**: "412 refused, ₹0"; "Export ready — 12,480 records, 611 refusals, 22 unanchored, profile in-mca-audit-trail v1"; "Anchoring degraded since 09:14 — 88 records unanchored"; "you are revealing 3 of 11 committed fields"; receipt 41,288 (Mar) → 58,100 (Apr) ≈16,800 writes; chain 4,000 of 4,200 truncation example; key id `k_in_20270401_9c3a`; org id `ar-org:acmetextiles.example`.

**Timings/limits (spec)**: single-use credential 10 min; rollback window 30 days; latency p50 ≤120 ms / p99 ≤450 ms end-to-end target; kernel ≈64 ms p50 (alt ≈91 ms, unreconciled); per-rung budget 4/8/12/8/18/12/2 ms; sandbox+live apply ≤1,200 ms p95; end-to-end ≤2 s p95 (all modelled); anchor interval ≤15 min; tokens ≈2,880/month per authority continuous, ≈5,760 for pair; sandbox 10 writes/min, 2 concurrent, provisioning <60 s; production key review 2 working days; promotion to enforced ≥30 days; key rotation 12 months (successor 30 days ahead) — security baseline elsewhere says 90-day rotation (inconsistency); compromise notice within 24 h; emergency security change notified within 30 min; deprecation: new refusal code 60 days external, new KernelPort major 12 months; erasure 72-hour clock, 2 approvers; retention: proof records 7 years, bundles 24 months (WORM, India), security logs ≥1 yr (180 days India min), app logs 180 days, DB snapshots 30 days; MCA preservation 8 years; RBI draft 10 years; CERT-In 6-hour reporting; defect reports acknowledged within 5 working days; public comment 60 days.

**Evidence sizes (modelled)**: ≈640 bytes/record at L2; anchor file ≈6 KB + ≈1 KB per record; ≈150 MB per 100k-record year; inclusion path 320 octets for 1,024-record batch; genesis preimage 329 octets; 64 test vectors (28 negative).

**Registers and counts**: 43 refusal codes (14/19/10), 28 active at L1, +6 at L3; 9 gates (6 never skippable); 6 autonomy levels; 9 rungs (+0b stop); 16 seal fields; 8 bundle members (+1 at L3); 6 verifier exit codes (spec) vs 3 (built); 14 conformance tests; 12 profile-conformance tests; 8 pack acceptance tests; 5 pack admission gates (G-A…G-E); 6 named pack rejections (agri1, legal1, energy1, public1, edu1, retail1); MCP catalogue 34 tools (18 read-only, 10 staging, 6 act); 8 HTTP endpoint families; 3 token classes; precedent 11 counters, 180-day window, 90-day min, ≥200 records/≥100 approvals, score 0–100, supervised 30 days at 1-in-10; collect1 14 gates (7 pre-dial, 5 in-call, 2 after); ledger1 write types: `sales_invoice.submit`, `sales_invoice.cancel`, `purchase_invoice.submit`, `payment_entry.submit`, `journal_entry.submit`, `customer.update`; dual control above ₹2 lakh; ledger1 gate order consent, residency, retention, counterparty, precondition, dual control, budget; profile `in-mca-audit-trail` v1 (4 clauses, 6 checks, rule-as-at 1 Apr 2023, min assurance level 2).

**Plan / model (all MODELLED)**: L1 GA Q2 CY2027; first external paying tenant Jul 2027; ledger1 live Oct 2027; L2 GA Apr 2028; invoice1 Apr 2028; collect1 Oct 2028; first sovereign Jul 2029; L3 entry Oct 2029. Tenants 0 / 39 / 148 / 312 / 545 (Mar 2027–Mar 2031); mix Mar 2031 279 L1 / 211 L2 / 55 L3; Mar 2030 186/110/16; Mar 2029 109/39; sovereign 4 then 11; partner firms 6/28/70/140. Revenue ₹ crore 0.01 / 1.89 / 18.08 / 81.18 / 230.32; gross margin n/m / 11.4% / 62.2% / 79.6% / 86.0%; EBITDA −4.48 / −26.73 / −50.73 / −46.48 / +22.58; exit ARR 0.09 / 5.02 / 33.68 / 133.04 / 334.23; headcount 27 / 95 / 170 / 243 / 305. Governed actions 26.32M (FY2027-28) → 2,491.46M (FY2030-31) (≈4.6M per tenant/yr). Cost per action ₹3.039 → ₹0.636 → ₹0.129; revenue per action ₹0.400 → ₹0.924. Round ₹180 crore (US$20M) in tranches ₹63 cr (Mar 2027), ₹72 cr (Oct 2028, Gate A: 84 tenants), ₹45 cr (Jul 2029, Gate B: 186 tenants, ₹48.14 cr ARR) + ₹8 cr bridge.

**Market facts usable in marketing copy (PUBLISHED)**: CSA/Token Apr 2026 — 65% had an agent-caused incident, 63% cannot enforce purpose limits, 60% cannot terminate a misbehaving agent, 67% lack evidence-quality audit trails; RBI FREE-AI 18% maintain audit logs; MCA rule ~1.85M active companies (1,850,932); director penalties ₹50,000–₹5,00,000 and up to 1 year; DPDP main obligations 13 May 2027, penalties to ₹250 crore; EU AI Act high-risk 2 Dec 2027; MCP registry 31,309 unique servers, 22.6% no source repo; 82% of 2,614 MCP implementations vulnerable to path traversal; Gartner >40% agentic projects cancelled by end-2027; India TAM ₹3,600–24,000 crore (central ₹11,250 crore, MODELLED).
