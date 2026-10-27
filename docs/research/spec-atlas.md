# elan1 Architecture Atlas — UI source-of-truth spec

Source: `elan1-architecture-atlas.pdf` (34 pp., 32 figures, 23 Sep 2026, "Draft for review", companion to the elan1 Technology Memorandum). Each figure was read as text and viewed as an image. This spec turns the atlas into screen requirements for the Four Doors console (Work · Records · Agents · Assurance, plus the Reference group), a developer surface and the public/doc layouts, in line with `CONTRACT.md`.

**How to use this document**
- Part 1 covers each figure: its status tag, what it shows, every label a designer needs, the atlas colour coding, and what it means for the UI (screen, route, visual form).
- Part 2 is the component catalogue, with one-line tooltip copy.
- Part 3 gives the canonical flows as numbered steps that name components. These drive the stepper and animation visualisations.
- Part 4 proposes screens with hash routes, fields and interactions.
- Part 5 covers status tags and colour language, and maps them to UI badges.
- Part 6 lists gaps, source conflicts and value-adds.

**Rules that apply to every screen derived from the atlas**
1. **Honesty by level.** At L1 never render a signature, "Signed by", key_id, anchor time, anchor_ref or verifier verdict. L2 and L3 elements appear only as *labelled previews* ("Level 2 — specified, not built") or on L2/L3 tenants. CI check C14 bans "signed", "tamper-proof" and "independently verifiable" from L1 copy. L1 copy says "hash-chained", "tamper-evident to you, the chain holder" and "verify requires us".
2. **Targets are not measurements.** Latency, cost and date figures in the atlas are targets or modelled numbers. Anywhere the UI shows them as budgets, label them "target" or "modelled". Live screens show measured values next to the target.
3. **Three outcomes only.** allow · refuse · escalate. There is no "warn" state anywhere (invariant I6).
4. **Refusal is a correct outcome.** Refusals are HTTP 200, carry a full record and have meter quantity 0. Never style a refusal as an error or crash. It is a typed, recorded decision.

---

## Part 1 — The 32 figures

Format per figure: **Status tag** · What it shows · Components and labels · Colour and shape · **UI**.

### Figure 1 — elan1 in context
**Status:** L1 — BEING BUILT · L2/L3 — NOT BUILT. Source file: fig-01-system-context.svg.
**Shows:** who acts, who consumes the kernel, what the kernel runs on, and the external systems it writes to or is checked by.
**Columns and boxes:**
- *People and agents* (left):
  - **AI agents**: actor_kind agent, set by the kernel from the token and never claimed by the tool. They hold A0–A5 per write type and produce write intents, never an allow.
  - **Operators**: tenant admins and declaration certifiers (a named human). They control the stop switch, grants and keys, and each of those actions is itself a governed write.
  - **Approvers**: named humans in the resolver set. They see the diff, every gate and the policy version first. An agent may never approve.
- *Consumers, separate ventures and third parties* (centre top):
  - **rung1, the first consumer**: rung1 Enterprise (Mode A, enforced, hosted, ERPNext, Phase 1, building), rung1 Revenue (Phase 3), rung1 Voice (P6 channel, inbound only, Phase 3) and rung1 Commerce (parked). rung1 pays ₹0.40 per committed action from 1 Jan 2027; refusals cost ₹0.
  - **verna1, parked**: outbound collections. DR-007 reopens it only on a paid NBFC pilot, as its own entity.
  - **Third-party agents**: vendors over MCP/HTTP, Mode B (attested advisory). Pre-GA design partners; GA in Phase 2. stack1 tools also use this path.
- *Arrows:* "Mode A · in-process SDK" and "Mode B · MCP / HTTP" (dashed blue = advisory) into the green dashed "elan1 PRIVATE LIMITED — the perimeter of this round".
- *Inside the perimeter:*
  - **KernelPort v1**: define · assert · seal · verify · scope · refuse.
  - **Console**: the Four Doors (Work · Records · Agents · Assurance) and the Approvals, Decide, Studio and Proof screens.
  - **elan1 kernel — plane P3 (shut)**: Right Path (0b STOP + nine rungs), Declarations (seven blocks, pinned), gates G1–G9, evaluate() with no model, single writer, hash-chained record, one meter event (refusals at qty 0), closed register of 43 codes (28 at L1).
  - **Regulatory packs — plane P8, configuration not code**: ledger1 (MCA Rule 3(1)/11(g) audit trail, first), invoice1 (GST e-invoicing), collect1 (RBI collections conduct).
- *The seam:* the dashed purple "fusion.*/v1 seam — the kernel runs on the runtime, never inside it".
- *Below the seam:* **stack1, the runtime supplier** (separate venture, cost + 15%). It provides fusion.run/v1 (Temporal), trace/v1, tools/v1, guard/v1 and gateway/v1 (five ship in Phase 1), runs in ap-south-1 Mumbai with a per-tenant OpenBao path and a sandbox pool. Rule B1: no stack1 package imports elan1, so the dependency runs one way.
- *Assurance parties* (right):
  - **Regulators**: MCA · GST e-invoicing · RBI. These are dated obligations; there is no conformance claim at L1.
  - **Auditors**: at L1 they reconstruct through elan1 ("verify requires us"); at L2 they check a bundle offline.
  - **Counterparties**: G7 checks they are known and not sanctioned; at L3 they verify the chain between organisations.
- *Systems of record:* **Target systems** are written only by the single writer, using one single-use credential with a ten-minute life scoped to one write. Phase 1 is hosted ERPNext/Frappe through Frappe's own API, never the ORM. Phase 2 is customer-run ERPNext. Tally and Zoho Books are read-only sources. SAP, Oracle, Temenos and Finacle are named later targets, not built.
- *External trust (L2, not built):* **Timestamp authorities**: RFC 3161 at two authorities, one India-based (eMudhra recommended); they receive a hash and a nonce only. **Offline verifier**: zero dependencies, runs on the reviewer's own machine against an evidence bundle, six exit codes.
- *Footer claim:* "A model may produce a write intent; it may never produce an allow. In Mode A only the kernel's single writer holds a credential to the books."

**Colour legend (the atlas master legend):**

| Fill | Meaning |
|---|---|
| teal | elan1 (kernel, packs, console) |
| blue | consumers and agents |
| purple | stack1 runtime |
| amber | people who decide |
| grey | external systems and parties |
| grey dashed | L2, specified, not built |
| blue dotted | parked venture |
| blue dashed line | advisory path (Mode B) |
| teal dashed line | L2 anchoring and bundle export |

**UI:** This is the **System map** hero (`#/assurance/system-map`) and the first figure in the Reference atlas viewer.
- Render as a live, clickable context diagram. Each box opens a drawer with its tooltip and live status: kernel health, consumers connected, target systems reachable.
- Draw L2 nodes (TSAs, offline verifier) dashed with a "Level 2 — not built" label. On an L1 tenant they never show a live status.
- Show edges for Mode A and Mode B with the tenant's live counts, for example "Mode A: 12,408 writes this month".
- Parked ventures (verna1, rung1 Commerce) appear only in the Reference version, never in a tenant console.

### Figure 2 — The perimeter and the seams
**Status:** L1 — BEING BUILT.
**Shows:** what elan1 Pvt Ltd holds, the ventures on either side, the two seams, and the gate on kernel change.
**Components:**
- **rung1** (above): rung1 Enterprise (Phase 1), Revenue, Voice and Commerce (parked). *May change:* its declarations, its ERP adapters, its screens within the Four Doors, its price list. *Must never build:* a gates engine, an approval store, a seal, a meter or a verifier.
- **KernelPort v1 seam**: identical signatures for every consumer. Nothing above P3 imports a kernel type (a CI check).
- **Perimeter of the Series A (₹180 crore / US$20M)**, six boxes:
  - **Kernel**: six-call contract, nine-rung Right Path, 43-code refusal register.
  - **Declaration ontology**: seven blocks, policy as data, Controls and Regulations families.
  - **Evidence (L2)**: Seal Spec v6, bundle, offline verifier, verifier profiles (frozen spec).
  - **Regulatory packs**: ledger1 · invoice1 · collect1; configuration, not code.
  - **Surfaces**: the MCP server and SDK through which third parties call the kernel.
  - **Action Receipt (L3)**: open format specification, partner and verifier certification programme.
  - *May change:* kernel, declaration schema, gates, proof format, KernelPort. *Never:* a second write path, a special case for one product, or an ERP, CRM or UI shell for somebody else's product.
  - Headcount: kernel engineering 7 → 38, packs 2 → 50, Mar 2027 → Mar 2031 (modelled).
- **fusion.*/v1 seam**: ten contracts; five ship in Phase 1 (gateway, trace, tools, run, guard). /v2 runs beside /v1 until two human gates pass.
- **stack1** (below): processes, queues, storage, the sandbox pool, deploy topology and observability in ap-south-1. It never builds on the governed write path and never reads a tenant record from the control plane.
- **verna1**: parked (DR-007). Retired names, which are not ventures: core1 · rev1 · commerce1 · gtm1 · fusion1 · start1 · run1 · academy1.
- *Dependency direction diagram:* rung1 → KernelPort → elan1 kernel → fusion.*/v1 → stack1 runtime. "rung1 also calls fusion.*/v1 itself." A red ✕ marks "stack1 never imports elan1". Enforced by B1 import-graph, B2 manifest scan and B3 reserved words.
- *Arm's-length relationships:*
  - rung1 → elan1: ₹0.40 per committed governed action from 1 Jan 2027, refusals ₹0, reset quarterly against cost. This is intra-group engineering validation, not traction.
  - stack1 → elan1: runtime at observed cost + 15%, booked as cost of revenue. If stack1 fails, elan1 substitutes a supplier.
- *Three token classes, and no fourth:*
  - **tenant**: one tenant, one actor, one autonomy level. The only class that reaches /v1/writes (ro · stage · act).
  - **control**: Studio and registry, with no route to a record store.
  - **ops**: read-only, no tenant data. O03 §06 names the third class a stack1 service token.
- *Kernel Change Request gate:* a KCR names write type, gate and behaviour; ack ≤ 1 day. The question is "Expressible as a declaration or adapter?"
  - yes → closed with the expression, no change.
  - no → ADR (alternative, defect class) → founder.
  - signed → queue plus a CI invariant on the old behaviour.
  - refused → recorded with a reason; ships without the change.
  - Escalation: kernel lead → founder, no third step.

**UI:**
- (a) **Developer → Architecture → Seams** (`#/developers/architecture/seams`): a three-band diagram with a dependency-direction arrow.
- (b) **Agents → Connections** uses the *three token classes* as the frame for API-key management: every issued credential shows its class, and the control class has no records scope.
- (c) The KCR flow belongs to an internal Reference page (`#/reference/kernel-change`) as a decision-tree stepper. It is not a tenant-facing screen.

### Figure 3 — Planes P0–P8 and who owns each
**Status:** L1 — BEING BUILT.
**Shows:** nine planes read bottom-up as a cost gradient ("costlier to change ↓ · cheaper ↑"), who owns each, and the boundary rules enforced by a failing build.

| Plane | Holds | Changeable | Owner |
|---|---|---|---|
| P8 Packs | vertical packs: a declaration plus a verifier profile each (ledger1, invoice1, collect1) | Yes, intended churn | elan1 |
| P7 Apps | horizontal apps, one declaration each (rung1 Enterprise, Revenue, Commerce) | Yes | rung1 · third parties |
| P6 Channels | web, API, messaging, declared in block 7; rung1 Voice inbound (Phase 3); verna1 parked | Yes, per channel | rung1 / elan1 MCP/HTTP |
| P5 Surfaces | shared renderers and the surface registry; screens compiled from a declaration | Hard, one team | elan1 renderers |
| P4 Declaration plane | declaration schema, write-type descriptors, lexicon, policy versions | Forward only, never migrated | elan1 schema / consumers' declarations |
| **P3 Kernel** | the one write function: nine rungs, evaluate(), proof, meter | **SHUT** | elan1 |
| P2 System of record | write API and record store, the only place a record changes (hosted ERPNext first) | Hard | customer's books / rung1 hosts |
| P1 Platform runtime | compute, queues, object store, secrets, transactional outbox via fusion.*/v1 | Yes, deliberately boring | stack1 |
| **P0 Residency and tenancy** | region (ap-south-1), tenant, key custody, erasure salt store | **SHUT**, no migration path | elan1 policy / stack1 operation |

Nine numbered boundary rules, each a failing build (circled numbers on the diagram attach to planes):
1. P3 | P4 and above: nothing above P3 imports a kernel type (C1).
2. Rungs 3–8: no module reachable from them imports a model client (I1, C1).
3. P1 | P3: no stack1 package imports elan1; no elan1 package in a stack1 image (B1, B2).
4. P1 control | P2: the control plane has no network route to the record store; default-deny (B5).
5. Into P2: exactly one write credential per environment; a bypass test shows every other path fails (C2).
6. P4: define rejects a version ≠ last + 1; "latest" is a rejection, not a default (C13).
7. P0: a resource outside the region allow-list fails the build (O05 §02).
8. Tenancy: RLS on every tenant table; a migration disabling it fails CI; cross-tenant read test.
9. Consumer copy: no "signed", "tamper-proof" or "independently verifiable" in rendered L1 copy (C14).

Quote: "An instruction in a document is advice; a failing build is a control."

**UI:** a **Plane stack** component, a vertical stack of nine bars. P0 and P3 carry a "Shut" lock badge, and owner chips are coloured by zone. Hovering a boundary rule highlights the two planes it separates. Used in `#/developers/architecture/planes` and as a mini-map in the System map. Each boundary rule links to its CI check status on `#/assurance/controls` (live pass/fail from the latest pipeline run).

### Figure 4 — Components, repositories and internal seams
**Status:** L1 — BEING BUILT · L2 — NOT BUILT.
**Shows:** what elan1 builds for L1, by zone and repository.

- **Surfaces** (repos elan1-surfaces, elan1-console, a build recommendation). One submission surface, reachable two ways:
  - **SDK @elan1/kernel**: in-process Mode A (rung1). Six calls with identical signatures; no kernel type imported above P3.
  - **MCP server (Mode B)**: 34 tools (ro 18 · stage 10 · act 6). Tool descriptions are pinned by hash in the declaration.
  - **HTTP /v1 + webhooks**: 8 families across act · ro · ctl. ctl has no read path to any record. Webhooks are HMAC-signed and carry seq.
  - **Console (P5 renderers)**: the Four Doors compiled from the declaration: Approvals, Decide, Not done, Record, Proof, Studio.
- **KernelPort v1** bar: define · assert · seal · verify · scope · refuse. The tenant comes from the token, never from an argument.
- **Kernel core, P3** (repo elan1-core, plane shut):
  - **Right Path executor**: one write function covering rungs 0b–9; idempotent on intent_id; runs in a fusion.run/v1 workflow.
  - **Gate engine (rung 3)**: G1–G9 as pure functions of context, version, state and as_of; one gate_result row per gate.
  - **Policy service (rung 4)**: evaluate() over versioned rules on declared fields; no model and no read path to records.
  - **Guardrail and autonomy (rungs 5, 6)**: blast radius against the declared value; autonomy_grant A0–A5; a missing grant resolves to A0.
  - **Approval service**: obligations with expiry and a human-only resolver set; each resolution is a governed write.
  - **Refusal register**: 43 codes, 28 active at L1. Each maps to one rung, class and operator action; register lint runs in CI.
  - **Meter (rung 9)**: one meter_event per write; CHECK that a refusal has quantity 0; meter.reconcile() runs nightly.
  - **Chain writer and evidence (rung 8)**: consumes the outbox in commit order; seq, prev_digest, SHA-256; the store grants INSERT to one role.
  - **Single writer (rung 7)**: snapshot, shadow sandbox, target adapter. The broker mints a one-write, ten-minute credential.
- **Declaration plane, P4** (repo elan1-declarations):
  - **Studio**: author → validate → simulate → certify, by a named human.
  - **Compiler and registry**: surface plan, write types, meter basis; content-addressed; every version kept, never compacted.
- **Packs, P8**: declaration + certified verifier profile + export mapping; no pack table in the registry; ledger1 · invoice1 · collect1.
- **System of record**: ERPNext via Frappe's own API, never the ORM. The adapter returns the inverse operation.
- **L2 Attested (frozen specification, not built)**, in a dashed band:
  - **Signer**: Ed25519 over the same 32-octet digest (Seal v6).
  - **Anchor batcher**: Merkle root → RFC 3161 at two authorities.
  - **Bundle exporter**: an evidence bundle for a party who distrusts elan1.
  - **Offline verifier**: elan1-verify, zero deps, six exit codes.
- **fusion.*/v1 seam** (S03 B1–B8).
- **stack1 runtime, P1** (separate venture):
  - **run/v1**: Temporal; every governed write runs in a workflow (DR-002).
  - **trace/v1**: OTel spans that the proof record can bind to.
  - **tools/v1**: ERPNext MCP servers, per-call authz, call ledger.
  - **guard/v1**: its verdict is an input to the gate check, never an allow.
  - **gateway/v1**: model calls, upstream of assert and never inside it.
  - Also: OpenBao (one secrets path per tenant), Postgres with RLS (the evidence plane on a separate instance), transactional outbox, sandbox pool, ap-south-1.
- Repositories: elan1-core and elan1-declarations are recorded. elan1-surfaces, elan1-console, elan1-packs and elan1-verify are proposals. One writer per file; a PR crossing two repos needs both owners.

**UI:** the **component-level System map** (zoom level 2 of `#/assurance/system-map`). Each component tile shows a health dot with a text label, its last event, and its rung number where relevant. The L2 band is dashed and non-interactive on L1 tenants. The developer view (`#/developers/architecture/components`) adds repo names and owners.

### Figure 5 — KernelPort v1: six calls, five objects
**Status:** L1 — BEING BUILT · [L2] FIELDS FROZEN.

**Six calls** (identical signatures for every consumer, at every assurance level):

| # | Call | Purpose | Token and behaviour |
|---|---|---|---|
| 1 | **define** | register a write type at a declaration version | Certified declaration; version must be last + 1. Itself a governed write under dual control. Idempotent on (declaration_id, version, digest). Never overwrites a version or resolves "latest". |
| 2 | **assert** | run the rungs and return a decision | **act token; the only call that changes a record.** Returns decision, seq, digest and undo_until (30 d). Idempotent on intent_id: no re-run, no re-meter. Never calls a model, never caches, has no admin mode. |
| 3 | **seal** | write the record and chain it (rung 8) | Callable only by the kernel's chain writer. Consumes the outbox in commit order and assigns the next seq. Idempotent on write_id; a gap in seq is a P0. [L2] the same call also signs, with the same shape. |
| 4 | **verify** | check a record or a chain segment | ro token. Recomputes preimage and digest and walks seq from 1. Returns PASS or the first failure with sequence, field and reason. Never metered. At L1, "verify requires us", said in those words. |
| 5 | **scope** | resolve blast radius and autonomy | ro token. Used to render a screen, or by an agent deciding whether to stage a write at all. Advisory: assert always re-resolves both. Caching scope as permission would be the decision cache that I5 bans. |
| 6 | **refuse** | emit a typed refusal from the register | Raised by the kernel, or by an adapter before the kernel is reached. The code must map to the rung it was raised at. Produces the full 16-field record with record_id zeroed and qty 0. Never free text, never a 4xx, never a warning. |

**Five objects** (consumers hold identifiers and enumerations, never a kernel internal):
- **Write intent** (blue): a request, never a permission.
  - intent_id (idempotency key); tenant_id (from the token); declaration_id + version (uint32; "latest" is rejected).
  - write_type · channel · actor_id · actor_kind (human | agent | system).
  - on_behalf_of: accountability, never autonomy.
  - subject · payload · as_of (supplied, never a clock) · reason · obligation_ref.
- **Decision**: produced by assert; immutable.
  - write_id (kernel-assigned); disposition: allow | refuse | escalate ("there is no fourth"); rung · code · gate.
  - obligation, if and only if escalate; policy_version (resolved by the kernel, never supplied); autonomy_level A0–A5.
  - blast_radius (one_record … cross_boundary); gate_results[] (every gate); reversal_plan.
- **Approval** (amber): itself a governed write, not a flag.
  - approval_id · write_id.
  - approver_id: must differ from actor_id where G4 applies. approver_kind: human only at L1; never an agent.
  - decision: approve | decline. basis: surface plan version and rendered payload digest. at: platform clock.
  - A decline makes the write refuse with POLICY.APPROVAL_DECLINED.
- **Record**: the proof object at L1. Sixteen fields F01–F16 (tenant_id, seq, prev_digest, write_id, write_type, declaration_id/_version, policy_version, actor_id, actor_kind, autonomy_level, record_id, record_version, payload_hash, lexicon_hash, recorded_at). SHA-256 over the LP-encoded preimage; [L2] Ed25519 signs the same bytes.
- **Meter event**: exactly one per governed write.
  - event_id · write_id · seq.
  - basis: from the declared blast radius, never per customer.
  - quantity: 1 committed, 0 every refusal (CHECK). outcome: committed | refused | escalated. at: platform clock.
  - Every invoice line traces to a record.

**Eight invariants:**
- I1: a model may produce a write intent, never an allow. Rungs 3, 4, 5, 6 and 8 are unreachable from any model (import-graph check).
- I2: single writer. One process per tenant; single-use ten-minute credential.
- I3: fail closed. No grant → A0; a missing gate result counts as a failure; an outage is a platform refusal.
- I4: refusals are free and typed: one rung, class and operator action; qty 0 by CHECK.
- I5: no fast path, batch variant, admin mode, decision cache or second implementation.
- I6: no warn.
- I7: nothing resolves to "latest"; every decision records its policy_version.
- I8: determinism. The same intent, versions and as_of give the same decision forever.

**Closed refusal register:** 43 codes, 28 active at L1; policy 14 · gate 19 · platform 10 ("the rest activate at L2"). Example: GATE.PRECONDITION_FAILED at rung 3. Every PLATFORM.* code pages.

