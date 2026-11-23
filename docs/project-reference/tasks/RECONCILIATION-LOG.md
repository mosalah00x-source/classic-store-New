# Reconciliation log

Append-only record. Never silently overwrite a contradiction. Record the observed mismatch first, then record the correction and its evidence.

## 2026-11-23 — Initial DOC-02 reconciliation

### Scope checked

- PR metadata, base/head branches, merge state, Merge SHAs and merge timestamps for PRs #22–#30 and #32.
- Changed-file lists for PRs #22–#30 and #32.
- Head workflow runs and exact Head SHA for PRs #22–#30 and #32.
- PR #22–#30 issue comments and submitted review records.
- PR #4 migration PR metadata, changed-file list, PR body and V1–V7 migration files on BackendApp.
- Current DOC-01 files on docs/project-reference: README indexes, V5, open-items, tech-debt, existing task index and PR #29/#30 records.
- PR #31 metadata and its pre-DOC-02 Head CI evidence.

### Live GitHub facts [GH]

| PR | State | Base | Head SHA | Merge SHA | Merged at UTC |
|---|---|---|---|---|---|
| #22 | Merged | FrontendApp | 576d41378a2b222eeca6db5e7316aa1f8cc9a453 | c21a089e69477bf033c0e149835ce1d6b474754a | 2026-11-17 15:46:48 |
| #23 | Merged | FrontendApp | 238906994b24d3e26c65f67d1155e6cb0bf911eb | c3734268fa3a76ff63bc20f504665198063560c7 | 2026-11-17 14:07:15 |
| #24 | Merged | FrontendApp | 3f4fccc4309000a268126578f8c3edd51c354d10 | e27f5977a12127bc52195c64700f62d82c87d815 | 2026-11-18 10:53:35 |
| #25 | Merged | FrontendApp | 62daf03803bad719eb4a6346ac109623e5406371 | dd00ddd5fb6c21800f9928662893a27b4a290d63 | 2026-11-18 13:47:25 |
| #26 | Merged | FrontendApp | b1a4d29f4f78b1cc4a69b2d7d63140b7cafe9192 | eea323cde726ef17666525bb047f4c2e093af1ac | 2026-11-22 12:14:33 |
| #27 | Merged | FrontendApp | 779b7a505e2f0e59f315eddb99c6641d129cbb20 | 896fe55515a4640c0cd36f6ba4f204afc329ebba | 2026-11-22 13:18:38 |
| #28 | Merged | FrontendApp | 6bde906fa6e703a11d46a0ca61e0b8bd2f85c455 | 8cb49280d7d0cc989ea779b71994928d8e8707c1 | 2026-11-22 14:53:06 |
| #29 | Merged | FrontendApp | 68496de44e9ecafa2c17eadbf5c0d7df80d76903 | a5d722ec74170ab02b7e121a37619f51bf6c7782 | 2026-11-22 15:30:54 |
| #30 | Merged | FrontendApp | 0f6da6c0e3a9beee757b57a634bc62b8bcc31fe0 | 666dd2151172b56f57e10b4446c63a58f5d9d7a2 | 2026-11-22 15:59:42 |
| #32 | Merged | BackendApp | fb813d866522c1f5a1cbef78643b2abca948063e | 4303bfe8941301cb1314a0805e7e0ae8c8a0c1bc | 2026-11-23 10:16:55 |

### Head CI evidence [GH]

- PR #22: Run #71 / 44103996882 — success on 576d413….
- PR #23: Run #69 / 44098093163 — success on 2389069….
- PR #24: Run #79 / 44120698612 — success on 3f4fccc….
- PR #25: Run #82 / 44290488525 — success on 62daf03….
- PR #26: Run #97 / 45018782645 — success on b1a4d29….
- PR #27: Run #107 / 45024248858 — success on 779b7a5….
- PR #28: Run #121 / 45032252636 — success on 6bde906….
- PR #29: Run #125 / 45036694118 — success on 68496de….
- PR #30: Run #128 / 45040249741 — success on 0f6da6c….
- PR #32: Run #109 / 45152356436 — success on fb813d8….

These are Head runs, not Merge-SHA runs.

