# elan1 — Phase 4 and group documents: screen spec (source of truth for designers)

Scope of this file: every screen, flow, enum and sample value implied by **E20–E26** (elan1 Phase 4), **O01–O12**, the **P1-00…P4-00** indexes, the eight Phase 1–3 `.md` notes, and **elan1-financial-model.xlsx**. Everything was read in full. The UI contract (`CONTRACT.md`) wins where it is stricter than a source document.

Conventions used below
- "Quote" means the words come straight from the source and should be used as copy with no changes. Source codes are in brackets, e.g. [E22 §06].
- `[gap]` marks something no source settles, with a proposal attached. `[conflict]` marks two sources that disagree.
- Routes are hash routes that fit the Four Doors (Work · Records · Agents · Assurance), with **no Settings tab**. Billing, plans, security, residency, keys and version pins all live in **Assurance**, because O07 §04 says every invoice line "resolves to one hash-chained record, and that record is visible to the customer on the Assurance door".
- Public surfaces use `layout: 'public'`. The receipt-verification portal and the reviewer kit use `layout: 'bare'`, need no login, make no network call during verification, and have no elan1 account dependency.

---

## 1. Vocabulary and enums (verbatim where possible)

### 1.1 Core group vocabulary (O01)
- **Declaration** = "the elan1 Ontology: the single machine-readable object that says what a module is and what it may do." It has seven blocks: `identity` · `shape` · `permissions` · `write_types` · `gates` · `proof_binding` · `channels`. Block 7 was once called `doors`/`block_doors` and is now **channels** (DR-012). The Four Doors keep the word "doors".
- **Right Path** = the nine rungs of the one write function: 0b STOP · 1 IDENTITY · 2 WRITE DOOR · 3 PRE-GATES · 4 evaluate() · 5 GUARDRAIL · 6 AUTONOMY · 7 ACT · 8 PROOF · 9 METERED. "Eight of the ten rungs make no model call." Only rung 4 may call a model.
- **Governed Action** = "the unit that is permitted, executed, recorded and billed. It is the same unit at all four points." Keep it off buttons and headings (O10 §07). Write "the change" or "the write" instead.
- **Assurance Levels**: `L1 Guarded` (policy gates, human approval, sandbox, 30-day rollback, hash-chained log; Phase 1) · `L2 Attested` (cryptographic seal, RFC 3161 anchoring, exportable bundle; Phase 3) · `L3 Proven` (verifier profiles, offline verification, open "Action Receipt" standard; Phase 4).
- **Autonomy A0–A5**: A0 Observe ("Reads only. Cannot reach the ACT rung") · A1 Draft ("Produces a write intent; a human must submit it") · A2 Propose ("Submits; a human approves before the write") · A3 Act reversible ("Acts alone where a reversal plan exists") · A4 Act bounded ("Acts alone within a declared blast radius") · A5 Act broad ("Acts alone at tenant scope; the declaration needs dual control"). "There is no A6, and no flag creates one." "Delegation does not confer autonomy." A missing permission resolves to A0.
- **Planes P0–P8**: P0 Residency and tenancy · P1 Platform runtime · P2 System of record · P3 Kernel · P4 Declaration plane · P5 Surfaces · P6 Channels · P7 Apps · P8 Packs.
- **KernelPort**, six calls: `define · assert · seal · verify · scope · refuse`.
- **Registers**: refusal register `REF-nn`; register tiers `REG-T1`–`REG-T7`; gates `G1`–`G9`. Commerce gates are `GC1–GC6` (P4-00).
- **Blast radius** has five values: `one_record · one_counterparty · batch · tenant · cross_boundary` (P3-00 conflict 3). UI mapping to the contract's four-step visual ladder `[proposal]`: one_record → Contained; one_counterparty/batch with a reversal plan → Reversible; tenant → Material; cross_boundary or `irreversible: true` → Irreversible. Always print the raw enum beside the band.
- **Integration modes** (O03): Mode A "SDK in-process" = **Enforced**. Mode B "MCP/HTTP" = **Attested advisory**. Refusal outcomes: `allow` / `refuse` / `needs_approval`. Governed Action states: `proposed`, `acting`, `acted_unproven` ("Applied, proof pending"), `acted_unattested` (Mode B, seal never received).
- **Token classes** (O03 §06): Tenant token, Control token, Service token. "no fourth".
- Phase 2 terms (`.md` note): seal, evidence bundle, verifier profile, anchor, timestamp authority, pack.

### 1.2 Retired terms: never on screen (O01 §04, O10 §05)
core1/CORE1 → rung1 · rev1/REV1/gtm1 → rung1 Revenue · commerce1 → rung1 Commerce · fusion1 → stack1 · "elan1 GIP / Governed Intelligence Platform" → "the elan1 layer / the elan1 kernel" · GAM → Right Path + Governed Action · LOM → nothing · block 7 doors → channels · "AI platform" → governed write path · strata L0–L8 → P0–P8 · autonomy L0–L5 → A0–A5 · "L0 schema" → Declaration schema. All-capital brand forms (ELAN1, CORE1…) are retired. `start1`, `run1` and `academy1` are deleted.
`[conflict]` The financial model's cover says "Governed Intelligence Platform", a retired term. Do not copy it into the UI.

