# spec-im — what the Series A Information Memorandum tells the UI team

Source: *elan1 Series A Information Memorandum*, draft for review, 22 September 2026, 262 pp. (`txt/elan1-information-memorandum.pdf.txt`; original PDF in `/mnt/user-data/uploads/elan1 final screens/`). Read in full: Parts I–IV, Appendices A–E and G, with Appendix F (sources) skimmed. Page numbers below are the IM's printed page numbers, which match the PDF page index.

How to use this file. Sections 1–2 are copy you can use as written. Sections 3–5 give the screen and route inventory, the pack catalogue and the price book. Sections 6–7 cover the comparison page, the roadmap and realistic sample numbers. Section 8 lists the honesty rules that UI copy must obey, and Section 9 lists what the IM implies but nobody has specified. Quotations are verbatim from the IM, in straight quotes. Anything marked **[proposal]** is this spec's suggestion and does not come from the IM.

Visual language observed in the IM figures (pp. 1, 24, 57, 109). Cover: ink-black field, a white "elan" wordmark with a teal "1", a thin teal rule, and a small uppercase letter-spaced kicker ("SERIES A INFORMATION MEMORANDUM"). Figure pages use a serif headline with a grey subtitle sentence and hairline tables with uppercase micro-labels. Ink-filled rung tiles are numbered 1–9. Teal-filled tiles are used only for ACT, PROOF and the manifest, meaning the single writer and the seal. A burnt-orange/clay outline marks the STOP set and the "elan1's own row reads No" admissions. Teal dashed boxes hold "arrives separately" items. Every figure ends with a small grey source line and a longer alt-text caption. Tone is dense, footnoted and exact. This fits the contract's rules: clay for emphasis only, status always with a text label, and one disc per surface.

---

## 1. The concept in one page (copy-ready)

### 1.1 Positioning lines (verbatim, ranked)

1. **"Every other company in this market watches what an AI agent did. elan1 stands between the agent and the system of record."** (cover, "In one line"). The full sentence continues: "…decides whether the write is permitted, forces a human to approve the ones that must be approved, executes it through a single writer, and emits a sealed receipt that the customer's own auditor can verify offline without trusting us — and bills for exactly one thing, the governed action, with refusals free."
2. **"A model may produce a write intent. It may never produce an allow."** (§4.1, §6.1 figure, §8.6). The IM calls this "the sentence the company leads with, which needs no signature to be true and which none of the twenty matrix vendors can say."
3. **"The governance kernel for agentic AI — the layer that stands on the write path, refuses what it must, and produces the proof."** (cover title)
4. "elan1 sells the right to say *this write could not have happened without approval, and here is the receipt that proves it*." (§1.1). Use this only for **Enforced** mode and only from L2 (see §8).
5. "Palantir models the world; elan1 models the permission to change it." (§6.8)
6. "The industry signs what an agent was allowed to do, and does not sign what it did." (§3.3, §12.4)
7. "A verifier you must buy from the vendor whose records it checks is not a verifier." (§7.5, A.3)
8. "Sandbox keys are self-serve. Production keys never are, and the gap between the two is the entire product." (§6.9, §14.4)
9. "412 refused, ₹0." (§1.3, §4.8). The invoice is the demo.
10. "Packs are the sale. Screens are the surface. Nobody buys an approvals screen." (§5.1, D.1). This is an internal line, for the product team rather than the public site.

### 1.2 The problem (homepage section, ~120 words)

> An agent's write is the only consequential act nobody can prove. An agent posts a journal entry, releases a payment, amends a credit limit. That write lands in a system of record and affects a third party who was not in the room. The tooling built around agents in 2025–26 watches it: it scores outputs, traces tool calls and offers a kill switch. None of it stands at the moment of consequence. And every audit trail sold today is written by the party whose conduct it records. 63% of enterprises cannot enforce purpose limits on an agent, 60% cannot stop one, and 67% have no evidence-quality audit trail (Cloud Security Alliance / Token Security, 21 April 2026). Those are three gaps: a policy gate, a single writer and a receipt.

Supporting facts for the problem page, all PUBLISHED:
- 65% of organisations had an agent-caused security incident in the past year. Of those, 41% involved unintended business-process actions and 35% involved financial loss.
- The RBI FREE-AI survey (13 August 2025) found that only **18%** of Indian regulated entities maintained audit logs.
- Reliability compounds. At 98% per-step accuracy, a 5-step task succeeds about 90% of the time, a 20-step task about 67% and a 50-step task about 36%. "Most production workflows run twenty to fifty steps."
- The McKinsey State of AI 2026 found 80% individual productivity gains against 37% EBIT impact. "Profit requires agents to write."
- MCA Rule 3(1) and Rule 11(g) have been in force since 1 April 2023 and apply to about 1.85 million companies. They require an audit trail recording "when a change occurred, who made it and what changed". The trail must not be disabled and must be kept for 8 years. The statutory auditor must report on it. Directors face ₹50,000–₹5,00,000 and up to one year's imprisonment for wilful violation. "When an agent begins writing to an Indian company's books it inherits that obligation on the first day."
- The suppression attack: "a receipt proves a call happened; it cannot prove a call did not… Absence of evidence is not evidence of absence — unless the system producing the evidence is the only path to the act."

### 1.3 The product: one kernel, six calls, nine rungs, three levels

**One sentence, and the one the company will not go beyond (L1, frozen verbatim, §4.1).** Put it on the L1 product page, the Assurance door and every L1 export:

> "At L1, elan1 decides whether a write is permitted, forces a human to approve the writes that need it, executes it through a single writer, records the decision in a hash-chained append-only log, and meters it. The log is tamper-evident. It is not yet signed, not yet anchored to an external time source, and not yet verifiable by a third party who does not trust us."

**Six calls (KernelPort v1, frozen).** Identical for every consumer, in every product, at every level.

| Call | What it does (site copy) | Who may call it |
|---|---|---|
| `define` | Registers a write type at an explicit declaration version and returns a content-addressed digest. Registering is itself a governed write under dual control. | Control-plane token |
| `assert` | The central call. It runs the whole path in order and returns *committed*, *refused* or *escalated* with the proof sequence and digest, synchronously. | Tenant token, act scope |
| `seal` | The chain writer. At L1 it returns a hash-chain receipt; at L2 the same call also signs. | The kernel only |
| `verify` | Recomputes preimage and digest octet for octet and walks the chain. Returns PASS or the first failure with sequence, field and reason. At L1: "At L1, verify requires us." | Read-only token |
| `scope` | Resolves blast radius and autonomy for rendering. Advisory only, because `assert` re-resolves both: "the kernel does not trust its own answer". | Read-only token |
| `refuse` | Emits a typed refusal from a closed register. "A refusal is a product surface, designed once and rendered from the declaration." | Tenant token, act scope |

**The Right Path: nine rungs, one order, every time (p. 24 figure).**

| Rung | Name | What it does | Written to the record |
|---|---|---|---|
| 0b | STOP | Tenant kill switch, revocation, blacklist, regulator directive | — |
| 1 | IDENTITY | Actor, tenant and token resolved. `actor_kind` is set by the kernel, never by the caller | actor · actor_kind · tenant |
| 2 | WRITE DOOR | Declaration at an explicit integer version. "There is no generic write" | write type · declaration id · version |
| 3 | PRE-GATES | Nine gates, six never skippable. No gate reads a clock | gate outcomes |
| 4 | evaluate() | Versioned rules: allow, refuse or escalate, "never a score" | policy version |
| 5 | GUARDRAIL | Allow-lists, then blast radius. Catches "update one invoice" arriving as an unbounded filter | blast radius |
| 6 | AUTONOMY | The A-level this actor holds now. Missing grant = A0 | autonomy level |
| 7 | ACT | Snapshot, sandbox apply, gate re-run, identical bytes to live via a single-use 10-minute credential, gate re-run on live | record id · version · payload digest |
| 8 | PROOF | Sixteen fields, chained, returned synchronously | sequence · previous digest · lexicon digest · recorded-at |
| 9 | METERED | Exactly one meter event. Refusals at quantity zero | meter event |

Figure side-notes to reuse: "Every stage defaults to refuse: a missing gate result is a failure, never a pass." "43 refusal codes in a closed register — policy 14, gate 19, platform 10. Twenty-eight are active at L1." "There is no warn, and no succeeded with warnings. Escalate is the honest version of warn."

**Nine pre-gates.** G1 consent, G2 residency, G3 retention, G4 dual control, G5 rate, G6 budget, G7 counterparty, G8 schedule, G9 precondition. Six are never skippable. Only rate, budget and schedule may be declared off, and only with a decision record. "When a gate fails, the first failure sets the refusal code and the remaining gates still run and record, so an operator sees every problem at once."

**Autonomy ladder, A0–A5, "and no seventh".** A0 Observe, A1 Draft, A2 Propose, A3 Act reversible, A4 Act bounded, A5 Act broad. "A missing grant resolves to A0." "An irreversible write type can never be auto-approved, and an agent may never approve." "There is no API that sets an autonomy level."

**Blast radius (declaration values).** `one_record`, `one_counterparty`, `batch`, `tenant`, `cross_boundary`. The contract draws blast radius as a 4-step ladder (Contained, Reversible, Material, Irreversible), which is a *different* scale. **[proposal]** Show the declared radius value as text and use the contract ladder only for the visual band. Section 9 has more on this.

**The Declaration (policy as data).** Seven blocks: `identity`, `shape`, `permissions`, `write_types`, `gates`, `proof_binding`, `channels`. Read aloud: "this thing, shaped this way, may be changed by these actors through these write types, subject to these gates, proving these fields, over these channels." It is JSON, under 900 lines, "never a programming language — if a declaration needs a loop, the design is wrong." Every field is a value, `out_of_scope` with an ADR, or `not_measurable` with a reason and a `would_change_if`, and never blank. Versions are forward-only; "latest" is rejected in production. "The screen an approver saw in 2027 can be rebuilt in 2035."

**Two modes, two claims (§4.6).**
- **Enforced.** The kernel holds the credential, or the target accepts only kernel tokens. Permitted claim: "this write could not have occurred without passing the gates."
- **Attested advisory.** The caller holds the credential. Permitted claim: "every attempt is evaluated and recorded, including the ones we refused." "we block", "we prevent" and "nothing gets through without us" are forbidden. The mode is set per write type, "rendered on the assurance screen, printed in every export, sealed into every subsequent record", and can never be set in a tool call. Promotion to Enforced requires at least 30 days of advisory traffic, a bypass proof, no long-lived credential anywhere and a rollback drill. It is reviewed per write type and never per tenant. In Phase 1 only rung1 Enterprise in hosted mode is Enforced.

**Three assurance levels (§4.7 table).** "A level is a property of the proof and the claim, never of the policy."

