# spec-tm — what the Technology Memorandum tells the screen builders

Source: *elan1 Technology Memorandum* (draft for review, 23 September 2026, 405 pp, 23 chapters, 32 figures). Text: `/home/claude/elan1/txt/elan1-technology-memorandum.pdf.txt`. Section references are given as `TM §x.y`, and the TM's own source tags are kept where they matter, e.g. `[E06 §03]`.
Read in full: Ch 4–16, 18, 19, 22. Skimmed: Ch 1–3, 17, 20, 21, 23 and the appendices.
Figures checked as rendered pages: Fig 5 (KernelPort), Fig 11 (obligation state machine), Fig 13 (L1 proof chain), Fig 25 (assurance ladder), Fig 28 (metering pipeline), Fig 32 (operations).

**Three rules that override everything else in this file**

1. **Designed is not shipped (DR-010).** As at 23 Sep 2026 there is no customer and no governed action. Every latency, cost and capacity figure is a *target* or a *model*. Screens that show performance numbers must say "target" or "MEASURE THIS" until they are measured. A demo can show sample "measured" values only when it is clearly a demo tenant.
2. **The L1 honesty rule is a rendering rule, not a footnote** (TM §8.1, [E06 §01, §05]). At L1 no screen shows a signature, a "Signed by" row, an anchor time or a verifier verdict. The Proof screen must carry, word for word: *"This record is hash-chained. It is not signed, and it cannot yet be checked by someone who does not trust elan1. That arrives at Assurance Level 2."* Banned words at L1, enforced by CI test C14: "signed", "tamper-proof", "independently verifiable", "immutable", "court-ready". Use "tamper-evident to you" instead.
3. **The console has no bespoke screens in the product** (TM §8.1). Every screen is compiled from a Declaration's seven blocks and drawn by about eleven shared components: "115 endpoints, 30 screens, 0 screen files". Our static build is a *reference rendering* of what that compiler would produce. Field labels should therefore come from declaration data (write-type `label`, `intent`, field names) and never be hard-coded business nouns.

---

## 1. Data model for the UI

### 1.1 Identifier and display conventions

The TM types every kernel identifier as a **uuid**. rung1's own ULIDs travel inside `subject` or `payload`. The human-readable forms below come from the TM. Where the TM gives no form, the row is marked *(ours)* and is a proposed display convention only.

| Thing | Wire form | Display form in UI | Source |
|---|---|---|---|
| Proof entry / record | `seq` uint64, per tenant, from 1 | **`#4,101`** or "proof #4,101"; "seq 4,099" in tables | TM §8.6, Fig 7 |
| Digest | 32 octets → 64 lowercase hex | first 4 + "…" (`9f2c…`); full value in a copy field | TM §10.7 |
| write_id, intent_id, approval_id, event_id | uuid | `0b7e…` (short) + copy | TM §4.5.3 |
| obligation_id | uuid (the TM example shows `ob_91…`) | `ob_91…` or *(ours)* `OBL-7301` keyed to its escalation seq | TM §4.5.3 |
| stage request | `rq_7f…` | same | TM §6.5.3 |
| declaration | uuid + slug; examples `erp.ar v7`, `d-rung1-erpnext`, `erp_sales_invoice` | "erp_sales_invoice **v7**", never "latest" | TM §5.13, §7.4 |
| declaration_version, policy_version | uint32 | "v7", "policy 11" | TM §4.3 |
| write type | `<slug>.<verb>`, 5–64 octets, NFC | `sales_invoice.submit` (mono) plus its `label` "Submit invoice" | TM §7.3.4 |
| surface plan | `sp:erp_sales_invoice@7#c41e…` | same | TM §8.6 |
| ADR | `^ADR-[0-9]{4}$` | ADR-0412 | TM §7.4 |
| Refusal code | `POLICY.*` `GATE.*` `PLATFORM.*`; permanent `REF-01…REF-43` (build rec.) | code in mono + plain title | TM §4.6.3 |
| Control / test / profile check | `C-AT-01` / `T-01` / `C01` | always print in full ("C-AT-01", never "C01", for controls) | TM §7.4 |
| Regulation / profile id | `^[a-z]{2}-[a-z0-9-]{3,40}$`, e.g. `in-mca-audit-trail` | "in-mca-audit-trail v1" | TM §7.4 |
| Pack id | `^[a-z][a-z0-9]{2,15}1$` | `ledger1`, `invoice1`, `collect1` (lower case) | TM §13.3 |
| Signing key (L2) | `k_<domain>_<YYYYMMDD>_<4hex>` | `k_in_20270401_9c3a` | TM §12.6 |
| API keys | `SK_SBX_…` / `SK_LIVE_…` (§6.7); `sk_sbx_…` / `sk_live_…` (§16.4.3) | lower-case form, shown once, then masked | TM §6.7 |
| Organisation (L3) | `ar-org:<domain>` | `ar-org:acmetextiles.example` | TM §14.2.3 |
| Incident | `INC-0412` | same | TM §12.7 |
| Bundle | `bundle-<tenant8>-<from6>-<to6>` | `bundle-3f9a1c2e-000001-012480` | TM §11.2 |
| Autonomy | `A0`–`A5`; F11 encodes 0–5 | "A2 Propose" (level **and** name); never "L2" | TM §5.8, §7.2 |
| Assurance level | 1, 2, 3 | "L1 Guarded", "L2 Attested", "L3 Proven" | TM §16 |
| Time | RFC 3339 UTC, second precision, `Z` (F16 is exactly 20 chars) | show in IST, with UTC on hover; the platform clock only | TM §10.3 |
| Money | ₹, quoted ex-GST | Indian grouping: ₹2,40,000; ₹1,80,000 / tenant / yr | TM §19.10 |

### 1.2 Core kernel objects (the five objects plus the rows nested in them)

**WriteIntent** — "a request, never a permission" (TM §4.3.1)

| Field | Type | Req | Notes for UI |
|---|---|---|---|
| intent_id | uuid | yes | client-generated idempotency key; HTTP/MCP `idempotency_key` maps to it (UUIDv5) |
| tenant_id | uuid | yes | from the token; a body mismatch is "a rejection and an alert, not a refusal" |
| declaration_id | uuid | yes | |
| declaration_version | uint32 | yes | explicit integer; `"latest"` is a 4xx rejection (sandbox keys only may use latest) |
| write_type | string | yes | must exist at that version |
| actor_id | uuid | yes | |
| actor_kind | enum human·agent·system | yes | the token is authoritative; "never inferred" |
| on_behalf_of | uuid | no | delegation "confers accountability, never autonomy" |
| subject | object\|null | yes | target record ref; null for a create |
| payload | object | yes | proposed field values |
| as_of | RFC 3339 | yes | business instant; "supplied, never taken from a clock" |
| channel | string | yes | must be listed in block 7 for this write type |
| reason | string | no | recorded, never evaluated |
| obligation_ref | uuid | no | present only on the resubmission after approval |

**Decision** — produced by `assert`; immutable (TM §4.3.2)

| Field | Type | Notes |
|---|---|---|
| write_id | uuid | kernel-assigned |
| disposition | allow · refuse · escalate | "There is no fourth" (no warn) |
| rung | uint8 | the rung that produced it (0b shown as "0b") |
| code | string | iff refuse |
| gate | string | iff code is gate-class |
| obligation | object | iff escalate |
| policy_version | uint32 | resolved by the kernel |
| declaration_version | uint32 | echoed |
| autonomy_level | A0–A5 | held at that instant |
| blast_radius | one_record · one_counterparty · batch · tenant · cross_boundary | ordered in that sequence |
| gate_results[] | array | **one row per declared gate, in declared order, pass or fail** |
| reversal_plan | object | absent only when the write type is irreversible |

The consumer-facing **outcome** is a separate thing: `committed | refused | escalated`. allow followed by a successful rung 7 is *committed*; a refusal at any rung, including a platform one at rung 7, is *refused*.

**GateResult** (nested; build-rec names): `name` (one of nine), `position`, `outcome` (pass · fail, plus **pending** for G4 on a first submission, build rec. §5.5), `code` (on fail), `inputs_hash` (sha256), `inputs` (jsonb, shown to auditors), `declaration_version`, `as_of`.

**Obligation** (nested in an escalating decision; TM §8.3)

| Field | Type | Notes |
|---|---|---|
| obligation_id | uuid | |
| tenant_id, write_id | uuid | the escalated intent |
| raised_at_rung | 4 or 6 | rung 6 is the single place obligations are created |
| autonomy_level | A0–A5 | the level that triggered it |
| resolver_set / resolver_ids / resolver_roles | uuid[] / string[] | **humans only**; e.g. role `gl-approvers`, `ar-approvers` |
| quorum | smallint, default 1 | build rec.; 2 for tenant or cross_boundary radius |
| expires_at | timestamptz | default **4 h**, "asserted, not observed"; per-write-type override (rung1 wants 72 h) |
| paused_seconds | int | pause accounting during an outage; effective deadline = expires_at + paused_seconds |
| status | open · approved · declined · expired | |
| resolved_by | approval_id | |
| escalation_seq | bigint | proof entry of the escalation |
| extension | single declared extension (build rec., for the a11y "pausable timer") | |

**Approval** — "An approval is itself a governed write. It is not a flag" (TM §4.3.3, §9.6)

| Field | Type | Notes |
|---|---|---|
| approval_id | uuid | |
| write_id | uuid | the write being approved |
| approval_write_id | uuid | the approval's own governed write (it has its own seq) |
| approver_id | uuid | ≠ requester when G4 applies (a DB CHECK too) |
| approver_kind | `human` only at L1 | agents never approve |
| requester_id | uuid | copied at approval time |
| decision | approve · decline | the UI button says **Reject**; the data value is `decline` |
| note | string | Reject needs "a reason of at least a sentence" |
| basis | {surface_plan, rendered_payload_digest, channel, step_up} | "what the approver saw" |
| at | RFC 3339 | platform clock |

**Record / proof entry** — sixteen frozen fields F01–F16, hash-chained, unsigned at L1 (TM §4.3.4, §10.2)

| # | Field | Type · octets | Produced at | UI note |
|---|---|---|---|---|
| F01 | tenant_id | uuid · 16 | token | |
| F02 | seq | uint64 · 8 | rung 8 | from 1, never skips |
| F03 | prev_digest | digest · 32 | rung 8 | 32 zero octets at genesis |
| F04 | write_id | uuid · 16 | intake | |
| F05 | write_type | string · 5–64 | rung 2 | |
| F06 | declaration_id | uuid · 16 | rung 2 | |
| F07 | declaration_version | uint32 · 4 | rung 2 | |
| F08 | policy_version | uint32 · 4 | rung 4 | 0 if rung 4 was not reached (build rec.) |
| F09 | actor_id | uuid · 16 | rung 1 | pseudonymous |
| F10 | actor_kind | enum · 5\|6 | rung 1 | "Agent"/"Person"/"System" in words |
| F11 | autonomy_level | uint8 · 1 | rung 6 | 0–5 → A0–A5 |
| F12 | record_id | uuid · 16 | rung 7 | **zero UUID on refusal/escalation** |
| F13 | record_version | uint32 · 4 | rung 7 | **0 on refusal** |
| F14 | payload_hash | digest · 32 | rung 7 | salted commitment; payload never stored in the chain |
| F15 | lexicon_hash | digest · 32 | rung 2 | term set in force |
| F16 | recorded_at | timestamp · 20 | rung 8 | platform clock `YYYY-MM-DDTHH:MM:SSZ` |

Around the record, **outside the preimage**: `digest`, `assurance_level` (1|2), the refusal code, gate results, reversal plan, one meter event, and the separate approval record. At L1 there is **no** `signature`, `key_id` or `anchor_ref` member: "absent, not null, not an empty string, not thirty-two zero octets". At L2 these are appended: `key_id`, `signature` (128 hex) and `anchor_ref`.
Preimage = `LP("elan1.proof.seal.v6") ‖ LP(enc F01) ‖ … ‖ LP(enc F16)` and digest = SHA-256. TV-001 is 329 octets. The Proof screen **displays** outcome, refusal code and `mode: live | sandbox` beside the record, even though they are not among the sixteen fields (TM §4.3.4 gap).

**MeterEvent** — exactly one per governed write (TM §4.3.5, §19.4)
Normative fields: `event_id` uuid, `write_id` uuid, `seq` uint64, `basis` enum (= blast radius), `quantity` 0|1, `outcome` committed·refused·escalated, `at`.
Build-rec extensions: `tenant_id`, `meter_class` (governed_action · approval · define · evidence_export), `run_id`, `write_type`, `declaration_id`, `declaration_version`, `policy_version`, `refusal_code`, `mode` (enforced · attested_advisory), `key_class` (production · sandbox) and `pack_id`.
**Constraint:** quantity may be 1 only when outcome=committed ∧ key_class=production ∧ meter_class=governed_action.

