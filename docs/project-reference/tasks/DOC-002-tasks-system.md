# Task record — DOC-002 / DOC-02

- **Legacy ID:** DOC-02
- **Title:** Canonical tasks register, task records and GitHub reconciliation protocol
- **Domain:** Documentation
- **Status:** In review
- **Repository:** mosalah00x-source/classic-store-New
- **Docs branch:** docs/project-reference

## GitHub evidence

| Field | Value |
|---|---|
| PR | [#31 — DOC-01](https://github.com/mosalah00x-source/classic-store-New/pull/31) |
| Task branch / base | `docs/project-reference` / `BackendApp` |
| Head SHA | [LIVE PLACEHOLDER — read current PR #31 metadata; do not persist a self-referential final Head] |

| Merge SHA | [NOT MERGED — DOC-03 will record after merge] |
| Merged by / method | [NOT MERGED — DOC-03 will record the Timeline actor and merge strategy after merge] |
| State | Open, Draft |
| Head CI | [LIVE PLACEHOLDER — exact-current-Head check must be read after the final DOC-02 commit] |
| Merge-SHA CI | Not applicable |
| PO approval | Not approved; PR remains Draft |

## Goal and scope

Create and maintain the canonical task system at `docs/project-reference/tasks/`: README, grouped register, append-only reconciliation log, template, detailed records for started tasks, and ADM Epic record. Link the system from both documentation indexes and preserve legacy IDs.

## Implemented

- Added detailed records under this directory for PRs #22–#30 and PR #31/DOC-01; refreshed PR #32/CI-01 with exact Merge-SHA Run #110 evidence.
- Converted all nine legacy `docs/tasks/PR-22.md`…`PR-30.md` files into short redirects. The legacy `docs/tasks/README.md` already served as a compatibility index; no legacy file was deleted.
- Verified frontend push CI on exact Merge SHAs for PRs #22–#30; exact Run IDs are recorded in each canonical record and FE register row.
- Added DOC-03 as a planned post-merge close-out task.
- Added ADM Epic and DOC-02 records, standardized the task template, expanded the task README and linked the canonical system from both documentation indexes.
- Recorded planned work by domain, including B1–B7 as named in V4, V1–V7 migration inventory, ADM roadmap, CI/OPS, security, QA and DOC work.
- Added initial reconciliation and documented corrections for stale CI-01 and PR #31 validation claims.

## Not implemented / reason

No application code, Backend code, DB schema/migrations, dependencies, environment file, cloud infrastructure or workflow behavior changed. DOC-02 is documentation-only and remains within Draft PR #31.

## Decisions

- PR #31 targets BackendApp because documentation PRs use backend workflow check contexts; frontend implementation PRs target FrontendApp.
- `docs/project-reference/tasks/` is canonical. Existing `docs/tasks/` paths remain only as short compatibility redirects; the project-reference directory is the sole maintained source of truth.
- No task is marked Done solely because it is merged or has successful Head CI.

## Changed files

- `docs/project-reference/tasks/**`
- `docs/tasks/README.md` and `docs/tasks/PR-22.md`…`PR-30.md` (compatibility redirects)
- `docs/project-reference/README.md`
- `docs/README.md`
- `docs/project-reference/open-items.md`
- `docs/project-reference/tech-debt.md`
- `docs/reports/CLASSICSTORE_PROJECT_SUMMARY_AND_IMPLEMENTATION_REPORT_V5.md`

## Database / API

None.

## Tests

| Test / workflow | Result | Exact SHA / Run |
|---|---|---|
| Backend CI | Final Head validation pending | Recheck latest PR Head after this commit |

## Visual QA

- **Status:** Not required for documentation-only task.
- **Captured:** Not applicable.
- **Not captured:** Not applicable.

## Issues and lessons

The branch contained legacy task notes under `docs/tasks/` and an existing partial `REGISTER.md`; the new system extends rather than silently replaces them. The initial reconciliation log now records that correction.

## Open items and follow-up tasks

- Verify PR #31 Head CI 3/3 on the exact live Head at final review; no old Head result is treated as current.
- DOC-03 must update the PR #31 self-record after merge with final Merge SHA and Merge-SHA CI.
- PO must review the task README, REGISTER and representative task records before any Ready transition.
- Visual QA for F3, BN, F4 and #30 remains open.

## DOC-02 requirements compliance matrix (sections 1–9)

| # | Requirement | Evidence location | Result | Notes / remaining gap |
|---:|---|---|---|---|
| 1 | Canonical folder structure | `README.md` § Folder structure and canonical files; repository tree `docs/project-reference/tasks/` | Present | Canonical README, REGISTER, log, template, PR records, ADM Epic and DOC records are listed. |
| 2 | Task IDs and naming conventions | `README.md` § Naming convention; `REGISTER.md` domain tables; each detailed record ID/Legacy ID header | Present | PR-bound tasks use `PR-NN.md`; PR-specific workstreams use `PR-NN-<TASK-ID>.md`; multi-PR work uses `<ID>-<slug>.md`; epics use `<EPIC-ID>.md`. |
| 3 | Controlled statuses | `README.md` § Stable task statuses and Definition of Done; `REGISTER.md` § Status and field rules | Present | Eight statuses are enumerated. `Done` requires exact Merge-SHA CI, complete docs, direct PO approval link and Visual QA Not required/Passed. |
| 4 | Required register columns | `README.md` § Register columns and evidence conventions; `REGISTER.md` tables FE/BE/DB/OPS/SEC/QA/DOC | Present | Includes identity, scope, status, PR, Merge SHA, Merge CI Run ID, Visual QA, PO approval, dependencies, task link and last checked. |
| 5 | Standard detailed task template | `_TEMPLATE.md`; canonical PR-22…PR-32 and PR-04 records | Present | Includes GitHub evidence, scope, decisions, changed files, DB/API, tests, Visual QA, issues, follow-ups, claim verification and review stamps. |
| 6 | Close-out protocol | `README.md` § Close-out protocol after every merge | Present | Requires a small docs PR, fresh live metadata/Timeline/CI review, follow-up rows and Merged until every Done gate closes. |
| 7 | Periodic reconciliation | `README.md` § Periodic reconciliation protocol; `RECONCILIATION-LOG.md` | Present | Append-only discrepancy/correction log; reconcile after every merge and on PO request. |
| 8 | Initial seed/population | `README.md` § Seed / initial population; `REGISTER.md` domain tables; PR-04, PR-22…PR-32 and ADM Epic records | Present | Seeds existing PR history, V1–V7, ADM roadmap and planned FE/BE/DB/OPS/SEC/QA/DOC rows; planned tasks remain rows until started. |
| 9 | PR #31-specific requirements | `PR-31-DOC-01.md`; live PR #31 metadata/Files changed; `README.md` self-record rule | Partially present | PR remains Draft/open; self-record has Head/Merge placeholders; no application source or ADM-1 implementation. Final exact-Head CI must be rechecked after this final commit and PO review is still pending. |

The matrix reports evidence as it exists on this branch; it does not imply PO acceptance or completion of PR #31.

## Claim verification

| Claim | Evidence | Tag | Verified date |
|---|---|---|---|
| PR #31 open/Draft and checkpoint Head | Live PR metadata | [GH] | 2026-11-23 |
| PR #22–#30 and #32 merged with recorded SHAs | Live PR metadata | [GH] | 2026-11-23 |
| Exact Merge-SHA push CI for PR #22–#30 | Runs 44118235141, 44099650247, 44289634885, 44317304438, 45021255892, 45026797029, 45035234113, 45038732812, 45041317755; each job frontend success on matching Merge SHA | [GH] | 2026-11-23 |
| Legacy PR notes converted to redirects | Current docs/tasks files on docs/project-reference | [GH] | 2026-11-23 |
| PR #29/#30 merged actor | PR metadata and Timeline merged events | [GH] | 2026-11-23 |
| Head CI results PR #22–#30/#32 | Workflow runs on exact Head SHAs | [GH] | 2026-11-23 |
| PR #32 Merge-SHA CI 3/3 | Push Run #110 on exact Merge SHA | [GH] | 2026-11-23 |
| PO approval of DOC-02 / PR #31 | Not supplied | [UNV] | 2026-11-23 |

## Review stamps

- Reviewed by ChatGPT on 2026-11-23 against live GitHub PR metadata, changed-file lists and workflow runs; result: canonical task system and redirects implemented; PR #31 final exact-Head CI and PO review remain pending.
- Approved by PO: [UNV].
