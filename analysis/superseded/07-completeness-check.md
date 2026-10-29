# Elan1 Govern front end — completeness check

28 October 2026. Read-only check: nothing was built or changed. Six checkers compared the built front end (`elan1-govern-web/src`) with the source documents, the demo sign-ins and every link.

## Summary

| Check | Items in scope | Built | Partial | Missing |
|---|---|---|---|---|
| Approved plan (00-platform-plan.md) | 66 | 61 | 4 | 1 |
| Information Memorandum (285 pp) | 56 | 26 | 14 | 16 |
| Architecture Atlas + Technical Inventory | 121 | 103 | 11 | 7 |
| Technology Memorandum pp 1–225 | 104 | 66 | 18 | 20 |
| Technology Memorandum pp 226–451 | 173 | 47 | 77 | 49 |
| Links | 314 targets in code, ~2,560 hrefs, 920 pages loaded across 4 levels | No broken links | — | — |

Every route in the approved plan exists. Every price on screen matches the financial model, except the refusal price (see conflicts). The checkers overlap, so the same gap can appear in more than one row.

Out of scope and not counted: the public marketing site (pricing, pilot, trust centre), backend-only internals, separate products (rung1, stack1), elan1-internal operations and the partner programme.

## 1. Conflicts between the build and the documents (need a decision, not building)

1. **Refusal price.** The build charges 40% of the per-action rate (your instruction). The memorandum and financial model still say refusals are ₹0. The documents need updating.
2. **L1 is "signed" in the product.** The build signs L1 receipts with Ed25519 and says "signed" in L1 copy. The Technology Memorandum says L1 holds no key material and bans "signed" in L1 copy until DR-017.
3. **Enforced vs advisory.** The build treats MCP as enforced ("Governed run") and REST/SDK as advisory. The Technology Memorandum (pp 226+) has SDK as Enforced and MCP/HTTP as "Attested advisory". Other sections and the atlas match the build, so the documents disagree with each other.
4. **Autonomy set by a person.** Owners and admins can grant A0–A5 directly (second person for A4/A5). The memorandum says no admin or API sets a level; A3 is reached only by graduation.
5. **Packs blocked below L2.** The memorandum wants ledger1 runnable at L1 as configuration with dry-run reports.
6. Smaller:
   - Approval expiry defaults to 24 h; the memorandum says 4 h with one governed extension.
   - A batch timestamped by one authority fails verification; the memorandum says degraded, not failed.
   - The counterparty register and erasure start at L3 and L2; the memorandum puts them from L1.
   - A verifier profile is shown as included with a pack; the memorandum bills it separately (₹3,00,000).
   - The evidence bundle (₹2,500) is never charged on chain-based invoices, but the other invoice builder in the mock charges it. The two disagree.
   - The SDK is named `@elan1/govern`; the atlas says `@gate/sdk` ("gate" is banned in customer copy).
   - Key prefixes are `eg_live_`/`eg_test_`; the documents say `gk_`/`sk_sbx_`.

## 2. Demo sign-ins

Every listed account signs in to the right organisation and role, with an active membership and a working two-step code. All 3 portal logins resolve. The auditor reaches all 4 organisations.

| Role | L1 Demo Traders | L2 Northbank | L3 Kaveri | Sovereign Deccan |
|---|---|---|---|---|
| Owner | Ananya Rao | Rohan Kapoor | Dr Lakshmi Pillai | Suresh Nambiar |
| Admin | Rahul Menon | Neha Bhatia | Arvind Swamy | Anjali Kulkarni |
| Approver | Venkat Iyer | Gaurav Sethi | Revathi Natarajan | Prakash Deshpande |
| Second approver | Tom Whitfield, Arjun Nair | Imran Qureshi | Mohammed Rafi | Farhan Siddiqui |
| Data protection officer | Fatima Sheikh | Shalini Rao | Dr Sneha Varghese | Meenakshi Sundaram |
| Viewer | Meera Shah | **missing** | **missing** | **missing** |
| Auditor | Kavita Desai (lands here) | Kavita, via switcher | Kavita, via switcher | Kavita, via switcher |

Gaps:
- **No viewer sign-in at L2, L3 or Sovereign.** The people exist (for example Pooja Malhotra, Nandini Hegde, Sunita Joshi) but have no sign-in entry.
- **Approve-by-link sign-in** (`ApproveByLinkPage.tsx:290-310`) skips the two-step code, lockout, SSO-only and suspension checks.
- **Wrong backup-approver labels.** The "backup for Finance" text on Imran and Farhan contradicts the seeded escalation policy, and Kaveri has no labelled backup.
- **README is wrong.** `README.md:16` says any 6 digits pass the code; a real code is checked.
- **Auditor suspension leaks across organisations.** If Kavita is suspended in Demo Traders, her sign-in is refused for all four organisations.
- **Sign-out** leaves the session open in Sessions and writes no receipt.
- **Forgot password** does not cover portal accounts.
- **Portal sign-in** depends only on `?as=` in the URL.
- **SAML "enforced"** at L2, L3 and Sovereign has no effect on password sign-in.
- **Live-demo traps.** A two-step code can't be reused within 30 seconds, and the lockout (from 1 minute up to 1 hour) has no unlock button.
- **No pre-seeded suspended account** to demonstrate suspension.

## 3. Links