**Write (action-store row)** (TM §9.5): tenant_id, write_id, intent_id (unique), actor_id, actor_kind, on_behalf_of, declaration_id, declaration_version, write_type, channel, as_of, received_at, outcome, refusal_code, refusing_rung, refusing_gate, policy_version, autonomy_level, blast_radius, record_id, record_version, payload_hash. A separate `write_sealed` acknowledgement links it to its seq. **Pending proof:** if the chain append misses its deadline, the response is `outcome: committed` with `record: {status: "pending"}`. It pages at 5 minutes. rung1 calls this `SEAL_PENDING` and O03 calls it `acted_unproven`.

### 1.3 Tenancy, actors, tokens, keys

**Tenant** (TM §9.3): tenant_id, name, `residency_domain` (`in` at Phase 1), `enforcement_mode` (declared per channel × write type, see below), `environment` live · sandbox · reference, assurance_level (L1 now), hosting profile H1–H5 (§17.5), created_at, notice contact (a person, "not a distribution list"), production owner. **Stop state** is an append-only `stop_event` (the latest event wins; nothing is updated) with `reason_class` (kill switch · revocation · blacklist · regulator directive · entitlement_exhausted · chain_head_conflict · incident) and `set_at`. Throwing the stop is a **dual-control governed write** on the Tenants screen, and "it stops all writes including refusals".

**Actor**: actor_id, kind (human · agent · system), display name, roles, for agents also `model`, `tools`, **hash-pinned tool descriptions** (a changed description "shows as a version change, not a silent update"), and `sponsor` (the human behind the agent; an agent token with no sponsor is refused: "This action needs a person behind it").
**Delegation** (build rec.): delegate human, write types, window, granted by a dual-control governed write. It never names an agent and never raises autonomy.
**Autonomy grant**: (actor, write_type) → A0–A5. A missing grant renders as **"A0 Observe (no grant)"**. There is "no API that sets an autonomy level". Changes are governed writes.

Autonomy ladder (rung 6):

| Level | Name | Permits |
|---|---|---|
| A0 | Observe | reads only; cannot reach rung 7 |
| A1 | Draft | produces an intent a human must submit (stage only) |
| A2 | Propose | submits; a human approves before rung 7 |
| A3 | Act reversible | acts alone where a reversal plan exists |
| A4 | Act bounded | acts alone inside the declared radius and budget |
| A5 | Act broad | tenant scope; dual control on the declaration itself |

**Token classes** (TM §4.4, §18.3): *tenant* (one tenant, one actor, one autonomy level; the only class that reaches `/v1/writes`; scopes `ro`, `stage`, `act`), *control* (Studio, registry, `/v1/declarations`, `/v1/actors`, `/v1/tenants`; no network route to any record store), *ops* (read-only, no tenant data; break-glass is a governed write) and *service* (stack1 internal; never reaches KernelPort). Claims sketch: `iss, aud: kernelport:v1, cls, ten/tid, sub, akd, scp[], spn (sponsor), obo, rdom: "in", iat, exp` (5–15 min).

**API keys** (TM §6.7): sandbox key `sk_sbx_…` → isolated tenant with synthetic fixtures, own chain `mode: sandbox`, quantity 0, limits 10 writes/min, 2 concurrent, 5,000/month hard stop, self-serve on e-mail verification from GA, provisioned in < 60 s. Production key `sk_live_…` → issued **by elan1 after a human review, never self-serve**, and scoped to tenant, declared write types and residency domain. Keys are shown once. The Keys screen shows last used and rotation window. Keys are exchanged for short-lived tenant tokens by client-credentials, and static keys are not accepted on MCP.

**Signing key (L2)** (TM §12.6): key_id, domain, key_class (domain_signing · anchor_client), kms_key_ref (never material), fingerprint (sha256 of raw pubkey, 64 hex), valid_from, valid_to, successor_id, status active · retired · revoked, revoked_at, revoke_reason, registered_by_seq. Windows **abut, never overlap**. The UI shows "Overlap: none". Per tenant there is a **key binding** state: "Key bound · signing off" → signing on at seq B. Four key classes: domain signing, anchor client, release, transport. **At L1 the key register is empty by rule.**

### 1.4 The Declaration (policy as data): seven blocks

One JSON object (JSON Schema 2020-12, `additionalProperties:false`, under 900 lines; YAML authoring allowed). Read in order the blocks form one sentence: *identity · shape · permissions · write_types · gates · proof_binding · channels* (TM §7.3).

| Block | Fields (type) | UI meaning |
|---|---|---|
| 1 identity | declaration_id uuid · name · slug `^[a-z0-9_]{3,48}$` · owner_role (a role, "never a person — people leave") · residency_domain `in` · system_of_record `erpnext` · lexicon_ref (→ F15) · description (one plain sentence) | header card |
| 2 shape | record_type (ERPNext DocType) · fields[] {name, type string·integer·decimal·boolean·date·datetime·reference·enum, cardinality one·many, required, classification public·internal·personal·financial, references} · links[] {name, target, cardinality} | form / pinned fields; classification badges |
| 3 permissions | grants[] {actor_kind, role, write_type, min_autonomy A0–A5, may_approve (never true for agent)} | "a control the actor may not use is not rendered at all" |
| 4 write_types | name · label · intent (≥ 40 chars) · blast_radius · dual_control · gates[] (ordered) · reversal_plan {method snapshot_restore·compensating_entry·target_native_undo, window_hours, after_window compensating_entry·not_reversible} **XOR** irreversible:true · payload_schema · policy_exempt + adr | the action buttons and the Decide header |
| 5 gates | name (nine) · enabled (false only for rate/budget/schedule) · params · as_of_dependency · refusal_codes[] | gate list |
| 6 proof_binding | fields[] (→ F14) · canonicalisation `elan1_lp_v1` (Phase 4 adds `elan1_lp_sd_v1`) · salt_scope `per_record` (Phase 4 `per_field`) · redaction_profile (ignored at L1) · disclosure_profiles[] (L3) | "what the proof commits to" |
| 7 channels | channels[] {name, kind web·mobile·messaging·api·mcp·voice, write_types[], may_approve, mode enforced·attested_advisory} | per-channel mode badge plus the permitted sentence |

**Three dispositions, never a blank** (every field): a value · `out_of_scope` + `ADR-nnnn` (hidden, ADR on hover) · `not_measurable` + `reason` + `would_change_if` (each ≥ 12 chars, rendered as "not measured" with both strings). The Studio rejects "n/a" and "tbd" with: *"An honest unknown needs a sentence. What would change your answer?"*

**Semantic rules (failures)**: L0-S01 granted write types exist · S02 named gates exist · S03 reversal_plan XOR irreversible · S04 irreversible ⇒ radius ≥ one_counterparty · S05 tenant/cross_boundary ⇒ dual_control · S06 cross_boundary ⇒ non-empty proof_binding · S07 bound fields exist in shape · S08 channels registered for the tenant · S09 policy_exempt needs ADR, never on irreversible · S10 every write type on ≥ 1 channel · S11 no agent may_approve; min_autonomy in A0–A5. L3 adds S12–S15.
**Lint (warnings)**: LN-01 > 900 lines · LN-02 reason < 12 chars · LN-03 not_measurable unchanged over 3 versions · LN-04 gate order differs · LN-05 intent < 40 chars or repeats label · LN-06 financial/personal field unbound without ADR · LN-07 rate/budget/schedule off without ADR.
Example failure copy: *"L0-S03 — sales_invoice.submit declares neither a reversal plan nor irreversible: true. Every write type must say which it is."* Failures are shown **against the block that caused them**, not as a list of codes.

**Lifecycle (state machine), six stages, none skippable** (TM §7.11):
`draft → validated (schema + L0-S01..S11 + lint) → simulated (reference tenant only; "This simulation produced no refusals. Add a fixture that fails") → certified (a named human who is not the author; a governed write under dual control; else GATE.DUAL_CONTROL_SAME_ACTOR) → compiled (compiled_digest; 2 digests = P0) → resolvable (rung 2 at id + integer version)`. Later states: `superseded` (a new version exists; the old still resolves for old writes) and `withdrawn` (resolvable for verify and old records, unresolvable for new intents → POLICY.DECLARATION_UNRESOLVED). Versions are exactly last+1, immutable, kept "verbatim, for ever". A typo fix is still a new version. Author sees *"Accepted at version N"*. Webhook `declaration.certified` {declaration_id, version, certifier}.

**Policy rule set** (rung 4; build-rec shape): policy_id, policy_version, applies_to {declaration_id, versions}, projection[] (declared fields only), rules[] {id `R-SI-01`, when, if, then allow·refuse·escalate}, `default: no_rule_matched` ("never a default allow").

**Gates G1–G9** (rung 3; all run even after the first failure):

| Gate | Skippable | Asserts | Codes |
|---|---|---|---|
| G1 consent | never | recorded, unexpired consent for this purpose | CONSENT_MISSING, CONSENT_EXPIRED |
| G2 residency | never | record's domain = tenant's | RESIDENCY_MISMATCH |
| G3 retention | never | inside declared retention window | RETENTION_WINDOW_CLOSED |
| G4 dual_control | never | a second named actor approved this write_id | DUAL_CONTROL_PENDING, DUAL_CONTROL_SAME_ACTOR |
| G5 rate | yes | within per-actor rate | RATE_EXCEEDED |
| G6 budget | yes | within per-period budget | BUDGET_EXHAUSTED |
| G7 counterparty | never | known, not sanctioned | COUNTERPARTY_UNKNOWN, COUNTERPARTY_SANCTIONED |
| G8 schedule | yes | inside operating window | OUTSIDE_SCHEDULE |
| G9 precondition | never | declared record state holds | PRECONDITION_FAILED |

Gate result copy style: *"Precondition (credit limit ₹3,00,000, exposure after this write ₹2,40,000) — passed"*, with the declaration version it ran against.

**Controls and Regulations** (Phase 4, "not built at L1"; label the screens accordingly).
*Control*: control_id `C-AT-01`, control_version, name, statement, owner_role, control_kind preventive·detective·corrective, operating_mode continuous·per_event·periodic, status draft·certified·superseded·withdrawn, coverage {declaration_ref[], write_types[], gates[], actor_kinds[], scope_note}, evidence_expectation {record_fields[], proof_binding_fields[], gate_results_required, refusals_required, approval_record_required, continuity_scope}, test {test_id, assertion, population, exception_handling, on_fail, operated_throughout}, certification {author, certifier ≠ author}.
*Regulation*: regulation_id, version, regime_name, issuer, jurisdiction, instrument_ref, rule_as_at, in_force_from/to, clauses[] {clause_ref, clause_text verbatim, obligation_kind record_keeping·human_oversight·retention·disclosure·segregation·non_repudiation, expects_controls[], disposition, severity blocking·material·advisory}, profile_binding, clause_to_check_map[], min_assurance_level.
**Five-link chain** for a "trace" screen: *regulation clause → control → gate → write type → proof field*.

### 1.5 Evidence objects (L2/L3; label them "L2 — specified, not built")

**Verifier profile** (8 blocks): profile_identity (profile_id, version, regime_name, issuer, jurisdiction, author, certifier, status draft·certified·superseded·withdrawn) · regime_binding[] (clause_ref, clause_text, obligation_kind, binds_write_types, binds_gates, binds_fields, retention_months, check_ids, disposition) · bundle_requirements (required_members, min_assurance_level, proof_binding_fields, redaction_profile, refusals_required, continuity_scope) · checks[] (check_id `C01`, kind integrity·structural·binding·coverage·temporal, statement, pass_condition, on_fail fail_integrity·fail_profile·incomplete) · report_vocabulary · limits_statement (≥ 200 chars, unique, verbatim in every report) · versioning (rule_as_at, applies_to_records_from/_to) · conformance (P1–P12).
First profile: `in-mca-audit-trail v1`, 4 clauses, 6 checks C01–C06, min level 2, applies from 2027-07-01. On an L1 dry run C06 reads *"not_applicable — assurance level 1"*.

**Evidence bundle** `elan1.evidence.bundle.v1`, eight members: `manifest.json`, `seals.jsonl`, `chain.json`, `anchors/`, `keys.json`, `declarations/`, `lexicon/`, `VERIFY.txt` (v2 adds `disclosures.jsonl`).
Manifest: bundle_format, tenant_id, seq_from, seq_to, record_count, refusal_count, assurance_levels[] {level, count, seq_from, seq_to}, continuity_scope full_chain·declared_write_types·range, profile_id/version, redaction_profile, members[] {path, bytes, sha256}, **unanchored_head** ("0 is a value, not an absence"), exported_at, verifier_digest. Bundles are not retained by elan1. Only the export record and manifest digest are kept.

