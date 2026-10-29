# 05 · Enterprise UX benchmark for the Elan1 Govern console

Status: research analysis, input to design and build
Date: 27 October 2026
Scope: the React console (Today, Approvals, Activity, Agents, Rulebooks, Connectors, Evidence, AI inventory, Assessments, Compliance, Alerts and emergency stop, Settings, Developer portal), the public receipt verifier, pricing and billing.

---

## 0. How to read this document

1. **Section 1** sets out the principles we take from the benchmark.
2. **Section 2** turns the brand palette into product colour roles, with measured contrast. Read it before anything visual. Some brand colours fail WCAG 2.2 AA as text, so the product needs a small set of derived tokens.
3. **Section 3** has notes on 14 leaders: what they do, why it works, and how we adapt it inside our brand.
4. **Section 4** is the consolidated pattern library for our console (13 patterns).
5. **Section 5** is the recommended design-token set.
6. **Section 6** is the accessibility checklist (WCAG 2.2 AA).
7. **Section 7** is the recommended React stack, with versions and reasons.
8. **Section 8** maps patterns to surfaces. **Section 9** lists open decisions. **Section 10** lists sources.

**Evidence note.** The Firecrawl account ran out of credits on the first call, so research used web search instead. Where a public document confirms a claim (Cloudflare builder/editor, Temporal timeline, WorkOS Admin Portal, Vanta cross-mapping, WCAG 2.2 criteria, Linear command menu, Stripe sandboxes, library versions), the source is listed in section 10. Other pattern descriptions come from hands-on knowledge of these products and should be checked against the live product before anyone quotes them externally. Library versions were the latest found in mid-2026 sources. Confirm each with `npm view <pkg> version` on the day of scaffolding.

---

## 1. Principles drawn from the benchmark

These are the 8 ideas that separate the best consoles from the rest, restated for a governance product.

1. **The decision is the unit of work.** Linear makes the issue the atom and Ramp makes the transaction the atom. For us it is the *decision*: an agent action that was allowed, held for approval, or refused. Every surface should answer the same three questions about a decision: what happened, under which rule, and who answered for it.
2. **Speed is a feature you can feel.** Linear and Vercel set the bar: optimistic updates, no full-page spinners, and keyboard paths for every frequent action. Our approver queue should clear in seconds, not minutes.
3. **Show the proof next to the claim.** Stripe shows the raw request beside every object, and GitHub shows the diff beside every approval. We show the signed receipt, hash link and rule version beside every decision, one click away and never hidden in an export.
4. **Safe by default, fast when you mean it.** GitHub's branch protection, Stripe's test mode and incident.io's guided declare flow all make the dangerous path deliberate without making the common path slow. Approving a routine action takes 1 keystroke and a confirmation. Emergency stop takes a typed word.
5. **Preview the consequence before you commit.** Cloudflare previews rules and GitHub rulesets have an evaluate mode. Our rulebooks are simulated against past actions before anyone signs and publishes them.
6. **One source of truth, many front doors.** Ramp and PagerDuty let people act from Slack, email or mobile, and every channel writes to the same record. Approvals arrive by web, email, Slack and WhatsApp, and they all produce one receipt with the channel recorded.
7. **Density with calm.** Datadog and Linear show a lot of data without noise because they use restraint: one accent, neutral surfaces, colour only for state. Our brand rules (one Clay accent per surface, functional colours only for status) already enforce this.
8. **Plain words, specific numbers.** "37 actions allowed last week would now be held" beats "Policy impact detected". This follows the brand voice: plain, specific, answerable.

---

## 2. Brand-to-product colour roles (measured)

### 2.1 Contrast of brand colours (WCAG 2.x relative luminance)

| Foreground | on Paper #FBFAF7 | on Bone #F2EDE6 | on Ink #0A1320 | on Slate #1E3048 |
|---|---|---|---|---|
| Ink #0A1320 | **17.85** | **16.00** | – | 1.39 |
| Slate #1E3048 | **12.80** | **11.47** | 1.39 | – |
| Graphite #4A5561 | **7.28** | **6.53** | 2.45 | 1.76 |
| Kiln #8A4229 | **6.96** | **6.24** | 2.57 | 1.84 |
| Clay #B9603F | 4.18 | 3.75 | 4.27 | 3.06 |
| Ember #DF8C64 | 2.49 | 2.23 | **7.16** | **5.14** |
| Verdigris #2E7D6B | **4.72** | 4.23* | 3.78 | 2.71 |
| Amber #C99A2E | 2.47 | 2.21 | **7.23** | **5.18** |
| Crimson #9B2C3B | **7.14** | **6.40** | 2.50 | 1.79 |
| Cobalt #2F6FB3 | **4.97** | 4.46* | 3.59 | 2.57 |

Bold = at least 4.5:1 (passes AA for body text). *Verdigris on Bone is 4.23 and Cobalt on Bone is 4.46, both just under 4.5.

### 2.2 What this means

- **Clay cannot carry small text.** At 4.18:1 on Paper it passes for large text (24px, or 18.66px bold) and for non-text marks (3:1), but not for body text, links or button labels. Use **Kiln** (6.96:1) when the accent family has to carry text, such as a link or a selected tab label. Use Clay for marks: the active navigation rule, the single primary focal element on a surface, the brand disc, and chart highlights.
- **Clay-filled buttons with Paper text fail AA** (4.18:1) at UI sizes. Recommendation: primary buttons are **Ink fill with Paper text** (17.85:1). The Clay accent is kept for the single most important mark on the surface. If brand insists on a clay-family button, use **Kiln fill + Paper text** (6.96:1).
- **Amber and Ember fail on light grounds** (2.47 and 2.49), even for non-text marks (3:1). On Paper and Bone, the Amber status is shown as an Amber icon/bar **plus an Ink label**, with a derived **Amber-text #7D5F17** (5.71:1 on Paper, 5.12 on Bone) when the word itself is coloured. Ember is used only on dark grounds (7.16:1 on Ink).
- **Dark mode needs lighter functional tints.** On Ink, Verdigris (3.78), Cobalt (3.59) and Crimson (2.50) fail for text. Proposed dark-mode text variants: Verdigris-light **#6CC3AE** (8.92), Cobalt-light **#8DB8EA** (9.03), Crimson-light **#E8909E** (7.91), Amber stays **#C99A2E** (7.23), Clay-light **#D98A6B** for accent text (6.92). Graphite as secondary text on Ink becomes **#A7B0BC** (8.50).
- **Input borders must reach 3:1** (WCAG 1.4.11). A Bone-family hairline such as #D9D2C7 is only 1.44:1, which is fine for decorative dividers but not for input or checkbox boundaries. Use **#8F877B** (3.40:1 on Paper) for control borders. On Ink use **#5A6A80** (3.38:1).

**Derived tokens need sign-off from brand.** They are tints and shades of the approved palette, added only to meet AA. They do not add new hues. See open decision D1.

### 2.3 Colour roles

