# elan1 Phase 1 console: screen spec (source of truth for UI design)

Sources read in full: E01 Scope Freeze, E02 Kernel/Layer Contract v1, E03 Declaration Spec v1 (the elan1 Ontology), E04 Right Path Runtime Flow Book, E05 MCP and SDK Interface Spec, E06 Console and Approval UX Flow Book, E07 Assurance Level Definition, E08 Competitive Matrix v3, the eight Phase 1 briefs (01–08 .md), *The Four Doors, re-scoped* (v2.0, 23 Sep 2026) and *The Channel Block* (Declaration block 7). The UI contract is `/home/claude/elan1/CONTRACT.md`.

How to read this file:
- Text in "double quotes" followed by a source tag such as (E06 §03) is **verbatim copy from the documents**. Use it as written.
- Text marked **PROPOSED** is this analyst's suggestion to fill a gap. The documents don't specify it.
- Every screen is at **Assurance Level 1 (L1 Guarded)** unless it's marked [L2] or [L3]. The L1 honesty rules in §5 override anything else here.
- Where documents disagree, the later dated one wins: the Four Doors re-scope (23 Sep) beats E06 (21 Sep) on where things go. Every conflict is listed in §7.

---

## 1. Vocabulary: words the UI must use exactly as written

### 1.1 Product nouns

