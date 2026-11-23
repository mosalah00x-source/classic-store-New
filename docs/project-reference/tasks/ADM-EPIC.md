# Epic record — ADM-EPIC / AdminPanel roadmap

- **ID:** ADM-EPIC
- **Legacy IDs:** ADM-0 through ADM-8; ADM-1-plan
- **Title:** AdminPanel foundation and operational capabilities
- **Domain:** Cross-domain (Frontend, Backend, Database, Security, QA)
- **Status:** Planned — ADM-0 decisions are approved; implementation phases remain planned unless separately evidenced.
- **Repository:** mosalah00x-source/classic-store-New
- **Docs branch:** docs/project-reference

## Purpose and governing documents

- [ADMIN-0 inventory and PO decisions](../ADMIN-0.md) — approved inventory, role/permission model and architecture decisions.
- [ADM-1 report-only implementation plan](../ADM-1-plan.md) — plan only; not authorization to implement.
- [Open items](../open-items.md).

## Phase register

| Phase | Domain | Scope | Status | Dependencies / gate |
|---|---|---|---|---|
| ADM-0 | DOC / Product | Inventory, design, role/permission decisions and roadmap | Done as decision record only | PO decisions recorded in ADMIN-0; no application implementation implied |
| ADM-1 | BE / SEC / DB | Authentication, ADMIN/EDITOR roles, permissions and append-only audit log | Planned | DOC-01 review/merge and separate written PO approval of ADM-1 plan |
| ADM-2 | BE / DB | Admin APIs for categories, products, variants and images | Planned | ADM-1 foundation; approved contracts and schema |
| ADM-3 | FE / OPS / SEC | Admin frontend shell and same-origin Next.js BFF session | Planned | ADM-1 authentication/session contracts |
| ADM-4 | FE / BE / DB | Category management | Planned | ADM-2 APIs; two-level category invariant |
| ADM-5 | FE / BE / DB | Product and price management | Planned | ADM-2 APIs; approved price contract |
| ADM-6 | FE / BE / DB / OPS | Images, homepage content and swappable storage adapter | Planned | Storage adapter design; local-first implementation |
| ADM-7 | FE / BE / DB | Orders, users and settings | Planned | Cart and checkout foundations; ADM-1 permissions |
| ADM-8 | QA / SEC / OPS | Hardening, E2E, negative authorization tests and acceptance | Planned | Prior phases implemented; independent security gate Q4 |

## Approved decisions that constrain implementation [PO]

- `ADMIN` is the administrator role; add `EDITOR`. Do not modify `OPERATIONS`, `WAREHOUSE` or `SUPPORT`.
- Use the approved permission identifiers: `PRODUCT_READ`, `PRODUCT_WRITE`, `PRODUCT_PUBLISH`, `PRODUCT_ARCHIVE`, `CATEGORY_WRITE`, `PRICE_WRITE`, `INVENTORY_WRITE`, `USER_MANAGE`, `AUDIT_READ`, `SETTINGS_WRITE`.
- Next.js BFF holds the session in same-origin HttpOnly/SameSite cookies and calls Backend server-side. No browser JWT/localStorage. Refresh, immediate revocation, CSRF and CORS details remain ADM-1/ADM-3 work.
- `price` and `compareAtPrice` must be positive and compareAtPrice greater than price; Backend computes `discountPercent`; frontend does not calculate/store it.
- “New” is computed by Backend from `created_at` within the last 30 days.
- Categories are at most two levels; enforce in service and DB, prevent cycles, and disallow archiving a category with active children. Product handling on category archive requires explicit confirmation and relationship preservation.
- Seed 15 parent + 9 child categories from the HTML reference; do not invent children for an arrow-only category.
- First Admin bootstrap is one-time via command/env, requires password change, and must not use a hardcoded default password. Public registration creates CUSTOMER only.
- Audit log is append-only; no UPDATE/DELETE.
- Price threshold / manager approval is deferred; audit log is sufficient for the current scope.

## Explicit non-authorization

ADM-1 remains a report and plan. No Backend implementation, migrations, API changes, role changes or security-sensitive code is authorized by this record. Work starts only after the DOC-01 gate and the PO's explicit written approval of the plan.

## Claim verification

| Claim | Evidence | Tag | Verified date |
|---|---|---|---|
| ADM-1 plan exists and is report-only | `docs/project-reference/ADM-1-plan.md` | [GH] | 2026-11-23 |
| ADMIN-0 decisions listed above | `docs/project-reference/ADMIN-0.md` and PO decision record | [PO] | 2026-11-23 |
| ADM phase implementation state | No implementation PR evidence recorded here | [UNV] | 2026-11-23 |

## Review stamps

- Reviewed by ChatGPT on 2026-11-23 against ADMIN-0.md and ADM-1-plan.md; result: roadmap/decisions recorded, no implementation authorized.
- Approved by PO: ADM-0 decisions are approved; this epic does not constitute approval to begin ADM-1 implementation.
