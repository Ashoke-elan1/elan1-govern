# 03 — Architecture Atlas and Financial Model: digest for the front-end build

Sources digested (27 Oct 2026 revised editions):
- `elan1-govern-architecture-atlas.pdf` — 46 pages, 42 figures (Figs 1–32 = original 23 Sep 2026 edition, many stamped "outdated"; Figs 33–42 = revision supplement describing what is **built in code** at commit `22388ad`).
- `elan1-govern-financial-model.xlsx` — 16 sheets, one 54-month engine (Oct 2026 – Mar 2031), Rs crore, US$ at Rs 90.

Purpose: extract everything that shapes screens, diagrams, flows, data and numbers for the React front end (console, developer portal, public site, pricing, billing/meter).

> **Read this first — "built" vs "specified".** The atlas is strict about truth-in-copy. Figures 33–42 are the product as built (MCP proxy + REST/SDK, signed rulebooks, Ed25519 receipts, approvals, governance layer, alerts). Figures 1–32 are the September *specification* (KernelPort, nine rungs, planes, Seal v6, L2/L3, metering, packs). Metering/billing, assurance levels L1–L3, anchoring, KMS/HSM, verifier profiles, residency, erasure, regulatory packs (ledger1/invoice1/collect1) are **specified, not built**. The atlas's own screen map (Fig 40) tags Billing & meter as "no meter, plan or invoice code — LATER" and Assurance L1–L3 as "LATER". The UI can design these, but marketing/public copy must not claim them as live. The CI rule C14 even bans the words "signed", "tamper-proof", "independently verifiable" in L1 copy (a Sept rule; receipts *are* now signed in code, so "signed receipts" is now truthful, but "tamper-proof", "immutable", "court-ready", "regulator-approved" remain banned at every level).

> **Note on "zones Z1–Z5".** The atlas contains **no zones Z1–Z5**. Its structural vocabulary is **planes P0–P8** (Fig 3), "components by zone" in Fig 4 (Surfaces / Kernel core P3 / Declaration plane P4 / L2 Attested / stack1 runtime P1), hosting **profiles 1–4** (Fig 26), and **levels L1–L3** (Fig 25). If Z1–Z5 come from another source document, treat them separately.

---

## Part A — Architecture Atlas

### A0. Visual language (reuse for the UI's diagram system)

Every built figure (33–42) uses the same legend — a ready-made design token set for interactive diagrams:

| Role | Fill / stroke (as seen on the pages) | Use |
|---|---|---|
| Elan1 Govern step / component | pale teal fill, teal stroke | guard steps, console, gate service |
| Ways in / agents and callers | pale blue fill, blue stroke | MCP, SDK/REST, AI agents |
| People who decide / caveat | pale amber fill, amber/brown stroke | approvers, owners, "ask a person", known-limit boxes |
| Refused / refusal path | pale pink fill, magenta stroke; dashed magenta arrows | refusal exits, rejected/expired |
| Runtime and data | pale lavender fill, purple stroke | PostgreSQL + pg-boss |
| External systems and parties | white fill, dark grey stroke | connectors, auditors, SIEM |
| Specified, not built | dashed outline (teal or grey) | anchoring, KMS, L2/L3 |
| Governed run — enforced | solid line | MCP path |
| Check and record — advisory | dashed blue line | SDK/REST path |

Header pattern for each figure: small caps "FIGURE 34 OF 42" in teal; title; one-line subtitle; status tag top-right in grey caps (e.g. "BUILT — IN CODE", "SPECIFIED, NOT BUILT", "MAPPING — SCREEN MAP"); a bold one-sentence takeaway under the diagram; a grey source line. Originals carry an orange stamp "REVISED 27 OCT 2026 · SEE FIG 35".

### A1. Figure inventory (all 42) — status and UI relevance

| # | Figure | Status | UI relevance |
|---|---|---|---|
| 33 | Elan1 Govern in context | BUILT · anchoring specified | **Hero system-context diagram** (public site, dev portal "How it works") |
| 34 | The decision path for one tool call | BUILT | **Core interactive diagram**; decision trace in Activity/receipt detail |
| 35 | Receipts, checkpoints and offline verify | BUILT · anchoring/KMS specified | Evidence page, receipt chain viewer, verify page |
| 36 | Rulebook lifecycle and suggestions loop | BUILT | Rulebooks area, suggestions cards, test-on-past-actions report |
| 37 | Approval path, links and chat | BUILT | Approvals area, approval state machine, chat channels |
| 38 | The governance layer | BUILT · draft, legal review | Inventory, Assessments, Compliance areas |
| 39 | Alerts, automatic pause and emergency stop | BUILT | Alerts area, STOP flow, incident report |
| 40 | One IA: thirteen areas | MAPPING | **The console nav/IA spec** |
| 41 | Spec-to-code crosswalk | BUILT vs SPECIFIED | "Roadmap / what's built" page, trust page |
| 42 | Deployment and package topology | BUILT · hosting/residency specified | Dev portal architecture page, security page |
| 1 | elan1 in context | OUTDATED → 33 | Historic (KernelPort, rung1, stack1 brands) |
| 2 | Perimeter and the seams | PARTLY → 33, 42 | Three-brand seam, token classes |
| 3 | Planes P0–P8 and who owns each | PARTLY → 42 | Layer-cake diagram (architecture page) |
| 4 | Components, repositories and internal seams | OUTDATED → 42 | — |
| 5 | KernelPort v1 — six calls, five objects | PARTLY → 34, 41 | API concepts (dev portal), data objects |
| 6 | The Right Path — nine rungs | PARTLY → 34 | **Ladder diagram**; refusal code register |
| 7 | One governed action, as a sequence | PARTLY → 34, 37 | **Sequence diagram** (₹2,40,000 invoice story) |
| 8 | Two modes, two claims | PARTLY → 34 | Enforced vs advisory comparison table |
| 9 | Declaration — seven blocks | PARTLY → 36 | Rulebook/declaration editor concepts |
| 10 | Clause to proof field — five-link chain | PARTLY → 38 | Compliance traceability view |
| 11 | Approval path — obligation state machine | OUTDATED → 37 | Decide screen spec (still useful UX detail) |
| 12 | Data architecture — stores, flows, retention | PARTLY → 42 | Data/retention page |
| 13 | L1 proof record — per-tenant hash chain | OUTDATED → 35 | 16-field record |
| 14 | Seal Spec v6 | PARTLY → 35 | L2 spec |
| 15 | Evidence bundle and offline verifier | PARTLY → 35 | Six exit codes (spec) vs three built |
| 16 | Key management and custody | PARTLY → 35 | Key rotation UI (spec) |
| 17 | Two-authority timestamp anchoring | STILL VALID (spec) | "Anchoring degraded" banner |
| 18 | Pack factory: 5 gates, 11 blocks, 8 tests | STILL VALID (spec) | Packs marketplace concept |
| 19 | ledger1 at runtime | STILL VALID (spec) | Pack detail page (MCA audit trail) |
| 20 | collect1: four layers, fourteen gates | STILL VALID (spec) | Pack detail page (RBI collections) |
| 21 | Cross-organisation verification | STILL VALID (spec, L3) | L3 feature page |
| 22 | Selective disclosure | STILL VALID (spec, L3) | L3 feature page |
| 23 | Precedent and earned autonomy (A0–A5) | STILL VALID (spec, L3) | Autonomy ladder visual |
| 24 | Action Receipt standard, certification, regulators | STILL VALID (spec) | Standards page, timeline |
| 25 | Assurance ladder and upgrade path | PARTLY → 41 | **Pricing tiers L1/L2/L3** with may-say/may-not-say |
| 26 | Runtime and deployment topology | OUTDATED → 42 | Hosting profiles 1–4 |
| 27 | Security, residency and DPDP controls | PARTLY → 42 | Security/trust page table |
| 28 | Metering pipeline: rung 9 to the invoice | STILL VALID (spec) | **Billing/meter screen and invoice layout** |
| 29 | Technology stack by layer | OUTDATED → 42 | — |
| 30 | Build roadmap Oct 2026 – Mar 2031 | PARTLY → 41 | **Roadmap Gantt** (public roadmap / investor) |
| 31 | CI pipeline and quality gates | PARTLY → 42 | Engineering/trust page |
| 32 | Operations: SLOs, failure, incidents | PARTLY → 39 | Status page, SLO cards |

### A2. Diagrams worth rebuilding as interactive SVG (with geometry)

#### Fig 33 — Elan1 Govern in context (system context) — BUILT
Layout: three columns inside a page; centre column is a dashed teal container labelled "elan1 PRIVATE LIMITED · the product: Elan1 Govern".
- **Left column "PEOPLE AND AGENTS"** (stacked boxes):
  - *AI agents* (blue): any MCP client — Claude Desktop and Code, Cursor; LangChain, OpenAI Agents SDK, own-loop agents via TypeScript or Python SDK; each agent has owner, risk level, API keys (stored hashed), one rulebook, a pause switch.
  - *Approvers* (amber): approver group named in the rule; decide in the console, by signed single-use link, or Slack/WhatsApp; password re-asked only if sign-in older than 10 minutes; never for chat buttons.
  - *Owners and admins* (amber): sign and publish rulebooks; emergency stop; signing keys; members, roles, SSO.
- **Centre container** (2×2 grid + data bar):
  - *Governed run — MCP proxy* (teal, solid border): `POST /mcp` (streamable HTTP); Govern runs the tool with credentials it holds; "enforces — for that tool".
  - *Check and record — SDK / REST* (white, dashed blue): `/v1/check` → agent runs tool itself → `/v1/record`; "advisory — an agent that skips the check is not stopped".
  - *Elan1 Govern guard* (teal, tall, right of the two): apps/gate; signed rulebook → allow · ask a person · refuse; no matching rule → refuse; an error → refuse; runs allowed calls through connectors (Governed run); signed hash-chained receipts; hourly signed checkpoints.
  - *Elan1 Govern console* (teal): apps/web; nav: Today · Approvals · Activity · Agents · Rulebooks · Connectors · Evidence · Inventory · Assessments · Compliance · Alerts · Settings; roles Owner, Admin, Approver, Viewer, Auditor.
  - *Governance layer* (teal): AI inventory; assessments with second-person sign-off; 10 frameworks, 13 controls — coverage counted from receipts; Draft — needs legal review.
  - *PostgreSQL 16 + pg-boss* (purple, full width): receipts, approvals, agents, rulebooks; org signing keys and OAuth tokens encrypted AES-256-GCM under one environment master key; tenant isolation in application code (`forOrg`), not row-level security.
