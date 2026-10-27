# Competitor UX teardown, batch 1

**Vendors:** Credo AI, ServiceNow AI Control Tower, IBM watsonx.governance, Palantir AIP, Boomi Agent Control Tower, Microsoft Agent 365, OneTrust AI Governance, Trustible, Holistic AI, Saidot
**Research date:** 24 Sep 2026 · **Scoring frame:** E08 Competitive Matrix v3 (two axes, four columns; "designed" is not "yes") · **Watch frame:** O08 Group Competitor Watch
**Data:** `competitors-1.json` (same folder) · **Screenshots:** `build/assets/competitors/<slug>-<n>.jpg`, 29 files. Every screenshot was opened and checked, and its caption says where it came from and whether it is a real console, a docs screenshot or a marketing render.

Everything below comes from public material. Claims marked [unverified] come from vendor marketing or announcements and have not been seen working in production. Following O08 and DR-010, an announcement counts as a signal and does not move a matrix cell.

---

## 0. Summary

1. **Nine of the ten central objects are something other than the business write.** Credo, Trustible and Saidot centre on the use case or system. IBM and Holistic centre on the model or asset. ServiceNow centres on the CMDB configuration item. Boomi and Microsoft centre on the agent or its identity, and OneTrust on the project and its data assets. Palantir is the only one whose screens are drawn around the **action** (see the action type page: Input → Rules → Submission criteria → History).
2. **The UI grammar has converged.** Almost every product has a KPI tile row, then a donut or gauge of risk tiers, then an inventory table with state and status pills, then a record page with tabs and a review side panel. elan1 has to match this baseline. Nobody should see an unfamiliar layout when they open elan1.
3. **"Enforcement" moved in 2026, but it stops at the model, the gateway or the identity:**
   - ServiceNow: kill switch, AI Gateway and Intelligent Approvals, GA August 2026.
   - Boomi: an AI Gateway that "holds high-risk actions until human approval", 2 Sep 2026 [unverified].
   - OneTrust: block, redact and route guardrails at the model and MCP layer [unverified].
   - Microsoft: block an agent at the identity level.

   None of them shows a record of the business write, and none shows a signed or chained artefact.
4. **Refusals are counted, not recorded.** Palantir shows failure types in its metrics, OneTrust counts "blocked, redacted, routed" activity, and Boomi shows error counts. No product in this batch has a page for one refused action with its reason, its policy and its evidence. That page is the gap on screen.

### Matrix (E08 columns, as of Sep 2026)

| Vendor | Central object | Enforce | Per-action record | Independently checkable | Refusal is evidence |
|---|---|---|---|---|---|
| Credo AI | use case / model | No | No | No | No |
| ServiceNow AICT | AI asset as a CMDB item + workflow record | Partial: inside ServiceNow; kill switch and AI Gateway GA Aug 2026 | Partial: workflow records | No | No |
| IBM watsonx.gov | model / use case | No | No (Enforcement Tracking pulls agent metrics on a schedule) | No | No |
| Palantir AIP | Ontology action | Yes, on Foundry objects only | Yes, on Foundry objects only | No | Partial |
| Boomi ACT | agent / integration | Partial: kill switch; approval hold announced Sep 2026 [unverified] | No: logs | No | No |
| Microsoft Agent 365 | agent identity | Partial: identity, DLP, block | No: audit logs | No | No |
| OneTrust | AI project / policy | No (2026 runtime guardrail claims at the model layer are [unverified]) | No | No | No |
| Trustible | use case | No | No | No | No |
| Holistic AI | AI asset / model risk | No | No | No | No |
| Saidot | AI system + knowledge graph | No | No | No | No |

