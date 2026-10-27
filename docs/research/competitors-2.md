# elan1 competitive UX research: batch 2

**Date:** 24 Sep 2026 · **Scope:** Airia, ModelOp (+ Kong), Monitaur, Zenity, Noma, Cranium, Relyance AI, Truyo, SAP (Joule / AI Agent Hub), Crator, plus light-touch O08 watch rows (Frappe, Odoo, Zoho, Agentforce price anchor, Tally, OPA, stack1 infrastructure). Benchmarks: Vanta, Drata, Linear, Stripe, Datadog, Vercel, Sigstore Rekor.
**Structured data:** `research/competitors-2.json` (24 entries, 27 verified screenshots in `build/assets/competitors/`).

**Method and honesty rules.** Everything below comes from public material read on 24 Sep 2026. Matrix cells follow the E08 v3 rule: "designed" does not count as "yes". Anything I did not see is marked as unverified or as a finding by absence. Every screenshot was opened and checked before it was captioned. Most of them are vendor marketing renders or docs images, not live tenants, and each caption says which. I dropped four captures because they turned out to be decorative art, not product UI: Cranium's radar hero, Truyo's warranty card, Airia's abstract risk table, and one Monitaur image that rendered blank.

---

## 1. What batch 2 adds to E08

| Vendor | Object | Enforce | Per-action record | Independently checkable | Refusal is evidence | Change vs E08 v3 |
|---|---|---|---|---|---|---|
| Airia | agent | Partial: Agent Constraints at the tool-call layer, with human-review escalation | No (execution logs) | No | No | **Watch.** Airia now claims execution-layer blocking plus human-in-the-loop (HITL) routing. That is the closest shipped claim to elan1's "gate + human approval" in this batch. |
| ModelOp + Kong | model + API endpoint | Partial: gateway allow/deny (partnership 16 Jul 2026) | No | No | No | Confirms E08. Enforcement happens per endpoint, not per business write. |
| Monitaur | model + transactions | No | Partial (model decisions) | No | No | FlightSim is now a standalone product (15 Sep 2026). Its scorecards are vendor-produced and unsigned. |
| Zenity | agent (security) | Partial: inline block | No (forensic traces) | No | No | Raised a $125M Series C (3 Aug 2026). O08 A6 acquisition risk goes up. |
| Noma | agent / AI runtime | Partial | No | No | No | The Agentic Risk Map shows agent → write tools. It is the best visual analogue to an elan1 declaration. |
| Cranium | AI system (AI Card) | No | No | No, but shared externally | No | **E08 threat #2 signal.** The Cranium site now says "automated attestation" about the AI Card. It is not a signed decision, so re-check it every quarter. |
| Relyance AI | data flow | No | No | No | No | No change. It has the strongest IA discipline in the batch (verb-grouped rail). |
| Truyo | use case / privacy request | No | No | No | No | Gartner MQ Leader (22 Jun 2026). Sells a "Trust Warranty" of up to $1M. |
| SAP AI Agent Hub | agent fact sheet; SAP document inside S/4 | Partial, inside SAP | Partial, SAP trail | No | No | **O08 C1 is live.** Per SAPinsider, the Hub is included at no additional cost in SAP's Business AI Platform. |
| Crator | ERPNext change set; native approvals | Partial, ERPNext native authorization on hosted sites [our reading] | Partial, ERPNext version trail | No | No | **O08 B4 not triggered.** Crator is hosted-only with USD pricing ($100/mo plus $50 hosting). |
| Odoo 19 agents | Odoo record | No: the documentation describes agents that write records without any approval step | No | No | No | **O08 A8 half-fired.** Odoo AI mutates records with no gate, which is an argument *for* elan1. |
| Frappe | DocType | Partial (native workflow) | Partial | No | No | **B1 not triggered.** The Aug 2026 "Bob" builder AI adds approvals for sensitive *build* changes, not runtime writes. |