### Merge-SHA CI evidence

- PR #22–#30: no PR-triggered workflow run was returned by the commit-run lookup for the exact Merge SHAs; Merge-SHA CI remains [UNV]. Do not infer Merge-SHA CI from the Head runs.
- PR #32: Push Run #110 / 45154657899 is success on exact Merge SHA 4303bfe8941301cb1314a0805e7e0ae8c8a0c1bc. The three jobs api-lint, verify migrations and backend completed/success.
- PR #31 before this DOC-02 change: Head 96c8648ab5b7f3143149297e0b6f0ffae70b99af had PR Run #115 / 45155049507 success; jobs api-lint, verify migrations and backend all success on that exact SHA. This does not validate the new DOC-02 Head.

### PO approval evidence

- PR #27: explicit PO merge approval in [comment 7079714545](https://github.com/mosalah00x-source/classic-store-New/pull/27#issuecomment-7079714545).
- PR #26: PO comments 7078707631 and 7078863065 explicitly required Draft pending theme-flash measurement and scoped screenshot concessions; neither is an explicit approval to merge. PR metadata later shows merged. Merge approval remains [UNV].
- PR #22, #23, #24, #25, #28, #29 and #30: no issue comments or submitted review records were returned in the live check. Where V5 says no approval or [UNV], retain that status; do not infer approval from merge.
- PR #32: user confirmed merge in conversation [USER]; no separate GitHub approval comment/review link captured.

### Reconciliation discrepancies and corrections

| # | Previous documentation claim | Live evidence / contradiction | Correction made |
|---|---|---|---|
| 1 | docs/tasks/README.md indexed only PR #22–#30 and called itself a PR-only log | PR #32 is merged and had no task file; no cross-domain register/template/reconciliation log existed | Added PR #32 record, cross-domain REGISTER, _TEMPLATE and this log; expanded index |
| 2 | V5 said PR #32 was awaiting review/merge and no Merge-SHA push run was established | PR #32 is merged at 10:16:55 UTC; Merge SHA 4303bfe…; Push Run #110 success 3/3 | Update V5/open-items/tech-debt to reflect merge and push evidence |
| 3 | open-items/tech-debt reported PR #31 Run #113 still in progress / latest Head unverified | Live PR #31 Head was 96c8648… and Run #115 completed success 3/3 on exact SHA | Update the CI-01 and DOC-01 status; mark new DOC-02 Head validation pending |
| 4 | V4 historical report said PR #28 was Open/Draft/not merged | Live PR #28 metadata says Merged with SHA 8cb4928… | Keep V4 unchanged as historical snapshot; V5/register are current status sources |
| 5 | Existing PR #29/#30 records did not include all standard fields and PR #32/DB migration files were absent | Template audit found missing common structure and records | Add standard template, PR #32 and PR #4 V1–V7 record; retain legacy PR #22–#30 detailed records and mark unknowns [UNV] |

### Documentation-to-source mapping (DOC-01)

| DOC-01 item / claim | Source file and section | Result |
|---|---|---|
| Current project status and PR #22–#30 | reports/CLASSICSTORE_PROJECT_SUMMARY_AND_IMPLEMENTATION_REPORT_V5.md §§1–7 | Present; CI-01 details corrected in this DOC-02 update |
| Historical V4 snapshot | reports/CLASSICSTORE_PROJECT_SUMMARY_AND_IMPLEMENTATION_REPORT_V4_2026-11-22.md | Present; historical only |
| ADMIN-0 inventory and approved decisions | project-reference/ADMIN-0.md §§3–5 | Present |
| ADM-1 implementation plan and approval gate | project-reference/ADM-1-plan.md | Present; report-only, implementation unauthorized |
| Local run and visual review | project-reference/local-development-and-visual-review.md | Present |
| Open items | project-reference/open-items.md | Present; updated for CI-01 |
| Technical debt / CI-01 | project-reference/tech-debt.md | Present; updated with Merge-SHA Run #110 |
| Per-PR task records #22–#30 | tasks/PR-22.md through tasks/PR-30.md | Present |
| PR #32 CI-01 task record | tasks/PR-32.md | Added |
| V1–V7 migration inventory | tasks/PR-04-migrations.md and BackendApp migration files | Added / present |
| Task status register and controlled vocabulary | tasks/REGISTER.md and tasks/README.md | Added / expanded |
| Task template | tasks/_TEMPLATE.md | Added |
| Reconciliation protocol and append-only evidence | tasks/README.md and tasks/RECONCILIATION-LOG.md | Added |
| OpenAPI contract | docs/api/openapi.yaml on BackendApp | Present; contract only, not proof of Controller implementation |
| Backend README consistency | backend/README.md | Not part of docs/project-reference and not reconciled here; follow-up remains |
| frontend/.env.example (ENV-01) | No file found in current DOC-01 scope | Not present; separate follow-up |
| Visual evidence for F3/BN/F4/#30 | No complete evidence package found in docs/ui-reference/evidence for these tasks | Not present / Pending; do not mark Passed |
| Screenshot acceptance records | No linked evidence for complete matrices | Not present / Pending |