| Role | Light | Dark | Rule |
|---|---|---|---|
| Ground | Paper | Ink | Page background. |
| Raised surface | #FFFFFF or Paper | Slate | Cards, drawers, popovers. |
| Sunken / zebra / selected row | Bone | #142238 (Ink→Slate midpoint) | Never used to mean status. |
| Text primary | Ink | Paper | |
| Text secondary | Graphite | #A7B0BC | |
| Accent (one per surface) | Clay for marks, Kiln for text | Clay-light #D98A6B | Never status. Never more than one focal use per surface. |
| Action primary | Ink fill / Paper text | Paper fill / Ink text | Actions are neutral. Outcomes are coloured. |
| Approved / healthy | Verdigris + check icon + label | #6CC3AE + icon + label | |
| Awaiting / held | Amber icon/bar + Ink label (text #7D5F17) | Amber + icon + label | |
| Refused / failed | Crimson + icon + label | #E8909E + icon + label | |
| Info / in progress | Cobalt + icon + label | #8DB8EA + icon + label | |
| Focus ring | Ink 2px + 2px Paper offset | Paper 2px + 2px Ink offset | Does not spend the accent. |

**"Actions are neutral, outcomes are coloured."** The Approve button is not green and the Refuse button is not red. Colour appears on the *result* (the receipt chip after the decision). This keeps functional colours honest (they always describe state) and stops a user from approving by colour association. GitHub, Stripe and Linear all take this approach in practice: their primary buttons stay neutral.

---

## 3. Per-leader pattern notes

Each entry gives: **What** (the pattern), **Why it works**, **Adapt** (how we use it within our brand) and **Lands on** (our surfaces).

### 3.1 Linear: speed, command menu, keyboard-first, inbox

**What**
- A command menu on Cmd/Ctrl+K that can run any action or jump to any page by name. Linear's own guide calls it the one shortcut to learn first.
- Two-key "go to" sequences (G then I for Inbox) and a full shortcut sheet on `?`.
- An inbox that treats notifications as a triage queue: J/K to move, one key to act, snooze, mark read, and the next item loads instantly.
- Optimistic UI: changes show at once and sync in the background. Lists never jump while you work on them.
- A restrained look: neutral surfaces, one accent, small type, crisp 1px lines.

**Why it works.** Frequent users never wait and never reach for the mouse. Discovery and speed live in the same place: the menu teaches the shortcut by showing it beside each command.

**Adapt**
- **Approvals inbox** follows Linear's inbox model. It has a list on the left and the approval card on the right. J/K moves, `A` opens the approve sheet with the reason field focused, `R` opens refuse, and `Cmd/Ctrl+Enter` commits. After a decision, focus moves to the next item.
- **Command palette** (pattern 4.2) indexes navigation, actions ("Pause agent invoice-bot"), objects (agents, rulebooks, receipts by ID or hash prefix) and help.
- The shortcut hint appears beside each palette item. All single-character shortcuts can be switched off in Settings (WCAG 2.1.4).
- Optimistic decisions with a 5-second undo toast before the receipt is signed. The toast says "Approved. Receipt signs in 5 s. Undo". Once signed, a decision cannot be undone, only superseded by a new decision. The copy must say so.

**Lands on:** shell, Approvals, Activity, Agents, Rulebooks.

### 3.2 Stripe Dashboard: developer + finance UX

**What**
- **Test mode / sandboxes.** A persistent visual band shows you are not in live mode. Stripe sandboxes copy live settings when created and run apart from the live integration, and sandbox access is controlled by role.
- **Every object has a timeline and the raw data.** A payment page shows events, the API requests that touched it, and the JSON.
- **Developer surfaces in the product:** API keys (publishable/secret, reveal once, roll with expiry for the old key), webhooks/event destinations with delivery attempts, a "resend" button and signing secrets, and request logs filterable by status, endpoint and key.
- **Finance-grade tables:** tabular figures, right-aligned amounts, currency explicit, export to CSV, saved filters.
- Docs with your own keys pre-filled, and copy buttons on every snippet.

**Why it works.** Developers and finance people trust what they can inspect. Test mode makes experiments safe, and the raw view ends arguments.

**Adapt**
- **Environment switcher: Sandbox / Production.** In Sandbox, a full-width band sits under the top bar: Bone ground, Ink text, 1px dashed Ink bottom rule, with the words "Sandbox. Decisions here are signed with sandbox keys and are not evidence." No colour-only signal and no Amber (Amber means "held").
- **Every decision page** has tabs for Summary, Receipt (signed JSON), Chain (previous and next hash), Rule (the exact rule version that matched) and Raw request (the agent's tool call, redacted per policy).
- **API keys and agent keys:** show once, copy, name and scope. Rolling a key schedules the old key's expiry ("Old key stops working in 24 hours") with a live countdown. Last-used time and IP are shown.
- **Webhooks:** delivery log with attempt number, response code, latency and payload. Includes "Resend", "Send test event" and signing secret rotation.
- **Developer portal:** quickstart snippets pre-filled with the user's sandbox key and org ID, with a copy button and a "Run in sandbox" check that turns into a live receipt ("Your first decision arrived. View receipt").

**Lands on:** shell (environment), Activity, Agents (keys), Settings (webhooks, signing keys), Developer portal, Billing.

### 3.3 Vercel: deployments, status, instant feedback

**What**
- A deployment list where each row has a status, commit, author, branch and duration, with streaming build logs.
- Preview vs production promotion with a clear "Promote to production" step and instant rollback ("Instant rollback" to a previous deployment).
- A minimal top bar with team switcher → project → environment breadcrumbs.

**Why it works.** Each change is a versioned object, and rollback is one click because every version is kept.

**Adapt**
- **Rulebook versions behave like deployments.** Each published version is immutable, signed and listed with author, signer, time and simulation result. "Roll back to v14" creates v16 with v14's content. Nothing is rewritten, so the chain stays intact.
- Org switcher → workspace → environment breadcrumb in the top bar (pattern 4.1).

**Lands on:** Rulebooks, shell.

### 3.4 Datadog and Grafana: observability, timelines, anomalies

**What**
- One global time picker that drives every widget, with relative ranges ("Past 15 minutes") and absolute ranges, and the range kept in the URL.
- Brushing on a chart zooms the whole dashboard. Clicking a spike filters the log list below.
- Event overlays on time series (deploys shown as vertical markers).
- Anomaly and outlier flags with an explanation of the expected band.
- Facets down the side of the log view with counts per value.
- Live tail with a pause button.

**Why it works.** You move from "something changed" to "this record" in 2 clicks, and time is the shared axis.

**Adapt**
- **Today and Activity share one time range** in the URL (`?from=-24h`). Decisions per hour are shown as a stacked bar (allowed / held / refused, each with a label in the legend and tooltip). Brushing filters the receipt log.
- **Rulebook publishes and emergency stops show as vertical markers** on every time series, labelled ("Rulebook finance v15 published 14:02").
- **Faceted search** in Activity: decision, agent, connector, rule, approver, channel and framework control, each with counts.
- **Live tail** of receipts with Pause. New rows appear at the top. When the user has scrolled, a "12 new decisions" pill appears instead of shifting the list.
- **Anomaly alerts** are worded plainly: "invoice-bot asked for approval 41 times in the last hour. Its usual rate is 3 to 6."

**Lands on:** Today, Activity, Alerts, Agents.

### 3.5 Okta and WorkOS: identity admin, SSO wizards, audit logs

**What**
- The **WorkOS Admin Portal** gives a customer's IT contact a guided flow to verify domains (DNS TXT), configure SSO and directory sync with their identity provider, and test the connection. It can be sent as a link or embedded.
- Okta's admin has per-application assignment, a directory of users and groups, and a **System Log** with structured events, filters and an event detail pane.
- Step-by-step setup with provider-specific screenshots and copy fields ("Paste this ACS URL into Okta").

**Why it works.** SSO setup is done by someone outside the buying team. A guided, provider-specific wizard with a "Test connection" step removes most support tickets.

**Adapt**
- **Settings → SSO** is a 5-step wizard: choose provider (Okta, Entra ID, Google, other SAML/OIDC) → verify domain (TXT record, with "Check now" and auto-retry) → exchange metadata (copy fields with labelled values) → map roles (IdP groups → Owner, Admin, Approver, Auditor, Developer, Viewer) → test sign-in. "Send setup link to your IT contact" creates an expiring link that is restricted to this wizard.
- **Members and roles** show a permission matrix, and approval roles are named per rulebook ("Approver for finance rulebook").
- **Our own admin audit log is a separate stream from agent receipts**, but uses the same receipt anatomy and the same chain. Admin changes (role granted, rule published, key rolled) are signed too. This is a differentiator: Okta's log is searchable, while ours is searchable *and* verifiable.

**Lands on:** Settings, Activity (admin stream), Evidence.

### 3.6 Vanta and Drata: frameworks, controls, evidence, trust centre

**What**
- A **framework → control → test → evidence** hierarchy. Vanta maps each test, document and policy to every framework it is relevant to, so overlapping evidence is shared across SOC 2, ISO 27001, HIPAA and others.
- Automated tests that run continuously, each with pass/fail, owner, due date and a remediation guide.
- A completion percentage per framework, split into "passing", "needs attention" and "not started".
- An auditor view and a **Trust Center**: a public or private page showing posture and documents.

**Why it works.** It turns an abstract standard into a checklist of owned, testable items, and evidence collected once counts many times.

**Adapt**
- **Compliance** uses the same hierarchy with our 10 frameworks. The core view is a **coverage matrix** (pattern 4.9): controls as rows, frameworks as columns, and cells that show the state with an icon and a short word. Cross-mapping is explicit: "This receipt chain satisfies 7 controls across 4 frameworks."
- **Evidence is live, not uploaded.** Our evidence is signed checkpoints and receipts, so freshness is a fact ("Last checkpoint 4 minutes ago, 12,408 receipts, chain verified").
- **Auditor pack export** is the trust-centre equivalent. The output is a signed bundle with an offline verifier. The public receipt verifier page is our trust-centre moment: anyone can paste a receipt and check it without an account.
- Avoid Vanta's single "percent compliant" hero number. It invites false comfort. Show "41 of 52 controls have current evidence. 3 need an owner. 8 not started" instead.

**Lands on:** Compliance, Evidence, Assessments, public verifier.

### 3.7 GitHub: diffs, review, branch protection, audit log

**What**
- **Pull request review:** Files changed tab with split/unified diff, per-line comments, "Approve / Request changes / Comment" with a required summary, and required reviewers via CODEOWNERS.
- **Branch protection and rulesets:** required approvals, required checks, signed commits, a bypass list, and an **evaluate mode** that reports what a ruleset would have blocked before it is enforced. Rule insights show pass, bypass and fail per event.
- **Audit log** with a query syntax (`action:repo.create actor:octocat`) and export/streaming.
- Commit signature badges ("Verified") with a popover explaining the key and signer.

**Why it works.** Change is reviewed as a diff, approval is named and recorded, and enforcement can be trialled before it bites.

**Adapt**
- **Rulebook publishing is a pull-request flow:** draft → diff → simulation (pattern 4.6) → review by a named second person → sign and publish. Per-rule comment threads anchor to YAML lines or builder rows.
- **Rule modes:** `enforce`, `simulate` (log what would have happened, like GitHub's evaluate mode), `off`. A rule in simulate mode produces "would have held" annotations in Activity without holding anything.
- **Separation of duties:** the author of a rulebook change cannot be its only approver. Assessments use the same two-person sign-off.
- **"Verified" badge** on receipts with a popover: signer key ID, algorithm, signed at, checkpoint inclusion. It uses a check icon, the word "Verified" and Verdigris (pattern 4.8).
- **Activity search syntax:** `decision:refused agent:invoice-bot rule:fin-007 after:2026-10-01`, with autocomplete and a visual chip builder for those who do not type queries.

**Lands on:** Rulebooks, Assessments, Activity, Evidence.

### 3.8 Ramp and Brex: approval policies, chains, mobile approvals

**What**
- Policies that route a request by amount, department, vendor or category to a chain of named approvers (manager, then finance above a threshold).
- The approver sees everything needed to decide on one screen: what, how much, who, why, policy result and receipts. Approve/decline needs one tap. The mobile app and email/Slack notifications act on the same request.
- Escalation when an approver is out of office, and delegation.
- **Policy suggestions from behaviour** ("You approve every SaaS renewal under £500. Auto-approve them?").

Note: our search found Ramp's official documentation only for multi-step approvals in its Ironclad integration. The rest comes from product familiarity and third-party write-ups. Confirm on the live product before quoting.

**Why it works.** Approval is fast because the context is complete and the approver is the right person. Routine approvals turn into policy over time, so human attention goes to the unusual.

**Adapt**
- **Approval card anatomy** (pattern 4.3) carries everything needed to decide in one view, including history: "You approved 14 similar actions in 30 days. None were later reversed."
- **Approval chains** in the rulebook: `approvers: [role: finance-lead, then: cfo if amount > 10000]`, with quorum ("any 1 of 3") and named fallbacks on expiry.
- **Delegation and out-of-office:** "While Priya is away, Tom approves for finance rulebook until 3 November."
- **Suggest a rule from repeated approvals.** This is a 10x moment: "You approved 23 'send-invoice' actions under £2,000 to existing customers this month. Draft a rule that allows them?" It opens a prefilled draft that still goes through simulation and review. The machine proposes and a person signs, in line with the brand voice ("The agent drafts it. You commit it.").
- **Mobile approvals** (pattern 4.3, mobile variant): from email, Slack or WhatsApp, a signed single-use deep link opens a mobile approval page with a passkey step-up.

**Lands on:** Approvals, Rulebooks, Settings (notifications, delegation).

### 3.9 Snyk and Wiz: risk graphs and triage

**What**
- Wiz's security graph links resources, identities, vulnerabilities and data. An "issue" is a **toxic combination**: several risk factors that are harmless alone but critical together. Each issue shows the path as a small graph and a ranked list of fixes.
- Snyk ranks findings with a priority score, groups them by project and fix, and offers "fix PR" actions. Ignore and snooze both require a reason and an expiry.

**Why it works.** Raw findings are too many. Combining factors into one ranked issue with a visible path tells you what to fix first and why.

**Adapt**
- **AI inventory and Assessments** show the risk path for an agent as a compact left-to-right graph: Agent → key scope → connector/MCP server → data class → external effect. Example: "support-bot can read customer PII through the Zendesk connector and send email externally. No rule holds outbound email with attachments."
- **Risk issues are ranked and explained in one sentence each**, with one suggested rule per issue ("Add rule: hold `email.send` when attachment present"), which opens in the rule builder.
- **Accept risk** requires a reason, an owner and an expiry date, and the acceptance itself is a signed receipt.
- Keep the graph small (at most 6 nodes in view, as horizontal lanes rather than force layout) and give a table equivalent for screen readers.

**Lands on:** AI inventory, Assessments, Agents, Connectors.

### 3.10 Retool workflows and Temporal UI: execution history

**What**
- The Temporal Web UI history has three views. **Timeline** shows events in order with a summary, **All** shows every event and **Compact** groups activities, signals and timers. Clicking an event shows full detail. On the timeline, related events become one bar that spans the activity's duration, colour shows the outcome, and hovering gives exact start, end and duration.
- Retool's workflow run log shows each block's input, output and duration, with re-run from a step.

**Why it works.** You see the shape of a run at a glance and the exact payload on demand. Grouping cuts noise without hiding anything.

**Adapt**
- **Decision detail timeline** (pattern 4.4) shows: agent requested → rule matched → held → notified (Slack, email) → viewed by approver → approved → receipt signed → included in checkpoint. Each step has its timestamp and duration. "Held for 3 min 12 s" is a span with a label.
- **Compact/All toggle** on the receipt log: Compact groups an agent session's decisions under one row with counts. All shows every receipt.

**Lands on:** Activity, Approvals (detail), Evidence.

### 3.11 Cloudflare: rules builder ↔ expression editor

**What**
- Rules can be written in a **visual builder** (field, operator, value rows joined by And/Or) or an **expression editor** (typed rules language). The editor supports the full language, including nested groups and functions. The builder supports a subset.
- You can switch between the two. If the expression uses features the builder cannot show, Cloudflare warns you and lets you discard the editor changes or stay in the editor.

**Why it works.** Beginners and experts work on the same rule, and the text form is the single source of truth.

**Adapt**
- **Rule builder ↔ YAML** (pattern 4.7). YAML is canonical. The builder is a projection of it. Switching preserves comments and key order (use a YAML library that keeps the document model, see section 7). When YAML uses constructs the builder cannot show, the builder shows those rules read-only with the label "Edited in YAML" instead of blocking the switch. This improves on Cloudflare's all-or-nothing warning.
- Live validation in both modes, with the same error list ("Line 14: `approvers` needs at least 1 entry").
- A **"Test this rule"** panel: paste or pick a past action and see allow / ask / refuse with the matching clause highlighted.

**Lands on:** Rulebooks.

### 3.12 PagerDuty and incident.io: incidents and kill switch

**What**
- incident.io lets you declare an incident from any Slack message with a shortcut or slash command. Responders join by role, a channel opens, and status pages update. PagerDuty's Slack app covers acknowledge, escalate and resolve with buttons.
- Severity is chosen at declaration with a description of each level. A timeline is built automatically, and a post-incident review follows.
- A "maintenance mode" or global pause with a persistent banner.

**Why it works.** In a crisis, the tool asks only what it needs, shows who is doing what, and records everything for afterwards.

**Adapt**
- **Emergency stop** (pattern 4.10): scope, preview of effect, typed `STOP`, a reason, and optional second person. Then a persistent banner on every surface and every channel, and a guided resume.
- **Alerts** have severity defined in words ("High: an agent took an action no rule covers"), acknowledge/assign, and auto-built timelines.
- Slack command `/govern stop <agent>` opens a confirmation modal in Slack that still requires typing STOP. A stop from WhatsApp is not offered (no typed-confirmation control we can trust there). WhatsApp gets a link to the web stop page instead.

**Lands on:** Alerts, emergency stop, shell banner.

### 3.13 Notion and Figma: collaboration and comments

**What**
- Comments anchored to a specific block or canvas point, with threads, @mentions, resolve, and a sidebar of open threads.
- Presence: avatars of who is viewing, with live cursors in Figma.
- Page history with named versions and restore.

**Why it works.** Discussion sits on the thing being discussed and is not lost in chat.

**Adapt**
- **Anchored comments** on rulebook drafts (per rule or YAML line), assessments (per question) and approval cards ("@Priya is this vendor known?"). Comments are part of the record, and resolving one is logged.
- **Presence on approval cards:** "Tom is viewing" stops 2 approvers from deciding the same item at once. If someone else decides first, the card locks with "Approved by Tom at 14:03. Your view was out of date."
- No live cursors. They add noise in a governance tool.

**Lands on:** Rulebooks, Assessments, Approvals.

### 3.14 Apple-level polish

**What**
- Consistent motion that explains change of state (a sheet comes from the button that opened it), crisp type rendering, and respect for reduce-motion settings.
- Restraint: few typefaces and weights, generous but disciplined spacing, and nothing decorative that does not inform.
- Haptics and confirmation on irreversible actions on mobile. Passkeys instead of passwords.

**Adapt**
- A motion vocabulary of 4 durations (section 5.7). Every animation has a job (spatial origin, state change, attention) and turns off under `prefers-reduced-motion`.
- **Square geometry done carefully.** Without rounded corners, precision carries the polish: pixel-aligned 1px rules, consistent 4px grid, optical alignment of icons to cap height, and no blurry half-pixel borders.
- **Passkey (WebAuthn) step-up** for approvals of high-risk actions and for emergency stop. It also meets WCAG 3.3.8 (no cognitive test to authenticate).

---

## 4. Consolidated pattern library

Each pattern has: purpose, anatomy, behaviour, keyboard, states, copy, and brand notes.

### 4.1 Navigation shell

**Purpose:** get anywhere in 2 actions, and always know which organisation and environment you are in.

**Anatomy (1440 × 900 reference)**
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ [Org ▾ Acme Ltd] / [Workspace ▾ Finance] / [Production ▾]  ⌘K Search…  ? 🔔 ● │ top bar 48px
├────────────┬─────────────────────────────────────────────────────────────────┤
│ TODAY      │  Page title (Schibsted 24/600)              [Secondary] [Primary]│
│ APPROVALS 4│  Filters / tabs                                                 │
│ ACTIVITY   │                                                                 │
│ ── GOVERN  │  Content                                                        │
│ Agents     │                                                                 │
│ Rulebooks  │                                                                 │
│ Connectors │                                                                 │
│ AI invent. │                                                                 │
│ ── PROVE   │                                                                 │
│ Evidence   │                                                                 │
│ Assessments│                                                                 │
│ Compliance │                                                                 │
│ ── RESPOND │                                                                 │
│ Alerts   2 │                                                                 │
│ ────────── │                                                                 │
│ Developers │                                                                 │
│ Settings   │                                                                 │
│ [■ STOP]   │ sidebar 240px (56px collapsed)                                  │
└────────────┴─────────────────────────────────────────────────────────────────┘
```
- **Sidebar groups** use uppercase letterspaced labels: Govern (Agents, Rulebooks, Connectors, AI inventory), Prove (Evidence, Assessments, Compliance), Respond (Alerts). Today, Approvals and Activity sit at the top because they are the daily loop.
- **Active item:** 2px Clay rule on the left edge + Ink text 600 + Bone background. This is the surface's one accent use in the shell. Page content should not add a second Clay focal element in the same viewport (D3).
- **Counts:** Approvals shows pending count as a numeral in a square Ink-outlined badge. It is not Amber, because the count is a quantity and not a status. Alerts shows open count.
- **Org switcher** is a popover with search, recent orgs and role in each ("Acme Ltd · Approver").
- **Environment switcher:** Production / Sandbox. Sandbox adds the full-width band (3.2). Switching environment keeps the current page if it exists.
- **Emergency stop entry** is a fixed item at the bottom of the sidebar: square, Ink outline, label "Emergency stop". It is not Crimson until a stop is active (Crimson means refused/failed. An unused control is not a failure).
- **Brand disc:** in the top-left of the top bar at 16px, as the product mark. This is its one appearance per surface. It never sits next to a status dot. Status indicators in the top bar (connection state) use icons + words, not dots.
- **Collapse:** `[` toggles the sidebar. Collapsed state shows icons with tooltips and keeps counts.
- **Responsive:** below 1024px the sidebar becomes a drawer. Below 640px the bottom bar holds Today, Approvals, Activity and More.

**Keyboard:** `Ctrl/Cmd+K` palette, `G` then a letter to go (see 4.13), `[` collapse sidebar, `Ctrl/Cmd+Shift+O` org switcher, `Ctrl/Cmd+Shift+E` environment switcher. A skip link "Skip to main content" is the first focusable element.

### 4.2 Command palette

**Purpose:** one input for navigation, actions, objects and help.

**Anatomy:** a centred 640px-wide panel, 64px from the top, with square corners, 1px Ink-20% border and elevation 3. The input is 48px high with Plex 16px text. Results are grouped under uppercase labels: Suggested, Go to, Actions, Agents, Rulebooks, Receipts, Help. Each row has an icon, label, secondary text in Graphite and a shortcut hint right-aligned in a square key chip.

**Behaviour**
- Fuzzy match across all groups. The palette recognises pasted IDs: a receipt ID or hash prefix of at least 8 characters jumps straight to that receipt, and an agent key prefix finds the agent.
- **Scoped mode:** typing `>` limits to actions, `@` to agents, `#` to receipts, `/` to rulebooks.
- **Contextual actions first:** on an agent page, "Pause this agent" is the top suggestion.
- **Dangerous actions** (pause all, emergency stop, roll signing key) are listed but open their full confirmation flow. The palette never executes them directly.
- **Recent** items persist per user.

**Accessibility:** use the ARIA combobox pattern with `aria-activedescendant`. Results are announced with a count ("8 results"). `Esc` closes and returns focus to the trigger.

**Copy:** placeholder "Search or run a command". Empty result: "No matches for 'invioce'. Did you mean invoice-bot?"

### 4.3 Approval card anatomy

**Purpose:** give a named person everything needed to decide correctly in under 30 seconds, from any channel.

**Desktop anatomy (right pane of the inbox, 640px)**
```
┌─────────────────────────────────────────────────────────────┐
│ ⏳ AWAITING APPROVAL            Expires in 42 min (15:30 BST) │  status row: Amber icon + Ink label; countdown in tabular figures
│                                                             │
│ invoice-bot wants to send invoice INV-2207 for £18,400      │  headline: Schibsted 20/600. Agent + verb + object + amount
│ to Northwind Ltd                                            │
│                                                             │
│ WHY IT WAS HELD                                             │
│ Rule fin-007 in Finance rulebook v15:                       │
│ "Hold invoices over £10,000 to new customers."              │  quoted rule text, linked to rule
│ Northwind Ltd became a customer 6 days ago.                 │  the specific fact that triggered it
│                                                             │
│ WHAT HAPPENS IF YOU APPROVE                                 │
│ Email to ap@northwind.example with PDF attached, via Xero.  │  effect + connector
│ [View full request ▸]                                       │  raw tool call, redacted per policy
│                                                             │
│ CONTEXT                                                     │
│ 14 similar actions approved in 30 days · 0 reversed         │
│ Requested by agent on behalf of: Sam Patel (Sales)          │
│ Session: 7 actions, 6 allowed, 1 held (this one)  [Open]    │
│                                                             │
│ ROUTE                                                       │
│ Step 1 of 2: Finance lead (you) → Step 2: CFO (over £15k)   │  chain with current step
│ Notified: web, Slack 14:47, email 14:47                     │
│ 👁 Tom Reid is also viewing                                   │  presence
│                                                             │
│ Reason (optional for approve, required for refuse)          │
│ [_______________________________________________]           │
│                                                             │
│ [ Approve  A ]   [ Refuse  R ]   [ More ▾ ]                 │  Ink primary, outline secondary
│                   More: Delegate · Ask agent for info ·     │
│                         Approve and draft a rule            │
└─────────────────────────────────────────────────────────────┘
```

**Rules**
- **Headline grammar:** `<agent> wants to <verb> <object> [for <amount>] [to <counterparty>]`. Always a specific sentence and never "Action requires approval".
- **"Why it was held"** quotes the rule's human-readable description *and* names the triggering fact. This is the most important block on the card.
- **Expiry:** absolute local time plus relative countdown. Under 5 minutes, the line reads "Expires in 4 min" in Ink 600 with a clock icon, not a colour change alone. Expired cards read "Expired at 15:30. No action was taken. The agent was told." The outcome on expiry (refuse by default) is stated in the rulebook and shown on the card ("If no one answers, this is refused at 15:30").
- **Decision commit:** `A` or the Approve button opens a confirmation strip with the reason field focused. `Cmd/Ctrl+Enter` commits. For actions marked high-risk in the rulebook, commit requires a passkey step-up.
- **After the decision:** the card shows the result chip (Verdigris check "Approved" or Crimson cross "Refused") with "Receipt #48213 signed 14:52:07" and a link. Focus moves to the next item in the inbox.
- **Conflicts:** if another approver decides first, the card locks and says who and when. The local action is discarded and the user is told.
- **Separation of duties:** if the viewer is the person on whose behalf the agent acted, actions are disabled with "You requested this, so someone else must approve it."

**Inbox list row (left pane, 40px at default density):** status icon · headline truncated · agent · amount (right-aligned, tabular) · expiry (relative) · channel icons. Sorted by expiry soonest. Filters: Mine, My team, All, Expiring soon.

**Bulk:** select with `X`, then approve or refuse together only when all selected items match the same rule and the user has the role for each. The confirmation lists them ("Approve 6 actions under rule fin-012, total £4,180?"). High-risk items cannot be bulk-approved.

**Mobile variant (from email, Slack or WhatsApp)**
- A signed, single-use, expiring deep link opens `/a/<token>`. It requires a session or a passkey sign-in. The link alone never approves (prevents link-forwarding approvals). Email and WhatsApp messages carry the headline and expiry, but no approve button that acts without sign-in.
- Slack: interactive buttons are allowed for actions the rulebook marks low-risk, *if* the Slack user is mapped to a member with the role. High-risk actions show "Review in Govern" instead.
- Layout: single column with the status row, headline, "Why it was held", effect, then a collapsed Context. A sticky bottom bar holds Approve and Refuse as 48px-high full-width buttons, with at least 8px between them.
- After deciding: a full-screen result with the receipt number and "Back to Slack" or "Close".
- Already decided: "Tom approved this at 14:52. Nothing more is needed."

### 4.4 Receipt and timeline anatomy

**Purpose:** each decision is a signed, hash-chained record that a human can read and a machine can verify.

**Receipt log row (Activity table, 40px default)**
| Col | Content | Notes |
|---|---|---|
| Seq | `#48213` | Plex tabular, right-aligned |
| Time | `14:52:07` (date in group header) | hover shows UTC and ISO 8601 |
| Decision | ✓ Allowed / ⏳ Held / ✕ Refused / ↻ Approved after hold | icon + word, functional colour on icon and word |
| Agent | `invoice-bot` | link |
| Action | `xero.invoice.send` + one-line summary | mono for the action name |
| Rule | `fin-007 · v15` | link to exact version |
| Decided by | `Rule` or `Priya Shah (Slack)` | names, not IDs |
| Hash | `9f3a…c21e` | mono, copy button, chain icon |

**Receipt detail (drawer 640px or full page)**
1. **Header:** decision chip, headline sentence (same grammar as 4.3), seq and time.
2. **Verification strip:** "Signature verified · Chain intact · In checkpoint #312", each with an icon (pattern 4.8). It is computed client-side where possible.
3. **Timeline:** a vertical list of steps (requested → matched → held → notified → viewed → decided → signed → checkpointed), each with time and duration. Spans such as "Held 3 min 12 s" are drawn as a 2px vertical Graphite rule with a label, not a coloured bar alone.
4. **Chain view:** `← #48212 9f1b…` | **`#48213 9f3a…`** | `#48214 a07c… →`. Shows prev-hash equality as "prev_hash matches #48212" with a check.
5. **Tabs:** Summary · Signed receipt (canonical JSON, copy, download) · Rule (YAML excerpt of the matching rule at that version) · Request (redacted payload) · Comments.
6. **Actions:** Copy permalink · Download receipt · Open in public verifier.

**Grouping:** a "Compact" toggle groups receipts by agent session (Temporal-style). Date group headers are sticky.

**Real-time:** new receipts insert at the top with a 1200ms Bone background fade (not a status colour). When scrolled, a "12 new" pill appears. Users can pause the live feed.

### 4.5 Data-dense tables (used by Activity, Agents, Approvals, Connectors, Inventory, Billing)

- **Density toggle** (per user, remembered): Compact 32px rows / 13px text, Default 40px / 14px, Comfortable 48px / 14px. Shortcut `Ctrl/Cmd+Shift+D` cycles.
- **Numbers:** IBM Plex Sans with `font-variant-numeric: tabular-nums lining-nums`, right-aligned, with units in the header ("Amount (£)") and not repeated per cell. Dates are left-aligned. British formats: `27 Oct 2026`, `14:52`, `£18,400.00`, `1,204`.
- **Header:** 12px uppercase letterspaced labels (Graphite, 600). Sort indicator is an arrow icon plus `aria-sort`. Sticky header and sticky first column on horizontal scroll.
- **Rows:** 1px hairline dividers, no zebra by default (zebra as an option at Compact density). Hover is Bone. Selection is Bone + 2px Ink left rule + checkbox.
- **Row actions:** an overflow menu at the row end, visible on hover *and* on focus, and always visible on touch.
- **Column controls:** show/hide, reorder (with a non-drag alternative for WCAG 2.5.7: "Move left/right" in the column menu), resize, and pin.
- **Filters:** a chip bar above the table ("Decision is Refused ×", "+ Filter"). Filter state lives in the URL. Saved views are shareable with the team.
- **Pagination:** cursor-based infinite scroll with virtualisation for logs, and a "Jump to time" control. Count shown as "Showing 1–200 of 12,408".
- **Export:** CSV and JSON of the current filter, with the receipt signatures included in JSON.
- **Keyboard:** grid navigation with arrow keys (ARIA grid pattern) for interactive tables; J/K for row focus in list views; `Enter` opens; `X` selects; `Shift+X` range-selects.

### 4.6 Diff viewer (rulebook versions)

**Purpose:** show what changed in a rulebook in *meaning* first and text second.

**Anatomy**
1. **Change summary (semantic):** "3 rules changed: 1 tighter, 1 looser, 1 reworded. 1 rule added." Each change is a row: rule ID, change type (word + icon; "Looser" is flagged as needing review), plain-English before/after ("Before: hold invoices over £10,000. After: hold invoices over £25,000.").
2. **Impact (from simulation):** "Against the last 30 days (12,408 actions): 37 actions that were allowed would now be held. 2 actions that were held would now be allowed. 0 change for refused." Each number links to the list of affected receipts.
3. **Text diff:** YAML split or unified view (toggle, remembered). Line numbers, intra-line highlights, "collapse unchanged" with expand controls, and comment anchors on lines.
4. **Review bar:** reviewer, required approvals ("1 of 1 required"), "Approve and sign", "Request changes".

**Diff colouring within the brand.** Added and removed lines are not Verdigris and Crimson. Those colours mean approved and refused, and using them for text changes would confuse. Use:
- Added: Bone background + 2px Ink left rule + `+` gutter glyph.
- Removed: Paper background with diagonal hatching at 6% Ink + 2px Graphite left rule + `−` glyph. No strikethrough, because it hurts legibility. Screen readers get "added line" and "removed line".
- Intra-line change: 1px Ink underline + Bone highlight.

This is a deliberate departure from GitHub's green/red and should be tested with users (D4).

### 4.7 Rule builder (visual ↔ YAML)

**Purpose:** a person who does not write YAML can create and read rules. A person who does can work in YAML without losing anything.

**Anatomy**
- A **mode switch** at top: `Builder | YAML` (segmented control, square). The current mode is remembered per user.
- **Builder rule row:** `WHEN [action ▾ xero.invoice.send] AND [amount ▾] [is over ▾] [10,000 GBP] AND [customer.age_days ▾] [is under ▾] [30]` → `THEN [Hold for approval ▾] BY [Finance lead ▾] EXPIRES AFTER [60 min] ON EXPIRY [Refuse ▾]`.
- **Outcome selector:** Allow / Hold for approval / Refuse. Each shows its functional icon and word.
- **Groups:** And/Or groups with indentation (max 3 levels in builder. Deeper is shown read-only "Edited in YAML").
- **Description field:** required plain-English sentence. It is what approval cards quote.
- **Reorder** with Move up/Move down buttons and drag as an extra (WCAG 2.5.7). Rule order is explicit ("Rules are checked top to bottom. The first match decides.").
- **Test panel** on the right: pick a past action or paste one, then see the outcome and the matching clause highlighted in both builder and YAML.
- **YAML mode:** CodeMirror with YAML language, schema-aware autocomplete, inline lint, folding, and the same error list as the builder.

**Round-trip contract**
- YAML is canonical. Builder edits patch the YAML document model (comments, key order and anchors preserved).
- Constructs the builder cannot represent stay intact, and the row says "Edited in YAML. Open in YAML to change." No "discard your changes" dialog.

**Publish flow:** Draft → Simulate → Review (second person) → Sign and publish → Live. A progress stepper shows each state with a word and icon.

### 4.8 Verification result display (in console and on the public verifier)

**Purpose:** a three-valued, specific answer to "is this record genuine and untampered?"

**Three outcomes, never two**
| Result | Icon + word | Colour | Meaning |
|---|---|---|---|
| Verified | ✓ "Verified" | Verdigris | All checks passed. |
| Failed | ✕ "Failed" | Crimson | At least 1 check failed. Say which. |
| Cannot verify | ? "Cannot verify" | Graphite (neutral, no functional colour) | A check could not run (unknown key, missing checkpoint, offline). This is not a pass. |

**Checklist under the headline** (each line with its own result):
1. Signature valid for key `govern-prod-2026-03` (Ed25519)
2. Key was active when signed (14:52:07 UTC, 27 Oct 2026). Key valid 1 Mar 2026 to now.
3. Hash matches the receipt contents
4. Previous-hash links to receipt #48212
5. Included in signed checkpoint #312 (14:55:00 UTC)

**Public verifier page:** paste JSON, drop a file, or open a link with the receipt embedded in the URL *fragment* (`#r=…`) so it never reaches the server. Verification runs in the browser. A line says "Checked in your browser. Nothing was sent to Elan1." A "How this works" disclosure and a link to the open-source verifier CLI follow. No sign-in required.

**Copy:** a Failed result names the failing check and what it means ("The contents have changed since signing. Do not rely on this record.") and never says "invalid" alone.

### 4.9 Compliance coverage view

**Purpose:** show for each framework which controls have current evidence from Govern, which have owners, and what is missing.

**Anatomy**
1. **Framework strip:** 10 framework tiles (square, 1px border). Each shows name, "41 of 52 controls covered", and a segmented bar with labelled segments: Covered (Verdigris + check), Needs attention (Amber icon + Ink label), Not started (Graphite outline). The legend is always visible, and each segment has its count as a numeral.
2. **Coverage matrix:** rows are controls (grouped by theme: oversight, logging, risk assessment, incident response…), columns are the selected frameworks (up to 4 at a time on 1440, horizontally scrollable). Cells show icon + short word ("Covered", "Partial", "Gap", "N/A"). Clicking a cell opens the control drawer.
3. **Control drawer:** requirement text (paraphrased with citation), how Govern satisfies it, linked evidence (live queries such as "All refused decisions, last 90 days"), owner, last reviewed, cross-mapped frameworks ("Also satisfies: ISO 42001 9.1, NIST AI RMF MEASURE 2.7").
4. **Evidence freshness:** "Fresh" (within the control's interval), "Stale" (past it, Amber), "Missing".

No single "percent compliant" hero number. Counts are shown instead (3.6).

### 4.10 Emergency stop flow

**Purpose:** stop agents fast, deliberately, with a clear record, and resume safely.

**Flow**
1. **Entry:** sidebar "Emergency stop", the command palette, an agent page ("Stop this agent"), the Alerts page, or Slack `/govern stop`.
2. **Scope** (full-page modal on Ink ground, Paper text, so it is unmistakably different): radio options "One agent", "All agents using a connector", "All agents in this workspace", "Everything in this organisation". Selecting a scope shows the effect live.
3. **Preview of effect:** "14 agents will stop taking actions. 3 pending approvals will be refused and their requesters told. 2 scheduled runs will not start. Read-only access stays on." The list is expandable.
4. **Reason:** required free text, and a type (incident, test drill, other).
5. **Confirm:** "Type STOP to confirm" in a text input. The confirm button stays disabled until the input exactly equals `STOP` (case-sensitive, trimmed). Paste is allowed (accessibility). For org-wide scope, an optional policy requires a second Owner to confirm within 10 minutes.
6. **Result:** the stop is signed as a receipt. Agents receive refusals with reason `emergency_stop`. A persistent banner appears on every surface: Crimson stop icon + "Emergency stop active since 15:02 by Priya Shah: suspected prompt injection. 14 agents stopped." + "View" + "Resume…". Notifications go to all Owners and Admins in every configured channel.
7. **Resume:** a guided step with scope (resume all or some), a reason, and a "what changed" note. Agents resume in a held state for the first N actions if the rulebook asks for it.

**Rules:** no single-key shortcut for stop. It is not hidden behind a menu either: the entry is always visible. A test-drill mode in Sandbox lets teams practise.

### 4.11 Onboarding checklist

**Purpose:** get a new organisation from sign-up to first governed decision, then to first evidence export.

**Anatomy:** a panel on Today (dismissible, reopenable from Help) titled "Get Govern working" with numbered steps, each showing state (icon + word: To do / Done), estimated time, and a single action:
1. Connect your first agent (SDK, MCP or REST) – 5 min
2. See your first receipt – automatic when step 1 succeeds ("Your first decision arrived. View receipt")
3. Publish a starter rulebook (choose from templates: Finance, Customer support, Engineering) – 10 min
4. Approve your first held action – from web or Slack
5. Invite a second person and give them the Approver role
6. Connect Slack or email for approvals
7. Set up SSO (Owners only, optional on lower plans)
8. Export your first evidence pack

**Rules:** progress shows "3 of 8 done" (numerals, no percentage ring). Steps complete from real events, not ticked by hand. Each step deep-links into the right place with the context prefilled. The checklist is per org with role-aware steps (a Developer sees SDK steps first, an Approver sees approval setup).

### 4.12 Empty, loading and error states

**Empty states** answer: what goes here, why it is empty, and the one next step.
- Approvals (no items): "Nothing is waiting for you. When an agent's action is held, it appears here and you are told by Slack and email." Action: "Change where you are notified".
- Activity (new org): "No decisions yet. Connect an agent and its first action will appear here within seconds." Action: "Connect an agent". Secondary: "Send a test decision".
- Filtered empty: "No refused decisions for invoice-bot in the last 24 hours." Action: "Clear filters".
- Illustrations: none, or a single line-drawn diagram in Ink. No stock art.

**Loading**
- Skeletons are square blocks in Bone at the size of the real content, with no shimmer (or a slow 1600ms opacity pulse that is off under reduced motion).
- Inline actions show progress in the button ("Publishing…") and keep their width.
- Under 300ms, show nothing. Over 10s, explain ("Simulating against 30 days of actions. This takes about 20 seconds.").

**Errors** say what happened, what it means, and what to do. They keep the user's input.
- "We could not publish Finance rulebook v16. The signing service did not respond. Your draft is saved. Try again, or check status."
- Permission: "You need the Approver role for the Finance rulebook to decide this. Ask an Owner: Priya Shah, Tom Reid."
- Connection lost: a top bar line with an icon + "Live updates paused. Reconnecting…". It is not a coloured dot alone.
- Errors use the Crimson icon + text only when something failed. Validation errors use Crimson text #9B2C3B (7.14:1) with an icon, linked to the field with `aria-describedby`, plus an error summary at the top of long forms.

### 4.13 Notifications and keyboard shortcuts

**Notifications**
- **In-app:** a bell with count opens a panel grouped as "Needs you" (approvals, review requests, assessment sign-offs) and "For your information" (publishes, stops, alerts). Each has mark read and a link.
- **Toasts:** bottom-left, square, Ink ground and Paper text, 1 at a time with a queue. Undo for 5s where applicable. Polite `aria-live`. Errors do not auto-dismiss.
- **Channels:** web, email, Slack, WhatsApp and mobile push, set per person per event type in Settings → Notifications as a matrix with sensible defaults. Quiet hours and delegation are included. Each notification carries headline, expiry and a deep link. Approvals are never decided by replying with text.
- **Digest:** a daily email at the user's chosen time: "Yesterday: 1,204 decisions. 37 held, 35 approved, 2 refused. 1 rulebook published."

**Keyboard shortcuts** (shown in the `?` sheet and beside palette items; all single-character keys can be switched off)

| Scope | Keys | Action |
|---|---|---|
| Global | Ctrl/Cmd+K | Command palette |
| Global | ? | Shortcut sheet |
| Global | / | Focus search on the page |
| Global | G then T / A / Y / N / R / C / E / P / L / S / D | Go to Today / Approvals / Activity / Agents / Rulebooks / Connectors / Evidence / Compliance / Alerts / Settings / Developers |
| Global | [ | Collapse sidebar |
| Global | Ctrl/Cmd+Shift+D | Cycle density |
| Lists | J / K | Next / previous |
| Lists | Enter / Esc | Open / close detail |
| Lists | X / Shift+X | Select / range select |
| Approvals | A / R | Open approve / refuse with reason focused |
| Approvals | Ctrl/Cmd+Enter | Commit decision |
| Approvals | D | Delegate |
| Detail | . | Actions menu |
| Detail | C | Comment |
| Detail | Y | Copy permalink (in detail views only) |
| Rulebooks | Ctrl/Cmd+S | Save draft |
| Rulebooks | Ctrl/Cmd+Shift+M | Switch Builder / YAML |
| Diff | N / P | Next / previous change |

No shortcut exists for emergency stop, publish or key rotation.

---

## 5. Recommended design tokens

All tokens are CSS custom properties, exposed to Tailwind through `@theme` (section 7). Light values first, dark values in `[data-theme="dark"]`.

### 5.1 Colour

```css
:root {
  /* brand */
  --ink: #0A1320; --slate: #1E3048; --graphite: #4A5561;
  --paper: #FBFAF7; --bone: #F2EDE6; --white: #FFFFFF;
  --clay: #B9603F; --kiln: #8A4229; --ember: #DF8C64;

  /* roles */
  --bg: var(--paper);
  --surface: var(--white);
  --surface-sunken: var(--bone);
  --text: var(--ink);
  --text-muted: var(--graphite);
  --accent-mark: var(--clay);       /* rules, disc, focal mark: non-text only */
  --accent-text: var(--kiln);       /* accent-family text and links */
  --action-bg: var(--ink); --action-fg: var(--paper);

  /* functional: always paired with icon + label */
  --ok: #2E7D6B;       --ok-text: #2E7D6B;
  --held: #C99A2E;     --held-text: #7D5F17;   /* derived, 5.71:1 on Paper */
  --bad: #9B2C3B;      --bad-text: #9B2C3B;
  --info: #2F6FB3;     --info-text: #2F6FB3;

  /* lines */
  --line-hairline: #E4DED4;  /* decorative dividers */
  --line-control: #8F877B;   /* input borders, 3.40:1 */
  --line-strong: var(--ink);
  --focus: var(--ink);
}
[data-theme="dark"] {
  --bg: var(--ink); --surface: var(--slate); --surface-sunken: #142238;
  --text: var(--paper); --text-muted: #A7B0BC;
  --accent-mark: var(--clay); --accent-text: #D98A6B;
  --action-bg: var(--paper); --action-fg: var(--ink);
  --ok-text: #6CC3AE; --held-text: #C99A2E; --bad-text: #E8909E; --info-text: #8DB8EA;
  --line-hairline: #24364F; --line-control: #5A6A80; --line-strong: var(--paper);
  --focus: var(--paper);
}
```
Dark mode follows the system by default with a manual override (Light / Dark / System) in the user menu. Brand guidance names Ink as a dark ground, so dark mode is on-brand.

### 5.2 Spacing (4px base)

| Token | px | Typical use |
|---|---|---|
| space-0 | 0 | |
| space-0.5 | 2 | icon–text nudge |
| space-1 | 4 | chip padding Y |
| space-2 | 8 | gap in controls, cell padding Y (compact) |
| space-3 | 12 | cell padding X, card inner gap |
| space-4 | 16 | form field gap, card padding (compact) |
| space-5 | 20 | |
| space-6 | 24 | card padding, section gap |
| space-8 | 32 | page gutter at 1440 |
| space-10 | 40 | |
| space-12 | 48 | section break |
| space-16 | 64 | page top on empty states |
| space-20 | 80 | marketing/pricing only |

Layout constants: top bar 48, sidebar 240 / 56 collapsed, page gutter 32 (16 under 640px), reading width max 720, form width max 560, detail drawer 480 (narrow) / 640 (wide), inbox list 400–480 plus card.

### 5.3 Type scale (1440 desktop UI)

| Token | Font | Size / line | Weight | Tracking | Use |
|---|---|---|---|---|---|
| display | Schibsted Grotesk | 40 / 48 | 700 | −0.02em | public verifier result, pricing headline |
| h1 | Schibsted Grotesk | 28 / 36 | 700 | −0.015em | page titles on overview pages |
| h2 | Schibsted Grotesk | 24 / 32 | 600 | −0.01em | standard page title |
| h3 | Schibsted Grotesk | 20 / 28 | 600 | −0.01em | approval headline, drawer title |
| h4 | Schibsted Grotesk | 16 / 24 | 600 | −0.005em | card titles |
| body-lg | IBM Plex Sans | 16 / 24 | 400 | 0 | reading text, empty states |
| body | IBM Plex Sans | 14 / 20 | 400 | 0 | default UI |
| body-strong | IBM Plex Sans | 14 / 20 | 600 | 0 | emphasis, active nav |
| table | IBM Plex Sans | 13 / 20 (compact 13 / 16) | 400 | 0, `tnum` | table cells |
| label | IBM Plex Sans | 12 / 16 | 600 | +0.08em, uppercase | section labels, table headers |
| caption | IBM Plex Sans | 12 / 16 | 400 | 0 | help text, timestamps |
| mono | IBM Plex Mono | 13 / 20 | 400 | 0 | hashes, IDs, YAML, JSON |
| metric | Schibsted Grotesk | 32 / 40 | 600 | −0.02em, `tnum` | stat tiles on Today |

- Minimum size is 12px. No 11px text.
- Tables set `font-feature-settings: "tnum" 1, "lnum" 1`.
- **IBM Plex Mono is a proposed addition.** The brand names 2 families, but hashes and YAML need a monospace. Plex Mono belongs to the same family (D2).
- Sentence case everywhere except `label` tokens (uppercase by CSS `text-transform`, so screen readers read normal case).

### 5.4 Borders and geometry

```css
--radius: 0;               /* the system has no rounded corners. Applies to everything, including focus rings, avatars and checkboxes */
--border-1: 1px solid var(--line-hairline);
--border-control: 1px solid var(--line-control);
--border-strong: 1px solid var(--line-strong);
--border-selected: 2px solid var(--line-strong);
--rule-accent: 2px solid var(--accent-mark);    /* active nav, one per surface */
--rule-status: 4px solid currentColor;          /* left edge of status cards, with icon + label */
--focus-ring: 0 0 0 2px var(--bg), 0 0 0 4px var(--focus);
```
- Avatars are square (initials on Bone, or photo cropped square).
- Radio buttons are not an exception. The brand forbids rounded corners, so radio indicators are square with a filled inner square and a clear label. Test with users (D5). The brand disc is the only circle in the system.
- Toggles: square track and thumb.
- Charts: square bar ends, `stroke-linejoin: miter`, `stroke-linecap: square`. Icons rendered with `strokeLinecap="square" strokeLinejoin="miter"` (Lucide accepts these props).

### 5.5 Elevation (no radius, no blur-heavy glow)

| Level | Use | Treatment |
|---|---|---|
| 0 | page | `--bg`, no border |
| 1 | cards, tables | `--surface` + `--border-1` |
| 2 | sticky headers, drawers | `--surface` + `--border-1` + `0 1px 0 rgba(10,19,32,.06)` |
| 3 | popovers, menus, palette | `--surface` + 1px `rgba(10,19,32,.16)` + `0 8px 24px rgba(10,19,32,.12)` |
| 4 | modals | level 3 + scrim `rgba(10,19,32,.48)` |
| Stop | emergency stop modal | Ink ground full-screen, Paper text; no shadow needed |

In dark mode, elevation is expressed by tone (Ink → Slate → #2A3F5C) and the border, because shadows barely show on Ink.

### 5.6 Z-index

`base 0 · sticky 10 · drawer 20 · popover 30 · toast 40 · modal 50 · stop-banner 60 · palette 70`

### 5.7 Motion

```css
--dur-instant: 80ms;   /* hover, press */
--dur-fast: 120ms;     /* menus, tooltips */
--dur-base: 180ms;     /* drawers, tabs */
--dur-slow: 240ms;     /* modals, page-level */
--dur-highlight: 1200ms; /* new-row fade */
--ease-standard: cubic-bezier(0.2, 0, 0, 1);
--ease-exit: cubic-bezier(0.3, 0, 1, 1);
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 1ms !important; transition-duration: 1ms !important; } }
```
Rules: only `transform` and `opacity` animate. Drawers slide 16px + fade, not the full width. No bounce, no spring overshoot. Countdown timers do not animate per second; they update text every second at most and announce only at thresholds (15, 5 and 1 minute).

### 5.8 Data visualisation tokens

- Decision series: allowed `--ok`, held `--held`, refused `--bad`, in that order, always with a legend that has icons and words, and direct labels where space allows.
- Non-status series: Ink, Slate, Graphite, then #8F877B, then Bone with Ink outline. Clay may highlight *one* series or marker per chart.
- Gridlines: `--line-hairline`. Axis text: `caption` token, Graphite.
- Every chart has a "View as table" toggle.

---

## 6. Accessibility checklist (WCAG 2.2 AA, plus product-specific rules)

**Perceivable**
- [ ] Text contrast at least 4.5:1, large text at least 3:1. Use the measured table in 2.1. Clay, Ember and Amber are not used for body text on light grounds.
- [ ] Non-text contrast at least 3:1 for control borders, focus indicators, chart marks that carry meaning, and icons (1.4.11).
- [ ] Status is never colour-only: icon + word on every status (1.4.1). The brand already requires this.
- [ ] Reflow at 320 CSS px without two-dimensional scrolling, except data tables and the diff, which may scroll horizontally inside their own region (1.4.10).
- [ ] Text spacing overrides do not break layouts (1.4.12). Test with the bookmarklet.
- [ ] Charts have a table alternative. The risk graph has a list equivalent.
- [ ] Hashes and IDs are read sensibly: `aria-label="hash 9f3a, ending c21e"` with the full value available to copy.

**Operable**
- [ ] Everything works by keyboard, with no traps. Modals trap focus intentionally and return it on close (2.1.1, 2.1.2).
- [ ] Single-character shortcuts can be turned off or remapped (2.1.4).
- [ ] Expiry timers: the approver can see the deadline, and the system warns at 5 minutes. The deadline is a real business limit (the agent is waiting), which is allowed under 2.2.1's real-time exception, but sessions themselves must offer extension before timing out.
- [ ] Skip link, landmarks (`header`, `nav`, `main`, `aside`), one `h1` per page, and logical heading order (2.4.1, 1.3.1).
- [ ] **Focus not obscured (2.4.11, new in 2.2):** sticky headers, the stop banner, the sandbox band and toasts must not cover the focused element. Use `scroll-padding-top` equal to the sticky stack height.
- [ ] Focus visible with the 2px ring + 2px offset in both themes (2.4.7). Aim for 2.4.13 (AAA) too, since the ring meets it.
- [ ] **Dragging movements (2.5.7, new):** column reorder, rule reorder and range selection all have non-drag alternatives.
- [ ] **Target size (2.5.8, new):** at least 24×24 CSS px for every target, including table row actions and chip remove buttons. Mobile approval buttons are 48px high.
- [ ] Labels in the name match the visible label (2.5.3), for example the Approve button's accessible name starts with "Approve".

**Understandable**
- [ ] `lang="en-GB"` on the document.
- [ ] Help is in the same place on every page (3.2.6, new): the `?` menu in the top bar.
- [ ] **Redundant entry (3.3.7, new):** wizards (SSO, connectors, assessments) carry earlier answers forward and do not ask twice.
- [ ] **Accessible authentication (3.3.8, new):** passkeys and SSO. Paste is allowed in every password, code and STOP field. No CAPTCHA puzzles. The typed STOP is a confirmation, not authentication, and paste stays allowed.
- [ ] Errors identified in text, linked to fields, with suggestions (3.3.1, 3.3.3). Irreversible actions (sign, publish, stop, refuse) are confirmed or reversible (3.3.4).
- [ ] Consistent navigation and identification across surfaces (3.2.3, 3.2.4).

**Robust**
- [ ] Use React Aria (or equivalent) patterns for combobox, grid, menu, dialog, tabs, listbox and date picker. No hand-rolled ARIA for these.
- [ ] Live regions: polite for new receipts (batched, at most 1 announcement per 10s: "5 new decisions"), assertive only for emergency stop and failures (4.1.3).

**Process**
- [ ] axe-core in unit/component tests and Playwright end-to-end, failing CI on any serious violation.
- [ ] A manual screen-reader pass per release on NVDA + Firefox, JAWS + Chrome, VoiceOver + Safari (macOS and iOS), and TalkBack for mobile approvals.
- [ ] Keyboard-only walkthrough of the 5 critical journeys: approve, refuse, publish a rulebook, emergency stop, verify a receipt.
- [ ] Windows High Contrast / `forced-colors` mode: borders and focus remain visible. Status icons use `currentColor`.
- [ ] Zoom to 200% and 400%.

---

## 7. Recommended front-end stack

**React 19.2 rather than 18.** The 19.2 line is current and there is no React 20. React 18 gets no new features, and every library below supports React 19. If an external constraint fixes React 18, pin 18.3.1. The choices below all still work.

| Area | Choice | Version (confirm on scaffold day) | Why |
|---|---|---|---|
| UI runtime | React + React DOM | 19.2.x | Current line. `useOptimistic` and actions suit optimistic decisions. `<Activity>` keeps inbox/detail state when switching tabs. |
| Language | TypeScript, `strict`, `noUncheckedIndexedAccess` | 5.9.x (move to 6.x when the toolchain supports it) | Typed contracts for receipts and rules shared with the API. |
| Build | Vite | 8.0.x | Rolldown-based bundler for dev and build: fast cold starts, one engine. |
| React plugin | @vitejs/plugin-react | latest 5.x | Fast Refresh. Add the React Compiler Babel plugin once stable in your setup. |
| Routing | TanStack Router | 1.17x (1.170.10 seen June 2026) | Type-safe routes and **typed, validated search params**. Filter state, time ranges and selected IDs live in the URL, so every view is shareable (Datadog/Linear pattern). Route-level data loading with Query integration. Alternative: React Router 7 if the team prefers it. |
| Server state | TanStack Query | 5.10x (5.101.0 seen June 2026) | Caching, optimistic mutations with rollback, SSE-driven invalidation, retries. |
| Client state | Zustand | 5.0.x | Small, for UI-only state (density, sidebar, palette, shortcut preferences). Server data stays in Query. |
| Tables | TanStack Table + TanStack Virtual | Table 8.21.x (v9 in progress, adopt once stable); Virtual 3.13.x | Headless, so the brand's square, dense style is fully ours. Sorting, filtering, pinning, resizing, grouping. Virtualisation for 100k-row receipt logs. |
| Accessible primitives | React Aria Components (Adobe) | 1.x latest | The most complete WCAG behaviour for combobox, grid, menus, dialogs, date/time pickers and drag-and-drop with keyboard alternatives. Unstyled, so square brand styling is easy. Alternative: Radix Primitives, which has thinner grid and date support. |
| Command palette | cmdk | 1.1.1 | Proven and small (Linear-style). Compose with our own fuzzy ranking for IDs and hash prefixes. |
| Styling | Tailwind CSS with `@theme` tokens + CSS variables | 4.1.x | Tokens from section 5 as the single source. Set every radius to 0 in the theme so rounded classes cannot appear. Alternative: CSS Modules + vanilla tokens if the team prefers no utility classes. |
| Code editor | CodeMirror 6: `@codemirror/view`, `@codemirror/state`, `@codemirror/lang-yaml`, `@codemirror/lint`, `@codemirror/autocomplete` | 6.x latest | About 10× lighter than Monaco, works on mobile, has an accessible screen-reader mode, and is easy to theme square. JSON-schema-driven YAML completion and lint. |
| Diff | `@codemirror/merge` (split `MergeView` and `unifiedMergeView`) + `diff` (jsdiff) for semantic summaries | merge 6.12.x; diff 8.x | Same editor and theme for diffs. Collapse unchanged and revert controls are built in. Use `@codemirror/lang-yaml`, not the legacy StreamLanguage YAML mode (a forum report shows bad diffs with the legacy mode). |
| YAML model | `yaml` (eemeli) | 2.8.x | Keeps comments, key order and source ranges, which the builder ↔ YAML round-trip needs (pattern 4.7). |
| Validation | Zod | 4.x | One schema for forms, rule YAML (converted to JSON Schema for the editor), and API responses. |
| Forms | React Hook Form + `@hookform/resolvers` | 7.6x | Wizards (SSO, connectors, assessments) with Zod. Fewer re-renders on large forms. |
| Charts | visx (Airbnb) for custom charts; uPlot for dense time series | visx 3.12.x; uPlot 1.6.x | Full control of marks (square caps, brand palette, labels). uPlot draws 100k-point time series in canvas, with a table fallback. Avoid opinionated chart kits that fight the brand. |
| Graph (risk path) | elkjs layered layout + our own SVG | 0.10.x | Deterministic left-to-right lanes, not force layout. |
| Icons | lucide-react | pin exact current 0.x | Consistent 24px grid. Accepts `strokeLinecap="square"` and `strokeLinejoin="miter"` to match the square system. Add a small custom set for decision states. |
| Crypto (verifier) | `@noble/ed25519` / `@noble/curves` + `@noble/hashes`; or WebCrypto if the backend uses P-256 | latest 2.x / 1.x | Audited, dependency-free, run in the browser so the public verifier needs no server. Match the backend's algorithm and canonicalisation (RFC 8785 JCS) exactly. |
| Real-time | Native `EventSource` (SSE) with `Last-Event-ID` resume | – | One-way server push fits receipts and approvals. Works through proxies. Each event invalidates or patches Query caches. Use WebSocket only if presence needs it later. |
| Dates and numbers | `Intl` APIs with `en-GB`; date-fns 4.x for arithmetic | 4.x | British formats, time zones shown explicitly ("BST", "UTC"). |
| Fonts | Fontsource: `@fontsource-variable/schibsted-grotesk`, `@fontsource/ibm-plex-sans`, `@fontsource/ibm-plex-mono` | latest | Self-hosted, so there are no runtime calls to Google (privacy, strict CSP). Subset to Latin, preload body 400/600. |
| Unit/component tests | Vitest + Testing Library + `vitest-axe` | Vitest 3.x/4.x | Vite-native, fast. |
| End-to-end | Playwright + `@axe-core/playwright` | 1.5x; axe 4.10.x | Cross-browser, mobile viewports for approvals, accessibility gates in CI. |
| Component workshop | Storybook with `@storybook/addon-a11y` | 9.x/10.x | Pattern library from section 4 as living documentation, with visual regression (Chromatic or Playwright screenshots). |
| API mocking | MSW | 2.x | Same handlers in Storybook, tests and local dev. |
| Lint/format | ESLint 9 flat config + `eslint-plugin-jsx-a11y` + `typescript-eslint`, Prettier; or Biome 2 | latest | A11y lint at authoring time. |
| API types | OpenAPI → `openapi-typescript` + `openapi-fetch` | 7.x / 0.x | Types generated from the REST spec the Developer portal publishes, so console and docs never drift. |
| Docs (developer portal) | MDX rendered inside the console app, with live snippets pre-filled with sandbox keys | – | One design system for console and docs (Stripe pattern). |
| Error and performance monitoring | Sentry React SDK, with PII scrubbing | 9.x/10.x | Must redact receipt payloads before sending. |

**Not recommended**
- **Monaco:** large bundle, weak on mobile, harder to theme square. CodeMirror covers YAML and diff.
- **MUI, Ant Design, Chakra:** strong default look with rounded corners and their own spacing. Fighting it costs more than starting headless.
- **Redux Toolkit:** more machinery than we need, given TanStack Query holds server state.
- **Google Fonts at runtime:** privacy and CSP cost for a governance product.

**Note on the existing elan1 web conventions.** The elan1 platform's existing web convention (a Claude skill named `vite-react-elan1-ui`) uses Bricolage Grotesque, Outfit and JetBrains Mono with React 18, Vite, Tailwind and a hash router. Elan1 Govern's brand specifies Schibsted Grotesk and IBM Plex Sans, so the Govern console should not inherit those font tokens. A hash router would also break shareable deep links for approvals and receipts. Use history routing (D6).

---

## 8. Surface-by-surface map

| Surface | Primary patterns | 10× moment |
|---|---|---|
| Today | Shell, stat tiles (metric token), decisions chart with markers, onboarding checklist, "Needs you" list | Plain-English summary: "Yesterday 1,204 decisions. 37 held: 35 approved, 2 refused. invoice-bot asked for approval 4× more than usual." |
| Approvals | Inbox (Linear), approval card, mobile variant, presence, delegation | Decide in under 30 s from any channel. "Approve and draft a rule" turns repeated approvals into policy. |
| Activity | Receipt log, facets, query syntax, live tail, compact/all, timeline drawer | Every row verifiable in place. Simulated rules show "would have held" annotations. |
| Agents | Table, detail with keys (Stripe), pause, risk path, decision history chart | Key roll with scheduled expiry. Per-agent "what can it reach" path. |
| Rulebooks | Builder ↔ YAML, test panel, versions (Vercel), PR-style review (GitHub), semantic diff, simulation | "37 actions allowed last month would now be held. See them." before signing. |
| Connectors / MCP | Catalogue grid (square tiles), connect wizard, scope review, health with icon + word | Tool-level scope table: each MCP tool listed with the rule that covers it, and "No rule covers 3 tools" flagged. |
| Evidence | Checkpoint list, verification display, auditor pack export | Offline verifier bundle. "Checked in your browser" verification. |
| AI inventory | Table + risk path graph (Wiz) | Toxic-combination issues in 1 sentence, each with a one-click draft rule. |
| Assessments | Wizard with redundant-entry avoidance, anchored comments, 2-person sign-off | Answers prefilled from live data (agent scopes, rules), sign-off itself signed. |
| Compliance | Framework strip, coverage matrix, control drawer with cross-mapping | Evidence is live and verifiable, not uploaded screenshots. |
| Alerts + stop | Severity in words, ack/assign, timeline, emergency stop flow, persistent banner | Preview of effect before STOP. Guided resume. |
| Settings | Members/roles matrix, SSO wizard (WorkOS), notification matrix, webhooks (Stripe), signing keys | "Send setup link to IT". Signed admin audit log. |
| Developer portal | Quickstart with real keys, MCP, REST reference (generated), SDKs, first-receipt detection | "Your first decision arrived" within the quickstart page. |
| Public verifier | Drop zone, verification display, how-it-works | No account, nothing uploaded, three-valued result. |
| Pricing / billing | Meter chart, plan table with numerals, invoices table | Usage meter in decisions with a forecast: "At this rate you reach 100,000 decisions on 19 November." |

---

## 9. Open decisions

| ID | Decision | Recommendation |
|---|---|---|
| D1 | Approve the derived accessible tints (Amber-text #7D5F17, dark-mode functional tints, control border #8F877B, dark secondary text #A7B0BC, Clay-light #D98A6B) | Approve. They are shades of existing colours and needed for AA. |
| D2 | Add IBM Plex Mono for hashes, IDs, YAML and JSON | Approve. It is the same family as Plex Sans. |
| D3 | Does the shell's active-nav Clay rule count as the surface's one accent? | Yes. Then page content uses Kiln text for links and no further Clay marks in the same viewport, except the brand disc in the top bar (a mark, not an accent element). Confirm with brand. |
| D4 | Diff colours: Bone/Ink/hatching instead of green/red | Adopt, and test with 5 developers. Fall back to labelled gutters if comprehension suffers. |
| D5 | Square radio indicators (no circles) | Adopt, with clear labels. Test recognition. |
| D6 | History routing instead of the hash router used in the existing elan1 web apps | Adopt for shareable approval and receipt links. |
| D7 | Primary buttons in Ink, not Clay | Adopt (Clay with Paper text fails AA at 4.18:1). |
| D8 | WhatsApp approvals: link-out only, no in-message approve | Adopt for audit integrity and step-up authentication. |

---

## 10. Sources

Web research in this round (the Firecrawl account was out of credits; web search was used instead):

- Linear, Navigating Linear (command menu, G-shortcuts, `?` sheet): https://linear.app/enablement/guide/navigating-linear
- Stripe, Build and test new features (sandboxes, Workbench, event destinations): https://docs.stripe.com/get-started/test-developer-integration
- Stripe, Billing testing (sandbox copies live settings): https://docs.stripe.com/implementation-guides/billing/testing
- Stripe Apps, Enable sandbox support: https://docs.stripe.com/stripe-apps/enable-sandbox-support
- Cloudflare, Edit expressions in the dashboard (builder vs editor, switching): https://developers.cloudflare.com/ruleset-engine/rules-language/expressions/edit-expressions/
- WorkOS, Admin Portal (guided SSO and directory setup, domain verification): https://workos.com/docs/admin-portal
- Vanta, How Vanta works and GRC product page (cross-mapping, trust centre): https://vanta.com/resources/how-does-vanta-work · https://vanta.com/products/grc
- Vanta HITRUST page (shared evidence across frameworks): https://vanta.com/products/hitrust
- Ramp, Ironclad multi-step approvals: https://support.ramp.com/ironclad-integration-multi-step-approvals
- GitHub, Managing rulesets for a repository: https://docs.github.com/en/enterprise-server@3.16/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/managing-rulesets-for-a-repository
- GitHub community, ruleset bypass in evaluate mode: https://github.com/orgs/community/discussions/153705
- incident.io Slack app listing: https://slack.com/marketplace/A01DEGPUHHC-incidentio
- PagerDuty, Slack user guide: https://support.pagerduty.com/docs/slack-user-guide
- Temporal, Web UI docs (Timeline, All, Compact): https://docs.temporal.io/web-ui
- Temporal, Workflow visualisation blog: https://temporal.io/blog/lets-visualize-a-workflow
- Wiz toxic combinations (third-party explainer): https://www.securityscientist.net/blog/12-questions-and-answers-about-wiz-toxic-combinations/
- Wiz, AI-powered remediation 2.0: https://www.wiz.io/pt-br/blog/introducing-ai-powered-remediation-2-0
- WCAG 2.2 new criteria: https://dequeuniversity.com/resources/wcag-2.2 · https://silktide.com/blog/whats-new-in-wcag-2-2/
- React versions: https://ja.react.dev/versions · https://endoflife.date/react
- Vite 8 release notes: https://releasebot.io/updates/vite/vite
- TanStack Router releases: https://newreleases.io/project/github/TanStack/router/release/release-2026-06-02-2109
- TanStack ecosystem guide (Query v5.101): https://blog.openreplay.com/tanstack-ecosystem-guide/
- TanStack Table virtualisation guide: https://tanstack.com/table/latest/docs/guide/virtualization
- CodeMirror merge package: https://npmjs.com/package/@codemirror/merge
- CodeMirror forum, MergeView with legacy YAML mode: https://discuss.codemirror.net/t/found-issue-with-mergeview/5805
- cmdk on jsDelivr (1.1.1): https://www.jsdelivr.com/package/npm/cmdk

Contrast ratios in section 2 were computed with the WCAG 2.x relative-luminance formula for this document.
