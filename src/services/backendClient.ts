type Json = Record<string, unknown> | unknown[] | string | number | boolean | null;

export type ApiErrorShape = {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

async function readJsonSafe(res: Response): Promise<any> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiFetch<T = any>(
  path: string,
  options?: {
    method?: string;
    body?: Json;
    confirm?: boolean;
    headers?: Record<string, string>;
  }
): Promise<T> {
  const res = await fetch(path, {
    method: options?.method || 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options?.confirm ? { 'X-Confirm': 'confirm' } : {}),
      ...(options?.headers || {}),
    },
    body: options?.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const data = await readJsonSafe(res);

  if (!res.ok) {
    const msg = (data && typeof data === 'object' && 'error' in data)
      ? (data as ApiErrorShape).error.message
      : `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data as T;
}