### PR #31 guardrails

- PR #31 remains Draft and unmerged.
- Pre-DOC-02 Head 96c8648… had Run #115 success 3/3. A new run is required for the updated Head.
- No Ready transition, approval, merge or ADM-1 implementation is performed by this reconciliation.


## 2026-11-23 — Correction to initial task-directory inventory

The initial DOC-02 entry #5 was imprecise about where the existing task records lived. A follow-up live fetch confirmed that the canonical records PR-22.md through PR-30.md already exist under docs/project-reference/tasks/ and contain the standard evidence sections. They were not newly recreated. The older docs/tasks/ directory is a compatibility copy; its README now points to the canonical task system. The new work adds REGISTER.md, _TEMPLATE.md, RECONCILIATION-LOG.md, DOC-02.md, PR-31-DOC-01.md linkage, PR-32.md and PR-04-migrations.md, plus index and status corrections.

This correction is appended rather than silently rewriting the original observation.


## 2026-11-23 — DOC-02 canonical task system extension

### Additional live checks [GH]

- Rechecked PR #31 metadata: open, Draft, base `BackendApp`, current Head at the start of this extension `5da1c20a265c527375c932a9aa29241b9d4eac0b`; not merged.
- Rechecked PR #31 Run #116 / `45156874912` on that exact Head: `verify migrations` and `api-lint` completed successfully; `backend` was still in progress at the time of inspection. This is **not** a 3/3 pass.
- PR #32 Run #110 / `45154657899` was checked as a `push` run on exact Merge SHA `4303bfe8941301cb1314a0805e7e0ae8c8a0c1bc`; `api-lint`, `verify migrations`, and `backend` all completed successfully.
- For PRs #22–#30 and #32, the live changed-file lists were fetched. Detailed task records list the exact changed paths or identify the full returned set.
- The PR #22–#30 Head runs were fetched by exact Head SHA: #22 Run 71, #23 Run 69, #24 Run 79, #25 Run 82, #26 Run 97, #27 Run 107, #28 Run 121, #29 Run 125, #30 Run 128; all completed/success. PR #32 Head Run #109 also completed/success.

### New records and canonical path

- Created detailed records under `docs/project-reference/tasks/` for PR #22–#30 and PR #31/DOC-01; refreshed PR #32/CI-01 with the exact Merge-SHA Run #110 evidence.
- Added ADM Epic and DOC-02 task records, standardized the template, expanded the task README, and linked the canonical task register from both documentation indexes.
- Existing `docs/tasks/PR-22.md` through `PR-30.md` remain in place as historical/source notes. They were not deleted. The canonical register and task records now live under `docs/project-reference/tasks/`.

### Corrections to the preceding reconciliation entry

