# Task register system

**Repository:** `mosalah00x-source/classic-store-New`  
**Canonical documentation base:** `BackendApp`  
**Legacy merged docs branch:** `docs/project-reference` (retained pending PO deletion decision)  
**PR #31 base:** `BackendApp`  
**Application PR bases:** frontend work targets `FrontendApp`; backend/database work targets `BackendApp`.

## Purpose and single source of truth

`docs/project-reference/tasks/` is the **only current source of truth** for task status, scope, dependencies, PR evidence, CI, PO approval and Visual QA. `REGISTER.md` is the master status index; each started task has one canonical detailed record; `RECONCILIATION-LOG.md` is append-only. GitHub is authoritative for live PR state, branches, SHAs, changed files, workflow runs, merge metadata and Timeline events.

`docs/tasks/` is a compatibility-only path. Its README and PR-22…PR-30 files are short redirects to the canonical records; they must not contain independently maintained task status or evidence. V4/V5 reports remain historical snapshots, not status sources.

The canonical task records are maintained on `BackendApp`. Frontend implementation PRs target `FrontendApp`; however, updates to frontend task records are documentation-only PRs created from the latest `BackendApp` and merged back into `BackendApp`. Backend/database implementation PRs also target `BackendApp`. Use a new short-lived docs branch for each documentation update; do not continue development on a stale merged docs branch.

## Folder structure and canonical files

- [REGISTER.md](./REGISTER.md) — master register grouped by FE, BE, DB, OPS, SEC, QA and DOC.
- [RECONCILIATION-LOG.md](./RECONCILIATION-LOG.md) — append-only GitHub reconciliation and discrepancy history.
- [_TEMPLATE.md](./_TEMPLATE.md) — detailed task-record template.
- [PR-04-migrations.md](./PR-04-migrations.md) — DB migration inventory V1–V7.
- [PR-22.md](./PR-22.md), [PR-23.md](./PR-23.md), [PR-24.md](./PR-24.md), [PR-25.md](./PR-25.md), [PR-26.md](./PR-26.md), [PR-27.md](./PR-27.md), [PR-28.md](./PR-28.md), [PR-29.md](./PR-29.md), [PR-30.md](./PR-30.md) — frontend PR task records.
- [PR-31-DOC-01.md](./PR-31-DOC-01.md) — PR #31 close-out record with final Head/Merge SHAs and exact CI evidence.
- [DOC-03-close-pr31.md](./DOC-03-close-pr31.md) — DOC-03 close-out and report-only documentation-branch lifecycle assessment.
- [ENV-01.md](./ENV-01.md) — ENV-01 frontend environment example PR #34.
- [F8-safe-api-json.md](./F8-safe-api-json.md) — F8 safe API JSON handling PR #35.
- [PR-32.md](./PR-32.md) — merged CI-01 workflow path-filter fix.
- [ADM-EPIC.md](./ADM-EPIC.md) — cross-domain ADM-0 through ADM-8 roadmap.
- [DOC-002-tasks-system.md](./DOC-002-tasks-system.md) — DOC-02 task-system implementation and compliance matrix.
- DOC-03 — post-merge close-out of PR #31; tracked in [DOC-03-close-pr31.md](./DOC-03-close-pr31.md).

## Naming convention

- A task implemented by one application PR uses `PR-NN.md` (for example `PR-29.md`).
- When one documentation PR contains a separately tracked workstream, use `PR-NN-<TASK-ID>.md` (for example `PR-31-DOC-01.md`).
- A task spanning multiple PRs, or a started task not yet represented by a single PR, uses `<ID>-<slug>.md` (for example `DOC-002-tasks-system.md`). That file is the master task record; it links each contributing `PR-NN.md` evidence record. The register links to the master task record, so status is maintained once.
- A cross-domain epic uses `<EPIC-ID>.md` (for example `ADM-EPIC.md`).
- Planned tasks remain register rows without a detailed file until work starts. Every started task must have one canonical file and a link from REGISTER.
- Preserve prior names in the `Legacy ID` field; do not rename historical identifiers silently.