- **Right column**:
  - CONNECTED SYSTEMS: *Built-in connectors* — Gmail · Zoho Books (zoho.in), demo data by default; *Your MCP servers* — any MCP server behind Govern (CRM, tickets, health records, cloud ops), tools synced with suggested risk tags, switched on one by one, SSRF-protected.
  - APPROVAL CHANNELS: *Email · Slack · WhatsApp* — signed single-use links by email; chat buttons only on rules marked approvable in chat.
  - ASSURANCE PARTIES: *Auditors* — switch between client orgs; `govern verify` checks an auditor pack offline, no account; compare key fingerprint or pass `--key`. *SIEM and other tools* — signed webhooks (HMAC-SHA256). *Timestamp authorities* (dashed) — RFC 3161 anchoring, specified, not built.
- Arrows: agents → MCP proxy (solid) and → Check and record (dashed blue); MCP proxy/Check → guard; guard → connectors and → your MCP servers (teal arrows right); guard → approval channels (amber arrow); approvers ↔ console (amber); governance layer → auditors (dashed); all centre → Postgres.
- Takeaway: "Only a Governed run enforces: Elan1 Govern holds the downstream credentials and runs the tool. Check and record is advisory…"

#### Fig 34 — The decision path for one tool call — BUILT (the product's core diagram)
Layout: left "WAYS IN" + reference cards; centre vertical chain of 8 teal step boxes joined by down-arrows; right column of pink refusal boxes connected by dashed magenta arrows; step 7 splits into three outcome boxes; step 8 spans the width.
- Ways in: **Governed run — MCP** (`tools/call` on `/mcp`; Govern runs the tool via its connector, mode `execute`; enforces — Govern holds credentials). **Check and record — SDK/REST** (`POST /v1/check` answers; agent runs tool, then `POST /v1/record`, mode `check`; SDK `check` · `record` · `waitForApproval`; Python `guarded` decorator; advisory).
- Steps:
  1. **Authenticate the agent** — API key looked up by SHA-256 hash; agent paused (own switch or emergency stop) → refuse. Exit: `agent-paused`.
  2. **Load the signed rulebook** — Ed25519 signature verified on every call; none published or untrusted → refuse. Exits: `no-rulebook` · `rulebook-invalid`.
  3. **Build the tool registry** — built-in tools + switched-on tools of the org's MCP servers, each with risk tags; unknown/switched-off → refuse. Exits: `default` · `invalid-arguments` (`default` also covers "no rule matched" at step 6).
  4. **Validate the arguments** — against tool input schema; invalid → refuse.
  5. **Count the limits** — count or sum per window: a day in the org's time zone, or rolling minutes/hours/days.
  6. **decide() — pure logic, no I/O** — match rules by tool or tag; check `when` and `unless`; **strictest wins: refuse > ask > allow** (ties → first rule); no rule matches → refuse; a limit can only turn allow into ask, never loosen. Side exit: *Error anywhere in the guard → refuse*, rule id `gate-error`, refusal receipt written when possible, health alert otherwise.
  7. Three outcomes side by side: **ALLOW** (teal) — Governed run: Govern calls tool then writes receipt; Check and record: agent runs it and records outcome. **ASK A PERSON** (amber) — receipt, then an approval waiting for the rule's approver group; signed links, email and chat; expires after 24 h by default → refused. **REFUSE** (pink) — nothing runs; receipt names the rule that refused or the system rule id.
  8. **Write one receipt — one writer per organisation chain** — decision, rule, rulebook version, argument hash and display identifiers; SHA-256 over canonical JSON, signed Ed25519, linked by `prev_hash`.
- Reference cards (left): **Risk tags (8)**: `reads_data`, `writes_data`, `moves_money`, `sends_external`, `personal_data`, `deletes`, `changes_access`, `changes_production` (high impact: moves money, deletes, changes access, changes production). **A tag rule (YAML)**:
  ```yaml
  - id: pay-large
    tag: moves_money
    when: { amount: { gt: 50000 } }
    decide: ask
    approver: finance
  ```
  **Conditions**: `eq lt lte gt gte in to_domain_in fields_include`; `unless` exceptions on ask rules only.