1. The earlier entry said no cross-domain register existed. A live fetch during this extension found an existing partial `docs/project-reference/tasks/REGISTER.md` already present in the branch. That statement was too broad. The file existed, but needed updated task detail links, current CI evidence, additional OPS rows, and reconciliation of migration Merge-SHA uncertainty. It has now been updated rather than replaced.
2. The prior register's DB-001 row contained `2e7ce2ab281c62b9af3f66512d2a579eaf045b42` in the Merge SHA column. The PR #4 detailed task record explicitly marks the migration PR Merge SHA [UNV], and no live PR #4 Merge SHA was captured in this reconciliation. The register was corrected to [UNV] instead of retaining an unsupported SHA.
3. The register previously linked DOC-001 and DOC-002 to filenames that did not match the new canonical record names. Those links now point to `PR-31-DOC-01.md` and `DOC-002-tasks-system.md`.
4. The earlier PR #31 validation on Head `96c8648…` / Run #115 remains valid for that SHA only. PR #31 subsequently advanced to Head `5da1c20…`; Run #116 was still in progress at the last job inspection. Do not call the current PR Head 3/3 until a run on the final exact Head completes successfully.

### Remaining gaps

- PR #31 final Head CI after all DOC-02 commits: pending.
- Merge-SHA CI for PRs #22–#30: [UNV].
- Merge actor/method for PRs #22–#30 and #32: [UNV] where Timeline events were not independently captured.
- Explicit PO merge approval remains [UNV] for PRs #22–#26 and #28–#30, except PR #27's explicit approval comment; PR #32 merge was user-confirmed [USER].
- Visual QA remains Pending for F3, BN, F4 and #30; PR #26 has only a limited concession, not a full visual pass.
- PR #4 Merge SHA/actor/method/Merge-SHA CI remain [UNV].
- ENV-01 remains separate and unimplemented; ADM-1 remains plan-only and unauthorized for implementation.

### No workflow or application changes

This DOC-02 extension changes documentation files only. PR #31 remains Draft and unmerged; no Ready transition, merge, or ADM-1 implementation was performed.


## 2026-11-23 — PR #31 final DOC-02 checkpoint

- Live PR metadata: #31 remains open, Draft and unmerged; base BackendApp; head at checkpoint `b53db4b442c7df0c24c5257fcf4ed1d18cd57458`.
- GitHub returned `mergeable=false` at this checkpoint. Compare metadata reports `ahead_by=93`, `behind_by=0`, status `ahead`; this does not establish the reason for the false mergeable flag. The cause is [UNV] and must be investigated before any Ready/merge consideration.
- Exact-SHA lookup returned no PR-triggered workflow run for the checkpoint Head. The earlier Run #115 remains verified success 3/3 on the older Head `96c8648ab5b7f3143149297e0b6f0ffae70b99af`; it does not validate DOC-02. Current Head CI is pending/[UNV].
- The final PR file comparison contains documentation paths plus the already-scoped workflow path-filter synchronization; no application source, migrations, dependencies or environment files were added by DOC-02.
- PR remains Draft. No Ready transition, merge, force push, base retarget or ADM-1 implementation was performed.


## 2026-11-23 — Final DOC-02 checkpoint before CI revalidation

- PR #31 remains Open, Draft and unmerged; base is `BackendApp`.
- Checkpoint Head `fb727a2281b3c68c01bfd59c739ed0cb2af98de7` had Run #135 / `45158132139`. At inspection, `api-lint` had passed, `verify migrations` was running, and the run was not yet 3/3.
- Two further task-record updates followed that checkpoint, so Run #135 is not the final Head validation.
- The task register, PR #31 task record, DOC-02 task record, open-items, tech-debt and V5 report now distinguish historical Head Run #115, audit-start Run #116, checkpoint Run #135, and the need for a final exact-Head run.
- The PR #31 self-referential Head SHA/CI field is treated as a live GitHub fact: the final SHA and run must be reported from PR metadata/workflow after the last documentation commit, not copied from an earlier checkpoint.
- No PR state transition, approval, merge, force push, or application-code change was made.


## 2026-11-23 — Status-vocabulary correction

- A final rule review found the existing `ADM-EPIC.md` and `REGISTER.md` labeled ADM-0 / DOC-003 “Done as decision record only”.
- This conflicts with DOC-02's fixed rule that `Done` requires a merged PR, Merge-SHA CI, complete documentation, explicit PO approval link and Visual QA `Not required` or `Passed`.
- Corrected ADM-0 and DOC-003 to `In review` because their documentation is still inside unmerged Draft PR #31. The underlying PO design decisions remain approved; the documentation task is not complete until its PR gates close.