### 1.3 L3 Proven scope (E20)
- **Frozen sentence**, quote for the L3 explainer: "At L3 an elan1 action receipt is defined by a public specification, produced by two independent implementations that agree octet for octet, signed by a key the customer may hold themselves, anchored by parties that are not us, verifiable by an organisation that has no relationship with us, disclosable field by field without revealing the payload, and usable after this company has ceased to exist. It still does not prove the transaction was genuine, it still does not prove the rules were adequate, and no regulator has approved it."
- **Entry condition** (an event, not a date): "No L3 capability is designed, staffed or promised until an auditor who does not work for us and is not paid by us has accepted an L2 evidence bundle as evidence in a real engagement, and has said so in writing we may keep." Four tests: (1) the auditor ran the offline verifier on their own machine; (2) relied on the bundle for a working paper or finding; (3) can state unprompted what a PASS does not establish (E18 T8); (4) would ask for one again, in writing.
- **Six capabilities plus the standard**: 1 Cross-organisation verification (E22) · 2 Selective disclosure (E23) · 3 Customer-held keys (E23/E16) · 4 Sovereign deployment (a deployment spec, "not a proof capability") · 5 Precedent intelligence (E24) · 6 Earned autonomy (E24) · — the Action Receipt standard (E25). Three conditions: a second independent seal implementation; published test vectors including a known-tampered bundle; counter-signature by a party that is not us.
- **Invariants**: "No seventeenth field, at L3 or ever". The decision path does not change: no model at rungs 3, 4, 5, 6 or 8. "L3 adds no new meter."
- **Buyers** (E20 §04): counterparty pair · regulated enterprise with its own key policy · government/sovereign buyer · privacy-constrained discloser · operations owner who has outgrown approvals · the market.
- **Claim boundary**. True at L3 (usable as marketing copy only once done): "You hold the signing key. We can show you every record we signed, and it is none of yours." · "You can disclose three fields to your auditor and five to your lender, from one bundle, and each of them can verify what they were given." · "This agent reached A3 on its own record of 900 approvals and 4 refusals, the graduation is in the chain, and one person can take it back in a minute."
- **DO NOT SAY** (enforce in copy review): "Tamper-proof" · "Court-ready"/"legally admissible" · "Approved by a regulator" · "Certified" (unless a dated certificate exists, and then only for its scope) · "The transaction was genuine" · "Your books are verified" · "The agent is safe because it earned A3" · "We cannot see your data" (only as a per-deployment fact for customer-held keys) · "Standardised" (use "published" until another organisation's implementation passes).
- **Definition of done**: 12 measured items. The L3 readiness screen renders them (§2, A-02).
- **Must not happen**: no L3 work before entry, "including a slide" · no back-signing or silent L2→L3 upgrade · "No autonomy raised by anyone other than through the graduation write type. There is no support action, no admin toggle and no contract clause" · no standard called "open" while we are the only implementer · no sovereign deployment sold before the defect-propagation process exists · no regulator named as having accepted anything.

### 1.4 Declaration full spec: Controls and Regulations (E21)
- The seven blocks change only here: block 6 `proof_binding.canonicalisation` gains `elan1_lp_sd_v1` (default stays `elan1_lp_v1`), `salt_scope` gains `per_field`, and `redaction_profile` goes live. `shape.fields[].classification` now also drives disclosure. `permissions.grants[].min_autonomy` is "the floor a graduation may raise against… never a value support may edit".
- **Five-link chain**: `regulation clause → control → gate → write type → proof field`, resolved "by name and version at every link — or the row is not bound and says so".
- **Control** fields:
  - `control_id` `^C-[A-Z]{2,6}-[0-9]{2}$` (e.g. `C-AT-01`), `control_version` (uint32, "Never 'latest'"), `name`, `statement` (one present-tense sentence), `owner_role` ("Never a person").
  - `control_kind` enum `preventive · detective · corrective`; `operating_mode` enum `continuous · per_event · periodic`; `status` enum `draft · certified · superseded · withdrawn`.
  - coverage: `declaration_ref[]`, `write_types[]` (`*` needs a `scope_note` ≥40 chars), `gates[]` (required when preventive), `actor_kinds[]` from `human · agent · system`, `scope_note`.
  - evidence_expectation: `record_fields[]` (F01–F16), `proof_binding_fields[]`, `gate_results_required`, `refusals_required`, `approval_record_required`, `continuity_scope` enum `full_chain · declared_write_types · range`.
  - test: `test_id` `^T-[0-9]{2}$`, `assertion`, `population`, `exception_handling` enum `none_permitted · exceptions_listed · exceptions_with_adr`, `on_fail` enum `fail_integrity · fail_profile · incomplete`, `operated_throughout` boolean.
  - certification: `author`, `certifier` ("Never the author"), `certified_at`, `supersedes`.
- **Regulation** fields:
  - `regulation_id` `^[a-z]{2}-[a-z0-9-]{3,40}$` (e.g. `in-mca-audit-trail`), `regulation_version`, `regime_name`, `issuer`, `jurisdiction` (ISO 3166-1 alpha-2), `instrument_ref`, `rule_as_at`, `in_force_from`/`in_force_to`.
  - `clauses[]`: `clause_ref`, `clause_text` ("quoted, never paraphrased"), `obligation_kind` enum `record_keeping · human_oversight · retention · disclosure · segregation · non_repudiation`, `expects_controls[]`, `disposition` enum `bound · out_of_scope + adr · not_measurable + reason + would_change_if` (reason and would_change_if each ≥12 chars), `severity` enum `blocking · material · advisory`.
  - profile_binding: `profile_id`/`profile_version`, `clause_to_check_map[]` ("Generated, then reviewed — never hand-maintained"), `min_assurance_level` (2 for non-repudiation; 3 where verification outside both organisations is required).
- **Validation rules**: L0-C01…C05 and L0-R01…R06, run at VALIDATE with no platform. The key UI strings:
  - L0-R01 "a blank is a validation failure, never a draft state".
  - L0-R06: "A blocking obligation we cannot measure is not a pack. Bind it, scope it out with an ADR, or stop."
- **Simulate** per-clause results: `established · unmet · not_disclosed · not_applicable`.
- **Change classes**: `Editorial · Tightening · Loosening (+ADR) · Structural (new declaration version)`.
- **Propagation rule**: "A record is judged by the profile version whose `applies_to_records_from` / `applies_to_records_to` window covers its `recorded_at`, and by no other." Refusal copy: "This would judge records by a rule that did not exist when they were written."
- Refusal/failure codes: `GATE.DUAL_CONTROL_SAME_ACTOR`, `POLICY.DECLARATION_UNRESOLVED`, `PLATFORM.REGISTRY_UNAVAILABLE`.
- Worked example: Regulation `in-mca-audit-trail` / 1. Issuer Ministry of Corporate Affairs, IN, in force from April 2023, severity blocking. Controls `(C-AT-01, 1)` and `(C-AT-02, 1)`. C-AT-01: "Every submission of a governed sales invoice records the actor, the actor kind and the time it was recorded, and the record cannot be altered afterwards." It is preventive · per_event, covers `sales_invoice.submit`/`.amend`/`.cancel`, gates `precondition`, `retention`, fields F04 write_id, F09 actor_id, F10 actor_kind, F16 recorded_at, F03 prev_digest. C-AT-02: "Every refused submission is recorded with its refusal code and the gate that raised it." The gate is declared in `erp_sales_invoice` v7. Profile map: Clause → C01 (integrity), C04 (coverage), C07 (structural). The "does not establish" line to print: commercially genuine invoice; direct ERPNext changes outside the write path; "or that the MCA has reviewed this reading of the rule. It is our reading, dated, with its author and certifier named."

### 1.5 Cross-organisation verification (E22)
- Split vocabulary: **third-party verification** (L2; a handed-over bundle) versus **cross-organisation verification** (L3; a protocol). "The receipt is the unit that crosses."
- Objects: **Receipt** (16 fields, digest, signature, `key_id`, anchor inclusion path, issuer identity plus envelope `audience`, `nonce`, `expires_at`) · **Counterparty register entry** (`org_id`, display name, trust anchor route, accepted `key_id` set with windows, first-seen, status) · **Trust anchor** · **Binding record** (`receipt.accept` governed write).
- `org_id` = `ar-org:<domain>`, e.g. `ar-org:acmetextiles.example`.
- **Discovery routes**, in strict order: 1 Out-of-band fingerprint (pinned; "Highest") · 2 Issuer-published key document at `https://<domain>/.well-known/action-receipt-keys` (fields `key_id, fingerprint, valid_from, valid_to, status, successor_id`; "Moderate") · 3 Trust anchor attestation (specified, not operated) · 4 In-receipt hint ("None. A hint is used to look up, never to trust"). Phase 4 ships routes 1 and 2. "elan1 never operates a trust anchor."
- Register copy to render per receipt: "Accepted on a pinned fingerprint since March 2028" versus "Accepted on a key document fetched four minutes ago".
- Issue success: "Receipt issued — record 41,288, audience ar-org:acmetextiles.example, expires in 7 days". Accept success: "Receipt accepted — bound at record 8,902 to issuer record 41,288".
- Limits line: "This establishes that the issuer's governed write path produced this record under these rules at this time. It does not establish that the underlying transaction occurred."
- **Receiver refusal codes** (six new rows):

| Code | Means | Receiver does |
|---|---|---|
| `POLICY.RECEIPT_AUDIENCE_MISMATCH` | Addressed to another organisation | "Return it. Do not act on it" |
| `POLICY.RECEIPT_EXPIRED` | Past `expires_at` | "Ask for a fresh receipt" |
| `POLICY.TRUST_ANCHOR_UNKNOWN` | No discovery route resolved | "Establish the relationship out of band first" |
| `POLICY.RECEIPT_UNVERIFIED` | Digest, signature or inclusion path failed | "Stop. This is forensic, not commercial. Do not negotiate it over email" |
| `GATE.RECEIPT_REPLAYED` | Already accepted | "Treat as the same event, not a second one" |
| `GATE.COUNTERPARTY_UNKNOWN` | Issuer not in register | "Register, under whatever due diligence they already run" |

  Also `GATE.COUNTERPARTY_SANCTIONED`: "never overridable, escalate to compliance".
- Issuance refusal copy (open erasure): "This record's payload commitment may be unbound while the erasure request is open. Issue after it resolves, or issue with the field undisclosed." An unanchored source issues and the receipt states `unanchored`.
- Before the first receipt to a new audience, the volume-disclosure warning is mandatory (decision 8). The issuance screen must say what `seq` reveals, e.g. "A receiver who gets receipt 41,288 in March and 58,100 in April knows the issuer made roughly 16,800 governed writes in between."
- Dispute failure classes: Digest mismatch (forensic) · Signature invalid ("A route-2 resolution is the first suspect") · Inclusion path invalid · Audience or expiry ("Procedural, not forensic… Reissue"). "We do not adjudicate… Any request to declare a counterparty wrong is declined in writing."
- Never: key in receipt · fallback to hint · acceptance callback · shared ledger · elan1-operated anchor · "degraded verification mode — partial, best-effort, advisory. A receipt verifies or it does not."

### 1.6 Selective disclosure (E23)
- Mechanism: per-field salted commitments folded into F14 under `elan1_lp_sd_v1`, with salts derived by HMAC from the record salt and keyed on the field name. SD-JWT's construction is used; its JSON container is not ("cite… as prior art").
- Disclosable: payload fields in `proof_binding.fields[]` only. The sixteen fields are always fully disclosed. Gate results are disclosed as a set or not at all. The record salt is never disclosed. Predicate proofs are not in Phase 4. The workaround is to commit an outcome field such as `credit_limit_satisfied: true`.
- `disclosure_profiles[]`: `name`, `fields[]`, `intended_audience_kind` enum `auditor · counterparty · lender · regulator · internal`, `justification` ≥40 chars. Rules L0-S12…S15 (S15 is a lint warning for an empty or whole-set profile).
- Bundle: ninth member `disclosures.jsonl`; `bundle_format` `elan1.evidence.bundle.v2`; manifest `disclosure_profile`, `disclosed_field_counts` ("0 is a value, not an absence"). A v1 verifier exits `4 UNSUPPORTED`.
- Screen copy: "You are revealing 3 of 11 committed fields". "Export ready — 12,480 records, 611 refusals, 22 unanchored, profile in-mca-audit-trail v1, disclosure profile auditor-statutory revealing 3 of 11 fields". "Verify it yourself first. If it does not pass for you it will not pass for them."
- **Verdict table** (must never collapse):

| Situation | Exit |
|---|---|
| Required field disclosed and verifies | `0 PASS` |
| Required field not disclosed | `2 FAIL_PROFILE` |
| Disclosed field digest mismatch | `1 FAIL_INTEGRITY`, naming record and field |
| `disclosures.jsonl` referenced but absent | `3 INCOMPLETE` |
| Salt destroyed by erasure | `0 PASS — payload unbound` ("Never a failure") |
| Field not required and withheld | `0 PASS` |

  "Withheld is not missing, and missing is not altered."
- Eight stated limits, to be shown on a "What disclosure does not hide" panel. Among them: "Disclosure hides values, not shape" · "A low-entropy field is guessable" · "No unlinkability" · "Pre-boundary records are not disclosable" · "A disclosure is irrevocable".
- `GATE.CONSENT_MISSING` when a `personal` field is revealed without consent. The screen offers "capture consent or… drop that field from the profile".

### 1.7 Precedent and earned autonomy (E24)
- Three rules come first: "Nothing crosses a tenant boundary" · "No model in the decision path, and no model in the graduation decision" · "Autonomy is earned and always revocable… There is no API that sets an autonomy level."
- **Action class** = `(tenant_id, write_type, actor_kind, blast_radius)`, "not per agent".
- **Counters**: `submitted`, `refused_by_gate[code]`, `refused_by_policy[rule]`, `escalated`, `approved_unamended` ("The load-bearing counter"), `approved_amended`, `declined`, `expired`, `reversed_in_window`, `corrected_after_window` ("The worst signal"), `sandbox_diverged`. Rolling window 180 days, minimum 90 days of history.
- **Score**: `score_v1(counters) → {value, inputs, version}`, 0–100. Refusal rate is "Neutral". Rule: "Refusals are not failures." Hard bars: `corrected_after_window`, `sandbox_diverged`.
- **Transitions**: A0→A1 and A1→A2 by declaration (grants). **A2→A3 by graduation only.** A3→A4 and A4→A5 are not in Phase 4. Never on `irreversible: true`. Never by graduation on `tenant`/`cross_boundary`. Humans are "granted, not graduated".
- **Eight eligibility conditions**: (1) ≥90 days of continuous history; (2) ≥200 records with ≥100 approvals; (3) `approved_unamended` ratio ≥ threshold; (4) zero `corrected_after_window` and zero `sandbox_diverged` [hard bar]; (5) reversal plan drilled once, dated [hard bar]; (6) no declaration or `policy_version` change in the last 30 days; (7) tenant not stopped and no open P0; (8) `precedent_score` ≥ threshold, computed within 24 h.
- **Graduation**: write type `autonomy.graduate`, `dual_control: true`, `blast_radius: tenant`. "The justification is required and is not pre-filled by us." There is no recommendation ("there is no 'we suggest approving'"). It takes effect at the next write. A **supervised period** of 30 days follows, in which 1 in 10 writes goes to a human, "chosen by the record's own digest". Auto-revert happens below the maintenance threshold ("Reversion is not a failure state").
- **Revocation**, the asymmetry rule: "Lowering it needs one person and one press, takes effect at the next write, and needs no justification at the time." Automatic triggers: any `corrected_after_window`; `reversed_in_window` above the maintenance rate; any `GATE.SANDBOX_DIVERGED`; a declaration version change; a `policy_version` change; tenant stopped; 90 days with no recomputation possible; "The 180-day review falling due without a review" ("Autonomy expires by default. It is not renewed by silence"). Re-proposal needs a fresh 30-day window. Two revocations mean an ADR is needed before a third proposal. If the grant store is unavailable, the class fails closed to A2.
- Codes: `POLICY.AUTONOMY_NOT_EARNED` (new), `GATE.DUAL_CONTROL_SAME_ACTOR`, `POLICY.APPROVAL_DECLINED`, `GATE.PRECONDITION_FAILED`, `POLICY.OBLIGATION_EXPIRED`, `POLICY.DENIED_BY_RULE`, `GATE.SANDBOX_DIVERGED`.
- Score states: `not_measurable — chain continuity over the window is incomplete` (with the gap's seq range) · `stale` (shown with its date; "A stale score may not be used in a graduation").
- A model may summarise on screen "with the underlying counts shown beside it", and may draft justification text only for a human to sign.

### 1.8 Action Receipt open standard (E25)
- Receipt members: `format` (`action-receipt/1`) · `seal_suite` (`elan1-seal-v6`) · `sealed_fields` (F01–F16) · `digest` · `signature` (CL-2+; pure Ed25519, RFC 8032) · `key_id` · `anchor` (CL-3; suite `rfc3161-6962`: path, root, leaf count, token) · `issuer` (`ar-org:`) · `audience`/`nonce`/`expires_at` (CL-4) · `disclosure_suite` (`elan1-sd-v1`) · `disclosures` · `limits` (required).
- Structural rules: no key in the receipt · no optional field inside the sealed set ("a refusal carries zeroes, not omissions") · a domain string in the preimage · the envelope is signed separately over `LP(digest) ‖ LP(audience) ‖ LP(nonce) ‖ LP(expires_at)`.
- Suite registry kinds: Seal · Anchor · Disclosure.
- **13-step verification order** (normative). Outcomes: `UNSUPPORTED`, `AUDIENCE_MISMATCH`, `EXPIRED`, `FAIL_INTEGRITY` (naming field/window), `TRUST_ANCHOR_UNKNOWN`, `UNANCHORED` (reported, not failed), `REPLAYED` (reported). Report echoes the claim, verdict, discovery route, disclosed and withheld counts, and the `limits` verbatim.
- **Conformance levels**: CL-1 Structural · CL-2 Attested · CL-3 Anchored · CL-4 Addressed · CL-D Disclosing. Mapping: L1 Guarded → CL-1 producer ("nothing above may be claimed"); L2 → CL-2 + CL-3; L3 → CL-2 + CL-3 + CL-4 (+CL-D). "Deliberately not merged with elan1's assurance levels." Claims are self-asserted with a published vector run. There is no certification body or mark in v0.
- Licences: spec **CC BY 4.0** · reference verifier **Apache-2.0** · vectors and tampered bundle **CC0** · the name "elan1" and marks: **not licensed**.
- "The verifier is never priced, at any level, to anyone, including non-customers."
- Governance v0.x: elan1 is editor; 60-day public comment period; every comment answered; two independent implementations required. Transfer condition: "three independent implementations… from at least two organisations that are not elan1" moves editorship out within 12 months. Candidate homes: IETF, W3C/OASIS community group, small foundation (not chosen).
- Defect classes: `editorial · substantive · structural`. Acknowledged within 5 working days. "A defective specification version is superseded, never withdrawn."
- Alignment: SCITT (IETF) "[unverified]"; C2PA; RFC 3161; W3C VC / SD-JWT; ISO/IEC 42001 and NIST AI RMF ("Not a format relationship").

### 1.9 Certification and regulator engagement (E26)
- Rule 1: "Nothing is claimed to a regulator or a certification body that a verifier cannot demonstrate."
- Where we stand: "We hold no certification of any kind. No SOC 2, no ISO/IEC 27001, no ISO/IEC 42001, no assessment against NIST AI RMF."
- The three ISO 42001 gaps: AI system impact assessment · Internal audit programme · Management review ("Nothing yet. Real gap").
- Sequencing: "certify to the standard the first paying evidence customer's auditor names". Indian or EU customer: ISO/IEC 42001 first. US software buyer: SOC 2 Type I, with the Type II window opened behind it. Never in parallel.
- Certificate wording: "we hold X, covering Y, issued on Z", and nothing else. "a deck that places a certification logo beside an assurance-level claim is wrong".
- Three-sentence regulator claim, plus the limits table handed over unprompted (quote both on the reviewer-kit page).
- Six reviewer self-checks: obtain the verifier and check SHA256SUMS; rebuild from source; read the source; run it air-gapped; run it on the tampered bundle and watch `1 FAIL_INTEGRITY`; write their own verifier from the spec. Quote: "the strongest thing you can do with this is not use our software."
- We ask for four things: corrections to clause bindings · report vocabulary · a view on the open format · a defect contact. We never ask for "an endorsement, a no-objection letter, a listing, a pilot they must justify, a waiver".
- **Regulators and instruments named** (use as reference data):
  - **MCA**: audit-trail rule for accounting software, in force April 2023 → `in-mca-audit-trail` → pack **ledger1**. Rule 3(1)/11(g) is cited in the corpus outside this set.
  - **CBIC / GST e-invoicing**: the IRP issues the decisive artefact → pack **invoice1**. Watch D4: threshold dropping to ₹2–3 crore.
  - **RBI FREE-AI** (13 Aug 2025): only through a regulated NBFC or bank customer, "Never cold". Collections pack **collect1**, profile `in-rbi-collections v1` (from E27, outside this set).
  - **SEBI** AI/ML consultation (20 Jun 2025, final circular unconfirmed): actor-kind separation.
  - **MeitY** consultations.
  - **Data Protection Board / DPDP**: Rules notified 13 Nov 2025, main obligations 13 May 2027. Consent Manager framework expected 13 Nov 2026 `[unverified]`.
  - **CERT-In Directions 2022**: 6-hour reporting, 180-day logs in India, NTP to NPL/NIC.
  - **EU AI Act**: Art. 50 from 2 Aug 2026; high-risk standalone 2 Dec 2027; in regulated products 2 Aug 2028; Art. 12 record-keeping, Art. 14 human oversight. Notified bodies. EUIPO knockout for names.
  - **TRAI/DLT, TCCCPR, NCPR, 1600-series**: verna1 only (parked).
  - **IRDAI**: not in this document set. The information memorandum records an IRDAI working group constituted 18 June 2026 with an AI audit-framework mandate, and an `insure1` pack. `[gap]` Treat IRDAI as a watch row only. Never show it as engaged.
- Standards: ISO/IEC 42001, SOC 2 (Security mandatory; Availability, Confidentiality, Processing Integrity, Privacy elective; Type I/Type II), ISO/IEC 27001, NIST AI RMF, RFC 3161, RFC 6962, RFC 8032, SCITT, C2PA, SD-JWT.
- **Who speaks**: only the founder, with the elan1 lead for technical detail. "Every regulator interaction is recorded… as a governed write in our own operator chain."

### 1.10 Group vocabulary and decision register: DR numbers for the UI (O01)

| DR | Decision (short) | UI consequence |
|---|---|---|
| DR-001 | One kernel; products never build gates, approval, proof or meter | rung1/stack1 screens call the elan1 layer and never render their own gate UI |
| DR-002 | Temporal owns anything touching a customer's books | Show "Applying your change — retrying" for workflow retry |
| DR-003 | Windmill not adopted in v1 | Licence register row BLOCKED |
| DR-004 | n8n and Inngest excluded | Licence register rows BLOCKED |
| DR-005 | rung1 ERP is the only priced product in Phase 1: ₹2,499 / 7,999 / 19,999 / 49,999+ per month | rung1 pricing table |
| DR-006 | elan1 ships L1 only in Phase 1 | L1 honesty rule |
| DR-007 | verna1 parked | Never a live product in navigation |
| DR-008 | commerce1 parked until Phase 4 and 25 paying | Roadmap shows "Parked — reopens on…" |
| DR-009 | "governance" banned in rung1/stack1 copy | Say "the elan1 layer / elan1 gate check / elan1 approval step / elan1 proof record" |
| DR-010 | "Designed" scores zero in competitive matrices | Competitor study scores shipped only; ours marked `[unverified]` |
| DR-011 | One numbering scheme (P, A, REF-nn, REG-T, G) | Labels |
| DR-012 | Block 7 is `channels` | Declaration viewer |
| DR-013 | `seal` stays in KernelPort at L1 and returns a hash-chain receipt | At L1, show "Proof record" and never "Signed" |

Document-level decisions (E20-D1…8, E22-D1…10, E24-D1…10 and so on) have no DR numbers. `[gap]` Proposal: cite them in the UI as `E24·D7` until they are folded into O01 as DR-014+.

### 1.11 Brand architecture and naming (O10). How each name may appear
- **elan1**: the company, the platform and the layer. Always lowercase, including at sentence start. Domain `elan1.ai` (group, docs, published verifier). Lead sentence at L1: "A governed write path that ends in a hash-chained proof." At L2+: "A governed write path that ends in a signed, hash-chained, exportable proof."
- **rung1**: the product brand, written **"rung1 · by elan1"** "wherever a customer sees it first". Lines: rung1 ERP · rung1 Revenue · rung1 Commerce (brand lowercase, line capitalised, "No Pro, Plus, Premium or Enterprise"). In a rung1 customer screen, elan1 appears in exactly two places: on a proof record ("Checked and recorded by the elan1 layer") and in the footer ("rung1 · by elan1"). No elan1 logo inside a workflow, no "powered by", no second footer. At L2 "the endorsement flips to the front" on export bundles. Lead: "Your agent can change your books, and nothing it changes happens without a rule check, a person who can say no, and a record you can read." Domain not cleared `[unverified]`.
- **stack1**: the runtime. "No separate domain" (a path under elan1.ai). No separate entity in customer copy. On an OEM console: "the operator's brand is the only brand shown… no 'powered by'". Only the header `X-Fusion-Contract: fusion.<name>/v1; impl=<slug>` survives. Lead: "The contract layer and Day-2 operation for the open-source AI stack, so you can replace a component without rebuilding the integration."
- **verna1**: parked (DR-007). If it reopens it is a brand, not a pack. Its name collides with Skit.ai (formerly Vernacular.ai). Do not show it in product UI. It may appear on the roadmap as "Parked".
- **ledger1, invoice1, collect1** (and manufacture1 · retail1 · edu1 · realestate1 · health1 · bank1 · insure1 · telco1 · energy1 · gov1): **packs**. The `*1` suffix is "reserved for vertical packs". A pack is "never a fork, never a codebase, never a brand, and never a line on a public price list under its own name". The UI shows pack ids in lowercase mono, as configuration labels, with no logo and no brand lockup. On pricing, packs sit under "Regulatory pack" with the pack id as a descriptive sub-item. ledger1 = MCA audit trail (first, live Oct 2027 in the model). invoice1 = GST e-invoicing (Apr 2028). collect1 = collections (Oct 2028).
- **Assurance levels are "levels of a claim, never SKUs with brand names"**. On a pricing page, "L2 Attested" names a platform-floor tier. Never add "Pro" or similar.
- **ERPNext**: descriptive only ("rung1 ERP, for ERPNext"). Never in a product or domain name, never in paid ads.
- Banned words: governance (rung1/stack1) · platform/AI platform (elan1 at L1) · signed/tamper-proof/immutable/court-ready/independently verifiable (at L1) · prevented/blocked/cannot (Mode B) · enforced (Mode B) · powered by · Governed Action (as a button or heading) · leverage/robust/seamless/enterprise-grade/best-in-class. The contract adds revolutionary and unlock.

### 1.12 Licence register (O04)
Columns: component · licence · where used (Customer site = box 1 · Internal = box 2 · Paid service = box 3) · verdict `CLEAN · CONDITIONAL · BLOCKED` · action · counsel `Sent · Open · Confirmed`. Standing rule: "Permissive licences only — MIT, BSD, Apache-2.0 — for anything embedded in our paid service."
Rows: ERPNext GPL-3.0 CLEAN · Frappe Framework MIT `[unverified]` CLEAN · Frappe CRM/Helpdesk/Insights AGPL-3.0 CLEAN (customer site) · Twenty AGPL-3.0 + Application Exception CONDITIONAL · Saleor BSD-3 CLEAN · Medusa MIT+EE CONDITIONAL · Superset Apache-2.0 CLEAN · Metabase AGPL/EE CONDITIONAL (internal) · Keycloak Apache-2.0 CLEAN · Chatwoot MIT+enterprise CONDITIONAL · Listmonk AGPL CLEAN (tenant) · Plane CE AGPL CLEAN (internal) · Documenso AGPL CLEAN (tenant) · Windmill BLOCKED for v1 · n8n BLOCKED · Inngest (SSPL v1.0) BLOCKED · Temporal MIT CLEAN · LiteLLM MIT+ee CONDITIONAL · Langfuse MIT+ee CONDITIONAL · vLLM Apache-2.0 CLEAN · LiveKit Agents Apache-2.0 CLEAN · LiveKit turn-detector weights BLOCKED · Pipecat BSD-2 CLEAN · Silero VAD MIT CLEAN · Smart Turn v3 BSD-2 CLEAN. Bifrost is named in O06 as a LiteLLM substitute. Review is quarterly and CI excludes `ee/`/`enterprise/`.

### 1.13 Security, residency and DPDP baseline (O05)
- Residency: **ap-south-1 (Mumbai), three AZs**, single region. "No second region… until a residency decision is written down". Inference runs on vLLM in Mumbai.
- Isolation: RLS on every tenant table; cross-tenant read test in CI; tokens carry one tenant, one actor and one autonomy level.
- Keys: managed KMS per tenant; Ed25519; key register `ACTIVE / RETIRED / REVOKED` with dates; **90-day rotation**; JWKS published; minted target credentials expire in **10 minutes**; break-glass alert within 1 minute.
- Retention classes: Security and access logs ≥1 year (180-day minimum in India) · Audit and proof records **7 years, WORM, India** · Evidence bundles **24 months, WORM** · DB snapshots 30 days · Application logs 180 days.
- Backups: PITR, nightly, 30 days, restore drill at least quarterly. "A backup that has never been restored is not a backup."
- DPDP: **Data Processor** for tenant data, **Data Fiduciary** for our own users; DPA before the first real record; consent ledger ("not a boolean column") with purpose, timestamp, lawful basis and notice version.
- Sub-processor list: name, what they process, region, licence or contract, date added. Published to tenants with notice before any addition.
- Flow A: six-hour CERT-In clock displayed in IST. Tenant stop copy: "Writes are paused for this organisation." Tenant update within 72 h, postmortem within 5 working days.
- Flow B: erasure within **72 hours**; an `irreversible: true` governed write with dual control; salt destruction; success copy "Erasure completed" with a receipt; the chain stays intact.
- Minimum-bar table: 13 controls × rung1/elan1/stack1 = Required. This drives the trust-centre checklist.

### 1.14 Version and compatibility policy (O06)
Identifiers: `kernelport/v1` with header `X-Kernel-Port: v1` · `/v1/...` with `Deprecation`/`Sunset` headers · declaration@version · schema major · `policy_version` · refusal register version · `fusion.gateway/v1` with `X-Fusion-Contract` · rung1 train `2027.02` shown in the console footer.
Notice periods: new refusal code 30 days internal / 60 days external · new KernelPort major 90 days / 12 months · rung order change 180 days / 12 months · withdrawal two quarters / 12 months · emergency security change notified in 30 min with a note in 24 h.
UI strings: `GET /v1/versions` returns four numbers · "Notice contact confirmed" ("No contact, no production key") · 410 "This version was withdrawn on <date>. You were notified on <date>." · "Who has not moved" list · "Withdrawn on <date>" plus export link. Changelog classes are `additive · breaking · fix` ("no fourth class") and it is "readable without a login". Deploy windows: Tuesday and Thursday 21:00–23:00 IST. `latest` is rejected in production.

### 1.15 Shared pricing and metering (O07 + financial model)
- Units: rung1 = band-month + credit · **elan1 = one committed Governed Action** · stack1 = stack-node-year.
- **Refusals meter at quantity zero**, enforced by a database CHECK. Hero copy: "412 refused, ₹0".
- Meters: kernel meter (normative) · runtime meter (`token_in, token_out, gpu_second, byte_stored, page_ingested, tool_call` with `(tenant, team, use_case)`) · credit ledger ("a rendering, not a source").
- "Every meter event carries a `write_id` and the record's `seq`. A line with no `write_id` cannot be invoiced."
- Dispute: "If the record supports the line, the line stands. If it does not, the line is credited in full and a defect is opened against the meter."
- Reconciliation tolerances: kernel meter vs credit ledger **zero** (kernel wins, P2 defect) · runtime vs component counters **0.5%** · untraceable invoice line **zero** (removed and credited) · two brands disagree **zero**. At invoice time, "invoice the lower number and carry the difference as a named open item".
- Anchors: Microsoft Agent 365 $15 per user per month (~₹19,800/month for 15 users at ₹88/$ `[unverified]`) · Salesforce Agentforce $0.10 per action (~₹8.80; the model uses ₹9.00 at ₹90/$) · HubSpot Breeze outcome pricing. "We never price per user or per seat." "We never price on outcomes."
- Internal transfer: ₹0.40 per committed action, refusals ₹0 (from 1 Jan 2027). stack1 charges observed cost + 15%. Measured marginal cost is modelled at ₹0.20.
- Discount authority: rung1 lead may give annual prepay (two months free) or up to 10% off with an end date. Anything more is the founder, in writing. "Nobody" may discount "the elan1 evidence line".
- rung1: bands ₹2,499 / ₹7,999 / ₹19,999 / ₹49,999+ per month by turnover band (only "Scale" is named in the sources). Credits ₹0.80 display and overage; top-ups ₹799 per 1,000 (R13 supersedes R07's ₹499). "An included allowance is a fair-use ceiling, not an entitlement with a cash value." A customisation costs 600–1,800 credits `[unverified]`. Design-partner price lock: 12 months.
- stack1: three-line bill (subscription, CPU node, GPU under management). The flat ₹1.8L/6L/24L ladder is withdrawn. External pilot ₹4.5 lakh for 90 days.
- **elan1 price book** (financial model, Rs, annual unless stated; flat to Mar 2029, then +4% p.a.):

| Item | Price | Unit |
|---|---|---|
| Platform floor, L1 Guarded | ₹1,80,000 | per tenant per year |
| Platform floor, L2 Attested | ₹6,00,000 | per tenant per year |
| Platform floor, L3 Proven | ₹24,00,000 | per tenant per year |
| Sovereign / on-premises deployment | ₹1,20,00,000 | per deployment per year |
| Included governed actions L1 / L2 / L3 | 4,80,000 / 15,00,000 / 42,00,000 | per tenant per year |
| Beyond allowance L1 / L2 / L3 | ₹1.60 / ₹1.20 / ₹0.90 | per action |
| Sovereign action | ₹0.55 | per action |
| Internal transfer to rung1 | ₹0.40 | per action |
| Regulatory pack (blended) | ₹1,35,000 | per tenant per year |
| Evidence bundle beyond allowance | ₹2,500 | each |
| Verifier profile | ₹3,00,000 | per regime per year |
| Counterparty verification seat | ₹45,000 | per year |
| Partner certification | ₹1,50,000 | per firm per year |

  Notes: "Refusals are metered at quantity zero and are never billed." "Included-action allowances are consumed first." Partners keep 18% of list on partner-sourced revenue. Planning volumes per tenant per month: L1 72,000 · L2 3,00,000 · L3 12,50,000.
- `[conflict]` E20 says cross-organisation verification's commercial shape "is an open question". The model prices a "Counterparty verification seat ₹45,000/yr". E25 says the verifier is never priced. The UI must label the seat as receiving-side console access (register, binding, dispute log), never as the verifier. Show "The verifier is free, to anyone" beside it.
- `[conflict]` "Verifier profile ₹3,00,000 per regime per year" must be distinguished visibly from the verifier (free).

### 1.16 Competitor watch list: every name (O08, O12, O07, E25, E26)
Threat classes: **A** incumbent bundling · **B** an open-source host moves up · **C** price collapse · **D** a regulator or a standard changes the game. Row status `unchanged · moved · triggered`, or "not checked" ("never no change").

| # | Name | One-line position (from sources) |
|---|---|---|
| A1 | ServiceNow | AI Control Tower. "The largest single threat in the group" if it adds approvals or writes into systems of record it does not own. Gartner MQ Leader |
| A2 | Microsoft | Agent 365 at $15/user/month, Purview for Agent 365. Threat if governance becomes included or it adds a per-action business-write record |
| A3 | IBM | watsonx.governance documents models. Threat if it "signs or chains a decision". MQ Leader; Forrester AI-adjacent wave Q3 2025 leader |
| A4 | Boomi | Agent Control Tower, Agentstudio, AI Gateway after the **Lunar.dev** acquisition. Folding governance into integration |
| A5 | Palantir | AIP action governance on Foundry. Threat if offered against non-Foundry systems of record or as a receipt-shaped artefact. Its ontology is the E03/E21 comparison target |
| A6 | Airia | Agent governance. Threat if acquired or bundled. MQ Visionary |
| A6 | Zenity | Agent security. Threat if acquired or bundled into a Microsoft, ServiceNow or CrowdStrike-class product |
| A7 | Zoho | Zia generating schema-level change in Zoho Books/Inventory with an approval record. Zoho One bundling (C3) |
| A8 | Odoo | Native AI moving from assisting to mutating the app, with a gate |
| A9 | Tally | Tally shipping an agent or ERP-class inventory/manufacturing. rung1 migrates books out of Tally |
| A10 | NVIDIA | Bundling a substitution guarantee or conformance attestation (NVIDIA AI Enterprise) |
| A10 | Red Hat | Red Hat AI with component portability as a guarantee |
| B1–B3 | Frappe | Flow, Builder AI, Studio, a ledger-aware gate, Frappe Cloud V2. About 30,000 sites. "The single most consequential pair" (B1/B2); rung1 kill criterion 3 |
| B4 | Crator | cratorlabs.ai. Attach mode, ₹ pricing, Tally migrator. "Has held SOC 2 since April 2026 [unverified]" |
| B5 | Lab0 | Threat if it lands on Frappe or in India |
| B5 | Trope | Same trigger as Lab0 |
| B6 | TrueFoundry | Threat if it adds a substitution guarantee or moves to per-node pricing |
| B7 | Rafay | Capability contracts or an AI cost ledger rather than node management |
| B8 | Shakudo | Tested substitution path with a conformance artefact |
| B9 | Indian ERPNext partners (200+ certified) | Any ships an agent with an approval record |
| C1 | SAP (with Microsoft, ServiceNow, Boomi) | Governance becomes an included capability. MQ Niche |
| C2 | Salesforce Agentforce | $0.10 per action anchor. Trigger if a major vendor goes below ₹4 per action |
| C2 | HubSpot Breeze | Outcome pricing. We refuse this shape |
| C4 | Elestio · Coolify · the oss-llmops-stack (Langfuse reference stack) | Hosting floor below $14 per service |
| C5 | Frappe Cloud | Bundling agent tooling into the site price |
| C6 | Ourselves | Cost per governed action above the transfer price for two months |
| D2 | Credo AI | Threat if it ships a signed or chained decision record or a receipt format. MQ Visionary; Forrester Q3 2025 leader |
| D2 | Trustible | Same trigger as Credo AI |
| D6 | Gartner AI Governance MQ (June 2026) | Zero inclusion criteria require verifiable evidence |
| MQ | Truyo | Leader |
| MQ | ModelOp · Monitaur · OneTrust | Visionaries |
| MQ | Holistic AI | Challenger |
| MQ | Relyance · Cranium · Saidot | Niche (with SAP) |
| Std | SCITT · C2PA · SD-JWT/W3C VC · BBS+ | Adjacent standards (E25). Not competitors, "no liaison work" |
| Name | Skit.ai (formerly Vernacular.ai) | Name collision for verna1 |
| Components | Langfuse, Portkey (acquired), Open WebUI (relicensed), Bifrost, LiteLLM | Licence-watch items (D7) |

Market facts (O12): category ~$492M in 2026 and >$1B in 2030 (Gartner); >100 vendors claim the capability; 13 met the inclusion criteria; 0 criteria require verifiable evidence. Line to use: "The industry signs what an agent was allowed to do and does not sign what it did."

### 1.17 Roadmap and gates (O02, O09, P-indexes, financial model)
- Phase 1 (to Dec 2026): rung1 ERP, elan1 L1, stack1 as customer zero. Phase 2 (Q1–Q2 2027): Attach, Tally, L1 GA, conformance, first pilot. Phase 3 (Q3 2027–Q1 2028): L2 signing Q3 2027, RFC 3161 anchoring Q4 2027, first India pack Q1 2028, stack1 GA Q4 2027. Phase 4 (2028 on): L3, standard, rung1 Commerce, stack1 scale or spin-out (decision "no earlier than 1 October 2028", S18 via P4-00; O11 says due Q2 2028 `[conflict]`).
- **Gate 1**: "a real customer's write verifies offline", end Q1 2028 (31 Jan 2028 on the critical path). **Gate 2**: "app three renders its four doors from its Declaration with zero lines of hand-written screen code", end Q1 2028.
- Critical path items 1–6: L2 signing (30 Sep 2027) → key custody (31 Aug 2027) → RFC 3161 TSA contract (31 Oct 2027, live 31 Dec 2027) → Merkle anchor job (30 Nov 2027) → offline verifier and vectors (31 Dec 2027) → first India pack (31 Jan 2028).
- Rung ladder (O12): R1 first paying customer · R2 adapter survives a second system of record · **R3 gating rung**: third party pays for a governed write · R4 a stranger accepts the proof · R5 "The receipt outlives the vendor". All Open.
- Kill criteria for the elan1 kernel include p50 ≤120 ms, p99 ≤450 ms, and "30 June 2027 passes with no third party… integrated against KernelPort".
- Financial-model gate calendar: Mar 2027 Series A tranche 1 ₹63 cr · Q2 CY2027 L1 GA · Jul 2027 first external tenant · Oct 2027 ledger1 live · **Apr 2028 L2 GA** · Apr 2028 invoice1 · Oct 2028 collect1 and Gate A (₹72 cr) · Jul 2029 Gate B (₹45 cr) and first sovereign deployment · **Oct 2029 L3 entry** · Apr 2029 price escalation.
- `[conflict]` O09 puts L2 live in Q3–Q4 2027. The model puts L2 GA in Apr 2028 and L3 in Oct 2029, while E20/P4-00 say Phase 4 runs "from 2028". Public roadmap copy should show gates and conditions, not dates, per E20 ("L3 engineering does not begin on a date. It begins on an event").
- `[conflict]` O12 says tranche D (L3) is "Not this money". The model's Gate B releases ₹45 cr "on evidence of L3 entry readiness". The sovereignty rule says the Moonshot is funded only from free cash flow or a prior exit.

### 1.18 Group operating model and investor numbers (O11, O12, model)
- Entities: Holdco elan1 (kernel, P3 and below, schema, trademarks, Action Receipt grant, Moonshot Office) · Opco rung1 · Opco stack1 · Opco verna1 (only if reopened). All `[unverified]`, none incorporated.
- Bodies: **Telos Council** (founder plus two, at least one outside; owns objective, layer ratios and Coherence Matrix) · Milk Operating Committee (rung1, monthly) · Mountain venture boards (elan1 kernel; stack1) · Moonshot Office (no P&L).
- Layer bands: 60–70 Milk / 20–30 Mountain / 5–15 Moonshot. O02 split 75/20/5, a breach defended in writing. Coherence target 7.0; below 5.0 "we are a conglomerate". Divest-or-justify applies at a score ≤3 with >5% of resources.
- Moonshot sentence: "Every consequential action software takes on a business's behalf ends in a receipt that anyone can check — in any system, ten years from now, whether or not elan1 exists."
- Board number page: 15 fixed rows. "Every cell is either a measurement with a source or the word not yet measured."
- Model key numbers:
  - Series A ₹180 crore / US$20M in three tranches (₹63 cr Mar 2027, ₹72 cr Oct 2028, ₹45 cr Jul 2029) plus an ₹8 cr bridge (Oct 2026).
  - Minimum cash ₹4.4 cr in Feb 2027. ₹90 = US$1.
  - Revenue FY27 ₹0.01 cr · FY28 ₹1.89 cr · FY29 ₹18.08 cr · FY30 ₹81.18 cr · FY31 ₹230.32 cr.
  - Exit ARR FY31 ₹334.2 cr. Paying tenants 0/39/148/312/545. Headcount 27/95/170/243/305. Certified partner firms 0/6/28/70/140. Sovereign deployments 0/0/0/4/11.
  - FY31 tenants: L1 279, L2 211, L3 55.
  - Governed actions FY31 2,491 million (internal 280M).
  - Revenue per action ₹0.92 against cost ₹0.13 (FY31). Cost per GA falls from ₹0.092 to ₹0.052.
  - EBITDA positive from Aug 2030. The downside scenario runs out of cash (−₹157.9 cr).
  - rung1 targets: gross margin 56% at month 12, 68% at month 24, 40% floor, inference COGS ≤22%.
- `[conflict]` The whole model is "prepared for Series A investors" while O12 asks "Do we raise at all before R1 closes". Label every number on investor and board screens "Target — not yet measured" until it is measured.

---

## 2. Screen inventory

Legend: **Door/surface** · **Route** · **Persona** · **Fields** · **Actions → target** · **Empty/error copy** · **AL** (lowest Assurance Level at which the screen is live; below that level it renders as a locked explainer, never with fake signatures).

### Assurance door (`door: 'assurance'`)

**A-01 Assurance overview** · `#/assurance` · Evidence owner, compliance head.
- Fields: current level pill (L1/L2/L3) with its one-line meaning from E07 ("L1 says the write was controlled, L2 says a stranger can check that, L3 says the record survives us"); chain health (continuity, last nightly integrity run, unanchored head count at L2+); counts this month (committed, refused, "₹0 for refusals"); active Regulations with blocking-clause status; receipts issued and received (L3); autonomy grants at A3 (link to Agents).
- Actions: "Export evidence" → `#/assurance/evidence/export`; "Upgrade level" → `#/assurance/plan/upgrade`; "View limits" → drawer.
- Empty (L1): "Records are hash-chained and checked by the elan1 layer. They are not signed at Level 1, so there is no signature or anchor to show here. Signing arrives with L2 Attested." AL: L1.

**A-02 L3 readiness (entry condition and definition of done)** · `#/assurance/l3` · Founder, elan1 lead (operator view); tenant sees read-only.
- Fields: the entry condition as a four-row checklist (test, evidence, status `met/not met`, dated artefact link); the 12 done items with "How we know"; the claim-boundary tables (true/false sentences).
- Actions: open artefact → `#/records/:seq`.
- Empty copy: "L3 has not started. It begins when an outside auditor has accepted an L2 bundle in a real engagement and said so in writing. Until then elan1 is an L2 business, and says so plainly." (E20 decision 8). AL: L2.

**A-03 Regulations** · `#/assurance/regulations` · Compliance officer, regulation author.
- Table: `regulation_id` (mono) · regime_name · issuer · jurisdiction · version · status · clauses (bound / out_of_scope / not_measurable counts) · blocking unmet · profile id@version · min AL · certified by / at.
- Actions: row → `#/assurance/regulations/:id`; "New regulation" → `#/assurance/regulations/new`.
- Empty: "No regulation is bound to this tenant. A regulation turns 'we comply with the MCA audit-trail rule' from a claim in a deck into a query. Add one from a pack (ledger1, invoice1, collect1) or author one." AL: L2 (min_assurance_level ≥2 for non-repudiation).

**A-04 Regulation detail** · `#/assurance/regulations/:id` (query `?v=2`) · Compliance officer, auditor (read).
- Header: regime_name, issuer, `instrument_ref`, `rule_as_at`, `in_force_from/to`, version selector (immutable versions), certifier ≠ author.
- Clause table: `clause_ref`, `clause_text` (quoted, serif-free mono block), obligation_kind, severity, disposition chip, `expects_controls` (C-ids@v), check_ids.
- Profile-window timeline: profile versions with `applies_to_records_from/to` and record counts per window.
- Actions: clause → `#/assurance/regulations/:id/chain/:clause`; "Validate" (runs L0-C/R, results inline); "Simulate" → drawer with per-clause `established · unmet · not_disclosed · not_applicable`; "Record a clause change" → `#/assurance/regulations/:id/change`; "Submit for certification" → creates a dual-control governed write → `#/work/decide/:id`.
- Errors: L0-R06 quote; `POLICY.DECLARATION_UNRESOLVED` naming `(declaration_id, version)`; "Registry unavailable. Nothing was registered. Retrying is safe." AL: L2.

**A-05 Five-link chain viewer** · `#/assurance/regulations/:id/chain/:clause` · Auditor, compliance officer.
- Visual: five nodes left to right (Clause → Control → Gate → Write type → Proof field), each showing name@version and resolution state (resolved / broken with the failing link named). Uses the 50° house angle on connectors.
- Fields per node: e.g. `C-AT-01 v1 preventive · per_event`; gate `precondition` in `erp_sales_invoice v7`, enabled; write types (3); fields F04, F09, F10, F16, F03 plus `proof_binding` fields.
- Empty or broken copy: "A control that cannot name its gate is prose." Offer "Mark not_measurable" with reason and would_change_if (≥12 chars each). AL: L2.

**A-06 Regulation author and certify** · `#/assurance/regulations/new` and `#/assurance/regulations/:id/edit` · Regulation author (then a separate certifier).
- Stepper following E21 Flow 1: 1 Clauses (paste verbatim; clause count; instrument dates) · 2 Controls per clause · 3 Chain resolution preview · 4 Validate · 5 Generate profile binding (compiled map; both-direction failures listed) · 6 Simulate on the reference tenant fixture · 7 Submit for certification.
- Actions → `#/work/decide/:id`. Refusal: `GATE.DUAL_CONTROL_SAME_ACTOR`, "You wrote this regulation, so you cannot certify it. Choose a certifier who is not the author." AL: L2.

**A-07 Clause change** · `#/assurance/regulations/:id/change` · Regulation author.
- Fields: amended clause_text, new rule_as_at, auto-computed change class (Editorial / Tightening / Loosening / Structural); blast-radius counts at all five links (clauses, controls, gates, write types, tenants); ADR link (required for Loosening); `applies_to_records_from` (never before the obligation's effective date).
- Refusal copy: "This would judge records by a rule that did not exist when they were written." · L0-R05 shortfall: "Your tenant runs at L1; this regulation now requires L2. Upgrade first." → `#/assurance/plan/upgrade`. AL: L2.

**A-08 Controls register** · `#/assurance/controls` · Compliance officer.
- Table: control_id · version · name · kind · operating_mode · status · write types · gates · `operated_throughout` result for the current period (Yes / No / Not measurable) · named-by clauses (orphan flag per L0-R03).
- Actions: row → `#/assurance/controls/:id`; "Run test for period" → result drawer.
- Empty: "No controls yet. A control is one assertion with a named gate and a stated population. A control that asserts two things is two controls." AL: L2.

**A-09 Control detail** · `#/assurance/controls/:id` · Compliance officer, auditor.
- All E21 control fields grouped as identity / coverage / evidence expectation / test / certification. Result panel: "C-AT-01 operated throughout 1 Apr 2028 – 30 Jun 2028 over 18,442 records: Yes".
- Actions: version history; open failing records → `#/records?control=C-AT-01`. AL: L2.

**A-10 Evidence export (with disclosure profile)** · `#/assurance/evidence/export` · Evidence owner.
- Fields: range (seq or date), verifier profile, **disclosure profile** (L3), pre-generation summary (record count, refusal count, unanchored head), revealed list (field, classification) **and** withheld list, "You are revealing 3 of 11 committed fields", canonicalisation-boundary warning with sub-ranges.
- Actions: "Export" (governed write) → progress → "Export ready — …" → download; "Verify it yourself first" → `#/verify`.
- Errors: range crosses the boundary → offer two sub-ranges; `GATE.CONSENT_MISSING` → "Capture consent" or "Drop this field (creates a new disclosure profile, which is a new declaration version)".
- L1 state: bundle export locked. "At Level 1 there is no signed bundle to export. You can export the hash-chained log for your own review; a third party would have to trust our infrastructure to rely on it." (E11 spirit.) AL: L2 (disclosure: L3).

**A-11 Disclosure history** · `#/assurance/evidence/disclosures` · Evidence owner, DPO.
- Answers "what did we show that lender in 2029". Table: date · recipient kind · disclosure profile · range · fields revealed (names) · withheld count · bundle digest (mono, truncated with copy) · exported by · record seq.
- Empty: "Nothing has been disclosed from this tenant. Every export will appear here with the fields it revealed, because a disclosure cannot be taken back." AL: L3.

**A-12 Disclosure profiles** · `#/assurance/disclosure-profiles` · Declaration author.
- Per declaration version: profile name, audience kind, fields (subset chips), justification, lint (S15), personal-field consent requirement (S14).
- Actions: "New profile" → declaration editor (new version). AL: L3.

**A-13 Receipts: issued** · `#/assurance/receipts/issued` · Finance ops, evidence owner.
- Table: receipt digest · source seq · write type · audience (`ar-org:`) · disclosed fields · key_id · anchored/unanchored · expires · issued-record seq · reversal-in-chain warning.
- Actions: "Issue receipt" → `#/assurance/receipts/issue?seq=41288`; row → `#/assurance/receipts/:id`.
- Empty: "No receipts issued. A receipt lets a counterparty check one write without trusting your vendor or theirs. Issue one from any signed record whose write type names a counterparty." AL: L3.

**A-14 Issue receipt** · `#/assurance/receipts/issue` · Finance ops.
- Fields: source record summary, counterparty (from register), disclosure profile with the revealed field list by name and classification, expiry (bounded choice), anchored state. First-time-audience **volume disclosure warning** (mandatory checkbox to proceed): "Receipts disclose your governed-write volume between them. Anyone holding two receipts from you can see roughly how many writes you made in between. If you cannot accept that for this counterparty, do not issue receipts to them."
- Errors: `GATE.COUNTERPARTY_UNKNOWN` → "Register this counterparty first" → `#/assurance/counterparties/new`; `GATE.COUNTERPARTY_SANCTIONED` → "This counterparty is on a sanctions list. This cannot be overridden. Escalate to compliance." (no override button); key unavailable → "No receipt was issued and nothing partial exists."
- Success toast: "Receipt issued — record 41,288, audience ar-org:acmetextiles.example, expires in 7 days". AL: L3.

**A-15 Receipts: received and verify** · `#/assurance/receipts/received` · Receiving finance ops.
- Inbox: received receipts with verdict, route, disclosed fields, and binding status (Not bound / Bound at record n / Refused code).
- Actions: "Verify a receipt" (drop file) → claim echo → verdict; "Bind into our chain" → `receipt.accept` (dual control) → `#/work/decide/:id`.
- Errors: the six receiver codes with the "Receiver does" copy. `POLICY.RECEIPT_UNVERIFIED` shows forensic styling (critical) and no "negotiate" actions. AL: L3.

**A-16 Receipt detail** · `#/assurance/receipts/:id` · Either side.
- Fields: the claim echo (issuer, audience, source write type, disclosure list, expiry, anchored); the 13 verification steps with pass/fail/reported; discovery route line; the sixteen fields (always shown); disclosed values with commitment check; binding record (both seqs); limits line verbatim.
- Actions: "Open dispute" → `#/assurance/receipts/:id/dispute`; "Ask issuer for reversal receipt" (copy text only, no callback). AL: L3.

**A-17 Dispute** · `#/assurance/receipts/:id/dispute` · Either organisation.
- Steps: capture exact bytes (upload; hash shown) → run published verifier version X (both parties' runs, exit codes) → failure class → next move → bundle request.
- Banner: "elan1 does not adjudicate between two organisations. We supply the specification, the verifier and our own records about our own conduct." AL: L3.

**A-18 Counterparty register** · `#/assurance/counterparties` · Compliance, finance ops.
- Table: org_id · display name · status (active / unknown / sanctioned) · route (Pinned fingerprint / Key document / Trust anchor) · accepted key_ids with windows · first seen · last verified · "Accepted on a pinned fingerprint since March 2028" line.
- Actions: "Register counterparty" (governed write) → `#/assurance/counterparties/new`; "Pin fingerprint" (out-of-band entry, shown as the strongest route).
- Empty: "No counterparties registered. The counterparty gate refuses any write that names an unregistered counterparty, so register one before issuing or accepting receipts." AL: L1 (register exists at L1; key columns L3).

**A-19 Keys and custody** · `#/assurance/keys` · Security owner.
- Fields: key register (key_id, class, status ACTIVE/RETIRED/REVOKED, valid_from/to, successor, custody = elan1 KMS / customer HSM, residency domain ap-south-1); rotation due (90 days); customer-held key ceremony record; "Records we signed for you: 0" proof panel for customer-held tenants (E20 done-item 7); JWKS URL.
- Actions: "Rotate" (dual control) → `#/work/decide/:id`; "Revoke" (incident) → compromise procedure.
- L1 state: "Level 1 records are hash-chained, not signed. There are no signing keys for this tenant yet." AL: L2 (customer-held: L3).

**A-20 Security and residency** · `#/assurance/security` · Security owner, DPO, procurement reviewer.
- Sections: Residency ("ap-south-1 Mumbai, three availability zones. No data outside India. No second region."); Isolation (RLS status, last cross-tenant read test); Retention classes table; Backups (last restore drill date, result); Sub-processors (list, date added, notice log); Incident contact (CERT-In responder; six-hour clock policy); Erasure policy (72 h); DPA status; consent ledger link.
- Every row has evidence: a date and a link, or "not evidenced" (never ticked without evidence). AL: L1.

**A-21 Usage and meter** · `#/assurance/usage` · Finance head, rung1 lead (internal).
- Fields: period selector; committed actions; refusals with "₹0"; allowance used YTD against the included amount; overage at the level rate; by write type; by actor kind; a reconciliation status chip (kernel vs ledger: 0 difference / open items).
- Actions: line → `#/assurance/usage/lines/:writeId` (resolves to the record); "Invoices" → `#/assurance/usage/invoices`.
- Empty: "No governed writes this period. Refusals would appear here at ₹0; they have not happened either." AL: L1.

**A-22 Invoice detail** · `#/assurance/usage/invoices/:id` · Finance head.
- Lines: platform floor (pro-rata), overage actions, regulatory pack, evidence bundles beyond allowance, verifier profile, counterparty verification seat, refusals line at ₹0, credits, open items ("difference carried as a named open item, owner, date").
- Actions: "Dispute a line" → reconciliation drawer (records list); "Download".
- Copy: "Every line resolves to hash-chained records. If a record does not support a line, the line is credited in full." AL: L1.

**A-23 Meter line / reconciliation** · `#/assurance/usage/lines/:writeId` · Finance head, auditor.
- Fields: write_id, seq, write type, actor, outcome, basis (blast radius), quantity (0 for refusals), price, record link, `meter.reconcile()` last run and result. AL: L1.

**A-24 Plan and level** · `#/assurance/plan` · Owner, finance head.
- Fields: current plan (L1 Guarded ₹1,80,000/yr, 4,80,000 actions), next-level comparison, packs attached, contract dates, discount end date (mandatory), "The verifier is free, to anyone" note.
- Actions: "Move to L2 Attested" → `#/assurance/plan/upgrade?to=L2`. AL: L1.

**A-25 Level upgrade** · `#/assurance/plan/upgrade` · Owner (plus second approver).
- Steps: what changes (signature from a named seq onward; "everything before it stays Level 1 forever", E19); price delta; key custody choice (elan1 KMS / customer HSM at L3); boundary preview ("Records 1–38,211 stay L1. Signing starts at the next record."); approval (dual control) → `#/work/decide/:id`. AL: L1→L2, L2→L3.

**A-26 Versions and notices** · `#/assurance/versions` · Integrating developer.
- Fields: the four numbers from `GET /v1/versions` (port major, schema major, refusal register version, policy version); pinned declaration@version; notice contact (named human, confirmed date); deprecation notices received (date sent, surface, sunset, migration engineer); headers seen.
- Actions: "Set notice contact" (required for a production key).
- Copy: "No contact, no production key: a consumer we cannot write to is a consumer we cannot honour this policy towards." AL: L1.

**A-27 Certification dossier** · `#/assurance/certification` · Founder, security and compliance lead, prospective customer (redacted).
- Top banner (until a certificate exists): "We hold no certification of any kind. No SOC 2, no ISO/IEC 27001, no ISO/IEC 42001, no assessment against NIST AI RMF."
- Two mapping tables (ISO/IEC 42001 requirement → what we would build → what we already produce; SOC 2 criterion → what we already produce), with gap rows (impact assessment, internal audit, management review) in warning state; sequencing rule; cost rows `[unverified — obtain three quotes]`.
- Certificate card format once held: "We hold X, covering Y, issued on Z". Never beside a level pill. AL: n/a (operator).

**A-28 Supervisor / reviewer pack builder** · `#/assurance/reviewer-pack` · Tenant compliance head (the customer leads a supervisor conversation).
- Fields: the three claim sentences (locked text), the limits table (locked, always included), selected bundle and disclosure profile (`intended_audience_kind: regulator`), verifier release and digest, key fingerprint delivery note ("give the fingerprint through a channel other than the bundle"), the six self-check steps.
- Actions: generate pack (governed write) → download; link to the public reviewer kit `#/reviewers`. AL: L2.

**A-29 Standard and conformance (tenant view)** · `#/assurance/standard` · elan1 lead, integrating developer.
- Fields: `action-receipt/1`, suites in use, conformance claimed (producer: CL-2+CL-3+CL-4+CL-D at L3; CL-1 at L1), last vector run (64 vectors, tampered bundle refused), second-implementation agreement ("Empty diff"). AL: L1 (CL-1).

### Agents door (`door: 'agents'`)

**G-01 Autonomy (action classes)** · `#/agents/autonomy` · Tenant owner role.
- Table: action class (write_type · actor_kind · blast_radius), current level (A2/A3/"A3 supervised until 14 Oct 2028"), precedent score with version (`score_v1`), window (180 d), eligibility verdict (Eligible for A3 / first failing condition / Never: irreversible / Never by graduation: tenant scope), last recomputed.
- Filters: eligible · supervised · revoked · not measurable.
- Empty: "No agent has written through this tenant long enough to have precedent. A class needs 90 days of continuous history and 200 records before it can be considered." AL: L1 (E20 Q6 asks whether earned autonomy is L1-capable; the UI works at any level, while the graduation-in-bundle claim needs L2+).

**G-02 Action class detail** · `#/agents/autonomy/:classId` · Owner, auditor.
- Panels: counters in full (all 11, with refusals by gate code); score with inputs, function version and seq range; the eight conditions checklist, hard bars flagged; reversal plan and drill date; model summary sentence **beside** the counts, labelled "Summary written by a model. Check it against the counts."; supervised period panel (sampling "1 in 10, chosen by record digest", samples routed, outcomes); graduation and revocation history with seqs.
- Actions: "Recompute" (same numbers or a P0); "Propose A3" → `#/agents/autonomy/:classId/propose` (disabled with the failing condition named when ineligible); "Revoke to A2" (one press, confirm modal, no justification required).
- States: `not_measurable — chain continuity over the window is incomplete (seq 88,120–88,164)`; stale score "Last computed 26 Sep 2028 — stale. A stale score cannot be used in a graduation." AL: L1.

**G-03 Propose A3** · `#/agents/autonomy/:classId/propose` · Owner (proposer).
- Fields: class, current → proposed level, evidence snapshot (read-only), reversal plan and drill date, supervised-period terms, **justification (required, empty, "not pre-filled by us")**, an optional "Draft with a model" that fills the box visibly marked as a draft the human must edit and sign, approver picker (cannot be self).
- Action: "Submit for approval" → `#/work/decide/:id`. Refusal `POLICY.AUTONOMY_NOT_EARNED`: names the condition and what would change it. AL: L1.

**G-04 Autonomy history** · `#/agents/autonomy/history` · Auditor.
- The audit-trail table from E24 §06 (question → answered by) plus the list of graduations and revocations (trigger, who or what, effective seq, counters at that moment). AL: L1.

### Work door (`door: 'work'`)

**W-01 Decide: graduation** · `#/work/decide/:id` (type `autonomy.graduate`) · Second named approver.
- Shows numbers, justification verbatim, function version, seq range, supervised terms. **No recommendation.** Approve / Decline (basis required on decline → `POLICY.APPROVAL_DECLINED`).
- Refusals: same actor → "You proposed this graduation. A second named person must decide it."; stale score → "The score is older than 24 hours. Recompute before deciding." AL: L1.

**W-02 Decide: receipt.accept** · same route, type `receipt.accept` · Two approvers (cross_boundary forces dual control).
- Shows the verifier result as a gate input, route, disclosed fields and issuer. AL: L3.

**W-03 Decide: certification (regulation, control, profile, standard publication, key rotation)** · same route · Certifier ≠ author. AL: L2.

**W-04 Supervised samples** · `#/work/approvals?filter=supervised` · Approvers.
- 1-in-10 sampled A3 writes, labelled "Supervised sample — this class acts at A3 until 14 Oct 2028". AL: L1.

### Records door (`door: 'records'`)

**R-01 Record detail (additions)** · `#/records/:seq` · Any.
- Adds: "Issue receipt" (L3, when the write type names a counterparty); boundary badges ("Signed from seq 38,212" / "Selectively disclosable from seq 51,004"); F11 autonomy with a link to the graduation record; Mode B flag "Performed by the caller, not the kernel". L1: no signature row (honesty rule). AL: L1.

**R-02 Boundaries** · `#/records/boundaries` · Auditor.
- Timeline of the L1/L2 signing boundary and the `elan1_lp_v1`→`elan1_lp_sd_v1` canonicalisation boundary, with counts on each side. Copy: "Nothing is recomputed, nothing is re-signed, and nobody may say a pre-boundary record is disclosable." AL: L2.

**R-03 Erasure requests** · `#/records/erasure` and `#/records/erasure/:id` · DPO, tenant admin.
- Fields: reference, requester verification, 72-hour clock, erasure plan (every location), two approvals, per-location result, the retained-with-erased-identifiers state, receipt.
- Refusal copy: statutory retention conflict "refused in writing with the obligation named and the date it expires". Failed job: "The case stays open. It is never closed by a partial success." AL: L1.

### Public website (`layout: 'public'`)

**P-01 Home** · `#/site` · Buyer, auditor, CA. Lead sentence per the current level (L1 wording until L2 ships). Three paths: rung1 · by elan1 (SMB), elan1 (enterprise, auditor), reviewers.

**P-02 Pricing** · `#/site/pricing` · Buyer.
- The three level tiers (floor, included actions, overage), sovereign ("priced as a deployment"), regulatory pack, evidence bundle, verifier profile, counterparty seat, and the rung1 bands table.
- Fixed copy: "Refusals are metered at quantity zero and are never billed." "We never price per user or per seat." "The verifier is free, to anyone, including non-customers." "Prices are flat to March 2029."
- `[gap]` The external list price is not decided (O07 Q2). Show "List price set at L1 GA" until the founder signs.

**P-03 Action Receipt standard** · `#/site/standard` · Implementers.
- Spec version, status word ("Published", never "Open", until done-item 4), licences table, suite registry, conformance levels, vectors and tampered bundle downloads, changelog, open comment period (60-day countdown), answered comments, implementation results.

**P-04 Implementations register** · `#/site/standard/implementations` · Implementers.
- Columns: organisation · producer/consumer · levels · suites · spec version · vector-run link · date. Disagreements are listed first.
- Empty: "No implementation by another organisation has passed the conformance suite yet. Until one does, this specification is published, not open."

**P-05 Defect report** · `#/site/standard/defects` · Anyone, with no account.
- Form (bytes upload), register with class, status and erratum. "Acknowledged within five working days."

**P-06 Verifier download** · `#/site/verify` · Reviewer. Releases, SHA256SUMS, release signature, rebuild instructions, "Standard library only, empty lockfile", superseded releases (never deleted).

**P-07 Reviewer kit ("For reviewers and supervisors")** · `#/reviewers` (layout bare) · RBI/SEBI/EU authority reviewer, notified body, certification auditor.
- The three claim sentences, the limits table, the six self-check steps, the four things we ask for, the defect contact.
- Footer rule: "We do not ask regulators for endorsement. No regulator has reviewed or approved elan1." `[proposal]` Word it as "No regulator has reviewed a verifier profile" to match E26 exactly.

**P-08 Trust centre** · `#/site/trust` · Procurement and security reviewer.
- Certifications (the no-certification statement), residency, retention, sub-processors, incident policy, DPA, security baseline (the 13-row minimum bar), limits of the claim, and banned claims we never make.

**P-09 Status** · `#/site/status` · Integrators.
- Components: kernel API `/v1`, MCP surface, meter pipeline (lag p99 ≤30 s), anchor service (anchor lag), verifier release channel, console. Latency envelope p50/p99 shown only when measured ("MEASURE THIS").
- Incident history. "Unanchored" is a stated property, not an outage.

**P-10 Roadmap and gates** · `#/site/roadmap` · Buyer, investor.
- Levels as gates with conditions, not dates. Parked items with reopen conditions (rung1 Commerce, verna1). The rung ladder R1–R5 marked Open or Closed with evidence.

**P-11 Changelog** · `#/site/changelog` · Developers, no login. Entries classed additive/breaking/fix, surface and major, train `YYYY.MM`, and links to dated notices.

**P-12 Partner programme** · `#/site/partners` · CA firms, audit firms, SIs, GPU operators, platform OEMs.
- Partner types; levels and what each may claim (`[gap]` levels not specified); ₹1,50,000/firm/yr certification; partners keep 18% of list on partner-sourced revenue; the rule that no partner or SI may speak to a regulator for us.

### Counterparty verification portal (`layout: 'bare'`, no login)

**V-01 Verify a receipt** · `#/verify` · A receiver who may not be an elan1 tenant.
- Drop the file. The page echoes the claim first, then asks for the org_id and discovery route (pinned fingerprint input, or fetch the key document; this is the only network step and it is shown).
- Verdict page `#/verify/result`: the 13 steps, the route used, disclosed and withheld counts, and the limits line.
- Must state: "This check runs in your browser. Nothing is sent to elan1." `[proposal]` A downloadable CLI is the canonical verifier. The web page is a convenience and must say which verifier build it embeds.
- Errors use the E25 outcome names. There is no "partially verified" state.

**V-02 Verify a bundle** · `#/verify/bundle` · Auditor. Exit codes 0–4 with the E23 verdict table explanations.

### Partner / verifier programme portal (console, own tenant type)

**PP-01 Partner home** · `#/partners` · Partner principal. Certification status (active, renewal date), certified engineers, clients referred, partner-sourced revenue and 18% share, allowed claims.
**PP-02 Engineer certification** · `#/partners/engineers` · Training modules and results.
**PP-03 Client handover** · `#/partners/clients/:id` · Clients the partner supports (first-line), with no access to records unless the tenant grants it.

### Internal operator surfaces (Reference group, not a door)
- **REF-01 Competitor watch** · `#/reference/competitor-watch`: rows by class A–D, trigger, signal, where, who checks, cadence, status (`unchanged / moved / triggered / not checked`), decision and owner for triggered rows.
- **REF-02 Decision register** · `#/reference/decisions`: DR-001…013 plus superseded-by.
- **REF-03 Licence register** · `#/reference/licences`.
- **REF-04 Naming standard** · `#/reference/naming`: brand rules, banned words, pack ids.
- **REF-05 Regulator engagement log** · `#/reference/regulator-log`: who, when, what was asked, what we said, what we promised. Each entry is a governed write in the operator chain.
- **REF-06 Board numbers** · `#/reference/board`: 15 fixed rows, with "not yet measured" cells visibly empty.

---

## 3. Flows

### 3.1 Earned-autonomy graduation review (E24 Flow 2 and Flow 3)
1. Nightly job computes counters and `score_v1`. **G-01** shows `sales_invoice.submit · agent · one_counterparty` as "Eligible for A3", 8/8 conditions.
2. Owner (Priya Raman, Finance Controller) opens **G-02** → "Propose A3" → **G-03**. She writes the justification (≥1 sentence, not pre-filled) and picks approver Arjun Mehta (CFO). Submit creates the `autonomy.graduate` write (dual control, blast radius tenant).
3. **W-01** at `#/work/decide/GA-2028-0412`: Arjun sees counters, score 87 (`score_v1`), seq range 12,001–58,940, reversal drill 02 Aug 2028, justification verbatim. There is no recommendation. Approve.
4. Record appended. Toast: "sales_invoice.submit now acts at A3 from the next write. Supervised until 14 Oct 2028." The class enters supervision, 1 in 10 routed to **W-04**.
5. Day 30: recompute. Either "A3" or auto-revert: "Reverted to A2 because the score fell below the maintenance threshold. This is not a failure." The owner is notified.
6. Revocation at any time: **G-02** → "Revoke to A2" → confirm modal ("Takes effect at the next write. In-flight writes complete.") → done. There is no justification field. An automatic trigger shows its reason on the class.
7. Refusals: `POLICY.AUTONOMY_NOT_EARNED` (names the condition), `GATE.DUAL_CONTROL_SAME_ACTOR`, `GATE.PRECONDITION_FAILED` (drill undated or score stale).

### 3.2 Cross-org verification of a receipt (E22 Flows 1–3)
1. Issuer (Shree Kaveri Mills, `ar-org:kaverimills.example`) opens record 41,288 (`sales_invoice.submit`, ₹27,64,300) → "Issue receipt" → **A-14**.
2. Counterparty resolves to `ar-org:acmetextiles.example` (registered). Disclosure profile `counterparty-invoice` reveals `invoice_no`, `grand_total`, `customer_gstin` (3 of 11). This is a first-time audience, so the volume-disclosure warning shows and the operator ticks "I understand".
3. Gate check runs (counterparty, consent, residency, precondition). The receipt is assembled with a 7-day expiry. Toast with the E22 copy.
4. The file is sent by email with the invoice (we do not deliver).
5. Receiver (Acme Textiles) drops it on **A-15** (or on **V-01** if not a tenant). Claim echo → audience check → expiry → key via route 1 (pinned since March 2028) → digest and Ed25519 → anchor (RFC 3161) → disclosures (3 verified, 8 withheld) → replay check → verdict PASS, with the limits line.
6. "Bind into our chain" → `receipt.accept` (cross_boundary, dual control) → **W-02** with two approvers → record 8,902. Toast: "Receipt accepted — bound at record 8,902 to issuer record 41,288". There is no callback to the issuer.
7. Failure branch: route 2 key document unreachable → `POLICY.TRUST_ANCHOR_UNKNOWN` and stop. There is no hint fallback.

### 3.3 Selective disclosure to a regulator (E23 Flow 1/2 + E26)
1. The customer's compliance head (not elan1) is asked by their supervisor for Q2 2029 collections evidence. They open **A-28**.
2. They pick range seq 60,000–72,480, verifier profile `in-rbi-collections v1`, disclosure profile `regulator-collections` (audience kind regulator). The screen prints revealed (5) and withheld (9) lists with classifications. The personal field `borrower_mobile` triggers `GATE.CONSENT_MISSING` → "Drop this field" or "Capture consent". They drop it, which means a new profile and a new declaration version.
3. Export (governed write). "Export ready — 12,480 records, 611 refusals, 22 unanchored…" "Verify it yourself first" → **V-02** PASS.
4. The pack includes the three claim sentences and the limits table (locked). The fingerprint goes by a separate channel.
5. The reviewer uses **P-07** steps 1–6 and runs the verifier air-gapped. A required-but-withheld field shows `2 FAIL_PROFILE`, a scope conversation, "not about tampering".
6. **A-11** records what was revealed to "regulator" on that date.

### 3.4 Certification evidence pack (E26 Part A)
1. The first paying evidence customer's auditor names the standard (for example ISO/IEC 42001, Indian customer). The founder opens **A-27**, which sets the sequencing chip "ISO/IEC 42001 first; SOC 2 not in parallel".
2. For each clause area, attach produced evidence (declarations with owner_role, the refusal register, the chain, the verifier, O04, the E16 procedure). The three gap rows stay in warning until impact assessment, internal audit and management review each have a dated artefact.
3. Export the evidence index: a bundle plus a document list, each sentence mapped to "an exit code, a named artefact or a dated document" (E26 decision 1).
4. When the certificate issues, the card reads "We hold ISO/IEC 42001, covering the elan1 AI management system, issued on 12 Mar 2029" and appears only on the trust centre. It never appears next to a level pill.

### 3.5 Regulator sandbox or consultation engagement (E26 Part B)
1. **REF-05** (operator): "New engagement", type Consultation response / Customer examination / Industry body session / Sandbox enquiry `[gap: sandbox route is E26 open Q4]`.
2. Required fields: audience, route in, date, attendees (founder required; elan1 lead optional; sales, partner or SI blocked), what was asked, what we said (must map to the dossier), what we promised, follow-ups.
3. Save is a governed write in the operator chain. "Nothing claimed that is not in this document" is enforced as a checklist.
4. A defect report from a regulator opens a 5-working-day acknowledgement clock owned by the elan1 lead.

### 3.6 Plan upgrade L1 → L2 (E19, O07, model)
1. **A-24** → "Move to L2 Attested" → **A-25**: price delta (₹1,80,000 → ₹6,00,000 floor; included 4,80,000 → 15,00,000; overage ₹1.60 → ₹1.20), key custody in ap-south-1, boundary preview.
2. Owner submits (dual control) → approver on **W-03**.
3. On approval: "Signing starts at record 38,212. Records before it stay Level 1 forever." Level pill updates to L2 Attested. Signature rows now appear, labelled L2.
4. Invoice pro-rates the floor from the upgrade date.

### 3.7 Meter reconciliation to an invoice line (O07 §04, §09)
1. Finance head on **A-22** questions "Overage actions 1,87,480 × ₹1.20 = ₹2,24,976" and presses "Dispute a line".
2. Drawer lists the 3,12,480 committed records with write_id, seq, write type, actor kind and outcome, plus 4,112 refusals at ₹0 (listed, quantity 0).
3. `meter.reconcile()` result: kernel 3,12,480 vs ledger 3,12,476, a difference of 4 → "The kernel count stands; the credit ledger is a display defect (P2) owned by rung1 billing."
4. If any line has no record: "This line does not trace to a record. It has been credited in full and a meter defect opened." If unresolved at invoice time: invoice the lower number and carry an open item with owner and date.

---

## 4. Sample data (Indian context, ₹ Indian grouping)

**Tenants**
- Shree Kaveri Mills Pvt Ltd, Coimbatore · `ar-org:kaverimills.example` · L3 Proven · packs ledger1, invoice1 · 11,84,220 committed actions last month.
- Acme Textiles LLP, Surat · `ar-org:acmetextiles.example` · L2 Attested (receives receipts via the seat).
- Vasudha Agro Foods Ltd, Nashik · L1 Guarded · ledger1.
- Pragati Microfinance NBFC Ltd, Pune · L2 · collect1 · profile `in-rbi-collections v1`.
- Sovereign: State Treasury pilot (government), `[gap]`, no sovereign sold before defect propagation exists.

**Plans** (the price book in §1.15). Example invoice, Pragati, Sep 2028, L2:

| Line | Qty | Rate | Amount |
|---|---|---|---|
| Platform floor, L2 Attested (monthly share) | 1 | ₹6,00,000/yr | ₹50,000 |
| Committed actions within allowance | 1,25,000 | included | ₹0 |
| Committed actions beyond allowance | 1,87,480 | ₹1.20 | ₹2,24,976 |
| Refused writes | 4,112 | ₹0 | ₹0 |
| Regulatory pack — collect1 (monthly share) | 1 | ₹1,35,000/yr | ₹11,250 |
| Evidence bundles beyond allowance | 2 | ₹2,500 | ₹5,000 |
| **Subtotal** | | | **₹2,91,226** |
| GST 18% `[assumption, not in source]` | | | ₹52,420.68 |

L1 example: Vasudha, 72,000 actions/month = 8,64,000/yr against 4,80,000 included → 3,84,000 × ₹1.60 = ₹6,14,400 overage/yr + ₹1,80,000 floor.
Internal: rung1 → elan1 Sep 2028, 41,00,000 committed × ₹0.40 = ₹16,40,000; refusals 2,18,400 × ₹0.

**Meter lines**

| write_id | seq | write type | actor kind | outcome | qty | ₹ |
|---|---|---|---|---|---|---|
| `wr_01J9Z4K7Q2` | 41,288 | sales_invoice.submit | agent (A3) | committed | 1 | 1.20 |
| `wr_01J9Z4M1XA` | 41,289 | purchase_order.create | agent (A2) | committed, approved | 1 | 1.20 |
| `wr_01J9Z4N8TT` | 41,290 | payment_entry.submit | agent (A2) | refused `GATE.COUNTERPARTY_UNKNOWN` | 0 | 0.00 |
| `wr_01J9Z4P3LC` | 41,291 | receipt.issue | human | committed | 1 | 1.20 |
| `wr_01J9Z4Q9HD` | 41,292 | stock_entry.adjust | agent (A2) | refused `POLICY.DENIED_BY_RULE` (policy v14) | 0 | 0.00 |

**Regulations and packs**
- `in-mca-audit-trail` v1: MCA, IN, in force Apr 2023, 1 clause blocking bound, controls C-AT-01 v1 and C-AT-02 v1, profile in-mca-audit-trail/1 → **ledger1**.
- `in-gst-einvoice` v1 `[id proposed]`: CBIC, IN → **invoice1** (the decisive artefact is the IRN from the IRP; limit stated).
- `in-rbi-collections` v1 → **collect1** (citations "need counsel confirmation").
- `eu-ai-act-art12` `[proposed]`: min AL 2; `eu-ai-act-art14` human_oversight.

**Regulator engagement (all opportunistic, none "approved")**

| Audience | Route | Status |
|---|---|---|
| MeitY / SEBI / RBI consultations | Written response | "Whenever one is open" |
| Pragati's RBI examination | Customer leads; we answer technical questions | Scheduled — customer-led |
| ICAI / CA institute working session | Industry body | Requested corrections on MCA reading |
| Data Protection Board | Through a customer | 2027 onward |
| EU notified body | Only with an EU customer | Not started |
| IRDAI working group | Watch only | Not engaged |

**Certifications**: ISO/IEC 42001 — Not held (3 gaps open) · SOC 2 Type I — Not held · SOC 2 Type II — Not held · ISO/IEC 27001 — Not held · NIST AI RMF — No assessment. Competitor fact: Crator, SOC 2 since Apr 2026 `[unverified]`.

**Counterparties** (register for Kaveri Mills)

| org_id | Status | Route | Line |
|---|---|---|---|
| ar-org:acmetextiles.example | Active | Pinned fingerprint `SHA256:9f2c…a41e` | "Accepted on a pinned fingerprint since March 2028" |
| ar-org:suryaauto.example | Active | Key document | "Accepted on a key document fetched four minutes ago" |
| ar-org:deccanfreight.example | Unknown | — | `GATE.COUNTERPARTY_UNKNOWN` |
| ar-org:[redacted].example | Sanctioned | — | Never overridable |

**Graduation candidates** (Kaveri Mills, window 180 days to 24 Sep 2028)

| Class | Level | Submitted | Approvals (unamended/amended/declined) | Expired | Reversed in window | Corrected after | Sandbox diverged | Score | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| sales_invoice.submit · agent · one_counterparty | A2 | 1,142 | 900 / 11 / 4 | 3 | 1 | 0 | 0 | 87 | Eligible for A3 |
| purchase_order.create · agent · one_counterparty | A2 | 486 | 402 / 38 / 9 | 6 | 2 | 0 | 0 | 61 | Not eligible — approved_unamended ratio below threshold |
| stock_entry.adjust · agent · one_record | A2 | 1,930 | 1,210 / 20 / 2 | 1 | 0 | 1 | 0 | — | Not eligible — hard bar: corrected_after_window |
| payment_entry.submit · agent · one_counterparty (irreversible) | A2 | 612 | — | — | — | — | — | — | Never — irreversible write type has no A3 |
| customer.update_credit_limit · agent · tenant | A2 | 94 | — | — | — | — | — | — | Never by graduation — tenant scope forces dual control |
| delivery_note.submit · agent · one_counterparty | A3 supervised until 14 Oct 2028 | 2,318 | — | — | — | — | — | 91 | Supervised, 1 in 10 |
| journal_entry.adjust · agent · batch | A2 (revoked 03 Sep 2028) | — | — | — | — | — | — | — | Revoked: GATE.SANDBOX_DIVERGED at seq 57,102 |

Refusals by gate for sales_invoice.submit: precondition 120 · counterparty 61 · credit_limit 22 · retention 11 (shown as neutral).

**Receipts**: issued record 41,288, digest `b41f…9c07`, key_id `kav-2028q3-01`, anchored (TSA batch 2028-09-24T10:00Z), audience acme, nonce 128-bit, expires 01 Oct 2028, disclosed 3 of 11 → bound at acme record 8,902. Replay example: second acceptance → `GATE.RECEIPT_REPLAYED` "Already bound at record 8,902".

**Exports**: "Export ready — 12,480 records, 611 refusals, 22 unanchored, profile in-mca-audit-trail v1, disclosure profile auditor-statutory revealing 3 of 11 fields". Lender profile `lender-working-capital` reveals 5 of 11.

**People** (sample): Priya Raman (Finance Controller, owner role), Arjun Mehta (CFO, approver), Kavitha Iyer (Compliance head, regulation author), Rohan Deshpande (certifier), CA Suresh Agarwal & Co (partner firm). Founder: Elango.

---

## 5. UI rules and constraints (from these documents)
1. **L1 honesty**: no "Signed by", signature, anchor time or verifier verdict at L1. Unlocked states say which level they need. The L1 lead sentence omits "signed" and "exportable".
2. **Banned words** (§1.3, §1.11). The copy linter must also block "tamper-proof, immutable, court-ready, approved by a regulator, certified (without date and scope), standardised, open (standard, before done-item 4), we cannot see your data, platform (L1)".
3. **Refusals are ₹0, shown, never hidden.** Show refusal counts beside cost and never frame a lower refusal rate as good.
4. **Three verdict classes never collapse.** Withheld ≠ missing ≠ altered. Use exit numbers and names together. Integrity failures use critical status; profile failures use warning with "a conversation about scope".
5. **Numbers, not recommendations** on graduation Decide screens. Model text only appears beside the counts and is labelled as model-written. The justification is human-written.
6. **Asymmetry**: Revoke is one press with no justification field. Propose needs two humans. Never put Revoke behind a confirmation longer than one modal.
7. **Dual control everywhere the docs say so**: certification, `autonomy.graduate`, `receipt.accept`, key rotation, standard publication, erasure. Same-actor attempts show `GATE.DUAL_CONTROL_SAME_ACTOR`.
8. **No settings for autonomy**. Never show a toggle, dropdown or API field that sets an A-level. Levels change only through the graduation write.
9. **Every limit is visible at the point of claim**: the receipt limits line, "What disclosure does not hide", the volume-disclosure warning, "does not establish…" on Regulations.
10. **Brand**: lowercase names; packs are lowercase mono labels with no logos; rung1 screens show elan1 only on the proof record and footer; OEM consoles show the operator's brand only; certification logos never sit beside a level pill.
11. **Versions are integers**: never "latest". Show `name@version` in mono. Immutable versions have a history view.
12. **Every regulator or certification sentence maps to an artefact**: link each claim to an exit code, a named artefact or a dated document. Otherwise it is not rendered.
13. **Indian formats**: ₹ with Indian grouping (₹27,64,300); IST for clocks (six-hour CERT-In clock, 72-hour erasure clock); dates like "24 Sep 2028".
14. **Verifier surfaces make no calls home**. State that on the page. The key-discovery fetch is explicit and reported.
15. **Empty cells stay visibly empty** on board and investor numbers ("not yet measured").

---

## 6. Gaps, conflicts and value-adds

Conflicts to resolve with the founder (show on the screen map):
1. L2/L3 dates: O09 (L2 Q3–Q4 2027) versus the model (L2 GA Apr 2028, L3 Oct 2029) versus E20 (event-gated). Recommend that public UI shows gates, not dates.
2. Counterparty verification seat at ₹45,000/yr versus E20's "open question" and E25's "verifier never priced". Label it as receiving-console access.
3. Tranche 3 (Gate B) funds "L3 entry readiness" versus O12/O11's sovereignty rule.
4. The model's cover says "Governed Intelligence Platform" (retired).
5. stack1 spin-out timing: Q2 2028 (O11, O09) versus "no earlier than 1 October 2028" (P4-00/S18).
6. The "Verifier profile ₹3,00,000/regime/yr" price needs explicit separation from the free verifier.

Gaps with proposals:
- **Partner programme levels** are unspecified. Propose three: Registered (may resell and refer) · Certified Verifier (may run and explain the offline verifier for clients; ₹1,50,000/yr) · Certified Implementer (may deploy packs). None may speak to a regulator.
- **rung1 band names** beyond "Scale" are missing. Keep bands as turnover ranges (for example "₹5–10 cr turnover") until named.
- **Receipt default expiry** (E22 Q5). Propose 7 days, matching the example, configurable per declaration.
- **Score thresholds** (E24 Q1) are not set. Show "threshold set in score_v1" with its value once known; never invent one on screen.
- **Non-tenant receiving side** (E22 Q2). V-01 covers verification; binding needs a chain, so offer the "Counterparty verification seat" as the lightweight receiving tenant.
- **Document decisions need DR numbers** (propose DR-014+ for E20–E26 decisions cited in the UI).
- **IRDAI / insure1**: not in this set. Add as a watch-row and roadmap pack only.
- **Sovereign deployment**: no screen until the defect-propagation process exists. Add a "Deployment health: fix propagation" panel as a precondition.
- **GST on invoices** is not specified. Show it as an assumption.

Value-adds:
- "Claim linter" in the console: pasted marketing copy is checked against the DO NOT SAY tables (E20, E26, O10).
- A one-click "Explain this verdict" drawer on every exit code, reusing the E23 table.
- "What would change this" chips on every `not_measurable` disposition and every ineligible autonomy condition, which the docs already require as text.
- A disclosure preview that shows the receiver's view side by side before export.
- A trust-centre "Limits" page that is the same component as the reviewer kit, so the story cannot drift (E26's same-page rule).
