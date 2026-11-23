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


## 2026-11-23 — PR #31 Head CI completion

- PR #31 Head `ba2dbc9a734f7cdfc153059b57eede5df3dc3a1d` completed backend-ci Run #144 / `45158457372` with overall conclusion `success`.
- Exact-SHA jobs: `api-lint` completed/success; `verify migrations` completed/success; `backend` completed/success.
- The PR was still Open, Draft and unmerged. The task-record/register update that records Run #144 will itself advance the Head, so a new run on the resulting final Head is required before claiming the updated branch is 3/3.


## 2026-11-23 — Single-source-of-truth, frontend Merge-SHA CI and PR timeline reconciliation

### 1. Legacy and canonical task-file inventory [GH]

- The old `docs/tasks/README.md` was already a short compatibility index pointing to `docs/project-reference/tasks/`; it was not a second detailed register.
- Before this reconciliation, both directories contained nine detailed files with matching PR numbers. All nine old files and their canonical counterparts had different Git blob SHAs; none was byte-identical.
- The nine overlapping path pairs were:
  - `docs/tasks/PR-22.md` → `docs/project-reference/tasks/PR-22.md`
  - `docs/tasks/PR-23.md` → `docs/project-reference/tasks/PR-23.md`
  - `docs/tasks/PR-24.md` → `docs/project-reference/tasks/PR-24.md`
  - `docs/tasks/PR-25.md` → `docs/project-reference/tasks/PR-25.md`
  - `docs/tasks/PR-26.md` → `docs/project-reference/tasks/PR-26.md`
  - `docs/tasks/PR-27.md` → `docs/project-reference/tasks/PR-27.md`
  - `docs/tasks/PR-28.md` → `docs/project-reference/tasks/PR-28.md`
  - `docs/tasks/PR-29.md` → `docs/project-reference/tasks/PR-29.md`
  - `docs/tasks/PR-30.md` → `docs/project-reference/tasks/PR-30.md`
- The legacy versions were shorter, earlier Arabic task notes; the canonical records are the expanded standardized records with separate Head/Merge CI, scope, decisions, changed files, tests, Visual QA, claim verification and review stamps. The legacy contents are now replaced by short path-preserving redirects to the canonical record.
- No file was deleted. `docs/tasks/README.md` remains a compatibility index. The single current source of truth is `docs/project-reference/tasks/`.

### 2. Exact Frontend Merge-SHA push CI [GH]

Each workflow was queried with `event=push` and the exact Merge SHA. Each returned one `frontend-ci` run on branch `FrontendApp`; the exact job `frontend` completed/success.

| PR | Exact Merge SHA | Push Run ID | Job |
|---:|---|---:|---|
| #22 | `c21a089e69477bf033c0e149835ce1d6b474754a` | [44118235141](https://github.com/mosalah00x-source/classic-store-New/actions/runs/44118235141) | frontend — success |
| #23 | `c3734268fa3a76ff63bc20f504665198063560c7` | [44099650247](https://github.com/mosalah00x-source/classic-store-New/actions/runs/44099650247) | frontend — success |
| #24 | `e27f5977a12127bc52195c64700f62d82c87d815` | [44289634885](https://github.com/mosalah00x-source/classic-store-New/actions/runs/44289634885) | frontend — success |
| #25 | `dd00ddd5fb6c21800f9928662893a27b4a290d63` | [44317304438](https://github.com/mosalah00x-source/classic-store-New/actions/runs/44317304438) | frontend — success |
| #26 | `eea323cde726ef17666525bb047f4c2e093af1ac` | [45021255892](https://github.com/mosalah00x-source/classic-store-New/actions/runs/45021255892) | frontend — success |
| #27 | `896fe55515a4640c0cd36f6ba4f204afc329ebba` | [45026797029](https://github.com/mosalah00x-source/classic-store-New/actions/runs/45026797029) | frontend — success |
| #28 | `8cb49280d7d0cc989ea779b71994928d8e8707c1` | [45035234113](https://github.com/mosalah00x-source/classic-store-New/actions/runs/45035234113) | frontend — success |
| #29 | `a5d722ec74170ab02b7e121a37619f51bf6c7782` | [45038732812](https://github.com/mosalah00x-source/classic-store-New/actions/runs/45038732812) | frontend — success |
| #30 | `666dd2151172b56f57e10b4446c63a58f5d9d7a2` | [45041317755](https://github.com/mosalah00x-source/classic-store-New/actions/runs/45041317755) | frontend — success |

This supersedes the earlier [UNV] Merge-SHA CI claims for PR #22–#30. These are push runs on exact Merge SHAs, not PR Head runs.

### 3. Merge actor, Timeline and method [GH]