**Verifier exit codes** (never collapsed): `0 PASS` · `0 PASS — payload unbound` · `0 PASS — unsigned, assurance level 1` · `1 FAIL_INTEGRITY` ("forensic, not compliance") · `2 FAIL_PROFILE` ("records trustworthy, regime requirements unmet") · `3 INCOMPLETE` · `4 UNSUPPORTED` · `5 USAGE`. Report sections in this order: Verdict · Claim · Scope · Integrity results (I1–I8: passed / failed / not_applicable — assurance level 1) · Clause results · First failure in full (seq, field, expected, found) · Notes · Limits (verbatim) · Reproduction.

**Anchor batch** (L2): batch_id, tenant, seq range, leaf_count, merkle root, two RFC 3161 tokens (one India-based, eMudhra recommended, plus one of DigiCert/Sectigo/GlobalSign/Entrust), cert paths and revocation data. State machine: `open → closed (at ≤ 15 min or cap 4,096) → anchored (2 tokens) | single_anchor (degraded, not failed) | unanchored/pending`. A late batch is anchored oldest first and never merged. If the two tokens disagree on the root → integrity failure, P0. **Anchoring never refuses a write.**

**Action Receipt** (L3, `action-receipt/1`): format, seal_suite `elan1-seal-v6`, sealed_fields, digest, signature, key_id, anchor {suite `rfc3161-6962`, root, leaf_count, path, token}, issuer, audience, nonce (128 bit), expires_at, envelope_signature (build rec.), disclosure_suite `elan1-sd-v1`, disclosures[], limits. Conformance levels: CL-1 Structural, CL-2 Attested, CL-3 Anchored, CL-4 Addressed, CL-D Disclosing. L1 = CL-1 only.

**Counterparty register** (exists at L1 as the G7 register): org_id, display name, trust-anchor route, accepted key_ids with windows, first seen, status, registered/sanctioned.

**Precedent class / earned autonomy** (L3): class = (tenant_id, write_type, actor_kind, blast_radius). Counters: submitted, refused_by_gate[code], refused_by_policy[rule], escalated, approved_unamended, approved_amended, declined, expired, reversed_in_window, corrected_after_window, sandbox_diverged. `score_v1` returns 0–100 plus inputs and version. Eight eligibility conditions. States: `A2 → eligible → proposed (autonomy.graduate, dual control) → supervised A3 (30 days, 1 in 10 writes to a human) → A3 | auto-reverted to A2 | revoked (one person, one press)`. Refusals are **neutral** in the score.

### 1.6 Packs

A pack is "one declaration, one certified verifier profile and one regime-specific export mapping, aimed at one buyer with one auditor under one dated obligation". It is configuration, and the kernel has no pack table.
**Eleven blocks**: pack_identity (pack_id, version, owner_role, domain sentence) · obligation (regime, issuer, date, clauses) · buyer (signs, budget_line, auditor) · gate_scores (G-A dated hook, G-B named auditor, G-C reversible or declared irreversible, G-D evidence sold separately, G-E we own the write; "probably" scores as fail; kept for ever) · declaration_ref · write_types[] · gates[] · profile_binding · buyer_promise (what it gives **and** what it does not establish) · tests[] T1–T8 · pilot (customer, auditor, 90 days, finding). Build rec. adds approver_model.
**Lifecycle**: `candidate → scored (G-A…G-E) → admitted (governed write, dual control, founder approves) | rejected (portfolio register, by name, "not softened")` → `in build` → `T1–T8` → `certified` → `bound to tenant (governed write; refused if min level > tenant level, shortfall printed)` → `pilot (90 days)` → `live`; later `withdrawn`.
Packs: **ledger1** (MCA Rule 3(1) audit trail; live plan Oct 2027; needs L2), **invoice1** (GST e-invoicing, Apr 2028), **collect1** (RBI collections conduct, Oct 2028, "citations need counsel"). Rejected by name: agri1 (G-B), legal1 (G-E), energy1 (G-E), public1 (G-A, G-D), edu1 (G-D), retail1 (G-B), hr1 (G-A), "a general AI governance product" (G-E).
ledger1 write types: `sales_invoice.submit` (one_counterparty, target_native_undo, dual control > ₹2 lakh), `sales_invoice.cancel` (irreversible after 24 h, always), `purchase_invoice.submit` (> ₹2 lakh), `payment_entry.submit` (compensating, always), `journal_entry.submit` (batch, compensating, always), `customer.update` (one_record, on GSTIN change).

### 1.7 Operational objects

- **Integrity run**: run_id, tenant, started/finished, seq_from/to, record_count, scope, write_types[] ("printed, never implied"), **verdict continuous · break · not_checked**, first_break_seq, field, expected, found, worker_version. A partial run is `not_checked`, "never a partial pass".
- **Reconciliation run** (nightly two-way): checks M1–M5 (§5.4), result per check, period.
- **Incident** (TM §22.7): incident_id, severity P0–P3, class chain_gap · meter_mismatch · key_compromise · tsa · decl_mispublish · isolation · bundle_fail · other, noticed_at (**the clock starts here**), declared_at, certin_due_at (+6 h), certin_decision filed · not_reportable · pending, certin_ref, t_suspect, domains[], seq_ranges per tenant {from, to, state}, contained_at, verified_at, closed_at (only if verified).
- **Erasure case** (DPDP): opened with a 72 h clock → erasure plan shown → approved (irreversible write type, dual control) → salt destroyed, derived artefacts purged → closed; or refused in writing with the statutory obligation and its expiry date named. The verifier then reads "chain intact, payload unbound".
- **Conformance result file**: suite, suite_version, kernelport, assurance_level, tenant, declaration@version, run_at, result, passed/of, tests[] {id, name, result, evidence}, digest.
- **Production-key request**: result file, declaration version, target system, residency domain, named production owner, notice contact → four-check review (mode stated = channels[].mode; every write type reversible or declared irreversible; three outcomes proved incl. a real refusal and a real human-resolved escalation; a named human certified) → issued | refused (8 categories). Promise: 2 working days.
- **Promotion review** (Attested advisory → Enforced, per write type): ≥ 30 days advisory traffic, mechanism (credential custody / token acceptance), C2 bypass proof against the real target, no long-lived credential, rollback drill both paths → new certified declaration version. Boundary date rendered "in both directions". Automatic revert on an unrecorded write.
- **Webhook endpoint**: url, secret (per endpoint), events[], last delivery, failures.

### 1.8 State machines (for status chips)

**Write outcome**: `received → (4xx rejected, no record) | refused @rung n | escalated @rung 4/6 | committed (seq, digest, undo_until +30 d) | committed · proof pending`. Also `reversed` (a new governed write; the fast path or the forward path).

**Obligation** (Fig 11):
```
(rung 6/4 escalate) → OPEN ──outage──▶ OPEN (paused; expiry clock stopped)
OPEN ──approver lacks fresh auth──▶ OPEN (step-up)            [build rec.]
OPEN ──resolve by proposer──▶ OPEN + refusal GATE.DUAL_CONTROL_SAME_ACTOR ("Send to")
OPEN ──resolve by agent token──▶ OPEN + refusal
OPEN ──approve (human ≠ proposer)──▶ APPROVED ──resubmit (new intent_id, obligation_ref)──▶ COMMITTED | REFUSED (gate changed / SANDBOX_DIVERGED → "approved, write not done")
OPEN ──reject + reason──▶ DECLINED (original refuses POLICY.APPROVAL_DECLINED; never resubmitted)
OPEN ──expires_at + paused_seconds passes──▶ EXPIRED (POLICY.OBLIGATION_EXPIRED, own proof entry)
OPEN ──send-to / extend──▶ OPEN                                  [build rec.]
```
Records for one approved decision: escalation `#4,099` → resolution `#4,100` → commit `#4,101` (meter 0, 0, 1).

**Declaration**: draft → validated → simulated → certified → compiled → resolvable → superseded | withdrawn.
**Tenant**: provisioning → live ⇄ stopped (reason class) ; L1 → (upgrade stages 0–5) → L2 ; mode per write type advisory → enforced (→ reverted).
**L1→L2 upgrade**: 0 Pre-flight → 1 Key (bound, signing off) → **2 Signing on (irreversible; seq B)** → 3 Anchoring on → 4 Profile installed → 5 First bundle → Closed (a governed record). Rollback after stage 2 leaves a "signed island".
**Key (L2)**: generated → registered (dual control; valid_from ≥ 24 h ahead) → active → retired | revoked (T_suspect; declared unsigned interval).
**Anchor batch**: open → closed → anchored | single_anchor | unanchored → (late) anchored.
**Billing period**: `OPEN → CLOSING (period end + 24 h) → RECONCILED → RATED → INVOICED`; `CLOSING → BLOCKED (any M1–M4 ≠ 0; pages; tenant told "period open") → fixed → RECONCILED`.
**Export (L2)**: requested → prepared (resolve decls) → gate check (residency, retention, consent, precondition = clean nightly run) → assembled (manifest last) → ready | refused (with an offer: in-domain endpoint / clean range / two sub-ranges / suggested split).
**Incident**: notice → declare → first response → contain (tenant/domain stop, verified by an attempted write) → communicate (P0/P1 every 30 min) → preserve → verify → close → post-incident note (5 working days).
**Profile / Control / Regulation**: draft → certified → superseded | withdrawn.
**Chain continuity (always three-valued)**: continuous · break at seq N · not checked over this range, with scope and count printed. Never a bare green tick.

---

## 2. API, SDK and MCP surface

### 2.1 KernelPort — six calls (TM §4.5)

| # | Call | Token | Changes a record? | Idempotency | Request | Response |
|---|---|---|---|---|---|---|
| 1 | **define** | control (ctl) | no (a governed registration write under dual control) | (declaration_id, version, compiled_digest) | `declaration` (7 blocks), `version` (= last+1), `certifier_id`, `supersedes?` | `declaration_id`, `version`, `compiled_digest`, `write_types[]` (name, meter basis, blast radius) |
| 2 | **assert** | tenant `act` | **yes — the only call that can** | intent_id | WriteIntent | `outcome`, `decision`, `record {seq, digest, assurance_level}`, `record_id`, `record_version`, `undo_until` (commit only), `operator_action` (refusal), header `X-Kernel-Port: v1` |
| 3 | **seal** | kernel only (not exported) | no | write_id | write_id | `seq`, `digest`, `assurance_level` |
| 4 | **verify** | tenant `ro` | no, never metered | natural | `seq_from`, `seq_to` | `result pass·fail·not_checked`, `range`, `records_checked`, `write_types`, `failure {seq, field, reason}` |
| 5 | **scope** | tenant `ro` | no; advisory | natural | `actor_id`, `write_types[]` | `declaration_version`, `permitted[] {write_type, blast_radius, autonomy_level, reaches: rung7·approval·none, dual_control}` |
| 6 | **refuse** | tenant `act` / kernel | no | write_id | `code`, `context` | refusal outcome (full record, quantity 0, HTTP 200) |

define errors: POLICY.DECLARATION_INVALID (first failing rule, block and field), POLICY.VERSION_NOT_SEQUENTIAL, POLICY.NOT_CERTIFIED, PLATFORM.REGISTRY_UNAVAILABLE. `verify` at L1: *"At L1, verify requires us"*, and the product must say that to the customer.

Example responses (TM §4.5.3):
```json
{ "outcome": "committed",
  "decision": { "write_id": "0b7e…", "disposition": "allow", "rung": 7,
    "policy_version": 11, "declaration_version": 7, "autonomy_level": "A4",
    "blast_radius": "one_counterparty",
    "gate_results": [{ "name": "consent", "outcome": "pass", "inputs_hash": "…" }],
    "reversal_plan": { "method": "compensating_entry", "window_hours": 720 } },
  "record": { "seq": 4097, "digest": "9f2c…", "assurance_level": 1 },
  "record_id": "5d0a…", "record_version": 3, "undo_until": "2027-08-14T10:02:11Z" }

{ "outcome": "refused",
  "decision": { "write_id": "7c41…", "disposition": "refuse", "rung": 3,
    "code": "GATE.PRECONDITION_FAILED", "gate": "precondition",
    "policy_version": 11, "declaration_version": 7, "autonomy_level": "A3",
    "gate_results": ["…every declared gate, pass or fail…"] },
  "operator_action": "Fix the record state",
  "record": { "seq": 4098, "digest": "…", "assurance_level": 1 },
  "record_id": "00000000-0000-0000-0000-000000000000", "record_version": 0 }

{ "outcome": "escalated",
  "decision": { "write_id": "e2a9…", "disposition": "escalate", "rung": 6,
    "policy_version": 11, "declaration_version": 7, "autonomy_level": "A2",
    "obligation": { "obligation_id": "ob_91…", "expires_at": "…",
                    "resolver_roles": ["ar-approvers"] } },
  "record": { "seq": 4099, "digest": "…", "assurance_level": 1 } }
```