## Stable task statuses

Use only: `Planned`, `In progress`, `In review`, `Merged`, `Done`, `Blocked`, `Deferred`, `Cancelled`.

Normal flow: `Planned → In progress → In review → Merged → Done`. An open PR is `In review`; a merged PR is at least `Merged`. Blocked, Deferred and Cancelled require a short reason and date in the register/reconciliation log.

### Definition of Done

A task may become `Done` only when all are true:
1. Its PR is merged.
2. CI succeeded on the exact Merge SHA (not merely the PR Head SHA).
3. The task documentation is complete and all required links resolve.
4. Explicit PO approval is recorded with a direct link to the PO's approval comment or submitted review; a PR description, merge event or later user confirmation is not approval.
5. Visual QA is `Not required` or `Passed`. `Passed` requires PO-provided screenshot evidence and the recorded URL, locale, theme, viewport, DPR and zoom.

Otherwise retain `Merged`, even if implementation is merged and Head/Merge CI passed. Never mark a task `Done` while its Visual QA is `Pending`.

## Register columns and evidence conventions

The domain tables use: `ID`, `Legacy ID`, `Title / scope`, `Status`, `PR`, `Merge SHA`, `CI on Merge (Run ID)`, `Visual QA`, `PO approval`, `Dependencies`, `Task file`, `Last checked`. The detailed task record separates Head CI from Merge-SHA push CI.

- `[GH]`: independently verified from GitHub or checked-out source, with exact SHA/URL.
- `[PO]`: explicit product-owner decision or approval artifact, linked directly.
- `[USER]`: user-confirmed fact not independently verified on GitHub; not a substitute for PO approval.
- `[UNV]`: evidence unavailable or not independently confirmed. Explain the search/limitation; do not infer.
- For merge actor/method, inspect the GitHub PR Timeline and link the Timeline page/event. Record the actor separately from the merge strategy. If the strategy is not exposed, write `[UNV]`.
- A Head CI run and a Merge-SHA push CI run are separate evidence fields. Match each run's `head_sha` to the exact SHA being documented.
- Visual QA records actual captures; CI is not visual evidence.

## Close-out protocol after every merge

1. Open a small documentation PR updating the task file and its row in REGISTER.
2. Re-read live PR metadata, changed-file list, Head/Merge SHAs, merge time, merged actor, Timeline, reviews/comments and CI runs.
3. Record follow-up tasks as new register rows with dependencies.
4. Keep status at `Merged` until every Definition of Done gate is evidenced.
5. The documentation PR itself requires PO review and explicit approval; do not merge it or mark it Ready without instruction.

## Periodic reconciliation protocol

Run reconciliation after every merge and whenever the PO asks. At minimum, periodically compare every active/merged register row against live GitHub PR state, branch/base, changed files, merge SHA, merge actor/method, issue/review comments and Head/Merge-SHA CI. Append the date, scope, evidence, discrepancies and corrections to [RECONCILIATION-LOG.md](./RECONCILIATION-LOG.md). Never silently rewrite a mismatch; preserve the earlier observation and append the correction.

## Seed / initial population

The initial register is seeded from the existing project history and approved roadmap: PR #4 / V1–V7; PR #22–#30; PR #31 / DOC-01 and DOC-02; PR #32 / CI-01; ADM-0..ADM-8; and planned FE/BE/DB/OPS/SEC/QA/DOC follow-ups. Existing legacy IDs are preserved in the Legacy ID column. Records for started PR tasks and the ADM epic are linked from REGISTER; planned work without an implementation start remains a row only.

## Related indexes

- [Project documentation index](../../README.md)
- [Project-reference index](../README.md)
- [Legacy compatibility index](../../tasks/README.md) — points back here; never update task state there.