**The gap from E08 §04 is still empty:** nobody in this batch enforces at the business write, portably, with a record a stranger can check. Three vendors have moved toward its edges:

- **Airia** has runtime enforcement plus HITL.
- **Cranium** has an outward-facing "attestation" object.
- **SAP** gives governance away free.

elan1's row still reads No in all four columns until a governed write runs in a customer tenant.

---

## 2. Vendor teardowns (short form; full fields in the JSON)

**Airia.** Airia's four verb pillars (Discover · Secure · Govern · Optimize) are the closest IA analogue to elan1's Four Doors, which is exactly why a buyer could confuse the two. Its polish is consumer-grade: KPI tiles with weekly deltas, and natural-language question chips on the dashboard. Its weakness is the object. Airia's rows are agents and assets, and its evidence is an execution log with a "Generate Compliance Report" button. *Takeaway:* elan1's headline tiles must be business nouns ("Writes held for approval", "Refused today", "Receipts sealed"), never "agents discovered". (`airia-1`, `airia-2`)

**ModelOp + Kong.** Governance and enforcement live in two products joined by a partnership: ModelOp decides, and Kong allows or denies an endpoint. The inventory has a "Governance completion %" column, and model lifecycles are drawn as a BPMN-style canvas. The Kong UI is plain API analytics. *Takeaway:* elan1 should say "policy, gate and receipt in one hop", and borrow completion % as an Agents-door readiness bar (declaration complete, approver set, key custody set). (`modelop-1..4`)

**Monitaur.** Its left rail is Home · Governance · Models · **Transactions** · **Audit**, so evidence is top-level. Its outcome donut splits decisions into *write policy / do not write policy / human review*. That is almost exactly elan1's Allowed / Refused / Held. *Takeaway:* use that three-way donut on the Work door, and give Refused equal visual weight. (`monitaur-1`)

**Zenity.** A mature security inventory: query selector, search, removable filter chips, "Add filter", and risk and criticality columns, with platform icons on every row. *Takeaway:* reuse the filter grammar on every elan1 list. The row's title should be the business write, with the agent runtime icon as secondary metadata. (`zenity-1`)

**Noma.** The Agentic Risk Map (agent → toolsets / knowledge / channels) puts red badges on "Delete Salesforce records" and flags "external triggers bypass human-in-the-loop review". *Takeaway:* the Agents door should draw agent → declared write capabilities per system of record → approval rule → last receipt, with money-moving edges shown in red. The right-drawer detail keeps the list in view. (`noma-1`, `noma-2`)

**Cranium.** Cranium is the only vendor with an outward-facing proof object: the "AI Card", shared through Trust Hubs. But its evidence is a percentage score ring. *Takeaway:* elan1's outward object is the receipt plus the evidence bundle, and its UX centres on **verify**, not on a score. Watch Cranium's "attestation" wording under E08 threat #2. (`cranium-1`)

**Relyance AI.** The sidebar is grouped by verb (ACT · OBSERVE · MANAGE · COMPLY), which proves that verb doors scale. The lineage drawer shows "Last scanned 14 hours ago". *Takeaway:* add freshness stamps everywhere ("Chain head verified 2 min ago"), and use an agent × system-of-record heat-map on Assurance. (`relyance-1`, `relyance-2`)

**Truyo.** An EU-AI-Act risk-tier donut over a use-case list, an icon-only rail, and a commercial warranty. *Takeaway:* buyers pay for assurance, so price the receipt. Keep the doors labelled (no icon-only rail). (`truyo-1`)

**SAP AI Agent Hub.** The Discovery Inbox (Action needed / Linked / Rejected) triages every discovered agent, and a slide-over with Overview / Details / Analytics / **Changelog** tabs sits on every object. *Takeaways:*
- Make the Agents door onboarding an inbox: every agent seen at the MCP boundary lands as *Undeclared* and gets **Declare** or **Block**.
- Put a Changelog tab on every object; for elan1 that tab is the receipt chain.
- Never pitch elan1 as an agent inventory. SAP, Microsoft and ServiceNow now give that away. (`sap-1`, `sap-2`)

