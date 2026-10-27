# elan1 — Screen spec: Phase 2 + Phase 3 evidence (L2 Attested, with L3 previews)

Source-of-truth for UI designers. Built from a complete reading of:
- **Phase 2:** E09 L1 GA Readiness and Third-Party Onboarding · E10 Pricing Model v1 · E11 Evidence and Audit Note · E12 Seal Spec v6 and Test Vectors · E13 Verifier Profile Spec · notes 01–09 (seal, bundle, profile, keys, TSA, pack template, auditor pilot, upgrade runbook, evidence pricing)
- **Phase 3:** E14 Scope Freeze — L2 Attested · E15 Evidence Bundle Spec and Offline Verifier · E16 Key Management and Custody · E17 Timestamp Authority Memo · E18 Pack Definition Template and the First India Pack · E19 L1 to L2 Upgrade Runbook · E27 collect1 Pack Specification Sketch · notes 01–08 (ontology, cross-org verification, selective disclosure, sovereign deployment, precedent and earned autonomy, action receipt standard, certification dossier, regulator dossier)
- UI contract: `/home/claude/elan1/CONTRACT.md` (Four Doors: Work · Records · Agents · Assurance; the L1 honesty rule).

Conventions in this file: "quoted text" is exact copy from the source documents and must be used verbatim. Copy marked *(proposed)* is ours and can be edited. Every screen carries an **Assurance Level** tag: **L1** (works at L1 Guarded), **L2** (exists only at L2 Attested and must be labelled "Level 2 Attested" on the screen), **L3** (preview only, labelled "Level 3 Proven — not available"), or **Any** (public or level-independent).

> **Phase-label trap (read first).** The Phase 2 .md notes say "Phase 2 (L2 Attested)" and the Phase 3 .md notes say "Phase 3 (L3 Proven)". The PDFs disagree by one step: E10 and E14 say L2 ships in **Phase 3, Q3 2027 to Q1 2028**, and E14/E13 push cross-organisation verification, the open receipt standard and the Controls/Regulations ontology families to **L3 / Phase 4**. **UI rule: label screens by Assurance Level, never by phase.** Anything in the Phase 3 .md notes (cross-org, selective disclosure, sovereign deployment, precedent, action receipt standard) is L3 and appears only as a labelled preview.

---

## 1. Vocabulary and enums (use verbatim in UI)

### 1.1 Assurance Levels
| Level | UI label | What is true | Date |
|---|---|---|---|
| 1 | **L1 Guarded** | "gates, approval, sandbox, 30-day rollback, hash-chained log, no signature, no anchor, no bundle" (E09) | running now |
| 2 | **L2 Attested** | "elan1 signs each record with a key held in the tenant's residency domain, anchors a Merkle root of those records to two external timestamp authorities at a published interval, and exports a self-contained bundle that a party who does not trust us can verify offline, with no network, no elan1 account and no code of ours in the verification path." (E14 frozen sentence) | "Q3 2027" |
| 3 | **L3 Proven** | Cross-organisation verification, selective disclosure, customer-held keys, sovereign deployment, precedent intelligence (E14 §03 "out of scope for L2") | later |

E11 comparison table, reusable as the "Level 1 vs Level 2" component on the Assurance overview and the upgrade screen:

| Row | Level 1 Guarded — running now | Level 2 Attested — Q3 2027 |
|---|---|---|
| Gates, approval, sandbox, 30-day reversal | yes | yes |
| One record per action including refusals | yes | yes |
| Hash-chained, append-only, nightly re-computation | yes | yes |
| Cryptographic signature over the record | no | Ed25519 over the same sixteen fields |
| External time anchor | no | RFC 3161 timestamp over a batched Merkle root, at a published interval |
| Exportable evidence bundle | no | eight members, self-contained |
| Verification without the vendor | no | offline, on an air-gapped machine, with a key fingerprint obtained separately from us |
| Verifier software | no | free, shipped as source, to anyone, never priced |
| What a customer can say to you | "our controls ran and we have the internal record" | "here is a file you can check yourself" |

### 1.2 The seal — `elan1.proof.seal.v6` (E12)
"Sixteen fields, length-prefixed, SHA-256, frozen forever." No optional fields, no seventeenth field, no v6.1.

| # | Field (mono) | Type · encoded length | UI label (E11 plain name) | Meaning / display rule |
|---|---|---|---|---|
| F01 | `tenant_id` | uuid · 16 | Tenant identifier | "Whose chain this is" |
| F02 | `seq` | uint64 · 8 | Sequence number | "starts at 1 and never skips"; assigned only by the chain writer |
| F03 | `prev_digest` | digest · 32 | Previous digest | "thirty-two zero octets at genesis" — show as `0000…0000 (genesis)` |
| F04 | `write_id` | uuid · 16 | Write identifier | The write this records |
| F05 | `write_type` | string · 5–64 | Write type | `<slug>.<verb>`, e.g. `sales_invoice.submit` |
| F06 | `declaration_id` | uuid · 16 | Declaration identifier | Which declaration governed it (links to Records) |
| F07 | `declaration_version` | uint32 · 4 | Declaration version | "Never 'latest'" |
| F08 | `policy_version` | uint32 · 4 | Policy version | "resolved by the kernel, never supplied" |
| F09 | `actor_id` | uuid · 16 | Actor identifier | Who asked |
| F10 | `actor_kind` | enum · 5 or 6 | Actor kind | `human` · `agent` · `system`. "Never inferred" |
| F11 | `autonomy_level` | uint8 · 1 | Autonomy level | `A0`–`A5` (encoded 0–5). **Never "L0–L5"** — L is reserved for Assurance Levels |
| F12 | `record_id` | uuid · 16 | Record identifier | Target-system record; "the zero UUID on a refusal" |
| F13 | `record_version` | uint32 · 4 | Record version | "0 on a refusal" |
| F14 | `payload_hash` | digest · 32 | Payload digest | "Over the salted, canonicalised payload" |
| F15 | `lexicon_hash` | digest · 32 | Lexicon digest | "so 'credit limit' means in 2033 what it meant on the day" |
| F16 | `recorded_at` | timestamp · 20 | Recorded at | RFC 3339 UTC, second precision, `Z`. "Platform clock at chain-write time, never the caller's". **Never label it `sealed_at`** (retired v2.0 name) |

Structural members beside the sixteen (not in the preimage): `digest`, `assurance_level` (1 or 2), and at L2 only `signature` (pure Ed25519 over the 32-octet digest, RFC 8032 — "not ph, not ctx"), `key_id`, `anchor_ref` ("Merkle inclusion path plus the RFC 3161 token reference").

Preimage: `LP(DOMAIN) ‖ LP(enc(F01)) ‖ … ‖ LP(enc(F16))`, `LP(x) = uint32_BE(len(x)) ‖ x`, DOMAIN = `elan1.proof.seal.v6` (19 octets), digest = SHA-256. TV-001 preimage is **exactly 329 octets** (the old "311 octets / a376103f…2b280d31" figure is retired and "may not be quoted").

Deliberately **outside** the preimage and shown *beside* the record, never as fields: gate results, approver identity (the approval is its own record with its own `seq`), enforcement mode, any vertical extra field, the payload itself.