| | L1 Guarded | L2 Attested | L3 Proven |
|---|---|---|---|
| Enforcement, gates, approval, rollback | Yes | Yes | Yes |
| Record of every write, refusal, escalation | Hash-chained | Hash-chained | Hash-chained |
| Signature | None | Ed25519 over the frozen preimage | Plus a second independent implementation |
| Time anchor | None | RFC 3161, two authorities, one India-based | Plus a non-elan1 counter-signature |
| Bundle and offline verifier | No | Yes; verifier free, as source, to anyone | Plus published test vectors |
| Checkable by someone who distrusts elan1 | No | Yes, with an out-of-band key fingerprint | Yes, without elan1 existing |
| Buyer | The operator | The auditor's counterparty | The market |
| List price per tenant per year | ₹1,80,000 (US$2,000) | ₹6,00,000 (US$6,667) | ₹24,00,000 (US$26,667) |
| Status (MODELLED dates) | Building; GA targeted Q2 CY2027 | Frozen spec; GA April 2028 | Frozen spec; entry gated on an external auditor accepting an L2 bundle (plan: Oct 2029) |

What each level lets a customer say. Use this on the Assurance levels page.
- **L1:** "our agents cannot write to our books without passing rules we set, a person approves anything material, and we have an unbroken internal record of every attempt including the refusals."
- **L2:** "…and here is a file you can check yourself, on your own machine, without our vendor's help."
- **L3:** "…and the format is open, so you can check it in ten years whether or not that vendor exists."

Upgrade rule, which must appear on the upgrade screen: "a chain written at L1 cannot be retroactively sealed: signatures start where signing starts, records written before the upgrade stay L1 for ever, and the bundle prints the boundary date and the count on each side." Success criterion: "not that it worked, but that it was boring."

### 1.4 Packs, in one paragraph

> A pack is configuration, not code: one declaration, one certified verifier profile and one regime-specific export mapping, aimed at one buyer with one auditor under one dated obligation. A clause in a rule becomes a control, the control becomes a gate, the gate binds to a write type, and the write type binds to a proof field. "A regime is a pack; a country is a set of packs." Every candidate must pass five gates: a dated hook, an auditor obliged to ask, honest reversibility, evidence sold separately, and elan1 owning the write. Eight candidates have been rejected by name. The first pack is **ledger1**, bound to the MCA audit-trail rule (Section 4).

### 1.5 What elan1 refuses to build (the "refusals" section of the product page)

Written boundary (§2.3, §6.2):
- elan1 may never build **an ERP, a CRM, or a UI shell for somebody else's product**, add a second write path, or special-case a product.
- There is no second submission surface, no fast path, no batch variant, no admin mode and no decision cache. "a cached allow is an allow at an unknown rule version". Break-glass is a declared write type with dual control, visible to the tenant.
- There is no seventeenth proof field, "at any level, ever".
- It will not operate a trust anchor or registry, a shared ledger or consortium chain, or "a network elan1 operates". "If the design ever requires a party to write into another party's chain, it is wrong."
- It will not run a cross-tenant benchmark: "Not opt-in, not anonymised, not k-anonymous. Not built."
- It will not put a model in the decision or graduation path. An LLM may "rank, summarise or explain in the console, for a human reader".
- It will not sell per-seat or outcome pricing, or charge for the verifier.
- It will not use a blockchain: "the property wanted here is a timestamp from a party with no interest in the matter".
- It will not compete on identity: "consume identity, differentiate on enforcement, approval and evidence, never compete on authentication."
- It will not do prompt-injection defence ("We overlap at the enforcement layer only").
- It will not administer an admin "sign this" surface ("the shortest available route to destroying the product").
- It will not raise autonomy by any route other than the graduation write: not "a support action, an admin toggle, a contract clause, a pricing tier or a salesperson".

### 1.6 Business model (pricing-page lead)

> We bill for one thing: the governed action — one write to a system of record that was permitted, executed, recorded and billed. One row in the chain, one meter event, one line on the invoice, one thing an auditor can open. The invoice line and the evidence record are the same object. Refusals are metered at quantity zero, and the database enforces it: "A caller cannot forget to pass zero, because the caller does not pass it."

Three revenue lines: (1) a platform floor plus a per-action rate by assurance level, (2) the evidence SKU (verifier profiles, counterparty seats, bundles), and (3) regulatory packs. Sovereign deployment is priced as a deployment. The verifier is free for ever. There is no per-seat price and no outcome price, "anywhere in the group, at any assurance level". Full numbers are in Section 5.

### 1.7 Perimeter and sister brands (company page / footer)

- **elan1** is the company, the kernel and the governed write path (elan1 Private Limited, Coimbatore and Chennai, domain `elan1.ai`). Brand names are always lowercase, "including at the start of a sentence".
- **rung1** is a *separate venture* under common founder control and the kernel's first production consumer. It offers governed AI agents for ERPNext/Frappe for Indian ₹5–50 crore firms sold through CAs, at ₹2,499 / 7,999 / 19,999 / 49,999+ per month by turnover band. Written "rung1 · by elan1". Lines: rung1 Enterprise (live), Revenue (parked), Commerce (parked), Voice (inbound channel). It pays elan1 ₹0.40 per committed governed action from 1 January 2027 at arm's length. "internal transfer revenue is not elan1 traction", so never show it as traction.
- **stack1** is a separate venture: the runtime and contract layer (`fusion.*/v1`), billed at cost + 15%. "stack1 is the runtime, elan1 is the kernel, rung1 is the product."
- **verna1** is outbound collections voice, parked (DR-007).
- Retired names must not appear: core1/CORE1, rev1, gtm1, commerce1 (as a brand), fusion1, "Governed Intelligence Platform", "Governed Action Model", LOM, start1, run1, academy1, sovereign1, and all-capital forms. Names never in the corpus: sales1, market1, people1, finance1, insight1.
- Endorsement rules: inside a rung1 screen, elan1 appears only as "Checked and recorded by the elan1 layer" on a proof record and "rung1 · by elan1" in the footer. At L2 "the endorsement flips to the front". An OEM console shows no elan1 mark at all, only the header `X-Fusion-Contract`.

### 1.8 Onboarding microcopy lifted from the IM

- Sandbox welcome: "Your sandbox tenant is ready. Its chain is marked *sandbox* in every entry, every meter event is quantity zero, and nothing here is billed. Limits: 10 writes a minute, 2 concurrent." (§6.9)
- Production key request: "A production key is a credential to somebody's books, and there is no honest way to issue one without a human reading what the applicant declared." The reviewer checks four things only: the enforcement mode is stated in writing and matches the declaration's channels; every write type has a reversal plan or an explicit irreversible flag; all three outcomes were proved in sandbox, "including a real refusal and a real escalation resolved by a real human"; and a named human certified the declaration. Promise: two working days. You must also name a production owner, "a person, not a distribution list".
- Residency step: "Residency and key custody sit at the lowest architectural plane, which has no migration path — every choice there is permanent." The primary region is ap-south-1 (Mumbai), three zones, with no data outside India.
- Refusals are part of the test (pilot copy): "refusals are part of what is being tested and should not be worked around."
- Export: "Verify it yourself first. If it does not pass for you it will not pass for them."

---

## 2. Personas and buyers

The IM names three buyers "and a fourth who pays in cash" (§3.6). "Confusing them is the commonest way to lose a deal at the worst moment." It then adds the channel, the developer, the regulator and the investor. Screen needs are phrased as routes from Section 3.

| Persona | Who, per the IM | Goal | Their question (IM wording) | Buys / uses | Screens |
|---|---|---|---|---|---|
| **Operator** | Finance controller or head of operations "being asked to let an agent touch the books"; promoter of a ₹5–50 cr firm; also the day-to-day approver (Rekha, an accounts executive at a mid-sized manufacturer) | Let agents write without an unrecoverable mistake | "can I let this run without it doing something I cannot undo?" | L1 Guarded: enforcement, human approval, "an autonomy ladder they can lower in a minute, and a path back" (30-day rollback) | Work door (inbox, decide, escalations, refusals, reverse, stop); Agents (lower autonomy in one press); invoice with refusals |
| **Auditor's counterparty / assurance buyer** | External/statutory auditor, a lender's diligence team, a compliance function, a CA firm carrying Rule 11(g), head of internal audit; the CFO is the economic buyer | Hand a third party something checkable | "can I verify this without trusting the vendor?" | L2 Attested: signature, external anchor, exportable bundle, a verifier "they did not get from the party being verified" | Records → export bundle; free verifier download; public `#/verify`; auditor portal; profile/limits statements; reconciliation |
| **Counterparty / regulator / market** | Two governed firms transacting; an examination team that must check a receipt in ten years | Verify without trusting anyone | "does this survive the vendor?" | L3 Proven: open format, second implementation, test vectors incl. a tampered bundle, non-elan1 counter-signature; counterparty seats ₹45,000/yr | Counterparty portal (receipt inbox, verify, accept, register); regulator view; standard pages |
| **Insurer / underwriter** ("the fourth party… pays in cash") | Specialist AI carriers (Klaimee, Testudo, HSB/Munich Re, Mayflower Specialty, Agent Insured, Corgi, AIUC-1) | Price exposure "at the interaction level rather than agent-wide" | Wants "trace-level evidence", "meaningful human oversight", "functioning kill switches and authority scoping" | An underwriting profile "structurally identical to a regulatory verifier profile". No revenue modelled | `#/insurers` page; an underwriting-profile view **[proposal]** |
| **Builder / CIO / developer / ISV** | Third-party software vendors over MCP/HTTP (motion four); an ISV building a consumer; the CIO/CISO running a security review | Integrate once against a frozen contract; get to production honestly | Checks first: "a public status page with chain integrity as its own component, a published incident process, a conformance suite the consumer can run themselves, and a twelve-month sunset window" | Sandbox key (self-serve), production key (reviewed), KernelPort, MCP catalogue, C1–C14 conformance | Developer portal, sandbox sign-up, keys, conformance runner, refusal register, versioning/deprecations, status page |
| **CISO / security reviewer** | The security-review function | Separate agents from people; understand key control | "show me everything your agents did, separately from what people did"; "how do I know your engineers cannot sign whatever they like?" | The `actor_kind` split; key policy procedure; the 13-row go-live bar | Security & trust page; Records filtered by `actor_kind`; key register; sub-processor list |
| **Regulator / supervisor** | MCA, RBI (FREE-AI, draft MRM), SEBI, IRDAI, the DPDP Board, EU notified bodies; "a customer's own supervisor conversation" | Examine without being sold to | "if you cannot reconstruct what an agent did and why, you cannot defend it" (NIST framing) | Nothing; asked for corrections, never endorsement | Regulator view (three claim sentences, limits, six verification routes, defect report) |
| **Partner / verifier** | CA firms, audit firms, SIs, platform OEMs; certification Introducer / Implementer / Verifier at ₹1,50,000 per firm per year; partners keep 18% | Introduce, implement or verify without overclaiming | "whether a CA actually introduces a client" is the open question | Certification and claim ladder | Partner portal, certification, client pilots, claim-boundary training/test |
| **DPO / data fiduciary** | The customer's DPO under DPDP | Erasure without breaking evidence | "I cannot hand my auditor a receipt containing the customer's PAN, the invoice amount and the approver's name." | Salt destruction, selective disclosure | Assurance → erasure cases; export with disclosure list |
| **Investor / board** | Series A investors; the proposed five-seat board; the Telos Council | See gates, kills and unflattering numbers | "which kill criteria are within one measure of firing" | Monthly investor pack, 15-row board page | Board page / investor view **[proposal]**; public roadmap and gates |