**Crator.** The best review-before-publish micro-UX in the set:
- A "Ready for review · Discard / Keep changes" bar.
- A Sales Order with a "Pending Approval" pill and Actions → Approve / Reject.
- A chat panel that explains the effect of each change in plain bullets.

*Takeaway:* this is the template for elan1's approval card. Crator is also O08 row B4: hosted-only and USD pricing, so the trigger has not fired. (`crator-1`)

---

## 3. Benchmarks (quality bar for the console)

| Benchmark | What to steal | Screens |
|---|---|---|
| **Vanta** | The Trust Center shape: tabs (Overview / Resources / Controls / Subprocessors / Updates / FAQ), a live "Updated 5 min ago" pill, gated documents behind "Request access", and controls as green-tick checklists. The in-app report uses date-range and framework chips. | `vanta-1`, `vanta-2` |
| **Drata** | A failure-first hero ("15 Failed Control Tests · Fix Now"), a readiness gauge, and **"View Raw Evidence"** next to every chart. Nav is grouped Compliance / Risk / Governance. | `drata-1` |
| **Linear** | A contextual command menu that acts on the selection, short human IDs with status glyphs, recently viewed items, an Inbox, and optimistic UI. | `linear-1`, `linear-2` |
| **Stripe** | The Workbench Events list (monospace type plus a plain-English line) with a right-hand detail pane: origin, source, API version, collapsible JSON, copyable IDs and a Test-mode toggle. | `stripe-1` |
| **Datadog** | A query bar with a small grammar and inline syntax errors, a time histogram over the results, a facet sidebar with counts, and outcome colour bars on rows. | `datadog-1` |
| **Vercel** | A Live toggle for streaming logs, a mini histogram, accordion filters with counts, and tabular monospace times. | `vercel-1` |
| **Sigstore Rekor** | A public, login-free verifier: search by index, UUID, hash or email → entry card with index, integrated time (relative + ISO), hash, signature and certificate, all as permalinks. | `rekor-1`, `rekor-2` |

---

## 4. World-class patterns to adopt

1. **A command palette (⌘K) that acts on the selected record.** Following Linear, the verbs are *Approve*, *Refuse with reason…*, *Open receipt*, *Copy verify command*, *Jump to agent*, and *Filter Records by this rule*. The palette also navigates the Four Doors with G-then-W/R/A/S (Work, Records, Agents, Assurance).
2. **Keyboard-first approval inbox.** J/K moves between items, **A** approves, **R** refuses (a reason is required), **E** escalates, **?** opens the shortcut sheet. Show the item count and an "all clear" empty state. Approvers should clear the queue without a mouse.
3. **Short IDs and a status glyph set.** Every governed write gets a short ID (`GW-1042`), plus the full receipt hash in monospace. Four glyphs are used consistently everywhere: *held* (clock), *allowed* (check), *refused* (slashed circle, as prominent as allowed), and *sealed* (seal).
4. **An event log in the Stripe/Datadog shape for Records.**
   - Left list: event type in monospace (`gw.write.refused`) plus a plain-English line ("AP-bot tried to post ₹4,20,000 to Vendor X. Refused: exceeds declared limit").
   - Above the list: a time histogram and a query bar with a small grammar (`agent: sor: outcome: rule: amount:>`).
   - Left sidebar: facet counts.
   - Right pane: the detail, with raw JSON collapsed.
5. **A receipt page modelled on a Stripe receipt plus a Rekor entry.**
   - The headline is the business effect.
   - Then who, what, when, and which rule and approver.
   - Then the proofs block: hash, signature, chain position, bundle hash in force, and an offline verify command with a copy button.
   - Refused receipts use the same template: *refusal is evidence*.