### 2.2 HTTP API (TM §6.6, §8.11)

| Path | Class | Serves |
|---|---|---|
| `/v1/writes` | act | submit (= assert), read, list governed writes; `GET /v1/writes/{write_id}` (poll ≥ 10 s) |
| `/v1/writes/{write_id}/outcome` | act | Mode B caller reports it performed the write (build rec.; sets the caller-performed flag) |
| `/v1/obligations` | act | queue and approvals (7 endpoints, below) |
| `/v1/records` | ro | governed records and versions |
| `/v1/evidence` | ro | proof entries and chain continuity; **pages by seq** |
| `/v1/meter` | ro | events, totals, reconciliation |
| `/v1/declarations` | ctl | author, validate, simulate, certify, publish |
| `/v1/actors` | ctl | actors, delegations, autonomy grants |
| `/v1/tenants` | ctl | config, stop, residency, keys |
| `/v1/versions` | — | port major, schema major, register version, live policy version |
| `/v1/scope` | ro | build rec. |
| `/v1/ops` | ops | 8 endpoints: health per service/zone; SLOs; the three zero-numbers; outbox-to-record lag per domain; anchor batch status; nightly reconciliation report; eval history; grant-catalogue diff |

Obligation endpoints (build rec.): `GET /v1/obligations?status=open&resolver=me` · `GET /v1/obligations/{id}` · `GET /v1/obligations/{id}/surface` · `POST /v1/obligations/{id}/resolve` (= act.escalate; idempotency_key) · `POST /v1/obligations/{id}/send-to` · `POST /v1/obligations/{id}/extend` · `GET /v1/obligations/{id}/history`.

**Error taxonomy** (TM §6.6):

| Kind | HTTP | Proof entry | Meter | Retry |
|---|---|---|---|---|
| Refusal | 200, `outcome: refused` + code, rung, gate, every gate result, seq, digest | yes | 0 | **never** |
| Escalation | 200, `outcome: escalated` + obligation_id | yes | 0 | never; wait |
| Rejection (malformed, "latest", cross-tenant body) | 4xx | no | no | only after fixing |
| Throttle | 429 + `Retry-After` | no | no | yes, back-off |
| Platform failure | 5xx, or 200 with `PLATFORM.*` if the kernel was reached | refusal only | 0 (not billed) | yes, same key |
| Tenant stopped | 200, POLICY.TENANT_STOPPED | **no** (the only refusal without one) | no | no |

Headers: `X-Kernel-Port: v1`, `X-RateLimit-Limit/-Remaining/-Reset`, `Retry-After`, `Idempotency-Key`, and `Deprecation`/`Sunset` on superseded majors (12-month sunset; 410 after Sunset). Retry policy: 5xx and 429 only, exponential back-off with jitter, at most 5 attempts, same key. Keys are retained 30 days, and "a repeated key returns the original outcome, including seq and digest".

### 2.3 Webhooks (TM §6.6)

Events: `write.committed` · `write.refused` · `write.escalated` · `obligation.resolved` · `obligation.expired` · `declaration.certified` · `tenant.stopped`. Signed HMAC over the body using a per-endpoint secret. Headers `X-Elan1-Signature` and `X-Elan1-Timestamp`, with a 5-minute window (build rec.: adopt the Standard Webhooks scheme). Delivery is at least once, so consumers are idempotent on write_id. Every write payload carries **seq + digest**, so a consumer can detect gaps from seq contiguity. *"A consumer that only handles the committed case will silently lose writes."*
Sample payload (build rec. envelope):
```json
{ "type": "write.escalated", "id": "evt_01J…", "tenant_id": "3f9a1c2e-…",
  "created_at": "2027-09-30T12:31:07Z",
  "data": { "write_id": "e2a9…", "obligation_id": "ob_91…", "autonomy_level": "A2",
            "expires_at": "2027-09-30T16:31:07Z", "seq": 7301, "digest": "c41e…" } }
```

### 2.4 MCP server (TM §6.5)

34 tools in Phase 1: **18 `ro`, 10 `stage`, 6 `act`**. The TM names seven of them:

| Tool | Scope | Args | Returns |
|---|---|---|---|
| `read.records` | ro | {type, filter, as_of?} | permission-filtered rows |
| `read.evidence` | ro | {seq_from, seq_to} | proof entries |
| `read.declaration` | ro | {declaration_id, version?} | the seven blocks |
| `read.meter` | ro | {period} | events and totals |
| `stage.write` | stage | {write_type, payload, as_of} | request object, validated, no side effects |
| `act.write` | act | {request, idempotency_key} | committed · refused · escalated |
| `act.escalate` | act | {obligation_id, decision, note} | resolution (refused from any agent token) |

Protocol: MCP revision 2026-07-28 (stateless). Authentication is an OAuth 2.1 bearer tenant token. Every tool in `tools/list` carries `_meta`: `elan1/declaration` (e.g. `d-acme-billing@7`), `elan1/description_sha256`, `elan1/scope`. Refusals return `isError: false`, because an error "invites the agent's framework to retry". Agent text shown: *"Staged. No side effects. Submit with act.write."* / *"Refused at precondition. Do not retry. Credit limit exceeded."*

### 2.5 SDK snippets (for the developer portal)

Packages: `@elan1/kernel` (TypeScript, Node 20+) and `elan1-kernel` (Python 3.12, import `elan1_kernelport`). The package major is the port major (`kernelport/v1`). `seal` is not exported.

**TypeScript — submit a governed write**
```ts
import { KernelClient } from "@elan1/kernel";
import { v5 as uuidv5 } from "uuid";

const k = new KernelClient({ token: process.env.ELAN1_TENANT_TOKEN!, port: "v1" });

const s = await k.scope({ actor_id: agentId, write_types: ["sales_invoice.submit"] });
if (s.permitted[0].reaches === "none") return renderNotAvailable();

const res = await k.assert({
  intent_id: uuidv5(changesetKey, TENANT_NS), tenant_id, declaration_id,
  declaration_version: 7,                 // explicit integer, never "latest"
  write_type: "sales_invoice.submit",
  actor_id: agentId, actor_kind: "agent", channel: "api",
  subject: null, payload, as_of: businessInstant,
});

switch (res.outcome) {
  case "committed": return showDone(res.record.seq, res.undo_until);
  case "escalated": return awaitObligation(res.decision.obligation!.obligation_id);
  case "refused":
    return res.decision.code.startsWith("PLATFORM.")
      ? retryLater(res)            // our failure: same intent_id
      : showOperatorAction(res);   // never retry a governed refusal
}
```

**Python — inside a workflow activity**
```python
from elan1_kernelport import KernelClient, Committed, Escalated, Refused

k = KernelClient(token=tenant_token, port="v1", timeout_s=5.0)

res = k.assert_(intent)          # 'assert' is reserved in Python; wire name is assert
match res:
    case Committed(record=r, undo_until=u):
        return {"seq": r.seq, "undo_until": u}
    case Escalated(decision=d):
        return {"await": d.obligation.obligation_id}   # wait for obligation.resolved
    case Refused(decision=d) if d.code.startswith("PLATFORM."):
        raise RetryableKernelFailure(d.code)           # retried with the same intent_id
    case Refused(decision=d):
        return {"refused": d.code, "action": res.operator_action}
```

**Resubmit after approval** (new intent_id with obligation_ref, "resubmit, never resume"):
```python
again = intent.resubmission(obligation_ref=obligation_id)   # new intent_id
res = k.assert_(again)
```

**Verify a chain segment**
```ts
const v = await k.verify({ seq_from: 1, seq_to: 10000 });
// { result: "fail", records_checked: 5003, write_types: 7,
//   failure: { seq: 5004, field: "F03 prev_digest", reason: "does not equal digest(seq 5003)" } }
```

**curl — Mode B**
```bash
curl -s https://api.in.elan1.example/v1/writes \
  -H "Authorization: Bearer $ELAN1_TENANT_TOKEN" \
  -H "Idempotency-Key: acme-inv-2027-08-14-0012" \
  -H "Content-Type: application/json" \
  -d '{"request":{"request_id":"rq_7f…"}}'
# HTTP/1.1 200 OK   X-Kernel-Port: v1
# {"outcome":"refused","code":"GATE.PRECONDITION_FAILED","rung":3,"seq":4098,...}
```

**Webhook verification (Python)**
```python
import hmac, hashlib, time
def verify(body: bytes, sig: str, ts: str, secret: bytes) -> bool:
    if abs(time.time() - int(ts)) > 300: return False          # 5-minute window
    mac = hmac.new(secret, f"{ts}.".encode() + body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(mac, sig)
```
(The exact signing string is open, E05 OQ1. Show it as "Standard Webhooks" style.)

**Fail-closed Mode B wrapper** (TM §22.3.2): timeout means refuse; no cached allow, no local gate; raise `KernelUnavailable` ("The caller MUST NOT write").

### 2.6 Versioning surfaced to developers

A new optional field ships without notice. A new refusal code needs 30 days internal / **60 days external** notice, with the operator action published first. A new required field means a new port major (12 months). A change to rung order means 12 months plus a published argument. The 16 fields cannot change at v1. Codes are never renumbered or reused. Anti-degradation: a deprecated version is never slowed, rate-limited or given worse errors.

### 2.7 Conformance C1–C14 (developer portal checklist)

C1 import graph · C2 bypass attempt · C3 rung completeness (100 intents) · C4 determinism replay · C5 fail-closed matrix · C6 missing grant → A0 (1,000 fuzzed) · C7 idempotency · C8 refusal shape (HTTP 200, code, rung, zeroed record, qty 0) · C9 chain integrity (10,000 records; flipped octet, reordered pair, duplicate, gap) · C10 meter reconciliation · C11 approval separation · C12 rollback drill, both paths · C13 version pinning · C14 claim boundary (string check over rendered copy). *"The suite is the claim."* The result file is a required attachment to a production-key request. C1 and C2 run first. A run with no real refusal "did not exercise the product".

---

## 3. Refusal register and gate list (as in the TM)

The register is closed: **43 codes (policy 14, gate 19, platform 10), 28 active at L1** [E02 §06]. The TM's L1 table enumerates 32 and `define` adds 3 (the count inconsistency is noted in TM §4.6.3). All refusals return HTTP 200 with `outcome: refused` and a full record with record_id zeroed. The one exception is TENANT_STOPPED, which writes none. All meter at 0. **Every PLATFORM.\* code pages and is not billable.** "Plain title" below is our UI label. *Means* and *Operator action* are verbatim.

