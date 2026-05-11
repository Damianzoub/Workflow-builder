import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { MockUser } from '@/types'

interface AuthStore {
  user: MockUser | null
  isLoggedIn: boolean
  login: (user: MockUser) => void
  logout: () => void
}

const safeSessionStorage = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') return null
    return sessionStorage.getItem(key)
  },
  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') return
    sessionStorage.setItem(key, value)
  },
  removeItem: (key: string) => {
    if (typeof window === 'undefined') return
    sessionStorage.removeItem(key)
  },
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      login: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => safeSessionStorage),
    }
  )
)
