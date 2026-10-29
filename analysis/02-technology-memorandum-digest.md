# 02 — Technology Memorandum digest (front-end build edition)

Source: `elan1-govern-technology-memorandum.txt` (pdftotext -layout of the 451-page *Elan1 Govern Technology Memorandum, Revised Edition, 27 Oct 2026*; 31,273 text lines).
Purpose: everything in the memorandum that defines screens, flows, data objects, states, fields and UX/copy rules for a React front end (console, developer portal, public verifier, billing/meter and assurance screens).

**How to read the memorandum.** It has two layers:

1. **Revision Supplement (pages R-1…R-46, lines 475–3326)** — describes **what is built** (commit `22388ad`, "Elan1 Govern"). It **prevails** over the original pages wherever they conflict. This is the primary source for the console.
2. **Original memorandum (23 Sep 2026, chapters 1–23 + appendices, lines 3327–31273)** — the frozen **specification** (KernelPort, nine rungs, Declaration, Four Doors, Seal v6, L2/L3, meter). Use it for **designed / upcoming** screens (Studio, Decide diff, Proof, Meter, Assurance levels, verifier profiles, L3 portals).

Status marks used below (from the memo): **BUILT** (in code), **PARTIAL**, **SPECIFIED** (frozen spec, no code), **ABSENT**. Screen marks: **BUILT**, **NEEDS LOGIC** (= KEEP, build next), **DESIGN ONLY** (= LATER). All data in screenshots/examples is **seed/demo data** (orgs "Demo Traders Pvt Ltd", "Patel Agro Foods").

> Items the brief expected but which are **not present** in this memorandum (they must come from the design system / screen map / repo itself): the full 275-screen list by name; the public site routes `/verifier`, `/action-receipt`, `/refusal-codes`, `/trust`, `/pricing`, `/pilot`, `/developers/*` (only "planned /developers pages and a no-account /verify page" are named); the enumerated list of the 22 permissions; step-by-step contents of the 3-step Add-agent wizard and the MCP address/key screen; Studio/Decide/Meter consoles by those names beyond what's below. The memo gives totals and verdicts for the 275 screens, not their names.

---

## 1. Table of contents with line ranges

### 1.1 Front matter and Revision Supplement

| Section | Title | Lines |
|---|---|---|
| — | Cover, How to read, Conventions, colour language | 1–92 |
| — | Contents (original) and List of figures | 93–474 |
| — | Revision supplement: How to read, precedence, conventions, contents | 475–605 |
| — | What changed since 23 Sep 2026 (12-row table) | 606–678 |
| — | Supersession register | 679–757 |
| **R1** | Elan1 Govern as built — architecture, packages and stack (R1.1 two services + one DB 848; R1.2 packages 872; R1.3 stack 904; R1.4 numbers 1011) | 758–1055 |
| **R2** | The decision path and the data model (R2.1 eight steps 1145; R2.2 rungs mapped 1175; R2.3 invariants 1203; R2.4 worked example 1246; R2.5 data model 1258) | 1056–1307 |
| **R3** | Receipts, checkpoints, auditor pack, offline verify (R3.1 receipt 1388; R3.2 hash/sig/chain 1407; R3.3 auditor pack + govern verify 1432; R3.4 keys 1463; R3.5 claim 1477) | 1308–1536 |
| **R4** | Rulebooks — rules, limits, testing, suggestions, industry packs (R4.1 1546; R4.2 1561; R4.3 1589; R4.4 1685) | 1537–1709 |
| **R5** | Approvals — states, links, Slack, WhatsApp (R5.1 1715; R5.2 1810; R5.3 1822; R5.4 1849) | 1710–1887 |
| **R6** | Connectors and the MCP proxy | 1888–1934 |
| **R7** | Governance layer — inventory, assessments, frameworks, controls (R7.1 2002; R7.2 2019; R7.3 2027) | 1935–2068 |
| **R8** | Alerts, auto-pause, emergency stop (R8.1 detectors 2145; R8.2 stop 2186) | 2069–2207 |
| **R9** | Identity, roles, organisations, security (R9.1 2214; R9.2 2234; R9.3 2243) | 2208–2291 |
| **R10** | Developer surfaces and the two modes (R10.1 2297; R10.2 2328) | 2292–2372 |
| **R11** | How the built code was checked | 2373–2451 |
| **R12** | Spec-to-code crosswalk (Figure 41 + table) | 2452–2646 |
| **R13** | Vocabulary — one name per concept (R13.1 claim language 2709) | 2647–2723 |
| **R14** | One information architecture — thirteen areas (R14.1 totals 2798; R14.2 areas 2859; R14.3 no-logic screens 2912; R14.4 new screens + states 2950) | 2724–2973 |
| **R15** | Revised build plan and what remains | 2974–3039 |
| **R16** | New technical risks T23–T34 | 3040–3102 |
| **R17** | Conflicts P17–P23, register A194–A205, open items Q105–Q123 | 3103–3251 |
| — | Glossary and source additions | 3252–3320 |

### 1.2 Original memorandum (specification, 23 Sep 2026)

| Ch. | Title | Lines | Front-end relevance |
|---|---|---|---|
| 1 | Executive technical summary (1.1–1.9) | 3327–3895 | Kernel numbers, build plan |
| 2 | System context, design principles, perimeter (2.9 naming rules 4758) | 3896–4812 | Copy rules |
| 3 | Reference architecture — planes, components, repos | 4813–5959 | Low |
| 4 | Kernel contract — KernelPort, six calls, five objects (4.3 objects 6305; 4.6 refusal register 7213) | 5960–7561 | Data objects, 43-code register |
| 5 | The Right Path — nine rungs (5.8 autonomy A0–A5 8031; 5.13 end-to-end 8315) | 7562–8890 | Decision copy, endings |
| 6 | Surfaces — SDK, MCP, HTTP, two modes (6.5 MCP 9282; 6.6 HTTP 9425; 6.7 keys 9505; 6.8 sales rule 9531; 6.9 onboarding 9570) | 8891–9719 | Developer portal |
| 7 | The Declaration — seven blocks, pipeline (7.3 9805; 7.11 pipeline 11071) | 9720–11398 | Studio (L2 designed) |
| **8** | **The console and the human approval path** (8.1 Four Doors 11417; 8.2 screens 11449; 8.4 state machine 11577; 8.6 Decide 11769; 8.7 anti-rubber-stamp 11828; 8.8 channels 11877; 8.9 accessibility 11963; 8.12 front-end rec. 12080) | 11399–12167 | **Core UX spec** (superseded in parts by R5/R14) |
| 9 | Data architecture, L1 proof record | 12168–13602 | Retention, audit note |
| 10 | Seal Spec v6 — 16 fields, signatures, vectors | 13603–14613 | L2 receipt format |
| 11 | Evidence bundle, offline verifier, verifier profiles (11.2 layout 14649; 11.4 export 14840; 11.5 verifier 14928; 11.7 profiles 15288) | 14614–15709 | Evidence/verifier screens |
| 12 | Key management, custody, timestamp authorities | 15710–17056 | Key screens (L2) |
| 13 | Packs — pack factory, ledger1, invoice1, collect1 | 17057–18287 | Regulatory packs (specified) |
| 14 | Level 3 — cross-org verification, selective disclosure, earned autonomy (14.2 18485; 14.3 18916; 14.4 19240) | 18288–19781 | L3 screens (LATER) |
| 15 | Action Receipt standard, certification, regulators (15.13 lawful claims 20611) | 19782–20838 | Claim rules |
| 16 | Assurance levels and upgrade path (16.2 ladder 20901; 16.6 upgrade runbook 21427) | 20839–21877 | Assurance screens |
| 17 | Runtime and deployment | 21878–22824 | Low |
| 18 | Security, residency, DPDP, licences | 22825–23768 | Settings/security copy |
| 19 | Metering, pricing plumbing, billing (19.4 schema 23922; 19.10 price books 24452; 19.11 invoice 24533) | 23769–24900 | Meter/billing screens |
| 20 | Technology stack | 24901–25946 | Low |
| 21 | Engineering plan, phases, gates (21.3 gate calendar 26214) | 25947–27103 | Roadmap dates |
| 22 | Operations, reliability, incidents (22.3 kernel unreachable 27362) | 27104–28173 | System/"unavailable" pages |
| 23 | Technical risks, open questions, diligence | 28174–29147 | Low |
| App. A | Source conflicts | 29148–30619 | — |
| App. B | Source documents | 30620–30879 | — |
| App. C | Glossary | 30880–31273 | Vocabulary |

Figures most useful to designers: **Fig 34** decision path (1062), **35** receipts/verify (1315), **36** rulebook lifecycle (1613), **37** approval path (1737), **38** governance layer (1942), **39** alerts/stop (2075), **40** thirteen-area IA (2730), **41** crosswalk (2458), **42** topology (940); original **Fig 11** approval state machine (11591), **15** bundle/verifier (14945), **21** cross-org (18526), **23** earned autonomy (19330), **25** assurance ladder (20903).

---

## 2. Information architecture and screen inventory

### 2.1 The two IA models (conflict P23)

**Built (prevails): Thirteen areas** in console navigation order — hand-built pages (R14, Fig 40):

1 Sign-in & onboarding · 2 Today · 3 Approvals · 4 Activity · 5 Agents · 6 Rulebooks · 7 Connectors · 8 Evidence · 9 AI inventory · 10 Assessments · 11 Compliance · 12 Alerts & emergency stop · 13 Settings.
Shell nav labels as built (Fig 33): *Today · Approvals · Activity · Agents · Rulebooks · Connectors · Evidence · Inventory · Assessments · Compliance · Alerts · Settings*; organisation switcher in the shell; emergency-stop button in the shell.