**Watch-list movements (O08):**
- **A4 (Boomi):** moving. The 2 Sep 2026 AI Gateway approval hold is the nearest thing to elan1's gate in this batch. The trigger has not fired, because no per-action record of the business write has been shown.
- **A1 (ServiceNow):** Knowledge 2026 says Control Tower works "across any system", with 30 integrations. No ERP write operations or approvals on external records were found. Keep checking monthly.
- **A3 (IBM):** the Aug 2026 Enforcement Tracking announcement says "governance proof" but mentions no signing, hashing or chaining. Not fired.
- **A5 (Palantir):** the May 2026 Ontology MCP servers let external agents **into** Foundry. That is the reverse of the trigger. Not fired.
- **A2 (Microsoft):** GA was 1 May 2026 at $15 per user per month, also bundled in E7 at $99. This answers E08 open question 3: the price is GA pricing, not an announcement.

---

## 1. Per-vendor teardown

### Credo AI (3 screenshots)
- **What it is:** a use-case registry with a governance workflow built around it. Navigation:
  - **Registry:** Home · Dashboard · AI registry (Use cases, Models, Vendors).
  - **Governance Center:** Stages, Questionnaires, Triggers & Actions, Policy Packs, Risk configuration, Control library, Fields.
  - **Record rail:** Overview · Questionnaire · Risk · Compliance, then Artifacts: Review history · Reports.
- **Done well:**
  - The record header is exactly right: name, ID `UC-1051`, a stage chip, a status chip ("Collecting evidence") and one primary CTA ("Submit for review").
  - A "Review in progress" side panel shows how many reviewers have signed off, the due date and the comments.
  - The policy packs are readable by people who are not engineers.
  - GAIA (GA 13 May 2026) lets the user accept, edit or reject each AI suggestion, and shows the reasoning for each.
- **Missing:**
  - A review gates a use case's lifecycle stage. It never gates a write.
  - The product page claims "trace-level policy enforcement" [unverified], but there is no action object behind it.
- **elan1:** reuse the header and the review side-panel grammar, but bind them to **one pending business write**, and show the diff of that write.

### ServiceNow AI Control Tower (4)
- **What it is:** the threat with the most distribution. Its docs UI has a 10-tab row: Overview · AI strategy · AI asset inventory · Value · Health · Evaluation · Risk & compliance · Security & privacy · AI cases · AI Gateway. The new UI shown in marketing has a left rail: Home · Activity center · Plan · Inventory · Govern · Insights · Settings.
- **Done well:**
  - A **"Top items to review"** strip turns the dashboard into a work queue ("6 AI systems have 11 tasks past due · 252 assets pending review").
  - Lifecycle tiles show counts: New, Assess, Build and test, Deploy.
  - The inventory keeps **asset state** (lifecycle) apart from **asset status** (review outcome).
  - A "Refine list" drawer handles filtering.
  - "Automate with AI" split buttons sit on action items.
- **Missing:**
  - The unit is the AI asset, not the write.
  - Records are ServiceNow's own workflow records, which nobody outside can verify.
  - The 10-tab row is heavy to use.
- **elan1:** put a "top items" strip at the top of Work, separate state from status, and show the system of record ServiceNow does not own (ERPNext, Tally, SAP) as a first-class column.

### IBM watsonx.governance (2)
- **What it is:** two surfaces that do not share a design:
  - The OpenPages-based **Governance console**, with task tabs My Tasks / Subscription Tasks / Oversight Tasks, big-number donut widgets, and records that open as tabs.
  - The **watsonx cloud UI**, which holds the "Governed agentic catalog": filter facets on the left and a card grid of approved tools.
- **Done well:**
  - "Oversight Tasks" gives human reviewers a first-class queue.
  - The catalog of "approved components only" is easy to understand.
  - Regulatory links (SR 11-7, E-23) sit next to the work.
- **Missing:**
  - Everything is model-centric: models by risk tier, factsheets.
  - Enforcement Tracking (11 Aug 2026) pulls evaluation metrics on a schedule and stores them as evidence. It happens after the fact, is unsigned and is per agent, not per action.
  - Real screenshots are full of "No Value" and zero widgets.
- **elan1:** give each user a personal landing page with queue counts. Never ship dashboards that fill with zeros. Use "governance proof" as the foil in the pitch: IBM's proof is a scheduled metric, elan1's is a checkable record per write.

