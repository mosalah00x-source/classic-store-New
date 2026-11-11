# T-07 Identity — Derived Contract Decisions

Status: implementation decisions authorized by Product Owner on 11 November 2026. This document does not amend SRS v1.1.1 or introduce endpoints.

## Baseline and scope
- SRS v1.1.1 sections 5.1, 9.2–9.4, 10.4, 8.2, 14.
- OpenAPI baseline: `docs/api/openapi.yaml`, original blob SHA `596b683283d46b172bb58dc2f075c808e3bb4e23`.
- V1 schema is authoritative for identity persistence: `store.users`, `store.addresses`, `store.countries`, `store.governorates`, `store.cities`.
- Only the 14 T-07 operations are in scope. `GET /me/orders` is not included.
- No migration, V8, or `password_reset_tokens` table is introduced.

## Derived request/response shapes
The SRS does not define all wire-level identity DTOs. The following minimal shapes are derived only from the named V1 columns and the functional requirements:
- Register: `email?`, `phone?`, `password`, `firstName`, `lastName`. At least one of email or phone is required. Client-supplied role is forbidden; persisted role is always CUSTOMER.
- Login: `identifier`, `password`. Identifier resolves to the unique email or phone.
- Refresh: refresh JWT is supplied using the existing `refreshTokenAuth` Bearer security scheme. It is a refresh token, not an access token.
- Logout: authenticated access Bearer; 204; client discards local tokens. No server-side revocation.
- Change password: `currentPassword`, `newPassword`; access token required.
- Forgot: `email`; always returns 202 and the exact same response body regardless of account existence.
- Reset: `newPassword` body and reset token through the existing `resetTokenAuth` Bearer scheme.
- Profile: response contains only `id,email,phone,firstName,lastName,role`; PATCH accepts profile fields only. Role and active status are never writable by this endpoint.
- Address request/response uses the V1 `store.addresses` columns represented in camelCase: recipientName, phone, countryCode, governorateId, cityId, district, street, building, apartment, postalCode, latitude, longitude, isDefault. IDs are UUIDs for users/addresses and bigint for governorates/cities.
- Address ownership is enforced in the SQL predicate `user_id = authenticated subject`; missing and foreign-owned IDs both return 404.

## Security and token decisions
- Access JWT TTL 15 minutes; refresh JWT TTL no more than 7 days (DEC-09).
- JWTs are stateless; refresh/logout/password change do not revoke previously issued refresh tokens (DEC-08/10, AR-02).
- JWT carries a token type claim; access endpoints reject refresh tokens and refresh rejects access tokens.
- Passwords are BCrypt hashes only; raw passwords never persist.
- Reset token is a URL-safe opaque envelope containing user UUID, expiry epoch, and HMAC-SHA256 MAC. MAC input is `user_id || expires_at || current_password_hash`; the key is a separate server secret (environment configuration). The password hash is neither embedded nor reversibly encoded in the token. Comparison is constant-time.
- Reset link is valid for 15 minutes and reusable until one successful password update. The password update uses a compare-and-set predicate on the previous hash; once updated, all links generated against the old hash fail. Password change has the same link-invalidating side effect. This is the approved DEC-GOV-02 implementation detail; it does not change AR-01 semantics.
- No reset token or password is written to logs. Forgot response is non-enumerating; mail delivery failures must not change the public response shape.

## Data validation boundaries
- Email uniqueness uses V1's `store.citext`; phone uniqueness uses V1's unique constraint.
- V1 has no approved Egypt-specific phone format or authoritative governorate/city seed list (OPEN-11/12). Do not claim a business-approved Egyptian numbering policy or invent location IDs.
- Country/governorate/city relationships are validated against existing enabled reference data when available; no reference data is seeded by T-07.
- Address coordinates must be both null or both present and within latitude/longitude bounds, matching V1 checks.
- Register never accepts a role. The only role created by public registration is CUSTOMER. Roles remain the five V1 enum values.

## Acceptance traceability
- FR-AUTH-01: register uniqueness/hash/required identifier — identity service + registration integration tests.
- FR-AUTH-02: login/refresh/logout/password operations and INVALID_TOKEN — auth controller/filter + token tests.
- FR-AUTH-03: server-side role enforcement — Spring Security role tests.
- FR-AUTH-04: address CRUD and reference validation — address repository/controller tests.
- AT-16: owner-scoped SQL for read/update/delete.
- AT-17/18: 15-minute expiry and reusable-before-success reset link.
- AT-19/20/21: old refresh validity after password change, stateless refresh, logout 204.
- Register role injection: request rejects unknown role and persists CUSTOMER.

## Governance
- DEC-GOV-01: Product Owner also performed Tech Lead, QA, Operations, and Security approval. This is internal single-owner approval, not independent review. AR-03 accepted; no production release until an independent Security Review is recorded.
- DEC-GOV-02: reset token MAC is bound to current password hash as described above.