- PR #29 merged event: actor `mosalah00x-source`, Merge SHA `a5d722ec74170ab02b7e121a37619f51bf6c7782`, [direct Timeline event](https://github.com/mosalah00x-source/classic-store-New/issues/events/36931250278).
- PR #30 merged event: actor `mosalah00x-source`, Merge SHA `666dd2151172b56f57e10b4446c63a58f5d9d7a2`, [direct Timeline event](https://github.com/mosalah00x-source/classic-store-New/issues/events/36932680289).
- PR metadata reports `merged_by=mosalah00x-source` for PRs #22–#30 and #32. The merge strategy (merge/squash/rebase) is not exposed by the inspected Timeline/PR metadata; it remains [UNV] and is not inferred.
- PR #26 comment 7078863065 is a limited visual concession, not explicit merge approval. PR #27 has an explicit PO approval comment [7079714545](https://github.com/mosalah00x-source/classic-store-New/pull/27#issuecomment-7079714545). No explicit merge-approval artifact link was captured for the other frontend PRs.

### 4. PR #4 / V1–V7 correction [GH]

- PR #4 Merge SHA is `2e7ce2ab281c62b9af3f66512d2a579eaf045b42`; merged actor is `mosalah00x-source`, with [Timeline merged event](https://github.com/mosalah00x-source/classic-store-New/issues/events/35682975123).
- Exact Merge-SHA push Run #12 / [42821341163](https://github.com/mosalah00x-source/classic-store-New/actions/runs/42821341163) completed successfully. The run exposed two jobs (`verify migrations`, `backend`), both completed/success; it is recorded as 2/2 available jobs, not 3/3.
- REGISTER DB-001…DB-007 and `PR-04-migrations.md` now use the actual PR #4 Merge SHA and Merge-SHA CI run. The PR description is linked as the source/hash PO approval artifact; no separate comment/review URL was captured.

### 5. DOC-03 and PR #31 self-reference [GH]

- Added DOC-03 as a planned register row: a small post-merge documentation PR to record PR #31's final Merge SHA, Merge-SHA CI, merged actor/method and explicit PO approval artifact.
- `PR-31-DOC-01.md` and `DOC-002-tasks-system.md` deliberately use live-only placeholders for PR #31 Head SHA/CI and no Merge SHA. No stale Head SHA/run is presented as current.
- PR #31 remains Draft/open/unmerged. No Ready transition, approval, merge, force push or ADM-1 implementation was performed.
- The DOC-02 compliance matrix maps requirements 1–9 to exact files/sections. Requirement 9 is marked partially present until a fresh 3/3 run on the exact live PR #31 Head is checked after the final documentation commit and PO review is completed.

### 6. Status and Visual QA safeguards