6. **A public verify page (Rekor) and a Trust Center (Vanta) for Assurance.**
   - Anyone can paste a receipt ID or hash and get the entry card, with no login.
   - The customer-facing page lists what is enforced, shows a live freshness pill, and puts evidence bundles behind "Request access".
7. **Freshness stamps, with relative and absolute time together.** For example: "Chain head verified 2 min ago (2026-09-24 10:31 IST)" and "Last receipt 14 s ago". Borrowed from Relyance, Vanta and Rekor.
8. **Failure-first headers.** Every door opens on what needs a human, following Drata: "3 writes held for your approval", "1 refused write without a reason note". Totals come second.
9. **"View raw evidence" beside every aggregate.** No number in Assurance without a drill-down to the receipts that produce it (Drata). No self-reported "compliance %" (the anti-pattern in Cranium and Truyo).
10. **An agent graph on the Agents door.** Following Noma, draw agent → declared capabilities per system of record → approval rule → last receipt, with money-moving and destructive edges in red, plus a right drawer.
11. **A discovery inbox for undeclared agents.** Following SAP, three outcomes: *Declare*, *Block*, or *Link to existing*. Nothing enters the Work door without a declaration.
12. **An approval card built on Crator's review bar.** It shows:
    - One sentence of consequence: "Approving posts ₹4,20,000 to Vendor X in ERPNext".
    - The rule that held it.
    - The primary action **Approve** and the destructive action **Refuse**.
    - A diff of the record before and after.
13. **Sandbox/Live toggle and a Live stream.** A Stripe-style Test mode switch in the header, and a Vercel-style **Live** toggle on Records for demos.
14. **Filter grammar.** Removable chips, "+ Add filter", "Clear filters", and a result count (Zenity, Relyance, Vanta), identical on every list.
15. **Typography.** Tabular monospace (JetBrains Mono) for IDs, hashes, amounts and times. The proportional face for business sentences.

---

## 5. Positioning lines (from the teardown)

- "Airia and Zenity tell security what an agent *tried*. elan1 gives finance and the auditor a receipt for what was *written*, or refused."
- "ModelOp decides and Kong enforces. elan1 decides, gates and seals in one hop, per record, not per endpoint."
- "SAP, Microsoft and ServiceNow give you an agent inventory for free. elan1 is not an inventory. It is the proof of each business write, checkable without us."
- "Cranium shares a score. elan1 shares something you can verify."

## 6. Open items

- Monitaur, Cranium and Truyo each have only one screenshot. Their public sites rely on video and decorative art, and deeper product tours are gated.
- For Drata, only an older-generation dashboard from a third-party review was available. The current UI was not captured.
- Zoho A7, Tally A9 and the stack1 infrastructure rows were not researched in depth in this pass.
- Unverified: whether Airia's HITL escalation is shipped for arbitrary systems of record or only for Airia-built agents. Request a demo and check against the E08 rule before re-scoring.

## Sources

