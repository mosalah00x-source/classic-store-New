# T-06 — OpenAPI draft acceptance report

- Source: `docs/reference/Classic_Store_SRS_v1.1.1.md` sections 8.2 and 9.
- Scope: 69 operations; 23 error codes.
- Status: Draft PR only; no merge.
- Redocly CLI is pinned to `@redocly/cli@2.77.0`; CI prints the exact CLI version before linting.
- Latest commit after the requested corrections: `a9766d5b332ff804a2d7672c1538c6186edb2c0f`.
- Fresh CI evidence for this commit is pending; do not treat the previous run #16 as evidence for this commit.

## Operation coverage

Automated source-to-contract comparison: 69 expected rows; 69 operations; 69 unique operationIds; no missing or extra operationIds; 58 unique path entries (shared paths combine multiple HTTP methods).

1. `getProducts` — `GET /products`
2. `getProductsSlug` — `GET /products/{slug}`
3. `getCategories` — `GET /categories`
4. `getBrands` — `GET /brands`
5. `postAuthRegister` — `POST /auth/register`
6. `postAuthLogin` — `POST /auth/login`
7. `postAuthRefresh` — `POST /auth/refresh`
8. `postAuthLogout` — `POST /auth/logout`
9. `postAuthPasswordChange` — `POST /auth/password/change`
10. `postAuthPasswordForgot` — `POST /auth/password/forgot`
11. `postAuthPasswordReset` — `POST /auth/password/reset`
12. `getMe` — `GET /me`
13. `patchMe` — `PATCH /me`
14. `getMeAddresses` — `GET /me/addresses`
15. `postMeAddresses` — `POST /me/addresses`
16. `getMeAddressesId` — `GET /me/addresses/{id}`
17. `putMeAddressesId` — `PUT /me/addresses/{id}`
18. `deleteMeAddressesId` — `DELETE /me/addresses/{id}`
19. `getMeOrders` — `GET /me/orders`
20. `postCarts` — `POST /carts`
21. `getCartsId` — `GET /carts/{id}`
22. `putCartsIdItemsSku` — `PUT /carts/{id}/items/{sku}`
23. `deleteCartsIdItemsSku` — `DELETE /carts/{id}/items/{sku}`
24. `postCheckoutQuote` — `POST /checkout/quote`
25. `postCheckoutOrders` — `POST /checkout/orders`
26. `getOrdersId` — `GET /orders/{id}`
27. `postOrdersIdCancel` — `POST /orders/{id}/cancel`
28. `postOrdersIdPayments` — `POST /orders/{id}/payments`
29. `postPaymentsIdWebhooksProvider` — `POST /payments/{id}/webhooks/{provider}`
30. `getGuestOrdersToken` — `GET /guest/orders/{token}`
31. `postReturns` — `POST /returns`
32. `getReturnsId` — `GET /returns/{id}`
33. `getAdminProducts` — `GET /admin/products`
34. `postAdminProducts` — `POST /admin/products`
35. `getAdminProductsId` — `GET /admin/products/{id}`
36. `patchAdminProductsId` — `PATCH /admin/products/{id}`
37. `postAdminProductsIdArchive` — `POST /admin/products/{id}/archive`
38. `postAdminProductsIdVariants` — `POST /admin/products/{id}/variants`
39. `patchAdminVariantsSku` — `PATCH /admin/variants/{sku}`
40. `postAdminCategories` — `POST /admin/categories`
41. `getAdminCoupons` — `GET /admin/coupons`
42. `postAdminCoupons` — `POST /admin/coupons`
43. `patchAdminCouponsId` — `PATCH /admin/coupons/{id}`
44. `getAdminShippingZones` — `GET /admin/shipping-zones`
45. `postAdminShippingZones` — `POST /admin/shipping-zones`
46. `putAdminShippingZonesIdRates` — `PUT /admin/shipping-zones/{id}/rates`
47. `getAdminWarehouses` — `GET /admin/warehouses`
48. `postAdminWarehouses` — `POST /admin/warehouses`
49. `patchAdminWarehousesId` — `PATCH /admin/warehouses/{id}`
50. `getAdminInventory` — `GET /admin/inventory`
51. `postAdminInventoryAdjustments` — `POST /admin/inventory/adjustments`
52. `getAdminInventoryMovements` — `GET /admin/inventory/movements`
53. `getAdminOrders` — `GET /admin/orders`
54. `postAdminOrdersIdAllocate` — `POST /admin/orders/{id}/allocate`
55. `patchAdminFulfillmentsIdStatus` — `PATCH /admin/fulfillments/{id}/status`
56. `getAdminReturns` — `GET /admin/returns`
57. `postAdminReturnsIdApprove` — `POST /admin/returns/{id}/approve`
58. `postAdminReturnsIdReject` — `POST /admin/returns/{id}/reject`
59. `postAdminReturnsIdReceive` — `POST /admin/returns/{id}/receive`
60. `postAdminRefunds` — `POST /admin/refunds`
61. `getAdminUsers` — `GET /admin/users`
62. `postAdminUsers` — `POST /admin/users`
63. `patchAdminUsersIdRole` — `PATCH /admin/users/{id}/role`
64. `patchAdminUsersIdStatus` — `PATCH /admin/users/{id}/status`
65. `getAdminReportsSales` — `GET /admin/reports/sales`
66. `getAdminReportsInventory` — `GET /admin/reports/inventory`
67. `getAdminAuditLogs` — `GET /admin/audit-logs`
68. `postAdminBrands` — `POST /admin/brands`
69. `getAdminOrdersIdStatusHistory` — `GET /admin/orders/{id}/status-history`

