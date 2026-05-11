'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, GitBranch, User, LogOut } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/workflows', label: 'Workflows',  icon: GitBranch },
  { href: '/account',   label: 'Account',    icon: User },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  function handleLogout() {
    logout()
    router.replace('/login')
  }

  return (
    <aside className="flex h-screen w-56 flex-col bg-gray-800 border-r border-gray-700">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-700">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-indigo-600 text-xs font-bold text-white">
          WF
        </div>
        <span className="text-sm font-semibold text-white">Workflow AI</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-indigo-600/20 text-indigo-400'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-gray-700 px-3 py-3">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600/30 text-xs font-semibold text-indigo-300">
            {user?.avatarInitials ?? '?'}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-white">{user?.name}</p>
            <p className="truncate text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
