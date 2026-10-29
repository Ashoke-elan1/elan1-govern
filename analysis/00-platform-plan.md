# Elan1 Govern — front-end platform plan

Draft for approval · 27 October 2026 · Front end only (React). Every backend call is served by a typed mock service layer that a real API replaces later without touching screens.

Sources: the five digests in this folder (01 information memorandum, 02 technology memorandum, 03 architecture atlas and financial model, 04 competitor analysis with 42 screenshots, 05 enterprise UX benchmark) and the elan1 Brand Book v1.0.

---

## 1. What the documents say, in one page

**The product.** Elan1 Govern sits between an AI agent and the tools it calls. Before a tool runs it checks a signed rulebook and answers **Allow · Ask a person · Refuse** — anything not explicitly allowed is refused. On the MCP route it holds the tool's credentials, so the agent cannot go round it (*governed run*); on the REST/SDK route it advises and records (*check and record*). Every decision, approval and outcome becomes a **signed, hash-chained receipt**; hourly signed checkpoints seal the chain head; an auditor pack can be checked offline with `govern verify`. A governance layer adds an AI inventory, assessments with second-person sign-off, and a 10-framework compliance library whose coverage is counted from receipts.

**The one idea that connects every screen.**

```
AI system (inventory) → assessment (risk tier) → agent → rulebook rule → decision → approval → receipt → checkpoint → auditor pack → verified offline
                                                                                         ↘ framework control coverage (counted from receipts)
```

Every object in the console links forwards and backwards along this chain. That is the "connecting dots" principle, and it is what no competitor shows: they hold logs; Elan1 Govern holds proof.

**What is true today (and the UI must not overclaim).** Built: the guard, rulebooks, approvals on 5 channels, receipts, checkpoints, auditor pack, offline verifier, connectors, governance layer, alerts, emergency stop, SSO, roles. Not built: metering and billing, assurance levels L2/L3, anchoring, key custody in KMS, regulatory packs (ledger1, invoice1, collect1). Those screens will be designed and fully navigable, but carry a clear **Planned** marker.

**Where we beat the field** (from the 21-vendor analysis):

| Gap in the market | What Elan1 Govern shows |
|---|---|
| Nobody shows a real approver inbox | A full approval workspace: the rule that asked, argument diff, expiry, delegation, mobile, Slack/WhatsApp — and each approval is itself a receipt |
| Evidence is shown as logs, never as proof | Chain status bar, "Verify" on every object, in-browser verifier that genuinely checks signatures |
| No offline verification, no multi-client auditor view | Auditor workspace across client organisations; offline verify walkthrough |
| Refusals discarded | Refusals are first-class evidence with analytics by rule, default, unknown tool, expiry |
| Governance and runtime are separate products | One chain from inventory to receipt; coverage from receipts, not questionnaires |
| DPDP and RBI FREE-AI ignored | Both in the framework library, with a crosswalk |
| "Book a demo" pricing | Open per-action pricing and a live demo tenant |

---

## 2. People, the question each asks, and the outcome they get

| Persona | Role in console | Their question | Outcome the platform must deliver |
|---|---|---|---|
| Operator — COO, finance controller, process owner | Owner / Admin | Which processes can run unattended, without doing something I cannot undo? | Today view of what ran, what waited, what was refused; one-click pause and emergency stop |
| Approver — the named person | Approver | What exactly am I committing, and why was it held? | Decide in under 30 seconds on any device, with full context, and a receipt naming them |
| Builder — CIO, platform engineer, developer | Admin | How much do we build and keep? | Agent connected over MCP in 3 steps; rulebook tested on past traffic before publishing |
| Assurance — CISO, risk, internal audit | Viewer / Auditor | What stops an agent doing something irreversible, and can I prove it? | Coverage counted from receipts; auditor pack; offline verification |
| External auditor / CA firm | Auditor (multi-org) | Can I verify this without trusting the vendor? | Read-only workspace across clients; sample, verify, export working papers |
| CFO — economic buyer | Owner | Is the vendor paid to say no? | Transparent meter: actions, approvals, refusals and their price on every invoice |

---

## 3. Surfaces and screens

Four products in one React app, sharing one design system.