Operator vignette to use in demos (§4.4). Rekha holds A4 on `erp.payment_entry.submit`, declared in `erp.ar` v7, with a blast radius of one counterparty. After the gates (consent, residency Mumbai, retention, counterparty, precondition), policy v11 allows. Her screen reads **"Payment recorded · proof #4,097"** with a **"Reverse this"** control valid for 30 days. The agent `ar-agent` at A3 then proposes an ACME Textiles invoice of ₹4,20,000 against a ₹3,00,000 credit limit. It is refused at seq 4,098 with `GATE.PRECONDITION_FAILED` and HTTP 200. Rekha's screen says **"Not done — credit limit"**, shows the two numbers and offers two next actions: request a limit change (itself a governed write) or reduce the invoice. An invoice of ₹2,40,000 at A2 escalates at seq 4,099 with a named resolver set and a 4-hour expiry. The approval is seq 4,100 and records the approver, a digest of the payload they were shown, and the time. The commit is seq 4,101.

---

## 3. Product surfaces and routes

All routes are hash routes per CONTRACT.md. Console routes sit inside the Four Doors. The IM confirms the IA: "the Four Doors interface grammar (Work · Records · Agents · Assurance)" (Glossary, Channels). The product function "Owns: The Four Doors, the approval screens"; "Must never own: A fifth door, or a bespoke screen"; "Measured by: Approver sees diff, gate results and policy version" (§15.3). Gate 2 (31 March 2028) requires that "app three renders its four doors from its Declaration with zero lines of hand-written screen code". Build screens as declaration-driven templates, not bespoke one-offs.

**[proposal]** Door questions for `E1.nav`. Work: "What needs a person now?" Records: "What happened, and can it be checked?" Agents: "Who may act, and at what level?" Assurance: "What can we truthfully claim?"

### 3.1 Public website (layout `public`)

| Route | Page | Must contain (from IM) |
|---|---|---|
| `#/` | Home | Line 1 (§1.1), the problem numbers, the Right Path in miniature, the three levels, "412 refused, ₹0" invoice snippet, the status statement ("L1 Guarded — GA targeted Q2 2027"), CTAs *Book a pilot* / *Get a sandbox key* / *Verify a bundle* |
| `#/product` | Product | Kernel, six calls, Declaration, two modes, what we refuse to build (§1.5) |
| `#/product/how-it-works` | The Right Path | Nine rungs figure; nine gates; refusals are HTTP 200; Rekha walk-through |
| `#/product/modes` | Enforced vs attested advisory | The two permitted sentences; promotion criteria |
| `#/product/declaration` | Policy as data | Seven blocks, the three dispositions, the five-link chain (clause → control → gate → write type → proof field, p. 47) |
| `#/assurance-levels` | L1 / L2 / L3 | §1.3 table; "what each level lets a customer say"; upgrade boundary rule; status per level |
| `#/evidence` | The seal, bundle and verifier | 16 fields; the bundle's 8 members; exit codes; anchoring; "Never in a bundle: payloads, and key material" |
| `#/packs` | Pack catalogue | Section 4; five admission gates; "A regime is a pack; a country is a set of packs" |
| `#/packs/:id` | Pack detail (`ledger1`, `invoice1`, `collect1`) | Obligation, buyer, auditor, write types, gates, profile binding, buyer promise and "what it does not establish", pilot protocol, status label |
| `#/packs/refused` | Packs we refused | The six named rejections with gate and sentence, and the two unnamed ones shown as a gap |
| `#/pricing` | Pricing | Section 5; "modelled list price" caveat; refusals ₹0; verifier ₹0 |
| `#/pricing/calculator` | Estimate | Level, annual actions, packs, profiles, seats → annual total (formula in 5.5) |
| `#/why-elan1` | Comparison | Section 6; elan1's own row reads No |
| `#/security` | Security & trust | One baseline, fail closed; residency; the 13-row go-live bar; retention by class; key custody including the disclosed insider limitation; certifications: "We hold no certification of any kind" |
| `#/security/claims` | What we claim / do not claim | Three-sentence claim plus the nine-row "elan1 does not claim" table (§10) |
| `#/security/subprocessors` | Sub-processor list | Required by the 13-row bar |
| `#/verify` | Verify a bundle or receipt | Runs locally in the browser **[proposal]**. Needs a key fingerprint supplied by the reader; shows exit code, class and next move; demo with a published good bundle and the tampered bundle |
| `#/verify/download` | Get the verifier | Free, source, Apache-2.0, checksums, release signature, reproducible build, the four routes to check it |
| `#/standard` | Action Receipt | The published-not-open line; licences (CC BY 4.0 / Apache-2.0 / CC0); 13 receipt members; conformance CL-1…CL-4, CL-D; comment process; defect reports "from anyone" |
| `#/developers` | Developer home | See 3.9 |
| `#/partners` | Partner programme | Introducer / Implementer / Verifier; ₹1,50,000/yr; 18%; four support rungs |
| `#/auditors` | For auditors and CA firms | "check a client's evidence without buying anything from the client's vendor"; the 90-day pilot |
| `#/regulators` | For regulators | Four asks, "none of them approval"; defect contact |
| `#/insurers` | For underwriters | Interaction-level evidence; kill switch; authority scoping |
| `#/roadmap` | Roadmap and gates | Section 7, with statuses attempted / passed / failed / not yet due |
| `#/company` | Company | Founder, perimeter, sister brands, "the position, stated before anything else" |
| `#/company/decisions` | Decision register | DR-001…DR-013 |
| `#/company/open-questions` | Open questions | The eleven questions (E.6) |
| `#/company/measured` | Measured cost per governed action | Weekly, beside refusal rate. Until measured, show MODELLED **[proposal from the §1.7 commitment]** |
| `#/status` | Status | See 3.10 |
| `#/contact`, `#/demo` | Contact / book a pilot | Pilot = 90 days, one customer, one auditor; ask for the auditor's name |
| `#/glossary` | Glossary | Appendix G terms |
| `#/legal/privacy`, `#/legal/dpa`, `#/legal/terms` | Legal | "published privacy notice", "signed DPA" are go-live bar rows |

### 3.2 Sign-in and SSO (layout `auth`)

`#/sign-in` · `#/sign-in/sso` · `#/sign-up/sandbox` (email verification → tenant in under 60 s, "p95 published") · `#/sign-up/verify-email` · `#/invite/:token` · `#/sign-in/tenant` (tenant picker) · `#/sign-out`. The IM specifies no SSO, MFA or role model; see Section 9. Tenancy "comes from the token and is never a call argument", so the tenant switcher re-authenticates rather than filtering.

### 3.3 Onboarding wizard (layout `bare` or `auth`)

`#/onboarding` then:
1. `/organisation`: legal entity, turnover band, named production owner.
2. `/residency`: residency domain (India, ap-south-1). Show the permanence warning, and offer a *dedicated residency domain* option (Enterprise shape, the only way to get a signing key no other tenant uses).
3. `/system-of-record`: target (ERPNext hosted in Phase 1; SAP, Oracle, Temenos, Finacle and Tally shown as not yet available). Choose the mode per write type (Enforced / Attested advisory).
4. `/pack`: choose a pack (ledger1) or none. Show the pack's obligation and "what it does not establish".
5. `/declaration`: import or author. Validate (11 semantic rules), simulate against the reference tenant, certify. The certifier must not be the author, and certification is dual control.
6. `/gates`: the nine gates, six locked on.
7. `/people`: approvers, dual-control pairs. An agent can never be an approver.
8. `/agents`: register agents and grant A-levels per write type. The default is A0.
9. `/sandbox-proof`: prove committed, refused and escalated-then-resolved-by-a-human. A checklist with a live chain view.
10. `/production-request`: the four checks, conformance result file, two working days.
11. `/done`: assurance level pill, the L1 sentence, next steps (pilot, auditor day 0).

### 3.4 Console: Work door (layout `console`, door `work`)

| Route | Screen | Key content |
|---|---|---|
| `#/work` | Today | Counts: awaiting me, escalations expiring, refusals today, reversible writes still in window; STOP state |
| `#/work/approvals` | Obligations inbox | Each obligation has a named resolver set and an expiry (4 h in the example); filters `?filter=mine` |
| `#/work/decide/:id` | Decide | Diff (proposed vs current), every gate result with its inputs, policy version, declaration version, autonomy level, blast radius, reversal plan, actor/actor_kind. Approve / Decline / Amend. The approval records the digest of the payload *as shown*. Dual control: "the proposer may never approve". The same-actor refusal is `GATE.DUAL_CONTROL_SAME_ACTOR` |
| `#/work/refusals` | Refusals | "Not done — <reason>" pattern, code, rung, gate, the numbers that failed, next actions; quantity 0 |
| `#/work/refusals/:seq` | Refusal detail | Full 16-field refusal record (record id zeroed); every gate still ran |
| `#/work/escalations` | Escalations | Resolved / expired / declined |
| `#/work/reverse/:seq` | Reverse | 30-day window; reversal plan type (`target_native_undo`, `compensating_instrument`); irreversible write types show why not |
| `#/work/stop` | Stop | Tenant kill switch (rung 0b); revocation; regulator directive. Takes effect at the next write |
| `#/work/break-glass` | Break-glass | Declared write type, dual control, "recorded in the operator's own chain and visible to the tenant", alert within one minute |
| `#/work/erasure` | Erasure cases | Irreversible, dual control, 72-hour clock, erasure plan before deletion, "never closed by a partial success" (could also sit under Assurance) |

### 3.5 Console: Records door

