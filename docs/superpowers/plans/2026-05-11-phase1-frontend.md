# Phase 1 Frontend Implementation Plan
# Damian Workflow Builder

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a fully navigable Next.js 15 frontend with auth pages, dashboard, workflows table, and account page — all wired with a dark sidebar layout and hardcoded mock data.

**Architecture:** pnpm workspace with `apps/web/` (Next.js 15 App Router). Two route groups: `(auth)` for centered login/register/forgot-password pages, `(app)` for the sidebar-guarded dashboard/workflows/account pages. A single Zustand persist store handles auth state; all other data comes from `src/mock/` files imported directly by client components.

**Tech Stack:** pnpm · Next.js 15 · TypeScript · Tailwind CSS · shadcn/ui · Zustand (+ persist middleware) · react-hook-form · zod · Recharts · Sonner · Vitest · @testing-library/react

---

## File Map

```
workflow-builder/                    ← git repo root
├── package.json                     ← pnpm workspace root (no deps)
├── pnpm-workspace.yaml
└── apps/
    └── web/
        ├── package.json
        ├── next.config.ts
        ├── tsconfig.json
        ├── vitest.config.ts
        ├── components.json          ← shadcn/ui config
        └── src/
            ├── app/
            │   ├── layout.tsx       ← root layout, adds "dark" class
            │   ├── page.tsx         ← redirects → /dashboard or /login
            │   ├── globals.css
            │   ├── (auth)/
            │   │   ├── layout.tsx   ← centered, no sidebar
            │   │   ├── login/page.tsx
            │   │   ├── register/page.tsx
            │   │   └── forgot-password/page.tsx
            │   └── (app)/
            │       ├── layout.tsx   ← AppShell + auth guard (client)
            │       ├── dashboard/page.tsx
            │       ├── workflows/page.tsx
            │       └── account/page.tsx
            ├── components/
            │   ├── layout/
            │   │   ├── AppShell.tsx
            │   │   └── Sidebar.tsx
            │   ├── auth/
            │   │   ├── AuthCard.tsx
            │   │   ├── LoginForm.tsx
            │   │   ├── RegisterForm.tsx
            │   │   └── ForgotPasswordForm.tsx
            │   ├── dashboard/
            │   │   ├── StatCard.tsx
            │   │   ├── RunsChart.tsx
            │   │   ├── ActivityFeed.tsx
            │   │   └── WorkflowsPreview.tsx
            │   ├── workflows/
            │   │   ├── WorkflowsTable.tsx
            │   │   ├── StatusBadge.tsx
            │   │   └── NewWorkflowButton.tsx
            │   └── account/
            │       ├── ProfileForm.tsx
            │       └── SecuritySection.tsx
            ├── lib/
            │   ├── validations.ts   ← zod schemas for all 3 forms
            │   └── sort-workflows.ts← pure sort function (testable)
            ├── mock/
            │   ├── user.ts
            │   ├── stats.ts
            │   ├── activity.ts
            │   └── workflows.ts
            ├── stores/
            │   └── auth-store.ts
            ├── types/
            │   └── index.ts
            └── test/
                └── setup.ts
```

---

## Task 1: pnpm Workspace + Next.js Scaffold

**Files:**
- Create: `package.json` (repo root)
- Create: `pnpm-workspace.yaml`
- Create: `apps/web/` (via create-next-app)

- [ ] **Step 1: Create workspace root package.json**

  In the repo root (`workflow-builder/`), write:

  ```json
  {
    "name": "workflow-builder",
    "private": true,
    "scripts": {
      "dev": "pnpm -F web dev",
      "build": "pnpm -F web build",
      "test": "pnpm -F web test"
    }
  }
  ```

- [ ] **Step 2: Create pnpm-workspace.yaml**

  ```yaml
  packages:
    - 'apps/*'
  ```

- [ ] **Step 3: Scaffold the Next.js app**

  ```bash
  mkdir -p apps
  pnpm create next-app@latest apps/web \
    --typescript \
    --tailwind \
    --eslint \
    --app \
    --src-dir \
    --import-alias "@/*" \
    --use-pnpm
  ```

  If prompted about Turbopack, choose **No**. All other options are covered by the flags.

- [ ] **Step 4: Install additional dependencies**

  ```bash
  cd apps/web
  pnpm add zustand recharts sonner
  pnpm add react-hook-form @hookform/resolvers zod
  pnpm add -D vitest @vitejs/plugin-react jsdom \
    @testing-library/react @testing-library/user-event \
    @testing-library/jest-dom
  ```

- [ ] **Step 5: Add shadcn/ui**

  ```bash
  # still inside apps/web/
  npx shadcn@latest init
  ```

  When prompted:
  - Style: **Default**
  - Base colour: **Slate**
  - CSS variables: **Yes**

  Then add the components we'll use:

  ```bash
  npx shadcn@latest add button input label form badge card
  ```

  Sonner comes from the `sonner` package directly (already installed in step 4).

- [ ] **Step 6: Verify the dev server starts**

  ```bash
  pnpm dev
  ```

  Expected: Next.js starts on `http://localhost:3000`. The default Next.js page loads.

- [ ] **Step 7: Add .superpowers to .gitignore**

  In the repo root `.gitignore`, add:

  ```
  .superpowers/
  ```

- [ ] **Step 8: Commit**

  ```bash
  git add .
  git commit -m "feat: scaffold pnpm workspace + Next.js 15 app with shadcn/ui"
  ```

---

## Task 2: Tailwind Dark Theme + Global Styles

**Files:**
- Modify: `apps/web/src/app/globals.css`
- Modify: `apps/web/src/app/layout.tsx`

