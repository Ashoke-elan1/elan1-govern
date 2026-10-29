# Decisions on conflicts between the build and the source documents

Decided by Ashoke on 28 October 2026. Where a decision differs from the source documents, the decision wins. Nothing below has been built yet.

| # | Topic | Documents say | Decision | Change to the build |
|---|---|---|---|---|
| 1 | Refusal price | Refusals ₹0 ("412 refused, ₹0", invariant I4) | **The documents are wrong. Refusals cost 40% of the per-action rate for every action.** | None. The documents and financial model (A24, A133) need correcting. |
| 2 | "Signed" at L1 | L1 is a hash chain with no key; "signed" is banned in L1 copy until DR-017 | **Keep Ed25519 signing at L1, but L1 copy says "sealed in a hash chain" until DR-017 is signed.** | Reword the L1 claims, chain status, plan card, verifier, status page and docs. Switch back when DR-017 is signed. |
| 3 | Enforced vs advisory | Mode A Enforced = Governed run (MCP); Mode B Attested advisory = Check and record (SDK/REST) | **Not a conflict.** The build matches. | None. Optionally show the technical name in the tooltip. |
| 4 | Autonomy | No API sets an autonomy level; A2→A3 only by two-person graduation | **Graduation only.** | Remove direct grants. A3 only through a two-person graduation after ≥90 days, ≥200 records and ≥100 approvals, then a 30-day supervised period with 1-in-10 sampling. Revoke stays one press by one person. A4 and A5 shown as not yet available. |
| 5 | Regulatory packs below L2 | ledger1 runs at L1 as configuration with dry-run reports; the 90-day pilot starts at L1 | **Installable at L1 as a dry run.** | Rules run at L1. Reports say "dry run — no regulatory claim until L2". L2-only checks (C06) are marked not applicable at L1. |
| 6a | Approval expiry | Atlas: 24 h. Technology Memorandum: 4 h with one extension | **Keep 24 h; add one declared extension.** | Add the extension action. |
| 6b | Batch timestamped by one authority | Degraded, not failed | **Follow the documents.** | The verifier reports degraded instead of failing. |
| 6c | Erasure (DPDP) | Salts from the first L1 record | **Erasure available from L1.** | Remove the L2 gate on erasure. |
| 6d | Counterparty register | Exists from L1; issuing receipts from L3 | **Register listed from L1; issuing stays L3.** | Show the register read-only below L3. |
| 6e | Verifier profile with a pack | Billed separately, ₹3,00,000 | **Bill it separately.** | Remove "included with a pack" and bill it as its own line. |
| 6f | Evidence bundle ₹2,500 | Inconsistent | **₹2,500 per L2+ bundle; the L1 auditor pack is free.** | Make both invoice builders agree. |
| 6g | SDK name | `@gate/sdk` | **Keep `@elan1/govern`.** "Gate" is banned in customer copy. | None. |
| 6h | Key prefixes | `gk_` and `sk_sbx_` | **Adopt the document prefixes.** | Change `eg_live_` / `eg_test_` to match. |
