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
| Head SHA at initial review | `5da1c20a265c527375c932a9aa29241b9d4eac0b` |
| Merge SHA | Not merged |
| Merged at / by / method | Not applicable |
| Historical Head CI: Run #115 / `45155049507` — success 3/3 on exact `96c8648ab5b7f3143149297e0b6f0ffae70b99af`; Run #116 / `45156874912` was started on `5da1c20a265c527375c932a9aa29241b9d4eac0b` and was still in progress at the first recorded check. Current DOC-02 Head requires a fresh run. |
| Merge-SHA CI | Not applicable |
| PO approval | Not approved; PR remains Draft |

## Goal and scope

Create the canonical task system at `docs/project-reference/tasks/`: README, grouped register, append-only reconciliation log, template, detailed records for started tasks, and ADM Epic record. Link the system from both documentation indexes and preserve legacy IDs.

## Implemented

- Added the cross-domain register, template and append-only reconciliation protocol; verified and retained the existing canonical task records PR-22.md through PR-30.md.
- Retained the existing PR-31-DOC-01.md, DOC-002-tasks-system.md and ADM-EPIC.md records; added PR-32.md and PR-04-migrations.md.
- Recorded all known task Head/Merge SHAs, changed files, Head CI runs, and explicit evidence gaps.
- Registered planned work by domain, including B1–B7 as named in V4, V1–V7 migration inventory, ADM roadmap, CI/OPS, security, QA and DOC work.
- Recorded initial reconciliation and corrected stale CI-01 / PR #31 validation claims.

## Not implemented / reason

No application code, Backend code, DB schema/migrations, dependencies, environment file, cloud infrastructure or workflow behavior changed. DOC-02 is documentation-only and remains within the existing Draft PR #31.

## Decisions

- PR #31 targets BackendApp because documentation PRs use the backend workflow check contexts; frontend implementation PRs target FrontendApp.
- `docs/project-reference/tasks/` is canonical. Existing `docs/tasks/` records are retained as historical/source notes.
- No task is marked Done solely because it is merged or has successful Head CI.

## Changed files

- `docs/project-reference/tasks/**`
- `docs/project-reference/README.md`
- `docs/README.md`
- `docs/project-reference/open-items.md`
- `docs/project-reference/tech-debt.md`

## Database / API

None.

## Tests

| Test / workflow | Result | Exact SHA / Run |
|---|---|---|
| Backend CI | Pending final head check | Latest DOC-02 Head / run to be recorded after final commit |

## Visual QA

- **Status:** Not required for documentation-only task.
- **Captured:** Not applicable.
- **Not captured:** Not applicable.

## Issues and lessons

The repository already had detailed canonical task records in `docs/project-reference/tasks/` and compatibility records in `docs/tasks/`, but no cross-domain grouped register or append-only reconciliation protocol. The prior open-items/tech-debt text also contained stale CI run status and did not reflect the latest verified Run #115 and Merge-SHA Run #110. Reconciliation must explicitly record and correct such drift.

## Open items and follow-up tasks

- Verify final PR #31 Head CI is 3/3 after the final commit.
- PO must review the task README, REGISTER, and representative task records before changing PR state.
- Visual QA for F3, BN, F4 and #30 remains open.

## Claim verification

| Claim | Evidence | Tag | Verified date |
|---|---|---|---|
| PR #31 open/Draft and current Head | Live PR metadata | [GH] | 2026-11-23 |
| PR #22–#30 and #32 merged with recorded SHAs | Live PR metadata | [GH] | 2026-11-23 |
| Head CI results for PR #22–#30/#32 | Workflow runs on exact Head SHAs | [GH] | 2026-11-23 |
| PR #32 Merge-SHA CI 3/3 | Push Run #110 on exact Merge SHA | [GH] | 2026-11-23 |
| PO approval of DOC-02 / PR #31 | Not supplied | [UNV] | 2026-11-23 |

## Review stamps

- Reviewed by ChatGPT on 2026-11-23 against live GitHub PR metadata, changed-file lists and workflow runs; result: task system created, final CI on updated head remains to be checked.
- Approved by PO: [UNV].