**Specified (original, §8.1): Four Doors** — "Every module presents the Four Doors and nothing else… There is no fifth door and no 'Settings' tab floating outside the grammar" [E06 §01, §10 D1].

| Door | Answers | Content shapes admitted | Platform screens behind it |
|---|---|---|---|
| Work | What needs me now | Queues | Approvals, obligations, Decide, Not done |
| Records | What is the state of things | Lists, forms, pinned fields | Declarations (Studio), actors, write types, Record |
| Agents | Who and what is acting here | Agents, models, autonomy grants | Agents, autonomy grants, keys, tenants |
| Assurance | Can I show someone this was done properly | Chain standing, refusals, coverage, meter, exports | Proof, chain, refusals, meter, exports |

P23 proposes "Thirteen areas govern the IA; Gate 2 re-scoped or retired" — unsigned (Q110). A front end that wants both can group the 13 areas under the four doors (Work: Today, Approvals, Alerts; Records: Activity, Rulebooks, Connectors, Inventory, Assessments; Agents: Agents; Assurance: Evidence, Compliance) — **this grouping is our suggestion, not the memo's.** Settings is the one area the Four-Doors rule forbids as a fifth tab.

### 2.2 Screen-map totals (275 design screens → code) — R14.1 table

Status rules: BUILT disposition → Built; KEEP → Needs logic; LATER → Design only; MERGE takes its target's status.

| Area | Design rows | New rows (built, no design) | Built | Needs logic | Design only | Total |
|---|---|---|---|---|---|---|
| 1 Sign-in and onboarding | 21 | 1 | 19 | 1 | 2 | 22 |
| 2 Today | 4 | 0 | 3 | 1 | 0 | 4 |
| 3 Approvals | 11 | 0 | 9 | 0 | 2 | 11 |
| 4 Activity | 18 | 0 | 11 | 0 | 7 | 18 |
| 5 Agents | 10 | 2 | 11 | 0 | 1 | 12 |
| 6 Rulebooks | 23 | 3 | 24 | 0 | 2 | 26 |
| 7 Connectors | 6 | 1 | 7 | 0 | 0 | 7 |
| 8 Evidence | 10 | 0 | 8 | 0 | 2 | 10 |
| 9 AI inventory | 1 | 2 | 3 | 0 | 0 | 3 |
| 10 Assessments | 3 | 3 | 4 | 0 | 2 | 6 |
| 11 Compliance | 11 | 0 | 6 | 0 | 5 | 11 |
| 12 Alerts & emergency stop | 6 | 2 | 6 | 1 | 1 | 8 |
| 13 Settings | 18 | 2 | 17 | 0 | 3 | 20 |
| Developer | 30 | 0 | 0 | 26 | 4 | 30 |
| Public site and portals | 58 | 0 | 0 | 10 | 48 | 58 |
| Billing and meter | 8 | 0 | 0 | 0 | 8 | 8 |
| Assurance and proof (L1–L3) | 31 | 0 | 0 | 0 | 31 | 31 |
| System pages | 6 | 1 | 2 | 4 | 1 | 7 |
| **Total** | **275** | **17** | **130** | **43** | **119** | **292** |

- Of 275 design screens, **113 sit on working code** (38 one-to-one, 75 merged into a built screen); 26 KEEP; 116 LATER; 20 merge into not-yet-built screens (17 need logic, 3 design only).
- "130 built" counts **rows**, landing on **27 distinct page routes** (+53 API route handlers). Up to 18 rows map onto `/rulebooks/[slug]` alone.
- Screenshots in repo: 01 login/onboarding, 02 & 12 Today, 03 & 14 approvals (14 = approval on phone), 04 activity, 05–07 agents, 08/13/21/22 rulebooks (08 rule builder, 22 test-on-past-actions), 09 connectors, 10 evidence, 11/19/23 settings, 15 inventory, 16 assessments, 17/18 compliance, 20 alerts.

### 2.3 The 27 built routes, by area (R14.2)

| # | Area | Routes | What the page shows / does | Gaps (to design/build) |
|---|---|---|---|---|
| 1 | Sign-in & onboarding | `/login`, `/signup`, `/invite/[token]`, `/onboarding` | Password (+TOTP) or OIDC SSO; invite single-use link; onboarding **company → industry and regions → demo**; org switcher in shell | Password recovery (KEEP); no currency or time-zone inputs (brief claimed them — A205) |
| 2 | Today | `/` | **Waiting for me**, today's numbers, live activity, suggestions, alerts, chain status ("Evidence chain: Intact" tile) | Due-dates panel (merged "obligations calendar", needs logic) |
| 3 | Approvals | `/approvals` (tabs: waiting, decided), `/approvals/[id]`, `/approve/[token]` | Queue; approval detail with evidence; signed single-use link page (still requires sign-in) | No "decided in Slack/WhatsApp" label; no re-routing |
| 4 | Activity | `/activity` | Receipts list with filters; per receipt **"Verify this receipt"** (re-checks hash, signature, both chain links) | — |
| 5 | Agents | `/agents`, `/agents/new` (3 steps), `/agents/[slug]` | Owner, risk, keys, rulebook, pause, behaviour baseline, auto-pause switch | No automatic discovery |
| 6 | Rulebooks | `/rulebooks` (with suggestions), `/rulebooks/[slug]` | Builder (visual + YAML in sync), risk tags, limits, Try an action, Test on past actions, versions, diff, sign & publish | — |
| 7 | Connectors | `/connectors` | Gmail, Zoho Books, "Your MCP servers" (empty state in screenshot 09) | — |
| 8 | Evidence | `/evidence` | Auditor pack export, checkpoints, compliance map | Export-history list unconfirmed |
| 9 | AI inventory | `/inventory`, `/inventory/[id]` | Register of AI systems | No model name/version field |
| 10 | Assessments | `/assessments`, `/assessments/[id]` | Templates, scoring, sign-off | — |
| 11 | Compliance | `/compliance`, `/compliance/[framework]` | Coverage per framework, gaps, report PDF; "Draft — needs legal review" everywhere | Verifier-profile screens LATER |
| 12 | Alerts & stop | `/alerts`, `/alerts/[id]` ; stop in shell | Alert list, Alert settings, Emergency stop, incident list (inside Alerts) | **Incident detail page (KEEP)** |
| 13 | Settings | `/settings`, `/settings/sso`, `/settings/notifications` | Members/roles, keys, replay-store switch, webhooks, SSO, notification channels (Slack/WhatsApp numbers) | — |

Global: **no loading states yet** (no `loading.tsx`) — a stated gap (R14.2 note, R15.2 "loading states").

### 2.4 Seventeen built screens with no design yet (R14.4) — need new designs

AI inventory; AI system; assessments; assessment; assessment sign-off; rule suggestions; test on past actions; risk-tag rule builder; alerts with auto-pause; alert page; Your MCP servers; single sign-on set-up; multi-industry onboarding; three-step Add agent; replay-store switch; agent behaviour baseline; error page.

### 2.5 Outside the thirteen areas (R14.3, Fig 40)

| Group | Rows (B/NL/DO) | Verdict | Detail |
|---|---|---|---|
| **Developer** | 0/26/4 = 30 | **KEEP** | "planned `/developers` pages and a no-account `/verify` page". Public docs for the SDKs, OpenAPI, MCP, webhooks and CLI — these "exist with no screen" |
| **Verifier portal** | (in Public) | **KEEP** | "The proof story: a no-account web verifier on top of govern verify" |
| **Public site & portals** | 0/10/48 = 58 | Marketing **LATER**; legal **KEEP** | Marketing copy must be rewritten for Elan1 Govern; legal pages (privacy, terms, DPA, cookies) KEEP because sign-up is live |
| Auditor portal | — | MERGE | Auditor role + org switcher already work in-app |
| Regulator, counterparty, partner portals; trust centre | — | LATER | Depend on L3 or a partner programme |
| **Billing & meter** | 0/0/8 = 8 | LATER | No meter, plan or invoice code |
| **Assurance & proof L1–L3** | 0/0/31 = 31 | LATER | Assurance levels, L2 upgrade wizard, anchoring, verifier profiles: "Nothing to upgrade to" |
| Erasure requests; lexicon; objects & changesets; residency; agent map; break-glass | — | LATER | No model in code; break-glass would weaken the "no admin mode" claim before dual control exists |
| Autonomy & graduation; escalations; discovered agents; review queue | — | MERGE | Into rulebook outcomes + rule suggestions; Approvals "Decided" list; AI inventory; assessment sign-off |
| Obligations calendar | — | MERGE (needs logic) | Due-dates panel on Today |
| Incidents | — | KEEP (detail) | List exists under Alerts; record page missing |
| **System pages** | 2/4/1 = 7 | KEEP | 404 + error **built**; **403, maintenance, offline, "approvals unavailable"** KEEP — "An honest 'approvals unavailable' page for a fail-closed product" |

Vocabulary note: design "Action receipts" screens are renamed **"Counterparty receipts (L3)"** (R13).

### 2.6 Specified screens from the original console chapter (§8.2) — designed/upcoming

