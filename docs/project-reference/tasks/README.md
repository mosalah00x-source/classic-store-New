# Task register system

**Repository:** `mosalah00x-source/classic-store-New`  
**Canonical documentation branch:** `docs/project-reference`  
**PR #31 base:** `BackendApp`  
**Application PR bases:** frontend work targets `FrontendApp`; backend/database work targets `BackendApp`.

## Purpose and source of truth

This directory is the canonical task system: one register grouped by domain, one detailed record for each task that has started, and an append-only reconciliation log. GitHub is authoritative for PR state, branches, SHAs, changed files, workflow runs and merge metadata. Explicit PO approval is recorded only when an approval artifact exists. V4/V5 and older `docs/tasks/` records are historical/source material, not substitutes for current GitHub evidence.

The documentation PR targets `BackendApp` because the project-reference documentation is maintained on this branch and the backend workflow's required checks are configured for documentation changes targeting that base. This does **not** mean frontend application work targets BackendApp: frontend implementation PRs target `FrontendApp`, while backend/database PRs target `BackendApp`.

## Files

- [REGISTER.md](./REGISTER.md) — master register, grouped by domain.
- [RECONCILIATION-LOG.md](./RECONCILIATION-LOG.md) — append-only comparison against GitHub.
- [_TEMPLATE.md](./_TEMPLATE.md) — detailed task-record template.
- [PR #4 migrations](./PR-04-migrations.md) — historical DB migration task record.
- [PR #22–#30](./PR-22.md) through [PR-30](./PR-30.md) — frontend implementation and fix records.
- [PR #31 / DOC-01](./PR-31-DOC-01.md) — current documentation PR.
- [PR #32 / CI-01](./PR-32.md) — merged workflow path-filter fix.
- [ADM Epic](./ADM-EPIC.md) — ADM-1 through ADM-8 roadmap record.
- [DOC-02](./DOC-002-tasks-system.md) — this register-system task.

## Stable task statuses

Use only: `Planned`, `In progress`, `In review`, `Merged`, `Done`, `Blocked`, `Deferred`, `Cancelled`.

Normal flow: `Planned → In progress → In review → Merged → Done`. A PR that is open is `In review`; a merged PR is at least `Merged`. Do not mark a task `Done` until all conditions below have evidence.

### Definition of Done

A task may become `Done` only when all are true:
1. Its PR is merged.
2. CI succeeded on the exact Merge SHA (not merely the PR Head SHA).
3. The task documentation is complete.
4. Explicit PO approval is recorded with a link.
5. Visual QA is `Not required` or `Passed`.

Otherwise retain `Merged`, even if the implementation is merged and Head CI passed.

## Record and evidence conventions

- Every task that has started gets one file from [_TEMPLATE.md](./_TEMPLATE.md). Planned tasks stay as register rows until work starts.
- One file per cross-domain Epic (for example ADM); phases are linked from the Epic and appear in their relevant domain tables.
- Preserve old identifiers in `Legacy ID`; do not silently rename references.
- `[GH]`: independently verified from GitHub or the checked-out source files, with exact SHA/URL.
- `[PO]`: explicit product-owner decision or approval artifact.
- `[USER]`: user-confirmed fact not independently verified on GitHub.
- `[UNV]`: evidence unavailable or not independently confirmed. Do not infer.
- A Head CI run and a Merge-SHA push CI run are separate fields.
- For merge actor/method, inspect the GitHub PR Timeline. If the available GitHub interface does not expose the event, keep it `[UNV]`; do not infer from the account that authored the PR.
- Visual QA records the actual captures, URL, locale, theme, viewport, DPR and zoom. CI is not visual evidence.

## Close-out protocol after every merge

1. Open a small documentation PR updating the task file and its row in REGISTER.
2. Re-read live GitHub PR metadata, changed-file list, Head/Merge SHAs, merge time, Timeline, reviews/comments and CI runs.
3. Record task follow-ups as new register rows with dependencies.
4. Keep status at `Merged` until the Definition of Done is evidenced.
5. The documentation PR itself requires PO review and approval; do not merge it or mark it Ready without explicit instruction.

## Reconciliation protocol

Run a reconciliation after every merge and whenever the PO asks. Compare REGISTER with live GitHub PRs, branches, changed files, merge SHAs and CI. Append the date, scope, discrepancies and corrections to [RECONCILIATION-LOG.md](./RECONCILIATION-LOG.md). Never silently rewrite a mismatch: record it first, then correct the register. Keep prior log entries intact.

## Related indexes

- [Project documentation index](../../README.md)
- [Project-reference index](../README.md)
- [Older PR task notes](../../tasks/README.md) — retained as historical records; this directory is now canonical.