**Outcome matrix:**

| | refusal | rejection | platform failure |
|---|---|---|---|
| HTTP | 200 | 4xx | 5xx, or 200 + code |
| record | full record | none | full record |
| meter · retry | qty 0 · never retry | none · fix | not billed · same id |

Tenant and actor_kind come from the token (ro · stage · act), never from an argument.

**UI:**
- **Developer → KernelPort explorer** (`#/developers/kernelport`): six call cards, each with a signature, token scope chip, idempotency key, "never" list and an example request/response. The five objects render as schema cards with field tables, cross-linked (Decision.write_id → Record F04).
- The invariants I1–I8 become a checklist panel on `#/assurance/controls` with the CI evidence for each.
- The outcome matrix becomes a small reference table in the refusal-code browser.

### Figure 6 — The Right Path: nine rungs in one order
**Status:** L1 — BEING BUILT · BUDGETS ARE TARGETS.
**Shows:** the vertical ladder with a p50 target per rung (left), the rung name and rule (centre), and the refusal codes per rung (right, pink boxes).

| Rung | Name | Rule | Exit codes | p50 target |
|---|---|---|---|---|
| 0b | STOP (grey) | stop set: tenant kill switch, revocation, blacklist, regulator directive | POLICY.TENANT_STOPPED, **the only refusal with no proof record** | — |
| 1 | IDENTITY | actor_id, actor_kind from the token, never the payload; delegation confers no autonomy | POLICY.ACTOR_NOT_PERMITTED, POLICY.DELEGATION_INVALID | 4 ms |
| 2 | WRITE DOOR | declaration at an explicit integer version; write type exists and is reachable from this channel | POLICY.WRITE_TYPE_UNKNOWN · CHANNEL_NOT_PERMITTED · POLICY.DECLARATION_UNRESOLVED · PLATFORM.REGISTRY_UNAVAILABLE (retry, same id) | 8 ms (rungs 2–3) |
| 3 | PRE-GATES | G1–G9 in declared order, pure functions of as_of; all run and record; the first failure sets the code | GATE.* (19 codes); six gates never skippable: G1–G4, G7, G9 | 12 ms |
| 4 | evaluate() | versioned rules over declared fields; no record read, no model → allow · refuse · escalate, never a score | POLICY.DENIED_BY_RULE · POLICY.NO_RULE_MATCHED · PLATFORM.POLICY_UNAVAILABLE (never a default allow) | 8 ms (rungs 4–6) |
| 5 | GUARDRAIL | allow-lists, then blast radius against the declared value: one_record … batch · tenant · cross_boundary | POLICY.BLAST_RADIUS_EXCEEDED (catches "update one invoice" arriving as an unbounded filter) | |
| 6 | AUTONOMY | grant A0–A5 for this actor and write type; missing = A0; irreversible or too low → approval | POLICY.AUTONOMY_INSUFFICIENT (grant too low and no approval route exists) | |
| 7 | ACT, the single writer | snapshot → shadow sandbox → gate re-run → identical bytes to live on a 10-min credential → re-run → commit | GATE.SANDBOX_DIVERGED (snapshot restored) · PLATFORM.TARGET_UNREACHABLE · TOKEN_MINT_FAILED · PLATFORM.WRITER_LOCK_LOST | 18 ms |
| 8 | PROOF | sixteen fields, per-tenant seq, prev_digest, SHA-256; INSERT-only; seq and digest returned synchronously | every refusal gets HTTP 200 and a full record, with record_id = zero UUID and record_version 0 | 12 ms |
| 9 | METERED | exactly one meter event; basis from the declared blast radius; quantity 1 committed, otherwise 0 | refusals and escalations meter at quantity 0 | 2 ms |

- **Left, amber "Needs approval" box:** rung 6 (or evaluate()) escalates, creating an obligation (write_id, A-level, expiry of 4 h (asserted), a human resolver set). "The ladder stops; rung 7 is never reached. The escalation is recorded at rung 8, quantity 0." Approve is itself a governed write, and the original is resubmitted with its obligation_ref. A red box: "decline → POLICY.APPROVAL_DECLINED; expiry → POLICY.OBLIGATION_EXPIRED — recorded".
- **Left arrow:** "resubmit from 0b".
- **Footer:** the ladder never has a model in rungs 3–8, a fast path, batch, admin mode, decision cache or warn. Rung 8's own failures: PLATFORM.LOG_APPEND_FAILED (the rung-7 transaction already committed; the outbox retries in order, with no gap) and PLATFORM.CHAIN_HEAD_CONFLICT (two chain writers → P0, tenant stopped).
- **Budgets:** kernel total ≈ 64 ms p50 [unverified]. Sandbox and live applies sit outside it: ≤ 1,200 ms p95 for hosted ERPNext, ≤ 2 s p95 end to end ("MEASURE THIS").

**UI:** the **signature visual of the product**. It is used in three places:
1. **Write path inspector** (`#/records/proof/:seq/path`): the vertical ladder with each rung lit by its outcome for this write (passed / refused here / not reached). Show the measured ms next to the target, the gate_result rows expanded at rung 3, the policy_version at rung 4, the autonomy grant at rung 6, and the snapshot/sandbox/live sub-steps at rung 7. Unreached rungs are greyed, labelled "Not reached" and never blank.
2. **Decide** (`#/work/decide/:obligationId`): a compact horizontal ladder showing where the write stopped ("Stopped at rung 6: autonomy — a person approves") and that it will climb again from 0b after approval.
3. **Reference / Developer** (`#/developers/right-path`): an animated stepper cycling through three canonical outcomes (commit, refusal at rung 3, escalation at rung 6).

Rung chips use neutral fills. Outcome colours come only from status tokens: good = passed, critical = refused, warning = escalated, neutral = not reached, each with a text label. Rung 0b is visually distinct (grey, "no record" note).

### Figure 7 — One governed action, as a sequence
**Status:** L1 — DESIGNED, NOT YET BUILT. Example: E04 Flow 3, where an agent at A2 proposes a ₹2,40,000 sales invoice, a named human approves, and the single writer commits.
**Lifelines (10):**
1. ar-agent (agent · A2 Propose)
2. SDK / MCP (act scope)
3. kernel (Right Path)
4. gate engine (G1–G9 · evaluate())
5. approval svc (console · Work)
6. Venkat (named approver)
7. single writer (+ cred. broker)
8. ERPNext (via Frappe API)
9. proof store (chain writer)
10. meter (meter_event)

**Three acts:**
- **① ESCALATE:**
  - act.write {request, idempotency_key} → assert(intent) lands on 0b.
  - 0b STOP · 1 IDENTITY (actor_kind = agent from the token) · 2 WRITE DOOR (erp.ar v7).
  - Rung 3 runs G1…G9 on as_of; rung 4 runs evaluate() with no model. 5 of 5 gates pass, a row each; allow at policy_version 11.
  - 5 GUARDRAIL passes; 6 AUTONOMY: A2 Propose → escalate; rung 7 not reached.
  - Obligation: write_id, A2, expiry 4 h, resolvers. seal → seq 4,099 (escalated); one meter event, qty 0.
  - HTTP 200 · outcome: escalated · obligation_id · seq 4,099. The agent stops and does not retry.
- **② A NAMED HUMAN DECIDES:**
  - Decide shows the diff · 5/5 gates · policy v11 · countdown → Approve.
  - act.escalate {obligation_id, approve} is its own governed write → seq 4,100 (resolution), one meter event.
  - *alt:* Reject (a written reason) → POLICY.APPROVAL_DECLINED; no action in 4 h → POLICY.OBLIGATION_EXPIRED. Each is recorded; the original is never resubmitted.
- **③ RESUBMIT AND ACT:**
  - The intent is resubmitted with obligation_ref and climbs 0b–6 again (never resumed). G4 dual control now finds a second named actor → allow.
  - Rung 7 ACT: snapshot · shadow-sandbox apply · re-run gates. The broker mints a single-use credential (one write, ten-minute life). Identical bytes go to live; the adapter returns the document name and inverse op.
  - Re-run on live · commit record version + one outbox row (commit order) → seq 4,101 · digest (synchronous) → one event, qty 1.
  - webhook write.committed {write_id, record_id, seq 4,101, digest} → "Approved · posted · proof #4,101".
- **Footer:** "Three proof entries for one approved decision (a fourth, the lapse, on expiry): the kernel keeps no suspended-and-resumed state."

**Arrow colours:** teal for kernel calls, amber for human steps, green-teal for seal/meter returns, and dashed for returns.

**UI:**
- (a) The **Proof → Related records** timeline on any proof record: a horizontal timeline linking 4,099 → 4,100 → 4,101 (escalated → resolution → committed), each node clickable.
- (b) The **Flow player** in Reference and Developer (`#/developers/flows/governed-action`): a swim-lane sequence animation with step-through controls ("Next step", with the step narration in plain words).
- (c) The **Work → Activity** item for this decision shows three chips, "Escalated · Approved by Venkat · Committed", each with its seq.