| Door · screen | Purpose | Users | Status today |
|---|---|---|---|
| Work · Approvals | Queue of open obligations, oldest deadline first — "the one a customer opens twenty times a day" | Approvers | Built as `/approvals` |
| Work · **Decide** | "The single most consequential surface": diff, gates, decision, Approve/Reject | Approvers | PARTIAL: `/approvals/[id]` has evidence but **no field diff, no gate list, no "Reverse this (30 days)"** |
| Work · **Not done** | Refusal explanation in the words of the attempted action, with operator action | Requesters, operators, support | Not built |
| Records · **Record** | Current state, pinned fields, timeline of every governed write, refusal and escalation ("a timeline of successes only… lies by omission") | Operators, CAs, auditors | Not built |
| Assurance · **Proof** | One entry: seq, digests, versions, actor kind, outcome, mode, bound fields; chain continuity three-valued | Auditors, CAs, security | ≈ Activity receipt + Verify |
| Platform · Records · **Studio** | Author → Validate → Simulate → Certify; cannot skip forward | Declaration authors, certifiers | ≈ rule builder (Try / Test / Sign & publish) |
| Platform · Agents · **Tenants** | Residency domain, status, stop switch (governed write, dual control) | Tenant admins | ≈ Settings + emergency stop |
| Platform · Agents · **Keys** | API keys, last used, rotation window | Tenant admins | ≈ agent keys + org key rotation |
| Platform · Agents · **Agents** | Every agent, its model, tools and hash-pinned descriptions | Admins, security | ≈ `/agents` |
| Platform · Agents · **Autonomy** | Grant per actor per write type A0–A5; missing grant renders "A0 Observe (no grant)" | Admins | SPECIFIED (L3) — merged into suggestions |
| Platform · Assurance · **Meter** | Governed writes by write type, refusals at quantity zero on the same table, cost to date | Finance, admins | SPECIFIED — LATER |

---

## 3. Screen-by-screen detail (purpose, data, actions, states)

