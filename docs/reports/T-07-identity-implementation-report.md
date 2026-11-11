# T-07 Identity Implementation Report

Status: in progress; draft PR only; not merged.

## Baseline
- Base: `BackendApp`.
- Feature: `feature/t07-identity`.
- OpenAPI baseline SHA: `596b683283d46b172bb58dc2f075c808e3bb4e23`.
- SRS: `docs/reference/Classic_Store_SRS_v1.1.1.md`.
- V1 is unchanged; no migration added.

## Exact T-07 operations (14)
1. POST /auth/register
2. POST /auth/login
3. POST /auth/refresh
4. POST /auth/logout
5. POST /auth/password/change
6. POST /auth/password/forgot
7. POST /auth/password/reset
8. GET /me
9. PATCH /me
10. GET /me/addresses
11. POST /me/addresses
12. GET /me/addresses/{id}
13. PUT /me/addresses/{id}
14. DELETE /me/addresses/{id}

Excluded: GET /me/orders.

## CI evidence
To be completed against the final feature head SHA after implementation tests and OpenAPI lint have run.

## Known dependencies and limits
- OPEN-11 phone format and OPEN-12 authoritative governorate/city reference data remain unresolved; implementation must not invent either.
- Mail provider host/credentials, JWT signing secret, reset HMAC secret, and reset frontend URL must be supplied through deployment environment.
- SRS approval is single-owner; independent Security Review is required before production (AR-03).
