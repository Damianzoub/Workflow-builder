'use client'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'

export default function SecuritySection() {
  const { user } = useAuthStore()

  function handleChangePassword() {
    toast.success(`Password reset email sent to ${user?.email}`)
  }

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800 p-6">
      <h2 className="mb-1 text-sm font-semibold text-white">Password</h2>
      <p className="mb-4 text-xs text-gray-500">
        We&apos;ll send a reset link to your email address.
      </p>
      <Button
        variant="outline"
        onClick={handleChangePassword}
        className="border-gray-600 bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white"
      >
        Change password
      </Button>
    </div>
  )
}