- [ ] **Step 1: Update globals.css with dark theme tokens**

  Replace the contents of `apps/web/src/app/globals.css`:

  ```css
  @import "tailwindcss";
  @import "tw-animate-css";

  @custom-variant dark (&:is(.dark *));

  @theme inline {
    --color-background: var(--background);
    --color-foreground: var(--foreground);
    --color-card: var(--card);
    --color-card-foreground: var(--card-foreground);
    --color-primary: var(--primary);
    --color-primary-foreground: var(--primary-foreground);
    --color-secondary: var(--secondary);
    --color-secondary-foreground: var(--secondary-foreground);
    --color-muted: var(--muted);
    --color-muted-foreground: var(--muted-foreground);
    --color-border: var(--border);
    --color-input: var(--input);
    --color-ring: var(--ring);
    --radius-sm: calc(var(--radius) - 4px);
    --radius-md: calc(var(--radius) - 2px);
    --radius-lg: var(--radius);
    --radius-xl: calc(var(--radius) + 4px);
  }

  :root {
    --radius: 0.5rem;
    --background: oklch(0.145 0 0);
    --foreground: oklch(0.985 0 0);
    --card: oklch(0.205 0 0);
    --card-foreground: oklch(0.985 0 0);
    --primary: oklch(0.546 0.245 262.881);
    --primary-foreground: oklch(0.985 0 0);
    --secondary: oklch(0.269 0 0);
    --secondary-foreground: oklch(0.985 0 0);
    --muted: oklch(0.269 0 0);
    --muted-foreground: oklch(0.708 0 0);
    --border: oklch(0.269 0 0);
    --input: oklch(0.269 0 0);
    --ring: oklch(0.546 0.245 262.881);
  }

  * {
    border-color: var(--color-border);
  }

  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
  }
  ```

- [ ] **Step 2: Update root layout.tsx**

  Replace `apps/web/src/app/layout.tsx`:

  ```tsx
  import type { Metadata } from 'next'
  import { Geist, Geist_Mono } from 'next/font/google'
  import { Toaster } from 'sonner'
  import './globals.css'

  const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
  const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

  export const metadata: Metadata = {
    title: 'Workflow Builder',
    description: 'Visual AI workflow automation',
  }

  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en" className="dark">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {children}
          <Toaster richColors position="top-right" />
        </body>
      </html>
    )
  }
  ```

- [ ] **Step 3: Verify styles**

  ```bash
  pnpm dev
  ```

  Expected: page background is near-black. No console errors.

- [ ] **Step 4: Commit**

  ```bash
  git add apps/web/src/app/globals.css apps/web/src/app/layout.tsx
  git commit -m "feat: configure dark theme + Sonner toaster"
  ```

---

## Task 3: Vitest Setup

**Files:**
- Create: `apps/web/vitest.config.ts`
- Create: `apps/web/src/test/setup.ts`
- Modify: `apps/web/package.json`

- [ ] **Step 1: Create vitest.config.ts**

  ```ts
  // apps/web/vitest.config.ts
  import { defineConfig } from 'vitest/config'
  import react from '@vitejs/plugin-react'
  import path from 'path'

  export default defineConfig({
    plugins: [react()],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  })
  ```

- [ ] **Step 2: Create test setup file**

  ```ts
  // apps/web/src/test/setup.ts
  import '@testing-library/jest-dom'
  ```

- [ ] **Step 3: Add test script to apps/web/package.json**

  Open `apps/web/package.json` and add to the `"scripts"` section:

  ```json
  "test": "vitest run",
  "test:watch": "vitest"
  ```

- [ ] **Step 4: Write a smoke test to verify the setup works**

  Create `apps/web/src/test/smoke.test.ts`:

  ```ts
  import { describe, it, expect } from 'vitest'

  describe('test setup', () => {
    it('runs', () => {
      expect(1 + 1).toBe(2)
    })
  })
  ```

- [ ] **Step 5: Run the tests**

  ```bash
  cd apps/web && pnpm test
  ```

  Expected output:
  ```
  ✓ src/test/smoke.test.ts (1)
  Test Files  1 passed (1)
  ```

- [ ] **Step 6: Commit**

  ```bash
  git add apps/web/vitest.config.ts apps/web/src/test/ apps/web/package.json
  git commit -m "feat: add Vitest + Testing Library setup"
  ```

---

## Task 4: TypeScript Types + Mock Data

**Files:**
- Create: `apps/web/src/types/index.ts`
- Create: `apps/web/src/mock/user.ts`
- Create: `apps/web/src/mock/stats.ts`
- Create: `apps/web/src/mock/activity.ts`
- Create: `apps/web/src/mock/workflows.ts`

- [ ] **Step 1: Create shared TypeScript types**

  ```ts
  // apps/web/src/types/index.ts

  export interface MockUser {
    id: string
    name: string
    email: string
    avatarInitials: string
  }

  export type WorkflowStatus = 'active' | 'draft' | 'error'

  export interface Workflow {
    id: string
    name: string
    createdAt: string   // ISO date string YYYY-MM-DD
    modifiedAt: string  // ISO date string YYYY-MM-DD
    creator: string     // email
    status: WorkflowStatus
  }

  export type ActivityStatus = 'success' | 'error'

  export interface ActivityItem {
    id: string
    workflow: string
    status: ActivityStatus
    time: string
  }

  export interface Stats {
    totalWorkflows: number
    runsToday: number
    successRate: number  // percentage 0–100
    activeNow: number
    runsPerDay: number[] // 7 values, Mon–Sun
  }
  ```

- [ ] **Step 2: Create mock user**

  ```ts
  // apps/web/src/mock/user.ts
  import type { MockUser } from '@/types'

  export const mockUser: MockUser = {
    id: 'u1',
    name: 'Damianos Zoumpos',
    email: 'd.zoumpos04@gmail.com',
    avatarInitials: 'DZ',
  }
  ```

- [ ] **Step 3: Create mock stats**

  ```ts
  // apps/web/src/mock/stats.ts
  import type { Stats } from '@/types'

  export const mockStats: Stats = {
    totalWorkflows: 24,
    runsToday: 142,
    successRate: 98,
    activeNow: 3,
    runsPerDay: [40, 85, 62, 110, 78, 142, 101],
  }
  ```

- [ ] **Step 4: Create mock activity**

  ```ts
  // apps/web/src/mock/activity.ts
  import type { ActivityItem } from '@/types'

  export const mockActivity: ActivityItem[] = [
    { id: 'a1', workflow: 'Booking Agent',    status: 'success', time: '2h ago' },
    { id: 'a2', workflow: 'Support Bot',      status: 'error',   time: '4h ago' },
    { id: 'a3', workflow: 'Email Classifier', status: 'success', time: '6h ago' },
    { id: 'a4', workflow: 'Booking Agent',    status: 'success', time: '8h ago' },
  ]
  ```