### Palantir AIP (4)
- **What it is:** the architecture that proves the elan1 design, and the best reference screens for it. The action type page has a left rail: Overview · Rules · Parameters · User Interface · Capabilities · **Security & Submission Criteria** · Automations · History · Observability.
- **Done well:**
  - The main pane draws the write before it runs, as **Input → Rules** (Modify Patient, Create Alert).
  - A **Dependents** panel shows the blast radius.
  - Action metrics show success against named failure types over time, with a link to run history.
  - Agent Studio shows a per-turn **Reasoning** chain: query → ontology context → prompt → output.
- **Missing:**
  - It only works on Foundry objects.
  - It is a configuration tool built for engineers, not a view an auditor would use.
  - A refusal shows up as a failure count, not as a record you can open.
- **elan1:** build the Records page as **Input → Policy → Decision → Write → Proof**. Make every metric bar open the individual proof records. Win on portability, and on a proof page that a stranger can verify.

### Boomi Agent Control Tower (2)
- **What it is:** Agentstudio has two top tabs, Agent Garden and Agent Control Tower, and an icon rail. Screens include a status counter strip (Total / Not applicable / Inactive / Active / Draft), a bubble map of agents grouped by provider, and a Monitoring and Compliance page with KPI deltas, an "AAGEI" radar score and a trust-level donut (Endorsed / Deprecated / Not endorsed).
- **Done well:**
  - The cross-vendor registry is easy to see at a glance.
  - The kill switch is a single, clear verb.
  - Endorsement status is a simple state that makes sense.
- **Missing:**
  - Everything is telemetry: tokens, invocations, errors.
  - The composite radar score is opaque, which makes it a liability in front of an auditor.
  - The 2 Sep 2026 approval hold has not been shown publicly [unverified].
- **elan1:** add a counter strip to the Agents door and a pause verb whose use is itself a proof record. Show plain counts (allowed / held / refused), not composite scores.

### Microsoft Agent 365 (4)
- **What it is:** Agents lives inside the M365 admin shell: Overview · All agents (Registry | Map | Requests) · Shadow AI · Tools · Settings.
- **Done well:**
  - **KPIs that count governance gaps**: Agents at risk, Agents without owners, Unmanaged agents.
  - **"Top actions for you"** cards: Pending requests, At risk, Without owners, With exceptions. Each card has a short list and one CTA ("Manage requests", "Assign owners").
  - A right-hand flyout opens a record without leaving the list, with tabs Details / Users / Data & tools / Security / Permissions / Certification / Activity and Block/Uninstall actions.
  - A two-button request review: "Publish to…" or "Reject submission".
- **Missing:**
  - Microsoft governs **who the agent is**. It does not record **what the agent wrote**.
  - The record is a Purview audit log written by the same vendor that runs the agent.
  - Blocking an agent is a state change, not evidence.
- **elan1:** copy the gap KPIs and the action-card row almost literally, with labels such as "writes without a named approver" and "agents with write scope but no policy". Make the approval card richer than Publish/Reject: show the exact write, the policy that was hit, and the proof that will be emitted.

### OneTrust AI Governance (2)
- **What it is:** the AI Program Center, shown only as marketing renders. It has:
  - a **context banner** ("New data has been linked to the Lessonly project. Review project…");
  - **widgets titled as questions** ("What is the risk of my AI projects?", "Are your projects on track?");
  - project rows with paired pills (Pending review + New risks);
  - a recent activity rail.
- **Done well:**
  - The copy that sounds most like elan1 in this batch: "Prove governance in production", "Track blocked, redacted, routed, and allowed activity".
- **Missing:**
  - The runtime controls act on the prompt, the model or MCP, not on the business write.
  - The "evidence" is a set of aggregate counts.
  - No real console is shown publicly.
- **elan1:** give Assurance widgets question titles an auditor would ask. Use event-triggered banners, such as "Policy v7 changed, so 3 agents need re-approval". Every count must open the individual records.