| Code | Class | Rung | Plain title (UI) | Means | Operator action |
|---|---|---|---|---|---|
| POLICY.TENANT_STOPPED | policy | 0b | Writes are paused | The tenant is stopped | Resolve the stop event; it names its cause class |
| POLICY.ACTOR_NOT_PERMITTED | policy | 1 | Not permitted for this actor | permissions does not grant this actor kind this write type | Grant it in a new declaration version, or resubmit as a permitted actor |
| POLICY.DELEGATION_INVALID | policy | 1 | Delegation not live | on_behalf_of is not a live delegation | Renew the delegation |
| POLICY.WRITE_TYPE_UNKNOWN | policy | 2 | Unknown write type | Not in write_types at that version | Publish a version that declares it |
| POLICY.CHANNEL_NOT_PERMITTED | policy | 2 | Not allowed on this channel | channels does not carry this write type | Use a permitted channel or declare this one |
| POLICY.DECLARATION_UNRESOLVED | policy | 2 | Declaration version not available | Version absent or uncertified | Certify it |
| POLICY.DENIED_BY_RULE | policy | 4 | Denied by rule | A named rule denied at policy_version | Read the named rule; change the request or the rule |
| POLICY.NO_RULE_MATCHED | policy | 4 | No rule covers this | No rule covers this case | Author a rule. Never widen a default |
| POLICY.BLAST_RADIUS_EXCEEDED | policy | 5 | Wider than declared | Wider than declared | Narrow the request, or raise the declared radius (forces dual control) |
| POLICY.AUTONOMY_INSUFFICIENT | policy | 6 | Autonomy too low | Grant below what this write type needs | Raise the grant (a governed write) or route to approval |
| POLICY.APPROVAL_DECLINED | policy | 6 | Approver rejected | An approver declined | Address the approver's basis and resubmit |
| POLICY.OBLIGATION_EXPIRED | policy | 6 | Approval expired | The escalation expired unresolved | Resubmit; expiry is itself a recorded governed event |
| GATE.CONSENT_MISSING | gate | 3 (G1) | No consent | No consent covers this purpose | Capture consent |
| GATE.CONSENT_EXPIRED | gate | 3 (G1) | Consent lapsed | Consent lapsed | Re-capture |
| GATE.RESIDENCY_MISMATCH | gate | 3 (G2) | Outside residency | Record's residency domain ≠ tenant's | Never override. Escalate to the residency runbook |
| GATE.RETENTION_WINDOW_CLOSED | gate | 3 (G3) | Outside retention window | Record outside its declared retention window | Do not write. Check the retention declaration |
| GATE.DUAL_CONTROL_PENDING | gate | 3 (G4) | Waiting for a second approver | No second approver yet | Request approval |
| GATE.DUAL_CONTROL_SAME_ACTOR | gate | 3 (G4) | You proposed this | Approver equals requester | Find a second named actor |
| GATE.RATE_EXCEEDED | gate | 3 (G5) | Rate limit reached | Above the declared per-actor rate | Wait, or raise the declared rate |
| GATE.BUDGET_EXHAUSTED | gate | 3 (G6) | Budget used up | Above the declared per-period budget | Raise the budget; never truncate silently |
| GATE.COUNTERPARTY_UNKNOWN | gate | 3 (G7) | Unknown counterparty | Counterparty not registered | Register it |
| GATE.COUNTERPARTY_SANCTIONED | gate | 3 (G7) | Sanctioned counterparty | Counterparty on a sanctions list | Never override. Escalate to compliance |
| GATE.OUTSIDE_SCHEDULE | gate | 3 (G8) | Outside operating window | Outside the declared operating window | Wait, or change the window |
| GATE.PRECONDITION_FAILED | gate | 3 (G9) | Record state does not allow this | A declared record state does not hold | Fix the record state |
| GATE.SANDBOX_DIVERGED | gate* | 3, raised at 7 | Live result differed from rehearsal | Live re-run disagreed with the sandbox result | Snapshot restored. Investigate before resubmitting |
| PLATFORM.REGISTRY_UNAVAILABLE | platform | 2 | We could not load the rules | Declaration registry down | Page. Retry with the same intent_id |
| PLATFORM.POLICY_UNAVAILABLE | platform | 4 | We could not evaluate the rules | Rule engine down | Page. Never fall back to a default allow |
| PLATFORM.TARGET_UNREACHABLE | platform | 7 | System of record unreachable | Target system unreachable | Page. Nothing was applied |
| PLATFORM.TOKEN_MINT_FAILED | platform | 7 | Could not get a write credential | Could not mint the short-lived credential | Page |
| PLATFORM.WRITER_LOCK_LOST | platform | 7 | Writer interrupted | Single-writer lock lost | Page. Snapshot restored |
| PLATFORM.LOG_APPEND_FAILED | platform | 8 | Proof write delayed | Chain append failed | Page. Outbox retries in order |
| PLATFORM.CHAIN_HEAD_CONFLICT | platform | 8 | Two chain writers (P0) | Two chain writers for one tenant | P0. Stop the tenant |

\* SANDBOX_DIVERGED: whether it is gate or platform class is open (E02 OQ3). The TM lists it as gate class, raised at rung 7.

`define` only: **POLICY.DECLARATION_INVALID** (first failing rule, block and field), **POLICY.VERSION_NOT_SEQUENTIAL**, **POLICY.NOT_CERTIFIED**.
Proposed (build rec.): **PLATFORM.AUTONOMY_UNAVAILABLE** (rung 6).
L3 additions (through the register procedure, label "L3 — specified"): POLICY.RECEIPT_AUDIENCE_MISMATCH, POLICY.RECEIPT_EXPIRED, POLICY.TRUST_ANCHOR_UNKNOWN, POLICY.RECEIPT_UNVERIFIED, GATE.RECEIPT_REPLAYED, POLICY.AUTONOMY_NOT_EARNED.
Not in the kernel register: rung1 Voice `VOICE_*` channel codes (VOICE_VALUE_CEILING, VOICE_DUAL_CONTROL_REQUIRED, VOICE_APPROVER_IS_REQUESTER), rung1 `APPROVAL_EXPIRED` and `GATE_AUDIT_TRAIL_DISABLED`, and verna1's sixteen collection reasons.

**Refusal copy rules** (TM §4.5.3):
- The operator action is shown "in the words of the declaration's surface plan — never a stack trace, never a raw code alone".
- A gate-class refusal names the gate. A policy-class refusal names the rule version.
- A platform-class refusal says: **"We could not complete this. Nothing was changed. We have been paged."**
- Examples of the "Not done" style: *"Not done — period closed"*. Same actor: *"You proposed this, so you cannot also approve it. Send it to: [names]"* (never "insufficient permissions").
- Every refusal lists **all** gate results, not only the failure. The console always gets the full list. A token scoped to another write type may receive only the first failing gate (build rec.).

**Other code families the UI must show**
- Encoder errors (seal implementation; ops screens only): E_FIELD_MISSING, E_FIELD_NULL, E_UUID_FORM, E_INT_RANGE, E_STRING_LENGTH, E_ENUM_TOKEN, E_TIMESTAMP_FORM, E_DIGEST_LENGTH.
- Verifier exit codes 0–5 (§1.5). Receipt verdicts: UNSUPPORTED, AUDIENCE_MISMATCH, EXPIRED, FAIL_INTEGRITY, TRUST_ANCHOR_UNKNOWN, UNANCHORED (reported, not failed), REPLAYED, REVOKED.

---

## 4. Operations: runtime health and status

### 4.1 SLOs and targets (TM §22.2). Three kinds that must never be mixed on one dashboard

| # | Indicator | Target | Class | Level |
|---|---|---|---|---|
| 1 | Governed write, kernel-side, p50 | ≤ 120 ms | MEASURE THIS | L1 |
| 2 | Governed write, kernel-side, p99 | ≤ 450 ms | MEASURE THIS (kill criterion at 10 partners) | L1 |
| 3 | Rungs 0b–9 sum, p50 | ≈ 64 ms (0b–2: 4 · 3: 8 · 4: 12 · 5–6: 8 · 7: 18 · 8: 12 · 9: 2) | design target | L1 |
| 4 | Sandbox + live applies (hosted ERPNext), p95 | ≤ 1,200 ms | design target | L1 |
| 5 | Governed write end to end incl. target, p95 | ≤ 2 s | MEASURE THIS | L1 |
| 6 | Proof record write (rung 8), p50 | ≤ 40 ms | MEASURE THIS | L1 |
| 7 | Outbox → record lag, p99 | ≤ 2 s | estimate | L1 |
| 8 | Mode B contract call, p95, excl. target | ≤ 40 ms | MEASURE THIS | L1 |
| 9 | Meter lag, p99 | ≤ 30 s | MEASURE THIS | L1 |
| 10 | Sandbox key → usable tenant | < 60 s, p95 published | readiness | L1 GA |
| 11 | Committed writes without a chained record | **0** | invariant | L1 |
| 12 | Records mutated outside the writer | **0** | invariant | L1 |
| 13 | Meter events without a write; refusals with qty ≠ 0 | **0** | invariant | L1 |
| 14 | Anchor interval (unanchored age) | ≤ 15 min per tier | published SLO | L2 |
| 15 | Bundle build, 10,000 records | ≤ 60 s | estimate | L2 |
| 16 | Offline verify, 10,000 records | ≤ 5 s | estimate | L2 |
| 17 | KMS Sign calls without a record (and reverse) | **0** | invariant | L2 |

Mode A added latency ≤ 15 ms (target). stack1 runtime: 99.5% monthly per contract. rung1 console: 99.9%. **The kernel has no availability target.** Build rec.: publish an indicator from a per-minute synthetic governed write that must return a sealed refusal with the expected code ("the golden write, not just a 200"), with no promise until a quarter of data exists. **Invariants have no error budget:** "a correctness claim with a budget is one we have already decided to break."

### 4.2 Status page components (public `/status`)

Per component: **Submission (write API/MCP)**, **Gates / rule engine**, **Single writer**, **Chain integrity** (its own component; "a missed nightly integrity job flips the component without anyone pressing anything", driven by a dead-man signal), **Meter**, **Console**, **Sandbox key issuance**. At L2 add **Signing (KMS)** and **Anchoring (TSA A / TSA B)**. Incident history is "never edited". Chain-integrity states: Continuous · Break detected · Not checked (job missed).

### 4.3 Health signals and alerting (TM §22.4–22.5)

**Pages** (wake someone): outbox-to-record lag over SLO · any non-zero on the three invariants · anchor service unable to reach a TSA for 2 consecutive intervals (L2) · platform-class refusal rate above baseline, and every platform refusal · an eval failure · invoice reconciliation that cannot complete or shows a discrepancy.
**Tickets**: write API latency incl. p99 · bundle build time · Studio availability · connector failures · meter-line divergence in the nightly report.
Governing rule: *"Evidence integrity pages; latency does not. A seal worker that is behind is an incident. A write API at p99 is a ticket."*

Nightly jobs (each is a health row): chain integrity (seq contiguous from 1, prev_digest, recompute) · two-way reconciliation (write↔record↔meter) · refusal replay (determinism) · KMS Sign reconciliation (L2) · anchor lag (L2). Each pings a dead-man switch on success, and silence pages.

Telemetry privacy: spans may carry only `elan1.tenant_ref` (hashed), rung, write_type, decl_version, policy_version, outcome, refusal_code and actor_kind. **Never** payload, subject, record_id, actor_id, counterparty, comments, idempotency keys or tokens. Logs are kept 180 days in India, with no PII.

### 4.4 Severity ladder and incident classes

| Sev | Definition | First response | Contain/restore | Woken |
|---|---|---|---|---|
| P0 | Evidence integrity or security: broken link / seq gap; committed write with no record; record mutated; CHAIN_HEAD_CONFLICT; a write that proceeded with no decision; key compromise / unaccounted KMS Sign; TSA tokens disagree; tenant isolation breach | 15 min 24×7 | tenant/domain stopped inside first response; CERT-In clock | primary, secondary, elan1 lead, founder |
| P1 | Kernel unavailable to tenants (platform refusals above baseline); outbox lag over SLO; a declaration resolving wrongly; an Enforced write type with an unrecorded write; period-close block | 15 min in hours / 30 min out | 4 h | primary |
| P2 | Degraded: one TSA failing 2 intervals; latency SLO breached > 1 h; nightly job late; sandbox provisioning over p95 | 2 business hours | 1 business day | primary |
| P3 | Questions, docs, workaround exists | 1 business day | 5 business days | nobody |

A P1 open at 4 h becomes a P0 for notification. A P0 without a published note is itself a P1.
Runbooks (the list is also the incident-class enum): RB1 record writer behind · RB2 anchor service can't reach a TSA (L2) · RB3 write committed without a record · RB4 record mutated outside the kernel · RB5 planned key rotation (L2) · RB6 key compromise (L2) · RB7 tenant must be stopped · RB8 erasure request · RB9 bundle fails at a customer (L2) · RB10 declaration version must be withdrawn · RB11 residency migration rehearsal · RB12 break-glass access. Rule: **"an incident cannot be closed on a theory"**. The last runbook step is a command with an expected output. A lost record is **never back-filled**: a *gap record* is written instead ("A documented gap is recoverable. An undocumented one is indistinguishable from tampering, forever").

### 4.5 Fail-closed matrix (a runtime-health "dependency" table)

| Dependency down | Rung | Code | Behaviour | Pages |
|---|---|---|---|---|
| Tenant stopped (deliberate) | 0b | POLICY.TENANT_STOPPED | refuse, no chain entry | no |
| Declaration registry | 2 | PLATFORM.REGISTRY_UNAVAILABLE | refuse at write door | yes |
| Rule engine | 4 | PLATFORM.POLICY_UNAVAILABLE | refuse, never default allow | yes |
| Autonomy table | 6 | (proposed PLATFORM.AUTONOMY_UNAVAILABLE) | refuse | yes |
| Credential broker | 7 | PLATFORM.TOKEN_MINT_FAILED | refuse | yes |
| Target after sandbox | 7 | PLATFORM.TARGET_UNREACHABLE | nothing reaches live | yes |
| Writer lock | 7 | PLATFORM.WRITER_LOCK_LOST | snapshot restored | yes |
| Chain append | 8 | PLATFORM.LOG_APPEND_FAILED | committed, proof pending; outbox retries | yes |
| Two chain writers | 8 | PLATFORM.CHAIN_HEAD_CONFLICT | P0, tenant stopped | yes |
| KMS at a key cut (L2) | 8 | platform class | domain refuses writes | yes |
| TSA(s) (L2) | — | none | never refuses; `single_anchor`; banner at 4 intervals | at 2 intervals |

