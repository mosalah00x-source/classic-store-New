# Task record — OPS-007 / ENV-01

- **Title:** Add frontend environment example and verify ignore exception
- **Status:** In review
- **PR:** [#34](https://github.com/mosalah00x-source/classic-store-New/pull/34)
- **Branch:** `frontend/env-01-example`
- **Base:** `FrontendApp`
- **Head SHA:** `19667498fe74fadbad33fd697400c7385572aa0e`

## Scope and implementation

Added only `frontend/.env.example` with:
- `API_MOCKING=true`
- `API_MOCK_SCENARIO=showcase`
- `API_BASE_URL=http://localhost:8080` as a non-production placeholder.

The example explains copying it to `.env.local`, restarting the Next.js dev server after changes, and that the showcase mock does not send network requests to the placeholder. A parseable URL is still required because `catalog-api.ts` builds the mock request URL using `new URL(path, apiBaseUrl())`.

No secrets are included. No existing README/docs setup instructions for these variables were found.

## Ignore verification

`frontend/.gitignore` contains:
```
.env*
!.env.example
```
The PR changed-file list confirms `frontend/.env.example` is tracked and added.

## CI

- [Frontend CI Run #130 / 45170312530](https://github.com/mosalah00x-source/classic-store-New/actions/runs/45170312530)
- Exact Head SHA: `19667498fe74fadbad33fd697400c7385572aa0e`
- Result: frontend job completed/success; all steps including install, lint, typecheck, unit tests and production build completed successfully.

## Review gates

Draft; not Ready, not merged. No merge SHA exists.