### Figure 8 — Two modes, two claims
**Status:** L1 — BEING BUILT · LATENCIES ARE TARGETS.
**Mode A (SDK in-process, Enforced):** inside the rung1 Enterprise process, the agent or user composes a write intent, never an allow. @elan1/kernel is a library call behind KernelPort; assert runs rungs 0b–9. The per-tenant credential broker mints a single-use ten-minute credential → rung 7, the single writer → system of record (hosted ERPNext via Frappe's API). A red ✕ marks "no credential, no other path — bypass test C2 must show it fails".
**Mode B (MCP/HTTP, attested advisory):** the caller (a third-party agent over MCP, or a stack1 tool) holds the target credential and calls scope · assert on the kernel service. Rungs 0b–6 decide and the decision is recorded either way (allow · refuse · needs_approval). On allow the caller writes; on refuse it *can still write*. The outcome is reported back, and the proof record flags the act as performed by the caller. If it is never reported, the action is reconciled as **acted_unattested**. A write after a refuse is an **unmatched write**.

| Row | Mode A (enforced) | Mode B (attested advisory) |
|---|---|---|
| Target credential | kernel, per-tenant broker; no long-lived key reachable | the caller; enforced only where the target accepts kernel-issued tokens (open for ERPNext, O03 OQ1) |
| Rung 7 | performs the write | does nothing; the caller acts |
| A refusal means | "the write did not happen" | "elan1 evaluated this and said no" |
| May claim | "This write could not have occurred without passing the gates." | "Every write intent is evaluated against policy and recorded, and the record is exportable." |
| May not say | anything implying L2 ("signed", "tamper-proof", C14) | "we block", "we prevent", "cannot", "nothing gets through without us" |
| Added latency | ≤ 15 ms [target] | ≤ 40 ms p95 contract call [target] |
| Kernel fails | write does not happen; "Nothing was changed." | the caller must fail closed by its own contract; a timeout on assert is treated as refuse |
| Proof record | enforcement_mode: enforced | enforcement_mode: attested_advisory + caller-performed flag (must survive into a bundle) |
| Rollback | kernel reversal plan, 30 days | the consumer's problem |
| Phase 1 use | rung1 Enterprise, hosted ERPNext only | stack1 tooling; third parties at GA (Phase 2), pre-GA partners |

- enforcement_mode is set per write type at declaration time, sealed, rendered and exported, and never set in a tool call.
- Promotion B → A is per write type, never per tenant. It needs 30 days of advisory traffic, a bypass proof, no long-lived credential, and a rollback drill by both paths. A later write with no record reverts it at once.

**UI:**
- Every write type, proof record and agent connection carries an **enforcement badge**, "Enforced" or "Advisory". Copy is fixed from the "may claim" row; the badge tooltip quotes the claim sentence.
- **Agents → Connections** (`#/agents/connections`) shows a Mode A / Mode B split, with Mode B counters for *acted_unattested* and *unmatched writes* (reconciliation findings).
- **Assurance → Enforcement** (`#/assurance/enforcement`) shows the per-write-type mode and B→A promotion checklist progress (30-day advisory clock, bypass proof, rollback drill).
- A **Mode comparison** table in Developer docs.

### Figure 9 — The Declaration: seven blocks and their relations
**Status:** L1 — BEING BUILT. One JSON object (under 900 lines); arrows are references checked at VALIDATE, in CI.
**Blocks:**
1. **identity**: declaration_id (uuid, stable) · name · slug `^[a-z0-9_]{3,48}$` · owner_role (a role, never a person) · residency_domain (G2 compares it) · system_of_record (erpnext at P1) · lexicon_ref (its hash → F15) · description.
2. **shape**: record_type (ERPNext DocType at P1) · fields[] (name · type · cardinality · required · classification: public | internal | personal | financial) · links[] (the ontology's edges). "Not in shape → cannot be written, gated on or bound into proof."
3. **permissions**: grants[], one per actor_kind · role · write_type; actor_kind human | agent | system; role (a tenant role, not a person); min_autonomy A0–A5 (none → A0); may_approve satisfies G4 and is never true for an agent.
4. **write_types** (the hub): name `<slug>.<verb>` (e.g. sales_invoice.submit) · label · intent (one sentence) · blast_radius (one_record | one_counterparty | batch | tenant | cross_boundary → meter basis) · dual_control boolean · gates[] (ordered; order is semantic) · reversal_plan {method, window_hours, after_window} XOR irreversible: true · payload_schema (shape fields it sets) · policy_exempt (skips rung 4; needs an ADR).
5. **gates**: declared pre-gates for rung 3. The name is one of nine: consent · residency · retention · dual_control · rate · budget · counterparty · schedule · precondition. enabled can be false only for rate, budget and schedule; six are never skippable. params · as_of_dependency (no clock) · refusal_codes[] (registered codes only).
6. **proof_binding**: fields[] (shape fields → F14 digest) · canonicalisation elan1_lp_v1 · salt_scope per_record · redaction_profile [L2] (ignored at L1).
7. **channels**: name (registered for the tenant) · kind web | mobile | messaging | api | mcp | voice · write_types[] · may_approve · mode enforced | attested_advisory, set per channel and not per tenant.

- **Arrows and rule IDs:** L0-S01 (permissions → write_types), L0-S02 (write_types → gates), L0-S06/S07 (proof_binding ⊆ shape), L0-S10 (channels → write_types), L0-S11, plus "slug prefix" and "⊆ shape".
- **Centre, "What the kernel reads from it":** never "latest"; retained verbatim forever.
  - Rung 2 resolves id + explicit version; rung 3 runs gates in declared order; rung 5 checks radius; rung 6 checks grants.
  - Record: F05 write_type · F06/F07 id and version · F14 ← proof_binding · F15 ← lexicon_ref. Meter basis ← blast_radius.
  - Console screens are compiled from all 7 blocks.
- **Lifecycle, six stages, none skippable:**
  1. Author (seven blocks, in Studio or a repository file)
  2. Validate (schema, L0-S01…S11, seven lint warnings)
  3. Simulate (nine rungs, stub writer, reference tenant only)
  4. Certify (named human; a governed write; dual_control), shown in amber
  5. Compile (deterministic, content-addressed; 2 digests = P0)
  6. Resolve (rung 2: id + integer version, never "latest")
- **Eleven semantic rules:**
  - L0-S01 granted write types exist; S02 named gates exist; S03 reversal_plan XOR irreversible¹; S04 irreversible ⇒ ≥ one_counterparty¹; S05 tenant/cross_boundary ⇒ dual¹; S06 cross_boundary ⇒ proof_binding.
  - S07 bound fields exist in shape; S08 channels registered for tenant; S09 policy_exempt needs an ADR; S10 every write type on ≥ 1 channel; S11 no agent may_approve, A0–A5.
  - ¹ also mirrored as database constraints.
- **Three dispositions, never a blank:** a value of the declared type; out_of_scope + ADR-nnnn reference; not_measurable + reason + would_change_if (each ≥ 12 chars). Phase 4 (E21) adds Control and Regulation families that bind write types by name + version.

**UI:**
- **Agents → Declarations** (`#/agents/declarations/:id/v/:version`): a seven-block card layout. Each block is a panel and the reference arrows are hover highlights (hover a gate name in write_types to highlight it in the gates block). The version selector never offers "latest"; it lists integer versions with a certified-by name.
- **Studio** (`#/agents/studio/:declarationId`): a six-stage lifecycle stepper. The Validate panel lists the eleven rules with pass/fail, and the three-disposition editor enforces "never a blank".
- A **"What the kernel reads"** side panel maps each block to a rung (a mini ladder with highlights).

### Figure 10 — From clause to proof field: the five-link chain
**Status:** PHASE 4 SPEC — NOT BUILT.
**Links**, each resolved by name + version (the worked example is ledger1 under MCA Rule 3(1) and Rule 11(g)):
1. **Regulation clause** (quoted verbatim, one row per clause):
   - Example: in-mca-audit-trail v1 · issuer MCA · IN · rule_as_at 2023-04-01. Rule 3(1): audit trail of each and every transaction, edit log, date of change, not disabled, kept 8 years. obligation_kind record_keeping · severity blocking · expects_controls (C-AT-01, 1), (C-AT-02, 1).
   - If this link breaks: the clause expects no control → out_of_scope + ADR, or the Regulation is incomplete. Blocking ≠ not_measurable (L0-R06).
2. **Control** (kind · coverage · test · population · operated_throughout):
   - Example: C-AT-01 v1, preventive, per_event: every submission records actor, actor kind and time, and cannot be altered afterwards. Test: F09, F10 and F16 present and F03 = digest(seq − 1), full chain. operated_throughout: true is the Rule 11(g) auditor sentence. C-AT-02: every refused submission is recorded with code and gate.
   - If it breaks: a control naming a gate nobody declared → validation failure, never a warning (L0-C02).
3. **Gate** (declared and enabled in a (declaration_id, version)):
   - Example: coverage.gates[] = precondition, retention, declared in erp_sales_invoice declaration v7. They may raise GATE.PRECONDITION_FAILED or GATE.RETENTION_WINDOW_CLOSED and run at rung 3 on every write, pass or fail.
   - If it breaks: the gate is declared but unused by the write types the control claims to cover.
4. **Write type** (blast radius · dual control · reversal plan XOR irreversible → record fields F01–F16):
   - Example: sales_invoice.submit (+ .amend, .cancel), one_counterparty, dual control above ₹2 lakh. Undo: cancel IRN within 24 h, then a credit note (compensating entry), never a silent delete. Record fields F03, F04, F09, F10, F16.
   - If it breaks: the control expects a record field the record does not carry. That is a design error in the control and never fails structurally.
5. **Proof field** (committed inside F14 via proof_binding.fields[]):
   - Example: customer · posting_date · grand_total · items[].item_code · items[].qty · items[].rate → F14 (elan1_lp_v1). customer_gstin is deliberately not bound (personal field). Profile checks: C01 structural · C02 binding · C05 integrity · C06 temporal (anchor), which is not_applicable at L1.
   - If it breaks: an expected payload field missing from F14, "the most common real failure", caught at authoring (L0-C03).

**Regulation pipeline (E21 Flow 1), drawn as a U-shaped eight-step:**
1. Enumerate (clause_text verbatim)
2. Name controls
3. Walk links 2–5 (render the chain clause → field before certifying)
4. Validate (L0-C01…C05, L0-R01…R06)
5. Compile binding (clause_to_check_map; two runs, two maps = P0)
6. Simulate per clause (established · unmet · not_disclosed · not_applicable)
7. Certify (governed write, dual control, certifier ≠ author)
8. Publish (version n+1, append-only; never before its profile)

- **At runtime and at audit:** at L1 the kernel runs the declared gates at rung 3, and no Regulation object is consulted in the decision path. At L2 the offline verifier runs profile in-mca-audit-trail v1 over a bundle and returns 0 PASS · 1 FAIL_INTEGRITY · 2 FAIL_PROFILE · 3 INCOMPLETE.
- **When a clause changes (Flow 2):** the change is editorial · tightening · loosening (+ ADR) · structural (new declaration version). A record is judged only by the profile version whose window covers its recorded_at; ledger1 v1 applies from 2027-07-01.

**UI:**
- **Assurance → Regulations → Clause trace** (`#/assurance/regulations/:regId/clause/:clauseId`): a horizontal five-node chain (Clause → Control → Gate → Write type → Proof field). Each node shows name@version and a green or red link state with the "if this link breaks" text as the failure explanation.
- An interactive "click a proof field, trace back to the clause" reverse view. This is the most persuasive auditor-facing screen.
- The pipeline becomes a stepper in Studio for regulation authoring.
- Tag everything "Phase 4 — specified, not built" until it ships.

### Figure 11 — The approval path: obligation state machine
**Status:** L1 — BEING BUILT.
**Legend:** blue = caller/channel, teal = kernel step, amber = human decision, pink = refused/failed outcome, dashed = refusal path.
**States and transitions:**
- **Write intent (act.write):** ar-agent (agent, A2 Propose); intent_id is the idempotency key → rungs 0b–5.
- **Escalate, the step-up to a person:** rung 4 evaluate() returns escalate, or rung 6 finds the grant below what the write needs. Obligation: write_id · level · expiry · resolvers. The ladder stops.
- **PENDING (open obligation):** proof seq 4,099 (escalated), meter 0. The agent gets outcome escalated + obligation_id, stops and never retries. The Approvals queue sorts oldest deadline first. Expiry defaults to 4 h (asserted, not observed).
- **DELEGATED (Send to)** (dashed amber): if the proposer presses Approve → GATE.DUAL_CONTROL_SAME_ACTOR. "You proposed this, so you cannot also approve it. Send it to: [names]." Humans only; the obligation stays pending.
- **Agents never approve at L1:** the resolver set holds humans only; act.escalate from an agent token is refused (E06 decision 8).
- **DECLINED** (Reject): Reject requires a reason of at least a sentence. The resolution is recorded as its own governed write, and the original write is refused with POLICY.APPROVAL_DECLINED and never resubmitted.
- **EXPIRED:** nobody acted before expiry → POLICY.OBLIGATION_EXPIRED, a governed event with its own proof entry, never a stale row. Webhook obligation.expired; operator action: resubmit. Expiry is paused during a platform outage.
- **APPROVED** (human ≠ proposer): itself a governed write. The Approval object is written with its own record, seq 4,100. Webhook obligation.resolved. Rung 7 is never reached by the escalated write itself.
- **RESUBMITTED → COMMITTED** ("resubmit, never resume"): the original write is resubmitted with obligation_ref and climbs all nine rungs again; G4 finds a second named actor; rung 7 goes sandbox → live; seq 4,101; meter 1.
- **APPROVED, WRITE NOT DONE:** rung 7 fails with GATE.SANDBOX_DIVERGED (snapshot restored) or PLATFORM.TARGET_UNREACHABLE. Copy: "Your approval was recorded. The write itself did not complete, and nothing was changed."
- **Phone and WhatsApp:** reply APPROVE / REJECT only where whatsapp_approve: true (low value, reversible, one_record), bound to the obligation id. Otherwise a deep link only.
- **How the caller learns the outcome:** webhooks, HMAC-signed, at-least-once: write.escalated · obligation.resolved · obligation.expired · write.committed · write.refused, each carrying seq + digest. Polling fallback: GET /v1/obligations?status=open, no faster than every 10 s. "A consumer that handles only 'committed' silently loses writes."

**Decide, what the approver sees before Approve** (normative for the Decide screen):
- the one-line proposal
- the proposer stated in words ("Agent" or "Person", not an icon)
- a deadline countdown (announced, pausable) and the declared blast radius
- a field-by-field diff, before → after, with unchanged rows behind "Show all fields"
- every declared gate's result, not only failures, each with its declaration version. Example: "Precondition (credit limit ₹3,00,000, exposure after ₹2,40,000) — passed"
- the decision, "allow at policy version 11", and why a person is needed: "the proposing agent is at A2 Propose; a person approves before anything is written"
- Approve · Reject (reason required), with 44 px targets, never adjacent without a gap
- L1 banner: "This record is hash-chained. It is not signed…"

**Approval as data:** approval_id · write_id · approver_id (≠ actor_id when G4 applies) · approver_kind (human only at L1) · decision approve | decline · basis (surface plan version + rendered payload digest, i.e. what was actually shown) · at (platform clock, RFC 3339), plus its own sixteen-field record and seq.

**UI:**
- The **Decide screen spec** above is canonical. Implement it verbatim.
- **Work → Approvals** (`#/work/approvals`) is sorted by oldest deadline first, with state tabs: Pending, Delegated (Send to), Declined, Expired, Approved, and "Approved, not done".
- A **state machine diagram** on `#/developers/flows/approval` with the state nodes clickable, showing webhook names on transitions.
- An **Obligation detail** drawer shows the state history as a timeline of seq numbers.
- A mobile layout (`#/m/decide/:id`) with the WhatsApp eligibility rule surfaced ("Reply by WhatsApp is off for this write: it is irreversible").

### Figure 12 — Data architecture: stores, flows, tenancy and retention
**Status:** L1 — BEING BUILT · L2 DASHED.
**Top row:** Callers (SDK in-process or MCP/HTTP; the token is one tenant, one actor, one autonomy level) → elan1 kernel (rungs 0b…9) → 7 → System of record (ERPNext via Frappe API; single-use credential, one write, 10-minute life).
**Stores**, with the rung that writes each:
- **Declaration registry** (rung 2): every version verbatim, forever; append-only, never compacted; resolved by id + integer version; lexicon term sets (hash → F15); certification is a governed write.
- **Writes and gate results** (rungs 1–5): write row (write_id, resolved versions, actor_kind kernel-set); gate_result (one row per declared gate: outcome, as_of, inputs hash); decision with policy_version; idempotency key kept 30 days.
- **Obligations and approvals** (rung 6, amber): obligation (write_id, level, expiry, resolver set of humans only); approval (approver_id, decision, basis = rendered payload digest). Each resolution is its own governed write and record.
- **Record version + outbox** (rung 7): BEGIN · record version · one outbox row · COMMIT. Record-or-nothing is that one shared transaction. If the chain append fails, the row survives and is retried in order.
- **Snapshots and backups:** pre-apply snapshot kept 30 days for rollback; PITR; nightly encrypted backup; quarterly restore drill including the evidence store + re-verify.
- **Proof log** (rung 8 chain writer): hash-chained, sixteen fields F01–F16 per record, every refusal included; UNIQUE (tenant_id, seq); seq from 1; prev_digest = digest of seq − 1; INSERT granted to one principal, UPDATE to none; WORM copy. A nightly integrity job recomputes every chain, and a break is a P0. L1: SHA-256, unsigned, tamper-evident to the tenant only.
- **Meter ledger** (rung 9): meter_event (event_id, write_id, seq, basis, quantity, outcome); CHECK refused ⇒ quantity 0; every event references a write; reconciled nightly both ways.
- Band: "TENANT-SCOPED POSTGRES · RLS ON EVERY TABLE".
- **Keys and secrets:** at L1 no signing key material anywhere; secrets in a managed store; target credentials minted. [L2] domain signing key in KMS, Ed25519, one per residency domain.
- **Salts and anchors [L2]:** per-record salt in a separate store at P0 (destroy it and the payload is unbound while the digests hold); two RFC 3161 tokens per batch, retained indefinitely.
- **Evidence bundles [L2]:** eight members, generated on request; the export is itself a governed write (manifest digest); elan1 keeps no copy (E15) while O05 lists 24 months.
- **Pack and profile registry:** packs (eleven blocks, gate scores kept forever, rejects by name); verifier profiles append-only, every version kept; the kernel has no notion of a pack.
- Region band: "REGION ap-south-1 (MUMBAI) · THREE AZs · NO SECOND REGION, INCLUDING FOR DR, WITHOUT A WRITTEN DECISION".

**Retention by class:**

| Class | Retention |
|---|---|
| Proof records | MCA ≥ 8 years vs O05 7 years WORM (**conflict**, shown in red); E11/E15: indefinitely |
| Declarations, profiles, lexicons | verbatim, forever ("the 2027 screen rebuilt in 2035") |
| Anchors [L2] | indefinitely, with TSA certificate path and revocation data |
| Evidence bundles [L2] | O05 24 months WORM vs E15 not retained |
| Snapshots · backups | 30 days, encrypted, in India |
| Security and access logs | ≥ 1 year; 180-day minimum in India (CERT-In) |
| Application logs | 180 days, append-only, no PII (CI lint) |
| Idempotency keys | 30 days |

**Tenancy and residency checks in CI:**
- RLS on every tenant table; a migration disabling it fails.
- A cross-tenant read test expects failure.
- A call not attributable to a tenant is rejected.
- Caches, indexes and vector stores are partitioned, not filtered.
- The control plane has no network route to records.
- Postgres primary + synchronous standby (2nd AZ).
- CI fails any resource outside the region list.
- Residency and key custody sit at P0 with no migration path.

Footer: "At L1 every store is checkable only by those who trust elan1; E11 test 3 — reconciliation to the target system — is the outside check."

**UI:**
- **Assurance → Data and residency** (`#/assurance/residency`): a map card (India, ap-south-1, three AZs; "No second region") with the store inventory as a table (store, writer rung, tenancy, retention, level). L2 rows are dashed, labelled "Level 2 — not built".
- The retention table is a first-class component, and conflicts render with a "Source conflict" warning badge until resolved. Do not hide them.
- A **Store drawer** from the System map.

### Figure 13 — The Level 1 proof record: a per-tenant hash chain
**Status:** L1 — BEING BUILT.
**Shows:** the sixteen-field layout with octet sizes, and three example records linked by prev_digest.

| Field | Name | Encoding · octets |
|---|---|---|
| F01 | tenant_id | uuid · 16 |
| F02 | seq | uint64 · 8 |
| F03 | prev_digest | digest · 32 |
| F04 | write_id | uuid · 16 |
| F05 | write_type | string · 5–64 |
| F06 | declaration_id | uuid · 16 |
| F07 | declaration_version | uint32 · 4 |
| F08 | policy_version | uint32 · 4 |
| F09 | actor_id | uuid · 16 |
| F10 | actor_kind | enum · 5 or 6 |
| F11 | autonomy_level | uint8 · 1 |
| F12 | record_id | uuid · 16 |
| F13 | record_version | uint32 · 4 |
| F14 | payload_hash | digest · 32 |
| F15 | lexicon_hash | digest · 32 |
| F16 | recorded_at | timestamp · 20 |

**Example records:**
- **seq 1, genesis (TV-001):** F03 = 32 × 0x00; F05 sales_invoice.submit; F10 human; F11 2; F12 record id; F13 1; F16 2027-01-04T09:15:00Z. The preimage is exactly 329 octets; d₁ = SHA-256(preimage).
- **seq 4,097, committed** (teal): F03 = d₄₀₉₆; F05 erp.payment_entry.submit; F07 decl v7; F08 policy 11; F10 human; F11 4 (A4); F12 ERPNext record id; F13 ≥ 1; F14 salted payload digest; digest d₄₀₉₇; meter 1.
- **seq 4,098, refused** (pink): F03 = d₄₀₉₇; F05 erp.sales_invoice.submit; F10 agent; F11 3 (A3); F12 zero UUID; F13 0; same sixteen fields, same shape as a commit; GATE.PRECONDITION_FAILED; d₄₀₉₈; meter 0.

- **Kept beside each record, outside the preimage:** a gate_result row per declared gate, the refusal code, the reversal plan, one meter event, and the approval, which is its own record.
- **Preimage:** preimage = LP("elan1.proof.seal.v6") ‖ LP(enc(F01)) ‖ … ‖ LP(enc(F16)); LP(x) = uint32_BE(len(x)) ‖ x; 17 groups; digest = SHA-256(preimage). At L1 there is no signature, key_id or anchor_ref member (absent, not null or stubbed) · assurance_level: 1.
- **Writing the chain:** the chain writer consumes the outbox in commit order; assigns the next seq; reads prev_digest from seq − 1; appends under UNIQUE (tenant_id, seq); returns seq + digest synchronously. LOG_APPEND_FAILED: the outbox row survives and is retried in order. CHAIN_HEAD_CONFLICT → P0, tenant stops. The tenant stop is the only refusal with no record.
- **Detecting a gap:** recompute every preimage and digest; walk seq contiguously; resolve every declaration version and lexicon hash; report PASS or the first failure (seq, field, reason). The nightly job re-walks every tenant's chain. Continuity is **three-valued**: continuous · break at seq N · not checked over this range (scope and count printed). It "cannot see a cut tail: 4,000 of 4,200 looks complete".
- **Establishes / does not establish** lists: see Part 5 copy guidance.
- "L2 signs these exact bytes; records written at L1 stay L1 and are never back-signed."

**UI:**
- **Records → Proof record** (`#/records/proof/:seq`): a sixteen-field table in mono with octet sizes, F03 linking to the previous record, a "Next record" link, and a side panel for gate results, meter event and approval ("kept beside, outside the preimage").
- **Records → Chain** (`#/records/chain`): a horizontal chain strip of seq blocks linked by prev_digest. Refusals are visually distinct, with a text label and outline. A continuity banner shows the three-valued result exactly (Continuous 1–41,206 · Break at seq N · Not checked over range).
- A **"What this record establishes / does not establish"** disclosure block on every L1 proof page.
- A **Preimage inspector** for developers: expand to see the 17 LP groups as hex with lengths.

### Figure 14 — Seal Spec v6: sixteen fields to a signed, anchored seal
**Status:** L2 — SPECIFIED, NOT BUILT ("the one hard freeze").
**Field groups** (the left column): CHAIN POSITION (F01–F03) · THE WRITE (F04–F05) · WHICH RULES DECIDED (F06–F08, F15) · WHO ACTED, AT WHAT LATITUDE (F09–F11) · THE TARGET RECORD (F12–F13) · THE PAYLOAD, COMMITTED (F14) · WHEN (F16).
**Pipeline, seven steps in a U shape** (teal solid for L1, dashed for L2):
1. BIND: 16 fields from the append-only context; nothing computed here.
2. CANONICALISE: encode each field; length-prefix each (uint32 BE); domain string first.
3. DIGEST: SHA-256 over 17 length-prefixed groups → 32 octets; no JSON anywhere.
4. CHAIN: append under UNIQUE (tenant_id, seq); return seq + digest to rung 8. **"L1 stops here · assurance_level: 1".**
5. SIGN [L2]: pure Ed25519 over the 32-octet digest (RFC 8032, not ph, not ctx; COSE alg −8); pinned verification profile; key_id e.g. k_in_20270401_9c3a.
6. ANCHOR [L2]: tenant batch → RFC 6962 Merkle root (odd node promoted); RFC 3161 token from two TSAs, one India-based; ≤ 15-min interval; an inclusion path per record.
7. SEAL OBJECT [L2]: sixteen fields + digest + assurance_level: 2 + signature + key_id + anchor_ref (Merkle path + token reference).

- **Encodings:** uuid is 16 binary octets big-endian, never text; integers unsigned BE; strings UTF-8 NFC with no BOM or terminator; enums as lowercase ASCII tokens; time YYYY-MM-DDTHH:MM:SSZ in 20 octets.
- **Deliberately outside the preimage:** the payload itself (erasure destroys the salt), gate results (bound by declaration version), the approver (an approval is its own record), the enforcement mode, a seventeenth field, and a signature at L1.
- **64 test vectors:** PV-01…12 structure; PV-13…24 chains (2 and 1,000 records, an all-refusal chain, a chain spanning a key rotation); PV-25…36 Merkle/anchor [L2] (1, 2, 3, 7 and 1,024 leaves); NV-01…28 must be rejected, naming record and field (a gap in seq, a 17th field, a text uuid, delimiters, NV-13 odd node duplicated, NV-14 ph signature, a bundle with its own key). TV-001: 261 content + 17×4 prefix octets = a 329-octet preimage; the old 311-octet figure is retired.
- **Two-implementation rule (8 steps):**
  1. Freeze the text and vector inputs, withholding the expected digests.
  2. Teams A and B build from the text alone, with no shared code, branch, channel or engineer.
  3. Diff octet for octet; 64 of 64 is the only pass.
  4. A disagreement is a defect in the text: fix the text, never make one implementation match the other.
  5. Re-implement.
  6. A third party writes the verifier (no network, empty lockfile).
  7. The verifier passes every positive and rejects every negative.
  8. Publish text, vectors, digests and verifier source together.
- **Never:** a seventeenth field · a v6.1 · an optional field · a library shared by chain writer and verifier · signing at L1 · back-signing · a record leaving the building before step 8.

**UI:**
- **Developer → Seal v6** (`#/developers/seal-v6`): a seven-step pipeline diagram with a hard divider after step 4 reading "Level 1 stops here". Steps 5–7 are dashed and labelled "Level 2 — specified, not built".
- A **test-vector browser** (PV/NV list, expected result, what it catches).
- On the tenant **Proof record**, the L2 steps are never shown at L1 (honesty rule). On an L2 tenant, the Proof record's "Seal" tab shows steps 5–7 filled.

### Figure 15 — The evidence bundle and the offline verifier
**Status:** L2 — SPECIFIED, NOT BUILT.
**Bundle `elan1.evidence.bundle.v1` (a directory or .tar), eight members:**
- manifest.json (always): range, record + refusal counts, profile claimed, unanchored_head, members[] with SHA-256; written last.
- seals.jsonl (always): one record per line in seq order: 16 fields, digest, level; [L2] signature.
- chain.json (always): genesis + head digests, seq range, boundary rows (level or key change).
- anchors/ (at L2): per batch, RFC 3161 tokens, Merkle root, leaf count, paths, TSA cert + revocation.
- keys.json (at L2): key_id, validity window, status, successor, fingerprint; never the key.
- declarations/ (always): every referenced (id, version), verbatim.
- lexicon/ (always): every term set referenced by F15.
- VERIFY.txt (always): how to check without elan1; exit codes; the profile's limits statement verbatim.

**Never in a bundle:** payloads (F14 commits without carrying them), salts, key material, executables/scripts/URLs to fetch, the target system's current state.

**The verifier reads nothing else:** the bundle, the profile document, a key fingerprint from the reader's own source, and the local clock (only to check anchor time < now). No network, API, account or shared code.

**Verifier flow:**
1. Echo the claim (range, counts, profile and scope, before any check).
2. Profile version supported? (unknown → exit 4 UNSUPPORTED; get the matching verifier; never guess)
3. Integrity checks, which always run (recompute preimage and digest; walk seq/prev_digest; signatures against keys.json windows + fingerprint; Merkle paths vs anchor roots; token time before the local clock; resolve every declaration and lexicon). Altered data or a bad signature → **1 FAIL_INTEGRITY** (forensics; stop). A missing member → **3 INCOMPLETE** (ask again).
4. Profile checks, E13 (structural · binding · coverage · temporal, each with its on_fail class). Unmet → **2 FAIL_PROFILE** ("records sound; this regime's requirements unmet — a controls conversation, never tampering").
5. Write the report and exit **0 PASS** ("rely on it within the limits"). Variants: "0 PASS — payload unbound (erased)" and "0 PASS — unsigned, assurance level 1: internal evidence only".
6. Bad arguments → **5 USAGE**.

"1 and 2 are never collapsed; 3 is never reported as either — each accuses a different person."

**Supporting panels:**
- **Verifier profiles, eight blocks:** identity · regime_binding · bundle_requirements · checks[] C01… · report_vocabulary · limits_statement (≥ 200 chars, unique, verbatim) · versioning (rule_as_at, applies_to_records_from) · conformance P1–P12 before certification. The first profile is in-mca-audit-trail v1 (4 clauses, 6 checks).
- **Report, nine sections:** verdict · the claim · scope with continuity and count · integrity results · clause results · first failure in full (seq, field, expected, found) · notes · limits verbatim · reproduction (command, verifier, profile, bundle digests).
- **Proving the verifier is the published one:** stdlib only, empty lockfile, byte-identical build on two machines, ships with 64 vectors + a tampered bundle, SHA256SUMS + release signature, readable in a day.
- "A verifier nobody has watched refuse is not a verifier: run it on the published tampered bundle and watch it exit 1."

**UI:**
- **Records → Evidence exports** (`#/records/exports`), L2 only; on L1 an empty state that says "Evidence bundles arrive at Level 2 (Attested). At Level 1, verification requires elan1." It has a bundle builder (range, profile), a member checklist with always/at-L2 tags, and a "never in a bundle" note. Creating an export is a governed write, so it shows the resulting seq.
- **Assurance → Verify** (`#/assurance/verify`) has two panels:
  - The L1 **verify call** (chain segment, PASS / first failure), labelled "Checked by elan1".
  - An L2 **verifier report viewer** that renders the nine-section report with an exit-code badge. The exit-code badges map 0 → good, 1 → critical, 2 → serious, 3 → warning, 4 and 5 → neutral, always with the code name.
- **Developer → Offline verifier** docs, with a "watch it refuse" demo on the tampered bundle.

### Figure 16 — Key management and custody
**Status:** L2 — SPECIFIED, NOT BUILT. Principle: "A key is not a secret we protect; it is a capability we account for — every use of one is a governed write."
**Four key classes** (no root key, no PKI chain; key material never leaves the custody module):
- **Domain signing key** (evidence path [L2]): signs the 32-octet digest at rung 8, and the L2 claim rests on it. KMS, pure Ed25519, in the domain's region, Origin KMS, no import. Sign is granted to one principal, the chain writer process. Rotation every 12 months or on compromise.
- **Anchor client key** (evidence path [L2]): authenticates elan1 to a TSA and signs nothing a reader verifies. KMS in the same domain; invoked by the anchor service; rotation per authority policy, at least annually.
- **Release key** (distribution path [L2], amber = named humans): signs verifier binaries, source tarballs and vector sets. Offline hardware token held by two named humans, no cloud; invoked by the release approver; rotation every 24 months.
- **Transport keys** (grey, exists at L1): TLS and the per-write single-use target credential; ordinary platform secret store; minted per call with a 10-minute life; invoked by the single writer. A leak is an availability and confidentiality issue, not a proof issue.

"One signing key per residency domain, not per tenant." Per tenant: the chain, salt rows, anchor batch, registry scope, export. An exclusive key needs a dedicated domain (Enterprise tier), or L3.

**Rotate (windows abut, never overlap):** a timeline bar, k_in_20270401_9c3a (retired) | successor (active), with T_cut: valid_to = successor's valid_from; the successor is registered 30 days ahead.
1. Generate the successor in-region and read back its fingerprint.
2. Register valid_from ≥ 24 h ahead; the screen shows "Overlap: none".
3. Dual control: a second named human approves at Decide. The registration is a record in the operator and tenant chains.
4. At valid_from the chain writer switches, in one transaction.
5. The predecessor is retired; its records still verify in window.
6. The new fingerprint is published out of band and recorded.

**Respond to a suspected compromise (P0, pink):** a timeline "signed, then revoked | unsigned, level 1 | successor signs" around T_suspect, the earliest defensible instant.
- Stop signing; the chain keeps writing at assurance_level 1.
- The revoked key's valid_to = T_suspect, a declared unsigned gap.
- Every affected tenant is told in writing within 24 h.
- Its records still verify, because revocation is never a failure. The key is no longer exclusive after T_suspect.
- Records stay anchored if a TSA token predates T_suspect.
- Never re-sign or back-date the revoked range.

**Proving only the kernel used the key:** three records that would have to be corrupted together (the provider's KMS audit log, the elan1 chain, the anchors). Nightly: every Sign call ↔ exactly one signed record; a Sign call with no record pages and stops the domain. Dual control on five operations (generate · register · rotate · revoke · publish a verifier release), with no emergency variant and no "sign this" endpoint.

**Disclosed limit:** at L2 the key sits in elan1's cloud account, so a privileged insider could alter the key policy. It would be visible, but it is possible, and this is disclosed unprompted. L3 customer-held keys (CloudHSM, Thales, Entrust) remove it: "You hold the signing key … it is none of yours." A lost key cannot be re-signed.

**Source conflicts:** O05 sets 90-day rotation, E16 sets 12 months. A KMS outage refuses writes, while a compromise keeps writing unsigned. At L1 there is no key material anywhere.

**Legend:** L2 evidence path (teal dashed) · held by named humans (amber) · exists at L1 (grey) · compromise path (pink) · L3 specified, not built (purple dashed).

**UI:**
- **Assurance → Keys** (`#/assurance/keys`). On an L1 tenant it shows only transport credentials (the credential broker: mints today, 10-minute life, zero long-lived keys) and an explicit empty state: "No signing key exists at Level 1. Records are hash-chained, not signed."
- L2 view: a key register table (key_id, class, status ACTIVE/RETIRED/REVOKED, validity window, fingerprint), a rotation timeline with an "Overlap: none" check, Sign-call ↔ record reconciliation, and dual-control operations routed to Decide.
- A compromise-response runbook stepper for operators.

### Figure 17 — Two-authority timestamp anchoring
**Status:** L2 — SPECIFIED, NOT BUILT. "Anchoring never refuses or delays a write."
**Six-step loop:**
1. Write and chain: the chain writer binds F01–F16, computes SHA-256, and appends. At L2 it signs with Ed25519 and enqueues the digest in the tenant's current batch.
2. Close the batch: at the interval (≤ 15 min, a published SLO per tier) or the batch size cap; records leaf count and seq range. Idle interval: no batch, no token.
3. Merkle root, RFC 6962 §2.1: leaf = SHA-256(0x00 ‖ d), node = SHA-256(0x01 ‖ l ‖ r). The odd final node is promoted, never duplicated (NV-13). Root and all paths are stored first.
4. Check each token now: imprint = root sent; signature verifies; nonce matches; genTime sane and not in the future. Mismatch → discard and retry with a new nonce; twice in a row → P0.
5. Store the anchor: anchors/<batch_id>/ holds both tokens (CMS SignedData, TSTInfo), both certification paths, OCSP/CRL captured now, and the RTT.
6. What the record carries: at L2, signature, key_id and anchor_ref (inclusion path + token reference); at L1, all three are absent. The unanchored head drops.

- **TimeStampReq (root + nonce, both authorities in parallel)** goes to **two independent TSAs**:
  - **A, India-based:** eMudhra (recommended), CCA-licensed, time traceable to Indian standard time.
  - **B, global commercial:** one of DigiCert, Sectigo, GlobalSign or Entrust, with SLA and practice statement; a different operator, trust root and country. Free public TSAs are for dev only.
- **Flow 2, an authority is unreachable:**
  1. Retry with backoff for the rest of the interval. If the other TSA answered, the batch is marked **single_anchor** (degraded, not failed).
  2. The next batch opens on schedule; batches are never held open.
  3. The same TSA failing for 2 intervals → SRE paged.
  4. Both failing for 4 intervals → Assurance door banner: **"Anchoring degraded since 09:14 — 88 records unanchored"**.
  5. On return the backlog is anchored oldest first, each batch with its own root, never merged; the true token time is kept and the gap left visible.
  6. A TSA whose tokens fail the checks is removed, and anchoring runs with one.
  7. Two tokens disagreeing about the root → integrity failure, P0.
  - Anchoring is not a gate: it has no refusal path and never blocks a write.
- **Offline verification:** recompute leaf → path → root = imprint; the token signature verifies against the TSA certificate; the path reaches a trust anchor; genTime precedes the local clock (weak by design). The bundle verifies if either token verifies. Exit 1 if a path or anchor fails; exit 3 if the anchor member is missing; L1 records are not_applicable.
- **What an anchor proves / does not prove:** it proves existence, form and an upper bound on time, and catches a chain cut at the tail or a chain recomputed wholesale. It does not prove creation time, completeness, honesty, truth or legal effect. Re-anchoring adds a later bound and never replaces one.
- "Anchoring is machinery, not a governed write: not in the tenant chain; a fixed cost in the L2 add-on, never a metered unit."

**UI:**
- **Assurance → Anchoring** (`#/assurance/anchoring`), L2 only. It shows a batch timeline (≤ 15-min ticks), per-batch status (anchored by both / single_anchor / pending), two TSA health tiles with an RTT sparkline, and an unanchored-head counter.
- The **degraded banner copy is canonical**; implement it verbatim on the Assurance door.
- On L1 tenants the page is a labelled preview ("Level 2 — specified, not built") with an explainer, and no live times.

### Figure 18 — The pack factory: five gates, eleven blocks, eight tests
**Status:** DESIGNED — NOT YET BUILT.
**Five admission gates**, drawn as a funnel ("all five must pass; 'probably' is scored fail"):
- G-A, a dated hook: a named regulation, standard or contract with a date.
- G-B, an auditor: someone obliged to ask, who could be telephoned.
- G-C, reversible or declared irreversible: write types declare which, without lying.
- G-D, evidence sold separately: a buyer pays for the bundle on its own line.
- G-E, we own the write: in the write path, not reading another log.

**Rejected by name:**

| Candidate | Gate(s) failed | Reason |
|---|---|---|
| public1 | G-A, G-D | procurement cycle outlasts the runway |
| agri1 | G-B | subsidy audits are annual and on paper |
| retail1 | G-B | reversible, low stakes, nobody audits a price change |
| (none named) | G-C | — |
| edu1 | G-D | no buyer for evidence on its own line |
| legal1 | G-E | the matter lives in someone else's document system |
| energy1 | G-E | the write path belongs to SCADA vendors |

Two further rejections are held in the portfolio register. G-E kills the most candidates. A failed candidate goes to the portfolio register with the gate and the sentence, never softened. Admit is a governed write with dual_control: true and founder approval; proposer approving → GATE.DUAL_CONTROL_SAME_ACTOR.

**Eleven-block template:**
1. pack_identity (pack_id `^[a-z][a-z0-9]{2,15}1$`, version, owner role, domain)
2. obligation (regime, issuer, date, clause set; one regime per profile)
3. buyer (job title that signs, budget line, auditor's job title)
4. gate_scores (G-A…G-E with evidence, retained forever even if failed)
5. declaration_ref (seven E03 blocks; no own ontology)
6. write_types[] (blast radius, reversal plan, dual-control thresholds)
7. gates[] (pre-gates in order, parameters; six never-skippable present)
8. profile_binding (profile_id, version, rule_as_at; certifier is not the author)
9. buyer_promise (what the buyer receives and what it does not)
10. tests[] (T1–T8; a real refusal per gate, T4)
11. pilot (named customer, named auditor, dates, finding)

Teal tags mark the five parts of a pack as configuration: declarations · approver model · policy rules · regulatory bindings · evaluation set.

**Factory, five steps:**
1. Staff it: regulatory engineer, declaration owner, profile author and certifier, named the same day, never the same person.
2. Read and bind: each clause quoted verbatim → write type, gate, field; ≥ 1 check per clause.
3. Test T1–T8: T3 dated reversal drill · T5 offline exit 0 PASS · T6 tampered → exit 1 · T7 non-conforming → 2 · T8 the auditor reads it.
4. Certify: a second named human; the profile passes P1–P12; a governed write with dual control.
5. Pilot, then live: 90 days, 1 customer, 1 auditor; tests G-D. ledger1 Oct 2027 · invoice1 Apr 2028 · collect1 Oct 2028.

The kernel does not change. Pack engineering headcount goes from 2 to 50 (modelled).

**UI:**
- **Assurance → Packs** (`#/assurance/packs`) is a pack catalogue: installed and available packs with status (Specified / Pilot / Live), the regime, a certified profile version and the five gate scores as a pass/fail strip.
- **Pack detail** (`#/assurance/packs/:packId`) shows the eleven-block template as a checklist with T1–T8 test results.
- An internal **Pack factory board** (`#/reference/pack-factory`): a funnel view of candidates with the rejected-by-name list.

### Figure 19 — ledger1 at runtime
**Status:** PACK — SPECIFIED, NOT BUILT.
- **Header boxes:**
  - MCA Rule 3(1), Companies (Accounts) Rules: in force 1 April 2023; ~1.85 million companies; audit trail of each and every transaction, edit log, date, never disabled, preserved ≥ 8 years.
  - Rule 11(g), Audit and Auditors Rules: the statutory auditor reports that the trail existed, operated all year, was not tampered with and was preserved. Wilful breach: ₹50,000–₹5,00,000, up to 1 year.
  - ledger1 pack v1: the buyer is a promoter or finance controller at a ₹5–50 crore firm, on the CA's advice; the budget line is audit and compliance.
- **Who writes:** rung1 Enterprise users, agents and scheduled jobs. F10 actor_kind is human · agent · system and is never inferred. Each submits a write intent (KernelPort assert).
- **Write-type table** ("ledger1 configures rung1's ERPNext declaration; no new ontology"):

| Write type | Blast radius | Reversal | Dual control |
|---|---|---|---|
| sales_invoice.submit | one_counterparty | target_native_undo | above ₹2 lakh |
| sales_invoice.cancel | one_counterparty | irreversible after 24 h | always |
| purchase_invoice.submit | one_counterparty | target_native_undo | above ₹2 lakh |
| payment_entry.submit | one_counterparty | compensating_instrument | always |
| journal_entry.submit | batch | compensating_instrument | always |
| customer.update (terms, GSTIN) | one_record | target_native_undo | on GSTIN change |

- gates[] in declared order: consent · residency · retention · counterparty · precondition · dual_control · budget. The first six are never skippable; budget is declared on.
- Approval (dual control): a second approver who is a person, not the requester; same actor → GATE.DUAL_CONTROL_SAME_ACTOR. Refusal: code, rung, every gate's result, one operator action; metered at 0; must be in the bundle (refusals_required).
- Right column: rung1 Enterprise (ERPNext hosted mode; the single writer holds the only credential → Enforced; G-E passes). Other systems (SAP, Oracle, Tally…): in Phase 1, Enforced is claimed only for rung1 hosted mode, and any other system is attested advisory.
- **Proof, retention and the auditor's report (minimum assurance level 2):**
  - Proof record: F09, F10, F12, F13, F16; at L2, Ed25519 + two TSAs; retained indefinitely, above the 8-year MCA floor (O05 baseline says 7 years).
  - Evidence bundle: any period; every change and refusal; exported by the customer without elan1's help.
  - in-mca-audit-trail v1, clause → checks:
    - each and every transaction → C01, C02
    - edit log → C03
    - date of change → C04
    - not disabled → C05 chain, C06 anchor
    - rule_as_at 2023-04-01; records from 2027-07-01; full_chain continuity; L1 dry run: C06 not_applicable.
  - Statutory auditor: runs the verifier offline (0 PASS, 1 integrity, 2 profile), performs E11 test 3 (two-way reconciliation with ERPNext's own trail), and writes the Rule 11(g) sentence.
- **Limits statement:** "a PASS does not show the books are complete — direct edits in the accounting system sit in its own trail — nor that transactions were genuine or any obligation met. No regulator has reviewed it."
- Plan: ledger1 live Oct 2027; full value needs L2 (GA target Apr 2028).

**UI:** the **Pack detail: ledger1** page (`#/assurance/packs/ledger1`) mirrors this figure.
- The regulation header cards.
- The write-type table with a live count per type.
- A gate-order chip strip, with never-skippable gates marked by a lock icon and a text label.
- The clause → check mapping, with a check status per clause for the current period (on L1: "C06 not applicable at Level 1").
- The **auditor handoff panel**: L2 only; on L1 an empty state explaining "full value needs Level 2".
- The limits statement shown verbatim.

### Figure 20 — collect1: four obligation layers, fourteen gates
**Status:** SPEC SKETCH — CITATIONS NEED COUNSEL.
**Four layers:**
- **C Conduct:** RBI fair-practices rules on recovery: permitted hours, no harassment, no third-party disclosure, identified caller, grievance route.
- **T Telecom:** DLT sender registration, approved headers and templates, preference register scrub, correct number series, attempt limits.
- **D Data:** DPDP lawful basis, purpose limitation, retention, erasure handling.
- **S Sector:** the lender's board-approved policy and outsourcing rules; evidence for an inspection.

**Fourteen gates in three phases** (the letters show the layer each serves):

*Before the dial (all blocking):*
1. Lawful basis (D): consent or service relationship, current now, never cached
2. Preference scrub (T): a live register check; a stale scrub is a refusal
3. Time window (C): permitted recovery hours in the borrower's location
4. Attempt cap and cooling period (C, T): per borrower per day and week; no retry loop
5. Script and template version (T, S): the approved template, versioned and hash-pinned
6. Authority band (S): amount and settlement latitude this agent may discuss
7. Number and series (T): calling from the lender's own allocation

*During the call:*

8. Disclosure (C): told it is an automated call, first
9. Identity check (C, D): third-party disclosure is a hard refusal
10. Read-back (C): amounts, dates, any promise confirmed
11. Prohibited-language guard (C): coercion, threats, implied legal action
12. Human path (C): "connect me to a person" always works

*After the call:*

13. Recording integrity (S): per-chunk hashed audio, complete and unspliced
14. Disposition recorded (S): no call closes without one

- Channels (block 7): outbound voice on the lender's allocation, inbound callback, WhatsApp or SMS fallback for reminders. Autonomy is capped: state facts, take a promise within the band, escalate; never settle or waive a charge ("that is a gate, not a preference").
- **Six write types:**

| Write type | Meaning | Reversibility |
|---|---|---|
| call.attempt | a dial is authorised | irreversible |
| call.record | the sealed outcome record | append-only |
| promise.capture | promise-to-pay from the borrower | reversible |
| disposition.set | contactability, wrong number, dispute | reversible |
| escalation.raise | hand to a human agent | reversible |
| preference.update | borrower asks not to be called | irreversible; never undone by an agent |

- **Typed refusals, a closed set of sixteen, billed at zero:** no consent · on the preference register · outside window · attempt cap reached · cooling period active · template not approved · outside authority band · wrong number series · identity unconfirmed · third party on the line · borrower asked to stop · recording failed to start · language unsupported · script version mismatch · carrier unavailable · escalation required. Drawn from verna1's sixteen.
- **Evidence, in-rbi-collections v1:** a chained record per attempt; consent and scrub state at dial; script hash; audio chunk hashes; disposition.
- **Does not prove:** that the debt is valid, identity beyond the check, that the call was kind, or audio before the capture point.
- **Gate G-E is open:** the lender's collection system may belong to its core software, which means attested advisory on that path.
- Plan: Oct 2028, priced per governed call.

**UI:** a **Pack detail: collect1** page with a three-phase gate timeline (before / during / after the call) and layer letter chips (C/T/D/S). Label it "Spec sketch — citations need counsel". It is also the reference design for any **voice/channel** write in the Write path inspector: rung 3 gates grouped by call phase. Out of scope for the first console build beyond a catalogue card.

### Figure 21 — Cross-organisation verification
**Status:** L3 — SPECIFIED, NOT BUILT.
**Organisation A, issuer (elan1 tenant at L3):**
1. Source write commits: nine rungs; record signed; anchor batch closed, or issued unanchored with the receipt saying so.
2. receipt.issue gates: its own declared write type (counterparty, consent for personal fields, residency, precondition); GATE.COUNTERPARTY_UNKNOWN / GATE.COUNTERPARTY_SANCTIONED.
3. Assemble the receipt: sixteen fields, digest, Ed25519 signature, key_id, inclusion path + audience (receiver org_id), nonce (128 bits), expires_at + chosen disclosures (E23).
4. Record the issuance in A's own chain; F14 commits to the receipt digest and audience; metered at quantity 1.
- Chain A: "Receipt issued — record 41,288, audience ar-org:acmetextiles.example, expires in 7 days".

**Centre:**
- **Key discovery, first success wins:**
  1. out-of-band pinned fingerprint (highest trust; ships in Phase 4)
  2. /.well-known/action-receipt-keys (domain control at fetch; ships)
  3. trust-anchor attestation (specified, not operated by elan1)
  4. in-receipt hint (lookup only, never a trust root)
  - org_id = ar-org:<domain> (DNS-anchored).
- **The Action Receipt (E25):** one record · one signature · one inclusion path · one issuer identity; envelope: audience · nonce · expires_at; optional selective disclosures. It never carries its own verification key. It is sent by email, API or portal upload, and elan1 runs no delivery network.
- **What must never happen:** a receipt carrying its own key · fallback to the in-receipt hint · a callback to the issuer on acceptance · a shared ledger or replicated records · elan1 operating a trust anchor · a degraded, best-effort verify mode · a seventeenth field.

**Organisation B, receiver:**
- **Flow 2, verify in this order:**
  1. Echo the claim.
  2. Audience = own org_id, checked before the signature (POLICY.RECEIPT_AUDIENCE_MISMATCH).
  3. expires_at; recorded_at and anchor precede now (POLICY.RECEIPT_EXPIRED).
  4. Resolve the key: route 1, else 2 or 3, never 4 (POLICY.TRUST_ANCHOR_UNKNOWN; no fallback).
  5. E12 preimage → SHA-256 → pure Ed25519 (POLICY.RECEIPT_UNVERIFIED).
  6. Inclusion path vs RFC 3161 token; absent → UNANCHORED, stated, and verification continues.
  7. Disclosures vs per-field commitments.
  8. Replay key (issuer, source_seq, digest) (GATE.RECEIPT_REPLAYED).
  - The verdict prints the discovery route used, the disclosed fields and the limits line.
- **Flow 3, bind (receipt.accept, nine rungs):** gates are counterparty, precondition (the verify result is a gate input), consent, residency, retention. cross_boundary → dual control (L0-S05) and a non-empty proof_binding (L0-S06); not configurable.
- Chain B: F14 commits to the issuer digest, org_id, key_id, route and disclosure list, bound at record 8,902 to issuer record 41,288.
- "Same event, two independent chains; nothing replicated, no callback."

**Learns panels:**
- Receiver learns (intended): F05–F08, F10, F11, F16, the actor as an opaque UUID, and only the disclosed payload fields.
- Learns, unavoidably: volume between receipts from seq ("41,288 in March, 58,100 in April ≈ 16,800 writes"), tenant linkability via F01, timing patterns. Unlinkability is not claimed, and the issuance screen says so.
- Never learns: undisclosed payload values, other counterparties, records, refusals or gate results, key material, or whether the receipt was accepted.
- Limits line on every verdict: "this establishes that the issuer's governed write path produced this record under these rules at this time; it does not establish that the underlying transaction occurred. elan1 does not adjudicate disputes between organisations."

**UI:**
- **Records → Receipts** (`#/records/receipts`), L3 only. Tabs: Issued / Received.
- **Issue receipt flow** (`#/records/receipts/issue?seq=`): choose audience org, disclosures and expiry. It shows the "What the receiver will learn / unavoidably learns / never learns" three-column panel. The issuance is a governed write.
- **Receipt verify screen** (`#/records/receipts/verify`): an eight-check ordered stepper with a typed refusal at the failing step and the discovery-route badge, then an "Accept (bind) — needs dual control" action.
- A **two-chains** visual: chain A and chain B side by side with a dotted "same event" link and "no callback" annotation.
- Pre-L3 tenants see a labelled preview only.

### Figure 22 — Selective disclosure: revealed versus committed
**Status:** L3 — SPECIFIED, NOT BUILT.
**Mechanism** (canonicalisation elan1_lp_sd_v1, salt_scope: per_field):
- record_salt: one secret per record; destroy it and every field is unopenable.
- field_salt(i) = HMAC-SHA256(record_salt, "elan1.sd.salt.v1" ‖ LP(field_name(i))), keyed by name not position; 32 octets.
- Illustrative fields fd_1…fd_n: amount (L, A) · tax_identifier (A) · counterparty (L) · credit_limit_satisfied · due_date · … The letter tags show which recipient receives each field.
- field_digest(i) = SHA-256(LP("elan1.sd.field.v1") ‖ LP(field_salt) ‖ LP(name) ‖ LP(value)).
- F14 = SHA-256(LP("elan1.sd.root.v1") ‖ LP(fd_1) ‖ … ‖ LP(fd_n)), in the order of proof_binding.fields[].
- Sixteen fields → preimage → SHA-256 → Ed25519 → anchor are all unchanged; F14 is still one 32-octet digest, and an E12 v6 verifier needs no change.

**Recipients:**
- **A, statutory auditor** (profile auditor-statutory): revealed fields are amount and tax_identifier.
- **L, lender** (a second profile from the same record): revealed fields are amount and counterparty.
- Each also gets all of F01–F16, every field digest, and one disclosures.jsonl line per revealed field (seq, name, value, salt, field_digest). There is no re-export and no second artefact.
- Predicate workaround: commit credit_limit_satisfied: true at rung 4.

**How a verifier checks (Flow 2, offline):**
1. Echo the claim, "3 of 11 committed fields disclosed".
2. Integrity checks unchanged.
3. Recompute each disclosed field_digest and find it at the declared position.
4. Recompute F14 from all n digests; an issuer cannot disclose a value that was never committed.
5. Profile checks on a withheld field report not_disclosed.
6. The report prints the profile, the revealed list and the withheld count.

**"Withheld is not missing, and missing is not altered":**

| Case | Exit |
|---|---|
| Required field disclosed and verifies | 0 PASS |
| Required field withheld | 2 FAIL_PROFILE |
| Disclosed digest mismatch | 1 FAIL_INTEGRITY |
| disclosures.jsonl referenced but absent | 3 INCOMPLETE |
| Salt destroyed under erasure | 0 PASS (payload unbound) |
| Field not required and withheld | 0 PASS |
| v1 verifier given a v2 bundle | 4 UNSUPPORTED |

Bundle format elan1.evidence.bundle.v2; disclosures.jsonl is the ninth member.

- **What can be disclosed:** proof_binding payload fields, each individually: yes. Fields outside proof_binding: no. F01–F16: always, in full. Gate results: as a set or not at all. A per-field salt: only for that field. The record salt: never. Key material: never. A predicate ("under limit"): not in Phase 4.
- **Limits:** hides values, not shape; low-entropy fields are guessable by trial; no predicate proofs; no unlinkability; elan1_lp_v1 records are never disclosable (the boundary is shown with counts); a disclosure is irrevocable; elan1 holds the salts unless the tenant holds its own keys and salt store.
- **Chosen and rejected:** SD-JWT construction chosen, with elan1 LP encoding. SD-JWT JSON container rejected. BBS+ rejected (it ends the zero-dependency verifier). Merkle-over-fields and ZK predicates rejected for Phase 4.

**UI:** the **Disclosure composer** inside Issue receipt and inside Evidence export (L3). It is a field grid for the record with a per-recipient column of toggles (Reveal / Withhold). F01–F16 are locked "always disclosed". Low-entropy fields carry an explicit warning that they are "guessable by trial". Show a live preview line, "3 of 11 committed fields disclosed", and an irrevocability confirm dialog.

### Figure 23 — Precedent and earned autonomy
**Status:** L3 — SPECIFIED, NOT BUILT.
**Autonomy ladder (rung 6):**

| Level | Meaning | How it is set |
|---|---|---|
| A5 Act broad | tenant scope; dual control on the declaration itself | ADR only |
| A4 Act bounded | alone inside a declared blast radius and budget | ADR only |
| A3 Act reversible | acts alone where a reversal plan exists | earned (L3, dashed) |
| A2 Propose | submits; a human approves before rung 7 | declared |
| A1 Draft | produces a write intent a human must submit | declared |
| A0 Observe | reads only; a missing grant resolves here | default |

The ladder has "earn" (A2 → A3) and "revoke" arrows. A4 and A5 do not graduate in Phase 4. Irreversible write types and tenant or cross_boundary blast radius are never graduated. Humans are granted, not graduated.

**Precedent per action class** (tenant_id, write_type, actor_kind, blast_radius), not per agent:

| Counter | Effect on score |
|---|---|
| submitted | floor and ceiling |
| approved_unamended ratio | raises (load-bearing) |
| declined | lowers steeply |
| approved_amended | lowers |
| reversed_in_window | lowers steeply |
| corrected_after_window | hard bar |
| sandbox_diverged | hard bar |
| refused_by_gate[code] | neutral |
| expired | neither way |
| days since last decline | raises slowly |

- Refusals are not failures; a score that penalised them would teach people to loosen gates.
- Window: rolling 180 days, with ≥ 90 days of history.
- score_v1(counters) → {value 0–100, inputs, version}; constants change only by version.
- The nightly job reads no payload or salt. Any reader may recompute and get the same numbers, or it is a P0. A continuity gap → not_measurable, no score. No model in the score; thresholds are unset.

**Eligibility, all eight checked:**
1. ≥ 90 days continuous chain history
2. ≥ 200 records, ≥ 100 of them approvals
3. approved_unamended ratio ≥ threshold
4. zero corrected / diverged (hard bar)
5. reversal plan drilled and dated (hard bar)
6. no declaration or policy change in 30 days
7. tenant not stopped; no open P0
8. score ≥ threshold, computed < 24 h ago

Any fail → POLICY.AUTONOMY_NOT_EARNED.

**Graduate A2 → A3 (Flow 2):**
- The owner proposes and writes the justification, never pre-filled by elan1.
- autonomy.graduate runs with dual_control true, blast_radius tenant, all nine rungs. Proposer approving → GATE.DUAL_CONTROL_SAME_ACTOR.
- The second approver sees numbers and no advice.
- Effective at the next write, never retroactive.
- Supervised for 30 days: 1 in 10 writes is routed to a human, chosen by the record's own digest. Then recompute; below maintenance → back to A2.

**Revocation (Flow 3), one person, one press:**
- Effective at the next write; in-flight writes finish under their rung-6 resolution. It cannot be refused, delayed or appealed.
- If the grant store is down, rung 6 treats the class as A2 (fails closed).
- Re-propose only after a fresh 30-day window; revoked twice → an ADR first.
- Automatic, mandatory triggers:
  - any corrected_after_window
  - any GATE.SANDBOX_DIVERGED
  - reversed_in_window above the maintenance rate
  - a declaration or policy_version change affecting the class
  - tenant stopped
  - 90 days with no recomputation possible
  - 180-day review missed ("silence never renews")

**Audit trail:**
- At what level did it act? F11.
- Who let it? The graduation record: two named humans, the justification verbatim, its own seq.
- On what evidence? Counters, score, function version and seq range, recomputable from a bundle.
- Taken back? Revocation records.
- Customer grant: A0 → A1 → A2 in the tenant's own declaration (grants[]).
- "No API, support tool, tier, contract or sale sets a level."

**Three rules:** nothing crosses a tenant boundary · no model in the score, eligibility or grant · autonomy is earned and always revocable.

**UI:**
- **Agents → Agent detail → Autonomy** (`#/agents/:agentId/autonomy`) and **Agents → Autonomy** overview (`#/agents/autonomy`): a vertical A0–A5 ladder per (write type × actor_kind) class showing the current level, how it was set (default / declared / earned / ADR), and the grant record seq.
- At L3: a precedent counters table, a score with its function version and "Recompute" action, the eight-condition eligibility checklist, a "Propose graduation" flow (justification textarea, empty by rule) routed to Decide under dual control, a supervised-period progress bar ("Day 12 of 30 · 1 in 10 writes to a person"), and a prominent **Revoke** button: one press, no confirm-to-refuse, with a plain confirmation that it takes effect at the next write.
- On L1/L2 only the declared ladder shows, with A3 marked "Earned autonomy — Level 3, not built".

### Figure 24 — Action Receipt standard, certification and regulators
**Status:** PHASE 4 — SPECIFIED, NOT BUILT.
- **Given away, permanently:** specification text (CC BY 4.0), the reference verifier (Apache-2.0, never priced), test vectors and the tampered bundle (CC0), the verification procedure and suite registry, errata. The name "elan1" and its marks are not licensed.
- **Kept and sold:** the kernel (gates as data, forced approval, the single writer), packs and certified profiles, metered governed actions and levels, residency/custody/anchoring/retention and the evidence SKU, cross-org verification seats.
- "Why publishing is safe: a receipt attests only a call that was made. The single writer makes a missing receipt itself evidence."
- **Receipt members (format action-receipt/1):**

| Member | Contents | Conformance level |
|---|---|---|
| format · seal_suite | action-receipt/1 · elan1-seal-v6 | all |
| sealed_fields · digest | F01–F16, SHA-256 | all |
| signature · key_id | pure Ed25519; an identifier, never a key | CL-2 |
| anchor | rfc3161-6962 | CL-3 |
| audience · nonce · expires_at | envelope | CL-4 |
| disclosure_suite · disclosures | elan1-sd-v1 | CL-D |
| issuer · limits | ar-org:<domain>; limits verbatim | all |

- **Conformance levels:** CL-1 Structural · CL-2 Attested · CL-3 Anchored · CL-4 Addressed · CL-D. The mapping: elan1 L1 → CL-1 only; L2 → CL-2 + CL-3; L3 → CL-2 + 3 + 4 (+ CL-D).
- **Governance of the standard:** Draft + change log → 60-day comment → two implementations → Publish (governed write, dual control, release key) → Transfer (3 implementations, ≥ 2 non-elan1 orgs → 12 months). Refused: an unanswered comment, only elan1's own implementation, or approval by the editor. Defects are acknowledged within 5 working days. The destination body (IETF, W3C/OASIS, foundation) is not chosen.
- **Landscape:** SCITT RFC 9943 (30 Jun 2026), COSE Receipts RFC 9942, SD-JWT RFC 9901, draft-marques-asqav-compliance-receipts-08.
- **Certification and regulator timeline:**
  - elan1 plan (modelled): Sep 2026, no certification of any kind; Q2 CY2027 L1 Guarded GA; Q1 2028 three quotes per standard; Apr 2028 L2 Attested GA; Q4 2028 Gate 3 (outside auditor accepts L2?); Oct 2029 L3 Proven entry.
  - External (published): 20 Jun 2025 SEBI AI/ML consultation; 13 Aug 2025 RBI FREE-AI report; 30 Jun 2026 SCITT RFC 9943; 2 Aug 2026 EU AI Act Art. 50; 13 May 2027 DPDP main obligations; 2 Dec 2027 EU high-risk standalone; 2 Aug 2028 EU high-risk products.
- **Certification rule:** certify to the standard the first paying evidence customer's auditor names. India/EU AI governance → ISO/IEC 42001; US security → SOC 2 Type I then Type II. Budget ₹0.66 cr FY28 … ₹2.38 cr FY31 (modelled).
- **Regulator engagement:** the claim is three sentences, each mapped to an exit code, artefact or document. Only the founder (with the elan1 lead) speaks to a regulator.

**UI:**
- A **public/doc page** "Action Receipt" (`#/developers/action-receipt`): the given-away / kept columns, the members table with CL badges, and a conformance-level ↔ Assurance-level mapping chip row (reusable on the Assurance door as "Your level produces CL-1 receipts").
- The dated timeline is a Reference component (`#/reference/timeline`) with two lanes: elan1 plan (filled dots, labelled modelled) and external dates (square markers).

### Figure 25 — The assurance ladder and the upgrade path
**Status:** L1 BEING BUILT · L2, L3 SPECIFIED, NOT BUILT. "A level is a property of the proof and the claim, never of the policy: one declaration, three levels. L1 → L2 by runbook (E19); L2 → L3 on an event."

| | L1 Guarded (teal) | L2 Attested (teal dashed) | L3 Proven (purple dashed) |
|---|---|---|---|
| Status | BUILDING · Phase 1 · GA target Q2 CY2027 | FROZEN SPEC · Phase 3 · GA target Apr 2028 | FROZEN SPEC · Phase 4 · entry event-gated |
| What runs / adds | nine rungs, six gates never skippable · evaluate() no model · A0–A5 (missing → A0) · human approval, dual control at G4 · sandbox + 30-day rollback · SHA-256 chain of every write, refusal and escalation · 16-field layout frozen, unsigned · meter refusals at 0 (DB CHECK) | adds at rung 8 and after: Ed25519 over the digest · key custody per residency domain (KMS) · Merkle root → RFC 3161 from two TSAs ≤ 15 min · eight-member bundle · offline verifier (free, zero-dep) · verifier profiles executing · unanchored head shown on the Assurance door | six capabilities + the standard: cross-org verification (E22) · selective disclosure (E23) · customer-held keys · sovereign deployment · precedent intelligence · earned autonomy A2 → A3 · Action Receipt open standard (E25) · second independent seal implementation · non-elan1 counter-signature |
| May say | "checked against versioned rules before it happened; a person approved; tamper-evident to you, the chain holder" | "a party with our key fingerprint, got out of band, can verify this bundle on an air-gapped machine with no elan1 process" | "the format is open; a receipt stays checkable after we are gone" |
| May not say | signed · tamper-proof · immutable · independently verifiable · court-ready | accepted by MCA / RBI / SEBI · court-ready · immutable · verifies your books | tamper-proof · regulator-approved · transaction genuine · "standardised" |
| Buyer | operations / finance owner: "can I let this run?" | the auditor's counterparty: "can I hand this over?" | the market: "does this survive the vendor?" |
| Gate | E01 done-list 1–10 (1–7 hard: rung-skip suite, import-graph, nightly reconciliation, register lint, CHECK), E09 rows 1–8 | DONE (E14, 12 measurements): 64 vectors octet-identical in two impls; 28 negatives refused; key + successor; anchor SLO met for a month; two TSAs contracted; certified profile… | entry is an event: an outside auditor accepts an L2 bundle (ran the verifier, relied on it, says what PASS does not establish, would ask again); planned Oct 2029 |
| Plan list price | ₹1,80,000 / tenant / yr | ₹6,00,000 / tenant / yr | ₹24,00,000 / tenant / yr |

**L1 → L2 upgrade runbook (E19): no re-declaration, no migration, no write freeze.**

Seven preconditions, verified by replay and measurement, never asserted:
1. preimage unchanged since the first record
2. key custody in-domain, with a registered successor
3. anchor interval SLO measured for a month
4. offline verifier passes the vectors and refuses the tampered bundle
5. a certified profile for a regime the tenant is in
6. whole-history continuity
7. proof_binding covers regime fields

Stages:
- 0 Pre-flight: replay the whole chain ("continuous, 41,206 records"); record head seq.
- 1 Key: bind the domain key with signing still off; fingerprint sent out of band first.
- 2 Signing on: governed write, dual_control: true; the next record is seq B. **IRREVERSIBLE**.
- 3 Anchoring on: first batch stamped by both TSAs; the unanchored head falls to zero.
- 4 Profile: block 6 addition only (new declaration version); certified profile; dry export.
- 5 First bundle: the tenant exports and verifies offline (exit 0 PASS); the tampered bundle exits 1.
- Close: Flow 3, a closing record in the chain.

Boundary: seq 1…B−1 (e.g. 1–41,206) is Level 1 forever and unsigned; seq B… (41,207 →) carries signature + key_id; prev_digest links across B; never back-signed. Rollback: stages 0, 1, 3 and 4 are fully reversible; after stage 2 signing can stop, but signed records stay signed (a "signed island").

**Legend:** L1 (being built) · L2 (spec) · L3 (spec) · dual-control human step (amber) · tenant action · banned claims (pink).

**UI:** this is the core of the **Assurance door landing** (`#/assurance`).
- A three-column ladder with the tenant's current level highlighted and the top-bar level pill linked to it.
- May say / may not say rendered as a "What you can claim" card. This is a strong value-add, because it gives sales and compliance the approved sentences.
- **Assurance → Upgrade to L2** (`#/assurance/upgrade`): the runbook as a seven-stage stepper with precondition checks (each shows the measured evidence, not a tick), stage 2 flagged "Irreversible — needs a second named person at Decide", and a chain boundary visual (the seq B marker on the chain strip).
- The pricing row appears only in the public/pricing layout, labelled "plan list price (modelled)".

### Figure 26 — Runtime and deployment topology
**Status:** L1 BEING BUILT · TARGETS, NOT MEASURED.
- **Top row:**
  - rung1 Enterprise (Mode A, SDK in-process, Enforced; hosted mode: the kernel holds the credential) → in-process.
  - stack1 tools and third parties (Mode B, MCP/HTTPS, attested advisory; the caller holds the credential; Phase 2 on) → MCP via fusion-edge.
  - Approvers and operators: the console (Assurance door); step-up; the approval returns as a durable signal.
- **elan1 kernel services** (repo elan1-core; a consumer of stack1, never imported into it):
  - KernelPort (SDK + MCP server)
  - Right Path runtime (rungs 0b–9, fixed order, fails closed)
  - Declaration registry (versions never expire; no "latest")
  - Gate engine and evaluate() (no model reachable)
  - Approval service + console (obligations, dual control, expiry)
  - Single writer + credential broker (per-call credential, 10-min life)
  - Proof chain writer (SHA-256 chain; Ed25519 seal at L2)
  - Meter (one event per action; refusals at 0)
  - Anchor service (L2; Merkle root → two TSAs, ≤ 15 min)
  - Postgres record store (schema per tenant, RLS, restricted role)
  - KMS signing key (L2; one per residency domain; handle only)
  - WORM object store, India (proof 7 yrs · bundles 24 months (L2))
- **stack1 runtime, profile P4 "elan1 Layer Host"** (five Phase 1 contracts): fusion.gateway/v1 = C2 LiteLLM · trace/v1 = C6 Langfuse core · tools/v1 = C7 ContextForge · run/v1 = C8 Temporal · guard/v1 = C10 Presidio, NeMo.
  - stack1's own, not substitutable: fusion-edge ingress (mTLS, signed tenancy assertion, attribution triple) · secrets (OpenBao path per tenant) · metering plumbing (same-transaction outbox) · deploy pipeline (inverse.json).
  - Per tenant: namespace default-deny · Postgres schema + RLS · object prefix · Temporal namespace (run/v1 carries approval waits as signals) · one worker node · serving quota. Target 99.5% monthly per contract.
  - Postgres primary + synchronous standby in a 2nd AZ · Object Lock · logs 180 days in India · NTP to NPL/NIC.
  - Band: "AP-SOUTH-1 MUMBAI · 3 AZ · RESIDENCY DOMAIN 'in' · SOLE REGION".
- **Right column:**
  - Systems of record (ERPNext site written only by the single writer at rung 7; Mode B: the caller writes).
  - Timestamp authorities (L2; only a Merkle root leaves the region).
  - Other regions not opened: R2 Gulf and R3 EU open only on a signed order and a dated counsel reading (S17). No cross-region failover at any tier; proof records never cross a boundary.
  - Targets, "MEASURE THIS": governed write p50 ≤ 120 ms, p99 ≤ 450 ms; proof write p50 ≤ 40 ms; Mode B p95 ≤ 40 ms; meter lag p99 ≤ 30 s.
  - Fail closed in both directions: a stack1 outage stops writes; a kernel outage stops allows.
- **Hosting profiles** (one axis: who holds the signing key, and who operates the plane):
  1. Hosted multi-tenant: shared domain "in"; one signing key per domain at L2. Phase 1 internal; L1 GA Q2 CY2027.
  2. Dedicated residency domain: Enterprise tier; a key no other tenant uses; cloud-custody insider limit disclosed.
  3. Customer-held keys: the customer's HSM signs; L3; only with a contract; liability on key loss open (Q2 2028).
  4. Sovereign / on-premises: operated by the customer or government; not sold before a defect-propagation process exists; plan Jul 2029, ₹1.20 cr/yr.
- **Environments (no fifth, no personal environment on prod):** dev (synthetic only) · ci (pipeline; conformance) · stage (restored clone; no live data) · prod (live; Tue/Thu window) · plus the **sandbox tenant** (sk_sbx_ key, metered at 0) and the **production key** (after a human review).

**UI:**
- **Assurance → Runtime health** (`#/assurance/runtime`): a topology diagram with a live status per kernel service (text label + status token), five stack1 contract tiles (contract name, component, availability vs 99.5% target), a region band, and the target-vs-measured SLO table.
- A **Hosting profile** card on the tenant's Assurance landing ("Your deployment: Hosted multi-tenant · residency domain 'in' · signing key shared in domain (Level 2)").
- The top-bar **environment badge** uses the atlas environments. The tenant-facing ones are Sandbox (sk_sbx_, metered at 0) and Production; dev, ci and stage are internal only.

### Figure 27 — Security, residency and DPDP controls by layer
**Status:** L1 BEING BUILT · DESIGNED, NOT AUDITED. Columns: Layer · Owner | Threat | Control | Kind · Verified by.

| Layer (owner) | Threat | Control (summary) | Kind · verified by |
|---|---|---|---|
| Identity and tokens (elan1 · E05, O03) | caller asserts its own tenant or autonomy; no-tenant call; shared logins | three token classes; tenant/actor from the token, never an argument; unattributed call rejected; SSO + MFA for staff | PHYSICAL + POLICY · ctl paths have no read path; no token can set its own rung 6 |
| Credential broker (elan1 · O05 §3) | long-lived key leaks; agent writes around the kernel | per-tenant broker; per-call credential scoped to one write, 10-min life; one mutating process per tenant; break-glass sealed, alerts within 1 min; Mode B = attested advisory | PHYSICAL · a 2nd write credential fails CI; bypass attempt shown failing |
| Tenant isolation (stack1 + O05 §2) | A reads, lists or counts B's rows, spans, files, caches | tenant_id NOT NULL, RLS everywhere, per-tenant schema/namespace/prefix/OpenBao/Temporal; caches partitioned. Admitted: no hardware isolation; one L2 key per domain | PHYSICAL · CI cross-tenant test; K2 attacks nightly |
| Encryption and keys (elan1 · E16) | key theft, forged seal, insider signs; data in clear | TLS/mTLS; encrypted backups; L2 KMS Ed25519 with a single-principal Sign; key register ACTIVE/RETIRED/REVOKED; offline release key | PHYSICAL · nightly KMS Sign ↔ records (L2); rotation 90 d vs 12 mo (conflict) |
| Supply chain, licences (group · O04) | upstream relicensing (AGPL, SSPL, BSL); tampered component | pin by commit SHA; LICENSE archived; permissive only inside the paid service; copyleft only as a separate service; ee/ and enterprise/ excluded; counsel review quarterly | POLICY (CI) · K7 nightly LICENSE byte diff (P1); no signed provenance yet |
| Residency (group · O05 §1) | data, logs or keys leave India | ap-south-1, 3 AZ; no 2nd region incl. DR; sub-processor list with regions; at L2 only a Merkle root reaches a TSA | POLICY (CI) · build fails outside the region allow-list |
| DPDP (group · O05 §7) | processing without consent; erasure impossible in an append-only chain | Data Processor / Fiduciary; DPA before the first real record; consent ledger; **erasure is a governed write, irreversible, dual control, 72 h: the subject's salt is destroyed, the chain stays intact** | POLICY · erasure tested end to end on the fixture tenant; counsel question open |
| Logging, CERT-In (group · O05 §5) | incident missed or late; logs outside India | 180-day logs in India; Object Lock; NPL/NIC clocks; no PII; every refusal logged; 6 h CERT-In filing; tenant update 72 h; postmortem 5 working days | POLICY · six-hour path tested once before the first outside user |

- **Governing rule, fail closed:** "A control that degrades to 'allow' is not a control."
- **Minimum bar before any outside user logs in:** 13 rows (O05 §12), all required.

**UI:**
- **Assurance → Controls** (`#/assurance/controls`): a threat → control → verification table, filterable by layer and kind (Physical / Policy CI-enforced / Policy). Each row carries its latest evidence (CI run, nightly job result, date) and a three-valued status (passed / failed / not measurable).
- A "Minimum bar (13 rows)" readiness checklist.
- Source conflicts shown inline.
- A **DPDP erasure** request flow (`#/records/erasure/new`): a governed write, irreversible, dual control and a 72 h SLA, with copy that explains that the chain stays intact and the payload becomes unbound.

### Figure 28 — Metering pipeline: rung 9 to the invoice
**Status:** DESIGNED — PRICES MODELLED, NOT QUOTED.
- **Pipeline:**
  1. Governed action (assert runs rungs 0b–7; outcome committed, refused or escalated)
  2. Rung 8 PROOF (record at seq n; a refusal is sealed too, with a zero UUID)
  3. Rung 9 METERED (exactly one event; basis from the declared blast radius; 2 ms target)
  4. Meter ledger (INSERT-only; CHECK refused ⇒ quantity = 0)
  5. meter.reconcile() (nightly, two-way, against the proof log and the target system)
  6. Rate and invoice (reconciled period only; monthly; overage in arrears)
  - A dashed return reads "refused: full record, meter row quantity 0 — never a 4xx, never retried".
- **Meter event fields:**

| Field | Type | Note |
|---|---|---|
| event_id | uuid | kernel-assigned |
| write_id | uuid | always present |
| seq | uint64 | |
| basis | enum | from blast radius |
| quantity | uint32 | 1 committed · 0 refused |
| outcome | enum | committed · refused · escalated |
| at | RFC 3339 | platform clock |

  "An invoice line with no write_id cannot exist: the schema has no such row."
- **Basis:** one_record → per record; one_counterparty → per counterparty; batch → per batch; tenant → per tenant; cross_boundary → per crossing. Never configurable per customer; never discounted. CHECK (outcome <> 'refused' OR quantity = 0).
- **Two-way reconciliation:**
  - Every committed write has one record, every record one write, every meter event references an existing write, and every refusal carries quantity 0. Any discrepancy stops the invoice and pages.
  - Kernel meter vs credit ledger: zero tolerance, and the kernel wins (P2 against the ledger).
  - Runtime meter vs component counters: 0.5% tolerance. If unresolved at invoice time, bill the lower number and carry the gap as a named item.
- **Invoice (illustrative):**

| Line | Amount |
|---|---|
| Platform floor | L1 ₹1,80,000 per tenant per year, not discountable |
| Governed actions in allowance | 4,80,000 a year at L1 |
| Beyond allowance | × ₹1.60 (plan rate) |
| **Refused 412** | ₹0; the count is shown on the invoice, not in a portal |
| Pack line (ledger1…) | ₹1,35,000 per tenant per year, blended |
| Evidence line (L2 onward) | verifier profile per regime per year; bundle export free within allowance; verifier ₹0 |

  "Show the records behind this line" opens every event by write_id and seq. A disputed line is held and settled against the proof record.
- **Related-party billing:** elan1 → rung1 at ₹0.40 per committed action; stack1 → elan1 at six runtime units, cost + 15%.
- **Three meters, one number each:**
  - Kernel meter (elan1, rung 9): normative.
  - Runtime meter (stack1): token, GPU, byte, page and tool units + attribution triple.
  - Credit ledger (rung1): a rendering, not a source; when it disagrees, that is a defect.
- **Rules that travel with the price:** no discount on the floor, basis, refusal price or L2 evidence line; no per-seat or outcome price. The refusal rate is published beside cost per governed action every month, "so a falling cost cannot hide a loosened gate".

**UI:**
- **Records → Usage and invoices** (`#/records/usage`, `#/records/invoices/:period`): the six-stage pipeline as a header strip with counts for the period (actions, committed, refused at ₹0, escalated at ₹0), the reconciliation status (a three-valued badge; a discrepancy blocks the invoice with a serious-status banner), and invoice lines each with **"Show the records behind this line"** linking to a filtered proof list.
- Add a **refusal-rate beside cost-per-action** chart (the transparency rule).
- An internal related-party statement is out of the tenant scope.

### Figure 29 — Technology stack by layer
**Status:** MOSTLY RECOMMENDATIONS · ADR BEFORE EACH WAVE.

| Layer | Chosen | Alternatives | Rejected | Status |
|---|---|---|---|---|
| Kernel language | Python 3.12 · FastAPI · uv; OpenAPI 3.1 | Go · Kotlin/Java 21 · TypeScript | — | RECOMMENDED (revisit if p50 misses) |
| Seal A and B | A: Python + pyca/cryptography; B: TypeScript + node:crypto (separate team) | PyNaCl · Rust ed25519-dalek · Java 21 EdDSA | one shared library | RULE FIXED (E12); langs REC |
| Offline verifier | Go, stdlib only; empty lockfile | TypeScript on Node, no npm deps | Python, Rust, C/C++ | ZERO-DEP FIXED |
| Database | PostgreSQL 16+: grants, FORCE RLS, CHECK, INSERT-only evidence | Cloud SQL/AlloyDB · Azure PG · Patroni | QLDB · any blockchain · Supabase prod | FIXED |
| Outbox and queue | Postgres outbox, FOR UPDATE SKIP LOCKED | Debezium CDC · LISTEN/NOTIFY | Kafka, Redpanda, NATS | LOAD-BEARING |
| Durable workflow | Temporal behind fusion.run/v1 | Prefect · Dagster | Windmill · n8n · Inngest | FIXED |
| Policy engine | own rules-as-data evaluator | Cedar · CEL · OPA/Rego | any model in the allow | RECOMMENDED, ADR at W3 |
| Key custody (L2) | AWS KMS Ed25519, Origin KMS | GCP KMS HSM · CloudHSM · Thales · Entrust (L3) | OpenBao/Vault transit | NAMED |
| Timestamp (L2) | eMudhra + one global TSA | global partner TBC | FreeTSA | OPEN to 31 May 2027 |
| MCP surface | official MCP SDK; stateless 2026-07-28 revision; descriptions hash-pinned | hand-rolled JSON-RPC | — | RECOMMENDED |
| Console front end | React 18 · Vite · TS · Tailwind; screens compiled from declarations | Svelte · Vue · Radix | hand-written screen files under app-* | IN REPO |
| Secrets, identity | OpenBao per tenant; Keycloak realm per tenant; mTLS | AWS SM · Doppler | HashiCorp Vault (BUSL) | VIA STACK1 |
| Observability | OTel per rung → trace/v1; Grafana · Sentry · healthchecks.io | Datadog · Honeycomb · Opik/MLflow | vendor agents | REC · paging vendor OPEN |
| CI/CD | GitHub Actions + merge queue; Claude Code harness; cosign + SLSA; import-linter/depguard; CodeQL | GitLab · Buildkite · Snyk · Renovate | pinning by tag; ee/ in builds | IN REPO |
| Hosting and IaC | stack1 managed K8s in ap-south-1; Terraform/OpenTofu; Argo CD | ECS Fargate · Pulumi · GCP asia-south1 | multi-cloud · 2nd region | OPEN (OD-28) |
| Evidence store | Object Lock WORM in India (S3 or SeaweedFS/Ceph/Garage) | GCS Bucket Lock · Azure immutable | MinIO (AGPL) | OPEN |

Legend: elan1 choice (teal) · inherited via stack1 contract (purple) · external vendor (grey) · rejected (pink).

**UI:** a Reference page, **Technology stack** (`#/reference/stack`), as a sortable table with status chips (Fixed / Recommended / Open / Named / Via stack1). It is not a tenant screen. The status chip vocabulary is reusable (see Part 5).

### Figure 30 — Build roadmap, October 2026 to March 2031
**Status:** PLAN — TARGETS, NOT MEASURED. A Gantt chart from H2 '26 to Q1 '31.
- **Product and gates:**
  - L1 Guarded: L1 build → L1 GA → operated. Record shape frozen 30 Nov '26; first real governed write 31 Dec '26; meter reconciles 31 Jan '27; GA 30 Jun '27.
  - Design partners and tenants: ten in production 30 Jun '27; R3 third party on KernelPort 30 Jun '27; first paying tenant 31 Jul '27 → 84 tenants Sep '28 → 186 Jun '29 → 545 Mar '31 (modelled).
  - L2 Attested: key custody 31 Aug '27; signing live 30 Sep '27; TSA contracts 31 Oct '27; anchoring + verifier 31 Dec '27; Gate 1 31 Jan '28; L2 GA 30 Apr '28.
  - Packs: ledger1 live 31 Oct '27 (90-day pilot, verdict 31 Jan '28); invoice1 30 Apr '28; collect1 31 Oct '28.
  - Evidence SKU and L3: Gate 3 31 Dec '28; Action Receipt v1 by Jun '29; L3 entry 31 Oct '29.
  - Certification and sovereign: standard named 31 Mar '29; certificate 31 Mar '30; first sovereign Jul '29.
- **Capital:** ₹180 cr Series A in three tranches: bridge ₹8.0 cr; T1 ₹63.0 cr (close 31 Mar '27); Gate 2 31 Mar '28; T2 ₹72.0 cr at Gate A Oct '28; T3 ₹45.0 cr at Gate B Jul '29. EBITDA positive Jul 2030 (modelled).
- **Teams:** kernel · evidence · pack · stack1 · rung1.
- **Headcount:** 11 → 27 → 95 → 170 → 243 → 305.
- **Critical path:** seal A = seal B on 64 vectors (30 Sep '27) → key custody → TSA contract → batched anchor job → verifier + vectors → first evidence pack → Gate 1 (31 Jan '28).

**UI:** a Reference / investor page only (`#/reference/roadmap`): a Gantt with a "today" line (24 Sep 2026), every bar labelled "target". **Never** put roadmap dates in the tenant console except the level "coming" note on L2/L3 previews ("Level 2 — GA target April 2028").

### Figure 31 — CI pipeline and quality gates
**Status:** DESIGNED — PIPELINE NOT YET RUNNING. Eight stages, "none can be skipped with a flag":
1. **Pre-commit** (every commit): ruff · black · mypy · tsc · gofmt; imports-check (nothing above P3 imports a kernel type); screens-check (no screen files under app-*); verify-zero-deps; secret scan.
2. **Required PR checks:** unit and property tests (pytest + Hypothesis, go fuzz, Vitest); import graph (no model client from rungs 3–8); no-domain-nouns wordlist; RLS migration check and cross-tenant read; region allow-list; one write credential; PII log lint; CodeQL · Semgrep · gitleaks.
3. **Seal and vector gate** (every push): seal A = seal B on 64 vectors; TV-001 is exactly 329 octets; 36 positives PASS, 28 negatives REJECT; reproducible verifier build.
4. **KernelPort conformance** (every consumer's CI): C1 import graph · C2 bypass attempt · C3 all nine rungs over 100 intents · C4 determinism replay · C5 fail-closed matrix · C6 missing grant → A0 (1,000 fuzzed) · C7 idempotency · C8 refusal (HTTP 200, qty 0) · C9 chain integrity (10,000 records) · C10 meter reconciliation · C11 approval separation · C12 rollback drill (both paths) · C13 version pinning · C14 claim boundary.
5. **Pre-merge:** grants-check on the live catalogue; append-only (no UPDATE/DELETE on evidence, registry, meter); licence register (SHA pin; ee/ excluded; BLOCKED cannot be inserted).
6. **Pre-release** (amber, human): nine-step seal protocol; EV1–EV7 green; cosign + SLSA; declarations reviewed by a critic, then a named human certifies.
7. **Deploy** (purple, stack1): Promoter + rollback/inverse.json; grants check → golden write → traffic; /ready probe; status page flips on a missed nightly integrity job; change window Tue/Thu 21–23 IST.
8. **Nightly:** EV1 seal conformance · EV2 chain integrity (4,096 seals) · EV3 refusal replay · EV4 zero screen files · EV5 offline verify ≤ 5 s · EV6 invariant sweep · EV7 autonomy; write ↔ seal join = 0; meter reconciliation; K2 isolation attack; K7 LICENSE diff; "every eval proven able to fail".

- "No flag skips a gate … there is no --force."
- Go / no-go sign-off: pipeline owner, verifier engineer, implementers A and B, second reader, security reviewer, SRE on-call, founder.

**UI:**
- **Assurance → Controls → Conformance** tab: C1–C14 as a matrix of latest result per consumer (rung1, each third party) with date. This is the tenant-visible proof that its integration is conformant.
- **Developer → Conformance suite** (`#/developers/conformance`): the list of C1–C14 with how to run them.
- The full eight-stage pipeline is an internal Reference page (`#/reference/ci`).

### Figure 32 — Operations: SLOs, failure behaviour and incidents
**Status:** DESIGNED — SLOs ARE TARGETS. "Evidence integrity pages; latency does not."

**Nine SLOs:**

| SLO | Target | Label |
|---|---|---|
| Governed write p50 | ≤ 120 ms | MEASURE THIS |
| Governed write p99 | ≤ 450 ms | MEASURE THIS |
| Seal (rung 8) p50 | ≤ 40 ms | MEASURE THIS |
| Outbox → seal lag p99 | ≤ 2 s | estimate |
| Anchor interval (L2) | ≤ 15 min | published SLO |
| Bundle build, 10k seals | ≤ 60 s | estimate |
| Offline verify, 10k seals | ≤ 5 s | estimate |
| Writes without a seal | 0 | invariant |
| Records mutated outside | 0 | invariant |

Also: stack1 99.5% a month; meter lag p99 ≤ 30 s. "None is quoted to a customer until measured under load."

- **Observability and paging:**
  - An OTel span per rung.
  - A status page per component: submission, gates, writer, chain, meter, console. A missed nightly integrity job flips "chain" by itself.
  - PAGES: outbox → seal lag over SLO · any non-zero invariant · TSA down for two intervals · platform-class refusals above baseline · an eval failure.
  - TICKETS: write latency · bundle build · Studio · connectors. One rotation, two people.
- **Kernel unreachable, fail closed:**
  - Consumer side: no degraded mode, no cached allow, no local gate. Runs are parked durably with the same idempotency key, SEAL_PENDING first. User copy: **"We cannot check this change right now. Nothing was changed."**
  - Inside the kernel:
    - registry down → refuse at the write door
    - policy down → refuse at rung 4 and page
    - target down → refuse after sandbox
    - chain append fails → outbox retries, no gap
    - KMS down (L2) → the domain refuses, no stale key
    - TSA down (L2) → writes go on, single_anchor
- **Incident classes:**

| Incident | Detected by | Runbook and first actions | Severity |
|---|---|---|---|
| Proof-chain gap | nightly write ↔ seal join; CHAIN_HEAD_CONFLICT | RB3: never backfill a seal; write a sealed gap record; two writers stop the tenant | P0 |
| Seal worker behind | lag p99 > 2 s | RB1: stopping intake is the default | page |
| Meter / proof mismatch | nightly reconciliation (C10) | invoice stopped; the kernel count wins; disputed line held | P2 → page |
| Key compromise (L2) | unaccounted Sign; exposed credential | RB6: T_suspect; stop signing, keep writing at L1; revoke; tenants told within 24 h | P0 |
| TSA outage (L2) | token timeout or malformed token | RB2: single_anchor; page at 2 intervals, banner at 4; oldest first | degraded |
| Declaration mis-publish | certifier or tenant report | RB10 revoke version; RB7 stop tenant; loosening needs a new version + ADR | not stated |
| Isolation breach | K2 attack; RLS test; customer report | Flow A: tenant stop at 0b; revoke; CERT-In; DPDP | P0 |
| Bundle fails at customer (L2) | customer or auditor report | RB9: reproduce air-gapped with the signed verifier; disclose defects to all | P0 if real |

- **Severity and notification:** P0 response 15 min 24×7, contained in 2 h. CERT-In: the named responder files within 6 h ("if unclear, file"). Tenant update within 72 h. Written note for P0/P1 within 5 working days.
- **Backup and DR:** PITR; nightly encrypted backups kept 30 days; quarterly restore drill that re-verifies the evidence store; no cross-region failover (a region loss is a restore in place); **RPO/RTO not yet set (open, due 15 Oct 2026)**.

**UI:**
- **Assurance → Runtime health** includes the SLO table (target vs measured vs label) and a component status list matching the atlas component names.
- **Assurance → Incidents** (`#/assurance/incidents`): an incident list with class, severity (P0/P1/P2/degraded mapped to status tokens), detected-by, runbook link, and the notification clocks (6 h CERT-In, 72 h tenant update, 5-day note) as countdowns.
- The **fail-closed copy** ("We cannot check this change right now. Nothing was changed.") is canonical for any consumer-facing error state when the kernel is unreachable.

---

## Part 2 — Component catalogue (tooltip copy)

Each entry gives the name, zone and a one-line tooltip. The zone key is Kernel (P3) · Declaration (P4) · Surface (P5/P6) · Store · L2 · L3 · stack1 (P1) · External · Consumer · People.

### 2.1 Kernel (plane P3, repo elan1-core)
- **KernelPort v1**: the one contract every consumer calls: define, assert, seal, verify, scope, refuse. The tenant comes from the token.
- **Right Path executor**: the one write function; runs the stop check and nine rungs in fixed order, idempotent on intent_id.
- **Stop set (rung 0b)**: the tenant kill switch, revocations, blacklist and regulator directives. The only refusal that writes no record.
- **Identity (rung 1)**: sets actor and actor kind from the token, never from the payload.
- **Write door (rung 2)**: resolves the declaration at an explicit version and checks that the write type is allowed on this channel.
- **Gate engine (rung 3)**: runs gates G1–G9 in declared order as pure functions; records a result row per gate.
- **Policy service / evaluate() (rung 4)**: versioned rules over declared fields; returns allow, refuse or escalate. No model, no record read.
- **Guardrail (rung 5)**: checks the write's real reach against its declared blast radius.
- **Autonomy (rung 6)**: checks the actor's A0–A5 grant; a missing grant is A0; too low means a person approves.
- **Single writer (rung 7)**: the only process holding a credential to the books; applies to a shadow sandbox first, then live.
- **Credential broker**: mints a single-use credential for one write, valid ten minutes.
- **Chain writer / proof (rung 8)**: appends the sixteen-field record to the tenant's hash chain in commit order.
- **Meter (rung 9)**: writes exactly one meter event per action; refusals and escalations count zero.
- **Approval service**: holds open obligations, their expiry and the human-only resolver set.
- **Refusal register**: the closed list of 43 typed refusal codes (28 active at L1), each tied to one rung and one operator action.
- **Snapshot / reversal plan**: the pre-apply snapshot kept 30 days so a committed write can be undone per its declared plan.
- **meter.reconcile()**: the nightly two-way check between meter events, proof records and the target system.
- **Nightly integrity job**: recomputes every tenant's whole chain; a break is a P0.

### 2.2 Gates (rung 3; numbering derived from the declared order and cross-references)
- G1 **consent**: lawful basis for the data in this write. Never skippable.
- G2 **residency**: the write stays within the declaration's residency domain. Never skippable.
- G3 **retention**: the record falls inside its retention window. Never skippable.
- G4 **dual_control**: a second named human is required where declared; the proposer can't approve. Never skippable.
- G5 **rate**: frequency limits. Can be disabled.
- G6 **budget**: value or spend limits. Can be disabled.
- G7 **counterparty**: the counterparty is known and not sanctioned. Never skippable.
- G8 **schedule**: time-window rules. Can be disabled.
- G9 **precondition**: a business precondition holds as of the write (e.g. credit limit). Never skippable.

(Designers: confirm the G-number mapping with engineering. The atlas states "six never skippable: G1–G4, G7, G9" and "enabled false only for rate, budget, schedule", and G2 = residency, G4 = dual control and G7 = counterparty are explicit. The order above is the only one consistent with all three.)

### 2.3 Declaration plane (P4)
- **Declaration**: one versioned JSON object in seven blocks that says what may be written, by whom, under which gates.
- **Blocks:** identity · shape · permissions · write_types · gates · proof_binding · channels.
- **Declaration registry**: keeps every declaration version verbatim forever; resolved by id and integer version, never "latest".
- **Studio**: where a declaration is authored, validated, simulated and certified by a named human.
- **Compiler**: turns a certified declaration into a content-addressed surface plan, write types and meter basis.
- **Lexicon**: the term set a declaration uses; its hash is sealed in F15.
- **Policy version**: the version of rung-4 rules that decided; sealed in F08.
- **Controls / Regulations** (Phase 4): regulation clauses and the controls that bind them to gates and proof fields.
- **Verifier profile**: the regime-specific checks the offline verifier runs, e.g. in-mca-audit-trail v1.

### 2.4 Surfaces (P5/P6)
- **SDK @elan1/kernel**: an in-process library for Mode A; the kernel holds the credential, so writes are enforced.
- **MCP server**: 34 tools (18 read, 10 stage, 6 act) for third-party agents; Mode B, attested advisory.
- **HTTP /v1**: act, ro and ctl families; ctl cannot read any record.
- **Webhooks**: HMAC-signed, at-least-once events: write.escalated, obligation.resolved, obligation.expired, write.committed, write.refused.
- **Console**: the Four Doors, compiled from declarations: Approvals, Decide, Not done, Record, Proof, Studio.
- **Channels**: web, mobile, messaging, api, mcp and voice; each is declared with its write types and mode.
- **Token classes**: tenant (reaches writes; ro · stage · act), control (Studio and registry, no records), ops (read-only, no tenant data).

### 2.5 Stores
- **Writes and gate results**: one row per write and one per gate, with the decision and policy version.
- **Obligations and approvals**: open escalations and their human resolutions.
- **Record version + outbox**: the committed change and its outbox row in one transaction.
- **Proof log**: the per-tenant hash chain; insert-only; one principal may insert, none may update.
- **Meter ledger**: insert-only meter events; a database CHECK forces refusals to quantity zero.
- **Snapshots and backups**: 30-day pre-apply snapshots, PITR and nightly encrypted backups in India.
- **Salt store (P0)**: per-record salts; destroying one unbinds the payload for erasure while digests hold.
- **Pack and profile registry**: pack definitions and verifier profiles, every version kept.
- **WORM object store**: Object Lock storage in India for evidence copies.

### 2.6 Level 2 (specified, not built)
- **Signer**: signs each record digest with Ed25519 at rung 8.
- **Domain signing key**: one KMS key per residency domain; only the chain writer may sign.
- **Anchor service / batcher**: builds a Merkle root per tenant batch and timestamps it at two authorities.
- **Anchor client key**: authenticates elan1 to the timestamp authorities.
- **Release key**: an offline hardware key, held by two people, that signs verifier releases.
- **Bundle exporter**: builds the eight-member evidence bundle; each export is a governed write.
- **Evidence bundle**: a self-contained set of records, chain, anchors, keys, declarations and lexicons that verifies without elan1.
- **Offline verifier (elan1-verify)**: a zero-dependency program that checks a bundle on an air-gapped machine and exits with one of six codes.
- **Key register**: key_id, validity window, status (active, retired, revoked) and fingerprint.

### 2.7 Level 3 (specified, not built)
- **Action Receipt**: one signed record sent to another organisation, checkable with a key it never carries.
- **receipt.issue / receipt.accept**: the governed writes that record sending and binding a receipt in each chain.
- **Key discovery**: pinned fingerprint → /.well-known/action-receipt-keys → trust-anchor attestation; never the in-receipt hint.
- **Selective disclosure**: reveal chosen payload fields to a recipient while the rest stay committed.
- **Precedent**: counters from the tenant's own chain per action class, feeding a versioned score.
- **Earned autonomy**: A2 → A3 graduation by dual-control write; revoked by one press.
- **Customer-held keys**: the customer's own HSM signs its records; elan1 holds no copy.
- **Sovereign deployment**: kernel and evidence plane run inside the customer's or government's boundary.

### 2.8 stack1 runtime (P1, separate venture)
- **fusion.run/v1 (Temporal)**: durable workflows; every governed write runs in one and approvals arrive as signals.
- **fusion.trace/v1 (Langfuse core)**: OpenTelemetry spans, one per rung.
- **fusion.tools/v1 (ContextForge)**: MCP tool servers for ERPNext, with per-call authorisation and a call ledger.
- **fusion.guard/v1 (Presidio, NeMo)**: safety verdicts that feed gate checks and never grant an allow.
- **fusion.gateway/v1 (LiteLLM)**: model calls, upstream of assert and never inside it.
- **fusion-edge**: ingress with mTLS, a signed tenancy assertion and an attribution triple.
- **OpenBao**: the per-tenant secrets path.
- **Postgres (RLS)**: the tenant-scoped database, with a synchronous standby in a second zone.
- **Transactional outbox**: same-transaction event outbox that feeds the chain writer in commit order.
- **Sandbox pool**: shadow environments for rung-7 dry runs.
- **Deploy pipeline (inverse.json)**: every deploy carries its rollback.

### 2.9 External systems and parties
- **ERPNext / Frappe (hosted)**: the Phase 1 system of record, written only through Frappe's API.
- **Customer-run ERPNext**: Phase 2 target.
- **Tally, Zoho Books**: read-only sources.
- **SAP, Oracle, Temenos, Finacle**: named future targets, not built.
- **TSA A (eMudhra)**: the India-based RFC 3161 timestamp authority (recommended).
- **TSA B (DigiCert / Sectigo / GlobalSign / Entrust)**: the global timestamp authority, still to be chosen.
- **KMS / HSM providers**: AWS KMS (L2); CloudHSM, Thales, Entrust (L3 customer keys).
- **Regulators**: MCA, GSTN (e-invoicing), RBI, CERT-In, DPDP Board. Dated obligations; no conformance claim at L1.
- **Statutory auditor**: reconstructs through elan1 at L1; checks a bundle offline at L2.
- **Counterparty organisation**: known and not sanctioned (G7); at L3 it verifies receipts.

### 2.10 Consumers
- **rung1 Enterprise**: the first consumer; hosted ERPNext; Mode A enforced; Phase 1.
- **rung1 Revenue**: Phase 3 app.
- **rung1 Voice**: inbound voice channel, Phase 3.
- **rung1 Commerce**: parked.
- **verna1**: outbound collections venture, parked (DR-007).
- **Third-party agents**: vendors over MCP/HTTP, Mode B advisory; GA in Phase 2.
- **stack1 tools**: runtime tools that call the kernel in Mode B.

### 2.11 Packs (P8)
- **ledger1**: MCA audit trail (Rule 3(1)/11(g)) over rung1's ERPNext writes; live target Oct 2027.
- **invoice1**: GST e-invoicing; target Apr 2028.
- **collect1**: RBI collections conduct; fourteen gates across the call; target Oct 2028.

### 2.12 People
- **Agent**: proposes writes at a granted autonomy level; never approves.
- **Approver**: a named human in the resolver set who sees the diff and every gate before deciding.
- **Operator / tenant admin**: runs the stop switch, grants and keys; each action is itself a governed write.
- **Declaration certifier**: the named human who certifies a declaration or profile; never its author.

---

## Part 3 — Canonical flows (stepper and animation scripts)

Each step names the component that acts. The UI stepper shows step number, actor chip (zone-coloured), plain-English narration, and the artefact produced (seq, code, event).

### Flow A — Governed write, committed (Mode A, enforced)
1. **Agent / user** composes a write intent (intent_id, declaration_id@version, write_type, payload, as_of) in rung1 Enterprise.
2. **SDK** calls `assert(intent)` with an act token; the tenant and actor come from the token.
3. **Right Path, rung 0b**: stop set checked; tenant not stopped.
4. **Rung 1, identity**: actor_kind set from the token.
5. **Rung 2, write door**: declaration resolved at the integer version (e.g. erp.ar v7); the write type is reachable on this channel.
6. **Rung 3, gate engine**: gates G1…G9 in declared order; one gate_result row each; all pass.
7. **Rung 4, evaluate()**: allow at policy_version 11.
8. **Rung 5, guardrail**: blast radius within declared (one_counterparty).
9. **Rung 6, autonomy**: grant sufficient (e.g. A3 reversible, with a reversal plan).
10. **Rung 7, single writer**: snapshot, then shadow-sandbox apply, then the gates re-run.
11. **Credential broker** mints a single-use ten-minute credential.
12. **Single writer → ERPNext (Frappe API)**: identical bytes applied live; the adapter returns the document name and inverse op; gates re-run on live.
13. **Commit**: record version + one outbox row in one transaction.
14. **Rung 8, chain writer**: consumes the outbox in commit order; seq n, prev_digest, SHA-256 digest; returned synchronously.
15. **Rung 9, meter**: one meter_event, quantity 1, basis per blast radius.
16. **Response**: decision allow, seq, digest, undo_until (+30 d). Webhook write.committed {write_id, record_id, seq, digest}.
17. **Nightly**: the integrity job re-walks the chain; meter.reconcile() matches event ↔ record ↔ target.

### Flow B — Refusal (typed, recorded, free)
1. The intent enters assert as in steps 1–5 above.
2. **Rung 3**: all gates run; G9 precondition fails first, so the code is GATE.PRECONDITION_FAILED.
3. The ladder stops, and rungs 4–7 are marked "not reached".
4. **Rung 8**: the full sixteen-field record is written, with record_id = zero UUID and record_version 0.
5. **Rung 9**: meter_event quantity 0 (CHECK).
6. **Response**: HTTP 200, outcome refused, code, rung, gate, operator action from the register; webhook write.refused.
7. The consumer shows the refusal in plain words with the operator action. The UI never offers "retry anyway". Retrying the same intent_id returns the same decision (I8).
- *Variant 0b:* the tenant is stopped → POLICY.TENANT_STOPPED, **no record**, no meter row.
- *Variant platform:* PLATFORM.* (e.g. POLICY_UNAVAILABLE) → refused, full record, not billed, retry with the same id, and a page to on-call.

### Flow C — Escalation and approval (E04 Flow 3, the ₹2,40,000 invoice)
1. **ar-agent (A2 Propose)** calls act.write; `assert` lands on rung 0b.
2. **Rungs 0b–5** pass (5 of 5 declared gates; allow at policy v11).
3. **Rung 6**: A2 is below what the write needs, so it escalates. The **approval service** opens an obligation (write_id, A2, expiry 4 h, resolver set).
4. **Rung 8**: seq 4,099 (escalated). **Rung 9**: qty 0.
5. **Response**: HTTP 200, outcome escalated, obligation_id. The agent stops and never retries. Webhook write.escalated.
6. **Approvals queue**: the obligation appears, sorted by oldest deadline.
7. **Approver (Venkat)** opens Decide and sees the proposal, the proposer in words, the countdown, the blast radius, the field diff, every gate result with its version, the policy version, why a person is needed, and the L1 banner.
8. *Branch, proposer tries to approve:* GATE.DUAL_CONTROL_SAME_ACTOR. "Send it to: [names]", and the obligation stays pending.
9. **Approve**: act.escalate {obligation_id, approve}, itself a governed write. seq 4,100 (resolution), one meter event. Webhook obligation.resolved.
10. **Resubmit**: the original intent with obligation_ref climbs **0b–6 again** (never resumed); G4 finds a second named actor, so it is allowed.
11. **Rung 7**: sandbox → broker credential → live → commit + outbox.
12. **Rung 8**: seq 4,101 (committed). **Rung 9**: qty 1. Webhook write.committed.
13. The console shows "Approved · posted · proof #4,101".
- *Branch Reject:* the reason is required, so the resolution record is written; the original is refused with POLICY.APPROVAL_DECLINED and never resubmitted.
- *Branch Expire:* nobody acts in 4 h → POLICY.OBLIGATION_EXPIRED, its own proof entry; webhook obligation.expired. The operator may resubmit. Expiry pauses during a platform outage.
- *Branch Approved, write not done:* rung 7 fails (SANDBOX_DIVERGED or TARGET_UNREACHABLE). "Your approval was recorded. The write itself did not complete, and nothing was changed."
- *Branch WhatsApp:* only if whatsapp_approve: true (low value, reversible, one_record). The reply APPROVE/REJECT is bound to the obligation id.

### Flow D — Mode B, attested advisory
1. The **third-party agent** (it holds the target credential) calls `scope` (optional), then `assert` over MCP/HTTP via fusion-edge.
2. **Rungs 0b–6** decide: allow, refuse or needs_approval. The decision is recorded either way (enforcement_mode: attested_advisory).
3. On allow, the **caller writes** to its own system of record.
4. The caller **reports the outcome back**, and the record flags "performed by caller".
5. If it never reports, reconciliation marks the action **acted_unattested**. A write after a refuse becomes an **unmatched write** finding.
6. A timeout on assert must be treated by the caller as refuse. elan1 cannot force this; the UI says so.

### Flow E — Verification at L1 (the `verify` call)
1. An **auditor or operator** requests verify over a record or seq range (ro token).
2. The **kernel** recomputes every preimage and digest, walks seq from 1, and checks prev_digest links; it resolves declaration versions and lexicon hashes.
3. The result is PASS, or the first failure (seq, field, reason). Continuity is three-valued: continuous / break at N / not checked over range.
4. The UI labels this "Checked by elan1. At Level 1, verification requires us." It shows no verdict seal and no signature.
5. The outside check is **E11 test 3**: reconcile against the target system's own trail.

### Flow F — Evidence export and offline verification (L2)
1. The **tenant** requests a bundle (range, profile). The export is itself a governed write (manifest digest → its own seq).
2. The **bundle exporter** writes seals.jsonl, chain.json, anchors/, keys.json, declarations/, lexicon/, VERIFY.txt, and manifest.json last.
3. The bundle travels by the customer's own channel. elan1 keeps no copy (per E15).
4. The **reader** obtains the verifier and the key fingerprint from their own sources (never from the bundle).
5. The **offline verifier** echoes the claim.
6. It checks the profile version is supported; otherwise exit 4.
7. It runs the integrity checks (digests, chain, signatures vs keys.json windows, Merkle paths vs anchors, token time < local clock); a failure exits 1, a missing member exits 3.
8. It runs the profile checks (structural, binding, coverage, temporal); a failure exits 2.
9. It writes the nine-section report, with the limits verbatim; exit 0 PASS (or a PASS variant).
10. **Sanity demo**: run it on the published tampered bundle and see exit 1.

### Flow G — Key custody: rotation (L2)
1. The **operator** generates the successor key in-region (KMS) and the fingerprint is read back.
2. **Register** valid_from ≥ 24 h ahead (30 days recommended); the screen shows "Overlap: none".
3. **Dual control**: a second named human approves at Decide. The registration becomes a record in both the operator and tenant chains.
4. At valid_from the **chain writer** switches keys in one transaction.
5. The predecessor is retired; its records still verify inside its window.
6. The new fingerprint is published out of band and recorded.

### Flow H — Key compromise (L2, P0)
1. Detection: an unaccounted KMS Sign call (the nightly Sign ↔ record join) or an exposed credential.
2. Fix **T_suspect**, the earliest defensible instant.
3. **Stop signing**; the chain keeps writing at assurance_level 1 (an unsigned gap is declared).
4. Revoke: the key's valid_to = T_suspect.
5. Notify every affected tenant in writing within 24 h.
6. The successor signs from its valid_from. Never re-sign or back-date. Records before T_suspect still verify, and their anchors act as witness.

### Flow I — Timestamp anchoring (L2)
1. The **chain writer** signs each digest and enqueues it in the tenant's current batch.
2. The **anchor service** closes the batch at ≤ 15 min or at the size cap, recording leaf count and seq range.
3. It builds the RFC 6962 Merkle root (odd node promoted) and stores the root and paths.
4. It sends TimeStampReq(root, nonce) to **TSA A (India)** and **TSA B (global)** in parallel.
5. It checks each token: imprint, signature, nonce, genTime. On mismatch it retries with a new nonce; twice in a row is a P0.
6. It stores anchors/<batch_id>/: tokens, cert paths, OCSP/CRL, RTT.
7. The records' anchor_ref is set, and the unanchored head drops.
- *Outage branch:* one TSA answers → single_anchor. The same TSA failing for 2 intervals pages SRE. Both failing for 4 intervals raises the banner "Anchoring degraded since HH:MM — N records unanchored". Backlog is anchored oldest first and never merged. Writes never stop.

### Flow J — L3 cross-organisation receipt
1. **Org A**: a source write commits (signed, anchored).
2. **Org A**: receipt.issue passes its gates (counterparty, consent, residency, precondition).
3. **Org A** assembles the receipt: 16 fields, digest, signature, key_id, inclusion path, audience, nonce, expires_at, and chosen disclosures.
4. **Org A** records the issuance in chain A (F14 commits to the receipt digest and audience; qty 1).
5. The receipt is sent by email, API or portal. elan1 runs no delivery network.
6. **Org B** verifier: echo the claim → audience check → expiry → key discovery (pinned → well-known → trust anchor; never the hint) → signature → anchor (absent = UNANCHORED, stated) → disclosures vs commitments → replay check.
7. **Org B**: receipt.accept climbs nine rungs (cross_boundary, dual control, non-empty proof_binding), and F14 binds the issuer digest, org_id, key_id, route and disclosure list.
8. The result is two independent chain entries, with no callback to A and nothing replicated. The verdict prints the discovery route, the disclosed fields and the limits line.

### Flow K — Selective disclosure (L3)
1. At the write, per-field salts are derived from record_salt and field digests are folded into F14.
2. The issuer chooses a profile per recipient (e.g. auditor: amount + tax_identifier; lender: amount + counterparty).
3. Export: disclosures.jsonl (the ninth member, bundle v2) carries seq, name, value, salt and field_digest per revealed field.
4. The verifier recomputes each disclosed digest and then F14 from all digests. A withheld required field exits 2; a mismatch exits 1.

### Flow L — Earned autonomy: graduate and revoke (L3)
1. The **nightly job** projects precedent counters per action class (no payload read) and computes score_v1.
2. The **eligibility** check (eight conditions) passes.
3. The **owner** proposes autonomy.graduate with a written justification (empty by default).
4. A **second approver** (≠ proposer) sees the numbers and no advice, then approves at Decide (dual control, all nine rungs).
5. Effective at the next write. A 30-day supervised period routes 1 in 10 writes to a person (chosen by digest).
6. Recompute; below maintenance returns the class to A2.
- *Revoke:* one person, one press; effective at the next write; automatic triggers listed in Figure 23.

### Flow M — Declaration lifecycle
1. **Author** the seven blocks in Studio or a repository file.
2. **Validate**: schema, rules L0-S01…S11, lint warnings.
3. **Simulate**: nine rungs with a stub writer on the reference tenant.
4. **Certify**: a named human (≠ author), dual control, a governed write.
5. **Compile**: deterministic and content-addressed; two different digests = P0.
6. **Resolve**: live at rung 2 by id + integer version. `define` rejects a version ≠ last + 1.

### Flow N — Regulation → proof field (Phase 4)
Enumerate clauses → name controls → walk links 2–5 → validate (L0-C/R) → compile the clause_to_check_map → simulate per clause → certify (certifier ≠ author) → publish n+1 (append-only).

### Flow O — Metering to invoice
1. Every assert outcome produces one record (rung 8) and one meter event (rung 9).
2. The **meter ledger** stores it insert-only; the CHECK forces refused → 0.
3. **meter.reconcile()** runs nightly two-way against the proof log and the target. A discrepancy stops the invoice and pages.
4. **Rating** runs on reconciled periods only: platform floor + allowance + overage + pack + evidence lines, with the refusal count shown at ₹0.
5. Each invoice line has "Show the records behind this line", which lists events by write_id and seq.

### Flow P — L1 → L2 upgrade (E19)
1. Pre-flight: replay the whole chain ("continuous, 41,206 records"), then record the head seq.
2. Key: bind the domain key with signing off; send the fingerprint out of band.
3. Signing on: a governed write with dual control. The next record is seq B. **Irreversible.**
4. Anchoring on: the first batch is stamped by both TSAs, and the unanchored head reaches 0.
5. Profile: a new declaration version (block 6 addition) and a certified profile; dry export.
6. First bundle: offline exit 0; the tampered bundle exits 1.
7. Close: the closing record. seq 1…B−1 stay L1 forever.

### Flow Q — DPDP erasure
1. A data-subject erasure request is raised as a governed write (irreversible: true, dual control, 72 h SLA).
2. The approver at Decide confirms irreversibility.
3. The **salt store** destroys the subject's per-record salt(s).
4. The chain stays intact; F14 digests still verify, and the payload is unbound. The verifier reports "0 PASS — payload unbound (erased)".

### Flow R — Kernel unreachable (fail closed)
1. The consumer calls assert and gets a timeout or error.
2. There is no cached allow, no local gate and no degraded mode. The run is parked durably with the same idempotency key (SEAL_PENDING first).
3. User copy: "We cannot check this change right now. Nothing was changed."
4. On recovery the parked run resubmits with the same intent_id, and idempotency guarantees no double write or meter.

### Flow S — Incident: proof-chain gap (P0)
1. Detected by the nightly write ↔ seal join or by CHAIN_HEAD_CONFLICT.
2. Two chain writers → the tenant is stopped (rung 0b).
3. RB3: never backfill; write a sealed gap record stating write_id, time and reason.
4. Notify: response within 15 min; contained in 2 h; CERT-In assessed (6 h); tenant update within 72 h; written note within 5 working days.

---

## Part 4 — Screen proposals

Routes follow `CONTRACT.md`: four doors plus the Reference group. A developer surface uses the `doc` layout under `#/developers/…` (not a console door). L2/L3 screens render on L1 tenants as **labelled previews** with an empty state that names what is missing, why, and what fills it.

### Work door (what needs a person now)
| Route | Screen | Atlas | Key fields | Interactions |
|---|---|---|---|---|
| `#/work/approvals` | Approvals queue | F11 | proposal line, proposer ("Agent: ar-agent (A2)" / "Person: …"), write type, blast radius band, amount, deadline countdown, state | tabs Pending · Sent to me · Declined · Expired · Approved, not done; sort by oldest deadline; bulk actions **not** offered (no batch variant, I5) |
| `#/work/decide/:obligationId` | Decide | F11, F6, F7 | as in the Figure 11 "Decide" list; compact rung ladder "Stopped at rung 6"; related seq chips | Approve / Reject (reason ≥ 1 sentence) / Send to…; self-approval shows the GATE.DUAL_CONTROL_SAME_ACTOR copy; after approve, a live stepper follows the resubmission to commit |
| `#/work/not-done` | Not done | F4 (console list), F11 | approved-but-not-done, expired, platform refusals needing resubmit | "Resubmit" (a new intent with obligation_ref) |
| `#/work/activity/:writeId` | Action timeline | F7 | escalated → resolution → committed seq chain | click-through to each proof record |

### Records door (what happened, and the proof)
| Route | Screen | Atlas | Key fields | Interactions |
|---|---|---|---|---|
| `#/records/proof` | Proof list | F13 | seq, recorded_at, write_type, actor + kind, autonomy, outcome (committed / refused / escalated / resolution), code, meter qty | filters by outcome, write type, actor kind, code; the three-valued continuity banner on top |
| `#/records/proof/:seq` | Proof record | F13, F5 | F01–F16 table with encodings; beside it gate_results, refusal code, reversal plan (undo_until), meter event, approval; enforcement badge; level label | prev/next by seq; copy digest; "Verify this record" (L1: checked by elan1); "What this establishes / does not" disclosure |
| `#/records/proof/:seq/path` | **Write path inspector** | F6, F7 | the rung ladder 0b–9 with per-rung outcome, ms vs target, gate rows, policy version, grant, rung-7 sub-steps (snapshot, sandbox, credential mint, live, commit) | step-through animation replaying this write; hover a rung for its tooltip and code list |
| `#/records/chain` | Chain explorer | F13 | seq strip, prev_digest links, refusals marked, level boundary marker (seq B), key-change boundary (L2) | zoom range; "Run verify over range" gives the three-valued result, scope and count |
| `#/records/refusals` | Refusal register | F5, F6 | code, rung, class (policy / gate / platform), operator action, active at L1?, occurrences this period | click a code to see affected records; refusal-rate trend |
| `#/records/usage` · `#/records/invoices/:period` | Usage and invoices | F28 | pipeline counts, reconciliation state, invoice lines, refused count at ₹0 | "Show the records behind this line"; disputed-line hold |
| `#/records/exports` | Evidence exports (L2) | F15 | bundle id, range, profile, member checklist, manifest digest, export seq | builder; download; "How to verify without us" (VERIFY.txt preview) |
| `#/records/receipts` · `/issue` · `/verify` | Action Receipts (L3) | F21, F22 | issued/received, audience, expiry, discovery route, disclosures | disclosure composer; ordered verify stepper; accept (dual control) |
| `#/records/erasure/new` | Erasure request | F27, F22 | subject, affected records, irreversible warning, 72 h SLA | routes to Decide (dual control) |

### Agents door (who may do what)
| Route | Screen | Atlas | Key fields | Interactions |
|---|---|---|---|---|
| `#/agents` | Agents and actors | F1, F5 | actor, kind, consumer (rung1 / third party), mode A/B, grants per write type, last action | filter by kind; open detail |
| `#/agents/:agentId/autonomy` | Autonomy ladder | F23, F6 | A0–A5 ladder per class; how set; grant seq; (L3) counters, score, eligibility, supervision | Propose graduation (L3, to Decide); **Revoke** (one press) |
| `#/agents/connections` | **Connected consumers and tokens** | F2, F4, F8, F27 | consumer, surface (SDK / MCP / HTTP), token class (tenant ro·stage·act / control / ops), mode, MCP tool pins, webhook endpoints + delivery health, acted_unattested / unmatched counts | rotate token; view pinned tool-description hashes; test webhook |
| `#/agents/declarations` · `/:id/v/:version` | Declarations | F9 | seven-block view, version list (integers), certifier, validation status L0-S01…S11 | block cross-highlighting; "What the kernel reads" rung map; diff two versions |
| `#/agents/studio/:declarationId` | Studio | F9, F10 | six-stage lifecycle stepper, validation results, simulation results on the reference tenant | certify → Decide (dual control); never "latest" |
| `#/agents/write-types/:writeType` | Write type | F9, F19 | blast radius band, reversal plan / irreversible, dual-control threshold, gates in order (lock icon on never-skippable), enforcement mode, channels | links to Figure 10 clause trace (Phase 4) |

### Assurance door (can we rely on it, and prove it)
| Route | Screen | Atlas | Key fields | Interactions |
|---|---|---|---|---|
| `#/assurance` | Assurance overview | F25, F26 | current level (L1 Guarded), what runs, **What you can claim** (may say / may not say), hosting profile, chain continuity, unanchored head (L2), open incidents | links to upgrade, controls, runtime |
| `#/assurance/system-map` | **System map (live architecture)** | F1, F3, F4, F26 | zoom 1: context (Figure 1); zoom 2: components (Figure 4); zoom 3: planes (Figure 3); live health per node, the tenant's traffic on the Mode A/B edges | click a node for a drawer with its tooltip, status, last event and links; toggle "Show Level 2/3 (not built)" |
| `#/assurance/runtime` | **Runtime health** | F26, F32 | kernel service statuses, the five fusion contracts vs 99.5%, SLO table target/measured/label, outbox → seal lag, meter lag, nightly job results | time-range picker; per-component status history |
| `#/assurance/residency` | **Data residency map** | F12, F26, F27 | region card (ap-south-1, 3 AZ, sole region), store inventory (writer rung, tenancy, retention, level), sub-processors with region, "only a Merkle root leaves the region" (L2) | retention conflicts badge; export the sub-processor list |
| `#/assurance/connected-systems` | **Connected systems** | F1, F8, F19 | targets (ERPNext hosted: Enforced; customer-run: Advisory; Tally/Zoho: read-only; future: not built), credential broker stats (mints, 10-min life, 0 long-lived), reachability, last write, reversal support | test reachability (a ro call); view the adapter's inverse-op support |
| `#/assurance/controls` | Controls and conformance | F3, F5, F27, F31 | boundary rules 1–9, invariants I1–I8, threat/control rows, C1–C14 per consumer, minimum-bar 13 rows | filter by kind; each row links to its evidence run |
| `#/assurance/enforcement` | Enforcement modes | F8 | per write type: mode, B → A promotion checklist | start promotion (governed write) |
| `#/assurance/verify` | Verify | F13, F15 | L1 verify call; L2 verifier report viewer (nine sections, exit code) | upload a report JSON to render (L2) |
| `#/assurance/keys` | Keys and custody | F16 | L1: broker only + empty state; L2: key register, rotation timeline, Sign ↔ record reconciliation | rotate / revoke → Decide (dual control) |
| `#/assurance/anchoring` | Anchoring (L2) | F17 | batches, TSA A/B health, unanchored head, single_anchor count | banner as specified |
| `#/assurance/upgrade` | Upgrade to Level 2 | F25 | seven preconditions with measured evidence; stage stepper; seq-B boundary | stage actions; stage 2 flagged irreversible |
| `#/assurance/packs` · `/:packId` | Packs | F18, F19, F20 | catalogue; pack detail per the eleven blocks, write types, gate order, clause → check map, limits statement | install / request pilot |
| `#/assurance/regulations/:regId` | Regulation clause trace (Phase 4) | F10 | five-link chains per clause with link states | reverse trace from a proof field |
| `#/assurance/incidents` | Incidents | F32 | class, severity, detected-by, runbook, CERT-In / tenant clocks | acknowledge; link to the gap record |
| `#/assurance/stop` | Tenant stop switch | F6 (0b), F1 | stop state, who can press it, what it does (refuses everything with no record) | Stop tenant, a governed write with a clear, irreversible-effect confirmation |

### Developer surface (`doc` layout)
| Route | Screen | Atlas | Content |
|---|---|---|---|
| `#/developers` | Developer home | F4 | three ways in (SDK, MCP, HTTP), Mode A vs B, sandbox key sk_sbx_ (metered at 0) |
| `#/developers/kernelport` | **KernelPort explorer** | F5 | six call cards with try-it against the sandbox; five object schemas; invariants; outcome matrix |
| `#/developers/right-path` | Right Path | F6 | animated ladder; codes per rung; budgets labelled target |
| `#/developers/refusal-codes` | Refusal code reference | F5, F6, F21, F23 | the full register (rung, class, operator action, L1 active) |
| `#/developers/mcp` | **MCP explorer** | F4, F8 | 34 tools grouped ro 18 / stage 10 / act 6, pinned description hashes, attested-advisory copy rules |
| `#/developers/sdk` | SDK | F4, F8 | @elan1/kernel usage, fail-closed pattern, idempotency |
| `#/developers/http` · `/webhooks` | HTTP /v1 and webhooks | F4, F11 | act · ro · ctl families; the five webhook events; HMAC; polling ≥ 10 s; "handle more than committed" warning |
| `#/developers/flows/:flowId` | **Flow player** | F7, F11, Part 3 | swim-lane sequence animations for Flows A–S |
| `#/developers/declarations` | Declaration schema | F9 | block reference, L0 rules, lifecycle |
| `#/developers/seal-v6` | Seal v6 and test vectors | F13, F14 | preimage builder, field encodings, vector browser |
| `#/developers/verifier` | Offline verifier | F15 | bundle members, exit codes, report sections, tampered-bundle demo |
| `#/developers/action-receipt` | Action Receipt | F21, F22, F24 | format, CL levels, key discovery, disclosure |
| `#/developers/conformance` | Conformance suite | F31 | C1–C14 |
| `#/developers/architecture/:view` | Architecture | F2, F3, F4 | seams, planes, components |

### Reference group (not a door)
- `#/reference/atlas` · `#/reference/atlas/:fig`: the **Atlas viewer**. It lists all 32 figures with status tags; each figure page shows the interactive re-drawing (where built) or the figure, the caption and "Explained in" chapter, and links to the live screens that implement it.
- `#/reference/stack` (F29) · `#/reference/roadmap` (F30) · `#/reference/ci` (F31) · `#/reference/timeline` (F24) · `#/reference/pack-factory` (F18) · `#/reference/kernel-change` (F2 KCR).

---

## Part 5 — Status tags and colour language

### 5.1 Figure status tags found in the atlas
| Tag (verbatim) | Figures | Meaning |
|---|---|---|
| L1 — BEING BUILT | 2, 3, 9, 11, 13 | in active build, Phase 1 |
| L1 — BEING BUILT · L2/L3 — NOT BUILT | 1 | |
| L1 — BEING BUILT · L2 — NOT BUILT | 4 | |
| L1 — BEING BUILT · [L2] FIELDS FROZEN | 5 | |
| L1 — BEING BUILT · BUDGETS ARE TARGETS | 6 | |
| L1 — DESIGNED, NOT YET BUILT | 7 | |
| L1 — BEING BUILT · LATENCIES ARE TARGETS | 8 | |
| L1 — BEING BUILT · L2 DASHED | 12 | |
| L1 BEING BUILT · L2, L3 SPECIFIED, NOT BUILT | 25 | |
| L1 BEING BUILT · TARGETS, NOT MEASURED | 26 | |
| L1 BEING BUILT · DESIGNED, NOT AUDITED | 27 | |
| L2 — SPECIFIED, NOT BUILT | 14, 15, 16, 17 | frozen spec |
| L3 — SPECIFIED, NOT BUILT | 21, 22, 23 | |
| PHASE 4 SPEC — NOT BUILT | 10 | |
| PHASE 4 — SPECIFIED, NOT BUILT | 24 | |
| PACK — SPECIFIED, NOT BUILT | 19 | |
| SPEC SKETCH — CITATIONS NEED COUNSEL | 20 | |
| DESIGNED — NOT YET BUILT | 18 | |
| DESIGNED — PRICES MODELLED, NOT QUOTED | 28 | |
| MOSTLY RECOMMENDATIONS · ADR BEFORE EACH WAVE | 29 | |
| PLAN — TARGETS, NOT MEASURED | 30 | |
| DESIGNED — PIPELINE NOT YET RUNNING | 31 | |
| DESIGNED — SLOs ARE TARGETS | 32 | |

Inline qualifiers: [L2], [L3], [target], [unverified], [modelled], "MEASURE THIS", "estimate", "invariant", "published SLO", "(conflict)", and Figure 29's status column: RECOMMENDED · RULE FIXED · ZERO-DEP FIXED · FIXED · LOAD-BEARING · NAMED · OPEN · IN REPO · VIA STACK1.

### 5.2 Proposed UI badge families (never mixed with each other)
1. **Assurance level pill** (top bar and level-scoped elements): `L1 Guarded` · `L2 Attested` · `L3 Proven`. Neutral outline plus text. The tenant's current level uses the clay selection treatment in the top bar only (brand emphasis, not status).
2. **Build maturity chip** (on previews, Reference, the atlas viewer, and any L2/L3 element shown to an L1 tenant). Six values, each rendered neutral with an icon and text, never a status colour:
   - `Building` (L1, being built)
   - `Designed` (designed, not yet built)
   - `Specified` (frozen spec, not built)
   - `Sketch` (spec sketch, needs counsel)
   - `Plan` (targets or modelled)
   - `Parked`

   Specified and Plan use a dashed outline, echoing the atlas's dashed "not built".
3. **Number qualifier chip** next to any figure from the atlas: `Target` · `Modelled` · `Estimate` · `Measured` · `Invariant`. Rule: a latency or price without a qualifier is a defect.
4. **Status (six reserved states, always with text):**

| Situation | Status token | Label example |
|---|---|---|
| Committed / passed / PASS (exit 0) / continuous chain / reconciled | good | "Committed", "Passed", "PASS" |
| Escalated / pending approval / single_anchor / degraded / Exit 3 INCOMPLETE | warning | "Escalated — needs a person" |
| Exit 2 FAIL_PROFILE / meter mismatch (P2) / source conflict / approved, write not done | serious | "Profile not met" |
| Refused… see note / chain break / FAIL_INTEGRITY (exit 1) / P0 / isolation breach / key compromise | critical | "Chain break at seq 4,112" |
| Informational: L1 banner ("hash-chained, not signed"), "verify requires us", Mode B advisory | info | "Advisory" |
| Not reached / not applicable / not checked / not measurable / exit 4, 5 | neutral | "Not reached", "Not measurable" |

   **Note on refusals:** a refusal is a *correct outcome*, not a failure. Recommend **neutral with a "Refused" label and the code** in lists (or info), and reserve critical for integrity failures and P0s. Using critical red for every refusal would teach users that refusals are errors and contradict "refusals are free and typed". Platform-class refusals (PLATFORM.*) may use serious because they page.

5. **Blast-radius ladder** (the contract's own 4-step band: Contained, Reversible, Material, Irreversible). The atlas's five declared values do **not** map one-to-one, so show both: the declared value in mono (`one_counterparty`) and the contract band derived from reversibility plus radius:
   - one_record / one_counterparty with a reversal plan → Contained / Reversible
   - batch / tenant → Material
   - `irreversible: true` or cross_boundary → Irreversible
   - The mapping needs product sign-off (see Gaps).
6. **Enforcement badge**: `Enforced` (Mode A) / `Advisory` (Mode B), with the tooltip quoting the permitted claim sentence.
7. **Autonomy chip**: `A0 Observe` … `A5 Act broad`, plus a provenance suffix (default / declared / earned / ADR).
8. **Exit-code badge**: `0 PASS` good · `1 FAIL_INTEGRITY` critical · `2 FAIL_PROFILE` serious · `3 INCOMPLETE` warning · `4 UNSUPPORTED` neutral · `5 USAGE` neutral.
9. **Three-valued check badge** (used across Controls, continuity and reconciliation): `Passed` / `Failed` / `Not measurable` (plus the reason).

### 5.3 Atlas zone colours → UI zone palette (for architecture diagrams only)
The atlas colours *zones* (teal elan1, blue consumers/agents, purple stack1, amber people who decide, grey external, pink refusal/limits/prohibited). The UI contract reserves colour for status, and clay for brand. Recommendation: the design-system agent adds a **diagram zone palette** as tokens, used *only inside architecture and flow diagrams*, each paired with a text label or icon and never used for status:
- `--zone-kernel` (elan1 kernel, packs, console): a desaturated teal
- `--zone-consumer` (consumers and agents): blue-grey
- `--zone-runtime` (stack1): violet-grey
- `--zone-people` (people who decide): sand/amber-grey, distinct from the warning token
- `--zone-external` (external systems): neutral grey
- `--zone-limit` (limits, prohibited, "may not say"): a muted rose, distinct from critical

Line styles carry meaning independent of hue:
- solid = built / L1
- dashed = specified, not built (L2/L3)
- dotted = parked
- dash-dot blue = advisory path (Mode B)
- dashed zone-kernel = L2 anchoring / bundle export

Rules: (a) no zone colour ever means good or bad; (b) every zone fill has a legend on screen; (c) in dark mode zone fills drop to low-alpha tints with a zone-coloured border.

---

## Part 6 — Gaps, source conflicts and value-adds

### 6.1 Source conflicts the atlas itself flags (show them in the UI; don't pick silently)
1. **Proof record retention:** MCA ≥ 8 years vs O05 7 years WORM vs E11/E15 indefinitely (Figures 12, 19). The WORM store in Figure 26 says "proof 7 yrs". Recommendation: the UI shows "Indefinitely (MCA floor 8 years)" once resolved; until then a "Source conflict" chip.
2. **Evidence bundle retention:** O05 24 months vs E15 "elan1 keeps no copy".
3. **Signing-key rotation:** O05 90 days vs E16 12 months (Figures 16, 27).
4. **Seal as report-back:** O03 §04 calls the Mode B report-back "seal", while E02 keeps seal kernel-only (Figure 8). The Developer docs must name the Mode B report-back call; the atlas doesn't.
5. **Third token class naming:** "ops" vs "a stack1 service token" (O03 §06) (Figure 2).
6. **TV-001 preimage:** 329 octets now; 311 is retired. Make sure no screen or doc shows 311.

### 6.2 Internal inconsistencies spotted while reading
- The Figure 26 caption says "five hosting profiles" and "three planes and their absent routes", but the figure draws **four** hosting profiles, and the plane routes are not explicit. The UI should use four.
- Refusal register counts: "43 codes, 28 active at L1; policy 14 · gate 19 · platform 10". 14 + 19 + 10 = 43, so the split describes all 43, not the 28. The per-class split of the 28 L1-active codes is not given. The refusal-code screen needs the full register from E02/E04. The atlas names about 31 codes (listed in Part 1).
- Figure 7 says "5 of 5 gates pass" while rung 3 is described as "G1…G9". Declared gates per write type vary: 5 for erp.ar v7 and 7 for ledger1. The UI must show *declared* gates, not a fixed nine.
- Write-type naming is inconsistent: `sales_invoice.submit` (Figures 9, 10, 13 genesis) vs `erp.sales_invoice.submit` (Figure 13 seq 4,098) vs "erp.ar v7" (Figure 7, a declaration). The UI needs one canonical display rule (suggest: show the declared name verbatim).
- The G1–G9 → name mapping is inferred (Part 2.2) and needs engineering confirmation.
- The blast-radius vocabulary (atlas: 5 values) vs the contract's 4-step ladder: the mapping needs product sign-off.
- "Not done" appears in the Figure 4 console list and is not defined anywhere else in the atlas.
- In Figure 11, Escalate can come from rung 4 **or** rung 6, while Figure 6's approval box says "rung 6 (or evaluate())". The Decide screen must show which rung escalated.

### 6.3 Open items with dates (surface as "open" in Reference / Assurance)
- RPO and RTO not set (due 15 Oct 2026).
- Global TSA partner (open to 31 May 2027).
- Hosting vendor (OD-28).
- Evidence store (S3 Object Lock vs SeaweedFS/Ceph/Garage).
- Paging vendor.
- Counsel questions on DPDP erasure and the collect1 citations.
- Mode B enforcement for ERPNext (O03 OQ1).
- L3 customer-held key liability (Q2 2028).
- Declaration mis-publish severity: "not stated".

### 6.4 What the atlas does not specify that screens will need
- **Tenant stop switch UX:** who holds it, the confirm pattern, and how un-stopping is recorded (a governed write?).
- **Grant management screen:** how a tenant admin grants A0 → A2 (the atlas says "in the tenant's own declaration grants[]", so it is a declaration version change). The UI flow for this is not drawn.
- **Webhook endpoint management and delivery log.**
- **User and role management:** resolver sets name humans, but role administration is absent.
- **Notification model:** countdowns and delegation "Send to" require notifications; channels beyond WhatsApp are not specified.
- **Reversal / undo UX:** undo_until is 30 days and the reversal plan exists, but the "Undo" flow (is it a new governed write? which write type?) is not drawn. Recommend treating undo as a governed write of the declared reversal method, showing its own seq.
- **Sandbox tenant onboarding:** sk_sbx_ keys are metered at 0, with no screen flow.
- **Search across records** by business identifier (invoice number): the record has record_id, but business keys live in the payload, which elan1 commits and does not carry. The UI must search via the target system or a tenant-side index, and label that clearly.

### 6.5 Value-adds (recommended beyond the atlas)
1. **"What you can claim" card** (from Figure 25 may say / may not say, and Figure 8 per mode), placed on the Assurance landing and in every export. It gives sales and compliance pre-approved sentences, and it enforces C14 in the UI itself.
2. **Copy linter in the design system:** a helper that refuses to render banned words ("signed", "tamper-proof", "immutable", "independently verifiable", "court-ready", "we block/prevent") on an L1 tenant. It mirrors CI check C14 at runtime.
3. **Three-valued everywhere:** adopt passed / failed / not measurable (with a reason and would_change_if) as a standard component. The atlas uses it for continuity, dispositions and precedent.
4. **Limits statement component:** every verdict, PASS or report shows its limits verbatim (Figures 15, 19 and 21 all require it). Make it a component that cannot be collapsed below one line.
5. **Refusal-rate beside cost** chart on Usage (Figure 28 rule), so buyers see that a falling cost does not hide loosened gates.
6. **Seq chips everywhere:** any governed event (approval, key rotation, certification, export, graduation, erasure) shows its own proof seq as a clickable mono chip. This teaches the product's core idea, "every action has a record".
7. **"Not reached" rungs** in the Write path inspector, with the reason (ladder stopped at rung N), instead of blank.
8. **Level-preview mode:** a toggle on the System map and Assurance pages ("Show what Level 2 adds") that overlays the dashed L2/L3 components with their GA target, without implying they are live.
9. **Replay determinism demo** (I8): on a proof record, "Re-evaluate with the same versions and as_of" should return the same decision. This is a cheap, convincing trust feature for auditors, and it uses the `scope`/assert determinism already specified.
10. **Mobile Decide** (`#/m/decide/:id`): 44 px targets, the gap between Approve and Reject, and the WhatsApp eligibility rule surfaced. Figure 11 makes these normative.

### 6.6 Eight figures most worth making interactive
1. **Figure 6, Right Path ladder**: the Write path inspector, Decide mini-ladder and developer animation.
2. **Figure 11, Approval state machine**: Approvals states and the flow player; the Decide spec is canonical.
3. **Figure 7, Governed action sequence**: the swim-lane flow player plus the seq-linked action timeline.
4. **Figure 13, L1 proof chain**: the chain explorer and proof record with three-valued continuity.
5. **Figures 1 + 4 (+ 3), Context, components and planes**: the zoomable live System map.
6. **Figure 25, Assurance ladder and upgrade runbook**: the Assurance landing, the claim card and the upgrade stepper.
7. **Figure 15, Evidence bundle and verifier**: the export builder and exit-code report viewer.
8. **Figure 10, Clause → proof field chain**: bidirectional clause trace for auditors (Phase 4, but the most persuasive screen).

Runners-up: Figure 8 (mode comparison and enforcement badges), Figure 23 (autonomy ladder and revoke), Figure 28 (pipeline and "records behind this line"), Figure 26 (runtime health) and Figure 17 (anchoring timeline).
