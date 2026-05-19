const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}/api/v1${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export function apiClient(accessToken?: string) {
  const authHeader = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  return {
    get: <T>(path: string) =>
      request<T>(path, { headers: authHeader }),

    post: <T>(path: string, body?: unknown) =>
      request<T>(path, {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
        headers: authHeader,
      }),

    patch: <T>(path: string, body?: unknown) =>
      request<T>(path, {
        method: 'PATCH',
        body: body ? JSON.stringify(body) : undefined,
        headers: authHeader,
      }),

    delete: <T>(path: string) =>
      request<T>(path, { method: 'DELETE', headers: authHeader }),

    postForm: <T>(path: string, formData: FormData) =>
      fetch(`${API_URL}/api/v1${path}`, {
        method: 'POST',
        body: formData,
        headers: authHeader,
      }).then((res) => {
        if (!res.ok) throw new Error('Upload failed');
        return res.json() as Promise<T>;
      }),
  };
}
