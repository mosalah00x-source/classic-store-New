# Task system — Classic Store

**Repository:** mosalah00x-source/classic-store-New  
**Canonical docs branch:** docs/project-reference

This directory is the source of truth for task status, evidence and post-merge reconciliation. The cross-domain index is [REGISTER.md](./REGISTER.md); the append-only audit trail is [RECONCILIATION-LOG.md](./RECONCILIATION-LOG.md); use [_TEMPLATE.md](./_TEMPLATE.md) for every task that starts.

## Per-task records

- [PR #22 — Catalog alignment / showcase](./PR-22.md)
- [PR #23 — Theme-aware logo](./PR-23.md)
- [PR #24 — Product detail theme toggle](./PR-24.md)
- [PR #25 — Conditional old price / discount](./PR-25.md)
- [PR #26 — Shared Storefront Shell](./PR-26.md)
- [PR #27 — Home Storefront](./PR-27.md)
- [PR #28 — Bottom Navigation](./PR-28.md)
- [PR #29 — Catalog Product Card](./PR-29.md)
- [PR #30 — Mega Menu + Favorite SVG](./PR-30.md)
- [PR #32 — CI-01 documentation path filters](./PR-32.md)
- [PR #4 — Database migrations V1–V7](./PR-04-migrations.md)

## Register and audit files

- [Cross-domain task register](./REGISTER.md)
- [Append-only reconciliation log](./RECONCILIATION-LOG.md)
- [New task template](./_TEMPLATE.md)

## Status vocabulary

Only these statuses are allowed: Planned, In progress, In review, Merged, Done, Blocked, Deferred, Cancelled.

- Planned tasks appear as rows in REGISTER; create a file only when work starts.
- Create one Epic record for cross-domain initiatives such as ADM; link its phases from the relevant domain tables.
- In review means an open PR. Merged is not Done.
- Visual QA values: Not required, Pending, Passed, Failed.
- Evidence tags: [GH], [PO], [USER], [UNV]. Never infer PO approval from merge, Ready state or CI.

## When is a task Done?

A task may be marked Done only when all apply:
1. Its PR is merged.
2. CI is successful on the exact Merge SHA.
3. Its task record and documentation are complete.
4. Explicit PO approval is linked.
5. Visual QA is Not required or Passed.

Otherwise keep it Merged (or the appropriate nonterminal status).

## Branch targeting for documentation

- Product/application PRs target their implementation branch, normally FrontendApp or BackendApp according to the code being changed.
- The canonical documentation branch is docs/project-reference. DOC-01/DOC-02 target BackendApp because the documentation workflow must report the required backend check contexts; the documentation PR itself changes docs plus the explicitly scoped workflow sync only when separately authorized.
- This is a CI/governance reason, not a claim that documentation is Backend implementation. Do not target FrontendApp for docs-only updates unless the task explicitly requires it.

## Protocol after every merge

1. Fetch live PR metadata, changed-file list, Merge SHA, timestamps and Timeline actor/method from GitHub.
2. Verify CI by exact SHA and event. Keep Head CI and Merge-SHA CI in separate fields.
3. Check submitted reviews and issue comments for explicit PO approval; link the exact approval artifact.
4. Update the per-task file and REGISTER in a small docs PR.
5. Add a new dated entry to RECONCILIATION-LOG before correcting any mismatch. The log is append-only.
6. Add newly discovered follow-up work as Planned rows with dependencies. Do not create a task file until work starts.
7. Keep the documentation PR Draft until the PO reviews and explicitly authorizes Ready/merge.

## Reconciliation rules

At every merge and whenever the PO asks, compare REGISTER with GitHub PRs, branches, changed files and CI. Record discrepancies before corrections. If evidence is unavailable, preserve [UNV]; do not guess dates, PR numbers, approvals, actors, methods, or CI outcomes.
