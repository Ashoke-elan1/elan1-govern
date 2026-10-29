# 04 — Competitor Analysis: Elan1 Govern

Read on 27 October 2026. Purpose: give the team building the new Elan1 Govern React front end a clear picture of what competitors ship and how their products look, so the new UI is clearly better than theirs.

**How this was gathered.** The vendor list comes from the Information Memorandum §12 (map, rescored matrix, money table, watch list) and R12, plus adjacent players named in the brief. Product facts come from vendor pages and vendor press releases, read through web fetch and web search, and from third-party listings where vendors publish nothing (these are marked). The Firecrawl account had no credits left, so every screenshot was taken locally with headless Chrome at 1440 px wide. Cookie banners show in some captures. None were accepted, and no form was filled. Feature cells are **published claims, not verified in product**. Under the IM's DR-010 rule ("designed is not shipped"), a claim, preview or roadmap item is not counted as a shipped capability.

Screenshots folder: `E:\elan1 govern Final\analysis\competitors\screenshots\`. It holds 21 page captures (`<slug>.png`) and 21 product-UI images (`<slug>-ui-N.png`), 42 PNGs in total.

---

## 1. The field at a glance

| # | Vendor | Product(s) | IM quadrant | One-line positioning |
|---|---|---|---|---|
| 1 | Credo AI | Credo AI Platform; Agent Governor (research preview) | Documentation × model | "Measurable trust for every AI system". Registry, risk intelligence and policy packs, now starting on harness-level runtime enforcement |
| 2 | Trustible | Trustible AI Governance Platform | Documentation × model | AI governance for the "intelligent enterprise". Intake, risk, monitoring and compliance, with expert content |
| 3 | Holistic AI | Identify / Protect / Enforce; Guardian Agents | Documentation × model (moving to runtime) | End-to-end governance: discovery, red-teaming and testing, plus runtime Sentinel and Operative agents |
| 4 | Saidot | Saidot (knowledge-graph governance) | Documentation × model | "Agent-first", graph-based governance. Risks and controls are inherited automatically across linked systems |
| 5 | OneTrust | AI Governance (+ AI Guard SDK) | Documentation × model (moving to runtime) | Turns AI policy into controls that run where AI runs, built on a privacy/GRC suite |
| 6 | IBM | watsonx.governance (+ OpenPages) | Documentation × model | "Govern any AI, anywhere". Lifecycle governance plus enterprise GRC (Gartner Leader) |
| 7 | Monitaur | Monitaur Governance Platform | Documentation × model | "Policy-to-proof" model governance for insurers and FS. The IM rates it the highest narrative threat |
| 8 | Truyo | Truyo AI Governance | Documentation × model | AI governance plus privacy and consent at scale (Gartner Leader). Widest regulation list, including DPDP |
| 9 | ServiceNow | Super Intelligence Control Tower (ex-AI Control Tower); AI Passport | Enforcement × action, single vendor | A central hub to discover, secure, govern, observe and measure any AI, now with signed agent passports |
| 10 | Airia | Airia platform (Discover / Secure / Govern / Optimize) | Enforcement × model | Discovers every AI agent and enforces policy on actions across every model, agent and tool |
| 11 | Kong | Kong AI Gateway / Agent Gateway / MCP Registry (Konnect) | Enforcement × model | "Govern all AI traffic. Do it with one gateway." Covers LLM, MCP and A2A |
| 12 | Zenity | Zenity platform (Surface / Enforce / Protect) | Enforcement × model | "Secure the decision." Agent security with Runtime Boundaries (US$125m Series C) |
| 13 | Microsoft | Agent 365 | Enforcement × model (platform) | Control plane to observe, secure and govern agents; US$15/user/month or in M365 E7 |
| 14 | AWS | Amazon Bedrock AgentCore (Gateway, Identity, Policy, Observability) | Enforcement × model (platform) | Production agent platform. Cedar default-deny policy on every Gateway tool call |
| 15 | Boomi | Agentstudio + Agent Control Tower / Agent Control Plane | Enforcement × model | Build, govern and orchestrate all agents. Cross-vendor registry, anomaly detection and kill switch |
| 16 | Noma Security | Noma Agent Security & Governance | Enforcement × model | Agent security and runtime governance for endpoint, SaaS and cloud agents (US$132m raised) |
| 17 | WitnessAI | WitnessAI (Observe / Control / Protect) | Enforcement × model | Unified AI security and governance for both people and agents, enforced at the network layer |
| 18 | Drata | AI Agent Governance (Limited Availability) | Documentation, moving to enforcement | Discovers every agent, enforces policy before an action executes, and keeps "auditor-grade proof" of each decision. **Closest to Elan1** |
| 19 | Vanta | AI Governance (early access) + Trust Center | Documentation × model | Extends the Trust Graph to agents: see every agent, set guardrails, prove behaviour |
| 20 | Lakera / Check Point | Check Point AI Guardrails (ex-Lakera Guard), AI Red Teaming, AI Agent Security | Enforcement × model | AI-native runtime security: prompt-injection and leakage protection under 50 ms |
| 21 | Fiddler AI | Fiddler AI Control Plane | Enforcement × model | "The AI control plane". Observability, evaluations, inline guardrails and governance evidence |

Noted but not profiled: Palantir AIP (the only IM row with two Yes cells, Foundry-only), Salesforce Agentforce Operations, SAP Agent Hub, ModelOp, Cranium, Relyance, Straiker, HiddenLayer, Patronus, Norm Ai, Google Model Armor. Okta, Astrix and Permit.io were left out to stay near the cap of 20; they are identity and authorization layers rather than governance UIs.

---

## 2. Vendor profiles

Each profile covers: product, buyer, core features, deployment, pricing, UX seen, gaps against Elan1 Govern, and screenshot files.

### 2.1 Credo AI
- **Product:** Credo AI Platform (AI Registry & Discovery, Risk Intelligence/Risk Center, Policy Engine with policy packs, Governance Workflows & Approvals, Runtime Governance) and **Agent Governor** (research preview, launched 14 Jul 2026).
- **Buyer:** Chief AI/Responsible-AI officers, risk and compliance, and AI governance councils at large enterprises. Rated a Forrester Leader (Q3 2025).
- **Core features:** A registry covering "every model, vendor, and agent". Shadow-AI detection. Agentic risk-control library (tool misuse, scope drift, inter-agent risk). Policy packs for the EU AI Act, NIST AI RMF and ISO 42001 ("20+ standards"). Integrations with Snowflake, Databricks, AWS, Azure, ServiceNow, Jira and Slack. Agent Governor compiles policy into governance-as-code inside the agent harness, with outcomes of **Block / Allow / Escalate / Advise**. It currently supports Claude Code only, with Codex, Cursor and Copilot "coming soon", no production SLA, and "policy audits coming soon".
- **Deployment / pricing:** SaaS. Pricing not public.
- **UX seen:** Dark hero with a product mock: a hexagonal **trust radar** (Bias 77%, Security 89%, Privacy 100%, Reliability 72%, Safety 90%, Compliance 40%) above module cards ("AI Registry – AI Visibility", "Risk Intelligence – Risk Coverage"). Big outcome stats (100% / 10x / 70%). The product-page "build" GIFs are abstract 560×160 banners, not UI.
- **Gaps vs Elan1:** Runtime enforcement is a preview on one harness. No MCP proxy and no credential custody. Evidence is telemetry, not signed receipts, and cannot be verified offline. No DPDP or RBI FREE-AI content.
- **Screenshots:** `credo-ai.png`. No usable UI image: the GIFs are decorative and were deleted.

### 2.2 Trustible
- **Product:** Intake → Manage Risk → Monitor → Comply. Adds an agentic governance activity feed and an AI assistant over the inventory.
- **Buyer:** Governance teams, AI strategy leaders and General Counsel in regulated industries (FS, healthcare, insurance, defence, public sector via Carahsoft).
- **Core features:** Inventory of use cases, models, agents and vendors. Risk-routed intake. Risk and impact assessments with a risk matrix. Expert-curated risk and regulatory intelligence. Map-once, comply-many across the EU AI Act, NIST AI RMF, ISO 42001 and US state laws. Board and audit reports. A third-party review notes it **enforces at the governance layer only and cannot block at runtime**.
- **Deployment / pricing:** SaaS with a 30-60-90 day onboarding and a named advisor. Pricing not public.
- **UX seen:** Black, editorial site with a serif headline and a hot-pink CTA. The site renders product views as HTML rather than images, so the hero capture is mostly empty black.
- **Gaps vs Elan1:** No runtime control, approval gate or proxy, and no cryptographic evidence.
- **Screenshots:** `trustible.png`.

### 2.3 Holistic AI
- **Product:** Identify (discovery, shadow AI, inventory), Protect (assessments, automated testing, agentic red-teaming, Agent Graph), Enforce (policy → workflow, control mapping, audit evidence). **Guardian Agents:** Sentinel agents monitor and alert; Operative agents intervene on tool calls, access, cost and identity, including "kill switches" and privilege revocation.
- **Buyer:** Governance leads, risk and compliance, ML engineers, InfoSec and TPRM teams (Unilever, MAPFRE, Starling Bank). Gartner MQ 2026 **Challenger**.
- **Frameworks:** EU AI Act, NIST AI RMF, ISO 42001, **NYC LL 144**, plus custom frameworks.
- **Deployment / pricing:** SaaS with read-only, agentless connectors (AWS, Azure, GCP, Databricks, MLflow, LangGraph, CrewAI, ServiceNow, Jira and others). SDKs, REST and webhooks. SOC 2. Pricing not public.
- **UX seen:** `holistic-ai-ui-1.png` is the best-looking dashboard in the set. It has a **navy left rail** (Home, Workstation with a 43 badge, Analytics; CORE: Tracer, Plane, Store; Settings, Documentation), white content and five KPI cards with "View all →" links (Total Assets 18 ↗+12.5%, Shadow AI 5, Artifacts Discovered 346 with a progress bar, High-Risk Assets 2, Actionable Tasks 38). Below sit a Platform Growth area chart with 1H/1D/1W/3M toggles, **inherent vs residual risk donuts**, a Task Executions donut, Activity Analytics (Timeline / By User / By Type) and a **Live activity feed** with green and blue status pills.
- **Gaps vs Elan1:** Runtime intervention is agent-based monitoring, not a signed allow/ask/refuse decision point in the path. No MCP credential custody and no verifiable receipts.
- **Screenshots:** `holistic-ai.png`, `holistic-ai-ui-1.png`.

### 2.4 Saidot
- **Product:** A knowledge-graph governance platform: AI inventory, Agent Catalogue, Control Catalogue, Policies, workflows, notifications and runtime observability.
- **Buyer:** AI product and engineering teams together with legal, compliance and risk in the EU. Gartner MQ Niche Player.
- **Core features:** A curated graph of 260+ risks, 620+ controls, 110+ policies and 170+ third-party models. Linked systems inherit risks and controls automatically. Agents are classified by the tools they can reach. Lifecycle approvals with "humans make final decisions". Slack, Jira and webhook notifications. Imports from Microsoft Foundry and Amazon Bedrock. About 95% of functions are API-accessible. **MCP servers let customers' own AI assistants draft assessments**, with human approval required.
- **Deployment / pricing:** SaaS, on Azure Marketplace. Third-party listings (Capterra) quote SME €1,000, Library €1,400 and Enterprise €3,100 per month; unverified.
- **UX seen:** Bright-blue hero with a particle graph. The product UI is calm and editorial: breadcrumbs ("Governance / General / Agents"), a **serif page title**, a one-line description, tabs (Agents | Tools), "Showing 16 of 16 agents", and a sortable table (Name, Owner, Platform such as Foundry Agent Service or AWS Bedrock, and a Risk icon). The Controls page has a KPI strip (Total controls 196 ↑300%, **Graph leverage score 2x**, Risk coverage 61%), Controls/Policies tabs with count badges, and **framework tags per row** (GDPR, EUAIA).
- **Gaps vs Elan1:** Documentation only. "Runtime observability" turns events into governance tasks but enforces nothing. No receipts.
- **Screenshots:** `saidot.png`, `saidot-ui-1.png` (Agent catalogue), `saidot-ui-2.png` (Control catalogue).

### 2.5 OneTrust — AI Governance
- **Product:** AI inventory and discovery, risk and impact assessments, AI Policy Manager, Guardrail Enforcement (block, redact, route), **AI Guard SDK** for inline prompt and response protection, agent registration with permissions and allowed actions, **MCP policy enforcement** and audit logs. Runtime monitoring covers Bedrock and Microsoft Foundry.
- **Buyer:** Privacy, security, risk and AI-platform teams and AI governance councils. Gartner MQ 2026 **Visionary**.
- **Frameworks:** EU AI Act, NIST AI RMF and ISO 42001 templates. The OneTrust privacy library sits underneath (GDPR and others).
- **Deployment / pricing:** SaaS, Python SDK. Integrations with Bedrock, Foundry, Vertex, Databricks Unity Catalog, Jira and Palo Alto. Pricing: "scalable packages", no figures.
- **UX seen:** `onetrust-ui-1.png` is "Dashboards & Analytics" with a black icon rail. It opens with a **"New data" alert banner** ("New data has been linked to Zentoso project. Review project for new risks…") and charts titled as **plain questions** ("What is the risk of my AI projects?", "Are my projects on track?"). Below are project rows with pills (Pending review, New risks, High risk, 1 outstanding item) and a Recent activity panel. `onetrust-ui-2.png` shows the EU AI Act risk-classification workflow.
- **Gaps vs Elan1:** Enforcement is guardrails and SDK, not a signed decision record. Evidence is attested by OneTrust. No offline verification.
- **Screenshots:** `onetrust.png`, `onetrust-ui-1.png`, `onetrust-ui-2.png`.

### 2.6 IBM watsonx.governance
- **Product:** Governance graph and "living map" of AI, policy enforcement, obligation mapping, continuous compliance evidence, risk signals, shadow-AI detection, value tracking. Enterprise GRC through OpenPages.
- **Buyer:** CRO, CCO, model risk, audit and AI CoE. Gartner MQ 2026 **Leader** (top right). Leader in IDC and Forrester.
- **Frameworks:** EU AI Act, NIST AI RMF, ISO 42001, Data & Trust Alliance content.
- **Deployment / pricing:** Cloud and on-prem, on AWS and Azure marketplaces, 14-day free trial. Plan prices sit on a separate pricing page (not verified).
- **UX seen:** IBM Carbon design: light, airy and grid-based. The UI GIFs show "Identify risk", a 4×4 **red-to-green risk heat-map** next to a check-list (Mitigating controls, Loss events, Key indicators, Parent processes, Issues) with carousel dots. This is classic GRC.
- **Gaps vs Elan1:** Not in the tool-call path. No approval-before-execution, no MCP proxy, no signed receipts.
- **Screenshots:** `ibm-watsonx.png`, `ibm-watsonx-ui-1.png`, `ibm-watsonx-ui-2.png`.

### 2.7 Monitaur
- **Product:** Define (policy, programme design, risk assessment, education), Manage (inventory, controls, collaboration, vendor governance), Automate (drift and bias, stress testing, transaction search). Historic modules: GovernML, RecordML, MonitorML, AuditML.
- **Buyer:** Insurance carriers and FS model-risk teams (Progressive, Unum, Clearcover). Gartner **Visionary**.
- **Note:** Uses the vocabulary closest to Elan1's, "policy-to-proof workflows with cryptographic audit logs" (IM §12.8). Its own documentation says it does not gate or block at runtime.
- **Deployment / pricing:** SaaS, SOC 2 Type II. Pricing on request.
- **UX seen:** Marketing site with 3D maze art. No product UI is published.
- **Gaps vs Elan1:** Evidence is about a model, not a per-action signed record. No enforcement.
- **Screenshots:** `monitaur.png`.

### 2.8 Truyo
- **Product:** AI discovery (scans websites, code and content), prebuilt risk and impact assessments, model validation (bias and hallucination), AI governance training (LMS), AI consent, vendor AI assessments, all inside a privacy suite.
- **Buyer:** Large enterprises: legal counsel, AI governance boards, privacy admins. Gartner MQ 2026 **Leader** in AI Governance and in Privacy UX.
- **Frameworks:** EU AI Act, **Colorado AI Act**, NIST AI RMF, CCPA, **DPDP**, "+35 more". It is the only competitor found that names DPDP.
- **Deployment / pricing:** SaaS. A "Learn pricing" link with no figures.
- **UX seen:** The hero is an SVG dashboard illustration (`truyo-ui-1.png`). Privacy-UX heritage: form-heavy flows.
- **Gaps vs Elan1:** No runtime, agent-action or evidence chain.
- **Screenshots:** `truyo.png`, `truyo-ui-1.png`.

### 2.9 ServiceNow — Super Intelligence Control Tower (SICT) and AI Passport
- **Product:** Renamed from AI Control Tower. Discover (30+ integrations: AWS, GCP, Azure, SAP, Oracle, Workday; AI assets become CMDB configuration items), Observe (Traceloop), Govern (five risk frameworks aligned to NIST and the EU AI Act), Secure (Veza access graph; a **kill switch** that revokes credentials across ServiceNow, Okta, GCP and Bedrock), Measure (cost and ROI), plus an AI Gateway. **AI Passport** (announced 15 Oct 2026, expected Q4 2026) is a cryptographically signed credential per agent. It defines identity, permitted actions, systems and owner, is checked at runtime, and its drift response is redirect, restrict or kill.
- **Buyer:** CIO, CISO and CDAO in existing ServiceNow estates. Gartner MQ **Leader**. Free for one year on a large bundle (IM §12.6).
- **UX seen:** `servicenow.png` shows a dark-teal brand. The hero product shot is a "Global Policy Agent" record (status chips "Deployed and active", "Managed", "Agentic AI"; tabs Overview, Details, **Monitor**, Risk & Compliance, Value & Engagement), a trend line, and a **"Recent evaluated sessions" table** with colour-coded Quality and Safety score chips and runtime tokens. A floating "Ask or search for anything" bar sits at the bottom. The AI Passport card shows a **"Signature valid" chip**, "Signed by ServiceNow under Acme Corp authority", Issued and Expires dates, **Download Passport / Revoke Passport** buttons, Agent identity, Data & risk (classification "Confidential", risk "High"), and the models and tools the agent uses.
- **Gaps vs Elan1:** The Passport signs **what an agent may do**, not **each decision it was given**. Evidence lives inside ServiceNow and is not offline-verifiable by a third party. Authority is strongest inside ServiceNow. **Biggest threat** (IM §12.7 #2).
- **Screenshots:** `servicenow.png`. The product shots are embedded in the page capture; no separate image was downloaded because the CDN returned 403.

### 2.10 Airia
- **Product:** Discover (AI Discovery, Security Posture, AI Inventory, Risk Classification), Secure (Red Teaming, **MCP Gateway**, **Agent Constraints**, AI Guardrails), Govern (Governance Dashboard, Compliance Reporting, System Controls), Optimize (Agent Builder, model routing, cost).
- **Buyer:** Security, governance and AI-platform leaders. Gartner MQ Visionary, and "ranked #1 in the AI Security use case" in Gartner Critical Capabilities.
- **Core features:** Agent Constraints intercepts tool calls **before execution** without SDK changes. It uses an IF-THEN policy language over agent identity, user context, data classification and tool parameters, with outcomes allow, block, restrict parameters, AUDIT, or **trigger an approval workflow**. The MCP Gateway is a remote, OAuth-protected endpoint that aggregates MCP servers and OpenAPI tools (1,000+ connectors). Compliance documentation maps to the EU AI Act, NIST AI RMF, SR 11-7, HIPAA, ISO 42001 and SOC 2.
- **Deployment / pricing:** SaaS. Third-party listings show Free (1 user, 100 executions), Individual US$50/month, Team US$250/month and Enterprise custom; unverified.
- **UX seen:** `airia.png` shows a soft lavender gradient and pill tabs (Discover | Secure | Govern | Optimize) driving an embedded product mock. It has a nested left nav (Connect, Dashboard, Agents ▾, Inventory ▾, Activity Feed), KPI cards with sparklines (Assets Discovered 17.1K, Critical Exposures 3 with a red spark, AI Calls 24h 9, "350% vs yesterday"), a **"CRITICAL FINDING" callout**, and a **natural-language query composer** ("Which unsanctioned AI apps can read email?") with persona avatars and a "High risk" chip.
- **Gaps vs Elan1:** The closest functional analogue for the guard. Its logs are not signed, chained or offline-verifiable, and it has no independent auditor workflow or India frameworks.
- **Screenshots:** `airia.png`. The UI lives in page HTML, so there is no separate image.

### 2.11 Kong — AI Gateway / Agent Gateway / MCP Registry
- **Product:** One gateway for LLM, MCP and A2A traffic. Semantic prompt guards, PII sanitisation, token and model quotas, semantic caching and routing, MCP server generation from APIs, MCP auth, A2A AuthN/AuthZ, and per-call A2A audit records (caller identity, capability invoked).
- **Buyer:** Platform and API teams. Gartner API Management Leader for seven years.
- **Deployment / pricing:** Konnect SaaS, hybrid or self-hosted. Plus tier is partly public (third-party figures vary, roughly US$105 per gateway service per month); Enterprise custom.
- **UX seen:** `kong-ui-1.png` shows the **Konnect "AI Gateway Dashboard"**: a dark-navy left nav (Overview, Gateway Manager, Mesh Manager, API Products, Dev Portal, Analytics ▸ Summary, Dashboards, Explorer, Reports, Requests; Service Catalog; Networks; an org switcher "Acme Inc."; a region switcher "US (North America)"). It has **⌘K quick search**, a "+ New tile" button, a "Last 7 days" picker and refresh, and tiles for model usage, provider usage, status codes, an "AI security report" and token usage. `kong-ui-2.png` is the LLM-providers overview.
- **Gaps vs Elan1:** Network and API governance with no business-rule decision of allow / ask-person / refuse, no human approval, no inventory or assessments, and no signed evidence.
- **Screenshots:** `kong.png`, `kong-ui-1.png`, `kong-ui-2.png`.

### 2.12 Zenity
- **Product:** Surface (AI Observability inventory, AISPM, AI Exposure Management), Enforce (**Runtime Boundaries**, which evaluates each agent action in context and **allows, blocks or shuts down the agent**; Agentic IAM with Okta and Entra), Protect (AIDR, **MCP Security** at tool level, Guardian Agents triage).
- **Buyer:** Enterprise CISOs and security operations (Fortune 50/500). Covers Copilot Studio, Agentforce, Bedrock, Vertex and endpoint coding agents.
- **Frameworks:** OWASP LLM / agentic and MITRE ATLAS mappings, plus "compliance-ready reporting".
- **Deployment / pricing:** SaaS. Pricing not public.
- **UX seen:** Dark purple brand. The marketing site publishes **no product UI**: the hero GIF's first frame is an empty canvas, and other assets are illustrations. Those images were checked and deleted.
- **Gaps vs Elan1:** No documented human-approval path (three outcomes only). No signed or chained decision records. Security-centric, with no inventory-to-assessment-to-framework governance layer.
- **Screenshots:** `zenity.png`.

### 2.13 Microsoft Agent 365
- **Product:** Registry (Microsoft, partner and self-registered agents; Entra Agent ID), Agent Map, analytics, role-specific oversight. Governance: IT-controlled onboarding, policy templates, lifecycle rules (expire inactive agents, flag ownerless ones, block risky ones), and control over which MCP servers, tools, data and agents each agent may reach. Security: Defender threat protection, Intune blocking of local agents (preview), Purview DLP, audit and eDiscovery.
- **Buyer:** M365, Entra, Defender and Purview admins, CIO and CISO. GA 1 May 2026.
- **Pricing (public):** **US$15/user/month**, or included in M365 E7 (US$99/user/month).
- **UX seen:** `ms-agent365.png`: a Fluent gradient hero, then pill tabs (Observability | Governance | Security) driving an accordion (Registry, Agents map, Agent analytics, Role-specific oversight) next to a media panel. The product lives inside the M365 admin centre (Agents → Overview).
- **Gaps vs Elan1:** Governs inward (Microsoft estate first). Audit is attested by Microsoft. No per-action named-person approval and no offline-verifiable receipt. **Price-anchor threat.**
- **Screenshots:** `ms-agent365.png`, `ms-agent365-ui-1.png`.

### 2.14 AWS — Amazon Bedrock AgentCore
- **Product:** Runtime, **Gateway** (tools, MCP servers, Lambda and APIs exposed to agents), **Identity** (token vault for outbound OAuth and API keys, so the agent never handles secrets), **Policy** (GA March 2026: Cedar, **default-deny**, checks every Gateway tool call, natural-language authoring, automated-reasoning verification), Memory, Observability (step traces), Evaluations.
- **Buyer:** Developers and platform engineering teams on AWS.
- **Pricing (public, usage-based):** per Gateway invocation, per Policy authorization request, per 1k tokens for natural-language policy authoring. Identity is free via Runtime or Gateway.
- **UX seen:** `aws-agentcore.png`: standard AWS product page with a dark hero and a framework logo strip. The product is console- and CLI-first (`aws-agentcore-ui-1.png` is a product illustration).
- **Gaps vs Elan1:** **Architecturally the closest primitive (default-deny, per-tool-call policy, credential vault)**, but it stops at the AWS account boundary. There is no "ask a named person" outcome in Policy, decisions are CloudWatch/CloudTrail logs rather than signed portable receipts, and there is no governance layer (inventory, assessments, frameworks).
- **Screenshots:** `aws-agentcore.png`, `aws-agentcore-ui-1.png`.

### 2.15 Boomi — Agentstudio and Agent Control Tower
- **Product:** No-code agent builder (Agent Garden), **Agent Registry** (auto-catalogues Boomi, Amazon, Salesforce, Copilot and Snowflake agents), real-time observability with audit logs and token analytics, **anomaly detection plus an instant kill switch**, guardrails with pre-deployment testing, and governed MCP tools. "Agent Control Plane" in the nav.
- **Buyer:** CIO and integration leaders (75,000+ agents in production as of Feb 2026, per IM).
- **Deployment / pricing:** Cloud, hybrid or on-prem ("run agents behind firewalls"). Pricing not public.
- **UX seen:** `boomi-ui-1.png` / `boomi-ui-2.png`: a navy top bar with **Agent Garden | Agent Control Tower** tabs, an AI prompt box with suggestion chips, and a "Start designing your agent" card. The agent editor is a **stepper (Profile → Tasks → Guardrails → Attributes → Review)** with personality sliders, a radar, and a **live "Test Your Agent" chat pane**. Text is very small and dense.
- **Gaps vs Elan1:** Observes and routes. No per-action business-rule approval, nothing signed (IM §12.4).
- **Screenshots:** `boomi.png`, `boomi-ui-1.png`, `boomi-ui-2.png`.

### 2.16 Noma Security
- **Product:** AI Asset Discovery and AI-SPM (agents, MCP servers, skills, tools), AI Red Teaming, Agent Runtime Security and **AI-DR** (score each action against session, user, data and baseline; outcomes **block, steer, alert a human, mask, killswitch**), Agent Access Control (approve, review or block agents, MCP servers and skills), MCP Security, Agentic Identity. Endpoint expansion (Sep 2026) covers Claude Code and Codex via EDR/MDM.
- **Buyer:** Enterprise security teams ("10%+ of Fortune 100"). Gartner Market Shaper in AI AppSec.
- **Deployment / pricing:** "Open Enforcement", which enforces at existing control points. Pricing not public.
- **UX seen:** Mascot-led marketing with diagrams. `noma-ui-1.png` is a policy and topology diagram (Claude Desktop → toolsets → MCP servers), not real UI.
- **Gaps vs Elan1:** Security outcomes, not governance evidence. No signed receipts or framework library depth.
- **Screenshots:** `noma.png`, `noma-ui-1.png`.

### 2.17 WitnessAI
- **Product:** Observe (discovery of apps, agents and MCP servers; conversation visibility), Control (policy by department, role, intent; model routing; redaction), Protect (prompt-injection and jailbreak defence, response filtering, automated red-teaming). Network-layer enforcement.
- **Buyer:** CISOs and privacy and compliance leaders (top-10 airline, InComm).
- **Deployment / pricing:** Single-tenant with data sovereignty. Pricing not public.
- **UX seen:** `witnessai-ui-1.png` is **Discovery** with tabs (Applications, App Catalog, Agents, MCP Servers), filter dropdowns (Last 7 days, Agent Type, User, Group, MCP Server, Insights), KPI tiles with orange "27 New / 6 New" deltas, and an **"Agent Ecosystem" sankey/bubble** (Groups → agent types OpenAI 243 / Claude 125 / VS Code 94 / ChatGPT 63 → MCP servers). `witnessai-ui-2.png` is a **policy editor**: a guardrail on/off toggle, a "Purpose" free-text box with guiding questions, **"Refine All Rules" (AI-assisted)**, and readable rule cards such as "IF User Behavior is Drug Research THEN ⦸ Block the user's prompt", "… THEN ⚠ Warn", "… THEN → Route to: Groq/llama-3.1-8b-instant".
- **Gaps vs Elan1:** Prompt and intent-centric. No named-person approval, no signed records.
- **Screenshots:** `witnessai.png`, `witnessai-ui-1.png`, `witnessai-ui-2.png`.

### 2.18 Drata — AI Agent Governance (the closest competitor to watch)
- **Product:** Three layers. The **Drata Sensor** runs on managed devices. The **MCP Proxy** evaluates each agent tool call against policy inline and **stops violations before they execute**. Telemetry masks and reduces data on-device into a **"durable, tamper-evident evidence feed"**. Policies are written in plain English, compiled to rules and **simulated against up to a year of historical traffic** before enforcement. Each agent gets a trust score and drift flags. Govern **recommends actions for manual approval** or enforces autonomously. Maps to the EU AI Act, AIUC-1 and ISO 42001 through Drata's control engine.
- **Status:** Limited Availability (4 Aug 2026), **Anthropic first**; OpenAI, Vertex and Bedrock in development.
- **Buyer:** Security and GRC leaders already on Drata (8,500+ customers).
- **Pricing:** Not public.
- **UX seen:** `drata-ui-1.png` is the strongest UX idea in the field. A **split view: a conversational investigator on the left** ("show me all agents", "what was the change to marketing ops agent", answering "pulled straight from the ledger. No interpretation, just the diff", then numbered next actions [1] Remediate, [2] No, I'm good, [3] Let's chat about it). On the right is an **evidence card**: "⚠ UNAPPROVED CHANGE · MARKETING OPS AGENT", a one-sentence plain-English finding, metadata (time UTC, CI service principal, "no human approver", ledger ID `AUD-7F3C9`, a red "no approval" chip), a **system-prompt diff** (green added lines), and a **"Tools granted in the same change" table** (TOOL / SCOPE / APPROVAL with "none" chips). `drata.png` shows the dense dark "Trust Dashboard" (framework progress for SOC 2, ISO 27001 and GDPR, control monitoring, an audit timeline) and a GRC Copilot side panel.
- **Gaps vs Elan1:** "Tamper-evident" is claimed but there is no public detail on signatures, hash chaining, external timestamps or **offline verification without an account**. Approval is a recommendation, not a named-person gate with its own receipt. Anthropic-only today. No DPDP or RBI FREE-AI. **This is the vendor most likely to publish a "signed or chained decision record" (IM watch list Class D).**
- **Screenshots:** `drata.png`, `drata-ui-1.png`.

### 2.19 Vanta — AI Governance and Trust Center
- **Product:** AI Governance (early access, announced 30 Jul 2026) extends the Trust Graph to agents: inventory with context (connected systems, reachable data, vendor, controls), risk ranking, boundary definitions, detection of out-of-bounds activity, continuous proof, and governance status shown in a customer-facing **Trust Center**. ISO 42001 support since 2024. Vanta AI Agent drafts policies and questionnaire answers.
- **Buyer:** Security and compliance at fast-growing companies (US$300m ARR). Forrester GRC Wave Leader Q2 2026.
- **Pricing:** Custom quote.
- **UX seen:** `vanta-ui-1.png` is a **minimal agent card**: "PR Auto-reviewer", Platform "OpenClaw (homegrown)", Model "Llama 4", Last detected in monospace, and a **Monitoring timeline** ("● Blocked unauthorized access, JUL 8, VIEW SIGNAL →"; "● Agent detected, JUL 3"). `vanta-ui-2.png` is the agent-inventory discovery view. `vanta.png` is the Trust Center product page. This is the reference pattern for **sharing proof with outsiders**.
- **Gaps vs Elan1:** Enforcement is "help enforce" (early access). No approval gate, no signed receipts.
- **Screenshots:** `vanta.png`, `vanta-ui-1.png`, `vanta-ui-2.png`.

### 2.20 Lakera / Check Point
- **Product:** Check Point AI Guardrails (ex-Lakera Guard) screens prompts, tool responses and tool descriptions for injection, jailbreak and leakage. Also AI Red Teaming (ex-Lakera Red), Workforce AI Security (shadow AI) and AI Agent Security (MCP mentioned). Claims under 50 ms, 100+ languages and a 0.01% false-positive rate.
- **Buyer:** AppSec and security teams. Acquired by Check Point (Q4 2025).
- **Deployment / pricing:** SaaS, API-first. Free Community tier; Enterprise by quote.
- **UX seen:** Marketing with no product UI. Developer-first (API, playground).
- **Gaps vs Elan1:** Content-safety firewall. No governance or approvals, and no evidence beyond logs.
- **Screenshots:** `lakera.png`.

### 2.21 Fiddler AI
- **Product:** "AI Control Plane": agentic observability (tokens and cost by user and team), continuous evaluations, **inline guardrails** under 80 ms (PII/PHI, secrets, hallucination, toxicity, injection), governance and compliance (each enforcement decision logged with who triggered it), ML observability, Centor models running in-VPC. Inline control plane for coding agents (June 2026).
- **Buyer:** AI engineering, platform and compliance teams in regulated sectors. In the Forrester Agentic Control Plane Landscape Q2 2026.
- **Deployment / pricing (public):** SaaS, VPC or on-prem, including GovCloud. **Free** (guardrails), **Developer US$0.002/trace**, Enterprise custom.
- **UX seen:** Marketing diagrams (`fiddler-ui-1.png` is a control-plane architecture diagram). The product is known for dense observability dashboards.
- **Gaps vs Elan1:** Traces, not receipts. No human approval or framework library depth.
- **Screenshots:** `fiddler.png`, `fiddler-ui-1.png`.

---

## 3. Feature comparison matrix

Legend: **Y** = publicly claimed as shipping. **P** = partial, preview, narrow scope, or limited availability. **N** = not found. **?** = unclear from public material. All cells are vendor claims read 27 Oct 2026 and are UNVERIFIED in product. A finding by absence (N) is weaker than a finding by presence.

| Vendor | AI inventory | Risk assessment | Framework library | Runtime pre-execution enforcement | Human approval gate | MCP proxy | Signed / chained evidence | Offline verification | Anomaly detection / kill switch | Developer SDKs | Multi-tenant auditor view | Pricing transparency |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Elan1 Govern** (in code, commit 22388ad, **not in production**) | Y | Y (2nd-person sign-off) | Y (10 frameworks) | Y on MCP route (SDK/REST advisory) | Y (named person) | Y (holds credentials) | Y (signed, hash-chained receipts) | Y (offline verifier, auditor pack; no external timestamp yet) | Y (alerts + emergency stop) | Y (SDK/REST) | P (auditor pack; portal is front-end work) | TBD |
| Credo AI | Y | Y | Y (20+) | P (Agent Governor preview, Claude Code only) | P (Escalate, preview; use-case approvals Y) | N | N | N | P (Risk Center alerts) | ? | N | N |
| Trustible | Y | Y | Y | N | P (intake approvals only) | N | N | N | P (monitoring alerts) | ? | N | N |
| Holistic AI | Y | Y | Y (+NYC LL144) | P (Operative agents) | P (sign-off chains; runtime escalate) | N | N | N | P (kill switch via agents) | Y | N | N |
| Saidot | Y | Y (260+ risk library) | Y (110+ policies) | N | P (lifecycle approvals) | N | N | N | P (runtime events → tasks) | Y (REST, MCP server) | P (exportable transparency reports) | P (third-party listing) |
| OneTrust | Y | Y | Y | P (guardrails, AI Guard SDK) | P (risk-routed approvals, not per call) | P (MCP policy enforcement) | N | N | P | Y (Python, AI Guard SDK) | N | N |
| IBM watsonx.gov | Y | Y | Y | P (policy enforcement claim) | P (OpenPages workflows) | N | N | N | P (monitoring) | Y | N | P (trial; pricing page) |
| Monitaur | Y | Y | P | N | P (workflow) | N | P ("cryptographic audit logs" claim) | N | P (drift/bias) | N | N | N |
| Truyo | Y | Y | Y (+DPDP, Colorado) | N | P | N | N | N | N | N | N | N |
| ServiceNow SICT | Y | Y | Y (5 frameworks) | P (AI Gateway; Passport Q4 2026) | P (inside ServiceNow) | P (AI Gateway) | P (signed **passport**, not decisions) | N | Y (kill switch) | P | N | N (bundled) |
| Airia | Y | P (risk classification) | Y (EU AI Act, NIST, SR 11-7, HIPAA, ISO 42001, SOC 2) | **Y** (Agent Constraints) | Y (approval workflow) | **Y** | N | N | P | P | N | P (third-party listings) |
| Kong | P (MCP registry) | N | N | P (gateway policy) | N | **Y** | N | N | P (analytics) | Y | N | P |
| Zenity | Y | P (posture) | P (OWASP, MITRE ATLAS) | **Y** (Runtime Boundaries) | N | Y (MCP Security) | N | N | Y (AIDR, shut down) | ? | N | N |
| Microsoft Agent 365 | Y | P | P (Purview) | P (access policy; Defender/Intune block) | P (IT onboarding) | P (allow-list MCP servers) | N | N | Y (Defender; block risky) | Y | N | **Y** (US$15/user/mo) |
| AWS AgentCore | P | N | N | **Y** (Cedar, default-deny per tool call) | N | Y (Gateway + Identity vault) | N | N | P (observability) | Y | N | **Y** (usage-based) |
| Boomi | Y (cross-vendor registry) | N | N | P (guardrails) | N | P (governed MCP tools) | N | N | **Y** (anomaly + kill switch) | P | N | N |
| Noma | Y | P | P | Y (AI-DR block/steer) | P (alert a human; approve agents) | Y | N | N | Y (killswitch) | ? | N | N |
| WitnessAI | Y | N | P | Y (network layer) | N | P | N | N | P | N | N | N |
| **Drata** | Y | P (trust score) | Y | **Y** (MCP Proxy, LA, Anthropic only) | P (recommends approval) | **Y** | P ("tamper-evident" feed, no detail) | N | P (drift, trust score) | ? | P (auditor access in GRC) | N |
| Vanta | Y | P | Y | P (early access) | N | N | N | N | P | N | P (Trust Center, external viewers) | N |
| Lakera / Check Point | P (shadow AI) | N | N | Y (content guardrails) | N | P | N | N | P | Y (API) | N | P (free tier) |
| Fiddler | P | N | P | Y (inline guardrails) | N | P (works with MCP gateways) | N (logged decisions) | N | Y (monitoring/alerts) | Y | N | **Y** |

**Matrix highlights**
1. **Two columns are empty across all 21 competitors: offline verification, and a true multi-tenant auditor view.** For signed/chained evidence there are only partial claims: Drata's "tamper-evident" feed, ServiceNow's signed *passport* (identity and permissions, not decisions), and Monitaur's "cryptographic audit logs" wording. This is exactly the IM §12.8 "uncontested space".
2. **Pre-execution enforcement is now crowded:** Airia, Zenity, AWS AgentCore, Drata, Noma, WitnessAI, Lakera and Fiddler all claim it. Being in the tool-call path is no longer the differentiator. **What the decision produces** is.
3. **A named-person approval gate is rare and shallow.** Airia triggers approval workflows, Credo has Escalate (preview), Drata recommends manual approval, Noma alerts a human. **No competitor shows a polished approver experience.**
4. **Only three vendors span governance and runtime:** OneTrust, Holistic AI and Airia, with Drata arriving from GRC. Documentation vendors (Credo, Trustible, Saidot, IBM, Truyo, Monitaur) do not enforce. Gateways (Kong, Zenity, Noma, WitnessAI, Lakera, Fiddler) do not assess.
5. **MCP proxy with credential custody** is shipped by Airia (OAuth MCP Gateway), Kong, AWS (Gateway + Identity token vault) and Drata (MCP Proxy). Elan1 must match on reliability and connectors, not just exist.
6. **India frameworks:** Truyo alone lists DPDP. **Nobody lists RBI FREE-AI.** Colorado AI Act: Truyo only. NYC LL 144: Holistic AI only.
7. **Pricing transparency is rare:** only Microsoft, AWS and Fiddler publish real numbers (Saidot, Airia and Lakera through third parties or free tiers). Everyone else is "Book a demo".

---

## 4. UX patterns

### 4.1 What the best do well (patterns worth adopting)

1. **Conversational investigator + evidence card (Drata).** Chat on the left; on the right a structured, literal record: the finding in one sentence, a metadata strip with ledger ID, who and when, a red "no approval" chip, a code diff, and a table of tools with scope and approval status. It ends with numbered next actions. *Adopt for "explain this receipt / this refusal"*, but anchor every claim to a receipt ID that verifies.
2. **Ask-anything composer over the dashboard (Airia, ServiceNow, Drata, Boomi).** A natural-language box ("Which unsanctioned AI apps can read email?") with scope chips (persona avatars, "High risk"). *Adopt as ⌘K plus "Ask Govern"*, with answers that cite receipts.
3. **Readable IF/THEN rule cards with verb-coloured outcomes (WitnessAI).** "IF … THEN ⦸ Block / ⚠ Warn / → Route", a purpose box with guiding questions, and "Refine all rules" (AI-assist). *Adopt for the rulebook editor*, using three outcome colours: Allow (green), Ask person (amber, with the person's avatar), Refuse (red), and showing default-refuse as the last, locked rule.
4. **KPI cards that link and show deltas (Holistic AI, Airia, WitnessAI).** Number, trend arrow, "+2 this week" or "27 New", sparkline, "View all →". *Adopt*, but use governance KPIs (decisions today, refusals, pending approvals, median approval time, chain verified ✓) rather than vanity counts.
5. **Inherent vs residual risk side by side (Holistic AI).** Two donuts with the same legend make mitigation visible at a glance. *Adopt in Risk & Assessments.*
6. **Calm, editorial tables (Saidot).** Breadcrumb, serif page title, one-sentence description, tabs with count badges, "Showing 16 of 16", sortable columns, risk icon column, and **framework tags on each control row** (GDPR, EUAIA). *Adopt for Inventory and Controls*; the typographic restraint reads "premium".
7. **Signed-artefact card (ServiceNow AI Passport).** A "Signature valid" chip, signed-by authority, issued and expires dates, Download and Revoke buttons. *Adopt and go further*: every receipt, rulebook version and auditor pack gets a verification chip, a hash, and a one-click "Verify offline" download.
8. **Question-titled charts and actionable banners (OneTrust).** "What is the risk of my AI projects?", "Are my projects on track?", and a top banner "New data linked — review for new risks". *Adopt*: chart titles as questions, and banners that carry one CTA.
9. **Ecosystem flow visual (WitnessAI sankey; Agent 365 Agent Map; Holistic Agent Graph; Drata Agent Network).** Teams → agents → MCP servers and tools. *Adopt as "Who can do what"*: people → agents → tools → systems, with edges coloured by rule outcome and receipt volume.
10. **Configurable dashboard shell (Kong Konnect).** ⌘K search, "+ New tile", a global time-range picker, refresh, an org/tenant switcher and a region switcher in the left rail. *Adopt the shell* (tenant switcher is essential for the auditor and multi-tenant view).

Also worth borrowing: Vanta's **minimal agent card** with a monitoring timeline and monospace timestamps ("Blocked unauthorized access · VIEW SIGNAL →"); Boomi's **stepper with a live test pane** (Profile → Tasks → Guardrails → Review + "Test your agent"), useful as a "dry-run this tool call against the rulebook" console; Drata's **policy simulation against historical traffic**, as a UX for "what would this rule have refused last month"; Credo's **posture presets** (permissive / balanced / strict) as rulebook starting points; and Credo's **trust radar** for an executive summary.

### 4.2 What is weak or cluttered

- **No real product shown.** Zenity, Noma, Lakera, Fiddler, Monitaur and Trustible publish illustrations, mascots or diagrams instead of UI. Buyers cannot judge the product. Opportunity: a live, interactive, sample-data demo of Elan1.
- **Vanity metrics.** "Platform Growth", token counts, "AI Calls 24h", generic status-code donuts (Kong). None answer "are we in control, and can we prove it?"
- **Classic GRC heaviness.** IBM's red-to-green heat-maps, OneTrust's long project lists, Drata's dense dark Trust Dashboard with tiny 8–9 px labels. Boomi's editor text is also unreadably small.
- **Evidence shown as logs, never as proof.** Every vendor shows activity feeds and audit trails, but none shows *verification* (signature status, chain continuity, external timestamp) in the UI.
- **Approval UX is invisible.** No competitor shows an approver inbox, mobile approval, delegation, expiry or SLA timers, even where approval workflows exist.
- **Chrome noise.** Chat-bot avatars (Drata "Jamie AI", Kong "Karl"), cookie walls and marquee banners crowd marketing pages. In-product, several shells mix three navigation systems (top tabs, left rail, in-page tabs).
- **Colour used decoratively.** Risk is encoded in four or five shades without text labels (IBM heat-map, OneTrust greens), which is weak for accessibility.

---

## 5. Whitespace: where Elan1 Govern can be clearly better

1. **Proof you can check, not logs you must trust.** Make verification a visible, first-class object: a chain-status bar ("12,481 receipts · chain intact · last verified 2 min ago"), a "Verify" chip on every receipt, rulebook version and approval, a one-click **auditor pack** download, and an in-browser verifier that also runs offline. Nobody ships this. Drata (tamper-evident claim) and ServiceNow (signed passport) are the nearest, and neither signs the decision.
2. **Approval that people enjoy.** Build the field's first real approver inbox: a context card (agent, tool, arguments diff, rule that asked, risk, data touched), approve or refuse with a reason, delegation, expiry countdown, mobile and Slack/Teams parity, and the **approval itself becomes a receipt**. Competitors at best "trigger a workflow".
3. **Refusals as evidence.** Default-refuse is a governance feature, not just a security event. Show refusal analytics (by rule, default-refuse, unknown tool, expiry) and let auditors sample them. No competitor records refusals as evidence (IM matrix column).
4. **A signed, versioned rulebook with diff and simulation.** Plain-English → rule (like WitnessAI and Drata), then rule diff between versions, signature and hash, a "replay last 30 days of receipts against this draft" simulation (Drata does this pre-GA; AWS has automated reasoning), and a dry-run console.
5. **One data model from inventory to receipt.** Inventory → assessment → framework control → rule → receipts, with **coverage computed from receipts, not questionnaires**. Documentation vendors can't show runtime truth; gateways can't show assessments. Only OneTrust, Holistic and Airia straddle both, and none links them in the UI.
6. **An external auditor workspace across tenants.** A read-only, multi-tenant auditor portal: pick tenant and period, sample receipts, verify chains, export a working-papers pack. Vanta's Trust Center and Drata's auditor access are the closest analogues, and neither verifies runtime decisions.
7. **India and multi-jurisdiction frameworks.** DPDP and **RBI FREE-AI** (absent everywhere), Colorado AI Act and NYC LL 144 alongside the EU AI Act, NIST, ISO 42001, GDPR, HIPAA and SOC 2, with a crosswalk view showing one control satisfying several frameworks (Saidot-style tags).
8. **Credential custody made visible.** Show which tool credentials Govern holds, which agents may use them, and the guarantee "the agent never sees the secret". AWS (token vault) and Airia (OAuth MCP gateway) do this but don't surface it as a governance artefact.
9. **An emergency stop that is itself governed.** Kill switches exist at ServiceNow, Boomi, Noma, Zenity and Holistic, but the stop is not evidenced. Offer a scoped stop (agent / tool / tenant / all) with a blast-radius preview, a two-person confirm, a signed receipt, and a guided restore.
10. **Vendor-neutral and portable.** Platforms govern inward (Microsoft, AWS, ServiceNow, Salesforce). Elan1 proxies MCP across estates. Make "cross-platform" tangible with one agent map spanning Copilot, Bedrock, Claude and custom agents.
11. **Show the real product and price it openly.** An interactive demo tenant on the website and transparent per-governed-action pricing, against a field of "Book a demo" CTAs.

---

## 6. Must-match table stakes

These are the features every serious buyer will expect in the first demo:

- **Inventory:** agents, models, apps, MCP servers and tools; owner, platform, lifecycle, risk tier; shadow-AI discovery; import from Bedrock, Foundry/Azure, Vertex, Copilot Studio, Agentforce, Databricks.
- **Assessments:** EU AI Act risk classification, impact assessments with templates, sign-off and approval chains, re-assessment on material change, inherent vs residual risk.
- **Framework library:** at least the EU AI Act, NIST AI RMF and ISO 42001, with control mapping, cross-framework reuse and a gap view.
- **Runtime policy:** allow / block / escalate on tool calls, parameter-level conditions, identity and data-classification context, MCP server allow-listing.
- **Kill switch / disable agent** and anomaly alerts (Slack, Teams, Jira, email, webhook).
- **Dashboards:** KPI tiles with deltas, risk distribution, live activity feed, global time-range filter, saved views.
- **Audit trail:** search, filter, export (CSV/PDF), board and auditor reports.
- **Agent graph / map** of agents ↔ tools ↔ data.
- **Natural-language assistant and ⌘K search** (now standard: Airia, ServiceNow, Drata, Boomi, Kong).
- **Policy testing before enforcement** (simulation or dry run).
- **Enterprise basics:** SSO/SAML, SCIM, RBAC, tenant isolation, API and SDKs, SOC 2 Type II / ISO 27001 for the vendor itself, data residency or VPC/on-prem options (Fiddler, Boomi, WitnessAI offer them).
- **Integrations:** Okta/Entra, ServiceNow, Jira, Slack/Teams, SIEM export.

---

## 7. Sources (read 27 October 2026)

Vendor pages: credo.ai/product, credo.ai/agent-governor · trustible.ai · holisticai.com/ai-governance-platform · saidot.ai · onetrust.com/solutions/ai-governance · ibm.com/products/watsonx-governance · monitaur.ai · truyo.com · servicenow.com/products/ai-control-tower.html · airia.com · konghq.com/products/kong-ai-gateway · zenity.io/platform · microsoft.com/en-us/microsoft-agent-365 · aws.amazon.com/bedrock/agentcore · boomi.com/platform/agentstudio · noma.security · witness.ai · drata.com, drata.com/products/agent-governance · vanta.com/products/trust-center, vanta.com/resources/introducing-ai-governance-from-vanta · lakera.ai · fiddler.ai.

Press and third-party: Drata releases of 10 Jun and 4 Aug 2026 (drata.com/about/news) · ServiceNow newsroom, 5 May 2026; CIO.com / Help Net Security / Futurum on AI Passport (Oct 2026) · Airia Agent Constraints launch (BusinessWire, Sep 2025) and airia.com/ai-platform/agent-constraints · Help Net Security on Zenity Runtime Boundaries (27 Jul 2026) · Noma endpoint expansion (PR Newswire, 28 Sep 2026) · AWS AgentCore pricing page and Cedar policy guides · Capterra/GetApp (Saidot, Airia pricing; unverified) · Giskard and costbench (Lakera/Check Point) · Collab365 and Redmond Mag (Agent 365) · Holistic AI Gartner MQ page (MQ positions as plotted there).

Internal: Elan1 Govern Information Memorandum §12.1–12.11 and R12.