Consumer copy when the kernel is unreachable: Mode A: *"We cannot check this change right now. Nothing was changed."* (rung1: *"We cannot apply changes right now. Your site has not been touched."*). Mode B must never say "blocked" or "prevented".

### 4.6 Stop switch (TM §5.2, §22.3.4)

The rung-0b stop set holds the tenant kill switch, revocation, blacklist and regulator directive. Setting a stop is a **dual-control governed write** on the Tenants screen, with its own record. A stopped tenant's refusals are the only ones without a chain entry. The stop holds **writes, not reads**: verify and exports continue. The stop must be **verified, not assumed**, by attempting a write and expecting POLICY.TENANT_STOPPED. User copy: **"Writes are paused for this organisation"**. PLATFORM.CHAIN_HEAD_CONFLICT sets it automatically. An integrity break sets it (build rec.). Pilot entitlement exhaustion sets it with reason `entitlement_exhausted` (build rec.).

### 4.7 Sandbox, shadow sandbox and modes (never abbreviate both to "sandbox")

| Term | Meaning | UI treatment |
|---|---|---|
| **Sandbox key / sandbox tenant** (`sk_sbx_`) | developer's isolated tenant with synthetic fixtures; own chain `mode: sandbox`; meter 0; 10/min, 2 concurrent, 5,000/month | environment badge "Sandbox"; every proof entry marked `mode: sandbox` |
| **Shadow sandbox** | the per-write snapshot rehearsal inside every production governed write at rung 7 | show as a step in the write timeline ("Rehearsed in shadow sandbox → applied to live") |
| **Reference tenant** | fixtures and an adversarial declaration for conformance | "ref-in-01" |
| **Enforced** | kernel holds the credential (Mode A, credential custody or token acceptance). May say: *"This write could not have occurred without passing the gates."* | per channel × write type badge |
| **Attested advisory** | caller holds the credential (Mode B default). May say: *"Every attempt is evaluated and recorded, including the ones we refused."* May **not** say "we block", "we prevent", "cannot", "nothing gets through without us" | badge + the caller-performed flag on records; `acted_unattested` state |

"Shadow mode" in the brief means Attested advisory plus the promotion review (≥ 30 days of advisory traffic before Enforced). Environments are dev · ci · stage · prod ("no fifth"). The change window is Tue/Thu 21:00–23:00 IST.

### 4.8 Residency regions and retention

