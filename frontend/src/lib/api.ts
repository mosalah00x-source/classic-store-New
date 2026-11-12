export type TokenResponse = { accessToken: string; refreshToken: string; tokenType: 'Bearer'; expiresIn: number };
export type User = { id: string; email: string | null; phone: string | null; firstName: string; lastName: string; role: string };
export type ApiErrorBody = { code?: string; messageAr?: string; messageEn?: string; traceId?: string; details?: Record<string, unknown> };
export class ApiError extends Error {
  constructor(public readonly status: number, public readonly body: ApiErrorBody) {
    super(body.messageEn ?? 'The request could not be completed.');
    this.name = 'ApiError';
  }
  get code() { return this.body.code ?? 'INTERNAL_ERROR'; }
}
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api/v1').replace(/\/$/, '');
let session: TokenResponse | null = null;
let refreshInFlight: Promise<boolean> | null = null;
export function setSession(tokens: TokenResponse | null) { session = tokens; }
export function getSession() { return session; }
async function readError(response: Response): Promise<ApiError> {
  let body: ApiErrorBody = {};
  try { body = await response.json() as ApiErrorBody; } catch { /* non-JSON response */ }
  return new ApiError(response.status, body);
}
async function refreshSession(): Promise<boolean> {
  if (!session?.refreshToken) return false;
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session!.refreshToken}` }
      });
      if (!response.ok) { session = null; return false; }
      session = await response.json() as TokenResponse;
      return true;
    } catch {
      session = null;
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}
export type RequestOptions = RequestInit & { auth?: boolean; bearerToken?: string; retryOnUnauthorized?: boolean };
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, bearerToken, retryOnUnauthorized = true, ...init } = options;
  const send = async (retry: boolean): Promise<Response> => {
    const headers = new Headers(init.headers);
    if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    const token = bearerToken ?? (auth ? session?.accessToken : undefined);
    if (token) headers.set('Authorization', `Bearer ${token}`);
    const response = await fetch(`${API_BASE}${path}`, { ...init, headers });
    if (response.status === 401 && retry && retryOnUnauthorized && auth && !bearerToken && await refreshSession()) {
      return send(false);
    }
    return response;
  };
  const response = await send(true);
  if (!response.ok) throw await readError(response);
  if (response.status === 204) return undefined as T;
  return await response.json() as T;
}
export const identityApi = {
  register: (input: { email?: string; phone?: string; password: string; firstName: string; lastName: string }) =>
    apiRequest<User>('/auth/register', { method: 'POST', auth: false, body: JSON.stringify(input) }),
  login: (identifier: string, password: string) =>
    apiRequest<TokenResponse>('/auth/login', { method: 'POST', auth: false, body: JSON.stringify({ identifier, password }) }),
  me: () => apiRequest<User>('/me'),
  logout: async () => {
    try { await apiRequest<void>('/auth/logout', { method: 'POST' }); }
    finally { session = null; }
  },
  forgotPassword: (email: string) =>
    apiRequest<{ message: string }>('/auth/password/forgot', { method: 'POST', auth: false, body: JSON.stringify({ email }) }),
  resetPassword: (token: string, newPassword: string) =>
    apiRequest<void>('/auth/password/reset', { method: 'POST', auth: false, bearerToken: token, body: JSON.stringify({ newPassword }) }),
  changePassword: (currentPassword: string, newPassword: string) =>
    apiRequest<void>('/auth/password/change', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) })
};