| Route | Screen | Key content |
|---|---|---|
| `#/records` | Chain | Per-tenant sequence, head digest, gap alarms ("A gap in the sequence is a P0"), filter by `actor_kind` (agent / human), write type, outcome |
| `#/records/:seq` | Proof record | 16 fields, labelled with lengths: tenant, sequence, previous digest, write id, write type, declaration id, declaration version, policy version, actor, actor kind, autonomy level, record id, record version, payload digest, lexicon digest, recorded-at. Signature member **absent at L1** (never "unsigned"-stubbed). Enforcement mode. OTel trace/span ID **[from §13.8]** |
| `#/records/verify` | Verify chain | L1 shows "At L1, verify requires us." PASS / first failure with sequence, field and reason |
| `#/records/reconcile` | Two-way reconciliation | elan1 chain vs the target's own audit trail. "a change in the target with no elan1 record" is the finding that matters |
| `#/records/exports` | Exports | History: who exported what, when (manifest digest kept, bundle not retained) |
| `#/records/exports/new` | Export a bundle | Pick range + profile. **Before generating**, show record count, refusal count and unanchored head. Precondition: range covered by a completed nightly integrity run, otherwise "export the clean range instead". Oversize → refused with suggested split. Result: "Export ready — 12,480 records, 611 refusals, 22 unanchored, profile in-mca-audit-trail v1" then "Verify it yourself first…" |
| `#/records/exports/disclose` | Selective disclosure export (L3) | Both lists before generation: "you are revealing 3 of 11 committed fields"; disclosure is irrevocable |
| `#/records/anchoring` | Anchors (L2) | Batches, leaf counts, two authorities, `single_anchor` degraded state, lag metric; banner "Anchoring degraded since 09:14 — 88 records unanchored." |
| `#/records/declarations` | Declaration registry | Versions (forward-only), digests, certifier, diff between versions, where used |
| `#/records/declarations/:id/:v` | Declaration version | Seven blocks rendered; dispositions; lint warnings |
| `#/records/lexicon` | Lexicon | Term sets by hash |
| `#/records/receipts` | Receipts issued / received (L3) | Audience, nonce, expiry; volume-disclosure warning before the first receipt to a new audience |

### 3.6 Console: Agents door

| Route | Screen | Key content |
|---|---|---|
| `#/agents` | Agents roster | Agents vs humans (actor_kind), write types reachable, current A-levels |
| `#/agents/:id` | Agent detail | Grants per write type; recent governed actions; refusals by gate (neutral to score) |
| `#/agents/autonomy` | Autonomy grants | Action class = (tenant, write_type, actor_kind, blast_radius); A0–A5; "Lower" is one press, effective at the next write, no justification needed |
| `#/agents/classes/:id` | Action class and precedent (L3) | Eleven counters over 180 days; score_v1 0–100 with inputs and function version; eligibility checklist of 8 conditions |
| `#/agents/graduate/:classId` | Graduation proposal | Evidence, reversal drill date, justification written by the owner and never pre-filled; the second approver sees "the numbers, not a recommendation"; 30-day supervised period at 1-in-10 sampling |
| `#/agents/tools` | MCP tool catalogue | 34 tools: 18 read-only, 10 staging, 6 act; descriptions pinned by hash (a change is a new declaration version) |
| `#/agents/channels` | Channels | web, mobile, messaging, api, mcp, voice; which may approve; mode per channel: "A tenant may be enforced on one surface and advisory on another, and must be told so" |
| `#/agents/keys` | Keys and tokens | Tenant / control / read-only token classes; sandbox vs production keys |

### 3.7 Console: Assurance door

| Route | Screen | Key content |
|---|---|---|
| `#/assurance` | Assurance overview | Current level with the verbatim claim sentence for that level; mode per write type; certifications ("none"); open limits |
| `#/assurance/upgrade` | L1 → L2 upgrade | Runbook: seven preconditions *verified* (full-chain replay), a named irreversible instant, boundary sequence, counts either side |
| `#/assurance/packs` | Installed packs | Profile binding, `rule_as_at`, `applies_to_records_from`, min level, continuity scope |
| `#/assurance/profiles/:id` | Verifier profile | Clause text verbatim → control → gate → write type → field; checks with failure class; `not_measurable` rows with `would_change_if`; limits statement (200 characters or more) |
| `#/assurance/controls` | Controls | e.g. C-AT-01; kind; population; `operated_throughout` computed over the chain |
| `#/assurance/meter` | Meter | Governed actions committed / refused (quantity 0), basis by blast radius, allowance used, reconciliation status (nightly, both directions) |
| `#/assurance/invoices` | Invoices | Invoice lines with write_id and sequence; "412 refused, ₹0" on the same table; no invoice over an unreconciled period |
| `#/assurance/keys` | Key register (L2) | e.g. `k_in_20270401_9c3a`, window, status active / retired / revoked, successor; signing calls vs signed records reconciliation |
| `#/assurance/timestamp` | Timestamp authorities (L2) | Pair, interval SLO ≤15 min, last token per authority |
| `#/assurance/residency` | Residency and baseline | The 13-row go-live bar with evidence per row |
| `#/assurance/counterparties` | Counterparty register (L3) | Org id `ar-org:<domain>`; discovery route used, e.g. "accepted on a pinned fingerprint since March 2028" |
| `#/assurance/incidents` | Incidents | CERT-In six-hour path; post-incident notes within 5 working days |
| `#/assurance/access` | People and approval rights | **[proposal]** Home for user and role management without a "Settings" door |

### 3.8 External portals

- **Auditor portal** (`#/audit`, layout `doc`). `#/audit/engagements/:id` shows the pilot day plan (0, 1, 2–75, 76, 77, 78, 80, 85). `#/audit/bundle` explains how to run the verifier offline, with the key fingerprint obtained out of band and the tampered bundle to "watch it refuse". `#/audit/verdict` is where the auditor writes in their own words what the bundle would and would not let them conclude. `#/audit/necessity` is the day-0 statement of what they would need to see. The four L3 acceptance tests are shown as a checklist. No logo or endorsement is ever asked for.
- **Regulator view** (`#/regulator`). Read-only. It shows the three claim sentences, the limits table, the six verification routes, actor-kind separation ("everything an agent did, separately from everything a person did"), and a defect report acknowledged within 5 working days. The founder is the named contact.
- **Counterparty verification** (`#/counterparty`). `#/counterparty/inbox` holds received receipts. `#/counterparty/verify/:id` runs the 13-step order, shows the discovery route and a limits line, reports UNANCHORED as a property rather than a failure, and reports replay without silently deduplicating. `#/counterparty/accept/:id` runs `receipt.accept` (cross-boundary, dual control). `#/counterparty/disputes`: "elan1 does not adjudicate."
- **Partner portal** (`#/partners/portal`): certification level and the claims it permits, client pilots, the claim-boundary test, support escalation.
- **Board / investor view** (`#/board`) **[proposal]**: the 15-row number page, the gate calendar, kill criteria "within one measure of firing", open questions first.

### 3.9 Developer portal (`#/dev`, layout `doc`)

`#/dev/quickstart` (sandbox key in a minute) · `#/dev/kernelport` (six calls) · `#/dev/mcp` (34 tools, MCP 2026-07-28 Multi Round-Trip `input_required` as the approval channel) · `#/dev/http` (eight endpoint families; control paths have no read path to any record store) · `#/dev/tokens` (three classes and no fourth) · `#/dev/refusals` (43-code register, class, rung, operator action; HTTP 200 vs 4xx vs 5xx table; 429 is not a refusal) · `#/dev/declaration` (schema, 11 semantic rules, 7 lint rules) · `#/dev/conformance` (C1–C14, runnable against the reference tenant, machine-readable result file) · `#/dev/versioning` (notice table; 12-month sunset; Deprecation and Sunset headers; the anti-degradation clause) · `#/dev/changelog` · `#/dev/keys` (sandbox self-serve; production request) · `#/dev/production-request` · `#/dev/vectors` (64 vectors, 28 negative, NV-13 and NV-14) · `#/dev/sdk`.

### 3.10 Status page (`#/status`, layout `public`)

Per-component: kernel API, sandbox provisioning (p95), **chain integrity** ("its own component, flipped by a missed nightly integrity job without anybody pressing anything"), anchoring authority A and authority B (L2), verifier releases, meter reconciliation. Incident history with post-incident notes. "A status page that appears the week after the first outage is read exactly as what it is."

### 3.11 Mobile (layout `mobile`)

Channels include mobile and messaging, and approval may be available per channel. **[proposal]** A mobile approve/decline card must still show the diff, gate results and policy version, and must never offer approval on a channel the declaration says cannot approve.

---

## 4. Pack portfolio

There is no pack called "India pack" in the IM. ledger1 is described as "the first India pack" (B.4). Pack ids match `^[a-z][a-z0-9]{2,15}1$`, always lowercase. A pack is "never a line on a public price list under its own name". The pricing page lists "Regulatory pack ₹1,35,000 per tenant per year (blended)" and does not price pack by pack.

### 4.1 Admission gates (show on `#/packs`)

| Gate | Test | Fails when |
|---|---|---|
| G-A · A dated hook | A named regulation, standard or contract with a date | "a principle, a direction of travel, or 'regulators are increasingly focused on'" |
| G-B · An auditor | "somebody whose job is to ask for the evidence", someone "who could be telephoned" | "If nobody is obliged to ask, nobody asks" |
| G-C · Honestly reversible | Write types can declare reversible or irreversible "without lying" | "everyone pretends otherwise" |
| G-D · Evidence sold separately | A buyer would pay for the bundle on its own line | evidence is "a nice-to-have attached to something else" |
| G-E · We own the write | elan1 is in the write path | "We observe rather than govern… telemetry is not evidence" |

"A gate scored 'probably' is scored fail." Admission is a governed write under dual control, approved by the founder.

### 4.2 Live and planned packs

**ledger1.** Status: first pack. Planned live October 2027. Appendix B says it "ships Q1 2028 at Gate 1"; the minimum assurance level is 2 and L2 GA is April 2028. Pilot customer and auditor not yet named.
- Obligation: MCA, Companies (Accounts) Rules, Rule 3(1) audit trail (edit log), in force 1 April 2023, plus Rule 11(g) auditor reporting. Four clauses bound: "an audit trail of each and every transaction; an edit log of each change made in the books of account; the date on which each change was made; and that the audit trail shall not be disabled."
- Buyer: promoter or finance controller of a ₹5–50 crore firm (US$0.6–5.6m), on their CA's advice. Budget line: "audit and compliance, not software". Auditor: the statutory auditor.
- Write types:

| Write type | Blast radius | Reversal | Dual control |
|---|---|---|---|
| `sales_invoice.submit` | one_counterparty | Native cancel of invoice and IRN | Above ₹2 lakh |
| `sales_invoice.cancel` | one_counterparty | Honestly irreversible after the 24-hour IRN window | Always |
| `purchase_invoice.submit` | one_counterparty | Native undo | Above ₹2 lakh |
| `payment_entry.submit` | one_counterparty | Compensating instrument | Always |
| `journal_entry.submit` | batch | Compensating instrument | Always |
| `customer.update` (credit terms, GSTIN) | one_record | Native undo | On GSTIN change |