### Trustible (2)
- **What it is:** an Executive Dashboard with tabs Executive / Workflows / Task Management, "Share this dashboard", an "On this page" jump list, and a dark-header table with status, ROI, **inherent and residual risk**, number of risks and number of mitigations. It also has risk-based routing lanes: Low is auto-approved, Medium goes to standard review, High goes to deep review, each with an SLA countdown.
- **Done well:**
  - It argues openly that the use case, not the model, is the right unit to govern. That is the philosophy closest to elan1 among the documentation tools.
  - Triage is designed for throughput.
- **Missing:** everything happens at design time.
- **elan1:** use approval routing lanes with SLAs (auto-allow / single approver / dual approval). Give auditors a read-only, shareable Assurance view. Show each approved use case together with the live writes it has produced.

### Holistic AI (3)
- **What it is:** a shadow-AI discovery table with risk percentages, category pills and source icons; KPI cards that highlight the one actionable number ("78 pending reconciliation"); completeness fractions (40/50 reconciled, 269/291 linked); a sign-off gauge (3/3 high-risk assets signed off); and risk radars.
- **Done well:**
  - Discovered items go into staging and are then reconciled, so "found" and "accepted" are separate states.
  - The fractions make completeness honest.
- **Missing:**
  - A model-risk focus.
  - Guardian/Sentinel agents are not specified as blocking [unverified].
- **elan1:** use fractions for proof coverage ("1,204 / 1,204 writes with verified proof"). Give newly discovered agents a staging lane: discovered → registered → scoped → live.

### Saidot (3)
- **What it is:** a two-mode left rail, Library or Governance. Governance has a space switcher, Home, Systems and Catalogues (Agents, Datasets, Models, Controls). Page titles are set in serif, each with a one-line statement of purpose. KPI tiles show month-over-month deltas (Classification rate, Control readiness, Pending reviews). The Library Feed shows event cards with Follow buttons and a trending rail. An AI Governance Agent posts in chat ("3 new risks now flow to 1 linked system… Logged on your system: `gasr796…`") and opens a Jira ticket.
- **Done well:**
  - The best story in the batch for **how a change spreads** (risk inheritance through the graph).
  - Calm, premium typography.
- **Missing:** everything is design-time, and the logged IDs are internal only.
- **elan1:** add a propagation view ("Policy P-12 changed, so these agents and these pending writes are affected"). Put a one-sentence purpose line under every page title. Use feed-style event cards in Assurance.

---

## 2. Patterns across vendors

| Pattern | Seen in | Verdict for elan1 |
|---|---|---|
| KPI tile row + risk donut or gauge + inventory table | all 10 | **Match.** It is the baseline users expect. Tiles must count writes and gaps, not AI assets. |
| Record header: ID + stage chip + status chip + one primary CTA | Credo, MS, Palantir | **Match exactly** on every elan1 record. |
| Lifecycle state kept apart from review status | ServiceNow, Credo | **Match.** For a write, state is proposed / held / executed / reverted and decision is allowed / approved / refused. |
| "Top items / top actions for you" work queue | ServiceNow, Microsoft | **Match.** It is the home of the Work door. |
| Review side panel (reviewers N/M signed off, due date, comments) | Credo, IBM | **Match and extend**, binding it to one write with its business diff. |
| Right-hand flyout from a table row | Microsoft, ServiceNow | **Match** for Records and Agents. |
| Risk-based routing lanes with SLAs | Trustible | **Adopt** for approval policies. |
| Questions as widget titles | OneTrust | **Adopt** in Assurance. |
| Change feed and propagation | Saidot, OneTrust | **Adopt** for policy changes. |
| Rules / submission-criteria graph per action | Palantir | **Adopt and make plain-English.** This is elan1's core screen. |
| Composite scores (AAGEI radar, trust %) | Boomi, Holistic | **Avoid.** An auditor cannot defend them. |
| Tab rows of 8 to 10 | ServiceNow, Microsoft flyout | **Avoid.** Four doors, and at most four to five tabs per record. |
| Empty or zero dashboards | IBM | **Avoid.** Default to the latest governed writes. |
| Refusal shown as a failure count | Palantir, OneTrust, Boomi | **Beat it.** Each refusal gets its own openable record. |

---

## 3. How elan1 wins in the UI