### A. Public site (marketing and trust)
1. Home — "Governed agentic applications for the work that commits your business"; the decision path as an interactive diagram; the three pillars in brand order
2. How it works — the 8-step decision path (Atlas fig 34) as an animated, steppable diagram; governed run vs check and record
3. Product tour — Approvals, Rulebooks, Evidence, Governance layer, Alerts and stop (each a short page with real console screenshots of our build)
4. Assurance levels — L1 Guarded / L2 Attested / L3 Proven ladder (L2/L3 marked Planned)
5. Solutions — 7 industry configurations (finance, healthcare, HR, support, sales, engineering, general) — described, not named, per brand rules
6. Obligations — EU AI Act, NIST AI RMF, ISO 42001, DPDP, RBI FREE-AI, GDPR, HIPAA, SOC 2, Colorado, NYC LL 144 — receipt-field-to-clause mapping table, "Draft — needs legal review"
7. Pricing — plans, per-action rate, **refused action at 40% of the per-action rate**, add-ons, cost calculator, INR with USD view
8. Compare — honest comparison by category (documentation platforms, agent gateways, single-vendor control towers), scored by the memorandum's rule: shipped capability only
9. Trust centre — security posture as built, known limits (stated plainly, as the brand requires), sub-processors, status
10. Status page — services plus chain integrity as its own component
11. 90-day pilot — the day-0 to day-85 plan
12. Book a working session; Glossary; Refusal codes register; Action receipt format; Legal (terms, privacy, DPA)

### B. Public verifier — `/verify`
Drop a receipt or auditor pack, or paste a receipt; verification runs **in the browser** (real Ed25519 and SHA-256 via a small crypto library). Three-valued result: Verified · Failed at seq N · Cannot verify — with the 5-line checklist (signature, key valid when signed, content hash, previous-hash link, checkpoint inclusion). Includes a deliberately tampered sample. "Nothing was sent to Elan1 Govern."

### C. Developer portal — `/developers`
Quickstart (first governed call in 5 minutes) · MCP guide · REST API reference (`/v1/check`, `/v1/record`, `/v1/approvals/{id}`, `/mcp`, `/healthz`) with try-it panel against the mock · TypeScript and Python SDKs · Rulebook YAML reference (conditions, quotas, risk tags) · Webhooks (event catalogue, signature verification) · `govern` CLI · Examples for Claude, Cursor, LangChain, OpenAI Agents SDK · Errors and refusal ids · Versioning and changelog · Sandbox keys.

### D. Console — the product
Navigation groups (proposed): **Govern** (Today, Approvals, Agents, Rulebooks, Connectors) · **Prove** (Activity, Evidence, Compliance, Inventory, Assessments) · **Respond** (Alerts, Incidents) · **Account** (Billing and meter, Assurance, Settings). The emergency stop is always visible in the top bar.

| Area | Screens |
|---|---|
| Sign-in | Login (password, TOTP, SSO), signup, forgot/reset password, invite accept, **demo accounts panel** |
| Onboarding | Company → industry configuration → regions → currency and time zone → connect first agent → checklist that completes from real events |
| Today | Decisions today (allowed / held / refused), waiting approvals with due times, alerts, chain status, coverage snapshot, onboarding checklist, live feed |
| Approvals | Inbox (keyboard J/K, A, R), approval detail (headline sentence, why held, what happens if approved, argument diff, similar past decisions, expiry countdown, channel), history, mobile approve-by-link page, backup approver re-routing, "approve and draft a rule" |
| Activity | Receipt log with filters and shared time range, live tail, receipt detail (decision trace through the 8 steps, signed receipt JSON, chain neighbours, rule version, raw request), chain explorer |
| Agents | Registry, add-agent 3-step wizard (details → rulebook → MCP address and key for Claude / Cursor / LangChain / OpenAI), agent detail (keys, rulebook, behaviour baseline, receipts, pause), agent map (people → agents → tools → systems, coloured by decision) |
| Rulebooks | List, editor with visual builder ↔ YAML (CodeMirror), Try an action, Test on past actions (7/30 days, semantic diff "12 more refused, 30 more ask"), versions and diff, dual control, sign and publish, rule suggestions |
| Connectors | Gmail, Zoho Books, Your MCP servers (add upstream, sync tools, risk tags, switch tools on), credential custody ("the agent never sees the secret") |
| Evidence | Chain status, checkpoints, auditor pack export (preview counts before generation), offline verify walkthrough, signing keys and rotation |
| Inventory | AI systems register, AI system detail (lifecycle, owner, linked agent, risk tier set only by assessment) |
| Assessments | Risk triage, impact, data protection templates; scoring explained; second-person sign-off |
| Compliance | 10 frameworks, framework detail (requirements → controls GATE-01…13 → receipt evidence), crosswalk matrix, report export; "Draft — needs legal review" everywhere |
| Alerts | 6 detectors, alert detail, detector settings, auto-pause (off by default) |
| Incidents | Emergency stop flow (scope, live effect preview, reason, type STOP), persistent banner, guided resume, incident record and report |
| Billing and meter *(Planned)* | Plan, usage meter (actions, approvals, refusals), invoices with refused line at 40%, cost forecast |
| Assurance *(Planned)* | L1 → L2 → L3 ladder, what each level proves, upgrade wizard |
| Auditor workspace | Client organisation switcher, sample receipts, verify, working papers export |
| Settings | Organisation, members and roles (permission matrix), SSO (OIDC, DNS verification), notifications and channels (Slack, WhatsApp, email), webhooks with delivery log, API keys, signing keys, sessions, preferences, replay store, data retention |
| Ask Govern | Side panel that explains a receipt, refusal or rule in plain words — labelled as an explainer that never makes decisions (no model sits on the decision path) |
| System | 403, 404, maintenance, offline, "approvals unavailable", error boundary |