### 1.3 Record outcome, actor, autonomy, mode, blast radius, reversal
- Record outcome (derived for UI): **Committed** (F12 non-zero, F13 ≥ 1) · **Refused** (F12 zero UUID, F13 = 0). Refusals are HTTP 200 with a register code, a rung, "a full sixteen-field record with a zeroed record identifier, and a meter event of quantity 0" (E09 C8).
- `actor_kind`: human · agent · system (UI: Person · Software agent · Scheduled system — E11).
- Autonomy: A0–A5 "held at the moment of the write". Missing grant resolves to A0 (C6).
- Channel mode `channels[].mode`: `enforced` · `attested_advisory` (UI: Enforced · Attested advisory). Enforced mechanisms: "credential custody" · "token acceptance".
- Record `mode`: `live` · `sandbox`.
- Blast radius → meter basis (E10): `one_record` → per record · `one_counterparty` → per counterparty · `batch` → per batch · `tenant` → per tenant · `cross_boundary` → per crossing. (Contract's visual ladder Contained/Reversible/Material/Irreversible is separate — do not conflate.)
- Reversal: `target_native_undo` · `compensating_instrument` · `irreversible: true` ("honestly irreversible").
- Declaration dispositions (every field): a value · `out_of_scope` + `ADR-nnnn` · `not_measurable` + reason + `would_change_if` (each ≥ 12 characters).
- Declaration seven blocks, in order: identity · shape · permissions · write_types · gates · proof_binding · channels (block 6 = `proof_binding`).
- Nine rungs (label strip): `0b STOP · 1 IDENTITY · 2 WRITE DOOR · 3 PRE-GATES · 4 evaluate() · 5 GUARDRAIL · 6 AUTONOMY · 7 ACT · 8 PROOF · 9 METERED`.
- Pre-gates: consent, residency, retention, dual control, counterparty (rate), budget, schedule, precondition. **Never-skippable six:** "Consent, residency, retention, dual control, counterparty and precondition are not configurable. Rate, budget and schedule are."

### 1.4 Evidence bundle — `elan1.evidence.bundle.v1` (E15)
"A bundle is a directory that needs nothing from us." Three properties: **self-contained · inert · claim-bearing**.

| Member | Contents | Required |
|---|---|---|
| `manifest.json` | "What is in the bundle, the range, the counts, the digests of every other member, and the profile claimed" | always |
| `seals.jsonl` | "One record per line, in seq order — the sixteen fields, the digest, the assurance level, and at L2 the signature and key_id" | always |
| `chain.json` | "Genesis digest, head digest, the seq range, and the boundary rows where the assurance level or the signing key changes" | always |
| `anchors/` | "One file per closed batch: the RFC 3161 token, the Merkle root, the leaf count, and each covered record's inclusion path. Includes the TSA certification path and the revocation data captured at anchor time" | L2 |
| `keys.json` | "key_id, valid_from, valid_to, status, successor_id, and the public key fingerprint — never the key" | L2 |
| `declarations/` | "Every referenced declaration version, verbatim, one file per (declaration_id, version)" | always |
| `lexicon/` | "Every term set referenced by F15, verbatim, one file per lexicon digest" | always |
| `VERIFY.txt` | "How to check this without us, what each failure looks like, and what a PASS does not prove" | always |

Manifest fields (render as the bundle detail's "Manifest" panel): `bundle_format`, `tenant_id`, `seq_from · seq_to`, `record_count` (must equal seq_to − seq_from + 1), `refusal_count`, `assurance_levels[]` (level, count, seq range each), `continuity_scope` (`full_chain` · `declared_write_types` · `range`), `profile_id · profile_version` ("Absent means no claim, and the verifier runs integrity checks only"), `redaction_profile`, `members[]` (path, byte length, SHA-256), `unanchored_head` ("0 is a value, not an absence"), `exported_at`, `verifier_digest`.

Included: refusals in full; every referenced declaration version and lexicon; gate results beside each record; the approval record (as its own record); TSA certification path and revocation data. **Excluded:** payloads, salts, key material, any executable, target-system state. The manifest "is not signed as a whole".

Sizes [modelled]: ~640 bytes/record; anchor file ~6 KB + ~1 KB per covered record; a 100,000-record year ~150 MB. We retain no bundles — "an export is generated on request and handed over"; re-export over the same range and profile "is byte-identical except for exported_at".

### 1.5 The offline verifier — `elan1-verify`
Command: `elan1-verify --bundle <path> --profile <path> --key-fingerprint <hex>`. Reads only: the bundle's eight members, the profile document, the fingerprint "out of band, from the reader's own source", the local clock ("Only to check the anchor time precedes now"). "It reads no network, calls no API, and shares no code with the chain writer." Zero dependencies, empty lockfile, reproducible build, "free, ships as source … never priced". It "does not refuse, it reports" and records nothing.

**Exit codes (six codes, 0–5; code 0 has three verdict strings):**

| Code | Name (verbatim) | Means | What the reader does | Status token |
|---|---|---|---|---|
| 0 | `PASS` | "Every integrity check passed and every profile check passed" | "Rely on it within the limits statement" | good |
| 0 | `PASS — payload unbound` | "one or more records' payload salts were destroyed under an erasure obligation. Chain intact, payload unbound" | "Note it. This is not a failure and must never be printed as one" | good + info note |
| 0 | `PASS — unsigned, assurance level 1` | "Structure and chain verified; signature, key-window and anchor checks not_applicable" | "Treat as internal control evidence only. It is not third-party-checkable" | neutral |
| 1 | `FAIL_INTEGRITY` | "A digest, a chain link, a signature, an inclusion path or an anchor did not verify" | "Stop. This is a forensic question, not a compliance question" | critical |
| 2 | `FAIL_PROFILE` | "Integrity is sound; a profile requirement is unmet" | "The records are trustworthy and the bundle does not meet this regime's requirements. Two different findings" | serious |
| 3 | `INCOMPLETE` | "A referenced declaration version, lexicon or anchor member is missing from the bundle" | "Ask for a complete bundle. Do not treat as a failure of the records" | warning |
| 4 | `UNSUPPORTED` | "Unknown profile version or unknown domain string" | "Obtain the matching verifier. Never interpret" | neutral |
| 5 | `USAGE` | "Bad arguments, unreadable file" | "Operator error" | neutral |

"1 and 2 must never be collapsed. FAIL_INTEGRITY means somebody's records were altered. FAIL_PROFILE means an honest record set does not meet a regime's requirements. Reporting the second as the first accuses a customer of tampering; reporting the first as the second hides a P0." "3 is never reported as either."

"The three failures a verifier must never confuse" table (E15) — reuse on /verify/exit-codes:

| | Integrity failure (1) | Profile failure (2) | Incomplete (3) |
|---|---|---|---|
| What happened | The data was altered, or the signature is wrong | The data is sound; the regime's requirements are not met | The bundle is missing a piece |
| Who has a problem | Whoever held the records | Whoever designed the controls, or chose the scope | Whoever built the export |
| The reader's next move | Forensics | A conversation about controls | Ask for a complete bundle |
| Reporting it as the wrong one | Accuses a customer of tampering | Hides a P0 | Turns a packaging bug into an accusation |

**Verification report — nine sections, in this order, every time (E13):** 1 Verdict · 2 The claim · 3 Scope · 4 Integrity results · 5 Clause results · 6 First failure, in full · 7 Notes · 8 Limits · 9 Reproduction.

**Eight integrity steps** (section 4 rows; our split of E13 Flow 2 step 3): (1) recompute every preimage, (2) recompute every digest, (3) verify every signature against `keys.json` windows and the supplied fingerprint, (4) `seq` contiguity, (5) `prev_digest` linkage, (6) Merkle inclusion paths, (7) anchor token time precedes now, (8) resolve every declaration version and lexicon digest inside the bundle. Each reads `passed` / `failed` / `not_applicable — assurance level 1`.

First-failure format (use exactly this shape): "FAIL at seq 3,181: prev_digest mismatch, expected a376… got 0000…".

**How a sceptic checks the verifier is ours — four routes** (E15): 1 compare SHA-256 against `SHA256SUMS` and check the release signature against the release key fingerprint obtained out of band; 2 rebuild from source and compare digests; 3 read the source ("standard library only and small enough to read in a day"); 4 write their own verifier from E12 and E13 — "Route 4 is the one that matters … A verifier we supply is a convenience; the format is the product."

### 1.6 Verifier profiles (E13)
"A profile is a checkable claim — this bundle is conforming for this regime under this profile version." Eight blocks:
1. `profile_identity`: `profile_id` (`^[a-z]{2}-[a-z0-9-]{3,40}$`, e.g. `in-mca-audit-trail`), `profile_version` (last + 1), `regime_name`, `issuer`, `jurisdiction` (ISO alpha-2), `author`, `certifier` ("Never the author"), `status` = `draft` · `certified` · `superseded` · `withdrawn`.
2. `regime_binding` ("the load-bearing block"), one row per clause: `clause_ref`, `clause_text` (quoted, not paraphrased), `obligation_kind` = `record_keeping` · `human_oversight` · `retention` · `disclosure` · `segregation` · `non_repudiation`; `binds_write_types[]` (may be `*`), `binds_gates[]`, `binds_fields[]` (F01–F16 or declaration fields), `retention_months`, `check_ids[]`, `disposition` = `bound` · `out_of_scope + adr` · `not_measurable + reason + would_change_if`.
3. `bundle_requirements`: `required_members[]`, `min_assurance_level` ("2 for any profile that asserts non-repudiation"), `proof_binding_fields[]`, `redaction_profile`, `refusals_required`, `continuity_scope`.
4. `checks[]`: `check_id` (`^C[0-9]{2}$`), `kind` = `integrity` · `structural` · `binding` · `coverage` · `temporal`; `statement`, `inputs[]`, `pass_condition`, `on_fail` = `fail_integrity` · `fail_profile` · `incomplete`; `clause_refs[]`.
5. `report_vocabulary` — the regime's own words.
6. `limits_statement` — required, > 200 characters, unique, reproduced verbatim in every report.
7. `versioning`: `supersedes`, `rule_as_at`, `applies_to_records_from · applies_to_records_to`.
8. `conformance`: which of P1–P12 passed, when, against which fixture set.

Profile conformance tests **P1–P12**: P1 Clause coverage · P2 Name resolution · P3 Known-good · P4 Known-tampered (all 28 negatives exit 1) · P5 Known-nonconforming (exit 2, "never 1") · P6 Incomplete (exit 3, "never 2") · P7 Erasure wording ("the string FAIL appears nowhere") · P8 L1 dry-run · P9 Scope printing · P10 Limits statement · P11 Second reader · P12 Offline.

Versioning table: clarification → new version, old stays `certified`; new/altered obligation → old becomes `superseded` "and keeps verifying"; regime withdrawn / profile wrong → `withdrawn`, bundle claiming it exits 4 "with the withdrawal date printed". "A bundle is judged under the profile version it claims, not the current one."

### 1.7 Keys and custody (E12, E16)
Four key classes:

| Class | Purpose | Where | Who may invoke | Rotation |
|---|---|---|---|---|
| Domain signing key | "Signs the 32-octet record digest at rung 8" | Managed KMS, Ed25519, in the residency domain's region | "The chain writer process, and nothing else" | Every 12 months, or on compromise |
| Anchor client key | "Authenticates us to a timestamp authority. Does not sign anything a reader verifies" | KMS in the same domain | The anchor service | Per the authority's policy, at least annually |
| Release key | Signs verifier binaries, source tarballs, vector sets | "Offline hardware token, held by two named humans, not in any cloud" | Release approver, at a release | Every 24 months |
| Transport keys | TLS and the per-write single-use credential | Ordinary platform secret management | The single writer | Per platform policy |

Only the first two are "in the evidence path". Key register fields: `key_id` = `k_<domain>_<YYYYMMDD>_<4 hex>` (e.g. `k_in_20270401_9c3a`); `valid_from · valid_to` (RFC 3339, second precision); `successor_id`; `status` = **`active` · `retired` · `revoked`**; public key **fingerprint** (never the key). Revocation adds reason and `T_suspect`.

Custody model: "Key material is generated inside the custody module, never leaves it, and is never exported, backed up, printed, escrowed or copied between residency domains." AWS KMS `ECC_NIST_EDWARDS25519` (alternative: Google Cloud KMS `EC_SIGN_ED25519` at HSM level), `Origin: KMS`, `Sign` permitted to exactly one IAM principal. **One signing key per residency domain, not per tenant** — "Ten thousand tenants on the in domain share a signing key"; a dedicated key requires a dedicated residency domain (Enterprise tier) or customer-held keys (L3). Dev key fingerprint published as `dev-DO-NOT-TRUST`.

Dual control applies to five operations: generating a key, registering a window, rotating, revoking, publishing a verifier release. "None of them has an emergency variant." "No single human can cause a signature." "There is no administrative 'sign this' surface."

Three independent records of key use: the cloud KMS audit log (retention-locked separate account) · the elan1 chain · the anchors. Nightly two-way reconciliation of KMS `Sign` calls vs signed records; "A Sign call with no record is the most serious alert the platform can raise."

States for rotation/revocation (UI chips): **Successor generated** (no signing) → **Registered — valid_from in future** → **Active** → predecessor **Retired**; or **Revoked** (valid_to = T_suspect) → **Unsigned interval** (declared) → **Signing re-enabled**. "Overlap: none" (in green, with text) or refused.

Records signed by a revoked key — three statements "all true at once": "They still verify" · "They are no longer exclusive" · "They are still anchored".

### 1.8 Timestamp authority (E17)
- **Anchor**: "This digest existed, in this form, no later than this instant, according to a party who has no interest in the matter. Nothing more." — "Existence, form, and an upper bound on time. Say it in those words."
- RFC 3161 terms for the token panel: `TimeStampReq`, nonce, token (CMS SignedData wrapping `TSTInfo`), `messageImprint` (hash + algorithm), `genTime`, policy identifier, accuracy, certification path, revocation data (OCSP/CRL captured at anchor time).
- Merkle per RFC 6962 §2.1: `leaf(d) = SHA-256(0x00 ‖ d)`, `node(l,r) = SHA-256(0x01 ‖ l ‖ r)`, "an odd final node is promoted, not duplicated". Inclusion path = log₂(n) digests (1,024 leaves → 10 digests, 320 octets).
- **Two-authority rule**: "every batch is anchored by two authorities, and at least one is India-based." "A bundle verifies if either token verifies; a bundle where the two tokens disagree about the root is an integrity failure and a P0." Recommended: eMudhra (India) + one of DigiCert, Sectigo, GlobalSign, Entrust. Free public TSAs: development/reference only, "never in a production bundle".
- Six selection criteria (1–3 disqualifying): RFC 3161 compliant with practice statement · traceable time source · SLA · long certificate validity + archival policy · priced in writing · independent of the other authority.
- Interval: "≤15 minutes, per tier, as an SLO rather than a tuning knob"; "never a per-customer negotiation". One token per tenant per interval; idle interval → no batch, no token.
- Batch states (UI): **Open** → **Closed** (leaf count + seq range recorded) → **Anchored** (two tokens) | **single_anchor** ("a degraded state, not a failure") | **Anchored late** (true token time shown; gap visible) | token **Discarded** (imprint mismatch / future genTime).
- Degraded copy: "Anchoring degraded since 09:14 — 88 records unanchored" (banner after 4 consecutive intervals with both failing; SRE paged at 2 consecutive with the same authority failing).
- Unanchored head line: "last counter-signature 14 minutes ago, 22 records unanchored"; healthy: "last counter-signature 3 minutes ago, 0 records unanchored".
- Long-term validity cases: certificate expires · certificate revoked later · authority ceases · root distrusted · SHA-256/Ed25519 weakens. Re-anchoring "adds a later upper bound and never replaces the earlier one. A bundle carrying both prints both times." "We do not run a blockchain." RFC 9943 transparency log publishing is optional.
- Anchoring "is not a governed write and does not appear in the tenant's chain"; "never refuses or delays a write".

### 1.9 Pack template and the five gates (E18)
"A pack = one declaration + one certified verifier profile + one regime-specific export mapping, aimed at one buyer with one auditor under one dated obligation." "Packs are the sale. Screens are the surface. Nobody buys an approvals screen."

Five pack gates (all must pass; "A gate scored 'probably' is scored fail"):

| Gate | Test | Fails when |
|---|---|---|
| **G-A · A dated hook** | "A named regulation, standard or contract with a date on it" | "The hook is a principle, a direction of travel, or 'regulators are increasingly focused on'" |
| **G-B · An auditor** | "Somebody whose job is to ask for the evidence" | "Nobody is obliged to ask. If nobody is obliged to ask, nobody asks" |
| **G-C · Reversible, or honestly irreversible** | "The write types in this domain can declare which they are without lying" | "Every important action is irreversible and everyone pretends otherwise" |
| **G-D · Evidence sold separately** | "There is a buyer who would pay for the bundle on its own line item" | "Evidence is a nice-to-have attached to something else" |
| **G-E · We own the write** | "elan1 is in the write path, not reading somebody else's log" | "We observe rather than govern … telemetry is not evidence" |

Rejected by name (portfolio register): agri1 (G-B), legal1 (G-E), energy1 (G-E), public1 (G-A, G-D), edu1 (G-D), retail1 (G-B), "and two others held in the portfolio register".

Eleven blocks: 1 `pack_identity` (`pack_id` `^[a-z][a-z0-9]{2,15}1$`) · 2 `obligation` · 3 `buyer` · 4 `gate_scores` · 5 `declaration_ref` · 6 `write_types[]` · 7 `gates[]` · 8 `profile_binding` · 9 `buyer_promise` · 10 `tests[]` · 11 `pilot`.

Pack tests **T1–T8**: T1 Declaration validates · T2 Profile certified · T3 Reversal is honest (dated drill) · T4 Refusals are real · T5 Bundle verifies offline · T6 Tampered bundle refuses · T7 Non-conforming bundle is not accused · T8 The auditor reads it.

Buyer promise, three sentences (show on every pack page):
1. "Every governed change of these types went through stated rules, with a named actor and, where required, a named approver."
2. "Here is a file covering a period you choose. Your auditor can check it on their own machine, offline, with software they did not get from us."
3. "Here is what that file does not establish, in the profile's own words, printed in every report."

### 1.10 The First India Pack — `ledger1` (E18) and its profile `in-mca-audit-trail` v1 (E13)
- **pack_identity**: `ledger1` · version 1 · owner role: elan1 lead · "Changes to the books of account, and the evidence that each one passed stated rules."
- **obligation**: Ministry of Corporate Affairs; Companies (Accounts) Rules, audit-trail (edit log) requirement for accounting software; in force since 1 April 2023. Four clauses.
- **buyer**: "the promoter or finance controller of a ₹5–50 crore firm, usually on their CA's advice. Budget line: audit and compliance, not software. Auditor: the statutory auditor".
- **gate_scores**: G-A pass (1 April 2023) · G-B pass (statutory auditor, named in the pilot) · G-C pass · G-D "pass, provisionally — this is the gate the pilot actually tests" · G-E pass (rung1 hosted mode; the single writer is the only path).
- **declaration_ref**: rung1's ERPNext declaration at the version current at pilot start. "No new ontology."
- **write_types[]**:

| Write type | Blast radius | Reversal | Dual control |
|---|---|---|---|
| `sales_invoice.submit` | one_counterparty | target_native_undo — cancel the IRN and the invoice | above ₹2 lakh |
| `sales_invoice.cancel` | one_counterparty | honestly irreversible after the 24-hour IRN window; declared as such | always |
| `purchase_invoice.submit` | one_counterparty | target_native_undo | above ₹2 lakh |
| `payment_entry.submit` | one_counterparty | compensating_instrument | always |
| `journal_entry.submit` | batch | compensating_instrument | always |
| `customer.update` (credit terms, GSTIN) | one_record | target_native_undo | on GSTIN change |

- **gates[]** in order: `consent`, `residency`, `retention`, `counterparty`, `precondition`, `dual_control`, `budget` ("budget is declared on for this pack because a runaway journal entry is the failure mode the buyer imagines first").
- **profile_binding**: `in-mca-audit-trail` v1, `rule_as_at: 2023-04-01`, `applies_to_records_from: 2027-07-01`, `min_assurance_level: 2`, `refusals_required: true`, `continuity_scope: full_chain`.
- **Regulation clauses → controls (checks) → gates → write types → fields**:

| Clause | Obligation kind | Write types | Gates | Fields | Checks |
|---|---|---|---|---|---|
| Audit trail of each and every transaction | record_keeping | * | — | F04, F05, F09, F10, F16 | C01, C02 |
| Creating an edit log of each change made in books of account | record_keeping | * | precondition | F12, F13, F14, F07 | C03 |
| Along with the date when such changes were made | record_keeping | * | — | F16 | C04 |
| The audit trail shall not be disabled | non_repudiation | * | — | F02, F03 | C05, C06 |

| Check | Kind | Statement | On fail |
|---|---|---|---|
| C01 | structural | "Every governed change to a book of account appears as a record" | fail_profile |
| C02 | binding | "Each record names who made the change and whether they were a person or software" | fail_profile |
| C03 | binding | "Each change identifies the record changed and the version written" | fail_profile |
| C04 | temporal | "Each change carries the date it was made, from the platform clock" | fail_profile |
| C05 | integrity | "The trail cannot have been disabled without detection" | fail_integrity |
| C06 | temporal | "The trail cannot have been silently truncated" | fail_integrity |

C06 on an L1 dry-run reads `not_applicable — assurance level 1` — "That single row is the clearest available demonstration of what L2 buys." Use it as the hero of the upgrade screen.

- **limits_statement** (verbatim in every report and on the pack page): "A PASS under in-mca-audit-trail v1 establishes that the changes contained in this bundle were made through the elan1 governed write path, that each carries an actor, an actor kind, a target record identifier and a platform-clock timestamp, that the sequence is unbroken and externally anchored, and that the refused attempts are present. It does not establish that the books of account are complete: changes made directly in the accounting system, outside this write path, are recorded by that system's own audit trail and are not in this bundle. It does not establish that the transactions were genuine, that the rules applied were adequate, or that this bundle satisfies any obligation — that determination belongs to the reader. This profile is the vendor's reading of the obligation; it has not been reviewed or accepted by the Ministry of Corporate Affairs or by any regulator."
- **Second pack** `invoice1` (GST e-invoicing) — "not abandoned; it is second". Its limits must say "the IRN, the portal response and the 24-hour cancellation window are the accounting system's evidence and not ours". Hook stat: "8,55,738 GSTINs generated e-invoices in FY25-26, 21.4 crore IRNs". Why second: fails G-E partly.
- `ledger1` may later carry a US SEC 17a-4 profile ("a pack is one domain and may carry several jurisdictional profiles").

### 1.11 collect1 pack (E27 — status "Spec sketch — rule citations need counsel confirmation")
- Obligation layers: **Conduct** (RBI fair-practices on recovery: calling hours, no harassment, no third-party disclosure, identified caller, grievance route) · **Telecom** (DLT registration, headers/templates, preference register scrub, number series, attempt limits) · **Data** (DPDP lawful basis, purpose limitation, retention, erasure) · **Sector** (lender's board-approved policy, outsourcing rules).
- Write types: `call.attempt` (Irreversible) · `call.record` (Append-only) · `promise.capture` (Reversible, retractable with its own record) · `disposition.set` (Reversible) · `escalation.raise` (Reversible) · `preference.update` ("Irreversible by design — never undone by an agent").
- Gates — Before the dial: 1 Lawful basis · 2 Preference scrub · 3 Time window · 4 Attempt cap and cooling period · 5 Script and template version · 6 Authority band · 7 Number and series. During the call: 8 Disclosure · 9 Identity check · 10 Read-back · 11 Prohibited-language guard · 12 Human path. After: 13 Recording integrity · 14 Disposition recorded.
- Channels: outbound voice via carrier partner; inbound callback; WhatsApp/SMS fallback.
- Refusal set (16, closed, "billed at zero"): no consent · on the preference register · outside window · attempt cap reached · cooling period active · template not approved · outside authority band · wrong number series · identity unconfirmed · third party on the line · borrower asked to stop · recording failed to start · language unsupported · script version mismatch · carrier unavailable · escalation required.
- Profile: `in-rbi-collections v1` — "Binds clause → control → gate → write type → proof".
- Does not prove: "That the debt is valid. That the person who answered is the borrower, beyond the identity check performed. That the conversation was kind … And the audio is proved authentic only from our capture point onward."
- Autonomy capped: may state facts, take a promise inside a declared band, escalate; never negotiate a settlement, waive a charge, or agree outside the band.
- Pricing: "Per governed call, refusals at zero, evidence sold separately per regime" (vs "a ₹2.80 resolved call").
- Pilot: "One lender, one early-bucket book, one quarter, three languages … with an auditor login from day one and cost per governed call published weekly beside their human baseline."
- Two dependencies: a carrier partner; G-E — "If it does, this pack is Attested advisory on that path, not Enforced — and the pack must say so rather than blur it."

### 1.12 L1 → L2 upgrade runbook (E19)
Frozen sentence: "An L1 → L2 upgrade provisions a key, switches signing on at a named sequence number, switches anchoring on, installs a certified profile, and exports a bundle that verifies offline. The tenant's declaration is unchanged except for one addition to block 6. Writes never stop."

Seven preconditions (each needs evidence attached; "verified not asserted"):
1. Proof preimage frozen since first record — evidence: "The whole chain replayed and every digest recomputed. Replay, not assertion"
2. Key custody in the tenant's residency domain with rotation window and registered successor — key register + a rotation already done in production
3. Anchor interval is a published SLO for the tier — a measured month
4. Offline verifier passes vectors incl. refusing the tampered bundle — vector run + reproducible build
5. A certified profile for at least one regime the tenant is in — registry entry, author ≠ certifier
6. Chain continuity over whole history reads continuous with scope and count
7. `proof_binding` covers every field the regime's bundle must contain — new declaration version, validated

Failure routing: 1 or 6 → "stops everything and becomes a forensic question"; 2–5 → platform readiness, "the tenant is not told a date"; 7 → tenant's declaration work ("the only one the customer participates in").

Stages: **0 Pre-flight** · **1 Key provisioning** · **2 Signing on — the irreversible instant** · **3 Anchoring on** · **4 Profile installed** · **5 First bundle exported and verified**, then **Flow 3 close**. Rollback per stage: 0 fully · 1 fully · 2 partially ("Records already signed stay signed") · 3 fully · 4 fully · 5 n/a ("A bundle already handed over cannot be recalled and must not be described as invalid"). Rollback after 2 leaves a **signed island** (three segments).

### 1.13 Auditor acceptance and pilot (E11, E18)
- E11 "Ask for these five things": sequence range; chain continuity report (three-valued: "continuous / break at record N / not checked over this range"); declaration versions verbatim; nightly integrity output for every night; meter reconciliation.
- Six L1 tests: 1 Contiguity · 2 Scope · 3 Two-way reconciliation to the target system ("the one that does the real work at Level 1") · 4 Refusals · 5 Segregation · 6 Enforcement mode.
- What we ask in a pilot (4): half a day at the start (three questions) · a written statement of what they would need · run test 3 on real data · tell us where the language is wrong. "What we will not ask: for an endorsement, for a logo, for a quotation".
- ledger1 pilot protocol: Day 0 auditor's half day · Day 1 upgrade · Days 2–75 run · Day 76 export · Day 77 auditor verifies · Day 78 E11 test 3 · Day 80 written verdict · Day 85 the G-D question ("would you pay for this on its own line, separately from the software?").
- Acceptance outcome enum *(proposed from note 07 "A written acceptance or a written objection")*: `accepted_in_writing` · `objection_in_writing` · `pilot_failed_main_purpose` (auditor would not run the verifier) · `not_yet`.

### 1.14 GA readiness checklist (E09) — eight rows, "done, measured rather than asserted"
1 Documentation · 2 Sandbox keys, self-serve (`sk_sbx_…`, tenant in < 60 s, p95 published) · 3 Quotas (sandbox 10 writes/min, 2 concurrent, 5,000/month, hard stop; `X-RateLimit-*`; 429 + `Retry-After`) · 4 Status page (components: submission, gates, writer, chain, meter, console; chain integrity its own component; incident history never edited) · 5 Support path (named human on a rota) · 6 Incident process (post-incident note for every P0/P1 within five working days) · 7 Versioning policy in force (`/v1`, 12-month sunset, `Deprecation` and `Sunset` headers; refusal codes never renumbered) · 8 Conformance tests published (C1–C14).

Conformance C1–C14: C1 import graph · C2 bypass attempt · C3 rung completeness · C4 determinism replay · C5 fail-closed matrix · C6 missing-grant resolution to A0 · C7 idempotency · C8 refusal shape · C9 chain integrity over 10,000 records · C10 meter reconciliation · C11 approval separation · C12 rollback drill · C13 version pinning · C14 claim boundary ("any instance of 'signed', 'tamper-proof' or 'independently verifiable' while running at L1 fails the build").

### 1.15 Third-party onboarding (E09)
Flow 1 Sign up and get a sandbox key · Flow 2 Author a declaration · Flow 3 Run the conformance tests · Flow 4 Request production, and the first governed action · Flow 5 The first invoice · plus the Promotion review (Attested advisory → Enforced, per write type, ≥ 30 days of production traffic). Production review checks "four things and only four": enforcement mode stated in writing and matching `channels[].mode`; every write type has a reversal plan or explicit irreversible flag; three outcomes proved in sandbox including a real refusal and a real escalation resolved by a real human; a named human certified the declaration.

Refused applicant categories (eight) and "what we say" — see §2.7 screen D6.

### 1.16 Evidence pricing (E10, E14, E17)
SKU 1 (platform licence, L1) tiers — all [modelled], per month, ex-GST, India residency, L1:

| Tier | Platform floor ₹/mo | Included governed actions | Overage ₹/action | Effective ₹/action | Fits |
|---|---|---|---|---|---|
| Sandbox | 0 | unlimited, metered at quantity 0 | — | — | Building. No production key |
| Pilot | 0 | 2,000 over 90 days, hard stop | — | — | One write type family, Attested advisory only, once per company |
| Starter | 40,000 | 5,000 | 6.00 | 8.00 | One system of record, shared residency domain |
| Growth | 1,25,000 | 25,000 | 4.00 | 5.00 | Two or three write type families in production |
| Scale | 4,00,000 | 1,00,000 | 2.50 | 4.00 | A product line running on the layer |
| Enterprise | 10,00,000+ | 5,00,000 | 1.50 | 2.00 | Dedicated residency domain, negotiated, DPA |

SKU 2 (evidence, L2 only; "not quotable before L2 is running"; shape "per verifier profile, per regime, per year, with unlimited exports"):

| Line | Indicative | Basis |
|---|---|---|
| L2 attestation add-on to SKU 1 | ₹2,00,000/mo [modelled] | "Key custody per residency domain plus the anchor interval SLO" |
| Verifier profile, per regime, per year | ₹6,00,000 [modelled] | "The right to produce conforming bundles for a named regime" |
| Bundle export | ₹0 | "Rationing the export teaches the customer not to use it" |
| The offline verifier | ₹0, source, to anyone, including non-customers | "A verifier behind a paywall is a verifier a sceptical auditor will not run" |

Rules: "Refusals are free and the database enforces it." Floor "not discountable by anyone, including the Founder"; overage discountable ≤ 20% by elan1 lead, without limit by Founder; meter basis and refusal price never negotiable. Annual prepay: two months free. Anchoring "never a metered unit". Honesty marks on any price shown internally: `[modelled]` · `[unverified]` · `[list]`. rung1 transfer price (₹0.40) "never quoted externally".

### 1.17 Phase 3 .md-note concepts (all L3 preview unless stated)
- **Third-party verification (L2)** vs **cross-organisation verification (L3)**: "From v3.0, 'third-party verification' means the first and is L2; 'cross-organisation verification' means the second and is L3." Cross-org = "Trust anchors and key distribution · Offline verification without network access · Revocation and key history · What a counterparty must be told"; decision: "A trust model that does not require trusting us."
- **Selective disclosure (L3)**: "Proving a fact without revealing the payload." SD-JWT approach; "What may be redacted and what may never be"; verification of a redacted bundle. At L2 only a single `redaction_profile` per export exists ("one profile per export"); undisclosed fields present as commitments.
- **Precedent and earned autonomy (L3)**: "How approvals and refusals become risk scores, and how an action class earns autonomy." Graduation "A0 to A5, and how autonomy is revoked"; "privacy rules written first"; tenant boundaries for shared models. E14 example: "this write resembles 40 earlier writes, 3 of which were refused". Constraint: "A model may produce a write intent. It may never produce an allow."
- **Action Receipt open standard (L3/Phase 4)**: public proof format spec with a free verifier; SCITT alignment; reference verifier and conformance tests; licence and governance.
- **Sovereign deployment (L3)**: topologies multi-tenant · customer VPC · on-premises; key custody in each; customer-held keys (customer's own HSM — "so that elan1 cannot have signed anything they did not"); dual control for sovereign tenants; air-gapped verification; operational limits; price implications.
- **Declaration / ontology full spec**: "Regulation clause -> control -> gate -> write type -> proof"; "The Lexicon and lexicon_hash"; seven blocks + Entities, Relations, Processes, Controls, Regulations. **Timing conflict**: E13 moves Controls and Regulations families to Phase 4. Until then "a profile is the unit".
- **Certification dossier**: ISO/IEC 42001 and SOC 2, "A gap list with costs and dates". UI must never claim certification ("We are not certified to either").
- **Regulator engagement dossier**: for "an RBI, SEBI or EU reviewer"; "What the proof establishes and what it does not"; "Answers to the ten questions a supervisor asks"; "Contact and disclosure protocol".

### 1.18 Refusal and platform codes appearing in these flows
`POLICY.DECLARATION_INVALID` · `POLICY.VERSION_NOT_SEQUENTIAL` · `POLICY.NOT_CERTIFIED` · `POLICY.WRITE_TYPE_UNKNOWN` · `POLICY.CHANNEL_NOT_PERMITTED` · `POLICY.DECLARATION_UNRESOLVED` · `GATE.DUAL_CONTROL_SAME_ACTOR` · `GATE.SANDBOX_DIVERGED` · `GATE.RESIDENCY_VIOLATION` · `PLATFORM.REGISTRY_UNAVAILABLE` · `PLATFORM.TARGET_UNREACHABLE` · `PLATFORM.LOG_APPEND_FAILED` · `PLATFORM.CHAIN_HEAD_CONFLICT` (P0) · `PLATFORM.TOKEN_MINT_FAILED` (-class, custody unavailable). Transport: HTTP 429 + `Retry-After` — "produces no proof entry and no meter event, and must never be reported by the suite as a refusal".


---

## 2. Screen inventory

Layouts follow the contract (`console` · `public` · `auth` · `bare` · `doc` · `mobile`). Console screens sit in one of the four doors. The public verifier site, auditor portal, developer portal, status and pricing pages are `public` or `doc` layouts **outside** the console. They are not doors, and they carry no Assurance pill because they do not belong to a tenant.

Personas used below:
- **EO**: tenant evidence owner (finance controller)
- **DO**: tenant declaration owner
- **TA**: tenant admin / production owner
- **AUD**: statutory auditor or CA
- **CP**: counterparty or outside reviewer with no account
- **KC**: key custodian (elan1)
- **A2**: second named human (the dual-control approver)
- **OP**: elan1 upgrade operator or SRE
- **IC**: incident commander
- **PA / PC**: profile author / profile certifier
- **PK**: pack author
- **FD**: founder
- **VE / RA**: verifier engineer / release approver
- **DEV**: third-party developer
- **RV**: elan1 onboarding reviewer
- **FIN**: consumer finance contact

### 2.1 Assurance door (console) — records, chain, anchors, evidence, profiles, meter, upgrade

Proposed `E1.navAdd('assurance', …)` items, in order: Overview · Proof · Chain · Anchors (L2) · Evidence (L2) · Profiles · Modes · Meter · Upgrade to L2 (only at L1) · Level 3 (preview group).

---

**A1. Assurance overview** — `#/assurance` — console · door `assurance` · section `overview` · **L1 and L2 variants** · EO, TA, AUD (read-only)
- **Header**: tenant name, residency domain (`in`), Assurance Level card showing "L1 Guarded" or "L2 Attested", and the frozen sentence for that level.
- **L1 variant sections:**
  1. Honesty line (verbatim): "This record is hash-chained. It is not signed, and it cannot yet be checked by someone who does not trust elan1. That arrives at Assurance Level 2."
  2. Chain continuity tile, three-valued: `continuous` / `break at record N` / `not checked over this range`, with scope and count, e.g. "continuous · 41,206 records · seq 1–41,206 · all 6 write types".
  3. Last nightly integrity run (date, result, duration). Link: `#/assurance/chain/runs/:date`.
  4. Enforcement mode summary per write type (Enforced / Attested advisory), plus any mode boundary. Link: `#/assurance/modes`.
  5. Meter for the period (governed actions, refusals at ₹0, reconciliation status). Link: `#/assurance/meter`.
  6. The E11 "Level 1 vs Level 2" comparison table. CTA "See what Level 2 adds" → `#/assurance/upgrade-l2`.
  - **Never shown at L1**: signature, key, anchor time, unanchored head, bundle export, verifier verdict.
- **L2 variant sections**, adding to the above:
  1. Unanchored-head line (verbatim form): "last counter-signature 14 minutes ago, 22 records unanchored". When degraded, it becomes a warning banner: "Anchoring degraded since 09:14 — 88 records unanchored".
  2. **Boundary row**, always visible: "Signing on at seq 41,207 · 41,206 records at Level 1 · 12,480 at Level 2". Use the date form "records from 12 August 2027 are signed; the 41,206 records before that date are Level 1 and are labelled so."
  3. Signing key in use: `key_id`, fingerprint, window. Link: `#/agents/keys/:keyId`.
  4. Timestamp authority pair status. Link: `#/assurance/anchors/authorities`.
  5. Installed profile(s). Link: `#/assurance/profiles/:profileId/v/:version`.
  6. CTA "Export evidence" → `#/assurance/evidence/export`.
- **Degraded proof state** (E16), a serious banner: "Signing stopped in domain in at 02:11 UTC. Writes continue at Level 1. Proof has degraded; writes have not." *(proposed wording; the source says the door "says so in those words": "writes keep working, proof degrades")*.
- **Empty** (new tenant, no records): "No governed actions yet. Your first record appears here when a write passes rung 7. Sandbox writes are in their own chain marked mode: sandbox." *(proposed)*

**A2. Proof — record list** — `#/assurance/proof` — console · `assurance` · `proof` · **L1** (L2 adds columns) · EO, AUD
- Filters: mode (`live`/`sandbox`), outcome (Committed/Refused), `write_type`, `actor_kind`, autonomy A0–A5, seq range, date range, assurance level (L2 only).
- Columns (`<th>`):
  - `seq` (mono)
  - Recorded at (UTC; local time on hover)
  - Write type
  - Actor (name + kind chip: Person / Software agent / Scheduled system)
  - Autonomy (A0–A5)
  - Outcome (Committed · Refused with code)
  - Declaration vN
  - Policy vN
  - Digest (shortened)
  - **[L2 only]** Level (1/2 chip), Key id, Anchored (Anchored · Unanchored · single_anchor)
- Row action → `#/assurance/proof/:seq`.
- **Empty filter** state: "No records match. A chain with no refusals in it is a chain to ask questions about." (the second sentence is from E11) — use it when the Refused filter returns zero on a live chain.

**A3. Record (seal) detail** — `#/assurance/proof/:seq` (alias `#/assurance/seals/:seq`) — console · `assurance` · `proof` · **L1/L2 variants** · EO, AUD, TA
- **Header**: "Record seq 41,388 · sales_invoice.submit · Committed", with a level chip "Level 1 — hash-chained, not signed" or "Level 2 — signed and anchored".
- **Panel 1 — The sixteen fields** (fixed order F01–F16, two columns: plain label + mono value). Refusal variant: F12 renders `00000000-0000-0000-0000-000000000000 (refusal)` and F13 renders `0 (refusal)`.
- **Panel 2 — Digest**: SHA-256 over the 329-octet-form preimage, `prev_digest` link → `#/assurance/proof/:seq-1`, and the next record link.
- **Panel 3 — Beside the record, not in the preimage** (the heading says this): gate results for every declared gate (gate, result, inputs seen); rung that decided; approval (approver, "what they were shown" digest, time, link to the approval's own record seq); reversal plan; meter event (basis, quantity, ₹0 on refusal); enforcement mode of the write type.
- **Panel 4 [L2 only]**, titled "Signature and anchor — Level 2": `signature` (Ed25519, pure), `key_id` → `#/agents/keys/:keyId`, key window check ("recorded_at inside window"), `anchor_ref` → `#/assurance/anchors/:batchId`, inclusion path length, both TSA `genTime`s.
- **L1 variant**: Panel 4 is replaced by the honesty line. There is **no** "Signed by" row and no empty signature row. The row is absent, matching "the signature field is absent, not stubbed".
- **Erased payload** note (info): "chain intact, payload unbound" — never red.
- Actions:
  - "Open declaration v7" → `#/records/declarations/:id/v/:n`
  - "Open approval record" → `#/assurance/proof/:approvalSeq`
  - [L2] "Export a bundle containing this record" → `#/assurance/evidence/export?seq_from=…&seq_to=…`
- **Error**: seq not found → "No record at seq 99,999 in this tenant's chain. The head is seq 53,686." *(proposed)*

**A4. Chain continuity** — `#/assurance/chain` — console · `assurance` · `chain` · **L1** (L2 adds boundaries) · EO, AUD, OP
- **Continuity statement** (three-valued, big): `continuous` / `break at record N` / `not checked over this range`, always followed by "Scope: seq 1–53,686 · 53,686 records · 6 of 6 write types · full_chain".
  - Warning copy: "A chain verified over three of twenty-three change types is a chain verified over almost nothing, and it reads identically to a full verification unless the report prints the scope."
- **Nightly integrity runs** table: date, range, records recomputed, result (three-valued), duration. Row → `#/assurance/chain/runs/:date`. A break is "a top-severity incident, not a warning" (critical).
- **Boundary rows** (from `chain.json`): assurance-level boundaries (e.g. L1→L2 at seq 41,207), key changes (e.g. `k_in_20270615_4d7e` → successor at seq N), enforcement-mode boundaries per write type, signed-island segments after a rollback. Each boundary shows counts on each side.
- Action: "Verify over full range" (runs replay; OP only) → result inline.
- **Tail note** (L1): "A hash chain cannot detect a truncated tail. At Level 1, test for it by reconciliation against the target system, not by verifying the chain." (adapted from E11 §4)

**A5. Nightly integrity run** — `#/assurance/chain/runs/:date` — console · `assurance` · `chain` · **L1** · OP, AUD
- Fields: run id, started/finished, tenant range, records recomputed, result, first break (seq, field, expected, found), and paging state.
- A missed run shows as "not checked over this range", never as clean. Copy: "We do not report an unchecked range as clean." (E16)

**A6. Anchors — batches** — `#/assurance/anchors` — console · `assurance` · `anchors` · **L2** (labelled "Level 2 Attested") · OP, EO, AUD
- Head line: "last counter-signature 3 minutes ago, 0 records unanchored" plus the published interval SLO ("≤15 minutes, Growth tier").
- Columns: Batch id · seq range · Leaf count · Merkle root (short) · Authority A (eMudhra) genTime · Authority B genTime · Status (Anchored / single_anchor / Anchored late / Open) · Lag (last record → token).
- Row → `#/assurance/anchors/:batchId`.
- **L1 route behaviour**: the route renders an L2-gated empty state: "Anchoring arrives at Level 2. At Level 1 there is no external time anchor, so a chain cut at the tail cannot be detected from the chain alone." (adapted from E11) CTA → `#/assurance/upgrade-l2`.

**A7. Anchor batch detail** — `#/assurance/anchors/:batchId` — console · `assurance` · `anchors` · **L2** · AUD, OP
- Sections:
  - Batch: tenant, seq range, leaf count, closed at.
  - Merkle: root, algorithm note "RFC 6962 §2.1 · odd final node promoted".
  - Tokens: one card per authority with `messageImprint`, `genTime`, policy id, accuracy, nonce, round-trip time, certification path, revocation data captured at anchor time.
  - Inclusion path explorer: pick a seq to see its sibling digests.
  - What an anchor proves (verbatim rule text) and what it does not prove (four bullets from E17).
- The `single_anchor` state carries a warning chip, and the copy "Anchored by one authority. A degraded state, not a failure."

**A8. Timestamp authorities** — `#/assurance/anchors/authorities` — console · `assurance` · `anchors` · **L2** · OP, AUD
- One card per authority: name, country, role (India-based / global), RFC 3161 practice statement link, time source, SLA (availability %, response time), certificate validity, contract status, tokens this month, degraded intervals.
- **Degraded intervals** table: start, end, cause, batches affected, write-up link → `#/assurance/anchors/incidents/:id`.
- Rules panel: "every batch is anchored by two authorities, and at least one is India-based" and "Free public authorities … never in a production bundle."
- Operational action (OP): "Remove from pair" (requires a written reason). Copy: "Running with a known-bad authority to preserve the pair is worse than running with one."

**A9. Anchoring incident write-up** — `#/assurance/anchors/incidents/:id` — console · **L2** · OP (write), EO/AUD (read)
- Fields: window, both authorities' state, cause, affected batches (anchored late, in order, own roots), maximum unanchored head, write-up text.
- Copy: "A batch anchored late carries its true token time."

**A10. Evidence — export** — `#/assurance/evidence/export` — console · `assurance` · `evidence` · **L2** · EO (requires ro token), OP acting for tenant
- **Form:**
  - Range: seq range or date range.
  - Profile picker: installed profiles, or "No profile claimed" (the manifest then omits the profile, and the "verifier runs integrity checks only").
  - Redaction profile (read-only, from declaration block 6).
- **Pre-generation summary**, shown "before anything is generated": record count, refusal count, unanchored head, assurance levels in range with counts, continuity scope.
- Button "Prepare export" → a governed write (the rung strip animates through the nine rungs) → success → `#/assurance/bundles/:id`.
- **Refusals and errors** (verbatim codes, with the screen offering the documented alternatives):
  - `GATE.RESIDENCY_VIOLATION` → offers "the in-domain endpoint".
  - `POLICY.DECLARATION_UNRESOLVED` → names the missing `(declaration_id, version)`.
  - Precondition refusal (incomplete nightly run) → shows "the last clean night" and offers "Export the clean range instead".
  - Profile window excludes part of the range → "offers the two sub-ranges with their profile versions".
  - Oversized export → refused "with the limit and the suggested split, never silently truncated".
  - Object store unavailable → "nothing partial is written"; retry is idempotent.
- **L1 route behaviour**: "Evidence export arrives at Level 2. At L1 there is no bundle, no signature, no anchor and no verifier profile." (E10 wording) CTA → `#/assurance/upgrade-l2`.

**A11. Bundles — export log** — `#/assurance/bundles` — console · `assurance` · `evidence` · **L2** · EO, AUD
- Explainer: "We keep the manifest digest and the export as a governed write … and we keep nothing else. A customer who loses a bundle re-exports it."
- Columns: Exported at · By (name) · seq range · Records · Refusals · Unanchored at export · Profile claimed · Redaction profile · Bundle digest · Export record seq.
- Row → `#/assurance/bundles/:id`. Row action "Re-export" (the result is "byte-identical except for exported_at").
- **Empty**: "No bundles exported yet. A bundle is generated when you ask for a period; we do not keep copies." *(proposed)* CTA → `#/assurance/evidence/export`.

**A12. Bundle detail / Export ready** — `#/assurance/bundles/:id` — console · `assurance` · `evidence` · **L2** · EO, AUD
- **Success header** (verbatim form): "Export ready — 12,480 records, 611 refusals, 22 unanchored, profile in-mca-audit-trail v1" with the bundle digest and a Download (.tar) button.
- **Instruction callout** (verbatim): "Verify it yourself first. If it does not pass for you it will not pass for them."
- Sections:
  - Manifest: every field from §1.4.
  - Members: path, bytes, SHA-256 for all eight.
  - Assurance levels in range: segments with counts.
  - `chain.json` boundary rows.
  - `keys.json` preview: ids, windows, status, fingerprint only. Note: "Key material is never in a bundle."
  - `VERIFY.txt` preview: the command, the exit codes, the limits statement.
  - The export's own governed record: link → `#/assurance/proof/:seq`.
  - Suggested auditor note: link → `#/auditor/note`.
- Actions: "Copy verifier command"; "Get the verifier" → `#/verify`; "Hand-off note for your auditor" (downloads the one-page note, E19 §07).

**A13. Verifier profiles — registry** — `#/assurance/profiles` — console · `assurance` · `profiles` · **L2 executes; authoring allowed at L1 as "L2 preparation"** · PA, PC, EO
- Columns: `profile_id` · version · regime · issuer · jurisdiction · status (`draft`/`certified`/`superseded`/`withdrawn`) · author · certifier · `rule_as_at` · applies_to window · P1–P12 (x/12) · installed on tenant (yes/no).
- Actions: "New profile" → `#/assurance/profiles/new`; row → `#/assurance/profiles/:profileId/v/:version`.
- **Empty**: "No certified profile for your regimes yet. A profile binds each clause of one regime to a write type, a gate and a field — by name." *(proposed, using E13 wording)*

**A14. Profile version detail** — `#/assurance/profiles/:profileId/v/:version` — console · `assurance` · `profiles` · **L2** · PC, EO, AUD
- Tabs, one per block: Identity · Regime binding (the clause table) · Bundle requirements · Checks (C01–C06 table) · Report vocabulary · Limits statement (verbatim, full) · Versioning · Conformance (P1–P12 with date and fixture set) · Digest.
- Superseded/withdrawn banner, e.g. "Withdrawn on 3 March 2028. Bundles claiming this version exit 4 UNSUPPORTED with the withdrawal date printed." *(example)*
- Actions:
  - "Dry run against fixtures" → `#/assurance/profiles/:profileId/v/:version/dry-run`
  - "Install on tenant" (OP, stage 4) → modal
  - "Certify this profile version" (PC only) → `#/work/decide/:id`

**A15. Profile author / edit** — `#/assurance/profiles/new` and `#/assurance/profiles/:profileId/edit` — console · **L1 (preparation) / L2** · PA
- An eight-block editor. Every field takes one of three dispositions (value / out_of_scope + ADR / not_measurable + reason + would_change_if, ≥ 12 characters).
- The Regime binding editor requires verbatim `clause_text`. Name resolution runs live against certified declarations; an unresolvable name is shown as an error, not a warning.
- Limits statement editor: character counter (must be > 200) and a uniqueness check.
- Validation messages (verbatim): "a profile that binds to a gate nobody declared binds to nothing"; orphan clause and orphan check errors; a clause bound to a write type absent at the named declaration version is "refused with both names printed".
- Rule callout: "A clause binds to a write type, a gate and a field — by name — or it does not bind."
- Actions: Save draft · Dry run · "Request certification" (Send to: eligible names, **no agents**) → `#/work/decide/:id`. If the author tries to certify: `GATE.DUAL_CONTROL_SAME_ACTOR`.

**A16. Profile dry-run report** — `#/assurance/profiles/:profileId/v/:version/dry-run` — console · **L2 preparation** (label: "Dry run — not a verification of your records") · PA, PC
- Two runs side by side: the known-good bundle (must exit 0 PASS) and the known-tampered bundle (must exit 1, naming the record and field).
- At L1: signature, key-window and anchor rows read `not_applicable — assurance level 1`. The verdict reads "0 PASS — unsigned, assurance level 1", and C06 reads `not_applicable — assurance level 1`.
- Renders the full nine-section report component (§2.8 V4).

**A17. Enforcement modes** — `#/assurance/modes` — console · `assurance` · `modes` · **L1** · TA, AUD
- Per write type: channel, mode (Enforced / Attested advisory), mechanism (credential custody / token acceptance), permitted sentence, not-permitted sentence, and the promotion boundary (date, record counts on each side, mode each side).
- Attested advisory copy (verbatim): "This channel is Attested advisory. Permitted: every attempt is evaluated and recorded. Not permitted: we block, we prevent, nothing gets through without us."
- Enforced sentence (verbatim): "this write could not have occurred without passing the gates".
- Revert banner: "Mode reverted to Attested advisory on payment_entry.submit on 9 March 2028 — an unrecorded write reached the target." *(example; the rule is E09 decision 7)*
- Action "Request Enforced mode" → `#/assurance/modes/promote`.

**A18. Request Enforced mode** — `#/assurance/modes/promote` and status `#/assurance/modes/promotions/:id` — console · **L1** · TA
- Form: write types (multi-select; must have ≥ 30 days of production traffic in Attested advisory, otherwise disabled with the day count shown); mechanism (radio: credential custody / token acceptance); production owner.
- Status timeline:
  1. Bypass proof (C2 against the real target, with attempts listed)
  2. Long-lived credential check
  3. Rollback drill (fast path and forward path)
  4. New declaration version certified (dual control)
  5. Approved
- A refused promotion names "which path succeeded". Copy: "A consumer who cannot close it is not a failed customer; they are an honest Attested advisory customer."

**A19. Meter** — `#/assurance/meter` — console · `assurance` · `meter` · **L1** · FIN, EO
- Period selector. Counters: governed actions · refusals (₹0) · included · overage.
- Reconciliation status (reconciled / break at N / not checked), with the rule "An invoice is never issued over an unreconciled period."
- Event table: event id, `write_id`, seq (link), basis, quantity, outcome.
- Filter `?invoice=:id&line=:n` supports "Show the records behind this line".

**A20. Invoices** — `#/assurance/meter/invoices` and `#/assurance/meter/invoices/:id` — console · **L1** (SKU 2 lines appear at L2) · FIN
- Invoice lines: platform floor · included volume · overage at tier rate · "Refusals — 1,318 at ₹0" on the face of the invoice · [L2] L2 attestation add-on · [L2] verifier profile per regime per year · Bundle exports ₹0 · GST · total.
- Each line has a "Show the records behind this line" link → `#/assurance/meter?invoice=:id&line=:n`.
- "Dispute this line" opens a drawer: seq range and reason → dispute `#/assurance/meter/disputes/:id` (line held, rest proceeds).
- Open-period state: "This period is open. Reconciliation has not completed, so no invoice has been issued." *(proposed, from E09 Flow 5)*

**A21. Plan and pricing (tenant)** — `#/assurance/meter/plan` — console · **L1/L2** · FIN, TA
- Current tier, floor, included volume, overage rate, anchor interval SLO (L2), SKU 2 lines (L2 only), annual prepay option.
- Never shows internal transfer prices.

**A22. Upgrade to Level 2** — `#/assurance/upgrade-l2` — console · `assurance` · `upgrade` · **L1 → L2** (label "Level 2 Attested upgrade") · TA/DO (customer view), OP (operator view)
- **Intro**: the frozen sentence; "The tenant does not re-declare, does not migrate and does not stop writing"; and a "What changes / what stays exactly as it was" two-column table (E19 §02).
- **Demonstration**: the `in-mca-audit-trail` C06 row reading `not_applicable — assurance level 1` today, and what it becomes at L2.
- **Preconditions checklist**: seven rows, each with evidence attached, a status (true / false / not measured) and a routing note.
  - Customer-actionable row 7 → `#/records/declarations/:id/edit?block=proof_binding`.
- **Stage stepper** 0–5 → `#/assurance/upgrade-l2/stage/:n`; rollback → `#/assurance/upgrade-l2/rollback`; close → `#/assurance/upgrade-l2/close`.
- **Customer communications panel**: the 14-day notice (sent date, contact), the boundary confirmation, and the first-bundle note.
- **Empty/locked copy** when platform preconditions 2–5 fail: "Your upgrade date is not set yet. Level 2 depends on platform readiness items that are not complete; we do not give a date until they are." *(proposed, E19 rule "the tenant is not told a date")*

**A23. Upgrade stage screens** — `#/assurance/upgrade-l2/stage/0` … `/5` — console · **L2 upgrade** · OP (acts), A2 (approves at stage 2), TA (sees)
- **Stage 0** — full-chain replay output (verbatim form): "continuous, 41,206 records, seq 1–41,206, all 6 write types". Key register check. Profile registry check. "Head seq recorded: 41,206".
- **Stage 1** — key binding (status "Key bound · signing off"). Fingerprint published to the notice contact (channel, time, "recorded").
- **Stage 2** — "Signing on — the irreversible instant". Callout: "Stage 2 is the only step in this runbook that cannot be undone." Button "Request approval to enable signing" → `#/work/decide/:id`. After approval the result line reads "Signing on at seq 41,207 · 41,206 records at Level 1 · 0 at Level 2". Then "Verify first ten signed records (with the tenant's fingerprint)".
- **Stage 3** — anchoring on: a live unanchored-head sparkline, rising then falling. The first batch shows two tokens, two paths and revocation data. If the head does not fall within two intervals → link to `#/assurance/anchors/incidents/:id`.
- **Stage 4** — declaration version with the `proof_binding` addition (certified). Profile installed. Dry export result; the note "A 2 FAIL_PROFILE here is expected and useful".
- **Stage 5** — the tenant exports themselves (link to A10), runs the verifier offline, and runs the tampered bundle. Checkboxes are attested by the tenant: "Tenant verified 0 PASS" and "Tenant watched tampered bundle exit 1".
- **Refusals**: an incomplete integrity run → the precondition refusal shows "the last clean night"; same approver → `GATE.DUAL_CONTROL_SAME_ACTOR`; profile `applies_to_records_from` later than the boundary → "prints both dates".

**A24. Upgrade rollback** — `#/assurance/upgrade-l2/rollback` — console · **L2** · OP
- A stage-reached table with reversibility (fully / partially / n/a).
- A reason field is required and is written as a governed write. Example: "We stopped signing on 14 August because the anchor pair could not be contracted".
- A three-segment preview of the signed island with counts.
- Customer notification (within 24 hours).
- A disabled action "Sign the trailing segment" with the explanation "The segments stand." (the kernel refuses).

**A25. Upgrade closing record** — `#/assurance/upgrade-l2/close` — console · **L2** · OP, TA
- A seven-step checklist (E19 Flow 3), then "Write closing record": boundary seq, boundary timestamp, counts, profile installed, the bundle digest the customer verified, and both named humans.
- Copy: "The upgrade is closed by this record and by nothing else — not by a ticket, not by an email, not by an operator's opinion."
- Any failed step → "Upgrade reopened". There is no "closed with follow-ups".

**A26. Auditor requests (tenant view)** — `#/assurance/evidence/requests` — console · **L1/L2** · EO
- The list of evidence requests made by the tenant's auditor, each recorded "as a governed write in the tenant's chain, so the tenant can see that their auditor asked and what was supplied". Columns: requested by, date, what was asked, what was supplied, record seq.

### 2.2 Agents door (console) — keys and custody

Proposed `E1.navAdd('agents', …)`: Keys · Key use · Autonomy (L3 preview).

**K1. Keys — register** — `#/agents/keys` — console · door `agents` · section `keys` · **L2** (labelled) · KC, OP, AUD (read)
- Class tabs: Domain signing · Anchor client · Release · Transport (the Transport tab carries the note "not in the evidence path").
- Columns: `key_id` · class · residency domain · status (`active`/`retired`/`revoked`) · `valid_from` · `valid_to` · successor · fingerprint (short) · records signed · rotation record seq · custody (e.g. "AWS KMS · ap-south-1 · ECC_NIST_EDWARDS25519" or "Offline hardware token · 2 holders").
- Honest isolation note: "One signing key per residency domain, not per tenant. A tenant cannot prove its records were signed by a key no other tenant's records used. A dedicated key requires a dedicated residency domain (Enterprise) or customer-held keys (Level 3)."
- Actions: "Generate successor" → `#/agents/keys/new?class=domain`; row → `#/agents/keys/:keyId`.
- **L1 empty state** (verbatim from E12): "At L1 there are no keys, and there is no key material anywhere — not in a config file, not in a vault, not 'just for testing'." CTA → `#/assurance/upgrade-l2`.

**K2. Key detail** — `#/agents/keys/:keyId` — console · `agents` · `keys` · **L2** · KC, AUD
- Identity: id, class, domain, fingerprint in full (mono, grouped), public key algorithm "Ed25519 (pure)".
- Window timeline: the predecessor | this | successor windows, drawn abutting. The chip "Overlap: none" (good + text).
- Counts: records signed under this key; Sign calls (KMS) this period; reconciliation status.
- Custody: module, region, `Origin: KMS`, the single IAM principal. Link: `#/agents/keys/policy`.
- History: generated, registered (governed record seq), activated, retired/revoked (reason, `T_suspect`), fingerprint publications (channel, date, recipient).
- Revoked-key panel, three statements verbatim: "They still verify" · "They are no longer exclusive" · "They are still anchored".
- Actions (KC): "Rotate" → `#/agents/keys/:keyId/rotate`; "Report suspected compromise" → `#/agents/keys/:keyId/revoke`.
- There is no Export, no Download and no "Sign" action, anywhere. This is by design, and the screen says so. Suggested footer: "There is no administrative 'sign this' surface." (E16)

**K3. Generate successor / register window** — `#/agents/keys/new` — console · **L2** · KC
- Step 1: "Generate successor" (the KMS creates the key in-region). Readback shows the public key and fingerprint, with "nothing signs with it yet".
- Step 2: `valid_from`, at least 24 hours in the future (a scheduled rotation is registered 30 days before the cut). The window visual shows predecessor vs successor, with "Overlap: none" or a refusal "with both windows printed".
- Step 3: "Request approval" → `#/work/decide/:id` (Send to: eligible humans, no agents).
- **Refusals**: overlap → "A key registered with a valid_from earlier than the predecessor's last signature is refused"; open chain integrity incident → "A rotation attempted while a chain integrity incident is open refuses at precondition"; same actor → `GATE.DUAL_CONTROL_SAME_ACTOR`.

**K4. Rotate key** — `#/agents/keys/:keyId/rotate` — console · **L2** · KC, A2
- A seven-step tracker (E16 Flow 1):
  1. Successor generated
  2. Registered
  3. Approved (seq)
  4. Cut at `valid_from`, with both windows written in one transaction
  5. Predecessor retired
  6. Operator view: counts under each key and the rotation seq
  7. Fingerprint published out of band (recorded)
- Failure state: "KMS unavailable at the cut instant — the domain has failed closed. Writes in domain in are refusing with a platform-class code. Nothing is signed with a stale key." *(proposed wording from E16)*

**K5. Suspected compromise / revoke** — `#/agents/keys/:keyId/revoke` → incident `#/agents/keys/incidents/:id` — console · **L2** · IC, KC, A2, FD (late `T_suspect`)
- Step 1: "Declare P0 key incident" and set `T_suspect`. Help text: "always the earliest defensible time, never the most convenient one".
- Step 2: "Stop signing in domain" → banner on the Assurance door: records continue at `assurance_level: 1`.
- Step 3: successor under dual control; the predecessor's `valid_to = T_suspect`, which creates a "declared unsigned interval".
- Step 4: mark revoked, with the reason (verbatim, retained forever).
- Step 5: tenant notifications within 24 hours from a fixed template. Recipients list with timestamps. The template must name the instant, the range signed by the revoked key, what is still true, and what is not.
- Step 6: anchor coverage split — records before `T_suspect` covered by an anchor issued before `T_suspect` (count) vs not covered (count).
- Step 7: re-enable signing; the unsigned interval closes; the boundary is rendered permanently.
- **Refusals**: "A request to re-sign the revoked range is refused by the kernel". A `T_suspect` later than when the suspicion was raised requires founder approval and a written reason.

**K6. Key-use reconciliation** — `#/agents/keys/reconciliation` — console · `agents` · `keys` · **L2** · OP, AUD
- Nightly two-way table per domain per night: KMS Sign calls · signed records · result (`reconciled` / `break at N` / `not checked over this range`) · scope and count.
- A `Sign` call with no record is critical, with the copy "something invoked the key that was not the chain writer. Domain stopped."
- An excess of records over calls: "impossible and would indicate a fabricated record".

**K7. Key policy evidence** — `#/agents/keys/policy` — console · **L2** · AUD, KC
- The KMS key policy and IAM policy verbatim (mono block).
- The policy change history (from the provider's configuration history, "which we do not write to").
- Dual-control change records.
- The limitation stated unprompted (verbatim gist): "at Phase 3 the signing key is held in our cloud account under a managed KMS. A sufficiently privileged insider in that account could alter the key policy … The custody model that removes this is customer-held keys, which is L3."
- **Refusal copy** for "Request key material": "A custody module that can export a key is not a custody module." (E16)

**K8. Autonomy and precedent** — `#/agents/autonomy` — console · `agents` · `autonomy` · **L3 preview** · TA
- Shows current A0–A5 grants per actor and write type (L1 fact), plus a labelled L3 preview of "earned autonomy" (graduation A0→A5 and revocation) and precedent ("this write resembles 40 earlier writes, 3 of which were refused").
- The preview banner must say that precedent "waits until the model boundary is proven in production" and repeat "A model may produce a write intent. It may never produce an allow."

### 2.3 Records door (console) — packs, declarations delta, ontology

Proposed `E1.navAdd('records', …)`: Packs · Pack candidates · Portfolio register · Ontology (L3 preview).

**R1. Evidence packs — catalogue** — `#/records/packs` — console · `records` · `packs` · **L2** (packs are "the sellable unit of L2") · EO, TA, PK
- Cards: `ledger1` (status: Pilot / Available), `invoice1` (status: Second pack — profile not yet certified), `collect1` (status: Spec sketch — rule citations need counsel confirmation). Each card: domain sentence, obligation and date, buyer, auditor, profile binding, T1–T8 progress, price line (SKU 2).
- Header rule: "Packs are the sale. Screens are the surface."
- **Empty**: "No packs installed. A pack is one declaration, one certified verifier profile and one export mapping for one dated obligation." *(adapted)*

**R2. Pack detail** — `#/records/packs/:packId` (e.g. `#/records/packs/ledger1`) — console · `records` · `packs` · **L2** · EO, AUD, PK
- Tabs: the eleven blocks (Identity · Obligation · Buyer · Gate scores · Declaration · Write types · Gates · Profile binding · Buyer promise · Tests · Pilot).
- Always visible: the buyer promise (three sentences) and "what it does not establish" in the same block (never on a separate tab or below the fold).
- The Write types tab uses the ledger1 table (§1.10). The Gates tab shows the ordered chain with "never-skippable" chips on six and a "declared on" chip on `budget`.
- Actions: "Install pack" → `#/records/packs/:packId/install`; "Open profile" → `#/assurance/profiles/in-mca-audit-trail/v/1`; "Pilot" → `#/records/packs/:packId/pilot`.

**R3. Install pack** — `#/records/packs/:packId/install` — console · **L2** (if the tenant is L1 the first step routes to `#/assurance/upgrade-l2`) · TA, DO, OP
- Steps:
  1. Level check (L2 required; `min_assurance_level: 2`)
  2. Declaration match (the tenant's declaration contains the pack's write types at the pinned version)
  3. `proof_binding` addition — new declaration version, certified under dual control → `#/work/decide/:id`
  4. Profile install (`applies_to_records_from` must not be later than the tenant's boundary; otherwise "prints both dates")
  5. Dry export
  6. First bundle exported by the tenant
- Summary line: "ledger1 installed · profile in-mca-audit-trail v1 · applies to records from 2027-07-01".

**R4. Pack pilot tracker** — `#/records/packs/:packId/pilot` — console · **L2** · FD, PK, EO (read)
- Timeline Day 0 → Day 85, each with its date, status and artefact: Day-0 statement; boundary date; run; export (by tenant, "without our help"); auditor verification ("We are not in the room"); test 3 exceptions; the Day-80 verdict (verbatim, "including if it is unflattering"); the Day-85 G-D answer.
- Failure mapping: `FAIL_INTEGRITY` = P0, "stops the pack, not just the pilot"; `FAIL_PROFILE` = profile defect, new version; `INCOMPLETE` = export defect.
- Banner rule: "A conversation with an auditor is never described, internally or externally, as validation."

**R5. Pack candidates** — `#/records/packs/candidates`, `#/records/packs/candidates/new`, `#/records/packs/candidates/:id` — console · **Any** (internal) · PK, FD
- The one-page candidate: domain, hook with date, buyer job title, auditor job title (and organisation, "somebody who could be telephoned"), write types elan1 would own.
- Gate scoring grid G-A to G-E: pass/fail plus a mandatory sentence each. There is **no** "probably" option.
- "Submit for admission" → `#/work/decide/:id` (founder approves; same-actor is refused).
- G-E validation copy: "reading a log is observation".

**R6. Portfolio register (rejections)** — `#/records/packs/register` — console · **Any** · FD, PK
- Columns: candidate · gate failed · sentence · decided by · date. Seed rows: agri1 (G-B, "subsidy audits are annual and on paper"), legal1 (G-E), energy1 (G-E, "the write path belongs to SCADA vendors"), public1 (G-A and G-D), edu1 (G-D), retail1 (G-B, "nobody audits a price change").
- Rule: "It is not softened, parked or renamed."

**R7. Declaration block 6 (`proof_binding`) — L2 delta** — `#/records/declarations/:id/edit?block=proof_binding` — console · **L2 preparation** · DO
- This delta applies to the Studio owned by the Records agent. Block 6 gains `redaction_profile` and additional `fields[]` inside F14 required by the bound profile ("the only place an upgrade touches the declaration").
- Show the profile's `proof_binding_fields[]` beside the editor, with coverage ticks.

**R8. Ontology — clause to proof** — `#/records/ontology` — console · **L3 preview** (Phase 4 per E13) · DO, AUD
- A read-only chain diagram: Regulation clause → control (check) → gate → write type → proof (record fields). It is populated from installed profiles today (e.g. the `in-mca-audit-trail` four rows).
- Label: "Controls and Regulations families arrive later. Today a verifier profile is the unit." (adapted from E13)

### 2.4 Work door (console) — dual-control decisions and internal reviews

**W1. Decide — dual-control variants** — `#/work/decide/:id` — console · `work` · `approvals` · **L1** (declaration/profile/pack) and **L2** (key, signing, release) · A2
The existing Decide screen, owned by the Work agent, needs these variants. Each shows the requester, what is being approved, and "what they were shown" (digest). Each has Approve and Refuse buttons plus Send to (humans only). If the approver is the requester, the Approve button is replaced by `GATE.DUAL_CONTROL_SAME_ACTOR` and eligible names.

| Variant | Key content | Level |
|---|---|---|
| Certify declaration version | version N, compiled digest, diff vs N−1 | L1 |
| Certify profile version | profile id/version, P1–P12 results, limits statement | L1 prep / L2 |
| Admit pack candidate | G-A…G-E scores and sentences | Any |
| Register signing key window | predecessor / successor windows, "Overlap: none" | L2 |
| Revoke key | `T_suspect`, reason, range affected | L2 |
| **Enable signing (upgrade stage 2)** | boundary seq preview, "the irreversible instant" callout | L2 |
| Publish verifier release | two build digests (must match), vector results, tampered-bundle result | L2 |
| Break-glass write | declared write type, visible to tenant | L1/L2 |

**W2. Production access reviews (elan1 internal)** — `#/work/reviews/production` and `#/work/reviews/production/:id` — console · `work` · `reviews` · **L1** · RV
- Queue columns: applicant, company, declaration version, conformance result (14/14), requested at, SLA "Two working days" remaining.
- Detail: the four checks as a checklist (only four); the attachments (conformance result file hash, declaration version, target system, residency domain, production owner); and the refusal categories as quick-refuse reasons, each with its "what we say" sentence.
- Approve → issues `sk_live_…` scoped to tenant, write types and residency domain.

**W3. Promotion reviews (elan1 internal)** — `#/work/reviews/promotion/:id` — console · **L1** · RV
- Bypass proof attempts (path, outcome, record seq); the credential inventory check; the rollback drill (fast path and forward path records); the new declaration version.

### 2.5 Public verifier site (layout `public`, no login, **Any** level; content describes L2 artefacts)

**V1. Verify — landing** — `#/verify` — public · CP, AUD
- Hero: "Check an elan1 evidence bundle yourself — offline, with no account." *(proposed)*
- Facts (from E14 claim boundary): "The verifier is free, ships as source, has no dependencies, and we publish a deliberately tampered bundle so you can watch it refuse."
- Sections:
  - Download (latest release: version, date, digest) → `#/verify/releases/:version`.
  - The command (copy block).
  - "Get the key fingerprint from your own source, not from the bundle and not from this page alone."
  - The four routes to trust the verifier.
  - Exit codes summary → `#/verify/exit-codes`.
  - Tampered bundle → `#/verify/tampered`.
  - Reading the report → `#/verify/report-guide`.
  - Specs → `#/developers/spec/bundle-v1`.
- **Never** offer an in-browser "upload your bundle and we'll verify it". That would put our code and our network in the verification path. See Gaps §6.

**V2. Releases** — `#/verify/releases`, `#/verify/releases/:version` — public · CP, AUD
- Per release: binaries per platform, source tarball, `SHA256SUMS`, release signature, release key fingerprint (with "obtain out of band" note), build instructions (pinned toolchain digest, `SOURCE_DATE_EPOCH`), vector set, tampered bundle, second publication location link, and the governed release record seq.
- Superseded release banner, e.g. "Superseded on 2 February 2028: v1.0.2 accepted a duplicated odd Merkle node (NV-13). Runs made with it before that date should be repeated." *(example; the rule is "superseded, never withdrawn silently", with a dated note)*

**V3. Exit codes** — `#/verify/exit-codes` — public · CP, AUD
- The six-code table (§1.5) and the "three failures a verifier must never confuse" table. Status tokens as specified, always with text labels.

**V4. Report guide / sample report** — `#/verify/report-guide` — public · AUD, CP
- An annotated nine-section report (the sample in §4.5), with a callout: "Section 8 is what makes sections 1 to 7 credible."

**V5. Tampered bundle** — `#/verify/tampered` — public · AUD, CP
- What was altered is not revealed up front (let the verifier name it). Expected output shape: "exit 1 FAIL_INTEGRITY naming the altered record and field". Copy: "A verifier nobody has watched refuse is not a verifier."

**V6. Fingerprints and out-of-band channel** — `#/verify/fingerprints` — public · CP
- Explains key discovery ("a register problem, solved out of band"). Lists the channels a pinning reader was given at onboarding (open question E16 #2: signed notice / DNS record / printed page). Shows the `dev-DO-NOT-TRUST` fingerprint so readers can recognise dev bundles.

### 2.6 Auditor portal (layout `doc`/`public`; the pilot area needs an auditor login — collect1: "an auditor login from day one")

**AU1. Auditor home** — `#/auditor` — public/doc · AUD
- Opening: "You have been asked to form a view on a system that lets software make changes to a company's books." (E11)
- Cards: Evidence and audit note · Level 1 checking procedure · Key custody evidence · Verify a bundle · Your pilot (logged-in).
- Disclosure line: "It is written by the vendor. Read it as such."

**AU2. Evidence and audit note** — `#/auditor/note` — doc · AUD
- E11 rendered in full. Section 4 "What an elan1 record does not establish" is never collapsed, moved later or put in an accordion (E11 decision 2).
- The obligations mapping table (MCA, GST, RBI FREE-AI, SEBI, DPDP, EU AI Act Art. 50 / Art. 12, Colorado SB 26-189, ISO 42001 / NIST) with the "What the record helps with / Where it stops" columns.

**AU3. Level 1 checking procedure** — `#/auditor/checklist` — doc · **L1** · AUD
- The five asks, as request buttons → `#/auditor/requests/new?item=…`.
- The six tests as a worksheet (each: what to do, what to record, pass/fail/not checked). Test 3 is emphasised → `#/auditor/reconciliation`.

**AU4. Two-way reconciliation workspace (E11 test 3)** — `#/auditor/reconciliation` — doc/console-lite · **L1/L2** · AUD
- Period; the target-system audit trail upload (e.g. ERPNext); the elan1 chain range.
- Results in two directions: "change in target with no elan1 record" ("the finding that matters — they are changes that did not go through the gates") and "elan1 committed record with no target change".
- The exceptions list is exportable.

**AU5. Evidence request** — `#/auditor/requests/new` — AUD
- Items: sequence range · continuity report · declaration versions · nightly outputs · meter reconciliation · [L2] bundle · [L2] KMS audit log · key policy.
- Submitting creates a governed write in the tenant's chain, visible at A26.

**AU6. Key custody evidence** — `#/auditor/key-evidence` — **L2** · AUD
- The E16 Flow 3 seven steps as a guided worksheet. The auditor counts Sign calls and signed records and "Reconcile the two counts themselves". Step 6 links to `#/verify`. Step 7 shows the insider limitation verbatim.

**AU7. My pilot** — `#/auditor/pilot/:id` — **L2** · AUD
- Timeline as in R4, from the auditor's side.
- Day-0 form `#/auditor/pilot/:id/statement`: "three questions you would ask" and "what you would need to see to rely on a record of this kind — not what would be nice, what would be necessary".
- Day-80 verdict form `#/auditor/pilot/:id/verdict`: free text, "would you ask a client to buy it?", and the outcome (accepted in writing / objection in writing).
- A statement on the page: "What we will not ask: for an endorsement, for a logo, for a quotation".

**AU8. Regulator dossier** — `#/auditor/regulator` — doc · **L3 preview** · regulator reviewer
- Outline only: what the proof establishes and does not; how a supervisor would use it; "the ten questions a supervisor asks"; contact and disclosure protocol. No acceptance claims.

### 2.7 Developer and third-party onboarding portal (layout `public`/`doc`/`auth`)

**D1. Developers home** — `#/developers` — doc · DEV
- Sections: Get a sandbox key · Author a declaration · Conformance suite · Request production · Refusal codes · Specs (seal v6, bundle v1, profile) · Versioning policy (`/v1`, 12-month sunset, `Deprecation`/`Sunset` headers) · Status.

**D2. Get a sandbox key** — `#/developers/sandbox-key` — auth · DEV
- Fields: work e-mail, company name, "one-line description of what they intend to govern".
- After submit → `#/developers/sandbox-key/check-email`: "Check your e-mail. The key is on the other side of the link."
- Blocked: "We cannot issue a key to this account. Write to support and a person will read it."

**D3. Sandbox key issued** — `#/developers/sandbox-key/issued` — auth · DEV
- The `sk_sbx_…` key shown once, with Copy and a warning that it is "not shown again". The quota: 10 writes/min, 2 concurrent, 5,000/month.
- Provisioning failure: "Your account is ready; the sandbox is still building. We will e-mail the key within the hour."
- Continue → console with the sandbox banner: "Sandbox. Every write here is sealed into its own chain marked mode: sandbox and metered at quantity zero." (see Gaps: "sealed" at L1).

**D4. Conformance suite** — `#/developers/conformance` — doc · DEV
- A C1–C14 table (id, name, what it asserts, and "disqualifying" flags on C1/C2). The CI snippet. The result file format. An "Upload result file" drop area that shows "14 of 14" or the first failure (test id and assertion).
- The C14 banned strings at L1: "signed", "tamper-proof", "independently verifiable".
- A note: "A 429 is a transport rejection … must never be reported by the suite as a refusal."

**D5. Request production access** — `#/developers/production-request` → status `#/developers/production-request/:id` — auth/console · **L1** · DEV, TA
- Attachments (all required): conformance result file, declaration version, target system, residency domain, named production owner (a person, not a list), stated enforcement mode and mechanism.
- After submit: "A person reads this. Two working days."
- Status steps: Submitted · In review (the four checks) · Approved (`sk_live_…` shown once, with the production quota) · or Refused (a "what we say" sentence).
- First governed action success line (verbatim form): "Applied · proof #1" with the undo window.

**D6. Who we refuse** — a section of D5, or `#/developers/eligibility` — doc · DEV
- The eight rows with their verbatim sentences:
  - "Author and certify a declaration first. The Studio is open with your sandbox key."
  - "Tell us which mode, and if Enforced, which mechanism — credential custody or token acceptance."
  - "Every irreversible write type needs a named human at rung 6."
  - "The basis is not a pricing parameter. Here is the mapping."
  - "Consent, residency, retention, dual control, counterparty and precondition are not configurable. Rate, budget and schedule are."
  - "You need L2. It is Q3 2027. Keep talking to us and do not buy this yet."
  - "We run in today. We will tell you when that changes."
  - "Give us a person, not a distribution list."

**D7. Refusal code pages** — `#/developers/refusals` and `#/developers/refusals/:code` — doc · DEV
- Readiness item 1: "every refusal code has a public page naming its rung, class and operator action". Fields: code, rung, class, meaning, operator action, and an example record (a zero-UUID refusal).

**D8. Specs** — `#/developers/spec/seal-v6`, `#/developers/spec/bundle-v1`, `#/developers/spec/profile`, `#/developers/vectors` — doc · DEV, VE, third-party verifier authors
- Seal: the field table, encodings, preimage, TV-001 (329 octets), the "What must never happen" list, and the disagreement log.
- Vectors: groups PV-01…12, PV-13…24, PV-25…36 [L2], NV-01…28. Rule text: "The v3.0 TV-001 digest is not written into any document until two independent implementations have produced it and agreed." The UI therefore shows "Digest: published at freeze" rather than a value.

**D9. Status page** — `#/status` — public · everyone
- Components: submission · gates · writer · chain · meter · console, plus (L2) anchoring · signing (per domain).
- Chain integrity is its own component and flips automatically on a missed nightly job.
- Incident history is never edited after the fact: entries show "Posted" with no "Edited" affordance, and corrections are appended as new entries.

**D10. Pricing (public)** — `#/pricing` — public · buyers
- The SKU 1 tier table (without the `[modelled]` marks externally; see Gaps).
- The refusal rule: "Refusals are free and the database enforces it."
- The SKU 2 section is visible only after L2 GA; before that: "Evidence is sold on its own line from Level 2 Attested." *(proposed)* Verifier ₹0 and bundle export ₹0 are always stated.
- Pilot: "Free, 90 days, 2,000 governed actions, one write type family, Attested advisory only".
- Never shows the rung1 transfer price.

### 2.8 Level 3 previews (all labelled "Level 3 Proven — not available")

| # | Screen | Route | Door/surface | Content |
|---|---|---|---|---|
| L3-1 | Cross-organisation verification | `#/assurance/cross-org` | Assurance | Explains L2 third-party vs L3 cross-org (the E14 definition); outline: trust anchors, key distribution, revocation and key history, what a counterparty must be told |
| L3-2 | Selective disclosure | `#/assurance/disclosure` | Assurance | Today: one `redaction_profile` per export (L2). Later: per-recipient SD-JWT disclosure; "what may be redacted and what may never be" |
| L3-3 | Sovereign deployment | `#/assurance/deployment` | Assurance | Topologies: multi-tenant · customer VPC · on-premises; key custody per topology; customer-held HSM; dual control for sovereign tenants; air-gapped verification |
| L3-4 | Earned autonomy and precedent | `#/agents/autonomy` | Agents | See K8 |
| L3-5 | Action Receipt open standard | `#/verify/standard` | Public | Draft status; scope and non-goals; licence and governance; SCITT alignment; reference verifier; conformance tests |
| L3-6 | Certification dossier | `#/assurance/certification` | Assurance | ISO/IEC 42001 and SOC 2 control mapping, existing evidence vs gaps, costs and dates. Headline: "We are not certified to either" |
| L3-7 | Ontology | `#/records/ontology` | Records | See R8 |
| L3-8 | Regulator dossier | `#/auditor/regulator` | Auditor | See AU8 |


---

## 3. Flows (step lists with screens)

Arrows use the form `screen → action → result`. Every step marked **[gov]** is a governed write: it climbs the nine rungs and appends its own record. Every step marked **[dual]** needs a second named human at `#/work/decide/:id`. That approver is never the requester and never an agent.

### F1. Export an evidence bundle — L2 (E15 Flow 1)
1. EO opens `#/assurance/evidence/export`. Picks "seq 41,207–53,686" or a date range, and the profile `in-mca-audit-trail v1` (or "No profile claimed").
2. Screen shows, before generating anything: "12,480 records · 611 refusals · 22 unanchored · Level 2 only · continuity scope full_chain".
3. EO presses **Prepare export** → system resolves every declaration version and lexicon. Any missing one stops here with `POLICY.DECLARATION_UNRESOLVED (declaration_id, version)`.
4. **[gov]** Export climbs the rungs. Residency (generated in-domain), retention, consent (if the redaction profile reveals personal fields) and precondition (the range must be covered by a completed nightly integrity run) are checked.
5. System assembles the eight members, digests each, and writes `manifest.json` last. It then appends the export record (metered, bundle price ₹0).
6. Redirect → `#/assurance/bundles/:id`: "Export ready — 12,480 records, 611 refusals, 22 unanchored, profile in-mca-audit-trail v1" plus the bundle digest. EO downloads.
7. The screen tells EO: "Verify it yourself first. If it does not pass for you it will not pass for them." Link → `#/verify`.
- **Branches**:
  - Incomplete nightly run → "Export the clean range instead".
  - Profile window splits the range → offers two sub-ranges.
  - Oversize → limit plus suggested split.
  - Store down → nothing partial; idempotent retry.

### F2. Verify offline — Any (E13 Flow 2, E15 Flow 2)
1. CP/AUD gets the verifier from `#/verify/releases/:version`, a package registry or a source build. Optionally checks it via the four routes.
2. CP obtains the key fingerprint from their own source (the out-of-band channel), **not** from the bundle.
3. CP disconnects the machine and runs `elan1-verify --bundle kaveri-2027Q3.tar --profile in-mca-audit-trail-v1.json --key-fingerprint 3f9a1c07…8b2e`.
4. The verifier echoes the claim first: range, counts, profile, scope.
5. It checks it supports the profile and domain string; if not → exit 4 `UNSUPPORTED`, printing the profile id.
6. It runs the eight integrity steps, then the structural, binding, coverage and temporal profile checks.
7. It writes the nine-section report and exits 0–5.
8. The sceptic runs the published tampered bundle and watches it exit 1, naming the record and field.
- UI touchpoints are the public pages only (`#/verify`, `#/verify/exit-codes`, `#/verify/report-guide`, `#/verify/tampered`). Nothing reports back to elan1.

### F3. Rotate a key — L2 (E12 Flow 2, E16 Flow 1)
1. KC opens `#/agents/keys` and presses **Generate successor** → `#/agents/keys/new`. KMS creates the key in-region. The fingerprint is read back. "nothing signs with it yet".
2. KC sets `valid_from` (≥ 24 h ahead; for a scheduled rotation, registered 30 days before the cut). The screen shows both windows with "Overlap: none", or refuses.
3. **[gov][dual]** A2 approves "Register signing key window" at `#/work/decide/:id`. The record is appended to the operator chain and to each affected tenant's chain.
4. At `valid_from`, the chain writer signs with the successor. The predecessor's `valid_to` is set to the same instant, and both are written in one transaction.
5. KC marks the predecessor `retired`. It still verifies within its window.
6. `#/agents/keys/:keyId` shows both keys, the windows, the rotation record seq and the counts under each. The next cross-boundary bundle carries both keys and a boundary row.
7. KC publishes the new fingerprint through the out-of-band channel and records it.
- **Refusals**: overlapping window; open integrity incident (precondition); same actor.
- **Failure**: KMS down at the cut → domain fails closed.

### F4. Revoke a key (suspected compromise) — L2 (E16 Flow 2)
1. IC opens `#/agents/keys/:keyId/revoke` → "Declare P0 key incident" → enters `T_suspect` (the earliest defensible time). Creates `#/agents/keys/incidents/:id`.
2. IC stops signing in the domain. Records continue at `assurance_level: 1`, and the Assurance door banner appears.
3. KC generates a successor (F3 steps 1–3, dual control). The predecessor's `valid_to = T_suspect`, which leaves a declared unsigned interval.
4. **[gov][dual]** KC marks the predecessor `revoked` with the reason and `T_suspect`. Every later `keys.json` carries it.
5. IC sends tenant notices within 24 hours from the fixed template: the instant, the range, what is still true, what is not.
6. The screen computes anchor coverage: records before `T_suspect` anchored before `T_suspect` (independent witness) vs the rest.
7. IC re-enables signing under the successor. The unsigned interval closes, and the boundary and counts are rendered permanently.
- **Refusals**: re-signing the revoked range (the kernel refuses); a late `T_suspect` needs the founder plus a written reason.
- **Failure**: no successor possible → the domain stays unsigned and keeps writing. "There is no fallback key and no spare in a drawer."

### F5. Timestamp anchoring — L2 (E17 Flow 1 and 2); machinery, not a governed write
1. The chain writer enqueues each record digest into the tenant's open batch.
2. At the interval (≤ 15 min) or the size cap, the anchor service closes the batch and records the leaf count and seq range.
3. It builds the RFC 6962 tree (odd node promoted) and stores the root and every inclusion path **before** contacting anyone.
4. It sends a `TimeStampReq` (root + fresh nonce) to authority A and authority B in parallel. It verifies each token (imprint, signature, nonce, sane `genTime`).
5. It writes both tokens, both certification paths and the revocation data into `anchors/<batch_id>/`, and marks the records anchored.
6. The Assurance door shows "last counter-signature 3 minutes ago, 0 records unanchored".
- **Degraded path**:
  - One authority down → `single_anchor`.
  - Same authority failing 2 consecutive intervals → SRE paged.
  - Both failing 4 consecutive intervals → banner "Anchoring degraded since 09:14 — 88 records unanchored".
  - Recovery: anchor outstanding batches oldest first, each with its own root and true token time. Never merge them.
  - Both down for more than one interval → a write-up at `#/assurance/anchors/incidents/:id`.
- **Discard rules**: imprint mismatch → retry with a new nonce (twice → P0 against that authority); future `genTime` → discard.

### F6. Install the India pack (`ledger1`) — L2 (E18 + E19 stage 4)
1. TA opens `#/records/packs/ledger1` and reads the buyer promise and the limits → presses **Install pack** → `#/records/packs/ledger1/install`.
2. Level check. If L1, the step is blocked with "ledger1 requires Level 2 (min_assurance_level: 2)" and a link to `#/assurance/upgrade-l2`.
3. Declaration match: the tenant's ERPNext declaration contains the six write types, and the gates are in order (consent, residency, retention, counterparty, precondition, dual_control, budget).
4. DO adds the block 6 `proof_binding` fields → **[gov][dual]** new declaration version certified.
5. OP installs `in-mca-audit-trail v1`. The installer checks `applies_to_records_from 2027-07-01` against the tenant's boundary (if later, it refuses and prints both dates).
6. OP runs a dry export and verification. A `2 FAIL_PROFILE` here is expected and useful.
7. The tenant exports the first bundle themselves (F1) and verifies it (F2). The pack status becomes "Installed".

### F7. Upgrade L1 → L2 — (E19)
1. **Preconditions** at `#/assurance/upgrade-l2`: seven rows, each with evidence. Row 7 routes DO to block 6. The 14-day notice is sent (window; writes will not stop; the one additive declaration version; the fingerprint and its channel; the boundary rule; "records written before the upgrade will remain Level 1 permanently and will not be signed retrospectively.").
2. **Stage 0 — pre-flight** (`/stage/0`): the full-chain replay reads "continuous, 41,206 records, seq 1–41,206, all 6 write types". Key register: active plus successor. Profile registry: author ≠ certifier. Head seq recorded: 41,206.
3. **Stage 1 — key provisioning** (`/stage/1`): the key is active or registered (F3). The tenant is bound: "Key bound · signing off". The fingerprint is published to the notice contact **before** any record is signed.
4. **Stage 2 — signing on** (`/stage/2`): **[gov][dual]** "Enable signing" at Decide ("the irreversible instant"). The next record becomes the boundary B. The screen reads "Signing on at seq 41,207 · 41,206 records at Level 1 · 0 at Level 2". The first ten signed records are verified with the tenant's fingerprint.
5. **Stage 3 — anchoring on** (`/stage/3`): the first batch closes and both tokens arrive. The unanchored head rises and then falls to 0 within two intervals (otherwise go to F5's degraded path). `anchors/` holds two tokens, two paths and revocation data.
6. **Stage 4 — profile installed** (`/stage/4`): as in F6 steps 4–6.
7. **Stage 5 — first bundle** (`/stage/5`): the tenant exports and verifies themselves. The L2-only range gives `0 PASS`. The boundary-spanning range gives `0 PASS` with both levels and counts in scope. The tampered bundle exits 1.
8. **Close** (`/close`): the seven checks, including the KMS reconciliation being clean on the first night and the boundary row visible on the Assurance door. Then **[gov]** the closing record. On the day, the boundary confirmation line is sent to the notice contact. Afterwards, the first-bundle note for the auditor.
- **Rollback** (`/rollback`), at any stage, per the reversibility table. After stage 2 this leaves a signed island. The reason is a governed write, and the customer is notified within 24 hours.

### F8. Onboard a third-party agent vendor — L1 (E09 Flows 1–5 plus promotion)
1. DEV `#/developers/sandbox-key` → "Check your e-mail. The key is on the other side of the link." → link → `#/developers/sandbox-key/issued` (`sk_sbx_…` once). The sandbox tenant is ready in < 60 s. The console opens with the sandbox banner.
2. DEV authors the declaration in `#/records/studio` (Author mode):
   - The seven blocks, and blast radius plus reversal per write type (the resolved meter basis is shown).
   - Channel modes with the permitted sentence.
   - **Validate** (nine semantic rules; the six never-skippable gates must be present).
   - **Simulate** (with no refusals: "This simulation produced no refusals. Add a fixture that fails.").
   - **[gov][dual]** registration.
   - **Certify this version** → "Accepted at version N with the digest".
3. DEV adds the suite to CI (C1–C14). They upload the result file at `#/developers/conformance`, which shows "14 of 14".
4. DEV `#/developers/production-request`: attaches the result, declaration version, target system, residency domain and production owner → "A person reads this. Two working days."
5. RV `#/work/reviews/production/:id`: the four checks → Approve → `sk_live_…` shown once (scoped).
6. DEV wires `stage.write` then `act.write` with an `idempotency_key`. The nine rungs run → "Applied · proof #1". Record seq 1 is viewable at `#/assurance/proof/1` with the L1 honesty line.
7. First period close: reconciliation → invoice at `#/assurance/meter/invoices/:id`, with the refusal line at ₹0 and "Show the records behind this line".
8. After ≥ 30 days: `#/assurance/modes/promote` → review (bypass proof, credential check, rollback drill) → **[gov][dual]** new declaration version → the mode boundary is rendered.

### F9. Auditor acceptance test — L1 checks now, L2 pilot (E11 + E18 Flow 2)
1. **Day 0** (`#/auditor/pilot/:id/statement`): the auditor records three questions plus the necessity statement. PK maps it to profile rows; unbindable items become `not_measurable` rows with `would_change_if`.
2. **Day 1**: the tenant is upgraded (F7). The boundary date and counts are shown to the customer and to the auditor.
3. **Days 2–75**: normal operation. The customer is told refusals are part of the test.
4. **Day 76**: the customer exports (F1) without help. Needing help is a finding.
5. **Day 77**: the auditor obtains the verifier independently, disconnects and runs it (F2), then runs the tampered bundle. "We are not in the room."
6. **Day 78**: the auditor runs E11 test 3 at `#/auditor/reconciliation`, the chain against the ERPNext audit trail.
7. **Day 80**: the auditor writes the verdict at `#/auditor/pilot/:id/verdict`. It is published internally verbatim.
8. **Day 85**: the founder asks the G-D question. The answer is recorded on `#/records/packs/ledger1/pilot`.
- **Outcome**: a written acceptance or a written objection (note 07). If the auditor will not run the verifier, the pilot "has failed its main purpose".

### F10. Author and certify a verifier profile — L1 prep / L2 (E13 Flow 1)
1. PA `#/assurance/profiles/new`: enumerates clauses that constrain a write (verbatim text), binds names (resolved live), writes checks (no orphans) and the limits statement (> 200 characters, unique).
2. Dry-run on the known-good and known-tampered fixtures (0 and 1, naming record and field).
3. P1–P12 conformance.
4. **[gov][dual]** PC "Certify this profile version" → "Certified at version N with the digest".

### F11. Publish a verifier release — L2 (E15 Flow 3)
1. VE builds from a tag. The empty lockfile is enforced. Two machines produce byte-identical builds (pinned toolchain, `SOURCE_DATE_EPOCH`).
2. The full vector run: all positives PASS, all 28 negatives REJECT with record and field.
3. **[gov][dual]** RA approves at Decide. The artefacts are signed with the offline release key. Publication goes to our site and one independent registry.
4. A defective release is later "superseded, never withdrawn silently", with a dated note.

---

## 4. Sample data (consistent with the documents; fictional organisations and people)

Use these everywhere so screens agree with each other. The **tenant** is **Kaveri Textiles Pvt Ltd**, a rung1 hosted ERPNext customer: turnover ₹38 crore, residency domain `in`, `tenant_id 7c1e2f90-…-a04b`, CA firm "Iyer Menon & Co., Chartered Accountants" (statutory auditor contact: CA Lakshmi Iyer). The **third-party vendor** is **Tallyfin Labs Pvt Ltd** (developer Priya Nair), on the Growth tier. elan1 staff: Meera Iyer (key custodian), Arjun Rao (SRE, second approver), Kavya Menon (onboarding reviewer), Rohan Kapoor (verifier engineer), Sanjay Kulkarni (founder / release approver).

### 4.1 Chain and boundary (Kaveri Textiles)
| Item | Value |
|---|---|
| Genesis | seq 1 · 2027-01-04T09:15:00Z · `prev_digest 0000…0000` · `sales_invoice.submit` · human · A2 |
| Boundary B | seq **41,207** · 2027-08-12T06:30:11Z ("records from 12 August 2027 are signed; the 41,206 records before that date are Level 1") |
| Head (26 Oct 2027) | seq 53,686 |
| Level segments | L1: seq 1–41,206 (41,206) · L2: seq 41,207–53,686 (12,480) |
| Write types | 6 (the ledger1 set) |
| Nightly integrity 25 Oct 2027 | continuous · seq 1–53,686 · 53,686 records · 6 of 6 write types · 00:41:07 duration |
| Refusals, whole chain | 2,317 (611 in the L2 range) |

### 4.2 Sample records (seals)
| seq | recorded_at | write_type | actor | kind | A | outcome | decl v | policy v | digest | L | key_id | anchor |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 2027-01-04T09:15:00Z | sales_invoice.submit | R. Shenoy | human | A2 | Committed | 1 | 1 | `e3b7…41c9` | 1 | — | — |
| 38,912 | 2027-07-30T11:02:45Z | journal_entry.submit | recon-agent-02 | agent | A1 | Refused `GATE.BUDGET_EXCEEDED` *(sample code)* | 6 | 11 | `77d0…c2e4` | 1 | — | — |
| 41,206 | 2027-08-12T06:29:58Z | payment_entry.submit | ap-agent-01 | agent | A3 | Committed (approved by R. Shenoy, seq 41,205) | 7 | 12 | `a90f…13be` | 1 | — | — |
| 41,207 | 2027-08-12T06:30:11Z | sales_invoice.submit | billing-agent-01 | agent | A2 | Committed | 7 | 12 | `2c4e…9f70` | 2 | `k_in_20270701_4d7e` | b_20270812_0630_7c1e |
| 53,650 | 2027-10-26T10:24:37Z | customer.update | R. Shenoy | human | A4 | Committed (GSTIN change, approved by N. Pillai) | 8 | 13 | `5b12…e8d3` | 2 | `k_in_20270701_4d7e` | b_20271026_1030_7c1e |
| 53,671 | 2027-10-26T10:36:02Z | sales_invoice.submit | billing-agent-01 | agent | A2 | Refused `POLICY.CHANNEL_NOT_PERMITTED` (called from an undeclared channel) | 8 | 13 | `c019…0a6f` | 2 | `k_in_20270701_4d7e` | unanchored |

A refused record shows `record_id 00000000-0000-0000-0000-000000000000` and `record_version 0`.

### 4.3 Keys (domain `in`, plus a drill in dedicated domain `inx`)
| key_id | Class | Status | valid_from | valid_to | Successor | Fingerprint | Records signed | Custody |
|---|---|---|---|---|---|---|---|---|
| `k_in_20270401_9c3a` | Domain signing | retired | 2027-04-01T00:00:00Z | 2027-07-01T00:00:00Z | `k_in_20270701_4d7e` | `ed25519:9c3a 51f0 … 02de` | 4,112 (reference tenant; pre-GA practice rotation) | AWS KMS · ap-south-1 · ECC_NIST_EDWARDS25519 |
| `k_in_20270701_4d7e` | Domain signing | active | 2027-07-01T00:00:00Z | — | `k_in_20280701_b21f` | `ed25519:3f9a 1c07 … 8b2e` | 2,81,904 (all tenants in domain) | same |
| `k_in_20280701_b21f` | Domain signing | registered, not yet signing *(UI state; see Gaps)* | 2028-07-01T00:00:00Z | — | — | `ed25519:b21f 6e44 … 7a31` | 0 | same |
| `k_inx_20270901_77e0` | Domain signing (dedicated) | **revoked** (drill) — T_suspect 2027-10-03T02:11:00Z, reason "KMS audit shows a Sign call the platform cannot account for (drill DR-07)" | 2027-09-01T00:00:00Z | 2027-10-03T02:11:00Z | `k_inx_20271003_0be5` | `ed25519:77e0 …` | 9,480 | same |
| `ka_in_…` *(anchor client)* | Anchor client | active | 2027-06-01 | — | — | — | n/a | KMS · ap-south-1 |
| `kr_2027_01` *(release)* | Release | active | 2027-06-20 | 2029-06-20 (24-month rotation) | — | `ed25519:1d8c …` | 3 releases | Offline hardware token · holders: Sanjay Kulkarni, Rohan Kapoor |

The key-id formats for anchor-client and release keys are not specified; the `ka_`/`kr_` prefixes are *(proposed)*.

Rotation record: seq 1,204 in the operator chain, requested by Meera Iyer, approved by Arjun Rao, 2027-06-01T10:12:40Z ("registered thirty days before the cut").

Revocation drill notice (sample): "Between 2027-09-01T00:00:00Z and 2027-10-03T02:11:00Z, 9,480 records were signed by k_inx_20270901_77e0. They still verify. After 02:11 UTC on 3 October 2027 we can no longer say that only the kernel could have produced that signature. 9,311 of those records are covered by anchors issued before 02:11 UTC and have an independent witness; 169 are not."

Key-use reconciliation for 25 Oct 2027, domain `in`: Sign calls 3,118 · signed records 3,118 · **reconciled** · scope: all tenants in domain `in`, 00:00–23:59:59 UTC.

### 4.4 TSA receipts and batches (Kaveri Textiles)
| Batch | seq range | Leaves | Root | eMudhra genTime | DigiCert genTime | Status | Lag |
|---|---|---|---|---|---|---|---|
| b_20270812_0630_7c1e | 41,207–41,219 | 13 | `8e2a…4c71` | 2027-08-12T06:45:02Z | 2027-08-12T06:45:03Z | Anchored | 14 m 51 s |
| b_20271019_0915_7c1e | 52,801–52,888 | 88 | `f403…9d02` | 2027-10-19T10:21:40Z | 2027-10-19T10:24:11Z | Anchored late (degraded 09:14–10:20) | 1 h 06 m |
| b_20271021_0915_7c1e | 52,980–53,011 | 32 | `61b9…aa3e` | 2027-10-21T09:15:03Z | — (timeout) | **single_anchor** | 0 m 03 s |
| b_20271026_1030_7c1e | 53,641–53,664 | 24 | `5c1d…e0a9` | 2027-10-26T10:30:02Z | 2027-10-26T10:30:03Z | Anchored | 5 m 25 s |
| (open) | 53,665–53,686 | 22 | — | — | — | Open — "22 records unanchored" | — |

Token panel sample (eMudhra, b_20271026_1030_7c1e): `messageImprint` SHA-256 `5c1d…e0a9` · `genTime` 2027-10-26T10:30:02Z · accuracy ±1 s · nonce `0x6f3a…19` · policy id "as issued" · certification path 3 certificates · OCSP response captured 2027-10-26T10:30:02Z · RTT 412 ms. The inclusion path for seq 53,650 has 5 sibling digests.

Anchor SLO: "≤15 minutes, published per tier". Measured month (Sept 2027): p99 lag 14 m 10 s. Degraded intervals: 1.

### 4.5 Bundle and verifier results
**Bundle** `kaveri-ledger1-2027-07-01_2027-10-26`:
- `bundle_format elan1.evidence.bundle.v1`, seq 41,207–53,686, `record_count 12,480`, `refusal_count 611`
- `assurance_levels [{level:2, count:12,480, seq:41,207–53,686}]`, `continuity_scope full_chain`
- `profile in-mca-audit-trail v1`, `redaction_profile ledger1-default`
- `unanchored_head 22`, `exported_at 2027-10-26T10:42:17Z`, `verifier_digest 0d7c…55a1`, bundle digest `4be1…90cf`
- Members: `seals.jsonl` 79,87,200 bytes · `anchors/` 1,081 files · `declarations/` 3 versions (v7, v8, v9) · `lexicon/` 2 digests · `keys.json` 1 key · `chain.json` · `VERIFY.txt`

**Boundary-spanning bundle** seq 38,001–45,000: L1 38,001–41,206 (3,206) · L2 41,207–45,000 (3,794).

**Verifier runs** (verdict line exactly as the report prints it):

| # | Bundle / scenario | Exit | Verdict line | Key report detail |
|---|---|---|---|---|
| 1 | Kaveri L2 range, ledger1 profile | 0 | `PASS` | 12,480 records · 6 of 6 write types · C01–C06 passed · Notes: "22 records unanchored at export" |
| 2 | Boundary-spanning 38,001–45,000 | 0 | `PASS` | Scope: "Level 1: 3,206 records (seq 38,001–41,206) · Level 2: 3,794 records (seq 41,207–45,000)". Signature rows `not_applicable — assurance level 1` for the L1 segment only |
| 3 | Kaveri range with 3 erased payloads (DPDP erasure) | 0 | `PASS — payload unbound` | Notes: "seq 44,019, 47,302, 50,881: chain intact, payload unbound" — the word FAIL appears nowhere |
| 4 | L1 dry-run of the profile (pre-upgrade) | 0 | `PASS — unsigned, assurance level 1` | C06 `not_applicable — assurance level 1` |
| 5 | Published tampered bundle | 1 | `FAIL_INTEGRITY` | "FAIL at seq 3,181: prev_digest mismatch, expected a376… got 0000…" |
| 6 | Sound bundle, budget gate disabled on journal_entry.submit at v6, refusals omitted | 2 | `FAIL_PROFILE` | First failure: "C01 structural … refusals_required: true, refusal_count 0" |
| 7 | Bundle missing `declarations/…_v8.json` | 3 | `INCOMPLETE` | "Missing member: declarations/(9a41…, 8)" |
| 8 | Bundle claiming `in-mca-audit-trail v3` | 4 | `UNSUPPORTED` | "Unknown profile version: in-mca-audit-trail v3" |
| 9 | `elan1-verify --bundel …` | 5 | `USAGE` | "Unknown argument --bundel" |

**Sample report, run 1** (condensed; used on `#/verify/report-guide`):
1. **Verdict** — `0 PASS`
2. **The claim** — in-mca-audit-trail v1 · rule_as_at 2023-04-01 · bundle claims seq 41,207–53,686 · tenant 7c1e…a04b
3. **Scope** — seq 41,207–53,686 · 12,480 records · 611 refusals · 6 of 6 write types · continuity scope full_chain · positioned inside a chain whose genesis digest is `e3b7…41c9`
4. **Integrity results** — preimages passed · digests passed · signatures passed (1 key, window ok) · seq contiguity passed · prev_digest linkage passed · Merkle inclusion passed (12,458 records in 818 batches; 1 single_anchor batch) · anchor time passed · declarations/lexicon resolved passed
5. **Clause results** — 4 clauses bound · C01–C06 passed
6. **First failure** — none
7. **Notes** — 22 records unanchored at export time; 1 batch single_anchor (b_20271021_0915_7c1e); no key rotation spanned; no payloads unbound
8. **Limits** — the full `in-mca-audit-trail` v1 limits statement, verbatim
9. **Reproduction** — `elan1-verify --bundle kaveri-ledger1-….tar --profile in-mca-audit-trail-v1.json --key-fingerprint 3f9a1c07…8b2e` · verifier v1.0.3 (`0d7c…55a1`) · profile digest `aa60…31f2` · bundle digest `4be1…90cf`

### 4.6 Pack gates and controls
| Pack | G-A | G-B | G-C | G-D | G-E | Status |
|---|---|---|---|---|---|---|
| ledger1 | pass — 1 April 2023 | pass — statutory auditor (CA Lakshmi Iyer, Iyer Menon & Co.) | pass — native cancel or compensating instrument, declared | pass, provisionally — "the gate the pilot actually tests" | pass — rung1 hosted mode | Pilot, Day 76 of 90 |
| invoice1 | pass — e-invoicing mandate | pass — GST officer at assessment; auditor at year end | pass — invoice reversible; IRN irreversible after 24 h | pass | **partial** — "we govern the write that requests it; we do not own the clearance" | Second pack |
| collect1 | pass (counsel to confirm) | pass — lender's compliance, inspection | pass — `call.attempt` honestly irreversible | pass — "evidence sold separately per regime" | **open** — "We own the call record. The write into the lender's collection system may belong to their core software" | Spec sketch |

ledger1 T1–T8 (sample state at Day 76): T1 pass · T2 pass (author Rohan Kapoor, certifier Kavya Menon) · T3 pass (drill 2027-07-22, `compensating_instrument` on JE-2027-00841) · T4 pass (7 gates, 7 fixture refusals) · T5 pass · T6 pass · T7 pass · T8 pending (Day 80).

### 4.7 Pricing and invoice samples
The tier table is in §1.16. Sample invoice **INV-TF-2027-10**, Tallyfin Labs, Growth tier, October 2027, reconciled (reconciliation run 2027-11-01T02:10:00Z, 0 discrepancies):

| Line | Qty | Rate | Amount |
|---|---|---|---|
| Platform floor — Growth (includes 25,000 governed actions) | 1 | ₹1,25,000 | ₹1,25,000.00 |
| Governed actions over inclusion | 2,412 | ₹4.00 | ₹9,648.00 |
| Refusals | 1,318 | ₹0 | ₹0.00 |
| Subtotal (ex-GST) | | | ₹1,34,648.00 |
| GST @ 18% | | | ₹24,236.64 |
| **Total** | | | **₹1,58,884.64** |

L2 lines (sample for an L2 tenant, from the first L2 period): "L2 attestation add-on — ₹2,00,000.00 / month"; "Verifier profile in-mca-audit-trail, per regime, per year — ₹6,00,000.00 (annual)"; "Bundle exports — 4 · ₹0.00"; "Offline verifier — ₹0.00". Internal-only margin view (never shown to customers) uses the E10 contribution table.

### 4.8 Onboarding samples
- Sandbox key issued to Priya Nair (Tallyfin Labs) 2027-02-03T11:02:41Z: `sk_sbx_…4f2a` (shown once). Provisioning 38 s (published p95 41 s).
- Conformance run 2027-02-10: "14 of 14", result file hash `c8f1…2270`.
- Production request **PR-0042**, 2027-02-11, reviewer Kavya Menon. Four checks passed 2027-02-12. Key `sk_live_…9d1c` scoped to `in`, write types `vendor_bill.submit`, `payment_run.approve`.
- First action: "Applied · proof #1" — seq 1, `prev_digest` 32 zero octets, mode: live, undo window 30 days.

### 4.9 GA readiness sample (as a tracker)
| # | Item | Measured | Status |
|---|---|---|---|
| 1 | Documentation | link check: 0 × 404 across 214 pages | done |
| 2 | Sandbox keys | p95 provisioning 41 s (< 60 s) | done |
| 3 | Quotas | load test 2027-01-15: 429 + Retry-After at 11th write/min | done |
| 4 | Status page | chain component auto-flips (drill 2027-01-20) | done |
| 5 | Support path | first response median 3 h 10 m (Jan) | done |
| 6 | Incident process | P1 note published in 4 working days | done |
| 7 | Versioning policy | header assertion in contract tests | done |
| 8 | Conformance tests | reference passes 14/14; broken impl fails C2 | **not done — broken-implementation fixture missing** |

The gate reads "GA closed — 7 of 8 rows done, measured". It never reads "GA (partial)".

---

## 5. UI rules and constraints

**Level honesty**
1. **L1 screens show no signature, "Signed by" row, key, anchor time, unanchored head, bundle export or verifier verdict.** The signature row is *absent*, not empty or stubbed ("Not null, not an empty string … not the word unsigned"). L2-only routes, opened at L1, render a designed "arrives at Level 2" empty state.
2. **Every L2 screen carries a "Level 2 Attested" label**, and every record carries its own level chip. A tenant at L2 still has L1 records, and each record is labelled by its own level, not the tenant's.
3. **The boundary is always rendered with counts on each side.** Never write "the tenant's records are signed". The true sentence is "records from 12 August 2027 are signed; the 41,206 records before that date are Level 1 and are labelled so." Marketing may say "upgraded to Level 2 Attested" about the tenant, never about its history.
4. **No back-signing affordance anywhere.** There is no "sign earlier records", "re-sign range", "tidy up" or "sign this digest" button. Where users might look for one, show a disabled explanation.
5. **The L1 honesty line appears on every L1 record view**: "This record is hash-chained. It is not signed, and it cannot yet be checked by someone who does not trust elan1. That arrives at Assurance Level 2."

**Verdicts and results**

6. **Three-valued, always with scope and count**: `continuous` / `break at record N` / `not checked over this range` (and `reconciled` / `break at N` / `not checked over this range`). An unchecked range is never shown as clean or green.
7. **Exit codes 1, 2 and 3 are visually and verbally distinct.** FAIL_INTEGRITY is critical ("Stop. This is forensic, not compliance"). FAIL_PROFILE is serious ("The records are trustworthy…"). INCOMPLETE is a warning ("Ask for a complete bundle"). Never merge them into a generic "Failed".
8. **`PASS — payload unbound` is never red, and the string "FAIL" never appears near it.** `PASS — unsigned, assurance level 1` is neutral, never a silent green PASS.
9. **Every report or result shows its scope line.** A result without scope is a defect.
10. **Revocation is never shown as a verification failure.** A revoked key's records display "still verify", plus the exclusivity cut-off at `T_suspect`.
11. **`single_anchor` is a warning, not a failure.** Two tokens disagreeing about the root is critical (P0).
12. **The first failure is always shown in full**: seq, field, expected, found.

**Banned words and claims** (C14 and the E14 claim boundary; lint all copy)

13. Never: "tamper-proof", "immutable", "court-ready", "legally admissible", "accepted by the MCA / RBI / SEBI / a notified body", "certified to ISO/IEC 42001 or NIST AI RMF", "your auditor can verify your books", "we cannot see your data", "compliant". At L1 also never: "signed", "independently verifiable". Use "tamper-evident". Contract words also banned: "seamless", "revolutionary", "unlock", "leverage".
14. **Never describe an auditor conversation as validation or endorsement.** No auditor logos or quotations.
15. **Limits travel with claims.** The buyer promise and "what it does not establish" sit in the same block. A profile's limits statement is shown verbatim and in full wherever the profile's PASS is shown. E11 §4 is never collapsed.
16. **Lead sentence**: "A model may produce a write intent. It may never produce an allow." This goes before any signature claim.

**Keys and custody**

17. **Key material never appears.** Show only `key_id` and fingerprint. There is no download, export, copy-private-key or "sign" action.
18. **The fingerprint is always paired with "obtain it from your own source".** The verifier UI never pre-fills the fingerprint from the bundle.
19. **Windows are drawn abutting.** Any overlap is an error state and cannot be saved.
20. **Dual-control screens never list agents** as eligible approvers. Same-actor attempts show `GATE.DUAL_CONTROL_SAME_ACTOR` with "Send to" and eligible human names.

**Evidence and pricing**

21. **The verifier and bundle export are always shown at ₹0.** There is no paywall, gating or rate limit on /verify.
22. **Refusals appear on invoices at ₹0, on the face**, never hidden. The meter never shows a non-zero refusal.
23. **The platform floor never shows a discount.** The meter basis is displayed as derived from blast radius, never editable. The rung1 transfer price never appears outside internal screens.
24. **SKU 2 lines appear only for L2 tenants and only after L2 is running.** No SKU 2 quote UI exists before then.
25. **Internally, every price shown carries its honesty mark** (`[modelled]` · `[unverified]` · `[list]`).

**Identifiers and formatting**

26. Autonomy is **A0–A5**, never L0–L5. The field is **recorded_at**, never sealed_at. Assurance Levels are **L1/L2/L3**.
27. Hashes, seq, key ids, fingerprints and amounts are in IBM Plex Mono with tabular figures. Digests are shortened `a376…` with copy-full on click. Timestamps are shown as UTC RFC 3339 (second precision), with local time secondary. ₹ uses Indian grouping (₹1,58,884.64; ₹6,00,000).
28. **A refusal is not an error.** Refusals render as records (HTTP 200) with code, rung, every gate's result and the named next action. A 429 is a transport notice, never a refusal.
29. **Enforcement mode is shown wherever a write type is shown on Assurance**, with the permitted sentence. The Enforced sentence appears only for promoted write types.
30. **Sandbox is always visibly marked** (`mode: sandbox`, quantity 0).

---

## 6. Gaps, conflicts and value-adds (implied but not specified — proposals)

**Conflicts to resolve (flag to the lead)**
1. **Phase labels are off by one** between the .md notes and the PDFs (see the top of this file). *Proposal:* screens label by Assurance Level only.
2. **"sealed" in L1 sandbox copy.** E09 Flow 1's banner says "sealed into its own chain", but E12 says "at L1 the record is written and not sealed", and C14 bans "signed" at L1. *Proposal:* keep the quoted text in docs; on screen use "Sandbox. Every write here is recorded into its own chain marked mode: sandbox and metered at quantity zero." Mark the change for sign-off.
3. **Export meter basis.** E15 says "Metered at the one_tenant basis", but E10's enum is `tenant`. *Proposal:* display `tenant (per tenant)`.
4. **Profile dry-run at L1 vs the contract rule "never show a verifier verdict at L1".** *Proposal:* dry-runs live only in the profile-authoring area (A16), labelled "L2 preparation — dry run against reference fixtures, not your records". They never appear on the tenant's L1 Assurance overview or record pages.
5. **Key status enum lacks a "registered, not yet signing" state**, although E12/E16 describe a successor with a future `valid_from`. *Proposal:* keep the stored status `active` and derive the UI chip "Registered — signs from 1 July 2028". Or ask for `pending` to be added.
6. **Anchor-client and release key id formats are unspecified** (only domain keys have `k_<domain>_…`). *Proposal:* `ka_<domain>_<YYYYMMDD>_<hex>` and `kr_<YYYY>_<nn>`.
7. **"Shared residency domain key"**: a tenant's `keys.json` may show counts of records signed across all tenants. *Proposal:* on tenant screens, show only the tenant's own count under each key, plus the note "this key also signs other tenants' records in domain in".

**Screens and states implied but not specified**

8. **Bundle list vs no retention.** We keep no bundles, so `#/assurance/bundles` is an export *log* with a Re-export action. Design must not imply stored downloads older than the session. Propose a "Download link expires in 24 h" *(proposed)* state and a "Re-export (byte-identical except exported_at)" action.
9. **Export in progress.** Large exports (~150 MB/year) need a progress state (resolving declarations → assembling members → writing manifest), plus cancel with "nothing partial is written".
10. **Hand-off note generator.** E19 describes a one-page auditor note. Propose `#/assurance/bundles/:id/note` (print layout) with what the bundle is, how to get the verifier, the command, what PASS means and does not.
11. **Fingerprint publication log.** Every publication "recorded", so propose a per-key list of publications (channel, recipient, time) on K2, and a tenant-side "Fingerprints we sent you" panel on A1 (L2).
12. **Notice contact management.** Upgrades, revocations and incidents all go to "the named notice contact, not a shared inbox". There is no screen for it. Propose `#/assurance/contacts` (production owner, notice contact, evidence owner), validating "a person, not a distribution list".
13. **Tenant-visible incident notices.** Key-compromise and anchoring write-ups must reach tenants. Propose `#/assurance/notices` and `#/assurance/notices/:id`, append-only.
14. **Signed-island visual.** Rollback creates three segments. Specify a segmented bar component (L1 | L2 | L1) with counts, reusable on the chain, overview and bundle screens.
15. **Upgrade customer-side view vs operator view.** One route, two role modes. The customer sees status, communications and their stage-5 tasks. The operator sees the controls.
16. **Profile superseded/withdrawn notices to tenants** whose installed profile changes. Propose a banner on A1 and a "Your records are judged under the version they claim" explainer.
17. **Auditor login and scoping.** collect1 needs "an auditor login from day one". Propose a read-only auditor role scoped to a tenant plus a date range, whose every view of evidence is a governed read recorded in the tenant's chain (extends E16 Flow 3's "evidence request as a governed write").
18. **Verification-report intake.** The verifier records nothing and phones home to no one, but the pilot and the upgrade need proof that the tenant or auditor ran it. Propose an optional "Attach your verification report" upload on the bundle detail and the pilot Day 77, parsed and displayed as a report the reader submitted. Label it "submitted by the reader; elan1 did not run this".
19. **No browser verifier.** The obvious "drop a bundle here" page would put our code in the verification path and contradict E14/E15. If product wants convenience, it must be a downloadable, reproducible static page with no network. Mark it as a later option; do not build it now.
20. **Status page L2 components.** E09 lists six components. At L2 add "Signing (per domain)" and "Anchoring (per authority)" so the "Anchoring degraded" banner has a public counterpart.
21. **Pilot capacity.** "maximum five concurrent external pilots" and "once per company" imply a pilot slot indicator on `#/pricing` and the request form ("Pilot slots: 3 of 5 in use" *(proposed)*). Pilot end state: "At day 90 the tenant converts to a tier or freezes read-only for 30 days and is then exported and deleted" → read-only banner with a countdown and an export CTA.
22. **Dispute screen.** E09 Flow 5 describes disputes on a seq range, but no screen for them. Propose `#/assurance/meter/disputes/:id`: range, status (Held · Resolved), a written resolution note, and the rest of the invoice processed.
23. **Pack admission Decide variant** needs the five-gate grid read-only, plus a "Reject into register" path requiring the gate and a sentence.
24. **Export size limit** is unspecified (E15 open question 1). Design the refusal state with a placeholder limit and a split suggestion ("Split into 2 exports: seq 41,207–47,446 and 47,447–53,686").
25. **Per-tier anchor SLO display.** Decision 3 says the interval is never negotiable, but open question 3 contemplates Enterprise buying a shorter one. Show the SLO as a tier property, read-only.
26. **invoice1 and collect1 limits statements** aren't written yet. Their pack pages should show "Limits statement — not yet certified" and never a placeholder that reads like a real one.
27. **DPDP erasure UI.** L2 erasure destroys the per-record salt. Propose a record-level state "Payload unbound (salt destroyed 2027-11-14 under erasure request ER-0193)". It is info-toned; the chain still verifies.
28. **Selective disclosure at L2 is one `redaction_profile` per export.** The export form should show which fields are revealed vs present as commitments, and label per-recipient disclosure as L3.
29. **Earned autonomy.** A0–A5 exists today as a grant. Graduation and revocation are L3. The Agents autonomy screen must separate "current grant (fact)" from "precedent suggestion (L3 preview)" and never place a score next to an allow button.
30. **Sovereign deployment pricing and topology selector** is an L3 preview only. It needs the E16 honesty sentence: "A tenant who needs a key nobody else's records touched needs a dedicated domain now, or customer-held keys at L3."
31. **Certification dossier (L3 preview)** shows a gap list with costs and dates. It must carry the header "Not certified" so nobody reads it as a badge.
32. **Verifier release history needs a "runs affected" note** when superseded ("a reviewer who ran it needs to know what their run was worth").

*End of spec.*
