# ClassicStore — Documentation Index

**Repository:** `mosalah00x-source/classic-store-New`  
**Central documentation branch:** `docs/project-reference`  
**Purpose:** canonical working location for project documentation. New documentation and documentation updates should be published here. Original branch copies remain unchanged.

## Primary project references

- [Project summary and implementation report (V2 / PO decisions)](reports/CLASSICSTORE_PROJECT_SUMMARY_AND_IMPLEMENTATION_REPORT_V2_PO_DECISIONS_2026-11-18.md)
- [Project master reference (Arabic)](reference/Classic_Store_Project_Master_Reference_AR.md)
- [Frontend language, direction and theme guide](reference/FRONTEND_LANGUAGE_THEME_GUIDE.md)

## Centralized supporting documents

| Document | Central path | Original source branch/path | Notes |
|---|---|---|---|
| Product SRS v1.1.1 | `docs/reference/Classic_Store_SRS_v1.1.1.md` | `BackendApp/docs/reference/` | Product scope and requirements |
| Project master reference (Arabic) | `docs/reference/Classic_Store_Project_Master_Reference_AR.md` | `main/docs/reference/` and `docs/ui-reference/docs/reference/` | Historical snapshot; verify live repository state for current implementation status |
| Backend README | `docs/reference/BACKEND_README.md` | `BackendApp/backend/README.md` | Backend skeleton/toolchain notes from source branch |
| Project reference README | `docs/reference/PROJECT_REFERENCE_README.md` | `docs/ui-reference/docs/reference/README.md` | Original reference index README |
| OpenAPI contract | `docs/api/openapi.yaml` | `BackendApp/docs/api/` | API contract; not proof every operation is implemented |
| T-06 acceptance report | `docs/api/T06-acceptance-report.md` | `BackendApp/docs/api/` | Historical contract/CI evidence tied to the SHAs and run stated inside the report |
| T-07 identity decision | `docs/decisions/T-07-identity-derived-contracts.md` | `BackendApp/docs/decisions/` | Identity-related contract decisions |
| T-07 implementation report | `docs/reports/T-07-identity-implementation-report.md` | `BackendApp/docs/reports/` | Evidence and scope of T-07 implementation |
| Static UI reference guide | `docs/ui-reference/README.md` | `FrontendApp/docs/ui-reference/` | Guide copied here; prototype HTML/CSS/JS/assets remain on FrontendApp |
| Frontend language/theme guide | `docs/reference/FRONTEND_LANGUAGE_THEME_GUIDE.md` | Compiled from live FrontendApp source and PO decisions | Distinguishes static prototype from current Next.js app |

## Original implementation locations

These remain source locations, not the central documentation location:

- [Backend implementation and migrations on BackendApp](https://github.com/mosalah00x-source/classic-store-New/tree/BackendApp/backend)
- [Frontend Next.js implementation on FrontendApp](https://github.com/mosalah00x-source/classic-store-New/tree/FrontendApp/frontend/src)
- [Static UI prototype files on FrontendApp](https://github.com/mosalah00x-source/classic-store-New/tree/FrontendApp/docs/ui-reference)

## Branch audit coverage

The branch inventory was checked against all 30 branches returned by GitHub. The recurring Markdown/API/spec documentation in feature branches is inherited from their base branches; no separate branch-specific project document was identified in those trees beyond the sources listed above. The unique additional documents found were the project master reference on `main` and the static UI guide on `FrontendApp` (both copied here).

## Governance rules

1. `docs/project-reference` is the central home for project documentation.
2. Before implementation, inspect live target branch state, HEAD SHA, related PRs and Actions runs.
3. Work on one task and its assigned implementation branch at a time.
4. Do not infer implementation from SRS/OpenAPI/schema presence alone.
5. Do not claim visual parity without browser screenshots at required viewports/locales/themes.
6. Do not claim CI success unless every required check passes on the same commit SHA.
7. PO decisions in the project report are binding within their stated scope; unresolved SRS decisions remain open.
8. Do not edit or merge application branches as part of documentation consolidation.
9. When copying a document, preserve its filename and content, record its original branch/path, and mark historical evidence where relevant.
10. Never silently overwrite a newer or conflicting document; record the conflict for PO resolution.

## Source-of-truth precedence

For live branch state, commits, PRs and CI: GitHub wins over stale reports. For product requirements and PO approvals: the approved SRS and explicit PO decision log apply. When they conflict, stop and record the conflict for PO resolution rather than silently changing scope.