Airia: [site](https://airia.com/) · [Agent Constraints](https://airia.com/ai-platform/agent-constraints/) · [Model Change Mgmt, 14 Jul 2026](https://www.globenewswire.com/news-release/2026/07/14/3326777/0/en/Airia-Launches-Model-Change-Management-to-Eliminate-AI-Agent-Downtime-and-Governance-Gaps.html) · [AI Awards finalist, 22 Sep 2026](https://www.globenewswire.com/news-release/2026/09/22/3366523/0/en/airia-named-finalist-in-four-categories-in-the-2026-ai-awards.html)
ModelOp/Kong: [partnership, 16 Jul 2026](https://www.globenewswire.com/news-release/2026/07/16/3328488/0/en/modelop-and-kong-partner-to-bring-zero-trust-enforcement-to-the-agentic-enterprise.html) · [Kong blog](https://konghq.com/blog/enterprise/kong-modelop-zero-trust-agentic-ai-governance) · [Kong LLM analytics](https://konghq.com/blog/product-releases/ai-analytics)
Monitaur: [platform](https://www.monitaur.ai/platform) · [FlightSim, 15 Sep 2026](https://www.globenewswire.com/news-release/2026/09/15/3362166/0/en/monitaur-brings-objective-assurances-to-high-impact-ai.html) · [MQ Visionary](https://www.businesswire.com/news/home/20260630461104/en/Monitaur-Recognized-as-Visionary-in-the-Inaugural-2026-Gartner-Magic-Quadrant-for-AI-Governance-Platforms)
Zenity: [site](https://zenity.io/) · [Series C, 3 Aug 2026](https://www.businesswire.com/news/home/20260803963850/en/Zenity-Raises-$125-Million-to-Secure-the-Era-of-1-Billion-AI-Agents)
Noma: [Series B](https://www.prnewswire.com/news-releases/noma-security-raises-100m-to-drive-adoption-of-ai-agent-security-302518641.html) · [Agentic Risk Map](https://noma.security/solution/agentic-risk-map/) · [Techstrong](https://techstrong.ai/features/noma-security-adds-ability-to-visualize-ai-agent-workflows/) · [AppSecSanta review](https://appsecsanta.com/noma-security)
Cranium: [AI Card](https://cranium.ai/platform/ai-card/) · [exposure mgmt release](https://www.prnewswire.com/news-releases/cranium-introduces-first-of-its-kind-exposure-management-solution-for-ai--genai-302135190.html)
Relyance: [news](https://www.relyance.ai/news) · [Data Journeys](https://www.relyance.ai/product/data-journeys) · [G2](https://www.g2.com/products/relyance-ai/reviews)
Truyo: [AI governance](https://truyo.com/platform/ai-governance/) · [MQ Leader, 22 Jun 2026](https://www.prnewswire.com/news-releases/truyo-named-a-leader-in-the-2026-gartner-magic-quadrant--for-ai-governance-platforms-302806625.html)
SAP: [AI Agent Hub](https://www.sap.com/products/artificial-intelligence/ai-agent-hub.html) · [SAPinsider Sapphire 2026](https://sapinsider.org/blogs/sap-sapphire-2026-autonomous-enterprise-ai-agents/) · [Joule Studio, May 2026](https://news.sap.com/2026/05/new-joule-studio-enterprise-scale-agentic-development/) · [SAP Connect Oct 2025](https://news.sap.com/2025/10/sap-connect-business-ai-new-joule-agents-embedded-intelligence/)
Crator / Frappe / Odoo / Zoho / Agentforce: [Crator](https://www.cratorlabs.ai/) · [Frappe Aug 2026 updates](https://frappe.io/blog/product-updates/product-updates-for-august-2026) · [Odoo 19 agents](https://www.odoo.com/documentation/19.0/applications/productivity/ai/agents.html) · [Zoho Zia Agents](https://www.businesswire.com/news/home/20250204066995/en/Zoho-Corporation-Announces-Zia-Agents-AI-Platform-Supporting-Autonomous-Agents-Across-Organizations-Broad-Portfolio) · [Agentforce pricing](https://www.salesforce.com/agentforce/pricing/)
Benchmarks: [Vanta Trust Center](https://www.vanta.com/resources/introducing-vanta-trust-center-state-of-trust-report) · [Vanta compliance](https://www.vanta.com/products/automated-compliance) · [Drata review](https://www.complyjet.com/blog/drata-review) · [Linear nav](https://linear.app/changelog/2021-09-23-desktop-navigation) · [Linear command menu](https://linear.app/changelog/2019-10-07-contextual-command-menu) · [Stripe Workbench](https://docs.stripe.com/workbench/overview) · [Datadog logs](https://www.datadoghq.com/blog/search-logs-datadog-log-management/) · [Vercel logs](https://vercel.com/docs/logs/runtime) · [Rekor Search](https://search.sigstore.dev/) · [Chainguard Rekor Search](https://www.chainguard.dev/unchained/chainguard-contributes-rekor-search-project-to-sigstore)