- [ ] **Step 5: Create mock workflows**

  ```ts
  // apps/web/src/mock/workflows.ts
  import type { Workflow } from '@/types'

  export const mockWorkflows: Workflow[] = [
    { id: 'w1', name: 'Booking Agent',    createdAt: '2026-05-10', modifiedAt: '2026-05-11', creator: 'd.zoumpos04@gmail.com', status: 'active' },
    { id: 'w2', name: 'Email Classifier', createdAt: '2026-05-09', modifiedAt: '2026-05-10', creator: 'd.zoumpos04@gmail.com', status: 'active' },
    { id: 'w3', name: 'Support Bot',      createdAt: '2026-05-08', modifiedAt: '2026-05-09', creator: 'd.zoumpos04@gmail.com', status: 'error'  },
    { id: 'w4', name: 'Lead Qualifier',   createdAt: '2026-05-07', modifiedAt: '2026-05-08', creator: 'd.zoumpos04@gmail.com', status: 'draft'  },
    { id: 'w5', name: 'Invoice Parser',   createdAt: '2026-05-06', modifiedAt: '2026-05-07', creator: 'd.zoumpos04@gmail.com', status: 'active' },
    { id: 'w6', name: 'Onboarding Flow',  createdAt: '2026-05-05', modifiedAt: '2026-05-06', creator: 'd.zoumpos04@gmail.com', status: 'draft'  },
  ]
  ```

- [ ] **Step 6: Commit**

  ```bash
  git add apps/web/src/types/ apps/web/src/mock/
  git commit -m "feat: add TypeScript types and mock data"
  ```

---

## Task 5: Auth Store

**Files:**
- Create: `apps/web/src/stores/auth-store.ts`
- Create: `apps/web/src/stores/__tests__/auth-store.test.ts`

- [ ] **Step 1: Write the failing tests**

  ```ts
  // apps/web/src/stores/__tests__/auth-store.test.ts
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
  ```

- [ ] **Step 2: Run tests — expect FAIL**

  ```bash
  cd apps/web && pnpm test
  ```

  Expected: FAIL — `Cannot find module '../auth-store'`

- [ ] **Step 3: Implement the auth store**

  ```ts
  // apps/web/src/stores/auth-store.ts
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
  ```

- [ ] **Step 4: Run tests — expect PASS**

  ```bash
  cd apps/web && pnpm test
  ```

  Expected:
  ```
  ✓ src/stores/__tests__/auth-store.test.ts (3)
  Test Files  2 passed (2)
  ```

- [ ] **Step 5: Commit**

  ```bash
  git add apps/web/src/stores/
  git commit -m "feat: add Zustand auth store with sessionStorage persist"
  ```

---

## Task 6: Zod Validation Schemas

**Files:**
- Create: `apps/web/src/lib/validations.ts`
- Create: `apps/web/src/lib/__tests__/validations.test.ts`

- [ ] **Step 1: Write the failing tests**

  ```ts
  // apps/web/src/lib/__tests__/validations.test.ts
  import { describe, it, expect } from 'vitest'
  import { loginSchema, registerSchema, forgotPasswordSchema } from '../validations'

  describe('loginSchema', () => {
    it('accepts valid email and password', () => {
      const result = loginSchema.safeParse({ email: 'a@b.com', password: 'secret123' })
      expect(result.success).toBe(true)
    })

    it('rejects invalid email', () => {
      const result = loginSchema.safeParse({ email: 'not-an-email', password: 'secret123' })
      expect(result.success).toBe(false)
    })

    it('rejects password shorter than 6 characters', () => {
      const result = loginSchema.safeParse({ email: 'a@b.com', password: '123' })
      expect(result.success).toBe(false)
    })
  })

  describe('registerSchema', () => {
    it('accepts valid registration data', () => {
      const result = registerSchema.safeParse({
        name: 'Test User', email: 'a@b.com',
        password: 'secret123', confirmPassword: 'secret123',
      })
      expect(result.success).toBe(true)
    })

    it('rejects mismatched passwords', () => {
      const result = registerSchema.safeParse({
        name: 'Test User', email: 'a@b.com',
        password: 'secret123', confirmPassword: 'different',
      })
      expect(result.success).toBe(false)
    })

    it('rejects name shorter than 2 characters', () => {
      const result = registerSchema.safeParse({
        name: 'A', email: 'a@b.com',
        password: 'secret123', confirmPassword: 'secret123',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('forgotPasswordSchema', () => {
    it('accepts valid email', () => {
      const result = forgotPasswordSchema.safeParse({ email: 'a@b.com' })
      expect(result.success).toBe(true)
    })

    it('rejects invalid email', () => {
      const result = forgotPasswordSchema.safeParse({ email: 'bad' })
      expect(result.success).toBe(false)
    })
  })
  ```

- [ ] **Step 2: Run tests — expect FAIL**

  ```bash
  cd apps/web && pnpm test
  ```

  Expected: FAIL — `Cannot find module '../validations'`

- [ ] **Step 3: Implement validations**

  ```ts
  // apps/web/src/lib/validations.ts
  import { z } from 'zod'

  export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  })

  export const registerSchema = z
    .object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Invalid email address'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    })

  export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
  })

  export type LoginInput = z.infer<typeof loginSchema>
  export type RegisterInput = z.infer<typeof registerSchema>
  export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
  ```

- [ ] **Step 4: Run tests — expect PASS**

  ```bash
  cd apps/web && pnpm test
  ```

  Expected:
  ```
  ✓ src/lib/__tests__/validations.test.ts (6)
  Test Files  3 passed (3)
  ```

- [ ] **Step 5: Commit**

  ```bash
  git add apps/web/src/lib/
  git commit -m "feat: add zod validation schemas with tests"
  ```

---

## Task 7: Workflow Sort Utility

**Files:**
- Create: `apps/web/src/lib/sort-workflows.ts`
- Create: `apps/web/src/lib/__tests__/sort-workflows.test.ts`

