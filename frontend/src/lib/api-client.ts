export type ApiError = {
  code: string;
  messageAr: string;
  messageEn: string;
  traceId: string;
  details: Record<string, unknown>;
};

export type User = {
  id: string;
  email: string | null;
  phone: string | null;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'ADMIN' | 'OPERATIONS' | 'WAREHOUSE' | 'SUPPORT';
};

export type RegisterRequest = {
  email?: string;
  phone?: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type LoginRequest = { identifier: string; password: string };

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload?: ApiError
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...init,
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => undefined)) as ApiError | undefined;
    const locale = typeof document !== 'undefined' && document.documentElement.lang === 'en' ? 'en' : 'ar';
    throw new ApiRequestError(
      payload ? (locale === 'ar' ? payload.messageAr : payload.messageEn) : 'Request failed',
      response.status,
      payload
    );
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const authApi = {
  register: (input: RegisterRequest) =>
    request<User>('/api/auth/register', { method: 'POST', body: JSON.stringify(input) }),
  login: (input: LoginRequest) =>
    request<{ user: User }>('/api/auth/login', { method: 'POST', body: JSON.stringify(input) }),
  me: () => request<User>('/api/auth/me'),
  logout: () => request<void>('/api/auth/logout', { method: 'POST' }),
  forgotPassword: (email: string) =>
    request<{ message: string }>('/api/auth/password/forgot', {
      method: 'POST',
      body: JSON.stringify({ email })
    }),
  resetPassword: (token: string, newPassword: string) =>
    request<void>('/api/auth/password/reset', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword })
    })
};