- Gates in order: consent, residency, retention, counterparty, precondition, dual_control, budget. Budget is on because "a runaway journal entry is the failure mode the buyer imagines first".
- Profile: `in-mca-audit-trail` v1; `rule_as_at: 2023-04-01`; `applies_to_records_from: 2027-07-01`; `min_assurance_level: 2`; `refusals_required: true`; `continuity_scope: full_chain`. It has 6 checks. The non-disablement check on an L1 dry run reads **"not_applicable — assurance level 1"**. The IM calls this "the clearest available demonstration of what L2 buys".
- Control example: **C-AT-01**, preventive: every change to the books of account is recorded with actor, time and before/after; `operated_throughout` over the full chain.
- Buyer promise: "A bundle covering any period they choose, containing every governed change to the books of account in that period — including every refusal — … externally anchored by two timestamp authorities … a verification report the auditor produces themselves, offline."
- What it does not establish: "changes made directly in the accounting system are that system's own audit trail and are not in the bundle, and the two must be reconciled. It does not establish that transactions were genuine, that the rules applied were adequate, or that any obligation is satisfied… No regulator has reviewed this profile."
- Second profile: the US SEC Rule 17a-4 audit-trail alternative, "a valid second profile under the same pack, not a second product".
- Gate scores: A pass, B pass, C pass, D "pass, provisionally — this is the gate the pilot actually tests", E pass.

**invoice1.** Status: second pack, planned April 2028.
- Obligation: GST e-invoicing. Mandatory at a ₹5 crore turnover threshold since 1 August 2023. Firms above ₹10 crore must report within 30 days. An invoice without a valid IRN has no standing, and the buyer cannot claim input tax credit.
- It binds a profile over the write that *requests* an IRN. The limits statement must say plainly that "the IRN, the portal response and the twenty-four-hour cancellation window are the accounting system's evidence and not elan1's".
- It is second because of G-E: "elan1 governs the write that requests it; it does not own the clearance". No IRN volume figure may be shown anywhere; it is "UNVERIFIED — THEREFORE NOT ASSERTED".

**collect1.** Status: third pack, planned October 2028. The status label must read **"Spec sketch — rule citations need counsel confirmation before anything ships"**. It is "not a funded pack".
- Four obligation layers: RBI fair-practice recovery conduct; telecom (DLT, templates, preference register, number series, attempt caps); DPDP; and the lender's board policy and outsourcing rules.
- Six write types:

| Write type | Reversibility |
|---|---|
| `call.attempt` | Irreversible |
| `call.record` | Append-only |
| `promise.capture` | Reversible |
| `disposition.set` | Reversible |
| `escalation.raise` | Reversible |
| `preference.update` | Irreversible, never undone by an agent |

- Fourteen gates in three phases:
  - Before the dial (7): lawful basis, preference scrub, time window in the borrower's location, attempt cap and cooling period, script/template version hash-pinned, authority band, number series.
  - During the call (5): automated-call disclosure, identity check (third-party disclosure is a hard refusal), read-back, prohibited-language guard, human path ("'connect me to a person' always works").
  - After the call (2): recording integrity (per-chunk hashed audio) and disposition.
- Refusals: a closed set of 16, billed at zero. Autonomy is capped: the agent may state facts, take a promise inside a band, and escalate; it may never negotiate a settlement or waive a charge.
- Priced "per governed call", with evidence sold per regime.
- Limits: it does not prove the debt is valid, that the answerer is the borrower beyond the identity check performed, or "that the conversation was kind". Audio is authentic only from the capture point onward.
- G-E is open: if the lender's core system owns the write, that path is "Attested advisory… not Enforced — and the pack must say so".
- Profile id example: `in-rbi-collections`.

### 4.3 Also mentioned

- **DPDP evidence pack**: "ships ahead of" DPDP enforcement on 13 May 2027 (§13.9). It is not otherwise specified; see Section 9.
- **insure1**: follows IRDAI's working group (constituted 18 June 2026, with an AI audit framework mandate). Market entry is FY2027-28, and the pack is marked `UNVERIFIED — DELIVERY`.
- **Reserved, not built**: `manufacture1`, `realestate1`, `health1` (ABDM, demand-led), `bank1`, `insure1`, `telco1` (demand-led), `gov1` (demand-led).
- **Refused by name**. Show these as a register, "not softened, parked or renamed":

| Candidate | Gate failed | Sentence |
|---|---|---|
| retail1 | G-B | "Reversible, low stakes; nobody audits a price change" |
| edu1 | G-D | "No buyer for evidence on its own line" |
| energy1 | G-E | "The write path belongs to SCADA vendors" |
| agri1 | G-B | "Subsidy audits are annual and on paper" |
| legal1 | G-E | "The matter lives in someone else's document system" |
| public1 | G-A and G-D | "The procurement cycle outlasts the runway" |
| (unnamed ×2) | not recorded | "Held in the portfolio register". Show the gap honestly |

### 4.4 Pack template, tests and pilot (pack detail and admin screens)

- Eleven blocks: `pack_identity`, `obligation`, `buyer`, `gate_scores`, `declaration_ref`, `write_types[]`, `gates[]`, `profile_binding`, `buyer_promise`, `tests[]`, `pilot`.
- Eight tests:
  - T1 declaration validates
  - T2 profile certified by a non-author
  - T3 dated reversal drill per write type
  - T4 at least one real refusal per gate
  - T5 bundle PASS on an air-gapped machine run by an outsider
  - T6 tampered bundle gives FAIL_INTEGRITY, naming record and field
  - T7 non-conforming bundle gives FAIL_PROFILE, never 1
  - T8 the auditor states unprompted what it does not prove
- 90-day pilot timeline, day by day: see D.6, which is good material for a pilot tracker screen.
- Regime prefixes: profiles are "jurisdiction-prefixed by construction". Use `in-`, and for a future US profile `us-` **[proposal]**.

---

## 5. Pricing and metering (exact)

Caveat that must appear on the pricing page. The prices are a **modelled price book**: "It is not a published price list, because there is no published price list." "elan1's external list price per governed action at L1 general availability is not yet set" (founder, before L1 GA, Q2 2027). The agreed floor is ₹0.40 (internal transfer) and the ceiling is about ₹8.80 (the Agentforce anchor). **[proposal]** Label the page "Indicative pricing — modelled, subject to change before general availability". Currency view: ₹90.00 = US$1.00.

### 5.1 Plans (per tenant per year)

| Level | Platform floor | US$ | Included governed actions / yr | Beyond allowance, per action | US$ | Effective rate at full inclusion |
|---|---|---|---|---|---|---|
| L1 Guarded | ₹1,80,000 | 2,000 | 4,80,000 | ₹1.60 | 0.0178 | ₹0.375 |
| L2 Attested | ₹6,00,000 | 6,667 | 15,00,000 | ₹1.20 | 0.0133 | ₹0.400 |
| L3 Proven | ₹24,00,000 | 26,667 | 42,00,000 | ₹0.90 | 0.0100 | ₹0.571 |
| Sovereign / on-premises deployment | ₹1,20,00,000 per deployment per year | 1,33,333 | — | ₹0.55 | 0.0061 | — |
| (internal transfer to rung1, not public) | — | — | — | ₹0.40 | 0.0044 | — |

"The included rate rises with the level while the overage rate falls… the floor is a right to run an evidence plane, and the overage is consumption."

### 5.2 Add-ons and zero prices

| Item | Unit | ₹ | US$ |
|---|---|---|---|
| Regulatory pack (blended) | per tenant per year | 1,35,000 | 1,500 |
| Verifier profile | per regime per year | 3,00,000 | 3,333 |
| Counterparty verification seat | per year | 45,000 | 500 |
| Evidence bundle beyond allowance | each | 2,500 | 28 |
| Partner certification | per firm per year | 1,50,000 | 1,667 |
| **Offline verifier** | — | **0**, "source, to anyone, including non-customers… for ever" | 0 |
| **A refusal** | — | **0** | 0 |
| Anchoring | — | Not on the meter; a fixed cost inside L2. "a customer should never be able to buy a cheaper interval" | — |
| Sandbox | — | Metered at quantity 0, never billed | — |

### 5.3 Rules that travel with the prices (show as FAQ)

- Refusals meter at quantity zero, enforced by a database CHECK constraint, and are never billed. The refusal count appears *on the invoice*, "on the same table as the billed lines, with a control that opens the underlying records by write identifier and sequence".
- "The floor is not discountable, by anybody." The elan1 lead may move overage up to 20% below list for 12 months or less. The founder may move overage without limit and may change the tier. Nobody may touch the floor, the meter basis or the price of a refusal. There is no discount on the evidence line at L2. Every discount carries an end date, and a pilot price "names the list price it is a discount from".
- List prices are flat to March 2029 and then rise 4% a year.
- Partners keep 18% of list on partner-sourced revenue, shown as a contra line.
- "No per-seat price and no outcome price, anywhere in the group, at any assurance level."
- The meter basis is derived from the declared blast radius: per record, per counterparty, per batch, per tenant, per crossing. It is "never configurable per customer".
- "Every meter event carries a write_id and the record's sequence number; a line with no write_id cannot be invoiced." If two meters disagree, "the invoice goes out at the lower number".
- "An invoice is never issued over an unreconciled period." A discrepancy stops the invoice and pages.
- A tier below 40% gross margin for two consecutive months is repriced within one billing cycle (internal).

### 5.4 Deal-size examples (MODELLED; good calculator presets)

- **Entry**: L1 plus one pack, ₹3,15,000 a year (US$3,500). That is ₹1,80,000 + ₹1,35,000, inside the allowance.
- **Mid-market L2**: 30 lakh governed actions, one pack, one verifier profile, ₹28,35,000 (US$31,500). That is 6,00,000 + (30,00,000 − 15,00,000) × 1.20 + 1,35,000 + 3,00,000.
- **Large regulated L3**: 1 crore actions, two packs, two profiles and 20 seats, ₹93,90,000 (US$1.04m). That is 24,00,000 + 58,00,000 × 0.90 + 2,70,000 + 6,00,000 + 9,00,000.
- **Sovereign**: ₹1.20 crore (US$133,000) before metered volume.
- Typical year-one spend by level (§11.6): L1 ₹3–10 lakh; L2 ₹25–40 lakh; L3 ₹90 lakh–₹1.2 crore including sovereign.
- Run-rate per tenant at March 2031 (plan): L1 about ₹14.6 lakh, L2 about ₹59.4 lakh, L3 about ₹2.06 crore. The blended external figure is ₹40.2 lakh (US$44,700).

### 5.5 Calculator formula **[proposal, derived from the price book]**

`annual = floor[level] + max(0, actions − included[level]) × rate[level] + packs × 1,35,000 + profiles × 3,00,000 + seats × 45,000 + extra_bundles × 2,500`

Refusals are excluded by construction. Show "refused: n, ₹0" as its own line. The bundle allowance size is **not specified** in the IM (see Section 9).

### 5.6 Meter and billing screen needs (sample numbers)