The structure is the Four Doors: **Work · Records · Agents · Assurance**. Each door should look familiar to anyone who has used these ten products, but everything on it should be about the business write.

1. **Work.** Open with a "Needs you" strip, as ServiceNow and Microsoft do: approvals waiting on me, writes held by policy, refusals to acknowledge, proofs that failed verification. Each approval card shows:
   - the **business diff** (for example, "Credit limit ACME Ltd ₹5L → ₹12L in ERPNext");
   - the agent, the policy rule that required approval, and an SLA countdown;
   - "Approve / Refuse with reason";
   - the line "this decision will emit proof #…".
2. **Records.** The primary table is one row per governed write, with these columns:
   - system of record
   - object
   - agent
   - decision (allowed / approved / refused)
   - approver
   - proof status

   Opening a row shows Palantir's anatomy rewritten for an auditor: **Input → Policy → Decision → Write → Proof**. Show the policy text in plain English, not only as a rule ID.
3. **Refusal is a first-class record.** A refused write gets the same page as an executed one: who proposed it, which rule refused it, who confirmed, and the proof hash. No product in this batch has this page, so it is the most distinctive screen elan1 can ship.
4. **Agents.**
   - Use Microsoft's gap KPIs: without an owner, with write scope but no policy, unmanaged.
   - Use Boomi's counter strip.
   - Use Holistic's staging lane (discovered → registered → scoped → live).
   - Per agent, replace composite scores with plain counts: writes allowed, held and refused over 30 days.
   - Give each agent a pause verb that itself emits a proof record.
5. **Assurance.**
   - Widget titles are questions an auditor would ask (from OneTrust).
   - Proof coverage is shown as a fraction (from Holistic): "1,204 / 1,204 writes carry a verifiable proof".
   - There is a feed of policy changes with their propagation (from Saidot).
   - A read-only link can be shared with an auditor (from Trustible).
   - The difference from every vendor: a **"Verify independently"** action that checks a proof outside the elan1 console. This is the one cell that is empty for every competitor.
6. **Shared record grammar.** Every page has a record header (ID + state chip + decision chip + one CTA), a one-line purpose sentence under the title, a flyout from any table row, and at most five tabs.
7. **Honesty.** Any count must open to the records behind it. elan1 should never show a number, donut or score that cannot be traced to the individual writes and their proofs. That matches E08's rule, and it is the design rule none of the ten products follows.

---

## Sources (main)
- Credo AI: credo.ai/product · credo.ai/ai-agent-registry · credo.ai/blog/announcing-general-availability-of-govern-ai-assistant-gaia-credo-ais-ai-governance-agent
- ServiceNow: servicenow.com/products/ai-control-tower.html · ServiceNow newsroom, 5 May 2026 · servicenow.com/docs AI Control Tower pages
- IBM: ibm.com/new/announcements/from-governance-policies-to-governance-proof-with-enforcement-tracking-for-watsonx-orchestrate · ibm.com/new/announcements/introducing-the-agentic-control-plane · g2.com/products/ibm-watsonx-governance
- Palantir: palantir.com/docs/foundry (logic, chatbot-studio, ontology-manager, action-types/action-metrics, announcements/2026-05)
- Boomi: boomi.com/platform/agentstudio · help.boomi.com Agent Control Tower docs · techtarget.com (2 Sep 2026) · AWS ML blog (Boomi + AWS)
- Microsoft: learn.microsoft.com (agent-registry, agent-requests, agent-details) · techcommunity GA post (1 May 2026) · samexpert.com/agent-365
- OneTrust: onetrust.com/solutions/ai-governance · siliconangle.com (9 Mar 2026)
- Trustible: trustible.ai · trustible.ai/platform-overview · PR Newswire (22 Jul 2026) · thectoclub.com/tools/trustible-review
- Holistic AI: holisticai.com · holisticai.com/blog/enterprise-ai-inventory · holisticai.com/blog/shadow-ai-discovery-risk-scoring-staging-reconciliation
- Saidot: saidot.ai · saidot.ai/product · saidot.ai/pricing · help.saidot.ai