- Known-limits box (amber, bottom): in a Governed run an allowed action runs before its receipt is written (a failed write tells the agent "refused" though it happened, DECISIONS #15); approved calls same gap; calls rejected before the guard (bad key, rate limit) produce no receipt; limits counted outside the chain lock.
- Takeaway: "One path for every call, read or write. A tag rule governs tools Elan1 Govern has never seen…"
- UI use: animate a token travelling down the 8 steps; clicking a refusal exit shows the rule id; reuse the same chain as the "decision trace" on every Activity row / receipt detail.

#### Fig 6 — The Right Path: 0b + nine rungs (spec; superseded by Fig 34, but the iconic "ladder")
Vertical ladder of 10 boxes with p50 targets on the left and typed refusal codes on the right; a tall amber "Needs approval" box on the left with a loop arrow "resubmit from 0b".
| Rung | Name | What it does | Refusal codes (right) | p50 target |
|---|---|---|---|---|
| 0b | STOP | stop set: tenant kill switch, revocation, blacklist, regulator directive | `POLICY.TENANT_STOPPED` (only refusal with no proof record) | — |
| 1 | IDENTITY | actor_id, actor_kind from the token; delegation confers no autonomy | `POLICY.ACTOR_NOT_PERMITTED`, `POLICY.DELEGATION_INVALID` | 4 ms |
| 2 | WRITE DOOR | declaration at explicit integer version; write type reachable from channel | `POLICY.WRITE_TYPE_UNKNOWN`, `CHANNEL_NOT_PERMITTED`, `POLICY.DECLARATION_UNRESOLVED`, `PLATFORM.REGISTRY_UNAVAILABLE` | — |
| 3 | PRE-GATES | G1–G9 in declared order, pure functions of as_of | `GATE.*` (19 codes); never skippable G1–G4, G7, G9 | 8 ms |
| 4 | evaluate() | versioned rules over declared fields; no model → allow · refuse · escalate | `POLICY.DENIED_BY_RULE`, `POLICY.NO_RULE_MATCHED`, `PLATFORM.POLICY_UNAVAILABLE` | 12 ms |
| 5 | GUARDRAIL | allow-lists, blast radius one_record … batch · tenant · cross_boundary | `POLICY.BLAST_RADIUS_EXCEEDED` | 8 ms (5–6) |
| 6 | AUTONOMY | grant A0–A5; missing grant = A0; irreversible/too low → approval | `POLICY.AUTONOMY_INSUFFICIENT` | — |
| 7 | ACT — single writer | snapshot → shadow sandbox → gate re-run → identical bytes to live on a 10-min credential → commit | `GATE.SANDBOX_DIVERGED`, `PLATFORM.TARGET_UNREACHABLE`, `TOKEN_MINT_FAILED`, `PLATFORM.WRITER_LOCK_LOST` | 18 ms |
| 8 | PROOF | 16 fields, per-tenant seq, prev_digest, SHA-256, INSERT-only | every refusal → HTTP 200 + full record; record_id = zero UUID | 12 ms |
| 9 | METERED | exactly one meter event; quantity 1 committed, 0 otherwise | refusals/escalations meter at quantity 0 | 2 ms |
Kernel total ≈ 64 ms p50 [unverified]; ≤ 2 s p95 end to end (target). Closed refusal register: 43 codes, 28 active at L1 (policy 14 · gate 19 · platform 10). The nine pre-gates: consent · residency · retention · dual_control · rate · budget · counterparty · schedule · precondition.

Mapping Fig 6 → Fig 34 (for a "spec vs built" toggle): 0b STOP ≈ step 1 (agent paused / emergency stop); 1 IDENTITY ≈ step 1 (API key); 2 WRITE DOOR ≈ steps 2–3 (signed rulebook + tool registry); 3 PRE-GATES ≈ step 4–5 (schema + limits); 4 evaluate() ≈ step 6 decide(); 6 AUTONOMY/approval ≈ step 7 ask; 7 ACT ≈ Governed-run tool call; 8 PROOF ≈ step 8 receipt; 9 METERED — **not built** (no metering rung).

#### Fig 35 — Receipts, checkpoints and offline verify — BUILT
Three bands:
1. **THE RECEIPT CHAIN — ONE PER ORGANISATION**: four boxes left→right with arrows pointing *backwards* (each links to previous): Receipt 41 (seq 41 · kind decision; agent · tool · rule_id; decision allow; args_hash + args_summary; prev_hash = hash of 40; kid · hash · sig) ← Receipt 42 (decision ask; approval pending, expires_at) ← Receipt 43 (kind approval; approval approved, by, at; outcome ok · error · not_run; details.channel slack) ← Checkpoint (signs {org, seq, hash, ts, kid} — the chain head; every hour and on demand; skipped when head unmoved; catches a cut-off tail).
2. **HOW ONE RECEIPT IS MADE**: 1 Canonical JSON (keys sorted, no whitespace, without hash and sig) → 2 SHA-256 (`"sha256:" + hex`) → 3 Ed25519 signature (org key signs hash → sig; kid names key) → 4 Append (purple: one Postgres transaction under a per-org advisory lock → no gaps in seq).
3. **EVIDENCE AND THE OFFLINE CHECK**: Evidence bundle (format `gate-evidence-bundle/1`; `receipts.jsonl` · `checkpoints.json` · `public_key.pem` (+ `public_keys.json` after rotation) · signed `manifest.json` (range, count, last hash, file hashes) · `README.txt`) → Auditor pack (bundle + PDF summary + compliance map; exported by owners, admins, auditors) → terminal box "On the auditor's own machine — offline, no account":
   ```
   $ govern verify auditor-pack.zip
   Chain intact: 31 receipts
     receipts 1–31, 2 signed checkpoints
     organisation: Demo Traders Pvt Ltd
     key fingerprint: 17f410d32e400e2d
   ```
   checks schema, seq continuity, every prev_hash, hash and signature, checkpoints, manifest, file hashes; **exit 0 intact · 1 broken or not verified (names first broken receipt) · 2 usage error**. Amber caveat "Whose key?" — bundle carries its own key; a fabricated bundle with its own key would verify unless `--key` or fingerprint compared.
- Bottom cards: *What a receipt never holds* (pink): full arguments, message bodies, prompts; an email address (a domain instead); values no rule inspected (field names instead). *The signing key*: one Ed25519 key per org, wrapped AES-256-GCM by one env master key; no KMS/HSM; owner rotation; every signature carries kid; rulebooks re-signed. *Specified, not built* (dashed): RFC 3161 anchoring at two TSAs; KMS/HSM custody; Seal v6; a second independent verifier.

#### Fig 36 — Rulebook lifecycle and suggestions loop — BUILT
Top: five-step horizontal pipeline "ONE RULEBOOK PER AGENT": 1 Draft (visual builder and YAML kept in sync; starts from industry pack; rules by tool or risk tag; limits per window) → 2 Try an action (one made-up call vs draft; shows decision and deciding rule) → 3 Test on past actions (replays this agent's real calls of last 7 or 30 days; up to 200 changed calls) → 4 Versions and diff (every published version kept; diff shown before publishing) → 5 Sign and publish (Ed25519 on every version; owners and admins only; a high-risk agent needs an ask rule for high-impact tags) → "Active signed rulebook" (signature checked on every call).
Middle cards: *Four kinds of suggestion* (raise a limit; allow under an amount; allow known counterparties — never for money-moving tools; both). *Never suggested* (a change to a refuse rule; tools tagged deletes/changes_access/changes_production; a group with any rejection or expiry). *What a test reports*: "Of 412 calls, 12 more would be refused, 30 more would ask a person and 5 fewer would ask a person. 3 could not be judged." — nothing runs/signs/publishes. *Replay store*: validated arguments AES-256-GCM, kept 30 days, purged hourly; on by default; switching off deletes everything.
Bottom loop: People answer approvals → Rule suggestions (nightly 02:00 IST or on request; last 30 days of answered approvals; group qualifies with ≥10 approvals over ≥7 days, latest within 14 days, no rejection/expiry; cap ≤ largest approved amount and below any refuse threshold; every past approval replayed) → suggestion card → "Open as draft → back to step 1" / Dismiss (both receipted; dismissed returns only when its approvals at least double).
**Suggestion card copy (verbatim demo)**: "Raise the no-approval limit for payments from ₹50,000 to ₹1,00,000 — In the last 30 days people approved all 41 payments over ₹50,000 and up to ₹1,00,000, to 6 vendors (none rejected). Allow payments up to ₹1,00,000 without asking?" [Open as draft] [Dismiss].

#### Fig 37 — Approval path, links and chat — BUILT (state machine)
Left column "WHERE A PERSON DECIDES" (blue boxes): Console (`/approvals`; password re-asked only if sign-in > 10 min) · Email or phone link (`/approve/[token]`, signed, single-use; page still asks sign-in) · Slack (request signature, 5-minute window; clicking user's email confirms) · WhatsApp (Meta `X-Hub-Signature-256` + sender's verified number; only a hash of the number kept) → all feed **One resolver for every channel** (teal; person must be an approver for the rule; one decision per approval).
Centre: Tool call → decide() = ask → **Hold** (first receipt: decision ask, approval pending; approval row: agent, tool, arguments (encrypted), evidence such as invoice, vendor and amount, rule, approver group, expiry; links by email; Slack/WhatsApp queued; webhook `approval.pending`) → **PENDING** (amber; expires after 24 h default, `expires_in` up to 30 days; checked every minute) —approve→ **APPROVED → the action runs** (Governed run: Govern runs tool; Check and record: agent waiting on `waitForApproval` runs it) → **Second receipt** (kind approval: who, when, where — `details.channel = web · email · slack · whatsapp`; outcome ok · error · not_run; webhook `approval.resolved`).
Right (pink, dashed arrows from PENDING): **REJECTED** (refused; nothing runs; receipt approval rejected) · **EXPIRED** (nobody decided in time → refused; stored arguments wiped) · **APPROVED, BUT THE RUN FAILED** (approval stands; receipt outcome error + reason).
Top-right: *How the agent learns the outcome*: MCP returns "waiting" with `approval_id`; agent calls `gate.approval_status` (waits up to 30 s); REST/SDK `GET /v1/approvals/:id?wait=…` or `waitForApproval`; signed webhooks for every change.
Bottom: chat buttons only when rule marked "Can be approved in Slack or WhatsApp" (`approve_in_chat`, off by default); never for deletes, changes_access, changes_production, personal_data; money tools only with an upper amount; never when a limit caused the ask; else message carries "Open in Elan1 Govern" link. Caveats: chat buttons skip password check; self-approval allowed but flagged `self_approval: true`; emergency stop does not cancel waiting approvals; email link still requires sign-in. Tagline: "Slack and WhatsApp are a doorbell, not a replacement."

#### Fig 38 — Governance layer — BUILT (draft, needs legal review)
Four columns left→right: **1 Inventory** (every AI system: kind agent/model/vendor tool/internal app, vendor, owner, business unit, purpose, data categories, people affected, makes decisions?; stage proposed → in review → approved → live → retired; Govern agents appear automatically; risk tier/next review only from approved assessments; no model name/version field) → **2 Assessments** (three templates: risk triage (nine questions), impact assessment, data-protection check; deterministic scoring shown; second-person sign-off — never own submission; next review 6/12/24 months for high/medium/low) → **3 Frameworks and controls** (10 libraries: EU AI Act · NIST AI RMF 1.0 · ISO/IEC 42001 · DPDP Act 2023 · RBI FREE-AI · GDPR · HIPAA · SOC 2 · Colorado AI Act · NYC Local Law 144; 13 controls GATE-01…13) → **4 Evidence and coverage** (coverage = share of requirements with ≥1 mapped control with live evidence on the chain; gaps "No control covers this yet"; framework report PDF; compliance map in auditor pack).
Demo coverage (seeded org): **ISO 42001 46% (7/15) · NIST AI RMF 63% (7/11) · DPDP 11% (1/9) · RBI FREE-AI 66% (4/6) · EU AI Act 25% (4/16) · GDPR 30% (3/10)**.
Bottom: *Seven industry packs* chosen at onboarding: finance and accounting · healthcare · HR and recruiting · customer support · sales and marketing · engineering and DevOps · general (each: typical risks, frameworks for regions India/EU/UK/US, controls, starter rulebook; only finance names built-in tools, others use tag rules). Footnote: GATE-09 "agents never hold credentials" holds only for Governed run.

#### Fig 39 — Alerts, automatic pause and emergency stop — BUILT
Top grid 3×2 "SIX BEHAVIOUR CHECKS PER AGENT — STATISTICAL RULES, NOT ML": Unusual number of calls (last hour vs typical busy hour of last 14 days, median + MAD; medium/high, can pause) · Many refused calls (medium/high, can pause) · Unusually large amount (medium/high, can pause) · New counterparty (vendor/domain/payee/account/customer not seen in 90 days; medium with amount else low) · First use of a tool (always low) · Activity at an unusual time (low/medium). Timing: no alerts in first 7 days (learning); quick checks after each receipt; all checks every 5 minutes on pg-boss.
Middle flow: Alert open (one per agent/check/subject; receipt + webhook `alert.created`; medium/high email owners+admins) → Acknowledged → Resolved; branch "high severity and auto-pause on" → Automatic pause (receipt `agent.paused`; "Pause automatically on high-severity alerts" off by default).
Bottom flow "EMERGENCY STOP — EVERY AGENT AT ONCE": Owner/admin types **STOP** → Emergency stop (pauses every running agent in one transaction; one `emergency.stop` receipt with count; opens incident; emails owners/admins; **red banner on every page**) → Resume agents (only those the stop paused; `emergency.resumed` receipt) → Incident report PDF (who stopped/resumed, alerts, every receipt from an hour before the stop to resume; receipt range for `govern verify`).

#### Fig 40 — One information architecture: thirteen areas (console nav order) — MAPPING
4-column grid of teal area cards, each with routes, screenshot refs, and three counters [built | needs logic | design only] = total:
| # | Area | Routes | Built / Needs logic / Design only |
|---|---|---|---|
| 1 | Sign-in and onboarding | `/login` · `/signup` · `/invite/[token]` · `/onboarding` | 19 / 1 / 2 = 22 |
| 2 | Today | `/` | 3 / 1 / 0 = 4 |
| 3 | Approvals | `/approvals` · `/approvals/[id]` · `/approve/[token]` | 9 / 0 / 2 = 11 |
| 4 | Activity | `/activity` | 11 / 0 / 7 = 18 |
| 5 | Agents | `/agents` · `/agents/new` · `/agents/[slug]` | 11 / 0 / 1 = 12 |
| 6 | Rulebooks | `/rulebooks` · `/rulebooks/[slug]` | 24 / 0 / 2 = 26 |
| 7 | Connectors | `/connectors` | 7 / 0 / 0 = 7 |
| 8 | Evidence | `/evidence` | 8 / 0 / 2 = 10 |
| 9 | AI inventory | `/inventory` · `/inventory/[id]` | 3 / 0 / 0 = 3 |
| 10 | Assessments | `/assessments` · `/assessments/[id]` | 4 / 0 / 2 = 6 |
| 11 | Compliance | `/compliance` · `/compliance/[framework]` | 6 / 0 / 5 = 11 |
| 12 | Alerts and emergency stop | `/alerts` · `/alerts/[id]` | 6 / 1 / 1 = 8 |
| 13 | Settings | `/settings` · `/settings/sso` · `/settings/notifications` | 17 / 0 / 3 = 20 |
Outside the 13 areas (dashed cards): **Developer** (planned `/developers` pages and a no-account `/verify` page — KEEP) 0/26/4 = 30 · **Public site and portals** (legal pages and web verifier KEEP; marketing and most portals LATER) 0/10/48 = 58 · **Billing and meter** (no meter, plan or invoice code — LATER) 0/0/8 = 8 · **Assurance and proof L1–L3** (assurance levels, anchoring, verifier profiles — LATER) 0/0/31 = 31 · **System pages** (404 and error built; 403, maintenance, offline, approvals unavailable — KEEP) 2/4/1 = 7.
Totals: area rows 128 built · 3 need logic · 27 design only; outside 2 · 40 · 92. **All rows 130 built · 43 need logic · 119 design only = 292** (275 design screens + 17 built screens with no design). 113 of 275 design screens sit on working code (38 one-to-one, 75 merged). 130 built rows land on **27 distinct page routes** (+53 API route handlers); up to 18 rows map to `/rulebooks/[slug]`.

#### Fig 41 — Spec-to-code crosswalk — reference table (for a "what's built" page)
Rows (spec → built name → status): Declaration seven blocks → Rulebook (one per agent, YAML, signed) BUILT DIFFERENTLY · Write type → Tool + 8 risk tags BUILT DIFFERENTLY (every call, reads included) · Studio simulate/certify → Try an action · Test on past actions · Sign and publish BUILT · L1 hash chain → Receipt SHA-256 + Ed25519 BUILT · Chain standing → chain + hourly signed checkpoints BUILT · Evidence bundle + verifier → Auditor pack + govern verify PARTIAL (exit codes 0/1/2 not six) · Approval obligation → pending/approved/rejected/expired BUILT DIFFERENTLY · WhatsApp approval → Slack and WhatsApp BUILT · Stop switch rung 0b → Emergency stop + per-agent pause BUILT · Agent registry/Tools → Agents · Tool registry BUILT · Connected systems → Gmail, Zoho Books, Your MCP servers BUILT · Controls & regulations → 10 frameworks, 13 controls BUILT (draft) · Regulatory packs → Industry packs (7) BUILT DIFFERENTLY (ledger1/invoice1/collect1 remain specified) · Tenants → Organisations BUILT (no RLS) · MCP 34 tools → `/mcp` built-in, upstream, status tools PARTIAL · KernelPort six calls → MCP `/mcp` + REST `/v1/*` (OpenAPI 3.1) BUILT DIFFERENTLY · Nine rungs → Eight-step guard PARTIAL · Mode A/B → Governed run / Check and record BUILT DIFFERENTLY · Temporal → pg-boss BUILT DIFFERENTLY · Seal v6, RFC 3161, KMS/HSM, earned autonomy, metering and billing, L3, residency, erasure, idempotency → SPECIFIED.
Ladder: **L1 Guarded — PARTIAL** (current partial L1: no meter; enforcement only on MCP route) · **L2 Attested — not claimed** (Ed25519 signing and offline verifier exist) · **L3 Proven — specified**.

#### Fig 42 — Deployment and package topology — BUILT
Left "RUNTIME AS BUILT": Agents (MCP clients and SDK agents; API keys as SHA-256 hashes) → **gate — apps/gate (Fastify)**: `/mcp` · `/v1/check` · `/v1/record` · `/v1/approvals/:id` · `/chat/slack` · `/chat/whatsapp` (signed inbound) · `/internal/*` (HMAC-signed calls from web) · `/healthz`; holds env master key; **300 requests a minute per API key**, per process. People (browsers, password + TOTP or OIDC SSO) → **web — apps/web (Next.js 15)**: 27 pages, 53 API route handlers; each API route: rate limit → CSRF → session → permission → recent sign-in → input check; cannot sign. web → gate via `/internal/*` (HMAC). Both → **PostgreSQL 16** (Prisma, 11 migrations, forOrg) + **pg-boss jobs**: approval expiry every minute · checkpoints hourly · webhook sweep every minute · replay purge hourly · rule suggestions nightly · behaviour scan every 5 minutes. docker-compose: postgres:16-alpine · mailpit · migrate · gate · web. Outside services: Gmail and Zoho Books (customer OAuth, demo default), upstream MCP servers (public addresses only, SSRF guard), Slack, WhatsApp Cloud API, email, SIEM webhooks, OIDC IdPs.
Right "PACKAGES — DEPENDENCIES POINT ONE WAY": apps/gate (5,312 lines), apps/web (11,041) → packages/connectors (Gmail, Zoho Books, mock · 822), packages/db (Prisma, forOrg, chain writer · 1,891) → packages/core (pure logic, no I/O: canonical JSON, crypto, rulebook and engine, receipts, verifier, behaviour, suggestions, frameworks and packs · 4,336); packages/cli (`govern verify · sign · keygen` · 111); SDKs TypeScript `@gate/sdk` (125), Python `elan1_govern` (419, stdlib only).
Security in the code: argon2id, TOTP, lockout · OIDC with DNS-verified domains · CSP with nonce, HSTS, CSRF · SSRF at connect time · secrets AES-256-GCM · tenant-isolation and role-matrix tests · scanners pnpm audit, semgrep, gitleaks, ZAP.

#### Fig 3 — Planes P0–P8 (layer-cake; spec)
Nine horizontal bars bottom-up with a vertical gradient bar "costlier to change ↓ · cheaper ↑"; columns: plane, what it holds, changeable, owner pill(s); right column of 9 numbered boundary rules; a red dashed line above P3 marks the import boundary.
| Plane | Holds | Changeable | Owner |
|---|---|---|---|
| P8 Packs | vertical packs: declaration + verifier profile each — ledger1, invoice1, collect1 | Yes, intended churn | elan1 |
| P7 Apps | horizontal apps, one declaration each — rung1 Enterprise, Revenue, Commerce | Yes | rung1 · third parties |
| P6 Channels | web, API, messaging (block 7); rung1 Voice; verna1 parked | Yes, per channel | rung1; elan1 MCP/HTTP |
| P5 Surfaces | shared renderers and surface registry; screens compiled from a declaration | Hard, one team | elan1 renderers |
| P4 Declaration plane | schema, write-type descriptors, lexicon, policy versions | Forward only, never migrated | elan1 schema; consumers' declarations |
| P3 Kernel | the one write function: nine rungs, evaluate(), proof, meter | **SHUT** | elan1 |
| P2 System of record | write API and record store (hosted ERPNext first) | Hard | customer's books; rung1 hosts |
| P1 Platform runtime | compute, queues, object store, secrets, outbox — via fusion.*/v1 | Yes, deliberately boring | stack1 |
| P0 Residency and tenancy | region ap-south-1, tenant, key custody, erasure salt store | **SHUT**, no migration path | elan1 policy; stack1 operation |
Boundary rules (red numbered circles): 1 nothing above P3 imports a kernel type · 2 no module reachable from rungs 3–8 imports a model client · 3 no stack1 package imports elan1 · 4 control plane has no network route to record store · 5 exactly one write credential per environment · 6 define rejects version ≠ last+1; "latest" is a rejection · 7 resource outside region allow-list fails build · 8 RLS on every tenant table · 9 at L1 no "signed", "tamper-proof", "independently verifiable" in copy. Quote: "An instruction in a document is advice; a failing build is a control."

#### Fig 7 — One governed action as a sequence (spec, but a great storytelling diagram)
Ten lifelines: ar-agent (agent · A2 Propose) · SDK/MCP (act scope) · kernel (Right Path) · gate engine (G1–G9 · evaluate()) · approval svc (console · Work) · **Venkat** (named approver) · single writer + credential broker · ERPNext (via Frappe API) · proof store (chain writer) · meter (meter_event). Story: agent proposes a **₹2,40,000 sales invoice** → ① ESCALATE: rungs 0b–6, 5/5 gates pass, allow at policy_version 11, autonomy A2 → escalate; obligation expiry 4 h; seal → **seq 4,099** (escalated), meter qty 0; HTTP 200 escalated → ② A NAMED HUMAN DECIDES on the Decide screen (diff · 5/5 gates · policy v11 · countdown) → Approve → **seq 4,100** (resolution) → ③ RESUBMIT AND ACT: climbs again, G4 dual control finds second actor → rung 7: snapshot, shadow sandbox, single-use 10-minute credential, identical bytes to live, commit → **seq 4,101**, meter qty 1; webhook `write.committed`. "Three proof entries for one approved decision."
Decide screen spec (Fig 11): one-line proposal; proposer in words ("Agent" or "Person"); deadline countdown; declared blast radius; field-by-field diff before→after ("Show all fields"); every gate's result with version, e.g. "Precondition (credit limit ₹3,00,000, exposure after ₹2,40,000) — passed"; decision "allow at policy version 11" and why a person is needed; Approve · Reject (reason required); **44 px targets, never adjacent without a gap**.

#### Fig 8 — Two modes, two claims (comparison table)
| | Mode A — Enforced (now: Governed run / MCP) | Mode B — Attested advisory (now: Check and record / SDK-REST) |
|---|---|---|
| Target credential | held by Govern | held by the caller |
| A refusal means | "the write did not happen" | "Elan1 Govern evaluated this and said no" |
| May claim | "This write could not have occurred without passing the gates." | "Every write intent is evaluated against policy and recorded, and the record is exportable." |
| May not say | "tamper-proof" | "we block", "we prevent", "cannot", "nothing gets through without us" |
| Added latency (target) | ≤ 15 ms | ≤ 40 ms p95 |
| Kernel fails | "Nothing was changed." | caller must fail closed; timeout = refuse |
Front-end implication: the dev portal and marketing must label the SDK/REST path "advisory".

#### Fig 25 — Assurance ladder (pricing-tier diagram)
Three ascending columns/steps:
| | L1 Guarded | L2 Attested | L3 Proven |
|---|---|---|---|
| Status / target | building; GA target Q2 CY2027 | frozen spec; GA Apr 2028 | frozen spec; entry event-gated, Oct 2029 |
| Adds | nine rungs, evaluate(), autonomy, human approval, sandbox + 30-day rollback, SHA-256 chain, meter (refusals qty 0) | Ed25519 over digest, KMS custody per residency domain, RFC 6962 Merkle → RFC 3161 at two TSAs ≤ 15 min, 8-member bundle, offline verifier (free), verifier profiles | cross-org verification, selective disclosure, customer-held keys, sovereign deployment, precedent intelligence, earned autonomy A2→A3, Action Receipt open standard |
| May say | "checked against versioned rules before it happened; a person approved; tamper-evident to you, the chain holder" | "a party with our key fingerprint, got out of band, can verify this bundle on an air-gapped machine with no elan1 process" | "the format is open; a receipt stays checkable after we are gone" |
| May not say | signed · tamper-proof · immutable · independently verifiable · court-ready | accepted by MCA/RBI/SEBI · court-ready · immutable · verifies your books | tamper-proof · regulator-approved · transaction genuine · "standardised" |
| Buyer question | Ops/finance owner: "can I let this run?" | Auditor's counterparty: "can I hand this over?" | The market: "does this survive the vendor?" |
| List price | **₹1,80,000 / tenant / yr** | **₹6,00,000 / tenant / yr** | **₹24,00,000 / tenant / yr** |
L1→L2 upgrade runbook stages: 0 Pre-flight ("continuous, 41,206 records") → 1 Key → 2 Signing on (IRREVERSIBLE) → 3 Anchoring on → 4 Profile → 5 First bundle (exit 0 PASS; tampered exits 1) → Close. Boundary: seq 1–41,206 stays L1 forever; 41,207→ signed.

#### Fig 28 — Metering pipeline: rung 9 to the invoice (billing screen blueprint; spec)
Top row of six boxes left→right: Governed action (blue; outcome committed, refused or escalated) → Rung 8 PROOF (record at seq n; refusal sealed too, zero UUID) → Rung 9 METERED (exactly one meter event; basis from declared blast radius; 2 ms) → Meter ledger (INSERT-only; CHECK refused ⇒ quantity 0) → meter.reconcile() (nightly, two-way, vs proof log and target) → Rate and invoice (reconciled period only; monthly, overage in arrears). Dashed magenta line under: "refused: full record, meter row quantity 0 — never a 4xx, never retried".
Meter event schema: `event_id` uuid · `write_id` uuid · `seq` uint64 · `basis` enum · `quantity` uint32 (1 committed · 0 refused) · `outcome` committed | refused | escalated · `at` RFC 3339. Basis map: one_record → per record · one_counterparty → per counterparty · batch → per batch · tenant → per tenant · cross_boundary → per crossing. `CHECK (outcome <> 'refused' OR quantity = 0)`.
**Illustrative invoice** (tenant at L1 Guarded, India, one reconciled month): Platform floor — L1 ₹1,80,000 per tenant per year, not discountable · Governed actions in allowance — 4,80,000 a year included at L1 · Governed actions beyond it — × ₹1.60 · **Refused 412 — ₹0, count shown on the invoice** (pink row) · Pack line (ledger1 …) ₹1,35,000 per tenant per year, blended · Evidence line (L2 onward, dashed) — verifier profile per regime per year; bundle export free within allowance; verifier ₹0. Link: "Show the records behind this line" opens every event by write_id and seq; disputed line held and settled against the proof record.
Reconciliation: discrepancy stops the invoice and pages; kernel meter vs credit ledger zero tolerance; runtime meter vs component counters 0.5%. Three meters: Kernel meter (normative) · Runtime meter (stack1 token, GPU, byte, page, tool units) · Credit ledger (rung1, a rendering).
**Rules that travel with the price**: nobody may discount the platform floor, the meter basis or the price of a refusal; no discount on the L2 evidence line; **no per-seat price and no outcome price at any level**; **the refusal rate is published beside cost per governed action every month**.

#### Other spec diagrams (shorter notes)
- **Fig 5 KernelPort v1**: six calls `define · assert · seal · verify · scope · refuse`; five objects Write intent · Decision · Approval · Record (16 fields F01–F16) · Meter event; invariants I1–I8 (I1 "A model may produce a write intent; it may never produce an allow"; I3 fail closed; I4 refusals free and typed; I6 no warn). Refusal = HTTP 200 + full record; rejection = 4xx, no record; platform failure = 5xx.
- **Fig 9 Declaration** seven blocks: identity · shape · permissions · write_types (hub) · gates · proof_binding · channels; lifecycle Author → Validate → Simulate → Certify → Compile → Resolve; lint rules L0-S01…S11.
- **Fig 10** five-link chain: Regulation clause → Control → Gate → Write type → Proof field (worked on MCA Rule 3(1)/11(g)); pipeline 1 Enumerate … 8 Publish.
- **Fig 12 Data architecture** stores: Declaration registry · Writes and gate results · Obligations and approvals · Record version + outbox · Snapshots and backups · Proof log · Meter ledger · Keys and secrets · Salts and anchors [L2] · Evidence bundles [L2] · Pack and profile registry; region ap-south-1 (3 AZ). Retention: proof ≥ 8 yrs (MCA) / 7 yrs WORM; snapshots 30 days; security logs ≥ 1 yr (180-day India min); app logs 180 days; idempotency keys 30 days.
- **Fig 13** 16-field record F01 tenant_id … F16 recorded_at; preimage 329 octets; genesis prev_digest 32×0x00; demo seqs 4,097 committed / 4,098 refused (`GATE.PRECONDITION_FAILED`).
- **Fig 15** six exit codes: 0 PASS · 1 FAIL_INTEGRITY · 2 FAIL_PROFILE · 3 INCOMPLETE · 4 UNSUPPORTED · 5 USAGE (built verifier has only 0/1/2).
- **Fig 17** anchoring banner copy: "Anchoring degraded since 09:14 — 88 records unanchored"; TSAs eMudhra (India) + DigiCert/Sectigo/GlobalSign/Entrust.
- **Fig 18** pack admission gates G-A dated hook · G-B an auditor · G-C reversible or declared irreversible · G-D evidence sold separately · G-E we own the write; rejected candidates public1, agri1, retail1, edu1, legal1, energy1; pack go-lives ledger1 Oct 2027 · invoice1 Apr 2028 · collect1 Oct 2028.
- **Fig 19 ledger1**: MCA Rule 3(1), ~1.85 million companies; wilful breach ₹50,000–₹5,00,000; buyer: promoter or finance controller of a ₹5–50 crore firm "on the CA's advice"; write types sales_invoice.submit/.cancel, purchase_invoice.submit, payment_entry.submit, journal_entry.submit, customer.update; dual control above ₹2 lakh.
- **Fig 20 collect1**: four layers Conduct (RBI) · Telecom · Data (DPDP) · Sector; 14 gates (7 before the dial, 5 during, 2 after); 16 typed refusals billed at zero.
- **Fig 21–22** L3 cross-org receipt (record 41,288 → receiver 8,902; audience `ar-org:acmetextiles.example`, expires in 7 days); selective disclosure to auditor vs lender.
- **Fig 23** autonomy ladder A0 Observe · A1 Draft · A2 Propose · A3 Act reversible (earned) · A4 Act bounded · A5 Act broad; eligibility ≥ 90 days, ≥ 200 records (≥ 100 approvals).
- **Fig 24** conformance CL-1 Structural · CL-2 Attested · CL-3 Anchored · CL-4 Addressed · CL-D; licences spec CC BY 4.0, verifier Apache-2.0, vectors CC0; external dates (SCITT RFC 9943 30 Jun 2026; EU AI Act Art. 50 2 Aug 2026; DPDP main obligations 13 May 2027; EU high-risk 2 Dec 2027 / 2 Aug 2028).
- **Fig 26** hosting profiles: 1 Hosted multi-tenant · 2 Dedicated residency domain (Enterprise) · 3 Customer-held keys · 4 Sovereign/on-premises (₹1.20 cr/yr, Jul 2029); environments dev · ci · stage · prod · sandbox tenant (`sk_sbx_` key, metered at 0).
- **Fig 27** security table by layer: identity and tokens · credential broker · tenant isolation · encryption and keys · supply chain · residency · DPDP · logging/CERT-In (6-hour report).
- **Fig 30 roadmap** (H2'26 → Q1'31): L1 record shape frozen 30 Nov '26 · first real governed write 31 Dec '26 · meter reconciles 31 Jan '27 · L1 GA 30 Jun '27 · first paying tenant 31 Jul '27 → 84 tenants Sep '28 → 186 Jun '29 → 545 Mar '31 · L2 signing 30 Sep '27, Gate 1 31 Jan '28, L2 GA 30 Apr '28 · Gate 3 31 Dec '28 · Action Receipt v1 Jun '29 · L3 entry 31 Oct '29 · certificate 31 Mar '30; headcount 11 → 27 → 95 → 170 → 243 → 305.
- **Fig 32** SLOs: governed write p50 ≤ 120 ms, p99 ≤ 450 ms; seal p50 ≤ 40 ms; outbox→seal lag p99 ≤ 2 s; anchor ≤ 15 min; bundle 10k ≤ 60 s; offline verify 10k ≤ 5 s; writes without a seal 0; availability 99.5%/month; fail-closed copy "We cannot check this change right now. Nothing was changed."

### A3. Planes, layers and "zones"
See Fig 3 above for P0–P8. Fig 4 (outdated) groups components by zone: **Surfaces** (SDK `@elan1/kernel`, MCP server 34 tools ro 18 · stage 10 · act 6, HTTP /v1 + webhooks, Console "Four Doors": Work · Records · Agents · Assurance) → **Kernel core P3** (Right Path executor, gate engine, policy service, guardrail/autonomy, approval service, refusal register, meter, chain writer, single writer) → **Declaration plane P4** (Studio, compiler/registry, packs P8, system of record) → **L2 Attested** (signer, anchor batcher, bundle exporter, offline verifier) → **stack1 runtime P1** (fusion.run/trace/tools/guard/gateway). As built (Fig 42) the zones collapse to **two services (gate, web) + one Postgres**. No Z1–Z5 exist in the atlas.

### A4. Data stores (as built, Fig 33/42) and entities for the front-end data model
PostgreSQL 16 holds: organisations (`forOrg`), members/roles, agents (owner, risk level, hashed API keys, pause switch, one rulebook), rulebooks + signed versions, tool registry (built-in + upstream MCP tools with risk tags, on/off), receipts (chain per org: seq, kind, agent, tool, rule_id, decision, args_hash, args_summary, prev_hash, kid, hash, sig, approval fields, outcome, details.channel), checkpoints, approvals (agent, tool, encrypted args, evidence, rule, approver group, expiry, status), replay store (encrypted args, 30 days), suggestions, alerts, incidents, inventory items, assessments, frameworks/controls coverage, connectors + OAuth tokens (encrypted), webhooks, org signing keys (wrapped). Receipt kinds seen: `decision`, `approval`, `agent.paused`, `emergency.stop`, `emergency.resumed` (plus inventory changes, assessment submissions and sign-offs are receipts on the same chain).

### A5. Integration points
- **MCP**: `POST /mcp` streamable HTTP; `tools/call` (mode execute); status tool `gate.approval_status` (waits ≤ 30 s); built-in, upstream and status tools.
- **REST** (OpenAPI 3.1): `POST /v1/check`, `POST /v1/record`, `GET /v1/approvals/:id?wait=…`; rate limit 300 req/min per API key.
- **SDKs**: TypeScript `@gate/sdk` (`check`, `record`, `waitForApproval`); Python `elan1_govern` (stdlib only; `guarded` decorator).
- **CLI**: `govern verify · sign · keygen`; `govern verify auditor-pack.zip [--key]`, exit 0/1/2.
- **Connectors**: Gmail, Zoho Books (zoho.in) — demo mode default; "Your MCP servers" (any MCP server; tools synced with suggested risk tags; SSRF guard).
- **Inbound chat**: `/chat/slack`, `/chat/whatsapp` (signed).
- **Webhooks out** (HMAC-SHA256): `approval.pending`, `approval.resolved`, `alert.created` (and "for every change"); spec-era names `write.escalated`, `obligation.resolved`, `obligation.expired`, `write.committed`, `write.refused`.
- **Identity**: password (argon2id) + TOTP, lockout, OIDC SSO with DNS-verified domains (no SAML/SCIM).
- **Approval channels**: console `/approvals`, signed single-use link `/approve/[token]`, email, Slack, WhatsApp.

### A6. UI/screen references in the atlas
Console nav (built, in order): Today · Approvals · Activity · Agents · Rulebooks · Connectors · Evidence · Inventory · Assessments · Compliance · Alerts · Settings (+ sign-in/onboarding). Roles: Owner, Admin, Approver, Viewer, Auditor. Auditors switch between client organisations. Red emergency-stop banner on every page. Spec-era console: "Four Doors" (Work · Records · Agents · Assurance), Decide screen, Studio, Proof; Assurance door shows unanchored head. Screenshot refs 01–23 exist in the code repo (`docs/screenshots`), e.g. 17-compliance.png. Designed-but-unbuilt groups: Developer (30 screens), Public site and portals (58), Billing and meter (8), Assurance and proof (31), System pages (7).

---

## Part B — Financial model (`elan1-govern-financial-model.xlsx`)

### B0. Conventions
Reporting currency **Indian rupees**; 1 crore = 10,000,000; 1 lakh = 100,000. **US$ at Rs 90.00 = US$1** (Rs crore ÷ 9 = US$ million). Financial years end 31 March (FY2026-27 … FY2030-31). Plan period Oct 2026 – Mar 2031 (54 months). Refusals metered at quantity zero and never billed. **List prices flat to March 2029, then +4% p.a.** Included allowances consumed first. All figures modelled, not quoted; no customers exist yet.

### B1. Sheets and purpose
| # | Sheet | Purpose |
|---|---|---|
| 1 | Cover | The ask, currency convention, tab index |
| 2 | Assumptions | Price book, monthly tenant/mix/channel ramp, salary bands, funding schedule, Govern switches |
| 3 | Summary P&L | Five FY P&L, exit ARR, cash, headcount, tenants, partners; US$ block; Govern overlay rows |
| 4 | Monthly FY2026-27 | Oct 2026 – Mar 2027 in Rs lakh; headcount by function |
| 5 | Quarterly FY2027-28 | FY28 quarters + all 18 quarters |
| 6 | Annual FY2028-31 | Scale years: P&L, revenue/opex lines, headcount, customers, unit economics |
| 7 | Revenue build | Every revenue line by FY and quarter, mix % |
| 8 | Cost build | COGS split, opex lines, % of revenue |
| 9 | Headcount | 10 functions × 54 months, bands, people-cost bridge |
| 10 | Unit economics | Governed-action volumes, revenue/cost per action, price anchors |
| 11 | Cash and funding | 54-month cash chain |
| 12 | Scenarios | Base/downside/upside + Govern read-cost sensitivities |
| 13 | Govern overlay | Governance-layer add-on and reads, behind switches (all OFF) |
| 14 | Gate calendar | Dated events, tranche gates, build status |
| 15 | Govern build status | Capability-by-capability audit (built / partial / not built) |
| 16 | Revision log | 292 cell-level changes of 27 Oct 2026 |
Charts in the workbook: Revenue and EBITDA by FY (bar) · Revenue mix by FY (stacked bar) · Revenue and cost per governed action (line) · Closing cash Oct 2026 – Mar 2031 (line).

### B2. Price book (Assumptions rows 7–23) — complete
| Item | Price (Rs) | Unit | US$ @90 |
|---|---|---|---|
| Platform floor, **L1 Guarded** | 1,80,000 | per tenant per year | 2,000 |
| Platform floor, **L2 Attested** | 6,00,000 | per tenant per year | 6,667 |
| Platform floor, **L3 Proven** | 24,00,000 | per tenant per year | 26,667 |
| **Sovereign / on-premises** deployment | 1,20,00,000 (₹1.2 cr) | per deployment per year | 133,333 |
| Included governed actions, L1 | 4,80,000 actions | per tenant per year (= 40,000/month) | — |
| Included governed actions, L2 | 15,00,000 actions | per tenant per year (= 125,000/month) | — |
| Included governed actions, L3 | 42,00,000 actions | per tenant per year (= 350,000/month) | — |
| Governed action beyond allowance, L1 | 1.60 | Rs per action | 0.0178 |
| Governed action beyond allowance, L2 | 1.20 | Rs per action | 0.0133 |
| Governed action beyond allowance, L3 | 0.90 | Rs per action | 0.0100 |
| Governed action, sovereign deployment | 0.55 | Rs per action | 0.0061 |
| Governed action, internal transfer to rung1 | 0.40 | Rs per action (from 1 Jan 2027; refusals ₹0; reset quarterly against cost) | 0.0044 |
| Regulatory pack (blended) | 1,35,000 | per tenant per year | 1,500 |
| Evidence bundle beyond allowance | 2,500 | Rs each (export free within allowance) | 27.78 |
| Verifier profile | 3,00,000 | per regime per year | 3,333 |
| Counterparty verification seat | 45,000 | per year | 500 |
| Partner certification | 1,50,000 | per firm per year | 1,667 |
| **Refusals** | **0** | metered at quantity 0, never billed | 0 |
| Offline verifier | 0 | never priced, to anyone | 0 |
| Governance layer add-on (NEW, switch OFF) | 90,000 | per paying tenant per year (half the L1 floor) | 1,000 |
| Reads (NEW, scenario only, switch OFF) | 0.10 | per allowed read, 50% of reads billed; read:write 2 | 0.0011 |

Pricing rules: no per-seat and no outcome pricing; nobody may discount the platform floor, the meter basis or the price of a refusal; no discount on the L2 evidence line; refusal rate published monthly beside cost per governed action; meter basis from declared blast radius (per record / counterparty / batch / tenant / crossing), never configurable per customer.

**Channel ("CA") pricing**: the model's channel is certified partner firms (chartered-accountant and advisory firms are the implied route — ledger1 is bought "on the CA's advice"; regulator route-in via "CA institutes"). Terms: **partners keep 18% of list on partner-sourced revenue** (contra-revenue line); partner-sourced share of external revenue ramps 0% (Nov 2027) → 2% (Dec 2027) → 18% (Sep 2028) → 33% (Sep 2029) → 38% (Mar 2030) → **45% (Mar 2031)**; **partner certification ₹1,50,000 per firm per year**; certified partner firms 2 (Dec 2027) → 6 (Mar 2028) → 28 (Mar 2029) → 70 (Mar 2030) → **140 (Mar 2031)**. No separate CA-specific price list exists.

Competitive price anchors (Unit economics): Salesforce Agentforce US$0.10 per action (≈ Rs 9.00 at Rs 90); Microsoft Agent 365 US$15 per user per month (per-seat, not comparable); Elan1 Govern blended realised rate FY2030-31 Rs 0.9244 (US$0.0103).

### B3. Demand drivers
- Tenant ramp anchors: first external paying tenant **July 2027 (3)**; 39 by Mar 2028; 148 by Mar 2029; 312 by Mar 2030; **545 by Mar 2031**.
- Assurance mix: L1 only until Apr 2028; L2 GA Apr 2028 ramps to 36–39% of tenants; L3 entry Oct 2029 reaching ~10%. (Gate calendar text says L2 28% by Mar 2030 — flagged inconsistency; Assumptions gives 35.3%.)
- **External governed actions per tenant per month: L1 72,000 · L2 300,000 · L3 1,250,000**, each +8% p.a.
- Internal (rung1) governed actions per month: 60,000 (Jan 2027) → 180,000 (Mar 2027) → 420,000 (Jun 2027) → 2.2M (Mar 2028) → 7M (Mar 2029) → 16M (Mar 2030) → 30M (Mar 2031).
- Pack attach per tenant: 0.22 (Oct 2027) → 0.40 (Mar 2028) → 0.62 (Sep 2028) → 0.80 (Mar 2029) → 1.12 (Mar 2030) → 1.32 (Mar 2031).
- Cost per governed action (stack1 cost + 15%): **Rs 0.092 (Oct 2026) → Rs 0.052 (from Apr 2030)**.
- Governance-layer attach (overlay): 5% FY28, 10% FY29, 15% FY30, 20% FY31.

Year-end customer split:
| | FY2027-28 | FY2028-29 | FY2029-30 | FY2030-31 |
|---|---|---|---|---|
| L1 Guarded tenants | 39 | 109 | 186 | 279 |
| L2 Attested tenants | 0 | 39 | 110 | 211 |
| L3 Proven tenants | 0 | 0 | 16 | 55 |
| **Paying tenants** | **39** | **148** | **312** | **545** |
| Sovereign deployments | 0 | 0 | 4 | 11 |
| Certified partner firms | 6 | 28 | 70 | 140 |

### B4. P&L, ARR and cash (Rs crore; US$ m in brackets)
| | FY2026-27 | FY2027-28 | FY2028-29 | FY2029-30 | FY2030-31 |
|---|---|---|---|---|---|
| Revenue | 0.0144 | 1.89 | 18.08 (2.01) | 81.18 (9.02) | **230.32 (25.59)** |
| Cost of revenue | 0.11 | 1.68 | 6.84 | 16.57 | 32.25 |
| Gross margin % | n/m | 11.4% | 62.2% | 79.6% | **86.0%** |
| Opex | 4.39 | 26.94 | 61.98 | 111.09 | 175.50 |
| EBITDA | −4.48 | −26.73 | −50.73 | −46.48 | **+22.58 (2.51)** |
| EBITDA margin | n/m | −1414% | −281% | −57% | 9.8% |
| ESOP (non-cash) | 0.33 | 2.28 | 5.24 | 8.70 | 12.39 |
| EBIT | −4.82 | −29.01 | −55.97 | −55.19 | 10.18 |
| **Exit ARR** | 0.09 | 5.02 | 33.68 (3.74) | 133.04 (14.78) | **334.23 (37.14)** |
| Closing cash | 66.44 | 38.67 | 55.23 | 38.41 | 30.41 |
| Funding in year | 71 | 0 | 72 | 45 | 0 |
| Capex | 0.07 | 0.45 | 0.73 | 1.02 | 1.27 |
| Headcount (year end) | 27 | 95 | 170 | 243 | 305 |
Plan totals: revenue Rs 331.48 cr; cumulative EBITDA −105.85 cr; EBITDA positive from **Jul/Aug 2030** (first positive month Aug 2030); peak monthly burn Rs 6.66 cr (Jul 2029); minimum cash **Rs 4.45 cr in Feb 2027**.

Revenue by line (Rs crore):
| Line | FY27-28 | FY28-29 | FY29-30 | FY30-31 | Plan total | FY31 mix |
|---|---|---|---|---|---|---|
| Platform licence | 0.25 | 2.37 | 9.05 | 23.55 | 35.22 | 10.2% |
| Governed actions — external | 1.05 | 11.96 | 58.70 | 176.98 | 248.70 | 76.8% |
| Governed actions — internal (rung1) | 0.52 | 2.18 | 5.58 | 11.20 | 19.50 | 4.9% |
| Evidence SKU | 0 | 1.09 | 6.32 | 17.84 | 25.25 | 7.7% |
| Regulatory packs | 0.06 | 0.83 | 3.24 | 7.63 | 11.75 | 3.3% |
| Sovereign deployments | 0 | 0 | 2.46 | 9.46 | 11.92 | 4.1% |
| Partner certification | 0.02 | 0.26 | 0.75 | 1.69 | 2.72 | 0.7% |
| Channel margin (contra) | −0.01 | −0.61 | −4.93 | −18.04 | −23.58 | −7.8% |
| **Total** | 1.89 | 18.08 | 81.18 | 230.32 | 331.48 | 100% |

Quarterly arc (revenue / exit ARR / tenants): Q4 FY27 0.01/0.09/0 · Q1 FY28 0.04/0.20/0 · Q2 0.22/1.24/9 · Q3 0.56/2.77/21 · Q4 1.06/5.02/39 · Q1 FY29 2.05/9.60/59 · Q2 3.34/15.35/84 · Q3 5.16/23.42/114 · Q4 7.53/33.68/148 · Q1 FY30 10.74/48.14/186 · Q2 16.76/74.79/226 · Q3 23.11/101.69/268 · Q4 30.57/133.04/312 · Q1 FY31 39.35/169.65/362 · Q2 50.01/215.79/416 · Q3 62.88/269.98/476 · Q4 78.08/334.23/545.

Cost of revenue lines: runtime and infrastructure (stack1 cost + 15%) 0.65 → 3.94 → 11.48 → 24.90; timestamp anchoring (two authorities) 0.07 → 0.15 → 0.29 (from FY29); delivery and customer success 1.02 → 2.82 → 4.94 → 7.06. Opex lines FY31: people 105.6, sales and marketing programmes 35.4, contingency (5.5%) 9.1, facilities/IT/G&A 9.0, international expansion 4.9, R&D tooling 3.5, certification and audit 2.4 (budget FY28 0.66, FY29 1.44, FY30 1.82, FY31 2.38), legal/IP 2.3, insurance 2.2, standards and regulator affairs 1.1.

### B5. Unit economics (the governed action)
| | FY27 | FY28 | FY29 | FY30 | FY31 | Plan |
|---|---|---|---|---|---|---|
| Governed actions — internal (m) | 0.36 | 13.04 | 54.6 | 139.5 | 280 | 487.5 |
| Governed actions — external (m) | 0 | 13.29 | 147.79 | 746.09 | 2,211.46 | 3,118.62 |
| **Total (m)** | 0.36 | 26.33 | 202.39 | 885.59 | **2,491.46** | 3,606.12 |
| Revenue per action (Rs) | 0.40 | 0.718 | 0.893 | 0.917 | **0.924** | 0.919 |
| Cost per action (Rs) | 3.04 | 0.636 | 0.338 | 0.187 | **0.129** | 0.159 |
| Contribution per action (Rs) | −2.64 | 0.082 | 0.556 | 0.730 | **0.795** | 0.760 |
| Gross margin | n/m | 11% | 62% | 80% | 86% | 83% |
| Revenue per head (Rs lakh) | — | — | 10.63 | 33.41 | 75.51 | |
| ARR per paying tenant (Rs lakh) | — | — | 22.76 | 42.64 | 61.33 | |
FY2030-31 Q4 run-rate: 840.76 m governed actions per quarter (~280 m/month).

### B6. Funding, tranches and gates
- **Series A Rs 180 crore / US$20 m in three tranches against gates**: T1 **Rs 63.0 cr (US$7 m) close Mar 2027** · T2 **Rs 72.0 cr (US$8 m) Gate A Oct 2028** · T3 **Rs 45.0 cr (US$5 m) Gate B Jul 2029**. Preceded by founder and angel bridge **Rs 8.0 cr Oct 2026** (not part of the 180). Total into plan Rs 188 cr. Term sheet 28 Feb 2027 (Fig 30).
- Gate A tests: evidence of L2 GA, the pack programme and the tenant ramp (closing cash floor ~Rs 14.13 cr Sep 2028). Gate B tests: L3 entry readiness, sovereign pipeline, unit economics. "A missed gate defers the tranche; it does not resize it." Gates are tested on shipped evidence, never forecast.
- Gate calendar: Mar 2027 T1 · Q2 CY2027 L1 GA (external billing on) · Jul 2027 first paying tenant · Oct 2027 ledger1 · Apr 2028 L2 GA + invoice1 · Oct 2028 collect1 + Gate A · Apr 2029 price escalation · Jul 2029 Gate B + first sovereign · Oct 2029 L3 entry · Mar 2031 plan end (exit ARR Rs 334.2 cr, cash Rs 30.4 cr, 545 tenants, 305 people).
- **Use of funds** (no explicit use-of-funds table in the workbook; derived from plan totals Oct 2026 – Mar 2031): cash people cost Rs 263.2 cr (opex people 247.3 + delivery 15.9) — the dominant use; sales and marketing programmes 55.7; runtime/infrastructure COGS 41.0; contingency 19.8; facilities/IT/G&A 19.6; R&D tooling 9.3; international expansion 7.9; legal/IP 7.4; certification/audit 6.3; insurance 3.6; standards/regulator affairs 3.0; anchoring 0.5; capex 3.5; working capital build 48.2. Funded by Rs 188 cr in + Rs 331.5 cr revenue; closing cash Rs 30.4 cr.

### B7. People
Ten functions with fully loaded bands (Rs lakh/yr) and Mar 2027 → Mar 2031 headcount: Kernel engineering 34 (7 → 38) · Evidence and cryptography 38 (3 → 26) · Pack and regulatory engineering 30 (2 → 50) · Platform and SRE 30 (3 → 27) · Security, compliance, certification 32 (2 → 21) · Product and design 28 (2 → 16) · Solutions and field engineering 26 (2 → 40) · Go to market and partners 27 (3 → 50) · Standards, policy, regulator affairs 36 (1 → 13) · Finance, legal and operations 24 (2 → 24). Total 11 (Oct 2026) → 27 → 95 → 170 → 243 → 305. Salary escalation 8% p.a.; ESOP 11% of cash people cost; DSO 55 days; capex Rs 60,000/month + Rs 3,200/head + Rs 14 lakh fit-out each April; contingency 5.5%.

### B8. Scenarios
| | Base | Downside | Upside |
|---|---|---|---|
| Drivers | as modelled | tenants 58%, price 82%, unit cost 122%, six-month slip | tenants 138%, price 110%, unit cost 92%, no slip |
| FY2030-31 revenue | 230.3 | 75.4 | 343.8 |
| Cumulative EBITDA | −105.8 | −319.5 | +45.2 |
| Closing cash Mar 2031 | 30.4 | −157.9 | 156.4 |
| Exit ARR Mar 2031 | 334.2 | 111.9 | 499.9 |
Govern sensitivities (top model risk = runtime cost of governing reads, unmeasured): reads 2× volume at 0.5× cost → FY31 GM 80.4%, EBITDA 9.6, cash 10.9; stress 2× at 1× → GM 74.8%, EBITDA −3.3, cash −8.7; reads billed at Rs 0.10 for half → FY31 revenue 252.4, EBITDA 31.7, cash 42.0; governance layer on → FY31 revenue +0.77 cr.

### B9. Govern build status (audit of commit 22388ad — useful for "what's live" badges)
BUILT: guard (allow/ask/refuse, default refuse, strictest wins); MCP/REST/TS+Python SDK; signed hash-chained receipt for every call (reads included); hourly signed checkpoints; rulebooks (YAML, risk tags, quotas, try, test on past actions, versions, sign/publish, suggestions); connectors (Gmail, Zoho Books, any MCP server, SSRF guard); auditor pack + compliance map; assessments; 10 frameworks/13 controls/7 industry packs; sign-in argon2id, TOTP, lockout, OIDC, 5 roles, signed webhooks, key rotation; tenant isolation (app-level).
BUILT (PARTIAL): fail closed (allowed MCP action runs before receipt); offline verifier (trusts bundle key; 3 exit codes); approvals (password re-asked only after 10 min); AI inventory (no model field); alerts/auto-pause/emergency stop (auto-pause off by default); onboarding (no currency/time-zone inputs).
NOT BUILT: **metering, billing, plans, invoices**; assurance levels L1–L3; RFC 3161 anchoring; verifier profiles; Seal v6 second implementation; KMS/HSM; erasure; data residency; idempotency keys; selective disclosure, earned autonomy, in-process enforcement, closed refusal register; production deployment, customers, telemetry, certification. Code: ~33,567 lines, 400 files, 47 commits over ~15.5 hours; tests reported 397/398 passing.

---

## Part C — Realistic seed numbers for the demo console, pricing page and billing meter

All values traceable to the sources; demo org name from the code's seed data.

### C1. Demo organisation and console
- Organisation: **Demo Traders Pvt Ltd** (industry pack: finance and accounting; regions India; frameworks on: DPDP Act 2023, RBI FREE-AI, ISO/IEC 42001, NIST AI RMF, EU AI Act, GDPR). Org key fingerprint **`17f410d32e400e2d`**. Time zone Asia/Kolkata; nightly suggestions at **02:00 IST**.
- Roles: Owner, Admin, Approver, Viewer, Auditor; approver groups e.g. `finance`.
- Agents (examples consistent with the docs): `ar-agent` (accounts receivable, autonomy A2 Propose in spec terms), a payments agent (moves_money), a Gmail outreach agent (sends_external), a support agent. Each: owner, risk level, hashed API keys, one rulebook, pause switch.
- Rule examples: `pay-large` — tag `moves_money`, `when amount gt 50000` → ask, approver `finance`; refuse `deletes`; ask on `changes_access`.
- Activity volumes for a single L1 tenant at plan: **72,000 external governed actions per month** (~2,400/day, ~100/hour); L2 tenant 300,000/month (~10,000/day); L3 1,250,000/month (~41,700/day). Rate limit 300 requests/min per API key.
- Small demo chain (matches auditor-pack output): **31 receipts, 2 signed checkpoints**; receipts 41/42/43 for the chain visual (decision allow → decision ask/pending → approval approved via slack); hourly checkpoints.
- Spec-era sequence numbers for storytelling: seq **4,097** committed, **4,098** refused (`GATE.PRECONDITION_FAILED`), **4,099** escalated, **4,100** approved, **4,101** committed; sales invoice **₹2,40,000**, credit limit **₹3,00,000**, approver **Venkat**, policy version **11**, declaration `erp.ar v7`, dual control above **₹2 lakh**.
- Approvals: default expiry **24 h** (max 30 days), checked every minute; agent long-poll up to **30 s**; password re-ask if sign-in > **10 min**; Slack signature window **5 min**.
- Test on past actions (rulebook page): "Of **412** calls, **12** more would be refused, **30** more would ask a person and **5** fewer would ask a person. **3** could not be judged." Replay window 7 or 30 days; up to 200 changed calls listed.
- Suggestion card: raise no-approval limit **₹50,000 → ₹1,00,000**; **41** payments approved over 30 days to **6** vendors, none rejected. Thresholds: ≥10 approvals, ≥7 days, latest within 14 days.
- Alerts: six detectors; 14-day baseline; 90-day new-counterparty window; 7-day learning period; scans every 5 minutes. Emergency stop: type **STOP**; red banner; incident report PDF covering one hour before stop to resume.
- Compliance coverage tiles: **ISO 42001 46% (7/15) · NIST AI RMF 63% (7/11) · DPDP 11% (1/9) · RBI FREE-AI 66% (4/6) · EU AI Act 25% (4/16) · GDPR 30% (3/10)**; HIPAA, SOC 2, Colorado AI Act, NYC LL 144 available but off; 13 controls GATE-01…GATE-13; badge "Draft — needs legal review".
- Inventory stages: proposed → in review → approved → live → retired; assessment review cadence 6/12/24 months (high/medium/low).
- Status/SLO cards (targets, label as targets): governed write p50 ≤ 120 ms, p99 ≤ 450 ms; receipt write p50 ≤ 40 ms; offline verify 10k receipts ≤ 5 s; availability 99.5%/month; kernel total ≈ 64 ms p50 (unverified).
- Anchoring banner (L2 preview only): "Anchoring degraded since 09:14 — 88 records unanchored".

### C2. Pricing page (list prices; flat to Mar 2029, +4% p.a. after)
| Plan | Platform floor / yr | Included governed actions / yr (per month) | Beyond allowance | Positioning |
|---|---|---|---|---|
| **L1 Guarded** | ₹1,80,000 (US$2,000) | 4,80,000 (40,000) | ₹1.60 (US$0.0178) | "Can I let this run?" — available first (GA Q2 CY2027 target) |
| **L2 Attested** | ₹6,00,000 (US$6,667) | 15,00,000 (125,000) | ₹1.20 (US$0.0133) | "Can I hand this over?" — target Apr 2028 |
| **L3 Proven** | ₹24,00,000 (US$26,667) | 42,00,000 (350,000) | ₹0.90 (US$0.0100) | "Does this survive the vendor?" — target Oct 2029 |
| **Sovereign / on-prem** | ₹1.2 crore (US$133,333) per deployment | — | ₹0.55 (US$0.0061) | Customer/government boundary |
Add-ons: Regulatory pack ₹1,35,000/tenant/yr (ledger1, invoice1, collect1) · Verifier profile ₹3,00,000/regime/yr · Evidence bundle beyond allowance ₹2,500 each · Counterparty verification seat ₹45,000/yr · Partner certification ₹1,50,000/firm/yr · Governance layer (inventory, assessments, frameworks) ₹90,000/tenant/yr (modelled, not in base). Always free: **refusals (₹0)**, the offline verifier, bundle export within allowance. Pricing principles copy: "We price governed actions, not seats." "Refusals are never billed." "No outcome pricing." "We publish our refusal rate beside cost per action every month." Anchor comparison: Agentforce US$0.10/action ≈ ₹9.00 vs Govern L1 overage ₹1.60.

### C3. Billing / meter screen (one L1 tenant, one reconciled month — derived from the price book)
- Platform floor: ₹1,80,000/yr → **₹15,000/month** (not discountable).
- Governed actions this month: **72,000** (plan per-tenant L1 volume) → in allowance **40,000** (cumulative annual allowance 4,80,000), beyond **32,000 × ₹1.60 = ₹51,200**.
- Refused: **412 — ₹0** (count shown on the invoice; illustrative from Fig 28).
- Pack line (ledger1): ₹1,35,000/yr → **₹11,250/month**.
- Evidence line: ₹0 at L1 (L2 onward).
- **Month total ≈ ₹77,450** (₹66,200 without pack); annualised ≈ ₹7.94 lakh without pack (plan ARR per tenant FY29 ₹22.76 lakh blends L2 and internal volume).
- Meter event row fields: `event_id`, `write_id`, `seq`, `basis` (per record/counterparty/batch/tenant/crossing), `quantity` (1 committed / 0 refused), `outcome` (committed/refused/escalated), `at`. "Show the records behind this line" → events by write_id and seq.
- Reconciliation status: nightly two-way; kernel vs credit ledger 0 tolerance; runtime vs component counters 0.5%; discrepancy holds the invoice.
- L2 tenant month (for a second demo tenant): floor ₹50,000 + 300,000 actions (125,000 included, 175,000 × ₹1.20 = ₹2,10,000) = **₹2,60,000/month**. L3: floor ₹2,00,000 + 1,250,000 actions (350,000 included, 900,000 × ₹0.90 = ₹8,10,000) = **₹10,10,000/month**.
- Unit-economics widgets: revenue per action ₹0.924 vs cost ₹0.129 (FY31); cost per action falling ₹0.092 → ₹0.052 (runtime unit cost); gross margin 86% FY31.

### C4. Investor / public metrics strip (modelled — label as plan, not actuals)
Exit ARR ₹5.0 cr (Mar 2028) → ₹33.7 cr → ₹133.0 cr → **₹334.2 cr / US$37.1 m (Mar 2031)** · paying tenants 39 → 148 → 312 → **545** · governed actions FY31 **2.49 billion** · gross margin **86%** · EBITDA positive from mid-2030; FY31 EBITDA ₹22.6 cr · headcount 305 · certified partner firms 140 · sovereign deployments 11 · Series A ₹180 cr / US$20 m in three gated tranches (₹63 / ₹72 / ₹45 cr).

### C5. Caveats to carry into the UI
1. Billing/meter, plans and assurance levels are designed screens with no code behind them (Fig 40, Govern build status) — show as "preview" or behind a flag.
2. Only the MCP Governed run enforces; label SDK/REST "advisory" everywhere.
3. Every compliance surface carries "Draft — needs legal review".
4. Banned words in product copy: tamper-proof, immutable, court-ready, regulator-approved, "we block/prevent" (for the advisory path), "standardised".
5. All financial figures are modelled plan values from the 22 Sep 2026 engine (revised 27 Oct 2026); no customer, deployment or certification exists yet.
6. Inconsistency flagged in the workbook: L2 mix "28% by Mar 2030" (Gate calendar) vs 35.3% (Assumptions).