### 3.1 Today (`/`)
- Panels: **Waiting for me** (approvals for this approver), **today's numbers**, **live activity**, **rule suggestions**, **alerts**, **chain status** tile ("Evidence chain: Intact"). Screenshot 02 shows the Intact tile + one waiting approval.
- Upcoming: **Due-dates panel** (obligations calendar merged; data exists, view doesn't).
- Emergency-stop state: **red banner on every page** while a stop is open.

### 3.2 Approvals (`/approvals`, `/approvals/[id]`, `/approve/[token]`)
- **Queue** tabs: *Waiting* and *Decided*. Spec'd queue row (original §8.6): human/agent proposer (in words), money or radius, gate summary ("5 of 5 passed"), time left. Filters in the URL so views can be pasted: *waiting on me, expiring within an hour, raised by an agent, write type/tool, counterparty*.
- **Empty state (spec copy):** "Nothing is waiting for you. Agents are running at their declared autonomy; anything that needs a person will appear here", with a link listing what escalates for this person.
- **Detail page (built) shows:** agent, tool and arguments; the evidence (e.g. invoice, vendor, amount); the rule that caused the ask; who must approve (approver group); when it expires. **Self-approval warning** (screenshot 14): "You set up this agent… the receipt will show that you approved your own agent's action".
- **Actions:** Approve / Reject — one atomic claim, double clicks and replays decide once. Re-auth: password asked **only if sign-in > 10 min old**.
- **Spec'd Decide screen (designed, upcoming, §8.6):** (1) one-line proposal; proposer stated as "Agent" or "Person" in words, deadline, blast radius; (2) field-by-field diff, before→after, changed rows highlighted, unchanged behind **Show all fields** ("Nothing is summarised away"); (3) **every** gate result in plain words with numbers, e.g. "Precondition (credit limit ₹3,00,000, exposure after this write ₹2,40,000) — passed", with the declaration version; (4) the decision and why a person is needed ("allow at policy version 11 … the proposing agent is at A2 Propose; a person approves before anything is written"); (5) Approve / Reject — **Reject requires a reason of at least a sentence**; (6) after approval: "Approved · posted · proof #4,101" with **Open the record** and **Reverse this (30 days)**.
- **Spec'd special states/copy:** same-actor → "You proposed this, so you cannot also approve it. Send it to: [names]" + **Send to** control (humans only); approved-but-failed → "Your approval was recorded. The write itself did not complete, and nothing was changed. We have been paged."; outage → "Nothing has been approved in the meantime and nothing expires while this is down".
- **Link page `/approve/[token]`:** HMAC-signed, single-use (`ApprovalLink.usedAt`); still requires sign-in. States: valid, used, expired, wrong user.
- **Built states:** waiting (with expiry countdown), approved, rejected, expired (= refused, arguments wiped), **approved but run failed** (approval stands, receipt outcome `error` + reason). Channel: web / email(phone link) / slack / whatsapp — **label not yet shown in console** (gap).

### 3.3 Activity (`/activity`)
- List of **receipts** (all four kinds), filters, per-row **Verify this receipt** → checks hash, signature, both chain links (result states: verified / broken + reason).
- Spec'd Proof wording rule: continuity shown as **continuous**, **break at seq N** or **not checked over this range**, with scope and count printed, **never as a green tick**.
- 18 design rows; 7 remain design-only (likely proof/record detail views).

### 3.4 Agents (`/agents`, `/agents/new`, `/agents/[slug]`)
- List: name, owner, risk level, status (active / paused), rulebook.
- Detail: owner, risk level, **API keys** (prefix `gk_`, stored as SHA-256 hash, shown once), active rulebook, **Pause** switch, **behaviour baseline** (learned normal), **"Pause automatically on high-severity alerts"** (`autoPauseOnHigh`, off by default).
- **Add agent — 3 steps** (`/agents/new`). The memo does not enumerate the steps. It gives the end state's ingredients: the agent is reached by MCP at **`POST /mcp`** (stateless Streamable HTTP) with its API key; repo examples cover **Claude Desktop, Claude Code, Cursor** (MCP set-up) and **LangChain, OpenAI Agents SDK, plain Python** (SDK). New agents **join the AI inventory automatically**. A **high-risk agent cannot publish** a rulebook without an ask rule on high-impact tags.
- Spec'd (original): agent's model, tools and **hash-pinned tool descriptions**; a changed description "shows as a version change, not a silent update".

### 3.5 Rulebooks (`/rulebooks`, `/rulebooks/[slug]`)
- `/rulebooks`: one rulebook per agent; **rule suggestions** list with **Look for suggestions** (on demand) — each suggestion has **Open as draft** and **Dismiss** (both receipted).
- Builder `/rulebooks/[slug]`: visual editor ⇄ YAML view kept in sync; rules by **tool** or **risk tag**; conditions; limits; approver groups; lists.
- **Try an action:** one made-up call against the draft → decision + deciding rule (screenshot 08: "a ₹2,00,000 payment is decided by rule pay-large — waiting for a person").
- **Test on past actions:** window **7 or 30 days**; reports counts and lists up to **200** changed calls. Copy examples: "Of 412 calls, 12 more would be refused, 30 more would ask a person and 5 fewer would ask a person. 3 could not be judged." / "Of 15 calls, none would change. 1 could not be judged." Disabled state when replay store is off. Covers ≤50,000 most recent calls; rate-limited; writes no receipt.
- **Versions & diff:** every published version kept; diff shown before publishing.
- **Sign & publish:** owners/admins only; strict tool-name validation; refuses high-risk agent without ask rule on high-impact tags; refuses `approve_in_chat` on disallowed rules; Ed25519 signs the version.

### 3.6 Connectors (`/connectors`)
- Cards: **Gmail** (read + send tools), **Zoho Books** (bills and payments, India DC `zoho.in`) — status demo / live (live = customer's own OAuth app; never run against real accounts).
- **Your MCP servers:** add server (URL http/https, no credentials in URL, one `Authorization` header), tools synced with **suggested risk tags** from a fixed word list, **each tool starts disabled** until switched on; tool names `<server>.<tool>` (`gate`, `gmail`, `zoho` reserved). Errors: SSRF block (private/loopback/etc. ranges refused in production), upstream error shown generically.
- Empty state for Your MCP servers is in screenshot 09.

### 3.7 Evidence (`/evidence`)
- **Export auditor pack** (owners, admins, auditors) — bundle + PDF summary + compliance map; every export writes an `evidence.exported` receipt.
- **Checkpoints** list (hourly at :00, on demand; skipped if head unchanged) — "Create checkpoint" on demand.
- Compliance map preview. Export history list "unconfirmed".
- Spec'd L2 export flow (§11.4) — see Flow F8.

### 3.8 AI inventory (`/inventory`, `/inventory/[id]`) — see data object §4.12. Risk tier and next review are **read-only** (come only from approved assessments).

### 3.9 Assessments (`/assessments`, `/assessments/[id]`) — 3 templates; deterministic scoring with "the page shows the thresholds and every answer that added to the score"; submit → sign-off by a **second person**.

### 3.10 Compliance (`/compliance`, `/compliance/[framework]`)
- Framework cards with coverage % and fraction (demo: ISO 42001 46% (7/15) · NIST AI RMF 63% (7/11) · DPDP 11% (1/9) · RBI FREE-AI 66% (4/6) · EU AI Act 25% (4/16) · GDPR 30% (3/10)).
- Framework page: requirements (article/section/function/pillar) each with official link, mapped controls GATE-xx, live evidence counts, **gaps: "No control covers this yet"**; **framework report PDF** (receipted).
- Banner on every page/export: **"Draft — needs legal review"**; coverage "is a count of receipts, not a test of controls".

### 3.11 Alerts & emergency stop (`/alerts`, `/alerts/[id]`)
- List: severity (low / medium / high), detector, agent, subject, status. Screenshot 20: three medium "New vendor", six low "First use of…".
- Alert page: detail, **Acknowledge**, **Resolve** (owners/admins/approvers; each a receipt); auto-pause note.
- **Alert settings** (per agent auto-pause); **Emergency stop** control; **incident list** (inside Alerts); incident detail **missing (KEEP)**; incident report PDF.

### 3.12 Settings (`/settings`, `/settings/sso`, `/settings/notifications`)
- Members & roles (invite, change role — receipted), org signing key (**rotate**, owner-only, fresh sign-in), **replay-store switch** (off deletes rows), webhooks (endpoints, secret, deliveries), retention (GATE-10 "settings" evidence).
- `/settings/sso`: OIDC connection (one per org), PKCE, domains proved by DNS TXT `gate-verify=…`, optional **SSO-only**, users created on first sign-in.
- `/settings/notifications`: Slack workspace link, WhatsApp number verification (6-digit code), email.

### 3.13 Developer surfaces (no screens yet — KEEP)
Content to document (R10.1): MCP endpoint; REST Event API; OpenAPI 3.1 at `/v1/openapi.json` (5 paths, agent-facing only); TypeScript SDK; Python SDK; CLI; webhooks; examples. Spec'd developer onboarding (§6.9) adds: self-serve **sandbox key** in a minute, reference tenant fixtures, conformance tests C1–C14, production key by review. See §4.15–4.17.

### 3.14 Public verifier (`/verify`, no account — KEEP)
"A no-account web verifier on top of govern verify". Must reflect govern verify semantics (§4.8) and the key-trust caveat (pass a key / compare fingerprint). L2 spec adds six exit codes and a nine-section report (§4.9).

### 3.15 System pages
Built: **404**, **error**. KEEP: **403**, **maintenance**, **offline**, **"approvals unavailable"**. Spec copy for fail-closed states: "We cannot check this change right now. Nothing was changed." ; "Writes are paused for this organisation" (tenant stop).

---

## 4. Data objects and fields (for realistic mocks)

### 4.1 Organisation (`Org`)
Fields: name, **industry** (one of 7), **regions** (India, EU, UK, US — select frameworks only, no residency control), **time zone** (used for daily limits), **currency** (stored, no UI writes it), **replay-store switch** (on by default). One active signing key + retired keys. Seed orgs: *Demo Traders Pvt Ltd*, *Patel Agro Foods*.
Tables (30 Prisma models, 26 tenant-scoped): User, Session, Membership, Org, Invite, SsoConnection · Agent, ApiKey, OrgKey · Rulebook, RuleSuggestion, ReplayCall · Receipt, Checkpoint, Approval, ApprovalLink · Connector, UpstreamServer, UpstreamTool · AiSystem, Assessment, OrgFramework · Webhook, WebhookDelivery, ChatChannel, ChatNumber, ChatMessage · BehaviourAlert, HealthAlert, Incident.

### 4.2 Member / role / permissions
- `Membership`: user × org × **role** ∈ {Owner, Admin, Approver, Viewer, Auditor}. Multi-membership → org switcher (auditor works across client companies).
- **22 permissions** exist but are **not listed** in the memo. The memo's role summary (R9.2) — use as the permission matrix basis:

| Capability | Owner | Admin | Approver | Viewer | Auditor |
|---|---|---|---|---|---|
| View everything | ✓ | ✓ | ✓ | ✓ | ✓ |
| Decide approvals | ✓ | ✓ | ✓ | – | – |
| Manage agents, rulebooks (sign & publish), connectors, settings, compliance, members, webhooks, notifications, suggestions, alerts | ✓ | ✓ | – | – | – |
| Acknowledge / resolve alerts | ✓ | ✓ | ✓ | – | – |
| Emergency stop / resume | ✓ | ✓ | – | – | – |
| Export evidence (auditor pack) | ✓ | ✓ | – | – | ✓ |
| Draft & submit assessments | ✓ | ✓ | ✓ | – | – |
| Sign off assessments (never own submission) | ✓ | ✓ | – | – | – |
| Manage SSO; rotate signing key | ✓ | – | – | – | – |

- Auth: password ≥12 chars, argon2id; lockout after 5 failures (1 min, doubling, cap 1 h); optional TOTP (6 digits, 30 s); OIDC SSO; invitations single-use links; **fresh sign-in (≤10 min)** required for approvals, emergency stop, key rotation (not for chat buttons). Not built: SAML, SCIM, WebAuthn, per-action step-up.

### 4.3 Agent
Fields: name, slug, **owner**, **risk level** (low/medium/high), API keys (`gk_…`, SHA-256 hash only, last used), **one rulebook** (active version), **paused** flag (own pause or by emergency stop), **autoPauseOnHigh** (default off), behaviour baseline (learning period 7 days, 14-day baseline, 90-day memory), linked inventory record (auto). Created-by user (drives `self_approval`).

### 4.4 Tool (tool registry)
Built-in (10 tools across Gmail + Zoho) + enabled upstream tools. Each: name (`gmail.*`, `zoho.*`, `<server>.<tool>`), input schema, **risk tags**, enabled flag. Registry cached 10 s per org.

**Eight risk tags:** `reads_data`, `writes_data`, `moves_money`, `sends_external`, `personal_data`, `deletes`, `changes_access`, `changes_production`. High-impact: moves money, deletes, changes access, changes production.

### 4.5 Rulebook (YAML, one per agent, signed)
Top-level keys: `version`, `agent`, `owner`, `default` (always `refuse`), `approvers` (named groups of email addresses), `lists` (e.g. known counterparties/domains), `limits`, `quotas`, `rules`, `signature`.

Rule fields: `id`; **either** `tool` **or** `tag`; `when` (conditions); `unless` (exceptions — **ask rules only**; the ask stands aside only when every exception holds; a missing value never holds); `decide` ∈ allow | ask | refuse; `approver` (group, for ask); `reason`; `expires_in` (asks; default 24 h, max 30 days); `approve_in_chat` (default false).

**Condition operators (8):** `eq`, `lt`, `lte`, `gt`, `gte`, `in`, `to_domain_in`, `fields_include`.

**Evaluation:** strictest wins **refuse > ask > allow**; ties → first rule; no match → refuse. Limits can only turn **allow → ask** (or → refuse if no approver group); never loosen.

**Quotas/limits:** count calls or sum a field per window — a day (org-local midnight) or rolling minutes/hours/days. Examples: "50 emails an hour", "₹5 lakh a day", 50 messages/hour (healthcare), 20 refunds/day (support), 10 deploys/day (engineering).

Example (Fig 34):
```yaml
- id: pay-large
  tag: moves_money
  when: { amount: { gt: 50000 } }
  decide: ask
  approver: finance
```
Demo AP rulebook: `pay-small` allow ≤ ₹50,000; `pay-large` ask above; refuse change to vendor bank details; daily payment cap ₹20,00,000 (demo; brief said ₹5,00,000).

Publish validations: strict tool names; high-risk agent needs ask rule on high-impact tags; `approve_in_chat` refused for rules reaching `deletes`/`changes_access`/`changes_production`/`personal_data` tools, or money-moving tools without an upper amount.

Rulebook version record: version number, hash, signed by (kid), signed at, published by; every version kept; rulebooks re-signed on key rotation.

### 4.6 Rule suggestion
Kinds (4): **raise a limit** (move the allow/ask line), **allow under an amount**, **allow known counterparties** (never for money-moving tools), **both** (under an amount, only for those counterparties).
Qualifying rules: ≥10 approvals over ≥7 days, latest within 14 days; none rejected/expired; cap ≤ largest approved amount and below any refuse threshold; never touches refuse rules or `deletes`/`changes_access`/`changes_production` tools; replay-checked (only approved asks may become allows). Nightly 02:00 IST + on demand. States: open, opened-as-draft, dismissed (returns only when its approvals at least double).
Example card: **"Raise the no-approval limit for payments from ₹50,000 to ₹1,00,000"** — "In the last 30 days people approved all 41 payments over ₹50,000 and up to ₹1,00,000, to 6 vendors (none rejected). Allow payments up to ₹1,00,000 without asking?" [Open as draft] [Dismiss].

### 4.7 Receipt (22 top-level fields, strict schema, most optional)
| Field | Meaning |
|---|---|
| `seq` | Gap-free per-org sequence |
| `ts` | Timestamp |
| `org` | Organisation |
| `kind` | `decision` · `approval` · `outcome` · `admin` |
| `agent` | Agent |
| `tool` | Tool name |
| `args_summary` | Display identifiers + values rules inspected only (email → recipient **domain**; record change → **field names**, not values) |
| `args_hash` | SHA-256 over canonical(tool + args) |
| `rulebook{version,hash}` | Rulebook it was decided under |
| `rule_id` | Deciding rule, or system id |
| `decision` | `allow` · `ask` · `refuse` |
| `reason` | Text |
| `approval{…}` | e.g. status pending/approved/rejected/expired, expires_at, by, at, `self_approval` |
| `outcome{…}` | `ok` · `error` · `not_run` (+ reason) |
| `ref_seq` | Referenced receipt (e.g. approval → its decision) |
| `actor` | Human actor (approvals/admin) |
| `action` | Admin action name (e.g. `key.rotated`, `evidence.exported`, `emergency.stop`, `emergency.resumed`, `agent.paused`, rulebook signed, connector added, role changed) |
| `details` | e.g. `details.channel` = web · email · slack · whatsapp |
| `prev_hash` | Link to previous (genesis = 64 zeros) |
| `kid` | Key id = first 16 hex of SHA-256 of public-key PEM (e.g. `17f410d32e400e2d`) |
| `hash` | `"sha256:" + hex(SHA-256(canonical JSON without hash/sig))` |
| `sig` | Ed25519 over the hash string |

**Six system refusal rule ids:** `agent-paused`, `no-rulebook`, `rulebook-invalid`, `default` (unknown/disabled tool and no rule matched), `invalid-arguments`, `gate-error`. Plus free-form customer rule ids.
Never in a receipt: full arguments, message bodies, prompts, email addresses, values no rule inspected.
Inventory changes, assessment submissions/sign-offs, alert ack/resolve, suggestion open/dismiss, exports, member changes are also receipts on the same chain ("if a receipt cannot be written, the change is undone").

### 4.8 Checkpoint and govern verify
- Checkpoint signs `{org, seq, hash, ts, kid}`; hourly at :00, skipped if head unmoved; also on demand.
- Bundle `gate-evidence-bundle/1`: `receipts.jsonl`, `checkpoints.json`, `public_key.pem`, optional `public_keys.json` (kid→PEM, after rotation), signed `manifest.json` (range, count, last hash, file hashes), `README.txt`. **Auditor pack** = bundle + PDF summary + compliance map.
- `govern verify auditor-pack.zip [--key org.pem]` — output example: "Chain intact: 31 receipts · receipts 1–31, 2 signed checkpoints · organisation: Demo Traders Pvt Ltd · key fingerprint: 17f410d32e400e2d". Checks schema, seq continuity (gaps, duplicates, reordering), prev_hash, recomputed hash, signature by kid, retired-key misuse, checkpoints, manifest signature, counts, last hash, file hashes; names the first broken receipt.
- **Exit codes (built): 0 intact · 1 broken or not verified · 2 usage error / missing file.**
- Caveat to surface in UI: the bundle carries its own key; without `--key` or an independently obtained fingerprint, a fabricated bundle would also verify.

### 4.9 Verifier — L2 spec (designed, for /verify and Assurance screens)
Six exit codes: **0 PASS** (variants: *PASS*, *PASS — payload unbound* (erased salt), *PASS — unsigned, assurance level 1: internal evidence only*), **1 FAIL_INTEGRITY**, **2 FAIL_PROFILE**, **3 INCOMPLETE**, **4 UNSUPPORTED**, **5 USAGE**. Rule: "1 and 2 are never collapsed, and 3 is never reported as either". Precedence (rec.): 1 > 3 > 2.
Integrity steps I1–I8 (members, preimage digest, chain walk, assurance level, signature, key window, anchors, resolution); I5–I7 read `not_applicable — assurance level 1` on L1 ranges.
**Report — nine sections, always in order:** 1 Verdict · 2 The claim · 3 Scope (range, count, write types, continuity scope with count) · 4 Integrity results · 5 Clause results · 6 First failure in full (seq, field, expected, found) · 7 Notes (erased payloads, key rotations, unanchored head) · 8 Limits (verbatim) · 9 Reproduction (command, verifier version, profile digest, bundle digest).
L2 bundle manifest fields: `bundle_format` (`elan1.evidence.bundle.v1`), `tenant_id`, `seq_from`/`seq_to`, `record_count`, `refusal_count`, `assurance_levels[]` (level, count, range), `continuity_scope` (full_chain · declared_write_types · range), `profile_id`/`profile_version`, `redaction_profile`, `members[]` (path, bytes, sha256), `unanchored_head`, `exported_at`, `verifier_digest`. Eight members: manifest.json, seals.jsonl, chain.json, anchors/, keys.json, declarations/, lexicon/, VERIFY.txt.
**Verifier profile (8 blocks):** profile_identity (profile_id e.g. `in-mca-audit-trail`, version, regime_name, issuer, jurisdiction, author, certifier, status draft·certified·superseded·withdrawn) · regime_binding (clause rows) · bundle_requirements · checks[] (C01…, kind integrity·structural·binding·coverage·temporal, on_fail) · report_vocabulary · limits_statement (≥200 chars, verbatim) · versioning (rule_as_at, applies_to_records_from) · conformance (P1–P12). First profile **in-mca-audit-trail v1**: 4 clauses, 6 checks.

### 4.10 Approval (built)
Fields: id, receipt (seq of the ask), agent, tool, **arguments (encrypted; wiped on expiry)**, evidence (e.g. invoice, vendor, amount), rule id, **approver group**, **expires_at** (default 24 h, max 30 days), status **pending · approved · rejected · expired**, decided_by, decided_at, **channel** (web · email · slack · whatsapp), channel user (WhatsApp as keyed hash), `self_approval`, run outcome (ok · error · not_run). `ApprovalLink`: HMAC token, usedAt.
Spec (original) approval object: approval_id, write_id, approver_id, approver_kind (human only), decision approve|decline (UI label "Reject"), **basis** (surface-plan version + rendered payload digest), at. Obligation: obligation_id, write_id, raised_at_rung, autonomy_level, resolver_set, quorum, expires_at (default 4 h spec), paused_seconds, status open·approved·declined·expired.

### 4.11 Connector / upstream MCP server / upstream tool
- Connector: type (gmail | zoho_books), mode (demo/mock | live), OAuth app (customer's own), status, tokens (encrypted, never shown).
- UpstreamServer: name (slug used as tool prefix), URL, Authorization header (encrypted), status, last sync, tool count.
- UpstreamTool: `<server>.<tool>`, schema, suggested risk tags, **enabled** (default off), removed flag.

### 4.12 AI system (inventory)
Fields: name, **kind** (agent, model, vendor tool, internal app), vendor, purpose, owner, business unit, **lifecycle stage** (proposed → in review → approved → live → retired), data categories, affected people, **decision impact** (whether it makes decisions), linked agent, **risk tier** (read-only, from approved assessment), **next review** (read-only). No model name/version field. Agents appear automatically. Automatic discovery of unregistered AI: not built.

### 4.13 Assessment
Templates (3, versioned in code): **risk triage** (nine questions), **impact assessment**, **data-protection check**. Each answer carries points; page shows thresholds and contributing answers. Workflow: draft → submitted → approved (sign-off by owner/admin, never the submitter — checked by user id, incl. racing reviews) / (rejection implied). Approval sets system tier to the highest latest result; next review **6 / 12 / 24 months** for high / medium / low.

### 4.14 Framework / requirement / control
Frameworks (10): **EU AI Act · NIST AI RMF 1.0 · ISO/IEC 42001 · DPDP Act 2023 · RBI FREE-AI (Aug 2025, pillar level) · GDPR · HIPAA · SOC 2 (2017 criteria) · Colorado AI Act · NYC Local Law 144**. `OrgFramework` = which are turned on. Requirements at article/section/function/pillar level with official link. Coverage = share of requirements with ≥1 mapped control having live evidence, rounded down.

| Id | Control | Evidence counted |
|---|---|---|
| GATE-01 | Agents only do what a rule allows | default refusals |
| GATE-02 | A person approves high-impact actions | approvals |
| GATE-03 | Separation of duties on approvals | self-approvals |
| GATE-04 | Tamper-evident record of every decision | receipts |
| GATE-05 | Signed, versioned rulebooks | rulebooks |
| GATE-06 | Kill switch for every agent | kill switch |
| GATE-07 | Registry of agents, owners and risk tiers | agents |
| GATE-08 | Minimal personal data in logs | decisions |
| GATE-09 | Agents never hold credentials (*MCP path only*) | connectors |
| GATE-10 | Retention is set and recorded | settings |
| GATE-11 | Access is role-based, changes recorded | member changes |
| GATE-12 | AI systems are inventoried | systems |
| GATE-13 | Risk assessments approved before go-live | approved assessments |

### 4.15 Industry packs (7)
Finance and accounting · Healthcare · HR and recruiting · Customer support · Sales and marketing · Engineering and DevOps · General. Each: typical risks, recommended frameworks (always ISO/IEC 42001 + NIST AI RMF, plus region frameworks), controls that matter most, risk-question wording, **starter rulebook** (mostly tag rules; only Finance names built-in tools — Gmail + Zoho AP). Never call these "packs" bare; **regulatory packs** (ledger1, invoice1, collect1) are SPECIFIED, not built.

### 4.16 Alert / detector / incident
| Detector | Trigger (defaults) | Severity / auto-pause |
|---|---|---|
| `volume_spike` | Robust z-score of last hour's calls; ≥20 calls; medium at 6, high at 12 | medium/high — can pause |
| `refusal_surge` | Refused share above baseline; ≥10 calls; medium 0.3, high 0.6 | medium/high — can pause |
| `amount_outlier` | Robust z-score of amount; ≥5 samples; medium 6, high 15 | medium/high — can pause |
| `new_counterparty` | Vendor/domain/payee/account/customer unseen in 90 days | medium with amount, else low |
| `new_tool` | First use of a tool | always low |
| `off_hours` | Hour-of-week with ≤0.5% of baseline calls | low or medium |

Alert: id, agent, detector, key/subject, severity, status **open → acknowledged → resolved**, created receipt, timestamps; deduplicated per agent+detector+key (repeats update). Medium/high email owners+admins; webhook `alert.created`. No alerts during first 7 days. HealthAlert: system problems (receipt-write failure, detector failure) naming tool + connector reference.
Incident (written by emergency stop): id, opened_by, opened_at, paused agent ids, count, resumed_by/at, alerts, receipt range; **incident report PDF** (an hour before stop → resume, ≤300 receipt rows, range to export for govern verify).

### 4.17 Webhook events
Built: envelope events **`receipt.created`**, **`approval.pending`**, **`approval.resolved`**, **`alert.created`**; header `gate-signature: t=…,v1=HMAC-SHA256`; up to 8 attempts; per-delivery retry state; no outbox. Spec (original) events: `write.committed`, `write.refused`, `write.escalated`, `obligation.resolved`, `obligation.expired`, `declaration.certified`, `tenant.stopped` (each with seq + digest; `X-Elan1-Signature`, 5-minute window).

### 4.18 Agent-facing API (developer portal content)
- **MCP** `POST /mcp`: governed tools + `gate.approval_status` (long-polls ≤30 s). Refusal = tool result `isError: true` with decision, rule id, reason. Ask = returns "waiting" + `approval_id`.
- **REST:** `POST /v1/check` → allow | ask (approval id + link) | refuse (**200**, not 4xx); `POST /v1/record` (outcome; duplicate → **409**); `GET /v1/approvals/{id}?wait=…`; `GET /v1/openapi.json`.
- **TS SDK** `@gate/sdk`: `check()`, `record()`, `waitForApproval()`, `verifyWebhook()`. **Python SDK** `elan1_govern`: `guarded` decorator, fails closed (`GovernError`), `RecordError`.
- **CLI:** `govern verify | sign | keygen`.
- Rate limit 300/min per API key; calls rejected before the guard (bad key, rate limit) produce no receipt. No idempotency keys.
- Spec additions (L1 GA design): sandbox key `SK_SBX_…` (self-serve, 10 writes/min, 2 concurrent, 5,000/month hard stop, separate chain `mode: sandbox`, never billed) vs production key `SK_LIVE_…` (issued after review, never self-serve); spec'd MCP tools `read.records`, `read.evidence`, `read.declaration`, `read.meter`, `stage.write`, `act.write`, `act.escalate` (scopes ro 18 / stage 10 / act 6).

### 4.19 Refusal-code register (spec — 43 codes; 32 enumerated + 3 define-codes)
Register: closed enumeration of **43 codes** — policy 14, gate 19, platform 10; 28 active at L1, rest at L2; +6 at L3. Each has a permanent numeric **REF-01…REF-43** plus a dotted wire spelling. Built product has only the 6 system rule ids (a closed register is a build item). The memo enumerates these 35:

| Code | Class | Rung | Means | Operator action |
|---|---|---|---|---|
| POLICY.TENANT_STOPPED | policy | 0b | Tenant is stopped (no record written) | Resolve the stop event |
| POLICY.ACTOR_NOT_PERMITTED | policy | 1 | Actor kind not granted this write type | Grant in new version / resubmit as permitted actor |
| POLICY.DELEGATION_INVALID | policy | 1 | on_behalf_of not live | Renew the delegation |
| POLICY.WRITE_TYPE_UNKNOWN | policy | 2 | Not in write_types | Publish a version that declares it |
| POLICY.CHANNEL_NOT_PERMITTED | policy | 2 | Channel doesn't carry write type | Use a permitted channel |
| POLICY.DECLARATION_UNRESOLVED | policy | 2 | Version absent/uncertified | Certify it |
| POLICY.DENIED_BY_RULE | policy | 4 | Named rule denied | Change request or rule |
| POLICY.NO_RULE_MATCHED | policy | 4 | No rule covers this | Author a rule; never widen a default |
| POLICY.BLAST_RADIUS_EXCEEDED | policy | 5 | Wider than declared | Narrow, or raise radius (forces dual control) |
| POLICY.AUTONOMY_INSUFFICIENT | policy | 6 | Grant below need | Raise grant or route to approval |
| POLICY.APPROVAL_DECLINED | policy | 6 | Approver declined | Address basis and resubmit |
| POLICY.OBLIGATION_EXPIRED | policy | 6 | Escalation expired | Resubmit |
| POLICY.DECLARATION_INVALID / VERSION_NOT_SEQUENTIAL / NOT_CERTIFIED | policy | define | Raised by define | — |
| GATE.CONSENT_MISSING | gate | 3 | No consent for purpose | Capture consent |
| GATE.CONSENT_EXPIRED | gate | 3 | Consent lapsed | Re-capture |
| GATE.RESIDENCY_MISMATCH | gate | 3 | Residency ≠ tenant's | Never override; residency runbook |
| GATE.RETENTION_WINDOW_CLOSED | gate | 3 | Outside retention window | Do not write |
| GATE.DUAL_CONTROL_PENDING | gate | 3 | No second approver yet | Request approval |
| GATE.DUAL_CONTROL_SAME_ACTOR | gate | 3 | Approver = requester | Find a second named actor |
| GATE.RATE_EXCEEDED | gate | 3 | Above per-actor rate | Wait or raise rate |
| GATE.BUDGET_EXHAUSTED | gate | 3 | Above per-period budget | Raise budget; never truncate silently |
| GATE.COUNTERPARTY_UNKNOWN | gate | 3 | Counterparty not registered | Register it |
| GATE.COUNTERPARTY_SANCTIONED | gate | 3 | On sanctions list | Never override; escalate to compliance |
| GATE.OUTSIDE_SCHEDULE | gate | 3 | Outside operating window | Wait or change window |
| GATE.PRECONDITION_FAILED | gate | 3 | Record state doesn't hold | Fix the record state |
| GATE.SANDBOX_DIVERGED | gate | 3 (raised at 7) | Live ≠ sandbox | Snapshot restored; investigate |
| PLATFORM.REGISTRY_UNAVAILABLE | platform | 2 | Registry down | Page; retry same intent_id |
| PLATFORM.POLICY_UNAVAILABLE | platform | 4 | Rule engine down | Page; never default allow |
| PLATFORM.TARGET_UNREACHABLE | platform | 7 | Target unreachable | Page; nothing applied |
| PLATFORM.TOKEN_MINT_FAILED | platform | 7 | Credential mint failed | Page |
| PLATFORM.WRITER_LOCK_LOST | platform | 7 | Single-writer lock lost | Page; snapshot restored |
| PLATFORM.LOG_APPEND_FAILED | platform | 8 | Chain append failed | Page; outbox retries |
| PLATFORM.CHAIN_HEAD_CONFLICT | platform | 8 | Two chain writers | P0; stop the tenant |

L3 adds (seen in Fig 21): POLICY.RECEIPT_AUDIENCE_MISMATCH, POLICY.RECEIPT_EXPIRED, POLICY.TRUST_ANCHOR_UNKNOWN, POLICY.RECEIPT_UNVERIFIED, GATE.RECEIPT_REPLAYED. rung1 Voice channel codes (VOICE_VALUE_CEILING, VOICE_DUAL_CONTROL_REQUIRED, VOICE_APPROVER_IS_REQUESTER) are not kernel codes. Register entry YAML: `ref, wire, class, rung, active_from, billable:false, pages, consumer_raisable, operator_action, fixtures`. Readiness rule: "every refusal code has a public page" → a public `/refusal-codes` page is consistent with spec.

### 4.20 Meter event (spec — no meter built)
Normative 7 fields: `event_id`, `write_id`, `seq`, `basis` (one_record · one_counterparty · batch · tenant · cross_boundary), `quantity` (0|1; **0 for every refusal**, DB CHECK), `outcome` (committed · refused · escalated), `at`. Extensions: `tenant_id`, `meter_class` (governed_action · approval · define · evidence_export), `run_id`, `write_type`, `declaration_id`, `declaration_version`, `policy_version`, `refusal_code`, `mode` (enforced · attested_advisory), `key_class` (production · sandbox), `pack_id`. Billing unit (A197, open): "Governed action: one tool call decided by Elan1 Govern" (working definition).

### 4.21 Price books (two, conflicting — effective-dated data, never hard-coded)
| Element | E10 Pricing Model v1 | IM price book |
|---|---|---|
| Floor | Monthly tiers: Sandbox 0; Pilot 0; Starter ₹40,000; Growth ₹1,25,000; Scale ₹4,00,000; Enterprise ₹10,00,000+ | Per tenant/yr by level: L1 ₹1,80,000; L2 ₹6,00,000; L3 ₹24,00,000; sovereign ₹1,20,00,000 |
| Included actions | 5,000 / 25,000 / 1,00,000 / 5,00,000 per month | 4,80,000 / 15,00,000 / 42,00,000 per year |
| Overage/action | ₹6.00 / 4.00 / 2.50 / 1.50 | ₹1.60 / 1.20 / 0.90; sovereign ₹0.55 |
| Verifier profile | ₹6,00,000 per regime/yr | ₹3,00,000 per regime/yr |
| Bundle export | ₹0 | ₹2,500 beyond allowance |
| L2 add-on | ₹2,00,000/month | folded into L2 floor |
Rules: refusals ₹0; floor never discountable; discounts need end date (lead ≤20% ≤12 months); no seats, no outcome pricing; **pilots free, 90 days, 2,000 actions, hard stop, ≤5 concurrent**; regulatory pack ₹1,35,000/tenant/yr. Invoice must show: platform floor, included volume, overage, **refusal line count at ₹0** ("412 refused, Rs 0, on the same table"), **"Show the records behind this line"** (write_id + seq), dispute against a seq range (line held, rest proceeds). Prices ex-GST.

### 4.22 Declaration (spec — L2 form of the rulebook, Studio designs)
Seven blocks: **identity** (declaration_id, name, slug, owner_role, residency_domain, system_of_record, lexicon_ref, description) · **shape** (record_type, fields[] with classification public/internal/personal/financial, links[]) · **permissions** (grants[]: actor_kind, role, write_type, min_autonomy A0–A5, may_approve) · **write_types** (name `<slug>.<verb>`, label, intent, blast_radius, dual_control, gates[], reversal_plan XOR irreversible, payload_schema, policy_exempt) · **gates** (nine: consent, residency, retention, dual_control, rate, budget, counterparty, schedule, precondition — only rate/budget/schedule can be disabled) · **proof_binding** (fields, canonicalisation elan1_lp_v1, salt_scope, redaction_profile) · **channels** (name, kind web/mobile/messaging/api/mcp/voice, write_types[], may_approve, mode enforced/attested_advisory). Every field: a value, `out_of_scope` + ADR, or `not_measurable` + reason + would_change_if (≥12 chars) — "never a blank". Lifecycle: Author → Validate → Simulate → Certify → Compile → Resolve (none skippable). Simulation with no refusals → "Add a fixture that fails".

### 4.23 Autonomy ladder (spec, L3)
A0 Observe (reads only; default/missing grant) · A1 Draft · A2 Propose (human approves) · A3 Act reversible (graduation only) · A4 Act bounded · A5 Act broad. "There is no API that sets an autonomy level"; graduation by dual-control governed write; revocable by one press.

---

## 5. Key flows

### F1. Decision path for one tool call (built, Fig 34)
1. **Identify** — API key (`gk_`) by SHA-256; paused agent → refuse `agent-paused`.
2. **Load rulebook** — verify Ed25519 signature every call; missing/untrusted → `no-rulebook` / `rulebook-invalid`.
3. **Resolve tool** — registry (built-in + enabled upstream); unknown/disabled/removed → `default`.
4. **Validate arguments** — against schema → `invalid-arguments`.
5. **Compute limits** — count/sum per window.
6. **Decide** — pure `decide()`: match by tool/tag, `when`/`unless`, strictest wins, limits only tighten, no match → refuse.
7. **Act** — allow (Governed run: connector runs tool, then receipt) / ask (receipt + approval row + signed links + email, nothing runs) / refuse (receipt names rule).
8. **Notify** — Slack/WhatsApp jobs; webhooks; inline behaviour check.
Any exception → refuse `gate-error` (+ health alert if the receipt can't be written). Known gap: in Governed run an allowed action runs **before** its receipt; if the write fails the agent is told "refused" although it happened.

Worked demo (R2.4): AP agent reads invoice email (Gmail demo) → creates bill in Zoho Books → pays. ₹2,00,000 to *Sharma Traders* → `pay-large` asks → approver approves → held call runs → second receipt (kind approval) → `govern verify` "Chain intact".

### F2. Approval — all channels (built, Fig 37)
- **Hold:** decision receipt (`ask`, approval pending) + approval row (agent, tool, encrypted args, evidence, rule, approver group, expiry) + signed single-use links by email + queued Slack/WhatsApp + webhook `approval.pending`.
- **Web console:** `/approvals` → `/approvals/[id]` → Approve/Reject (password only if sign-in >10 min).
- **Email / phone link:** `/approve/[token]` — signed, single-use; still asks the person to sign in.
- **Slack:** button only if rule `approve_in_chat`; Slack v0 request signature (5-min window); clicking user's **confirmed** Slack email must match a member; other workspaces ignored; no password check.
- **WhatsApp:** button only if `approve_in_chat`; Meta `X-Hub-Signature-256`; sender must match a number the member verified with a 6-digit code; number stored encrypted, matched by keyed hash.
- Otherwise chat messages carry **"Open in Elan1 Govern"** link; email always goes out. Chat is "a doorbell, not a replacement".
- **One resolver** for every channel: person must be an approver for the rule; one decision per approval.
- Outcomes: **approved** → Governed run executes at once (agent learns via `gate.approval_status`), Check-and-record agent runs it after `waitForApproval` then `record()`; **rejected** → refused, nothing runs; **expired** (24 h default, checked every minute, refused at once even before the job) → refused, args wiped; **approved but run failed** → outcome error. Second receipt kind `approval`: who, when, `details.channel`, outcome; webhook `approval.resolved`.
- Self-approval allowed but flagged (`self_approval: true`, counted by GATE-03). No dual control, quorum, delegation, re-routing (build items). Approved calls are not re-decided against the current rulebook. Emergency stop does **not** cancel waiting approvals.
- Chat-approvable never for tools tagged `deletes`, `changes_access`, `changes_production`, `personal_data`; money tools only with an upper amount; never when a limit caused the ask.

### F3. Emergency stop (built)
Owner/Admin → Emergency stop → **type `STOP`** (+ password if sign-in >10 min) → one transaction pauses every active agent, opens an **Incident** with paused ids, writes one `emergency.stop` receipt (with count), emails every owner and admin → **red banner on every page** → all new calls refused (`agent-paused`) → **Resume agents** restarts only agents the stop paused (others stay paused), one `emergency.resumed` receipt → **Incident report PDF** (who stopped/resumed, alerts, receipts from 1 h before to resume, ≤300 rows, range for govern verify). Only one stop open at a time. Gap: does not expire pending approvals.
Per-agent **Pause** from agent page. **Auto-pause:** high alert + agent's switch on → `agent.paused` receipt naming the alert.

### F4. Add agent (built: 3 steps; details not in memo)
Ends with the agent able to call `POST /mcp` with its API key (shown once) for MCP clients (Claude Desktop, Claude Code, Cursor) or `/v1/check`+`/v1/record` via TS/Python SDK (LangChain, OpenAI Agents SDK, plain Python examples). Agent owner + risk level set; rulebook (from industry pack starter) attached; auto-joins inventory.

### F5. Rulebook author → try → test → diff → sign & publish (built, Fig 36)
1 **Draft** (visual + YAML, starts from industry pack; rules by tool/tag; limits) → 2 **Try an action** (one made-up call → decision + rule) → 3 **Test on past actions** (7/30 days, ≤200 changed calls, "could not be judged" count) → 4 **Versions & diff** → 5 **Sign & publish** (owners/admins; validations; Ed25519; active signed rulebook checked every call). Nothing runs, is signed or published by a test.

### F6. Rule suggestions loop (built)
People answer approvals → nightly 02:00 IST (or **Look for suggestions**) mines 30 days → qualifying group → replay-check → suggestion card → **Open as draft** (back to step 1 of F5; a person must sign & publish) or **Dismiss** (receipted; returns only when approvals at least double).

### F7. Evidence export + offline verify (built)
`/evidence` → Export auditor pack (owner/admin/auditor) → `evidence.exported` receipt → download zip → on auditor machine `govern verify auditor-pack.zip` (offline, no account) → ideally with `--key org.pem` obtained separately or compare printed fingerprint → exit 0/1/2. Diligence check: edit one receipt → verifier names it. In console: Activity → Verify this receipt.

### F8. Spec'd L2 export (designed, §11.4)
Assurance · Evidence · Export → choose seq or date range + profile (or "No profile claimed"); screen shows **record count, refusal count, unanchored head** before generating → prepare (resolve declarations/lexicons; missing ones named) → gate check (residency, retention, consent, precondition: nightly integrity run) → assemble → "Export ready — 12,480 records, 611 refusals, 22 unanchored, profile in-mca-audit-trail v1" + bundle digest → copy: **"Verify it yourself first. If it does not pass for you it will not pass for them."** Refusal paths offer alternatives ("Export the clean range instead", sub-ranges by profile version, size limit with suggested split — never silently truncated).

### F9. Auditor switching client organisations (built)
Auditor role (read + export) with memberships in several orgs → organisation switcher in the shell → export each org's auditor pack. Auditor portal design merged into this.

### F10. Onboarding (built)
`/signup` → `/onboarding`: **company → industry (7 packs) and regions (India, EU, UK, US) → demo**. Industry selects starter rulebook, frameworks (ISO 42001 + NIST AI RMF + region frameworks), controls, risk questions. Not asked: currency, time zone (gap). Invitations: `/invite/[token]` single-use.

### F11. SSO setup (built)
Owner → `/settings/sso` → configure generic OIDC (issuer, client) with PKCE/state/nonce → add domain(s) → publish DNS TXT `gate-verify=…` → verify → optional **SSO-only** → users created on first sign-in. One connection per org. SAML/SCIM not built.

### F12. Assessments and sign-off (built)
Approver/Admin drafts assessment from template → answers → score with explanation → submit → owner/admin (not submitter) signs off → system tier set, next review scheduled; receipts written.

### F13. Key rotation (built)
Owner, fresh sign-in → rotate → `key.rotated` receipt signed by old key → old key retired at that time → all rulebooks re-signed → bundles carry all kids.

### F14. Spec'd developer onboarding (designed, §6.9)
Sandbox key (work email, company, one-line description → verification link → tenant with fixtures → key shown once) → author declaration (Studio) → conformance C1–C14 → request production key (result file, declaration version, target, residency, named owner; review checks 4 things) → first invoice (two-way reconciliation; refusal count at ₹0).

### F15. Spec'd L1 → L2 upgrade wizard (designed, LATER)
Stages: 0 Pre-flight (replay whole chain: "continuous, 41,206 records") → 1 Key (bind domain key, fingerprint sent out of band) → 2 Signing on (dual control, **irreversible**) → 3 Anchoring on → 4 Profile → 5 First bundle (exit 0 PASS; tampered exits 1) → Close. Boundary: seq 1…B−1 Level 1 forever; signed from B.

---

## 6. UX, copy and design rules stated in the memorandum

### 6.1 Structural
- **Four Doors, "never a fifth"** — "There is no fifth door and no 'Settings' tab floating outside the grammar" (spec; built IA is 13 areas, P23 open).
- "An approver who presses Approve has already seen the diff, the gate results and the policy version, or the screen is wrong" (E06 one-line test).
- **Never claim more than the code proves:** a screen counts as built only when it maps to a route in the working app.
- **States every screen must show** (R14.4): Approval — waiting (with expiry), approved, rejected, expired (action refused), and decided on web / email-or-phone link / Slack / WhatsApp. Decision — allow, ask a person, refuse, where a refusal can come from **a rule**, **no matching rule**, or **an Elan1 Govern failure**.
- Loading states are missing in the build — add them.
- Ashoke's **design tokens and proof language are kept** [HB].
- Record and Proof are separate screens; Record timeline includes refusals and escalations.
- Chain status is three-valued text with scope and count — never a lone green tick.
- **Phase-1 honesty rule** (original): a screen must not render an empty "Signed by" row, anchor time or verifier verdict that doesn't exist. Note: built receipts **are** signed, so "signed" may now be shown **with the key holder named**.

### 6.2 Claim language (R13.1, §15.13, §6.8, §2.9)
- **Allowed** (with conditions): "signed" (key holder named), "hash-chained", "tamper-evident", "checkable offline by anyone with the organisation's public key".
- **Forbidden until L2:** "tamper-proof", "immutable", "court-ready", "independently verifiable", "without trusting us".
- **Never at any level:** tamper-proof; immutable; court-ready/legally admissible; certified/accredited/approved (unless a dated certificate exists: "we hold X, covering Y, issued on Z"); any regulator accepted/approved/endorsed/reviewed (incl. "in conversation with"); "the transaction was genuine"/"your books are verified"; "an anchor proves when something happened"; "we cannot see your data"; "the agent is safe because it earned autonomy"; "standardised"/"open" (say "published").
- **Check and record (SDK/REST)** copy never says "blocked", "prevented", "cannot", "we block", "we prevent", "nothing gets through without us". Permitted: "Every attempt is evaluated and recorded, including the ones we refused". Even Governed run enforces only for tools reached through Elan1 Govern.
- **Compliance:** never "compliant"; always **"Draft — needs legal review"** on every page and export.
- **"Governed Action" is a unit of account, never a button or a heading.**
- Proposed L1 claim sentence (P17/DR-017, unsigned): "At L1, Elan1 Govern decides whether a tool call is allowed before it runs. On its MCP route it holds the call for a named person where the rulebook requires it and refuses anything not explicitly allowed; on its SDK and REST routes it advises and records, and the agent acts. It records each decision it makes in a per-organisation hash chain, signed with a key Elan1 Govern holds, with hourly signed checkpoints. The record is tamper-evident. It is not yet anchored to an external time source, and not yet verifiable by a party who does not trust us."
- Do not call Elan1 Govern L2 or L3; it is "the current, partial Level 1 implementation (no meter; enforcement only on the MCP route)".

### 6.3 What must never be described as "automatic"
- **Auto-pause**: only on a **high** alert and only if the agent's switch is on (off by default); only 3 of 6 detectors can reach high. The brief's "it can auto-pause an agent on a serious alert" is true only after someone turns it on.
- **Rule suggestions / earned autonomy**: "A person decides; nothing graduates on its own." Nothing changes until someone with permission signs and publishes. No API sets an autonomy level.
- **Risk tier and next review**: never set by hand and never automatic — only from approved assessments.
- **Irreversible actions are never auto-approved**; auto-approve off by default (spec).
- **Approvals**: "re-authentication is conditional" — don't claim "password on every approval" (A205).
- Automatic **discovery** of unregistered AI is **not built** (agents do join the inventory automatically).
- Coverage is "computed from receipts", which is automatic counting — but never described as testing or proving a control.

### 6.4 Vocabulary (R13) — one name per concept
Elan1 Govern (product; entity elan1 Private Limited) · Rulebook / rule builder (not Declaration/Studio) · Tool with risk tags (not write type) · **Allow · ask a person · refuse** (wire `allow`, `ask`, `refuse`; not escalate/needs_approval) · Approval: **waiting, approved, rejected, expired** (not obligation/decline) · **Try an action · Test on past actions** (not simulate) · **Sign and publish** (not certify/compile) · **Receipt**; **Activity** is the list · Receipt chain and signed checkpoints · **Auditor pack** · `govern verify` · **Pause** (an agent) · **Emergency stop** (all agents) · Connectors incl. "Your MCP servers"; tool registry · **Industry pack** (never bare "pack") vs **Regulatory pack** (ledger1, invoice1, collect1 — specified) · Compliance → frameworks and controls · **Organisation** (not tenant) · **Risk tier** · **Governed run · Check and record** (not Mode A/B) · **Governed action** (billing unit, proposal) · Levels **L1 Guarded · L2 Attested · L3 Proven**. Sister brands lower-case (rung1, stack1, verna1, ledger1, invoice1, collect1); "Elan1 Govern" is the one capitalised exception. Internal `gate` names stay in code only.

### 6.5 Accessibility and density (original §8.9, §8.7, §8.12)
1. Keyboard-complete (queue → open → read diff → approve → confirm), visible focus ring ≥3:1.
2. Contrast 4.5:1 body, 3:1 UI elements, in **both themes**.
3. Never colour alone — pass/fail carry a word and a shape.
4. Diffs are real tables with row/column headers (screen reader: "Credit limit, before ₹3,00,000, after ₹2,40,000").
5. Live regions announce outcomes ("Approved. Posted. Proof 4101.").
6. **44 px** minimum touch targets; **Approve and Reject never adjacent without a gap**.
7. Timers announced and pausable (rec.: one declared extension, recorded).
8. Plain language translatable to Tamil and Hindi; **Indian digit grouping** (₹2,00,000; ₹20,00,000; "₹5 lakh").
Anti-rubber-stamping: no default focus on Approve (keyboard lands on the diff); state why a person is needed; Reject needs a reason; proposer as words not icon; queue row shows human/agent, amount, gate summary, countdown; bulk approve is an open question; approver telemetry (median time-to-decide, decisions without expanding a diff) recommended for Assurance.
Mobile: PWA at **360 px**; diff collapsed to changed fields; no native app in phase 1. Testing: Playwright, Storybook, Vitest, **axe-core** in CI. i18n: ICU catalogues from day one.
Built stack (for reference): Next.js 15.5 App Router, React 19.2, Tailwind, radix-ui, lucide. CSP with nonce; CSRF double-submit.

---

## 7. Roadmap items the front end should show as designed / upcoming

### 7.1 What remains (R15.2) — candidates for "coming soon" or designed states
- **Product completion (KEEP):** developer portal + no-account web verifier; incident detail; system pages (403, maintenance, offline, approvals unavailable); password recovery; legal pages; Today due-dates panel; onboarding currency + time zone; loading states.
- **Approval controls:** dual control and quorum (high-impact rules and emergency stop), delegation and re-routing, decision on self-approval, **channel labels** ("decided in Slack/WhatsApp").
- **Guard gaps:** receipt-before-act/outbox; stop expires/blocks pending approvals; limits inside chain lock; idempotency keys; shared rate limits; webhook outbox; **closed refusal-code register**.
- **Enterprise:** SAML, SCIM; KMS/HSM key provider; more connectors (**Slack, Salesforce, Jira, Tally, Razorpay**); rulebooks as code in CI; SOC 2 Type I.
- **L2 bar:** key custody per residency domain; two-authority RFC 3161 anchoring; record-format decision (P20); second independent implementation + 64 vectors; verifier with six exit codes; verifier profiles; out-of-band key publication.
- **Commercial:** meter and billing for the governed action (A197).

### 7.2 Assurance ladder (Fig 25) — for assurance screens (all LATER)
| | L1 Guarded | L2 Attested | L3 Proven |
|---|---|---|---|
| Built status | PARTIAL (no meter; enforcement on MCP only; receipts already signed) | not claimed (Ed25519 + offline verifier exist) | specified |
| Adds | rules, approval, hash chain | Ed25519 over frozen preimage; KMS custody per residency domain; Merkle → RFC 3161 at two TSAs (one India-based, ≤15 min); 8-member bundle; free zero-dependency verifier; verifier profiles; unanchored head shown | cross-org verification; selective disclosure; customer-held keys; sovereign deployment; precedent intelligence; earned autonomy A2→A3; Action Receipt open standard; second implementation; non-elan1 counter-signature |
| Buyer / question | Ops/finance: "can I let this run?" | Auditor's counterparty: "can I hand this over?" | Market: "does this survive the vendor?" |
| May say | "checked against versioned rules before it happened; a person approved; tamper-evident to you, the chain holder" | "a party with our key fingerprint, got out of band, can verify this bundle on an air-gapped machine with no elan1 process" | "the format is open; a receipt stays checkable after we are gone" |
| Plan price (IM) | ₹1,80,000/tenant/yr | ₹6,00,000 | ₹24,00,000 |
| Original target date | GA Q2 2027 (30 Jun 2027) | GA 30 Apr 2028 | entry Oct 2029 (modelled) |
All original dates "to be re-set" by the founder (A204); show as targets, not commitments.

### 7.3 L3 screen concepts (LATER)
- **Counterparty receipts (L3)**: issue a receipt to a counterparty (audience org_id `ar-org:<domain>`, nonce, expires_at e.g. 7 days, chosen disclosures); receive/verify in order (audience → expiry → key discovery route 1 pinned fingerprint / 2 `/.well-known/action-receipt-keys` / 3 trust anchor; never in-receipt hint → signature → anchor or "UNANCHORED" → disclosures → replay); bind into own chain. Limits line: "this establishes that the issuer's governed write path produced this record under these rules at this time; it does not establish that the underlying transaction occurred."
- **Selective disclosure:** revealed vs committed fields per recipient.
- **Precedent & earned autonomy:** per action class counters (approved_unamended, approved_amended, declined, expired), eight eligibility checks (≥90 days history, ≥200 records/≥100 approvals…), graduation A2→A3 by dual-control write, one-press revocation; counts shown beside any model-written summary.
- Regulator, partner, counterparty portals; trust centre.

### 7.4 Billing / meter screens (LATER — no code)
Meter (governed actions by type, refusals at quantity 0 on the same table, cost to date); plan/tier; invoices with floor, included, overage, **refused ₹0 line**, "Show the records behind this line", dispute a seq range; pilot entitlement (90 days, 2,000 actions, hard stop → `POLICY.TENANT_STOPPED`, "Writes are paused", then read-only 30 days); verifier-profile entitlements; regulatory pack subscriptions.

### 7.5 Regulatory packs (specified)
ledger1 (ERPNext GL), invoice1 (GST e-invoicing), collect1 (RBI collections conduct — four obligation layers, fourteen gates). Pack = declaration + certified verifier profile + export mapping under one dated obligation. Show only as "specified".

---

## 8. Known caveats to reflect in UI copy (honest states)
- Gmail and Zoho Books live mode never run against real accounts; default is **demo** (in-memory, reset on restart).
- Governed run gap: an allowed/approved action may have run even if its receipt failed — surfaced as a **health alert** naming tool + connector reference.
- Calls rejected before the guard (bad key, rate limit) leave no receipt.
- Concurrent calls can jointly exceed a daily limit.
- Verifier trusts the bundle key unless `--key`/fingerprint used — make the key check the documented default for auditors (T25).
- GATE-09 "Agents never hold credentials" holds only on the MCP path.
- No customer, no production deployment, no certification; all screenshots are seed data.
