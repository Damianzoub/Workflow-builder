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