## Authentication response corrections

- `POST /auth/password/forgot`: only `202`, `400`, and `429` are documented. The `202` response remains identical for existing and unknown accounts (DEC-15); no `401`, `403`, `404`, or `500` responses.
- `POST /auth/logout`: only `204`, `401`, and `500` are documented; no `400`, `403`, or `404` responses.

## Toolchain

- Redocly CLI: `@redocly/cli@2.77.0` (pinned; no `@latest`).

## Error catalog

All 23 SRS 8.2 codes are defined under `components.responses` with the specified HTTP status and both `messageAr` and `messageEn`. The shared Error schema requires `code`, `messageAr`, `messageEn`, `traceId`, and `details`.

## x-open-question locations

| OPEN | operationId(s) |
|---|---|
| OPEN-01 | `postOrdersIdPayments`, `postPaymentsIdWebhooksProvider` |
| OPEN-02 | `getAdminShippingZones`, `postAdminShippingZones`, `putAdminShippingZonesIdRates`, `patchAdminFulfillmentsIdStatus` |
| OPEN-03 | `postCheckoutQuote`, `postCheckoutOrders` |
| OPEN-04 | `postReturns`, `getReturnsId`, `getAdminReturns`, `postAdminReturnsIdApprove`, `postAdminReturnsIdReject`, `postAdminReturnsIdReceive` |
| OPEN-05 | `postCheckoutQuote`, `postCheckoutOrders` |
| OPEN-07 | `getMeAddresses`, `postMeAddresses`, `getMeAddressesId`, `putMeAddressesId`, `postCheckoutQuote`, `postCheckoutOrders` |
| OPEN-09 | `patchAdminUsersIdRole` |
| OPEN-11 | `getMeAddresses`, `postMeAddresses`, `getMeAddressesId`, `putMeAddressesId`, `postCheckoutOrders` |
| OPEN-12 | `getMeAddresses`, `postMeAddresses`, `getMeAddressesId`, `putMeAddressesId`, `postCheckoutQuote`, `postCheckoutOrders` |

Confirmed absent from `x-open-question`: OPEN-08, OPEN-10, and all NEW-Q identifiers.

## CI

- Workflow: `backend-ci`.
- `api-lint`: pending a fresh run on commit `a9766d5b332ff804a2d7672c1538c6186edb2c0f`.
- `verify-migrations`: pending a fresh run on the same commit.
- `backend`: pending a fresh run on the same commit.
- Previous run #16 is historical evidence only and is not used as the acceptance result for the latest commit.
- The workflow path filters include `docs/api/**` for push and pull_request events.
- No required-check ruleset was changed.

## Pull request

- Draft PR: https://github.com/mosalah00x-source/classic-store-New/pull/5
- Base: `BackendApp`.
- Head: `feature/t06-openapi-v1-draft`.
- Merge status: not merged. Keep Draft until SRS Baseline approvals are complete.