- FE-006 (F3), FE-007 (BN), FE-008 (F4) and FE-009 (Mega Menu/#30) remain `Merged` with Visual QA `Pending`; none is marked `Done` or `Passed`.
- No task row is marked `Done`.
- PR #31 remains `In review` / Draft; DOC-03 is `Planned`.


### Legacy/canonical blob comparison snapshot [GH]

The following blob SHAs were captured from the two directories before the legacy files were replaced with redirects. A different SHA confirms the files were distinct versions; it does not by itself describe semantic differences.

| PR | Original legacy blob SHA (`docs/tasks`) | Canonical blob SHA at comparison (`docs/project-reference/tasks`) | Difference |
|---:|---|---|---|
| #22 | `359d45a06ff50484d8657326fecc2d0f4f03dc39` | `34c99e5a6d6227f6f2f9000405e019a23b94460f` | Different legacy compact Arabic note vs standardized canonical task record |
| #23 | `5dd8bbfeae65fe8cb8db44636a61f11362f6b626` | `6a7a61237e03b9015bfa2564e6611463c454056a` | Different legacy compact Arabic note vs standardized canonical task record |
| #24 | `4fcf0e457e978160ac5930c064aad0994d5afbcf` | `05f7be2c256dffb70147d40d255c74ad0fc40a15` | Different legacy compact Arabic note vs standardized canonical task record |
| #25 | `525c9e5c709b0488a796f4794e6373c0d31f5bd8` | `5e13dfaab939e5e915680c1f55bdbea8c0efdd35` | Different legacy compact Arabic note vs standardized canonical task record |
| #26 | `18f7dde0a27ee3d0565a84e19567ea440f129a66` | `d6a72ff7c50097e263f179b22572d87b6bf7fab8` | Different legacy compact Arabic note vs standardized canonical task record |
| #27 | `a307e57c3735695180a2faef317555b7dd3603d1` | `944683c34729dbc93d995eb53ed0501ed30807d0` | Different legacy compact Arabic note vs standardized canonical task record |
| #28 | `5ac7e234dc0efbe7aa569bf9991176b150590aed` | `26cd4c8edd0ab87623776c905b88babf9e4bab8d` | Different legacy compact Arabic note vs standardized canonical task record |
| #29 | `6d17e4ccf440971d8712dae04c25f9c8c6eab234` | `f4170e5365d83f4136d51eec02bd976cd070f1d5` | Different legacy compact Arabic note vs standardized canonical task record |
| #30 | `0c094fe7f2acf3c97622e9b67cd97811375c7708` | `fdb88cf20ce6e22d0e50350f07b7899f404452de` | Different legacy compact Arabic note vs standardized canonical task record |

At comparison time the canonical records included the expanded evidence sections (Head CI, Merge-SHA CI, approvals, Visual QA, claim verification and review stamps); the legacy versions had earlier/shorter summaries. Current legacy paths now contain redirects only, so future edits must be made exclusively in the canonical directory.


## 2026-11-23 — PR #4 PO approval evidence classification correction

- PR #4's description contains text approving the source conversion/generated migration hashes. That is source/implementation decision context, but it is not an explicit PO approval comment or submitted review for merge.
- No direct PO approval comment/review URL was found in the inspected PR #4 evidence. Therefore PR-04-migrations.md and REGISTER DB-001…DB-007 now state that explicit PO merge approval is not found; the description text is not counted as a merge approval artifact.
- The PR #4 Merge SHA, merged actor, Timeline event and exact Merge-SHA push Run #12 / 42821341163 remain verified. This correction changes only the approval classification.


## 2026-11-23 — PR #22 / #23 merge chronology verified

### Verified GitHub facts [GH]

- PR #23, `feat(frontend): add theme-aware CSS mask for ClassicStore logo`, merged at **2026-11-17 14:07:15 UTC**. The GitHub Timeline merged event identifies `mosalah00x-source` as actor: [direct event 36413198507](https://github.com/mosalah00x-source/classic-store-New/issues/events/36413198507). Merge SHA: `c3734268fa3a76ff63bc20f504665198063560c7`; exact Merge-SHA push CI: [Run 44099650247](https://github.com/mosalah00x-source/classic-store-New/actions/runs/44099650247).
- PR #22, `feat(frontend): align catalog and product detail UI`, merged at **2026-11-17 15:46:48 UTC**; GitHub PR metadata identifies `mosalah00x-source` as `merged_by`: [PR #22](https://github.com/mosalah00x-source/classic-store-New/pull/22). Merge SHA: `c21a089e69477bf033c0e149835ce1d6b474754a`; exact Merge-SHA push CI: [Run 44118235141](https://github.com/mosalah00x-source/classic-store-New/actions/runs/44118235141).
- Actual sequence was **#23 then #22**, separated by 1 hour, 39 minutes, 33 seconds. This reverses the intended order (#22 before #23), originally chosen to reduce overlap risk in the shared files `frontend/src/app/globals.css` and `frontend/src/app/[locale]/page.tsx`.

### Merge graph / impact assessment [GH]

- The #22 merge commit's parent is exactly #23's merge SHA `c3734268fa3a76ff63bc20f504665198063560c7`. This proves #23 was already in `FrontendApp` when #22 landed.
- The available GitHub metadata does not prove whether the #22 source branch was separately updated before merge. No conflict-resolution event is present in the inspected evidence. The inspected records do not evidence a technical conflict or regression; absence of such evidence is not proof that no conflict occurred.
- The Run ID order reflects the same actual sequence: #23 Run `44099650247` at 14:07:18 UTC, then #22 Run `44118235141` at 15:46:51 UTC. The run ordering is consistent with, but is not a substitute for, the merge timestamps above.

### Documentation references

- Canonical task records: [PR-22.md](./PR-22.md) and [PR-23.md](./PR-23.md), each updated with the observed order, rationale, graph evidence and limitations.
- No Visual QA status or PO approval status was changed by this chronology correction.


## 2026-11-23 — DOC-03: PR #31 merge close-out and documentation branch assessment

### PR #31 final evidence [GH]

- PR #31 merged into `BackendApp` at 2026-11-23 11:52:05 UTC. Merge SHA: `67dbd343185742c30ecb5d65eca939bd0efb9d68`; [direct merged Timeline event 37003224078](https://github.com/mosalah00x-source/classic-store-New/issues/events/37003224078). Merged actor: `mosalah00x-source`.
- Final pre-merge Head SHA: `4ecba73a4a403ce8ef41342c87267a9ce1ea8060`; Head CI Run #185 / [45168530591](https://github.com/mosalah00x-source/classic-store-New/actions/runs/45168530591), 3/3 success.
- Exact Merge-SHA push CI Run #186 / [45169011839](https://github.com/mosalah00x-source/classic-store-New/actions/runs/45169011839) has `head_sha` equal to the Merge SHA above. Rechecked all three jobs and every listed step: `verify migrations`, `api-lint`, `backend` all completed/success (3/3).
- Merge strategy is [UNV]; the inspected PR metadata and Timeline event do not expose merge/squash/rebase.

### Approval and Visual QA state [GH]

- A fresh PR #31 discussion lookup returned zero issue comments; the submitted-review lookup returned zero reviews. No PO approval artifact was found at DOC-03 execution time.
- DOC-001 and DOC-002 are updated to `Merged`, not `Done`. Their PO approval gate remains pending. The merge event is not approval.
- F3, BN, F4 and #30 Visual QA remain Pending until the PO posts the specified comment and evidence links. The mobile-only BN scope must not be generalized to desktop.

### Documentation branch inventory [GH]

- `docs/project-reference` still exists as a branch after PR #31 merge. `BackendApp` points to the Merge SHA above.
- The task README and REGISTER now identify `BackendApp` as the canonical docs base and `docs/project-reference` as the legacy merged branch. PR-31-DOC-01 retains the original task-branch fact. Canonical docs now exist on `BackendApp`.
- `.github/workflows/backend-ci.yml` contains `docs/project-reference/**` in push and pull_request path filters. This is a repository path filter, not a dependency on a branch ref named `docs/project-reference`.
- GitHub exact-path code search returned zero matches but marked the result incomplete; therefore it is not evidence that no other references exist. No workflow dependency on this branch name was established by the available search. No deletion was attempted.
- Recommendation: after a complete reference review and explicit PO approval, delete the merged long-lived docs branch and use short-lived docs branches from current `BackendApp`. This reduces branch drift and sync work. Deletion remains unauthorized and is not part of DOC-03.

### Additional open follow-ups

- FE-home-categories-limit: eight-card cap is the proposed retained design; “عرض كل التصنيفات” link to `/products` remains description-only until explicit PO confirmation.
- A11Y-input-borders: report-only audit; measure all input/control borders in light/dark and recommend a dedicated ≥3:1 token while retaining subtle decorative card borders.
- BN-desktop-verify: desktop viewport remains unverified; do not extend mobile-only evidence.
- DOC-BRANCH: branch lifecycle recommendation only; no deletion.

### Documentation maintenance rule

Frontend task records are updated through documentation-only PRs from short-lived branches based on the latest `BackendApp`, targeting `BackendApp`. Frontend application changes continue to target `FrontendApp`.


### 2026-11-23 — ENV-01 and F8 started as separate FrontendApp PRs

- ENV-01 PR #34 is Draft on `FrontendApp`, Head `19667498fe74fadbad33fd697400c7385572aa0e`. Frontend CI Run #130 / [45170312530](https://github.com/mosalah00x-source/classic-store-New/actions/runs/45170312530) passed its frontend job and every step. `frontend/.gitignore` already contains the `.env*` ignore and `!.env.example` exception; the new file is present in PR changed files.
- F8 PR #35 is Draft on `FrontendApp`, current Head `812b3fc8d8b6da7cd4352c295d8cdcb8801dc1b0`. Run #132 failed TypeScript because the test assigned to readonly `process.env.NODE_ENV`; the test helper was corrected by removing that assignment. New final-Head Run #133 / [45170837047](https://github.com/mosalah00x-source/classic-store-New/actions/runs/45170837047) was in progress at this log entry. Earlier failures are not represented as current success.
- Both tasks are tracked in REGISTER as `In review` with canonical task records. No PR is marked Ready or merged.


### Correction — F8 final Head CI completion [GH] (2026-11-23)

The earlier DOC-03 log entry recorded Run #133 as in progress at that point in time. Run #133 / [45170837047](https://github.com/mosalah00x-source/classic-store-New/actions/runs/45170837047) subsequently completed successfully on exact F8 Head SHA `812b3fc8d8b6da7cd4352c295d8cdcb8801dc1b0`. The frontend job and every step completed/success, including Install dependencies, Lint, Typecheck, Unit tests, Production build and cleanup. No additional F8 source changes were made after this successful run.

## 2026-11-23 — DOC-03 pre-correction Head CI recorded; documentation correction follows [GH]

- This entry records the DOC-03 PR Head **before this documentation correction**: `ac0d4d97464881d17e0d2a7c860600916dfeec35`.
- GitHub Actions Run #195 / [45171119082](https://github.com/mosalah00x-source/classic-store-New/actions/runs/45171119082) was associated with that exact Head SHA.
- All three jobs completed successfully on that SHA: `api-lint` — Success; `verify migrations` — Success; `backend` — Success (3/3).
- SHA match was checked between the PR Head recorded for this pre-correction state and Run #195's `head_sha`.
- **Important limitation:** this evidence describes only the Head before this correction. It does not validate the commit(s) that add this entry or the other documentation corrections. A new workflow run matching the updated PR Head is required.
- PR #33 remained Draft; it was not converted to Ready and was not merged.