Phase 1: **one residency domain `in` = ap-south-1 Mumbai, 3 AZs**, synchronous standby in a second AZ, **no second region, including for DR**, until counsel confirms. Future: Gulf not before 1 Apr 2028, EU not before 1 Apr 2029, no US before ₹80 crore ARR. Each is a new residency domain with a new signing key. Proof records never cross a region. G2 residency is never skippable, and GATE.RESIDENCY_MISMATCH has no override.
Hosting profiles: **H1** hosted shared domain (default) · **H2** dedicated domain (Enterprise) · **H3** customer-held keys (L3) · **H4** customer-hosted sovereign · **H5** air-gapped (L1 unless a TSA path exists).
Retention: chain and anchors indefinite (never below MCA's 8 years; O05 says 7, a conflict) · declarations, profiles and lexicons for ever · idempotency keys 30 d · snapshots 30 d · security logs ≥ 1 yr (180 d in India) · app logs 180 d · bundles not retained.
Backups: PITR, nightly encrypted 30 d, quarterly restore drill that re-verifies a sample. **RPO/RTO not yet set.** Proposed: chain RPO 0 / RTO ≤ 30 min for AZ loss; meter ≤ 15 min / ≤ 2 h; region loss undefined.
CERT-In clocks: **6 h** to report (from noticing) · key-compromise notice 24 h · tenant update 72 h · erasure 72 h · post-incident note 5 working days.

---

## 5. Metering and billing mechanics

### 5.1 Unit and basis

**Governed Action** = one committed write to a system of record, "permitted, executed, recorded and billed — the same unit at all four points": *one row in the chain, one meter event, one invoice line, one thing an auditor can open.* It is never per model step, tool call or retry.
Basis mapping (normative, never negotiable): one_record → per record · one_counterparty → per counterparty · batch → per batch · tenant → per tenant · cross_boundary → per crossing. Rejection script: *"The basis is not a pricing parameter. Here is the mapping."*

### 5.2 What produces a meter event (TM §19.3)

| Outcome | HTTP | Record | Meter event | Billable |
|---|---|---|---|---|
| Committed | 200 | yes | qty 1 | yes |
| Refusal POLICY/GATE | 200 | yes, zeroed | qty 0 | never |
| Escalation | 200 | yes | qty 0 | no |
| G5/G6 declared limit | 200 | yes | qty 0 | no |
| PLATFORM.* after the kernel was reached | 5xx / 200 | yes, platform class | qty 0 carrying code (build rec.) | no |
| Tenant stopped | 200 | **no** | no | — |
| Rejection 4xx / throttle 429 | 4xx / 429 | no | no | — |
| Idempotent repeat | 200 original | no new | no second | — |
| verify, scope, reads, polls | 200 | no | never | — |
| Sandbox-key write | 200 | yes, `mode: sandbox` | qty 0 | never |
| Approval, define, evidence export | 200 | yes | qty 0, `meter_class` ≠ governed_action | no ("charging for the control undermines the control") |
| Offline verification | — | — | never | the verifier is free |

### 5.3 Quantity-zero rule, three layers

The caller never supplies a quantity. A database CHECK refuses a non-zero refusal row (`refusal_meters_zero`). Nightly reconciliation asserts it anyway. The CFO question "are you incentivised to make the system say no?" is answered by "a constraint, not a policy". Refusals were once billed at 0.3×. The founder overruled that, to be revisited "only if a customer shows us refusal-farming".

### 5.4 Reconciliation (nightly, two-way; C10)

M1 meter events with no proof record · M2 proof records with no meter event · M3 outcome disagreement (zeroed record ↔ non-committed meter) · M4 non-zero quantity on anything but a committed production action · M5 committed changes in the target with no record (E11 test 3; the only check that catches writes around the kernel).
The first two write↔record lines non-zero = **P0**. Meter-line divergence = billing incident and ticket. At period close it **blocks the invoice and pages**. Kernel vs rung1 credit ledger: zero tolerance, "the kernel is right and the ledger is a display defect". Unresolved at invoice time: bill the lower number and carry the gap as a named open item with an owner and a date. A correction is a new `meter_adjustment` row (references event_id, reason code, named approver, dual control), never an update.

### 5.5 Rating and the invoice

Aggregation grain: tenant × period × meter_class × outcome × mode × key_class × write_type × pack_id, with the seq range per cell. Periods are cut in **IST**. Rating is deterministic. Price books are effective-dated tables, never code constants. Lines:
1. **Platform floor** (never discountable).
2. **Governed actions — included** (qty, ₹0, trace = seq ranges).
3. **Governed actions — overage** (qty × rate).
4. **Refused — count at ₹0**, always shown on the face ("412 refused, ₹0").
5. Entitlement lines: pack (per tenant per year), verifier profile (per regime per year), evidence (L2+), counterparty seats (L3).
6. Discounts: each has an end date. The elan1 lead may grant ≤ 20% for ≤ 12 months; the founder is unlimited. **Never on floor, basis, refusal or evidence.**

Every line has **"Show the records behind this line"**, which opens each event by write_id and seq through `/v1/evidence`. A disputed line holds only that seq range, and the rest proceeds. The dispute is settled against the proof record: if the record does not support the line, it is credited in full and a meter defect is opened. There is no per-seat price and no outcome price at any level. The refusal rate is published beside cost per governed action every month.

**Two price books (both modelled; build for either):**

| Element | E10 Pricing Model v1 | IM price book (plan of record) |
|---|---|---|
| Floor | monthly tiers: Sandbox 0 · Pilot 0 · Starter ₹40,000 · Growth ₹1,25,000 · Scale ₹4,00,000 · Enterprise ₹10,00,000+ | per tenant per year by level: L1 ₹1,80,000 · L2 ₹6,00,000 · L3 ₹24,00,000 · sovereign ₹1,20,00,000 |
| Included | 5,000 / 25,000 / 1,00,000 / 5,00,000 per month | 4,80,000 / 15,00,000 / 42,00,000 per year |
| Overage / action | ₹6.00 / 4.00 / 2.50 / 1.50 | ₹1.60 / 1.20 / 0.90; sovereign ₹0.55 |
| Verifier profile | ₹6,00,000 / regime / yr | ₹3,00,000 / regime / yr |
| Bundle export | ₹0 | free within allowance; ₹2,500 each beyond |
| Pack | — | ₹1,35,000 / tenant / yr (blended) |
| Counterparty seat (L3) | — | ₹45,000 / yr |
| Transfer to rung1 | ₹0.40 per committed action | ₹0.40 |

**Pilot**: free, 90 days, 2,000 actions, **hard stop** (not overage), at most five concurrent. At day 90 the tenant is read-only for 30 days, then exported and deleted. Nothing is billed automatically and nothing is deleted silently.
**Internal transfer to rung1**: ₹0.40 per committed action from 1 Jan 2027, refusals ₹0, no floor, reset quarterly against measured cost (E10 says yearly; a conflict). The same pipeline as external invoices, "no netting". Never quoted externally.
**Cost per governed action** (modelled, L1): compute ₹0.002 + shadow sandbox ₹0.15 + storage ₹0.01 + forever storage ₹0.03 + meter ₹0.01 = **₹0.20**. Fixed cost per residency domain ₹1,88,000/month (L1) and ₹3,43,000 + anchoring (L2). Always publish **with its denominator named** (committed-only headline, or all actions). Reprice any tier under 40% gross margin for two months running.

---

## 6. Screen inventory implied by the TM

Conventions: `layout: console` unless noted. Door and section follow CONTRACT.md. Routes are proposals. "Q:" gives the query parameters that must live in the URL. Every console screen shows the environment badge and the Assurance level pill. At L1 no signature, anchor or verifier verdict appears anywhere.

### 6.1 Work — "What needs me now" (queues)

**`#/work`** Work home. Counts: approvals waiting on me, expiring < 1 h, refusals needing an operator action today, pending proofs (ops only). Link cards to the screens below.

**`#/work/approvals`** Approvals queue (E06 §02; "the one a customer opens twenty times a day"), oldest deadline first.
- Row fields: proposer **in words** ("Agent · gl-agent on behalf of Priya Nair" / "Person · …"), one-line proposal (write-type `label` + counterparty), money **or** radius, gate summary "5 of 5 passed" or "6 of 7 checks passed · dual control: awaiting you", time left (countdown, announced), write type, declaration vN.
- Q: `?filter=mine|all`, `&expiring=1h`, `&proposer=agent|human`, `&write_type=`, `&counterparty=`. "Filters live in the URL so a filtered view can be pasted into a message".
- Actions: open → `#/work/decide/:obligationId`.
- Empty: *"Nothing is waiting for you. Agents are running at their declared autonomy; anything that needs a person will appear here."* plus a link "Write types that escalate for you" → `#/records/write-types?escalates_for=me`.
- Error (platform outage): *"Nothing has been approved in the meantime and nothing expires while this is down."* Countdown shows "paused".

**`#/work/decide/:obligationId`** Decide ("the single most consequential surface in the product").
1. Above the fold: one-line proposal; proposer (Agent/Person in words); deadline countdown (announced, pausable → "Request one extension"); declared **blast radius** as the 4-step band (see gap G3); declaration and policy versions.
2. Field-by-field diff table (`<th>` rows and columns): Field · Before · After. Changed rows are highlighted and unchanged rows sit behind **Show all fields**. "Nothing is summarised away."
3. Every gate result, pass and fail, in declared order, in plain words with numbers and the declaration version (e.g. "Precondition (credit limit ₹3,00,000, exposure after this write ₹2,40,000) — passed"). G4 shows "dual control: awaiting you".
4. The decision and why a person is needed: *"allow at policy version 11 … the proposing agent is at A2 Propose; a person approves before anything is written."*
5. **Approve** · **Reject** (Reject opens a required reason of at least a sentence). 44 px targets, never adjacent without a gap, no default focus on Approve (build rec.). Step-up for irreversible, tenant/cross_boundary or above-ceiling items (build rec.).
6. L1 banner (the unsigned sentence).
- Actions: approve → POST resolve (basis = surface plan + rendered digest) → success state **"Approved · posted · proof #4,101"** with **Open the record** (`#/records/record/:recordId`) and **Reverse this (30 days)**. Live region: *"Approved. Posted. Proof 4101."* Reject → declined state.
- Errors: same actor → *"You proposed this, so you cannot also approve it. Send it to: [names]"* with **Send to** (humans only). Approved but rung 7 failed → *"Your approval was recorded. The write itself did not complete, and nothing was changed. We have been paged."* Expired → "This approval expired at 16:31 IST. Nothing was written." plus Resubmit. Stale view (build rec.) → "The change was updated after you opened it. Review it again."

**`#/work/not-done/:writeId`** Not done (E06 §04): the refusal explained **in the words of the attempted action**. Header "Not done — {plain reason}" (e.g. "Not done — period closed"). Fields: what was attempted, by whom (kind in words), code (mono) + plain title, the rung it stopped at on a 0b→9 ladder strip, **all gate results**, operator action, proof `#4,098`, meter "₹0 — refusals are free". Actions: "Fix and resubmit" (new intent), "Open the proof entry" (`#/assurance/proof/4098`), "Why this rule" (`#/records/policies/11#R-SI-01`). A platform code shows the three-sentence platform copy and **Retry (same request)**. Never "Retry" for a governed refusal.

**`#/work/obligations`** Obligation history (resolved, declined, expired; filterable; audit use). **`#/work/obligations/:id`** timeline: escalation → resolution → resubmission, each with its seq.

**`#/work/reversals/:writeId`** Reverse this: shows the reversal plan (method, window, after_window), undo_until and the compensating entry preview. It is a governed write (dual control if declared).

Operator-tenant queues (elan1 staff; same door, gated by role): **`#/work/reviews`** production-key requests (four checks, 2-working-day promise) · **`#/work/promotions`** (advisory→enforced reviews) · **`#/work/incidents`**, **`#/work/incidents/:id`** (incident record with CERT-In 6-hour countdown in IST, contain/verify/close; close disabled until verified) · **`#/work/erasure/:caseId`** (72-hour clock, erasure plan, dual-control approval).

### 6.2 Records — "What is the state of things"

**`#/records`** governed records by record type (from declarations). **`#/records/record/:recordId`** Record (E06 §05): current state, **pinned fields**, and a **timeline of every governed write, refusal and escalation** ("a timeline of successes only is a timeline that lies by omission"). Each item shows outcome chip, actor kind, write type, seq link and time.

**`#/records/writes`** · **`#/records/writes/:writeId`** Governed write detail: intent summary, decision, every rung 0b–9 as a vertical ladder (pass / stop / not reached), gate results table, obligation link, record_id/version, undo_until, idempotency info, mode (live/sandbox), enforcement mode.

**`#/records/declarations`** list (id, name, slug, owner role, current certified version, write-type count, status). **`#/records/declarations/:declId`** versions list (immutable; superseded/withdrawn chips). **`#/records/declarations/:declId/v/:version`** read-only seven-block view with dispositions rendered, the compiled digest, certifier and registration seq.

**`#/records/studio/:declId`** Studio (E06 §06; control token). Stepper **Author → Validate → Simulate → Certify**, "cannot skip forward". Q: `?step=author|validate|simulate|certify`.
- Author: block editor plus the compiled surface preview "beside the source". The meter basis resolves beside each write type ("before they have written a line of integration code"). Per channel, **"the sentence the developer will be permitted to say about it"**.
- Validate: failures against the block. The L0-S03 example message. Lint warnings.
- Simulate: per write type the decision, gate rows, reachable refusal codes, resolved radius and meter basis. Empty result: *"This simulation produced no refusals. Add a fixture that fails."*
- Certify: pick a named certifier (humans only, not the author). Author = certifier → GATE.DUAL_CONTROL_SAME_ACTOR with Send to. Success: *"Accepted at version N"* plus the compiled digest.
- Errors: n/a/tbd → *"An honest unknown needs a sentence. What would change your answer?"*

**`#/records/write-types`** · **`#/records/write-types/:name`** label, intent, blast radius, dual control (with threshold), gates in order, reversal plan XOR irreversible, payload schema, meter basis, channels and modes, grants. Q: `?escalates_for=me`.

**`#/records/actors`** · **`#/records/actors/:actorId`** actor kind, roles, delegations, grants. **`#/records/policies/:policyVersion`** rule set (rules with ids, projection, `default: no_rule_matched`). **`#/records/lexicon/:hash`** term set. **`#/records/counterparties`** register (registered, sanctioned).
Phase 4 (label "Phase 4 — specified, not built"): **`#/records/controls/:controlId`**, **`#/records/regulations/:regId`**, **`#/records/trace/:regId`** (five-link chain view: clause → control → gate → write type → proof field, broken links named).

### 6.3 Agents — "Who and what is acting here"

**`#/agents`** Agents registry (E06 §07): every registered agent, model, tools, **hash-pinned descriptions**, sponsor, write types, current autonomy per write type. **`#/agents/:agentId`** description versions, where "a changed description shows as a version change, not a silent update". Includes a diff between description hashes and the MCP `_meta` for each tool.

**`#/agents/autonomy`** Autonomy grants matrix: actor × write type, A0–A5 with names. A missing grant is **"A0 Observe (no grant)"**. Changing a grant is a governed write (dual control for A5 / tenant radius). There is no free-edit dropdown: the action opens a proposal. L3 add-on **`#/agents/autonomy/:classId`** precedent class with counters, score, window, the eight eligibility conditions ("Eligible for A3" or the first failing condition), **Propose A3** (the owner writes the justification; nothing pre-filled), **Revoke** (one press, no justification required), supervised period status.

**`#/agents/tenants`** Tenants (E06 §07; admin and elan1 ops): residency domain, status (Live / Stopped · reason · since), assurance level, hosting profile, mode per channel. **Stop switch** → modal: reason class, a second approver (dual control), and a warning that it "stops all writes including refusals". After the stop, **Verify stop** runs a probe write and expects POLICY.TENANT_STOPPED.

**`#/agents/keys`** API keys: key id (masked), class (sandbox / production), scope (tenant, write types, domain), created, **last used**, **rotation window**, status. "Production keys issued by elan1 only." Create sandbox key → shown once. Production key → "Request a production key" → `#/developers/production`.
L2: **`#/agents/keys/signing`** key register (key_id, window, status, successor, fingerprint, "Overlap: none"), generate successor → register (dual control) → retire / revoke (T_suspect). At L1 the empty state reads: "No signing keys exist at Level 1. Records are hash-chained, not signed. Signing arrives at Assurance Level 2."

**`#/agents/channels`** channels with kind, write types, may_approve and **mode** (Enforced / Attested advisory) with the permitted sentence and the boundary dates.

### 6.4 Assurance — "Can I show someone this was done properly"

**`#/assurance`** overview: level pill with what may be said at this level; **chain standing** three-valued with scope and count ("Continuous · seq 1–41,206 · 41,206 records · 6 of 6 write types · checked 02:10 IST"); coverage; refusals this period; mode per write type; meter to date. L2 adds unanchored head, last counter-signature, key window.

**`#/assurance/proof`** chain explorer paged **by seq** (not by offset). Q: `?from=4090&to=4110&write_type=&outcome=`. Columns: seq, recorded_at, write type, actor kind, autonomy, outcome, code, digest (short), mode.
**`#/assurance/proof/:seq`** Proof entry (E06 §05): seq, digests (this, prev), declaration and policy versions, actor kind, outcome, mode (live/sandbox), enforcement mode, the bound fields (F01–F16 table), links to the approval record and meter event, and the prev/next chain link. **Mandatory L1 sentence.** Actions: Verify this range (`verify`) → result three-valued. Copy: "At L1, verify requires us."

**`#/assurance/chain`** continuity report and nightly integrity runs (verdict, range, count, scope, write types, worker version). A break shows seq, field, expected and found (e.g. *"FAIL at seq 3,181: prev_digest mismatch, expected a376… got 0000…"*). A missed night shows **Not checked**.

**`#/assurance/refusals`** refusals by code, gate, rung and write type, with a trend. The refusal rate appears beside cost per governed action. Copy: refusals "are evidence, not noise".

**`#/assurance/approvals`** approval audit, the saved query for E11 test 5: approvals, approvers, same-actor refusals, agent-token refusals, declines with reasons, expiries, with the scope printed. Rubber-stamp telemetry (build rec.): median time-to-decide and share decided without expanding the diff.

**`#/assurance/meter`** Meter (E06 §07): governed writes by write type, **refusals at quantity zero on the same table**, cost to date, period state chip (Open / Closing / Reconciled / Rated / Invoiced / **Blocked**). **`#/assurance/meter/:period`** · **`#/assurance/meter/:period/lines/:line`** "Show the records behind this line" (events by write_id and seq). **`#/assurance/invoices/:invoiceId`** invoice (floor, included, overage, **Refused 412 · ₹0**, pack lines; Dispute line → hold seq range). **`#/assurance/reconciliation`** M1–M5 results per night.

**`#/assurance/modes`** enforcement-mode boundaries per write type and channel, with the boundary date and counts on each side; the caller-performed flag count (Mode B).

**`#/assurance/level`** assurance ladder (L1 / L2 / L3: what runs, may say / may not say, buyer) and the L1→L2 upgrade runbook as a stepper **`#/assurance/upgrade`**. The seven preconditions have evidence links. Stages 0–5 each show the governed write that performed it. Stage 2 is marked **Irreversible**. Copy: "Key bound · signing off"; "Signing on at seq 41,207 · 41,206 records at Level 1 · 0 at Level 2". The banned sentence never appears ("the tenant's records are signed"). Use "records from 12 August 2027 are signed; the 41,206 records before that date are Level 1".

L2 screens (labelled): **`#/assurance/exports`**, **`#/assurance/exports/new`** (range, profile or "No profile claimed", redaction; shows record count, refusal count and unanchored head **before** generating) → *"Export ready — 12,480 records, 611 refusals, 22 unanchored, profile in-mca-audit-trail v1"* + digest + *"Verify it yourself first. If it does not pass for you it will not pass for them."* Refusal offers: in-domain endpoint / "Export the clean range instead" / two sub-ranges / suggested split. **`#/assurance/anchoring`** (last counter-signature, unanchored head, batches, `single_anchor`; banner *"Anchoring degraded since 09:14 — 88 records unanchored"*). **`#/assurance/verify`** report viewer (nine sections, exit-code chip).
Packs: **`#/assurance/packs`**, **`#/assurance/packs/:packId`** (11 blocks, gate scores, profile binding, dry-run report with *"C06 not_applicable — assurance level 1"*, limits statement), **`#/assurance/profiles/:profileId`**.
L3 screens (labelled): **`#/assurance/receipts`** (issued and accepted; *"Receipt issued — record 41,288, audience ar-org:acmetextiles.example, expires in 7 days"*; *"Receipt accepted — bound at record 8,902 to issuer record 41,288"*; the issuance screen's volume-disclosure warning; *"You are revealing 3 of 11 committed fields"*).

### 6.5 Developer portal (`layout: doc` / `public`)

| Route | Content |
|---|---|
| `#/developers` | overview: one submission surface, two modes, six calls; "Get a sandbox key" |
| `#/developers/signup` | work e-mail, company, one-line description → verification → key shown once; fixture failure = no key |
| `#/developers/quickstart` | scope → stage → assert → handle 3 outcomes → webhook |
| `#/developers/kernelport` · `/kernelport/:call` | the six calls (tables §2.1) |
| `#/developers/objects` | five objects + 16 fields |
| `#/developers/api` · `/api/:family` | 8 families, error taxonomy, headers, rate limits |
| `#/developers/mcp` | 34 tools (18/10/6), `_meta` pinning, JSON-RPC example |
| `#/developers/sdk/typescript` · `/sdk/python` | §2.5 snippets |
| `#/developers/webhooks` | 7 events, signature, seq-gap detection |
| `#/developers/refusals` · `/refusals/:code` | **a public page per code** (GA readiness row 1): class, rung, means, operator action, fixture example |
| `#/developers/declarations` | seven blocks, L0-S01..S11, LN-01..07, dispositions |
| `#/developers/conformance` | C1–C14, upload the result file, status per test |
| `#/developers/production` | production-key request form + the four review checks + 8 refusal categories |
| `#/developers/promotion` | advisory → enforced review |
| `#/developers/modes` | the sales rule table (may / may not say) |
| `#/developers/versioning` | /v1, notice table, `GET /v1/versions` |
| `#/developers/seal` · `/verifier` · `/receipt` | Seal v6, bundle, verifier (L2), Action Receipt (L3), clearly labelled "specification" |
| `#/developers/changelog` | register version, port major, deprecations |

### 6.6 Status (`#/status`, public layout)

Components (§4.2) with state; the chain-integrity component showing its last nightly run; 90-day history (never edited); **`#/status/incidents/:id`** (timeline, affected components, seq ranges affected and their state after recovery: continuous · continuous with a declared gap record · not checked). An operator-only **`#/assurance/ops`** mirrors `/v1/ops` (SLO table §4.1 with class labels, the three zero-numbers, outbox lag per domain, reconciliation report, grant-catalogue diff).

### 6.7 Admin placement (no "Settings")

Tenant configuration → Agents · Tenants. Keys → Agents · Keys. Declarations, actors, write types → Records. Billing and meter → Assurance · Meter. Webhook endpoints → Agents · Keys (tab "Webhooks"; build rec.). elan1 operator work (reviews, incidents, erasure, promotions) → Work in the `elan1-operator` tenant. Break-glass → a declared write type on Agents · Tenants, recorded in the operator chain and visible to the tenant.

---

## 7. Realistic sample data (consistent with the TM)

**Demo clock:** 30 Sep 2027, 18:30 IST (month-end accrual; L1 tenant). A second L2 demo tenant is dated 2 May 2028 for L2 screens.

```js
E1.data.tm = {
  tenants: [
    { id:"3f9a1c2e-7b44-4d1a-9e0f-5a6b7c8d9e01", name:"Deccan Precision Components Pvt Ltd",
      residency:"in", region:"ap-south-1 (Mumbai)", level:1, hosting:"H1",
      environment:"production", status:"live", consumer:"rung1 Enterprise (hosted ERPNext)",
      mode:"enforced", notice_contact:"Priya Nair (Finance Controller)", head_seq:7303 },
    { id:"sbx_7f3c…", name:"Acme Billing (sandbox)", environment:"sandbox", level:1,
      key:"sk_sbx_4Tq…", quota:{per_min:10, concurrent:2, month:5000, used:1184} },
    { id:"c21d…", name:"Sahyadri Textiles Ltd", level:2, boundary_seq:41207,
      boundary_date:"2027-08-12", l1_records:41206, key_id:"k_in_20270401_9c3a",
      unanchored_head:0, last_countersignature:"3 minutes ago" }
  ],
  declarations: [
    { id:"d-rung1-erpnext", name:"rung1 — ERPNext books", version:12, policy_version:14,
      certified_by:"Arjun Rao (Accounts head)", author:"Meera Iyer", compiled_digest:"c41e…9a07",
      write_types:["sales_invoice.submit","sales_invoice.cancel","purchase_invoice.submit",
                   "payment_entry.submit","journal_entry.submit","customer.update"] },
    { id:"erp_sales_invoice", name:"rung1 — Sales invoicing (ERPNext)", version:7,
      policy_version:11, lexicon_ref:"rung1/erpnext/gst/2026-09" }
  ],
  actors: [
    { id:"gl-agent", kind:"agent", model:"(self-hosted, via fusion.gateway)",
      sponsor:"Kavita Menon (Accounts executive)",
      grants:{ "journal_entry.submit":"A2", "payment_entry.submit":"A0" } },
    { id:"ar-agent", kind:"agent", grants:{ "sales_invoice.submit":"A2" } },
    { id:"u-priya", name:"Priya Nair", kind:"human", role:"Finance controller", may_approve:true },
    { id:"u-venkat", name:"Venkat Subramanian", kind:"human", role:"CFO", may_approve:true },
    { id:"u-kavita", name:"Kavita Menon", kind:"human", role:"Accounts executive", may_approve:false }
  ],
  approvals_queue: [
    { obligation:"ob_91c4…", seq:7301, write_type:"journal_entry.submit", label:"Post journal entry",
      proposer:"Agent · gl-agent on behalf of Kavita Menon",
      summary:"Accrual for September freight, invoices pending", amount:640000,
      radius:"batch", gates:"6 of 7 checks passed · dual control: awaiting you",
      expires_in:"3 h 42 min", decl:"d-rung1-erpnext v12", policy:14 },
    { obligation:"ob_7a02…", seq:4099, write_type:"sales_invoice.submit", label:"Submit invoice",
      proposer:"Agent · ar-agent", counterparty:"ACME Textiles", amount:240000,
      radius:"one_counterparty", gates:"5 of 5 passed", expires_in:"2 h 10 min" },
    { obligation:"ob_33d9…", write_type:"payment_entry.submit", label:"Record payment",
      proposer:"Person · Kavita Menon", counterparty:"Sai Logistics", amount:420000,
      radius:"one_counterparty", gates:"7 of 7 passed", expires_in:"48 min" }
  ],
  journal_diff: [
    ["Account","—","Freight Inward - MFG · Dr ₹6,40,000"],
    ["Account","—","Accrued Expenses - MFG · Cr ₹4,20,000 · Supplier: Sai Logistics"],
    ["Account","—","Accrued Expenses - MFG · Cr ₹2,20,000 · Supplier: Konkan Carriers"],
    ["Posting date","—","30 Sep 2027"],
    ["Remark","—","Accrual for September freight, invoices pending"]
  ],
  proof: [
    { seq:7301, at:"2027-09-30T12:31:07Z", wt:"journal_entry.submit", kind:"agent", a:"A2",
      outcome:"escalated", record_id:"00000000-…", ver:0, digest:"c41e…", meter:0 },
    { seq:7302, at:"2027-09-30T13:02:44Z", wt:"approval.resolve", kind:"human", a:"A4",
      outcome:"committed", note:"approval (platform write type, billable: false)", meter:0 },
    { seq:7303, at:"2027-09-30T13:02:47Z", wt:"journal_entry.submit", kind:"agent", a:"A2",
      outcome:"committed", record:"ACC-JV-2027-00412", ver:1, meter:1,
      undo_until:"2027-10-30T13:02:47Z" },
    { seq:4098, wt:"sales_invoice.submit", kind:"agent", a:"A3", outcome:"refused",
      code:"GATE.PRECONDITION_FAILED", gate:"precondition",
      detail:"credit_exposure + amount exceeds credit_limit (300000)" }
  ],
  meter_sep_2027: { committed:1284, refused:412, escalated:96, billable:1284,
                    refusal_line:"412 refused · ₹0", period_state:"Closing" },
  invoice_l1_year: { floor:"₹1,80,000", included:"4,80,000 governed actions / yr",
                     overage_rate:"₹1.60", pack:"ledger1 · ₹1,35,000 / yr" },
  integrity: { verdict:"continuous", range:"1–7,303", records:7303,
               write_types:"6 of 6", scope:"full_chain", last_run:"01 Oct 2027 02:10 IST" },
  status: [ ["Submission","Operational"],["Gates and rules","Operational"],
            ["Single writer","Operational"],["Chain integrity","Continuous · checked 02:10 IST"],
            ["Meter","Operational"],["Console","Operational"],["Sandbox keys","Degraded — p95 71 s"] ],
  incident: { id:"INC-0412", sev:"P2", class:"other", title:"Sandbox tenant provisioning slow",
              noticed:"2027-09-29T09:14:00+05:30", certin:"not_reportable" },
  l2_bundle: { id:"bundle-3f9a1c2e-000001-012480", records:12480, refusals:611,
               unanchored:22, profile:"in-mca-audit-trail v1",
               levels:[{l:1,count:8117,range:"1–8,117"},{l:2,count:4363,range:"8,118–12,480"}] }
};
```

Other consistent values from the TM: the credit-limit example (limit ₹3,00,000, exposure after ₹2,40,000); the dual-control threshold "grand_total > 200000"; the WhatsApp/voice ceiling ₹1,00,000; the ACME Textiles invoice (YARN-40S, qty 800 × ₹300 = ₹2,40,000); pack price ₹1,35,000; profile ₹3,00,000; transfer ₹0.40; cost model ₹0.20.

---

## 8. Gaps, open questions and value-adds for the UI

**Gaps the TM leaves open (the UI must not pretend otherwise)**
- G1 **Identifier display formats** are not specified (everything is a uuid). We propose `#seq` as the primary human handle ("proof #4,101"), with other ids shortened. The brief's `prf-00012 / OBL-…` style is **not** in the TM. If used, derive it from seq (e.g. `OBL-7301` = obligation raised at seq 7,301) and label it as a display alias.
- G2 **Mode, enforcement_mode and outcome are not among the 16 fields**, yet the Proof screen must show them. Show them as "recorded beside the record", not as sealed fields.
- G3 **The blast-radius ladder.** CONTRACT.md has a 4-step band (Contained · Reversible · Material · Irreversible). The TM has **five radius values** (one_record · one_counterparty · batch · tenant · cross_boundary) plus a separate reversibility axis (reversal plan vs irreversible). Recommendation: draw the TM's five radius values as the stepped band and show reversibility as a separate chip ("Reversible 30 days" / "Irreversible"). Or map explicitly and footnote it. Never let the brand band replace the declared value.
- G4 **Obligation endpoints, webhook signature string, token claims and the conformance file** are all "build recommendation". Label portal code "illustrative".
- G5 **Counts inconsistency**: 43/28 codes vs 32+3 enumerated. The C8 sample uses `GATE.PRECONDITION_UNMET` (a typo for PRECONDITION_FAILED). Use the register file's names.
- G6 **Expiry default** is 4 h ("asserted, not observed"); rung1 uses 72 h. Show the expiry as a per-write-type value with its source.
- G7 **Quorum, delegation, step-up, extension, basis-digest check and bulk approve**: all build rec. or open. Bulk approve is **open** ("does that defeat its purpose?"). Do not design a bulk-approve button.
- G8 **Kernel availability SLO** does not exist. The status page shows indicators without a promise.
- G9 **Two price books.** Rating tables must hold either. The IM price book is the plan of record. L1 external list price is undecided ("not a price the company has committed to externally").
- G10 **Support tiers** are undefined. The build rec. is one tier: business hours IST, P0 by named escalation.
- G11 **Tamil/Hindi** catalogue timing is open. The WCAG 2.2 AA audit is in scope or deferred (open). Design for ICU catalogues and Indian digit grouping from day one.
- G12 **Where precedent lives** (elan1 or rung1 Agents door) is open (Q1 2028).
- G13 **L2 date**: customer-facing copy must say **April 2028**, not "Q3 2027".

**Value-adds the TM explicitly recommends (safe to design)**
- Rendered-payload digest in the approval basis, and a stale-view refusal. No default focus on Approve (keyboard users land on the diff). Approver telemetry and a monthly second-reader sample.
- A daily **chain-head receipt** to the tenant's notice contact, giving "tamper-evident to you" a mechanism at L1 (not an anchor, never called one).
- **Claims lint** on every generated artefact. The UI copy itself should pass it: no "tamper-proof", "immutable", "court-ready", "regulator-approved", "we cannot see your data", "open standard".
- Saved query for E11 test 5 (approval separation) on the Assurance door.
- Stop verification probe. Dead-man-driven chain-integrity status.
- `meter_adjustment` corrections with a named approver. The period-close BLOCKED state visible to the tenant ("period open, and why").
- A per-code public refusal page, and a result-file upload with per-test status.

**Invariants to encode in components** (checklist for reviewers)
1. Outcomes are exactly committed · refused · escalated (dispositions allow · refuse · escalate). There is no "warning" state anywhere.
2. A refusal is a success-shaped response (HTTP 200, `isError:false`), never an error toast. Never offer "Retry" on a governed refusal. Offer it only for PLATFORM.\* (same request).
3. Every refusal shows every gate result, the rung, the code with its plain title and the operator action. It meters ₹0 and has a proof entry (except a stopped tenant).
4. Agents never approve, and the proposer never approves. Send-to lists humans only. The Reject reason is mandatory.
5. The declaration version is always an explicit integer. "latest" never appears in production UI.
6. Chain continuity is three-valued, with scope and count. Never a bare green tick.
7. At L1: no signature, anchor, key or verifier verdict anywhere. Show the unsigned sentence on Proof. Records before an L2 boundary stay "Level 1" for ever.
8. An escalation is resubmitted, never resumed. One approved decision shows three proof entries.
9. Enforcement mode is per channel × write type, declared, never set in a call, and shown with its permitted sentence. Attested advisory never says "block" or "prevent".
10. Money uses ₹ with Indian grouping. The refusal count appears on the invoice at ₹0. Every invoice line opens its records by write_id and seq.
