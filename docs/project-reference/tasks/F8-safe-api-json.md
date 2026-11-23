# Task record — FE-011 / F8

- **Title:** Safe JSON response handling for catalog and product-detail API paths
- **Status:** In review
- **PR:** [#35](https://github.com/mosalah00x-source/classic-store-New/pull/35)
- **Branch:** `frontend/f8-safe-api-json`
- **Base:** `FrontendApp`
- **Current Head SHA:** `812b3fc8d8b6da7cd4352c295d8cdcb8801dc1b0`

## Scope and implementation

- Added shared `readJsonResponse`, which reads response text and safely returns undefined for empty or malformed JSON.
- `catalog-api.ts` and `product-detail-api.ts` classify empty/invalid successful responses, 204 responses, non-OK responses without usable JSON bodies and fetch/network failures using their existing typed request-error classes.
- The catalog pagination path uses the safe parser and retains the existing error state and Retry action.
- Existing API payloads and error messages are preserved when valid JSON is returned.
- Local mock handling remains in place; a dedicated test confirms the `showcase` catalog mock returns 18 products and 9 categories without calling network fetch.
- No dependencies, API contract changes, translation changes or backend edits.

## Tests added

For both catalog and product detail API functions:
1. Empty body with 200.
2. Empty body with 500.
3. Invalid JSON with 200.
4. 204 with no body.
5. Network failure.
6. Normal successful JSON response.

An additional test verifies the showcase mock path.

## CI history

- Run #131 / 45170519549: failed on an earlier Head.
- Run #132 / 45170582159: failed on Head `0611b903fd2cd55c0dc7df02b81ae30e20eb2a55`; lint passed, TypeScript failed because the test helper assigned to readonly `process.env.NODE_ENV`. Unit tests and build were skipped.
- Fixed the test helper by removing the NODE_ENV assignment.
- Final-Head Run #133 / [45170837047](https://github.com/mosalah00x-source/classic-store-New/actions/runs/45170837047) targets exact Head `812b3fc8d8b6da7cd4352c295d8cdcb8801dc1b0`; frontend job completed/success and every step (install, lint, typecheck, unit tests, production build and cleanup) completed successfully.

## Review gates

Draft; do not mark Ready or merge until final Head CI and all steps pass.