| Term | Meaning (source) | UI usage rule |
|---|---|---|
| **elan1** | The governance kernel: nine rungs, proof and meter, reached through KernelPort, MCP and SDK (Four Doors §04) | Always lower case, including at the start of a sentence |
| **governed write** / **governed action** | One change to a system of record that climbs every rung and leaves one record. "The billable atom is the governed action, which is the same object the auditor reads" (E03 §08) | Use "governed write" on screens. Use "governed action" only on pricing |
| **write intent** | "A request, never a permission" (E02 §03). A model may compose one | Shown as "Proposed" or "Proposal" on Work screens |
| **write type** | `<slug>.<verb>` descriptor, e.g. `sales_invoice.submit` (E03) or `erp.sales_invoice.submit` (E04, E07). Carries label, intent, blast radius, dual control, gates, reversal plan or irreversible flag | Show the **label** ("Submit invoice") as the main text and the machine name in mono as secondary text |
| **decision** | The immutable result of `assert`: disposition `allow` \| `refuse` \| `escalate`. "There is no fourth" (E02) | Never show a "warning" outcome. I6: "No warn" |
| **obligation** | Created at rung 6 on escalate. Holds the write_id, the autonomy level that triggered it, an expiry and the resolver set, and "the ladder stops" (E04 rung 6) | The unit in the Approvals queue. Shown as "waiting on a person" |
| **resolver set** | The humans who may resolve an obligation. "Resolver sets contain humans only" (E06 dec. 8) | The Send to control lists people only |
| **approval** | "An approval is itself a governed write. It is not a flag." Decision `approve` \| `decline`. `basis` = surface plan version plus rendered payload digest (E02 §03) | Buttons read **Approve** and **Reject**. The declined outcome is `POLICY.APPROVAL_DECLINED` |
| **refusal** | A governed outcome: HTTP 200, a typed code, a full record, metered at zero | On screen: **Not done — {plain reason}** |
| **rejection** | A malformed request (4xx). Nothing entered the kernel and nothing was recorded | Never call a refusal a "rejection" or an "error" |
| **platform failure** | "We failed" (E02 §04). PLATFORM.* code, pages, not billed | Blunt copy (see §1.7) |
| **escalate** | "The honest version of warn: a human decides and the write does not proceed until they do" (E01 §07) | Outcome label **Escalated · waiting on a person** |
| **record** / **proof entry** / **proof record** | The 16-field hash-chained record at rung 8 | "Proof #4,101" with the seq in Indian grouping. rung1 uses "Checked and recorded by the elan1 layer" |
| **chain** | Per-tenant append-only sequence from seq 1, each entry carrying `prev_digest` | "hash-chained", "tamper-evident". **Never** "tamper-proof", "signed", "immutable" or "independently verifiable" at L1 |
| **chain standing** | Three-valued continuity result (see §1.9) | Never shown as a green tick |
| **coverage** | Which write types the chain has checked, live vs modelled (sandbox) (E05 §05, E06 §05) | Always shown as a count, e.g. "3 of 23 write types" |
| **meter** / **meter event** | One event per governed write. Basis comes from the blast radius. Quantity 1 committed, 0 refused | "Refusals: 0 billed". Shown visibly, not hidden |
| **declaration** | "the elan1 Ontology in seven blocks" (E03) | Studio, Declarations |
| **the elan1 Ontology** | Always with the distinction: "attested by transactions that cleared, not extracted from documents" (E03 §01, dec. 1) | Public site and Studio header |
| **surface plan** | What compilation produces. It is the thing the approver's screen is rendered from | Mentioned on the Proof screen ("basis") |
| **shadow sandbox** | The kernel mechanism inside every write, production included: snapshot, sandbox apply, gate re-run, then identical bytes to live (E05 §05) | Always "shadow sandbox", never just "sandbox" (E05 dec. 7) |
| **sandbox key** | A developer credential for an isolated sandbox tenant with synthetic fixtures (`sk_sbx_…`; the doc's table header prints it as SK_SBX_…) | Always "sandbox key" or "sandbox tenant", never just "sandbox" |
| **production key** | `sk_live_…` (header: SK_LIVE_…). Issued by elan1 after the onboarding checklist | "Issued by elan1" |
| **mode: live \| sandbox** | Sealed into every proof entry | Shown on Proof. A sandbox entry "can never be presented as a production one" |
| **enforcement mode** | `enforced` \| `attested_advisory`, declared per write type or channel, sealed, "rendered on the Assurance door and printed in any export" (E05 §02) | Labels **Enforced** and **Attested advisory** |
| **reversal plan** | `snapshot_restore` \| `compensating_entry` \| `target_native_undo`, plus `window_hours` and `after_window` | "Reverse this (30 days)" |
| **fast path / forward path** | Undo by snapshot restore, or undo by a compensating accounting instrument, "chosen by the system. Never a silent delete" (E01 §02) | Shown on the Reverse screen |
| **undo window** / `undo_until` | 30 days from apply at L1 | "Reverse this — available until 24 Oct 2026, 11:42" |
| **break-glass** | "a declared write type with dual_control: true, recorded in the operator's own chain and visible to the tenant". There is no admin mode | Never say "admin override" |
| **stop / stop switch / tenant stopped** | Rung 0b. Throwing the stop is a governed write with dual control, "it stops all writes including refusals" (E06 §07) | "Tenant stopped" banner |
| **reference tenant** | The synthetic tenant used for simulation, fixtures and conformance | Studio Simulate |
| **Platform module** | elan1's own screens behind its four doors (E06 §01). The re-scope calls it the **elan1 Console** | Product name in the shell |
| **host system** | ERPNext Desk, Tally, Zoho Books, Odoo, Twenty, Zoho CRM, HubSpot, Salesforce, Shopify, Woo, ONDC. "We link out" | "Open in ERPNext" |
| **Enterprise 1 / module / app** | Retired words for the scrapped ERP suite | Never used in the UI |

### 1.2 The Four Doors (console grammar, not declaration block 7)

Rail order: **Work · Records · Agents · Assurance**. Exactly four, "no fifth door and no 'Settings' tab" (E06 §01). They are "never renamed, in any console, in any pack, or under any OEM or partner rebrand" (Four Doors §10).

| Door | Question (show under the door name) | Content shapes it admits | elan1 Console contents |
|---|---|---|---|
| **Work** | "What needs me now?" | queues | Approvals (obligations from any connected agent), Decide (compiled), Not done, New request (PROPOSED), Today → Needs you (PROPOSED) |
| **Records** | "What changed, and what may change?" (re-scope; E06 said "what is the state of things") | lists, forms, pinned fields | Connected systems, each object's governed timeline with a host link, Declarations and Studio, Actors, Write types, Tenants (moved here from Agents by the re-scope), Changesets and runs (PROPOSED), Regulatory packs (PROPOSED, L2) |
| **Agents** | "Who and what is acting here?" | agents, models, autonomy grants | Agent registry, including third-party agents via MCP; Autonomy A0–A5; graduation (Phase 4); Keys (API, and signing at L2) |
| **Assurance** | "Can I show someone this was done properly?" | chain standing, refusals, coverage, meter, exports | Proof and chain standing, Meter (invoice lines → records; moved here from Agents), Evidence · Export (L2), Enforcement mode, the L1/L2 boundary |

"NEVER HERE" rules from Four Doors §06:
- Work never holds "A 'yes' collected in chat without the diff" or host-system tasks such as ERPNext ToDo, which it links to instead.
- Records never holds "A second copy of invoices, ledgers, deals or orders" or "List or form views that rebuild ERPNext DocType screens".
- Agents never holds "An agent in any approver list" or "The meter (it goes to Assurance)".
- Assurance never holds "The approval queue (it moves to Work)" or "A 'Signed by' row before L2".

Consoles that get the doors: elan1 Console, rung1 Console, rung1 CA console and stack1 · P4 AI Governance. The rung1 partner white-label console is PROPOSED. Host systems, channels, the stack1 operator console and CLI, and marketing/docs don't get doors.

### 1.3 Declaration: the seven blocks, read as one sentence

"This thing, shaped this way, may be changed by these actors through these write types, subject to these gates, proving these fields, over these channels." (E03)

| # | Block | Fields (verbatim names) |
|---|---|---|
| 1 | **identity** | declaration_id, name, slug (`^[a-z0-9_]{3,48}$`), owner_role (a role, "not a person — people leave"), residency_domain (`in` at Phase 1), system_of_record (`erpnext` at Phase 1), lexicon_ref, description |
| 2 | **shape** | record_type (ERPNext DocType); fields[] with name, type (`string\|integer\|decimal\|boolean\|date\|datetime\|reference\|enum`), cardinality (`one\|many`), required, classification (`public\|internal\|personal\|financial`), references; links[] with name, target, cardinality ("the ontology's edges") |
| 3 | **permissions** | grants[] with actor_kind (`human\|agent\|system`), role, write_type, min_autonomy (A0–A5), may_approve ("true is invalid where actor_kind = agent") |
| 4 | **write_types** | name, label, intent, blast_radius, dual_control, gates[] (ordered), reversal_plan {method, window_hours, after_window} **or** irreversible: true, payload_schema, policy_exempt, adr |
| 5 | **gates** | name (one of nine), enabled, params, as_of_dependency, refusal_codes[] |
| 6 | **proof_binding** | fields[], canonicalisation (`elan1_lp_v1`), salt_scope (`per_record`), redaction_profile [L2, ignored at L1] |
| 7 | **channels** | channels[] with name, kind (`web\|mobile\|messaging\|api\|mcp\|voice`), write_types[], may_approve, mode (`enforced\|attested_advisory`) |

Block 7 used to be called "doors". That name is retired. "Doors" now means only the Four Doors UX grammar.

**Three dispositions, never a blank** (E03 §03). Every field carries exactly one of these:

| Disposition | Form | Rendered as |
|---|---|---|
| A value | the field's declared type | the value |
| `out_of_scope` | plus `adr` matching `^ADR-[0-9]{4}$` | "Hidden, with the decision reference available on hover" |
| `not_measurable` | plus `reason` and `would_change_if`, each at least 12 characters | "not measured, with both strings shown" |

"n/a" and "tbd" are rejected with this copy: **"An honest unknown needs a sentence. What would change your answer?"** (E06 §06)

**Semantic rules (VALIDATE):**
- L0-S01: every write type in permissions exists.
- L0-S02: every gate named in a write type exists in gates.
- L0-S03: exactly one of reversal_plan or irreversible: true.
- L0-S04: irreversible forces blast_radius ≥ one_counterparty.
- L0-S05: tenant or cross_boundary forces dual_control.
- L0-S06: cross_boundary forces a non-empty proof_binding.
- L0-S07: proof_binding fields exist in shape.
- L0-S08: every channel is registered for the tenant.
- L0-S09: policy_exempt requires an adr and is never valid on an irreversible write type.
- L0-S10: every write type in channels exists, and every write type appears on at least one channel.
- L0-S11: may_approve is false for agents, and min_autonomy is in A0–A5.

**Lint (warnings, not failures):**
- LN-01: more than 900 lines ("It has become a program. Split it").
- LN-02: reason or would_change_if under 12 characters ("'tbd' in a costume").
- LN-03: not_measurable across three versions.
- LN-04: gate order differs for the same gate set.
- LN-05: intent under 40 characters or a repeat of the label.
- LN-06: a financial or personal field is absent from proof_binding with no ADR.
- LN-07: rate, budget or schedule disabled without an ADR.

**Lifecycle:** AUTHOR → VALIDATE → SIMULATE → CERTIFY → COMPILE → RESOLVE (E03 §06). Studio shows the first four modes ("you cannot skip forward"). Versions are integers, exactly last + 1, immutable and retained "for ever". "There is no such thing as a small change to a governed declaration."

### 1.4 The rungs (the Right Path)

The UI says "nine rungs". E04 counts "ten checks" because 0b is included. Show all ten labels exactly as below, in this order:

| Rung | Name (verbatim) | What it does | p50 budget [unverified] |
|---|---|---|---|
| 0b | **STOP** | Is the tenant stopped? Checks tenant, residency and the stop flag | 4 ms (0b–2 together) |
| 1 | **IDENTITY** | actor_id, actor_kind (human · agent · system, set by the kernel, never claimed), delegation | ″ |
| 2 | **WRITE DOOR** | Write type exists at an explicit declaration version and is reachable from this channel. "there is no generic write" | ″ |
| 3 | **PRE-GATES** | Declared gates in declared order, pure functions; all run even after the first failure | 8 ms |
| 4 | **evaluate()** | Versioned rules over a projection of declared fields; allow / refuse / escalate; "no model in this path" | 12 ms |
| 5 | **GUARDRAIL** | Measured blast radius vs declared | 8 ms (5–6 together) |
| 6 | **AUTONOMY** | A0–A5 grant; a missing grant resolves to A0; escalates to an obligation | ″ |
| 7 | **ACT** | Snapshot → shadow sandbox apply → gate re-run → identical bytes to live with a single-use 10-minute credential → gate re-run on live → commit plus outbox | 18 ms kernel only; ERPNext pair ≤ 1,200 ms p95 |
| 8 | **PROOF** | Assign seq, chain prev_digest, SHA-256 over the 16-field preimage; "Refusals seal too" | 12 ms |
| 9 | **METERED** | Exactly one meter event; refusals at 0 by CHECK | 2 ms |

Kernel total is about 64 ms. The end-to-end SLO is ≤ 2 s p95, marked "MEASURE THIS". Every budget must carry an **[unverified]** tag in the UI until it has been measured.

### 1.5 Gates G1–G9 (rung 3)

| Gate | Plain-words name for the UI | Skippable | Asserts | Codes it may raise |
|---|---|---|---|---|
| G1 | **Consent** | never | "a recorded, unexpired consent covering this purpose" (also checks WhatsApp opt-out) | GATE.CONSENT_MISSING, GATE.CONSENT_EXPIRED |
| G2 | **Residency** (e.g. "Residency (Mumbai)") | never | "the record's residency domain matches the tenant's" | GATE.RESIDENCY_MISMATCH |
| G3 | **Retention** | never | "the record is inside its declared retention window" | GATE.RETENTION_WINDOW_CLOSED |
| G4 | **Dual control** | never | "a second named actor has approved this write_id" | GATE.DUAL_CONTROL_PENDING, GATE.DUAL_CONTROL_SAME_ACTOR |
| G5 | **Rate** | yes (commercial) | within the declared per-actor rate | GATE.RATE_EXCEEDED |
| G6 | **Budget** | yes (commercial) | within the declared per-period budget | GATE.BUDGET_EXHAUSTED |
| G7 | **Counterparty** | never | "the counterparty is known and not sanctioned" | GATE.COUNTERPARTY_UNKNOWN, GATE.COUNTERPARTY_SANCTIONED |
| G8 | **Schedule** | yes (commercial) | inside a declared operating window | GATE.OUTSIDE_SCHEDULE |
| G9 | **Precondition** | never | "a declared record state holds" (e.g. credit limit, period not closed, no duplicate invoice number, PO and GRN cross-checked) | GATE.PRECONDITION_FAILED |
| (rung 7) | **Shadow sandbox check** | — | live re-run agrees with the sandbox | GATE.SANDBOX_DIVERGED |

The six never-skippable gates are consent, residency, retention, dual control, counterparty and precondition. The gate summary on a row reads **"5 of 5 passed"**. Gate display order is the **declared order**, which is semantic. For `sales_invoice.submit` that order is consent, residency, retention, counterparty, precondition, dual_control, budget. It isn't the G-number order.

### 1.6 Autonomy ladder A0–A5 (rung 6)

| Level | Name (verbatim) | What rung 6 permits |
|---|---|---|
| A0 | **Observe** | "reads only; cannot reach rung 7 by any path". A missing grant displays as **"A0 Observe (no grant)"** in the same colour as an explicit A0 |
| A1 | **Draft** | "produces a write intent a human must submit" |
| A2 | **Propose** | "submits; a human approves before rung 7" |
| A3 | **Act reversible** | "acts alone where a reversal plan exists" |
| A4 | **Act bounded** | "acts alone inside a declared blast radius and budget" |
| A5 | **Act broad** | "acts alone at tenant scope; requires dual control on the declaration itself" |

Autonomy is written A0–A5. The letter L is reserved for Assurance Levels, so any old text that says "autonomy L3" means A3. Raising a grant is itself a governed write. "No reversal plan means no A3 or above." Irreversible write types "can never be auto-approved", and auto-approve is off by default per tenant.

### 1.7 Refusal code register

The register is closed: **43 codes in 3 classes (policy 14, gate 19, platform 10), 28 active at L1** (E02 §06, E04, E05, E06). E02 names 35 codes: the 32 in its table plus 3 `define` errors. The other codes are L2 (signing, anchoring, bundles, verifier profiles). See the count gap in §7.

Every code maps to one rung, one class and one operator action. "A refusal code whose screen offers no next action is a refusal code that has not been finished." The screen headline is **"Not done — {plain reason}"**. The code appears "once, in small type, because support asks for it".

The operator action column is verbatim from E02. The plain-words title is **PROPOSED**, except for PRECONDITION_FAILED ("Not done — credit limit"), which is doc-sourced. Button labels are PROPOSED and derived from the operator action.

| Code | Class · rung | Plain-words title | Means | Operator action (verbatim) | Primary button → route |
|---|---|---|---|---|---|
| POLICY.TENANT_STOPPED | policy · 0b | Not done — this workspace is stopped | The tenant is stopped | "Resolve the stop event; it names its cause class" | View stop event → `/records/tenants/:id` |
| POLICY.ACTOR_NOT_PERMITTED | policy · 1 | Not done — not allowed for you | permissions does not grant this actor kind this write type | "Grant it in a new declaration version, or resubmit as a permitted actor" | Ask an owner to submit it → `/work/not-done/:id/send`; Open declaration → `/records/declarations/:decl` |
| POLICY.DELEGATION_INVALID | policy · 1 | Not done — delegation has lapsed | on_behalf_of is not a live delegation | "Renew the delegation" | Renew delegation → `/records/actors/:id` |
| POLICY.WRITE_TYPE_UNKNOWN | policy · 2 | Not done — this action is not declared | Not in write_types at that version | "Publish a version that declares it" | Open Studio → `/records/studio/:decl` |
| POLICY.CHANNEL_NOT_PERMITTED | policy · 2 | Not done — not allowed from this channel | channels does not carry this write type | "Use a permitted channel or declare this one" | Open in the web console → deep link |
| POLICY.DECLARATION_UNRESOLVED | policy · 2 | Not done — declaration version not certified | Version absent or uncertified | "Certify it" | Go to Certify → `/records/studio/:decl/certify` |
| POLICY.DENIED_BY_RULE | policy · 4 | Not done — a rule does not allow this | A named rule denied at policy_version | "Read the named rule; change the request or the rule" | Read the rule → `/records/declarations/:decl/rules#rule` |
| POLICY.NO_RULE_MATCHED | policy · 4 | Not done — no rule covers this case | No rule covers this case | "Author a rule. Never widen a default" | Open Studio → `/records/studio/:decl` |
| POLICY.BLAST_RADIUS_EXCEEDED | policy · 5 | Not done — touches more than declared | Wider than declared | "Narrow the request, or raise the declared radius (which forces dual control)" | Narrow the request → back to request; Change declaration → Studio |
| POLICY.AUTONOMY_INSUFFICIENT | policy · 6 | Not done — autonomy too low | Grant below what this write type needs | "Raise the grant — itself a governed write — or route to approval" | Request a grant change → `/agents/autonomy/request?actor=&wt=` |
| POLICY.APPROVAL_DECLINED | policy · 6 | Not done — the approver rejected it | An approver declined | "Address the approver's basis and resubmit" | Read the reason → `/work/decide/:obl` (resolved view) |
| POLICY.OBLIGATION_EXPIRED | policy · 6 | Not done — nobody decided in time | The escalation expired unresolved | "Resubmit; expiry is itself a recorded governed event" | Resubmit → `/work/request?from=:write_id` |
| POLICY.DECLARATION_INVALID (define) | policy · — | Declaration not accepted | Fails the schema or a semantic rule | Shows "the first failing rule with its block and field" | Back to Validate |
| POLICY.VERSION_NOT_SEQUENTIAL (define) | policy · — | Version number out of order | Version ≠ last + 1 ("Gaps are a rejection") | PROPOSED: "Rebase on version N and certify again" | Studio |
| POLICY.NOT_CERTIFIED (define) | policy · — | Not certified yet | No named certifier | PROPOSED: "A named person must certify this version" | Certify |
| GATE.CONSENT_MISSING | gate · 3 · G1 | Not done — no consent on file | No consent covers this purpose | "Capture consent" | Capture consent → host/consent ledger |
| GATE.CONSENT_EXPIRED | gate · 3 · G1 | Not done — consent has lapsed | Consent lapsed | "Re-capture" | Re-capture consent |
| GATE.RESIDENCY_MISMATCH | gate · 3 · G2 | Not done — data would leave its residency | Record's residency domain ≠ tenant's | "Never override. Escalate to the residency runbook" | Open residency runbook (no override control is shown) |
| GATE.RETENTION_WINDOW_CLOSED | gate · 3 · G3 | Not done — outside the retention window | Record outside its declared retention window | "Do not write. Check the retention declaration" | Open retention declaration |
| GATE.DUAL_CONTROL_PENDING | gate · 3 · G4 | Waiting — needs a second approver | No second approver yet | "Request approval" | Request approval → creates an obligation → `/work/approvals` |
| GATE.DUAL_CONTROL_SAME_ACTOR | gate · 3 · G4 | You proposed this, so you cannot also approve it | Approver equals requester | "Find a second named actor" | **Send to** [names] |
| GATE.RATE_EXCEEDED | gate · 3 · G5 | Not done — above the declared rate | Above the declared per-actor rate | "Wait, or raise the declared rate" | Try again after {time} / Change declaration |
| GATE.BUDGET_EXHAUSTED | gate · 3 · G6 | Not done — budget used up for this period | Above the declared per-period budget | "Raise the budget; never truncate silently" | Raise the budget → Studio |
| GATE.COUNTERPARTY_UNKNOWN | gate · 3 · G7 | Not done — counterparty not registered | Counterparty not registered | "Register it" | Register counterparty → Open in ERPNext |
| GATE.COUNTERPARTY_SANCTIONED | gate · 3 · G7 | Not done — counterparty is on a sanctions list | Counterparty on a sanctions list | "Never override. Escalate to compliance" | Escalate to compliance (no override control) |
| GATE.OUTSIDE_SCHEDULE | gate · 3 · G8 | Not done — outside the operating window | Outside the declared operating window | "Wait, or change the window" | — |
| GATE.PRECONDITION_FAILED | gate · 3 · G9 | **Not done — credit limit** (doc example; the title comes from the failing predicate) | A declared record state does not hold | "Fix the record state" | "Request a limit change (itself a governed write)" / "Reduce the invoice" |
| GATE.SANDBOX_DIVERGED | gate · 3 (raised at 7) | Not done — the check on your live books disagreed | Live re-run disagreed with the sandbox result | "Snapshot restored. Investigate before resubmitting" | View both results |
| PLATFORM.REGISTRY_UNAVAILABLE | platform · 2 | Our failure — declaration registry down | Registry down | "Page. Retry with the same intent_id" | Try again (same intent) |
| PLATFORM.POLICY_UNAVAILABLE | platform · 4 | Our failure — rule engine down | Rule engine down | "Page. Never fall back to a default allow" | Try again |
| PLATFORM.TARGET_UNREACHABLE | platform · 7 | Our failure — ERPNext did not answer | Target unreachable | "Page. Nothing was applied" | Try again |
| PLATFORM.TOKEN_MINT_FAILED | platform · 7 | Our failure — could not open a one-time key | Could not mint the short-lived credential | "Page" | Try again |
| PLATFORM.WRITER_LOCK_LOST | platform · 7 | Our failure — the write was interrupted | Single-writer lock lost | "Page. Snapshot restored" | Try again |
| PLATFORM.LOG_APPEND_FAILED | platform · 8 | Our failure — proof not yet written | Chain append failed | "Page. Outbox retries in order" | Status only (retries itself) |
| PLATFORM.CHAIN_HEAD_CONFLICT | platform · 8 | Our failure — workspace stopped for safety | Two chain writers for one tenant | "P0. Stop the tenant" | Status page |

**Refusal copy templates (verbatim):**
- Gate class (E02): "Blocked at Dual control — this purchase order is above your ₹5 lakh limit and needs a second approver. Request approval."
- Policy class (E02): "Rule set 7 does not permit this write type from an agent. Ask an owner to submit it, or change the permission."
- Platform class (E02): "We could not complete this. Nothing was changed. We have been paged."
- Platform class on the Not done screen (E06): "This is our failure, not a rule. Nothing was changed, you have not been billed, and we have been paged."
- Tenant-stopped refusal: "carrying the reason class and the time the stop was set" (E04). This is the only refusal without a proof record.

### 1.8 Assurance Levels

| Level | Name | Phase / date | Claim in one line | Buyer · question |
|---|---|---|---|---|
| **L1** | **Guarded** | Phase 1, now | "L1 says the write was controlled" | operations or finance owner · "can I let this run?" |
| **L2** | **Attested** | Phase 3, Q3 2027 onward | "L2 says a stranger can check that" | the auditor's counterparty · "can I hand this over?" |
| **L3** | **Proven** | Phase 4, 2028 onward | "L3 says the record survives us" | the market · "does this survive the vendor?" |

"A level is a property of the proof and the claim, never of the policy." The same declaration carries across all three. Records written at L1 "stay L1 and are labelled L1 forever".

### 1.9 Chain standing: three-valued wording (E06 §05)

- **continuous**, with scope and count, e.g. "continuous · seq 1–4,101 · 23 of 23 write types · checked 02:10 IST"
- **break at seq N**, e.g. "break at seq 3,882 · field prev_digest". A broken link is a P0.
- **not checked over this range**, with scope and count.

"A chain that verifies over three of twenty-three write types is a verified chain over almost nothing, and it reads identically on screen unless the screen says so." Never show a green tick.

### 1.10 Blast radius classes (kernel enum → meter basis)

| Kernel value | UI label | Meter basis | Rules |
|---|---|---|---|
| `one_record` | One record | per record | only class eligible for WhatsApp reply-approval |
| `one_counterparty` | One counterparty | per counterparty | minimum class for irreversible |
| `batch` | Batch | per batch | |
| `tenant` | Whole tenant | per tenant | forces dual control |
| `cross_boundary` | Crosses an organisation boundary | per crossing | forces dual control and a non-empty proof_binding |

The mapping is "normative, not configurable". The CONTRACT's 4-step visual ladder (Contained, Reversible, Material, Irreversible) isn't in these documents; see §7 for the proposed mapping.

### 1.11 Proof entry fields (the 16-field record, F01–F16)

F01 tenant_id · F02 seq · F03 prev_digest (32 zero octets at genesis) · F04 write_id · F05 write_type · F06 declaration_id · F07 declaration_version · F08 policy_version · F09 actor_id · F10 actor_kind · F11 autonomy_level · F12 record_id (zero-UUID on a refusal) · F13 record_version (0 on a refusal) · F14 payload_hash · F15 lexicon_hash · F16 recorded_at (platform clock).

The response adds `digest` (SHA-256 over the length-prefixed preimage) and `assurance_level: 1`.

The Proof screen shows seq, prev_digest, digest, declaration version, policy version, write type, actor kind, outcome, refusal code where applicable, **mode: live | sandbox**, "the exact fields committed by proof_binding", and enforcement mode. **[L2 only]** signature, Merkle root and RFC 3161 token are "absent rather than stubbed" at L1.

### 1.12 Meter event

event_id · write_id · seq · basis · quantity (1 committed, 0 every refusal "enforced by CHECK") · outcome `committed | refused | escalated` · at.

Sandbox-key events are "emitted, quantity zero, not billed". A 429 throttle produces no meter event. "Every invoice line traces to a record."

### 1.13 KernelPort: six calls, five objects

Calls: **define · assert · seal · verify · scope · refuse**.
- define: register a write type at a declaration version.
- assert: run the rungs and return a decision. "the only call that can change a record".
- seal: kernel-only chain writer.
- verify: check chain continuity. "At L1, verify requires us — state that limitation to the customer in those words."
- scope: resolve blast radius and autonomy. Advisory, and "a control the actor may not use is not rendered, and a control that will need approval says so before it is pressed".
- refuse: emit a typed refusal.

Objects: **Write intent · Decision · Approval · Record · Meter event**.

Invariants I1–I8:
- I1: a model may never produce an allow.
- I2: single writer.
- I3: fail closed.
- I4: refusals free and typed.
- I5: no fast path, batch variant, admin mode or decision cache.
- I6: no warn.
- I7: nothing resolves to "latest".
- I8: determinism.

### 1.14 MCP / SDK / HTTP surfaces

- **SDK (in-process):** `@elan1/kernel` behind KernelPort. Used by rung1 and stack1.
- **MCP tool scopes:** `ro` 18 · `stage` 10 · `act` 6 (34 tools).
- **Named tools:** `read.records`, `read.evidence`, `read.declaration`, `read.meter`, `stage.write`, `act.write`, `act.escalate`. Tool descriptions are hash-pinned in the declaration.
- **HTTP endpoint families:** `/v1/writes` (act), `/v1/obligations` (act), `/v1/records` (ro), `/v1/evidence` (ro), `/v1/meter` (ro), `/v1/declarations` (ctl), `/v1/actors` (ctl), `/v1/tenants` (ctl). "ctl-class paths have no read path to any record store".
- **Token classes:** tenant token (one tenant, one actor, one autonomy level), control token (Studio and registry only), ops token (read-only, no tenant data). Token scopes at KernelPort are `ro`, `stage` and `act`.
- **Headers:** `X-RateLimit-Limit/-Remaining/-Reset`; 429 with `Retry-After`; webhooks signed with `X-Elan1-Signature` and `X-Elan1-Timestamp` (HMAC, 5-minute freshness); `Sunset` and `Deprecation` headers.
- **Webhook events:** `write.committed`, `write.refused`, `write.escalated`, `obligation.resolved`, `obligation.expired`, `declaration.certified`, `tenant.stopped`.
- **Error taxonomy (E05 §07):**

| Kind | HTTP | Proof entry | Meter | Retry |
|---|---|---|---|---|
| Refusal | 200 | yes | zero | never |
| Escalation | 200 | yes | zero | never; wait for the outcome |
| Rejection | 4xx | no | no | only after fixing |
| Throttle | 429 | no | no | yes, with backoff |
| Platform failure | 5xx, or a PLATFORM.* refusal | refusal only | no | same idempotency key |
| Tenant stopped | 200 | no | no | no |

- **Retry and idempotency:** `idempotency_key` is retained 30 days. Retries back off with a maximum of 5 attempts. "Never retry a refusal." Polling interval ≥ 10 s.
- **Sandbox key vs production key:** sandbox key rate limit is 10 writes/min, 2 concurrent. A production key still uses the shadow sandbox on every write.

### 1.15 Channels (block 7 kinds; the Channel Block doc)

| Channel | kind | Role | Phase 1 rules |
|---|---|---|---|
| Web console | web | submit and approve | enforced |
| Mobile PWA | mobile | approve (responsive to 360px) | enforced |
| **WhatsApp** | messaging | "a notification and low-stakes-approval channel" | Reply APPROVE/REJECT only where `whatsapp_approve: true` (low value, reversible, one_record); otherwise deep link only. "messaging is read-only here, because WhatsApp is easy to spoof and shouldn't be trusted to move money" |
| **Voice** (rung1 Voice) | voice | "Inbound only… Approvals only" | Can only answer a pending approval. Needs a spoken confirmation and a one-time code. Tamil or English |
| **e-mail** | (not in the enum; see §7) | delivers items into Work | PROPOSED: notification plus deep link only |
| **API** | api | another system calling us | e.g. create_invoice ✓ but cancel_invoice ✗ ("a compromised API key should never be able to wipe out invoices") |
| **MCP** | mcp | the Doorway for third-party agents | may_approve false. Attested advisory unless proven Enforced |
| Agent / Connector | (Channel Block doc only) | An AI agent inside the platform / the link to Frappe, Twenty, Shopify | — |

"A channel adapts; it never decides." "A blank cell means the action simply cannot be attempted from that route. It is not a permission question."

---

## 2. Screen inventory

Shared rules for every console screen:
- **Top bar:** environment badge (Production / Sandbox tenant), level pill (**L1 Guarded**) and tenant switcher.
- **Stopped tenant:** a persistent banner (see §2.9 G-banners).
- **Numbers:** Indian grouping. Hashes and seq in mono.
- **Actors:** actor kind is always printed as the word **Agent** or **Person** ("in words not an icon").

### 2.1 WORK door: "What needs me now?"

#### W1. Approvals (approval inbox), `/work/approvals`
- **Source:** E06 §02. "The first door, the first screen, and the one a customer opens twenty times a day."
- **Actor:** approver in the resolver set of at least one open obligation.
- **Query filters** (the filter lives in the URL "so it can be pasted into a message"):
  - `?filter=mine` = **Waiting on me** (default)
  - `?filter=anyone` = **Waiting on anyone**
  - `?filter=expiring` = **Expiring within an hour**
  - `?filter=agent` = **Raised by an agent**
  - `&wt=erp.sales_invoice.submit` = **Write type**
  - `&cp=ACME%20Textiles` = **Counterparty**
- **Sort:** "oldest deadline first". Don't offer a sort that hides expiry.
- **Row columns** (a real `<table>` with `<th>`):
  1. **Proposal**: what is proposed in one line (e.g. "Submit invoice SINV-2026-01187 · ACME Textiles").
  2. **Proposed by**: name plus **Agent** or **Person** in words.
  3. **Amount / radius**: "₹2,40,000" or "Batch · 38 records".
  4. **Checks**: "5 of 5 passed" with word and shape, never colour alone.
  5. **Expires**: countdown "3 h 12 min", announced and pausable.
  6. Write type label (secondary).
- **Row rule:** "What an approver must see before deciding, on the row itself: whether a human or an agent proposed it, the money or the radius, whether every gate passed, and how long is left."
- **Actions:**
  - Row → `/work/decide/:obligationId`.
  - Link **What arrives here** → `/work/approvals/arrives`.
  - Bulk approve: **not provided**. It's an open question in E06 Q2 and would defeat the screen's purpose; see §7.
- **Empty state (verbatim):** "Nothing is waiting for you. Agents are running at their declared autonomy; anything that needs a person will appear here." Plus the link **What arrives here**.
- **Error state (verbatim):** "We cannot show your approvals right now. Nothing has been approved in the meantime and nothing expires while this is down." Expiry pauses during an outage; show "Expiry paused" on cached rows.
- **Tenant stopped:** banner, plus an empty queue with "This workspace is stopped. No new approvals can arrive until the stop is lifted." (PROPOSED)
- **Level:** L1 (same at L2/L3).
- **Accessibility:** keyboard-complete path; countdown in an `aria-live="polite"` region at 1 h / 15 min / 5 min; timers pausable; 44px rows on mobile.
- **Mobile:** same screen at 360px. Rows become cards but keep all four facts.

#### W2. What arrives here, `/work/approvals/arrives`
- **Source:** E06 §02 link. **Content PROPOSED.**
- Shows "the list of write types that escalate for this actor". For each write type: label, blast radius, why it escalates (autonomy of proposers below the needed level, dual control threshold, irreversible), and the channels where you may approve it (web / mobile / WhatsApp).
- **Empty state:** "No write type escalates to you. You are not in any resolver set. An owner can add your role in a new declaration version."
- **Actions:** each write type → `/records/write-types/:name`.

#### W3. Decide, `/work/decide/:id` (id = obligation id)
- **Source:** E06 §03. "The single most consequential surface in the product." It is **compiled from the declaration** (Four Doors dec. 4); the approval screens must be compiled.
- **Actor:** approver in the resolver set, with the obligation open.
- **Above the fold (mandatory, in this order):**
  1. The one-line proposal.
  2. The proposer, "with Agent or Person stated in words not an icon".
  3. The deadline.
  4. The declared blast radius.
- **Section: Change.** "field-by-field diff — before, after, changed rows highlighted, unchanged rows collapsed behind **Show all fields**. Nothing is summarised away."
  - It must be a `<table>` with row and column headers so a screen reader says "Credit limit, before ₹3,00,000, after ₹2,40,000".
  - Changed rows are marked with a word ("changed") as well as a tint.
- **Section: Checks.** Every declared gate's result, "not only the failures", in declared order, plain words, each with the declaration version it ran against. Verbatim example rows:
  - "Consent — passed."
  - "Residency (Mumbai) — passed."
  - "Retention — passed."
  - "Counterparty (ACME Textiles, known) — passed."
  - "Precondition (credit limit ₹3,00,000, exposure after this write ₹2,40,000) — passed."
  - Pass or fail carries a word and a shape.
- **Section: Decision.** "allow at policy version 11". Then why it reached a human: "the proposing agent is at A2 Propose; a person approves before anything is written." Also verbatim from E04: "an agent proposed this; you are the decision."
- **Also shown:** write type label and name, declaration version (e.g. erp.ar v7), enforcement mode (Enforced), obligation id, write_id, the "Reverse plan" line ("Reversible: cancel IRN within 24 h, then credit note"), and "Irreversible — cannot be auto-approved" where applicable.
- **Actions:**
  - **Approve** → confirm → "Recording your decision…" → outcome state (below).
  - **Reject** opens a reason field that must hold at least one sentence (enforce ≥ 1 sentence; PROPOSED min 20 characters ending in punctuation). Then "Recording your decision…" → rejected state.
  - **Send to** appears only on the same-actor refusal. It lists people only.
  - Approve and Reject "are never adjacent without a gap".
- **Outcome states** (same route, `?state=`):
  - `approved`: **"Approved · posted · proof #4,101"** with **Open the record** → `/records/object/:recordId` and **Reverse this (30 days)** → `/work/reverse/:writeId`. Live region: "Approved. Posted. Proof 4101."
  - `rejected`: PROPOSED "Rejected · recorded · proof #4,100. The agent has been told POLICY.APPROVAL_DECLINED. Your reason is on the record." Links: Show the record of this decision → `/assurance/proof/4100`; Back to Approvals.
  - `same-actor` (GATE.DUAL_CONTROL_SAME_ACTOR): verbatim "You proposed this, so you cannot also approve it. Send it to: [names]" with the **Send to** control. "It does not say 'insufficient permissions'."
  - `write-failed` (GATE.SANDBOX_DIVERGED or a rung-7 platform failure), verbatim: "Your approval was recorded. The write itself did not complete, and nothing was changed. We have been paged." Both facts, in that order. Links: Show the record of your approval → proof; See why → `/work/not-done/:writeId`.
  - `expired`: PROPOSED "This request expired at 18:40 IST before anyone decided. Nothing was written. The expiry is recorded as proof #4,1xx." Link: Resubmit (for the proposer only).
  - `resolved-by-other`: PROPOSED "Venkat Raman approved this at 15:02. Nothing for you to do." Link to the proof.
  - `closed-stopped`: tenant stopped.
- **Empty or not-found:** "This request is no longer open. It was {approved/rejected/expired} — see proof #N." (PROPOSED)
- **Error:** as W1, plus "Your decision has not been recorded. Please try again; nothing was approved." (PROPOSED, and never ambiguous about whether the press counted.)
- **Level:** L1. No "Signed by" anywhere. At L2 the resolved state may add "Signed · key fingerprint …".
- **Accessibility:** focus lands on the H1 proposal; the diff is a real table; the countdown is announced and pausable; confirm dialogs trap focus; the outcome is announced via a live region.
- **Mobile:** "diff collapsed to changed fields only and Show all fields expanding it."

#### W4. Not done (refusal explanation), `/work/not-done/:id` (id = write_id or seq)
- **Source:** E06 §04. "Reached from anywhere a write was refused."
- **Layout:**
  1. H1 in the words of the thing tried: **"Not done — credit limit"**.
  2. The code printed "once, in small type": `GATE.PRECONDITION_FAILED · rung 3 · G9`.
  3. "one sentence of what the rule is, the two numbers that failed the test, the declaration version, and the time". Example: "An invoice may not take a customer above their credit limit. Limit ₹3,00,000 · exposure after this invoice ₹4,20,000 · declaration erp.ar v7 · 24 Sep 2026, 14:07 IST."
  4. The full list of gate results. Every declared gate ran; the failed one is first and marked "Failed" with a shape.
  5. **Operator action** (exactly one per code). Here: **Request a limit change** ("itself a governed write") → `/work/request/erp.credit_limit.change?customer=ACME` and **Reduce the invoice** → `/work/request/erp.sales_invoice.submit?from=:writeId`.
  6. **Show the record of this refusal** → `/assurance/proof/:seq`. "The refusal is evidence."
  7. Meter line: "Not billed — refusals meter at zero."
- **PLATFORM variant**, verbatim: "This is our failure, not a rule. Nothing was changed, you have not been billed, and we have been paged." Action: **Try again** (same intent_id).
- **Tenant stopped variant:** reason class plus "stopped at {time}". No proof link, because "the only refusal without a proof record".
- **Actor:** whoever submitted (operator, or the agent owner reading an agent's refusal).
- **Level:** L1.

#### W5. Not done (list), `/work/not-done`
- **Source:** "Not done: refusals that need an action" (Four Doors §06). **List design PROPOSED.**
- **Columns:** When · What was tried · By (Agent/Person) · Reason (plain title) · Code (small) · Next action · Proof #.
- **Filters:** class (policy/gate/platform), actor kind, write type.
- **Empty state:** "Nothing was refused that needs you. Refusals still appear in Assurance → Refusals as evidence."

#### W6. New request, `/work/request` and `/work/request/:writeType`
- **Source:** E04 Flow 1 ("Rekha opens Record payment in the Work door"); Four Doors ("New request to an agent"). **Form design PROPOSED.** It is compiled from the write type's payload_schema.
- **Before submitting, show the scope() answer:** "a control that will need approval says so before it is pressed". Example: "This will need approval from an Accounts head, because the amount is above ₹2 lakh."
  - Controls the actor may not use aren't rendered at all.
- **Flow:** Confirm → "Checking…" → one of:
  - Committed: **"Payment recorded · proof #4,097"** with a link to the entry in Records and **Reverse this** (valid 30 days).
  - Escalated: "Sent for approval to …"
  - Refused: redirect to Not done.
- **Ongoing state:** `/work/writes/:writeId`. PROPOSED status page for a write in flight: "Checking… / Applying to the shadow sandbox… / Applied".

#### W7. Reverse this, `/work/reverse/:writeId`
- **Source:** E01 §02 #6, E02 undo_until, E03 reversal_plan, C12. **Screen PROPOSED.**
- **Shows:**
  - The original write and its proof #.
  - Undo window remaining ("until 24 Oct 2026, 11:42 IST").
  - The **path the system chose**: "Fast path — restore the snapshot taken before this write" or "Forward path — raise a credit note (compensating entry)". The user doesn't choose.
  - The diff of what reversal will change.
  - The gates that will run.
  - "This reversal is itself a governed write and gets its own proof record."
- **Special case:** past `window_hours` for IRN (24 h), copy reads "The e-invoice can no longer be cancelled (24-hour IRN window). Reversal is a credit note, which is a different governed write with its own record."
- **Past 30 days:** "This write can no longer be reversed here. The 30-day window closed on {date}." There is no button. It "never" silently deletes.
- **Irreversible write type:** "This write was declared irreversible. There is no reversal plan." No button.
- **Result:** "Reversed · proof #4,1xx".

#### W8. Today → Needs you, `/work` (door landing)
- **Source:** Four Doors (PROPOSED for rung1). Use it for the elan1 Console door landing too.
- **Shows:** counts of Waiting on me, Expiring within an hour and Not done needing action; the three nearest deadlines; and a banner for stopped tenants and platform incidents.
- **Empty:** as W1's empty state.

### 2.2 RECORDS door: "What changed, and what may change?"

Records never holds a copy of host records. Every object links out: **Open in ERPNext**.

#### R1. Records home / Connected systems, `/records` and `/records/systems`
- **Source:** Four Doors §06 ("Connected systems: Records → This site"). **Design PROPOSED.**
- **Columns:** System (ERPNext · kaveri.erpnext.in), host version, enforcement mode (**Enforced · credential custody** / **Attested advisory**), declarations bound, last governed write, adapter status.
- **Actions:** Open in ERPNext (external) and View declarations → `/records/declarations?system=erpnext`.
- **Empty:** "No system of record is connected. elan1 governs writes to a system you already use; connect one to see its governed history here."

#### R2. Record (object governed timeline), `/records/object/:id`
- **Source:** E06 §05. "Record shows current state, pinned fields from the declaration, and a timeline of every governed write that touched it — each with actor, actor kind, outcome and a proof reference."
- **Header:** object name (e.g. Sales Invoice SINV-2026-01187 · ACME Textiles), **Open in ERPNext** (external), declaration and version.
- **Pinned fields:** the declaration's governed fields, read from the host as current state. They're pinned, not a full copy.
- **Timeline** (a table or ordered list, newest first). Columns: when · write type label · actor · **Agent/Person** · outcome (Committed / Not done / Escalated / Approved / Rejected / Expired / Reversed) · proof # → `/assurance/proof/:seq`.
- **Refusals and escalations are included:** "a timeline of successes only is a timeline that lies by omission."
- **Actions:** Reverse this (if within the window) → W7.
- **Empty timeline:** "No governed write has touched this record yet. Changes made directly in ERPNext before elan1 was connected are not shown here." (PROPOSED)
- **Error:** "We cannot reach ERPNext to show current values. The governed history below is complete and comes from the proof chain." (PROPOSED)
- **Level:** L1.

#### R3. Declarations list, `/records/declarations`
- **Source:** E06 §01 ("declarations, actors and write types behind Records"). **Design PROPOSED.**
- **Columns:** Name (e.g. "rung1 — Sales invoicing (ERPNext)"), slug, owner role, system of record, residency, current certified version, certified by, certified on, write types count, status.
- **Status values:** Certified · In validation · Draft · Superseded.
- **Actions:** row → `/records/declarations/:decl`; **New declaration** → `/records/studio/new`.
- **Empty (verbatim, E06 §06):** "No declaration yet. A module without a declaration has no screens, because there is nothing to render."

#### R4. Declaration detail and version history, `/records/declarations/:decl` and `/records/declarations/:decl/v/:ver`
- **Content PROPOSED; the data is sourced.**
- **Shows:** the seven blocks read-only, each field with its disposition. `out_of_scope` is hidden with the ADR on hover. `not_measurable` shows "not measured" with reason and would_change_if.
- **Version history table:** version, certifier, date, compiled digest (mono, shortened), supersedes, record seq of the certification, change summary.
- **Compare versions:** `/records/declarations/:decl/compare?from=6&to=7`. Loosening a gate shows the required ADR.
- **Banner:** "Every version is kept verbatim, for ever. Records written under version 6 still explain themselves."
- **Actions:** Edit as new version → Studio; Open write type → R6.

#### R5. Studio (Declaration Studio), `/records/studio/:decl` with modes `/author`, `/validate`, `/simulate`, `/certify`
- **Source:** E06 §06, E03 §06. "Three modes, one after another, and you cannot skip forward." It actually lists four: Author, Validate, Simulate, Certify.
- **Stepper:** Author › Validate › Simulate › Certify. Later steps are disabled with the reason ("Validate first").
- **Actor:** declaration author (an elan1 engineer at Phase 1) and certifier (a different named human).

**R5a. Author, `/records/studio/:decl/author`**
- Block-by-block editor for the seven blocks, as a left list of blocks (identity … channels).
- Every field has a tri-state control: **Value · Out of scope (ADR-nnnn) · Not measurable (reason + what would change it)**.
- "n/a" or "tbd" triggers: "An honest unknown needs a sentence. What would change your answer?"
- **Right pane:** "the compiled surface preview beside the source → author sees the screen the approver will see, before writing any code" (a live Decide preview).
- A line counter warns at 900 (LN-01).
- **Actions:** Save draft; **Validate** → R5b.

**R5b. Validate**
- Shows "Valid", or failures "against the block that caused them, not as a list of error codes".
- Verbatim example: "L0-S03 — sales_invoice.submit declares neither a reversal plan nor irreversible: true. Every write type must say which it is."
- Lint warnings are listed separately as warnings (LN-01…07).
- A missing never-skippable gate fails here.
- **Actions:** Fix (jump to block and field); **Simulate** (enabled only when valid).

**R5c. Simulate**
- "runs the write types against the reference tenant's synthetic fixtures, never production records".
- **Report per write type:** "which gates would run, in what order, what the blast radius resolves to, what the meter basis is, and which refusals the fixtures produced", plus decision and gate-result rows.
- **If a write type has zero refusals, show a warning (verbatim):** "A simulation with no refusals in it is a simulation that has not been designed."
- **Actions:** **Continue to Certify**.

**R5d. Certify**
- A named human presses **Certify this version**. "Their name is on it."
- Certification is a governed write with dual control. On success: "Certified · version 8 · proof #N · digest 3b9e…c41d".
- **If the certifier is the author:** refused with GATE.DUAL_CONTROL_SAME_ACTOR. Copy: "You wrote this version, so you cannot also certify it. Send it to: [names]".
- **Registry down:** PLATFORM.REGISTRY_UNAVAILABLE, "nothing registered, retry safe".
- **Also shows:** the compiled artefact digest, the surface plan digest and the "Version must be 8 (last + 1)" rule.
- **Tool descriptions:** show that the declaration pins MCP tool description hashes. Changing one requires certification ("We pay a certification for a typo fix").

**Studio empty state:** as R3 verbatim.

#### R6. Write types registry, `/records/write-types` and `/records/write-types/:name`
- **Content PROPOSED; the data is sourced.**
- **Columns:** label, name (mono), declaration and version, blast radius (band), dual control (yes / threshold), reversal (method · window · after) or **Irreversible**, gates in order (chips), channels (web/mobile/WhatsApp/voice/api/mcp), enforcement mode, meter basis, **coverage** (live / modelled).
- **Detail page:** intent sentence, permissions grants for this write type (role, actor kind, min autonomy, may approve), and the refusal codes reachable.

#### R7. Actors and delegations, `/records/actors` and `/records/actors/:id`
- **Source:** E06 ("actors behind Records"); `/v1/actors`. **Design PROPOSED.**
- **Columns:** name, actor kind (Person/Agent/System), role(s), may approve (which write types), delegations (on_behalf_of: who, until when), last action.
- **Delegation rule shown:** "Delegation confers accountability, never autonomy."
- **Actions:** Renew delegation (a governed write).

#### R8. Tenants, `/records/tenants` and `/records/tenants/:id`
- **Source:** E06 §07, which puts it under Agents; the re-scope moves Tenants → Records.
- **Shows:** "residency domain, status, stop switch". Also: host, enforcement mode per channel, level (L1), chain head seq, created, contract status.
- **Stop switch:** see flow F7. "throwing the stop is a governed write with dual control; it stops all writes including refusals".
  - The confirm dialog requires the cause class and a reason, and then creates a second-approver obligation.
- **Status values:** Live · Stopped (cause class, time, by whom) · Onboarding · Sandbox tenant.
- **Actions:** Stop this tenant → `/records/tenants/:id/stop`; Lift stop → `/records/tenants/:id/lift` (also dual control, PROPOSED).

#### R9. Changesets and runs, `/records/changesets` (PROPOSED)
- An overnight or agent run and what each write touched, linked to the host and to proof entries.

#### R10. Channels registry, `/records/channels` (PROPOSED; implied by L0-S08)
- The tenant's registered channels: name, kind, write types carried, may approve, mode.
- It renders the Channel Block matrix (write type × channel) with ✓ / ✗ / "approve only". A blank cell carries the text "cannot be attempted from this route".

### 2.3 AGENTS door: "Who and what is acting here?"

#### A1. Agents (registry), `/agents` and `/agents/:id`
- **Source:** E06 §07: "every registered agent, its model, its tools, the hash-pinned descriptions it was shown". Guard: "a changed description shows as a version change, not a silent update".
- **List columns:** agent name, owner (person), model, channel (MCP / SDK / Agent), enforcement mode, autonomy summary (e.g. "A2 Propose on 3 write types"), tools count, last action, 7-day outcomes (committed / refused / escalated counts).
- **Detail sections:**
  - Identity (actor_id, actor_kind **Agent**, set by the kernel).
  - Model.
  - Tools, with scope (ro/stage/act) and pinned description hash, plus a description **version history** in which a changed hash appears as "Description changed · declaration v8 · certified by …".
  - Autonomy grants → A2.
  - Recent governed writes → Records/Assurance.
- **Rule banner:** "An agent can never approve. It is never in a resolver set." (E06 dec. 8)
- **Empty:** "No agent is registered. Agents reach elan1 through the SDK or MCP; register one with a sandbox key to see it here." → `/developers/quickstart`.

#### A2. Autonomy, `/agents/autonomy`
- **Source:** E06 §07. A grant matrix, actor × write type, with values A0–A5.
- **Missing grant:** rendered as **"A0 Observe (no grant)"** "in the same colour as an explicit A0". The screen's job "is to make the default legible… the answer is 'no grant' rather than showing a blank."
- **Cells:** level code plus name, e.g. "A2 Propose". Where the declaration's `min_autonomy` exceeds the grant: "needs A3 — escalates to approval".
- **Actions:** **Request a change** → `/agents/autonomy/request?actor=&wt=`. Raising a grant is "itself a governed write". The form shows the resulting obligation and who will approve.
  - Caps: "No reversal plan means no A3 or above." Irreversible write types can't be auto-approved.
  - A5 requires dual control on the declaration.
- **Level:** L1.

#### A3. Keys, `/agents/keys`
- **Source:** E06 §07: "API keys, sandbox and production, last used, rotation window". Guard: "production keys are issued by us, never self-serve in Phase 1".
- **Columns:** name, class (tenant / control / ops token), prefix (`sk_sbx_…4f2a` / `sk_live_…9c1e`), environment, actor bound, autonomy level bound, scopes (ro/stage/act), created, last used, rotation window ("rotate by 21 Dec 2026"), status.
- **Actions:**
  - **Create sandbox key** (self-serve).
  - **Request production key** → onboarding checklist check (items 3, 5, 8, 11).
  - **Rotate** → flow F8.
  - **Revoke** (PROPOSED as a governed write).
- **L2 only:** signing keys, key fingerprint, custody per residency domain, successor key. They're **not shown at L1**. A single line may say "Signing keys arrive at Assurance Level 2."
- **Empty:** "No keys yet. Create a sandbox key to start; production keys are issued by elan1 after the onboarding checklist."

#### A4. Webhooks, `/agents/keys/webhooks` (PROPOSED placement)
- Endpoint URL, events subscribed (the seven), secret rotation, last delivery, last seq delivered, "seq gap detected" indicator.

### 2.4 ASSURANCE door: "Can I show someone this was done properly?"

#### S1. Assurance overview, `/assurance`
- **Source:** E06 §01 ("The Assurance door in Phase 1 shows chain standing and coverage"). **Design PROPOSED.**
- **Tiles:**
  - Chain standing (three-valued with scope and count).
  - Coverage (x of y write types live; modelled vs live).
  - Refusals this period (by class).
  - Meter this period.
  - Enforcement mode summary.
  - Level card: "Assurance Level 1 · Guarded".
- **Level card copy (sourced, E01 §08):** "This is Assurance Level 1. Level 2 adds signatures and offline verification, and is on the roadmap for Q3 2027."
- **Deprecation notices** (E05 §10) appear here as a list.
- **Must not show:** signature, anchor time, verifier verdict or a "Signed by" row.

#### S2. Proof, `/assurance/proof/:seq`
- **Source:** E06 §05.
- **Fields:**
  - `seq`, `prev_digest`, `digest` (mono; shortened with copy-full).
  - declaration version, policy version, write type, actor kind (**Agent/Person/System**), outcome, refusal code where applicable.
  - **mode: live | sandbox**, enforcement mode.
  - "the exact fields committed by proof_binding" (field names and the values as committed, e.g. customer, posting_date, grand_total, items[].item_code, qty, rate).
  - Plus all 16 F-fields in an expandable "Full record" table, with F12 record_id showing as the zero-UUID `00000000-0000-0000-0000-000000000000` on refusals.
  - `assurance_level: 1`.
- **Chain around it:** preceding and following entries (±3), with continuity stated three-valued, "with the scope and count printed next to the word".
- **Mandatory in-interface copy (verbatim, not a footnote):** "This record is hash-chained. It is not signed, and it cannot yet be checked by someone who does not trust elan1. That arrives at Assurance Level 2."
- **Links:** Open the object → `/records/object/:id`; Open the obligation (if any) → `/work/decide/:obl`; Open the meter event → `/assurance/meter?seq=`.
- **Not found:** "No proof entry #N exists in this tenant's chain. The chain currently ends at #4,110." (PROPOSED)
- **Sandbox entry:** a banner "Sandbox tenant — this entry can never be presented as a production one."
- **[L2]:** adds signature, key fingerprint, Merkle inclusion and anchor time, only with a level label.

#### S3. Chain standing, `/assurance/chain`
- **Source:** E06 dec. 3, E02 verify, E01 nightly verifier. **Design PROPOSED.**
- **Shows:**
  - Latest nightly verifier run (time, range, result three-valued, scope, count).
  - On-demand **Verify a range** form (seq from/to) → result: PASS, or "first failure with sequence, field and reason".
  - The verbatim limitation: "At L1, verify requires us".
  - A break is displayed as "break at seq 3,882 · prev_digest does not match #3,881 · P0 raised 02:11 IST".
- **Actions:** Verify a range; Open the entry at seq.

#### S4. Refusals, `/assurance/refusals`
- **Source:** Four Doors (Assurance admits "refusals").
- **Columns:** seq, time, write type, actor/kind, code (with plain title), class, rung, gate, meter (0).
- **Filters:** class, code, actor kind, channel.
- **Summary counts** by class. Platform class is shown separately as "our failures".
- **Register reference:** `/assurance/refusals/register` lists all codes (the §1.7 table). Whether to publish it publicly is an open question (E01 Q3).

#### S5. Coverage, `/assurance/coverage`
- **Source:** E05 §05 ("report live versus modelled coverage per write type"), E06 §05. **Design PROPOSED.**
- **Table:** write type, live proof entries, sandbox (modelled) entries, last verified, chain standing over it, and for each refusal code reachable, whether it has been seen in fixtures.
- **Headline:** "Live evidence for 3 of 23 write types".

#### S6. Meter, `/assurance/meter`
- **Source:** E06 §07 (moved to Assurance by the re-scope).
- **Shows:** "governed writes this period by write type, refusals separately, cost to date". The guard: "refusals show a quantity of zero, visibly, on the same table".
- **Columns:** write type, basis, committed quantity, refused (quantity 0), escalated (0), cost to date, and invoice line → the records it traces to (`/assurance/meter/:line` lists seq entries).
- **Reconciliation status:** "Reconciled nightly in both directions · last run 02:30 IST · 0 mismatches".
- **Sandbox tenant:** "Sandbox events — quantity zero, not billed."
- **L1 pricing note:** "elan1 is included in your rung1 plan" (E07 §04).

#### S7. Enforcement mode, `/assurance/enforcement`
- **Source:** Four Doors, E05 §02.
- **Per write type and channel:** mode (**Enforced · credential custody** / **Enforced · token acceptance** / **Attested advisory**), set at declaration version, and the truthful claim sentence for each mode (verbatim, E05):
  - Enforced: "This write could not have occurred without passing the gates."
  - Attested advisory: "Every proposed write was evaluated against a versioned policy and the decision is recorded."
- **Banner for advisory:** "In this mode the caller holds the credential. elan1 evaluated and recorded every attempt, including refusals; it did not perform the write."

#### S8. Levels and the L1/L2 boundary, `/assurance/levels`
- **Source:** E07 §§02–07.
- **Shows:** current level, the comparison table (L1/L2/L3), and "What you may say to your regulator" (E07 §07).
  - L1: "Our agents cannot write to our books without passing rules we set, a person approves anything material, and we have an unbroken internal record of every attempt including the refusals."
- **L1 → L2 readiness checklist:** the seven items, rendered three-valued. At L1 most read "not available — arrives at L2".
- **After an upgrade [L2]:** "the boundary date and the count on each side of it"; "Records written before the upgrade stay L1 and are labelled L1 forever."

#### S9. Evidence export, `/assurance/export` [L2]
- **At L1, an honest locked state:** "Evidence export arrives at Assurance Level 2 (Phase 3, Q3 2027). At L1 there is no bundle and no offline verifier, because a bundle we could not verify offline would promise something the chain cannot yet support." No button.
- **Allowed at L1 (PROPOSED):** an "internal audit view" of proof entries for a range, labelled "Internal record — requires elan1 to check". It is **not** a bundle.
- **rung1 "Export audit pack":** see §7.

#### S10. Readiness / L1 definition of done, `/assurance/readiness` (internal ops; PROPOSED placement)
- The 10 done items (E01 §06) and the conformance tests C1–C14 (E02 §08), each three-valued (passed / failed / not measured) with "how we know".

### 2.5 Public site (layout `public`)

| Route | Screen | Content (sourced) |
|---|---|---|
| `/` (or `#/site`) | Home | Lead line (E01 rule, "Lead with it"): **"A model may produce a write intent. It may never produce an allow."** Also "Every governed write climbs the same ten checks in the same order, and each one leaves a row behind." The nine rungs diagram. Four Doors. Allowed claims only (§5) |
| `/site/how-it-works` | Right Path | Rungs table, three walkthroughs (allowed / refused / escalated) with Rekha, ar-agent and Venkat |
| `/site/ontology` | The elan1 Ontology | Seven blocks sentence; "attested by transactions that cleared, not extracted from documents"; Palantir mapping table (E03 §08), honest direction included |
| `/site/levels` | Assurance Levels | L1/L2/L3 comparison; "L1 says the write was controlled…"; roadmap dates |
| `/site/pricing` | Pricing | See §6 |
| `/site/compare` | Competitive position | Matrix v3 (E08), the "designed is not yes" rule, elan1's own row all **No** |
| `/site/enforcement` | Two modes | Enforced vs Attested advisory table (E05 §02) |
| `/site/developers` | Developers landing | → developer surfaces |
| `/site/partners` | Design partners | "Pre-revenue. No customer yet"; 10 design-partner slots (E08 threat 8); pre-GA agreement |

### 2.6 Auth (layout `auth`), all PROPOSED; the docs don't specify them

| Route | Screen | Notes |
|---|---|---|
| `/login` | Sign in | Email plus SSO. The tenant comes from the token and is never typed |
| `/login/verify` | One-time code | 44px targets |
| `/invite/:token` | Accept invitation | Shows the role and the write types this role may approve |
| `/select-tenant` | Choose workspace | Tenant list with residency, environment and level |
| `/signed-out` | Signed out | — |

### 2.7 Onboarding and developer (layouts `doc` / `console`)

| Route | Screen | Content (E05 §11 unless noted) |
|---|---|---|
| `/onboarding` | Onboarding checklist (12 steps) | Steps 1–12 with state; "Phase 1 has no self-serve production access"; "We check items 3, 5, 8 and 11 before issuing them" |
| `/onboarding/agreement` | Pre-GA agreement | Step 1 |
| `/onboarding/mode` | Choose your mode, in writing | Attested advisory vs Enforced (credential custody / token acceptance); "Say which mode a deployment is in, in writing, on the first call" (E01) |
| `/onboarding/sandbox` | Your sandbox key | Key shown once; reference tenant fixtures |
| `/developers` | Developer home | SDK vs MCP vs HTTP |
| `/developers/quickstart` | Quickstart | stage.write first, then act.write; three outcomes |
| `/developers/mcp` | MCP tools | Tools table, scopes 18/10/6, hash-pinned descriptions |
| `/developers/api` | HTTP reference | Endpoint families, token classes, headers |
| `/developers/sdk` | SDK (six calls) | define · assert · seal · verify · scope · refuse |
| `/developers/errors` | Error taxonomy | Table §1.14; "Clients retry 4xx. That is why a refusal is never a 4xx." |
| `/developers/refusals` | Refusal register | §1.7 |
| `/developers/webhooks` | Webhooks | 7 events, HMAC headers, seq-gap detection |
| `/developers/conformance` | Conformance tests | C1–C14; "The suite is the claim." |
| `/developers/versioning` | Versioning and deprecation | 12-month sunset; codes "never renumbered and never reused" |

### 2.8 Mobile and channels

| Route | Screen | Notes |
|---|---|---|
| `/m/approvals` | Mobile approvals (layout `mobile`) | Same data as W1; cards; 44px |
| `/m/decide/:id` | Mobile Decide | Diff collapsed to changed fields only; Show all fields; Approve and Reject separated by a gap |
| `/channels/whatsapp` | WhatsApp preview (template and reply states) | See flow F9 |
| `/channels/voice` | rung1 Voice call script preview | See flow F10 |
| `/channels/email` | E-mail notification preview | PROPOSED |

### 2.9 Global states (not routes, but every screen needs them)

- **G-banner Tenant stopped:** "This workspace is stopped ({cause class}) since {time}, by {name} with {second approver}. No writes, including refusals, are being recorded." Action: View stop event.
- **G-banner Platform incident:** "We have a platform problem. Nothing is being approved or written without you, and approval deadlines are paused."
- **G-banner Sandbox tenant:** "Sandbox tenant · synthetic data · not billed."
- **G-banner Deprecated API version:** "Your integration uses /v1 which is deprecated. It keeps working unchanged until {sunset date}."
- **404:** "No screen lives at this address. Everything in elan1 is behind one of four doors: Work, Records, Agents, Assurance."

---

## 3. Key flows (step → screen)

### F1. Approve (agent proposes, human approves). Source: E04 Flow 3, E06 §03
Setup: ar-agent is A2 Propose. It submits erp.sales_invoice.submit for ACME Textiles at ₹2,40,000, inside the ₹3,00,000 credit limit. Resolver group: ar-approvers. Expiry: 4 h.

1. The agent calls `act.write`. Rungs 0b–5 pass, every gate is green, and evaluate() returns allow at policy 11. *(no screen; kernel)*
2. Rung 6 resolves A2 → **escalate**. An obligation is created (write_id, level, expiry, resolvers) and seals **proof #4,099**. The agent gets `outcome: escalated`, the `obligation_id` and the `write.escalated` webhook. "It stops; it does not retry."
3. Notifications go out on web, WhatsApp and e-mail (F9). Venkat opens **Approvals** `/work/approvals`. The row shows: "Submit invoice · ACME Textiles · ₹2,40,000 · ar-agent · Agent · 5 of 5 passed · 3 h 12 min".
4. He opens **Decide** `/work/decide/OB-2026-0412`. Above the fold: proposal, **Agent**, deadline, blast radius One counterparty. Below: the diff, 5 gate rows ("Precondition (credit limit ₹3,00,000, exposure after this write ₹2,40,000) — passed"), "allow at policy version 11" and "the proposing agent is at A2 Propose; a person approves before anything is written."
5. **Approve** → confirm → "Recording your decision…". The resolution is a governed write and seals **#4,100**.
6. The original write is resubmitted with obligation_ref and climbs again. At rung 3, G4 finds a second named actor. At rung 7 it goes shadow sandbox → live, and it seals **#4,101** as committed. Meter: 1 × per counterparty.
7. The screen shows **"Approved · posted · proof #4,101"** with Open the record → `/records/object/SINV-2026-01187` and Reverse this (30 days) → `/work/reverse/w_8c21…`. The live region announces "Approved. Posted. Proof 4101." The agent receives `write.committed`.

Four proof entries can exist for one business decision: the escalation, the resolution, the resubmission, and (on expiry instead) the lapse.

### F2. Reject. Source: E04 Flow 3 refusal path, E06 §03
1–4. As in F1.
5. **Reject** opens the reason field: "at least a sentence". The confirm button is disabled until the reason is valid.
6. "Recording your decision…". The obligation resolves as declined and seals a record (e.g. **#4,109**) with the reason text.
7. The original write "is never resubmitted". The agent is told `POLICY.APPROVAL_DECLINED` (webhook `obligation.resolved`, outcome declined).
8. Screen state `?state=rejected`: "Rejected · recorded · proof #4,109" (PROPOSED wording). The proposer's Not done screen shows "Not done — the approver rejected it", with the reason and the action "Address the approver's basis and resubmit".

### F3. Dual-control refusal (same actor). Source: E06 §03, E02 C11, E03 §06
1. Ravi (Finance manager) proposed erp.credit_note.submit CN-2026-00077 himself, then opens it in Decide.
2. He presses Approve. His resolution climbs the ladder and G4 refuses it with `GATE.DUAL_CONTROL_SAME_ACTOR`. That is a proof entry (e.g. #4,096) metered at zero.
3. Decide `?state=same-actor`: "You proposed this, so you cannot also approve it. Send it to: [Venkat Raman · Accounts head] [Meenakshi Iyer · Owner]". Send to lists **people only**.
4. **Send to Venkat**. The obligation's resolver set is notified. Toast: "Sent to Venkat Raman. You will see the outcome here."
5. The same pattern applies in Studio Certify, where the author can't certify their own declaration version.

### F4. Shadow-sandbox divergence after approval. Source: E04 rung 7, E06 §03 failure path, E02 codes
1. Venkat approves stock-agent's erp.stock_entry.submit (F1 steps 1–5).
2. At rung 7: snapshot → shadow sandbox apply → gates pass → live apply → the live re-run disagrees (bin quantity changed in between) → snapshot restored → `GATE.SANDBOX_DIVERGED`. The refusal seals **#4,112** at zero.
3. Decide shows `?state=write-failed`: "Your approval was recorded. The write itself did not complete, and nothing was changed. We have been paged." Links: the record of your approval (#N), and See why → `/work/not-done/4112`.
4. Not done: "Not done — the check on your live books disagreed". The operator action is "Snapshot restored. Investigate before resubmitting". A side-by-side table shows the sandbox result vs the live re-run for the gate that differed (PROPOSED).
5. Note: E02 Q3 is still open on whether this code is gate or platform class. If it becomes platform, use the blunt "our failure" copy and page.

### F5. Refusal explanation (agent refused). Source: E04 Flow 2, E06 §04
1. ar-agent proposes a Sales Invoice for ACME Textiles at ₹4,20,000. ACME's credit limit is ₹3,00,000.
2. Rungs 0b–2 pass (actor_kind = agent, set by the kernel). At rung 3, G9 precondition `credit_exposure + amount ≤ credit_limit` fails. Every other gate still runs and records.
3. It seals **#4,098** as a refusal (record_id zero-UUID) and meters zero. The agent gets HTTP 200 with `outcome: refused`, `GATE.PRECONDITION_FAILED`, rung 3, gate G9, seq and digest.
4. Rekha sees it in **Work → Not done** `/work/not-done` → `/work/not-done/4098`: "Not done — credit limit" with the one-line reason, the declared limit ₹3,00,000, current exposure plus this invoice ₹4,20,000, declaration erp.ar v7 and the time.
5. Actions: **Request a limit change** → `/work/request/erp.credit_limit.change?customer=ACME%20Textiles` (a governed write that escalates, OB-2026-0414) or **Reduce the invoice** → `/work/request/erp.sales_invoice.submit?from=4098`. **Show the record of this refusal** → `/assurance/proof/4098`.

### F6. Studio: author → validate → simulate → certify → compile. Source: E03 §06, E06 §06, E02 define
1. `/records/studio/erp.ar/author`: Farah Sheikh (declaration author, elan1) opens erp.ar as draft **v8**. She adds erp.sales_invoice.cancel. The right pane previews the compiled Decide screen.
2. She types "tbd" in `reversal_plan`. Inline copy: "An honest unknown needs a sentence. What would change your answer?"
3. `/validate` fails: "L0-S03 — sales_invoice.cancel declares neither a reversal plan nor irreversible: true. Every write type must say which it is." The message is pinned to block 4 · write_types · sales_invoice.cancel. LN-05 warns that intent is under 40 characters.
4. She sets `irreversible: true` (which forces One counterparty or wider and bars auto-approval). Validate now reads **Valid** with 1 lint warning (LN-07: schedule disabled without ADR → she adds ADR-0142).
5. `/simulate` runs against the reference tenant fixtures (never production). Per write type it shows gates in order, blast radius, meter basis and refusals produced (e.g. GATE.COUNTERPARTY_UNKNOWN ×2, GATE.DUAL_CONTROL_PENDING ×5). A write type with zero refusals gets the warning banner.
6. `/certify`: Farah presses Certify this version and is refused (`GATE.DUAL_CONTROL_SAME_ACTOR`): "You wrote this version, so you cannot also certify it." She uses **Send to Arjun Mehta**.
7. Arjun (elan1 lead) presses **Certify this version**. It's a governed write with dual control and seals a record. Screen: "Certified · erp.ar v8 · by Arjun Mehta · proof #4,113 · compiled digest 3b9e…c41d". Webhook `declaration.certified`.
8. COMPILE produces the surface plan, registry entries and meter basis per write type. Version 8 becomes resolvable, and writes pinned to v7 keep resolving v7.
9. Failure: registry down → "PLATFORM.REGISTRY_UNAVAILABLE — nothing was registered. Try again; it is safe."

### F7. Stop switch. Source: E06 §07, E04 rung 0b, E02, E05 webhooks
1. Records → Tenants → `/records/tenants/nilgiri-tea` → **Stop this tenant**.
2. The dialog requires a **cause class** (PROPOSED list: suspected credential exposure · agent misbehaviour · customer request · residency concern · platform incident) and a reason. The warning copy states that the stop "stops all writes including refusals" and asks for a second approver.
3. Throwing the stop is a governed write with dual control, so it creates an obligation. The second approver resolves it in Decide. The stop event seals its own record.
4. The tenant turns **Stopped**. Every console for that tenant shows the G-banner. Every assert returns `POLICY.TENANT_STOPPED` "carrying the reason class and the time the stop was set" and writes **no chain entry**. Webhook `tenant.stopped`.
5. Agents' Not done shows "Not done — this workspace is stopped (suspected credential exposure) since 24 Sep 2026, 16:05 IST". There's no proof link, with this explanation: "A stopped workspace writes nothing, so this refusal has no proof record. The stop itself is proof #N."
6. Lift stop: PROPOSED as the same dual-control pattern.

### F8. Key rotation. Source: E06 §07 (rotation window), E05 (production keys issued by us). Flow PROPOSED
1. Agents → Keys `/agents/keys`. The row for sk_live_…9c1e reads "rotate by 21 Dec 2026 · 88 days left". The row turns "warning" (with a word) 14 days before the date.
2. **Rotate** → `/agents/keys/:id/rotate`.
   - **Production key:** the tenant can't self-rotate at Phase 1. The button reads **Request rotation from elan1**, which creates a request (PROPOSED as a governed write: `platform.key.rotate`, dual control).
   - **Sandbox key:** self-serve. A new key is shown once, with **Copy** and the text "We will not show this again." The old key keeps working for an overlap window (PROPOSED 24 h), then is revoked.
3. The keys table shows both keys during the overlap, with last-used timestamps, so the developer can see traffic moving across.
4. [L2] Signing-key rotation (successor key registered, rotation window per residency domain) is a separate screen that isn't shown at L1.

### F9. WhatsApp approval. Source: E06 §08, E03 channels
1. An obligation is raised. The BSP template message goes to the approver (PROPOSED text; the doc supplies its elements):
   > elan1 · Approval needed · Kaveri Spinning Mills
   > Submit invoice to ACME Textiles, ₹2,40,000
   > Proposed by ar-agent (Agent)
   > 5 of 5 checks passed · expires 18:40 IST
   > Open the console to see the change and decide: https://…/#/m/decide/OB-2026-0412
2. **If the write type is declared `whatsapp_approve: true`** (low value, reversible, one_record), the message adds "Reply APPROVE or REJECT". The reply is "bound to the obligation id in the deep link, not to the message body, and it expires with the obligation". Confirmation reply: "Approved. Posted. Proof #4,1xx." (PROPOSED)
3. **Otherwise the only action is the deep link.** The template says so verbatim: "Open the console to see the change and decide." Any free-text "yes" gets the auto-reply (PROPOSED): "A reply here cannot approve this change. Open the console to see the change and decide."
4. The deep link opens `/m/decide/:id`. It requires sign-in if there's no session (then returns to the deep link).
5. Constraints for design: templates need BSP pre-approval, so submit them early. The session window is 24 h ("design for expiry"). Opt-out is honoured in the consent ledger and checked by G1.
6. Note the Channel Block example matrix, where messaging is read-only for rung1 invoices: "WhatsApp is easy to spoof and shouldn't be trusted to move money."

### F10. Voice approval (rung1 Voice). Source: Channel Block
1. The Collections Agent proposes cancelling INV-2026-0834 for ₹2 lakh (the customer returned goods). The gates run and it reaches `approval.finance_manager`.
2. rung1 Voice calls Ravi's registered number (the only outbound call allowed: "a call the platform places to a known approver's registered number"). The call states the request.
3. Ravi confirms his identity with a spoken confirmation and a one-time code, then says yes or no in Tamil or English.
4. The answer is recorded as the gate result. On yes, the remaining gates run and the write goes to Frappe.
5. The proof records "that the approval came through the Voice channel, along with the recording reference and the time". The Proof screen shows Channel: Voice · recording ref VR-2026-09-24-0192.
6. Voice "cannot create, edit or delete anything".

### F11. Allowed write by a person, then reverse. Source: E04 Flow 1, E01 §02
1. Rekha (A4 on this write type) opens **Work → New request → Record payment** `/work/request/erp.payment_entry.submit`. She fills in customer ACME Textiles, ₹1,12,500 and reference UTR, then presses **Confirm**.
2. "Checking…". Rungs 0b–2 pass. G1, G2 (Mumbai), G3, G7 and G9 (an open Sales Invoice exists for this amount) pass, giving 5 gate rows. Policy 11 allows. The radius is one counterparty and A4 is permitted.
3. Rung 7: snapshot → shadow sandbox → re-run → live via a single-use 10-minute credential → re-run on live → commit plus outbox. ERPNext returns PE-2026-00972.
4. It seals #4,097 and meters one counterparty. The screen reads "Payment recorded · proof #4,097" with a link to Records and **Reverse this**, valid 30 days.
5. Later, Reverse this → `/work/reverse/…`. The system chooses the fast path (snapshot restore) inside the window, and the reversal is itself a governed write with its own proof.

### F12. Obligation expiry. Source: E04, E05, E06
1. The obligation passes 4 h with no decision. It expires with `POLICY.OBLIGATION_EXPIRED`, "a governed event with its own proof entry" (e.g. #4,110). Webhook `obligation.expired`.
2. The row leaves Approvals and moves to the proposer's Not done: "Not done — nobody decided in time". Action: Resubmit.
3. During a platform outage, expiry is **paused** and the rows show "Expiry paused while we fix a problem".

### F13. Onboarding a third-party developer (SDK/MCP). Source: E05 §11 (12 steps), E01 §05
1. `/onboarding/agreement`: sign the pre-GA agreement.
2. `/onboarding/sandbox`: receive the sandbox key and the reference tenant's fixtures.
3. `/onboarding/mode`: **Choose your mode, in writing**: Attested advisory or Enforced (credential custody / token acceptance), plus who changes what. The screen shows the truthful claim for the choice and the forbidden sentences.
4. `/records/studio/new`: author the seven-block declaration, with no "n/a" or "tbd".
5. In Studio, declare blast radius and reversal plan per write type ("No reversal plan means no A3 or above").
6. Studio Validate → Simulate against the reference tenant.
7. `/developers/quickstart`: wire `stage.write` first and inspect the request object.
8. Prove all three outcomes in the sandbox tenant, including a real refusal and a real escalation resolved by a real human. The checklist ticks each one from proof entries marked mode: sandbox.
9. Idempotency: replaying a key returns the original seq, and the checklist verifies it.
10. `/agents/keys/webhooks`: register an endpoint, verify the signature and prove seq-gap detection.
11. Studio Certify by a named human.
12. **Request production keys**. elan1 checks items 3, 5, 8 and 11, then issues `sk_live_…`.

The checklist screen shows each step three-valued: done (with evidence link) / not done / not checked.

### F14. L1 build / readiness checklist (internal). Source: E01 §06, E02 §08, brief 08
- Screen: `/assurance/readiness`. It holds the 10 done items and C1–C14. Each shows its "how we know" and a status of **passed / failed / not measured** (never a bare tick).
- Items 1–7 are marked "hard gate"; 8–10 are marked "make the claim honest".
- Brief 08 adds operational items: security, tenancy, backup, restore drill, alerting, runbook, rollback. It also requires the kill criteria to be signed and the checklist to be "green before any customer is onboarded".

---

## 4. Sample data (consistent across screens)

Currency uses Indian grouping. Times are IST. Residency is domain `in`, hosted in Mumbai. GSTINs are synthetic but well-formed.

### 4.1 Tenants
| Tenant | Legal name | GSTIN | Host system | Residency | Env | Mode | Level | Status | Chain head |
|---|---|---|---|---|---|---|---|---|---|
| kaveri-spinning | Kaveri Spinning Mills Pvt Ltd, Tiruppur | 33AAACK4821M1Z7 | ERPNext (hosted) kaveri.rung1.in | in · Mumbai | Production | Enforced · credential custody | L1 Guarded | Live | #4,112 |
| deccan-auto | Deccan Auto Components Pvt Ltd, Pune | 27AADCD7719K1Z3 | ERPNext (hosted) deccan.rung1.in | in · Mumbai | Production | Enforced · credential custody | L1 Guarded | Live | #1,284 |
| sahyadri-agro | Sahyadri Agro Foods LLP, Nashik | 27ABDFS3321P1ZQ | ERPNext (hosted) | in · Mumbai | Production | Enforced | L1 Guarded | Onboarding | — |
| nilgiri-tea | Nilgiri Tea Traders Pvt Ltd, Coonoor | 33AADCN6604H1Z2 | ERPNext (hosted) | in · Mumbai | Production | Enforced | L1 Guarded | **Stopped** · suspected credential exposure · 24 Sep 16:05 · by Meenakshi Iyer + Arjun Mehta | #612 |
| ledgerloop-sbx | LedgerLoop Software Pvt Ltd, Bengaluru (design partner) | 29AAFCL5520Q1ZB | Sandbox ERPNext site | in · Mumbai | Sandbox tenant | **Attested advisory** (MCP) | L1 Guarded | Pre-GA | #318 (mode: sandbox) |
| ref-tenant | Reference tenant (synthetic fixtures) | — | Sandbox ERPNext | in · Mumbai | Sandbox tenant | Enforced | L1 Guarded | Reference | #10,000 (C9 suite) |

Future hosts named in the documents (for "Connected systems" roadmap chips): Tally, Zoho Books, Odoo (Enterprise); Twenty, Zoho CRM, HubSpot, Salesforce (Revenue); Shopify, Woo, ONDC, UCP (Commerce).

### 4.2 People (Kaveri tenant unless noted)
| Name | Role | Kind | May approve |
|---|---|---|---|
| Rekha Subramanian | Accounts executive | Person | no |
| Priya Nair | Accounts executive | Person | no |
| Venkat Raman | Accounts head (ar-approvers) | Person | yes |
| Ravi Shankar | Finance manager | Person | yes |
| Meenakshi Iyer | Owner | Person | yes |
| Farah Sheikh | Declaration author (elan1) | Person | — |
| Arjun Mehta | elan1 lead, certifier | Person | certify |
| nightly-verifier | System job | System | never |

### 4.3 Agents (10+)
| Agent | Owner | Model | Channel | Mode | Autonomy (examples) | Tools |
|---|---|---|---|---|---|---|
| ar-agent | Venkat Raman | claude-sonnet (via rung1) | SDK | Enforced | A2 Propose on erp.sales_invoice.submit | read.records, stage.write, act.write |
| rung1 drafting agent | Venkat Raman | claude-haiku | SDK | Enforced | A2 Propose on sales_invoice.submit (declaration caps it at A2) | 3 |
| Invoice Agent | Rekha Subramanian | claude-sonnet | Agent | Enforced | A1 Draft on erp.sales_invoice.submit | 4 |
| Collections Agent | Ravi Shankar | claude-sonnet | Agent | Enforced | A2 Propose on erp.sales_invoice.cancel | 5 |
| ap-agent | Ravi Shankar | gpt-4.1-mini | SDK | Enforced | A3 Act reversible on erp.purchase_invoice.submit; A2 on erp.purchase_order.submit | 6 |
| bank-recon-agent | Rekha Subramanian | llama-3.1-70b (stack1 gateway) | SDK | Enforced | A3 Act reversible on erp.payment_entry.submit | 4 |
| stock-agent | Priya Nair | claude-haiku | SDK | Enforced | A4 Act bounded on erp.stock_entry.submit | 3 |
| gst-agent | Venkat Raman | sarvam-m | SDK | Enforced | A1 Draft on erp.gstr1.file | 2 |
| close-agent (overnight) | Meenakshi Iyer | claude-sonnet | SDK | Enforced | A1 Draft on erp.period.close | 3 |
| vendor-onboarding agent | Priya Nair | gpt-4.1-mini | MCP | Enforced | **A0 Observe (no grant)** on erp.supplier.create | 2 |
| LedgerLoop billing agent | LedgerLoop (design partner) | their own | MCP | **Attested advisory** | A2 Propose on ll.invoice.post | 7 |
| stack1 P3 automation agent | Deccan Auto (tenant) | stack1 gateway | SDK | Enforced | A1 Draft on erp.journal_entry.submit | 4 |

A description-change example for the Agents screen: ar-agent's tool `act.write` description hash changes from `d41c…07aa` (erp.ar v6) to `9e02…b3f1` (erp.ar v7). It is shown as "Description changed · version change · certified by Arjun Mehta, 19 Sep 2026".

### 4.4 Write types (15+)
| Write type | Label | Blast radius | Dual control | Reversal | Gates (declared order) | Channels | Notes |
|---|---|---|---|---|---|---|---|
| erp.sales_invoice.submit | Submit invoice | One counterparty | above ₹2,00,000 | target_native_undo 24 h (cancel IRN) → compensating_entry (credit note) | consent, residency, retention, counterparty, precondition, dual_control, budget | web, mcp (submit); web, mobile, WhatsApp (approve) | E03 worked example |
| erp.sales_invoice.cancel | Cancel invoice | One counterparty | yes | **Irreversible** | consent, residency, retention, counterparty, precondition, dual_control | web; voice (approve only); API ✗ | never auto-approved |
| erp.payment_entry.submit | Record payment | One counterparty | no | snapshot_restore 720 h → compensating_entry | consent, residency, retention, counterparty, precondition | web, api | E04 Flow 1 |
| erp.purchase_order.submit | Submit purchase order | One counterparty | above ₹5,00,000 | target_native_undo 720 h | consent, residency, retention, counterparty, precondition, dual_control, budget | web, api | E02 "₹5 lakh limit" copy |
| erp.purchase_invoice.submit | Book supplier bill | One counterparty | above ₹2,00,000 | compensating_entry (debit note) | …, precondition (PO and GRN cross-checked) | web, api, mcp | |
| erp.credit_note.submit | Raise credit note | One counterparty | yes | compensating_entry | …, dual_control | web | the forward path for invoices |
| erp.credit_limit.change | Change credit limit | One counterparty | yes | snapshot_restore 720 h | consent, residency, retention, counterparty, precondition, dual_control | web | "Request a limit change" |
| erp.customer.create | Add customer | One record | no | snapshot_restore 720 h | consent, residency, retention, counterparty, precondition | web, api | |
| erp.supplier.create | Add supplier | One record | no | snapshot_restore 720 h | consent, residency, retention, counterparty, precondition | web, api, mcp | |
| erp.journal_entry.submit | Post journal entry | One record | above ₹1,00,000 | compensating_entry | …, schedule (period open window) | web | |
| erp.stock_entry.submit | Move stock | One record | no | target_native_undo 720 h | consent, residency, retention, counterparty, precondition, rate | web, api | whatsapp_approve: true candidate |
| erp.price_list.update | Update price list | Batch | yes | snapshot_restore 168 h | …, rate | web | |
| erp.payment_run.submit | Release supplier payment run | Batch | yes | **Irreversible** | …, dual_control, budget, schedule | web; voice (approve only) | money leaves the bank |
| erp.period.close | Close accounting period | Whole tenant | yes (forced) | target_native_undo 72 h (reopen) | …, dual_control | web | |
| erp.gstr1.file | File GSTR-1 | Crosses an organisation boundary | yes (forced) | **Irreversible** | …, dual_control, schedule | web | proof_binding must be non-empty |
| platform.declaration.certify | Certify declaration version | Whole tenant | yes | **Irreversible** (versions immutable) | … | web | E03 |
| platform.tenant.stop | Stop tenant | Whole tenant | yes | target_native_undo (lift stop) | … | web | E06 |
| platform.autonomy.grant | Change autonomy grant | One record | yes | snapshot_restore | … | web | E02 |
| platform.obligation.resolve | Approve or reject | One record | G4 by definition | — | … | web, mobile, WhatsApp, voice | every approval |
| platform.breakglass | Break-glass | Whole tenant | yes | — | … | web | "no admin mode" |

### 4.5 Obligations (Approvals queue, now = 24 Sep 2026, 15:28 IST)
| Obligation | Proposal | Proposed by | Kind | Amount / radius | Checks | Expires | Waiting on |
|---|---|---|---|---|---|---|---|
| OB-2026-0412 | Submit invoice SINV-2026-01187 · ACME Textiles | ar-agent | Agent | ₹2,40,000 | 5 of 5 passed | 3 h 12 min | Venkat Raman (ar-approvers) |
| OB-2026-0411 | Release supplier payment run · 14 suppliers | ap-agent | Agent | ₹18,42,760 · Batch | 8 of 8 passed | 52 min | Ravi Shankar + Meenakshi Iyer |
| OB-2026-0414 | Change credit limit · ACME Textiles · ₹3,00,000 → ₹5,00,000 | Rekha Subramanian | Person | One counterparty | 6 of 6 passed | 3 h 58 min | Venkat Raman |
| OB-2026-0415 | Submit purchase order PO-2026-00321 · Coimbatore Castings Pvt Ltd | ap-agent | Agent | ₹6,80,000 | 7 of 7 passed | 1 h 40 min | Ravi Shankar |
| OB-2026-0416 | Book supplier bill · Coimbatore Castings Pvt Ltd | ap-agent | Agent | ₹2,86,440 | 7 of 7 passed | 2 h 05 min | Venkat Raman |
| OB-2026-0417 | Cancel invoice INV-2026-0834 · Shree Murugan Traders | Collections Agent | Agent | ₹2,00,000 · Irreversible | 6 of 6 passed | 38 min | Ravi Shankar (voice) |
| OB-2026-0418 | Raise credit note CN-2026-00077 · ACME Textiles | Ravi Shankar | Person | ₹48,300 | 6 of 6 passed | 2 h 51 min | Venkat Raman / Meenakshi Iyer |
| OB-2026-0419 | Close accounting period · August 2026 | close-agent | Agent | Whole tenant | 6 of 6 passed | 3 h 55 min | Meenakshi Iyer + Ravi Shankar |
| OB-2026-0420 | File GSTR-1 · August 2026 · 412 invoices | gst-agent | Agent | Crosses an organisation boundary | 7 of 7 passed | 3 h 59 min | Meenakshi Iyer |
| OB-2026-0421 | Update price list · Yarn 40s combed · 38 items | Invoice Agent | Agent | Batch · 38 records | 7 of 7 passed | 1 h 12 min | Venkat Raman |
| OB-2026-0422 | Post journal entry · Freight provision Sep | Priya Nair | Person | ₹1,35,000 | 6 of 6 passed | 2 h 20 min | Venkat Raman |
| OB-2026-0423 | Move stock · 1,200 kg cotton to Mill 2 | stock-agent | Agent | One record | 6 of 6 passed | 44 min | Priya Nair (WhatsApp reply allowed) |
| OB-2026-0424 | Certify declaration erp.ar v8 | Farah Sheikh | Person | Whole tenant | 1 of 1 passed | 23 h 10 min | Arjun Mehta |
| OB-2026-0425 | Raise autonomy · bank-recon-agent · erp.payment_entry.submit A3 → A4 | Rekha Subramanian | Person | One record | 5 of 5 passed | 3 h 30 min | Meenakshi Iyer |

Resolved and expired, for timelines: OB-2026-0409 (approved by Venkat, #4,094), OB-2026-0410 (price list, rejected by Venkat: "Margin on 40s combed falls below 6%; recheck with sales before changing.", #4,109), OB-2026-0405 (expired, #4,110), OB-2026-0413 (voice-approved by Ravi, #4,104).

### 4.6 Proof entries (Kaveri Spinning Mills chain; mode live unless noted; digests shortened)
| seq | Time (24 Sep) | Write type | Actor · kind · level | Outcome | Code / note | Object | prev_digest → digest | Meter |
|---|---|---|---|---|---|---|---|---|
| 4,090 | 10:02 | erp.supplier.create | Priya Nair · Person · A3 | Committed | — | Coimbatore Castings Pvt Ltd (33AAECC9120B1Z4) | 71e0…c2d9 → a3f9…5e2b | 1 per record |
| 4,091 | 10:19 | erp.purchase_invoice.submit | ap-agent · Agent · A3 | Committed | — | ACC-PINV-2026-00541 · ₹1,86,440 | a3f9…5e2b → 0c7d…91fa | 1 per counterparty |
| 4,092 | 10:44 | erp.sales_invoice.submit | Invoice Agent · Agent · A1 | Refused | GATE.COUNTERPARTY_UNKNOWN (G7) | Shree Ganesh Handlooms (unregistered) | 0c7d…91fa → 5b12…e804 | 0 |
| 4,093 | 11:03 | erp.purchase_order.submit | ap-agent · Agent · A2 | Escalated | OB-2026-0409 · dual control above ₹5 lakh | PO-2026-00318 · ₹6,20,000 | 5b12…e804 → e9aa…1370 | 0 |
| 4,094 | 11:21 | platform.obligation.resolve | Venkat Raman · Person | Committed (approve) | resolves OB-2026-0409 | — | e9aa…1370 → 2f64…a0cb | 1 per record |
| 4,095 | 11:21 | erp.purchase_order.submit | ap-agent · Agent · A2 | Committed | resubmission, obligation_ref OB-0409 | PO-2026-00318 | 2f64…a0cb → 8d3e…77c1 | 1 per counterparty |
| 4,096 | 11:40 | platform.obligation.resolve | Ravi Shankar · Person | Refused | GATE.DUAL_CONTROL_SAME_ACTOR (G4) | OB-2026-0418 | 8d3e…77c1 → c150…4b9e | 0 |
| 4,097 | 11:42 | erp.payment_entry.submit | Rekha Subramanian · Person · A4 | Committed | undo until 24 Oct 2026 11:42 | PE-2026-00972 · ACME Textiles · ₹1,12,500 | c150…4b9e → 64ab…d2f0 | 1 per counterparty |
| 4,098 | 14:07 | erp.sales_invoice.submit | ar-agent · Agent · A3 | Refused | GATE.PRECONDITION_FAILED (G9) credit limit | ACME Textiles · ₹4,20,000 | 64ab…d2f0 → 1e9c…83a5 | 0 |
| 4,099 | 14:16 | erp.sales_invoice.submit | ar-agent · Agent · A2 | Escalated | OB-2026-0412 | ACME Textiles · ₹2,40,000 | 1e9c…83a5 → b7f2…0e61 | 0 |
| 4,100 | 15:02 | platform.obligation.resolve | Venkat Raman · Person | Committed (approve) | resolves OB-2026-0412 | — | b7f2…0e61 → 4c08…f93d | 1 per record |
| 4,101 | 15:02 | erp.sales_invoice.submit | ar-agent · Agent · A2 | Committed | IRN requested; undo until 25 Sep 15:02 (IRN), 24 Oct (credit note) | SINV-2026-01187 · ₹2,40,000 | 4c08…f93d → 9a51…2c7e | 1 per counterparty |
| 4,102 | 15:10 | erp.payment_entry.submit | bank-recon-agent · Agent · A3 | Refused | PLATFORM.TARGET_UNREACHABLE (rung 7) — paged | UTR 426817 · ₹75,000 | 9a51…2c7e → d6e3…1b48 | 0 (not billable) |
| 4,103 | 15:12 | erp.sales_invoice.cancel | Collections Agent · Agent · A2 | Escalated | OB-2026-0413 | INV-2026-0834 · ₹2,00,000 | d6e3…1b48 → 7702…ae19 | 0 |
| 4,104 | 15:19 | platform.obligation.resolve | Ravi Shankar · Person | Committed (approve, **Voice**) | recording ref VR-2026-09-24-0192 | OB-2026-0413 | 7702…ae19 → 3fb0…6c55 | 1 per record |
| 4,105 | 15:19 | erp.sales_invoice.cancel | Collections Agent · Agent · A2 | Committed | irreversible | INV-2026-0834 | 3fb0…6c55 → e18d…09b2 | 1 per counterparty |
| 4,106 | 15:21 | erp.supplier.create | vendor-onboarding agent · Agent · **A0 (no grant)** | Refused | POLICY.AUTONOMY_INSUFFICIENT (rung 6) | Palani Dyes & Chemicals | e18d…09b2 → 5a7c…d3e0 | 0 |
| 4,107 | 15:22 | erp.credit_limit.change | Rekha Subramanian · Person · A2 | Escalated | OB-2026-0414 | ACME Textiles | 5a7c…d3e0 → 0bd4…71f8 | 0 |
| 4,108 | 15:24 | erp.sales_invoice.submit | rung1 drafting agent · Agent · A2 | Refused | GATE.BUDGET_EXHAUSTED (G6) — 250 drafts this period | Lakshmi Garments | 0bd4…71f8 → c9e1…4a02 | 0 |
| 4,109 | 15:25 | platform.obligation.resolve | Venkat Raman · Person | Committed (reject) | OB-2026-0410 → original write told POLICY.APPROVAL_DECLINED | price list update | c9e1…4a02 → 62f7…b8d9 | 1 per record |
| 4,110 | 15:26 | erp.journal_entry.submit | close-agent · Agent · A1 | Refused | POLICY.OBLIGATION_EXPIRED (OB-2026-0405 lapsed) | JV provision | 62f7…b8d9 → 18ac…e57d | 0 |
| 4,111 | 15:27 | erp.payment_run.submit | ap-agent · Agent · A2 | Escalated | OB-2026-0411 | 14 suppliers · ₹18,42,760 | 18ac…e57d → f04b…2d96 | 0 |
| 4,112 | 15:28 | erp.stock_entry.submit | stock-agent · Agent · A4 | Refused | GATE.SANDBOX_DIVERGED — snapshot restored | STE-2026-02214 | f04b…2d96 → a8e2…07c3 | 0 |

A sandbox-chain example (ledgerloop-sbx) for the mode banner: #318 · ll.invoice.post · LedgerLoop billing agent · Refused GATE.DUAL_CONTROL_PENDING · **mode: sandbox** · enforcement: Attested advisory.

Chain standing sample: "continuous · seq 1–4,112 · 19 of 23 write types · checked nightly 02:10 IST". On Deccan Auto: "not checked over this range · seq 1,201–1,284 · written after last night's run". The incident example: "break at seq 3,882 · prev_digest mismatch · P0 raised 02:11 IST" (use only in the incident-state mock).

### 4.7 Refusal examples (rendered copy)
- #4,098: **Not done — credit limit.** "An invoice may not take a customer above their credit limit. Limit ₹3,00,000 · exposure after this invoice ₹4,20,000 · erp.ar v7 · 24 Sep 2026, 14:07." Buttons: Request a limit change · Reduce the invoice · Show the record of this refusal.
- #4,092: **Not done — counterparty not registered.** "Shree Ganesh Handlooms is not a registered customer with a validated GSTIN." Button: Register it (Open in ERPNext).
- #4,106: **Not done — autonomy too low.** "vendor-onboarding agent has no grant for Add supplier, so it is at A0 Observe (no grant). Add supplier needs A2 Propose." Buttons: Request a grant change · Route to approval.
- #4,108: **Not done — budget used up for this period.** "rung1 drafting agent has used 250 of 250 drafts declared for September." Button: Raise the budget.
- #4,102: **Our failure — ERPNext did not answer.** "This is our failure, not a rule. Nothing was changed, you have not been billed, and we have been paged."
- Dual control (E02 verbatim): "Blocked at Dual control — this purchase order is above your ₹5 lakh limit and needs a second approver. Request approval."
- Policy (E02 verbatim): "Rule set 7 does not permit this write type from an agent. Ask an owner to submit it, or change the permission."

### 4.8 Keys
| Key | Class | Env | Bound actor · level | Scopes | Created | Last used | Rotate by | Status |
|---|---|---|---|---|---|---|---|---|
| sk_live_…9c1e | tenant token | Production (kaveri-spinning) | ar-agent · A2 | act | 02 Sep 2026 | 24 Sep 15:02 | 01 Dec 2026 | Active · issued by elan1 |
| sk_live_…3d07 | tenant token | Production | Collections Agent · A2 | act | 02 Sep 2026 | 24 Sep 15:12 | 01 Dec 2026 | Active |
| sk_live_…71b2 | tenant token | Production | bank-recon-agent · A3 | act | 05 Sep 2026 | 24 Sep 15:10 | 04 Dec 2026 | Active |
| sk_live_…0a5c | tenant token | Production | ap-agent · A3 | act | 12 Jun 2026 | 02 Sep 2026 | — | Revoked (rotated 02 Sep) |
| sk_sbx_…4f2a | tenant token | Sandbox tenant (ledgerloop-sbx) | LedgerLoop billing agent · A2 | stage, act | 15 Sep 2026 | 24 Sep 13:55 | 14 Dec 2026 | Active · 10 writes/min, 2 concurrent |
| sk_sbx_…b811 | tenant token | Sandbox tenant (ref-tenant) | Farah Sheikh · A4 | ro, stage, act | 01 Sep 2026 | 24 Sep 12:30 | 30 Nov 2026 | Active |
| ctl_…77aa | control token | Studio and registry | Farah Sheikh | ctl | 01 Sep 2026 | 24 Sep 15:05 | 30 Nov 2026 | Active · cannot reach a record store |
| ops_…e021 | ops token | read-only, no tenant data | on-call | ro | 01 Sep 2026 | 24 Sep 02:11 | 30 Nov 2026 | Active |

### 4.9 Meter (Kaveri Spinning Mills, 1–24 Sep 2026)
| Write type | Basis | Committed | Refused (qty 0) | Escalated (qty 0) |
|---|---|---|---|---|
| erp.sales_invoice.submit | per counterparty | 1,184 | 97 | 212 |
| erp.payment_entry.submit | per counterparty | 906 | 14 | 0 |
| erp.purchase_invoice.submit | per counterparty | 441 | 22 | 61 |
| erp.purchase_order.submit | per counterparty | 118 | 6 | 34 |
| erp.stock_entry.submit | per record | 732 | 9 | 3 |
| erp.supplier.create / customer.create | per record | 27 | 11 | 0 |
| erp.price_list.update | per batch | 4 | 0 | 4 |
| erp.payment_run.submit | per batch | 3 | 0 | 3 |
| platform.obligation.resolve | per record | 318 | 12 | — |
| **Total** | | **3,733 billable** | **171 · ₹0** | **317 · ₹0** |

Cost line: "Included in your rung1 plan (₹19,999 / month band). Cost per governed action, published weekly: [unverified] — not yet measured." Reconciliation: "Reconciled nightly in both directions · 23 Sep 02:30 IST · 0 mismatches".

### 4.10 Declaration versions
| Declaration | Name | Owner role | Version | Certified by | Date | Compiled digest | Change |
|---|---|---|---|---|---|---|---|
| erp.ar | rung1 — Accounts receivable (ERPNext) | Accounts head | v5 | Arjun Mehta | 04 Sep 2026 | 55d0…19ea | added erp.credit_note.submit |
| | | | v6 | Arjun Mehta | 11 Sep 2026 | 0a7f…c6b3 | tightened precondition (duplicate invoice number) |
| | | | **v7 (in force)** | Arjun Mehta | 19 Sep 2026 | 7e41…d80f | ar-agent act.write description hash changed |
| | | | v8 (draft) | — | — | — | adds erp.sales_invoice.cancel (irreversible); awaiting certification OB-2026-0424 |
| sales_invoice | rung1 — Sales invoicing (ERPNext) | Accounts head | v4 | Arjun Mehta | 18 Sep 2026 | 3b9e…c41d | dual control above ₹2 lakh |
| erp.ap | rung1 — Accounts payable (ERPNext) | Finance manager | v5 | Arjun Mehta | 17 Sep 2026 | 92cc…4e10 | PO and GRN cross-check |
| erp.stock | rung1 — Stock movements (ERPNext) | Stores head | v3 | Arjun Mehta | 12 Sep 2026 | c3a8…77f2 | whatsapp_approve on stock_entry |
| platform | elan1 Platform | elan1 lead | v3 | Kavya Menon | 20 Sep 2026 | 1f06…ab54 | break-glass declared |

Policy (rule set) versions: 11 in force for erp.ar, and 7 is quoted in the E02 copy. lexicon_ref: `rung1/erpnext/gst/2026-09`.

---

## 5. Rules that constrain the UI

1. **Four doors, fixed order, no fifth.** The order is Work · Records · Agents · Assurance, with "no fifth door and no 'Settings' tab". Door names are never renamed, even under OEM rebrand. Packs live under Records and are verified under Assurance, "never as a fifth 'Packs' door". Reference sits under a divider and isn't a door (CONTRACT).
2. **L1 honesty (no Signed-by).** At L1, never render "Signed by", a signature, an anchor time or a verifier verdict, empty or otherwise. "A screen that renders an empty 'Signed by' row is a screen that teaches a customer to expect something we do not ship." L2 features appear only as labelled "arrives at L2" lines.
3. **The Proof screen must say, in the interface:** "This record is hash-chained. It is not signed, and it cannot yet be checked by someone who does not trust elan1. That arrives at Assurance Level 2."
4. **Banned words at L1 (C14 is a build failure).** Never write "signed", "tamper-proof" or "independently verifiable". E07 adds "court-ready" and "immutable". Say "tamper-evident". E05 bans these in advisory mode: "we block", "we prevent", "nothing gets through without us", "The write cannot happen without elan1 approving it". The CONTRACT's voice bans are "seamless", "revolutionary", "unlock" and "leverage".
5. **Never state a plan as an achievement.** "we will sign records at L2" is fine; "records are signed" is not.
6. **Humans-only resolvers.** "An agent may never be an approver at L1." The Send to control offers no agents. may_approve can't be true for an agent. An agent token calling act.escalate is refused.
7. **The approver must have seen it.** "An approver who presses Approve has already seen the diff, the gate results and the policy version, or the screen is wrong." Decide shows **every** declared gate, not only failures.
8. **Agent or Person in words, never icon-only.** The same applies to actor_kind everywhere.
9. **Refusals are not errors.** They're outcomes, shown as "Not done — …" with exactly one operator action, the code once in small type, and a link to the proof. Platform failures use the blunt "our failure" copy. Never show a stack trace or a raw code alone.
10. **No warn.** There are three outcomes only: allow/committed, refuse/not done, escalate/waiting on a person. There is no "succeeded with warnings" state anywhere. Lint in Studio is the only "warning", and it's about authoring, not outcomes.
11. **Chain standing is three-valued with scope and count adjacent.** It's never a green tick. Coverage is always "x of y write types".
12. **Missing grant = "A0 Observe (no grant)"**, in the same colour as an explicit A0 and never blank.
13. **Refusals meter at zero, visibly, on the same table** as committed writes.
14. **Timelines include refusals and escalations.** "a timeline of successes only is a timeline that lies by omission."
15. **Records never copies host records.** Pinned fields plus a governed timeline plus "Open in ERPNext". Never rebuild DocType list or form views.
16. **Controls the actor may not use are not rendered.** "Permissions are not a UI concern." A control that will need approval says so *before* it is pressed (scope()).
17. **Reject needs a reason** of at least one sentence.
18. **WhatsApp:** reply-approval only for `whatsapp_approve: true` write types. Otherwise the deep link is the only action, and the template says "Open the console to see the change and decide." "Nothing is approvable only there" (rung1 rule).
19. **Voice:** approvals only, inbound or approver call-back only, spoken confirmation plus one-time code.
20. **Expiry pauses during a platform outage**, and the error copy says so. Timers are announced and pausable.
21. **Enforcement mode is always visible** on Assurance and in any export, per write type or channel. Advisory is never described as enforcement.
22. **"Shadow sandbox" vs "sandbox key/tenant".** Never shortened to "sandbox". A sandbox entry "can never be presented as a production one", so it always carries the mode: sandbox banner.
23. **Versions are explicit integers.** The UI never offers "latest" (except sandbox resolve). Every decision shows its declaration version and policy version.
24. **Irreversible write types show "Irreversible — cannot be auto-approved"** and never offer Reverse this.
25. **Undo is stated with its window.** "Any change can be undone for 30 days", never "Any change can be undone." Reversal is a governed write with its own proof. Never offer a silent delete.
26. **Rows before L1→L2 stay labelled L1 forever.** The boundary date is shown, and nothing is back-signed.
27. **Competitive honesty.** "Designed" is never "yes". elan1's own row reads **No** in all four capability columns until a governed write runs in a customer's tenant.
28. **Budgets and latencies carry [unverified]** until measured. Pricing carries [unverified] where there's no observed price.
29. **Break-glass is a declared write type with dual control**, visible to the tenant. There's no "admin mode" toggle anywhere.
30. **Accessibility (E06 §09):**
    - Keyboard-complete approval path, with a focus ring at 3:1.
    - Contrast of 4.5:1 for text and 3:1 for UI, in both themes.
    - Never colour alone. Pass and fail need a word and a shape.
    - Diffs are real tables.
    - Live regions announce outcomes.
    - 44px touch targets, with Approve and Reject separated.
    - Timers are pausable.
    - Plain language, ready for Tamil and Hindi.
    - Indian number grouping.
31. **elan1 naming by console.** The elan1 Console shows the elan1 name everywhere. In the rung1 Console, elan1 appears only on the proof record ("Checked and recorded by the elan1 layer") and in the footer. stack1 AI Governance keeps elan1 in the backend only.
32. **Tell the customer the verify limitation in these words:** "At L1, verify requires us".

---

## 6. Pricing and competitive facts for the public site and pricing screen

### 6.1 Pricing (brief 06, E07 §04, E01, E05)
- **Unit:** the governed action (governed write). The meter basis comes from the declared blast radius: per record, per counterparty, per batch, per tenant, per crossing. It's "normative, not configurable" and "never configurable per customer".
- **L1 = SKU 1:** "platform floor plus included actions plus overage; refusals free". The floor pays for the evidence plane: append-only storage that never compacts, a registry that keeps every version forever, and the residency footprint.
- **Refusals are free,** "metered at zero, enforced by a database CHECK". The CFO answer (E05): "When a CFO asks whether we are incentivised to make the system say no, that constraint is the answer." This overrides commerce1's 0.3× rule. Throttles (429) and platform failures aren't billed.
- **Today:** "In Phase 1, elan1 is consumed by rung1 and is inside rung1's published price — **₹2,499 / 7,999 / 19,999 / 49,999+ per month by turnover band** — so elan1 has no external price list yet and no customer. That is a fact, not a stage." (E07)
- **Cost per governed action:** "measured from write one, and published weekly" (brief 06). This needs a public "Cost per governed action" panel that reads [unverified] until instrumented.
- **L2 = SKU 2:** evidence on its own line, sold to a possibly different buyer. Three shapes are under consideration: per bundle, per verifier profile per regime per year (the **preferred** one), or per counterparty seat. "All figures unpriced [unverified]."
- **The verifier is never priced:** "A verifier you have to buy from the vendor whose records it checks is not a verifier." It ships as source, free, at L2.
- **L3** adds no new meter. Its price shape is "L1 + L2 + standard participation".
- **Legacy GIP tiers "start1 to sovereign1":** brief 06 says to decide where they survive or retire. Their values aren't in these documents, so don't show them.
- **Price anchors to argue against:** Microsoft Agent 365 at **$15 per user per month** (E08 Q3 asks whether this is GA or announced pricing, so label it "announced") and Salesforce at **$0.10 per action**.
- **Pricing page structure (PROPOSED):**
  - A three-column level table (L1 Guarded "Available now inside rung1", L2 Attested "Q3 2027 · evidence priced separately · verifier free", L3 Proven "2028+").
  - A meter basis explainer.
  - A "Refusals: ₹0, always" callout.
  - An enforcement-mode note ("Every deployment is labelled Attested advisory or Enforced in writing before contracting").
  - No invented L1 external prices.

### 6.2 Competitive (E08, brief 07)
- **Rule:** "'designed' is not 'yes'". A cell reads Yes only if the capability is running in a customer's production tenant and is publicly evidenced. Readings are as of 20 Sep 2026 and "[unverified] unless marked".
- **Columns:** Object · Enforce · Per-action record · Independently checkable · Refusal is evidence.
- **Twenty vendors:** Credo AI, Trustible, IBM watsonx.governance, ServiceNow AI Control Tower, Truyo, Airia, OneTrust, ModelOp + Kong, Monitaur, Holistic AI, Saidot, Cranium, Relyance, SAP Agent Hub, Boomi Agent Control Tower, Zenity, Noma, Microsoft Agent 365, Palantir AIP, elan1. Use the exact cell text from E08 §03:
  - Palantir: Yes/Yes/No/Partial.
  - ServiceNow: Partial/Partial/No/No.
  - SAP: Partial/Partial/No/No.
  - Monitaur: per-action "Partial — evidence about a model".
  - Airia, ModelOp+Kong, Boomi, Zenity, Noma and Microsoft: enforce Partial.
  - elan1: No ×4, with notes "nothing in production" and "L1 is unsigned by design".
- **Axes:** documentation → runtime enforcement; model-centric → business-action-centric. Quadrants:
  - Documentation × model: Credo AI, Trustible, IBM, Holistic AI, Saidot, Cranium, Relyance, Monitaur, OneTrust, Truyo.
  - Enforcement × model: Zenity, Noma, Airia, ModelOp+Kong, Microsoft Agent 365, Boomi AI Gateway.
  - Enforcement × action, single-vendor: Palantir AIP, ServiceNow, SAP Agent Hub.
  - Enforcement × action, portable, checkable by a stranger: **empty**, and "our row in that quadrant is also empty today".
- **Signature lines:**
  - "Open Policy Agent signs the policy bundle. It does not sign the decision."
  - "The industry signs what an agent was allowed to do, and does not sign what it did."
  - "Telemetry is not evidence."
- **Market:**
  - Gartner MQ for AI Governance Platforms (June 2026): Leaders IBM, ServiceNow, Truyo; Visionaries Airia, Credo AI, ModelOp, Monitaur, OneTrust; Challenger Holistic AI; Niche SAP, Relyance, Cranium, Saidot.
  - Category ~$492M in 2026 and >$1B by 2030 (verified).
  - More than 100 vendors claim the capability and 13 met the MQ criteria. **0** inclusion criteria require verifiable evidence (by absence).
- **Forrester correction:** the circulating chart is the GRC Wave. The AI-adjacent Q3 2025 wave leaders are Credo AI and IBM.
- **Palantir mapping (for the ontology page):** Object types → shape; Link types → links (we're behind here); Action types → write_types; Submission criteria → gates; Action log → the hash-chained record; Interfaces → system_of_record plus adapter; Functions → evaluate(), with no model. elan1-only concepts: autonomy ladder, channels, proof_binding, meter basis.
- **Where we win today (claimable on day one):** "A model may produce a write intent. It may never produce an allow."
- **Threats (for an internal or investor page, not the public site):**
  1. ServiceNow writes into third-party systems of record (the primary threat).
  2. Credo AI, IBM or Monitaur start signing decisions.
  3. Bundling makes governance free.
  4. Frappe or Crator ships approvals inside ERPNext (Frappe runs about 30k sites).
  5. Palantir productises AIP outside Foundry.
  6. Nobody pays for evidence.
  7. A regulator blesses a weaker artefact.
  8. We stay pre-revenue: "10 design-partner slots still open at Dec 2026".
- **Regulatory hooks (E07 §05)** for the levels page: MCA audit-trail rule (Apr 2023), GST e-invoicing, RBI FREE-AI (13 Aug 2025), SEBI AI/ML consultation (20 Jun 2025), MeitY AI Governance Guidelines (5 Nov 2025), DPDP Rules (notified 13 Nov 2025; main obligations 13 May 2027), EU AI Act Art. 50 (2 Aug 2026), high-risk (2 Dec 2027), regulated products (2 Aug 2028), Colorado SB 26-189 (1 Jan 2027), ISO/IEC 42001 and NIST AI RMF.
  - Rule: "L1 serves every one of these as an internal control, and none of them as independent proof."
  - Never claim conformance or certification ("We are certified to ISO/IEC 42001…" is banned). Never say "This satisfies the MCA audit-trail rule".

---

## 7. Gaps: screens and states the documents imply but don't specify (proposals)

**7.1 Blast-radius visual ladder vs the kernel enum.** The CONTRACT specifies a 4-step band (Contained, Reversible, Material, Irreversible). The documents define 5 radius classes (one_record … cross_boundary) plus a separate reversible/irreversible flag. **Proposal:**
- Always print the kernel class in words ("One counterparty").
- Draw the band as a *consequence* ladder derived from both facts:
  - Irreversible if `irreversible: true`.
  - Material if radius is `tenant` or `cross_boundary`.
  - Reversible if a reversal plan exists and radius is `one_counterparty` or `batch`.
  - Contained if radius is `one_record` with a reversal plan.
- The lead needs to confirm this mapping.

**7.2 Refusal register counts don't add up.** The documents say 43 codes (policy 14, gate 19, platform 10), 28 active at L1. E02's table names 32 codes (12 / 13 / 7) plus 3 define-only policy codes, so 35 are named. The "28 active" set isn't enumerated. **Proposal:** the Register screen shows every named code with an "Active at L1" column, and PROPOSED values for the 3 unlisted platform codes stay out until the kernel team supplies them. Don't invent codes.

**7.3 Plain-words titles for each code.** Only "Not done — credit limit" and the dual-control copy are specified. The titles in §1.7 are proposed and need renderer-lead sign-off. The G9 title should be generated from the failing predicate's declared label, not the code.

**7.4 Write-type naming is inconsistent.** E03 uses `sales_invoice.submit` (slug.verb) while E04 and E07 use `erp.sales_invoice.submit`. The UI shows the label first and the machine name second, so it's unaffected. Sample data uses the `erp.` form throughout.

**7.5 `whatsapp_approve` isn't a field in the block 7 schema.** E03 channels fields are name, kind, write_types, may_approve and mode. **Proposal:** model it as `channels[kind=messaging].may_approve = true` per write type, and show it in the Channels matrix as "approve by reply".

**7.6 Channel kinds disagree.** E03 has web, mobile, messaging, api, mcp and voice. The Channel Block adds Agent and Connector, and the Four Doors adds e-mail. **Proposal:** the Channels screen lists the six E03 kinds as declarable. Agent and Connector are shown as "internal routes". E-mail is notification-only with a deep link and no approval.

**7.7 Door placement conflicts.** E06 §07 puts Tenants and Meter under Agents · Admin, but the re-scope (later) moves Tenants → Records and Meter → Assurance. This spec follows the re-scope.

**7.8 Missing screens (proposed above, marked PROPOSED):**
- Work landing
- What arrives here
- New request
- write status
- Reverse this
- Not done list
- Connected systems
- Declarations list and detail
- version compare
- Write types
- Actors and delegations
- Changesets
- Channels registry
- Webhooks
- Assurance overview
- Chain standing and verify-range
- Coverage
- Enforcement mode
- Levels and boundary
- Export locked state
- Readiness
- auth
- onboarding
- developer docs
- 404

**7.9 Stop switch details.** The cause-class list, lifting a stop, and what agents and approvers see while stopped aren't specified. The proposals are in F7 and G-banner. Also open: whether pending obligations freeze. **Proposal:** freeze, with expiry paused, like an outage.

**7.10 Obligation lifecycle UI.** These aren't specified:
- Reassignment (Send to beyond the same-actor case).
- Reminders.
- Who sees "Waiting on anyone".
- Expiry-extension. **Proposal:** none. Extension would be a new governed write, so resubmit.
- Default expiry of 4 h is "asserted, not observed". Show it as the declared expiry per write type.

**7.11 Bulk approve** is an open question (E06 Q2). **Proposal:** don't ship it at L1. If it's ever added, restrict it to identical write types with `one_record` radius, show every diff in a stacked review, and record one resolution per obligation.

**7.12 Rejection-reason quality.** "At least a sentence" needs a rule. **Proposal:** at least 20 characters and at least 3 words. The hint reads "Say what would need to change for you to approve."

**7.13 Session and auth.** There are no specs for SSO, MFA or session timeout. Approvals are consequential. **Proposal:** re-authenticate for Approve after 15 minutes idle. WhatsApp and voice deep links always require a console session or the voice one-time code.

**7.14 Notifications centre (top bar).** Not specified. **Proposal:**
- Items are obligation raised, near expiry, outcome of something I proposed, stop events and platform incidents.
- Each item deep-links into a door.
- It's never a place where actions can be taken (so it doesn't become a fifth door).

**7.15 Tenant switcher.** Tenancy "comes from the token, never from a call argument". **Proposal:** switching tenant re-issues the session token and reloads. Mixed-tenant lists never exist in the elan1 Console. The CA console's multi-client queue is a rung1 surface.

**7.16 Platform incident state.** Only the Approvals error copy exists. **Proposal:** a global banner plus a per-screen degraded state, a status link, and "Expiry paused".

**7.17 Chain-break (P0) incident view.** Specified only as "a broken link is a P0". **Proposal:** Assurance → Chain shows the break at seq N, the field, the time detected, the stop status (CHAIN_HEAD_CONFLICT stops the tenant), and "What this means: an entry was altered or removed after it was written. The chain tells us something changed; it cannot yet tell a stranger who wrote it."

**7.18 Delegation (on_behalf_of).** It appears in the intent object and in POLICY.DELEGATION_INVALID, but there's no screen for it. It's proposed under Records → Actors.

**7.19 Consent ledger.** G1 depends on it, and WhatsApp opt-out lives in it, but there's no screen. **Proposal:** Records → Consent (read-only list of consents by purpose, with expiry). It's generated from the host or the ledger, and it isn't a copy of customer data beyond purpose and expiry.

**7.20 L1 export.** rung1's "Export audit pack" (Four Doors §08) conflicts with E01's "No verifier, no bundle" at L1. **Proposal:** at L1, offer a "Print internal record (range)" view only. It carries the honesty sentence on every page and is never called a bundle or evidence export.

**7.21 Deprecation and preimage-change notices** go on the Assurance door (E05 §10). The design is a list plus a side-by-side "both shapes" view (it should never be needed at v1).

**7.22 Latency and SLO display.** Budgets are [unverified]. **Proposal:** Assurance → Readiness shows measured p50 and p95 once they exist. Before that it shows "not measured" (three-valued), never the design target as a reading.

**7.23 Coverage "modelled" semantics.** Live vs modelled per write type is named but not defined. **Proposal:** modelled = entries with mode: sandbox (reference tenant or simulation); live = mode: live. Show both counts, never merged.

**7.24 Language.** Tamil and Hindi are Phase 2 (E06 Q4). **Proposal:** build every string with keys now, and keep an English-only toggle hidden at L1.

**7.25 Level pill interaction.** The top-bar level pill should open `/assurance/levels`, which explains what L1 means and what it does not claim. This makes the honesty rule discoverable from every screen.

**7.26 Agent graduation (A2 → A3) is Phase 4 (E24).** At L1, the Autonomy screen shows grant changes only as a governed request (the approval flow). There's no automatic graduation UI.

**7.27 rung1 and stack1 consoles.** The re-scope names screens for those consoles:
- rung1: Review (compiled), Today → Needs you, Filing calendar (CA), This site, Runs and changesets, Migration record (Tally), Clients (CA), Standing agents, Auto-pause, tool allow-list, Auto-approve per write type, Proof record ("Checked and recorded by the elan1 layer"), Export audit pack, Spend, Audit log.
- stack1 AI Governance: guard violations and budget breaches waiting on a person; licence register; teams and model usage; models behind the gateway (C2); keys and budgets per team; traces (C6); guard log (C10); meter and cost attribution.

These are outside the elan1 Console. If the build includes them, reuse the same four doors and components. Auto-approve per write type must show "off by default" and can never be enabled for irreversible write types.

**7.28 G4 on the first pass is ambiguous.** E04 Flow 3 shows an escalated write with "all gates green" that passes G4 only on resubmission, once a second actor exists. E02, however, lists `GATE.DUAL_CONTROL_PENDING` ("No second approver yet", action "Request approval") as a rung-3 refusal. The designs need one answer to three questions:
- Is a dual-control write that has no approver yet shown as **Escalated · waiting on a person**?
- Or is it shown as **Not done — needs a second approver** with a Request approval button that creates the obligation?

**Proposal:**
- Render both paths.
- The Decide screen's gate list shows G4 as "Dual control — waiting for you (second named approver)". That is a neutral/info state, never "failed".
- The Not done screen is used only when the requester must press Request approval themselves.
- The kernel team needs to confirm this.

**7.29 The count wording "nine rungs" vs "ten checks".** E04 says "climbs the same ten checks" while E01, E02 and the Four Doors say "nine rungs" (0b is the extra check). **Proposal:** the UI always says "nine rungs" and draws 0b as a gate-house before rung 1 labelled "0b STOP".
