# Phase 1 — Frontend Design Spec
# Damian Workflow Builder

**Date:** 2026-05-11
**Scope:** Frontend only. Backend API will be built separately in parallel; Phase 1 uses hardcoded mock data throughout.

---

## Goal

Deliver a fully navigable frontend shell: auth pages, a statistics dashboard, a workflows table, and an account page — all wired together with a dark sidebar layout and a Zustand auth store. No canvas or workflow editor in this phase.

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Charts | Recharts |
| Forms | react-hook-form + zod |
| State | Zustand (auth store only) |
| Data | Hardcoded mock — `src/mock/` |

---

## Visual Style

- **Theme:** Dark + persistent sidebar (Airia/Retool style)
- **Sidebar:** Fixed dark panel, logo top, nav links middle, user + sign-out bottom
- **Accent colour:** Indigo (`#6366f1`) as default — designed to be swapped per customer via a single Tailwind CSS variable
- **Background:** `#111827` (page), `#1f2937` (cards/sidebar), `#374151` (borders)

---

## Route Structure

```
app/
├── (auth)/                      ← centered card layout, no sidebar
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── forgot-password/page.tsx
├── (app)/                       ← dark sidebar layout, auth-guarded
│   ├── layout.tsx               ← AppShell: renders Sidebar + <main>
│   ├── dashboard/page.tsx
│   ├── workflows/page.tsx
│   └── account/page.tsx
└── page.tsx                     ← redirects → /dashboard or /login
```

**Auth guard:** `(app)/layout.tsx` reads `useAuthStore`. If `isLoggedIn` is false, it redirects to `/login`. No middleware needed for Phase 1.

---

## Pages

### Auth Pages — `/login`, `/register`, `/forgot-password`

All three share an `<AuthCard>` wrapper: dark page background, centered card, logo above, footer link below.

| Page | Fields | On Submit |
|---|---|---|
| Login | Email, Password | Sets mock user in Zustand → redirect `/dashboard` |
| Register | Full name, Email, Password, Confirm password | Sets mock user → redirect `/dashboard` |
| Forgot password | Email | Shows inline confirmation: "Check your inbox" |

Validation via zod schemas. Errors shown inline beneath each field. Submit button shows a loading spinner (simulated 800ms delay via `setTimeout`).

---

### Dashboard — `/dashboard`

Three visual zones stacked vertically:

**1. Stats row** — four `<StatCard>` components side by side:
- Total Workflows (neutral)
- Runs Today (indigo)
- Success Rate (green)
- Active Now (amber)

**2. Middle row** — two columns:
- Left: `<RunsChart>` — Recharts `BarChart`, 7-day runs-per-day data, indigo bars
- Right: `<ActivityFeed>` — list of recent workflow run events, coloured dot per status (green = success, red = error)

**3. Workflows preview** — `<WorkflowsPreview>`: compact 3-row table (Name, Last Modified, Creator) with a "View all →" link to `/workflows`.

---

### Workflows Page — `/workflows`

Header: page title "Workflows" + `<NewWorkflowButton>` ("+ New Workflow") aligned right. Button shows a "Coming soon" toast — canvas editor is Phase 2.

Full-width `<WorkflowsTable>`:

| Column | Type | Sortable |
|---|---|---|
| Name | text | yes |
| Created | date | yes |
| Last Modified | date | yes |
| Creator | email string | no |
| Status | `<StatusBadge>` | no |

Client-side sort: clicking a column header toggles asc/desc. Data from `mock/workflows.ts` (6 sample rows).

Row click is disabled in Phase 1 (canvas not built). Rows have a subtle hover state but no action.

---

### Account Page — `/account`

Two sections on a single page:

**Profile section**
- Avatar: circle with initials (generated from name), no image upload in Phase 1
- Full name: editable text field, pre-filled from `useAuthStore`
- Email: read-only display field
- Save button: updates the name in `useAuthStore`, shows "Profile updated" toast

**Security section**
- Heading: "Password"
- "Change Password" button → fires a mock toast: *"Password reset email sent to [user email]"*. Reuses the same conceptual flow as `/forgot-password` — no navigation needed since the email is already known.

