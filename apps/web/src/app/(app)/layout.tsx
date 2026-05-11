'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'
import AppShell from '@/components/layout/AppShell'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuthStore()
  const router = useRouter()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated && !isLoggedIn) {
      router.replace('/login')
    }
  }, [hydrated, isLoggedIn, router])

  if (!hydrated || !isLoggedIn) return null

  return <AppShell>{children}</AppShell>
}
