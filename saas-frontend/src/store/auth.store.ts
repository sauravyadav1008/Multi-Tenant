import { create } from 'zustand'
import { ApiError, apiRequest } from '../lib/api'

export type AuthUser = {
  id: string
  email: string
  role: string
  tenantId: string
  createdAt: string
}

type AuthState = {
  user: AuthUser | null
  accessToken: string | null
  bootstrapping: boolean
  isLoading: boolean
  error: string | null
  isAuthenticated: () => boolean
  initializeAuth: () => Promise<void>
  register: (payload: {
    email: string
    password: string
    companyName: string
  }) => Promise<void>
  login: (payload: { email: string; password: string }) => Promise<void>
  refresh: () => Promise<void>
  me: () => Promise<void>
  logout: () => Promise<void>
  logoutAll: () => Promise<void>
}

type AuthPayload = {
  accessToken: string
  user: AuthUser
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  bootstrapping: true,
  isLoading: false,
  error: null,

  isAuthenticated: () => Boolean(get().user && get().accessToken),

  initializeAuth: async () => {
    if (!get().bootstrapping) {
      return
    }

    try {
      await get().refresh()
    } catch {
      set({ user: null, accessToken: null })
    } finally {
      set({ bootstrapping: false })
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null })

    try {
      const data = await apiRequest<AuthPayload>('/auth/register', {
        method: 'POST',
        body: payload,
      })

      set({ user: data.user, accessToken: data.accessToken, isLoading: false })
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Registration failed'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  login: async (payload) => {
    set({ isLoading: true, error: null })

    try {
      const data = await apiRequest<AuthPayload>('/auth/login', {
        method: 'POST',
        body: payload,
      })

      set({ user: data.user, accessToken: data.accessToken, isLoading: false })
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Login failed'
      set({ error: message, isLoading: false })
      throw error
    }
  },

  refresh: async () => {
    const data = await apiRequest<AuthPayload>('/auth/refresh', {
      method: 'POST',
    })

    set({ user: data.user, accessToken: data.accessToken, error: null })
  },

  me: async () => {
    const token = get().accessToken
    if (!token) {
      throw new Error('Missing access token')
    }

    const data = await apiRequest<{ user: AuthUser }>('/auth/me', {
      accessToken: token,
    })

    set({ user: data.user })
  },

  logout: async () => {
    set({ isLoading: true, error: null })

    try {
      await apiRequest<void>('/auth/logout', {
        method: 'POST',
      })
    } finally {
      set({ user: null, accessToken: null, isLoading: false })
    }
  },

  logoutAll: async () => {
    const token = get().accessToken

    set({ isLoading: true, error: null })

    try {
      if (token) {
        await apiRequest<void>('/auth/logout-all', {
          method: 'POST',
          accessToken: token,
        })
      }
    } finally {
      set({ user: null, accessToken: null, isLoading: false })
    }
  },
}))