- Governed actions committed (month / YTD), refused (count, ₹0), escalated, allowance used out of included, overage units × rate, basis breakdown, reconciliation (last nightly run, both directions, discrepancies = 0), invoice status (draft / blocked: unreconciled / issued).
- Sample invoice, L2 mid-market tenant, one month **[proposal, consistent with the plan]**:
  - Platform floor ₹50,000 (₹6,00,000 ÷ 12)
  - Governed actions 2,50,000, of which 1,25,000 included (15,00,000 ÷ 12), with 1,25,000 overage × ₹1.20 = ₹1,50,000
  - ledger1 ₹11,250
  - Verifier profile `in-mca-audit-trail` ₹25,000
  - **412 refused, ₹0**
  - Total ₹2,36,250
- Comparative anchors for a sidebar: Microsoft Agent 365 at US$15 per user per month (about ₹1,350, or ₹2.70 lakh a month for 200 users); Salesforce Agentforce at US$0.10 per action (about ₹8.80–₹9.00); ServiceNow AI Control Tower free for a year (a US$2m bundle). "Our top rate of Rs 1.60 sits well under that ceiling for a unit a hundred times rarer and a hundred times more consequential."
- For a pricing FAQ: "Every CFO asks, within about ten minutes, whether the vendor is incentivised to make the system say no. The answer is a constraint rather than a policy."

---

## 6. Competition: "Why elan1" page content

### 6.1 The map (two axes, p. 16 and p. 109)

- Axis 1, position relative to the action: documentation and registration, then runtime interception, then on the write path into a system of record.
- Axis 2, what is governed: model-centric (model, prompt, output, token) vs business-action-centric (the state change in the ERP).
- "The tell is always the data model… nobody rebuilds around a different noun after Series C."

Quadrants:
- **Documentation × model-centric**: Credo AI, Trustible, IBM watsonx.governance, Holistic AI, Saidot, Cranium, Relyance, Monitaur, OneTrust, Truyo, Vanta, Drata.
- **Enforcement × model-centric**: Zenity, Noma, WitnessAI, Straiker, HiddenLayer, Airia, ModelOp with Kong, Microsoft Agent 365, Bedrock Guardrails, Google Model Armor, Boomi's AI Gateway. "The unit is a model interaction, so the record is a trace."
- **Enforcement × action-centric, single-vendor**: Palantir AIP, ServiceNow AI Control Tower, SAP Agent Hub, Salesforce Agentforce Operations. "Right unit, right position in the path, locked to one estate."
- **Enforcement × action-centric, portable, checkable by a stranger**: "Empty. Including our row." elan1 is plotted with a hollow teal marker labelled "specified, not shipped".

### 6.2 The rule (print above the matrix)

> "A cell reads YES only where the capability is running in a customer's production tenant and is publicly evidenced. Partial means it exists for a narrow slice, or exists but does not do the load-bearing part. No means it is absent, announced, on a roadmap, in a datasheet, or built but not in production." Scores are elan1's reading of public material as at 20 September 2026 and are UNVERIFIED unless marked. "A finding by absence is weaker than a finding by presence."

### 6.3 The matrix: columns and every row (§12.3)

Columns: **Vendor · Central object · Stops a business write at runtime · Per-action record of the write · Independently checkable · Refusal recorded as evidence**.

| Vendor | Central object | Stops write | Per-action record | Independently checkable | Refusal as evidence |
|---|---|---|---|---|---|
| Credo AI | use case / model | No | No | No | No |
| Trustible | use case / regulation | No | No | No | No |
| Holistic AI | model risk | No | No | No | No |
| Monitaur | model + control evidence | No | Partial — evidence about a model | No | No |
| ModelOp | model | No | No | No | No |
| Cranium | AI asset inventory | No | No | No | No |
| Saidot | use case / policy | No | No | No | No |
| Relyance | data flow | No | No | No | No |
| Truyo | use case / privacy request | No | No | No | No |
| Airia | agent | Partial — agent gateway | No | No | No |
| OneTrust | policy / data asset | No | No | No | No |
| Vanta | control evidence | No | No | No | No |
| Drata | control / agent | No — monitoring, not enforcement | No | No | No |
| IBM watsonx.governance | model | No | No | No | No |
| ServiceNow AI Control Tower | agent / workflow | Partial — inside ServiceNow | Partial — workflow records | No | No |
| SAP Agent Hub | agent | Partial — inside SAP | Partial — SAP's own document trail | No | No |
| Zenity | agent (security) | Partial — blocks agent behaviours | No | No | No |
| Noma Security | agent / AI runtime | Partial | No | No | No |
| WitnessAI | AI interaction (network) | Partial — at the network layer | No | No | No |
| Straiker | agent runtime | Partial | No | No | No |
| HiddenLayer | model / agent harness | Partial | No | No | No |
| Fiddler AI | model interaction | Partial — policy at execution time | No — traces | No | No |
| Arize · Braintrust · Patronus · Arthur | trace / evaluation | No | No | No | No |
| Microsoft Agent 365 | agent identity | Partial — identity, DLP, conditional access, runtime blocking of coding agents | No — audit logs | No | No |
| Salesforce Agentforce Operations | agent action in Salesforce | Partial — inside Salesforce | Partial — permanent trail against a blueprint | No | No |
| AWS Bedrock Guardrails / AgentCore | model call / tool access | Partial — inside the AWS account boundary | No | No | No |
| Google Model Armor / Agentspace | prompt / response | Partial | No | No | No |
| Boomi Agent Control Tower | agent / integration | Partial — registry, guardrails, kill switch | No — observability and audit logs | No | No |
| Kong AI Gateway / Agent Gateway | API call | Partial — at the gateway | No | No | No |
| UiPath | automation run | Partial UNVERIFIED | No | No | No |
| Palantir AIP | the action, inside Foundry | Yes — but only on Foundry objects | Yes — on Foundry objects | No | Partial |
| **elan1 (L1, September 2026)** | **the governed write** | **No — nothing in production** | **No — nothing in production** | **No — L1 is unsigned by design** | **No — nothing in production** |

The contract says status is never shown by colour alone, so render Yes / Partial / No as text chips. The elan1 row must read "No" with the reason, never "Designed" or "Coming soon". The IM: "An earlier version of this matrix scored elan1's own per-action record as 'Designed'. That was the most misleading cell in the document, and it was ours."

### 6.4 Funding (optional sidebar; §12.5, figures as disclosed)

- Zenity: Series C US$125m (3 August 2026)
- Airia: US$100m (16 September 2025)
- Noma: Series B US$100m (July 2025; total US$132m)
- HiddenLayer: Series B US$100m (2 September 2026)
- Straiker: Series A US$64m (29 June 2026)
- WitnessAI: Series B US$58m (13 January 2026)
- Patronus AI: Series B US$50m (June 2026)
- Norm Ai: Series C US$120m at US$1.2bn (7 July 2026)
- Vanta: Series D US$150m at US$4.15bn (July 2025)
- anecdotes: Series B US$55m (8 April 2025)
- Fiddler AI: Series C US$30m (January 2026)
- Cranium: Series A US$25m (November 2023)
- Sprinto: Series B US$20m (April 2024)
- Monitaur: about US$13m total
- Trustible: Seed US$4.6m (June 2025)

Hazard: "Holistic AI" names two companies. The US$200m raise belongs to H Company (Paris) and must not be attached to the governance vendor.

### 6.5 elan1's claimed wedge (copy-ready)

- "Every platform governs inward." Microsoft's coverage of other platforms is "expanding but newer and partial", AWS AgentCore "stops outside the AWS account boundary", and ServiceNow is "strongest for what runs through ServiceNow" (Kosmoy, 16 August 2026).
- "None of them governs a write into SAP, Oracle EBS, Temenos, Finacle or Tally. And none of them produces evidence verifiable by a party that does not trust the vendor."
- "ServiceNow's evidence lives in ServiceNow. Microsoft's audit log is attested by Microsoft. Salesforce's permanent trail is permanent inside Salesforce's object model."
- "Open Policy Agent signs the policy bundle. It does not sign the decision."
- Okta vs elan1: "Okta answers *may this agent call this tool*; we answer *given this payload, in this tenant, against this record, at this value, does this write require a human, and what proof exists afterward*. Authorisation versus governance with evidence. They compose."
- Guardian agents: "A guardian agent is an agent: probabilistic, supervising another probabilistic system. A kernel is deterministic policy evaluation on the write path."
- Palantir: "the row that proves the design is right rather than the row that proves it is ours… If someone tells you nobody is building this, they have not looked at AIP."
- The empty space, stated with its caveat: "Across approximately 262 vendors surveyed… no funded company was found selling hash-chained, cryptographically sealed, RFC 3161-anchored, offline-verifiable evidence of enforced business actions as a product." Nearest language: Monitaur's "policy-to-proof workflows with cryptographic audit logs". "Absence of a public competitor is not proof of absence."
- Receipts field: an IETF draft exists (draft-marques-asqav-compliance-receipts-08, 31 August 2026), eight competing receipt protocols, and agentreceipts.ai, RCPT Protocol, PipeLab and Provenant. "being the ninth format is worse than being the second implementer of the first one." "The format is not the moat."

### 6.6 What would close the moat (honesty panel on the page)

1. Microsoft extends Agent 365 "audit-ready evidence" to cross-platform business writes with a verifiable receipt.
2. ServiceNow gains write operations or approvals into a system of record it does not own. This is "the single largest threat".
3. SAP or Oracle ships native write-path gating with signed evidence. This is "the existential scenario".
4. Any two of Microsoft, ServiceNow, SAP or Boomi make governance an included capability.

The watch list has four classes and 22 rows: A incumbent bundling (10), B open-source host moves up (9, with Frappe the sharpest case), C price collapse (6, trigger: "any major vendor prices a governed business action below Rs 4"), and D regulator or standard changes (7). What is not a trigger: funding rounds, rebrands, keynotes, roadmap slides, analyst placements.

---

## 7. Roadmap, gates and numbers for dashboards

### 7.1 Status today (22 September 2026), for the company and roadmap pages

"Eleven people, no external customer, no signed order, no invoice, no certification held, no published standard, and no evidence bundle yet verified by a party outside the company. Zero governed actions committed and zero refused. Cost per governed action is modelled, not measured. Refusal rate is not yet observable." Board page cells: "paying customers reads zero, revenue reads Rs 0, cost per governed action reads modelled only, refusal rate reads not yet observable, gate outcomes reads none attempted."

### 7.2 Gate calendar (§16.5). All dates MODELLED; statuses at IM date: not yet due