---

## Component Tree

```
src/components/
├── layout/
│   ├── AppShell.tsx          ← Sidebar + <main> wrapper
│   └── Sidebar.tsx           ← nav links, logo, user footer
├── auth/
│   ├── AuthCard.tsx          ← shared card wrapper
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── ForgotPasswordForm.tsx
├── dashboard/
│   ├── StatCard.tsx
│   ├── RunsChart.tsx
│   ├── ActivityFeed.tsx
│   └── WorkflowsPreview.tsx
├── workflows/
│   ├── WorkflowsTable.tsx
│   ├── StatusBadge.tsx           ← active=green, draft=grey, error=red
│   └── NewWorkflowButton.tsx
└── account/
    ├── ProfileForm.tsx
    └── SecuritySection.tsx
```

---

## Mock Data

Located at `src/mock/`. Never imported by server components — only by client components or page files.

```ts
// src/mock/user.ts
export const mockUser = {
  id: "u1",
  name: "Damianos Zoumpos",
  email: "d.zoumpos04@gmail.com",
  avatarInitials: "DZ",
}

// src/mock/stats.ts
export const mockStats = {
  totalWorkflows: 24,
  runsToday: 142,
  successRate: 98,
  activeNow: 3,
  runsPerDay: [40, 85, 62, 110, 78, 142, 101], // Mon–Sun
}

// src/mock/activity.ts
export const mockActivity = [
  { id: "a1", workflow: "Booking Agent",    status: "success", time: "2h ago" },
  { id: "a2", workflow: "Support Bot",      status: "error",   time: "4h ago" },
  { id: "a3", workflow: "Email Classifier", status: "success", time: "6h ago" },
  { id: "a4", workflow: "Booking Agent",    status: "success", time: "8h ago" },
]

// src/mock/workflows.ts
export const mockWorkflows = [
  { id: "w1", name: "Booking Agent",    createdAt: "2026-05-10", modifiedAt: "2026-05-11", creator: "d.zoumpos04@gmail.com", status: "active" },
  { id: "w2", name: "Email Classifier", createdAt: "2026-05-09", modifiedAt: "2026-05-10", creator: "d.zoumpos04@gmail.com", status: "active" },
  { id: "w3", name: "Support Bot",      createdAt: "2026-05-08", modifiedAt: "2026-05-09", creator: "d.zoumpos04@gmail.com", status: "error"  },
  { id: "w4", name: "Lead Qualifier",   createdAt: "2026-05-07", modifiedAt: "2026-05-08", creator: "d.zoumpos04@gmail.com", status: "draft"  },
  { id: "w5", name: "Invoice Parser",   createdAt: "2026-05-06", modifiedAt: "2026-05-07", creator: "d.zoumpos04@gmail.com", status: "active" },
  { id: "w6", name: "Onboarding Flow",  createdAt: "2026-05-05", modifiedAt: "2026-05-06", creator: "d.zoumpos04@gmail.com", status: "draft"  },
]
```

---

## State Management

**`src/stores/auth-store.ts`** — Zustand store, the only global state in Phase 1.

```ts
interface AuthStore {
  user: MockUser | null
  isLoggedIn: boolean
  login: (user: MockUser) => void
  logout: () => void
}
```

- `login()` sets `user` + `isLoggedIn: true` + writes `"logged_in"` flag to `sessionStorage`
- `logout()` clears both, redirects to `/login`
- On store init, reads `sessionStorage` to rehydrate across page refreshes

No other global state. Dashboard stats, activity, and workflow data are imported directly from `src/mock/` as static constants.

---

## Deliverable

A running Next.js app (`pnpm dev`) where you can:

1. Register or log in with any credentials (mock accepts all)
2. See the dashboard with live-feeling stats, a bar chart, and activity feed
3. Navigate to Workflows and see the full sortable table
4. Visit Account, edit your name, and trigger a mock "password reset email sent" toast
5. Sign out and be redirected to login

The "+ New Workflow" button exists but shows "Coming soon" — the canvas editor is Phase 2.
