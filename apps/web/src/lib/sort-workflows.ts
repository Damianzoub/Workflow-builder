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