| Date | Gate | Observable condition |
|---|---|---|
| 31 Oct 2026 | Six coding blockers | E02, E03, R03, R01, S01, O01 all SIGNED |
| 30 Nov 2026 | Record shape frozen | 16-field preimage frozen; Declaration schema major (doors → channels) published |
| 31 Dec 2026 | First real governed write | End-to-end write, gate check, approval and proof in a design partner's own site, "with the bypass attempt shown failing" |
| 31 Dec 2026 | Customer zero real | stack1 is the runtime rung1 and elan1 actually run on |
| 31 Jan 2027 | Meter reconciles | Two-way clean for a full month; first internal invoice |
| 28 Feb 2027 | Term sheet signed | — |
| 31 Mar 2027 | Tranche 1, ₹63.0 cr | Funds received |
| 30 Jun 2027 | L1 general availability | Eight E09 readiness rows measured |
| 30 Jun 2027 | R3, the gating rung | A third party integrated against KernelPort under a signed agreement (elan1 kill criterion 5) |
| 30 Jun 2027 | Ten design partners | rung1 kill criterion 1 |
| 31 Jul 2027 | R1, first paying tenant | Signed order and payment received |
| 31 Aug 2027 | Key custody | Signing key per residency domain, successor registered, one rotation performed |
| 30 Sep 2027 | L2 signing live | Two independent seal implementations agree on all 64 vectors |
| 31 Oct 2027 | Timestamp authority | Contract with two authorities, one India-based; "Founder, not delegated" |
| 31 Oct 2027 | First pack in production | ledger1 live with a named statutory auditor; pilot day 0 |
| 30 Nov 2027 | Anchor job | Batched Merkle anchor |
| 31 Dec 2027 | Anchoring and verifier | Interval ≤15 min met over a measured month; verifier shipped with the tampered bundle |
| 31 Jan 2028 | Gate 1 | A paying customer's write verifies on an air-gapped machine, witness named |
| 31 Jan 2028 | Pilot verdict | Day-80 auditor verdict; day-85 answer |
| 31 Mar 2028 | Gate 2 | App three renders four doors from its Declaration with zero screen code |
| 30 Apr 2028 | L2 general availability; invoice1 live | E14 done-measurements 1–8 |
| 31 Oct 2028 | collect1 live; Tranche 2 (Gate A), ₹72.0 cr | Eight conditions: ≥84 tenants, exit ARR ≥₹15.35 cr, measured cost ≤₹0.338 for 26 weeks, one evidence line item, cash ≥₹14.13 cr… |
| 31 Dec 2028 | Gate 3 | A signed contract with evidence on its own line |
| 31 Mar 2029 | Certification target named | — |
| 31 Jul 2029 | Tranche 3 (Gate B), ₹45.0 cr; first sovereign deployment | External auditor acceptance; Action Receipt v1 with two external implementers; ≥186 tenants; exit ARR ≥₹48.14 cr… |
| 31 Oct 2029 | L3 entry | The four-test entry condition met in writing |
| 31 Mar 2030 | Certification held | ISO/IEC 42001 or SOC 2 Type II, dated |
| 31 Mar 2031 | Profitability | EBITDA positive, ₹22.58 cr |

Critical path: key custody, then L2 signing, then TSA contract, then anchor job, then verifier, then first India evidence pack, ending at Gate 1. It carries "one quarter of float". "The one dependency that moves everything is item 3, the timestamp-authority contract."

Market entry order: India BFSI and Companies Act entities (now), India insurance (FY2027-28), India healthcare/ABDM (demand-led), GCC and Singapore (FY2028-29), EU high-risk deployers (FY2029-30), US (FY2030-31).

Regulatory dates for a timeline component (PUBLISHED):
- MCA Rule 3(1)/11(g): 1 April 2023
- CERT-In Directions: 28 June 2022
- RBI FREE-AI: 13 August 2025
- DPDP Rules notified: 13 or 14 November 2025 (sources differ)
- RBI draft MRM: 24 June 2026 (no effective date)
- DPDP main obligations: 13 May 2027
- EU AI Act Annex III: 2 December 2027; Annex I: 2 August 2028; Article 50 live since 2 August 2026
- Colorado SB 26-189: 1 January 2027
- Texas TRAIGA: 1 January 2026
- IRDAI working group: 18 June 2026

### 7.3 Plan numbers (MODELLED), for investor and board dashboards

| | FY2026-27* | FY2027-28 | FY2028-29 | FY2029-30 | FY2030-31 |
|---|---|---|---|---|---|
| Revenue ₹ cr | 0.01 | 1.89 | 18.08 | 81.18 | 230.32 |
| Gross margin | n/m | 11.4% | 62.2% | 79.6% | 86.0% |
| EBITDA ₹ cr | −4.48 | −26.73 | −50.73 | −46.48 | 22.58 |
| Exit ARR ₹ cr | 0.09 | 5.02 | 33.68 | 133.04 | 334.23 |
| Closing cash ₹ cr | 66.44 | 38.67 | 55.23 | 38.41 | 30.41 |
| Headcount | 27 | 95 | 170 | 243 | 305 |
| Paying tenants (L1/L2/L3) | 0 | 39 (39/0/0) | 148 (109/39/0) | 312 (186/110/16) | 545 (279/211/55) |
| Sovereign deployments | 0 | 0 | 0 | 4 | 11 |
| Certified partner firms | 0 | 6 | 28 | 70 | 140 |
| Governed actions (m) | 0.36 | 26.32 | 202.39 | 885.59 | 2,491.46 |
| — external (m) | 0.00 | 13.28 | 147.79 | 746.09 | 2,211.46 |
| Revenue per action ₹ | 0.400 | 0.718 | 0.893 | 0.917 | 0.924 |
| Cost per action ₹ | 3.039 | 0.636 | 0.338 | 0.187 | 0.129 |

\*Six months. Revenue lines for FY2030-31, in ₹ cr:
- Platform licence 23.55
- Governed actions, external 176.98
- Governed actions, internal (rung1) 11.20
- Evidence 17.84
- Packs 7.63
- Sovereign 9.46
- Partner certification 1.69
- Channel contra −18.04

Quarterly FY2027-28 tenants: 0, 9, 21, 39. Monthly internal actions: January 2027 60,000; February 120,000; March 180,000.

### 7.4 Realistic sample values for console mock data

- **Tenant**: a mid-sized manufacturer on hosted ERPNext, India residency (Mumbai), L1 → L2 boundary at a named sequence.
- **Actors**: Rekha (human, approver); `ar-agent` (agent, A3); declaration `erp.ar` v7; policy v11.
- **Sequences**: 4,097 commit, 4,098 refusal, 4,099 escalation, 4,100 approval, 4,101 commit.
- **Counterparty**: ACME Textiles, org id `ar-org:acmetextiles.example`, credit limit ₹3,00,000.
- **Volume**: plan average about 4.6 million governed actions per tenant per year (FY2030-31). A mid-market L2 tenant runs about 30 lakh a year, or 2,50,000 a month. For refusals, use numbers like the IM's "412 refused" per invoice and "611 refusals of 12,480 records" (about 4.9%) in an export. Label them illustrative; the IM says the refusal rate is "not yet observable".
- **Export**: "12,480 records, 611 refusals, 22 unanchored".
- **Anchoring**: batches every ≤15 minutes, 1,024-record batch inclusion path of 10 digests (320 octets), about 640 bytes per record at L2, about 150 MB per 1,00,000-record year. Degraded banner at 09:14 with 88 unanchored.
- **Key**: `k_in_20270401_9c3a`, annual rotation, successor registered 30 days ahead.
- **Receipts**: 41,288 in March and 58,100 in April (disclosing about 16,800 writes).
- **Latency**, labelled MODELLED everywhere and "MEASURE THIS": p50 ≤120 ms, p99 ≤450 ms end to end; kernel about 64 ms p50 (stop/identity/door 4, gates 8, policy 12, guardrail/autonomy 8, act txn 18, proof 12, meter 2); sandbox and live applies ≤1,200 ms p95; end to end ≤2 s p95; proof write p50 ≤40 ms; advisory call p95 ≤40 ms; meter lag p99 ≤30 s.
- **Refusal codes** seen in the IM: `GATE.PRECONDITION_FAILED`, `GATE.DUAL_CONTROL_SAME_ACTOR`, `GATE.RECEIPT_REPLAYED`, `GATE.COUNTERPARTY_UNKNOWN`, `POLICY.RECEIPT_AUDIENCE_MISMATCH` ("return it; do not act on it"), `POLICY.RECEIPT_EXPIRED`, `POLICY.TRUST_ANCHOR_UNKNOWN`, `POLICY.RECEIPT_UNVERIFIED` ("stop; this is forensic, not commercial — do not negotiate it over email"), and `PLATFORM.*` (not billable; pages). DR-011 also mentions a `REF-nn` numbering; see Section 9.
- **Verifier exit codes**:

| Code | Name | Next move |
|---|---|---|
| 0 | PASS | "Rely on it, within the limits statement" |
| 0 | PASS — payload unbound | "Note it. Never printed as a failure" |
| 0 | PASS — unsigned, assurance level 1 | "Internal control evidence only" |
| 1 | FAIL_INTEGRITY | "Stop. This is forensic, not compliance" |
| 2 | FAIL_PROFILE | "The records are trustworthy and the bundle does not meet this regime's requirements" |
| 3 | INCOMPLETE | "Ask for a complete bundle" |
| 4 | UNSUPPORTED | "Obtain the matching verifier. Never interpret" |
| 5 | USAGE | "Operator error" |

- **Retention**: proof records 7 years and bundles 24 months (WORM, India); security logs ≥1 year (180-day India minimum); app logs 180 days; snapshots 30 days.

---

## 8. Honesty rules that must show up in UI copy

These are enforced product rules, not style advice. Conformance test **C14** fails the build if L1-rendered copy contains "signed", "tamper-proof" or "independently verifiable".