Approximate total: **~115 distinct screens and states**, every one reachable and populated with realistic data.

---

## 4. Journeys we will make walkable end to end

1. **First governed call** — signup → onboarding → add agent → copy MCP address → simulated first call arrives → checklist ticks "Your first decision arrived".
2. **A held payment** — an agent tries to pay ₹2,40,000 → rule `pay-large` asks finance → Approver is notified in the inbox and on WhatsApp → approves on mobile → action runs → two receipts appear on the chain.
3. **Tighten a rulebook safely** — accept a rule suggestion → edit in the visual builder → test on 30 days of past actions → see the semantic diff → second person reviews → sign and publish.
4. **Something goes wrong** — refusal-surge alert → investigate in Activity → emergency stop (type STOP) → banner everywhere → incident record → guided resume.
5. **The audit** — Auditor signs in → switches to client organisation → samples receipts → exports auditor pack → verifies in `/verify` → sees the tampered sample fail at a named sequence number.
6. **Governance chain** — register an AI system → impact assessment → second-person sign-off sets the risk tier → link agent → framework coverage rises as receipts arrive.
7. **The CFO view** — Billing and meter → actions, approvals and refusals priced → invoice drill-down to receipts.

---

## 5. Demo accounts (the "creds")

Front end only, so sign-in is mocked in the browser. One account per role, all in the demo organisation **Demo Traders Pvt Ltd**, plus two further client organisations for the Auditor:

| Role | Can do |
|---|---|
| Owner | Everything, including emergency stop, signing keys, billing |
| Admin | Agents, rulebooks, connectors, members, settings; emergency stop |
| Approver | Approvals inbox and decisions; read Activity |
| Viewer | Read-only across the console |
| Auditor | Read-only, switches between client organisations, exports auditor packs |

Credentials are stored in `src/mock/users.ts` and shown on a "Demo accounts" panel on the sign-in page (one click fills the form). They are not real secrets and are labelled as demo.

---

## 6. Pricing, with your correction

Refused actions cost **40% of the per-action rate** (the documents said ₹0; your correction overrides that everywhere).

| Plan | Platform floor / year | Included actions / year | Each action beyond | Each refused action (40%) |
|---|---|---|---|---|
| L1 Guarded | ₹1,80,000 | 4,80,000 | ₹1.60 | ₹0.64 |
| L2 Attested *(Planned)* | ₹6,00,000 | 15,00,000 | ₹1.20 | ₹0.48 |
| L3 Proven *(Planned)* | ₹24,00,000 | 42,00,000 | ₹0.90 | ₹0.36 |
| Sovereign | ₹1.2 crore / deployment | — | ₹0.55 | ₹0.22 |

**Assumption to confirm:** inside the included allowance, a refusal uses 0.4 of an included action; beyond the allowance it is billed at 40% of the overage rate. Add-ons: regulatory pack ₹1,35,000, verifier profile ₹3,00,000, extra evidence bundle ₹2,500, counterparty seat ₹45,000. No per-seat pricing. INR first with a US$ view at ₹90.

