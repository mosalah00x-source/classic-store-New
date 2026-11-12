# T-07 Identity Implementation Report

Status: implemented on `feature/t07-identity`; PR #6 remains Draft and unmerged. Product Owner approval has not been granted.

## Baseline
- Base: `BackendApp`.
- Feature: `feature/t07-identity`.
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

## Test inventory and operation coverage

The previous verified suite contained 19 tests (13 in IdentityIntegrationTest, 1 IdentityOpenApiContractTest, 1 BackendApplicationTests, and 4 ApiContractIntegrationTest). Three HTTP integration tests have now been added, bringing the expected total to **22 tests**. CI must confirm this count on the new head.

| SRS operation | Test method(s) | Coverage type |
|---|---|---|
| POST /auth/register | `registerNeverAcceptsClientSuppliedRole`; `registerLoginRefreshLogoutAndMeFollowStatelessTokenRules` | HTTP integration |
| POST /auth/login | `registerLoginRefreshLogoutAndMeFollowStatelessTokenRules`; `loginAndForgotRateLimitsUseSrsThresholds` | HTTP integration |
| POST /auth/refresh | `registerLoginRefreshLogoutAndMeFollowStatelessTokenRules`; `passwordChangeDoesNotInvalidateExistingRefreshToken` | HTTP integration |
| POST /auth/logout | `registerLoginRefreshLogoutAndMeFollowStatelessTokenRules` | HTTP integration |
| POST /auth/password/change | `passwordChangeDoesNotInvalidateExistingRefreshToken` | HTTP integration |
| POST /auth/password/forgot | `forgotPasswordAlwaysReturnsSameAcceptedResponse`; `loginAndForgotRateLimitsUseSrsThresholds` | HTTP integration |
| POST /auth/password/reset | `passwordResetEndpointChangesPasswordSuccessfully`; `passwordResetEndpointRejectsReplayAfterSuccessfulReset`; `passwordResetEndpointRejectsExpiredTokenOverHttp` | HTTP integration |
| GET /me | `registerLoginRefreshLogoutAndMeFollowStatelessTokenRules`; `nonCustomerRoleCannotAccessCustomerAccountEndpoints`; `malformedBearerTokenReturnsInvalidToken` | HTTP integration |
| PATCH /me | `profilePatchLeavesOmittedFieldsUnchanged` | HTTP integration |
| GET /me/addresses | `customerCanCreateReadUpdateAndDeleteOwnAddress` | HTTP integration |
| POST /me/addresses | `customerCanCreateReadUpdateAndDeleteOwnAddress` | HTTP integration |
| GET /me/addresses/{id} | `customerCanCreateReadUpdateAndDeleteOwnAddress`; `foreignAddressIsNotReadableWritableOrDeletable` | HTTP integration |
| PUT /me/addresses/{id} | `customerCanCreateReadUpdateAndDeleteOwnAddress`; `foreignAddressIsNotReadableWritableOrDeletable` | HTTP integration |
| DELETE /me/addresses/{id} | `customerCanCreateReadUpdateAndDeleteOwnAddress`; `foreignAddressIsNotReadableWritableOrDeletable` | HTTP integration |

## AT-16 through AT-21 traceability

| Acceptance test | Test method(s) | Evidence level |
|---|---|---|
| AT-16 Address Ownership | `foreignAddressIsNotReadableWritableOrDeletable` | HTTP integration; verifies 404 for foreign read/update/delete and confirms the row remains |
| AT-17 Password Reset Expiry | `passwordResetEndpointRejectsExpiredTokenOverHttp`; `resetFingerprintRejectsExpiredToken` | HTTP integration plus service-level HMAC/expiry assertion |
| AT-18 Password Reset Reuse / Invalidation | `passwordResetEndpointChangesPasswordSuccessfully`; `passwordResetEndpointRejectsReplayAfterSuccessfulReset`; `resetFingerprintAllowsReuseUntilPasswordHashChanges` | HTTP integration plus service-level fingerprint assertion |
| AT-19 Password Change Sessions | `passwordChangeDoesNotInvalidateExistingRefreshToken` | HTTP integration |
| AT-20 Refresh Stateless | `registerLoginRefreshLogoutAndMeFollowStatelessTokenRules` | HTTP integration |
| AT-21 Logout Stateless | `registerLoginRefreshLogoutAndMeFollowStatelessTokenRules` | HTTP integration |

The three newly added reset tests exercise the actual `POST /api/v1/auth/password/reset` controller route with MockMvc. The success test verifies the persisted password hash changes and matches the new password; the replay test verifies the same token is rejected after success and cannot change the password again; the expiry test sends an expired token through the HTTP endpoint and verifies rejection without changing the stored hash.

The remaining reset fingerprint tests are intentionally service-level tests and do not substitute for the new endpoint tests.

## CI evidence

The previous green run (43057303642) was on the earlier head and is not evidence for the new tests. The test commit is `cf90cdc41d32bd29a79899771f376e5eb7604207`. The report update itself will create another commit and CI must be checked against the resulting final PR head. Do not treat CI as passed until the latest run for the current PR head is green.

Required checks: `backend`, `verify migrations`, and `api-lint`. The expected Maven test count is 22 (0 failures, 0 errors, 0 skipped).

## Known dependencies and limits

- OPEN-11 phone format and OPEN-12 authoritative governorate/city reference data remain unresolved; implementation must not invent either.
- A separate `DATA_DICTIONARY_DETAILED_AR` file was not present in the checked repository or Project/Library files. Data mapping uses SRS v1.1.1 and V1 DDL only.
- The in-process auth rate limiter is single-instance defense-in-depth; production multi-instance deployments must enforce distributed limits at a gateway/WAF using trusted client-IP forwarding.
- Configure `CORS_ALLOWED_ORIGINS`, `JWT_SECRET_BASE64`, `PASSWORD_RESET_FINGERPRINT_SECRET_BASE64`, mail host/credentials, and `PASSWORD_RESET_URL` in deployment. TLS termination and trusted proxy settings are infrastructure responsibilities.
- DEC-GOV-01 / AR-03: internal single-owner approval is not independent. Independent Security Review is a mandatory production release gate.

## Governance

- PR #6 must remain Draft and must not be merged without explicit Product Owner approval.
- No changes were made to `BackendApp`; work remains on `feature/t07-identity`.
