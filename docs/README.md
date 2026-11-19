# ClassicStore — Documentation Index

**Repository:** `mosalah00x-source/classic-store-New`  
**Documentation branch:** `docs/project-reference` (branched from `BackendApp`)  
**Purpose:** project-wide reference index. GitHub branch contents are authoritative; this index identifies the branch that contains each supporting document.

## Primary project reference

- [Project summary and implementation report (V2 / repository publication)](reports/CLASSICSTORE_PROJECT_SUMMARY_AND_IMPLEMENTATION_REPORT_V2_PO_DECISIONS_2026-11-18.md)
- [Frontend language, direction and theme guide](reference/FRONTEND_LANGUAGE_THEME_GUIDE.md)

## Supporting documents and their authoritative branches

| Document | Repository path | Branch containing it | Purpose |
|---|---|---|---|
| Product SRS v1.1.1 | `docs/reference/Classic_Store_SRS_v1.1.1.md` | `BackendApp` | Approved product scope, requirements and open decisions |
| OpenAPI contract | `docs/api/openapi.yaml` | `BackendApp` | API request/response contract; not proof that every operation is implemented |
| T-07 identity decision | `docs/decisions/T-07-identity-derived-contracts.md` | `BackendApp` | Identity-related contract decisions |
| T-07 implementation report | `docs/reports/T-07-identity-implementation-report.md` | `BackendApp` | Evidence and scope of T-07 implementation |
| UI reference README and assets | `docs/ui-reference/` | `FrontendApp` | Static HTML/CSS/JS visual prototype/reference; not the current Next.js application source |
| Current frontend implementation | `frontend/src/` | `FrontendApp` | Next.js app, i18n messages, locale routing, theme preference and page components |

Branch-specific links:

- [SRS on BackendApp](https://github.com/mosalah00x-source/classic-store-New/blob/BackendApp/docs/reference/Classic_Store_SRS_v1.1.1.md)
- [OpenAPI on BackendApp](https://github.com/mosalah00x-source/classic-store-New/blob/BackendApp/docs/api/openapi.yaml)
- [T-07 decision on BackendApp](https://github.com/mosalah00x-source/classic-store-New/blob/BackendApp/docs/decisions/T-07-identity-derived-contracts.md)
- [T-07 report on BackendApp](https://github.com/mosalah00x-source/classic-store-New/blob/BackendApp/docs/reports/T-07-identity-implementation-report.md)
- [UI reference on FrontendApp](https://github.com/mosalah00x-source/classic-store-New/tree/FrontendApp/docs/ui-reference)
- [Current frontend source on FrontendApp](https://github.com/mosalah00x-source/classic-store-New/tree/FrontendApp/frontend/src)

## Governance rules

1. Before implementation, inspect the live target branch, its HEAD SHA, related PRs and Actions runs.
2. Work on one task and its assigned branch at a time.
3. Do not infer implementation from SRS/OpenAPI/schema presence alone.
4. Do not claim visual parity without browser screenshots at the required viewports/locales/themes.
5. Do not claim CI success unless every required check passes on the same commit SHA.
6. PO decisions in the project report are binding within their stated scope; unresolved SRS decisions remain open.
7. Do not edit or merge application branches as part of a documentation-only change.

## Source-of-truth precedence

For live branch state, commits, PRs and CI: GitHub wins over stale reports. For product requirements and PO approvals: the approved SRS and explicit PO decision log apply. When they conflict, stop and record the conflict for PO resolution rather than silently changing scope.