1. **Banned at every level, permanently**: "tamper-proof", "immutable", "court-ready", "legally admissible", "certified / accredited / approved" (until a dated certificate exists, then only "we hold X, covering Y, issued on Z"), "we cannot see customer data" (true only for a customer holding their own keys and salts), "your books are verified", and any form of "regulator X has accepted / approved / endorsed / reviewed this", including "we are in conversation with regulator X". Use **"tamper-evident"**.
2. **Banned at L1**: "signed", "independently verifiable", "cryptographic proof", "a third party can verify this without us", "this satisfies the MCA audit-trail rule", and "platform" / "AI platform" of elan1. The contract's L1 rule already forbids any "Signed by" row, signature, anchor time or verifier verdict on L1 screens; the IM supports this ("absent, not stubbed… not the word 'unsigned'").
3. **Banned for attested advisory, MCP and HTTP integrations**: "prevented", "blocked", "cannot", "we block", "we prevent", "nothing gets through without us", and "enforced". Every record and export carries the caller-performed flag.
4. **Banned words everywhere** (brand standard): "leverage", "robust", "seamless", "enterprise-grade", "best-in-class", "powered by". The contract adds "revolutionary" and "unlock". "Pro / Plus / Premium / Enterprise" are banned in elan1 product names (there is a live contradiction with "rung1 Enterprise"; see Section 9). "Governance" is banned in rung1 and stack1 copy; use "the elan1 layer".
5. **Provenance marks as UI chips**: `PUBLISHED`, `MEASURED`, `MODELLED`, `UNVERIFIED`. "Nothing in this memorandum is MEASURED unless it says so." Any latency, cost-per-action, price or forecast shown on the public site or console must carry MODELLED until measured. "No cell is an estimate wearing a measurement's clothes. A cell that cannot be filled is left visibly empty rather than quietly removed."
6. **"Designed is not shipped."** Capability status labels must use the IM vocabulary: *specification*, *building*, *generally available*, *not built*. Never "coming soon" as if it were a yes. Comparisons score elan1 No today.
7. **Levels are claims, not SKUs.** Always write "L1 Guarded", "L2 Attested", "L3 Proven". Show the level on every proof, export and report. Records before an upgrade boundary are labelled L1 for ever.
8. **Outcomes are three, not four**: committed, refused, escalated. There is no "warning" and no "succeeded with warnings". Refusal copy follows the pattern "Not done — <reason>" plus the numbers plus next actions. Platform failures say "we failed", are not billable, and are never shown as a policy refusal: "a governance layer that reports its own failures as policy refusals is lying to its customer".
9. **Verifier failure classes are never merged.** "Altered is not unmet requirement is not missing piece." "Withheld is not missing, and missing is not altered." FAIL_PROFILE copy must never imply tampering.
10. **Limits statements are shown unprompted.** Each verifier report reproduces the profile's limits statement verbatim. ledger1 must say what it does not establish "in the same breath". The receipt limits line: "this establishes that the issuer's governed write path produced this record under these rules at this time. It does not establish that the underlying transaction occurred."
11. **Anchor copy**: "An anchor is an upper bound on time: existence, form, and no later than." Never "proves when it happened".
12. **Precedent and autonomy copy**: "Precedent is not prediction and earned autonomy is not a safety argument. It is a graduated permission with an evidence trail and a revocation path." Never "we suggest approving".
13. **Key custody disclosure**, given unprompted on the security page: "at Phase 3 the signing key is held in elan1's own cloud account under a managed KMS, and a sufficiently privileged insider in that account could alter the key policy." "One signing key per residency domain, not per tenant." "A tenant cannot prove its records were signed by a key no other tenant's records used."
14. **Traction**: never present rung1 internal revenue as customers or traction. Never describe an auditor conversation as "validation". No auditor logos or quotations.
15. **Reconciliation disclaimer on L1 Records**: at L1 "reconciliation against the target system — not chain verification — does the real work", because a chain "cut at record 4,000 of 4,200 is internally consistent and reads as complete".
16. **Erasure**: never claim erasure is solved. The verifier prints "PASS — payload unbound". The DPDP question is open: counsel was due 30 November 2026 and it must be settled before the first paying tenant and no later than 13 May 2027.
17. **Certification**: "We hold no certification of any kind — no SOC 2, no ISO/IEC 27001, no ISO/IEC 42001, no NIST AI RMF assessment." Never place a certification logo beside an assurance-level claim.
18. **Standard**: say "published", not "open", until a non-elan1 implementation passes conformance.
19. **Brand casing**: brand names are always lowercase, even at the start of a sentence. Rewrite the sentence rather than capitalise.

---

## 9. Gaps and value-adds: what the concept needs that no document specifies

### 9.1 Surfaces the IM implies but does not specify

1. **Identity, users, roles and SSO.** The IM defines actor kinds, approver sets and dual control, but gives no user management, role model, SSO or MFA, and no invite flow. With no Settings door allowed, place it at `#/assurance/access` (who may approve is an assurance question) and link from the user menu.
2. **Declaration authoring UI.** The lifecycle is author, validate, simulate, certify, compile, resolve. The IM specifies the schema but no editor. Needs: a JSON editor with the 11 semantic rules inline, a disposition picker (value / out_of_scope + ADR / not_measurable + reason + would_change_if, each at least 12 characters), a version diff, a simulate run against the reference tenant, and a certification dual-control flow.
3. **Gate 2 means declaration-rendered screens.** Record detail, decide and export templates should be generated from `shape`, `write_types` and `proof_binding`. Build generic, declaration-driven components rather than ERP-specific ones.
4. **Pack admission register and pilot tracker.** Internal tools: portfolio register (admitted / rejected by name with gate and sentence), 90-day pilot timeline (day 0 necessity statement through day 85 question), T1–T8 test board.
5. **Kernel Change Request and decision register viewer.** KCR queue: acknowledge within 1 working day, apply the "declaration or adapter?" test, write an ADR, founder signs or refuses. The public `#/company/decisions` shows DR-001 to DR-013.
6. **Public measured-cost page.** The company "has committed to publishing that measured cost weekly, whether or not it flatters", beside the refusal rate. No page is specified.
7. **Public mapping table.** "Action Receipt field → EU AI Act Article 12, 14, 19, 26 → NIST control overlay → ISO 42001 Annex A → DPDP obligation → MCA Rule 3(1) → SEBI logging requirement. One table, public. That table is the product's credibility." (§13.9). There is no page for it; add `#/standard/mapping`.
8. **Insurer surface.** The underwriting profile shape is described but no screen or flow exists.
9. **DPDP evidence pack.** Named once (FY2027-28) with no spec. It is also the likely home for consent ledger and erasure evidence.
10. **Erasure case management.** The flow is specified (plan before deletion, 72-hour dual control, a failed job keeps the case open) but no UI.
11. **Kill switch, revocation and regulator directive (rung 0b).** No UI or copy spec. Design the Stop screen with an explicit scope (tenant / write type / agent), effective at the next write, recorded as a governed write.
12. **Notifications.** Obligations expire in 4 hours, anchoring degrades, the key compromise notice must go out within 24 hours from pre-fixed templates, and deprecation notices go to "a named human". None of these notification surfaces is specified; the template wording is "fixed in advance" but not given.
13. **Approval on mobile, messaging and voice channels.** Channels may carry approval, and MCP `input_required` is "the native human-approval channel". There is no approver UX for non-web channels.
14. **Receipt issuance UI (L3).** Audience selection, the volume-disclosure warning, and disclosure lists.
15. **Status page components and SLOs** are named but the uptime targets and response times are not. The support address "response-time promise" is unspecified.
16. **Customer-facing synonym for "governed action".** Open question 7: never tested on a CA selling to a ₹5 crore firm. **[proposal]** Keep "governed action" in the console and test "checked change" or "approved write" on the public pricing page, labelled as a copy test.
17. **Evidence bundle allowance.** "Beyond allowance" is priced at ₹2,500, but the allowance quantity is never stated, and the spec says export is free and unlimited. The calculator and billing screens need a decision.
18. **Onboarding for target systems other than ERPNext.** SAP, Oracle, Temenos, Finacle and Tally are named as the wedge, but only hosted ERPNext exists in Phase 1. Show them as "not available" with the reason: the kernel must hold the credential.
19. **Sample-data time frame.** Today (September 2026) nothing exists. **[proposal]** The console demo should run in an explicit illustrative future (for example, an L2 tenant in 2028) with a persistent "Illustrative sample data — elan1 is pre-revenue" banner, so screens never imply traction.
20. **Accessibility, localisation and Indian languages.** Not mentioned in the IM. Bhashini's 22 languages appear only as market context. The contract sets WCAG 2.2 AA.

### 9.2 Contradictions in the IM that designers must resolve or label

| Topic | Conflict | Suggested UI handling |
|---|---|---|
| Model at rung 4 | §4.3 says evaluate() has "No model, at any level, ever", while the Glossary says evaluate() is "the only rung at which a model may be called" | Follow §4.3/§6.3 and the lead line "may never produce an allow". Flag to the founder |
| ledger1 live date | October 2027 (body) vs "ships Q1 2028 at Gate 1" (B.4); min L2 vs L2 GA April 2028 | Roadmap: "Pilot binding from Oct 2027; full profile at L2 GA (Apr 2028)" |
| L2 timing | "L2 Attested from Q3 2027" (B.9) vs GA April 2028 | Distinguish "signing live internally Sep 2027" from "GA Apr 2028" |
| Key rotation | 12 months (§7.7) vs 90-day (§10) | Show the register's actual windows and leave the period unquoted |
| Keys per tenant | 13-row bar says "per-tenant" vs one key per residency domain | Use per residency domain (disclosed limitation) |
| Retention | Proof records 7 years (§10) vs MCA 8 years | Flag. A ledger1 screen cannot say 7 years against an 8-year rule |
| Sandbox limits | 10/min and 2 concurrent (§6.9) vs 10/min and 5,000/month hard stop (§16.2.5) | Show all three |
| Bundle charge | ₹2,500 each beyond allowance vs "export is unlimited and free" | Pricing FAQ: "open commercial item" |
| Anchor interval | Never purchasable vs "does Enterprise buy a shorter one?" | Show ≤15 min as a platform SLO; no upsell |
| Refusal code numbering | Named codes (`GATE.*`) vs DR-011 "refusal codes REF-nn" | Display the named code, with REF-nn as a secondary id if one exists |
| Blast radius | Declaration's five values vs the contract's four-step ladder | Map: one_record/one_counterparty → Contained or Reversible by reversal plan; batch → Material; tenant/cross_boundary, or irreversible → Irreversible **[proposal]**. Always print the declared value |
| "rung1 Enterprise" | Brand standard bans "Enterprise" | Use it (as the IM does) but never create any elan1 tier named Enterprise |
| DPDP Rules date | 13 vs 14 November 2025 | Show "November 2025" |
| FY2030-31 EBITDA | ₹22.58 cr (annual) vs ₹15.6 cr (scenario engine) | Label MODELLED; prefer the annual summary |
| First verifier profile deadline | Q2 2027, 30 June 2027 and 31 March 2027 in three different documents | Show no date for it |

### 9.3 Value-adds worth designing now

- **Verify-in-browser** (`#/verify`) as the signature public experience. Drop a bundle, paste a fingerprint obtained elsewhere, and get an exit code, a class and a next move, all offline in the tab. Include a "Try the tampered bundle" button that shows FAIL_INTEGRITY naming record and field. This turns "the strongest thing you can do with this is not use our software" into a demo. The page should also say that route four (write your own verifier) is the one that matters.
- **The invoice as hero component**: the refusals-₹0 line with click-through to records by write id and sequence.
- **The claim sentence component**: one component renders the verbatim claim for the tenant's current level and mode (L1/L2/L3 × Enforced/Advisory) everywhere the level pill appears.
- **An "Open questions" pattern**: every console empty state and public page can carry "What we do not know yet" rows with owner and date, mirroring the company's two-tables rule (decisions made, open questions left).
- **A gate-and-kill timeline** on `#/roadmap`, with gates above the line and kill criteria below (p. 204 figure), and statuses attempted / passed / failed / not yet due. "A gate nobody attempted is not a gate that has not failed."