---

## 7. Design system — elan1 brand, made accessible

- **Colour:** Ink #0A1320 for text and dark grounds, Paper #FBFAF7 ground, Bone #F2EDE6 alternate, Clay #B9603F as the single accent per surface (active nav rule, the brand disc, one chart highlight). Status uses only the functional palette — Verdigris approved, Amber held, Crimson refused, Cobalt in progress — always with an icon and label.
- **Accessibility fixes (within the palette):** Clay on paper is 4.18:1, which fails for body text, so primary buttons are Ink with Paper text, and accent text uses Kiln (6.96:1). Amber text uses a darker step #7D5F17 (5.71:1). Dark mode uses lighter tints of the functional colours. All WCAG 2.2 AA.
- **Type:** Schibsted Grotesk for headings, IBM Plex Sans for UI with tabular figures in tables, IBM Plex Mono for hashes and YAML. Labels uppercase and letter-spaced. Sentence case. British English. Indian digit grouping (₹1,80,000).
- **Shape:** no rounded corners anywhere; the disc is the only circle. 12-column grid, 8 px baseline, hairline rules, header rule and folio on long pages.
- **Disc derivations used purposefully:** The gate (approvals), Aperture (evidence/audit), Orbit (agent running / loading), Progress arc (coverage), Control plane (product diagram), Field crop (marketing heroes) — one per surface.
- **Voice:** plain, specific, answerable. "The agent drafts it. You commit it." Banned words lint-checked: revolutionary, seamless, unlock, leverage, tamper-proof, immutable, court-ready, certified, and so on. "Blocks" and "prevents" only for the MCP governed run.
- **Light and dark themes**, comfortable and compact density, full keyboard support, command palette (Ctrl/Cmd+K) that accepts receipt numbers and hash prefixes.

---

## 8. Technology (front end only)

React 18.3 · TypeScript (strict) · Vite · React Router (history routes, so approval and receipt links can be shared) · Tailwind CSS with brand tokens and zero radius · TanStack Table · Recharts · CodeMirror 6 (YAML editor and merge view) · cmdk command palette · Lucide icons · Zustand for UI state · Fontsource self-hosted fonts · @noble/ed25519 and @noble/hashes so the demo chain is **genuinely signed and hash-linked** and the verifier really verifies.

**Mock service layer:** `src/api/*` exposes the same shapes the backend will (`/v1/check`, approvals, receipts, rulebooks…), backed by seeded in-memory data with small latencies and a simulated live feed. Swapping to the real API later is a change in one folder.

**Prerequisite:** Node.js is not installed on this machine. The build needs Node.js LTS (installed with `winget install OpenJS.NodeJS.LTS`), then npm downloads the packages above.

---

## 9. How it will be built

1. **Foundation (me, sequential):** scaffold, tokens, fonts, component library (buttons, tables, status chips, drawers, dialogs, tabs, forms, code blocks, diagrams), app shell (sidebar, org/environment switcher, command palette, stop banner), routing, role permissions, demo accounts, mock API and the signed seed chain.
2. **Parallel build (workflow of about 7 agents, one owner per folder):** public site · verifier and developer portal · Today, Approvals, Activity · Agents, Connectors, Rulebooks · Evidence, Inventory, Assessments, Compliance, Auditor workspace · Alerts, Incidents, Billing, Assurance · Settings, sign-in, onboarding, system pages.
3. **Verification:** type-check and production build; walk all 7 journeys in the browser at desktop and phone width, light and dark; accessibility sweep; banned-word sweep; screenshots of every area.

Output: `E:\elan1 govern Final\elan1-govern-web\` with `npm run dev` to run it.

---

## 10. Decisions for you

1. **Approve the scope** above (public site, verifier, developer portal, full console).
2. **Install Node.js LTS** on this machine so the app can be built and run.
3. **Refusal billing rule** — confirm the 40% interpretation in section 6.
4. **Navigation model** — the grouped 13 areas proposed above (Govern · Prove · Respond · Account), or the original Four Doors (Work · Records · Agents · Assurance, never a fifth).

Defaults taken unless you say otherwise: product name written "Elan1 Govern" (the 27 October revision) and "elan1" lowercase elsewhere; Ink primary buttons and the darker amber text for accessibility; planned features (billing, L2/L3, regulatory packs) built as screens but clearly marked Planned.
