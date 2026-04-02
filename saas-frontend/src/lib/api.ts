export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  accessToken?: string | null
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (options.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || 'GET',
    credentials: 'include',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  const raw = await response.text()
  const data = raw ? (JSON.parse(raw) as unknown) : null

  if (!response.ok) {
    const message =
      (typeof data === 'object' &&
        data !== null &&
        'message' in data &&
        typeof (data as { message?: unknown }).message === 'string' &&
        (data as { message: string }).message) ||
      (typeof data === 'object' &&
        data !== null &&
        'error' in data &&
        typeof (data as { error?: unknown }).error === 'string' &&
        (data as { error: string }).error) ||
      `Request failed with status ${response.status}`

    throw new ApiError(message, response.status)
  }

  return data as T
}
