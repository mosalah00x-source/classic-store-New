# Frontend API and identity flow (T-08)

## API configuration

Set `NEXT_PUBLIC_API_BASE_URL` to the backend API base URL, including `/api/v1`, for example the API origin used by the deployment. When omitted, the client uses the same-origin `/api/v1` path.

## Implemented identity flows

- Sign in with email or phone and password.
- Register with email or phone (the backend enforces that at least one is supplied), then sign in.
- Request password recovery with the backend's non-enumerating response.
- Reset a password using the reset token passed as the `token` query parameter.
- Load the signed-in profile and perform client logout.
- Refresh an expired access token once and retry the protected request; concurrent refresh attempts are shared.

## Token handling decision

Access and refresh tokens are kept in JavaScript memory only. They are not written to localStorage, sessionStorage, cookies, or browser persistence. This reduces exposure from persistent browser storage, but a full page reload clears the session and requires signing in again. A future persistent-session design must use a backend-supported HttpOnly, Secure, SameSite cookie flow (or an explicitly reviewed equivalent); do not persist bearer tokens in browser storage as a quick fix.

The backend logout endpoint is stateless and returns 204. The frontend clears its in-memory tokens; it does not claim that the server invalidates previously issued tokens or logs the user out on other devices.

## Routes

- `/[locale]/login`
- `/[locale]/register`
- `/[locale]/forgot-password`
- `/[locale]/reset-password?token=...`
- `/[locale]/account`

Supported locales: `ar` (RTL) and `en` (LTR).