No broken link, unused query parameter, missing anchor or malformed external link at any level.
- **Pages checked:** every console page, the 23 developer-doc sections and the public pages, as the owner of all four organisations.
- **Sampled, not loaded in full:** receipt links (about 95 of about 1,850; one route) and about 1 in 5 of the deeper approval links.
- **Not opened:** portal token links, because opening one counts as a view and changes data.

## 4. Screens, panels and actions not built or only partly built

Ordered by importance within each area. L = the level it belongs to.

**Approvals (L1)**
- **Decide screen** (the memorandum calls it "the single most consequential surface"):
  - field-by-field before → after diff with "Show all fields"
  - every gate's result with its version
  - payload digest
  - blast radius
  - gate summary on queue rows
- "Payment recorded · proof #N" with **Open the record** and **Reverse this** (30 days). No rollback action exists anywhere.
- **Approve and draft a rule** (approved plan).
- **"Approvals unavailable" fail-closed page and outage state**: "We cannot check this change right now. Nothing was changed."
- Queue filters in the URL: waiting on me, expiring within an hour, tool, counterparty.
- One declared expiry extension.
- Same-actor copy and forbid mode, a named time-boxed delegate, step-up for irreversible or high-value approvals.
- Emergency stop under dual control.

**Evidence and exports**
- **Auditor pack at L1 is one JSON file.** Missing: PDF summary, compliance map, README.
- **Framework report as PDF.** CSV only today.
- Nightly integrity-run history and continuity report.
- Enforcement mode on the Assurance door and in every export.
- L2 export guards: oversize split, "export the clean range instead", residency gate, "Verify it yourself first" on screen.
- Sandbox receipts are not marked sandbox.

**Keys (L2+)**
- **Key-compromise flow**: stop signing, keep writing unsigned, show the unsigned interval, 24-hour notice.
- Key windows with overlap, revoked status, refusal while a chain incident is open.
- "Key bound · signing off" state.
- KMS Sign-call reconciliation.
- The auditor's evidence request as a recorded write.
- Fingerprint published as a printable page and a DNS TXT record.

**Upgrade (L1→L2)**
- Separate key-bind step.
- "Signing on at seq N" message.
- First-ten-records fingerprint check.
- Tenant exports the first bundle; the tampered bundle exits 1.
- Closing record with its seven checks.
- Signed-island rollback.
- Customer notices: 14-day notice to a named contact, boundary-day confirmation, auditor note.

**Developer portal**
- **Conformance suite C1–C14 and levels CL-1 to CL-D.**
- **Offline-verifier release page**: SHA256SUMS, signature, vectors, tampered bundle.
- 43-code refusal register (POLICY., GATE., PLATFORM.) with a page per code.
- Glossary.
- Action Receipt standard: licences, governance, certification.
- Built-in MCP tool catalogue.
- Rate-limit and Deprecation/Sunset headers.
- Support tiers.

**Developer path to production**
- Self-serve sandbox tenant metered at 0.
- Production-key request with human review.
- Promotion review from advisory to enforced.
- Onboarding refusal sentences for the 8 applicant categories.

**Regulatory packs (L2)**
- Pack admission flow and portfolio register (the gates are hard-coded "Met").
- 11-block pack detail.
- T1–T8 test results.
- Pilot block.
- Separate author and certifier roles.
- **90-day pilot tracker.**
- Two-way reconciliation against the target system's own audit trail.
- `not_measurable` and `out_of_scope` dispositions.
- Verifier profile: withdrawn status, author ≠ certifier, certification flow, P1–P12 results.

**Counterparties and disclosure (L3)**
- Selective-disclosure bundle export over a range.
- Saved disclosure profiles.
- Replay detection.
- Dual-control receipt accept.
- Volume and reversal warning before the first issue.
- REVOKED and dispute states.
- Full graduation for autonomy:
  - precedent score
  - 8 eligibility checks
  - 30-day supervised period
  - automatic revocation and cooldown

**Billing**
- An unreconciled period should block the invoice.
- Dispute settlement outcome.
- Discount line with an end date.
- Partner contra line.
- Pilot tier (90 days free, 2,000-action stop).
- "Modelled list price" label.
- "+4% a year after March 2029".
- Overage discount cap.
- Cost per governed action published beside the refusal rate.

**Operations, security and data protection**
- **Incident classes beyond stop, auto-pause and health**: chain gap, timestamp-authority outage, key compromise, isolation breach. Also the CERT-In 6-hour clock.
- SLO cards and error-budget policy on `/status`; meter and writer components.
- Elan1-to-tenant notices: named contact, 30-minute incident updates, post-incident note, daily chain-head receipt.
- **Legal pages: privacy notice, cookie policy, sub-processor list.** Terms and DPA exist.
- Consent ledger.
- Erasure plan preview, and refusal when statutory retention conflicts.
- Break-glass as a visible dual-control write.
- Withdraw a declaration version.
- Chain gap as a sealed gap record.
- Today due-dates panel.
- Approver telemetry and rubber-stamp sampling.
- RBI model-documentation export.
- Model name and version on agents and AI systems.
- Hosting profile 2 (dedicated residency domain).
- Mobile PWA manifest.

**Marked LATER or open in the memorandum** (listed, not counted as owed):
- Lexicon screen, objects and changesets.
- Tamil and Hindi.
- Bulk approve.
- CA partner console.
- White-label theme.
- OTel trace ids.
