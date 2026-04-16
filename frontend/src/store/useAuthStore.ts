import { create } from 'zustand'
import { authApi } from '../features/auth/api/authApi'
import type { User, LoginRequest, RegisterRequest } from '~/shared/types/auth'

interface AuthStore {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  isInitialized: boolean 

  register: (data: RegisterRequest) => Promise<void>
  login: (data: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  getMe: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: false,
  isInitialized: false,

  register: async (data) => {
    set({ isLoading: true })
    try {
      const res = await authApi.register(data)
      set({ user: res.data })
    } finally {
      set({ isLoading: false })
    }
  },

  login: async (data) => {
    set({ isLoading: true })
    try {
      const res = await authApi.login(data)
      set({ user: res.data, isLoggedIn: true })
    } finally {
      set({ isLoading: false })
    }
  },

  logout: async () => {
    await authApi.logout()
    set({ user: null, isLoggedIn: false })
  },

  getMe: async () => {
    try {
      const res = await authApi.getMe()
      set({ user: res.data, isLoggedIn: true })
    } catch {
      set({ user: null, isLoggedIn: false })
    } finally {
      set({ isInitialized: true })
    }
  }
}))