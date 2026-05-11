import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../auth-store'
import type { MockUser } from '@/types'

const testUser: MockUser = {
  id: 'u1',
  name: 'Test User',
  email: 'test@example.com',
  avatarInitials: 'TU',
}

beforeEach(() => {
  useAuthStore.setState({ user: null, isLoggedIn: false })
  sessionStorage.clear()
})

describe('useAuthStore', () => {
  it('starts with no user and isLoggedIn false', () => {
    expect(useAuthStore.getState().user).toBeNull()
    expect(useAuthStore.getState().isLoggedIn).toBe(false)
  })

  it('login sets user and isLoggedIn', () => {
    useAuthStore.getState().login(testUser)
    expect(useAuthStore.getState().user).toEqual(testUser)
    expect(useAuthStore.getState().isLoggedIn).toBe(true)
  })

  it('logout clears user and isLoggedIn', () => {
    useAuthStore.getState().login(testUser)
    useAuthStore.getState().logout()
    expect(useAuthStore.getState().user).toBeNull()
    expect(useAuthStore.getState().isLoggedIn).toBe(false)
  })
})
