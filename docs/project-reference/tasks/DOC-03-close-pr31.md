# Task record — DOC-005 / DOC-03

- **Legacy ID:** DOC-03
- **Title:** Close out merged PR #31 and reconcile documentation branch lifecycle
- **Domain:** Documentation
- **Status:** In review
- **Repository:** mosalah00x-source/classic-store-New
- **Branch:** `docs/doc-03-close-pr31`
- **Base:** `BackendApp`

## Goal and scope

Record the final PR #31 Head and Merge SHAs, independently verified Head and Merge-SHA CI, merge Timeline actor/method evidence, current PO approval and Visual QA status, follow-up items, and a report-only assessment of the old `docs/project-reference` branch.

This PR changes documentation only. It does not delete branches, alter application code, change workflows, or implement ADM-1.

## PR #31 close-out evidence [GH]

- PR: [#31](https://github.com/mosalah00x-source/classic-store-New/pull/31)
- Final Head SHA: `4ecba73a4a403ce8ef41342c87267a9ce1ea8060`
- Merge SHA: `67dbd343185742c30ecb5d65eca939bd0efb9d68`
- Merged actor: `mosalah00x-source`
- Merged event: [Timeline event 37003224078](https://github.com/mosalah00x-source/classic-store-New/issues/events/37003224078)
- Merge strategy: [UNV] — not exposed by the inspected metadata.
- Head CI: [Run #185 / 45168530591](https://github.com/mosalah00x-source/classic-store-New/actions/runs/45168530591), 3/3 success on exact Head SHA.
- Merge-SHA CI: [Run #186 / 45169011839](https://github.com/mosalah00x-source/classic-store-New/actions/runs/45169011839), 3/3 success on exact Merge SHA. All steps in `verify migrations`, `api-lint` and `backend` completed successfully.

## PO approval and Visual QA

At the time of this review, PR #31 has no issue comments and no submitted reviews. Therefore:
- PO approval remains Pending / [UNV].
- F3, BN, F4 and #30 Visual QA remain Pending in the register until the PO posts the specified comment and evidence links.
- Do not infer approval from the merge event or from this chat message.

## DOC-BRANCH — report only

### Current facts

- The branch `docs/project-reference` still exists after PR #31 merged.
- PR #31 was merged into `BackendApp`; the current `BackendApp` ref points to Merge SHA `67dbd343185742c30ecb5d65eca939bd0efb9d68`.
- The task-system README calls `docs/project-reference` the canonical documentation branch. The register header and the PR #31 task record also refer to it.
- The canonical task files are now present on `BackendApp`; DOC-03 and later documentation changes can use short-lived branches created from current `BackendApp`.
- A GitHub code-search query for the exact branch path returned zero results but was marked incomplete. This is not proof that no additional references exist. No workflow dependency on the branch name has been established by this search.

### Trade-offs

**Keep the merged branch**
- Pros: preserves the familiar canonical branch name and may match existing links or contributor expectations.
- Cons: it is now a long-lived branch that will drift from `BackendApp`; future work must repeatedly synchronize it, increasing stale-base and accidental-branch-target risk.

**Delete it after explicit approval**
- Pros: encourages each docs PR to start from the current `BackendApp` and use a short-lived branch; reduces stale-branch confusion.
- Cons: any remaining external links, automation, local clones or contributor instructions that assume the branch exists would need updating; GitHub's branch deletion is not a substitute for checking those references.

### Recommendation

Prefer deleting `docs/project-reference` after the reference inventory is complete and the PO explicitly approves. Keep `BackendApp` as the maintained source for canonical documentation; create short-lived branches such as `docs/doc-04-...` from its latest head for each subsequent docs PR. This is a recommendation only. **No branch deletion is performed by DOC-03.**

## Other open follow-ups

- **FE-home-categories-limit:** keep the eight-card cap as the proposed decision and prepare a PR description for a “عرض كل التصنيفات” link to `/products`. Do not implement until the PO explicitly confirms.
- **A11Y-input-borders:** report-only contrast inventory for every input/control border in light and dark themes; recommend a dedicated ≥3:1 token while retaining subtle decorative card borders. No CSS changes.
- **BN-desktop-verify:** desktop viewport not verified. Mobile evidence (390px and 844px) must not be generalized to desktop.
- **ENV-01:** separate Draft PR on `FrontendApp`.
- **F8:** separate Draft PR on `FrontendApp`.
- **ADM-1:** report-only plan; no implementation without separate written PO approval.

## Definition of Done

- PR merged.
- CI success on exact Merge SHA.
- Documentation and evidence links complete.
- Explicit PO approval comment/review linked.
- Visual QA either Not required or Passed with the required evidence metadata.

Until all applicable gates are satisfied, retain status `Merged` for PR #31 and do not mark DOC-01 Done.
