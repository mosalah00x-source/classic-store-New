# Task record — DB-001..DB-007 / PR #4

- **Legacy IDs:** V1–V7 / T-05 Flyway migrations
- **Title:** Pinned Flyway migrations for PostgreSQL
- **Domain:** Database
- **Status:** Merged
- **Repository:** mosalah00x-source/classic-store-New
- **Docs branch:** docs/project-reference

## GitHub evidence [GH]

- PR: [#4 — feat(backend): add pinned Flyway migrations for PostgreSQL](https://github.com/mosalah00x-source/classic-store-New/pull/4)
- Task branch: feature/t05-flyway-migrations; base: BackendApp.
- Head SHA: cc360e6cbc0fea7e815199c0c5b0d0e491475810.
- Merge SHA: [UNV] in this reconciliation; PR metadata confirms merged.
- Merged at: 2026-11-10 13:05:24 UTC.
- Merged by / method: [UNV].
- PR body cites Run 42811449596 success on the exact Head SHA. Merge-SHA CI: [UNV].
- PO approval: PR body records explicit approval of source conversion and seven generated hashes; exact underlying approval artifact URL was not captured.

## Migration inventory — files inspected on BackendApp

| Version / file | Verified scope |
|---|---|
| V1 baseline_types_identity | store schema/extensions, enums, countries, governorates, cities, users, addresses, settings |
| V2 catalog | brands, categories, products, product-category relation, variants, images, coupons, indexes |
| V3 inventory | warehouses, inventory balances, inventory movements, indexes |
| V4 cart_orders_reservations | carts/items, orders/items/history, fulfillments/items, inventory reservations |
| V5 payments_shipping_returns_outbox | payments/events/refunds, shipping zones/rates, returns/items, outbox events |
| V6 functions_allocation | distance calculation, eligible warehouse ranking, nearest-warehouse reservation/allocation functions |
| V7 integrity_and_reservation_hardening | ACTIVE-only reservation uniqueness and order-item mutation guard after allocation/fulfillment; PR #4 describes three guard functions |

## Approved conversion constraints recorded in PR #4

- Source SQL pinned to commit 0c6e9f1ad9614aba87e2a91b5e7f5f3c72b4ee85.
- Source SHA-256: a5c265bf2cda1c457dbe989994ef4314d3ff932472e65dbf190934dea0664ff8.
- Seven generated migration hashes are recorded in PR #4; changes require fresh written PO approval.
- CI applies V1–V7 to clean PostgreSQL 16, reruns Flyway for no-op behavior, checks schema invariants and tamper detection.

## Database / API / visual QA

- Database: seven migrations as listed above.
- API contract: no OpenAPI path change is asserted by this record.
- Visual QA: Not required.

## Follow-up

Any migration/source lock/hash change requires new explicit PO approval. Confirm Merge SHA, actor/method and Merge-SHA CI during a future reconciliation.

## Claim verification

| Claim | Evidence | Tag | Verified |
|---|---|---|---|
| PR #4 merged | Live PR metadata | [GH] | 2026-11-23 |
| Head SHA and migration files | PR metadata and changed-file list | [GH] | 2026-11-23 |
| Head CI success | PR body Run link and exact Head SHA | [GH] | 2026-11-23 |
| Merge-SHA CI | No evidence captured | [UNV] | 2026-11-23 |
| PO hash approval | Explicit approval text in PR body; approval artifact URL not captured | [PO] | 2026-11-23 |

## Review stamps

- Reviewed by ChatGPT on 2026-11-23 against live PR #4 metadata, changed-file list and BackendApp migration files; migration inventory recorded, Merge SHA/actor/method/merge-CI remain [UNV].
- Approved by PO: explicit approval is evidenced in PR #4 body; exact approval artifact URL [UNV].
