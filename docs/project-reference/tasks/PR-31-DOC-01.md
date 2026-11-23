# Task record — DOC-001 / PR #31

- **Legacy ID:** DOC-01
- **Title:** Project reference documentation and completion audit
- **Domain:** Documentation
- **Status:** In review
- **Repository:** mosalah00x-source/classic-store-New
- **Docs branch:** docs/project-reference

## GitHub evidence [GH]

| Field | Value |
|---|---|
| PR | [#31](https://github.com/mosalah00x-source/classic-store-New/pull/31) |
| Task branch / base | `docs/project-reference` / `BackendApp` |
| Head SHA | [LIVE PLACEHOLDER — intentionally not persisted in this self-referential record; read current PR #31 metadata] |

| Merge SHA | [NOT MERGED — no Merge SHA exists yet] |
| Merged by / method | [NOT MERGED — DOC-03 will record the Timeline actor and merge strategy after merge] |
| State | Open, Draft; not merged (read live metadata at review time) |
| Head CI | [LIVE PLACEHOLDER — record only the exact-current-Head run after the final PR #31 commit] |

| Merge-SHA CI | [NOT APPLICABLE UNTIL MERGE — DOC-03 will record it] |
| PO approval | Not approved; PR must remain Draft |

## Goal and scope

- **Implemented:** ADMIN-0 inventory/decisions, ADM-1 report-only plan, project-reference docs, V5 report, local visual review guide, open-items and tech-debt records, CI-01 workflow synchronization and canonical task-register expansion under DOC-02.
- **Not implemented:** Backend/admin code, schema/migrations, dependencies, frontend environment file ENV-01, cloud deployment, visual screenshot capture or PO approval.
- **Scope guard:** documentation-only additions/updates under `docs/`; the single workflow path-filter sync was already part of DOC-01's original scope. No application source changes are authorized.

## Decisions

- PR #31 base remains BackendApp to run required backend documentation checks; frontend implementation PRs target FrontendApp.
- PR remains Draft until PO reviews the canonical task files and explicitly approves any state change.
- ADM-1 remains a plan only.

## Changed files

See the live PR #31 changed-file list. This record is included in that list; its own commit necessarily advances the PR Head. Do not persist a final Head SHA in this self-referential record.

## Database / API

No database migrations, tables, seeds, OpenAPI paths or API fields are changed by DOC-01/DOC-02 documentation work.

## Tests

| Test / workflow | Result | Exact SHA / Run |
|---|---|---|
| Backend CI | New Head check required after this record update | Current latest Head and matching workflow run must be confirmed after this record update |

## Visual QA

- **Status:** Not required for documentation-only work; separate storefront visual gates remain open in FE records.
- **Captured:** None as part of this documentation PR.
- **Not captured:** Not applicable to docs content.

## Issues and lessons

The repository had detailed legacy notes under `docs/tasks/`. DOC-02 established `docs/project-reference/tasks/` as the only source of truth and converted the old PR-22…PR-30 files into short compatibility redirects without deleting any path.

## Open items and follow-up tasks

- Recheck 3/3 CI on the exact live PR Head at final PO review; do not copy an earlier Head/run into this record.
- DOC-03: after PR #31 merges, open a small documentation PR to record the final Merge SHA, Merge-SHA push CI, merge actor/method and explicit PO approval artifact.
- PO review required before Ready or merge.
- ENV-01 remains a separate follow-up.

## Claim verification

| Claim | Evidence | Tag | Verified date |
|---|---|---|---|
| PR open/Draft/base | Live PR #31 metadata | [GH] | 2026-11-23 |
| PO approval/state transition | No approval supplied | [UNV] | 2026-11-23 |

## Review stamps

- Reviewed by ChatGPT on 2026-11-23 against live PR #31 metadata and changed-file list; result: still Draft/open. Exact current Head CI must be read live at final review.
- Approved by PO: [UNV].