- [ ] **Step 1: Write the failing tests**

  ```ts
  // apps/web/src/lib/__tests__/sort-workflows.test.ts
  import { describe, it, expect } from 'vitest'
  import { sortWorkflows } from '../sort-workflows'
  import { mockWorkflows } from '@/mock/workflows'

  describe('sortWorkflows', () => {
    it('sorts by name ascending', () => {
      const result = sortWorkflows(mockWorkflows, 'name', 'asc')
      expect(result[0].name).toBe('Booking Agent')
      expect(result[result.length - 1].name).toBe('Support Bot')
    })

    it('sorts by name descending', () => {
      const result = sortWorkflows(mockWorkflows, 'name', 'desc')
      expect(result[0].name).toBe('Support Bot')
    })

    it('sorts by createdAt ascending (oldest first)', () => {
      const result = sortWorkflows(mockWorkflows, 'createdAt', 'asc')
      expect(result[0].createdAt).toBe('2026-05-05')
    })

    it('sorts by modifiedAt descending (newest first)', () => {
      const result = sortWorkflows(mockWorkflows, 'modifiedAt', 'desc')
      expect(result[0].modifiedAt).toBe('2026-05-11')
    })

    it('does not mutate the original array', () => {
      const original = [...mockWorkflows]
      sortWorkflows(mockWorkflows, 'name', 'asc')
      expect(mockWorkflows[0]).toEqual(original[0])
    })
  })
  ```

- [ ] **Step 2: Run tests — expect FAIL**

  ```bash
  cd apps/web && pnpm test
  ```

  Expected: FAIL — `Cannot find module '../sort-workflows'`

- [ ] **Step 3: Implement sort-workflows**

  ```ts
  // apps/web/src/lib/sort-workflows.ts
  import type { Workflow } from '@/types'

  export type SortKey = 'name' | 'createdAt' | 'modifiedAt'
  export type SortDir = 'asc' | 'desc'

  export function sortWorkflows(
    workflows: Workflow[],
    key: SortKey,
    dir: SortDir
  ): Workflow[] {
    return [...workflows].sort((a, b) => {
      const valA = a[key]
      const valB = b[key]
      const cmp = valA < valB ? -1 : valA > valB ? 1 : 0
      return dir === 'asc' ? cmp : -cmp
    })
  }
  ```

- [ ] **Step 4: Run tests — expect PASS**

  ```bash
  cd apps/web && pnpm test
  ```

  Expected:
  ```
  ✓ src/lib/__tests__/sort-workflows.test.ts (5)
  Test Files  4 passed (4)
  ```

- [ ] **Step 5: Commit**

  ```bash
  git add apps/web/src/lib/sort-workflows.ts apps/web/src/lib/__tests__/sort-workflows.test.ts
  git commit -m "feat: add workflow sort utility with tests"
  ```

---

## Task 8: AppShell + Sidebar

**Files:**
- Create: `apps/web/src/components/layout/Sidebar.tsx`
- Create: `apps/web/src/components/layout/AppShell.tsx`

- [ ] **Step 1: Create Sidebar component**

  ```tsx
  // apps/web/src/components/layout/Sidebar.tsx
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
  ```

- [ ] **Step 2: Create AppShell component**

  ```tsx
  // apps/web/src/components/layout/AppShell.tsx
  import Sidebar from './Sidebar'

  export default function AppShell({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex h-screen bg-gray-900">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    )
  }
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add apps/web/src/components/layout/
  git commit -m "feat: add AppShell and Sidebar layout components"
  ```

---

## Task 9: Auth Layout + AuthCard

**Files:**
- Create: `apps/web/src/app/(auth)/layout.tsx`
- Create: `apps/web/src/components/auth/AuthCard.tsx`

- [ ] **Step 1: Create auth layout**

  ```tsx
  // apps/web/src/app/(auth)/layout.tsx
  export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
        {children}
      </div>
    )
  }
  ```

- [ ] **Step 2: Create AuthCard component**

  ```tsx
  // apps/web/src/components/auth/AuthCard.tsx
  import Link from 'next/link'

  interface AuthCardProps {
    title: string
    children: React.ReactNode
    footer?: { text: string; linkText: string; href: string }
  }

  export default function AuthCard({ title, children, footer }: AuthCardProps) {
    return (
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            WF
          </div>
          <span className="text-base font-semibold text-white">Workflow AI</span>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-gray-700 bg-gray-800 p-6 shadow-xl">
          <h1 className="mb-5 text-center text-xl font-semibold text-white">{title}</h1>
          {children}
        </div>

        {/* Footer link */}
        {footer && (
          <p className="mt-4 text-center text-sm text-gray-500">
            {footer.text}{' '}
            <Link href={footer.href} className="text-indigo-400 hover:text-indigo-300 hover:underline">
              {footer.linkText}
            </Link>
          </p>
        )}
      </div>
    )
  }
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add apps/web/src/app/\(auth\)/ apps/web/src/components/auth/AuthCard.tsx
  git commit -m "feat: add auth layout and AuthCard component"
  ```

---

## Task 10: Login Page

**Files:**
- Create: `apps/web/src/components/auth/LoginForm.tsx`
- Create: `apps/web/src/app/(auth)/login/page.tsx`

- [ ] **Step 1: Create LoginForm**

  ```tsx
  // apps/web/src/components/auth/LoginForm.tsx
  'use client'

  import { useState } from 'react'
  import { useForm } from 'react-hook-form'
  import { zodResolver } from '@hookform/resolvers/zod'
  import { useRouter } from 'next/navigation'
  import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
  import { Input } from '@/components/ui/input'
  import { Button } from '@/components/ui/button'
  import { loginSchema, type LoginInput } from '@/lib/validations'
  import { useAuthStore } from '@/stores/auth-store'
  import { mockUser } from '@/mock/user'

  export default function LoginForm() {
    const router = useRouter()
    const { login } = useAuthStore()
    const [loading, setLoading] = useState(false)

    const form = useForm<LoginInput>({
      resolver: zodResolver(loginSchema),
      defaultValues: { email: '', password: '' },
    })

    async function onSubmit(_data: LoginInput) {
      setLoading(true)
      await new Promise((r) => setTimeout(r, 800))
      login(mockUser)
      router.replace('/dashboard')
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-indigo-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-indigo-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </Form>
    )
  }
  ```

