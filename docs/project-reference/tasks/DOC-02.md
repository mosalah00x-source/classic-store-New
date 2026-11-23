# Task record — DOC-002 / DOC-02

- **Legacy ID:** DOC-02
- **Title:** Cross-domain task register, task template and GitHub reconciliation protocol
- **Domain:** Documentation
- **Status:** In progress; included in PR #31 Draft
- **Repository:** mosalah00x-source/classic-store-New
- **Docs branch:** docs/project-reference

## GitHub context

- PR: [#31 — DOC-01 project reference](https://github.com/mosalah00x-source/classic-store-New/pull/31)
- Task branch: docs/project-reference; base: BackendApp.
- Starting Head before DOC-02: 96c8648ab5b7f3143149297e0b6f0ffae70b99af.
- New Head and CI: [pending final live verification].
- Merge SHA: Not applicable; PR remains Draft/open/unmerged.
- PO approval: Pending; this task does not authorize Ready or merge.

## Goal and scope

Implement the missing task system inside docs/project-reference/tasks: cross-domain REGISTER, one shared task template, append-only RECONCILIATION-LOG, task records for merged PR #32 and migration PR #4, plus an active PR #31 record and index updates.

## Changed files

- docs/project-reference/tasks/README.md
- docs/project-reference/tasks/REGISTER.md
- docs/project-reference/tasks/RECONCILIATION-LOG.md
- docs/project-reference/tasks/_TEMPLATE.md
- docs/project-reference/tasks/PR-04-migrations.md
- docs/project-reference/tasks/PR-22.md through PR-30.md (standard ID/legacy/repository metadata)
- docs/project-reference/tasks/PR-31.md
- docs/project-reference/tasks/PR-32.md
- docs/project-reference/tasks/DOC-02.md
- docs/README.md
- docs/project-reference/README.md
- docs/reports/CLASSICSTORE_PROJECT_SUMMARY_AND_IMPLEMENTATION_REPORT_V5.md
- docs/project-reference/open-items.md
- docs/project-reference/tech-debt.md

## Database / API / visual QA

- No database, migrations, API contract or application source changes.
- Visual QA: Not required for docs.

## Reconciliation findings

- PR #22–#30 are merged; their Head CI runs pass on exact Head SHAs. Merge-SHA CI remains [UNV].
- PR #32 is merged; Push Run #110 passed all three jobs on exact Merge SHA.
- PR #31 pre-DOC-02 Head Run #115 passed 3/3; new Head must be rechecked.
- Explicit PO approval was found for PR #27. PR #26 comments explicitly required Draft pending theme-flash measurement; no approval to merge was found. Other PR approvals remain [UNV] or are explicitly absent as recorded in REGISTER.
- V4's old PR #28 state is historical and superseded by live GitHub metadata.

## Open items

- Re-run CI on final PR #31 Head.
- Verify no task has been marked Done without all five gates.
- PO review of README, REGISTER and task records before any Ready transition.
- Continue visual QA tasks and ENV-01 separately.

## Claim verification

| Claim | Evidence | Tag | Verified |
|---|---|---|---|
| PR #32 merge and Merge-SHA CI | Run #110, jobs 3/3 on exact SHA | [GH] | 2026-11-23 |
| PR #22–#30 merge metadata | Live PR metadata | [GH] | 2026-11-23 |
| Head CI #22–#30 | Exact SHA-associated runs | [GH] | 2026-11-23 |
| PR #31 previous Head CI | Run #115, 3/3 on 96c8648… | [GH] | 2026-11-23 |
| Final Head CI | Pending | [UNV] | 2026-11-23 |

## Review stamps

- Reviewed by ChatGPT on 2026-11-23 against GitHub PR metadata, PR changed-file lists, workflow runs, existing docs and BackendApp migration files; result: initial reconciliation recorded, final Head CI pending.
- Approved by PO: [UNV].
