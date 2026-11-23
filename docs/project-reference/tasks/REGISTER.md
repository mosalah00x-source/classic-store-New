# Task register — Classic Store

**Repository:** mosalah00x-source/classic-store-New  
**Canonical documentation branch:** docs/project-reference  
**Last live reconciliation:** 2026-11-23

## Status and field rules

Only these statuses are permitted: Planned, In progress, In review, Merged, Done, Blocked, Deferred, Cancelled. In review means an open PR. Merged means GitHub confirms merge but at least one Done gate is still open. Visual QA is Not required, Pending, Passed or Failed. Unknown evidence stays [UNV].

## Frontend (FE)

| ID | Legacy ID | Title / scope | Status | PR | Merge SHA | CI on Merge (Run) | Visual QA | PO approval | Dependencies | Task file | Last checked |
|---|---|---|---|---|---|---|---|---|---|---|---|
| FE-001 | F1-ui | Catalog and product-detail alignment / showcase | Merged | [#22](https://github.com/mosalah00x-source/classic-store-New/pull/22) | c21a089e69477bf033c0e149835ce1d6b474754a | [UNV] | Pending | [UNV] | — | PR-22.md | 2026-11-23 |
| FE-002 | Logo | Theme-aware CSS mask logo | Merged | [#23](https://github.com/mosalah00x-source/classic-store-New/pull/23) | c3734268fa3a76ff63bc20f504665198063560c7 | [UNV] | Pending | [UNV] | FE-001 | PR-23.md | 2026-11-23 |
| FE-003 | Product theme | Product detail theme toggle | Merged | [#24](https://github.com/mosalah00x-source/classic-store-New/pull/24) | e27f5977a12127bc52195c64700f62d82c87d815 | [UNV] | Pending | No approval evidence in PR reviews/comments | FE-001 | PR-24.md | 2026-11-23 |
| FE-004 | Price promotion | Conditional old price/discount/savings in detail fixtures | Merged | [#25](https://github.com/mosalah00x-source/classic-store-New/pull/25) | dd00ddd5fb6c21800f9928662893a27b4a290d63 | [UNV] | Pending | No merge approval evidence; V5 says PO requested Draft/no merge | FE-001 | PR-25.md | 2026-11-23 |
| FE-005 | F-shell | Shared storefront shell | Merged | [#26](https://github.com/mosalah00x-source/classic-store-New/pull/26) | eea323cde726ef17666525bb047f4c2e093af1ac | [UNV] | Pending | No merge approval; PO comments required Draft pending theme-flash measurement | FE-001 | PR-26.md | 2026-11-23 |
| FE-006 | F3 | Bilingual Home storefront | Merged | [#27](https://github.com/mosalah00x-source/classic-store-New/pull/27) | 896fe55515a4640c0cd36f6ba4f204afc329ebba | [UNV] | Pending — scoped concession only | [PO](https://github.com/mosalah00x-source/classic-store-New/pull/27#issuecomment-7079714545) | FE-005 | PR-27.md | 2026-11-23 |
| FE-007 | BN / F2 new | Persistent bottom navigation | Merged | [#28](https://github.com/mosalah00x-source/classic-store-New/pull/28) | 8cb49280d7d0cc989ea779b71994928d8e8707c1 | [UNV] | Pending | [UNV] | FE-005 | PR-28.md | 2026-11-23 |
| FE-008 | F4 | Catalog product card and local favorites | Merged | [#29](https://github.com/mosalah00x-source/classic-store-New/pull/29) | a5d722ec74170ab02b7e121a37619f51bf6c7782 | [UNV] | Pending | [UNV] | FE-001 | PR-29.md | 2026-11-23 |
| FE-009 | FIX-MM | Mega Menu and SVG favorite heart | Merged | [#30](https://github.com/mosalah00x-source/classic-store-New/pull/30) | 666dd2151172b56f57e10b4446c63a58f5d9d7a2 | [UNV] | Pending | [UNV] | FE-005, FE-008 | PR-30.md | 2026-11-23 |
| FE-010 | F7 | Remove duplicate logo CSS variables | Planned | — | — | — | Pending | — | — | Planned; no task file yet | 2026-11-23 |
| FE-011 | F8 | Handle empty JSON in catalog-api.ts | Planned | — | — | — | Pending | — | — | Planned; no task file yet | 2026-11-23 |
| FE-012 | F10 / V7 | Unify theme key/behavior across app | Planned | — | — | — | Pending | — | FE-005 | Planned; no task file yet | 2026-11-23 |
| FE-013 | F1c | Brand filter | Planned | — | — | — | Pending | — | Contract | Planned; no task file yet | 2026-11-23 |
| FE-014 | FE-MM2 | Second-level store category navigation | Deferred | — | — | — | Pending | — | ADM-2 | Planned; no task file yet | 2026-11-23 |
| FE-015 | F4 badges | Discount/compare-at/New badges | Deferred | — | — | — | Not required until scope reopens | [PO](../decisions/F4-badges-deferred.md) | Approved backend contract | Planned; no task file yet | 2026-11-23 |
| FE-016 | F5 | Product detail quantity, notes, favorites and cart | Planned | — | — | — | Pending | — | BE-B1 | Planned; no task file yet | 2026-11-23 |
| FE-017 | C1–C4 | Cart, checkout, confirmation and tracking UI | Planned | — | — | — | Pending | — | BE-B1–B5 | Planned; no task file yet | 2026-11-23 |
| FE-018 | F9 | Customer account pages | Planned | — | — | — | Pending | — | T-07/API readiness | Planned; no task file yet | 2026-11-23 |
| FE-019 | Search | Storefront search | Planned | — | — | — | Pending | — | API contract | Planned; no task file yet | 2026-11-23 |
| FE-020 | Fonts | Local fonts instead of remote Google Fonts | Planned | — | — | — | Pending | — | Font assets/licensing | Planned; no task file yet | 2026-11-23 |
| FE-021 | Home categories | Review 8/9 category discrepancy and card-image background | Planned | — | — | — | Pending | — | Prototype/source HTML | Planned; no task file yet | 2026-11-23 |

## Backend (BE)

| ID | Legacy ID | Title / scope | Status | PR | Merge SHA | CI on Merge | Visual QA | PO approval | Dependencies | Task file | Last checked |
|---|---|---|---|---|---|---|---|---|---|---|---|
| BE-001 | B1 | Cart API — guest/customer carts and items | Planned | — | — | — | Not required | — | DB V4 | Planned; no task file | 2026-11-23 |
| BE-002 | B2 | Shipping calculation and shipping rates | Planned | — | — | — | Not required | — | B1, DB V5 | Planned; no task file | 2026-11-23 |
| BE-003 | B3 | Checkout quote and order creation | Planned | — | — | — | Not required | — | B1, B2 | Planned; no task file | 2026-11-23 |
| BE-004 | B4 | Payments (COD first) | Planned | — | — | — | Not required | — | B3 | Planned; no task file | 2026-11-23 |
| BE-005 | B5 | Order tracking/lifecycle | Planned | — | — | — | Not required | — | B3, B4 | Planned; no task file | 2026-11-23 |
| BE-006 | B6 | Coupons | Planned | — | — | — | Not required | — | DB V2, B3 | Planned; no task file | 2026-11-23 |
| BE-007 | B7 | Returns, inventory and administration | Planned | — | — | — | Not required | — | DB V3–V7, ADM | Planned; no task file | 2026-11-23 |
| BE-008 | ADM-1 | Auth, ADMIN/EDITOR permissions and append-only audit — plan only | Planned | — | — | — | Not required | Written implementation approval pending | DOC-01 merge + explicit PO approval | ADM-1-plan.md | 2026-11-23 |
| BE-009 | ADM-2 | Admin API for categories/products/variants/images | Planned | — | — | — | Not required | — | ADM-1 | ADMIN-0 roadmap | 2026-11-23 |
| BE-010 | ADM-6 | Image upload/storage adapter and homepage content | Planned | — | — | — | Not required | — | ADM-1, ADM-2 | ADMIN-0 roadmap | 2026-11-23 |
| BE-011 | ADM-7 | Orders/users/settings administration | Planned | — | — | — | Not required | — | Cart/checkout, ADM | ADMIN-0 roadmap | 2026-11-23 |
| BE-015 | ADM-8 | Admin hardening and acceptance APIs/security | Planned | — | — | — | Not required | — | ADM-1–ADM-7 | ADMIN-0 roadmap | 2026-11-23 |
| BE-016 | Price contract | Define compareAtPrice, backend-derived discountPercent and isNew in OpenAPI/API and tests | Planned | — | — | — | Not required | — | ADM-5; PO decisions | Planned; no task file | 2026-11-23 |
| BE-017 | First Admin bootstrap | One-time protected first-admin creation, forced password change; public signup CUSTOMER-only | Planned | — | — | — | Not required | — | ADM-1 approval | Planned; no task file | 2026-11-23 |
| BE-014 | ADM-5 | Product/variant/price management API | Planned | — | — | — | Not required | — | ADM-2 | ADMIN-0 roadmap | 2026-11-23 |
| BE-013 | ADM-4 | Category management API and lifecycle rules | Planned | — | — | — | Not required | — | ADM-2 | ADMIN-0 roadmap | 2026-11-23 |
| BE-012 | ADM-3 | Admin frontend shell and Next.js BFF session | Planned | — | — | — | Not required | — | ADM-1 | ADMIN-0 roadmap | 2026-11-23 |

## Database (DB)

| ID | Legacy ID | Title / scope | Status | PR | Merge SHA | CI on Merge | Visual QA | PO approval | Dependencies | Task file | Last checked |
|---|---|---|---|---|---|---|---|---|---|---|---|
| DB-001 | V1 | Baseline schema, extensions, identity/users, addresses/settings | Merged | [#4](https://github.com/mosalah00x-source/classic-store-New/pull/4) | [UNV] | [UNV] | Not required | Hash approval stated in PR #4 body | — | PR-04-migrations.md | 2026-11-23 |
| DB-002 | V2 | Brands/categories/products/variants/images/coupons | Merged | [#4](https://github.com/mosalah00x-source/classic-store-New/pull/4) | 2e7ce2ab281c62b9af3f66512d2a579eaf045b42 | [UNV] | Not required | Hash approval stated in PR #4 body | DB-001 | PR-04-migrations.md | 2026-11-23 |
| DB-003 | V3 | Warehouses/inventory/movements | Merged | [#4](https://github.com/mosalah00x-source/classic-store-New/pull/4) | 2e7ce2ab281c62b9af3f66512d2a579eaf045b42 | [UNV] | Not required | Hash approval stated in PR #4 body | DB-002 | PR-04-migrations.md | 2026-11-23 |
| DB-004 | V4 | Carts/orders/order items/fulfillment/reservations | Merged | [#4](https://github.com/mosalah00x-source/classic-store-New/pull/4) | 2e7ce2ab281c62b9af3f66512d2a579eaf045b42 | [UNV] | Not required | Hash approval stated in PR #4 body | DB-003 | PR-04-migrations.md | 2026-11-23 |
| DB-005 | V5 | Payments/refunds/shipping/returns/outbox | Merged | [#4](https://github.com/mosalah00x-source/classic-store-New/pull/4) | 2e7ce2ab281c62b9af3f66512d2a579eaf045b42 | [UNV] | Not required | Hash approval stated in PR #4 body | DB-004 | PR-04-migrations.md | 2026-11-23 |
| DB-006 | V6 | Distance and warehouse allocation functions | Merged | [#4](https://github.com/mosalah00x-source/classic-store-New/pull/4) | 2e7ce2ab281c62b9af3f66512d2a579eaf045b42 | [UNV] | Not required | Hash approval stated in PR #4 body | DB-005 | PR-04-migrations.md | 2026-11-23 |
| DB-007 | V7 | Reservation uniqueness and order-item integrity guards | Merged | [#4](https://github.com/mosalah00x-source/classic-store-New/pull/4) | 2e7ce2ab281c62b9af3f66512d2a579eaf045b42 | [UNV] | Not required | Hash approval stated in PR #4 body | DB-006 | PR-04-migrations.md | 2026-11-23 |
| DB-008 | ADM-1 | Add EDITOR role to store.user_role safely through Flyway | Planned | — | — | — | Not required | — | ADM-1 approval | Planned; no task file | 2026-11-23 |
| DB-009 | ADM-1 | Append-only audit_log table and DB-enforced no-update/no-delete controls | Planned | — | — | — | Not required | — | ADM-1 approval | Planned; no task file | 2026-11-23 |
| DB-010 | ADM-2 / categories | Enforce max category depth of two and prevent cycles; archive constraints | Planned | — | — | — | Not required | — | ADM-2; ADMIN-0 decisions | Planned; no task file | 2026-11-23 |
| DB-011 | Category seed | Seed 15 parent + 9 child categories from reference HTML only | Planned | — | — | — | Not required | — | HTML source validation; DB-010 | Planned; no task file | 2026-11-23 |
| DB-012 | ADM-6 | Store image metadata with relative storage key/path; no absolute path or localhost URL | Planned | — | — | — | Not required | — | Storage adapter design | Planned; no task file | 2026-11-23 |

## Operations / CI / hosting (OPS)

| ID | Legacy ID | Title / scope | Status | PR | Merge SHA | CI on Merge | Visual QA | PO approval | Dependencies | Task file | Last checked |
|---|---|---|---|---|---|---|---|---|---|---|---|
| OPS-001 | CI-01 | Include docs paths in backend-ci path filters (temporary fix) | Merged | [#32](https://github.com/mosalah00x-source/classic-store-New/pull/32) | 4303bfe8941301cb1314a0805e7e0ae8c8a0c1bc | [Run #110](https://github.com/mosalah00x-source/classic-store-New/actions/runs/45154657899) success, 3/3 on exact Merge SHA | Not required | [USER] User confirmed merge; no separate GitHub approval link found | — | PR-32.md | 2026-11-23 |
| OPS-002 | CI architecture | Replace workflow-level filters safely while preserving required contexts | Deferred | — | — | — | Not required | — | OPS-001 | Planned; no file | 2026-11-23 |
| OPS-003 | Branch protection | Document/verify required check contexts | Planned | — | — | — | Not required | — | CI architecture | Planned; no file | 2026-11-23 |
| OPS-004 | Local stack | Repeatable local Backend + PostgreSQL startup/health/migration flow | Planned | — | — | — | Not required | — | — | Planned; no file | 2026-11-23 |
| OPS-005 | Cloud release | Hosting after local completion and acceptance | Deferred | — | — | — | Not required | — | Local acceptance + Q4 | Planned; no file | 2026-11-23 |
| OPS-006 | Backup/monitoring | Production backup, restore drill and monitoring | Deferred | — | — | — | Not required | — | OPS-005 | Planned; no file | 2026-11-23 |
| OPS-007 | ENV-01 | Add frontend/.env.example and verify .gitignore exception | Planned | — | — | — | Not required | — | Verify actual env variables; separate PR after DOC-01 | Planned; no file | 2026-11-23 |
| OPS-008 | Image storage | Local-first upload/storage adapter; cloud provider choice deferred | Planned | — | — | — | Not required | — | ADM-6 | ADM-EPIC.md | 2026-11-23 |

## Security (SEC)

| ID | Legacy ID | Title / scope | Status | PR | Merge SHA | CI on Merge | Visual QA | PO approval | Dependencies | Task file | Last checked |
|---|---|---|---|---|---|---|---|---|---|---|---|
| SEC-001 | Q4 | Independent security review — mandatory release gate | Planned | — | — | — | Not required | — | Before production | ADMIN-0/release roadmap | 2026-11-23 |
| SEC-002 | Admin negative tests | ADMIN/EDITOR forbidden-access tests | Planned | — | — | — | Not required | — | ADM-1 implementation | Planned; no file | 2026-11-23 |
| SEC-003 | npm audit | Review seven medium findings; no automatic npm audit fix | Planned | — | — | — | Not required | — | Dependency inventory | Planned; no file | 2026-11-23 |
| SEC-004 | Secrets | Secret inventory, rotation and environment separation | Planned | — | — | — | Not required | — | Local/deployment config | Planned; no file | 2026-11-23 |

## Quality assurance (QA)

| ID | Legacy ID | Title / scope | Status | PR | Merge SHA | CI on Merge | Visual QA | PO approval | Dependencies | Task file | Last checked |
|---|---|---|---|---|---|---|---|---|---|---|---|
| QA-001 | F3 shots | Home EN Dark, EN 390, AR 390 Dark | Planned | — | — | — | Pending | Scoped concession only; remaining states open | FE-006 | Planned; no file | 2026-11-23 |
| QA-002 | BN-verify | Bottom nav at 390px/current FrontendApp | Planned | — | — | — | Pending | [UNV] | FE-007 | Planned; no file | 2026-11-23 |
| QA-003 | F4 shots | Catalog card visual acceptance | Planned | — | — | — | Pending | [UNV] | FE-008 | Planned; no file | 2026-11-23 |
| QA-004 | FIX-MM shots | Mega Menu/favorite Light/Dark, AR/EN, desktop/mobile | Planned | — | — | — | Pending | [UNV] | FE-009 | Planned; no file | 2026-11-23 |
| QA-005 | ADM-8 E2E | Admin hardening, E2E, accessibility and acceptance | Planned | — | — | — | Not required | — | ADM-1–ADM-7 | ADMIN-0 roadmap | 2026-11-23 |
| QA-006 | Accessibility/performance | Storefront accessibility/performance acceptance | Planned | — | — | — | Pending | — | FE implementation | Planned; no file | 2026-11-23 |

## Documentation (DOC)

| ID | Legacy ID | Title / scope | Status | PR | Merge SHA | CI on Merge | Visual QA | PO approval | Dependencies | Task file | Last checked |
|---|---|---|---|---|---|---|---|---|---|---|---|
| DOC-001 | DOC-01 | Project reference and completion audit | In review | [#31](https://github.com/mosalah00x-source/classic-store-New/pull/31) | — | Audit-start Head 5da1c20 / Run #116 partial; checkpoint Head fb727a2 / Run #135 queued/in progress; final-head recheck pending | Not required | Pending PO review | — | [PR-31-DOC-01.md](./PR-31-DOC-01.md) | 2026-11-23 |
| DOC-002 | DOC-02 | Task register, template, per-task records and reconciliation | In review | [#31](https://github.com/mosalah00x-source/classic-store-New/pull/31) | — | New Head CI pending | Not required | Pending | DOC-001 | [DOC-02.md](./DOC-002-tasks-system.md) | 2026-11-23 |
| DOC-003 | ADMIN-0 | Admin inventory, design and approved decisions | In review | [#31](https://github.com/mosalah00x-source/classic-store-New/pull/31) | — | New Head CI pending | Not required | Design decisions approved; PR #31 pending | — | ../ADMIN-0.md | 2026-11-23 |
| DOC-004 | ADM-1-plan | Report-only ADM-1 plan | In review | [#31](https://github.com/mosalah00x-source/classic-store-New/pull/31) | — | New Head CI pending | Not required | Implementation not authorized | DOC-001 + written PO authorization | ../ADM-1-plan.md | 2026-11-23 |

## Rules

- PR #22–#30 are merged. Their Head CI runs are verified success; the Merge-SHA lookup returned no PR-triggered runs for the frontend merge commits, so Merge CI remains [UNV].
- PR #32 Merge-SHA push Run #110 is success with all three jobs on exact SHA 4303bfe….
- PR #31 remains Draft/unmerged. The previous Head 96c8648… had Run #115 success 3/3; DOC-02 requires a new Head run.
- Never mark Done based on merge or Head CI alone. Update this register after every merge.


## Additional task-register controls

- **Visual QA vocabulary:** Not required / Pending / Passed / Failed. For FE-006 (F3), only the PO-conceded subset is covered; remaining screenshots stay Pending. FE-007 (BN), FE-008 (F4) and FE-009 (#30) remain Pending.
- **PR #31 validation:** the earlier Head `96c8648…` Run #115 (3/3) is historical. Audit-start Head `5da1c20…` Run #116 was partial. Checkpoint Head `fb727a2…` Run #135 was queued/in progress (api-lint passed; verify migrations running) before two task-record updates; recheck the final Head after all DOC-02 commits.
- **Task detail links:** PR #22–#30 and #32 are in this directory; PR #4 migration record remains PR-04-migrations.md; PR #31 and DOC-02 use the exact filenames linked in the DOC table.