- [ ] **Step 2: Create login page**

  ```tsx
  // apps/web/src/app/(auth)/login/page.tsx
  import AuthCard from '@/components/auth/AuthCard'
  import LoginForm from '@/components/auth/LoginForm'

  export default function LoginPage() {
    return (
      <AuthCard
        title="Sign in"
        footer={{ text: "Don't have an account?", linkText: 'Register', href: '/register' }}
      >
        <LoginForm />
      </AuthCard>
    )
  }
  ```

- [ ] **Step 3: Verify manually**

  ```bash
  pnpm dev
  ```

  Open `http://localhost:3000/login`. The centered dark card with email/password fields should render. Submitting with any email + 6+ character password should redirect to `/dashboard` (shows 404 for now — that's expected).

- [ ] **Step 4: Commit**

  ```bash
  git add apps/web/src/components/auth/LoginForm.tsx apps/web/src/app/\(auth\)/login/
  git commit -m "feat: add login page with form validation"
  ```

---

## Task 11: Register Page

**Files:**
- Create: `apps/web/src/components/auth/RegisterForm.tsx`
- Create: `apps/web/src/app/(auth)/register/page.tsx`

- [ ] **Step 1: Create RegisterForm**

  ```tsx
  // apps/web/src/components/auth/RegisterForm.tsx
  'use client'

  import { useState } from 'react'
  import { useForm } from 'react-hook-form'
  import { zodResolver } from '@hookform/resolvers/zod'
  import { useRouter } from 'next/navigation'
  import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
  import { Input } from '@/components/ui/input'
  import { Button } from '@/components/ui/button'
  import { registerSchema, type RegisterInput } from '@/lib/validations'
  import { useAuthStore } from '@/stores/auth-store'
  import type { MockUser } from '@/types'

  export default function RegisterForm() {
    const router = useRouter()
    const { login } = useAuthStore()
    const [loading, setLoading] = useState(false)

    const form = useForm<RegisterInput>({
      resolver: zodResolver(registerSchema),
      defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    })

    async function onSubmit(data: RegisterInput) {
      setLoading(true)
      await new Promise((r) => setTimeout(r, 800))
      const initials = data.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
      const newUser: MockUser = {
        id: 'u-mock',
        name: data.name,
        email: data.email,
        avatarInitials: initials,
      }
      login(newUser)
      router.replace('/dashboard')
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Full name</FormLabel>
                <FormControl>
                  <Input placeholder="Damianos Zoumpos" className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-indigo-500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-indigo-500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-indigo-500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Confirm password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-indigo-500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white">
            {loading ? 'Creating account…' : 'Create account'}
          </Button>
        </form>
      </Form>
    )
  }
  ```

- [ ] **Step 2: Create register page**

  ```tsx
  // apps/web/src/app/(auth)/register/page.tsx
  import AuthCard from '@/components/auth/AuthCard'
  import RegisterForm from '@/components/auth/RegisterForm'

  export default function RegisterPage() {
    return (
      <AuthCard
        title="Create an account"
        footer={{ text: 'Already have an account?', linkText: 'Sign in', href: '/login' }}
      >
        <RegisterForm />
      </AuthCard>
    )
  }
  ```

- [ ] **Step 3: Verify manually**

  Open `http://localhost:3000/register`. Enter mismatched passwords — error should appear under "Confirm password". Submit valid data → redirect to `/dashboard`.

- [ ] **Step 4: Commit**

  ```bash
  git add apps/web/src/components/auth/RegisterForm.tsx apps/web/src/app/\(auth\)/register/
  git commit -m "feat: add register page with password match validation"
  ```

---

## Task 12: Forgot Password Page

**Files:**
- Create: `apps/web/src/components/auth/ForgotPasswordForm.tsx`
- Create: `apps/web/src/app/(auth)/forgot-password/page.tsx`

- [ ] **Step 1: Create ForgotPasswordForm**

  ```tsx
  // apps/web/src/components/auth/ForgotPasswordForm.tsx
  'use client'

  import { useState } from 'react'
  import { useForm } from 'react-hook-form'
  import { zodResolver } from '@hookform/resolvers/zod'
  import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
  import { Input } from '@/components/ui/input'
  import { Button } from '@/components/ui/button'
  import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations'

  export default function ForgotPasswordForm() {
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)

    const form = useForm<ForgotPasswordInput>({
      resolver: zodResolver(forgotPasswordSchema),
      defaultValues: { email: '' },
    })

    async function onSubmit(_data: ForgotPasswordInput) {
      setLoading(true)
      await new Promise((r) => setTimeout(r, 800))
      setLoading(false)
      setSent(true)
    }

    if (sent) {
      return (
        <div className="rounded-lg bg-indigo-600/10 border border-indigo-600/30 px-4 py-5 text-center">
          <p className="text-sm font-medium text-indigo-300">Check your inbox</p>
          <p className="mt-1 text-xs text-gray-400">
            We sent a password reset link to <strong className="text-gray-300">{form.getValues('email')}</strong>.
          </p>
        </div>
      )
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <p className="text-sm text-gray-400">
            Enter your email and we&apos;ll send you a reset link.
          </p>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-500 focus-visible:ring-indigo-500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white">
            {loading ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>
      </Form>
    )
  }
  ```

- [ ] **Step 2: Create forgot-password page**

  ```tsx
  // apps/web/src/app/(auth)/forgot-password/page.tsx
  import AuthCard from '@/components/auth/AuthCard'
  import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'

  export default function ForgotPasswordPage() {
    return (
      <AuthCard
        title="Reset password"
        footer={{ text: 'Remember your password?', linkText: 'Sign in', href: '/login' }}
      >
        <ForgotPasswordForm />
      </AuthCard>
    )
  }
  ```

- [ ] **Step 3: Verify manually**

  Open `http://localhost:3000/forgot-password`. Submit a valid email — the form should replace itself with the "Check your inbox" confirmation block.

- [ ] **Step 4: Commit**

  ```bash
  git add apps/web/src/components/auth/ForgotPasswordForm.tsx apps/web/src/app/\(auth\)/forgot-password/
  git commit -m "feat: add forgot password page with confirmation state"
  ```

---

## Task 13: (app) Layout + Auth Guard + Root Redirect

**Files:**
- Create: `apps/web/src/app/(app)/layout.tsx`
- Modify: `apps/web/src/app/page.tsx`

- [ ] **Step 1: Create (app) layout with auth guard**

  ```tsx
  // apps/web/src/app/(app)/layout.tsx
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
  ```

- [ ] **Step 2: Create root redirect**

  ```tsx
  // apps/web/src/app/page.tsx
  import { redirect } from 'next/navigation'

  export default function RootPage() {
    redirect('/dashboard')
  }
  ```

- [ ] **Step 3: Create placeholder dashboard page so the redirect lands somewhere**

  ```tsx
  // apps/web/src/app/(app)/dashboard/page.tsx
  export default function DashboardPage() {
    return <div className="text-white">Dashboard — coming in Task 16</div>
  }
  ```

- [ ] **Step 4: Verify the full auth flow**

  ```bash
  pnpm dev
  ```

  1. Open `http://localhost:3000` → redirects to `/dashboard` → redirects to `/login` (not logged in)
  2. Log in via `/login` → lands on `/dashboard` and sees the placeholder text
  3. Refresh → stays on `/dashboard` (sessionStorage rehydrates the store)
  4. Click sign out in sidebar → redirects back to `/login`

- [ ] **Step 5: Commit**

  ```bash
  git add apps/web/src/app/\(app\)/ apps/web/src/app/page.tsx
  git commit -m "feat: add app layout with auth guard and root redirect"
  ```

---

## Task 14: StatusBadge + WorkflowsTable

**Files:**
- Create: `apps/web/src/components/workflows/StatusBadge.tsx`
- Create: `apps/web/src/components/workflows/__tests__/StatusBadge.test.tsx`
- Create: `apps/web/src/components/workflows/WorkflowsTable.tsx`

- [ ] **Step 1: Write StatusBadge tests**

  ```tsx
  // apps/web/src/components/workflows/__tests__/StatusBadge.test.tsx
  import { describe, it, expect } from 'vitest'
  import { render, screen } from '@testing-library/react'
  import StatusBadge from '../StatusBadge'

  describe('StatusBadge', () => {
    it('renders "Active" for active status', () => {
      render(<StatusBadge status="active" />)
      expect(screen.getByText('Active')).toBeInTheDocument()
    })

    it('renders "Draft" for draft status', () => {
      render(<StatusBadge status="draft" />)
      expect(screen.getByText('Draft')).toBeInTheDocument()
    })

    it('renders "Error" for error status', () => {
      render(<StatusBadge status="error" />)
      expect(screen.getByText('Error')).toBeInTheDocument()
    })
  })
  ```

- [ ] **Step 2: Run tests — expect FAIL**

  ```bash
  cd apps/web && pnpm test
  ```

  Expected: FAIL — `Cannot find module '../StatusBadge'`

- [ ] **Step 3: Implement StatusBadge**

  ```tsx
  // apps/web/src/components/workflows/StatusBadge.tsx
  import { cn } from '@/lib/utils'
  import type { WorkflowStatus } from '@/types'

  const variants: Record<WorkflowStatus, string> = {
    active: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/20',
    draft:  'bg-gray-500/15 text-gray-400 ring-gray-500/20',
    error:  'bg-red-500/15 text-red-400 ring-red-500/20',
  }

  const labels: Record<WorkflowStatus, string> = {
    active: 'Active',
    draft:  'Draft',
    error:  'Error',
  }

  export default function StatusBadge({ status }: { status: WorkflowStatus }) {
    return (
      <span className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        variants[status]
      )}>
        {labels[status]}
      </span>
    )
  }
  ```

- [ ] **Step 4: Run tests — expect PASS**

  ```bash
  cd apps/web && pnpm test
  ```

  Expected:
  ```
  ✓ src/components/workflows/__tests__/StatusBadge.test.tsx (3)
  ```

- [ ] **Step 5: Implement WorkflowsTable**

  ```tsx
  // apps/web/src/components/workflows/WorkflowsTable.tsx
  'use client'

  import { useState } from 'react'
  import { ChevronUp, ChevronDown } from 'lucide-react'
  import StatusBadge from './StatusBadge'
  import { sortWorkflows, type SortKey, type SortDir } from '@/lib/sort-workflows'
  import { mockWorkflows } from '@/mock/workflows'

  export default function WorkflowsTable() {
    const [sortKey, setSortKey] = useState<SortKey>('modifiedAt')
    const [sortDir, setSortDir] = useState<SortDir>('desc')

    function handleSort(key: SortKey) {
      if (sortKey === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
      } else {
        setSortKey(key)
        setSortDir('asc')
      }
    }

    const sorted = sortWorkflows(mockWorkflows, sortKey, sortDir)

    function SortIcon({ col }: { col: SortKey }) {
      if (sortKey !== col) return <ChevronUp className="h-3 w-3 opacity-20" />
      return sortDir === 'asc'
        ? <ChevronUp className="h-3 w-3 text-indigo-400" />
        : <ChevronDown className="h-3 w-3 text-indigo-400" />
    }

    const thClass = 'px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500'
    const sortableThClass = `${thClass} cursor-pointer hover:text-gray-300 select-none`

    return (
      <div className="rounded-xl border border-gray-700 bg-gray-800 overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-gray-700">
            <tr>
              <th className={sortableThClass} onClick={() => handleSort('name')}>
                <span className="flex items-center gap-1">Name <SortIcon col="name" /></span>
              </th>
              <th className={sortableThClass} onClick={() => handleSort('createdAt')}>
                <span className="flex items-center gap-1">Created <SortIcon col="createdAt" /></span>
              </th>
              <th className={sortableThClass} onClick={() => handleSort('modifiedAt')}>
                <span className="flex items-center gap-1">Last Modified <SortIcon col="modifiedAt" /></span>
              </th>
              <th className={thClass}>Creator</th>
              <th className={thClass}>Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((wf) => (
              <tr key={wf.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-white">{wf.name}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{wf.createdAt}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{wf.modifiedAt}</td>
                <td className="px-4 py-3 text-sm text-indigo-400">{wf.creator}</td>
                <td className="px-4 py-3"><StatusBadge status={wf.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  ```

- [ ] **Step 6: Commit**

  ```bash
  git add apps/web/src/components/workflows/
  git commit -m "feat: add StatusBadge (tested) and WorkflowsTable with sort"
  ```

---

## Task 15: Workflows Page

**Files:**
- Create: `apps/web/src/components/workflows/NewWorkflowButton.tsx`
- Create: `apps/web/src/app/(app)/workflows/page.tsx`

- [ ] **Step 1: Create NewWorkflowButton**

  ```tsx
  // apps/web/src/components/workflows/NewWorkflowButton.tsx
  'use client'

  import { toast } from 'sonner'
  import { Button } from '@/components/ui/button'
  import { Plus } from 'lucide-react'

  export default function NewWorkflowButton() {
    return (
      <Button
        onClick={() => toast.info('Workflow editor coming in Phase 2')}
        className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2"
      >
        <Plus className="h-4 w-4" />
        New Workflow
      </Button>
    )
  }
  ```

- [ ] **Step 2: Create workflows page**

  ```tsx
  // apps/web/src/app/(app)/workflows/page.tsx
  import NewWorkflowButton from '@/components/workflows/NewWorkflowButton'
  import WorkflowsTable from '@/components/workflows/WorkflowsTable'

  export default function WorkflowsPage() {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Workflows</h1>
            <p className="mt-1 text-sm text-gray-400">All your agent workflows</p>
          </div>
          <NewWorkflowButton />
        </div>
        <WorkflowsTable />
      </div>
    )
  }
  ```

- [ ] **Step 3: Verify manually**

  Navigate to `/workflows` while logged in. The full sortable table with 6 rows should render. Clicking a column header sorts it. Clicking "+ New Workflow" shows a Sonner toast.

- [ ] **Step 4: Commit**

  ```bash
  git add apps/web/src/components/workflows/NewWorkflowButton.tsx apps/web/src/app/\(app\)/workflows/
  git commit -m "feat: add workflows page with sortable table"
  ```

---

## Task 16: Dashboard Components + Page

**Files:**
- Create: `apps/web/src/components/dashboard/StatCard.tsx`
- Create: `apps/web/src/components/dashboard/RunsChart.tsx`
- Create: `apps/web/src/components/dashboard/ActivityFeed.tsx`
- Create: `apps/web/src/components/dashboard/WorkflowsPreview.tsx`
- Modify: `apps/web/src/app/(app)/dashboard/page.tsx`

- [ ] **Step 1: Create StatCard**

  ```tsx
  // apps/web/src/components/dashboard/StatCard.tsx
  import { cn } from '@/lib/utils'

  interface StatCardProps {
    label: string
    value: string | number
    variant?: 'default' | 'indigo' | 'green' | 'amber'
  }

  const valueColours = {
    default: 'text-white',
    indigo:  'text-indigo-400',
    green:   'text-emerald-400',
    amber:   'text-amber-400',
  }

  export default function StatCard({ label, value, variant = 'default' }: StatCardProps) {
    return (
      <div className="rounded-xl border border-gray-700 bg-gray-800 px-5 py-4">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
        <p className={cn('mt-1 text-2xl font-bold', valueColours[variant])}>{value}</p>
      </div>
    )
  }
  ```

- [ ] **Step 2: Create RunsChart**

  ```tsx
  // apps/web/src/components/dashboard/RunsChart.tsx
  'use client'

  import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
  import { mockStats } from '@/mock/stats'

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const data = DAYS.map((day, i) => ({ day, runs: mockStats.runsPerDay[i] }))

  export default function RunsChart() {
    return (
      <div className="rounded-xl border border-gray-700 bg-gray-800 p-5">
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-gray-500">Runs this week</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={data} barSize={24}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 11 }}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 6, color: '#f9fafb', fontSize: 12 }}
              cursor={{ fill: 'rgba(99,102,241,0.1)' }}
            />
            <Bar dataKey="runs" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }
  ```

- [ ] **Step 3: Create ActivityFeed**

  ```tsx
  // apps/web/src/components/dashboard/ActivityFeed.tsx
  import { mockActivity } from '@/mock/activity'
  import { cn } from '@/lib/utils'

  export default function ActivityFeed() {
    return (
      <div className="rounded-xl border border-gray-700 bg-gray-800 p-5">
        <p className="mb-4 text-xs font-medium uppercase tracking-wide text-gray-500">Recent activity</p>
        <ul className="space-y-3">
          {mockActivity.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              <span className={cn(
                'h-2 w-2 flex-shrink-0 rounded-full',
                item.status === 'success' ? 'bg-emerald-400' : 'bg-red-400'
              )} />
              <span className="flex-1 text-sm text-gray-300">{item.workflow}</span>
              <span className="text-xs text-gray-500">{item.time}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  ```

- [ ] **Step 4: Create WorkflowsPreview**

  ```tsx
  // apps/web/src/components/dashboard/WorkflowsPreview.tsx
  import Link from 'next/link'
  import { mockWorkflows } from '@/mock/workflows'
  import StatusBadge from '@/components/workflows/StatusBadge'

  export default function WorkflowsPreview() {
    const preview = mockWorkflows.slice(0, 3)

    return (
      <div className="rounded-xl border border-gray-700 bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-700 px-5 py-3">
          <p className="text-sm font-medium text-white">Workflows</p>
          <Link href="/workflows" className="text-xs text-indigo-400 hover:text-indigo-300">
            View all →
          </Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700/50">
              <th className="px-5 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Name</th>
              <th className="px-5 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Modified</th>
              <th className="px-5 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500">Creator</th>
            </tr>
          </thead>
          <tbody>
            {preview.map((wf) => (
              <tr key={wf.id} className="border-b border-gray-700/30 last:border-0">
                <td className="px-5 py-3 text-sm font-medium text-white">{wf.name}</td>
                <td className="px-5 py-3 text-sm text-gray-400">{wf.modifiedAt}</td>
                <td className="px-5 py-3 text-sm text-indigo-400">{wf.creator}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  ```

- [ ] **Step 5: Build the dashboard page**

  Replace `apps/web/src/app/(app)/dashboard/page.tsx`:

  ```tsx
  // apps/web/src/app/(app)/dashboard/page.tsx
  import StatCard from '@/components/dashboard/StatCard'
  import RunsChart from '@/components/dashboard/RunsChart'
  import ActivityFeed from '@/components/dashboard/ActivityFeed'
  import WorkflowsPreview from '@/components/dashboard/WorkflowsPreview'
  import { mockStats } from '@/mock/stats'

  export default function DashboardPage() {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-400">Overview of your workflow activity</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Total Workflows" value={mockStats.totalWorkflows} />
          <StatCard label="Runs Today"       value={mockStats.runsToday}      variant="indigo" />
          <StatCard label="Success Rate"     value={`${mockStats.successRate}%`} variant="green" />
          <StatCard label="Active Now"       value={mockStats.activeNow}      variant="amber" />
        </div>

        {/* Chart + Activity */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-3"><RunsChart /></div>
          <div className="col-span-2"><ActivityFeed /></div>
        </div>

        {/* Workflows preview */}
        <WorkflowsPreview />
      </div>
    )
  }
  ```

- [ ] **Step 6: Verify manually**

  Navigate to `/dashboard` while logged in. You should see:
  - 4 stat cards in a row
  - Bar chart (indigo bars) next to the activity feed with coloured dots
  - Compact workflows table at the bottom with "View all →" link

- [ ] **Step 7: Commit**

  ```bash
  git add apps/web/src/components/dashboard/ apps/web/src/app/\(app\)/dashboard/
  git commit -m "feat: add dashboard page with stats, chart, activity, and preview"
  ```

---

## Task 17: Account Page

**Files:**
- Create: `apps/web/src/components/account/ProfileForm.tsx`
- Create: `apps/web/src/components/account/SecuritySection.tsx`
- Create: `apps/web/src/app/(app)/account/page.tsx`

- [ ] **Step 1: Create ProfileForm**

  ```tsx
  // apps/web/src/components/account/ProfileForm.tsx
  'use client'

  import { useForm } from 'react-hook-form'
  import { zodResolver } from '@hookform/resolvers/zod'
  import { z } from 'zod'
  import { toast } from 'sonner'
  import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
  import { Input } from '@/components/ui/input'
  import { Button } from '@/components/ui/button'
  import { useAuthStore } from '@/stores/auth-store'

  const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
  })

  type ProfileInput = z.infer<typeof profileSchema>

  export default function ProfileForm() {
    const { user, login } = useAuthStore()

    const form = useForm<ProfileInput>({
      resolver: zodResolver(profileSchema),
      defaultValues: { name: user?.name ?? '' },
    })

    function onSubmit(data: ProfileInput) {
      if (!user) return
      const initials = data.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
      login({ ...user, name: data.name, avatarInitials: initials })
      toast.success('Profile updated')
    }

    return (
      <div className="rounded-xl border border-gray-700 bg-gray-800 p-6">
        <h2 className="mb-5 text-sm font-semibold text-white">Profile</h2>

        {/* Avatar */}
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600/30 text-base font-semibold text-indigo-300">
            {user?.avatarInitials}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Full name</FormLabel>
                  <FormControl>
                    <Input className="bg-gray-900 border-gray-600 text-white focus-visible:ring-indigo-500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">Email</label>
              <Input
                value={user?.email ?? ''}
                disabled
                className="bg-gray-900/50 border-gray-700 text-gray-500 cursor-not-allowed"
              />
            </div>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white">
              Save changes
            </Button>
          </form>
        </Form>
      </div>
    )
  }
  ```

- [ ] **Step 2: Create SecuritySection**

  ```tsx
  // apps/web/src/components/account/SecuritySection.tsx
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
  ```

- [ ] **Step 3: Create account page**

  ```tsx
  // apps/web/src/app/(app)/account/page.tsx
  import ProfileForm from '@/components/account/ProfileForm'
  import SecuritySection from '@/components/account/SecuritySection'

  export default function AccountPage() {
    return (
      <div className="max-w-lg space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-white">Account</h1>
          <p className="mt-1 text-sm text-gray-400">Manage your profile and security settings</p>
        </div>
        <ProfileForm />
        <SecuritySection />
      </div>
    )
  }
  ```

- [ ] **Step 4: Verify manually**

  Navigate to `/account` while logged in.
  - Edit the name field and click "Save changes" → Sonner toast appears and the avatar initials + sidebar name update.
  - Click "Change password" → toast: "Password reset email sent to [email]".

- [ ] **Step 5: Run the full test suite one final time**

  ```bash
  cd apps/web && pnpm test
  ```

  Expected — all tests pass:
  ```
  ✓ src/test/smoke.test.ts (1)
  ✓ src/stores/__tests__/auth-store.test.ts (3)
  ✓ src/lib/__tests__/validations.test.ts (6)
  ✓ src/lib/__tests__/sort-workflows.test.ts (5)
  ✓ src/components/workflows/__tests__/StatusBadge.test.tsx (3)
  Test Files  5 passed (5)
  Tests       18 passed (18)
  ```

- [ ] **Step 6: Commit**

  ```bash
  git add apps/web/src/components/account/ apps/web/src/app/\(app\)/account/
  git commit -m "feat: add account page with profile edit and change password"
  ```

---

## Deliverable Checklist

Before calling Phase 1 complete, verify each item manually:

- [ ] `/login` — dark centered card, email + password, validation errors show inline, submit redirects to `/dashboard`
- [ ] `/register` — full name + email + passwords, mismatched password shows error under confirm field, submit redirects
- [ ] `/forgot-password` — email field, submit replaces form with "Check your inbox" confirmation
- [ ] `/dashboard` — 4 stat cards, indigo bar chart, activity feed with coloured dots, workflow preview table
- [ ] `/workflows` — sortable table with 6 rows, sort arrows flip on click, "+ New Workflow" shows toast
- [ ] `/account` — profile edit saves to store (sidebar name + initials update), "Change password" shows toast
- [ ] Refresh on any `/app/*` page — stays logged in (sessionStorage rehydrates)
- [ ] Sign out — redirects to `/login`, navigating back to `/dashboard` redirects to `/login`
- [ ] All 18 tests pass: `pnpm test`
