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
| Audit-start Head | `5da1c20a265c527375c932a9aa29241b9d4eac0b` |
| Latest checkpoint before this record update | `fb727a2281b3c68c01bfd59c739ed0cb2af98de7` |
| Merge SHA | Not merged |
| State | Open, Draft |
| Latest checkpoint CI | Run #135 / `45158132139` — queued/in progress on exact checkpoint SHA when inspected |
| Merge-SHA CI | Not applicable |
| PO approval | Not approved; PR remains Draft |

## Goal and scope

Create and maintain the canonical task system at `docs/project-reference/tasks/`: README, grouped register, append-only reconciliation log, template, detailed records for started tasks, and ADM Epic record. Link the system from both documentation indexes and preserve legacy IDs.

## Implemented

- Added detailed records under this directory for PRs #22–#30 and PR #31/DOC-01; refreshed PR #32/CI-01 with exact Merge-SHA Run #110 evidence.
- Added ADM Epic and DOC-02 records, standardized the task template, expanded the task README and linked the canonical system from both documentation indexes.
- Recorded planned work by domain, including B1–B7 as named in V4, V1–V7 migration inventory, ADM roadmap, CI/OPS, security, QA and DOC work.
- Added initial reconciliation and documented corrections for stale CI-01 and PR #31 validation claims.

## Not implemented / reason

No application code, Backend code, DB schema/migrations, dependencies, environment file, cloud infrastructure or workflow behavior changed. DOC-02 is documentation-only and remains within Draft PR #31.

## Decisions

- PR #31 targets BackendApp because documentation PRs use backend workflow check contexts; frontend implementation PRs target FrontendApp.
- `docs/project-reference/tasks/` is canonical. Existing `docs/tasks/` records remain as historical/source notes.
- No task is marked Done solely because it is merged or has successful Head CI.

## Changed files

- `docs/project-reference/tasks/**`
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

- Verify final PR #31 Head CI is 3/3 after the final commit.
- PO must review the task README, REGISTER and representative task records before any Ready transition.
- Visual QA for F3, BN, F4 and #30 remains open.

## Claim verification

| Claim | Evidence | Tag | Verified date |
|---|---|---|---|
| PR #31 open/Draft and checkpoint Head | Live PR metadata | [GH] | 2026-11-23 |
| PR #22–#30 and #32 merged with recorded SHAs | Live PR metadata | [GH] | 2026-11-23 |
| Head CI results PR #22–#30/#32 | Workflow runs on exact Head SHAs | [GH] | 2026-11-23 |
| PR #32 Merge-SHA CI 3/3 | Push Run #110 on exact Merge SHA | [GH] | 2026-11-23 |
| PO approval of DOC-02 / PR #31 | Not supplied | [UNV] | 2026-11-23 |

## Review stamps

- Reviewed by ChatGPT on 2026-11-23 against live GitHub PR metadata, changed-file lists and workflow runs; result: task system created, final CI on latest Head pending.
- Approved by PO: [UNV].
