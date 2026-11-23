# ClassicStore — Documentation Index

**Repository:** mosalah00x-source/classic-store-New  
**Canonical documentation branch:** docs/project-reference  
**Current report:** V5 is the current project snapshot; V2–V4 remain historical.

## Project reference and governance
- [ADMIN-0 — admin inventory, design and PO decisions](project-reference/ADMIN-0.md)
- [ADM-1 — report-only implementation plan](project-reference/ADM-1-plan.md)
- [Project reference index](project-reference/README.md)
- [Open items](project-reference/open-items.md)
- [Technical debt / CI-01](project-reference/tech-debt.md)

## Project status and task system
- [V5 — current project status](reports/CLASSICSTORE_PROJECT_SUMMARY_AND_IMPLEMENTATION_REPORT_V5.md)
- [Task system README](project-reference/tasks/README.md)
- [Cross-domain task register](project-reference/tasks/REGISTER.md)
- [Reconciliation log](project-reference/tasks/RECONCILIATION-LOG.md)
- [Task template](project-reference/tasks/_TEMPLATE.md)
- [Local development and visual review](project-reference/local-development-and-visual-review.md)

## Historical decisions and reports
- [PO decision — bottom navigation](decisions/F2-dn-nav-bar-decision.md)
- [PO decision — defer F4 discount/New badges](decisions/F4-badges-deferred.md)
- [V4 — historical snapshot, 22 November](reports/CLASSICSTORE_PROJECT_SUMMARY_AND_IMPLEMENTATION_REPORT_V4_2026-11-22.md)
- [V3 project report](reports/CLASSICSTORE_PROJECT_SUMMARY_AND_IMPLEMENTATION_REPORT_V3_2026-11-18.md)
- [V3 verification report](reports/V3-verification-report-2026-11-18.md)
- [F1 storefront shell completion report](reports/F1-storefront-shell-completion-report.md)
- [F3 Home storefront completion report](reports/F3-home-storefront-completion-report.md)
- [V2 historical report — do not edit](reports/CLASSICSTORE_PROJECT_SUMMARY_AND_IMPLEMENTATION_REPORT_V2_PO_DECISIONS_2026-11-18.md)

## Technical references
- [Project Master Reference (Arabic)](reference/Classic_Store_Project_Master_Reference_AR.md)
- [Consolidated SQL reference V1–V7](reference/Classic_Store_Consolidated_V1-V7.sql)
- [Frontend language, direction and theme guide](reference/FRONTEND_LANGUAGE_THEME_GUIDE.md)
- [Static UI prototype guide](ui-reference/README.md)

## Source and governance rules
1. docs/project-reference is the canonical current documentation branch; implementation branches are evidence sources, not documentation edit targets.
2. GitHub is authoritative for branch, PR, commit and CI status.
3. PO approval is never inferred from Ready, merge or CI.
4. Visual parity requires actual, reviewable screenshots.
5. Head CI does not prove Merge-SHA CI.
6. SRS/OpenAPI/schema presence does not prove runtime implementation.
7. ADM-1 implementation remains unauthorized until DOC-01 is merged and the PO gives explicit written approval of the plan.
